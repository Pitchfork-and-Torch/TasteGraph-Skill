#!/usr/bin/env python3
"""Build public ingest stills grid from offline love-batch screenshots.

Copies + compresses every public-art still under
  ~/.grok/meta-collab-os/references/love-*
into wheel-app/public/ingest/ and writes ingest-stills.json
with credit + post URL when recoverable from contributing-sources
or evidence-map (no private paths in the public catalog).

Also indexes current featured pie examples under public/examples/
so the grid always includes the live wedge stills.
"""
from __future__ import annotations

import hashlib
import json
import re
import shutil
from collections import defaultdict
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]  # wheel-app
PUBLIC = ROOT / "public"
OUT_DIR = PUBLIC / "ingest"
OUT_JSON = PUBLIC / "ingest-stills.json"
EXAMPLES = PUBLIC / "examples"
CS_JSON = PUBLIC / "contributing-sources.json"
SLICES_JS = ROOT / "src" / "slices.js"

EVIDENCE_ROOT = Path.home() / ".grok" / "meta-collab-os" / "references"
EVIDENCE_MAP = EVIDENCE_ROOT / "evidence-map.json"

MAX_EDGE = 720
JPEG_QUALITY = 82
IMG_EXTS = {".jpg", ".jpeg", ".png", ".webp"}

# Batches that are public X love dumps (never personal photos)
LOVE_BATCH_GLOB = "love-*"


def load_json(path: Path):
    if not path.is_file():
        return None
    return json.loads(path.read_text(encoding="utf-8"))


def graph_version() -> str:
    text = SLICES_JS.read_text(encoding="utf-8")
    m = re.search(r'GRAPH_PUBLIC_VERSION\s*=\s*"([^"]+)"', text)
    return m.group(1) if m else "1.0.0"


def load_featured_examples() -> list[dict]:
    """Parse featured stills from slices.js (src, caption, credit, href, register)."""
    text = SLICES_JS.read_text(encoding="utf-8")
    # Split on slice id blocks roughly
    items: list[dict] = []
    current_id = None
    for m in re.finditer(
        r'id:\s*"([a-z]+)"|'
        r'\{\s*src:\s*"([^"]+)"\s*,\s*caption:\s*"([^"]*)"\s*,\s*'
        r'credit:\s*"([^"]*)"\s*,\s*href:\s*"([^"]*)"\s*,?\s*\}',
        text,
    ):
        if m.group(1):
            current_id = m.group(1)
            continue
        if not current_id:
            continue
        src, caption, credit, href = m.group(2), m.group(3), m.group(4), m.group(5)
        items.append(
            {
                "src": src,
                "title": caption,
                "credit": credit,
                "href": href,
                "registers": [current_id],
                "featured": True,
                "batch": "featured-wheel",
            }
        )
    return items


def index_contributing(cs: dict | None) -> tuple[dict, dict]:
    """post_id -> item, handle_lower -> list of items."""
    by_id: dict[str, dict] = {}
    by_handle: dict[str, list[dict]] = defaultdict(list)
    if not cs:
        return by_id, by_handle
    for it in cs.get("items") or []:
        pid = str(it.get("post_id") or "").strip()
        if pid:
            by_id[pid] = it
        h = str(it.get("handle") or "").lstrip("@").lower()
        if h:
            by_handle[h].append(it)
    return by_id, by_handle


def index_evidence_map() -> dict[str, dict]:
    """post_id -> evidence item (with batch id)."""
    out: dict[str, dict] = {}
    raw = load_json(EVIDENCE_MAP)
    if not raw:
        return out
    for batch in raw.get("batches") or []:
        bid = batch.get("id") or batch.get("folder") or ""
        for it in batch.get("items") or []:
            pid = str(it.get("post_id") or "").strip()
            if not pid:
                continue
            row = dict(it)
            row["_batch"] = bid
            out[pid] = row
    return out


def normalize_handle(h: str) -> str:
    return re.sub(r"[^a-z0-9_]", "", (h or "").lstrip("@").lower())


def pick_best_source(cands: list[dict]) -> dict | None:
    """Prefer featured image posts, then lower priority number, then first."""
    if not cands:
        return None
    if len(cands) == 1:
        return cands[0]

    def rank(it: dict) -> tuple:
        kind = 0 if str(it.get("kind") or "") == "image" else 1
        featured = 0 if it.get("featured") else 1
        try:
            pri = int(it.get("priority") if it.get("priority") is not None else 9)
        except (TypeError, ValueError):
            pri = 9
        return (featured, kind, pri, str(it.get("post_id") or ""))

    return sorted(cands, key=rank)[0]


def fuzzy_handle_matches(token: str, by_handle: dict[str, list[dict]]) -> list[dict]:
    """Match stem token to catalog handles (exact, prefix, or contained)."""
    h = normalize_handle(token)
    if not h or len(h) < 3:
        return []
    if h in by_handle:
        return list(by_handle[h])
    hits: list[dict] = []
    seen = set()
    for handle, items in by_handle.items():
        if handle.startswith(h) or h.startswith(handle) or h in handle or handle in h:
            # avoid tiny accidental overlaps (e.g. "art" in everything)
            if min(len(h), len(handle)) < 4 and handle != h:
                continue
            for it in items:
                pid = str(it.get("post_id") or id(it))
                if pid in seen:
                    continue
                seen.add(pid)
                hits.append(it)
    return hits


def match_post_strict(
    path: Path,
    by_id: dict[str, dict],
    by_handle: dict[str, list[dict]],
) -> dict | None:
    """High-confidence match only (safe for post_id dedupe).

    Dump stills: handle-last6digits of the status id.
    Descriptive names: exact unique catalog handle on the first stem token only.
    Never fuzzy-prefix match here - that collapses multi-still artist packs.
    """
    stem = path.stem
    # dump style: handle-last6digits
    m = re.match(r"^(?P<handle>.+)-(?P<tail>\d{5,6})$", stem)
    if m:
        tail = m.group("tail")
        hits = [it for pid, it in by_id.items() if pid.endswith(tail)]
        if len(hits) == 1:
            return hits[0]
        h = normalize_handle(m.group("handle"))
        for it in hits:
            if normalize_handle(str(it.get("handle") or "")) == h:
                return it
        fuzzy = fuzzy_handle_matches(m.group("handle"), by_handle)
        for it in hits:
            ih = normalize_handle(str(it.get("handle") or ""))
            if any(normalize_handle(str(f.get("handle") or "")) == ih for f in fuzzy):
                return it
        if len(hits) == 1:
            return hits[0]
        return None

    # exact unique handle on first token only
    token = re.split(r"[-_]", stem)[0]
    h = normalize_handle(token)
    cands = by_handle.get(h) or []
    if len(cands) == 1:
        return cands[0]
    return None


def enrich_source_soft(
    path: Path,
    by_handle: dict[str, list[dict]],
) -> dict | None:
    """Best-effort credit + URL for display only (does not drive post_id dedupe)."""
    stem = path.stem
    parts = re.split(r"[-_]", stem)
    for token in parts[:2]:
        cands = fuzzy_handle_matches(token, by_handle)
        if cands:
            return pick_best_source(cands)
    return None


def compress_to(src: Path, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(src) as im:
        im = im.convert("RGB")
        w, h = im.size
        scale = min(1.0, MAX_EDGE / max(w, h))
        if scale < 1.0:
            im = im.resize((max(1, int(w * scale)), max(1, int(h * scale))), Image.Resampling.LANCZOS)
        dest_jpg = dest.with_suffix(".jpg")
        im.save(dest_jpg, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)


def slug_for(path: Path, batch: str) -> str:
    stem = re.sub(r"[^a-zA-Z0-9._-]+", "-", path.stem).strip("-").lower()
    return f"{batch}/{stem}.jpg"


def file_sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def series_key(batch: str, path: Path) -> str | None:
    """Collapse multi-frame animation / SS dumps into one grid cell.

    Confidential-file style packs, *-ss00 sequence grabs, and closed/open/file
    state variants of the same product still are one taste signal, not N cells.
    """
    stem = path.stem.lower()

    # Explicit: AdityaSur confidential-file free animation (many SS frames)
    if stem.startswith("aditya-") and (
        "confidential" in stem
        or re.match(r"aditya-ss\d+$", stem)
        or stem in {"aditya-test"}
    ):
        return f"{batch}::series:aditya-confidential"

    # Explicit: mnowak cinematic dashboard multi-frame capture
    if stem.startswith("mnowak-") and (
        "cinematic" in stem or re.match(r"mnowak-ss\d+$", stem)
    ):
        return f"{batch}::series:mnowak-cinematic"

    # Generic screenshot frame packs: name-ss00, name-ss01, ...
    m = re.match(r"^([a-z0-9_]+)-ss\d+$", stem)
    if m:
        return f"{batch}::series:{m.group(1)}-ss"

    # closed / open / file / file-b / test state variants of one object still
    m = re.match(r"^([a-z0-9_]+)-(closed|open|file|file-b|test)$", stem)
    if m:
        return f"{batch}::series:{m.group(1)}-state"

    # Alternate clean/b twin captures of the same plate (elaya-clean vs -b, etc.)
    m = re.match(r"^([a-z0-9_]+)-(clean|b|c)$", stem)
    if m:
        return f"{batch}::series:{m.group(1)}-alt"

    return None


def pick_score(path: Path, matched: dict | None, file_size: int) -> tuple:
    """Higher is better representative for a series / hash group."""
    stem = path.stem.lower()
    is_ss = 1 if re.search(r"-ss\d+$", stem) else 0
    is_test = 1 if stem.endswith("-test") else 0
    is_alt = 1 if re.search(r"-(b|c|clean)$", stem) else 0
    # Prefer open / full file frame over closed for product demos
    open_bonus = 0
    if "open" in stem:
        open_bonus = 3
    elif re.search(r"-file(?!-b)", stem) and "closed" not in stem:
        open_bonus = 2
    elif "closed" in stem:
        open_bonus = 0
    featured = 1 if matched and matched.get("featured") else 0
    has_match = 1 if matched else 0
    has_href = 1 if matched and matched.get("url") else 0
    return (featured, has_match, has_href, open_bonus, -is_ss, -is_test, -is_alt, file_size)


def choose_winners(cands: list[dict]) -> list[dict]:
    """Dedupe by content hash, post_id/href, then multi-frame series key."""
    # 1) Exact bytes
    by_hash: dict[str, dict] = {}
    for c in cands:
        prev = by_hash.get(c["sha"])
        if prev is None or c["score"] > prev["score"]:
            by_hash[c["sha"]] = c
    stage = list(by_hash.values())

    # 2) Same public post id only (never soft-matched href - that collapses artist packs)
    by_post: dict[str, dict] = {}
    no_post: list[dict] = []
    for c in stage:
        pid = str(c.get("post_id") or "").strip()
        if not pid:
            no_post.append(c)
            continue
        prev = by_post.get(pid)
        if prev is None or c["score"] > prev["score"]:
            by_post[pid] = c
    stage = list(by_post.values()) + no_post

    # 3) Multi-frame series collapse
    by_series: dict[str, dict] = {}
    no_series: list[dict] = []
    for c in stage:
        sk = c.get("series")
        if not sk:
            no_series.append(c)
            continue
        prev = by_series.get(sk)
        if prev is None or c["score"] > prev["score"]:
            by_series[sk] = c
    winners = list(by_series.values()) + no_series

    # Stable order later; return unsorted
    return winners


def main() -> int:
    cs = load_json(CS_JSON) or {}
    by_id, by_handle = index_contributing(cs)
    evidence_by_id = index_evidence_map()
    version = graph_version()

    if OUT_DIR.exists():
        shutil.rmtree(OUT_DIR)
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    items: list[dict] = []
    seen_src: set[str] = set()

    # 1) Offline love-batch stills (dedupe before compress)
    candidates: list[dict] = []
    if EVIDENCE_ROOT.is_dir():
        for batch_dir in sorted(EVIDENCE_ROOT.glob(LOVE_BATCH_GLOB)):
            if not batch_dir.is_dir():
                continue
            batch = batch_dir.name
            files = [
                p
                for p in batch_dir.rglob("*")
                if p.is_file()
                and p.suffix.lower() in IMG_EXTS
                and "private" not in {part.lower() for part in p.relative_to(batch_dir).parts}
            ]
            files.sort(key=lambda p: p.as_posix().lower())
            for src in files:
                try:
                    sha = file_sha256(src)
                except OSError as exc:
                    print(f"[skip] hash {src}: {exc}")
                    continue
                matched = match_post_strict(src, by_id, by_handle)
                soft = None if matched else enrich_source_soft(src, by_handle)
                src_meta = matched or soft
                # post_id only from strict match - soft credit must not collapse packs
                pid = str((matched or {}).get("post_id") or "") if matched else ""
                handle = str((src_meta or {}).get("handle") or "")
                href = str((src_meta or {}).get("url") or "")
                title = src.stem.replace("-", " ").replace("_", " ")
                registers: list[str] = []
                kind = "image"
                if src_meta:
                    # Prefer catalog title only when strict (unique post), else keep still name
                    if matched:
                        title = str(matched.get("title") or title)
                    registers = list(src_meta.get("registers") or [])
                    kind = str(src_meta.get("kind") or "image")
                    if not href and pid and handle:
                        href = f"https://x.com/{handle}/status/{pid}"
                if pid and pid in evidence_by_id and not registers:
                    pass
                # Prefer catalog title for known confidential pack
                sk = series_key(batch, src)
                if sk and sk.endswith("aditya-confidential") and not matched:
                    title = "Confidential file animation free #1"
                    handle = handle or "AdityaSur11"
                    href = href or "https://x.com/AdityaSur11/status/2084844344259776904"
                    pid = pid or "2084844344259776904"
                    registers = registers or ["defensive", "pro"]
                elif sk and sk.endswith("mnowak-cinematic") and not matched:
                    title = "Cinematic dashboards"
                    handle = handle or "mnowakdesign"
                    href = href or "https://x.com/mnowakdesign/status/2084611335346925670"
                    pid = pid or "2084611335346925670"
                    registers = registers or ["defensive", "pro", "motion"]

                size = src.stat().st_size
                candidates.append(
                    {
                        "src_path": src,
                        "batch": batch,
                        "sha": sha,
                        "series": sk,
                        "score": pick_score(src, matched, size),
                        "post_id": pid or None,
                        "handle": handle,
                        "href": href,
                        "title": title,
                        "registers": registers,
                        "kind": kind if kind in ("image", "video") else "image",
                        "featured": bool(matched and matched.get("featured")),
                        "stem": src.stem,
                    }
                )

        before = len(candidates)
        winners = choose_winners(candidates)
        dropped = before - len(winners)
        print(f"[dedupe] candidates={before} winners={len(winners)} dropped={dropped}")

        for c in winners:
            src: Path = c["src_path"]
            batch = c["batch"]
            rel_slug = slug_for(src, batch)
            dest = OUT_DIR / rel_slug
            try:
                compress_to(src, dest)
            except Exception as exc:  # noqa: BLE001
                print(f"[skip] {src}: {exc}")
                continue
            public_src = f"ingest/{rel_slug}"
            seen_src.add(public_src)
            credit = f"@{c['handle']}" if c["handle"] else ""
            items.append(
                {
                    "id": f"{batch}/{c['stem']}",
                    "src": public_src,
                    "title": c["title"],
                    "credit": credit,
                    "href": c["href"],
                    "kind": c["kind"],
                    "batch": batch,
                    "registers": c["registers"],
                    "featured": c["featured"],
                    "post_id": c["post_id"],
                }
            )

    # 2) Featured wheel examples - prefer existing ingest row by href/post_id
    for ex in load_featured_examples():
        src = str(ex["src"]).lstrip("/")
        href = str(ex.get("href") or "")
        credit = str(ex.get("credit") or "")
        title = str(ex.get("title") or Path(src).stem)
        regs_new = list(ex.get("registers") or [])

        matched_item = None
        if href:
            for it in items:
                if it.get("href") == href:
                    matched_item = it
                    break
        if matched_item is None and credit:
            h = credit.lstrip("@").lower()
            cands = [
                it
                for it in items
                if str(it.get("credit") or "").lstrip("@").lower() == h
            ]
            if len(cands) == 1:
                matched_item = cands[0]

        if matched_item is not None:
            matched_item["featured"] = True
            regs = set(matched_item.get("registers") or [])
            regs.update(regs_new)
            matched_item["registers"] = sorted(regs)
            # Prefer pie caption + credit
            if title:
                matched_item["title"] = title
            if credit:
                matched_item["credit"] = credit
            if href:
                matched_item["href"] = href
            continue

        if src in seen_src:
            continue
        disk = PUBLIC / src
        if not disk.is_file():
            print(f"[warn] featured missing: {src}")
            continue
        seen_src.add(src)
        items.append(
            {
                "id": f"featured/{Path(src).stem}",
                "src": src,
                "title": title,
                "credit": credit,
                "href": href,
                "kind": "image",
                "batch": "featured-wheel",
                "registers": regs_new,
                "featured": True,
                "post_id": None,
            }
        )

    # Prefer newest batches first, then featured last already appended
    batch_rank = {
        "love-2026-08-07-dump": 0,
        "love-2026-08-06-dump": 1,
        "love-2026-08-05-evening": 2,
        "love-2026-08-05-kali": 3,
        "love-2026-08-04-batch3": 4,
        "love-2026-08-04-batch2": 5,
        "love-2026-08-04": 6,
        "featured-wheel": 9,
    }
    items.sort(
        key=lambda it: (
            batch_rank.get(str(it.get("batch") or ""), 8),
            0 if it.get("featured") else 1,
            str(it.get("title") or "").lower(),
        )
    )

    catalog = {
        "schema": "tastegraph-ingest-stills-v1",
        "graph_version": version,
        "updated": "2026-08-07",
        "policy": (
            "Public-art stills only (screenshots of public X posts that informed TasteGraph). "
            "Credit + post URL when recoverable. No private paths."
        ),
        "count": len(items),
        "counts_by_batch": {},
        "items": items,
    }
    for it in items:
        b = str(it.get("batch") or "unknown")
        catalog["counts_by_batch"][b] = catalog["counts_by_batch"].get(b, 0) + 1

    OUT_JSON.write_text(json.dumps(catalog, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    total_bytes = sum(p.stat().st_size for p in OUT_DIR.rglob("*") if p.is_file())
    print(f"[ok] {len(items)} stills -> {OUT_JSON.relative_to(ROOT)}")
    print(f"[ok] thumbs in {OUT_DIR.relative_to(ROOT)} ({total_bytes / 1e6:.2f} MB)")
    for b, n in sorted(catalog["counts_by_batch"].items(), key=lambda x: -x[1]):
        print(f"     {b}: {n}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

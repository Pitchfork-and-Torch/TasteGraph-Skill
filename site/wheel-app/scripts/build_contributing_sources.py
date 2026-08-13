#!/usr/bin/env python3
"""Build public contributing-sources.json from offline evidence-map + Kali dump IDs."""
from __future__ import annotations

import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]  # tastegraph-skill
EVIDENCE = Path.home() / ".grok" / "meta-collab-os" / "references" / "evidence-map.json"

# Kali Things dump (status IDs from screenshots / harvest). Public only.
# handle, post_id, kind, title, registers, nodes, priority (0=P0 .. 3=ambient)
KALI: list[tuple] = [
    ("lyn_beatz", "2084684737533337643", "image", "Motoko cyber portrait", ["fashion"], ["art.cyber_motoko_portrait"], 2),
    ("Julianc_AI2", "2084780712176103667", "image", "Feel the wrath", ["fashion"], ["art.fashion_wrath_figure"], 2),
    ("VideoArtGame", "2084746195759706231", "video", "Pixel art Dark Souls", ["sketch", "speculative"], ["art.pixel_dark_souls"], 2),
    ("creativedash", "2085012706302800313", "video", "UI8 portfolio physics / Forge", ["motion", "pro"], ["mot.portfolio_physics"], 0),
    ("_sameerrr0", "2084980238618923374", "video", "Delete what users don't need", ["pro"], ["proc.ux_delete_first"], 1),
    ("Ultima1138", "2084683156586631230", "image", "RESPAWN void figure", ["music", "speculative"], ["art.respawn_void_field"], 2),
    ("Paper_4k", "2084923695168925913", "image", "Dark character still", ["speculative", "fashion"], [], 2),
    ("deltasauce", "2084956146842935487", "image", "Forever pushing climb", ["music"], [], 3),
    ("grailsart", "2084773169244652001", "image", "AI art still", ["speculative"], [], 2),
    ("Delahuntagram", "2084840567515521344", "image", "Low key product ring", ["pro", "myth"], ["ix.object_as_hero"], 2),
    ("blizaine", "2084499916441768313", "video", "Maestro v1.5.5 MiniMax H3", ["motion"], ["tool.maestro_local_h3"], 0),
    ("koldo2k", "2084878315245154558", "video", "Morning coffee break", ["music"], [], 3),
    ("iamtanzil_", "2084864298615218473", "video", "jiro scrub-progress finance hero", ["motion", "pro"], ["mot.scroll_scrub_hero"], 0),
    ("elayadesigns", "2084908433950785757", "video", "Hero with Higgsfield Kling 3", ["motion"], ["mot.kling3_hero_plate"], 0),
    ("Delahuntagram", "2084852646477721741", "image", "mac classic glass 3D", ["myth", "pro"], ["ix.object_as_hero"], 2),
    ("Delahuntagram", "2084858686070264101", "image", "mac classic statue 3D", ["myth"], ["ix.object_as_hero"], 2),
    ("AdityaSur11", "2084919839634919717", "video", "Physics based component", ["motion", "pro"], ["mot.portfolio_physics"], 1),
    ("rcharl03", "2084908262584123531", "video", "Footer Framer shaders", ["pro"], ["tool.framer_shaders"], 0),
    ("Delahuntagram", "2084653332988322293", "image", "joker hat 3D toy", ["myth", "fashion"], [], 2),
    ("Mechanismo0", "2084866860671983693", "image", "Good Morning craft still", ["music", "speculative"], [], 3),
    ("goo_vision", "2084942156586680798", "image", "Gm typewriter still", ["music"], [], 3),
    ("maze9ne", "2084977313364545911", "image", "GOOD MORNING still", ["music"], [], 3),
    ("OVolosin82152", "2084928141269610556", "image", "midjourney still", ["speculative"], [], 2),
    ("Mechanismo0", "2084610301119652348", "image", "Mechanismo still", ["speculative"], [], 2),
    ("grailsart", "2084872264550420947", "image", "grailsart still", ["speculative"], [], 2),
    ("mendezmendez", "2084938784991244640", "image", "swept floors flowers morning", ["music"], [], 2),
    ("julianc_ai2", "2084763102764060829", "image", "Seems familiar UFO", ["speculative"], [], 2),
    ("yaojadzn", "2084660510327259473", "image", "Good morning", ["music"], [], 3),
    ("GothicAndArt", "2084880144980705575", "image", "Gothic plant still", ["sketch", "music"], [], 2),
    ("MaNiCArt_", "2084795256441078009", "video", "NO HUMAN INTERFACE glitch", ["fashion", "pro"], ["art.glitch_no_ui"], 1),
    ("GalacticStones", "2084771252519215534", "image", "Stone product still", ["myth"], ["ix.object_as_hero"], 2),
    ("AdityaSur11", "2084844344259776904", "video", "Confidential file animation free #1", ["defensive", "pro"], ["ui.confidential_file_chrome"], 0),
    ("matterAfactART", "2084712672365346823", "image", "head collector figure", ["speculative", "fashion"], [], 2),
    ("Paper_4k", "2084795222676967490", "image", "Red vehicle still", ["speculative"], [], 2),
    ("socoloffalex", "2084922961900028025", "video", "Brand identity reveal sneak peek", ["pro", "fashion"], ["proc.brand_long_think"], 1),
    ("Paper_4k", "2084782392842105083", "image", "Paper_4k still", ["speculative"], [], 2),
    ("KatanaAether", "2084375250515722272", "image", "KatanaAether still", ["speculative", "myth"], [], 2),
    ("Haaich", "2084524146814235064", "image", "Sanctify", ["music", "speculative"], [], 2),
    ("alihankairos", "2084550842384838709", "image", "KAIROS still", ["speculative"], [], 2),
    ("kiu_xo", "2084614577845661745", "image", "back to france still", ["music", "fashion"], [], 2),
    ("gizakdag", "2084723190257828120", "video", "Life Part 2", ["music", "speculative"], [], 2),
    ("pilgrim_wander", "2084618486886621430", "image", "Star Samurai", ["myth", "speculative"], ["art.star_samurai_armor"], 2),
    ("piotrbinkowski", "2084642435175473662", "image", "Sacred tech objects", ["myth", "speculative"], ["art.sacred_technical_object"], 1),
    ("BoredJosei", "2084632296397918651", "image", "The Good Shepherd", ["music", "speculative"], [], 2),
    ("Mechanismo0", "2084739295978406179", "image", "Mechanismo still", ["speculative"], [], 2),
    ("GITG_Art", "2084754840450973836", "image", "GHOST IN THE GENERATOR", ["speculative", "fashion"], [], 2),
    ("AlexAperios", "2084671183010627661", "video", "Branding projects reel", ["pro", "fashion"], [], 1),
    ("grailsart", "2084657043806224622", "image", "Snake still", ["speculative"], [], 2),
    ("mnowakdesign", "2084611335346925670", "video", "Cinematic dashboards", ["defensive", "pro", "motion"], ["ui.cinematic_dashboard"], 0),
    ("neomechanica", "2084664909518782628", "image", "Mecha still", ["speculative"], [], 2),
    ("daman76752", "2084699638066463005", "image", "pixel art love", ["sketch"], [], 2),
    ("maze9ne", "2084573632106316183", "image", "GM still", ["music"], [], 3),
    ("nolon69", "2084816571961094352", "image", "nolon still", ["speculative"], [], 2),
    ("__causasui", "2084646422130135501", "video", "Basketball dunk still", ["motion", "fashion"], [], 2),
    ("psyhiris", "2084776404172902551", "image", "Mountainside landscape", ["music", "sketch"], [], 2),
    ("NastyStizi", "2084635358793240985", "image", "gm figure trio", ["fashion"], [], 3),
]

# OCR truncations / digit swaps recovered 2026-08-05
ID_FIXES = {
    "2084919839634919177": "2084919839634919717",  # AdityaSur physics
    "2084878315245145558": "2084878315245154558",  # koldo2k coffee
    "208486860671983693": "2084866860671983693",  # Mechanismo0 GM
    "2084723319025782812": "2084723190257828120",  # gizakdag Life pt2
    "2084550842338483709": "2084550842384838709",  # alihankairos
}
# Truncated / unrecoverable IDs to drop
DROP_IDS = {
    "208470880190346089",  # grailsart OCR truncated; keep other grailsart entries
}

FEATURED = {
    # 1.3.14 pie wedge ship (08-18 dump)
    "2089468849880203690",  # m_tomorrowland music
    "2088684778077757532",  # LouVisual motel music
    "2089689362384707807",  # BenjaminUIX hill music
    "2089790980673143261",  # Synthetic_Copy stone myth
    "2089731093796712952",  # machineviolence motorcycle myth
    "2089544756300816493",  # Synthetic_Copy less screen myth
    "2088919250392027272",  # LouVisual Dryad sketch
    "2088464674064826878",  # AnasAbdin pixel sketch
    "2088723221113983078",  # ramenya6 warmth sketch
    "2084611335346925670",  # mnowak cinematic dash defensive
    "2089706379070304730",  # AdityaSur 3d folder defensive
    "2089745841779347839",  # threejs liquid glass motion
    "2088992022111854765",  # AlbiaHossain html-in-canvas motion
    "2088492083451396215",  # insporadesign 3d rolling motion
    "2089732187847262617",  # doganuraldesign gel icons pro
    "2088912827058909599",  # JayBorda type pro
    "2089121936173367764",  # sitenley BoardUI pro
    "2089744882973712389",  # goo_vision aquatic speculative
    "2088843196142923858",  # machineviolence heli speculative
    "2088540558436319350",  # neropursue type landscape speculative
    "2088849955893170687",  # Palakonweb chrome hand fashion
    "2089085522295574602",  # AnglsAI renaissance fashion
    "2089712167192805815",  # LouVisual Kismet fashion
}
PRIVATE_HANDLES = {"suddenlyjon"}


def nodes_to_registers(nodes: list[str]) -> list[str]:
    regs: set[str] = set()
    for n in nodes:
        nl = n.lower()
        if any(k in nl for k in ("myth", "sacred", "samurai", "anachron", "object_as")):
            regs.update(["myth", "speculative"])
        if any(k in nl for k in ("music", "void", "gothic", "road", "horror", "respawn")):
            regs.add("music")
        if any(k in nl for k in ("travel", "sketch", "watercolor", "aerial", "pixel", "ink")):
            regs.add("sketch")
        if any(k in nl for k in ("ui.", "dashboard", "serif", "confidential", "astro", "brand", "footer", "knowledge_graph")):
            regs.update(["pro", "defensive"])
        if any(k in nl for k in ("mot.", "film", "physics", "kling", "scroll", "maestro", "relax")):
            regs.add("motion")
        if any(k in nl for k in ("fashion", "beauty", "cyber", "motoko", "wrath", "glitch", "portrait_weird", "slow_dance")):
            regs.add("fashion")
        if any(k in nl for k in ("troy", "library", "horror", "myth_epic")):
            regs.update(["myth", "speculative"])
        if any(k in nl for k in ("pattern", "sref", "topaz", "style_variant")):
            regs.add("pro")
        if n.startswith("art.") and not regs:
            regs.add("speculative")
    return sorted(regs)


def main() -> None:
    ev = json.loads(EVIDENCE.read_text(encoding="utf-8")) if EVIDENCE.exists() else {"batches": []}
    items: list[dict] = []
    seen: set[str] = set()

    def add(item: dict) -> None:
        key = item.get("url") or f"{item.get('handle')}:{item.get('post_id')}"
        if not key or key in seen:
            return
        seen.add(key)
        items.append(item)

    for b in ev.get("batches", []):
        bid = b.get("id", "")
        for it in b.get("items", []):
            if it.get("public") is False:
                continue
            h = str(it.get("handle", "")).lstrip("@")
            if h.lower() in PRIVATE_HANDLES:
                continue
            pid = it.get("post_id")
            if pid is not None:
                pid = str(pid)
                if pid in DROP_IDS:
                    continue
                pid = ID_FIXES.get(pid, pid)
            url = it.get("url")
            if pid and h:
                url = f"https://x.com/{h}/status/{pid}"
            elif not url and h:
                url = f"https://x.com/{h}"
            # rewrite fixed ids into url
            if url:
                for bad, good in ID_FIXES.items():
                    url = url.replace(bad, good)
                for bad in DROP_IDS:
                    if bad in url:
                        url = None
                        break
            if not url:
                continue
            nodes = it.get("nodes") or []
            regs = nodes_to_registers(nodes) or ["speculative"]
            kind = it.get("kind") or "image"
            pri = it.get("priority")
            if pri is None:
                pri = 2
            add(
                {
                    "handle": h,
                    "url": url,
                    "post_id": str(pid) if pid else None,
                    "kind": kind,
                    "title": it.get("title") or it.get("note") or f"@{h}",
                    "batch": bid,
                    "registers": regs,
                    "nodes": nodes,
                    "priority": int(pri),
                    "featured": False,
                }
            )

    for h, pid, kind, title, regs, nodes, pri in KALI:
        url = f"https://x.com/{h}/status/{pid}"
        existing = next((x for x in items if x.get("post_id") == pid or x.get("url") == url), None)
        payload = {
            "handle": h.lstrip("@"),
            "url": url,
            "post_id": pid,
            "kind": kind,
            "title": title,
            "batch": "kali-2026-08-05",
            "registers": regs,
            "nodes": nodes or (existing.get("nodes") if existing else []) or [],
            "priority": pri,
            "featured": False,
        }
        if existing:
            existing.update({k: v for k, v in payload.items() if v is not None and v != []})
        else:
            add(payload)

    for it in items:
        if it.get("post_id") in FEATURED:
            it["featured"] = True
        if it.get("post_id") is None:
            it.pop("post_id", None)

    batch_order = {
        "love-2026-08-18-dump": 0,
        "love-2026-08-11-dump": 1,
        "love-2026-08-10-dump": 2,
        "love-2026-08-08-dump": 3,
        "love-2026-08-07-dump": 4,
        "love-2026-08-06-dump": 5,
        "love-2026-08-05-evening": 6,
        "kali-2026-08-05": 7,
        "batch3": 8,
        "batch2": 9,
        "batch1": 10,
    }
    items.sort(
        key=lambda x: (
            0 if x.get("featured") else 1,
            batch_order.get(x.get("batch"), 9),
            x.get("priority", 9),
            x.get("handle") or "",
        )
    )

    out = {
        "schema": "tastegraph-contributing-sources-v1",
        "graph_version": "1.3.14",
        "updated": "2026-08-18",
        "policy": (
            "Public handles + post URLs only. Every art/image/video/craft post that informed "
            "the living graph should appear here. Featured = currently shown as pie stills."
        ),
        "count": len(items),
        "counts_by_kind": dict(Counter(i.get("kind", "other") for i in items)),
        "items": items,
    }

    text = json.dumps(out, indent=2, ensure_ascii=False) + "\n"
    targets = [
        Path(__file__).resolve().parents[1] / "public" / "contributing-sources.json",
        ROOT / "site" / "public" / "wheel" / "contributing-sources.json",
        Path.home() / ".grok" / "meta-collab-os" / "references" / "contributing-sources.json",
    ]
    for p in targets:
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(text, encoding="utf-8")
        print(f"wrote {p} n={out['count']}")

    # Expand offline evidence-map kali with non-ambient posts missing post_id
    kali_batch = next((b for b in ev.get("batches", []) if b.get("id") == "kali-2026-08-05"), None)
    if kali_batch is not None:
        have = {str(i.get("post_id")) for i in kali_batch.get("items", []) if i.get("post_id")}
        added = 0
        for h, pid, kind, title, regs, nodes, pri in KALI:
            if pid in have or pri > 2:
                continue
            kali_batch["items"].append(
                {
                    "handle": h,
                    "post_id": pid,
                    "url": f"https://x.com/{h}/status/{pid}",
                    "nodes": nodes or [f"taste.{kind}_signal"],
                    "title": title,
                }
            )
            added += 1
        EVIDENCE.write_text(json.dumps(ev, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print(f"evidence-map kali added {added} total {len(kali_batch['items'])}")

    print("kinds", out["counts_by_kind"])


if __name__ == "__main__":
    main()

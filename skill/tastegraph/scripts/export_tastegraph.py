#!/usr/bin/env python3
"""Export a TasteGraph JSON to Markdown, system prompt, or collaboration brief."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path


def load(path: Path) -> dict:
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def bullets(nodes, key_label="label"):
    lines = []
    for n in nodes or []:
        lab = n.get(key_label) or n.get("id")
        desc = n.get("description") or n.get("instruction") or ""
        cat = n.get("category")
        prefix = f"[{cat}] " if cat else ""
        if desc:
            lines.append(f"- {prefix}**{lab}**: {desc}")
        else:
            lines.append(f"- {prefix}**{lab}**")
    return "\n".join(lines) if lines else "- (none)"


def export_md(data: dict) -> str:
    m = data.get("metadata") or {}
    parts = [
        f"# TasteGraph {m.get('graph_version', '')}",
        m.get("title") or "",
        "",
        f"**North star:** {data.get('north_star', '')}",
        "",
        f"_Updated {m.get('updated')} · domains: {', '.join(m.get('domains') or [])}_",
        "",
        "## Core identity",
        bullets(data.get("core_identity")),
        "",
        "## Emotional registers",
        bullets(data.get("emotional_registers")),
        "",
        "## Hard loves",
        bullets(data.get("hard_loves")),
        "",
        "## Hard antis",
        bullets(data.get("hard_antis")),
        "",
        "## Motion stack",
    ]
    for s in data.get("motion_stack") or []:
        parts.append(f"{s.get('order')}. **{s.get('label')}** - {s.get('description', '')}")
    parts += [
        "",
        "## Density by surface",
    ]
    for d in data.get("density_by_surface") or []:
        parts.append(f"- **{d.get('surface')}**: {d.get('density')} - {d.get('notes', '')}")
    parts += ["", "## Color temperature"]
    for c in data.get("color_temperature") or []:
        accents = ", ".join(c.get("accents") or [])
        parts.append(f"- **{c.get('register')}**: {c.get('temperature')} ({accents})")
    parts += ["", "## Process values", bullets(data.get("process_values")), ""]
    tags = data.get("quick_tags") or []
    parts += ["## Quick tags", ", ".join(f"`{t}`" for t in tags) if tags else "- (none)", ""]
    parts += ["## Collaboration protocol"]
    for step in data.get("collaboration_protocol") or []:
        parts.append(f"{step.get('step')}. **{step.get('title', '')}**: {step.get('instruction', '')}")
    parts += ["", "## Recent evidence (anonymized)"]
    for e in (data.get("evidence_log") or [])[-12:]:
        parts.append(
            f"- `{e.get('id')}` {e.get('date')} · {e.get('affect')} · {e.get('summary')}"
        )
    parts.append("")
    return "\n".join(parts)


def export_system_prompt(data: dict) -> str:
    m = data.get("metadata") or {}
    lines = [
        f"TASTEGRAPH SYSTEM PROMPT (v{m.get('graph_version')})",
        "Role: generate or critique work under a fixed personal taste graph.",
        "",
        "NORTH STAR",
        data.get("north_star") or "",
        "",
        "CORE IDENTITY",
    ]
    for n in data.get("core_identity") or []:
        lines.append(f"- {n.get('label')}: {n.get('description', '')}")
    lines += ["", "REGISTERS (pick one first)"]
    for n in data.get("emotional_registers") or []:
        lines.append(f"- {n.get('label')}: {n.get('description', '')}")
    lines += ["", "HARD LOVES (prefer)"]
    for n in data.get("hard_loves") or []:
        lines.append(f"- [{n.get('category')}] {n.get('label')}: {n.get('description', '')}")
    lines += ["", "HARD ANTIS (never)"]
    for n in data.get("hard_antis") or []:
        lines.append(f"- [{n.get('category')}] {n.get('label')}: {n.get('description', '')}")
    lines += ["", "MOTION STACK (escalation order)"]
    for s in data.get("motion_stack") or []:
        lines.append(f"{s.get('order')}. {s.get('label')}: {s.get('description', '')}")
    lines += ["", "DENSITY BY SURFACE"]
    for d in data.get("density_by_surface") or []:
        lines.append(f"- {d.get('surface')}: {d.get('density')} ({d.get('notes', '')})")
    lines += ["", "COLOR TEMPERATURE"]
    for c in data.get("color_temperature") or []:
        lines.append(f"- {c.get('register')}: {c.get('temperature')} accents={', '.join(c.get('accents') or [])}")
    lines += ["", "PROCESS VALUES"]
    for n in data.get("process_values") or []:
        lines.append(f"- {n.get('label')}: {n.get('description', '')}")
    lines += [
        "",
        "RULES",
        "1. Classify register before styling.",
        "2. Prefer one signature object or moment for visual work.",
        "3. Never violate hard antis.",
        "4. If concept is strong but finish is weak, improve polish - do not abandon the concept.",
        "5. No PII in outputs.",
        "",
    ]
    return "\n".join(lines)


def export_brief(data: dict) -> str:
    loves = data.get("hard_loves") or []
    antis = data.get("hard_antis") or []
    loves_s = sorted(loves, key=lambda n: n.get("strength") or 0, reverse=True)[:5]
    antis_s = sorted(antis, key=lambda n: n.get("strength") or 0, reverse=True)[:5]
    parts = [
        "# Collaboration brief",
        "",
        f"**North star:** {data.get('north_star')}",
        "",
        "## Do (top loves)",
        bullets(loves_s),
        "",
        "## Don't (top antis)",
        bullets(antis_s),
        "",
        "## Protocol",
    ]
    for step in data.get("collaboration_protocol") or []:
        parts.append(f"{step.get('step')}. {step.get('title')}: {step.get('instruction')}")
    parts.append("")
    return "\n".join(parts)


def main() -> int:
    ap = argparse.ArgumentParser(description="Export TasteGraph")
    ap.add_argument("path")
    ap.add_argument(
        "--format",
        choices=["md", "system-prompt", "brief", "json"],
        default="md",
    )
    ap.add_argument("--out", default=None)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    path = Path(args.path)
    if not path.is_file():
        print(f"ERROR: not found: {path}", file=sys.stderr)
        return 2
    data = load(path)

    if args.format == "md":
        text = export_md(data)
    elif args.format == "system-prompt":
        text = export_system_prompt(data)
    elif args.format == "brief":
        text = export_brief(data)
    else:
        text = json.dumps(data, indent=2, ensure_ascii=False) + "\n"

    if args.dry_run:
        print(text[:500])
        print("...")
        return 0

    if args.out:
        out = Path(args.out)
        out.write_text(text, encoding="utf-8", newline="\n")
        print(f"Wrote {out}")
    else:
        sys.stdout.write(text)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

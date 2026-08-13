---
name: tastegraph
description: >
  Build, refine, version, visualize, export, and apply a personal TasteGraph:
  a living multi-dimensional preference graph for aesthetic, creative, design,
  and cultural taste. Use when the user says TasteGraph, taste graph, build my
  taste profile, update taste from these images, export taste system prompt,
  GOOD/BAD taste test, or wants structured loves/antis for design and generation.
  Differentiator: local-first structured graph + schema + feedback loop - not a
  one-off vibe summary and not a fixed brand kit.
metadata:
  short-description: "Living personal taste graph (local-first)"
  tags:
    - taste
    - design
    - aesthetics
    - preferences
    - graph
    - privacy
    - generation
  priority: 40
  example-user-utterances:
    - "build my TasteGraph"
    - "update taste from these images"
    - "TasteGraph from this feedback"
    - "export taste system prompt"
    - "run a GOOD/BAD taste test"
    - "what does my taste graph say about this design"
    - "visualize my TasteGraph"
  composes-with:
    - "premium-web-design"
    - "ui-prototype-variants"
    - "imagine"
  allowed-tools:
    - "run_terminal_command"
    - "read_file"
    - "search_replace"
    - "list_dir"
    - "image_gen"
    - "image_edit"
---

# TasteGraph

Operate a **local-first** personal TasteGraph: structured preference graph for aesthetics and craft. Files live under the user-chosen project path (default suggestion: `./tastegraph/` relative to the working project). Never embed real personal identity, private machine paths, or PII in graph files or exports.

## Privacy rails (non-negotiable)

1. **No PII** in graph JSON, Markdown renders, evidence, or exports: no legal names, emails, phone, home paths, or private doxxable URLs.
2. Evidence summaries stay careful: offline dumps may store public post IDs; public product chrome must not expose private machine paths.
3. Prefer **user-owned files** on disk. Do not upload full private graph contents to third parties unless the user explicitly asks.
4. Skill sample graphs stay **synthetic**. Live public pie may use real public posts with credit (see below).

## Public pie source links (standing - Knock product)

When updating the **public** decision wheel (`tastegraph.jonbailey.xyz/wheel/`, code under `tastegraph-skill/site/wheel-app`):

1. **Standard fare:** if an example still comes from a public art / design / type / UI tweet (or similar public post), include **both** `credit: "@handle"` and `href: "https://x.com/.../status/..."`.
2. Do not ship caption-only public-art stills when the URL is known or in the offline evidence map.
3. Synthetic-only stills may omit `href`; label credit as synthetic.
4. Full SOP (Knock): `~/.grok/meta-collab-os/PUBLIC-PIE-SOURCE-LINKS.md`
5. On love ingest: append post_id + url to offline `evidence-map.json`.
6. **Dump size gate (standing 2026-08-10):** if the dump has **more than 10 unique public links**, ship **both wheel wedges and grid** same turn (examples + ingest-stills + contributing-sources + updates log). Dumps of 1-10 stay offline unless the operator asks for pie/grid.
7. **Public update log:** every material public wheel or site ship also appends to `/updates/` + `/updates/log.json` on the product site (newest first).

## State check

Before creating or mutating:

```text
1. Locate existing graph: tastegraph/tastegraph.json or path the user names
2. If missing: scaffold from references/empty-tastegraph.json
3. Validate with: python scripts/validate_tastegraph.py <path-to-json>
4. On validation failure: print issues, fix, re-validate
```

Schema: `references/tastegraph.schema.json` (copy of repo schema)  
Empty scaffold: `references/empty-tastegraph.json`  
Worked example: `references/sample-tastegraph.json`  
Ops detail: `references/operations.md`  
Export templates: `references/export-templates.md`

## Workflow

### A. Create

1. Ask only for missing domain focus if unclear (visual art, UI, music, fashion, etc.).
2. Scaffold `tastegraph.json` + optional `TasteGraph.md` render.
3. Seed `metadata`, empty/minimal sections, a provisional `north_star`.
4. Validate. Report path + next ingest options.

### B. Ingest (multimodal)

Accept any mix of:

- images or image folders
- free-text loves / antis / feedback
- prior generation outcomes ("keep / change / hate")
- GOOD/BAD test packs

For each item:

1. Describe the signal **without PII**.
2. Propose node adds/updates: `id`, `label`, `category`, `confidence` (H/M/L), `strength`, `evidence_ids`.
3. Append `evidence_log` entry (`kind`, `affect`, `summary`, `nodes_touched`).
4. Bump `metadata.graph_version` (semver) and append `changelog`.
5. Re-validate. Show a **diff summary** (added loves, new antis, confidence ups).

Vision path: if images are available, inspect them; otherwise use user captions. Prefer structured extraction over vibes.

### C. Update from feedback

When the user scores work:

| Signal | Action |
|--------|--------|
| Love / hate | strength + confidence; evidence_log |
| "Concept right, finish weak" | keep love node; raise related process polish node |
| "Want film from this still" | add or strengthen still-as-film-seed class process love |
| BAD pack all hated | confirm antis H; do not soften |

Never invent operator answers for open probes.

### D. Query / consult

Before design or generation:

1. Classify register / surface.
2. Load matching density, color, motion, loves, antis.
3. State tensions (e.g. novelty vs effect-soup ban).
4. Output a short **consultation card** (register, do, don't, north_star line).

### E. Generate (match or violate)

- **Match:** prompts and images that obey loves + antis + register.
- **Violate (taste test BAD):** deliberately trigger hard antis for calibration only; label outputs as BAD.
- Prefer object-as-hero clarity, intentional density, zero effect soup in any UI the skill itself produces.
- After generation, offer feedback loop back into the graph.

### F. Export

Support:

| Export | Use |
|--------|-----|
| JSON | canonical graph |
| Markdown dashboard | human reading |
| System prompt | Imagine / other image models |
| Collaboration brief | other humans/agents |
| Affinity graph description | nodes/edges for viz |
| Interactive HTML | optional simple constellation page |

Use templates in `references/export-templates.md`.  
Scripts:

```bash
python scripts/validate_tastegraph.py path/to/tastegraph.json
python scripts/export_tastegraph.py path/to/tastegraph.json --format md --out TasteGraph.md
python scripts/export_tastegraph.py path/to/tastegraph.json --format system-prompt --out taste-system-prompt.txt
python scripts/render_dashboard_html.py path/to/tastegraph.json --out tastegraph-dashboard.html
```

### G. Visualize

1. Prefer `render_dashboard_html.py` for a clean local dashboard.
2. Or textual constellation: loves, antis, edges, north_star.
3. Do not ship effect-soup chrome in skill UIs.

### H. Versioning

- `metadata.graph_version` is the instance version.
- Every material change: changelog entry + `metadata.updated`.
- Keep prior JSON copies if the user wants history (`tastegraph/versions/vX.Y.Z.json`) when doing major bumps.

## Confidence legend

| Code | Meaning |
|------|---------|
| H | Repeated evidence or strong explicit love/hate |
| M | Clear once + pattern |
| L | Inferred; mark as probe |

## Output formats

### Diff summary (after update)

```markdown
## TasteGraph vA.B.C -> vA.B.D
- loves+: ...
- antis+: ...
- confidence: ...
- evidence: N new entries
- north_star: unchanged | revised
```

### Consultation card

```markdown
## Consultation
Register: ...
Do: ...
Don't: ...
Motion: ...
North star: ...
```

## Validation loop

After every write:

1. Run `validate_tastegraph.py`
2. Fix schema errors
3. Scrub any accidental PII patterns (emails, `C:\Users\...`, phone-like strings)
4. Only then report complete

## Anti-patterns

- Replacing the graph with a vague paragraph "taste summary"
- Storing personal identity or private paths in evidence
- Softening hard antis without user evidence
- Generating match images that violate stated antis
- Building skill UI with glass+beam+aurora soup
- Shipping public pie examples from art tweets **without** source `href` when the post URL is known

## Progressive disclosure

| Need | File |
|------|------|
| Schema field meanings | `references/tastegraph.schema.json` |
| Empty scaffold | `references/empty-tastegraph.json` |
| Full ops recipes | `references/operations.md` |
| Export string templates | `references/export-templates.md` |
| Sample graph | `references/sample-tastegraph.json` |

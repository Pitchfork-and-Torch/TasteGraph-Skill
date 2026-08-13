<p align="center">
  <img src="brand/icon-512.png" alt="TasteGraph icon" width="160" height="160" />
</p>

<h1 align="center">TasteGraph Skill</h1>

<p align="center">
  <strong>Local-first personal taste graph</strong> for aesthetic, creative, design, and cultural preference.
</p>

<p align="center">
  <a href="https://tastegraph.jonbailey.xyz/"><img src="https://img.shields.io/badge/live-tastegraph.jonbailey.xyz-7c5cff" alt="Live" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" /></a>
  <a href="https://github.com/Pitchfork-and-Torch/TasteGraph-Skill/releases/latest"><img src="https://img.shields.io/github/v/release/Pitchfork-and-Torch/TasteGraph-Skill?label=release" alt="Release" /></a>
</p>

<p align="center">
  Build a structured, versioned <strong>TasteGraph</strong>, refine it from images and feedback,<br />
  export system prompts for image models, and consult it before you design or generate.
</p>

<p align="center">
  <img src="brand/social-preview.png" alt="TasteGraph constellation banner" width="100%" />
</p>

## What is a TasteGraph?

A TasteGraph is a living multi-dimensional preference graph:

- Core identity roles (who the taste serves - not legal identity)
- Emotional / aesthetic registers ("planets")
- Hard loves with evidence
- Hard antis (quiet dissatisfaction generators)
- Motion / tech preference stacks
- Density-by-surface and color temperature rules
- Process values (how taste becomes finished work)
- Quick tags, collaboration protocol, and a single **north star** sentence
- Optional affinity graph (nodes + edges)

It is **not** a vibe paragraph, a fixed brand kit, or a cloud profile.

## Privacy first

- Files stay on **your disk** unless you choose otherwise
- Schema and skill forbid PII in graph content
- Examples are synthetic / generic
- Evidence log entries are anonymized summaries

## Install (Grok / Agent Skills)

### Option A - copy the skill folder

Copy `skill/tastegraph/` into your agent skills directory, for example:

```text
~/.grok/skills/tastegraph/
```

Restart or reload skills so the agent sees the new description.

### Option B - clone this repo

```bash
git clone https://github.com/Pitchfork-and-Torch/tastegraph-skill.git
# then copy or symlink skill/tastegraph into your skills path
```

### Python helpers (optional but recommended)

```bash
cd tastegraph-skill
python -m pip install -r requirements.txt
python skill/tastegraph/scripts/validate_tastegraph.py examples/sample-tastegraph.json
```

## Quick start (with an agent)

Say things like:

- "Build my TasteGraph from these images"
- "Update taste with this feedback"
- "Export a TasteGraph system prompt for image generation"
- "Run a GOOD/BAD taste test from my graph"
- "Consult the TasteGraph before redesigning this landing page"

The skill will scaffold `tastegraph/tastegraph.json`, validate it, and keep a changelog.

## Quick start (CLI only)

```bash
# validate
python skill/tastegraph/scripts/validate_tastegraph.py examples/sample-tastegraph.json

# export markdown dashboard
python skill/tastegraph/scripts/export_tastegraph.py examples/sample-tastegraph.json \
  --format md --out my-TasteGraph.md

# export system prompt for Imagine / other models
python skill/tastegraph/scripts/export_tastegraph.py examples/sample-tastegraph.json \
  --format system-prompt --out taste-system-prompt.txt

# local HTML dashboard (no network)
python skill/tastegraph/scripts/render_dashboard_html.py examples/sample-tastegraph.json \
  --out tastegraph-dashboard.html
```

## Brand

| Asset | Use |
|-------|-----|
| [`brand/icon-512.png`](brand/icon-512.png) | Primary mark (README, docs) |
| [`brand/icon-1024.png`](brand/icon-1024.png) | High-res / app icon |
| [`brand/logo.png`](brand/logo.png) | Small 128px |
| [`brand/social-preview.png`](brand/social-preview.png) | GitHub / link unfurl 1280x640 |

Mark language: gold constellation graph on charcoal - one hero node, living edges, zero effect soup.

## Repository layout

```text
tastegraph-skill/
  README.md
  LICENSE
  CONTRIBUTING.md
  requirements.txt
  brand/                     # icon + social preview
  schemas/tastegraph.schema.json
  examples/
    sample-tastegraph.json
    sample-TasteGraph.md
    sample-dashboard.html
  skill/tastegraph/
    SKILL.md
    assets/                  # skill-local copies of the mark
    references/
    scripts/
```

## Schema highlights

Canonical schema: [`schemas/tastegraph.schema.json`](schemas/tastegraph.schema.json)

Required top-level fields:

- `metadata` (schema_version, graph_version, created, updated, domains)
- `hard_loves`
- `hard_antis`
- `north_star`

Optional: identity, registers, motion stack, density, color, process values, tags, collaboration protocol, evidence log, affinity graph, changelog.

## Collaboration protocol (default)

1. **Classify** register / surface  
2. **Load** matching nodes and antis  
3. **Distance check** against sibling work  
4. **Prove once** and log outcome  

## Aesthetic defaults for skill UIs

When this project generates UI or docs chrome:

- Object-as-hero clarity
- Intentional density
- Zero effect soup (no glass + beam + aurora + confetti stacks)

## License

MIT - see [LICENSE](LICENSE). Attribution required.

## Support

Use GitHub Issues on this repository. Do not send private personal data in issue reports.

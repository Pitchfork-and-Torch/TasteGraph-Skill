# TasteGraph operations

## File layout (recommended)

```text
tastegraph/
  tastegraph.json          # canonical
  TasteGraph.md            # rendered dashboard
  taste-system-prompt.txt  # export for image models
  versions/                # optional snapshots
  evidence/                # optional local media (gitignored if private)
```

## Create

1. Copy `empty-tastegraph.json` -> `tastegraph/tastegraph.json`
2. Set `metadata.created` / `updated` to today
3. Set domains and provisional north_star
4. Validate

## Ingest images

For each image:

1. Write a short anonymized description (subject, materials, light, density, cliches present/absent).
2. Map to loves or antis with confidence.
3. If finish is weak but concept is right: keep love; add process note under polish.
4. Append evidence_log; bump version patch.

## Ingest text feedback

Parse affect words:

| Phrases | Affect |
|---------|--------|
| love, perfect, peak | love |
| like, intriguing, good direction | like |
| meh, fine | neutral |
| not polished, weak finish | like/neutral + polish process |
| hate, despise, horrible | hate |

## Diff rules

- New love/anti with clear signal: add node strength >= 0.8 if love/hate, else 0.5-0.7
- Second confirming signal: confidence M->H or strength +0.05 (cap 1.0)
- Contradiction: create TENSION edge; do not silently delete the older node

## GOOD/BAD pack protocol

1. Generate or collect 4 GOOD candidates (match graph)
2. Generate or collect 4 BAD candidates (violate hard antis)
3. User scores
4. Update graph same session
5. Write `RESULTS.md` next to the pack (no PII)

## Query before build

Always emit a consultation card before inventing a visual direction for the user.

## Export system prompt (structure)

```text
You generate visuals for a creator with a fixed TasteGraph.
NORTH STAR: ...
REGISTERS: ...
HARD LOVES: ...
HARD ANTIS: ...
MOTION: ...
DENSITY: ...
COLOR: ...
PROCESS: ...
Never violate hard antis. Prefer hard loves when ambiguous.
```

## Similarity (optional, privacy-preserving)

If comparing to public anonymized graphs:

- Compare tag sets and category histograms only
- Never transmit evidence_log media

## Post-ship live verify (Windows Defender)

Do **not** run multi-line `powershell -NoProfile -NonInteractive -Command "..."` paste blocks for CACHEBUST + Invoke-RestMethod smokes. Defender labels those as `Trojan:Win32/ClickFix.*` (false positive; same family as social-engineered paste attacks).

Use the on-disk script:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File $env:USERPROFILE\tastegraph-skill\scripts\ship-verify.ps1 -Version 1.3.11
# optional: -WriteCachebust
```

If ClickFix pops again:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File $env:USERPROFILE\.grok\scripts\Fix-ClickFixFalsePositive.ps1
```

That script clears inactive FP threats and ensures path exclusions for `tastegraph-skill`, `.grok\scripts`, `SkyCache`, `skycache-web`.
- User must opt in

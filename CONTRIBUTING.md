# Contributing

Thanks for helping improve TasteGraph.

## Rules

1. **No PII** in commits, examples, fixtures, or docs (no personal names, emails, private paths, doxxable URLs).
2. Keep the skill body lean; put detail in `references/` and determinism in `scripts/`.
3. Bump schema version only with a migration note when breaking.
4. Run validation before opening a PR:

```bash
python -m pip install -r requirements.txt
python skill/tastegraph/scripts/validate_tastegraph.py examples/sample-tastegraph.json
```

5. Prefer small, focused changes over mega-PRs.

## Suggested PR types

- Schema fields (with example updates)
- Export formats
- Validation heuristics
- Documentation clarity
- Dashboard HTML accessibility / performance

## Code of collaboration

Be precise. Prefer evidence over vibes. Do not moralize hard antis - they are craft boundaries, not ethics lectures.

#!/usr/bin/env python3
"""Validate a TasteGraph JSON file against the schema and privacy heuristics."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

try:
    import jsonschema
except ImportError:  # pragma: no cover
    jsonschema = None

PII_PATTERNS = [
    (re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"), "email-like string"),
    (re.compile(r"C:\\\\Users\\\\[^\\s\"']+", re.I), "Windows user path"),
    (re.compile(r"/Users/[^/\s\"']+/"), "macOS user path"),
    (re.compile(r"\b\d{3}[-.]?\d{3}[-.]?\d{4}\b"), "phone-like string"),
]


def load_json(path: Path) -> dict:
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def find_schema(cli_schema: str | None) -> Path:
    if cli_schema:
        return Path(cli_schema)
    here = Path(__file__).resolve().parent
    candidates = [
        here.parent / "references" / "tastegraph.schema.json",
        here.parent.parent.parent / "schemas" / "tastegraph.schema.json",
        here.parent.parent / "schemas" / "tastegraph.schema.json",
    ]
    for c in candidates:
        if c.is_file():
            return c
    raise FileNotFoundError("Could not locate tastegraph.schema.json")


def scan_pii(obj, path="$") -> list[str]:
    issues: list[str] = []
    if isinstance(obj, dict):
        for k, v in obj.items():
            issues.extend(scan_pii(v, f"{path}.{k}"))
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            issues.extend(scan_pii(v, f"{path}[{i}]"))
    elif isinstance(obj, str):
        for rx, label in PII_PATTERNS:
            if rx.search(obj):
                issues.append(f"{path}: possible {label}")
    return issues


def structural_checks(data: dict) -> list[str]:
    errs: list[str] = []
    loves = data.get("hard_loves") or []
    antis = data.get("hard_antis") or []
    if not loves:
        errs.append("hard_loves must be non-empty")
    if not antis:
        errs.append("hard_antis must be non-empty")
    ns = data.get("north_star") or ""
    if len(ns) < 20:
        errs.append("north_star too short")
    ids = []
    for section in ("hard_loves", "hard_antis", "core_identity", "process_values"):
        for node in data.get(section) or []:
            if isinstance(node, dict) and "id" in node:
                ids.append(node["id"])
    if len(ids) != len(set(ids)):
        errs.append("duplicate node ids across primary sections")
    return errs


def main() -> int:
    ap = argparse.ArgumentParser(description="Validate TasteGraph JSON")
    ap.add_argument("path", help="Path to tastegraph.json")
    ap.add_argument("--schema", default=None, help="Optional schema path")
    ap.add_argument("--dry-run", action="store_true", help="Print plan only")
    args = ap.parse_args()

    path = Path(args.path)
    if args.dry_run:
        print(f"Would validate {path}")
        return 0
    if not path.is_file():
        print(f"ERROR: file not found: {path}", file=sys.stderr)
        return 2

    data = load_json(path)
    errors: list[str] = []
    warnings: list[str] = []

    try:
        schema_path = find_schema(args.schema)
    except FileNotFoundError as e:
        print(f"ERROR: {e}", file=sys.stderr)
        return 2

    if jsonschema is None:
        warnings.append("jsonschema not installed; running structural checks only")
        errors.extend(structural_checks(data))
    else:
        schema = load_json(schema_path)
        validator = jsonschema.Draft202012Validator(schema)
        for err in sorted(validator.iter_errors(data), key=lambda e: list(e.path)):
            loc = ".".join(str(p) for p in err.path) or "$"
            errors.append(f"{loc}: {err.message}")
        errors.extend(structural_checks(data))

    pii = scan_pii(data)
    errors.extend(pii)

    for w in warnings:
        print(f"WARN: {w}")
    if errors:
        print(f"INVALID: {path} ({len(errors)} issue(s))")
        for e in errors:
            print(f"  - {e}")
        return 1

    meta = data.get("metadata") or {}
    print(f"OK: {path}")
    print(f"  graph_version={meta.get('graph_version')} schema_version={meta.get('schema_version')}")
    print(f"  loves={len(data.get('hard_loves') or [])} antis={len(data.get('hard_antis') or [])}")
    print(f"  schema={schema_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

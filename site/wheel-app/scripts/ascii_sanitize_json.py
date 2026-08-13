#!/usr/bin/env python3
"""ASCII-sanitize string values inside JSON without breaking the document.

Do not run the file-level emdash scrubber on these catalogs: curly quotes
inside titles become raw ASCII quotes and invalidate JSON.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

REPL = str.maketrans(
    {
        "\u2014": "-",
        "\u2013": "-",
        "\u2012": "-",
        "\u2018": "'",
        "\u2019": "'",
        "\u201c": "'",
        "\u201d": "'",
        "\u00a0": " ",
    }
)


def walk(obj):
    if isinstance(obj, str):
        return obj.translate(REPL)
    if isinstance(obj, list):
        return [walk(x) for x in obj]
    if isinstance(obj, dict):
        return {k: walk(v) for k, v in obj.items()}
    return obj


def main() -> None:
    paths = [Path(p) for p in sys.argv[1:]]
    if not paths:
        raise SystemExit("usage: ascii_sanitize_json.py <json>...")
    for p in paths:
        data = json.loads(p.read_text(encoding="utf-8"))
        p.write_text(json.dumps(walk(data), indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print(f"ok {p}")


if __name__ == "__main__":
    main()

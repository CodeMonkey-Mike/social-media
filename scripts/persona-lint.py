#!/usr/bin/env python3
"""
persona-lint.py — flag persona/persona.json formatting & terminology violations in the
schedule-tweets queue data files (or any JSON). Read-only by default.

Enforces the machine-checkable rules from persona.json (terminology_rules / avoid_in_drafts /
writing_style.formatting). Voice/tone can't be linted — that's on the writer — but these
deterministic ones can, and they're the AI-tells that slip through:

  - em dash (—) / en dash (–)        BANNED everywhere   [--fix: -> "-"]
  - chart/market emojis (📈 📉)        BANNED (AI tell)    [--fix: removed]
  - "50WMA" / "200WMA" / "50-week MA" wrong format        [report only]
  - "Casper"                          should be "Kaspa"   [report only]

Usage:
  python scripts/persona-lint.py                  # lint all schedule-tweets/data/*.json
  python scripts/persona-lint.py --file <path>    # lint one JSON file
  python scripts/persona-lint.py --fix            # apply the safe auto-fixes in place

Exit code: 0 = clean, 1 = violations found (so it can gate a posting step).
"""
import argparse
import json
import re
import sys
from pathlib import Path

# Windows consoles are cp1252 by default and choke on em dashes / emojis we report.
try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

REPO_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = REPO_ROOT / "schedule-tweets" / "data"

# (label, compiled regex, autofix_replacement_or_None)
CHECKS = [
    ("em/en dash", re.compile(r"[—–]"), "-"),
    ("chart emoji", re.compile(r"[\U0001F4C8\U0001F4C9]"), ""),
    ("WMA format", re.compile(r"\b(?:50|200)\s*WMA\b|\b(?:50|200)-week MA\b|\b(?:50|200) WMA\b"), None),
    ("'Casper' (should be Kaspa)", re.compile(r"\bCasper\b"), None),
]


def walk(node, path, hits):
    """Recursively collect (json_path, string_value) for every string in the JSON."""
    if isinstance(node, dict):
        for k, v in node.items():
            walk(v, f"{path}.{k}", hits)
    elif isinstance(node, list):
        for i, v in enumerate(node):
            walk(v, f"{path}[{i}]", hits)
    elif isinstance(node, str):
        hits.append((path, node))


def lint_file(fp, fix):
    try:
        text = fp.read_text(encoding="utf-8")
        data = json.loads(text)
    except Exception as e:
        print(f"  ! skip {fp.name}: {e}")
        return 0, 0
    strings = []
    walk(data, fp.name, strings)
    violations = 0
    for jpath, val in strings:
        for label, rx, repl in CHECKS:
            for m in rx.finditer(val):
                violations += 1
                s = max(0, m.start() - 30)
                e = min(len(val), m.end() + 30)
                snippet = val[s:e].replace("\n", " ")
                print(f"  [{label}] {jpath}")
                print(f"      ...{snippet}...")
    fixes = 0
    if fix:
        raw = text
        for label, rx, repl in CHECKS:
            if repl is None:
                continue
            raw, n = rx.subn(repl, raw)
            fixes += n
        if fixes:
            # validate it's still parseable, then write
            json.loads(raw)
            fp.write_text(raw, encoding="utf-8")
    return violations, fixes


def main():
    ap = argparse.ArgumentParser(description="Lint queue data for persona.json violations.")
    ap.add_argument("--file", help="lint a single JSON file (default: all schedule-tweets/data/*.json)")
    ap.add_argument("--fix", action="store_true", help="apply safe auto-fixes (em/en dash -> '-', strip chart emojis)")
    args = ap.parse_args()

    files = [Path(args.file)] if args.file else sorted(DATA_DIR.glob("*.json"))
    total_v = total_f = 0
    for fp in files:
        if not fp.is_file():
            print(f"  ! not found: {fp}")
            continue
        print(f"=== {fp.name} ===")
        v, f = lint_file(fp, args.fix)
        if v == 0:
            print("  clean")
        if args.fix and f:
            print(f"  fixed {f} occurrence(s) in place")
        total_v += v
        total_f += f

    print(f"\nDone. {total_v} violation(s)" + (f", {total_f} auto-fixed" if args.fix else "") + ".")
    print("(Voice/tone isn't lintable — write captions in Mike's persona; this only catches the deterministic AI-tells.)")
    sys.exit(1 if (total_v - total_f) > 0 else 0)


if __name__ == "__main__":
    main()

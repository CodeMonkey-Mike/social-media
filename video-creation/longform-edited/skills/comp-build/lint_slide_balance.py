#!/usr/bin/env python
"""
lint_slide_balance.py — MECHANICAL pre-render gate for "THE BALANCE" (broll-and-containers.md).
Python port of lint-slide-balance.js (2026-09-28; the JS twin is frozen rollback).

The chronic longform-edited struggle is swinging to an extreme: either repeating one info-dense
full diagram slide over and over, or over-correcting and deleting the slides for all-containers.
This gate fails the render if either extreme is present, so the swing can't ship silently.

Rule: a rich full diagram slide (kind 'deck') is shown ONCE as the section overview, then BROKEN
UP into spotlight containers (kind 'container'). Slides + containers COEXIST.

  python video-creation/longform-edited/skills/comp-build/lint_slide_balance.py <comp.tsx>
Exit 0 = balanced (warnings allowed), 1 = FAIL (fix before render), 2 = could not parse.
"""
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
ROW = re.compile(r"\{\s*tIn:\s*([\d.]+),\s*tOut:\s*([\d.]+),\s*kind:\s*'([^']+)',\s*ref:\s*'([^']+)'[^}]*\}")


def main():
    if len(sys.argv) < 2:
        print("usage: lint_slide_balance.py <comp.tsx>", file=sys.stderr)
        sys.exit(2)
    path = Path(sys.argv[1])
    src = path.read_text(encoding="utf-8")
    if not re.search(r"COVERS\s*:\s*Cover\[\]\s*=\s*\[", src):
        imp = re.search(r"import\s*\{[^}]*\bCOVERS\b[^}]*\}\s*from\s*['\"]\./([\w.-]+)['\"]", src)
        if imp:
            p2 = path.parent / (re.sub(r"\.tsx?$", "", imp.group(1)) + ".tsx")
            if p2.is_file():
                print(f"  note  COVERS imported from ./{imp.group(1)}; linting that file's table.")
                src = p2.read_text(encoding="utf-8")
    m = re.search(r"COVERS\s*:\s*Cover\[\]\s*=\s*\[([\s\S]*?)\n\];", src)
    if not m:
        print(f"lint_slide_balance: could not find `const COVERS: Cover[] = [...]` in {path}", file=sys.stderr)
        sys.exit(2)
    # Trailing fields are REQUIRED by the other gates (every deck row declares a `state`), so the row
    # shape is `{tIn, tOut, kind, ref, ...}`; matching only rows that END at `ref` parsed 0 covers once.
    covers = [{"tIn": float(a), "tOut": float(b), "kind": k, "ref": r} for a, b, k, r in ROW.findall(m.group(1))]
    if not covers:
        print("lint_slide_balance: parsed 0 covers from COVERS array", file=sys.stderr)
        sys.exit(2)
    ct = re.search(r"CARD_T\s*=\s*\[([^\]]*)\]", src)
    card_t = []
    if ct:
        for s in ct.group(1).split(","):
            try:
                card_t.append(float(s))
            except ValueError:
                pass
    bounds = [0.0, *card_t, float("inf")]
    fails, warns = [], []
    n_deck = sum(1 for c in covers if c["kind"] == "deck")
    n_cont = sum(1 for c in covers if c["kind"] == "container")
    deck_count = {}
    for c in covers:
        if c["kind"] == "deck":
            deck_count[c["ref"]] = deck_count.get(c["ref"], 0) + 1
    for ref, n in deck_count.items():                     # RULE A
        if n > 1:
            fails.append(f"repeated full slide: deck '{ref}' shown {n}x. Show it ONCE, then break it up into spotlight containers.")
    if n_deck > 0 and n_cont == 0:                        # RULE B
        fails.append("ALL full-slides, ZERO break-up containers. Break each rich slide into spotlight containers.")
    if n_cont > 0 and n_deck == 0:
        fails.append("ALL containers, ZERO full diagram slides. Restore a rich overview slide as each section anchor.")
    for i in range(len(bounds) - 1):                      # RULE C (WARN)
        in_ch = [c for c in covers if bounds[i] <= c["tIn"] < bounds[i + 1]]
        if len(in_ch) >= 3 and len({c["kind"] for c in in_ch}) == 1:
            warns.append(f"chapter @{bounds[i]}s: all {len(in_ch)} covers are '{in_ch[0]['kind']}'. Mix a slide + containers + b-roll.")
    print(f"lint_slide_balance: {len(covers)} covers, {n_deck} full-slide(s), {n_cont} container(s).")
    for w in warns:
        print("  WARN " + w)
    if fails:
        for f in fails:
            print("  FAIL " + f)
        print("  => fix before render (THE BALANCE in broll-and-containers.md).")
        print(f"SLIDE-BALANCE-LINT FAIL fails={len(fails)} warns={len(warns)}")
        sys.exit(1)
    print("  OK; balance holds: rich slides shown once, broken into containers, both present.")
    print(f"SLIDE-BALANCE-LINT PASS fails=0 warns={len(warns)}")


if __name__ == "__main__":
    main()

#!/usr/bin/env python
"""
lint_animated_charts.py — MECHANICAL gate: every `chart` cover must render a LIVE animated component
in the comp, never a static PNG (charts.md "animated in the draft too"; comp-build.md §7).
Python port of lint-animated-charts.js (2026-09-28; the JS twin is frozen rollback).

  python video-creation/longform-edited/skills/comp-build/lint_animated_charts.py <comp.tsx> [<covers.ts>]

Parses the COVERS array (in <covers.ts>, or in the comp itself) for kind:'chart' refs, and the comp
for the animated-component routes (`c.ref === 'X'` returning a component). FAILS (exit 1) if any
chart ref has no component route (it would fall through to the static-PNG branch). Origin: zebec
CH1 buyback-flywheel shipped as a static PNG in the draft (Mike, 2026-07-12).
"""
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")


def main():
    if len(sys.argv) < 2:
        print("usage: lint_animated_charts.py <comp.tsx> [<covers.ts>]", file=sys.stderr)
        sys.exit(2)
    comp = Path(sys.argv[1])
    covers = Path(sys.argv[2]) if len(sys.argv) > 2 else comp
    comp_src = comp.read_text(encoding="utf-8")
    cov_src = covers.read_text(encoding="utf-8")
    chart_refs = sorted(set(re.findall(r"kind:\s*'chart'\s*,\s*ref:\s*'([^']+)'", cov_src)))
    routed = set(re.findall(r"c\.ref\s*===\s*'([^']+)'", comp_src))
    missing = [r for r in chart_refs if r not in routed]
    if missing:
        print("lint_animated_charts: FAIL; these `chart` covers render a STATIC PNG (must be a live "
              "useCurrentFrame component, even in the draft; charts.md / comp-build.md §7):")
        for r in missing:
            print("  - " + r)
        print(f"ANIMATED-CHARTS-LINT FAIL charts={len(chart_refs)} missing={len(missing)}")
        sys.exit(1)
    print(f"lint_animated_charts: OK; all {len(chart_refs)} chart covers route to a live animated component.")
    print(f"ANIMATED-CHARTS-LINT PASS charts={len(chart_refs)} missing=0")


if __name__ == "__main__":
    main()

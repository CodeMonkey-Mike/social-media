#!/usr/bin/env python
"""
lint_face_reframe.py — the FACE REFRAME gate (comp-build.md section 3a; Mike, 2026-10-01).

Every gated-face comp centres and zooms Mike's face with ONE global transform whose numbers come from
`scripts/measure_face_reframe.py` (assets/face-reframe.json), never from the eye. This gate FAILS when:
  - assets/face-reframe.json is missing (the measurement was never run),
  - the comp has no `FACE_REFRAME = { scale: ..., x: ..., y: ... }` constant,
  - its numbers differ from the measurement (scale +/- 0.005, x / y +/- 2 px),
  - the constant is declared but never used (a declared-but-dead constant frames nothing).
  - FACE MODE = mixed (house rule #1c; the measurement carries `screenshare_windows`): the comp keeps the spine at the identity
    transform inside the screen shares, so it must declare `SCREENSHARE_WINDOWS` with exactly those [start, end] pairs
    (+/- 0.05 s, source-spine seconds) and USE it (the reframe and the punch scale are gated off inside them).
A video with no FACE windows passes on the identity transform. A deliberate exception is declared in the comp:
  // FACE_REFRAME_WAIVED: <who, when, why>

Usage: python video-creation/longform-edited/skills/comp-build/lint_face_reframe.py <comp.tsx> <assets/face-reframe.json>
Exit 0 = PASS · 1 = FAIL · 2 = usage. Machine line: FACE-REFRAME-LINT PASS|FAIL ...
"""
import json
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")


def num(body: str, key: str):
    m = re.search(r"\b" + key + r"\s*:\s*(-?\d+(?:\.\d+)?)", body)
    return float(m.group(1)) if m else None


def main():
    if len(sys.argv) < 3:
        print("usage: lint_face_reframe.py <comp.tsx> <assets/face-reframe.json>", file=sys.stderr)
        sys.exit(2)
    comp, meas = Path(sys.argv[1]), Path(sys.argv[2])
    if not comp.is_file():
        print(f"usage: no such comp {comp}", file=sys.stderr)
        sys.exit(2)
    src = comp.read_text(encoding="utf-8", errors="replace")
    waived = re.search(r"//\s*FACE_REFRAME_WAIVED:\s*(.+)", src)
    if waived:
        print(f"WARN  face reframe waived in the comp: {waived.group(1).strip()[:160]}")
        print("FACE-REFRAME-LINT PASS waived=true")
        sys.exit(0)
    if not meas.is_file():
        print(f"FAIL  {meas} is missing: run scripts/measure_face_reframe.py <media/<project>> first (the reframe is measured, never eyeballed)")
        print("FACE-REFRAME-LINT FAIL reason=no-measurement")
        sys.exit(1)
    m = json.loads(meas.read_text(encoding="utf-8"))
    if not m.get("windows"):
        print("FACE-REFRAME-LINT PASS windows=0 (no FACE windows, nothing to reframe)")
        sys.exit(0)
    decl = re.search(r"\bFACE_REFRAME\s*(?::[^=]+)?=\s*\{([^}]*)\}", src)
    if not decl:
        print(f"FAIL  the comp declares no FACE_REFRAME constant; expected: export const FACE_REFRAME = "
              f"{{ scale: {m['scale']}, x: {m['x']}, y: {m['y']} }};  (assets/face-reframe.json)")
        print("FACE-REFRAME-LINT FAIL reason=no-constant")
        sys.exit(1)
    got = {k: num(decl.group(1), k) for k in ("scale", "x", "y")}
    fails = []
    if got["scale"] is None or abs(got["scale"] - float(m["scale"])) > 0.005:
        fails.append(f"scale is {got['scale']}, the measurement says {m['scale']}")
    for k in ("x", "y"):
        if got[k] is None or abs(got[k] - float(m[k])) > 2:
            fails.append(f"{k} is {got[k]}, the measurement says {m[k]}")
    if len(re.findall(r"\bFACE_REFRAME\b", src)) < 2:
        fails.append("FACE_REFRAME is declared but never used (apply it to the spine and to every still of the spine; a background-swap clip is pre-framed and takes none)")
    ssw = [(float(x), float(y)) for x, y in m.get("screenshare_windows") or []]
    if ssw:   # FACE MODE = mixed: the screen shares play verbatim (identity transform, no punch)
        sd = re.search(r"\bSCREENSHARE_WINDOWS\s*(?::[^=]+)?=\s*\[([\s\S]*?)\]\s*;", src)
        got_ss = [(float(x), float(y)) for x, y in re.findall(r"\[\s*([\d.]+)\s*,\s*([\d.]+)\s*\]", sd.group(1))] if sd else []
        if not sd:
            fails.append(f"FACE MODE = mixed: the comp declares no SCREENSHARE_WINDOWS; expected export const SCREENSHARE_WINDOWS: "
                         f"[number, number][] = {[list(w) for w in ssw]}; (assets/face-reframe.json; the spine plays at the identity "
                         "transform inside them, comp-build.md section 4c-mixed)")
        elif len(got_ss) != len(ssw) or any(abs(a - x) > 0.05 or abs(b - y) > 0.05 for (a, b), (x, y) in zip(got_ss, ssw)):
            fails.append(f"SCREENSHARE_WINDOWS is {got_ss}, the measurement's screenshare_windows are {ssw}")
        elif len(re.findall(r"\bSCREENSHARE_WINDOWS\b", src)) < 2:
            fails.append("SCREENSHARE_WINDOWS is declared but never used (gate FACE_REFRAME and the punch scale off inside them)")
    for f in fails:
        print(f"FAIL  {f}")
    if not m.get("centered", True):
        print("WARN  the measurement hit its scale cap: Mike is NOT fully centred (see face-reframe.json); QA the previews")
    print(f"FACE-REFRAME-LINT {'FAIL' if fails else 'PASS'} scale={got['scale']} x={got['x']} y={got['y']} "
          f"measured_scale={m['scale']} measured_x={m['x']} measured_y={m['y']}")
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()

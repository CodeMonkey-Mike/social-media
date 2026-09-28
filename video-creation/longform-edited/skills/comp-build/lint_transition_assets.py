#!/usr/bin/env python
"""
lint_transition_assets.py — MECHANICAL pre-render gate for the TRANSITION layer (Python port of
lint-transition-assets.js, 2026-09-28; the JS twin is frozen rollback).

Origin (2026-08-01, ethereum-rwa v7): a transition PLANNED in TRANSITIONS.md was verified, corrected
twice, and never wired into the comp; and a referenced transition's assets were never copied into
the project public-dir, so the engine rendered a plain cut. Neither errors at render time; the
effect is just missing. This gate makes both fail LOUDLY before ~50 minutes of frames get spent.

  python video-creation/longform-edited/skills/comp-build/lint_transition_assets.py <comp.tsx> <public-dir> [TRANSITIONS.md]

Asserts:
  A. every library id the comp references resolves in assets/transitions/library.json
  B. every asset that id needs EXISTS under <public-dir>: maskDir / plateDir / tileDir (checked BOTH
     on the row and inside row.params) plus its sfx file, and each dir holds its declared *Count
  C. every `lib:<id>` named in TRANSITIONS.md is actually referenced by the comp
Escape hatch for C: `// TRANSITIONS_WAIVED: <id> — reason` in the comp.
Exit 0 = PASS (warnings allowed), 1 = FAIL, 2 = usage.
"""
import json
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
HERE = Path(__file__).resolve().parent
LIB = HERE.parents[2] / "assets" / "transitions" / "library.json"  # skills/comp-build/ -> video-creation/
FAMILY = re.compile(r"^(blocks|badsignal|melt|spin|glitch|film|strips|perspective|zoom|expand|glass|invert|roughly|turbulent|deviation|monitor)[-_]")
COUNT = {"maskDir": "maskCount", "plateDir": "plateCount", "tileDir": "tileCount"}


def main():
    if len(sys.argv) < 3:
        print("usage: lint_transition_assets.py <comp.tsx> <public-dir> [TRANSITIONS.md]", file=sys.stderr)
        sys.exit(2)
    comp, public = Path(sys.argv[1]), Path(sys.argv[2])
    planned = Path(sys.argv[3]) if len(sys.argv) > 3 else None
    if not LIB.is_file():
        print(f"FAIL: transition library not found: {LIB}", file=sys.stderr)
        sys.exit(2)
    raw = json.loads(LIB.read_text(encoding="utf-8"))
    rows = raw if isinstance(raw, list) else (raw.get("rows") or raw.get("transitions") or next(iter(raw.values())))
    by_id = {r["id"]: r for r in rows if isinstance(r, dict) and r.get("id")}
    src = comp.read_text(encoding="utf-8")
    fails, warns = [], []
    print(f"\nlint_transition_assets — {comp.name}\n{'-' * 64}")

    literals = sorted({m for m in re.findall(r"['\"`]([a-z0-9][a-z0-9_.-]{3,})['\"`]", src)})
    used = sorted(l for l in literals if l in by_id)
    if not used:
        print("  note  comp references no library transition ids; nothing to check.")
        print("-" * 64)
        print("PASS: no transition layer in this comp.\n")
        print("TRANSITION-ASSETS-LINT PASS ids=0 fails=0 warns=0")
        sys.exit(0)
    for l in literals:
        if l not in by_id and FAMILY.match(l):
            fails.append(f"unknown transition id referenced by the comp: '{l}'")
    for tid in used:
        r = by_id[tid]
        p = r.get("params") or {}
        for key in ("maskDir", "plateDir", "tileDir"):
            d = p.get(key) or r.get(key)
            if not d:
                continue
            dp = public / d
            if not dp.is_dir():
                fails.append(f"{tid} ({r.get('engine')}): {key} MISSING: {d}")
                continue
            want = p.get(COUNT[key]) or r.get(COUNT[key])
            if want:
                have = sum(1 for f in dp.iterdir() if re.search(r"\.(png|jpe?g|webp)$", f.name, re.I))
                if have < want:
                    fails.append(f"{tid} ({r.get('engine')}): {key} has {have} frames, needs {want}: {d}")
        sfx = r.get("sfx") or p.get("sfx")
        if sfx and not (public / sfx).is_file():
            fails.append(f"{tid} ({r.get('engine')}): sfx MISSING: {sfx}")
    print(f"  note  {len(used)} library id(s) referenced: {', '.join(used)}")

    if planned is None:
        guess = public.parent / "TRANSITIONS.md"
        planned = guess if guess.is_file() else None
    if planned and planned.is_file():
        doc = planned.read_text(encoding="utf-8")
        waived = {m.lower() for m in re.findall(r"TRANSITIONS_WAIVED:\s*(?:lib:)?([a-z0-9][a-z0-9_.-]*)", src, flags=re.I)}
        named = sorted({m for m in re.findall(r"\blib:([a-z0-9][a-z0-9_.*-]*)", doc)})
        # TRANSITIONS.md legitimately names FAMILIES (`lib:melt-rgb-*`, a bare `lib:blocks`) as well as
        # ids; only a CONCRETE id (one that resolves in library.json) is something the comp must call.
        want = [i for i in named if i in by_id]
        families = [i for i in named if i not in by_id]
        missing = [i for i in want if f"'{i}'" not in src and f'"{i}"' not in src and f"`{i}`" not in src and i not in waived]
        for i in missing:
            fails.append(f"{planned.name} plans lib:{i} but the comp never references it (wire it, or declare "
                         f"\"// TRANSITIONS_WAIVED: {i} — reason\")")
        for i in families:
            if "*" not in i:
                warns.append(f"{planned.name} names lib:{i}: family shorthand, or a typo? (not a library id)")
        print(f"  note  {planned.name} plans {len(want)} concrete lib: id(s), {len(want) - len(missing)} wired"
              + (f" (+{len(families)} family ref(s))" if families else ""))
    else:
        warns.append("no TRANSITIONS.md found; skipped the planned-vs-wired check (C)")

    for w in warns:
        print(f"  warn  {w}")
    for f in fails:
        print(f"  FAIL  {f}")
    print("-" * 64)
    if fails:
        print(f"FAIL: {len(fails)} violation(s){f', {len(warns)} warning(s)' if warns else ''}. Do NOT render.\n")
        print(f"TRANSITION-ASSETS-LINT FAIL ids={len(used)} fails={len(fails)} warns={len(warns)}")
        sys.exit(1)
    print(f"PASS: transition layer wired and every asset present{f' ({len(warns)} warning(s) to review)' if warns else ''}.\n")
    print(f"TRANSITION-ASSETS-LINT PASS ids={len(used)} fails=0 warns={len(warns)}")


if __name__ == "__main__":
    main()

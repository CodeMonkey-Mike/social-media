#!/usr/bin/env python
"""
lint_as_recorded.py — the AS-RECORDED.md format gate (screenplay.md § AS-RECORDED), in CODE.

Same pattern as lint_screenplay.py (Mike, 2026-09-17: "standard rules and styles for how we do
everything"): the format owner is the skill, the shape is skills/doc-reference/AS-RECORDED.reference.md,
and this lint is the code gate the longform graph runs in its `as_recorded` node.

Enforces:
  1. REQUIRED SECTIONS: Final spine · Transcript (cue source) · Timecode chain · ## FACE windows ·
     ## Whisper mishears · ## AS-RECORDED beats · ## Divergences from SCREENPLAY.md · ## Flags carried
  2. BEAT TABLES: every `### CH<n>` section carries a `| TC | as recorded | vs screenplay |` table whose
     rows are marked KEPT / CHANGED / AD-LIB / DROPPED
  3. TIMECODES: every leading table timecode is a number at or below the spine duration (--duration)
  4. FACE WINDOWS: at least one row, `start-end` seconds; with --face-max N, at most N rows
  5. NO EM DASHES (persona)
Usage:
  python video-creation/longform-edited/skills/doc-reference/lint_as_recorded.py <AS-RECORDED.md> [--duration S] [--face-max N]
Exit: 0 = PASS · 1 = FAIL · 2 = usage. Machine line: AS-RECORDED-LINT PASS|FAIL faces=N fails=N
"""
import argparse
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

REQUIRED = [
    (r"\*\*Final spine:\*\*", "the **Final spine:** line"),
    (r"\*\*Transcript \(cue source\):\*\*", "the **Transcript (cue source):** line"),
    (r"\*\*Timecode chain:\*\*", "the **Timecode chain:** line"),
    (r"^##\s+FACE windows", "## FACE windows"),
    (r"^##\s+Whisper mishears", "## Whisper mishears to FIX ..."),
    (r"^##\s+AS-RECORDED beats", "## AS-RECORDED beats"),
    (r"^##\s+Divergences from SCREENPLAY", "## Divergences from SCREENPLAY.md"),
    (r"^##\s+Flags carried", "## Flags carried into the edit"),
]
VERDICT = re.compile(r"\b(KEPT|CHANGED|AD-LIB|DROPPED)\b")
TC_ROW = re.compile(r"^\|\s*(\d+(?:\.\d+)?)\s*\|")
FACE_ROW = re.compile(r"^\|\s*\d+\s*\|\s*(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)\s*\|")


def lint(text, duration=None, face_max=None):
    fails = []
    lines = text.splitlines()
    for pat, what in REQUIRED:
        if not re.search(pat, text, flags=re.I | re.M):
            fails.append(f"missing {what}")
    if "—" in text:
        fails.append(f"{text.count(chr(0x2014))} em dash(es) (persona: never)")
    # beat tables per chapter
    section, ch, rows, verdicts = None, None, 0, 0
    faces = 0
    for i, l in enumerate(lines, 1):
        if re.match(r"^##\s+", l):
            if ch and rows == 0:
                fails.append(f"{ch}: no beat table rows")
            elif ch and verdicts < rows:
                fails.append(f"{ch}: {rows - verdicts} beat row(s) without a KEPT / CHANGED / AD-LIB / DROPPED verdict")
            section = l.strip().lower()
            ch = None
            rows = verdicts = 0
            continue
        if re.match(r"^###\s+CH\s*\d", l, re.I):
            if ch and rows == 0:
                fails.append(f"{ch}: no beat table rows")
            elif ch and verdicts < rows:
                fails.append(f"{ch}: {rows - verdicts} beat row(s) without a verdict")
            ch, rows, verdicts = l.strip(), 0, 0
            continue
        m = TC_ROW.match(l)
        if ch and m:
            rows += 1
            if VERDICT.search(l):
                verdicts += 1
            if duration is not None and float(m.group(1)) > duration + 0.5:
                fails.append(f"line {i}: timecode {m.group(1)} beyond the spine ({duration:.2f}s)")
        if section and "face windows" in section:
            fm = FACE_ROW.match(l)
            if fm:
                faces += 1
                if duration is not None and float(fm.group(2)) > duration + 0.5:
                    fails.append(f"line {i}: FACE window ends beyond the spine")
    if ch and rows == 0:
        fails.append(f"{ch}: no beat table rows")
    elif ch and verdicts < rows:
        fails.append(f"{ch}: {rows - verdicts} beat row(s) without a verdict")
    if faces == 0:
        fails.append("no FACE window rows (| # | start-end | ... |)")
    if face_max is not None and faces > face_max:
        fails.append(f"{faces} FACE windows; this video allows at most {face_max}")
    return fails, faces


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("doc")
    ap.add_argument("--duration", type=float, default=None, help="final spine duration (s)")
    ap.add_argument("--face-max", type=int, default=None)
    a = ap.parse_args()
    p = Path(a.doc)
    if not p.is_file():
        print(f"usage: no such file {p}", file=sys.stderr)
        sys.exit(2)
    fails, faces = lint(p.read_text(encoding="utf-8"), a.duration, a.face_max)
    for f in fails:
        print(f"FAIL  {f}")
    print(f"AS-RECORDED-LINT {'FAIL' if fails else 'PASS'} faces={faces} fails={len(fails)} file={p}")
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()

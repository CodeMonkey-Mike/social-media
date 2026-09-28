#!/usr/bin/env python
"""
lint_docset.py — PRE-BUILD GATE for a longform-edited video's document set (Python port of
lint-docset.js, 2026-09-28; the JS twin is frozen rollback). Run by the longform graph's
`lint_docset` node and usable by hand.

Enforces, in CODE (not memory), the things that keep getting bypassed before the comp build:
  1. the comp-build.md §13 required document set exists + is non-stub + has its mandatory sections
  2. the spine/ folder + naming convention (§13a): nothing loose in the project root
  3. ORDER: CUE-SHEET / EDIT-PLAN can only exist after the word-level transcript (they're timecoded off it)
  4. no invented / non-canonical docs (WARN: e.g. a stray DOSSIER.md)
  5. MUSIC-PLAN.json + COVER-PLAN.json exist and parse (the strategists' handoff artifacts)

Usage:  python video-creation/longform-edited/skills/doc-reference/lint_docset.py <media/<project> dir> [--stage plan|build]
        --stage plan  = the PLAN-stage subset (before EDIT-PLAN/CUE-SHEET/TRANSITIONS exist):
                        SCREENPLAY · AS-RECORDED · DATA · PROJECT-LOG · COVER-PLAN.json · BROLL-PLAN ·
                        EDIT-PLAN-prep · MUSIC-PLAN.json (+ the spine/naming/order rules)
        --stage build = everything (default; the pre-comp gate)
Exit:   0 = PASS (may have WARNs) · 1 = FAIL (blocking) · 2 = bad usage
"""
import argparse
import json
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# Required document set (comp-build.md §13) + the mandatory section(s)/marker(s) each must carry.
REQUIRED_ALL = {
    "SCREENPLAY.md":     [r"#"],
    "AS-RECORDED.md":    [r"face|as-?built|as-?recorded"],
    "DATA.md":           [r"chart-source index"],
    "BROLL-PLAN.md":     [r"envato", r"chatgpt|image"],
    "TRANSITIONS.md":    [r"chapter|card", r"glitch|badsignal|library", r"face"],          # the 3 buckets
    "EDIT-PLAN-prep.md": [r"beat|prep|layer"],
    "EDIT-PLAN.md":      [r"time-?ordered|event log"],
    "CUE-SHEET.md":      [r"##\s*FACE spans", r"##\s*TRANSITIONS", r"##\s*MUSIC beds"],    # TRANSITIONS = the kaspa-covenants miss
    "PROJECT-LOG.md":    [r"#"],
}
PLAN_STAGE = ["SCREENPLAY.md", "AS-RECORDED.md", "DATA.md", "BROLL-PLAN.md", "EDIT-PLAN-prep.md", "PROJECT-LOG.md"]
JSON_ALL = {"MUSIC-PLAN.json": "music-placement-strategist output", "COVER-PLAN.json": "coverage-strategist output"}
CANON_MD = set(REQUIRED_ALL) | {"GRAPH-PROGRESS.md"}
LOOSE_SPINE = re.compile(r"\.(defumbled|blackout|blacked|desilenced|cleaned|paused|cut)\.[^/]*\.(mp4|json|txt)$", re.I)
OBS_NAME = re.compile(r"^\d{4}-\d\d-\d\d \d\d-\d\d-\d\d\.")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("project_dir")
    ap.add_argument("--stage", choices=["plan", "build"], default="build")
    a = ap.parse_args()
    d = Path(a.project_dir).resolve()
    if not d.is_dir():
        print(f"FAIL: not a directory: {d}", file=sys.stderr)
        sys.exit(2)
    fails, warns, ok = [], [], []
    required = {k: v for k, v in REQUIRED_ALL.items() if a.stage == "build" or k in PLAN_STAGE}
    jsons = dict(JSON_ALL) if a.stage == "build" else {"COVER-PLAN.json": JSON_ALL["COVER-PLAN.json"],
                                                      "MUSIC-PLAN.json": JSON_ALL["MUSIC-PLAN.json"]}

    # 1. required docs + sections
    for f, pats in required.items():
        p = d / f
        if not p.is_file():
            fails.append(f"MISSING required doc: {f}")
            continue
        txt = p.read_text(encoding="utf-8", errors="replace")
        if len(txt.strip()) < 60:
            fails.append(f"STUB doc (too short): {f}")
            continue
        missing = [pat for pat in pats if not re.search(pat, txt, flags=re.I | re.M)]
        if missing:
            fails.append(f"{f}: missing required section/marker {' , '.join('/' + m + '/' for m in missing)}")
        else:
            ok.append(f)
    # 5. JSON handoff artifacts must exist + parse
    for f, what in jsons.items():
        p = d / f
        if not p.is_file():
            fails.append(f"MISSING {f} ({what})")
            continue
        try:
            json.loads(p.read_text(encoding="utf-8"))
            ok.append(f)
        except Exception as e:
            fails.append(f"{f} invalid JSON: {e}")

    # 4. non-canonical docs in the project root (WARN: invented files are how conventions drift)
    for p in sorted(d.iterdir()):
        if p.suffix.lower() == ".md" and p.name not in CANON_MD:
            warns.append(f"non-canonical doc in root: {p.name}  (verified research belongs in DATA.md, comp-build §13)")

    # 2 + 3. spine/ folder + naming + the ORDER gate
    spine = d / "spine"
    if not spine.is_dir():
        fails.append("MISSING spine/ folder (spine-prep intermediates live here, comp-build §13a)")
    else:
        names = [p.name for p in spine.iterdir()]
        if not any(re.search(r"\.(desilenced|final|paused|cut)\.mp4$", n, re.I) for n in names):
            warns.append("spine/: no *.desilenced/cut/final/paused .mp4 (the final spine)")
        has_words = any(n.lower().endswith(".medium-words.json") for n in names)
        if ((d / "CUE-SHEET.md").exists() or (d / "EDIT-PLAN.md").exists()) and not has_words:
            fails.append("ORDER: CUE-SHEET/EDIT-PLAN exist but no *.medium-words.json transcript in spine/ "
                         "(they MUST be timecoded off the transcript: build to the transcript, not the screenplay)")
        if a.stage == "plan" and not has_words:
            fails.append("plan stage needs the word-level transcript in spine/ (*.medium-words.json)")
    for p in sorted(d.iterdir()):
        if p.name in ("spine", "raw") or p.is_dir():
            continue
        if LOOSE_SPINE.search(p.name) or OBS_NAME.match(p.name):
            fails.append(f"spine intermediate loose in project root: {p.name}  (belongs in spine/, comp-build §13a)")

    bar = "-" * 64
    print(f"\nlint_docset ({a.stage}) — {d.name}\n{bar}")
    for f in ok:
        print(f"  ok    {f}")
    for w in warns:
        print(f"  WARN  {w}")
    for f in fails:
        print(f"  FAIL  {f}")
    print(bar)
    print(f"DOCSET-LINT {'FAIL' if fails else 'PASS'} stage={a.stage} fails={len(fails)} warns={len(warns)}")
    if fails:
        print(f"FAIL: {len(fails)} blocking issue(s); do NOT build the comp until fixed.\n")
        sys.exit(1)
    print(f"PASS{f' (review {len(warns)} warning(s))' if warns else ''}: document set complete.\n")
    sys.exit(0)


if __name__ == "__main__":
    main()

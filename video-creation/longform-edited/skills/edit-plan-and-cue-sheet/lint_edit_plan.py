#!/usr/bin/env python
"""
lint_edit_plan.py — the EDIT-PLAN.md + CUE-SHEET.md gate (edit-plan-and-cue-sheet.md §1 / §2), in CODE.

Same pattern as lint_screenplay.py / lint_as_recorded.py: the format owner is the skill, the shape is
skills/doc-reference/EDIT-PLAN.reference.md + CUE-SHEET.reference.md, this lint is the code gate the
longform graph runs in its `edit_plan` node (2026-09-28).

EDIT-PLAN.md
  1. Header: a `# <project> - EDIT-PLAN` title and a `> ... Watch file:` quote block
  2. Chapter sections `## CH<n> ...`, each holding fenced event blocks
  3. Every event line is `M:SS.s  [LAYER] text` or `M:SS.s  SAY:  "..."` (continuation lines are indented);
     timecodes non-decreasing inside a chapter and at or below --duration
  4. SAY coverage: at least --say-min (default 0.8) of the transcript segments appear as SAY lines
  5. ZERO ORPHANS: every asset id on disk (assets/vid, img, receipts, charts, diagrams, title-slides,
     card-slides) appears in the log, or the log marks it BENCH / REJECTED
  6. Every MUSIC-PLAN hard hit has an [IMPACT] / [RISER...] / [MUSIC] / [DUCK] event within +-0.6 s, and
     every chapter card ON (AS-RECORDED header) has a [CARD] event carrying an [IMPACT]
  7. No leftover `pick by MEASURED tail` seed placeholders, no `<!-- SEED` marker, no em dashes
CUE-SHEET.md
  8. Required sections: FACE spans · TRANSITIONS · CHAPTER cards · CONTAINER / DIAGRAM / CHART ·
     RECEIPTS · VIDEO b-roll · IMAGE b-roll · IMPACTS + RISERS · MUSIC beds · CAPTIONS
  9. FACE spans count == AS-RECORDED face windows; no em dashes
Usage:
  python lint_edit_plan.py <media/<project>> [--duration S] [--say-min 0.8]
Exit: 0 = PASS · 1 = FAIL · 2 = usage. Machine line: EDIT-PLAN-LINT PASS|FAIL events=N say=N fails=N warns=N
"""
import argparse
import json
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
EVENT_RE = re.compile(r"^(\d+):(\d{2}\.\d)\s+(\[([A-Z][A-Z0-9→ /-]*)\]|SAY:)\s*(.*)$")
TAG_RE = re.compile(r"\[([A-Z][A-Z0-9→ /-]*)\]")
CH_RE = re.compile(r"^###\s+(CH\s*\d+)\s*[-:]\s*([^(\n]+?)\s*\((\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)\)([^\n]*)", re.M)
FACE_RE = re.compile(r"^\|\s*\d+\s*\|\s*(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)\s*\|", re.M)
ASSET_DIRS = ("vid", "img", "receipts", "charts", "diagrams", "title-slides", "card-slides")
CUE_SECTIONS = ["FACE spans", "TRANSITIONS", "CHAPTER cards", "CONTAINER / DIAGRAM / CHART", "RECEIPTS",
                "VIDEO b-roll", "IMAGE b-roll", "IMPACTS + RISERS", "MUSIC beds", "CAPTIONS"]


def asset_ids(proj: Path):
    ids = set()
    for d in ASSET_DIRS:
        p = proj / "assets" / d
        if not p.is_dir():
            continue
        for f in p.iterdir():
            if f.is_file() and f.suffix.lower() in (".png", ".jpg", ".jpeg", ".webp", ".mp4", ".mov", ".webm"):
                stem = f.stem
                m = re.match(r"^((?:BR|IMG|R)-?\d+[a-z]?)", stem)
                if m:
                    ids.add(m.group(1))
                else:
                    # container/diagram ids: strip a trailing -<state>; fall back to the whole stem
                    base = re.sub(r"-(s\d+|[a-z-]+)$", "", stem)
                    ids.add(stem if base == "" else base)
                    ids.add(stem)
    return ids


def lint(proj: Path, duration=None, say_min=0.8):
    fails, warns = [], []
    ep, cs, ar = proj / "EDIT-PLAN.md", proj / "CUE-SHEET.md", proj / "AS-RECORDED.md"
    for p in (ep, cs, ar):
        if not p.is_file():
            fails.append(f"MISSING {p.name}")
    if fails:
        return fails, warns, 0, 0
    text, cue, ar_text = (p.read_text(encoding="utf-8") for p in (ep, cs, ar))
    for name, t in (("EDIT-PLAN.md", text), ("CUE-SHEET.md", cue)):
        if "—" in t:
            fails.append(f"{name}: em dash found (persona rule)")
    if not re.search(r"^#\s+\S.*EDIT-PLAN", text, re.M):
        fails.append("EDIT-PLAN.md: missing `# <project> - EDIT-PLAN` title")
    if "Watch file" not in text:
        fails.append("EDIT-PLAN.md: header quote block must name the watch file")
    if "<!-- SEED" in text:
        fails.append("EDIT-PLAN.md still carries the SEED marker (the author must refine and remove it)")
    if re.search(r"pick by MEASURED tail", text):
        fails.append("EDIT-PLAN.md: seed SFX placeholders remain ('pick by MEASURED tail'); name the kit file per hit")
    chapters = re.findall(r"^##\s+CH\s*\d+", text, re.M)
    if not chapters:
        fails.append("EDIT-PLAN.md: no `## CH<n>` chapter sections")
    events, say_lines, last_t, in_ch = 0, 0, -1.0, None
    for ln in text.splitlines():
        if ln.startswith("## "):
            in_ch = ln
            last_t = -1.0
            continue
        m = EVENT_RE.match(ln)
        if not m:
            continue
        t = int(m.group(1)) * 60 + float(m.group(2))
        events += 1
        if m.group(3) == "SAY:":
            say_lines += 1
        if t < last_t - 0.051:
            fails.append(f"EDIT-PLAN.md: time goes backwards at {ln[:60]!r} (inside {in_ch[:30] if in_ch else 'no chapter'})")
        last_t = max(last_t, t)
        if duration and t > duration + 0.6:
            fails.append(f"EDIT-PLAN.md: event at {t:.1f}s is past the spine ({duration:.2f}s): {ln[:60]!r}")
    if events == 0:
        fails.append("EDIT-PLAN.md: no event lines in `M:SS.s  [LAYER] ...` form")
    # SAY coverage vs the transcript
    spine_words = sorted((proj / "spine").glob("*.medium-words.json"), key=lambda p: p.name)
    if spine_words:
        segs = json.loads(spine_words[-1].read_text(encoding="utf-8")).get("segments", [])
        if segs and say_lines < say_min * len(segs):
            fails.append(f"EDIT-PLAN.md: only {say_lines} SAY lines for {len(segs)} transcript segments (min {say_min:.0%})")
    # zero orphans
    ids = asset_ids(proj)
    missing = sorted(i for i in ids if i not in text and re.sub(r"-(s\d+|[a-z-]+)$", "", i) not in text)
    missing = [i for i in missing if not re.search(rf"{re.escape(i)}[^\n]*(BENCH|REJECTED)", text)]
    if missing:
        fails.append("EDIT-PLAN.md: assets on disk never placed nor marked BENCH/REJECTED (zero-orphans rule): " + ", ".join(missing[:12]))
    # music hard hits + chapter cards
    mp = proj / "MUSIC-PLAN.json"
    if mp.is_file():
        times = []
        for ln in text.splitlines():
            m = EVENT_RE.match(ln)
            if m and m.group(3) != "SAY:" and re.search(r"IMPACT|RISER|MUSIC|DUCK", ln):
                times.append(int(m.group(1)) * 60 + float(m.group(2)))
        for h in json.loads(mp.read_text(encoding="utf-8")).get("hard_hits") or []:
            try:
                t = float(h.get("t", 0))
            except (TypeError, ValueError):
                warns.append(f"MUSIC-PLAN hard hit with a symbolic time skipped: {str(h.get('t'))[:40]!r}")
                continue
            if not any(abs(t - x) <= 0.6 for x in times):
                fails.append(f"EDIT-PLAN.md: MUSIC-PLAN hard hit at {t:.2f}s ({str(h.get('beat', ''))[:50]}) has no IMPACT/RISER/MUSIC/DUCK event within 0.6 s")
    for m in CH_RE.finditer(ar_text):
        if re.search(r'card\s+ON', m.group(5)):
            ta = float(m.group(3))
            ok = False
            for ln in text.splitlines():
                e = EVENT_RE.match(ln)
                if e and "[CARD]" in ln and abs(int(e.group(1)) * 60 + float(e.group(2)) - ta) <= 0.6:
                    ok = "IMPACT" in ln
                    break
            if not ok:
                fails.append(f"EDIT-PLAN.md: {m.group(1)} title card at {ta:.2f}s needs a [CARD] event carrying an [IMPACT]")
    # CUE-SHEET
    for sec in CUE_SECTIONS:
        if not re.search(r"^##\s+" + re.escape(sec), cue, re.M):
            fails.append(f"CUE-SHEET.md: missing section `## {sec}`")
    sec = re.search(r"^##\s+FACE windows.*?(?=^##\s|\Z)", ar_text, re.M | re.S)
    faces = len(FACE_RE.findall(sec.group(0) if sec else ""))
    m = re.search(r"^##\s+FACE spans.*?(\d+)\s+spans?", cue, re.M)
    if faces and m and int(m.group(1)) != faces:
        fails.append(f"CUE-SHEET.md: FACE spans header says {m.group(1)}, AS-RECORDED has {faces} windows")
    if "TRANSITIONS.md" not in cue:
        warns.append("CUE-SHEET.md never points at TRANSITIONS.md (the full per-cut list lives there)")
    return fails, warns, events, say_lines


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("project_dir")
    ap.add_argument("--duration", type=float, default=None)
    ap.add_argument("--say-min", type=float, default=0.6)
    a = ap.parse_args()
    proj = Path(a.project_dir).resolve()
    if not proj.is_dir():
        print(f"usage: {proj} is not a project folder", file=sys.stderr)
        sys.exit(2)
    fails, warns, events, say = lint(proj, a.duration, a.say_min)
    print(f"\nlint_edit_plan — {proj.name}\n{'-' * 64}")
    for w in warns:
        print(f"  warn  {w}")
    for f in fails:
        print(f"  FAIL  {f}")
    print("-" * 64)
    print(f"EDIT-PLAN-LINT {'FAIL' if fails else 'PASS'} events={events} say={say} fails={len(fails)} warns={len(warns)}")
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()

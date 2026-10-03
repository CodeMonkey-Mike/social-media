#!/usr/bin/env python
"""
lint_screenplay.py — the SCREENPLAY.md format gate (Convention 5, screenplay.md), in CODE.

Why (Mike, 2026-09-17, kaspa-vprogs GATE 1): the first screenplay through the longform graph came
back with bare `[FACE]` / `[COVER]` tags instead of the canonical backticked tags (the gray chips
he reads by in the VS Code preview). The graph's check only COUNTED tags; it never checked their
FORM, so a deviation shipped to the gate. "This is part of why we need to put this into LangGraph,
so that we don't have deviations in every video we make." A rule that lives as prose in the skill
gets bypassed; this lint runs in the `screenplay` node on every video and FAILS the graph.

What it enforces (canonical: video-creation/longform-edited/screenplay.md, Convention 5 + the
no-cold-open rule; the format owner wins on conflict):
  1. TAG FORM: every tagged line starts with its emoji and a BACKTICKED tag:
       👤 `[FACE]` · 🗣️ `[COVER]` · 🔒 `[SAY-EXACT]` · 🎬 `[SHOW]` · 💬 `[NOTE]` · 🔍 `[VERIFY]`
     (`[FACE] HOLD` is the sanctioned Convention-3 variant.) A bare `[TAG]` on a tagged line, or a
     tag without its backticks, is a FAIL.
  2. LOCKED LINES carry their gate written out: 🔒 `[SAY-EXACT]` then `[FACE]` / `[COVER]`
     (the exemplar order; the gate token may ride with or without its own emoji).
  3. ONE JOB PER LINE: a spoken line never carries a `[SHOW]` / `[NOTE]` / `[VERIFY]` mid-line.
  4. BEATS keep a bold signpost (`**Beat N ...**`) inside every chapter section.
  5. REQUIRED SECTIONS: the chapter map, the tag legend (backticked), per-chapter `## CH<n>`
     sections, ## MUSIC-MOOD-PLAN, ## VISUAL-PLAN, ## OPEN QUESTIONS.
  6. NO COLD OPEN: no heading or beat NAMED "cold open" / "teaser" before CH1.
  7. NO EM DASHES anywhere (persona).
  8. FACE BUDGET: `--face-max N` -> at most N tagged `[FACE]` lines (the video's constraint).
  9. YEARS ARE DIGITS: a spoken line never spells out a year ("twenty fifteen"); write 2015
     (persona `year_and_date_format`, Mike 2026-10-01).
 10. NO DOLLAR SIGNS anywhere outside a code span: written money is "4.2M" / "1.04B", tickers
     carry no cashtag sign (persona `money_format`, Mike 2026-10-01). A pair of dollar signs
     also renders as math in the VS Code Markdown preview and scrambles the page.
 11. NUMBERS ARE DIGITS on a spoken line: no spelled-out number of ten or more ("three hundred
     sixty-nine billion" -> "369 billion"), and no one..nine in front of percent or a scale word
     ("four million" -> "4 million"). Scale words and "dollars" / "percent" stay words (persona
     `whole_number_format`, Mike 2026-10-01: spelled-out numbers make him fumble the read).
     `--voice-clone` skips 9 and 11: a script for the ElevenLabs voice clone spells numbers out.

Usage:
  python video-creation/longform-edited/skills/doc-reference/lint_screenplay.py <SCREENPLAY.md> [--face-max N] [--fix] [--voice-clone]
Exit: 0 = PASS (may print WARNs) · 1 = FAIL · 2 = usage.
--fix rewrites the SAFE, mechanical deviations in place (backtick bare tags outside code spans,
on tagged lines and legend rows; put `[SAY-EXACT]` first on locked lines; em dash -> ", ") and
re-lints. Content is never changed. Machine line: SCREENPLAY-LINT PASS|FAIL faces=N fails=N warns=N
"""
import argparse
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

EMOJI = {"FACE": "👤", "COVER": "🗣️", "SAY-EXACT": "🔒", "SHOW": "🎬", "NOTE": "💬", "VERIFY": "🔍"}
EMO = r"(?:👤|🗣️|🗣|🔒|🎬|💬|🔍)"
TAGNAME = r"(?:FACE|COVER|SAY-EXACT|SHOW|NOTE|VERIFY)"
HOLD = r"(?: HOLD)?"
# A canonical line HEAD: emoji + backticked tag, then any further backticked tags, each with or
# without its own emoji (the exemplars write a locked line as 🔒 `[SAY-EXACT]` `[FACE]`).
TAGGED_LINE = re.compile(r"^\s*" + EMO + r"\s*`\[" + TAGNAME + r"\]" + HOLD + r"`(?:\s*" + EMO + r"?\s*`\[" + TAGNAME + r"\]" + HOLD + r"`)*")
STARTS_WITH_TAGISH = re.compile(r"^\s*(?:" + EMO + r"\s*)?`?\[(?:FACE|COVER|SAY-EXACT|SHOW|NOTE|VERIFY)")
BARE_TAG = re.compile(r"(?<!`)\[(" + TAGNAME + r")\](?! HOLD`)(?!`)")
UNIT_RE = re.compile(EMO + r"?\s*`\[" + TAGNAME + r"\]" + HOLD + r"`")
SPOKEN = {"FACE", "COVER", "SAY-EXACT"}
# A year written as words: "twenty fifteen", "nineteen ninety-nine", "twenty twenty-six". A quantity
# never has this shape ("twenty-eight million" is hyphenated, "twenty four seven" has a ones word).
SPELLED_YEAR = re.compile(r"\b(?:nineteen|twenty)\s+(?:oh\s+\w+|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|"
                          r"seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)\b", re.I)
# A number written as words that Mike should read as digits: anything of ten or more, or one..nine
# carrying percent / a scale word. "thousand / million / billion" alone are legal scale words.
SPELLED_NUMBER = re.compile(
    r"\b(?:ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|"
    r"forty|fifty|sixty|seventy|eighty|ninety|hundred)\b"
    r"|\b(?:one|two|three|four|five|six|seven|eight|nine)\s+(?:percent|thousand|million|billion|trillion)\b", re.I)
REQUIRED = [
    (r"^##\s+.*chapter map", "## CHAPTER MAP section"),
    (r"^\|\s*👤\s*`\[FACE\]`", "the tag legend table with backticked tags (a `| 👤 `[FACE]` |` row)"),
    (r"^##\s+CH\s*1\b", "## CH1 section"),
    (r"^##\s+MUSIC-MOOD-PLAN", "## MUSIC-MOOD-PLAN"),
    (r"^##\s+VISUAL-PLAN", "## VISUAL-PLAN"),
    (r"^##\s+OPEN QUESTIONS", "## OPEN QUESTIONS"),
]


def line_tags(line: str):
    """The tag names at the head of a canonical tagged line, in order ([] if not tagged)."""
    m = TAGGED_LINE.match(line)
    if not m:
        return []
    return re.findall(r"\[(" + TAGNAME + r")\]", m.group(0))


def _backtick_outside_code(line: str) -> str:
    """Backtick every bare tag token, but never inside an existing `code span`."""
    parts = re.split(r"(`[^`]*`)", line)
    return "".join(p if p.startswith("`") else BARE_TAG.sub(lambda m: f"`[{m.group(1)}]`", p)
                   for p in parts)


def fix_text(text: str) -> str:
    out = []
    for line in text.splitlines():
        s = line.lstrip()
        if s.startswith(">"):
            out.append(line.replace("—", ", "))          # callouts: only the em-dash rule
            continue
        if s.startswith("|"):
            out.append(_backtick_outside_code(line).replace("—", ", "))   # legend rows
            continue
        if STARTS_WITH_TAGISH.match(line):
            fixed = _backtick_outside_code(line)
            # a line that starts with a backticked tag but no emoji: add the emoji
            fixed = re.sub(r"^(\s*)`\[(FACE|COVER|SAY-EXACT|SHOW|NOTE|VERIFY)\]( HOLD)?`",
                           lambda m: f"{m.group(1)}{EMOJI[m.group(2)]} `[{m.group(2)}]{m.group(3) or ''}`", fixed)
            # locked lines: 🔒 `[SAY-EXACT]` FIRST, then the gate (exemplar order)
            head = TAGGED_LINE.match(fixed)
            if head:
                units = [u.strip() for u in UNIT_RE.findall(head.group(0))]
                if len(units) >= 2 and any("[SAY-EXACT]" in u for u in units) and "[SAY-EXACT]" not in units[0]:
                    units.sort(key=lambda u: 0 if "[SAY-EXACT]" in u else 1)
                    fixed = " ".join(units) + " " + fixed[head.end():].lstrip()
            line = fixed
        out.append(line.replace("—", ", "))
    return "\n".join(out) + ("\n" if text.endswith("\n") else "")


def lint(text: str, face_max=None, voice_clone=False):
    fails, warns = [], []
    lines = text.splitlines()
    for pat, what in REQUIRED:                                    # 5
        if not re.search(pat, text, flags=re.I | re.M):
            fails.append(f"missing {what}")
    ch1 = next((i for i, l in enumerate(lines) if re.match(r"^##\s+CH\s*1\b", l, re.I)), None)
    for i, l in enumerate(lines[: ch1 or 0]):                     # 6
        if re.match(r"^#+\s*(cold open|teaser)\b", l, re.I) or \
           re.match(r"^\*\*Beat\s*\d*\s*[-:–]\s*(cold open|teaser)\b", l, re.I):
            fails.append(f"line {i + 1}: a section named '{l.strip()[:40]}' before CH1 (there is NO cold open; CH1 IS the opening)")
    for i, l in enumerate(lines):                                 # 7
        if "—" in l:
            fails.append(f"line {i + 1}: em dash (persona: never)")
    for i, l in enumerate(lines):                                 # 10
        if "$" in re.sub(r"`[^`]*`", "", l):
            fails.append(f"line {i + 1}: dollar sign (persona money_format: write 4.2M / 1.04B, tickers without the cashtag sign)")
    in_ch, faces, beats, ch_name = False, 0, 0, None
    for i, l in enumerate(lines):                                 # 1-4, 8
        if re.match(r"^##\s+", l):
            if in_ch and beats == 0:
                fails.append(f"{ch_name}: no bold `**Beat N ...**` signpost (Convention 5)")
            in_ch, ch_name, beats = bool(re.match(r"^##\s+CH\s*\d", l, re.I)), l.strip(), 0
            continue
        s = l.strip()
        if not s or s.startswith("|") or s.startswith(">"):
            continue
        if re.match(r"^\*\*Beat\s+\d", s, re.I):
            beats += 1
            continue
        tags = line_tags(l)
        if tags:
            if "FACE" in tags:
                faces += 1
            rest = l[TAGGED_LINE.match(l).end():]
            if (set(tags) & SPOKEN) and (BARE_TAG.search(rest) or re.search(r"`\[(SHOW|NOTE|VERIFY)\]`", rest)):
                fails.append(f"line {i + 1}: a spoken line carries a direction tag mid-line (one job per line)")
            spoken_text = re.sub(r"\([^)]*\)", "", rest)             # (parens) = a note, not spoken
            m11 = SPELLED_NUMBER.search(spoken_text)
            if (set(tags) & SPOKEN) and m11 and not voice_clone and not SPELLED_YEAR.search(rest):   # 11
                fails.append(f"line {i + 1}: a number spelled out as words ('{m11.group(0)}'); numbers are digits on a line Mike reads (persona whole_number_format)")
            if (set(tags) & SPOKEN) and SPELLED_YEAR.search(rest) and not voice_clone:    # 9
                fails.append(f"line {i + 1}: a year spelled out as words ('{SPELLED_YEAR.search(rest).group(0)}'); years and dates are digits (persona year_and_date_format)")
            if "SAY-EXACT" in tags and not (set(tags) & {"FACE", "COVER"}):
                fails.append(f"line {i + 1}: a locked `[SAY-EXACT]` line must carry its gate (`[FACE]` or `[COVER]`) written out")
            elif "SAY-EXACT" in tags and tags[0] != "SAY-EXACT":
                warns.append(f"line {i + 1}: gate before `[SAY-EXACT]` (exemplar order is 🔒 `[SAY-EXACT]` first; --fix reorders)")
        elif STARTS_WITH_TAGISH.match(l) or (in_ch and BARE_TAG.search(l)):
            fails.append(f"line {i + 1}: tag not in canonical form (emoji + backticked tag, e.g. 🗣️ `[COVER]`): {s[:70]}")
    if in_ch and beats == 0:
        fails.append(f"{ch_name}: no bold `**Beat N ...**` signpost (Convention 5)")
    if face_max is not None and faces > face_max:                 # 8
        fails.append(f"{faces} `[FACE]` lines; this video allows at most {face_max}")
    return fails, warns, faces


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("screenplay")
    ap.add_argument("--face-max", type=int, default=None)
    ap.add_argument("--fix", action="store_true", help="apply the safe mechanical fixes in place, then lint")
    ap.add_argument("--voice-clone", action="store_true",
                    help="the script is read by the ElevenLabs voice clone: numbers and dates as WORDS are allowed (skips 9 and 11)")
    args = ap.parse_args()
    p = Path(args.screenplay)
    if not p.is_file():
        print(f"usage: no such file {p}", file=sys.stderr)
        sys.exit(2)
    text = p.read_text(encoding="utf-8")
    if args.fix:
        fixed = fix_text(text)
        if fixed != text:
            p.write_text(fixed, encoding="utf-8", newline="\n")
            print(f"--fix: rewrote {p.name} (tags backticked / locked-line order / em dashes)")
            text = fixed
    fails, warns, faces = lint(text, args.face_max, args.voice_clone)
    for w in warns:
        print(f"WARN  {w}")
    for f in fails:
        print(f"FAIL  {f}")
    print(f"SCREENPLAY-LINT {'FAIL' if fails else 'PASS'} faces={faces} fails={len(fails)} warns={len(warns)} file={p}")
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()

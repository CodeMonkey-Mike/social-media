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
 12. CLIP INSERTS ARE CONSIDERED (Mike, 2026-10-09; screenplay.md Convention 6, skills/clip-inserts/):
     a `## CLIP-INSERTS` section is REQUIRED, holding `| CLIP-<n> | ...` rows (each with a status) or the
     word NONE with the reason. The 🎞️ `[INSERT]` tag (a third-party clip with its OWN voice while the
     spine pauses) is a direction line that names its CLIP-<n>.
 14. NO 'HONEST' LEAD-IN on a spoken line ('the honest side', 'to be honest', 'honestly'): Mike reads it
     as deceitful (persona spoken_voice.word_choice_rules.no_honest_side_say_heres_the_thing, 2026-10-10);
     his lead-in is "Here's the thing".
 13. INSERT CROSS-CHECK: every `[INSERT]` line names a CLIP-<n> that the section lists; every listed row
     that is not REJECTED / HELD / DROPPED lands as an `[INSERT]` line in a chapter; a NONE section has
     no `[INSERT]` lines. WARN when the spoken line before an insert does not end its sentence (the
     set-up line's end is the splice point).
 15. NO PARENTHESES ON A SPOKEN LINE (Mike, 2026-10-15, tao-detailed GATE 1): a `[FACE]` / `[COVER]` /
     `[SAY-EXACT]` line is only the words Mike says, so a parenthesis on one is a FAIL. A direction, aside,
     word-swap or pronunciation goes on its own 💬 `[NOTE]` / 🎬 `[SHOW]` line; a placeholder spoken line
     ("🗣️ `[COVER]` (CH2 follows)") is never written (screenplay.md Conventions 3 and 5).
 16. MUSIC-MOOD-PLAN ROWS NAME THE CHAPTER (Mike, 2026-10-28, growth-scale-up GATE plan: "I often find myself
     scrolling up to find out what the title was"): every `| CH<n> ...` row of the `## MUSIC-MOOD-PLAN` table
     carries the chapter's title as in its `## CH<n> - TITLE` heading (`CH1 THE HOOK`, a time range may follow),
     a bare `CH1` is a FAIL; a title that does not match its heading is a WARN. The bed column (`New bed?` /
     `Bed / carve`) that says only "continues" is a WARN: it names the SECTION of the file that plays and how it
     is extended (remix loop) or right-aligned (music.md section ONE TRACK, CARVED).
 17. THE HANDOFF LINE ROTATES (Mike 2026-10-01, in code 2026-11-01 after left-behind scripted "So, let's dive into
     all this." AGAIN): the CH1 handoff ("So, let's ...") may not repeat any of the last 3 `recent_use` lines of
     persona.json dive_in_variants (other projects). The graph records the scripted line there when GATE 1 is
     approved (handoff_rotation.py), so the list can no longer go stale.
 18. CONTRACTIONS, THE WAY MIKE TALKS (Mike, 2026-11-10, AI destroying lives; persona word_choice_rules
     contractions_by_default): a FACE / COVER line never spells out a negative ("do not", "is not", "will not")
     or a common pronoun form followed by a word ("it is a", "that is why", "we are", "I am"); and "cannot" is
     only the emphasis "just cannot", everywhere else "can't".
 19. "AROUND", NEVER "ABOUT", IN FRONT OF A NUMBER (persona around_not_about_for_numbers, 2026-10-16, in code
     2026-11-10): "about 1.6 million" / "about a 4.2 million dollar" / "about half" FAIL; the topic sense
     ("talk about 3 things") is left alone.
     18 + 19: --fix rewrites them in place; verbatim quotes (double quotes) and code spans keep their own words;
     a SAY-EXACT line (Mike's locked wording) and a screenplay already RECORDED (a master in raw/) only WARN and
     are never rewritten.

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

EMOJI = {"FACE": "👤", "COVER": "🗣️", "SAY-EXACT": "🔒", "SHOW": "🎬", "NOTE": "💬", "VERIFY": "🔍", "INSERT": "🎞️"}
EMO = r"(?:👤|🗣️|🗣|🔒|🎬|💬|🔍|🎞️|🎞)"
TAGNAME = r"(?:FACE|COVER|SAY-EXACT|SHOW|NOTE|VERIFY|INSERT)"
HOLD = r"(?: HOLD)?"
# A canonical line HEAD: emoji + backticked tag, then any further backticked tags, each with or
# without its own emoji (the exemplars write a locked line as 🔒 `[SAY-EXACT]` `[FACE]`).
TAGGED_LINE = re.compile(r"^\s*" + EMO + r"\s*`\[" + TAGNAME + r"\]" + HOLD + r"`(?:\s*" + EMO + r"?\s*`\[" + TAGNAME + r"\]" + HOLD + r"`)*")
STARTS_WITH_TAGISH = re.compile(r"^\s*(?:" + EMO + r"\s*)?`?\[(?:FACE|COVER|SAY-EXACT|SHOW|NOTE|VERIFY|INSERT)")
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
# 18 + 19: Mike's spoken diction (persona spoken_voice.word_choice_rules, Mike 2026-11-10).
# "about" in front of a rough number -> "around" (the topic sense, "talk about 3 things", is left alone).
ABOUT_NUM = re.compile(r"\babout(?=\s+(?:an?\s+)?(?:\d|half\b|a\s+(?:third|quarter|dozen|hundred|thousand|million|billion)\b"
                       r"|(?:one|two|three|four|five|six|seven|eight|nine|ten)\s+(?:in|out\s+of)\s))", re.I)
ABOUT_TOPIC_WORDS = {"talk", "talks", "talked", "talking", "think", "thinks", "thinking", "thought", "know", "knew",
                     "care", "cares", "worry", "worries", "worried", "video", "videos", "story", "stories", "news",
                     "question", "questions", "ask", "asks", "asked", "asking", "learn", "learned", "read", "hear",
                     "heard", "say", "says", "said", "forget", "forgot", "wrong", "right", "post", "thread"}
# spelled-out negatives -> contractions; a bare "cannot" -> "can't" ("just cannot" is the sanctioned emphasis)
NEG_CONTRACT = {"do": "don't", "does": "doesn't", "did": "didn't", "is": "isn't", "are": "aren't", "was": "wasn't",
                "were": "weren't", "will": "won't", "would": "wouldn't", "should": "shouldn't", "could": "couldn't",
                "has": "hasn't", "have": "haven't", "had": "hadn't"}
NEG_RE = re.compile(r"\b(" + "|".join(NEG_CONTRACT) + r")\s+not\b", re.I)
CANNOT_RE = re.compile(r"\b(?:cannot|can\s+not)\b", re.I)
JUST_BEFORE = re.compile(r"\bjust\s*$", re.I)
# the common pronoun forms, only when a word follows (a sentence-final "that's what it is." cannot contract)
POS_CONTRACT = {("it", "is"): "it's", ("that", "is"): "that's", ("there", "is"): "there's", ("here", "is"): "here's",
                ("i", "am"): "I'm", ("we", "are"): "we're", ("you", "are"): "you're", ("they", "are"): "they're"}
POS_RE = re.compile(r"\b(" + "|".join(rf"{a}\s+{b}" for a, b in POS_CONTRACT) + r")\b(?=\s+[A-Za-z0-9])", re.I)
QUOTED = re.compile(r"(`[^`]*`|\"[^\"]*\"|“[^”]*”)")   # code spans and verbatim quotes keep their own words


def _case(src: str, repl: str) -> str:
    return repl[0].upper() + repl[1:] if src[:1].isupper() else repl


def _diction_sub(seg: str, found: list) -> str:
    """Rewrite one unquoted stretch of a spoken line; append each offending phrase to `found`."""
    def neg(m):
        found.append(m.group(0))
        return _case(m.group(0), NEG_CONTRACT[m.group(1).lower()])

    def cannot(m):
        if JUST_BEFORE.search(seg[: m.start()]):
            return m.group(0)
        found.append(m.group(0))
        return _case(m.group(0), "can't")

    def about(m):
        prev = re.search(r"(\w+)\W*$", seg[: m.start()])
        if prev and prev.group(1).lower() in ABOUT_TOPIC_WORDS:
            return m.group(0)
        found.append(m.group(0) + seg[m.end(): m.end() + 12].rstrip())
        return _case(m.group(0), "around")

    seg = NEG_RE.sub(neg, seg)                  # negatives first: "it is not" -> "it isn't", not "it's not"
    seg = CANNOT_RE.sub(cannot, seg)
    seg = POS_RE.sub(lambda m: (found.append(m.group(0)), _case(m.group(0), POS_CONTRACT[tuple(m.group(1).lower().split())]))[1], seg)
    return ABOUT_NUM.sub(about, seg)


def diction(rest: str):
    """(rewritten text, offending phrases) for the spoken part of a FACE / COVER line."""
    found = []
    parts = QUOTED.split(rest)
    return "".join(p if QUOTED.fullmatch(p) else _diction_sub(p, found) for p in parts), found


REQUIRED = [
    (r"^##\s+.*chapter map", "## CHAPTER MAP section"),
    (r"^\|\s*👤\s*`\[FACE\]`", "the tag legend table with backticked tags (a `| 👤 `[FACE]` |` row)"),
    (r"^##\s+CH\s*1\b", "## CH1 section"),
    (r"^##\s+MUSIC-MOOD-PLAN", "## MUSIC-MOOD-PLAN"),
    (r"^##\s+VISUAL-PLAN", "## VISUAL-PLAN"),
    (r"^##\s+CLIP-INSERTS", "## CLIP-INSERTS (clip inserts are CONSIDERED on every video: CLIP-<n> rows with a status, or NONE with the reason; Convention 6)"),
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


def fix_text(text: str, fix_diction: bool = True) -> str:
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
            fixed = re.sub(r"^(\s*)`\[(FACE|COVER|SAY-EXACT|SHOW|NOTE|VERIFY|INSERT)\]( HOLD)?`",
                           lambda m: f"{m.group(1)}{EMOJI[m.group(2)]} `[{m.group(2)}]{m.group(3) or ''}`", fixed)
            # locked lines: 🔒 `[SAY-EXACT]` FIRST, then the gate (exemplar order)
            head = TAGGED_LINE.match(fixed)
            if head:
                units = [u.strip() for u in UNIT_RE.findall(head.group(0))]
                if len(units) >= 2 and any("[SAY-EXACT]" in u for u in units) and "[SAY-EXACT]" not in units[0]:
                    units.sort(key=lambda u: 0 if "[SAY-EXACT]" in u else 1)
                    fixed = " ".join(units) + " " + fixed[head.end():].lstrip()
            head = TAGGED_LINE.match(fixed)
            tags = set(line_tags(fixed))
            # 18 + 19: contractions / "just cannot" / "around" on a FACE / COVER line (never a locked SAY-EXACT line)
            if fix_diction and head and (tags & SPOKEN) and "SAY-EXACT" not in tags:
                fixed = fixed[: head.end()] + diction(fixed[head.end():])[0]
            line = fixed
        out.append(line.replace("—", ", "))
    return "\n".join(out) + ("\n" if text.endswith("\n") else "")


def lint(text: str, face_max=None, voice_clone=False, recorded=False):
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
            if (set(tags) & SPOKEN) and (BARE_TAG.search(rest) or re.search(r"`\[(SHOW|NOTE|VERIFY|INSERT)\]`", rest)):
                fails.append(f"line {i + 1}: a spoken line carries a direction tag mid-line (one job per line)")
            if (set(tags) & SPOKEN) and re.search(r"[()]", re.sub(r"`[^`]*`", "", rest)):   # 15
                fails.append(f"line {i + 1}: parentheses on a spoken line; a `[FACE]` / `[COVER]` / `[SAY-EXACT]` line is only "
                             f"the words Mike says, so put the direction on its own 💬 `[NOTE]` or 🎬 `[SHOW]` line: {s[:70]}")
            spoken_text = re.sub(r"\([^)]*\)", "", rest)             # parens are a FAIL above (15); keep 11/14 from double-reporting them
            m11 = SPELLED_NUMBER.search(spoken_text)
            if (set(tags) & SPOKEN) and m11 and not voice_clone and not SPELLED_YEAR.search(rest):   # 11
                fails.append(f"line {i + 1}: a number spelled out as words ('{m11.group(0)}'); numbers are digits on a line Mike reads (persona whole_number_format)")
            if (set(tags) & SPOKEN) and SPELLED_YEAR.search(rest) and not voice_clone:    # 9
                fails.append(f"line {i + 1}: a year spelled out as words ('{SPELLED_YEAR.search(rest).group(0)}'); years and dates are digits (persona year_and_date_format)")
            if (set(tags) & SPOKEN) and re.search(r"\bhonest(?:ly)?\b", spoken_text, re.I):   # 14
                fails.append(f"line {i + 1}: an 'honest' lead-in on a spoken line (Mike reads it as deceitful); say \"Here's the thing\" (persona word_choice_rules)")
            if set(tags) & SPOKEN:                                    # 18 + 19
                found = diction(spoken_text)[1]
                if found:
                    msg = (f"line {i + 1}: not how Mike talks: {', '.join(repr(f) for f in found[:6])}; write contractions "
                           "(don't, isn't, it's), 'cannot' only as 'just cannot', 'around' (never 'about') before a number "
                           "(persona word_choice_rules; --fix rewrites them)")
                    if "SAY-EXACT" in tags:
                        warns.append(msg + " [a locked SAY-EXACT line: Mike's own wording, never rewritten; raise it at the gate]")
                    elif recorded:
                        warns.append(msg + " [already recorded: raw/ holds a master, so the take is what gets built]")
                    else:
                        fails.append(msg)
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
    # 12 + 13: clip inserts are CONSIDERED (section) and consistent (ids both ways)
    sec = re.search(r"^##\s+CLIP-INSERTS.*?(?=^##\s|\Z)", text, re.M | re.S)
    sec_txt = sec.group(0) if sec else ""
    listed = {}
    for row in sec_txt.splitlines():
        m = re.match(r"^\|\s*(CLIP-\d+)\b", row)
        if m:
            listed[m.group(1)] = row
    none_declared = bool(re.search(r"\bNONE\b", sec_txt)) and not listed
    tagged = {}
    for i, l in enumerate(lines):
        if "INSERT" not in line_tags(l):
            continue
        ids = re.findall(r"\bCLIP-\d+\b", l)
        if not ids:
            fails.append(f"line {i + 1}: an `[INSERT]` line names no CLIP-<n> id (the `## CLIP-INSERTS` row it plays)")
        for cid in ids:
            tagged.setdefault(cid, i + 1)
        prev = next((lines[j] for j in range(i - 1, -1, -1) if set(line_tags(lines[j])) & SPOKEN), None)
        if prev is not None and not re.search(r"[.!?][\"”'’)*_>]*\s*$", prev.rstrip()):
            warns.append(f"line {i + 1}: the spoken line before this `[INSERT]` does not end its sentence; the set-up line's end is the splice point (Convention 6)")
    if sec and not listed and not none_declared:
        fails.append("## CLIP-INSERTS must list `| CLIP-<n> | ...` rows (each with a status) or say NONE with the reason")
    for cid, ln in tagged.items():
        if cid not in listed:
            fails.append(f"line {ln}: `[INSERT]` {cid} is not a row of `## CLIP-INSERTS`")
    for cid, row in listed.items():
        if re.search(r"\b(REJECTED|HELD|DROPPED|DECLINED)\b", row, re.I):
            continue
        if cid not in tagged:
            fails.append(f"## CLIP-INSERTS lists {cid} as proposed but no chapter carries a 🎞️ `[INSERT]` {cid} line (add it, or mark the row REJECTED / HELD)")
    if none_declared and tagged:
        fails.append("## CLIP-INSERTS says NONE but the chapters carry `[INSERT]` lines")
    # 16: MUSIC-MOOD-PLAN rows NAME THE CHAPTER, and the bed column says what plays (never a bare "continues")
    mm = re.search(r"^##\s+MUSIC-MOOD-PLAN.*?(?=^##\s|\Z)", text, re.M | re.S)
    if mm:
        titles = {m.group(1).replace(" ", "").upper(): m.group(2).strip()
                  for m in re.finditer(r"^##\s+(CH\s*\d+)\s*[-:]\s*([^\n(]+)", text, re.M)}
        off = text[: mm.start()].count("\n")
        bed_col = None
        for j, row in enumerate(mm.group(0).splitlines()):
            if not row.lstrip().startswith("|"):
                continue
            cells = [c.strip() for c in row.strip().strip("|").split("|")]
            if bed_col is None and any(re.search(r"\b(bed|carve)\b", c, re.I) for c in cells):   # the header row
                bed_col = next(i for i, c in enumerate(cells) if re.search(r"\b(bed|carve)\b", c, re.I))
                continue
            m = re.match(r"(CH\s*\d+)\b(.*)", cells[0], re.I) if cells else None
            if not m:
                continue
            cid = m.group(1).replace(" ", "").upper()
            rest = re.sub(r"\(.*?\)|[*`_]", "", m.group(2)).strip(" -:·")
            if not rest:
                fails.append(f"line {off + j + 1}: MUSIC-MOOD-PLAN row {cid} names no chapter title; write `{cid} {titles.get(cid, 'TITLE')}` "
                             "(Mike 2026-10-28: the plan reads without scrolling back to the heading)")
            elif cid in titles and titles[cid].lower()[:12] not in rest.lower():
                warns.append(f"line {off + j + 1}: MUSIC-MOOD-PLAN row {cid} says '{rest[:30]}' but the chapter heading is '{titles[cid]}'")
            if bed_col is not None and bed_col < len(cells) and \
               re.fullmatch(r"(\*\*)?(continues?|same(\s+(bed|file|region))?|cont\.?)(\*\*)?(\s*\([^)]*\))?\.?", cells[bed_col], re.I):
                warns.append(f"line {off + j + 1}: MUSIC-MOOD-PLAN row {cid} bed column says only '{cells[bed_col]}'; name the section of the "
                             "file that plays and how it is extended or right-aligned (music.md ONE TRACK, CARVED, Mike 2026-10-28)")
    return fails, warns, faces, len(tagged)


def main():
    sys.path.insert(0, str(Path(__file__).resolve().parent))
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
    # 18 + 19 on a screenplay Mike already RECORDED (a master in raw/): WARN only, never rewritten (the take is built)
    raw = p.resolve().parent / "raw"
    recorded = raw.is_dir() and any(f.suffix.lower() in {".mkv", ".mp4", ".mov"} for f in raw.iterdir() if f.is_file())
    if args.fix:
        fixed = fix_text(text, fix_diction=not recorded)
        if fixed != text:
            p.write_text(fixed, encoding="utf-8", newline="\n")
            print(f"--fix: rewrote {p.name} (tags backticked / locked-line order / em dashes / contractions / around)")
            text = fixed
    fails, warns, faces, inserts = lint(text, args.face_max, args.voice_clone, recorded)
    try:                                                          # 17
        import handoff_rotation as HR
        line = HR.find_handoff(text)
        hit = HR.blocked(p.resolve().parent.name).get(HR.norm(line)) if line else None
        if hit:
            msg = (f"handoff line '{line}' repeats a recent video ({hit}); pick a line from persona.json "
                   "dive_in_variants that is not in the last 3 of recent_use (screenplay.md, the handoff rotation)")
            # already recorded (a master in raw/): the line is said; a later approval of ANOTHER video must not
            # fail this one's re-drive (2026-11-10: canton's GATE 1 recorded the line AI destroying lives had also scripted)
            (warns if recorded else fails).append(msg + (" [already recorded: raw/ holds a master]" if recorded else ""))
    except Exception as e:   # the persona file is the rule's input; a read error is reported, never a silent pass
        warns.append(f"handoff rotation not checked: {e}")
    for w in warns:
        print(f"WARN  {w}")
    for f in fails:
        print(f"FAIL  {f}")
    print(f"SCREENPLAY-LINT {'FAIL' if fails else 'PASS'} faces={faces} fails={len(fails)} warns={len(warns)} inserts={inserts} file={p}")
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()

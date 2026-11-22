"""script_common.py: the SCRIPT.md parser shared by lint_script.py and cue_script.py.

The format is documented in script.md (this folder); SCRIPT.reference.md is the lint-clean skeleton.
Nothing here judges the script: it only reads it into a structure. lint_script.py is the gate.

A SCRIPT.md is WRITTEN like a longform-edited screenplay (Mike 2026-11-16: "why make this file any different?"): the
same tags, each with its emoji and in code ticks, under the same `## CH<n> - <TITLE>` headings.
  spoken:  `[SCREENSHARE]` the recording as filmed  |  `[COVER]` a card fills the whole frame
           `[FACE]` Mike on his full-camera OBS scene, his face centred (at most FACE_SCENES_MAX scenes; 2026-11-22)
  silent:  `[SHOW]` <card>[.<state>]: what is on screen for the `[COVER]` lines ABOVE it (back to the previous `[SHOW]`
           line, `[SCREENSHARE]` line or heading)  |  `[NOTE]` a note to Mike
So a `[COVER]` line carries no card name: its card and state come from the `[SHOW]` line under it.

parse(text) -> {
  "settings": {key: value}            the header table (before the first `## ` heading)
  "cards":    {id: {"kind", "shows", "states": [..], "numbers", "n"}}   the `## CARDS` table
  "lines":    [ {"n", "tag", "card", "state", "text", "raw", "section"} ]   every SPOKEN line under a chapter heading
                                      (a `[COVER]` line's card / state are filled in from its `[SHOW]` line)
  "shows":    [ {"n", "card", "state", "text", "lines": [n, ..]} ]   every `[SHOW]` line + the `[COVER]` lines it covers
  "tagged":   [ (n, tag, written) ]   every known tag, and whether it is written the screenplay way (emoji + code ticks)
  "problems": [ (n, message) ]        structural problems found while reading (lint turns them into FAILs)
}
`text` is what Mike says: the line after its tag with every `(parenthesis)` direction removed.
"""
import re

KINDS = ("card", "chart-still", "animated-chart")
SETTINGS = ("project", "channel", "silence", "enhance speech")
# The EXTRAS Mike may name when he starts the video (2026-11-15; script.md, "The extras"): optional header rows, a
# missing row = off. `vertical` on | off (the full 9:16 cut), `short` off | on | <seconds> (on = 30), `yt post` on | off.
EXTRAS = ("vertical", "short", "yt post")
SHORT_DEFAULT_S = 30
SPOKEN_TAGS = ("COVER", "SCREENSHARE", "FACE")
# a FACE SCENE = consecutive `[FACE]` lines (a `[NOTE]` between them does not split it). Mike 2026-11-22: "a few screenshare
# scenes, and up to 2 face scenes" (script.md, "Face scenes").
FACE_SCENES_MAX = 2
SILENT_TAGS = ("SHOW", "NOTE")
# How each tag is WRITTEN: its emoji, then the tag in code ticks, exactly as a longform-edited screenplay writes it, so a
# script previews like a screenplay. The emoji are the screenplay lint's own table (lint_screenplay.EMOJI); this copy
# keeps the parser import-free and lint_script.py fails if the two ever differ.
EMOJI = {"SCREENSHARE": "\U0001F5A5️", "COVER": "\U0001F5E3️", "FACE": "\U0001F464", "SHOW": "\U0001F3AC", "NOTE": "\U0001F4AC"}

TAG_RE = re.compile(r"^\[([A-Za-z][A-Za-z-]*)(?:[ \t]+([^\]]*))?\][ \t]*(.*)$")
LEAD = re.compile(r"^([^\x00-\x7f]+)[ \t]*")             # the tag's emoji
TICKED_TAG = re.compile(r"^`(\[[^\]`]*\])`")             # the tag in code ticks (a gray chip in the Markdown preview)
SHOW_REF = re.compile(r"^`?([A-Za-z][A-Za-z0-9_-]*?)(?:\.([A-Za-z0-9_-]+))?`?[ \t]*:[ \t]*(.*)$")
CHAPTER_RE = re.compile(r"^(?:CH[ \t]*\d|SLIDE\b)", re.I)  # `## CH3 - THE GRAPH` (the screenplay's heading); `## SLIDE 3 - ...` still reads
PAREN = re.compile(r"\([^()]*\)")
SEP_ROW = re.compile(r"^\|[\s:|-]+\|?$")
LIST_MARK = re.compile(r"^(?:[-*+]|\d+\.)[ \t]+")


def cells(row):
    return [c.strip() for c in row.strip().strip("|").split("|")]


def spoken_text(rest):
    """The words Mike says: the tagged line without its `(directions)`, whitespace squeezed."""
    prev = None
    while prev != rest:                     # nested parentheses: peel from the inside out
        prev, rest = rest, PAREN.sub(" ", rest)
    return re.sub(r"\s+", " ", rest).strip()


def parse(text):
    settings, cards, lines, shows, tagged, problems = {}, {}, [], [], [], []
    section, kind = None, "head"            # head | cards | slide | other
    pending = []                            # the `[COVER]` lines still waiting for the `[SHOW]` line under them

    def scene_ends():
        for e in pending:
            problems.append((e["n"], "a `[COVER]` line with no `[SHOW]` line under it: the `[SHOW]` line names the card that "
                                     "covers it (`[SHOW]` <card>: what it shows) and comes before the next `[SCREENSHARE]` "
                                     "line or heading"))
        pending.clear()

    for n, raw in enumerate(text.splitlines(), 1):
        s = raw.strip()
        if re.match(r"^##\s+", s):
            scene_ends()
            section = re.sub(r"^##\s+", "", s).strip()
            up = section.upper()
            kind = "cards" if up.startswith("CARDS") else "slide" if CHAPTER_RE.match(up) else "other"
            continue
        if not s or s.startswith("#") or s.startswith(">") or s.startswith("<!--"):
            continue
        if s.startswith("|"):
            if SEP_ROW.match(s):
                continue
            c = cells(s)
            if kind == "head" and len(c) >= 2 and c[0].lower().strip("`") == "covers":
                # a cover always fills the whole frame: there is no setting for it (Mike 2026-11-14; script.md)
                problems.append((n, "remove the `covers` row from the header: a cover always fills the whole frame, there is no "
                                    "setting for it (scripted = screen-share scenes + full-screen cover scenes)"))
            elif kind == "head" and len(c) >= 2 and c[0].lower().strip("`") in SETTINGS + EXTRAS:
                settings[c[0].lower().strip("`")] = c[1]
            elif kind == "cards" and c and c[0].lower() != "id":
                cid = c[0].strip("`")
                row = {"kind": (c[1].lower().strip("`") if len(c) > 1 else ""), "shows": c[2] if len(c) > 2 else "",
                       "states": [x.strip().strip("`") for x in re.split(r"[,;]", c[3]) if x.strip().strip("`- ")] if len(c) > 3 else [],
                       "numbers": c[4] if len(c) > 4 else "", "n": n}
                if cid in cards:
                    problems.append((n, f"card id {cid} is listed twice in the CARDS table"))
                cards[cid] = row
            continue
        body = LIST_MARK.sub("", s)
        lead = LEAD.match(body)
        emoji = lead.group(1) if lead else ""
        body = body[lead.end():] if lead else body
        ticked = bool(TICKED_TAG.match(body))
        m = TAG_RE.match(TICKED_TAG.sub(r"\1", body))
        if m:
            tag, arg, rest = m.group(1).upper(), (m.group(2) or "").strip().strip("`"), m.group(3)
            if kind != "slide":
                problems.append((n, f"a tagged line outside a `## CH<n>` section ({section or 'the header'}): {s[:60]}"))
                continue
            if tag in EMOJI:
                tagged.append((n, tag, ticked and emoji == EMOJI[tag]))
            if tag == "NOTE":
                continue                     # a note to Mike: never spoken, never cued
            if tag == "SHOW":
                r = None if arg else SHOW_REF.match(rest.strip())
                sh = {"n": n, "card": r.group(1) if r else None, "state": r.group(2) if r else None,
                      "text": (r.group(3) if r else rest).strip(), "lines": [e["n"] for e in pending]}
                if not r:
                    problems.append((n, "`[SHOW]` starts with the card it shows, then a colon: `[SHOW]` <card>: what it shows, or "
                                        f"`[SHOW]` <card>.<state>: what is lit: {s[:60]}"))
                elif not pending:
                    problems.append((n, "a `[SHOW]` line with no `[COVER]` line above it: it names the card for the `[COVER]` lines "
                                        "since the last `[SHOW]` (what a `[SCREENSHARE]` scene shows goes in a `[NOTE]`)"))
                for e in pending:
                    e["card"], e["state"] = sh["card"], sh["state"]
                pending.clear()              # a broken `[SHOW]` is reported once, here, not again per line above it
                shows.append(sh)
                continue
            entry = {"n": n, "tag": tag, "card": None, "state": None, "text": spoken_text(rest), "raw": raw, "section": section}
            if tag == "COVER":
                if arg:
                    problems.append((n, "`[COVER]` takes no card name: the `[SHOW]` line under it names the card, the way a "
                                        f"screenplay is written: {s[:60]}"))
                pending.append(entry)
            elif tag in ("SCREENSHARE", "FACE"):
                scene_ends()
                if arg:
                    problems.append((n, f"`[{tag}]` takes no argument (the recording plays as filmed"
                                        + (", his face centred" if tag == "FACE" else "") + f"): {s[:60]}"))
            lines.append(entry)
            continue
        if kind != "slide":
            continue                         # prose outside the chapter sections is a note
        if s.startswith("(") and s.endswith(")"):
            continue                         # a direction on its own line, never spoken
        if re.fullmatch(r"\*\*[^*]+\*\*:?", s):
            continue                         # a bold signpost label on its own line
        lines.append({"n": n, "tag": None, "card": None, "state": None, "text": spoken_text(s), "raw": raw, "section": section})
    scene_ends()
    return {"settings": settings, "cards": cards, "lines": lines, "shows": shows, "tagged": tagged, "problems": problems}


def extras(settings):
    """The extras named in the header -> ({"vertical": bool, "short": seconds (0 = off), "yt_post": bool}, [problems]).
    A missing row is off. `short` takes off | on (= SHORT_DEFAULT_S) | a number of seconds ("30", "45 s")."""
    out, bad = {"vertical": False, "short": 0, "yt_post": False}, []
    for key, name in (("vertical", "vertical"), ("yt post", "yt_post")):
        v = (settings.get(key) or "off").strip().strip("`").lower()
        if v not in ("on", "off"):
            bad.append(f"header: `{key}` must be on | off, got '{settings.get(key)}'")
        out[name] = v == "on"
    v = (settings.get("short") or "off").strip().strip("`").lower()
    m = re.fullmatch(r"(\d+)\s*(?:s|sec|secs|seconds)?", v)
    if v in ("on", "off"):
        out["short"] = SHORT_DEFAULT_S if v == "on" else 0
    elif m and 15 <= int(m.group(1)) <= 60:
        out["short"] = int(m.group(1))
    else:
        bad.append(f"header: `short` must be off | on | a length in seconds from 15 to 60, got '{settings.get('short')}'")
    return out, bad


def face_scenes(lines):
    """[[line n, ...], ...]: the FACE SCENES, each a run of consecutive `[FACE]` lines (spoken lines only, so a `[NOTE]`
    or a `[SHOW]` line between two `[FACE]` lines never splits a scene)."""
    out, prev = [], None
    for e in lines:
        if e["tag"] == "FACE":
            if prev == "FACE":
                out[-1].append(e["n"])
            else:
                out.append([e["n"]])
        prev = e["tag"]
    return out


def card_file(card, state):
    """The still's file name for a card / state: `<id>.png` or `<id>-<state>.png` (the builders' naming)."""
    return f"{card}-{state}.png" if state else f"{card}.png"

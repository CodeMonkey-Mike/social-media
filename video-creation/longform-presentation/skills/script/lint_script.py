#!/usr/bin/env python
"""lint_script.py: the SCRIPT.md format gate for the SCRIPTED option of longform-presentation format 4.

Read script.md (this folder) first; SCRIPT.reference.md is the lint-clean skeleton.

  python lint_script.py "media/standard/<p>/SCRIPT.md" [--research "media/standard/<p>/RESEARCH.md"]

FAIL (exit 1):
  - a header setting missing or not allowed (project, channel, silence, enhance speech on | off), or a `covers` row
    (a cover always fills the whole frame: there is no setting for it, Mike 2026-11-14)
  - an EXTRAS row with a value that is not allowed (all three rows are optional, a missing row is off; Mike 2026-11-15):
    `vertical` on | off, `short` off | on | seconds 15 to 60, `yt post` on | off
  - no `## CARDS` table, a card with an unknown kind, an animated-chart with states
  - two cards / states that would be the same still file (`<id>.png`, `<id>-<state>.png`)
  - a spoken line with no tag, an unknown tag, a `[FACE]` tag (no face scenes in v1), a tagged line with no words
  - a tag not written the screenplay way (its emoji, then the tag in code ticks), or a `[COVER]` carrying a card name
  - a `[COVER]` line with no `[SHOW]` line under it, a `[SHOW]` line with no `[COVER]` line above it, or one that does
    not start with `<card>:` / `<card>.<state>:`
  - a `[SHOW]` naming a card (or a state) that is not in the CARDS table
  - a card (or a declared state) in the table that no line uses
  - an em dash anywhere in the file
  - a spoken-word-rule violation. The rules are NOT copied here: every spoken line is run through the longform-edited
    screenplay gate (`longform-edited/skills/doc-reference/lint_screenplay.py`, persona spoken_voice.word_choice_rules),
    so both tracks always enforce the same list (contractions, "just cannot", "around" before a number, numbers and
    years as digits, no "honest" lead-in, no dollar sign).
WARN:
  - a number on a spoken line or in the CARDS table that RESEARCH.md does not contain (when RESEARCH.md is found)
  - a `[COVER]` line of 3 words or fewer (its card would flash by; merge it into its neighbour)
  - no `[SCREENSHARE]` line at all (allowed: the whole video is covered)

Machine line: SCRIPT-LINT PASS|FAIL lines=N covers=N screenshares=N cards=N fails=N warns=N
"""
import argparse
import importlib.util
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import script_common as SC  # noqa: E402

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

SCREENPLAY_LINT = HERE.parents[2] / "longform-edited" / "skills" / "doc-reference" / "lint_screenplay.py"
EM_DASH = chr(0x2014)
NUM_RE = re.compile(r"\d[\d,]*(?:\.\d+)?")


def screenplay_gate():
    """The longform-edited screenplay lint module (the one source of Mike's spoken-word rules), or None."""
    if not SCREENPLAY_LINT.is_file():
        return None
    spec = importlib.util.spec_from_file_location("lint_screenplay", SCREENPLAY_LINT)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def spoken_rule_fails(spoken):
    """Run every spoken line through lint_screenplay.lint() as a canonical COVER line; return {script line n: [messages]}.
    Only the per-line findings are kept (the screenplay's own section requirements do not apply to a SCRIPT.md)."""
    ls = screenplay_gate()
    if ls is None:
        return None
    synth = "\n".join(f"{ls.EMOJI['COVER']} `[COVER]` {e['text']}" for e in spoken)
    fails = ls.lint(synth)[0]
    out = {}
    for f in fails:
        m = re.match(r"^line (\d+): (.*)$", f, re.S)
        if not m:
            continue
        k = int(m.group(1)) - 1
        if 0 <= k < len(spoken):
            out.setdefault(spoken[k]["n"], []).append(m.group(2).replace("; --fix rewrites them", ""))
    return out


def numbers_in(text):
    """Number strings worth checking against RESEARCH.md: decimals, anything of 2+ digits. Commas dropped."""
    out = []
    for m in NUM_RE.finditer(text):
        v = m.group(0).replace(",", "").rstrip(".")
        if "." in v or len(v) >= 2:
            out.append(v)
    return out


def lint(text, research_text=None):
    fails, warns = [], []
    p = SC.parse(text)
    for n, msg in p["problems"]:
        fails.append(f"line {n}: {msg}")
    for n, tag, written in p["tagged"]:    # the script previews like a screenplay: emoji, then the tag as a gray chip
        if not written:
            fails.append(f"line {n}: write the tag the screenplay way, its emoji and then the tag in code ticks: "
                         f"{SC.EMOJI[tag]} `[{tag}]`")
    ls = screenplay_gate()
    drift = [t for t in SC.EMOJI if ls is not None and ls.EMOJI.get(t) != SC.EMOJI[t]]
    if drift:
        fails.append(f"script_common.EMOJI differs from the screenplay lint's for {', '.join(drift)}: both tracks write a "
                     "tag the same way, so fix the copy in script_common.py")
    for n, l in enumerate(text.splitlines(), 1):
        if EM_DASH in l:
            fails.append(f"line {n}: em dash (persona: never; use a comma, a period or a colon)")
    st = p["settings"]
    for k in SC.SETTINGS:
        if not st.get(k):
            fails.append(f"header: the settings table has no `{k}` row (script.md, 'The header')")
    if st.get("enhance speech") and st["enhance speech"].lower() not in ("on", "off"):
        fails.append(f"header: enhance speech must be on | off, got '{st['enhance speech']}'")
    ex, ex_bad = SC.extras(st)              # the optional extras rows (vertical, short, yt post): a missing row is off
    fails += ex_bad
    if ex["short"] and not ex["vertical"]:
        warns.append("header: `short` is on but `vertical` is off: the short is cut from the delivered vertical (script.md, 'The "
                     "extras'), so the vertical cut has to be built too")
    cards = p["cards"]
    if not cards:
        fails.append("no `## CARDS` table (every card a `[SHOW]` line names is listed there: id, kind, shows, states, numbers)")
    for cid, c in cards.items():
        if c["kind"] not in SC.KINDS:
            fails.append(f"line {c['n']}: card {cid} has kind '{c['kind']}'; allowed: {' | '.join(SC.KINDS)}")
        if c["kind"] == "animated-chart" and c["states"]:
            fails.append(f"line {c['n']}: card {cid} is an animated-chart and lists states; an animated chart is ONE clip "
                         "that plays over its lines (v1)")
    stills = {}                             # still file name -> the card / state that owns it (ids are plain words now,
    for cid, c in cards.items():            # so `record` + state `code` could collide with a card named `record-code`)
        for stt in [None] + list(c["states"]):
            name, owner = SC.card_file(cid, stt), cid + (f".{stt}" if stt else "")
            if name in stills:
                fails.append(f"line {c['n']}: {owner} and {stills[name]} would both be the file {name}; rename one of them")
            stills[name] = owner
    used, used_states = set(), {}
    spoken = []
    for e in p["lines"]:
        n, tag = e["n"], e["tag"]
        if tag is None:
            fails.append(f"line {n}: a spoken line with no tag; start it with {SC.EMOJI['SCREENSHARE']} `[SCREENSHARE]` or "
                         f"{SC.EMOJI['COVER']} `[COVER]`, or make it a {SC.EMOJI['NOTE']} `[NOTE]`: {e['raw'].strip()[:70]}")
            continue
        if tag == "FACE":
            fails.append(f"line {n}: `[FACE]` is not in v1 of the scripted option (no full-camera face scenes; script.md 'Not in v1')")
            continue
        if tag not in SC.SPOKEN_TAGS:
            fails.append(f"line {n}: unknown tag `[{tag}]`; a SCRIPT.md has four: `[SCREENSHARE]` and `[COVER]` (spoken), "
                         "`[SHOW]` and `[NOTE]` (not spoken)")
            continue
        if not e["text"]:
            fails.append(f"line {n}: a `[{tag}]` line with no spoken words (a direction is a `[NOTE]` line)")
            continue
        spoken.append(e)
        if tag == "COVER" and e["card"]:
            cid, stt = e["card"], e["state"]
            if cid not in cards:
                continue                    # reported once, on its `[SHOW]` line (below)
            used.add(cid)
            if stt:
                used_states.setdefault(cid, set()).add(stt)
            if len(e["text"].split()) <= 3:
                warns.append(f"line {n}: a `[COVER]` line of {len(e['text'].split())} word(s): its card would flash by; merge it "
                             "into the line before or after")
    for sh in p["shows"]:
        cid, stt = sh["card"], sh["state"]
        if cid is None:
            continue                        # a `[SHOW]` with no card name: already a problem from the parser
        if cid not in cards:
            fails.append(f"line {sh['n']}: `[SHOW]` names the card `{cid}`, which is not in the CARDS table")
        elif stt and stt not in cards[cid]["states"]:
            fails.append(f"line {sh['n']}: `[SHOW]` {cid}.{stt} names a state the CARDS table does not list for {cid} "
                         f"(listed: {', '.join(cards[cid]['states']) or 'none'})")
    for cid, c in cards.items():
        if cid not in used:
            fails.append(f"line {c['n']}: card {cid} is in the CARDS table but no `[SHOW]` line names it")
        for stt in c["states"]:
            if stt not in used_states.get(cid, set()):
                fails.append(f"line {c['n']}: card {cid} lists state '{stt}' but no `[SHOW]` line names {cid}.{stt}")
    if not spoken:
        fails.append("no spoken lines (tagged lines live under `## CH<n> - <TITLE>` headings)")
    rule = spoken_rule_fails(spoken)
    if rule is None:
        fails.append(f"the spoken-word rule source is missing: {SCREENPLAY_LINT} (the rules are reused from it, never copied)")
    else:
        for n in sorted(rule):
            for msg in rule[n]:
                if "em dash" in msg:
                    continue                    # already reported for the whole file
                fails.append(f"line {n}: {msg}")
    covers = sum(1 for e in spoken if e["tag"] == "COVER")
    shares = sum(1 for e in spoken if e["tag"] == "SCREENSHARE")
    if spoken and not shares:
        warns.append("no `[SCREENSHARE]` line: the whole video is covered (allowed; the recording is then never seen)")
    if research_text is not None:
        hay = research_text.replace(",", "")
        for e in spoken:
            miss = sorted({v for v in numbers_in(e["text"]) if v not in hay})
            if miss:
                warns.append(f"line {e['n']}: number(s) not found in RESEARCH.md: {', '.join(miss)}")
        for cid, c in cards.items():
            miss = sorted({v for v in numbers_in(c["numbers"]) if v not in hay})
            if miss:
                warns.append(f"line {c['n']}: card {cid} number(s) not found in RESEARCH.md: {', '.join(miss)}")
    return fails, warns, len(spoken), covers, shares, len(cards)


def main():
    ap = argparse.ArgumentParser(description="Format gate for a longform-presentation SCRIPT.md (scripted option).")
    ap.add_argument("script")
    ap.add_argument("--research", default=None, help="RESEARCH.md, the only number source (default: next to the script)")
    a = ap.parse_args()
    sp = Path(a.script)
    if not sp.is_file():
        print(f"no such file: {sp}")
        print("SCRIPT-LINT FAIL lines=0 covers=0 screenshares=0 cards=0 fails=1 warns=0")
        sys.exit(1)
    rp = Path(a.research) if a.research else sp.with_name("RESEARCH.md")
    research = rp.read_text(encoding="utf-8", errors="replace") if rp.is_file() else None
    text = sp.read_text(encoding="utf-8")
    fails, warns, n, covers, shares, ncards = lint(text, research)
    print(f"lint_script: {sp}")
    ex = SC.extras(SC.parse(text)["settings"])[0]
    print("  note  extras: vertical " + ("on" if ex["vertical"] else "off") + ", short "
          + (f"{ex['short']} s" if ex["short"] else "off") + ", yt post " + ("on" if ex["yt_post"] else "off"))
    if research is None:
        print(f"  note  no RESEARCH.md at {rp}: the number check was skipped")
    for f in fails:
        print(f"  FAIL  {f}")
    for w in warns:
        print(f"  WARN  {w}")
    print(f"SCRIPT-LINT {'FAIL' if fails else 'PASS'} lines={n} covers={covers} screenshares={shares} cards={ncards} "
          f"fails={len(fails)} warns={len(warns)}")
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()

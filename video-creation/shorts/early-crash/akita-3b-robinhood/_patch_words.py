"""_patch_words.py — build whisper-words-verified.json for early-crash/akita-3b-robinhood.

WHY (remotion-shorts-build SKILL, checklist item 3): "The word JSON can silently OMIT speech."
A whole-file whisper pass of the FINAL RENDER produced two runs that are NOT in the shipped
`whisper-words.json`, and both sit in the only two >1.0 s holes in its word stream:

  hole 42.32 -> 44.02 s (1.70 s)  ..."holy crap." [ ] "man, that's crazy, right?"
  hole 64.42 -> 67.84 s (3.42 s)  ..."hold on." [ ] "look at that."

Each was re-transcribed IN ISOLATION off this clip's own audio (medium.en, 1x, temperature 0):
  41.6-45.0 s -> "Holy crap. OOH. Man, that's crazy."      ooh    43.14-43.66
  65.0-67.3 s -> "LOOK AT THAT!"                            look   65.64-66.18 / at 66.18-66.36 / that 66.36-66.62
  64.6-67.6 s -> "LOOK AT THAT!"                            look   65.60-66.18 / at 66.18-66.36 / that 66.36-66.62
The two windows agree on the second run to within 0.04 s, and the whole-file pass of the render
agrees with both. A missing phrase CANNOT be fixed with a PHRASE_CORRECTION (a replacement may
never be longer than the run it matches), so the words are patched in here and the captions are
built from the patched file.

A third fix is a RELABEL, not a hole. The shipped pass emits a 0.42 s token at 106.48 labelled "if"
with probability 0.04 (i.e. garbage) and no "right?" anywhere, so the line captions as
"...this happen, if things like this happen...". EIGHT reads say otherwise: the whole-file pass of
the render, the whole-file pass of the encode-matched control, and 3+3 staggered short windows on
both, ALL return "...this happen, RIGHT? if things like this happen...". A word-timed control pass
of 104.8-108.2 s places right? at 106.58-106.70 and the real "if" at 106.82-106.86. So that token is
relabelled and the swallowed "if" is inserted after it.

NOT patched, deliberately:
 - a wide 62.5-69.5 s window also emits "Oh! Oh! Oh! Oh!" between 63.46 and 66.20. Neither tight
   window (65.0-67.3, 64.6-67.6) nor the isolated 61.3-68.6 s pass reproduces a single one of them,
   and a 4x repeated interjection is the classic whisper hallucination pattern on breath/mouse noise.
 - "just imagine how far, how far IT might go" (118.7 s). The clip's tighten plan flagged a possibly
   missing "it" and both WHOLE-FILE passes hear one, but 3+3 staggered short windows on the control
   AND the render return "how far might go" every time, and a word-timed control pass runs
   far(118.08-118.56) -> might(118.56-118.90) with no room for it. Long-window artifact; not added.
Only runs that reproduce across passes at SHORT windows go on screen.

Run:  python _patch_words.py     (idempotent; rewrites whisper-words-verified.json from scratch)
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "whisper-words.json")
DST = os.path.join(HERE, "whisper-words-verified.json")

# (word, start, end) — inserted in time order into the segment that contains the hole
INSERTS = [
    ("Ooh.", 43.14, 43.66),
    ("Look", 65.62, 66.18),
    ("at", 66.18, 66.36),
    ("that.", 66.36, 66.62),
    ("if", 106.74, 106.88),
]
# (start_of_token_to_relabel, expected_old_word, new_word, new_end)
RELABELS = [
    (106.48, "if", "right?", 106.70),
]

data = json.load(open(SRC, encoding="utf-8"))
for s, old, new, end in RELABELS:
    for seg in data["segments"]:
        for x in seg.get("words", []):
            if abs(x["start"] - s) < 0.02 and x["word"].strip().lower() == old:
                x["word"] = " " + new
                x["end"] = end
                x["probability"] = 0.9
                break
for w, s, e in INSERTS:
    tok = {"word": " " + w, "start": s, "end": e, "probability": 0.9}
    for seg in data["segments"]:
        words = seg.get("words") or []
        if not words:
            continue
        if words[0]["start"] <= s <= words[-1]["end"]:
            if any(abs(x["start"] - s) < 0.05 and x["word"].strip() == w for x in words):
                break  # already patched
            i = next((k for k, x in enumerate(words) if x["start"] > s), len(words))
            words.insert(i, tok)
            break
    else:
        raise SystemExit(f"no segment spans {s}s for {w!r}")

data["text"] = " ".join(x["word"].strip() for seg in data["segments"] for x in seg.get("words", []))
json.dump(data, open(DST, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
n = sum(len(seg.get("words", [])) for seg in data["segments"])
print(f"wrote {DST}  ({n} words, +{len(INSERTS)})")

"""_patch_words.py - build whisper-words-verified.json for early-crash/akita-3b-robinhood-impact.

WHY (remotion-shorts-build SKILL, checklist item 3): "The word JSON can silently OMIT speech."
This clip's shipped `whisper-words.json` has exactly two >1.5 s holes in its word stream, and BOTH
contain speech:

  hole  7.12 -> 12.32 s (5.20 s)   ..."hold on." [ ] "look at that."
  hole 17.58 -> 19.62 s (2.04 s)   ..."oh my god." [ ] "3 billion."

Neither hole is silence. In both, the content zone is one of Mike's own livestream REACTION-MEME
clips (measured: chart-crop luminance jumps from ~33 to ~104-168 for 6.90-11.90 s and 17.40-19.10 s),
and he keeps talking over them. A whole-file medium.en pass of the FINAL RENDER surfaced both runs,
and each was then re-transcribed IN ISOLATION off the ENCODE-MATCHED CONTROL (the bare spine through
the same 48 kHz AAC chain), medium.en, 1x, word timestamps:

  hole 1   8.50-12.60 -> "Look at that!"   at 10.34-10.50 / that! 10.50-10.82
           9.00-12.20 -> "Look at that!"   at 10.36-10.52 / that! 10.52-10.80
           7.50-12.00 -> "Look at that!"   look 9.76-10.36 (the only window that starts far enough
                                           before the word for its onset to be unclamped)
  hole 2  16.90-20.10 -> "Oh my god. Look at that."      at 18.44-19.12 / that. 19.12-19.50
          17.20-19.80 -> "Woo! Look at that!"            look 18.80-18.94 / at 18.94-19.14 / that! 19.14-19.50
          17.60-20.20 -> "Whoa, look at that"            at 18.96-19.16 / that 19.16-19.54
          18.00-19.90 -> "Look at that!"                 at 18.92-19.14 / that! 19.14-19.52

Four windows agree on hole 2's "at"/"that" to within 0.04 s and three windows agree on hole 1's.
The RENDER and the CONTROL return the identical words in both holes, so the riser that runs
17.07-19.62 masks nothing (only a p=0.05 phantom differs). A missing phrase CANNOT be fixed with a
PHRASE_CORRECTION (a replacement may never be longer than the run it matches), so the words are
patched in here and the captions are built from the patched file.

NOT patched, deliberately:
 - the pre-exclamation in hole 2. One window hears "Woo!" (p 0.05), another "Whoa," (p 0.51), two
   others hear nothing at all. Four passes that disagree on the word is not a word; only runs that
   reproduce across passes at SHORT windows go on screen.
 - "rebuild" (19.54-19.86, p 0.55) from the 17.60-20.20 window: that span is the "3 billion" onset,
   which the shipped pass already covers at 19.62. Classic long-window bleed.

Run:  python _patch_words.py     (idempotent; rewrites whisper-words-verified.json from scratch)
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "whisper-words.json")
DST = os.path.join(HERE, "whisper-words-verified.json")

# Both holes fall BETWEEN segments (segment 7 ends 7.12, segment 8 starts 12.32; segment 11 ends
# 17.58, segment 12 starts 19.62), so each restored run is inserted as its OWN segment in time order
# rather than into an existing one.
RESTORED = [
    [("Look", 9.76, 10.36), ("at", 10.36, 10.52), ("that.", 10.52, 10.80)],
    [("Look", 18.80, 18.93), ("at", 18.93, 19.14), ("that.", 19.14, 19.52)],
]

data = json.load(open(SRC, encoding="utf-8"))
for run in RESTORED:
    words = [{"word": " " + w, "start": s, "end": e, "probability": 0.9} for w, s, e in run]
    t0, t1 = run[0][1], run[-1][2]
    if any(any(abs(x["start"] - t0) < 0.05 for x in seg.get("words", [])) for seg in data["segments"]):
        continue  # already patched
    seg = {"start": t0, "end": t1, "text": " " + " ".join(w for w, _, _ in run), "words": words}
    i = next((k for k, s in enumerate(data["segments"]) if s["start"] > t0), len(data["segments"]))
    data["segments"].insert(i, seg)

data["text"] = " ".join(x["word"].strip() for seg in data["segments"] for x in seg.get("words", []))
json.dump(data, open(DST, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
n = sum(len(seg.get("words", [])) for seg in data["segments"])
print(f"wrote {DST}  ({n} words, +{sum(len(r) for r in RESTORED)})")

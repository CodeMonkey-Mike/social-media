"""tutorial / clip 3 (binance-kaspa-catch22) — whisper-words.json -> whisper-words-verified.json.

⛔ WHY: the shipped word pass SILENTLY OMITS SPEECH (the failure mode the remotion-shorts-build
contract calls out: "the word JSON can silently OMIT speech ... patch the words into a
whisper-words-verified.json and build from that"). Two of the fillers the clip's TIGHTEN PLAN
explicitly requires on screen are missing from it, and a missing phrase can NOT be repaired with a
PHRASE_CORRECTION (a replacement may never be longer than the run it matches).

The tighten plan's caption gate: "the surviving segment 1 fillers MUST appear in captions ('when the
bulls start to run, you know, like I would expect Kaspa to be skyrocketing')".

  (A) 27.92-28.04  "you know"      — the shipped pass jumps "said," (ends 27.92) straight to a
      "when" at 28.04 whose probability is 0.03, i.e. the decoder telling you it has nothing there.
      TWO independent 1x medium.en windows on this clip's own audio (26.30-31.96 and 25.60-29.40)
      both return "...like I said, YOU KNOW when the bulls..." with "you"/"know" at 27.96-28.10.
  (B) 29.22-29.72  "you know, like" — the shipped pass has a 0.50 s HOLE between "run," (ends 29.22)
      and "I" (29.72). The same two medium.en windows both return "...start to run, YOU KNOW LIKE I
      would expect..." with you 29.26-29.28, know 29.28-29.48, like 29.48-29.86.

Inserted timings are clipped to the free space between the neighbouring shipped tokens so the word
stream stays strictly monotonic and no shipped timing is moved.

Run from the repo root:
  python video-creation/shorts/tutorial/binance-kaspa-catch22/_patch_words.py
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "whisper-words.json")
DST = os.path.join(HERE, "whisper-words-verified.json")

# (insert_before_start, [(word, start, end), ...])
PATCHES = [
    (28.04, [(" you", 27.930, 27.985), (" know,", 27.985, 28.040)]),
    (29.72, [(" you", 29.260, 29.380), (" know,", 29.380, 29.500),
             (" like", 29.520, 29.700)]),
]

d = json.load(open(SRC, encoding="utf-8"))
words = []
for seg in d["segments"]:
    for w in seg.get("words", []):
        words.append(dict(w))

out, added = [], 0
for w in words:
    for at, ins in PATCHES:
        if abs(w["start"] - at) < 1e-6:
            for tok, s, e in ins:
                out.append({"word": tok, "start": s, "end": e, "probability": 0.90})
                added += 1
    out.append(w)

assert added == 5, f"expected 5 inserted tokens, got {added}"
for a, b in zip(out, out[1:]):
    assert a["start"] <= b["start"] + 1e-9, f"non-monotonic at {a} -> {b}"

text = "".join(w["word"] for w in out)
json.dump({"text": text,
           "segments": [{"id": 0, "start": out[0]["start"], "end": out[-1]["end"],
                         "text": text, "words": out}],
           "language": "en"},
          open(DST, "w", encoding="utf-8"), indent=1)
print(f"wrote {DST}: {len(words)} -> {len(out)} words (+{added})")

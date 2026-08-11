"""tutorial / clip 7 (binance-kaspa-catch22-impact) — whisper-words.json -> whisper-words-verified.json.

⛔ AUDIT RESULT, stated plainly: **ZERO words are restored.** This clip's shipped word pass does NOT
drop any speech. That is a MEASURED finding, not an assumption, and it is the opposite of the clip-1
finding on this same batch (1.80 s of speech silently dropped there). What this file does instead is
RE-ANCHOR TWO WORD ONSETS onto measured RMS energy, which is the other documented defect of this
batch's word JSONs ("onsets off by up to 1.07 s ... anchor every timing decision on 5-10 ms RMS").

Method: 10 ms window / 5 ms hop RMS at -50 dB on the STAGED spine
(render-assets/binance-kaspa-catch22-impact.mp4, 19.017 s). 14 voiced runs, 16.785 s voiced.
Coverage audit (voiced audio with no overlapping word token, >= 0.12 s) found exactly three spans,
and all three are late/early TOKEN BOUNDARIES inside a continuous voiced run, never missing speech:

  (i)   5.270-5.500 (0.230 s)  the /b/ + "Bi-" of "Binance", the FIRST word of the contradiction
        segment. Whisper's " Binance" token is only 5.500-5.700 (0.20 s), far too short for the word.
        An isolated 1x medium.en decode of 5.10-6.20 returns "Finance gives the" (the band-limited /b/
        is heard as /f/), i.e. nothing but Binance lives in that span. The sibling FULL cut (clip 3,
        SAME AUDIO, independent decode) shows the identical error: its " Binance" is 13.080-13.260
        against a voiced-run onset at 12.850, also 0.230 s late.  -> RE-ANCHORED to 5.270.
  (ii) 10.280-10.440 (0.160 s)  the /n/ release of "coin." running into the /D/ of "They" inside one
        continuous voiced run (10.070-11.055). Clip 3 shows the same 0.14 s boundary gap on the same
        two words. NOT patched: there is no missing word and no caption boundary rides on it.
  (iii)14.525-14.720 (0.195 s)  the /k/ burst of the SECOND "Kaspa", i.e. the first sound after THE
        PROTECTED SUSPENSE PAUSE. Whisper starts the token at 14.720. An isolated decode of ONLY the
        0.42 s voiced run 14.50-14.92 returns "Casper" on its own, so the word demonstrably begins at
        14.525. Clip 3 measured this same re-onset (its 22.085, = 14.525 + the 7.560 s offset between
        the two cuts) and its caption landed within 0.015 s of it.  -> RE-ANCHORED to 14.525.

WHY (iii) MATTERS AND IS NOT COSMETIC: it is the caption that lands the payoff after the 0.655 s
suspense pause (13.870-14.525), the rhetorical hinge of the whole clip. Left at 14.720 the caption
"kaspa would be" fires 0.195 s (5.9 frames @30) AFTER the /k/ burst the viewer already heard.

NOT patched, deliberately:
  - " There" (json 0.000, RMS onset 0.145). The onset is 0.145 s late in the AUDIO, not the JSON, and
    t=0.000 is what keeps the first caption continuous with the frame-0 cover hand-off. Moving it to
    0.145 would leave frames 1-4 with no caption at all right after the thumbnail cut. Clip 3 opens
    its first caption at t=0.00 for the same reason.
  - every other onset delta measures <= 0.11 s (~3 frames), inside house tolerance, and none of them
    is a caption-group start.

Run from the repo root:
  python video-creation/shorts/tutorial/binance-kaspa-catch22-impact/_patch_words.py
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "whisper-words.json")
DST = os.path.join(HERE, "whisper-words-verified.json")

# (word, old_start, new_start) — onset re-anchors onto measured RMS voiced-run onsets.
REANCHOR = [
    ("Binance", 5.50, 5.270),    # first word of the contradiction segment
    ("Casper", 14.72, 14.525),   # the payoff word after the protected 0.655 s pause
]

d = json.load(open(SRC, encoding="utf-8"))
words = [dict(w) for seg in d["segments"] for w in seg.get("words", [])]

moved = 0
for tok, old, new in REANCHOR:
    hit = [w for w in words if abs(w["start"] - old) < 1e-6 and w["word"].strip() == tok]
    assert len(hit) == 1, f"expected exactly 1 {tok!r} at {old}, got {len(hit)}"
    hit[0]["start"] = new
    moved += 1

assert moved == 2, f"expected 2 re-anchors, got {moved}"
for a, b in zip(words, words[1:]):
    assert a["end"] <= b["start"] + 1e-9, f"overlap at {a} -> {b}"
    assert a["start"] <= b["start"] + 1e-9, f"non-monotonic at {a} -> {b}"

text = "".join(w["word"] for w in words)
json.dump({"text": text,
           "segments": [{"id": 0, "start": words[0]["start"], "end": words[-1]["end"],
                         "text": text, "words": words}],
           "language": "en"},
          open(DST, "w", encoding="utf-8"), indent=1)
print(f"wrote {DST}: {len(words)} words, 0 restored, {moved} onsets re-anchored on RMS")

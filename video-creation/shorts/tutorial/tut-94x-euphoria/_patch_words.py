"""_patch_words.py — tut-94x-euphoria (batch `tutorial`, clip 1): whisper-words-verified.json.

ONE patch, and it exists because THIS clip's Whisper pass silently omits 1.8 s of speech, which is
the failure mode the remotion-shorts-build skill calls out by name ("the word JSON can silently OMIT
speech ... patch the words into a whisper-words-verified.json and build from that").

THE HELD VOWEL. `whisper-words.json` ends "crap." at 49.44 and emits nothing at all until "Oh," at
51.24. The audio is NOT silent there. Measured on the clip's own spine at 50 ms RMS:

    48.85 -19.3 | 49.00 -19.2 | 49.20 -36.5 (the /p/ release of "crap")
    49.25 -19.7 | 49.50 -19.6 | 50.00 -19.5 | 50.50 -17.6 | 51.00 -18.4 | 51.20 -18.2 ...

i.e. continuous voiced audio at -17 to -20 dBFS straight through, with a single 40 ms trough at
49.20. The clip's tighten plan measured the same span on the master (336.16-338.12): "continuous
voiced audio ... whose F0 glides 245 -> 216 -> 211 -> 151 Hz and lands on the F0 of the transcribed
'man' at 163 Hz. Mike sustaining 'ohhhhh' out of 'holy crap' into 'man', one phrase. ... CAPTION IT
AS SPOKEN WORDS", and the Phase 7 dispatch repeats it as binding: keep ONE caption alive across it,
never emit a caption hole there.

So the " Oh," token is re-onset from 51.24 to 49.25 (the first bin after the /p/ trough). Nothing
else is touched: no word is added, removed, retimed at its end, or respelled here. The SPELLING of
the sustain ("ohhh") is a PHRASE_CORRECTION in the canonical captions tool, not a hand edit, so the
caption array can be rebuilt byte-identically from this file at any time.

Run:  python video-creation/shorts/tutorial/tut-94x-euphoria/_patch_words.py
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "whisper-words.json")
OUT = os.path.join(HERE, "whisper-words-verified.json")

OLD_START, NEW_START = 51.24, 49.25

d = json.load(open(SRC, encoding="utf-8"))
hits = 0
for seg in d["segments"]:
    for w in seg.get("words", []):
        if w["word"].strip() == "Oh," and abs(w["start"] - OLD_START) < 1e-6:
            w["start"] = NEW_START
            hits += 1
    if seg["words"] and seg["start"] > NEW_START and seg["words"][0]["start"] == NEW_START:
        seg["start"] = NEW_START

if hits != 1:
    raise SystemExit(f"expected exactly 1 'Oh,' at {OLD_START}, found {hits} - refusing to write")

json.dump(d, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"wrote {OUT}: 'Oh,' re-onset {OLD_START} -> {NEW_START} (held vowel, {hits} token patched)")

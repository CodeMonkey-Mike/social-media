"""_patch_words.py — tut-94x-euphoria-impact (batch tutorial, clip #6, variant impact).

Builds `whisper-words-verified.json` from the clip's own `whisper-words.json`.
Run:  python _patch_words.py     (from this folder)

Three MEASURED patches, none of them a taste call. Everything else is byte-identical to the
shipped word pass, so the captions can always be rebuilt from scratch.

1) THE HELD VOWEL (the tighten plan's binding CAPTION GATE).
   The shipped small-model pass has "crap." ending 5.86 and the next token " Oh" starting 7.66,
   i.e. a 1.80 s hole. There is NO hole: an 0.1 s RMS sweep of this clip's own audio measures a
   flat -18 to -19 dBFS from 5.90 straight through to 8.26 with no sub -57 dB window anywhere
   (nothing even approaches the silence floor). It is Mike SUSTAINING "ohhh" into "man"
   (tighten-plan: F0 glides 245 -> 163 Hz; a windowed medium decode of the master resolves it as a
   single 2.36 s "oh" token at master 336.36-338.72 = clip 5.94-8.30, glued to "man").
   PATCH: " Oh" -> " Ohhh", start 7.66 -> 5.94 (master 336.36 - the relocked in-point 330.42).
   Result: ONE caption ("ohhh man") stays alive across the whole held vowel, which is exactly what
   the tighten plan requires ("never emit a caption hole, never split it into 'oh' plus a gap").

2) "were" NOT "We're" (+ the false sentence end on "October.").
   The shipped small-model pass reads "...because that's September and October. We're absolutely
   insane." Both a medium.en pass on an isolated 8.6-13.0 s of this clip's own audio and the master
   transcript's own large pass (segment 338.12-343.02) return ONE sentence: "...because that's
   September and October were absolutely insane." The tighten plan quotes it the same way.
   PATCH: " October." -> " October" (drop the false sentence break) and " We're" -> " were".
   Timings untouched. "because that's" is the abandoned connective the tighten plan considered and
   deliberately KEPT, so it stays on screen as spoken.

3) THE TICKER + THE BRAND are NOT patched here - they are keyed rules in the canonical builder
   (`skills/captions/build_captions.py`): ("memoy","x") -> ["nyx"] and ("code","monkey") ->
   ["codemonkey"]. See that file's comments for the ear-verification.
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "whisper-words.json")
OUT = os.path.join(HERE, "whisper-words-verified.json")

data = json.load(open(SRC, encoding="utf-8"))

patched = {"held_vowel": 0, "were": 0, "october": 0}
for seg in data["segments"]:
    for w in seg.get("words", []):
        tok = w["word"]
        if tok.strip() == "Oh" and abs(w["start"] - 7.66) < 0.01:
            w["word"] = " Ohhh"
            w["start"] = 5.94
            patched["held_vowel"] += 1
        elif tok.strip() == "October." and abs(w["start"] - 11.26) < 0.01:
            w["word"] = " October"
            patched["october"] += 1
        elif tok.strip() == "We're" and abs(w["start"] - 11.68) < 0.01:
            w["word"] = " were"
            patched["were"] += 1

assert all(v == 1 for v in patched.values()), f"patch did not apply cleanly: {patched}"

# keep segment-level text in sync so the file reads honestly
for seg in data["segments"]:
    seg["text"] = "".join(w["word"] for w in seg.get("words", [])) or seg["text"]
data["text"] = "".join(seg["text"] for seg in data["segments"])

json.dump(data, open(OUT, "w", encoding="utf-8"), indent=2, ensure_ascii=False)
print(f"wrote {OUT}  patches={patched}")

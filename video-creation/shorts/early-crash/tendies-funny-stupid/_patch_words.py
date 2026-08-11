"""_patch_words.py — restore the speech `whisper-words.json` DROPPED for this clip.

batch early-crash / clip 4 `tendies-funny-stupid`. Run from the repo root:

    python video-creation/shorts/early-crash/tendies-funny-stupid/_patch_words.py

Reads  tendies-funny-stupid/whisper-words.json   (the shipped Phase 6 pass, 140 words)
Writes tendies-funny-stupid/whisper-words-verified.json  (146 words)  <- captions are built from THIS

WHY (remotion-shorts-build SKILL, checklist item 3: "the word JSON can silently OMIT speech"):
the shipped pass ends at 33.44 s on "advice." while the clip runs to 34.509 s. The missing 1.07 s
is the clip's closing line, and a builder reading only that file would caption a hole where the
HARD-OUT is.

WHAT the line is, and why it is NOT what the batch tighten-plan predicted:
`early-crash/tighten-plan.json` clip 4 gates the tail as "now you're out of your mind" (read off the
livestream MASTER transcript). FIVE independent 1x passes on THIS CLIP'S OWN audio all return
"are you out of your mind?" and not one produces "now you're":
    large-v3, whole clip                      -> "... Nothing's financial advice. Are you out of your mind?"
    medium.en, isolated 32.60-34.55 s          -> "Are you out of your mind?"
    medium.en, isolated 31.70-34.51 s          -> "right? Nothing's financial advice. Are you out of your mind?"
    medium.en, isolated 33.00-34.51 s          -> "Are you out of your mind?"
    medium.en, 31.70-34.51 s + rhetorical-question initial_prompt -> "... Are you out of your mind?"
Precedent (build_captions.py, whatif-next-dogecoin / phantom-hack): never ship words no 1x pass
produced. So the tail is captioned from the audio, and the deviation from the plan's gate is
reported to Mike rather than silently "fixed" either way.

TIMINGS: the phrase onset is MEASURED, not taken from Whisper. A 20 ms-window RMS scan of the clip
audio shows "advice." decaying to -60.9 dB at 33.48 and voice returning at -22.0 dB at 33.50, so
"are" starts at 33.50. The remaining word boundaries are the two isolated passes' word timings
(which agree to within 20 ms: you 33.58/33.60, out 33.76, of 33.94, your 34.04, mind 34.16). The
final word is extended to 34.45 because the RMS stays at -18 dB through 34.48 and the spine cuts at
34.50 (the enforced TIGHT TAIL at master 1678.50) - that abruptness is the deliberate hard-out.
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "whisper-words.json")
OUT = os.path.join(HERE, "whisper-words-verified.json")

TAIL = [
    (" Are", 33.50, 33.58),
    (" you", 33.58, 33.76),
    (" out", 33.76, 33.94),
    (" of", 33.94, 34.04),
    (" your", 34.04, 34.16),
    (" mind?", 34.16, 34.45),
]

data = json.load(open(SRC, encoding="utf-8"))
words = [w for s in data["segments"] for w in s.get("words", [])]
assert len(words) == 140, f"expected the shipped 140-word pass, got {len(words)}"
assert words[-1]["word"].strip() == "advice.", words[-1]
assert abs(words[-1]["end"] - 33.44) < 1e-6, words[-1]

seg = {
    "id": data["segments"][-1]["id"] + 1,
    "seek": data["segments"][-1]["seek"],
    "start": TAIL[0][1],
    "end": TAIL[-1][2],
    "text": " Are you out of your mind?",
    "tokens": [],
    "temperature": 0.0,
    "avg_logprob": data["segments"][-1].get("avg_logprob", 0.0),
    "compression_ratio": data["segments"][-1].get("compression_ratio", 1.0),
    "no_speech_prob": 0.0,
    "words": [{"word": w, "start": s, "end": e, "probability": 0.9} for w, s, e in TAIL],
}
data["segments"].append(seg)
data["text"] = data["text"].rstrip() + " Are you out of your mind?"

json.dump(data, open(OUT, "w", encoding="utf-8"), indent=2)
n = sum(len(s.get("words", [])) for s in data["segments"])
print(f"wrote {OUT}  ({n} words, ends {seg['end']:.2f}s)")

"""tutorial / clip 5 (doginme-100x-if-500x) — whisper-words.json -> whisper-words-verified.json.

⛔ WHY: the shipped word pass (small) SILENTLY OMITS SPEECH and mis-segments words, the two failure
modes the remotion-shorts-build contract calls out ("the word JSON can silently OMIT speech ... patch
the words into a whisper-words-verified.json and build from that", and this batch's known defect
"onsets off by up to 1.07 s, zero-duration tokens, phantom word splits, pauses glued INSIDE word
tokens"). A missing phrase can NOT be repaired with a PHRASE_CORRECTION (a replacement may never be
longer than the run it matches), so it has to be patched here.

EVERY value below is MEASURED on the STAGED spine
(shorts/tutorial/render-assets/doginme-100x-if-500x.mp4, 39.613 s audio / 39.60 s picture) at 5 ms hop
/ 10 ms window RMS, cross-checked against a SECOND independent 1x pass: a medium.en whole-clip
word-timestamp decode of the same spine (temperature 0), plus isolated-window decodes. No timing is
invented and no word is added that no 1x pass produced.

Measured voiced/silence spans of the spine (dual threshold, silence < -57 dB, audio > -52 dB):
  0.495-3.030 | 3.790-4.050 | 4.785-6.140 | 6.850-10.045 | 10.455-11.310 | 11.725-14.115 |
  14.470-19.630 | 19.935-24.620 | 25.255-26.785 | 26.925-27.440 | 28.325-29.705 | 30.475-36.030 |
  36.490-39.435                     (the 0.105 s island at 36.170-36.275 peaks at -46.8 dB = a breath,
                                     ~30 dB under speech, NOT omitted speech -> nothing inserted)

── (A) RESTORED OMITTED SPEECH (2 words) ────────────────────────────────────────────────────────────
 A1  " of"     12.335-12.400  "all-time high OF doginme is 107 million". The shipped pass jumps
                              '-high' (ends 12.400) straight to 'dog' (12.400) with no article. The
                              medium.en whole-clip pass reads ' of' at 12.340-12.500 (p 0.83), an
                              isolated medium.en decode of 11.60-14.30 returns "All-time high OF
                              dogamy is $107 million", and the livestream MASTER pass reads ' of' at
                              4496.800-4496.900 (p 0.84). Three independent 1x passes.
 A2  " don't"  20.020-20.100  "I DON'T know, I think so." The shipped pass has 'I' (19.620-20.120) ->
                              'know' (20.120) and drops the negation, which INVERTS the sentence. The
                              medium.en whole-clip pass reads " don't" 20.040-20.100 (p 0.82), an
                              isolated medium.en decode of 19.80-22.75 returns "I don't know, I think
                              so. That means it's 100x from here.", and the MASTER reads " don't" at
                              4505.540-4505.580 (p 0.95). Three independent 1x passes.

── (B) PHANTOM WORD SPLIT (1 merge) ─────────────────────────────────────────────────────────────────
 B1  'and'(16.980-17.200) + 'then'(17.200-17.320) -> " in" 16.980-17.320.
     "to get to 400 million IN a really big bull run". The shipped pass splits the single word "in"
     into two tokens. The MASTER reads it as ONE token ' in' 4501.300-4501.580 (p 0.72), an isolated
     medium.en decode of 14.30-17.20 returns "...to get to $400,000,000 in thi-" and a wider
     15.40-19.70 returns "...to get to $400 million IN a really big bull run?". Merging here (rather
     than in PHRASE_CORRECTIONS) keeps every downstream timing exact and needs no risky
     ("and","then","a") key in the shared canonical script.

── (C) MEASURED RE-TIMINGS (8 tokens; onsets only where the shipped start is >0.28 s early) ─────────
 C1 ' I'        start 0.000 -> 0.440   voiced onset 0.495; a t=0.00 caption would sit 0.5 s under silence
 C2 '-high'     end  12.400 -> 12.335  frees the span for the restored " of" (medium onset 12.340).
                                       No other token moves; "all"+"-time"+"-high" still merge.
 C3 ' Is'       start 14.200 -> 14.430  voiced onset 14.470 (previous voiced block ends 14.115)
 C4 ' I'        19.620-20.120 -> 19.880-20.020  voiced onset 19.935; the 0.50 s token had the pause
                                       glued inside it, and the tail is where " don't" lives
 C5 " That's"   start 24.840 -> 25.210  voiced onset 25.255 (0.635 s measured silence 24.620-25.255)
 C6 ' What'     start 28.000 -> 28.290  voiced onset 28.325 (0.885 s measured silence 27.440-28.325)
 C7 ' me'       end  30.160 -> 29.705  voiced END 29.705; the token had the 0.770 s silence
                                       29.705-30.475 glued inside it (this is the "doginme" tail)
 C8 ' Can'      start 30.160 -> 30.440  voiced onset 30.475

NOT patched, deliberately:
  * the opening token is " dog", NOT "doginme". SEVEN 1x passes agree there is one syllable there
    (shipped small "dog." ; medium.en whole-clip "dog." ; medium.en 0.30-3.20 "doge" ; large-v3
    0.30-3.20 "dog" ; large-v3 0.40-1.80 "dog" ; large-v3 1.28-1.80 "dog" ; medium.en 0.40-1.80 @0.7x
    "dog."), the MASTER reads ' dog.' p=0.41, and the RMS shows a single 0.35 s voiced syllable
    (1.345-1.690, one interior dip at 1.39) with the next token 'I' already at 1.75. There is no
    "-in-me" in the audio, so none is put on screen. The clip's tighten-plan caption gate asked for
    "I got some doginme"; that word does not exist in this audio and is NOT shipped. The TOKEN NAME
    still appears on screen twice (12.40 "doginme", 28.90 "doginme") and on the frame-0 cover.
  * the second limb is "I got that dog WITH me", not "in me". SIX 1x passes read "with" (shipped
    small p-, medium.en whole-clip, medium.en 4.60-6.35, medium.en 4.70-6.25 @0.8x, large-v3
    4.60-6.35, large-v3 3.55-6.35) and the MASTER reads ' with' p=0.74, while every pass reads " in"
    for the FIRST limb (large-v3 1.60-3.20: "I got that dog in me."). The doubling is protected and
    survives verbatim; the one-word variation is HIS, and no rule invents "in".
  * 'Right.'(3.700-4.140) stays "right." The tighten-plan gate suggested "All right." off one
    isolated decode; measured, the voiced block is 3.790-4.050 with a 0.145 s core at -20 dB =
    ONE syllable, and three passes (shipped, MASTER p 0.74, large-v3 3.55-4.60 "Right?") read one
    word. medium.en is the only pass hearing "All right" (1x and 0.75x).
  * "we get a 200x" keeps NO leading "and". The MASTER's ' and' (4539.060-4540.120, p 0.38) sits
    almost entirely inside the 1.06 s pause that 5B removed; the join is visible here as 20 ms of
    digital silence at 34.975-34.995. large-v3 34.30-36.10, large-v3 30.30-36.10, medium.en
    30.30-36.10 and the shipped pass all read "we get" with no "and".
  * the 36.170-36.275 island (-46.8 dB peak) is a breath, not a word (see span table above).

Run from the repo root:
  python video-creation/shorts/tutorial/doginme-100x-if-500x/_patch_words.py
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "whisper-words.json")
DST = os.path.join(HERE, "whisper-words-verified.json")

# (shipped_start_key, [(word, start, end), ...]) — inserted BEFORE the token with that start
INSERTS = [
    (12.400, [(" of", 12.335, 12.400)]),
    (20.120, [(" don't", 20.020, 20.100)]),
]

# shipped_start_key -> (new_start, new_end); None keeps the shipped value
RETIME = {
    0.000:  (0.440, None),
    12.180: (None, 12.335),   # '-high'
    14.200: (14.430, None),   # ' Is'
    19.620: (19.880, 20.020),  # ' I'
    24.840: (25.210, None),   # " That's"
    28.000: (28.290, None),   # ' What'
    29.420: (None, 29.705),   # ' me'  (the doginme tail)
    30.160: (30.440, None),   # ' Can'
}

# [(first_start, second_start, merged_word)] — collapse a phantom split into ONE token
MERGES = [(16.980, 17.200, " in")]

d = json.load(open(SRC, encoding="utf-8"))
words = []
for seg in d["segments"]:
    for w in seg.get("words", []):
        words.append(dict(w))


def key(w):
    return round(w["start"], 3)


# --- merges first (they consume two shipped tokens) -------------------------------------------------
merged, i, n_merged = [], 0, 0
while i < len(words):
    hit = next((m for m in MERGES if abs(words[i]["start"] - m[0]) < 1e-6), None)
    if hit and i + 1 < len(words) and abs(words[i + 1]["start"] - hit[1]) < 1e-6:
        merged.append({"word": hit[2], "start": words[i]["start"], "end": words[i + 1]["end"],
                       "probability": 0.90})
        n_merged += 1
        i += 2
        continue
    merged.append(words[i])
    i += 1
assert n_merged == len(MERGES), f"expected {len(MERGES)} merges, got {n_merged}"

# --- inserts + retimes -----------------------------------------------------------------------------
out, n_ins, n_ret = [], 0, 0
for w in merged:
    for at, ins in INSERTS:
        if abs(w["start"] - at) < 1e-6:
            for tok, s, e in ins:
                out.append({"word": tok, "start": s, "end": e, "probability": 0.90})
                n_ins += 1
    if key(w) in RETIME:
        s, e = RETIME[key(w)]
        if s is not None:
            w["start"] = s
        if e is not None:
            w["end"] = e
        n_ret += 1
    out.append(w)

assert n_ins == sum(len(x[1]) for x in INSERTS), f"expected {sum(len(x[1]) for x in INSERTS)} inserts, got {n_ins}"
assert n_ret == len(RETIME), f"expected {len(RETIME)} retimes, got {n_ret}"
for a, b in zip(out, out[1:]):
    assert a["start"] <= b["start"] + 1e-9, f"non-monotonic start at {a} -> {b}"
    assert a["end"] <= b["start"] + 1e-9, f"overlap at {a} -> {b}"
for w in out:
    assert w["end"] > w["start"], f"zero/negative duration token {w}"

text = "".join(w["word"] for w in out)
json.dump({"text": text,
           "segments": [{"id": 0, "start": out[0]["start"], "end": out[-1]["end"],
                         "text": text, "words": out}],
           "language": "en"},
          open(DST, "w", encoding="utf-8"), indent=1)
print(f"wrote {DST}: {len(words)} -> {len(out)} tokens "
      f"(+{n_ins} restored words, {n_merged} phantom split merged, {n_ret} measured re-timings)")

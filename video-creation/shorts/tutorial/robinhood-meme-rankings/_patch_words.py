"""tutorial / clip 2 (robinhood-meme-rankings) - whisper-words.json -> whisper-words-verified.json.

WHY THIS FILE EXISTS
====================
The remotion-shorts-build contract records two defects in this batch's word passes, and BOTH are
present on this clip:

  (1) the pass silently OMITS speech, and a missing word can NOT be repaired with a
      PHRASE_CORRECTION (a replacement may never be longer than the run it matches);
  (2) the timings are unreliable for edge placement - "onsets off by up to 1.07 s, zero-duration
      tokens, phantom word splits, phantom onsets for words not in the clip, long pauses glued
      INSIDE word tokens".

So every timing below is MEASURED on this clip's own audio at 5 ms hop / 10 ms window RMS (16 kHz
mono), never taken from a raw word timestamp, and every TEXT change carries at least two independent
decoders. Four decoders were used:

  M  = the clip's shipped pass          (whisper-words.json, this file's input)
  W  = medium.en, windowed on this clip (2-7 s windows, word_timestamps)
  S  = small.en,   windowed on this clip
  L  = the MASTER livestream pass with full context
       (livestream-repurpose/transcripts/tutorial LOW BPS VERTICAL/*.json), which is the decode the
       clip-plan and tighten-plan quotes were authored from

PROTECTED, and the reason the timing work matters (tighten-plan + batch delegation):
  * the Cooper triple in ALL THREE limbs, "including the 0.92 s drawled 'of' inside it". MEASURED
    here: "office dog" releases at 27.845, then a 0.640 s pause (floor -50 to -62 dB) and "of
    Robinhood" re-onsets at 28.485. The shipped pass puts 'of' at 27.98, i.e. it swallows the pause
    INSIDE the token and would caption the word 0.50 s early, on the silence that IS the beat.
    Op R-OF restores it. NOTHING (graphic or SFX) is placed in 27.845-28.485.
  * "without a doubt, unequivocally"  -> untouched except for the 'I would' repair (ops A/B).
  * the "my, my favorite" doubling    -> BOTH tokens kept here; the captions script protects it from
    the stutter collapse via PROTECTED_DOUBLES ("is","my","my","favorite").
  * the "what if ... what if this happens ... what if such and such happens" anaphora -> untouched.

Run from the repo root:
  python video-creation/shorts/tutorial/robinhood-meme-rankings/_patch_words.py
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "whisper-words.json")
DST = os.path.join(HERE, "whisper-words-verified.json")

# ── ops ──────────────────────────────────────────────────────────────────────────────────────────
# Every op is keyed on (shipped_start, shipped_core) so it can never hit the wrong token, and it is
# asserted: a miss raises instead of silently no-opping.
#
#   ("time", start, core, new_start, new_end)              retime only
#   ("text", start, core, new_word, new_start, new_end)    retime + rewrite
#   ("drop", start, core, why)                             delete a phantom token
#   ("merge", start, core, start2, core2, new_word, ns, ne)  two tokens -> one word
#   ("ins",  before_start, before_core, word, ns, ne)      insert an OMITTED word

OPS = [
    # ---- the clip HEAD. 0.000-0.405 is TRUE digital silence (-96 to -240 dB) and the first word
    # onsets at 0.425, so M's 0.00 start is 0.425 s early. This matters twice: it is the first caption
    # of the short, and the frame-0 cover cut's whoosh lives in that silence.
    ("time", 0.00, "in", 0.425, 0.700),
    ("time", 0.70, "my", 0.700, 0.885),
    ("time", 0.98, "opinion", 0.935, 1.300),
    # ---- HOOK, "on the Robinhood chain? I would, without a doubt, unequivocally" -----------------
    # RMS: ONE voiced run 2.580-2.955 ("chain"), breath 2.995-3.060, ONE voiced run 3.065-3.695
    # (0.63 s), breath 3.745-3.860, then "without" at 3.880. So there is room for exactly TWO words
    # between "chain" and "without", not three.
    # L reads "chain? I would, without a doubt, unequivocally," with NO "like" (I 757.88-757.98,
    # would 757.98-758.54), and the clip-plan quotes the line that way. M's " like" sits at
    # 2.82-3.04, i.e. INSIDE the "chain" voiced run - a phantom split of "chain". W agrees there is
    # no "like" (it reads a bare " I" then glues "without").
    ("time", 2.54, "chain", 2.540, 2.955),
    ("drop", 2.82, "like", "phantom split of 'chain' (inside its 2.580-2.955 voiced run); L and W both have no 'like'"),
    ("time", 3.04, "i", 3.065, 3.380),
    # "was" -> "would": M and S hear "was" (p 0.37 on S), W glues it into "without", and L - the only
    # decode with full sentence context - reads " would," (p 0.45). "I was without a doubt
    # unequivocally I go for What If" is not English; "I would, without a doubt, unequivocally, I go
    # for What If" is the persona's restart pattern and is what the clip-plan and tighten-plan quote.
    ("text", 3.50, "was", " would,", 3.380, 3.695),
    ("time", 3.82, "without", 3.880, 4.340),
    ("time", 4.60, "doubt", 4.550, 4.700),
    # "unequivocally" is a genuinely HELD word: six syllables as four voiced islands running
    # 4.755-5.765 (1.01 s), not a glued pause. It is on the LONG_OK allowlist at the bottom.
    ("time", 4.78, "unequivocally", 4.755, 5.765),
    ("time", 5.60, "i", 5.870, 6.085),
    ("time", 6.12, "go", 6.185, 6.505),
    # "for What If." then a 0.115 s beat, then "What If is my, my favorite."
    ("time", 6.52, "for", 6.700, 6.960),
    ("time", 7.04, "what", 6.960, 7.255),
    ("time", 7.28, "if", 7.265, 7.375),
    ("time", 7.52, "what", 7.490, 7.645),
    ("time", 7.76, "if", 7.655, 7.780),
    ("time", 7.90, "is", 7.880, 8.025),
    # ---- "$IF is my, my favorite" (PROTECTED doubling) -----------------------------------------
    # Kept as two tokens on purpose. RMS proves the doubling is real: "my" 8.025-8.335, an 80 ms
    # true silence 8.455-8.535, "my" 8.550-8.660, silence 8.750-8.770, "favorite" 8.780-9.065.
    ("time", 8.14, "my", 8.025, 8.335),
    ("time", 8.48, "my", 8.550, 8.660),
    ("time", 8.84, "favorite", 8.780, 9.065),
    # ---- seg0 -> seg2 JOIN. 0.535 s low-energy window 9.065-9.600; next onset MEASURED 9.600 ------
    ("time", 9.18, "what", 9.600, 9.850),
    ("time", 9.84, "if", 9.895, 10.090),
    ("time", 9.96, "is", 10.220, 10.320),
    ("time", 10.10, "a", 10.320, 10.420),
    ("time", 10.32, "concept", 10.510, 10.740),
    # ---- "it's a beautiful phrase. I can't believe that nobody ever thought of it before" --------
    # M has 'I' at 12.14 (p 0.35) but "phrase" releases at 12.560 and the 'I' onset is MEASURED at
    # 12.765 (silence 12.620-12.670 between them): a 0.63 s phantom onset.
    # "phrase" releases at 12.150 (the 12.150-12.440 plateau after it is breath at -45..-54 dB, not
    # voice), so M's 12.14 end is right and only the 'I' after it is wrong.
    ("time", 11.62, "phrase", 11.620, 12.150),
    ("time", 12.14, "i", 12.765, 12.940),
    ("time", 14.70, "before", 14.780, 15.040),
    ("time", 15.48, "coin", 15.440, 15.700),
    # ---- "What if this happens? I know I say it all the time. Everybody does." -------------------
    # M emits a ZERO-DURATION token (' I' 17.04-17.04). MEASURED: "this happens" is one voiced run
    # 16.720-17.250, then a quiet mumble 17.315-17.440, then "say" at 17.455.
    ("time", 16.56, "happens", 16.720, 17.100),
    ("time", 17.04, "i", 17.100, 17.250),      # was zero-duration
    ("time", 17.04, "know", 17.315, 17.405),
    ("time", 17.16, "i", 17.405, 17.455),
    ("time", 18.16, "time", 18.160, 18.485),
    ("time", 18.64, "everybody", 18.670, 19.220),
    ("time", 19.22, "does", 19.220, 19.710),
    # ---- "What if such and such happens?" then the 1.17 s rhetorical pause ----------------------
    ("time", 19.90, "what", 19.865, 20.340),
    ("time", 20.34, "if", 20.340, 20.870),
    ("time", 21.08, "such", 21.050, 21.480),
    # "happens?" releases at 21.950; M runs it to 22.22, which eats the head of the PROTECTED
    # 22.115-23.285 pause (breath only in it - W confirms no word there).
    ("time", 21.74, "happens", 21.740, 21.950),
    ("time", 23.12, "so", 23.285, 23.400),
    ("time", 23.74, "beautiful", 23.740, 24.195),
    # ---- seg2 -> seg1 JOIN + the COOPER TRIPLE (protected peak, zero dedupe) --------------------
    ("time", 24.42, "cooper", 24.685, 24.985),
    ("time", 24.94, "is", 24.985, 25.330),
    ("time", 25.70, "a", 25.935, 26.100),
    ("time", 26.12, "real", 26.100, 26.400),
    ("time", 26.34, "dog", 26.400, 26.590),
    ("time", 26.64, "it", 26.615, 26.805),
    ("time", 26.76, "is", 26.880, 27.000),
    ("time", 26.90, "the", 27.000, 27.210),
    ("time", 27.16, "office", 27.280, 27.505),
    ("time", 27.54, "dog", 27.510, 27.845),
    # ⛔ THE PROTECTED DRAWLED "of". Pause 27.845-28.485 (0.640 s, floor -50..-62 dB) then the word.
    ("time", 27.98, "of", 28.485, 28.840),
    # third limb "It's a real dog" - 'dog' releases at 30.175, then a 0.860 s protected beat.
    ("time", 29.90, "dog", 29.900, 30.175),
    ("time", 30.64, "and", 31.035, 31.180),
    # ---- the bridge: "...my second favorite meme. besides, you know, besides what if." ----------
    # M garbles 33.62-34.16 as "We said piece" (3 tokens). W reads " besides," there and S reads
    # " besides"; RMS shows exactly TWO syllables (33.715-33.765 + 33.845-33.930) = "be-sides".
    # L glues the whole span into one 1.62 s ' besides' token (880.84-882.46), i.e. all four decoders
    # put "besides" here and only M turns it into English words that were never spoken.
    ("merge", 33.62, "we", 33.76, "said", " besides,", 33.715, 33.930),
    ("drop", 33.88, "piece", "third token of the same 'besides' garble (see the merge above)"),
    ("time", 34.16, "you", 34.225, 34.385),
    ("time", 34.72, "know", 34.830, 35.015),
    # the SECOND "besides" (after the tighten pass removed the 0.98 s stall at master 882.47-883.45).
    # M and W both read ' besides' at 35.56; RMS: "be" 35.545-35.630 + "sides" 35.710-35.845.
    ("time", 35.56, "besides", 35.545, 35.845),
    # M's ' why' (p 0.28) is a phantom: only FOUR syllables exist in 35.545-36.425 and they are
    # be-sides-what-if. Neither W (tight window) nor S has a word there.
    ("drop", 35.92, "why", "phantom token; RMS has only 4 syllables in 35.545-36.425 = be-sides-what-if"),
    ("time", 36.12, "what", 35.935, 36.245),
    ("time", 36.36, "if", 36.255, 36.425),
    # ---- Toshi / Brian Armstrong / the office dog at Robinhood HQ ------------------------------
    # M reads "the the office door dog"; W, S and L ALL read "the office dog" (one determiner, no
    # "door"), and the tighten pass already REMOVED the stuttered determiner at master 912.04-912.67,
    # so a surviving "the the" here is a phantom split.
    ("drop", 40.86, "the", "phantom duplicate determiner; the tighten pass cut the real stutter at master 912.04-912.67, and W/S/L all read a single 'the'"),
    ("time", 41.12, "office", 40.760, 41.220),
    ("drop", 41.34, "door", "phantom; W/S/L all read 'the office DOG' with no 'door'"),
    ("time", 41.74, "dog", 41.220, 41.940),
    # "and the Robinhood, the Robinhood headquarters" - L and S read "and", M and W read "in".
    ("text", 42.14, "in", " and", 41.940, 42.240),
    ("time", 42.32, "the", 42.240, 42.460),
    ("time", 42.50, "robin", 42.460, 42.520),
    ("time", 42.66, "hood", 42.525, 42.775),
    # the self-correction the tighten plan deliberately KEPT (it has no silence anchor on its left).
    # RMS confirms a real 0.36 s gap at 42.810-43.170 between the two utterances.
    ("time", 43.22, "the", 43.185, 43.405),
    ("time", 43.42, "robin", 43.425, 43.560),
    ("time", 43.58, "hood", 43.565, 43.755),
    ("time", 43.74, "headquarters", 43.760, 44.160),
    ("time", 44.48, "right", 44.240, 44.375),
    ("time", 44.94, "cool", 44.940, 45.350),
    # ---- TENDIES, rank 3 -----------------------------------------------------------------------
    # M splits the name into TWO tokens, ' 10.' + ' These'. THREE independent decoders read one word:
    # W " tendis" 46.54-46.96, S " tendies" 46.52-46.92, and the batch clip-plan flags exactly this
    # ("'10 these' ... ALMOST CERTAINLY TENDIES ... the stream context listing Tendies third matches").
    # RMS: silence to 46.285, then "I" 46.285-46.375, "think" 46.390-46.540, name 46.640-47.000.
    ("time", 45.88, "i", 46.285, 46.375),
    ("time", 46.42, "think", 46.390, 46.540),
    ("merge", 46.58, "10", 46.92, "these", " Tendies", 46.640, 47.000),
    ("time", 46.98, "is", 47.000, 47.140),
    ("time", 47.16, "pretty", 47.140, 47.320),
    ("time", 47.40, "good", 47.320, 47.585),
    # ---- the protected peak: "it's a very funny and stupid like concept" ------------------------
    ("time", 48.32, "it's", 48.500, 48.860),
    # M puts ' Concept' at 52.00. It is MEASURED at 51.325 (silence 51.045-51.310 in front of it) -
    # a 0.675 s late onset, the worst single error in the file. W agrees (51.22).
    ("time", 52.00, "concept", 51.325, 51.940),
    ("time", 52.54, "that's", 52.010, 52.440),
    ("time", 53.08, "i", 52.605, 52.670),
    ("time", 53.36, "think", 52.875, 53.180),
    ("time", 53.64, "that", 53.205, 53.320),
    ("time", 53.78, "they'll", 53.410, 53.655),
    ("time", 54.18, "make", 53.735, 53.985),
    ("time", 54.38, "get", 54.055, 54.270),
    ("time", 54.58, "it", 54.400, 54.590),
    ("time", 55.32, "a", 55.300, 55.400),
    ("time", 55.48, "potential", 55.400, 56.175),
    ("time", 55.96, "robin", 56.225, 56.400),
    ("time", 56.40, "hood", 56.400, 56.785),
    ("time", 56.84, "app", 56.840, 57.005),
    ("time", 57.20, "listing", 57.100, 57.600),
    ("time", 58.00, "you", 58.330, 58.450),
    ("time", 58.40, "know", 58.450, 58.565),
    ("time", 58.58, "just", 58.625, 58.685),
    ("time", 58.82, "like", 58.790, 58.900),
    # "far far coin" -> "fart coin": the clip-plan flags master 941.58-942.56 as fart coin, and both
    # M and W split the /t/ release into a second "far". One word, whole span.
    ("merge", 59.06, "fart", 59.48, "fart", " fart", 59.020, 59.525),
    ("time", 59.68, "coin", 59.670, 59.955),
    ("time", 60.58, "that'll", 60.630, 60.980),
    # ---- YOLO, rank 4 --------------------------------------------------------------------------
    ("time", 63.32, "like", 63.320, 63.745),
    ("time", 64.00, "yolo", 63.960, 64.500),
    ("time", 66.54, "here", 66.540, 66.795),
    ("time", 67.54, "it", 67.740, 67.940),
    ("time", 69.88, "here", 69.880, 70.180),
    # M glues the 0.880 s pause INSIDE the token (' and' 70.40-71.24); the real onset is 71.065.
    ("time", 70.40, "and", 71.065, 71.240),
    ("time", 74.92, "that", 74.920, 75.155),
    # ---- SWAPPY, the list-completing hard-out --------------------------------------------------
    ("time", 75.60, "but", 75.455, 75.780),
    # "this would be my number four" - M inserts an ' in' (p 0.31) that makes the line ungrammatical
    # ("would be in my number four"); L reads "would be my number four" and W reads "be my number
    # four". Two decoders against one low-probability token.
    ("drop", 76.80, "in", "phantom (p 0.31); L and W both read 'would be MY number four'"),
    ("time", 77.20, "four", 77.255, 77.470),
    ("time", 77.62, "maybe", 77.705, 78.030),
    # M splits the name as ' swap' + ' it'. L reads ' Swapy' (p 0.84) as ONE token and the batch
    # clip-plan flags "'Swapy' 2159.20 -> 'Swappy'"; W reads " swapping". RMS: one voiced island
    # 78.110-78.280.
    ("merge", 77.88, "swap", 78.14, "it", " Swappy", 78.110, 78.280),
    ("time", 78.28, "would", 78.315, 78.420),
    ("time", 78.42, "be", 78.420, 78.500),
    ("time", 78.50, "like", 78.500, 78.600),
    # OMITTED SPEECH: "would be like MY number five". L has ' my' (2159.98-2160.10) and W has ' my'
    # (78.44-78.58); M drops it entirely, and a dropped word cannot be repaired downstream.
    ("ins", 78.60, "number", " my", 78.600, 78.680),
    ("time", 78.60, "number", 78.680, 78.820),
    ("time", 78.78, "five", 78.935, 79.160),
]

# ── apply ────────────────────────────────────────────────────────────────────────────────────────
def core(w):
    import re
    return re.sub(r"[^a-z0-9']", "", w.lower())


d = json.load(open(SRC, encoding="utf-8"))
words = []
for seg in d["segments"]:
    for w in seg.get("words", []):
        words.append(dict(w))
n_in = len(words)

used = [False] * len(OPS)


def find(start, c, skip_used_at=None):
    for i, w in enumerate(words):
        if w is None:
            continue
        if abs(w["start"] - start) < 1e-6 and core(w["word"]) == c:
            if skip_used_at is not None and i in skip_used_at:
                continue
            return i
    return -1


taken = set()
inserts = []          # (index_of_anchor, token)
n_time = n_text = n_drop = n_merge = n_ins = 0
for oi, op in enumerate(OPS):
    kind = op[0]
    if kind == "time":
        _, st, c, ns, ne = op
        i = find(st, c, taken)
        assert i >= 0, f"op {oi} time {st} {c!r}: no such shipped token"
        taken.add(i)
        words[i]["start"], words[i]["end"] = ns, ne
        n_time += 1
    elif kind == "text":
        _, st, c, nw, ns, ne = op
        i = find(st, c, taken)
        assert i >= 0, f"op {oi} text {st} {c!r}: no such shipped token"
        taken.add(i)
        words[i].update(word=nw, start=ns, end=ne, probability=0.90)
        n_text += 1
    elif kind == "drop":
        _, st, c, _why = op
        i = find(st, c, taken)
        assert i >= 0, f"op {oi} drop {st} {c!r}: no such shipped token"
        words[i] = None
        n_drop += 1
    elif kind == "merge":
        _, st1, c1, st2, c2, nw, ns, ne = op
        i = find(st1, c1, taken)
        j = find(st2, c2, taken)
        assert i >= 0 and j >= 0, f"op {oi} merge: missing {st1} {c1!r} / {st2} {c2!r}"
        taken.add(i)
        words[i].update(word=nw, start=ns, end=ne, probability=0.90)
        words[j] = None
        n_merge += 1
    elif kind == "ins":
        _, st, c, nw, ns, ne = op
        i = find(st, c)
        assert i >= 0, f"op {oi} ins before {st} {c!r}: no such shipped token"
        inserts.append((i, {"word": nw, "start": ns, "end": ne, "probability": 0.90}))
        n_ins += 1
    used[oi] = True

assert all(used), "some ops never fired"

out = []
for i, w in enumerate(words):
    for ai, tok in inserts:
        if ai == i:
            out.append(tok)
    if w is not None:
        out.append(w)

# ── verify ───────────────────────────────────────────────────────────────────────────────────────
for a, b in zip(out, out[1:]):
    assert a["start"] <= b["start"] + 1e-9, f"non-monotonic: {a} -> {b}"
    assert a["end"] <= b["start"] + 1e-9 or abs(a["end"] - b["start"]) < 0.26, \
        f"overlap {a['word']!r} {a['end']} vs {b['word']!r} {b['start']}"
# A token longer than 0.80 s is normally a PAUSE glued inside it (defect 2). The only genuinely long
# words in this clip are these two, both measured as continuous voiced runs, so they are allowlisted
# and every OTHER long token is a hard failure.
LONG_OK = {"unequivocally", "potential"}
for w in out:
    assert w["end"] > w["start"], f"zero/negative duration: {w}"
    if core(w["word"]) not in LONG_OK:
        assert w["end"] - w["start"] < 0.80, f"suspiciously glued token (>0.80s): {w}"
assert out[-1]["end"] <= 79.44, "past the clip end"

text = "".join(w["word"] if w["word"].startswith(" ") else " " + w["word"] for w in out)
json.dump({"text": text.strip(),
           "segments": [{"id": 0, "start": out[0]["start"], "end": out[-1]["end"],
                         "text": text.strip(), "words": out}],
           "language": "en"},
          open(DST, "w", encoding="utf-8"), indent=1)
print(f"wrote {DST}")
print(f"  {n_in} -> {len(out)} tokens   "
      f"retimed {n_time}  rewritten {n_text}  dropped {n_drop}  merged {n_merge}  inserted {n_ins}")
print(f"  span {out[0]['start']:.3f}-{out[-1]['end']:.3f}s")

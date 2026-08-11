"""tutorial / clip 8 (freaking-early-not-degen-impact) — whisper-words.json -> whisper-words-verified.json.

Run from the repo root:
  python video-creation/shorts/tutorial/freaking-early-not-degen-impact/_patch_words.py

This clip shares its AUDIO with clip 4 (`freaking-early-not-degen`): clip 8 is master 2201.27-2223.03,
a subset of clip 4's segment 1. So clip 4's own verified stream — measured at 5 ms RMS on the identical
recording and already shipped/gated — is used here as an INDEPENDENT cross-check on every decision
below, on top of this spine's own measurements. The two clocks are related by a measured offset of
**22.926 s** (clip4_t - 22.926 = clip8_t) up to the 15.6 s splice, and **23.19 s** after it, because
clip 8's tighten pass removed the stuttered first "that" of "that, that's what I'm looking for"
(clip 4 keeps it; that is the whole 0.264 s length difference between the two tails).

────────────────────────────────────────────────────────────────────────────────────────────────────
PART 1 — THE DROPPED-SPEECH AUDIT (the batch defect the build contract calls out). RESULT: CLEAN.
────────────────────────────────────────────────────────────────────────────────────────────────────
The contract warns the shipped word pass can SILENTLY OMIT speech (eliza clip 2 lost 1.34 s; tutorial
clip 1 lost 1.80 s; tutorial clip 3 lost two "you know" fillers). Audited three ways here.
**NOTHING is missing — zero words are restored.**

  (a) 5 ms-hop / 10 ms-window RMS on the staged spine (canonical dual threshold, silence < -57 dB /
      audio > -52 dB) finds EIGHT voiced spans:
        0.125- 3.831 | 4.295- 6.560 | 7.303- 9.439 | 9.823-10.920 |
       11.838-15.634 | 15.639-16.707 | 16.742-18.588 | 18.613-19.960
      The four internal silences (3.831-4.295, 6.560-7.303, 9.439-9.823, 10.920-11.838) are all true
      DIGITAL ZERO (-240 dBFS, the mic is noise-gated). The three remaining "gaps" are 5-35 ms dips
      with floors of -61/-65/-61 dB, i.e. word-INTERNAL stop closures, not boundaries: a 2 ms-hop /
      6 ms-window rescan resolves them as 15.617-15.641 (the 5B splice), 16.707-16.742 (inside " for")
      and 18.551-18.617 (the /p/ closure of "pump"). Every voiced span is covered by shipped tokens;
      there is no unexplained voiced region anywhere.
  (b) An INDEPENDENT full-clip medium.en pass (temperature 0, word timestamps) on the same audio
      returns **72 tokens against the shipped pass's 73**, aligning 1:1 with no insertion or deletion
      by the shipped pass. The shipped pass has ONE MORE token, not one fewer: it hears " that" in
      "the ones THAT are gonna pump" (18.000-18.180) where medium.en drops it. Lexical differences
      are cosmetic: " freaking"/" freakin" and " Like"/" like,". So the shipped pass is the SUPERSET
      and nothing is missing.
  (c) The tail 19.960-20.132 (0.172 s) and the head 0.000-0.125 (0.125 s) are silence, matching clip
      4's own tail (43.150-43.328 = 0.178 s) to 6 ms. No un-captioned loud sound exists anywhere: the
      loudest thing outside the voiced spans is -240 dB.

────────────────────────────────────────────────────────────────────────────────────────────────────
PART 2 — WHAT THIS SCRIPT DOES: RE-ANCHOR MISALIGNED EDGES + UNDO ONE PHANTOM TOKEN SPLIT.
────────────────────────────────────────────────────────────────────────────────────────────────────
The other documented batch defect is that the word JSON is unreliable for EDGE PLACEMENT (onsets off
by up to ~1.07 s, pauses GLUED INSIDE a token, phantom splits). That matters for one concrete visible
reason: the montserrat preset breaks a caption group on a gap > 0.45 s, so a glued pause SUPPRESSES a
caption break the ear expects — and an onset placed on the wrong side of a pause puts a word ON SCREEN
during a deliberate silence.

The three edges that actually change the screen here:

  * " and" (index 15) is shipped starting at 3.820 with " listed" ending at 3.820 — a 0.000 s gap
    across a MEASURED 0.464 s digital-zero pause. Raw, the tool welds "...tokens that i've just
    listed" onto "and they're gonna be buying in" AND paints "and they're gonna" over the pause.
    (This is the exact defect clip 4 called "THE BIG ONE" at its own 26.760/27.225 — the same pause,
    22.929 s later on its clock.)
  * " is" (index 36) is shipped at 10.920-11.160, i.e. INSIDE the 0.918 s digital-zero suspense beat
    10.920-11.838, where there is provably no audio at all (-240 dB). The real " is" is the first
    0.202 s of the next voiced span. Clip 4 measured the identical token at 34.765-35.020 (= 11.839-
    12.094 here) — after the beat, not before it. Raw, the caption rail strands a lone "is" on screen
    for 1.12 s across Mike's biggest deliberate pause; re-anchored, "…this particular token" holds the
    pause and "is like 700 million" opens the reveal.
  * " crap."/" I" (26/27) and " this"/" particular" (33/34) both straddle protected delivery beats
    (0.743 s and 0.384 s) with onsets 0.203 s / 0.003 s off, so the captions land off the beat.

ONE PHANTOM SPLIT is undone (this is the established method — tutorial clip 2's `_patch_words.py`
merges a split " far"+" far" back to one " fart" token): this clip's pass and medium.en BOTH render the
single word "at" in "I got in AT like 1.8 million" as TWO tokens, " and" (0.060 s) + " I" (0.120 s),
producing the ungrammatical on-screen line "and i got in and i / like 1.8 million." The merge is
justified by evidence from the identical audio rather than by preference:
  - clip 4's shipped pass AND an independent medium.en pass both read ONE " at" token there, spanning
    37.200-37.320 = 14.274-14.394 on this clock — exactly the slot the two phantom tokens occupy
    (14.260-14.440);
  - clip 8's own tighten note is quoted verbatim in the captions tool: "the post-cut render decodes
    'I got in AT like 1.8 million' … caption what he says";
  - it CANNOT be done as a PHRASE_CORRECTION. The only keys narrow enough to be safe are 3-4 tokens
    long ( ("in","and","i","like") ), and `_apply_phrases_once` zips span-to-replacement, so a 4->3
    rule would silently DROP the real following " like" (14.440-14.820) and leave a 0.38 s hole. A
    2->1 key of ("and","i") alone is unusable: this very clip contains a genuine "700 million AND I
    got in", which such a rule would rewrite to "at got in".
This is also why no rule for it may live in the shared tool: clip 4's stream has no ("in","and","i")
run at all, so a clip-8 rule there could never be verified against it. Handling it per-clip here keeps
clip 4's shipped captions byte-identical by construction.

Every value below is read off THIS spine's own RMS curve (render-assets/freaking-early-not-degen-impact
.mp4). Nothing is invented, no token is added, no token order changes, and the stream stays strictly
monotonic. Net: 73 tokens -> 72 (the phantom split merged), 11 edges moved, 0 words restored.

The edge deliberately NOT moved:
  * word 0 " You" keeps start 0.000 (measured voice onset 0.125). Frame 0 is the designed thumbnail
    cover and the first caption is wanted from frame 1; a 0.125 s start would blank frames 1-3.
    (Clip 4 made the identical call for the identical reason.)
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "whisper-words.json")
DST = os.path.join(HERE, "whisper-words-verified.json")

# (token_index, field, old_value, new_value, why) — index is into the flat shipped 73-token stream.
REANCHOR = [
    (14, "end", 3.820, 3.831, "'listed' real voice END (end of voiced span 1)"),
    (15, "start", 3.820, 4.295, "'and' real onset. THE BIG ONE: shipped gap 0.000 s vs a MEASURED "
                                "0.464 s digital-zero pause, so both the caption break and the "
                                "pause-holds-the-frame behaviour only fire once this edge moves"),
    (26, "end", 6.680, 6.560, "'crap.' real voice END; the 0.743 s protected delivery beat is "
                              "6.560-7.303, not 6.680-7.100"),
    (27, "start", 7.100, 7.303, "'I' (I was so freaking early) real onset; shipped is 0.203 s early, "
                                "which paints the caption over the protected beat"),
    (33, "end", 9.820, 9.439, "'this' real voice END. Shipped glues the 0.384 s delivery beat "
                              "(9.439-9.823) INSIDE the token"),
    (34, "start", 9.820, 9.823, "'particular' real onset (+3 ms, measured)"),
    (36, "start", 10.920, 11.838, "'is' real onset. Shipped places it INSIDE the 0.918 s digital-zero "
                                  "suspense beat where there is no audio; clip 4 measures the same "
                                  "token AFTER the beat (34.765 = 11.839 here)"),
    (36, "end", 11.160, 12.040, "'is' real voice END, butted against the measured ' Like' onset"),
    (49, "end", 15.620, 15.634, "'1.8 million.' real voice END = the end of the PROTECTED PEAK. The "
                                "payoff SFX cue starts after this value, so it must be exact"),
    (50, "start", 15.660, 15.639, "'That's' real onset (the 5B splice notch is 15.617-15.641, floor "
                                  "-72.2 dB at 6 ms resolution)"),
    (72, "end", 19.980, 19.960, "'die' real voice END; 19.960-20.132 is the tail silence"),
]

# Phantom-split merge: (first_index, count, new_token_text, why)
MERGE = (44, 2, " at", "the single word 'at' of \"I got in AT like 1.8 million\", rendered by two "
                       "passes as ' and'(0.060 s) + ' I'(0.120 s). Span kept whole: 14.260-14.440.")

d = json.load(open(SRC, encoding="utf-8"))
words = [dict(w) for seg in d["segments"] for w in seg.get("words", [])]
assert len(words) == 73, f"expected the audited 73-token stream, got {len(words)}"

moved = 0
for idx, field, old, new in ((i, f, o, n) for i, f, o, n, _ in REANCHOR):
    got = round(words[idx][field], 3)
    assert abs(got - old) < 1e-6, f"token {idx} {field} is {got}, expected {old} (input changed?)"
    words[idx][field] = new
    moved += 1

mi, mn, mtext, _ = MERGE
assert [words[mi]["word"], words[mi + 1]["word"]] == [" and", " I"], \
    f"merge target changed: {words[mi:mi+2]}"
merged = {"word": mtext, "start": words[mi]["start"], "end": words[mi + mn - 1]["end"]}
words[mi:mi + mn] = [merged]

# invariants: monotonic starts, non-negative durations, exactly one token removed
for a, b in zip(words, words[1:]):
    assert a["start"] <= b["start"] + 1e-9, f"non-monotonic: {a} -> {b}"
    assert a["end"] <= b["start"] + 1e-9, f"overlapping tokens: {a} -> {b}"
for w in words:
    assert w["end"] >= w["start"] - 1e-9, f"negative duration: {w}"
assert len(words) == 72

text = "".join(w["word"] for w in words)
json.dump({"text": text,
           "segments": [{"id": 0, "start": words[0]["start"], "end": words[-1]["end"],
                         "text": text, "words": words}],
           "language": "en"},
          open(DST, "w", encoding="utf-8"), indent=1)
print(f"wrote {DST}")
print(f"  words restored (dropped speech): 0  -- audit is CLEAN, see the docstring")
print(f"  edges re-anchored to 5 ms RMS:  {moved}")
print(f"  phantom token splits merged:    1  (' and'+' I' -> ' at')")
print(f"  tokens: 73 -> {len(words)}")

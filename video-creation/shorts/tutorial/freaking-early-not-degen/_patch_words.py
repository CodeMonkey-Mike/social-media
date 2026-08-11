"""tutorial / clip 4 (freaking-early-not-degen) — whisper-words.json -> whisper-words-verified.json.

Run from the repo root:
  python video-creation/shorts/tutorial/freaking-early-not-degen/_patch_words.py

────────────────────────────────────────────────────────────────────────────────────────────────────
PART 1 — THE DROPPED-SPEECH AUDIT (the batch defect the build contract calls out). RESULT: CLEAN.
────────────────────────────────────────────────────────────────────────────────────────────────────
The contract warns that the shipped word pass can SILENTLY OMIT speech (eliza clip 2 lost 1.34 s;
tutorial clip 1 lost 1.80 s; tutorial clip 3 lost two "you know" fillers). This clip was audited the
same way and **NOTHING is missing — zero words are restored here.**

  (a) 5 ms-hop / 10 ms-window RMS on the staged spine (dual threshold, silence < -57 dB /
      audio > -52 dB, spans merged across < 60 ms) finds exactly TEN voiced spans and NINE internal
      silences, every one of which is true DIGITAL ZERO (-240 dBFS, the mic is noise-gated):
        0.145- 8.645 | 9.440-10.735 | 11.055-13.545 | 13.730-19.425 | 20.285-22.375 |
       23.055-26.760 | 27.225-29.485 | 30.230-32.365 | 32.750-33.845 | 34.765-43.150
      Every span is covered by shipped word tokens; there is no unexplained voiced region.
  (b) An INDEPENDENT full-clip medium.en pass (temperature 0, word timestamps) on the same audio
      returns **165 tokens against the shipped pass's 165**, aligning 1:1 with only THREE lexical
      differences and no insertions or deletions anywhere:
          shipped "dj"        -> medium "degen"      (7.30-7.64)
          shipped "listed"    -> medium "listen"     (10.82-11.62)
          shipped "stations"  -> medium "exchanges"  (12.40-12.86)
      All three are MISHEARS, not missing speech, so per the contract they are fixed in the captions
      tool's PHRASE_CORRECTIONS (tutorial clip-4 block) and NOT here. ("listed" is the correct one of
      that pair: both the clip-plan segment note and the tighten plan quote the line as "listed on all
      these centralized exchanges".)
  (c) The tighten plan's relock already trimmed the ONE untranscribed loud sound in this stretch (the
      0.6 s vocalisation at master 2177.290-2177.890, peak -16.7 dB) OUT of the spine, so there is no
      un-captioned noise left to account for.
  (d) Three near-zero-duration tokens exist and are DELIBERATELY LEFT ALONE, because neither the
      grouping (which breaks on gaps > 0.45 s, word caps, and sentence punctuation) nor the on-screen
      output reads them: " know," 3.580-3.580, " going" 28.540-28.560, " going" 41.420-41.460. All
      three sit mid-run inside continuous voiced audio; medium.en compresses the same three the same
      way. Inventing spans for them would move real timings for no visible gain.

────────────────────────────────────────────────────────────────────────────────────────────────────
PART 2 — WHAT THIS SCRIPT ACTUALLY DOES: RE-ANCHOR THE MISALIGNED EDGES TO MEASURED RMS.
────────────────────────────────────────────────────────────────────────────────────────────────────
The other documented defect in this batch is that the word JSON is unreliable for EDGE PLACEMENT:
onsets off by up to ~0.43 s, and pauses GLUED INSIDE a word token (the tighten plan says in terms
that "the master JSON is badly misaligned in this stretch"). That matters here for one concrete,
visible reason: the montserrat preset breaks a caption group on a gap > 0.45 s, so a glued pause
SUPPRESSES a caption break that the ear expects.

Worst real case in this clip: " listed" is shipped as ending at 26.800 and " and" as starting at
26.800 (a 0.000 s gap), while the measured silence between them is **26.760-27.225 = 0.465 s**. With
the raw timings the tool welds "...tokens that i've just listed" onto "and they're going to be buying
in"; with the measured edges the break fires exactly where he pauses.

Every value below is read off the 5 ms RMS curve of the STAGED spine
(render-assets/freaking-early-not-degen.mp4). Nothing is invented, no token is added or removed, no
token order changes, and the stream stays strictly monotonic. Only these 20 edges move.

The two edges deliberately NOT moved:
  * word 0 " I'm" keeps start 0.000 (measured voice onset 0.145). Frame 0 is the designed thumbnail
    cover, and holding the first caption from frame 1 is wanted; a 0.145 s start would blank
    frames 1-4.
  * " million" -> " that" at 38.575/38.600 is left as measured: that 25 ms digital-zero notch is the
    5B desilence join of master 2217.320-2218.335 and it is the anchor the payoff SFX cue is built on.
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "whisper-words.json")
DST = os.path.join(HERE, "whisper-words-verified.json")

# (token_index, field, old_value, new_value, why)  — index is into the flat shipped word stream.
REANCHOR = [
    (43, "end", 8.720, 8.645, "'really' voice END (measured); the 0.795 s beat before the second "
                              "'I don't really' is 8.645-9.440, not 8.720-9.280"),
    (44, "start", 9.280, 9.440, "second 'I' real onset; shipped is 0.160 s early"),
    (49, "end", 11.140, 10.735, "'that' (…trade like that) real voice END. Shipped absorbs the whole "
                                "seg0->seg1 join silence INSIDE the token (0.405 s of pause glued in)"),
    (50, "start", 11.140, 11.055, "'Listed' real onset = the first frame of segment 1; shipped is "
                                  "0.085 s late"),
    (57, "end", 13.560, 13.545, "'mainstream' real voice END (the tighten join at master 2187.045)"),
    (58, "start", 13.560, 13.730, "the SURVIVING 'when' real onset; shipped is 0.170 s early"),
    (78, "end", 19.500, 19.425, "'in' (everybody's coming back in) real voice END"),
    (79, "start", 20.000, 20.285, "'I' (I want to get into) real onset; shipped is 0.285 s early. "
                                  "This is the tighten join at master 2194.5-2195.28"),
    (87, "end", 22.560, 22.375, "'that' real voice END before the 3.75 s tighten removal at master "
                                "2197.65-2201.40"),
    (88, "start", 23.120, 23.055, "'You' (you know, retail…) real onset"),
    (103, "end", 26.800, 26.760, "'listed' real voice END"),
    (104, "start", 26.800, 27.225, "'and' real onset. THE BIG ONE: shipped gap 0.000 s vs measured "
                                  "0.465 s, so the caption break at this pause only fires once the "
                                  "edge is re-anchored"),
    (117, "end", 29.600, 29.485, "'crap' real voice END; the 0.745 s beat inside the protected peak is "
                                "29.485-30.230"),
    (118, "start", 30.160, 30.230, "'I' (I was so freaking early) real onset"),
    (124, "end", 32.720, 32.365, "'this' real voice END. Shipped glues the 0.385 s beat (master "
                                 "2211.120-2211.505) INSIDE the token"),
    (125, "start", 32.720, 32.750, "'particular' real onset"),
    (126, "end", 33.840, 33.845, "'token' real voice END (+5 ms, measured)"),
    (127, "start", 34.580, 34.765, "'Is' (is like 700 million) real onset; shipped is 0.185 s early. "
                                   "The 0.920 s suspense beat is 33.845-34.765"),
    (139, "end", 38.580, 38.575, "'million' real voice END = the end of the PROTECTED PEAK. The payoff "
                                 "SFX cue starts after this value, so it must be exact"),
    (164, "end", 43.160, 43.150, "'die' real voice END; 43.150-43.328 is the tail"),
]

d = json.load(open(SRC, encoding="utf-8"))
words = [dict(w) for seg in d["segments"] for w in seg.get("words", [])]
assert len(words) == 165, f"expected the audited 165-token stream, got {len(words)}"

moved = 0
for idx, field, old, new in ((i, f, o, n) for i, f, o, n, _ in REANCHOR):
    got = round(words[idx][field], 3)
    assert abs(got - old) < 1e-6, f"token {idx} {field} is {got}, expected {old} (input changed?)"
    words[idx][field] = new
    moved += 1

# invariants: monotonic starts, non-negative durations, nothing added or removed
for a, b in zip(words, words[1:]):
    assert a["start"] <= b["start"] + 1e-9, f"non-monotonic: {a} -> {b}"
for w in words:
    assert w["end"] >= w["start"] - 1e-9, f"negative duration: {w}"
assert len(words) == 165

text = "".join(w["word"] for w in words)
json.dump({"text": text,
           "segments": [{"id": 0, "start": words[0]["start"], "end": words[-1]["end"],
                         "text": text, "words": words}],
           "language": "en"},
          open(DST, "w", encoding="utf-8"), indent=1)
print(f"wrote {DST}")
print(f"  words restored (dropped speech): 0  -- audit is CLEAN, see the docstring")
print(f"  edges re-anchored to 5 ms RMS:  {moved}")

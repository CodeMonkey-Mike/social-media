# defumbler — the canonical fumble-removal skill

Reusable, track-agnostic procedure for turning a raw multi-take talking-head/VO recording into a
clean spoken spine (every "say-it, stop, retake" reduced to the last clean take), with **no clipped
words**. Used by `longform-edited`, `longform-presentation`, shorts, vertical-AI-persona, and any
future process that records spoken audio. Generic by file path: point it at any video or audio file.

> This skill exists because the same job kept "starting over" and failing the first round on every
> new video (silverscript, 2026-06-13, failed 3x before this). The failures were ALWAYS the same two
> bugs. The rules below are the fix. **Follow the procedure top to bottom; do not improvise a faster
> path — the faster path is the one that fails.**

---

## The two failure modes (why the naive approach always breaks)

1. **Whisper HIDES retakes.** Run on a whole multi-take file, Whisper dedupes "say-it / stop /
   retake" into ONE collapsed "held word" (a 4-5s word). So the whole-file transcript is NOT a
   complete map — fumbles are invisible in it, and you leave them in.
2. **Whisper word timings DRIFT** (up to ~2.5s, and differ run-to-run). So cutting on a word
   timestamp lands inside a real word and clips it ("runtime"→"run", "353x"→"three").

Both are fatal to the obvious approach (transcribe whole file → eyeball `detect_fumbles` → cut on
word times). Do not use that approach to CUT.

## HARD RULES (non-negotiable)

- **Decouple silence from fumbles.** Never remove silence and fumbles in the same pass. This skill
  removes ONLY fumbles (keeps natural pacing). Tighten silence later as a separate, explicit step via
  the sibling **desilencer skill** (`video-creation/skills/desilencer/desilencer.md`) — a different operation
  with a different tool. Defumble first, then desilence the master.
- **A loud anomalous burst is NOT a fumble.** A throat-clear / cough / click / mic-bump is not a
  retake, so this skill won't catch it (and the desilencer keeps it — it's loud, not silence). When a
  specific burst is reported between two words, use the sibling **burst-removal skill**
  (`video-creation/skills/burst-removal/burst-removal.md`): cut from end-of-word-A to start-of-word-B.
- **Cut only inside a silence gap. NEVER cut on a Whisper word timestamp.** Every cut boundary must
  sit in the middle of a detected silence. This is what makes word-clipping impossible. The chunk
  map's `sil_before`/`sil_after` give you those silences.
- **−50 dB is the hottest safe threshold for a CUT edge.** −40 dB detects the quiet tails/middles of
  words as "silence" and eats syllables. For *segmentation/analysis* −42 dB is fine; for anything
  that defines a cut edge, stay ≤ −45 dB and verify against the word.
- **Cut-plan approval is OPTIONAL (Mike, 2026-06-29): default to SKIP it.** Mike found reviewing a long
  cut-plan too much to consume; he would rather **review the finished video** after all three spine skills
  (defumble -> cover-blackout -> desilence) run straight through. So by default DO NOT block for cut-plan
  approval, render the defumble, chain the next two skills, and hand him the final to review. The automated QA
  below (re-run the chunk map) STILL runs every time, it is what now catches misjudged drops / clipped words in
  his place. (Only surface the plan first if HE asks, or if a recording is unusually ambiguous and you genuinely
  need his call on which take to keep.)
- **QA after render by re-running the chunk map** on the output and confirming no partial/restart
  chunk and no clipped word remains. Re-transcribing the whole output is NOT sufficient (Whisper
  dedupes the output too).
- **A reported NOISE (throat-clear / cough / swallow / lip-smack / stray breath) is CUT as audio+video
  together, NEVER blacked (Mike, 2026-06-29, hard rule).** When Mike points at a noise at a timecode, find the
  **last sound of the word BEFORE it** and the **first sound of the word AFTER it**, and CUT everything in
  between — audio AND video, one `remove_spans` cut. Jump-cut the two words together; if the jump is too abrupt,
  replace the gap with ~500 ms of DEAD silence instead, never more. **NEVER black the video while keeping the
  audio** — you still HEAR the noise and voice-over-black reads as broken (this is the exact mistake to avoid).
  Leave ZERO margin: cut from the millisecond the prior word's sound ends to the millisecond the next word's
  sound begins. A look-away/glance that overlaps the tail of the prior word travels with that word; do not chase
  it into the word (don't clip the word) — the cut starts where the word's sound stops.

---

## Procedure

**Input:** a recording (mkv/mp4/wav). Optionally compress to a lighter working proxy first if huge
(any track's `to_low_bps.py`); the defumble works on the proxy or the raw file.

**1. Build the chunk map** (the reliable primitive):
```
python <repo>/video-creation/skills/defumbler/scripts/chunk_map.py "<recording-or-proxy>"
```
Writes `<name>._chunkmap.txt` (read this) and `<name>._chunkmap.json` (cut math). Each line:
`[idx] start-end (dur) gapBefore  text`. Silence has already split the takes apart, and each chunk
was transcribed in isolation, so **every retake is now its own visible chunk**.

**2. Read the map and mark keep/drop.** A fumble is a chunk that is a partial or restart of a later
chunk (cut-off word like "oc—", "10—", "casp—"; or a doubled phrase; or a misspeak immediately
re-said). Rule: **keep the LAST clean/complete take of each line, drop the earlier partial(s).**

> **A retake ALWAYS supersedes an earlier take — even a CLEAN, complete one (Mike, 2026-06-21).** If Mike
> says a line as a clean single take and then re-records it, the retake means he didn't like the first —
> **keep the LAST take, drop the earlier clean one, and do NOT present it as a choice.** The later take always
> wins. (The ONLY exception: if the last take is itself garbled/misspoken, keep the last *clean* take.)

Two drop shapes:
   - **Whole-chunk drop** (the partial is its own chunk, silence both sides): trivially safe.
   - **Tail drop** (the partial is glued to the end of an otherwise-good chunk, e.g. "...covenant
     logic, but only by manually writing low-level oc—"): re-run `chunk_map.py` on just that region
     with a finer `--sil-d 0.15` to expose the micro-pause before the fumble, and cut from there to
     the chunk's trailing silence.

**3. Derive the cut list — every edge inside a silence.** For each dropped span, set
`a = midpoint(sil_before)` and `b = midpoint(sil_after)` from the JSON (or the finer micro-silence
for a tail drop). This guarantees no edge touches a word.

**4. Present the text cut-plan to Mike** (numbered: `DROP [062] "A token goes from running on a bolt
on a layer." (partial of [063])`). Get his yes / corrections. He can hear; you cannot — trust his
catches.

**5. Render once** with the proven sync-safe cutter:
```
python <repo>/video-creation/skills/defumbler/scripts/remove_spans.py "<recording-or-proxy>" \
    --out "<name> EDIT.mp4"  --cut a-b --cut a-b ...
```
Single filter_complex pass, A/V locked, declicked joins. Confirms drift (expect <50ms).

**6. QA:** re-run `chunk_map.py` on the output. Confirm: no partial/restart chunk survives, no chunk
text shows a clipped word at a join, drift OK. Only then is it done.

---

## Notes / learnings (append as we learn more)

- 2026-06-13 silverscript: established this method after the whole-file/`detect_fumbles`/word-timing
  approach clipped words and missed fumbles 3 times. −40 dB desilence clipped "353x"→"three",
  "runtime"→"run"; −50 dB is clean. The chunk map exposed 11 fumbles the whole-file transcript hid.
- The old per-track helpers (`detect_fumbles.py`, `audit_coverage.py`) are **context/diagnosis only**
  — never derive a cut directly from them. `build_two_zone.py` is for the *separate* silence pass.

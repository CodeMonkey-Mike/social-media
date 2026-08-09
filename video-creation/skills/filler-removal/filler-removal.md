# Filler removal (Phase 5C) — track-agnostic, CANONICAL

_Created 2026-07-23 after Mike listened to the October-pumps tightened clips and asked why the
ums and uhs were still there. They were still there because the documented step that was supposed
to remove them **silently no-opped**. This skill is the mechanical replacement._

> **GRAPH BANNER (LangGraph Wave 4, 2026-08-07) — livestream shorts batches:** the EXECUTION of
> this skill is a node of the finish segment (`graph/run.py finish --batch <batch>`), which runs
> the canonical `cut_fillers.py` per clip off `shorts/<batch>/filler-plan.json` and
> passthrough-copies clips with no spans (every clip ends at `<slug>-final.mp4`). The JUDGMENT
> stays here: run `filler_map.py`, adjudicate the spans per the classes below (tics auto-cut;
> stall-phrase / discourse-like need review), and land the approved spans in filler-plan.json
> BEFORE invoking the graph. No plan file = a passthrough-only 5C, which is a valid outcome.

## Why the old step failed (read this before "improving" anything)

The Phase 5 tighten skill says:

> 2. **Auto-remove filler disfluencies** inside the kept range ... **Word boundaries come from the
>    Whisper word JSON.**

That instruction cannot work, for two independent reasons:

1. **Whisper de-disfluences.** It is trained on clean text and drops filler tokens. On the
   27-minute `October-pumps` master it transcribed **3 "um"s for the entire livestream**. Running
   the `medium` model over the finished clips returned **ZERO** um/uh — bigger models are *more*
   fluent, so they are *worse* for this job. `small` is the best of a bad set.
2. **Whole-clip decoding produces broken word alignment.** On a 95s clip Whisper reported a single
   **3.30-second token `to`**; decoded in a 9-second window the same audio is the complete sentence
   *"The point where we're going to probably have to schedule an appointment with a psychiatrist."*
   It also reported a 0.40s `uh` that is really the number **240**. Any detector built on whole-clip
   word spans is reading noise.

Corollary: an **acoustic** gap detector on top of whole-clip words also finds nothing, because
Whisper stretches word spans to cover the gaps — measured word-coverage of voiced audio came back
at 100% with zero orphan islands. The alignment is the problem, not the audio.

## The method

**Decode in short overlapping windows.** Short context defeats the fluency prior and keeps the
alignment honest. Dedupe overlapping words by preferring the one whose centre is nearest its
window's centre (edge words are the badly-aligned ones).

```
scripts/filler_map.py  <clip.mp4> --out map.json      # 10s windows, 3s overlap, model=small
scripts/cut_fillers.py <clip.mp4> --spans spans.json --out out.mp4
```

`filler_map.py` **proposes, never cuts.** It emits clip-local words plus ranked candidates:

| kind | confidence | meaning |
|---|---|---|
| `tic` | **certain** | literal `um/uh/erm/hmm/ah/er` — always cut |
| `stall-phrase` | review | `you know` / `i mean` / `kind of` / `sort of` |
| `discourse-like` | review | a `like` that is not obviously comparative |

**`discourse-like` MUST be hand-reviewed — the detector cannot tell these apart:**

- ✅ cut — hedge on a number: *"go to **like** 20 million"*, *"**like** every 12 hours"*
- ✅ cut — sentence-initial marker: *"**Like**, other than that..."*
- ⛔ keep — comparative: *"**like** me"*, *"green **like** crazy"*, *"**like** any minute"*, *"**like** I said"*
- ⛔ keep — quotative: *"with FOMO **like**, oh my god"*
- ⛔ keep — **the verb**: *"NineHood is one of the ones I **like**"* ← the detector false-positives this every time

## Hard rules

- **Ceiling 8%** of clip duration, enforced in `cut_fillers.py` (it exits non-zero above it). This
  pass is a polish on top of the Phase 5 tighten's ~10%, not a second tighten.
- **Every boundary snaps to the local RMS minimum** within ±100 ms, then splices with the canonical
  8 ms declick. Reuses `skills/desilencer/scripts/desilence.py` for levels + render so the encode
  matches the rest of the pipeline. Never write a second silence detector.
- **The per-splice gate is mandatory.** After rendering, transcribe a ±3s window around each splice
  *in the output* and confirm the 5 words either side survive.
  - Do **NOT** gate by diffing two whole-clip transcriptions. Two independent Whisper decodes of the
    same audio differ by normal variance (`robahood`/`robber hood`, `advice`/`vice`) and one clip
    came back with *more* words after cutting. That gate reports pure noise.
  - **A word that changes identity across the splice is a clipped word, not variance.** On
    2026-07-23 a 0.14s cut turned *"we could even **be** 100x"* into *"we could even **get** 100x"*.
    That cut was withdrawn. This is the same signature as the 2026-07-22 clip-3 incident where a
    0.36s `like` cut shaved the tail of *"especially"*.
  - **When a sub-second cut trips the gate, withdraw it.** Tenths of a second are never worth a
    clipped word. Record the withdrawal in the plan with a `_withdrawn` note rather than deleting
    the row, so the reasoning survives.

## Where it sits in the order

```
raw cut (4b) → tighten (5) → desilence (5B) → FILLER REMOVAL (5C) → review → captions (6) → render (7)
```

Runs on the finished `-tightened-desilenced.mp4` and writes `-final.mp4`. Passthrough-copies clips
with no approved spans so every clip has a `-final.mp4` and downstream phases need no special-casing.
Plan lives at `shorts/<batch>/filler-plan.json`, results at `shorts/<batch>/filler_log.json`.

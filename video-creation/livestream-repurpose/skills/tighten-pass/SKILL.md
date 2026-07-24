# Tighten pass (Phase 5) (livestream-repurpose track skill - CANONICAL)

_Moved VERBATIM from `video-creation/SKILL.md` on 2026-07-08 (Mike: per-track skills live in the track folder; this predates that convention). **This file is now canonical**; the master SKILL.md keeps a pointer stub and the phase-map table points here. Paths inside are written relative to `video-creation/` exactly as in the original._

## Phase 5 — Tighten pass (`tighten_clips.py`) — AFTER review, BEFORE silence removal

A mandatory polish between the raw preview clips and silence removal. It does what `delete_silences`
does NOT: it removes *spoken* content (run-off, fillers, asides), where silence removal only removes
gaps. Order: **raw cut (4b) → tighten (5) → 2nd review → delete_silences (5B) → captions (6)**.

For each kept clip:
1. **Re-lock the outer boundaries to phrase anchors** — start on the real hook, end on the topic's
   final word. This is the fix for trailing run-off (the #1 review miss) and dead lead-in (the opening
   countdown card). NOT capped — it corrects a bad cut. (On 2026-06-04 this alone took economy-1992
   from 92s→58s, the 353x punch 28s→12s, and cut pippin's "what was the point I was trying to make" tail.)
2. ~~**Auto-remove filler disfluencies** inside the kept range~~ — ⛔ **DO NOT ATTEMPT THIS STEP HERE.**
   It is **moved out** to its own pass: **`video-creation/skills/filler-removal/filler-removal.md`
   (Phase 5C), which runs AFTER desilence, not here.**

   > **Why (Mike caught this 2026-07-23):** this step as originally written — "word boundaries come
   > from the Whisper word JSON" — **silently no-ops**. Whisper de-disfluences: it transcribed **3
   > "um"s in a whole 27-minute livestream**, and the `medium` model found **ZERO** in the finished
   > clips (bigger models are *more* fluent, so worse). Whole-clip decoding also breaks the word
   > alignment outright — it reported a **3.30s token `to`** that windowed decoding resolves as a
   > 10-word sentence, and a `uh` that is really the number **240**. So the tighten pass shipped
   > clips full of audible fillers while its own log looked clean.
   >
   > The replacement detects fillers from a **windowed** word map (10s windows, 3s overlap) and
   > gates every splice against a clipped neighbour. **Never re-derive filler spans from a
   > whole-clip Whisper JSON.**

   Everything in step 3 below is still this pass's job, and it is where the ~10% comes from.
3. **Cut the least-relevant content until the best ~90% remains** — this is the real point of the pass.
   After the filler tics, systematically detect and remove fumbles and low-value spans: false starts,
   restarts ("so like... so"), restatements / repeated phrasings, self-corrections ("179, I mean 172"),
   hesitation stalls, rambling run-on, and tangents/asides ("hold on let me share my screen"). Author
   these as explicit time spans (or phrase pairs) per clip from the transcript. Mike's disfluencies are
   mostly "like" / "I'm like" / restating, which the step-2 tic list does NOT catch, so step 2 alone
   typically removes only 1-3% — that is a FAILED tighten, not a clean clip.

**Target ~10%, hard ceiling ~15%.** Every clip over ~10 seconds should come back trimmed by **roughly
10%** (keep the strongest ~90%). A clip over 10s that returns at only -1 to -3% was not actually
tightened — go back and author real span cuts. **Only clips under ~10 seconds are exempt** (too short
to have 10% of slack). Boundary re-lock in step 1 is separate and uncapped; the 10% target / 15% ceiling
applies to the content removal in steps 2+3. (Aggressiveness confirmed by Mike 2026-06-07; see also the
aggressive-fumble-removal rule.)

**Output + review:** writes `<slug>/tightened.mp4`, logs every removed span to `tighten_log.json`
(auditable), and **overwrites the SAME `shorts/<batch>/dashboard.html` in place** to show the
**tightened** clips with a `-N% / what-was-removed` tag for a **second review**. Mike approves the
tightened clips before delete_silences runs. Cut from the MASTER vertical at absolute timestamps
(cleanest quality), never from the preview.

> ⛔ **NEVER create a new/second dashboard file** (e.g. `dashboard-tightened.html`, `dashboard-v2.html`)
> for clips Mike has already reviewed. Every pass after the first review (tighten, silence removal, etc.)
> **rebuilds the one existing `dashboard.html` in place** — Mike keeps that single URL open and refreshes
> it. A parallel dashboard means he refreshes the old one and never sees the new clips. (Deviation logged
> 2026-06-07.) Same rule for all batches; `tighten_clips_zombie.py` is the reference (it overwrites
> `dashboard.html`).

Per-batch script: `scripts/tighten_clips.py` (clip list = phrase anchors + optional asides; the filler
set + declick render are shared logic). Model new batches on it like `cut_topics_<batch>.py`.

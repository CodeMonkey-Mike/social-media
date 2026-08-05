---
description: Condense an approved VERTICAL longform-edited video into a ~40s vertical short, with a spoken "click below to watch the full video" CTA outro in Mike's cloned voice.
argument-hint: "<path to media/<project> folder> [length in seconds, default 40] [optional run overrides]"
model: opus
effort: high
---

Build a short-form vertical video condensed out of a finished vertical longform.

## Run inputs — `$ARGUMENTS`

The input is the **project folder** (`video-creation/longform-edited/media/<project>/`), optionally
followed by a **target length in seconds** (default **40**) and any **per-run overrides** (e.g. "lead
with the DAGKnight explanation", "no music", "make two variants"). Honor every override.
If you cannot identify the project, STOP and ask.

**⛔ Read `video-creation/longform-edited/skills/longform-to-short.md` FIRST — it is canonical and
self-contained.** This command is the runner; that skill owns the rules. Also observe the global rules
in `CLAUDE.md` and `persona/persona.json`.

## The one-line contract

**The short is a CONDENSATION, not a new edit.** Every frame of video and every word of audio already
exists in the vertical master. Nothing is re-shot, re-voiced, re-covered or re-timed. The only new
material is the outro card and its one TTS line.

## Phase 0 — preconditions

1. The **vertical** longform exists and Mike has approved it. If only the 16:9 exists, STOP — run
   `/vertical-repurpose` first.
2. Locate the two sources and confirm they share one clock (durations within ~0.2s):
   - video = `<project>/<name>-VERTICAL.mp4`
   - audio = `<project>/spine/ALL.f.paused.mp4` (VO only — never take audio from the master, its bed
     will jump at every seam)
3. Build the **final-time transcript** the strategist works from: apply the comp's `sh()` (source
   seconds + 1s per baked chapter card) to `spine/*.medium-words.json`, and write
   `spine/FINAL-TIME-words.json` + `spine/FINAL-TIME-transcript.txt`. Everything downstream uses that
   clock.

## Phase 1 — the cut plan (`short-cut-strategist`, fable/max)

Dispatch **`short-cut-strategist`** with: both source paths, the transcript paths, the target length,
the project's FACE-window table (so it can mark each span FACE- or COVER-sourced), and the chapter-card
freeze times. It returns a JSON cut plan: the ONE claim, the hook/body/kicker spans with verbatim words,
what is on screen during each, the silence gaps at every boundary, the assembled read, and the outro.

**Mike gates the plan before anything is built** — show him `claim` + `assembled_read` + the span table.

## Phase 2 — the CTA voice (`higgsfield-voice`)

Generate the outro line in **MIKE-CLONE** via
`video-creation/skills/higgsfield-voice/SKILL.md` — the Playwright/CDP flow against the `hfbot-profile`
Chrome on port 9333 (Higgsfield has NO TTS API; do not hand-roll a driver). Apply that skill's markup
rules (ALL-CAPS only on content words of 5+ letters) and **QA the take with local whisper** before it
goes in the mix. It costs credits, so it needs Mike's OK.

**The take is SHARED, not per project.** It lives at `video-creation/assets/vo/cta-watch-full.mp3`
(alongside the shared music/sfx/transitions). REUSE it for every short off every project. Regenerate ONLY
if the line itself changes or Mike rejects the reading, and update `assets/vo/CTA-SCRIPT.md` first so the
gate can prove the chunks still match. A needless re-roll costs credits AND drifts the delivery, so shorts
from different videos would end on subtly different readings.

## Phase 3 — build

Assemble in Remotion at 1080x1920/30fps (`remotion/src/<Project>Short.tsx`): one `OffthreadVideo` per
span off the vertical master, a fast (~0.3s) hit from the video's own transition family at each seam,
and the outro card.

**⛔ The caption trap:** the longform burns captions on FACE beats ONLY, so COVER-sourced spans arrive
with none, and a short must be captioned end to end. Add the house caption track (`captions-builder`)
over the COVER-sourced output frames ONLY — never blanket-overlay, or the face spans double up.

## Phase 4 — audio + mix

Concat the VO spans from the paused spine with sync-safe `filter_complex` (never the concat demuxer),
then lay ONE continuous bed across the whole short from the project's `MUSIC-PLAN.json` at the house
level (measure LUFS, ~16-18 dB under VO). The CTA line sits at VO level, not under the bed.

## Phase 5 — QA + deliver

Listen to every seam (clipped word / bed jump are the top defects), read frames at every seam (no
half-transition, no frozen chart), confirm captions are continuous and never doubled, and confirm the
runtime hits the target within 0.2s.

Deliver `<name>-SHORT-<N>s.mp4` with the FULL absolute path. It is a SEPARATE deliverable — only stage
it into a queue when Mike says so.

## Report

The claim and the assembled read, the span table with what is on screen, the CTA take's whisper QA,
seam verification, runtime, and anything needing Mike's ruling.

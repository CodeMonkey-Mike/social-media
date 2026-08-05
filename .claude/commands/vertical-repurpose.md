---
description: Build the FULL-LENGTH vertical (1080x1920) cut of an approved 16:9 longform-edited video, with every asset rebuilt native-vertical (Envato, AI stills, receipts, slides, diagrams, charts). No cuts, no re-edit.
argument-hint: "<path to media/<project> folder or its FINAL mp4> [optional run overrides]"
model: opus
effort: high
---

Build the vertical cut of a finished longform-edited video.

## Run inputs — `$ARGUMENTS`

The input is the **project folder** (`video-creation/longform-edited/media/<project>/`) or its FINAL
mp4, optionally followed by **per-run overrides** (e.g. "skip the receipts, they're fine cropped",
"use 4M bitrate"). Honor every override; with none, run the full list below.
If you cannot identify the project, STOP and ask.

**⛔ Read `video-creation/longform-edited/skills/vertical-repurpose.md` FIRST — it is canonical and
self-contained.** This command is the runner; that skill owns the rules. Also observe the global rules
in `CLAUDE.md` and `persona/persona.json`.

## The one-line contract

**The vertical is a REFRAMING, not a re-edit.** Same spine, same duration, same fps, same beat times,
same script, same audio. **Nothing is cut, shortened, or re-timed.** If a beat feels long in portrait,
it still stays. The only thing that changes is what fills the frame.

## Phase 0 — preconditions

1. The 16:9 FINAL exists and Mike has approved it. If it is still in review, STOP and ask.
2. Read the project's `EDIT-PLAN.md` + `CUE-SHEET.md` + `TRANSITIONS.md` — the vertical is built to the
   SAME plan. Note the spine path, total frames, fps, and the 16:9 render bitrate (match it).
3. Confirm the paused spine (`assets/spine.mp4`) and the FINAL's frame count, so the vertical can be
   verified to match exactly.

## Phase 1 — assets, ALL native vertical (never a landscape crop)

Work from the project's asset inventory. Write vertical assets to their own folders (e.g.
`assets/vertical/…`) so no 16:9 asset is ever overwritten. Dispatch these in parallel where possible:

- **Envato video b-roll → `envato-sourcer`**: re-source EVERY clip as a native VERTICAL asset using the
  BROLL-PLAN's beat + query for each slot. Where no vertical inventory exists, a landscape centre-crop
  is the sanctioned fallback but must be FLAGGED per slot in the report, not silently used.
- **ChatGPT / AI stills → `image-gen`**: regenerate each at TRUE 9:16, anchored on its existing 16:9
  image via `--reference-image` so it is the same shot recomposed for portrait, never a crop. Respect
  the BROLL-PLAN `Reference` column: a beat naming a real token/company/person uses the REAL mark from
  `schedule-tweets/images/reference/`.
- **Receipts / web captures → `receipt-capturer`**: re-capture in MOBILE VIEW (portrait viewport, e.g.
  390x844) so the page reflows to a readable single column. Never centre-crop the desktop capture.
- **TITLE / CARD SLIDES + SYSTEM-DESIGN DIAGRAMS → `slide-builder` / `chart-builder`**: RE-SHOOT the
  existing HTML sources at 1080x1920 so the layout reflows (headline wraps, rows stack, a wide node mesh
  goes tall). Same locked stylesheet, same state variants. This is a re-render at a new aspect, NOT a
  redesign and NOT a crop.
- **ANIMATED (Type 1) charts**: re-lay out for portrait IN CODE, same `ts` contract and same beat times.
- **Face spine**: crop tall in the comp (the spine mp4 itself is untouched) — but the crop offset is
  **MEASURED, never assumed centre** (skill §1b). Mask the background out (on green screen: strongly-green
  pixels are background) and take the centroid of the subject across several FACE windows, then set
  `objectPosition` to that. A whole-frame brightness centroid is NOT a valid measurement — it reported ~48%
  on kaspa 30bps while Mike was actually at 62-71%, and the centre crop cut half his face off.

Every rebuilt asset goes through `visual-qa` before the comp uses it.

## Phase 2 — the vertical comp

Build `remotion/src/<Project>Vertical.tsx` at **1080x1920, same fps and same durationInFrames as the
16:9**, reusing the same spine, the same `sh()`/`CUTS` timing, the same COVERS beat times, the same
three transition buckets and the same captions windows. Reframe per beat: faces centre-crop, containers
and charts restack to fill the width, b-roll fills the portrait frame.

Run the same mechanical gates as the 16:9 (`lint-covers`, `lint-slide-balance`, `lint-deck-containers`,
`lint-pause-silence`, `bed-duck-expr`) and smoke-test one still per beat BEFORE rendering.

## Phase 3 — render

Match the 16:9's bitrate. **Render in frame-range chunks** and join with a standalone ffmpeg — a
full-length single render hits the ~frame-14436 FFmpeg stitch ceiling (memory
`reference_remotion_stitch_handle_ceiling`). Also carry the render hygiene that the 16:9 build learned:
cap the offthread cache, sweep `%TEMP%/remotion-*` between chunks, and never feed a library transition a
live video clip (pre-extract the cut frame instead). All of that is in `comp-build.md` §6a/§11.

## Phase 4 — audio

**Reuse the 16:9 mix verbatim.** The spine audio is identical and the bed/SFX timecodes are
audio-domain, so nothing is re-mixed. Splice audio never; take the whole track and mux it on, and verify
the drift is flat end to end.

## Phase 5 — QA + deliver

Per `video-qa.md` plus the vertical-specific checks in the skill: concat seam, blackdetect, framing
spot-checks per content type (read actual frames, confirm nothing important is cropped and text is
readable at phone size), and audio parity with the 16:9.

**FACE CENTRING is a required check, one frame from EVERY face window** (skill §1b + §5) — confirm the
face is horizontally centred and neither edge clips it. Do not sample; the subject's position drifts
between windows. This is the check that was missing when kaspa 30bps shipped with Mike jammed against
the right edge.

Deliver a NEW `-VERTICAL-v1.mp4` filename with the FULL absolute path. The vertical is a SEPARATE
deliverable from the queued 16:9 — only stage it into a queue when Mike says so.

## Report

Per phase: what was rebuilt native-vertical, what fell back to a crop (and why), gate results, render
chunks + seam verification, and anything needing Mike's ruling.

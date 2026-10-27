# Playbook: video creation

**Canonical detail:** `video-creation/SKILL.md` — the whole pipeline. **Read it in full before any video work.**
**AI-persona videos:** `video-creation/vertical-ai-persona/SKILL.md` (+ reference notes in that folder's `TODO.md`). **Yuli y Ana (AI personas of two other people, vertical OR longform):** `video-creation/yuli-y-ana/CLAUDE.md`.
**Folder context:** `video-creation/CLAUDE.md`.

## Entry
- **Read the batch progress first:** `video-creation/shorts/<batch>/progress.json` — it has a `resume_protocol`
  telling you which clip/phase to resume on. Update it as each phase completes.
- Shared caption/transcribe tooling: `video-creation/shorts/_tooling/` (invoked with a `<batch>/<slug>` path).
- Transcripts come from the per-livestream folders / `batches.json`.

## Tracks
- **Livestream → shorts:** topic-find (90s chunk-and-group) → snap-to-silence cut → Whisper word-level
  captions → Remotion/HTML render with b-roll / overlays / SFX.
- **Kinetic-text effects (any track):** an effect = motion + sound + graphics, picked as ONE device from a THEME
  (`video-creation/skills/effects-library/effects-library.md`, catalog `video-creation/assets/effects/library.json`;
  the sounds stay in the SFX catalog). A video picks one theme and names its devices on the screenplay `[SHOW]` lines.
- **vertical-ai-persona:** AI-generated shorts of Mike's likeness via Higgsfield/Seedance — see that SKILL
- **yuli-y-ana:** AI face + AI voice of Ana and Yuli (NOT Mike), any format — router `video-creation/yuli-y-ana/CLAUDE.md`
  (Higgsfield gotchas, the proven recipe, characters). **HARD RULE: every Seedance generation (incl. tests)
  = `--resolution 480p` ONLY, never higher — root CLAUDE.md; Remotion upscales free.**
- **longform-presentation** (16:9, revived 2026-10-13): record-and-edit over a slide deck (the lecture videos
  for Mike's Whop course) or over a live screen share; defumble -> preset desilence -> transcribe -> spotlight
  render (one deck container at a time cued to the words, a breath before every chapter card, as-filmed
  head/tail kept); a fix round splices only the moved windows; or (format 4) a deck screen share with a few
  full-screen deck cards over it, one ffmpeg render, no Remotion (`skills/card-overlays/`) —
  `video-creation/longform-presentation/longform-presentation.md`.
- **longform-edited** (16:9, evolving): heavily-edited / production-value longform (b-roll, music, motion
  graphics, tighter cuts) — `video-creation/longform-edited/longform-edited.md`. Style guide grows per video.

## Defumble a recording (track-agnostic, MANDATORY method)
Any spoken recording with retakes → clean spoken spine, no clipped words: **`video-creation/skills/defumbler/defumbler.md`**.
Hard rules that keep it from regressing: decouple silence from fumbles; cut ONLY inside silence (never on a
Whisper word timestamp); ≤ −50 dB for cut edges; segment+per-chunk-transcribe via `defumbler/scripts/chunk_map.py`;
get Mike's text cut-plan approved before rendering. Do NOT cut from whole-file `detect_fumbles`/`audit_coverage`
output (diagnosis only) — that approach hides retakes and drifts, and failed silverscript 3x.

## After a batch renders
1. Move finalized renders into the posting queue: `python scripts/publish-shorts.py <batch> [--dry-run]`
   (canonical: `video-creation/PUBLISH-SHORTS.md`; there's also a `/publish-shorts` skill).
2. Then publish via `playbooks/posting.md` (shorts rows in `data/shorts.json`).

# Playbook: video creation

**Canonical detail:** `video-creation/SKILL.md` — the whole pipeline. **Read it in full before any video work.**
**AI-persona videos:** `video-creation/vertical-ai-persona/SKILL.md` (+ reference notes in that folder's `TODO.md`).
**Folder context:** `video-creation/CLAUDE.md`.

## Entry
- **Read the batch progress first:** `video-creation/shorts/<batch>/progress.json` — it has a `resume_protocol`
  telling you which clip/phase to resume on. Update it as each phase completes.
- Shared caption/transcribe tooling: `video-creation/shorts/_tooling/` (invoked with a `<batch>/<slug>` path).
- Transcripts come from the per-livestream folders / `batches.json`.

## Tracks
- **Livestream → shorts:** topic-find (90s chunk-and-group) → snap-to-silence cut → Whisper word-level
  captions → Remotion/HTML render with b-roll / overlays / SFX.
- **vertical-ai-persona:** AI-generated shorts of Mike's likeness via Higgsfield/Seedance — see that SKILL
  (Higgsfield gotchas, the proven recipe, characters). **HARD RULE: every Seedance generation (incl. tests)
  = `--resolution 480p` ONLY, never higher — root CLAUDE.md; Remotion upscales free.**
- **longform-presentation** (16:9, FROZEN): slide-deck + presenter PiP, readable on-screen text, gentle
  pacing, spotlight-Remotion payoff — `video-creation/longform-presentation/longform-presentation.md`.
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

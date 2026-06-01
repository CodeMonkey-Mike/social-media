# Playbook: video creation

**Canonical detail:** `video-creation/SKILL.md` — the whole pipeline. **Read it in full before any video work.**
**AI-persona videos:** `video-creation/vertical-ai-persona/SKILL.md` (+ reference notes in that folder's `TODO.md`).
**Folder context:** `video-creation/CLAUDE.md`.

## Entry
- **Read the batch progress first:** `video-creation/shorts/<batch>/progress.json` — it has a `resume_protocol`
  telling you which clip/phase to resume on. Update it as each phase completes.
- Shared caption/transcribe tooling: `video-creation/shorts/_tooling/` (invoked with a `<batch>/<slug>` path).
- Transcripts come from the per-livestream folders / `batches.json`.

## Two tracks
- **Livestream → shorts:** topic-find (90s chunk-and-group) → snap-to-silence cut → Whisper word-level
  captions → Remotion/HTML render with b-roll / overlays / SFX.
- **vertical-ai-persona:** AI-generated shorts of Mike's likeness via Higgsfield/Seedance — see that SKILL
  (Higgsfield gotchas, the proven recipe, characters).

## After a batch renders
1. Move finalized renders into the posting queue: `python scripts/publish-shorts.py <batch> [--dry-run]`
   (canonical: `video-creation/PUBLISH-SHORTS.md`; there's also a `/publish-shorts` skill).
2. Then publish via `playbooks/posting.md` (shorts rows in `data/shorts.json`).

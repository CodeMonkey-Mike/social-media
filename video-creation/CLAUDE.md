# video-creation

**Before doing ANY video work in this project, read `SKILL.md` (in this same folder) in full.**

`SKILL.md` is the single canonical Video Creation skill — it governs the whole pipeline:
topic finding (90-second chunk-and-group), clip selection, snap-to-silence cutting
(silence < −57 dBFS, audio > −52 dBFS, 250 ms, NO pad, declicked joins), Whisper
word-level captions, and the full production reference (HTML/Remotion, b-roll, overlays,
SFX, design). Edit techniques in `SKILL.md`, not here.

There is a 3-line POINTER skill at `.claude/skills/video-creation/SKILL.md` that only exists
to enable the `/video-creation` command — it points back to this root `SKILL.md`. Do not copy
real content into it; the root `SKILL.md` is the only source of truth.

Do not rely on any skill outside this repo. There was a home-dir copy
(`~/.claude/skills/create-short/`) that silently diverged and caused lost work; it was
deleted on 2026-05-25.

## Per-batch progress files (READ ONE EVERY SESSION)

Each multi-clip batch keeps its own machine-readable progress JSON at `shorts/<batch>-progress.json`.
**At session start, read the relevant batch's progress JSON before doing anything else** — it tells
you which clip and which phase to resume on, and it includes a `resume_protocol` block describing
exactly how to pick the next step. **Update it as you complete each phase** (in_progress → done +
bump `last_updated`).

Active batches:
- `shorts/meme-coins-progress.json` — meme-coins batch (5 clips from "Best Meme Coins to retire ur arse")

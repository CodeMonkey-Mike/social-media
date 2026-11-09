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

## Shared skills (`skills/`) + external tooling

**ALL reusable, cross-cutting video-creation skills live in `skills/`** (canonical copies committed to
the repo so they travel with a checkout; `skills/README.md` is the index): `captions`, `defumbler`,
`desilencer`, `elevenlabs-lipsync`, `envato-broll`, `gaze`, `higgsfield-generate`, `higgsfield-soul-id`,
`higgsfield-voice`, `music-sourcing`, `sfx-library` (every SFX picked from `assets/sfx/library.json`, never by listening), `usage-ledger`. Skills with a `/command` (`/defumbler`, `/higgsfield-generate`,
`/higgsfield-soul-id`) have a 3-line pointer under `.claude/skills/<name>/SKILL.md` that points back to
`skills/`; the rest are read directly via this routing table or the track docs.

Some wrap **external tooling not in the repo** (e.g. the `higgsfield` CLI + login). On a fresh machine,
install it first — see **`SKILLS-SETUP.md`** (this folder's root).

What does NOT go in `skills/`: the master `SKILL.md`, the track *pipelines* (`longform-edited/`,
`longform-presentation/`, `vertical-ai-persona/`, `livestream-repurpose/`, the channel folders `ai-engineering/`,
`yuli-y-ana/`), and infra (`assets/`,
`remotion/`, `shorts/`, `style-guide/`) — those stay at the `video-creation/` root.

**Skill folders hold code and docs only (Mike, 2026-11-09).** A tool's working files go in the video's project
folder, or in `cache/<tool>/` when they're shared or throwaway diagnostics (`skills/cache-path.js` /
`skills/cache_path.py` build the path; `cache/README.md` explains it). Root `CLAUDE.md` "Where files go" is the rule,
and `scripts/check-file-placement.py` flags anything left in a skill folder.

## Track folders are split by HOW THE SPINE IS PRODUCED (Mike, 2026-10-17)

A video's folder is decided by how its spoken spine is made, NOT by the channel it is published on
and NOT by its aspect ratio:

| Folder | The spine is… |
|---|---|
| `longform-edited/` | Mike ON CAMERA, a real recording (defumble -> desilence -> cover-blackout) |
| `longform-presentation/` | Mike's real recording over a deck / screen share |
| `longform-discussion/` | NOT produced here: research only, for Mike's freeform recording over shared browser tabs (crypto channel). No video is made in this folder; see `longform-discussion/longform-discussion.md` |
| `livestream-repurpose/` | a real livestream recording |
| `ai-engineering/` | Mike's CLONED VOICE over a deck, no camera (so its `evals` video, which Mike recorded himself, lives in `longform-edited/media/`) |
| `vertical-ai-persona/` | Mike's AI LIKENESS (face + voice), vertical |
| `whiteboard/` | NO spine recording at all: a VO (Mike or his clone) under a CODE-RENDERED SVG explainer (rough.js kit, no camera, no generated images); first 15 s demo rendered 2026-10-30 (hand-drawn vocabulary, paper-pastel pen), see `whiteboard/whiteboard.md` |
| `yuli-y-ana/` | AI face + AI voice of Ana and Yuli, two people who are NOT Mike, in ANY format (vertical or longform); router `yuli-y-ana/CLAUDE.md` |

## Per-batch progress files (READ ONE EVERY SESSION)

Each multi-clip batch lives in its own folder `shorts/<batch>/` (clip subdirs + `dashboard.html`)
and keeps its machine-readable progress JSON at `shorts/<batch>/progress.json`.
**At session start, read the relevant batch's progress JSON before doing anything else** — it tells
you which clip and which phase to resume on, and it includes a `resume_protocol` block describing
exactly how to pick the next step. **Update it as you complete each phase** (in_progress → done +
bump `last_updated`).

Active batches:
- `shorts/meme-coins/progress.json` — meme-coins batch (from "Best Meme Coins to retire ur arse")

The shared caption/transcribe scripts live in `shorts/_tooling/` (invoked with a `<batch>/<slug>` path).

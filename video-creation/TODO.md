# TODO — Resume the video-creation ↔ social-media merge

_Active discussion as of 2026-05-28. Read this whole file cold before doing anything._
_Previous TODO (Weekend Red batch, completed 2026-05-25) was stripped on Mike's instruction._

---

## Where we left off

Mike noticed that `video-creation/` and `social-media/` are tightly coupled in one
direction — `video-creation/` produces artifacts that `social-media/` consumes:

1. `video-creation/livestream-repurpose/transcripts/<stream>.json` → used by
   `social-media/repurpose/` (image/tweet/carousel generation)
2. `video-creation/remotion/out/<batch>/*.mp4` → manually copied into
   `social-media/schedule-tweets/shorts/<batch>/` and registered in
   `schedule-tweets/data/shorts.json` (we did this 2026-05-28 for the meme-coins batch)
3. `social-media/repurpose/node_modules/playwright` → required by
   `video-creation/generate-broll-batch.js` via `$env:NODE_PATH`

**Decision:** move `video-creation/` to live UNDER `social-media/video-creation/` so
they share one git repo and the dependency is honest. Mike: "I am definitely OK with
having them part of the same repo."

**Current state:**
- `social-media/` IS a git repo (has `.gitignore`).
- `video-creation/` is NOT tracked anywhere (no `.git`).
- `Claude/` parent is not a repo.

---

## What's already done (don't redo)

- [x] `.gitignore` written at `video-creation/.gitignore` (agreed content, see "Agreed .gitignore" below).
- [x] Strategy confirmed: track CODE ONLY. All assets ignored.
- [x] Two specific confirmations from Mike:
  1. **Aggressive `*.png` safety net is OK.** A future stray screenshot in
     `docs/` etc. would be silently ignored; Mike accepted that tradeoff.
  2. **Expected first-commit contents (~50-80 files, ~30 MB) sound right.**

---

## What to do next session (resume here)

### Step 1 — Review the .gitignore one more time
Open `video-creation/.gitignore`. Confirm the content still matches the rationale
in "Agreed .gitignore" below. If unchanged, skip this step.

### Step 2 — Move the folder
From PowerShell at `C:\Users\mnede\Documents\Claude\`:
```powershell
Move-Item video-creation social-media\video-creation
```
Expect ~2.4 GB of binaries to move on disk (they'll be ignored by git but they're
still there). The move itself is just a rename, near-instant.

### Step 3 — Verify git sees only code
From `social-media/`:
```powershell
git status
```
Should show ~50-80 new files added under `video-creation/`. No `.mp4`/`.png`/`.mp3`,
no `node_modules/`, no `out/`, no `assets/`. If anything binary shows up,
**stop and fix `.gitignore` before committing.**

### Step 4 — Commit
```powershell
git add video-creation/
git commit -m "Move video-creation/ under social-media/ as a subfolder"
```

### Step 5 — Fix all the stale absolute paths
After the move, every absolute reference to
`C:\Users\mnede\Documents\Claude\video-creation\...` is stale and should become
`C:\Users\mnede\Documents\Claude\social-media\video-creation\...`. Scope:

- [ ] Memory files at `~/.claude/projects/C--Users-mnede-Documents-Claude/memory/*.md`
  (grep for `Documents\Claude\video-creation`)
- [ ] `video-creation/CLAUDE.md`, `SKILL.md`, `TODO.md` (this file)
- [ ] Hardcoded paths in scripts:
  - [ ] `generate-broll-batch.js` — `ASSETS_DIR`, profile paths
  - [ ] `_make_overlays_alpha.py`, `_make_overlay_doginme_alpha.py`, `_make_v34_overlays_alpha.py`
  - [ ] Any other `_*.py` with `C:\Users` paths
- [ ] `video-creation/shorts/meme-coins-progress.json` and any other progress JSONs

Easiest approach: grep across the whole tree for the literal string
`Documents\Claude\video-creation` and `Documents/Claude/video-creation`, replace with
`Documents\Claude\social-media\video-creation` and the slash variant. Test one
script after replacement before doing them all.

### Step 6 — Verify nothing broke
- [ ] Run `npx remotion render src/index.ts KeycatDoginme out/_test.mp4 --frames=0-29 --codec=h264` to confirm Remotion still finds assets.
- [ ] Run `python video-creation/shorts/_build_captions_meme.py keycat-vs-doginme` to confirm the caption builder still works.
- [ ] Try the b-roll batch dry-run (just verify it launches Chrome) — `node video-creation/generate-broll-batch.js` then Ctrl+C.

### Step 7 — Write a publish-to-schedule script
Today (2026-05-28) we manually copied 5 MP4s from `remotion/out/meme-coins/` into
`schedule-tweets/shorts/meme-coins-2026-05-28/` and ran a Python script
(`data/_append_meme_coins.py`) to add JSON entries. Generalize that into a reusable
script:
- Input: batch name (e.g. `meme-coins`), source folder under `video-creation/remotion/out/<batch>/`
- Action: copy MP4s into `schedule-tweets/shorts/<batch>-<YYYY-MM-DD>/`, append entries to `shorts.json` (or stub them — user fills in titles/captions).
- Lives at `social-media/scripts/publish-shorts.py` or similar.

Defer Step 7 if time-pressed — the merge itself is the main goal.

---

## Agreed `.gitignore` (final, already written)

```gitignore
# Goal: track CODE ONLY. All assets are regenerable from YouTube + scripts,
# or curated outside the repo. "Nothing of consequence" lives here.

# ── Dependencies ─────────────────────────────────────────────────────────────
node_modules/

# ── Bucketed-out directories ─────────────────────────────────────────────────
assets/                              # SFX, b-roll PNGs, logos, clip copies
livestream-repurpose/media/          # source livestreams (on YouTube)
livestream-repurpose/transcripts/    # Whisper output (re-run as needed)
remotion/out/                        # renders

# ── Per-clip artifacts (regenerable from source + scripts) ───────────────────
**/preview.mp4
**/whisper-words.json
**/captions.ts.draft

# ── Media file extensions (safety net for stray binaries anywhere) ───────────
*.mp4 *.mov *.mkv *.webm *.m4v *.mp3 *.wav *.aiff *.aif *.m4a
*.png *.jpg *.jpeg *.gif *.webp *.ico

# ── Logs / temp / OS junk ────────────────────────────────────────────────────
*.log *.timemap.txt __pycache__/ *.pyc .DS_Store Thumbs.db
```

---

## Background context (from the discussion)

### Size breakdown of what gets ignored
| Path | Size | Why ignored |
|---|---|---|
| `remotion/out/` | 1004 MB | Re-render from comps + assets |
| `remotion/node_modules/` | 785 MB | `npm install` |
| `livestream-repurpose/media/` | 660 MB | Source livestreams on YouTube |
| `assets/` (whole tree) | ~200 MB | SFX + b-roll PNGs + clip copies; regenerable |

Total ignored: ~2.4 GB. Total tracked: ~30 MB of code + docs.

### Mike's quotes (verbatim, for context)
- "I am definitely OK with having them part of the same repo."
- "Maybe we should create [.gitignore] first before we do the move."
- "Saving the live streams doesn't matter. The livestream is on YouTube."
- "What I'm concerned more about is the code, the code that makes things work."
- "There's no reason to store anything in the Git repo. Nothing is of consequence."
- "Maybe later on there can be other assets that I want to put in the repo, but we can make a judgment on that later."

### Why not symlink instead of moving
Windows symlinks are admin-gated and break various tools. Hard pass.

### Why not keep separate and just formalize the handoff
Considered. Rejected because:
- The dependency is already structural (NODE_PATH workaround proves it).
- Hiding the coupling across two top-level folders is dishonest about the architecture.
- Co-located, CLAUDE.md / SKILL.md / memory paths get shorter and more consistent.

---

## Open question for later (not blocking the move)

Mike said "later on there can be other assets that I want to put in the repo, but
we can make a judgment on that later." Likely candidates when we revisit:
- Curated reference PNGs (logos, brand glyphs) — currently ignored, may want tracked
- A "vetted" subset of SFX in `assets/sfx/` — same
- The `style-guide/` folder's reference frames if any

For now: everything in `assets/` is ignored. Revisit after the merge settles.

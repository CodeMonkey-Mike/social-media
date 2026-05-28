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

## Status — MERGE DONE (2026-05-28)

The move + path fixes are complete and committed on `social-media` (branch `master`):
- `157c4f6` Move video-creation/ under social-media/ as a subfolder (117 code/doc files, ~1.2 MB)
- `e88acb3` Fix stale video-creation absolute paths after the move (27 files)

Both commits were scoped with `git commit -- video-creation/` so they did NOT sweep in
the unrelated in-progress work that was already dirty/staged in `social-media/` (e.g. the
parked `repurpose/PLAYWRIGHT_HANDOFF.md` deletion). That work is untouched.

### Steps 1–6 — done
- [x] **Step 1 — .gitignore reviewed.** Found a real bug: the four "bucketed-out"
  patterns had **inline trailing comments** (`assets/   # ...`). `.gitignore` does NOT
  support inline comments — `#` only starts a comment at the START of a line — so those
  four patterns matched nothing and 10 asset files (`assets/`, `transcripts/`,
  `remotion/out/`) leaked into the first `git add`. Fixed by moving each comment to its
  own line; re-verified with `git check-ignore -v`. (The "Agreed .gitignore" block at the
  bottom of this file still shows the BROKEN inline-comment form — do not copy it verbatim.)
- [x] **Step 2 — folder moved** (`Move-Item` with absolute paths; relative form failed
  because the shell cwd was `social-media`, not the Claude root).
- [x] **Step 3 — verified git sees only code.** 117 files, ~1.2 MB. No mp4/png/mp3, no
  node_modules/out/assets/media/transcripts. (Note: actual count was higher than the
  50–80 estimate and size far smaller than the ~30 MB estimate — all genuine code/docs.
  Small text JSON like `whisper.json`/`preview.json` is tracked by design; the agreed
  ignore only excludes `**/whisper-words.json`.)
- [x] **Step 4 — committed.**
- [x] **Step 5 — stale absolute paths fixed.** 27 files in the tree (24 single-backslash
  + 3 JS files using ESCAPED double-backslash `Claude\\video-creation`, which the first
  grep missed). Also updated the 5 memory files' relative `video-creation/` refs to
  `social-media/video-creation/`. `PROFILE_DIR` in the b-roll scripts points at
  `AppData\...\chatgpt-profile` and correctly stays unchanged.
- [x] **Step 6 — verified nothing broke.**
  - Remotion 30-frame render of `KeycatDoginme` succeeded (assets resolved).
  - Caption builder runs (`_build_captions_meme.py house-coin-1000x` — the TODO's old
    `keycat-vs-doginme` arg is just an undefined `SCHEMES` slug, not a move failure).
  - All 3 edited b-roll scripts pass `node --check`; Playwright resolves via the
    `NODE_PATH=...\repurpose\node_modules` workaround.

### Step 7 — Write a publish-to-schedule script — DONE (2026-05-28)
Built `social-media/scripts/publish-shorts.py` (stub model — Mike chose option A).

```
python scripts/publish-shorts.py <batch> [--date YYYY-MM-DD] [--id-prefix mc] [--dry-run]
```

What it does, per batch:
1. Copies `video-creation/remotion/out/<batch>/<n>-<slug>.mp4` →
   `schedule-tweets/shorts/<batch>-<date>/` (skips files already copied).
2. Appends one STUB entry per clip to `schedule-tweets/data/shorts.json` with all 7
   platforms set to `status: "pending"` (what the `post-*.js` scripts consume).

Auto-filled: id (`<prefix>-<YYYYMMDD>-<slug>`, prefix derived from batch initials),
slug, source, video_path, width/height + duration (via ffprobe), platform blocks.
`title` is pulled from `<batch>-progress.json` when present. **Left blank for you to
fill before posting: `hook`, `caption`, `tags`.**

Idempotent: skips ids already in shorts.json; never overwrites an existing MP4.
Verified with `--dry-run` against the meme-coins batch (correctly skipped all 5
existing) and a throwaway date (correctly built 5 stubs with titles + durations).
The old one-off prototype `schedule-tweets/data/_append_meme_coins.py` is now superseded.

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

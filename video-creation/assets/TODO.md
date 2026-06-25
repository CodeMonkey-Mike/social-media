# assets/ cleanup and reorg TODO

Started 2026-06-17. Goal: `video-creation/assets/` should hold ONLY the reusable static
library (sfx, music, fonts, transitions, logos). No project-specific folders.

## Why project assets keep landing here (root cause)
`video-creation/remotion/remotion.config.ts:10` sets `Config.setPublicDir("../assets")`.
Remotion `staticFile()` only resolves files inside that one public dir, so anything a comp
renders must physically live under `video-creation/assets/`. That is the only reason project
folders ended up here. The real fix is to render each self-contained project with its own
`--public-dir` pointed at the project's own assets folder.

## Done so far (all RECYCLED, reversible from Windows Recycle Bin)
- Generator guard added: `repurpose/gen-batch-freshchat.js` now hard-refuses a `--prefix=broll`
  run that resolves to the assets root or omits `--batch`/`--outdir`. New loose b-roll cannot
  recur. (Docs updated: `video-creation/SKILL.md`, `assets/STYLE-GUIDE.md`.)
- Recycled completed-batch loose b-roll/clips from the assets root: 141 files / ~619 MB.
- Recycled stale project folders: `assets/zcash`, `assets/wise-man-fl07`, `assets/wise-man-intro`,
  `assets/crypto-promo`, `assets/livestream-repurpose`, and in `assets/projects/`:
  empty completed shells (banks-own-chain, silverscript, why-ai-python) + `yuli-crypto1` +
  `yuli-kaspa-broll`. (~273 MB)
- `assets/` root is now clean: `fonts/ music/ sfx/ transitions/` + `projects/`.
- `assets/projects/` now holds only `best-coin-to-buy`, `bittensor`, `market-meltdown`.

## 2026-06-18 — SKILLS updated to enforce the rule (Mike: no skill may put project assets here)
The DOCS/SCRIPTS that INSTRUCTED the old `assets/projects/<batch>/` convention are now changed to the
project-folder convention (the bittensor pattern: per-project `--public-dir`; project assets in
`media/<project>/render-assets/` or the project's `assets/`):
- **`video-creation/SKILL.md`** — "Asset folder organization" + the staticFile/publicDir section rewritten:
  project assets NEVER under `video-creation/assets/`; render with `--public-dir <project>/render-assets`.
- **`assets/STYLE-GUIDE.md`** — b-roll gen writes to the project's own folder, not `assets/projects/<id>/`.
- **`longform-edited.md`** — render-assets section added; "render-ready copies → assets/projects" line fixed.
- **`repurpose/gen-batch-freshchat.js`** — TRACK-AWARE: `--batch=<id>` → `assets/projects/<batch>/` (SHORTS,
  sanctioned); `--outdir` → the project folder (LONGFORM/PERSONA); both refuse the shared `assets/` ROOT.
- `envato-broll/SKILL.md` was already correct (saves to the project's own `assets/video/`).
- bittensor migrated (pilot DONE): tree → `media/bittensor-for-the-future/render-assets/`, comp repointed.

Mike's scope (2026-06-18): **PREVENTION only — no skill adds NEW project assets that linger; not migrating
existing folders or doing cleanup now.** (SUPERSEDED 2026-06-25, see #4: SHORTS no longer use
`assets/projects/<batch>/` either — NEW shorts go to `shorts/<batch>/render-assets/`. Existing
`assets/projects/<batch>/` folders are still LEGACY-only and age out via cleanup; not migrated.) Optional later:
`YuliCrypto1.tsx` (persona) still points at `assets/projects` — move it to its project folder when convenient.

## TODO (continue here)

### 1. Finish tidying Root.tsx (after bittensor render completes)
Two dead `staticFile` references point at recycled files (harmless, build not broken):
- `video-creation/remotion/src/Root.tsx:~291-304` — `LivestreamRepurpose` dev-utility comp,
  `src: 'livestream-repurpose/proxy-0749.mp4'` (deleted). Remove the whole `<Composition id="LivestreamRepurpose" ...>` block (+ its component import if unused elsewhere).
- the crypto-promo comp references `staticFile('crypto-promo/crypto-promo-FINAL.mp4')` (deleted;
  real master is in `vertical-ai-persona/crypto-promo/`). Remove that comp registration too.
- DO NOT edit Root.tsx while bittensor is rendering.

### 2. Migrate bittensor out of assets/ (after its render completes)
bittensor is self-contained (comp `BittensorCh1to4.tsx:14` references only `projects/bittensor/*`,
no shared sfx/logos). Clean pilot for the per-project `--public-dir` pattern:
- Move `assets/projects/bittensor/` into `longform-edited/media/bittensor-for-the-future/assets/render/`.
- Change `staticFile(\`projects/bittensor/${f}\`)` to `staticFile(\`render/${f}\`)`.
- Render with `--public-dir video-creation/longform-edited/media/bittensor-for-the-future/assets`.
- Verify with a single-frame `remotion still` before a full render.
- Also fix the name mismatch: project folder is `bittensor-for-the-future` but assets used `bittensor`.

### 3. Active batches in assets/projects/ (no action yet)
`best-coin-to-buy` and `market-meltdown` are ACTIVE. Leave them. When their batches flip to
completed, the registry-driven cleanup tier reclaims them automatically
(`node scripts/reconcile-batch-status.js` then `node cleanup/cleanup.js --target video-creation`).

### 4. THE BIG DECISION — RESOLVED 2026-06-25 (variant of A: COPY, not symlink)
Shorts comps now render against their OWN self-contained public dir:
`video-creation/shorts/<batch>/render-assets/`. The handful of shared SFX/logos a comp references are
**COPIED** in (NOT symlinked/junctioned — cleanup recursively recycles the whole `shorts/<batch>/` folder
and would FOLLOW a junction into the real `assets/` library). Spine = each clip's `tightened.mp4` copied to
`render-assets/<slug>.mp4`; b-roll generated straight into `render-assets/`. So NOTHING new lands in
`assets/projects/` or loose in the root. Implemented by:
- `scripts/setup-batch-render-assets.js <batch> [--data <dataFile.ts>]` — stages spine + copies the
  comp's shared `staticFile()` refs from `assets/` into `render-assets/`.
- `gen-batch-freshchat.js --batch=<id>` and `generate-broll-batch.js --batch=<id>` now write to
  `shorts/<id>/render-assets/` and HARD-REFUSE any write under `video-creation/assets/`.
LEGACY: pre-2026-06-25 batches keep `staticFile('projects/<batch>/…')` + the `../assets` default; cleanup ages them out.

### 5. Codify the rule — DONE 2026-06-25
Documented in `video-creation/SKILL.md` "Asset folder organization (HARD RULE)" + the "Asset references"
and "RENDERING TO MP4" sections.

## Reference
- Cleanup tool: `cleanup/cleanup.js` (registry-driven; auto-runs reconcile for video-creation).
- Batch registry + statuses: `batches.json` (now supports `manual_status` for queue-bypassing projects).
- Recovery: everything removed today is in the Windows Recycle Bin if any of it is still needed.

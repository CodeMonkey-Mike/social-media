'use strict';

// Policy: HYBRID.
//  - Protected (never touch): assets/{sfx,music,fonts,transitions}/, assets/logo-*.png,
//    and every <batch>-progress.json.
//  - Always sweep: any _bad-*/ reject folder (regardless of age).
//  - Registry-driven (assets/projects/<batch>/ — LEGACY per-batch asset home for pre-2026-06-25
//    shorts batches; new shorts use shorts/<batch>/render-assets/ instead, covered by the
//    whole-folder shorts tier below): keep folders whose <batch> is ACTIVE in batches.json,
//    recycle those of an ARCHIVED batch; a folder matching no batch falls back to age-based.
//  - Age-based (recycle if older than --age-days, default 30): everything else under
//    assets/ (legacy loose b-roll PNGs, *-clip.mp4, overlays in the root and non-projects/
//    subdirs) and livestream-repurpose/media + transcripts.
//  - Whole-folder, batch-aware (recycle the ENTIRE project folder for a completed/archived
//    batch, keep an active one, leave an unregistered folder alone):
//      * shorts/<batch>/                     — matched by the batch's `directories`.
//      * longform-presentation/media/<proj>/ — matched by the batch's `source_media`.
//      * longform-edited/media/<proj>/       — matched by the batch's `source_media`.
//    For shorts folders tied to no batch, only the gitignored per-clip artifacts
//    (preview.mp4 / whisper-words.json / captions.ts.draft) are swept.
//  - Publish-state guard: remotion/out/<batch>/<n>-<slug>.mp4 is recycled only when that
//    clip is in shorts.json with EVERY platform status=posted (queue copy is the canonical one).

const fs = require('fs');
const path = require('path');
const { walkFiles, ageDays } = require('../lib');

const NAME = 'video-creation';
// Only the gitignored, regenerable per-clip artifacts — NOT tracked source like
// whisper.json / preview.json / index.html / gen_captions.py.
const ARTIFACT_RE = /^(preview\.mp4|whisper-words\.json|captions\.ts\.draft)$/i;
const LOGO_RE = /^logo-.*\.(png|jpe?g)$/i;

// The batch registry (repo-root batches.json). An ACTIVE batch's directories are
// protected; everything else is eligible. Returns [{ status, directories:[...] }].
function loadBatches(repoRoot) {
  const f = path.join(repoRoot, 'batches.json');
  if (!fs.existsSync(f)) return [];
  try { return JSON.parse(fs.readFileSync(f, 'utf8')).batches || []; }
  catch { return []; }
}

function plan({ repoRoot, ageDays: maxAge = 30 }) {
  const ROOT = path.join(repoRoot, 'video-creation');
  const recycle = [];
  const skipped = [];

  const olderEnough = (f) => ageDays(f) >= maxAge;
  const classifyAge = (f, label) => {
    if (olderEnough(f)) recycle.push({ path: f, reason: `${label} (>${maxAge}d old)` });
    else skipped.push({ path: f, reason: `${label} but too recent (<${maxAge}d)` });
  };

  const batches = loadBatches(repoRoot);
  // batch id (lowercased) -> status, for the assets/projects/<batch>/ registry tier.
  const batchStatus = new Map(
    batches.filter(b => b.batch).map(b => [String(b.batch).toLowerCase(), b.status])
  );

  // ── assets/ ──────────────────────────────────────────────────────────────
  const ASSETS = path.join(ROOT, 'assets');
  const PROJECTS = path.join(ASSETS, 'projects').toLowerCase();
  const protectDirs = new Set(
    ['sfx', 'music', 'fonts', 'transitions'].map(d => path.join(ASSETS, d).toLowerCase())
  );
  const badDirs = [];
  const assetFiles = walkFiles(ASSETS, {
    skipDirs: protectDirs,
    onDir: (full, name) => {
      if (/^_bad/i.test(name)) { badDirs.push(full); return true; } // prune + collect
      return false;
    },
  });
  for (const d of badDirs) recycle.push({ path: d, reason: 'reject folder (_bad-*)' });
  // For a file under assets/projects/<batch>/..., return that <batch> folder name; else null.
  const projectBatchOf = (f) => {
    const fl = f.toLowerCase();
    if (!fl.startsWith(PROJECTS + path.sep)) return null;
    return path.relative(PROJECTS, fl).split(path.sep)[0] || null;
  };
  for (const f of assetFiles) {
    if (LOGO_RE.test(path.basename(f))) { skipped.push({ path: f, reason: 'protected logo' }); continue; }
    const batch = projectBatchOf(f);
    if (batch) {
      const status = batchStatus.get(batch);
      if (status === 'active') { skipped.push({ path: f, reason: `project asset — active batch (${batch})` }); continue; }
      if (status === 'completed' || status === 'archived') { recycle.push({ path: f, reason: `project asset — ${status} batch (${batch})` }); continue; }
      // no matching batch in the registry — fall through to age-based (safe default).
      classifyAge(f, `project asset — batch "${batch}" not in registry`); continue;
    }
    classifyAge(f, 'asset');
  }

  // ── livestream-repurpose/media + transcripts — batch-aware ─────────────────
  // Keep files belonging to an ACTIVE batch (matched by livestream_title prefix);
  // recycle those belonging to an ARCHIVED batch. Files matching no batch are left
  // alone (can't classify safely). Media is on YouTube + transcripts regenerable.
  const titled = batches.filter(b => b.livestream_title);
  // Match a media filename or a transcript folder name to its batch by livestream_title
  // prefix (longest match wins, since one title could prefix another).
  const batchFor = (name) => {
    let best = null;
    for (const b of titled) {
      if (name.startsWith(b.livestream_title) &&
          (!best || b.livestream_title.length > best.livestream_title.length)) best = b;
    }
    return best;
  };
  const classifyByBatch = (full, name, kind) => {
    const b = batchFor(name);
    if (!b) skipped.push({ path: full, reason: `${kind} — not in batch registry` });
    else if (b.status === 'active') skipped.push({ path: full, reason: `${kind} — active batch (${b.batch})` });
    else recycle.push({ path: full, reason: `${kind} — ${b.status} batch (${b.batch})` });
  };
  // media/: flat files named after the livestream.
  for (const f of walkFiles(path.join(ROOT, 'livestream-repurpose', 'media'))) {
    classifyByBatch(f, path.basename(f), 'livestream media');
  }
  // transcripts/: one folder per livestream (legacy loose files handled too).
  const tdir = path.join(ROOT, 'livestream-repurpose', 'transcripts');
  if (fs.existsSync(tdir)) {
    for (const e of fs.readdirSync(tdir, { withFileTypes: true })) {
      classifyByBatch(path.join(tdir, e.name), e.name, e.isDirectory() ? 'transcript folder' : 'transcript file');
    }
  }

  // ── shorts/<batch>/ — whole project folder, batch-aware (matched by directories) ──
  // Each immediate subfolder of shorts/ is a batch's clip project (matched by the batch's
  // `directories`). Recycle the WHOLE folder for a completed/archived batch, keep an active
  // one. A folder tied to no batch (e.g. _tooling, or a not-yet-registered project) is left
  // in place at the folder level — only its gitignored per-clip artifacts (preview.mp4 /
  // whisper-words.json / captions.ts.draft) are swept, tracked source is left untouched.
  const SHORTS_DIR = path.join(ROOT, 'shorts');
  // resolved shorts subdir (lowercased) -> batch it belongs to.
  const shortsBatchByDir = new Map();
  for (const b of batches) {
    for (const d of (b.directories || [])) {
      const abs = path.resolve(repoRoot, d).toLowerCase();
      if (abs.includes(`${path.sep}shorts${path.sep}`)) shortsBatchByDir.set(abs, b);
    }
  }
  if (fs.existsSync(SHORTS_DIR)) {
    for (const entry of fs.readdirSync(SHORTS_DIR, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const full = path.join(SHORTS_DIR, entry.name);
      const b = shortsBatchByDir.get(full.toLowerCase());
      if (!b) continue; // unregistered folder — handled by the artifact sweep below
      if (b.status === 'active') skipped.push({ path: full, reason: `shorts project — active batch (${b.batch})` });
      else recycle.push({ path: full, reason: `shorts project — ${b.status} batch (${b.batch})` });
    }
  }
  // Per-clip artifact sweep for shorts files NOT inside a registered batch folder
  // (those are governed wholesale above). Unregistered = recycle the heavy artifact only.
  const matchedShortsRoots = [...shortsBatchByDir.keys()].map(d => d + path.sep);
  for (const f of walkFiles(SHORTS_DIR)) {
    if (!ARTIFACT_RE.test(path.basename(f))) continue;
    const fl = f.toLowerCase();
    if (matchedShortsRoots.some(r => fl.startsWith(r))) continue; // inside a batch folder
    recycle.push({ path: f, reason: 'clip artifact — outside any batch folder' });
  }

  // ── remotion/out/ — keep ONLY active batches' render folders ───────────────
  // out/ is disposable scratch: posted shorts live in the schedule-tweets queue and
  // every comp is in git, so anything not tied to an active batch is recyclable.
  const OUT = path.join(ROOT, 'remotion', 'out');
  const activeOutDirs = new Set(
    batches
      .filter(b => b.status === 'active')
      .flatMap(b => b.directories || [])
      .map(d => path.resolve(repoRoot, d).toLowerCase())
  );
  if (fs.existsSync(OUT)) {
    for (const entry of fs.readdirSync(OUT, { withFileTypes: true })) {
      const full = path.join(OUT, entry.name);
      if (entry.isDirectory()) {
        if (activeOutDirs.has(full.toLowerCase())) skipped.push({ path: full, reason: 'active batch render folder' });
        else recycle.push({ path: full, reason: 'render folder — not an active batch' });
      } else if (entry.isFile()) {
        recycle.push({ path: full, reason: 'loose legacy render (no active batch folder)' });
      }
    }
  }

  // ── longform-presentation/media/<project>/ — batch-aware (matched by source_media) ────────
  // Each project subfolder holds a longform-presentation batch's source artifacts (master .mkv,
  // EDIT/FINAL, deck, transcript, thumbnail). Recycle a completed/archived batch's folder, keep
  // an active one, leave an unmatched folder alone (can't classify safely). ONLY media/<project>/
  // subfolders are eligible — top-level files (the skill doc, scripts/, decks) are never touched.
  const LFP_MEDIA = path.join(ROOT, 'longform-presentation', 'media');
  if (fs.existsSync(LFP_MEDIA)) {
    for (const entry of fs.readdirSync(LFP_MEDIA, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const full = path.join(LFP_MEDIA, entry.name);
      // Match by path prefix: source_media may be the project FOLDER or a FILE inside it.
      const relPath = `video-creation/longform-presentation/media/${entry.name}`.toLowerCase();
      const b = batches.find((bb) => {
        if (!bb.source_media) return false;
        const sm = bb.source_media.replace(/\\/g, '/').toLowerCase();
        return sm === relPath || sm.startsWith(relPath + '/');
      });
      if (!b) { skipped.push({ path: full, reason: 'longform-presentation project — not in batch registry' }); continue; }
      if (b.status === 'active') skipped.push({ path: full, reason: `longform-presentation project — active batch (${b.batch})` });
      else recycle.push({ path: full, reason: `longform-presentation project — ${b.status} batch (${b.batch})` });
    }
  }

  // ── longform-edited/media/<project>/ — batch-aware (matched by source_media) ──────────
  // Mirror of longform-presentation above, for the heavily-edited 16:9 track. Each project
  // subfolder holds a longform-edited batch's source artifacts (master .mkv, EDIT/FINAL renders,
  // intermediates, deck, transcript, thumbnail). Recycle the WHOLE folder for a completed/archived
  // batch, keep an active one, leave an unmatched folder alone. ONLY media/<project>/ subfolders are
  // eligible — the track's skill doc and scripts are never touched.
  const LFE_MEDIA = path.join(ROOT, 'longform-edited', 'media');
  if (fs.existsSync(LFE_MEDIA)) {
    for (const entry of fs.readdirSync(LFE_MEDIA, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const full = path.join(LFE_MEDIA, entry.name);
      const relPath = `video-creation/longform-edited/media/${entry.name}`.toLowerCase();
      const b = batches.find((bb) => {
        if (!bb.source_media) return false;
        const sm = bb.source_media.replace(/\\/g, '/').toLowerCase();
        return sm === relPath || sm.startsWith(relPath + '/');
      });
      if (!b) { skipped.push({ path: full, reason: 'longform-edited project — not in batch registry' }); continue; }
      if (b.status === 'active') skipped.push({ path: full, reason: `longform-edited project — active batch (${b.batch})` });
      else recycle.push({ path: full, reason: `longform-edited project — ${b.status} batch (${b.batch})` });
    }
  }

  return { name: NAME, recycle, skipped };
}

module.exports = { name: NAME, plan };

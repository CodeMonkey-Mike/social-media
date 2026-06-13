'use strict';

// Policy: HYBRID.
//  - Protected (never touch): assets/{sfx,music,fonts,transitions}/, assets/logo-*.png,
//    and every <batch>-progress.json.
//  - Always sweep: any _bad-*/ reject folder (regardless of age).
//  - Registry-driven (assets/projects/<batch>/ — the canonical per-batch asset home, see
//    video-creation/SKILL.md): keep folders whose <batch> is ACTIVE in batches.json, recycle
//    those of an ARCHIVED batch; a folder matching no batch falls back to age-based.
//  - Age-based (recycle if older than --age-days, default 30): everything else under
//    assets/ (legacy loose b-roll PNGs, *-clip.mp4, overlays in the root and non-projects/
//    subdirs), livestream-repurpose/media + transcripts, and per-clip artifacts under shorts/
//    (preview.mp4, whisper*.json, captions.ts.draft).
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

  // ── shorts/ per-clip artifacts — keep active batch, recycle the rest ───────
  // Only the gitignored heavy artifacts (preview.mp4 / whisper-words.json /
  // captions.ts.draft); tracked source in the clip dirs is left untouched.
  const activeShortsDirs = batches
    .filter(b => b.status === 'active')
    .flatMap(b => b.directories || [])
    .map(d => path.resolve(repoRoot, d).toLowerCase())
    .filter(d => d.includes(`${path.sep}shorts${path.sep}`));
  for (const f of walkFiles(path.join(ROOT, 'shorts'))) {
    if (!ARTIFACT_RE.test(path.basename(f))) continue;
    const fl = f.toLowerCase();
    if (activeShortsDirs.some(d => fl.startsWith(d))) skipped.push({ path: f, reason: 'clip artifact — active batch' });
    else recycle.push({ path: f, reason: 'clip artifact — outside active batch' });
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

  return { name: NAME, recycle, skipped };
}

module.exports = { name: NAME, plan };

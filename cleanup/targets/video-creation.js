'use strict';

// Policy: HYBRID.
//  - Protected (never touch): assets/{sfx,music,fonts,transitions}/, assets/logo-*.png,
//    and every <batch>-progress.json.
//  - Always sweep: any _bad-*/ reject folder (regardless of age).
//  - Age-based (recycle if older than --age-days, default 30): everything else under
//    assets/ (b-roll PNGs, *-clip.mp4, overlays), livestream-repurpose/media + transcripts,
//    and per-clip artifacts under shorts/ (preview.mp4, whisper*.json, captions.ts.draft).
//  - Publish-state guard: remotion/out/<batch>/<n>-<slug>.mp4 is recycled only when that
//    clip is in shorts.json with EVERY platform status=posted (queue copy is the canonical one).

const fs = require('fs');
const path = require('path');
const { walkFiles, ageDays } = require('../lib');

const NAME = 'video-creation';
const ARTIFACT_RE = /^(preview\.mp4|whisper.*\.json|captions\.ts\.draft)$/i;
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

  // ── assets/ ──────────────────────────────────────────────────────────────
  const ASSETS = path.join(ROOT, 'assets');
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
  for (const f of assetFiles) {
    if (LOGO_RE.test(path.basename(f))) { skipped.push({ path: f, reason: 'protected logo' }); continue; }
    classifyAge(f, 'asset');
  }

  // ── livestream-repurpose/media + transcripts ───────────────────────────────
  for (const sub of ['media', 'transcripts']) {
    const dir = path.join(ROOT, 'livestream-repurpose', sub);
    for (const f of walkFiles(dir)) classifyAge(f, `livestream ${sub}`);
  }

  // ── per-clip artifacts under shorts/ ───────────────────────────────────────
  for (const f of walkFiles(path.join(ROOT, 'shorts'))) {
    if (ARTIFACT_RE.test(path.basename(f))) classifyAge(f, 'clip artifact');
  }

  // ── remotion/out/ — keep ONLY active batches' render folders ───────────────
  // out/ is disposable scratch: posted shorts live in the schedule-tweets queue and
  // every comp is in git, so anything not tied to an active batch is recyclable.
  const OUT = path.join(ROOT, 'remotion', 'out');
  const activeOutDirs = new Set(
    loadBatches(repoRoot)
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

  return { name: NAME, recycle, skipped };
}

module.exports = { name: NAME, plan };

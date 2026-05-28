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
const NUM_PREFIX = /^\d+-/;

// Returns one record per shorts.json entry: { slug, source, allPosted }.
// The caller matches on BOTH slug and batch (source_livestream) — slugs are not
// unique across batches (e.g. pengu-flips-pepe exists in two different batches).
function loadShortsEntries(repoRoot) {
  const f = path.join(repoRoot, 'schedule-tweets', 'data', 'shorts.json');
  if (!fs.existsSync(f)) return [];
  let data;
  try { data = JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return []; }
  return (data.shorts || []).map(s => {
    const plats = s.platforms ? Object.values(s.platforms) : [];
    return {
      slug: s.slug,
      source: s.source_livestream || '',
      allPosted: plats.length > 0 && plats.every(p => p && p.status === 'posted'),
    };
  });
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

  // ── remotion/out/<batch>/ renders — publish-state guard ────────────────────
  const OUT = path.join(ROOT, 'remotion', 'out');
  const entries = loadShortsEntries(repoRoot);
  if (fs.existsSync(OUT)) {
    for (const batch of fs.readdirSync(OUT, { withFileTypes: true })) {
      if (!batch.isDirectory()) continue;
      const batchDir = path.join(OUT, batch.name);
      // Match shorts whose source_livestream belongs to THIS batch (e.g. "meme-coins-2026-05-28"
      // for the "meme-coins" render folder). Slug alone is ambiguous across batches.
      const prefix = batch.name + '-';
      for (const f of fs.readdirSync(batchDir)) {
        if (!f.toLowerCase().endsWith('.mp4')) continue;
        const slug = path.basename(f, '.mp4').replace(NUM_PREFIX, '');
        const full = path.join(batchDir, f);
        const matches = entries.filter(e => e.slug === slug && e.source.startsWith(prefix));
        if (matches.length && matches.some(e => e.allPosted)) {
          recycle.push({ path: full, reason: `posted render (${batch.name})` });
        } else if (matches.length) {
          skipped.push({ path: full, reason: 'render — not yet posted on all platforms' });
        } else {
          skipped.push({ path: full, reason: 'render — not in shorts.json for this batch yet' });
        }
      }
    }
  }

  return { name: NAME, recycle, skipped };
}

module.exports = { name: NAME, plan };

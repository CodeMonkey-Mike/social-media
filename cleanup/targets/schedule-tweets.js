'use strict';

// Policy: reference-counted GC against the post queues, for BOTH images and staged videos.
//  - Images (images/) are keyed on each queue item's single status field; staged videos
//    (longform/ + shorts/) are keyed on PER-PLATFORM status in longs.json / shorts.json
//    (a staged video is "posted" only when EVERY platform is terminal). A referenced file is
//    recycled only when its post is fully posted AND no non-posted item references it.
//  - An ORPHAN file (referenced by NO queue) is recycled once it is >= ORPHAN_AGE_DAYS old;
//    a newer orphan is kept (may be freshly generated/staged and not yet queued). Recency thus
//    protects active-batch work, which is always recent — no batch-id check needed.
//  - metadata.json (the active staging manifest) is always kept.
// Ported from schedule-tweets/scripts/cleanup-images.js.

const fs = require('fs');
const path = require('path');
const { walkFiles, ageDays } = require('../lib');

const NAME = 'schedule-tweets';

// Orphan images (in no queue) are kept until this old, then recycled. ~2 weeks: long enough
// that a generated-but-not-yet-queued image survives a normal drafting cycle.
const ORPHAN_AGE_DAYS = 14;

function plan({ repoRoot }) {
  const BASE = path.join(repoRoot, 'schedule-tweets');
  const IMAGES_DIR = path.join(BASE, 'images');
  const DATA_DIR = path.join(BASE, 'data');
  const REFERENCE_DIR = path.join(IMAGES_DIR, 'reference');

  // image_path looks like "schedule-tweets/images/x/foo.png" (relative to repo root)
  const resolveImagePath = (imgPath) => {
    if (!imgPath) return null;
    const rel = imgPath.replace(/^schedule-tweets\//, '').replace(/\//g, path.sep);
    return path.join(BASE, rel);
  };

  const postedPaths = new Set();
  const activePaths = new Set();

  const scanFile = (file, getItems, getImagePaths) => {
    if (!fs.existsSync(file)) return;
    let data;
    try { data = JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return; }
    for (const item of getItems(data)) {
      const isPosted = item.status === 'posted';
      for (const imgPath of getImagePaths(item)) {
        const abs = resolveImagePath(imgPath);
        if (!abs) continue;
        (isPosted ? postedPaths : activePaths).add(abs.toLowerCase());
      }
    }
  };

  const D = (f) => path.join(DATA_DIR, f);
  scanFile(D('x-tweets.json'), d => d.tweets || [], t => [t.image_path]);
  scanFile(D('x-threads.json'), d => d.threads || [], t => (t.tweets || []).map(tw => tw.image_path));
  scanFile(D('x-polls.json'), d => d.polls || [], p => [p.image_path]);
  scanFile(D('ig-single-image.json'), d => d.posts || [], p => [p.image_path]);
  scanFile(D('ig-carousel.json'), d => d.posts || [], p => (p.slides || []).map(s => s.image_path));
  scanFile(D('yt-posts.json'), d => d.posts || [], p => (p.images || []).map(i => i.image_path));
  scanFile(D('yt-text-polls.json'), d => d.polls || [], p => [p.image_path]);

  // Staged video queues (shorts.json / longs.json) use PER-PLATFORM status, not a single
  // item.status — a staged file counts as posted only when every platform is terminal.
  const PLATFORM_DONE = new Set(['posted', 'posted_unverified', 'skip', 'skipped']);
  const scanStaged = (file, getItems, getPaths) => {
    if (!fs.existsSync(file)) return;
    let data;
    try { data = JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return; }
    for (const item of getItems(data)) {
      const plats = Object.values(item.platforms || {});
      const fullyPosted = plats.length > 0 && plats.every(p => PLATFORM_DONE.has(p && p.status));
      for (const rel of getPaths(item)) {
        const abs = resolveImagePath(rel);
        if (!abs) continue;
        (fullyPosted ? postedPaths : activePaths).add(abs.toLowerCase());
      }
    }
  };
  scanStaged(D('shorts.json'), d => d.shorts || [], s => [s.video_path, s.thumbnail_path]);
  scanStaged(D('longs.json'), d => d.longs || [], l => [l.video_path, l.thumbnail_path]);

  const recycle = [];
  const skipped = [];
  const allImages = walkFiles(IMAGES_DIR, { skipDirs: new Set([REFERENCE_DIR.toLowerCase()]) });
  for (const img of allImages) {
    const key = img.toLowerCase();
    if (activePaths.has(key)) skipped.push({ path: img, reason: 'still needed (non-posted item links it)' });
    else if (postedPaths.has(key)) recycle.push({ path: img, reason: 'posted, no active link' });
    else if (ageDays(img) >= ORPHAN_AGE_DAYS) recycle.push({ path: img, reason: `orphan (no queue ref, >=${ORPHAN_AGE_DAYS}d old)` });
    else skipped.push({ path: img, reason: `orphan (no queue ref, <${ORPHAN_AGE_DAYS}d — may be unqueued)` });
  }

  // Staged video folders (longform/ + shorts/) — same reference-counted + orphan-by-age policy
  // as images, but driven by per-platform status in longs.json / shorts.json. A short/long that
  // still has any non-terminal platform keeps its staged file; metadata.json is always kept.
  for (const sub of ['longform', 'shorts']) {
    const dir = path.join(BASE, sub);
    if (!fs.existsSync(dir)) continue;
    for (const f of walkFiles(dir)) {
      if (path.basename(f).toLowerCase() === 'metadata.json') { skipped.push({ path: f, reason: `${sub} staging manifest` }); continue; }
      const key = f.toLowerCase();
      if (activePaths.has(key)) skipped.push({ path: f, reason: `${sub} — still needed (pending post links it)` });
      else if (postedPaths.has(key)) recycle.push({ path: f, reason: `${sub} — posted, no active link` });
      else if (ageDays(f) >= ORPHAN_AGE_DAYS) recycle.push({ path: f, reason: `${sub} orphan (no queue ref, >=${ORPHAN_AGE_DAYS}d old)` });
      else skipped.push({ path: f, reason: `${sub} orphan (<${ORPHAN_AGE_DAYS}d — may be unstaged)` });
    }
  }

  // Run logs (post-step*/workflow-step*.log) directly in schedule-tweets/ — recycle once
  // >=24h old so the current posting session is preserved. Top-level only, so the Chrome
  // bot-profile LevelDB logs deeper in the tree are never touched.
  for (const f of fs.readdirSync(BASE)) {
    if (!f.toLowerCase().endsWith('.log')) continue;
    const full = path.join(BASE, f);
    if (!fs.statSync(full).isFile()) continue;
    if (ageDays(full) >= 1) recycle.push({ path: full, reason: 'run log (>=24h old)' });
    else skipped.push({ path: full, reason: 'run log (<24h, current session)' });
  }
  return { name: NAME, recycle, skipped };
}

module.exports = { name: NAME, plan };

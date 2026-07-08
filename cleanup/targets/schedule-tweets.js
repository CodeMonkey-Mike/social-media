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

// A staged folder whose batch is in one of these states is recycled WHOLESALE (see below).
const ARCHIVED_STATUS = new Set(['completed', 'archived']);

// The batch registry (repo-root batches.json). Used to map a staged folder under
// longform/ or shorts/ to its batch status, so a finished batch's folder is removed
// outright instead of being stranded by a recent orphan thumbnail.
function loadBatchStatus(repoRoot) {
  const f = path.join(repoRoot, 'batches.json');
  if (!fs.existsSync(f)) return new Map();
  try {
    const batches = JSON.parse(fs.readFileSync(f, 'utf8')).batches || [];
    return new Map(batches.filter(b => b.batch).map(b => [String(b.batch).toLowerCase(), b.status]));
  } catch { return new Map(); }
}

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

  // Staged video folders (longform/ + shorts/). Each immediate subfolder is one batch's
  // staged deliverables. The unit of cleanup is the WHOLE folder, keyed on batch status, so
  // a finished batch's folder is removed outright — leftover cover thumbnails (which are
  // recent orphans the per-file rule would otherwise keep) never strand an inactive folder:
  //   * batch completed/archived -> recycle the entire <batch>/ folder (thumbnails included).
  //   * batch active             -> KEEP the folder; clean only its individually posted files
  //                                 (per-platform status), so an in-flight batch is preserved.
  //   * folder maps to no batch  -> fall back to the per-file reference-counted + orphan-by-age
  //                                 policy (can't classify the folder safely, so don't nuke it).
  // metadata.json directly under longform/ or shorts/ is the live staging manifest — always kept.
  const batchStatus = loadBatchStatus(repoRoot);
  // Folder names may carry a trailing -YYYY-MM-DD (e.g. best-coin-to-buy-2026-06-17); strip it to match the batch id.
  const batchOfFolder = (name) => {
    const lc = name.toLowerCase();
    if (batchStatus.has(lc)) return lc;
    const stripped = lc.replace(/-\d{4}-\d{2}-\d{2}$/, '');
    return batchStatus.has(stripped) ? stripped : null;
  };
  const classifyStagedFile = (f, sub) => {
    if (path.basename(f).toLowerCase() === 'metadata.json') { skipped.push({ path: f, reason: `${sub} staging manifest` }); return; }
    const key = f.toLowerCase();
    if (activePaths.has(key)) skipped.push({ path: f, reason: `${sub} — still needed (pending post links it)` });
    else if (postedPaths.has(key)) recycle.push({ path: f, reason: `${sub} — posted, no active link` });
    else if (ageDays(f) >= ORPHAN_AGE_DAYS) recycle.push({ path: f, reason: `${sub} orphan (no queue ref, >=${ORPHAN_AGE_DAYS}d old)` });
    else skipped.push({ path: f, reason: `${sub} orphan (<${ORPHAN_AGE_DAYS}d — may be unstaged)` });
  };
  for (const sub of ['longform', 'shorts']) {
    const dir = path.join(BASE, sub);
    if (!fs.existsSync(dir)) continue;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (!entry.isDirectory()) { classifyStagedFile(full, sub); continue; } // loose top-level file (e.g. metadata.json)
      const batch = batchOfFolder(entry.name);
      const status = batch && batchStatus.get(batch);
      if (status && ARCHIVED_STATUS.has(status)) { recycle.push({ path: full, reason: `${sub} project — ${status} batch (${batch})` }); continue; }
      // active batch, or a folder we can't map to a batch: keep the folder, classify per-file.
      for (const f of walkFiles(full)) classifyStagedFile(f, sub);
    }
  }

  // Loose top-level artifacts in schedule-tweets/ — recycle once >=24h old so the current
  // posting session is preserved. Top-level only, so the Chrome bot-profile LevelDB logs deeper
  // in the tree, and the real post images under images/, are never touched.
  //   * run logs (post-step*/workflow-step*.log)
  //   * debug screenshots (*.png/*.jpg) — the Playwright posting/diagnostic scripts dump these
  //     at the repo root (diag-poll-*, debug-after-*, dashboard_check*, replies_tab_*, etc.);
  //     they are throwaway captures, never queue assets (those live under images/).
  const SCREENSHOT_RE = /\.(png|jpe?g)$/i;
  for (const f of fs.readdirSync(BASE)) {
    const full = path.join(BASE, f);
    if (!fs.statSync(full).isFile()) continue;
    const lc = f.toLowerCase();
    if (lc.endsWith('.log')) {
      if (ageDays(full) >= 1) recycle.push({ path: full, reason: 'run log (>=24h old)' });
      else skipped.push({ path: full, reason: 'run log (<24h, current session)' });
    } else if (SCREENSHOT_RE.test(lc)) {
      if (ageDays(full) >= 1) recycle.push({ path: full, reason: 'debug screenshot (>=24h old)' });
      else skipped.push({ path: full, reason: 'debug screenshot (<24h, current session)' });
    }
  }
  // Empty <batch>/ folders under longform/ and shorts/ are pruned by the engine once their
  // files are recycled, so a finished batch never leaves an empty directory behind.
  const pruneRoots = [path.join(BASE, 'longform'), path.join(BASE, 'shorts')];
  return { name: NAME, recycle, skipped, pruneRoots };
}

module.exports = { name: NAME, plan };

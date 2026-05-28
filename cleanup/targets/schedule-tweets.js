'use strict';

// Policy: reference-counted GC against the post queues.
// An image is recycled only if (a) some queue references it with status=posted
// and (b) no non-posted item references it. Images not in any queue are left
// untouched. Ported from schedule-tweets/scripts/cleanup-images.js.

const fs = require('fs');
const path = require('path');
const { walkFiles } = require('../lib');

const NAME = 'schedule-tweets';

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

  const recycle = [];
  const skipped = [];
  const allImages = walkFiles(IMAGES_DIR, { skipDirs: new Set([REFERENCE_DIR.toLowerCase()]) });
  for (const img of allImages) {
    const key = img.toLowerCase();
    if (activePaths.has(key)) skipped.push({ path: img, reason: 'still needed (non-posted item links it)' });
    else if (postedPaths.has(key)) recycle.push({ path: img, reason: 'posted, no active link' });
    else skipped.push({ path: img, reason: 'not in any queue (untracked)' });
  }
  return { name: NAME, recycle, skipped };
}

module.exports = { name: NAME, plan };

'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const os = require('os');

const BASE = path.join('C:', 'Users', 'mnede', 'Documents', 'Claude', 'social-media', 'schedule-tweets');
const IMAGES_DIR = path.join(BASE, 'images');
const DATA_DIR = path.join(BASE, 'data');
const REFERENCE_DIR = path.join(IMAGES_DIR, 'reference');
const DRY_RUN = process.argv.includes('--dry-run');

if (DRY_RUN) console.log('[DRY RUN] No files will be moved.\n');

// Resolve a JSON image_path to an absolute Windows path.
// image_path format: "schedule-tweets/images/x/foo.png" (relative to parent of BASE)
function resolveImagePath(imgPath) {
  if (!imgPath) return null;
  const rel = imgPath.replace(/^schedule-tweets\//, '').replace(/\//g, path.sep);
  return path.join(BASE, rel);
}

// Two sets: paths linked to a posted item, paths linked to a non-posted item.
// An image is only recycled if it appears in postedPaths AND NOT in activePaths.
// This protects images that happen to be shared across a posted + pending post.
const postedPaths = new Set();
const activePaths = new Set();

function scanFile(filePath, getItems, getImagePaths) {
  if (!fs.existsSync(filePath)) return;
  let data;
  try { data = JSON.parse(fs.readFileSync(filePath, 'utf8')); } catch { return; }
  for (const item of getItems(data)) {
    const isPosted = item.status === 'posted';
    for (const imgPath of getImagePaths(item)) {
      const abs = resolveImagePath(imgPath);
      if (!abs) continue;
      const key = abs.toLowerCase();
      if (isPosted) postedPaths.add(key);
      else activePaths.add(key);
    }
  }
}

scanFile(
  path.join(DATA_DIR, 'x-tweets.json'),
  d => d.tweets || [],
  t => [t.image_path]
);

scanFile(
  path.join(DATA_DIR, 'x-threads.json'),
  d => d.threads || [],
  t => (t.tweets || []).map(tw => tw.image_path)
);

scanFile(
  path.join(DATA_DIR, 'x-polls.json'),
  d => d.polls || [],
  p => [p.image_path]
);

scanFile(
  path.join(DATA_DIR, 'ig-single-image.json'),
  d => d.posts || [],
  p => [p.image_path]
);

// Carousel: each slide is an independent image
scanFile(
  path.join(DATA_DIR, 'ig-carousel.json'),
  d => d.posts || [],
  p => (p.slides || []).map(s => s.image_path)
);

// YT community posts: optional images array
scanFile(
  path.join(DATA_DIR, 'yt-posts.json'),
  d => d.posts || [],
  p => (p.images || []).map(i => i.image_path)
);

scanFile(
  path.join(DATA_DIR, 'yt-text-polls.json'),
  d => d.polls || [],
  p => [p.image_path]
);

// Walk images/, skip the reference/ subfolder entirely
function walkDir(dir) {
  const result = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (fullPath.toLowerCase() !== REFERENCE_DIR.toLowerCase()) {
        result.push(...walkDir(fullPath));
      }
    } else if (entry.isFile()) {
      result.push(fullPath);
    }
  }
  return result;
}

const allImages = walkDir(IMAGES_DIR);
const toRecycle = [];
const skippedActive = [];    // found in JSON, but a non-posted item still needs it
const skippedUnknown = [];   // not found in any JSON file — do not touch

for (const imgPath of allImages) {
  const key = imgPath.toLowerCase();
  if (activePaths.has(key)) {
    skippedActive.push(imgPath);
  } else if (postedPaths.has(key)) {
    toRecycle.push(imgPath);
  } else {
    skippedUnknown.push(imgPath);
  }
}

console.log(`Scanned ${allImages.length} image(s) in images/ (reference/ excluded)`);
console.log(`  Ready to recycle (posted, no active link): ${toRecycle.length}`);
console.log(`  Skipped — still needed (non-posted association): ${skippedActive.length}`);
console.log(`  Skipped — not found in any JSON queue: ${skippedUnknown.length}`);

if (skippedUnknown.length > 0) {
  console.log('\nUnknown images (left untouched):');
  for (const f of skippedUnknown) console.log('  ?', path.basename(f));
}

if (toRecycle.length === 0) {
  console.log('\nNothing to recycle.');
  process.exit(0);
}

if (DRY_RUN) {
  console.log('\nWould recycle:');
  for (const f of toRecycle) console.log('  ', path.basename(f));
  process.exit(0);
}

// Move all eligible files to the Recycle Bin in one PowerShell call
const psLines = [
  'Add-Type -AssemblyName Microsoft.VisualBasic',
  ...toRecycle.map(f =>
    `[Microsoft.VisualBasic.FileIO.FileSystem]::DeleteFile('${f.replace(/'/g, "''")}', 'OnlyErrorDialogs', 'SendToRecycleBin')`
  ),
];

const tempScript = path.join(os.tmpdir(), `cleanup-images-${Date.now()}.ps1`);
fs.writeFileSync(tempScript, psLines.join('\r\n'), 'utf8');

console.log('\nMoving files to Recycle Bin...');
const result = spawnSync(
  'powershell',
  ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-File', tempScript],
  { stdio: 'inherit' }
);

try { fs.unlinkSync(tempScript); } catch {}

if (result.status !== 0) {
  console.error('\nRecycle Bin operation failed.');
  process.exit(1);
}

console.log(`\nDone. Moved ${toRecycle.length} image(s) to Recycle Bin:`);
for (const f of toRecycle) console.log('  Recycled:', path.basename(f));

'use strict';

// setup-batch-render-assets.js — stage a SHORTS batch's render-ready assets into its OWN
// self-contained public dir: video-creation/shorts/<batch>/render-assets/.
//
// This is the prevention for the old leak where shorts spine clips landed in
// video-creation/assets/projects/<batch>/ and b-roll PNGs landed loose in the assets ROOT.
// A shorts batch now renders with `--public-dir video-creation/shorts/<batch>/render-assets`,
// so EVERYTHING the comp loads lives under that one folder and gets recycled wholesale with the
// batch (see cleanup/targets/video-creation.js, the shorts/<batch>/ whole-folder tier).
//
// We COPY (never junction) the handful of shared SFX/logos the comp references — a junction
// inside shorts/<batch>/ would be FOLLOWED by cleanup's recursive DeleteDirectory and recycle
// the real shared library. Copies are transient and recycled with the batch.
//
// Usage:
//   node scripts/setup-batch-render-assets.js <batch> [--data <relpath-or-abs to dataFile.ts>]
//
//   <batch>            the batch id (folder name under video-creation/shorts/)
//   --data <file>      OPTIONAL Remotion data/comp file (e.g. video-creation/remotion/src/dataFoo.ts).
//                      When given, every staticFile('X') it references that exists under
//                      video-creation/assets/X is COPIED into render-assets/X (preserving subpaths,
//                      so sfx/Foo.wav -> render-assets/sfx/Foo.wav). This auto-stages the shared
//                      SFX/logos the comp needs. Run AFTER the data file is written.
//
// Always run BEFORE the staged step it supports: run once early (creates the dir + copies the
// tightened spine clips it can find), and again with --data once the data file exists.

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const ASSETS = path.join(REPO_ROOT, 'video-creation', 'assets');

function parseArgs(argv) {
  const a = { batch: null, data: null };
  for (let i = 0; i < argv.length; i++) {
    const x = argv[i];
    if (x === '--data') a.data = argv[++i];
    else if (x.startsWith('--data=')) a.data = x.split('=')[1];
    else if (!a.batch && !x.startsWith('--')) a.batch = x;
  }
  return a;
}

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function main() {
  const { batch, data } = parseArgs(process.argv.slice(2));
  if (!batch) {
    console.error('ERROR: <batch> is required. Usage: node scripts/setup-batch-render-assets.js <batch> [--data <dataFile.ts>]');
    process.exit(2);
  }

  const batchDir = path.join(REPO_ROOT, 'video-creation', 'shorts', batch);
  if (!fs.existsSync(batchDir)) {
    console.error(`ERROR: batch folder not found: ${path.relative(REPO_ROOT, batchDir)}\n(create the shorts batch first — cut_topics writes shorts/<batch>/)`);
    process.exit(2);
  }
  const renderAssets = path.join(batchDir, 'render-assets');
  fs.mkdirSync(renderAssets, { recursive: true });
  console.log(`render-assets: ${path.relative(REPO_ROOT, renderAssets)}`);

  // 1) Copy each clip's tightened.mp4 -> render-assets/<slug>.mp4 (the spine the comp loads).
  let spines = 0;
  for (const entry of fs.readdirSync(batchDir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === 'render-assets') continue;
    const tightened = path.join(batchDir, entry.name, 'tightened.mp4');
    if (!fs.existsSync(tightened)) continue;
    const dest = path.join(renderAssets, `${entry.name}.mp4`);
    copyFile(tightened, dest);
    spines++;
    console.log(`  spine  ${entry.name}.mp4  <- ${entry.name}/tightened.mp4`);
  }
  if (spines === 0) console.log('  (no <slug>/tightened.mp4 found yet — re-run after tightening)');

  // 2) If a data file is given, COPY every shared staticFile('X') it references into render-assets/X.
  //    Spine clips (already staged above) and b-roll generated straight into render-assets are
  //    skipped automatically — they already exist at the destination.
  if (data) {
    const dataPath = path.isAbsolute(data) ? data : path.join(REPO_ROOT, data);
    if (!fs.existsSync(dataPath)) {
      console.error(`ERROR: --data file not found: ${data}`);
      process.exit(2);
    }
    const src = fs.readFileSync(dataPath, 'utf8');
    const refs = new Set();
    const re = /staticFile\(\s*[`'"]([^`'"]+)[`'"]\s*\)/g;
    let m;
    while ((m = re.exec(src))) refs.add(m[1]);
    let staged = 0, already = 0, missing = [];
    for (const rel of refs) {
      const dest = path.join(renderAssets, rel);
      if (fs.existsSync(dest)) { already++; continue; }     // spine / b-roll already here
      const shared = path.join(ASSETS, rel);
      if (fs.existsSync(shared)) { copyFile(shared, dest); staged++; console.log(`  shared ${rel}`); }
      else missing.push(rel);
    }
    console.log(`  data refs: ${refs.size} (${staged} copied from shared, ${already} already present)`);
    if (missing.length) {
      console.log(`  NOTE: ${missing.length} ref(s) not found in render-assets OR shared assets — confirm these are generated into render-assets:`);
      for (const r of missing) console.log(`    - ${r}`);
    }
  }

  console.log(`\nRender this batch with:\n  --public-dir video-creation/shorts/${batch}/render-assets`);
}

main();

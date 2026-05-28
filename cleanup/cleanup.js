'use strict';

// Multi-target asset cleaner. Moves no-longer-needed assets to the Windows
// Recycle Bin (never hard-deletes). Each target supplies its own eligibility
// policy in ./targets/<name>.js; this engine handles CLI, reporting, and the move.
//
// Usage:
//   node cleanup/cleanup.js --target <name|all> [--dry-run] [--age-days N]
//
//   --target      schedule-tweets | video-creation | all   (required)
//   --dry-run     show what would be recycled; move nothing
//   --age-days N  age threshold for the video-creation target (default 30)
//
// Recycling is reversible (Recycle Bin), but always run --dry-run first.

const path = require('path');
const lib = require('./lib');

const REPO_ROOT = path.resolve(__dirname, '..');
const TARGETS = {
  'schedule-tweets': require('./targets/schedule-tweets'),
  'video-creation': require('./targets/video-creation'),
};

function parseArgs(argv) {
  const opts = { target: null, dryRun: false, ageDays: 30, only: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--target' || a === '-t') opts.target = argv[++i];
    else if (a.startsWith('--target=')) opts.target = a.split('=')[1];
    else if (a === '--age-days') opts.ageDays = parseInt(argv[++i], 10);
    else if (a.startsWith('--age-days=')) opts.ageDays = parseInt(a.split('=')[1], 10);
    else if (a === '--only') opts.only = argv[++i];
    else if (a.startsWith('--only=')) opts.only = a.split('=')[1];
  }
  return opts;
}

function usage(msg) {
  if (msg) console.error('ERROR: ' + msg + '\n');
  console.error('Usage: node cleanup/cleanup.js --target <schedule-tweets|video-creation|all> [--dry-run] [--age-days N] [--only <path-substring>]');
  process.exit(msg ? 2 : 0);
}

function runTarget(name, opts) {
  let { recycle, skipped } = TARGETS[name].plan({ repoRoot: REPO_ROOT, ageDays: opts.ageDays });
  if (opts.only) {
    const needle = opts.only.replace(/\\/g, '/').toLowerCase();
    const rel = (p) => path.relative(REPO_ROOT, p).replace(/\\/g, '/').toLowerCase();
    const match = (e) => rel(e.path).includes(needle);
    recycle = recycle.filter(match);
    skipped = skipped.filter(match);
    console.log(`  (filtered to paths matching "${opts.only}")`);
  }
  const totalBytes = recycle.reduce((sum, r) => sum + lib.sizeOf(r.path), 0);

  console.log(`\n=== target: ${name} ===`);
  console.log(`  eligible to recycle : ${recycle.length}  (${lib.fmtBytes(totalBytes)})`);
  console.log(`  skipped (kept)      : ${skipped.length}`);

  if (recycle.length) {
    console.log('\n  Would recycle:');
    for (const r of recycle) {
      console.log(`    ${path.relative(REPO_ROOT, r.path)}  — ${r.reason}`);
    }
  }

  if (opts.dryRun) {
    console.log(recycle.length ? '\n  [dry-run] nothing moved.' : '\n  Nothing to recycle.');
    return { moved: 0, bytes: 0 };
  }
  if (recycle.length === 0) {
    console.log('\n  Nothing to recycle.');
    return { moved: 0, bytes: 0 };
  }

  console.log('\n  Moving to Recycle Bin...');
  const ok = lib.recyclePaths(recycle.map(r => r.path));
  if (!ok) { console.error('  Recycle Bin operation FAILED.'); process.exitCode = 1; return { moved: 0, bytes: 0 }; }
  console.log(`  Done. Recycled ${recycle.length} item(s), freed ~${lib.fmtBytes(totalBytes)}.`);
  return { moved: recycle.length, bytes: totalBytes };
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (!opts.target) usage('--target is required');
  if (opts.target !== 'all' && !TARGETS[opts.target]) usage(`unknown target "${opts.target}"`);
  if (Number.isNaN(opts.ageDays) || opts.ageDays < 0) usage('--age-days must be a non-negative integer');

  if (opts.dryRun) console.log('[DRY RUN] No files will be moved.');
  const names = opts.target === 'all' ? Object.keys(TARGETS) : [opts.target];

  let totalMoved = 0, totalBytes = 0;
  for (const name of names) {
    const r = runTarget(name, opts);
    totalMoved += r.moved; totalBytes += r.bytes;
  }
  if (names.length > 1 && !opts.dryRun) {
    console.log(`\n=== total: recycled ${totalMoved} item(s), freed ~${lib.fmtBytes(totalBytes)} ===`);
  }
}

main();

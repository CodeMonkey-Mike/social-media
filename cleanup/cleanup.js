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
const fs = require('fs');
const { spawnSync } = require('child_process');
const lib = require('./lib');

const REPO_ROOT = path.resolve(__dirname, '..');

// Keep batch lifecycle status fresh before planning. The video-creation target
// PROTECTS active batches and RECYCLES completed ones, so a finished batch still
// flagged `active` would wrongly shield its source artifacts (and a never-reconciled
// batch never gets reclaimed). Run the reconciler first so cleanup always acts on
// current status; in --dry-run it runs in dry mode too (reports drift, writes nothing).
function syncBatchStatus(dryRun) {
  const script = path.join(REPO_ROOT, 'scripts', 'reconcile-batch-status.js');
  if (!fs.existsSync(script)) return;
  console.log(`\n--- syncing batch status (reconcile-batch-status.js${dryRun ? ' --dry-run' : ''}) ---`);
  const args = [script];
  if (dryRun) args.push('--dry-run');
  const res = spawnSync(process.execPath, args, { stdio: 'inherit', cwd: REPO_ROOT });
  if (res.status !== 0) console.error('  WARNING: reconcile failed; proceeding with existing batches.json status.');
}
// ChatGPT image chats are cleaned alongside files: a chat tied (via its `batch` property in
// chatgpt-image-chats.json) to a completed/archived batch is deleted in the ChatGPT UI, plus any
// rotation leftovers on the registry's `retired` list. The browser work lives in
// repurpose/delete-chats.js (next to the other ChatGPT Playwright code) — this engine only spawns
// it. It opens the shared chatgpt-profile Chrome briefly on a LIVE run (never in --dry-run), so
// don't run a live cleanup while an image-gen batch is in flight; a locked profile fails loudly
// and the chats stay queued for the next run.
function runChatCleanup(dryRun) {
  const script = path.join(REPO_ROOT, 'repurpose', 'delete-chats.js');
  if (!fs.existsSync(script)) return;
  console.log(`\n--- ChatGPT image chats (repurpose/delete-chats.js${dryRun ? ' --dry-run' : ''}) ---`);
  const args = [script];
  if (dryRun) args.push('--dry-run');
  const res = spawnSync(process.execPath, args, { stdio: 'inherit', cwd: REPO_ROOT });
  if (res.status !== 0) console.error('  WARNING: chat deletion incomplete (profile busy or UI drift); retired chats stay queued for the next run.');
}
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
  let { recycle, skipped, pruneRoots = [], pruneSkipDirs = [] } = TARGETS[name].plan({ repoRoot: REPO_ROOT, ageDays: opts.ageDays });
  if (opts.only) {
    const needle = opts.only.replace(/\\/g, '/').toLowerCase();
    const rel = (p) => path.relative(REPO_ROOT, p).replace(/\\/g, '/').toLowerCase();
    const match = (e) => rel(e.path).includes(needle);
    recycle = recycle.filter(match);
    skipped = skipped.filter(match);
    console.log(`  (filtered to paths matching "${opts.only}")`);
  }

  // Empty-folder prune: any directory under the target's pruneRoots that will be left with no
  // files once the planned recycle set is removed is itself recycled, so we never strand the
  // empty <batch>/ folders behind cleaned-out files. Computed against the (post-filter) recycle
  // set so dry-run reports them and the real run removes them in the same single move.
  if (pruneRoots.length) {
    const removed = new Set(recycle.map(r => r.path.toLowerCase()));
    const skipSet = new Set(pruneSkipDirs.map(d => d.toLowerCase()));
    let emptyDirs = lib.findEmptyDirs(pruneRoots, { skipDirs: skipSet, removed });
    if (opts.only) {
      const needle = opts.only.replace(/\\/g, '/').toLowerCase();
      emptyDirs = emptyDirs.filter(d => path.relative(REPO_ROOT, d).replace(/\\/g, '/').toLowerCase().includes(needle));
    }
    for (const d of emptyDirs) recycle.push({ path: d, reason: 'empty folder (no files remain after cleanup)' });
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

  // The video-creation target's eligibility depends on batches.json status — sync it first.
  if (names.includes('video-creation')) syncBatchStatus(opts.dryRun);

  let totalMoved = 0, totalBytes = 0;
  for (const name of names) {
    const r = runTarget(name, opts);
    totalMoved += r.moved; totalBytes += r.bytes;
  }

  // Chat cleanup rides with the video-creation target (its batch lifecycle drives eligibility).
  // Skipped under --only: that's a folder-scoped file run, and chats aren't paths.
  if (names.includes('video-creation') && !opts.only) runChatCleanup(opts.dryRun);

  if (names.length > 1 && !opts.dryRun) {
    console.log(`\n=== total: recycled ${totalMoved} item(s), freed ~${lib.fmtBytes(totalBytes)} ===`);
  }
}

main();

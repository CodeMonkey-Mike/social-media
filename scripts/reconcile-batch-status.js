#!/usr/bin/env node
/**
 * reconcile-batch-status.js — derive each batch's lifecycle status from the queues.
 *
 * The single source of truth for whether a batch is finished is the publishing state in
 * schedule-tweets/data/{shorts,longs}.json — NOT the hand-maintained pipeline flags (which
 * drift: a batch can read `pipelines.shorts: "active"` long after all its shorts posted).
 * This script recomputes batches.json `status` from the queues so cleanup can reclaim a
 * batch's source artifacts the moment it is fully published, and never before.
 *
 * Status it writes (top-level `batches[].status`):
 *   active     — still has unposted shorts/longs, OR nothing queued yet, OR repurpose pending.
 *                cleanup PROTECTS an active batch's directories.
 *   completed  — every queued short AND long for this batch is posted everywhere, and the
 *                repurpose lane is done. cleanup may RECLAIM it. (Replaces the old "archived";
 *                cleanup still honours "archived" as a synonym for back-compat.)
 *
 * Completion rule — a batch is `completed` iff ALL of:
 *   1. it has at least one queued item (short or long) carrying its batch id  — guards against
 *      marking a produced-but-never-published batch complete;
 *   2. every queued short with batch==<id> is fully posted (no platform pending/posting/failed);
 *   3. every queued long  with batch==<id> is fully posted;
 *   4. pipelines.repurpose is not "pending" (the transcript is still needed by the tweet/image
 *      lane until repurpose is done — completing early would let cleanup recycle it).
 *
 * NOTE: the queue is treated as the publish manifest. Clips rendered but never staged to
 * shorts.json are invisible here — stage them, or the batch may complete without them.
 *
 * MANUAL OVERRIDE: a batch that never flows through the queues (e.g. a longform uploaded by
 * hand, never staged to longs.json) can't be derived and would stay `active` forever. Set
 * `manual_status` ("completed"|"active") on that batch and this script honors it verbatim,
 * skipping derivation — so reconcile never reverts the hand-set value.
 *
 * Usage:
 *   node scripts/reconcile-batch-status.js [--dry-run]
 *   --dry-run : print the table + the flips it WOULD make, write nothing.
 */
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const BATCHES = path.join(REPO_ROOT, 'batches.json');
const SHORTS = path.join(REPO_ROOT, 'schedule-tweets', 'data', 'shorts.json');
const LONGS = path.join(REPO_ROOT, 'schedule-tweets', 'data', 'longs.json');

const DRY = process.argv.includes('--dry-run');

// A platform slot is "done" in any of these terminal states; everything else
// (pending / posting / failed) means the item is not fully published yet.
const DONE = new Set(['posted', 'posted_unverified', 'skip', 'skipped']);
const itemPosted = (it) =>
  Object.values(it.platforms || {}).every((p) => DONE.has(p && p.status));

function main() {
  const reg = JSON.parse(fs.readFileSync(BATCHES, 'utf8'));
  const shorts = (JSON.parse(fs.readFileSync(SHORTS, 'utf8')).shorts) || [];
  const longs = (JSON.parse(fs.readFileSync(LONGS, 'utf8')).longs) || [];

  const rows = [];
  const flips = [];

  for (const b of reg.batches) {
    const sh = shorts.filter((s) => s.batch === b.batch);
    const lo = longs.filter((l) => l.batch === b.batch);
    const shPending = sh.filter((s) => !itemPosted(s)).length;
    const loPending = lo.filter((l) => !itemPosted(l)).length;

    // Manual override. Some batches never flow through the queues (e.g. a longform
    // published by hand, never staged to longs.json) so completion can't be derived
    // from the publish manifest — derivation would peg them `active` forever. A human
    // sets `manual_status` ("completed"|"active") and the reconciler honors it verbatim,
    // so a later run never reverts the hand-set value.
    if (b.manual_status) {
      rows.push({
        batch: b.batch,
        shorts: `${sh.length - shPending}/${sh.length}`,
        longs: `${lo.length - loPending}/${lo.length}`,
        repurpose: (b.pipelines && b.pipelines.repurpose) || '-',
        from: b.status,
        to: b.manual_status,
        why: 'manual_status (locked)',
      });
      if (b.status !== b.manual_status) flips.push({ batch: b.batch, from: b.status, to: b.manual_status });
      b.status = b.manual_status;
      continue;
    }

    const hasItems = sh.length + lo.length > 0;
    const repurposePending = !!(b.pipelines && b.pipelines.repurpose === 'pending');

    let completed = true;
    const why = [];
    if (!hasItems) { completed = false; why.push('no queued items'); }
    if (shPending) { completed = false; why.push(`${shPending} short(s) pending`); }
    if (loPending) { completed = false; why.push(`${loPending} long(s) pending`); }
    if (repurposePending) { completed = false; why.push('repurpose pending'); }

    const newStatus = completed ? 'completed' : 'active';
    rows.push({
      batch: b.batch,
      shorts: `${sh.length - shPending}/${sh.length}`,
      longs: `${lo.length - loPending}/${lo.length}`,
      repurpose: (b.pipelines && b.pipelines.repurpose) || '-',
      from: b.status,
      to: newStatus,
      why: completed ? 'fully posted' : why.join(', '),
    });
    if (b.status !== newStatus) flips.push({ batch: b.batch, from: b.status, to: newStatus });
    b.status = newStatus;
  }

  // ---- report ----
  const pad = (s, n) => String(s).padEnd(n);
  console.log(
    pad('batch', 20), pad('shorts✓', 9), pad('longs✓', 8), pad('repurpose', 11),
    pad('status', 11), '  reason'
  );
  console.log('-'.repeat(86));
  for (const r of rows) {
    const arrow = r.from === r.to ? r.to : `${r.from} -> ${r.to}`;
    console.log(pad(r.batch, 20), pad(r.shorts, 9), pad(r.longs, 8), pad(r.repurpose, 11),
      pad(arrow, 11), '  ' + r.why);
  }
  console.log('-'.repeat(86));

  if (!flips.length) {
    console.log('No status changes — batches.json already in sync.');
    return;
  }
  console.log(`${DRY ? '[DRY RUN] would flip' : 'Flipping'} ${flips.length} batch(es):`);
  for (const f of flips) console.log(`  ${f.batch}: ${f.from} -> ${f.to}`);

  if (DRY) {
    console.log('\n[DRY RUN] no file written. Re-run without --dry-run to apply.');
    return;
  }
  fs.writeFileSync(BATCHES, JSON.stringify(reg, null, 2) + '\n', 'utf8');
  console.log(`\nWrote ${BATCHES}`);
}

main();

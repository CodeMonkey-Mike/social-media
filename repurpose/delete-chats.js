'use strict';
// delete-chats.js — delete no-longer-needed ChatGPT image chats (registry: ../chatgpt-image-chats.json).
//
// Two sources feed the deletion plan:
//   1. `retired` list — chats the gen scripts rotated out (or marked dead) but failed to delete in
//      their own end-of-run sweep. They stay queued here until a sweep succeeds.
//   2. batch completion — a chat whose `batch` is completed/archived in ../batches.json is retired
//      and deleted. Chats with NO `batch` (evergreen purposes: x-tweets, yt-posts, broll, ...) are
//      never touched here (they rotate + self-delete at the cap), and a `batch` matching no
//      batches.json entry is kept (same convention as cleanup's file policies).
//
// Invoked automatically by `cleanup/cleanup.js` after every video-creation run (dry-run included).
// Deletion is safe: images are downloaded at generation time; a chat holds nothing we need.
//
// Usage: node repurpose/delete-chats.js [--dry-run] [--retire <purpose>]...
//   --dry-run          print the plan; the browser never opens and the registry is not touched
//   --retire <purpose> also queue a specific purpose's active chat (one-offs without a batch id)
//
// NOTE: opens the shared chatgpt-profile Chrome — do NOT run while an image-gen batch is in flight
// (same one-browser-per-profile rule as posting). A locked profile fails the launch loudly and
// everything stays queued for the next run.
const fs = require('fs');
const path = require('path');
const pool = require('./chat-pool');

const PROFILE_DIR = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\chatgpt-profile';
const BATCHES = path.join(__dirname, '..', 'batches.json');

function parseArgs(argv) {
  const opts = { dryRun: false, retire: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--retire') opts.retire.push(argv[++i]);
    else if (a.startsWith('--retire=')) opts.retire.push(a.split('=')[1]);
  }
  return opts;
}

function batchStatusMap() {
  try {
    const raw = JSON.parse(fs.readFileSync(BATCHES, 'utf8'));
    const arr = Array.isArray(raw) ? raw : raw.batches || [];
    return new Map(arr.filter(b => b.batch).map(b => [String(b.batch).toLowerCase(), b.status]));
  } catch (e) {
    console.warn('  WARNING: could not read batches.json — batch-completion retirement skipped.');
    return new Map();
  }
}

const TERMINAL = new Set(['completed', 'archived']);

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const reg = pool.status();
  const statuses = batchStatusMap();

  // Plan: already-retired leftovers + healable title-gate refusals + batch-completed actives +
  // explicitly requested purposes.
  const plan = [];
  for (const c of reg.retired) plan.push({ ...c, why: c.reason || 'previously retired' });
  // Gate-skipped chats WITH verified-rename provenance (a recorded gated title): ChatGPT's
  // auto-title overwrote our rename. The sweep's healTitles() re-renames + requeues + deletes
  // them; they belong on the plan so the browser opens for them. No-provenance entries stay
  // strictly human-decision.
  for (const c of reg.title_gate_skipped || []) {
    if (c.title && pool.TITLE_GATE_RE.test(c.title)) {
      plan.push({ ...c, why: 'gate-skipped, healable (title drifted off the verified rename)' });
    }
  }
  const toRetire = [];
  for (const c of reg.chats) {
    const st = c.batch ? statuses.get(String(c.batch).toLowerCase()) : null;
    if (c.batch && TERMINAL.has(st)) {
      toRetire.push({ chat: c, reason: `batch ${c.batch} ${st}` });
      plan.push({ ...c, why: `batch ${c.batch} ${st}` });
    } else if (opts.retire.includes(c.purpose)) {
      toRetire.push({ chat: c, reason: 'retired on request (--retire)' });
      plan.push({ ...c, why: 'retired on request (--retire)' });
    }
  }
  const kept = reg.chats.filter(c => !toRetire.some(t => t.chat.url === c.url));

  if (!plan.length) {
    console.log(`  No chats to delete. (${kept.length} active chat(s) kept.)`);
    return;
  }
  console.log(`  ${opts.dryRun ? 'Would delete' : 'Deleting'} ${plan.length} chat(s):`);
  for (const p of plan) console.log(`    ${(p.purpose || '?').padEnd(30)} — ${p.why}\n      ${p.url}`);
  console.log(`  Keeping ${kept.length} active chat(s) (evergreen, active batch, or unregistered batch).`);

  if (opts.dryRun) { console.log('\n  [dry-run] nothing deleted, registry untouched.'); return; }

  // Persist the retirements, then sweep the whole retired list in one browser session.
  for (const t of toRetire) pool.retire(t.chat.purpose, t.reason);

  const { chromium } = require('playwright');
  let browser;
  try {
    browser = await chromium.launchPersistentContext(PROFILE_DIR, {
      channel: 'chrome', headless: false, ignoreDefaultArgs: ['--enable-automation'],
      args: ['--disable-blink-features=AutomationControlled'], viewport: null,
    });
  } catch (e) {
    console.error('  ERROR: could not open the chatgpt-profile browser (in use by an image-gen run?).');
    console.error('  ' + e.message.split('\n')[0]);
    console.error('  Retired chats stay queued; re-run later: node repurpose/delete-chats.js');
    process.exit(1);
  }
  try {
    const page = await browser.newPage();
    // Land on the chatgpt.com origin BEFORE sweeping. deleteChat's title-gate pre-check runs
    // `fetch('/api/auth/session')` — a RELATIVE url — and it runs BEFORE the per-chat goto, so on
    // a fresh about:blank page it has no origin to resolve against and every chat dies with
    // "pre-check HTTP 0 no access token" regardless of login state. The image-gen callers never
    // hit this because they pass an already-navigated authed page. (Mike 2026-07-28)
    await page.goto('https://chatgpt.com/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    const { failed } = await require('./chat-delete').sweepRetired(page);
    if (failed > 0) process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

main().catch(e => { console.error(e); process.exit(1); });

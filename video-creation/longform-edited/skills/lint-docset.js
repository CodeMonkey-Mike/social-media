#!/usr/bin/env node
/*
 * lint-docset.js — PRE-BUILD GATE for a longform-edited video's document set.
 *
 * Enforces, in CODE (not memory), the things that keep getting bypassed before the comp build:
 *   1. the comp-build.md §13 required document set exists + is non-stub + has its mandatory sections
 *   2. the spine/ folder + naming convention (§13a) — nothing loose in the project root
 *   3. ORDER: CUE-SHEET / EDIT-PLAN can only exist after the word-level transcript (they're timecoded off it)
 *   4. no invented / non-canonical docs (WARN — e.g. a stray DOSSIER.md)
 *
 * This is the sibling of lint-covers.js (pre-RENDER gate); this is the pre-BUILD gate. A FAIL means the
 * comp must NOT be built until fixed. Wire it as the first step of comp-build (§12) and, ideally, a
 * PreToolUse hook on the render command so the harness runs it, not a human.
 *
 * Usage:  node video-creation/longform-edited/skills/lint-docset.js <media/<project> dir>
 * Exit:   0 = PASS (may have WARNs) · 1 = FAIL (blocking) · 2 = bad usage
 */
'use strict';
const fs = require('fs');
const path = require('path');

const projArg = process.argv[2];
if (!projArg) { console.error('usage: node lint-docset.js <media/<project> dir>'); process.exit(2); }
const dir = path.resolve(projArg);
if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) { console.error(`FAIL: not a directory: ${dir}`); process.exit(2); }

const fails = [], warns = [], ok = [];
const read = (f) => { try { return fs.readFileSync(path.join(dir, f), 'utf8'); } catch { return null; } };
const exists = (f) => fs.existsSync(path.join(dir, f));

// 1. Required document set (comp-build.md §13) + the mandatory section(s) each must carry.
const REQUIRED = {
  'SCREENPLAY.md':     [/#/],
  'AS-RECORDED.md':    [/face|as-?built|as-?recorded/i],
  'DATA.md':           [/chart-source index/i],
  'BROLL-PLAN.md':     [/envato/i, /chatgpt|image/i],
  'TRANSITIONS.md':    [/chapter|card/i, /glitch|badsignal|library/i, /face/i],           // the 3 buckets
  'EDIT-PLAN-prep.md': [/beat|prep|layer/i],
  'EDIT-PLAN.md':      [/time-?ordered|event log/i],
  'CUE-SHEET.md':      [/##\s*FACE spans/i, /##\s*TRANSITIONS/i, /##\s*MUSIC beds/i],      // TRANSITIONS section = the kaspa-covenants miss
  'PROJECT-LOG.md':    [/#/],
};
for (const [f, patterns] of Object.entries(REQUIRED)) {
  const txt = read(f);
  if (txt === null) { fails.push(`MISSING required doc: ${f}`); continue; }
  if (txt.trim().length < 60) { fails.push(`STUB doc (too short): ${f}`); continue; }
  const missing = patterns.filter((re) => !re.test(txt));
  if (missing.length) fails.push(`${f}: missing required section/marker ${missing.map(String).join(' , ')}`);
  else ok.push(f);
}
// MUSIC-PLAN.json (music-placement-strategist output) — required + must parse.
const mp = read('MUSIC-PLAN.json');
if (mp === null) fails.push('MISSING MUSIC-PLAN.json');
else { try { JSON.parse(mp); ok.push('MUSIC-PLAN.json'); } catch (e) { fails.push(`MUSIC-PLAN.json invalid JSON: ${e.message}`); } }

// 2. Non-canonical docs in the project root (WARN — invented files are how conventions drift).
const CANON = new Set(Object.keys(REQUIRED));
for (const f of fs.readdirSync(dir)) {
  if (f.endsWith('.md') && !CANON.has(f)) warns.push(`non-canonical doc in root: ${f}  (verified research belongs in DATA.md — comp-build §13)`);
}

// 3. spine/ folder + naming (comp-build §13a) + ORDER gate.
if (!fs.existsSync(path.join(dir, 'spine'))) {
  fails.push('MISSING spine/ folder (spine-prep intermediates live here — comp-build §13a)');
} else {
  const sf = fs.readdirSync(path.join(dir, 'spine'));
  if (!sf.some((f) => /\.(desilenced|final|paused)\.mp4$/i.test(f))) warns.push('spine/: no *.desilenced/final/paused .mp4 (the final spine)');
  const hasWords = sf.some((f) => /\.medium-words\.json$/i.test(f));
  if ((exists('CUE-SHEET.md') || exists('EDIT-PLAN.md')) && !hasWords)
    fails.push('ORDER: CUE-SHEET/EDIT-PLAN exist but no *.medium-words.json transcript in spine/ — they MUST be timecoded off the transcript (build to the transcript, not the screenplay)');
}
// spine intermediates loose in the project root = the "dumped in root" bug.
for (const f of fs.readdirSync(dir)) {
  if (f === 'spine' || f === 'raw') continue;
  if (/\.(defumbled|blackout|blacked|desilenced|cleaned|paused)\.[^/]*\.(mp4|json|txt)$/i.test(f) ||
      /^\d{4}-\d\d-\d\d \d\d-\d\d-\d\d\./.test(f))
    fails.push(`spine intermediate loose in project root: ${f}  (belongs in spine/ — comp-build §13a)`);
}

// report
const bar = '-'.repeat(64);
console.log(`\nlint-docset — ${path.basename(dir)}\n${bar}`);
ok.forEach((f) => console.log(`  ok    ${f}`));
warns.forEach((w) => console.log(`  WARN  ${w}`));
fails.forEach((f) => console.log(`  FAIL  ${f}`));
console.log(bar);
if (fails.length) { console.log(`FAIL: ${fails.length} blocking issue(s) — do NOT build the comp until fixed.\n`); process.exit(1); }
console.log(`PASS${warns.length ? ` (review ${warns.length} warning(s))` : ''} — document set complete, safe to build the comp.\n`); process.exit(0);

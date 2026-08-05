#!/usr/bin/env node
/*
 * lint-slide-balance.js — MECHANICAL pre-render gate for "⛔ THE BALANCE" (broll-and-containers.md).
 *
 * The chronic longform-edited struggle is swinging to an extreme: either repeating one info-dense full
 * diagram slide over and over, or over-correcting and deleting the slides for all-containers. This gate
 * fails the render if either extreme is present, so the swing can't ship silently.
 *
 * The rule it enforces: a rich full diagram slide (kind 'deck') is shown ONCE as the section overview,
 * then BROKEN UP into spotlight containers (kind 'container'). Slides + containers COEXIST.
 *
 * Usage:  node lint-slide-balance.js <comp.tsx>
 * Exit 0 = balanced (warnings allowed), 1 = FAIL (fix before render), 2 = could not parse.
 */
const fs = require('fs');
const file = process.argv[2];
if (!file) { console.error('usage: node lint-slide-balance.js <comp.tsx>'); process.exit(2); }
let src = fs.readFileSync(file, 'utf8');

// A derived comp (e.g. the VERTICAL cut) imports COVERS from its 16:9 parent so the two cannot
// drift — follow the import and lint the declaring file.
if (!/COVERS\s*:\s*Cover\[\]\s*=\s*\[/.test(src)) {
  const imp = src.match(/import\s*\{[^}]*\bCOVERS\b[^}]*\}\s*from\s*['"]\.\/([\w.-]+)['"]/);
  if (imp) {
    const p2 = require('path').join(require('path').dirname(file), imp[1].replace(/\.tsx?$/, '') + '.tsx');
    if (fs.existsSync(p2)) {
      console.log(`  note  COVERS imported from ./${imp[1]} — linting that file's table.`);
      src = fs.readFileSync(p2, 'utf8');
    }
  }
}

const m = src.match(/COVERS\s*:\s*Cover\[\]\s*=\s*\[([\s\S]*?)\n\];/);
if (!m) { console.error('lint-slide-balance: could not find `const COVERS: Cover[] = [...]` in ' + file); process.exit(2); }
const covers = [];
// Trailing fields are REQUIRED by the other gates (comp-build §5: every deck row declares a
// `state`; lint-covers reads lead/cap too), so the row shape is `{tIn, tOut, kind, ref, ...}` —
// matching only rows that END at `ref` silently parsed 0 covers and exited 2 (kaspa 30bps).
const re = /\{\s*tIn:\s*([\d.]+),\s*tOut:\s*([\d.]+),\s*kind:\s*'([^']+)',\s*ref:\s*'([^']+)'[^}]*\}/g;
let mm;
while ((mm = re.exec(m[1]))) covers.push({ tIn: +mm[1], tOut: +mm[2], kind: mm[3], ref: mm[4] });
if (!covers.length) { console.error('lint-slide-balance: parsed 0 covers from COVERS array'); process.exit(2); }

// chapter boundaries from CARD_T (title-card chapter starts), if present
const ct = src.match(/CARD_T\s*=\s*\[([^\]]*)\]/);
const cardT = ct ? ct[1].split(',').map((s) => parseFloat(s)).filter((x) => !isNaN(x)) : [];
const bounds = [0, ...cardT, Infinity];

const fails = [], warns = [];
const nDeck = covers.filter((c) => c.kind === 'deck').length;
const nCont = covers.filter((c) => c.kind === 'container').length;

// RULE A — a full diagram slide (kind 'deck') appears at most ONCE. A repeated full slide is the
// "showing it over and over" violation; break the repeats into spotlight containers instead.
const deckCount = {};
covers.filter((c) => c.kind === 'deck').forEach((c) => { deckCount[c.ref] = (deckCount[c.ref] || 0) + 1; });
Object.entries(deckCount).forEach(([ref, n]) => {
  if (n > 1) fails.push(`repeated full slide: deck '${ref}' shown ${n}x. Show it ONCE, then break it up into spotlight containers.`);
});

// RULE B — slides + containers must COEXIST. All one, none of the other, is the swing.
if (nDeck > 0 && nCont === 0) fails.push('ALL full-slides, ZERO break-up containers. Break each rich slide into spotlight containers.');
if (nCont > 0 && nDeck === 0) fails.push('ALL containers, ZERO full diagram slides. Restore a rich overview slide as each section anchor.');

// RULE C (WARN) — a chapter whose cover beats are ALL one kind is monotonous, usually a local swing.
for (let i = 0; i < bounds.length - 1; i++) {
  const inCh = covers.filter((c) => c.tIn >= bounds[i] && c.tIn < bounds[i + 1]);
  if (inCh.length >= 3 && new Set(inCh.map((c) => c.kind)).size === 1) {
    warns.push(`chapter @${bounds[i]}s: all ${inCh.length} covers are '${inCh[0].kind}'. Mix a slide + containers + b-roll.`);
  }
}

console.log(`lint-slide-balance: ${covers.length} covers, ${nDeck} full-slide(s), ${nCont} container(s).`);
warns.forEach((w) => console.log('  WARN ' + w));
if (fails.length) { fails.forEach((f) => console.log('  FAIL ' + f)); console.log('  => fix before render (⛔ THE BALANCE in broll-and-containers.md).'); process.exit(1); }
console.log('  OK — balance holds: rich slides shown once, broken into containers, both present.');
process.exit(0);

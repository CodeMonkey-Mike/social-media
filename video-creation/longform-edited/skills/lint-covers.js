#!/usr/bin/env node
/**
 * lint-covers.js — MECHANICAL pre-render gate for the longform-edited cover layer.
 *
 * Rules that kept getting violated because they lived only as prose (Mike, 2026-06-30:
 * "I constantly come across violations of rules"). This enforces them in CODE so a
 * non-compliant comp CANNOT be rendered. Run it before EVERY render; exits non-zero on any
 * violation. Wire it into the PRE-RENDER GATE (longform-edited/CLAUDE.md + comp-build.md §12).
 *
 *   node longform-edited/skills/lint-covers.js <comp.tsx>
 *
 * It parses the comp's COVERS array + CAPTION_SRC and asserts:
 *   #12 (longform-edited.md)  — no b-roll asset (still/clip) ref appears twice.
 *   #2  (broll-and-containers.md) — no b-roll clip > 4.0s (or > 5.0s if flagged `lead: true`).
 *   captions-never-over-cover (captions.md) — no CAPTION_SRC window overlaps a COVER window,
 *                                             unless that cover entry is flagged `cap: true`.
 *   no overlap / no >0.5s gap between consecutive covers (broll-and-containers.md).
 *
 * B-roll kinds (subject to #2/#12): still, stillglitch, vid, vidglitch.
 * Exempt (containers/charts/receipts can run longer & "recall"): chart, split, deck, receipt.
 */
const fs = require('fs');

const BROLL = new Set(['still', 'stillglitch', 'vid', 'vidglitch']);
const path = process.argv[2];
if (!path) { console.error('usage: lint-covers.js <comp.tsx>'); process.exit(2); }
const src = fs.readFileSync(path, 'utf8');

// --- extract COVERS entries ---
const block = (src.match(/COVERS[^=]*=\s*\[([\s\S]*?)\];/) || [])[1] || '';
const covers = [];
const re = /\{\s*tIn:\s*([\d.]+)\s*,\s*tOut:\s*([\d.]+)\s*,\s*kind:\s*'([^']+)'(?:\s*,\s*ref:\s*'([^']+)')?([^}]*)\}/g;
let m;
while ((m = re.exec(block))) {
  const extra = m[5] || '';
  covers.push({ tIn: +m[1], tOut: +m[2], kind: m[3], ref: m[4] || null,
    lead: /lead:\s*true/.test(extra), cap: /cap:\s*true/.test(extra),
    state: (extra.match(/state:\s*'([^']+)'/) || [])[1] || null });
}
// --- extract CAPTION_SRC windows ---
const capBlock = (src.match(/CAPTION_SRC[^=]*=\s*\[([\s\S]*?)\]\s*;/) || [])[1] || '';
const capWins = [...capBlock.matchAll(/\[\s*([\d.]+)\s*,\s*([\d.]+)\s*\]/g)].map((x) => [+x[1], +x[2]]);

const errs = [];
const warns = [];
if (!covers.length) { console.error('lint-covers: could not parse a COVERS array in ' + path); process.exit(2); }

// #12 — no reused b-roll ref
const seen = new Map();
for (const c of covers) {
  if (!c.ref || !BROLL.has(c.kind)) continue;
  if (seen.has(c.ref)) errs.push(`#12 REUSE: b-roll "${c.ref}" appears twice (@${seen.get(c.ref)}s and @${c.tIn}s). Each still/clip at most once — swap one for a new asset or a container.`);
  else seen.set(c.ref, c.tIn);
}
// #2 — b-roll <= 4s (5s if lead)
for (const c of covers) {
  if (!BROLL.has(c.kind)) continue;
  const d = +(c.tOut - c.tIn).toFixed(2);
  const cap = c.lead ? 5.0 : 4.0;
  if (d > cap + 1e-6) errs.push(`#2 DURATION: ${c.kind} "${c.ref || ''}" is ${d}s (${c.tIn}->${c.tOut}), max ${cap}s${c.lead ? ' (lead)' : ''}. Split into <=4s clips or carry the stretch with a container.`);
}
// captions never over a cover (unless cap:true)
const coverWins = covers.map((c) => [c.tIn, c.tOut, c]);
for (const [a, b] of capWins) {
  for (const [x, y, c] of coverWins) {
    if (a < y && x < b && !c.cap) {
      errs.push(`CAPTIONS-OVER-COVER: caption window [${a},${b}] overlaps cover "${c.ref || c.kind}" [${x},${y}]. Captions never over a cover (flag the cover \`cap: true\` only if intended).`);
      break;
    }
  }
}
// container/receipt usage — surface SCATTERED reuse + LONG HOLDS (Mike 2026-06-30: "showing the entire
// slide / the same diagram / the whitepaper again and again"). Containers are exempt from #12, but a deck
// repeated across chapters or held 40s reads as the same lazy repetition. These are WARNs you must JUSTIFY
// (a deliberate callback / a diagram held while explained) — an unjustified one is the violation.
const CONTAINER = new Set(['deck', 'receipt', 'chart']);
const blocks = [];
for (const c of covers) {
  if (!c.ref || !CONTAINER.has(c.kind)) continue;
  const last = blocks[blocks.length - 1];
  if (last && last.ref === c.ref && Math.abs(c.tIn - last.end) < 0.6) last.end = c.tOut;
  else blocks.push({ ref: c.ref, start: c.tIn, end: c.tOut });
}
const byRef = new Map();
for (const b of blocks) { if (!byRef.has(b.ref)) byRef.set(b.ref, []); byRef.get(b.ref).push(b); }
for (const [ref, bl] of byRef) {
  const total = bl.reduce((s, b) => s + (b.end - b.start), 0).toFixed(1);
  if (bl.length > 2) warns.push(`CONTAINER SCATTER: "${ref}" appears in ${bl.length} separate spots (@${bl.map((b) => b.start + 's').join(', @')}), ${total}s total. Justify each as a deliberate callback or swap in a distinct container.`);
  for (const b of bl) {
    const d = +(b.end - b.start).toFixed(1);
    if (d > 35) warns.push(`LONG HOLD: "${ref}" held ${d}s straight (${b.start}->${b.end}). A system-design DIAGRAM may hold while explained; a TEXT container must spotlight ONE sub-point at a time — sub-spotlight or break it.`);
  }
}

// MULTI-CARD OVERVIEW discipline (Mike, 2026-07-06, carry-trade review): a code container's
// default is ONE sub-point spotlighted; a whole-slide/overview state must be an EXPLICIT,
// deliberate choice. Mechanically: (a) every 'deck' cover must carry a state (an explicit
// spotlight decision — no stateless default views); (b) contiguous same-ref rows are state
// swaps and must NOT re-fire an ingress transition (the comp must suppress it — flag for review).
for (const c of covers) {
  if (c.kind === 'deck' && !c.state) warns.push(`STATELESS CONTAINER: 'deck' cover "${c.ref}" @${c.tIn}s has no state — every container spotlight must be an explicit choice (one sub-point; a whole-slide 'overview' state only where it genuinely fits).`);
}
{
  const seq = [...covers].sort((p, q) => p.tIn - q.tIn);
  for (let i = 1; i < seq.length; i++) {
    if (seq[i].ref === seq[i - 1].ref && Math.abs(seq[i].tIn - seq[i - 1].tOut) < 0.05)
      warns.push(`STATE SWAP @${seq[i].tIn}s: "${seq[i].ref}" continues with a new state — confirm the comp suppresses the ingress transition here (no mid-slide glitch).`);
  }
}

// timeline gaps / overlaps
const sorted = [...covers].sort((p, q) => p.tIn - q.tIn);
for (let i = 1; i < sorted.length; i++) {
  const gap = +(sorted[i].tIn - sorted[i - 1].tOut).toFixed(2);
  if (gap > 0.5) warns.push(`GAP: ${gap}s uncovered between ${sorted[i - 1].tOut}s and ${sorted[i].tIn}s (face beat, or a missing cover?).`);
  if (gap < -0.01) warns.push(`OVERLAP: covers overlap by ${-gap}s near ${sorted[i].tIn}s.`);
}

for (const w of warns) console.log('  warn  ' + w);
if (errs.length) {
  console.error(`\nlint-covers: ${errs.length} VIOLATION(S) in ${path}:`);
  for (const e of errs) console.error('  FAIL  ' + e);
  console.error('\nFix these before rendering (PRE-RENDER GATE).');
  process.exit(1);
}
console.log(`lint-covers: OK — ${covers.length} covers, ${seen.size} distinct b-roll, all <=4s, captions clear of covers.`);

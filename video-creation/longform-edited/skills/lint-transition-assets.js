#!/usr/bin/env node
/**
 * lint-transition-assets.js — MECHANICAL pre-render gate for the TRANSITION layer.
 *
 * Added 2026-08-01 after the ethereum-rwa v7 round, which hit the SAME failure class twice
 * in two sessions (claudeisnaughty.md #1 and #3, both logged as "mechanically preventable"):
 *
 *   1. A transition was PLANNED in TRANSITIONS.md, verified, corrected twice, and then never
 *      wired into the comp. The existing gates check covers, decks, slides, pauses and the
 *      doc set; NONE of them asserted that a project with a TRANSITIONS.md actually CALLS the
 *      ids that plan names. v6/v7 shipped with `STILL_FX` (the I1 + I3 badsignal ingresses)
 *      declared but never referenced, so both planned glitches were silently absent.
 *   2. A referenced transition's ASSETS were never copied into the project public-dir, so the
 *      engine rendered a plain cut (or black) instead of the effect. `assets/transitions/`
 *      is deliberately a LEAN subset of the 490 MB library (comp-build §10), which makes a
 *      missing subdirectory the normal failure, not the exception. The trap: engines read
 *      plate/tile/mask dirs out of `row.params`, NOT off the row itself, so a check that only
 *      looks at top-level keys passes while the render is broken.
 *
 * Both failures are invisible in a render log: nothing errors, the effect is just missing.
 * This gate makes them fail LOUDLY, before ~50 minutes of frames get spent.
 *
 *   node longform-edited/skills/lint-transition-assets.js <comp.tsx> <public-dir> [TRANSITIONS.md]
 *
 * Asserts:
 *   A. every library id the comp references resolves in assets/transitions/library.json
 *   B. every asset that id needs EXISTS under <public-dir> — maskDir / plateDir / tileDir
 *      (checked BOTH on the row and inside row.params) plus its sfx file, and each dir holds
 *      at least its declared *Count of frames
 *   C. every `lib:<id>` named in TRANSITIONS.md is actually referenced by the comp
 *
 * Escape hatch for C (a plan id deliberately superseded during the build — e.g. ethereum-rwa
 * replaced the planned `rmn:cube` with a hand-rolled `hand:cube-3d` because @remotion/transitions
 * ships no cube): declare it in the comp and this gate treats it as answered, e.g.
 *
 *     // TRANSITIONS_WAIVED: rmn:cube — no cube in @remotion/transitions, hand-rolled as cube-3d
 *
 * Exits non-zero on any violation. Wire into the PRE-RENDER GATE (longform-edited/CLAUDE.md §6c).
 */
const fs = require('fs');
const path = require('path');

const [compPath, publicDir, plannedPath] = process.argv.slice(2);
if (!compPath || !publicDir) {
  console.error('usage: lint-transition-assets.js <comp.tsx> <public-dir> [TRANSITIONS.md]');
  process.exit(2);
}

const libPath = path.resolve(__dirname, '../../assets/transitions/library.json');
if (!fs.existsSync(libPath)) { console.error(`FAIL — transition library not found: ${libPath}`); process.exit(2); }
const raw = JSON.parse(fs.readFileSync(libPath, 'utf8'));
const rows = Array.isArray(raw) ? raw : (raw.rows || raw.transitions || Object.values(raw)[0]);
const byId = Object.fromEntries(rows.map((r) => [r.id, r]));

const src = fs.readFileSync(compPath, 'utf8');
const asset = (p) => path.join(publicDir, p);

let fails = 0, warns = 0;
const fail = (m) => { console.log(`  FAIL  ${m}`); fails++; };
const warn = (m) => { console.log(`  warn  ${m}`); warns++; };

console.log(`\nlint-transition-assets — ${path.basename(compPath)}`);
console.log('-'.repeat(64));

/* ── A. which library ids does the comp reference? ─────────────────────────── */
const literals = [...new Set([...src.matchAll(/['"`]([a-z0-9][a-z0-9_.-]{3,})['"`]/g)].map((m) => m[1]))];
const used = literals.filter((l) => byId[l]).sort();
if (!used.length) {
  console.log('  note  comp references no library transition ids — nothing to check.');
  console.log('-'.repeat(64));
  console.log('PASS — no transition layer in this comp.\n');
  process.exit(0);
}

/* An id-shaped literal from a known family that is NOT in the library is a typo, and
   TransitionClip only surfaces it as a crimson panel mid-render. Catch it here instead. */
const FAMILY = /^(blocks|badsignal|melt|spin|glitch|film|strips|perspective|zoom|expand|glass|invert|roughly|turbulent|deviation|monitor)[-_]/;
for (const l of literals) if (!byId[l] && FAMILY.test(l)) fail(`unknown transition id referenced by the comp: '${l}'`);

/* ── B. does every referenced id have its assets on disk? ──────────────────── */
const COUNT = { maskDir: 'maskCount', plateDir: 'plateCount', tileDir: 'tileCount' };
for (const id of used) {
  const r = byId[id];
  const p = r.params || {};
  const problems = [];
  for (const key of ['maskDir', 'plateDir', 'tileDir']) {
    const dir = p[key] || r[key];
    if (!dir) continue;
    if (!fs.existsSync(asset(dir))) { problems.push(`${key} MISSING: ${dir}`); continue; }
    const want = p[COUNT[key]] || r[COUNT[key]];
    if (want) {
      const have = fs.readdirSync(asset(dir)).filter((f) => /\.(png|jpe?g|webp)$/i.test(f)).length;
      if (have < want) problems.push(`${key} has ${have} frames, needs ${want}: ${dir}`);
    }
  }
  const sfx = r.sfx || p.sfx;
  if (sfx && !fs.existsSync(asset(sfx))) problems.push(`sfx MISSING: ${sfx}`);

  if (problems.length) for (const m of problems) fail(`${id} (${r.engine}) — ${m}`);
}
console.log(`  note  ${used.length} library id(s) referenced: ${used.join(', ')}`);

/* ── C. is every PLANNED transition actually wired? ────────────────────────── */
let planned = plannedPath;
if (!planned) {
  const guess = path.join(path.dirname(publicDir), 'TRANSITIONS.md');
  if (fs.existsSync(guess)) planned = guess;
}
if (planned && fs.existsSync(planned)) {
  const doc = fs.readFileSync(planned, 'utf8');
  const waived = new Set([...src.matchAll(/TRANSITIONS_WAIVED:\s*(?:lib:)?([a-z0-9][a-z0-9_.-]*)/gi)].map((m) => m[1]));
  const named = [...new Set([...doc.matchAll(/\blib:([a-z0-9][a-z0-9_.*-]*)/g)].map((m) => m[1]))].sort();
  /* TRANSITIONS.md legitimately names FAMILIES as well as ids — `lib:melt-rgb-*`,
     `lib:blocks-strips-*`, or a bare `lib:blocks` when picking the face family. Only a
     CONCRETE id (one that resolves in library.json) is something the comp must call; a
     family reference is prose about the pick, so enforcing it would be a false positive. */
  const want = named.filter((id) => byId[id]);
  const families = named.filter((id) => !byId[id]);
  const missing = want.filter((id) => !src.includes(`'${id}'`) && !src.includes(`"${id}"`)
    && !src.includes(`\`${id}\``) && !waived.has(id));
  for (const id of missing) {
    fail(`${path.basename(planned)} plans lib:${id} but the comp never references it `
      + `(wire it, or declare "// TRANSITIONS_WAIVED: ${id} — reason")`);
  }
  /* A family shorthand that is NOT a wildcard and NOT a real id is likelier a typo than
     prose, so surface it — but never as a hard fail. */
  for (const id of families) if (!id.includes('*')) warn(`${path.basename(planned)} names lib:${id} — family shorthand, or a typo? (not a library id)`);
  console.log(`  note  ${path.basename(planned)} plans ${want.length} concrete lib: id(s), `
    + `${want.length - missing.length} wired${families.length ? ` (+${families.length} family ref(s))` : ''}`);
} else {
  warn('no TRANSITIONS.md found — skipped the planned-vs-wired check (§C)');
}

console.log('-'.repeat(64));
if (fails) {
  console.log(`FAIL — ${fails} violation(s)${warns ? `, ${warns} warning(s)` : ''}. Do NOT render.\n`);
  process.exit(1);
}
console.log(`PASS — transition layer wired and every asset present${warns ? ` (${warns} warning(s) to review)` : ''}.\n`);

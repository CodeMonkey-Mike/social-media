#!/usr/bin/env node
/**
 * lint-animated-charts.js — MECHANICAL gate: every `chart` cover must render a LIVE animated
 * component in the comp, never a static PNG (charts.md "animated in the draft too"; comp-build.md §7).
 *
 *   node lint-animated-charts.js <comp.tsx> <covers.ts>
 *
 * Parses the COVERS array for kind:'chart' refs, and the comp for the animated-component routes
 * (`c.ref === 'X'` returning a component). FAILS (exit 1) if any chart ref has no component route
 * (i.e. it would fall through to the static-PNG branch). Origin: zebec CH1 buyback-flywheel shipped
 * as a static PNG in the draft (Mike, 2026-07-12).
 */
const fs = require('fs');
const [comp, covers] = process.argv.slice(2);
if (!comp || !covers) { console.error('usage: lint-animated-charts.js <comp.tsx> <covers.ts>'); process.exit(2); }
const compSrc = fs.readFileSync(comp, 'utf8');
const covSrc = fs.readFileSync(covers, 'utf8');

// chart refs used as covers
const chartRefs = [...covSrc.matchAll(/kind:\s*'chart'\s*,\s*ref:\s*'([^']+)'/g)].map((m) => m[1]);
// refs the comp routes to a component (c.ref === 'X' ... return <Component)
const routed = new Set([...compSrc.matchAll(/c\.ref\s*===\s*'([^']+)'/g)].map((m) => m[1]));

const missing = [...new Set(chartRefs)].filter((r) => !routed.has(r));
if (missing.length) {
  console.error('lint-animated-charts: FAIL — these `chart` covers render a STATIC PNG (must be a live\n' +
    'useCurrentFrame component, even in the draft — charts.md / comp-build.md §7):');
  missing.forEach((r) => console.error('  - ' + r));
  process.exit(1);
}
console.log(`lint-animated-charts: OK — all ${new Set(chartRefs).size} chart covers route to a live animated component.`);

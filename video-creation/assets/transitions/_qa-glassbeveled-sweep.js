#!/usr/bin/env node
/** QA sweep for GLASS/Beveled: side-by-side sheet per variant — pack preview (top,
 * yellow) vs our render (bottom, cyan) — frame-aligned from the transition start
 * (demo lead-in = 18 frames, both ~30fps). Writes _qa/glassbeveled/sbs_<id>.png.
 * Usage: node _qa-glassbeveled-sweep.js [idFilter]
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PREV = path.join(ROOT, 'Swiftly Studio 850 Seamless Transitions/Transitions/(Footage)/Preview Transitions/GLASS/Beveled');
const OUT = path.join(ROOT, '_qa/glassbeveled');
const TMP = path.join(OUT, '_tmp');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(TMP, { recursive: true });

const VARIANTS = [
  ['1', 'Up'], ['1', 'Down'], ['1', 'Left'], ['1', 'Right'],
  ['2', 'Up'], ['2', 'Down'], ['2', 'Left'], ['2', 'Right'],
  ['3', 'Horizontal'], ['3', 'Vertical'], ['4', 'Horizontal'], ['4', 'Vertical'],
];
const slug = (s) => s.toLowerCase();
const sh = (c) => execSync(c, { stdio: ['ignore', 'pipe', 'pipe'] });
const filter = process.argv[2] || '';

let made = 0, skipped = 0;
for (const [n, dir] of VARIANTS) {
  const id = `glass-beveled-${n}-${slug(dir)}`;
  if (!id.includes(filter)) continue;
  const pv = path.join(PREV, `Glass Beveled ${n} - ${dir}.mp4`);
  const my = path.join(ROOT, 'browse/GLASS/Beveled', `${id}.mp4`);
  if (!fs.existsSync(pv) || !fs.existsSync(my)) { skipped++; continue; }
  for (const f of fs.readdirSync(TMP)) fs.unlinkSync(path.join(TMP, f));
  sh(`ffmpeg -y -loglevel error -i "${pv}" -vf "scale=200:112" "${TMP}/pv_%02d.png"`);
  const cnt = fs.readdirSync(TMP).filter((f) => f.startsWith('pv_')).length;
  sh(`ffmpeg -y -loglevel error -i "${my}" -vf "select='gte(n,18)',scale=200:112" -vsync 0 -frames:v ${cnt} "${TMP}/my_%02d.png"`);
  sh(`ffmpeg -y -loglevel error -i "${TMP}/pv_%02d.png" -frames:v 1 -vf "tile=${cnt}x1:padding=2:color=yellow" "${TMP}/row_pv.png"`);
  sh(`ffmpeg -y -loglevel error -i "${TMP}/my_%02d.png" -frames:v 1 -vf "tile=${cnt}x1:padding=2:color=cyan" "${TMP}/row_my.png"`);
  const out = path.join(OUT, `sbs_${id}.png`);
  sh(`ffmpeg -y -loglevel error -i "${TMP}/row_pv.png" -i "${TMP}/row_my.png" -filter_complex "[0][1]vstack" "${out}"`);
  made++;
  process.stdout.write(`  ${id}  (${cnt} frames)\n`);
}
console.log(`sweep: ${made} sheets -> ${OUT}${skipped ? `  (${skipped} skipped)` : ''}`);

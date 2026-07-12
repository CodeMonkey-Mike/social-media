#!/usr/bin/env node
/** QA sweep for the whole GLASS category (Beveled, Beveled Short, Blocks, Blocks
 * Corner): side-by-side sheet per variant — pack preview (top, yellow) vs our
 * render (bottom, cyan) — frame-aligned from the transition start (demo lead-in =
 * 18 frames, both ~30fps). Writes _qa/glassbeveled/sbs_<id>.png.
 * Usage: node _qa-glassbeveled-sweep.js [idFilter]
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PREVROOT = path.join(ROOT, 'Swiftly Studio 850 Seamless Transitions/Transitions/(Footage)/Preview Transitions/GLASS');
const OUT = path.join(ROOT, '_qa/glassbeveled');
const TMP = path.join(OUT, '_tmp');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(TMP, { recursive: true });

const DIRS4 = ['Up', 'Down', 'Left', 'Right'];
const HV = ['Horizontal', 'Vertical'];
const CORNERS = ['Left Up', 'Left Down', 'Right Up', 'Right Down'];
const VARIANTS = [
  ...['1', '2'].flatMap((n) => DIRS4.map((d) => ['Beveled', n, d])),
  ...['3', '4'].flatMap((n) => HV.map((d) => ['Beveled', n, d])),
  ...['1', '2'].flatMap((n) => DIRS4.map((d) => ['Beveled Short', n, d])),
  ...['3', '4'].flatMap((n) => HV.map((d) => ['Beveled Short', n, d])),
  ['Blocks', '1', 'Left'], ['Blocks', '1', 'Right'], ['Blocks', '2', 'Horizontal'], ['Blocks', '3', 'Horizontal'],
  ...['1', '2', '3'].flatMap((n) => CORNERS.map((d) => ['Blocks Corner', n, d])),
];
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');
const sh = (c) => execSync(c, { stdio: ['ignore', 'pipe', 'pipe'] });
const filter = process.argv[2] || '';

let made = 0, skipped = 0;
for (const [sub, n, dir] of VARIANTS) {
  const id = `glass-${slug(sub)}-${n}-${slug(dir)}`;
  if (!id.includes(filter)) continue;
  const pv = path.join(PREVROOT, sub, `Glass ${sub} ${n} - ${dir}.mp4`);
  const my = path.join(ROOT, 'browse/GLASS', sub, `${id}.mp4`);
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

#!/usr/bin/env node
/** QA sweep for the MELT category (Equidistant/RGB families incl. Soft): pack
 * preview (top, yellow) vs our render (bottom, cyan), frame-aligned.
 * Writes _qa/melt/sbs_<id>.png. */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PREVROOT = path.join(ROOT, 'Swiftly Studio 850 Seamless Transitions/Transitions/(Footage)/Preview Transitions/MELT');
const OUT = path.join(ROOT, '_qa/melt');
const TMP = path.join(OUT, '_tmp');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(TMP, { recursive: true });

const SUBS = [
  ['Equidistant', 'Melt Equidistant - ', 'melt-equidistant-', 4, 'Equidistant'],
  ['Equidistant Short', 'Melt Equidistant Short - ', 'melt-equidistant-short-', 4, 'Equidistant Short'],
  ['RGB', 'Melt RGB - ', 'melt-rgb-', 7, 'RGB'],
  ['RGB', 'Melt RGB Soft - ', 'melt-rgb-soft-', 4, 'RGB'],
  ['RGB Short', 'Melt RGB Short - ', 'melt-rgb-short-', 7, 'RGB Short'],
  ['RGB Short', 'Melt RGB Soft Short - ', 'melt-rgb-soft-short-', 4, 'RGB Short'],
];
const VARIANTS = SUBS.flatMap(([dir, pvPre, idPre, count, vdir]) => Array.from({length: count}, (_, i) => [dir, pvPre, idPre, i + 1, vdir]));
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');
const sh = (c) => execSync(c, { stdio: ['ignore', 'pipe', 'pipe'] });
const filter = process.argv[2] || '';

let made = 0, skipped = 0;
for (const [dir, pvPre, idPre, n, vdir] of VARIANTS) {
  const id = idPre + n;
  if (!id.includes(filter)) continue;
  const pv = path.join(PREVROOT, dir, pvPre + n + '.mp4');
  const my = path.join(ROOT, 'browse/MELT', vdir, id + '.mp4');
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

#!/usr/bin/env node
/** QA sweep for the MOTION category (single-scene moves/shakes): pack preview
 * (top, yellow) vs our render (bottom, cyan). MOTION previews are NATIVE 25fps
 * (no pulldown) - both sides sampled at 10fps. Writes _qa/motion/. */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PREVROOT = path.join(ROOT, 'Swiftly Studio 850 Seamless Transitions/Transitions/(Footage)/Preview Transitions/MOTION');
const OUT = path.join(ROOT, '_qa/motion');
const TMP = path.join(OUT, '_tmp');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(TMP, { recursive: true });

const DIRS16 = ['Left Down', 'Left Up', 'Right Down', 'Right Up'];
const RAW = [
  ...[1,2,3,4].flatMap((n) => DIRS16.map((d) => ['3D Offset', 'Motion 3D Offset ' + n + ' - ' + d])),
  ...['B Left','B Right','T Left','T Right'].map((d) => ['3D Orbit', 'Motion 3D Orbit 1 - ' + d]),
  ...DIRS16.map((d) => ['3D Orbit', 'Motion 3D Orbit 2 - ' + d]),
  ...[3,4].flatMap((n) => ['B CCW','B CW','T CCW','T CW'].map((d) => ['3D Orbit', 'Motion 3D Orbit ' + n + ' - ' + d])),
  ...[1,2].flatMap((n) => ['Down','Left','Right','Up'].map((d) => ['3D Pan', 'Motion 3D Pan ' + n + ' - ' + d])),
  ...[1,2,3,4,5].map((n) => ['Shake 3D', 'Motion Shake 3D - ' + n + 'x']),
  ...[1,2,3,4,5,6].map((n) => ['Shake Optics', 'Motion Shake Optics - ' + n + 'x']),
  ...[1,2,3,4].map((n) => ['Shake Simple', 'Motion Shake Simple - ' + n + 'x']),
];
const VARIANTS = RAW.map(([dir, pvName]) => [dir, pvName, 'motion-' + pvName.replace(/^Motion /, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')]);
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');
const sh = (c) => execSync(c, { stdio: ['ignore', 'pipe', 'pipe'] });
const filter = process.argv[2] || '';

let made = 0, skipped = 0;
for (const [dir, pvName, id] of VARIANTS) {
  if (!id.includes(filter)) continue;
  const pv = path.join(PREVROOT, dir, pvName + '.mp4');
  const my = path.join(ROOT, 'browse/MOTION', dir, id + '.mp4');
  if (!fs.existsSync(pv) || !fs.existsSync(my)) { skipped++; continue; }
  for (const f of fs.readdirSync(TMP)) fs.unlinkSync(path.join(TMP, f));
  sh(`ffmpeg -y -loglevel error -i "${pv}" -vf "fps=10,scale=200:112" "${TMP}/pv_%02d.png"`);
  const cnt = fs.readdirSync(TMP).filter((f) => f.startsWith('pv_')).length;
  sh(`ffmpeg -y -loglevel error -i "${my}" -vf "trim=start_frame=18,fps=10,scale=200:112" -vsync 0 -frames:v ${cnt} "${TMP}/my_%02d.png"`);
  sh(`ffmpeg -y -loglevel error -i "${TMP}/pv_%02d.png" -frames:v 1 -vf "tile=${cnt}x1:padding=2:color=yellow" "${TMP}/row_pv.png"`);
  sh(`ffmpeg -y -loglevel error -i "${TMP}/my_%02d.png" -frames:v 1 -vf "tile=${cnt}x1:padding=2:color=cyan" "${TMP}/row_my.png"`);
  const out = path.join(OUT, `sbs_${id}.png`);
  sh(`ffmpeg -y -loglevel error -i "${TMP}/row_pv.png" -i "${TMP}/row_my.png" -filter_complex "[0][1]vstack" "${out}"`);
  made++;
  process.stdout.write(`  ${id}  (${cnt} frames)\n`);
}
console.log(`sweep: ${made} sheets -> ${OUT}${skipped ? `  (${skipped} skipped)` : ''}`);

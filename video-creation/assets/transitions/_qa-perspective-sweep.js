#!/usr/bin/env node
/** QA sweep for PERSPECTIVE Ease In / Ease In Short: pack preview (top, yellow)
 * vs our render (bottom, cyan), frame-aligned from the transition start.
 * Previews are 25->29.97 pulldown conversions — both sides sampled at 12.5fps.
 * Writes _qa/perspective/. */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PREVROOT = path.join(ROOT, 'Swiftly Studio 850 Seamless Transitions/Transitions/(Footage)/Preview Transitions/PERSPECTIVE');
const OUT = path.join(ROOT, '_qa/perspective');
const TMP = path.join(OUT, '_tmp');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(TMP, { recursive: true });

const DIRS = ['Down', 'Left', 'Left Down', 'Left Up', 'Right', 'Right Down', 'Right Up', 'Up'];
const VARIANTS = [
  ...DIRS.map((d) => ['Ease In', `Perspective Ease In - ${d}`]),
  ...DIRS.map((d) => ['Ease In Short', `Perspective Ease In Short - ${d}`]),
].map(([sub, pvName]) => [sub, pvName,
  'perspective-' + pvName.replace(/^Perspective /, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')]);

const sh = (c) => execSync(c, { stdio: ['ignore', 'pipe', 'pipe'] });
const filter = process.argv[2] || '';

let made = 0, skipped = 0;
for (const [sub, pvName, id] of VARIANTS) {
  if (!id.includes(filter)) continue;
  const pv = path.join(PREVROOT, sub, pvName + '.mp4');
  const my = path.join(ROOT, 'browse/PERSPECTIVE', sub, id + '.mp4');
  if (!fs.existsSync(pv) || !fs.existsSync(my)) { skipped++; continue; }
  for (const f of fs.readdirSync(TMP)) fs.unlinkSync(path.join(TMP, f));
  sh(`ffmpeg -y -loglevel error -i "${pv}" -vf "fps=12.5,scale=240:135" "${TMP}/pv_%02d.png"`);
  const cnt = fs.readdirSync(TMP).filter((f) => f.startsWith('pv_')).length;
  sh(`ffmpeg -y -loglevel error -i "${my}" -vf "trim=start_frame=18,fps=12.5,scale=240:135" -vsync 0 -frames:v ${cnt} "${TMP}/my_%02d.png"`);
  sh(`ffmpeg -y -loglevel error -i "${TMP}/pv_%02d.png" -frames:v 1 -vf "tile=${cnt}x1:padding=2:color=yellow" "${TMP}/row_pv.png"`);
  sh(`ffmpeg -y -loglevel error -i "${TMP}/my_%02d.png" -frames:v 1 -vf "tile=${cnt}x1:padding=2:color=cyan" "${TMP}/row_my.png"`);
  const out = path.join(OUT, `sbs_${id}.png`);
  sh(`ffmpeg -y -loglevel error -i "${TMP}/row_pv.png" -i "${TMP}/row_my.png" -filter_complex "[0][1]vstack" "${out}"`);
  made++;
  process.stdout.write(`  ${id}  (${cnt} frames)\n`);
}
console.log(`sweep: ${made} sheets -> ${OUT}${skipped ? `  (${skipped} skipped)` : ''}`);

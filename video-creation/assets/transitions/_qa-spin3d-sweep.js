#!/usr/bin/env node
/** QA sweep for SPIN 3D (Center/Corner/Side Ease + Shorts): pack preview (top,
 * yellow) vs our render (bottom, cyan), frame-aligned from the transition
 * start. Previews are 25->29.97 pulldown — both sides sampled at 12.5fps.
 * NOTE: the Short PREVIEW FOLDERS carry a "(Slow)" suffix; sequence names and
 * preview filenames don't. Writes _qa/spin3d/. */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PREVROOT = path.join(ROOT, 'Swiftly Studio 850 Seamless Transitions/Transitions/(Footage)/Preview Transitions/SPIN');
const OUT = path.join(ROOT, '_qa/spin3d');
const TMP = path.join(OUT, '_tmp');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(TMP, { recursive: true });

const VARIANTS = [];
for (const sub of ['Center', 'Corner']) {
  for (const short of ['', ' Short']) {
    for (const d of ['B CCW', 'B CW', 'T CCW', 'T CW']) {
      VARIANTS.push([`3D ${sub} Ease${short}`, `3D ${sub} Ease${short ? ' Short (Slow)'.replace(' Short', '') && `${short} (Slow)`.trim() : ''}`, d]);
    }
  }
}
// simpler explicit table: [browse folder (= variant), preview folder, dir]
VARIANTS.length = 0;
const TABLE = [
  ['3D Center Ease', '3D Center Ease', ['B CCW', 'B CW', 'T CCW', 'T CW']],
  ['3D Center Ease Short', '3D Center Ease Short (Slow)', ['B CCW', 'B CW', 'T CCW', 'T CW']],
  ['3D Corner Ease', '3D Corner Ease', ['B CCW', 'B CW', 'T CCW', 'T CW']],
  ['3D Corner Ease Short', '3D Corner Ease Short (Slow)', ['B CCW', 'B CW', 'T CCW', 'T CW']],
  ['3D Side Ease', '3D Side Ease', ['Down', 'Left', 'Right', 'Up']],
  ['3D Side Ease Short', '3D Side Ease Short (Slow)', ['Down', 'Left', 'Right', 'Up']],
];
for (const [variant, pvFolder, dirs] of TABLE) {
  for (const d of dirs) {
    const pvName = `Spin ${variant} - ${d}`;
    const id = ('spin-' + variant + '-' + d).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    VARIANTS.push([variant, pvFolder, pvName, id]);
  }
}
const sh = (c) => execSync(c, { stdio: ['ignore', 'pipe', 'pipe'] });
const filter = process.argv[2] || '';

let made = 0, skipped = 0;
for (const [variant, pvFolder, pvName, id] of VARIANTS) {
  if (!id.includes(filter)) continue;
  const pv = path.join(PREVROOT, pvFolder, pvName + '.mp4');
  const my = path.join(ROOT, 'browse/SPIN', variant, id + '.mp4');
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

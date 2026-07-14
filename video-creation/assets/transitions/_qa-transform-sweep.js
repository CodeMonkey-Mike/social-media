#!/usr/bin/env node
/** QA sweep for the TRANSFORM category: pack preview (top, yellow) vs our
 * render (bottom, cyan), frame-aligned from the transition start, both
 * resampled at 12.5fps. Compare motion character (push arc direction, blur
 * axis rotation, 3D wobble/keystone, zoom ride, settle), not content —
 * preview sources are real clips, ours are stills. Writes _qa/transform/. */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PREVROOT = path.join(ROOT, 'Swiftly Studio 850 Seamless Transitions/Transitions/(Footage)/Preview Transitions/TRANSFORM');
const OUT = path.join(ROOT, '_qa/transform');
const TMP = path.join(OUT, '_tmp');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(TMP, { recursive: true });

// (previewFolder, previewName, id) — same mapping as _build-transform-rows.js
const VARIANTS = require('./_transform-clips.json')
  .filter((s) => !s.error)
  .map((s) => {
    const m = s.name.match(/^Transform (Short )?(\d) - (.+)$/);
    const folder = (m[1] ? 'Short ' : '') + m[2];
    const id = `transform-${m[1] ? 'short-' : ''}${m[2]}-${m[3].toLowerCase().replace(/\s+/g, '-')}`;
    return [folder, s.name, id];
  });

const sh = (c) => execSync(c, { stdio: ['ignore', 'pipe', 'pipe'] });
const filter = process.argv[2] || '';

let made = 0, skipped = 0;
for (const [sub, pvName, id] of VARIANTS) {
  if (!id.includes(filter)) continue;
  const pv = path.join(PREVROOT, sub, pvName + '.mp4');
  const my = path.join(ROOT, 'browse/TRANSFORM', sub, id + '.mp4');
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

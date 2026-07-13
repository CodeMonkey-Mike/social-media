#!/usr/bin/env node
/** QA sweep for the SHAKE category: pack preview (top, yellow) vs our render
 * (bottom, cyan), frame-aligned from the transition start. SHAKE previews are
 * NATIVE 25fps (no pulldown) — both sides sampled at 12.5fps. NOTE: the pack
 * previews demo SHAKE over ONE continuous scene; our demos are A->B (the
 * Deviation split is a real editorial cut) — compare motion/fringe character,
 * not content. Writes _qa/shake/. */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PREVROOT = path.join(ROOT, 'Swiftly Studio 850 Seamless Transitions/Transitions/(Footage)/Preview Transitions/SHAKE');
const OUT = path.join(ROOT, '_qa/shake');
const TMP = path.join(OUT, '_tmp');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(TMP, { recursive: true });

const VARIANTS = [];
for (const [sub, n] of [['Hit', 6], ['Horizontal', 7], ['Long', 7], ['Short', 7], ['Skew', 7]]) {
  for (let i = 1; i <= n; i++) {
    VARIANTS.push([sub, `Shake ${sub} - ${i}x`, `shake-${sub.toLowerCase()}-${i}x`]);
  }
}
const sh = (c) => execSync(c, { stdio: ['ignore', 'pipe', 'pipe'] });
const filter = process.argv[2] || '';

let made = 0, skipped = 0;
for (const [sub, pvName, id] of VARIANTS) {
  if (!id.includes(filter)) continue;
  const pv = path.join(PREVROOT, sub, pvName + '.mp4');
  const my = path.join(ROOT, 'browse/SHAKE', sub, id + '.mp4');
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

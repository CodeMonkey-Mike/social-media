#!/usr/bin/env node
/** QA sweep: for every OFFSET sub-family, build a side-by-side sheet — pack preview
 * (top row, yellow) vs our render (bottom row, cyan) — frame-aligned from the
 * transition start, both at 200x112. Writes _qa/offsetgeo/sweep/sbs_<fam>_<dir>.png.
 * Default: all 19 families x the "Right" direction (+ any extra dirs passed).
 * Usage: node _qa-offsetgeo-sweep.js [dir ...]   (e.g. "Right" "Left Up")
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PREV = path.join(ROOT, 'Swiftly Studio 850 Seamless Transitions/Transitions/(Footage)/Preview Transitions/OFFSET');
const OUT = path.join(ROOT, '_qa/offsetgeo/sweep');
const TMP = path.join(ROOT, '_qa/offsetgeo/_sweeptmp');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(TMP, { recursive: true });

const FAMS = ['Simple', 'Simple Short', 'Long Simple', 'Ease', 'Ease Short', 'Ease Out',
  'Ease Out Short', 'Long Ease', 'Long Ease Out', 'Bounce', 'Bounce Short',
  'Hit', 'Hit Short', 'Long Hit', 'Swinging', 'Swinging Short', 'Long Swinging',
  'Warp', 'Warp Short'];
const DIRS = process.argv.slice(2).length ? process.argv.slice(2) : ['Right'];
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const sh = (c) => execSync(c, { stdio: ['ignore', 'pipe', 'pipe'] });

let made = 0, skipped = 0;
for (const fam of FAMS) {
  for (const dir of DIRS) {
    const pv = path.join(PREV, fam, `Offset ${fam} - ${dir}.mp4`);
    const my = path.join(ROOT, 'browse/OFFSET', fam, `offset-${slug(fam)}-${slug(dir)}.mp4`);
    if (!fs.existsSync(pv) || !fs.existsSync(my)) { skipped++; continue; }
    for (const f of fs.readdirSync(TMP)) fs.unlinkSync(path.join(TMP, f));
    sh(`ffmpeg -y -loglevel error -i "${pv}" -vf "scale=200:112" "${TMP}/pv_%02d.png"`);
    const n = fs.readdirSync(TMP).filter((f) => f.startsWith('pv_')).length;
    sh(`ffmpeg -y -loglevel error -i "${my}" -vf "select='gte(n,18)',scale=200:112" -vsync 0 -frames:v ${n} "${TMP}/my_%02d.png"`);
    sh(`ffmpeg -y -loglevel error -i "${TMP}/pv_%02d.png" -frames:v 1 -vf "tile=${n}x1:padding=2:color=yellow" "${TMP}/row_pv.png"`);
    sh(`ffmpeg -y -loglevel error -i "${TMP}/my_%02d.png" -frames:v 1 -vf "tile=${n}x1:padding=2:color=cyan" "${TMP}/row_my.png"`);
    const out = path.join(OUT, `sbs_${slug(fam)}_${slug(dir)}.png`);
    sh(`ffmpeg -y -loglevel error -i "${TMP}/row_pv.png" -i "${TMP}/row_my.png" -filter_complex "[0][1]vstack" "${out}"`);
    made++;
    process.stdout.write(`  ${fam} - ${dir}  (${n} frames)\n`);
  }
}
console.log(`sweep: ${made} sheets -> ${OUT}${skipped ? `  (${skipped} skipped, demo/preview missing)` : ''}`);

#!/usr/bin/env node
/** Build library.json from the REAL per-clip data in _blocks-clips.json.
 * Max/Medium use the Gth-Disp Blocks Max mask; Short uses the Small mask.
 * Strips are NOT built here (their strip pattern isn't reproducible project
 * data — it's baked into the preview render). */
const fs = require('fs');
const path = require('path');
const clips = JSON.parse(fs.readFileSync(path.join(__dirname, '_blocks-clips.json'), 'utf8'));
const get = (n) => clips.find((c) => c.name === n);

function row(seqName, id, intensity, maskDir, sfx, opts = {}) {
  const r = get(seqName);
  if (!r) throw new Error('missing ' + seqName);
  return {
    id, category: 'GLITCH', variant: 'Blocks', intensity,
    label: `Glitch · Blocks · ${intensity}`,
    engine: 'GlitchBlocks', kind: 'footage', fidelity: opts.fidelity || 'near-1:1',
    durationSeconds: opts.durationSeconds || 0.96,
    params: {
      offsets: r.offsets.map((o) => ({ dx: o.dx, dy: o.dy })),
      opacityPeak: 0.333,
      maskDir, maskCount: opts.maskCount || 30,
      scaleH: r.scaleH || null,
    },
    sfx, used_in: [],
  };
}

const rows = [];
for (const n of [1, 2, 3]) rows.push(row(`Glitch Blocks Max - ${n}`, `blocks-max-${n}`, `Max ${n}`, 'transitions/lib/masks/blocks-max', 'transitions/lib/sfx-blocks-max.mp3'));
for (const n of [1, 2, 3]) rows.push(row(`Glitch Blocks Medium - ${n}`, `blocks-medium-${n}`, `Medium ${n}`, 'transitions/lib/masks/blocks-max', 'transitions/lib/sfx-blocks-med.mp3'));
for (const n of [1, 2, 3]) rows.push(row(`Glitch Blocks Short - ${n}`, `blocks-short-${n}`, `Short ${n}`, 'transitions/lib/masks/blocks-small', 'transitions/lib/sfx-blocks-min.mp3'));
// Strips: mask reverse-engineered from each density's preview (no source mask
// file exists) -> fidelity "approximate"; 12-frame masks, 0.4s.
for (const n of [1, 2, 3, 4, 5, 6]) rows.push(row(`Glitch Blocks Strips - ${n}x`, `blocks-strips-${n}x`, `Strips ${n}x`, `transitions/lib/masks/blocks-strips-${n}x`, 'transitions/lib/sfx-blocks-min.mp3', { fidelity: 'approximate', durationSeconds: 0.4, maskCount: 12 }));

const out = {
  $doc: "Reusable TRANSITION catalog — Remotion re-creations of the Swiftly Studio 850 pack. This JSON is the catalog (data); rendering code is in remotion/src/transitions/ (engine + registry). Blocks displacement amounts are the real per-clip Offset 'Shift Center To' vectors (extracted via _extract-blocks-clips.js, per-clip not a global closure). Block PATTERN source by family: Max/Medium use the pack's real `Gth - Disp Blocks Max.mp4`, Short uses `Gth - Disp Blocks Small.mp4` (converted to alpha masks in lib/masks/, white=show; fidelity near-1:1). STRIPS have NO source mask file, so their strip masks are reverse-engineered from each density's PREVIEW render (diff vs clean frame -> per-row bands -> alpha; fidelity approximate). Browse demos via browse/<CAT>/<VARIANT>/gallery.html. SCOPE: GLITCH/Blocks all 15 (Max/Medium/Short x3 + Strips 1x-6x).",
  $schema_note: "params.offsets = real Shift Center To deltas (count = intensity: Max 6 / Medium 4 / Short 2); opacityPeak 0.333; maskDir = the alpha-mask PNG sequence from the real Gth-Disp file; maskCount = frames; scaleH = Geometry2 vertical Scale Height (150). Engine: footage shown through the real moving block mask, wrap-shifted by each offset, faded by the Opacity envelope 0->100->0 with the A->B cut at the peak.",
  transitions: rows,
};
fs.writeFileSync(path.join(__dirname, 'library.json'), JSON.stringify(out, null, 2) + '\n');
console.log('wrote library.json with', rows.length, 'rows');
for (const r of rows) console.log(`  ${r.id}: offsets=${r.params.offsets.length} mask=${r.params.maskDir.split('/').pop()} scaleH=${r.params.scaleH}`);

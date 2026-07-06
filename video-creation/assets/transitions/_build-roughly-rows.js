#!/usr/bin/env node
/** Build the 7 Glitch Roughly rows from _roughly-clips.json and MERGE them into
 * library.json (replaces roughly-* rows only; never touches other rows).
 *
 * Mechanism (per-clip extraction + numeric verification, 2026-07-05):
 * Every effect window is a SubClip of the shared "Texture Adjustment" utility
 * sequence — a rack of the pack's plate videos, each SELF-LUMA-MATTED
 * (Set Matte2: matte=self, channel=luminance, stretch-to-fit). Over content the
 * window renders as: CONTENT THROUGH THE PLATE'S LUMA (verified numerically vs
 * preview: fragment-region chroma == content baseline, nowhere near white-plate
 * H1) — i.e. the same real-matte mechanism as the approved Blocks family.
 *  - mosaic window ("Different Fragments Nx" plate, whole transition, split at
 *    the A->B cut with continuous media): matted content -> Geometry2 Scale
 *    Height 125% -> Mosaic 314x174 (bottom-up component order: Geometry2 listed
 *    last so it applies FIRST).
 *  - offset window(s) ("Blocks Nx" plate, mid-transition): matted content
 *    wrap-shifted by the clip's keyframed Offset "Shift Center To" (dx,dy =
 *    raw - 0.5; keyframes in media time, window-relative here). Plates carry
 *    GRAY levels -> partial alpha (baked into the mask PNGs). 1x has none;
 *    7x stacks TWO (Blocks 7x + Blocks 3x).
 *  - cut = the mosaic pair's split point. Windows play their plate from
 *    maskStart seconds in (window in-point minus the plate's rack slot start).
 *  - SFX: Composite_Roughly_Only_Displacement.mp3 on every variant's audio
 *    track, played from a per-variant in-point (trimmed copies in lib/).
 */
const fs = require('fs');
const path = require('path');

const clips = require('./_roughly-clips.json');
const libPath = path.join(__dirname, 'library.json');
const lib = JSON.parse(fs.readFileSync(libPath, 'utf8'));

const maskFrames = (dir) =>
  fs.readdirSync(path.join(__dirname, 'lib/masks', dir)).filter((f) => /^m_\d+\.png$/.test(f)).length;

// Texture Adjustment rack: plate slots start at integer seconds (verified via
// _texadj-clips.json): 120+(N-1) = Different Fragments Nx, 127+(N-2) = Blocks Nx.
const fragPlate = (inPoint) => Math.floor(inPoint) - 120 + 1;
const blockPlate = (inPoint) => Math.floor(inPoint) - 127 + 2;

const rows = [];
for (const seq of clips) {
  if (seq.error) throw new Error(seq.name + ': ' + seq.error);
  const n = +seq.name.match(/Glitch Roughly - (\d)x/)[1];
  const id = `roughly-${n}x`;
  const dur = Math.max(...seq.clips.map((c) => c.end || 0));

  const windows = [];
  let cut = null;

  // group the effect clips by track (track 0 = the content placeholder)
  const byTrack = new Map();
  for (const c of seq.clips.filter((c) => c.effects.length)) {
    if (!byTrack.has(c.track)) byTrack.set(c.track, []);
    byTrack.get(c.track).push(c);
  }

  for (const [track, tcs] of [...byTrack.entries()].sort((a, b) => a[0] - b[0])) {
    tcs.sort((a, b) => a.start - b.start);
    const first = tcs[0];
    const isMosaic = first.effects.some((e) => /ADBE Mosaic/.test(e.matchName));
    if (isMosaic) {
      // pair split at the A->B cut, media continuous across it
      if (tcs.length !== 2) throw new Error(`${id}: mosaic window has ${tcs.length} clips`);
      const gap = Math.abs(tcs[1].inPoint - (first.inPoint + (tcs[1].start - first.start)));
      if (gap > 1e-3) throw new Error(`${id}: mosaic pair media not continuous (gap ${gap})`);
      cut = tcs[1].start;
      const mos = first.effects.find((e) => /ADBE Mosaic/.test(e.matchName)).params;
      const geo = first.effects.find((e) => /ADBE Geometry2/.test(e.matchName)).params;
      const pv = (ps, nm) => Number(ps.find((p) => p.name === nm).value);
      const plate = fragPlate(first.inPoint);
      if (plate !== n) throw new Error(`${id}: frag plate ${plate} != variant ${n}`);
      const maskDir = `roughly-frag-${plate}x`;
      windows.push({
        type: 'mosaic',
        t0: first.start,
        t1: tcs[1].end,
        maskDir: `transitions/lib/masks/${maskDir}`,
        maskFrames: maskFrames(maskDir),
        maskStart: +(first.inPoint - Math.floor(first.inPoint)).toFixed(4),
        cellsX: pv(mos, 'Horizontal Blocks'),
        cellsY: pv(mos, 'Vertical Blocks'),
        scaleH: pv(geo, 'Scale Height'),
      });
    } else {
      // keyframed wrap-offset window through a Blocks plate (one clip per track)
      if (tcs.length !== 1) throw new Error(`${id}: offset window has ${tcs.length} clips`);
      const kfs = first.effects
        .find((e) => /ADBE Offset/.test(e.matchName))
        .params.find((p) => p.name === 'Shift Center To').keyframes;
      const curve = kfs.map((kf) => {
        const [x, y] = kf.v.split(':').map(Number);
        return { t: +(kf.t - first.inPoint).toFixed(4), dx: +(x - 0.5).toFixed(5), dy: +(y - 0.5).toFixed(5) };
      });
      const plate = blockPlate(first.inPoint);
      const maskDir = `roughly-blocks-${plate}x`;
      windows.push({
        type: 'offset',
        t0: first.start,
        t1: first.end,
        maskDir: `transitions/lib/masks/${maskDir}`,
        maskFrames: maskFrames(maskDir),
        maskStart: +(first.inPoint - Math.floor(first.inPoint)).toFixed(4),
        curve,
      });
    }
  }
  if (cut === null) throw new Error(`${id}: no mosaic pair found`);

  rows.push({
    id,
    category: 'GLITCH',
    variant: 'Roughly',
    intensity: `${n}x`,
    label: `Glitch · Roughly · ${n}x`,
    engine: 'GlitchRoughly',
    kind: 'footage',
    fidelity: 'near-1:1',
    durationSeconds: dur,
    params: { cut, windows },
    sfx: `transitions/lib/sfx-roughly-${n}x.mp3`,
    used_in: [],
    meta: {
      aspectRatios: ['16:9'],
      resolution: '1920x1080',
      family: 'Glitch',
      engineFile: 'remotion/src/transitions/engines/GlitchRoughly.tsx',
      description:
        'Rough compression-artifact glitch: ragged fragment-shaped patches of the footage go coarse-mosaic and stretch, while blocky strips tear away as wrap-shifted displaced copies, then it settles. Density 1x (brief fragment flicker) to 7x (long tear with stacked block displacement).',
      energy: n <= 2 ? 'medium' : 'high',
      durationSeconds: dur,
      hasSound: true,
      fidelity: 'near-1:1',
      tags: ['glitch', 'roughly', 'fragments', 'mosaic', 'displacement', 'datamosh'],
      useWhen:
        `Datamosh/corruption-style cut (~${dur}s) that chews the frame into pixelated fragments; higher x = longer + more block tearing. Pairs with its own displacement SFX.`,
    },
  });
}

const keep = lib.transitions.filter((r) => !/^roughly-/.test(r.id));
lib.transitions = [...keep, ...rows];
fs.writeFileSync(libPath, JSON.stringify(lib, null, 2));
console.log(`merged ${rows.length} roughly rows into library.json (total ${lib.transitions.length} rows)`);
for (const r of rows) {
  const w = r.params.windows.map((w) => `${w.type}[${w.t0}-${w.t1}]@${w.maskStart}`).join(' ');
  console.log(`  ${r.id}: dur=${r.durationSeconds}s cut=${r.params.cut} ${w}`);
}

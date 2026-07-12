#!/usr/bin/env node
/** _glassrest-clips.json -> 28 GLASS rows (Beveled Short 12, Blocks 4, Blocks
 * Corner 12), engine GlassBeveled. Same architecture as _build-glassbeveled-rows.js
 * (AEMask shard-gated staggered wrap-Offsets, flips resolved analytically) with the
 * three differences found in extraction (2026-07-12):
 *   - (Out) curves JUMP AHEAD at the cut (OFFSET-Short pattern, e.g. Beveled Short
 *     skips 0.44s) — the engine's piecewise curveIn/curveOut sampling handles it.
 *   - Blocks/Corner use a DOUBLE flip sandwich (H+V = 180 rotation) and rectangular
 *     block masks; Corner rows mix x-axis AND y-axis stages (axis asserted PER
 *     STAGE; row axis becomes 'xy').
 *   - Audio cuts differ per subgroup (Blocks plays Skew_Simple_01 from in 0.12) —
 *     sfx file chosen by the MEASURED (inPoint, window), asserted, not assumed.
 * Hard-fails on everything the Beveled builder does. Merges into library.json.
 */
const fs = require('fs');
const path = require('path');
const clips = require('./_glassrest-clips.json');

const num = (s) => (s == null ? null : +String(s).replace(/[^0-9eE.+-]/g, ''));
const xy = (v) => { const [a, b] = String(v).split(':'); return [num(a), num(b)]; };
const r4 = (n) => +n.toFixed(4);
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const handles = (k) => (k.a && k.a.length >= 7
  ? { iv: num(k.a[3]), ii: num(k.a[4]), ov: num(k.a[5]), oi: num(k.a[6]) }
  : {});
const die = (msg) => { throw new Error('GLASS REST BUILD FAIL: ' + msg); };

/** Effect list -> stages in APPLY order, flips resolved analytically (same as the
 * Beveled builder, plus a PER-STAGE single-axis assert instead of per-row). */
function decodeStages(clip, seqName) {
  let flipH = false, flipV = false;
  const stages = [];
  for (const e of [...clip.effects].reverse()) {
    if (e.matchName === 'PR.ADBE Horizontal Flip') { flipH = !flipH; continue; }
    if (e.matchName === 'PR.ADBE Vertical Flip') { flipV = !flipV; continue; }
    if (e.matchName !== 'AE.ADBE Offset') die(`${seqName}: unexpected effect ${e.matchName}`);
    const p = e.params.find((x) => x.name === 'Shift Center To');
    if (!p || !p.keyframes) die(`${seqName}: Offset without keyframed Shift Center To`);
    const ip = clip.inPoint || 0;
    const kfs = p.keyframes.map((k) => {
      const [vx, vy] = xy(k.v);
      let dx = r4(vx - 0.5), dy = r4(vy - 0.5);
      if (flipH) dx = -dx;
      if (flipV) dy = -dy;
      return { t: r4(clip.start + k.t - ip), dx, dy, ...handles(k) };
    });
    const movesX = kfs.some((k) => Math.abs(k.dx) > 1e-6);
    const movesY = kfs.some((k) => Math.abs(k.dy) > 1e-6);
    if (movesX && movesY) die(`${seqName}: stage moves BOTH axes — engine wrap is per-axis`);

    let mask = null, maskHash = null;
    const m = (e.masks || []).find((x) => x.matchName === 'AE.ADBE AEMask');
    if (m) {
      if (m.pathKeyframed) die(`${seqName}: KEYFRAMED mask path`);
      if (!m.path || m.path.error) die(`${seqName}: mask decode error ${JSON.stringify(m.path)}`);
      if (num(m['Mask Feather']) !== 0 || num(m['Mask Opacity']) !== 100 || num(m['Mask Expansion']) !== 0)
        die(`${seqName}: unexpected mask F/O/E`);
      if (String(m.p9) === 'true') die(`${seqName}: INVERTED mask`);
      mask = m.path.verts.map((v) => {
        if (Math.abs(v.ti[0] - v.a[0]) > 1e-4 || Math.abs(v.ti[1] - v.a[1]) > 1e-4 ||
            Math.abs(v.to[0] - v.a[0]) > 1e-4 || Math.abs(v.to[1] - v.a[1]) > 1e-4)
          die(`${seqName}: CURVED mask vertex`);
        let [x, y] = v.a;
        if (flipH) x = 1 - x;
        if (flipV) y = 1 - y;
        return [r4(x), r4(y)];
      });
      maskHash = m.pathHash;
    }
    stages.push({ maskHash, mask, kfs, axis: movesY ? 'y' : 'x' });
  }
  if (flipH || flipV) die(`${seqName}: unclosed flip sandwich`);
  return stages;
}

/** sfx lib file by MEASURED audio cut (window rounded to cs to dodge fp noise). */
function sfxFor(seqName, aud) {
  if (!aud || !/Skew_Simple_01/.test(aud.masterClipName || '')) die(`${seqName}: expected Skew_Simple_01 audio`);
  const inP = r4(aud.inPoint || 0);
  const win = Math.round((aud.end - aud.start) * 100); // cs
  const key = `${inP}|${win}`;
  const MAP = {
    '0|76': 'transitions/lib/sfx-glassbeveled-short.mp3',   // Beveled Short + Corner 2/3
    '0.12|80': 'transitions/lib/sfx-glassblocks.mp3',       // Blocks (source from 0.12!)
    '0|88': 'transitions/lib/sfx-glassblockscorner-92.mp3', // Corner 1
  };
  if (!MAP[key]) die(`${seqName}: unmapped audio cut in=${inP} win=${win}cs`);
  return MAP[key];
}

function buildRow(seq) {
  const m = seq.name.match(/^Glass (Beveled Short|Blocks Corner|Blocks) (\d) - (Up|Down|Left|Right|Horizontal|Vertical|Left Up|Left Down|Right Up|Right Down)$/);
  if (!m) die(`unrecognized name ${seq.name}`);
  const sub = m[1], famN = m[2], dir = m[3];

  const content = seq.clips.find((c) => c.track === 0);
  const inClip = seq.clips.find((c) => c.subClipName && /\(In\)$/.test(c.subClipName));
  const outClip = seq.clips.find((c) => c.subClipName && /\(Out\)$/.test(c.subClipName));
  if (!content || !inClip || !outClip) die(`${seq.name}: missing content/(In)/(Out)`);

  const durationSeconds = r4(content.end);
  const cut = r4(outClip.start / durationSeconds);

  const sIn = decodeStages(inClip, seq.name + ' (In)');
  const sOut = decodeStages(outClip, seq.name + ' (Out)');
  if (sIn.length !== sOut.length) die(`${seq.name}: stage count mismatch`);
  // Pair (In)<->(Out) stages BY MASK HASH, not position: some sequences (Blocks
  // Corner 3) stack the SAME panes in a DIFFERENT order after the cut. Stage list
  // = the (In) apply order; the (Out) order ships as an index permutation.
  const key = (s) => s.maskHash || 'UNMASKED';
  const outByKey = new Map(sOut.map((s, j) => [key(s), { s, j }]));
  if (outByKey.size !== sOut.length) die(`${seq.name}: duplicate mask hash — hash pairing ambiguous`);
  const stages = sIn.map((a) => {
    const hit = outByKey.get(key(a));
    if (!hit) die(`${seq.name}: (Out) has no stage for mask ${key(a)}`);
    if (a.axis !== hit.s.axis) die(`${seq.name}: axis mismatch for mask ${key(a)}`);
    return { mask: a.mask, curveIn: a.kfs, curveOut: hit.s.kfs };
  });
  // (Out) apply order as indices into the (In)-ordered stage list
  const inKeys = sIn.map(key);
  const outOrder = sOut.map((s) => inKeys.indexOf(key(s)));
  const samePos = outOrder.every((v, i) => v === i);

  const axes = new Set(sIn.map((s) => s.axis));
  const axis = axes.size > 1 ? 'xy' : [...axes][0];
  if (sub === 'Blocks Corner' && axis !== 'xy') die(`${seq.name}: Corner expected mixed axes`);

  const sfx = sfxFor(seq.name, (seq.audio || [])[0]);
  const nUnmasked = sIn.filter((s) => !s.mask).length;
  if (nUnmasked > 1) die(`${seq.name}: ${nUnmasked} unmasked stages`);

  const subSlug = slug(sub);
  const isCorner = sub === 'Blocks Corner';
  const isBlocks = sub === 'Blocks';
  const look = isCorner
    ? `rectangular row and column panes sweep toward the ${dir.toLowerCase()} corner (x and y pushes compounding diagonally)`
    : isBlocks
      ? (nUnmasked ? `rectangular panes split ${dir.toLowerCase()}ly in opposing directions over a base push` : `rectangular glass panes push toward ${dir.toLowerCase()}`)
      : (nUnmasked ? `${dir.toLowerCase()} split: shards push in OPPOSING directions over a full-frame base push` : `snappy faceted push toward ${dir.toLowerCase()}`);

  return {
    id: `glass-${subSlug}-${famN}-${slug(dir)}`,
    category: 'GLASS',
    variant: sub,
    intensity: `${famN} · ${dir}`,
    label: `Glass · ${sub} ${famN} · ${dir}`,
    engine: 'GlassBeveled',
    kind: 'geometric',
    fidelity: 'near-1:1',
    durationSeconds,
    params: { cut, axis, stages, ...(samePos ? {} : { outOrder }) },
    sfx,
    used_in: [],
    meta: {
      aspectRatios: ['16:9'],
      resolution: '1920x1080',
      family: `Glass ${sub}`,
      engineFile: 'remotion/src/transitions/engines/GlassBeveled.tsx',
      description: `Beveled-glass ${look}: staggered wrap-slides at offset phases compound where panes overlap into a glass refraction that peaks at the cut and settles seamlessly. The motion jumps ahead at the cut (hidden at peak faceting).`,
      energy: 'high',
      durationSeconds,
      hasSound: true,
      fidelity: 'near-1:1',
      tags: ['glass', subSlug, 'facet', 'pane', 'refraction', slug(dir), `${subSlug}-${famN}`],
      useWhen: `Stylish glass ${look} (~${durationSeconds}s). ${sub === 'Beveled Short' ? 'Snappier than plain Beveled.' : isCorner ? 'Diagonal corner energy.' : 'Blocky pane grid look.'}`,
    },
  };
}

const rows = clips.map(buildRow);
const libPath = path.join(__dirname, 'library.json');
const lib = JSON.parse(fs.readFileSync(libPath, 'utf8'));
const ids = new Set(rows.map((r) => r.id));
lib.transitions = lib.transitions.filter((r) => !ids.has(r.id));
lib.transitions.push(...rows);
fs.writeFileSync(libPath, JSON.stringify(lib, null, 2));
console.log(`built ${rows.length} rows; library now ${lib.transitions.length}`);
for (const sub of ['beveled-short', 'blocks-corner']) {
  const s = rows.find((r) => r.id.startsWith(`glass-${sub}`));
  console.log(s.id, '| axis', s.params.axis, '| stages', s.params.stages.length, '| sfx', s.sfx,
    '| in0->out0 skip check:', JSON.stringify({ inLast: s.params.stages[0].curveIn.map((k) => k.t), outT: s.params.stages[0].curveOut.map((k) => k.t) }));
}

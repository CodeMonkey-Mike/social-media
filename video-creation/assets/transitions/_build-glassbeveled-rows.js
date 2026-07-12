#!/usr/bin/env node
/** _glassbeveled-clips.json -> 12 GLASS/Beveled rows, engine GlassBeveled.
 *
 * Mechanism (decoded 2026-07-12): each sequence's (In)/(Out) HST Adjustment clips
 * stack FIVE AEMask-gated wrap-Offsets (straight-quad shards, feather 0, mode Add,
 * staggered 0.76s full-wrap phases) — plus, in Beveled 3/4, a SIXTH unmasked
 * full-frame push. Direction is encoded by PR H/V Flip SANDWICHES around subsets
 * of the stack; resolved here ANALYTICALLY (mirror mask coords + negate the shift)
 * so the engine gets flat stages in the REAL bottom-up apply order.
 *
 * Hard-fails (Rule 2 — never paper over unread source data) on: curved mask
 * vertices, feather/opacity/expansion != 0/100/0, inverted masks, keyframed mask
 * paths, mixed axes in one row, unclosed flip sandwiches, or (In)/(Out) stage
 * mismatches. Merges into library.json (replaces prior glass-beveled-* rows).
 */
const fs = require('fs');
const path = require('path');
const clips = require('./_glassbeveled-clips.json');

const num = (s) => (s == null ? null : +String(s).replace(/[^0-9eE.+-]/g, ''));
const xy = (v) => { const [a, b] = String(v).split(':'); return [num(a), num(b)]; };
const r4 = (n) => +n.toFixed(4);
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Temporal-bezier handles, same raw-row mapping as the OFFSET builder:
 * a = [value, interpA, interpB, inVel, inInf, outVel, outInf, ...spatial]. */
const handles = (k) => (k.a && k.a.length >= 7
  ? { iv: num(k.a[3]), ii: num(k.a[4]), ov: num(k.a[5]), oi: num(k.a[6]) }
  : {});

const die = (msg) => { throw new Error('GLASS BEVELED BUILD FAIL: ' + msg); };

/** One clip's effect list -> stages in APPLY order (bottom-up = reversed list),
 * flips resolved analytically. Returns [{maskHash, mask, kfs, axis}] */
function decodeStages(clip, seqName) {
  let flipH = false, flipV = false;
  const stages = [];
  const applyOrder = [...clip.effects].reverse();
  for (const e of applyOrder) {
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

    // mask (present on 5 of the offsets; absent on 3/4's base push)
    let mask = null, maskHash = null;
    const m = (e.masks || []).find((x) => x.matchName === 'AE.ADBE AEMask');
    if (m) {
      if (m.pathKeyframed) die(`${seqName}: KEYFRAMED mask path — not handled`);
      if (!m.path || m.path.error) die(`${seqName}: mask path decode error ${JSON.stringify(m.path)}`);
      if (num(m['Mask Feather']) !== 0 || num(m['Mask Opacity']) !== 100 || num(m['Mask Expansion']) !== 0)
        die(`${seqName}: unexpected mask F/O/E ${m['Mask Feather']}/${m['Mask Opacity']}/${m['Mask Expansion']}`);
      if (String(m.p9) === 'true') die(`${seqName}: INVERTED mask — not handled`);
      mask = m.path.verts.map((v) => {
        // straight-corner check: decoded tangents must coincide with the anchor
        if (Math.abs(v.ti[0] - v.a[0]) > 1e-4 || Math.abs(v.ti[1] - v.a[1]) > 1e-4 ||
            Math.abs(v.to[0] - v.a[0]) > 1e-4 || Math.abs(v.to[1] - v.a[1]) > 1e-4)
          die(`${seqName}: CURVED mask vertex ${JSON.stringify(v)} — engine draws straight polygons only`);
        let [x, y] = v.a;
        if (flipH) x = 1 - x;
        if (flipV) y = 1 - y;
        return [r4(x), r4(y)];
      });
      maskHash = m.pathHash;
    }
    stages.push({ maskHash, mask, kfs, flipped: flipH || flipV });
  }
  if (flipH || flipV) die(`${seqName}: unclosed flip sandwich`);
  return stages;
}

function buildRow(seq) {
  const m = seq.name.match(/^Glass Beveled (\d) - (Up|Down|Left|Right|Horizontal|Vertical)$/);
  if (!m) die(`unrecognized name ${seq.name}`);
  const famN = m[1], dir = m[2];

  const content = seq.clips.find((c) => c.track === 0);
  const inClip = seq.clips.find((c) => c.subClipName && /\(In\)$/.test(c.subClipName));
  const outClip = seq.clips.find((c) => c.subClipName && /\(Out\)$/.test(c.subClipName));
  if (!content || !inClip || !outClip) die(`${seq.name}: missing content/(In)/(Out) clip`);

  const durationSeconds = r4(content.end);
  const cut = r4(outClip.start / durationSeconds);

  const sIn = decodeStages(inClip, seq.name + ' (In)');
  const sOut = decodeStages(outClip, seq.name + ' (Out)');
  if (sIn.length !== sOut.length) die(`${seq.name}: (In) ${sIn.length} stages vs (Out) ${sOut.length}`);

  // pair by apply-order position; the (Out) curve must be the same shard
  const stages = sIn.map((a, i) => {
    const b = sOut[i];
    if (a.maskHash !== b.maskHash) die(`${seq.name}: stage ${i} mask mismatch ${a.maskHash} vs ${b.maskHash}`);
    return { mask: a.mask, curveIn: a.kfs, curveOut: b.kfs };
  });

  // single push axis per row (assert)
  const axes = new Set();
  for (const st of stages) for (const k of [...st.curveIn, ...st.curveOut]) {
    if (Math.abs(k.dx) > 1e-6) axes.add('x');
    if (Math.abs(k.dy) > 1e-6) axes.add('y');
  }
  if (axes.size !== 1) die(`${seq.name}: expected one push axis, got ${[...axes]}`);
  const axis = [...axes][0];

  // audio sanity: every variant ships Skew_Simple_01 at 0.04..1.04 in 0
  const aud = (seq.audio || [])[0];
  if (!aud || !/Skew_Simple_01/.test(aud.masterClipName || '')) die(`${seq.name}: expected Skew_Simple_01 audio`);

  const both = famN === '3' || famN === '4'; // opposing-direction facets + base push
  const nUnmasked = stages.filter((s) => !s.mask).length;
  if (both && nUnmasked !== 1) die(`${seq.name}: expected 1 unmasked base push, got ${nUnmasked}`);
  if (!both && nUnmasked !== 0) die(`${seq.name}: unexpected unmasked stage`);

  const dirDesc = both
    ? `${dir.toLowerCase()} split: shards push in OPPOSING directions over a full-frame base push`
    : `push toward ${dir.toLowerCase()}`;

  return {
    id: `glass-beveled-${famN}-${slug(dir)}`,
    category: 'GLASS',
    variant: 'Beveled',
    intensity: `${famN} · ${dir}`,
    label: `Glass · Beveled ${famN} · ${dir}`,
    engine: 'GlassBeveled',
    kind: 'geometric',
    fidelity: 'near-1:1',
    durationSeconds,
    params: { cut, axis, stages },
    sfx: 'transitions/lib/sfx-glassbeveled.mp3',
    used_in: [],
    meta: {
      aspectRatios: ['16:9'],
      resolution: '1920x1080',
      family: 'Glass Beveled',
      engineFile: 'remotion/src/transitions/engines/GlassBeveled.tsx',
      description: `Beveled-glass facet ${dirDesc}: five staggered diagonal shards wrap-slide the frame at offset phases, compounding where they overlap into a faceted refraction that peaks at the cut and settles seamlessly.`,
      energy: 'high',
      durationSeconds,
      hasSound: true,
      fidelity: 'near-1:1',
      tags: ['glass', 'beveled', 'facet', 'shard', 'refraction', slug(dir), `beveled-${famN}`],
      useWhen: `Stylish faceted ${dirDesc} (~${durationSeconds}s); reads as a beveled glass pane sweeping the cut. Slower/classier than the OFFSET whips.`,
    },
  };
}

const rows = clips.map(buildRow);
const libPath = path.join(__dirname, 'library.json');
const lib = JSON.parse(fs.readFileSync(libPath, 'utf8'));
lib.transitions = lib.transitions.filter((r) => !(r.category === 'GLASS' && r.engine === 'GlassBeveled'));
lib.transitions.push(...rows);
fs.writeFileSync(libPath, JSON.stringify(lib, null, 2));
console.log(`built ${rows.length} GlassBeveled rows; library now ${lib.transitions.length}`);
const s = rows.find((r) => r.id === 'glass-beveled-1-left');
console.log('1-left:', JSON.stringify({
  cut: s.params.cut, axis: s.params.axis, stages: s.params.stages.length,
  stage0: { mask: s.params.stages[0].mask, in0: s.params.stages[0].curveIn[0], in1: s.params.stages[0].curveIn[1] },
}, null, 1));
const h = rows.find((r) => r.id === 'glass-beveled-3-horizontal');
console.log('3-horizontal signs:', h.params.stages.map((st) => st.curveIn[st.curveIn.length - 1].dx || st.curveIn[st.curveIn.length - 1].dy).join(','), '| masks:', h.params.stages.map((st) => (st.mask ? 'quad' : 'FULL')).join(','));

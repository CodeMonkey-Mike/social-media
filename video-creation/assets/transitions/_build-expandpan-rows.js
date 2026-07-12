#!/usr/bin/env node
/** _expandpan-clips.json -> 8 EXPAND Pan rows (Pan + Pan Short x 4 dirs), engine
 * ExpandPan. Piecewise data with bezier handles: (In)/(Out) AECrop curves (the
 * expand edge-stretch; anchor = 1 when the cropped side is the LOW-coordinate
 * side Left/Top, else 0) + Geometry2 Position pan curves (screen fractions,
 * Position − 0.5, on the direction axis). SFX Simple_SFX.mp3 truncated to the
 * family window (Pan 1.24s / Short 0.64s), real in-point 0.08.
 * Merges into library.json (replaces prior EXPAND rows).
 */
const fs = require('fs');
const path = require('path');
const clips = require('./_expandpan-clips.json');

const num = (s) => (s == null ? null : +String(s).replace(/[^0-9eE.+-]/g, ''));
const r4 = (n) => +n.toFixed(4);
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const handles = (k) => (k.a && k.a.length >= 7
  ? { iv: num(k.a[3]), ii: num(k.a[4]), ov: num(k.a[5]), oi: num(k.a[6]) }
  : {});

// scalar param kfs -> seq time
function kfsOf(c, matchName, paramName, map = (v) => num(v)) {
  const eff = (c.effects || []).find((e) => e.matchName === matchName);
  if (!eff) return null;
  const p = eff.params.find((x) => x.name === paramName);
  if (!p || !p.keyframes) return null;
  const ip = c.inPoint || 0;
  return p.keyframes.map((k) => ({ t: r4(c.start + k.t - ip), v: map(k.v), ...handles(k) }));
}

function buildRow(seq) {
  const m = seq.name.match(/^Expand (Pan(?: Short)?) - (Up|Down|Left|Right)$/);
  const variant = m[1], dir = m[2];
  const axis = (dir === 'Left' || dir === 'Right') ? 'x' : 'y';
  const content = seq.clips.find((c) => c.track === 0);
  const durationSeconds = content.end;

  const inCropClip = seq.clips.find((c) => c.subClipName && /\(In\)/i.test(c.subClipName));
  const outCropClip = seq.clips.find((c) => c.subClipName && /\(Out\)/i.test(c.subClipName));
  const rigs = seq.clips.filter((c) => c.subClipName === 'Offset');
  const rigIn = rigs[0], rigOut = rigs[1];

  // which crop side is keyframed
  const cropSide = (c) => {
    const eff = c.effects.find((e) => e.matchName === 'AE.ADBE AECrop');
    for (const p of eff.params) if (p.keyframes) return p.name; // Left/Top/Right/Bottom
    return null;
  };
  const inSide = cropSide(inCropClip), outSide = cropSide(outCropClip);
  const anchorFor = (side) => (side === 'Left' || side === 'Top') ? 1 : 0;

  // pan curves: Position on the axis, as screen fractions (pos − 0.5)
  const posMap = (v) => {
    const [x, y] = String(v).split(':').map(num);
    return r4((axis === 'x' ? x : y) - 0.5);
  };
  const panIn = kfsOf(rigIn, 'AE.ADBE Geometry2', 'Position', posMap);
  const panOut = kfsOf(rigOut, 'AE.ADBE Geometry2', 'Position', posMap);

  const cut = r4(outCropClip.start / durationSeconds);
  const isShort = /Short/.test(variant);
  const sfx = `transitions/lib/sfx-expandpan${isShort ? '-short' : ''}.mp3`;

  return {
    id: `expand-${slug(variant)}-${slug(dir)}`,
    category: 'EXPAND',
    variant,
    intensity: dir,
    label: `Expand · ${variant} · ${dir}`,
    engine: 'ExpandPan',
    kind: 'geometric',
    fidelity: 'near-1:1',
    durationSeconds,
    params: {
      cut,
      axis,
      inWin: [r4(inCropClip.start), r4(inCropClip.end)],
      inCrop: kfsOf(inCropClip, 'AE.ADBE AECrop', inSide),
      inAnchor: anchorFor(inSide),
      outWin: [r4(outCropClip.start), r4(outCropClip.end)],
      outCrop: kfsOf(outCropClip, 'AE.ADBE AECrop', outSide),
      outAnchor: anchorFor(outSide),
      panIn,
      panInWin: [r4(rigIn.start), r4(rigIn.end)],
      panOut,
      panOutWin: [r4(rigOut.start), r4(rigOut.end)],
    },
    sfx,
    used_in: [],
    meta: {
      aspectRatios: ['16:9'],
      resolution: '1920x1080',
      family: 'Expand Pan',
      engineFile: 'remotion/src/transitions/engines/ExpandPan.tsx',
      description: `Edge-stretch pan toward ${dir.toLowerCase()}: the outgoing frame smears into stretched streak bands as it wipes off, the incoming frame expands back from a stretched sliver and glides to rest on a mirror-padded pan. ${isShort ? 'Short: fast and punchy.' : 'Full-length, cinematic settle.'}`,
      energy: 'high',
      durationSeconds,
      hasSound: true,
      fidelity: 'near-1:1',
      tags: ['expand', 'pan', 'stretch', 'wipe', 'push', slug(dir), ...(isShort ? ['short'] : [])],
      useWhen: `Scene-change push toward ${dir.toLowerCase()} (~${durationSeconds}s) with the signature stretched-edge smear; great for location/topic changes. ${isShort ? 'Snappy version.' : ''}`.trim(),
    },
  };
}

const rows = clips.map(buildRow);
const libPath = path.join(__dirname, 'library.json');
const lib = JSON.parse(fs.readFileSync(libPath, 'utf8'));
lib.transitions = lib.transitions.filter((r) => r.category !== 'EXPAND');
lib.transitions.push(...rows);
fs.writeFileSync(libPath, JSON.stringify(lib, null, 2));
console.log(`built ${rows.length} EXPAND rows; library now ${lib.transitions.length}`);
const s = rows.find((r) => r.id === 'expand-pan-right');
console.log('pan-right:', JSON.stringify({ cut: s.params.cut, axis: s.params.axis, inAnchor: s.params.inAnchor, outAnchor: s.params.outAnchor, panIn: s.params.panIn, inWin: s.params.inWin, outWin: s.params.outWin }));

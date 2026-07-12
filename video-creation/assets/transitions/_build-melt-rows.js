#!/usr/bin/env node
/** _melt-clips.json -> 30 MELT rows: Equidistant 4 + Equidistant Short 4 (engine
 * MeltEquidistant, VR-projection tilt/roll) and RGB 7 + RGB Soft 4 + RGB Short 7
 * + RGB Soft Short 4 (engine MeltRGB, Mettle chromatic-aberration channel split).
 * Variant folders mirror the pack preview tree (Soft lives inside RGB / RGB Short).
 * Hard-fails on: unexpected effects/windows/rates, missing curves, non-zero audio
 * in-points, unmapped audio windows. Merges into library.json.
 */
const fs = require('fs');
const path = require('path');
const clips = require('./_melt-clips.json');

const num = (s) => (s == null ? null : +String(s).replace(/[^0-9eE.+-]/g, ''));
const xy = (v) => { const [a, b] = String(v).split(':'); return [num(a), num(b)]; };
const r4 = (n) => +n.toFixed(4);
const die = (msg) => { throw new Error('MELT BUILD FAIL: ' + msg); };
const handles = (k) => (k.a && k.a.length >= 7
  ? { iv: num(k.a[3]), ii: num(k.a[4]), ov: num(k.a[5]), oi: num(k.a[6]) }
  : {});

const rate1 = (c, nm) => {
  const w = c.end - c.start, m = (c.outPoint ?? 0) - (c.inPoint ?? 0);
  if (Math.abs(m - w) > 1e-6) die(`${nm}: clip rate != 1 (${m}/${w})`);
  if (c.timeRemap) die(`${nm}: unexpected time remap`);
};

const scalarKfs = (clip, eff, name, nm) => {
  const p = eff.params.find((x) => x.name === name);
  if (!p) die(`${nm}: missing param ${name}`);
  const ip = clip.inPoint || 0;
  if (!p.keyframes) return [{ t: r4(clip.start), v: num(p.value) }];
  return p.keyframes.map((k) => ({ t: r4(clip.start + k.t - ip), v: num(k.v), ...handles(k) }));
};
const pointKfs = (clip, eff, name, nm) => {
  const p = eff.params.find((x) => x.name === name);
  if (!p || !p.keyframes) die(`${nm}: missing 2D ${name}`);
  const ip = clip.inPoint || 0;
  return p.keyframes.map((k) => {
    const [x, y] = xy(k.v);
    return { t: r4(clip.start + k.t - ip), x: r4(x), y: r4(y), ...handles(k) };
  });
};

// audio window -> sfx lib file (built from the real sources, in-point 0, 30ms guard)
const SFX = {
  'Optics_02|84': 'transitions/lib/sfx-melt-eq-84.mp3',
  'Optics_02|44': 'transitions/lib/sfx-melt-eq-44.mp3',
  'Lens_01|76': 'transitions/lib/sfx-melt-rgb-76.mp3',
  'Lens_01|84': 'transitions/lib/sfx-melt-rgb-84.mp3',
  'Lens_01|44': 'transitions/lib/sfx-melt-rgb-44.mp3',
  'Lens_01|60': 'transitions/lib/sfx-melt-rgb-60.mp3',
};

function buildRow(seq) {
  const m = seq.name.match(/^Melt (Equidistant|Equidistant Short|RGB|RGB Soft|RGB Short|RGB Soft Short) - (\d)$/);
  if (!m) die(`unrecognized ${seq.name}`);
  const fam = m[1], n = +m[2];
  const content = seq.clips.find((c) => c.track === 0);
  const inClip = seq.clips.find((c) => /\(in\)$/i.test(c.subClipName || ''));   // Soft-4 uses "(in)"
  const outClip = seq.clips.find((c) => /\(out\)$/i.test(c.subClipName || ''));
  if (!content || !inClip || !outClip) die(`${seq.name}: missing clips`);
  rate1(inClip, seq.name + ' (In)');
  rate1(outClip, seq.name + ' (Out)');

  const durationSeconds = r4(content.end);
  const cut = r4(outClip.start / durationSeconds);

  const aud = (seq.audio || [])[0];
  if (!aud || aud.start !== 0 || (aud.inPoint || 0) !== 0) die(`${seq.name}: audio ${JSON.stringify(aud)}`);
  const sfxKey = `${(aud.masterClipName || '').replace(/\.(wav|mp3)$/, '')}|${Math.round((aud.end - aud.start) * 100)}`;
  const sfx = SFX[sfxKey] || die(`${seq.name}: unmapped audio ${sfxKey}`);

  const isEq = /^Equidistant/.test(fam);
  let engine, params, look;
  if (isEq) {
    const effIn = inClip.effects.find((e) => e.matchName === 'AE.ADBE VR Projection') || die(`${seq.name}: no VR Projection`);
    const effOut = outClip.effects.find((e) => e.matchName === 'AE.ADBE VR Projection');
    for (const [c, e] of [[inClip, effIn], [outClip, effOut]]) {
      const proj = e.params.find((p) => p.name === 'Input Projection');
      if (num(proj.value) !== 1) die(`${seq.name}: projection ${proj.value}`);
    }
    const axisName = ['Tilt', 'Roll'].find((k) => (effIn.params.find((p) => p.name === k) || {}).keyframes);
    if (!axisName) die(`${seq.name}: no keyframed Tilt/Roll`);
    // the un-keyframed rotations must be static 0
    for (const k of ['Pan', 'Tilt', 'Roll']) {
      if (k === axisName) continue;
      const p = effIn.params.find((x) => x.name === k);
      if (p && p.keyframes) die(`${seq.name}: second keyframed rotation ${k}`);
      if (p && Math.abs(num(p.value)) > 1e-6) die(`${seq.name}: nonzero static ${k}`);
    }
    engine = 'MeltEquidistant';
    params = {
      cut,
      axis: axisName.toLowerCase(),
      curveIn: scalarKfs(inClip, effIn, axisName, seq.name),
      curveOut: scalarKfs(outClip, effOut, axisName, seq.name),
    };
    const dir = params.curveIn[params.curveIn.length - 1].v < 0 ? (axisName === 'Tilt' ? 'down' : 'counter-clockwise') : (axisName === 'Tilt' ? 'up' : 'clockwise');
    look = `spherical melt (${axisName.toLowerCase()} ${dir}): the frame wraps into swirling pole vortices at the cut and the new scene unwinds back`;
  } else {
    const effIn = inClip.effects.find((e) => e.matchName === 'AE.Mettle SkyBox Chromatic Aberrations') || die(`${seq.name}: no Mettle CA`);
    const effOut = outClip.effects.find((e) => e.matchName === 'AE.Mettle SkyBox Chromatic Aberrations');
    const fall = num(effIn.params.find((p) => p.name === 'Falloff Distance').value);
    const layout = num(effIn.params.find((p) => p.name === 'Frame Layout').value);
    if (layout !== 0) die(`${seq.name}: frame layout ${layout}`);
    const inv = effIn.params.find((p) => p.name === 'Falloff Invert');
    const inverted = !!(inv && String(inv.value) === 'true'); // Soft 2-4 (+Short twins)
    engine = 'MeltRGB';
    params = {
      cut,
      falloff: fall,
      ...(inverted ? { invert: true } : {}),
      r: { curveIn: scalarKfs(inClip, effIn, 'Aberration (Red)', seq.name), curveOut: scalarKfs(outClip, effOut, 'Aberration (Red)', seq.name) },
      g: { curveIn: scalarKfs(inClip, effIn, 'Aberration (Green)', seq.name), curveOut: scalarKfs(outClip, effOut, 'Aberration (Green)', seq.name) },
      b: { curveIn: scalarKfs(inClip, effIn, 'Aberration (Blue)', seq.name), curveOut: scalarKfs(outClip, effOut, 'Aberration (Blue)', seq.name) },
      poi: { curveIn: pointKfs(inClip, effIn, 'Point of Interest', seq.name), curveOut: pointKfs(outClip, effOut, 'Point of Interest', seq.name) },
    };
    const peak = (c) => { const k = c.curveIn.find((x) => Math.abs(x.v) > 0.01); return k ? Math.round(k.v) : 0; };
    look = `RGB channel melt (R${peak(params.r) >= 0 ? '+' : ''}${peak(params.r)}/G${peak(params.g) >= 0 ? '+' : ''}${peak(params.g)}/B${peak(params.b) >= 0 ? '+' : ''}${peak(params.b)}${/Soft/.test(fam) ? ', soft falloff' : ''}): the channels scale apart around a drifting center, saturating the frame in spectral ghosting at the cut`;
  }

  const variant = /^Equidistant Short/.test(fam) ? 'Equidistant Short'
    : /^Equidistant/.test(fam) ? 'Equidistant'
    : /Short/.test(fam) ? 'RGB Short' : 'RGB'; // Soft lives inside RGB / RGB Short (pack tree)
  const slug = fam.toLowerCase().replace(/ /g, '-');

  return {
    id: `melt-${slug}-${n}`,
    category: 'MELT',
    variant,
    intensity: `${/Soft/.test(fam) ? 'Soft ' : ''}${n}`,
    label: `Melt · ${fam} · ${n}`,
    engine,
    kind: 'shader',
    fidelity: 'approximate',
    durationSeconds,
    params,
    sfx,
    used_in: [],
    meta: {
      aspectRatios: ['16:9'],
      resolution: '1920x1080',
      family: `Melt ${fam}`,
      engineFile: `remotion/src/transitions/engines/${engine}.tsx`,
      description: `${look.charAt(0).toUpperCase() + look.slice(1)}; settles clean. ${isEq ? 'Canvas spherical reprojection (image content; video TODO).' : 'Pure affine channel scaling, no maps.'}`,
      energy: /Short/.test(fam) ? 'high' : 'medium',
      durationSeconds,
      hasSound: true,
      fidelity: 'approximate',
      tags: ['melt', slug, ...(isEq ? ['spherical', 'vortex', 'warp'] : ['rgb', 'chromatic', 'channel-split', 'psychedelic'])],
      useWhen: `${/Short/.test(fam) ? 'Fast' : 'Statement'} ${isEq ? 'spherical melt' : 'RGB-split melt'} cut (~${durationSeconds}s); ${isEq ? 'surreal spatial collapse' : 'trippy spectral burst'}.`,
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
console.log(`built ${rows.length} MELT rows; library now ${lib.transitions.length}`);
for (const id of ['melt-equidistant-1', 'melt-equidistant-3', 'melt-rgb-1', 'melt-rgb-soft-4']) {
  const r = rows.find((x) => x.id === id);
  console.log(' ', id, r.engine, 'cut=' + r.params.cut, r.params.axis || `falloff=${r.params.falloff}`,
    r.params.curveIn ? 'in:' + r.params.curveIn.map((k) => k.t + '@' + k.v).join('|') : 'poiIn:' + r.params.poi.curveIn.map((k) => `${k.t}@${k.x},${k.y}`).join('|'));
}

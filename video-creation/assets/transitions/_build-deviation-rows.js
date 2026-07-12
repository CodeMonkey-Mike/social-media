#!/usr/bin/env node
/** _deviation-clips.json -> DEVIATION library rows: ALL Optics (1x-4x) + Shift 4x
 * ONLY (Mike's selection, 2026-07-11). Engine DeviationGlitch. Piecewise (In)/(Out)
 * Color Distortion + (Optics) Lens Distortion curves with bezier handles, exactly
 * like the OFFSET builder. No SFX (pack ships this category silent — verified
 * FullHD + 4K audio groups empty, previews video-only; Optics_0N.wav unreferenced).
 * Merges into library.json (removes prior DEVIATION rows first).
 */
const fs = require('fs');
const path = require('path');
const clips = require('./_deviation-clips.json');

const num = (s) => (s == null ? null : +String(s).replace(/[^0-9eE.+-]/g, ''));
const r4 = (n) => +n.toFixed(4);
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Mike's selection: all Optics + only Shift 4x
const WANTED = ['Deviation Optics - 1x', 'Deviation Optics - 2x', 'Deviation Optics - 3x',
  'Deviation Optics - 4x', 'Deviation Shift - 4x'];

const handles = (k) => (k.a && k.a.length >= 7
  ? { iv: num(k.a[3]), ii: num(k.a[4]), ov: num(k.a[5]), oi: num(k.a[6]) }
  : {});

// a clip's scalar param keyframes -> seq-time list with handles
function clipKfs(c, matchName, paramName) {
  const eff = (c.effects || []).find((e) => e.matchName === matchName);
  if (!eff) return null;
  const p = eff.params.find((x) => x.name === paramName);
  if (!p || !p.keyframes) return null;
  const ip = c.inPoint || 0;
  return p.keyframes.map((k) => ({ t: r4(c.start + k.t - ip), v: num(k.v), ...handles(k) }));
}

function buildRow(seq) {
  const m = seq.name.match(/^Deviation (Optics|Shift) - (\dx)$/);
  const variant = m[1], intensity = m[2];
  const content = seq.clips.find((c) => c.track === 0);
  const durationSeconds = content.end;
  const inClip = seq.clips.find((c) => c.subClipName && /\(In\)/i.test(c.subClipName));
  const outClip = seq.clips.find((c) => c.subClipName && /\(Out\)/i.test(c.subClipName));
  const cut = r4(outClip.start / durationSeconds);

  const MET = 'AE.Mettle SkyBox Digital Glitch';
  const geomEff = inClip.effects.find((e) => e.matchName === MET);
  const geomX = num((geomEff.params.find((p) => p.name === 'Geometry Distortion X') || {}).value) || 100;
  const geomY = num((geomEff.params.find((p) => p.name === 'Geometry Distortion Y') || {}).value) || 100;

  const params = {
    cut,
    colorIn: clipKfs(inClip, MET, 'Color Distortion'),
    colorOut: clipKfs(outClip, MET, 'Color Distortion'),
    geomX, geomY,
  };
  const lensIn = clipKfs(inClip, 'PR.ADBE Lens Distortion', 'Curvature');
  const lensOut = clipKfs(outClip, 'PR.ADBE Lens Distortion', 'Curvature');
  if (lensIn && lensOut) { params.lensIn = lensIn; params.lensOut = lensOut; }

  const isOptics = variant === 'Optics';
  return {
    id: `deviation-${slug(variant)}-${intensity}`,
    category: 'DEVIATION',
    variant,
    intensity,
    label: `Deviation · ${variant} · ${intensity}`,
    engine: 'DeviationGlitch',
    kind: 'shader',
    fidelity: 'approximate',
    durationSeconds,
    params,
    sfx: null,
    // Shift demos play over ONE continuous image (Mike's call 2026-07-11): its
    // real use is punch-ins / jump cuts of the same scene, so the gallery shows
    // the image itself shifting, not a cut into different content.
    ...(variant === 'Shift' ? { demoSameScene: true } : {}),
    used_in: [],
    meta: {
      aspectRatios: ['16:9'],
      resolution: '1920x1080',
      family: 'Deviation',
      engineFile: 'remotion/src/transitions/engines/DeviationGlitch.tsx',
      description: `Chromatic-tear accent: a smooth wavy RGB-split ripples across the frame, peaking at the cut, then resolves${isOptics ? ', riding a gentle lens bulge (Optics)' : ''}. Content stays readable throughout — a soft glitch accent, not an obliterating one. ${intensity} intensity.`,
      energy: 'medium',
      durationSeconds,
      hasSound: false,
      fidelity: 'approximate',
      tags: ['deviation', 'chromatic', 'rgb-split', 'aberration', slug(variant), intensity, ...(isOptics ? ['lens', 'bulge'] : [])],
      useWhen: `Soft glitch accent over a cut (~${durationSeconds}s); the scene stays legible under a chromatic tear${isOptics ? ' + lens bulge' : ''}. No pack SFX (ships silent; add a hit manually if the edit needs one).`,
    },
  };
}

const rows = clips.filter((s) => WANTED.includes(s.name)).map(buildRow);

const libPath = path.join(__dirname, 'library.json');
const lib = JSON.parse(fs.readFileSync(libPath, 'utf8'));
lib.transitions = lib.transitions.filter((r) => r.category !== 'DEVIATION');
lib.transitions.push(...rows);
fs.writeFileSync(libPath, JSON.stringify(lib, null, 2));
console.log(`built ${rows.length} DEVIATION rows (${rows.map((r) => r.id).join(', ')}); library now ${lib.transitions.length} rows`);
console.log('optics-4x params:', JSON.stringify(rows.find((r) => r.id === 'deviation-optics-4x').params).slice(0, 400));

#!/usr/bin/env node
/** _transform-clips.json -> 40 TRANSFORM rows (8 subgroups: 1/2/3/4 + Short twins).
 *
 * Mechanism (all 40 assert-verified; effect set CLOSED = Alpha Adjust + Motion
 * Blur + Offset + Basic 3D + Geometry2 + H/V Flips, nothing else):
 *   - (In)/(Out) HST Adjustments: densely 25fps-baked 2D wrap-Offset curve (the
 *     push ARCS — both axes keyframed; (Out) starts multiple wraps out) + AE
 *     Motion Blur with KEYFRAMED Direction (tracks the path tangent) + Length.
 *   - Full-window "3D" HST Adjustment: Basic 3D Swivel/Tilt/Distance (sparse
 *     real-bezier curves, per subgroup) over Geometry2 uniform scale (rides
 *     Scale HEIGHT, SW static 100 — the PERSPECTIVE rule). Bottom-up: scale
 *     first, then pose.
 *   - Directions = flip sandwiches around identical curves (balanced pairs on
 *     (In)/(Out), a single flip on 3D whose parity must match). Preview-proved
 *     content stays UPRIGHT -> flips mirror the MOTION only; resolved HERE:
 *     H: dx -> -dx, blur angle phi -> 180-phi, swivel -> -swivel;
 *     V: dy -> -dy, phi -> -phi, tilt -> -tilt. (Scale/Distance invariant.)
 *   - Blur Direction is converted to blur-axis SCREEN angle phi = 90 - D (the
 *     OffsetSlide convention), velocities negated at conversion.
 *
 * SFX by MEASURED (media, start, in-point, window), asserted:
 *   Long:  Camera_Flight_Long_01.mp3  @0.04 ip 0      win 1.52 -> sfx-transform-152.mp3
 *   Short: Camera_Flight_Short_01.mp3 @0.04 ip 0.1351 win 0.72 -> sfx-transform-short-72.mp3
 *   (0.04 lead baked into the lib file, 30ms tail guard — the GLASS rule.)
 *
 * Hard-fails on any deviation (Rule 2). Replaces only category TRANSFORM rows.
 * Known pack quirks shipped as-is (real values): "Transform Short 1 - Up
 * Rightt (In)" subclip typo (classified by shape, not name); "Transform Short
 * 3 - Right Down" cuts at 0.24 vs its siblings' 0.28 (hand-authored).
 */
const fs = require('fs');
const path = require('path');
const clips = require('./_transform-clips.json');

const num = (s) => (s == null ? null : +String(s).replace(/[^0-9eE.+-]/g, ''));
const r4 = (n) => +n.toFixed(4);
const assert = (cond, msg) => { if (!cond) throw new Error('ASSERT: ' + msg); };
const near = (a, b, eps = 1e-3) => Math.abs(a - b) < eps;
const xy = (v) => String(v).split(':').map(num);
const pget = (eff, n) => eff.params.find((x) => x.name.trim() === n || x.name.trim().startsWith(n));
const handles = (k) => (k.a && k.a.length >= 7
  ? { iv: num(k.a[3]), ii: num(k.a[4]), ov: num(k.a[5]), oi: num(k.a[6]) }
  : {});

// flip parity of an effect list: [hOdd, vOdd, count]
function flipParity(effs, name) {
  let h = 0, v = 0;
  for (const e of effs) {
    if (e.matchName === 'PR.ADBE Horizontal Flip') h++;
    else if (e.matchName === 'PR.ADBE Vertical Flip') v++;
    else assert(!/Flip/.test(e.matchName), 'unknown flip ' + e.matchName + ' in ' + name);
  }
  return { h, v };
}

function pushPhase(c, name, mirH, mirV) {
  const ip = c.inPoint || 0;
  assert(near(c.outPoint - c.inPoint, c.end - c.start, 2e-3), 'clip rate != 1 in ' + name);
  const nf = c.effects.filter((e) => !/Flip/.test(e.matchName));
  assert(nf.map((e) => e.matchName).join('|') === 'AE.ADBE Alpha Adjust|AE.ADBE Motion Blur|AE.ADBE Offset',
    'push clip effects off in ' + name);
  const [al, mb, off] = nf;
  const op = pget(al, 'Opacity');
  assert(!op.keyframes && num(op.value) === 100, 'Alpha Adjust not static 100 in ' + name);
  assert(num(pget(off, 'Blend With Original').value) === 0, 'Blend With Original != 0 in ' + name);
  for (const e of nf) assert(!e.masks || !e.masks.length, 'unexpected mask in ' + name);

  const seqT = (t) => r4(c.start + t - ip);
  // wrap-offset curve (dense 25fps bake — assert spacing)
  const sc = pget(off, 'Shift Center To');
  assert(sc.keyframes && sc.keyframes.length >= 2, 'Offset not keyframed in ' + name);
  const sgnX = mirH ? -1 : 1, sgnY = mirV ? -1 : 1;
  const curve = sc.keyframes.map((k) => {
    const [x, y] = xy(k.v);
    return { t: seqT(k.t), dx: r4(sgnX * (x - 0.5)), dy: r4(sgnY * (y - 0.5)), ...handles(k) };
  });
  for (let i = 1; i < curve.length; i++) {
    assert(near(curve[i].t - curve[i - 1].t, 0.04, 2e-3), `offset kf spacing off @${curve[i].t} in ` + name);
  }
  // motion blur: keyframed Direction -> blur-axis screen angle phi = 90 - D
  // (velocities negate with the sign flip); Length clamped >= 0 in the engine
  const dirP = pget(mb, 'Direction'), lenP = pget(mb, 'Blur Length');
  assert(dirP.keyframes && lenP.keyframes, 'Motion Blur not keyframed in ' + name);
  const mirrorPhi = (phi) => {
    let v = phi;
    if (mirH) v = 180 - v;
    if (mirV) v = -v;
    return v;
  };
  const dirSgn = (mirH ? -1 : 1) * (mirV ? -1 : 1); // d(phi')/d(phi), and dphi/dD = -1
  const dir = dirP.keyframes.map((k) => {
    const h = handles(k);
    return {
      t: seqT(k.t), v: r4(mirrorPhi(90 - num(k.v))),
      ...(h.iv !== undefined ? { iv: -dirSgn * h.iv, ii: h.ii, ov: -dirSgn * h.ov, oi: h.oi } : {}),
    };
  });
  const len = lenP.keyframes.map((k) => ({ t: seqT(k.t), v: r4(num(k.v)), ...handles(k) }));
  return { curve, blur: { window: [r4(c.start), r4(c.end)], dir, len } };
}

function posePhase(c, name, mirH, mirV) {
  const ip = c.inPoint || 0;
  const nf = c.effects.filter((e) => !/Flip/.test(e.matchName));
  assert(nf.map((e) => e.matchName).join('|') === 'AE.ADBE Basic 3D|AE.ADBE Geometry2',
    '3D clip effects off in ' + name);
  const [b3, g2] = nf;
  for (const [n, want] of [['Anchor Point', '0.5:0.5'], ['Position', '0.5:0.5'], ['Scale Width', '100.'],
    ['Skew', '0.'], ['Rotation', '0.'], ['Opacity', '100.'], ['Shutter Angle', '0.']]) {
    const p = pget(g2, n);
    assert(p && p.value === want && !p.keyframes, `3D Geometry2 ${n} != ${want} in ` + name);
  }
  assert(pget(b3, 'Specular Highlight').value === 'false', 'Specular on in ' + name);
  const seqT = (t) => r4(c.start + t - ip);
  const scalar = (p, sgn) => {
    const par = pget(p === 'Scale Height' ? g2 : b3, p);
    assert(par.keyframes && par.keyframes.length >= 2, p + ' not keyframed in ' + name);
    return par.keyframes.map((k) => {
      const h = handles(k);
      return {
        t: seqT(k.t), v: r4(sgn * num(k.v)),
        ...(h.iv !== undefined ? { iv: sgn * h.iv, ii: h.ii, ov: sgn * h.ov, oi: h.oi } : {}),
      };
    });
  };
  const swivel = scalar('Swivel', mirH ? -1 : 1);
  const tilt = scalar('Tilt', mirV ? -1 : 1);
  const dist = scalar('Distance to Image', 1);
  const scaleH = scalar('Scale Height', 1);
  // pose curves start AND end at rest (identity outside the window is real)
  for (const [nm, kfs, idv] of [['swivel', swivel, 0], ['tilt', tilt, 0], ['dist', dist, 0], ['scaleH', scaleH, 100]]) {
    assert(near(kfs[0].v, idv, 0.01) && near(kfs[kfs.length - 1].v, idv, 0.01),
      `pose ${nm} does not start/end at rest in ` + name);
  }
  return { window: [r4(c.start), r4(c.end)], swivel, tilt, dist, scaleH };
}

const sfxSpecs = new Map();
function buildRow(seq) {
  assert(!seq.error, seq.name + ': ' + seq.error);
  const name = seq.name;
  const m = name.match(/^Transform (Short )?(\d) - (.+)$/);
  assert(m, 'unexpected name ' + name);
  const isShort = !!m[1];
  const group = m[2];
  const dirName = m[3];
  const folder = (isShort ? 'Short ' : '') + group;

  assert(seq.clips.length === 4, seq.clips.length + ' clips in ' + name);
  const media = seq.clips.find((c) => /\.mp4$/.test(c.subClipName || ''));
  const inC = seq.clips.find((c) => /\(in\)/i.test(c.subClipName || ''));
  const outC = seq.clips.find((c) => /\(out\)/i.test(c.subClipName || ''));
  const d3 = seq.clips.find((c) => c.subClipName === '3D');
  assert(media && inC && outC && d3, 'classification failed in ' + name);
  assert(near(media.start, 0), 'media not at 0 in ' + name);
  const dur = r4(media.end);
  const cutT = r4(outC.start);
  assert(near(inC.end, cutT), '(In) does not end at the cut in ' + name);
  const cut = r4(cutT / dur);

  // flips: balanced sandwiches on (In)/(Out); a single flip per axis on 3D;
  // parities must agree — the row's mirror = the 3D layer's flip set
  const fIn = flipParity(inC.effects, name), fOut = flipParity(outC.effects, name),
    f3 = flipParity(d3.effects, name);
  assert(fIn.h % 2 === 0 && fIn.v % 2 === 0, 'unbalanced (In) sandwich in ' + name);
  assert(fOut.h === fIn.h && fOut.v === fIn.v, '(Out) flips != (In) flips in ' + name);
  assert(f3.h <= 1 && f3.v <= 1, '3D flip count off in ' + name);
  assert(f3.h === fIn.h / 2 && f3.v === fIn.v / 2, 'flip parity In vs 3D off in ' + name);
  const mirH = f3.h === 1, mirV = f3.v === 1;

  const pIn = pushPhase(inC, name + ' (In)', mirH, mirV);
  const pOut = pushPhase(outC, name + ' (Out)', mirH, mirV);
  // (In) starts at identity; (Out) settles at identity (integer wraps)
  const wrap = (v) => ((v % 1) + 1.5) % 1 - 0.5;
  assert(near(pIn.curve[0].dx, 0) && near(pIn.curve[0].dy, 0), '(In) not starting at identity in ' + name);
  const lastOut = pOut.curve[pOut.curve.length - 1];
  assert(near(wrap(lastOut.dx), 0, 5e-3) && near(wrap(lastOut.dy), 0, 5e-3), '(Out) not settling at identity in ' + name);
  // blur ramps from 0 and back to ~0
  assert(near(pIn.blur.len[0].v, 0, 0.5), '(In) blur does not start at 0 in ' + name);
  assert(pOut.blur.len[pOut.blur.len.length - 1].v < 12, '(Out) blur does not settle in ' + name);

  const pose = posePhase(d3, name + ' 3D', mirH, mirV);
  assert(near(pose.window[0], inC.start), '3D window start off in ' + name);
  assert(near(pose.window[1], outC.end), '3D window end off in ' + name);

  // ---- audio (measured)
  assert(seq.audio && seq.audio.length === 1, 'audio clip count != 1 in ' + name);
  const au = seq.audio[0];
  const wantA = isShort ? 'Camera_Flight_Short_01.mp3' : 'Camera_Flight_Long_01.mp3';
  assert(au.masterClipName === wantA, `audio ${au.masterClipName} in ` + name);
  assert(near(au.start, 0.04), `audio start ${au.start} in ` + name);
  assert(near(au.inPoint || 0, isShort ? 0.1351 : 0, 2e-3), `audio ip ${au.inPoint} in ` + name);
  const auWin = r4(au.end - au.start);
  assert(near(auWin, isShort ? 0.72 : 1.52, 2e-3), `audio window ${auWin} in ` + name);
  const sfxName = isShort ? 'sfx-transform-short-72.mp3' : 'sfx-transform-152.mp3';
  sfxSpecs.set(sfxName, { media: wantA, ip: au.inPoint || 0, lead: 0.04, win: auWin });

  const dirSlug = dirName.toLowerCase().replace(/\s+/g, '-');
  const id = `transform-${isShort ? 'short-' : ''}${group}-${dirSlug}`;
  const G_CHAR = {
    '1': 'one long arcing camera flight (down/up then sideways) with a single wide 3D tilt',
    '2': 'a camera flight with a rapid multi-swing 3D tumble (the wildest wobble of the family)',
    '3': 'a diagonal camera flight with a broad two-beat 3D swing',
    '4': 'a diagonal camera flight with a moderate two-beat 3D swing',
  };
  return {
    id, category: 'TRANSFORM', variant: folder, intensity: dirName,
    label: `Transform${isShort ? ' Short' : ''} ${group} · ${dirName}`,
    engine: 'TransformFly', kind: 'geometric', fidelity: 'approximate',
    durationSeconds: dur,
    params: {
      cut,
      curveIn: pIn.curve, curveOut: pOut.curve,
      blurIn: pIn.blur, blurOut: pOut.blur,
      pose,
    },
    sfx: `transitions/lib/${sfxName}`,
    used_in: [],
    meta: {
      aspectRatios: ['16:9'],
      resolution: '1920x1080',
      family: 'Transform ' + folder,
      engineFile: 'remotion/src/transitions/engines/TransformFly.tsx',
      description: `Camera-flight push toward ${dirName.toLowerCase()}: the frame wrap-scrolls along a curved multi-wrap path under a heavy directional blur whose axis rotates with the path, while the whole shot swivels/tilts in 3D and zooms through the cut — ${G_CHAR[group]}.`,
      energy: 'high',
      durationSeconds: dur,
      hasSound: true,
      fidelity: 'approximate',
      tags: ['transform', 'camera-flight', 'push', 'whip', '3d', 'motion',
        ...dirSlug.split('-'), ...(isShort ? ['short'] : [])],
      useWhen: `Big energetic camera-flight cut (~${dur}s) toward ${dirName.toLowerCase()}; the frame flies off in an arc with a 3D wobble. High energy — use on hype beats.`,
    },
  };
}

const rows = clips.map(buildRow);
assert(rows.length === 40, 'expected 40 rows, got ' + rows.length);
const byG = {};
for (const r of rows) byG[r.variant] = (byG[r.variant] || 0) + 1;
console.log('rows by subgroup:', JSON.stringify(byG));
assert(byG['1'] === 4 && byG['2'] === 8 && byG['3'] === 4 && byG['4'] === 4 &&
  byG['Short 1'] === 4 && byG['Short 2'] === 8 && byG['Short 3'] === 4 && byG['Short 4'] === 4,
  'subgroup counts off');

const libPath = path.join(__dirname, 'library.json');
const lib = JSON.parse(fs.readFileSync(libPath, 'utf8'));
const before = lib.transitions.length;
lib.transitions = lib.transitions.filter((r) => r.category !== 'TRANSFORM');
lib.transitions.push(...rows);
fs.writeFileSync(libPath, JSON.stringify(lib, null, 2));
console.log(`built ${rows.length} TRANSFORM rows; library ${before} -> ${lib.transitions.length}`);
console.log('sfx cut list:');
for (const [f, s] of sfxSpecs) console.log(` lib/${f} <- ${s.media} ip=${s.ip} lead=${s.lead} win=${s.win}`);
for (const id of ['transform-1-down-left', 'transform-2-right', 'transform-2-left-down',
  'transform-short-3-right-down']) {
  const r = rows.find((x) => x.id === id);
  assert(r, 'spot-check row missing: ' + id);
  const p = r.params;
  console.log(id, JSON.stringify({
    dur: r.durationSeconds, cut: p.cut,
    inKfs: p.curveIn.length, outKfs: p.curveOut.length,
    inEnd: [p.curveIn[p.curveIn.length - 1].dx, p.curveIn[p.curveIn.length - 1].dy],
    poseWin: p.pose.window, tiltPeak: Math.max(...p.pose.tilt.map((k) => Math.abs(k.v))),
  }));
}

#!/usr/bin/env node
/** _motion-clips.json -> 55 MOTION rows: 3D Offset 16 + 3D Orbit 16 + 3D Pan 8
 * (engine Motion3D) and Shake 3D 5 + Shake Optics 6 + Shake Simple 4 (engine
 * MotionShake). SINGLE-SCENE accent moves (Mike's receipt/article showcase
 * moves): no A->B, demoSameScene:true on every row, NO SFX (verified 3 ways).
 *
 * Direction variants carry the same H/V flip on all three adjustment layers and
 * the previews show UPRIGHT content -> flips mirror the MOTION only, resolved
 * here analytically (mirror drift/geoPos, negate swivel/tilt/geoRot per axis).
 * Shake variants slice the first ~2s of a 60s baked wiggle master (1500 kfs)
 * -> keyframes trimmed to the clip window. Hard-fails on shape surprises.
 */
const fs = require('fs');
const path = require('path');
const clips = require('./_motion-clips.json');

const num = (s) => (s == null ? null : +String(s).replace(/[^0-9eE.+-]/g, ''));
const xy = (v) => {
  const parts = String(v).split(':');
  if (parts.length !== 2) die(`expected 2D value, got ${v}`);
  return [num(parts[0]), num(parts[1])];
};
const r4 = (n) => +n.toFixed(4);
const die = (msg) => { throw new Error('MOTION BUILD FAIL: ' + msg); };
const handles = (k) => (k.a && k.a.length >= 7
  ? { iv: num(k.a[3]), ii: num(k.a[4]), ov: num(k.a[5]), oi: num(k.a[6]) }
  : {});

const eff = (c, mn) => c.effects.find((e) => e.matchName === mn);
const param = (e, n) => e && e.params.find((p) => p.name === n);
const rate1 = (c, nm) => {
  const w = c.end - c.start, m = (c.outPoint ?? 0) - (c.inPoint ?? 0);
  if (Math.abs(m - w) > 1e-6) die(`${nm}: clip rate != 1`);
  if (c.timeRemap) die(`${nm}: unexpected remap`);
};
const flipsOf = (c) => ({
  h: c.effects.some((e) => e.matchName === 'PR.ADBE Horizontal Flip'),
  v: c.effects.some((e) => e.matchName === 'PR.ADBE Vertical Flip'),
});

function scalarKfs(clip, e, name, nm, { trimTo } = {}) {
  const p = param(e, name);
  if (!p) die(`${nm}: missing ${name}`);
  const ip = clip.inPoint || 0;
  if (!p.keyframes) return [{ t: 0, v: num(p.value) }];
  let kfs = p.keyframes.map((k) => ({ t: r4(clip.start + k.t - ip), v: num(k.v), ...handles(k) }));
  if (trimTo != null) kfs = kfs.filter((k) => k.t <= trimTo);
  return kfs;
}
function pointKfs(clip, e, name, nm, { trimTo } = {}) {
  const p = param(e, name);
  if (!p) die(`${nm}: missing 2D ${name}`);
  const ip = clip.inPoint || 0;
  if (!p.keyframes) { const [x, y] = xy(p.value); return [{ t: 0, x: r4(x), y: r4(y) }]; }
  let kfs = p.keyframes.map((k) => {
    const [x, y] = xy(k.v);
    return { t: r4(clip.start + k.t - ip), x: r4(x), y: r4(y), ...handles(k) };
  });
  if (trimTo != null) kfs = kfs.filter((k) => k.t <= trimTo);
  return kfs;
}

function buildRow(seq) {
  const content = seq.clips.find((c) => c.track === 0);
  const durationSeconds = r4(content.end);
  if ((seq.audio || []).length) die(`${seq.name}: unexpected audio`);

  const m3 = seq.name.match(/^Motion (3D Offset|3D Orbit|3D Pan) (\d) - (.+)$/);
  const ms = seq.name.match(/^Motion (Shake 3D|Shake Optics|Shake Simple) - (\d)x$/);

  let engine, params, variant, intensity, look, fidelity, energy, tags;
  if (m3) {
    const [_, fam, n, dir] = m3;
    if (durationSeconds !== 5) die(`${seq.name}: dur ${durationSeconds}`);
    const t1 = seq.clips.find((c) => c.track === 1);
    const t2 = seq.clips.find((c) => c.track === 2);
    const t3 = seq.clips.find((c) => c.track === 3);
    [t1, t2, t3].forEach((c, i) => { if (!c) die(`${seq.name}: missing t${i + 1}`); rate1(c, seq.name + ' t' + (i + 1)); });
    // uniform flip on all three layers = mirror the MOTION (content stays upright)
    const f1 = flipsOf(t1), f2 = flipsOf(t2), f3 = flipsOf(t3);
    if (JSON.stringify(f1) !== JSON.stringify(f2) || JSON.stringify(f2) !== JSON.stringify(f3))
      die(`${seq.name}: non-uniform flips`);
    const { h: fh, v: fv } = f1;

    const geoT1 = eff(t1, 'AE.ADBE Geometry2') || die(`${seq.name}: t1 no Geometry2`);
    let drift = pointKfs(t1, geoT1, 'Position', seq.name);
    const b3 = eff(t2, 'AE.ADBE Basic 3D') || die(`${seq.name}: t2 no Basic 3D`);
    const geoT2 = eff(t2, 'AE.ADBE Geometry2') || die(`${seq.name}: t2 no Geometry2`);
    let swivel = scalarKfs(t2, b3, 'Swivel', seq.name);
    let tilt = scalarKfs(t2, b3, 'Tilt', seq.name);
    const dist = scalarKfs(t2, b3, 'Distance to Image', seq.name);
    const gp = param(geoT2, 'Position');
    let geoPos = String(gp.value).includes(':') ? xy(gp.value) : die(`${seq.name}: t2 pos not 2D: ${gp.value}`);
    let geoRot = num(param(geoT2, 'Rotation').value) || 0;

    // accents (constants across the family — assert)
    const gl = eff(t3, 'AE.Mettle SkyBox Digital Glitch') || die(`${seq.name}: t3 no glitch`);
    const bl = eff(t3, 'AE.ADBE Gaussian Blur 2') || die(`${seq.name}: t3 no blur`);
    const amp = num(param(gl, 'Master Amplitude').value);
    const blur = num(param(bl, 'Blurriness').value);
    const lens = eff(t3, 'PR.ADBE Lens Distortion');
    const lensK = lens ? num(param(lens, 'Curvature').value) : 0;
    // per-variant real values (Offset-1 is 19/15/-1, others vary slightly)
    if (amp < 0 || amp > 100 || blur < 0 || blur > 100 || lensK < -20 || lensK > 0)
      die(`${seq.name}: accent values out of range ${amp}/${blur}/${lensK}`);

    // analytic flip resolution (mirror motion, never content)
    if (fh) {
      drift = drift.map((k) => ({ ...k, x: r4(1 - k.x) }));
      geoPos = [r4(1 - geoPos[0]), geoPos[1]];
      swivel = swivel.map((k) => ({ ...k, v: -k.v }));
      geoRot = -geoRot;
    }
    if (fv) {
      drift = drift.map((k) => ({ ...k, y: r4(1 - k.y) }));
      geoPos = [geoPos[0], r4(1 - geoPos[1])];
      tilt = tilt.map((k) => ({ ...k, v: -k.v }));
      geoRot = -geoRot;
    }

    engine = 'Motion3D';
    params = { drift, swivel, tilt, dist, geoPos, geoRot: r4(geoRot), accents: { lensK, glitchAmp: amp, blurriness: blur } };
    variant = fam;
    intensity = `${n} · ${dir}`;
    fidelity = 'approximate';
    energy = 'low';
    const famWord = fam === '3D Offset' ? 'tilted-plane drift' : fam === '3D Orbit' ? 'orbiting camera move' : 'perspective pan';
    look = `slow cinematic ${famWord} toward ${dir.toLowerCase()} over a single scene, with a soft depth-of-field edge vignette (real masked blur + faint chromatic fringe)`;
    tags = ['motion', 'camera-move', fam.toLowerCase().replace(/ /g, '-'), dir.toLowerCase().replace(/ /g, '-'), 'showcase', 'ken-burns'];
  } else if (ms) {
    const [_, fam, n] = ms;
    const t1 = seq.clips.find((c) => c.track === 1) || die(`${seq.name}: no t1`);
    rate1(t1, seq.name);
    const trimTo = r4(t1.end + 0.1);
    if (fam === 'Shake Simple') {
      const geo = eff(t1, 'AE.ADBE Geometry2') || die(`${seq.name}: no Geometry2`);
      const scaleH = num(param(geo, 'Scale Height').value);
      params = {
        mode: 'simple',
        pos: pointKfs(t1, geo, 'Position', seq.name, { trimTo }),
        rot: scalarKfs(t1, geo, 'Rotation', seq.name, { trimTo }),
        scaleH,
      };
      fidelity = 'near-1:1';
    } else {
      const cp = eff(t1, 'AE.ADBE Corner Pin') || die(`${seq.name}: no Corner Pin`);
      params = {
        mode: 'corner',
        ul: pointKfs(t1, cp, 'Upper Left', seq.name, { trimTo }),
        ur: pointKfs(t1, cp, 'Upper Right', seq.name, { trimTo }),
        ll: pointKfs(t1, cp, 'Lower Left', seq.name, { trimTo }),
        lr: pointKfs(t1, cp, 'Lower Right', seq.name, { trimTo }),
      };
      if (fam === 'Shake Optics') {
        const lens = eff(t1, 'PR.ADBE Lens Distortion') || die(`${seq.name}: Optics no lens`);
        params.lensK = num(param(lens, 'Curvature').value); // per-variant (-7..-25 observed, scales with intensity)
        if (params.lensK < -40 || params.lensK >= 0) die(`${seq.name}: lensK ${params.lensK}`);
        fidelity = 'approximate';
      } else {
        fidelity = 'near-1:1';
      }
    }
    engine = 'MotionShake';
    variant = fam;
    intensity = `${n}x`;
    energy = 'high';
    look = `${fam === 'Shake Simple' ? 'handheld jitter' : fam === 'Shake Optics' ? 'projective camera shake through a slight barrel lens' : 'projective 3D camera shake'} over a single scene, intensity ${n}x (real baked wiggle)`;
    tags = ['motion', 'shake', 'impact', 'handheld', fam.toLowerCase().replace(/ /g, '-'), `${n}x`];
  } else {
    die(`unrecognized ${seq.name}`);
  }

  const slug = seq.name.replace(/^Motion /, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return {
    id: `motion-${slug}`,
    category: 'MOTION',
    variant,
    intensity,
    label: seq.name.replace('Motion ', 'Motion · ').replace(' - ', ' · '),
    engine,
    kind: 'geometric',
    fidelity,
    durationSeconds,
    params,
    sfx: null,
    demoSameScene: true, // single-scene accent move — never an A->B transition
    used_in: [],
    meta: {
      aspectRatios: ['16:9'],
      resolution: '1920x1080',
      family: `Motion ${variant}`,
      engineFile: `remotion/src/transitions/engines/${engine}.tsx`,
      description: `${look.charAt(0).toUpperCase() + look.slice(1)}. NOT an A/B transition — a single-image move for showcasing receipts, articles, stills.`,
      energy,
      durationSeconds,
      hasSound: false,
      fidelity,
      tags,
      useWhen: `Showcasing a single still (receipt/article/chart) with ${energy === 'high' ? 'an impact shake' : 'a slow cinematic move'} (~${durationSeconds}s). Use over one image, not across a cut.`,
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
console.log(`built ${rows.length} MOTION rows; library now ${lib.transitions.length}`);
for (const id of ['motion-3d-offset-1-left-up', 'motion-3d-orbit-1-b-left', 'motion-shake-3d-3x', 'motion-shake-simple-2x']) {
  const r = rows.find((x) => x.id === id);
  const p = r.params;
  console.log(' ', id, r.engine, p.mode || '', p.drift ? `drift:${p.drift.map((k) => k.x + ',' + k.y).join('|')} swivel:${p.swivel.map((k) => k.v).join('|')} tilt:${p.tilt.map((k) => k.v).join('|')}` : '', p.ul ? `ulKfs:${p.ul.length}` : '', p.pos ? `posKfs:${p.pos.length} scaleH:${p.scaleH}` : '');
}

#!/usr/bin/env node
/** _zoom-clips.json -> 70 ZOOM rows (16 subgroups: Ease / Hit / Optics /
 * Optics Spin / Shake 1x-2x / Simple / Spin / Swinging, each + Short twin),
 * ALL on engine PerspectiveEase (center-pinned zoom phases + the new additive
 * `fx` overlay stages).
 *
 * Mechanism (decoded 2026-07-14, all real per-clip data): every ZOOM variant =
 * the PERSPECTIVE phase architecture pinned at FRAME CENTER (anchor = position
 * = 0.5:0.5 everywhere):
 *  - plain (norm 100): raw Geometry2 zoom, curve endpoints >= 100.
 *  - rig2 (norm 200): Offset 0:0 + Replicate(2) + 4 quarter-Mirrors =
 *    mirror-padded half-size identity (the PERSPECTIVE rig, same constants).
 *  - rig3 (norm 300, Hit In's slam): Replicate(3) + third-line Mirrors, no
 *    Offset.
 * Variant kinds per family: In (plain whip-in | rig grow-to-rest), In Out
 * (plain | plain 300->100 — no rig needed, scale never dips), Out (rig2
 * recede | plain 300->100).
 * Family extras:
 *  - Spin / Optics Spin: keyframed Rotation riding the phases (CW/CCW pairs).
 *  - Swinging: multi-kf scale PENDULUM (Out variant's (Out) enters mid-flight
 *    via a negative-time kf).
 *  - Hit: the PERSPECTIVE Hit trio verbatim — linear slam + rig2-identity
 *    Shake jitter + Deviation fringe (Tint RED/BLUE + Emboss 45/10/70 + Pin
 *    Light; identical ARGB16 tint pair).
 *  - Optics (+ Spin): two full-window overlay adjustments -> fx stages:
 *    "Deviation" = Mettle SkyBox Digital Glitch, ONLY Color Distortion
 *    keyframed 0->50->0 (geometry-distortion group disabled; Master Amplitude
 *    static 100) = the DEVIATION-category radial spectral dispersion;
 *    "Optics" = PR Lens Distortion Curvature pulse (0->-67..-100->rest);
 *    In Impact adds a Geometry2 zoom pulse (100->158.8->100, shutter 80) on
 *    the lens clip; In Out 3 has NO Geometry2 phases at all — identity phases
 *    with PIECEWISE lens curves on the (In)/(Out) clips.
 *  - Shake 1x/2x: dense baked Position jitter + Rotation wobble riding BOTH
 *    phases (the SPIN-Shake pan convention) + ONE Deviation overlay carrying
 *    lens (0->-8->-1) AND color (0->50/75->0).
 *
 * Track order (bottom-up) = fx array order: color glitch below lens; within
 * the Shake Deviation clip the component stack is glitch -> lens (bottom-up).
 *
 * SFX by MEASURED (media, start, in-point, window), asserted per family —
 * lead baked, window-truncated, 30ms tail guard (see SFX table below).
 *
 * Hard-fails on any deviation from the decoded recipe (Rule 2).
 * Merges into library.json (replaces prior ZOOM rows).
 */
const fs = require('fs');
const path = require('path');
const clips = require('./_zoom-clips.json');

const num = (s) => (s == null ? null : +String(s).replace(/[^0-9eE.+-]/g, ''));
const r4 = (n) => +n.toFixed(4);
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const handles = (k) => (k.a && k.a.length >= 7
  ? { iv: num(k.a[3]), ii: num(k.a[4]), ov: num(k.a[5]), oi: num(k.a[6]) }
  : {});
const assert = (cond, msg) => { if (!cond) throw new Error('ASSERT: ' + msg); };
const near = (a, b, eps = 1e-3) => Math.abs(a - b) < eps;
const xy = (v) => String(v).split(':').map(num);
const pget = (eff, n) => eff.params.find((x) => x.name === n);
const geoOf = (c) => (c.effects || []).find((e) => e.matchName === 'AE.ADBE Geometry2');

const TINT_RED = '18374966855136706560';  // ARGB16 ff00ff0000000000 (the PERSPECTIVE pair)
const TINT_BLUE = '18374686479671688960'; // ARGB16 ff0000000000ff00

/** Classify a phase clip by its effect shape -> { norm } (PERSPECTIVE rigKind, center rig). */
function rigKind(c, name) {
  const mirrors = c.effects.filter((e) => e.matchName === 'AE.ADBE Mirror');
  const rep = c.effects.find((e) => e.matchName === 'PR.ADBE Replicate');
  const off = c.effects.find((e) => e.matchName === 'AE.ADBE Offset');
  if (!rep) {
    assert(mirrors.length === 0 && !off, 'plain phase has rig leftovers in ' + name);
    return { norm: 100 };
  }
  const count = num(pget(rep, 'Count').value);
  assert(mirrors.length === 4, 'rig without 4 mirrors in ' + name);
  if (count === 2) {
    const ov = xy(pget(off, 'Shift Center To').value);
    assert(off && near(ov[0], 0) && near(ov[1], 0), 'rig2 Offset not 0:0 in ' + name);
    for (const want of [[1, 0.25, -90], [1, 0.749, 90], [0.25, 0.5, 180], [0.7495, 0.5, 0]]) {
      assert(mirrors.some((m) => {
        const c2 = xy(pget(m, 'Reflection Center').value);
        return near(c2[0], want[0], 0.002) && near(c2[1], want[1], 0.002) && near(num(pget(m, 'Reflection Angle').value), want[2]);
      }), 'rig2 mirror mismatch in ' + name);
    }
    return { norm: 200 };
  }
  if (count === 3) {
    assert(!off, 'rig3 unexpectedly has Offset in ' + name);
    for (const want of [[1, 1 / 3, -90], [1, 0.6662, 90], [1 / 3, 0.5, 180], [0.6664, 0.5, 0]]) {
      assert(mirrors.some((m) => {
        const c2 = xy(pget(m, 'Reflection Center').value);
        return near(c2[0], want[0], 0.002) && near(c2[1], want[1], 0.002) && near(num(pget(m, 'Reflection Angle').value), want[2]);
      }), 'rig3 mirror mismatch in ' + name);
    }
    return { norm: 300 };
  }
  throw new Error('ASSERT: unexpected Replicate count ' + count + ' in ' + name);
}

/** A ZOOM phase: center-pinned zoom (+ optional rot / pan jitter / shutter override). */
function phaseParams(c, name) {
  const g = geoOf(c);
  assert(g, 'phase clip without Geometry2 in ' + name);
  const sh = pget(g, 'Scale Height');
  assert(sh && sh.keyframes && sh.keyframes.length >= 2, 'Scale Height not keyframed in ' + name);
  assert(num(pget(g, 'Scale Width').value) === 100, 'Scale Width != 100 in ' + name);
  assert(near(c.outPoint - c.inPoint, c.end - c.start), 'clip rate != 1 on phase in ' + name);
  const { norm } = rigKind(c, name);
  const a = xy(pget(g, 'Anchor Point').value);
  assert(near(a[0], 0.5, 2e-3) && near(a[1], 0.5, 2e-3), 'anchor not center in ' + name);
  const shutter = num(pget(g, 'Shutter Angle').value);
  const ip = c.inPoint || 0;
  const out = {
    win: [r4(c.start), r4(c.end)],
    kfs: sh.keyframes.map((k) => ({ t: r4(c.start + k.t - ip), v: num(k.v), ...handles(k) })),
    norm,
    cx: 0.5, cy: 0.5,
    fx: 0.5, fy: 0.5,
    mirror: norm !== 100,
  };
  if (shutter !== 180) out.shutter = shutter;
  const rotP = pget(g, 'Rotation');
  if (rotP && rotP.keyframes) {
    out.rot = rotP.keyframes.map((k) => ({ t: r4(c.start + k.t - ip), v: num(k.v), ...handles(k) }));
  } else if (rotP) {
    assert(num(rotP.value) === 0, 'static Rotation != 0 in ' + name);
  }
  const posP = pget(g, 'Position');
  if (posP.keyframes) {
    // Shake subgroup: dense baked Position jitter riding the phase (SPIN-Shake pan convention)
    out.pan = posP.keyframes.map((k) => {
      const [x, y] = xy(k.v);
      return { t: r4(c.start + k.t - ip), x: r4(x), y: r4(y), ...handles(k) };
    });
  } else {
    const pos = xy(posP.value);
    assert(near(pos[0], 0.5, 2e-3) && near(pos[1], 0.5, 2e-3), 'position not center in ' + name);
  }
  return out;
}

/** Keyframed scalar curve of an effect param, seq-time. */
function curveOf(c, eff, pname, name) {
  const p = pget(eff, pname);
  assert(p && p.keyframes, pname + ' not keyframed in ' + name);
  const ip = c.inPoint || 0;
  return p.keyframes.map((k) => ({ t: r4(c.start + k.t - ip), v: num(k.v), ...handles(k) }));
}

/** Digital-Glitch overlay clip -> color curve (asserts the fixed plugin state). */
function glitchStage(c, name) {
  const gl = c.effects.find((e) => e.matchName === 'AE.Mettle SkyBox Digital Glitch');
  assert(gl, 'no Digital Glitch on ' + name);
  assert(num(pget(gl, 'Master Amplitude').value) === 100, 'glitch Master Amplitude != 100 in ' + name);
  const poi = xy(pget(gl, 'Point of Interest').value);
  assert(near(poi[0], 0.5) && near(poi[1], 0.5), 'glitch POI not center in ' + name);
  for (const [pn, want] of [['Geometry Distortion X', 100], ['Geometry Distortion Y', 83],
    ['Distortion Rate', 0], ['Noise Strength', 0], ['Random Seed', 0]]) {
    assert(num(pget(gl, pn).value) === want, 'glitch ' + pn + ' != ' + want + ' in ' + name);
  }
  // the group toggles ship disabled -> only Color Distortion renders
  for (const pn of ['Distortion', 'Transform', 'Noise']) {
    assert(pget(gl, pn).value === 'false', 'glitch group ' + pn + ' enabled in ' + name);
  }
  const color = curveOf(c, gl, 'Color Distortion', name);
  assert(color[0].v === 0 && color[color.length - 1].v === 0, 'color curve endpoints != 0 in ' + name);
  return color;
}

// ------------------------------------------------------------------ templates
// [normIn, in0, in1] / [normOut, out0, out1] use FIRST/LAST kf values.
const T = (nI, i0, i1, nO, o0, o1, extra = {}) => ({ in: [nI, i0, i1], out: [nO, o0, o1], ...extra });
const FAMILY = {
  'Ease': {
    'In': T(100, 100, 300, 200, 110, 200),
    'In Out': T(100, 100, 300, 100, 300, 100),
    'Out': T(200, 200, 101, 100, 300, 100),
  },
  'Simple': {
    'In': T(100, 100, 300, 200, 100, 200),
    'In Out': T(100, 100, 300, 100, 300, 100),
    'Out': T(200, 200, 100, 100, 300, 100),
  },
  'Spin': {
    'In': T(100, 100, 300, 200, 160, 200, { rot: [40, 25] }),
    'In Out': T(100, 100, 300, 100, 300, 100, { rot: [40, 60] }),
    'Out': T(200, 200, 100, 100, 300, 100, { rot: [40, 40] }),
  },
  'Swinging': {
    'In': T(100, 100, 300, 200, 100, 200, { outKfs: 4 }),
    'Out': T(200, 200, 100, 200, 80, 200, { outKfs: 5 }),
  },
  'Hit': {
    'In': T(100, 100, 300, 300, 100, 300, { hit: true }),
    'In Out': T(100, 100, 300, 100, 300, 100, { hit: true }),
    'Out': T(200, 200, 100, 100, 300, 100, { hit: true }),
  },
  'Optics': {
    'In': T(100, 100, 300, 200, 100, 200, { fx: true }),
    'In Impact': T(100, 100, 300, 200, 100, 200, { fx: true, impact: true }),
    'In Out 1': T(100, 100, 300, 200, 100, 200, { fx: true }),
    'In Out 2': T(100, 100, 300, 100, 300, 100, { fx: true }),
    'In Out 3': { lensOnly: true, fx: true },
    'Out': T(200, 200, 100, 100, 300, 100, { fx: true }),
  },
  'Optics Spin': {
    'In': T(100, 100, 300, 200, 100, 200, { fx: true, rot: [50, 50] }),
    'In Out': T(100, 100, 300, 100, 300, 100, { fx: true, rot: [50, 100] }),
    'Out': T(200, 200, 100, 100, 300, 100, { fx: true, rot: [50, 80] }),
  },
  'Shake': {
    'In': T(100, 100, 300, 200, 103, 200, { fx: true, jitter: true }),
    'In Out': T(100, 100, 300, 100, 300, 100, { fx: true, jitter: true }),
    'Out': T(200, 200, 100, 100, 300, 100, { fx: true, jitter: true }),
  },
};

// ---------------------------------------------------------------- SFX table
// family|len -> [file, media, start(lead), in-point] — MEASURED, asserted.
// Optics_02 cuts are shared where (media, ip, lead, window) coincide:
// Hit In/Out long lead .04 win .84 -> optics02-88; Hit In Out long + Optics
// In Impact long lead 0 win .84 -> optics02-84; Hit Short + In Impact Short
// lead 0 win .44 -> optics02-44.
const SFX = {
  'Ease|long': ['sfx-zoom-ease-76.mp3', 'Optics_01.wav', 0.04, 0.052],
  'Ease|short': ['sfx-zoom-ease-40.mp3', 'Optics_01.wav', 0, 0.052],
  'Spin|long': ['sfx-zoom-ease-76.mp3', 'Optics_01.wav', 0.04, 0.052],
  'Spin|short': ['sfx-zoom-ease-40.mp3', 'Optics_01.wav', 0, 0.052],
  'Simple|long': ['sfx-zoom-simple-68.mp3', 'Camera_01.wav', 0.04, 0.02],
  'Simple|short': ['sfx-zoom-simple-48.mp3', 'Camera_01.wav', 0, 0.092],
  'Swinging|long': ['sfx-zoom-swinging-88.mp3', 'Swinging_01.wav', 0.04, 0.16],
  'Swinging|short': ['sfx-zoom-swinging-44.mp3', 'Swinging_01.wav', 0, 0.16],
  'Shake|long': ['sfx-zoom-shake-96.mp3', 'Optics_01.wav', 0.04, 0.04],
  'Shake|short': ['sfx-zoom-shake-48.mp3', 'Optics_01.wav', 0, 0.04],
  // Hit + the Optics_02 kinds (In Impact) — start varies per variant kind:
  'Hit@0.04': ['sfx-zoom-optics02-88.mp3', 'Optics_02.wav', 0.04, 0],
  'Hit@0|long': ['sfx-zoom-optics02-84.mp3', 'Optics_02.wav', 0, 0],
  'Hit@0|short': ['sfx-zoom-optics02-44.mp3', 'Optics_02.wav', 0, 0],
  'Optics@0|long': ['sfx-zoom-optics-76.mp3', 'Optics_01.wav', 0, 0],
  'Optics@0.04|long': ['sfx-zoom-optics-80.mp3', 'Optics_01.wav', 0.04, 0],
  'Optics@0|short': ['sfx-zoom-optics-44.mp3', 'Optics_01.wav', 0, 0],
};
const sfxPlan = new Map(); // file -> {media, lead, ip, win}

function pickSfx(fam, kind, isShort, au, dur, name) {
  const media = String(au.mediaPath || '').replace(/^.*[\\/]/, '');
  const lead = r4(au.start), ip = r4(au.inPoint || 0), win = r4(au.end - au.start);
  const len = isShort ? 'short' : 'long';
  let key;
  if (fam === 'Hit') key = lead > 0 ? 'Hit@0.04' : `Hit@0|${len}`;
  else if ((fam === 'Optics' || fam === 'Optics Spin') && kind === 'In Impact') key = `Hit@0|${len}`;
  else if (fam === 'Optics' || fam === 'Optics Spin') key = `Optics@${lead > 0 ? '0.04' : '0'}|${len}`;
  else key = `${fam}|${len}`;
  const spec = SFX[key];
  assert(spec, 'no SFX spec for ' + key + ' in ' + name);
  assert(media === spec[1], `SFX media ${media} != ${spec[1]} in ` + name);
  assert(near(lead, spec[2], 2e-3), `SFX lead ${lead} != ${spec[2]} in ` + name);
  assert(near(ip, spec[3], 2e-3), `SFX in-point ${ip} != ${spec[3]} in ` + name);
  const prev = sfxPlan.get(spec[0]);
  if (prev) assert(near(prev.win, win, 2e-3), `SFX window drift ${win} vs ${prev.win} for ${spec[0]} in ` + name);
  else sfxPlan.set(spec[0], { media, lead: spec[2], ip: spec[3], win });
  return spec[0];
}

// ------------------------------------------------------------------- build
function buildRow(seq) {
  const m = seq.name.match(/^Zoom (Optics Spin|Ease|Hit|Optics|Shake|Simple|Spin|Swinging)( Short)?(?: ([12]x))? - (.+)$/);
  assert(m, 'bad name ' + seq.name);
  const fam = m[1];
  const isShort = !!m[2];
  const nx = m[3] || null;
  const kd = m[4].match(/^(.*?)(?: (CW|CCW))?$/);
  const kind = kd[1];
  const dir = kd[2] || null;
  const tpl = FAMILY[fam][kind];
  assert(tpl, `no template for ${fam} / ${kind} in ` + seq.name);
  const sub = fam + (isShort ? ' Short' : '');

  const content = seq.clips.find((c) => c.track === 0 && !c.effects.length);
  assert(content, 'no content clip in ' + seq.name);
  const durationSeconds = r4(content.end);

  // classify the non-content clips by SHAPE (subclip names are copy-pasted)
  const others = seq.clips.filter((c) => c !== content);
  const isGlitch = (c) => c.effects.some((e) => e.matchName === 'AE.Mettle SkyBox Digital Glitch');
  const isLens = (c) => c.effects.some((e) => e.matchName === 'PR.ADBE Lens Distortion');
  const isFringe = (c) => c.effects.some((e) => e.matchName === 'AE.ADBE Emboss')
    && c.effects.some((e) => e.matchName === 'AE.ADBE Tint');
  const g2kf = (c) => { const g = geoOf(c); return g && pget(g, 'Scale Height').keyframes; };
  const isShake = (c) => { const g = geoOf(c); return g && !pget(g, 'Scale Height').keyframes && pget(g, 'Position').keyframes; };

  let inPhase, outPhase, shake = null, deviation = null;
  const fx = [];

  if (tpl.lensOnly) {
    // Optics In Out 3: no Geometry2 anywhere — identity phases + piecewise lens
    const lensClips = others.filter((c) => isLens(c) && !isGlitch(c)).sort((a, b) => a.start - b.start);
    const glitchClip = others.find(isGlitch);
    assert(lensClips.length === 2 && glitchClip && others.length === 3, 'In Out 3 shape off in ' + seq.name);
    for (const c of lensClips) assert(!geoOf(c), 'In Out 3 lens clip has Geometry2 in ' + seq.name);
    // glitch track sits BELOW the lens clips here (t1 under t2)
    assert(glitchClip.track < lensClips[0].track, 'In Out 3 glitch not below lens in ' + seq.name);
    const mk = (c) => ({
      win: [r4(c.start), r4(c.end)],
      kfs: [{ t: r4(c.start), v: 100 }, { t: r4(c.end), v: 100 }],
      norm: 100, cx: 0.5, cy: 0.5, fx: 0.5, fy: 0.5, mirror: false,
    });
    inPhase = mk(lensClips[0]);
    outPhase = mk(lensClips[1]);
    fx.push({ win: [r4(glitchClip.start), r4(glitchClip.end)], color: glitchStage(glitchClip, seq.name) });
    for (const c of lensClips) {
      const lensEff = c.effects.find((e) => e.matchName === 'PR.ADBE Lens Distortion');
      fx.push({ win: [r4(c.start), r4(c.end)], lens: curveOf(c, lensEff, 'Curvature', seq.name) });
    }
  } else {
    const phaseClips = others.filter((c) => g2kf(c) && !isLens(c) && !isGlitch(c)).sort((a, b) => a.start - b.start);
    assert(phaseClips.length === 2, seq.name + ': expected 2 phase clips, got ' + phaseClips.length);
    inPhase = phaseParams(phaseClips[0], seq.name + ' (in)');
    outPhase = phaseParams(phaseClips[1], seq.name + ' (out)');
    assert(near(inPhase.win[1], outPhase.win[0]), 'phases not contiguous in ' + seq.name);

    // template check: norms + FIRST/LAST scale kf per family
    for (const [ph, t] of [[inPhase, tpl.in], [outPhase, tpl.out]]) {
      const k0 = ph.kfs[0].v, k1 = ph.kfs[ph.kfs.length - 1].v;
      assert(ph.norm === t[0] && near(k0, t[1], 0.5) && near(k1, t[2], 0.5),
        `phase shape ${ph.norm}:${k0}->${k1} != template ${t} in ` + seq.name);
    }
    if (tpl.outKfs) assert(outPhase.kfs.length === tpl.outKfs,
      `(Out) pendulum kf count ${outPhase.kfs.length} != ${tpl.outKfs} in ` + seq.name);

    // rotation template (magnitudes; CW/CCW = sign pairs, hand-authored asymmetries shipped)
    if (tpl.rot) {
      assert(dir, 'rot family without CW/CCW in ' + seq.name);
      assert(inPhase.rot && outPhase.rot, 'rot family without rot curves in ' + seq.name);
      const iPeak = Math.max(...inPhase.rot.map((k) => Math.abs(k.v)));
      const oPeak = Math.max(...outPhase.rot.map((k) => Math.abs(k.v)));
      assert(near(iPeak, tpl.rot[0], 0.5) && near(oPeak, tpl.rot[1], 0.5),
        `rot peaks ${iPeak}/${oPeak} != ${tpl.rot} in ` + seq.name);
      assert(outPhase.rot[outPhase.rot.length - 1].v === 0, '(Out) rot does not settle at 0 in ' + seq.name);
    } else if (!tpl.jitter) {
      assert(!inPhase.rot && !outPhase.rot, 'unexpected rot in ' + seq.name);
    }
    if (tpl.jitter) {
      assert(inPhase.pan && outPhase.pan && inPhase.rot && outPhase.rot,
        'Shake without pan+rot jitter in ' + seq.name);
      const lastP = outPhase.pan[outPhase.pan.length - 1];
      assert(near(lastP.x, 0.5, 6e-3) && near(lastP.y, 0.5, 6e-3), 'jitter does not end centered in ' + seq.name);
    } else {
      assert(!inPhase.pan && !outPhase.pan, 'unexpected pan in ' + seq.name);
    }

    // Hit extras: Shake + Deviation fringe (the PERSPECTIVE recipe verbatim)
    const shakeClip = others.find(isShake);
    const devClip = others.find(isFringe);
    if (tpl.hit) {
      assert(shakeClip && devClip, 'Hit without Shake/Deviation in ' + seq.name);
      const g = geoOf(shakeClip);
      const kind2 = rigKind(shakeClip, seq.name + ' Shake');
      assert(kind2.norm === 200 && num(pget(g, 'Scale Height').value) === 200, 'Shake not rig2-identity in ' + seq.name);
      const posP = pget(g, 'Position');
      assert(posP.keyframes && posP.keyframes.length >= 4, 'Shake Position not keyframed in ' + seq.name);
      assert(near(shakeClip.start, outPhase.win[1]), 'Shake not contiguous after (Out) in ' + seq.name);
      const ip = shakeClip.inPoint || 0;
      const kfs = posP.keyframes.map((k) => {
        const [x, y] = xy(k.v);
        return { t: r4(shakeClip.start + k.t - ip), x: r4(x - 0.5), y: r4(y - 0.5) };
      });
      const lastK = kfs[kfs.length - 1];
      assert(near(lastK.x, 0) && near(lastK.y, 0), 'Shake does not end at rest in ' + seq.name);
      shake = { win: [r4(shakeClip.start), r4(shakeClip.end)], kfs };

      const emb = devClip.effects.find((e) => e.matchName === 'AE.ADBE Emboss');
      const tint = devClip.effects.find((e) => e.matchName === 'AE.ADBE Tint');
      const op = devClip.effects.find((e) => e.matchName === 'AE.ADBE Opacity');
      assert(emb && num(pget(emb, 'Direction').value) === 45 && num(pget(emb, 'Relief').value) === 10
        && num(pget(emb, 'Contrast').value) === 70, 'Deviation emboss params off in ' + seq.name);
      assert(tint && pget(tint, 'Map Black To').value === TINT_RED
        && pget(tint, 'Map White To').value === TINT_BLUE, 'Deviation tint not red/blue in ' + seq.name);
      assert(op && op.params.some((p) => p.name === 'Blend Mode' && num(p.value) === 17),
        'Deviation not Pin Light in ' + seq.name);
      deviation = { win: [r4(devClip.start), r4(devClip.end)], reliefPx: 10 };
    } else {
      assert(!shakeClip && !devClip, 'unexpected Shake/Deviation clips in ' + seq.name);
    }

    // Optics / Shake overlay fx stages (track order bottom-up)
    if (tpl.fx) {
      const overlayClips = others.filter((c) => (isGlitch(c) || isLens(c)) && !phaseClips.includes(c))
        .sort((a, b) => a.track - b.track);
      if (fam === 'Shake') {
        // ONE Deviation clip carrying glitch + lens (component stack bottom-up: glitch first)
        assert(overlayClips.length === 1, 'Shake overlay count off in ' + seq.name);
        const c = overlayClips[0];
        assert(isGlitch(c) && isLens(c), 'Shake Deviation missing glitch+lens in ' + seq.name);
        const lensEff = c.effects.find((e) => e.matchName === 'PR.ADBE Lens Distortion');
        const st = {
          win: [r4(c.start), r4(c.end)],
          color: glitchStage(c, seq.name),
          lens: curveOf(c, lensEff, 'Curvature', seq.name),
        };
        const cdPeak = Math.max(...st.color.map((k) => k.v));
        assert(near(cdPeak, nx === '2x' ? 75 : 50, 0.5), `Shake CD peak ${cdPeak} != ${nx} in ` + seq.name);
        fx.push(st);
      } else {
        // Deviation (glitch) below + Optics (lens [+ zoom pulse on In Impact]) above
        assert(overlayClips.length === 2, 'Optics overlay count off in ' + seq.name);
        const [devC, optC] = overlayClips;
        assert(isGlitch(devC) && !isLens(devC), 'Optics Deviation clip shape off in ' + seq.name);
        assert(isLens(optC) && !isGlitch(optC), 'Optics lens clip shape off in ' + seq.name);
        fx.push({ win: [r4(devC.start), r4(devC.end)], color: glitchStage(devC, seq.name) });
        const lensEff = optC.effects.find((e) => e.matchName === 'PR.ADBE Lens Distortion');
        const st = { win: [r4(optC.start), r4(optC.end)], lens: curveOf(optC, lensEff, 'Curvature', seq.name) };
        const og = geoOf(optC);
        if (tpl.impact) {
          assert(og && pget(og, 'Scale Height').keyframes, 'In Impact without zoom pulse in ' + seq.name);
          st.zoom = curveOf(optC, og, 'Scale Height', seq.name);
          assert(st.zoom[0].v === 100 && st.zoom[st.zoom.length - 1].v === 100, 'zoom pulse endpoints != 100 in ' + seq.name);
        } else {
          assert(!og || !pget(og, 'Scale Height').keyframes, 'unexpected zoom pulse in ' + seq.name);
        }
        fx.push(st);
      }
    } else {
      assert(!others.some((c) => isGlitch(c) || isLens(c)), 'unexpected overlay clips in ' + seq.name);
    }
  }

  // ---- audio
  const au = (seq.audio || [])[0];
  assert(au && seq.audio.length === 1, 'expected 1 audio clip in ' + seq.name);
  const sfxFile = pickSfx(fam, kind, isShort, au, durationSeconds, seq.name);

  const cut = r4(outPhase.win[0] / durationSeconds);
  const variantBits = [nx, kind, dir].filter(Boolean).join(' ');
  const id = `zoom-${slug(sub)}-${slug(variantBits)}`;
  const isHit = !!tpl.hit;
  const hasFx = fx.length > 0;

  const KDESC = {
    'In': 'the outgoing shot whip-zooms INTO the frame center, then the incoming shot grows from a mirrored-padding thumbnail up to full frame',
    'In Out': 'the outgoing shot whip-zooms into the frame center, then the incoming shot flies OUT of a deep zoom and settles',
    'Out': 'the outgoing shot recedes to half size over mirrored padding, then the incoming shot launches out of a deep zoom',
    'In Impact': 'the outgoing shot whip-zooms in, the incoming shot lands in a tenth of a second, and a lens-warp IMPACT pulse punches the frame',
    'In Out 1': 'the outgoing shot whip-zooms into center, then the incoming shot grows from a mirrored thumbnail — under the full lens/chroma envelope',
    'In Out 2': 'the outgoing shot whip-zooms into center, then the incoming shot flies out of a deep zoom under heavy shutter blur',
    'In Out 3': 'no geometric zoom at all: the cut hides entirely inside a deep fisheye lens warp and chromatic dispersion pulse',
  };
  const famDesc = {
    'Ease': 'Center zoom with eased bezier landings', 'Simple': 'Constant-velocity center zoom (linear, mechanical)',
    'Spin': `Center zoom with a ${dir} roll through the cut`, 'Swinging': 'Center zoom that PENDULUMS to rest (overshoots and swings back)',
    'Hit': 'Center zoom punch: a linear SLAM landing with impact jitter and a red/blue chromatic-fringe flash',
    'Optics': 'Center zoom under a fisheye lens-distortion pulse and radial chromatic dispersion peaking at the cut',
    'Optics Spin': `Center zoom with a ${dir} roll, under the fisheye lens pulse + chromatic dispersion`,
    'Shake': `Center zoom with a continuous handheld jitter ride (${nx} intensity) and a subtle lens/chroma pulse`,
  };

  return {
    id,
    category: 'ZOOM',
    variant: sub,
    intensity: variantBits,
    label: `Zoom · ${sub} · ${variantBits}`,
    engine: 'PerspectiveEase',
    kind: 'geometric',
    fidelity: isHit || hasFx ? 'approximate' : 'near-1:1',
    durationSeconds,
    params: {
      cut,
      inPhase,
      outPhase,
      shutter: 180,
      ...(shake ? { shake } : {}),
      ...(deviation ? { deviation } : {}),
      ...(hasFx ? { fx } : {}),
    },
    sfx: `transitions/lib/${sfxFile}`,
    used_in: [],
    meta: {
      aspectRatios: ['16:9'],
      resolution: '1920x1080',
      family: `Zoom ${sub}`,
      engineFile: 'remotion/src/transitions/engines/PerspectiveEase.tsx',
      description: `${famDesc[fam]}: ${KDESC[kind] || KDESC['In']}. ${isShort ? 'Short: fast and punchy.' : ''}`.trim(),
      energy: 'high',
      durationSeconds,
      hasSound: true,
      fidelity: isHit || hasFx ? 'approximate' : 'near-1:1',
      tags: ['zoom', 'center', slug(fam), slug(kind), ...(dir ? [slug(dir)] : []), ...(nx ? [nx] : []),
        ...(isHit ? ['hit', 'impact'] : []), ...(hasFx ? ['lens', 'chromatic'] : []), ...(isShort ? ['short'] : [])],
      useWhen: `Center-punch scene change (~${durationSeconds}s): ${fam === 'Hit' ? 'a physical slam landing for beat drops' : fam === 'Optics' || fam === 'Optics Spin' ? 'a lens-warped psychedelic cut for stylized montages' : fam === 'Shake' ? 'an energetic handheld crash-zoom feel' : fam === 'Swinging' ? 'a playful bouncy zoom that overshoots to rest' : 'a clean high-energy crash zoom'}. ${isShort ? 'Snappy version.' : ''}`.trim(),
    },
  };
}

const rows = clips.map(buildRow);
assert(rows.length === 70, 'expected 70 rows, got ' + rows.length);
const ids = new Set(rows.map((r) => r.id));
assert(ids.size === 70, 'duplicate ids');
const libPath = path.join(__dirname, 'library.json');
const lib = JSON.parse(fs.readFileSync(libPath, 'utf8'));
lib.transitions = lib.transitions.filter((r) => r.category !== 'ZOOM');
lib.transitions.push(...rows);
fs.writeFileSync(libPath, JSON.stringify(lib, null, 2));
console.log(`built ${rows.length} ZOOM rows; library now ${lib.transitions.length}`);
console.log('SFX plan (media, lead, ip, window):');
for (const [f, s] of sfxPlan) console.log(` ${f}: ${s.media} lead=${s.lead} ip=${s.ip} win=${s.win}`);
for (const id of ['zoom-ease-in', 'zoom-hit-out', 'zoom-optics-in-impact', 'zoom-optics-in-out-3', 'zoom-shake-2x-in', 'zoom-swinging-out']) {
  const s = rows.find((r) => r.id === id);
  assert(s, 'probe id missing: ' + id);
  console.log(id + ':', JSON.stringify({ cut: s.params.cut, normIn: s.params.inPhase.norm, normOut: s.params.outPhase.norm, rot: !!s.params.inPhase.rot, pan: !!s.params.inPhase.pan, shake: !!s.params.shake, dev: !!s.params.deviation, fx: (s.params.fx || []).map((f) => Object.keys(f).filter((k) => k !== 'win').join('+')), sfx: s.sfx }));
}

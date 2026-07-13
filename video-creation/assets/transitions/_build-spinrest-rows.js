#!/usr/bin/env node
/** _spinrest-clips.json -> 44 SPIN rows (the 14 non-3D subgroups):
 * Center Ease 2 + Center Swinging 2 + Corner Bounce 4 + Corner Ease 4 +
 * Corner Swinging 4 + Shake 1x/2x 4 + Twirl 2, each + Short.
 *
 * 40 rows ride the generalized PerspectiveEase phases (rig2 mirror-padded
 * identity + keyframed ROTATION about a pinned anchor):
 *   Center Ease:    center pivot, In 0->±40, Out ∓90->±15->0 (3kf ease)
 *   Center Swinging: center, In 0->±50, Out 4kf PENDULUM (∓40->±15->∓1->0)
 *   Corner Bounce:  corner pivot, In 0->±25, Out small 4kf BOUNCE (∓5..10->0)
 *   Corner Ease:    corner, In 0->±26, Out ∓(22-27)->∓6->0
 *   Corner Swinging: corner, In 0->±26, Out 4kf pendulum
 *   Shake 1x/2x:    center + DENSE keyframed Position jitter riding the spin
 *                   (pan curves) + some (Out) scale settles (198/240 -> 200,
 *                   hand-authored per row — shipped as-is)
 * 4 Twirl rows use the NEW SpinTwirl canvas engine (AE Twirl vortex, angle
 * 0->∓180 | ±180->0, center raw(1,1) = frame CENTER, radius raw 30 = 60% of
 * width — the DOUBLED point normalization, preview-calibrated; shutter 0).
 *
 * SFX by MEASURED (media, start, in-point, window):
 *   Center Ease: Spin_01 @.04 ip .06 -> sfx-spincenterease-{72,44}
 *   Swinging (both): Swinging_01 @.04 ip .08 -> sfx-spinswinging-{84,44}
 *   Corner Bounce: Bounce_01 @.04 ip .12 -> sfx-spinbounce-{92,44}
 *   Corner Ease: Spin_01 @.04 ip 0 -> sfx-spincornerease-{76,44}
 *   Shake: Spin_01 @.08 ip .04, ENDS EARLY (0.92 < dur) -> sfx-spinshake-{92,52}
 *   Twirl: Spin_03 @0 ip .09 -> sfx-spintwirl-{68,40}
 *
 * Hard-fails on any deviation (Rule 2). Replaces only ITS OWN variants in
 * library.json (the SPIN 3D rows stay).
 */
const fs = require('fs');
const path = require('path');
const clips = require('./_spinrest-clips.json');

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

function rig2Assert(c, name) {
  const mirrors = c.effects.filter((e) => e.matchName === 'AE.ADBE Mirror');
  const rep = c.effects.find((e) => e.matchName === 'PR.ADBE Replicate');
  const off = c.effects.find((e) => e.matchName === 'AE.ADBE Offset');
  assert(mirrors.length === 4 && rep && num(pget(rep, 'Count').value) === 2, 'rig2 shape off in ' + name);
  const ov = xy(pget(off, 'Shift Center To').value);
  assert(near(ov[0], 0) && near(ov[1], 0), 'rig Offset not 0:0 in ' + name);
}

/** rig2 rotation phase (+ optional pan jitter + keyframed scale for Shake). */
function phaseParams(c, name) {
  const g = c.effects.find((e) => e.matchName === 'AE.ADBE Geometry2');
  assert(g, 'no Geometry2 in ' + name);
  rig2Assert(c, name);
  assert(near(c.outPoint - c.inPoint, c.end - c.start), 'clip rate != 1 in ' + name);
  const ip = c.inPoint || 0;
  const sh = pget(g, 'Scale Height');
  assert(num(pget(g, 'Scale Width').value) === 100, 'Scale Width != 100 in ' + name);
  const rotP = pget(g, 'Rotation');
  assert(rotP.keyframes && rotP.keyframes.length >= 2, 'Rotation not keyframed in ' + name);
  const shutter = num(pget(g, 'Shutter Angle').value);
  assert(shutter === 320, 'unexpected shutter in ' + name);
  const a = xy(pget(g, 'Anchor Point').value);
  const cx = r4((a[0] - 0.25) * 2), cy = r4((a[1] - 0.25) * 2);
  const posP = pget(g, 'Position');
  const out = {
    win: [r4(c.start), r4(c.end)],
    kfs: sh.keyframes
      ? sh.keyframes.map((k) => ({ t: r4(c.start + k.t - ip), v: num(k.v), ...handles(k) }))
      : [{ t: r4(c.start), v: num(sh.value) }, { t: r4(c.end), v: num(sh.value) }],
    norm: 200,
    cx, cy,
    fx: cx, fy: cy,
    rot: rotP.keyframes.map((k) => ({ t: r4(c.start + k.t - ip), v: num(k.v), ...handles(k) })),
    shutter,
    mirror: true,
  };
  if (!sh.keyframes) assert(num(sh.value) === 200, 'static scale != 200 in ' + name);
  else assert(num(sh.keyframes[sh.keyframes.length - 1].v) === 200, 'scale kfs do not settle at 200 in ' + name);
  if (posP.keyframes) {
    out.pan = posP.keyframes.map((k) => {
      const [x, y] = xy(k.v);
      return { t: r4(c.start + k.t - ip), x: r4(x), y: r4(y), ...handles(k) };
    });
    const lastP = out.pan[out.pan.length - 1];
    assert(near(lastP.x, 0.5, 5e-3) && near(lastP.y, 0.5, 5e-3), 'pan does not end centered in ' + name);
  } else {
    const pos = xy(posP.value);
    assert(near(cx, pos[0], 2e-3) && near(cy, pos[1], 2e-3), 'anchor/pin quarter-map mismatch in ' + name);
  }
  return out;
}

// family -> [sfx base, audio media, audio start, audio ip]
const AUDIO = {
  'Center Ease': ['spincenterease', 'Spin_01.wav', 0.04, 0.06],
  'Center Swinging': ['spinswinging', 'Swinging_01.wav', 0.04, 0.08],
  'Corner Bounce': ['spinbounce', 'Bounce_01.wav', 0.04, 0.12],
  'Corner Ease': ['spincornerease', 'Spin_01.wav', 0.04, 0],
  'Corner Swinging': ['spinswinging', 'Swinging_01.wav', 0.04, 0.08],
  'Shake': ['spinshake', 'Spin_01.wav', 0.08, 0.04],
  'Twirl': ['spintwirl', 'Spin_03.wav', 0, 0.09],
};

function buildRow(seq) {
  let fam, isShort, dir, nx = null;
  let m;
  if ((m = seq.name.match(/^Spin (Center|Corner) (Ease|Swinging|Bounce)( Short)? - (CCW|CW|LB|LT|RB|RT)$/))) {
    fam = `${m[1]} ${m[2]}`; isShort = !!m[3]; dir = m[4];
  } else if ((m = seq.name.match(/^Spin Shake( Short)? ([12]x) - (CCW|CW)$/))) {
    fam = 'Shake'; isShort = !!m[1]; nx = m[2]; dir = m[3];
  } else if ((m = seq.name.match(/^Spin Twirl( Short)? - (CCW|CW)$/))) {
    fam = 'Twirl'; isShort = !!m[1]; dir = m[2];
  } else {
    throw new Error('ASSERT: bad name ' + seq.name);
  }
  const variant = fam + (isShort ? ' Short' : '');
  const intensity = nx ? `${nx} ${dir}` : dir;

  const content = seq.clips.find((c) => c.track === 0 && !c.effects.length);
  assert(content && seq.clips.length === 3, seq.name + ': expected content + 2 clips');
  const durationSeconds = r4(content.end);

  const phaseClips = seq.clips.filter((c) => c !== content).sort((a, b) => a.start - b.start);
  assert(phaseClips.length === 2 && near(phaseClips[0].end, phaseClips[1].start),
    'phases not contiguous in ' + seq.name);

  // audio (measured per family)
  const [sfxBase, media, auStart, auIp] = AUDIO[fam];
  const au = (seq.audio || [])[0];
  assert(au && seq.audio.length === 1, 'expected 1 audio clip in ' + seq.name);
  assert(String(au.mediaPath || '').endsWith(media), 'unexpected SFX media in ' + seq.name);
  assert(near(au.start, auStart) && near(au.inPoint || 0, auIp, 5e-3), 'audio timing off in ' + seq.name);
  const auWin = r4(au.end); // file length from transition start (lead baked)
  const sfx = `transitions/lib/sfx-${sfxBase}-${Math.round(auWin * 100)}.mp3`;

  const base = {
    category: 'SPIN',
    variant,
    intensity,
    label: `Spin · ${variant} · ${intensity}`,
    kind: 'geometric',
    durationSeconds,
    sfx,
    used_in: [],
  };
  const metaBase = (desc, extraTags, fidelity) => ({
    aspectRatios: ['16:9'],
    resolution: '1920x1080',
    family: `Spin ${variant}`,
    engineFile: fam === 'Twirl'
      ? 'remotion/src/transitions/engines/SpinTwirl.tsx'
      : 'remotion/src/transitions/engines/PerspectiveEase.tsx',
    description: `${desc} ${isShort ? 'Short: fast and punchy.' : ''}`.trim(),
    energy: 'high',
    durationSeconds,
    hasSound: true,
    fidelity,
    tags: ['spin', slug(fam), ...(nx ? [nx] : []), slug(dir), ...extraTags, ...(isShort ? ['short'] : [])],
    useWhen: `Rotational scene change (~${durationSeconds}s). ${isShort ? 'Snappy version.' : ''}`.trim(),
  });

  if (fam === 'Twirl') {
    // AE Twirl vortex — SpinTwirl canvas engine
    const tw = (c) => {
      const e = c.effects.find((x) => x.matchName === 'AE.ADBE Twirl');
      assert(e, 'no Twirl effect in ' + seq.name);
      const ang = pget(e, 'Angle');
      assert(ang.keyframes, 'Twirl Angle not keyframed in ' + seq.name);
      const center = xy(pget(e, 'Twirl Center').value);
      const radius = num(pget(e, 'Twirl Radius').value);
      assert(near(center[0], 1) && near(center[1], 1) && radius === 30,
        'unexpected Twirl center/radius in ' + seq.name);
      const g = c.effects.find((x) => x.matchName === 'AE.ADBE Geometry2');
      assert(num(pget(g, 'Shutter Angle').value) === 0, 'Twirl shutter != 0 in ' + seq.name);
      rig2Assert(c, seq.name);
      const ip = c.inPoint || 0;
      return ang.keyframes.map((k) => ({ t: r4(c.start + k.t - ip), v: num(k.v), ...handles(k) }));
    };
    const curveIn = tw(phaseClips[0]);
    const curveOut = tw(phaseClips[1]);
    assert(curveIn[0].v === 0 && Math.abs(curveIn[curveIn.length - 1].v) === 180, '(In) twirl curve off in ' + seq.name);
    assert(curveOut[curveOut.length - 1].v === 0 && Math.abs(curveOut[0].v) === 180, '(Out) twirl curve off in ' + seq.name);
    assert(Math.sign(curveOut[0].v) === -Math.sign(curveIn[curveIn.length - 1].v), 'twirl signs not opposed in ' + seq.name);
    return {
      ...base,
      id: `spin-${slug(variant)}-${slug(dir)}`,
      engine: 'SpinTwirl',
      fidelity: 'approximate',
      params: {
        cut: r4(phaseClips[1].start / durationSeconds),
        curveIn,
        curveOut,
        cx: 0.5, cy: 0.5,       // raw (1,1) in the doubled point normalization
        radiusFrac: 0.6,        // raw 30 -> 60% of width (preview-calibrated)
      },
      meta: metaBase(
        `Vortex spin: the outgoing shot winds into a full-frame twirl (${dir}), the incoming shot unwinds from the opposite twist and eases flat. No motion blur — the warp IS the look.`,
        ['twirl', 'vortex', 'warp'], 'approximate'),
    };
  }

  // PerspectiveEase rotation rows
  const inPhase = phaseParams(phaseClips[0], seq.name + ' (in)');
  const outPhase = phaseParams(phaseClips[1], seq.name + ' (out)');
  assert(inPhase.rot[0].v === 0, '(In) rot does not start at 0 in ' + seq.name);
  assert(outPhase.rot[outPhase.rot.length - 1].v === 0, '(Out) rot does not end at 0 in ' + seq.name);
  assert(Math.sign(outPhase.rot[0].v) === -Math.sign(inPhase.rot[inPhase.rot.length - 1].v),
    'rot signs not opposed in ' + seq.name);
  assert(inPhase.cx === outPhase.cx && inPhase.cy === outPhase.cy, 'phase anchors differ in ' + seq.name);
  if (/^Center|^Shake$/.test(fam)) assert(near(inPhase.cx, 0.5) && near(inPhase.cy, 0.5), 'pivot not center in ' + seq.name);
  if (/^Corner/.test(fam)) assert(!near(inPhase.cx, 0.5) && !near(inPhase.cy, 0.5), 'pivot not a corner in ' + seq.name);
  if (fam === 'Shake') assert(inPhase.pan && outPhase.pan, 'Shake without pan jitter in ' + seq.name);

  const DESC = {
    'Center Ease': `Flat spin about the frame center (${dir}): the outgoing shot whips away over mirrored padding, the incoming shot spins in and eases to rest.`,
    'Center Swinging': `Pendulum spin about the frame center (${dir}): the outgoing shot swings away, the incoming shot overshoots and swings back and forth before settling.`,
    'Corner Bounce': `Corner-hinged swing (${dir}): the outgoing shot rotates away around a corner, the incoming shot drops in and BOUNCES against rest before settling.`,
    'Corner Ease': `Corner-hinged spin (${dir}): the outgoing shot rotates away around a frame corner, the incoming shot swings in and eases to rest.`,
    'Corner Swinging': `Corner-hinged pendulum (${dir}): the outgoing shot swings away around a corner, the incoming shot overshoots and oscillates to rest.`,
    'Shake': `Center spin with a camera-shake ride (${nx}): the whole spin jitters with baked position wobble${nx === '2x' ? ' and a zoom settle' : ''}, landing rough and physical.`,
  };
  return {
    ...base,
    id: `spin-${slug(variant)}-${slug(intensity)}`,
    engine: 'PerspectiveEase',
    fidelity: 'near-1:1',
    params: {
      cut: r4(outPhase.win[0] / durationSeconds),
      inPhase,
      outPhase,
      shutter: 320,
    },
    meta: metaBase(DESC[fam], fam === 'Shake' ? ['shake', 'jitter'] : [slug(fam.split(' ')[1])], 'near-1:1'),
  };
}

const rows = clips.map(buildRow);
assert(rows.length === 44, 'expected 44 rows, got ' + rows.length);
const VARIANTS = new Set(rows.map((r) => r.variant));
const libPath = path.join(__dirname, 'library.json');
const lib = JSON.parse(fs.readFileSync(libPath, 'utf8'));
lib.transitions = lib.transitions.filter((r) => !(r.category === 'SPIN' && VARIANTS.has(r.variant)));
lib.transitions.push(...rows);
fs.writeFileSync(libPath, JSON.stringify(lib, null, 2));
console.log(`built ${rows.length} SPIN rows (${VARIANTS.size} variants); library now ${lib.transitions.length}`);
for (const id of ['spin-center-ease-ccw', 'spin-corner-bounce-lb', 'spin-shake-1x-ccw', 'spin-twirl-ccw']) {
  const r = rows.find((x) => x.id === id);
  console.log(id + ':', JSON.stringify({ cut: r.params.cut, engine: r.engine, sfx: r.sfx, rotIn: r.params.inPhase ? r.params.inPhase.rot.map(k=>k.v) : null, rotOut: r.params.outPhase ? r.params.outPhase.rot.map(k=>k.v) : null, pan: r.params.inPhase ? !!r.params.inPhase.pan : null, tw: r.params.curveIn ? r.params.curveIn.map(k=>k.v) : null }));
}

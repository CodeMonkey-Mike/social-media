#!/usr/bin/env node
/** _spin3d-clips.json -> 24 SPIN rows (3D Center Ease, 3D Corner Ease, 3D Side
 * Ease, each + Short; Center/Corner in B|T x CW|CCW, Side in 4 dirs), engine
 * PerspectiveEase (rot phases).
 *
 * Mechanism (decoded 2026-07-13, verified vs previews): (In)/(Out) rig2 clips
 * (Offset 0:0 quadrant swap + Replicate 2 + 4 Mirrors + STATIC Scale 200 =
 * mirror-padded identity) with keyframed ROTATION about a pinned anchor:
 *   Center = frame center (In 0->±60, Out ∓90->0);
 *   Corner = a frame CORNER, quarter-mapped (±28/26);
 *   Side   = an EDGE midpoint (±26..60 depending on the edge).
 * A spins out, B spins in from the opposite side of the cut — the swap hides
 * under peak rotational blur (shutter 320; Corner's (In) runs 180 — per-phase).
 * A full-window 3-kf Corner Pin stretches ONE edge (peak ~(-1 .. 1.95), at the
 * cut) and settles back = the 3D wobble; B/T variants differ ONLY by which
 * edge the pin stretches. All hand-placed values shipped as-is (26 vs 28 etc).
 *
 * SFX: Spin_01.wav @0.04 from in-point 0, window = duration ->
 * lib/sfx-spin3d-{88,44}.mp3 (0.04 lead baked).
 *
 * Hard-fails on any deviation (Rule 2). Merges into library.json (replaces
 * prior SPIN rows).
 */
const fs = require('fs');
const path = require('path');
const clips = require('./_spin3d-clips.json');

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
  for (const want of [[1, 0.25, -90], [1, 0.749, 90], [0.25, 0.5, 180], [0.7495, 0.5, 0]]) {
    assert(mirrors.some((mm) => {
      const c2 = xy(pget(mm, 'Reflection Center').value);
      return near(c2[0], want[0], 0.002) && near(c2[1], want[1], 0.002) && near(num(pget(mm, 'Reflection Angle').value), want[2]);
    }), 'rig2 mirror mismatch in ' + name);
  }
}

function phaseParams(c, name) {
  const g = c.effects.find((e) => e.matchName === 'AE.ADBE Geometry2');
  assert(g, 'no Geometry2 in ' + name);
  rig2Assert(c, name);
  assert(near(c.outPoint - c.inPoint, c.end - c.start), 'clip rate != 1 in ' + name);
  const sh = pget(g, 'Scale Height');
  assert(!sh.keyframes && num(sh.value) === 200, 'scale != static 200 in ' + name);
  assert(num(pget(g, 'Scale Width').value) === 100, 'Scale Width != 100 in ' + name);
  const rotP = pget(g, 'Rotation');
  assert(rotP.keyframes && rotP.keyframes.length === 2, 'Rotation not 2-kf in ' + name);
  const posP = pget(g, 'Position');
  assert(!posP.keyframes, 'Position unexpectedly keyframed in ' + name);
  const shutter = num(pget(g, 'Shutter Angle').value);
  assert(shutter === 320 || shutter === 180, 'unexpected shutter in ' + name);
  const a = xy(pget(g, 'Anchor Point').value);
  const pos = xy(posP.value);
  const ip = c.inPoint || 0;
  // rig2 quarter map: content anchor = (a - 0.25) * 2; assert pin == position
  const cx = r4((a[0] - 0.25) * 2), cy = r4((a[1] - 0.25) * 2);
  assert(near(cx, pos[0], 2e-3) && near(cy, pos[1], 2e-3), 'anchor/pin quarter-map mismatch in ' + name);
  return {
    win: [r4(c.start), r4(c.end)],
    kfs: [{ t: r4(c.start), v: 200 }, { t: r4(c.end), v: 200 }], // static scale (rig identity)
    norm: 200,
    cx, cy,
    fx: r4(pos[0]), fy: r4(pos[1]),
    rot: rotP.keyframes.map((k) => ({ t: r4(c.start + k.t - ip), v: num(k.v), ...handles(k) })),
    shutter,
    mirror: true,
  };
}

/** The Pan 3D corner parser (same Corner clip shape, 3-kf edge stretch). */
function cornerParams(c, name) {
  const eff = c.effects.find((e) => e.matchName === 'AE.ADBE Corner Pin');
  assert(eff, 'Corner clip without Corner Pin in ' + name);
  const ip = c.inPoint || 0;
  const parse = (pn) => {
    const p = pget(eff, pn);
    assert(p, 'Corner Pin missing ' + pn + ' in ' + name);
    if (p.keyframes) return p.keyframes.map((k) => {
      const [x, y] = xy(k.v);
      return { t: r4(c.start + k.t - ip), x: r4(x), y: r4(y), ...handles(k) };
    });
    const [x, y] = xy(p.value);
    return [{ t: 0, x: r4(x), y: r4(y) }];
  };
  const cp = {
    win: [r4(c.start), r4(c.end)],
    ul: parse('Upper Left'), ur: parse('Upper Right'),
    ll: parse('Lower Left'), lr: parse('Lower Right'),
  };
  const rest = { ul: [0, 0], ur: [1, 0], ll: [0, 1], lr: [1, 1] };
  let keyed = 0;
  for (const k of ['ul', 'ur', 'll', 'lr']) {
    if (cp[k].length > 1) {
      keyed++;
      assert(cp[k].length === 3, 'Corner ' + k + ' not 3-kf in ' + name);
      const first = cp[k][0], last = cp[k][cp[k].length - 1];
      assert(near(first.x, rest[k][0], 0.05) && near(first.y, rest[k][1], 0.05), 'Corner ' + k + ' does not START at identity in ' + name);
      assert(near(last.x, rest[k][0], 0.05) && near(last.y, rest[k][1], 0.05), 'Corner ' + k + ' does not settle in ' + name);
    } else {
      assert(near(cp[k][0].x, rest[k][0]) && near(cp[k][0].y, rest[k][1]), 'static corner not identity in ' + name);
    }
  }
  assert(keyed === 2, 'expected exactly 2 keyed corners (one edge) in ' + name);
  return cp;
}

function buildRow(seq) {
  const m = seq.name.match(/^Spin 3D (Center|Corner|Side) Ease( Short)? - (.+)$/);
  assert(m, 'bad name ' + seq.name);
  const sub = m[1], isShort = !!m[2], dir = m[3];
  const variant = `3D ${sub} Ease${isShort ? ' Short' : ''}`;

  const content = seq.clips.find((c) => c.track === 0 && !c.effects.length);
  assert(content && seq.clips.length === 4, seq.name + ': expected content + 3 effect clips');
  const durationSeconds = r4(content.end);

  const phaseClips = seq.clips
    .filter((c) => c !== content && c.subClipName !== 'Corner')
    .sort((a, b) => a.start - b.start);
  assert(phaseClips.length === 2, seq.name + ': expected 2 phase clips');
  const inPhase = phaseParams(phaseClips[0], seq.name + ' (in)');
  const outPhase = phaseParams(phaseClips[1], seq.name + ' (out)');
  assert(near(inPhase.win[1], outPhase.win[0]), 'phases not contiguous in ' + seq.name);
  // rotation shape: In starts at 0 and leaves; Out arrives from the OPPOSITE
  // sign and settles at 0 (the swap hides under peak rotational blur)
  assert(inPhase.rot[0].v === 0 && Math.abs(inPhase.rot[1].v) >= 20, '(In) rot shape off in ' + seq.name);
  assert(outPhase.rot[1].v === 0 && Math.abs(outPhase.rot[0].v) >= 20, '(Out) rot shape off in ' + seq.name);
  assert(Math.sign(outPhase.rot[0].v) === -Math.sign(inPhase.rot[1].v), 'rot signs not opposed in ' + seq.name);
  // anchors per subgroup: Center = center, Corner = a corner, Side = an edge midpoint
  const onGrid = (v) => near(v, 0) || near(v, 0.5) || near(v, 1);
  assert(onGrid(inPhase.cx) && onGrid(inPhase.cy), 'anchor off-grid in ' + seq.name);
  if (sub === 'Center') assert(near(inPhase.cx, 0.5) && near(inPhase.cy, 0.5), 'Center anchor not center in ' + seq.name);
  if (sub === 'Corner') assert(!near(inPhase.cx, 0.5) && !near(inPhase.cy, 0.5), 'Corner anchor not a corner in ' + seq.name);
  if (sub === 'Side') assert(near(inPhase.cx, 0.5) !== near(inPhase.cy, 0.5), 'Side anchor not an edge midpoint in ' + seq.name);
  assert(inPhase.cx === outPhase.cx && inPhase.cy === outPhase.cy, 'phase anchors differ in ' + seq.name);

  const cornerClip = seq.clips.find((c) => c.subClipName === 'Corner');
  assert(cornerClip, 'no Corner clip in ' + seq.name);
  const cornerPin = cornerParams(cornerClip, seq.name);

  // audio: Spin_01 @0.04, in-point 0, window = duration
  const au = (seq.audio || [])[0];
  assert(au && seq.audio.length === 1, 'expected 1 audio clip in ' + seq.name);
  assert(/Spin_01/.test(au.mediaPath || ''), 'unexpected SFX media in ' + seq.name);
  assert(near(au.start, 0.04) && (au.inPoint || 0) === 0 && near(au.end, durationSeconds),
    'audio timing off in ' + seq.name);
  const sfx = `transitions/lib/sfx-spin3d-${isShort ? '44' : '88'}.mp3`;

  const cut = r4(outPhase.win[0] / durationSeconds);
  const pivotDesc = sub === 'Center' ? 'the frame center'
    : sub === 'Corner' ? `the ${inPhase.cy < 0.5 ? 'top' : 'bottom'}-${inPhase.cx < 0.5 ? 'left' : 'right'} corner`
    : `the ${near(inPhase.cx, 0.5) ? (inPhase.cy < 0.5 ? 'top' : 'bottom') : (inPhase.cx < 0.5 ? 'left' : 'right')} edge midpoint`;

  return {
    id: `spin-${slug(variant)}-${slug(dir)}`,
    category: 'SPIN',
    variant,
    intensity: dir,
    label: `Spin · ${variant} · ${dir}`,
    engine: 'PerspectiveEase',
    kind: 'geometric',
    fidelity: 'near-1:1',
    durationSeconds,
    params: {
      cut,
      inPhase,
      outPhase,
      shutter: 320,
      cornerPin,
    },
    sfx,
    used_in: [],
    meta: {
      aspectRatios: ['16:9'],
      resolution: '1920x1080',
      family: `Spin ${variant}`,
      engineFile: 'remotion/src/transitions/engines/PerspectiveEase.tsx',
      description: `3D spin about ${pivotDesc}: the outgoing shot swings away over mirrored padding under heavy rotational blur, the incoming shot swings in from the opposite side and eases to rest while a keystone wobble (one frame edge stretching and flattening) sells the 3D. ${isShort ? 'Short: fast and punchy.' : ''}`.trim(),
      energy: 'high',
      durationSeconds,
      hasSound: true,
      fidelity: 'near-1:1',
      tags: ['spin', '3d', 'rotation', slug(sub), slug(dir), 'keystone', ...(isShort ? ['short'] : [])],
      useWhen: `Rotational scene change with real 3D feel (~${durationSeconds}s); the swing direction (${dir}) picks the motion. Great for energetic reveals and montage beats. ${isShort ? 'Snappy version.' : ''}`.trim(),
    },
  };
}

const rows = clips.map(buildRow);
assert(rows.length === 24, 'expected 24 rows, got ' + rows.length);
const libPath = path.join(__dirname, 'library.json');
const lib = JSON.parse(fs.readFileSync(libPath, 'utf8'));
lib.transitions = lib.transitions.filter((r) => r.category !== 'SPIN');
lib.transitions.push(...rows);
fs.writeFileSync(libPath, JSON.stringify(lib, null, 2));
console.log(`built ${rows.length} SPIN rows; library now ${lib.transitions.length}`);
for (const id of ['spin-3d-center-ease-b-ccw', 'spin-3d-corner-ease-t-cw', 'spin-3d-side-ease-short-right']) {
  const r = rows.find((x) => x.id === id);
  console.log(id + ':', JSON.stringify({ cut: r.params.cut, inRot: r.params.inPhase.rot, outRot: r.params.outPhase.rot, anchor: [r.params.inPhase.cx, r.params.inPhase.cy], inShutter: r.params.inPhase.shutter, keyedCorners: ['ul','ur','ll','lr'].filter(k=>r.params.cornerPin[k].length>1) }));
}

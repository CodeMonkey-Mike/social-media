#!/usr/bin/env node
/** _perspective-clips.json -> 64 PERSPECTIVE rows (Ease In / Ease Out / Hit In /
 * Hit Out, each + Short, x 8 dirs), engine PerspectiveEase.
 *
 * Mechanism (decoded 2026-07-13, verified vs previews): every phase = a uniform
 * zoom of the current scene about a PINNED point; three phase kinds:
 *  - plain (norm 100): raw Geometry2, anchor == position == the direction point.
 *  - rig2 (norm 200): Offset 0:0 (= HALF-FRAME wrap shift, quadrant swap) +
 *    Replicate(2) + 4 Mirrors -> coherent half-size copy at rig center w/ TRUE
 *    mirror padding; anchor = 0.25 + p/2 (quarter map).
 *  - rig3 (norm 300, Hit In's slam): Replicate(3) + 4 Mirrors at the 1/3 lines,
 *    NO Offset (odd grid centers itself); anchor = 1/3 + p/3 (hand-placed with
 *    tiny jitter on some rows — REAL values shipped, not snapped).
 * Families: Ease In = plain 100->300 | rig2 135->200. Ease Out = rig2 200->135 |
 * plain 300->100. Hit In = plain 100->300 | rig3 150->300 slam + Shake + Deviation.
 * Hit Out = rig2 200->135 | plain 300->100 slam + Shake + Deviation.
 * Shake = rig2-identity window + keyframed Position jitter (±3%, ends at rest).
 * Deviation = Tint black->RED white->BLUE (ARGB16; preview-verified ORANGE/BLUE
 * fringes — the white end is NOT black, unlike GLITCH/Offset) + Emboss 45/10/70
 * + Pin Light = an R/B split along the 45 diagonal, windowed.
 *
 * Pack data quirks handled here: subclip names are COPY-PASTED across dirs and
 * Hit In's "(In" is missing its closing paren -> phases are identified by SHAPE
 * and ORDER, never by subclip name; "Perspective  Hit Out" has a double space.
 *
 * SFX by MEASURED (media, start, in-point, window) — asserted, not assumed:
 * Ease In: Spin_01 @0 from 0        -> sfx-perspective-ease-{84,44}.mp3
 * Ease Out: Spin_01 @0.04 from .048 -> sfx-perspective-easeout-{84,44}.mp3 (lead baked)
 * Hit long: Optics_02 @0.04 from 0  -> sfx-perspective-hit-{76,80}.mp3 (lead baked)
 * Hit Short: Optics_02 @0 from 0    -> sfx-perspective-hit-40.mp3
 *
 * Hard-fails on any deviation from the verified recipe (Rule 2).
 * Merges into library.json (replaces prior PERSPECTIVE rows).
 */
const fs = require('fs');
const path = require('path');
const clips = require('./_perspective-clips.json');

const num = (s) => (s == null ? null : +String(s).replace(/[^0-9eE.+-]/g, ''));
const r4 = (n) => +n.toFixed(4);
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const handles = (k) => (k.a && k.a.length >= 7
  ? { iv: num(k.a[3]), ii: num(k.a[4]), ov: num(k.a[5]), oi: num(k.a[6]) }
  : {});
const assert = (cond, msg) => { if (!cond) throw new Error('ASSERT: ' + msg); };
const near = (a, b, eps = 1e-3) => Math.abs(a - b) < eps;
const xy = (v) => String(v).split(':').map(num);

const DIR_POINT = {
  'Down': [0.5, 1], 'Up': [0.5, 0], 'Left': [0, 0.5], 'Right': [1, 0.5],
  'Left Down': [0, 1], 'Left Up': [0, 0], 'Right Down': [1, 1], 'Right Up': [1, 0],
};
const TINT_RED = '18374966855136706560';  // ARGB16 ff00ff0000000000 = RED (A,R,G,B fields)
const TINT_BLUE = '18374686479671688960'; // ARGB16 ff0000000000ff00 = BLUE (white end is NOT black!)

// per-family phase templates: [normIn, s0In, s1In, normOut, s0Out, s1Out, hit]
const FAMILY = {
  'Ease In': { in: [100, 100, 300], out: [200, 135, 200], hit: false },
  'Ease Out': { in: [200, 200, 135], out: [100, 300, 100], hit: false },
  'Hit In': { in: [100, 100, 300], out: [300, 150, 300], hit: true },
  'Hit Out': { in: [200, 200, 135], out: [100, 300, 100], hit: true },
  // Pan 3D: both phases PAN (keyframed Position, center anchor); (Out) rides
  // under the keyframed Corner Pin keystone ("Corner" adjustment clip).
  'Pan 3D': { in: [200, 200, 150], out: [100, 200, 100], hit: false, pan: true },
};

function geoOf(c) {
  return (c.effects || []).find((e) => e.matchName === 'AE.ADBE Geometry2');
}
const pget = (eff, n) => eff.params.find((x) => x.name === n);

/** Classify a phase clip by its effect shape -> { norm, base, factor }. */
function rigKind(c, name) {
  const mirrors = c.effects.filter((e) => e.matchName === 'AE.ADBE Mirror');
  const rep = c.effects.find((e) => e.matchName === 'PR.ADBE Replicate');
  const off = c.effects.find((e) => e.matchName === 'AE.ADBE Offset');
  if (!rep) {
    assert(mirrors.length === 0 && !off, 'plain phase has rig leftovers in ' + name);
    return { norm: 100, base: 0, factor: 1 };
  }
  const count = num(pget(rep, 'Count').value);
  assert(mirrors.length === 4, 'rig without 4 mirrors in ' + name);
  if (count === 2) {
    const ov = xy(pget(off, 'Shift Center To').value);
    assert(off && near(ov[0], 0) && near(ov[1], 0), 'rig2 Offset not 0:0 in ' + name);
    // mirror lines at the quarter points (the ExpandPan padding-rig constants)
    for (const want of [[1, 0.25, -90], [1, 0.749, 90], [0.25, 0.5, 180], [0.7495, 0.5, 0]]) {
      assert(mirrors.some((m) => {
        const c2 = xy(pget(m, 'Reflection Center').value);
        return near(c2[0], want[0], 0.002) && near(c2[1], want[1], 0.002) && near(num(pget(m, 'Reflection Angle').value), want[2]);
      }), 'rig2 mirror mismatch in ' + name);
    }
    return { norm: 200, base: 0.25, factor: 2 };
  }
  if (count === 3) {
    assert(!off, 'rig3 unexpectedly has Offset in ' + name);
    // mirror lines at the third points
    for (const want of [[1, 1 / 3, -90], [1, 0.6662, 90], [1 / 3, 0.5, 180], [0.6664, 0.5, 0]]) {
      assert(mirrors.some((m) => {
        const c2 = xy(pget(m, 'Reflection Center').value);
        return near(c2[0], want[0], 0.002) && near(c2[1], want[1], 0.002) && near(num(pget(m, 'Reflection Angle').value), want[2]);
      }), 'rig3 mirror mismatch in ' + name);
    }
    return { norm: 300, base: 1 / 3, factor: 3 };
  }
  throw new Error('ASSERT: unexpected Replicate count ' + count + ' in ' + name);
}

function phaseParams(c, name) {
  const g = geoOf(c);
  assert(g, 'phase clip without Geometry2 in ' + name);
  const sh = pget(g, 'Scale Height');
  assert(sh && sh.keyframes && sh.keyframes.length === 2, 'Scale Height not 2-kf in ' + name);
  assert(num(pget(g, 'Scale Width').value) === 100, 'Scale Width != 100 in ' + name);
  assert(num(pget(g, 'Shutter Angle').value) === 180, 'Shutter != 180 in ' + name);
  assert(near(c.outPoint - c.inPoint, c.end - c.start), 'clip rate != 1 on phase in ' + name);
  const { norm, base, factor } = rigKind(c, name);
  const a = xy(pget(g, 'Anchor Point').value);
  const posP = pget(g, 'Position');
  const ip = c.inPoint || 0;
  const out = {
    win: [r4(c.start), r4(c.end)],
    kfs: sh.keyframes.map((k) => ({ t: r4(c.start + k.t - ip), v: num(k.v), ...handles(k) })),
    norm,
    cx: r4((a[0] - base) * factor),
    cy: r4((a[1] - base) * factor),
    fx: 0, fy: 0,
    mirror: norm !== 100,
  };
  if (posP.keyframes) {
    // Pan 3D: the pin PANS — ship the real 2D curve; fx/fy = rest point for reference
    out.pan = posP.keyframes.map((k) => {
      const [x, y] = xy(k.v);
      return { t: r4(c.start + k.t - ip), x: r4(x), y: r4(y), ...handles(k) };
    });
    out.fx = out.pan[out.pan.length - 1].x;
    out.fy = out.pan[out.pan.length - 1].y;
  } else {
    const pos = xy(posP.value);
    out.fx = r4(pos[0]);
    out.fy = r4(pos[1]);
  }
  return out;
}

/** Parse the Pan 3D "Corner" adjustment clip -> Corner Pin kf blocks. */
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
  // every corner must SETTLE at identity (the keystone flattens to rest)
  const rest = { ul: [0, 0], ur: [1, 0], ll: [0, 1], lr: [1, 1] };
  for (const k of ['ul', 'ur', 'll', 'lr']) {
    const last = cp[k][cp[k].length - 1];
    assert(near(last.x, rest[k][0], 0.05) && near(last.y, rest[k][1], 0.05),
      'Corner ' + k + ' does not settle at identity in ' + name);
  }
  return cp;
}

function buildRow(seq) {
  const norm = seq.name.replace(/\s+/g, ' ');
  const mp = norm.match(/^Perspective Pan 3D( Short)? Ease - (.+)$/);
  const m = mp ? null : norm.match(/^Perspective (Ease In|Ease Out|Hit In|Hit Out)( Short)? - (.+)$/);
  assert(mp || m, 'bad name ' + seq.name);
  const fam = mp ? 'Pan 3D' : m[1];
  const isShort = mp ? !!mp[1] : !!m[2];
  const dir = mp ? mp[2] : m[3];
  const variant = fam + (isShort ? ' Short' : '');
  const tpl = FAMILY[fam];
  const [px, py] = DIR_POINT[dir] || [];
  assert(px !== undefined, 'unknown dir ' + dir);

  const content = seq.clips.find((c) => c.track === 0 && !c.effects.length);
  assert(content, 'no content clip in ' + seq.name);
  const durationSeconds = r4(content.end);

  // phases by SHAPE + ORDER (subclip names are unreliable: copy-pasted dirs,
  // Hit In's missing paren): keyframed-scale clips sorted by start time.
  const phaseClips = seq.clips
    .filter((c) => c !== content && geoOf(c) && pget(geoOf(c), 'Scale Height').keyframes)
    .sort((a, b) => a.start - b.start);
  assert(phaseClips.length === 2, seq.name + ': expected 2 phase clips, got ' + phaseClips.length);
  const inPhase = phaseParams(phaseClips[0], seq.name + ' (in)');
  const outPhase = phaseParams(phaseClips[1], seq.name + ' (out)');
  assert(near(inPhase.win[1], outPhase.win[0]), 'phases not contiguous in ' + seq.name);

  // template check: norms + scale endpoints per family
  for (const [ph, t] of [[inPhase, tpl.in], [outPhase, tpl.out]]) {
    assert(ph.norm === t[0] && ph.kfs[0].v === t[1] && ph.kfs[1].v === t[2],
      `phase shape ${ph.norm}:${ph.kfs[0].v}->${ph.kfs[1].v} != template ${t} in ` + seq.name);
  }
  // direction geometry
  if (tpl.pan) {
    // Pan 3D: both phases center-anchored; the PAN carries the direction.
    // (In) pans 0.5 -> the direction (~±0.37 dominant axis, hand-placed);
    // (Out) enters from the OPPOSITE edge and settles at center.
    const dvx = px - 0.5, dvy = py - 0.5; // direction vector (one axis ±0.5)
    for (const ph of [inPhase, outPhase]) {
      assert(near(ph.cx, 0.5, 2e-3) && near(ph.cy, 0.5, 2e-3), 'Pan 3D anchor not center in ' + seq.name);
      assert(ph.pan && ph.pan.length === 2, 'Pan 3D phase without 2-kf pan in ' + seq.name);
    }
    const iEnd = inPhase.pan[1], oStart = outPhase.pan[0], oEnd = outPhase.pan[1];
    assert(near(inPhase.pan[0].x, 0.5, 2e-3) && near(inPhase.pan[0].y, 0.5, 2e-3), '(In) pan not from center in ' + seq.name);
    const along = (iEnd.x - 0.5) * dvx + (iEnd.y - 0.5) * dvy; // >0 = toward the direction
    assert(along > 0.15 && along < 0.23, '(In) pan direction/magnitude off in ' + seq.name + ': ' + along);
    assert(near(oStart.x, 0.5 - dvx * 2 * 0.5, 0.06) && near(oStart.y, 0.5 - dvy * 2 * 0.5, 0.06),
      '(Out) pan not from the opposite edge in ' + seq.name);
    assert(near(oEnd.x, 0.5, 2e-3) && near(oEnd.y, 0.5, 2e-3), '(Out) pan does not settle at center in ' + seq.name);
  } else {
    // pins sit at the direction point; content anchors match it too (rig3 rows
    // carry small hand-placed offsets — tolerance, real values kept)
    for (const ph of [inPhase, outPhase]) {
      const tol = ph.norm === 300 ? 0.03 : 2e-3;
      assert(near(ph.fx, px, tol) && near(ph.fy, py, tol), 'pin != dir point in ' + seq.name);
      assert(near(ph.cx, px, ph.norm === 300 ? 0.08 : 2e-3) && near(ph.cy, py, ph.norm === 300 ? 0.08 : 2e-3),
        'content anchor far from dir point in ' + seq.name);
    }
  }

  // ---- Pan 3D extra: the keyframed Corner Pin keystone over the (Out) window
  let cornerPin = null;
  const cornerClip = seq.clips.find((c) => c.subClipName === 'Corner');
  if (tpl.pan) {
    assert(cornerClip, 'Pan 3D without Corner clip in ' + seq.name);
    assert(seq.clips.length === 4, seq.name + ': expected 4 clips');
    cornerPin = cornerParams(cornerClip, seq.name);
    assert(near(cornerPin.win[0], outPhase.win[0]) && near(cornerPin.win[1], outPhase.win[1]),
      'Corner window != (Out) window in ' + seq.name);
  } else {
    assert(!cornerClip, 'unexpected Corner clip in ' + seq.name);
  }

  // ---- Hit extras: Shake + Deviation
  let shake = null, deviation = null;
  const shakeClip = seq.clips.find((c) => c.subClipName === 'Shake');
  const devClip = seq.clips.find((c) => c.subClipName === 'Deviation');
  if (tpl.hit) {
    assert(shakeClip && devClip, 'Hit without Shake/Deviation in ' + seq.name);
    // Shake = rig2 identity (static scale 200) + keyframed Position jitter
    const g = geoOf(shakeClip);
    const kind = rigKind(shakeClip, seq.name + ' Shake');
    assert(kind.norm === 200, 'Shake not rig2 in ' + seq.name);
    const sh = pget(g, 'Scale Height');
    assert(!sh.keyframes && num(sh.value) === 200, 'Shake scale != static 200 in ' + seq.name);
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

    // Deviation = the verified OFFSET-Hit green-fringe recipe
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
    assert(!shakeClip && !devClip, 'unexpected Shake/Deviation in ' + seq.name);
    if (!tpl.pan) assert(seq.clips.length === 3, seq.name + ': expected 3 clips');
  }

  // ---- audio: measured media + start + in-point + window -> lib file
  const au = (seq.audio || [])[0];
  assert(au && seq.audio.length === 1, 'expected 1 audio clip in ' + seq.name);
  const media = String(au.mediaPath || '').replace(/^.*[\\/]/, '');
  const aip = r4(au.inPoint || 0);
  assert(near(au.end, durationSeconds), 'audio window != duration in ' + seq.name);
  const isHit = tpl.hit;
  assert(media === (isHit ? 'Optics_02.wav' : tpl.pan ? 'Camera_01.wav' : 'Spin_01.wav'),
    'unexpected SFX media ' + media + ' in ' + seq.name);
  let sfxFile;
  if (fam === 'Pan 3D') {
    assert(au.start === 0 && aip === 0, 'Pan 3D audio timing off in ' + seq.name);
    sfxFile = `sfx-perspective-pan3d-${isShort ? '52' : '100'}.mp3`;
  } else if (fam === 'Ease In') {
    assert(au.start === 0 && aip === 0, 'Ease In audio timing off in ' + seq.name);
    sfxFile = `sfx-perspective-ease-${isShort ? '44' : '84'}.mp3`;
  } else if (fam === 'Ease Out') {
    assert(near(au.start, 0.04) && near(aip, 0.0476, 2e-3), 'Ease Out audio timing off in ' + seq.name);
    sfxFile = `sfx-perspective-easeout-${isShort ? '44' : '84'}.mp3`;
  } else if (isShort) {
    assert(au.start === 0 && aip === 0, 'Hit Short audio timing off in ' + seq.name);
    sfxFile = 'sfx-perspective-hit-40.mp3';
  } else {
    assert(near(au.start, 0.04) && aip === 0, 'Hit audio timing off in ' + seq.name);
    sfxFile = `sfx-perspective-hit-${fam === 'Hit In' ? '76' : '80'}.mp3`;
  }

  const cut = r4(outPhase.win[0] / durationSeconds);
  const corner = dir.includes(' ') ? 'corner' : 'edge';
  const DESC = {
    'Ease In': `Perspective zoom toward ${dir.toLowerCase()}: the outgoing shot rockets into the ${dir.toLowerCase()} ${corner} under heavy zoom blur, then the incoming shot appears small, pinned at that same ${corner} over mirrored padding, and eases up to full frame.`,
    'Ease Out': `Perspective pull from ${dir.toLowerCase()}: the outgoing shot recedes toward the ${dir.toLowerCase()} ${corner}, shrinking over mirrored padding, then the incoming shot flies out of a deep zoom at that ${corner} and decelerates smoothly to rest.`,
    'Hit In': `Perspective punch toward ${dir.toLowerCase()}: the outgoing shot whip-zooms into the ${dir.toLowerCase()} ${corner}, then the incoming shot SLAMS from half-size to full frame in a tenth of a second, landing with an impact shake and a red/blue chromatic-fringe flash.`,
    'Hit Out': `Perspective punch from ${dir.toLowerCase()}: the outgoing shot recedes toward the ${dir.toLowerCase()} ${corner} over mirrored padding, then the incoming shot crashes down from a deep zoom, landing with an impact shake and a red/blue chromatic-fringe flash.`,
    'Pan 3D': `3D camera pan toward ${dir.toLowerCase()}: the outgoing shot shrinks and glides off ${dir.toLowerCase()} over mirrored padding, then the incoming shot sweeps in from the opposite side out of a deep zoom, its entering edge stretched in a 3D keystone swing that flattens as it settles at center.`,
  };

  return {
    id: `perspective-${slug(variant)}-${slug(dir)}`,
    category: 'PERSPECTIVE',
    variant,
    intensity: dir,
    label: `Perspective · ${variant} · ${dir}`,
    engine: 'PerspectiveEase',
    kind: 'geometric',
    // Hit ships the swapped-mechanism fringe (OFFSET Hit precedent) -> approximate
    fidelity: isHit ? 'approximate' : 'near-1:1',
    durationSeconds,
    params: {
      cut,
      inPhase,
      outPhase,
      shutter: 180,
      ...(shake ? { shake } : {}),
      ...(deviation ? { deviation } : {}),
      ...(cornerPin ? { cornerPin } : {}),
    },
    sfx: `transitions/lib/${sfxFile}`,
    used_in: [],
    meta: {
      aspectRatios: ['16:9'],
      resolution: '1920x1080',
      family: `Perspective ${variant}`,
      engineFile: 'remotion/src/transitions/engines/PerspectiveEase.tsx',
      description: `${DESC[fam]} ${isShort ? 'Short: fast and punchy.' : ''}`.trim(),
      energy: 'high',
      durationSeconds,
      hasSound: true,
      fidelity: isHit ? 'approximate' : 'near-1:1',
      tags: ['perspective', 'zoom', fam.toLowerCase().replace(/ /g, '-'), slug(dir),
        ...(isHit ? ['hit', 'impact', 'shake'] : tpl.pan ? ['pan', '3d', 'keystone', 'ease'] : ['ease']),
        ...(isShort ? ['short'] : [])],
      useWhen: `High-energy scene change ${fam.startsWith('Hit') ? 'with a physical IMPACT landing (shake + R/B fringe flash) — great for beat drops and hard reveals' : tpl.pan ? `that reads as a 3D camera sweep ${dir.toLowerCase()}ward — the keystone swing gives it depth; great for location moves` : `that "flies" ${fam === 'Ease In' ? 'into' : 'out of'} the ${dir.toLowerCase()} ${corner} with a cinematic eased landing`} (~${durationSeconds}s). ${isShort ? 'Snappy version.' : ''}`.trim(),
    },
  };
}

const rows = clips.map(buildRow);
assert(rows.length === 72, 'expected 72 rows, got ' + rows.length);
const libPath = path.join(__dirname, 'library.json');
const lib = JSON.parse(fs.readFileSync(libPath, 'utf8'));
lib.transitions = lib.transitions.filter((r) => r.category !== 'PERSPECTIVE');
lib.transitions.push(...rows);
fs.writeFileSync(libPath, JSON.stringify(lib, null, 2));
console.log(`built ${rows.length} PERSPECTIVE rows; library now ${lib.transitions.length}`);
for (const id of ['perspective-ease-in-right', 'perspective-ease-out-right', 'perspective-hit-in-right', 'perspective-hit-out-short-right']) {
  const s = rows.find((r) => r.id === id);
  console.log(id + ':', JSON.stringify({ cut: s.params.cut, in: s.params.inPhase, out: s.params.outPhase, shake: !!s.params.shake, dev: !!s.params.deviation, sfx: s.sfx }));
}

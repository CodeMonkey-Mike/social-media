#!/usr/bin/env node
/** _shake-clips.json -> 34 SHAKE rows (Hit 6 + Horizontal 7 + Long 7 + Short 7 +
 * Skew 7), engine ShakeJolt.
 *
 * Mechanism (decoded 2026-07-13, verified vs previews): ONE full-window rig2
 * adjustment (Offset 0:0 half-frame quadrant swap + Replicate 2 + 4 Mirrors +
 * static Scale 200 = mirror-padded IDENTITY, center anchor) carrying a
 * continuous 25fps-keyed shake: Position jolts + Rotation (Hit/Long/Short) or
 * Skew (Skew: Axis 0 = skewX; Horizontal: Axis 90 = skewY). The A->B cut hides MID-SHAKE at the
 * split between two media-continuous "Deviation" clips (Tint black->RED
 * white->BLUE + Emboss dir 45/90, relief scales with intensity + Pin Light =
 * the R/B fringe bracketing the cut).
 *
 * NO SFX — verified 3 ways (FullHD audio groups empty, previews video-only,
 * no Shake file in Sound/). Previews are NATIVE 25fps.
 *
 * Hard-fails on any deviation from the verified recipe (Rule 2).
 * Merges into library.json (replaces prior SHAKE rows).
 */
const fs = require('fs');
const path = require('path');
const clips = require('./_shake-clips.json');

const num = (s) => (s == null ? null : +String(s).replace(/[^0-9eE.+-]/g, ''));
const r4 = (n) => +n.toFixed(4);
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const handles = (k) => (k.a && k.a.length >= 7
  ? { iv: num(k.a[3]), ii: num(k.a[4]), ov: num(k.a[5]), oi: num(k.a[6]) }
  : {});
const assert = (cond, msg) => { if (!cond) throw new Error('ASSERT: ' + msg); };
const near = (a, b, eps = 1e-3) => Math.abs(a - b) < eps;
const xy = (v) => String(v).split(':').map(num);

const TINT_RED = '18374966855136706560';  // ARGB16 ff00ff0000000000 = RED
const TINT_BLUE = '18374686479671688960'; // ARGB16 ff0000000000ff00 = BLUE

// which curve each subgroup jolts besides Position (asserted per row)
const FAMILY = {
  Hit: 'Rotation', Horizontal: 'Skew', Long: 'Rotation', Short: 'Rotation', Skew: 'Skew',
};

const pget = (eff, n) => eff.params.find((x) => x.name === n);

function buildRow(seq) {
  const m = seq.name.match(/^Shake (Hit|Horizontal|Long|Short|Skew) - (\d)x$/);
  assert(m, 'bad name ' + seq.name);
  const fam = m[1], nx = m[2] + 'x';
  const joltParam = FAMILY[fam];

  const content = seq.clips.find((c) => c.track === 0 && !c.effects.length);
  assert(content, 'no content clip in ' + seq.name);
  const durationSeconds = r4(content.end);

  // ---- the ONE rig clip
  const mains = seq.clips.filter((c) => (c.effects || []).some((e) => e.matchName === 'AE.ADBE Geometry2'));
  assert(mains.length === 1, seq.name + ': expected 1 rig clip, got ' + mains.length);
  const main = mains[0];
  assert(near(main.outPoint - main.inPoint, main.end - main.start), 'rig clip rate != 1 in ' + seq.name);
  const g = main.effects.find((e) => e.matchName === 'AE.ADBE Geometry2');

  // rig2 constants (the ExpandPan padding rig, center-anchored identity)
  const mirrors = main.effects.filter((e) => e.matchName === 'AE.ADBE Mirror');
  const rep = main.effects.find((e) => e.matchName === 'PR.ADBE Replicate');
  const off = main.effects.find((e) => e.matchName === 'AE.ADBE Offset');
  assert(mirrors.length === 4 && rep && num(pget(rep, 'Count').value) === 2, 'rig2 shape off in ' + seq.name);
  const ov = xy(pget(off, 'Shift Center To').value);
  assert(near(ov[0], 0) && near(ov[1], 0), 'rig Offset not 0:0 in ' + seq.name);
  for (const want of [[1, 0.25, -90], [1, 0.749, 90], [0.25, 0.5, 180], [0.7495, 0.5, 0]]) {
    assert(mirrors.some((mm) => {
      const c2 = xy(pget(mm, 'Reflection Center').value);
      return near(c2[0], want[0], 0.002) && near(c2[1], want[1], 0.002) && near(num(pget(mm, 'Reflection Angle').value), want[2]);
    }), 'rig2 mirror mismatch in ' + seq.name);
  }
  const a = xy(pget(g, 'Anchor Point').value);
  assert(near(a[0], 0.5, 2e-3) && near(a[1], 0.5, 2e-3), 'anchor not center in ' + seq.name);
  const sh = pget(g, 'Scale Height');
  assert(!sh.keyframes && num(sh.value) === 200, 'rig scale != static 200 in ' + seq.name);
  assert(num(pget(g, 'Scale Width').value) === 100, 'Scale Width != 100 in ' + seq.name);
  assert(num(pget(g, 'Shutter Angle').value) === 180, 'Shutter != 180 in ' + seq.name);
  const skewAxis = num(pget(g, 'Skew Axis').value);
  assert(skewAxis === 0 || skewAxis === 90, 'unexpected Skew Axis in ' + seq.name); // Skew=0 (skewX), Horizontal=90 (skewY)

  // curves: Position always; Rotation XOR Skew per family; both end AT REST
  const ip = main.inPoint || 0;
  const posP = pget(g, 'Position');
  assert(posP.keyframes && posP.keyframes.length >= 8, 'Position not densely keyed in ' + seq.name);
  const pos = posP.keyframes.map((k) => {
    const [x, y] = xy(k.v);
    return { t: r4(main.start + k.t - ip), x: r4(x - 0.5), y: r4(y - 0.5), ...handles(k) };
  });
  const joltP = pget(g, joltParam);
  const otherName = joltParam === 'Rotation' ? 'Skew' : 'Rotation';
  const otherP = pget(g, otherName);
  assert(joltP.keyframes && joltP.keyframes.length === posP.keyframes.length,
    joltParam + ' not keyed like Position in ' + seq.name);
  assert(!otherP.keyframes && num(otherP.value) === 0, otherName + ' not static 0 in ' + seq.name);
  const jolt = joltP.keyframes.map((k) => ({ t: r4(main.start + k.t - ip), v: num(k.v), ...handles(k) }));
  const lastP = pos[pos.length - 1], lastJ = jolt[jolt.length - 1];
  assert(near(lastP.x, 0, 5e-3) && near(lastP.y, 0, 5e-3) && near(lastJ.v, 0, 0.5),
    'shake does not end at rest in ' + seq.name);

  // ---- the Deviation pair: identical params, contiguous, media-continuous;
  // the split IS the A->B cut
  const devs = seq.clips.filter((c) => c.subClipName === 'Deviation');
  assert(devs.length === 2, seq.name + ': expected 2 Deviation clips');
  devs.sort((x, y) => x.start - y.start);
  const [d1, d2] = devs;
  assert(near(d1.end, d2.start), 'Deviation pair not contiguous in ' + seq.name);
  assert(near(d2.inPoint, d1.end - d1.start), 'Deviation media not continuous across the cut in ' + seq.name);
  const devVals = devs.map((dv) => {
    const em = dv.effects.find((e) => e.matchName === 'AE.ADBE Emboss');
    const tn = dv.effects.find((e) => e.matchName === 'AE.ADBE Tint');
    const op = dv.effects.find((e) => e.matchName === 'AE.ADBE Opacity');
    assert(em && tn && op, 'Deviation effects missing in ' + seq.name);
    assert(pget(tn, 'Map Black To').value === TINT_RED && pget(tn, 'Map White To').value === TINT_BLUE,
      'Deviation tint not red/blue in ' + seq.name);
    assert(op.params.some((p) => p.name === 'Blend Mode' && num(p.value) === 17), 'Deviation not Pin Light in ' + seq.name);
    return {
      dir: num(pget(em, 'Direction').value),
      relief: num(pget(em, 'Relief').value),
      contrast: num(pget(em, 'Contrast').value),
    };
  });
  assert(devVals[0].dir === devVals[1].dir && devVals[0].relief === devVals[1].relief,
    'Deviation pair params differ in ' + seq.name);
  const { dir, relief, contrast } = devVals[0];
  assert((dir === 45 || dir === 90) && contrast === 70, 'unexpected Deviation dir/contrast in ' + seq.name);
  // shift vector from the emboss direction (GlitchOffset empirical rule:
  // theta -> (sin, cos) in y-down screen coords), dominant axis = relief*0.7
  const s = Math.max(1, Math.round(relief * 0.7));
  const devDx = dir === 90 ? s : s; // 45: (s,s) diagonal, 90: (s,0) horizontal
  const devDy = dir === 90 ? 0 : s;
  const cutT = r4(d2.start);

  // ---- NO audio (Rule 7: verified 3 ways)
  assert(!seq.audio || seq.audio.length === 0, 'unexpected audio in ' + seq.name);

  const DESC = {
    Hit: 'One hard camera hit: a single violent jolt with a rotational kick, the cut buried inside the impact under a red/blue fringe flash.',
    Horizontal: 'Horizontal camera shake: side-to-side jolts with a shearing skew wobble, the cut hidden mid-shake under a horizontal red/blue fringe flash.',
    Long: 'A long rolling camera shake: a full second of decaying jolts and rotational wobble, the cut buried in the middle under a red/blue fringe flash.',
    Short: 'A quick camera shake burst: tight jolts with rotational wobble, the cut hidden mid-burst under a red/blue fringe flash.',
    Skew: 'Skew-heavy camera shake: the frame shears and snaps side to side, the cut hidden mid-shake under a horizontal red/blue fringe flash.',
  };

  return {
    id: `shake-${slug(fam)}-${nx}`,
    category: 'SHAKE',
    variant: fam,
    intensity: nx,
    label: `Shake · ${fam} · ${nx}`,
    engine: 'ShakeJolt',
    kind: 'geometric',
    // geometry near-1:1; the fringe mechanism is swapped (channel shift, not
    // emboss — PERSPECTIVE/OFFSET Hit precedent) -> approximate
    fidelity: 'approximate',
    durationSeconds,
    params: {
      cutT,
      win: [r4(main.start), r4(main.end)],
      pos,
      ...(joltParam === 'Rotation' ? { rot: jolt } : { skew: jolt, skewAxis }),
      shutter: 180,
      deviation: { win: [r4(d1.start), r4(d2.end)], dx: devDx, dy: devDy },
    },
    sfx: null,
    used_in: [],
    meta: {
      aspectRatios: ['16:9'],
      resolution: '1920x1080',
      family: `Shake ${fam}`,
      engineFile: 'remotion/src/transitions/engines/ShakeJolt.tsx',
      description: `${DESC[fam]} Intensity ${nx} of ${fam === 'Hit' ? 6 : 7}.`,
      energy: 'high',
      durationSeconds,
      hasSound: false,
      fidelity: 'approximate',
      tags: ['shake', 'camera', 'jolt', slug(fam), nx,
        ...(joltParam === 'Skew' ? ['skew', 'shear'] : ['rotation'])],
      useWhen: `Impact-style cut for punchy pacing (~${durationSeconds}s, silent — add your own hit SFX): the shake sells a physical camera bump and the fringe flash hides the splice. Higher x = stronger jolt.`,
    },
  };
}

const rows = clips.map(buildRow);
assert(rows.length === 34, 'expected 34 rows, got ' + rows.length);
const libPath = path.join(__dirname, 'library.json');
const lib = JSON.parse(fs.readFileSync(libPath, 'utf8'));
lib.transitions = lib.transitions.filter((r) => r.category !== 'SHAKE');
lib.transitions.push(...rows);
fs.writeFileSync(libPath, JSON.stringify(lib, null, 2));
console.log(`built ${rows.length} SHAKE rows; library now ${lib.transitions.length}`);
for (const id of ['shake-hit-1x', 'shake-horizontal-3x', 'shake-long-7x', 'shake-skew-5x']) {
  const r = rows.find((x) => x.id === id);
  console.log(id + ':', JSON.stringify({ cutT: r.params.cutT, win: r.params.win, dur: r.durationSeconds, posN: r.params.pos.length, rot: !!r.params.rot, skew: !!r.params.skew, dev: r.params.deviation }));
}

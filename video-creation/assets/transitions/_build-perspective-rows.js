#!/usr/bin/env node
/** _perspective-clips.json -> 16 PERSPECTIVE rows (Ease In + Ease In Short x 8 dirs),
 * engine PerspectiveEase.
 *
 * Mechanism (decoded 2026-07-13, verified vs previews):
 *  - (In) [0.04..cut]: Geometry2 on A, uniform Scale 100->300 anchored AT the
 *    direction point (anchor == position == e.g. Right (1,0.5)) — A zooms hard
 *    into the direction edge/corner. Shutter 180 motion blur (the wash at peak).
 *  - (Out) [cut..end]: the Offset(0:0 = HALF-FRAME wrap shift, quadrant swap!) +
 *    Replicate(2) + 4-Mirror rig recomposes ONE coherent half-size B at rig
 *    center with TRUE mirror padding; Geometry2 Scale 135->200 with anchor at
 *    the quarter-map point (0.25 + p/2) positioned at the direction point =
 *    B scaled by scale/200 about ITS direction point pinned to the frame's
 *    direction point (identity at 200). Mirror padding fills the exposed sides.
 *  - All 16 share the exact same curves/handles; direction lives ONLY in the
 *    anchor/position pair. Short = same curves re-timed (0.12s / 0.24s).
 *  - SFX Spin_01.wav from in-point 0, window-truncated (0.84 / 0.44).
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

const DIR_POINT = {
  'Down': [0.5, 1], 'Up': [0.5, 0], 'Left': [0, 0.5], 'Right': [1, 0.5],
  'Left Down': [0, 1], 'Left Up': [0, 0], 'Right Down': [1, 1], 'Right Up': [1, 0],
};

// the verified (Out) mirror rig — constants shared by ExpandPan (same padding rig)
const RIG_MIRRORS = [
  { c: [1, 0.25], a: -90 }, { c: [1, 0.74907410144805908], a: 90 },
  { c: [0.25, 0.5], a: 180 }, { c: [0.74947917461395264, 0.5], a: 0 },
];

const xy = (v) => String(v).split(':').map(num);

function geo(c) {
  const e = c.effects.find((x) => x.matchName === 'AE.ADBE Geometry2');
  assert(e, 'no Geometry2 on ' + c.subClipName);
  const p = (n) => e.params.find((x) => x.name === n);
  return { e, p };
}

function scaleKfs(c) {
  const { p } = geo(c);
  const sh = p('Scale Height');
  assert(sh && sh.keyframes, 'Scale Height not keyframed on ' + c.subClipName);
  // uniform-scale read (ExpandPan precedent + preview: building zooms in BOTH axes)
  assert(num(p('Scale Width').value) === 100, 'Scale Width != 100 on ' + c.subClipName);
  assert(num(p('Shutter Angle').value) === 180, 'Shutter != 180 on ' + c.subClipName);
  const ip = c.inPoint || 0;
  return sh.keyframes.map((k) => ({ t: r4(c.start + k.t - ip), v: num(k.v), ...handles(k) }));
}

function buildRow(seq) {
  const m = seq.name.match(/^Perspective (Ease In(?: Short)?) - (.+)$/);
  assert(m, 'bad name ' + seq.name);
  const variant = m[1], dir = m[2];
  const [px, py] = DIR_POINT[dir] || [];
  assert(px !== undefined, 'unknown dir ' + dir);

  assert(seq.clips.length === 3, seq.name + ': expected 3 clips, got ' + seq.clips.length);
  const content = seq.clips.find((c) => c.track === 0 && !c.effects.length);
  const cin = seq.clips.find((c) => /\(In\)$/i.test(c.subClipName || ''));
  const cout = seq.clips.find((c) => /\(Out\)$/i.test(c.subClipName || ''));
  assert(content && cin && cout, seq.name + ': missing content/(In)/(Out)');
  const durationSeconds = r4(content.end);

  // media rate 1 on both adjustment clips (the LIGHT-LEAKS constant-rate trap)
  for (const c of [cin, cout]) {
    assert(near(c.outPoint - c.inPoint, c.end - c.start), 'clip rate != 1 on ' + c.subClipName);
  }
  assert(near(cin.end, cout.start), '(In)/(Out) not contiguous in ' + seq.name);

  // ---- (In): ONLY Geometry2; anchor == position == direction point; 100 -> 300
  assert(cin.effects.length === 1, '(In) extra effects in ' + seq.name);
  {
    const { p } = geo(cin);
    const a = xy(p('Anchor Point').value), pos = xy(p('Position').value);
    assert(near(a[0], px) && near(a[1], py), '(In) anchor != dir point in ' + seq.name);
    assert(near(pos[0], px) && near(pos[1], py), '(In) position != dir point in ' + seq.name);
  }
  const inScale = scaleKfs(cin);
  assert(inScale.length === 2 && inScale[0].v === 100 && inScale[1].v === 300,
    '(In) scale curve not 100->300 in ' + seq.name);

  // ---- (Out): Geometry2 + AlphaAdjust + 4 Mirrors + Replicate 2 + Offset 0:0
  {
    const names = cout.effects.map((e) => e.matchName).sort().join(',');
    assert(names === ['AE.ADBE Alpha Adjust', 'AE.ADBE Geometry2', 'AE.ADBE Mirror', 'AE.ADBE Mirror',
      'AE.ADBE Mirror', 'AE.ADBE Mirror', 'AE.ADBE Offset', 'PR.ADBE Replicate'].sort().join(','),
      '(Out) effect set unexpected in ' + seq.name + ': ' + names);
    const { p } = geo(cout);
    const a = xy(p('Anchor Point').value), pos = xy(p('Position').value);
    assert(near(a[0], 0.25 + px / 2) && near(a[1], 0.25 + py / 2),
      '(Out) anchor not quarter-map in ' + seq.name);
    assert(near(pos[0], px) && near(pos[1], py), '(Out) position != dir point in ' + seq.name);
    // rig constants
    const mirrors = cout.effects.filter((e) => e.matchName === 'AE.ADBE Mirror').map((e) => ({
      c: xy(e.params.find((x) => x.name === 'Reflection Center').value),
      a: num(e.params.find((x) => x.name === 'Reflection Angle').value),
    }));
    for (const want of RIG_MIRRORS) {
      assert(mirrors.some((mm) => near(mm.c[0], want.c[0]) && near(mm.c[1], want.c[1]) && near(mm.a, want.a)),
        '(Out) mirror rig mismatch in ' + seq.name);
    }
    const rep = cout.effects.find((e) => e.matchName === 'PR.ADBE Replicate');
    assert(num(rep.params.find((x) => x.name === 'Count').value) === 2, 'Replicate != 2 in ' + seq.name);
    const off = cout.effects.find((e) => e.matchName === 'AE.ADBE Offset');
    const ov = xy(off.params.find((x) => x.name === 'Shift Center To').value);
    assert(near(ov[0], 0) && near(ov[1], 0), 'rig Offset not 0:0 (half-frame quadrant swap) in ' + seq.name);
    const aa = cout.effects.find((e) => e.matchName === 'AE.ADBE Alpha Adjust');
    const aov = aa.params.find((x) => x.name === 'Opacity');
    assert(!aov || num(aov.value) === 100, '(Out) Alpha Adjust != 100 in ' + seq.name);
  }
  const outScale = scaleKfs(cout);
  assert(outScale.length === 2 && outScale[0].v === 135 && outScale[1].v === 200,
    '(Out) scale curve not 135->200 in ' + seq.name);

  // ---- audio: Spin_01.wav from 0, full window
  assert(seq.audio && seq.audio.length === 1 && /Spin_01/.test(seq.audio[0].mediaPath || ''),
    'audio not Spin_01 in ' + seq.name);
  assert((seq.audio[0].inPoint || 0) === 0 && seq.audio[0].start === 0, 'audio in-point/start != 0 in ' + seq.name);
  const audioWin = r4(seq.audio[0].end - seq.audio[0].start);
  assert(near(audioWin, durationSeconds), 'audio window != duration in ' + seq.name);

  const isShort = /Short/.test(variant);
  const sfx = `transitions/lib/sfx-perspective-ease-${isShort ? '44' : '84'}.mp3`;
  const cut = r4(cout.start / durationSeconds);

  return {
    id: `perspective-${slug(variant)}-${slug(dir)}`,
    category: 'PERSPECTIVE',
    variant,
    intensity: dir,
    label: `Perspective · ${variant} · ${dir}`,
    engine: 'PerspectiveEase',
    kind: 'geometric',
    fidelity: 'near-1:1',
    durationSeconds,
    params: {
      cut,
      px, py,
      inWin: [r4(cin.start), r4(cin.end)],
      inScale,
      outWin: [r4(cout.start), r4(cout.end)],
      outScale,
      shutter: 180,
    },
    sfx,
    used_in: [],
    meta: {
      aspectRatios: ['16:9'],
      resolution: '1920x1080',
      family: `Perspective ${variant}`,
      engineFile: 'remotion/src/transitions/engines/PerspectiveEase.tsx',
      description: `Perspective zoom toward ${dir.toLowerCase()}: the outgoing shot rockets into the ${dir.toLowerCase()} ${dir.includes(' ') ? 'corner' : 'edge'} under heavy zoom blur, then the incoming shot appears small, pinned at that same ${dir.includes(' ') ? 'corner' : 'edge'} over mirrored padding, and eases up to full frame. ${isShort ? 'Short: fast and punchy.' : 'Full-length with a long, smooth settle.'}`,
      energy: 'high',
      durationSeconds,
      hasSound: true,
      fidelity: 'near-1:1',
      tags: ['perspective', 'zoom', 'ease', slug(dir), ...(isShort ? ['short'] : [])],
      useWhen: `High-energy scene change that "flies" into the ${dir.toLowerCase()} ${dir.includes(' ') ? 'corner' : 'edge'} (~${durationSeconds}s); the whip-zoom + eased landing reads cinematic, great for location/topic jumps. ${isShort ? 'Snappy version.' : ''}`.trim(),
    },
  };
}

const rows = clips.map(buildRow);
assert(rows.length === 16, 'expected 16 rows, got ' + rows.length);
const libPath = path.join(__dirname, 'library.json');
const lib = JSON.parse(fs.readFileSync(libPath, 'utf8'));
const before = lib.transitions.length;
lib.transitions = lib.transitions.filter((r) => r.category !== 'PERSPECTIVE');
lib.transitions.push(...rows);
fs.writeFileSync(libPath, JSON.stringify(lib, null, 2));
console.log(`built ${rows.length} PERSPECTIVE rows (replaced ${before + rows.length - lib.transitions.length}); library now ${lib.transitions.length}`);
const s = rows.find((r) => r.id === 'perspective-ease-in-right');
console.log('ease-in-right:', JSON.stringify(s.params));

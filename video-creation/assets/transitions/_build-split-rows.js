#!/usr/bin/env node
/** _split-clips.json -> 144 SPLIT rows (14 subgroups, 4 architecture families).
 *
 * Family A "panes" (64 = Ease/Swinging x long/Short):
 *   Two AEMask-gated Geometry2 HALVES over the rig2 mirror-padded identity
 *   (Offset 0:0 quadrant swap + Replicate 2 + the 4 ExpandPan Mirrors; uniform
 *   Scale Height 200 on each masked Geometry2 = identity at pos 0.5:0.5, so
 *   displacement = position - 0.5, unscaled). The halves slide apart ALONG the
 *   split line ((In)) and the incoming frame's halves slide back ((Out)); the
 *   split orientation MAY CHANGE at the cut (HV/VH). Every pane's motion is
 *   PARALLEL to its own split edge (builder-ASSERTED) -> panes never sample
 *   each other's output -> pure DOM compositing, engine SplitPanes. Shutter 0
 *   everywhere (no motion blur -- the geometry scramble IS the look).
 *
 * Family B "offset panes" (32 = Easy Offset/Swinging Offset x long/Short):
 *   Two AEMask-gated wrap-OFFSETS (torus, no rig), same GLASS architecture ->
 *   engine GlassBeveled, using the NEW additive maskOut field (SPLIT masks can
 *   change at the cut; GLASS rows untouched).
 *
 * Family C "slide" (40 = Slide 12 + Slide Short 12 + Cross 8 + Cross Short 8):
 *   4-5 masked wrap-Offsets = overlapping strip BANDS, GLASS-style
 *   time-staggered, each exactly ONE full wrap (0.5 -> 1.5, ends at identity).
 *   Direction via FULL-FRAME flip sandwiches; Cross interleaves flips so
 *   alternate bands counter-slide. Flips resolved ANALYTICALLY here (mirror
 *   the mask + negate the shift; parity-walked bottom-up, asserted balanced).
 *   -> engine GlassBeveled (bands OVERLAP and compound -> the filter chain).
 *
 * Family D "perspective" (8 = Perspective/Short x Horizontal/Vertical 1-2):
 *   A masked-flip SANDWICH (one half of the frame mirrored for the whole
 *   window) around a 3-phase perspective move: plain zoom 100->300 into an
 *   edge-midpoint pin, then a WRAP-padded pan (Replicate 2 + Offset 0:0, NO
 *   mirrors) under a keyframed Corner Pin keystone that relaxes to identity
 *   across the A->B cut. -> NEW engine SplitPerspective (PerspectiveEase's
 *   evaluators; phase list per side + wrap tiles + the half-flip wrapper).
 *
 * SFX by MEASURED (media, start 0, in-point 0, audio-clip window), asserted:
 *   A+B: Simple_SFX.mp3    win 0.88/0.44/0.48 -> sfx-split-simple-{88,44,48}
 *   C:   Skew_Simple_01    win 1.00/0.76      -> sfx-split-slide-{100,76}
 *   D:   Whoosh_02.wav     win 0.84/0.44      -> sfx-split-perspective-{84,44}
 *
 * Hard-fails on any deviation (Rule 2). Replaces only category SPLIT rows.
 */
const fs = require('fs');
const path = require('path');
const clips = require('./_split-clips.json');

const num = (s) => (s == null ? null : +String(s).replace(/[^0-9eE.+-]/g, ''));
const r4 = (n) => +n.toFixed(4);
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const assert = (cond, msg) => { if (!cond) throw new Error('ASSERT: ' + msg); };
const near = (a, b, eps = 1e-3) => Math.abs(a - b) < eps;
const xy = (v) => String(v).split(':').map(num);
const pget = (eff, n) => eff.params.find((x) => x.name === n);
const handles = (k) => (k.a && k.a.length >= 7
  ? { iv: num(k.a[3]), ii: num(k.a[4]), ov: num(k.a[5]), oi: num(k.a[6]) }
  : {});

// ---------------- mask helpers ----------------
function quad(mask, name) {
  assert(mask && mask.path && mask.path.verts, 'no mask path in ' + name);
  assert(!mask.pathKeyframed, 'keyframed mask in ' + name);
  const vs = mask.path.verts;
  assert(vs.length === 4, `mask has ${vs.length} verts (want 4) in ` + name);
  for (const v of vs) {
    assert(near(v.ti[0], v.a[0]) && near(v.ti[1], v.a[1]) &&
           near(v.to[0], v.a[0]) && near(v.to[1], v.a[1]), 'curved mask edge in ' + name);
  }
  assert(num(mask['Mask Feather']) === 0, 'mask feather != 0 in ' + name);
  assert(num(mask['Mask Opacity']) === 100, 'mask opacity != 100 in ' + name);
  // pack uses 0 or a 0.5px anti-seam expansion (panes overlap half a pixel)
  const exp = num(mask['Mask Expansion']);
  assert(exp === 0 || exp === 0.5, `mask expansion ${exp} unexpected in ` + name);
  // p2 = Inverted flag on every mask we have decoded so far
  assert(mask.p2 === 'false', 'inverted mask in ' + name);
  let q = vs.map((v) => [v.a[0], v.a[1]]);
  if (exp > 0) q = expandQuad(q, exp / 1920, exp / 1080);
  return q.map((v) => [r4(v[0]), r4(v[1])]);
}
/** Offset a convex quad's edges outward by (ex, ey) in normalized coords. */
function expandQuad(q, ex, ey) {
  // signed area -> winding; outward normal = perpendicular away from interior
  const area = q.reduce((a, [x, y], i) => {
    const [x2, y2] = q[(i + 1) % q.length];
    return a + (x * y2 - x2 * y);
  }, 0) / 2;
  const sgn = area > 0 ? 1 : -1; // CCW: outward = (dy, -dx) in y-down coords
  const lines = q.map((v, i) => {
    const w = q[(i + 1) % q.length];
    const dx = w[0] - v[0], dy = w[1] - v[1];
    const L = Math.hypot(dx, dy) || 1;
    const nx = sgn * (dy / L), ny = sgn * (-dx / L);
    return { p: [v[0] + nx * ex, v[1] + ny * ey], d: [dx, dy] };
  });
  // new vertices = intersections of consecutive offset edges
  return q.map((_, i) => {
    const a = lines[(i + q.length - 1) % q.length], b = lines[i];
    const det = a.d[0] * b.d[1] - a.d[1] * b.d[0];
    if (Math.abs(det) < 1e-9) return b.p;
    const t = ((b.p[0] - a.p[0]) * b.d[1] - (b.p[1] - a.p[1]) * b.d[0]) / det;
    return [a.p[0] + a.d[0] * t, a.p[1] + a.d[1] * t];
  });
}
const flipQuadH = (q) => q.map(([x, y]) => [r4(1 - x), y]);
const flipQuadV = (q) => q.map(([x, y]) => [x, r4(1 - y)]);
const sameQuad = (a, b) => a.length === b.length &&
  a.every((v, i) => near(v[0], b[i][0], 2e-3) && near(v[1], b[i][1], 2e-3));

// ---------------- shared clip checks ----------------
function rate1(c, name) {
  if (c.inPoint == null || c.outPoint == null) return;
  assert(near(c.outPoint - c.inPoint, c.end - c.start, 2e-3),
    `clip rate != 1 (${c.outPoint - c.inPoint} vs ${c.end - c.start}) in ` + name);
}
function alphaOk(effs, name) {
  for (const e of effs.filter((x) => x.matchName === 'AE.ADBE Alpha Adjust')) {
    const o = pget(e, 'Opacity');
    assert(!o.keyframes && num(o.value) === 100, 'Alpha Adjust not static 100 in ' + name);
  }
}

// the 4 ExpandPan padding-rig Mirror constants (probe-verified on SPLIT too)
const RIG_MIRRORS = [
  [1, 0.25, -90], [1, 0.7491, 90], [0.25, 0.5, 180], [0.7495, 0.5, 0],
];
function rig2Assert(effs, name) {
  const mirrors = effs.filter((e) => e.matchName === 'AE.ADBE Mirror');
  const rep = effs.find((e) => e.matchName === 'PR.ADBE Replicate');
  const off = effs.find((e) => e.matchName === 'AE.ADBE Offset');
  assert(mirrors.length === 4 && rep && off, 'rig2 shape off in ' + name);
  assert(num(pget(rep, 'Count').value) === 2, 'Replicate != 2 in ' + name);
  const ov = xy(pget(off, 'Shift Center To').value);
  assert(near(ov[0], 0) && near(ov[1], 0) && !pget(off, 'Shift Center To').keyframes,
    'rig Offset not static 0:0 in ' + name);
  const got = mirrors.map((m) => [...xy(pget(m, 'Reflection Center').value), num(pget(m, 'Reflection Angle').value)]);
  for (const want of RIG_MIRRORS) {
    assert(got.some((g) => near(g[0], want[0], 0.01) && near(g[1], want[1], 0.01) && near(g[2], want[2], 0.5)),
      `rig mirror ${want} missing in ` + name);
  }
}

// ---------------- family A: masked Geometry2 panes ----------------
function panesPhase(c, name) {
  rate1(c, name);
  alphaOk(c.effects, name);
  rig2Assert(c.effects, name);
  const geos = c.effects.filter((e) => e.matchName === 'AE.ADBE Geometry2');
  assert(geos.length === 2, `${geos.length} Geometry2 (want 2) in ` + name);
  const ip = c.inPoint || 0;
  // bottom-up apply order: LAST-listed applies first -> reverse
  const panes = [...geos].reverse().map((g) => {
    assert(!pget(g, 'Scale Height').keyframes && num(pget(g, 'Scale Height').value) === 200,
      'pane scale != static 200 in ' + name);
    assert(num(pget(g, 'Scale Width').value) === 100, 'Scale Width != 100 in ' + name);
    assert(num(pget(g, 'Rotation').value) === 0 && num(pget(g, 'Skew').value) === 0,
      'pane rotation/skew != 0 in ' + name);
    assert(num(pget(g, 'Shutter Angle').value) === 0, 'pane shutter != 0 in ' + name);
    assert(num(pget(g, 'Opacity').value) === 100, 'pane opacity != 100 in ' + name);
    const a = xy(pget(g, 'Anchor Point').value);
    assert(near(a[0], 0.5) && near(a[1], 0.5), 'pane anchor not center in ' + name);
    assert(g.masks && g.masks.length === 1, 'pane mask count != 1 in ' + name);
    const mask = quad(g.masks[0], name);
    const posP = pget(g, 'Position');
    assert(posP.keyframes && posP.keyframes.length >= 2, 'pane Position not keyframed in ' + name);
    const curve = posP.keyframes.map((k) => {
      const [x, y] = xy(k.v);
      return { t: r4(c.start + k.t - ip), dx: r4(x - 0.5), dy: r4(y - 0.5), ...handles(k) };
    });
    // motion must be PARALLEL to the split edge (the DOM-compositing model
    // depends on panes never sampling each other's output)
    const inner = mask.filter(([x, y]) =>
      [[0, 0], [1, 0], [0, 1], [1, 1]].every(([cx, cy]) => Math.hypot(x - cx, y - cy) > 0.1));
    assert(inner.length === 2, `split edge not found (${inner.length} interior verts) in ` + name);
    const ex = inner[1][0] - inner[0][0], ey = inner[1][1] - inner[0][1];
    const eL = Math.hypot(ex, ey);
    for (let i = 1; i < curve.length; i++) {
      const dx = curve[i].dx - curve[i - 1].dx, dy = curve[i].dy - curve[i - 1].dy;
      // bound the ABSOLUTE off-axis component (frame fractions) -- that is what
      // would make panes sample each other's output. Hand-authored curves run
      // up to ~7px perpendicular at peak (Ease Diagonal pane 2): the DOM model
      // then differs from Premiere's chain only in a <=7px band at the split
      // edge, at peak motion, between two near-identical shifted copies --
      // sub-perceptual (QA'd vs previews). Anything bigger is a decode error.
      const off = Math.abs(ex * dy - ey * dx) / eL;
      assert(off < 0.012, `pane motion not parallel to split (off-axis ${off.toFixed(4)} frame) in ` + name);
    }
    return { mask, curve };
  });
  return panes;
}

// ---------------- families B/C: masked wrap-Offset stages ----------------
function offsetStagesPhase(c, name, allowFlips) {
  rate1(c, name);
  alphaOk(c.effects, name);
  const ip = c.inPoint || 0;
  const stages = [];
  let fH = false, fV = false, nFlips = 0;
  // walk in APPLY order (reversed list), resolving flip parity analytically
  for (const e of [...c.effects].reverse()) {
    if (e.matchName === 'PR.ADBE Horizontal Flip' || e.matchName === 'PR.ADBE Vertical Flip') {
      assert(allowFlips, 'unexpected flip in ' + name);
      assert(!e.masks || e.masks.length === 0, 'masked flip in slide family in ' + name);
      if (e.matchName === 'PR.ADBE Horizontal Flip') fH = !fH; else fV = !fV;
      nFlips++;
      continue;
    }
    if (e.matchName === 'AE.ADBE Alpha Adjust') continue;
    assert(e.matchName === 'AE.ADBE Offset', 'unexpected effect ' + e.matchName + ' in ' + name);
    const sc = pget(e, 'Shift Center To');
    assert(num(pget(e, 'Blend With Original').value) === 0, 'Blend With Original != 0 in ' + name);
    assert(sc.keyframes && sc.keyframes.length >= 2, 'Offset not keyframed in ' + name);
    const sgnX = fH ? -1 : 1, sgnY = fV ? -1 : 1;
    const curve = sc.keyframes.map((k) => {
      const [x, y] = xy(k.v);
      return { t: r4(c.start + k.t - ip), dx: r4(sgnX * (x - 0.5)), dy: r4(sgnY * (y - 0.5)), ...handles(k) };
    });
    // single-axis per stage (wrapped)
    const wrap = (v) => ((v % 1) + 1.5) % 1 - 0.5;
    const movesX = curve.some((k) => Math.abs(wrap(k.dx) - wrap(curve[0].dx)) > 1e-3);
    const movesY = curve.some((k) => Math.abs(wrap(k.dy) - wrap(curve[0].dy)) > 1e-3);
    assert(!(movesX && movesY), 'stage moves both axes in ' + name);
    let mask = null;
    if (e.masks && e.masks.length) {
      assert(e.masks.length === 1, 'offset mask count > 1 in ' + name);
      mask = quad(e.masks[0], name);
      if (fH) mask = flipQuadH(mask);
      if (fV) mask = flipQuadV(mask);
    }
    stages.push({ mask, curve, axis: movesY ? 'y' : 'x' });
  }
  assert(!fH && !fV, 'unbalanced flip sandwich in ' + name);
  return { stages, nFlips };
}

// ---------------- family D: perspective ----------------
function perspectiveDecode(seq, dur, cutT) {
  const name = seq.name;
  const adj = seq.clips.filter((c) => !c.mediaPath);
  assert(adj.length === 7, `${adj.length} adjustment clips (want 7) in ` + name);
  const isH = / Horizontal /.test(name);
  const flipMatch = isH ? 'PR.ADBE Horizontal Flip' : 'PR.ADBE Vertical Flip';
  const flips = adj.filter((c) => c.effects.some((e) => e.matchName === flipMatch));
  assert(flips.length === 4, `${flips.length} flip clips (want 4) in ` + name);
  // two tracks x two windows, sandwiching track 2; all four resolve the same:
  // [unmasked flip + half-masked flip] = net flip of the COMPLEMENT half
  let flippedHalf = null;
  let winLo = Infinity, winHi = -Infinity;
  for (const c of flips) {
    alphaOk(c.effects, name);
    const fl = c.effects.filter((e) => e.matchName === flipMatch);
    assert(fl.length === 2, 'flip clip does not carry exactly 2 flips in ' + name);
    const masked = fl.filter((e) => e.masks && e.masks.length === 1);
    assert(masked.length === 1, 'flip clip mask layout off in ' + name);
    const q = quad(masked[0].masks[0], name);
    const xs = q.map((v) => v[0]), ys = q.map((v) => v[1]);
    // the masked (flip-back) half; the NET flipped half is its complement
    const half = isH
      ? (Math.min(...ys) > 0.4 ? 'top' : 'bottom')      // mask bottom -> net top
      : (Math.min(...xs) > 0.4 ? 'left' : 'right');     // mask right  -> net left
    if (flippedHalf == null) flippedHalf = half;
    assert(flippedHalf === half, 'flip halves disagree across sandwich in ' + name);
    winLo = Math.min(winLo, c.start); winHi = Math.max(winHi, c.end);
  }
  const t2 = adj.filter((c) => !flips.includes(c));
  assert(t2.length === 3, 'track-2 clip count off in ' + name);
  const [zoomC, panC, outC] = t2.sort((a, b) => a.start - b.start);
  assert(/\(in\)/i.test(zoomC.subClipName || ''), 'first t2 clip is not (In) in ' + name);
  assert(/\(out\)/i.test(outC.subClipName || ''), 'last t2 clip is not (Out) in ' + name);
  assert(near(outC.start, cutT), '(Out) does not start at the cut in ' + name);
  rate1(zoomC, name); rate1(panC, name); rate1(outC, name);

  // zoom phase: plain Geometry2, anchor == position == an edge midpoint pin
  const zg = zoomC.effects.find((e) => e.matchName === 'AE.ADBE Geometry2');
  assert(zg && zoomC.effects.length === 1, 'zoom clip layout off in ' + name);
  const za = xy(pget(zg, 'Anchor Point').value), zp = xy(pget(zg, 'Position').value);
  assert(near(za[0], zp[0]) && near(za[1], zp[1]), 'zoom anchor != position in ' + name);
  const zs = pget(zg, 'Scale Height');
  assert(zs.keyframes && num(zs.keyframes[0].v) === 100 &&
    num(zs.keyframes[zs.keyframes.length - 1].v) === 300, 'zoom scale not 100->300 in ' + name);
  assert(num(pget(zg, 'Shutter Angle').value) === 180, 'zoom shutter != 180 in ' + name);
  const zip = zoomC.inPoint || 0;
  const zoom = {
    win: [r4(zoomC.start), r4(zoomC.end)],
    fx: r4(za[0]), fy: r4(za[1]),
    kfs: zs.keyframes.map((k) => ({ t: r4(zoomC.start + k.t - zip), v: num(k.v), ...handles(k) })),
  };

  // pan phase: Corner Pin + Geometry2(pos kf, scale 200) + Replicate 2 + Offset 0:0, NO mirrors
  const pg = panC.effects.find((e) => e.matchName === 'AE.ADBE Geometry2');
  const rep = panC.effects.find((e) => e.matchName === 'PR.ADBE Replicate');
  const off = panC.effects.find((e) => e.matchName === 'AE.ADBE Offset');
  assert(pg && rep && off, 'pan clip layout off in ' + name);
  assert(!panC.effects.some((e) => e.matchName === 'AE.ADBE Mirror'), 'unexpected Mirror in pan clip in ' + name);
  assert(num(pget(rep, 'Count').value) === 2, 'pan Replicate != 2 in ' + name);
  const ov = xy(pget(off, 'Shift Center To').value);
  assert(near(ov[0], 0) && near(ov[1], 0), 'pan rig Offset not 0:0 in ' + name);
  assert(!pget(pg, 'Scale Height').keyframes && num(pget(pg, 'Scale Height').value) === 200,
    'pan scale != static 200 in ' + name);
  const panShutter = num(pget(pg, 'Shutter Angle').value);
  const pip = panC.inPoint || 0;
  const posP = pget(pg, 'Position');
  assert(posP.keyframes, 'pan Position not keyframed in ' + name);
  const pan = {
    win: [r4(panC.start), r4(panC.end)],
    shutter: panShutter,
    kfs: posP.keyframes.map((k) => {
      const [x, y] = xy(k.v);
      return { t: r4(panC.start + k.t - pip), x: r4(x), y: r4(y), ...handles(k) };
    }),
  };
  const panLast = pan.kfs[pan.kfs.length - 1];
  assert(near(panLast.x, 0.5, 5e-3) && near(panLast.y, 0.5, 5e-3), 'pan does not end centered in ' + name);

  // corner pins: pan-clip pin + (Out)-clip pin (window-truncated curves)
  const pinOf = (c) => {
    const cp = c.effects.find((e) => e.matchName === 'AE.ADBE Corner Pin');
    assert(cp, 'no Corner Pin in ' + name);
    const cip = c.inPoint || 0;
    const cornerKfs = (pn, dxDef, dyDef) => {
      const p = pget(cp, pn);
      if (!p.keyframes) {
        const [x, y] = xy(p.value);
        assert(near(x, dxDef) && near(y, dyDef), `static pin corner ${pn} not at identity in ` + name);
        return [{ t: r4(c.start), x: r4(x), y: r4(y) }];
      }
      return p.keyframes.map((k) => {
        const [x, y] = xy(k.v);
        return { t: r4(c.start + k.t - cip), x: r4(x), y: r4(y), ...handles(k) };
      });
    };
    return {
      win: [r4(c.start), r4(c.end)],
      ul: cornerKfs('Upper Left', 0, 0), ur: cornerKfs('Upper Right', 1, 0),
      ll: cornerKfs('Lower Left', 0, 1), lr: cornerKfs('Lower Right', 1, 1),
    };
  };
  assert(outC.effects.filter((e) => e.matchName !== 'AE.ADBE Alpha Adjust').length === 1 &&
    outC.effects.some((e) => e.matchName === 'AE.ADBE Corner Pin'), '(Out) clip is not pin-only in ' + name);
  alphaOk(outC.effects, name);
  const pins = [pinOf(panC), pinOf(outC)];
  // keystone continuity across the cut: compare the pan pin's value AT its
  // window end (curves may extend past the window -- the Short truncation
  // pattern; assert-only linear interp is fine at a keyframe boundary)
  const valAt = (kfs, t) => {
    if (t <= kfs[0].t) return kfs[0];
    if (t >= kfs[kfs.length - 1].t) return kfs[kfs.length - 1];
    let i = 0;
    while (i < kfs.length - 2 && t > kfs[i + 1].t) i++;
    const a = kfs[i], b = kfs[i + 1], p = (t - a.t) / (b.t - a.t);
    return { x: a.x + (b.x - a.x) * p, y: a.y + (b.y - a.y) * p };
  };
  for (const corner of ['ul', 'ur', 'll', 'lr']) {
    const a = valAt(pins[0][corner], pins[0].win[1]);
    const b = pins[1][corner][0];
    assert(near(a.x, b.x, 1e-2) && near(a.y, b.y, 1e-2), `pin ${corner} discontinuous at cut in ` + name);
  }
  // (Out) pin's CURVE must settle at identity (the window may truncate it --
  // the engine gates by window and snaps to identity after, which is real)
  const last = { ul: [0, 0], ur: [1, 0], ll: [0, 1], lr: [1, 1] };
  for (const corner of ['ul', 'ur', 'll', 'lr']) {
    const k = pins[1][corner][pins[1][corner].length - 1];
    assert(near(k.x, last[corner][0], 5e-3) && near(k.y, last[corner][1], 5e-3),
      `pin ${corner} does not settle at identity in ` + name);
  }
  return {
    flip: { axis: isH ? 'h' : 'v', half: flippedHalf, win: [r4(winLo), r4(winHi)] },
    zoom, pan, pins,
  };
}

// ---------------- classification + audio ----------------
const SUBGROUPS = [
  // [regex on name, pack preview folder, family]
  [/^Split Ease Short /, 'Easy Short', 'A'],
  [/^Split Ease /, 'Ease', 'A'],
  [/^Split Swinging Short /, 'Swinging Short', 'A'],
  [/^Split Swinging Offset Short /, 'Swinging Offset Short', 'B'],
  [/^Split Swinging Offset /, 'Swinging Offset', 'B'],
  [/^Split Swinging /, 'Swinging', 'A'],
  [/^Split Easy Offset Short /, 'Easy Offset Short', 'B'],
  [/^Split Easy Offset /, 'Easy Offset', 'B'],
  [/^Split Slide Cross Short /, 'Slide Cross Short', 'C'],
  [/^Split Slide Cross /, 'Slide Cross', 'C'],
  [/^Split Slide Short /, 'Slide Short', 'C'],
  [/^Split Slide /, 'Slide', 'C'],
  [/^Split Perspective Short /, 'Perspective Short', 'D'],
  [/^Split Perspective /, 'Perspective', 'D'],
];
const AUDIO = { A: 'Simple_SFX.mp3', B: 'Simple_SFX.mp3', C: 'Skew_Simple_01.mp3', D: 'Whoosh_02.wav' };
const SFX_BASE = { A: 'split-simple', B: 'split-simple', C: 'split-slide', D: 'split-perspective' };
const sfxWindows = {}; // base -> Set of windows (for the ffmpeg cut list)

function buildRow(seq) {
  assert(!seq.error, seq.name + ': ' + seq.error);
  const name = seq.name;
  const sg = SUBGROUPS.find(([re]) => re.test(name));
  assert(sg, 'no subgroup match for ' + name);
  const [, folder, family] = sg;

  const media = seq.clips.find((c) => c.mediaPath);
  assert(media && near(media.start, 0), 'no media/duration clip in ' + name);
  const dur = r4(media.end);

  const inC = seq.clips.find((c) => /\(in\)/i.test(c.subClipName || ''));
  const outC = seq.clips.find((c) => /\(out\)/i.test(c.subClipName || ''));
  assert(inC && outC, 'missing (In)/(Out) in ' + name);
  const cutT = r4(outC.start);
  const cut = r4(cutT / dur);

  // ---- audio (measured; every SPLIT sequence carries exactly one clip)
  assert(seq.audio && seq.audio.length === 1, 'audio clip count != 1 in ' + name);
  const au = seq.audio[0];
  assert(au.masterClipName === AUDIO[family], `audio ${au.masterClipName} != ${AUDIO[family]} in ` + name);
  assert(near(au.inPoint || 0, 0), 'audio ip != 0 in ' + name);
  // some subgroups place the clip at 0.04 (one-frame lead, baked into the lib file)
  assert(near(au.start, 0) || near(au.start, 0.04), `audio start ${au.start} unexpected in ` + name);
  const auLead = r4(au.start);
  const auWin = r4(au.end - au.start);
  const sfxBase = SFX_BASE[family];
  (sfxWindows[sfxBase] = sfxWindows[sfxBase] || new Set()).add(`${AUDIO[family]}|lead${auLead}|win${auWin}`);
  const sfx = `transitions/lib/sfx-${sfxBase}-${Math.round(auWin * 100)}.mp3`;

  let engine, params, fidelity, kindTags;
  if (family === 'A') {
    const panesIn = panesPhase(inC, name + ' (In)');
    const panesOut = panesPhase(outC, name + ' (Out)');
    assert(panesIn.length === 2 && panesOut.length === 2, 'pane count != 2 in ' + name);
    // (In) starts at identity, (Out) ends at identity
    for (const p of panesIn) assert(near(p.curve[0].dx, 0) && near(p.curve[0].dy, 0), '(In) pane not starting at identity in ' + name);
    for (const p of panesOut) {
      const k = p.curve[p.curve.length - 1];
      assert(near(k.dx, 0, 5e-3) && near(k.dy, 0, 5e-3), '(Out) pane not settling at identity in ' + name);
    }
    engine = 'SplitPanes';
    params = { cut, pad: 'mirror', panesIn, panesOut };
    fidelity = 'near-1:1';
    kindTags = ['panes', 'mirror-pad'];
  } else if (family === 'B' || family === 'C') {
    const pin = offsetStagesPhase(inC, name + ' (In)', family === 'C');
    const pout = offsetStagesPhase(outC, name + ' (Out)', family === 'C');
    assert(pin.stages.length === pout.stages.length,
      `stage counts differ In ${pin.stages.length} vs Out ${pout.stages.length} in ` + name);
    if (family === 'B') {
      assert(pin.stages.length === 2, 'family B stage count != 2 in ' + name);
      assert(pin.stages.every((s) => s.mask) && pout.stages.every((s) => s.mask), 'unmasked family-B stage in ' + name);
    }
    // (In) first kfs at identity (integer), (Out) last kfs at identity
    const wrap = (v) => ((v % 1) + 1.5) % 1 - 0.5;
    for (const s of pin.stages) assert(near(wrap(s.curve[0].dx), 0) && near(wrap(s.curve[0].dy), 0), '(In) stage not starting at identity in ' + name);
    for (const s of pout.stages) {
      const k = s.curve[s.curve.length - 1];
      assert(near(wrap(k.dx), 0, 5e-3) && near(wrap(k.dy), 0, 5e-3), '(Out) stage not ending at identity in ' + name);
    }
    const stages = pin.stages.map((si, i) => {
      const so = pout.stages[i];
      const st = { mask: si.mask, curveIn: si.curve, curveOut: so.curve };
      const bothNull = !si.mask && !so.mask;
      if (!bothNull && (!si.mask || !so.mask || !sameQuad(si.mask, so.mask))) st.maskOut = so.mask;
      return st;
    });
    const axes = new Set([...pin.stages, ...pout.stages].map((s) => s.axis));
    engine = 'GlassBeveled';
    params = { cut, axis: axes.size > 1 ? 'xy' : [...axes][0], stages };
    fidelity = 'near-1:1';
    kindTags = family === 'B' ? ['offset-panes', 'wrap'] : ['bands', 'stagger', 'wrap'];
  } else {
    params = { cut, ...perspectiveDecode(seq, dur, cutT) };
    engine = 'SplitPerspective';
    fidelity = 'near-1:1';
    kindTags = ['perspective', 'keystone', 'counter-slide'];
  }

  // ---- naming / meta
  const variant = name.replace(/^Split /, '');
  const id = slug('split-' + variant);
  const isShort = / Short/.test(name);
  const shapeWord =
    /HV/.test(name) ? 'horizontal-then-vertical' :
    /VH/.test(name) ? 'vertical-then-horizontal' :
    /Diagonal Combs/.test(name) ? 'diagonal (crossed at the cut)' :
    /Diagonal/.test(name) ? 'diagonal' :
    /Horizontal/.test(name) ? 'horizontal' :
    /Vertical/.test(name) ? 'vertical' :
    /Layout 1x2/.test(name) ? 'top/bottom' :
    /Layout 2x1/.test(name) ? 'left/right' :
    /Combs/.test(name) ? 'comb' : 'banded';
  const DESC = {
    A: `The frame splits in two along a ${shapeWord} line and the halves shear apart along the split (mirror padding fills the gap); the incoming frame's halves slide back together${/Swinging/.test(name) ? ' with a pendulum overshoot before settling' : ' and settle'}. The split orientation ${/HV|VH|Combs/.test(name) ? 'CHANGES at the cut' : 'holds through the cut'}.`,
    B: `Two ${shapeWord} panes wrap-slide in opposite directions (content tears at the pane edges and wraps around); after the cut the incoming frame's panes counter-slide back to rest${/Swinging/.test(name) ? ' with a pendulum overshoot' : ''}.`,
    C: `Overlapping ${/Cross/.test(name) ? 'counter-sliding ' : ''}strip bands wrap-slide across the frame with staggered timing, compounding where they overlap into a cascading tear; every band completes a full wrap and lands seamlessly.`,
    D: 'The two halves of the frame counter-slide (one half mirrored) through a 3D move: a whip zoom into the frame edge, then a wrap-padded pan under a keystone Corner Pin swing that relaxes flat across the cut.',
  };
  const energy = family === 'D' ? 'high' : isShort ? 'high' : 'medium';
  return {
    id, category: 'SPLIT', variant: folder,
    intensity: (name.match(/- (\d+)$/) || name.match(/(\d+ - \w+)$/) || [, ''])[1] || '',
    label: 'Split · ' + variant.replace(/ - /g, ' · '),
    engine, kind: 'geometric', fidelity,
    durationSeconds: dur,
    params, sfx, used_in: [],
    meta: {
      aspectRatios: ['16:9'],
      resolution: '1920x1080',
      family: 'Split ' + folder,
      engineFile: `remotion/src/transitions/engines/${engine === 'GlassBeveled' ? 'GlassBeveled' : engine}.tsx`,
      description: DESC[family],
      energy,
      durationSeconds: dur,
      hasSound: true,
      fidelity,
      tags: ['split', slug(folder), ...kindTags, ...(isShort ? ['short'] : [])],
      useWhen: `Clean geometric split cut (~${dur}s): ${DESC[family].split(';')[0].toLowerCase()}. ${energy === 'high' ? 'Fast punchy pacing.' : 'Medium pacing, works on most content.'}`,
    },
  };
}

const seqs = clips.filter((s) => !s.error || s.name !== 'Split Percent');
const rows = [];
for (const seq of seqs) {
  if (seq.error && seq.name === 'Split Percent') continue;
  rows.push(buildRow(seq));
}
assert(rows.length === 144, 'expected 144 rows, got ' + rows.length);
const byFam = {};
for (const r of rows) byFam[r.engine] = (byFam[r.engine] || 0) + 1;
console.log('rows by engine:', JSON.stringify(byFam));
assert(byFam.SplitPanes === 64 && byFam.GlassBeveled === 72 && byFam.SplitPerspective === 8, 'family counts off');

const libPath = path.join(__dirname, 'library.json');
const lib = JSON.parse(fs.readFileSync(libPath, 'utf8'));
const before = lib.transitions.length;
lib.transitions = lib.transitions.filter((r) => r.category !== 'SPLIT');
lib.transitions.push(...rows);
fs.writeFileSync(libPath, JSON.stringify(lib, null, 2));
console.log(`built ${rows.length} SPLIT rows; library ${before} -> ${lib.transitions.length}`);
console.log('sfx cut list:');
for (const [base, wins] of Object.entries(sfxWindows)) {
  for (const w of [...wins].sort()) console.log(` sfx-${base}-* <- ${w}`);
}
for (const id of ['split-ease-diagonal-1', 'split-ease-hv-1', 'split-easy-offset-layout-1x2-1',
  'split-slide-1-left', 'split-slide-cross-2-up', 'split-perspective-horizontal-1']) {
  const r = rows.find((x) => x.id === id);
  assert(r, 'spot-check row missing: ' + id);
  const p = r.params;
  console.log(id, JSON.stringify({
    engine: r.engine, dur: r.durationSeconds, cut: p.cut,
    panes: p.panesIn ? p.panesIn.length : undefined,
    stages: p.stages ? p.stages.length : undefined,
    maskOuts: p.stages ? p.stages.filter((s) => s.maskOut !== undefined).length : undefined,
    flip: p.flip, sfx: r.sfx,
  }));
}

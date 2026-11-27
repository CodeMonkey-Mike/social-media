// whiteboard/funnel.tsx: the FUNNEL / SCREENING part of the hand-drawn vocabulary (added 2026-11-23 for the
// plan-to-make-millions beat WB1, "here's the funnel: every new coin at the top, the bots flag the one with unusual
// activity, then it scans everything about it, and what comes out at the bottom is a handful of plays"): a see-through
// funnel in two layers (so things can fall INTO it), a hoop sieve that sits across one of its tiers, a little robot head
// that perches on its rim and lights up, a small plain coin that can be moved every frame (and washed out to an OPAQUE
// ghost), the contact shadow of a coin standing on a mesh, the flag a bot plants on a coin (and lowers when the coin is
// turned away), a shallow tray in two layers (so coins sit IN it), and a typewriter that holds its line's layout.
//
// Kit conventions (video-creation/whiteboard/whiteboard.md): every component takes the pen and a LOCAL time `t`
// (seconds since its cue; <= 0 = not yet) and draws itself on part by part over `dur` through Sketch progress; fixed
// seeds (no boil, identical across render workers); role colors from the pen's palette (gold = money, blue = machines,
// grey = metal / background, brown = wood); draw order = what hides what. Geometry was studied from references before
// drawing (a kitchen funnel seen from slightly above: an elliptical mouth, a straight cone, a short stem narrower than
// the neck with a convex lower end, the Lucide `funnel` icon, ISC, for the proportions of cone to stem; the sales-funnel
// diagram: the cone cut into tiers by ellipses parallel to the mouth; a drum sieve / tamis: a shallow hoop with a woven
// mesh, drawn as a cross-hatch because a true square mesh at this tilt flattens into near-horizontal hatching; the Lucide
// `bot` icon, ISC: a rounded head, two eyes, side stubs for ears, an antenna with a bulb; a golf-green pin flag for the
// flag on a coin: a thin pole, a small triangular pennant at its top), then iterated on the beat's stills.
import React, { useMemo } from 'react';
import type { Pen } from './pen';
import { Sketch, prog, easeOut, pop } from './Sketch';
import { Shadow } from './vocab';
import { rrect } from './crypto';

/** stage helper: progress of stage a..b (fractions of `dur`) at local time `t` */
const stager = (t: number, dur: number) => (a: number, b: number) => prog(t, a * dur, (b - a) * dur);
const F = (v: number) => Math.round(v * 100) / 100;
/** a small seeded generator (0..1), the kit's LCG */
const lcg = (seed: number) => { let r = (seed * 9301 + 49297) % 233280; return () => { r = (r * 9301 + 49297) % 233280; return r / 233280; }; };

/**
 * An elliptical arc as cubic Beziers, centre (cx, cy), radii rx / ry, from angle `a0` to `a1` (radians, screen sense:
 * 0 = right, PI/2 = bottom, PI = left, 3PI/2 = top). `move` = start with an M. PI -> 0 is the FRONT half (through the
 * bottom), PI -> 2PI the BACK half (through the top).
 */
export const ellArcD = (cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, move = true) => {
  const n = Math.max(1, Math.ceil(Math.abs(a1 - a0) / (Math.PI / 2) - 1e-9));
  let d = '';
  for (let i = 0; i < n; i++) {
    const s = a0 + ((a1 - a0) * i) / n, e = a0 + ((a1 - a0) * (i + 1)) / n, k = (4 / 3) * Math.tan((e - s) / 4);
    const p0 = [cx + rx * Math.cos(s), cy + ry * Math.sin(s)], p3 = [cx + rx * Math.cos(e), cy + ry * Math.sin(e)];
    const p1 = [p0[0] - k * rx * Math.sin(s), p0[1] + k * ry * Math.cos(s)], p2 = [p3[0] + k * rx * Math.sin(e), p3[1] - k * ry * Math.cos(e)];
    if (i === 0 && move) d += `M ${F(p0[0])} ${F(p0[1])}`;
    d += ` C ${F(p1[0])} ${F(p1[1])}, ${F(p2[0])} ${F(p2[1])}, ${F(p3[0])} ${F(p3[1])}`;
  }
  return d;
};

/**
 * The same arc with the HAND's drift built in: `pieces` short cubics whose joints ride a seeded bounded walk of
 * +-`drift` px along the radius (a long smooth curve through rough.js comes out compass-clean, the long-stroke lesson
 * of whiteboard.md); both ends stay on the true ellipse so the arc still meets what it joins.
 */
export const wobbleArcD = (cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, seed: number, pieces = 6, drift = 2.5) => {
  const rnd = lcg(seed), off: number[] = [0];
  for (let i = 1; i < pieces; i++) off.push(Math.max(-drift, Math.min(drift, off[i - 1] + (rnd() * 2 - 1) * drift * 0.9)));
  off.push(0);
  let d = '';
  for (let i = 0; i < pieces; i++) {
    const s = a0 + ((a1 - a0) * i) / pieces, e = a0 + ((a1 - a0) * (i + 1)) / pieces, k = (4 / 3) * Math.tan((e - s) / 4);
    const f0 = 1 + off[i] / rx, f1 = 1 + off[i + 1] / rx;
    const X = (a: number, f: number) => cx + rx * f * Math.cos(a), Y = (a: number, f: number) => cy + ry * f * Math.sin(a);
    const p0 = [X(s, f0), Y(s, f0)], p3 = [X(e, f1), Y(e, f1)];
    const p1 = [p0[0] - k * rx * f0 * Math.sin(s), p0[1] + k * ry * f0 * Math.cos(s)], p2 = [p3[0] + k * rx * f1 * Math.sin(e), p3[1] - k * ry * f1 * Math.cos(e)];
    if (i === 0) d += `M ${F(p0[0])} ${F(p0[1])}`;
    d += ` C ${F(p1[0])} ${F(p1[1])}, ${F(p2[0])} ${F(p2[1])}, ${F(p3[0])} ${F(p3[1])}`;
  }
  return d;
};

/**
 * A LONG straight stroke from (ax, ay) to (bx, by) as a run of short pieces (about `seg` px) whose joints ride a seeded
 * bounded walk of +-`drift` px across the line (rough.js draws a line past ~200 px ruler-straight, whiteboard.md); both
 * ends are exact. Draw it with `Sketch sequential` so it reveals as one pen stroke.
 */
export const wobbleD = (ax: number, ay: number, bx: number, by: number, seed: number, seg = 90, drift = 3) => {
  const rnd = lcg(seed), len = Math.hypot(bx - ax, by - ay), n = Math.max(2, Math.round(len / seg));
  const nx = -(by - ay) / len, ny = (bx - ax) / len;
  let o = 0, d = `M ${F(ax)} ${F(ay)}`;
  for (let i = 1; i <= n; i++) {
    o = i === n ? 0 : Math.max(-drift, Math.min(drift, o + (rnd() * 2 - 1) * drift * 0.9));
    const u = i / n;
    d += ` L ${F(ax + (bx - ax) * u + nx * o)} ${F(ay + (by - ay) * u + ny * o)}`;
  }
  return d;
};

/**
 * Geometry of a Funnel: the mouth is an ellipse centred (cx, top) with radii rx / ry, the cone runs straight down to
 * the neck (half-width `neckHW` at `neckY`), the stem tapers on to `spoutHW` at `spoutY`. `hw(y)` = the inside
 * half-width at a height, `ryAt(y)` = the vertical radius of the ellipse that crosses the funnel there (same tilt as
 * the mouth), `backY(x)` / `frontY(x)` = the mouth's far and near rim at an x (where something perches on the rim).
 */
export const funnelGeom = (cx: number, top: number, rx = 330, ry = 44, neckY = top + 500, neckHW = 44, spoutY = neckY + 80, spoutHW = 36) => {
  const hw = (y: number) => (y <= neckY
    ? rx - ((Math.max(y, top) - top) / (neckY - top)) * (rx - neckHW)
    : neckHW - ((Math.min(y, spoutY) - neckY) / (spoutY - neckY)) * (neckHW - spoutHW));
  const ryAt = (y: number) => (ry * hw(y)) / rx;
  const rim = (x: number) => ry * Math.sqrt(Math.max(0, 1 - ((x - cx) / rx) ** 2));
  return { cx, top, rx, ry, neckY, neckHW, spoutY, spoutHW, hw, ryAt, backY: (x: number) => top - rim(x), frontY: (x: number) => top + rim(x) };
};
export type FunnelGeom = ReturnType<typeof funnelGeom>;

/**
 * A see-through funnel, drawn in TWO layers so the scene can put things inside it: `part="back"` = the faint body tint,
 * the darker mouth opening and the far half of the rim; `part="front"` = the near half of the rim, the two walls, the
 * tier lines (the near half of an ellipse at every y of `tiers`, thin), the neck line, the stem and its convex lower
 * end. Paint the back, then whatever is inside or falling in, then the front. Draws on mouth -> walls -> tiers -> stem
 * over `dur`, each long stroke as one pen stroke. `tierOpacity[i]` fades a tier line (the scene hides it once a Sieve
 * sits on it, so the two strokes never double).
 */
export const Funnel: React.FC<{ g: FunnelGeom; part: 'back' | 'front'; t: number; pen: Pen; seed: number; dur?: number; tiers?: number[]; tierOpacity?: number[]; tint?: string; tintOpacity?: number }> =
  ({ g, part, t, pen, seed, dur = 1.4, tiers = [], tierOpacity, tint, tintOpacity = 0.2 }) => {
    if (t <= 0) return null;
    const s = seed * 10, P = stager(t, dur), sw = pen.inkWidth + 1;
    const { cx, top, rx, ry, neckY, neckHW, spoutY, spoutHW } = g, L = cx - rx, R = cx + rx, PI = Math.PI;
    if (part === 'back') {
      const body = `M ${L} ${top} ${ellArcD(cx, top, rx, ry, PI, 2 * PI, false)} L ${cx + neckHW} ${neckY} L ${cx + spoutHW} ${spoutY} ` +
        `${ellArcD(cx, spoutY, spoutHW, g.ryAt(spoutY), 0, PI, false)} L ${cx - neckHW} ${neckY} Z`;
      const fade = easeOut(P(0.3, 1)), c = tint ?? pen.palette.grey;
      return (
        <g>
          {pen.fillStyle !== 'none' && fade > 0 && <path d={body} fill={c} stroke="none" opacity={tintOpacity * fade} />}
          {pen.fillStyle !== 'none' && fade > 0 && <ellipse cx={cx} cy={top} rx={rx} ry={ry} fill={c} opacity={tintOpacity * 0.9 * fade} />}
          {/* the far half of every tier line, fainter: with the near half (the front layer) each tier is a whole disc, so
              what rests on a tier stands ON it (round 1: a pile above a lone near arc floated 25 px over the line) */}
          {tiers.map((y, i) => {
            const o = tierOpacity?.[i] ?? 1;
            if (o <= 0) return null;
            return <Sketch key={i} pen={pen} seed={s + 20 + i} shape={{ kind: 'path', d: wobbleArcD(cx, y, g.hw(y), g.ryAt(y), PI, 2 * PI, seed * 7 + 20 + i, 4, 1.5) }} strokeWidth={1.6} roughness={0.6} opacity={0.42 * o} progress={P(0.5 + i * 0.08, 0.66 + i * 0.08)} sequential />;
          })}
          <Sketch pen={pen} seed={s + 1} shape={{ kind: 'path', d: wobbleArcD(cx, top, rx, ry, PI, 2 * PI, seed * 7 + 1) }} strokeWidth={sw} roughness={0.8} progress={easeOut(P(0, 0.22))} sequential />
        </g>
      );
    }
    return (
      <g>
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'path', d: wobbleArcD(cx, top, rx, ry, PI, 0, seed * 7 + 2) }} strokeWidth={sw} roughness={0.8} progress={easeOut(P(0.1, 0.32))} sequential />
        <Sketch pen={pen} seed={s + 3} shape={{ kind: 'path', d: wobbleD(L, top, cx - neckHW, neckY, seed * 7 + 3) }} strokeWidth={sw} roughness={0.8} progress={P(0.28, 0.62)} sequential />
        <Sketch pen={pen} seed={s + 4} shape={{ kind: 'path', d: wobbleD(R, top, cx + neckHW, neckY, seed * 7 + 4) }} strokeWidth={sw} roughness={0.8} progress={P(0.34, 0.68)} sequential />
        {tiers.map((y, i) => {
          const o = tierOpacity?.[i] ?? 1;
          if (o <= 0) return null;
          return <Sketch key={i} pen={pen} seed={s + 10 + i} shape={{ kind: 'path', d: wobbleArcD(cx, y, g.hw(y), g.ryAt(y), PI, 0, seed * 7 + 10 + i, 4, 1.5) }} strokeWidth={1.8} roughness={0.6} opacity={0.6 * o} progress={P(0.5 + i * 0.08, 0.66 + i * 0.08)} sequential />;
        })}
        <Sketch pen={pen} seed={s + 5} shape={{ kind: 'path', d: ellArcD(cx, neckY, neckHW, g.ryAt(neckY), PI, 0) }} strokeWidth={1.8} roughness={0.5} opacity={0.7} progress={P(0.72, 0.84)} />
        <Sketch pen={pen} seed={s + 6} shape={{ kind: 'line', x1: cx - neckHW, y1: neckY, x2: cx - spoutHW, y2: spoutY }} strokeWidth={sw} roughness={0.7} progress={P(0.78, 0.94)} />
        <Sketch pen={pen} seed={s + 7} shape={{ kind: 'line', x1: cx + neckHW, y1: neckY, x2: cx + spoutHW, y2: spoutY }} strokeWidth={sw} roughness={0.7} progress={P(0.8, 0.96)} />
        <Sketch pen={pen} seed={s + 8} shape={{ kind: 'path', d: ellArcD(cx, spoutY, spoutHW, g.ryAt(spoutY) + 2, PI, 0) }} strokeWidth={sw} roughness={0.5} progress={P(0.9, 1)} />
      </g>
    );
  };

/**
 * A hoop sieve lying across a funnel tier: an ellipse centred (cx, y) with radii rx / ry (pass the funnel's `hw(y)` and
 * `ryAt(y)`), a pale mesh surface, a cross-hatch MESH (two families of thin strokes at +-52 degrees, `pitch` px apart,
 * clipped to the ellipse and wiped in left to right), and a shallow hoop band (`hoop` px) under its near edge so it reads
 * as a drum sieve, not a hatched oval. The rim's two halves draw from the left together, the mesh follows. Things that
 * rest on it are painted after it.
 */
export const Sieve: React.FC<{ cx: number; y: number; rx: number; ry: number; t: number; pen: Pen; seed: number; dur?: number; pitch?: number; hoop?: number }> =
  ({ cx, y, rx, ry, t, pen, seed, dur = 0.55, pitch = 15, hoop = 7 }) => {
    const mesh = useMemo(() => {
      const rnd = lcg(seed * 13 + 7), th = (52 * Math.PI) / 180, sn = Math.sin(th), cs = Math.cos(th), M = rx * sn + ry * cs + pitch;
      let d = '';
      for (const dir of [1, -1]) {
        for (let c = -M; c <= M; c += pitch) {
          // a line at distance c from the centre, direction (cs, dir * sn), cut to the ellipse's height (+2 px, the clip trims it)
          const s0 = (-(ry + 2) - c * cs) / (dir * sn), s1 = ((ry + 2) - c * cs) / (dir * sn);
          const j = () => (rnd() * 2 - 1) * 1.1;
          const x0 = cx - c * dir * sn + s0 * cs + j(), y0 = y + c * cs + s0 * dir * sn, x1 = cx - c * dir * sn + s1 * cs + j(), y1 = y + c * cs + s1 * dir * sn;
          d += `M ${F(x0)} ${F(y0)} L ${F(x1)} ${F(y1)} `;
        }
      }
      return d;
    }, [cx, y, rx, ry, seed, pitch]);
    if (t <= 0) return null;
    const s = seed * 10, P = stager(t, dur), id = `sieve-${seed}`, PI = Math.PI;
    const rimP = easeOut(P(0, 0.5)), meshP = easeOut(P(0.2, 1)), surf = easeOut(P(0.1, 0.7));
    const band = `${ellArcD(cx, y, rx, ry, PI, 0)} L ${cx + rx} ${y + hoop} ${ellArcD(cx, y + hoop, rx, ry, 0, PI, false)} Z`;
    return (
      <g>
        <defs>
          <clipPath id={`${id}-ell`}><ellipse cx={cx} cy={y} rx={rx - 1.5} ry={ry - 1} /></clipPath>
          <clipPath id={`${id}-wipe`}><rect x={cx - rx - 4} y={y - ry - 6} width={(2 * rx + 8) * meshP} height={2 * ry + hoop + 12} /></clipPath>
          <clipPath id={`${id}-rim`}><rect x={cx - rx - 6} y={y - ry - 6} width={(2 * rx + 12) * rimP} height={2 * ry + hoop + 14} /></clipPath>
        </defs>
        {pen.fillStyle !== 'none' && surf > 0 && <ellipse cx={cx} cy={y} rx={rx} ry={ry} fill={pen.light} opacity={0.8 * surf} />}
        <g clipPath={`url(#${id}-rim)`}>
          {pen.fillStyle !== 'none' && <path d={band} fill={pen.palette.grey} stroke="none" />}
          <path d={ellArcD(cx, y + hoop, rx, ry, PI, 0)} fill="none" stroke={pen.ink} strokeWidth={pen.inkWidth - 0.4} strokeLinecap="round" />
        </g>
        <g clipPath={`url(#${id}-ell)`}>
          <path d={mesh} fill="none" stroke={pen.ink} strokeWidth={1.25} strokeLinecap="round" opacity={0.62} clipPath={`url(#${id}-wipe)`} />
        </g>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'path', d: wobbleArcD(cx, y, rx, ry, PI, 2 * PI, seed * 11 + 1, 4, 1.5) }} strokeWidth={pen.inkWidth + 0.2} roughness={0.6} progress={rimP} sequential />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'path', d: wobbleArcD(cx, y, rx, ry, PI, 0, seed * 11 + 2, 4, 1.5) }} strokeWidth={pen.inkWidth + 0.2} roughness={0.6} progress={rimP} sequential />
      </g>
    );
  };

/**
 * A little robot HEAD perched on something at (cx, baseY) (the foot of its neck): a short grey neck, a rounded head in
 * the machines' blue, two side stubs for ears, an antenna with a bulb, two round eyes with pupils that look along `look`
 * (px offset; default down-left), a speaker-grille mouth. Draws on over `dur`. `lit` 0..1 LIGHTS IT UP: the bulb and the
 * eyes fill with the pen's gold, a soft halo sits behind the bulb and three ink ticks ray out of it. `k` scales it.
 */
export const BotHead: React.FC<{ cx: number; baseY: number; t: number; lit?: number; pen: Pen; seed: number; dur?: number; k?: number; look?: [number, number]; color?: string }> =
  ({ cx, baseY, t, lit = 0, pen, seed, dur = 0.35, k = 1, look = [-2.2, 2.2], color }) => {
    if (t <= 0) return null;
    const s = seed * 10, P = stager(t, dur), c = color ?? pen.palette.blue, gold = pen.palette.gold, on = Math.max(0, Math.min(1, lit));
    const eyes: [number, number][] = [[-12, -37], [12, -37]];
    return (
      <g transform={`translate(${cx} ${baseY}) scale(${k})`}>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'rect', x: -8, y: -11, w: 16, h: 12 }} fill={pen.palette.grey} roughness={0.5} progress={P(0, 0.25)} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'rect', x: -36, y: -42, w: 9, h: 16 }} fill={pen.palette.grey} roughness={0.5} progress={P(0.35, 0.55)} />
        <Sketch pen={pen} seed={s + 3} shape={{ kind: 'rect', x: 27, y: -42, w: 9, h: 16 }} fill={pen.palette.grey} roughness={0.5} progress={P(0.4, 0.6)} />
        <Sketch pen={pen} seed={s + 4} shape={{ kind: 'path', d: rrect(-29, -56, 58, 46, 11) }} fill={c} roughness={0.7} progress={easeOut(P(0, 0.55))} />
        <Sketch pen={pen} seed={s + 5} shape={{ kind: 'line', x1: 0, y1: -56, x2: 0, y2: -69 }} roughness={0.4} progress={P(0.5, 0.68)} />
        {on > 0 && pen.fillStyle !== 'none' && <circle cx={0} cy={-74} r={13} fill={gold} opacity={0.45 * on} />}
        <Sketch pen={pen} seed={s + 6} shape={{ kind: 'circle', cx: 0, cy: -74, r: 5.5 }} fill={pen.light} roughness={0.35} progress={P(0.62, 0.82)} />
        {on > 0 && <circle cx={0} cy={-74} r={4.3} fill={gold} opacity={on} />}
        {eyes.map(([ex, ey], i) => (
          <g key={i}>
            <Sketch pen={pen} seed={s + 7 + i} shape={{ kind: 'circle', cx: ex, cy: ey, r: 7.5 }} fill={pen.light} roughness={0.35} progress={P(0.58 + i * 0.05, 0.8 + i * 0.05)} />
            {on > 0 && <circle cx={ex} cy={ey} r={6.2} fill={gold} opacity={on} />}
            {P(0.8, 0.92) > 0 && <circle cx={ex + look[0]} cy={ey + look[1]} r={2.8} fill={pen.dark} opacity={P(0.8, 0.92)} />}
          </g>
        ))}
        <Sketch pen={pen} seed={s + 9} shape={{ kind: 'rect', x: -10, y: -25, w: 20, h: 8 }} fill={pen.light} roughness={0.35} strokeWidth={pen.inkWidth - 0.6} progress={P(0.84, 1)} />
        {P(0.92, 1) > 0 && [-3.3, 3.3].map((x, i) => <line key={i} x1={x} y1={-24} x2={x} y2={-18} stroke={pen.ink} strokeWidth={1.3} opacity={P(0.92, 1)} />)}
        {on > 0 && [-150, -90, -30].map((deg, i) => {
          const a = (deg * Math.PI) / 180, r0 = 10, r1 = 10 + 8 * easeOut(on);
          return <line key={i} x1={r0 * Math.cos(a)} y1={-74 + r0 * Math.sin(a)} x2={r1 * Math.cos(a)} y2={-74 + r1 * Math.sin(a)} stroke={pen.ink} strokeWidth={2} strokeLinecap="round" opacity={on} />;
        })}
      </g>
    );
  };

/**
 * A SMALL plain coin centred (x, y), radius `r` (made for r 14 to 24, where TokenCoin's bold rim and 0.78 r ring merge
 * into one thick band): a gold disc, an ink rim, a thin concentric ring at 0.6 r and a short shine stroke. No mark, no
 * symbol (a beat that may not air a ticker or a currency sign still needs coins). Drawn about its own origin and
 * translated, so a scene can move it every frame without the outline boiling. `k` scales it (a pop).
 * `ghost` 0..1 WASHES IT OUT (to `ghostTo` of its ink and colour) and the coin STAYS OPAQUE: a paper-coloured disc sits
 * under the washed-out coin, so a ghost still hides what it rests on. `opacity` makes the whole coin see-through, which is
 * right for a coin fading out of the scene and WRONG for a ghost resting on something drawn (plan-to-make-millions WB1,
 * visual-qa 2026-11-24: ghosts at opacity 0.26 on a sieve let its mesh and rim show through, and the sieve read as
 * painted over the coins although it was painted under them).
 */
export const SmallCoin: React.FC<{ x: number; y: number; r?: number; pen: Pen; seed: number; opacity?: number; ghost?: number; ghostTo?: number; k?: number; color?: string }> =
  ({ x, y, r = 18, pen, seed, opacity = 1, ghost = 0, ghostTo = 0.26, k = 1, color }) => {
    if (opacity <= 0 || k <= 0) return null;
    const s = seed * 10, c = color ?? pen.palette.gold, g = Math.max(0, Math.min(1, ghost));
    return (
      <g transform={`translate(${F(x)} ${F(y)}) scale(${k})`} opacity={opacity}>
        {g > 0 && <circle cx={0} cy={0} r={r + pen.inkWidth / 2} fill={pen.bg} />}
        <g opacity={1 - g * (1 - ghostTo)}>
          {pen.fillStyle !== 'none' && <circle cx={0} cy={0} r={r} fill={c} stroke={pen.ink} strokeWidth={1.2} />}
          <Sketch pen={pen} seed={s + 1} shape={{ kind: 'circle', cx: 0, cy: 0, r }} fill={c} strokeWidth={pen.inkWidth} roughness={0.35} />
          <Sketch pen={pen} seed={s + 2} shape={{ kind: 'circle', cx: 0, cy: 0, r: r * 0.6 }} strokeWidth={1.3} roughness={0.25} />
          <path d={`M ${F(-r * 0.36)} ${F(-r * 0.02)} Q ${F(-r * 0.34)} ${F(-r * 0.3)} ${F(-r * 0.06)} ${F(-r * 0.36)}`} fill="none" stroke={pen.light} strokeWidth={2} strokeLinecap="round" opacity={0.9} />
        </g>
      </g>
    );
  };

/**
 * The contact shadow of a small thing standing ON a drawn surface (a coin on a sieve's mesh): a flat dark ellipse at its
 * foot (x, footY), `rx` wide. Paint it after the surface and before the thing: the smudge under the foot is what says
 * "resting on it", where a bare circle over a mesh can read as caught in it. `a` 0..1 fades it (in on the landing).
 */
export const RestShadow: React.FC<{ x: number; footY: number; rx?: number; ry?: number; a?: number; pen: Pen }> =
  ({ x, footY, rx = 14, ry = 3.6, a = 1, pen }) => {
    if (a <= 0 || pen.fillStyle === 'none') return null;
    return <ellipse cx={F(x)} cy={F(footY + 1)} rx={rx} ry={ry} fill="#000000" opacity={0.2 * Math.min(1, a)} />;
  };

/**
 * The flag a bot plants on a coin centred (x, y) of radius `r`: a thin pole standing on the coin's top, a small
 * triangular pennant at its head flying right (`color`, default the machines' blue: it is the bot's mark). Pops up
 * from the pole's foot over 0.25 s from `t`. Translated like SmallCoin, so it rides a moving coin. Paint the flags of a
 * pile AFTER all its coins.
 * `down` 0..1 LOWERS it: the flying pennant gives way to a limp grey one hanging along the pole, pole and outline in a
 * soft pencil grey (`downInk`). That is the tell of a coin that was flagged and then turned away: it keeps a flag, so it
 * never reads as one of the coins nobody flagged. The lowered flag is opaque and sits inside the flying one's footprint.
 */
export const CoinFlag: React.FC<{ x: number; y: number; r?: number; t: number; pen: Pen; seed: number; color?: string; h?: number; opacity?: number; down?: number; downInk?: string }> =
  ({ x, y, r = 18, t, pen, seed, color, h = 26, opacity = 1, down = 0, downInk = '#8a8a8a' }) => {
    if (t <= 0 || opacity <= 0) return null;
    const s = seed * 10, k = pop(prog(t, 0, 0.25)), bx = 2, by = -r + 3, dn = Math.max(0, Math.min(1, down));
    return (
      <g transform={`translate(${F(x)} ${F(y)})`} opacity={opacity}>
        <g transform={`translate(${bx} ${by}) scale(${k}) translate(${-bx} ${-by})`}>
          {dn > 0 && (
            <g opacity={Math.min(1, dn * 2.5)}>
              <Sketch pen={pen} seed={s + 3} shape={{ kind: 'line', x1: bx, y1: by, x2: bx, y2: by - h }} stroke={downInk} strokeWidth={pen.inkWidth} roughness={0.3} />
              <Sketch pen={pen} seed={s + 4} shape={{ kind: 'polygon', pts: [[bx, by - h], [bx + 7.5, by - h + 3.5], [bx + 6, by - h + 19], [bx, by - h + 15]] }} fill={pen.palette.grey} stroke={downInk} strokeWidth={pen.inkWidth - 0.4} roughness={0.3} />
            </g>
          )}
          {dn < 1 && (
            <g opacity={1 - dn}>
              <Sketch pen={pen} seed={s + 1} shape={{ kind: 'line', x1: bx, y1: by, x2: bx, y2: by - h }} strokeWidth={pen.inkWidth} roughness={0.3} />
              <Sketch pen={pen} seed={s + 2} shape={{ kind: 'polygon', pts: [[bx, by - h], [bx + 20, by - h + 7.5], [bx, by - h + 15]] }} fill={color ?? pen.palette.blue} roughness={0.35} />
            </g>
          )}
        </g>
      </g>
    );
  };

/**
 * A shallow RECTANGULAR tray seen from slightly above, its near rim at `rimY`, centred on cx, `w` wide, the near wall
 * `depth` tall, in TWO layers so things sit IN it: `part="back"` = the floor shadow and the inside (a trapezoid: the far
 * rim `back` px up and `inset` px narrower each side, darker than the wall); `part="front"` = the near wall (filled, so
 * it hides the feet of whatever was painted between the two). Wood by default (`color`). Straight rims and square
 * corners on purpose: round 1's dish (an elliptical rim on a curved hull, in brown) read as a canoe.
 */
export const Tray: React.FC<{ cx: number; rimY: number; w?: number; depth?: number; back?: number; inset?: number; part: 'back' | 'front'; t: number; pen: Pen; seed: number; dur?: number; color?: string }> =
  ({ cx, rimY, w = 250, depth = 26, back = 22, inset = 20, part, t, pen, seed, dur = 0.45, color }) => {
    if (t <= 0) return null;
    const s = seed * 10, P = stager(t, dur), c = color ?? pen.palette.brown, hw = w / 2, by = rimY + depth;
    if (part === 'back') {
      const fade = easeOut(P(0.1, 0.7));
      const inside: [number, number][] = [[cx - hw, rimY], [cx - hw + inset, rimY - back], [cx + hw - inset, rimY - back], [cx + hw, rimY]];
      return (
        <g>
          <Shadow cx={cx} cy={by + 5} rx={hw * 1.04} ry={8} t={t - dur * 0.6} dark={pen.bg !== '#ffffff' && pen.floor === null} />
          {pen.fillStyle !== 'none' && fade > 0 && <polygon points={inside.map((p) => p.join(',')).join(' ')} fill={c} opacity={fade} />}
          {pen.fillStyle !== 'none' && fade > 0 && <polygon points={inside.map((p) => p.join(',')).join(' ')} fill="#000000" opacity={0.2 * fade} />}
          <Sketch pen={pen} seed={s + 1} shape={{ kind: 'path', d: `M ${inside[0][0]} ${inside[0][1]} L ${inside[1][0]} ${inside[1][1]} L ${inside[2][0]} ${inside[2][1]} L ${inside[3][0]} ${inside[3][1]}` }} roughness={0.7} progress={easeOut(P(0, 0.55))} sequential />
        </g>
      );
    }
    const wall = `M ${cx - hw} ${rimY} L ${cx + hw} ${rimY} L ${cx + hw - 7} ${by - 7} Q ${cx + hw - 8} ${by} ${cx + hw - 17} ${by} L ${cx - hw + 17} ${by} Q ${cx - hw + 8} ${by} ${cx - hw + 7} ${by - 7} Z`;
    return <Sketch pen={pen} seed={s + 2} shape={{ kind: 'path', d: wall }} fill={c} roughness={0.7} progress={easeOut(P(0.2, 1))} fillIn={easeOut(P(0.1, 0.7))} sequential />;
  };

/**
 * A typewriter that HOLDS ITS LINE'S LAYOUT: the whole string is laid out from the first frame, the letters not typed
 * yet are transparent. So a centred or right-anchored line never shifts while it types and needs no per-font glyph-width
 * estimate (vocab's `Type` centres on `charW`, which is off by 10 to 20 percent on caps). `parts` types the line in
 * word-timed pieces: each `{ from, at, cps }` starts typing at character index `from` at local time `at` (seconds since
 * `t` = 0), so a label can land word by word on the words as they are spoken.
 */
export const TypeHold: React.FC<{
  x: number; y: number; text: string; t: number; cps?: number; size: number; font: string; color: string;
  anchor?: 'start' | 'middle' | 'end'; weight?: string | number; spacing?: number; parts?: { from: number; at: number; cps?: number }[];
}> = ({ x, y, text, t, cps = 24, size, font, color, anchor = 'start', weight = 'normal', spacing = 0, parts }) => {
  if (t <= 0) return null;
  let n = 0;
  if (parts && parts.length) {
    parts.forEach((p, i) => {
      const end = i + 1 < parts.length ? parts[i + 1].from : text.length;
      if (t > p.at) n = Math.max(n, Math.min(end, p.from + Math.floor((t - p.at) * (p.cps ?? cps)) + 1));
    });
  } else n = Math.min(text.length, Math.floor(t * cps) + 1);
  return (
    <text x={x} y={y} fontFamily={`'${font}', cursive`} fontSize={size} fill={color} fontWeight={weight} textAnchor={anchor}
      letterSpacing={spacing ? spacing * size : undefined} xmlSpace="preserve" style={{ whiteSpace: 'pre' }}>
      <tspan>{text.slice(0, n)}</tspan>
      {n < text.length && <tspan fillOpacity={0}>{text.slice(n)}</tspan>}
    </text>
  );
};

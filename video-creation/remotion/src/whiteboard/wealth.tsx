// whiteboard/wealth.tsx: the OWN-THE-ASSETS part of the hand-drawn vocabulary (added 2026-11-02 for the left-behind beat
// WB5, "two lines moving in opposite directions, and the bridge across"): a gear (the machine), a coin with a drawn mark
// (a B with the two Bitcoin bars, or a generic hexagon token), a small office tower (the companies), a plank footbridge
// laid between two points (a ramp), a WALKING figure (stride phase + a reach toward a target), a highlighter swash, and
// two helpers for chart curves (a cubic bezier point + an x -> point lookup).
//
// Kit conventions (video-creation/whiteboard/whiteboard.md): every component takes the pen and a LOCAL time `t`
// (seconds since its cue; <= 0 = not yet) and draws itself on part by part over `dur` through Sketch progress; fixed
// seeds (no boil, identical across render workers); role colors from the pen's palette (gold = money, blue = machines,
// green = good, red = risk, brown = wood); draw order = what hides what. Geometry was modelled on icon-set references
// before drawing, then iterated on stills: a cog (Lucide `cog` / `settings`: 8 square-topped teeth on a ring, a hub
// circle, a hole in the middle); a mid-rise office (Lucide `building-2`: a tall block, a grid of square windows, a door
// at the foot, a flat roof with a parapet); a footbridge in side view (a deck of planks whose seams show as short
// cross-ticks, posts at the ends and the middle, a rope handrail sagging between the posts); the Bitcoin mark (a B with
// two short bars through its top and bottom); the figure is vocab.tsx `Person` (same head, cap hair, tapered shirt) with
// legs and arms that swing about the hip and shoulder.
import React from 'react';
import type { Pen } from './pen';
import { Sketch, prog, easeOut, pop } from './Sketch';

/** stage helper: progress of stage a..b (fractions of `dur`) at local time `t` */
const stager = (t: number, dur: number) => (a: number, b: number) => prog(t, a * dur, (b - a) * dur);

export type Pt = [number, number];
export type Cubic = [Pt, Pt, Pt, Pt];

/** point on a cubic bezier at u */
export const cubicPt = (c: Cubic, u: number): Pt => {
  const v = Math.max(0, Math.min(1, u)), a = (1 - v) ** 3, b = 3 * (1 - v) ** 2 * v, d = 3 * (1 - v) * v * v, e = v ** 3;
  return [a * c[0][0] + b * c[1][0] + d * c[2][0] + e * c[3][0], a * c[0][1] + b * c[1][1] + d * c[2][1] + e * c[3][1]];
};
/** the u at which a left-to-right cubic reaches x (bisection) */
export const cubicU = (c: Cubic, x: number) => {
  let lo = 0, hi = 1;
  for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (cubicPt(c, m)[0] < x) lo = m; else hi = m; }
  return (lo + hi) / 2;
};
/** the curve's y at x */
export const cubicY = (c: Cubic, x: number) => cubicPt(c, cubicU(c, x))[1];
export const cubicD = (c: Cubic) => `M ${c[0][0]} ${c[0][1]} C ${c[1][0]} ${c[1][1]}, ${c[2][0]} ${c[2][1]}, ${c[3][0]} ${c[3][1]}`;

/**
 * A gear (cog) centred on (cx, cy): `teeth` square-topped teeth on a ring of radius r (tooth tips at r * 1.28), a hub
 * circle, a hole. Blue by default (a machine). Draws on outline -> hub -> hole; `spin` turns it (degrees).
 */
export const Gear: React.FC<{ cx: number; cy: number; r?: number; teeth?: number; spin?: number; t: number; pen: Pen; seed: number; color?: string; dur?: number }> =
  ({ cx, cy, r = 40, teeth = 8, spin = 0, t, pen, seed, color, dur = 0.55 }) => {
    if (t <= 0) return null;
    const s = seed * 10, P = stager(t, dur), R = r * 1.3;
    const pts: Pt[] = [];
    const step = (Math.PI * 2) / teeth;
    for (let i = 0; i < teeth; i++) {
      const a = i * step - Math.PI / 2;
      // root -> tooth flank up -> tip -> flank down (tooth spans ~45 % of the step, slightly narrower at the tip)
      const r0 = a - step * 0.26, r1 = a - step * 0.17, r2 = a + step * 0.17, r3 = a + step * 0.26;
      pts.push([cx + r * Math.cos(r0), cy + r * Math.sin(r0)]);
      pts.push([cx + R * Math.cos(r1), cy + R * Math.sin(r1)]);
      pts.push([cx + R * Math.cos(r2), cy + R * Math.sin(r2)]);
      pts.push([cx + r * Math.cos(r3), cy + r * Math.sin(r3)]);
    }
    return (
      <g transform={`rotate(${spin} ${cx} ${cy})`}>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'polygon', pts }} fill={color ?? pen.palette.blue} roughness={0.7} progress={easeOut(P(0, 0.7))} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'circle', cx, cy, r: r * 0.5 }} roughness={0.5} progress={P(0.55, 0.85)} />
        <Sketch pen={pen} seed={s + 3} shape={{ kind: 'circle', cx, cy, r: r * 0.2 }} fill={pen.light} roughness={0.4} progress={P(0.8, 1)} />
      </g>
    );
  };

/**
 * A coin centred on (cx, cy) with an inner rim and a DRAWN mark (never a font glyph that may be missing): 'btc' = a bold
 * B in the label font with the two short Bitcoin bars through its top and bottom; 'hex' = a generic token (a hexagon
 * with a dot), no ticker. Pops in over 0.35 s; `drop` (px) lets it land from above.
 */
export const MarkCoin: React.FC<{ cx: number; cy: number; r?: number; mark: 'btc' | 'hex'; t: number; pen: Pen; seed: number; font: string; color?: string; drop?: number }> =
  ({ cx, cy, r = 40, mark, t, pen, seed, font, color, drop = 0 }) => {
    if (t <= 0) return null;
    const s = seed * 10, k = pop(prog(t, 0, 0.35)), dy = -drop * (1 - easeOut(prog(t, 0, 0.3)));
    const markP = prog(t, 0.2, 0.25);
    return (
      <g transform={`translate(0 ${dy}) translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})`}>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'circle', cx, cy, r }} fill={color ?? pen.palette.gold} roughness={0.55} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'circle', cx, cy, r: r * 0.78 }} strokeWidth={pen.inkWidth * 0.7} roughness={0.5} />
        {mark === 'btc' ? (
          <g opacity={markP}>
            <text x={cx + r * 0.02} y={cy + r * 0.36} fontFamily={`'${font}', cursive`} fontWeight={700} fontSize={r * 1.05} fill={pen.ink} textAnchor="middle">B</text>
            {[-0.1, 0.12].map((ox, i) => (
              <g key={i}>
                <line x1={cx + ox * r} y1={cy - r * 0.6} x2={cx + ox * r} y2={cy - r * 0.43} stroke={pen.ink} strokeWidth={pen.inkWidth + 0.6} strokeLinecap="round" />
                <line x1={cx + ox * r} y1={cy + r * 0.42} x2={cx + ox * r} y2={cy + r * 0.59} stroke={pen.ink} strokeWidth={pen.inkWidth + 0.6} strokeLinecap="round" />
              </g>
            ))}
          </g>
        ) : (
          <>
            <Sketch pen={pen} seed={s + 3} roughness={0.5} progress={markP}
              shape={{ kind: 'polygon', pts: Array.from({ length: 6 }, (_, i) => { const a = (Math.PI / 3) * i - Math.PI / 2; return [cx + r * 0.42 * Math.cos(a), cy + r * 0.42 * Math.sin(a)] as Pt; }) }} />
            {markP > 0 && <circle cx={cx} cy={cy} r={r * 0.11} fill={pen.ink} opacity={markP} />}
          </>
        )}
      </g>
    );
  };

/**
 * A small office tower standing on (x, gy) (x = centre of the base): a block w x h, a parapet band on the roof, a grid
 * of cols x rows square windows, a door at the foot. Cream body (a building), grey windows. Draws on body -> parapet ->
 * windows (staggered, row by row) -> door. `drop` (px) lets it land from above.
 */
export const OfficeTower: React.FC<{ x: number; gy: number; w?: number; h?: number; cols?: number; rows?: number; t: number; pen: Pen; seed: number; dur?: number; drop?: number; color?: string; ground?: (x: number) => number }> =
  ({ x, gy, w = 96, h = 150, cols = 3, rows = 4, t, pen, seed, dur = 0.8, drop = 0, color, ground }) => {
    if (t <= 0) return null;
    const s = seed * 10, P = stager(t, dur), x0 = x - w / 2, y0 = gy - h;
    const dy = -drop * (1 - easeOut(prog(t, 0, 0.3)));
    const pad = w * 0.14, gap = w * 0.09, ww = (w - 2 * pad - (cols - 1) * gap) / cols, top = y0 + 22, doorH = h * 0.2;
    const wh = Math.min(ww, (h - 22 - doorH - 18 - (rows - 1) * gap) / rows);
    // `ground` (x -> y of a sloped ground line): the base sits level at gy (pass the HIGHEST ground point under it) and
    // a wedge of earth fills down to the ground, so the ground line never passes through the building (visual-qa WB5)
    const foot: Pt[] | null = ground ? (() => {
      const pts: Pt[] = [[x0 - 4, gy], [x0 + w + 4, gy]];
      for (let i = 8; i >= 0; i--) { const fx = x0 - 4 + ((w + 8) * i) / 8; pts.push([fx, Math.max(gy, ground(fx))]); }
      return pts;
    })() : null;
    return (
      <g transform={`translate(0 ${dy})`}>
        {foot && <Sketch pen={pen} seed={s + 4} shape={{ kind: 'polygon', pts: foot }} fill={pen.palette.brown} roughness={0.5} progress={easeOut(P(0, 0.3))} />}
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'rect', x: x0, y: y0, w, h }} fill={color ?? '#f4e6c8'} progress={easeOut(P(0, 0.4))} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'rect', x: x0 - 5, y: y0 - 10, w: w + 10, h: 12 }} fill={pen.palette.grey} roughness={0.6} progress={P(0.3, 0.45)} />
        {Array.from({ length: rows * cols }).map((_, i) => {
          const r = Math.floor(i / cols), c = i % cols, a = 0.42 + i * (0.4 / (rows * cols));
          return <Sketch key={i} pen={pen} seed={s + 10 + i} shape={{ kind: 'rect', x: x0 + pad + c * (ww + gap), y: top + r * (wh + gap), w: ww, h: wh }}
            fill={pen.palette.blue} strokeWidth={pen.inkWidth * 0.75} roughness={0.5} progress={P(a, a + 0.12)} />;
        })}
        <Sketch pen={pen} seed={s + 3} shape={{ kind: 'path', d: `M ${x - w * 0.13} ${gy} L ${x - w * 0.13} ${gy - doorH} L ${x + w * 0.13} ${gy - doorH} L ${x + w * 0.13} ${gy}` }}
          fill={pen.palette.brown} roughness={0.5} progress={P(0.85, 1)} />
      </g>
    );
  };

/**
 * A plank footbridge laid as a ramp from a (low end) to b (high end), side view: the deck (a brown strip `thick` deep
 * hanging under the a-b line, so a-b is the walking surface), plank seams as short cross-ticks, posts at both ends and
 * the middle, a rope handrail sagging between the post tops. Draws on deck -> seams -> posts -> rail. `rail={false}` = the
 * deck alone (a figure walking IN FRONT of a rail reads as impaled on it, visual-qa WB5 2026-11-02).
 */
export const PlankBridge: React.FC<{ a: Pt; b: Pt; thick?: number; postH?: number; rail?: boolean; t: number; pen: Pen; seed: number; dur?: number; color?: string }> =
  ({ a, b, thick = 16, postH = 74, rail: withRail = true, t, pen, seed, dur = 0.9, color }) => {
    if (t <= 0) return null;
    const s = seed * 10, P = stager(t, dur);
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L;
    // the deck's downward normal (perpendicular, pointing down the page)
    let nx = -uy, ny = ux; if (ny < 0) { nx = -nx; ny = -ny; }
    const deck: Pt[] = [a, b, [b[0] + nx * thick, b[1] + ny * thick], [a[0] + nx * thick, a[1] + ny * thick]];
    const seams = Math.floor(L / 30);
    const posts = [0.04, 0.5, 0.96].map((f) => [a[0] + ux * L * f, a[1] + uy * L * f] as Pt);
    const tops = posts.map((p) => [p[0], p[1] - postH] as Pt);
    const sag = 14;
    const rail = `M ${tops[0][0]} ${tops[0][1]} Q ${(tops[0][0] + tops[1][0]) / 2} ${(tops[0][1] + tops[1][1]) / 2 + sag} ${tops[1][0]} ${tops[1][1]} Q ${(tops[1][0] + tops[2][0]) / 2} ${(tops[1][1] + tops[2][1]) / 2 + sag} ${tops[2][0]} ${tops[2][1]}`;
    return (
      <g>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'polygon', pts: deck }} fill={color ?? pen.palette.brown} roughness={0.8} progress={easeOut(P(0, 0.4))} />
        {Array.from({ length: seams }).map((_, i) => {
          const f = (i + 1) / (seams + 1), px = a[0] + ux * L * f, py = a[1] + uy * L * f, q = 0.3 + (i / seams) * 0.25;
          return <Sketch key={i} pen={pen} seed={s + 10 + i} strokeWidth={pen.inkWidth * 0.7} roughness={0.4} progress={P(q, q + 0.08)}
            shape={{ kind: 'line', x1: px, y1: py, x2: px + nx * thick, y2: py + ny * thick }} />;
        })}
        {withRail && posts.map((p, i) => (
          <Sketch key={i} pen={pen} seed={s + 40 + i} strokeWidth={pen.inkWidth + 1} roughness={0.5} progress={P(0.55 + i * 0.07, 0.72 + i * 0.07)}
            shape={{ kind: 'line', x1: p[0], y1: p[1] + thick * 0.6, x2: p[0], y2: p[1] - postH }} />
        ))}
        {withRail && <Sketch pen={pen} seed={s + 50} roughness={0.6} progress={easeOut(P(0.78, 1))} shape={{ kind: 'path', d: rail }} />}
      </g>
    );
  };

type WalkerProps = {
  x: number; gy: number; t: number; pen: Pen; seed: number; shirt: string; phase?: number; stride?: number; slope?: number;
  reach?: number; hand?: Pt; scale?: number; dur?: number;
};

/** the Walker's joints in its own (unscaled) frame: feet, hip, shoulders, hands, head centre */
export const walkerPose = ({ x, gy, phase = 0, stride = 1, slope = 0, reach = 0, hand, scale = 1 }: Omit<WalkerProps, 't' | 'pen' | 'seed' | 'shirt' | 'dur'>) => {
  const sw = Math.sin(phase) * stride, bob = -4 * Math.abs(Math.sin(phase)) * stride;
  const ty = gy - 215 + bob, by = gy - 112 + bob, hy = ty - 42;
  const legL = 108;
  const foot = (side: number): Pt => {
    const ang = side * 0.5 * sw;
    const fx = x + side * 4 + legL * Math.sin(ang);
    return [fx, gy - 4 + slope * (fx - x)];
  };
  const fL = foot(-1), fR = foot(1);
  const armL: Pt = [x - 36 + 16 * Math.sin(-0.6 * sw), ty + 14 + 82 * Math.cos(0.5 * sw)];
  const swingR: Pt = [x + 37 + 16 * Math.sin(0.6 * sw), ty + 14 + 82 * Math.cos(0.5 * sw)];
  // the hand target in the figure's own (unscaled) frame
  const tgt: Pt = hand ? [x + (hand[0] - x) / scale, gy + (hand[1] - gy) / scale] : swingR;
  const r = easeOut(reach);
  const handR: Pt = [swingR[0] + (tgt[0] - swingR[0]) * r, swingR[1] + (tgt[1] - swingR[1]) * r];
  const shoulderR: Pt = [x + 29, ty + 14];
  // a slight elbow so the reaching arm reads as an arm, not a stick
  const elbow: Pt = [(shoulderR[0] + handR[0]) / 2 + 6 * r, (shoulderR[1] + handR[1]) / 2 + 14 * r];
  return { ty, by, hy, fL, fR, armL, handR, shoulderR, elbow };
};

/**
 * A WALKING figure (vocab.tsx Person's head, cap hair, tapered shirt; facing right) with feet on (x, gy). `phase`
 * (radians) swings the legs about the hip and the arms about the shoulders in opposition, with a small bob; `slope`
 * (dy/dx of the ground under it) puts each foot on the ground at its own x. `reach` 0..1 blends the right arm from its
 * swing to a hand ON `hand` (absolute coordinates). `scale` scales about the feet. Draws on over `dur` like Person.
 * Walking IN FRONT of a line: mask the line with `WalkerKnockout` (same props) so it passes behind him.
 */
export const Walker: React.FC<WalkerProps> = (props) => {
  const { x, gy, t, pen, seed, shirt, slope = 0, scale = 1, dur = 1.0 } = props;
  if (t <= 0) return null;
  const s = seed * 10, P = stager(t, dur);
  const { ty, by, hy, fL, fR, armL, handR, shoulderR, elbow } = walkerPose(props);
  const ink = pen.ink;
  return (
    <g transform={`translate(${x} ${gy}) scale(${scale}) translate(${-x} ${-gy})`}>
      {/* far leg + far arm first (they sit behind the body) */}
      <Sketch pen={pen} seed={s + 13} progress={P(0.66, 0.84)} shape={{ kind: 'line', x1: x - 6, y1: by, x2: fL[0], y2: fL[1] }} />
      <Sketch pen={pen} seed={s + 15} progress={P(0.84, 0.92)} shape={{ kind: 'line', x1: fL[0] - 6, y1: fL[1], x2: fL[0] + 14, y2: fL[1] + slope * 20 }} />
      <Sketch pen={pen} seed={s + 9} progress={P(0.55, 0.72)} shape={{ kind: 'line', x1: x - 29, y1: ty + 14, x2: armL[0], y2: armL[1] }} />
      <Sketch pen={pen} seed={s + 10} fill={pen.light} roughness={0.5} progress={P(0.7, 0.78)} shape={{ kind: 'circle', cx: armL[0], cy: armL[1] + 5, r: 6 }} />
      {/* head + cap hair + face (eyes to the right) */}
      <Sketch pen={pen} seed={s + 1} shape={{ kind: 'circle', cx: x, cy: hy, r: 34 }} fill={pen.light} progress={P(0, 0.22)} />
      <Sketch pen={pen} seed={s + 2} fill={pen.dark} progress={P(0.18, 0.38)}
        shape={{ kind: 'path', d: `M ${x - 34} ${hy - 4} C ${x - 32} ${hy - 44}, ${x + 32} ${hy - 44}, ${x + 34} ${hy - 4} C ${x + 22} ${hy - 18}, ${x - 2} ${hy - 24}, ${x - 34} ${hy - 4} Z` }} />
      <Sketch pen={pen} seed={s + 4} fill={pen.dark} roughness={0.3} progress={P(0.86, 0.92)} shape={{ kind: 'circle', cx: x + 8, cy: hy - 4, r: 3.2 }} />
      <Sketch pen={pen} seed={s + 5} fill={pen.dark} roughness={0.3} progress={P(0.88, 0.94)} shape={{ kind: 'circle', cx: x + 22, cy: hy - 4, r: 3.2 }} />
      <Sketch pen={pen} seed={s + 6} progress={P(0.92, 1)} shape={{ kind: 'path', d: `M ${x + 9} ${hy + 12} Q ${x + 16} ${hy + 18} ${x + 23} ${hy + 11}` }} />
      {/* torso */}
      <Sketch pen={pen} seed={s + 7} fill={shirt} progress={P(0.3, 0.62)}
        shape={{ kind: 'path', d: `M ${x - 30} ${ty + 10} C ${x - 32} ${ty + 2}, ${x - 24} ${ty - 2}, ${x - 16} ${ty} L ${x + 16} ${ty} C ${x + 24} ${ty - 2}, ${x + 32} ${ty + 2}, ${x + 30} ${ty + 10} L ${x + 23} ${by} L ${x - 23} ${by} Z` }} />
      {/* near leg */}
      <Sketch pen={pen} seed={s + 14} progress={P(0.7, 0.88)} shape={{ kind: 'line', x1: x + 6, y1: by, x2: fR[0], y2: fR[1] }} />
      <Sketch pen={pen} seed={s + 16} progress={P(0.88, 0.96)} shape={{ kind: 'line', x1: fR[0] - 6, y1: fR[1], x2: fR[0] + 14, y2: fR[1] + slope * 20 }} />
      {/* near (right) arm: swing, or reaching onto the target */}
      <path d={`M ${shoulderR[0]} ${shoulderR[1]} Q ${elbow[0]} ${elbow[1]} ${handR[0]} ${handR[1]}`} fill="none" stroke={ink} strokeWidth={pen.inkWidth}
        strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - P(0.55, 0.72)} />
      {P(0.7, 0.78) > 0 && <Sketch pen={pen} seed={s + 12} fill={pen.light} roughness={0.5} progress={P(0.7, 0.78)} shape={{ kind: 'circle', cx: handR[0], cy: handR[1], r: 6 }} />}
    </g>
  );
};

/**
 * The Walker's silhouette in BLACK, padded by `pad` (its own units), to put inside an SVG <mask> (over a white rect) on
 * a line the figure walks in front of: the line then stops either side of a leg / arm / the body, so it reads as passing
 * BEHIND him, never through him (visual-qa WB5, 2026-11-02). The legs stop `footClear` short of the feet, so a line he
 * STANDS on stays whole under his feet. Same props as the Walker it shadows (`t` gates it the same way).
 */
export const WalkerKnockout: React.FC<WalkerProps & { pad?: number; footClear?: number }> = (props) => {
  const { x, gy, t, scale = 1, pad = 9, footClear = 18 } = props;
  if (t <= 0) return null;
  const { ty, by, hy, fL, fR, armL, handR, shoulderR, elbow } = walkerPose(props);
  const sw = 2 * pad + 3;
  const leg = (hx: number, f: Pt) => {
    const L = Math.hypot(f[0] - hx, f[1] - by), k = Math.max(0, (L - footClear) / L);
    return <line x1={hx} y1={by} x2={hx + (f[0] - hx) * k} y2={by + (f[1] - by) * k} stroke="black" strokeWidth={sw} strokeLinecap="round" />;
  };
  return (
    <g transform={`translate(${x} ${gy}) scale(${scale}) translate(${-x} ${-gy})`}>
      <circle cx={x} cy={hy - 2} r={34 + pad + 2} fill="black" />
      <path d={`M ${x - 32} ${ty - 2} L ${x + 32} ${ty - 2} L ${x + 25} ${by} L ${x - 25} ${by} Z`} fill="black" stroke="black" strokeWidth={2 * pad} strokeLinejoin="round" />
      {leg(x - 6, fL)}
      {leg(x + 6, fR)}
      <line x1={x - 29} y1={ty + 14} x2={armL[0]} y2={armL[1] + 5} stroke="black" strokeWidth={sw} strokeLinecap="round" />
      <path d={`M ${shoulderR[0]} ${shoulderR[1]} Q ${elbow[0]} ${elbow[1]} ${handR[0]} ${handR[1]}`} fill="none" stroke="black" strokeWidth={sw} strokeLinecap="round" />
    </g>
  );
};

/**
 * A highlighter swash behind a label: a flat translucent band (no outline) revealed left to right over `dur`, slightly
 * irregular ends like a marker pass. (x, y) = the band's left end on its centre line, `w` long, `h` tall; rotate with a
 * parent transform for a sloped label.
 */
export const Highlight: React.FC<{ x: number; y: number; w: number; h: number; t: number; color: string; dur?: number; opacity?: number; id: string }> =
  ({ x, y, w, h, t, color, dur = 0.4, opacity = 0.85, id }) => {
    if (t <= 0) return null;
    const p = easeOut(prog(t, 0, dur));
    const d = `M ${x + 6} ${y - h / 2 + 3} L ${x + w - 4} ${y - h / 2} Q ${x + w + 6} ${y} ${x + w - 2} ${y + h / 2 - 2} L ${x + 2} ${y + h / 2 + 2} Q ${x - 8} ${y + 2} ${x + 6} ${y - h / 2 + 3} Z`;
    return (
      <g>
        <defs><clipPath id={id}><rect x={x - 12} y={y - h} width={(w + 24) * p} height={h * 2} /></clipPath></defs>
        <path d={d} fill={color} opacity={opacity} clipPath={`url(#${id})`} />
      </g>
    );
  };

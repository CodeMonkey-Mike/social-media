// whiteboard/office.tsx: the WORKPLACE part of the hand-drawn vocabulary (added 2026-11-02 for the left-behind beat
// WB1, "how it plays out inside a company"): an office building cross-section with an open door, a toolbox (the AI
// tools) with a glow, a pair of scissors, a line that gets cut (the budget), a short dashed arrow and a hand-drawn
// ring (the highlight circle, one or two passes).
//
// Kit conventions (video-creation/whiteboard/whiteboard.md): every component takes the pen and a LOCAL time `t`
// (seconds since its cue; <= 0 = not yet) and draws itself on part by part over `dur` through Sketch progress; fixed
// seeds (no boil, identical across render workers); role colors from the pen's palette (gold = money, red = risk,
// blue = machines, green = good, grey = background); draw order = what hides what. Geometry was studied from
// references before drawing (a classic metal toolbox: body, lid band, arched handle, a latch at the seam; the Lucide
// `scissors` icon, ISC: two finger rings behind a pivot screw, two tapered blades crossing at it, the cutting edges
// straight on the inside; an office cross-section: flat roof, a row of windows, the door opening in the wall with
// the leaf swung outward), then iterated on stills.
import React from 'react';
import type { Pen } from './pen';
import { Sketch, prog, easeOut, pop } from './Sketch';

/** stage helper: progress of stage a..b (fractions of `dur`) at local time `t` */
const stager = (t: number, dur: number) => (a: number, b: number) => prog(t, a * dur, (b - a) * dur);

/**
 * An office building as a cross-section: left wall, flat roof, right wall, floor, drawn as ONE outline that leaves the
 * door opening in the left wall (the floor line runs to the wall, the wall starts above the opening); a row of
 * `windows` along the top band; the door leaf swung outward (to the left) with a knob. (x, y) = top-left, the floor
 * is y + h (what stands inside uses gy = y + h). Draws on outline -> windows (staggered) -> door leaf -> knob.
 */
export const Building: React.FC<{
  x: number; y: number; w: number; h: number; doorH?: number; windows?: number; t: number; pen: Pen; seed: number; dur?: number;
}> = ({ x, y, w, h, doorH = 200, windows = 6, t, pen, seed, dur = 1.3 }) => {
  if (t <= 0) return null;
  const s = seed * 10, P = stager(t, dur), fy = y + h;
  const outline = `M ${x} ${fy - doorH} L ${x} ${y} L ${x + w} ${y} L ${x + w} ${fy} L ${x} ${fy}`;
  const ww = 70, wh = 50, wy = y + 40, span = w - 200 - ww, step = windows > 1 ? span / (windows - 1) : 0;
  const leaf: [number, number][] = [[x, fy - doorH], [x - 82, fy - doorH - 28], [x - 82, fy - 28], [x, fy]];
  return (
    <g>
      <Sketch pen={pen} seed={s + 1} shape={{ kind: 'path', d: outline }} progress={easeOut(P(0, 0.62))} />
      {Array.from({ length: windows }).map((_, i) => {
        const wx = x + 100 + i * step, a = 0.42 + i * 0.06;
        return (
          <g key={i}>
            <Sketch pen={pen} seed={s + 10 + i} shape={{ kind: 'rect', x: wx, y: wy, w: ww, h: wh }} fill={pen.palette.grey} roughness={0.8} progress={P(a, a + 0.18)} />
            <Sketch pen={pen} seed={s + 30 + i} shape={{ kind: 'line', x1: wx + ww / 2, y1: wy, x2: wx + ww / 2, y2: wy + wh }} strokeWidth={pen.inkWidth * 0.7} roughness={0.5} progress={P(a + 0.12, a + 0.24)} />
          </g>
        );
      })}
      <Sketch pen={pen} seed={s + 2} shape={{ kind: 'polygon', pts: leaf }} fill={pen.palette.brown} progress={P(0.78, 0.96)} />
      <Sketch pen={pen} seed={s + 3} shape={{ kind: 'circle', cx: x - 68, cy: fy - doorH / 2, r: 5 }} fill={pen.dark} roughness={0.4} progress={P(0.94, 1)} />
    </g>
  );
};

/**
 * A toolbox: body, the lid band (seam a third down, the lid 6 px wider than the body on each side), an arched handle on
 * top, a latch at the seam, a label on the lower face. (x, y) = the body's top-left; `w` x `h` = the body. Blue by
 * default (a machine). `glow` 0..1 fades in a soft gold halo behind it and pops 8 short gold rays around it.
 */
export const Toolbox: React.FC<{
  x: number; y: number; w?: number; h?: number; t: number; pen: Pen; seed: number; color?: string; label?: string; font?: string;
  labelColor?: string; labelSize?: number; glow?: number; dur?: number;
}> = ({ x, y, w = 170, h = 155, t, pen, seed, color, label, font, labelColor, labelSize = 34, glow = 0, dur = 0.6 }) => {
  if (t <= 0) return null;
  const c = color ?? pen.palette.blue, s = seed * 10, P = stager(t, dur);
  const lidH = Math.round(h * 0.3), cx = x + w / 2, cy = y + h / 2;
  const gid = `tb-halo-${seed}`;
  const rays = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
    const a = (i * Math.PI) / 4 + Math.PI / 8;
    const ex = Math.abs(Math.cos(a)) > 1e-6 ? (w / 2 + 22) / Math.abs(Math.cos(a)) : Infinity;
    const ey = Math.abs(Math.sin(a)) > 1e-6 ? (h / 2 + 34) / Math.abs(Math.sin(a)) : Infinity;
    const r0 = Math.min(ex, ey), r1 = r0 + 30 + (i % 2) * 10;
    return { x1: cx + Math.cos(a) * r0, y1: cy + Math.sin(a) * r0, x2: cx + Math.cos(a) * r1, y2: cy + Math.sin(a) * r1 };
  }).filter((r) => r.y2 <= y + h + 8); // no ray below the box's base: it stands on a floor
  return (
    <g>
      {glow > 0 && (
        <>
          <defs>
            <radialGradient id={gid}>
              <stop offset="0%" stopColor={pen.palette.gold} stopOpacity={0.55} />
              <stop offset="100%" stopColor={pen.palette.gold} stopOpacity={0} />
            </radialGradient>
          </defs>
          <circle cx={cx} cy={cy - 10} r={Math.max(w, h) * 1.15} fill={`url(#${gid})`} opacity={easeOut(glow)} />
        </>
      )}
      <Sketch pen={pen} seed={s + 1} shape={{ kind: 'rect', x, y: y + lidH, w, h: h - lidH }} fill={c} progress={P(0, 0.4)} />
      <Sketch pen={pen} seed={s + 2} shape={{ kind: 'rect', x: x - 6, y, w: w + 12, h: lidH }} fill={c} progress={P(0.3, 0.62)} />
      <Sketch pen={pen} seed={s + 3} shape={{ kind: 'path', d: `M ${cx - 40} ${y} C ${cx - 40} ${y - 34}, ${cx + 40} ${y - 34}, ${cx + 40} ${y}` }} strokeWidth={pen.inkWidth + 1.2} progress={P(0.58, 0.8)} />
      <Sketch pen={pen} seed={s + 4} shape={{ kind: 'rect', x: cx - 12, y: y + lidH - 8, w: 24, h: 16 }} fill={pen.palette.gold} roughness={0.5} progress={P(0.78, 0.92)} />
      {label && font && P(0.85, 1) > 0 && (
        <text x={cx} y={y + lidH + (h - lidH) * 0.62} fontFamily={`'${font}', cursive`} fontSize={labelSize} fill={labelColor ?? pen.ink} textAnchor="middle" fontWeight="700" opacity={P(0.85, 1)}>
          {label}
        </text>
      )}
      {glow > 0 && rays.map((r, i) => (
        <Sketch key={i} pen={pen} seed={s + 20 + i} shape={{ kind: 'line', ...r }} stroke={pen.palette.gold} strokeWidth={pen.inkWidth + 1} roughness={0.6} progress={easeOut(prog(glow, 0.1 + i * 0.07, 0.3))} />
      ))}
    </g>
  );
};

/**
 * A pair of scissors, blades pointing DOWN (+y), pivot screw at (x, y). Each half is one rigid piece (blade below
 * the pivot, stem + finger ring above it) rotated about the pivot by +/- `open` degrees, so the blades and the rings
 * spread together like real scissors; `open` ~24 = open, ~4 = closed (the scene animates it). `tilt` leans the
 * whole pair. Pops in over 0.3 s. Blades grey (metal) with the cutting edges straight on the inside.
 */
export const Scissors: React.FC<{ x: number; y: number; len?: number; back?: number; open?: number; tilt?: number; t: number; pen: Pen; seed: number }> =
  ({ x, y, len = 105, back = 48, open = 24, tilt = 0, t, pen, seed }) => {
    if (t <= 0) return null;
    const s = seed * 10, k = pop(prog(t, 0, 0.3));
    const half = (sign: 1 | -1, seedOff: number) => {
      // blade: straight cutting edge on the inside (local x = 0), the outer edge bulging away from the other blade.
      // rotate(+open) swings the blade to -x and the handle to +x (they cross at the pivot), so the handle bends
      // further toward +x (sign * bend): the two rings sit side by side even when the blades are shut, like real
      // scissors (the first still had them collapse onto one spot and the closed pair read as a spike).
      const o = -sign, bend = 20;
      const blade = `M 0 -4 L 0 ${len + 6} Q ${o * 10} ${len * 0.5} ${o * 17} 8 Q ${o * 16} -3 0 -4 Z`;
      const ry = 28, rx = 20, hx = sign * bend;
      const stem = `M 0 0 C 0 ${-back * 0.45}, ${hx * 0.6} ${-back * 0.7}, ${hx} ${-back}`;
      return (
        <g transform={`rotate(${sign * open})`}>
          <Sketch pen={pen} seed={s + seedOff} shape={{ kind: 'path', d: stem }} strokeWidth={pen.inkWidth + 1.5} roughness={0.6} />
          <Sketch pen={pen} seed={s + seedOff + 1} shape={{ kind: 'ellipse', cx: hx + sign * 4, cy: -back - ry + 4, rx, ry }} fill={pen.light} roughness={0.7} />
          <Sketch pen={pen} seed={s + seedOff + 2} shape={{ kind: 'path', d: blade }} fill={pen.palette.grey} roughness={0.6} />
        </g>
      );
    };
    return (
      <g transform={`translate(${x} ${y}) rotate(${tilt}) scale(${k})`}>
        {half(-1, 1)}
        {half(1, 5)}
        <Sketch pen={pen} seed={s + 9} shape={{ kind: 'circle', cx: 0, cy: 0, r: 5 }} fill={pen.dark} roughness={0.3} />
      </g>
    );
  };

/**
 * A horizontal line (the budget) in two segments split at `cutX` with a small gap: it draws on left to right as one
 * stroke; from `cutT` the RIGHT segment swings down about its far end by `drop` degrees and dims (the cut end falls).
 * Two segments from the start, so the cut never swaps one wobble for another. Gold by default (money).
 */
export const CutLine: React.FC<{ x1: number; x2: number; y: number; cutX: number; t: number; cutT?: number; pen: Pen; seed: number; color?: string; drop?: number; dur?: number; strokeWidth?: number }> =
  ({ x1, x2, y, cutX, t, cutT = -1, pen, seed, color, drop = 6, dur = 0.8, strokeWidth }) => {
    if (t <= 0) return null;
    const c = color ?? pen.palette.gold, sw = strokeWidth ?? pen.inkWidth + 2, s = seed * 10;
    const fl = (cutX - x1) / (x2 - x1), P = stager(t, dur);
    const cut = cutT > 0 ? easeOut(prog(cutT, 0, 0.7)) : 0;
    return (
      <g>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'line', x1, y1: y, x2: cutX - 5, y2: y }} stroke={c} strokeWidth={sw} progress={P(0, fl)} />
        {/* negative = clockwise-up on screen is positive in SVG, so the cut end swings DOWN with -drop */}
        <g transform={`rotate(${-drop * cut} ${x2} ${y})`} opacity={1 - 0.45 * cut}>
          <Sketch pen={pen} seed={s + 2} shape={{ kind: 'line', x1: cutX + 5, y1: y, x2, y2: y }} stroke={c} strokeWidth={sw} progress={P(fl, 1)} />
        </g>
      </g>
    );
  };

/** a short dashed arrow (a stub): the dashes reveal from the tail along the direction, then the open head sketches */
export const DashedArrow: React.FC<{ x1: number; y1: number; x2: number; y2: number; t: number; pen: Pen; seed: number; color?: string; dur?: number; head?: number; strokeWidth?: number }> =
  ({ x1, y1, x2, y2, t, pen, seed, color, dur = 0.5, head = 18, strokeWidth }) => {
    if (t <= 0) return null;
    const c = color ?? pen.ink, sw = strokeWidth ?? pen.inkWidth + 1;
    const L = Math.hypot(x2 - x1, y2 - y1), ang = Math.atan2(y2 - y1, x2 - x1), deg = (ang * 180) / Math.PI;
    const p = easeOut(prog(t, 0, dur * 0.75));
    const hd = `M ${x2 - head * Math.cos(ang - 0.5)} ${y2 - head * Math.sin(ang - 0.5)} L ${x2} ${y2} L ${x2 - head * Math.cos(ang + 0.5)} ${y2 - head * Math.sin(ang + 0.5)}`;
    const clipId = `dash-${seed}`;
    return (
      <g>
        <defs>
          <clipPath id={clipId}>
            <rect x={x1 - 6} y={y1 - head - 6} width={(L + 12) * p} height={2 * head + 12} transform={`rotate(${deg} ${x1} ${y1})`} />
          </clipPath>
        </defs>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth={sw} strokeDasharray="10 9" strokeLinecap="round" clipPath={`url(#${clipId})`} />
        <Sketch pen={pen} seed={seed} shape={{ kind: 'path', d: hd }} stroke={c} strokeWidth={sw} progress={easeOut(prog(t, dur * 0.65, dur * 0.35))} />
      </g>
    );
  };

/**
 * A hand-drawn ring around something: an ellipse that draws on over `dur` from `t`; `t2` > 0 adds a SECOND pass
 * (a slightly larger ellipse tilted by `tilt2` degrees, 0.45 s) the way a hand circles twice for emphasis. Thick, red
 * by default. `tilt2` < 0 drops the LEFT side of the second pass, > 0 lifts it: pick the sign that keeps the second
 * stroke off whatever sits nearest the ring (the left-behind bun lesson, 2026-11-02).
 */
export const Ring: React.FC<{ cx: number; cy: number; rx: number; ry: number; t: number; t2?: number; pen: Pen; seed: number; color?: string; dur?: number; strokeWidth?: number; tilt2?: number }> =
  ({ cx, cy, rx, ry, t, t2 = -1, pen, seed, color, dur = 0.9, strokeWidth, tilt2 = -5 }) => {
    if (t <= 0) return null;
    const c = color ?? pen.palette.red, sw = strokeWidth ?? pen.inkWidth + 4;
    return (
      <g>
        <Sketch pen={pen} seed={seed} shape={{ kind: 'ellipse', cx, cy, rx, ry }} stroke={c} strokeWidth={sw} progress={easeOut(prog(t, 0, dur))} />
        {t2 > 0 && (
          <g transform={`rotate(${tilt2} ${cx} ${cy})`}>
            <Sketch pen={pen} seed={seed + 1} shape={{ kind: 'ellipse', cx: cx + 4, cy: cy + 3, rx: rx + 11, ry: ry + 8 }} stroke={c} strokeWidth={sw} progress={easeOut(prog(t2, 0, 0.45))} />
          </g>
        )}
      </g>
    );
  };

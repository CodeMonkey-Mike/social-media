// whiteboard/settlement.tsx: the LOCK / CREDIT / SETTLE part of the hand-drawn vocabulary (added 2026-11-05 for the quant
// beat WB4, Quant's own worked example: a manufacturer in London pays a supplier in Singapore): a padlock that draws on
// open, clicks shut and is released; a short stack of coins (money sitting at a bank); a small factory (the manufacturer);
// a cheque (the supplier is credited; its amount box is an EMPTY squiggle, never an amount); a two-way arrow (two banks
// settle with each other); a dotted curve with an arrowhead revealed along its length (a tie back to something); and a
// dashed boundary around a region drawn as one pen stroke (the banking system the money never leaves).
//
// Kit conventions (video-creation/whiteboard/whiteboard.md): every component takes the pen and a LOCAL time `t`
// (seconds since its cue; <= 0 = not yet) and draws itself on part by part over `dur` through Sketch progress; fixed
// seeds (no boil, identical across render workers); role colors from the pen's palette (gold = money, blue = machines,
// green = good / credited, red = the highlighted thing, grey = background); draw order = what hides what. Geometry was
// studied from references before drawing (the Lucide icon set, ISC: `lock` = a rounded body 18 x 11 under a U shackle 10
// wide whose legs run 4 into the body and whose arc is a half circle, `lock-open` = the same shackle with its right leg
// lifted out and the whole U tilted; `lock-keyhole` = a dot and a slot; `factory` = a chimney block on the left running the
// full height and two sawtooth roof teeth to its right that rise to the right, three small windows along the bottom;
// `coins` = stacked ellipses with side bands; `arrow-left-right` = a shaft with an open chevron at both ends), then
// iterated on the beat's stills.
import React, { useMemo } from 'react';
import rough from 'roughjs';
import type { Pen } from './pen';
import { Sketch, prog, easeOut, pop } from './Sketch';
import { rrect } from './crypto';

/** stage helper: progress of stage a..b (fractions of `dur`) at local time `t` */
const stager = (t: number, dur: number) => (a: number, b: number) => prog(t, a * dur, (b - a) * dur);
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** geometry of a Padlock (shared with the scene so arrows can be aimed at it): the body box, the shackle's top when shut / open */
export const padlockGeom = (cx: number, cy: number, w = 40, h = 30) => {
  const top = cy - h / 2, sw = w * 0.58, legH = 9, r = sw / 2;
  return { left: cx - w / 2, right: cx + w / 2, top, bottom: cy + h / 2, shackleTop: top - legH - r, shackleTopOpen: top - legH - r - 9, sw, legH, r };
};

/**
 * A padlock centred (cx, cy) on its body (`w` x `h`, rounded, machine grey), a keyhole (a dot and a slot), a U shackle
 * (ink, heavy) whose legs run into the body. `open` 0..1 lifts the shackle out: it rises 6 px and tilts 30 degrees about
 * its left leg's foot so the right leg swings clear of the body (the Lucide `lock-open` pose); the scene drives it (draws
 * open, clicks shut, is released). Draws on shackle -> body -> keyhole over `dur` (the body is painted after the shackle
 * so it hides the legs' ends inside it).
 */
export const Padlock: React.FC<{ cx: number; cy: number; w?: number; h?: number; open?: number; t: number; pen: Pen; seed: number; color?: string; dur?: number; lift?: number; tilt?: number }> =
  ({ cx, cy, w = 40, h = 30, open = 0, t, pen, seed, color, dur = 0.5, lift = 6, tilt = 30 }) => {
    // `lift` (px) and `tilt` (degrees) are how far the shackle rises and swings when fully open (opt-in; the defaults are
    // the shipped beats' frames). quant WB4 round 4: a tie arriving from above is measured against the OPEN apex, so a
    // smaller lift buys air without moving the tie's head up into the coastline.
    if (t <= 0) return null;
    const s = seed * 10, P = stager(t, dur), g = padlockGeom(cx, cy, w, h), o = clamp01(open);
    const lx = cx - g.sw / 2, rx = cx + g.sw / 2, legTop = g.top - g.legH;
    const shackle = `M ${lx} ${g.top + 3} L ${lx} ${legTop} A ${g.r} ${g.r} 0 0 1 ${rx} ${legTop} L ${rx} ${g.top + 3}`;
    return (
      <g>
        <g transform={`translate(0 ${-lift * o}) rotate(${-tilt * o} ${lx} ${g.top + 3})`}>
          <Sketch pen={pen} seed={s + 1} shape={{ kind: 'path', d: shackle }} strokeWidth={pen.inkWidth + 2.4} roughness={0.5} progress={easeOut(P(0, 0.5))} sequential />
        </g>
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'path', d: rrect(g.left, g.top, w, h, 5) }} fill={color ?? pen.palette.blue} roughness={0.6} progress={P(0.4, 0.85)} />
        <Sketch pen={pen} seed={s + 3} shape={{ kind: 'circle', cx, cy: cy - 3, r: 3.6 }} fill={pen.ink} roughness={0.3} progress={P(0.82, 0.92)} />
        <Sketch pen={pen} seed={s + 4} shape={{ kind: 'line', x1: cx, y1: cy - 1, x2: cx, y2: cy + 8 }} strokeWidth={pen.inkWidth + 1.2} roughness={0.3} progress={P(0.9, 1)} />
      </g>
    );
  };

/** geometry of a CoinStack: the top face's centre and the stack's top edge, so something can sit on it */
export const coinStackGeom = (cx: number, baseY: number, n = 3, rx = 24, ry = 7, th = 9) => {
  const topCy = baseY - th - ry - th * (n - 1);
  return { topCy, top: topCy - ry, left: cx - rx, right: cx + rx };
};

/**
 * A short stack of `n` coins (gold = money) standing on (cx, baseY): each coin a flat cylinder `rx` wide, `th` thick,
 * its top an ellipse of `ry`; bottom coin first so each hides the one below. Pops in over 0.35 s about its base.
 */
export const CoinStack: React.FC<{ cx: number; baseY: number; n?: number; rx?: number; ry?: number; th?: number; t: number; pen: Pen; seed: number; color?: string }> =
  ({ cx, baseY, n = 3, rx = 24, ry = 7, th = 9, t, pen, seed, color }) => {
    if (t <= 0) return null;
    const s = seed * 10, k = pop(prog(t, 0, 0.35)), c = color ?? pen.palette.gold;
    return (
      <g transform={`translate(${cx} ${baseY}) scale(${k}) translate(${-cx} ${-baseY})`}>
        {Array.from({ length: n }).map((_, i) => {
          const yc = baseY - th - ry - th * i;
          const side = `M ${cx - rx} ${yc} L ${cx - rx} ${yc + th} A ${rx} ${ry} 0 0 0 ${cx + rx} ${yc + th} L ${cx + rx} ${yc} A ${rx} ${ry} 0 0 0 ${cx - rx} ${yc} Z`;
          return (
            <g key={i}>
              <Sketch pen={pen} seed={s + 1 + i * 2} shape={{ kind: 'path', d: side }} fill={c} roughness={0.5} />
              <Sketch pen={pen} seed={s + 2 + i * 2} shape={{ kind: 'ellipse', cx, cy: yc, rx, ry }} fill={c} roughness={0.45} />
            </g>
          );
        })}
      </g>
    );
  };

/**
 * A small factory standing on (x, gy) (x = its left), `w` wide, `w` tall: a chimney block on the left running the full
 * height, a body with two sawtooth roof teeth rising to the right, three small windows along the bottom, two puffs of
 * smoke over the chimney. Machine grey. Draws on silhouette -> windows -> smoke over `dur`.
 */
export const Factory: React.FC<{ x: number; gy: number; w?: number; t: number; pen: Pen; seed: number; dur?: number; smoke?: 0 | 1 | 2 }> =
  ({ x, gy, w = 80, t, pen, seed, dur = 0.6, smoke = 2 }) => {
    if (t <= 0) return null;
    const s = seed * 10, P = stager(t, dur), Pa = pen.palette, u = w / 20;
    // the Lucide `factory` silhouette in 20 x 20 units: chimney x 0..6 from the top, teeth with peaks at (13, 6) and (20, 6), low points at (6, 11) and (13, 11)
    const pt = (px: number, py: number): [number, number] => [x + px * u, gy - (20 - py) * u];
    const sil: [number, number][] = [pt(0, 20), pt(20, 20), pt(20, 6), pt(13, 11), pt(13, 6), pt(6, 11), pt(6, 0), pt(0, 0)];
    const cx = x + 3 * u;
    return (
      <g>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'polygon', pts: sil }} fill={Pa.blue} progress={easeOut(P(0, 0.6))} />
        {[8.5, 12.5, 16.5].map((wx, i) => (
          <Sketch key={i} pen={pen} seed={s + 10 + i} shape={{ kind: 'rect', x: x + wx * u - 1.3 * u, y: gy - 5.4 * u, w: 2.6 * u, h: 2.6 * u }} fill={pen.light} roughness={0.5} strokeWidth={pen.inkWidth * 0.8} progress={P(0.55 + i * 0.08, 0.7 + i * 0.08)} />
        ))}
        {/* `smoke` = how many puffs (a factory at a shore keeps one so the upper puff never straddles the coastline) */}
        {smoke >= 1 && <Sketch pen={pen} seed={s + 20} shape={{ kind: 'circle', cx: cx + 1, cy: gy - 20 * u - 11, r: 7 }} fill={pen.light} roughness={0.6} strokeWidth={pen.inkWidth * 0.8} progress={P(0.78, 0.9)} />}
        {smoke >= 2 && <Sketch pen={pen} seed={s + 21} shape={{ kind: 'circle', cx: cx + 11, cy: gy - 20 * u - 26, r: 9 }} fill={pen.light} roughness={0.6} strokeWidth={pen.inkWidth * 0.8} progress={P(0.86, 1)} />}
      </g>
    );
  };

/**
 * A cheque centred (cx, cy), `w` x `h` (pale green: the supplier is credited): the slip, a thick header bar top-left, the
 * payee line, an amount box at the right with an EMPTY squiggle (never an amount), a signature squiggle bottom-right.
 * Pops in over 0.3 s about its centre, its marks landing right after.
 */
export const PayCheck: React.FC<{ cx: number; cy: number; w?: number; h?: number; t: number; pen: Pen; seed: number; color?: string }> =
  ({ cx, cy, w = 110, h = 54, t, pen, seed, color }) => {
    if (t <= 0) return null;
    const s = seed * 10, k = pop(prog(t, 0, 0.3)), P = stager(t, 0.55);
    const x = cx - w / 2, y = cy - h / 2;
    // the amount box sits high at the right (y + 14, 13 tall) and the signature runs along the bottom edge with a 6 px
    // amplitude, so the two stay ~10 px apart at h 48 (visual-qa 2026-11-05: at y + 20 / an amplitude of 12 the squiggle
    // smeared into the box's bottom edge)
    const bx = x + w - 36, by = y + 14;
    const sig = `M ${x + w - 50} ${y + h - 7} c 5 -7, 9 3, 16 -3 c 5 -5, 9 3, 20 -1`;
    return (
      <g transform={`translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})`}>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'rect', x, y, w, h }} fill={color ?? pen.palette.green} roughness={0.6} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'line', x1: x + 10, y1: y + 11, x2: x + 44, y2: y + 11 }} strokeWidth={pen.inkWidth + 2} roughness={0.4} progress={P(0.5, 0.65)} />
        <Sketch pen={pen} seed={s + 3} shape={{ kind: 'line', x1: x + 10, y1: y + 28, x2: x + w - 44, y2: y + 28 }} strokeWidth={1.5} roughness={0.4} progress={P(0.6, 0.75)} />
        <Sketch pen={pen} seed={s + 4} shape={{ kind: 'rect', x: bx, y: by, w: 28, h: 13 }} fill={pen.light} roughness={0.4} strokeWidth={1.4} progress={P(0.68, 0.82)} />
        <Sketch pen={pen} seed={s + 5} shape={{ kind: 'path', d: `M ${bx + 5} ${by + 7.5} q 4 -6 8 0 t 8 0` }} strokeWidth={1.4} roughness={0.3} opacity={0.7} progress={P(0.8, 0.9)} />
        <Sketch pen={pen} seed={s + 6} shape={{ kind: 'path', d: sig }} strokeWidth={pen.inkWidth * 0.8} roughness={0.5} progress={P(0.84, 1)} />
      </g>
    );
  };

/** a two-way arrow along `y` from x1 to x2 (ink): the shaft draws left to right, then an open chevron at BOTH ends */
export const TwoWayArrow: React.FC<{ x1: number; x2: number; y: number; t: number; pen: Pen; seed: number; color?: string; dur?: number; head?: number; strokeWidth?: number }> =
  ({ x1, x2, y, t, pen, seed, color, dur = 0.6, head = 16, strokeWidth }) => {
    if (t <= 0) return null;
    const s = seed * 10, c = color ?? pen.ink, sw = strokeWidth ?? pen.inkWidth + 2;
    const hl = `M ${x1 + head} ${y - head * 0.62} L ${x1} ${y} L ${x1 + head} ${y + head * 0.62}`;
    const hr = `M ${x2 - head} ${y - head * 0.62} L ${x2} ${y} L ${x2 - head} ${y + head * 0.62}`;
    return (
      <g>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'line', x1, y1: y, x2, y2: y }} stroke={c} strokeWidth={sw} progress={easeOut(prog(t, 0, dur * 0.7))} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'path', d: hr }} stroke={c} strokeWidth={sw} progress={easeOut(prog(t, dur * 0.62, dur * 0.3))} />
        <Sketch pen={pen} seed={s + 3} shape={{ kind: 'path', d: hl }} stroke={c} strokeWidth={sw} progress={easeOut(prog(t, dur * 0.72, dur * 0.28))} />
      </g>
    );
  };

/**
 * A DOTTED curve (quadratic bezier p0 -> p2 bent by p1) revealed along its own length from p0 (a mask stroked with the
 * same path and the pathLength trick), then an open arrowhead sketches at p2 along the tangent. Ink by default. The dots
 * stop `tail` px short of the tip so none sits inside the chevron (the bank.tsx DottedArrow lesson).
 */
export const DottedCurve: React.FC<{ p0: [number, number]; p1: [number, number]; p2: [number, number]; p1b?: [number, number]; t: number; pen: Pen; seed: number; color?: string; dur?: number; head?: number; strokeWidth?: number; tail?: number }> =
  ({ p0, p1, p2, p1b, t, pen, seed, color, dur = 1.0, head = 18, strokeWidth, tail = 14 }) => {
    if (t <= 0) return null;
    const c = color ?? pen.ink, sw = strokeWidth ?? pen.inkWidth + 2.2;
    // `p1b` makes it a CUBIC (p1, p1b = the two control points) so the tie can leave one place and ARRIVE STEEPLY at
    // another (quant WB4: the tie drops vertically onto the padlock); the head follows the end tangent either way
    const cpEnd = p1b ?? p1;
    const ang = Math.atan2(p2[1] - cpEnd[1], p2[0] - cpEnd[0]);
    // shorten the curve by `tail` along the end tangent (the dots stop short of the chevron)
    const e: [number, number] = [p2[0] - tail * Math.cos(ang), p2[1] - tail * Math.sin(ang)];
    const d = p1b ? `M ${p0[0]} ${p0[1]} C ${p1[0]} ${p1[1]} ${p1b[0]} ${p1b[1]} ${e[0]} ${e[1]}` : `M ${p0[0]} ${p0[1]} Q ${p1[0]} ${p1[1]} ${e[0]} ${e[1]}`;
    const p = easeOut(prog(t, 0, dur * 0.8));
    const hd = `M ${p2[0] - head * Math.cos(ang - 0.5)} ${p2[1] - head * Math.sin(ang - 0.5)} L ${p2[0]} ${p2[1]} L ${p2[0] - head * Math.cos(ang + 0.5)} ${p2[1] - head * Math.sin(ang + 0.5)}`;
    const mid = `dcurve-${seed}`;
    return (
      <g>
        <defs>
          <mask id={mid} maskUnits="userSpaceOnUse" x={0} y={0} width={4000} height={4000}>
            <path d={d} fill="none" stroke="#ffffff" strokeWidth={sw * 5} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
          </mask>
        </defs>
        <path d={d} fill="none" stroke={c} strokeWidth={sw} strokeDasharray="0.5 13" strokeLinecap="round" mask={`url(#${mid})`} />
        <Sketch pen={pen} seed={seed} shape={{ kind: 'path', d: hd }} stroke={c} strokeWidth={pen.inkWidth + 1.4} progress={easeOut(prog(t, dur * 0.74, dur * 0.26))} />
      </g>
    );
  };

/**
 * A DASHED boundary: a rounded rectangle (x, y, w, h, corner `r`) drawn through rough.js (so the line wobbles like the
 * rest of the page) with a dash pattern, revealed as ONE pen stroke from its top-left corner clockwise over `dur` (a
 * mask on the ideal path with the pathLength trick, wide enough to cover the wobble). Ink by default.
 */
export const DashedBoundary: React.FC<{ x: number; y: number; w: number; h: number; r?: number; t: number; pen: Pen; seed: number; color?: string; dur?: number; strokeWidth?: number; roughness?: number; dash?: string }> =
  ({ x, y, w, h, r = 60, t, pen, seed, color, dur = 1.3, strokeWidth, roughness = 0.8, dash = '16 12' }) => {
    const ideal = rrect(x, y, w, h, r);
    const roughD = useMemo(() => {
      const gen = rough.generator();
      const ds = gen.path(ideal, { seed, roughness, bowing: pen.bowing, stroke: pen.ink, strokeWidth: 1, disableMultiStroke: true, preserveVertices: true });
      return gen.toPaths(ds).filter((p) => p.stroke !== 'none' && p.stroke !== undefined).map((p) => p.d).join(' ');
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ideal, seed, roughness, pen.id]);
    if (t <= 0) return null;
    const c = color ?? pen.ink, sw = strokeWidth ?? pen.inkWidth + 1.2, p = easeOut(prog(t, 0, dur));
    const mid = `dbound-${seed}`;
    return (
      <g>
        <defs>
          <mask id={mid} maskUnits="userSpaceOnUse" x={0} y={0} width={4000} height={4000}>
            <path d={ideal} fill="none" stroke="#ffffff" strokeWidth={30} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
          </mask>
        </defs>
        <path d={roughD} fill="none" stroke={c} strokeWidth={sw} strokeDasharray={dash} strokeLinecap="round" strokeLinejoin="round" mask={`url(#${mid})`} />
      </g>
    );
  };

/** a four-point sparkle (a "new" mark): a star of four tapered points about (cx, cy), `r` from the centre to a tip */
const sparkleD = (cx: number, cy: number, r: number) => {
  const k = r * 0.22;
  return `M ${cx} ${cy - r} Q ${cx + k} ${cy - k} ${cx + r} ${cy} Q ${cx + k} ${cy + k} ${cx} ${cy + r} Q ${cx - k} ${cy + k} ${cx - r} ${cy} Q ${cx - k} ${cy - k} ${cx} ${cy - r} Z`;
};

/**
 * A NEW coin (a token minted out of nothing): a plain round coin centred (cx, cy), radius `r`, a bold ink rim, a thin
 * concentric inner ring, NO mark on its face (the beat airs no currencies; visual-qa 2026-11-05 on quant WB4 read a small
 * hexagon with a "$" under an X as a dark blob and a currency), and a small sparkle up and to the right of it, off the
 * diagonals, that says "new". Gold (money) by default. Pops in over `dur`, the sparkle right after. An X struck through
 * it afterwards leaves the rim segments showing between its arms, so the coin stays readable.
 */
export const NewCoin: React.FC<{ cx: number; cy: number; r?: number; t: number; pen: Pen; seed: number; color?: string; dur?: number; sparkleAt?: [number, number] }> =
  ({ cx, cy, r = 45, t, pen, seed, color, dur = 0.35, sparkleAt }) => {
    if (t <= 0) return null;
    const s = seed * 10, k = pop(prog(t, 0, dur)), sp = prog(t, dur * 0.8, 0.25);
    // the sparkle's centre, in units of r about the coin's centre (opt-in; the default is the shipped frame). The sparkle's
    // tips reach 0.28 r from its centre, so a centre closer than ~1.33 r puts its lower tip INSIDE the rim (visual-qa on
    // quant WB4: at (0.5, -1.12) the lower tip vanished behind the rim); a beat that strikes the coin with an X places it
    // off the X's arm too (WB4: (0.55, -1.36) = 68 degrees up-right, the lower tip 7 px clear of the rim, 14 px off the arm)
    const [sdx, sdy] = sparkleAt ?? [0.5, -1.12];
    const sx = cx + r * sdx, sy = cy + r * sdy;
    return (
      <g>
        <g transform={`translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})`}>
          <Sketch pen={pen} seed={s + 1} shape={{ kind: 'circle', cx, cy, r }} fill={color ?? pen.palette.gold} strokeWidth={pen.inkWidth + 1.6} roughness={0.4} />
          <Sketch pen={pen} seed={s + 2} shape={{ kind: 'circle', cx, cy, r: r * 0.76 }} strokeWidth={pen.inkWidth * 0.7} roughness={0.25} />
        </g>
        {sp > 0 && (
          <g transform={`translate(${sx} ${sy}) scale(${pop(sp)}) translate(${-sx} ${-sy})`}>
            <Sketch pen={pen} seed={s + 3} shape={{ kind: 'path', d: sparkleD(sx, sy, r * 0.28) }} fill={pen.light} strokeWidth={pen.inkWidth * 0.9} roughness={0.4} />
          </g>
        )}
      </g>
    );
  };

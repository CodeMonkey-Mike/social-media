// whiteboard/welfare.tsx: the HOUSEHOLD / SAFETY-NET part of the hand-drawn vocabulary (added 2026-11-02 for the
// left-behind beat WB4, "the loop the no-asset side falls into"): an office workstation (desk, monitor, empty chair),
// a hand-drawn cross-out, an open pay envelope with a bill peeking out that can SHRINK (a ghost of its old size stays),
// a price tag with a falling zig-zag arrow, a piggy bank (with a ghost coin that never drops in, and an empty shake),
// a government cheque (a landmark emblem, an empty amount box, a signature) and an elliptical loop arc with an arrow
// head (the cycle's links; also the faint guide when drawn without a head).
//
// Kit conventions (video-creation/whiteboard/whiteboard.md): every component takes the pen and a LOCAL time `t`
// (seconds since its cue; <= 0 = not yet) and draws itself on part by part over `dur` through Sketch progress; fixed
// seeds (no boil, identical across render workers); role colors from the pen's palette (gold = money, red = risk,
// blue = machines, green = the bill / the cheque, brown = wood / kraft paper, grey = background); draw order = what
// hides what. Geometry was studied from references before drawing (Lucide icons, ISC, lucide-static 1.66.0:
// `piggy-bank` = an oval body facing right, a flat snout disc at the front, one ear up behind the snout, two stubby
// legs under the front and the back, a curled tail at the rear, the coin slot on the back, the eye between the ear and
// the snout; `landmark` = a pediment triangle over four columns on a base line; `monitor` = a rounded screen, a short
// neck, a foot bar; `tag` = a block with one pointed end, the hole near the point; `trending-down` = a zig-zag falling
// to the right with an L-shaped open head; `mail` + `banknote` = the envelope's V and the bill's oval + side dots; a US
// Treasury cheque = a landscape slip, the emblem top-left, the payee line, the amount box at the right, the signature
// bottom-right; an office desk front view = a slab top, a leg panel at one end, a drawer pedestal at the other, a
// swivel chair = backrest, seat, gas post, a star base on castors), then iterated on stills.
import React from 'react';
import type { Pen } from './pen';
import { Sketch, prog, easeOut, pop } from './Sketch';
import { Shadow } from './vocab';
import { rrect } from './crypto';

/** stage helper: progress of stage a..b (fractions of `dur`) at local time `t` */
const stager = (t: number, dur: number) => (a: number, b: number) => prog(t, a * dur, (b - a) * dur);

/**
 * An office workstation standing on `gy`, its bounding box centred on `cx` (~310 x 190): an empty swivel chair at the
 * left (backrest on the far side, so it faces the desk), a desk (brown slab top, a leg panel at the left end, a drawer
 * pedestal with two drawers + knobs at the right) and a monitor on the top (blue screen, a neck, a foot bar). Draw
 * order: shadow, chair, desk legs, the slab over them, the monitor.
 */
export const Desk: React.FC<{ cx: number; gy: number; t: number; pen: Pen; seed: number; dur?: number }> = ({ cx, gy, t, pen, seed, dur = 0.7 }) => {
  if (t <= 0) return null;
  const s = seed * 10, P = stager(t, dur);
  const x = cx + 45; // the desk's centre (the chair hangs off its left)
  const topY = gy - 100;
  const chX = cx - 125; // the chair's post
  return (
    <g>
      <Shadow cx={cx} cy={gy + 4} rx={170} ry={9} t={t} dark={pen.bg !== '#ffffff' && pen.floor === null} />
      {/* the empty chair: backrest (left), seat, post, base bar, two castors */}
      <Sketch pen={pen} seed={s + 1} shape={{ kind: 'path', d: rrect(chX - 38, gy - 132, 16, 70, 6) }} fill={pen.palette.grey} roughness={0.7} progress={P(0, 0.2)} />
      <Sketch pen={pen} seed={s + 2} shape={{ kind: 'path', d: rrect(chX - 36, gy - 66, 66, 12, 5) }} fill={pen.palette.grey} roughness={0.7} progress={P(0.12, 0.3)} />
      <Sketch pen={pen} seed={s + 3} shape={{ kind: 'line', x1: chX, y1: gy - 54, x2: chX, y2: gy - 16 }} strokeWidth={pen.inkWidth + 1.4} roughness={0.5} progress={P(0.24, 0.34)} />
      <Sketch pen={pen} seed={s + 4} shape={{ kind: 'line', x1: chX - 30, y1: gy - 14, x2: chX + 30, y2: gy - 14 }} strokeWidth={pen.inkWidth + 0.6} roughness={0.5} progress={P(0.3, 0.38)} />
      <Sketch pen={pen} seed={s + 5} shape={{ kind: 'circle', cx: chX - 28, cy: gy - 6, r: 6 }} fill={pen.dark} roughness={0.3} progress={P(0.34, 0.4)} />
      <Sketch pen={pen} seed={s + 6} shape={{ kind: 'circle', cx: chX + 28, cy: gy - 6, r: 6 }} fill={pen.dark} roughness={0.3} progress={P(0.36, 0.42)} />
      {/* the desk: the leg panel (left), the drawer pedestal (right), then the slab over both */}
      <Sketch pen={pen} seed={s + 7} shape={{ kind: 'rect', x: x - 102, y: topY + 12, w: 16, h: 88 }} fill={pen.palette.brown} roughness={0.7} progress={P(0.3, 0.46)} />
      <Sketch pen={pen} seed={s + 8} shape={{ kind: 'rect', x: x + 30, y: topY + 12, w: 72, h: 88 }} fill={pen.palette.brown} roughness={0.7} progress={P(0.36, 0.56)} />
      <Sketch pen={pen} seed={s + 9} shape={{ kind: 'line', x1: x + 30, y1: topY + 42, x2: x + 102, y2: topY + 42 }} strokeWidth={1.6} roughness={0.4} progress={P(0.52, 0.6)} />
      <Sketch pen={pen} seed={s + 10} shape={{ kind: 'line', x1: x + 30, y1: topY + 71, x2: x + 102, y2: topY + 71 }} strokeWidth={1.6} roughness={0.4} progress={P(0.55, 0.63)} />
      {P(0.6, 0.66) > 0 && <circle cx={x + 66} cy={topY + 28} r={3.6} fill={pen.dark} opacity={P(0.6, 0.66)} />}
      {P(0.62, 0.68) > 0 && <circle cx={x + 66} cy={topY + 57} r={3.6} fill={pen.dark} opacity={P(0.62, 0.68)} />}
      {P(0.64, 0.7) > 0 && <circle cx={x + 66} cy={topY + 86} r={3.6} fill={pen.dark} opacity={P(0.64, 0.7)} />}
      <Sketch pen={pen} seed={s + 11} shape={{ kind: 'rect', x: x - 112, y: topY, w: 224, h: 14 }} fill={pen.palette.brown} progress={easeOut(P(0.42, 0.64))} />
      {/* the monitor on the slab: foot bar, neck, the screen */}
      <Sketch pen={pen} seed={s + 12} shape={{ kind: 'line', x1: x - 50, y1: topY - 2, x2: x - 6, y2: topY - 2 }} strokeWidth={pen.inkWidth + 1.4} roughness={0.4} progress={P(0.64, 0.72)} />
      <Sketch pen={pen} seed={s + 13} shape={{ kind: 'line', x1: x - 28, y1: topY - 2, x2: x - 28, y2: topY - 18 }} strokeWidth={pen.inkWidth + 2} roughness={0.4} progress={P(0.68, 0.76)} />
      <Sketch pen={pen} seed={s + 14} shape={{ kind: 'path', d: rrect(x - 92, topY - 92, 128, 74, 8) }} fill={pen.palette.blue} progress={easeOut(P(0.72, 0.96))} />
      <Sketch pen={pen} seed={s + 15} shape={{ kind: 'path', d: rrect(x - 84, topY - 84, 112, 58, 4) }} strokeWidth={1.3} roughness={0.4} progress={P(0.88, 1)} />
    </g>
  );
};

/** a hand-drawn cross-out: two thick strokes over a box (x1, y1) - (x2, y2), the second starting as the first lands. Red by default. */
export const CrossOut: React.FC<{ x1: number; y1: number; x2: number; y2: number; t: number; pen: Pen; seed: number; color?: string; dur?: number; strokeWidth?: number }> =
  ({ x1, y1, x2, y2, t, pen, seed, color, dur = 0.45, strokeWidth }) => {
    if (t <= 0) return null;
    const c = color ?? pen.palette.red, sw = strokeWidth ?? pen.inkWidth + 5;
    return (
      <g>
        <Sketch pen={pen} seed={seed} shape={{ kind: 'line', x1, y1, x2, y2 }} stroke={c} strokeWidth={sw} roughness={0.9} progress={easeOut(prog(t, 0, dur * 0.5))} />
        <Sketch pen={pen} seed={seed + 1} shape={{ kind: 'line', x1: x2, y1, x2: x1, y2 }} stroke={c} strokeWidth={sw} roughness={0.9} progress={easeOut(prog(t, dur * 0.5, dur * 0.5))} />
      </g>
    );
  };

/**
 * An OPEN pay envelope centred (cx, cy) (~170 x 112, plus the flap and the bill above): the open flap (behind), a green
 * bill (oval + two side dots) standing out of it, the back panel and the front pocket with its V notch drawn over the
 * bill's lower half. Kraft brown by default. `k` scales it about its centre (the next job pays less) and while k < 1 a
 * GHOST of the full-size envelope stays behind it (grey band + dashed outline, the Bill / RiseBar "what was lost"
 * language), so the shrink reads on a still. Draws on over `dur`.
 */
export const PayEnvelope: React.FC<{ cx: number; cy: number; w?: number; h?: number; t: number; pen: Pen; seed: number; k?: number; color?: string; dur?: number }> =
  ({ cx, cy, w = 170, h = 112, t, pen, seed, k = 1, color, dur = 0.5 }) => {
    if (t <= 0) return null;
    const c = color ?? pen.palette.brown, s = seed * 10, P = stager(t, dur);
    const x0 = cx - w / 2, x1 = cx + w / 2, y0 = cy - h / 2, y1 = cy + h / 2;
    const flapH = 46, billW = 128, billH = 66, by = y0 - 40;
    const g = k < 0.999 ? Math.min(1, (1 - k) / 0.12) : 0;
    // the ghost: the old envelope body and the old bill as plain dashed boxes (round 1 traced the body + flap as ONE
    // pentagon, and a dashed pentagon read as a house)
    const ghostBody = `M ${x0} ${y0} L ${x1} ${y0} L ${x1} ${y1} L ${x0} ${y1} Z`;
    const ghostBill = `M ${cx - billW / 2} ${by} L ${cx + billW / 2} ${by} L ${cx + billW / 2} ${y0} M ${cx - billW / 2} ${y0} L ${cx - billW / 2} ${by}`;
    return (
      <g>
        {g > 0 && (
          <g opacity={g}>
            <path d={ghostBody} fill={pen.palette.grey} opacity={0.55} />
            <path d={`${ghostBody} ${ghostBill}`} fill="none" stroke={pen.ink} strokeWidth={pen.inkWidth} strokeDasharray="12 8" strokeLinecap="round" strokeLinejoin="round" opacity={0.7} />
          </g>
        )}
        <g transform={`translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})`}>
          {/* open flap (behind everything) */}
          <Sketch pen={pen} seed={s + 1} shape={{ kind: 'polygon', pts: [[x0, y0], [cx, y0 - flapH], [x1, y0]] }} fill={c} roughness={0.8} progress={P(0, 0.22)} />
          {/* back panel */}
          <Sketch pen={pen} seed={s + 2} shape={{ kind: 'rect', x: x0, y: y0, w, h }} fill={c} progress={P(0.12, 0.4)} />
          {/* the bill standing out of the envelope */}
          <Sketch pen={pen} seed={s + 3} shape={{ kind: 'rect', x: cx - billW / 2, y: by, w: billW, h: billH }} fill={pen.palette.green} roughness={0.8} progress={P(0.34, 0.56)} />
          <Sketch pen={pen} seed={s + 4} shape={{ kind: 'ellipse', cx, cy: by + 24, rx: 16, ry: 14 }} fill={pen.light} roughness={0.5} strokeWidth={1.6} progress={P(0.5, 0.62)} />
          {P(0.58, 0.66) > 0 && <circle cx={cx - 42} cy={by + 24} r={4} fill={pen.ink} opacity={P(0.58, 0.66)} />}
          {P(0.6, 0.68) > 0 && <circle cx={cx + 42} cy={by + 24} r={4} fill={pen.ink} opacity={P(0.6, 0.68)} />}
          {/* the front pocket over the bill's lower half, with the V notch */}
          <Sketch pen={pen} seed={s + 5} shape={{ kind: 'polygon', pts: [[x0, y0 + 18], [cx, y0 + 50], [x1, y0 + 18], [x1, y1], [x0, y1]] }} fill={c} progress={easeOut(P(0.62, 0.9))} />
          <Sketch pen={pen} seed={s + 6} shape={{ kind: 'line', x1: x0 + 6, y1: y1 - 4, x2: cx - 10, y2: y0 + 56 }} strokeWidth={1.3} roughness={0.5} opacity={0.6} progress={P(0.86, 0.96)} />
          <Sketch pen={pen} seed={s + 7} shape={{ kind: 'line', x1: x1 - 6, y1: y1 - 4, x2: cx + 10, y2: y0 + 56 }} strokeWidth={1.3} roughness={0.5} opacity={0.6} progress={P(0.9, 1)} />
        </g>
      </g>
    );
  };

/**
 * A price tag with a FALLING zig-zag arrow: the tag (gold, money) centred (cx - 60, cy), its pointed end up-left with
 * the punched hole and a string loop out of it; the arrow (ink, thick) zig-zags down to the right of it with an
 * L-shaped open head (Lucide `trending-down`). The tag draws over `dur` from t; the arrow from `dropT` (seconds since
 * the tag's cue, < 0 = never) over 0.6 s.
 */
export const PriceDrop: React.FC<{ cx: number; cy: number; t: number; pen: Pen; seed: number; dropT?: number; color?: string; arrowColor?: string; dur?: number }> =
  ({ cx, cy, t, pen, seed, dropT = -1, color, arrowColor, dur = 0.6 }) => {
    if (t <= 0) return null;
    const c = color ?? pen.palette.gold, ac = arrowColor ?? pen.ink, s = seed * 10, P = stager(t, dur);
    const tx = cx - 58, ty = cy + 4;
    const body: [number, number][] = [[-74, 0], [-32, -48], [62, -48], [62, 48], [-32, 48]];
    const k = pop(P(0, 0.5));
    // the falling arrow: a Lucide trending-down zig-zag, to the right of the tag
    const pts: [number, number][] = [[cx + 26, cy - 72], [cx + 66, cy - 14], [cx + 90, cy - 38], [cx + 138, cy + 50]];
    const zz = `M ${pts[0][0]} ${pts[0][1]} L ${pts[1][0]} ${pts[1][1]} L ${pts[2][0]} ${pts[2][1]} L ${pts[3][0]} ${pts[3][1]}`;
    const e = pts[3], hd = 34;
    const head = `M ${e[0] - hd} ${e[1]} L ${e[0]} ${e[1]} L ${e[0]} ${e[1] - hd}`;
    const dp = dropT > 0 ? t - dropT : -1;
    return (
      <g>
        {k > 0 && (
          <g transform={`translate(${tx} ${ty}) rotate(38) scale(${k})`}>
            <Sketch pen={pen} seed={s + 1} shape={{ kind: 'polygon', pts: body }} fill={c} />
            <Sketch pen={pen} seed={s + 2} shape={{ kind: 'circle', cx: -38, cy: 0, r: 9 }} fill={pen.light} roughness={0.5} progress={P(0.4, 0.6)} />
            {/* the string loop out of the hole, off the pointed end */}
            <Sketch pen={pen} seed={s + 3} shape={{ kind: 'path', d: 'M -38 -6 C -60 -40, -104 -46, -112 -16 C -116 2, -96 12, -84 4' }} strokeWidth={pen.inkWidth * 0.9} roughness={0.6} progress={P(0.55, 0.9)} />
            {/* two text bars on the tag (no amount: the beat airs no numbers) */}
            <Sketch pen={pen} seed={s + 4} shape={{ kind: 'line', x1: -6, y1: -14, x2: 42, y2: -14 }} strokeWidth={pen.inkWidth + 1.2} roughness={0.5} progress={P(0.75, 0.88)} />
            <Sketch pen={pen} seed={s + 5} shape={{ kind: 'line', x1: -6, y1: 14, x2: 30, y2: 14 }} strokeWidth={pen.inkWidth + 1.2} roughness={0.5} progress={P(0.85, 1)} />
          </g>
        )}
        {dp > 0 && (
          <>
            <Sketch pen={pen} seed={s + 6} shape={{ kind: 'path', d: zz }} stroke={ac} strokeWidth={pen.inkWidth + 3.5} roughness={0.7} progress={easeOut(prog(dp, 0, 0.45))} />
            <Sketch pen={pen} seed={s + 7} shape={{ kind: 'path', d: head }} stroke={ac} strokeWidth={pen.inkWidth + 3.5} roughness={0.6} progress={easeOut(prog(dp, 0.38, 0.22))} />
          </>
        )}
      </g>
    );
  };

/**
 * A piggy bank facing right, centred (cx, cy) (~250 x 160): far legs, body, near legs, snout disc with two nostrils,
 * the ear, the curled tail, the coin slot on the back, the eye. Pink (the palette's red) by default.
 * `ghostT` (seconds since the cue, < 0 = never): a DASHED ghost coin hovers over the slot with a short dashed arrow
 * that stops short of it (no income coming in). `shakeT`: the pig rocks (damped) and motion marks appear either side
 * (empty, nothing rattles).
 */
export const PiggyBank: React.FC<{ cx: number; cy: number; t: number; pen: Pen; seed: number; color?: string; ghostT?: number; shakeT?: number; dur?: number }> =
  ({ cx, cy, t, pen, seed, color, ghostT = -1, shakeT = -1, dur = 0.9 }) => {
    if (t <= 0) return null;
    const c = color ?? pen.palette.red, s = seed * 10, P = stager(t, dur);
    const gy = cy + 80; // the floor under the feet
    const sk = shakeT > 0 && t > shakeT ? t - shakeT : -1;
    const rock = sk > 0 ? 6 * Math.exp(-2.2 * sk) * Math.sin(14 * sk) : 0;
    const leg = (lx: number, sd: number, a: number, far: boolean) => (
      <Sketch pen={pen} seed={s + sd} shape={{ kind: 'path', d: rrect(lx, cy + 34, 24, 46, 6) }} fill={c} opacity={far ? 0.8 : 1} roughness={0.6} progress={P(a, a + 0.14)} />
    );
    const body = `M ${cx - 96} ${cy - 4} C ${cx - 98} ${cy - 54}, ${cx - 40} ${cy - 70}, ${cx + 6} ${cy - 66} C ${cx + 58} ${cy - 62}, ${cx + 96} ${cy - 40}, ${cx + 98} ${cy + 2} C ${cx + 98} ${cy + 46}, ${cx + 50} ${cy + 64}, ${cx} ${cy + 64} C ${cx - 56} ${cy + 64}, ${cx - 94} ${cy + 42}, ${cx - 96} ${cy - 4} Z`;
    // the ear: a rounded flap leaning forward over the head (round 1's straight triangle read as a horn / a fin)
    const ear = `M ${cx + 30} ${cy - 56} C ${cx + 30} ${cy - 76}, ${cx + 44} ${cy - 90}, ${cx + 64} ${cy - 88} C ${cx + 66} ${cy - 72}, ${cx + 62} ${cy - 58}, ${cx + 56} ${cy - 50} Z`;
    const tail = `M ${cx - 95} ${cy - 10} C ${cx - 118} ${cy - 22}, ${cx - 134} ${cy + 4}, ${cx - 118} ${cy + 10} C ${cx - 104} ${cy + 14}, ${cx - 108} ${cy - 10}, ${cx - 126} ${cy - 18}`;
    const off = (sg: number) => (sg < 0 ? 158 : 134); // the motion marks' distance from the centre: clear of the tail (left) and the snout (right)
    const gk = ghostT > 0 ? easeOut(prog(t, ghostT, 0.35)) : 0;
    const coinY = cy - 136;
    return (
      <g>
        <Shadow cx={cx} cy={gy + 4} rx={120} ry={9} t={t} dark={pen.bg !== '#ffffff' && pen.floor === null} />
        <g transform={`rotate(${rock} ${cx} ${gy})`}>
          {leg(cx - 52, 1, 0, true)}
          {leg(cx + 46, 2, 0.04, true)}
          <Sketch pen={pen} seed={s + 3} shape={{ kind: 'path', d: body }} fill={c} progress={easeOut(P(0.08, 0.5))} />
          {leg(cx - 74, 4, 0.42, false)}
          {leg(cx + 24, 5, 0.46, false)}
          <Sketch pen={pen} seed={s + 6} shape={{ kind: 'ellipse', cx: cx + 100, cy: cy - 4, rx: 15, ry: 22 }} fill={c} roughness={0.6} progress={P(0.5, 0.64)} />
          {P(0.62, 0.7) > 0 && <ellipse cx={cx + 96} cy={cy - 11} rx={2.6} ry={4} fill={pen.dark} opacity={P(0.62, 0.7)} />}
          {P(0.64, 0.72) > 0 && <ellipse cx={cx + 96} cy={cy + 4} rx={2.6} ry={4} fill={pen.dark} opacity={P(0.64, 0.72)} />}
          <Sketch pen={pen} seed={s + 7} shape={{ kind: 'path', d: ear }} fill={c} roughness={0.5} progress={P(0.62, 0.76)} />
          <Sketch pen={pen} seed={s + 11} shape={{ kind: 'path', d: `M ${cx + 40} ${cy - 60} C ${cx + 42} ${cy - 72}, ${cx + 50} ${cy - 80}, ${cx + 58} ${cy - 80}` }} strokeWidth={1.4} roughness={0.4} opacity={0.6} progress={P(0.72, 0.8)} />
          <Sketch pen={pen} seed={s + 8} shape={{ kind: 'path', d: tail }} strokeWidth={pen.inkWidth + 0.4} roughness={0.6} progress={P(0.72, 0.86)} />
          {/* the coin slot on the back */}
          <Sketch pen={pen} seed={s + 9} shape={{ kind: 'line', x1: cx - 34, y1: cy - 54, x2: cx + 10, y2: cy - 56 }} stroke={pen.dark} strokeWidth={pen.inkWidth + 3.2} roughness={0.3} progress={P(0.82, 0.92)} />
          <Sketch pen={pen} seed={s + 10} shape={{ kind: 'circle', cx: cx + 62, cy: cy - 20, r: 4.5 }} fill={pen.dark} roughness={0.3} progress={P(0.9, 1)} />
        </g>
        {gk > 0 && (
          <g opacity={gk}>
            <circle cx={cx - 12} cy={coinY} r={24} fill="none" stroke={pen.colorL} strokeWidth={pen.inkWidth} strokeDasharray="7 7" strokeLinecap="round" />
            <line x1={cx - 12} y1={coinY + 34} x2={cx - 12} y2={coinY + 56} stroke={pen.colorL} strokeWidth={pen.inkWidth} strokeDasharray="5 6" strokeLinecap="round" />
          </g>
        )}
        {sk > 0 && [-1, 1].map((sg) => (
          <g key={sg} opacity={Math.min(1, sk / 0.2)}>
            {[0, 1].map((i) => (
              <Sketch key={i} pen={pen} seed={s + 14 + (sg + 1) + i} shape={{ kind: 'path', d: `M ${cx + sg * (off(sg) + i * 16)} ${cy - 30 + i * 4} Q ${cx + sg * (off(sg) + 12 + i * 16)} ${cy} ${cx + sg * (off(sg) + i * 16)} ${cy + 30 - i * 4}` }} strokeWidth={pen.inkWidth} roughness={0.5} progress={easeOut(prog(sk, i * 0.08, 0.25))} />
            ))}
          </g>
        ))}
      </g>
    );
  };

/** a small classical building (Lucide `landmark`): the pediment, four columns, the base line; (x, y) = the apex, `w` wide */
const Landmark: React.FC<{ x: number; y: number; w: number; p: number; pen: Pen; seed: number }> = ({ x, y, w, p, pen, seed }) => {
  if (p <= 0) return null;
  const h = w * 0.9, roofH = w * 0.32, baseY = y + h;
  const cols = [0, 1, 2, 3].map((i) => x - w * 0.36 + (i * w * 0.72) / 3);
  return (
    <g>
      <Sketch pen={pen} seed={seed} shape={{ kind: 'polygon', pts: [[x, y], [x + w / 2, y + roofH], [x - w / 2, y + roofH]] }} fill={pen.light} strokeWidth={1.8} roughness={0.4} progress={prog(p, 0, 0.35)} />
      {cols.map((cx, i) => (
        <Sketch key={i} pen={pen} seed={seed + 1 + i} shape={{ kind: 'line', x1: cx, y1: y + roofH + 3, x2: cx, y2: baseY - 4 }} strokeWidth={2} roughness={0.3} progress={prog(p, 0.3 + i * 0.1, 0.2)} />
      ))}
      <Sketch pen={pen} seed={seed + 6} shape={{ kind: 'line', x1: x - w / 2, y1: baseY, x2: x + w / 2, y2: baseY }} strokeWidth={2.4} roughness={0.3} progress={prog(p, 0.8, 0.2)} />
    </g>
  );
};

/**
 * A government cheque centred (cx, cy) (~290 x 140): a pale green slip with an inner border, the landmark emblem
 * top-left, a thick header bar beside it, an EMPTY amount box at the right (a squiggle, never an amount), the payee
 * line, a memo bar and a signature squiggle bottom-right. Draws on over `dur`.
 */
export const GovCheck: React.FC<{ cx: number; cy: number; w?: number; h?: number; t: number; pen: Pen; seed: number; color?: string; dur?: number }> =
  ({ cx, cy, w = 290, h = 140, t, pen, seed, color, dur = 0.8 }) => {
    if (t <= 0) return null;
    const c = color ?? pen.palette.green, s = seed * 10, P = stager(t, dur);
    const x = cx - w / 2, y = cy - h / 2, inset = 9;
    const bx = x + w - 96, byy = y + 50;
    const sig = `M ${x + w - 128} ${y + h - 26} C ${x + w - 116} ${y + h - 48}, ${x + w - 104} ${y + h - 12}, ${x + w - 88} ${y + h - 30} C ${x + w - 76} ${y + h - 44}, ${x + w - 66} ${y + h - 18}, ${x + w - 40} ${y + h - 28}`;
    return (
      <g>
        <Shadow cx={cx} cy={y + h + 10} rx={w * 0.5} ry={8} t={t} dark={pen.bg !== '#ffffff' && pen.floor === null} />
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'rect', x, y, w, h }} fill={c} progress={easeOut(P(0, 0.34))} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'path', d: rrect(x + inset, y + inset, w - 2 * inset, h - 2 * inset, 6) }} strokeWidth={1.3} roughness={0.5} progress={P(0.28, 0.46)} />
        <Landmark x={x + 44} y={y + 18} w={46} p={P(0.4, 0.64)} pen={pen} seed={s + 3} />
        <Sketch pen={pen} seed={s + 11} shape={{ kind: 'line', x1: x + 80, y1: y + 32, x2: x + 172, y2: y + 32 }} strokeWidth={pen.inkWidth + 2} roughness={0.4} progress={P(0.56, 0.66)} />
        {/* the amount box: empty, a squiggle where the amount would be */}
        <Sketch pen={pen} seed={s + 12} shape={{ kind: 'rect', x: bx, y: byy, w: 74, h: 30 }} fill={pen.light} roughness={0.4} strokeWidth={1.6} progress={P(0.62, 0.74)} />
        <Sketch pen={pen} seed={s + 13} shape={{ kind: 'path', d: `M ${bx + 12} ${byy + 16} q 8 -9 16 0 t 16 0 t 16 0` }} strokeWidth={1.6} roughness={0.3} opacity={0.7} progress={P(0.72, 0.8)} />
        {/* the payee line, the memo bar */}
        <Sketch pen={pen} seed={s + 14} shape={{ kind: 'line', x1: x + 26, y1: y + 86, x2: x + w - 116, y2: y + 86 }} strokeWidth={1.5} roughness={0.4} progress={P(0.7, 0.8)} />
        <Sketch pen={pen} seed={s + 15} shape={{ kind: 'line', x1: x + 26, y1: y + 112, x2: x + 100, y2: y + 112 }} strokeWidth={1.5} roughness={0.4} opacity={0.7} progress={P(0.76, 0.86)} />
        <Sketch pen={pen} seed={s + 16} shape={{ kind: 'path', d: sig }} strokeWidth={pen.inkWidth * 0.9} roughness={0.5} progress={P(0.84, 1)} />
      </g>
    );
  };

/** a point on the ellipse (cx, cy, rx, ry) at angle `a` degrees (screen coords: + = clockwise from +x) */
export const ellPt = (cx: number, cy: number, rx: number, ry: number, a: number): [number, number] => {
  const r = (a * Math.PI) / 180;
  return [cx + rx * Math.cos(r), cy + ry * Math.sin(r)];
};

/**
 * An arc of the ellipse (cx, cy, rx, ry) from angle `a0` to `a1` degrees, CLOCKWISE on screen (a1 > a0), drawn on
 * along its direction over `dur`; `head` > 0 sketches an open arrow head at the end along the tangent once the stroke
 * lands. The cycle's links; with head 0 and a faint stroke it is the guide.
 */
export const LoopArc: React.FC<{
  cx: number; cy: number; rx: number; ry: number; a0: number; a1: number; t: number; pen: Pen; seed: number;
  color?: string; dur?: number; strokeWidth?: number; head?: number; roughness?: number; opacity?: number;
  /** draw the arc's pieces one after another like a pen (Sketch `sequential`); off by default so the shipped beats keep their frames */
  sequential?: boolean;
}> = ({ cx, cy, rx, ry, a0, a1, t, pen, seed, color, dur = 0.5, strokeWidth, head = 26, roughness = 0.7, opacity = 1, sequential = false }) => {
  if (t <= 0) return null;
  const c = color ?? pen.ink, sw = strokeWidth ?? pen.inkWidth + 2;
  const p0 = ellPt(cx, cy, rx, ry, a0), p1 = ellPt(cx, cy, rx, ry, a1);
  const large = a1 - a0 > 180 ? 1 : 0;
  const d = `M ${p0[0]} ${p0[1]} A ${rx} ${ry} 0 ${large} 1 ${p1[0]} ${p1[1]}`;
  const r = (a1 * Math.PI) / 180;
  const ang = Math.atan2(ry * Math.cos(r), -rx * Math.sin(r)); // the tangent, clockwise
  const hd = `M ${p1[0] - head * Math.cos(ang - 0.5)} ${p1[1] - head * Math.sin(ang - 0.5)} L ${p1[0]} ${p1[1]} L ${p1[0] - head * Math.cos(ang + 0.5)} ${p1[1] - head * Math.sin(ang + 0.5)}`;
  return (
    <g opacity={opacity}>
      <Sketch pen={pen} seed={seed} shape={{ kind: 'path', d }} stroke={c} strokeWidth={sw} roughness={roughness} progress={easeOut(prog(t, 0, head > 0 ? dur * 0.8 : dur))} sequential={sequential} />
      {head > 0 && <Sketch pen={pen} seed={seed + 1} shape={{ kind: 'path', d: hd }} stroke={c} strokeWidth={sw} roughness={0.5} progress={easeOut(prog(t, dur * 0.7, dur * 0.3))} />}
    </g>
  );
};

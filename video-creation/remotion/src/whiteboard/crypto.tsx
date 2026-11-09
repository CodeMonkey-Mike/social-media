// whiteboard/crypto.tsx: the CRYPTO / SECURITY part of the hand-drawn vocabulary (added 2026-10-31 for the first
// whiteboard beat in a real video, binance `ov3-wb-signing`): the Ethereum mark, a wallet wearing the Binance mark, a
// key, a stack of signed papers, a hooded attacker, a contract box, a calendar with ticks, a straight arrow, a fat
// burst arrow and a money count-up.
//
// Kit conventions (video-creation/whiteboard/whiteboard.md): every component takes the pen and a LOCAL time `t`
// (seconds since its cue; <= 0 = not yet) and draws itself on part by part over `dur` through Sketch progress; fixed
// seeds (no boil, identical across render workers); role colors from the pen's palette (gold = money / Binance,
// red = the attacker / risk, blue = the chain / machines, green = good, grey = background facts); draw order = what
// hides what. In a no-fill pen (neon-ink) a shape's `fill` color becomes its stroke color (Sketch does that).
// Geometry was studied from references before drawing (the official Ethereum mark, 256x417; the Binance mark; the
// Lucide key / wallet / calendar / file-stack / signature icons, ISC; simple-icons, CC0), then iterated on stills.
import React from 'react';
import type { Pen } from './pen';
import { Sketch, prog, easeOut, pop } from './Sketch';

/** a dark-board pen (black bg, no paper floor) gets a light shadow, a paper pen a dark one */
export const darkShadow = (pen: Pen) => pen.bg !== '#ffffff' && pen.floor === null;

/**
 * A faint contact shadow under a standing thing, GATED to the thing's own draw-on (`k` 0..1 = how much of it exists):
 * it must never sit on the floor before the body does (visual-qa, 2026-10-31). Fainter than vocab's Shadow because a
 * no-fill pen (neon-ink) has no other filled shape on the board.
 */
export const FloorShadow: React.FC<{ cx: number; cy: number; rx: number; ry: number; k: number; pen: Pen }> = ({ cx, cy, rx, ry, k, pen }) => {
  if (k <= 0) return null;
  return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={darkShadow(pen) ? '#ffffff' : '#000000'} opacity={0.05 * easeOut(k)} />;
};

/** stage helper: progress of stage a..b (fractions of `dur`) at local time `t` */
const stager = (t: number, dur: number) => (a: number, b: number) => prog(t, a * dur, (b - a) * dur);

/** a rounded rectangle as a path (rough.js rect has no radius) */
export const rrect = (x: number, y: number, w: number, h: number, r: number) =>
  `M ${x + r} ${y} L ${x + w - r} ${y} Q ${x + w} ${y} ${x + w} ${y + r} L ${x + w} ${y + h - r} Q ${x + w} ${y + h} ${x + w - r} ${y + h} ` +
  `L ${x + r} ${y + h} Q ${x} ${y + h} ${x} ${y + h - r} L ${x} ${y + r} Q ${x} ${y} ${x + r} ${y} Z`;

/**
 * The Ethereum mark: the official diamond (two pyramids, 256 x 417 units) as a line drawing. (x, y) = top-left of its
 * box, `h` = height (width follows). Draws on top pyramid first (outline, center ridge, inner fold), then the lower one.
 * `boost` 0..1 adds a wide translucent halo over the outline (a glow pulse when the chain is named again).
 */
export const EthMark: React.FC<{ x: number; y: number; h: number; t: number; pen: Pen; seed: number; color?: string; dur?: number; boost?: number }> =
  ({ x, y, h, t, pen, seed, color, dur = 1.0, boost = 0 }) => {
    if (t <= 0) return null;
    const k = h / 417, c = color ?? pen.palette.blue, s = seed * 10, P = stager(t, dur);
    const X = (u: number) => x + u * k, Y = (v: number) => y + v * k;
    const upper: [number, number][] = [[X(128), Y(0)], [X(256), Y(212.3)], [X(128), Y(288)], [X(0), Y(212.3)]];
    const lower: [number, number][] = [[X(0), Y(236.6)], [X(128), Y(417)], [X(256), Y(236.6)]];
    const fold = `M ${X(0)} ${Y(212.3)} L ${X(128)} ${Y(154.2)} L ${X(256)} ${Y(212.3)}`;
    const foldLow = `M ${X(0)} ${Y(236.6)} L ${X(128)} ${Y(312.2)} L ${X(256)} ${Y(236.6)}`;
    const done = P(0, 1) >= 1;
    return (
      <g>
        {boost > 0 && done && (
          <g opacity={0.38 * boost}>
            <Sketch pen={pen} seed={s + 1} shape={{ kind: 'polygon', pts: upper }} stroke={c} strokeWidth={pen.inkWidth + 10} />
            <Sketch pen={pen} seed={s + 4} shape={{ kind: 'polygon', pts: lower }} stroke={c} strokeWidth={pen.inkWidth + 10} />
          </g>
        )}
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'polygon', pts: upper }} fill={c} progress={P(0, 0.4)} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'line', x1: X(128), y1: Y(0), x2: X(128), y2: Y(288) }} stroke={c} progress={P(0.32, 0.52)} />
        <Sketch pen={pen} seed={s + 3} shape={{ kind: 'path', d: fold }} stroke={c} progress={P(0.45, 0.65)} />
        <Sketch pen={pen} seed={s + 4} shape={{ kind: 'polygon', pts: lower }} fill={c} progress={P(0.55, 0.85)} />
        <Sketch pen={pen} seed={s + 5} shape={{ kind: 'path', d: foldLow }} stroke={c} progress={P(0.78, 0.93)} />
        <Sketch pen={pen} seed={s + 6} shape={{ kind: 'line', x1: X(128), y1: Y(312.2), x2: X(128), y2: Y(417) }} stroke={c} progress={P(0.86, 1)} />
      </g>
    );
  };

/** the Binance mark (center diamond, two side diamonds, two chevrons), 24-unit geometry scaled by `u` px per unit, centered */
const BINANCE_MARK: [number, number][][] = [
  [[12, 9.28], [14.72, 12], [12, 14.72], [9.28, 12]],                                               // center
  [[11.99, 0.01], [19.34, 7.34], [16.62, 10.06], [11.99, 5.42], [7.35, 10.08], [4.64, 7.36]],        // top chevron
  [[11.99, 23.99], [19.34, 16.66], [16.62, 13.94], [11.99, 18.58], [7.35, 13.92], [4.64, 16.64]],    // bottom chevron
  [[2.72, 9.28], [5.44, 12], [2.72, 14.72], [0, 12]],                                               // left
  [[21.28, 9.28], [24, 12], [21.28, 14.72], [18.56, 12]],                                           // right
];

/**
 * A wallet (billfold): rounded body, the fold seam a third down, a clasp pocket with its button on the right edge,
 * and (default) the Binance mark on the lower face. (x, y) = top-left, default 320 x 240. Gold = money.
 */
export const Wallet: React.FC<{ x: number; y: number; w?: number; h?: number; t: number; pen: Pen; seed: number; color?: string; emblem?: 'binance' | 'none'; dur?: number }> =
  ({ x, y, w = 320, h = 240, t, pen, seed, color, emblem = 'binance', dur = 1.4 }) => {
    if (t <= 0) return null;
    const c = color ?? pen.palette.gold, s = seed * 10, P = stager(t, dur);
    const seamY = y + h * 0.34;
    const cw = 66, ch = 54, cx0 = x + w - cw + 12, cy0 = seamY - ch / 2;
    const em = { cx: x + w * 0.5, cy: y + h * 0.67, u: 2.9 };
    const pt = ([gx, gy]: [number, number]): [number, number] => [em.cx + (gx - 12) * em.u, em.cy + (gy - 12) * em.u];
    return (
      <g>
        <FloorShadow cx={x + w / 2} cy={y + h + 16} rx={w * 0.56} ry={10} k={P(0.3, 0.6)} pen={pen} />
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'path', d: rrect(x, y, w, h, 22) }} fill={c} progress={P(0, 0.4)} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'line', x1: x, y1: seamY, x2: x + w - cw + 12, y2: seamY }} stroke={c} progress={P(0.38, 0.5)} />
        <Sketch pen={pen} seed={s + 3} shape={{ kind: 'path', d: rrect(cx0, cy0, cw, ch, 10) }} fill={c} progress={P(0.48, 0.62)} />
        <Sketch pen={pen} seed={s + 4} shape={{ kind: 'circle', cx: cx0 + cw / 2, cy: seamY, r: 8 }} fill={c} roughness={0.5} progress={P(0.6, 0.68)} />
        {emblem === 'binance' && BINANCE_MARK.map((poly, i) => (
          <Sketch key={i} pen={pen} seed={s + 10 + i} shape={{ kind: 'polygon', pts: poly.map(pt) }} fill={c} roughness={0.6} strokeWidth={pen.inkWidth * 0.9} progress={P(0.68 + i * 0.06, 0.8 + i * 0.05)} />
        ))}
      </g>
    );
  };

/**
 * A key: round bow with a hole at (x, y), a slim shaft running right for `len`, three notch teeth hanging from its end.
 * `angle` rotates it about the bow. Gold by default (the owner's key).
 */
export const Key: React.FC<{ x: number; y: number; len?: number; t: number; pen: Pen; seed: number; color?: string; dur?: number; angle?: number }> =
  ({ x, y, len = 185, t, pen, seed, color, dur = 0.7, angle = 0 }) => {
    if (t <= 0) return null;
    const c = color ?? pen.palette.gold, s = seed * 10, P = stager(t, dur), rb = 30, hs = 7;
    const teeth: [number, number][] = [[x + len - 14, 26], [x + len - 42, 20], [x + len - 66, 14]];
    return (
      <g transform={`rotate(${angle} ${x} ${y})`}>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'circle', cx: x, cy: y, r: rb }} fill={c} progress={P(0, 0.35)} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'circle', cx: x, cy: y, r: 10 }} fill={c} roughness={0.6} progress={P(0.3, 0.45)} />
        <Sketch pen={pen} seed={s + 3} shape={{ kind: 'path', d: `M ${x + rb - 2} ${y - hs} L ${x + len} ${y - hs} L ${x + len} ${y + hs} L ${x + rb - 2} ${y + hs}` }} stroke={c} progress={P(0.4, 0.74)} />
        {teeth.map(([tx, drop], i) => (
          <Sketch key={i} pen={pen} seed={s + 4 + i} shape={{ kind: 'path', d: `M ${tx} ${y + hs} L ${tx} ${y + hs + drop} L ${tx - 13} ${y + hs + drop} L ${tx - 13} ${y + hs}` }} stroke={c} progress={P(0.7 + i * 0.08, 0.84 + i * 0.06)} />
        ))}
      </g>
    );
  };

/**
 * A stack of `n` sheets: the back sheets show only their visible L (left + bottom edge, like a real pile), the front
 * sheet has a dog-ear and three text lines. (x, y) = the FRONT sheet's top-left. `signT` > 0 draws a signature
 * squiggle across the bottom of the front sheet (gold by default: the owner's hand signed it).
 */
export const PaperStack: React.FC<{ x: number; y: number; w?: number; h?: number; n?: number; t: number; pen: Pen; seed: number; signT?: number; signColor?: string; dur?: number }> =
  ({ x, y, w = 130, h = 170, n = 3, t, pen, seed, signT = -1, signColor, dur = 0.55 }) => {
    if (t <= 0) return null;
    const s = seed * 10, P = stager(t, dur), ear = 28, off = 12;
    const front = `M ${x} ${y} L ${x + w - ear} ${y} L ${x + w} ${y + ear} L ${x + w} ${y + h} L ${x} ${y + h} Z`;
    const backL = (i: number) => { const sx = x - off * i, sy = y + off * i; return `M ${sx + off} ${sy} L ${sx} ${sy} L ${sx} ${sy + h} L ${sx + w} ${sy + h} L ${sx + w} ${sy + h - off}`; };
    const sig = signColor ?? pen.palette.gold;
    const bx = x + 14, by = y + h - 30;
    const sigPath = `M ${bx} ${by} C ${bx + 8} ${by - 34}, ${bx + 16} ${by - 34}, ${bx + 20} ${by - 4} C ${bx + 24} ${by + 16}, ${bx + 30} ${by + 10}, ${bx + 36} ${by - 10} ` +
      `C ${bx + 42} ${by - 30}, ${bx + 50} ${by - 26}, ${bx + 54} ${by - 2} C ${bx + 58} ${by + 14}, ${bx + 66} ${by + 10}, ${bx + 74} ${by - 8} C ${bx + 82} ${by - 24}, ${bx + 92} ${by - 14}, ${bx + 104} ${by - 6}`;
    return (
      <g>
        {Array.from({ length: n - 1 }).map((_, k) => {
          const i = n - 1 - k; // back-most first
          return <Sketch key={i} pen={pen} seed={s + 1 + i} shape={{ kind: 'path', d: backL(i) }} progress={P(k * 0.18, 0.3 + k * 0.18)} />;
        })}
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'path', d: front }} fill={pen.light} progress={P(0.3, 0.64)} />
        <Sketch pen={pen} seed={s + 8} shape={{ kind: 'path', d: `M ${x + w - ear} ${y} L ${x + w - ear} ${y + ear} L ${x + w} ${y + ear}` }} progress={P(0.62, 0.74)} />
        {[0, 1, 2].map((i) => (
          <Sketch key={i} pen={pen} seed={s + 10 + i} strokeWidth={1.6} shape={{ kind: 'line', x1: x + 18, y1: y + 54 + i * 22, x2: x + w - 18 - (i === 2 ? 30 : 0), y2: y + 54 + i * 22 }} progress={P(0.72 + i * 0.08, 0.86 + i * 0.07)} />
        ))}
        {signT > 0 && <Sketch pen={pen} seed={s + 20} shape={{ kind: 'path', d: sigPath }} stroke={sig} strokeWidth={pen.inkWidth + 0.8} roughness={0.4} progress={easeOut(prog(signT, 0, 0.5))} />}
      </g>
    );
  };

/**
 * A hooded figure (the attacker): a hood arch flowing into the shoulders, a hollow face with two glowing eyes,
 * drawstrings, a kangaroo pocket with the arms in it, stick legs. Local box ~ 230 x 392, feet on the ground `gy`,
 * centered on `x`; `scale` about the feet. Red by default. Draws on hood -> face -> torso -> pocket -> arms -> legs -> eyes.
 */
export const Hooded: React.FC<{ x: number; gy: number; scale?: number; t: number; pen: Pen; seed: number; color?: string; dur?: number; eyes?: boolean }> =
  ({ x, gy, scale = 1, t, pen, seed, color, dur = 1.2, eyes = true }) => {
    if (t <= 0) return null;
    const c = color ?? pen.palette.red, s = seed * 10, P = stager(t, dur);
    const o = { roughness: pen.roughness / Math.max(scale, 0.5), strokeWidth: pen.inkWidth / Math.max(scale, 0.6) };
    return (
      <g transform={`translate(${x} ${gy}) scale(${scale})`}>
        {/* the shadow lands with the feet (legs draw at 0.7 to 0.88 of dur), never before the body exists */}
        <FloorShadow cx={0} cy={4} rx={92} ry={10} k={P(0.78, 0.96)} pen={pen} />
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'path', d: 'M -78 -280 C -88 -350, -50 -392, 0 -392 C 50 -392, 88 -350, 78 -280' }} stroke={c} progress={P(0, 0.3)} {...o} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'path', d: 'M -38 -292 C -46 -352, -24 -374, 0 -374 C 24 -374, 46 -352, 38 -292 C 28 -274, -28 -274, -38 -292 Z' }} stroke={c} progress={P(0.24, 0.46)} {...o} />
        <Sketch pen={pen} seed={s + 3} shape={{ kind: 'path', d: 'M -78 -280 C -106 -268, -114 -226, -108 -176 L -100 -130 L 100 -130 L 108 -176 C 114 -226, 106 -268, 78 -280' }} stroke={c} progress={P(0.3, 0.58)} {...o} />
        <Sketch pen={pen} seed={s + 4} shape={{ kind: 'path', d: 'M -52 -206 L -52 -162 C -52 -150, -42 -146, -32 -146 L 32 -146 C 42 -146, 52 -150, 52 -162 L 52 -206' }} stroke={c} progress={P(0.52, 0.64)} {...o} />
        <Sketch pen={pen} seed={s + 5} shape={{ kind: 'path', d: 'M -102 -258 C -126 -214, -118 -168, -58 -158' }} stroke={c} progress={P(0.58, 0.72)} {...o} />
        <Sketch pen={pen} seed={s + 6} shape={{ kind: 'path', d: 'M 102 -258 C 126 -214, 118 -168, 58 -158' }} stroke={c} progress={P(0.6, 0.74)} {...o} />
        <Sketch pen={pen} seed={s + 7} shape={{ kind: 'line', x1: -9, y1: -278, x2: -13, y2: -238 }} stroke={c} roughness={o.roughness} strokeWidth={o.strokeWidth * 0.8} progress={P(0.64, 0.72)} />
        <Sketch pen={pen} seed={s + 8} shape={{ kind: 'line', x1: 9, y1: -278, x2: 13, y2: -238 }} stroke={c} roughness={o.roughness} strokeWidth={o.strokeWidth * 0.8} progress={P(0.66, 0.74)} />
        <Sketch pen={pen} seed={s + 9} shape={{ kind: 'line', x1: -44, y1: -130, x2: -50, y2: -6 }} stroke={c} progress={P(0.7, 0.84)} {...o} />
        <Sketch pen={pen} seed={s + 10} shape={{ kind: 'line', x1: 44, y1: -130, x2: 50, y2: -6 }} stroke={c} progress={P(0.74, 0.88)} {...o} />
        <Sketch pen={pen} seed={s + 11} shape={{ kind: 'line', x1: -70, y1: -6, x2: -32, y2: -6 }} stroke={c} progress={P(0.84, 0.92)} {...o} />
        <Sketch pen={pen} seed={s + 12} shape={{ kind: 'line', x1: 32, y1: -6, x2: 72, y2: -6 }} stroke={c} progress={P(0.88, 0.96)} {...o} />
        {eyes && (
          <>
            <Sketch pen={pen} seed={s + 13} shape={{ kind: 'circle', cx: -13, cy: -330, r: 4.5 }} fill={c} roughness={0.3} progress={P(0.9, 0.96)} />
            <Sketch pen={pen} seed={s + 14} shape={{ kind: 'circle', cx: 13, cy: -330, r: 4.5 }} fill={c} roughness={0.3} progress={P(0.93, 1)} />
          </>
        )}
      </g>
    );
  };

/**
 * A contract / code box: a rounded box with a compact `< >` code glyph in its left 40 px; the scene types the label
 * (Type) centered on `x + 40 + (w - 50) / 2`, i.e. the space right of the glyph, at a size that leaves ~20 px of air
 * to the right border (Handlee caps run ~0.65 em per glyph). `glyph` = the glyph's stroke colour: by default the box
 * colour (a no-fill pen strokes it in that colour), which on a FILLED paper pen is the fill itself and vanishes (quant WB8,
 * 2026-11-05); a paper-pen scene passes the ink. Opt-in so the shipped neon frames are unchanged.
 */
export const ContractBox: React.FC<{ x: number; y: number; w?: number; h?: number; t: number; pen: Pen; seed: number; color?: string; dur?: number; glyph?: string }> =
  ({ x, y, w = 200, h = 98, t, pen, seed, color, dur = 0.5, glyph }) => {
    if (t <= 0) return null;
    const c = color ?? pen.palette.red, s = seed * 10, P = stager(t, dur), my = y + h / 2, gc = glyph ?? c;
    return (
      <g>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'path', d: rrect(x, y, w, h, 14) }} fill={c} progress={P(0, 0.7)} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'path', d: `M ${x + 24} ${my - 12} L ${x + 14} ${my} L ${x + 24} ${my + 12}` }} stroke={gc} progress={P(0.6, 0.85)} />
        <Sketch pen={pen} seed={s + 3} shape={{ kind: 'path', d: `M ${x + 30} ${my - 12} L ${x + 40} ${my} L ${x + 30} ${my + 12}` }} stroke={gc} progress={P(0.7, 0.95)} />
      </g>
    );
  };

/**
 * A wall calendar: two rings, a header band, a `cols` x `rows` grid of day squares drawn row by row; `ticks` (cell
 * indexes) pop in from local time `tickT` with `tickGap` between them; `ring` circles one cell from `ringT`.
 * Grey by default (a background fact); ticks and the ring in the tick color (red = the attacker's doing).
 */
export const Calendar: React.FC<{
  x: number; y: number; w?: number; h?: number; t: number; pen: Pen; seed: number; color?: string; tickColor?: string;
  ticks?: number[]; tickT?: number; tickGap?: number; ring?: number; ringT?: number; cols?: number; rows?: number; dur?: number;
}> = ({ x, y, w = 240, h = 212, t, pen, seed, color, tickColor, ticks = [], tickT = -1, tickGap = 0.12, ring = -1, ringT = -1, cols = 7, rows = 4, dur = 0.8 }) => {
  if (t <= 0) return null;
  const c = color ?? pen.palette.grey, tc = tickColor ?? pen.palette.red, s = seed * 10, P = stager(t, dur);
  const headH = 44, pad = 16;
  const gx = x + pad, gy0 = y + headH + 12, gw = w - 2 * pad, gh = h - headH - 12 - pad;
  const cw = gw / cols, ch = gh / rows, sz = Math.min(cw, ch) * 0.46;
  const cell = (i: number) => ({ cx: gx + (i % cols) * cw + cw / 2, cy: gy0 + Math.floor(i / cols) * ch + ch / 2 });
  const ringCell = ring >= 0 ? cell(ring) : null;
  return (
    <g>
      <Sketch pen={pen} seed={s + 1} shape={{ kind: 'path', d: rrect(x, y, w, h, 12) }} fill={c} progress={P(0, 0.35)} />
      <Sketch pen={pen} seed={s + 2} shape={{ kind: 'line', x1: x, y1: y + headH, x2: x + w, y2: y + headH }} stroke={c} progress={P(0.3, 0.45)} />
      <Sketch pen={pen} seed={s + 3} shape={{ kind: 'line', x1: x + w * 0.3, y1: y - 16, x2: x + w * 0.3, y2: y + 14 }} stroke={c} strokeWidth={pen.inkWidth + 1.5} progress={P(0.4, 0.5)} />
      <Sketch pen={pen} seed={s + 4} shape={{ kind: 'line', x1: x + w * 0.7, y1: y - 16, x2: x + w * 0.7, y2: y + 14 }} stroke={c} strokeWidth={pen.inkWidth + 1.5} progress={P(0.44, 0.54)} />
      {Array.from({ length: cols * rows }).map((_, i) => {
        const { cx, cy } = cell(i), row = Math.floor(i / cols);
        return <Sketch key={i} pen={pen} seed={s + 10 + i} shape={{ kind: 'rect', x: cx - sz / 2, y: cy - sz / 2, w: sz, h: sz }} stroke={c} strokeWidth={1.3} roughness={0.5} opacity={0.8} progress={P(0.5 + row * 0.1, 0.7 + row * 0.1)} />;
      })}
      {tickT > 0 && ticks.map((ci, k) => {
        const { cx, cy } = cell(ci), tt = tickT - k * tickGap;
        if (tt <= 0) return null;
        const kk = pop(prog(tt, 0, 0.3));
        return (
          <g key={k} transform={`translate(${cx} ${cy}) scale(${kk}) translate(${-cx} ${-cy})`}>
            <Sketch pen={pen} seed={s + 60 + k} shape={{ kind: 'path', d: `M ${cx - 11} ${cy} L ${cx - 3} ${cy + 9} L ${cx + 13} ${cy - 11}` }} stroke={tc} strokeWidth={pen.inkWidth + 2} roughness={0.6} />
          </g>
        );
      })}
      {ringCell && ringT > 0 && (
        <Sketch pen={pen} seed={s + 80} shape={{ kind: 'circle', cx: ringCell.cx, cy: ringCell.cy, r: Math.min(cw, ch) * 0.52 }} stroke={tc} strokeWidth={pen.inkWidth + 1} progress={easeOut(prog(ringT, 0, 0.4))} />
      )}
    </g>
  );
};

/** a plain straight arrow: the line draws, then its open head */
export const StraightArrow: React.FC<{ x1: number; y1: number; x2: number; y2: number; t: number; pen: Pen; seed: number; color?: string; dur?: number; strokeWidth?: number; head?: number }> =
  ({ x1, y1, x2, y2, t, pen, seed, color, dur = 0.45, strokeWidth, head = 26 }) => {
    if (t <= 0) return null;
    const c = color ?? pen.ink, ang = Math.atan2(y2 - y1, x2 - x1), sw = strokeWidth ?? pen.inkWidth + 1;
    const hd = `M ${x2 - head * Math.cos(ang - 0.5)} ${y2 - head * Math.sin(ang - 0.5)} L ${x2} ${y2} L ${x2 - head * Math.cos(ang + 0.5)} ${y2 - head * Math.sin(ang + 0.5)}`;
    return (
      <g>
        <Sketch pen={pen} seed={seed} shape={{ kind: 'line', x1, y1, x2, y2 }} stroke={c} strokeWidth={sw} progress={easeOut(prog(t, 0, dur * 0.8))} />
        <Sketch pen={pen} seed={seed + 1} shape={{ kind: 'path', d: hd }} stroke={c} strokeWidth={sw} progress={easeOut(prog(t, dur * 0.7, dur * 0.3))} />
      </g>
    );
  };

/**
 * A fat burst arrow that SHOOTS from (x1, y1) to (x2, y2): a pre-drawn shaft + big head revealed along its direction
 * over `dur` (a clip sweep, so the hand-drawn outline never boils), speed lines trailing the tail while it flies,
 * sparks at the tip when it lands. Gold by default (the money).
 */
export const BurstArrow: React.FC<{ x1: number; y1: number; x2: number; y2: number; t: number; pen: Pen; seed: number; color?: string; dur?: number; thick?: number; headLen?: number; headWidth?: number; sparks?: boolean; speedLines?: boolean }> =
  ({ x1, y1, x2, y2, t, pen, seed, color, dur = 0.35, thick = 28, headLen = 76, headWidth = 42, sparks = true, speedLines = true }) => {
    if (t <= 0) return null;
    const c = color ?? pen.palette.gold, s = seed * 10;
    const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L, nx = -uy, ny = ux, hs = thick / 2;
    const bx = x2 - ux * headLen, by = y2 - uy * headLen;
    const pts: [number, number][] = [
      [x1 + nx * hs, y1 + ny * hs], [bx + nx * hs, by + ny * hs], [bx + nx * headWidth, by + ny * headWidth], [x2, y2],
      [bx - nx * headWidth, by - ny * headWidth], [bx - nx * hs, by - ny * hs], [x1 - nx * hs, y1 - ny * hs],
    ];
    const p = easeOut(prog(t, 0, dur)), landed = prog(t, dur, 0.6);
    const ang = (Math.atan2(uy, ux) * 180) / Math.PI;
    const clipId = `burst-${seed}`;
    return (
      <g>
        <defs>
          <clipPath id={clipId}>
            <rect x={x1 - 30} y={y1 - headWidth - 24} width={(L + 60) * p} height={2 * headWidth + 48} transform={`rotate(${ang} ${x1} ${y1})`} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`}>
          <Sketch pen={pen} seed={s + 1} shape={{ kind: 'polygon', pts }} fill={c} strokeWidth={pen.inkWidth + 1.5} />
          <Sketch pen={pen} seed={s + 2} shape={{ kind: 'line', x1: x1 + ux * 26, y1: y1 + uy * 26, x2: bx - ux * 12, y2: by - uy * 12 }} stroke={c} strokeWidth={1.4} opacity={0.55} />
        </g>
        {/* speed lines trail BEHIND the tail: switch them off when the tail leaves an object (they would cross it) */}
        {speedLines && [-1, 0, 1].map((k) => {
          const len = 64 - Math.abs(k) * 20, off = k * (hs + 12), o = p * (1 - landed);
          if (o <= 0) return null;
          return <line key={k} x1={x1 - ux * 18 + nx * off} y1={y1 - uy * 18 + ny * off} x2={x1 - ux * (18 + len) + nx * off} y2={y1 - uy * (18 + len) + ny * off} stroke={c} strokeWidth={pen.inkWidth} strokeLinecap="round" opacity={0.85 * o} />;
        })}
        {sparks && p >= 0.98 && landed < 1 && [0, 1, 2, 3, 4].map((i) => {
          const a = (ang * Math.PI) / 180 + (i - 2) * 0.55, r = 16 + 50 * landed;
          return <circle key={i} cx={x2 + Math.cos(a) * r} cy={y2 + Math.sin(a) * r} r={5.5 - 3.5 * landed} fill={c} opacity={1 - landed} />;
        })}
      </g>
    );
  };

/**
 * A money count-up with decimals, e.g. "$2.53B" (CountUp in vocab is integers only), centered on `x`.
 * The decimal point is a DRAWN dot (r ~ 0.085 em) with clear air on both sides, not the font's period: Rock Salt's
 * period is a 6 px speck at 60 px and "$2.53B" read as "$253B" (visual-qa, 2026-10-31). The run is centered assuming
 * the right part ("53B") is one glyph longer than the left ("$2"); `shift` (em) moves the dot if the split differs.
 */
export const MoneyCount: React.FC<{ x: number; y: number; to: number; t: number; dur?: number; size: number; font: string; color: string; prefix?: string; suffix?: string; decimals?: number; shift?: number }> =
  ({ x, y, to, t, dur = 0.9, size, font, color, prefix = '$', suffix = 'B', decimals = 2, shift = -0.44 }) => {
    if (t <= 0) return null;
    const v = to * easeOut(prog(t, 0, dur));
    const ff = `'${font}', cursive`;
    if (decimals <= 0) return <text x={x} y={y} fontFamily={ff} fontSize={size} fill={color} textAnchor="middle" fontWeight="700">{prefix}{v.toFixed(0)}{suffix}</text>;
    const [ip, fp] = v.toFixed(decimals).split('.');
    const gap = size * 0.24, r = size * 0.085, cx = x + size * shift;
    return (
      <g>
        <text x={cx - gap} y={y} fontFamily={ff} fontSize={size} fill={color} textAnchor="end" fontWeight="700">{prefix}{ip}</text>
        <circle cx={cx} cy={y - r * 0.9} r={r} fill={color} />
        <text x={cx + gap} y={y} fontFamily={ff} fontSize={size} fill={color} textAnchor="start" fontWeight="700">{fp}{suffix}</text>
      </g>
    );
  };

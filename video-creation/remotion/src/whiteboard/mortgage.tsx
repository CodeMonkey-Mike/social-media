// whiteboard/mortgage.tsx: the REMORTGAGE part of the hand-drawn vocabulary (added 2026-11-05 for the quant beat WB6,
// GBTD's first live customer transactions: "your deposit gets locked the day you sign, keeps earning interest the whole
// time and on completion day it releases itself to the other side"): a wall calendar whose top page tears off (days pass)
// and whose cell can be ringed (completion day); a stack of coins that GROWS as small coins drop into it from above (the
// deposit earning interest while locked); a sheet of paper that gets SIGNED by a fountain pen whose nib rides the
// signature as it is written; a sticker tag (a word stuck beside a thing).
//
// Kit conventions (video-creation/whiteboard/whiteboard.md): every component takes the pen and a LOCAL time `t`
// (seconds since its cue; <= 0 = not yet) and draws itself on part by part over `dur` through Sketch progress; fixed
// seeds (no boil, identical across render workers); role colors from the pen's palette (gold = money, green = good /
// live, grey = background, blue = machines); draw order = what hides what. Geometry was studied from references before
// drawing (the Lucide icon set, ISC: `calendar` = two pegs through the top edge, a rounded body, a header rule a third of
// the way down, a grid of day marks below it; `pen` = a rounded barrel along a diagonal that tapers to a nib point over
// the last fifth of its length; `signature` = ONE looping stroke that rises and falls along a line; `coins` = stacked
// discs), then iterated on the beat's stills. Moving things (a falling coin, the pen) are authored once at a fixed place
// and TRANSLATED, so rough.js never regenerates per frame and the wobble never boils.
import React from 'react';
import type { Pen } from './pen';
import { Sketch, prog, easeOut, pop } from './Sketch';
import { rrect } from './crypto';

/** stage helper: progress of stage a..b (fractions of `dur`) at local time `t` */
const stager = (t: number, dur: number) => (a: number, b: number) => prog(t, a * dur, (b - a) * dur);
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

// ---------------------------------------------------------------------------------------------------------------------
// the month calendar

/** geometry of a MonthCalendar: the header band, the page rect, the cell grid, where the month's name is written */
export const monthCalendarGeom = (x: number, y: number, w = 250, h = 230, cols = 7, rows = 4) => {
  const headH = 50, pad = 14;
  const px = x + pad, py = y + headH + 10, pw = w - 2 * pad, ph = h - headH - 10 - pad;
  const cw = pw / cols, ch = ph / rows, sz = Math.min(cw, ch) * 0.46;
  const cell = (i: number) => ({ cx: px + (i % cols) * cw + cw / 2, cy: py + Math.floor(i / cols) * ch + ch / 2 });
  return { headH, headX: x + w / 2, headBase: y + headH * 0.7, px, py, pw, ph, cw, ch, sz, cell, pegs: [x + w * 0.3, x + w * 0.7] };
};

/**
 * A wall calendar (x, y top-left, `w` x `h`): a rounded body (grey), two pegs through its top edge, a header band (the
 * scene writes the month on it at `monthCalendarGeom().headBase`, label font), a light page with a `cols` x `rows` grid
 * of day squares. Days pass by CROSSING THEM OFF, never by tearing the page (quant WB6, visual-qa 2026-11-05: a torn
 * page flew off the top edge, its grid showed through the month's name, and a flip implies a NEW month, which a beat
 * that may air only one month cannot show): `crossT` > 0 slashes the first `crossUpTo` cells one after another over
 * `crossDur` (a short ink diagonal through each square, bottom-left to top-right, the way a day is struck off a wall
 * calendar), and `ringT` > 0 draws a ring around cell `ringCell` (completion day; `ringColor`, ink by default): ring a
 * cell of a MIDDLE row, the ring (r = half a cell pitch) needs ~16 px to the page frame and the last row has ~3. Draws
 * on body -> header rule -> pegs -> page -> grid over `dur`. The pegs end at `y + 4`, inside the body's top rim and
 * above the month's text (its cap top is ~y + 8 at 32 px; the first build's pegs ran to y + 16, through the name).
 */
export const MonthCalendar: React.FC<{
  x: number; y: number; w?: number; h?: number; t: number; pen: Pen; seed: number; cols?: number; rows?: number;
  crossT?: number; crossUpTo?: number; crossDur?: number; ringCell?: number; ringT?: number; ringColor?: string; dur?: number;
}> = ({ x, y, w = 250, h = 230, t, pen, seed, cols = 7, rows = 4, crossT = -1, crossUpTo = 0, crossDur = 0.4, ringCell = -1, ringT = -1, ringColor, dur = 0.7 }) => {
  if (t <= 0) return null;
  const s = seed * 10, P = stager(t, dur), g = monthCalendarGeom(x, y, w, h, cols, rows);
  const grid = (seedBase: number, p: number) =>
    Array.from({ length: cols * rows }).map((_, i) => {
      const { cx, cy } = g.cell(i), row = Math.floor(i / cols);
      return <Sketch key={i} pen={pen} seed={seedBase + i} shape={{ kind: 'rect', x: cx - g.sz / 2, y: cy - g.sz / 2, w: g.sz, h: g.sz }} stroke={pen.ink} strokeWidth={1.3} roughness={0.5} opacity={0.55} progress={prog(p, row / rows, 0.3)} />;
    });
  const ring = ringCell >= 0 ? g.cell(ringCell) : null;
  const nCross = Math.max(0, Math.min(cols * rows, crossUpTo));
  const slashDur = 0.08, step = nCross > 1 ? Math.max(0, crossDur - slashDur) / (nCross - 1) : 0;
  const half = g.sz * 0.42;
  return (
    <g>
      <Sketch pen={pen} seed={s + 1} shape={{ kind: 'path', d: rrect(x, y, w, h, 14) }} fill={pen.palette.grey} progress={P(0, 0.38)} />
      <Sketch pen={pen} seed={s + 2} shape={{ kind: 'line', x1: x, y1: y + g.headH, x2: x + w, y2: y + g.headH }} progress={P(0.32, 0.44)} />
      {g.pegs.map((pxx, i) => (
        <Sketch key={i} pen={pen} seed={s + 3 + i} shape={{ kind: 'line', x1: pxx, y1: y - 20, x2: pxx, y2: y + 4 }} strokeWidth={pen.inkWidth + 1.5} progress={P(0.4 + i * 0.05, 0.52 + i * 0.05)} />
      ))}
      <Sketch pen={pen} seed={s + 5} shape={{ kind: 'rect', x: g.px, y: g.py, w: g.pw, h: g.ph }} fill={pen.light} roughness={0.7} progress={P(0.52, 0.72)} />
      {grid(s + 10, P(0.66, 1))}
      {/* the days crossed off, one after another */}
      {crossT > 0 && Array.from({ length: nCross }).map((_, i) => {
        const { cx, cy } = g.cell(i);
        return <Sketch key={`x${i}`} pen={pen} seed={s + 50 + i} shape={{ kind: 'line', x1: cx - half, y1: cy + half, x2: cx + half, y2: cy - half }} stroke={pen.ink} strokeWidth={pen.inkWidth} roughness={0.5} opacity={0.85} progress={prog(crossT, i * step, slashDur)} />;
      })}
      {ring && ringT > 0 && (
        <Sketch pen={pen} seed={s + 80} shape={{ kind: 'circle', cx: ring.cx, cy: ring.cy, r: Math.min(g.cw, g.ch) * 0.5 }} stroke={ringColor ?? pen.ink} strokeWidth={pen.inkWidth + 1} roughness={0.6} progress={easeOut(prog(ringT, 0, 0.4))} />
      )}
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// the growing coin stack

/** geometry of a GrowStack with `n` coins: the top coin's centre line and the stack's top edge */
export const growStackGeom = (cx: number, baseY: number, n: number, rx = 36, ry = 11, th = 14) => {
  const topCy = baseY - th - ry - th * (n - 1);
  return { topCy, top: topCy - ry, left: cx - rx, right: cx + rx, bottom: baseY + ry };
};

/** how many of a GrowStack's `drops` have LANDED by local time `t` (so the thing standing on the stack can ride up) */
export const growStackLanded = (t: number, drops: number[], dropDur = 0.4) => drops.filter((d) => t - d >= dropDur).length;

/**
 * the stack's lift (px) at local time `t`: each landed coin raises what stands on the stack by `th`, eased over 0.12 s
 * from the moment it lands, so a padlock on top rides up smoothly as every coin slots in under it
 */
export const growStackLift = (t: number, drops: number[], th = 14, dropDur = 0.4) =>
  drops.reduce((acc, d) => acc + th * easeOut(prog(t - (d + dropDur - 0.06), 0, 0.14)), 0);

/** one flat coin (a cylinder `rx` wide, `th` thick, its top an ellipse of `ry`) with its top face centred (cx, yc) */
const FlatCoin: React.FC<{ cx: number; yc: number; rx: number; ry: number; th: number; pen: Pen; seed: number; color: string; opacity?: number }> =
  ({ cx, yc, rx, ry, th, pen, seed, color, opacity = 1 }) => {
    const side = `M ${cx - rx} ${yc} L ${cx - rx} ${yc + th} A ${rx} ${ry} 0 0 0 ${cx + rx} ${yc + th} L ${cx + rx} ${yc} A ${rx} ${ry} 0 0 0 ${cx - rx} ${yc} Z`;
    return (
      <g opacity={opacity}>
        <Sketch pen={pen} seed={seed} shape={{ kind: 'path', d: side }} fill={color} roughness={0.5} />
        <Sketch pen={pen} seed={seed + 1} shape={{ kind: 'ellipse', cx, cy: yc, rx, ry }} fill={color} roughness={0.45} />
      </g>
    );
  };

/**
 * A stack of `n` coins (gold = money) standing on (cx, baseY), bottom coin first so each hides the one below; pops in
 * over 0.35 s about its base. `drops` = local times (on this component's own clock) at which an EXTRA coin starts
 * falling from `from` (its centre's y) onto the stack: it accelerates like a dropped thing over `dropDur` and lands as
 * the stack's new top coin, so the stack grows by one each time. Each extra coin is authored at its landing place and
 * translated while it falls (no regeneration). Whatever stands on the stack follows `growStackLift`.
 */
export const GrowStack: React.FC<{
  cx: number; baseY: number; n?: number; rx?: number; ry?: number; th?: number; t: number; pen: Pen; seed: number; color?: string;
  drops?: number[]; from?: number; dropDur?: number;
}> = ({ cx, baseY, n = 4, rx = 36, ry = 11, th = 14, t, pen, seed, color, drops = [], from = 0, dropDur = 0.4 }) => {
  if (t <= 0) return null;
  const s = seed * 10, k = pop(prog(t, 0, 0.35)), c = color ?? pen.palette.gold;
  return (
    <g>
      <g transform={`translate(${cx} ${baseY}) scale(${k}) translate(${-cx} ${-baseY})`}>
        {Array.from({ length: n }).map((_, i) => (
          <FlatCoin key={i} cx={cx} yc={baseY - th - ry - th * i} rx={rx} ry={ry} th={th} pen={pen} seed={s + 1 + i * 2} color={c} />
        ))}
      </g>
      {drops.map((d, i) => {
        const dt = t - d;
        if (dt <= 0) return null;
        const q = clamp01(dt / dropDur), fall = q * q;                       // gravity: slow start, fast landing
        const yc = baseY - th - ry - th * (n + i);                             // where it lands (the new top coin)
        const dy = (from - yc) * (1 - fall);
        return (
          <g key={i} transform={`translate(0 ${dy})`}>
            <FlatCoin cx={cx} yc={yc} rx={rx} ry={ry} th={th} pen={pen} seed={s + 40 + i * 2} color={c} opacity={clamp01(dt / 0.1)} />
          </g>
        );
      })}
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// the signed paper and the pen

/** a point on a cubic bezier */
const cubicAt = (c: [number, number][], u: number): [number, number] => {
  const v = clamp01(u), a = (1 - v) ** 3, b = 3 * (1 - v) ** 2 * v, cc = 3 * (1 - v) * v * v, d = v ** 3;
  return [a * c[0][0] + b * c[1][0] + cc * c[2][0] + d * c[3][0], a * c[0][1] + b * c[1][1] + cc * c[2][1] + d * c[3][1]];
};

/** the signature in local units (72 wide): four cubic loops that rise and fall along the line, like the Lucide `signature` */
const SIG_LOCAL: [number, number][][] = [
  [[0, 0], [6, -26], [14, -26], [18, -4]],
  [[18, -4], [22, 14], [28, 10], [34, -8]],
  [[34, -8], [40, -24], [48, -22], [52, -2]],
  [[52, -2], [56, 12], [64, 8], [72, -6]],
];

/** geometry of a SignedPaper: the signature's segments in canvas units, its path, its approximate length table */
export const signedPaperGeom = (x: number, y: number, w = 100, h = 125) => {
  const sx = x + 14, sy = y + h - 24, k = (w - 28) / 72;
  const segs = SIG_LOCAL.map((seg) => seg.map(([a, b]) => [sx + a * k, sy + b * k] as [number, number]));
  const d = `M ${segs[0][0][0]} ${segs[0][0][1]} ` + segs.map((c) => `C ${c[1][0]} ${c[1][1]}, ${c[2][0]} ${c[2][1]}, ${c[3][0]} ${c[3][1]}`).join(' ');
  const lens = segs.map((c) => { let l = 0, p = cubicAt(c, 0); for (let i = 1; i <= 12; i++) { const q = cubicAt(c, i / 12); l += Math.hypot(q[0] - p[0], q[1] - p[1]); p = q; } return l; });
  const total = lens.reduce((a, b) => a + b, 0);
  /** the nib's position when the signature is `p` (0..1) written */
  const nib = (p: number): [number, number] => {
    let acc = 0;
    for (let i = 0; i < segs.length; i++) {
      const f = lens[i] / total;
      if (p <= acc + f || i === segs.length - 1) return cubicAt(segs[i], (p - acc) / f);
      acc += f;
    }
    return segs[segs.length - 1][3];
  };
  return { sx, sy, k, segs, d, nib, lineY: y + h - 14, start: segs[0][0], end: segs[3][3] };
};

/**
 * A fountain pen whose nib is at (x, y), pointing up and to the right (`angle` degrees, -52 by default): a nib wedge
 * (light, a slit), a grip ring (grey), a dark barrel with a rounded end, a cap band. Authored once at the origin along
 * +x and rotated / translated, so it can follow a signature frame by frame without regeneration. Pops in over 0.2 s
 * about the nib. Geometry from the Lucide `pen`: the barrel's width is about a fifth of its length, the nib a short taper.
 */
export const InkPen: React.FC<{ x: number; y: number; angle?: number; t: number; pen: Pen; seed: number; len?: number }> =
  ({ x, y, angle = -52, t, pen, seed, len = 78 }) => {
    if (t <= 0) return null;
    const s = seed * 10, k = pop(prog(t, 0, 0.2)), Pa = pen.palette;
    return (
      <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${k})`}>
        <Sketch pen={pen} seed={s + 3} shape={{ kind: 'path', d: rrect(20, -7, len - 20, 14, 6) }} fill={pen.dark} roughness={0.5} />
        <Sketch pen={pen} seed={s + 4} shape={{ kind: 'rect', x: len - 12, y: -7, w: 8, h: 14 }} fill={Pa.grey} roughness={0.4} strokeWidth={pen.inkWidth * 0.8} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'rect', x: 12, y: -6, w: 10, h: 12 }} fill={Pa.grey} roughness={0.4} strokeWidth={pen.inkWidth * 0.8} />
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'polygon', pts: [[0, 0], [13, -4.5], [13, 4.5]] }} fill={pen.light} roughness={0.4} strokeWidth={pen.inkWidth * 0.9} />
        <Sketch pen={pen} seed={s + 5} shape={{ kind: 'line', x1: 2.5, y1: 0, x2: 10, y2: 0 }} strokeWidth={1.2} roughness={0.3} />
      </g>
    );
  };

/**
 * A sheet of paper (x, y top-left, `w` x `h`, light) with three ruled lines and a signature line near the bottom; draws
 * on over `dur`. `signT` > 0 writes the SIGNATURE (ink, one looping stroke written loop by loop over `signDur`) with a
 * fountain pen riding the stroke's tip (the pen pops in at the start point, follows the nib, and rests at the end).
 */
export const SignedPaper: React.FC<{ x: number; y: number; w?: number; h?: number; t: number; pen: Pen; seed: number; signT?: number; signDur?: number; signColor?: string; dur?: number; showPen?: boolean }> =
  ({ x, y, w = 100, h = 125, t, pen, seed, signT = -1, signDur = 0.6, signColor, dur = 0.5, showPen = true }) => {
    if (t <= 0) return null;
    const s = seed * 10, P = stager(t, dur), g = signedPaperGeom(x, y, w, h);
    const sp = easeOut(prog(signT, 0, signDur));
    const nib = g.nib(sp);
    return (
      <g>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'rect', x, y, w, h }} fill={pen.light} progress={P(0, 0.5)} />
        {[0, 1, 2].map((i) => (
          <Sketch key={i} pen={pen} seed={s + 10 + i} shape={{ kind: 'line', x1: x + 14, y1: y + 30 + i * 18, x2: x + w - 14 - (i === 2 ? 26 : 0), y2: y + 30 + i * 18 }} strokeWidth={1.5} roughness={0.4} progress={P(0.45 + i * 0.12, 0.62 + i * 0.12)} />
        ))}
        <Sketch pen={pen} seed={s + 13} shape={{ kind: 'line', x1: x + 12, y1: g.lineY, x2: x + w - 12, y2: g.lineY }} strokeWidth={1.3} roughness={0.4} progress={P(0.84, 1)} />
        {signT > 0 && <Sketch pen={pen} seed={s + 20} shape={{ kind: 'path', d: g.d }} stroke={signColor ?? pen.ink} strokeWidth={pen.inkWidth + 0.6} roughness={0.5} progress={sp} sequential />}
        {showPen && <InkPen x={nib[0]} y={nib[1]} t={signT} pen={pen} seed={seed + 1} />}
      </g>
    );
  };

// ---------------------------------------------------------------------------------------------------------------------
// a sticker tag

/** a small rounded sticker (x, y top-left, `w` x `h`, `color` fill) that pops in over 0.3 s about its centre; the scene writes on it (children, shown from 60 percent of the pop) */
export const StickerTag: React.FC<{ x: number; y: number; w?: number; h?: number; t: number; pen: Pen; seed: number; color?: string; children?: React.ReactNode }> =
  ({ x, y, w = 96, h = 42, t, pen, seed, color, children }) => {
    if (t <= 0) return null;
    const k = pop(prog(t, 0, 0.3)), cx = x + w / 2, cy = y + h / 2;
    return (
      <g transform={`translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})`}>
        <Sketch pen={pen} seed={seed} shape={{ kind: 'path', d: rrect(x, y, w, h, 10) }} fill={color ?? pen.palette.green} roughness={0.6} />
        {prog(t, 0, 0.3) >= 0.6 && children}
      </g>
    );
  };

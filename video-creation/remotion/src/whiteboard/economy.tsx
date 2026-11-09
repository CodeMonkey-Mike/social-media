// whiteboard/economy.tsx: the WHO-PAYS part of the hand-drawn vocabulary (added 2026-11-02 for the left-behind beat
// WB3, "the asset side pays, the paycheck side waits"): a lab flask with a liquid, a burst of sparkles, a price tag that
// swings on a string (with a written price whose decimal point is a DRAWN dot), a stock certificate, a small house, a
// money bag, an empty open bifold wallet held upside down by its fold (nothing falls out) and a generic dashed / dotted line revealed along
// its direction (the sheet divider, the waiting line).
//
// Kit conventions (video-creation/whiteboard/whiteboard.md): every component takes the pen and a LOCAL time `t`
// (seconds since its cue; <= 0 = not yet) and draws itself on part by part over `dur` through Sketch progress; fixed
// seeds (no boil, identical across render workers); role colors from the pen's palette (gold = money, green = good /
// the cure, grey = background, brown = the house / the wallet); draw order = what hides what. Geometry was studied
// from references before drawing (Lucide `flask-conical`, ISC: a narrow neck under a wider lip, the body flaring to a
// rounded base, a liquid line two thirds down; Lucide `tag`: a pointed end with the hole near the point, the body a
// rounded block; Lucide `house`: walls under a gable, the door centred; Lucide `sparkles`: one big four-point star with
// concave sides and two small ones; the money-bag emoji: a pear-shaped sack gathered by a tie with two cloth flaps above
// it and a "$" on the belly; a stock certificate: a landscape sheet with a double border, a title, text lines, a round
// seal with ribbons at the bottom-left and a signature at the bottom), then iterated on stills.
import React from 'react';
import type { Pen } from './pen';
import { Sketch, prog, easeOut, pop } from './Sketch';
import { Shadow } from './vocab';
import { rrect } from './crypto';

/** stage helper: progress of stage a..b (fractions of `dur`) at local time `t` */
const stager = (t: number, dur: number) => (a: number, b: number) => prog(t, a * dur, (b - a) * dur);

/**
 * A conical (Erlenmeyer) flask standing on `baseY`, centred on `cx`, `h` tall: the lip, a narrow neck, the body flaring
 * to a rounded base. Draw order (round 2, 2026-11-02): a plain light backing of the glass, the liquid (a flat fill
 * clipped to the glass, so its slanted sides never double the outline) with a hand-drawn surface line, three bubbles,
 * then the rough OUTLINE ON TOP of everything (the lip's top stays open) and the rim last. The outline used to be a
 * filled Sketch drawn before the liquid; where its wobble fell inside the ideal clip the liquid hid the lower-left wall
 * (visual-qa: "the lower-left wall has no ink"). `level` 0..1 = how full (fraction of the body height). Green by default.
 */
export const Flask: React.FC<{ cx: number; baseY: number; h?: number; t: number; pen: Pen; seed: number; liquid?: string; level?: number; dur?: number }> =
  ({ cx, baseY, h = 270, t, pen, seed, liquid, level = 0.5, dur = 1.0 }) => {
    if (t <= 0) return null;
    const c = liquid ?? pen.palette.green, s = seed * 10, P = stager(t, dur);
    const k = h / 270;
    const lipY = baseY - h, lipHW = 55 * k, neckHW = 30 * k, neckY = lipY + 110 * k, baseHW = 122 * k, rc = 28 * k;
    const glass =
      `M ${cx - lipHW} ${lipY} L ${cx - neckHW} ${lipY} L ${cx - neckHW} ${neckY} L ${cx - baseHW} ${baseY - rc} ` +
      `Q ${cx - baseHW - 6 * k} ${baseY} ${cx - baseHW + 22 * k} ${baseY} L ${cx + baseHW - 22 * k} ${baseY} Q ${cx + baseHW + 6 * k} ${baseY} ${cx + baseHW} ${baseY - rc} ` +
      `L ${cx + neckHW} ${neckY} L ${cx + neckHW} ${lipY} L ${cx + lipHW} ${lipY}`;
    const levelY = baseY - (baseY - rc - neckY) * level - rc;
    const halfAt = (y: number) => neckHW + ((y - neckY) / (baseY - rc - neckY)) * (baseHW - neckHW);
    const sx = halfAt(levelY);
    const clipId = `flask-${seed}`;
    const outline = easeOut(P(0, 0.5)), backing = Math.max(0, (outline - 0.6) / 0.4);
    const liq = P(0.46, 0.68), bub = [[-0.35, 0.35], [0.2, 0.55], [-0.05, 0.78]] as [number, number][];
    return (
      <g>
        <Shadow cx={cx} cy={baseY + 6} rx={baseHW * 1.05} ry={9} t={t} dark={pen.bg !== '#ffffff' && pen.floor === null} />
        <defs><clipPath id={clipId}><path d={`${glass} Z`} /></clipPath></defs>
        {/* the glass backing (plain, no stroke): fades in behind the outline like a Sketch fill */}
        {backing > 0 && <path d={`${glass} Z`} fill={pen.light} stroke="none" opacity={backing} />}
        {liq > 0 && (
          <g clipPath={`url(#${clipId})`}>
            <rect x={cx - baseHW - 10} y={levelY} width={2 * baseHW + 20} height={baseY - levelY + 4} fill={c} opacity={0.9 * liq} />
          </g>
        )}
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'line', x1: cx - sx, y1: levelY, x2: cx + sx, y2: levelY }} strokeWidth={pen.inkWidth * 0.9} roughness={0.9} progress={P(0.6, 0.76)} />
        {bub.map(([fx, fy], i) => {
          const r = (7 + i * 2) * k, by = levelY + (baseY - levelY) * fy, bx = cx + halfAt(by) * fx * 0.8;
          const q = pop(P(0.74 + i * 0.08, 0.88 + i * 0.08));
          if (q <= 0) return null;
          return (
            <g key={i} transform={`translate(${bx} ${by}) scale(${q}) translate(${-bx} ${-by})`}>
              <Sketch pen={pen} seed={s + 5 + i} shape={{ kind: 'circle', cx: bx, cy: by, r }} fill={pen.light} roughness={0.5} strokeWidth={pen.inkWidth * 0.7} />
            </g>
          );
        })}
        {/* the glass outline ON TOP of the liquid: both walls get the same ink line whatever side the wobble falls */}
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'path', d: glass }} progress={outline} />
        {/* the rim: redrawn last so the liquid's clip edge never shows over the lip */}
        <Sketch pen={pen} seed={s + 3} shape={{ kind: 'line', x1: cx - lipHW, y1: lipY, x2: cx + lipHW, y2: lipY }} strokeWidth={pen.inkWidth} roughness={0.8} progress={P(0.4, 0.5)} />
      </g>
    );
  };

/** one four-point star with concave sides, centred (cx, cy), radius r (a path, so rough.js wobbles it) */
const star4 = (cx: number, cy: number, r: number) => {
  const i = r * 0.24;
  return `M ${cx} ${cy - r} Q ${cx + i} ${cy - i} ${cx + r} ${cy} Q ${cx + i} ${cy + i} ${cx} ${cy + r} Q ${cx - i} ${cy + i} ${cx - r} ${cy} Q ${cx - i} ${cy - i} ${cx} ${cy - r} Z`;
};

/**
 * A burst of sparkles: one big four-point star at (cx, cy) and two small ones at its lower-right and upper-left, each
 * popping in (big first). Gold by default.
 */
export const Sparkles: React.FC<{ cx: number; cy: number; r?: number; t: number; pen: Pen; seed: number; color?: string }> = ({ cx, cy, r = 34, t, pen, seed, color }) => {
  if (t <= 0) return null;
  const c = color ?? pen.palette.gold, s = seed * 10;
  const stars: [number, number, number, number][] = [[cx, cy, r, 0], [cx + r * 1.35, cy + r * 1.25, r * 0.42, 0.14], [cx - r * 1.15, cy - r * 1.0, r * 0.34, 0.26]];
  return (
    <g>
      {stars.map(([x, y, rr, d], i) => {
        const k = pop(prog(t, d, 0.3));
        if (k <= 0) return null;
        return (
          <g key={i} transform={`translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})`}>
            <Sketch pen={pen} seed={s + 1 + i} shape={{ kind: 'path', d: star4(x, y, rr) }} fill={c} roughness={0.7} strokeWidth={pen.inkWidth * (i === 0 ? 1 : 0.8)} />
          </g>
        );
      })}
    </g>
  );
};

export type TagKick = { at: number; amp: number };

/**
 * A price tag hanging on a string: the string draws from `from` to the pivot (x, y) (the tag's HOLE), then the tag pops
 * in and swings about the hole like a pendulum. Local coordinates inside the tag: the hole is the origin, the tag's axis
 * runs +x (a pointed end at -48, the body 16..`len` by +/-62), rotated by `rest` degrees (the hanging angle) plus a
 * damped swing started by each kick (`kicks[].at` = local seconds, `amp` = degrees). Children are rendered in the tag's
 * local frame (the written price). Gold by default (money). Draw order (round 2, 2026-11-02): body, then the string
 * OVER the body so it visibly runs to the hole (drawn under the body it stopped at the pointed tip and the tag read as
 * glued on), then the hole on top so the string ends at its rim (tied through).
 */
export const PriceTag: React.FC<{
  x: number; y: number; from: [number, number]; t: number; pen: Pen; seed: number; rest?: number; kicks?: TagKick[]; color?: string; len?: number; children?: React.ReactNode;
}> = ({ x, y, from, t, pen, seed, rest = 18, kicks = [{ at: 0.2, amp: -40 }], color, len = 256, children }) => {
  if (t <= 0) return null;
  const c = color ?? pen.palette.gold, s = seed * 10;
  const swing = kicks.reduce((a, k) => (t > k.at ? a + k.amp * Math.exp(-1.25 * (t - k.at)) * Math.cos(5.6 * (t - k.at)) : a), 0);
  const ang = rest + swing;
  const k = pop(prog(t, 0.2, 0.3));
  const body: [number, number][] = [[-48, 0], [16, -62], [len, -62], [len, 62], [16, 62]];
  return (
    <g>
      {k > 0 && (
        <g transform={`translate(${x} ${y}) rotate(${ang}) scale(${k})`}>
          <Sketch pen={pen} seed={s + 2} shape={{ kind: 'polygon', pts: body }} fill={c} />
          {children}
        </g>
      )}
      <Sketch pen={pen} seed={s + 1} shape={{ kind: 'line', x1: from[0], y1: from[1], x2: x, y2: y }} strokeWidth={pen.inkWidth * 0.9} roughness={0.8} progress={easeOut(prog(t, 0, 0.25))} />
      {k > 0 && (
        <g transform={`translate(${x} ${y}) rotate(${ang}) scale(${k})`}>
          <Sketch pen={pen} seed={s + 3} shape={{ kind: 'circle', cx: 0, cy: 0, r: 9 }} fill={pen.light} roughness={0.5} />
        </g>
      )}
    </g>
  );
};

/**
 * A written price like "$4.25M" centred on `x`, baseline `y`: the integer part, a DRAWN decimal dot (r ~0.085 em, clear
 * air both sides: a display hand-font's period is a speck that merges into the digit, the binance lesson), then the
 * fraction + suffix. The glyphs appear in order at `cps` (a typewriter): "$4" then the dot then "25" then "M", so the
 * number is written as he says it. Each glyph sits in its own fixed cell (`charW` em + `spacing` em; "M" gets 1.5 cells'
 * width) so the digits never touch (the WB2 "1TOK" lesson). The "5" is NOT a font glyph: hand-fonts (Gochi, Kalam) draw
 * it with a curved hook top that reads as an "S" (WB3 round 2, "$4.2SM"), so it is DRAWN as strokes: a flat top bar,
 * a straight vertical stem, then the bowl.
 */
const Five: React.FC<{ cx: number; y: number; size: number; color: string }> = ({ cx, y, size, color }) => {
  const w = size * 0.4, h = size * 0.66, x0 = cx - w / 2, top = y - h, ym = top + h * 0.44, sw = size * 0.105;
  const d = `M ${x0 + w * 1.02} ${top} L ${x0} ${top} L ${x0 - w * 0.02} ${ym} `
    + `C ${x0 + w * 0.35} ${ym - h * 0.1}, ${x0 + w * 1.08} ${ym - h * 0.04}, ${x0 + w * 1.04} ${ym + h * 0.27} `
    + `C ${x0 + w * 1.0} ${y + h * 0.02}, ${x0 + w * 0.2} ${y + h * 0.04}, ${x0 - w * 0.08} ${y - h * 0.12}`;
  return <path d={d} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />;
};

export const PriceText: React.FC<{ x: number; y: number; text: string; t: number; size: number; font: string; color: string; cps?: number; charW?: number; spacing?: number }> =
  ({ x, y, text, t, size, font, color, cps = 10, charW = 0.54, spacing = 0.1 }) => {
    if (t <= 0) return null;
    const [left, right = ''] = text.split('.');
    const n = Math.min(text.length, Math.floor(t * cps) + 1); // characters written so far, the dot counts as one
    const cell = size * charW + spacing * size, gap = size * 0.2, r = size * 0.085;
    const cw = (c: string) => (c === 'M' || c === 'W' ? cell * 1.5 : cell);
    const width = (s: string) => s.split('').reduce((a, c) => a + cw(c), 0);
    const lw = width(left), rw = width(right);
    const cx = x - (rw - lw) / 2; // the dot's x, so the whole run is centred on x
    const ff = `'${font}', cursive`;
    const glyph = (c: string, mid: number, k: string) => (c === '5'
      ? <Five key={k} cx={mid} y={y} size={size} color={color} />
      : <text key={k} x={mid} y={y} fontFamily={ff} fontSize={size} fill={color} textAnchor="middle" fontWeight="700">{c}</text>);
    const out: React.ReactNode[] = [];
    let px = cx - gap - lw;
    left.split('').forEach((c, i) => { if (i < n) out.push(glyph(c, px + cw(c) / 2, `l${i}`)); px += cw(c); });
    px = cx + gap;
    right.split('').forEach((c, i) => { if (i < n - left.length - 1) out.push(glyph(c, px + cw(c) / 2, `r${i}`)); px += cw(c); });
    return (
      <g>
        {out}
        {n > left.length && <circle cx={cx} cy={y - r * 0.9} r={r} fill={color} />}
      </g>
    );
  };

/**
 * A stock certificate: a landscape sheet (cream) with an inner border, a title bar, three text lines on the left, a
 * round gold seal with two ribbons at the bottom-left and a signature squiggle along the bottom. (x, y) = top-left.
 * The right third of the body is left clear for a mark (the scene's up-arrow).
 */
export const Certificate: React.FC<{ x: number; y: number; w?: number; h?: number; t: number; pen: Pen; seed: number; dur?: number }> =
  ({ x, y, w = 260, h = 150, t, pen, seed, dur = 1.0 }) => {
    if (t <= 0) return null;
    const s = seed * 10, P = stager(t, dur), inset = 12;
    const sealX = x + 48, sealY = y + h - 48, sr = 20;
    const sig = `M ${x + 96} ${y + h - 30} C ${x + 112} ${y + h - 52}, ${x + 122} ${y + h - 18}, ${x + 140} ${y + h - 34} C ${x + 156} ${y + h - 48}, ${x + 164} ${y + h - 22}, ${x + 186} ${y + h - 32}`;
    return (
      <g>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'rect', x, y, w, h }} fill={pen.floor ?? pen.light} progress={easeOut(P(0, 0.36))} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'path', d: rrect(x + inset, y + inset, w - 2 * inset, h - 2 * inset, 8) }} strokeWidth={1.4} roughness={0.6} progress={P(0.3, 0.52)} />
        <Sketch pen={pen} seed={s + 3} shape={{ kind: 'line', x1: x + w * 0.3, y1: y + 36, x2: x + w * 0.7, y2: y + 36 }} strokeWidth={pen.inkWidth + 1.5} roughness={0.6} progress={P(0.5, 0.6)} />
        {[0, 1, 2].map((i) => (
          <Sketch key={i} pen={pen} seed={s + 4 + i} shape={{ kind: 'line', x1: x + 30, y1: y + 62 + i * 18, x2: x + 30 + w * 0.5 - i * 14, y2: y + 62 + i * 18 }} strokeWidth={1.4} roughness={0.5} opacity={0.75} progress={P(0.58 + i * 0.05, 0.66 + i * 0.05)} />
        ))}
        <Sketch pen={pen} seed={s + 8} shape={{ kind: 'line', x1: sealX - 6, y1: sealY + 12, x2: sealX - 14, y2: sealY + 40 }} strokeWidth={pen.inkWidth + 1} roughness={0.6} progress={P(0.76, 0.84)} />
        <Sketch pen={pen} seed={s + 9} shape={{ kind: 'line', x1: sealX + 6, y1: sealY + 12, x2: sealX + 14, y2: sealY + 40 }} strokeWidth={pen.inkWidth + 1} roughness={0.6} progress={P(0.78, 0.86)} />
        <Sketch pen={pen} seed={s + 10} shape={{ kind: 'circle', cx: sealX, cy: sealY, r: sr }} fill={pen.palette.gold} roughness={0.6} progress={P(0.8, 0.9)} />
        <Sketch pen={pen} seed={s + 11} shape={{ kind: 'circle', cx: sealX, cy: sealY, r: sr * 0.55 }} roughness={0.5} strokeWidth={1.3} progress={P(0.88, 0.94)} />
        <Sketch pen={pen} seed={s + 12} shape={{ kind: 'path', d: sig }} strokeWidth={pen.inkWidth * 0.9} roughness={0.5} progress={P(0.9, 1)} />
      </g>
    );
  };

/**
 * A small house standing on `gy`: walls (brown), a chimney (drawn first, so the roof covers its foot), a gable roof
 * with an overhang (grey), a door (dark) and a window (blue glass with a cross). (x) = the walls' left edge.
 */
export const House: React.FC<{ x: number; gy: number; w?: number; h?: number; t: number; pen: Pen; seed: number; dur?: number }> =
  ({ x, gy, w = 170, h = 125, t, pen, seed, dur = 0.8 }) => {
    if (t <= 0) return null;
    const s = seed * 10, P = stager(t, dur), top = gy - h, apex = top - 82, ov = 16;
    const roof: [number, number][] = [[x - ov, top + 6], [x + w / 2, apex], [x + w + ov, top + 6]];
    const dw = 40, dh = 66, dx = x + w / 2 - dw / 2;
    const wx = x + 22, wy = top + 28, ww = 36;
    return (
      <g>
        <Shadow cx={x + w / 2} cy={gy + 4} rx={w * 0.62} ry={8} t={t} dark={pen.bg !== '#ffffff' && pen.floor === null} />
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'rect', x, y: top, w, h }} fill={pen.palette.brown} progress={easeOut(P(0, 0.4))} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'rect', x: x + w - 44, y: apex + 24, w: 22, h: 44 }} fill={pen.palette.grey} roughness={0.6} progress={P(0.36, 0.48)} />
        <Sketch pen={pen} seed={s + 3} shape={{ kind: 'polygon', pts: roof }} fill={pen.palette.grey} progress={easeOut(P(0.42, 0.7))} />
        <Sketch pen={pen} seed={s + 4} shape={{ kind: 'path', d: `M ${dx} ${gy} L ${dx} ${gy - dh + 12} Q ${dx} ${gy - dh} ${dx + 12} ${gy - dh} L ${dx + dw - 12} ${gy - dh} Q ${dx + dw} ${gy - dh} ${dx + dw} ${gy - dh + 12} L ${dx + dw} ${gy} Z` }} fill={pen.dark} roughness={0.6} progress={P(0.68, 0.84)} />
        <Sketch pen={pen} seed={s + 5} shape={{ kind: 'rect', x: wx, y: wy, w: ww, h: ww }} fill={pen.palette.blue} roughness={0.6} progress={P(0.8, 0.92)} />
        <Sketch pen={pen} seed={s + 6} shape={{ kind: 'line', x1: wx + ww / 2, y1: wy, x2: wx + ww / 2, y2: wy + ww }} strokeWidth={1.4} roughness={0.4} progress={P(0.9, 0.96)} />
        <Sketch pen={pen} seed={s + 7} shape={{ kind: 'line', x1: wx, y1: wy + ww / 2, x2: wx + ww, y2: wy + ww / 2 }} strokeWidth={1.4} roughness={0.4} progress={P(0.94, 1)} />
      </g>
    );
  };

/**
 * A money bag: a pear-shaped sack gathered by a tie, two cloth flaps above the tie, a "$" on the belly. `cx` = centre,
 * `cy` = the BOTTOM of the sack, `h` = total height. Gold by default. Draws body -> tie -> flaps -> "$".
 */
export const MoneyBag: React.FC<{ cx: number; cy: number; h?: number; t: number; pen: Pen; seed: number; font: string; color?: string; dur?: number }> =
  ({ cx, cy, h = 140, t, pen, seed, font, color, dur = 0.7 }) => {
    if (t <= 0) return null;
    const c = color ?? pen.palette.gold, s = seed * 10, P = stager(t, dur), k = h / 140, top = cy - h;
    const tieY = top + 44 * k, hw = 85 * k;
    const body = `M ${cx - 26 * k} ${tieY} C ${cx - hw} ${top + 66 * k}, ${cx - hw} ${cy}, ${cx} ${cy} C ${cx + hw} ${cy}, ${cx + hw} ${top + 66 * k}, ${cx + 26 * k} ${tieY} Z`;
    const flap = (sg: 1 | -1) =>
      `M ${cx + sg * 24 * k} ${tieY - 2} C ${cx + sg * 44 * k} ${top + 30 * k}, ${cx + sg * 50 * k} ${top + 8 * k}, ${cx + sg * 34 * k} ${top} C ${cx + sg * 24 * k} ${top + 14 * k}, ${cx + sg * 12 * k} ${top + 28 * k}, ${cx + sg * 4 * k} ${tieY - 2} Z`;
    const sz = h * 0.42, dol = P(0.82, 1);
    return (
      <g>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'path', d: body }} fill={c} progress={easeOut(P(0, 0.5))} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'line', x1: cx - 34 * k, y1: tieY, x2: cx + 34 * k, y2: tieY }} strokeWidth={pen.inkWidth + 2} progress={P(0.46, 0.58)} />
        <Sketch pen={pen} seed={s + 3} shape={{ kind: 'path', d: flap(-1) }} fill={c} roughness={0.7} progress={P(0.56, 0.72)} />
        <Sketch pen={pen} seed={s + 4} shape={{ kind: 'path', d: flap(1) }} fill={c} roughness={0.7} progress={P(0.64, 0.8)} />
        {dol > 0 && (
          <text x={cx} y={tieY + (cy - tieY) * 0.66} fontFamily={`'${font}', cursive`} fontSize={sz} fill={pen.ink} textAnchor="middle" fontWeight="700" opacity={dol}>$</text>
        )}
      </g>
    );
  };

/**
 * An EMPTY wallet: ONE open bifold held UPSIDE DOWN by its fold, the hand at (x, y) pinching the fold's top: the two
 * leather halves hang side by side from the fold, splayed `spread` degrees so the mouth opens downward, the inside facing
 * the viewer: a dark wedge of the fold's interior between them, a stitched edge (a dashed line inset on each half), two
 * stacked card pockets per half (cream lining, the pocket nearest the fold in front, their open lips pointing down, empty),
 * a thick dark fold line, three shake lines fanning out under the mouth and nothing falling out. The hand (light circle)
 * is drawn LAST over the fold so it holds it. Brown leather by default.
 * Round 3 (2026-11-02, visual-qa): the earlier two separate leaves, each an inset-bordered card hung at +/-34 degrees,
 * read as "two tilted photo frames / ID cards"; studied from the open-bifold cartoon trope (the halves joined at the
 * fold, card slots as stacked pockets, stitching along the edge) before this redraw.
 */
export const EmptyWallet: React.FC<{ x: number; y: number; leafW?: number; leafH?: number; spread?: number; tilt?: number; t: number; pen: Pen; seed: number; color?: string; dur?: number }> =
  ({ x, y, leafW = 57, leafH = 72, spread = 6, tilt = 0, t, pen, seed, color, dur = 0.6 }) => {
    if (t <= 0) return null;
    const leather = color ?? pen.palette.brown, lining = pen.floor ?? pen.light, s = seed * 10, P = stager(t, dur), k = pop(prog(t, 0, 0.3));
    const g = 2; // half the fold gap
    const wedgeX = leafH * Math.sin((spread * Math.PI) / 180) + g;
    const half = (sg: 1 | -1, so: number, a: number) => (
      <g transform={`rotate(${-sg * spread}) scale(${sg} 1)`}>
        <Sketch pen={pen} seed={s + so} shape={{ kind: 'path', d: rrect(g, 0, leafW, leafH, 7) }} fill={leather} progress={easeOut(P(a, a + 0.3))} />
        {P(a + 0.26, a + 0.36) > 0 && (
          <path d={rrect(g + 5, 5, leafW - 10, leafH - 10, 4)} fill="none" stroke={pen.dark} strokeWidth={1.3} strokeDasharray="4 3.5" strokeLinecap="round" opacity={0.55 * P(a + 0.26, a + 0.36)} />
        )}
        {/* the card pockets: the one further from the fold first, the one nearest the fold on top (its lip is the front opening) */}
        <Sketch pen={pen} seed={s + so + 1} shape={{ kind: 'path', d: rrect(g + 9, 26, leafW - 18, 26, 4) }} fill={lining} roughness={0.5} strokeWidth={pen.inkWidth * 0.8} progress={P(a + 0.3, a + 0.42)} />
        <Sketch pen={pen} seed={s + so + 2} shape={{ kind: 'path', d: rrect(g + 9, 11, leafW - 18, 26, 4) }} fill={lining} roughness={0.5} strokeWidth={pen.inkWidth * 0.8} progress={P(a + 0.38, a + 0.5)} />
      </g>
    );
    return (
      <g transform={`translate(${x} ${y}) rotate(${tilt}) scale(${k})`}>
        {/* the inside of the fold: a dark wedge between the splayed halves */}
        <Sketch pen={pen} seed={s + 12} shape={{ kind: 'polygon', pts: [[0, 0], [-wedgeX, leafH - 2], [wedgeX, leafH - 2]] }} fill={pen.dark} stroke="none" roughness={0.4} progress={P(0, 0.2)} fillIn={P(0, 0.2)} />
        {half(1, 1, 0)}
        {half(-1, 5, 0.08)}
        <Sketch pen={pen} seed={s + 10} shape={{ kind: 'line', x1: 0, y1: -1, x2: 0, y2: leafH - 6 }} strokeWidth={pen.inkWidth + 1.6} roughness={0.5} progress={P(0.46, 0.58)} />
        {[-1, 0, 1].map((i) => (
          <Sketch key={i} pen={pen} seed={s + 14 + i} shape={{ kind: 'line', x1: i * 20, y1: leafH + 14, x2: i * 32, y2: leafH + 36 }} strokeWidth={pen.inkWidth * 0.9} roughness={0.6} opacity={0.7} progress={P(0.66 + (i + 1) * 0.08, 0.78 + (i + 1) * 0.08)} />
        ))}
        <Sketch pen={pen} seed={s + 11} shape={{ kind: 'circle', cx: 0, cy: 0, r: 8 }} fill={pen.light} roughness={0.5} progress={P(0.56, 0.66)} />
      </g>
    );
  };

/**
 * A dashed or dotted line from (x1, y1) to (x2, y2), revealed from its start along its direction over `dur` (a clip
 * sweep). `dash` = the SVG dasharray ("14 12" = dashes; "0.5 14" with round caps = dots). Ink by default.
 */
export const DashLine: React.FC<{ x1: number; y1: number; x2: number; y2: number; t: number; pen: Pen; seed: number; color?: string; dur?: number; dash?: string; strokeWidth?: number; opacity?: number }> =
  ({ x1, y1, x2, y2, t, pen, seed, color, dur = 0.6, dash = '14 12', strokeWidth, opacity = 1 }) => {
    if (t <= 0) return null;
    const c = color ?? pen.ink, sw = strokeWidth ?? pen.inkWidth + 1;
    const L = Math.hypot(x2 - x1, y2 - y1), deg = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
    const p = easeOut(prog(t, 0, dur)), clipId = `dashline-${seed}`;
    return (
      <g opacity={opacity}>
        <defs>
          <clipPath id={clipId}>
            <rect x={x1 - 8} y={y1 - sw - 8} width={(L + 16) * p} height={2 * sw + 16} transform={`rotate(${deg} ${x1} ${y1})`} />
          </clipPath>
        </defs>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth={sw} strokeDasharray={dash} strokeLinecap="round" clipPath={`url(#${clipId})`} />
      </g>
    );
  };

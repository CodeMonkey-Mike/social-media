// whiteboard/money.tsx: the MONEY / PAY part of the hand-drawn vocabulary (added 2026-11-02 for the left-behind beat
// WB2, "less pay in a weaker dollar"): a wall calendar whose pages fly off (time passing, back or forward), a single
// bar that rises from a baseline with an optional dashed INNER bar (the real value inside the nominal one), a dollar
// bill, a speech bubble, a curved arrow and a folded sheet corner (the handoff "off the page").
//
// Kit conventions (video-creation/whiteboard/whiteboard.md): every component takes the pen and a LOCAL time `t`
// (seconds since its cue; <= 0 = not yet) and draws itself on part by part over `dur` through Sketch progress; fixed
// seeds (no boil, identical across render workers); role colors from the pen's palette (gold = money, red = risk,
// green = the bill, grey = background facts); draw order = what hides what. Geometry was studied from references
// before drawing (a US banknote: a 2.35:1 rectangle, an inset ornamental border, a central oval portrait, a seal on
// either side; a wall calendar: two rings through the top edge, a header band, the month grid; the Lucide
// `message-square` bubble, ISC: a rounded rectangle with a wedge tail at the bottom-left; a dog-eared page corner:
// the flap is the mirrored corner triangle with the table showing behind it), then iterated on stills.
import React from 'react';
import type { Pen } from './pen';
import { Sketch, prog, easeOut, pop } from './Sketch';
import { rrect } from './crypto';

/** stage helper: progress of stage a..b (fractions of `dur`) at local time `t` */
const stager = (t: number, dur: number) => (a: number, b: number) => prog(t, a * dur, (b - a) * dur);

export type CalendarPhase = {
  /** local times (seconds since the calendar's cue) at which a page flies off, one per page */
  flips: number[];
  /** the word on the page revealed once the last page of this phase has flown */
  label: string;
  /** pages fly up-left (-1, "back in time") or up-right (1, "forward") */
  dir: -1 | 1;
};

/**
 * A wall calendar whose pages fly off: body (rounded, grey), a header band, two rings through the top edge, a light
 * page with a 3 x 3 month grid. Each phase tears off `flips.length` pages (each flies away over 0.45 s, rotating,
 * fading), then its `label` pops onto the page face in the heading font; the previous label leaves when the next
 * phase's first page lifts. (x, y) = top-left, draws on over `dur`.
 */
export const FlipCalendar: React.FC<{
  x: number; y: number; w?: number; h?: number; t: number; pen: Pen; seed: number; phases: CalendarPhase[]; font: string;
  labelColor?: string; labelSize?: number; dur?: number;
}> = ({ x, y, w = 250, h = 230, t, pen, seed, phases, font, labelColor, labelSize = 66, dur = 0.6 }) => {
  if (t <= 0) return null;
  const s = seed * 10, P = stager(t, dur), FLY = 0.45;
  const headH = 46, pad = 14;
  const px = x + pad, py = y + headH + 10, pw = w - 2 * pad, ph = h - headH - 10 - pad;
  const pcx = px + pw / 2, pcy = py + ph / 2;
  const cell = pw / 3, sz = cell * 0.5;
  // `hideMid` 0..1 fades the MIDDLE row of day squares out: a word written on the page must not tangle with the grid
  // (visual-qa 2026-11-02: "then" / "now" were written straight across the square outlines)
  const grid = (seedBase: number, p: number, rough = 0.5, hideMid = 0) =>
    Array.from({ length: 9 }).map((_, i) => {
      const cx = px + (i % 3) * cell + cell / 2, cy = py + 12 + Math.floor(i / 3) * ((ph - 24) / 3) + (ph - 24) / 6;
      const op = 0.55 * (i >= 3 && i <= 5 ? 1 - hideMid : 1);
      if (op <= 0.01) return null;
      return <Sketch key={i} pen={pen} seed={seedBase + i} shape={{ kind: 'rect', x: cx - sz / 2, y: cy - sz / 2, w: sz, h: sz }} stroke={pen.ink} strokeWidth={1.3} roughness={rough} opacity={op} progress={prog(p, i / 9, 0.12)} />;
    });
  const word = (txt: string, k: number) => (
    <g transform={`translate(${pcx} ${pcy}) scale(${k}) translate(${-pcx} ${-pcy})`}>
      <text x={pcx} y={pcy + labelSize * 0.34} fontFamily={`'${font}', cursive`} fontSize={labelSize} fill={labelColor ?? pen.colorH} textAnchor="middle" fontWeight="700">{txt}</text>
    </g>
  );
  // which label is on the face: the latest phase whose last page has flown, unless a later phase has begun tearing
  let label: string | null = null, labelK = 0;
  phases.forEach((ph2, i) => {
    const last = ph2.flips[ph2.flips.length - 1], done = last + FLY * 0.6;
    const next = phases[i + 1]?.flips[0];
    if (t >= done && (next === undefined || t < next)) { label = ph2.label; labelK = pop(prog(t, done, 0.3)); }
  });
  const mid = label ? Math.min(1, labelK * 1.6) : 0; // the middle row is gone by the time the word is at 60 percent of its pop
  return (
    <g>
      <Sketch pen={pen} seed={s + 1} shape={{ kind: 'path', d: rrect(x, y, w, h, 14) }} fill={pen.palette.grey} progress={P(0, 0.4)} />
      <Sketch pen={pen} seed={s + 2} shape={{ kind: 'line', x1: x, y1: y + headH, x2: x + w, y2: y + headH }} progress={P(0.35, 0.5)} />
      <Sketch pen={pen} seed={s + 3} shape={{ kind: 'line', x1: x + w * 0.3, y1: y - 18, x2: x + w * 0.3, y2: y + 16 }} strokeWidth={pen.inkWidth + 1.5} progress={P(0.45, 0.58)} />
      <Sketch pen={pen} seed={s + 4} shape={{ kind: 'line', x1: x + w * 0.7, y1: y - 18, x2: x + w * 0.7, y2: y + 16 }} strokeWidth={pen.inkWidth + 1.5} progress={P(0.5, 0.63)} />
      {/* the page that stays (the next page is always the same blank month) */}
      <Sketch pen={pen} seed={s + 5} shape={{ kind: 'rect', x: px, y: py, w: pw, h: ph }} fill={pen.light} roughness={0.7} progress={P(0.55, 0.78)} />
      {grid(s + 10, P(0.72, 1), 0.5, mid)}
      {label && word(label, labelK)}
      {/* the pages flying off, newest on top; the first page of a later phase carries the previous phase's word away with it */}
      {phases.map((ph2, i) => ph2.flips.map((f, k) => {
        const q = prog(t, f, FLY);
        if (q <= 0 || q >= 1) return null;
        const e = easeOut(q);
        const carries = k === 0 && i > 0 ? phases[i - 1].label : null;
        return (
          <g key={`${i}-${k}`} opacity={1 - q * q} transform={`translate(${ph2.dir * 300 * e} ${-340 * e}) rotate(${ph2.dir * 38 * e} ${pcx} ${pcy})`}>
            <Sketch pen={pen} seed={s + 40 + i * 5 + k} shape={{ kind: 'rect', x: px, y: py, w: pw, h: ph }} fill={pen.light} roughness={0.7} />
            {grid(s + 60 + (i * 5 + k) * 9, 1, 0.4, carries ? 1 : 0)}
            {carries && word(carries, 1)}
          </g>
        );
      }))}
    </g>
  );
};

/**
 * One bar rising from `baseline` to height `h` over `dur` (a clip reveal, so the hand-drawn outline never boils).
 * `innerH` + `innerT` add a DASHED inner bar of height `innerH` rising inside it (the real value inside the nominal
 * one) while the band above it greys out (the part the dollar lost). Gold by default (money).
 */
export const RiseBar: React.FC<{
  x: number; baseline: number; w: number; h: number; t: number; pen: Pen; seed: number; fill?: string; dur?: number;
  innerH?: number; innerT?: number; innerDur?: number; bandColor?: string;
}> = ({ x, baseline, w, h, t, pen, seed, fill, dur = 0.6, innerH = 0, innerT = -1, innerDur = 0.5, bandColor }) => {
  if (t <= 0) return null;
  const c = fill ?? pen.palette.gold, s = seed * 10;
  const p = easeOut(prog(t, 0, dur)), clipId = `rise-${seed}`;
  const q = innerT > 0 ? easeOut(prog(innerT, 0, innerDur)) : 0;
  const ix = x + 10, iw = w - 20, iTop = baseline - innerH * q;
  const clipIn = `risein-${seed}`;
  return (
    <g>
      <defs>
        <clipPath id={clipId}><rect x={x - 14} y={baseline - h * p - 14} width={w + 28} height={h * p + 16} /></clipPath>
        <clipPath id={clipIn}><rect x={ix - 8} y={iTop - 8} width={iw + 16} height={innerH * q + 10} /></clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'rect', x, y: baseline - h, w, h }} fill={c} />
      </g>
      {q > 0 && (
        <>
          {/* the band the dollar ate: between the nominal top and the real top */}
          <rect x={x + 3} y={baseline - h + 3} width={w - 6} height={Math.max(0, (h - innerH) * q - 2)} fill={bandColor ?? pen.palette.grey} opacity={0.7 * q} />
          <g clipPath={`url(#${clipIn})`}>
            <rect x={ix} y={baseline - innerH} width={iw} height={innerH} fill="none" stroke={pen.ink} strokeWidth={pen.inkWidth + 0.6} strokeDasharray="13 9" strokeLinecap="round" />
          </g>
        </>
      )}
    </g>
  );
};

/**
 * A banknote centred at (cx, cy): a 2.35:1 rectangle (green), an inset ornamental border, a central oval with a "$",
 * a seal on either side. `k` scales it about its centre (1 = full size; the scene shrinks it when prices rise) and
 * while k < 1 a GHOST of the full-size bill stays behind it (grey band + dashed outline, the same "what the dollar ate"
 * language as RiseBar's band), so a 1/1.2 shrink is visible on a still, not only in motion (visual-qa 2026-11-02).
 * Draws on over `dur`.
 */
export const Bill: React.FC<{ cx: number; cy: number; w?: number; h?: number; t: number; pen: Pen; seed: number; font: string; k?: number; color?: string; dur?: number; ghost?: boolean }> =
  ({ cx, cy, w = 280, h = 120, t, pen, seed, font, k = 1, color, dur = 0.7, ghost = true }) => {
    if (t <= 0) return null;
    const c = color ?? pen.palette.green, s = seed * 10, P = stager(t, dur);
    const x = cx - w / 2, y = cy - h / 2, inset = 11;
    const g = ghost && k < 0.999 ? Math.min(1, (1 - k) / 0.12) : 0; // fully in once the bill has lost ~12 percent of its size
    return (
      <g>
        {g > 0 && (
          <g opacity={g}>
            <rect x={x} y={y} width={w} height={h} fill={pen.palette.grey} opacity={0.6} />
            <rect x={x} y={y} width={w} height={h} fill="none" stroke={pen.ink} strokeWidth={pen.inkWidth} strokeDasharray="12 8" strokeLinecap="round" opacity={0.7} />
          </g>
        )}
        <g transform={`translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})`}>
          <Sketch pen={pen} seed={s + 1} shape={{ kind: 'rect', x, y, w, h }} fill={c} progress={P(0, 0.4)} />
          <Sketch pen={pen} seed={s + 2} shape={{ kind: 'path', d: rrect(x + inset, y + inset, w - 2 * inset, h - 2 * inset, 8) }} strokeWidth={1.4} roughness={0.6} progress={P(0.34, 0.6)} />
          <Sketch pen={pen} seed={s + 3} shape={{ kind: 'ellipse', cx, cy, rx: h * 0.3, ry: h * 0.38 }} fill={pen.light} roughness={0.6} progress={P(0.56, 0.76)} />
          {P(0.74, 0.86) > 0 && (
            <text x={cx} y={cy + h * 0.17} fontFamily={`'${font}', cursive`} fontSize={h * 0.5} fill={pen.ink} textAnchor="middle" fontWeight="700" opacity={P(0.74, 0.86)}>$</text>
          )}
          <Sketch pen={pen} seed={s + 4} shape={{ kind: 'circle', cx: x + 52, cy, r: h * 0.14 }} fill={pen.light} roughness={0.5} progress={P(0.8, 0.92)} />
          <Sketch pen={pen} seed={s + 5} shape={{ kind: 'circle', cx: x + w - 52, cy, r: h * 0.14 }} fill={pen.light} roughness={0.5} progress={P(0.88, 1)} />
        </g>
      </g>
    );
  };

/**
 * A speech bubble: a rounded rectangle with a wedge tail from its bottom-left toward `tail` (the speaker's mouth),
 * drawn as ONE outline; light fill. Children (the typed words) render inside once the outline is in.
 */
export const SpeechBubble: React.FC<{ x: number; y: number; w: number; h: number; tail: [number, number]; t: number; pen: Pen; seed: number; dur?: number; children?: React.ReactNode }> =
  ({ x, y, w, h, tail, t, pen, seed, dur = 0.5, children }) => {
    if (t <= 0) return null;
    const r = 22, tx0 = x + 40, tx1 = x + 78;
    const d =
      `M ${x + r} ${y} L ${x + w - r} ${y} Q ${x + w} ${y} ${x + w} ${y + r} L ${x + w} ${y + h - r} Q ${x + w} ${y + h} ${x + w - r} ${y + h} ` +
      `L ${tx1} ${y + h} L ${tail[0]} ${tail[1]} L ${tx0} ${y + h} L ${x + r} ${y + h} Q ${x} ${y + h} ${x} ${y + h - r} L ${x} ${y + r} Q ${x} ${y} ${x + r} ${y} Z`;
    const p = easeOut(prog(t, 0, dur));
    return (
      <g>
        <Sketch pen={pen} seed={seed} shape={{ kind: 'path', d }} fill={pen.light} progress={p} />
        {p >= 0.9 && children}
      </g>
    );
  };

/** a curved arrow (quadratic bezier p0 -> p2 bent by p1): the stroke draws, then its open head sketches at the tip */
export const CurvedArrow: React.FC<{ p0: [number, number]; p1: [number, number]; p2: [number, number]; p1b?: [number, number]; t: number; pen: Pen; seed: number; color?: string; dur?: number; strokeWidth?: number; head?: number; sequential?: boolean }> =
  ({ p0, p1, p2, p1b, t, pen, seed, color, dur = 0.6, strokeWidth, head = 30, sequential }) => {
    if (t <= 0) return null;
    const c = color ?? pen.ink, sw = strokeWidth ?? pen.inkWidth + 2;
    // `p1b` makes it a CUBIC (p1 = the first control point, p1b the second): a steep take-off and a steep landing on one
    // arrow (quant WB4: the credit arc leaves the lock straight up past a factory and drops onto a cheque); the head follows
    // the end tangent either way
    const cpEnd = p1b ?? p1;
    const ang = Math.atan2(p2[1] - cpEnd[1], p2[0] - cpEnd[0]);
    const d = p1b ? `M ${p0[0]} ${p0[1]} C ${p1[0]} ${p1[1]} ${p1b[0]} ${p1b[1]} ${p2[0]} ${p2[1]}` : `M ${p0[0]} ${p0[1]} Q ${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]}`;
    const hd = `M ${p2[0] - head * Math.cos(ang - 0.5)} ${p2[1] - head * Math.sin(ang - 0.5)} L ${p2[0]} ${p2[1]} L ${p2[0] - head * Math.cos(ang + 0.5)} ${p2[1] - head * Math.sin(ang + 0.5)}`;
    return (
      <g>
        <Sketch pen={pen} seed={seed} shape={{ kind: 'path', d }} stroke={c} strokeWidth={sw} progress={easeOut(prog(t, 0, dur * 0.8))} sequential={sequential} />
        <Sketch pen={pen} seed={seed + 1} shape={{ kind: 'path', d: hd }} stroke={c} strokeWidth={sw} progress={easeOut(prog(t, dur * 0.7, dur * 0.3))} />
      </g>
    );
  };

/**
 * A dog-eared sheet corner at the canvas corner (x, y) (bottom-right: x = W, y = H): the table shows through the
 * lifted corner (grey triangle), the flap is the mirrored triangle (cream, outlined) with its apex pulled a little
 * toward the page. Pops in over 0.4 s from the corner.
 */
export const CornerFold: React.FC<{ x: number; y: number; size?: number; t: number; pen: Pen; seed: number }> = ({ x, y, size = 190, t, pen, seed }) => {
  if (t <= 0) return null;
  const k = pop(prog(t, 0, 0.4)), s = seed * 10;
  const flap: [number, number][] = [[x - size, y], [x, y - size], [x - size + 16, y - size + 16]];
  return (
    <g transform={`translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})`}>
      <polygon points={`${x - size},${y} ${x},${y} ${x},${y - size}`} fill={pen.palette.grey} opacity={0.75} />
      <Sketch pen={pen} seed={s + 1} shape={{ kind: 'polygon', pts: flap }} fill={pen.floor ?? pen.light} roughness={0.8} />
    </g>
  );
};

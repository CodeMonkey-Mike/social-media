// whiteboard/deposits.tsx: the TOKENISED-DEPOSIT part of the hand-drawn vocabulary (added 2026-11-04 for the quant beat
// WB2, "the banks are turning those deposits digital ... walled gardens"): a paper deposit slip (a sheet with a folded
// corner, a "$" and ruled lines), a digital token glyph (a pointy-top hexagon with a concentric inner hexagon and a
// currency mark: the hexagon is the crypto / token shape, the paper's rectangle is what it replaces), a shield with a
// check (protections), a scalloped seal badge with a check (the regulator's stamp), a tag on a diagonal string (the
// rules a token carries), and a white picket fence RING around an island (a walled garden), split into a back half
// painted before the island's buildings and a front half painted after them so the ring reads in depth.
// Round 3 (2026-11-04, after visual-qa): the slip's marks are fractions of its sheet and finish by 0.8 dur; the token's "$"
// is r * 1.05 and the mark / inner ring may land on their own cues (`markT`, `ringT`); the tag's hole may sit top-right and
// the card may be tinted (`fill`); the fence rails draw as one pen stroke (`Sketch sequential`).
// Round 4 (2026-11-05, after visual-qa): `StringTag via` (a string that hangs down a post and then runs to the hole), `SealBadge
// checkK` (the check scaled for a small seal), `FenceRing railFrac` (the rails' heights) + `skipX` (no pickets behind a roof).
//
// Kit conventions (video-creation/whiteboard/whiteboard.md): every component takes the pen and a LOCAL time `t`
// (seconds since its cue; <= 0 = not yet) and draws itself on part by part over `dur` through Sketch progress; fixed
// seeds (no boil, identical across render workers); role colors from the pen's palette (gold = money, green = good /
// protected, red = the highlighted thing, grey = background); draw order = what hides what. Geometry was taken from
// the Lucide icon set's shapes (ISC: `shield-check` = a shield whose top edge dips to the two upper corners, straight
// sides to ~55 percent of the height, then curves meeting at a bottom point, a check inside; `badge-check` = a ring of
// convex scallops with a check; `file-text` = a sheet with its top-right corner folded and ruled lines; `hexagon`;
// `fence` = pointed pickets on two rails), then iterated on the beat's stills (no icon package is installed to crop).
import React from 'react';
import type { Pen } from './pen';
import { Sketch, prog, easeOut, pop } from './Sketch';
import { rrect } from './crypto';

/** stage helper: progress of stage a..b (fractions of `dur`) at local time `t` */
const stager = (t: number, dur: number) => (a: number, b: number) => prog(t, a * dur, (b - a) * dur);
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/**
 * A paper deposit slip centred (cx, cy), `w` x `h`: a white sheet with its top-right corner folded, a "$" at the top
 * left (the label font, bold), three ruled lines. Draws on sheet -> fold -> "$" -> lines over `dur`. `opacity` lets the
 * scene fade it when it turns digital.
 */
export const DepositSlip: React.FC<{ cx: number; cy: number; w?: number; h?: number; t: number; pen: Pen; seed: number; font?: string; dur?: number; opacity?: number }> =
  ({ cx, cy, w = 72, h = 92, t, pen, seed, font, dur = 0.5, opacity = 1 }) => {
    if (t <= 0 || opacity <= 0) return null;
    const s = seed * 10, P = stager(t, dur);
    const x0 = cx - w / 2, y0 = cy - h / 2, f = Math.round(h * 0.17);
    const sheet = `M ${x0} ${y0} L ${x0 + w - f} ${y0} L ${x0 + w} ${y0 + f} L ${x0 + w} ${y0 + h} L ${x0} ${y0 + h} Z`;
    const fold = `M ${x0 + w - f} ${y0} L ${x0 + w - f} ${y0 + f} L ${x0 + w} ${y0 + f}`;
    // the marks are placed as fractions of the sheet (visual-qa 2026-11-04: at h 80 the fixed offsets ran off the sheet)
    // and finish by 0.8 dur, so a slip cued 0.46 s before it turns digital is seen complete before it fades
    const markP = P(0.3, 0.42), mx = x0 + w * 0.28, my = y0 + h * 0.37, fs = Math.round(h * 0.3);
    return (
      <g opacity={opacity}>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'path', d: sheet }} fill={pen.light} progress={easeOut(P(0, 0.3))} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'path', d: fold }} strokeWidth={pen.inkWidth * 0.8} roughness={0.5} progress={P(0.26, 0.36)} />
        {markP > 0 && (
          <text x={mx} y={my} fontFamily={`'${font ?? pen.fontL}', cursive`} fontSize={fs} fontWeight={700} fill={pen.ink} textAnchor="middle" dominantBaseline="central" opacity={markP}>$</text>
        )}
        {[0, 1, 2].map((i) => {
          const ly = y0 + h * (0.6 + i * 0.14), x1 = x0 + w * 0.18, x2 = x0 + w * (i === 2 ? 0.6 : 0.82);
          return <Sketch key={i} pen={pen} seed={s + 10 + i} shape={{ kind: 'line', x1, y1: ly, x2, y2: ly }} strokeWidth={1.5} roughness={0.5} progress={P(0.4 + i * 0.13, 0.54 + i * 0.13)} />;
        })}
      </g>
    );
  };

/** the six corners of a pointy-top hexagon of circumradius `r` about (cx, cy) */
export const hexPts = (cx: number, cy: number, r: number): [number, number][] =>
  [0, 1, 2, 3, 4, 5].map((i) => { const a = -Math.PI / 2 + (i * Math.PI) / 3; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; });

/**
 * A digital token glyph: a pointy-top hexagon (gold = money) with a bold ink rim, a thin concentric inner hexagon and a
 * currency mark on its face (`mark`, the label font; '' for a small mark-less one written on a page). Pops in over `dur`
 * about its centre, the way the kit's coins do.
 */
export const HexToken: React.FC<{ cx: number; cy: number; r?: number; t: number; pen: Pen; seed: number; font?: string; mark?: string; color?: string; dur?: number; markT?: number; ringT?: number; markDx?: number; markDy?: number }> =
  ({ cx, cy, r = 36, t, pen, seed, font, mark = '$', color, dur = 0.35, markT, ringT, markDx = 0, markDy = 0 }) => {
    if (t <= 0) return null;
    const s = seed * 10, k = pop(prog(t, 0, dur));
    // the mark and the inner ring may land on their own cues (`markT`, `ringT`, local seconds; default = with the hexagon)
    const mT = markT ?? t, rT = ringT ?? t;
    const markOp = markT === undefined ? (k >= 1 ? 1 : k) : prog(mT, 0, 0.25);
    const ringP = ringT === undefined ? 1 : easeOut(prog(rT, 0, 0.3));
    // the mark is r * 1.05 (visual-qa 2026-11-04: at r * 1.3 the "$" crossed the inner hexagon); Kalam's "$" sits a
    // little up and right of its box centre, so the scene may nudge it with markDx / markDy (fractions of r, measured on a still)
    return (
      <g transform={`translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})`}>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'polygon', pts: hexPts(cx, cy, r) }} fill={color ?? pen.palette.gold} strokeWidth={pen.inkWidth + 1.2} roughness={0.35} />
        {r >= 16 && ringP > 0 && <Sketch pen={pen} seed={s + 2} shape={{ kind: 'polygon', pts: hexPts(cx, cy, r * 0.76) }} strokeWidth={pen.inkWidth * 0.6} roughness={0.2} progress={ringP} sequential />}
        {mark && markOp > 0 && (
          <text x={cx + markDx * r} y={cy + markDy * r} textAnchor="middle" dominantBaseline="central" fontFamily={`'${font ?? pen.fontL}', cursive`} fontWeight={700} fontSize={r * 1.05} fill={pen.ink} opacity={markOp}>{mark}</text>
        )}
      </g>
    );
  };

/**
 * A shield with a check centred (cx, cy), `w` x `h` (green = protected): the top edge dips from a centre peak to the two
 * upper corners, the sides run straight to ~55 percent of the height, then curve to meet at the bottom point. Draws on
 * outline (fill behind) -> check over `dur`.
 */
export const ShieldCheck: React.FC<{ cx: number; cy: number; w?: number; h?: number; t: number; pen: Pen; seed: number; color?: string; dur?: number }> =
  ({ cx, cy, w = 56, h = 64, t, pen, seed, color, dur = 0.6 }) => {
    if (t <= 0) return null;
    const s = seed * 10, P = stager(t, dur);
    const x0 = cx - w / 2, x1 = cx + w / 2, y0 = cy - h / 2, y1 = cy + h / 2, ym = y0 + h * 0.55;
    const d = `M ${x0} ${y0 + 7} Q ${cx} ${y0 - 3} ${x1} ${y0 + 7} L ${x1} ${ym} Q ${x1} ${y1 - 14} ${cx} ${y1} Q ${x0} ${y1 - 14} ${x0} ${ym} Z`;
    const check = `M ${cx - 11} ${cy - 1} L ${cx - 3} ${cy + 8} L ${cx + 12} ${cy - 9}`;
    return (
      <g>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'path', d }} fill={color ?? pen.palette.green} roughness={0.7} progress={easeOut(P(0, 0.62))} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'path', d: check }} strokeWidth={pen.inkWidth + 1.4} roughness={0.5} progress={easeOut(P(0.62, 1))} />
      </g>
    );
  };

/** a scalloped ring: `n` convex bumps of `bump` px around the circle (cx, cy, r) */
export const scallopD = (cx: number, cy: number, r: number, n = 12, bump = 5) => {
  let d = '';
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2, a1 = ((i + 1) / n) * Math.PI * 2, am = (a0 + a1) / 2;
    const p0 = [cx + Math.cos(a0) * r, cy + Math.sin(a0) * r], p1 = [cx + Math.cos(a1) * r, cy + Math.sin(a1) * r];
    const pm = [cx + Math.cos(am) * (r + bump * 2.2), cy + Math.sin(am) * (r + bump * 2.2)];
    d += (i === 0 ? `M ${p0[0].toFixed(1)} ${p0[1].toFixed(1)}` : '') + ` Q ${pm[0].toFixed(1)} ${pm[1].toFixed(1)} ${p1[0].toFixed(1)} ${p1[1].toFixed(1)}`;
  }
  return d + ' Z';
};

/**
 * A seal badge centred (cx, cy), scallop radius `r` (gold, the official stamp): a scalloped rosette, an inner ring, a
 * check. Draws on rosette -> ring -> check over `dur`.
 */
export const SealBadge: React.FC<{ cx: number; cy: number; r?: number; t: number; pen: Pen; seed: number; color?: string; dur?: number; checkK?: number }> =
  ({ cx, cy, r = 24, t, pen, seed, color, dur = 0.6, checkK = 1 }) => {
    if (t <= 0) return null;
    const s = seed * 10, P = stager(t, dur), k = checkK;
    // `checkK` (opt-in, default 1 = the shipped frames) scales the check for a small seal (quant WB2 round 4: at r 12 the +-9 px
    // check crossed the inner ring); the check is sized for r 24, so a beat passes ~r / 24
    const check = `M ${cx - 9 * k} ${cy} L ${cx - 2 * k} ${cy + 7 * k} L ${cx + 10 * k} ${cy - 7 * k}`;
    return (
      <g>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'path', d: scallopD(cx, cy, r) }} fill={color ?? pen.palette.gold} roughness={0.5} progress={easeOut(P(0, 0.55))} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'circle', cx, cy, r: r * 0.7 }} strokeWidth={pen.inkWidth * 0.7} roughness={0.4} progress={P(0.5, 0.7)} />
        <Sketch pen={pen} seed={s + 3} shape={{ kind: 'path', d: check }} strokeWidth={(pen.inkWidth + 1.2) * Math.max(0.6, k)} roughness={0.5} progress={easeOut(P(0.7, 1))} />
      </g>
    );
  };

/**
 * A tag on a diagonal string: the string runs from (x0, y0) (the thing it hangs on) to the tag's punched hole at the
 * top-left corner of a rounded white card (`x`, `top`, `w` x `h`); the scene writes inside it (children). Draws on
 * string -> card -> hole over `dur`. The string is painted AFTER the card so it runs over the card body into the hole
 * (a string that stops at the edge reads as glued on, the left-behind WB3 lesson); the hole is painted last.
 * `via` (opt-in; the shipped frames keep the straight string) bends the string through one point: it hangs straight down
 * from (x0, y0) to `via` (down a pedestal's face, behind a shield standing in front of it) and then runs to the hole, drawn
 * as one pen stroke (quant WB2 round 4: a straight string from the token to a tag on the lawn crossed the loop arrow's arc).
 */
export const StringTag: React.FC<{ x0: number; y0: number; x: number; top: number; w?: number; h?: number; t: number; pen: Pen; seed: number; dur?: number; hole?: 'tl' | 'tr'; fill?: string; via?: [number, number]; children?: React.ReactNode }> =
  ({ x0, y0, x, top, w = 250, h = 118, t, pen, seed, dur = 0.5, hole = 'tl', fill, via, children }) => {
    if (t <= 0) return null;
    const s = seed * 10, P = stager(t, dur);
    // the punched hole sits in the top-left corner, or the top-right (`hole`) when the thing it hangs on is to the right
    const hx = hole === 'tl' ? x + 18 : x + w - 18, hy = top + 18;
    return (
      <g>
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'path', d: rrect(x, top, w, h, 12) }} fill={fill ?? pen.light} progress={easeOut(P(0.3, 0.85))} />
        {via
          ? <Sketch pen={pen} seed={s + 1} shape={{ kind: 'path', d: `M ${x0} ${y0} L ${via[0]} ${via[1]} L ${hx} ${hy}` }} strokeWidth={pen.inkWidth * 0.8} roughness={0.6} progress={easeOut(P(0, 0.42))} sequential />
          : <Sketch pen={pen} seed={s + 1} shape={{ kind: 'line', x1: x0, y1: y0, x2: hx, y2: hy }} strokeWidth={pen.inkWidth * 0.8} roughness={0.6} progress={easeOut(P(0, 0.42))} />}
        <Sketch pen={pen} seed={s + 3} shape={{ kind: 'circle', cx: hx, cy: hy, r: 5.5 }} fill={pen.light} roughness={0.4} progress={P(0.82, 1)} />
        {P(0.85, 1) > 0 && children}
      </g>
    );
  };

/** parametric angles (degrees, screen clockwise from +x) of `n` points spaced EQUALLY ALONG THE ARC of the ellipse (rx, ry) between a0 and a1 */
export const ellipseArcAngles = (rx: number, ry: number, a0: number, a1: number, n: number) => {
  const N = 720, cum: number[] = [0];
  const rad = (d: number) => (d * Math.PI) / 180;
  for (let i = 1; i <= N; i++) {
    const t0 = rad(a0 + ((a1 - a0) * (i - 1)) / N), t1 = rad(a0 + ((a1 - a0) * i) / N);
    cum.push(cum[i - 1] + Math.hypot(rx * (Math.cos(t1) - Math.cos(t0)), ry * (Math.sin(t1) - Math.sin(t0))));
  }
  const total = cum[N], out: number[] = [];
  for (let k = 0; k < n; k++) {
    const target = ((k + 0.5) / n) * total;
    let i = 0;
    while (i < N && cum[i + 1] < target) i++;
    const f = (target - cum[i]) / Math.max(1e-6, cum[i + 1] - cum[i]);
    out.push(a0 + ((a1 - a0) * (i + f)) / N);
  }
  return { angles: out, length: total };
};

const ellPt = (cx: number, cy: number, rx: number, ry: number, deg: number): [number, number] => {
  const r = (deg * Math.PI) / 180;
  return [cx + rx * Math.cos(r), cy + ry * Math.sin(r)];
};

/**
 * HALF of a white picket fence standing in a ring on the ellipse (cx, cy, rx, ry) (a walled garden around an island):
 * `half` 'back' = the far half (angles 180 to 360, painted BEFORE the island's buildings so they hide it), 'front' = the
 * near half (0 to 180, painted after). Two rails along the ring and pointed pickets every `step` px of arc, `post` px
 * tall, both scaled by `scale` (the far islands). The ring draws on clockwise from the left: the back half over the
 * first half of `dur`, the front half over the second, the rails first and each picket popping as the rail reaches
 * it, so the two halves of one fence share one `t` and one `dur`.
 * `railFrac` = the two rails' heights as fractions of `post` (default [0.36, 0.72], the shipped frames; quant WB2 round 4 passes
 * [0.46, 0.77] so the lower rail sits ~2 px further off the land's outline, where visual-qa saw rail and shoreline merge into
 * one band). `skipX` = canvas x spans (unscaled) where NO picket stands: the back pickets behind a bank's roof otherwise poke
 * their tips above the roofline as stray nubs (visual-qa on quant WB2); the rails run through unbroken.
 */
export const FenceRing: React.FC<{ cx: number; cy: number; rx: number; ry: number; half: 'back' | 'front'; t: number; pen: Pen; seed: number; scale?: number; dur?: number; step?: number; post?: number; railFrac?: [number, number]; skipX?: [number, number][] }> =
  ({ cx, cy, rx, ry, half, t, pen, seed, scale = 1, dur = 0.8, step = 44, post = 28, railFrac = [0.36, 0.72], skipX = [] }) => {
    if (t <= 0) return null;
    const back = half === 'back';
    const p = easeOut(back ? prog(t, 0, dur * 0.5) : prog(t, dur * 0.5, dur * 0.5));
    if (p <= 0) return null;
    const s = seed * 10 + (back ? 0 : 500);
    const a0 = back ? 180 : 0, a1 = a0 + 180, am = a0 + 90;
    const hp = post * scale, hw = 3 * scale, sw = 1.3 * Math.sqrt(scale);
    const { length } = ellipseArcAngles(rx, ry, a0, a1, 1);
    const n = Math.max(4, Math.round(length / (step * scale)));
    const picks = ellipseArcAngles(rx, ry, a0, a1, n).angles;
    const rail = (off: number) => {
      const q0 = ellPt(cx, cy - off, rx, ry, a0), q1 = ellPt(cx, cy - off, rx, ry, am), q2 = ellPt(cx, cy - off, rx, ry, a1);
      return `M ${q0[0]} ${q0[1]} A ${rx} ${ry} 0 0 1 ${q1[0]} ${q1[1]} A ${rx} ${ry} 0 0 1 ${q2[0]} ${q2[1]}`;
    };
    return (
      <g>
        {/* `sequential`: each rail is two arcs = two rough sub-paths; without it Chrome drew both pieces at once and the second
            floated on its own mid draw-on (visual-qa on quant WB2, 2026-11-04) */}
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'path', d: rail(hp * railFrac[0]) }} strokeWidth={1.6 * Math.sqrt(scale)} roughness={0.6} progress={p} sequential />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'path', d: rail(hp * railFrac[1]) }} strokeWidth={1.6 * Math.sqrt(scale)} roughness={0.6} progress={p} sequential />
        {picks.map((a, i) => {
          const [bx, by] = ellPt(cx, cy, rx, ry, a);
          if (skipX.some(([a0x, a1x]) => bx >= a0x && bx <= a1x)) return null;
          const k = pop(clamp01((p - (i + 0.5) / n + 0.06) / 0.1));
          if (k <= 0) return null;
          const pts: [number, number][] = [[bx - hw, by], [bx - hw, by - hp + 4 * scale], [bx, by - hp], [bx + hw, by - hp + 4 * scale], [bx + hw, by]];
          return (
            <g key={i} transform={`translate(${bx} ${by}) scale(${k}) translate(${-bx} ${-by})`}>
              <Sketch pen={pen} seed={s + 10 + i} shape={{ kind: 'polygon', pts }} fill={pen.light} strokeWidth={sw} roughness={0.45} />
            </g>
          );
        })}
      </g>
    );
  };

// whiteboard/supply.tsx: the FIXED-SUPPLY part of the hand-drawn vocabulary (added 2026-11-05 for the quant beat WB13,
// "the supply is fixed, around 14.6 million, almost all of it already circulating"): a token coin (a round coin with a bold
// rim, an inner ring and an optional written mark; the protagonist in the pen's accent, the rest in the money tint), a
// plinth that RISES out of the floor under something (the chain a token lives on), a screw-top glass jar whose lid comes
// down and seals (a sealed supply), a paper label stuck on it (where the number is written), a prohibition sign over a
// "+" (nothing more can be added) and a peak line (a price that climbs to a top and falls away).
//
// Kit conventions (video-creation/whiteboard/whiteboard.md): every component takes the pen and a LOCAL time `t`
// (seconds since its cue; <= 0 = not yet) and draws itself on part by part over `dur` through Sketch progress; fixed
// seeds (no boil, identical across render workers); role colors from the pen's palette (gold = money, red = the
// highlighted thing, blue = machines / metal, grey = background); draw order = what hides what. Geometry was studied from
// references before drawing (a mason jar in side view: straight walls on rounded bottom corners, shoulders curving in to a
// shorter neck with two screw threads, a flat cap wider than the neck with a band at its foot, two vertical shine strokes
// inside the left wall; the Lucide icon set, ISC: `ban` = a circle with one diagonal from upper-left to lower-right,
// `plus` = two equal bars (drawn heavier than the slash so the two stay two glyphs), `coins` = a disc with a concentric inner ring; a museum plinth = a cap slab, a block, a base
// slab, each slab wider than the block; a price chart's all-time high = a line that climbs steeply to a peak and falls
// away less far), then iterated on the beat's stills.
import React from 'react';
import type { Pen } from './pen';
import { Sketch, prog, easeOut, pop } from './Sketch';
import { Shadow } from './vocab';
import { rrect } from './crypto';

/** stage helper: progress of stage a..b (fractions of `dur`) at local time `t` */
const stager = (t: number, dur: number) => (a: number, b: number) => prog(t, a * dur, (b - a) * dur);

/**
 * A token coin centred (cx, cy), radius `r`: a disc (`color`, gold = money by default), a bold ink rim, a thin concentric
 * inner ring, and an optional `mark` written on its face (the label font, bold, `markColor`, `markSize`; default r * 0.6
 * so three caps clear the inner ring by ~8 px each side: at 0.7 the T's bar ran into the ring, quant WB13 visual-qa
 * 2026-11-05; `markDx` nudges the mark, Kalam's "QNT" sits ~3 px right of its anchor). Pops in over `dur` about its
 * centre; `drop` (px) lets it land from above. `held`: a hand (the pen's light disc) is drawn OVER the coin's bottom rim
 * with two fingers curling up its face once it has landed, so a coin in a figure's reach reads as received, not as a
 * paddle held out (the same lollipop read as quant WB1's unmarked disc). No sparkle, no legs: a plain coin that reads
 * as a coin next to a marked one; the small coins carry a one-letter mark when they stand alone.
 */
export const TokenCoin: React.FC<{ cx: number; cy: number; r?: number; t: number; pen: Pen; seed: number; color?: string; mark?: string; font?: string; markColor?: string; markSize?: number; markDx?: number; drop?: number; dur?: number; held?: boolean; ghost?: boolean }> =
  ({ cx, cy, r = 40, t, pen, seed, color, mark, font, markColor, markSize, markDx = 0, drop = 0, dur = 0.35, held = false, ghost = false }) => {
    if (t <= 0) return null;
    const s = seed * 10, k = pop(prog(t, 0, dur)), dy = -drop * (1 - easeOut(prog(t, 0, 0.3)));
    const op = k >= 1 ? 1 : k;
    if (ghost) {
      // a coin that does not exist yet (quant WB8, the second pipe): a pale fill (`color`, the pen's gold tint) at full opacity,
      // a DASHED plain rim (the dashed-pipe language), the mark in `markColor` (the ink) at full opacity. A whole-coin group
      // opacity put a white mark on a pale fill at 1.7:1 (visual-qa 2026-11-05); the ghost keeps the mark readable (~6.8:1).
      const C = 2 * Math.PI * r, per = C / Math.round(C / 20), sw = pen.inkWidth + 0.6, ms = markSize ?? r * 0.6;
      return (
        <g transform={`translate(0 ${dy}) translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})`}>
          <circle cx={cx} cy={cy} r={r} fill={color ?? pen.palette.gold} stroke="none" />
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={pen.ink} strokeWidth={sw} strokeDasharray={`${per * 0.56} ${per * 0.44}`} strokeLinecap="round" opacity={0.85} />
          {mark && (
            <text x={cx + markDx} y={cy} textAnchor="middle" dominantBaseline="central" fontFamily={`'${font ?? pen.fontL}', cursive`} fontWeight={700} fontSize={ms} fill={markColor ?? pen.ink} letterSpacing={ms * 0.04} opacity={op}>{mark}</text>
          )}
        </g>
      );
    }
    return (
      <g transform={`translate(0 ${dy}) translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})`}>
        {/* a plain disc + a thin plain ring under the rough one: where the rim stroke closes it leaves a 2 px gap that showed as a
            light speck on the hero coin's top (round-1 / round-2 stills); the ring sits inside the rough stroke's width */}
        {pen.fillStyle !== 'none' && <circle cx={cx} cy={cy} r={r} fill={color ?? pen.palette.gold} stroke={pen.ink} strokeWidth={1.6} />}
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'circle', cx, cy, r }} fill={color ?? pen.palette.gold} strokeWidth={pen.inkWidth + (r >= 40 ? 1.6 : 1.0)} roughness={0.4} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'circle', cx, cy, r: r * 0.78 }} strokeWidth={pen.inkWidth * 0.65} roughness={0.25} />
        {mark && (
          <text x={cx + markDx} y={cy} textAnchor="middle" dominantBaseline="central" fontFamily={`'${font ?? pen.fontL}', cursive`} fontWeight={700} fontSize={markSize ?? r * 0.6} fill={markColor ?? pen.ink} letterSpacing={(markSize ?? r * 0.6) * 0.04} opacity={op}>{mark}</text>
        )}
        {held && dy > -1 && (
          <g opacity={op}>
            {/* the hand over the bottom rim, two fingers up the face: drawn after the coin so the coin is visibly in the hand */}
            <Sketch pen={pen} seed={s + 3} shape={{ kind: 'circle', cx, cy: cy + r * 1.05, r: r * 0.42 }} fill={pen.light} roughness={0.5} />
            <Sketch pen={pen} seed={s + 4} shape={{ kind: 'path', d: `M ${cx - r * 0.42} ${cy + r * 0.9} Q ${cx - r * 0.5} ${cy + r * 0.45} ${cx - r * 0.3} ${cy + r * 0.25}` }} strokeWidth={pen.inkWidth * 0.9} roughness={0.4} />
            <Sketch pen={pen} seed={s + 5} shape={{ kind: 'path', d: `M ${cx + r * 0.38} ${cy + r * 0.92} Q ${cx + r * 0.5} ${cy + r * 0.5} ${cx + r * 0.32} ${cy + r * 0.3}` }} strokeWidth={pen.inkWidth * 0.9} roughness={0.4} />
          </g>
        )}
      </g>
    );
  };

/** geometry of a Plinth: its cap top (where the thing it carries stands) and the face box (where a mark is drawn) */
export const plinthGeom = (x: number, gy: number, w = 180, h = 190, capH = 22, baseH = 16) => ({
  top: gy - h, capH, faceX: x - w / 2, faceY: gy - h + capH, faceW: w, faceH: h - capH - baseH, baseY: gy - baseH,
});

/**
 * A plinth standing on (x, gy) (x = its centre), `w` wide, `h` tall: a cap slab (grey, wider than the block), a white
 * block, a base slab. It RISES OUT OF THE FLOOR: `rise` 0..1 lifts the whole plinth up through a clip at the floor line,
 * cap first (the hand-drawn outline never boils; round 1's bottom-up reveal in place showed an open, cap-less box
 * mid-rise), so the scene lifts whatever stands on it by `h * rise`. Children (a mark on its face) ride up with it.
 */
export const Plinth: React.FC<{ x: number; gy: number; w?: number; h?: number; capH?: number; baseH?: number; rise: number; pen: Pen; seed: number; children?: React.ReactNode }> =
  ({ x, gy, w = 180, h = 190, capH = 22, baseH = 16, rise, pen, seed, children }) => {
    if (rise <= 0) return null;
    const s = seed * 10, g = plinthGeom(x, gy, w, h, capH, baseH), clipId = `plinth-${seed}`;
    const dy = h * (1 - Math.max(0, Math.min(1, rise)));
    return (
      <g>
        <defs><clipPath id={clipId}><rect x={x - w / 2 - 40} y={gy - h - 60} width={w + 80} height={h + 60} /></clipPath></defs>
        <g clipPath={`url(#${clipId})`}>
          <g transform={`translate(0 ${dy})`}>
            <Sketch pen={pen} seed={s + 1} shape={{ kind: 'rect', x: g.faceX, y: g.faceY, w, h: g.faceH }} fill={pen.light} />
            <Sketch pen={pen} seed={s + 2} shape={{ kind: 'path', d: rrect(x - w / 2 - 12, g.baseY, w + 24, baseH, 3) }} fill={pen.palette.grey} roughness={0.7} />
            <Sketch pen={pen} seed={s + 3} shape={{ kind: 'path', d: rrect(x - w / 2 - 16, g.top, w + 32, capH, 4) }} fill={pen.palette.grey} roughness={0.7} />
            {children}
          </g>
        </g>
      </g>
    );
  };

/** geometry of a Jar (shared with the scene so a label, a lid ornament, a lock can be placed on it) */
export const jarGeom = (cx: number, baseY: number, w = 280, h = 360) => {
  const hw = w / 2, rimY = baseY - h, neckHW = hw * 0.78, neckY = rimY + 28, shoulderY = rimY + 78, cornerR = 26;
  const lidX = cx - neckHW - 14, lidW = 2 * neckHW + 28, lidH = 40, lidY = rimY - 30;   // the cap sits over the rim, 10 px down the neck
  return { hw, rimY, neckHW, neckY, shoulderY, cornerR, lidX, lidY, lidW, lidH, lidTop: lidY, left: cx - hw, right: cx + hw };
};

/**
 * A screw-top glass jar standing on (cx, baseY), `w` x `h`: straight walls on rounded bottom corners, shoulders curving in
 * to a short neck with two thread lines, the mouth a line across the rim. Draws on as ONE pen stroke (Sketch `sequential`)
 * from the rim's left down the left wall, along the bottom and up the right (the glass backing fades in behind it, two
 * shine strokes inside the left wall last). Children (what is INSIDE the jar) are painted between the backing and the
 * outline, so they read as behind the glass. `lidT` (local seconds) brings the LID down: a grey cap wider than the neck
 * with a band at its foot, drawn 46 px above the mouth and settling onto it over 0.5 s (the seal).
 */
export const Jar: React.FC<{ cx: number; baseY: number; w?: number; h?: number; t: number; lidT?: number; pen: Pen; seed: number; dur?: number; children?: React.ReactNode }> =
  ({ cx, baseY, w = 280, h = 360, t, lidT = -1, pen, seed, dur = 0.8, children }) => {
    if (t <= 0) return null;
    const s = seed * 10, P = stager(t, dur), g = jarGeom(cx, baseY, w, h);
    const L = cx - g.hw, R = cx + g.hw, nl = cx - g.neckHW, nr = cx + g.neckHW, r = g.cornerR;
    const body =
      `M ${nl} ${g.rimY} L ${nl} ${g.neckY} Q ${L} ${g.neckY + 12} ${L} ${g.shoulderY} L ${L} ${baseY - r} ` +
      `Q ${L} ${baseY} ${L + r} ${baseY} L ${R - r} ${baseY} Q ${R} ${baseY} ${R} ${baseY - r} ` +
      `L ${R} ${g.shoulderY} Q ${R} ${g.neckY + 12} ${nr} ${g.neckY} L ${nr} ${g.rimY} L ${nl} ${g.rimY}`;
    const outline = easeOut(P(0, 0.75)), backing = Math.max(0, (outline - 0.5) / 0.5);
    // the lid: drawn above the mouth, then settles down onto it
    const lidP = lidT > 0 ? easeOut(prog(lidT, 0, 0.5)) : 0, lidDy = -46 * (1 - lidP);
    return (
      <g>
        <Shadow cx={cx} cy={baseY + 5} rx={g.hw * 1.08} ry={9} t={t} dark={pen.bg !== '#ffffff' && pen.floor === null} />
        {backing > 0 && <path d={`${body} Z`} fill={pen.light} stroke="none" opacity={backing} />}
        {children}
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'path', d: body }} progress={outline} sequential />
        {/* two screw threads on the neck */}
        {[0, 1].map((i) => (
          <Sketch key={i} pen={pen} seed={s + 2 + i} shape={{ kind: 'line', x1: nl + 4, y1: g.rimY + 10 + i * 9, x2: nr - 4, y2: g.rimY + 10 + i * 9 }} strokeWidth={1.4} roughness={0.5} opacity={0.8} progress={P(0.7 + i * 0.06, 0.8 + i * 0.06)} />
        ))}
        {/* the glass shine: two vertical strokes inside the left wall */}
        <Sketch pen={pen} seed={s + 4} shape={{ kind: 'line', x1: L + 22, y1: g.shoulderY + 34, x2: L + 22, y2: g.shoulderY + 124 }} strokeWidth={1.8} roughness={0.5} opacity={0.45} progress={P(0.8, 0.92)} />
        <Sketch pen={pen} seed={s + 5} shape={{ kind: 'line', x1: L + 22, y1: g.shoulderY + 144, x2: L + 22, y2: g.shoulderY + 184 }} strokeWidth={1.8} roughness={0.5} opacity={0.45} progress={P(0.88, 1)} />
        {lidT > 0 && (
          <g transform={`translate(0 ${lidDy})`}>
            <Sketch pen={pen} seed={s + 6} shape={{ kind: 'path', d: rrect(g.lidX, g.lidY, g.lidW, g.lidH, 7) }} fill={pen.palette.grey} progress={easeOut(prog(lidT, 0, 0.35))} />
            <Sketch pen={pen} seed={s + 7} shape={{ kind: 'line', x1: g.lidX, y1: g.lidY + g.lidH - 12, x2: g.lidX + g.lidW, y2: g.lidY + g.lidH - 12 }} roughness={0.5} progress={prog(lidT, 0.25, 0.2)} />
          </g>
        )}
      </g>
    );
  };

/** a paper label (a white rounded rectangle stuck on something) at (x, y), `w` x `h`; the scene writes on it */
export const PaperLabel: React.FC<{ x: number; y: number; w: number; h: number; t: number; pen: Pen; seed: number; dur?: number }> =
  ({ x, y, w, h, t, pen, seed, dur = 0.35 }) => {
    if (t <= 0) return null;
    return <Sketch pen={pen} seed={seed} shape={{ kind: 'path', d: rrect(x, y, w, h, 8) }} fill={pen.light} roughness={0.6} progress={easeOut(prog(t, 0, dur))} />;
  };

/**
 * A "+" at (cx, cy) with a prohibition sign over it: the plus draws on `t` (0.3 s), HEAVY (its arms 0.6 r long, the pen's
 * width + 5); from `banT` a circle of radius `r` draws round it as one stroke and a THIN diagonal from upper-left to
 * lower-right crosses it, stopping at the circle's inner edge (the Lucide `ban` pose). The weights differ on purpose:
 * at one weight the three strokes merged into a six-armed asterisk and the plus was lost (quant WB13, visual-qa
 * 2026-11-05); the thin slash over the heavy plus reads as "a plus, struck". Ink by default (`color`).
 */
export const NoPlus: React.FC<{ cx: number; cy: number; r?: number; t: number; banT?: number; pen: Pen; seed: number; color?: string }> =
  ({ cx, cy, r = 55, t, banT = -1, pen, seed, color }) => {
    if (t <= 0) return null;
    const s = seed * 10, c = color ?? pen.ink, a = r * 0.6, ringW = pen.inkWidth + 2.2, d = (r - ringW * 1.3) * 0.707;
    const plusW = pen.inkWidth + 5, slashW = pen.inkWidth + 0.6;
    const plusP = easeOut(prog(t, 0, 0.3));
    return (
      <g>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'line', x1: cx - a, y1: cy, x2: cx + a, y2: cy }} stroke={c} strokeWidth={plusW} roughness={0.5} progress={plusP} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'line', x1: cx, y1: cy - a, x2: cx, y2: cy + a }} stroke={c} strokeWidth={plusW} roughness={0.5} progress={easeOut(prog(t, 0.1, 0.3))} />
        {banT > 0 && (
          <>
            <Sketch pen={pen} seed={s + 3} shape={{ kind: 'circle', cx, cy, r }} stroke={c} strokeWidth={ringW} roughness={0.6} progress={easeOut(prog(banT, 0, 0.35))} sequential />
            <Sketch pen={pen} seed={s + 4} shape={{ kind: 'line', x1: cx - d, y1: cy - d, x2: cx + d, y2: cy + d }} stroke={c} strokeWidth={slashW} roughness={0.4} progress={easeOut(prog(banT, 0.3, 0.25))} />
          </>
        )}
      </g>
    );
  };

/**
 * A peak line: climbs from (x0, y0) to the peak (px, py) and falls away to (x1, y1). Default = two cubic bows (`climb` /
 * `fall` override their control points). `pts` = a JAGGED polyline through every point instead (a price chart's
 * all-time high: short dips on the way up, lower highs on the way down): two smooth bows joined to a pole read as an
 * onion-dome tent over the figures under them (quant WB13, visual-qa 2026-11-05), the kinks make it a chart. Drawn on
 * along its length as one pen stroke over `dur` (Sketch `sequential`, piece by piece). Ink by default.
 */
export const PeakLine: React.FC<{ x0: number; y0: number; px: number; py: number; x1: number; y1: number; t: number; pen: Pen; seed: number; color?: string; dur?: number; strokeWidth?: number; climb?: [[number, number], [number, number]]; fall?: [[number, number], [number, number]]; pts?: [number, number][] }> =
  ({ x0, y0, px, py, x1, y1, t, pen, seed, color, dur = 1.2, strokeWidth, climb, fall, pts }) => {
    if (t <= 0) return null;
    const c = color ?? pen.ink, sw = strokeWidth ?? pen.inkWidth + 1.4;
    const [c1, c2] = climb ?? [[x0 + (px - x0) * 0.35, y0 - (y0 - py) * 0.05], [x0 + (px - x0) * 0.68, y0 - (y0 - py) * 0.45]];
    const [f1, f2] = fall ?? [[px + (x1 - px) * 0.28, py + (y1 - py) * 0.42], [px + (x1 - px) * 0.62, py + (y1 - py) * 0.82]];
    const d = pts
      ? pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ')
      : `M ${x0} ${y0} C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${px} ${py} C ${f1[0]} ${f1[1]}, ${f2[0]} ${f2[1]}, ${x1} ${y1}`;
    return <Sketch pen={pen} seed={seed} shape={{ kind: 'path', d }} stroke={c} strokeWidth={sw} roughness={pts ? 0.6 : 0.8} progress={easeOut(prog(t, 0, dur))} sequential />;
  };

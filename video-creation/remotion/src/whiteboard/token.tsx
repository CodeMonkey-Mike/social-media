// whiteboard/token.tsx: the TOKEN-UTILITY part of the hand-drawn vocabulary (added 2026-11-05 for the quant beat WB8,
// "you pay a licence fee ... payable in QNT ... through a treasury contract to Quant ... whether the second pipe ever gets
// built"): a side table (a slab on two legs, what a laptop stands on), an open laptop with a code glyph on its screen (a
// developer's machine), a software box (a rounded window with a title bar and three dots: a product, the scene writes its
// name), a paper slip that slides out of something (a fee slip, the scene writes on it), a PIPE (a flanged tube with flow
// chevrons, solid when it is built, DASHED when it is not: the beat's "pipe"), a ballot box (a box with a slot and a ticked
// paper going in: governance), a DRAWN question mark (a hook and a dot, so it never depends on a hand font's glyph) and a
// tall rounded band (the destination column the scene writes "Quant" in: the kit's LayerBand is a horizontal pill whose
// corner radius is half its height, which breaks on a tall shape).
//
// Kit conventions (video-creation/whiteboard/whiteboard.md): every component takes the pen and a LOCAL time `t`
// (seconds since its cue; <= 0 = not yet) and draws itself on part by part over `dur` through Sketch progress; fixed
// seeds (no boil, identical across render workers); role colors from the pen's palette (gold = money, red = the
// highlighted / hot thing, blue = machines, green = good, grey = background, brown = wood); draw order = what hides what.
// Geometry was studied from references before drawing (the Lucide icon set, ISC: `laptop` = a rounded screen over a base
// line that is WIDER than the screen; `code` = two chevrons; `vote` = a ticked sheet standing in a slot over a box; a
// flanged pipe = a tube with a raised collar at each joint, the collar taller than the tube; a question mark = a hook that
// opens to the left, a short stem, a dot under it), then iterated on the beat's stills.
import React from 'react';
import type { Pen } from './pen';
import { Sketch, prog, easeOut, pop } from './Sketch';
import { rrect } from './crypto';

/** stage helper: progress of stage a..b (fractions of `dur`) at local time `t` */
const stager = (t: number, dur: number) => (a: number, b: number) => prog(t, a * dur, (b - a) * dur);

/** geometry of a SideTable: the slab's top (where a thing stands) */
export const sideTableGeom = (x: number, gy: number, w = 170, h = 140, slab = 14) => ({ top: gy - h, slabBottom: gy - h + slab, x0: x, x1: x + w });

/** a small side table standing on (x, gy): two legs, then a wooden slab over them (`w` x `h`, the slab `slab` thick) */
export const SideTable: React.FC<{ x: number; gy: number; w?: number; h?: number; slab?: number; t: number; pen: Pen; seed: number; dur?: number }> =
  ({ x, gy, w = 170, h = 140, slab = 14, t, pen, seed, dur = 0.4 }) => {
    if (t <= 0) return null;
    const s = seed * 10, P = stager(t, dur), g = sideTableGeom(x, gy, w, h, slab);
    return (
      <g>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'line', x1: x + 14, y1: g.slabBottom, x2: x + 14, y2: gy }} strokeWidth={pen.inkWidth + 1.6} progress={P(0, 0.4)} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'line', x1: x + w - 14, y1: g.slabBottom, x2: x + w - 14, y2: gy }} strokeWidth={pen.inkWidth + 1.6} progress={P(0.15, 0.55)} />
        <Sketch pen={pen} seed={s + 3} shape={{ kind: 'rect', x, y: g.top, w, h: slab }} fill={pen.palette.brown} progress={easeOut(P(0.4, 1))} />
      </g>
    );
  };

/**
 * An open laptop standing on `baseY` (its base's bottom), centred on `cx`, `w` wide: a thin base (the keyboard deck, a
 * touchpad line on it), a screen rising from the base's back (narrower than the base, the Lucide `laptop` proportion), an
 * inner screen inset, and a `</>` code glyph on the screen (a developer's machine). Blue (machines) by default. Draws base
 * -> screen -> inset -> glyph over `dur`.
 */
export const Laptop: React.FC<{ cx: number; baseY: number; w?: number; screenH?: number; t: number; pen: Pen; seed: number; color?: string; dur?: number; code?: boolean }> =
  ({ cx, baseY, w = 150, screenH = 92, t, pen, seed, color, dur = 0.6, code = true }) => {
    if (t <= 0) return null;
    const s = seed * 10, P = stager(t, dur), c = color ?? pen.palette.blue;
    const baseH = 12, by = baseY - baseH;
    const sw = w * 0.84, sx = cx - sw / 2, sy = by - screenH;
    const ix = sx + 8, iy = sy + 7, iw = sw - 16, ih = screenH - 14;
    const gx = cx, gy = iy + ih / 2, a = 11;
    return (
      <g>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'path', d: rrect(cx - w / 2, by, w, baseH, 4) }} fill={pen.palette.grey} progress={easeOut(P(0, 0.3))} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'line', x1: cx - 16, y1: by + baseH / 2, x2: cx + 16, y2: by + baseH / 2 }} strokeWidth={1.4} roughness={0.4} progress={P(0.26, 0.34)} />
        <Sketch pen={pen} seed={s + 3} shape={{ kind: 'path', d: rrect(sx, sy, sw, screenH, 7) }} fill={c} progress={easeOut(P(0.3, 0.68))} />
        <Sketch pen={pen} seed={s + 4} shape={{ kind: 'path', d: rrect(ix, iy, iw, ih, 3) }} fill={pen.light} strokeWidth={1.3} roughness={0.4} progress={P(0.62, 0.8)} />
        {code && (
          <>
            <Sketch pen={pen} seed={s + 5} shape={{ kind: 'path', d: `M ${gx - 14} ${gy - a} L ${gx - 26} ${gy} L ${gx - 14} ${gy + a}` }} strokeWidth={pen.inkWidth} roughness={0.5} progress={P(0.78, 0.88)} />
            <Sketch pen={pen} seed={s + 6} shape={{ kind: 'line', x1: gx + 5, y1: gy - a - 2, x2: gx - 5, y2: gy + a + 2 }} strokeWidth={pen.inkWidth} roughness={0.5} progress={P(0.84, 0.92)} />
            <Sketch pen={pen} seed={s + 7} shape={{ kind: 'path', d: `M ${gx + 14} ${gy - a} L ${gx + 26} ${gy} L ${gx + 14} ${gy + a}` }} strokeWidth={pen.inkWidth} roughness={0.5} progress={P(0.88, 1)} />
          </>
        )}
      </g>
    );
  };

/**
 * A software box (a product): a rounded window (`x`, `y` top-left, `w` x `h`), a title bar rule across it under the top
 * edge with three small dots at its left, the body below the bar (where the scene writes the product's name; children
 * render once the outline is in). Blue (machines) by default. Draws window -> bar -> dots over `dur`.
 */
export const SoftBox: React.FC<{ x: number; y: number; w?: number; h?: number; t: number; pen: Pen; seed: number; color?: string; dur?: number; children?: React.ReactNode }> =
  ({ x, y, w = 260, h = 120, t, pen, seed, color, dur = 0.6, children }) => {
    if (t <= 0) return null;
    const s = seed * 10, P = stager(t, dur), c = color ?? pen.palette.blue, barY = y + 28;
    return (
      <g>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'path', d: rrect(x, y, w, h, 14) }} fill={c} progress={easeOut(P(0, 0.62))} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'line', x1: x, y1: barY, x2: x + w, y2: barY }} strokeWidth={pen.inkWidth * 0.8} roughness={0.6} progress={P(0.58, 0.76)} />
        {[0, 1, 2].map((i) => P(0.74 + i * 0.05, 0.8 + i * 0.05) > 0 && <circle key={i} cx={x + 18 + i * 14} cy={y + 14} r={3.6} fill={pen.dark} opacity={P(0.74 + i * 0.05, 0.8 + i * 0.05)} />)}
        {P(0.85, 1) > 0 && children}
      </g>
    );
  };

/**
 * A paper slip centred (cx, cy) once it has arrived (`w` x `h`): a light sheet with a short rule near its bottom. It SLIDES
 * from `fromX` (its centre's start, e.g. inside the thing it comes out of) to `cx` over `dur`, so paint it BEFORE that thing
 * and the thing's fill hides the part still inside. `k` scales it about its centre and `opacity` fades it (the scene turns
 * it into something else). Children (what is written on it) render once it has arrived.
 */
export const Slip: React.FC<{ cx: number; cy: number; w?: number; h?: number; fromX?: number; t: number; pen: Pen; seed: number; dur?: number; k?: number; opacity?: number; children?: React.ReactNode }> =
  ({ cx, cy, w = 140, h = 72, fromX, t, pen, seed, dur = 0.5, k = 1, opacity = 1, children }) => {
    if (t <= 0 || opacity <= 0) return null;
    const s = seed * 10, p = easeOut(prog(t, 0, dur)), x0 = fromX ?? cx;
    const x = x0 + (cx - x0) * p;
    return (
      <g opacity={opacity} transform={`translate(${x} ${cy}) scale(${k}) translate(${-cx} ${-cy})`}>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'rect', x: cx - w / 2, y: cy - h / 2, w, h }} fill={pen.light} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'line', x1: cx - w / 2 + 14, y1: cy + h / 2 - 12, x2: cx + w / 2 - 14, y2: cy + h / 2 - 12 }} strokeWidth={1.4} roughness={0.5} opacity={0.8} progress={prog(t, dur * 0.8, dur * 0.3)} />
        {p >= 1 && children}
      </g>
    );
  };

/**
 * A PIPE from (x1, y1) to (x2, y2): a tube `thick` px across with a raised collar (flange) at each end (`flanges`), small
 * flow chevrons inside it pointing along its direction, revealed along its length over `dur` (a clip sweep, so the
 * hand-drawn outline never boils). `dashed` draws it as a dashed outline with no fill and no chevrons: a pipe that is not
 * built. Blue (machines) by default; `opacity` for a faint one.
 */
export const Pipe: React.FC<{
  x1: number; y1: number; x2: number; y2: number; t: number; pen: Pen; seed: number; thick?: number; color?: string; dur?: number;
  dashed?: boolean; flanges?: 'both' | 'start' | 'end' | 'none'; chevrons?: number; opacity?: number;
}> = ({ x1, y1, x2, y2, t, pen, seed, thick = 30, color, dur = 0.5, dashed = false, flanges = 'both', chevrons = 2, opacity = 1 }) => {
  if (t <= 0) return null;
  const s = seed * 10, c = color ?? pen.palette.blue;
  const L = Math.hypot(x2 - x1, y2 - y1), deg = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  const p = easeOut(prog(t, 0, dur)), hs = thick / 2, fw = 12, fh = thick + 16;
  const clipId = `pipe-${seed}`;
  const hasStart = flanges === 'both' || flanges === 'start', hasEnd = flanges === 'both' || flanges === 'end';
  const bx0 = hasStart ? fw : 0, bx1 = hasEnd ? L - fw : L;
  const sw = pen.inkWidth + 0.6;
  return (
    <g opacity={opacity} transform={`translate(${x1} ${y1}) rotate(${deg})`}>
      <defs>
        <clipPath id={clipId}><rect x={-fw - 6} y={-fh} width={(L + 2 * fw + 12) * p} height={2 * fh} /></clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        {dashed ? (
          <>
            <line x1={bx0} y1={-hs} x2={bx1} y2={-hs} stroke={pen.ink} strokeWidth={sw} strokeDasharray="13 11" strokeLinecap="round" />
            <line x1={bx0} y1={hs} x2={bx1} y2={hs} stroke={pen.ink} strokeWidth={sw} strokeDasharray="13 11" strokeLinecap="round" />
            {hasStart && <rect x={0} y={-fh / 2} width={fw} height={fh} fill="none" stroke={pen.ink} strokeWidth={sw} strokeDasharray="9 7" strokeLinecap="round" rx={2} />}
            {hasEnd && <rect x={L - fw} y={-fh / 2} width={fw} height={fh} fill="none" stroke={pen.ink} strokeWidth={sw} strokeDasharray="9 7" strokeLinecap="round" rx={2} />}
          </>
        ) : (
          <>
            <Sketch pen={pen} seed={s + 1} shape={{ kind: 'rect', x: bx0, y: -hs, w: bx1 - bx0, h: thick }} fill={c} strokeWidth={sw} />
            {hasStart && <Sketch pen={pen} seed={s + 2} shape={{ kind: 'rect', x: 0, y: -fh / 2, w: fw, h: fh }} fill={pen.palette.grey} strokeWidth={sw} roughness={0.7} />}
            {hasEnd && <Sketch pen={pen} seed={s + 3} shape={{ kind: 'rect', x: L - fw, y: -fh / 2, w: fw, h: fh }} fill={pen.palette.grey} strokeWidth={sw} roughness={0.7} />}
            {Array.from({ length: chevrons }).map((_, i) => {
              const cx = bx0 + ((i + 1) * (bx1 - bx0)) / (chevrons + 1), a = hs * 0.5;
              return <Sketch key={i} pen={pen} seed={s + 10 + i} shape={{ kind: 'path', d: `M ${cx - a} ${-a} L ${cx + a * 0.6} 0 L ${cx - a} ${a}` }} strokeWidth={pen.inkWidth * 0.8} roughness={0.5} opacity={0.75} />;
            })}
          </>
        )}
      </g>
    </g>
  );
};

/**
 * A ballot box standing on (cx, gy), `w` x `h`: a folded ballot paper with a tick stands half-INSERTED in the slot on the
 * top (painted first, so the box's fill hides the part inside), the box (grey), the slot (a short thick bar on the top
 * face), then the tick on the visible part of the paper. Draws paper -> box -> slot -> tick over `dur`.
 */
export const BallotBox: React.FC<{ cx: number; gy: number; w?: number; h?: number; t: number; pen: Pen; seed: number; dur?: number }> =
  ({ cx, gy, w = 110, h = 80, t, pen, seed, dur = 0.5 }) => {
    if (t <= 0) return null;
    const s = seed * 10, P = stager(t, dur), top = gy - h, pw = 46, ph = 58, px = cx - pw / 2 + 4, py = top - ph + 22;
    const paper = `M ${px} ${py + 6} L ${px + pw - 10} ${py} L ${px + pw} ${py + ph - 6} L ${px + 10} ${py + ph} Z`;
    return (
      <g>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'path', d: paper }} fill={pen.light} progress={easeOut(P(0, 0.3))} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'rect', x: cx - w / 2, y: top, w, h }} fill={pen.palette.grey} progress={easeOut(P(0.2, 0.7))} />
        <Sketch pen={pen} seed={s + 3} shape={{ kind: 'line', x1: cx - 30, y1: top + 2, x2: cx + 30, y2: top + 2 }} strokeWidth={pen.inkWidth + 3} roughness={0.5} progress={P(0.66, 0.8)} />
        <Sketch pen={pen} seed={s + 4} shape={{ kind: 'path', d: `M ${cx - 10} ${py + 20} L ${cx - 3} ${py + 28} L ${cx + 12} ${py + 10}` }} strokeWidth={pen.inkWidth + 1} roughness={0.5} progress={easeOut(P(0.8, 1))} />
      </g>
    );
  };

/**
 * A DRAWN question mark centred on (cx, cy), `size` tall: the hook (opens to the left, comes down to a short stem) as one
 * stroke, then the dot; `color` (the pen's accent for an open question). Draws on over `dur`.
 */
export const QMark: React.FC<{ cx: number; cy: number; size?: number; t: number; pen: Pen; seed: number; color?: string; dur?: number; stroke?: number }> =
  ({ cx, cy, size = 56, t, pen, seed, color, dur = 0.4, stroke }) => {
    if (t <= 0) return null;
    const s = seed * 10, c = color ?? pen.palette.red, u = size / 100, sw = stroke ?? pen.inkWidth + 2.6;
    const top = cy - 50 * u;
    const hook = `M ${cx - 24 * u} ${top + 26 * u} C ${cx - 24 * u} ${top - 4 * u}, ${cx + 26 * u} ${top - 6 * u}, ${cx + 26 * u} ${top + 24 * u} C ${cx + 26 * u} ${top + 44 * u}, ${cx + 2 * u} ${top + 46 * u}, ${cx + 2 * u} ${top + 70 * u}`;
    return (
      <g>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'path', d: hook }} stroke={c} strokeWidth={sw} roughness={0.6} progress={easeOut(prog(t, 0, dur * 0.8))} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'circle', cx: cx + 2 * u, cy: top + 92 * u, r: 4.2 * u + 1.5 }} fill={c} stroke={c} roughness={0.3} progress={prog(t, dur * 0.78, dur * 0.22)} />
      </g>
    );
  };

/**
 * A tall rounded band (`x`, `y` top-left, `w` x `h`, corner `r`): a light-filled column outlined in `color` (the pen's accent
 * by default, the highlighted thing), drawn as ONE pen stroke (Sketch `sequential`) over `dur`. Children (what is written in
 * it) render once the outline is mostly in. No floor shadow: a column that spans the page is a drawing on it, not a thing
 * standing on a floor (and a shadow under a band that is 30 percent drawn read as a bar under nothing, round-1 still).
 */
export const TallBand: React.FC<{ x: number; y: number; w: number; h: number; r?: number; t: number; pen: Pen; seed: number; color?: string; dur?: number; children?: React.ReactNode }> =
  ({ x, y, w, h, r = 48, t, pen, seed, color, dur = 0.7, children }) => {
    if (t <= 0) return null;
    const c = color ?? pen.palette.red, p = easeOut(prog(t, 0, dur));
    return (
      <g>
        <Sketch pen={pen} seed={seed} shape={{ kind: 'path', d: rrect(x, y, w, h, r) }} fill={pen.light} stroke={c} strokeWidth={pen.inkWidth + 1.8} progress={p} sequential />
        {p >= 0.85 && children}
      </g>
    );
  };

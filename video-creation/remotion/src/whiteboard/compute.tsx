// whiteboard/compute.tsx: the COMPUTE / RENDERING part of the hand-drawn vocabulary (added 2026-11-08 for the JCT beat
// `ov4-wb-split`, "Smart Render splits one render across many GPUs"): a graphics card (GPU) whose fans spin once it is
// drawn, a film strip whose frames each hold a small 3D cube turning frame to frame (an animation render), a striped
// time bar that grows from a zero line (a duration), a heading that WIPES on like a marker stroke, and a decimal number
// written part by part as it is spoken ("sixteen" ... "point" ... "seven" ... "times").
//
// Kit conventions (video-creation/whiteboard/whiteboard.md): every component takes the pen and a LOCAL time `t`
// (seconds since its cue; <= 0 = not yet) and draws itself on part by part through Sketch progress; fixed seeds (no
// boil, identical across render workers); role colors from the pen's palette (blue = machines, so the GPU is cyan in
// neon-ink; the render is the brown / orange slot, Blender's own color); draw order = what hides what. Pen-agnostic like
// crypto.tsx: a closed body passes `fill` (a no-fill pen strokes it in that color, a paper pen fills it), line parts pass
// `stroke` = the color in a no-fill pen and the ink in a paper pen.
// Geometry was studied from references before drawing (2026-11-08, rendered enlarged and compared): Lucide `gpu` (ISC:
// the card body open on the left, a tall I/O bracket line running past the body above and below, a PCIe tab hanging
// under the body between ~0.25 and ~0.6 of its width, two fans on the centre line), Phosphor `graphics-card` (MIT: fans
// big, radius ~0.28 of the body height, centred at ~0.3 and ~0.7 of the width), Lucide `film` / Phosphor `film-strip`
// / Tabler `movie` (sprocket bands along the long edges with small rounded holes, frame dividers across the strip).
import React from 'react';
import type { Pen } from './pen';
import { Sketch, prog, easeOut, pop } from './Sketch';
import { rrect } from './crypto';

/** stage helper: progress of stage a..b (fractions of `dur`) at local time `t` */
const stager = (t: number, dur: number) => (a: number, b: number) => prog(t, a * dur, (b - a) * dur);
/** line color for a part that is a stroke only: the object color in a no-fill pen (neon), the ink in a paper pen */
const lineColor = (pen: Pen, c: string) => (pen.fillStyle === 'none' ? c : pen.ink);

/**
 * The VISIBLE edges of a cube (side `s`, centred on cx, cy) turned `yawDeg` about its vertical axis and tilted `pitchDeg`
 * toward the viewer (we look down on its top face), orthographic, as one SVG path of `M .. L ..` segments. An edge is
 * drawn when either of its two faces faces the viewer, so the hidden back edges never show (a wireframe cube reads as a
 * box only without them). Yaw 45 = the classic three-face view; stepping the yaw frame to frame turns it.
 */
export const cubeEdges = (cx: number, cy: number, s: number, yawDeg: number, pitchDeg = 28): string => {
  const a = (yawDeg * Math.PI) / 180, b = (pitchDeg * Math.PI) / 180, hs = s / 2;
  const rot = (x: number, y: number, z: number): [number, number, number] => {
    const x1 = x * Math.cos(a) + z * Math.sin(a), z1 = -x * Math.sin(a) + z * Math.cos(a);      // yaw about +y
    return [x1, y * Math.cos(b) - z1 * Math.sin(b), y * Math.sin(b) + z1 * Math.cos(b)];        // tilt the top toward +z
  };
  // a face is identified by its axis (0 x, 1 y, 2 z) and sign; visible when its turned normal points at the viewer (+z)
  const faceVisible = (axis: number, sign: number) => {
    const n = [0, 0, 0]; n[axis] = sign;
    return rot(n[0], n[1], n[2])[2] > 1e-6;
  };
  const segs: string[] = [];
  const corners = [-1, 1];
  for (let axis = 0; axis < 3; axis++) {
    // edges parallel to `axis`: the other two coordinates fixed at +-1
    const o = [0, 1, 2].filter((k) => k !== axis);
    for (const u of corners) for (const v of corners) {
      if (!faceVisible(o[0], u) && !faceVisible(o[1], v)) continue;
      const p = [0, 0, 0], q = [0, 0, 0];
      p[axis] = -1; q[axis] = 1; p[o[0]] = q[o[0]] = u; p[o[1]] = q[o[1]] = v;
      const P = rot(p[0] * hs, p[1] * hs, p[2] * hs), Q = rot(q[0] * hs, q[1] * hs, q[2] * hs);
      segs.push(`M ${(cx + P[0]).toFixed(1)} ${(cy - P[1]).toFixed(1)} L ${(cx + Q[0]).toFixed(1)} ${(cy - Q[1]).toFixed(1)}`);
    }
  }
  return segs.join(' ');
};

/**
 * A horizontal FILM STRIP (an animation render): a rounded strip (`x`, `y` top-left, `w` x `h`), a sprocket band along
 * each long edge (a rule `band` px in from the edge, a row of small rounded holes in it), `frames` frames between the
 * bands split by dividers, and in each frame a small wireframe cube whose yaw steps frame to frame (`yaw0`, `yawStep`)
 * so the strip reads as frames of a 3D animation. Orange (the palette's brown slot; Blender's color) by default. Draws
 * strip -> band rules -> dividers -> holes left to right -> the cubes one by one over `dur`.
 */
export const FilmStrip: React.FC<{
  x: number; y: number; w?: number; h?: number; frames?: number; band?: number; t: number; pen: Pen; seed: number;
  color?: string; dur?: number; cube?: boolean; cubeSize?: number; yaw0?: number; yawStep?: number;
}> = ({ x, y, w = 340, h = 172, frames = 3, band = 28, t, pen, seed, color, dur = 0.75, cube = true, cubeSize = 42, yaw0 = 18, yawStep = 26 }) => {
  if (t <= 0) return null;
  const c = color ?? pen.palette.brown, st = lineColor(pen, c), s = seed * 10, P = stager(t, dur);
  const fw = w / frames, m = 12, nHoles = Math.max(3, Math.round((w - 2 * m) / 30)), pitch = (w - 2 * m) / nHoles;
  const hw = Math.min(16, pitch * 0.52), hh = band * 0.4;
  const bandRows = [y + band / 2, y + h - band / 2];
  return (
    <g>
      <Sketch pen={pen} seed={s + 1} shape={{ kind: 'path', d: rrect(x, y, w, h, 10) }} fill={c} progress={P(0, 0.34)} sequential />
      <Sketch pen={pen} seed={s + 2} shape={{ kind: 'line', x1: x, y1: y + band, x2: x + w, y2: y + band }} stroke={st} progress={P(0.28, 0.42)} />
      <Sketch pen={pen} seed={s + 3} shape={{ kind: 'line', x1: x, y1: y + h - band, x2: x + w, y2: y + h - band }} stroke={st} progress={P(0.32, 0.46)} />
      {Array.from({ length: frames - 1 }).map((_, i) => (
        <Sketch key={i} pen={pen} seed={s + 4 + i} shape={{ kind: 'line', x1: x + (i + 1) * fw, y1: y + band, x2: x + (i + 1) * fw, y2: y + h - band }} stroke={st}
          progress={P(0.42 + i * 0.04, 0.54 + i * 0.04)} />
      ))}
      {bandRows.map((cy, r) => Array.from({ length: nHoles }).map((_, i) => {
        const hx = x + m + pitch * (i + 0.5);
        return (
          <Sketch key={`${r}-${i}`} pen={pen} seed={s + 20 + r * 40 + i} shape={{ kind: 'path', d: rrect(hx - hw / 2, cy - hh / 2, hw, hh, 2.5) }} stroke={st}
            strokeWidth={pen.inkWidth * 0.75} roughness={0.35} progress={P(0.48 + i * 0.016, 0.56 + i * 0.016)} />
        );
      }))}
      {cube && Array.from({ length: frames }).map((_, j) => (
        <Sketch key={j} pen={pen} seed={s + 100 + j} shape={{ kind: 'path', d: cubeEdges(x + fw * (j + 0.5), y + h / 2 + 2, cubeSize, yaw0 + j * yawStep) }} stroke={st}
          roughness={0.5} progress={P(0.66 + j * 0.1, 0.84 + j * 0.08)} sequential />
      ))}
    </g>
  );
};

/**
 * A GRAPHICS CARD (a GPU), side view: the card body (`x`, `y` top-left, `w` x `h`, rounded on the right, its left edge
 * under the I/O bracket), the bracket (a heavier line running ~11 px above the body and down past the PCIe tab), the
 * PCIe tab hanging under the body, two fans (a rim, a hub, three curved blades). `spin` (degrees) turns the blades
 * (the scene passes a growing angle once the card is drawn: the GPU is working); the blades are authored once and
 * rotated, so the wobble never boils. Cyan in neon-ink (blue = machines). Draws body -> bracket -> tab -> fans over `dur`.
 */
export const GpuCard: React.FC<{ x: number; y: number; w?: number; h?: number; t: number; pen: Pen; seed: number; color?: string; dur?: number; spin?: number }> =
  ({ x, y, w = 140, h = 78, t, pen, seed, color, dur = 0.55, spin = 0 }) => {
    if (t <= 0) return null;
    const c = color ?? pen.palette.blue, st = lineColor(pen, c), s = seed * 10, P = stager(t, dur), r = 9;
    const body = `M ${x} ${y} L ${x + w - r} ${y} Q ${x + w} ${y} ${x + w} ${y + r} L ${x + w} ${y + h - r} Q ${x + w} ${y + h} ${x + w - r} ${y + h} L ${x} ${y + h} Z`;
    const tx0 = x + w * 0.26, tx1 = x + w * 0.6, td = 13, tb = y + h + td;
    const tab = `M ${tx0} ${y + h} L ${tx0} ${tb - 3} Q ${tx0} ${tb} ${tx0 + 3} ${tb} L ${tx1 - 3} ${tb} Q ${tx1} ${tb} ${tx1} ${tb - 3} L ${tx1} ${y + h}`;
    const fr = h * 0.3, fy = y + h / 2, fans = [x + w * 0.3, x + w * 0.71];
    const blade = (fx: number, k: number) => {
      const a = (k * 2 * Math.PI) / 3, r0 = 5.5, r1 = fr - 3.5;
      return `M ${fx + Math.cos(a) * r0} ${fy + Math.sin(a) * r0} Q ${fx + Math.cos(a + 0.5) * fr * 0.68} ${fy + Math.sin(a + 0.5) * fr * 0.68} ${fx + Math.cos(a + 1.05) * r1} ${fy + Math.sin(a + 1.05) * r1}`;
    };
    return (
      <g>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'path', d: body }} fill={c} progress={P(0, 0.42)} sequential />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'line', x1: x, y1: y - 11, x2: x, y2: tb + 1 }} stroke={st} strokeWidth={pen.inkWidth + 1} roughness={0.6} progress={P(0.36, 0.52)} />
        <Sketch pen={pen} seed={s + 3} shape={{ kind: 'path', d: tab }} stroke={st} roughness={0.5} progress={P(0.48, 0.62)} />
        {fans.map((fx, i) => (
          <g key={i}>
            <Sketch pen={pen} seed={s + 4 + i} shape={{ kind: 'circle', cx: fx, cy: fy, r: fr }} fill={pen.light} stroke={st} roughness={0.5} progress={P(0.56 + i * 0.08, 0.76 + i * 0.08)} />
            <g transform={`rotate(${(spin + i * 37) % 360} ${fx} ${fy})`}>
              <Sketch pen={pen} seed={s + 6 + i} shape={{ kind: 'circle', cx: fx, cy: fy, r: 4.5 }} stroke={st} roughness={0.3} progress={P(0.78, 0.86)} />
              {[0, 1, 2].map((k) => (
                <Sketch key={k} pen={pen} seed={s + 10 + i * 3 + k} shape={{ kind: 'path', d: blade(fx, k) }} stroke={st} strokeWidth={pen.inkWidth * 0.85} roughness={0.4}
                  progress={P(0.82 + k * 0.05, 0.92 + k * 0.03)} />
              ))}
            </g>
          </g>
        ))}
      </g>
    );
  };

/**
 * The angle (degrees) of a fan / wheel at local time `T` that starts turning at `t0` at `w` deg/s and, from `tStop`,
 * spins down linearly to rest over `D` seconds (pass tStop = Infinity to keep it turning). Pure in `T`, so every frame
 * renders identically on every worker. Feed it to `GpuCard spin` (plus a per-card phase).
 */
export const spinAngle = (T: number, t0: number, w: number, tStop = Infinity, D = 0.6): number => {
  if (T <= t0) return 0;
  let a = w * Math.max(0, Math.min(T, tStop) - t0);
  if (T > tStop && tStop > t0) { const u = Math.min(T - tStop, D); a += w * (u - (u * u) / (2 * D)); }
  return a;
};

/**
 * A TIME BAR: a horizontal bar of length `len` (`x` = its left end on the zero line, `cy` its centre line, `h` tall)
 * that GROWS from the zero line over `dur` (a clip reveal with a moving front edge, so the hand-drawn outline never
 * boils and the bar looks closed while it grows), with diagonal stripes inside (a progress bar: a no-fill pen has no
 * solid fill to show "how much"). `linear` grows at a steady pace (a smoothstep, for a LONG duration that should feel
 * long) instead of the fast ease-out (a short one that snaps in). Blue (machines) by default.
 */
export const TimeBar: React.FC<{
  x: number; cy: number; len: number; h?: number; t: number; pen: Pen; seed: number; color?: string; dur?: number;
  stripes?: boolean; gap?: number; linear?: boolean;
}> = ({ x, cy, len, h = 46, t, pen, seed, color, dur = 0.5, stripes = true, gap = 17, linear = false }) => {
  if (t <= 0) return null;
  const c = color ?? pen.palette.blue, st = lineColor(pen, c), s = seed * 10;
  const raw = prog(t, 0, dur), p = linear ? raw * raw * (3 - 2 * raw) : easeOut(raw);
  const y = cy - h / 2, front = x + len * p, clipId = `tbar-${seed}`, innerId = `tbar-in-${seed}`;
  const slant = h * 0.62;
  let d = '';
  for (let u = 8 - slant; u < len - 6; u += gap) d += `M ${(x + u).toFixed(1)} ${y + h - 5} L ${(x + u + slant).toFixed(1)} ${y + 5} `;
  const done = p >= 1;
  return (
    <g>
      <defs>
        {/* the reveal ends AT the front while growing (so the outline's own right edge only shows once the bar has
            landed; the moving front line closes it meanwhile), and covers the whole wobble once done */}
        <clipPath id={clipId}><rect x={x - 14} y={y - 16} width={done ? len + 30 : Math.max(0, front - x + 14)} height={h + 32} /></clipPath>
        <clipPath id={innerId}><rect x={x + 4} y={y + 3.5} width={Math.max(0, len - 8)} height={h - 7} /></clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        {stripes && d && (
          <g clipPath={`url(#${innerId})`}>
            <Sketch pen={pen} seed={s + 2} shape={{ kind: 'path', d }} stroke={st} strokeWidth={1.7} roughness={0.45} opacity={0.7} />
          </g>
        )}
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'rect', x, y, w: len, h }} fill={c} strokeWidth={pen.inkWidth + 0.6} />
      </g>
      {!done && p > 0 && <line x1={front} y1={y + 1.5} x2={front} y2={y + h - 1.5} stroke={st} strokeWidth={pen.inkWidth + 0.6} strokeLinecap="round" />}
    </g>
  );
};

/**
 * A heading that WIPES on left to right like a marker stroke (a clip sweep over `dur`), for display text that should
 * land as one gesture rather than type letter by letter. `x` is the anchor (the final position is the font's own
 * layout, exact); the sweep's extent uses the `charW` estimate (em per glyph) padded half an em both sides, and the clip
 * is dropped once the wipe is done, so an underestimate can never crop the last glyph. `id` must be unique in the scene.
 */
export const WipeText: React.FC<{
  x: number; y: number; text: string; t: number; dur?: number; size: number; font: string; color: string;
  anchor?: 'start' | 'middle' | 'end'; charW?: number; spacing?: number; weight?: string | number; id: string; opacity?: number;
}> = ({ x, y, text, t, dur = 0.35, size, font, color, anchor = 'start', charW = 0.9, spacing = 0, weight = 'normal', id, opacity = 1 }) => {
  if (t <= 0) return null;
  const p = easeOut(prog(t, 0, dur));
  const est = text.length * size * charW + Math.max(0, text.length - 1) * spacing * size;
  const left = anchor === 'middle' ? x - est / 2 : anchor === 'end' ? x - est : x;
  const pad = size * 0.5, done = p >= 1;
  return (
    <g opacity={opacity}>
      {!done && <defs><clipPath id={id}><rect x={left - pad} y={y - size * 1.25} width={(est + 2 * pad) * p} height={size * 1.9} /></clipPath></defs>}
      <text x={x} y={y} fontFamily={`'${font}', cursive`} fontSize={size} fill={color} fontWeight={weight} textAnchor={anchor}
        letterSpacing={spacing ? spacing * size : undefined} clipPath={done ? undefined : `url(#${id})`}>
        {text}
      </text>
    </g>
  );
};

/**
 * A decimal number WRITTEN AS IT IS SPOKEN, e.g. "16.7X": the integer part wipes on at `tInt` (right-aligned to the
 * point), the decimal point pops in at `tDot` as a DRAWN dot (r ~0.085 em, clear air both sides: a display hand-font's
 * period is a speck that merges into the digits, "$2.53B" read "$253B", binance 2026-10-31), the fraction wipes on at
 * `tFrac` (left-aligned after the point), the suffix ("X") at `tSuffix`, placed `fracW` em after the fraction's start.
 * `x` = the point's centre, `y` = the baseline. Times are local seconds since each part's cue (<= 0 = not yet).
 */
export const SpokenDecimal: React.FC<{
  x: number; y: number; int: string; frac: string; suffix?: string; tInt: number; tDot: number; tFrac: number; tSuffix?: number;
  size: number; font: string; color: string; gap?: number; fracW?: number; spacing?: number; idBase: string;
}> = ({ x, y, int, frac, suffix = '', tInt, tDot, tFrac, tSuffix = -1, size, font, color, gap = 0.2, fracW = 0.7, spacing = 0.06, idBase }) => {
  const r = size * 0.085, g = size * gap, k = pop(prog(tDot, 0, 0.18));
  return (
    <g>
      <WipeText x={x - g} y={y} text={int} t={tInt} dur={0.4} size={size} font={font} color={color} anchor="end" charW={0.75} spacing={spacing} id={`${idBase}-i`} />
      {tDot > 0 && <circle cx={x} cy={y - r * 0.9} r={r * k} fill={color} />}
      <WipeText x={x + g} y={y} text={frac} t={tFrac} dur={0.25} size={size} font={font} color={color} anchor="start" charW={0.75} spacing={spacing} id={`${idBase}-f`} />
      {suffix && <WipeText x={x + g + fracW * size} y={y} text={suffix} t={tSuffix} dur={0.22} size={size} font={font} color={color} anchor="start" charW={0.8} id={`${idBase}-s`} />}
    </g>
  );
};

/** a straight zero line (a chart axis) that draws on top to bottom over `dur` */
export const AxisLine: React.FC<{ x: number; y1: number; y2: number; t: number; pen: Pen; seed: number; color?: string; dur?: number }> =
  ({ x, y1, y2, t, pen, seed, color, dur = 0.3 }) => {
    if (t <= 0) return null;
    return <Sketch pen={pen} seed={seed} shape={{ kind: 'line', x1: x, y1, x2: x, y2 }} stroke={color ?? pen.ink} strokeWidth={pen.inkWidth} roughness={0.6} progress={easeOut(prog(t, 0, dur))} />;
  };

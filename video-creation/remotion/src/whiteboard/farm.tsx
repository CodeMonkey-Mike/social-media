// whiteboard/farm.tsx: the FARM / HORSE part of the hand-drawn vocabulary (added 2026-10-30 for the horse-video
// test): the illustrated horse with poses (stand / trot / jump / graze), a rider, a walking plow, a barn with a
// silo, hills with crop rows, a rail fence, a tree, a card frame, a half-dial gauge, hearts, speed lines, a rolling
// number. Every path is authored ONCE; poses are rigid transforms of leg groups, so rough.js never re-generates a
// changing path (no boil). Horse geometry = the picker's styles/vocab.html (400x300 local box, hooves on y=272).
import React from 'react';
import type { Pen } from './pen';
import { Sketch, prog, easeOut, pop } from './Sketch';

export const HORSE_SIL = 'M 120 104 C 160 90, 200 92, 236 98 C 262 74, 292 54, 318 44 C 334 30, 362 34, 378 50 C 390 62, 398 74, 392 86 C 388 94, 374 96, 362 90 C 352 86, 344 82, 338 76 C 320 92, 302 112, 290 136 C 292 158, 286 178, 272 190 C 230 198, 170 198, 130 194 C 104 190, 94 170, 96 146 C 98 124, 106 108, 120 104 Z';
const HORSE_MANE = 'M 318 44 C 292 54, 262 74, 236 98 L 226 86 C 252 60, 284 40, 312 30 Z';
const HORSE_FORELOCK = 'M 316 42 C 304 38, 296 46, 302 58 C 310 54, 316 48, 316 42 Z';
const HORSE_TAIL = 'M 108 112 C 80 124, 62 172, 74 224 C 82 228, 88 224, 90 218 C 84 188, 88 156, 112 132 Z';
const HORSE_EAR = 'M 326 42 L 322 22 L 342 36 Z';
// legs: [path, pivotX, pivotY, isFront]; the two far legs first (drawn behind the body)
const HORSE_LEGS: [string, number, number, boolean][] = [
  ['M 112 184 L 132 184 L 128 262 L 114 262 Z', 122, 186, false],
  ['M 236 184 L 256 184 L 254 262 L 240 262 Z', 246, 186, true],
  ['M 136 188 L 160 188 L 154 262 L 138 262 Z', 148, 190, false],
  ['M 256 186 L 278 186 L 276 262 L 260 262 Z', 267, 188, true],
];
// hooves in the SAME order as HORSE_LEGS (far back, far front, near back, near front), so each rides its own leg's pivot
const HORSE_HOOVES = [[112, 128], [238, 254], [136, 154], [258, 276]].map(([a, b]) => `M ${a} 258 L ${b} 258 L ${b} 272 L ${a} 272 Z`);

export type HorsePose = 'stand' | 'trot' | 'jump' | 'graze' | 'pull';

export const Horse: React.FC<{
  x: number; y: number; scale: number; t: number; pen: Pen; seed: number;
  pose?: HorsePose; flip?: boolean; color?: string; rider?: boolean; plow?: boolean; speed?: boolean;
  /** draw on part by part over `dur` (default) or pop in when false */
  drawOn?: boolean; dur?: number; hooves?: boolean; detail?: boolean;
}> = ({ x, y, scale, t, pen, seed, pose = 'stand', flip, color, rider, plow, speed, drawOn = true, dur = 0.8, hooves = true, detail = true }) => {
  if (t <= 0) return null;
  const body = color ?? pen.palette.brown;
  const s = seed * 100;
  const P = (a: number, b: number) => (drawOn ? prog(t, a * dur, (b - a) * dur) : 1);
  const k = drawOn ? 1 : pop(prog(t, 0, 0.3));
  const rough = pen.roughness / Math.max(scale, 0.5);
  const o = { roughness: rough, strokeWidth: Math.max(1.2, pen.inkWidth / Math.max(scale, 0.6)) };
  const f = 1.7; // gait frequency
  const swing = pose === 'trot' || pose === 'pull' ? 18 : 0;
  const legAngle = (i: number) => {
    if (pose === 'jump') return HORSE_LEGS[i][3] ? -42 : 34;
    const ph = i === 0 || i === 3 ? 0 : Math.PI; // diagonal pairs swing together
    return swing * Math.sin(2 * Math.PI * f * t + ph);
  };
  const bob = pose === 'trot' || pose === 'pull' ? 4 * Math.sin(4 * Math.PI * f * t) : pose === 'jump' ? -6 * Math.sin(2 * Math.PI * 0.9 * t) : 0;
  const tilt = pose === 'jump' ? -14 : pose === 'graze' ? 9 : pose === 'pull' ? 4 : 0;
  const leg = (i: number, stage: [number, number]) => {
    const [d, px, py] = HORSE_LEGS[i];
    return (
      <g key={i} transform={`rotate(${legAngle(i)} ${px} ${py})`}>
        <Sketch pen={pen} seed={s + 10 + i} shape={{ kind: 'path', d }} fill={body} progress={P(stage[0], stage[1])} {...o} />
        {hooves && <Sketch pen={pen} seed={s + 20 + i} shape={{ kind: 'path', d: HORSE_HOOVES[i] }} fill={pen.light} progress={P(stage[0] + 0.1, stage[1] + 0.1)} {...o} />}
      </g>
    );
  };
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${k * scale * (flip ? -1 : 1)} ${k * scale}) rotate(${tilt} 200 150)`}>
      {leg(0, [0.45, 0.6])}{leg(1, [0.5, 0.65])}
      <Sketch pen={pen} seed={s + 1} shape={{ kind: 'path', d: HORSE_TAIL }} fill={pen.dark} progress={P(0.35, 0.5)} {...o} />
      <Sketch pen={pen} seed={s + 2} shape={{ kind: 'path', d: HORSE_SIL }} fill={body} progress={P(0, 0.42)} {...o} />
      <Sketch pen={pen} seed={s + 3} shape={{ kind: 'path', d: HORSE_EAR }} fill={body} progress={P(0.4, 0.48)} {...o} />
      <Sketch pen={pen} seed={s + 4} shape={{ kind: 'path', d: HORSE_MANE }} fill={pen.dark} progress={P(0.3, 0.46)} {...o} />
      {detail && <Sketch pen={pen} seed={s + 5} shape={{ kind: 'path', d: HORSE_FORELOCK }} fill={pen.dark} progress={P(0.44, 0.5)} {...o} />}
      {leg(2, [0.55, 0.7])}{leg(3, [0.6, 0.75])}
      {detail && (
        <>
          <Sketch pen={pen} seed={s + 6} shape={{ kind: 'circle', cx: 350, cy: 56, r: 4 }} fill={pen.dark} roughness={0.3} progress={P(0.8, 0.86)} />
          <Sketch pen={pen} seed={s + 7} shape={{ kind: 'circle', cx: 384, cy: 80, r: 2.5 }} fill={pen.dark} roughness={0.3} progress={P(0.84, 0.9)} />
          <Sketch pen={pen} seed={s + 8} shape={{ kind: 'line', x1: 388, y1: 90, x2: 378, y2: 92 }} stroke={pen.dark} strokeWidth={o.strokeWidth * 0.8} progress={P(0.88, 0.94)} />
        </>
      )}
      {plow && <Plow pen={pen} seed={s + 40} progress={P(0.5, 0.9)} t={t} />}
      {rider && <Rider pen={pen} seed={s + 60} progress={P(0.6, 1)} />}
      {speed && <SpeedLines pen={pen} t={t} x={80} />}
    </g>
  );
};

/** a rider seated on the horse (horse-local coordinates, facing right) */
const Rider: React.FC<{ pen: Pen; seed: number; progress: number }> = ({ pen, seed, progress: p }) => (
  <g>
    <Sketch pen={pen} seed={seed + 1} shape={{ kind: 'line', x1: 212, y1: 104, x2: 226, y2: 168 }} progress={p} />
    <Sketch pen={pen} seed={seed + 2} shape={{ kind: 'line', x1: 226, y1: 168, x2: 240, y2: 166 }} progress={p} />
    <Sketch pen={pen} seed={seed + 3} shape={{ kind: 'polygon', pts: [[186, 102], [216, 102], [212, 48], [192, 48]] }} fill={pen.palette.blue} progress={p} />
    <Sketch pen={pen} seed={seed + 4} shape={{ kind: 'line', x1: 210, y1: 58, x2: 262, y2: 78 }} progress={p} />
    <Sketch pen={pen} seed={seed + 5} shape={{ kind: 'line', x1: 262, y1: 78, x2: 366, y2: 84 }} strokeWidth={1.4} progress={p} />
    <Sketch pen={pen} seed={seed + 6} shape={{ kind: 'circle', cx: 201, cy: 30, r: 15 }} fill={pen.light} progress={p} />
    <Sketch pen={pen} seed={seed + 7} shape={{ kind: 'path', d: 'M 186 28 C 187 10, 215 10, 216 28 C 209 22, 199 20, 186 28 Z' }} fill={pen.dark} progress={p} />
    <Sketch pen={pen} seed={seed + 8} shape={{ kind: 'circle', cx: 206, cy: 30, r: 1.6 }} fill={pen.dark} roughness={0.2} progress={p} />
  </g>
);

/** a walking plow behind the horse (horse-local coordinates): collar on the shoulder, traces along the body, a beam
 *  with a small wheel, two long handles angled up and back, a share at the ground, dust kicked up behind it */
const Plow: React.FC<{ pen: Pen; seed: number; progress: number; t: number }> = ({ pen, seed, progress: p, t }) => (
  <g>
    {/* collar: a dark band around the base of the neck */}
    <g transform="rotate(-22 266 130)">
      <Sketch pen={pen} seed={seed + 1} shape={{ kind: 'ellipse', cx: 266, cy: 130, rx: 13, ry: 40 }} stroke={pen.dark} strokeWidth={5} progress={p} />
    </g>
    {/* traces: two straps from the collar back along the body to the beam head */}
    <Sketch pen={pen} seed={seed + 2} shape={{ kind: 'line', x1: 262, y1: 156, x2: 112, y2: 196 }} stroke={pen.dark} strokeWidth={2.6} progress={p} />
    <Sketch pen={pen} seed={seed + 3} shape={{ kind: 'line', x1: 258, y1: 166, x2: 112, y2: 202 }} stroke={pen.dark} strokeWidth={2.6} progress={p} />
    {/* beam from the whippletree back and down to the share, with the gauge wheel under its front */}
    <Sketch pen={pen} seed={seed + 4} shape={{ kind: 'line', x1: 112, y1: 199, x2: 42, y2: 232 }} strokeWidth={4} progress={p} />
    <Sketch pen={pen} seed={seed + 5} shape={{ kind: 'line', x1: 100, y1: 205, x2: 100, y2: 246 }} strokeWidth={2.4} progress={p} />
    <Sketch pen={pen} seed={seed + 6} shape={{ kind: 'circle', cx: 100, cy: 256, r: 14 }} progress={p} />
    <Sketch pen={pen} seed={seed + 7} shape={{ kind: 'circle', cx: 100, cy: 256, r: 3 }} fill={pen.ink} roughness={0.3} progress={p} />
    {/* two long handles, up and back, with a grip bar */}
    <Sketch pen={pen} seed={seed + 8} shape={{ kind: 'line', x1: 48, y1: 228, x2: -58, y2: 128 }} strokeWidth={3} progress={p} />
    <Sketch pen={pen} seed={seed + 9} shape={{ kind: 'line', x1: 60, y1: 226, x2: -44, y2: 118 }} strokeWidth={3} progress={p} />
    <Sketch pen={pen} seed={seed + 10} shape={{ kind: 'line', x1: -58, y1: 128, x2: -44, y2: 118 }} strokeWidth={3} progress={p} />
    {/* the share / moldboard in the ground */}
    <Sketch pen={pen} seed={seed + 11} shape={{ kind: 'path', d: 'M 14 268 L 64 268 C 70 250, 62 236, 50 230 L 36 230 C 24 242, 16 254, 14 268 Z' }} fill={pen.palette.blue} progress={p} />
    {/* dust behind the share */}
    {[0, 1, 2, 3].map((i) => {
      const ph = (t * 1.4 + i * 0.25) % 1;
      return <circle key={i} cx={4 - i * 12 - ph * 26} cy={266 - i * 4 - ph * 16} r={4 + i * 2} fill={pen.palette.grey} opacity={p * (1 - ph) * 0.85} />;
    })}
  </g>
);

/** the furrow a plow leaves: a pre-drawn rough line revealed from x0 up to the share's current x (no boil) */
export const Furrow: React.FC<{ x0: number; x1: number; xNow: number; y: number; pen: Pen; seed: number }> = ({ x0, x1, xNow, y, pen, seed }) => {
  if (xNow <= x0 + 2) return null;
  const clipId = `furrow-${seed}`;
  return (
    <g>
      <defs><clipPath id={clipId}><rect x={x0 - 10} y={y - 20} width={Math.max(0, xNow - x0 + 10)} height={40} /></clipPath></defs>
      <g clipPath={`url(#${clipId})`} opacity={0.55}>
        <Sketch pen={pen} seed={seed} shape={{ kind: 'line', x1: x0, y1: y, x2: x1, y2: y }} stroke={pen.dark} strokeWidth={2.2} roughness={1.6} />
        <Sketch pen={pen} seed={seed + 1} shape={{ kind: 'line', x1: x0, y1: y + 7, x2: x1, y2: y + 7 }} stroke={pen.dark} strokeWidth={1.4} roughness={1.8} />
      </g>
    </g>
  );
};

/** pulsing speed lines behind a moving horse (horse-local) */
const SpeedLines: React.FC<{ pen: Pen; t: number; x: number }> = ({ pen, t, x }) => (
  <g>
    {[0, 1, 2].map((i) => {
      const len = 40 + 30 * Math.abs(Math.sin(t * 7 + i * 1.1));
      const y = 110 + i * 34;
      return <line key={i} x1={x - len} y1={y} x2={x - 10} y2={y} stroke={pen.ink} strokeWidth={pen.inkWidth} strokeLinecap="round" opacity={0.7} />;
    })}
  </g>
);

/** a show jump: post + bar, scene coordinates */
export const JumpBar: React.FC<{ x: number; gy: number; h: number; t: number; pen: Pen; seed: number }> = ({ x, gy, h, t, pen, seed }) => {
  if (t <= 0) return null;
  const p = easeOut(prog(t, 0, 0.5));
  return (
    <g>
      <Sketch pen={pen} seed={seed} shape={{ kind: 'line', x1: x, y1: gy, x2: x, y2: gy - h }} progress={p} />
      <Sketch pen={pen} seed={seed + 1} shape={{ kind: 'line', x1: x - 40, y1: gy - h + 10, x2: x + 40, y2: gy - h + 10 }} stroke={pen.palette.red} strokeWidth={pen.inkWidth + 2} progress={p} />
    </g>
  );
};

/** floating hearts (therapy) */
export const Hearts: React.FC<{ x: number; y: number; t: number; pen: Pen; n?: number }> = ({ x, y, t, pen, n = 3 }) => {
  if (t <= 0) return null;
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => {
        const ph = (t * 0.45 + i / n) % 1;
        const hx = x + (i - 1) * 26 + 6 * Math.sin(t * 2 + i), hy = y - ph * 60, sc = 0.55 + 0.25 * (1 - ph);
        return <path key={i} transform={`translate(${hx} ${hy}) scale(${sc})`} d="M 0 8 C -10 -6, -24 6, 0 24 C 24 6, 10 -6, 0 8 Z" fill={pen.palette.red} stroke={pen.ink} strokeWidth={1.5} opacity={Math.min(1, (1 - ph) * 1.6) * Math.min(1, t)} />;
      })}
    </g>
  );
};

/** a heart icon (rough), scene coordinates, pops in; `size` = height in px */
export const HeartIcon: React.FC<{ x: number; y: number; size: number; t: number; pen: Pen; seed: number }> = ({ x, y, size, t, pen, seed }) => {
  if (t <= 0) return null;
  const k = pop(prog(t, 0, 0.3)) * (size / 24);
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <Sketch pen={pen} seed={seed} shape={{ kind: 'path', d: 'M 0 8 C -10 -6, -24 6, 0 24 C 24 6, 10 -6, 0 8 Z' }} fill={pen.palette.red} roughness={0.5} strokeWidth={(pen.inkWidth * 24) / size} />
    </g>
  );
};

/** a card frame that draws on; children fade in behind it */
export const Card: React.FC<{ x: number; y: number; w: number; h: number; t: number; pen: Pen; seed: number; children?: React.ReactNode }> = ({ x, y, w, h, t, pen, seed, children }) => {
  if (t <= 0) return null;
  const p = easeOut(prog(t, 0, 0.5));
  return (
    <g>
      <Sketch pen={pen} seed={seed} shape={{ kind: 'rect', x, y, w, h }} progress={p} roughness={0.8} />
      <g opacity={p}>{children}</g>
    </g>
  );
};

/** a barn with a silo (local box ~ 280 x 260, ground at local y=260) */
export const Barn: React.FC<{ x: number; y: number; scale?: number; t: number; pen: Pen; seed: number; dur?: number }> = ({ x, y, scale = 1, t, pen, seed, dur = 1.0 }) => {
  if (t <= 0) return null;
  const P = (a: number, b: number) => prog(t, a * dur, (b - a) * dur);
  const s = seed * 10;
  const barn = pen.palette.red, silo = pen.palette.grey, door = pen.dark;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <Sketch pen={pen} seed={s + 1} shape={{ kind: 'rect', x: 0, y: 110, w: 200, h: 150 }} fill={barn} progress={P(0, 0.35)} />
      <Sketch pen={pen} seed={s + 2} shape={{ kind: 'polygon', pts: [[-10, 112], [0, 72], [44, 30], [100, 12], [156, 30], [200, 72], [210, 112]] }} fill={barn} progress={P(0.2, 0.5)} />
      <Sketch pen={pen} seed={s + 3} shape={{ kind: 'rect', x: 70, y: 172, w: 60, h: 88 }} fill={door} progress={P(0.45, 0.62)} />
      <Sketch pen={pen} seed={s + 4} shape={{ kind: 'line', x1: 70, y1: 172, x2: 130, y2: 260 }} stroke={pen.light} progress={P(0.6, 0.7)} />
      <Sketch pen={pen} seed={s + 5} shape={{ kind: 'line', x1: 130, y1: 172, x2: 70, y2: 260 }} stroke={pen.light} progress={P(0.62, 0.72)} />
      <Sketch pen={pen} seed={s + 6} shape={{ kind: 'rect', x: 84, y: 118, w: 32, h: 32 }} fill={pen.light} progress={P(0.6, 0.72)} />
      <Sketch pen={pen} seed={s + 7} shape={{ kind: 'line', x1: 84, y1: 118, x2: 116, y2: 150 }} progress={P(0.7, 0.78)} />
      <Sketch pen={pen} seed={s + 8} shape={{ kind: 'line', x1: 116, y1: 118, x2: 84, y2: 150 }} progress={P(0.72, 0.8)} />
      <Sketch pen={pen} seed={s + 9} shape={{ kind: 'rect', x: 218, y: 70, w: 52, h: 190 }} fill={silo} progress={P(0.3, 0.6)} />
      <Sketch pen={pen} seed={s + 10} shape={{ kind: 'path', d: 'M 214 72 C 214 40, 274 40, 274 72 Z' }} fill={silo} progress={P(0.55, 0.75)} />
      <Sketch pen={pen} seed={s + 11} shape={{ kind: 'line', x1: 218, y1: 130, x2: 270, y2: 130 }} strokeWidth={1.4} progress={P(0.75, 0.85)} />
      <Sketch pen={pen} seed={s + 12} shape={{ kind: 'line', x1: 218, y1: 190, x2: 270, y2: 190 }} strokeWidth={1.4} progress={P(0.8, 0.9)} />
    </g>
  );
};

/** two soft hills with faint crop rows, full scene width, base = where the ground starts */
export const Hills: React.FC<{ t: number; pen: Pen; seed: number; top?: number; base?: number }> = ({ t, pen, seed, top = 470, base = 660 }) => {
  if (t <= 0) return null;
  const p = easeOut(prog(t, 0, 0.9));
  const g = pen.palette.green;
  const d1 = `M 0 ${top + 60} C 300 ${top - 20}, 700 ${top - 30}, 1000 ${top + 40} C 1300 ${top + 100}, 1600 ${top - 10}, 1920 ${top + 40} L 1920 ${base} L 0 ${base} Z`;
  const d2 = `M 300 ${top + 90} C 600 ${top + 30}, 1000 ${top + 20}, 1400 ${top + 70} C 1600 ${top + 95}, 1800 ${top + 60}, 1920 ${top + 80} L 1920 ${base} L 300 ${base} Z`;
  return (
    <g opacity={0.55}>
      <Sketch pen={pen} seed={seed} shape={{ kind: 'path', d: d1 }} fill={g} roughness={0.6} strokeWidth={1.6} progress={p} />
      <Sketch pen={pen} seed={seed + 1} shape={{ kind: 'path', d: d2 }} fill={g} roughness={0.6} strokeWidth={1.6} progress={p} />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M ${520 + i * 40} ${base - 10} C ${700 + i * 60} ${top + 70 + i * 12}, ${1000 + i * 70} ${top + 60 + i * 14}, ${1500 + i * 60} ${top + 90 + i * 10}`} fill="none" stroke={pen.ink} strokeWidth={1} opacity={0.25 * p} />
      ))}
    </g>
  );
};

/** a rail fence across the field */
export const Fence: React.FC<{ x1: number; x2: number; y: number; t: number; pen: Pen; seed: number }> = ({ x1, x2, y, t, pen, seed }) => {
  if (t <= 0) return null;
  const p = easeOut(prog(t, 0, 0.8));
  const posts: number[] = [];
  for (let x = x1; x <= x2; x += 110) posts.push(x);
  return (
    <g>
      <Sketch pen={pen} seed={seed} shape={{ kind: 'line', x1, y1: y, x2, y2: y }} strokeWidth={1.8} progress={p} />
      <Sketch pen={pen} seed={seed + 1} shape={{ kind: 'line', x1, y1: y + 18, x2, y2: y + 18 }} strokeWidth={1.8} progress={p} />
      {posts.map((px, i) => (
        <Sketch key={i} pen={pen} seed={seed + 2 + i} shape={{ kind: 'rect', x: px - 4, y: y - 12, w: 8, h: 42 }} fill={pen.palette.brown} roughness={0.6} strokeWidth={1.4} progress={prog(t, 0.2 + i * 0.03, 0.3)} />
      ))}
    </g>
  );
};

/** a round tree on a trunk (ground at gy), scaled about its foot */
export const Tree: React.FC<{ x: number; gy: number; scale?: number; t: number; pen: Pen; seed: number }> = ({ x, gy, scale = 1, t, pen, seed }) => {
  if (t <= 0) return null;
  const p1 = easeOut(prog(t, 0, 0.4)), p2 = easeOut(prog(t, 0.25, 0.5));
  return (
    <g transform={`translate(${x} ${gy}) scale(${scale}) translate(${-x} ${-gy})`}>
      <Sketch pen={pen} seed={seed} shape={{ kind: 'polygon', pts: [[x - 10, gy], [x - 8, gy - 90], [x + 8, gy - 90], [x + 10, gy]] }} fill={pen.palette.brown} progress={p1} />
      <Sketch pen={pen} seed={seed + 1} shape={{ kind: 'path', d: `M ${x} ${gy - 230} C ${x + 60} ${gy - 230}, ${x + 90} ${gy - 180}, ${x + 70} ${gy - 130} C ${x + 60} ${gy - 95}, ${x - 60} ${gy - 95}, ${x - 70} ${gy - 130} C ${x - 90} ${gy - 180}, ${x - 60} ${gy - 230}, ${x} ${gy - 230} Z` }} fill={pen.palette.green} progress={p2} />
    </g>
  );
};

/** a half-dial gauge: outline + ticks + needle; the fill sweeps with `value` (0..1) through a sector clip */
export const Gauge: React.FC<{ cx: number; cy: number; r: number; t: number; value: number; pen: Pen; seed: number; fill?: string }> = ({ cx, cy, r, t, value, pen, seed, fill }) => {
  if (t <= 0) return null;
  const p = easeOut(prog(t, 0, 0.6)), pt = easeOut(prog(t, 0.4, 0.4));
  const v = Math.max(0, Math.min(1, value));
  const ang = Math.PI - v * Math.PI;
  const nx = cx + Math.cos(ang) * r * 0.82, ny = cy - Math.sin(ang) * r * 0.82;
  const steps = 24;
  const pts: string[] = [`${cx},${cy}`];
  for (let i = 0; i <= steps; i++) { const a = Math.PI - v * Math.PI * (i / steps); pts.push(`${cx + Math.cos(a) * (r + 6)},${cy - Math.sin(a) * (r + 6)}`); }
  const clipId = `gauge-${seed}`;
  const half = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy} Z`;
  return (
    <g>
      <defs><clipPath id={clipId}><polygon points={pts.join(' ')} /></clipPath></defs>
      {v > 0.005 && (
        <g clipPath={`url(#${clipId})`}>
          <Sketch pen={pen} seed={seed + 1} shape={{ kind: 'path', d: half }} fill={fill ?? pen.palette.brown} stroke="none" />
        </g>
      )}
      <Sketch pen={pen} seed={seed} shape={{ kind: 'path', d: half }} progress={p} />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const a = Math.PI - (i / 6) * Math.PI;
        return <line key={i} x1={cx + Math.cos(a) * r * 0.86} y1={cy - Math.sin(a) * r * 0.86} x2={cx + Math.cos(a) * r * 0.96} y2={cy - Math.sin(a) * r * 0.96} stroke={pen.ink} strokeWidth={pen.inkWidth * 0.8} opacity={pt} />;
      })}
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={pen.ink} strokeWidth={pen.inkWidth + 1.5} strokeLinecap="round" opacity={pt} />
      <circle cx={cx} cy={cy} r={5} fill={pen.ink} opacity={pt} />
    </g>
  );
};

/** a rolling number (from -> to over dur), e.g. the year falling to 1918 */
export const RollNumber: React.FC<{ x: number; y: number; from: number; to: number; t: number; dur?: number; size: number; font: string; color: string; anchor?: 'start' | 'middle' | 'end' }> =
  ({ x, y, from, to, t, dur = 1, size, font, color, anchor = 'start' }) => {
    if (t <= 0) return null;
    const v = Math.round(from + (to - from) * easeOut(prog(t, 0, dur)));
    return <text x={x} y={y} fontFamily={`'${font}', cursive`} fontSize={size} fill={color} textAnchor={anchor} fontWeight="700">{v}</text>;
  };

/** a deterministic herd layout: n small horses scattered in a box, sorted back to front */
export const herdLayout = (n: number, box: { x1: number; x2: number; y1: number; y2: number }, seed = 7) => {
  let s = seed >>> 0;
  const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  const out: { x: number; y: number; sc: number; flip: boolean }[] = [];
  for (let i = 0; i < n; i++) {
    const y = box.y1 + rnd() * (box.y2 - box.y1);
    const depth = (y - box.y1) / (box.y2 - box.y1);
    out.push({ x: box.x1 + rnd() * (box.x2 - box.x1), y, sc: 0.17 + 0.13 * depth + rnd() * 0.03, flip: rnd() < 0.45 });
  }
  return out.sort((a, b) => a.y - b.y);
};

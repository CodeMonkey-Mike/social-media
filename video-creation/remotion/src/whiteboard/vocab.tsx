// whiteboard/vocab.tsx: the HAND-DRAWN WITH HAIR vocabulary (Mike's pick, 2026-10-30) as Remotion components.
// Every component takes the pen and a LOCAL time `t` (seconds since its cue; negative = not yet) and draws itself on
// over its own duration, part by part, the way a hand would: outline first, fill fading in behind it. Geometry is
// the same as the picker's styles/vocab.html so the dashboard frame and the render match.
import React from 'react';
import type { Pen } from './pen';
import { Sketch, prog, easeOut, pop } from './Sketch';

/** soft ground shadow under anything that stands (never outlined, never rough) */
export const Shadow: React.FC<{ cx: number; cy: number; rx: number; ry: number; t: number; dark?: boolean }> = ({ cx, cy, rx, ry, t, dark }) => {
  if (t <= 0) return null;
  return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={dark ? '#ffffff' : '#000000'} opacity={0.08 * easeOut(prog(t, 0, 0.4))} />;
};

/**
 * typewriter text: types left to right from the final left edge (centered text does not shift while typing).
 * `spacing` (em) adds letter-spacing: display hand-fonts fuse adjacent digits ("170K" read "1TOK" in Gochi Hand at
 * 72 px, visual-qa 2026-11-02), so numbers in the heading font take ~0.1 em; the centering estimate includes it.
 */
export const Type: React.FC<{
  x: number; y: number; text: string; t: number; cps?: number; size: number; font: string; color: string;
  anchor?: 'start' | 'middle' | 'end'; weight?: string | number; charW?: number; spacing?: number;
}> = ({ x, y, text, t, cps = 24, size, font, color, anchor = 'middle', weight = 'normal', charW = 0.42, spacing = 0 }) => {
  if (t <= 0) return null;
  const n = Math.min(text.length, Math.floor(t * cps) + 1);
  const shown = text.slice(0, n);
  const full = text.length * size * charW + Math.max(0, text.length - 1) * spacing * size;
  const left = anchor === 'middle' ? x - full / 2 : anchor === 'end' ? x - full : x;
  return (
    <text x={left} y={y} fontFamily={`'${font}', cursive`} fontSize={size} fill={color} fontWeight={weight} textAnchor="start" letterSpacing={spacing ? spacing * size : undefined}>
      {shown}
    </text>
  );
};

/** count-up number, e.g. "20%" */
export const CountUp: React.FC<{ x: number; y: number; to: number; suffix?: string; t: number; dur?: number; size: number; font: string; color: string }> =
  ({ x, y, to, suffix = '', t, dur = 0.8, size, font, color }) => {
    if (t <= 0) return null;
    const v = Math.round(to * easeOut(prog(t, 0, dur)));
    return <text x={x} y={y} fontFamily={`'${font}', cursive`} fontSize={size} fill={color} textAnchor="middle" fontWeight="700">{v}{suffix}</text>;
  };

export type Hair = 'cap' | 'curly' | 'bob' | 'bun';

/**
 * a person: round head, hair, tapered shirt, stick limbs; optionally holding a phone. Draws on over 1.2 s.
 * `phone`: true = the original pose (a blue slab held out at waist height, kept as-is for the scenes built on it);
 * 'ear' = ON A CALL: the right arm bends up and a real handset (dark rounded body, inset lit screen, home dot) is held
 * against the right ear, the hand over its lower end (visual-qa 2026-11-02: the slab "reads as a blue block, not a
 * phone"). Studied from a handset icon: body about 1:2.1, screen inset ~3 px, a dot below the screen.
 * `shadow`: 'cue' (default, the shipped beats' frames) fades the floor shadow in from the cue, so for ~0.4 s it sits under
 * a head alone; 'legs' gates it to the legs' draw-on (stage 0.66 of `dur`), so the shadow appears under feet (quant WB14,
 * visual-qa 2026-11-05: "a shadow sits under nothing"). Opt-in so the shipped beats keep their frames; new beats use 'legs'.
 * 'feet' gates it to the FEET (stage 0.88: both legs complete, the feet landing): with 'legs' the shadow is already in
 * while the legs are still drawing, the feet 27 / 51 px above it (quant WB8, visual-qa 2026-11-05). Newer beats use 'feet'.
 * `gaze`: 'right' (default, the shipped frames: eyes and mouth toward the right) or 'left' (mirrored about the head's
 * centre), so a figure LOOKS AT the thing arriving on its left (quant WB6, visual-qa 2026-11-05: the lender "looks up and
 * AWAY from the stack landing on his left"). The hair, the arms and the hand-held things are unchanged.
 */
export const Person: React.FC<{ x: number; gy: number; t: number; pen: Pen; seed: number; hair?: Hair; shirt: string; tie?: boolean; phone?: boolean | 'ear'; reach?: boolean; dur?: number; curlArc?: [number, number]; shadow?: 'cue' | 'legs' | 'feet'; gaze?: 'right' | 'left' }> =
  ({ x, gy, t, pen, seed, hair = 'cap', shirt, tie, phone, reach, dur = 1.2, curlArc, shadow = 'cue', gaze = 'right' }) => {
    if (t <= 0) return null;
    const ty = gy - 215, by = gy - 112, hy = ty - 42;
    const P = (a: number, b: number) => prog(t, a * dur, (b - a) * dur); // stage a..b of the draw (fractions)
    const ink = pen.ink;
    const s = seed * 10;
    const shadowT = shadow === 'feet' ? t - 0.88 * dur : shadow === 'legs' ? t - 0.66 * dur : t;
    const gz = gaze === 'left' ? -1 : 1;                                   // mirrors the face's x offsets about the head's centre
    return (
      <g>
        <Shadow cx={x} cy={gy + 4} rx={44} ry={8} t={shadowT} dark={pen.bg !== '#ffffff' && pen.floor === null} />
        {/* head */}
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'circle', cx: x, cy: hy, r: 34 }} fill={pen.light} progress={P(0, 0.22)} />
        {/* hair */}
        {hair === 'cap' && <Sketch pen={pen} seed={s + 2} fill={pen.dark} progress={P(0.18, 0.38)}
          shape={{ kind: 'path', d: `M ${x - 34} ${hy - 4} C ${x - 32} ${hy - 44}, ${x + 32} ${hy - 44}, ${x + 34} ${hy - 4} C ${x + 22} ${hy - 18}, ${x - 2} ${hy - 24}, ${x - 34} ${hy - 4} Z` }} />}
        {hair === 'bob' && <Sketch pen={pen} seed={s + 2} fill={pen.dark} progress={P(0.18, 0.38)}
          shape={{ kind: 'path', d: `M ${x - 37} ${hy + 22} L ${x - 37} ${hy - 4} C ${x - 34} ${hy - 44}, ${x + 34} ${hy - 44}, ${x + 37} ${hy - 4} L ${x + 37} ${hy + 16} C ${x + 31} ${hy + 6}, ${x + 27} ${hy - 10}, ${x + 22} ${hy - 20} C ${x + 6} ${hy - 12}, ${x - 14} ${hy - 8}, ${x - 28} ${hy + 4} Z` }} />}
        {/* curly: seven curls on an arc over the crown. The shipped arc (1.08..1.92 pi at R 32) drops its last curl over the
            right eye (quant WB4, visual-qa 2026-11-05: a small figure read as winking); `curlArc` (in pi units) moves the run
            and lifts it to R 34 so both eyes show, opt-in so the shipped beats keep their frames */}
        {hair === 'curly' && [0, 1, 2, 3, 4, 5, 6].map((i) => {
          const [a0, a1] = curlArc ?? [1.08, 1.92];
          const a = Math.PI * (a0 + (i * (a1 - a0)) / 6), R = curlArc ? 34 : 32;
          return <Sketch key={i} pen={pen} seed={s + 20 + i} fill={pen.dark} roughness={0.5} progress={P(0.18 + i * 0.02, 0.38 + i * 0.02)}
            shape={{ kind: 'circle', cx: x + Math.cos(a) * R, cy: hy + Math.sin(a) * R, r: 11 }} />;
        })}
        {hair === 'bun' && <>
          <Sketch pen={pen} seed={s + 2} fill={pen.dark} progress={P(0.18, 0.36)}
            shape={{ kind: 'path', d: `M ${x - 34} ${hy - 4} C ${x - 32} ${hy - 44}, ${x + 32} ${hy - 44}, ${x + 34} ${hy - 4} C ${x + 20} ${hy - 20}, ${x - 10} ${hy - 22}, ${x - 34} ${hy - 4} Z` }} />
          <Sketch pen={pen} seed={s + 3} fill={pen.dark} roughness={0.5} progress={P(0.3, 0.4)} shape={{ kind: 'circle', cx: x - 26, cy: hy - 36, r: 11 }} />
        </>}
        {/* face: eyes toward the gaze side, a small mouth */}
        <Sketch pen={pen} seed={s + 4} fill={pen.dark} roughness={0.3} progress={P(0.86, 0.92)} shape={{ kind: 'circle', cx: x + 6 * gz, cy: hy - 4, r: 3.2 }} />
        <Sketch pen={pen} seed={s + 5} fill={pen.dark} roughness={0.3} progress={P(0.88, 0.94)} shape={{ kind: 'circle', cx: x + 20 * gz, cy: hy - 4, r: 3.2 }} />
        <Sketch pen={pen} seed={s + 6} strokeWidth={pen.inkWidth} progress={P(0.92, 1)} shape={{ kind: 'line', x1: x + 8 * gz, y1: hy + 14, x2: x + 18 * gz, y2: hy + 13 }} />
        {/* torso: rounded shoulders, tapered to the hips */}
        <Sketch pen={pen} seed={s + 7} fill={shirt} progress={P(0.3, 0.62)}
          shape={{ kind: 'path', d: `M ${x - 30} ${ty + 10} C ${x - 32} ${ty + 2}, ${x - 24} ${ty - 2}, ${x - 16} ${ty} L ${x + 16} ${ty} C ${x + 24} ${ty - 2}, ${x + 32} ${ty + 2}, ${x + 30} ${ty + 10} L ${x + 23} ${by} L ${x - 23} ${by} Z` }} />
        {tie && <Sketch pen={pen} seed={s + 8} fill={pen.palette.green} roughness={0.6} progress={P(0.6, 0.72)}
          shape={{ kind: 'path', d: `M ${x - 5} ${ty + 2} L ${x + 5} ${ty + 2} L ${x + 3} ${ty + 46} L ${x} ${ty + 54} L ${x - 3} ${ty + 46} Z` }} />}
        {/* arms */}
        <Sketch pen={pen} seed={s + 9} progress={P(0.55, 0.72)} shape={{ kind: 'line', x1: x - 29, y1: ty + 14, x2: x - 36, y2: ty + 96 }} />
        <Sketch pen={pen} seed={s + 10} fill={pen.light} roughness={0.5} progress={P(0.7, 0.78)} shape={{ kind: 'circle', cx: x - 37, cy: ty + 102, r: 6 }} />
        {phone === 'ear' ? (
          <>
            {/* upper arm out, forearm up to the ear; the handset beside the head (right of the hair's x+37 edge), the hand last so it sits over the phone's lower end */}
            <Sketch pen={pen} seed={s + 11} progress={P(0.55, 0.74)} shape={{ kind: 'path', d: `M ${x + 29} ${ty + 14} L ${x + 70} ${ty + 44} L ${x + 58} ${hy + 26}` }} />
            <Sketch pen={pen} seed={s + 12} fill={pen.dark} roughness={0.5} progress={P(0.72, 0.86)} shape={{ kind: 'path', d: `M ${x + 45} ${hy - 12} L ${x + 59} ${hy - 12} Q ${x + 64} ${hy - 12} ${x + 64} ${hy - 7} L ${x + 64} ${hy + 33} Q ${x + 64} ${hy + 38} ${x + 59} ${hy + 38} L ${x + 45} ${hy + 38} Q ${x + 40} ${hy + 38} ${x + 40} ${hy + 33} L ${x + 40} ${hy - 7} Q ${x + 40} ${hy - 12} ${x + 45} ${hy - 12} Z` }} />
            <Sketch pen={pen} seed={s + 17} fill={pen.palette.blue} stroke="none" roughness={0.3} progress={P(0.84, 0.92)} shape={{ kind: 'rect', x: x + 43, y: hy - 8, w: 18, h: 36 }} />
            {P(0.9, 0.94) > 0 && <circle cx={x + 52} cy={hy + 33} r={2} fill={pen.light} opacity={P(0.9, 0.94)} />}
            <Sketch pen={pen} seed={s + 18} fill={pen.light} roughness={0.5} progress={P(0.86, 0.94)} shape={{ kind: 'circle', cx: x + 56, cy: hy + 28, r: 6 }} />
          </>
        ) : phone ? (
          <>
            <Sketch pen={pen} seed={s + 11} progress={P(0.55, 0.72)} shape={{ kind: 'line', x1: x + 29, y1: ty + 14, x2: x + 82, y2: ty + 72 }} />
            <Sketch pen={pen} seed={s + 12} fill={pen.palette.blue} progress={P(0.72, 0.9)} shape={{ kind: 'rect', x: x + 72, y: ty + 30, w: 50, h: 90 }} />
          </>
        ) : reach ? (
          <>
            <Sketch pen={pen} seed={s + 11} progress={P(0.55, 0.72)} shape={{ kind: 'line', x1: x + 29, y1: ty + 14, x2: x + 104, y2: ty + 66 }} />
            <Sketch pen={pen} seed={s + 12} fill={pen.light} roughness={0.5} progress={P(0.7, 0.78)} shape={{ kind: 'circle', cx: x + 109, cy: ty + 70, r: 6 }} />
          </>
        ) : (
          <>
            <Sketch pen={pen} seed={s + 11} progress={P(0.55, 0.72)} shape={{ kind: 'line', x1: x + 29, y1: ty + 14, x2: x + 36, y2: ty + 96 }} />
            <Sketch pen={pen} seed={s + 12} fill={pen.light} roughness={0.5} progress={P(0.7, 0.78)} shape={{ kind: 'circle', cx: x + 37, cy: ty + 102, r: 6 }} />
          </>
        )}
        {/* legs + feet */}
        <Sketch pen={pen} seed={s + 13} progress={P(0.66, 0.84)} shape={{ kind: 'line', x1: x - 10, y1: by, x2: x - 14, y2: gy - 4 }} />
        <Sketch pen={pen} seed={s + 14} progress={P(0.7, 0.88)} shape={{ kind: 'line', x1: x + 10, y1: by, x2: x + 14, y2: gy - 4 }} />
        <Sketch pen={pen} seed={s + 15} progress={P(0.84, 0.92)} shape={{ kind: 'line', x1: x - 22, y1: gy - 4, x2: x - 6, y2: gy - 4 }} />
        <Sketch pen={pen} seed={s + 16} progress={P(0.88, 0.96)} shape={{ kind: 'line', x1: x + 6, y1: gy - 4, x2: x + 24, y2: gy - 4 }} />
      </g>
    );
  };

/** an envelope (the "fee" / "email" token), centered at cx,cy; pops in over 0.3 s */
export const Envelope: React.FC<{ cx: number; cy: number; t: number; pen: Pen; seed: number; opacity?: number }> = ({ cx, cy, t, pen, seed, opacity = 1 }) => {
  if (t <= 0) return null;
  const k = pop(prog(t, 0, 0.3));
  const w = 150, h = 100;
  return (
    <g transform={`translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})`} opacity={opacity}>
      <Sketch pen={pen} seed={seed} fill={pen.palette.blue} shape={{ kind: 'rect', x: cx - w / 2, y: cy - h / 2, w, h }} />
      <Sketch pen={pen} seed={seed + 1} shape={{ kind: 'path', d: `M ${cx - w / 2} ${cy - h / 2} L ${cx} ${cy + 15} L ${cx + w / 2} ${cy - h / 2}` }} />
    </g>
  );
};

/** the vault: a box with a dial on a base plate. Draws on over 0.9 s; `spin` turns the dial (degrees). */
export const Vault: React.FC<{ x: number; y: number; t: number; pen: Pen; seed: number; spin?: number; dur?: number }> = ({ x, y, t, pen, seed, spin = 0, dur = 0.9 }) => {
  if (t <= 0) return null;
  const P = (a: number, b: number) => prog(t, a * dur, (b - a) * dur);
  const w = 320, h = 300, cx = x + w / 2, cy = y + h / 2;
  const s = seed * 10;
  return (
    <g>
      <Shadow cx={cx} cy={y + h + 30} rx={210} ry={12} t={t} />
      <Sketch pen={pen} seed={s + 1} fill={pen.palette.grey} progress={P(0, 0.42)} shape={{ kind: 'rect', x, y, w, h }} />
      <Sketch pen={pen} seed={s + 2} fill={pen.palette.brown} progress={P(0.3, 0.5)} shape={{ kind: 'rect', x: x - 40, y: y + h, w: w + 80, h: 26 }} />
      <g transform={`rotate(${spin} ${cx} ${cy})`}>
        <Sketch pen={pen} seed={s + 3} fill={pen.light} progress={P(0.45, 0.7)} shape={{ kind: 'circle', cx, cy, r: 72 }} />
        <Sketch pen={pen} seed={s + 4} progress={P(0.66, 0.82)} shape={{ kind: 'line', x1: cx, y1: cy - 72, x2: cx, y2: cy + 72 }} />
        <Sketch pen={pen} seed={s + 5} progress={P(0.7, 0.86)} shape={{ kind: 'line', x1: cx - 72, y1: cy, x2: cx + 72, y2: cy }} />
        <Sketch pen={pen} seed={s + 6} fill={pen.palette.gold} progress={P(0.82, 1)} shape={{ kind: 'circle', cx, cy, r: 28 }} />
      </g>
    </g>
  );
};

/** a gold coin with a ₿, pops in over 0.35 s */
export const Coin: React.FC<{ cx: number; cy: number; t: number; pen: Pen; seed: number; font: string; r?: number }> = ({ cx, cy, t, pen, seed, font, r = 46 }) => {
  if (t <= 0) return null;
  const k = pop(prog(t, 0, 0.35));
  return (
    <g transform={`translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})`}>
      <Sketch pen={pen} seed={seed} fill={pen.palette.gold} shape={{ kind: 'circle', cx, cy, r }} />
      <text x={cx} y={cy + r * 0.36} fontFamily={`'${font}', cursive`} fontSize={r * 1.05} fill={pen.ink} textAnchor="middle">₿</text>
    </g>
  );
};

/** a green check mark, draws on over 0.4 s */
export const Check: React.FC<{ x: number; y: number; t: number; pen: Pen; seed: number; size?: number }> = ({ x, y, t, pen, seed, size = 1 }) => {
  if (t <= 0) return null;
  const d = `M ${x} ${y} L ${x + 40 * size} ${y + 40 * size} L ${x + 120 * size} ${y - 50 * size}`;
  return <Sketch pen={pen} seed={seed} stroke={pen.palette.green} strokeWidth={pen.inkWidth + 5} progress={easeOut(prog(t, 0, 0.4))} shape={{ kind: 'path', d }} />;
};

/** a red strike-through, draws on over 0.5 s */
export const Strike: React.FC<{ x1: number; x2: number; y: number; t: number; pen: Pen; seed: number }> = ({ x1, x2, y, t, pen, seed }) => {
  if (t <= 0) return null;
  return <Sketch pen={pen} seed={seed} stroke={pen.palette.red} strokeWidth={pen.inkWidth + 5} progress={easeOut(prog(t, 0, 0.5))} shape={{ kind: 'line', x1, y1: y, x2, y2: y }} />;
};

/** a bar chart: axes draw on, then each bar rises from the baseline (clip reveal, so the hand-drawn outline never boils) */
export const BarChart: React.FC<{ x: number; baseline: number; bars: { h: number; w?: number; fill: string }[]; gap?: number; t: number; barAt: number[]; barDur?: number; pen: Pen; seed: number; axisLen?: { x: number; y: number } }> =
  ({ x, baseline, bars, gap = 40, t, barAt, barDur = 0.45, pen, seed, axisLen = { x: 460, y: 260 } }) => {
    if (t <= 0) return null;
    const s = seed * 10;
    const clipId = `bars-${seed}`;
    return (
      <g>
        <Sketch pen={pen} seed={s + 1} progress={easeOut(prog(t, 0, 0.5))} shape={{ kind: 'line', x1: x - 40, y1: baseline, x2: x - 40 + axisLen.x, y2: baseline }} />
        <Sketch pen={pen} seed={s + 2} progress={easeOut(prog(t, 0.1, 0.5))} shape={{ kind: 'line', x1: x - 40, y1: baseline, x2: x - 40, y2: baseline - axisLen.y }} />
        <defs>
          {bars.map((b, i) => {
            const w = b.w ?? 80, bx = x + i * (w + gap);
            const p = easeOut(prog(t, barAt[i], barDur));
            return <clipPath key={i} id={`${clipId}-${i}`}><rect x={bx - 12} y={baseline - b.h * p - 12} width={w + 24} height={b.h * p + 14} /></clipPath>;
          })}
        </defs>
        {bars.map((b, i) => {
          const w = b.w ?? 80, bx = x + i * (w + gap);
          if (t < barAt[i]) return null;
          return (
            <g key={i} clipPath={`url(#${clipId}-${i})`}>
              <Sketch pen={pen} seed={s + 10 + i} fill={b.fill} shape={{ kind: 'rect', x: bx, y: baseline - b.h, w, h: b.h }} />
            </g>
          );
        })}
      </g>
    );
  };

/** a dashed flight arc (quadratic bezier) revealed left to right, with a sketched arrowhead at the end */
export const DashedArc: React.FC<{ p0: [number, number]; p1: [number, number]; p2: [number, number]; t: number; pen: Pen; seed: number; dur?: number }> =
  ({ p0, p1, p2, t, pen, seed, dur = 0.8 }) => {
    if (t <= 0) return null;
    const p = easeOut(prog(t, 0, dur));
    const minX = Math.min(p0[0], p1[0], p2[0]) - 20, maxX = Math.max(p0[0], p1[0], p2[0]) + 20;
    const clipId = `arc-${seed}`;
    const end = bezier(p0, p1, p2, 1), near = bezier(p0, p1, p2, 0.94);
    const ang = Math.atan2(end[1] - near[1], end[0] - near[0]);
    const head = `M ${end[0] - 34 * Math.cos(ang - 0.5)} ${end[1] - 34 * Math.sin(ang - 0.5)} L ${end[0]} ${end[1]} L ${end[0] - 34 * Math.cos(ang + 0.5)} ${end[1] - 34 * Math.sin(ang + 0.5)}`;
    return (
      <g>
        <defs><clipPath id={clipId}><rect x={minX} y={0} width={(maxX - minX) * p} height={1080} /></clipPath></defs>
        <path d={`M ${p0[0]} ${p0[1]} Q ${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]}`} fill="none" stroke={pen.ink} strokeWidth={pen.inkWidth + 1} strokeDasharray="18 16" strokeLinecap="round" clipPath={`url(#${clipId})`} />
        <Sketch pen={pen} seed={seed} progress={easeOut(prog(t, dur * 0.85, dur * 0.3))} shape={{ kind: 'path', d: head }} />
      </g>
    );
  };

/** point on a quadratic bezier */
export const bezier = (p0: [number, number], p1: [number, number], p2: [number, number], u: number): [number, number] => {
  const v = Math.max(0, Math.min(1, u)), a = (1 - v) * (1 - v), b = 2 * (1 - v) * v, c = v * v;
  return [a * p0[0] + b * p1[0] + c * p2[0], a * p0[1] + b * p1[1] + c * p2[1]];
};

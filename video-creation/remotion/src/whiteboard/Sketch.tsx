// whiteboard/Sketch.tsx: ONE hand-drawn shape, drawn through rough.js with the pen, that can DRAW ON.
//
// rough.js is used as a pure generator (rough.generator().toPaths): no DOM, deterministic per `seed`, so a shape's
// wobble is identical on every frame (no boil) and identical across renders. The generator returns the shape as
// path records: fill records (stroke 'none') and stroke records. Draw-on uses the SVG `pathLength="1"`
// normalisation, so `strokeDashoffset = 1 - progress` reveals any path without measuring it. Fills fade in with
// `fillIn`. Multi-stroke is disabled so a stroke draws once, like a pen, not twice like a sketch pass.
import React, { useMemo } from 'react';
import rough from 'roughjs';
import type { Pen } from './pen';

export type Shape =
  | { kind: 'path'; d: string }
  | { kind: 'rect'; x: number; y: number; w: number; h: number }
  | { kind: 'circle'; cx: number; cy: number; r: number }
  | { kind: 'ellipse'; cx: number; cy: number; rx: number; ry: number }
  | { kind: 'line'; x1: number; y1: number; x2: number; y2: number }
  | { kind: 'polygon'; pts: [number, number][] };

type Props = {
  shape: Shape;
  pen: Pen;
  seed: number;
  /** fill color; omitted = outline only */
  fill?: string;
  /** stroke color; default pen.ink; 'none' = no outline */
  stroke?: string;
  strokeWidth?: number;
  /** 0..1 how much of the outline is drawn (default 1) */
  progress?: number;
  /** 0..1 fill opacity (default: follows progress, fully in once the outline is complete) */
  fillIn?: number;
  /** override the pen's roughness (scaled groups pass a smaller value) */
  roughness?: number;
  opacity?: number;
  /**
   * Reveal the outline's sub-paths ONE AFTER ANOTHER (like a pen) instead of all at once. rough.js emits a separate
   * `M` sub-path per curve / edge, and Chrome restarts the dash pattern at every sub-path, so a long path (a fence
   * rail of two arcs, a 300-degree loop) otherwise draws every piece simultaneously from its own start (quant WB2,
   * visual-qa 2026-11-04: "a section of front fence rail floats on its own"). Opt-in so the shipped beats keep their
   * frames; use it on any stroke longer than a glyph.
   */
  sequential?: boolean;
};

/** split a rough.js path string into its `M` sub-paths with an approximate length each (chord / control-polygon mean) */
const subPaths = (d: string): { d: string; len: number }[] => {
  const out: { d: string; len: number }[] = [];
  const parts = d.split(/(?=M)/).map((x) => x.trim()).filter(Boolean);
  for (const sp of parts) {
    let len = 0, cx = 0, cy = 0;
    const re = /([MLC])([^MLC]*)/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(sp))) {
      const nums = (m[2].match(/-?\d*\.?\d+(?:e-?\d+)?/g) ?? []).map(Number);
      if (m[1] === 'M' && nums.length >= 2) { cx = nums[0]; cy = nums[1]; }
      else if (m[1] === 'L') { for (let i = 0; i + 1 < nums.length; i += 2) { len += Math.hypot(nums[i] - cx, nums[i + 1] - cy); cx = nums[i]; cy = nums[i + 1]; } }
      else if (m[1] === 'C') {
        for (let i = 0; i + 5 < nums.length; i += 6) {
          const poly = Math.hypot(nums[i] - cx, nums[i + 1] - cy) + Math.hypot(nums[i + 2] - nums[i], nums[i + 3] - nums[i + 1]) + Math.hypot(nums[i + 4] - nums[i + 2], nums[i + 5] - nums[i + 3]);
          const chord = Math.hypot(nums[i + 4] - cx, nums[i + 5] - cy);
          len += (poly + chord) / 2; cx = nums[i + 4]; cy = nums[i + 5];
        }
      }
    }
    out.push({ d: sp, len: Math.max(len, 0.01) });
  }
  return out;
};

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export const Sketch: React.FC<Props> = ({ shape, pen, seed, fill, stroke, strokeWidth, progress = 1, fillIn, roughness, opacity = 1, sequential = false }) => {
  const paths = useMemo(() => {
    const gen = rough.generator();
    const wantFill = !!fill && fill !== 'none' && pen.fillStyle !== 'none';
    const st = stroke === undefined ? (pen.fillStyle === 'none' && fill && fill !== 'none' && fill !== pen.light ? fill : pen.ink) : stroke;
    const o: Record<string, unknown> = {
      seed,
      roughness: roughness ?? pen.roughness,
      bowing: pen.bowing,
      stroke: st,
      strokeWidth: strokeWidth ?? pen.inkWidth,
      fillStyle: pen.fillStyle === 'none' ? 'solid' : pen.fillStyle,
      fillWeight: pen.fillWeight,
      hachureGap: pen.hachureGap,
      hachureAngle: -41,
      disableMultiStroke: true,
      preserveVertices: true,
    };
    if (wantFill) o.fill = fill;
    let d;
    switch (shape.kind) {
      case 'path': d = gen.path(shape.d, o); break;
      case 'rect': d = gen.rectangle(shape.x, shape.y, shape.w, shape.h, o); break;
      case 'circle': d = gen.circle(shape.cx, shape.cy, shape.r * 2, o); break;
      case 'ellipse': d = gen.ellipse(shape.cx, shape.cy, shape.rx * 2, shape.ry * 2, o); break;
      case 'line': d = gen.line(shape.x1, shape.y1, shape.x2, shape.y2, o); break;
      case 'polygon': d = gen.polygon(shape.pts, o); break;
    }
    return gen.toPaths(d);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(shape), pen.id, seed, fill, stroke, strokeWidth, roughness]);

  const p = clamp01(progress);
  const fi = clamp01(fillIn ?? (p >= 1 ? 1 : Math.max(0, (p - 0.6) / 0.4)));
  if (p <= 0 && fi <= 0) return null;
  return (
    <g opacity={opacity}>
      {paths.map((pi, i) => {
        const isFill = pi.stroke === 'none' || pi.stroke === undefined;
        if (isFill) {
          return <path key={i} d={pi.d} fill={pi.fill} stroke="none" opacity={fi} />;
        }
        if (sequential) {
          const subs = subPaths(pi.d), total = subs.reduce((a, b) => a + b.len, 0);
          let acc = 0;
          return (
            <g key={i}>
              {subs.map((sp, j) => {
                const start = acc / total, frac = sp.len / total;
                acc += sp.len;
                const lp = clamp01((p - start) / frac);
                if (lp <= 0) return null;
                return (
                  <path key={j} d={sp.d} fill="none" stroke={pi.stroke} strokeWidth={pi.strokeWidth} strokeLinecap="round" strokeLinejoin="round"
                    pathLength={1} strokeDasharray={1} strokeDashoffset={1 - lp} />
                );
              })}
            </g>
          );
        }
        return (
          <path
            key={i}
            d={pi.d}
            fill="none"
            stroke={pi.stroke}
            strokeWidth={pi.strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - p}
          />
        );
      })}
    </g>
  );
};

/** progress 0..1 of a cue that starts at `start` seconds and lasts `dur` seconds, at time `t` */
export const prog = (t: number, start: number, dur: number) => clamp01((t - start) / dur);
/** ease-out for draw-ons (fast start, soft landing) */
export const easeOut = (x: number) => 1 - Math.pow(1 - clamp01(x), 2.2);
/** a little overshoot pop for appearing objects */
export const pop = (x: number) => { const v = clamp01(x); return v >= 1 ? 1 : 1.08 * Math.sin(v * Math.PI * 0.5) ** 0.9 * (1 - 0.08 * v); };

import React from 'react';
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { TransitionProps } from '../types';

export type GlitchInvertParams = {
  /** Source keyframe grid (the pack authors at 25fps -> 0.04s). */
  stepSeconds: number;
  /** Per step, the ACTIVE ops in APPLICATION order (tint, listed last in the source
   * component stack, applies FIRST — the stack renders bottom-up; verified vs preview).
   * Ops: inv0=RGB negate · inv2=green negate · inv6=hue invert · inv7=lightness invert
   * · inv12=YIQ in-phase chroma negate · tint=grayscale(601). Empty = clean frame. */
  steps: string[][];
  /** A->B cut fraction (the boundary between the two source adjustment clips). */
  swapAt: number;
};

/** feColorMatrix rows for the linear ops. All ops are real AE Invert channels decoded
 * from the project (channel enum 0-based counting popup separators) and verified
 * numerically against the pack previews. */
const MATRICES: Record<string, string> = {
  // R'=1-R G'=1-G B'=1-B — AE Invert channel RGB
  inv0: '-1 0 0 0 1  0 -1 0 0 1  0 0 -1 0 1  0 0 0 1 0',
  // G'=1-G — AE Invert channel Green
  inv2: '1 0 0 0 0  0 -1 0 0 1  0 0 1 0 0  0 0 0 1 0',
  // YIQ I -> -I (Ti·diag(1,-1,1)·T, exact linear involution) — channel In Phase Chrominance
  inv12:
    '-0.139755 0.523982 0.615774 0 0  0.325045 0.850567 -0.175611 0 0  1.315663 -0.604852 0.289189 0 0  0 0 0 1 0',
  // AE Tint black->black white->white @100% = Rec601 luma grayscale
  tint: '0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0 0 0 1 0',
};

// spread one channel to R=G=B (building blocks for per-pixel max/min)
const SPREAD = [
  '1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 1 0',
  '0 1 0 0 0  0 1 0 0 0  0 1 0 0 0  0 0 0 1 0',
  '0 0 1 0 0  0 0 1 0 0  0 0 1 0 0  0 0 0 1 0',
];

/** EXACT hue / lightness inversion (verified identity, max error 1e-15):
 *    hueInvert(x)      = (max+min) - x   (preserves HSL L and S, rotates hue 180°)
 *    lightnessInvert(x) = 1 - hueInvert(x)   (= RGB negate ∘ hue invert)
 * Per-pixel max/min via channel spreads + lighten/darken feBlends, then one arithmetic
 * feComposite (2·avg − x, in [0,1] by construction). ALPHA GOTCHA: arithmetic
 * feComposite applies its k-formula to ALPHA too — the hue composite's k2=2,k3=−1
 * keeps alpha at 1, but folding the lightness negate into the k's (k2=−2,k3=1,k4=1)
 * zeroes alpha and the whole frame goes transparent/black. So lightness = the SAME
 * alpha-safe hue composite plus a trailing RGB-negate feColorMatrix (alpha untouched). */
const hlPrimitives = (op: 'inv6' | 'inv7', input: string, out: string, k: string): React.ReactNode[] => {
  const r = `${k}r`, g = `${k}g`, b = `${k}b`;
  const mx1 = `${k}x1`, mx = `${k}x`, mn1 = `${k}n1`, mn = `${k}n`, avg = `${k}a`;
  const hue = op === 'inv6' ? out : `${k}h`;
  const nodes: React.ReactNode[] = [
    <feColorMatrix key={r} in={input} type="matrix" values={SPREAD[0]} result={r} />,
    <feColorMatrix key={g} in={input} type="matrix" values={SPREAD[1]} result={g} />,
    <feColorMatrix key={b} in={input} type="matrix" values={SPREAD[2]} result={b} />,
    <feBlend key={mx1} in={r} in2={g} mode="lighten" result={mx1} />,
    <feBlend key={mx} in={mx1} in2={b} mode="lighten" result={mx} />,
    <feBlend key={mn1} in={r} in2={g} mode="darken" result={mn1} />,
    <feBlend key={mn} in={mn1} in2={b} mode="darken" result={mn} />,
    <feComposite key={avg} in={mx} in2={mn} operator="arithmetic" k1={0} k2={0.5} k3={0.5} k4={0} result={avg} />,
    <feComposite key={hue} in={avg} in2={input} operator="arithmetic" k1={0} k2={2} k3={-1} k4={0} result={hue} />,
  ];
  if (op === 'inv7') {
    nodes.push(<feColorMatrix key={out} in={hue} type="matrix" values={MATRICES.inv0} result={out} />);
  }
  return nodes;
};

/** Chain the active ops as filter primitives, threading in/result names. */
const primitivesFor = (ops: string[]): React.ReactNode[] => {
  let input = 'SourceGraphic';
  const nodes: React.ReactNode[] = [];
  ops.forEach((op, i) => {
    const out = `s${i}`;
    if (op === 'inv6' || op === 'inv7') {
      nodes.push(...hlPrimitives(op, input, out, `p${i}`));
    } else {
      nodes.push(<feColorMatrix key={out} in={input} type="matrix" values={MATRICES[op]} result={out} />);
    }
    input = out;
  });
  return nodes;
};

/**
 * GLITCH > Invert — pure color-op strobe from the project's REAL keyframes: each source
 * frame flashes a subset of AE Invert channels (+ a b/w Tint) over the full frame; the
 * A->B cut hides inside the strobe. No plates, no displacement — the schedule IS the look.
 * All six ops are exact in sRGB (the hue/lightness inversions via the (max+min)-x trick).
 *
 * NOTE: every distinct op-combo gets its OWN <filter>, all mounted statically for the
 * whole transition; per frame only the wrapper's style.filter url switches. Mutating
 * filter primitives in place between frames leaves Chromium's compiled filter graph
 * stale (step renders kept the previous frame's op-chain) — do not "optimize" this back
 * to a single dynamic filter.
 */
export const GlitchInvert: React.FC<TransitionProps & { params: GlitchInvertParams }> = ({
  from, to, fromSrc, toSrc, outClip, inClip, durationInFrames, params,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { stepSeconds, steps, swapAt } = params;

  const tSec = frame / fps;
  const step = Math.min(steps.length - 1, Math.max(0, Math.floor(tSec / stepSeconds)));
  const ops = steps[step] || [];

  const p = frame / Math.max(1, durationInFrames - 1);
  const swapTo = p >= swapAt;
  const src = swapTo ? toSrc : fromSrc;
  const clipFn = swapTo ? inClip : outClip;
  const content = swapTo ? to : from;

  const combos = React.useMemo(() => {
    const seen = new Set<string>();
    for (const s of steps) if (s.length) seen.add(s.join('-'));
    return [...seen];
  }, [steps]);

  const fid = 'gi-' + ops.join('-');

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', overflow: 'hidden' }}>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          {combos.map((combo) => (
            <filter key={combo} id={'gi-' + combo} colorInterpolationFilters="sRGB">
              {primitivesFor(combo.split('-'))}
            </filter>
          ))}
        </defs>
      </svg>
      <AbsoluteFill style={{ filter: ops.length ? `url(#${fid})` : undefined }}>
        {clipFn ? (
          clipFn()
        ) : src ? (
          <Img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          content
        )}
      </AbsoluteFill>
      {/* SFX is emitted by the wrapper (TransitionDemo / TransitionClip). */}
    </AbsoluteFill>
  );
};

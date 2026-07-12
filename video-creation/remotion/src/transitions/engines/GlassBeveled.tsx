import React from 'react';
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { TransitionProps } from '../types';

/**
 * GLASS / Beveled — faceted "beveled glass pane" push (12 variants: Beveled 1/2
 * x Up/Down/Left/Right + Beveled 3/4 x Horizontal/Vertical).
 *
 * Mechanism (per-clip extracted, _extract-glassbeveled.js -> _build-glassbeveled-rows.js,
 * FullHD project — masks decoded from the AEMask '2cin' binary paths):
 *   - Two "HST Adjustment" clips, (In) [0.04..0.4] and (Out) [0.4..end], each stack
 *     FIVE wrap-Offsets. Every Offset shifts exactly ONE full frame (0.5 -> 1.5 =
 *     identity at both ends) with a real temporal-bezier ease, and each is gated by
 *     an AEMask: a straight-edged quadrilateral SHARD (feather 0, opacity 100).
 *     The five shards' phases are TIME-STAGGERED (starts 0.04/0.12/0.20/0.24/0.28,
 *     0.76s each) — where shards overlap, the masked offsets COMPOUND (bottom-up
 *     adjustment chain), producing the faceted glass-refraction look.
 *   - Direction via PR Horizontal/Vertical Flip SANDWICHES around subsets of the
 *     stack. Resolved ANALYTICALLY by the builder (mirror the mask + negate the
 *     shift) — the engine sees flat stages. Beveled 3/4 flip only SOME shards
 *     (opposing-direction facets) and add a SIXTH unmasked full-frame base push.
 *   - The (In)/(Out) curves are exact continuations of each other (verified:
 *     same handles, same phase at the cut) — the A->B swap at the cut lands at
 *     peak faceting, which is what hides it. We still sample PIECEWISE per clip
 *     window (house rule from the OFFSET QA fix).
 *
 * Implementation: ONE SVG filter chain in the REAL bottom-up apply order. Per
 * stage: wrap-shift the running composite (two feOffset copies merged — exact
 * torus wrap, no feTile), clip the shifted copy to the shard polygon (feImage
 * data-URI mask + feComposite in), and lay it over the composite (feComposite
 * over). Filter remounted per frame via frame-keyed id (stale-compiled-filter
 * gotcha), sRGB interpolation, frame-cropped subregions on every stage.
 *
 * fidelity: near-1:1 — geometry, masks, easings, stagger and compositing order
 * are all real project data; the only approximation is Chromium's 8-bit raster
 * pipeline (no displacement maps involved, so no 8-bit-wall risk).
 */
type Handles = { iv?: number; ii?: number; ov?: number; oi?: number };
type CurveKf = { t: number; dx: number; dy: number } & Handles;

export type GlassBeveledStage = {
  /** Shard polygon anchors in normalized frame coords (straight edges — the
   * decoded paths carry tangents == anchors), builder-mirrored for flips.
   * null = the unmasked full-frame base push (Beveled 3/4 only). */
  mask: [number, number][] | null;
  /** PIECEWISE wrap-shift curves in SEQUENCE-time seconds ((In) clip before the
   * cut, (Out) after). dx,dy are shift fractions; one full wrap = ±1. */
  curveIn: CurveKf[];
  curveOut: CurveKf[];
};

export type GlassBeveledParams = {
  /** A->B swap fraction (0..1 of the window) = the (Out) clip's start / duration. */
  cut: number;
  /** Push axis of every stage in this row (all Beveled rows are single-axis). */
  axis: 'x' | 'y';
  /** Stages in REAL apply order (first-applied first = the pack's bottom-up chain). */
  stages: GlassBeveledStage[];
};

/** Wrap a shift fraction into [-0.5, 0.5) — the merged two-copy wrap covers it. */
const wrapFrac = (v: number) => ((v % 1) + 1.5) % 1 - 0.5;

const bez = (a: number, b: number, c: number, d: number, s: number) => {
  const u = 1 - s;
  return u * u * u * a + 3 * u * u * s * b + 3 * u * s * s * c + s * s * s * d;
};

/** REAL AE temporal-bezier progress across one keyframe segment (same evaluator
 * as OffsetSlide — velocity in value-units/sec, influence 0..1 of the segment). */
const segProgress = (
  t0: number, t1: number, h0: Handles, h1: Handles, L: number, t: number,
) => {
  const dt = t1 - t0;
  if (dt <= 0) return 1;
  const lin = (t - t0) / dt;
  if ((h0.oi === undefined && h1.ii === undefined) || L === 0) return lin;
  const oi = Math.min(1, Math.max(1e-4, h0.oi ?? 1 / 3));
  const ii = Math.min(1, Math.max(1e-4, h1.ii ?? 1 / 3));
  const c1t = t0 + oi * dt;
  const c2t = t1 - ii * dt;
  const c1p = ((h0.ov ?? 0) * oi * dt) / L;
  const c2p = 1 - ((h1.iv ?? 0) * ii * dt) / L;
  let lo = 0, hi = 1, s = lin;
  for (let i = 0; i < 40; i++) {
    s = (lo + hi) / 2;
    if (bez(t0, c1t, c2t, t1, s) < t) lo = s; else hi = s;
  }
  return bez(0, c1p, c2p, 1, s);
};

/** Sample the 2D shift curve (velocity normalized by the segment's path length). */
const sampleCurve2D = (kfs: CurveKf[], t: number) => {
  if (t <= kfs[0].t) return { x: kfs[0].dx, y: kfs[0].dy };
  const last = kfs[kfs.length - 1];
  if (t >= last.t) return { x: last.dx, y: last.dy };
  let i = 0;
  while (i < kfs.length - 2 && t > kfs[i + 1].t) i++;
  const a = kfs[i], b = kfs[i + 1];
  const L = Math.hypot(b.dx - a.dx, b.dy - a.dy);
  const p = segProgress(a.t, b.t, a, b, L, t);
  return { x: a.dx + (b.dx - a.dx) * p, y: a.dy + (b.dy - a.dy) * p };
};

/** Shard polygon -> white-fill SVG data URI for feImage (mask raster). */
const maskUri = (poly: [number, number][], W: number, H: number) => {
  const pts = poly.map(([nx, ny]) => `${(nx * W).toFixed(1)},${(ny * H).toFixed(1)}`).join(' ');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><polygon points="${pts}" fill="#ffffff"/></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const GlassBeveled: React.FC<TransitionProps & { params: GlassBeveledParams }> = ({
  from, to, fromSrc, toSrc, outClip, inClip, durationInFrames, params,
}) => {
  const frame = useCurrentFrame();
  const { width: W, height: H, fps } = useVideoConfig();
  const { cut, axis, stages } = params;

  const tSec = frame / fps;
  const p = frame / Math.max(1, durationInFrames - 1);
  const beforeCut = p < cut;

  const swapTo = p >= cut;
  const src = swapTo ? toSrc : fromSrc;
  const clipFn = swapTo ? inClip : outClip;
  const content = swapTo ? to : from;

  const scene = () =>
    clipFn ? clipFn() : src ? (
      <Img src={staticFile(src)} style={{ width: `${W}px`, height: `${H}px`, objectFit: 'cover' }} />
    ) : (
      <AbsoluteFill>{content}</AbsoluteFill>
    );

  // per-stage wrapped pixel shift this frame (piecewise: (In) curve before the cut)
  const shifts = stages.map((st) => {
    const { x, y } = sampleCurve2D(beforeCut ? st.curveIn : st.curveOut, tSec);
    return { dx: wrapFrac(x) * W, dy: wrapFrac(y) * H };
  });
  const active = shifts.some((s) => Math.abs(s.dx) > 0.01 || Math.abs(s.dy) > 0.01);

  const fid = `gbev-${frame}`;

  // The chain: prev -> [wrap-shift = two feOffset copies merged] -> clip to the
  // shard -> over prev. Frame-cropped subregion on every stage output so each
  // stage reads a frame-confined composite (exactly Premiere's adjustment chain).
  const prims: React.ReactNode[] = [];
  let prev = 'SourceGraphic';
  stages.forEach((st, i) => {
    const { dx, dy } = shifts[i];
    // second copy completes the torus wrap along the push axis
    const wx = axis === 'x' ? dx - Math.sign(dx || 1) * W : 0;
    const wy = axis === 'y' ? dy - Math.sign(dy || 1) * H : 0;
    prims.push(
      <feOffset key={`o${i}`} in={prev} dx={dx} dy={dy} result={`o${i}`} />,
      <feOffset key={`w${i}`} in={prev} dx={axis === 'x' ? wx : 0} dy={axis === 'y' ? wy : 0} result={`w${i}`} />,
      <feMerge key={`g${i}`} x={0} y={0} width={W} height={H} result={`g${i}`}>
        <feMergeNode in={`w${i}`} />
        <feMergeNode in={`o${i}`} />
      </feMerge>,
    );
    if (st.mask) {
      prims.push(
        <feImage key={`m${i}`} href={maskUri(st.mask, W, H)} x={0} y={0} width={W} height={H} preserveAspectRatio="none" result={`m${i}`} />,
        <feComposite key={`k${i}`} operator="in" in={`g${i}`} in2={`m${i}`} result={`k${i}`} />,
        <feComposite key={`s${i}`} operator="over" in={`k${i}`} in2={prev} x={0} y={0} width={W} height={H} result={`s${i}`} />,
      );
      prev = `s${i}`;
    } else {
      prev = `g${i}`; // unmasked base push replaces the whole composite
    }
  });

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', overflow: 'hidden' }}>
      {active && (
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            <filter
              id={fid}
              filterUnits="userSpaceOnUse"
              primitiveUnits="userSpaceOnUse"
              x={0}
              y={0}
              width={W}
              height={H}
              colorInterpolationFilters="sRGB"
            >
              {prims}
            </filter>
          </defs>
        </svg>
      )}
      <AbsoluteFill style={{ filter: active ? `url(#${fid})` : undefined }}>
        {scene()}
      </AbsoluteFill>
      {/* SFX (Skew_Simple_01 whip) is emitted from the wrapper. */}
    </AbsoluteFill>
  );
};

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
 * TRANSFORM — the pack's "camera flight" family: 8 subgroups (1/2/3/4 + Short
 * twins) x 4-8 directions = 40 sequences. A curved multi-wrap Offset push with
 * a ROTATING directional motion blur, flown through a full-window AE Basic 3D
 * camera wobble (Swivel/Tilt/Distance) over a Geometry2 uniform-scale ride.
 *
 * Mechanism (per-clip extracted, _extract-transform.js -> _build-transform-rows.js;
 * effect set is CLOSED: Alpha Adjust + Motion Blur + Offset + Basic 3D +
 * Geometry2 + H/V Flips — nothing else, all 40 assert-verified):
 *   - (In) [0.04..cut] / (Out) [cut..end] HST Adjustments each carry a densely
 *     25fps-baked 2D wrap-Offset CURVE (the push arcs, e.g. down then left; the
 *     (Out) starts multiple wraps out and settles to identity) + an AE Motion
 *     Blur whose Direction AND Blur Length are keyframed — the blur axis TRACKS
 *     the path tangent while the length ramps 0 -> ~334 -> 0 across the cut.
 *     Piecewise per clip (the OffsetSlide convention), swap A->B at the cut.
 *   - A full-window "3D" adjustment above: AE Basic 3D Swivel/Tilt/Distance
 *     (sparse real-bezier keyframes, e.g. Tilt 0 -> -44deg -> +9.6 -> 0) over a
 *     Geometry2 uniform scale (rides Scale HEIGHT, SW 100 ignored — the
 *     PERSPECTIVE rule) 100 -> 125 -> 108 -> 100. Bottom-up: scale first, then
 *     the 3D pose. Distance is negative = closer (zoom covers the tilt's edge
 *     exposure; our 3x3 wrap tiles cover the rest).
 *   - Direction variants are flip sandwiches around identical curves; previews
 *     prove content stays upright -> flips mirror the MOTION only, resolved
 *     analytically in the BUILDER (mirror offset axis + blur angle, negate
 *     swivel on H / tilt on V — the GLASS/MOTION pattern). Engine is flip-free.
 *
 * fidelity: approximate — geometry/curves/timing all real; the calibrated
 * pieces are the directional-blur constant (BLUR_K, OffsetSlide) and the
 * Basic 3D perspective mapping (PERSP_PX / DIST_PX_PER_UNIT, Motion3D).
 */
type Handles = { iv?: number; ii?: number; ov?: number; oi?: number };
type KF = { t: number; v: number } & Handles;
type CurveKf = { t: number; dx: number; dy: number } & Handles;

export type TransformFlyParams = {
  /** A->B swap fraction (0..1 of the window) = the (Out) clip's start / duration. */
  cut: number;
  /** Piecewise wrap-Offset curves in SEQUENCE-time seconds (dx,dy = raw - 0.5,
   * mirror-resolved; |v| > 0.5 = multiple wraps). Dense 25fps bake. */
  curveIn: CurveKf[];
  curveOut: CurveKf[];
  /** Per-clip motion blur: window [t0,t1] (seq-time), blur axis SCREEN angle
   * curve (deg from +x, y-down; already 90 - AE Direction, mirror-resolved)
   * and the AE Blur Length curve. Dense 25fps bake, same clip windows. */
  blurIn: { window: [number, number]; dir: KF[]; len: KF[] };
  blurOut: { window: [number, number]; dir: KF[]; len: KF[] };
  /** The full-window "3D" adjustment: Basic 3D pose curves (sparse, real
   * bezier handles; swivel/tilt mirror-resolved) + the Geometry2 uniform
   * scale ride (Scale Height %). Identity outside the window. */
  pose: {
    window: [number, number];
    swivel: KF[];
    tilt: KF[];
    dist: KF[];
    scaleH: KF[];
  };
};

/** Wrap a shift fraction into [-0.5, 0.5) so the 3x3 tiles always cover the frame. */
const wrapFrac = (v: number) => ((v % 1) + 1.5) % 1 - 0.5;

const bez = (a: number, b: number, c: number, d: number, s: number) => {
  const u = 1 - s;
  return u * u * u * a + 3 * u * u * s * b + 3 * u * s * s * c + s * s * s * d;
};
/** REAL AE temporal-bezier progress across one segment (the OffsetSlide sampler). */
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
const sampleKF = (kfs: KF[], t: number) => {
  if (!kfs.length) return 0;
  if (t <= kfs[0].t || kfs.length === 1) return kfs[0].v;
  const last = kfs[kfs.length - 1];
  if (t >= last.t) return last.v;
  let i = 0;
  while (i < kfs.length - 2 && t > kfs[i + 1].t) i++;
  const a = kfs[i], b = kfs[i + 1];
  const p = segProgress(a.t, b.t, a, b, b.v - a.v, t);
  return a.v + (b.v - a.v) * p;
};

/** stdDev of the horizontal Gaussian per unit of AE "Blur Length" — the
 * OffsetSlide calibration (variance-matched to a 2·length box, QA'd across
 * all 19 OFFSET sub-families). */
const BLUR_K = 0.55;
/** Basic 3D calibration (Motion3D, preview-matched): CSS perspective depth
 * and px of translateZ per Distance-to-Image unit (negative = closer). */
const PERSP_PX = 1600;
const DIST_PX_PER_UNIT = 12;

export const TransformFly: React.FC<TransitionProps & { params: TransformFlyParams }> = ({
  from, to, fromSrc, toSrc, outClip, inClip, params,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const { curveIn, curveOut, blurIn, blurOut, pose } = params;

  const tSec = frame / fps;
  // Swap at the (Out) clip's REAL window start (seq-time), not the frame
  // fraction: "Transform Short 3 - Right Down" cuts at 0.24s (its siblings cut
  // at 0.28), which falls BETWEEN 30fps frames — the fraction test fired one
  // frame early there, rendering B wrap-offset with ZERO blur (both the (Out)
  // curve and its blur window clamp outside their span) = a sharp glitch frame
  // (caught in the sweep QA). Time-based selection keeps every clip inside its
  // own window, exactly as Premiere composites them. `cut` stays in the params
  // for the wrapper/metadata.
  const cutT = blurOut.window[0];
  const beforeCut = tSec < cutT;

  // piecewise offset (the (In) clip's curve before the cut, the (Out)'s after)
  const { x: dx, y: dy } = sampleCurve2D(beforeCut ? curveIn : curveOut, tSec);
  const offX = wrapFrac(dx) * width;
  const offY = wrapFrac(dy) * height;

  // per-clip motion blur — direction curve TRACKS the path (keyframed, unlike
  // OFFSET's static axis), length gated by the clip window
  const mb = beforeCut ? blurIn : blurOut;
  const inWin = tSec >= mb.window[0] && tSec < mb.window[1];
  const len = inWin ? Math.max(0, sampleKF(mb.len, tSec)) : 0;
  const phi = sampleKF(mb.dir, tSec); // blur axis screen angle (deg)
  const sigma = len * BLUR_K;

  // the "3D" adjustment pose (identity outside its window; curves start/end at 0)
  const inPose = tSec >= pose.window[0] && tSec < pose.window[1];
  const swivel = inPose ? sampleKF(pose.swivel, tSec) : 0;
  const tilt = inPose ? sampleKF(pose.tilt, tSec) : 0;
  const dist = inPose ? sampleKF(pose.dist, tSec) : 0;
  const scaleH = inPose ? sampleKF(pose.scaleH, tSec) : 100;
  const tz = -dist * DIST_PX_PER_UNIT; // negative distance -> closer (zoom in)
  const scale = scaleH / 100; // uniform scale rides Scale HEIGHT (SW ignored)

  const swapTo = !beforeCut;
  const src = swapTo ? toSrc : fromSrc;
  const clipFn = swapTo ? inClip : outClip;
  const content = swapTo ? to : from;

  const scene = () =>
    clipFn ? clipFn() : src ? (
      <Img src={staticFile(src)} style={{ width: `${width}px`, height: `${height}px`, objectFit: 'cover' }} />
    ) : (
      <AbsoluteFill>{content}</AbsoluteFill>
    );

  // 3x3 wrap tiles (torus padding past the frame edges — also what the pose's
  // tilt/swivel samples at the frame border instead of exposing black)
  const tiles: React.ReactNode[] = [];
  for (const i of [-1, 0, 1]) {
    for (const j of [-1, 0, 1]) {
      tiles.push(
        <AbsoluteFill key={`${i}_${j}`} style={{ transform: `translate(${i * width}px, ${j * height}px)` }}>
          {scene()}
        </AbsoluteFill>
      );
    }
  }

  const filterId = `tfly-blur-${frame}`;

  // offset slide + rotating directional blur (the OffsetSlide rotate sandwich:
  // rotate the tiled content so the blur axis is horizontal, horizontal
  // Gaussian, rotate back; slide applied to the whole group in screen space)
  const pushed = (
    <AbsoluteFill style={{ transform: `translate(${offX}px, ${offY}px)` }}>
      <AbsoluteFill style={{ transform: `rotate(${phi}deg)` }}>
        <AbsoluteFill style={{ filter: sigma > 0.05 ? `url(#${filterId})` : undefined }}>
          <AbsoluteFill style={{ transform: `rotate(${-phi}deg)` }}>
            {tiles}
          </AbsoluteFill>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );

  // the "3D" adjustment over everything: scale first (bottom-up: Geometry2 is
  // listed last), then the Basic 3D pose in a CSS perspective wrapper
  return (
    <AbsoluteFill style={{ backgroundColor: 'black', overflow: 'hidden' }}>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id={filterId} x="-60%" y="-60%" width="220%" height="220%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation={`${sigma} 0`} edgeMode="none" />
          </filter>
        </defs>
      </svg>

      <AbsoluteFill style={{ perspective: `${PERSP_PX}px`, perspectiveOrigin: '50% 50%' }}>
        <AbsoluteFill
          style={{
            transform: `translateZ(${tz}px) rotateY(${swivel}deg) rotateX(${-tilt}deg)`,
            transformStyle: 'flat',
          }}
        >
          <AbsoluteFill style={{ transform: `scale(${scale})` }}>
            {pushed}
          </AbsoluteFill>
        </AbsoluteFill>
      </AbsoluteFill>
      {/* SFX (Camera_Flight whoosh) is emitted from the wrapper. */}
    </AbsoluteFill>
  );
};

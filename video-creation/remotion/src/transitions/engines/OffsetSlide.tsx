import React from 'react';
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { TransitionProps } from '../types';
import { LENS_MAP, LENS_OVERSCAN, LENS_SCALE_PER_K } from './lensMap';

/**
 * OFFSET (motion push/slide) — the pack's big geometric family: 14 pure-push
 * sub-families (Simple / Ease / Ease Out / Bounce / Swinging, plus Short & Long
 * variants) x 8 directions. Every one is the SAME mechanism, only the keyframe
 * curve + duration + direction differ, so ONE parametric engine covers them all.
 *
 * Mechanism (per-clip extracted, _extract-offsetgeo.js -> _analyze-offsetgeo.js,
 * FullHD project; verified against the pack previews):
 *   - Two "HST Adjustment" layers `(In)` [0..cut] and `(Out)` [cut..end] carry ONE
 *     continuous wrap-Offset "Shift Center To" curve across the cut. In real usage
 *     (In) sits over the outgoing clip, (Out) over the incoming — so we swap
 *     from->to AT the cut (which lands under peak motion blur, hiding it).
 *   - A top "Motion Blur" adjustment layer applies a DIRECTIONAL blur (AE Motion
 *     Blur, one Direction + keyframed Blur Length 0->peak->0 peaking at the cut).
 *     This is the dominant visual: at peak the frame is a near-pure smear along the
 *     push direction (preview-confirmed), which is what hides the content swap.
 *   - Alpha Adjust Opacity is a constant 100 across this whole family (no crossfade).
 *
 * The Offset wraps the frame (torus), so we tile the content 3x3 and translate it;
 * "Long" variants shift multiple full widths (4x) = a fast multi-wrap streak. The
 * directional blur is done the faithful way (rotate the tiled content so the push
 * axis is horizontal, apply a horizontal Gaussian, rotate back) rather than an
 * axis-elliptical approximation, so the diagonals streak along their true angle.
 *
 * fidelity: near-1:1 (geometry + timing + direction all real; the only calibrated
 * pieces are the AE-Gaussian blur constant and monotone-cubic interpolation between
 * the real sparse keyframes — chosen to avoid inventing overshoot the data doesn't
 * have while preserving the overshoot the Bounce/Swinging keyframes DO have).
 */
/** A keyframe's temporal-bezier handles (the REAL AE easing, decoded from the
 * project's raw keyframe rows): in/out velocity (value-units per second) and
 * in/out influence (0..1 fraction of the segment the handle spans). These define
 * the curve CHARACTER — e.g. Hit's offset outInf 0.58 = sit still for half the
 * window then whip; its blur BULGES to ~100 mid-segment (huge inVel at tiny inInf)
 * despite ending at 8. Without them everything degraded to linear (QA failure). */
type Handles = { iv?: number; ii?: number; ov?: number; oi?: number };

type CurveKf = { t: number; dx: number; dy: number } & Handles;

export type OffsetSlideParams = {
  /** PIECEWISE wrap-Offset curves in SEQUENCE-time seconds — the (In) clip's curve
   * (active BEFORE the cut) and the (Out) clip's curve (active AFTER). They are NOT
   * one continuous curve: in the Short variants the (Out) curve is the same motion
   * shifted EARLIER, so the transition JUMPS AHEAD in the motion at the cut (hidden
   * under the blur). Premiere samples each adjustment clip's own curve inside its
   * own window; sampling a merged union distorts the shape (2026-07-11 QA fix).
   * dx,dy are shift fractions (+x right, +y down); |value| > 0.5 = multiple wraps. */
  curveIn: CurveKf[];
  curveOut: CurveKf[];
  /** A->B swap fraction (0..1 of the window) = the (Out) clip's start / duration. */
  cut: number;
  /** Directional motion blur: screen angle of the push axis (deg, from +x, y-down),
   * the ADJUSTMENT CLIP's window [t0,t1] (no blur outside it — Long Hit's curve
   * ends at 400 and the crisp slam comes from the clip ENDING, not a keyframe),
   * and the AE Blur Length keyframes in seq-time seconds. */
  mblur: { angleDeg: number; window?: [number, number]; curve: ({ t: number; len: number } & Handles)[] };
  /** OPTIONAL (Warp family): keyframed radial Lens Distortion. `k` = the real AE
   * Curvature (negative = barrel bulge); applied via a feDisplacementMap over the
   * whole offset+blur result. Pure-push rows omit this. */
  lens?: { curve: ({ t: number; k: number } & Handles)[] };
  /** OPTIONAL (Hit family): the green-emboss "Deviation" glitch flash window
   * [t0,t1] (seq-time). Same recipe as GlitchOffset's aberration (Tint black->GREEN
   * / white->BLACK + Emboss + Pin Light), Emboss Direction 45 = diagonal kernel.
   * Pure-push rows omit this. */
  deviation?: { t0: number; t1: number; reliefPx: number; contrast: number };
  /** OPTIONAL (Hit family): the impact "Shake" — the REAL Geometry2 Position jitter
   * keyframes (seq-time, dx/dy as screen fractions from center). The source pads
   * revealed edges with a Replicate+Mirror rig; our 3x3 wrap tiles serve the same
   * role. (The rig itself does not visibly read in the preview; the jitter does.) */
  shake?: ({ t: number; dx: number; dy: number } & Handles)[];
};

/** Wrap a shift fraction into [-0.5, 0.5) so the 3x3 tiles always cover the frame. */
const wrapFrac = (v: number) => ((v % 1) + 1.5) % 1 - 0.5;

/** feDisplacementMap scale per unit of AE Lens Distortion Curvature, derived from
 * the Premiere lens model in lensMap.ts. (The original hand-picked 1.4 made an
 * ~11px max shift — two orders too subtle, which is why Warp read as no-lens.) */
const LENS_K = LENS_SCALE_PER_K;

const bez = (a: number, b: number, c: number, d: number, s: number) => {
  const u = 1 - s;
  return u * u * u * a + 3 * u * u * s * b + 3 * u * s * s * c + s * s * s * d;
};

/**
 * REAL AE temporal-bezier progress across one keyframe segment (handles decoded
 * from the project's raw keyframe rows — velocity in value-units/sec, influence
 * as a 0..1 fraction of the segment). Cubic bezier in (time, progress):
 *   time  controls at t0 + oi·dt and t1 − ii·dt,
 *   value controls at (ov·oi·dt)/L and 1 − (iv·ii·dt)/L  (L = value scale).
 * Progress may leave [0,1] INSIDE a segment — that is real (Hit's blur bulges to
 * ~100 mid-segment while its endpoints are 0 and 8). Falls back to linear when a
 * keyframe has no handles. Time-cubic is monotone (influences clamped to (0,1]),
 * solved by bisection.
 */
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

/** Sample the 2D offset curve (velocity normalized by the segment's path length). */
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

/** Sample a scalar keyframe list (blur length / lens curvature) with real easing.
 * L is the SIGNED delta so value-control normalization keeps its direction. */
const sampleScalar = <K extends string>(
  kfs: ({ t: number } & Handles & Record<K, number>)[], key: K, t: number,
) => {
  if (t <= kfs[0].t) return kfs[0][key];
  const last = kfs[kfs.length - 1];
  if (t >= last.t) return last[key];
  let i = 0;
  while (i < kfs.length - 2 && t > kfs[i + 1].t) i++;
  const a = kfs[i], b = kfs[i + 1];
  const L = b[key] - a[key];
  const p = segProgress(a.t, b.t, a, b, L, t);
  return a[key] + L * p;
};

/** stdDev of the horizontal Gaussian per unit of AE "Blur Length" — calibrated so
 * the peak (len 200-400) smears to near the preview's full streak. */
const BLUR_K = 0.55;

export const OffsetSlide: React.FC<TransitionProps & { params: OffsetSlideParams }> = ({
  from, to, fromSrc, toSrc, outClip, inClip, durationInFrames, params,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const { curveIn, curveOut, cut, mblur } = params;

  const tSec = frame / fps;
  const p = frame / Math.max(1, durationInFrames - 1);

  // piecewise: the (In) clip's curve before the cut, the (Out) clip's after —
  // matching Premiere's per-clip windows (Short variants JUMP AHEAD at the cut).
  const beforeCut = p < cut;
  let { x: dx, y: dy } = sampleCurve2D(beforeCut ? curveIn : curveOut, tSec);

  // Hit impact "Shake": the real Position jitter rides on top of the settled
  // offset, only inside its own window (its curve ends at rest 0,0).
  if (params.shake && tSec >= params.shake[0].t && tSec <= params.shake[params.shake.length - 1].t) {
    const j = sampleCurve2D(params.shake, tSec);
    dx += j.x;
    dy += j.y;
  }
  const offX = wrapFrac(dx) * width;
  const offY = wrapFrac(dy) * height;

  const inMbWindow = !mblur.window || (tSec >= mblur.window[0] && tSec < mblur.window[1]);
  const len = inMbWindow ? Math.max(0, sampleScalar(mblur.curve, 'len', tSec)) : 0;
  const sigma = len * BLUR_K;
  const phi = mblur.angleDeg; // push axis angle in screen space

  const swapTo = p >= cut;
  const src = swapTo ? toSrc : fromSrc;
  const clipFn = swapTo ? inClip : outClip;
  const content = swapTo ? to : from;

  // one full-frame node of the currently-selected scene
  const scene = () =>
    clipFn ? clipFn() : src ? (
      <Img src={staticFile(src)} style={{ width: `${width}px`, height: `${height}px`, objectFit: 'cover' }} />
    ) : (
      <AbsoluteFill>{content}</AbsoluteFill>
    );

  // 3x3 wrap tiles of the scene (no translate here — the offset slide is applied
  // to the whole rotated/blurred group in screen space below so it slides along
  // the true direction; tiling makes the torus wrap seamless past the edges).
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

  const filterId = `oslide-blur-${frame}`;

  // OPTIONAL Warp: radial lens distortion scale (frame-keyed id so the compiled
  // filter isn't reused with a stale scale — the GlitchInvert stale-filter gotcha).
  const lensScale = params.lens ? sampleScalar(params.lens.curve, 'k', tSec) * LENS_K : 0;
  const lensOn = params.lens && Math.abs(lensScale) > 0.05;
  const lensId = `oslide-lens-${frame}`;

  // OPTIONAL Hit: the green-emboss "Deviation" glitch flash, active only in its window.
  const dev = params.deviation;
  const devOn = !!dev && tSec >= dev.t0 && tSec < dev.t1;
  const devId = 'oslide-dev';
  // The "Deviation" = Tint(green) + Emboss + Pin Light, whose VISIBLE result is a
  // green/magenta chromatic edge fringe. The faithful feConvolveMatrix emboss is
  // pathologically slow in Chromium (~5 min/demo — a known perf cliff), so we
  // reproduce the same fringe FAST by shifting only the GREEN channel diagonally
  // (dir 45) and recombining: green/magenta fringes on every edge, ~no cost.
  // fidelity=approximate (documented: mechanism swapped, look preserved).
  const devShift = dev ? Math.max(1, Math.round(dev.reliefPx * 0.7)) : 0;

  // the offset+directional-blur result (screen-space slide of the wrap-tiled scene)
  let node: React.ReactNode = (
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
  // Deviation is the TOP adjustment for Hit; lens is the TOP adjustment for Warp
  // (families are mutually exclusive, but both compose safely if ever combined).
  if (devOn) node = <AbsoluteFill style={{ filter: `url(#${devId})` }}>{node}</AbsoluteFill>;
  if (lensOn) node = <AbsoluteFill style={{ filter: `url(#${lensId})` }}>{node}</AbsoluteFill>;

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', overflow: 'hidden' }}>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          {/* horizontal Gaussian only; the rotate sandwich points it along the push
              axis. Generous region so the smear isn't clipped at the tile bounds. */}
          <filter id={filterId} x="-60%" y="-60%" width="220%" height="220%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation={`${sigma} 0`} edgeMode="none" />
          </filter>

          {/* Warp: radial barrel/pincushion via feDisplacementMap over the inlined
              radial map (LENS_MAP). Negative Curvature -> negative scale -> center
              magnified (bulge). The map is drawn OVERSCANNED beyond the frame and
              blurred IN-FILTER: at the real scale (~46·|k| ≈ 2700 px at peak) each
              8-bit map step is a >10px jump — unblurred, the value-quantization
              contours render as concentric RINGS (QA'd vs preview; the blur
              interpolates the steps into the smooth Adobe-like bulge, and the
              overscan keeps transparent edge out of the blur). Wide filter region:
              peak displacement at the frame edge far exceeds ±20%. */}
          {lensOn && (
            // region must cover each chained pass's max sample pull beyond the
            // frame (~290px/pass at peak curvature) or edges hard-clip mid-warp
            <filter id={lensId} x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
              <feImage
                href={LENS_MAP}
                x={-LENS_OVERSCAN * width}
                y={-LENS_OVERSCAN * height}
                width={width * (1 + 2 * LENS_OVERSCAN)}
                height={height * (1 + 2 * LENS_OVERSCAN)}
                preserveAspectRatio="none"
                result="lmapRaw"
              />
              {/* sigma must span the WIDEST spacing of the 8-bit value rings —
                  ~52px near the field's flat center (dM/dx = A·2r/540 per px) —
                  or each residual ring step = a scale/255 ≈ 12px displacement
                  jump = herringbone ripples (stdDev 10/22 both too small and
                  diffed near-identical). Gaussian of a monotone staircase
                  reconstructs the smooth ramp; the 8% overscan absorbs the
                  boundary (3σ = 120px < 154px margin). */}
              <feGaussianBlur in="lmapRaw" stdDeviation="40" result="lmap" />
              {/* Pre-soften the source proportionally to the warp strength before
                  displacement: feDisplacementMap point-samples, so the fine 1px
                  motion-blur streak texture MOIRES into zigzag ripples under a
                  strong nonlinear warp (diff-verified: the map is not the source
                  of the ripples). Premiere's lens resamples anti-aliased; a small
                  content blur (≤3px at peak curvature) is the equivalent. */}
              {/* CHAINED displacement passes — the 8-BIT WALL: Chromium filter
                  buffers are 8-bit, so the (smoothly generated, blurred) map is
                  RE-QUANTIZED before feDisplacementMap reads it; every 1-level
                  step then jumps scale/255 ≈ 11px at peak = herringbone ripples
                  with exactly that period (map/source blurs can never fix it —
                  verified: map renders perfectly smooth, ripples persist).
                  N passes at scale/N shrink each step to scale/(N·255) ≈ 2-3px
                  and decorrelate between passes. Iterated displacement slightly
                  compounds the warp vs one pass — acceptable (approximate). */}
              <feGaussianBlur in="SourceGraphic" stdDeviation={Math.min(2, Math.abs(lensScale) / 1600)} result="d0" />
              <feDisplacementMap in="d0" in2="lmap" scale={lensScale / 4} xChannelSelector="R" yChannelSelector="G" result="d1" />
              <feDisplacementMap in="d1" in2="lmap" scale={lensScale / 4} xChannelSelector="R" yChannelSelector="G" result="d2" />
              <feDisplacementMap in="d2" in2="lmap" scale={lensScale / 4} xChannelSelector="R" yChannelSelector="G" result="d3" />
              <feDisplacementMap in="d3" in2="lmap" scale={lensScale / 4} xChannelSelector="R" yChannelSelector="G" />
            </filter>
          )}

          {/* Hit "Deviation": green/magenta chromatic-aberration fringe (the visible
              result of the source's green-Tint + Emboss + Pin Light). Shift ONLY the
              GREEN channel diagonally, then add back R+B. Alpha stays >=1 (both inputs
              opaque -> arithmetic add clamps alpha to 1, no un-premultiply-to-white
              gotcha). All-cheap primitives — no feConvolveMatrix (the slow path). */}
          {devOn && (
            <filter id={devId} x="-2%" y="-2%" width="104%" height="104%" colorInterpolationFilters="sRGB">
              <feColorMatrix
                in="SourceGraphic"
                type="matrix"
                values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
                result="gOnly"
              />
              <feOffset in="gOnly" dx={devShift} dy={devShift} result="gShift" />
              <feColorMatrix
                in="SourceGraphic"
                type="matrix"
                values="1 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
                result="rbOnly"
              />
              <feComposite in="rbOnly" in2="gShift" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
            </filter>
          )}
        </defs>
      </svg>

      {node}
      {/* SFX (Camera/Ease/Bounce/Swinging/Hit whip) is emitted from the wrapper. */}
    </AbsoluteFill>
  );
};

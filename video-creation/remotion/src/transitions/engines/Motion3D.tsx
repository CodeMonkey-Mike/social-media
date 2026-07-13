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
 * MOTION / 3D Offset · 3D Orbit · 3D Pan — 40 single-scene CAMERA MOVES (5s):
 * not A->B transitions — the frame is posed/orbited/panned in 3D over ONE image
 * (Mike's receipt/article-showcase moves). Rows ship demoSameScene: true.
 *
 * Mechanism (per-clip extracted, _extract-motion.js -> _build-motion-rows.js),
 * three adjustment layers over the content:
 *   t1 drift  — Geometry2 Position keyframed (slow pan across the posed plane)
 *   t2 pose   — AE Basic 3D (Swivel/Tilt/Distance, static for Offset, keyframed
 *               for Orbit/Pan) + a static Geometry2 offset/rotation
 *   t3 accents — Lens Distortion (curvature -1, negligible-subtle) + MASKED
 *               Mettle Digital Glitch (Amplitude 19 = faint chromatic fringe) +
 *               MASKED Gaussian Blur 15. The masks are an INVERTED rounded
 *               diamond with 276-484px feather = a soft EDGE VIGNETTE: center
 *               sharp, edges blurred/fringed (depth-of-field look). Implemented
 *               as a blurred+fringed overlay copy through a radial-gradient mask.
 * Direction variants carry the SAME H/V flip on all three layers; the previews
 * prove content stays UPRIGHT — the flips mirror the MOTION only, resolved
 * analytically in the builder (mirrored drift, negated swivel/tilt/rot signs).
 *
 * fidelity: approximate — curves/poses are real; the Basic3D distance->px and
 * perspective constants plus the edge-accent strengths are preview-calibrated.
 * NO SFX (verified: empty audio groups, silent previews, no Sound file).
 */
type Handles = { iv?: number; ii?: number; ov?: number; oi?: number };
type KF = { t: number; v: number } & Handles;
type KF2 = { t: number; x: number; y: number } & Handles;

export type Motion3DParams = {
  drift: KF2[];               // Geometry2 Position (normalized, 0.5 = center)
  swivel: KF[];               // Basic 3D degrees (may be single static kf)
  tilt: KF[];
  dist: KF[];                 // Basic 3D Distance to Image (negative = closer)
  geoPos: [number, number];   // t2 static Geometry2 position
  geoRot: number;             // t2 static Geometry2 rotation (deg)
  accents: { lensK: number; glitchAmp: number; blurriness: number };
};

const bez = (a: number, b: number, c: number, d: number, s: number) => {
  const u = 1 - s;
  return u * u * u * a + 3 * u * u * s * b + 3 * u * s * s * c + s * s * s * d;
};
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
const sampleKF2 = (kfs: KF2[], t: number) => {
  if (t <= kfs[0].t || kfs.length === 1) return { x: kfs[0].x, y: kfs[0].y };
  const last = kfs[kfs.length - 1];
  if (t >= last.t) return { x: last.x, y: last.y };
  let i = 0;
  while (i < kfs.length - 2 && t > kfs[i + 1].t) i++;
  const a = kfs[i], b = kfs[i + 1];
  const L = Math.hypot(b.x - a.x, b.y - a.y);
  const p = segProgress(a.t, b.t, a, b, L, t);
  return { x: a.x + (b.x - a.x) * p, y: a.y + (b.y - a.y) * p };
};

/** Basic 3D calibration (preview-matched): CSS perspective depth and px of
 * translateZ per Distance-to-Image unit (negative distance = closer/larger). */
const PERSP_PX = 1600;
const DIST_PX_PER_UNIT = 12;
/** Accent calibration: Gaussian blurriness -> sigma (the LL b/4 rule) and the
 * chromatic fringe offset px per Mettle amplitude unit. */
const BLUR_SIGMA_K = 0.25;
const FRINGE_PX_PER_AMP = 0.12;

export const Motion3D: React.FC<TransitionProps & { params: Motion3DParams }> = ({
  from, fromSrc, outClip, params,
}) => {
  const frame = useCurrentFrame();
  const { width: W, height: H, fps } = useVideoConfig();
  const tSec = frame / fps;

  // single-scene move: always the outgoing content
  const scene = () =>
    outClip ? outClip() : fromSrc ? (
      <Img src={staticFile(fromSrc)} style={{ width: `${W}px`, height: `${H}px`, objectFit: 'cover' }} />
    ) : (
      <AbsoluteFill>{from}</AbsoluteFill>
    );

  const drift = sampleKF2(params.drift, tSec);
  const swivel = sampleKF(params.swivel, tSec);
  const tilt = sampleKF(params.tilt, tSec);
  const dist = sampleKF(params.dist, tSec);

  const tz = -dist * DIST_PX_PER_UNIT; // negative distance -> positive tz -> closer
  const gp = params.geoPos;

  // the posed content: drift -> static geo offset/rot -> Basic 3D pose
  const posed = (
    <AbsoluteFill style={{ perspective: `${PERSP_PX}px`, perspectiveOrigin: '50% 50%' }}>
      <AbsoluteFill
        style={{
          transform: `translateZ(${tz}px) rotateY(${swivel}deg) rotateX(${-tilt}deg)`,
          transformStyle: 'flat',
        }}
      >
        <AbsoluteFill
          style={{
            transform: `translate(${(gp[0] - 0.5) * W}px, ${(gp[1] - 0.5) * H}px) rotate(${params.geoRot}deg)`,
          }}
        >
          <AbsoluteFill style={{ transform: `translate(${(drift.x - 0.5) * W}px, ${(drift.y - 0.5) * H}px)` }}>
            {/* 3x3 overscan so pose + drift never expose edges (the pack's
                zoom-in from negative Distance provides margin; wrap covers the rest) */}
            {[-1, 0, 1].flatMap((i) => [-1, 0, 1].map((j) => (
              <AbsoluteFill key={`${i}_${j}`} style={{ transform: `translate(${i * W}px, ${j * H}px) scale(${i === 0 && j === 0 ? 1 : 1})` }}>
                {scene()}
              </AbsoluteFill>
            )))}
          </AbsoluteFill>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );

  const { blurriness, glitchAmp } = params.accents;
  const sigma = blurriness * BLUR_SIGMA_K;
  const fringe = Math.max(1, Math.round(glitchAmp * FRINGE_PX_PER_AMP * 10) / 10);
  const accId = 'm3d-acc';

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', overflow: 'hidden' }}>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          {/* edge accent: gaussian + green-channel micro-shift (the faint Mettle
              chromatic fringe at amplitude 19) — cheap primitives only */}
          <filter id={accId} x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation={sigma} result="bl" />
            <feColorMatrix in="bl" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="gOnly" />
            <feOffset in="gOnly" dx={fringe} dy={0} result="gShift" />
            <feColorMatrix in="bl" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="rbOnly" />
            <feComposite in="rbOnly" in2="gShift" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
          </filter>
        </defs>
      </svg>

      {posed}

      {/* soft edge vignette of blur+fringe: the real masks are an INVERTED
          rounded diamond with a 276-484px feather — a radial-gradient mask
          (sharp center, effected edges) reproduces the soft field */}
      <AbsoluteFill
        style={{
          WebkitMaskImage: `radial-gradient(ellipse ${W * 0.52}px ${H * 0.62}px at 50% 50%, transparent 35%, white 95%)`,
          maskImage: `radial-gradient(ellipse ${W * 0.52}px ${H * 0.62}px at 50% 50%, transparent 35%, white 95%)`,
        }}
      >
        <AbsoluteFill style={{ filter: `url(#${accId})` }}>{posed}</AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

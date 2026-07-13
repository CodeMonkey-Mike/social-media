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
 * SHAKE — Hit / Horizontal / Long / Short / Skew (34), decoded from the
 * per-clip data. ONE mechanism, all real keyframes:
 *
 *   A single full-window rig2 adjustment (Offset half-frame quadrant swap +
 *   Replicate 2 + 4 Mirrors + static Scale 200 = MIRROR-PADDED IDENTITY,
 *   center-anchored) carries a continuous 25fps-keyed camera-shake:
 *   Position jolts (±3-6%) + Rotation (Hit/Long/Short) or Skew
 *   (Horizontal/Skew, Skew Axis 0). The A->B cut hides MID-SHAKE at the
 *   split between two media-continuous "Deviation" clips — the same
 *   Tint black->RED white->BLUE + Emboss + Pin Light fringe as PERSPECTIVE
 *   Hit (an R/B split along the emboss direction: 45° diagonal for
 *   Hit/Long/Short, 90° horizontal for Horizontal/Skew; relief scales with
 *   the variant's intensity) bracketing the cut.
 *
 * Everything is affine -> CSS transforms over 3x3 mirror tiles; curves are
 * the REAL keyframes with bezier handles. Motion blur = the AE Transform
 * shutter (180°), rendered as AE renders it: 16-sample accumulation across
 * the centered exposure (rotation/skew blur included per sample).
 * fidelity: approximate (the fringe mechanism is swapped — channel shift,
 * not emboss — look preserved; geometry near-1:1).
 * NO SFX — verified 3 ways (FullHD audio groups empty, previews video-only,
 * no Shake file in Sound/). Previews are NATIVE 25fps (no pulldown).
 */
type Handles = { iv?: number; ii?: number; ov?: number; oi?: number };
type ScalarKf = { t: number; v: number } & Handles;
type PanKf = { t: number; x: number; y: number } & Handles;

export type ShakeJoltParams = {
  /** A->B swap time (seconds) = the Deviation pair's split point. */
  cutT: number;
  /** Main rig-clip window (seq seconds); identity outside it. */
  win: [number, number];
  /** Position jolts as frame-fraction displacement (Position − 0.5). */
  pos: PanKf[];
  /** Rotation curve, degrees (Hit / Long / Short). */
  rot?: ScalarKf[];
  /** Skew curve, degrees (Horizontal / Skew). */
  skew?: ScalarKf[];
  /** AE Skew Axis: 0 = skewX (Skew subgroup), 90 = skewY (Horizontal). */
  skewAxis?: number;
  /** AE Transform shutter angle (180). */
  shutter: number;
  /** R/B fringe flash: window + per-axis shift vector in px (from the real
   * Emboss direction + relief: 45° -> (s,s), 90° -> (s,0)). */
  deviation: { win: [number, number]; dx: number; dy: number };
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

const sampleKfs = (kfs: ScalarKf[], t: number) => {
  if (!kfs.length) return 0;
  if (t <= kfs[0].t) return kfs[0].v;
  const last = kfs[kfs.length - 1];
  if (t >= last.t) return last.v;
  let i = 0;
  while (i < kfs.length - 2 && t > kfs[i + 1].t) i++;
  const a = kfs[i], b = kfs[i + 1];
  const L = b.v - a.v;
  return a.v + L * segProgress(a.t, b.t, a, b, L, t);
};

const sample2D = (kfs: PanKf[], t: number) => {
  if (t <= kfs[0].t) return { x: kfs[0].x, y: kfs[0].y };
  const last = kfs[kfs.length - 1];
  if (t >= last.t) return { x: last.x, y: last.y };
  let i = 0;
  while (i < kfs.length - 2 && t > kfs[i + 1].t) i++;
  const a = kfs[i], b = kfs[i + 1];
  const L = Math.hypot(b.x - a.x, b.y - a.y);
  const p = segProgress(a.t, b.t, a, b, L, t);
  return { x: a.x + (b.x - a.x) * p, y: a.y + (b.y - a.y) * p };
};

/** AE default: 16 motion-blur samples per frame. */
const BLUR_SAMPLES = 16;

export const ShakeJolt: React.FC<TransitionProps & { params: ShakeJoltParams }> = ({
  from, to, fromSrc, toSrc, outClip, inClip, durationInFrames, params,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const { cutT, win, pos, rot, skew, skewAxis, shutter, deviation } = params;
  const skewFn = skewAxis === 90 ? 'skewY' : 'skewX';

  const tSec = frame / fps;
  const swapTo = tSec >= cutT - 1e-6;

  const src = swapTo ? toSrc : fromSrc;
  const clipFn = swapTo ? inClip : outClip;
  const content = swapTo ? to : from;
  const scene = () =>
    clipFn ? clipFn() : src ? (
      <Img src={staticFile(src)} style={{ width: `${width}px`, height: `${height}px`, objectFit: 'cover' }} />
    ) : (
      <AbsoluteFill>{content}</AbsoluteFill>
    );

  // ONE continuous shake pose — the same adjustment rides over A and B
  // (no per-side clamping: the curve is continuous across the hidden cut).
  const poseAt = (ts: number) => {
    if (ts < win[0] || ts >= win[1]) return { dx: 0, dy: 0, r: 0, k: 0 };
    return {
      ...(() => { const j = sample2D(pos, ts); return { dx: j.x, dy: j.y }; })(),
      r: rot ? sampleKfs(rot, ts) : 0,
      k: skew ? sampleKfs(skew, ts) : 0,
    };
  };

  // shutter 180 = 0.5-frame exposure, centered on the frame time
  const expo = (shutter / 360) / fps;
  const p0 = poseAt(tSec - expo / 2);
  const p1 = poseAt(tSec + expo / 2);
  const still =
    Math.abs(p1.dx - p0.dx) < 5e-4 && Math.abs(p1.dy - p0.dy) < 5e-4 &&
    Math.abs(p1.r - p0.r) < 0.02 && Math.abs(p1.k - p0.k) < 0.02;
  const NS = still ? 1 : BLUR_SAMPLES;

  // 3x3 mirror tiles (the rig2 padding) — the whole padded plane is jolted,
  // rotated and skewed as one image, exactly as the adjustment stack composites.
  const group = (pose: ReturnType<typeof poseAt>, key: number, opacity: number) => {
    const idle = pose.dx === 0 && pose.dy === 0 && pose.r === 0 && pose.k === 0;
    const tiles: Array<[number, number]> = idle
      ? [[0, 0]]
      : [-1, 0, 1].flatMap((i) => [-1, 0, 1].map((j) => [i, j] as [number, number]));
    return (
      <AbsoluteFill
        key={key}
        style={{
          transform: `translate(${pose.dx * width}px, ${pose.dy * height}px) rotate(${pose.r}deg) ${skewFn}(${pose.k}deg)`,
          transformOrigin: '50% 50%',
          opacity,
        }}
      >
        {tiles.map(([i, j]) => (
          <AbsoluteFill
            key={`${i}_${j}`}
            style={{
              transform: `translate(${i * width}px, ${j * height}px) ${i ? 'scaleX(-1)' : ''} ${j ? 'scaleY(-1)' : ''}`.trim(),
            }}
          >
            {scene()}
          </AbsoluteFill>
        ))}
      </AbsoluteFill>
    );
  };

  // uniform-average accumulation: k-th layer (bottom-up) at opacity 1/k
  const samples: React.ReactNode[] = [];
  for (let k = 0; k < NS; k++) {
    const ts = tSec + expo * ((k + 0.5) / NS - 0.5);
    samples.push(group(poseAt(ts), k, 1 / (k + 1)));
  }

  // "Deviation": warm-red / blue chromatic fringe bracketing the cut — the
  // PERSPECTIVE-verified fast equivalent of Tint(RED/BLUE)+Emboss+Pin Light:
  // R shifted +v, B shifted −v (v = the real emboss direction), G in place.
  const devOn = tSec >= deviation.win[0] && tSec < deviation.win[1];
  const devId = 'shake-dev';

  let node: React.ReactNode = <AbsoluteFill>{samples}</AbsoluteFill>;
  if (devOn) node = <AbsoluteFill style={{ filter: `url(#${devId})` }}>{node}</AbsoluteFill>;

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', overflow: 'hidden' }}>
      {devOn && (
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            <filter id={devId} x="-2%" y="-2%" width="104%" height="104%" colorInterpolationFilters="sRGB">
              <feColorMatrix
                in="SourceGraphic"
                type="matrix"
                values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
                result="rOnly"
              />
              <feOffset in="rOnly" dx={deviation.dx} dy={deviation.dy} result="rShift" />
              <feColorMatrix
                in="SourceGraphic"
                type="matrix"
                values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
                result="bOnly"
              />
              <feOffset in="bOnly" dx={-deviation.dx} dy={-deviation.dy} result="bShift" />
              <feColorMatrix
                in="SourceGraphic"
                type="matrix"
                values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
                result="gOnly"
              />
              <feComposite in="rShift" in2="bShift" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="rb" />
              <feComposite in="rb" in2="gOnly" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
            </filter>
          </defs>
        </svg>
      )}
      {node}
      {/* NO SFX — the pack ships SHAKE silent (verified 3 ways). */}
    </AbsoluteFill>
  );
};

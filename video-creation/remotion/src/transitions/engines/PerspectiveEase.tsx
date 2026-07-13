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
 * PERSPECTIVE — Ease In / Ease Out / Hit In / Hit Out (+ Short), decoded from
 * the per-clip data. ONE mechanism, generalized per phase:
 *
 *   Every phase is a uniform zoom of the CURRENT scene about a pinned point:
 *   content point (cx,cy) sits at frame point (fx,fy), scale = kf value / norm.
 *   - plain phases (norm 100): the raw Geometry2 zoom, always >= 1 (covers).
 *   - rig phases (norm 200 Replicate-2 / norm 300 Replicate-3): the pack's
 *     Offset(half-frame quadrant swap, only for even counts) + Replicate +
 *     4-Mirror rig = a coherent 1/2- or 1/3-size copy at rig center with TRUE
 *     mirror padding; identity at scale == norm. Padding = mirror tiles here.
 *
 *   Family shapes: Ease In = plain zoom-in on A, rig2 135->200 on B (eases to
 *   rest). Ease Out = rig2 200->135 on A (recedes pinned), plain 300->100 on B.
 *   Hit In = plain zoom-in on A, rig3 150->300 SLAM on B + Shake + Deviation.
 *   Hit Out = rig2 recede on A, plain 300->100 SLAM on B + Shake + Deviation.
 *
 *   Shake (Hit families): a rig2-identity window with the real keyframed
 *   Position jitter (±3%, mirror-padded) right after the slam.
 *   Deviation (Hit families): the OFFSET-Hit green-fringe flash (source:
 *   Tint black->GREEN + Emboss 45 + Pin Light) — reproduced with the proven
 *   fast green-channel-shift filter (feConvolveMatrix is a Chromium perf cliff).
 *
 * All real keyframes with bezier handles, sampled piecewise per clip window.
 * Motion blur = the AE Transform shutter (180°), rendered the way AE renders
 * it: 16-sample accumulation across the centered exposure. fidelity: near-1:1
 * (the Deviation fringe mechanism is swapped, look preserved — documented).
 * SFX (Spin_01 / Optics_02, window-truncated) is emitted by the wrapper.
 */
type Handles = { iv?: number; ii?: number; ov?: number; oi?: number };
type ScalarKf = { t: number; v: number } & Handles;

export type PerspectivePhase = {
  /** Clip window, seq seconds. */
  win: [number, number];
  /** Scale keyframes in percent (kf times are seq-absolute). */
  kfs: ScalarKf[];
  /** Scale divisor: 100 plain, 200 rig2, 300 rig3 (identity at scale == norm). */
  norm: number;
  /** Content anchor point (fractions; rig anchors mapped back to content space). */
  cx: number;
  cy: number;
  /** Frame pin point the anchor sits at (the Geometry2 Position). */
  fx: number;
  fy: number;
  /** Mirror-tile padding (rig phases; plain zooms >= 1 always cover). */
  mirror: boolean;
};

export type PerspectiveEaseParams = {
  /** A->B swap fraction (0..1 of the window) = (Out) start / duration. */
  cut: number;
  inPhase: PerspectivePhase;
  outPhase: PerspectivePhase;
  /** AE Transform shutter angle (180). */
  shutter: number;
  /** Hit impact jitter: rig2-identity window + Position kfs (frame fractions, Position − 0.5). */
  shake?: { win: [number, number]; kfs: { t: number; x: number; y: number }[] };
  /** Hit green-fringe flash window (source Emboss relief 10 -> shift 7px). */
  deviation?: { win: [number, number]; reliefPx: number };
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

/** Linear 2D sample of the dense baked jitter keys (25fps spacing). */
const sampleJitter = (kfs: { t: number; x: number; y: number }[], t: number) => {
  if (!kfs.length) return { x: 0, y: 0 };
  if (t <= kfs[0].t) return kfs[0];
  const last = kfs[kfs.length - 1];
  if (t >= last.t) return last;
  let i = 0;
  while (i < kfs.length - 2 && t > kfs[i + 1].t) i++;
  const a = kfs[i], b = kfs[i + 1];
  const f = (t - a.t) / Math.max(1e-9, b.t - a.t);
  return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f };
};

/** AE default: 16 motion-blur samples per frame. */
const BLUR_SAMPLES = 16;

export const PerspectiveEase: React.FC<TransitionProps & { params: PerspectiveEaseParams }> = ({
  from, to, fromSrc, toSrc, outClip, inClip, durationInFrames, params,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const { inPhase, outPhase, shutter, shake, deviation } = params;

  const tSec = frame / fps;
  const cutT = outPhase.win[0];
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

  // The full pose at a sample time: which phase geometry applies + scale + jitter.
  // Sample times are clamped to the current scene's side of the cut so shutter
  // samples never cross into the other clip's curve.
  const poseAt = (ts: number) => {
    const t = swapTo ? Math.max(ts, cutT) : Math.min(ts, cutT);
    if (shake && t >= shake.win[0] && t < shake.win[1]) {
      const j = sampleJitter(shake.kfs, t);
      return { s: 1, cx: 0.5, cy: 0.5, dx: j.x, dy: j.y, mirror: true };
    }
    const ph = swapTo ? outPhase : inPhase;
    // effect clips GATE by WINDOW (the OFFSET Long-Hit lesson): past the (Out)
    // window the adjustment is gone -> identity, even where the kf curve would
    // continue (Hit Short's 1-frame slam clip truncates its curve mid-flight —
    // the hard SNAP into the shake IS the pack's hit).
    if (t >= ph.win[1] - 1e-6) {
      const rest = ph.kfs[ph.kfs.length - 1].v / ph.norm;
      const ended = swapTo || rest === 1; // in-phase holds its end value until the cut
      if (ended) return { s: 1, cx: 0.5, cy: 0.5, dx: 0, dy: 0, mirror: false };
    }
    const s = sampleKfs(ph.kfs, t) / ph.norm;
    return { s, cx: ph.cx, cy: ph.cy, dx: ph.fx - ph.cx, dy: ph.fy - ph.cy, mirror: ph.mirror };
  };

  // shutter 180 = 0.5-frame exposure, centered on the frame time (AE phase -90)
  const expo = (shutter / 360) / fps;
  const p0 = poseAt(tSec - expo / 2);
  const p1 = poseAt(tSec + expo / 2);
  const still =
    Math.abs(p1.s - p0.s) / Math.max(p0.s, 1e-6) < 0.002 &&
    Math.abs(p1.dx - p0.dx) < 5e-4 && Math.abs(p1.dy - p0.dy) < 5e-4;
  const NS = still ? 1 : BLUR_SAMPLES;

  const group = (pose: ReturnType<typeof poseAt>, key: number, opacity: number) => {
    // mirror tiles only on the sides the pin can expose (pin at an edge/corner
    // never exposes its own side; the shake pin at center exposes all four)
    const tiles: Array<[number, number]> = [[0, 0]];
    if (pose.mirror) {
      const fx = pose.cx + pose.dx, fy = pose.cy + pose.dy;
      const xs = [0, ...(fx > 0.01 ? [-1] : []), ...(fx < 0.99 ? [1] : [])];
      const ys = [0, ...(fy > 0.01 ? [-1] : []), ...(fy < 0.99 ? [1] : [])];
      tiles.length = 0;
      for (const i of xs) for (const j of ys) tiles.push([i, j]);
    }
    return (
      <AbsoluteFill
        key={key}
        style={{
          transform: `translate(${pose.dx * width}px, ${pose.dy * height}px) scale(${pose.s})`,
          transformOrigin: `${pose.cx * 100}% ${pose.cy * 100}%`,
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

  // Hit "Deviation": warm-red / blue chromatic fringe flash, active in its window.
  // Source recipe = Tint black->RED white->BLUE (ARGB16 ff00ff0000000000 /
  // ff0000000000ff00 — the WHITE end is NOT black here; preview-verified: the
  // fringes are orange/blue, not OFFSET-Hit green) + Emboss 45 + Pin Light.
  // Emboss of the red<->blue luma ramp stamps R on one side of every edge and B
  // on the opposite side = an R/B split along the 45° diagonal — reproduced fast
  // by shifting R (+d,+d) and B (-d,-d) with G in place (same rationale as the
  // OffsetSlide green-shift: fringes appear only at edges, mechanism cheap).
  const devOn = !!deviation && tSec >= deviation.win[0] && tSec < deviation.win[1];
  const devShift = deviation ? Math.max(1, Math.round(deviation.reliefPx * 0.7)) : 0;
  const devId = 'pease-dev';

  let node: React.ReactNode = <AbsoluteFill>{samples}</AbsoluteFill>;
  if (devOn) node = <AbsoluteFill style={{ filter: `url(#${devId})` }}>{node}</AbsoluteFill>;

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', overflow: 'hidden' }}>
      {devOn && (
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            {/* R shifted down-right, B shifted up-left (Emboss dir 45 relief pair),
                G in place — summed per channel. Alpha stays >=1 -> arithmetic add
                clamps opaque (no un-premultiply-to-white gotcha). All cheap
                primitives — no feConvolveMatrix (the Chromium perf cliff). */}
            <filter id={devId} x="-2%" y="-2%" width="104%" height="104%" colorInterpolationFilters="sRGB">
              <feColorMatrix
                in="SourceGraphic"
                type="matrix"
                values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
                result="rOnly"
              />
              <feOffset in="rOnly" dx={devShift} dy={devShift} result="rShift" />
              <feColorMatrix
                in="SourceGraphic"
                type="matrix"
                values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
                result="bOnly"
              />
              <feOffset in="bOnly" dx={-devShift} dy={-devShift} result="bShift" />
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
      {/* SFX (Spin_01 / Optics_02, window-truncated) is emitted from the wrapper. */}
    </AbsoluteFill>
  );
};

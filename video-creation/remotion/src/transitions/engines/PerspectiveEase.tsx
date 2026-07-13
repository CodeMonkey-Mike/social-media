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
 * PERSPECTIVE > Ease In / Ease In Short — decoded from the per-clip data:
 *
 *   (In) phase: A zooms uniformly 100->300% ANCHORED at the direction point
 *   (e.g. Right = right-edge center, Left Up = top-left corner) — a whip-zoom
 *   INTO that edge/corner under Transform shutter-180 motion blur.
 *
 *   (Out) phase: the pack's Offset(half-frame quadrant swap) + Replicate(2) +
 *   4-Mirror rig recomposes ONE coherent half-size B at rig center with TRUE
 *   mirror padding; Geometry2 scales it 135->200% about the quarter-map anchor
 *   positioned at the direction point. Net effective semantics (exact):
 *   B scaled by scale/200 about ITS direction point pinned to the frame's
 *   direction point (identity at 200), mirror-padded on the exposed sides.
 *
 * Everything is affine -> pure CSS transforms over mirror tiles; the REAL
 * keyframes with bezier handles are sampled piecewise per clip window.
 * Motion blur = the AE Transform shutter (180°), reproduced the way AE itself
 * renders it: N-sample accumulation across the (centered) shutter interval —
 * screen-space, so it lives OUTSIDE nothing and INSIDE nothing: each sample IS
 * a full re-render at its own scale. fidelity: near-1:1.
 * SFX: Spin_01.wav @ 0, window-truncated (emitted by the wrapper).
 */
type Handles = { iv?: number; ii?: number; ov?: number; oi?: number };
type ScalarKf = { t: number; v: number } & Handles;

export type PerspectiveEaseParams = {
  /** A->B swap fraction (0..1 of the window) = (Out) start / duration. */
  cut: number;
  /** Direction point, frame fractions (Right = 1,0.5; Left Up = 0,0; ...). */
  px: number;
  py: number;
  /** (In) window (seq seconds) + uniform-scale curve in percent (100..300). */
  inWin: [number, number];
  inScale: ScalarKf[];
  /** (Out) window + scale curve in percent of the rig (135..200; 200 = identity). */
  outWin: [number, number];
  outScale: ScalarKf[];
  /** AE Transform shutter angle (180). */
  shutter: number;
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

/** AE default: 16 motion-blur samples per frame. */
const BLUR_SAMPLES = 16;

export const PerspectiveEase: React.FC<TransitionProps & { params: PerspectiveEaseParams }> = ({
  from, to, fromSrc, toSrc, outClip, inClip, durationInFrames, params,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const { px, py, inWin, inScale, outWin, outScale, shutter } = params;

  const tSec = frame / fps;
  const swapTo = tSec >= outWin[0] - 1e-6;

  const src = swapTo ? toSrc : fromSrc;
  const clipFn = swapTo ? inClip : outClip;
  const content = swapTo ? to : from;
  const scene = () =>
    clipFn ? clipFn() : src ? (
      <Img src={staticFile(src)} style={{ width: `${width}px`, height: `${height}px`, objectFit: 'cover' }} />
    ) : (
      <AbsoluteFill>{content}</AbsoluteFill>
    );

  // effective scale at a time, per phase (kf times are seq-absolute; curves
  // clamp at their endpoints so out-of-window times settle to identity ends)
  const scaleAt = (t: number) =>
    swapTo ? sampleKfs(outScale, Math.max(t, outWin[0])) / 200
           : sampleKfs(inScale, Math.min(t, inWin[1])) / 100;

  // shutter 180 = 0.5-frame exposure, centered on the frame time (AE phase -90)
  const expo = (shutter / 360) / fps;
  const s0 = scaleAt(tSec - expo / 2);
  const s1 = scaleAt(tSec + expo / 2);
  const still = Math.abs(s1 - s0) / Math.max(s0, 1e-6) < 0.002;
  const NS = still ? 1 : BLUR_SAMPLES;

  const origin = `${px * 100}% ${py * 100}%`;

  // mirror tiles for the B phase (scale < 1 exposes padding on the sides away
  // from the pinned direction point). A phase zooms >= 1 anchored in-frame ->
  // always covers, single copy.
  const tiles: Array<[number, number]> = [[0, 0]];
  if (swapTo) {
    const xs = [0, ...(px > 0 ? [-1] : []), ...(px < 1 ? [1] : [])];
    const ys = [0, ...(py > 0 ? [-1] : []), ...(py < 1 ? [1] : [])];
    tiles.length = 0;
    for (const i of xs) for (const j of ys) tiles.push([i, j]);
  }

  const group = (s: number, key: number, opacity: number) => (
    <AbsoluteFill key={key} style={{ transform: `scale(${s})`, transformOrigin: origin, opacity }}>
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

  // uniform-average accumulation: k-th layer (bottom-up) at opacity 1/k
  const samples: React.ReactNode[] = [];
  for (let k = 0; k < NS; k++) {
    const ts = tSec + expo * ((k + 0.5) / NS - 0.5);
    samples.push(group(scaleAt(ts), k, 1 / (k + 1)));
  }

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', overflow: 'hidden' }}>
      {samples}
      {/* SFX (Spin_01, window-truncated) is emitted from the wrapper. */}
    </AbsoluteFill>
  );
};

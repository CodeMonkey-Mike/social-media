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
 * EXPAND > Pan / Pan Short — Mike's favorite Premiere transition. Decoded from
 * the per-clip data + preview (the raw rig is Offset(0,0) + Replicate(2) +
 * 4 Mirrors + uniform Scale 200% = "frame with MIRRORED edge padding", panned by
 * keyframed Geometry2 Position; the T2 (In)/(Out) windows carry keyframed AECrop
 * curves whose visible result is the EXPAND edge-stretch):
 *
 *   A phase [(In) window]: A is stretched toward one edge — the kept sliver
 *   fills the frame (rows/cols collapse into streak bands as crop → 99.5%) —
 *   while the mirror-padded view pans.
 *   B phase [(Out) window]: B starts as the opposite edge's sliver stretched
 *   full-frame and EXPANDS back to identity while the pan decelerates to rest.
 *
 * Everything is affine → implemented as pure CSS transforms over a 5-copy
 * MIRROR-TILED strip (no SVG filters): sample x = cropAnchor + u·(1−crop) − pan,
 * i.e. strip transform = translate(T)·scale(S) with S = 1/(1−crop),
 * T = (pan − cropAnchor)·S. All curves are the REAL keyframes with bezier
 * handles, sampled piecewise per clip window. fidelity: near-1:1.
 * SFX: Simple_SFX.mp3 @ real in-point, truncated to the family window.
 */
type Handles = { iv?: number; ii?: number; ov?: number; oi?: number };
type ScalarKf = { t: number; v: number } & Handles;

export type ExpandPanParams = {
  /** A->B swap fraction (0..1 of the window) = the (Out) crop clip's start / duration. */
  cut: number;
  /** 'x' (Left/Right) or 'y' (Up/Down). */
  axis: 'x' | 'y';
  /** (In) crop window + curve (0..1 crop fraction) + kept-sliver anchor (0 or 1). */
  inWin: [number, number];
  inCrop: ScalarKf[];
  inAnchor: 0 | 1;
  /** (Out) crop window + curve + anchor. */
  outWin: [number, number];
  outCrop: ScalarKf[];
  outAnchor: 0 | 1;
  /** Pan curves (screen fractions, Position − 0.5), per phase, seq-time. */
  panIn: ScalarKf[];
  panInWin: [number, number];
  panOut: ScalarKf[];
  panOutWin: [number, number];
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

export const ExpandPan: React.FC<TransitionProps & { params: ExpandPanParams }> = ({
  from, to, fromSrc, toSrc, outClip, inClip, durationInFrames, params,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const {
    cut, axis, inWin, inCrop, inAnchor, outWin, outCrop, outAnchor,
    panIn, panInWin, panOut, panOutWin,
  } = params;

  const tSec = frame / fps;
  const p = frame / Math.max(1, durationInFrames - 1);
  const beforeCut = p < cut;

  // crop fraction (0..1) inside its window only
  const inW = (w: [number, number]) => tSec >= w[0] && tSec < w[1];
  let crop = 0, anchor: 0 | 1 = 0;
  if (beforeCut && inW(inWin)) { crop = Math.min(0.995, Math.max(0, sampleKfs(inCrop, tSec) / 100)); anchor = inAnchor; }
  if (!beforeCut && inW(outWin)) { crop = Math.min(0.995, Math.max(0, sampleKfs(outCrop, tSec) / 100)); anchor = outAnchor; }

  // pan (screen fractions) inside its rig window only
  let pan = 0;
  if (beforeCut && inW(panInWin)) pan = sampleKfs(panIn, tSec);
  if (!beforeCut && inW(panOutWin)) pan = sampleKfs(panOut, tSec);

  const swapTo = p >= cut;
  const src = swapTo ? toSrc : fromSrc;
  const clipFn = swapTo ? inClip : outClip;
  const content = swapTo ? to : from;

  const scene = () =>
    clipFn ? clipFn() : src ? (
      <Img src={staticFile(src)} style={{ width: `${width}px`, height: `${height}px`, objectFit: 'cover' }} />
    ) : (
      <AbsoluteFill>{content}</AbsoluteFill>
    );

  // sample x = anchor·crop + u·(1−crop) + pan  ⇒  u = (x − anchor·crop − pan)·S.
  // PAN SIGN: Geometry2 Position +0.189 = camera pans right = content slides
  // LEFT (B enters from the right and settles leftward). The first build used
  // −pan, which pushed the sampling window across the mirror-copy boundary at
  // heavy stretch → kaleidoscope "butterfly" artifacts the preview doesn't have.
  const S = 1 / (1 - crop);
  const T = -(pan + anchor * crop) * S; // in frame units
  const dim = axis === 'x' ? width : height;
  const transform = axis === 'x'
    ? `translateX(${T * dim}px) scaleX(${S})`
    : `translateY(${T * dim}px) scaleY(${S})`;

  // 5-copy MIRROR-TILED strip along the axis (odd copies flipped) — the rig's
  // Replicate+Mirror padding: panning/stretching never reveals blank edges.
  const copies: React.ReactNode[] = [];
  for (const k of [-2, -1, 0, 1, 2]) {
    const flip = Math.abs(k) % 2 === 1;
    const off = k * dim;
    copies.push(
      <AbsoluteFill
        key={k}
        style={{
          transform: axis === 'x'
            ? `translateX(${off}px) ${flip ? 'scaleX(-1)' : ''}`
            : `translateY(${off}px) ${flip ? 'scaleY(-1)' : ''}`,
        }}
      >
        {scene()}
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform, transformOrigin: '0 0' }}>
        {copies}
      </AbsoluteFill>
      {/* SFX (Simple_SFX.mp3, window-truncated) is emitted from the wrapper. */}
    </AbsoluteFill>
  );
};

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { TransitionProps } from '../types';

/**
 * SPIN / Twirl (+ Short) — the pack's vortex spin: `AE.ADBE Twirl` over the
 * rig2 mirror-padded identity. (In) winds A into a full-frame vortex
 * (Angle 0 -> ∓180), (Out) unwinds B (±180 -> ~10 -> 0, real eased tail).
 * Shutter 0 — the pack ships this one with NO motion blur.
 *
 * Param normalization (preview-calibrated, the doubled convention): Twirl
 * Center raw (1,1) = frame CENTER (raw/2 as fractions); Radius raw 30 =
 * 60% of the frame width -> R = 1152px at 1080p (the vortex just covers the
 * corners — measured: the peak-vs-clean radial diff never falls to zero).
 * Falloff = the standard AE twirl profile, angle(r) = A·(1−r/R)².
 *
 * Implementation: Canvas2D per-pixel inverse warp (rotate each pixel about
 * the center by −angle(r), sample with MIRROR addressing = the rig padding).
 * SVG cannot express a 180° differential rotation (8-bit displacement wall).
 * IMAGE content only (the MeltEquidistant canvas limitation — video TODO).
 * fidelity: approximate (real curves; falloff profile + normalization are
 * preview-calibrated). SFX Spin_03.wav @0 from ip 0.09 (wrapper-emitted).
 */
type Handles = { iv?: number; ii?: number; ov?: number; oi?: number };
type KF = { t: number; v: number } & Handles;

export type SpinTwirlParams = {
  /** A->B swap fraction = the (Out) clip's start / duration. */
  cut: number;
  /** Twirl Angle curves in degrees (piecewise (In)/(Out), seq-time). */
  curveIn: KF[];
  curveOut: KF[];
  /** Twirl center, frame fractions (raw/2 -> 0.5:0.5). */
  cx: number;
  cy: number;
  /** Twirl radius as a fraction of frame width (raw 30 -> 0.6). */
  radiusFrac: number;
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
  if (t <= kfs[0].t) return kfs[0].v;
  const last = kfs[kfs.length - 1];
  if (t >= last.t) return last.v;
  let i = 0;
  while (i < kfs.length - 2 && t > kfs[i + 1].t) i++;
  const a = kfs[i], b = kfs[i + 1];
  const p = segProgress(a.t, b.t, a, b, b.v - a.v, t);
  return a.v + (b.v - a.v) * p;
};

const srcCache = new Map<string, ImageData>();
const loadImageData = (url: string, W: number, H: number): Promise<ImageData> => {
  const cached = srcCache.get(url);
  if (cached) return Promise.resolve(cached);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const cv = document.createElement('canvas');
      cv.width = W; cv.height = H;
      const ctx = cv.getContext('2d')!;
      const s = Math.max(W / img.width, H / img.height);
      const dw = img.width * s, dh = img.height * s;
      ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
      const data = ctx.getImageData(0, 0, W, H);
      srcCache.set(url, data);
      resolve(data);
    };
    img.onerror = reject;
    img.src = url;
  });
};

/** mirror-reflect a coordinate into [0, n) — the rig2 padding semantics. */
const reflect = (v: number, n: number) => {
  const p = 2 * n;
  let m = ((v % p) + p) % p;
  if (m >= n) m = p - 1 - m;
  return m;
};

const warp = (
  srcData: ImageData, out: ImageData, W: number, H: number,
  angleDeg: number, cx: number, cy: number, R: number,
) => {
  const sp = srcData.data, op = out.data;
  const A = (angleDeg * Math.PI) / 180;
  const ccx = cx * W, ccy = cy * H;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const dx = x - ccx, dy = y - ccy;
      const r = Math.hypot(dx, dy);
      const oi = (y * W + x) * 4;
      let sx = x, sy = y;
      if (r < R) {
        const f = 1 - r / R;
        const a = A * f * f; // AE twirl falloff (1 - r/R)^2
        const ca = Math.cos(a), sa = Math.sin(a);
        sx = ccx + ca * dx - sa * dy;
        sy = ccy + sa * dx + ca * dy;
      }
      const mx = Math.round(reflect(sx, W));
      const my = Math.round(reflect(sy, H));
      const si = (my * W + mx) * 4;
      op[oi] = sp[si]; op[oi + 1] = sp[si + 1]; op[oi + 2] = sp[si + 2]; op[oi + 3] = 255;
    }
  }
};

export const SpinTwirl: React.FC<TransitionProps & { params: SpinTwirlParams }> = ({
  fromSrc, toSrc, durationInFrames, params,
}) => {
  const frame = useCurrentFrame();
  const { width: W, height: H, fps } = useVideoConfig();
  const { cut, curveIn, curveOut, cx, cy, radiusFrac } = params;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const tSec = frame / fps;
  const p = frame / Math.max(1, durationInFrames - 1);
  const beforeCut = p < cut;
  const angle = sampleKF(beforeCut ? curveIn : curveOut, tSec);
  const src = beforeCut ? fromSrc : toSrc;
  const url = src ? staticFile(src) : null;
  const [, bump] = useState(0);

  // load (once per src) under delayRender; the PAINT happens in the layout
  // effect below, and the delayRender handle is released ONLY AFTER a paint
  // commits. Two races bit here (both -> silent BLACK frames on some pages of
  // the concurrent renderer): painting inside the promise while canvasRef was
  // still null, and continueRender-ing before React flushed the repaint state
  // update (the screenshot fired between them).
  const handleRef = useRef<number | null>(null);
  useEffect(() => {
    if (!url || srcCache.has(url) || handleRef.current !== null) return;
    handleRef.current = delayRender(`spin-twirl load f${frame}`);
    loadImageData(url, W, H)
      .then(() => bump((t) => t + 1)) // repaint -> layout effect releases the handle
      .catch(() => {
        if (handleRef.current !== null) { continueRender(handleRef.current); handleRef.current = null; }
      });
  }, [url, W, H, frame]);

  // paint synchronously on EVERY committed render (data comes from the cache;
  // deterministic — nothing async between the paint and the screenshot)
  useLayoutEffect(() => {
    const data = url ? srcCache.get(url) : null;
    const cv = canvasRef.current;
    if (!data || !cv) return;
    const ctx = cv.getContext('2d')!;
    if (Math.abs(angle) < 0.01) {
      ctx.putImageData(data, 0, 0);
    } else {
      const out = ctx.createImageData(W, H);
      warp(data, out, W, H, angle, cx, cy, radiusFrac * W);
      ctx.putImageData(out, 0, 0);
    }
    if (handleRef.current !== null) { continueRender(handleRef.current); handleRef.current = null; }
  });

  if (!src) {
    return (
      <AbsoluteFill style={{ backgroundColor: 'black', color: 'white', fontSize: 40, alignItems: 'center', justifyContent: 'center' }}>
        SpinTwirl: image content only (video TODO)
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', overflow: 'hidden' }}>
      <canvas ref={canvasRef} width={W} height={H} style={{ width: `${W}px`, height: `${H}px` }} />
      {/* SFX (Spin_03, window-truncated) is emitted from the wrapper. */}
    </AbsoluteFill>
  );
};

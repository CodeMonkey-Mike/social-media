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
 * SPLIT / Panes — Ease + Swinging (+ Short), 64 variants.
 *
 * Mechanism (per-clip extracted, _extract-split.js -> _build-split-rows.js,
 * FullHD project): each (In)/(Out) HST Adjustment carries TWO AEMask-gated
 * Geometry2 layers over the rig2 mirror-padded identity (Offset 0:0 quadrant
 * swap + Replicate 2 + the 4 ExpandPan Mirrors; uniform Scale Height 200 =
 * identity at Position 0.5:0.5). Each masked layer translates its HALF of the
 * frame by (position - 0.5) — the halves shear apart ALONG the split line,
 * mirror padding fills the gap, and the incoming frame's halves slide back
 * (Swinging = 4-kf pendulum overshoot). The split orientation MAY CHANGE at
 * the cut (HV / VH / Diagonal Combs). Shutter 0 everywhere — no motion blur,
 * the geometry scramble IS the look.
 *
 * Implementation: pure DOM. Builder ASSERTS every pane's motion is parallel
 * to its own split edge (within ~7px hand-authoring wobble), so panes never
 * sample each other's output and the Premiere adjustment chain reduces to
 * independent panes over the identity base: per pane, a clip-path polygon
 * window showing a 3x3 MIRROR-TILED plane translated by the sampled curve.
 * Piecewise curveIn/curveOut per clip window (house rule), real temporal
 * bezier handles.
 *
 * fidelity: near-1:1 — masks, curves, mirror padding and compositing order are
 * real project data; the only approximation is the <=7px off-axis wobble band
 * at the split edge at peak (see the builder assert comment).
 */
type Handles = { iv?: number; ii?: number; ov?: number; oi?: number };
type CurveKf = { t: number; dx: number; dy: number } & Handles;

export type SplitPane = {
  /** Pane polygon in normalized frame coords (straight edges). */
  mask: [number, number][];
  /** Translation curve in SEQUENCE-time seconds; dx,dy = frame fractions
   * (position - 0.5), identity at 0. */
  curve: CurveKf[];
};

export type SplitPanesParams = {
  /** A->B swap fraction (0..1 of the window) = the (Out) clip's start / duration. */
  cut: number;
  /** Padding revealed behind a displaced pane. SPLIT panes are always the rig2
   * mirror padding. */
  pad: 'mirror';
  /** Panes in REAL apply order (first-applied first), before / after the cut. */
  panesIn: SplitPane[];
  panesOut: SplitPane[];
};

const bez = (a: number, b: number, c: number, d: number, s: number) => {
  const u = 1 - s;
  return u * u * u * a + 3 * u * u * s * b + 3 * u * s * s * c + s * s * s * d;
};

/** REAL AE temporal-bezier progress across one keyframe segment (the OffsetSlide
 * evaluator — velocity in value-units/sec, influence 0..1 of the segment). */
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

const clipPoly = (poly: [number, number][]) =>
  `polygon(${poly.map(([x, y]) => `${(x * 100).toFixed(3)}% ${(y * 100).toFixed(3)}%`).join(', ')})`;

const TILES: Array<[number, number]> = [];
for (const i of [-1, 0, 1]) for (const j of [-1, 0, 1]) TILES.push([i, j]);

export const SplitPanes: React.FC<TransitionProps & { params: SplitPanesParams }> = ({
  from, to, fromSrc, toSrc, outClip, inClip, durationInFrames, params,
}) => {
  const frame = useCurrentFrame();
  const { width: W, height: H, fps } = useVideoConfig();
  const { cut, panesIn, panesOut } = params;

  const tSec = frame / fps;
  const p = frame / Math.max(1, durationInFrames - 1);
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

  const panes = swapTo ? panesOut : panesIn;

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', overflow: 'hidden' }}>
      {/* identity base (the rig2 output) — panes composite over it in real order */}
      <AbsoluteFill>{scene()}</AbsoluteFill>
      {panes.map((pane, pi) => {
        const { x, y } = sampleCurve2D(pane.curve, tSec);
        const dx = x * W, dy = y * H;
        return (
          <AbsoluteFill key={pi} style={{ clipPath: clipPoly(pane.mask) }}>
            {/* 3x3 mirror-tiled plane, translated by the sampled curve */}
            <div
              style={{
                position: 'absolute',
                left: -W, top: -H, width: 3 * W, height: 3 * H,
                transform: `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px)`,
              }}
            >
              {TILES.map(([i, j]) => (
                <div
                  key={`${i}:${j}`}
                  style={{
                    position: 'absolute',
                    left: (i + 1) * W, top: (j + 1) * H, width: W, height: H,
                    overflow: 'hidden',
                    transform: `scaleX(${i === 0 ? 1 : -1}) scaleY(${j === 0 ? 1 : -1})`,
                  }}
                >
                  {scene()}
                </div>
              ))}
            </div>
          </AbsoluteFill>
        );
      })}
      {/* SFX (Simple_SFX) is emitted from the wrapper. */}
    </AbsoluteFill>
  );
};

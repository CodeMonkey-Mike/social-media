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
 * SPLIT / Perspective (+ Short) — 8 variants (Horizontal/Vertical x 1/2).
 *
 * Mechanism (per-clip extracted, _extract-split.js -> _build-split-rows.js):
 * a masked-flip SANDWICH around a 3-phase perspective move. Two flip
 * adjustment tracks bracket the transform track; each carries an unmasked
 * PR Flip + a half-masked flip-back = NET one half of the frame mirrored
 * (H variants: the TOP half via Horizontal Flips; V variants: the LEFT half
 * via Vertical Flips) for the whole window. Because the content is
 * half-mirrored while the camera moves, the two halves COUNTER-SLIDE; the
 * outer flip un-mirrors the result so content reads upright.
 *
 * Phases on the transform track:
 *   1. zoom  — plain Geometry2, anchor == position == an edge MIDPOINT pin,
 *      Scale 100 -> 300 (shutter 180): A whips into the frame edge.
 *   2. pan   — rig (Offset 0:0 + Replicate 2, NO mirrors = torus WRAP padding,
 *      static Scale 200 = identity) with keyframed Position sliding half a
 *      frame to center, UNDER a keyframed Corner Pin: the entering edge starts
 *      stretched ~2.4x and relaxes (the 3D keystone swing). Phase boundary at
 *      zoom-end is a hard visual snap — real (the pack cuts mid-move).
 *   3. (Out) — Corner Pin only, relaxing to identity over B (the A->B media
 *      cut hides under the continuing keystone + counter-slide). Short
 *      variants window-TRUNCATE the relax curve (the Hit Short snap pattern).
 *
 * Implementation: sibling of PerspectiveEase (same evaluators: real temporal
 * bezier handles, 16-sample centered shutter accumulation, exact Corner Pin
 * homography applied per FRAME around the blurred pose — the pin carries no
 * shutter of its own). Differences: a phase LIST per side, WRAP tiles (plain
 * copies, not mirrored — the pan rig has no Mirror effects), and the
 * half-flip content/output wrappers. fidelity: near-1:1.
 */
type Handles = { iv?: number; ii?: number; ov?: number; oi?: number };
type ScalarKf = { t: number; v: number } & Handles;
type PanKf = { t: number; x: number; y: number } & Handles;

export type SplitPerspectiveParams = {
  /** A->B swap fraction (0..1 of the window). */
  cut: number;
  /** The masked-flip sandwich: which half is mirrored, along which axis, and
   * the adjustment window (outside it, no flips — pose is identity there). */
  flip: { axis: 'h' | 'v'; half: 'top' | 'bottom' | 'left' | 'right'; win: [number, number] };
  /** Phase 1: plain zoom into an edge-midpoint pin (scale in percent / 100). */
  zoom: { win: [number, number]; fx: number; fy: number; kfs: ScalarKf[] };
  /** Phase 2: wrap-padded pan (Position, frame fractions; identity at 0.5). */
  pan: { win: [number, number]; shutter: number; kfs: PanKf[] };
  /** Corner Pin blocks in order (pan-clip pin, then the (Out) relax pin);
   * window-gated, corners as frame fractions, 1 kf = static. */
  pins: Array<{ win: [number, number]; ul: PanKf[]; ur: PanKf[]; ll: PanKf[]; lr: PanKf[] }>;
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

/** Homography mapping the unit square corners to 4 target points (px), as a
 * CSS matrix3d — the MotionShake closed-form 4-point solve. */
const cornerPinMatrix = (
  W: number, H: number,
  ul: { x: number; y: number }, ur: { x: number; y: number },
  ll: { x: number; y: number }, lr: { x: number; y: number },
) => {
  const x0 = ul.x * W, y0 = ul.y * H;
  const x1 = ur.x * W, y1 = ur.y * H;
  const x2 = ll.x * W, y2 = ll.y * H;
  const x3 = lr.x * W, y3 = lr.y * H;
  const dx1 = x1 - x3, dx2 = x2 - x3, dy1 = y1 - y3, dy2 = y2 - y3;
  const sx = x0 - x1 - x2 + x3, sy = y0 - y1 - y2 + y3;
  const den = dx1 * dy2 - dx2 * dy1;
  const g = (sx * dy2 - sy * dx2) / den;
  const h = (sy * dx1 - sx * dy1) / den;
  const a = x1 - x0 + g * x1;
  const b = x2 - x0 + h * x2;
  const c = x0;
  const d = y1 - y0 + g * y1;
  const e = y2 - y0 + h * y2;
  const f = y0;
  const m = [
    a / W, d / W, 0, g / W,
    b / H, e / H, 0, h / H,
    0, 0, 1, 0,
    c, f, 0, 1,
  ];
  return `matrix3d(${m.map((v) => v.toFixed(6)).join(',')})`;
};

const BLUR_SAMPLES = 16;

const HALF_CLIP: Record<string, [string, string]> = {
  // [kept-as-is half, mirrored half] as clip-path polygons
  top: ['polygon(0% 50%, 100% 50%, 100% 100%, 0% 100%)', 'polygon(0% 0%, 100% 0%, 100% 50%, 0% 50%)'],
  bottom: ['polygon(0% 0%, 100% 0%, 100% 50%, 0% 50%)', 'polygon(0% 50%, 100% 50%, 100% 100%, 0% 100%)'],
  left: ['polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)', 'polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)'],
  right: ['polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)', 'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)'],
};

export const SplitPerspective: React.FC<TransitionProps & { params: SplitPerspectiveParams }> = ({
  from, to, fromSrc, toSrc, outClip, inClip, durationInFrames, params,
}) => {
  const frame = useCurrentFrame();
  const { width: W, height: H, fps } = useVideoConfig();
  const { flip, zoom, pan, pins } = params;

  const tSec = frame / fps;
  const cutT = pan.win[1];
  const swapTo = tSec >= cutT - 1e-6;

  const src = swapTo ? toSrc : fromSrc;
  const clipFn = swapTo ? inClip : outClip;
  const content = swapTo ? to : from;
  const rawScene = () =>
    clipFn ? clipFn() : src ? (
      <Img src={staticFile(src)} style={{ width: `${W}px`, height: `${H}px`, objectFit: 'cover' }} />
    ) : (
      <AbsoluteFill>{content}</AbsoluteFill>
    );

  const flipOn = tSec >= flip.win[0] - 1e-6 && tSec < flip.win[1] - 1e-6;
  const flipXf = flip.axis === 'h' ? 'scaleX(-1)' : 'scaleY(-1)';
  const [keepClip, mirrClip] = HALF_CLIP[flip.half];
  /** One half kept, the other mirrored — used for both the content INPUT
   * (below the transforms) and the rendered OUTPUT (above them). */
  const halfFlip = (inner: () => React.ReactNode): React.ReactNode =>
    flipOn ? (
      <AbsoluteFill>
        <AbsoluteFill style={{ clipPath: keepClip }}>{inner()}</AbsoluteFill>
        <AbsoluteFill style={{ clipPath: mirrClip, transform: flipXf }}>{inner()}</AbsoluteFill>
      </AbsoluteFill>
    ) : (
      <AbsoluteFill>{inner()}</AbsoluteFill>
    );
  const scene = () => halfFlip(rawScene);

  // pose at a sample time, clamped to the current side of the cut
  const poseAt = (ts: number) => {
    const t = swapTo ? Math.max(ts, cutT) : Math.min(ts, cutT - 1e-6);
    if (!swapTo && t >= zoom.win[0] && t < zoom.win[1]) {
      return { s: sampleKfs(zoom.kfs, t) / 100, fx: zoom.fx, fy: zoom.fy, dx: 0, dy: 0, wrap: false };
    }
    if (!swapTo && t >= pan.win[0] && t < pan.win[1]) {
      const p2 = sample2D(pan.kfs, t);
      return { s: 1, fx: 0.5, fy: 0.5, dx: p2.x - 0.5, dy: p2.y - 0.5, wrap: true };
    }
    return { s: 1, fx: 0.5, fy: 0.5, dx: 0, dy: 0, wrap: false };
  };

  const expo = (pan.shutter / 360) / fps; // 180 across both moving phases
  const p0 = poseAt(tSec - expo / 2);
  const p1 = poseAt(tSec + expo / 2);
  const still =
    Math.abs(p1.s - p0.s) / Math.max(p0.s, 1e-6) < 0.002 &&
    Math.abs(p1.dx - p0.dx) < 5e-4 && Math.abs(p1.dy - p0.dy) < 5e-4;
  const NS = still ? 1 : BLUR_SAMPLES;

  const group = (pose: ReturnType<typeof poseAt>, key: number, opacity: number) => {
    // torus WRAP padding (plain copies — the pan rig has NO Mirror effects);
    // only the pan phase can expose edges
    const tiles: Array<[number, number]> = pose.wrap
      ? [[-1, -1], [0, -1], [1, -1], [-1, 0], [0, 0], [1, 0], [-1, 1], [0, 1], [1, 1]]
      : [[0, 0]];
    return (
      <AbsoluteFill
        key={key}
        style={{
          transform: `translate(${pose.dx * W}px, ${pose.dy * H}px) scale(${pose.s})`,
          transformOrigin: `${pose.fx * 100}% ${pose.fy * 100}%`,
          opacity,
        }}
      >
        {tiles.map(([i, j]) => (
          <AbsoluteFill key={`${i}_${j}`} style={{ transform: `translate(${i * W}px, ${j * H}px)` }}>
            {scene()}
          </AbsoluteFill>
        ))}
      </AbsoluteFill>
    );
  };

  // 16-sample centered shutter accumulation, k-th layer at opacity 1/k
  const samples: React.ReactNode[] = [];
  for (let k = 0; k < NS; k++) {
    const ts = tSec + expo * ((k + 0.5) / NS - 0.5);
    samples.push(group(poseAt(ts), k, 1 / (k + 1)));
  }

  let node: React.ReactNode = <AbsoluteFill>{samples}</AbsoluteFill>;
  // Corner Pin per FRAME around the blurred accumulation (window-gated; the
  // Short variants' truncated relax snap is real)
  const pin = pins.find((cp) => tSec >= cp.win[0] - 1e-6 && tSec < cp.win[1] - 1e-6);
  if (pin) {
    node = (
      <AbsoluteFill
        style={{
          transform: cornerPinMatrix(
            W, H,
            sample2D(pin.ul, tSec), sample2D(pin.ur, tSec),
            sample2D(pin.ll, tSec), sample2D(pin.lr, tSec),
          ),
          transformOrigin: '0 0',
        }}
      >
        {node}
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', overflow: 'hidden' }}>
      {/* the upper flip track un-mirrors the warped result */}
      {halfFlip(() => node)}
      {/* SFX (Whoosh_02, window-truncated) is emitted from the wrapper. */}
    </AbsoluteFill>
  );
};

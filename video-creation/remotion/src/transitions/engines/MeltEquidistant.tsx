import React, { useEffect, useRef } from 'react';
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
 * MELT / Equidistant (+ Short) — 8 variants of the pack's spherical "melt": the
 * frame is treated as an equirectangular 360° projection and ROTATED — A melts
 * into the pole singularity vortices at ±90°, B unwinds from the opposite pole.
 *
 * Mechanism (per-clip extracted, _extract-melt.js): the (In)/(Out) pair carries
 * `AE.ADBE VR Projection` (Input=Output Projection enum 1) with ONE keyframed
 * rotation: Tilt ±90 (variants 1/2) or Roll ±90 (variants 3/4); (In) 0 -> ±90
 * to the cut, (Out) rides the mirrored curve back to 0 with a real eased tail.
 *
 * Implementation: Canvas2D per-pixel inverse reprojection (equirect -> rotate ->
 * equirect; longitude wraps, latitude clamps). SVG filters cannot express this
 * warp (full-frame displacement + wrapping = far past the 8-bit wall), so this
 * is the library's first canvas engine. IMAGE content only for now — the demo
 * and stills path; the TransitionClip VIDEO path needs a video->canvas frame
 * feed and is a documented TODO (pick a different family for video cuts until
 * then).
 *
 * fidelity: approximate — the rotation curves are real and the reprojection is
 * exact spherical math, but AE's VR Projection frame-fit conventions (how the
 * 16:9 frame maps onto the sphere) are matched by QA against the previews.
 */
type Handles = { iv?: number; ii?: number; ov?: number; oi?: number };
type KF = { t: number; v: number } & Handles;

export type MeltEquidistantParams = {
  /** A->B swap fraction = the (Out) clip's start / duration. */
  cut: number;
  /** Which rotation axis the variant keyframes. */
  axis: 'tilt' | 'roll';
  /** Rotation-angle curves in degrees (piecewise (In)/(Out), seq-time). */
  curveIn: KF[];
  curveOut: KF[];
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

/** module-level source ImageData cache (Remotion renders frames sequentially
 * in one page per thread; loading the still once per src is enough). */
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
      // cover-fit like the other engines' objectFit cover
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

/** Equirect -> rotate -> equirect inverse warp (per output pixel, sample src).
 * Longitude wraps; latitude clamps at the poles (AE-like). */
const warp = (
  srcData: ImageData, out: ImageData, W: number, H: number,
  angleDeg: number, axis: 'tilt' | 'roll',
) => {
  const a = (angleDeg * Math.PI) / 180;
  const ca = Math.cos(a), sa = Math.sin(a);
  const sp = srcData.data, op = out.data;
  const TWO_PI = Math.PI * 2;
  for (let y = 0; y < H; y++) {
    const lat = (0.5 - y / H) * Math.PI; // +pi/2 top .. -pi/2 bottom
    const cl = Math.cos(lat), sl = Math.sin(lat);
    for (let x = 0; x < W; x++) {
      const lon = (x / W - 0.5) * TWO_PI;
      // direction vector (x fwd along lon 0; y right; z up)
      const dx = cl * Math.cos(lon);
      const dy = cl * Math.sin(lon);
      const dz = sl;
      // inverse rotation: tilt = rotation about the RIGHT axis (y);
      // roll = rotation about the VIEW axis (x)
      let rx = dx, ry = dy, rz = dz;
      if (axis === 'tilt') {
        rx = ca * dx + sa * dz;
        rz = -sa * dx + ca * dz;
      } else {
        ry = ca * dy + sa * dz;
        rz = -sa * dy + ca * dz;
      }
      const lat2 = Math.asin(Math.max(-1, Math.min(1, rz)));
      const lon2 = Math.atan2(ry, rx);
      let sx = Math.round(((lon2 / TWO_PI) + 0.5) * W);
      let sy = Math.round((0.5 - lat2 / Math.PI) * H);
      sx = ((sx % W) + W) % W;              // wrap longitude
      sy = Math.max(0, Math.min(H - 1, sy)); // clamp latitude
      const si = (sy * W + sx) * 4;
      const oi = (y * W + x) * 4;
      op[oi] = sp[si]; op[oi + 1] = sp[si + 1]; op[oi + 2] = sp[si + 2]; op[oi + 3] = 255;
    }
  }
};

export const MeltEquidistant: React.FC<TransitionProps & { params: MeltEquidistantParams }> = ({
  fromSrc, toSrc, durationInFrames, params,
}) => {
  const frame = useCurrentFrame();
  const { width: W, height: H, fps } = useVideoConfig();
  const { cut, axis, curveIn, curveOut } = params;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const tSec = frame / fps;
  const p = frame / Math.max(1, durationInFrames - 1);
  const beforeCut = p < cut;
  const angle = sampleKF(beforeCut ? curveIn : curveOut, tSec);
  const src = beforeCut ? fromSrc : toSrc;

  useEffect(() => {
    if (!src) return;
    const handle = delayRender(`melt-equidistant f${frame}`);
    const url = staticFile(src);
    loadImageData(url, W, H).then((data) => {
      const cv = canvasRef.current;
      if (cv) {
        const ctx = cv.getContext('2d')!;
        if (Math.abs(angle) < 0.01) {
          ctx.putImageData(data, 0, 0);
        } else {
          const out = ctx.createImageData(W, H);
          warp(data, out, W, H, angle, axis);
          ctx.putImageData(out, 0, 0);
        }
      }
      continueRender(handle);
    }).catch(() => continueRender(handle));
  }, [src, angle, axis, W, H, frame]);

  if (!src) {
    // VIDEO path not implemented for the canvas warp (documented TODO)
    return (
      <AbsoluteFill style={{ backgroundColor: 'black', color: 'white', fontSize: 40, alignItems: 'center', justifyContent: 'center' }}>
        MeltEquidistant: image content only (video TODO)
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', overflow: 'hidden' }}>
      <canvas ref={canvasRef} width={W} height={H} style={{ width: `${W}px`, height: `${H}px` }} />
    </AbsoluteFill>
  );
};

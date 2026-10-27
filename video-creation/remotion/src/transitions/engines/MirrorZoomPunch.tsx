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
 * ZOOM / Mirror Punch: the Finzar "Nice Camera Shake" Premiere preset (Finzar Ultimate Animation Preset pack), as
 * Mike ran it in "044 Bear Markets" at 54.3 s on a b-roll -> FACE cut (zoom-mirror-punch-in, 2026-10-25). NOT
 * Swiftly. Values: the preset's own keyframes (identical in the .prfpset and in the Bear Markets project), rows
 * by assets/transitions/_build-bearmarkets-rows.py.
 *
 * The preset's stack (render order, inner first):
 *   1. inner Transform: the incoming shot scaled to 33.4 % about the centre;
 *   2. four Mirrors at 1/3 and 2/3 of the frame: they tile that thumbnail 3x3 with TRUE mirror copies
 *      (left/right flipped, top/bottom flipped, corners both), so the frame is a seamless kaleidoscope grid;
 *   3. outer Transform: Scale 100 -> 300 % over 0.333 s (out-influence 0, in-influence 100 %: it launches
 *      fast and lands long), Skew 10 -> 0 deg on axis 135 (same ease), Position y -20 / +80 / -40 / -16 / 0 px
 *      at 0 / 0.083 / 0.150 / 0.233 / 0.417 s (speed 0 at every key), Shutter 360 (motion blur).
 *   At 300 % the centre tile IS the frame again, so the punch lands on the clean shot.
 *
 * Window: `cut` (0.5) puts the A->B cut on the window's middle frame (Math.round(cut * win)), so TransitionClip's
 * cutFrame is exactly where the face appears; before it the outgoing shot plays untouched (the preset sits on the
 * incoming clip only), from it the punch runs 0.417 s, then the clean incoming shot.
 *
 * Rendering choices (documented, not invented looks):
 *   - inner 33.4 % -> exactly 1/3 so the 300 % rest pose is pixel-exact (the source rests at 100.2 %).
 *   - skew = AE's (Lottie's) convention: rotate by the axis, shear by tan(-skew), rotate back.
 *   - motion blur = `samples` (16, AE default) uniform sub-frame poses over the shutter, each sample a full frame
 *     (black where the sheared grid leaves the frame, as in Premiere); `shutterPhase` 0 = the exposure runs
 *     forward from the frame time (checked against the Bear Markets render: its cut frame shows the 100 -> 190 %
 *     smear, not a half-sharp grid as a centred shutter would).
 *   - Position's spatial tangents (a 1-2 px overshoot) are dropped; the temporal eases are exact.
 *   - mirror tiles overlap their neighbours by 1 px (local) so no hairline seam can show.
 * No SFX (none in the preset or in Bear Markets).
 */
type Handles = { iv?: number; ii?: number; ov?: number; oi?: number };
type ScalarKf = { t: number; v: number } & Handles;

export type MirrorZoomPunchParams = {
  /** A->B cut at frame Math.round(cut * win) (0.5 = the window's middle frame). */
  cut: number;
  /** Inner Transform scale in percent: the 3x3 mirror tile size (100/3). */
  innerScale: number;
  /** Outer Transform Scale (%) keyframes, t = seconds after the cut, AE speed/influence handles. */
  scale: ScalarKf[];
  /** Outer Transform Skew (deg) keyframes. */
  skew: ScalarKf[];
  /** Skew Axis (deg), static. */
  skewAxis: number;
  /** Outer Transform Position y keyframes (frame fraction, 0.5 = centred). */
  posY: ScalarKf[];
  /** Transform shutter angle (deg). */
  shutter: number;
  /** Exposure start relative to the frame time, in shutter degrees (0 = forward, -shutter/2 = centred). */
  shutterPhase: number;
  /** Motion-blur samples per frame. */
  samples: number;
};

// ---- AE bezier keyframe sampling (speed + influence handles), the PerspectiveEase convention -------------------
const bez = (a: number, b: number, c: number, d: number, s: number) => {
  const u = 1 - s;
  return u * u * u * a + 3 * u * u * s * b + 3 * u * s * s * c + s * s * s * d;
};

const segProgress = (t0: number, t1: number, h0: Handles, h1: Handles, L: number, t: number) => {
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

/** AE skew as a CSS matrix: rotate by the axis, shear x by tan(-skew), rotate back (Lottie skewFromAxis). */
const skewMatrix = (skewDeg: number, axisDeg: number) => {
  const tk = Math.tan((-skewDeg * Math.PI) / 180);
  const s = Math.sin((axisDeg * Math.PI) / 180);
  const c = Math.cos((axisDeg * Math.PI) / 180);
  const a = 1 + tk * s * c, b = -tk * s * s, cc = tk * c * c, d = 1 - tk * s * c;
  return `matrix(${a.toFixed(6)},${b.toFixed(6)},${cc.toFixed(6)},${d.toFixed(6)},0,0)`;
};

export const MirrorZoomPunch: React.FC<TransitionProps & { params: MirrorZoomPunchParams }> = ({
  from, to, fromSrc, toSrc, outClip, inClip, durationInFrames, params,
}) => {
  const frame = useCurrentFrame();
  const { width: W, height: H, fps } = useVideoConfig();
  const swapFrame = Math.round(params.cut * durationInFrames);
  const swapTo = frame >= swapFrame;

  const src = swapTo ? toSrc : fromSrc;
  const clipFn = swapTo ? inClip : outClip;
  const content = swapTo ? to : from;
  const scene = () =>
    clipFn ? clipFn() : src ? (
      <Img src={staticFile(src)} style={{ width: `${W}px`, height: `${H}px`, objectFit: 'cover' }} />
    ) : (
      <AbsoluteFill>{content}</AbsoluteFill>
    );

  const tp = (frame - swapFrame) / fps;
  const lastKey = Math.max(
    params.scale[params.scale.length - 1].t,
    params.skew[params.skew.length - 1].t,
    params.posY[params.posY.length - 1].t,
  );
  // before the cut: the outgoing shot, untouched; after the punch: the clean incoming shot
  if (!swapTo || tp >= lastKey) {
    return (
      <AbsoluteFill style={{ backgroundColor: 'black', overflow: 'hidden' }}>
        <AbsoluteFill>{scene()}</AbsoluteFill>
      </AbsoluteFill>
    );
  }

  const expo = params.shutter / 360 / fps;
  const phase = (params.shutterPhase / 360) / fps;
  const pose = (ts: number) => {
    const t = Math.max(0, ts);
    return { s: sampleKfs(params.scale, t) / 100, k: sampleKfs(params.skew, t), y: sampleKfs(params.posY, t) };
  };
  const p0 = pose(tp + phase), p1 = pose(tp + phase + expo);
  const still = Math.abs(p1.s - p0.s) < 1e-4 && Math.abs(p1.k - p0.k) < 1e-3 && Math.abs(p1.y - p0.y) < 1e-5;
  const NS = still ? 1 : Math.max(1, Math.round(params.samples));

  const inner = params.innerScale / 100;
  const tw = W * inner, th = H * inner;
  // paint order: corners, then edges, then the centre on top. Each mirror copy is 1 local px wider toward the
  // centre (outer edge fixed, so the grid still spans the frame) so neighbouring tiles overlap and no
  // antialiased seam can open between them
  const tiles: Array<[number, number]> = [
    [-1, -1], [1, -1], [-1, 1], [1, 1],
    [0, -1], [-1, 0], [1, 0], [0, 1],
    [0, 0],
  ];
  const axis = (i: number, size: number) =>
    i === 0 ? { off: 0, sc: inner } : { off: i * (size - 0.5), sc: -inner * ((size + 1) / size) };
  const grid = (q: ReturnType<typeof pose>) => (
    <AbsoluteFill
      style={{
        transform: `translate(0px, ${(q.y - 0.5) * H}px) ${skewMatrix(q.k, params.skewAxis)} scale(${q.s})`,
        transformOrigin: '50% 50%',
      }}
    >
      {tiles.map(([i, j]) => {
        const ax = axis(i, tw), ay = axis(j, th);
        return (
          <AbsoluteFill
            key={`${i}_${j}`}
            style={{
              transform: `translate(${ax.off}px, ${ay.off}px) scale(${ax.sc}, ${ay.sc})`,
              transformOrigin: '50% 50%',
            }}
          >
            {scene()}
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );

  // uniform average of NS full-frame samples: the k-th (bottom-up) at opacity 1/(k+1); each sample carries its
  // own black backing so an exposed corner averages in as black, exactly like an accumulated Premiere frame
  const samples: React.ReactNode[] = [];
  for (let k = 0; k < NS; k++) {
    const ts = tp + phase + expo * ((k + 0.5) / NS);
    samples.push(
      <AbsoluteFill key={k} style={{ opacity: 1 / (k + 1) }}>
        <AbsoluteFill style={{ backgroundColor: 'black' }} />
        {grid(pose(ts))}
      </AbsoluteFill>,
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', overflow: 'hidden' }}>
      {samples}
    </AbsoluteFill>
  );
};

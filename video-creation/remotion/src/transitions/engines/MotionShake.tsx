import React, { useEffect, useState } from 'react';
import {
  AbsoluteFill,
  Img,
  cancelRender,
  continueRender,
  delayRender,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { TransitionProps } from '../types';
import { LENS_MAP, LENS_OVERSCAN, LENS_SCALE_PER_K } from './lensMap';

/**
 * MOTION / Shake 3D · Shake Optics · Shake Simple — 15 single-scene SHAKES (2s):
 * accent moves over ONE image (rows ship demoSameScene: true), no A->B swap.
 *
 * Mechanism (per-clip extracted): each variant slices the first ~2s of its own
 * 60s BAKED wiggle master (1500 keyframes @25fps; builder trims to the window):
 *   - Shake 3D / Shake Optics: AE Corner Pin — all four corners keyframed per
 *     frame = a full projective wobble. Implemented EXACTLY: per-frame
 *     homography from the 4 corner correspondences -> CSS matrix3d.
 *     Shake Optics adds a STATIC Lens Distortion (curvature -12 barrel) —
 *     rendered with the proven chained-feDisplacementMap lens pipeline.
 *   - Shake Simple: Geometry2 Position + Rotation baked wiggle, Scale Height
 *     104 (the pack's own edge-cover overscan) -> plain CSS transforms.
 *
 * fidelity: near-1:1 for 3D/Simple (baked curves + exact homography); Optics
 * approximate (lens via the calibrated displacement pipeline).
 * NO SFX (verified: empty audio groups, silent previews, no Sound file).
 *
 * LONG mode (`params.track`, 2026-10-25, motion-shake-optics-2x-long / -3x-long): the corners come from the
 * FULL 60 s Corner Pin master stored as a data file in the library lib layout
 * (assets/transitions/lib/shake/<id>-60s.json, 1500 keys every 0.04 s, read from the "044 Bear Markets"
 * Premiere project by _build-bearmarkets-rows.py) instead of the inline 2.08 s slice, so a FACE hold can shake
 * for up to 60 s. Same homography, same lens, same linear key-to-key sampling as the inline rows (whose 53
 * keys are the first 2.08 s of the same master). The engine's own clock IS the track time: mount it for the
 * shot (hard on at the shot's first frame, hard off at its last, no ease, exactly how the preset ran in
 * Bear Markets). `trackStart` (s, default 0 = the source) offsets into the master; past 59.96 s the clock
 * ping-pongs instead of freezing. The data file is fetched once per tab (delayRender until loaded) and is a
 * public-dir asset like a plate: lint_transition_assets.py checks it. Rows without `track` take the
 * untouched inline path (byte-identical renders, verified 2026-10-25).
 */
type KF2 = { t: number; x: number; y: number };
type KF = { t: number; v: number };

export type MotionShakeParams =
  | {
      mode: 'corner';
      /** Inline baked keys (the 2 s rows). Absent when `track` is given. */
      ul?: KF2[]; ur?: KF2[]; ll?: KF2[]; lr?: KF2[];
      lensK?: number; // Shake Optics: static Lens Distortion curvature
      /** staticFile() path of a full Corner Pin master (lib/shake/*.json); overrides the inline keys. */
      track?: string;
      /** Seconds into the master at the engine's frame 0 (default 0, what the source did). */
      trackStart?: number;
    }
  | {
      mode: 'simple';
      pos: KF2[]; rot: KF[]; scaleH: number;
    };

/** baked per-frame curves: nearest-segment linear sample (values are per-frame
 * wiggle data — no meaningful bezier handles to honor). */
const lin = (kfs: { t: number }[], t: number) => {
  if (t <= kfs[0].t) return 0;
  if (t >= kfs[kfs.length - 1].t) return kfs.length - 1;
  let i = 0;
  while (i < kfs.length - 2 && t > kfs[i + 1].t) i++;
  return i + (t - kfs[i].t) / (kfs[i + 1].t - kfs[i].t);
};
const at2 = (kfs: KF2[], t: number) => {
  const f = lin(kfs, t);
  const i = Math.floor(f), r = f - i;
  const a = kfs[i], b = kfs[Math.min(kfs.length - 1, i + 1)];
  return { x: a.x + (b.x - a.x) * r, y: a.y + (b.y - a.y) * r };
};
const at1 = (kfs: KF[], t: number) => {
  const f = lin(kfs, t);
  const i = Math.floor(f), r = f - i;
  const a = kfs[i], b = kfs[Math.min(kfs.length - 1, i + 1)];
  return a.v + (b.v - a.v) * r;
};

/** A full Corner Pin master (lib/shake/*.json): key i sits at t = i * keyStep; corners as [x, y] frame fractions. */
type ShakeTrack = {
  keyStep: number;
  keys: number;
  ul: [number, number][]; ur: [number, number][]; ll: [number, number][]; lr: [number, number][];
};
const trackCache = new Map<string, ShakeTrack>();
const trackLoads = new Map<string, Promise<ShakeTrack>>();
const loadTrack = (src: string) => {
  let p = trackLoads.get(src);
  if (!p) {
    p = fetch(staticFile(src))
      .then((r) => {
        if (!r.ok) throw new Error(`MotionShake: track ${src} answered HTTP ${r.status} (copy it into the public dir)`);
        return r.json() as Promise<ShakeTrack>;
      })
      .then((t) => {
        const n = t.keys;
        if (!(t.keyStep > 0) || n < 2 || [t.ul, t.ur, t.ll, t.lr].some((c) => !Array.isArray(c) || c.length !== n)) {
          throw new Error(`MotionShake: track ${src} is malformed (keyStep ${t.keyStep}, keys ${n})`);
        }
        trackCache.set(src, t);
        return t;
      });
    trackLoads.set(src, p);
  }
  return p;
};
/** Loads a track once per tab; holds the frame (delayRender) until it is in. No-op (and no hook-visible
 * difference) for the inline rows. */
const useShakeTrack = (src: string | undefined): ShakeTrack | null => {
  const [track, setTrack] = useState<ShakeTrack | null>(() => (src ? trackCache.get(src) ?? null : null));
  const [handle] = useState(() => (src && !trackCache.has(src) ? delayRender(`MotionShake track ${src}`) : null));
  useEffect(() => {
    if (!src || track) return;
    loadTrack(src)
      .then((t) => {
        setTrack(t);
        if (handle !== null) continueRender(handle);
      })
      .catch((e) => cancelRender(e));
  }, [src, track, handle]);
  return track;
};
/** Corner at master time t: linear between neighbouring keys (the inline rows' rule); past the last key
 * the clock ping-pongs so a hold longer than the master never freezes. */
const trackAt = (tr: ShakeTrack, c: 'ul' | 'ur' | 'll' | 'lr', t: number) => {
  const end = (tr.keys - 1) * tr.keyStep;
  const ph = ((t % (2 * end)) + 2 * end) % (2 * end);
  const tt = ph <= end ? ph : 2 * end - ph;
  const f = tt / tr.keyStep;
  const i = Math.min(tr.keys - 2, Math.max(0, Math.floor(f)));
  const r = Math.min(1, Math.max(0, f - i));
  const a = tr[c][i], b = tr[c][i + 1];
  return { x: a[0] + (b[0] - a[0]) * r, y: a[1] + (b[1] - a[1]) * r };
};

/** Homography mapping the unit square corners to 4 target points (px), as a
 * CSS matrix3d. Standard 4-point DLT with the closed-form adjugate solve. */
const cornerPinMatrix = (
  W: number, H: number,
  ul: { x: number; y: number }, ur: { x: number; y: number },
  ll: { x: number; y: number }, lr: { x: number; y: number },
) => {
  // target corners in px
  const x0 = ul.x * W, y0 = ul.y * H;
  const x1 = ur.x * W, y1 = ur.y * H;
  const x2 = ll.x * W, y2 = ll.y * H;
  const x3 = lr.x * W, y3 = lr.y * H;
  // solve projective map (0,0)->(x0,y0) (W,0)->(x1,y1) (0,H)->(x2,y2) (W,H)->(x3,y3)
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
  // normalize unit square -> px domain
  const m = [
    a / W, d / W, 0, g / W,
    b / H, e / H, 0, h / H,
    0, 0, 1, 0,
    c, f, 0, 1,
  ];
  return `matrix3d(${m.map((v) => v.toFixed(6)).join(',')})`;
};

export const MotionShake: React.FC<TransitionProps & { params: MotionShakeParams }> = ({
  from, fromSrc, outClip, params,
}) => {
  const frame = useCurrentFrame();
  const { width: W, height: H, fps } = useVideoConfig();
  const tSec = frame / fps;
  const track = useShakeTrack(params.mode === 'corner' ? params.track : undefined);

  const scene = () =>
    outClip ? outClip() : fromSrc ? (
      <Img src={staticFile(fromSrc)} style={{ width: `${W}px`, height: `${H}px`, objectFit: 'cover' }} />
    ) : (
      <AbsoluteFill>{from}</AbsoluteFill>
    );

  let node: React.ReactNode;
  if (params.mode === 'simple') {
    const p = at2(params.pos, tSec);
    const r = at1(params.rot, tSec);
    node = (
      <AbsoluteFill
        style={{
          transform: `translate(${(p.x - 0.5) * W}px, ${(p.y - 0.5) * H}px) rotate(${r}deg) scale(${params.scaleH / 100})`,
        }}
      >
        {scene()}
      </AbsoluteFill>
    );
  } else if (params.track && !track) {
    // the master is still loading: this frame is held by delayRender and never captured
    node = <AbsoluteFill>{scene()}</AbsoluteFill>;
  } else {
    let m: string;
    if (params.track && track) {
      const tm = (params.trackStart ?? 0) + tSec;
      m = cornerPinMatrix(W, H, trackAt(track, 'ul', tm), trackAt(track, 'ur', tm), trackAt(track, 'll', tm), trackAt(track, 'lr', tm));
    } else {
      m = cornerPinMatrix(W, H, at2(params.ul!, tSec), at2(params.ur!, tSec), at2(params.ll!, tSec), at2(params.lr!, tSec));
    }
    node = (
      <AbsoluteFill style={{ transform: m, transformOrigin: '0 0' }}>
        {scene()}
      </AbsoluteFill>
    );
    if (params.lensK) {
      const lensScale = params.lensK * LENS_SCALE_PER_K;
      const lensId = `mshake-lens-${frame}`;
      node = (
        <>
          <svg width="0" height="0" style={{ position: 'absolute' }}>
            <defs>
              {/* static barrel (curvature -12) via the proven chained-pass lens
                  pipeline (8-bit-wall mitigation, see OffsetSlide) */}
              <filter id={lensId} x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
                <feImage
                  href={LENS_MAP}
                  x={-LENS_OVERSCAN * W}
                  y={-LENS_OVERSCAN * H}
                  width={W * (1 + 2 * LENS_OVERSCAN)}
                  height={H * (1 + 2 * LENS_OVERSCAN)}
                  preserveAspectRatio="none"
                  result="lmapRaw"
                />
                <feGaussianBlur in="lmapRaw" stdDeviation="40" result="lmap" />
                <feDisplacementMap in="SourceGraphic" in2="lmap" scale={lensScale / 4} xChannelSelector="R" yChannelSelector="G" result="d1" />
                <feDisplacementMap in="d1" in2="lmap" scale={lensScale / 4} xChannelSelector="R" yChannelSelector="G" result="d2" />
                <feDisplacementMap in="d2" in2="lmap" scale={lensScale / 4} xChannelSelector="R" yChannelSelector="G" result="d3" />
                <feDisplacementMap in="d3" in2="lmap" scale={lensScale / 4} xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </defs>
          </svg>
          <AbsoluteFill style={{ filter: `url(#${lensId})` }}>{node}</AbsoluteFill>
        </>
      );
    }
  }

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', overflow: 'hidden' }}>
      {node}
    </AbsoluteFill>
  );
};

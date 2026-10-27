// KtWhipCut.tsx: kt-whip-cut (library.json devices.kt-whip-cut), the one TRANSITION of the theme (bucket 3).
// A wrapper around the INCOMING shot, from the cut t0:
//   'default'  the incoming shot lands from scale 200 -> 100 percent with lens-distortion curvature -100 -> 0 over 0.37 s
//              (ease-out). Scale follows the measured 'N.Hyper Zoom Decrease In' table (motion.ts whipProgress); the
//              2023 b-roll whips (14.37) also carry a heavy radial (zoom) motion blur from the scale, reproduced with
//              a multi-sample shutter on the scale.
//   'open'     the open's version: 0.73 s with a 25 -> 0 degree roll on top.
//   'blur-in'  0.17 s: gaussian blur 800 -> 0, chromatic aberration -60 -> 0, scale 120 -> 100, a vertical offset
//              0.5 -> 0 of the frame height (Premiere Offset, wraps) = a vertical smear in.
// Approximations (documented): curvature via the shared displacement map (lens.tsx) decaying LINEARLY over the window
// (2023 frames: still bent at 2/3 of the whip, which the scale's fast ease-out would not give); Premiere blurriness
// 800 (4K) mapped to a CSS gaussian sigma of 0.1 px per unit at 1080p (80 px at the cut); chromatic aberration as
// three channel plates at +-1.5 percent radial scale per 60 units, summed (additive split, exact for a full-frame shot).
// The sound sits on the cut (ktWhipCutSounds); never runs the spine through TransitionSeries: wrap the incoming clip.
import React from 'react';
import { interpolate } from 'remotion';
import { useKtFps, useKtTime } from './clock';
import { KtLens } from './lens';
import { CL, easeOut, whipProgress } from './motion';
import { onFrame } from './sfx';
import { KtSoundCue } from './types';

export type KtWhipVariant = 'default' | 'open' | 'blur-in';

export const KT_WHIP = {
  default: { dur: 0.37 },
  open: { dur: 0.73, roll: 25 },
  'blur-in': { dur: 0.17, blur: 800, ca: 60, scale: 1.2, offset: 0.5 },
};

export type KtWhipCutProps = {
  /** the cut (first frame of the incoming shot), seconds on the comp clock */
  t0: number;
  variant?: KtWhipVariant;
  /** the incoming shot (a full-frame node; rendered several times during the shutter / the wrap) */
  children: React.ReactNode;
  /** lens curvature on (default true) */
  lens?: boolean;
  motionBlur?: boolean;
  width?: number;
  height?: number;
};

const Plate: React.FC<{ keep: 'R' | 'G' | 'B'; scale: number; children: React.ReactNode }> = ({ keep, scale, children }) => {
  const id = React.useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const m = keep === 'R' ? '1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0' : keep === 'G' ? '0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0' : '0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0';
  return (
    <div style={{ position: 'absolute', inset: 0, mixBlendMode: 'plus-lighter', transform: `scale(${scale})` }}>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id={`pl${id}`} colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values={m} />
          </filter>
        </defs>
      </svg>
      <div style={{ position: 'absolute', inset: 0, filter: `url(#pl${id})` }}>{children}</div>
    </div>
  );
};

export const KtWhipCut: React.FC<KtWhipCutProps> = ({ t0, variant = 'default', children, lens = true, motionBlur = true, width = 1920, height = 1080 }) => {
  const t = useKtTime();
  const fps = useKtFps();
  const dt = t - t0;
  const W = KT_WHIP[variant];
  if (dt < 0 || dt >= W.dur) return <>{children}</>;

  if (variant === 'blur-in') {
    const B = KT_WHIP['blur-in'];
    const u = easeOut(interpolate(dt, [0, B.dur], [0, 1], CL));
    const sigma = B.blur * (1 - u) * 0.1;
    const s = B.scale - (B.scale - 1) * u;
    const off = B.offset * (1 - u) * height;
    const ca = (B.ca * (1 - u)) / 60; // 0..1
    const shot = (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {/* Offset with wrap: the shot and its copy one frame-height above */}
        <div style={{ position: 'absolute', left: 0, top: off, width, height }}>{children}</div>
        <div style={{ position: 'absolute', left: 0, top: off - height, width, height }}>{children}</div>
      </div>
    );
    const a = 0.015 * ca;
    const split =
      ca > 0.02 ? (
        <div style={{ position: 'absolute', inset: 0, isolation: 'isolate', background: 'black' }}>
          <Plate keep="R" scale={1 + a}>{shot}</Plate>
          <Plate keep="G" scale={1}>{shot}</Plate>
          <Plate keep="B" scale={1 - a}>{shot}</Plate>
        </div>
      ) : (
        shot
      );
    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: 'black' }}>
        <div style={{ position: 'absolute', inset: 0, transform: `scale(${s})`, filter: sigma > 0.3 ? `blur(${sigma}px)` : undefined }}>{split}</div>
      </div>
    );
  }

  const dur = W.dur;
  const scaleAt = (ts: number) => 2 - whipProgress(Math.max(0, ts - t0), dur);
  const rollAt = (ts: number) => (variant === 'open' ? KT_WHIP.open.roll * (1 - whipProgress(Math.max(0, ts - t0), dur)) : 0);
  const k = -100 * (1 - interpolate(dt, [0, dur], [0, 1], CL));
  // radial zoom blur: N samples of the scale across a 360-degree shutter. The samples are OPAQUE full-frame layers, so a
  // normal-blend stack with opacity 1 / (k + 1) (k = 0 at the bottom) is the exact equal-weight average, without the
  // backdrop read-back a plus-lighter stack costs under the lens filter
  const n = motionBlur ? 8 : 1;
  const span = 1 / fps;
  const samples = Array.from({ length: n }, (_, i) => (n === 1 ? t : Math.max(t0, t + (i / (n - 1) - 0.5) * span)));
  const zoomed = (
    // clipped to the frame: barrel curvature (k < 0) only samples toward the centre, and an unclipped 2x stack makes the
    // displacement filter rasterize its whole 3840x2160+ bounds (one frame took ~90 s; clipped it renders normally)
    <div style={{ position: 'absolute', left: 0, top: 0, width, height, overflow: 'hidden', isolation: 'isolate', background: 'black' }}>
      {samples.map((ts, i) => (
        <div key={i} style={{ position: 'absolute', inset: 0, opacity: 1 / (i + 1), background: 'black', transform: `scale(${scaleAt(ts)}) rotate(${rollAt(ts)}deg)` }}>
          {children}
        </div>
      ))}
    </div>
  );
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: 'black' }}>
      {lens ? (
        <KtLens k={k} width={width} height={height}>
          {zoomed}
        </KtLens>
      ) : (
        zoomed
      )}
    </div>
  );
};

/** kt-whip-cut sounds, ON the cut: the sound's attack_sec lands on the cut frame (overlays.md section 2; matches the
 * newer keyframe reads, whoosh-4 peaking within 0.03 s of an entry's first frame); the open's swoosh-4 FILE starts at
 * the open's frame 0 (its 0.23 s attack peaks inside the whip). Pick by meaning: whoosh-4 default, fast-reverse-1 / -5 variety, fast-reverse-2 onto a
 * chapter's first band, swoosh-8 a chapter-level whip. */
export const ktWhipCutSounds = (o: {
  t0: number;
  variant?: KtWhipVariant;
  sound?: 'whoosh-4' | 'fast-reverse-1' | 'fast-reverse-5' | 'fast-reverse-2' | 'swoosh-8' | 'swoosh-4';
}): KtSoundCue[] => {
  const { t0, variant = 'default' } = o;
  if (variant === 'open') return [{ id: o.sound ?? 'swoosh-4', at: t0, note: 'the opening whip onto the face at frame 0' }];
  return [onFrame(o.sound ?? 'whoosh-4', t0, 'ON the cut')];
};

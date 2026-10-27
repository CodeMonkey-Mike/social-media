// HwZoomPunch.tsx: hw-zoom-punch (library.json devices.hw-zoom-punch), the Finzar ULTIMATE PRESETS "1. Zoom IN" Bear
// Markets put on the face at 104.000: uniform scale 100 -> 200 percent over 0.443 s, Bezier (out-influence 59.8, in-influence
// 69.7 percent, near-zero end speeds = cubic-bezier(0.598, 0, 0.303, 1)), centred, 360-degree shutter, then HOLDS at 200
// percent (there it ran straight into the scary-6 pumpkin stinger at 104.600 and the face cut at 105.067).
// A wrapper around the picture from t0. Motion blur: the radial (zoom) streak of the scale across the shutter, as an
// equal-weight stack of N scaled samples (the kt-whip-cut technique: opaque layers, opacity 1 / (i + 1)).
// SILENT in the source (the stinger that follows carries the sound).
import React from 'react';
import { useKtFps, useKtTime } from '../kinetic-text/clock';
import { ZOOM_PUNCH, zoomPunch, zoomPunchEase } from './motion';
import { hwPaired } from './sfx';
import { HwSoundCue } from './types';

export type HwZoomPunchProps = {
  /** first frame of the punch, seconds on the comp clock */
  t0: number;
  /** end of the hold (exclusive; default: holds until the wrapper unmounts) */
  t1?: number;
  children: React.ReactNode;
  dur?: number;
  from?: number;
  to?: number;
  outInfluence?: number;
  inInfluence?: number;
  /** zoom centre, px (default the frame centre) */
  originX?: number;
  originY?: number;
  samples?: number;
  motionBlur?: boolean;
};

export const HwZoomPunch: React.FC<HwZoomPunchProps> = (p) => {
  const t = useKtTime();
  const fps = useKtFps();
  const dur = p.dur ?? ZOOM_PUNCH.dur;
  const from = p.from ?? ZOOM_PUNCH.from;
  const to = p.to ?? ZOOM_PUNCH.to;
  const ease = zoomPunchEase(p.outInfluence, p.inInfluence);
  const dt = t - p.t0;
  if (dt < 0 || (p.t1 !== undefined && t >= p.t1)) return <>{p.children}</>;
  const scaleAt = (ts: number) => zoomPunch(Math.max(0, ts - p.t0), dur, from, to, ease);
  const moving = dt < dur + 0.5 / fps;
  const n = p.motionBlur === false || !moving ? 1 : p.samples ?? 8;
  const span = 1 / fps; // 360-degree shutter
  const times = Array.from({ length: n }, (_, i) => (n === 1 ? t : Math.max(p.t0, t + (i / (n - 1) - 0.5) * span)));
  const origin = `${p.originX ?? 960}px ${p.originY ?? 540}px`;
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', isolation: 'isolate', background: 'black' }}>
      {times.map((ts, i) => (
        <div key={i} style={{ position: 'absolute', inset: 0, opacity: 1 / (i + 1), background: 'black', transform: `scale(${scaleAt(ts)})`, transformOrigin: origin }}>
          {p.children}
        </div>
      ))}
    </div>
  );
};

/** hw-zoom-punch sounds: SILENT in the source. `pair` = a screenplay-paired catalog sound, attack ON the punch start. */
export const hwZoomPunchSounds = (o: { t0: number; pair?: string }): HwSoundCue[] => hwPaired(o.pair, [o.t0], 'screenplay-paired: attack ON the punch');

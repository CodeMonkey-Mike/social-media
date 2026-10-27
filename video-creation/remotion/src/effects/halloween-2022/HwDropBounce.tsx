// HwDropBounce.tsx: hw-drop-bounce (library.json devices.hw-drop-bounce), the Finzar Ultimate Animation Preset "Down"
// Bear Markets put on a jump cut at 29.567: the WHOLE picture drops and bounces, Transform Position y offsets
// 0 -> +79 px (+0.083 s) -> -10 (+0.150) -> +8 (+0.200) -> 0 (+0.250), Bezier / continuous keys, 360-degree shutter.
// A wrapper around the picture from the cut t0 (the comp's own footage layer). The source left the exposed frame edge
// black for those frames (nothing under V1): `fill` keeps that, `overscan` scales the picture to hide it instead.
// Motion blur: a vertical directional gaussian whose streak is the travel across the shutter (motion.ts of kinetic-text).
// SILENT in the source (the jump cut's own audio only).
import React from 'react';
import { DirBlur } from '../kinetic-text/blur';
import { useKtFps, useKtTime } from '../kinetic-text/clock';
import { shutterTravel, streakSigma } from '../kinetic-text/motion';
import { DROP_BOUNCE, dropBounce } from './motion';
import { hwPaired } from './sfx';
import { HwSoundCue } from './types';

export type HwDropBounceProps = {
  /** the cut / first frame of the bounce, seconds on the comp clock */
  t0: number;
  /** the picture (a full-frame node; rendered once) */
  children: React.ReactNode;
  /** y offsets in px (positive = down) at `keys` seconds; default the Finzar "Down" keys */
  offsets?: number[];
  keys?: number[];
  /** picture scale during the bounce (1 = the source: the edge shows black for ~3 frames) */
  overscan?: number;
  fill?: string;
  shutter?: number;
  motionBlur?: boolean;
};

export const HwDropBounce: React.FC<HwDropBounceProps> = (p) => {
  const t = useKtTime();
  const fps = useKtFps();
  const keys = p.keys ?? DROP_BOUNCE.keys;
  const ys = p.offsets ?? DROP_BOUNCE.y;
  const dur = keys[keys.length - 1];
  const dt = t - p.t0;
  if (dt < 0 || dt >= dur) return <>{p.children}</>;
  const pos = (ts: number) => dropBounce(ts - p.t0, keys, ys);
  const y = pos(t);
  const sy = p.motionBlur === false ? 0 : Math.min(60, streakSigma(shutterTravel(pos, t, p.t0, p.shutter ?? 360, fps)));
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: p.fill ?? 'black' }}>
      <DirBlur sx={0} sy={sy}>
        <div style={{ position: 'absolute', inset: 0, transform: `translateY(${y}px) scale(${p.overscan ?? 1})` }}>{p.children}</div>
      </DirBlur>
    </div>
  );
};

/** hw-drop-bounce sounds: SILENT in the source. `pair` = a screenplay-paired catalog sound, attack ON the cut. */
export const hwDropBounceSounds = (o: { t0: number; pair?: string }): HwSoundCue[] => hwPaired(o.pair, [o.t0], 'screenplay-paired: attack ON the drop');

// KtIconPop.tsx: kt-icon-pop (library.json devices.kt-icon-pop).
// A flat icon slides in from the NEAREST frame edge: a Transform slide, ALWAYS 0.50 s, the 'influence 32.5 -> 100'
// ease (motion.ts easeInfluence325, progress 2 / 11 / 33 / 55 / 69 / 78 / 89 / 95 / 99 percent at frames 1-14),
// 360-degree motion blur along the slide (the smear frames), no scale, no rotation, no fade. Held, hard cut (t1).
// The 2023 artwork does not survive (AE shape-layer templates): the comp passes its own icon (a React node, e.g. an
// inline SVG, or an image src) sized to the preset box.
// The five 2023 placements are presets (centre px, art box incl. the grey blob, slide direction, travel):
//   rocket-left  (332, 382)  ~320x307  slides RIGHT in from the left edge, travel 779 px (starts fully off-screen)
//   gauge-right  (1538, 413) ~267x228  slides LEFT in from the right edge, travel 668 px
//   chest-up     (960, 709)  ~190x264  slides UP from the bottom edge, travel 333 px
//   panel-right  (1420, 760) ~218x230  slides LEFT from off the right edge, travel 598 px (inside the paper panel)
//   panel-up     (1436, 746) ~240x220  slides UP from the bottom edge, travel 404 px (inside the paper panel)
import React from 'react';
import { Img, interpolate } from 'remotion';
import { DirBlur } from './blur';
import { useKtFps, useKtTime } from './clock';
import { CL, easeInfluence325, shutterTravel, streakSigma } from './motion';
import { KtSoundCue } from './types';

export type KtIconPreset = 'rocket-left' | 'gauge-right' | 'chest-up' | 'panel-right' | 'panel-up';
type Dir = 'from-left' | 'from-right' | 'from-bottom' | 'from-top';

export const KT_ICON_PRESETS: Record<KtIconPreset, { x: number; y: number; w: number; h: number; dir: Dir; travel: number }> = {
  'rocket-left': { x: 332, y: 382, w: 320, h: 307, dir: 'from-left', travel: 779 },
  'gauge-right': { x: 1538, y: 413, w: 267, h: 228, dir: 'from-right', travel: 668 },
  'chest-up': { x: 960, y: 709, w: 190, h: 264, dir: 'from-bottom', travel: 333 },
  'panel-right': { x: 1420, y: 760, w: 218, h: 230, dir: 'from-right', travel: 598 },
  'panel-up': { x: 1436, y: 746, w: 240, h: 220, dir: 'from-bottom', travel: 404 },
};

/** the entrance length, always 0.50 s */
export const KT_ICON_SLIDE = 0.5;

export type KtIconPopProps = {
  t0: number;
  t1: number;
  /** the icon art (inline SVG etc.), drawn inside the preset box */
  icon?: React.ReactNode;
  /** or an image src */
  src?: string;
  preset?: KtIconPreset;
  /** overrides of the preset */
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  dir?: Dir;
  travel?: number;
  motionBlur?: boolean;
};

/** offset (px) of the icon from its rest at dt seconds into the slide, along the slide axis (positive = still out) */
export const iconSlideOffset = (dt: number, travel: number) =>
  travel * (1 - easeInfluence325(interpolate(dt, [0, KT_ICON_SLIDE], [0, 1], CL)));

export const KtIconPop: React.FC<KtIconPopProps> = (p) => {
  const t = useKtTime();
  const fps = useKtFps();
  const { t0, t1, preset = 'rocket-left', motionBlur = true } = p;
  if (t < t0 || t >= t1) return null;
  const d = KT_ICON_PRESETS[preset];
  const x = p.x ?? d.x;
  const y = p.y ?? d.y;
  const w = p.w ?? d.w;
  const h = p.h ?? d.h;
  const dir = p.dir ?? d.dir;
  const travel = p.travel ?? d.travel;
  const off = (ts: number) => iconSlideOffset(ts - t0, travel);
  const o = off(t);
  const dx = dir === 'from-left' ? -o : dir === 'from-right' ? o : 0;
  const dy = dir === 'from-bottom' ? o : dir === 'from-top' ? -o : 0;
  const L = motionBlur && t - t0 < KT_ICON_SLIDE ? shutterTravel(off, t, t0, 360, fps) : 0;
  const horiz = dir === 'from-left' || dir === 'from-right';
  const art = p.icon ?? (p.src ? <Img src={p.src} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : null);
  return (
    <DirBlur sx={horiz ? streakSigma(L) : 0} sy={horiz ? 0 : streakSigma(L)}>
      <div style={{ position: 'absolute', left: x - w / 2 + dx, top: y - h / 2 + dy, width: w, height: h }}>{art}</div>
    </DirBlur>
  );
};

/** kt-icon-pop sounds: the rocket (left entry) swoosh-1, the gauge (right entry) swoosh-2, trimmed to 0.767 s;
 * GROWTH and the panel icons enter on a cut that already carries whoosh-4 (no sound of their own: pass onCut true to
 * get that cut's whoosh-4, file start 0.267 s early with in-point 0.267 as on the paper panel). */
export const ktIconPopSounds = (o: { t0: number; preset?: KtIconPreset; onCut?: boolean }): KtSoundCue[] => {
  const { t0, preset = 'rocket-left' } = o;
  if (preset === 'rocket-left')
    return [{ id: 'swoosh-1', at: t0 - 0.233, dur: 0.767, note: 'rocket: file start 0.233 s BEFORE the slide, peak 0.12 s into it' }];
  if (preset === 'gauge-right')
    return [{ id: 'swoosh-2', at: t0 - 0.267, dur: 0.767, note: 'gauge: file start 0.267 s before the slide, peak 0.04 s before it' }];
  return o.onCut ? [{ id: 'whoosh-4', at: t0 - 0.267, trimIn: 0.267, note: 'the cut the icon enters on carries whoosh-4' }] : [];
};

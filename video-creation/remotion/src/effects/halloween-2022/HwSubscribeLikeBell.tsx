// HwSubscribeLikeBell.tsx: hw-subscribe-like-bell (library.json devices.hw-subscribe-like-bell). Bear Markets 108.900:
// the Motion Graphics Template Scene_19.aegraphic (subscribe + like + bell with a cursor finger; Raleway ExtraBold,
// pill #FF5658, text / YouTube icon / like white, bell #FDC846, finger black) placed at (960, 934) px, with woosh9 0.133 s
// after it. The MOGRT was RENDERED from its own After Effects project with aerender (comp Scene_19, 4096x2304, 30 fps,
// premultiplied ProRes 4444 -> scaled to 1920x1080 -> a FILL + KEY pair, graphics/subscribe-like-bell-fill.mp4 / -key.mp4),
// 3.8 s (frame 0 empty, the pill grows from frame 1, the cursor clicks ~1.6 s, the
// like / bell burst ~2.0 s, the button spins out by 3.77 s). Premiere placed the 4096-wide comp at 100 percent in the
// 3840 sequence = 1.0667x the 1080 plate, its centre (the button) at (960, 934).
import React from 'react';
import { useKtTime } from '../kinetic-text/clock';
import { HwAlphaPlate } from './media';
import { HwSoundCue } from './types';

export const HW_SUBSCRIBE = {
  /** plate length (the animation ends at 3.767 s; the source item ran 4.233 s with an empty tail) */
  dur: 3.8,
  x: 960,
  y: 934,
  /** 4096 / 3840: the comp at 100 percent in the 4K sequence */
  scale: 4096 / 3840,
  /** woosh9 file start after the button's first frame */
  wooshAt: 0.133,
};

export type HwSubscribeLikeBellProps = {
  /** first frame of the button graphic, seconds on the comp clock */
  t0: number;
  /** end (default t0 + 3.8 s, the plate's length) */
  t1?: number;
  /** staticFile paths of graphics/subscribe-like-bell-fill.mp4 and subscribe-like-bell-key.mp4 */
  fillSrc: string;
  keySrc: string;
  /** button centre, px (default (960, 934)) */
  x?: number;
  y?: number;
  scale?: number;
};

/** Drawn over the comp's footage (same stacking context: the fill + key blend against the layers before it). */
export const HwSubscribeLikeBell: React.FC<HwSubscribeLikeBellProps> = (p) => {
  const t = useKtTime();
  const t1 = p.t1 ?? p.t0 + HW_SUBSCRIBE.dur;
  if (t < p.t0 || t >= t1) return null;
  const sec = Math.min(HW_SUBSCRIBE.dur - 1 / 30, t - p.t0);
  return <HwAlphaPlate fillSrc={p.fillSrc} keySrc={p.keySrc} sec={sec} cx={p.x ?? HW_SUBSCRIBE.x} cy={p.y ?? HW_SUBSCRIBE.y} scale={p.scale ?? HW_SUBSCRIBE.scale} />;
};

/** hw-subscribe-like-bell sounds: woosh9, FILE START 0.133 s after the button's first frame (Bear Markets 109.033 for the
 * MOGRT at 108.900, 0 dB, the whole 2.46 s file); its swell peaks 1.56 s into the file = 1.69 s after the button appears,
 * on the cursor click. */
export const hwSubscribeLikeBellSounds = (o: { t0: number }): HwSoundCue[] => [
  { id: 'woosh9', at: o.t0 + HW_SUBSCRIBE.wooshAt, note: 'file start +0.133 s after the button (109.033 vs 108.900); peak +1.56 s into the file' },
];

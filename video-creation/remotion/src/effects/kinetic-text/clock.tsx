// clock.tsx: the comp clock the engines read (the useGvp pattern, promoted): the COMP provides KtClock {t} (for a
// longform-edited comp: the SOURCE-spine second, held inside a spine pause), so the engines stay comp-agnostic.
// Without a provider the engines fall back to frame / fps of the enclosing Sequence.
import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export type KtClockValue = { t: number };
export const KtClock = React.createContext<KtClockValue | null>(null);

/** Plan times are written to the millisecond (33.867 for frame 1016 = 33.8667): the engines read the clock 1 ms late-proof
 * so a device keyed to a ms-rounded time still starts ON its frame, never one frame late. */
export const KT_TIME_EPS = 0.001;

/** Current comp time in seconds (+ KT_TIME_EPS): the KtClock value when a comp provides one, else frame / fps. */
export const useKtTime = (): number => {
  const c = React.useContext(KtClock);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (c ? c.t : frame / fps) + KT_TIME_EPS;
};

/** Frames per second of the comp (the shutter blur needs it). */
export const useKtFps = (): number => useVideoConfig().fps;

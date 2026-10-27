// motion.ts: the shared motion curves of the halloween-2022 devices, straight from the catalog rows
// (video-creation/assets/effects/library.json, devices hw-*). Pure functions of seconds; no React.
import { Easing, interpolate } from 'remotion';
import { CL } from '../kinetic-text/motion';

export { CL };

/** Piecewise curve through keys with an ease per segment (zero speed at every key, so each inner key is a turning point:
 * how a continuous Bezier behaves at the extremes of a bounce). */
export const keyCurve = (dt: number, keys: number[], vals: number[], ease: (u: number) => number = Easing.inOut(Easing.sin)) => {
  if (dt <= keys[0]) return vals[0];
  for (let i = 0; i < keys.length - 1; i++) {
    if (dt < keys[i + 1]) {
      const u = (dt - keys[i]) / (keys[i + 1] - keys[i]);
      return vals[i] + (vals[i + 1] - vals[i]) * ease(u);
    }
  }
  return vals[vals.length - 1];
};

// ------------------------------------------------------------------------------------------------------------------
// hw-word-pop: Transform Scale W 75 -> 115 -> 100, H 75 -> 110 -> 100 percent at +0 / +0.067 / +0.117 s (LINEAR keys),
// pivot (960, 940); 17 of the 24 words sat at 75 percent for 2 frames before the pop (media in-point 3599.933 vs the
// keys at 3600.000), the first 7 popped on their first frame.
// ------------------------------------------------------------------------------------------------------------------
export const WORD_POP = {
  keys: [0, 0.067, 0.117],
  w: [0.75, 1.15, 1.0],
  h: [0.75, 1.1, 1.0],
  /** scale shown before the pop starts */
  pre: 0.75,
  /** the majority case: 2 frames at 75 percent, then the pop */
  popDelay: 0.067,
  dur: 0.117,
};

/** Non-uniform pop scale at dp seconds after the POP start (negative = still waiting at 75 percent). */
export const wordPop = (dp: number) =>
  dp < 0
    ? { sx: WORD_POP.pre, sy: WORD_POP.pre }
    : { sx: interpolate(dp, WORD_POP.keys, WORD_POP.w, CL), sy: interpolate(dp, WORD_POP.keys, WORD_POP.h, CL) };

// ------------------------------------------------------------------------------------------------------------------
// hw-drop-bounce: Finzar "Down": Transform Position y +79 px (at +0.083 s) -> -10 (+0.150) -> +8 (+0.200) -> 0 (+0.250),
// Bezier / continuous keys, shutter 360.
// ------------------------------------------------------------------------------------------------------------------
export const DROP_BOUNCE = { keys: [0, 0.083, 0.15, 0.2, 0.25], y: [0, 79, -10, 8, 0], dur: 0.25 };
export const dropBounce = (dt: number, keys = DROP_BOUNCE.keys, y = DROP_BOUNCE.y) => keyCurve(dt, keys, y);

// ------------------------------------------------------------------------------------------------------------------
// hw-zoom-punch: Finzar "1. Zoom IN": uniform scale 100 -> 200 percent over 0.443 s, Bezier with out-influence 59.8 and
// in-influence 69.7 percent, near-zero end speeds = CSS cubic-bezier(0.598, 0, 1 - 0.697, 1) (a Premiere temporal bezier
// with zero-speed handles IS a CSS cubic-bezier whose control x equals the influence; kinetic-text motion.ts), centred,
// shutter 360, then HOLDS at 200 percent.
// ------------------------------------------------------------------------------------------------------------------
export const ZOOM_PUNCH = { dur: 0.443, from: 1, to: 2, outInfluence: 0.598, inInfluence: 0.697 };
export const zoomPunchEase = (outI = ZOOM_PUNCH.outInfluence, inI = ZOOM_PUNCH.inInfluence) => Easing.bezier(outI, 0, 1 - inI, 1);
export const zoomPunch = (dt: number, dur = ZOOM_PUNCH.dur, from = ZOOM_PUNCH.from, to = ZOOM_PUNCH.to, ease = zoomPunchEase()) =>
  from + (to - from) * ease(Math.min(1, Math.max(0, dt / dur)));

// ------------------------------------------------------------------------------------------------------------------
// hw-zoom-slideshow: exponential ease-out (on the AE render the per-frame log-scale ratio decays ~0.80-0.86 per frame)
// ------------------------------------------------------------------------------------------------------------------
/** 0 at u = 0 -> 1 at u = T, exponential ease-out with time constant tau (normalised so it lands exactly at T). */
export const expoOut = (u: number, tau: number, T: number) => {
  if (u <= 0) return 0;
  if (u >= T) return 1;
  return (1 - Math.exp(-u / tau)) / (1 - Math.exp(-T / tau));
};

/** deterministic 0..1 hash (seeded glitch blocks) */
export const hash01 = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

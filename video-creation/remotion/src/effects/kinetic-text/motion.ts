// motion.ts: the shared motion curves of the kinetic-text-2023 devices, straight from the catalog rows
// (video-creation/assets/effects/library.json). Pure functions of seconds; no React.
import { Easing, interpolate } from 'remotion';

export const CL = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// ------------------------------------------------------------------------------------------------------------------
// EASES
// ------------------------------------------------------------------------------------------------------------------

/**
 * The 0.50 s "out-speed 0 / influence 32.5 percent -> in-speed 0 / influence 100 percent" Premiere ease
 * (kt-list-card card_in, kt-icon-pop entrance). A Premiere temporal bezier whose handles have zero speed IS a CSS
 * cubic-bezier whose control x equals the influence: (0.325, 0) and (1 - 1.00, 1) = Easing.bezier(0.325, 0, 0, 1).
 * Progress of this curve at frames 1-15 of 0.50 s @30 fps (computed):
 *   1.8 10.5 33.4 55.4 68.9 77.9 84.3 89.0 92.5 95.2 97.1 98.5 99.3 99.8 100
 * vs the row's measured table 2 / 11 / 33 / 55 / 69 / 78 (frames 1-6) / 89 (frame 8) / 95 (frame 10) / 99 (frame 13):
 * equal (to the rounding) at every listed frame, so the approximation is exact for practical purposes.
 */
export const easeInfluence325 = Easing.bezier(0.325, 0, 0, 1);

/** Premiere's default Ease In + Ease Out (speed 0, influence 33.3 percent both sides). Used where a row says only
 * "ease" (the kt-side-panel picture shift). */
export const easePremiere = Easing.bezier(1 / 3, 0, 2 / 3, 1);

/** Plain ease-out (the dark panel slide 0.50 s, the band slide-up 0.27 s, the side-panel text rise): the promoted
 * reference implementation's curve (growth-vs-product KtSidePanel). */
export const easeOut = Easing.out(Easing.cubic);

/** The paper card text 'Slide RIGHT (OUT)': zero speed at both ends, influence 37 percent out, 100 percent in. */
export const easeSlideOut37 = Easing.bezier(0.37, 0, 0, 1);

// ------------------------------------------------------------------------------------------------------------------
// THE 110 JIGGLE POP (kt-keyword-pop, and every device that says "the kt-keyword-pop pop")
// ------------------------------------------------------------------------------------------------------------------

/** Transform '110' scale per frame (kt-lower-third-band.text_swap keyframe read, the most precise of the rows):
 * 100 -> 110 over 0.233 s ease-out: 105 at 1 frame, 107 at 2, 109 at 4, 110 at 7. (kt-keyword-pop row: "100 -> 110
 * over 0.20 s"; the same preset, the frame table is the finer read, 1 frame apart.) */
const POP_S_T = [0, 1, 2, 4, 7].map((f) => f / 30);
const POP_S_V = [1.0, 1.05, 1.07, 1.09, 1.1];
/** rotation jiggle 0 -> +2 -> -2 -> +1 -> -0.5 -> 0 degrees at 0 / 0.033 / 0.083 / 0.133 / 0.200 / 0.267 s */
const POP_R_T = [0, 0.033, 0.083, 0.133, 0.2, 0.267];
const POP_R_V = [0, 2, -2, 1, -0.5, 0];
/** seconds until the pop is at rest (then it holds at 110 percent) */
export const POP110_DUR = 0.267;

/** kt-keyword-pop pop: appears at once (no fade), scale 1.00 -> 1.10 with the rotation jiggle, then HOLDS at 1.10. */
export const pop110 = (dt: number) => ({
  s: interpolate(dt, POP_S_T, POP_S_V, CL),
  rot: interpolate(dt, POP_R_T, POP_R_V, CL),
});

// ------------------------------------------------------------------------------------------------------------------
// THE ELASTIC 'ZOOM BOUNCE IN' (word-by-word phrases, the punch word CONVERSIONS, the subscribe arrow)
// ------------------------------------------------------------------------------------------------------------------

/** scale 0 -> 111 -> 93 -> 105 -> 98 -> 101 -> 100 percent. Key times as fractions of the bounce:
 * CONVERSIONS 0.047 / 0.070 / 0.086 / 0.106 / 0.125 / 0.155 s and the arrow 0.066 / 0.098 / 0.120 / 0.148 / 0.175 /
 * 0.217 s are the SAME shape (0.30 / 0.45 / 0.55 / 0.68 / 0.81 / 1.00 of the length), so one table + a length. */
const EL_F = [0, 0.303, 0.452, 0.555, 0.684, 0.806, 1];
const EL_V = [0, 1.11, 0.93, 1.05, 0.98, 1.01, 1.0];
/** each segment eases in-out so every overshoot / undershoot is a turning point (zero velocity), as a bounce is */
const EL_EASE = Easing.inOut(Easing.sin);

/** Bounce lengths from the rows. */
export const ELASTIC = {
  /** word-by-word phrases ("over 0.15 s") and the punch word (0.155 s, opacity in 0.014 s) */
  phrase: { dur: 0.155, fade: 0.014 },
  /** the subscribe arrow (the preset scaled to its 0.233 s clip: 0.217 s, opacity in 0.020 s) */
  arrow: { dur: 0.217, fade: 0.02 },
};

/** Elastic 'Zoom Bounce IN': scale + opacity at dt seconds. dt = 0 renders at scale 0 (the rows' one invisible frame). */
export const elastic = (dt: number, dur = ELASTIC.phrase.dur, fade = ELASTIC.phrase.fade) => ({
  s: interpolate(dt / dur, EL_F, EL_V, { ...CL, easing: EL_EASE }),
  op: interpolate(dt, [0, fade], [0, 1], CL),
});

// ------------------------------------------------------------------------------------------------------------------
// THE HOVER ('Smooth Camera Wobble', kt-side-panel.hover; reused by band, list card, scatter words, paper label)
// ------------------------------------------------------------------------------------------------------------------

/** deterministic 0..1 hash (the reference implementation's) */
export const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const HOVER = { x: 18, y: 13, every: 0.7, rock: 0.5, cycle: 3.0 };

/** HOVER at hv seconds after it started: slow eased drift inside a +-18 px x / +-13 px y box with a new target every
 * ~0.7 s, plus a +-0.5 degree rock on a 3.0 s cycle (0 -> +0.5 -> 0 -> -0.5 -> 0). It never stops. The seed
 * decorrelates two instances on screen at once. */
export const hover = (hv: number, seed = 0) => {
  if (hv <= 0) return { x: 0, y: 0, rot: 0 };
  const seg = Math.floor(hv / HOVER.every);
  const u = Easing.inOut(Easing.sin)((hv % HOVER.every) / HOVER.every);
  const tx = (k: number) => (hash(k * 2 + seed) * 2 - 1) * HOVER.x;
  const ty = (k: number) => (hash(k * 2 + 1 + seed) * 2 - 1) * HOVER.y;
  const x = seg === 0 ? tx(0) * u : tx(seg - 1) + (tx(seg) - tx(seg - 1)) * u;
  const y = seg === 0 ? ty(0) * u : ty(seg - 1) + (ty(seg) - ty(seg - 1)) * u;
  const rot = HOVER.rock * Math.sin((2 * Math.PI * hv) / HOVER.cycle);
  return { x, y, rot };
};

// ------------------------------------------------------------------------------------------------------------------
// THE SIDE-PANEL TEXT RISE (kt-side-panel.text_in)
// ------------------------------------------------------------------------------------------------------------------

/** text block rises from 338 px (31 percent of the frame height) below its rest over 0.33 s while scaling
 * 80 -> 110 -> 100 percent (overshoot peak at 0.15 s). tr = seconds since the text started. */
export const RISE = { from: 338, dur: 0.33, peakAt: 0.15 };
export const riseIn = (tr: number) => ({
  y: interpolate(tr, [0, RISE.dur], [RISE.from, 0], { ...CL, easing: easeOut }),
  s: interpolate(tr, [0, RISE.peakAt, RISE.dur], [0.8, 1.1, 1.0], CL),
});

// ------------------------------------------------------------------------------------------------------------------
// THE WHIP-ZOOM CURVE (kt-whip-cut, kt-headline-over-broll b-roll in, the paper card text whip)
// ------------------------------------------------------------------------------------------------------------------

/** 'N.Hyper Zoom Decrease In', measured on the paper card text (kt-side-panel.paper text_in_card_style_75s):
 * scale 200 -> 100 over 0.40 s from 0.033 s before the cut, 170 / 140 / 126 / 119 / 114 / 110 / 108 / 106 / 104 percent
 * at frames 0-8 of the cut = frames 1-9 of the curve, 100 at frame 12. As progress (200 - s) / 100 against the
 * fraction of the curve. The b-roll whip (0.37 s) and the open (0.73 s) are the same preset family: the engines
 * resample this shape to their length (the rows give only "ease-out" for those). */
const WHIP_T = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 12].map((f) => f / 12);
const WHIP_P = [0, 0.3, 0.6, 0.74, 0.81, 0.86, 0.9, 0.92, 0.94, 0.96, 1];
export const whipProgress = (dt: number, dur: number) => interpolate(dt / dur, WHIP_T, WHIP_P, CL);

// ------------------------------------------------------------------------------------------------------------------
// SHUTTER HELPERS
// ------------------------------------------------------------------------------------------------------------------

/** Travel of a 1-D position function across one frame's shutter (centred on t, clamped at t0 like a clip head):
 * the length of the motion-blur streak in px. angle 360 = the whole frame interval, 180 = half. */
export const shutterTravel = (pos: (t: number) => number, t: number, t0: number, angle: number, fps: number) => {
  const h = angle / 360 / fps / 2;
  return Math.abs(pos(t + h) - pos(Math.max(t0, t - h)));
};

/** Gaussian sigma that reads like a box streak of length L (L / 3: a little tighter than the L / sqrt(12) variance
 * match would suggest is too soft; keeps the streak's length readable). */
export const streakSigma = (L: number) => L / 3;

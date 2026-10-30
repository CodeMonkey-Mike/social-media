// 30x-tao clip 2 `get-into-assets-now-last-chance` (FULL, 78.92 s spine): composition data.
// Batch 30x-tao (livestream 2026-10-28). Plan: shorts/30x-tao/get-into-assets-now-last-chance/BROLL-PLAN.md
// Public dir: shorts/30x-tao/render-assets. Seam MEASURED 854/855 (t = 5/30/60 s). Base = the BlackRock robotics-ETF
// post on X for 0-76.32 s, then Mike's own Kaspa yacht image (burned in, ships as filmed).
// ChatGPT images: 5 (hook train, robot factory, job dominoes, driverless truck, climax gate); 2 content cards +
// frame-0 cover code-built (PIL, _qa/build_assets.py). Every image unique vs sibling clip 7 (same topic).
import { staticFile } from 'remotion';
import type { BrollEv, Sfx } from './_kit';
import type { BadgeEv, OverlayEv, ThumbDef } from './LivestreamShort';

export const XT2_FPS = 30;
export const XT2_DURATION_S = 78.9;
export const XT2_DURATION_FRAMES = 2367; // floor(78.920 video s * 30); last word "yachts." ends 78.92
export const XT2_SEAM = 855;
export const XT2_CAP_Y = 878;
export const XT2_ACCENT = '#ffe600';

export const XT2_CLIP = staticFile('get-into-assets-now-last-chance.mp4');

// 7 beats = 3.26 + 3.02 + 4.10 + 1.86 + 4.00 + 4.26 + 2.40 = 22.90 s of 78.9 s = 29.0 % b-roll / 71.0 % base.
// Full-screens: hook, the "wiped out" transition, climax (3, firm cap).
export const XT2_BROLL: BrollEv[] = [
  { src: staticFile('broll-30xtao-c2-hook-last-train.png'), tIn: 3.7, tOut: 6.96, mode: 'full' },
  { src: staticFile('broll-30xtao-c2-robotics-card.png'), tIn: 7.96, tOut: 10.98, mode: 'content' },
  { src: staticFile('broll-30xtao-c2-robot-factory.png'), tIn: 17.7, tOut: 21.8, mode: 'content' },
  { src: staticFile('broll-30xtao-c2-jobs-dominoes.png'), tIn: 26.58, tOut: 28.44, mode: 'full' },
  { src: staticFile('broll-30xtao-c2-wiped-list.png'), tIn: 40.58, tOut: 44.58, mode: 'content' },
  { src: staticFile('broll-30xtao-c2-driverless-truck.png'), tIn: 55.5, tOut: 59.76, mode: 'content' },
  { src: staticFile('broll-30xtao-c2-climax-chance.png'), tIn: 72.4, tOut: 74.8, mode: 'full' },
];

// One band (top 640): below the post's headline + BlackRock/robot images, above the caption band. Strictly
// sequential, every tOut + 0.1 <= next graphic tIn, none inside a b-roll window.
export const XT2_BADGES: BadgeEv[] = [
  { tIn: 1.16, tOut: 2.88, color: '#ffe600', line1: 'GET IN', line2: 'NOW', top: 640 },
  { tIn: 12.2, tOut: 13.9, color: '#3aa0ff', line1: 'NOT JUST', line2: 'CRYPTO', top: 640 },
  { tIn: 14.76, tOut: 16.9, color: '#39ff14', line1: 'THE WHOLE ECONOMY', line2: 'AND HUMANITY', top: 640 },
  { tIn: 21.95, tOut: 23.55, color: '#ffe600', line1: 'MILLIONS', line2: 'EVERY YEAR', top: 640 },
  { tIn: 23.66, tOut: 26.38, color: '#ff9f1c', line1: 'MORE THAN', line2: 'CARS', top: 640 },
  { tIn: 32.0, tOut: 34.5, color: '#ff5252', line1: 'PROGRAMMING', line2: 'WIPED OUT', top: 640 },
  { tIn: 37.26, tOut: 40.4, color: '#39ff14', line1: 'AI WRITES', line2: 'BETTER CODE', top: 640 },
  { tIn: 48.36, tOut: 49.98, color: '#ff9f1c', line1: 'ELECTRICIANS', top: 640 },
  { tIn: 50.08, tOut: 51.28, color: '#ff9f1c', line1: 'PLUMBERS', top: 640 },
  { tIn: 51.38, tOut: 52.42, color: '#ff9f1c', line1: 'CARPENTERS', top: 640 },
  { tIn: 52.52, tOut: 54.8, color: '#ff5252', line1: 'EVERYBODY', line2: 'WIPED OUT', top: 640 },
  { tIn: 62.6, tOut: 64.9, color: '#3aa0ff', line1: 'NOT EVEN', line2: 'PEOPLE', top: 640 },
  { tIn: 65.32, tOut: 67.1, color: '#ff9f1c', line1: 'REALLY', line2: 'DIFFICULT', top: 640 },
  { tIn: 67.42, tOut: 68.9, color: '#ff5252', line1: 'VERY', line2: 'SOON', top: 640 },
  { tIn: 69.04, tOut: 70.9, color: '#39ff14', line1: 'THE GOOD NEWS', top: 640 },
  { tIn: 71.1, tOut: 72.25, color: '#39ff14', line1: "YOU'RE INTO", line2: 'CRYPTO', top: 640 },
];

export const XT2_OVERLAYS: OverlayEv[] = [];

// t = event - attack_sec (sfx library.json; same cue/timing recipes the sibling clip 7 build swept offline).
export const XT2_SOUNDS: Sfx[] = [
  { t: 0.0, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.4, dur: 0.42 },
  { t: 1.12, src: staticFile('sfx/kinetic-text/knock-pop.wav'), vol: 0.3, dur: 0.4 },
  { t: 3.67, src: staticFile('sfx/Boom - Big Reveal-short.wav'), vol: 0.32, dur: 0.3, fade: 0.1 },
  { t: 7.71, src: staticFile('sfx/accents/accent-scifi-mystery-02-a.wav'), vol: 0.3, dur: 0.45, fade: 0.1 },
  { t: 17.6, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.28, dur: 0.42 },
  { t: 21.91, src: staticFile('sfx/kinetic-text/knock-pop.wav'), vol: 0.25, dur: 0.4 },
  { t: 26.44, src: staticFile('sfx/Impacts/Impact_Hit_01-2-short.wav'), vol: 0.38, dur: 0.3, fade: 0.1 },
  { t: 31.96, src: staticFile('sfx/accents/accent-timpani-clicker-01-a.wav'), vol: 0.3, dur: 0.2, fade: 0.07 },
  { t: 40.39, src: staticFile('sfx/Impacts/Kick_Impact_01-tight.wav'), vol: 0.33, dur: 0.32, fade: 0.07 },
  { t: 48.32, src: staticFile('sfx/accents/accent-timpani-clicker-01-b.wav'), vol: 0.28, dur: 0.2, fade: 0.07 },
  { t: 50.04, src: staticFile('sfx/accents/accent-timpani-clicker-01-a.wav'), vol: 0.28, dur: 0.2, fade: 0.07 },
  { t: 51.34, src: staticFile('sfx/accents/accent-timpani-clicker-01-b.wav'), vol: 0.28, dur: 0.2, fade: 0.07 },
  { t: 52.33, src: staticFile('sfx/Impacts/Kick_Impact_01-tight.wav'), vol: 0.33, dur: 0.32, fade: 0.07 },
  { t: 55.4, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.28, dur: 0.42 },
  { t: 68.94, src: staticFile('sfx/ding/ding.mp3'), vol: 0.25, dur: 0.4, fade: 0.1 },
  { t: 71.92, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_3-1s.wav'), vol: 0.12, dur: 0.48, fade: 0.07 },
  { t: 72.26, src: staticFile('sfx/Impacts/Impact_Hit_01-2-short.wav'), vol: 0.4, dur: 0.3, fade: 0.1 },
  { t: 76.2, src: staticFile('sfx/Cash Register-ching.wav'), vol: 0.25, dur: 0.6 },
];

export const XT2_THUMB: ThumbDef = {
  title: 'GET INTO\n<span style="color:#ffe600">ASSETS NOW</span>',
  chip: 'BEFORE THE ROBOTS COME',
  chipColor: '#ffe600',
  titleSize: 124,
  img: staticFile('thumb-30xtao-c2-cover.png'),
};

// best-time clip 3 `last-chance-to-get-ahead-buy-assets-now` (FULL, 42.21 s) — composition data.
// Batch best-time (livestream 2026-10-27). Plan: shorts/best-time/last-chance-to-get-ahead-buy-assets-now/BROLL-PLAN.md
// Public dir: shorts/best-time/render-assets. Seam MEASURED 853/854 (6 frames).
import { staticFile } from 'remotion';
import type { BrollEv, Sfx } from './_kit';
import type { BadgeEv, ThumbDef } from './LivestreamShort';

export const BT3_FPS = 30;
export const BT3_DURATION_S = 42.2;
export const BT3_DURATION_FRAMES = 1266; // floor(42.21 * 30), spine 42.211 s
export const BT3_SEAM = 854;
export const BT3_CAP_Y = 878;
export const BT3_ACCENT = '#ffc400'; // urgency gold divider

export const BT3_CLIP = staticFile('last-chance-to-get-ahead-buy-assets-now.mp4');

export const BT3_BROLL: BrollEv[] = [
  { src: staticFile('broll-bt3-hook-last-train.png'), tIn: 1.82, tOut: 4.42, mode: 'full' },
  { src: staticFile('broll-bt3-ai-exponential.png'), tIn: 8.28, tOut: 10.7, mode: 'content' },
  { src: staticFile('broll-bt3-jobs-taken.png'), tIn: 13.74, tOut: 15.52, mode: 'content' },
  { src: staticFile('broll-bt3-assets-vault.png'), tIn: 24.1, tOut: 26.48, mode: 'full' },
  { src: staticFile('broll-bt3-years-away.png'), tIn: 35.0, tOut: 37.42, mode: 'content' },
  { src: staticFile('broll-bt3-close-future-city.png'), tIn: 40.2, tOut: 42.2, mode: 'full' },
];

export const BT3_BADGES: BadgeEv[] = [
  { tIn: 17.4, tOut: 19.2, color: '#ff3b3b', line1: 'SO. DAMN.', line2: 'CHEAP.', top: 430 },
  { tIn: 22.06, tOut: 23.8, color: '#ffe600', line1: 'BUY ASSETS', top: 430 },
  { tIn: 31.0, tOut: 32.96, color: '#39ff14', line1: 'OCTOBER 2026', sub: "IT'S HAPPENING NOW", top: 430 },
];

// t = event - attack_sec (library.json), so each crest lands on its frame.
export const BT3_SOUNDS: Sfx[] = [
  { t: 0.0, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.5, dur: 0.42 },
  { t: 1.79, src: staticFile('sfx/Boom - Big Reveal-short.wav'), vol: 0.35, dur: 1.0 },
  { t: 7.98, src: staticFile('sfx/kinetic-text/whoosh-4.mp3'), vol: 0.4, dur: 0.9 },
  { t: 13.5, src: staticFile('sfx/kinetic-text/swoosh-2.wav'), vol: 0.35, dur: 0.9 },
  { t: 17.39, src: staticFile('sfx/Impacts/Kick_Impact_01-tight.wav'), vol: 0.45, dur: 0.32 },
  { t: 21.94, src: staticFile('sfx/Cash Register-ching.wav'), vol: 0.35, dur: 0.77 },
  { t: 22.08, src: staticFile('sfx/Riser Sound Effect-2s.wav'), vol: 0.25, dur: 2.02 },
  { t: 23.96, src: staticFile('sfx/Impacts/Impact_Hit_01-2-short.wav'), vol: 0.45, dur: 0.55 },
  { t: 30.85, src: staticFile('sfx/DING-093.wav'), vol: 0.35, dur: 0.93 },
  { t: 34.41, src: staticFile('sfx/Cinematic Whoosh 06.wav'), vol: 0.3, dur: 1.2 },
  // (swapped 2026-10-27) sudden-shock-tight @39.91 vol 0.4 read as a phantom 'so' before 'imagine' 3/3 on the final mix
  // (and at vol 0.2); Boom short at 0.20 / 0.6 s = control 3/3 (offline sweep, SKILL row 7a).
  { t: 40.17, src: staticFile('sfx/Boom - Big Reveal-short.wav'), vol: 0.2, dur: 0.6 },
];

export const BT3_THUMB: ThumbDef = {
  title: 'THE <span style="color:#ffc400">LAST CHANCE</span>\nTO GET AHEAD',
  chip: 'BUY ASSETS NOW',
  chipColor: '#ffc400',
  titleSize: 112,
  img: staticFile('thumb-bt3-cover.png'),
};

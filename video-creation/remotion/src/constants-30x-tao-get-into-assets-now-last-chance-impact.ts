// 30x-tao clip 7 `get-into-assets-now-last-chance-impact` (IMPACT, 22.72 s spine): composition data.
// Batch 30x-tao (livestream 2026-10-28). Plan: shorts/30x-tao/get-into-assets-now-last-chance-impact/BROLL-PLAN.md
// Public dir: shorts/30x-tao/render-assets. Seam MEASURED 853/854 (6 of 6 frames, t = 1/5/9/13/17/21.5 s).
// ChatGPT images: 2 (hook + climax full-screens). The content-zone AI-code card, the Bitcoin coin overlay and the
// frame-0 cover are code-built (PIL, _qa/build_assets.py): low ChatGPT allowance day, Mike 2026-10-28.
import { staticFile } from 'remotion';
import type { BrollEv, Sfx } from './_kit';
import type { BadgeEv, OverlayEv, ThumbDef } from './LivestreamShort';

export const XT7_FPS = 30;
export const XT7_DURATION_S = 22.7;
export const XT7_DURATION_FRAMES = 681; // floor(22.720 video s * 30); last word "chance." ends 22.56-22.68
export const XT7_SEAM = 854;
export const XT7_CAP_Y = 878;
export const XT7_ACCENT = '#39ff14'; // AI-card green divider (teal would read as Kaspa)

export const XT7_CLIP = staticFile('get-into-assets-now-last-chance-impact.mp4');

// 3 beats = 3.24 + 2.52 + 1.86 = 7.62 s of 22.70 s = 33.6 % b-roll / 66.4 % base (band 25-35 %).
// Cut points sit in the measured RMS dips (3.68-3.72 before "get into", 6.92-6.96 after "chance.",
// 9.66-9.72 before "AI", 20.82-20.86 before "and you have a chance").
export const XT7_BROLL: BrollEv[] = [
  { src: staticFile('broll-xt7-hook-last-chance.png'), tIn: 3.7, tOut: 6.94, mode: 'full' },
  { src: staticFile('broll-xt7-ai-code.png'), tIn: 9.7, tOut: 12.22, mode: 'content' },
  // tOut past the 22.70 s end on purpose: BrollLayer fades the last 0.12 s of a beat, and this one runs to the cut.
  { src: staticFile('broll-xt7-climax-we-all-have-a-chance.png'), tIn: 20.84, tOut: 23.0, mode: 'full' },
];

// One band (top 640): BELOW the tweet's headline + BlackRock/robot images (rows ~90-402, the receipt) and ABOVE
// the caption band (capY 878). Strictly sequential: every tOut + 0.1 render tail <= the next tIn, and none
// overlaps a b-roll beat (B1 ends 2.88 < 3.70, B2 ends 9.60 < 9.70).
export const XT7_BADGES: BadgeEv[] = [
  { tIn: 1.1, tOut: 2.88, color: '#ffe600', line1: 'GET IN', line2: 'NOW', top: 640 },
  { tIn: 8.14, tOut: 9.6, color: '#3aa0ff', line1: 'SOFTWARE ENGINEERS', line2: 'ADMIT IT', top: 640 },
  { tIn: 13.3, tOut: 15.2, color: '#ff9f1c', line1: 'THE FUTURE', line2: 'GETS HARD', top: 640 },
  { tIn: 15.9, tOut: 17.2, color: '#ff5252', line1: 'AND IT\'S COMING', line2: 'VERY SOON', top: 640 },
  { tIn: 17.3, tOut: 19.1, color: '#39ff14', line1: 'THE GOOD NEWS', top: 640 },
];

// Code-built true-RGBA Bitcoin coin on "you guys are all into crypto", over the X sidebar (right of the tweet).
// Overlays paint ABOVE BrollLayer, so it ends (20.80) before the climax full-screen (20.84).
export const XT7_OVERLAYS: OverlayEv[] = [
  { src: staticFile('ovl-xt7-btc-coin.png'), tIn: 19.34, tOut: 20.8, top: 110, left: 610, width: 400, blend: 'normal' },
];

// t = event - attack_sec (sfx library.json), so each crest lands on its frame / in a word gap. `fade` = linear fade over
// the last `fade` s of `dur` (Sfx.fade, LivestreamShort) so a cue truncated mid-ring ends at zero instead of chopping
// (Boom-short / Impact-short / dings measured -18..-28 dB at their cut). Swept OFFLINE on the bare spine vs an
// encode-matched control before the one render (SKILL row 7a; _qa/sfx/, staggered medium.en windows):
//   v1 swoosh-2 crest 8.14 + tail to 8.41 read "every software engineer" as "every solver engineer/junior" in 2 of 3
//      windows -> the near-zero-attack timpani clicker, crest 8.12 in the 8.08-8.14 gap, 0.2 s: control in 3/3.
//   v1 sudden-shock-tight ramp 15.61-15.90 over "happen" dropped the word in 1 of 4 windows -> timpani clicker b,
//      crest 15.90 in the 15.88-15.92 gap: control in 3/3.
//   v1 twinkle (0.68 s ramp 16.62-17.30) over "very soon" lost "soon" in 1-2 windows -> ding/ding.mp3, crest 17.30:
//      control in 6/6 (and the no-cue mix agrees on the residual window-edge variance).
export const XT7_SOUNDS: Sfx[] = [
  { t: 0.0, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.4, dur: 0.42 },
  { t: 1.08, src: staticFile('sfx/kinetic-text/knock-pop.wav'), vol: 0.3, dur: 0.4 },
  { t: 3.67, src: staticFile('sfx/Boom - Big Reveal-short.wav'), vol: 0.32, dur: 0.3, fade: 0.1 },
  { t: 8.08, src: staticFile('sfx/accents/accent-timpani-clicker-01-a.wav'), vol: 0.3, dur: 0.2, fade: 0.07 },
  { t: 9.45, src: staticFile('sfx/accents/accent-scifi-mystery-02-a.wav'), vol: 0.3, dur: 0.45, fade: 0.1 },
  { t: 13.11, src: staticFile('sfx/Impacts/Kick_Impact_01-tight.wav'), vol: 0.35, dur: 0.32, fade: 0.07 },
  { t: 15.84, src: staticFile('sfx/accents/accent-timpani-clicker-01-b.wav'), vol: 0.3, dur: 0.2, fade: 0.07 },
  { t: 17.2, src: staticFile('sfx/ding/ding.mp3'), vol: 0.25, dur: 0.4, fade: 0.1 },
  { t: 19.22, src: staticFile('sfx/Cash Register-ching.wav'), vol: 0.3, dur: 0.6 },
  { t: 20.36, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_3-1s.wav'), vol: 0.12, dur: 0.48, fade: 0.07 },
  { t: 20.7, src: staticFile('sfx/Impacts/Impact_Hit_01-2-short.wav'), vol: 0.4, dur: 0.3, fade: 0.1 },
];

export const XT7_THUMB: ThumbDef = {
  title: 'THIS MIGHT BE\nYOUR <span style="color:#ffe600">LAST CHANCE</span>',
  chip: 'GET INTO ASSETS NOW',
  chipColor: '#ffe600',
  titleSize: 112,
  img: staticFile('thumb-xt7-cover.png'),
};

// kaspa-cocktails clip 7 `bitcoin-maxis-will-move-to-kaspa-impact` (IMPACT, 17.96 s video stream): composition data.
// Batch kaspa-cocktails (livestream 2026-11-02). Plan: shorts/kaspa-cocktails/bitcoin-maxis-will-move-to-kaspa-impact/BROLL-PLAN.md
// Public dir: shorts/kaspa-cocktails/render-assets. Spine is 25 fps (449 frames); the comp runs at 30 fps.
// Seam MEASURED at t = 1 / 9 / 17 s (row means): content rows 0..853, webcam from 854 -> SEAM 854.
// Every image is clip-7-only (`kc7`): the no-duplicate rule vs clip 2 (same topic, same batch).
import { staticFile } from 'remotion';
import type { BrollEv, Sfx } from './_kit';
import type { BadgeEv, OverlayEv, RedactEv, ThumbDef } from './LivestreamShort';

export const KC7_FPS = 30;
export const KC7_DURATION_FRAMES = 539; // last comp frame starts at 17.933 s < 17.96 s spine end: never past the last frame
export const KC7_DURATION_S = KC7_DURATION_FRAMES / KC7_FPS; // 17.967
export const KC7_SEAM = 854;
export const KC7_CAP_Y = 879;
export const KC7_ACCENT = '#00e5ff'; // Kaspa teal: this is a Kaspa clip

export const KC7_CLIP = staticFile('bitcoin-maxis-will-move-to-kaspa-impact.mp4');

// 2 full-screens (hook + climax) + 1 content-zone cutaway. In/out points sit in MEASURED RMS troughs of the spine.
// full 2.44 + 1.77 = 4.21 s; content 1.90 s; 6.11 s of 17.97 s = 34.0 % b-roll / 66.0 % base (band 25-35 %).
export const KC7_BROLL: BrollEv[] = [
  // hook: "a lot of Bitcoin maxis move over to Kaspa." (in at the 3.62 trough, out at the 6.06 trough before "and")
  { src: staticFile('broll-kc7-hook-jump-ship.png'), tIn: 3.62, tOut: 6.06, mode: 'full' },
  // "They actually like Kaspa. Just stacking." (in at the 10.20 trough after "quiet", out at the 12.10 trough)
  { src: staticFile('broll-kc7-blanket-fort.png'), tIn: 10.2, tOut: 12.1, mode: 'content' },
  // climax: "I think that they have their eye on it for now." (in at the 16.20 trough). tOut past the end so the
  // BrollLayer fade-out never ghosts the base through the last frames.
  { src: staticFile('broll-kc7-climax-telescope.png'), tIn: 16.2, tOut: 18.3, mode: 'full' },
];

// No burned-in viewer chat in this span (checked at 1 / 9 / 17 s): no plates.
export const KC7_REDACTIONS: RedactEv[] = [];

// Badge band: `top` is the badge CENTRE (still-frame QA): a 2-line box ~215 px tall spans top-106..top+106, all clear
// of the 879 caption band. Strictly sequential; every
// badge renders until tOut + 0.1 s, and every tOut + 0.1 lands BEFORE the next b-roll tIn. Nothing under the cover.
export const KC7_BADGES: BadgeEv[] = [
  { tIn: 0.1, tOut: 1.5, color: '#00e5ff', line1: 'KASPA\'S DAY', line2: 'IS COMING', top: 430 },
  { tIn: 8.4, tOut: 10.05, color: '#f7931a', line1: 'KEEPING IT', line2: 'QUIET', top: 580 },
  { tIn: 12.12, tOut: 14.25, color: '#f7931a', line1: 'MICHAEL SAYLOR', line2: 'TYPES', top: 430 },
  { tIn: 14.32, tOut: 16.05, color: '#f7931a', line1: 'AND THE', line2: 'WINKLEVOSS TWINS', top: 430 },
];

// Bitcoin coin with a zipped mouth ("keeping it quiet"), glow-on-black -> alpha-from-luminance (true RGBA). Floats
// above the KEEPING IT QUIET badge: 942x1185 alpha at width 300 -> y 40-417 vs the badge's ~474-686 (centre 580).
export const KC7_OVERLAYS: OverlayEv[] = [
  { src: staticFile('ovl-kc7-zipped-btc.png'), tIn: 8.4, tOut: 10.05, top: 40, left: 390, width: 300, blend: 'normal' },
];

// t = event - attack_sec (sfx library.json index) so each crest lands in a MEASURED RMS trough between words.
export const KC7_SOUNDS: Sfx[] = [
  { t: 0.0, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.35, dur: 0.42 },   // cover cut (frame 1)
  { t: 3.59, src: staticFile('sfx/Boom - Big Reveal-short.wav'), vol: 0.32, dur: 0.3 },          // hook full-screen, crest 3.62
  { t: 8.37, src: staticFile('sfx/kinetic-text/knock-pop.wav'), vol: 0.3, dur: 0.25 },           // KEEPING IT QUIET (trough 8.34-8.40)
  { t: 9.95, src: staticFile('sfx/kinetic-text/fast-swoosh.wav'), vol: 0.3, dur: 0.3 },          // blanket fort in, crest 10.20
  { t: 12.09, src: staticFile('sfx/kinetic-text/knock-pop.wav'), vol: 0.3, dur: 0.25 },          // MICHAEL SAYLOR (trough 12.10)
  { t: 14.16, src: staticFile('sfx/Impacts/Impact_Hit_01-2-tight.wav'), vol: 0.3, dur: 0.25 },   // WINKLEVOSS, crest 14.30
  { t: 16.17, src: staticFile('sfx/Boom - Big Reveal-short.wav'), vol: 0.32, dur: 0.35 },        // climax full-screen, crest 16.20
];

export const KC7_THUMB: ThumbDef = {
  title: '<span style="color:#f7931a">BITCOIN MAXIS</span>\nARE QUIETLY\nSTACKING <span style="color:#00e5ff">KASPA</span>',
  chip: 'SHHH...',
  chipColor: '#f7931a',
  titleSize: 120,
  img: staticFile('thumb-kc7-cover.png'),
};

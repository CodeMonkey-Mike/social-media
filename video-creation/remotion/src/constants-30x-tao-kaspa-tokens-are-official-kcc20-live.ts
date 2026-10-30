// 30x-tao clip 4 `kaspa-tokens-are-official-kcc20-live` (FULL, 20.27 s): composition data.
// Batch 30x-tao (livestream 2026-10-28). Plan: shorts/30x-tao/kaspa-tokens-are-official-kcc20-live/BROLL-PLAN.md
// Public dir: shorts/30x-tao/render-assets. Seam MEASURED 853/854 (6 of 6 frames).
// ChatGPT images: 2 (hook + official-unveil). The climax full-screen, the coin overlay and the frame-0 cover are
// code-built (PIL) from the real Kaspa reference / the hook image (low ChatGPT allowance day, Mike 2026-10-28).
import { staticFile } from 'remotion';
import type { BrollEv, Sfx } from './_kit';
import type { BadgeEv, OverlayEv, RedactEv, ThumbDef } from './LivestreamShort';

export const XT4_FPS = 30;
export const XT4_DURATION_S = 20.233;
export const XT4_DURATION_FRAMES = 607; // floor(20.240 video s * 30); audio 20.266 s
export const XT4_SEAM = 854;
export const XT4_CAP_Y = 878;
export const XT4_ACCENT = '#00e5ff'; // Kaspa teal divider

export const XT4_CLIP = staticFile('kaspa-tokens-are-official-kcc20-live.mp4');

export const XT4_BROLL: BrollEv[] = [
  { src: staticFile('broll-xt4-hook-cooking.png'), tIn: 1.04, tOut: 3.6, mode: 'full' },
  { src: staticFile('broll-xt4-official-unveil.png'), tIn: 6.44, tOut: 8.92, mode: 'content' },
  // tOut past the 20.233 s end on purpose: BrollLayer fades the last 0.12 s of a beat, and this one runs to the cut.
  { src: staticFile('broll-xt4-climax-kaspa-coin.png'), tIn: 18.56, tOut: 20.5, mode: 'full' },
];

// One band (top 430 = content-zone centre), strictly sequential: every tOut < the next tIn.
export const XT4_BADGES: BadgeEv[] = [
  { tIn: 3.72, tOut: 6.38, color: '#39ff14', line1: 'KCC20', line2: 'IS LIVE', top: 430 },
  { tIn: 11.78, tOut: 12.98, color: '#b77dff', line1: 'SOLANA TOKENS', top: 430 },
  { tIn: 13.12, tOut: 13.9, color: '#c8b2f8', line1: 'ETH TOKENS', top: 430 },
  { tIn: 14.06, tOut: 14.68, color: '#4da2ff', line1: 'SUI TOKENS', top: 430 },
  { tIn: 14.74, tOut: 16.18, color: '#00e5ff', line1: 'KASPA TOKENS', sub: 'ON THE L1', top: 430 },
];

// The real Kaspa coin as a true-alpha PNG ('normal' blend: the base under it is a WHITE TradingView chart).
export const XT4_OVERLAYS: OverlayEv[] = [
  { src: staticFile('ovl-xt4-kaspa-coin.png'), tIn: 9.0, tOut: 10.86, top: 170, left: 520, width: 460, blend: 'normal' },
];

// Viewer handle "@jhonnyg3225" burned into the base from the scene cut (MEASURED x 0-136, y 703-735). The banner is
// first on screen at comp frame 486 (16.200 s; frame 485 is still the chart), MEASURED on the render: tIn 16.19
// (was 16.24, which let frames 486-487 ship the handle; fixed by splice). The comment text stays (it is the line
// Mike reads). Painted UNDER the b-roll layer.
export const XT4_REDACTIONS: RedactEv[] = [
  { tIn: 16.19, tOut: 20.3, top: 699, height: 40, left: 0, width: 142 },
];

// t = event - attack_sec (library.json), so each crest lands in a word gap. Levels/timings swept OFFLINE on the bare
// spine vs an encode-matched control before the one render (SKILL row 7a; _qa/sfx/sweep1-3*). Timing fixes, full gain:
//   hook Boom dur 0.6 -> 0.30; riser 0.15 -> 0.06 (decoration; -57.7 dB under "Kaspa haters wrong").
//   CLIMAX HIT (fixed on the render by `render_short.py audio`): Impact_Hit_01-2-short 18.48/0.55 masked "Hell yeah"
//   ("I'll kill you my man"); 18.42/0.24 saved "Hell yeah" but its 0.14 s attack RAMP sat at -21 dB over the tail of
//   "wrong." and the render lost "haters wrong" in 4/5 windows (no-hit mix: 4/5 fine). Swapped to the near-zero-attack
//   Boom, crest 18.56 in the true gap 18.55-18.67, 4 frames, ending before "Hell": no energy on either phrase.
export const XT4_SOUNDS: Sfx[] = [
  { t: 0.0, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.4, dur: 0.42 },
  { t: 1.01, src: staticFile('sfx/Boom - Big Reveal-short.wav'), vol: 0.35, dur: 0.3 },
  { t: 3.57, src: staticFile('sfx/DING-093.wav'), vol: 0.3, dur: 0.6 },
  { t: 6.1, src: staticFile('sfx/kinetic-text/whoosh-4.mp3'), vol: 0.4, dur: 0.89 },
  { t: 8.77, src: staticFile('sfx/kinetic-text/swoosh-2.wav'), vol: 0.3, dur: 0.8 },
  { t: 14.51, src: staticFile('sfx/Impacts/Kick_Impact_01-tight.wav'), vol: 0.4, dur: 0.32 },
  { t: 16.02, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.35, dur: 0.42 },
  { t: 16.54, src: staticFile('sfx/Riser Sound Effect-2s.wav'), vol: 0.06, dur: 2.02 },
  { t: 18.53, src: staticFile('sfx/Boom - Big Reveal-short.wav'), vol: 0.35, dur: 0.13 },
];

export const XT4_THUMB: ThumbDef = {
  title: '<span style="color:#00e5ff">KASPA</span> TOKENS\nARE OFFICIAL',
  chip: 'KCC20 IS LIVE',
  chipColor: '#39ff14',
  titleSize: 104,
  img: staticFile('thumb-xt4-cover.png'),
};

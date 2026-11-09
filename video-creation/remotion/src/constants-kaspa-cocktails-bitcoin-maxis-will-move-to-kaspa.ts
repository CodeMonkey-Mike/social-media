// kaspa-cocktails clip 2 `bitcoin-maxis-will-move-to-kaspa` (FULL, 45.28 s video stream): composition data.
// Batch kaspa-cocktails (livestream 2026-11-02). Plan: shorts/kaspa-cocktails/bitcoin-maxis-will-move-to-kaspa/BROLL-PLAN.md
// Public dir: shorts/kaspa-cocktails/render-assets. Spine is 25 fps; the comp runs at 30 fps.
// Seam MEASURED: content rows 0..853 (mean luma ~74), webcam from row 854 (~163) at t = 20 s -> SEAM 854.
// The screen-share is ONE static X post the whole clip (a Kaspa-vs-Bitcoin bear-market chart comparison).
import { staticFile } from 'remotion';
import type { BrollEv, Sfx } from './_kit';
import type { BadgeEv, OverlayEv, RedactEv, ThumbDef } from './LivestreamShort';

export const KC2_FPS = 30;
export const KC2_DURATION_S = 45.26;
export const KC2_DURATION_FRAMES = 1358; // floor(45.28 s video stream * 30): never past the last spine frame
export const KC2_SEAM = 854;
export const KC2_CAP_Y = 879;
export const KC2_ACCENT = '#00e5ff'; // Kaspa teal: this is a Kaspa clip

export const KC2_CLIP = staticFile('bitcoin-maxis-will-move-to-kaspa.mp4');

// 3 full-screens (hook, the ETH-knocks-out-BTC turn, climax) + 2 content-zone cutaways, each tied to one line:
// full 2.38 + 2.94 + 2.96 = 8.28 s; content 3.02 + 3.07 = 6.09 s; 14.37 s of 45.26 s = 31.8 % b-roll / 68.2 % base
// (band 25-35 %). Base keeps the X post (Kaspa vs Bitcoin bear-market charts) on screen, with code badges on it.
export const KC2_BROLL: BrollEv[] = [
  // hook: "where a lot of Bitcoin maxis move over to Kaspa." (in at the 3.62 trough, out in the 5.84-6.10 pause)
  { src: staticFile('broll-kc2-hook-exodus.png'), tIn: 3.6, tOut: 5.98, mode: 'full' },
  // "Bitcoin maxis are keeping it quiet. They actually like Kaspa, just stacking." (out in the 12.02-12.18 pause)
  { src: staticFile('broll-kc2-secret-stacking.png'), tIn: 9.08, tOut: 12.1, mode: 'content' },
  // transition: "Ethereum is going to knock out Bitcoin from the number one position." (in at the 22.34-22.38 trough)
  { src: staticFile('broll-kc2-eth-knockout.png'), tIn: 22.36, tOut: 25.3, mode: 'full' },
  // "It's going to be like a cascading effect over time." (in at the 34.28 trough, out before "Bitcoin" 37.40)
  { src: staticFile('broll-kc2-cascade.png'), tIn: 34.28, tOut: 37.35, mode: 'content' },
  // climax: "What I'm getting at is that Kaspa's future is very, very bright." Runs past the end (clip 1 lesson: a
  // tOut AT the end lets BrollLayer's fade-out ghost the base through the last frames).
  { src: staticFile('broll-kc2-climax-bright-future.png'), tIn: 42.3, tOut: 45.5, mode: 'full' },
];

// Burned-in VIEWER CHAT appears at 42.36 s (MEASURED: first change in the chat band, frame 1059 @ 25 fps):
// "@Harmonic_Fisherman: What im getting at is KASPA's future is VERY bright.." Mike reads it as his closing line, so
// the text stays and only the handle pill (x 0-213, y 702-736) is plated. The climax full-screen covers it anyway;
// the plate is the safety under the b-roll fade.
export const KC2_REDACTIONS: RedactEv[] = [
  { tIn: 42.2, tOut: 45.5, top: 699, height: 40, left: 0, width: 218 },
];

// Badge band: centred at top 430-520 (2-line box ~215 px tall, spans at most ~322-628): above the chat band (698)
// and the caption band (capY 879). Strictly sequential; every badge renders until tOut + 0.1 s, and every
// tOut + 0.1 lands BEFORE the next b-roll tIn (no badge on top of an image).
export const KC2_BADGES: BadgeEv[] = [
  { tIn: 0.1, tOut: 1.45, color: '#00e5ff', line1: 'KASPA WILL', line2: 'HAVE ITS DAY', top: 430 },
  { tIn: 12.5, tOut: 14.25, color: '#f7931a', line1: 'THE SAYLOR', line2: 'TYPES', top: 430 },
  { tIn: 14.45, tOut: 16.05, color: '#f7931a', line1: 'THE WINKLEVOSS', line2: 'TWINS', top: 430 },
  { tIn: 19.8, tOut: 22.2, color: '#c8b2f8', line1: 'MY THEORY:', line2: 'ETH FLIPS BTC', top: 430 },
  { tIn: 26.8, tOut: 28.9, color: '#c8b2f8', line1: 'ETHEREUM', line2: 'DOUBLING DOWN', top: 430 },
  // top 580 (was 520): 'BITCOIN MAXIS' wraps, so this badge renders 4 lines (~400 px, spans ~380-780 < the 854 seam);
  // at 520 its top edge touched the coin overlay's bottom (MEASURED on the render, frame 940), fixed by splice.
  { tIn: 31.16, tOut: 34.1, color: '#00e5ff', line1: 'BITCOIN MAXIS', line2: 'MOVE TO KASPA', top: 580 },
  { tIn: 39.9, tOut: 42.1, color: '#39ff14', line1: 'A YEAR LATER,', line2: 'MORE MOVE', top: 430 },
];

// Bitcoin coin -> teal arrow -> Kaspa coin (generated WITH the kaspa-logo.png reference, glow-on-black ->
// alpha-from-luminance, true RGBA) floats above the "BITCOIN MAXIS / MOVE TO KASPA" badge.
// Band 40-290 (+/-10 px float) vs the 4-line badge's ~380-780: no overlap.
export const KC2_OVERLAYS: OverlayEv[] = [
  // top 40 / width 500 (was 70 / 560): band 40-290 (+/-10 px float), clear of the badge above (fixed by splice).
  { src: staticFile('ovl-kc2-btc-to-kas.png'), tIn: 31.16, tOut: 34.1, top: 40, left: 290, width: 500, blend: 'normal' },
];

// t = event - attack_sec (sfx library.json) so each crest lands in a MEASURED RMS trough between words.
export const KC2_SOUNDS: Sfx[] = [
  { t: 0.0, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.35, dur: 0.42 },  // cover cut (frame 1)
  { t: 3.57, src: staticFile('sfx/Boom - Big Reveal-short.wav'), vol: 0.28, dur: 0.3 },         // hook full-screen, crest 3.60
  { t: 8.83, src: staticFile('sfx/kinetic-text/fast-swoosh.wav'), vol: 0.3, dur: 0.3 },         // stacking cutaway in, crest 9.08
  { t: 12.4, src: staticFile('sfx/kinetic-text/knock-pop.wav'), vol: 0.25, dur: 0.25 },         // THE SAYLOR TYPES badge
  { t: 22.33, src: staticFile('sfx/Boom - Big Reveal-short.wav'), vol: 0.3, dur: 0.35 },        // ETH knockout full-screen, crest 22.36
  { t: 23.6, src: staticFile('sfx/Punch 1.mp3'), vol: 0.3, dur: 0.3 },                          // "knock out", crest 23.84 (trough 23.81-23.91)
  { t: 30.99, src: staticFile('sfx/DING-093.wav'), vol: 0.25, dur: 0.4 },                       // MOVE TO KASPA badge + coin overlay, crest 31.14
  { t: 34.1, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.3, dur: 0.42 },   // cascade cutaway in, crest 34.28
  { t: 39.88, src: staticFile('sfx/kinetic-text/knock-pop.wav'), vol: 0.25, dur: 0.25 },        // A YEAR LATER badge
  { t: 42.27, src: staticFile('sfx/Boom - Big Reveal-short.wav'), vol: 0.32, dur: 0.35 },       // climax full-screen, crest 42.30
];

export const KC2_THUMB: ThumbDef = {
  title: 'THE DAY\n<span style="color:#f7931a">BITCOIN MAXIS</span>\nMOVE TO <span style="color:#00e5ff">KASPA</span>',
  chip: 'THEY\'RE ALREADY STACKING',
  chipColor: '#00e5ff',
  titleSize: 128,
  img: staticFile('thumb-kc2-cover.png'),
};

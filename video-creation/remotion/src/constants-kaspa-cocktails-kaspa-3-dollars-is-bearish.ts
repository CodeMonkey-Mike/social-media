// kaspa-cocktails clip 1 `kaspa-3-dollars-is-bearish` (FULL, 62.52 s video stream): composition data.
// Batch kaspa-cocktails (livestream 2026-11-02). Plan: shorts/kaspa-cocktails/kaspa-3-dollars-is-bearish/BROLL-PLAN.md
// Public dir: shorts/kaspa-cocktails/render-assets. Spine is 25 fps; the comp runs at 30 fps.
// Seam MEASURED: content rows 0..854, webcam from 855 (t = 1/8/14/22/35/50/61 s) -> SEAM 855.
import { staticFile } from 'remotion';
import type { BrollEv, Sfx } from './_kit';
import type { BadgeEv, LogoDef, OverlayEv, RedactEv, ThumbDef } from './LivestreamShort';

export const KC1_FPS = 30;
export const KC1_DURATION_S = 62.5;
export const KC1_DURATION_FRAMES = 1875; // floor(62.52 s video stream * 30): never past the last spine frame
export const KC1_SEAM = 855;
export const KC1_CAP_Y = 880;
export const KC1_ACCENT = '#00e5ff'; // Kaspa teal: this is a Kaspa clip

export const KC1_CLIP = staticFile('kaspa-3-dollars-is-bearish.mp4');

// 2 full-screens (hook + climax) + 6 content-zone cutaways, each tied to one talking point:
// full 2.24 + 2.58 = 4.82 s; content 2.65 + 2.40 + 2.90 + 2.90 + 3.00 + 2.90 = 16.75 s;
// 21.57 s of 62.5 s = 34.5 % b-roll / 65.5 % base (band 25-35 %). Base keeps Mike's own Kaspa-yacht image
// (11.88-17.96) and the Top Performing Assets table (the 353x row = his LAB 350x story) on screen.
export const KC1_BROLL: BrollEv[] = [
  // hook: "$3.33" ends 1.52, crest of the boom at 1.60 (RMS trough 1.52-1.67) -> segment join 3.84 hard cut to base
  { src: staticFile('broll-kc1-hook-yacht.png'), tIn: 1.6, tOut: 3.84, mode: 'full' },
  // "maybe not like next year or the following year" (in at the 7.14 trough)
  { src: staticFile('broll-kc1-one-of-these-years.png'), tIn: 7.15, tOut: 9.8, mode: 'content' },
  // "really scared to give moonboy predictions" (out before the 17.96 screen change)
  { src: staticFile('broll-kc1-moonboy-scared.png'), tIn: 15.5, tOut: 17.9, mode: 'content' },
  // "switching from an oil-backed dollar to a stablecoin"
  { src: staticFile('broll-kc1-oil-to-stablecoin.png'), tIn: 26.0, tOut: 28.9, mode: 'content' },
  // "trade stocks, right? Through tokenized assets in crypto"
  { src: staticFile('broll-kc1-tokenized-stocks.png'), tIn: 33.3, tOut: 36.2, mode: 'content' },
  // "So you're talking about like $100 trillion in crypto" (in at the 43.24-43.30 trough)
  { src: staticFile('broll-kc1-100-trillion.png'), tIn: 43.3, tOut: 46.3, mode: 'content' },
  // "crypto in general, Kaspa is gonna have a more"
  { src: staticFile('broll-kc1-kaspa-wave.png'), tIn: 52.1, tOut: 55.0, mode: 'content' },
  // climax: "So $3 is kind of bearish from that perspective." (in at the 59.90-59.96 trough, runs to the end)
  // tOut 62.7 (past the 62.5 end, was 62.5): at 62.5 BrollLayer's 0.12 s fade-out ghosted the base through the last
  // 4 frames (1871-1874); MEASURED on the render, fixed by splice. The image now holds full to the last frame.
  { src: staticFile('broll-kc1-climax-bearish.png'), tIn: 59.92, tOut: 62.7, mode: 'full' },
];

// Burned-in VIEWER CHAT (MEASURED at t = 1 / 6 / 20 s: handle pill x 0-213 / y 702-736, message bar y 728-778).
// 0-3.84 "@Harmonic_Fisherman: @CantWeedThis I hope so... my target is $3.33 on GOD" carries TWO handles: plated
// whole (Mike's "$3.33" is captioned + badged). 3.84-11.88 "@basicforge: I'm still trying to figure what I'm going
// to do with all those Billions": handle pill only (x 0-117). 11.88-end "@Harmonic_Fisherman: $3.33 is NOT an
// outlandish marketcap either....": Mike answers it ("No, I don't think it's outlandish"), so the comment text
// stays and only the handle pill is plated. Plates overlap each segment join by a frame. Painted UNDER the b-roll.
export const KC1_REDACTIONS: RedactEv[] = [
  // tOut 3.82 (was 3.87): comp frame 115 (3.833 s) already shows the longer @basicforge message, whose tail ran past
  // this 728 px plate for frames 115-116 ("lions"); MEASURED on the render, fixed by splice. Frames <= 114 plated wide.
  { tIn: 0, tOut: 3.82, top: 698, height: 86, left: 0, width: 728 },
  { tIn: 3.8, tOut: 11.92, top: 699, height: 40, left: 0, width: 124 },
  { tIn: 11.85, tOut: 62.6, top: 699, height: 40, left: 0, width: 218 },
];

// Badge band: centred at top 430-560 (2-line box ~215 px tall, so it spans at most ~322-668): above the chat plate
// (698) and the caption band (capY 880). Strictly sequential; every badge renders until tOut + 0.1 s, and every
// tOut + 0.1 lands BEFORE the next b-roll tIn (no badge on top of an image). NBSP keeps each line one run.
export const KC1_BADGES: BadgeEv[] = [
  { tIn: 0.1, tOut: 1.45, color: '#00e5ff', line1: 'KASPA TARGET', line2: '$3.33', top: 430 },
  { tIn: 12.7, tOut: 14.3, color: '#39ff14', line1: 'NOT', line2: 'OUTLANDISH', top: 560 },
  { tIn: 21.1, tOut: 23.25, color: '#39ff14', line1: 'CALLED 20X', line2: 'DID 350X', top: 430 },
  { tIn: 40.14, tOut: 43.1, color: '#39ff14', line1: 'BIGGER THAN', line2: 'GLOBAL STOCKS', top: 430 },
  { tIn: 47.45, tOut: 50.6, color: '#00e5ff', line1: '$3 KASPA', line2: '= $100B MCAP', top: 520 },
  { tIn: 58.4, tOut: 59.75, color: '#39ff14', line1: 'A LOT MORE', line2: 'THAN $100B', top: 430 },
];

// The Kaspa coin (generated WITH the kaspa-logo.png reference, glow-on-black -> alpha-from-luminance, true RGBA)
// floats above the "$3 KASPA = $100B" badge. Band 60-370 (+/-10 px float) vs the badge's 412-628: no overlap.
export const KC1_OVERLAYS: OverlayEv[] = [
  { src: staticFile('ovl-kc1-kaspa-coin.png'), tIn: 47.45, tOut: 50.6, top: 60, left: 390, width: 300, blend: 'normal' },
];

// The REAL LAB logo (schedule-tweets/images/reference/LAB.png, copied in), never a generated one, on "scared with
// LAB". Plate band 150-~360; nothing else is on screen 18.76-20.9 (the CALLED 20X badge starts 21.1).
export const KC1_LOGO: LogoDef = {
  src: staticFile('ref-kc1-lab-logo.png'),
  glow: '#b6ff20',
  reveal: { tIn: 18.76, tOut: 20.9, top: 150, width: 440 },
};

// t = event - attack_sec (sfx library.json) so each crest lands in a MEASURED RMS trough between words.
// Swept offline against an encode-matched control before the render (SKILL row 7a).
export const KC1_SOUNDS: Sfx[] = [
  { t: 0.0, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.35, dur: 0.42 },  // cover cut (frame 1)
  { t: 1.57, src: staticFile('sfx/Boom - Big Reveal-short.wav'), vol: 0.32, dur: 0.3 },        // hook full-screen, crest 1.60
  { t: 23.1, src: staticFile('sfx/Cash Register-ching.wav'), vol: 0.3, dur: 0.3 },             // 350X payoff, crest 23.22 (trough 23.16-23.34)
  { t: 43.02, src: staticFile('sfx/kinetic-text/fast-swoosh.wav'), vol: 0.35, dur: 0.3 },      // $100T cutaway in, crest 43.27
  { t: 47.33, src: staticFile('sfx/Impacts/Impact_Hit_01-2-tight.wav'), vol: 0.35, dur: 0.25 }, // $3 KASPA = $100B, crest 47.47
  { t: 58.37, src: staticFile('sfx/kinetic-text/knock-pop.wav'), vol: 0.3, dur: 0.25 },         // A LOT MORE badge (trough 58.36-58.42)
  { t: 59.9, src: staticFile('sfx/Boom - Big Reveal-short.wav'), vol: 0.32, dur: 0.35 },        // climax full-screen, crest 59.93
];

export const KC1_THUMB: ThumbDef = {
  title: 'A <span style="color:#00e5ff">$3 KASPA</span>\nIS <span style="color:#ff5252">BEARISH?</span>',
  chip: 'HERE\'S THE MATH',
  chipColor: '#00e5ff',
  titleSize: 140,
  img: staticFile('thumb-kc1-cover.png'),
};

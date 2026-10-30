// 30x-tao clip 5 `no-2029-top-new-ath-every-year` (FULL, 30.92 s spine): composition data.
// Batch 30x-tao (livestream 2026-10-28). Plan: shorts/30x-tao/no-2029-top-new-ath-every-year/BROLL-PLAN.md
// Public dir: shorts/30x-tao/render-assets. Seam MEASURED 853/854 (7 frames, t = 1/8/14/15/16/22/29.5 s).
import { staticFile } from 'remotion';
import type { BrollEv, Sfx } from './_kit';
import type { BadgeEv, OverlayEv, RedactEv, ThumbDef } from './LivestreamShort';

export const XT5_FPS = 30;
export const XT5_DURATION_S = 30.9;
export const XT5_DURATION_FRAMES = 927; // floor(30.92 s video stream * 30): never past the last spine frame
export const XT5_SEAM = 854;
export const XT5_CAP_Y = 878;
export const XT5_ACCENT = '#f7931a'; // Bitcoin orange (teal would read as Kaspa)

export const XT5_CLIP = staticFile('no-2029-top-new-ath-every-year.mp4');

// 2 full-screens (hook + peak) + 1 code-built content-zone chart:
// 2.78 + 3.38 + 2.92 = 9.08 s of 30.9 s = 29.4 % b-roll / 70.6 % base (band 25-35 %).
export const XT5_BROLL: BrollEv[] = [
  { src: staticFile('broll-30xtao-c5-hook-cycle-break.png'), tIn: 2.72, tOut: 5.5, mode: 'full' },
  { src: staticFile('broll-30xtao-c5-ath-staircase.png'), tIn: 10.1, tOut: 13.48, mode: 'full' },
  { src: staticFile('broll-30xtao-c5-supply-chart.png'), tIn: 20.4, tOut: 23.32, mode: 'content' },
];

// The burned-in viewer chat (handle "@goku20015" + "think i can hit $100k this bullrun? hmm hope so") sits on the
// base 0-13.52 s (MEASURED: pill x 0-119 / y 702-729, bar x 0-601 / y 729-779; gone from spine frame 13.52). It is
// NOT a line Mike reads in this clip, its "$100k" reads as a BTC target, and a viewer handle must not ship:
// plated whole. Painted UNDER the b-roll, so both full-screens cover it normally.
export const XT5_REDACTIONS: RedactEv[] = [
  { tIn: 0, tOut: 13.52, top: 698, height: 85, left: 0, width: 608, accent: '#f7931a' },
];

// Badge band (centred at top 430/500, spans ~320-610): above the redaction plate (698) and the caption band (878).
// Strictly sequential, never under a full-screen (each tOut < the next b-roll tIn).
// NBSP (\u00a0) between words: the shared Badge sits at left:50%, so its shrink-to-fit content width is capped at
// ~426 px unless one unbreakable run is wider; a plain-space line ("NOT A BELIEVER", 770 px) would wrap.
// Widest box = 884 px (Arial Black proxy), inside 1080.
export const XT5_BADGES: BadgeEv[] = [
  { tIn: 0.82, tOut: 2.66, color: '#ff5252', line1: '4-YEAR\u00a0CYCLE', line2: 'NOT\u00a0A\u00a0BELIEVER', top: 430 },
  { tIn: 7.6, tOut: 9.56, color: '#ff5252', line1: 'NO\u00a02029\u00a0TOP', top: 430 },
  { tIn: 15.36, tOut: 17.14, color: '#39ff14', line1: 'THINK\u00a0IN\u00a0VALUE', line2: 'NOT\u00a0DOLLARS', top: 430 },
  // lands on the spoken "$9,000" (28.06); silent by design, see XT5_SOUNDS
  { tIn: 27.9, tOut: 29.78, color: '#39ff14', line1: 'IT\'S\u00a0REALLY', line2: '$9,000', top: 500 },
  { tIn: 29.95, tOut: 31.2, color: '#ff5252', line1: 'INFLATION', top: 500 },
];

// The REAL Bittensor reference glyph (bittensor-tao.png) on a code-drawn coin, true alpha, on "$3,000 Bittensor".
// Band 90-400 (+/-10 px float): clear of the $9,000 badge band (391-609), which only starts after it is gone.
export const XT5_OVERLAYS: OverlayEv[] = [
  { src: staticFile('ovl-30xtao-c5-tao-coin.png'), tIn: 25.8, tOut: 27.22, top: 90, left: 390, width: 300, blend: 'normal' },
];

// t = event - attack_sec (library.json) so each crest lands in a MEASURED RMS trough between words. Every cue was
// swept OFFLINE before the render (zero renders, _qa/sfx/: staggered medium.en windows vs an encode-matched control,
// SKILL row 7a). Final set = sweep-v3 mix-F1: the control's reading in every cue window (window-edge artifacts only).
export const XT5_SOUNDS: Sfx[] = [
  { t: 0.0, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.45, dur: 0.42 },   // cover cut (frame 1)
  { t: 0.79, src: staticFile('sfx/kinetic-text/knock-pop.wav'), vol: 0.35, dur: 0.45 },          // 4-YEAR CYCLE badge, trough 0.77-0.81
  { t: 2.69, src: staticFile('sfx/Boom - Big Reveal-short.wav'), vol: 0.32, dur: 0.4 },          // hook full-screen, crest 2.72 (-72 dB)
  // (swapped) sudden-shock-tight crest 7.60 had its 0.29 s attack over "I know" (lost in 1/3); the zero-attack knock
  // starting AT 7.60 = control 3/3.
  { t: 7.6, src: staticFile('sfx/kinetic-text/knock-pop.wav'), vol: 0.35, dur: 0.3 },            // NO 2029 TOP badge
  // (swapped) Kick-tight's 0.19 s attack over "like" read 1/3; zero-attack Boom, same crest, full gain = 3/3.
  { t: 10.09, src: staticFile('sfx/Boom - Big Reveal-short.wav'), vol: 0.32, dur: 0.25 },        // peak full-screen, crest 10.12
  // (tail cut 0.42 -> 0.25 s) the full whoosh tail ran into "You have to think" (1/3 -> 3/3).
  { t: 13.33, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.4, dur: 0.25 },   // out of the peak, crest 13.51 (segment join)
  { t: 15.02, src: staticFile('sfx/DING-093.wav'), vol: 0.28, dur: 0.6 },                        // VALUE badge, crest 15.17
  // (tail cut 0.6 -> 0.4 s, ends 20.43) the whoosh tail masked "If" in 3/3 windows; ending before "If" = 3/3.
  { t: 20.04, src: staticFile('sfx/kinetic-text/whoosh-4.mp3'), vol: 0.4, dur: 0.4 },            // chart in, crest 20.37
  { t: 25.52, src: staticFile('sfx/kinetic-text/fast-swoosh.wav'), vol: 0.35, dur: 0.45 },       // TAO coin in, crest 25.77
  // (DELETED) the $9,000 payoff hit: at 27.20 every candidate (ching 0.35/0.20/tail-cut, knock, kick) garbled
  // "Bittensor" 0/3; after "$9,000 now," (crest 28.72) knock/ching/kick each ate "now" (0/3). No timing or gain saves
  // it, so the badge lands silently on the spoken "$9,000" and the INFLATION hit closes the line.
  // (retimed) crest 30.10 ate "Just" (1/3); crest 29.95 in the "that.|Just" trough = 3/3.
  { t: 29.81, src: staticFile('sfx/Impacts/Impact_Hit_01-2-tight.wav'), vol: 0.35, dur: 0.3 },   // INFLATION badge, crest 29.95
];

export const XT5_THUMB: ThumbDef = {
  title: 'NO <span style="color:#f7931a">2029</span>\nTOP.',
  chip: 'BITCOIN ATH EVERY YEAR',
  chipColor: '#f7931a',
  titleSize: 150,
  img: staticFile('thumb-30xtao-c5-cover.png'),
};

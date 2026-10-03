import { staticFile } from 'remotion';
import { type BrollEv, type Sfx } from './_kit';
import type { ThumbDef, BadgeEv, OverlayEv } from './LivestreamShort';

// ─────────────────────────────────────────────────────────────────────────────────────────────
// batch uptober / clip #6 - `october-coins-first-week-pump` (variant: FULL)
// clip-plan title: "October Coins Pump the First Week of October"
//
// "October is one of those plays that it's gonna pump hard and you're gonna get out really fast. This thing hit
//  a 75 million market cap, and [it did it on,] did it like in the first week of October? So on Solana, imagine
//  going up out of the blue, going up to 70 million. The pumpkin related ones will probably pump in the ending
//  of October, whereas the October related coins will probably pump in the beginning of October. I call this a
//  29K market cap because everybody's gonna buy back in in October. If we get that type of a pump we could be
//  seeing something like in 2024, like a 70 million dollar type of October coin."
//
// Spine: shorts/uptober/october-coins-first-week-pump/october-coins-first-week-pump-final.mp4, staged to
// render-assets/october-coins-first-week-pump.mp4 - VERIFIED on the staged file: has_b_frames 0,
// 1080x1920 @25 fps, video 34.760 s, audio 34.766 s.
// Plan of record: shorts/uptober/october-coins-first-week-pump/BROLL-PLAN.md
// Captions: captionsUptoberOctoberCoins.ts (canonical captions skill; header = provenance).
// Build directives for clip 6 (clip_directives.py --batch uptober --clip 6): none. No coverage exemption.
// ─────────────────────────────────────────────────────────────────────────────────────────────

export const OC6_FPS = 30;
// Video 34.760 s, audio 34.766 s. 1042 frames: the LAST rendered frame (1041) sits at 34.700 s, inside both
// tracks. Last word "coin." ends 34.66 s: a hard out.
export const OC6_DURATION = 1042;
const END_S = OC6_DURATION / OC6_FPS; // 34.733

// MEASURED on THIS spine (_qa/measure.py): row-mean gradient scan (rows 600-1300) on 9 frames
// (t = 2, 6, 10, 14, 18, 22, 27, 31, 34 s) puts the largest step at the 853/854 boundary on 9 of 9.
export const OC6_SEAM = 854;
// Caption band centre: a 74 px caption with its 13 px stroke spans ~910..1010, 56 px clear of the seam.
export const OC6_CAP_Y = 960;
// UPTOBER green (the reference mascot's hoodie/arrow green, and the "green October" idea); never Kaspa teal.
export const OC6_ACCENT = '#39ff6a';
const GOLD = '#ffc629';
const ORANGE = '#ff8c1a';

export const CLIP_OC6 = staticFile('october-coins-first-week-pump.mp4');

// ── FRAME-0 COVER (ONE frame; `durS` omitted so LivestreamShort uses 1/fps) ───────────────────
// Art = the uptober.png cat (green hoodie + cape; generated WITH the reference, lettering NOT reproduced) on a
// giant number-free calendar page whose FIRST ROW glows green; top 45% left empty for the CODE title.
// No day-relative words on the cover.
export const THUMB_DEF_OC6: ThumbDef = {
  img: staticFile('thumb-oc6-cover.png'),
  title: 'PUMP HARD,\nGET OUT\nFAST',
  chip: 'ONE OCTOBER COIN HIT $75M IN WEEK 1',
  chipColor: OC6_ACCENT,
  titleSize: 128,
};

// ── B-ROLL ──────────────────────────────────────────────────────────────────────────────────────
// Budget (video-creation/SKILL.md "B-roll coverage budget (HALVED 2026-07-14)"):
//   2.26 + 2.24 + 2.68 + 1.98 + 2.413 = 11.573 s of 34.733 s = 33.3 % b-roll / 66.7 % base
//   5 distinct images, each used EXACTLY ONCE, no loop, no reuse
//   2 full-screen moments: the hook and the climax (inside the FIRM cap of 3)
// The base content zone: DexScreener search "uptober" (0-1.6), chart loading (1.6-2.0), the UPTOBER/SOL
// market-cap chart with its ~75M spike = THE RECEIPT (2.0-15.3), then the Pumpkin/SOL chart (15.3-end).
// A burned-in viewer chat banner ("Got price prediction for uptober??", y ~720-780) ships as filmed.
export const BROLL_OC6: BrollEv[] = [
  // HOOK, full-screen. "pump hard and you're gonna get out really fast" - the cat leaping off the peak of a
  // green candle rocket under a green parachute. Frames 1..2.48 are the face + "uptober" search base.
  // OUT at 4.74 on "This thing hit" so the 75M chart receipt shows.
  { src: staticFile('broll-oc6-hook-bailout.png'), tIn: 2.48, tOut: 4.74, mode: 'full' },
  // "imagine going up out of the blue, going up to 70 million." - a Solana rocket punching out of a calm
  // blue sky. OUT at 14.84 just after "million." (14.80); the Pumpkin chart arrives at 15.3 on the base.
  { src: staticFile('broll-oc6-solana-blue.png'), tIn: 12.60, tOut: 14.84, mode: 'content' },
  // "the October related coins will probably pump" - the cat blasting off at dawn while the jack-o'-lanterns
  // sleep. OUT at 22.30 so "in the beginning of October. I call this a 29K" plays on the chart.
  { src: staticFile('broll-oc6-early-vs-pumpkins.png'), tIn: 19.62, tOut: 22.30, mode: 'content' },
  // "everybody's gonna buy back in in October." - silhouettes scrambling back onto a green-candle coaster.
  { src: staticFile('broll-oc6-buy-back-in.png'), tIn: 26.48, tOut: 28.46, mode: 'content' },
  // CLIMAX, full-screen. "a 70 million dollar type of October coin." - the cat enthroned atop a green candle
  // tower under the harvest moon. Runs to the hard out: tOut sits 0.4 s PAST the last frame so BrollLayer's
  // 0.15 s fade-out never starts (draft QA showed a half-faded last frame at tOut = END_S).
  { src: staticFile('broll-oc6-climax-70m.png'), tIn: 32.32, tOut: END_S + 0.4, mode: 'full' },
];

// No alpha overlays on this clip.
export const OVERLAYS_OC6: OverlayEv[] = [];

// ── BADGES (code-drawn) ─────────────────────────────────────────────────────────────────────────
// All on BASE beats; never sharing a window with each other or a b-roll image. `top` = badge centre y
// (~105 px above/below): top 560 spans ~455-665, over the transactions table, under the chart's price action
// (y ~60-400) and clear of the burned-in chat banner (y ~720-780).
export const BADGES_OC6: BadgeEv[] = [
  // "a 75 million market cap" - the UPTOBER chart's spike is on screen behind it.
  { tIn: 5.75, tOut: 7.45, color: OC6_ACCENT, line1: '$75M', sub: 'UPTOBER MARKET CAP', top: 560 },
  // "in the first week of October?"
  { tIn: 10.40, tOut: 11.70, color: GOLD, line1: '1ST', sub: 'WEEK OF OCTOBER', top: 560 },
  // "The pumpkin related ones will probably pump in the ending of October" - Pumpkin/SOL chart behind it.
  { tIn: 16.40, tOut: 18.40, color: ORANGE, line1: 'PUMPKIN', sub: 'PUMPS LATE OCTOBER', top: 560 },
  // "I call this a 29K market cap"
  { tIn: 25.20, tOut: 26.40, color: GOLD, line1: '$29K', sub: 'THE CALL', top: 560 },
  // "something like in 2024"
  { tIn: 30.80, tOut: 32.20, color: OC6_ACCENT, line1: '2024', sub: 'IF IT REPEATS', top: 560 },
];

// ── SFX ─────────────────────────────────────────────────────────────────────────────────────────
// Measured palette (batch-staged copies in render-assets/sfx/, crest = 5 ms peak-envelope @16 kHz):
//   transition_rapid_whoosh        0.967 s, crest 0.165 s
//   transition_rapid_whoosh-tight  0.420 s, crest 0.165 s
//   card-impact-layered            1.450 s, crest 0.030 s
//   DING-093                       0.930 s, crest 0.150 s
//   DSGNImpt-single_impact_sound   2.000 s, crest 0.030 s
// Every `t` is (cue time - crest) so the crest lands ON the cut / badge frame.
export const SFX_OC6: Sfx[] = [
  // the frame-0 cover cutting to the base at frame 1. Low: it sits under "October".
  { t:  0.033, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.12, dur: 1.00 },
  // hook reveal hit on the 2.48 full-screen cut ("pump").
  { t:  2.45, src: staticFile('sfx/Impacts/card-impact-layered.wav'), vol: 0.14, dur: 1.50 },
  // ding on the $75M badge, crest on 5.75.
  { t:  5.60, src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 },
  // ding on the 1ST WEEK badge, crest on 10.40.
  { t: 10.25, src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 },
  // whoosh into the Solana cutaway at 12.60.
  { t: 12.435, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.42 },
  // ding on the PUMPKIN badge, crest on 16.40.
  { t: 16.25, src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 },
  // whoosh into the early-vs-pumpkins cutaway at 19.62.
  { t: 19.455, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.42 },
  // ding on the $29K badge, crest on 25.20.
  { t: 25.05, src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 },
  // whoosh into the buy-back-in cutaway at 26.48.
  { t: 26.315, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.42 },
  // ding on the 2024 badge, crest on 30.80.
  { t: 30.65, src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 },
  // THE payoff hit on the climax cut (32.32), under "70 million dollar".
  { t: 32.29, src: staticFile('sfx/Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3'), vol: 0.20, dur: 2.05 },
];

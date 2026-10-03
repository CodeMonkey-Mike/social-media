import { staticFile } from 'remotion';
import { type BrollEv, type Sfx } from './_kit';
import type { ThumbDef, BadgeEv, OverlayEv } from './LivestreamShort';

// ─────────────────────────────────────────────────────────────────────────────────────────────
// batch uptober / clip #1 - `spawn-doubled-for-the-haters` (variant: FULL)
// clip-plan title: "Dedicated to the Haters: Spawn Doubled in a Day"
//
// "This one is dedicated to all y'all haters out there. But I was talking about it yesterday on stream. I had
//  haters in my own Discord hating on this play and I'm like, woo! Look what we did, man. Holy guacamole. So
//  50K. I was talking about it here. Went up, doubled our money. It was at 50K yesterday and it's at 101K
//  today. It is definitely not dead and it's just waiting for you guys to buy in. But it can go to 200K if the
//  market cap goes to 5 million and that's 100x. Well, at least from yesterday you guys get in now. You're
//  gonna do like a 50x. It goes to 5 million. But if you got in yesterday when I told you, yeah, it could be
//  like 100x."
//
// Sequel to batch spon clip 1 (SponMembersHateIt): same token (SPON, Whisper "Spawn"), story moved forward.
// None of spon's concepts/files reused (spon1: boxing ring, pitchfork mob, runner, furnace, summit, glove).
//
// Spine: shorts/uptober/spawn-doubled-for-the-haters/spawn-doubled-for-the-haters-final.mp4, staged
// GOP-seek-friendly to render-assets/spawn-doubled-for-the-haters.mp4 - VERIFIED on the staged file:
// has_b_frames 0, 1080x1920 @25 fps, video 45.000 s, audio 45.016 s.
// Plan of record: shorts/uptober/spawn-doubled-for-the-haters/BROLL-PLAN.md
// Captions: captionsUptoberSpawnDoubled.ts (canonical captions skill; header = provenance).
// Build directives for clip 1 (clip_directives.py --batch uptober --clip 1): none. No coverage exemption.
// ─────────────────────────────────────────────────────────────────────────────────────────────

export const UPT1_FPS = 30;
// Video 45.000 s, audio 45.016 s. 1350 frames: the LAST rendered frame (1349) sits at 44.967 s, inside both
// tracks. Last word "100x." ends 44.98 s: a hard out.
export const UPT1_DURATION = 1350;

// MEASURED on THIS spine (_qa/measure.py): row-mean gradient scan (rows 600-1300) on 8 frames
// (t = 2, 8, 15, 22, 28, 34, 40, 44 s) puts the largest step at the 853/854 boundary on 8 of 8.
export const UPT1_SEAM = 854;
// Caption band centre: a 74 px caption with its 13 px stroke spans ~910..1010, 56 px clear of the seam.
export const UPT1_CAP_Y = 960;
// Robinhood-chain LIME (SPON trades on Robinhood > Uniswap; also the sponge's own colour); never Kaspa teal.
export const UPT1_ACCENT = '#ccff00';
const GOLD = '#ffc629';
const GREEN = '#39ff14';

export const CLIP_UPT1 = staticFile('spawn-doubled-for-the-haters.mp4');

// ── FRAME-0 COVER (ONE frame; `durS` omitted so LivestreamShort uses 1/fps) ───────────────────
// Art = the SPON sponge (generated WITH spon.png attached) on a gold winner's podium holding a trophy, a
// doubling lime candle behind, a few ignored arms-crossed silhouettes; top 45% left empty for the CODE title.
// No day-relative words on the cover (they are false by post time).
export const THUMB_DEF_UPT1: ThumbDef = {
  img: staticFile('thumb-upt1-cover.png'),
  title: 'DEDICATED\nTO THE\nHATERS',
  chip: '$SPON DOUBLED: 50K TO 101K',
  chipColor: UPT1_ACCENT,
  titleSize: 132,
};

// ── B-ROLL ──────────────────────────────────────────────────────────────────────────────────────
// Budget (video-creation/SKILL.md "B-roll coverage budget (HALVED 2026-07-14)"):
//   3.22 + 2.80 + 1.90 + 2.80 + 2.50 = 13.22 s of 45.00 s = 29.4 % b-roll / 70.6 % base
//   5 distinct images, each used EXACTLY ONCE, no loop, no reuse
//   2 full-screen moments: the hook and the climax (inside the FIRM cap of 3)
// The base is ONE screen the whole clip: the DexScreener SPON/ETH market-cap chart (the receipt, ~101K-115K)
// with the transactions table under it (frame-diff rows 0..840 @10 fps: no content cuts; the only event is a
// burned-in viewer chat banner at y ~700-790, 34.2-35.1 s, which ships as filmed).
export const BROLL_UPT1: BrollEv[] = [
  // HOOK, full-screen. "dedicated to all y'all" - the sponge as a rock star dedicating a song to an arms-crossed
  // silhouette crowd. Frames 1..1.40 are the face + chart base (Phase 7 rule 5) on "This one is". OUT at 4.62
  // on "haters" so the word lands on Mike's face.
  { src: staticFile('broll-upt1-hook-dedication.png'), tIn: 1.40, tOut: 4.62, mode: 'full' },
  // "I had haters in my own Discord hating on this" - the sponge lounging in a Discord window while angry
  // bubbles bounce off it. OUT at 11.20 so "play and I'm like, woo! Look what we did" is on the chart.
  { src: staticFile('broll-upt1-discord-haters.png'), tIn: 8.40, tOut: 11.20, mode: 'content' },
  // "Went up, doubled our money." - the sponge pulling the lever on a coin-doubling copy machine. OUT at 26.10,
  // so "It was at 50K yesterday and it's at 101K today" plays on the chart receipt + the $101K badge.
  { src: staticFile('broll-upt1-doubling.png'), tIn: 24.20, tOut: 26.10, mode: 'content' },
  // "It is definitely not dead and it's just waiting" - the sponge bursting alive out of a grave.
  { src: staticFile('broll-upt1-not-dead.png'), tIn: 29.30, tOut: 32.10, mode: 'content' },
  // CLIMAX, full-screen. "to 5 million and that's 100x." - the sponge riding a candlestick rocket past the moon.
  // OUT at 37.74 on "from" so "yesterday you guys get in now ... 100x" plays on Mike + the chart to the hard out.
  { src: staticFile('broll-upt1-climax-moon.png'), tIn: 35.24, tOut: 37.74, mode: 'full' },
];

// ── TRANSPARENT OVERLAY (alpha PNG: generated on pure black, keyed by _qa/make_alpha2.py = BORDER-CONNECTED
// near-black -> transparent, so the dark pupils/skin rim stay opaque; 976x1167 crop) ──────────────────
// Geometry: width 300 -> ~359 px tall; top 455 -> bottom ~814 (+10 px float) stays above the 854 seam.
// ONE real alpha overlay on a BASE beat. "Holy guacamole." - a happy cartoon avocado pops in over the left of
// the transactions table (the chart's price action at y 0..460 stays clear), leaves in the pause before "So".
// Clear of every badge window, the caption band and the b-roll windows.
export const OVERLAYS_UPT1: OverlayEv[] = [
  { src: staticFile('ovl-upt1-avocado.png'), tIn: 17.25, tOut: 19.55, top: 455, left: 60, width: 300, blend: 'normal' },
];

// ── BADGES (code-drawn) ─────────────────────────────────────────────────────────────────────────
// Never sharing a window with each other, the overlay or a same-zone b-roll image. `top` = badge centre y
// (~105 px above/below). top 620 (~515-725) sits over the transactions table, under the chart's price
// action. The $200K badge rides HIGHER (top 470, ~365-575) because the burned-in chat banner occupies
// y ~700-790 from 34.2 to 35.1. line1 is ONE token (Badge shrink-wraps inside half the frame width).
export const BADGES_UPT1: BadgeEv[] = [
  { tIn: 15.85, tOut: 17.15, color: UPT1_ACCENT, line1: '$SPON', sub: 'LOOK WHAT WE DID', top: 620 },
  { tIn: 20.70, tOut: 22.90, color: GOLD, line1: '$50K', sub: 'THE ENTRY', top: 620 },
  { tIn: 27.90, tOut: 29.20, color: GREEN, line1: '$101K', sub: 'DOUBLED FROM $50K', top: 620 },
  { tIn: 33.55, tOut: 34.95, color: UPT1_ACCENT, line1: '$200K', sub: 'NEXT STOP', top: 470 },
  { tIn: 40.00, tOut: 41.70, color: GOLD, line1: '50x', sub: 'GET IN NOW', top: 620 },
  { tIn: 44.00, tOut: 45.00, color: GREEN, line1: '100x', sub: 'FROM THE $50K ENTRY', top: 620 },
];

// ── SFX ─────────────────────────────────────────────────────────────────────────────────────────
// Measured palette (5 ms peak-envelope at 16 kHz, whole files):
//   transition_rapid_whoosh        0.967 s, crest 0.165 s
//   transition_rapid_whoosh-tight  0.420 s, crest 0.165 s
//   card-impact-layered            1.450 s, crest 0.030 s
//   DING-093                       0.930 s, crest 0.150 s
//   Kick_Impact_01-short           0.550 s, crest 0.185 s
//   DSGNImpt-single_impact_sound   2.000 s, crest 0.030 s
// Every `t` is (cue time - crest) so the crest lands ON the cut / badge frame.
export const SFX_UPT1: Sfx[] = [
  // the frame-0 cover cutting to the base at frame 1. Low: it sits under "This one".
  { t:  0.033, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.12, dur: 1.00 },
  // hook reveal hit on the 1.40 full-screen cut ("dedicated").
  { t:  1.37, src: staticFile('sfx/Impacts/card-impact-layered.wav'), vol: 0.14, dur: 1.50 },
  // whoosh into the Discord cutaway at 8.40 (tight variant, ends 8.655).
  { t:  8.235, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.42 },
  // ding on the $SPON badge, crest on 15.85 ("look"), tail cut to 0.45 s.
  { t: 15.70, src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 },
  // the avocado pop: crest on 17.25, tail truncated to end 17.315, before "holy" (17.34).
  { t: 17.065, src: staticFile('sfx/Impacts/Kick_Impact_01-short.wav'), vol: 0.14, dur: 0.25 },
  // ding on the $50K badge, crest on 20.70, in the pause before "So" (20.84); ends 20.95.
  { t: 20.55, src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.40 },
  // whoosh into the doubling cutaway at 24.20, in the pause before "Went" (24.38).
  { t: 24.035, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.42 },
  // ding on the $101K badge, crest on 27.90.
  { t: 27.75, src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 },
  // whoosh into the not-dead cutaway at 29.30.
  { t: 29.135, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.42 },
  // ding on the $200K badge, crest on 33.55.
  { t: 33.40, src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 },
  // THE payoff hit on the climax cut (35.24), under "to 5 million".
  { t: 35.21, src: staticFile('sfx/Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3'), vol: 0.20, dur: 2.05 },
  // ding on the 50x badge, crest on 40.00.
  { t: 39.85, src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 },
  // ding on the closing 100x badge, crest on 44.00.
  { t: 43.85, src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 },
];

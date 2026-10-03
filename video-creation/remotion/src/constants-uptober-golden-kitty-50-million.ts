import { staticFile } from 'remotion';
import { type BrollEv, type Sfx } from './_kit';
import type { ThumbDef, BadgeEv, OverlayEv } from './LivestreamShort';

// ─────────────────────────────────────────────────────────────────────────────────────────────
// batch uptober / clip #5 - `golden-kitty-50-million` (variant: FULL)
// clip-plan title: "Golden Kitty Should Totally Go Up, Here Is Why"
//
// "Golden is gonna be pretty damn good. It should totally go up just because of the amount of action it has
//  going on with influencers and KOLs. The bulls start running in a couple weeks. I mean, something like
//  Golden Kitty is probably gonna go up to like, you know, like 50 million or something. That is gonna be
//  like a big, big pump. Golden Kitty could be a pretty good meme with organic growth. Man, I wish we get a
//  run-up caused by these four-year cycle zombies buying back in and things start pumping. Like something
//  like Golden Kitty and a lot of them, man, are gonna be flying. It's gonna be maybe like 10x from here."
//
// Earlier Golden Kitty shorts (beer-and-kaspa, golden-kitty-dominance, spon) used: golden train + zombies,
// statue + hype crowd, listing boards, rocket, meteors, needle spike, mini statues on a globe. None of those
// concepts or files are reused here (treasure hoard, phone wall, air pump, zombie ticket booth, gold bull).
//
// Spine: shorts/uptober/golden-kitty-50-million/golden-kitty-50-million-final.mp4, staged GOP-seek-friendly
// to render-assets/golden-kitty-50-million.mp4 - VERIFIED on the staged file: has_b_frames 0, 1080x1920
// @25 fps, video 31.040 s, audio 31.066 s.
// Plan of record: shorts/uptober/golden-kitty-50-million/BROLL-PLAN.md
// Captions: captionsUptoberGoldenKitty50M.ts (canonical captions skill; header = provenance).
// Build directives for clip 5 (clip_directives.py --batch uptober --clip 5): none. No coverage exemption.
// ─────────────────────────────────────────────────────────────────────────────────────────────

export const GK5_FPS = 30;
// Video 31.040 s, audio 31.066 s. 931 frames: the LAST rendered frame (930) sits at 31.000 s, inside both
// tracks. Last word "here." ends 31.04 s: a hard out.
export const GK5_DURATION = 931;

// MEASURED on THIS spine (_qa/measure.py): row-mean gradient scan (rows 600-1300) on 9 frames
// (t = 1, 4, 8, 12, 16, 20, 24, 28, 30.5 s) puts the largest step at the 853/854 boundary on 9 of 9.
export const GK5_SEAM = 854;
// Caption band centre: a 74 px caption with its 13 px stroke spans ~910..1010, 56 px clear of the seam.
export const GK5_CAP_Y = 960;
// GOLD: the Golden Kitty statuette's own colour (GOLDEN trades on Robinhood chain > Uniswap). Never Kaspa teal.
export const GK5_ACCENT = '#ffc629';
const LIME = '#ccff00';
const GREEN = '#39ff14';

export const CLIP_GK5 = staticFile('golden-kitty-50-million.mp4');

// ── FRAME-0 COVER (ONE frame; `durS` omitted so LivestreamShort uses 1/fps) ───────────────────
// Art = the Golden Kitty statuette (generated WITH golden-kitty.png attached) riding a gold platform up a
// shaft of lime candles; top 45% left empty for the CODE title. No day-relative words on the cover.
export const THUMB_DEF_GK5: ThumbDef = {
  img: staticFile('thumb-gk5-cover.png'),
  title: 'GOLDEN\nKITTY\nTO $50M?',
  chip: '$GOLDEN: HERE IS WHY',
  chipColor: GK5_ACCENT,
  titleSize: 132,
};

// ── B-ROLL ──────────────────────────────────────────────────────────────────────────────────────
// Budget (video-creation/SKILL.md "B-roll coverage budget (HALVED 2026-07-14)"):
//   2.08 + 2.26 + 1.94 + 2.86 = 9.14 s of 31.03 s = 29.5 % b-roll / 70.5 % base
//   4 distinct images, each used EXACTLY ONCE, no loop, no reuse
//   2 full-screen moments: the hook and the climax (inside the FIRM cap of 3)
// The base is ONE screen the whole clip: the DexScreener GOLDEN/GLD market-cap chart (4.61M, the receipt)
// with the transactions table under it. Frame-diff (rows 0..840 @10 fps) finds 3 events, all burned-in
// viewer chat banners at y ~700-775 ("chart looking like nice ladder up" 1.8-7.6, "Golden kitty can be
// pretty good meme with organic growth" 17.8-end); they ship as filmed and badges ride above them.
export const BROLL_GK5: BrollEv[] = [
  // HOOK, full-screen. "be pretty damn good. It should totally" - the gold statuette in front of a blazing
  // treasure hoard. Frames 1..0.88 are the face + chart base (Phase 7 rule 5) on "Golden is gonna". IN at 0.88
  // (not 0.54): the reveal hit's crest on the 0.1 s word "is" read "Golden ARE gonna" (see SFX). Hides the
  // 1.8 segment join. OUT at 2.96 on "go" so "go up" lands on the real chart + the $GOLDEN badge.
  { src: staticFile('broll-gk5-hook-treasure.png'), tIn: 0.88, tOut: 2.96, mode: 'full' },
  // "has going on with influencers and KOLs." - a wall of phones on ring-light tripods all filming the
  // statuette. IN at 5.44, the it/has boundary, so its whoosh crest sits between words (see SFX). Hides the
  // 7.6 segment join. OUT at 7.70, in the pause before "The bulls".
  { src: staticFile('broll-gk5-influencer-phones.png'), tIn: 5.44, tOut: 7.70, mode: 'content' },
  // CLIMAX, full-screen. "That is gonna be like a big, big pump." - the statuette pumping a colossal green
  // candle balloon into the sky. Hides the 17.8 segment join; OUT at 17.84 on "Golden Kitty could be".
  { src: staticFile('broll-gk5-climax-pump.png'), tIn: 15.90, tOut: 17.84, mode: 'full' },
  // "caused by these four-year cycle zombies buying back in" - cartoon zombies queueing at a golden ticket
  // booth, coins out. OUT at 25.14 so "and things start pumping ... 10x from here" plays on the chart.
  { src: staticFile('broll-gk5-zombies-queue.png'), tIn: 22.28, tOut: 25.14, mode: 'content' },
];

// ── TRANSPARENT OVERLAY (alpha PNG: generated on pure black, keyed border-connected -> transparent) ─────
// ONE real alpha overlay on a BASE beat. "The bulls start running" - a glowing gold bull charges in over
// the left of the transactions table (the chart's price action at y ~45..440 stays clear), bottom above
// the 854 seam. Clear of every badge window, the caption band and the b-roll windows.
export const OVERLAYS_GK5: OverlayEv[] = [
  { src: staticFile('ovl-gk5-bull.png'), tIn: 7.80, tOut: 9.50, top: 470, left: 50, width: 400, blend: 'normal' },
];

// ── BADGES (code-drawn) ─────────────────────────────────────────────────────────────────────────
// Never sharing a window with each other, the overlay or a same-zone b-roll image. `top` = badge centre y
// (~105 px above/below). top 620 (~515-725) sits over the transactions table under the price action; while
// a chat banner is up (y ~700-775: 1.8-7.6 and 17.8-end) the badge rides at top 470 (~365-575).
export const BADGES_GK5: BadgeEv[] = [
  { tIn: 3.05, tOut: 4.55, color: GK5_ACCENT, line1: '$GOLDEN', sub: 'SHOULD TOTALLY GO UP', top: 470 },
  { tIn: 10.40, tOut: 12.20, color: LIME, line1: '$4.6M', sub: 'MARKET CAP ON THE CHART', top: 620 },
  { tIn: 14.80, tOut: 15.85, color: GREEN, line1: '$50M', sub: 'THE TARGET', top: 620 },
  { tIn: 19.46, tOut: 20.60, color: GK5_ACCENT, line1: 'ORGANIC', sub: 'GROWTH', top: 470 },
  { tIn: 29.92, tOut: 31.03, color: GREEN, line1: '10x', sub: 'FROM HERE', top: 470 },
];

// ── SFX ─────────────────────────────────────────────────────────────────────────────────────────
// Palette (same measured files as clip 1; crest = 5 ms peak-envelope at 16 kHz):
//   transition_rapid_whoosh        0.967 s, crest 0.165 s
//   transition_rapid_whoosh-tight  0.420 s, crest 0.165 s
//   card-impact-layered            1.450 s, crest 0.030 s
//   DING-093                       0.930 s, crest 0.150 s
//   Kick_Impact_01-short           0.550 s, crest 0.185 s
//   DSGNImpt-single_impact_sound   2.000 s, crest 0.030 s
// Every `t` is (cue time - crest) so the crest lands ON the cut / badge frame.
export const SFX_GK5: Sfx[] = [
  // the frame-0 cover cutting to the base at frame 1. Low: it sits under "Golden".
  { t:  0.033, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.12, dur: 1.00 },
  // hook reveal hit on the 0.88 full-screen cut ("be"). WHISPER SWEEP (offline, encode-matched control, 5-6
  // staggered windows; confirmed on the first full render, which read "are" 2/3): crest at 0.54 (on "is") read
  // "Golden ARE gonna" at vol 0.14 AND 0.07 and with the tail trimmed to 0.12 s; only deleting it or MOVING it
  // cleared it. Crest at 0.88 = "is gonna be pretty damn good" 6/6 at the full 0.14 gain. Timing, not volume.
  { t:  0.85, src: staticFile('sfx/Impacts/card-impact-layered.wav'), vol: 0.14, dur: 1.50 },
  // ding on the $GOLDEN badge, crest on 3.05.
  { t:  2.90, src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 },
  // whoosh into the influencer-phones cutaway at 5.44 (tight variant). WHISPER SWEEP (offline, encode-matched
  // control, 3 staggered windows): crest at 5.28 (on "it") read "that has" 3/3 at vol 0.12, 0.06 AND 0.03;
  // moving the crest to 5.44 (the it/has boundary) = control 3/3 at the FULL 0.12 gain. Timing, not volume.
  { t:  5.275, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.42 },
  // the bull pop: crest on 7.80, tail truncated.
  { t:  7.615, src: staticFile('sfx/Impacts/Kick_Impact_01-short.wav'), vol: 0.14, dur: 0.25 },
  // ding on the $4.6M badge, crest on 10.40.
  { t: 10.25, src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 },
  // ding on the $50M badge, crest on 14.80.
  { t: 14.65, src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 },
  // THE payoff hit on the climax cut (15.90), "That is gonna be like a big, big pump."
  { t: 15.87, src: staticFile('sfx/Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3'), vol: 0.20, dur: 2.00 },
  // ding on the ORGANIC badge, crest on 19.46.
  { t: 19.31, src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 },
  // whoosh into the zombies cutaway at 22.28.
  { t: 22.115, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.42 },
  // ding on the closing 10x badge, crest on 29.92.
  { t: 29.77, src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 },
];

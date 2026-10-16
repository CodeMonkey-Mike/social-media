import { staticFile } from 'remotion';
import { type BrollEv, type Sfx } from './_kit';
import type { ThumbDef, BadgeEv, OverlayEv } from './LivestreamShort';

// ─────────────────────────────────────────────────────────────────────────────────────────────
// batch bull-trap / clip #4 - `october-bottom-talk-is-gone` (variant: FULL)
// clip-plan title: "What Happened to All the October Bottom Talk?"
//
// "What happened to all the talk about how the bottom is going to happen in October? What happened to all that
//  talk? It's almost like it's completely gone right now. CNBC is telling its millions of viewers that Bitcoin is
//  setting up for a massive bull market. They're openly telling you, October is here. New all-time highs soon. We
//  broke out of the bear market. We're above the 50-week moving average. We're staying above it. So it's official.
//  We're in a bull market."
//
// Spine: shorts/bull-trap/october-bottom-talk-is-gone/october-bottom-talk-is-gone-final.mp4, staged GOP-seek-friendly
// to render-assets/october-bottom-talk-is-gone.mp4 - VERIFIED on the staged file: has_b_frames 0, 1080x1920 @25 fps,
// video 22.360 s, audio 22.389 s.
// Plan of record: shorts/bull-trap/october-bottom-talk-is-gone/BROLL-PLAN.md
// Captions: captionsBullTrapOctoberBottomGone.ts (canonical captions skill; header = provenance).
// Build directives for clip 4 (clip_directives.py --batch bull-trap --clip 4): none. No coverage exemption.
// ─────────────────────────────────────────────────────────────────────────────────────────────

export const BT4_FPS = 30;
// Video 22.360 s, audio 22.389 s. 671 frames = 22.367 s: the LAST rendered frame (670) sits at 22.333 s, inside both
// tracks. Last word "market." ends 22.36 s: a hard out.
export const BT4_DURATION = 671;

// MEASURED on THIS spine (_qa/measure.py): row-mean gradient scan (rows 600-1300) on 8 frames
// (t = 1, 4, 7, 10, 13, 16, 19, 22 s) puts the largest step at the 853/854 boundary on 8 of 8.
export const BT4_SEAM = 854;
// Caption band centre: a 74 px caption with its 13 px stroke spans ~910..1010, 56 px clear of the seam.
export const BT4_CAP_Y = 960;
// Bitcoin orange: the only macro/BTC clip of the batch; never Kaspa teal.
export const BT4_ACCENT = '#f7931a';
const GOLD = '#ffc629';
const GREEN = '#39ff14';
const RED = '#ff3b3b';

export const CLIP_BT4 = staticFile('october-bottom-talk-is-gone.mp4');

// ── FRAME-0 COVER (ONE frame; `durS` omitted so LivestreamShort uses 1/fps) ───────────────────
// Art = a bewildered hard-hat bear at the bottom of the pit he dug, a Bitcoin coin rocketing up and out of it; top 45%
// left empty for the CODE title. No day-relative words on the cover.
export const THUMB_DEF_BT4: ThumbDef = {
  img: staticFile('thumb-bt4-cover.png'),
  title: 'OCTOBER\nBOTTOM?',
  chip: 'WHERE DID ALL THAT TALK GO?',
  chipColor: BT4_ACCENT,
  titleSize: 150,
};

// ── B-ROLL ──────────────────────────────────────────────────────────────────────────────────────
// Budget (video-creation/SKILL.md "B-roll coverage budget (HALVED 2026-07-14)"):
//   1.99 + 1.85 + 1.47 + 2.00 = 7.31 s of 22.36 s = 32.7 % b-roll / 67.3 % base
//   4 distinct images, each used EXACTLY ONCE, no loop, no reuse
//   2 full-screen moments: the hook and the climax (inside the FIRM cap of 3)
// Base content zone: The Bitcoin Historian's X post (CNBC "BITCOIN AT AN INFLECTION POINT?", "UPTOBER IS HERE, NEW
// ATHs SOON") 0-16.2 s = the receipt he reads aloud, then TradingView BTCUSD with the 50-week MA 16.2-22.36 s.
export const BROLL_BT4: BrollEv[] = [
  // HOOK, full-screen. "the bottom is going to happen in October?" - a smug bear fortune teller pointing down at a
  // crystal ball crashing to a bottom. Frames 1..2.16 are the face + tweet base (Phase 7 rule 5). OUT at 4.15 so the
  // doubled "What happened to all that talk?" lands on Mike.
  { src: staticFile('broll-bt4-hook-fortune-bear.png'), tIn: 2.16, tOut: 4.15, mode: 'full' },
  // "It's almost like it's completely gone right now." - the abandoned doom stage (dropped megaphone, empty chairs,
  // tumbleweed). CONTENT zone so his smirk stays on camera. OUT at 7.85 before "CNBC" so the receipt is visible.
  { src: staticFile('broll-bt4-gone-empty-stage.png'), tIn: 6.00, tOut: 7.85, mode: 'content' },
  // "We broke out of the bear market." - the bull smashing through a wall of red candles. Also hides the 16.2 s
  // tweet -> chart screen cut. OUT at 17.62 ("We're above") so the 50-week MA chart is the visual for that line.
  { src: staticFile('broll-bt4-breakout-bull.png'), tIn: 16.15, tOut: 17.62, mode: 'content' },
  // CLIMAX, full-screen. "We're staying above it. So it's official." - the bull ringing a giant bell on a tower,
  // Bitcoin medallion, golden shockwaves. OUT at 21.56 so "We're in a bull market." is Mike on camera (hard out).
  { src: staticFile('broll-bt4-climax-official-bell.png'), tIn: 19.56, tOut: 21.56, mode: 'full' },
];

// No alpha overlay on this clip (the receipt tweet is the visual on the long base beat).
export const OVERLAYS_BT4: OverlayEv[] = [];

// ── BADGES (code-drawn) ─────────────────────────────────────────────────────────────────────────
// Never sharing a window with each other or a b-roll image. `top` = badge centre y (~105 px above/below). top 620
// (~515-725) sits under the tweet's CNBC video (y ~290-530) / over the chart's RSI pane, above the 854 seam.
// line1 is ONE token (Badge shrink-wraps inside half the frame width).
export const BADGES_BT4: BadgeEv[] = [
  { tIn: 4.30, tOut: 5.85, color: RED, line1: 'BOTTOM?', sub: 'WHERE DID THE TALK GO', top: 620 },
  { tIn: 8.30, tOut: 10.20, color: BT4_ACCENT, line1: 'CNBC', sub: 'TO MILLIONS OF VIEWERS', top: 620 },
  { tIn: 14.10, tOut: 16.05, color: GOLD, line1: 'UPTOBER', sub: 'NEW ATHs SOON', top: 620 },
  { tIn: 17.75, tOut: 19.45, color: GREEN, line1: '50-WEEK', sub: 'MOVING AVERAGE: ABOVE IT', top: 620 },
  { tIn: 21.62, tOut: 22.40, color: BT4_ACCENT, line1: 'OFFICIAL', sub: "WE'RE IN A BULL MARKET", top: 620 },
];

// ── SFX ─────────────────────────────────────────────────────────────────────────────────────────
// Measured palette (same library files as clip 3; 5 ms peak-envelope at 16 kHz):
//   transition_rapid_whoosh        0.967 s, crest 0.165 s
//   transition_rapid_whoosh-tight  0.420 s, crest 0.165 s
//   card-impact-layered            1.450 s, crest 0.030 s
//   DING-093                       0.930 s, crest 0.150 s
//   DSGNImpt-single_impact_sound   2.000 s, crest 0.030 s
// Every `t` is (cue time - crest) so the crest lands ON the cut / badge frame.
export const SFX_BT4: Sfx[] = [
  // the frame-0 cover cutting to the base at frame 1. Low: it sits under "What happened".
  { t:  0.033, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.12, dur: 1.00 },
  // hook reveal hit on the 2.16 full-screen cut ("the bottom").
  { t:  2.13, src: staticFile('sfx/Impacts/card-impact-layered.wav'), vol: 0.14, dur: 1.50 },
  // ding on the BOTTOM? badge, crest on 4.30.
  { t:  4.15, src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 },
  // whoosh into the empty-stage cutaway at 6.00.
  { t:  5.835, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.42 },
  // ding on the CNBC badge, crest on 8.30.
  { t:  8.15, src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 },
  // ding on the UPTOBER badge, crest on 14.10.
  { t: 13.95, src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 },
  // whoosh into the breakout cutaway at 16.15.
  { t: 15.985, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.42 },
  // ding on the 50-WEEK badge, crest on 17.75.
  { t: 17.60, src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 },
  // THE payoff hit on the climax cut (19.56), under "We're staying above it".
  { t: 19.53, src: staticFile('sfx/Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3'), vol: 0.20, dur: 2.00 },
];

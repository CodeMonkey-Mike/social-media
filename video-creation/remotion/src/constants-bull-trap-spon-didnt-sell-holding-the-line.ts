import { staticFile } from 'remotion';
import { type BrollEv, type Sfx } from './_kit';
import type { ThumbDef, BadgeEv, OverlayEv } from './LivestreamShort';

// ─────────────────────────────────────────────────────────────────────────────────────────────
// batch bull-trap / clip #3 - `spon-didnt-sell-holding-the-line` (variant: FULL)
// clip-plan title: "I Didn't Sell SPON. I'm Still Holding the Line."
//
// "SPON is another interesting one. Now I have put some really deep research into this and I'm still
//  holding. So my members are holding. I'm in, and like, if it goes down, I'm going down with a ship. I
//  didn't sell. For any of you who are not in my Discord and have bought into this because I've been talking
//  about it publicly, just so you know, I'm still bullish on it and I'm still holding the line. They have a
//  project behind the scenes. It's not just like a random meme that does nothing. Put a lot of, you know,
//  investigative effort into it and it has something good going on for it. It's like its own unique tech. So
//  when you have the first type of anything, you usually take off."
//
// Third SPON short in a week (spon clip 1 SponMembersHateIt, uptober clip 1 UptoberSpawnDoubled). None of
// their concepts/files reused (spon1: boxing ring, pitchfork mob, dividends, runner, furnace, sock mirror,
// scale gap, jetpack, summit, glove; upt1: podium, rock star, Discord beach chair, copy machine, grave, moon
// rocket, avocado).
//
// Spine: shorts/bull-trap/spon-didnt-sell-holding-the-line/spon-didnt-sell-holding-the-line-final.mp4, staged
// GOP-seek-friendly to render-assets/spon-didnt-sell-holding-the-line.mp4 - VERIFIED on the staged file:
// has_b_frames 0, 1080x1920 @25 fps, video 37.200 s, audio 37.234 s.
// Plan of record: shorts/bull-trap/spon-didnt-sell-holding-the-line/BROLL-PLAN.md
// Captions: captionsBullTrapSponDidntSell.ts (canonical captions skill; header = provenance).
// Build directives for clip 3 (clip_directives.py --batch bull-trap --clip 3): none. No coverage exemption.
// ─────────────────────────────────────────────────────────────────────────────────────────────

export const BT3_FPS = 30;
// Video 37.200 s, audio 37.234 s. 1116 frames: the LAST rendered frame (1115) sits at 37.167 s, inside both
// tracks. Last word "off" ends 37.20 s: a hard out.
export const BT3_DURATION = 1116;

// MEASURED on THIS spine (_qa/measure.py): row-mean gradient scan (rows 600-1300) on 8 frames
// (t = 1, 5, 10, 15, 20, 25, 30, 36 s) puts the largest step at the 853/854 boundary on 8 of 8.
export const BT3_SEAM = 854;
// Caption band centre: a 74 px caption with its 13 px stroke spans ~910..1010, 56 px clear of the seam.
export const BT3_CAP_Y = 960;
// Robinhood-chain LIME (SPON trades on Robinhood > Uniswap; also the sponge's own colour); never Kaspa teal.
export const BT3_ACCENT = '#ccff00';
const GOLD = '#ffc629';
const GREEN = '#39ff14';

export const CLIP_BT3 = staticFile('spon-didnt-sell-holding-the-line.mp4');

// ── FRAME-0 COVER (ONE frame; `durS` omitted so LivestreamShort uses 1/fps) ───────────────────
// Art = the SPON sponge (generated WITH spon.png attached) standing firm in a red-candle storm, hugging a
// blank gold coin; top 45% left empty for the CODE title. No day-relative words on the cover.
export const THUMB_DEF_BT3: ThumbDef = {
  img: staticFile('thumb-bt3-cover.png'),
  title: "I DIDN'T\nSELL",
  chip: '$SPON: STILL HOLDING THE LINE',
  chipColor: BT3_ACCENT,
  titleSize: 150,
};

// ── B-ROLL ──────────────────────────────────────────────────────────────────────────────────────
// Budget (video-creation/SKILL.md "B-roll coverage budget (HALVED 2026-07-14)"):
//   2.40 + 2.54 + 2.02 + 1.92 + 2.10 = 10.98 s of 37.20 s = 29.5 % b-roll / 70.5 % base
//   5 distinct images, each used EXACTLY ONCE, no loop, no reuse
//   2 full-screen moments: the hook and the climax (inside the FIRM cap of 3)
// Base content zone: DexScreener SPON/ETH market-cap chart (the drawdown, ~46K) 0-21.9 s, then THE ENGINE
// docs page ("the project behind the scenes", Pons coin creator fees -> buybacks/burns/rewards) 21.9-27.1 s,
// then the SPON chart again to the end. Burned-in viewer chat name banners (y ~700-780, x 0-190) ship as filmed.
export const BROLL_BT3: BrollEv[] = [
  // HOOK, full-screen. "really deep research into this" - the sponge in a brass diving helmet studying
  // blueprints on the sea floor. Frames 1..2.30 are the face + chart base (Phase 7 rule 5) on "SPON is another
  // interesting one. Now". OUT at 4.70 so "this and I'm still holding" lands on Mike + the chart.
  { src: staticFile('broll-bt3-hook-deep-research.png'), tIn: 2.30, tOut: 4.70, mode: 'full' },
  // "if it goes down, I'm going down with a ship. I didn't sell." - the sponge captain saluting at the wheel
  // of a tilting ship. CONTENT zone so his sincere delivery stays on camera. OUT at 11.14 on "sell".
  { src: staticFile('broll-bt3-captain-ship.png'), tIn: 8.60, tOut: 11.14, mode: 'content' },
  // "and I'm still holding the line" - the armored sponge planting a shield on a glowing lime line against a
  // red bear/candle wave. Also hides the 21.9 chart -> Engine page cut. OUT at 22.40 ("a project").
  { src: staticFile('broll-bt3-hold-the-line.png'), tIn: 20.38, tOut: 22.40, mode: 'content' },
  // "It's not just like a random meme that does nothing" - lazy grey coin on a couch vs the sponge building in
  // a gear workshop behind the curtain. Hides the 27.1 Engine -> chart cut. OUT at 27.44 ("of you know").
  { src: staticFile('broll-bt3-not-random-meme.png'), tIn: 25.52, tOut: 27.44, mode: 'content' },
  // CLIMAX, full-screen. "So when you have the first type of anything" - the sponge pilot lifting off FIRST
  // in a lime biplane while the grey planes sit parked. OUT at 36.18 so "you usually take off" is on Mike.
  { src: staticFile('broll-bt3-climax-first-flight.png'), tIn: 34.08, tOut: 36.18, mode: 'full' },
];

// ── TRANSPARENT OVERLAY (alpha PNG: generated on pure black, keyed border-connected near-black ->
// transparent by _qa/make_alpha2.py) ─────────────────────────────────────────────────────────────
// ONE real alpha overlay on a BASE beat. "still holding. So my members are holding" - a glowing fist gripping
// a blank gold coin pops in over the RIGHT of the transactions table (the chart's price action at y 0..460
// and the burned-in chat banner at x 0-190 / y ~700-780 stay clear). Keyed crop 875x1210: width 250 -> ~346 px
// tall; top 470 -> bottom ~816 (+10 px float) stays above the 854 seam; x 580-830.
export const OVERLAYS_BT3: OverlayEv[] = [
  { src: staticFile('ovl-bt3-grip.png'), tIn: 5.84, tOut: 8.14, top: 470, left: 580, width: 250, blend: 'normal' },
];

// ── BADGES (code-drawn) ─────────────────────────────────────────────────────────────────────────
// Never sharing a window with each other, the overlay or a same-zone b-roll image. `top` = badge centre y
// (~105 px above/below). top 620 (~515-725) sits over the transactions table / docs body, under the chart's
// price action. line1 is ONE token (Badge shrink-wraps inside half the frame width).
export const BADGES_BT3: BadgeEv[] = [
  { tIn: 0.30, tOut: 1.95, color: BT3_ACCENT, line1: '$SPON', sub: 'ROBINHOOD CHAIN', top: 620 },
  { tIn: 12.85, tOut: 14.60, color: GOLD, line1: 'DISCORD', sub: 'NOT IN IT? THIS IS FOR YOU', top: 620 },
  { tIn: 18.55, tOut: 20.25, color: GREEN, line1: 'BULLISH', sub: "I DIDN'T SELL", top: 620 },
  { tIn: 28.20, tOut: 29.85, color: GOLD, line1: 'RESEARCHED', sub: 'INVESTIGATIVE EFFORT', top: 620 },
  { tIn: 32.45, tOut: 33.95, color: BT3_ACCENT, line1: 'UNIQUE', sub: 'ITS OWN TECH', top: 620 },
  { tIn: 36.25, tOut: 37.45, color: GREEN, line1: 'FIRST', sub: 'FIRST MOVERS TAKE OFF', top: 620 },
];

// ── SFX ─────────────────────────────────────────────────────────────────────────────────────────
// Measured palette (5 ms peak-envelope at 16 kHz, whole files; same files as uptober clip 1):
//   transition_rapid_whoosh        0.967 s, crest 0.165 s
//   transition_rapid_whoosh-tight  0.420 s, crest 0.165 s
//   card-impact-layered            1.450 s, crest 0.030 s
//   DING-093                       0.930 s, crest 0.150 s
//   Kick_Impact_01-short           0.550 s, crest 0.185 s
//   DSGNImpt-single_impact_sound   2.000 s, crest 0.030 s
// Every `t` is (cue time - crest) so the crest lands ON the cut / badge frame.
export const SFX_BT3: Sfx[] = [
  // the frame-0 cover cutting to the base at frame 1. Low: it sits under "SPON is".
  { t:  0.033, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.12, dur: 1.00 },
  // hook reveal hit on the 2.30 full-screen cut ("I have put").
  { t:  2.27, src: staticFile('sfx/Impacts/card-impact-layered.wav'), vol: 0.14, dur: 1.50 },
  // the fist pop: crest on 5.84, tail truncated.
  { t:  5.655, src: staticFile('sfx/Impacts/Kick_Impact_01-short.wav'), vol: 0.14, dur: 0.30 },
  // whoosh into the captain cutaway at 8.60.
  { t:  8.435, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.42 },
  // ding on the DISCORD badge, crest on 12.85.
  { t: 12.70, src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 },
  // ding on the BULLISH badge, crest on 18.55.
  { t: 18.40, src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 },
  // whoosh into the hold-the-line cutaway at 20.38.
  { t: 20.215, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.42 },
  // whoosh into the not-a-random-meme cutaway at 25.52.
  { t: 25.355, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.42 },
  // ding on the RESEARCHED badge, crest on 28.20.
  { t: 28.05, src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 },
  // ding on the UNIQUE badge, crest on 32.45.
  { t: 32.30, src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 },
  // THE payoff hit on the climax cut (34.08), under "So when you have".
  { t: 34.05, src: staticFile('sfx/Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3'), vol: 0.20, dur: 2.05 },
];

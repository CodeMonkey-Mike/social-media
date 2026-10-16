import { staticFile } from 'remotion';
import { type BrollEv, type Sfx } from './_kit';
import type { ThumbDef, BadgeEv, OverlayEv, RedactEv } from './LivestreamShort';

// ─────────────────────────────────────────────────────────────────────────────────────────────
// batch bull-trap / clip #2 - `golden-kitty-10-million-while-everything-bleeds` (variant: FULL)
// clip-plan title: "Golden Kitty Could Easily Make 10 Million While Everything Else Bleeds"
//
// "Everything else is like bleeding, man. Everything is like dying, right? Except Golden Kitty. Look at
//  this candle right there, one 4-hour candle right here, straight up. Probably going to a nice recovery.
//  Considering how everything else is, this is pretty damn good. It's excellent. Golden Kitty is an awesome
//  project, it is paired to gold. And now I'm in it, I'm on board. I really, really want to see some October
//  pumps. If things just start pumping now, and next week and the week after, Golden Kitty could easily make
//  like 10 million in the next couple weeks. Easily. I think so. Easily. Just hope for those pumps, man.
//  Things have been crap for so long. ... But I want to see everything pump, god damn it. I want to see
//  things going crazy."
//
// Earlier Golden Kitty shorts (beer-and-kaspa bk2, spon gk2, uptober gk5) used: golden train + zombies,
// statue + hype crowd, listing boards, vault, oracle, summit, colossus, candle rocket, dispersed map, rug
// yank, cliff, meteors, crown, treasure hoard, phone wall, air pump, zombie ticket booth, gold bull, candle
// elevator. None of those concepts or files are reused here.
//
// Spine: shorts/bull-trap/golden-kitty-.../golden-kitty-...-final.mp4, staged GOP-seek-friendly to
// render-assets/golden-kitty-10-million-while-everything-bleeds.mp4 - VERIFIED on the staged file:
// has_b_frames 0, 1080x1920 @25 fps, video 48.560 s, audio 48.573 s.
// Plan of record: shorts/bull-trap/golden-kitty-10-million-while-everything-bleeds/BROLL-PLAN.md
// Captions: captionsBullTrapGoldenKitty10M.ts (canonical captions skill; header = provenance).
//
// BUILD DIRECTIVE for clip 2 (clip_directives.py --batch bull-trap --clip 2): `cover-influencer-profile`
// [Mike, 2026-10-03] - the content zone shows another influencer's X profile from the 23.12 s screen switch
// (frame-diff measured) to the END; it must be FULLY covered by opaque Golden Kitty b-roll/graphics, never
// a transparent overlay. coverage_required (NOT exempt); overrides the ~30% budget for this clip only.
// Implemented TWICE over: (1) an unbroken run of opaque b-roll / code cards 22.82 -> end, and (2) a
// REDACTION plate 22.82 -> end under the b-roll (0..seam), so even a b-roll fade frame can only ever
// reveal the opaque plate, never the profile page.
// ─────────────────────────────────────────────────────────────────────────────────────────────

export const BT2_FPS = 30;
// Video 48.560 s, audio 48.573 s. 1456 frames: the LAST rendered frame (1455) sits at 48.500 s, inside
// both tracks. Last word "crazy" ends 48.28 s: a hard out.
export const BT2_DURATION = 1456;

// MEASURED on THIS spine (_qa/measure.py): row-mean gradient scan (rows 600-1300) on 11 frames
// (t = 1 .. 47.5 s) puts the largest step at the 853/854 boundary on 11 of 11.
export const BT2_SEAM = 854;
// Caption band centre: a 74 px caption with its 13 px stroke spans ~910..1010, 56 px clear of the seam.
export const BT2_CAP_Y = 960;
// GOLD: the Golden Kitty statuette's own colour. Never Kaspa teal.
export const BT2_ACCENT = '#ffc629';
const LIME = '#ccff00';
const GREEN = '#39ff14';

export const CLIP_BT2 = staticFile('golden-kitty-10-million-while-everything-bleeds.mp4');

// Profile-page cover window (directive). Switch measured at 23.12 s; cover starts 0.30 s early on "board".
export const BT2_COVER_IN = 22.82;
const END = 48.6;

// ── FRAME-0 COVER (ONE frame; `durS` omitted so LivestreamShort uses 1/fps) ───────────────────
// Art = the Golden Kitty statuette (generated WITH golden-kitty.png attached) on the one green candle tower
// standing while a city of red candles melts; top 45% left empty for the CODE title.
export const THUMB_DEF_BT2: ThumbDef = {
  img: staticFile('thumb-bt2-cover.png'),
  title: 'EVERYTHING\nBLEEDS.\nEXCEPT THIS.',
  chip: '$GOLDEN TO $10M?',
  chipColor: BT2_ACCENT,
  titleSize: 118,
};

// ── REDACTION PLATE (directive safety net, painted UNDER the b-roll) ─────────────────────────────
export const REDACT_BT2: RedactEv[] = [
  { tIn: BT2_COVER_IN, tOut: END, top: 0, height: BT2_SEAM, accent: BT2_ACCENT },
];

// ── B-ROLL ──────────────────────────────────────────────────────────────────────────────────────
// 0 - 22.82 (the part of the clip with shareable screen-share: an X post of the BTC dump, then the
// DexScreener GOLDEN chart Mike points at) follows the HALVED budget:
//   2.14 + 1.94 + 1.94 = 6.02 s of 22.82 s = 26.4 % b-roll / 73.6 % base.
// 22.82 - end is 100 % covered by directive (b-roll images + the plate-and-badge $10M / EASILY card).
// Whole clip: ~31.8 s of 48.53 s = ~65.5 % covered. 11 distinct images, each used EXACTLY ONCE.
// Full-screens: 3 (hook, climax, close) = the FIRM cap.
export const BROLL_BT2: BrollEv[] = [
  // HOOK, full-screen. "except Golden Kitty" - the statuette spotless in a sunbeam while the red candles
  // melt around it. IN on the right/except boundary (4.36); OUT at 6.50 so "look at this candle" is the chart.
  { src: staticFile('broll-bt2-hook-sunbeam.png'), tIn: 4.36, tOut: 6.50, mode: 'full' },
  // "considering how everything else is" - a graveyard of red-candle tombstones, the statuette glowing in it.
  { src: staticFile('broll-bt2-graveyard.png'), tIn: 13.26, tOut: 15.20, mode: 'content' },
  // "an awesome project, it is paired to gold" - statuette and gold bars level on a balance scale.
  { src: staticFile('broll-bt2-paired-gold.png'), tIn: 18.68, tOut: 20.62, mode: 'content' },
  // ── DIRECTIVE COVER RUN (22.82 -> end): adjacent windows hard-cut, no base frame between them ──
  // "board. I really, really want to see some October pumps" - autumn leaves turning into green candles.
  { src: staticFile('broll-bt2-october-leaves.png'), tIn: 22.82, tOut: 25.38, mode: 'content' },
  // "if things just start pumping, you know, now" - statuette slams the big green start button.
  { src: staticFile('broll-bt2-start-button.png'), tIn: 25.38, tOut: 28.34, mode: 'content' },
  // "and next week and then a week after" - a three-step staircase of ever-taller green candles.
  { src: staticFile('broll-bt2-week-stairs.png'), tIn: 28.34, tOut: 30.85, mode: 'content' },
  // CLIMAX, full-screen. "and Golden Kitty could easily make like 10 million" - surfing a tidal wave of gold.
  { src: staticFile('broll-bt2-climax-surf.png'), tIn: 30.85, tOut: 33.50, mode: 'full' },
  // 33.50 - 37.00: NO image - the plate + the $10M / EASILY code badges are the opaque content-zone card.
  // "just hope for those pumps, man ... things have been crap for so" - statuette waiting out the rain.
  { src: staticFile('broll-bt2-rain-window.png'), tIn: 37.00, tOut: 40.60, mode: 'content' },
  // "long. I mean, we had some gains here and there, especially my Discord" - a desk of green monitors.
  { src: staticFile('broll-bt2-gains-lounge.png'), tIn: 40.60, tOut: 44.00, mode: 'content' },
  // "but I want to see like everything pump, like" - a sky of blank coin balloons rising behind the cat.
  { src: staticFile('broll-bt2-everything-pump.png'), tIn: 44.00, tOut: 46.06, mode: 'content' },
  // CLOSE, full-screen. "god damn it, I want to see things going crazy." - the statuette DJ-ing a laser rave.
  { src: staticFile('broll-bt2-close-crazy.png'), tIn: 46.06, tOut: END, mode: 'full' },
];

// ── TRANSPARENT OVERLAY (alpha PNG: generated on pure black, keyed border-connected -> transparent) ─────
// ONE real alpha overlay on a BASE beat: "pretty damn good. It's excellent." - a gold first-place medal pops
// in on the right of the chart. Clear of every badge window, the caption band and the b-roll windows.
export const OVERLAYS_BT2: OverlayEv[] = [
  { src: staticFile('ovl-bt2-medal.png'), tIn: 15.32, tOut: 17.00, top: 380, left: 640, width: 360, blend: 'normal' },
];

// ── BADGES (code-drawn) ─────────────────────────────────────────────────────────────────────────
// Never sharing a window with each other, the overlay or a same-zone b-roll image. `top` = badge centre y.
export const BADGES_BT2: BadgeEv[] = [
  { tIn: 9.00, tOut: 10.80, color: GREEN, line1: '1 CANDLE', sub: 'STRAIGHT UP', top: 620 },
  { tIn: 21.04, tOut: 22.72, color: BT2_ACCENT, line1: "I'M IN", sub: 'ON BOARD', top: 470 },
  // the opaque directive card (plate underneath), centred in the 0..854 content zone
  { tIn: 33.55, tOut: 35.35, color: LIME, line1: '$10M', sub: 'NEXT COUPLE WEEKS', top: 427 },
  { tIn: 35.46, tOut: 36.95, color: BT2_ACCENT, line1: 'EASILY', sub: 'I THINK SO', top: 427 },
];

// ── SFX ─────────────────────────────────────────────────────────────────────────────────────────
// Palette (crest = 5 ms peak-envelope at 16 kHz, measured on the library files):
//   transition_rapid_whoosh        0.967 s, crest 0.165 s
//   transition_rapid_whoosh-tight  0.420 s, crest 0.165 s
//   card-impact-layered            1.450 s, crest 0.030 s
//   DING-093                       0.930 s, crest 0.150 s
//   Kick_Impact_01-short           0.550 s, crest 0.185 s
//   DSGNImpt-single_impact_sound   2.000 s, crest 0.030 s
//   Boom - Big Reveal-short        1.050 s, crest 0.030 s
// Every `t` is (cue time - crest) so the crest lands ON the cut / badge frame.
export const SFX_BT2: Sfx[] = [
  // the frame-0 cover cutting to the base at frame 1. Low: it sits under "everything".
  { t:  0.033, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.12, dur: 1.00 },
  // hook reveal hit on the 4.36 full-screen cut ("except").
  { t:  4.33, src: staticFile('sfx/Impacts/card-impact-layered.wav'), vol: 0.14, dur: 1.45 },
  // ding on the 1 CANDLE badge, crest on 9.00.
  { t:  8.85, src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 },
  // whoosh into the graveyard cutaway at 13.26.
  { t: 13.095, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.42 },
  // the medal pop, crest on 15.32, tail truncated.
  { t: 15.135, src: staticFile('sfx/Impacts/Kick_Impact_01-short.wav'), vol: 0.14, dur: 0.25 },
  // whoosh into the paired-gold cutaway at 18.68.
  { t: 18.515, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.42 },
  // ding on the I'M IN badge, crest on 21.04.
  { t: 20.89, src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 },
  // whoosh into the cover run at 22.82.
  { t: 22.655, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.42 },
  // whoosh on the start-button cut at 25.38.
  { t: 25.215, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.10, dur: 0.42 },
  // THE payoff hit on the climax cut (30.85), "and Golden Kitty could easily make like 10 million".
  { t: 30.82, src: staticFile('sfx/Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3'), vol: 0.20, dur: 2.00 },
  // ding on the $10M card, crest on 33.55.
  { t: 33.40, src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 },
  // ding on the EASILY card, crest on 35.46.
  { t: 35.31, src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 },
  // whoosh into the gains-lounge cut at 40.60.
  { t: 40.435, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.10, dur: 0.42 },
  // the closing boom on the 46.06 full-screen cut ("god damn it").
  { t: 46.03, src: staticFile('sfx/Boom - Big Reveal-short.wav'), vol: 0.16, dur: 1.05 },
];

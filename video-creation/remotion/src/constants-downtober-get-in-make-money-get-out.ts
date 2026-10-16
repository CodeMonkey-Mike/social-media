import { staticFile } from 'remotion';
import { type BrollEv, type Sfx } from './_kit';
import type { ThumbDef, BadgeEv, OverlayEv } from './LivestreamShort';

// ─────────────────────────────────────────────────────────────────────────────────────────────
// batch downtober / clip #4 - `get-in-make-money-get-out` (variant: FULL)
// clip-plan title: "Got In, Made Money, Got Out. That Is Not a Scam"
//
// Spine: shorts/downtober/get-in-make-money-get-out/get-in-make-money-get-out-final.mp4, staged GOP-seek-friendly to
// render-assets/get-in-make-money-get-out.mp4 - VERIFIED: has_b_frames 0, 1080x1920 @25 fps, video 27.360 s, audio 27.367 s.
// Plan of record: shorts/downtober/get-in-make-money-get-out/BROLL-PLAN.md
// Captions: captionsDowntoberGetInGetOut.ts (canonical captions skill, off whisper-words-verified.json).
// Build directives for clip 4 (clip_directives.py --batch downtober --clip 4): none. No coverage exemption.
// Reference gate: Golden Kitty -> schedule-tweets/images/reference/golden-kitty.png (attached to the cover + B3).
// Hellhound (CG's token, lesser-known, NO reference) is never drawn: it lives in the caption only.
// ─────────────────────────────────────────────────────────────────────────────────────────────

export const DT4_FPS = 30;
// 820 frames = 27.333 s; last rendered frame (819) at 27.300 s sits inside both tracks. Last word ends 27.18 s.
export const DT4_DURATION = 820;

// MEASURED on THIS spine: row-mean gradient scan (rows 600-1300), 5 frames 2..26 s: largest step 853/854 (5 of 5).
export const DT4_SEAM = 854;
export const DT4_CAP_Y = 960;
// GOLD divider under content-zone images: the Golden Kitty statuette's own colour; never Kaspa teal on a Robinhood-chain clip.
export const DT4_ACCENT = '#ffc629';
const GOLD = '#ffc629';
const GREEN = '#39ff14';
const RED = '#ff5252';
const YELLOW = '#ffe600';

export const CLIP_DT4 = staticFile('get-in-make-money-get-out.mp4');

// FRAME-0 COVER (ONE frame; durS omitted -> 1/fps). Art = PHOTOREAL Golden Kitty statuette on an oversized sack of plain gold
// coins (generated WITH golden-kitty.png attached), top 45% empty for the CODE title.
export const THUMB_DEF_DT4: ThumbDef = {
  img: staticFile('thumb-dt4-cover.png'),
  title: 'GOT IN.\nGOT OUT.',
  chip: 'THAT IS NOT A SCAM',
  chipColor: GOLD,
  titleSize: 132,
};

// B-ROLL. Budget: 1.80 + 1.66 + 2.15 + 1.84 + 1.42 = 8.87 s of 27.333 s = 32.5 % b-roll / 67.5 % base.
// 5 distinct images, each used once. 2 full-screens (hook + climax), inside the firm cap of 3. No two beats are adjacent.
// Base = the DexScreener SPON/ETH market-cap chart (a spike that bleeds down to 7.85K: the "then it dumps" receipt).
export const BROLL_DT4: BrollEv[] = [
  // HOOK full: "like you got to get in and make money and get out" (frames 1..19 = Mike + chart on "The point is").
  { src: staticFile('broll-dt4-hook-coaster.png'), tIn: 0.64, tOut: 2.44, mode: 'full' },
  // "Some of them will pump to three billion." IN at 4.94 = the gap between "million." (ends 4.88) and "Some" (5.00).
  { src: staticFile('broll-dt4-three-billion.png'), tIn: 4.94, tOut: 6.60, mode: 'content' },
  // "like golden kitty, you can't say it's a scam." (Golden Kitty statuette, reference attached)
  { src: staticFile('broll-dt4-golden-kitty-calm.png'), tIn: 8.55, tOut: 10.70, mode: 'content' },
  // "You'll do a 10x and you'll be happy." IN at 18.26 = the gap between "weeks." (ends 18.22) and "You'll" (18.30).
  { src: staticFile('broll-dt4-happy-10x.png'), tIn: 18.26, tOut: 20.10, mode: 'content' },
  // CLIMAX full: "man, it's a scam." OUT at 26.62 so the second, mocking "It's a scam." is a hard out on Mike.
  { src: staticFile('broll-dt4-climax-scam.png'), tIn: 25.20, tOut: 26.62, mode: 'full' },
];

// Real alpha PNGs (glow-on-black -> alpha-from-luminance), ON the base chart, clear of every badge / b-roll window.
export const OVERLAYS_DT4: OverlayEv[] = [
  // "You get out and make money": a glowing gold money sack over the chart's right half.
  { src: staticFile('ovl-dt4-moneybag.png'), tIn: 20.16, tOut: 21.85, top: 70, left: 520, width: 400, blend: 'normal' },
  // "And then it dumps and everybody else says,": a red arrow riding the chart's real bleed (x ~480-700, y ~200-290).
  { src: staticFile('ovl-dt4-red-arrow.png'), tIn: 23.55, tOut: 25.10, top: 50, left: 330, width: 400, blend: 'normal' },
];

// BADGES (code-drawn), never sharing a window with each other, an overlay or a b-roll image. `top` = badge centre y.
// While the burned-in chat banner is up (y ~700-775, 0..12.95 s) badges ride at top 470 (~365-575); after it, top 620.
export const BADGES_DT4: BadgeEv[] = [
  { tIn: 3.94, tOut: 4.84, color: YELLOW, line1: 'SOME PUMP', line2: 'TO $3M', top: 470 },
  { tIn: 7.10, tOut: 8.45, color: RED, line1: 'DUMPS', line2: 'AT $6M', top: 470 },
  { tIn: 11.00, tOut: 12.85, color: GREEN, line1: 'NOT A SCAM', sub: 'GOT IN. MADE MONEY. GOT OUT.', top: 470 },
  { tIn: 14.40, tOut: 15.85, color: GOLD, line1: 'IN AT $1M', sub: 'MARKET CAP', top: 620 },
  { tIn: 16.65, tOut: 18.15, color: GREEN, line1: '10x', sub: 'IN A COUPLE OF WEEKS', top: 620 },
];

// SFX. Measured crests (5 ms peak envelope @16 kHz): whoosh 0.165 s, whoosh-tight 0.165 s, card-impact-layered 0.030 s,
// DING-093 0.150 s, Cash Register-ching 0.095 s (library variant = Cash Register.mp3 0.53-1.30 s, the 'ching' only),
// DSGNImpt 0.030 s. Every `t` = cue - crest.
// OFFLINE WHISPER SWEEP before the render (row 7a: each candidate mixed alone onto the bare spine, 48 kHz AAC vs an
// encode-matched control, 5 staggered medium.en windows; _qa/sfx/sweep.py + res-sweep.json). Four cues changed:
export const SFX_DT4: Sfx[] = [
  { t:  0.033, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.08, dur: 0.12 },        // cover cut (truncated before its crest, clip 1 recipe)
  { t:  0.61,  src: staticFile('sfx/Impacts/card-impact-layered.wav'), vol: 0.14, dur: 0.80 },   // hook full-screen
  { t:  3.79,  src: staticFile('sfx/DING-093.wav'), vol: 0.12, dur: 0.45 },                      // $3M badge
  { t:  4.775, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.42 }, // into the three-billion rocket
  // (8.385 whoosh into Golden Kitty DELETED: 'Golden Kitty' read Katie/Kitten/'old and kitty' 3/5 at 0.12, 3/5 at 0.06, and
  //  still 1/5 off at 0.04 or moved to 8.30; decoration on a content cut, so deleted per row 7. The name matters more.)
  { t: 10.85,  src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 },                      // NOT A SCAM badge (crest in the know,/people gap)
  // 10x badge. dur 0.45 read 'pumps' -> 'bumps' 2/5; tail TRUNCATED to 0.25 = 'pumps' 5/5 at the same gain (the 2 residual
  // window diffs sit on 'Hellhound' at 15.4, >1.1 s before the ding starts = zero SFX energy there: decoder variance).
  { t: 16.50,  src: staticFile('sfx/DING-093.wav'), vol: 0.12, dur: 0.25 },
  // into the happy 10x trader. Crest on 18.26 read "you'll do" -> "we'll do" 3/5; crest MOVED to 18.20 (in 'weeks.') + tail
  // cut to 0.28 = control 5/5 at the full 0.12 gain. Timing, not volume.
  { t: 18.035, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.28 },
  // money sack (crest in the happy./You gap). 0.12 added a phantom 'And you get out' 2/5 (truncation did not help); 0.06 = 5/5.
  { t: 20.065, src: staticFile('sfx/Cash Register-ching.wav'), vol: 0.06, dur: 0.70 },
  { t: 23.385, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.10, dur: 0.42 }, // red arrow onto the dump
  { t: 25.17,  src: staticFile('sfx/Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3'), vol: 0.20, dur: 1.20 }, // climax
];

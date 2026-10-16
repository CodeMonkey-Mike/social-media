import { staticFile } from 'remotion';
import { type BrollEv, type Sfx } from './_kit';
import type { ThumbDef, BadgeEv, OverlayEv } from './LivestreamShort';

// ─────────────────────────────────────────────────────────────────────────────────────────────
// batch aliens / clip #4 - `pippin-89x-held-a-year` (variant: FULL)
// clip-plan title: "I Held Pippin a Full Year and It Paid an 89x"
//
// Spine: shorts/aliens/pippin-89x-held-a-year/pippin-89x-held-a-year-final.mp4, staged GOP-seek-friendly to
// render-assets/pippin-89x-held-a-year.mp4 - VERIFIED: has_b_frames 0, 1080x1920 @25 fps, video 32.560 s,
// audio 32.549 s.
// Plan of record: shorts/aliens/pippin-89x-held-a-year/BROLL-PLAN.md
// Captions: captionsAliensPippin89xHeldAYear.ts (canonical captions skill).
// Build directives for clip 4 (clip_directives.py --batch aliens --clip 4): none. No coverage exemption.
// Reference gate: no Pippin reference on disk (lesser-known, bucket 3) -> Pippin appears ONLY as code-drawn type.
// ─────────────────────────────────────────────────────────────────────────────────────────────

export const AL4_FPS = 30;
// 976 frames = 32.533 s; last rendered frame (975) at 32.50 s sits inside both tracks. Last word ends 32.42 s.
export const AL4_DURATION = 976;

// MEASURED on THIS spine: row-mean gradient scan (rows 600-1300), 5 frames 2..30 s: largest step 853/854 (5 of 5).
export const AL4_SEAM = 854;
export const AL4_CAP_Y = 960;
export const AL4_ACCENT = '#39ff14';
const GOLD = '#ffc629';
const TEAL = '#00e5ff';

export const CLIP_AL4 = staticFile('pippin-89x-held-a-year.mp4');

// FRAME-0 COVER (ONE frame). Art = photoreal green candlestick rocket, top 45% empty for the CODE title.
export const THUMB_DEF_AL4: ThumbDef = {
  img: staticFile('thumb-al4-cover.png'),
  title: '89X\nHELD A YEAR',
  chip: 'PIPPIN',
  chipColor: AL4_ACCENT,
  titleSize: 140,
};

// B-ROLL. Budget: 1.70 + 1.80 + 1.80 + 1.70 + 1.80 + 1.40 = 10.20 s of 32.53 s = 31.4 % b-roll / 68.6 % base.
// 6 distinct images, each used once. 2 full-screens (hook + climax), inside the firm cap of 3.
// Base = the Top Performing Assets table with the PIPPIN 89x row highlighted (the receipt), visible in long stretches.
export const BROLL_AL4: BrollEv[] = [
  // HOOK full: "really, really early in the early 2025." Opens on Mike + the PIPPIN 89x row first.
  { src: staticFile('broll-al4-hook-early-find.png'), tIn: 1.70, tOut: 3.40, mode: 'full' },
  // "I was sick that week, really sick."
  { src: staticFile('broll-al4-sick-week.png'), tIn: 3.70, tOut: 5.50, mode: 'content' },
  // "message to my community in the chat"
  { src: staticFile('broll-al4-community-chat.png'), tIn: 7.30, tOut: 9.10, mode: 'content' },
  // "shooting up and skyrocketing."
  { src: staticFile('broll-al4-skyrocket.png'), tIn: 14.90, tOut: 16.60, mode: 'content' },
  // "that monster pump"
  { src: staticFile('broll-al4-monster-pump.png'), tIn: 24.20, tOut: 26.00, mode: 'content' },
  // CLIMAX full: "I got redeemed". Out at 30.90 so "an 89, 89x." lands on Mike + the 89x row (hard out).
  { src: staticFile('broll-al4-climax-redeemed.png'), tIn: 29.50, tOut: 30.90, mode: 'full' },
];

export const OVERLAYS_AL4: OverlayEv[] = [];

// BADGES (code-drawn), never sharing a window with each other or with a b-roll image. top 620 = above the 854 seam.
export const BADGES_AL4: BadgeEv[] = [
  { tIn: 5.65, tOut: 7.15, color: AL4_ACCENT, line1: 'GOOD PLAY', sub: 'CALLED IT EARLY', top: 620 },
  { tIn: 9.25, tOut: 10.85, color: TEAL, line1: 'COMMUNITY', sub: 'GOT THE CALL IN CHAT', top: 620 },
  { tIn: 11.00, tOut: 12.90, color: GOLD, line1: 'ASLEEP', sub: 'FOR A COUPLE HOURS', top: 620 },
  { tIn: 16.75, tOut: 18.40, color: AL4_ACCENT, line1: 'SKYROCKETING', sub: 'WHILE I SLEPT', top: 620 },
  { tIn: 19.60, tOut: 23.40, color: GOLD, line1: 'SWING TRADED', sub: 'ALL OF 2025', top: 620 },
  { tIn: 26.20, tOut: 29.35, color: AL4_ACCENT, line1: 'DWARFED', sub: 'THE INITIAL PUMP', top: 620 },
  { tIn: 30.95, tOut: 32.50, color: GOLD, line1: '89X', sub: 'PIPPIN, HELD A YEAR', top: 620 },
];

// SFX. Crests: whoosh 0.165 s, whoosh-tight 0.165 s, card-impact-layered 0.030 s, DING-093 0.150 s, DSGNImpt 0.030 s.
// Every `t` = cue - crest.
export const SFX_AL4: Sfx[] = [
  { t:  0.033, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.12, dur: 1.00 },          // cover cut
  { t:  1.67,  src: staticFile('sfx/Impacts/card-impact-layered.wav'), vol: 0.14, dur: 1.50 },     // hook full-screen
  { t:  3.535, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.42 },   // into sick week
  { t:  5.50,  src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 },                       // GOOD PLAY badge
  { t:  7.135, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.42 },   // into community chat
  { t: 14.735, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.42 },   // into skyrocket
  { t: 19.45,  src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 },                       // SWING TRADED badge
  { t: 24.035, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.42 },   // into monster pump
  { t: 29.47,  src: staticFile('sfx/Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3'), vol: 0.20, dur: 1.20 }, // climax
  { t: 30.80,  src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 },                       // 89X badge
];

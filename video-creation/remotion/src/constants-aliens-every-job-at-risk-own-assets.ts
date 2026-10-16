import { staticFile } from 'remotion';
import { type BrollEv, type Sfx } from './_kit';
import type { ThumbDef, BadgeEv, OverlayEv } from './LivestreamShort';

// ─────────────────────────────────────────────────────────────────────────────────────────────
// batch aliens / clip #1 - `every-job-at-risk-own-assets` (variant: FULL)
// clip-plan title: "Every Goddamn Job Is at Risk, Get In Now"
//
// Spine: shorts/aliens/every-job-at-risk-own-assets/every-job-at-risk-own-assets-final.mp4, staged GOP-seek-friendly to
// render-assets/every-job-at-risk-own-assets.mp4 - VERIFIED: has_b_frames 0, 1080x1920 @25 fps, video 32.200 s,
// audio 32.200 s.
// Plan of record: shorts/aliens/every-job-at-risk-own-assets/BROLL-PLAN.md
// Captions: captionsAliensEveryJobOwnAssets.ts (canonical captions skill).
// Build directives for clip 1 (clip_directives.py --batch aliens --clip 1): none. No coverage exemption.
// ─────────────────────────────────────────────────────────────────────────────────────────────

export const EJ1_FPS = 30;
// 966 frames = 32.200 s; last rendered frame (965) sits at 32.167 s inside both tracks. Last word ends 32.10 s.
export const EJ1_DURATION = 966;

// MEASURED on THIS spine: row-mean gradient scan (rows 600-1300), 11 frames 1..31 s: largest step 853/854 (5 of 11;
// the rest are page-internal edges at 711/819 on the white YouTube page).
export const EJ1_SEAM = 854;
export const EJ1_CAP_Y = 960;
// Teal brand accent (ownership message); red for the risk beats.
export const EJ1_ACCENT = '#00e5ff';
const GOLD = '#ffc629';
const RED = '#ff3b3b';

export const CLIP_EJ1 = staticFile('every-job-at-risk-own-assets.mp4');

// FRAME-0 COVER (ONE frame). Art = photoreal hard-hat robot holding a wrench, top 45% empty for the CODE title.
export const THUMB_DEF_EJ1: ThumbDef = {
  img: staticFile('thumb-ej1-cover.png'),
  title: 'EVERY JOB\nAT RISK',
  chip: 'OWN ASSETS WHILE YOU CAN',
  chipColor: EJ1_ACCENT,
  titleSize: 140,
};

// B-ROLL. Budget: 1.60 + 1.90 + 1.90 + 1.90 + 1.70 + 1.68 = 10.68 s of 32.2 s = 33.2 % b-roll / 66.8 % base.
// 6 distinct images, each used once. 2 full-screens (hook + climax), inside the firm cap of 3.
export const BROLL_EJ1: BrollEv[] = [
  // HOOK full: "every goddamn thing." Opens on Mike + his channel page ("Literally Every Job Is at Risk") first.
  { src: staticFile('broll-ej1-hook-robot-hand.png'), tIn: 1.95, tOut: 3.55, mode: 'full' },
  // "combined knowledge of every expert electrician"
  { src: staticFile('broll-ej1-knowledge-upload.png'), tIn: 5.00, tOut: 6.90, mode: 'content' },
  // "electrician, of a plumber, of a carpenter"
  { src: staticFile('broll-ej1-robot-trades.png'), tIn: 11.00, tOut: 12.90, mode: 'content' },
  // "tens of thousands of accidents and deaths"; also hides the channel-page -> assets-table screen cut ~16 s.
  { src: staticFile('broll-ej1-highway-wrecks.png'), tIn: 16.30, tOut: 18.20, mode: 'content' },
  // "self-driving cars don't do anything,"
  { src: staticFile('broll-ej1-driverless-car.png'), tIn: 20.70, tOut: 22.40, mode: 'content' },
  // CLIMAX full: "Get in right now and have assets." Out at 30.30 so "Own assets. Own assets." is Mike (hard out).
  { src: staticFile('broll-ej1-climax-vault.png'), tIn: 28.62, tOut: 30.30, mode: 'full' },
];

export const OVERLAYS_EJ1: OverlayEv[] = [];

// BADGES (code-drawn), never sharing a window with each other or with a b-roll image. top 620 = above the 854 seam.
export const BADGES_EJ1: BadgeEv[] = [
  { tIn: 7.20, tOut: 9.00, color: GOLD, line1: 'EXPERTS', sub: 'ALL KNOWLEDGE, ONE ROBOT', top: 620 },
  { tIn: 13.10, tOut: 15.00, color: GOLD, line1: 'TRADES', sub: 'ELECTRICIAN, PLUMBER, ROOFER', top: 620 },
  { tIn: 18.40, tOut: 20.50, color: RED, line1: 'ACCIDENTS', sub: 'TENS OF THOUSANDS EVERY YEAR', top: 620 },
  { tIn: 22.80, tOut: 24.40, color: RED, line1: 'ILLEGAL', sub: 'FOR HUMANS TO DRIVE', top: 620 },
  { tIn: 26.70, tOut: 28.45, color: GOLD, line1: 'PAYCHECK', sub: 'GET IN WHILE YOU HAVE ONE', top: 620 },
  { tIn: 30.45, tOut: 32.17, color: EJ1_ACCENT, line1: 'ASSETS', sub: 'OWN THEM', top: 620 },
];

// SFX. Crests: whoosh 0.165 s, whoosh-tight 0.165 s, card-impact-layered 0.030 s, DING-093 0.150 s, DSGNImpt 0.030 s.
// Every `t` = cue - crest.
export const SFX_EJ1: Sfx[] = [
  { t:  0.033, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.12, dur: 1.00 },          // cover cut
  { t:  1.92,  src: staticFile('sfx/Impacts/card-impact-layered.wav'), vol: 0.14, dur: 1.50 },     // hook full-screen
  { t:  4.835, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.42 },   // into knowledge
  { t:  7.05,  src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 },                       // EXPERTS badge
  { t: 10.835, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.42 },   // into trades
  { t: 12.95,  src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 },                       // TRADES badge
  { t: 16.135, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.42 },   // into wrecks
  { t: 18.25,  src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 },                       // ACCIDENTS badge
  { t: 20.535, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.42 },   // into driverless
  { t: 22.65,  src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 },                       // ILLEGAL badge
  { t: 26.55,  src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 },                       // PAYCHECK badge
  { t: 28.59,  src: staticFile('sfx/Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3'), vol: 0.20, dur: 1.20 }, // climax
  { t: 30.30,  src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 },                       // ASSETS badge
];

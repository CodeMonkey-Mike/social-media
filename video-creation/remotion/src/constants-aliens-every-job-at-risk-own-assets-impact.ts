import { staticFile } from 'remotion';
import { type BrollEv, type Sfx } from './_kit';
import type { ThumbDef, BadgeEv, OverlayEv } from './LivestreamShort';

// ─────────────────────────────────────────────────────────────────────────────────────────────
// batch aliens / clip #6 - `every-job-at-risk-own-assets-impact` (variant: IMPACT)
// clip-plan title: "It Is Going to Be Illegal for Humans to Drive"
//
// Spine: shorts/aliens/every-job-at-risk-own-assets-impact/every-job-at-risk-own-assets-impact-final.mp4, staged to
// render-assets/every-job-at-risk-own-assets-impact.mp4 - VERIFIED: has_b_frames 0, 1080x1920 @25 fps,
// video 18.640 s, audio 18.674 s.
// Plan of record: shorts/aliens/every-job-at-risk-own-assets-impact/BROLL-PLAN.md
// Captions: captionsAliensEveryJobImpact.ts (canonical captions skill).
// Build directives for clip 6 (clip_directives.py --batch aliens --clip 6): none. No coverage exemption.
// ─────────────────────────────────────────────────────────────────────────────────────────────

export const EJ6_FPS = 30;
// 559 frames = 18.633 s; last frame (558) at 18.600 s, inside both tracks. Last word ends 18.58 s.
export const EJ6_DURATION = 559;

// Same stream layout as clip 1 (seam 854 measured there); confirmed on this spine's frames at 1/5/9/13/17 s
// (face-cam starts ~852-854).
export const EJ6_SEAM = 854;
export const EJ6_CAP_Y = 960;
export const EJ6_ACCENT = '#00e5ff';
const GOLD = '#ffc629';
const RED = '#ff3b3b';

export const CLIP_EJ6 = staticFile('every-job-at-risk-own-assets-impact.mp4');

// FRAME-0 COVER (ONE frame). Art = photoreal roped-off steering wheel, top 45% empty for the CODE title.
export const THUMB_DEF_EJ6: ThumbDef = {
  img: staticFile('thumb-ej6-cover.png'),
  title: 'ILLEGAL\nTO DRIVE',
  chip: 'SELF-DRIVING IS COMING',
  chipColor: RED,
  titleSize: 150,
};

// B-ROLL. Budget: 1.70 + 1.80 + 1.80 + 1.15 = 6.45 s of 18.63 s = 34.6 % b-roll / 65.4 % base.
// 4 distinct images, each used once. 2 full-screens (hook + climax), inside the firm cap of 3.
export const BROLL_EJ6: BrollEv[] = [
  // HOOK full: "tens of thousands of accidents". Opens on Mike + the assets table first.
  { src: staticFile('broll-ej6-hook-pileup.png'), tIn: 1.90, tOut: 3.60, mode: 'full' },
  // "self-driving cars don't do anything,"
  { src: staticFile('broll-ej6-robotaxi-convoy.png'), tIn: 6.10, tOut: 7.90, mode: 'content' },
  // "everything, everything is at risk." Also hides the assets-table -> market-table screen cut ~11 s.
  { src: staticFile('broll-ej6-everything-risk.png'), tIn: 10.10, tOut: 11.90, mode: 'content' },
  // CLIMAX full: "Get in right now and have assets." Out 18.25 so the last beat is Mike (hard out).
  { src: staticFile('broll-ej6-climax-assets.png'), tIn: 17.10, tOut: 18.25, mode: 'full' },
];

export const OVERLAYS_EJ6: OverlayEv[] = [];

// BADGES (code-drawn), never sharing a window with each other or with a b-roll image. top 620 = above the 854 seam.
export const BADGES_EJ6: BadgeEv[] = [
  { tIn: 3.80, tOut: 5.80, color: RED, line1: 'ACCIDENTS', sub: 'TENS OF THOUSANDS EVERY YEAR', top: 620 },
  { tIn: 8.30, tOut: 9.95, color: RED, line1: 'ILLEGAL', sub: 'FOR HUMANS TO DRIVE', top: 620 },
  { tIn: 13.10, tOut: 14.80, color: EJ6_ACCENT, line1: 'ASSETS', sub: 'YOU HAVE TO HAVE THEM', top: 620 },
  { tIn: 15.30, tOut: 16.95, color: GOLD, line1: 'PAYCHECK', sub: 'GET IN WHILE YOU HAVE ONE', top: 620 },
];

// SFX. Crests: whoosh 0.165 s, whoosh-tight 0.165 s, card-impact-layered 0.030 s, DING-093 0.150 s, DSGNImpt 0.030 s.
// Every `t` = cue - crest.
export const SFX_EJ6: Sfx[] = [
  { t:  0.033, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.12, dur: 1.00 },          // cover cut
  { t:  1.87,  src: staticFile('sfx/Impacts/card-impact-layered.wav'), vol: 0.14, dur: 1.50 },     // hook full-screen
  { t:  3.65,  src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 },                       // ACCIDENTS badge
  { t:  5.935, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.42 },   // into robotaxi
  { t:  8.15,  src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 },                       // ILLEGAL badge
  { t:  9.935, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.42 },   // into dominoes
  { t: 12.95,  src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 },                       // ASSETS badge
  { t: 15.15,  src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 },                       // PAYCHECK badge
  { t: 17.07,  src: staticFile('sfx/Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3'), vol: 0.20, dur: 1.10 }, // climax
];

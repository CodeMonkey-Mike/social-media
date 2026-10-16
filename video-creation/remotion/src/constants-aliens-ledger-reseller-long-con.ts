import { staticFile } from 'remotion';
import { type BrollEv, type Sfx } from './_kit';
import type { ThumbDef, BadgeEv, OverlayEv } from './LivestreamShort';

// ─────────────────────────────────────────────────────────────────────────────────────────────
// batch aliens / clip #5 - `ledger-reseller-long-con` (variant: FULL)
// clip-plan title: "90 Million Drained: The Ledger Reseller Long Con"
// Spine: shorts/aliens/render-assets/ledger-reseller-long-con.mp4 (1080x1920 @25, video 29.560 s, audio 29.580 s).
// Plan of record: shorts/aliens/ledger-reseller-long-con/BROLL-PLAN.md
// Build directives for clip 5 (clip_directives.py --batch aliens --clip 5): none. No coverage exemption.
// ─────────────────────────────────────────────────────────────────────────────────────────────

export const AL5_FPS = 30;
// 886 frames = 29.533 s; last frame inside both tracks. Last word "vendor." ends 29.40 s.
export const AL5_DURATION = 886;
// Same livestream layout as clip 3 (seam measured 854 there); strip check on this spine agrees.
export const AL5_SEAM = 854;
export const AL5_CAP_Y = 960;
export const AL5_ACCENT = '#ff3b3b'; // red = drained / theft
const GOLD = '#ffc629';
const GREEN = '#22c55e';

export const CLIP_AL5 = staticFile('ledger-reseller-long-con.mp4');

// FRAME-0 COVER (ONE frame).
export const THUMB_DEF_AL5: ThumbDef = {
  img: staticFile('thumb-al5-cover.png'),
  title: '$90 MILLION\nDRAINED',
  chip: 'THE LONG CON',
  chipColor: AL5_ACCENT,
  titleSize: 130,
};

// B-ROLL: 1.30 + 2.00 + 2.00 + 1.90 + 1.50 = 8.70 s of 29.53 s = 29.5 % b-roll / 70.5 % base.
// 2 full-screens (hook + climax). The X post receipt (0-~2.5 s, "$90M") stays visible 1.50-5.70.
export const BROLL_AL5: BrollEv[] = [
  { src: staticFile('broll-al5-hook-drained.png'), tIn: 0.20, tOut: 1.50, mode: 'full' },
  { src: staticFile('broll-al5-shady-reseller.png'), tIn: 7.06, tOut: 9.06, mode: 'content' },
  { src: staticFile('broll-al5-tampering.png'), tIn: 13.60, tOut: 15.60, mode: 'content' },
  { src: staticFile('broll-al5-climax-longcon.png'), tIn: 20.64, tOut: 22.54, mode: 'full' },
  { src: staticFile('broll-al5-buy-direct.png'), tIn: 25.80, tOut: 27.30, mode: 'content' },
];

export const OVERLAYS_AL5: OverlayEv[] = [];

// BADGES (code-drawn), never sharing a window with each other or a b-roll image. top 620 = above the 854 seam.
export const BADGES_AL5: BadgeEv[] = [
  { tIn: 5.60, tOut: 6.90, color: AL5_ACCENT, line1: '$90 MILLION', sub: 'DRAINED', top: 620 },
  { tIn: 10.10, tOut: 11.90, color: GOLD, line1: 'NOT FROM', sub: 'THE OFFICIAL SITE', top: 620 },
  { tIn: 27.50, tOut: 29.40, color: GREEN, line1: 'BUY DIRECT', sub: 'FROM THE VENDOR', top: 620 },
];

// SFX: every `t` = cue - crest so the crest lands on the cut/badge frame (same crests as clip 3).
export const SFX_AL5: Sfx[] = [
  { t: 0.033, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.12, dur: 1.00 }, // frame-0 cover cut
  { t: 0.17, src: staticFile('sfx/Impacts/card-impact-layered.wav'), vol: 0.12, dur: 1.20 }, // hook full-screen
  { t: 5.45, src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 }, // badge $90M
  { t: 6.895, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.10, dur: 0.42 }, // into reseller
  { t: 9.95, src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 }, // badge not official
  { t: 13.435, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.10, dur: 0.42 }, // into tampering
  { t: 20.607, src: staticFile('sfx/Boom - Big Reveal-short.wav'), vol: 0.18, dur: 1.05 }, // CLIMAX long con
  { t: 25.635, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.10, dur: 0.42 }, // into buy direct
  { t: 27.35, src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 }, // badge buy direct
];

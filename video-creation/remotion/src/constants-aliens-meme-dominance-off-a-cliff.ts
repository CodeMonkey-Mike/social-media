import { staticFile } from 'remotion';
import { type BrollEv, type Sfx } from './_kit';
import type { ThumbDef, BadgeEv, OverlayEv } from './LivestreamShort';

// ─────────────────────────────────────────────────────────────────────────────────────────────
// batch aliens / clip #3 - `meme-dominance-off-a-cliff` (variant: FULL)
// clip-plan title: "Nobody Wants Memes Anymore: It Is Us Trading Against Ourselves"
// Spine: shorts/aliens/render-assets/meme-dominance-off-a-cliff.mp4 (1080x1920 @25, video 25.760 s, audio 25.789 s).
// Plan of record: shorts/aliens/meme-dominance-off-a-cliff/BROLL-PLAN.md
// Build directives for clip 3 (clip_directives.py --batch aliens --clip 3): none. No coverage exemption.
// ─────────────────────────────────────────────────────────────────────────────────────────────

export const AL3_FPS = 30;
// 772 frames = 25.733 s; last frame (771) at 25.70 s sits inside both tracks. Last word "risky." ends 25.48 s.
export const AL3_DURATION = 772;
// MEASURED on this spine: row-mean gradient step at 853/854 on 5 of 6 frames (t=1,5,9,14,18).
export const AL3_SEAM = 854;
export const AL3_CAP_Y = 960;
export const AL3_ACCENT = '#ff3b3b'; // red = falling / danger
const GOLD = '#ffc629';

export const CLIP_AL3 = staticFile('meme-dominance-off-a-cliff.mp4');

// FRAME-0 COVER (ONE frame). Photoreal oversized blank meme coin tipping off a cliff, top empty for the title.
export const THUMB_DEF_AL3: ThumbDef = {
  img: staticFile('thumb-al3-cover.png'),
  title: 'NOBODY WANTS\nMEMES',
  chip: 'OFF A CLIFF',
  chipColor: AL3_ACCENT,
  titleSize: 140,
};

// B-ROLL: 1.70 + 1.82 + 1.72 + 1.02 + 2.00 = 8.26 s of 25.76 s = 32.1 % b-roll / 67.9 % base. 5 images, each once.
// 2 full-screens (hook + climax). The memecoin dominance chart (10-19 s) stays visible as the receipt.
export const BROLL_AL3: BrollEv[] = [
  { src: staticFile('broll-al3-hook-danger.png'), tIn: 0.20, tOut: 1.90, mode: 'full' },
  { src: staticFile('broll-al3-empty-casino.png'), tIn: 4.28, tOut: 6.10, mode: 'content' },
  { src: staticFile('broll-al3-trading-ourselves.png'), tIn: 6.18, tOut: 7.90, mode: 'content' },
  { src: staticFile('broll-al3-climax-cliff.png'), tIn: 15.70, tOut: 16.72, mode: 'full' },
  { src: staticFile('broll-al3-new-risky.png'), tIn: 22.62, tOut: 24.62, mode: 'content' },
];

export const OVERLAYS_AL3: OverlayEv[] = [];

// BADGES (code-drawn), never sharing a window with each other or a b-roll image. top 620 = above the 854 seam.
export const BADGES_AL3: BadgeEv[] = [
  { tIn: 8.20, tOut: 9.85, color: GOLD, line1: 'NO NEW', sub: 'MARKET PARTICIPANTS', top: 620 },
  { tIn: 11.00, tOut: 15.50, color: AL3_ACCENT, line1: 'MEME DOMINANCE', sub: 'DOWN SINCE 2024', top: 620 },
  { tIn: 21.10, tOut: 22.50, color: GOLD, line1: 'CULT MEMES', sub: 'ONLY', top: 620 },
];

// SFX: every `t` = cue - crest so the crest lands on the cut/badge frame (crests as measured for clip 2).
export const SFX_AL3: Sfx[] = [
  { t: 0.033, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.12, dur: 1.00 }, // frame-0 cover cut
  { t: 0.17, src: staticFile('sfx/Impacts/card-impact-layered.wav'), vol: 0.12, dur: 1.20 }, // hook full-screen
  { t: 4.115, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.42 }, // into casino
  { t: 6.015, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.10, dur: 0.42 }, // into trading ring
  { t: 8.05, src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 }, // badge 1
  { t: 10.85, src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 }, // badge 2
  { t: 15.667, src: staticFile('sfx/Boom - Big Reveal-short.wav'), vol: 0.18, dur: 1.05 }, // CLIMAX cliff
  { t: 20.95, src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 }, // badge 3
  { t: 22.455, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.42 }, // into tightrope
];

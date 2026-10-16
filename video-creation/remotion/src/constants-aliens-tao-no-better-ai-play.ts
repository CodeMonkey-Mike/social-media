import { staticFile } from 'remotion';
import { type BrollEv, type Sfx } from './_kit';
import type { ThumbDef, BadgeEv, OverlayEv } from './LivestreamShort';

// ─────────────────────────────────────────────────────────────────────────────────────────────
// batch aliens / clip #2 - `tao-no-better-ai-play` (variant: FULL)
// clip-plan title: "There Is No Better AI Play Than TAO"
// "Long term? Long term I think that TAO is going to be absolutely insanely high. Insanely high. AI is the whole
//  narrative and TAO is no better play than TAO when it comes to AI. No better play. TAO is on a steal right now."
// Spine: shorts/aliens/render-assets/tao-no-better-ai-play.mp4 (1080x1920 @25, video 14.200 s, audio 14.219 s).
// Plan of record: shorts/aliens/tao-no-better-ai-play/BROLL-PLAN.md
// Build directives for clip 2 (clip_directives.py --batch aliens --clip 2): none. No coverage exemption.
// ─────────────────────────────────────────────────────────────────────────────────────────────

export const AL2_FPS = 30;
// 426 frames = 14.200 s; last frame (425) at 14.167 s sits inside both tracks. Last word "now." ends 14.10 s.
export const AL2_DURATION = 426;
// MEASURED on this spine: row-mean gradient step at the 853/854 boundary on 5 of 5 frames (t=1,4,7,10,13).
export const AL2_SEAM = 854;
export const AL2_CAP_Y = 960;
// TAO accent: electric green (the Bittensor mark is mono; green = up/positive house colour).
export const AL2_ACCENT = '#39ff14';
const GOLD = '#ffc629';

export const CLIP_AL2 = staticFile('tao-no-better-ai-play.mp4');

// FRAME-0 COVER (ONE frame). Photoreal oversized TAO coin (Bittensor reference attached), top left empty for title.
export const THUMB_DEF_AL2: ThumbDef = {
  img: staticFile('thumb-al2-cover.png'),
  title: 'NO BETTER\nAI PLAY',
  chip: 'TAO IS ON A STEAL',
  chipColor: AL2_ACCENT,
  titleSize: 150,
};

// B-ROLL: 1.90 + 1.54 + 1.08 = 4.52 s of 14.20 s = 31.8 % b-roll / 68.2 % base. 3 images, each once.
// 2 full-screens (hook + climax), inside the FIRM cap of 3. Base = Bittensor markets page + TAO chart.
export const BROLL_AL2: BrollEv[] = [
  // HOOK full-screen: "be absolutely insanely high" - TAO coin rocketing into space.
  { src: staticFile('broll-al2-hook-tao-rocket.png'), tIn: 2.76, tOut: 4.66, mode: 'full' },
  // "AI is the whole narrative" - glowing AI brain over a city. Content zone, face stays on.
  { src: staticFile('broll-al2-ai-narrative.png'), tIn: 6.36, tOut: 7.90, mode: 'content' },
  // CLIMAX full-screen: "No better play." - crowned TAO coin on a pedestal. Out before "TAO is on a steal".
  { src: staticFile('broll-al2-climax-tao-king.png'), tIn: 11.62, tOut: 12.70, mode: 'full' },
];

export const OVERLAYS_AL2: OverlayEv[] = [];

// BADGES (code-drawn), never sharing a window with each other or a b-roll image. top 620 = above the 854 seam.
export const BADGES_AL2: BadgeEv[] = [
  { tIn: 8.40, tOut: 11.45, color: AL2_ACCENT, line1: 'TAO', sub: 'NO BETTER AI PLAY', top: 620 },
  { tIn: 12.80, tOut: 14.20, color: GOLD, line1: 'STEAL', sub: 'TAO RIGHT NOW', top: 620 },
];

// SFX: every `t` = cue - crest so the crest lands on the cut/badge frame.
//   transition_rapid_whoosh 0.97 s crest 0.165 · -tight 0.42 s crest 0.165 · card-impact-layered 1.45 s crest 0.030
//   DING-093 0.93 s crest 0.150 · Boom - Big Reveal-short 1.05 s crest 0.033
export const SFX_AL2: Sfx[] = [
  // frame-0 cover cut to the base, low under "Long term?"
  { t: 0.033, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.12, dur: 1.00 },
  // hook reveal hit on the 2.76 full-screen cut
  { t: 2.73, src: staticFile('sfx/Impacts/card-impact-layered.wav'), vol: 0.14, dur: 1.45 },
  // whoosh into the AI cutaway at 6.36
  { t: 6.195, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.42 },
  // ding on the TAO badge (8.40)
  { t: 8.25, src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 },
  // THE payoff boom on the climax cut (11.62)
  { t: 11.587, src: staticFile('sfx/Boom - Big Reveal-short.wav'), vol: 0.18, dur: 1.05 },
  // ding on the STEAL badge (12.80)
  { t: 12.65, src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 },
];

import { staticFile } from 'remotion';
import { type BrollEv, type Sfx } from './_kit';
import type { ThumbDef, BadgeEv, OverlayEv } from './LivestreamShort';

// ─────────────────────────────────────────────────────────────────────────────────────────────
// batch peach / clip #1 - `pengu-flips-pepe` (variant: FULL)
// clip-plan title: "Pengu Is Gonna Flip Pepe. I Bought More at 300 Million"
// Spine: shorts/peach/render-assets/pengu-flips-pepe.mp4 (1080x1920 @25, video 35.320 s, audio 35.307 s, GOP re-encoded).
// Plan of record: shorts/peach/pengu-flips-pepe/BROLL-PLAN.md
// Build directives for clip 1 (clip_directives.py --batch peach --clip 1): none. No coverage exemption.
// Flat-namespace check 2026-11-16: no existing PeachPenguFlipsPepe / PCH1_ / broll-peach-pfp / thumb-peach-pengu.
// ─────────────────────────────────────────────────────────────────────────────────────────────

export const PCH1_FPS = 30;
// 1059 frames = 35.300 s; last frame (1058) at 35.267 s sits inside both tracks (video 35.320, audio 35.307).
export const PCH1_DURATION = 1059;
// MEASURED: row-mean gradient step at 853/854 on t=3,12,20 s (the 815 step at t=28 is the burned-in movie clip's edge).
export const PCH1_SEAM = 854;
export const PCH1_CAP_Y = 900;
export const PCH1_ACCENT = '#00e5ff'; // Pengu blue/teal
const YEL = '#ffe600';

export const CLIP_PCH1 = staticFile('pengu-flips-pepe.mp4');

// FRAME-0 COVER (ONE frame): Pengu vs the frog face-off art, title code-drawn on top.
export const THUMB_DEF_PCH1: ThumbDef = {
  img: staticFile('thumb-peach-pengu-flips-pepe.png'),
  title: 'PENGU IS\nGONNA FLIP\nPEPE',
  chip: 'I BOUGHT MORE AT $300M',
  chipColor: PCH1_ACCENT,
  titleSize: 128,
};

// B-ROLL: 2.82 + 1.88 + 2.90 + 2.60 + 1.90 = 12.10 s of 35.30 s = 34.3 % b-roll / 65.7 % base. 5 images, each once.
// 3 full-screens (hook, climax, close) = the FIRM cap. B1(full) -> B2(content) butt together (hard cut, no base flash).
export const BROLL_PCH1: BrollEv[] = [
  // HOOK full-screen: "pengu is gonna flip pepe, one of the biggest meme coins"
  { src: staticFile('broll-peach-pfp-flip.png'), tIn: 3.40, tOut: 6.22, mode: 'full' },
  // "i bought a little bit more pengu" - content zone
  { src: staticFile('broll-peach-pfp-buy.png'), tIn: 6.22, tOut: 8.10, mode: 'content' },
  // "in the next run up, a 300 million market cap" - content zone
  { src: staticFile('broll-peach-pfp-rocket.png'), tIn: 12.30, tOut: 15.20, mode: 'content' },
  // CLIMAX full-screen: "it could be a 100x, it could get to 30 billion"
  { src: staticFile('broll-peach-pfp-moon.png'), tIn: 17.40, tOut: 20.00, mode: 'full' },
  // CLOSE full-screen: "pengu at 300 million's a steal"
  { src: staticFile('broll-peach-pfp-steal.png'), tIn: 33.40, tOut: 35.30, mode: 'full' },
];

// Real alpha PNG (alpha-from-luminance) over the base CMC page: "like a powerhouse". Base-only window, no b-roll.
export const OVERLAYS_PCH1: OverlayEv[] = [
  { src: staticFile('ovl-broll-peach-pfp-flex.png'), tIn: 9.60, tOut: 11.70, top: 150, left: 290, width: 500, blend: 'normal' },
];

// Code-drawn stat badge over the base content zone, between the climax full-screen and nothing else.
export const BADGES_PCH1: BadgeEv[] = [
  { tIn: 20.30, tOut: 21.85, color: YEL, line1: '$300M', line2: 'TO $30B', sub: 'THE 100X CASE', top: 420 },
];

// SFX: t = event time minus the file's attack_sec (library.json), so the peak lands ON the event frame.
export const SFX_PCH1: Sfx[] = [
  { t: 0.00, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.5, dur: 0.42 },          // thumbnail cut
  { t: 3.26, src: staticFile('sfx/Impacts/Impact_Hit_01-2-short.wav'), vol: 0.32, dur: 0.55 },         // hook full-screen
  { t: 6.12, src: staticFile('sfx/Cash Register-ching.wav'), vol: 0.4, dur: 0.77 },                    // "bought more"
  { t: 11.71, src: staticFile('sfx/Cinematic Whoosh 06.wav'), vol: 0.3, dur: 1.2, fade: 0.3 },         // rocket beat
  { t: 17.21, src: staticFile('sfx/Impacts/Kick_Impact_01-short.wav'), vol: 0.4, dur: 0.55 },          // 100x climax
  { t: 20.15, src: staticFile('sfx/DING-093.wav'), vol: 0.3, dur: 0.93 },                              // $30B badge
  { t: 33.37, src: staticFile('sfx/Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3'), vol: 0.35, dur: 1.2, fade: 0.4 }, // "a steal" close
];

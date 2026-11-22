import { staticFile } from 'remotion';
import { type BrollEv, type Sfx } from './_kit';

// ─────────────────────────────────────────────────────────────────────────────────────────────
// batch ripping / clip #5 - `anthropic-ipo-money-rotating-out` (variant: FULL)
// clip-plan title: "Why We're Dumping: All This Money Is Rotating Out for the Anthropic IPO"
// "This was like the SpaceX IPO, right? And so now the thing is this is the Anthropic IPO. All this money rotating
//  out by the Anthropic IPO... a few more weeks before it actually bottomed... further down... it is what it is...
//  got a few plays, man, that are pumping on a day like this, it's crazy. Absolutely insane."
// Spine: shorts/ripping/render-assets/anthropic-ipo-money-rotating-out.mp4 (1080x1920 @25, video 32.96 s, audio 32.938 s).
// Plan of record: shorts/ripping/anthropic-ipo-money-rotating-out/BROLL-PLAN.md (images visual-qa PASS 6/6).
// Build directives for clip 5 (clip_directives.py --batch ripping --clip 5): none. No coverage exemption.
// Flat-namespace check 2026-11-19: no existing RippingAnthropicIpo / RIP5_ / constants-ripping-anthropic-ipo-*.
// ─────────────────────────────────────────────────────────────────────────────────────────────

// render_short.py renders and verifies at 30 fps; the 25 fps spine is resampled by OffthreadVideo.
export const RIP5_FPS = 30;
// 988 frames = 32.933 s; last frame (987) at 32.900 s sits inside both tracks (video 32.96, audio 32.938).
export const RIP5_DURATION = 988;
const END = RIP5_DURATION / RIP5_FPS;
// MEASURED on this spine: row-mean gradient step at the 853/854 boundary on 8 of 8 frames (t=1,5,10,14,18,21,25,29).
export const RIP5_SEAM = 854;
// Caption band just under the seam (~915-1005): Mike's eyes sit at y~1430-1560, so 960 is hair, never the eyes.
export const RIP5_CAP_Y = 960;
// RED = the dump; GREEN = the plays pumping; Anthropic coral ONLY on the "ANTHROPIC IPO" badge + cover chip.
export const RIP5_RED = '#FF3B3B';
export const RIP5_GREEN = '#2EE88A';
export const RIP5_CORAL = '#D97757';
export const RIP5_STEEL = '#E8EEF5';
// divider under the content-mode images = red (the clip is about the dump)
export const RIP5_ACCENT = RIP5_RED;

export const CLIP_RIP5 = staticFile('anthropic-ipo-money-rotating-out.mp4');

// FRAME-0 COVER (ONE frame, drawn by the comp). Cracked Bitcoin coin pouring gold across a bridge to the Anthropic
// tower, SpaceX launching between them. In the 1080x1920 cover-fit the night sky is empty down to y~560 (the rocket
// nose); the code-drawn title block sits in y 70-400.
export const THUMB_IMG_RIP5 = staticFile('broll-rip5-thumb.png');

// B-ROLL: 1.56 + 2.60 + 2.36 + 2.08 + 2.69 = 11.29 s of 32.93 s = 34.3 % b-roll / 65.7 % base. 5 images, each once.
// 3 full-screens (hook B1, core claim B2, climax B5) = the FIRM cap; full->full gaps 3.40 s and 21.14 s (rule 4).
// B4 (content) butts B5 (full) at 30.24 so BrollLayer HARD-CUTS between them (no 0.88 s chart flash, plan updated).
export const BROLL_RIP5: BrollEv[] = [
  // HOOK full-screen: "SpaceX IPO, right?"
  { src: staticFile('broll-rip5-spacex-ipo.png'), tIn: 1.54, tOut: 3.10, mode: 'full' },
  // CORE CLAIM full-screen: "All this money rotating out by the Anthropic IPO."
  { src: staticFile('broll-rip5-rotate-out.png'), tIn: 6.50, tOut: 9.10, mode: 'full' },
  // "Well, you know, it is what it is, we'll take it as it comes."
  { src: staticFile('broll-rip5-take-it.png'), tIn: 22.78, tOut: 25.14, mode: 'content' },
  // "plays, man, that are pumping, like at" (lands ON "plays")
  { src: staticFile('broll-rip5-few-plays.png'), tIn: 28.16, tOut: 30.24, mode: 'content' },
  // CLIMAX full-screen: "a day like this, it's crazy. Absolutely insane." -> runs past the last frame (no fade-out)
  { src: staticFile('broll-rip5-insane.png'), tIn: 30.24, tOut: 33.10, mode: 'full' },
];

// CODE BADGES (drawn by the comp, single line, never wrapped). Centre y 610 = the RSI pane (y ~450-780 of the
// content zone), NEVER over the price pane (y < 435, where Mike's arrows + his drawn curve live) and clear of the
// caption band (~915-1005). Never sharing a window with each other or a b-roll beat.
export type Rip5Badge = { tIn: number; tOut: number; color: string; line1: string; sub?: string; top: number; arrow?: boolean; size?: number };
export const BADGES_RIP5: Rip5Badge[] = [
  // C1 "is the Anthropic IPO."
  { tIn: 4.94, tOut: 6.40, color: RIP5_CORAL, line1: 'ANTHROPIC IPO', top: 610 },
  // C2 "SpaceX IPO, I believe it was like over here."
  { tIn: 9.30, tOut: 12.20, color: RIP5_STEEL, line1: 'SPACEX IPO WEEK', sub: 'THE LAST TIME', top: 610 },
  // C3 "it was a few more weeks before it actually bottomed over here."
  { tIn: 13.60, tOut: 16.18, color: RIP5_STEEL, line1: 'A FEW MORE WEEKS', sub: 'THEN THE BOTTOM', top: 610 },
  // C4 "a bunch of extra weeks going here, maybe a little bit further down"
  { tIn: 18.38, tOut: 21.16, color: RIP5_RED, line1: 'MORE WEEKS DOWN?', top: 610, arrow: true, size: 70 },
];

// SFX: every `t` = cue - crest so the crest lands on the cut/badge frame (library.json attack_sec):
//   transition_rapid_whoosh-tight 0.165 · Impact_Hit_01-2-short 0.14 · DING-093 0.150 · Cinematic Whoosh 06 0.59
//   card-impact-hit01-3-short 0.11 · Kick_Impact_01-short 0.19 · transition_rapid_whoosh 0.18
//   Cash Register-ching 0.12 · Riser Sound Effect-2s 2.015 · Boom - Big Reveal-short 0.03
export const SFX_RIP5: Sfx[] = [
  // frame-0 cover cut to the base
  { t: 0.033, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.42 },
  // hook full-screen SpaceX launch (1.54)
  { t: 1.40, src: staticFile('sfx/Impacts/Impact_Hit_01-2-short.wav'), vol: 0.14, dur: 0.55 },
  // C1 "ANTHROPIC IPO" badge pop (4.94)
  { t: 4.79, src: staticFile('sfx/DING-093.wav'), vol: 0.10, dur: 0.45 },
  // into the core-claim full-screen (6.50)
  { t: 5.91, src: staticFile('sfx/Cinematic Whoosh 06.wav'), vol: 0.22, dur: 0.85, fade: 0.20 },
  // C2 "SPACEX IPO WEEK" badge (9.30)
  { t: 9.19, src: staticFile('sfx/Impacts/card-impact-hit01-3-short.wav'), vol: 0.14, dur: 0.60, fade: 0.20 },
  // C4 red "MORE WEEKS DOWN?" badge (18.38)
  { t: 18.19, src: staticFile('sfx/Impacts/Kick_Impact_01-short.wav'), vol: 0.16, dur: 0.55 },
  // out of the long chart stretch into B3 (22.78)
  { t: 22.60, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.14, dur: 0.50, fade: 0.15 },
  // "plays" (28.16): the cash register = the plays paying
  { t: 28.04, src: staticFile('sfx/Cash Register-ching.wav'), vol: 0.12, dur: 0.77 },
  // riser builds INTO the climax: crest lands on the 30.24 cut
  { t: 28.225, src: staticFile('sfx/Riser Sound Effect-2s.wav'), vol: 0.30, dur: 2.10 },
  // climax boom (30.24)
  { t: 30.21, src: staticFile('sfx/Boom - Big Reveal-short.wav'), vol: 0.14, dur: 1.05, fade: 0.30 },
];

export { END as RIP5_END_S };

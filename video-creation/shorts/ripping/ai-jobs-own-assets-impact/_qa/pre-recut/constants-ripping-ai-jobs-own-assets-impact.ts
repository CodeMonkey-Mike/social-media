import { staticFile } from 'remotion';
import { type BrollEv, type Sfx } from './_kit';

// ─────────────────────────────────────────────────────────────────────────────────────────────
// batch ripping / clip #7 - `ai-jobs-own-assets-impact` (variant: IMPACT)
// clip-plan title: "AI Codes Better Than Any Engineer. You Can't Be a Code Monkey Anymore"
// "It is official that AI can code better than any software engineer. There's no need anymore to be a code monkey,
//  right? The code monkey is just a term for a geek who likes to sit there and just write code all day. Right? That's
//  where I got that term from. And you can't be a code monkey going forward in the future. You just can't do it.
//  You're going to find yourself on a" (the spine ends mid-sentence; 'unemployed' is NOT spoken, 4/4 decodes).
// Spine: shorts/ripping/render-assets/ai-jobs-own-assets-impact.mp4 (1080x1920 @25, video 483 f = 19.32 s, audio 19.43 s).
// Plan of record: shorts/ripping/ai-jobs-own-assets-impact/BROLL-PLAN.md (stage 2 remap: the frame-0 cover).
// Build directives for clip 7 (clip_directives.py --batch ripping --clip 7): none. No coverage exemption.
// Flat-namespace check 2026-11-19: no existing RippingAiJobsImpact / RIP7_ / constants-ripping-ai-jobs-own-assets-impact.
// ─────────────────────────────────────────────────────────────────────────────────────────────

// render_short.py renders and verifies at 30 fps; the 25 fps spine is resampled by OffthreadVideo.
export const RIP7_FPS = 30;
// 579 frames = 19.300 s <= the 19.32 s video track (audio 19.43 s): the last frame (578, 19.267 s) sits inside both.
export const RIP7_DURATION = 579;
const END = RIP7_DURATION / RIP7_FPS;
// MEASURED on this spine: row-mean gradient step at the 853/854 boundary on 7 of 7 frames (t=1,5,8,10,13,16,18).
export const RIP7_SEAM = 854;
// Caption band just under the seam (~915-1005): Mike's eyes sit at y~1290-1350, so 960 is hair/forehead, never the eyes.
export const RIP7_CAP_Y = 960;
export const RIP7_TEAL = '#00e5ff';
export const RIP7_RED = '#FF3B3B';
// divider under the content-mode images = house teal (AI / code)
export const RIP7_ACCENT = RIP7_TEAL;

export const CLIP_RIP7 = staticFile('ai-jobs-own-assets-impact.mp4');

// FRAME-0 COVER (ONE frame, drawn by the comp). REMAP (stage 2): the generated cover broll-rip7-thumb.png FAILED
// visual-qa after 2 rounds (scene ran into both side margins) and is retired to _qa/rejected/. The cover is now the
// climax image (B4 broll-rip7-unemployed.png) cover-cropped to 1080x1920 by code (SKILL Phase 7 rule 5: a strong
// full-screen moment of the clip duplicated to the front). The rainy curb monkey sits y~540-1680; the code-drawn
// title block sits in y 70-430 over the upper office floor.
export const THUMB_IMG_RIP7 = staticFile('broll-rip7-thumb.png');

// B-ROLL: 1.70 + 1.60 + 1.46 + 1.64 = 6.40 s of 19.30 s = 33.2 % b-roll / 66.8 % base. 4 images, each once.
// 2 full-screens (hook B1, climax B4); full->full gap 14.20 s (rule 4). Every tIn on a word onset.
export const BROLL_RIP7: BrollEv[] = [
  // B1 HOOK full-screen: "AI can code better than" (1.76 = "AI" onset)
  { src: staticFile('broll-rip7-ai-codes.png'), tIn: 1.76, tOut: 3.46, mode: 'full' },
  // B2 content: "to be a code monkey, right?"
  { src: staticFile('broll-rip7-code-monkey.png'), tIn: 6.70, tOut: 8.30, mode: 'content' },
  // B3 content: "That's where I got that term from." (CodeMonkey Mike mascot, generated WITH mike-profile-logo.jpg)
  { src: staticFile('broll-rip7-name-origin.png'), tIn: 12.74, tOut: 14.20, mode: 'content' },
  // B4 CLIMAX full-screen: "can't do it. You're going to find yourself on a" -> runs past the last frame (no fade-out)
  { src: staticFile('broll-rip7-unemployed.png'), tIn: 17.66, tOut: 19.50, mode: 'full' },
];

// CODE CARDS (drawn by the comp, single line each, never wrapped). Centre y 712 = the description band of the YouTube
// page (y ~600-820), below the player (y 45-497) and clear of the caption band (~915-1005). Never sharing a window
// with each other or a b-roll beat; K3 is fully gone (17.60) before B4 fades in at 17.66.
export const K1_RIP7 = { tIn: 3.80, tOut: 5.40, top: 712 };   // "software engineer"  -> AI > ANY ENGINEER
export const K2_RIP7 = { tIn: 9.40, tOut: 11.90, top: 712 };  // "a term for a geek who ... write code all day"
export const K3_RIP7 = { tIn: 15.60, tOut: 17.60, top: 712, strikeAt: 16.16 }; // strike on "going" (16.16)

// SFX: every `t` = cue - crest so the crest lands on the cut/card frame (library.json attack_sec):
//   transition_rapid_whoosh-tight 0.18 · Impact_Hit_01-2-short 0.14 · DING-093 0.15 · whoosh-4 0.34
//   fast-swoosh 0.25 · knock-pop 0.00 · minecraft-damage 0.71 · Tension_Rise_Logo_Reveal_3-1s 0.48 · Kick_Impact_01-short 0.19
export const SFX_RIP7: Sfx[] = [
  // frame-0 cover cut to the base
  { t: 0.033, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.42 },
  // B1 hook full-screen (1.76)
  { t: 1.62, src: staticFile('sfx/Impacts/Impact_Hit_01-2-short.wav'), vol: 0.14, dur: 0.55 },
  // K1 "AI > ANY ENGINEER" (3.80)
  { t: 3.65, src: staticFile('sfx/DING-093.wav'), vol: 0.10, dur: 0.45 },
  // B2 ingress (6.70)
  { t: 6.36, src: staticFile('sfx/kinetic-text/whoosh-4.mp3'), vol: 0.14, dur: 0.80, fade: 0.15 },
  // K2 dictionary card slides in (9.40)
  { t: 9.15, src: staticFile('sfx/kinetic-text/fast-swoosh.wav'), vol: 0.12, dur: 0.55 },
  // B3 the name reveal, CodeMonkey (12.74)
  { t: 12.74, src: staticFile('sfx/kinetic-text/knock-pop.wav'), vol: 0.14, dur: 0.50, fade: 0.15 },
  // K3 red strike through "CODE MONKEY" (16.16)
  { t: 15.45, src: staticFile('sfx/kinetic-text/minecraft-damage.wav'), vol: 0.12, dur: 0.95, fade: 0.15 },
  // riser builds INTO the climax: crest lands on the 17.66 cut, cut right after the crest
  { t: 17.18, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_3-1s.wav'), vol: 0.18, dur: 0.50 },
  // climax hit (17.66)
  { t: 17.47, src: staticFile('sfx/Impacts/Kick_Impact_01-short.wav'), vol: 0.16, dur: 0.55 },
];

export { END as RIP7_END_S };

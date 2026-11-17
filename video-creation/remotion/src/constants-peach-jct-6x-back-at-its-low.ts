import { staticFile } from 'remotion';
import { type BrollEv, type Sfx } from './_kit';
import type { ThumbDef, BadgeEv, OverlayEv } from './LivestreamShort';

// ─────────────────────────────────────────────────────────────────────────────────────────────
// batch peach / clip #4 - `jct-6x-back-at-its-low` (variant: FULL)
// clip-plan title: "JCT Did a 6x Overnight. Now It's Back at Its Low"
// Spine: shorts/peach/render-assets/jct-6x-back-at-its-low.mp4 (1080x1920 @25, video 27.240 s, audio 27.232 s, GOP re-encoded).
// Plan of record: shorts/peach/jct-6x-back-at-its-low/BROLL-PLAN.md
// Build directives for clip 4 (clip_directives.py --batch peach --clip 4): none. No coverage exemption.
// Flat-namespace check 2026-11-16: no existing PeachJct6xLow / PCH4_ / broll-pch4 / thumb-pch4 / ovl-pch4.
// JCT (Janction) = LESSER-KNOWN, NO reference on disk -> no generated JCT logo anywhere; every coin is a blank
// gold coin and the JCT name lives in code-drawn type (thumb title, badges) + the real CMC page in the base.
// ─────────────────────────────────────────────────────────────────────────────────────────────

export const PCH4_FPS = 30;
// 817 frames = 27.233 s; last frame (816) at 27.200 s sits inside both tracks (video 27.240, audio 27.232).
export const PCH4_DURATION = 817;
// MEASURED: row-mean gradient step at 853/854 on t=3,9,15,20,26 s.
export const PCH4_SEAM = 854;
export const PCH4_CAP_Y = 900;
export const PCH4_ACCENT = '#ffe600'; // yellow: the pump / numbers
const GRN = '#39ff14';

export const CLIP_PCH4 = staticFile('jct-6x-back-at-its-low.mp4');

// FRAME-0 COVER (ONE frame): blank gold coin that rode a green spike and slid back to the canyon floor; title code-drawn.
export const THUMB_DEF_PCH4: ThumbDef = {
  img: staticFile('thumb-pch4-jct-roundtrip.png'),
  title: 'JCT DID A 6X.<br/>NOW IT\'S BACK<br/>AT ITS LOW',
  chip: 'A FREEBIE ENTRY?',
  chipColor: PCH4_ACCENT,
  titleSize: 108,
};

// B-ROLL: 2.26 + 2.36 + 2.14 + 2.53 = 9.29 s of 27.23 s = 34.1 % b-roll / 65.9 % base. 4 images, each once.
// 2 full-screens (hook payoff, climax) = under the firm cap of 3.
export const BROLL_PCH4: BrollEv[] = [
  // HOOK-PAYOFF full-screen: "we had a huge pump on this" (also covers the 0.4 s black content-zone frame at 3.36-3.76)
  { src: staticFile('broll-pch4-huge-pump.png'), tIn: 3.30, tOut: 5.56, mode: 'full' },
  // "it's a good time for you guys to get in, right?" - content zone (the chart shows again for the repeat)
  { src: staticFile('broll-pch4-get-in.png'), tIn: 13.24, tOut: 15.60, mode: 'content' },
  // CLIMAX full-screen: "it's a freebie, right? if you're not in my community"
  { src: staticFile('broll-pch4-freebie.png'), tIn: 18.66, tOut: 20.80, mode: 'full' },
  // CLOSE content zone: "well, yeah, this is in the compute narrative". tOut past the comp end so it holds to the last frame.
  { src: staticFile('broll-pch4-compute.png'), tIn: 24.70, tOut: 27.40, mode: 'content' },
];

// Real alpha PNG (alpha-from-luminance): red down-arrow over the flat stretch left of the chart's spike, pointing at the low line (~y 360) as he says "it returned to its low".
// Base-only window (between the hook full-screen and the get-in cutaway); no badge shares it.
export const OVERLAYS_PCH4: OverlayEv[] = [
  { src: staticFile('ovl-pch4-down-arrow.png'), tIn: 11.80, tOut: 13.10, top: 110, left: 510, width: 170, blend: 'normal' },
];

// Code-drawn stat badges, each alone in its window, in the content zone above the caption band.
export const BADGES_PCH4: BadgeEv[] = [
  // over the CMC "Loading data" page: the 6x claim
  { tIn: 6.40, tOut: 8.90, color: PCH4_ACCENT, line1: '6X', line2: 'OVERNIGHT', top: 360 },
  // over the Junction Markets table, BELOW the chart (chart spans ~y 120-480): the community receipt
  { tIn: 22.70, tOut: 24.50, color: GRN, line1: 'COMMUNITY', line2: 'GOT 6X', top: 650 },
];

// SFX: t = event time minus the file's attack_sec (library.json), so the peak lands ON the event frame.
// Every hit sits in a speech gap of the verified word stream, never on a word.
export const SFX_PCH4: Sfx[] = [
  { t: 0.00, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.5, dur: 0.42 },              // thumbnail cut
  { t: 3.27, src: staticFile('sfx/Boom - Big Reveal-short.wav'), vol: 0.28, dur: 0.9, fade: 0.3 },         // hook full-screen: the pump (peak 3.30, gap 3.24-3.38)
  { t: 6.25, src: staticFile('sfx/DING-093.wav'), vol: 0.28, dur: 0.93 },                                 // 6X badge (peak 6.40)
  { t: 11.96, src: staticFile('sfx/ding/sudden-shock-tight.wav'), vol: 0.35, dur: 0.4 },                  // "its low" arrow (peak 12.25, gap 12.20-13.24)
  { t: 12.51, src: staticFile('sfx/Cinematic Whoosh 06.wav'), vol: 0.3, dur: 0.75, fade: 0.25 },          // get-in cutaway (peak 13.10, before "it's" 13.24)
  { t: 18.14, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_3-1s.wav'), vol: 0.3, dur: 0.48 },    // build into the freebie (gap 17.52-18.66)
  { t: 18.36, src: staticFile('sfx/Impacts/Kick_Impact_01-tight.wav'), vol: 0.4, dur: 0.30 },            // freebie full-screen (peak 18.55, ends 18.66 before "It's"; the -short 0.55 s tail masked "It's" -> "That's" 4/4 windows, whisper-swept 2026-11-16)
  { t: 23.58, src: staticFile('sfx/Cash Register-ching.wav'), vol: 0.4, dur: 0.77 },                      // "we got the 6x" (peak 23.70, after the word)
  { t: 24.40, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.35, dur: 0.6 },                  // compute cutaway (peak 24.58, before "well" 24.70)
];

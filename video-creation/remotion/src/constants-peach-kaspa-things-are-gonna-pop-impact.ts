import { staticFile } from 'remotion';
import { type BrollEv, type Sfx } from './_kit';
import type { ThumbDef, BadgeEv, OverlayEv } from './LivestreamShort';

// ─────────────────────────────────────────────────────────────────────────────────────────────
// batch peach / clip #7 - `kaspa-things-are-gonna-pop-impact` (variant: IMPACT)
// clip-plan title: "There's a Bright Future for Kaspa. Just a Lot of Pain Right Now"
// Spine: shorts/peach/render-assets/kaspa-things-are-gonna-pop-impact.mp4 (1080x1920 @25, video 19.440 s, audio 19.470 s, GOP re-encoded).
// Plan of record: shorts/peach/kaspa-things-are-gonna-pop-impact/BROLL-PLAN.md
// Build directives for clip 7 (clip_directives.py --batch peach --clip 7): none. No coverage exemption.
// Flat-namespace check 2026-11-16: no existing PeachKaspaPopImpact / PCH7_ / broll-pch7 / thumb-pch7 / ovl-broll-pch7.
// Same-topic sibling = clip 3 (PeachKaspaThingsPop); every image here is a distinct treatment, none reused.
// ─────────────────────────────────────────────────────────────────────────────────────────────

export const PCH7_FPS = 30;
// 583 frames = 19.433 s; last frame (582) at 19.400 s sits inside both tracks (video 19.440, audio 19.470).
export const PCH7_DURATION = 583;
// MEASURED: row-mean gradient step at 853/854 on t=1,8,15,18.5 s.
export const PCH7_SEAM = 854;
export const PCH7_CAP_Y = 900;
export const PCH7_ACCENT = '#00e5ff'; // Kaspa teal
const YEL = '#ffe600';

export const CLIP_PCH7 = staticFile('kaspa-things-are-gonna-pop-impact.mp4');

// FRAME-0 COVER (ONE frame): a battered Kaspa coin in a storm, sunrise breaking behind it; title code-drawn.
export const THUMB_DEF_PCH7: ThumbDef = {
  img: staticFile('thumb-pch7-kaspa-storm.png'),
  title: 'A BRIGHT\nFUTURE FOR\nKASPA',
  chip: 'JUST A LOT OF PAIN RIGHT NOW',
  chipColor: PCH7_ACCENT,
  titleSize: 120,
};

// B-ROLL: 1.70 + 1.50 + 2.10 + 1.44 = 6.74 s of 19.44 s = 34.7 % b-roll / 65.3 % base. 4 images, each once.
// 3 full-screens (hook, climax, close) = the FIRM cap. Full->full gaps: 4.30->10.10 and 12.20->18.00 (real base breathing room).
export const BROLL_PCH7: BrollEv[] = [
  // HOOK full-screen: "keep getting beaten over the head"
  { src: staticFile('broll-pch7-beaten.png'), tIn: 2.60, tOut: 4.30, mode: 'full' },
  // "smart money keeps building" - content zone
  { src: staticFile('broll-pch7-whale-builds.png'), tIn: 5.42, tOut: 6.92, mode: 'content' },
  // CLIMAX full-screen: "gonna pop, man. things are gonna pop."
  { src: staticFile('broll-pch7-eruption.png'), tIn: 10.10, tOut: 12.20, mode: 'full' },
  // CLOSE full-screen: "always good to buy more kaspa". tOut past the comp end (19.433) so it holds to the last frame.
  { src: staticFile('broll-pch7-piggy.png'), tIn: 18.00, tOut: 19.70, mode: 'full' },
];

// Real alpha PNG (alpha-from-luminance) over the base dex chart: "there's a bright future for kaspa, just a lot of pain". Base-only window.
export const OVERLAYS_PCH7: OverlayEv[] = [
  { src: staticFile('ovl-broll-pch7-bandaged.png'), tIn: 14.60, tOut: 16.90, top: 160, left: 290, width: 500, blend: 'normal' },
];

// Code-drawn stat badge over the base tweet, after the climax full-screen, alone in its window.
export const BADGES_PCH7: BadgeEv[] = [
  { tIn: 12.40, tOut: 14.20, color: YEL, line1: '2027', line2: 'AWESOME', top: 420 },
];

// SFX: t = event time minus the file's attack_sec (library.json), so the peak lands ON the event frame.
export const SFX_PCH7: Sfx[] = [
  { t: 0.00, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.3, dur: 0.20, fade: 0.1 }, // thumbnail cut (whisper-swept 2026-11-16: vol 0.5 / full 0.42 s masked "we've" -> "i've"; 0.3 + tail cut at 0.20 = control 3/3)
  { t: 2.36, src: staticFile('sfx/Punch 1.mp3'), vol: 0.35, dur: 0.6, fade: 0.15 },                    // "beaten over the head" (full, peak 2.60)
  { t: 4.83, src: staticFile('sfx/Cinematic Whoosh 06.wav'), vol: 0.3, dur: 0.75, fade: 0.25 },        // smart-money cutaway (peak 5.42)
  { t: 10.07, src: staticFile('sfx/Boom - Big Reveal-short.wav'), vol: 0.3, dur: 0.9, fade: 0.3 },     // "pop" climax full (peak 10.10)
  { t: 12.25, src: staticFile('sfx/DING-093.wav'), vol: 0.3, dur: 0.93 },                              // 2027 badge (peak 12.40)
  { t: 17.88, src: staticFile('sfx/Cash Register-ching.wav'), vol: 0.4, dur: 0.77 },                   // "buy more kaspa" close (peak 18.00)
];

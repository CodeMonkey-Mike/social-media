import { staticFile } from 'remotion';
import { type BrollEv, type Sfx } from './_kit';
import type { ThumbDef, BadgeEv, OverlayEv } from './LivestreamShort';

// ─────────────────────────────────────────────────────────────────────────────────────────────
// batch peach / clip #3 - `kaspa-things-are-gonna-pop` (variant: FULL)
// clip-plan title: "They Are Getting Ready for Something on Kaspa"
// Spine: shorts/peach/render-assets/kaspa-things-are-gonna-pop.mp4 (1080x1920 @25, video 31.200 s, audio 31.217 s, GOP re-encoded).
// Plan of record: shorts/peach/kaspa-things-are-gonna-pop/BROLL-PLAN.md
// Build directives for clip 3 (clip_directives.py --batch peach --clip 3): none. No coverage exemption.
// Flat-namespace check 2026-11-16: no existing PeachKaspaThingsPop / PCH3_ / broll-pch3 / thumb-pch3 / ovl-broll-pch3.
// ─────────────────────────────────────────────────────────────────────────────────────────────

export const PCH3_FPS = 30;
// 936 frames = 31.200 s; last frame (935) at 31.167 s sits inside both tracks (video 31.200, audio 31.217).
export const PCH3_DURATION = 936;
// MEASURED: row-mean gradient step at 853/854 on t=3,15,20,27 s.
export const PCH3_SEAM = 854;
export const PCH3_CAP_Y = 900;
export const PCH3_ACCENT = '#00e5ff'; // Kaspa teal
const YEL = '#ffe600';

export const CLIP_PCH3 = staticFile('kaspa-things-are-gonna-pop.mp4');

// FRAME-0 COVER (ONE frame): Kaspa coin rising behind a mining warehouse bursting with teal light, title code-drawn.
export const THUMB_DEF_PCH3: ThumbDef = {
  img: staticFile('thumb-pch3-kaspa-ready.png'),
  title: "THEY'RE GETTING\nREADY FOR\nSOMETHING",
  chip: "MARA'S KASPA WALLET WOKE UP",
  chipColor: PCH3_ACCENT,
  titleSize: 112,
};

// B-ROLL: 2.52 + 2.96 + 3.44 + 1.64 = 10.56 s of 31.20 s = 33.8 % b-roll / 66.2 % base. 4 images, each once.
// 3 full-screens (hook payoff, climax, close) = the FIRM cap. B2(content) -> B3(full) butt together (hard cut, no base flash).
export const BROLL_PCH3: BrollEv[] = [
  // HOOK-PAYOFF full-screen: "this could indicate them turning on mining machines again"
  { src: staticFile('broll-pch3-miners-on.png'), tIn: 5.16, tOut: 7.68, mode: 'full' },
  // "smart money keeps building things. they keep investing" - content zone
  { src: staticFile('broll-pch3-smart-money.png'), tIn: 12.10, tOut: 15.06, mode: 'content' },
  // CLIMAX full-screen: "i think things are just gonna pop, man. things are gonna pop."
  { src: staticFile('broll-pch3-pop.png'), tIn: 15.06, tOut: 18.50, mode: 'full' },
  // CLOSE full-screen: "it's always good to buy more kaspa". tOut past the comp end (31.20) so it holds to the last frame, no fade-out flash of base.
  { src: staticFile('broll-pch3-buy-more.png'), tIn: 29.56, tOut: 31.40, mode: 'full' },
];

// Real alpha PNG (alpha-from-luminance) over the base dex chart: "there's a bright future for kaspa". Base-only window.
export const OVERLAYS_PCH3: OverlayEv[] = [
  { src: staticFile('ovl-broll-pch3-sunrise.png'), tIn: 26.40, tOut: 28.90, top: 160, left: 290, width: 500, blend: 'normal' },
];

// Code-drawn stat badge over the base tweet, after the climax full-screen, alone in its window.
export const BADGES_PCH3: BadgeEv[] = [
  { tIn: 18.80, tOut: 20.60, color: YEL, line1: '2027', line2: 'AWESOME', top: 420 },
];

// SFX: t = event time minus the file's attack_sec (library.json), so the peak lands ON the event frame.
export const SFX_PCH3: Sfx[] = [
  { t: 0.00, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.5, dur: 0.42 },          // thumbnail cut
  { t: 5.02, src: staticFile('sfx/Impacts/Impact_Hit_01-2-short.wav'), vol: 0.32, dur: 0.55 },         // miners switch on (full)
  { t: 11.36, src: staticFile('sfx/Cinematic Whoosh 06.wav'), vol: 0.3, dur: 0.75, fade: 0.25 },       // smart-money cutaway (peak 11.95 in the gap before "smart"; tail cut: the 1.2 s version masked "smart", whisper-swept 2026-11-16)
  { t: 14.87, src: staticFile('sfx/Impacts/Kick_Impact_01-short.wav'), vol: 0.4, dur: 0.55 },          // "pop" climax full
  { t: 18.65, src: staticFile('sfx/DING-093.wav'), vol: 0.3, dur: 0.93 },                              // 2027 badge
  { t: 29.44, src: staticFile('sfx/Cash Register-ching.wav'), vol: 0.4, dur: 0.77 },                   // "buy more kaspa" close
];

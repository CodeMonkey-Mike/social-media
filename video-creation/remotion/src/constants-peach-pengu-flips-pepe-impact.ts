import { staticFile } from 'remotion';
import { type BrollEv, type Sfx } from './_kit';
import type { ThumbDef, BadgeEv, OverlayEv } from './LivestreamShort';

// ─────────────────────────────────────────────────────────────────────────────────────────────
// batch peach / clip #6 - `pengu-flips-pepe-impact` (variant: IMPACT)
// clip-plan title: "Pengu to 30 Billion? I'm Really Serious"
// Spine: shorts/peach/render-assets/pengu-flips-pepe-impact.mp4 (1080x1920 @25, video 15.240 s, audio 15.257 s, GOP re-encoded).
// Plan of record: shorts/peach/pengu-flips-pepe-impact/BROLL-PLAN.md
// Build directives for clip 6 (clip_directives.py --batch peach --clip 6): none. No coverage exemption.
// Flat-namespace check 2026-11-16: no existing PeachPenguImpact / PCH6_ / broll-pch6 / thumb-pch6 / ovl-broll-pch6.
// Same-topic sibling = clip 1 (PeachPenguFlipsPepe): every image here is a NEW, distinct asset (no-dup rule).
// ─────────────────────────────────────────────────────────────────────────────────────────────

export const PCH6_FPS = 30;
// 457 frames = 15.233 s; last frame (456) at 15.200 s sits inside both tracks (video 15.240, audio 15.257).
export const PCH6_DURATION = 457;
// Same footage + framing as clip 1 (MEASURED seam 854 there); re-checked on this spine's base frames.
export const PCH6_SEAM = 854;
export const PCH6_CAP_Y = 900;
export const PCH6_ACCENT = '#00e5ff'; // Pengu blue/teal
const YEL = '#ffe600';

export const CLIP_PCH6 = staticFile('pengu-flips-pepe-impact.mp4');

// FRAME-0 COVER (ONE frame): Pengu in front of a gold-coin tower, title code-drawn on top.
export const THUMB_DEF_PCH6: ThumbDef = {
  img: staticFile('thumb-pch6-pengu-30b.png'),
  title: 'PENGU TO\n$30\nBILLION?',
  chip: "I'M REALLY SERIOUS",
  chipColor: PCH6_ACCENT,
  titleSize: 136,
};

// B-ROLL: 1.41 + 1.44 + 2.38 = 5.23 s of 15.23 s = 34.3 % b-roll / 65.7 % base. 3 images, each once.
// QA splice 2026-11-16: B3 moved 11.04 -> 10.86 so it is fully faded in before the 11.00 base cut (frames 330-332 flashed the
// Bloodsport clip); overlay out 10.95 -> 10.84 so it never shares the content zone with B3; B1 out 5.00 -> 4.85 to hold the band.
// 2 full-screens (hook, climax), 3.01 s base gap between them (no base flash). Base content zone:
// 0-11.0 CMC Pudgy Penguins page, 11.0-13.24 out-of-context Bloodsport movie tail (covered by B3), 13.24-end calls table (PENGU +34.8% receipt, left visible).
export const BROLL_PCH6: BrollEv[] = [
  // HOOK full-screen: "pengu is gonna flip pepe"
  { src: staticFile('broll-pch6-dethrone.png'), tIn: 3.44, tOut: 4.85, mode: 'full' },
  // CLIMAX full-screen: "it could get to 30 billion"
  { src: staticFile('broll-pch6-gold-wave.png'), tIn: 7.86, tOut: 9.30, mode: 'full' },
  // "well yeah, i got me some more pengu" - content zone, hard-cuts to the calls-table receipt at 13.24
  { src: staticFile('broll-pch6-cart.png'), tIn: 10.86, tOut: 13.24, mode: 'content' },
];

// Real alpha PNG (alpha-from-luminance) over the base CMC page: "i'm really serious with pengu". Base-only window.
export const OVERLAYS_PCH6: OverlayEv[] = [
  { src: staticFile('ovl-broll-pch6-serious.png'), tIn: 9.50, tOut: 10.84, top: 150, left: 290, width: 500, blend: 'normal' },
];

// Code-drawn stat badge over the base content zone ("it could be like a 100x"), between the two full-screens.
export const BADGES_PCH6: BadgeEv[] = [
  { tIn: 6.50, tOut: 7.80, color: YEL, line1: '100X', line2: '$300M TO $30B', sub: 'THE PENGU CASE', top: 420 },
];

// SFX: t = event time minus the file's attack_sec (library.json), so the peak lands ON the event frame.
export const SFX_PCH6: Sfx[] = [
  { t: 0.00, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.5, dur: 0.42 },        // thumbnail cut
  // QA 2026-11-16 (whisper-verify): crest moved 3.44 -> 3.30, dur 0.55 -> 0.40, full gain kept. At 3.44 it masked "pengu" (read 'Tengoo' 2/2
  // windows); offline sweep vs the encode-matched control: 3/3 'Pangu' at this timing, vol 0.18 alone still failed.
  { t: 3.16, src: staticFile('sfx/Impacts/Impact_Hit_01-2-short.wav'), vol: 0.32, dur: 0.40 },       // hook full-screen (crest 3.30, just ahead of the 3.44 cut)
  { t: 6.35, src: staticFile('sfx/DING-093.wav'), vol: 0.25, dur: 0.93 },                            // 100X badge (crest 6.50)
  { t: 7.67, src: staticFile('sfx/Impacts/Kick_Impact_01-short.wav'), vol: 0.4, dur: 0.55 },         // 30B climax (crest 7.86)
  { t: 9.25, src: staticFile('sfx/kinetic-text/fast-swoosh.wav'), vol: 0.22, dur: 0.57 },            // serious-pengu overlay in (crest 9.50)
  { t: 10.92, src: staticFile('sfx/Cash Register-ching.wav'), vol: 0.35, dur: 0.77 },                // "got me some more" cart (crest 11.04)
  // (receipt whoosh at 13.06 DELETED in QA 2026-11-16: decoration that masked "i think" -> 'pink'/'will think' 2/2 windows; without it = control.)
];

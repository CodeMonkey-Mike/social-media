import { staticFile } from 'remotion';
import { type BrollEv, type Sfx } from './_kit';
import type { ThumbDef, BadgeEv, OverlayEv } from './LivestreamShort';

// ─────────────────────────────────────────────────────────────────────────────────────────────
// batch downtober / clip #2 - `tao-3000-is-not-the-ceiling` (variant: FULL)
// clip-plan title: "TAO to 3000? That Is Not the Ceiling"
// "TAO going to 3000. Yeah. Hell yeah. I totally agree. TAO going to three. I think TAO can go a lot more than
//  that in the long run, a lot more than that in the long run, we just got some craziness going on right now.
//  We should be going into one hell of a fantastic economic expansion. Very, very soon."
// Spine: shorts/downtober/render-assets/tao-3000-is-not-the-ceiling.mp4 (1080x1920 @25, video 19.28 s, audio 19.29 s,
// GOP 25 / no B-frames, staged by setup_render_assets.py).
// Plan of record: shorts/downtober/tao-3000-is-not-the-ceiling/BROLL-PLAN.md
// Build directives for clip 2 (clip_directives.py --batch downtober --clip 2): none. No coverage exemption.
// Flat-namespace check 2026-10-15: no existing DowntoberTao3000NotCeiling / DT2_ / broll-dt2 / thumb-dt2 / ovl-dt2.
// ─────────────────────────────────────────────────────────────────────────────────────────────

export const DT2_FPS = 30;
// 578 frames = 19.267 s; last frame (577) at 19.233 s sits inside both tracks (video 19.28, audio 19.29).
// Last word "soon." runs to the end of the spine (the upstream cut ends inside its decay).
export const DT2_DURATION = 578;
const END = DT2_DURATION / DT2_FPS;
// MEASURED on this spine: row-mean gradient step at the 853/854 boundary on 6 of 6 frames (t=1,4,7,10,13,16).
export const DT2_SEAM = 854;
export const DT2_CAP_Y = 960;
// TAO accent: electric green (the Bittensor mark is mono; green = up/positive house colour).
export const DT2_ACCENT = '#39ff14';
const RED = '#ff5252';
const GOLD = '#ffc629';

export const CLIP_DT2 = staticFile('tao-3000-is-not-the-ceiling.mp4');

// FRAME-0 COVER (ONE frame). Photoreal oversized TAO coin (Bittensor reference attached), top third empty for title.
export const THUMB_DEF_DT2: ThumbDef = {
  img: staticFile('thumb-dt2-cover.png'),
  title: 'TAO TO\n$3,000?',
  chip: 'NOT THE CEILING',
  chipColor: DT2_ACCENT,
  titleSize: 150,
};

// B-ROLL: 1.70 + 2.14 + 2.26 = 6.10 s of 19.267 s = 31.7 % b-roll / 68.3 % base. 3 images, each once.
// 2 full-screens (hook + climax), inside the FIRM cap of 3, 11 s apart (no full->full flash).
// Base = TradingView MEMECO-dominance chart + the burned-in chat line "tao going to 3000" (the hook receipt).
export const BROLL_DT2: BrollEv[] = [
  // HOOK full-screen: "Yeah. Hell yeah." - colossal TAO coin over a skyline in green fireworks.
  { src: staticFile('broll-dt2-hook-tao-fireworks.png'), tIn: 3.30, tOut: 5.00, mode: 'full' },
  // TITLE beat: "I think TAO can go a lot more than that" - TAO coin smashing up through a glass ceiling. Content zone.
  { src: staticFile('broll-dt2-glass-ceiling.png'), tIn: 6.56, tOut: 8.70, mode: 'content' },
  // CLIMAX full-screen: "fantastic economic expansion." - boom city, TAO coin rising like the sun. Out before "Very".
  { src: staticFile('broll-dt2-climax-expansion.png'), tIn: 16.14, tOut: 18.40, mode: 'full' },
];

// ALPHA OVERLAY (glow-on-black -> alpha-from-luminance, true RGBA -> blend 'normal' so it shows over the LIGHT chart).
// "a lot more than that in the long run" (the doubling). Right side of the content zone, clear of the chat banner
// (y 735-775), the caption band (~920-1000) and every badge window.
export const OVERLAYS_DT2: OverlayEv[] = [
  { src: staticFile('ovl-dt2-green-arrow.png'), tIn: 9.58, tOut: 11.16, top: 150, left: 640, width: 380, blend: 'normal' },
];

// BADGES (code-drawn), never sharing a window with each other, the overlay, or a b-roll image.
// top 400 = badge centre; box ~300-500, above the chat banner (735) and the 854 seam.
export const BADGES_DT2: BadgeEv[] = [
  { tIn: 0.40, tOut: 2.60, color: DT2_ACCENT, line1: '$3,000', sub: 'TAO PRICE CALL', top: 400 },
  { tIn: 12.12, tOut: 13.85, color: RED, line1: 'CRAZINESS', sub: 'RIGHT NOW', top: 400 },
  // runs past END on purpose so it holds full opacity to the last frame (no fade-out on the hard-out)
  { tIn: 18.42, tOut: END + 0.3, color: GOLD, line1: 'VERY SOON', sub: 'ECONOMIC EXPANSION', top: 400 },
];

// SFX: every `t` = cue - crest so the crest lands on the cut/badge frame.
// Crests (5 ms peak-envelope @16 kHz, measured on the library files 2026-10-15):
//   transition_rapid_whoosh 0.967 s crest 0.165 · -tight 0.420 s crest 0.165 · card-impact-layered 1.450 s crest 0.030
//   DING-093 0.930 s crest 0.150 · ding/sudden-shock-tight 0.400 s crest 0.290
//   Riser Sound Effect-2s 2.141 s crest 2.015 · Boom - Big Reveal-short 1.050 s crest 0.030
export const SFX_DT2: Sfx[] = [
  // frame-0 cover cut to the base, low under "TAO going"
  { t: 0.033, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.12, dur: 1.00 },
  // hook reveal hit on the 3.30 full-screen cut
  { t: 3.27, src: staticFile('sfx/Impacts/card-impact-layered.wav'), vol: 0.14, dur: 0.90 },
  // whoosh into the glass-ceiling cutaway at 6.56
  { t: 6.395, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.42 },
  // ding on the green-arrow overlay (9.58)
  { t: 9.43, src: staticFile('sfx/DING-093.wav'), vol: 0.12, dur: 0.45 },
  // shock sting on the CRAZINESS badge (12.12)
  { t: 11.83, src: staticFile('sfx/ding/sudden-shock-tight.wav'), vol: 0.10, dur: 0.40 },
  // riser builds INTO the climax: crest lands on the 16.14 cut
  { t: 14.125, src: staticFile('sfx/Riser Sound Effect-2s.wav'), vol: 0.50, dur: 2.14 },
  // THE payoff boom on the climax cut (16.14)
  { t: 16.11, src: staticFile('sfx/Boom - Big Reveal-short.wav'), vol: 0.18, dur: 1.05 },
  // ding on the VERY SOON badge (18.42)
  { t: 18.27, src: staticFile('sfx/DING-093.wav'), vol: 0.12, dur: 0.45 },
];

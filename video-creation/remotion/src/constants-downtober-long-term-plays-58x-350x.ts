import { staticFile } from 'remotion';
import { type BrollEv, type Sfx } from './_kit';
import type { ThumbDef, BadgeEv, OverlayEv } from './LivestreamShort';

// ─────────────────────────────────────────────────────────────────────────────────────────────
// batch downtober / clip #3 - `long-term-plays-58x-350x` (variant: FULL)
// clip-plan title: "58x on Velvet, 350x on LAB: Long Term Plays Only"
// "They take a long time when they move. We did the 58x on Velvet in June, and I called it in July of last year,
//  took 11 months. Called $LAB in October. We DCA'd a little bit more in December because it went down December,
//  and then it does a 350x in May. Long-term play, not these crazy things."
// Spine: shorts/downtober/render-assets/long-term-plays-58x-350x.mp4 (1080x1920 @25, video 17.80 s, audio 17.801 s,
// GOP 25 / no B-frames, staged by setup_render_assets.py).
// Plan of record: shorts/downtober/long-term-plays-58x-350x/BROLL-PLAN.md
// Build directives for clip 3 (clip_directives.py --batch downtober --clip 3): none. No coverage exemption.
// Flat-namespace check 2026-10-15: no existing DowntoberLongTermPlays / DT3_ / broll-dt3 / thumb-dt3 / ovl-dt3.
// ─────────────────────────────────────────────────────────────────────────────────────────────

export const DT3_FPS = 30;
// 534 frames = 17.800 s; last frame (533) at 17.767 s sits inside both tracks (video 17.80, audio 17.801).
export const DT3_DURATION = 534;
const END = DT3_DURATION / DT3_FPS;
// MEASURED on this spine: row-mean gradient step at the 853/854 boundary on 6 of 6 frames (t=1,4,7,10,13,16).
export const DT3_SEAM = 854;
export const DT3_CAP_Y = 960;
// LAB accent: the lime of the real LAB flask mark (schedule-tweets/images/reference/LAB.png).
export const DT3_ACCENT = '#a6ff00';
const YELLOW = '#ffe600';

export const CLIP_DT3 = staticFile('long-term-plays-58x-350x.mp4');

// FRAME-0 COVER (ONE frame). Photoreal oversized LAB coin (LAB reference attached), top third empty for the title.
export const THUMB_DEF_DT3: ThumbDef = {
  img: staticFile('thumb-dt3-cover.png'),
  title: '350X\nON $LAB',
  chip: 'LONG TERM PLAYS ONLY',
  chipColor: DT3_ACCENT,
  titleSize: 130,
};

// B-ROLL: 2.00 + 1.77 + 1.94 = 5.71 s of 17.80 s = 32.1 % b-roll / 67.9 % base. 3 images, each once.
// 2 full-screens (hook + climax), inside the FIRM cap of 3, 9.3 s apart (no full->full flash).
// Every cut sits on a MEASURED word onset (RMS, 20 ms): "58X" 2.12, "Called" 7.02, "350X" 13.36.
// Base = a DexScreener chart page (off-message for this topic) + Mike's webcam; it still shows in real stretches.
export const BROLL_DT3: BrollEv[] = [
  // HOOK full-screen: "58x on Velvet in June," - a violet Velvet coin (Velvet reference) blasting upward. Out on the
  // "June," -> "and" trough (4.08-4.22).
  { src: staticFile('broll-dt3-hook-velvet-launch.png'), tIn: 2.10, tOut: 4.10, mode: 'full' },
  // "Called $LAB in October." - LAB coin (LAB reference) on autumn leaves under a spotlight. Content zone only.
  { src: staticFile('broll-dt3-called-lab-october.png'), tIn: 7.033, tOut: 8.80, mode: 'content' },
  // CLIMAX full-screen: "350x in May." - colossal LAB coin erupting out of a bubbling flask. Out on the 15.34 trough
  // before "Long".
  { src: staticFile('broll-dt3-climax-lab-eruption.png'), tIn: 13.367, tOut: 15.30, mode: 'full' },
];

// ALPHA OVERLAYS (glow-on-black -> alpha-from-luminance, true RGBA -> blend 'normal').
// Never sharing a window with each other, a badge, or a b-roll image; all inside the content zone (0..854),
// clear of the caption band (~920-1000).
export const OVERLAYS_DT3: OverlayEv[] = [
  // "and I called it in July of last year, took 11 months." - golden hourglass, left side of the chart.
  { src: staticFile('ovl-dt3-hourglass.png'), tIn: 4.20, tOut: 6.96, top: 110, left: 90, width: 300, blend: 'normal' },
  // "it went down December," - neon red down-arrow, right side.
  { src: staticFile('ovl-dt3-red-arrow.png'), tIn: 10.86, tOut: 11.80, top: 130, left: 700, width: 300, blend: 'normal' },
];

// BADGES (code-drawn). top 400 = badge centre; box ~300-500, inside the content zone above the 854 seam.
export const BADGES_DT3: BadgeEv[] = [
  // "We DCA'd a little bit more in December"
  { tIn: 9.00, tOut: 10.45, color: YELLOW, line1: 'DCA', sub: 'ADDED MORE IN DECEMBER', top: 400 },
  // "Long-term play, not these crazy things." Runs past END on purpose so it holds full opacity to the last frame.
  { tIn: 15.38, tOut: END + 0.3, color: DT3_ACCENT, line1: 'LONG TERM PLAY', sub: 'NOT THESE CRAZY THINGS', top: 400 },
];

// SFX: every `t` = target - crest so the crest lands on the cut/overlay/badge frame.
// Crests (5 ms peak-envelope @16 kHz, measured on the library files 2026-10-15):
//   transition_rapid_whoosh 0.967 s crest 0.165 · -tight 0.420 s crest 0.165 · card-impact-layered 1.450 s crest 0.030
//   DING-093 0.930 s crest 0.150 · Cash Register 2.142 s crest 0.645 · ding/sudden-shock-tight 0.400 s crest 0.290
//   Riser Sound Effect-2s 2.141 s crest 2.015 · Boom - Big Reveal-short 1.050 s crest 0.030
export const SFX_DT3: Sfx[] = [
  // frame-0 cover cut to the base, low under "They take"
  { t: 0.033, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.12, dur: 1.00 },
  // whoosh INTO the hook full-screen (crest on the 2.10 cut)
  { t: 1.935, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.42 },
  // hook reveal hit on the 2.10 cut
  { t: 2.07, src: staticFile('sfx/Impacts/card-impact-layered.wav'), vol: 0.12, dur: 0.70 },
  // ding as the hourglass pops (4.20)
  { t: 4.05, src: staticFile('sfx/DING-093.wav'), vol: 0.10, dur: 0.45 },
  // whoosh into the LAB cutaway (7.033). vol 0.06, NOT 0.12: at 0.12 its crest sits on "Called" (onset 7.02) and the
  // offline mix read "Cold lab" on 2 of 5 staggered windows where the encode-matched control read "called". Timing was
  // tried first and lost (dur 0.25 truncation: still "Cold"; crest moved to 6.965: "For/Ford lab"); 0.06 matched the
  // control on 5/5 windows. A decoration cue, not a payoff hit (_qa/sweep_res.json).
  { t: 6.868, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.06, dur: 0.42 },
  // cash register on the DCA badge (crest 9.00)
  { t: 8.355, src: staticFile('sfx/Cash Register.mp3'), vol: 0.10, dur: 1.20 },
  // shock sting as the red arrow drops (10.86)
  { t: 10.57, src: staticFile('sfx/ding/sudden-shock-tight.wav'), vol: 0.10, dur: 0.40 },
  // riser builds INTO the climax: crest lands on the 13.367 cut
  { t: 11.352, src: staticFile('sfx/Riser Sound Effect-2s.wav'), vol: 0.50, dur: 2.14 },
  // THE payoff boom on the climax cut (13.367)
  { t: 13.337, src: staticFile('sfx/Boom - Big Reveal-short.wav'), vol: 0.18, dur: 1.05 },
  // ding on the LONG TERM PLAY badge (15.38)
  { t: 15.23, src: staticFile('sfx/DING-093.wav'), vol: 0.12, dur: 0.45 },
];

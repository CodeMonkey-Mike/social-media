import { staticFile } from 'remotion';
import { type BrollEv, type Sfx } from './_kit';
import type { ThumbDef, BadgeEv, OverlayEv } from './LivestreamShort';

// ─────────────────────────────────────────────────────────────────────────────────────────────
// batch peach / clip #2 - `calls-still-up-after-the-dump` (variant: FULL)
// clip-plan title: "Everything Is Low Right Now. These Calls Are Still Up"
// "I never imagined these things would be so low right now. ORBIO, how's ORBIO? ORBIO was one of my excellent
//  plays... Still up from my call. Holy crap... I did my Pieverse video. Pieverse doing pretty good, $1.91...
//  almost unaffected from the dumps... If you were in my group you'd be up 10x on this right now."
// Spine: shorts/peach/render-assets/calls-still-up-after-the-dump.mp4 (1080x1920 @25, video 39.36 s, audio 39.41 s,
// GOP re-encoded by setup_render_assets.py).
// Plan of record: shorts/peach/calls-still-up-after-the-dump/BROLL-PLAN.md
// Build directives for clip 2 (clip_directives.py --batch peach --clip 2): none. No coverage exemption.
// Flat-namespace check 2026-11-16: no existing PeachCallsStillUp / PCH2_ / broll-pch2 / thumb-pch2 / ovl-pch2.
// ─────────────────────────────────────────────────────────────────────────────────────────────

export const PCH2_FPS = 30;
// 1180 frames = 39.333 s; last frame (1179) at 39.30 s sits inside both tracks (video 39.36, audio 39.41).
export const PCH2_DURATION = 1180;
const END = PCH2_DURATION / PCH2_FPS;
// MEASURED on this spine: row-mean gradient step at the 853/854 boundary on 6 of 6 frames (t=2,9,16,24,30,37).
export const PCH2_SEAM = 854;
export const PCH2_CAP_Y = 960;
// "still up" = the house green-for-up colour.
export const PCH2_ACCENT = '#39ff14';
const YEL = '#ffe600';
const GOLD = '#ffc629';

export const CLIP_PCH2 = staticFile('calls-still-up-after-the-dump.mp4');

// FRAME-0 COVER (ONE frame). Green coin blasting out of a crater of smashed red candles; top 40% empty for the title.
export const THUMB_DEF_PCH2: ThumbDef = {
  img: staticFile('thumb-pch2-cover.png'),
  title: 'EVERYTHING\nDUMPED.\nTHESE ARE\nSTILL UP',
  chip: 'MY CALLS',
  chipColor: PCH2_ACCENT,
  titleSize: 112,
};

// B-ROLL: 2.20 + 2.10 + 1.98 + 1.40 + 2.06 + 2.17 = 11.91 s of 39.33 s = 30.3 % b-roll / 69.7 % base. 6 images, each once.
// 3 full-screens (hook, Pieverse transition, climax) = the FIRM cap, 18 s apart (no full->full flash).
export const BROLL_PCH2: BrollEv[] = [
  // HOOK full-screen: "imagined that these ... things would be so low right now" - a crypto city after the crash.
  { src: staticFile('broll-pch2-hook-crash.png'), tIn: 0.80, tOut: 3.00, mode: 'full' },
  // "Holy crap. Yeah" - the one green coin standing while red candles crash around it. Content zone.
  { src: staticFile('broll-pch2-holy-crap-green.png'), tIn: 11.50, tOut: 13.60, mode: 'content' },
  // TRANSITION full-screen: "I did my Pieverse video" (covers the chart-loading frames). Pieverse reference attached.
  { src: staticFile('broll-pch2-pieverse-studio.png'), tIn: 19.32, tOut: 21.30, mode: 'full' },
  // "Yeah, it's hanging in there." Pieverse cat hanging onto a ledge. Content zone.
  { src: staticFile('broll-pch2-hanging-in-there.png'), tIn: 24.60, tOut: 26.00, mode: 'content' },
  // "like almost unaffected from the dumps yesterday" - cat in a shield bubble, red candles bouncing off. Content zone.
  { src: staticFile('broll-pch2-unaffected-shield.png'), tIn: 27.84, tOut: 29.90, mode: 'content' },
  // CLIMAX full-screen: "if you were in my group you'd be up 10x on this right now" - held to the last frame.
  { src: staticFile('broll-pch2-climax-10x.png'), tIn: 37.16, tOut: END + 0.3, mode: 'full' },
];

// ALPHA OVERLAY (glow-on-black -> alpha-from-luminance, true RGBA -> blend 'normal' so it shows over the LIGHT CMC page).
// "when you see a coin like this man, that's awesome": right side of the content zone, over the chart, clear of the
// caption band (~920-1000) and every badge window.
export const OVERLAYS_PCH2: OverlayEv[] = [
  { src: staticFile('ovl-pch2-green-arrow.png'), tIn: 33.30, tOut: 35.40, top: 140, left: 620, width: 400, blend: 'normal' },
];

// BADGES (code-drawn; ORBIO has no reference, so its ticker lives here as type, never as a generated logo).
// Never sharing a window with each other, the overlay, or a content-zone b-roll image. top 400 = badge centre.
export const BADGES_PCH2: BadgeEv[] = [
  { tIn: 4.00, tOut: 6.00, color: YEL, line1: 'ORBIO', sub: 'ONE OF MY CALLS', top: 400 },
  { tIn: 16.06, tOut: 18.40, color: PCH2_ACCENT, line1: 'STILL UP', sub: 'FROM MY CALL', top: 400 },
  { tIn: 22.84, tOut: 24.50, color: YEL, line1: '$1.91', sub: 'PIEVERSE RIGHT NOW', top: 400 },
  // over the climax image (no text in it); runs past END so it holds to the last frame
  { tIn: 38.06, tOut: END + 0.3, color: GOLD, line1: '10X', sub: 'IN MY GROUP', top: 400 },
];

// SFX: every `t` = cue - crest so the crest lands on the cut/badge frame.
// Crests (downtober 2026-10-15 measurements + library.json attack_sec):
//   transition_rapid_whoosh 0.165 · -tight 0.165 · card-impact-layered 0.030 · DING-093 0.150
//   ding/sudden-shock-tight 0.290 · Riser Sound Effect-2s 2.015 · Boom - Big Reveal-short 0.030 · Cash Register-ching 0.120
export const SFX_PCH2: Sfx[] = [
  // frame-0 cover cut to the base
  { t: 0.033, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.12, dur: 1.00 },
  // hook full-screen hit (0.80)
  { t: 0.77, src: staticFile('sfx/Impacts/card-impact-layered.wav'), vol: 0.14, dur: 0.90 },
  // ORBIO badge pop (4.00)
  { t: 3.85, src: staticFile('sfx/DING-093.wav'), vol: 0.10, dur: 0.45 },
  // whoosh into the holy-crap cutaway (11.50)
  { t: 11.335, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.42 },
  // (STILL UP 16.06 shock sting DELETED in post-render QA: it masked "it's" before "still up" at every gain/timing
  //  tried (best 1/4 vs 2/4 with no cue, render-cancel test); decoration, not a payoff hit -> deleted per SKILL row 7.)
  // major transition whoosh into the Pieverse full-screen (19.32)
  { t: 19.155, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.14, dur: 1.00 },
  // ching on the $1.91 badge (22.84)
  { t: 22.72, src: staticFile('sfx/Cash Register-ching.wav'), vol: 0.12, dur: 0.77 },
  // whooshes into the two Pieverse cutaways (24.60, 27.84)
  { t: 24.435, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.42 },
  // dur 0.42 -> 0.25 (post-render QA): the tail masked the repeated "almost unaffected" 1/4; the 0.25 cut = 4/4 at full gain
  { t: 27.675, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.25 },
  // (green-arrow overlay 33.30 DING DELETED in post-render QA: it sat on "a coin" and the render read "corn" 4/4 at
  //  dur 0.45 and still 2/4 at dur 0.25; cancelling it out of the render's own audio = "coin" 4/4. Decoration, not a
  //  payoff hit -> deleted per SKILL row 7. The overlay pops silently.)
  // riser builds INTO the climax: crest lands on the 37.16 cut
  { t: 35.145, src: staticFile('sfx/Riser Sound Effect-2s.wav'), vol: 0.40, dur: 2.14 },
  // THE payoff boom on the climax cut (37.16)
  { t: 37.13, src: staticFile('sfx/Boom - Big Reveal-short.wav'), vol: 0.18, dur: 1.05 },
  // money ching on the 10X badge (38.06)
  { t: 37.94, src: staticFile('sfx/Cash Register-ching.wav'), vol: 0.12, dur: 0.77 },
];

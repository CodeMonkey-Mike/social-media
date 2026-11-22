import { staticFile } from 'remotion';
import { type BrollEv, type Sfx } from './_kit';
import type { ThumbDef, BadgeEv, OverlayEv } from './LivestreamShort';

// ─────────────────────────────────────────────────────────────────────────────────────────────
// batch ripping / clip #2 - `calls-ripping-on-a-red-day` (variant: FULL)
// clip-plan title: "Only 3 Green Bubbles Out of 100, and My Plays Are Ripping Again"
// "The crazy thing is, the entire market is dumping right now. Look at all this red. This entire page has only three
//  green bubbles out of 100... Pippin, we did an 89x at the beginning of this year... Velvet, 58x in June... it knows
//  that I'm going live... All these plays in my community are pumping. Everybody else is dumping... that's why
//  CodeMonkey Mike has the greatest crypto community on the planet. Hell yeah, man."
// Spine: shorts/ripping/render-assets/calls-ripping-on-a-red-day.mp4 (1080x1920 @25, video 41.44 s, audio 41.42 s,
// GOP re-encoded by setup_render_assets.py).
// Plan of record: shorts/ripping/calls-ripping-on-a-red-day/BROLL-PLAN.md
// Build directives for clip 2 (clip_directives.py --batch ripping --clip 2): none. No coverage exemption.
// Flat-namespace check 2026-11-18: no existing RippingCallsRedDay / RIP2_ / broll-rip2 in remotion/src or Root.tsx.
// ─────────────────────────────────────────────────────────────────────────────────────────────

// render_short.py renders and verifies at 30 fps; the 25 fps spine is resampled by OffthreadVideo.
export const RIP2_FPS = 30;
// 1242 frames = 41.40 s; last frame (1241) at 41.367 s sits inside both tracks (video 41.44, audio 41.42).
export const RIP2_DURATION = 1242;
const END = RIP2_DURATION / RIP2_FPS;
// MEASURED on this spine: row-mean gradient step at the 853/854 boundary on 7 of 7 frames (t=2,6,14,19,22,30,41).
export const RIP2_SEAM = 854;
// Caption band just under the seam: eyes sit at y~1290, so 960 is forehead/hair, never the eyes.
export const RIP2_CAP_Y = 960;
// pump vs dump: house green-for-up.
export const RIP2_ACCENT = '#39ff14';
const YEL = '#ffe600';
const VELVET = '#c9a2ff';

export const CLIP_RIP2 = staticFile('calls-ripping-on-a-red-day.mp4');

// FRAME-0 COVER (ONE frame). Sea of red crashing bubbles, exactly three green bubbles ripping up; top 36% empty.
export const THUMB_DEF_RIP2: ThumbDef = {
  img: staticFile('broll-rip2-thumb.png'),
  title: 'ONLY 3\n<span style="color:#39ff14">GREEN</span>\nOUT OF 100',
  chip: 'MY PLAYS ARE RIPPING',
  chipColor: RIP2_ACCENT,
  titleSize: 118,
};

// B-ROLL: 2.30 + 2.30 + 2.02 + 2.22 + 2.60 + 2.96 = 14.40 s of 41.40 s = 34.8 % b-roll / 65.2 % base. 6 images, each once.
// 3 full-screens (hook + the butted climax pair) = the FIRM cap; B5->B6 hard-cut (adjacent), B1 is 30 s from B5.
// MEASURED base events this must hide: celebrity photo insert (webcam gone) from spine 34.76, black frames
// 39.56-39.92, base back at 39.96. B5 tIn 34.56 -> fully opaque by 34.68 (0.12 s fade); B6 tOut 40.12 -> its fade
// starts at 40.00, after the black.
export const BROLL_RIP2: BrollEv[] = [
  // HOOK full-screen: "the entire market is dumping right now" - BTC + ETH plunging through red candles.
  { src: staticFile('broll-rip2-hook-dump.png'), tIn: 1.50, tOut: 3.80, mode: 'full' },
  // "Pippin was freaking ripping and suddenly is ripping again" - generic battered green coin blasting back up
  // (Pippin has NO reference on disk: no invented logo).
  { src: staticFile('broll-rip2-ripping-again.png'), tIn: 16.00, tOut: 18.30, mode: 'content' },
  // "Velvet, another one of my plays is pumping" - Velvet V coin up a green candle staircase (velvet.png ref).
  // Hard-cut from the previous beat; also hides the low-value dark terminal page 18.12-20.32.
  { src: staticFile('broll-rip2-velvet-pump.png'), tIn: 18.30, tOut: 20.32, mode: 'content' },
  // "it knows that I'm going live and it's going up" - Velvet coin character winks at the stream camera.
  { src: staticFile('broll-rip2-velvet-live.png'), tIn: 27.40, tOut: 29.62, mode: 'content' },
  // CLIMAX 1/2 full-screen: "holy crap, and that's why CodeMonkey Mike" (mike-profile-logo.jpg ref). Covers the
  // celebrity-photo insert.
  { src: staticFile('broll-rip2-codemonkey.png'), tIn: 34.56, tOut: 37.16, mode: 'full' },
  // CLIMAX 2/2 full-screen: "has the greatest crypto community on the planet". Covers the black frames.
  { src: staticFile('broll-rip2-community.png'), tIn: 37.16, tOut: 40.12, mode: 'full' },
];

// ALPHA OVERLAY (glow-on-black -> alpha-from-luminance in place, true RGBA -> blend 'normal').
// "and I think this thing is pumping again": right side of the Velvet bubble map, over IRYS/ELF, leaving the
// VELVET bubble (left) readable. y 440-820, clear of the caption band (~920-1000) and every badge window.
export const OVERLAYS_RIP2: OverlayEv[] = [
  { src: staticFile('broll-rip2-ovl-surge.png'), tIn: 24.10, tOut: 26.60, top: 440, left: 660, width: 380, blend: 'normal' },
];

// BADGES (code-drawn; Pippin has no reference, so its ticker lives here as type). top 150 = the content zone's top
// band: over red bubbles on the maps (the 3 green bubbles sit mid-zone) and over the table title on the calls
// table (the highlighted 89x receipt row sits at y~468). Never sharing a window with each other, the overlay,
// the pump/dump card, or any b-roll.
export const BADGES_RIP2: BadgeEv[] = [
  { tIn: 7.68, tOut: 10.00, color: RIP2_ACCENT, line1: 'ONLY 3 GREEN', sub: 'OUT OF 100', top: 150 },
  { tIn: 12.70, tOut: 15.40, color: YEL, line1: 'PIPPIN 89X', sub: 'START OF THIS YEAR', top: 150 },
  { tIn: 20.90, tOut: 23.80, color: VELVET, line1: 'VELVET 58X', sub: 'IN JUNE', top: 150 },
];

// PUMP/DUMP CARD (code-drawn, rendered by the comp): left half pops on "all these plays ... pumping", right half on
// "everybody else is dumping". Centre y 700 (600-800): under the CMC Velvet chart (y 40-520), above the captions.
export const VS_CARD_RIP2 = { tIn: 30.10, tInRight: 32.42, tOut: 33.90, top: 700 };

// SFX: every `t` = cue - crest so the crest lands on the cut/badge frame.
// Crests (downtober 2026-10-15 measurements + library.json attack_sec, as used by peach clip 2):
//   transition_rapid_whoosh 0.165 · -tight 0.165 · card-impact-layered 0.030 · DING-093 0.150
//   Riser Sound Effect-2s 2.015 · Boom - Big Reveal-short 0.030 · Cash Register-ching 0.120
export const SFX_RIP2: Sfx[] = [
  // frame-0 cover cut to the base
  { t: 0.033, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.12, dur: 1.00 },
  // hook full-screen crash (1.50)
  { t: 1.47, src: staticFile('sfx/Impacts/card-impact-layered.wav'), vol: 0.14, dur: 0.90 },
  // "only 3 green" badge pop (7.68)
  { t: 7.53, src: staticFile('sfx/DING-093.wav'), vol: 0.10, dur: 0.45 },
  // whoosh into the ripping-again cutaway (16.00). Post-render QA: "Pippin was" read "Pip, it was" in 3/6 staggered
  // windows on the render vs 6/6 on the encode-matched control, BUT an audio-only re-render with this cue deleted read
  // the SAME 3/6, the offline mix of this exact cue onto the control read 3/3 "Pippin", and render vs control in
  // 14-18 s cross-correlate at lag 0 / r=1.0 with a -72 dB residual (53 dB under the VO). Decoder variance, not a
  // masker -> cue kept as planned. The whole-file pass on the render reads "Pippin was freaking ripping".
  { t: 15.835, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.42 },
  // money ching on "Velvet ... pumping" cut (18.30)
  { t: 18.18, src: staticFile('sfx/Cash Register-ching.wav'), vol: 0.12, dur: 0.77 },
  // whoosh into the "it knows I'm going live" joke (27.40)
  { t: 27.235, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.25 },
  // riser builds INTO the climax: crest lands on the 34.56 cut
  { t: 32.545, src: staticFile('sfx/Riser Sound Effect-2s.wav'), vol: 0.40, dur: 2.14 },
  // THE payoff boom on the climax cut (34.56)
  { t: 34.53, src: staticFile('sfx/Boom - Big Reveal-short.wav'), vol: 0.18, dur: 1.05 },
  // whoosh on the climax hard cut (37.16)
  { t: 36.995, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.42 },
];

export { END as RIP2_END_S };

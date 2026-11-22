import { staticFile } from 'remotion';
import { type BrollEv, type Sfx } from './_kit';
import type { ThumbDef, BadgeEv } from './LivestreamShort';

// ─────────────────────────────────────────────────────────────────────────────────────────────
// batch ripping / clip #3 - `ai-jobs-own-assets` (variant: FULL)
// clip-plan title: "It Will Be Crazy Hard to Get Ahead If You Don't Have Assets"
// "If you have a robot in your house and it has to do repair... order parts and pay things... you have to invest in
//  assets because we're going to see an asset driven future... it's going to be crazy hard to get ahead if you don't
//  have assets... you'll be stuck on UBI... that's why anybody's watching this channel, you're on the right path, man."
// Spine: shorts/ripping/render-assets/ai-jobs-own-assets.mp4 (1080x1920 @25, video 40.28 s, audio 40.285 s).
// Plan of record: shorts/ripping/ai-jobs-own-assets/BROLL-PLAN.md (images visual-qa PASS 6/6, broll-visual-qa.md).
// Build directives for clip 3 (clip_directives.py --batch ripping --clip 3): none. No coverage exemption.
// Flat-namespace check 2026-11-18: no existing RippingAiJobsOwnAssets / RIP3_ / constants-ripping-ai-jobs-own-assets.
// ─────────────────────────────────────────────────────────────────────────────────────────────

// render_short.py renders and verifies at 30 fps; the 25 fps spine is resampled by OffthreadVideo.
export const RIP3_FPS = 30;
// 1208 frames = 40.267 s; last frame (1207) at 40.233 s sits inside both tracks (video 40.28, audio 40.285).
export const RIP3_DURATION = 1208;
const END = RIP3_DURATION / RIP3_FPS;
// MEASURED on this spine: row-mean gradient step at the 853/854 boundary on 7 of 7 frames (t=1,5,13,18,28,35,39.5).
export const RIP3_SEAM = 854;
// Caption band just under the seam: eyes sit at y~1290-1400, so 960 is forehead/hair, never the eyes.
export const RIP3_CAP_Y = 960;
// assets / dividends / "get ahead" = GOLD; red only for the UBI stamp.
export const RIP3_ACCENT = '#FFC83D';
export const RIP3_RED = '#FF3B3B';

export const CLIP_RIP3 = staticFile('ai-jobs-own-assets.mp4');

// FRAME-0 COVER (ONE frame). Home robot with a wrench + blank gold card, empty-pocketed faceless figure; the image's
// top ~33 % (0-633 px) is dark empty wall, the code-drawn title (top 240) + chip sit inside it.
export const THUMB_DEF_RIP3: ThumbDef = {
  img: staticFile('broll-rip3-thumb.png'),
  title: 'NO ASSETS?\n<span style="color:#FFC83D">YOU\'RE STUCK</span>',
  chip: 'THE ROBOTS ARE COMING',
  chipColor: RIP3_ACCENT,
  titleSize: 118,
};

// B-ROLL: 2.46 + 2.50 + 2.68 + 3.06 + 2.21 = 12.91 s of 40.27 s = 32.1 % b-roll / 67.9 % base. 5 images, each once.
// 3 full-screens (hook B1, climax B4, close B5) = the FIRM cap; no two b-roll beats adjacent; full->full gaps 18.9 s
// and 12.8 s (rule 4: real breathing room, never a sub-1 s flash).
export const BROLL_RIP3: BrollEv[] = [
  // HOOK full-screen: "robot in your house and it has to do repair, you know"
  { src: staticFile('broll-rip3-robot-repair.png'), tIn: 0.82, tOut: 3.28, mode: 'full' },
  // "plumbing job or has to go out onto the roof" (covers the off-message CMC Pieverse page)
  { src: staticFile('broll-rip3-robot-roof.png'), tIn: 4.40, tOut: 6.90, mode: 'content' },
  // "order parts and it's going to have to pay things, man"
  { src: staticFile('broll-rip3-robot-pays.png'), tIn: 7.88, tOut: 10.56, mode: 'content' },
  // CLIMAX full-screen: "crazy hard to get ahead if you don't have assets"
  { src: staticFile('broll-rip3-cant-get-ahead.png'), tIn: 22.22, tOut: 25.28, mode: 'full' },
  // CLOSE full-screen: "right path, man. you're not checked out" -> runs past the last frame (no fade-out at the end)
  { src: staticFile('broll-rip3-right-path.png'), tIn: 38.06, tOut: 40.40, mode: 'full' },
];

// BADGES (code-drawn, rendered by LivestreamShort). top 170 = the channel page's top thumbnail row, clear of the
// caption band (~915-1005). Never sharing a window with each other, a b-roll beat or the comp's code cards.
export const BADGES_RIP3: BadgeEv[] = [
  // C1 "asset driven future"
  { tIn: 17.18, tOut: 18.86, color: RIP3_ACCENT, line1: 'ASSET-DRIVEN', sub: 'FUTURE', top: 170 },
  // C5 "that's why anybody's watching this channel": the base IS the channel page
  { tIn: 34.74, tOut: 36.60, color: RIP3_ACCENT, line1: 'THIS CHANNEL', sub: 'IS THE RIGHT PATH', top: 170 },
];

// CODE CARDS drawn by the comp (no generated image):
//  C2 "+ DIVIDENDS" chip with a code-drawn blank gold coin, slides in from the left, centre y 640.
//  C3 gold ring on the MEASURED "AI Is Wiping Out All These Jobs" thumbnail (x 103-525, y 265-500 at t=30 s; the page
//     is scroll-stable 24-32 s, measured shift 0 px) + a pointer chip over the off-topic Canton thumbnail to its right.
//  C4 red rubber stamp "STUCK ON UBI", centre y 690 (approx 595-785), clear of the caption band.
export const DIVIDENDS_RIP3 = { tIn: 19.26, tOut: 21.26, top: 640 };
export const RING_RIP3 = { tIn: 27.54, tOut: 30.88, x: 103, y: 265, w: 422, h: 235 };
export const STAMP_RIP3 = { tIn: 31.42, tOut: 33.92, top: 690 };

// SFX: every `t` = cue - crest so the crest lands on the cut/badge frame (library.json attack_sec):
//   transition_rapid_whoosh-tight 0.165 · Impact_Hit_01-2-short 0.14 · Cash Register-ching 0.12 · DING-093 0.150
//   Riser Sound Effect-2s 2.015 · Kick_Impact_01-short 0.19 · card-impact-hit01-3-short 0.11 · Cinematic Whoosh 06 0.59
export const SFX_RIP3: Sfx[] = [
  // frame-0 cover cut to the base
  { t: 0.033, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.42 },
  // hook full-screen robot (0.82)
  { t: 0.68, src: staticFile('sfx/Impacts/Impact_Hit_01-2-short.wav'), vol: 0.14, dur: 0.55 },
  // the robot pays (7.88)
  { t: 7.76, src: staticFile('sfx/Cash Register-ching.wav'), vol: 0.12, dur: 0.77 },
  // C1 "ASSET-DRIVEN FUTURE" badge pop (17.18)
  { t: 17.03, src: staticFile('sfx/DING-093.wav'), vol: 0.10, dur: 0.45 },
  // riser builds INTO the climax: crest lands on the 22.22 cut
  { t: 20.205, src: staticFile('sfx/Riser Sound Effect-2s.wav'), vol: 0.40, dur: 2.10 },
  // climax hit (22.22)
  { t: 22.03, src: staticFile('sfx/Impacts/Kick_Impact_01-short.wav'), vol: 0.16, dur: 0.55 },
  // "STUCK ON UBI" stamp slam (31.42); the 2 s tail is cut + faded
  { t: 31.31, src: staticFile('sfx/Impacts/card-impact-hit01-3-short.wav'), vol: 0.14, dur: 0.60, fade: 0.20 },
  // close full-screen "right path" (38.06)
  { t: 37.47, src: staticFile('sfx/Cinematic Whoosh 06.wav'), vol: 0.22, dur: 0.85, fade: 0.20 },
];

export { END as RIP3_END_S };

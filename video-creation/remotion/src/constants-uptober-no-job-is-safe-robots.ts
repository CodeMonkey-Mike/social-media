import { staticFile } from 'remotion';
import { type BrollEv, type Sfx } from './_kit';
import type { ThumbDef, BadgeEv, OverlayEv } from './LivestreamShort';

// ─────────────────────────────────────────────────────────────────────────────────────────────
// batch uptober / clip #3 - `no-job-is-safe-robots` (variant: FULL)
// clip-plan title: "No Job Is Safe Once You Have a Robot in Your House"
//
// "Nobody's safe. No job is safe. Like a robot could really do anything. You have a robot in your house. You
//  don't need a plumber. You don't need an electrician. You don't need a roofer. You don't need a gardener. You
//  don't need like anything. You don't need a security guard. So if somebody wants to come to your house and
//  try to like torture you to get all your crypto, I mean you have a robot that can kill the bastard. It's, I
//  think we're in for like an unimaginable future, a really, really, like an unimaginable future. It's hard to
//  imagine how it's gonna be just five years from now, and the good news is anybody here in crypto is probably
//  gonna be all set."
//
// Same-topic siblings: batch clip 7 (no-job-is-safe-robots-impact, same source) and the rfp batch robot shorts
// (rfp3 / rfp7). NONE of their assets or concepts are reused: every nj3 image is a fresh treatment (hat tower,
// dollhouse trades, collar-lift bodyguard, beach hammock, padlocked coin, doorway cover).
//
// Spine: shorts/uptober/no-job-is-safe-robots/no-job-is-safe-robots-final.mp4, staged GOP-seek-friendly to
// render-assets/no-job-is-safe-robots.mp4 - VERIFIED on the staged file (ffprobe 2026-10-01): has_b_frames 0,
// 1080x1920 @25 fps, video 33.560 s, audio 33.583 s.
// Plan of record: shorts/uptober/no-job-is-safe-robots/BROLL-PLAN.md
// Captions: captionsUptoberNoJobSafe.ts (canonical captions skill; header = provenance).
// Build directives for clip 3 (clip_directives.py --batch uptober --clip 3): none. No coverage exemption.
// ─────────────────────────────────────────────────────────────────────────────────────────────

export const NJ3_FPS = 30;
// Video 33.560 s, audio 33.583 s. 1007 frames: the LAST rendered frame (1006) sits at 33.533 s, inside both
// tracks. Last word "set" ends 33.56 s: a hard out.
export const NJ3_DURATION = 1007;

// MEASURED on THIS spine: row-mean gradient scan (rows 600-1300) puts the largest step at the 853/854 boundary
// on 5 of 5 frames (t = 3, 10, 17, 25, 31 s).
export const NJ3_SEAM = 854;
// Caption band centre: a 72 px caption with its stroke spans ~910..1010, 56 px clear of the seam; Mike's head
// enters ~row 1400, so the band sits on plain blue wall.
export const NJ3_CAP_Y = 960;
// Safety ORANGE (hard hats / the robot's eyes in the art); never Kaspa teal.
export const NJ3_ACCENT = '#ff8a1f';
const GOLD = '#ffc629';
const GREEN = '#39ff14';
const RED = '#ff4444';

export const CLIP_NJ3 = staticFile('no-job-is-safe-robots.mp4');

// ── FRAME-0 COVER (ONE frame; `durS` omitted so LivestreamShort uses 1/fps) ───────────────────
// Art = a robot silhouetted in an open front doorway at night, tools in hand; upper 45% left dark for the CODE
// title. No named project in the clip, so no reference applies.
export const THUMB_DEF_NJ3: ThumbDef = {
  img: staticFile('thumb-nj3-cover.png'),
  title: 'NO JOB\nIS SAFE',
  chip: 'ONCE A ROBOT MOVES IN',
  chipColor: NJ3_ACCENT,
  titleSize: 150,
};

// ── B-ROLL ──────────────────────────────────────────────────────────────────────────────────────
// Budget (video-creation/SKILL.md "B-roll coverage budget (HALVED 2026-07-14)"):
//   3.18 + 2.64 + 2.60 + 2.79 = 11.21 s of 33.57 s = 33.4 % b-roll / 66.6 % base
//   4 distinct images, each used EXACTLY ONCE, no loop, no reuse
//   3 full-screen moments: hook, punchline, climax (= the FIRM cap of 3); full-to-full gaps 13.5 s and 10.6 s
// Base content zone (frame-diff rows 0..850): ONE static X post for the whole clip ("Elon says it's about to make
// them RICH. Dream or disaster?" + a paused Trump/Elon video thumbnail + the X rail). On-topic, shown in real
// stretches.
export const BROLL_NJ3: BrollEv[] = [
  // HOOK, full-screen. "No job is safe. Like a robot could really do anything." Frames 1..0.94 are the face +
  // screen base (Phase 7 rule 5) on "Nobody's safe."; the cut lands on "No" (0.96). OUT at 4.12, just after
  // "anything." ends (4.02).
  { src: staticFile('broll-nj3-hook-hat-tower.png'), tIn: 0.94, tOut: 4.12, mode: 'full' },
  // "You don't need an electrician... a roofer... a gardener." - the dollhouse cutaway, one robot model doing
  // every trade at once. IN on "electrician" (7.24), OUT after "gardener" (9.82).
  { src: staticFile('broll-nj3-house-trades.png'), tIn: 7.32, tOut: 9.96, mode: 'content' },
  // PUNCHLINE, full-screen. "you have a robot that can kill the bastard." - the guardian robot holding a
  // ski-masked burglar up by the collar. OUT at 20.22 after "bastard." (19.80) and the join (19.86).
  { src: staticFile('broll-nj3-bodyguard.png'), tIn: 17.62, tOut: 20.22, mode: 'full' },
  // CLIMAX, full-screen. "anybody here in crypto is probably gonna be all set." - robots serving a hammock
  // lounger at sunset. tOut past the comp end = holds to the hard out.
  { src: staticFile('broll-nj3-climax-hammock.png'), tIn: 30.78, tOut: 33.70, mode: 'full' },
];

// ── TRANSPARENT OVERLAY (alpha PNG, glow-on-black -> alpha-from-luminance) ─────────────────────
// ONE real alpha overlay on a BASE beat: "try to like torture you to get all your crypto" - a glowing golden
// padlock clamped on a gold Bitcoin pops over the paused video thumbnail of the X post. Clear of every badge
// window, the caption band and the b-roll windows (ends 16.95, punchline full-screen in at 17.62).
export const OVERLAYS_NJ3: OverlayEv[] = [
  { src: staticFile('ovl-nj3-padlock.png'), tIn: 14.90, tOut: 16.95, top: 110, left: 190, width: 400, blend: 'normal' },
];

// ── BADGES (code-drawn) ─────────────────────────────────────────────────────────────────────────
// Never sharing a window with each other, the overlay, or any b-roll image. `top` = badge centre y
// (~105 px above/below): top 620 (~515-725) sits over the X post's reply area, leaving the post text + video
// thumbnail readable above it. line1 is ONE token.
export const BADGES_NJ3: BadgeEv[] = [
  { tIn: 4.20, tOut: 5.62, color: NJ3_ACCENT, line1: 'ROBOT', sub: 'IN YOUR HOUSE', top: 620 },
  { tIn: 5.72, tOut: 7.18, color: RED, line1: 'PLUMBER', sub: 'NOT NEEDED', top: 620 },
  { tIn: 10.06, tOut: 12.20, color: RED, line1: 'SECURITY', sub: 'GUARD: NOT NEEDED', top: 620 },
  { tIn: 21.80, tOut: 23.40, color: GOLD, line1: 'UNIMAGINABLE', sub: 'FUTURE', top: 620 },
  { tIn: 28.34, tOut: 29.90, color: GREEN, line1: '5 YEARS', sub: 'FROM NOW', top: 620 },
];

// ── SFX ─────────────────────────────────────────────────────────────────────────────────────────
// Palette (5 ms peak-envelope at 16 kHz, whole files, measured this build):
//   transition_rapid_whoosh        0.967 s, crest 0.165 s
//   transition_rapid_whoosh-tight  0.420 s, crest 0.165 s
//   card-impact-layered            1.450 s, crest 0.030 s
//   DING-093                       0.930 s, crest 0.150 s
//   Kick_Impact_01-short           0.550 s, crest 0.185 s
//   Boom - Big Reveal-short        1.050 s, crest 0.030 s
//   DSGNImpt-single_impact_sound   2.000 s, crest 0.030 s
// Every `t` is (cue time - crest) so the crest lands ON the cut / badge / overlay frame.
export const SFX_NJ3: Sfx[] = [
  // the frame-0 cover cutting to the base at frame 1. Low: it sits under "Nobody's safe".
  { t:  0.033, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.12, dur: 1.00 },
  // hook reveal hit on the 0.94 full-screen cut.
  { t:  0.91, src: staticFile('sfx/Impacts/card-impact-layered.wav'), vol: 0.14, dur: 1.50 },
  // ding on the ROBOT badge, crest on 4.20.
  { t:  4.05, src: staticFile('sfx/DING-093.wav'), vol: 0.12, dur: 0.45 },
  // whoosh into the dollhouse cutaway at 7.32 (tight variant).
  { t:  7.155, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.42 },
  // ding on the SECURITY badge, crest on 10.06.
  { t:  9.91, src: staticFile('sfx/DING-093.wav'), vol: 0.12, dur: 0.45 },
  // low clunk as the padlock overlay snaps on (14.90), tail truncated.
  { t: 14.715, src: staticFile('sfx/Impacts/Kick_Impact_01-short.wav'), vol: 0.14, dur: 0.35 },
  // punchline hit on the bodyguard full-screen cut (17.62).
  { t: 17.59, src: staticFile('sfx/Boom - Big Reveal-short.wav'), vol: 0.16, dur: 1.05 },
  // ding on the 5 YEARS badge, crest on 28.34.
  { t: 28.19, src: staticFile('sfx/DING-093.wav'), vol: 0.12, dur: 0.45 },
  // THE payoff hit on the climax cut (30.78), under "anybody here in crypto".
  { t: 30.75, src: staticFile('sfx/Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3'), vol: 0.20, dur: 2.00 },
];

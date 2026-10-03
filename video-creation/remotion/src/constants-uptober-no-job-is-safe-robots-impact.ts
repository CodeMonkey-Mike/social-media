import { staticFile } from 'remotion';
import { type BrollEv, type Sfx } from './_kit';
import type { ThumbDef, BadgeEv, OverlayEv } from './LivestreamShort';

// ─────────────────────────────────────────────────────────────────────────────────────────────
// batch uptober / clip #7 - `no-job-is-safe-robots-impact` (variant: IMPACT)
// clip-plan title: "Your Robot Is Your Security Guard"
//
// "Nobody's safe. No job is safe. Like a robot could really do anything. You have a robot in your house. You
//  don't need a plumber. You don't need an electrician. You don't need a roofer. You don't need a gardener, and
//  you don't need a security guard. They could be your security guard. So if somebody wants to come to your
//  house and try to like torture you to get all your crypto, I mean you have a, you have a robot that can kill
//  the bastard."  (hard out on the laugh line)
//
// Same-topic siblings: batch clip 3 (no-job-is-safe-robots, same source) and the rfp robot shorts (rfp3/rfp7).
// NONE of their assets or concepts are reused: clip 7 has its own robot design (matte gunmetal + white, glowing
// RED visor) and accent (alarm red); concepts = cover lawn-guard, eight-armed robot, guard booth, laser
// lock-on, alarm siren overlay.
//
// Spine: shorts/uptober/no-job-is-safe-robots-impact/no-job-is-safe-robots-impact-final.mp4, staged
// GOP-seek-friendly to render-assets/no-job-is-safe-robots-impact.mp4 - VERIFIED on the staged file (ffprobe
// 2026-10-01): has_b_frames 0, 1080x1920 @25 fps, video 20.080 s, audio 20.069 s.
// Plan of record: shorts/uptober/no-job-is-safe-robots-impact/BROLL-PLAN.md
// Captions: captionsUptoberNoJobSafeImpact.ts (canonical captions skill; header = provenance).
// Build directives for clip 7 (clip_directives.py --batch uptober --clip 7): none. No coverage exemption.
// ─────────────────────────────────────────────────────────────────────────────────────────────

export const NJ7_FPS = 30;
// Video 20.080 s, audio 20.069 s. 602 frames: the LAST rendered frame (601) sits at 20.033 s, inside both
// tracks. Last word "bastard." ends 20.02 s: a hard out.
export const NJ7_DURATION = 602;

// MEASURED on THIS spine: row-mean gradient scan (rows 600-1300) puts the largest step at the 853/854 boundary
// on 5 of 5 frames (t = 2, 6, 10, 14, 18 s).
export const NJ7_SEAM = 854;
// Caption band centre: a 72 px caption with its stroke spans ~910..1010, 56 px clear of the seam; Mike's head
// enters ~row 1400, so the band sits on plain blue wall.
export const NJ7_CAP_Y = 960;
// ALARM RED (the robot's visor / the siren in the art); never Kaspa teal, and distinct from clip 3's orange.
export const NJ7_ACCENT = '#ff3b30';
const GREEN = '#39ff14';
const RED = '#ff4444';

export const CLIP_NJ7 = staticFile('no-job-is-safe-robots-impact.mp4');

// ── FRAME-0 COVER (ONE frame; `durS` omitted so LivestreamShort uses 1/fps) ───────────────────
// Art = a giant gunmetal robot guard on a night lawn, arms crossed, its flashlight beam catching a tiny
// ski-masked burglar frozen mid-tiptoe; upper 45% left dark for the CODE title. No named project in the clip.
export const THUMB_DEF_NJ7: ThumbDef = {
  img: staticFile('thumb-nj7-cover.png'),
  title: "NOBODY'S\nSAFE",
  chip: 'YOUR ROBOT IS THE GUARD',
  chipColor: NJ7_ACCENT,
  titleSize: 150,
};

// ── B-ROLL ──────────────────────────────────────────────────────────────────────────────────────
// Budget (video-creation/SKILL.md "B-roll coverage budget (HALVED 2026-07-14)"):
//   3.14 + 2.14 + 1.49 (to the comp end 20.067) = 6.77 s of 20.07 s = 33.7 % b-roll / 66.3 % base
//   3 distinct images, each used EXACTLY ONCE, no loop, no reuse
//   2 full-screen moments: hook + punchline (cap 3); full-to-full gap 14.5 s
// Base content zone (rows 0..850): ONE static X post for the whole clip ("Elon says it's about to make them
// RICH. Dream or disaster?" + a paused Trump/Elon video thumbnail + the X rail). On-topic, shown in real
// stretches (4.06-10.46 under badges, 12.60-18.58 under the siren overlay + one badge).
export const BROLL_NJ7: BrollEv[] = [
  // HOOK, full-screen. "No job is safe. Like a robot could really do anything." Frames 1..0.92 are the face +
  // screen base (Phase 7 rule 5) on "Nobody's safe."; the cut lands on "No" (0.94). OUT at 4.06, after
  // "anything." ends (4.00) and before "You" (4.08).
  { src: staticFile('broll-nj7-hook-many-arms.png'), tIn: 0.92, tOut: 4.06, mode: 'full' },
  // "security guard. They could be your security guard" - the robot in a lit guard booth at the end of the
  // driveway. IN on "security" (10.48), OUT as "so" starts (12.62).
  { src: staticFile('broll-nj7-guard-booth.png'), tIn: 10.46, tOut: 12.60, mode: 'content' },
  // PUNCHLINE, full-screen, to the hard out. "robot that can kill the bastard." - red targeting lasers lock on a
  // burglar diving out a window. IN on "robot" (18.60). tOut past the comp end = holds to the last frame.
  { src: staticFile('broll-nj7-punch-laser.png'), tIn: 18.58, tOut: 20.20, mode: 'full' },
];

// ── TRANSPARENT OVERLAY (alpha PNG, glow-on-black -> alpha-from-luminance) ─────────────────────
// ONE real alpha overlay on a BASE beat: "and try to like torture you to get all your crypto" - a glowing red
// alarm siren pops over the paused video thumbnail of the X post (rows ~185-470). Clear of every badge window,
// the caption band and the b-roll windows (content cutaway out at 12.60; next badge in at 17.46).
export const OVERLAYS_NJ7: OverlayEv[] = [
  { src: staticFile('ovl-nj7-siren.png'), tIn: 14.86, tOut: 17.36, top: 90, left: 250, width: 420, blend: 'normal' },
];

// ── BADGES (code-drawn) ─────────────────────────────────────────────────────────────────────────
// Never sharing a window with each other, the overlay, or any b-roll image (each badge renders only inside
// [tIn-0.1, tOut+0.1] and is at opacity 0 at its own tIn/tOut, so a 0.08-0.10 s handoff never stacks two).
// `top` = badge centre y (~105 px above/below): top 620 (~515-725) sits over the X post's reply area, leaving
// the post text + video thumbnail readable above it, and 185 px clear of the caption band. line1 is ONE token.
// The four trade badges land ON each spoken trade word (plumber 6.32, electrician 7.22, roofer 8.38,
// gardener 9.30): a rapid "NOT NEEDED" stamp run, so the visual changes every ~1 s on a base stretch.
export const BADGES_NJ7: BadgeEv[] = [
  { tIn: 4.16, tOut: 5.70, color: NJ7_ACCENT, line1: '1 ROBOT', sub: 'AT HOME', top: 620 },
  { tIn: 6.30, tOut: 7.12, color: RED, line1: 'PLUMBER', sub: 'NOT NEEDED', top: 620 },
  { tIn: 7.22, tOut: 8.26, color: RED, line1: 'ELECTRICIAN', sub: 'NOT NEEDED', top: 620 },
  { tIn: 8.36, tOut: 9.20, color: RED, line1: 'ROOFER', sub: 'NOT NEEDED', top: 620 },
  { tIn: 9.30, tOut: 10.30, color: RED, line1: 'GARDENER', sub: 'NOT NEEDED', top: 620 },
  { tIn: 17.46, tOut: 18.48, color: GREEN, line1: 'ROBOT', sub: 'BODYGUARD', top: 620 },
];

// ── SFX ─────────────────────────────────────────────────────────────────────────────────────────
// Palette (5 ms peak-envelope at 16 kHz, whole files, measured this build):
//   transition_rapid_whoosh        0.967 s, crest 0.165 s
//   transition_rapid_whoosh-tight  0.420 s, crest 0.165 s
//   card-impact-layered            1.450 s, crest 0.030 s (energy > -30 dB rel ends 0.72)
//   DING-093                       0.930 s, crest 0.150 s
//   Kick_Impact_01-tight           0.320 s, crest 0.185 s
//   MGS Alert                      1.175 s, crest 0.435 s (energy > -30 dB rel ends 0.89)
//   Boom - Big Reveal-short        1.050 s, crest 0.030 s
// Every `t` is (cue time - crest) so the crest lands ON the cut / badge / overlay frame.
export const SFX_NJ7: Sfx[] = [
  // the frame-0 cover cutting to the base at frame 1. Low: it sits under "Nobody's safe".
  { t:  0.033, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.12, dur: 1.00 },
  // hook reveal hit on the 0.92 full-screen cut.
  { t:  0.89, src: staticFile('sfx/Impacts/card-impact-layered.wav'), vol: 0.14, dur: 1.50 },
  // ding on the 1 ROBOT badge, crest on 4.16.
  { t:  4.01, src: staticFile('sfx/DING-093.wav'), vol: 0.12, dur: 0.45 },
  // tight kick "stamps" on the four NOT NEEDED badges, crest on each badge tIn.
  { t:  6.115, src: staticFile('sfx/Impacts/Kick_Impact_01-tight.wav'), vol: 0.10, dur: 0.32 },
  { t:  7.035, src: staticFile('sfx/Impacts/Kick_Impact_01-tight.wav'), vol: 0.10, dur: 0.32 },
  { t:  8.175, src: staticFile('sfx/Impacts/Kick_Impact_01-tight.wav'), vol: 0.10, dur: 0.32 },
  { t:  9.115, src: staticFile('sfx/Impacts/Kick_Impact_01-tight.wav'), vol: 0.10, dur: 0.32 },
  // whoosh into the guard-booth cutaway at 10.46 (tight variant).
  { t: 10.295, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.42 },
  // the alarm sting as the siren overlay pops (crest 14.86): it starts after "house" (ends 14.50) and its body
  // sits inside the held "aaand" (14.58-15.36), tail cut at 0.90 s so it is gone before "try" (15.38).
  { t: 14.425, src: staticFile('sfx/MGS Alert.mp3'), vol: 0.10, dur: 0.90 },
  // THE payoff hit on the punchline full-screen cut (18.58), under "robot that can kill the bastard".
  { t: 18.55, src: staticFile('sfx/Boom - Big Reveal-short.wav'), vol: 0.16, dur: 1.05 },
];

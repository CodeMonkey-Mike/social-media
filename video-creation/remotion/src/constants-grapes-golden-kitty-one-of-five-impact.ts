import { staticFile } from 'remotion';
import { type BrollEv, type Sfx } from './_kit';
import type { ThumbDef, BadgeEv } from './LivestreamShort';

// ─────────────────────────────────────────────────────────────────────────────────────────────
// batch grapes / clip #3 - `golden-kitty-one-of-five-impact` (variant: IMPACT)
// clip-plan title: "Golden Kitty Is a Golden Opportunity"
//
// "'Golden Kitty is just getting started, and wise ones know this dip is a golden opportunity.' It's a
//  golden opportunity to get into something that's not dying. Get into this at a 3.2 million, you're
//  getting it at a discount. Literally one of like five memes out there that's not dying. Everything is
//  dying. Some will come back to life, that's true. But nonetheless, everything is dying. Everything is
//  dying. Except five of them, and Golden Kitty is one of them."
//
// Spine: shorts/grapes/golden-kitty-one-of-five-impact/golden-kitty-one-of-five-impact-final.mp4, staged
// GOP-seek-friendly to render-assets/golden-kitty-one-of-five-impact.mp4 - VERIFIED on the staged file:
// has_b_frames 0, 1080x1920 @25 fps, video 23.640 s, audio 23.654 s.
// Plan of record: shorts/grapes/golden-kitty-one-of-five-impact/BROLL-PLAN.md
// Captions: captionsGrapesGoldenKittyOneOfFiveImpact.ts (canonical captions skill; header = provenance).
// Directives: clip_directives.py --batch grapes --clip 3 -> none. HALVED budget applies as written.
// ─────────────────────────────────────────────────────────────────────────────────────────────

export const GK3_FPS = 30;
// Video 23.640 s, audio 23.654 s. 709 frames: the LAST rendered frame (708) sits at 23.600 s, inside both
// tracks. Last word "them." ends 23.56 s: a hard out.
export const GK3_DURATION = 709;
const END = GK3_DURATION / GK3_FPS;

// MEASURED on THIS spine (shorts/grapes/golden-kitty-one-of-five-impact/_qa/measure.py): row-mean gradient
// scan (rows 600-1300) on 11 frames (t = 0.5 .. 23.3 s) puts the largest step at 777/778 on 11 of 11.
export const GK3_SEAM = 778;
// Caption band centre: a 74 px caption with its 13 px stroke spans ~830..930, 52 px clear of the seam and
// over the wall (Mike's face sits low-right, eyes ~y 1600).
export const GK3_CAP_Y = 880;
// GOLD: the Golden Kitty statuette's own colour. Never Kaspa teal.
export const GK3_ACCENT = '#ffc629';
const GREEN = '#39ff14';
const RED = '#ff5252';

export const CLIP_GK3 = staticFile('golden-kitty-one-of-five-impact.mp4');

// ── FRAME-0 COVER (ONE frame; `durS` omitted so LivestreamShort uses 1/fps) ───────────────────
// Art = the oversized glowing statuette on the one lit pedestal in front, a hall of crumbling stone statues
// behind (generated WITH golden-kitty.png attached); top 45% left empty for the CODE title.
export const THUMB_DEF_GK3: ThumbDef = {
  img: staticFile('thumb-gk3-cover.png'),
  title: "ONLY 5 MEMES\nAREN'T\nDYING",
  chip: '$GOLDEN IS ONE',
  chipColor: GK3_ACCENT,
  titleSize: 118,
};

// ── B-ROLL ──────────────────────────────────────────────────────────────────────────────────────
// HALVED budget: 1.48 + 0.96 + 1.50 + 1.78 + 2.35 = 8.07 s of 23.63 s = 34.1 % b-roll / 65.9 % base.
// 5 distinct images, each used EXACTLY ONCE. Full-screens: 2 (hook, climax), within the 1-3 cap.
// Content zone 0-8.10 s = Mike's own YouTube page (ARCHIE thumbnails; ships as filmed, flagged in the report);
// 8.10 s -> end = the DexScreener GOLDEN chart. The tree beat runs to 8.16 so the screen switch is hidden.
export const BROLL_GK3: BrollEv[] = [
  // HOOK, full-screen. "is just getting started. And wise" - the statuette on the starting line of a gold lane.
  { src: staticFile('broll-gk3-hook-starting-line.png'), tIn: 0.64, tOut: 2.12, mode: 'full' },
  // "golden opportunity." - a giant golden door swinging open, the statuette in the doorway.
  { src: staticFile('broll-gk3-golden-door.png'), tIn: 3.64, tOut: 4.60, mode: 'content' },
  // "something that's not dying." - a dead grey forest with one living golden tree.
  { src: staticFile('broll-gk3-golden-tree.png'), tIn: 6.66, tOut: 8.16, mode: 'content' },
  // "Everything is dying. Some will come back to" - a field of cracked grey coins, a few sprouting green.
  { src: staticFile('broll-gk3-sprouts.png'), tIn: 15.82, tOut: 17.60, mode: 'content' },
  // CLIMAX, full-screen. "five of them and Golden Kitty is one of them." - five glowing lifeboats on a
  // sea of wrecks, the statuette at the bow of the brightest. Hard out.
  { src: staticFile('broll-gk3-climax-five-lights.png'), tIn: 21.28, tOut: END + 0.1, mode: 'full' },
];

// ── BADGES (code-drawn, on BASE beats over the GOLDEN chart) ────────────────────────────────────
// Never sharing a window with each other or a b-roll image. `top` = badge centre y, inside 0..778 and
// clear of the burned-in chat banner (y ~705-778).
export const BADGES_GK3: BadgeEv[] = [
  { tIn: 9.34, tOut: 11.64, color: GK3_ACCENT, line1: '$3.2M', sub: 'AT A DISCOUNT', top: 360 },
  { tIn: 13.16, tOut: 15.70, color: GREEN, line1: '1 OF 5', sub: 'NOT DYING', top: 360 },
  { tIn: 19.28, tOut: 20.95, color: RED, line1: 'EVERYTHING', sub: 'IS DYING', top: 360 },
];

// ── SFX ─────────────────────────────────────────────────────────────────────────────────────────
// Palette (crest = 5 ms peak-envelope at 16 kHz, measured on the library files):
//   transition_rapid_whoosh          0.967 s, crest 0.165 s
//   transition_rapid_whoosh-tight    0.420 s, crest 0.165 s
//   card-impact-layered              1.450 s, crest 0.030 s
//   DING-093                         0.930 s, crest 0.150 s
//   Kick_Impact_01-short             0.550 s, crest 0.185 s
//   DSGNImpt-single_impact_sound     2.000 s, crest 0.030 s
//   Tension_Rise_Logo_Reveal_3-tail04 0.400 s, crest 0.135 s (last 0.40 s of the -1s variant)
// Every `t` is (cue time - crest) so the crest lands ON the cut / badge frame.
export const SFX_GK3: Sfx[] = [
  // the frame-0 cover cutting to the base at frame 1. Low: it sits under "Golden Kitty".
  { t: 0.033, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.12, dur: 0.97 },
  // hook reveal hit on the 0.64 full-screen cut ("is just getting started").
  { t: 0.61, src: staticFile('sfx/Impacts/card-impact-layered.wav'), vol: 0.14, dur: 1.00 },
  // whoosh into the golden-door cutaway at 3.64.
  { t: 3.475, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.42 },
  // whoosh into the golden-tree cutaway at 6.66.
  { t: 6.495, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.42 },
  // ding on the $3.2M badge, crest on 9.34.
  { t: 9.19, src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 },
  // ding on the 1 OF 5 badge, crest on 13.16.
  { t: 13.01, src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.45 },
  // whoosh into the sprouts cutaway at 15.82.
  { t: 15.655, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.10, dur: 0.42 },
  // short kick on the EVERYTHING IS DYING badge, crest on 19.28, tail truncated.
  { t: 19.095, src: staticFile('sfx/Impacts/Kick_Impact_01-short.wav'), vol: 0.12, dur: 0.25 },
  // riser building INTO the climax cut: file ends exactly on 21.28. WHISPER SWEEP (_qa/res_sfx.json, res_sweep.json):
  // the full 1 s riser from 20.28 MASKED the second "dying" (2 staggered windows heard "everything is done"), so
  // per the timing-first rule it is now the riser's LAST 0.40 s only (library variant -tail04.wav, cut 0.60-1.00 of
  // the -1s file), starting at 20.88 the instant "dying" ends. Gain unchanged.
  { t: 20.88, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_3-tail04.wav'), vol: 0.07, dur: 0.40 },
  // THE payoff hit on the climax cut (21.28), "five of them and Golden Kitty is one of them".
  { t: 21.25, src: staticFile('sfx/Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3'), vol: 0.20, dur: 1.20 },
];

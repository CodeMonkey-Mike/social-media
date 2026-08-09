// what-if-1000x / clip #3 — october-bottom-self-defeating  ("The October Bottom Defeats Itself")
// Data-only module for the shared LivestreamShort renderer. Plan of record:
//   video-creation/shorts/what-if-1000x/october-bottom-self-defeating/BROLL-PLAN.md
//
// Spine  : october-bottom-self-defeating-tightened-desilenced.mp4 (59.159 s audio / 59.12 s video, 25 fps)
// Comp   : 30 fps, 1775 frames = 59.1667 s. The last spoken word "it" runs 59.00-59.18, so the comp
//          deliberately outlives the 59.12 s video stream by 0.047 s; the closing FULL b-roll (beat 7)
//          covers the frame from 56.95 s to past the end, so no tail frame is ever visible.
// Seam   : 854 (measured green-screen onset; rows <= 853 read 0.00 green on every sampled frame).
// capY   : 924 (70 px below the seam, ~200 px above his eyes at y ~1130-1180).
// Budget : 7 distinct images / 17.57 s of b-roll = 29.7 % (target ~30 %), base showing 70.3 %,
//          3 full-screens (hook, the turn, the climax) = the FIRM 1-3 cap.
import { staticFile } from 'remotion';
import { TEAL, type BrollEv, type Caption, type Sfx } from './_kit';
import type { BadgeEv, ShortData } from './LivestreamShort';

export const OBSD_FPS = 30;
export const OBSD_FRAMES = 1775;          // 59.1667 s
export const OBSD_DURATION_S = OBSD_FRAMES / OBSD_FPS;

// ── captions ────────────────────────────────────────────────────────────────────────────────────
// skills/captions/build_captions.py --style montserrat --var CAPTIONS_OBSD
//   --colorize "g=october y=90%,2021,2017 gr=green r=red,scared,fomo"
// ONE manual edit vs the builder output: the 0.18 s orphan chunk `it` at 59.00 is merged into the
// previous chunk so the hard-out punchline reads as one line ("but they flipped it").
export const CAPTIONS_OBSD: Caption[] = [
  { t:   0.00, h: 'i keep saying' },
  { t:   0.72, h: 'there\'s going to' },
  { t:   1.22, h: 'be an enormous' },
  { t:   2.38, h: 'amount of people' },
  { t:   3.22, h: 'that are going' },
  { t:   3.58, h: 'to be buying' },
  { t:   4.16, h: 'in <g>october</g> just' },
  { t:   5.66, h: 'because they think' },
  { t:   6.36, h: 'that that\'s going' },
  { t:   7.08, h: 'to be when the' },
  { t:   7.72, h: 'bottom is and' },
  { t:   8.46, h: 'then when they see' },
  { t:   9.26, h: 'those <gr>green</gr> candles' },
  { t:  10.48, h: 'and they\'re going' },
  { t:  10.96, h: 'to get <r>scared</r>' },
  { t:  11.62, h: 'that they missed' },
  { t:  12.28, h: 'the bottom they\'re' },
  { t:  12.96, h: 'going to start' },
  { t:  13.56, h: 'you know, just' },
  { t:  14.00, h: 'buying in out' },
  { t:  14.68, h: 'of <r>fomo</r> and it\'s' },
  { t:  15.58, h: 'they\'re going to' },
  { t:  16.10, h: 'push some really' },
  { t:  16.82, h: '<gr>green</gr> candles' },
  { t:  18.74, h: 'you know in' },
  { t:  19.58, h: '<g>october</g> and it' },
  { t:  20.54, h: 'may even start' },
  { t:  21.42, h: 'september so right' },
  { t:  22.52, h: 'now this may be your' },
  { t:  24.08, h: 'last chance right' },
  { t:  25.06, h: 'because if <y>90%</y>' },
  { t:  26.10, h: 'of people believe' },
  { t:  26.74, h: 'the bottom is' },
  { t:  27.30, h: 'in <g>october</g> it\'s' },
  { t:  27.88, h: 'probably not going' },
  { t:  28.24, h: 'to be <g>october</g>' },
  { t:  28.68, h: 'you have to look like' },
  { t:  29.40, h: 'that remember what' },
  { t:  30.32, h: 'happened last year' },
  { t:  32.10, h: 'everybody was saying' },
  { t:  33.40, h: 'that september is' },
  { t:  34.54, h: 'always <r>red</r> in' },
  { t:  35.74, h: 'the post-halving year' },
  { t:  37.02, h: 'so i\'m going' },
  { t:  37.56, h: 'to sell so i don\'t' },
  { t:  38.66, h: 'get involved in' },
  { t:  39.40, h: 'a <r>red</r> september' },
  { t:  40.12, h: 'and then everybody' },
  { t:  40.86, h: 'turns august <r>red</r>' },
  { t:  42.26, h: 'and then september' },
  { t:  43.18, h: 'turn <gr>green</gr> pretty' },
  { t:  44.86, h: 'easy, right?' },
  { t:  45.36, h: 'like in <y>2021</y> we had' },
  { t:  47.04, h: 'a <r>red</r> september.' },
  { t:  47.64, h: 'we had a' },
  { t:  48.08, h: '<gr>green</gr> august' },
  { t:  50.04, h: '<y>2017</y> <r>red</r> september' },
  { t:  51.40, h: '<gr>green</gr> august <r>red</r>' },
  { t:  52.10, h: 'september <gr>green</gr> august' },
  { t:  53.48, h: 'yeah, so it was' },
  { t:  54.34, h: 'everybody was expecting' },
  { t:  55.30, h: 'a <r>red</r> september' },
  { t:  56.12, h: 'because it\'ll happen' },
  { t:  57.12, h: 'every single time' },
  { t:  57.96, h: 'but they <y>flipped it</y>' },
];

// ── b-roll (7 distinct images, zero reuse, zero orphans) ────────────────────────────────────────
export const BROLL_OBSD: BrollEv[] = [
  // 1 HOOK (full) — "an enormous amount of people ... buying in in October"
  { src: staticFile('broll-obsd-crowd-october.png'),  tIn:  1.25, tOut:  3.85, mode: 'full' },
  // 2 (content) — "when they see those green candles ... scared that they missed the bottom"
  { src: staticFile('broll-obsd-green-candles.png'),  tIn:  9.25, tOut: 11.85, mode: 'content' },
  // 3 (content) — "buying in out of FOMO ... push some really green candles"
  { src: staticFile('broll-obsd-fomo-stampede.png'),  tIn: 14.60, tOut: 17.15, mode: 'content' },
  // 4 THE TURN (full) — "so right now this may be your last chance"
  { src: staticFile('broll-obsd-last-chance.png'),    tIn: 22.55, tOut: 25.15, mode: 'full' },
  // 5 (content) — "if 90% of people believe the bottom is in October, it's probably not October"
  { src: staticFile('broll-obsd-ninety-percent.png'), tIn: 26.95, tOut: 29.45, mode: 'content' },
  // 6 (content) — "everybody turns August red and then September turn green"
  { src: staticFile('broll-obsd-calendar-flip.png'),  tIn: 40.90, tOut: 43.40, mode: 'content' },
  // 7 CLIMAX (full) — "it'll happen every single time. But they flipped it".
  //   tOut runs PAST the 59.1667 s comp end on purpose: the 0.12 s BrollLayer fade-out must never
  //   ghost back to base on the last frame, and this also covers the 0.047 s of comp that outlives
  //   the video stream. Visible = 2.22 s.
  { src: staticFile('broll-obsd-flipped-climax.png'), tIn: 56.95, tOut: 59.30, mode: 'full' },
];

// ── badges (code-drawn, content zone, over BASE beats only) ─────────────────────────────────────
// Bands: top 300 -> y ~200-400, top 620 -> y ~520-720. Both above the seam (854) and far above the
// caption centre (924). No two badges share a time window, and none overlaps a b-roll beat.
export const BADGES_OBSD: BadgeEv[] = [
  { tIn: 31.00, tOut: 33.80, color: TEAL,      line1: 'LAST YEAR',     line2: 'SAME SCRIPT',   sub: 'EVERYBODY KNEW THE RULE',      top: 300 },
  { tIn: 35.30, tOut: 38.40, color: '#ff5252', line1: 'THE RULE',      line2: 'SEPTEMBER RED', sub: 'POST-HALVING GOSPEL',          top: 620 },
  { tIn: 45.60, tOut: 48.60, color: '#ffe600', line1: '2021 AND 2017', line2: 'SAME PATTERN',  sub: 'RED SEPTEMBER, GREEN AUGUST',  top: 300 },
  { tIn: 50.60, tOut: 53.40, color: '#39ff14', line1: 'EVERY CYCLE',   line2: 'THE SAME BET',  sub: 'SO EVERYBODY CROWDED IT',      top: 620 },
];

// ── sfx ─────────────────────────────────────────────────────────────────────────────────────────
// Volumes are whisper-verified against the FINAL mix; a cue that degrades a line gets swept down.
export const SFX_OBSD: Sfx[] = [
  { t:  0.03, src: staticFile('sfx/Cinematic Whoosh 02.wav'),   vol: 0.40, dur: 2.0 },  // frame-0 thumb cut
  { t:  1.22, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.36, dur: 1.0 }, // -> hook full-screen
  { t:  9.22, src: staticFile('sfx/Cinematic Whoosh 06.wav'),   vol: 0.28, dur: 2.0 },  // -> green candles
  { t: 14.57, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.28, dur: 1.0 }, // -> FOMO stampede
  { t: 22.52, src: staticFile('sfx/Cinematic Whoosh 02.wav'),   vol: 0.30, dur: 2.0 },  // -> the turn (full)
  { t: 26.92, src: staticFile('sfx/Impacts/Impact_2.wav'),      vol: 0.20, dur: 2.5 },  // 90% cutaway hit
  { t: 30.98, src: staticFile('sfx/DING.mp3'),                  vol: 0.22, dur: 2.0 },  // badge A reveal
  { t: 35.28, src: staticFile('sfx/ding/ding.mp3'),             vol: 0.20, dur: 2.0 },  // badge B reveal
  { t: 40.87, src: staticFile('sfx/Cinematic Whoosh 06.wav'),   vol: 0.28, dur: 2.0 },  // -> calendar flip
  { t: 45.58, src: staticFile('sfx/TING SOUND EFFECT.mp3'),     vol: 0.20, dur: 2.0 },  // badge C reveal
  // riser peaks at ~4.05 s in, so it starts at 52.88 and its peak lands ON the climax impact.
  { t: 52.88, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_3.wav'), vol: 0.16, dur: 4.10 },
  { t: 56.93, src: staticFile('sfx/Impacts/Impact_2.wav'),      vol: 0.24, dur: 2.5 },  // climax impact
];

export const D_OBSD: ShortData = {
  clip: staticFile('october-bottom-self-defeating.mp4'),
  fps: OBSD_FPS,
  durationS: OBSD_DURATION_S,
  capY: 924,
  seam: 854,
  captions: CAPTIONS_OBSD,
  broll: BROLL_OBSD,
  badges: BADGES_OBSD,
  sounds: SFX_OBSD,
  // frame-0 cover ONLY (LivestreamShort defaults thumbDur to 1/fps — no durS override on purpose).
  thumb: {
    title: '90% SAY THE\nBOTTOM IS\nOCTOBER',
    chip: 'SO IT PROBABLY ISN\'T',
    chipColor: TEAL,
    titleSize: 116,
    img: staticFile('thumbnail-obsd.png'),
  },
};

// constants-lab353.ts — data for "We Estimated 20x. LAB Did 353x."
// batch what-if-1000x, clip #4, slug lab-called-20x-did-353x (variant: solo)
//
// Contract: video-creation/livestream-repurpose/skills/remotion-shorts-build/SKILL.md
// Plan:     video-creation/shorts/what-if-1000x/lab-called-20x-did-353x/BROLL-PLAN.md
//
// Render (public-dir = the CLIP's render-assets/, which holds the spine + thumbnail + b-roll + sfx):
//   npx remotion render src/index.ts LabCalled20xDid353x out/what-if-1000x/4-lab-called-20x-did-353x.mp4 \
//     --public-dir "../shorts/what-if-1000x/lab-called-20x-did-353x/render-assets"
import { staticFile } from 'remotion';
import { CAPTIONS_LAB353 } from './captionsLab353';
import type { ShortData, BadgeEv } from './LivestreamShort';
import type { BrollEv, Sfx } from './_kit';

export const L353_FPS = 30;
// Spine: 61.200 s container / 61.200 s video stream, 61.224 s audio stream. 1836 @30 = 61.2000 s, so
// the LAST rendered frame is t = 61.1667 s, inside both streams: no black tail frame, no audio underrun.
export const L353_DURATION = 1836;

export const L353_CLIP = staticFile('lab-called-20x-did-353x.mp4');
export const THUMB_L353 = staticFile('thumbnail-lab353.png');

// Measured on THIS clip (green-onset row scan at t=0.5..60 s, every ~3 s): the webcam's green screen
// starts at y=854 on every sample that is not filled by his hair. Content-mode b-roll covers 0..855.
export const L353_SEAM = 855;
// Caption centre: 70 px below the seam, on his hairline, ~300 px above his eyes (~1230-1290).
export const L353_CAP_Y = 925;

// ─── B-ROLL ────────────────────────────────────────────────────────────────────────────────────────
// HALVED budget (SKILL: ~25-35 % generated b-roll / ~65-75 % base showing): 7 distinct images,
// 20.10 s of 61.20 s = 32.8 % b-roll / 67.2 % base showing. 3 FULL-SCREEN moments (hook + climax +
// punchline/transition) = the FIRM 1-3 cap exactly, spaced 22.0 s and 11.7 s apart, so there is never
// a sub-1 s base flash between two full-screens.
//
// The BASE stretches are the POINT of this clip: the screen-share is the receipt. 0.00-43.40 is the
// real CoinMarketCap LAB page - the all-time chart flat at $0.078, the near-vertical pump to ~$20,
// the drop back to $0.13 - i.e. the 353x itself. B-roll only earns the hook, the two prices he names,
// the 353x climax, the punchline, and Velvet (which is NOT on screen anywhere).
//
// B4 -> B5 is a deliberate HARD CUT and the two windows are BUTTED (B4.tOut === B5.tIn === 25.85).
// They were originally 0.13 s apart on the theory that BrollLayer's 0.18 s adjacency window would
// cut them together; a draft render proved otherwise (QA 2026-08-03, _qa/frames/cutseq.png): the
// EPS window only suppresses the FADES, while `findIndex` still returns -1 across the gap, so the
// base screen-share flashed for 4 frames between the two images. Butting them removes the gap
// entirely AND keeps both adjacency flags true, so it is a clean 1-frame cut with no crossfade.
export const BROLL_L353: BrollEv[] = [
  // BASE 0.00-1.32 — frame-0 cover hands off to Mike + the live LAB chart.
  { src: staticFile('broll-wi04-hook-lab-20x.png'),  tIn:  1.32, tOut:  3.90, mode: 'full'    }, // HOOK: "do like a 20x off of LAB" (REFERENCE-GATED, LAB.png)
  // BASE 3.90-9.60 — "ended up doing 350x" lands ON the real pump on the CMC chart. Badge A rides it.
  { src: staticFile('broll-wi04-swing-plan.png'),    tIn:  9.60, tOut: 12.10, mode: 'content' }, // "we swing trade, goes up we sell"
  // BASE 12.10-17.05 — the chart's flat left-hand side IS the bottom he is describing.
  { src: staticFile('broll-wi04-bottom-cents.png'),  tIn: 17.05, tOut: 19.75, mode: 'content' }, // THE BOTTOM: "eight cents or seven and a half cents" (REFERENCE-GATED)
  // BASE 19.75-22.60
  { src: staticFile('broll-wi04-top-sold.png'),      tIn: 22.60, tOut: 25.85, mode: 'content' }, // THE TOP: "at like $25 or $27" (REFERENCE-GATED) - tOut BUTTED to B5.tIn, see note above
  { src: staticFile('broll-wi04-climax-353x.png'),   tIn: 25.85, tOut: 29.55, mode: 'full'    }, // CLIMAX: "getting to like seven cents, 353x man" (REFERENCE-GATED)
  // BASE 29.55-41.28 — the long reflective stretch; badges B and C ride it.
  { src: staticFile('broll-wi04-just-fly.png'),      tIn: 41.28, tOut: 43.95, mode: 'full'    }, // PUNCHLINE: "that thing decided to just fly" + COVERS the screen-share change at 43.40 (REFERENCE-GATED)
  // BASE 43.95-50.45 — the community line + the 350x recap.
  { src: staticFile('broll-wi04-velvet-58x.png'),    tIn: 50.45, tOut: 53.15, mode: 'content' }, // "that 58x on the velvet token" (REFERENCE-GATED, velvet.png)
  // BASE 53.15-61.20 — Pippin (no reference on disk -> badge D, real text, never an invented logo),
  // then the bear-market close on his face. Badges D and E ride it.
];

// ─── Badges (code-drawn, content zone) ───────────────────────────────────────────────────────────
// Each states something the captions do NOT, and every window sits inside a BASE stretch with no
// b-roll and no other badge running (overlays must never collide in time AND space).
// A plate is ~380-440 px tall around `top` (line2 wraps inside a ~440 px column): top 320 renders
// y ~128-512, top 600 renders y ~409-789. Both bands sit fully inside the frame, above the seam (855)
// and above the caption band (top edge ~880). Consecutive badges alternate bands.
export const BADGES_L353: BadgeEv[] = [
  { tIn:  6.40, tOut:  8.95, color: '#39ff14', line1: 'CALLED IT',     line2: 'PRIVATE GEM',  sub: 'OUR TARGET WAS A 20X', top: 600 },
  { tIn: 30.10, tOut: 32.60, color: '#ffe600', line1: '7.5 CENTS IN',  line2: '$27 OUT',      sub: 'THAT IS THE 353X',     top: 320 },
  { tIn: 37.60, tOut: 40.10, color: '#00e5ff', line1: 'THE PLAN WAS',  line2: 'SWING THE BAG',                             top: 600 },
  { tIn: 55.10, tOut: 57.40, color: '#00e5ff', line1: '85X',           line2: 'ON PIPPIN',    sub: 'EARLIER THIS YEAR',    top: 320 },
  { tIn: 58.00, tOut: 60.40, color: '#ff5252', line1: 'BEAR MARKET',   line2: 'NO LESS',      sub: '353X  58X  85X',       top: 600 },
];

// ─── Frame-0 thumbnail (IG/TikTok cover) ─────────────────────────────────────────────────────────
// ONE frame only (LivestreamShort defaults thumb.durS to 1/fps): generated background art with the
// title/chip drawn in CODE on top, never baked into the art.
// The 20x estimate reads VINDICATED, never wrong: "WE CALLED 20X / IT DID 353X" is the call
// overdelivering, not the call being corrected. No em dashes.
export const THUMB_DEF_L353 = {
  title: 'WE CALLED 20X\nIT DID 353X',
  chip: '7.5 CENTS TO $27',
  chipColor: '#39ff14',
  // 106, not the 132 default: the Thumb text column is 968 px wide (left/right 56) and line 1 is 13
  // characters. At 132 it wraps to three ragged lines; 106 keeps both lines single and centred.
  titleSize: 106,
  img: THUMB_L353,
};

// ─── SFX ─────────────────────────────────────────────────────────────────────────────────────────
// Whoosh on the frame-0 cut and on every b-roll cut that matters; dings/tings on the two badge
// receipts; a riser that builds through "getting to like seven cents" and is cut by the IMPACT
// landing exactly on "353x". Volumes are deliberately low - an SFX cue that masks the VO is a build
// defect, not a mixing taste call (the 27.70 impact is whisper-verified on the final mix).
export const SFX_L353: Sfx[] = [
  { t:  0.02, src: staticFile('sfx/Cinematic Whoosh 02.wav'),               vol: 0.38, dur: 1.00 }, // frame-0 thumbnail cut
  { t:  1.30, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.40, dur: 0.90 }, // cut INTO the hook full-screen
  { t:  6.38, src: staticFile('sfx/DING.mp3'),                              vol: 0.24, dur: 1.20 }, // badge A: the private-gem call
  { t: 17.03, src: staticFile('sfx/Cinematic Whoosh 06.wav'),               vol: 0.28, dur: 0.80 }, // cut into THE BOTTOM cutaway
  { t: 22.58, src: staticFile('sfx/Cinematic Whoosh 06.wav'),               vol: 0.28, dur: 0.80 }, // cut into THE TOP cutaway
  { t: 25.83, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.34, dur: 0.90 }, // cut INTO the climax full-screen
  { t: 26.30, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_3.wav'), vol: 0.14, dur: 1.40 }, // riser into the payoff
  { t: 27.70, src: staticFile('sfx/Impacts/Impact_2.wav'),                  vol: 0.26, dur: 2.00 }, // IMPACT exactly on "353x"
  { t: 30.08, src: staticFile('sfx/TING SOUND EFFECT.mp3'),                 vol: 0.22, dur: 1.30 }, // badge B: 7.5 cents in, $27 out
  { t: 41.26, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.34, dur: 0.90 }, // cut INTO the punchline full-screen
  { t: 55.08, src: staticFile('sfx/DING.mp3'),                              vol: 0.22, dur: 1.20 }, // badge D: 85x on Pippin
];

export const L353: ShortData = {
  clip: L353_CLIP,
  fps: L353_FPS,
  durationS: L353_DURATION / L353_FPS,
  capY: L353_CAP_Y,
  seam: L353_SEAM,
  captions: CAPTIONS_LAB353,
  broll: BROLL_L353,
  badges: BADGES_L353,
  sounds: SFX_L353,
  thumb: THUMB_DEF_L353,
};

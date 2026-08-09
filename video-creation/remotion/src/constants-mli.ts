import { staticFile } from 'remotion';
import type { BrollEv, Sfx } from './_kit';
import type { ThumbDef } from './LivestreamShort';

// ─── 1000x-math-ladder-impact (batch: what-if-1000x, clip #6, variant: short / impact) ───────────
// "Five Lose. One Does 1000x." — the IMPACT cut of the 1000x ladder, the peak beat of the whole
// stream's math argument compressed to 24 s: "$1,000 into 10 different good coins that you think are
// good, you've researched them. let's say you lose money on five of those. coin number six, maybe
// it's going to underperform, you only get a 2x. coin number seven, you might get a 5x. coin number
// eight, a 10x. coin number nine, your 50x. and then maybe your winner, your real winner is going to
// do like a 900x or a 1000x. so you're going to make that money."
//
// SIBLING NOTE: clip #1 `1000x-math-ten-coins` (long variant) is cut from the SAME ladder segment
// plus more, and is built in PARALLEL by another agent. Per the "no duplicate b-roll across
// same-topic shorts" HARD RULE nothing here is shared with it: every asset is newly generated with
// its own `-mli-` filename straight into THIS clip's own render-assets/, and no path resolves into
// clip #1's folder.
//
// Base clip: 1000x-math-ladder-impact-final.mp4 (= <slug>-tightened-desilenced.mp4, copied in).
// ⚠ SEEK-FIX (2026-08-03): the first FULL render died at frame 565 with the Remotion compositor
//   error "No frame found at position 241066" (t 18.83 s). Cause was NOT the edit and NOT disk
//   pressure (the cached temp copy was byte-complete): the desilenced spine ships a 250-frame GOP
//   (keyframes ONLY at 0.0 / 10.2 / 20.2 s) with B-frames, and 8 concurrent OffthreadVideo threads
//   seeking inside that long GOP intermittently fail. FIX = re-encode the render-assets COPY only,
//   picture-identical, to a seek-friendly GOP: `-c:v libx264 -crf 16 -g 25 -keyint_min 25 -bf 0
//   -sc_threshold 0 -vsync cfr -r 25 -c:a copy`. Verified: 24.200 s, 25 fps, audio stream COPIED
//   (bit-identical mix), PSNR vs the original 51-53 dB across all 605 frames (visually lossless,
//   frame-aligned). NOT a re-cut and NOT a re-desilence: the canonical spine
//   `<slug>-tightened-desilenced.mp4` in the clip folder is untouched (md5 unchanged).
// ALREADY composited vertical (screen-share on top, webcam below), 1080x1920 @ 25 fps, 24.20 s.
// FINAL: do NOT re-cut, do NOT re-desilence, do NOT re-split the zones. The comp runs at 30 fps;
// OffthreadVideo resamples the 25 fps source BY TIME, so every cue below is plain seconds taken from
// the clip's own Whisper word timings (clip-relative, 0-based).
//
// The clip is ONE contiguous source segment (2751.38-2785.32) minus two tighten removals that both
// land before 2762.38, i.e. inside the pre-ladder setup. There are NO concat joins in the delivered
// spine, so no b-roll beat has to mask a splice.
//
// Render (public-dir = the CLIP's render-assets/, which holds the spine + thumbnail + b-roll + sfx):
//   npx remotion render src/index.ts MathLadderImpact \
//     out/what-if-1000x/6-1000x-math-ladder-impact.mp4 \
//     --public-dir "<repo>/video-creation/shorts/what-if-1000x/1000x-math-ladder-impact/render-assets"

export const MLI_FPS = 30;
// 24.20 s * 30 = 726 frames; the last rendered frame is 725 => t 24.1667 s, still inside the 24.20 s
// video stream, so there is no black tail frame.
export const MLI_DURATION = 726;

export const CLIP_MLI  = staticFile('1000x-math-ladder-impact-final.mp4');
export const THUMB_MLI = staticFile('thumbnail-mli.png');

// Layout geometry, MEASURED on this clip (row-mean gradient scan at t = 1/5/9/13/17/21 s; all six
// frames put the hard screen-share/webcam divider on the SAME row, gradient 130-163 grey levels vs
// ~32 for the next-strongest row).
export const MLI_SEAM  = 854; // content zone = 0..854 (an elizaOS CoinMarketCap page); webcam below
export const MLI_CAP_Y = 900; // caption centre: below the seam, above his hairline (~880), nowhere near his eyes (~1250)

// ─── B-roll beats (authored in BROLL-PLAN.md BEFORE generation) ────────────────────────────────
// Coverage budget (SKILL "B-roll coverage budget", HALVED 2026-07-14):
//   8.12 s covered / 24.20 s = 33.6 % b-roll, 16.08 s = 66.4 % BASE SHOWING.
//   Targets ~30 % / ~70 % (bands 25-35 % / 65-75 %) => IN BAND.
// 4 distinct images, zero reuse inside the clip and zero reuse from sibling clip #1.
// 2 full-screens ONLY (the hook and the climax), 17.5 s apart, so a full->full base flash cannot
// exist and the FIRM 1-3 cap holds.
// The screen-share is an elizaOS CMC page that barely moves and is OFF-MESSAGE for this clip (he is
// doing generic portfolio math). Per the SKILL that is NOT a licence to blanket it: the long
// 11.30-21.45 base stretch stays BASE, and the dead zone is carried by the CODE-DRAWN ladder (see
// LADDER_RUNGS below), which is a graphics overlay and does not spend b-roll budget. Visual change
// therefore never stalls: a new rung lands at 11.70 / 13.76 / 15.76 / 17.76 and the climax number at
// 21.68 / 22.80, i.e. something new every 1.1-2.1 s.
// staticFile() calls are LITERAL strings on purpose - the finalized-short gate scans for literal refs.
export const BROLL_MLI: BrollEv[] = [
  // BASE 0.00-1.30 — open on Mike + the screen-share (the frame-0 thumb is ONE frame; base from frame 1)
  { src: staticFile('broll-mli-hook-ten-coins.png'),  tIn:  1.30, tOut:  3.95, mode: 'full'    }, // HOOK: "$1,000 ... into 10 different good coins" (dollars 0.96, 10 1.74, coins 3.12)
  // BASE 3.95-6.30 (2.35 s) — "you've researched them. let's say you lose money"
  { src: staticFile('broll-mli-five-dead.png'),       tIn:  6.30, tOut:  8.30, mode: 'content' }, // "lose money on five of those" (lose 6.22, five 7.36)
  // BASE 8.30-9.70 (1.40 s) — "all right. coin number six"
  { src: staticFile('broll-mli-first-step.png'),      tIn:  9.70, tOut: 11.30, mode: 'content' }, // "maybe it's going to like underperform" (underperform 10.52)
  // BASE 11.30-21.45 (10.15 s) — the whole 2x/5x/10x/50x ladder plays over the LIVE base video with
  // the code-drawn rung stack building in the right column. Deliberate, and the frame is never static.
  { src: staticFile('broll-mli-1000x-eruption.png'),  tIn: 21.45, tOut: 23.32, mode: 'full'    }, // CLIMAX: "a 900x or a 1000x" (900 21.70, thousand 22.82)
  // BASE 23.32-24.17 (0.85 s) — hard-out on Mike's face for "so you're going to make that money".
];

// ─── The escalating ladder (CODE-drawn, rendered by MathLadderImpact) ───────────────────────────
// This clip is short and dense, so the ladder NUMBERS are the visual spine instead of a pile of
// images. One rung chip pops in exactly on each spoken multiplier, stacking UPWARD in the right half
// of the content zone; the colour escalates grey -> teal -> teal -> yellow, and the payoff number
// takes the whole centre of the frame over the climax full-screen.
// Rung-to-coin mapping is taken literally from the VO: "coin number six ... you only get a 2x |
// coin number seven, a 5x | coin number eight, a 10x | coin number nine, your 50x".
export type Rung = { t: number; coin: string; mult: string; color: string };
export const LADDER_RUNGS: Rung[] = [
  { t: 11.70, coin: 'COIN 6', mult: '2X',  color: '#9aa3ad' },
  { t: 13.76, coin: 'COIN 7', mult: '5X',  color: '#00e5ff' },
  { t: 15.76, coin: 'COIN 8', mult: '10X', color: '#00e5ff' },
  { t: 17.76, coin: 'COIN 9', mult: '50X', color: '#ffe600' },
];
export const LADDER_IN   = 11.55; // stack fades in just after the 9.70-11.30 content-zone beat clears
export const LADDER_OUT  = 21.44; // fully gone BEFORE the climax number appears (21.62): no overlap
export const LADDER_FADE = 0.24;

// Climax number: "900X" on the word "900" (21.70), swapping to "1000X" on "thousand" (22.82).
// Sits centred at y 520, i.e. its own vertical band: the rung stack is already gone and the captions
// live 380 px below at y 900, so no two graphics ever share time AND space.
export const CLIMAX_IN    = 21.62;
export const CLIMAX_SWAP  = 22.80;
export const CLIMAX_OUT   = 23.32;

// ─── Frame-0 thumbnail (IG/TikTok cover) ────────────────────────────────────────────────────────
// ONE frame only (LivestreamShort defaults thumb.durS to 1/fps) — generated background art with the
// hook title drawn in CODE on top, never baked into the image. Open loop: which one? No em dashes,
// no @handle.
export const THUMB_DEF_MLI: ThumbDef = {
  img: THUMB_MLI,
  title: 'FIVE LOSE\nONE DOES\n1000X',
  chip: '$1,000 INTO 10 COINS',
  chipColor: '#39ff14',
  titleSize: 126,
};

// ─── SFX (shared library, COPIED into render-assets/sfx/; every event stays under the VO) ───────
// Whoosh on the frame-0 thumbnail cut and on both edges of the hook full-screen; a dull impact on
// the loss beat; an escalating FOUR-STEP ding motif, one per rung with rising volume (the audio half
// of the escalating-number treatment); a riser that crests exactly on the cut to the climax; and the
// PAYOFF HIT landing ON "900" (21.70), topped by a cash register on "1000x" (22.82). Nothing plays
// over the closing line at all.
//
// ⚠ Cue points are each SFX's own PEAK/ATTACK position, not its file start. Envelopes MEASURED for
//   this build at 0.2 s RMS on this machine: transition_rapid_whoosh peaks 0.18 s in - Cinematic
//   Whoosh 02 peaks 0.84 s - Impact_3 peaks 0.43 s - ding/ding peaks 0.11 s - Soundjay_Impact_Main_01
//   peaks 0.43 s - Tension_Rise_Logo_Reveal_3 peaks 2.56 s - Boom - Big Reveal peaks 0.00 s - Cash
//   Register attacks 0.29 s. Each cue below is started EARLY by exactly that offset so the crest
//   lands on the frame it punctuates.
export const SFX_MLI: Sfx[] = [
  { t:  0.00, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.46, dur: 1.00 }, // frame-0 thumbnail cut (crest 0.18)
  { t:  0.46, src: staticFile('sfx/Cinematic Whoosh 02.wav'),               vol: 0.48, dur: 2.20 }, // sweeps INTO the HOOK full-screen (crest 1.30 = the cut)
  { t:  3.77, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.34, dur: 1.00 }, // hook full-screen OUT (crest 3.95)
  { t:  6.93, src: staticFile('sfx/Impacts/Impact_3.wav'),                  vol: 0.26, dur: 2.00 }, // the LOSS: lands on "five" (7.36)
  { t: 11.59, src: staticFile('sfx/ding/ding.mp3'),                         vol: 0.16, dur: 1.10 }, // rung 1 "2x"  (11.70)
  { t: 13.65, src: staticFile('sfx/ding/ding.mp3'),                         vol: 0.19, dur: 1.10 }, // rung 2 "5x"  (13.76)
  { t: 15.65, src: staticFile('sfx/ding/ding.mp3'),                         vol: 0.22, dur: 1.10 }, // rung 3 "10x" (15.76)
  { t: 17.33, src: staticFile('sfx/Impacts/Soundjay_Impact_Main_01.wav'),   vol: 0.26, dur: 1.60 }, // rung 4 "50x" (17.76) - the motif tops out on an impact
  { t: 18.89, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_3.wav'), vol: 0.22, dur: 4.10 }, // RISER crests on the CLIMAX cut (21.45)
  { t: 21.70, src: staticFile('sfx/Boom - Big Reveal.wav'),                 vol: 0.50, dur: 2.40 }, // PAYOFF: lands ON "900" - the biggest hit of the short
  { t: 22.53, src: staticFile('sfx/Cash Register.mp3'),                     vol: 0.26, dur: 1.90 }, // kaching ATTACKS on "1000x" (22.82); nothing over the hard-out line
];

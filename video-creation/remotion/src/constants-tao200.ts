import { staticFile } from 'remotion';
import type { BrollEv, Sfx } from './_kit';
import type { BadgeEv, ThumbDef } from './LivestreamShort';

// ─── tao-under-200-last-chance (batch: October-pumps, clip #3, variant: full) ───────────────────
// "Your Last Chance At TAO Under $200" — this may be the last stretch where the larger caps, and
// TAO especially, are cheap: imagine five years from now looking back at TAO under $200 and being
// glad you bought. Don't be the guy who says "damn, I should have bought when I saw it under $200,
// CodeMonkey Mike was talking about it and I just didn't pay attention."
//
// Base clip: tao-under-200-last-chance-final.mp4 (raw cut -> Phase 5 tighten -> 5B desilence -> 5C
// filler removal). ALREADY composited vertical (screen-share on top, webcam below), 1080x1920 @
// 25 fps, 29.56 s. FINAL, do NOT re-cut and do NOT re-split the zones. The comp runs at 30 fps;
// OffthreadVideo resamples the 25 fps source by TIME, so every cue below is plain seconds taken
// from the clip's own caption/word timings (clip-relative, 0-based).
//
// Render (public-dir = the CLIP's render-assets/, which holds the spine + thumbnail + b-roll + sfx):
//   npx remotion render src/index.ts TaoUnder200LastChance \
//     out/October-pumps/3-tao-under-200-last-chance.mp4 \
//     --public-dir "<repo>/video-creation/shorts/October-pumps/tao-under-200-last-chance/render-assets"

export const T200_FPS = 30;
export const T200_DURATION = 886; // 29.533 s @30, just inside the 29.56 s clip (no black tail frame)

export const CLIP_T200  = staticFile('tao-under-200-last-chance-final.mp4');
export const THUMB_T200 = staticFile('thumbnail-tao200.png');

// Layout geometry, MEASURED on this clip (row-mean gradient scan at t=1/5/10/15/20/25/29 s; all
// seven frames put the hard screen-share/webcam divider on the same row, gradient 141-217 grey
// levels vs 20-40 for the next-strongest row).
export const T200_SEAM  = 854; // content zone = 0..854 (CoinMarketCap); webcam plays below
export const T200_CAP_Y = 890; // caption centre: below the seam, above his hairline (~1030), never his eyes (~1400)

// ─── B-roll beats (authored in BROLL-PLAN.md BEFORE generation) ────────────────────────────────
// Coverage budget (SKILL "B-roll coverage budget", HALVED 2026-07-14):
//   9.93 s covered / 29.56 s = 33.6 % b-roll, 19.63 s = 66.4 % BASE SHOWING. Targets ~30 % / ~70 %
//   (bands 25-35 % / 65-75 %) => in band. 5 distinct images, zero reuse inside the clip.
// 2 full-screens ONLY (the hook and the "don't be that guy" climax) — inside the FIRM 1-3 cap, and
// 24.3 s apart, so no full->full base flash exists.
// The screen-share is the RECEIPT of this clip: from 8.00 s to the end it is the CoinMarketCap
// Bittensor page showing 199.73 / 2.22B mcap / TAO-USDT 199.67 — i.e. TAO under $200 on screen while
// he says it. That 10.30 s stretch is deliberately left uncovered. The two windows where the
// screen-share is OFF-MESSAGE or DEAD are both covered: the MONAD page that occupies 0.00-4.40 and
// the blank "Loading Data" page at 6.40-8.00.
// staticFile() calls are LITERAL strings on purpose — the finalized-short gate scans for literal refs.
export const BROLL_T200: BrollEv[] = [
  // BASE 0.00-1.60 — open on Mike + the screen-share (the frame-0 thumb is ONE frame; base from frame 1)
  { src: staticFile('broll-tao200-hook.png'),         tIn:  1.60, tOut:  3.60, mode: 'full'    }, // HOOK: "your last chance at this point to get any of the larger cap" (covers the OFF-MESSAGE Monad page)
  { src: staticFile('broll-tao200-tao-monolith.png'), tIn:  3.60, tOut:  6.40, mode: 'content' }, // "especially like with TAO. you might have your last chance" — REAL TAO mark (reference) — butt-joined, HARD CUT
  { src: staticFile('broll-tao200-hourglass.png'),    tIn:  6.40, tOut:  8.20, mode: 'content' }, // "over these few weeks is TAO" — REAL TAO mark (reference); covers the DEAD loading page — butt-joined, HARD CUT
  // tOut 8.20 (not 8.00) is MEASURED, not rounded: the CMC chart does not finish painting until ~8.08
  // (frames at 7.84/7.92/8.00 still read "Loading Data"), and BrollLayer fades out over tOut-0.12..tOut,
  // so ending at 8.00 crossfaded to a WHITE loading page. Caught on the first full render's boundary frames.
  // BASE 8.20-18.30 (10.10 s) — THE RECEIPT: the CMC Bittensor page (199.73, under $200) is up for the
  // whole "imagine five years from now" section, exactly what he is describing (+ 2 badges).
  { src: staticFile('broll-tao200-regret.png'),       tIn: 18.30, tOut: 20.00, mode: 'content' }, // "don't be that guy who says, damn, i should have bought" — REAL TAO mark (reference)
  // BASE 20.00-27.90 (7.90 s) — "codemonkey mike was talking about it, but i just didn't pay attention" (+ the FOLLOW ME badge)
  // CLIMAX: "don't be that guy. nobody wants to be that guy." tOut 29.70 is PAST the comp's last frame
  // (29.533) on purpose: BrollLayer fades out over tOut-0.12..tOut, so a tOut of 29.53 dissolved the
  // closing image back into the webcam over the final 4 frames (also caught on the first full render).
  // With tOut beyond the render range the close holds at full opacity and the loop-out frame is the image.
  { src: staticFile('broll-tao200-that-guy.png'),     tIn: 27.90, tOut: 29.70, mode: 'full'    },
];

// ─── Badges (code-drawn text, content zone y300) ────────────────────────────────────────────────
// Every badge sits over a BASE stretch (never over a b-roll beat), no two share a time window
// (gaps 1.70 s / 5.70 s), they live at y300 while captions live at y890, and all start long after
// the frame-0 thumb. Each states something the captions do NOT. "FOLLOW ME" is the persona CTA
// wording (never a handle). No em dashes anywhere.
//
// ⚠ STRING-LENGTH BUDGET (measured on the draft render, then fixed): the shared `Badge` is
// absolutely positioned at left:50% with no width, so its containing width is only HALF the frame
// (540 px) and its content box is ~436 px. Longer strings WRAP and the extra line spills OUTSIDE the
// rounded border. Measured safe limits: line2/solo-line1 (82 px) <= 7 chars, line1 with a line2
// (60 px) <= 11 chars, sub (32 px + 0.12em tracking) <= 15 chars. The first draft used
// 'FROM NOW' / 'MAX SUPPLY' / 'THIS PRICE LOOKS INSANE' / 'SO YOU ARE NOT THAT GUY' and all four
// overflowed; every string below is inside the budget and was re-verified on stills.
export const BADGES_T200: BadgeEv[] = [
  { tIn: 10.40, tOut: 12.90, color: '#00e5ff', line1: '5 YEARS', line2: 'LATER',  sub: 'REMEMBER THIS',  top: 300 },
  { tIn: 14.60, tOut: 16.90, color: '#39ff14', line1: '21M MAX', line2: 'SUPPLY', sub: 'LIKE BITCOIN',   top: 300 },
  { tIn: 22.60, tOut: 25.00, color: '#ffe600', line1: 'FOLLOW',  line2: 'ME',     sub: 'DO NOT MISS IT', top: 300 },
];

// ─── Frame-0 thumbnail (IG/TikTok cover) ────────────────────────────────────────────────────────
// ONE frame only (LivestreamShort defaults thumb.durS to 1/fps) — generated background art (built
// WITH the bittensor-tao.png reference) with the hook title drawn in CODE on top, never baked into
// the image. No em dashes; the chip reads "DO NOT BE THAT GUY", not a contraction.
export const THUMB_DEF_T200: ThumbDef = {
  img: THUMB_T200,
  title: 'YOUR LAST\nCHANCE AT TAO\nUNDER $200',
  chip: 'DO NOT BE THAT GUY',
  chipColor: '#39ff14',
  titleSize: 106,
};

// ─── SFX (shared library, COPIED into render-assets/sfx/; every event stays under the VO) ───────
// ⚠ Cue points are each SFX's own measured PEAK/ATTACK position, not its file start. Envelopes
//   measured on this machine at 20 ms RMS: transition_rapid_whoosh peaks 0.18 s in - Cinematic
//   Whoosh 06 peaks 0.58 s - Cinematic Whoosh 02 peaks 0.86 s - Impact_3 peaks 0.32 s -
//   ding/sudden-shock peaks 0.34 s - TING peaks 0.84 s - Edgy_Riser peaks 5.14 s - Boom - Big
//   Reveal peaks 0.04 s. Each cue below is started EARLY by exactly that offset so the crest lands
//   on the frame it punctuates. Quiet FILES (Cinematic Whoosh 06 at -19.7 dB peak) get a higher vol
//   so they are actually audible under the VO.
export const SFX_T200: Sfx[] = [
  { t:  0.00, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.46, dur: 1.00 }, // frame-0 thumbnail cut (crest 0.18)
  { t:  1.02, src: staticFile('sfx/Cinematic Whoosh 06.wav'),     vol: 0.80, dur: 2.20 }, // sweeps INTO the HOOK full-screen (crest 1.60 = the cut)
  { t:  3.42, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.40, dur: 1.00 }, // hard cut hook -> TAO monolith (3.60)
  { t:  5.54, src: staticFile('sfx/Cinematic Whoosh 02.wav'),     vol: 0.50, dur: 2.30 }, // hard cut monolith -> hourglass (6.40)
  { t:  8.04, src: staticFile('sfx/Impacts/Impact_3.wav'),        vol: 0.46, dur: 2.40 }, // IMPACT on "$200" (8.36) and on the frame the real TAO page is revealed
  { t: 18.30, src: staticFile('sfx/ding/sudden-shock.mp3'),       vol: 0.42, dur: 1.90 }, // onset stings the regret cutaway (18.30), crest lands on "damn" (18.64)
  { t: 21.12, src: staticFile('sfx/TING SOUND EFFECT.mp3'),       vol: 0.48, dur: 2.10 }, // bell on "codemonkey mike" (21.96)
  { t: 22.76, src: staticFile('sfx/risers/Edgy_Riser.wav'),       vol: 0.26, dur: 5.20 }, // riser BUILDS INTO the climax (crest 27.90)
  { t: 27.90, src: staticFile('sfx/Boom - Big Reveal.wav'),       vol: 0.52, dur: 1.64 }, // WEIGHT on "don't be that guy", exactly on the CLIMAX full-screen cut
];

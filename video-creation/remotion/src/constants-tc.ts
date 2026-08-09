// constants-tc.ts — data for "$1,000 Into 10 Coins: The Real 1000x Math"
// batch what-if-1000x, clip #1, slug 1000x-math-ten-coins (variant: long)
//
// Contract: video-creation/livestream-repurpose/skills/remotion-shorts-build/SKILL.md
// Plan:     video-creation/shorts/what-if-1000x/1000x-math-ten-coins/BROLL-PLAN.md
//
// Render (public-dir = the CLIP's render-assets/, which holds the spine + thumbnail + b-roll + sfx):
//   npx remotion render src/index.ts TenCoins1000xMath out/what-if-1000x/1-1000x-math-ten-coins.mp4 \
//     --public-dir "../shorts/what-if-1000x/1000x-math-ten-coins/render-assets"
import { staticFile } from 'remotion';
import { CAPTIONS_TC } from './captionsTC';
import type { ShortData, BadgeEv } from './LivestreamShort';
import type { BrollEv, Sfx } from './_kit';

export const TC_FPS = 30;
// Spine: 73.560 s container / 73.560 s video stream / 73.560 s audio stream (25 fps source).
// 2206 @30 = 73.5333 s, inside both, so the render never lands on a black tail frame or an
// audio underrun.
export const TC_DURATION = 2206;

export const TC_CLIP = staticFile('1000x-math-ten-coins.mp4');
export const THUMB_TC = staticFile('thumbnail-tc.png');

// Measured on THIS clip (green-onset row scan at t = 2,8,15,22,30,38,46,52,60,66,71 s): the webcam's
// green screen starts at y=854 on every single sample. Content-mode b-roll covers 0..855.
export const TC_SEAM = 855;
// Caption centre: 70 px below the seam, on his hairline, well above his eyes (y ~1180-1260).
export const TC_CAP_Y = 925;

// ─── B-ROLL ────────────────────────────────────────────────────────────────────────────────────────
// HALVED budget (SKILL: ~25-35 % generated b-roll / ~65-75 % base showing): 8 distinct images,
// 23.58 s of 73.53 s = 32.1 % b-roll / 67.9 % base showing. 3 FULL-SCREEN moments (hook, ladder
// climax, moon payoff), at the FIRM 1-3 cap and 18.6 s / 45.9 s apart, so there is no sub-1 s base
// flash between full-screens. B3 -> B4 are ADJACENT (gap 0 s) so BrollLayer hard-cuts them.
//
// The two long BASE stretches are the POINT of this clip - the screen-share is the receipt:
//   38.30-51.40  the real CoinMarketCap Housecoin page showing "Market cap $913.63K" while he says
//                "if housecoin does fly at a 900k market cap you could be looking at a 1000x".
//   54.40-71.30  the LAB CMC page carrying a live-chat line that literally reads "spray and prey is
//                a good one great saying" while he says "you can't just be random about your plays".
export const BROLL_TC: BrollEv[] = [
  // BASE 0.00-1.20 — frame-0 cover hands off to Mike + the screen-share (SKILL rule 5: base first).
  { src: staticFile('broll-wi1-hook-ten-coins.png'),  tIn:  1.20, tOut:  4.70, mode: 'full'    }, // HOOK: "10 different good coins, but you've researched them"
  // BASE 4.70-6.90 — "let's say if you have a failure rate"
  { src: staticFile('broll-wi1-five-misses.png'),     tIn:  6.90, tOut:  9.90, mode: 'content' }, // "of 50% and you lose money on five of those"
  // BASE 9.90-13.40 — "coin number six, maybe it's going to underperform" (badge A)
  { src: staticFile('broll-wi1-ladder-low.png'),      tIn: 13.40, tOut: 16.50, mode: 'content' }, // LADDER low rungs: "a 2x ... a 5x"
  { src: staticFile('broll-wi1-ladder-high.png'),     tIn: 16.50, tOut: 18.90, mode: 'content' }, // LADDER high rungs: "a 10x coin number nine" (hard cut, gap 0 s)
  // BASE 18.90-23.30 — "your 50x and then maybe your real winner is going to" (badge B + riser)
  { src: staticFile('broll-wi1-900x-climax.png'),     tIn: 23.30, tOut: 25.45, mode: 'full'    }, // CLIMAX: "do like a 900x or 1000x"
  // BASE 25.45-34.10 — "so you're going to make that money ... identify a group of good memes" (badge C)
  { src: staticFile('broll-wi1-housecoin-flies.png'), tIn: 34.10, tOut: 38.30, mode: 'content' }, // "could just go flying. maybe housecoin will be one of them" (REFERENCE-GATED: housecoin.webp)
  // BASE 38.30-51.40 — THE RECEIPT: the real CMC Housecoin page, "Market cap $913.63K" (badge D)
  { src: staticFile('broll-wi1-bulls-running.png'),   tIn: 51.40, tOut: 54.40, mode: 'content' }, // "because those bulls start running"
  // BASE 54.40-71.30 — THE RECEIPT: the LAB page + the "spray and prey" chat line (badges E, F)
  { src: staticFile('broll-wi1-moon-payoff.png'),     tIn: 71.30, tOut: 73.53, mode: 'full'    }, // PAYOFF: "and just go to the goddamn moon, man"
];

// ─── Badges (code-drawn, content zone) ───────────────────────────────────────────────────────────
// Each states something the captions do NOT, and every window sits inside a BASE stretch with no
// b-roll and no other badge running (overlays must never collide in time AND space). Bands are
// chosen so the receipt underneath stays readable: top 620 sits over the CMC markets table and
// leaves the market-cap sidebar + chart visible; top 300 sits over the chart and leaves the chat
// line / markets table visible. Every plate sits above the seam (854) and the caption centre (925).
// Line lengths are MEASURED against the plate's real max content width, not guessed: the plate is
// `left:50%` with no width, so its containing box is 1080-540 = 540 px and the content box is
// 540 - 104 (padding) - 10 (border) = 426 px. Montserrat Black runs ~0.68em/char, so line1 (60 px)
// holds ~10 chars, line2 (82 px) ~7, and sub (32 px + 0.12em tracking) ~18 before it wraps.
// Only badge E deliberately wraps ("SPRAY AND" / "PRAY"), which lands its plate at y 136-464.
export const BADGES_TC: BadgeEv[] = [
  { tIn: 10.80, tOut: 13.20, color: '#ff5252', line1: '50% FAIL RATE',  line2: 'IS FINE', sub: 'FIVE OF TEN MISS',  top: 620 },
  { tIn: 20.20, tOut: 23.10, color: '#ffe600', line1: 'COIN 10',        line2: '900x',    sub: 'THE ONE THAT PAYS', top: 300 },
  { tIn: 28.20, tOut: 31.00, color: '#00e5ff', line1: '$100 EACH',      line2: '10 WAYS', sub: 'NOT $1,000 ON ONE', top: 620 },
  { tIn: 40.60, tOut: 44.60, color: '#ff9f1c', line1: 'HOUSECOIN',      line2: '$913K',   sub: 'MARKET CAP TODAY',  top: 620 },
  { tIn: 56.20, tOut: 59.20, color: '#ff5252', line1: 'SPRAY AND PRAY', line2: 'LOSES',   sub: 'RESEARCH ALL TEN',  top: 300 },
  { tIn: 64.40, tOut: 67.20, color: '#39ff14', line1: 'FOLLOW ME',      line2: 'DAILY',   sub: 'LIVE CRYPTO CALLS', top: 620 },
];

// ─── Frame-0 thumbnail (IG/TikTok cover) ─────────────────────────────────────────────────────────
// ONE frame only (LivestreamShort defaults thumb.durS to 1/fps): generated background art with the
// title/chip drawn in CODE on top, never baked into the art. Open loop: the amount and the split are
// stated, the payoff is not. No em dashes.
export const THUMB_DEF_TC = {
  title: '$1,000\nINTO 10 COINS',
  chip: 'THE REAL 1000x MATH',
  chipColor: '#ffe600',
  titleSize: 118,
  img: THUMB_TC,
};

// ─── SFX ─────────────────────────────────────────────────────────────────────────────────────────
// Whoosh on the frame-0 cut and on every b-roll cut; four escalating tings that ladder 2x -> 50x
// (each fires ~0.1 s BEFORE its spoken number so it never masks it); dings on the badge reveals;
// a riser that builds INTO each of the two payoffs, cut by the whoosh, then an INSTANT-TRANSIENT
// impact (not a pre-swell one) so the hit lands in the gap, not on top of the line.
// Volumes are deliberately low - an SFX cue that masks the VO is a build defect, not a taste call.
export const SFX_TC: Sfx[] = [
  { t:  0.02, src: staticFile('sfx/Cinematic Whoosh 02.wav'),               vol: 0.38, dur: 1.00 }, // frame-0 thumbnail cut
  { t:  1.18, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.40, dur: 0.90 }, // cut INTO the hook full-screen
  { t:  6.88, src: staticFile('sfx/Cinematic Whoosh 06.wav'),               vol: 0.28, dur: 0.80 }, // cut into the "five misses" cutaway
  { t: 10.78, src: staticFile('sfx/DING.mp3'),                              vol: 0.22, dur: 1.10 }, // badge A
  { t: 13.36, src: staticFile('sfx/Cinematic Whoosh 06.wav'),               vol: 0.26, dur: 0.70 }, // cut into the ladder
  { t: 13.78, src: staticFile('sfx/TING SOUND EFFECT.mp3'),                 vol: 0.20, dur: 0.60 }, // rung 2x
  { t: 15.82, src: staticFile('sfx/TING SOUND EFFECT.mp3'),                 vol: 0.20, dur: 0.60 }, // rung 5x
  { t: 17.84, src: staticFile('sfx/TING SOUND EFFECT.mp3'),                 vol: 0.21, dur: 0.60 }, // rung 10x
  { t: 19.86, src: staticFile('sfx/TING SOUND EFFECT.mp3'),                 vol: 0.22, dur: 0.70 }, // rung 50x
  { t: 20.10, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_3.wav'), vol: 0.13, dur: 3.30 }, // riser into the 900x cut
  { t: 23.28, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.38, dur: 0.90 }, // cut INTO the climax full-screen
  { t: 25.14, src: staticFile('sfx/Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3'), vol: 0.22, dur: 1.60 }, // IMPACT in the gap after "1000x"
  { t: 28.18, src: staticFile('sfx/DING.mp3'),                              vol: 0.20, dur: 1.10 }, // badge C
  { t: 34.08, src: staticFile('sfx/Cinematic Whoosh 06.wav'),               vol: 0.26, dur: 0.80 }, // cut into the housecoin cutaway
  { t: 40.58, src: staticFile('sfx/DING.mp3'),                              vol: 0.22, dur: 1.20 }, // badge D (the $913K receipt)
  { t: 51.38, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.34, dur: 0.90 }, // cut into the running bulls
  { t: 56.18, src: staticFile('sfx/DING.mp3'),                              vol: 0.20, dur: 1.10 }, // badge E
  { t: 64.38, src: staticFile('sfx/TING SOUND EFFECT.mp3'),                 vol: 0.20, dur: 1.00 }, // badge F (follow me)
  // SWEPT DOWN after whisper-verifying the FIRST full render (SKILL QA rule 7: an SFX cue that masks
  // the VO is a build DEFECT). At the planned 0.38 the whoosh sat on the payoff word "pop" (71.36) and
  // the mix transcribed "they're just like" with "pop" GONE, while the spine alone reads "it just like
  // pop". Swept offline against Whisper medium (spine + cues summed, normalize=0): 0.38 loses it, 0.20
  // brings it back. Riser trimmed 0.13 -> 0.10 in the same pass (verified it keeps "pop"). The payoff
  // IMPACT at 72.86 is NOT lowered - the contract says sweep the masking cue, never the payoff hit.
  { t: 69.20, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_2.wav'), vol: 0.10, dur: 2.20 }, // riser into the payoff
  { t: 71.28, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.20, dur: 0.90 }, // cut INTO the moon full-screen
  { t: 72.86, src: staticFile('sfx/Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3'), vol: 0.20, dur: 1.60 }, // IMPACT just before "moon, man"
];

export const TC: ShortData = {
  clip: TC_CLIP,
  fps: TC_FPS,
  durationS: TC_DURATION / TC_FPS,
  capY: TC_CAP_Y,
  seam: TC_SEAM,
  captions: CAPTIONS_TC,
  broll: BROLL_TC,
  badges: BADGES_TC,
  sounds: SFX_TC,
  thumb: THUMB_DEF_TC,
};

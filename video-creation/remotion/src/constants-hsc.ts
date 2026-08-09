// constants-hsc.ts — data for "Once This Happens, Housecoin Goes 1,000x."
// batch peach-minute, clip #5, slug 05-housecoin-still-holding (variant: long)
//
// Contract: video-creation/livestream-repurpose/skills/remotion-shorts-build/SKILL.md
// Plan:     video-creation/shorts/peach-minute/05-housecoin-still-holding/BROLL-PLAN.md
//
// Render (public-dir = the CLIP's render-assets/, which holds the spine + thumbnail + b-roll + sfx):
//   npx remotion render src/index.ts HousecoinStillHolding out/peach-minute/5-housecoin-still-holding.mp4 \
//     --public-dir "../shorts/peach-minute/05-housecoin-still-holding/render-assets"
import { staticFile } from 'remotion';
import { CAPTIONS_HSC } from './captionsHsc';
import type { ShortData, BadgeEv } from './LivestreamShort';
import type { BrollEv, Sfx } from './_kit';

export const HSC_FPS = 30;
// Spine: 32.400 s container / 32.400 s video stream, 32.367 s audio stream. 971 @30 = 32.3667 s,
// inside both, so the render never lands on a black tail frame or an audio underrun.
export const HSC_DURATION = 971;

export const HSC_CLIP = staticFile('05-housecoin-still-holding.mp4');
export const THUMB_HSC = staticFile('thumbnail-hsc.png');

// Measured on THIS clip (green-onset row scan at t=0.5..31.5 s, every 1 s): the webcam's green screen
// starts at y=854 on every sample. Content-mode b-roll covers 0..855.
export const HSC_SEAM = 855;
// Caption centre: 70 px below the seam, on the top of his hair, ~400 px above his eyes (~1330-1430).
export const HSC_CAP_Y = 925;

// ─── B-ROLL ────────────────────────────────────────────────────────────────────────────────────────
// HALVED budget (SKILL: ~25-35 % generated b-roll / ~65-75 % base showing): 3 distinct images,
// 9.44 s of 32.40 s = 29.1 % b-roll / 70.9 % base showing. 2 FULL-SCREEN moments (hook + climax),
// inside the FIRM 1-3 cap and 24 s apart, so there is no sub-1 s base flash between full-screens.
//
// The two long BASE stretches are the POINT of this clip - the screen-share is the receipt:
//   4.04-14.50  the real Kraken delisting notice with GHIBLI and HOUSE inside the list, then the CMC
//               search showing Ghiblification/Housecoin, then the CMC Housecoin page.
//   18.20-28.06 Housecoin's X feed posting 4 hours ago, then the CMC "Housecoin Markets" table
//               (KuCoin, HTX, Kraken, XT.COM, DigiFinex, CoinDCX, Orca... 23 markets) = literally
//               "they still got other centralized exchanges".
// B-roll only earns the hook, the dead blank-white screen-share (14.50-18.00), and the climax.
export const BROLL_HSC: BrollEv[] = [
  // BASE 0.00-1.30 — frame-0 cover hands off to Mike + the Kraken notice.
  { src: staticFile('broll-pm05-delist-notice.png'),     tIn:  1.30, tOut:  4.04, mode: 'full'    }, // HOOK: "kraken is going to delist all these" (REFERENCE-GATED)
  // BASE 4.04-14.50 — the delisting list, the CMC search, the CMC Housecoin page (badge A)
  // PERSONA REMAP (build-time, no mid-build regeneration per SKILL step 5): this was TWO beats -
  // 14.50-16.55 "still in the game" + 16.55-18.20 broll-pm05-content-nonstop.png. Visual inspection
  // caught real Pepe and Doge marks papering the walls of the content-nonstop art (other coins must be
  // blank/generic), so that asset was quarantined to _qa/rejected/ and its beat was MERGED into this
  // one instead of being filled with duplicate imagery (no image may serve two beats in one clip).
  // Coverage is unchanged (14.50-18.20 = 3.70 s) and the "still making content non-stop" receipt is
  // the base video anyway: his X feed, posting 4 hours ago, lands at 18.50.
  { src: staticFile('broll-pm05-still-in-the-game.png'), tIn: 14.50, tOut: 18.20, mode: 'content' }, // "still in the game / favorite plays / still making content" (REFERENCE-GATED)
  // BASE 18.20-28.06 — the X feed receipt + the 23-markets receipt + "definitely still holding" (badges B, C, D)
  { src: staticFile('broll-pm05-1000x-climax.png'),      tIn: 28.06, tOut: 31.06, mode: 'full'    }, // CLIMAX: "hopefully it's gonna do like a 1000x" (REFERENCE-GATED)
  // BASE 31.06-32.37 — back on his face for the hard-out sign-off.
];

// ─── Badges (code-drawn, content zone) ───────────────────────────────────────────────────────────
// Each states something the captions do NOT, and every window sits inside a BASE stretch with no
// b-roll and no other badge running (overlays must never collide in time AND space).
// MEASURED, not guessed (a badge is ~380-440 px tall because `left:50%` shrink-to-fits line2 into a
// ~440 px column, so line2 wraps): at top 600 the plate renders y 409-789, at top 620 y ~430-840, at
// top 320 y ~128-512. The first pass put badge C at top 190 and it rendered y 0-384, CLIPPED by the
// frame edge - fixed here. Every plate now sits fully inside the frame, above the seam (855) and
// above the caption band (top edge ~890), and each band is chosen to leave that beat's receipt readable:
//   A top 600 - covers the already-read "key dates" bullets, the delisted-asset list stays visible
//   B top 620 - the X feed's "Housecoin - 4h" post stays visible ABOVE the plate (it IS the receipt)
//   C top 320 - the CMC markets table keeps 7 exchange rows (Kraken, XT, DigiFinex, CoinDCX, Orca...)
export const BADGES_HSC: BadgeEv[] = [
  { tIn:  8.60, tOut: 11.00, color: '#ffe600', line1: '21 ASSETS CUT',  line2: 'ONE EXCHANGE',    sub: 'KRAKEN DELISTING CYCLE', top: 600 },
  { tIn: 18.90, tOut: 21.10, color: '#00e5ff', line1: 'STILL POSTING',  line2: '4 HOURS AGO',     sub: 'THE TEAM DID NOT QUIT',  top: 620 },
  { tIn: 22.20, tOut: 24.60, color: '#39ff14', line1: '23 MARKETS',     line2: 'STILL LIVE',      sub: 'KUCOIN HTX XT COINDCX',  top: 320 },
  { tIn: 25.80, tOut: 27.90, color: '#ffe600', line1: 'FOLLOW ME',      line2: 'FOR MEME PLAYS',  sub: 'DAILY CRYPTO STREAMS',   top: 600 },
];

// ─── Frame-0 thumbnail (IG/TikTok cover) ─────────────────────────────────────────────────────────
// ONE frame only (LivestreamShort defaults thumb.durS to 1/fps): generated background art with the
// title/chip drawn in CODE on top, never baked into the art.
// REWRITTEN 2026-07-29 (Mike): the cover must NOT say Housecoin got delisted. The delisting read
// bearish and closed the loop on the cover; the event is now an unnamed "this" so the only thing
// on screen is the upside. Reads top to bottom as "ONCE THIS HAPPENS / HOUSECOIN GOES 1000X".
// PRESENT tense "HAPPENS", not "HAPPENED" (Mike, same day): the past tense dates the hook and
// implies the move already ran; present tense keeps it ahead of the viewer.
// titleSize 150 -> 132 because line 2 grew from 5 to 10 characters. No em dashes.
export const THUMB_DEF_HSC = {
  title: 'HOUSECOIN\nGOES 1000X',
  chip: 'ONCE THIS HAPPENS',
  chipColor: '#ff9f1c',
  titleSize: 132,
  img: THUMB_HSC,
};

// ─── SFX ─────────────────────────────────────────────────────────────────────────────────────────
// Whoosh on the frame-0 cut and on BOTH full-screen cuts; dings/tings on the two on-screen receipts
// (posted 4 hours ago, 23 live markets); a riser that builds INTO the payoff and is cut by the
// IMPACT on "1000x". Volumes are deliberately low - an SFX cue that masks the VO is a build defect.
export const SFX_HSC: Sfx[] = [
  { t:  0.02, src: staticFile('sfx/Cinematic Whoosh 02.wav'),               vol: 0.40, dur: 1.00 }, // frame-0 thumbnail cut
  { t:  1.28, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.42, dur: 0.90 }, // cut INTO the hook full-screen
  { t:  8.58, src: staticFile('sfx/DING.mp3'),                              vol: 0.26, dur: 1.20 }, // badge A: 21 assets cut
  { t: 14.48, src: staticFile('sfx/Cinematic Whoosh 06.wav'),               vol: 0.30, dur: 0.80 }, // cut into the b-roll cutaway
  { t: 18.88, src: staticFile('sfx/TING SOUND EFFECT.mp3'),                 vol: 0.26, dur: 1.30 }, // RECEIPT: posted 4 hours ago
  { t: 22.18, src: staticFile('sfx/DING.mp3'),                              vol: 0.24, dur: 1.20 }, // RECEIPT: 23 markets still live
  { t: 28.04, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.36, dur: 0.90 }, // cut INTO the climax full-screen
  { t: 28.44, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_3.wav'), vol: 0.15, dur: 1.00 }, // riser into the payoff
  { t: 29.40, src: staticFile('sfx/Impacts/Impact_2.wav'),                  vol: 0.28, dur: 2.00 }, // IMPACT on "1000x"
];

export const HSC: ShortData = {
  clip: HSC_CLIP,
  fps: HSC_FPS,
  durationS: HSC_DURATION / HSC_FPS,
  capY: HSC_CAP_Y,
  seam: HSC_SEAM,
  captions: CAPTIONS_HSC,
  broll: BROLL_HSC,
  badges: BADGES_HSC,
  sounds: SFX_HSC,
  thumb: THUMB_DEF_HSC,
};

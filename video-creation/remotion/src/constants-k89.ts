// constants-k89.ts - data for "89% Said Kaspa Over the Dollar"
// batch whatif, clip #2, slug 89-percent-kaspa-over-dollar (variant: full)
//
// Contract: video-creation/livestream-repurpose/skills/remotion-shorts-build/SKILL.md
// Plan:     video-creation/shorts/whatif/89-percent-kaspa-over-dollar/BROLL-PLAN.md
//
// Render (public-dir = the CLIP's render-assets/, which holds spine + thumbnail + b-roll + sfx):
//   npx remotion render src/index.ts KaspaOverDollar out/whatif/2-89-percent-kaspa-over-dollar.mp4 \
//     --public-dir "../shorts/whatif/89-percent-kaspa-over-dollar/render-assets"
import { staticFile } from 'remotion';
import { CAPTIONS_K89 } from './captionsK89';
import type { ShortData } from './LivestreamShort';
import type { BrollEv, Sfx } from './_kit';

export const K89_FPS = 30;
export const K89_DURATION = 2199; // 73.30 s @30, just inside the 73.32 s video stream (no black tail)

export const K89_CLIP = staticFile('89-percent-kaspa-over-dollar-final.mp4');
export const THUMB_89K = staticFile('thumbnail-89k.png');

// Measured on THIS clip (row-green scan at t=3/20/40/60/70s): the X / CoinMarketCap screen-share ends
// and the green-screen webcam begins at y=854 (consistent across all segments). Content-mode b-roll
// covers 0..854.
export const K89_SEAM = 854;
// Caption centre: 71 px below the seam, over Mike's hairline (~950), nowhere near his eyes (~1430).
export const K89_CAP_Y = 925;

// ─── B-ROLL ──────────────────────────────────────────────────────────────────────────────────────
// HALVED budget (SKILL "B-roll coverage budget"): 22.45 s of 73.30 s = 30.6 % b-roll / 69.4 % base.
// 7 distinct images, 2 full-screens (hook / climax ender) = the firm 1-3 cap. This clip is
// RECEIPT-heavy: the CMC #1-bullish page and the two X polls (59% stacking, 89% Kaspa over the dollar)
// are the proof, so those stretches SHOW AS BASE and are deliberately uncovered. See BROLL-PLAN.md.
export const BROLL_K89: BrollEv[] = [
  { src: staticFile('broll-89k-hero.png'),    tIn:  0.00, tOut:  3.30, mode: 'full'    }, // HOOK: "everybody's talking about Kaspa"
  // BASE 3.30-6.90 - reveal Mike + the CMC page
  { src: staticFile('broll-89k-snark.png'),   tIn:  6.90, tOut:  9.90, mode: 'content' }, // "you're the only one talking about Kaspa"
  // BASE 9.90-23.20 - RECEIPT: real CMC Community Sentiment, Kaspa 90.9% #1 bullish
  { src: staticFile('broll-89k-bleeds.png'),  tIn: 23.20, tOut: 26.20, mode: 'content' }, // "Kaspa bleeds harder than TAO, this is the pattern"
  // BASE 26.20-46.40 - RECEIPT: real X poll (59% stacking every dip, 26% waiting) - do NOT cover
  { src: staticFile('broll-89k-missout.png'), tIn: 46.40, tOut: 47.85, mode: 'content' }, // "you're just waiting to miss out"
  // BASE 47.85-50.40 - "it manufactures new dollar buyers"
  { src: staticFile('broll-89k-goldoil.png'), tIn: 50.40, tOut: 54.50, mode: 'content' }, // "gold, oil, now stablecoins"
  { src: staticFile('broll-89k-dollar.png'),  tIn: 54.50, tOut: 58.30, mode: 'content' }, // adjacent -> HARD CUT: "getting OUT of the dollar"
  // BASE 58.30-69.50 - CLIMAX RECEIPT: real 89.7% poll + Mike's ~3.5s stunned reaction. LET IT BREATHE.
  { src: staticFile('broll-89k-result.png'),  tIn: 69.50, tOut: 73.50, mode: 'full'    }, // CLIMAX: "that's the type of result I like to see"
];

// ─── Frame-0 thumbnail (IG/TikTok cover) ─────────────────────────────────────────────────────────
// ONE frame only (LivestreamShort defaults thumb.durS to 1/fps): generated background art (crumbling
// dollar vs teal Kaspa) with the title/chip drawn in CODE on top, never baked into the art. No em dashes.
export const THUMB_DEF_K89 = {
  title: '89% CHOSE\nKASPA OVER\nTHE DOLLAR',
  chip: 'HIS COMMUNITY POLL',
  chipColor: '#00e5ff',
  titleSize: 122,
  img: THUMB_89K,
};

// ─── SFX ─────────────────────────────────────────────────────────────────────────────────────────
// Whoosh on the frame-0 cut + each transition; a TING on the CMC "#1 bullish" receipt reveal; a RISER
// that builds into the 89% reveal and is cut by the IMPACT on "89%"; a cash-register win on the ender.
// The 89% impact vol is kept moderate so it never masks "89% of people said Kaspa" (whisper-verified).
export const SFX_K89: Sfx[] = [
  { t:  0.02, src: staticFile('sfx/Cinematic Whoosh 02.wav'),                vol: 0.42, dur: 1.20 }, // frame-0 -> hook
  { t:  6.80, src: staticFile('sfx/transition_rapid_whoosh.mp3'),            vol: 0.34, dur: 0.90 }, // into the snark cutaway
  { t: 14.90, src: staticFile('sfx/TING SOUND EFFECT.mp3'),                  vol: 0.34, dur: 1.20 }, // CMC "number one" receipt ding
  { t: 23.10, src: staticFile('sfx/Cinematic Whoosh 06.wav'),                vol: 0.34, dur: 1.00 }, // into the "bleeds harder" cutaway
  { t: 50.30, src: staticFile('sfx/transition_rapid_whoosh.mp3'),            vol: 0.32, dur: 0.90 }, // into the gold/oil progression
  { t: 56.40, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_2.wav'), vol: 0.18, dur: 3.10 }, // RISER into the 89% reveal
  { t: 59.35, src: staticFile('sfx/Boom - Big Reveal.wav'),                  vol: 0.40, dur: 2.60 }, // IMPACT on "89%"
  { t: 69.45, src: staticFile('sfx/Cash Register.mp3'),                      vol: 0.32, dur: 1.60 }, // win on the "result I like to see" ender
];

export const K89: ShortData = {
  clip: K89_CLIP,
  fps: K89_FPS,
  durationS: K89_DURATION / K89_FPS,
  capY: K89_CAP_Y,
  seam: K89_SEAM,
  captions: CAPTIONS_K89,
  broll: BROLL_K89,
  sounds: SFX_K89,
  thumb: THUMB_DEF_K89,
};

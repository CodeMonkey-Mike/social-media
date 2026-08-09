import { staticFile } from 'remotion';
import type { BrollEv, Sfx } from './_kit';
import type { BadgeEv, ThumbDef } from './LivestreamShort';

// ─── hate-eth-bought-it (batch: clarity-act, clip #3, variant: full) ───────────────────────────
// "I Hate ETH But I Bought It" — the personal-conviction contrarian confession: sometimes you don't
// like something but you're in it to make money. He hates ETH, never liked it, bought some anyway as
// an investment, gives it the potential to eventually flip Bitcoin, and calls $10,000 ETH the BEARISH
// case: near term, a mild rally, not even a cycle top.
//
// Base clip: hate-eth-bought-it-tightened-desilenced.mp4, ALREADY composited vertical (screen-share on
// top = a LIVE DexScreener NINEHOOD/WETH chart, webcam below). 1080x1920 @ 25 fps, 33.36 s. Do NOT
// re-split the zones. The comp runs at 30 fps; OffthreadVideo resamples the 25 fps source by TIME, so
// all cue points below are plain seconds taken from whisper-words.json (clip-relative, 0-based).
//
// Render (public-dir = the CLIP's render-assets/, which holds the spine + thumbnail + b-roll + sfx):
//   npx remotion render src/index.ts HateEthBoughtIt \
//     out/clarity-act/3-hate-eth-bought-it.mp4 \
//     --public-dir "<repo>/video-creation/shorts/clarity-act/hate-eth-bought-it/render-assets"

export const HETH_FPS = 30;
export const HETH_DURATION = 1000; // 33.333 s @30, just inside the 33.36 s clip (no black tail frame)

export const CLIP_HETH  = staticFile('hate-eth-bought-it-full.mp4');
export const THUMB_HETH = staticFile('thumbnail-heth.png');

// Layout geometry, MEASURED on THIS clip (row-mean gradient scan at t=1/8/16/24/31 s; all five frames
// put the hard screen-share/webcam divider at the same row, |grad| ~175 vs ~20 for the runner-up).
export const HETH_SEAM  = 854; // content zone = 0..854 (the live DexScreener chart); webcam plays below
export const HETH_CAP_Y = 890; // caption centre: below the seam, above his hairline (~1000), never his eyes (~1400)

// ─── B-roll beats (authored in BROLL-PLAN.md BEFORE generation) ────────────────────────────────
// Coverage budget (SKILL "B-roll coverage budget", HALVED 2026-07-14):
//   11.20 s covered / 33.36 s = 33.6 % b-roll, 22.16 s = 66.4 % BASE SHOWING. Targets ~30 % / ~70 %
//   (bands 25-35 % / 65-75 %) => inside the band. 5 distinct images, zero reuse inside the clip
//   (5 / 33.36 s = one per 6.7 s, the same density as clip #1 of this batch: 7 / 47.36 s).
// 2 full-screens ONLY (hook / climax) = well inside the FIRM 1-3 cap, and they are 20 s apart so the
// base can never flash between two full-screens.
// The screen-share is a LIVE DexScreener NINEHOOD/WETH candlestick chart with a scrolling transactions
// tape: real moving footage on a WETH pair, so the long base stretches below are deliberate value, not
// filler. Two code badges carry the two longest base gaps instead of more b-roll.
// staticFile() calls are LITERAL strings on purpose — the finalized-short gate scans for literal refs.
export const BROLL_HETH: BrollEv[] = [
  // BASE 0.00-1.20 — open on Mike + the live chart (the frame-0 thumb is ONE frame; base from frame 1)
  { src: staticFile('broll-heth-hate-but-money.png'), tIn:  1.20, tOut:  3.40, mode: 'full'    }, // HOOK: "you don't like something but you need to make money" (0.76-3.20)
  // BASE 3.40-8.20 (4.80 s) — "i recently bought some eth not to trade meme coins but i bought some eth as an investment" (+ PROFIT OVER FEELINGS badge)
  { src: staticFile('broll-heth-confession.png'),     tIn:  8.20, tOut: 10.40, mode: 'content' }, // PEAK 1: "i HATE eth. i never liked eth" ("hate" 8.80-9.34) — content mode so his delivery stays on cam
  // BASE 10.40-16.40 (6.00 s) — "but i think i think eth is very bullish man, i think it's gonna be going somewhere" (green caption accent + TING carry it)
  { src: staticFile('broll-heth-flip-bitcoin.png'),   tIn: 16.40, tOut: 18.70, mode: 'content' }, // "the potential eventually to FLIP BITCOIN, ethereum" ("bitcoin" 17.66-18.08)
  // BASE 18.70-23.35 (4.65 s) — "there's gonna be a lot of multipliers so people talk about a $10,000" (riser builds under it)
  { src: staticFile('broll-heth-10k-easily.png'),     tIn: 23.35, tOut: 25.65, mode: 'full'    }, // PEAK 2 / CLIMAX: "i talk about $10,000 EASILY" ("easily" 24.48-25.04)
  // BASE 25.65-30.30 (4.65 s) — "that's like really bearish $10,000 eth. yeah, $10,000 eth would be like" (+ BEARISH AT $10,000 badge)
  { src: staticFile('broll-heth-not-a-top.png'),      tIn: 30.30, tOut: 32.50, mode: 'content' }, // "near term like a MILD RALLY, not even a cycle top"
  // BASE 32.50-33.36 (0.86 s) — "a cycle top": close on Mike, the final impact lands here
];

// ─── Badges (code-drawn text, content zone y300) ────────────────────────────────────────────────
// Both sit over BASE stretches (never over a b-roll beat), are 20 s apart so they never share a time
// window, live at y300 while captions live at y890, and both start long after the frame-0 thumb.
// Each states framing the captions do NOT. No em dashes.
// Badge B was RE-WORDED after the draft render: it first read 'BEARISH / AT $10,000', which is the
// literal text of the caption running underneath it at 26.16-27.74 ('bearish $10,000'). A badge that
// parrots the caption adds nothing, so it now supplies the framing the captions never state.
export const BADGES_HETH: BadgeEv[] = [
  { tIn:  4.30, tOut:  6.60, color: '#00e5ff', line1: 'PROFIT',  line2: 'OVER FEELINGS', sub: 'THE PRAGMATIC BUY', top: 300 },
  { tIn: 26.60, tOut: 29.10, color: '#ffe600', line1: 'THAT IS', line2: 'THE LOW END',   sub: 'OF WHAT HE EXPECTS', top: 300 },
];

// ─── Frame-0 thumbnail (IG/TikTok cover) ────────────────────────────────────────────────────────
// ONE frame only (LivestreamShort defaults thumb.durS to 1/fps) — generated background art with the
// hook title drawn in CODE on top, never baked into the image. No em dashes.
export const THUMB_DEF_HETH: ThumbDef = {
  img: THUMB_HETH,
  title: 'I HATE ETH\nBUT I\nBOUGHT IT',
  chip: '$10,000 IS BEARISH',
  chipColor: '#ffe600',
  titleSize: 118,
};

// ─── SFX (shared library, COPIED into render-assets/sfx/; every event stays under the VO) ───────
// Whoosh on the thumbnail cut and on every major layout transition; a riser BUILDS INTO the climax
// impact; impacts land on the reveals and the punchline; a kaching on "$10,000 easily".
// Per Impacts/WHEN-TO-USE-IMPACTS.md the big hits are reserved for beats that actually matter.
//
// ⚠ Cue points are the SFX's own PEAK/attack position, not its file start. Envelopes were RE-MEASURED
//   on the staged copies of these files (0.2 s RMS window, attack = first bin within 12 dB of peak):
//     transition_rapid_whoosh  peak 0.20 / attack 0.00     Cinematic Whoosh 02  peak 0.80 / attack 0.60
//     Cinematic Whoosh 06      peak 0.40 / attack 0.40     TING SOUND EFFECT    peak 0.80 / attack 0.60
//     Cash Register            peak 0.20 / attack 0.20     Impact_Hit_01-2/-3   peak 0.00 / attack 0.00
//     Impact_3                 peak 0.40 / attack 0.20     Soundjay_Impact_Main peak 0.20 / attack 0.00
//     Edgy_Riser               peak 5.00 / attack 3.20
//   Each file is therefore started EARLY so its crest/attack lands on the frame it punctuates. Two cues
//   moved off clip #1's inherited offsets after this measurement: Whoosh 06 (crest is 0.40 s in, not
//   0.60) and Impact_3 (attack is 0.20 s in, so it fires 0.20 s before the cut).
// Levels carry over from clip #1's aligned-subtraction measurement (same library files, same VO
// loudness): TING / Cash Register / Whoosh 06 are 8-15 dB quieter FILES than the impacts and are
// raised accordingly so they are audible under the VO.
export const SFX_HETH: Sfx[] = [
  { t:  0.00, src: staticFile('sfx/transition_rapid_whoosh.mp3'),         vol: 0.46, dur: 1.0  }, // frame-0 thumbnail cut (peaks 0.10 = right on the cut)
  { t:  0.40, src: staticFile('sfx/Cinematic Whoosh 02.wav'),             vol: 0.50, dur: 1.9  }, // sweeps INTO the HOOK full-screen (crest 1.20 = the cut)
  { t:  8.10, src: staticFile('sfx/transition_rapid_whoosh.mp3'),         vol: 0.40, dur: 1.0  }, // into the confession cutaway (crest 8.20 = the cut)
  { t:  8.80, src: staticFile('sfx/Impacts/Impact_Hit_01-2.wav'),         vol: 0.50, dur: 3.0  }, // the word "HATE" (8.80-9.34), the title word of the short
  { t: 12.34, src: staticFile('sfx/TING SOUND EFFECT.mp3'),               vol: 0.50, dur: 2.1  }, // ATTACKS on "bullish" (13.04); measured attack 0.70 s in (0.60-0.75 s of leading silence)
  { t: 16.00, src: staticFile('sfx/Cinematic Whoosh 06.wav'),             vol: 0.78, dur: 2.1  }, // sweeps INTO the flip-Bitcoin cutaway (measured crest 0.40 s in => 16.40 = the cut); vol raised, this file is ~8 dB quieter than Whoosh 02
  { t: 17.48, src: staticFile('sfx/Impacts/Soundjay_Impact_Main_01.wav'), vol: 0.40, dur: 2.0  }, // "flip BITCOIN" (17.48-18.08)
  { t: 18.35, src: staticFile('sfx/risers/Edgy_Riser.wav'),               vol: 0.28, dur: 5.10 }, // riser BUILDS INTO the climax (measured crest 5.00 s in => 23.35, exactly the cut)
  { t: 23.15, src: staticFile('sfx/Impacts/Impact_3.wav'),                vol: 0.46, dur: 2.4  }, // hard cut to the climax full-screen (measured attack 0.20 s in => lands ON 23.35)
  { t: 24.33, src: staticFile('sfx/Cash Register.mp3'),                   vol: 0.70, dur: 1.8  }, // kaching ATTACKS on "easily" (24.48)
  { t: 30.20, src: staticFile('sfx/transition_rapid_whoosh.mp3'),         vol: 0.60, dur: 1.0  }, // into the closing cutaway (crest 30.30 = the cut); 0.38 -> 0.60 after the first full render measured it at only +4.3 dB over the residual floor (every other cue clears +6.5), and this is the one whoosh with no impact next to it to carry it
  { t: 32.70, src: staticFile('sfx/Impacts/Impact_Hit_01-3.wav'),         vol: 0.48, dur: 2.0  }, // "a cycle TOP" (32.70-33.22), the closing punchline
];

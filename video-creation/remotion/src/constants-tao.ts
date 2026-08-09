import { staticFile } from 'remotion';
import type { BrollEv, Sfx } from './_kit';
import type { BadgeEv, ThumbDef } from './LivestreamShort';

// ─── trading-against-ourselves (batch: clarity-act, clip #2, variant: full) ─────────────────────
// "We Are Only Trading Against Ourselves" — Mike's contrarian market-structure take: the Robinhood
// chain memes are just the same shrinking pool of us trading with each other, well over 50 % of
// crypto is checked out until October, Cash Cat already burned a whole ton of people, so there is
// less demand absorbing each round of hype and no new retail. Verdict: we are buying blind, so the
// only sane play is $100 across 10 memes and hoping one does a 1000x.
//
// ⚠ NAMING: the `TAO_` prefix here stands for Trading Against Ourselves, the CLIP. It has NOTHING
// to do with Bittensor TAO (that clip is `constants-tbtd.ts` / `TBTD_`). No symbol collides.
//
// Base clip: trading-against-ourselves-tightened-desilenced.mp4, ALREADY composited vertical
// (screen-share on top, webcam below). 1080x1920 @ 25 fps, 82.60 s. Do NOT re-split the zones.
// The comp runs at 30 fps; OffthreadVideo resamples the 25 fps source by TIME, so all cue points
// below are plain seconds taken from whisper-words.json (clip-relative, 0-based).
//
// Render (public-dir = the CLIP's render-assets/, which holds the spine + thumbnail + b-roll + sfx):
//   npx remotion render src/index.ts TradingAgainstOurselves \
//     out/clarity-act/2-trading-against-ourselves.mp4 \
//     --public-dir "<repo>/video-creation/shorts/clarity-act/trading-against-ourselves/render-assets"

export const TAO_FPS = 30;
export const TAO_DURATION = 2477; // 82.567 s @30, just inside the 82.60 s clip (no black tail frame)

export const CLIP_TAO  = staticFile('trading-against-ourselves-full.mp4');
export const THUMB_TAO = staticFile('thumbnail-tao.png');

// Layout geometry, MEASURED on THIS clip (row-mean gradient scan at t=2/12/22/35/50/65/80 s; all
// seven frames put the hard screen-share/webcam divider between rows 853 and 854, |d(rowmean)| 99-189
// vs 17-33 for the next-strongest edge). Same as clip #1 of this batch, re-confirmed independently.
export const TAO_SEAM  = 854; // content zone = 0..854 (article, then the CASHCAT chart); webcam below
export const TAO_CAP_Y = 890; // caption centre: below the seam, above his hairline (~1100), never his eyes (~1400)

// ─── B-roll beats (authored in BROLL-PLAN.md BEFORE generation) ────────────────────────────────
// Coverage budget (SKILL "B-roll coverage budget", HALVED 2026-07-14):
//   23.50 s covered / 82.60 s = 28.4 % b-roll, 59.10 s = 71.6 % BASE SHOWING. Targets ~30 % / ~70 %
//   (bands 25-35 % / 65-75 %) => inside the band. 9 distinct images, zero reuse inside the clip.
// 3 full-screens ONLY (hook / burn climax / thesis climax) = the FIRM 1-3 cap, longest 2.80 s so the
// face is never hidden for >3 s. The only pair that touches is 62.20-64.90 -> 64.90-67.10, which is
// EXACTLY adjacent so BrollLayer hard-cuts (no base flash); every other full->base gap is >= 2.2 s.
//
// The long deliberate base stretches are the POINT of this clip, not an omission: a content-zone
// scene scan shows the screen-share is a static off-message CoinDesk article 0-21 s, then the REAL
// CASHCAT/WETH DexScreener chart 21-58.5 s (Mike's cursor tracing the exact top and bottom he is
// describing), an X feed 58.5-70.5 s, then the chart again. So b-roll earns its place in 0-21 and
// 58.5-70.5, and the chart-pointing burn cascade (21-42) is left uncovered because it IS the visual.
// staticFile() calls are LITERAL strings on purpose — the finalized-short gate scans for literal refs.
export const BROLL_TAO: BrollEv[] = [
  // BASE 0.00-1.30 — open on Mike + the screen-share (the frame-0 thumb is ONE frame; base from frame 1)
  { src: staticFile('broll-tao-skepticism.png'),        tIn:  1.30, tOut:  4.10, mode: 'full'    }, // HOOK: "a lot of SKEPTICISM with these robinhood memes right now"
  // BASE 4.10-6.30 (2.20 s) — "good, i keep saying it's only us"
  { src: staticFile('broll-tao-against-ourselves.png'), tIn:  6.30, tOut:  8.90, mode: 'content' }, // THESIS: "trading AGAINST OURSELVES with these robinhood memes" ("against" 6.36)
  // BASE 8.90-13.60 (4.70 s) — "right, with any new memes, it doesn't have to be robinhood, right? and because majority"
  { src: staticFile('broll-tao-checked-out.png'),       tIn: 13.60, tOut: 16.20, mode: 'content' }, // "of us have all CHECKED OUT" ("checked" 14.32, "out" 14.58)
  // BASE 16.20-30.20 (14.00 s) — the percentage riff (+ badge 19.30-21.00), then at 21.0 the screen
  //   CUTS to the real CASHCAT chart and he points at the top: "the first meme to really really make
  //   a pump is cash cat. and all these people up here, right?" -> that IS the visual, no b-roll.
  { src: staticFile('broll-tao-bought-the-top.png'),    tIn: 30.20, tOut: 32.60, mode: 'content' }, // "they've already been BURNED. like, oh, i'm gonna get in on it"
  // BASE 32.60-39.50 (6.90 s) — pure chart-pointing: "and they're buying up here. well, everybody
  //   down here who bought down here is selling up here" (PEAK 2 setup; covering it would hide the argument)
  { src: staticFile('broll-tao-burn-cascade.png'),      tIn: 39.50, tOut: 42.30, mode: 'full'    }, // PEAK 2 / CLIMAX: "they're getting BURNED. so there's a whole ton of people getting BURNED" ("burned" 39.34 + 41.18)
  // BASE 42.30-55.20 (12.90 s) — "they've probably checked out... i'm done with robinhood memes...
  //   this is one up to 220 million... they've just got burned." (+ badge 49.20-51.20). The chart on
  //   screen literally reads 217.34M at the peak and 73.71M now, so the base carries the number.
  { src: staticFile('broll-tao-less-absorbing.png'),    tIn: 55.20, tOut: 57.90, mode: 'content' }, // "there's LESS PEOPLE that are absorbing the HYPE about robinhood memes"
  // BASE 57.90-62.20 (4.30 s) — "the problem here is like again, it's like, we're trading against ourselves here?"
  { src: staticFile('broll-tao-no-new-retail.png'),     tIn: 62.20, tOut: 64.90, mode: 'full'    }, // PEAK 1 / CLIMAX: "THERE'S NO NEW RETAIL." ("no" 62.52, "retail" 63.08)
  { src: staticFile('broll-tao-until-october.png'),     tIn: 64.90, tOut: 67.10, mode: 'content' }, // HARD CUT (adjacent): "more than half of everybody in crypto is CHECKED OUT until OCTOBER"
  // BASE 67.10-78.60 (11.50 s) — "we're just buying blind right now. wait six months... spend $100 on
  //   10 different memes and you lose money on nine of them" (+ badge 73.40-75.40); screen back to the chart at 70.5
  { src: staticFile('broll-tao-one-in-ten.png'),        tIn: 78.60, tOut: 81.30, mode: 'content' }, // "but all it takes is ONE of them to do like a THOUSAND X" ("one" 79.36)
  // BASE 81.30-82.57 (1.27 s) — "or something or even a hundred x." (close on Mike; his face is the loop frame, deliberate)
];

// ─── Badges (code-drawn text) ───────────────────────────────────────────────────────────────────
// Three badges, each over a BASE stretch (never over a b-roll beat), 28.2 s and 22.2 s apart so no
// two share a time window, and all start long after the frame-0 thumb. Each states something the
// captions do NOT. The two that sit over the CASHCAT chart use the LOW band (top 680 => y582-778) so
// they cover the transactions table, not the candles Mike is pointing at; captions live at y890
// (text starts ~y812), so the low band still clears them by ~34 px.
// ⚠ Badge boxes are TALLER than the nominal ~196 px: the plate is absolutely positioned at
// left:50% with translateX(-50%), so its text column is only ~436 px wide and line1 soft-wraps.
// MEASURED on the first full render (border-run scan): badge 1 = rows 100-499, badge 2 = 540-819,
// badge 3 = 500-859 against caption ink at rows 865-914. Badge 3 therefore cleared the captions by
// only 6 px, which is a near-collision, so it moved to the UPPER band (top 300 -> rows 120-480).
// That is safe here because at 73.4-75.4 s Mike is on the lottery-ticket verdict, not pointing at
// the chart. Badge 2 stays LOW on purpose: it sits over the transactions table so the $220M peak he
// IS referencing stays visible, and it clears the caption ink by 46 px.
export const BADGES_TAO: BadgeEv[] = [
  { tIn: 19.30, tOut: 21.00, color: '#ff5252', line1: 'HALF THE MARKET',   sub: 'IS NOT EVEN LOOKING',  top: 300 },
  { tIn: 49.20, tOut: 51.20, color: '#ff5252', line1: 'ROUND TRIP',        sub: '220M DOWN TO 73M',     top: 680 },
  { tIn: 73.40, tOut: 75.40, color: '#ffe600', line1: 'TEN LOTTERY TICKETS', sub: 'THE ONLY PLAY LEFT', top: 300 },
];

// ─── Frame-0 thumbnail (IG/TikTok cover) ────────────────────────────────────────────────────────
// ONE frame only (LivestreamShort defaults thumb.durS to 1/fps) — generated background art with the
// hook title drawn in CODE on top, never baked into the image. No em dashes.
export const THUMB_DEF_TAO: ThumbDef = {
  img: THUMB_TAO,
  // 4 EXPLICIT lines: at any size that reads as a cover, "TRADING AGAINST" overflows the 968 px text
  // column and soft-wraps anyway (chunk-QA of the first draft caught it), so the break is authored
  // rather than left to the browser, and the type goes bigger because each line is now short.
  title: "WE'RE ONLY\nTRADING\nAGAINST\nOURSELVES",
  chip: 'NO NEW RETAIL LEFT',
  chipColor: '#ff5252',
  titleSize: 118,
};

// ─── SFX (shared library, COPIED into render-assets/sfx/; every event stays under the VO) ───────
// Whoosh on the thumbnail cut and on every major layout transition; a riser BUILDS INTO the burn
// climax impact; impacts land on the two peak beats; a kaching on the lottery-ticket payoff.
//
// ⚠ Cue points are the SFX's own ATTACK/PEAK position, not its file start. Envelopes RE-MEASURED for
// this build at 20 ms RMS resolution (not inherited from clip #1):
//   transition_rapid_whoosh attack 0.10 / peak 0.18 - Cinematic Whoosh 02 attack 0.72 / peak 0.86 -
//   Cinematic Whoosh 06 attack 0.44 / peak 0.58 (and this file's peak RMS is 0.058 vs 0.153 for
//   Whoosh 02, i.e. ~8.4 dB quieter, hence the much higher vol) - TING attack 0.78 (leading silence) -
//   Edgy_Riser attack 2.80 / peak 5.00 - Impact_3 attack 0.22 - Impact_Hit_01-2 attack 0.06 -
//   Soundjay_Impact_Main_01 attack 0.10 - sudden-shock attack 0.16 - Cash Register attack 0.18
//   (peak RMS 0.041, the quietest file here, hence vol 0.70).
// Each event therefore FIRES EARLY by its own attack/peak offset so the transient lands on the frame
// it punctuates. Levels are verified on the FINAL render by aligned subtraction of the source audio.
export const SFX_TAO: Sfx[] = [
  { t:  0.00, src: staticFile('sfx/transition_rapid_whoosh.mp3'),         vol: 0.46, dur: 1.0  }, // frame-0 thumbnail cut (cannot lead t=0; peak lands 0.18 after)
  { t:  0.44, src: staticFile('sfx/Cinematic Whoosh 02.wav'),             vol: 0.50, dur: 1.9  }, // crest 1.30 = sweeps INTO the HOOK full-screen
  { t:  6.12, src: staticFile('sfx/transition_rapid_whoosh.mp3'),         vol: 0.38, dur: 1.0  }, // crest 6.30 = into the "trading against ourselves" cutaway
  { t: 13.54, src: staticFile('sfx/TING SOUND EFFECT.mp3'),               vol: 0.50, dur: 2.1  }, // ATTACKS on the word "checked" (14.32); the file has 0.78 s of leading silence
  { t: 34.50, src: staticFile('sfx/risers/Edgy_Riser.wav'),               vol: 0.30, dur: 5.00 }, // riser BUILDS through the burn cascade, crest ~39.50, cut off by the impact
  { t: 39.28, src: staticFile('sfx/Impacts/Impact_3.wav'),                vol: 0.46, dur: 2.2  }, // attack 39.50 = hard cut to the burn-cascade full-screen (PEAK 2)
  { t: 41.12, src: staticFile('sfx/Impacts/Impact_Hit_01-2.wav'),         vol: 0.50, dur: 3.2  }, // attack 41.18 = "a whole ton of people getting BURNED", biggest hit
  { t: 55.02, src: staticFile('sfx/transition_rapid_whoosh.mp3'),         vol: 0.38, dur: 1.0  }, // crest 55.20 = into the "less people absorbing the hype" cutaway
  { t: 61.62, src: staticFile('sfx/Cinematic Whoosh 06.wav'),             vol: 0.78, dur: 2.1  }, // crest 62.20 = sweeps INTO the thesis climax; vol high, this file is ~8 dB quieter
  { t: 62.42, src: staticFile('sfx/Impacts/Soundjay_Impact_Main_01.wav'), vol: 0.42, dur: 2.0  }, // attack 62.52 = "NO new retail" (PEAK 1)
  { t: 64.74, src: staticFile('sfx/ding/sudden-shock.mp3'),               vol: 0.40, dur: 1.8  }, // attack 64.90 = the hard cut into "checked out until october"
  { t: 78.42, src: staticFile('sfx/transition_rapid_whoosh.mp3'),         vol: 0.36, dur: 1.0  }, // crest 78.60 = into the lottery-ticket close
  { t: 79.18, src: staticFile('sfx/Cash Register.mp3'),                   vol: 0.70, dur: 1.8  }, // kaching ATTACKS on the word "one" (79.36)
];

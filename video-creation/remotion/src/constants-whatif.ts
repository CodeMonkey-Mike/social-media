import { staticFile } from 'remotion';
import type { BrollEv, Sfx } from './_kit';
import type { BadgeEv, ThumbDef } from './LivestreamShort';

// ─── whatif-peanut-52x (batch: whatif, clip #3, variant: full) ──────────────────────────────────
// "WHATIF Could Be Another Peanut 52x" — a redemption-arc conviction story: WHATIF is crushing it;
// Mike first saw it way back at ~200k with a crappy dexscreener profile that kept switching Twitter
// communities, so he could not call it in good conscience; NOW there is a CTO and a real team, CEX
// listings incoming. It rhymes with his Peanut trade (caught it low, did a 52x). The Robinhood-chain
// floodgates justification (Robinhood more bullish than Coinbase/Base, retail floodgates open), then
// the payoff: CEX listings, hope Robinhood lists it, over a billion, multiple billions, almost a
// thousand x from here. WHATIF is NEVER framed as disparaged — the sketch is the PAST.
//
// Base clip: whatif-peanut-52x-tightened-desilenced.mp4 (Phase 5 tighten -> 5B desilence). ALREADY
// composited vertical (WHATIF DexScreener/$IF market-cap chart on top, webcam below), 1080x1920 @ 25
// fps, 80.84 s. FINAL, do NOT re-cut / re-split the zones. The comp runs at 30 fps; OffthreadVideo
// resamples the 25 fps source by TIME, so every cue below is plain clip-relative seconds from the
// clip's own Whisper word timings (spine16k.json).
//
// Render (public-dir = the CLIP's render-assets/, which holds spine + thumbnail + b-roll + sfx):
//   npx remotion render src/index.ts WhatifPeanut52x \
//     out/whatif/3-whatif-peanut-52x.mp4 \
//     --public-dir "<repo>/video-creation/shorts/whatif/whatif-peanut-52x/render-assets"

export const WHIF_FPS = 30;
export const WHIF_DURATION = 2424; // 80.80 s @30, just inside the 80.84 s clip (no black tail frame)

export const CLIP_WHIF  = staticFile('whatif-peanut-52x.mp4');
export const THUMB_WHIF = staticFile('thumbnail-whatif.png');

// Layout geometry, MEASURED on this clip (row-mean gradient scan at t=3/20/40/60/78 s; all five frames
// put the hard screen-share/webcam divider on the same row, y=853 — same rig as the October-pumps
// WHATIF clip). Content zone = 0..854 (the $IF/WETH DexScreener chart + the WHATIF green mascot panel);
// webcam plays below. Caption centre y=890: below the seam, above his hairline (~1000), never his eyes
// (~1500).
export const WHIF_SEAM  = 854;
export const WHIF_CAP_Y = 890;

// ─── B-roll beats (authored in BROLL-PLAN.md BEFORE generation) ─────────────────────────────────
// Coverage budget (SKILL "B-roll coverage budget", HALVED 2026-07-14):
//   25.60 s covered / 80.84 s = 31.7 % b-roll, 55.24 s = 68.3 % BASE SHOWING. Targets ~30 % / ~70 %
//   (bands 25-35 % / 65-75 %) => on target. 7 distinct images, zero reuse inside the clip.
// 3 full-screens ONLY (hook / the Peanut 52x climax / the billions payoff) = the FIRM 1-3 cap. They
// are 35 s and 35 s apart, so no full->full base flash exists. Every b-roll->base gap is >= 4.8 s, so
// there is no sub-1.5 s base flash anywhere (SKILL production rule 4) — all beats fade to/from base.
// The content zone is the WHATIF $IF/WETH DexScreener chart (the green ramp = the receipt, carrying
// WHATIF's real branding incl. its green mascot art) for the ENTIRE runtime, so most of the clip is
// deliberately BASE; b-roll only takes the beats it earns: the hook, the sketchy PAST origin (a
// cutaway so the on-message live chart is not shown while he narrates the old sketch), the Peanut
// analogy + 52x climax (the chart is WHATIF, not Peanut, so the cutaway earns its place), the
// Robinhood floodgates, the Robinhood-listing hope, and the billions payoff.
// staticFile() calls are LITERAL strings on purpose — the finalized-short gate scans for literal refs.
export const BROLL_WHIF: BrollEv[] = [
  // BASE 0.00-0.90 — open on Mike + the ramping WHATIF chart (frame-0 thumb is ONE frame, base from frame 1)
  { src: staticFile('broll-whatif-hook.png'),          tIn:  0.90, tOut:  3.60, mode: 'full'    }, // HOOK: "i think what if is crushing it?" ("crushing" 1.04) — the WHATIF green cosmic mascot
  // BASE 3.60-8.20 (4.60 s) — "when i saw this way back as far back as like 200k" (the chart's early low base IS the visual)
  { src: staticFile('broll-whatif-sketchy.png'),       tIn:  8.20, tOut: 12.60, mode: 'content' }, // "really crappy profile with dexscreener switching between random twitter communities" (the sketchy PAST, cut away from the on-message chart)
  // BASE 12.60-31.00 (18.40 s) — "i can't in good conscience call a coin like that. but apparently there's a CTO, a good team behind it, CEX incoming" (+ CTO/REAL TEAM badge 22.60-25.80)
  { src: staticFile('broll-whatif-peanut-pump.png'),   tIn: 31.00, tOut: 34.20, mode: 'content' }, // "i look at the peanut scenario... with peanut, peanut" — squirrel + peanut + green pump (chart is WHATIF, not Peanut)
  // BASE 34.20-39.00 (4.80 s) — "i caught it at a very low market cap as peanut was pumping. let me just take a chance."
  { src: staticFile('broll-peanut-52x.png'),           tIn: 39.00, tOut: 42.40, mode: 'full'    }, // PEANUT 52x CLIMAX: "and i bought some peanut and ended up doing a 52x" ("52x" 41.24)
  // BASE 42.40-55.60 (13.20 s) — "so robinhood chain, very bullish... robinhood is more bullish than coinbase and base" (+ ROBINHOOD CHAIN badge 47.60-50.80)
  { src: staticFile('broll-robinhood-floodgates.png'), tIn: 55.60, tOut: 59.80, mode: 'content' }, // "they can open up their doors, the floodgates open to retail, lots and lots of retail" ("floodgates" 56.60)
  // BASE 59.80-65.00 (5.20 s) — "stock retail. now it's going to be listed on centralized exchanges."
  { src: staticFile('broll-robinhood-listing.png'),    tIn: 65.00, tOut: 69.20, mode: 'content' }, // "the hopes is it gets recognized by robinhood and listed on the app" ("robinhood" 67.68, "listed" 68.68)
  // BASE 69.20-77.20 (8.00 s) — "because then it would be like a billion dollars... over a billion... who knows through the cycle top" (+ OVER A BILLION badge 70.40-73.80)
  { src: staticFile('broll-billions-rocket.png'),      tIn: 77.20, tOut: 80.85, mode: 'full'    }, // BILLIONS PAYOFF (climax, holds to end): "multiple billions... almost a thousand x for me" ("thousand x" 79.78)
];

// ─── Badges (code-drawn text, content zone y300) ────────────────────────────────────────────────
// Every badge sits over a BASE stretch (never over a b-roll beat), no two share a time window (gaps
// 21.8 s / 19.6 s), they live at y300 while captions live at y890, and all start long after the
// frame-0 thumb. Each states something the captions do NOT. WHATIF is framed positively throughout.
export const BADGES_WHIF: BadgeEv[] = [
  { tIn: 22.60, tOut: 25.80, color: '#39ff14', line1: 'NOW: A CTO',      line2: 'REAL TEAM', sub: 'CEX LISTINGS INCOMING',      top: 300 },
  { tIn: 47.60, tOut: 50.80, color: '#39ff14', line1: 'ROBINHOOD CHAIN', sub: 'MORE BULLISH THAN COINBASE',                    top: 300 },
  { tIn: 70.40, tOut: 73.80, color: '#ffe600', line1: 'OVER A BILLION',  sub: 'IF ROBINHOOD LISTS IT',                         top: 300 },
];

// ─── Frame-0 thumbnail (IG/TikTok cover) ────────────────────────────────────────────────────────
// ONE frame only (LivestreamShort defaults thumb.durS to 1/fps) — generated background art with the
// hook title drawn in CODE on top, never baked into the image. Robinhood lime-green chip (NEVER teal,
// which would misread as Kaspa/9Hood). No em dashes.
export const THUMB_DEF_WHIF: ThumbDef = {
  img: THUMB_WHIF,
  title: 'WHATIF COULD BE\nANOTHER\nPEANUT 52X',
  chip: 'ROBINHOOD CHAIN GEM',
  chipColor: '#39ff14',
  titleSize: 116,
};

// ─── SFX (shared library, COPIED into render-assets/sfx/; every event stays under the VO) ───────
// Whoosh on the thumbnail cut and on every b-roll transition that matters; two risers each BUILD INTO
// an impact; impacts/kachings reserved for the beats that carry the clip (the hook, the Peanut 52x
// money win, the billions payoff) per Impacts/WHEN-TO-USE-IMPACTS.md ("reserve them for the beats
// that actually matter").
//
// ⚠ Cue points are each SFX's own PEAK/ATTACK position, not its file start (envelopes measured on this
//   machine at 0.2 s RMS, same values verified on the October-pumps WHATIF build): transition_rapid_whoosh
//   peaks 0.20 s in - Cinematic Whoosh 02 peaks 0.80 s - Cinematic Whoosh 06 peaks 0.60 s - Edgy_Riser
//   peaks 5.00 s - Tension_Rise_Logo_Reveal_2 peaks 4.60 s - TING attacks 0.60 s - Cash Register attacks
//   0.20 s - sudden-shock peaks 0.20 s - Impact_3 peaks 0.40 s - Soundjay_Impact_Main_01 peaks 0.20 s -
//   Impact_Hit_01-2 and Boom - Big Reveal peak at 0.00 s. Each cue is started EARLY by that offset so the
//   crest lands on the frame it punctuates. Quiet files (Whoosh 06, Cash Register) get a higher vol.
export const SFX_WHIF: Sfx[] = [
  { t:  0.00, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.44, dur: 1.00 }, // frame-0 thumbnail cut (crest 0.20)
  { t:  0.10, src: staticFile('sfx/Cinematic Whoosh 02.wav'),               vol: 0.48, dur: 2.00 }, // sweeps INTO the HOOK full-screen (crest 0.90)
  { t:  0.50, src: staticFile('sfx/Impacts/Impact_3.wav'),                  vol: 0.42, dur: 2.00 }, // impact ON the hook mascot reveal (crest 0.90)
  { t:  8.00, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.40, dur: 1.00 }, // into the sketchy-origin cutaway (8.20)
  { t: 11.04, src: staticFile('sfx/ding/sudden-shock.mp3'),                 vol: 0.36, dur: 1.60 }, // lands on "switching" between random communities (11.24)
  { t: 24.26, src: staticFile('sfx/TING SOUND EFFECT.mp3'),                 vol: 0.48, dur: 2.00 }, // the redemption ding on "good team" (24.86)
  { t: 30.80, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.40, dur: 1.00 }, // into the peanut-pump cutaway (31.00)
  { t: 37.10, src: staticFile('sfx/risers/Edgy_Riser.wav'),                 vol: 0.26, dur: 5.10 }, // riser BUILDS INTO the Peanut 52x climax (crest ~42.1)
  { t: 38.40, src: staticFile('sfx/Cinematic Whoosh 06.wav'),               vol: 0.60, dur: 1.60 }, // sweeps into the Peanut 52x full-screen (crest 39.00)
  { t: 38.80, src: staticFile('sfx/Impacts/Soundjay_Impact_Main_01.wav'),   vol: 0.44, dur: 2.40 }, // impact on the Peanut 52x reveal cut (39.00)
  { t: 41.04, src: staticFile('sfx/Cash Register.mp3'),                     vol: 0.68, dur: 1.90 }, // kaching ATTACKS on "52x", the money win (41.24)
  { t: 55.40, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.40, dur: 1.00 }, // into the floodgates cutaway (55.60)
  { t: 56.00, src: staticFile('sfx/Cinematic Whoosh 06.wav'),               vol: 0.56, dur: 1.60 }, // the floodgates burst on "floodgates" (56.60)
  { t: 64.80, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.38, dur: 1.00 }, // into the robinhood-listing cutaway (65.00)
  { t: 68.08, src: staticFile('sfx/TING SOUND EFFECT.mp3'),                 vol: 0.46, dur: 2.00 }, // listing ding on "listed on the app" (68.68)
  { t: 70.44, src: staticFile('sfx/Cash Register.mp3'),                     vol: 0.64, dur: 1.90 }, // kaching on "a billion dollars" (70.64)
  { t: 75.46, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_2.wav'), vol: 0.26, dur: 4.70 }, // riser BUILDS INTO the billions payoff (crest ~80.06)
  { t: 76.40, src: staticFile('sfx/Cinematic Whoosh 02.wav'),               vol: 0.50, dur: 2.00 }, // sweeps into the billions payoff full-screen (crest 77.20)
  { t: 77.20, src: staticFile('sfx/Impacts/Impact_Hit_01-2.wav'),           vol: 0.44, dur: 2.40 }, // impact on the payoff reveal cut / "multiple billions" (77.36)
  { t: 79.78, src: staticFile('sfx/Boom - Big Reveal.wav'),                 vol: 0.40, dur: 3.00 }, // the BIG hit on "almost a thousand x" (79.78) — verified NOT to mask the closing VO
];

import { staticFile } from 'remotion';
import type { BrollEv, Sfx } from './_kit';
import type { BadgeEv, ThumbDef } from './LivestreamShort';

// ─── whatif-100x-bigger-than-brett (batch: what-if-1000x, clip #2, variant: long) ───────────────
// "What If 100x: Bigger Than Brett on a Bigger Chain" — $WHATIF could 100x from here. Brett reached
// a ~2 billion market cap as the biggest meme on Base in a run-up that was NOT the cycle top;
// Robinhood is bigger than Coinbase, so a Robinhood spot listing puts a 3 billion, 100x $WHATIF on
// the table. Source segments are deliberately NON-CHRONOLOGICAL (assembly [3,1,2,0]).
//
// Base clip: whatif-100x-bigger-than-brett-tightened-desilenced.mp4 (raw cut -> Phase 5 tighten ->
// 5B desilence). ALREADY composited vertical (screen-share on top, webcam below), 1080x1920 @ 25 fps,
// 73.92 s. FINAL: do NOT re-cut, do NOT re-desilence, do NOT re-split the zones. The comp runs at
// 30 fps; OffthreadVideo resamples the 25 fps source by TIME, so every cue below is plain seconds
// taken from the clip's own Whisper word timings (clip-relative, 0-based).
//
// Render (public-dir = the CLIP's render-assets/, holding the spine + thumbnail + b-roll + sfx):
//   npx remotion render src/index.ts WhatifBiggerThanBrett \
//     out/what-if-1000x/2-whatif-100x-bigger-than-brett.mp4 \
//     --public-dir "<repo>/video-creation/shorts/what-if-1000x/whatif-100x-bigger-than-brett/render-assets"

export const W1BB_FPS = 30;
export const W1BB_DURATION = 2217; // 73.900 s @30, just inside the 73.92 s clip (no black tail frame)

export const CLIP_W1BB  = staticFile('whatif-100x-bigger-than-brett.mp4');
export const THUMB_W1BB = staticFile('thumbnail-w1bb.png');

// Layout geometry, MEASURED on this clip (row-mean gradient scan at t=3/15/30/45/60/71 s; all six
// frames put the hard screen-share/webcam divider on the same row).
export const W1BB_SEAM  = 853; // content zone = 0..853 (DexScreener IF/WETH, then CMC BRETT); webcam below
export const W1BB_CAP_Y = 890; // caption centre: below the seam, far above his eyes (~1250-1300)

// ─── B-roll beats (authored in BROLL-PLAN.md BEFORE generation) ────────────────────────────────
// Coverage budget (SKILL "B-roll coverage budget", HALVED 2026-07-14):
//   23.31 s covered / 73.92 s = 31.5 % b-roll, 50.61 s = 68.5 % BASE SHOWING. Targets ~30 % / ~70 %
//   (bands 25-35 % / 65-75 %) => on target. 8 distinct images, zero reuse inside the clip.
// 3 full-screens ONLY (hook / the 54.54 s segment cut / the 100x climax) = the FIRM 1-3 cap. They sit
// 51.2 s and 13.4 s apart, so no full->base-flash->full transition exists.
// The screen-share is NOT filler here and is why the budget is mostly base: 0.00-18.66 is the
// DexScreener IF/WETH ($WHATIF) chart with the Robinhood chain label, 18.66-54.54 is the CoinMarketCap
// BRETT page whose tooltip literally reads "12/02/2024 Market Cap $1.976B" (THE receipt for the
// December-2024 beat, so covering it would destroy the argument), and 54.54-73.92 is back on the
// $WHATIF chart under the 35B math and the Robinhood spot-listing close. B-roll only takes the beats
// where the base is off message (Brett's cap over the $WHATIF chart) or where a spoken abstraction has
// no on-screen referent (chain/exchange scale, retail exposure, "not the cycle top").
// staticFile() calls are LITERAL strings on purpose — the finalized-short gate scans for literal refs.
export const BROLL_W1BB: BrollEv[] = [
  // BASE 0.00-0.55 — the frame-0 thumb is ONE frame; base (Mike + the $WHATIF chart) from frame 1
  { src: staticFile('broll-w1bb-hook-100x.png'),          tIn:  0.55, tOut:  3.30, mode: 'full'    }, // HOOK: "i think it could 100X from here" ("hundred" 0.72, "X" 1.06)
  // BASE 3.30-6.90 (3.60 s) — "i compared it to brett. brett made it to a 1.97 billion market cap." (+ BRETT PEAK badge)
  { src: staticFile('broll-w1bb-bigger-than-brett.png'),  tIn:  6.90, tOut:  9.90, mode: 'content' }, // "this thing for many reasons is going to be BIGGER THAN BRETT" ("bigger" 8.68)
  // BASE 9.90-19.90 (10.00 s) — "so you're talking like 100x from here... retracements... it'll do that eventually" (the live $WHATIF chart IS the visual for a chart argument)
  { src: staticFile('broll-w1bb-robinhood-scale.png'),    tIn: 19.90, tOut: 22.90, mode: 'content' }, // "base is smaller than ROBINHOOD... COINBASE is smaller than ROBINHOOD" ("robinhood" 21.00 / 22.96)
  // BASE 22.90-33.20 (10.30 s) — "more attention brought to meme coins on the robinhood chain... listed on the robinhood app" (+ ROBINHOOD > COINBASE badge)
  { src: staticFile('broll-w1bb-retail-exposure.png'),    tIn: 33.20, tOut: 36.20, mode: 'content' }, // "exposure from REGULAR STOCK RETAIL CUSTOMERS" ("customers." 36.48)
  // BASE 36.20-48.90 (12.70 s) — "a lot more than brett... brett did this in december of 2024" — the CMC page shows 12/02/2024 $1.976B, the receipt (+ BRETT ATH badge)
  { src: staticFile('broll-w1bb-not-the-top.png'),        tIn: 48.90, tOut: 51.60, mode: 'content' }, // "in like a local run up, that was NOT THE CYCLE TOP" ("cycle" 50.90, "top." 51.12)
  // BASE 51.60-54.54 (2.94 s) — "brett did this. so the potential here, the potential is huge."
  { src: staticFile('broll-w1bb-get-in-now.png'),         tIn: 54.54, tOut: 57.50, mode: 'full'    }, // MAJOR TRANSITION: starts EXACTLY on the seg2->seg0 scene cut (54.54) so the full-screen masks it; "because like i tell people, even you get in now"
  // BASE 57.50-64.30 (6.80 s) — "not going to look at a 1000x for now. it would be like a 35 billion dollar one." (+ 1000X TODAY = $35B badge)
  { src: staticFile('broll-w1bb-spot-listing.png'),       tIn: 64.30, tOut: 67.20, mode: 'content' }, // "but if it gets that ROBINHOOD SPOT LISTING, it's on the app" ("spot" 65.80, "listing," 66.10)
  // BASE 67.20-70.90 (3.70 s) — "and we get into a cycle top scenario"
  // CLIMAX: "you could be looking at a 100X, right? because you'd be like a THREE BILLION" ("hundred" 71.46, "billion." 73.44).
  // tOut is deliberately PAST the comp end (73.90 s / frame 2217): BrollLayer fades a non-adjacent beat
  // out over its last 0.12 s, so a tOut of exactly 73.90 played that dissolve on the final ~4 frames and
  // the short ended on a ghosted double-exposure of the art over Mike's face. Parking tOut at 74.20 keeps
  // the climax at full opacity through the last rendered frame. (QA'd on the first full render, 2026-08-03.)
  { src: staticFile('broll-w1bb-three-billion.png'),      tIn: 70.90, tOut: 74.20, mode: 'full'    },
];

// ─── Badges (code-drawn text, content zone y300) ────────────────────────────────────────────────
// Every badge sits over a BASE stretch (never over a b-roll beat), no two share a time window
// (gaps 18.40 s / 15.10 s / 14.20 s), they live at y300 while captions live at y890, and all start
// long after the frame-0 thumb. Each states something the captions do NOT.
export const BADGES_W1BB: BadgeEv[] = [
  { tIn:  4.20, tOut:  6.80, color: '#3aa0ff', line1: 'BRETT PEAK', line2: '$1.97B', sub: 'THE BIGGEST MEME ON BASE',  top: 300 },
  { tIn: 25.20, tOut: 27.90, color: '#39ff14', line1: 'ROBINHOOD > COINBASE',        sub: 'BIGGER APP, BIGGER FLOWS',   top: 300 },
  { tIn: 43.00, tOut: 45.80, color: '#ffe600', line1: 'BRETT ATH', line2: 'DEC 2024', sub: 'MID CYCLE, NOT THE TOP',    top: 300 },
  { tIn: 60.00, tOut: 62.60, color: '#ffe600', line1: '1000X TODAY', line2: '= $35B',  sub: 'HONEST MATH, NOT YET',     top: 300 },
];

// ─── Frame-0 thumbnail (IG/TikTok cover) ────────────────────────────────────────────────────────
// ONE frame only (LivestreamShort defaults thumb.durS to 1/fps) — generated background art (made WITH
// the real schedule-tweets/images/reference/what-if.jpg reference) with the hook title drawn in CODE
// on top, never baked into the image. No em dashes.
export const THUMB_DEF_W1BB: ThumbDef = {
  img: THUMB_W1BB,
  title: 'WHATIF COULD\n100X\nFROM HERE',
  chip: 'BIGGER THAN BRETT',
  chipColor: '#39ff14',
  titleSize: 126,
};

// ─── SFX (shared library, COPIED into render-assets/sfx/; every event stays under the VO) ───────
// Whoosh on the thumbnail cut and on every b-roll transition that matters; two risers each BUILD
// INTO an impact; impacts are reserved for the beats that carry the clip (per
// Impacts/WHEN-TO-USE-IMPACTS.md: "reserve them for the beats that actually matter").
//
// ⚠ Cue points are each SFX's own ATTACK/PEAK position, not its file start. Envelopes RE-MEASURED on
//   this machine for this build (ffmpeg astats, 0.1 s RMS windows; attack = first window within 3 dB
//   of peak): transition_rapid_whoosh peak 0.29 - Cinematic Whoosh 02 peak 0.93 - Cinematic Whoosh 06
//   peak 0.56 - Impact_3 attack 0.26 - Impact_Hit_01-2 attack 0.09 - Soundjay_Impact_Main_01 attack
//   0.26 - Boom - Big Reveal peak 0.00 - TING attack 0.84 - Cash Register attack 0.26 - sudden-shock
//   attack 0.26 - DING attack 0.19 - Edgy_Riser attack 4.64 - Tension_Rise_Logo_Reveal_2 peak 4.86.
//   Each cue below is therefore started EARLY by exactly that offset so the crest lands on the frame
//   it punctuates. Quiet FILES (Cinematic Whoosh 06 -26.4 dB, Cash Register -26.9 dB vs the impacts at
//   -8 to -12 dB) get a higher vol so they are actually audible under the VO.
export const SFX_W1BB: Sfx[] = [
  { t:  0.00, src: staticFile('sfx/transition_rapid_whoosh.mp3'),          vol: 0.46, dur: 1.00 }, // frame-0 thumbnail cut (crest 0.29)
  { t:  0.46, src: staticFile('sfx/Impacts/Impact_3.wav'),                 vol: 0.40, dur: 2.40 }, // hook full-screen in (0.55) + lands on "100x" (0.72)
  { t:  3.01, src: staticFile('sfx/transition_rapid_whoosh.mp3'),          vol: 0.32, dur: 1.00 }, // crest 3.30 = cut out of the hook full-screen back to base
  { t:  6.34, src: staticFile('sfx/Cinematic Whoosh 06.wav'),              vol: 0.80, dur: 2.00 }, // crest 6.90 = into the "bigger than brett" cutaway
  { t:  8.42, src: staticFile('sfx/ding/sudden-shock.mp3'),                vol: 0.36, dur: 1.80 }, // lands on the word "bigger" (8.68)
  { t: 19.61, src: staticFile('sfx/transition_rapid_whoosh.mp3'),          vol: 0.34, dur: 1.00 }, // crest 19.90 = into the Robinhood-scale cutaway
  { t: 20.16, src: staticFile('sfx/TING SOUND EFFECT.mp3'),                vol: 0.44, dur: 2.00 }, // bell attacks on "robinhood" (21.00)
  { t: 32.91, src: staticFile('sfx/transition_rapid_whoosh.mp3'),          vol: 0.34, dur: 1.00 }, // crest 33.20 = into the retail-exposure cutaway
  { t: 36.69, src: staticFile('sfx/Cash Register.mp3'),                    vol: 0.68, dur: 1.90 }, // kaching lands in the beat AFTER "retail customers." (36.48-36.90)
  { t: 44.26, src: staticFile('sfx/risers/Edgy_Riser.wav'),                vol: 0.24, dur: 5.30 }, // riser BUILDS INTO the "not the cycle top" cut (crest 48.90)
  { t: 48.64, src: staticFile('sfx/transition_rapid_whoosh.mp3'),          vol: 0.32, dur: 1.00 }, // crest 48.93 = the cutaway cut
  { t: 50.64, src: staticFile('sfx/Impacts/Soundjay_Impact_Main_01.wav'),  vol: 0.40, dur: 2.20 }, // lands on "cycle top." (50.90)
  { t: 53.61, src: staticFile('sfx/Cinematic Whoosh 02.wav'),              vol: 0.48, dur: 2.20 }, // sweeps INTO the 54.54 segment cut / full-screen #2
  { t: 54.45, src: staticFile('sfx/Impacts/Impact_Hit_01-2.wav'),          vol: 0.42, dur: 2.40 }, // hits ON that cut (54.54)
  { t: 59.89, src: staticFile('sfx/DING.mp3'),                             vol: 0.34, dur: 2.00 }, // punctuates the "1000X TODAY = $35B" badge (60.00), just ahead of the spoken "35" (60.14)
  { t: 64.01, src: staticFile('sfx/transition_rapid_whoosh.mp3'),          vol: 0.34, dur: 1.00 }, // crest 64.30 = into the spot-listing cutaway
  { t: 65.26, src: staticFile('sfx/TING SOUND EFFECT.mp3'),                vol: 0.42, dur: 2.00 }, // listing bell attacks on "listing," (66.10)
  { t: 66.04, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_2.wav'), vol: 0.22, dur: 5.10 }, // riser BUILDS INTO the climax (crest 70.90)
  { t: 70.90, src: staticFile('sfx/Boom - Big Reveal.wav'),                vol: 0.40, dur: 3.00 }, // CLIMAX full-screen cut; its peak is at 0.00 so it lands exactly on the cut, tail under "100x" (71.46)
];

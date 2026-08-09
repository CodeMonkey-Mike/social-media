import { staticFile } from 'remotion';
import type { BrollEv, Sfx } from './_kit';
import type { BadgeEv, ThumbDef } from './LivestreamShort';

// ─── whatif-next-dogecoin (batch: what-if-1000x, clip #5, variant: solo) ────────────────────────
// "What If Could Be the Next Dogecoin" — Pepe launched with insiders and was on HTX within a week,
// then Gate and MEXC the next day, and it pumped like your typical insider coin. $WHATIF is running
// with ZERO centralized exchange listings because the community is behind it, which could make it a
// better play than Pepe: a Dogecoin-type timeless concept instead of a manufactured pump.
//
// Base clip: whatif-next-dogecoin-tightened-desilenced.mp4 (raw cut -> Phase 5 tighten -> 5B
// desilence). ALREADY composited vertical (screen-share on top, webcam below), 1080x1920 @ 25 fps,
// 64.76 s. FINAL, do NOT re-cut and do NOT re-split the zones. The comp runs at 30 fps;
// OffthreadVideo resamples the 25 fps source by TIME, so every cue below is plain seconds taken from
// the clip's own Whisper word timings (clip-relative, 0-based).
//
// Render (public-dir = the CLIP's render-assets/, which holds the spine + thumbnail + b-roll + sfx):
//   npx remotion render src/index.ts WhatifNextDogecoin \
//     out/what-if-1000x/5-whatif-next-dogecoin.mp4 \
//     --public-dir "<repo>/video-creation/shorts/what-if-1000x/whatif-next-dogecoin/render-assets"

export const WND_FPS = 30;
export const WND_DURATION = 1942; // 64.733 s @30, just inside the 64.76 s clip (no black tail frame)

export const CLIP_WND  = staticFile('whatif-next-dogecoin.mp4');
export const THUMB_WND = staticFile('thumbnail-wnd.png');

// Layout geometry, MEASURED on this clip (row-mean gradient scan at t=2/10/20/30/40/50/60/64 s; all
// eight frames put the hard screen-share/webcam divider on the same row).
export const WND_SEAM  = 853; // content zone = 0..853 (DexScreener / his research panel); webcam below
export const WND_CAP_Y = 890; // caption centre: under the seam, on his hairline, never his eyes (~1200)

// ─── B-roll beats (authored in BROLL-PLAN.md BEFORE generation) ────────────────────────────────
// Coverage budget (SKILL "B-roll coverage budget", HALVED 2026-07-14):
//   20.34 s covered / 64.76 s = 31.4 % b-roll, 44.42 s = 68.6 % BASE SHOWING. Targets ~30 % / ~70 %
//   (bands 25-35 % / 65-75 %) => on target. 7 distinct images, zero reuse inside the clip.
// 3 full-screens ONLY (hook / the insider-pump climax / the Dogecoin-timeless climax) = the FIRM 1-3
// cap. They are 22 s and 31 s apart, so no full->full base flash exists.
// The screen-share is a genuine RECEIPT for most of this clip and is therefore SHOWN, not covered:
// the CASHCAT page is literally on screen on "this is a boring cat" (2.5 s), the real $WHATIF
// (IF/WETH, Robinhood > Uniswap) page runs 3.4-13.8 s, the PEPE/WETH weekly chart runs 15-32 s and
// 41-64.8 s, and from 31.95-40.95 his own research panel reads "Huobi/HTX was the first centralized
// exchange to list the original PEPE token ... ahead of Gate.io and MEXC the next day" — exactly what
// he is saying, so that 9 s window carries NO b-roll at all.
// staticFile() calls are LITERAL strings on purpose — the finalized-short gate scans for literal refs.
export const BROLL_WND: BrollEv[] = [
  // BASE 0.00-0.80 — open on Mike + the CASHCAT page (the frame-0 thumb is ONE frame; base from frame 1)
  { src: staticFile('broll-wnd-hook.png'),           tIn:  0.80, tOut:  2.24, mode: 'full'    }, // HOOK: "the thing with the what if is kind of unique" ("unique." 1.64-1.86)
  // BASE 2.24-9.70 (7.46 s) — "this is a boring cat" (the CASHCAT page IS on screen) -> "what if is a
  // concept?" (he switches to the real $WHATIF page at 3.40) -> "nobody's ever thought of this before"
  { src: staticFile('broll-wnd-animals.png'),        tIn:  9.70, tOut: 12.40, mode: 'content' }, // "i'm SO TIRED of all these ANIMALS that keep coming out" ("animals" 10.84)
  // BASE 12.40-19.60 (7.20 s) — "needs to be something new, right? pepe launched and had investors,
  // right? had insiders" (the PEPE research-panel peek 13.75-14.95, then the PEPE/WETH launch candle)
  { src: staticFile('broll-wnd-exchange-blitz.png'), tIn: 19.60, tOut: 22.40, mode: 'content' }, // "it starts getting LISTED on a whole bunch of CENTRALIZED EXCHANGES" (21.52-22.62)
  // BASE 22.40-24.60 (2.20 s) — "now, and it just pumped like," over the PEPE chart he is describing
  { src: staticFile('broll-wnd-insider-pump.png'),   tIn: 24.60, tOut: 27.85, mode: 'full'    }, // CLIMAX-1: "it pumped like your TYPICAL INSIDER COIN" ("insider" 25.98, "coin." 26.40)
  { src: staticFile('broll-wnd-pengu-4b.png'),       tIn: 27.85, tOut: 31.20, mode: 'content' }, // "pengu pumped to like FOUR BILLION, right? in the next day" — EXACTLY butted (tOut === tIn) so BrollLayer HARD-CUTS with zero base frames between them
  // BASE 31.20-44.30 (13.10 s) — THE RECEIPT: "the first centralized exchange was listed on HTX ...
  // and then the next day it was listed on Gate and MEXC. so pepe's not like a community driven coin."
  // His own research panel names HTX first and Gate.io + MEXC the next day for 9 s straight. Badge B
  // rides the tail of it; nothing covers it.
  { src: staticFile('broll-wnd-community.png'),      tIn: 44.30, tOut: 47.80, mode: 'content' }, // "what if is going up like crazy... because the COMMUNITY is getting behind it" ("community" 46.56)
  // BASE 47.80-58.80 (11.00 s) — "so that hasn't happened with what if ... even what if might be even
  // a BETTER PLAY THAN PEPE. it might be like your typical dogecoin type of meme." (badges C + D)
  { src: staticFile('broll-wnd-timeless.png'),       tIn: 58.80, tOut: 62.10, mode: 'full'    }, // CLIMAX-2: "it could be like a DOGECOIN. what if is something that could be TIMELESS" (59.74 / 61.66)
  // BASE 62.10-64.76 (2.66 s) — the hard-out kicker: "what if robinhood lists it and it runs, right?"
];

// ─── Badges (code-drawn text, content zone y300) ────────────────────────────────────────────────
// Every badge sits over a BASE stretch (never over a b-roll beat), no two share a time window
// (gaps 33.4 s / 6.0 s / 3.3 s), they live at y300 while captions live at y890, and all start long
// after the frame-0 thumb. Each states something the captions do NOT.
export const BADGES_WND: BadgeEv[] = [
  { tIn:  5.60, tOut:  8.20, color: '#39ff14', line1: 'A CONCEPT', line2: 'NOT AN ANIMAL', sub: '$WHATIF ON ROBINHOOD CHAIN', top: 300 },
  { tIn: 41.60, tOut: 43.90, color: '#ffe600', line1: 'HTX, GATE, MEXC',                   sub: 'PEPE LISTED INSIDE ONE WEEK', top: 300 },
  { tIn: 49.90, tOut: 52.30, color: '#39ff14', line1: 'ZERO CEX LISTINGS',                 sub: 'WHAT IF IS RUNNING ON COMMUNITY', top: 300 },
  { tIn: 55.60, tOut: 58.00, color: '#ff9f1c', line1: 'FOLLOW ME',                         sub: 'FOR MEME PLAYS AND DAILY STREAMS', top: 300 },
];

// ─── Frame-0 thumbnail (IG/TikTok cover) ────────────────────────────────────────────────────────
// ONE frame only (LivestreamShort defaults thumb.durS to 1/fps) — generated background art with the
// hook title drawn in CODE on top, never baked into the image. No em dashes.
export const THUMB_DEF_WND: ThumbDef = {
  img: THUMB_WND,
  title: 'THE NEXT\nDOGECOIN\nIS NOT A DOG',
  chip: '$WHATIF, ZERO EXCHANGES',
  chipColor: '#39ff14',
  titleSize: 118, // 12-char longest line ("IS NOT A DOG") stays inside the 968 px text box
};

// ─── SFX (shared library, COPIED into render-assets/sfx/; every event stays under the VO) ───────
// Whoosh on the thumbnail cut and on every b-roll transition that matters; two risers each BUILD
// INTO an impact; impacts are reserved for the two beats that carry the clip (per
// Impacts/WHEN-TO-USE-IMPACTS.md: "reserve them for the beats that actually matter").
//
// ⚠ Cue points are each SFX's own ATTACK/PEAK position, not its file start. Envelopes measured on
//   this machine at 0.1 s RMS: transition_rapid_whoosh peaks 0.10 s in - Cinematic Whoosh 02 peaks
//   0.80 s - sudden-shock attacks 0.10 s / peaks 0.30 s - TING attacks 0.70 s / peaks 0.80 s -
//   Tension_Rise_Logo_Reveal_2 peaks 4.70 s - Tension_Rise_Logo_Reveal_3 peaks 2.50 s -
//   Impact_Hit_01-2 peaks 0.10 s - Soundjay_Impact_Main_01 peaks 0.20 s - Cash Register peaks 0.20 s -
//   Boom - Big Reveal peaks at 0.00 s. Each cue below is therefore started EARLY by exactly that
//   offset so the crest lands on the frame it punctuates. Peak RMS differs by 22 dB across these
//   files, so the quiet ones (Cash Register -27.6 dB) get a higher vol and the loud ones
//   (Boom -5.5 dB, Soundjay -6.2 dB) a lower one.
export const SFX_WND: Sfx[] = [
  // ⚠ MASKING FIX (SKILL item 7, whisper-verified on the FINAL MIX 2026-08-03). At the authored
  // 0.42 / 0.46 the pair sat on top of the opening line and Whisper read "the thing with the 1F is
  // kind of unique" off the render while the spine alone gives "the thing with the WHAT IF is kind
  // of unique" - the token's own name, masked by the cover-cut whoosh. Swept offline against
  // Whisper (spine + both cues mixed at each level): 0.46 / 0.32 / 0.26 / 0.24 all still return
  // "1F"; 0.22 restores "what-if", and dropping the rapid whoosh to 0.30 also restores the leading
  // "Now", so the mix now transcribes IDENTICALLY to the spine. Do not raise these two back up.
  { t:  0.00, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.30, dur: 1.00 }, // frame-0 thumbnail cut
  { t:  0.00, src: staticFile('sfx/Cinematic Whoosh 02.wav'),               vol: 0.22, dur: 2.20 }, // sweeps INTO the HOOK full-screen (crest 0.80 = the cut)
  { t:  2.42, src: staticFile('sfx/ding/sudden-shock.mp3'),                 vol: 0.30, dur: 1.80 }, // lands on "boring cat" (2.52), the base gag
  { t:  9.60, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.36, dur: 1.00 }, // cut into the "all these animals" cutaway (9.70)
  { t: 19.50, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.36, dur: 1.00 }, // cut into the listing-blitz cutaway (19.60)
  { t: 19.90, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_2.wav'), vol: 0.18, dur: 5.00 }, // riser BUILDS INTO the insider-pump full-screen (crest 24.60)
  { t: 21.26, src: staticFile('sfx/TING SOUND EFFECT.mp3'),                 vol: 0.40, dur: 2.00 }, // lands on "centralized exchanges" (21.96)
  { t: 24.50, src: staticFile('sfx/Impacts/Impact_Hit_01-2.wav'),           vol: 0.40, dur: 2.20 }, // IMPACT on the cut to the insider-pump full-screen (24.60)
  { t: 27.75, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.34, dur: 1.00 }, // the B4 -> B5 HARD CUT (27.85)
  { t: 29.72, src: staticFile('sfx/Cash Register.mp3'),                     vol: 0.75, dur: 1.90 }, // kaching ATTACKS on "four billion" (29.92); quietest file in the set
  { t: 33.40, src: staticFile('sfx/TING SOUND EFFECT.mp3'),                 vol: 0.36, dur: 2.00 }, // receipt: lands on "htx" (34.10)
  { t: 44.20, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.36, dur: 1.00 }, // cut into the community cutaway (44.30)
  { t: 56.30, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_3.wav'), vol: 0.16, dur: 2.70 }, // riser BUILDS INTO the Dogecoin climax (crest 58.80)
  { t: 58.60, src: staticFile('sfx/Impacts/Soundjay_Impact_Main_01.wav'),   vol: 0.34, dur: 2.40 }, // IMPACT on the cut to the timeless full-screen (58.80)
  { t: 59.74, src: staticFile('sfx/Boom - Big Reveal.wav'),                 vol: 0.36, dur: 2.80 }, // the biggest hit of the short, on "dogecoin" (59.74)
  { t: 62.30, src: staticFile('sfx/TING SOUND EFFECT.mp3'),                 vol: 0.36, dur: 2.00 }, // the Robinhood kicker (63.00)
];

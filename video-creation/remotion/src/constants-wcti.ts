import { staticFile } from 'remotion';
import type { BrollEv, Sfx } from './_kit';
import type { BadgeEv, ThumbDef } from './LivestreamShort';

// ─── whatif-cto-100x-call-impact (batch: October-pumps, clip #6, variant: impact) ───────────────
// "Forget 20 Million, WHATIF Could 100x" — the IMPACT cut of the WHATIF thesis: it is a CTO now,
// short term to ~20 million (a 5x from here), then "forget about 20 million, it could go to 100
// million, we could even be like a 100x from here. not financial advice, never financial advice in
// this video man, are you out of your mind?"
//
// SIBLING NOTE: this is the impact cut of clip #1 `whatif-cto-100x-call` (comp WhatifCto100xCall,
// constants-wcto.ts). It shares source seconds with clip #1 BY DESIGN and ships as its own short.
// Per the "no duplicate b-roll across same-topic shorts" HARD RULE every asset below is NEWLY
// generated into THIS clip's own render-assets/ with its own `-wcti-` filename and a deliberately
// different composition/angle/palette from clip #1's `-wcto-` treatment. Nothing here resolves into
// clip #1's folder.
//
// Base clip: whatif-cto-100x-call-impact-final.mp4 (raw cut -> tighten -> desilence -> filler
// removal -> impact assembly). ALREADY composited vertical (screen-share on top, webcam below),
// 1080x1920 @ 25 fps, 18.16 s video / 18.21 s audio. FINAL, do NOT re-cut and do NOT re-split the
// zones. The comp runs at 30 fps; OffthreadVideo resamples the 25 fps source by TIME, so every cue
// below is plain seconds taken from the clip's own caption timings (clip-relative, 0-based).
//
// The clip is a 3-segment scatter-gather with TWO hard concat joins, both on complete phrases:
//   join #1 at 4.56 s (scene score 0.700) - off-message Trump X post -> the IF/WETH mcap chart
//   join #2 at 7.76 s (scene score 0.125) - same chart both sides, phrase boundary
// Both are MASKED by b-roll (beat 1 runs out exactly ON join #1, beat 2 straddles join #2).
//
// Render (public-dir = the CLIP's render-assets/, which holds the spine + thumbnail + b-roll + sfx):
//   npx remotion render src/index.ts WhatifCto100xCallImpact \
//     out/October-pumps/6-whatif-cto-100x-call-impact.mp4 \
//     --public-dir "<repo>/video-creation/shorts/October-pumps/whatif-cto-100x-call-impact/render-assets"

export const WCTI_FPS = 30;
export const WCTI_DURATION = 544; // 18.133 s @30, just inside the 18.16 s video stream (no black tail frame)

export const CLIP_WCTI  = staticFile('whatif-cto-100x-call-impact-final.mp4');
export const THUMB_WCTI = staticFile('thumbnail-wcti.png');

// Layout geometry, MEASURED on this clip (row-mean gradient scan at t=1/5/9/13/17 s; all five frames
// put the hard screen-share/webcam divider on the same row, gradient 186-191 grey levels vs 57 for
// the next-strongest row).
export const WCTI_SEAM  = 854; // content zone = 0..854 (DexScreener IF/WETH mcap chart); webcam plays below
export const WCTI_CAP_Y = 890; // caption centre: below the seam, above his hairline (~1050), never his eyes (~1430)

// ─── B-roll beats (authored in BROLL-PLAN.md BEFORE generation) ────────────────────────────────
// Coverage budget (SKILL "B-roll coverage budget", HALVED 2026-07-14):
//   6.11 s covered / 18.16 s = 33.6 % b-roll, 12.05 s = 66.4 % BASE SHOWING. Targets ~30 % / ~70 %
//   (bands 25-35 % / 65-75 %) => in band. 3 distinct images, zero reuse inside the clip and zero
//   reuse from clip #1.
// 2 full-screens ONLY (the CTO hook and the 100x climax), 7.7 s apart, so no full->full base flash
// exists and the FIRM 1-3 cap holds.
// The screen-share is the RECEIPT here: from 4.56 s to the end the content zone is the DexScreener
// IF/WETH MARKET CAP chart (reading ~4.1M) next to the real verified IF/WETH panel with the WHAT IF
// banner and the "Robinhood > Uniswap" route - i.e. exactly the thing he is putting a 20M / 100M /
// 100x number on. So the back half is BASE by design. The only genuinely off-message window is the
// unrelated Trump-tariff X post at 0.00-4.56, and beat 1 covers 1.40-4.56 of it.
// staticFile() calls are LITERAL strings on purpose - the finalized-short gate scans for literal refs.
export const BROLL_WCTI: BrollEv[] = [
  // BASE 0.00-1.40 — open on Mike + the screen-share (the frame-0 thumb is ONE frame; base from frame 1)
  { src: staticFile('broll-wcti-hook-takeover.png'),      tIn:  1.40, tOut:  4.56, mode: 'full'    }, // HOOK: "so what if it's a CTO right now?" ("cto" 3.22, "now?" 4.10). Runs out exactly ON concat join #1
  // BASE 4.56-6.75 (2.19 s) — "it could go in the short term to 20 million" (the mcap chart IS the visual) + badge 20M
  { src: staticFile('broll-wcti-5x-beams.png'),           tIn:  6.75, tOut:  8.05, mode: 'content' }, // "we're talking about A FIVE X from here" (6.76) — straddles concat join #2 (7.76)
  // BASE 8.05-12.25 (4.20 s) — "forget about 20 million. it could go to 100 million" over the ~4.1M mcap chart, riser building
  { src: staticFile('broll-wcti-100x-breakthrough.png'),  tIn: 12.25, tOut: 13.90, mode: 'full'    }, // CLIMAX: "we could even be like A HUNDRED X from here" ("hundred" 12.72)
  // BASE 13.90-18.13 (4.23 s) — "not financial advice. never financial advice in this video man. are you
  // out of your mind?" back on Mike + the mcap chart (+ the NOT FINANCIAL ADVICE badge). The loop frame
  // is his face, deliberate.
];

// ─── Badges (code-drawn text, content zone y300) ────────────────────────────────────────────────
// Only 2 badges, 8.15 s apart, so they can never share a frame. Each sits over a BASE stretch and
// never over a b-roll beat: badge 1 renders 5.00-6.55 (beat 2 starts 6.75), badge 2 renders
// 14.50-17.30 (beat 3 ended 13.90). They live at y300 while captions live at y890, and both start
// long after the frame-0 thumb. Each states something the captions do NOT ("FROM 4.1M TODAY" is read
// off the DexScreener panel in the base video).
export const BADGES_WCTI: BadgeEv[] = [
  { tIn:  5.10, tOut:  6.45, color: '#00e5ff', line1: '20M', line2: 'SHORT TERM', sub: 'FROM 4.1M TODAY', top: 300 },
  { tIn: 14.60, tOut: 17.20, color: '#ffe600', line1: 'NOT FINANCIAL', line2: 'ADVICE', sub: 'CONVICTION, NOT A PRICE TARGET', top: 300 },
];

// ─── Frame-0 thumbnail (IG/TikTok cover) ────────────────────────────────────────────────────────
// ONE frame only (LivestreamShort defaults thumb.durS to 1/fps) — generated background art with the
// hook title drawn in CODE on top, never baked into the image. No em dashes, no @mikeneder.
export const THUMB_DEF_WCTI: ThumbDef = {
  img: THUMB_WCTI,
  title: 'FORGET\n20 MILLION\nWHATIF COULD\n100X',
  chip: 'IT IS A CTO NOW',
  chipColor: '#39ff14',
  // 100, not the 116-122 other clips use: the generated background's candle staircase climbs into the
  // upper RIGHT, so the widest title line ("WHATIF COULD") is kept narrow enough to stay clear of it.
  titleSize: 100,
};

// ─── SFX (shared library, COPIED into render-assets/sfx/; every event stays under the VO) ───────
// Whoosh on the thumbnail cut and on both edges of the hook full-screen; ONE riser that builds
// through "forget about 20 million... 100 million" and CRESTS on the climax cut; the biggest impact
// of the short lands ON the word "hundred" (the 100x).
//
// ⚠ Cue points are each SFX's own PEAK/ATTACK position, not its file start. Envelopes RE-MEASURED
//   for this build at 0.2 s RMS on this machine: transition_rapid_whoosh peaks 0.20 s in -
//   Cinematic Whoosh 02 peaks 0.80 s - Impact_3 peaks 0.40 s - Cash Register attacks/peaks 0.20 s -
//   Tension_Rise_Logo_Reveal_2 peaks 4.60 s - Soundjay_Impact_Main_01 peaks 0.20 s - Boom - Big
//   Reveal peaks 0.00 s - dramatic-shocked-sfxshocked peaks 1.00 s. Each cue below is started EARLY
//   by exactly that offset so the crest lands on the frame it punctuates. Cash Register is a quiet
//   file (-24.8 dB peak vs -2.8 dB for Boom) so its vol is raised to stay audible under the VO.
export const SFX_WCTI: Sfx[] = [
  { t:  0.00, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.46, dur: 1.00 }, // frame-0 thumbnail cut (crest 0.20)
  { t:  0.60, src: staticFile('sfx/Cinematic Whoosh 02.wav'),               vol: 0.52, dur: 2.00 }, // sweeps INTO the HOOK full-screen (crest 1.40 = the cut)
  { t:  2.82, src: staticFile('sfx/Impacts/Impact_3.wav'),                  vol: 0.42, dur: 2.20 }, // lands on the word "cto" (3.22)
  { t:  4.36, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.38, dur: 1.00 }, // hook full-screen OUT, masks concat join #1 (4.56)
  { t:  6.56, src: staticFile('sfx/Cash Register.mp3'),                     vol: 0.74, dur: 1.90 }, // kaching ATTACKS on "five x" (6.76)
  { t:  7.65, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_2.wav'), vol: 0.24, dur: 4.75 }, // RISER builds into the 100x (crest 12.25)
  { t: 12.05, src: staticFile('sfx/Impacts/Soundjay_Impact_Main_01.wav'),   vol: 0.32, dur: 2.40 }, // the cut to the CLIMAX full-screen (12.25), where the riser crests
  { t: 12.72, src: staticFile('sfx/Boom - Big Reveal.wav'),                 vol: 0.55, dur: 3.00 }, // lands ON "hundred": the BIGGEST hit of the short
  { t: 16.24, src: staticFile('sfx/ding/dramatic-shocked-sfxshocked.mp3'),  vol: 0.10, dur: 1.90 }, // "are you out of your mind?" (17.24)
  // ⚠ The last two vols are INTELLIGIBILITY-TUNED, not taste. A first HQ render at 0.44 / 0.38 was
  // whisper-verified and the SFX MASKED the VO: the closing punchline "are you out of your mind?"
  // transcribed as "even you are here, my" off the render while the SPINE alone transcribed it
  // perfectly, and "we could even be" degraded under the climax impact. Volumes were swept against
  // Whisper on spine+SFX mixes: the shock sting only stops masking at 0.10 (0.15 and 0.20 still
  // masked) and the climax impact stops masking at 0.32 (0.24 gains nothing further). Do NOT raise
  // these back up without re-running that sweep. The Boom on "hundred" is untouched and is still the
  // biggest hit in the short.
];

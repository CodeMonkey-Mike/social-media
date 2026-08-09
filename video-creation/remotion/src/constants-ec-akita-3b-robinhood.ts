import { staticFile } from 'remotion';
import type { BrollEv, Sfx } from './_kit';
import type { BadgeEv, OverlayEv, ThumbDef } from './LivestreamShort';

// ─── akita-3b-robinhood (batch: early-crash, clip #1, variant: full) ────────────────────────────
// "Here's why Robinhood chain tokens will pass 6 billion." (Mike's 4b title)
// He walks the viewer through the live DEXScreener AKITA/WETH market-cap chart: a 2021 Inu meme coin
// that started at a $120K market cap, never got a centralized-exchange listing, and still printed a
// $3 BILLION top. Then the turn: the Robinhood chain is about to bring that same liquidity, and
// anybody in it right now is early. Ends on a deliberate HARD-OUT, "it's very possible."
//
// Base clip: akita-3b-robinhood-final.mp4 (raw cut -> Phase 5 tighten -> 5B desilence at min-sil 0.25
// -> 5C filler pass). ALREADY composited vertical (screen-share on top, webcam below), 1080x1920 @
// 25 fps, 128.137 s. FINAL, do NOT re-cut and do NOT re-split the zones. The comp runs at 30 fps;
// OffthreadVideo resamples the 25 fps source by TIME, so every cue below is plain seconds taken from
// the clip's own Whisper word timings (clip-relative, 0-based).
//
// ⚠ The file referenced here is the render-assets COPY, re-encoded to a SEEK-FRIENDLY GOP
//   (-g 25 -keyint_min 25 -bf 0 -sc_threshold 0) by
//   `python video-creation/livestream-repurpose/scripts/setup_render_assets.py early-crash`.
//   Verified on this copy: keyframes at 0.00 / 1.08 / 2.08 / 3.08 ... (~1.0 s GOP). The canonical
//   spine in the clip folder is never touched.
//
// Render (public-dir = the BATCH render-assets/, shared with clips 3/4/5/6; every file this clip
// owns is `*-ec-aka-*` / `thumb-eca` prefixed so the parallel builders cannot collide):
//   npx remotion render src/index.ts EcAkita3bRobinhood \
//     out/early-crash/1-akita-3b-robinhood.mp4 \
//     --public-dir "<repo>/video-creation/shorts/early-crash/render-assets"

export const EC_AKA_FPS = 30;
export const EC_AKA_DURATION = 3844; // 128.14 s @30; last frame index 3843 = t 128.100 s, inside the clip

export const CLIP_EC_AKA  = staticFile('akita-3b-robinhood.mp4');
export const THUMB_EC_AKA = staticFile('thumb-eca.png');

// Layout geometry, MEASURED on this clip (row-mean gradient scan at
// t = 1/8/15/22/30/40/50/60/70/85/100/115/127 s; all THIRTEEN frames put the hard screen-share/webcam
// divider on row 854, delta 181-205).
export const EC_AKA_SEAM  = 853; // content zone = 0..853 (the live DEXScreener AKITA/WETH chart); webcam below
export const EC_AKA_CAP_Y = 890; // caption centre: 37 px under the seam, on his hair, never his eyes (~1200-1290)

// Robinhood's identity colour is neon LIME (feedback_robinhood_coin_color). ⛔ Never teal on this
// clip: teal is Kaspa's colour and a teal accent on a Robinhood short misreads as a Kaspa short.
// Same value + same rule as the sibling Robinhood clip in this batch (EC_TFS_LIME, clip #4). Passed
// into BrollLayer as the divider colour under content-mode images (B2 and B5) and used by the
// Robinhood-chain badge; BrollLayer still defaults to teal for every other comp.
// (Added 2026-08-08 on the re-render: the first render shipped the teal default here, which is the
// exact misread clip #4 had already documented.)
export const EC_AKA_LIME = '#ccff00';

// ─── B-roll beats (authored in BROLL-PLAN.md BEFORE generation) ────────────────────────────────
//
// ⛔ MIKE'S CLIP-SPECIFIC DIRECTIVE (2nd review, 2026-08-07) OVERRIDES THE ~25-35 % COVERAGE BAND.
// He is guiding the viewer through the Akita chart and it must NOT be covered: b-roll is allowed
// ONLY in the first ~5 s and the last ~15 s (~113-128 s); the ENTIRE MIDDLE stays barren (no
// full-screen images, no content-zone images), and mid-clip only TRANSPARENT elements (alpha PNGs /
// code-drawn badges that leave the chart visible) are permitted, sparingly.
//   coverage 14.60 s / 128.14 s = 11.4 % b-roll, 113.54 s = 88.6 % BASE SHOWING.
//   ⚠ That is DELIBERATELY BELOW the SKILL's 25-35 % band, by his instruction, and it is reported as
//   a deviation rather than silently "fixed". Do not restore coverage from this file.
// 5 distinct images, zero reuse inside the clip. 3 full-screens (hook / climax / projection) = the
// FIRM 1-3 cap; B3->B4 are EXACTLY butted (tOut === tIn = 121.10) so BrollLayer HARD-CUTS with zero
// base frames between, and B4->B5 likewise at 123.85. The only other join, B2 -> B3, is a deliberate
// 3.00 s base gap (> the 1.5 s minimum), so no sub-1 s base flash exists anywhere.
// staticFile() calls are LITERAL strings on purpose - the finalized-short gate scans for literal refs.
export const BROLL_EC_AKA: BrollEv[] = [
  // BASE 0.03-0.90 - the frame-0 thumb is ONE frame; the video opens on Mike + the live chart
  { src: staticFile('broll-ec-aka-hook.png'),         tIn:   0.90, tOut:   4.80, mode: 'full'    }, // HOOK: "some of the 2021 meme coins that went like to A BILLION OR MORE, like EXPLODED" (0.00-5.68)
  // ⛔ BASE 4.80-113.30 (108.50 s) - THE ENTIRE AKITA CHART WALK-THROUGH, barren by directive.
  // Carried by 2 code badges + 1 alpha overlay (below), all inside rows 470-850 so the candles stay visible.
  { src: staticFile('broll-ec-aka-rh-app.png'),       tIn: 113.30, tOut: 116.30, mode: 'content' }, // "gets listed in the ROBINHOOD APP in a bull run, in a PARABOLIC bull run" (113.44-116.32)
  // BASE 116.30-119.30 (3.00 s) - "just imagine how far, how far it might go" plays on his face; the riser runs under it
  { src: staticFile('broll-ec-aka-candle-tower.png'), tIn: 119.30, tOut: 121.10, mode: 'full'    }, // CLIMAX: "this went to 3 BILLION" (119.44-120.18)
  { src: staticFile('broll-ec-aka-orbit.png'),        tIn: 121.10, tOut: 123.85, mode: 'full'    }, // PROJECTION: "could we see like a 10 OR 20 BILLION token?" - EXACTLY butted to the previous beat, hard cut
  { src: staticFile('broll-ec-aka-if-galaxy.png'),    tIn: 123.85, tOut: 126.90, mode: 'content' }, // "could CASH CAT and $IF, could it go to 10 or 20 billion?" - generated WITH schedule-tweets/images/reference/what-if.jpg
  // BASE 126.90-128.14 (1.24 s) - the deliberate HARD-OUT "it's very possible." plays on his face
  // with nothing over it and no tail. That abruptness is the watch-time strategy, not an omission.
];

// ─── Transparent overlay (real alpha PNG) ───────────────────────────────────────────────────────
// The ONE image-based element allowed mid-clip. Generated glow-on-black and converted to TRUE alpha
// (alpha = boosted luminance, per SKILL "Transparent overlays"): 90.5 % of the 1254x1254 png is fully
// transparent, so it composites over the live chart without a box. `blend: 'normal'` because the
// screen-share underneath is a DARK chart but the transactions table has light rows; screen-blend
// would wash out over those.
// Placement x 96-436, y 476-816 = inside the STATIC transactions table, well clear of the candles
// (rows 40-430) and of the seam (row 854). It sits on "it was DOWN, DOWN, DOWN, DOWN" - the seed at
// the bottom of the crash - and ENDS 0.30 s before badge 1 opens, so the two never co-occur.
export const OVERLAYS_EC_AKA: OverlayEv[] = [
  { src: staticFile('broll-ec-aka-ov-sprout.png'), tIn: 19.60, tOut: 21.20, top: 476, left: 96, width: 340, blend: 'normal' },
];

// ─── Code-drawn badges ──────────────────────────────────────────────────────────────────────────
// All three sit in the barren middle, in the transactions-table band, and are 56.9 s and 19.4 s
// apart, so no two can ever co-occur. None starts before the thumb frame ends (0.033 s), and
// LivestreamShort suppresses badges while the thumb is up anyway.
//
// ⚠ GEOMETRY: the shared `Badge` is `left: 50%` with `translate(-50%,-50%)` and no explicit width, so
// the shrink-to-fit box is capped at 540 px (~436 px of text after the 52 px side padding). Every
// line below is kept short enough NOT to wrap: line1 <= 10 chars @60 px, line2 <= 8 chars @82 px,
// sub <= 19 chars @32 px. `top` is the box CENTRE, so a ~250 px tall badge at top 660 spans rows
// ~535-785: below the candles (rows 40-430), above the caption band (centre 890) and above the seam.
export const BADGES_EC_AKA: BadgeEv[] = [
  { tIn:  21.50, tOut:  24.20, color: '#ffe600', line1: 'STARTED AT', line2: '$120K',    sub: 'MARKET CAP',          top: 660 },
  { tIn:  81.10, tOut:  83.90, color: '#39ff14', line1: 'AKITA HIT',  line2: '$3B',      sub: 'ZERO EXCHANGES',      top: 660 },
  { tIn: 103.30, tOut: 105.90, color: EC_AKA_LIME, line1: 'RIGHT NOW', line2: 'IS EARLY', sub: 'ROBINHOOD CHAIN',   top: 660 },
];

// ─── Frame-0 thumbnail (IG/TikTok cover) ────────────────────────────────────────────────────────
// ONE frame only (LivestreamShort defaults thumb.durS to 1/fps) - generated background art with the
// hook title drawn in CODE on top, never baked into the image. No em dashes.
export const THUMB_DEF_EC_AKA: ThumbDef = {
  img: THUMB_EC_AKA,
  title: '$3 BILLION\nON A DOG\nCOIN WITH\nNO EXCHANGES',
  chip: 'ROBINHOOD CHAIN IS NEXT',
  chipColor: '#39ff14',
  titleSize: 112, // longest line "NO EXCHANGES" (12 chars) stays inside the 968 px text box
};

// ─── SFX (shared library, COPIED into render-assets/sfx/; every event stays under the VO) ───────
// Whoosh on the frame-0 cover cut and on every b-roll cut, a DING on each badge reveal, an impact on
// the two chart payoffs, and ONE riser that builds into the closing climax. NOTHING is placed on the
// hard-out: "it's very possible." ends clean and abrupt on purpose.
//
// ⚠ Cue points are each file's own measured CREST, not its file start. Envelopes re-measured on THIS
//   machine at 0.1 s RMS / 0.05 s hop for this build:
//     transition_rapid_whoosh crest 0.15 - Cinematic Whoosh 02 crest 0.80 - DING crest 0.15 -
//     TING crest 0.80 - Boom - Big Reveal crest 0.05 (peak -5.4 dB) - Kick_Impact_01 crest 0.15
//     (-6.0 dB) - Tension_Rise_Logo_Reveal_3 attacks 0.90, crests 2.55.
//   Each cue is therefore started EARLY by exactly that offset so the crest lands on the frame it
//   punctuates, and the riser's `dur` ends it exactly on the impact instead of smearing past it.
//
// ⚠ THE 64.42-67.84 s HOLE WAS A DROPPED LINE, NOT SILENCE - and that is why the captions are built
//   from `whisper-words-verified.json`, not the shipped word pass. The shipped stream jumps from
//   "hold on." to "look at that." with 3.42 s of nothing, and isolated 1x medium.en passes of THIS
//   clip's audio (65.0-67.3 and 64.6-67.6, agreeing to within 0.04 s, plus the whole-file pass of the
//   render) all return a second "LOOK AT THAT" at 65.62-66.62. The clip folder's `_patch_words.py`
//   restores it (and an "ooh." at 43.14, the other >1 s hole). The 65.29 riser below therefore DOES
//   sit over speech; an encode-matched A/B (bare spine vs this render, staggered windows) returns
//   "look at that! look at that!" IDENTICALLY on both, so at vol 0.12 it masks nothing.
//
// ⛔ THE 117.55 RISER WAS RETIMED 2026-08-08 — IT MASKED A WORD, AND VOLUME WAS THE WRONG KNOB.
//   At its original t=116.75 / dur 2.55 it read as a build defect (SKILL item 7): "just imagine how
//   far, how far MIGHT go" lost "might" in 3 of 4 tight staggered windows off the render while the
//   encode-matched control kept it, 0 windows better, and the in-span SFX energy was only 8.8 dB
//   under the VO. CAUSE, from the file's own 0.1 s RMS envelope: this riser is not a smooth ramp, it
//   jumps to a -12 dB PLATEAU at 1.90 s and holds it. At t=116.75 that plateau landed on
//   118.65-119.30, i.e. exactly on "might go" (118.56-119.10).
//   OFFLINE SWEEP (candidates mixed onto the bare control and scored, zero renders):
//     CONTROL, no riser ................................. "might" in 2/4 windows  (the target)
//     t116.75 dur2.55 vol0.10 (as shipped) .............. 0/4   MASKING
//     t116.75 dur2.55 vol0.05 (HALVE THE GAIN) .......... 0/4   still masking -> gain is NOT the knob
//     t117.55 dur1.75 vol0.10 (RETIME, keep full gain) .. 2/4   == control, window for window
//   So the cue starts 0.80 s later and stops 0.80 s earlier in the FILE: only the quiet pre-plateau
//   ramp (-42 -> -17 dB) plays, over 117.55-119.30. It still ENDS exactly on the 119.30 climax cut,
//   it still builds (25 dB of rise in 1.75 s), it KEEPS its full 0.10 gain, and the abrupt file cut
//   at 119.30 is inaudible under the Boom that starts 0.05 s earlier. In-span SFX energy drops from
//   -17.8 dB to -25.8 dB under the VO. DO NOT restore the old timing.
export const SFX_EC_AKA: Sfx[] = [
  { t:   0.00, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.26, dur: 1.00 }, // frame-0 thumbnail cut (crest 0.15)
  { t:   0.10, src: staticFile('sfx/Cinematic Whoosh 02.wav'),               vol: 0.20, dur: 2.00 }, // sweeps INTO the HOOK full-screen (crest 0.90 = the 0.90 cut)
  { t:   4.65, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.24, dur: 1.00 }, // cut back to the base chart (4.80)
  { t:  21.35, src: staticFile('sfx/DING.mp3'),                              vol: 0.22, dur: 1.60 }, // BADGE 1 "$120K" reveal (crest 21.50)
  { t:  65.29, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_3.wav'), vol: 0.12, dur: 2.55 }, // riser across the chart-zoom beat, ENDS exactly on the payoff cut (67.84); A/B-verified clean over the restored 65.62 "look at that"
  { t:  67.79, src: staticFile('sfx/Impacts/Kick_Impact_01.wav'),            vol: 0.24, dur: 1.60 }, // IMPACT on the payoff (crest 67.94, just after "look" at 67.84)
  { t:  74.84, src: staticFile('sfx/TING SOUND EFFECT.mp3'),                 vol: 0.22, dur: 2.00 }, // receipt ding on "3 BILLION" (crest 75.64)
  { t:  80.95, src: staticFile('sfx/DING.mp3'),                              vol: 0.22, dur: 1.60 }, // BADGE 2 "$3B" reveal (crest 81.10)
  { t: 103.15, src: staticFile('sfx/DING.mp3'),                              vol: 0.20, dur: 1.60 }, // BADGE 3 "RIGHT NOW IS EARLY" reveal (crest 103.30)
  { t: 113.15, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.26, dur: 1.00 }, // cut into the Robinhood app (113.30)
  { t: 117.55, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_3.wav'), vol: 0.10, dur: 1.75 }, // riser BUILDS INTO the climax and ENDS exactly on it (119.30) - RETIMED, see the masking note below
  { t: 119.25, src: staticFile('sfx/Boom - Big Reveal.wav'),                 vol: 0.28, dur: 2.40 }, // IMPACT on the CLIMAX full-screen cut (crest 119.30)
  { t: 120.95, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.26, dur: 1.00 }, // the B3 -> B4 HARD CUT (121.10)
  { t: 123.70, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.26, dur: 1.00 }, // the B4 -> B5 HARD CUT (123.85)
];

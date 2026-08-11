import { staticFile } from 'remotion';
import type { Sfx } from './_kit';
import type { BadgeEv, OverlayEv, ThumbDef } from './LivestreamShort';

// ─── binance-kaspa-catch22 (batch: tutorial, clip #3, variant: FULL) ─────────────────────────────
// "Binance Wants Community Driven Coins. Kaspa Isn't Listed." (Mike's 4b title)
// A pure SCATTER-GATHER cut, assembly order [0,2,3,1] from two ranges 23 minutes apart:
//   seg0  master  637.60- 645.13  the conviction hook, answering a live-chat "scam or gem?" question:
//                                 "when it comes to the tech, Kaspa's a gem..."
//   seg2  master 2027.30-2033.80  the premise: "there was a blog article on the Binance website..."
//   seg3  master 2059.02-2074.70  the contradiction + the punchline: "...so it's kind of a strange
//                                 catch-22." (one authored filler-tic removal at 2061.90-2062.27)
//   seg1  master  659.65- 664.99  the hype hard-out: "when the bulls start to run..."
// EDITORIAL GUARD (clip-plan + tighten-plan): this criticises an EXCHANGE'S INCONSISTENCY. It never
// disparages Kaspa, and Neiro is the example that PROVES the point, never a target. Every graphic
// below is worded to that guard.
//
// ⛔ SIBLING CLIP: #7 `binance-kaspa-catch22-impact` is a strict SUBSET of this clip's audio, built
// separately, and shares this batch's public dir. Not one asset is shared: everything this clip owns
// is `broll-tut-bkc-*` / `thumb-tutbkc`. Never edit clip #7's comp, constants or captions from here.
//
// Base clip: binance-kaspa-catch22-final.mp4 (4b cut -> Phase 5 tighten -> 5B desilence at
// min-sil 0.95 -> 5C). ALREADY composited vertical (screen-share on top, webcam below),
// 1080x1920 @ 25 fps, 31.96 s. FINAL: do NOT re-cut and do NOT re-split the zones. The comp runs at
// 30 fps; OffthreadVideo resamples the 25 fps source by TIME, so every cue below is plain seconds
// taken from the clip's own Whisper word timings (clip-relative).
//
// ⚠ The file referenced here is the render-assets COPY, re-encoded to a SEEK-FRIENDLY GOP by
//   `python video-creation/livestream-repurpose/scripts/setup_render_assets.py tutorial`.
//   Mandatory since the 2026-08-05 finding that concurrent OffthreadVideo seeks die on a long-GOP
//   source. The canonical spine in the clip folder is never touched.
//
// Render (public-dir = the BATCH render-assets/, shared with clips 1/2/4/5/6/7/8):
//   npx remotion render src/index.ts TutBinanceKaspaCatch22 \
//     out/tutorial/3-binance-kaspa-catch22.mp4 \
//     --public-dir "<repo>/video-creation/shorts/tutorial/render-assets"

export const TUT_BKC_FPS = 30;
export const TUT_BKC_DURATION = 958; // 31.933 s @30; last frame index 957 = t 31.900 s, inside the 31.96 s clip

export const CLIP_TUT_BKC  = staticFile('binance-kaspa-catch22.mp4');
export const THUMB_TUT_BKC = staticFile('thumb-tutbkc.png');

// Layout geometry, MEASURED on THIS clip (row-mean gradient scan at t = 0.5/4/8/12/16/20/24/28/31 s;
// all NINE frames put the hard screen-share/webcam divider on row 853, delta 181-202).
export const TUT_BKC_SEAM  = 853; // content zone = 0..853; webcam below
export const TUT_BKC_CAP_Y = 905; // caption centre: 52 px under the seam, on his hair. His eyes sit
                                  // at rows ~1150-1290 on every sampled frame, so they are never covered.

// ─── ⛔ MIKE'S PHASE 7 VISUAL DIRECTIVE, WHOLE BATCH (2026-08-09, verbatim) ──────────────────────
// "i only do not want full screen broll, nor content zone broll. you can do captions, sfx, and any
//  overlaying graphics or images with background transparency."
// ALLOWED: captions, SFX, code-drawn graphics, image overlays WITH REAL BACKGROUND TRANSPARENCY.
// BANNED: full-screen b-roll and content-zone b-roll, i.e. ANY asset that covers the frame or fills
// the content zone. The test is COVERAGE, not the asset's source.
//
// Consequence, stated plainly instead of hidden: there is NO `BrollEv` array on this clip. B-roll
// coverage is 0 %, base-showing 100 %. That is DELIBERATELY outside the SKILL's ~25-35 % band and
// outside its "full-screen at the hook, 1-3x" item, on Mike's own batch-level instruction, and it is
// reported as a DEVIATION in the build report. Do not restore b-roll coverage from this file.
// Everything visual is a TRUE-ALPHA PNG overlay (34-55 % of each PNG is fully transparent; see
// binance-kaspa-catch22/_make_alpha_overlays.py) or a code-drawn badge; each occupies 12-25 % of the
// content zone and none of them fills it.
//
// What the base shows, measured at 4 fps on the staged spine (mean |delta| of the content-zone crop):
// exactly TWO picture cuts, at t = 7.64 s (CoinMarketCap $TUT page -> DEXScreener IF/WETH chart) and
// t = 26.64 s (back to the CMC page). The CMC frames carry a burned-in live-chat banner at rows
// ~725-780 ("Kaspa is the biggest enigma... scam or a gem"), i.e. literally the question he answers,
// so every overlay is placed ABOVE row 560 and never covers it.
// staticFile() calls are LITERAL strings on purpose - the finalized-short gate scans for literal refs.

// ─── Transparent overlays (real RGBA PNGs, alpha = boosted luminance) ───────────────────────────
// `blend: 'normal'` on every one: the CMC page is near-WHITE in places and a screen blend cannot
// darken white, so a screen-blended overlay would vanish there.
// REFERENCE-IMAGE GATE (run LIVE 2026-08-09 against schedule-tweets/images/reference/):
//   Kaspa  -> kaspa-logo.png EXISTS, so the Kaspa beat carries the REAL mark: that reference already
//             ships as a glowing teal coin on pure black, so it is converted to true alpha rather
//             than generated, and the branding is pixel-exact.
//   Binance -> no reference on disk -> NO logo is invented anywhere (text-only badges).
//   Neiro   -> no reference on disk -> text-only badge.
// PERSONA INSPECTION (all four PNGs viewed before rendering): no real crypto logo, no real-person
// face, no text baked into any generated image. The gem is a round-brilliant JEWEL (the spoken line
// is "Kaspa's a gem"), deliberately not an octahedral ETH-style diamond.
// ⛔ THE TWO PROTECTED PERFORMANCE PAUSES (Mike desilenced this batch at min-sil 0.95 expressly to
// KEEP them; they are the performance, not dead air, and NOTHING - no SFX and no graphic - may paper
// over them). Re-measured on THIS staged spine at 5 ms hop / 10 ms window, -50 dB:
//     4.755-5.705 s (0.950 s) the beat before the THIRD limb of the gem triple
//    21.430-22.085 s (0.655 s) the suspense pause in "because if they did, [beat] Kaspa would be
//                              listed" (the /k/ burst of "kaspa" re-onsets at 22.085)
// Both overlay tOuts below are pulled BACK behind those boundaries (gem 4.80 -> 4.74, kaspa
// 21.50 -> 21.42) so each 0.18 s fade-out COMPLETES before the silence starts and both pauses run
// 100 % graphic-free. The SFX table at the bottom of this file is likewise measured DRY (-240 dB
// added energy) across both spans.
export const OVERLAYS_TUT_BKC: OverlayEv[] = [
  // "kaspa's a gem. kaspa's the most beautiful thing ever." (1.90-4.755) - right of the CMC chart.
  { src: staticFile('broll-tut-bkc-ov-gem.png'),   tIn:  2.00, tOut:  4.74, top: 130, left: 630, width: 390, blend: 'normal' },
  // "they don't apply the same logic to KASPA" (18.00-21.43) - the real Kaspa mark, left of frame.
  { src: staticFile('broll-tut-bkc-ov-kaspa.png'), tIn: 19.60, tOut: 21.42, top: 130, left:  70, width: 440, blend: 'normal' },
  // "so it's kind of a strange catch-22" (24.42-26.48) - a padlock on a gate bar: the listing gate,
  // shut. No exchange is depicted or named in the art.
  { src: staticFile('broll-tut-bkc-ov-lock.png'),  tIn: 24.55, tOut: 26.70, top: 180, left: 540, width: 460, blend: 'normal' },
  // "when the bulls start to run... kaspa to be skyrocketing." (28.40-31.74) - the hype hard-out.
  // tOut is deliberately PAST the comp end (last frame = t 31.900 s) so the 0.18 s fade-out never
  // starts: the clip HARD-OUTS at full opacity, no fade, no CTA.
  { src: staticFile('broll-tut-bkc-ov-bull.png'),  tIn: 29.30, tOut: 32.10, top: 200, left: 280, width: 520, blend: 'normal' },
];

// ─── Code-drawn badges (no image asset, no invented logo) ───────────────────────────────────────
// ⚠ GEOMETRY: the shared `Badge` is left:50% + translate(-50%,-50%) with no explicit width, so its
// shrink-to-fit box is capped at 540 px (1080 - left) => ~436 px of text after the 52 px side
// padding. Every line below is inside that: line1 <= 9 chars @60 px, line2 <= 6 chars @82 px,
// sub <= 16 chars @32 px. `top` is the box CENTRE.
// Each badge states only what the clip itself says: Binance's blog wants community-driven coins,
// Neiro is a listed community-driven meme coin, and Kaspa is still not listed. Nothing is imported
// from outside the clip and nothing disparages Neiro or Kaspa.
export const BADGES_TUT_BKC: BadgeEv[] = [
  { tIn:  8.60, tOut: 11.40, color: '#ffe600', line1: 'BINANCE',   line2: 'SAYS',   sub: 'COMMUNITY DRIVEN', top: 430 },
  { tIn: 15.00, tOut: 17.80, color: '#ffe600', line1: 'NEIRO',     line2: 'LISTED', sub: 'A MEME COIN',      top: 430 },
  { tIn: 22.30, tOut: 24.20, color: '#ff5252', line1: 'STILL NOT', line2: 'LISTED', sub: 'ON BINANCE',       top: 670 },
];

// COLLISION MATRIX (Phase 7 rule #3), every timed graphic in order:
//   thumb 0.000-0.033 | gem 2.00-4.74 | badge1 8.60-11.40 | badge2 15.00-17.80 | kaspa 19.60-21.42 |
//   badge3 22.30-24.20 | lock 24.55-26.70 | bull 29.30-32.10
// NO two windows overlap; the smallest gap is 0.35 s (badge3 -> lock) and they also sit in different
// vertical bands (badge3 rows ~541-799, lock rows 180-509). Nothing starts before the thumb frame
// ends, and LivestreamShort suppresses badges/overlays while the thumb is up anyway. No watermark or
// logo-reveal plate is used, so the thumb frame carries no other graphic at all.
// Both PROTECTED pauses (4.755-5.705 and 21.430-22.085) fall in graphic-free gaps of this matrix.

// ─── Frame-0 thumbnail (IG/TikTok cover) ────────────────────────────────────────────────────────
// ONE frame only (LivestreamShort defaults thumb.durS to 1/fps) - generated background art with the
// hook title drawn in CODE on top, never baked into the image. No em dashes.
// The art is a sealed vault gate with a glowing teal gem outside it: the clip's own argument, and it
// depicts no exchange mark and no coin logo. Title is an open loop off Mike's 4b title; the chip is
// his own punchline.
export const THUMB_DEF_TUT_BKC: ThumbDef = {
  img: THUMB_TUT_BKC,
  title: 'BINANCE WANTS\nCOMMUNITY COINS\nSO WHERE IS\nKASPA?',
  chip: 'A STRANGE CATCH-22',
  chipColor: '#00e5ff',
  // 86 px, MEASURED not guessed: a chunk render at 96 px put uppercase Montserrat Black at ~68 px
  // per character, so the longest line ("COMMUNITY COINS", 15 chars) wrapped and stranded "COINS."
  // on its own line. At 86 px that is ~61 px per char = ~915 px, inside the 968 px text box, so the
  // cover reads as the intended four lines.
  titleSize: 86,
};

// ─── SFX (shared library, COPIED into render-assets/sfx/ by setup_render_assets.py --data) ──────
// 6 events, 4 distinct files. Whoosh on the frame-0 cover cut and on BOTH measured picture cuts, a
// DING on the gem overlay, and a riser that is CUT ON an impact at the payoff.
//
// ⚠ Cue points are each file's own measured CREST, not its file start. Envelopes re-measured on THIS
//   machine at 0.1 s RMS / 0.01 s hop (16 kHz mono) for this build:
//     transition_rapid_whoosh crest 0.15 (dur 0.97) - DING crest 0.17 (dur 2.11) -
//     Soundjay_Impact_Main_01-short crest 0.27 (dur 0.68, body 0.12-0.52) -
//     Tension_Rise_Logo_Reveal_3 crest 2.55 (dur 5.76).
//   Each cue starts EARLY by exactly that offset so the crest lands on the frame it punctuates.
//
// ⚠ PICTURE CUTS VERIFIED, not assumed: an 8 fps mean|delta| scan of the content-zone crop finds
//   exactly TWO cuts, at 7.625 s and 26.625 s (111.9 each; the next-largest delta in the clip is
//   1.46, i.e. 76x smaller). Both whoosh crests (7.64 / 26.64) sit inside the MEASURED silences
//   7.370-7.715 and 26.550-26.870, so neither transient ever touches a word. The seg2 -> seg3 audio
//   join at 13.08 deliberately gets NO whoosh: both segments are the same DEXScreener screen-share,
//   so there is no picture cut there, and 13.08 is mid-speech (voiced 12.850-14.140).
//
// ⛔ THE RISER + IMPACT WERE RELOCATED (2026-08-10) - do not move them back. The previous table put
//   the riser's peak AND the impact's crest inside the 21.430-22.085 s suspense pause. That is one of
//   the two PROTECTED performance pauses Mike preserved by desilencing at min-sil 0.95, so filling it
//   was wrong on its own terms - and it also MASKED the payoff line. Offline whisper A/B against an
//   encode-matched control (bare spine through the same 48 kHz/AAC chain), short staggered windows:
//     old table, window 20.60+2.6 s: control "Casper would be listed."   -> mix "Asper would be list of"
//     old table, window 21.40+2.6 s: control "Casper would be listed on Binance." -> mix "ASPR would
//                                    be listed on buying ASPR."
//   The impact also measured +1.7 dB OVER the voice in its window (every other cue sits 8-18 dB
//   under). Three candidate placements were scored offline (zero renders):
//     A riser 18.88 peaking at the pause onset  -> REGRESSED "kaspa" at 19.68 ("the cast book")
//     B riser 22.15 starting after the pause, CUT on the impact crest -> matched control on all 6 windows
//     C no riser at all -> also matched, but loses the riser -> impact build the contract asks for
//   B SHIPS. Volume was never touched: the impact keeps its full 0.26 gain (the contract's rule that
//   TIMING, not volume, is the knob). Both protected pauses now measure -240 dB added energy, i.e.
//   exactly zero, and windows 21.90+2.5 / 22.40+2.2 / 24.30+2.3 all read control-identical
//   ("Casper would be listed on Binance by now." / "So it's kind of strange catch-22").
//
// ⚠ THE TING WAS DELETED, not retimed. It rang 23.76-25.21 for the padlock reveal, which is exactly
//   the slot the relocated payoff impact now occupies; two transients 0.3 s apart on adjacent
//   low-content words is mud, and per the contract a cue that is DECORATION rather than a payoff hit
//   gets deleted rather than saved. The padlock (tIn 24.55) now rides in on the impact's decay.
//
// ⚠ THE PUNCHLINE IS STILL DELIBERATELY DRY. Nothing is placed on "strange catch-22." (25.54-26.48).
export const SFX_TUT_BKC: Sfx[] = [
  { t:  0.00, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.22, dur: 0.97 }, // frame-0 cover cut (crest 0.15)
  { t:  1.83, src: staticFile('sfx/DING.mp3'),                              vol: 0.20, dur: 1.00 }, // GEM overlay pop (crest 2.00), tail ends before "kaspa's the most" (2.84)
  { t:  7.49, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.22, dur: 0.97 }, // MEASURED picture cut #1, CMC -> DEXScreener (crest 7.64) inside the 7.370-7.715 silence
  { t: 22.15, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_3.wav'), vol: 0.09, dur: 2.25 }, // riser STARTS after the protected pause (22.085) and swells under "kaspa would be listed on binance by now"
  { t: 24.13, src: staticFile('sfx/Impacts/Soundjay_Impact_Main_01-short.wav'), vol: 0.26, dur: 0.68 }, // PAYOFF IMPACT, crest 24.40 dead centre of the measured 0.345 s silence 24.130-24.475; cuts the riser; its natural decay ends 24.810 = the start of the NEXT measured silence, so no truncation click
  { t: 26.49, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.20, dur: 0.97 }, // MEASURED picture cut #2, DEXScreener -> CMC (crest 26.64) = the seg3 -> seg1 join, inside the 26.550-26.870 silence
];

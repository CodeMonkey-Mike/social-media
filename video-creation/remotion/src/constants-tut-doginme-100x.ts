import { staticFile } from 'remotion';
import type { Sfx } from './_kit';
import type { BadgeEv, OverlayEv, ThumbDef } from './LivestreamShort';

// ─── doginme-100x-if-500x (batch: tutorial, clip #5, variant: FULL) ─────────────────────────────
// "doginme at 107 Million: 400 Million Is a 100X From Here" (Mike's frozen 4b title)
// The stream's CLOSING CRESCENDO, assembled chronologically from four master ranges:
//   seg0  master 4396.59-4409.80  the personality cold open + the credential: "I got some dog. I got
//                                 that dog in me. Right. I got that dog with me. It was like the first
//                                 dog on the Base chain to be listed on Coinbase."
//   seg1  master 4495.89-4519.01  the math + the rhetorical self-Q&A + PEAK 1: "all-time high of
//                                 doginme is 107 million ... isn't it reasonable to get to 400 million
//                                 ... that means it's 100X from here. That's nuts. 100X from here."
//   seg2  master 4529.80-4541.45  the 4b-KEPT escalation: "what if doginme can survive to the next
//                                 bull run and make it an 800 million market cap and we get a 200X?"
//   seg3  master 4571.81-4574.95  the doubled hard-out: "Craziness, craziness, man. Good times ahead.
//                                 Good times ahead."
//
// ⛔⛔ THE SLUG LIES, AND THE GUARD BINDS EVERY ELEMENT IN THIS FILE. `doginme-100x-if-500x` promises a
// 500X on the What If token; Mike's 4b review DELETED that whole tail (master 4541.98-4570.70, 28.7 s)
// because the clip is about doginme and the tail switched subject. Slugs freeze at 4b, so the filename
// keeps the stale promise. Consequence: NOTHING this comp draws may reference $IF / "What If" / a 500X.
// No badge says 500X, no overlay is the $IF galaxy art (`schedule-tweets/images/reference/what-if.jpg`
// is BANNED on this clip and is never referenced), and the frame-0 cover teases exactly ONE token.
// The only numbers on screen are the ones out of his own mouth: 107M ATH, 400M, 100X, 800M, 200X.
// SUBTLETY, handled: the clip legitimately contains the English words "what if" ("what if doginme can
// survive..."). That is his own sentence about doginme; the captions render it as two ordinary
// lowercase words and it is never styled, capitalised or graphically treated as the token name.
//
// ⚠ BASE-PICTURE DEFECT, MEASURED AND REPORTED TO MIKE, NOT PAPERED OVER (2026-08-10). The staged
// spine's own screen-share carries $IF material in its final third, because that is what was on his
// monitor at that point in the stream:
//   27.680-39.600 (11.92 s = 30.1 % of runtime) a burned-in live-chat banner reading
//                 "@MichealBlanson  $if $if $if $if $if", measured bounds x 6-298, rows 672-789. It
//                 switches over EXACTLY on the seg1 -> seg2 picture cut at 27.680.
//   36.480-39.600 (the hard-out) a DEXScreener "IF / WETH (Market Cap) on Uniswap" chart plus the
//                 "WHAT IF" galaxy wordmark at x 864-1080, rows 56-124.
// This is the BASE VIDEO, which is staged + GOP-verified and must not be re-cut or re-encoded by a
// builder, and Mike's Phase 7 directive bans covering the content zone. So it is NOT masked here: the
// only real fixes are upstream (a different seg2/seg3 in-point, or a picture substitution), both
// outside Phase 7.
// ⚠ CORRECTION 2026-08-10: an earlier draft of this header claimed the hard-out sticker was "positioned
// top-right so it sits over the WHAT IF wordmark". MEASURED on the rendered sticker, that mitigation
// DOES NOT EXIST: the sticker's alpha over the wordmark band (x 864-1080, rows 56-124) is mean 0.2/255,
// max 10, 0.0 % of pixels at alpha >= 128, i.e. ZERO coverage - its opaque mass sits at rows 106-378,
// x 709-991. The "WHAT IF" wordmark stays fully legible on the last 96 frames. It is NOT covered, and no
// blocker plate was added because an opaque bar over the content zone is exactly the class Mike's
// directive bans. This is REPORTED to Mike as an upstream (4b/5) in-point defect, not fixed here.
//
// Base clip: doginme-100x-if-500x-final.mp4 (4b cut -> Phase 5 tighten at 5.05 % -> 5B desilence at
// min-sil 0.95 -> 5C). ALREADY composited vertical (screen-share on top, webcam below), 1080x1920
// @ 25 fps, 39.60 s picture / 39.613 s audio. FINAL: do NOT re-cut and do NOT re-split the zones. The
// comp runs at 30 fps; OffthreadVideo resamples the 25 fps source by TIME, so every cue below is plain
// seconds taken from this clip's OWN measured audio (clip-relative), never a raw word timestamp.
//
// ⚠ The file referenced here is the render-assets COPY, re-encoded to a SEEK-FRIENDLY GOP by
//   `python video-creation/livestream-repurpose/scripts/setup_render_assets.py tutorial`.
//   The canonical spine in the clip folder is never touched.
//
// Render (public-dir = the BATCH render-assets/, shared with clips 1/2/3/4/6/7/8):
//   npx remotion render src/index.ts TutDoginme100x \
//     out/tutorial/5-doginme-100x-if-500x.mp4 \
//     --public-dir "<repo>/video-creation/shorts/tutorial/render-assets"

export const TUT_DGN_FPS = 30;
// 1188 frames = 39.600 s. Last frame index 1187 = t 39.5667 s, which lands INSIDE the final 25 fps
// source frame (pts 39.560, displayed 39.560-39.600), so the doubled "Good times ahead" hard-out is
// never truncated. Measured: 982 video packets, last pts 39.560; audio 39.613 s.
export const TUT_DGN_DURATION = 1188;

export const CLIP_TUT_DGN  = staticFile('doginme-100x-if-500x.mp4');
export const THUMB_TUT_DGN = staticFile('thumb-tutdgn.png');

// Layout geometry, MEASURED on THIS clip (row-mean gradient scan at t = 0.5/4/8/12/16/20/24/28/32/36/
// 39.4 s; ALL ELEVEN frames put the hard screen-share/webcam divider on row 854, delta 114-188, with
// the next-largest row delta 2-4x smaller).
export const TUT_DGN_SEAM  = 854; // content zone = 0..854; webcam below
export const TUT_DGN_CAP_Y = 905; // caption centre: 51 px under the seam. A 2-line caption spans rows
                                  // ~827-983; his eyes sit at rows ~1180-1290 on every sampled frame,
                                  // so they are never covered, and the band clears the burned-in
                                  // live-chat banner at rows 672-789.

// ─── ⛔ MIKE'S PHASE 7 VISUAL DIRECTIVE, WHOLE BATCH (2026-08-09, verbatim) ──────────────────────
// "i only do not want full screen broll, nor content zone broll. you can do captions, sfx, and any
//  overlaying graphics or images with background transparency."
// ALLOWED: captions, SFX, code-drawn graphics, image overlays WITH REAL BACKGROUND TRANSPARENCY.
// BANNED: full-screen b-roll and content-zone b-roll, i.e. ANY asset that covers the frame or fills
// the content zone. The test is COVERAGE, not the asset's source.
//
// Consequence, stated plainly instead of hidden: there is NO `BrollEv` array on this clip. B-roll
// coverage is 0 %, base-showing 100 %. That is DELIBERATELY outside the finalized-short checklist's
// ~25-35 % band and outside its "full-screen at the hook, 1-3x" item, on Mike's own batch-level
// instruction, and it is reported as an explicit DEVIATION in the build report (as clips 1, 3 and 6
// did before it). Do not restore b-roll coverage from this file.
// Everything visual is either a TRUE-ALPHA PNG sticker (36.9 % / 44.9 % of each PNG is FULLY
// transparent; see doginme-100x-if-500x/_make_alpha_overlays.py) or a code-drawn badge.
// ⚠ RE-MEASURED AT THE RENDERED SCALE 2026-08-10 (the first pass sized the hard-out sticker off the
// 432 px SOURCE png instead of its 460 px rendered box and under-reported it): painted-pixel (alpha>0)
// occlusion is 113.3k px^2 (12.29 % of the 1080x854 content zone, 5.47 % of the frame) for the hook
// sticker and 119.9k px^2 (13.00 % / 5.78 %) for the hard-out sticker; alpha-WEIGHTED, 89.2k
// (9.67 % / 4.30 %) and 68.1k (7.38 % / 3.28 %). Each badge box is ~440x248 px = 11.8 % of the zone.
// Nothing fills the zone and nothing is full-screen.
// Frame-exact graphic-on-screen time (7 timed events incl. the 1 thumb frame): 356 of 1188 frames =
// 11.867 s = 29.97 % of runtime; 70.03 % of the clip carries NO graphic at all.
//
// What the base shows, MEASURED at 8 fps and refined at 25 fps (mean |delta| of the content-zone
// crop): exactly THREE picture cuts, all of them segment joins and all inside a measured silence.
// ⚠ RE-MEASURED FRAME-BY-FRAME 2026-08-10 on the staged spine: each cut is ONE 25 fps frame earlier
// than first documented (cut 3 is two), so the values below are the corrected ones. NO decision in
// this file changes: badge4's tOut 36.30 still ends 100 ms BEFORE cut 3, both whoosh crests still land
// inside their silences (43 ms after their cut instead of on it, which is imperceptible and not worth
// a re-render), and cut 3 still gets no whoosh.
//    11.440  seg0 -> seg1  (delta 24.49, next-largest in the window 0.06 = 408x smaller) in sil 11.315-11.725
//    27.640  seg1 -> seg2  (delta  6.74, next-largest 0.61 = 11x smaller)                in sil 27.440-28.325
//    36.400  seg2 -> seg3  (delta 112.43, next-largest 0.35 = 321x smaller)              in sil 36.280-36.490
// The content zone is Mike's own CoinMarketCap/DEXScreener screen-share and it is genuinely valuable
// here: at 12.5 s his hover tooltip reads "03/19/2025 Market Cap: $107.209M", i.e. the 107M ATH
// RECEIPT for the exact line he is speaking, and from 11.5 s the "doginme Markets" table lists
// "Coinbase Exchange" as row 1, the receipt for the credential. Both are left COMPLETELY uncovered:
// 11.480-16.200 carries no graphic at all, by design.
// staticFile() calls are LITERAL strings on purpose - the finalized-short gate scans for literal refs.

// ─── Transparent overlays (real RGBA PNGs, alpha from a border flood fill of the REAL reference) ──
// `blend: 'normal'` on both: the CoinMarketCap page behind them is near-WHITE in places and a screen
// blend cannot darken white, so a screen-blended sticker would vanish there.
// REFERENCE-IMAGE GATE (run LIVE 2026-08-10 against schedule-tweets/images/reference/):
//   doginme  -> DogInMe.png EXISTS, so both stickers are the REAL mark, pixel-exact: a BLUE muscular
//               pit bull with a thick black outline, pointing at the viewer. Nothing was generated and
//               nothing was paraphrased from the name (the sibling precedent where a black lab came
//               back as a golden retriever is exactly why an image model never touched this mascot),
//               and "no invented logo" never meant shipping a blank-faced object.
//   Coinbase -> no reference on disk -> NO logo invented; the credential is a TEXT-ONLY badge.
//   Base     -> no reference on disk -> no chain logo anywhere; the chain is carried by COLOUR only
//               (Base blue #3aa0ff). Never Robinhood neon-green (clip 2's palette), never Kaspa teal.
//   what-if  -> what-if.jpg EXISTS and is BANNED here (see the guard above). Never referenced.
// PERSONA INSPECTION (both PNGs viewed on light AND dark before rendering): the only mark present is
// doginme's own; no other real crypto logo, no real-person face, no baked text.
// ⛔ THE FIVE PROTECTED PAUSES. Mike desilenced this batch at min-sil 0.95 expressly to KEEP his
// rhetorical beats, and this batch is captions-only on the picture side, so CADENCE is the only
// performance element left on screen. Re-measured on THIS staged spine at 5 ms hop / 10 ms window
// (silence < -57 dB, audio > -52 dB):
//     3.030-3.790 (0.760)  inside the protected hook doubling, before "right."
//     4.050-4.785 (0.735)  inside the protected hook doubling, before the second limb
//     6.140-6.850 (0.710)  the beat that closes the protected hook
//    19.630-19.935 (0.305) inside the protected self-Q&A, before "i don't know."
//    24.620-25.255 (0.635) inside protected PEAK 1, before "that's nuts."
// ALL FIVE run 100 % graphic-free AND 100 % SFX-free: the hook sticker's tOut is pulled back to 3.02
// so its 0.18 s fade-out COMPLETES before the first pause starts, and the SFX table at the bottom
// measures -200.00 dB (i.e. exactly zero) added energy across every one of the five.
export const OVERLAYS_TUT_DGN: OverlayEv[] = [
  // THE HOOK, on the first limb of the protected doubling "I got that dog in me." (1.76-3.02).
  // Full-figure doginme, pointing at the viewer. 400 px wide -> box x 616-1016, rows 118-567 (the
  // component adds a +/-10 px float), so it clears the live-chat banner at rows 672-789 entirely.
  { src: staticFile('broll-tut-dgn-ov-dog-point.png'), tIn:  1.82, tOut:  3.02, top: 118, left: 616, width: 400, blend: 'normal' },
  // THE DOUBLED HARD-OUT, "Craziness, craziness, man. Good times ahead. Good times ahead."
  // A DISTINCT treatment of the same real mark (tight head crop, tilted -8 deg, yellow halo instead of
  // blue) so no image is reused across two beats. Top-right placement is a COMPOSITION choice only; it
  // does NOT cover the base picture's "WHAT IF" wordmark (x 864-1080, rows 56-124) - measured alpha
  // there is 0, see the correction in the header. Rendered box x 620-1080, rows 30-503; opaque mass
  // rows 106-378, x 709-991.
  // tOut 39.75 is deliberately PAST the comp end (last frame = t 39.5667 s) so the 0.18 s fade-out
  // never starts: the clip HARD-OUTS at full opacity. No fade, no CTA, no closing card - the abrupt
  // ending is the documented watch-time strategy, not an omission. VERIFIED on the final render: over
  // the last 15 frames the sticker's strong-blue pixel count is flat at 29,840-30,076 and the yellow
  // halo at 23,087-23,519, with the FINAL frame at 30,049 / 23,498 - zero fade. (Note the margin is
  // thin by design: fadeInOut's flat region ends at tOut - 0.18 = 39.57 and the last frame is t
  // 39.5667, so it clears by 0.1 frame. Do not lower tOut.)
  { src: staticFile('broll-tut-dgn-ov-dog-head.png'),  tIn: 36.70, tOut: 39.75, top:  30, left: 620, width: 460, blend: 'normal' },
];

// ─── Code-drawn badges (no image asset, no invented logo) ───────────────────────────────────────
// ⚠ GEOMETRY: the shared `Badge` is left:50% + translate(-50%,-50%) with no explicit width, so its
// shrink-to-fit box is capped at 540 px (1080 - left) => ~436 px of text after the 52 px side padding.
// Every line below is inside that: line1 <= 9 chars @60 px, line2 <= 7 chars @82 px, sub <= 15 chars
// @32 px. `top` is the box CENTRE, so top 300 => rows ~176-424.
// All four sit at top 300 for a consistent read, and that band was CHOSEN by measurement: at 8.5 s it
// leaves the "doginme #241  MCap $4M" search row (rows ~130-180) visible, and at every later frame it
// leaves the chart's ATH spike (rows 60-176), the whole "doginme Markets" table (rows 500-700) and the
// live-chat banner (rows 672-789) visible.
// Every badge states only what the clip itself says. MATH CHECKED, because a wrong figure on screen is
// worse than no figure: the 100X and the 200X are from the CURRENT cap his own screen shows (~$4.06M),
// not from the 107M ATH (400/4.06 = 98.5x, 800/4.06 = 197x), which is why no badge draws an arrow from
// 107M to 400M and calls it 100X.
export const BADGES_TUT_DGN: BadgeEv[] = [
  // "it was like the first dog on the Base chain to be listed on Coinbase" (6.72-11.31). Base blue.
  { tIn:  7.55, tOut: 11.20, color: '#3aa0ff', line1: 'FIRST DOG', line2: 'ON BASE', sub: 'COINBASE LISTED', top: 300 },
  // "isn't it reasonable to get to 400 million in a really big bull run? Isn't it reasonable?"
  { tIn: 16.20, tOut: 17.70, color: '#ffe600', line1: 'ATH $107M', line2: '$400M',  sub: 'REASONABLE?',     top: 300 },
  // PEAK 1: "that means it's 100X from here." (20.90-22.60)
  { tIn: 21.65, tOut: 23.05, color: '#ffe600', line1: 'THAT IS A', line2: '100X',   sub: 'FROM HERE',       top: 300 },
  // "make it an 800 million market cap and we get a 200X?" (33.02-36.03)
  { tIn: 35.10, tOut: 36.30, color: '#ffe600', line1: '800M CAP', line2: '200X',    sub: 'NEXT BULL RUN',   top: 300 },
];

// COLLISION MATRIX (Phase 7 rule: overlays must never collide in time AND space), every timed graphic:
//   thumb 0.000-0.033 | dog-point 1.82-3.02 | badge1 7.55-11.20 | badge2 16.20-17.70 |
//   badge3 21.65-23.05 | badge4 35.10-36.30 | dog-head 36.70-39.75
// NO two windows overlap in TIME at all; the smallest gap is 0.40 s (badge4 -> dog-head), and the two
// stickers also sit in a different horizontal band (x 616-1080) from the centred badges (x ~320-760).
// Nothing starts before the thumb frame ends, and LivestreamShort suppresses badges/overlays while the
// thumb is up anyway. No watermark or logo-reveal plate is used, so the thumb frame carries no other
// graphic at all. All FIVE protected pauses fall in graphic-free gaps of this matrix, and the whole
// 11.480-16.200 window (the 107M ATH tooltip + the Coinbase markets row) is graphic-free by design.

// ─── Frame-0 thumbnail (IG/TikTok cover) ────────────────────────────────────────────────────────
// ONE frame only (LivestreamShort defaults thumb.durS to 1/fps), so it is the platform COVER and never
// a held card over the opening captions. The background art is code-composited by
// doginme-100x-if-500x/_make_thumb.py (deep-navy Base-blue field + a rising momentum beam + the REAL
// DogInMe.png mark, subject in the lower half); the title and chip are drawn in CODE on top, never
// baked into the art. No em dashes. ONE token only - no $IF, no What If, no 500X.
export const THUMB_DEF_TUT_DGN: ThumbDef = {
  img: THUMB_TUT_DGN,
  title: 'DOGINME ATH\n$107 MILLION\n400M IS A\n100X FROM HERE',
  chip: 'FIRST DOG ON BASE',
  chipColor: '#3aa0ff',
  // 86 px: the `Thumb` text box is 1080 - 56 - 56 = 968 px, and uppercase Montserrat Black measures
  // ~61 px per character at 86 px (measured on the sibling clip-3 cover), so the longest line here
  // ("100X FROM HERE", 14 chars) is ~854 px and the cover reads as the intended FOUR lines. Four lines
  // at lineHeight 0.98 occupy rows 240-577 and the chip lands ~611-701, well clear of the mascot's
  // head (rows ~850-1150) and far above the 1680 px platform safe zone.
  titleSize: 86,
};

// ─── SFX (shared library, COPIED into render-assets/sfx/ by setup_render_assets.py --data) ──────
// 6 events, 4 distinct files. A whoosh on the frame-0 cover cut and on TWO of the three measured
// picture cuts, a DING on the Coinbase credential reveal, and a riser that is CUT ON an impact at the
// 200X payoff.
//
// ⚠ Cue points are each file's own measured CREST, not its file start. Envelopes re-measured on THIS
//   machine at 0.1 s RMS / 0.01 s hop (16 kHz mono) for this build:
//     transition_rapid_whoosh   crest 0.150 (dur 0.967, -20 dB tail ends 0.600)
//     DING-093                  crest 0.170 (dur 0.930, -20 dB tail ends 0.790)
//     Tension_Rise_Logo_Reveal_3-1s crest 0.670 (dur 1.000)
//     Impact_Hit_01-2-short     crest 0.090 (dur 0.550, -20 dB tail ends 0.440)
//   Each cue starts EARLY by exactly that offset so the crest lands on the frame it punctuates. Every
//   `dur` equals the FILE's own length, so nothing is truncated: a `dur` window does NOT fade a cue,
//   it TRUNCATES it, and the truncation click has twice been measured LOUDER than the speech it was
//   supposed to sit under. The faded/trimmed library variants (`-1s`, `-short`, `DING-093`) are reused
//   as-is at UNCHANGED gain; no new variant was created.
//   ✅ RE-VERIFIED 2026-08-10 against the real Sequence windows: 0.0 ms truncated on all six cues.
//   ⚠ GOTCHA for whoever verifies this next: the window is `Math.round(dur*fps)` frames and JS rounds
//   HALF UP, so the impact's 0.55*30 = 16.5 becomes 17 frames (0.5667 s > the 0.55 s file). Python's
//   round() is half-to-EVEN and returns 16 (0.5333 s), which invents a phantom 16.7 ms truncation and
//   a phantom -51.6 dBFS click. Model the window with floor(v+0.5), not round(v).
//
// ⛔ CUT 3 (measured 36.400) DELIBERATELY GETS NO WHOOSH. Its silence is only 36.280-36.490 and the
//   protected doubled hard-out re-onsets at 36.490 ("craziness", peak -17.3 dB at 36.700), so any
//   transient placed on that cut would land ON the ending. The hard-out ships DRY.
//
// ⚠ OFFLINE A/B, ZERO RENDERS (contract rule 7a). Both the bare spine and the spine+cues mix were
//   pushed through the render's own 48 kHz/192k AAC chain and scored with medium.en on 12 SHORT
//   STAGGERED windows. Artifact durations were ffprobe-checked at 39.5947 s against this clip's
//   39.613 s and the transcripts confirmed to be about doginme, because the shared scratchpad had
//   already produced one false PASS this session from another clip's audio.
//   Result: 6/12 windows byte-identical, and every one of the other 6 differs ONLY in punctuation or
//   in a window-boundary fragment, with no word lost:
//     [ 0.00+2.6] "I got that doge" vs "I got that doge."            punctuation only
//     [11.00+2.8] "of dogging me" vs "of dog and me"                 both garbles of the same non-word;
//                 the staggered partner [11.40+2.6] is byte-identical, and the whoosh tail under
//                 "all-time high" measures -48.6 dB against speech at -18.0 dB (30.6 dB under)
//     [34.60+2.6] the mix drops a leading "cap." - PROVEN decoder variance, not masking: the SFX bed
//                 measures -200.00 dB across 34.60-35.39, i.e. that span is BIT-IDENTICAL audio
//     [35.00+2.8] [35.60+2.6] [36.20+2.6] punctuation/case only, or a fragment the CONTROL adds
//   Tail-under-speech energies: ding under "on coinbase" -39.5 dB vs -22.3 dB; whoosh into "what if"
//   -58.3 dB vs -17.5 dB. Volume was never used as the knob and nothing needed retiming.
export const SFX_TUT_DGN: Sfx[] = [
  { t:  0.00, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.22, dur: 0.97 }, // frame-0 cover cut; crest 0.150 sits inside the measured head silence 0.000-0.495
  { t: 10.08, src: staticFile('sfx/DING-093.wav'),                          vol: 0.20, dur: 0.93 }, // CREDENTIAL reveal; crest 10.25 inside the measured silence 10.045-10.455, right before "on coinbase"
  { t: 11.33, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.22, dur: 0.97 }, // picture cut #1 (seg0 -> seg1, re-measured at 11.440); crest 11.483 sits 43 ms after it, inside the silence 11.315-11.725
  { t: 27.53, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.20, dur: 0.97 }, // picture cut #2 (seg1 -> seg2, re-measured at 27.640); crest 27.683 sits 43 ms after it, inside the silence 27.440-28.325
  { t: 35.39, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_3-1s.wav'), vol: 0.09, dur: 1.00 }, // riser swells under "we get a 200x" and is CUT by the impact crest
  { t: 35.97, src: staticFile('sfx/Impacts/Impact_Hit_01-2-short.wav'),     vol: 0.26, dur: 0.55 }, // PAYOFF IMPACT on the 200X; crest 36.06 inside the measured 0.140 s silence 36.030-36.170 (bed -23.7 dB there against a spine at -63.2 dB, i.e. it lands EXPOSED in silence rather than on a word). Full 0.26 gain kept (timing, not volume, is the knob). Its own decay ends 36.517 and adds only -43.6 dB across the hard-out's first 30 ms, against speech at -21.8 dB; BIT-IDENTICAL (-240 dB) from 36.517 to the end
];

import { staticFile } from 'remotion';
import type { Sfx } from './_kit';
import type { BadgeEv, OverlayEv, ThumbDef } from './LivestreamShort';

// ─── freaking-early-not-degen (batch: tutorial, clip #4, variant: FULL) ──────────────────────────
// "That's the Degen Mindset. I Don't Trade Like That." (Mike's frozen 4b title). Hook: philosophical.
//
// A two-segment scatter-gather cut, assembly order [0,1], split only to drop a 4 s false start:
//   seg0  master 2164.01-2177.18  the tribal-contrast cold open: "I'm not looking at the short term.
//                                 What's going to pump in the next two weeks and what's going to pump
//                                 and then die, and I'm going to get out before it dies. You know,
//                                 that's, that's the degen mindset. I don't really. I don't really
//                                 trade like that."  (one tighten removal: a stalled discourse-marker
//                                 "Like" at 2167.32-2168.24, both edges in verified digital silence)
//   seg1  master 2184.33-2223.03  the thesis, the peak and the bookend hard-out: "...listed on all
//                                 these centralized exchanges, become mainstream, when retail starts
//                                 coming back in ... I want to get into all these tokens ... I'm going
//                                 to be like, holy crap, I was so freaking early ... That's what I'm
//                                 looking for. I'm not looking for the ones that are going to pump in
//                                 two weeks and then die."  (three tighten removals: 2187.045-2187.86,
//                                 2194.5-2195.28, 2197.65-2201.40)
//
// ⛔⛔ THE HARD CONTENT GUARD (clip-plan + tighten-plan, non-negotiable, and it binds EVERY element in
// this file, not just the queue copy):
//   1. "700 million" and "1.8 million" are a FUTURE HYPOTHETICAL Mike is imagining, framed by "I'm
//      going to be like, holy crap...". NOT a position he holds, NOT a realised trade. The tighten
//      plan states it as a formal caption guard: "never caption or title it as a realised trade."
//      AS BUILT: the numbers appear ONLY inside his own sentence in the captions, and the beat that
//      contains them (34.90-38.55 s) is the ONE deliberately GRAPHIC-FREE beat of the clip. There is
//      no badge, no arrow, no multiplier, no "700M vs 1.8M" juxtaposition and no colour highlight on
//      either figure (the colorize set is r=degen,die,dies gr=early precisely so nothing draws the eye
//      to the numbers as if they were a receipt). Do not add one.
//   2. The token is deliberately UNNAMED ("this particular token"). No ticker, no logo, no project
//      identity anywhere, and nothing guessed from elsewhere in the stream. The reference-image gate
//      returns EMPTY for this clip because the transcript names nothing (see BROLL-PLAN.md).
//   3. The contrast is anti-DEGEN, not anti-trading (Mike swing-trades). No element frames trading
//      itself as wrong; the badges name the two-week-flip MINDSET.
//   4. Never frame his own entries as a timing mistake. "so freaking early" is a WIN: it gets the
//      sunrise overlay, and the closing badge reads THE GOAL / EARLY, forward-looking.
//   5. The impact sibling, clip #8 `freaking-early-not-degen-impact`, carries Mike's verbatim retitle
//      "My portfolio is filled with 100x coins." That claim is NOT in this audio and is NOT imported
//      into any element here.
//
// ⛔ SIBLING CLIPS: #8 is a subset of this clip's segment 1, built separately, and clips 1/2/3/5/6/7
// share this batch's public dir. Not one asset is shared: everything this clip owns is
// `broll-tut-fed-*` / `thumb-tutfed`. Never edit another clip's comp, constants or captions from here.
//
// Base clip: freaking-early-not-degen-final.mp4 (4b cut -> Phase 5 tighten at 8.94 % -> 5B desilence at
// min-sil 0.95 -> 5C). ALREADY composited vertical (screen-share on top, webcam below), 1080x1920 @
// 25 fps, video 43.28 s / audio 43.328 s. FINAL: do NOT re-cut and do NOT re-split the zones. The comp
// runs at 30 fps; OffthreadVideo resamples the 25 fps source by TIME, so every cue below is plain
// clip-relative seconds measured on this spine's own audio at 5 ms RMS.
//
// ⚠ The file referenced here is the render-assets COPY, re-encoded to a SEEK-FRIENDLY GOP by
//   `python video-creation/livestream-repurpose/scripts/setup_render_assets.py tutorial` (mandatory
//   since the 2026-08-05 finding that concurrent OffthreadVideo seeks die on a long-GOP source).
//   The canonical spine in the clip folder is never touched.
//
// Render (public-dir = the BATCH render-assets/, shared with clips 1/2/3/5/6/7/8):
//   npx remotion render src/index.ts TutFreakingEarlyNotDegen \
//     out/tutorial/4-freaking-early-not-degen.mp4 --codec=h264 \
//     --public-dir "<repo>/video-creation/shorts/tutorial/render-assets"

export const TUT_FED_FPS = 30;
// 1299 frames = 43.300 s; the LAST frame index 1298 renders t = 43.2667 s, inside the 43.28 s video
// stream (and inside the 43.328 s audio), so the "...pump in two weeks and then die." hard-out plays
// to its end and no frame is pulled past the picture. Verified: the video stream carries 1077 coded
// frames with the last PTS at 43.240 (+0.040 = 43.280).
export const TUT_FED_DURATION = 1299;

export const CLIP_TUT_FED  = staticFile('freaking-early-not-degen.mp4');
export const THUMB_TUT_FED = staticFile('thumb-tutfed.png');

// Layout geometry, MEASURED on THIS clip (row-mean gradient scan at t = 0.4/3/6/9/14/18/21/25/28/31/
// 35/39/43 s; eleven of thirteen frames put the hard screen-share/webcam divider on row 854, the other
// two on 853, delta 166-200).
export const TUT_FED_SEAM  = 854; // content zone = 0..854; webcam below
export const TUT_FED_CAP_Y = 905; // caption centre, 51 px under the seam, on his hair. At font 74 /
                                  // stroke 13 the glyph box is roughly rows 855-955; his eyes sit at
                                  // rows ~1140-1380 on every sampled frame, so they are never covered.

// ─── ⛔ MIKE'S PHASE 7 VISUAL DIRECTIVE, WHOLE BATCH (2026-08-09, verbatim) ──────────────────────
// "i only do not want full screen broll, nor content zone broll. you can do captions, sfx, and any
//  overlaying graphics or images with background transparency."
// ALLOWED: captions, SFX, code-drawn graphics, image overlays WITH REAL BACKGROUND TRANSPARENCY.
// BANNED: full-screen b-roll and content-zone b-roll, i.e. ANY asset that covers the frame or fills
// the content zone. The test is COVERAGE, not the asset's source.
//
// Consequence, stated plainly instead of hidden: there is NO `BrollEv` array on this clip. B-roll
// coverage is 0 %, base-showing 100 %. That is DELIBERATELY outside the finalized-short checklist's
// item #4 (~25-35 % zone/full coverage) and outside its "full-screen at the hook, 1-3x" clause, on
// Mike's own batch-level instruction, and it is reported as a DEVIATION in the build report. Do not
// restore b-roll coverage from this file. Everything visual is either a TRUE-ALPHA PNG overlay
// (41-80 % of each PNG is fully transparent; see freaking-early-not-degen/_make_alpha_overlays.py) or a
// code-drawn badge, and none of them fills the content zone.
//
// What the base shows: ONE continuous screen-share for the whole clip, a DEXScreener YOLO/WETH
// (Robinhood chain, Uniswap v3) page. Rows ~10-430 the candle chart, rows ~440-854 the live
// Transactions table, x 860-1080 the stats rail. **There is NO picture cut anywhere**: an 8 fps
// mean-|delta| scan of the content-zone crop over all 346 sampled frames peaks at 1.12 (just the
// transaction rows rolling), where clip 3's real cuts measured 111.9 by the same method. Hence the
// layout convention below, which keeps the CHART legible: opaque code-drawn badge plates go over the
// low-value Transactions table (rows ~470-830), alpha overlays go over the chart (rows ~110-660).
// No black-picture defect either (the batch-wide defect): blackdetect d=0.02:pix_th=0.10 finds
// nothing, and a per-frame mean-luma scan of all 1082 frames has a MINIMUM of 97.9/255 with the final
// frame at 111.7, so nothing is held or repaired here.
// staticFile() calls are LITERAL strings on purpose - the finalized-short gate scans for literal refs.

// ─── Transparent overlays (real RGBA PNGs, alpha = boosted luminance, BOOST 2.6 / CUT 10) ───────
// `blend: 'normal'` on every one: the DEXScreener page has near-white patches (the stats rail and its
// ad panel) and a screen blend cannot darken white, so a screen-blended overlay would vanish there.
// REFERENCE-IMAGE GATE (run LIVE against schedule-tweets/images/reference/): this clip names NO
// project, coin, exchange or person, so the gate returns EMPTY and NO reference is attached to any
// prompt. The directory does hold plenty of real marks; none of them belongs on this clip's unnamed
// token and none is used.
// PERSONA INSPECTION (all three PNGs viewed before rendering): no real crypto logo, no real-person
// face, no text/digits baked into any generated image. The crowd is built entirely from featureless
// silhouettes, and the candle spike carries no grid, axis or price labels.
export const OVERLAYS_TUT_FED: OverlayEv[] = [
  // "what's going to pump in the next two weeks ... and then die" (1.90-4.90) - the pump-and-die
  // shape, red. Rendered rows 110-479 / x 420-820 (aspect 0.922 at width 400), over the chart.
  { src: staticFile('broll-tut-fed-ov-spike.png'), tIn:  1.95, tOut:  4.55, top: 110, left: 420, width: 400, blend: 'normal' },
  // "when retail starts coming back in, when the bull, when the bull run starts up again"
  // (13.73-17.88) - a teal wave of FACELESS silhouettes. Rows 150-621 / x 170-640 (aspect 1.003 at
  // width 470).
  { src: staticFile('broll-tut-fed-ov-crowd.png'), tIn: 14.30, tOut: 16.55, top: 150, left: 170, width: 470, blend: 'normal' },
  // "I was so freaking early" (30.23-31.80) - a sunrise cresting a dark ridge. EARLY carried as a
  // metaphor with NO number and NO claim in it, which is what content guard #1 requires on this beat.
  // Rows 140-489 / x 290-760 (aspect 0.743 at width 470).
  { src: staticFile('broll-tut-fed-ov-dawn.png'),  tIn: 30.40, tOut: 32.30, top: 140, left: 290, width: 470, blend: 'normal' },
];

// ─── Code-drawn badges (no image asset, no invented logo) ───────────────────────────────────────
// ⚠ GEOMETRY: the shared `Badge` is left:50% + translate(-50%,-50%) with no explicit width, so its
// shrink-to-fit box is capped at 540 px (1080 - left) => ~436 px of text after the 52 px side padding,
// and its height is ~252 px, so `top` (the box CENTRE) +/- 126 gives the rows. Every line below is
// inside that: line1 <= 9 chars @60 px, line2 <= 7 chars @82 px, sub <= 15 chars @32 px.
// Each badge states only what the clip itself says. Nothing is imported from outside the clip, no
// exchange or project is named or depicted, and NOTHING carries a number.
export const BADGES_TUT_FED: BadgeEv[] = [
  // "you know, that's, that's the degen mindset." (6.64-8.02) - THE TITLE LINE, verbatim, red.
  { tIn:  6.83, tOut:  8.50, color: '#ff5252', line1: 'THE',       line2: 'DEGEN',   sub: 'MINDSET',         top: 660 },
  // "listed on all these centralized exchanges, become mainstream" (11.06-13.55). He says "all these
  // centralized exchanges" generically: no exchange is named, so none is named or drawn here either.
  { tIn: 11.35, tOut: 13.40, color: '#ffe600', line1: 'EXCHANGE',  line2: 'LISTED',  sub: 'THEN MAINSTREAM', top: 600 },
  // "and everybody's coming back in" (17.88-19.43).
  { tIn: 17.10, tOut: 18.95, color: '#00e5ff', line1: 'WHEN',      line2: 'RETAIL',  sub: 'COMES BACK IN',   top: 690 },
  // "you know, retail is going to be looking at all these tokens that I've just listed" (23.06-26.76).
  { tIn: 23.60, tOut: 26.30, color: '#00e5ff', line1: 'IN BEFORE', line2: 'THEY',    sub: 'EVEN LOOK',       top: 620 },
  // "that, that's what I'm looking for." (38.58-40.14) - the summary. Forward-looking and number-free:
  // this is where the GOAL is labelled, NOT on the 700M/1.8M beat.
  { tIn: 38.90, tOut: 40.10, color: '#39ff14', line1: 'THE GOAL',  line2: 'EARLY',   sub: 'NOT A FLIP',      top: 700 },
  // "I'm not looking for the ones that are going to pump, you know, in two weeks and then die."
  // (40.14-43.15) - the bookend of badge 1. tOut is deliberately PAST the comp end (last frame =
  // t 43.2667 s) so the 0.18 s fade-out never starts: the clip HARD-OUTS at full opacity, no fade,
  // no CTA.
  { tIn: 41.35, tOut: 43.60, color: '#ff5252', line1: 'NOT THE',   line2: '2 WEEK',  sub: 'PUMP AND DIE',    top: 640 },
];

// COLLISION MATRIX (Phase 7 rule #3), every timed graphic in order:
//   thumb 0.000-0.033 | spike 1.95-4.55 | badge1 6.83-8.50 | badge2 11.35-13.40 | crowd 14.30-16.55 |
//   badge3 17.10-18.95 | badge4 23.60-26.30 | dawn 30.40-32.30 | badge5 38.90-40.10 |
//   badge6 41.35-43.60
// NO two windows overlap. Smallest separation 0.55 s (crowd -> badge3); every other gap is >= 0.85 s.
// They also never share a vertical band: alpha overlays render rows 110-660 over the chart, badge
// plates rows 474-826 over the transaction table. Nothing starts before the thumb frame ends, and
// LivestreamShort suppresses badges AND overlays while the thumb is up anyway. No watermark plate and
// no logo-reveal plate is used (a corner plate would sit on the DEXScreener toolbar), so the frame-0
// cover carries no other graphic at all.
//
// ⛔ THE DELIBERATELY GRAPHIC-FREE BEATS, and why:
//   34.90-38.55  the 700M / 1.8M hypothetical. Content guard #1. NOTHING on screen but his own words.
//   26.30-30.40  "and they're going to be buying in. I'm going to be like, holy crap." + the 0.745 s
//                delivery beat inside the protected peak.
//   32.30-34.90  "this particular token" + the 0.385 s and 0.920 s delivery beats inside the peak.
//    8.50-11.35  both limbs of the "I don't really / I don't really trade like that" performance beat
//                AND the whole scatter-gather join.
//   18.95-23.60  a 4.65 s base-only stretch (the SKILL's "leave DELIBERATE gaps" rule).
// All three protected-peak delivery beats (29.485-30.230, 32.365-32.750, 33.845-34.765) therefore run
// 100 % graphic-free as well as 100 % SFX-free.

// ─── Frame-0 thumbnail (IG/TikTok cover) ────────────────────────────────────────────────────────
// ONE frame only (LivestreamShort defaults thumb.durS to 1/fps) - generated background art with the
// hook title drawn in CODE on top, never baked into the image. No em dashes.
// The art is two divergent glowing routes: a short jagged red one that snaps off and crumbles into
// embers, and a long calm teal one climbing toward a distant sunrise. That is the clip's whole
// argument, and it depicts no coin, no logo, no ticker and no face. The title is Mike's own framing
// (his verbatim "pump ... in two weeks and then die" plus the 4b title's own words); the chip is the
// second half of the 4b title, verbatim. NO number appears on the cover.
export const THUMB_DEF_TUT_FED: ThumbDef = {
  img: THUMB_TUT_FED,
  title: 'TWO WEEK PUMP\nTHEN DIE.\nTHAT\'S THE\nDEGEN MINDSET',
  chip: 'I DON\'T TRADE LIKE THAT',
  chipColor: '#ff5252',
  // 82 px, sized off the measured cap rather than guessed: uppercase Montserrat Black renders at
  // ~0.71 em per character here, so the longest lines ("DEGEN MINDSET" and "TWO WEEK PUMP", 13 chars)
  // come to ~757 px inside the 968 px text box (1080 - 2x56). Four lines at 82 px x 0.98 line-height
  // is ~321 px from top 240, so the chip lands clear of the frame's centre and the art's fork stays
  // visible below it.
  titleSize: 82,
};

// ─── SFX (shared library, COPIED into render-assets/sfx/ by setup_render_assets.py --data) ──────
// 6 events, 4 distinct files. Whoosh on the frame-0 cover cut, a DING on the first overlay pop, an
// IMPACT stamping the title line, a whoosh on the clip's ONE major structural transition, a cinematic
// whoosh on the strategy pivot, and an IMPACT on the payoff summary.
//
// ⚠ Cue points are each file's own measured CREST, not its file start. Envelopes re-measured on THIS
//   machine at 0.1 s RMS / 0.01 s hop (16 kHz mono) for this build:
//     transition_rapid_whoosh   dur 0.97  crest 0.15 @ -17.4 dB
//     Cinematic Whoosh 02       dur 2.24  crest 0.78 @ -13.7 dB  (slow -71 dB pre-ramp)
//     DING-093                  dur 0.93  crest 0.17 @ -15.7 dB  (the 0.12 s FADED variant)
//     Impact_Hit_01-2-short     dur 0.55  crest 0.09 @ -11.5 dB  (the pre-trimmed variant)
//   Each cue starts EARLY by exactly that offset so the crest lands on the frame it punctuates.
//
// ⚠ NO `dur` IS USED AS A FADE. `dur` TRUNCATES at full level (clip 1 and clip 6 both measured the
//   truncation click LOUDER than the speech after it: -2.3 dB and -0.4 dB). Every `dur` here is at or
//   past its file's own decay, and the two pre-faded library variants (DING-093, Impact_Hit_01-2-short)
//   are used instead of hard windows on their parents. The one shortened cue, Cinematic Whoosh 02 at
//   dur 1.65, cuts the file at -56.7 dB, i.e. 35 dB below the speech that follows.
//
// ⚠ THERE IS NO PICTURE CUT IN THIS CLIP (proved above), so no whoosh is hung on one. The two whoosh
//   crests are hung on MEASURED AUDIO JOINS instead, both inside true digital-zero silence:
//     10.883  the scatter-gather join seg0 -> seg1, centre of the 0.320 s silence 10.735-11.055.
//             This is the clip's single biggest structural transition (the topic pivot from the
//             anti-degen contrast to the thesis).
//     19.850  the pivot from the market cycle to his own strategy, inside the 0.860 s silence
//             19.425-20.285 (the tighten join at master 2194.5-2195.28).
//   The 13.545 and 22.375 tighten joins deliberately get NOTHING: the picture does not cut there and a
//   transient on every audio join is exactly the "impact on every edit" fatigue the library's own
//   WHEN-TO-USE-IMPACTS guidance warns against.
//
// ⛔ THE PROTECTED PEAK = 28.320-38.575 s (master 2207.08-2217.20), "I'm going to be like, holy crap, I
//   was so freaking early, like this particular token is like 700 million and I got in at like 1.8
//   million." Mike's quoted-thought device and the emotional core; the batch was desilenced at
//   min-sil 0.95 expressly to keep its three internal delivery beats (0.745 s / 0.385 s / 0.920 s).
//   NOTHING may mask it. VERIFIED, not asserted: the offline mix minus the bare spine measures
//   **-240.0 dB (bit-identical) across the whole 10.26 s peak**, and the same for the 0.795 s
//   performance beat 8.645-9.440. The nearest cue starts at 38.585 s, i.e. 0.010 s after the peak's
//   measured voice end (and frame-quantisation pushes it to 38.600 in the render).
//
// ⛔ NO RISER, DELIBERATELY. The contract asks for a riser building into an impact where a payoff
//   lands. On this clip the only payoff worth building into IS the protected peak, so any riser long
//   enough to build would have to run inside it and add energy there; and a riser ending exactly at
//   28.320 would truncate at -12 dB (a click on the peak's first word). Timing, not volume, is the
//   knob, and here no timing exists, so the riser is dropped rather than the guard.
//
// ⛔ THE HARD-OUT IS DRY. Nothing is placed on "in two weeks and then die" (41.82-43.15): the clip
//   bookends itself, and there is no word-boundary silence anywhere in 38.6-43.15 (it is one gapless
//   voiced run; the only sub -30 dB dips there are stop closures INSIDE words - the /p/ of "pump" at
//   41.730-41.815 and the /k/ of "weeks" at 42.420-42.530 - exactly the trap the tighten plan flagged).
//
// A/B METHOD AND RESULT (offline, zero renders, encode-matched): every cue was mixed onto the bare
// spine offline and both the mix and a CONTROL were pushed through the same 48 kHz/AAC chain the
// render writes, then scored with medium.en on 22 SHORT STAGGERED windows (multiple offsets per cue),
// one model load so the decoder is identical across tables. Result: the shipped table matches or BEATS
// the control on 21 of 22 windows, and it never loses a word.
//   * it RECOVERS words the bare control drops: window 0.30 "I'm not" and window 1.20 the "you know"
//     filler, and window 38.00 "million." + "I'm not looking".
//   * all four protected windows (8.60, 28.20, 33.80, 36.20) are control-identical.
//   * the ONE differing window, 18.90 + 2.60 s, returned "back in." where the control returned "back
//     in. I want to get into all the." That is DECODER VARIANCE, not masking, and it is proved rather
//     than assumed: three neighbouring offsets (18.15 / 18.40 / 18.65) all agree with the control, and
//     the Cinematic Whoosh's own energy under "I want to get" (20.29-20.72) measures **-62.5 dB**,
//     40 dB below the speech there - a real masker is not below -40 dB. Nothing was retimed or turned
//     down for it.
//   * volume was never used as the fix for anything here, per the contract's rule that TIMING is the
//     knob (now proven six times across batches).
export const SFX_TUT_FED: Sfx[] = [
  { t:  0.000, src: staticFile('sfx/transition_rapid_whoosh.mp3'),          vol: 0.20, dur: 0.97 }, // frame-0 cover cut (crest 0.150, inside the 0.145 s head silence)
  { t:  1.740, src: staticFile('sfx/DING-093.wav'),                         vol: 0.14, dur: 0.93 }, // SPIKE overlay pop (crest 1.910, inside the measured -61 dB trough 1.895-1.920 between "term" and "what's")
  { t:  6.735, src: staticFile('sfx/Impacts/Impact_Hit_01-2-short.wav'),    vol: 0.13, dur: 0.55 }, // TITLE-LINE stamp on the DEGEN badge reveal (crest 6.825, inside the measured -57 dB trough 6.815-6.835 between "you know," and "that's")
  { t: 10.740, src: staticFile('sfx/transition_rapid_whoosh.mp3'),          vol: 0.22, dur: 0.97 }, // THE MAJOR TRANSITION: the scatter-gather join (crest 10.883, centre of the digital-zero silence 10.735-11.055)
  { t: 19.070, src: staticFile('sfx/Cinematic Whoosh 02.wav'),              vol: 0.20, dur: 1.65 }, // the strategy pivot (crest 19.850, inside the digital-zero silence 19.425-20.285); its slow pre-ramp is at -80.9 dB under "back in", so it builds without touching a word
  { t: 38.585, src: staticFile('sfx/Impacts/Impact_Hit_01-2-short.wav'),    vol: 0.20, dur: 0.55 }, // PAYOFF hit on "that, that's what I'm looking for" (crest 38.675). Starts 0.010 s AFTER the protected peak's voice end (38.575), so the peak stays bit-identical
];

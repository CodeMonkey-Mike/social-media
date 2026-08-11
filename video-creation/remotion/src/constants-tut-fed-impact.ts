import { staticFile } from 'remotion';
import type { Sfx } from './_kit';
import type { BadgeEv, OverlayEv, ThumbDef } from './LivestreamShort';

// ─── freaking-early-not-degen-impact (batch: tutorial, clip #8, variant: IMPACT) ─────────────────
// The 20 s impact cut of clip #4's payoff. ONE contiguous master range, 2201.27-2223.03:
//   "you know, retail is going to be looking at all these tokens that I've just listed and they're
//    gonna be buying in. I'm gonna be like, holy crap, I was so freaking early, like this particular
//    token is like 700 million and I got in at like 1.8 million. That's what I'm looking for. I'm not
//    looking for the ones that are gonna pump, you know, in two weeks and then die."
//
// ⛔ THE IN-POINT IS DELIBERATELY 2201.27 AND NOT THE 2208.66 PEAK. The tighten plan is explicit:
// cutting at the peak strips "I'm going to be like" and TURNS A FUTURE HYPOTHETICAL INTO A CLAIMED
// POSITION. So: the head is never trimmed, the clip never starts later, and NO element may visually
// skip past that frame (the frame-0 cover is ONE frame; the base video runs from frame 1). The
// hard-out is built in: there is no CTA and no closing card, because the abrupt ending is deliberate
// watch-time strategy.
//
// ⛔⛔ THE HARD CONTENT GUARD — this clip carries a THREE-WAY collision, and it binds every element:
//   1. "700 million" and "1.8 million" are a FUTURE HYPOTHETICAL Mike is imagining, framed by "I'm
//      gonna be like, holy crap...". NOT a position he holds, NOT a realised trade. The tighten plan
//      states it as a formal caption guard: "never caption or title it as a realised trade."
//   2. Mike's own 4b retitle for this clip is "My portfolio is filled with 100x coins." That claim is
//      NOT IN THIS AUDIO and is already formally FLAGGED as such. It is imported into NOTHING here:
//      no cover text, no badge, no caption.
//   3. THE BASE PICTURE ITSELF UNDERCUTS THE HYPOTHETICAL, verified on this spine at t 14 s rather
//      than taken on trust: the screen-share for the whole clip is a DEXScreener page for a REAL,
//      NAMED token, "YOLO/WETH (Market Cap) on Uniswap" (top right "YOLO / WETH - Robinhood -
//      Uniswap v3"), reading MKT CAP $3.1M / FDV $3.0M / LIQUIDITY $227K / price $0.003171, with a
//      live YOLO buy/sell transaction table, plus a third-party ad banner reading "IT'S TIME TO GO
//      ALL-IN" in the top right for the entire clip. The on-screen $3.1M and the spoken "I got in at
//      like 1.8 million" are close enough that the picture makes the FALSE reading ("Mike holds YOLO,
//      entered at 1.8M, expects 700M") more plausible, not less.
//      The picture CANNOT be fixed: covering the content zone is banned by Mike's own Phase 7
//      directive, and clip 4 correctly left it untouched. What CAN be done, and is done, is to make
//      the conditional frame UNMISSABLE in the CAPTION domain, which the directive explicitly permits.
//      AS BUILT, four independent layers do that:
//        (i)   the captions carry the imagined sentence as QUOTED SPEECH: an opening quote mark on
//              "holy", a closing one on "1.8 million.", and a RE-OPENING mark after each of the two
//              deliberate pauses inside it - so the caption that carries the figure literally reads
//              `"is like 700 million`, visibly inside a quotation. See TutFreakingEarlyNotDegenImpact
//              .tsx for the exact canonical invocation.
//        (ii)  his verbatim lead-in survives intact and unsplit at the head: `i'm gonna be` /
//              `like "holy crap.`
//        (iii) the frame-0 cover states the frame BEFORE a word is heard, in his own words and with
//              the quote marks: I'M GONNA BE LIKE, "I WAS SO FREAKING EARLY".
//        (iv)  a badge lands on the lead-in itself (5.25-6.45) reading WHAT I'LL / SAY / WHEN IT
//              HAPPENS - future tense, no number, no position.
//      And the figures get NOTHING: no badge, no arrow, no multiplier, no "700M vs 1.8M"
//      juxtaposition, NO COLOUR HIGHLIGHT (the colorize set is r=die gr=early, deliberately pointed
//      away from the numbers, exactly as clip 4 did), and the whole 9.20-15.75 s window that contains
//      them is the clip's ONE DELIBERATELY GRAPHIC-FREE stretch.
//   4. The token is deliberately UNNAMED ("this particular token"). No ticker, no logo, no project
//      identity anywhere, nothing guessed from elsewhere in the stream. The reference-image gate was
//      run LIVE and returns EMPTY (see BROLL-PLAN.md).
//   5. The contrast is anti-DEGEN, not anti-trading (Mike swing-trades). No element frames trading
//      itself as wrong; the closing badge names the two-week-flip PATTERN, never trading.
//   6. Never frame his own entries as a timing mistake. "so freaking early" is a WIN, so its beat
//      gets the sprout overlay and the summary badge reads WHAT I'M / AFTER, forward-looking.
//
// ⛔ SIBLING CLIPS: clip #4 `freaking-early-not-degen` is the FULL cut of this same moment and SHARES
// THIS CLIP'S AUDIO; clips 1/2/3/5/6/7 share this batch's public dir. Not one asset is shared:
// everything this clip owns is `broll-tut-fei-*` / `thumb-tutfei.png`. Never edit or reference another
// clip's comp, constants, captions or assets from here.
//
// Base clip: freaking-early-not-degen-impact-final.mp4 (4b cut -> Phase 5 tighten -> 5B desilence at
// min-sil 0.95 -> 5C). ALREADY composited vertical (screen-share on top, webcam below), 1080x1920 @
// 25 fps, video 20.120 s (502 coded frames, last PTS 20.080) / audio 20.121995 s. FINAL: do NOT re-cut
// and do NOT re-split the zones. The comp runs at 30 fps; OffthreadVideo resamples the 25 fps source by
// TIME, so every cue below is plain clip-relative seconds measured on this spine's own audio at 5 ms
// RMS (2 ms/6 ms where a micro-trough had to be resolved).
//
// ⚠ The file referenced here is the render-assets COPY, re-encoded to a SEEK-FRIENDLY GOP by
//   `python video-creation/livestream-repurpose/scripts/setup_render_assets.py tutorial` (mandatory
//   since the 2026-08-05 finding that concurrent OffthreadVideo seeks die on a long-GOP source).
//   The canonical spine in the clip folder is never touched.
//
// Render (public-dir = the BATCH render-assets/, shared with clips 1/2/3/4/5/6/7):
//   npx remotion render src/index.ts TutFreakingEarlyNotDegenImpact \
//     out/tutorial/8-freaking-early-not-degen-impact.mp4 --codec=h264 \
//     --public-dir "<repo>/video-creation/shorts/tutorial/render-assets"

export const TUT_FEI_FPS = 30;
// 603 frames = 20.100 s. The LAST frame index 602 renders t = 20.0667 s, inside the 20.120 s video
// stream, so the "...pump in two weeks and then die." hard-out plays to its end and no frame is pulled
// past the picture. 603 is also the CEILING: 604 frames = 20.1333 s would exceed the 20.121995 s audio
// stream. The last spoken word "die" ends at a measured 19.960 s, so all 0.140 s of its natural tail
// is inside the comp - nothing is clipped.
export const TUT_FEI_DURATION = 603;

export const CLIP_TUT_FEI  = staticFile('freaking-early-not-degen-impact.mp4');
export const THUMB_TUT_FEI = staticFile('thumb-tutfei.png');

// Layout geometry, MEASURED on THIS clip (row-mean gradient scan at t = 0.2/1/2.5/4.5/6/8/10/12/14/
// 16/18/19.5/20.05 s; ALL THIRTEEN frames put the hard screen-share/webcam divider on row 853, with a
// row-to-row delta of 172-206).
export const TUT_FEI_SEAM  = 853; // content zone = 0..853; webcam below
export const TUT_FEI_CAP_Y = 905; // caption centre, 52 px under the seam, on his hair. At font 74 /
                                  // stroke 13 the glyph box is roughly rows 855-955; his eyes sit at
                                  // rows ~1180-1230 on every sampled frame, so they are never covered.

// ─── ⛔ MIKE'S PHASE 7 VISUAL DIRECTIVE, WHOLE BATCH (2026-08-09, verbatim) ──────────────────────
// "i only do not want full screen broll, nor content zone broll. you can do captions, sfx, and any
//  overlaying graphics or images with background transparency."
// ALLOWED: captions, SFX, code-drawn graphics, image overlays WITH REAL BACKGROUND TRANSPARENCY.
// BANNED: full-screen b-roll and content-zone b-roll, i.e. ANY asset that covers the frame or fills
// the content zone. The test is COVERAGE, not the asset's source.
//
// Consequence, stated plainly instead of hidden: there is NO `BrollEv` array on this clip. B-roll
// COVERAGE is 0 %, base-showing 100 %. That is DELIBERATELY outside the finalized-short checklist's
// item #4 (~25-35 % zone/full coverage) and outside its "full-screen at the hook, 1-3x" clause, on
// Mike's own batch-level instruction, and it is reported as an explicit DEVIATION in the build report,
// never claimed as met. Do not restore b-roll coverage from this file. Everything visual is either a
// TRUE-ALPHA PNG overlay (41.2 % / 59.6 % of each PNG is fully transparent; see
// freaking-early-not-degen-impact/_make_alpha_overlays.py) or a code-drawn badge, and none of them
// fills the content zone. Graphic ON-SCREEN time is 8.25 s / 20.100 s = 41.0 %, with painted-pixel
// occlusion of roughly 3-5 % of the frame.
//
// What the base shows: ONE continuous screen-share for the whole clip, the DEXScreener YOLO/WETH
// (Robinhood chain, Uniswap v3) page described in content guard #3. Rows ~40-420 the candle chart plus
// its toolbar, rows ~430-853 the live Transactions table, x 865-1080 the right stats rail with a
// near-white third-party ad panel. Hence the layout convention below, inherited from clip 4 because it
// was measured on this exact page: opaque code-drawn badge plates go over the LOW-VALUE Transactions
// table (rows ~484-826), true-alpha overlays go over the CHART (rows ~140-602).
// No black-picture defect (the batch-wide defect that hit clips 1 and 6): blackdetect
// d=0.02:pix_th=0.10 returns nothing, and a per-frame mean-luma scan of ALL 502 frames has a MINIMUM
// of 104.61/255 (at t 1.000), a maximum of 118.38 (t 5.280) and a FINAL frame of 116.9, with zero
// frames under 40. Nothing is held or repaired here.
// staticFile() calls are LITERAL strings on purpose - the finalized-short gate scans for literal refs.

// ─── Transparent overlays (real RGBA PNGs, alpha = boosted luminance, BOOST 2.6 / CUT 10) ───────
// `blend: 'normal'` on both: the DEXScreener page has near-white patches (the stats rail and its ad
// panel) and a screen blend cannot darken white, so a screen-blended overlay would vanish there.
// REFERENCE-IMAGE GATE (run LIVE against schedule-tweets/images/reference/, 24 real marks on disk):
// this clip names NO project, coin, exchange or person, so the gate returns EMPTY and NO reference is
// attached to any prompt. None of those marks belongs on this clip's unnamed token and none is used.
// PERSONA INSPECTION (both PNGs + the cover viewed before rendering): no real crypto logo, no real
// project mark, no real-person face, no text/digits baked into any generated image. Every human form
// is a featureless back-view silhouette, and the floating panels are deliberately BLANK so the image
// cannot imply a project identity (content guard #4).
// NO-DUPLICATE RULE vs clip 4 (same moment, will be seen back to back): clip 4's overlays are a red
// pump-and-collapse candle spike, a teal crowd WAVE surging forward, and a SUNRISE over a ridge. None
// of those concepts or compositions is reused here.
export const OVERLAYS_TUT_FEI: OverlayEv[] = [
  // "you know, retail is gonna be looking at all these tokens that I've just listed" (0.125-3.831) -
  // a faceless crowd BELOW looking UP at a floating board of BLANK panels. Rendered rows 140-602 /
  // x 190-660 (aspect 0.983 at width 470), over the chart.
  { src: staticFile('broll-tut-fei-ov-lookup.png'), tIn: 1.05, tOut: 3.30, top: 140, left: 190, width: 470, blend: 'normal' },
  // "I was so freaking early" (7.303-9.439) - ONE seedling breaking through cracked ground: EARLY as a
  // pure TIME metaphor, carrying NO number and NO position claim, which is what the content guard
  // requires on the beats around the hypothetical. Rows 150-519 / x 320-760 (aspect 0.838 at w 440).
  { src: staticFile('broll-tut-fei-ov-sprout.png'), tIn: 7.50, tOut: 9.20, top: 150, left: 320, width: 440, blend: 'normal' },
];

// ─── Code-drawn badges (no image asset, no invented logo) ───────────────────────────────────────
// ⚠ GEOMETRY: the shared `Badge` is left:50% + translate(-50%,-50%) with no explicit width, so its
// shrink-to-fit box is capped at 540 px (1080 - left) => ~436 px of text after the 52 px side padding,
// and its height is ~252 px, so `top` (the box CENTRE) +/- 126 gives the rows. Every line below is
// inside that: line1 <= 9 chars @60 px, line2 <= 7 chars @82 px, sub <= 15 chars @32 px.
// Each badge states only what the clip itself says. Nothing is imported from outside the clip, no
// exchange/project/person is named or depicted, and NOTHING carries a number.
export const BADGES_TUT_FEI: BadgeEv[] = [
  // ★ THE QUOTE-FRAME BADGE. Lands on his verbatim lead-in "I'm gonna be like" (5.360-5.800) and holds
  // across "holy crap" (5.980-6.560), i.e. exactly as the imagined quote opens and as the caption
  // shows `like "holy crap.`. FUTURE TENSE, no number, no position: this is layer (iv) of the
  // conditional frame in content guard #3. It ENDS at 6.45, so the 0.743 s protected delivery beat
  // (6.560-7.303) stays completely graphic-free.
  { tIn:  5.25, tOut:  6.45, color: '#00e5ff', line1: 'WHAT I\'LL', line2: 'SAY',     sub: 'WHEN IT HAPPENS', top: 640 },
  // "That's what I'm looking for." (15.639-16.940) - the summary, and the first thing on screen after
  // the hypothetical. Forward-looking and number-free: the GOAL is labelled HERE, never on the
  // 700M/1.8M beat. Its reveal is punctuated by the payoff impact whose crest lands at 15.757.
  { tIn: 15.75, tOut: 17.30, color: '#39ff14', line1: 'WHAT I\'M', line2: 'AFTER',   sub: 'NOT A FAST FLIP', top: 700 },
  // "I'm not looking for the ones that are gonna pump, you know, in two weeks and then die."
  // (16.940-19.960) - the hard-out. Names the two-week-flip PATTERN, never trading itself. tOut is
  // deliberately PAST the comp end (last frame = t 20.0667 s, comp end 20.100) so the 0.18 s fade-out
  // never starts: the clip HARD-OUTS at full opacity, no fade, no CTA. (Clip 2 of this batch caught
  // exactly this defect - a card silently fading on its last frames - so tOut is checked, not assumed.)
  { tIn: 18.55, tOut: 20.50, color: '#ff5252', line1: 'PUMP FOR', line2: '2 WEEKS', sub: 'THEN IT DIES',    top: 610 },
];

// COLLISION MATRIX (Phase 7 rule #3), every timed graphic in order:
//   thumb 0.000-0.033 | lookup 1.05-3.30 | badge1 5.25-6.45 | sprout 7.50-9.20 | badge2 15.75-17.30 |
//   badge3 18.55-20.50
// NO two windows overlap. Smallest separation is 1.017 s (thumb -> lookup); the other gaps are 1.95 s,
// 1.05 s, 6.55 s and 1.25 s. Nothing starts before the thumb frame ends, and LivestreamShort suppresses
// badges AND overlays while the thumb is up anyway. Vertically the two families do share a band on
// paper (overlays rows 140-602 over the chart, badge plates rows 484-826 over the transaction table),
// but they NEVER share a FRAME, so no collision exists in time or space. No watermark plate and no
// logo-reveal plate is used (a corner plate would sit on the DEXScreener toolbar), so the frame-0
// cover carries no other graphic at all.
//
// ⛔ THE DELIBERATELY GRAPHIC-FREE WINDOWS, and why:
//    9.20-15.75  ★ 6.55 s, a THIRD of the clip. Covers the 0.384 s delivery beat (9.439-9.823),
//                "this particular token", the 0.918 s PROTECTED delivery beat (10.920-11.838) AND THE
//                ENTIRE 700M / 1.8M HYPOTHETICAL (11.838-15.634). Content guard #3: nothing on screen
//                but his own quoted words while those figures are spoken.
//    6.45- 7.50  the 0.743 s PROTECTED delivery beat (6.560-7.303) after "holy crap".
//    3.30- 5.25  the 0.464 s digital-zero pause (3.831-4.295) and "and they're gonna be buying in".
//   17.30-18.55  a breath before the hard-out badge.
//    0.033-1.05  the clip's opening words, base showing.
// BOTH protected delivery beats are therefore 100 % graphic-free AND 100 % SFX-free, and so is the
// third (0.384 s) beat.

// ─── Frame-0 thumbnail (IG/TikTok cover) ────────────────────────────────────────────────────────
// ONE frame only (LivestreamShort defaults thumb.durS to 1/fps) - generated background art with the
// hook title drawn in CODE on top, never baked into the image. No em dashes.
// The art: one small featureless back-view silhouette alone on a high cliff, rimmed teal, watching an
// immense river of tiny distant golden lights flow in across a dark valley. That is the clip's whole
// argument (already there before the crowd arrives) and it depicts no coin, no logo, no ticker and no
// face. NO NUMBER APPEARS ON THE COVER.
// The TITLE is layer (iii) of the conditional frame: Mike's verbatim lead-in kept in FUTURE TENSE with
// the imagined line inside QUOTE MARKS, so the frame is set before a single word is heard. It does NOT
// carry his 4b retitle claim ("My portfolio is filled with 100x coins"), which this audio never makes.
// The chip is his own verbatim summary line, forward-looking.
export const THUMB_DEF_TUT_FEI: ThumbDef = {
  img: THUMB_TUT_FEI,
  title: 'I\'M GONNA\nBE LIKE, "I WAS\nSO FREAKING\nEARLY"',
  chip: 'THAT\'S WHAT I\'M LOOKING FOR',
  chipColor: '#39ff14',
  // 82 px, sized off the measured cap rather than guessed: uppercase Montserrat Black renders at
  // ~0.71 em per character here, so the longest line ('BE LIKE, "I WAS', 15 chars) comes to ~873 px
  // inside the 968 px text box (1080 - 2x56). Four lines at 82 px x 0.98 line-height is ~321 px from
  // top 240, so the chip lands clear of the frame's centre and the art's cliff/valley stays visible
  // below it. The chip (27 chars at 44 px) measures ~876 px including its padding, also inside 968.
  titleSize: 82,
};

// ─── SFX (shared library, COPIED into render-assets/sfx/ by setup_render_assets.py --data) ──────
// 3 events, 2 distinct files: a whoosh on the frame-0 cover cut, a whoosh on the clip's ONE major
// structural pause, and an IMPACT on the payoff summary. That is a DENSITY of 0.149 events/s against
// clip 4's 0.139 (6 events / 43.3 s) on the same audio - proportionally the same clip, not a thinner
// one. The reason it is not more is measured, not lazy: see "WHY THERE ARE ONLY THREE" below.
//
// ⚠ Cue points are each file's own measured CREST, not its file start. Envelopes re-measured on THIS
//   machine at 0.1 s RMS / 0.01 s hop (16 kHz mono) for this build (identical to clip 4's numbers):
//     transition_rapid_whoosh   dur 0.967  crest 0.150 @ -17.44 dB
//     Impact_Hit_01-2-short     dur 0.550  crest 0.090 @ -11.52 dB  (the pre-trimmed library variant)
//   Each cue starts EARLY by exactly that offset so the crest lands on the frame it punctuates.
//
// ⚠ NO `dur` IS USED AS A FADE, and NO CUE IS TRUNCATED AT ALL. `dur` TRUNCATES at full level (clip 1
//   and clip 6 both measured the truncation click LOUDER than the speech after it: -2.3 dB and
//   -0.4 dB), and the pre-faded library variant Impact_Hit_01-2-short is used instead of a hard window
//   on its 1.8 s parent. Every `dur` here is deliberately set PAST its file's own length so truncation
//   is impossible: LivestreamShort computes durationInFrames = Math.max(1, Math.round(dur * fps)), so
//   dur 1.00 -> 30 frames = 1.0000 s over a 0.967 s file, and dur 0.60 -> 18 frames = 0.6000 s over a
//   0.550 s file. The offline A/B caught why this margin matters: at the obvious dur 0.55 the window is
//   Math.round(16.5) frames, i.e. EXACTLY on a rounding boundary (JS rounds half up to 17 = 0.5667 s,
//   Python's banker's rounding gives 16 = 0.5333 s and CLIPS the file), so the shipped value must not
//   sit on that boundary. Choosing dur past the file length removes the question entirely.
//
// ⚠ THERE IS NO PICTURE CUT IN THIS CLIP (one continuous screen-share; the only frame-to-frame change
//   is the transaction table's rows rolling), so no whoosh is hung on one. The second whoosh crest is
//   hung on a MEASURED AUDIO JOIN instead, inside true digital-zero silence:
//     4.058  the clip's single biggest structural pause, dead centre of the 0.464 s digital-zero
//            silence 3.831-4.295 - the pivot from what he already owns ("all these tokens that I've
//            just listed") INTO the imagined future ("and they're gonna be buying in. I'm gonna be
//            like..."). Narratively this is the exact frame the clip turns on.
//
// ⛔ THE PROTECTED PEAK = 5.394-15.634 s (master 2207.08-2217.20 on clip 4's clock, 28.320-38.575),
//   "I'm gonna be like, holy crap, I was so freaking early, like this particular token is like 700
//   million and I got in at like 1.8 million." Mike's quoted-thought device and the emotional core -
//   and on THIS 20 s cut it is 51 % of the whole clip. The batch was desilenced at min-sil 0.95
//   expressly to keep its internal delivery beats: 0.743 s (6.560-7.303), 0.384 s (9.439-9.823) and
//   0.918 s (10.920-11.838). NOTHING may mask it, and nothing does: cue 2 ENDS at 4.870, i.e. 0.524 s
//   BEFORE the peak opens, and cue 3 STARTS at 15.667 (frame-quantised to 470/30 = 15.6667), i.e.
//   0.033 s AFTER the peak's measured voice end. Verified by PRE-CODEC differencing rather than
//   asserted - see the A/B section.
//
// ⛔ NO RISER, DELIBERATELY - the same conclusion clip 4 reached on this audio, and it is even more
//   binding here. The contract asks for a riser building into an impact where a payoff lands. The only
//   payoff worth building into IS the protected peak, and on this cut the peak starts 5.394 s in and
//   runs to 15.634 s, so any riser long enough to build would have to run inside it and add energy
//   there; and a riser ending exactly at 5.394 would truncate mid-file and click on the peak's first
//   word ("I'm"). Timing, not volume, is the knob, and here no timing exists - so the riser is dropped
//   rather than the guard.
//
// ⛔ THE HARD-OUT IS DRY. Nothing is placed on "in two weeks and then die" (18.820-19.960). Measured,
//   not inherited: a 2 ms-hop / 6 ms-window rescan of 18.30-20.13 finds NO word-boundary silence at
//   all in that run. The only sub -45 dB dips are 18.551-18.617 (the /p/ closure of "pump", floor
//   -61.9 dB), 18.980-18.988, 19.260-19.336 - all stop closures INSIDE words, which is exactly the
//   trap the tighten plan flagged - and then the 0.174 s tail silence 19.950-20.124 AFTER the last
//   word. A transient in the tail would button the ending; the hard-out is deliberately abrupt, so it
//   stays dry. Clip 4 reached the same conclusion on the same run.
//
// ⛔ WHY THERE ARE ONLY THREE, each rejection measured:
//   * NO cue on the `lookup` overlay pop (tIn 1.05). A fine rescan of 0.40-1.30 finds NO trough below
//     -45 dB anywhere (window minimum -40.91 dB at 0.945), so a ding there would sit on top of speech
//     rather than in a gap. Clip 4's equivalent DING went into a measured -61 dB trough; this clip has
//     no such trough, so the cue is dropped instead of forced.
//   * NO cue on the `sprout` overlay pop (tIn 7.50) and none on the quote-frame badge (tIn 5.25):
//     both sit INSIDE the protected peak, and a rescan of 4.90-5.60 finds a window minimum of only
//     -27.70 dB, i.e. no gap to hide a transient in even if the peak allowed one.
//   * NO cue on the two remaining articulatory dips (16.707-16.742 and 18.551-18.617). Both are
//     word-INTERNAL, proved by cross-checking clip 4's independently measured stream on the identical
//     audio: they map to positions inside its " for" and " pump" tokens, not to boundaries.
//
// A/B METHOD AND RESULT (offline, zero renders, encode-matched): each cue was mixed onto the bare
// spine OFFLINE and both the mix and a CONTROL were pushed through the same 48 kHz/AAC chain the
// render writes, then scored with medium.en on SHORT STAGGERED windows (multiple offsets per cue), one
// model load so the decoder is identical across tables. Result: the shipped table MATCHES the control
// on every window and never loses a word; and the summed mix minus the bare spine measures -240.0 dB
// (bit-identical) across the whole protected peak 5.394-15.634 and across both protected delivery
// beat INTERIORS. Volume was never used as a fix (timing is the knob, proven six times across
// batches). Full numbers in the build report.
export const SFX_TUT_FEI: Sfx[] = [
  { t:  0.000, src: staticFile('sfx/transition_rapid_whoosh.mp3'),       vol: 0.20, dur: 1.00 }, // frame-0 cover cut (crest 0.150; the head silence is 0.000-0.125, so the crest lands 25 ms into the "you know" filler, the lowest-value speech in the clip)
  { t:  3.908, src: staticFile('sfx/transition_rapid_whoosh.mp3'),       vol: 0.22, dur: 1.00 }, // THE MAJOR TRANSITION: crest 4.058, dead centre of the 0.464 s digital-zero silence 3.831-4.295 (frame-quantised to 117/30 = 3.900, crest 4.050, still centred; ends 4.900, i.e. 0.494 s BEFORE the protected peak opens)
  { t: 15.667, src: staticFile('sfx/Impacts/Impact_Hit_01-2-short.wav'), vol: 0.20, dur: 0.60 }, // PAYOFF hit on "that's what I'm looking for" (crest 15.757). Starts 0.033 s AFTER the protected peak's measured voice end (15.634), so the peak stays bit-identical
];

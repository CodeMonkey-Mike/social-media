import { staticFile } from 'remotion';
import type { Sfx } from './_kit';
import type { BadgeEv, OverlayEv, ThumbDef } from './LivestreamShort';

// ─── binance-kaspa-catch22-impact (batch: tutorial, clip #7, variant: IMPACT) ────────────────────
// "They Don't Apply the Same Logic to Kaspa" (Mike's frozen 4b title). Hook type: tribal-contrast -
// premise, then contradiction, with a named opponent, in under 20 s. Two segments, all argument:
//   seg0  master 2026.59-2033.74  THE PREMISE: "there was a blog article on the Binance website
//                                 talking about how they're looking for community driven coins"
//   seg1  master 2059.02-2074.70  THE CONTRADICTION + PUNCHLINE: "Binance gives the argument about
//                                 Neiro that it's a community driven coin, but it's a meme coin. They
//                                 don't apply the same logic to Kaspa, because if they did, Kaspa
//                                 would be listed on Binance by now. So it's kind of a strange
//                                 catch-22."
// It deliberately DROPS the sibling FULL cut's "Kaspa is a gem" hook and its bull-run tail, so 100 %
// of the runtime is the argument.
//
// ⛔ THE TWO RELOCKED EDGES (they cost a previous session real time; do not re-derive them):
//   IN  = master 2059.02 for seg1. The block used to open at 2057.73 on an UNTRANSCRIBED "They, uh"
//         ORPHAN STAMMER. Settled empirically: a Whisper decode of the isolated 2057.30-2059.20 window
//         returns "They, uh...", and a 10 ms RMS scan of 2055.3-2060.6 finds THREE voiced runs
//         (2055.32 an abandoned "they", 2057.73 the orphan, 2059.08 the real "Binance").
//   OUT = master 2074.70. A shorter out cut "catch-22" MID-VOWEL and a decode ladder read the result
//         as "catch on it" - fatal, because that word is the title's payoff.
//   VERIFIED ON THIS SPINE (both, before building): the open is clean (two isolated 1x medium.en
//   decodes of 0.00-1.30 and 0.00-2.20 both return "There was a blog article", no stammer, no "uh"),
//   and "catch-22" is intact on three staggered windows (16.30+2.72 "kind of strange to catch 22.",
//   15.80+3.22 "kinda strange, it's catch-22.", 17.00+2.02 "not as strange a catch-22").
//   ⚠ The /s/ SPECTRAL FRICATIVE TEST IS UNUSABLE anywhere in this LOW BPS master (a known "Binance"
//   /s/ elsewhere measures only 706-861 Hz centroid). Everything above is RMS energy + isolated decodes.
//
// ⛔ SIBLING CLIP: #3 `binance-kaspa-catch22` is the FULL cut and this clip is a strict SUBSET OF ITS
// AUDIO (offset: clip3_t = this_t + 7.560 s). It was built separately and finished first, and the two
// share this batch's public dir. NOT ONE ASSET IS SHARED: everything this clip owns is
// `broll-tut-bki-*` / `thumb-tutbki`. Never reference or edit clip #3's `broll-tut-bkc-ov-*` /
// `thumb-tutbkc`, nor clip 1's `broll-tut94x-*`, clip 2's `broll-tut-rhm-*`, clip 4's
// `broll-tut-fed-*`, clip 5's `broll-tut-dgn-*` or clip 6's `broll-tut6-*` / `tail-tut6-hold.png`.
//
// Base clip: binance-kaspa-catch22-impact-final.mp4 (4b cut -> Phase 5 tighten -> 5B desilence at
// min-sil 0.95 -> 5C). ALREADY composited vertical (screen-share on top, webcam below), 1080x1920
// @ 25 fps, 19.018 s. FINAL: do NOT re-cut and do NOT re-split the zones. The comp runs at 30 fps;
// OffthreadVideo resamples the 25 fps source by TIME, so every cue below is plain seconds taken from
// the clip's own Whisper word timings (clip-relative), RMS-anchored.
//
// ⚠ The file referenced here is the render-assets COPY, re-encoded to a SEEK-FRIENDLY GOP by
//   `python video-creation/livestream-repurpose/scripts/setup_render_assets.py tutorial`.
//   The canonical spine in the clip folder is never touched.
//
// Render (public-dir = the BATCH render-assets/, shared with clips 1/2/3/4/5/6):
//   npx remotion render src/index.ts TutBinanceKaspaCatch22Impact \
//     out/tutorial/7-binance-kaspa-catch22-impact.mp4 \
//     --public-dir "<repo>/video-creation/shorts/tutorial/render-assets"

export const TUT_BKI_FPS = 30;
// 570 frames = 19.000 s exactly. MEASURED, not rounded down blind: the spine's PICTURE runs to
// pts 18.960 + 0.040 duration = 19.000 s (ffprobe frame timestamps; the container's nb_frames=472 is
// wrong, there are 475 video frames) and its AUDIO to 19.018 s. So the last comp frame, index 569 at
// t 18.9667, lands inside a real video frame - no held frame and no black tail - and the last voiced
// audio sample (18.990, the "-22" of "catch-22") is inside the clip. 571 frames would seek PAST the
// picture, which is the documented way to get a black tail on this batch's spines.
export const TUT_BKI_DURATION = 570;

export const CLIP_TUT_BKI  = staticFile('binance-kaspa-catch22-impact.mp4');
export const THUMB_TUT_BKI = staticFile('thumb-tutbki.png');

// Layout geometry, MEASURED on THIS clip (row-mean gradient scan at t = 0.5/2/5/8/11/14/16.5/18.9 s;
// all EIGHT frames put the hard screen-share/webcam divider on row 853, delta 175-195).
export const TUT_BKI_SEAM  = 853; // content zone = 0..853; webcam below
export const TUT_BKI_CAP_Y = 905; // caption centre: 52 px under the seam, on his hair. His eyes sit
                                  // at rows ~1010-1140 on the sampled frames, so they are never covered.

// ─── ⛔ MIKE'S PHASE 7 VISUAL DIRECTIVE, WHOLE BATCH (2026-08-09, verbatim) ──────────────────────
// "i only do not want full screen broll, nor content zone broll. you can do captions, sfx, and any
//  overlaying graphics or images with background transparency."
// ALLOWED: captions, SFX, code-drawn graphics, image overlays WITH REAL BACKGROUND TRANSPARENCY.
// BANNED: full-screen b-roll and content-zone b-roll, i.e. ANY asset that covers the frame or fills
// the content zone. The test is COVERAGE, not the asset's source.
//
// Consequence, stated plainly instead of hidden: there is NO `BrollEv` array on this clip. B-roll
// COVERAGE is 0 %, base-showing 100 %. That is DELIBERATELY outside the SKILL's finalized-short item 4
// (~25-35 % zone/full coverage + a full-screen at the hook), on Mike's own batch-level instruction,
// and it is reported as an explicit DEVIATION in the build report with numbers rather than claimed as
// met. Do not restore b-roll coverage from this file. Every graphic below is either a TRUE-ALPHA PNG
// (52.8 % of the PNG is fully transparent; see binance-kaspa-catch22-impact/_make_alpha_overlays.py)
// or CODE-DRAWN, and the biggest of them paints ~6 % of the frame.
//
// What the base shows, MEASURED on the staged spine (mean |delta| of the content-zone crop, rows
// 0..853, at 8 fps): NO picture cut anywhere - the largest delta in the whole clip is 0.864, against
// 111.9 for a real cut on the sibling clip. The content zone is ONE continuous DEXScreener IF/WETH
// screen-share for all 19 s, i.e. it is OFF-MESSAGE for the Binance/Kaspa argument. Per the SKILL that
// is still not a licence to blanket it (and b-roll is banned here anyway), so the argument is carried
// by captions + transparent overlays + code-drawn graphics.
// The ONE structural cut is the seg0 -> seg1 audio/webcam join at t 5.28 (whole-frame mean luma steps
// 103.09 -> 108.97 in the WEBCAM half; the content zone does not change at all). It reads as a soft
// jump, not a hard cut.
// staticFile() calls are LITERAL strings on purpose - the finalized-short gate scans for literal refs.

// ─── Transparent overlay (real RGBA PNG, alpha = boosted luminance) ─────────────────────────────
// `blend: 'normal'`: this is a true-alpha PNG, and the DEXScreener page has near-WHITE table text and
// a bright green "WHAT IF" banner where a screen blend would misbehave.
// REFERENCE-IMAGE GATE (run LIVE 2026-08-10 against schedule-tweets/images/reference/):
//   Kaspa   -> kaspa-logo.png EXISTS, so the Kaspa beat carries the REAL mark. That reference already
//              ships as a glowing teal coin on pure black, so it is converted to true alpha rather
//              than generated, and the branding is pixel-exact. VERIFIED VISUALLY: it carries Kaspa's
//              BACKWARDS K (vertical stroke on the right, arms pointing left) and the alpha pipeline
//              never mirrors, so the mark is correct on screen.
//   Binance -> no reference on disk -> NO logo is invented anywhere (text-only badges + captions).
//   Neiro   -> no reference on disk -> text-only badge.
// PERSONA INSPECTION: the only image assets are the Kaspa reference (a real mark, licensed by
// reference, and the point of the beat) and the frame-0 cover art, which was viewed before use - a
// brass balance scale with two BLANK smooth coins, no real crypto logo, no text baked in, no faces.
// ⛔ THE PROTECTED PERFORMANCE PAUSE (Mike desilenced this batch at min-sil 0.95 expressly to KEEP it;
// it is the performance, not dead air, and NOTHING - no SFX and no graphic - may paper over it).
// MEASURED on THIS staged spine at 5 ms hop / 10 ms window, -50 dB:
//     13.870-14.525 s (0.655 s) the suspense pause in "because if they did, [beat] Kaspa would be
//                               listed" - the rhetorical hinge of the whole clip. The /k/ burst of
//                               "kaspa" re-onsets at 14.525 (an isolated decode of ONLY that 0.42 s
//                               voiced run returns "Casper"), which is where the caption now fires.
// The Kaspa overlay's tOut is pulled BACK to 13.86 so its 0.18 s fade-out COMPLETES 0.010 s before the
// silence starts, and the next graphic does not appear until 14.80. The pause runs 100 % graphic-free,
// and the SFX table at the bottom of this file is likewise measured DRY across it (see the proof note).
export const OVERLAYS_TUT_BKI: OverlayEv[] = [
  // "they don't apply the same logic to KASPA because if they did" (10.44-13.87) - the real Kaspa
  // mark, left of frame, over the low-value left edge of the chart.
  { src: staticFile('broll-tut-bki-ov-kaspa.png'), tIn: 12.20, tOut: 13.86, top: 130, left: 70, width: 440, blend: 'normal' },
];

// ─── Code-drawn badges (no image asset, no invented logo) ───────────────────────────────────────
// ⚠ GEOMETRY: the shared `Badge` is left:50% + translate(-50%,-50%) with no explicit width, so its
// shrink-to-fit box is capped at 540 px (1080 - left) => ~436 px of text after the 52 px side padding.
// Every line below is inside that: line1 <= 9 chars @60 px, line2 <= 6 chars @82 px, sub <= 16 chars
// @32 px (the same three line lengths the sibling clip verified on a render). `top` is the box CENTRE.
// EDITORIAL GUARD (clip-plan + tighten-plan): this criticises an EXCHANGE'S INCONSISTENCY. It never
// disparages Kaspa, and Neiro is the example that PROVES the point, never a target - so badge 2 is
// purely factual. Each badge states only what the clip itself says: Binance's blog wants
// community-driven coins, Neiro is a listed community-driven meme coin, Kaspa is still not listed.
// Nothing is imported from outside the clip. Kaspa's decentralisation argument is ARCHITECTURAL
// (node-operability, permissionless), never holder counts, so no such claim is put on screen at all -
// the clip does not make one.
export const BADGES_TUT_BKI: BadgeEv[] = [
  { tIn:  1.75, tOut:  3.45, color: '#ffe600', line1: 'BINANCE',   line2: 'SAYS',   sub: 'COMMUNITY DRIVEN', top: 430 },
  { tIn:  7.45, tOut:  9.25, color: '#ffe600', line1: 'NEIRO',     line2: 'LISTED', sub: 'A MEME COIN',      top: 430 },
  { tIn: 14.80, tOut: 16.45, color: '#ff5252', line1: 'STILL NOT', line2: 'LISTED', sub: 'ON BINANCE',       top: 640 },
];

// ─── The CODE-DRAWN catch-22 loop (no image asset at all) ───────────────────────────────────────
// Two ChatGPT generations for this beat both came back OFF-BRIEF (the shared `broll` pool chat is at
// 12/25 with 11 sibling images in it and returned a second copy of the cover's balance scale, then a
// row of coins on podiums, neither remotely the padlock-in-a-loop that was prompted; verified NOT a
// wrong-image grab - no md5 matches any sibling asset). Per Mike's directive a CODE-DRAWN graphic is
// fully compliant, so rather than burn more generations the beat is drawn in SVG in the comp: a teal
// circular arrow chasing its own tail (the catch-22 loop) with a shut red padlock in the middle.
// tOut is deliberately PAST the comp end (last frame = t 18.9667) so the 0.18 s fade-out NEVER starts:
// the clip HARD-OUTS on the punchline at full opacity, no fade, no CTA. (2026-08-10: a sibling clip
// shipped a closing card silently fading to zero over its last 5 frames because tOut equalled the comp
// end. This clip's punchline IS the ending, so that is checked explicitly on the render.)
export type LoopEv = { tIn: number; tOut: number; top: number; left: number; size: number };
export const LOOP_TUT_BKI: LoopEv = { tIn: 17.05, tOut: 19.30, top: 170, left: 590, size: 400 };

// COLLISION MATRIX (Phase 7 rule #3), every timed graphic in order:
//   thumb 0.000-0.033 | badge1 1.75-3.45 | badge2 7.45-9.25 | kaspa 12.20-13.86 | badge3 14.80-16.45 |
//   loop 17.05-19.30 (runs past the end)
// NO two windows overlap; the smallest gap is 0.60 s (badge3 -> loop) and that pair also sits in
// different vertical bands (badge3 rows ~516-764, loop rows 170-570). Nothing starts before the thumb
// frame ends, and LivestreamShort suppresses badges/overlays while the thumb is up (the SVG loop is
// gated on t >= 17.05, so it can never paint over the cover either). No watermark or logo-reveal plate
// is used, so the thumb frame carries no other graphic at all.
// The PROTECTED pause 13.870-14.525 falls in a graphic-free gap of this matrix (0.94 s wide).
// Total graphic-on-screen time = 1.70+1.80+1.66+1.65+1.97 = 8.78 s of 19.000 s = 46.2 %.

// ─── Frame-0 thumbnail (IG/TikTok cover) ────────────────────────────────────────────────────────
// ONE frame only (LivestreamShort defaults thumb.durS to 1/fps) - generated background art with the
// hook title drawn in CODE on top, never baked into the image. No em dashes.
// The art is an old brass balance scale tipped hard to one side: one pan holds a plain blank gold coin
// (accepted), the raised pan a blank glowing TEAL coin (rejected). It depicts the clip's own argument -
// a double standard - and carries no exchange mark, no coin logo and no face. Title is Mike's frozen
// 4b title; the chip is the clip's own conclusion.
export const THUMB_DEF_TUT_BKI: ThumbDef = {
  img: THUMB_TUT_BKI,
  title: 'THEY DON\'T APPLY\nTHE SAME LOGIC\nTO KASPA',
  chip: 'STILL NOT LISTED',
  chipColor: '#00e5ff',
  // 82 px, sized from the sibling clip's MEASURED figure (a chunk render put uppercase Montserrat
  // Black at ~0.708 x fontSize per character): the longest line "THEY DON'T APPLY" is 16 chars =>
  // ~929 px, inside the 968 px text box, so the cover reads as the intended three lines. Verified on
  // a frame-0 chunk render before the full render.
  titleSize: 82,
};

// ─── SFX (shared library, COPIED into render-assets/sfx/ by setup_render_assets.py --data) ──────
// 3 events, 3 distinct files. Whoosh on the frame-0 cover cut, then a riser that is CUT ON an impact
// at the payoff. Nothing is added to the library: all three files were already staged.
//
// ⚠ Cue points are each file's own measured CREST, not its file start. Envelopes re-measured on THIS
//   machine at 0.1 s RMS / 0.01 s hop (16 kHz mono) for this build (identical to the sibling's):
//     transition_rapid_whoosh crest 0.15 (dur 0.97, decay < crest-24 dB by 0.66) -
//     Tension_Rise_Logo_Reveal_3 crest 2.55 (dur 5.76) -
//     Soundjay_Impact_Main_01-short crest 0.27 (dur 0.68).
//   Each cue starts EARLY by exactly that offset so the crest lands on the frame it punctuates.
//
// ⛔ THE RISER + IMPACT GEOMETRY IS INHERITED FROM THE SIBLING'S CORRECTED TABLE - do not "improve"
//   it back to what that clip started with. On this SAME AUDIO, an inherited design put the riser's
//   peak AND the impact's crest inside the protected suspense pause; offline whisper A/B against an
//   encode-matched control proved it MASKED the payoff ("Kaspa would be listed on Binance." decoded as
//   "ASPR would be listed on buying ASPR.") and the impact measured +1.7 dB OVER the voice. The fix was
//   RETIMING AT UNCHANGED GAIN, and the same geometry is used here, translated onto this clip's own
//   measured silences (the two clips are the same audio, offset 7.560 s):
//     - the riser STARTS 0.815 s AFTER the pause ends (15.34 vs 14.525) and is CUT ON the impact crest
//       (15.34 + 1.50 = 16.84), so it swells under "listed on binance by now" and never touches the
//       pause. ⛔ IT WAS RETIMED FROM 14.59/dur 2.25 AFTER THE FIRST FULL RENDER - see the note below;
//     - the impact crest lands DEAD CENTRE of the measured 0.345 s silence 16.570-16.915 that ENDS the
//       payoff sentence, and its natural 0.68 s decay ends at 17.250 = the exact start of the NEXT
//       measured silence (17.250-17.590), so nothing is truncated and there is no truncation click.
//   VOLUME IS NEVER THE KNOB HERE: the impact keeps its full 0.26 gain.
//
// ⛔ THE JOIN WHOOSH WAS DELETED, not retimed and not turned down - do not add it back without
//   re-running the sweep. A whoosh crested on the clip's one structural join (the premise ->
//   contradiction pivot, measured picture step at 5.28, inside the 5.155-5.270 silence) is the most
//   motivated transition slot in the clip, so it was scored properly and it LOST:
//     ctl  w3 (4.80+2.6) "Binance gives the argument of"        A  "Finance gives the the argument about"
//     ctl  w12 (5.20+1.6) "Minus gives the"                     A  "Binance gives the the"
//     ctl  w4 / w13                                             A  same or better ("coins. Binance gives the")
//   TIMING was tried FIRST, twice, at unchanged 0.20 gain, and neither placement rescued it:
//     E  crest pulled back to 5.17 + tail trimmed to 0.72 s -> w3 still "Finance", w12 got WORSE
//     G  crest kept at 5.26 + tail trimmed to 0.66 s (its own -24 dB point) -> w3 still "Finance"
//   Gain was NOT tried, per the contract's rule that volume is the wrong knob (proven six times).
//   The cue is DECORATION, not a payoff hit, so the contract's remedy is DELETE - which is also
//   exactly what the sibling FULL cut decided about this same join.
//   Honest caveat, recorded because it cuts the other way: measured PRE-CODEC the whoosh sat 20.69 dB
//   UNDER the words after the join and -41.29 dB absolute in that span, i.e. below the -40 dB the
//   contract calls the floor for a "real masker", so the w3/w12 flips are plausibly decoder variance.
//   It was still dropped, because the cue was optional and the clip's whole payoff is the name of an
//   exchange being decoded correctly. WITHOUT it, all four join windows read EXACTLY as the control.
//
// ⛔ THE RISER WAS RETIMED 14.59 -> 15.34 (dur 2.25 -> 1.50) AFTER THE FIRST FULL RENDER, at UNCHANGED
//   0.09 gain. Do not lengthen it back. Caught by whisper-verifying the RENDER, exactly as the contract
//   requires: on a WHOLE-FILE medium.en decode (no window boundary anywhere near the phrase) the
//   encode-matched control read "...Casper would be listed on Binance BY NOW." and the render read
//   "...listed on Binance." - the two closing words of the payoff sentence were gone. Two of the 13
//   staggered windows agreed (14.90+2.20 read "on Binance Binance.").
//   ISOLATED, not guessed, by two offline whole-file mixes:
//     riser ONLY, no impact  -> "by now" LOST      => the riser is the masker
//     impact ONLY, no riser  -> "by now" PRESENT   => the impact at full 0.26 gain is innocent
//   TIMING was then swept (gain never touched, because volume is the wrong knob):
//     pre-faded 1 s riser at 16.17 cresting on the impact -> "by now" STILL LOST
//     long riser started 0.75 s later, cut at the same 16.84 crest -> "by now" RESTORED  <= SHIPPED
//   The fix works because the cue now plays only the first 1.50 s of the ramp under the words instead
//   of seconds 1.70-2.25 (its steepest, loudest stretch), and its truncation at 16.84 is still covered
//   by the impact, which has been ringing since 16.57. As shipped, 12 of the 13 staggered windows read
//   EXACTLY as the control and the 13th carries "catch-22." correctly.
//
// ⚠ NO DING ANYWHERE, deliberately. This clip has only four usable silences (0.000-0.145,
//   5.155-5.270, the PROTECTED 13.870-14.525, and 16.570-16.915 / 17.250-17.590); the first and
//   fourth are used, the second was just vacated on evidence and the third is untouchable. A ding on
//   an overlay reveal would therefore have to crest ON a word (a candidate at 11.87 would crest at
//   12.04, inside "the same logic"), and the sibling already set the rule for this material: a cue
//   that is DECORATION rather than a payoff hit gets DELETED rather than shoehorned.
//
// ⚠ THE PUNCHLINE IS DELIBERATELY DRY. Nothing is placed on "strange catch-22." (17.975-18.990), and
//   the impact contributes exactly -240 dB (bit-zero) across those words, measured pre-codec.
// ⛔ PROTECTED-PAUSE PROOF (pre-codec, so the AAC noise floor cannot fake it - the render's encode
//   lifts digital-zero silence by +12 to +43 dB on its own): summing this table against the bare spine
//   and measuring the SFX-only signal gives -240.00 dB across the WHOLE pause 13.870-14.525 AND across
//   its interior 13.950-14.450, with a peak absolute sample of 0. The spine's own floor there is
//   -69.02 dB / -87.32 dB. Added energy is exactly zero.
// Cue levels, pre-codec, over each cue's own span: whoosh 17.97 dB under the base, riser 8.96 dB under
// (and 20.53 dB under the payoff words it swells beneath). The impact reads 4.11 dB OVER its own span
// only because that span is the sentence-ending SILENCE it is placed in by design; it contributes
// nothing (-240 dB) to the punchline words that follow.
// Every cue was A/B'd OFFLINE (zero renders) against an encode-matched control - the bare spine pushed
// through the same 48 kHz / AAC chain as the render - on 13 short STAGGERED windows. As shipped, all 13
// read control-identical or better; the payoff line "Casper would be listed on Binance by now." and the
// punchline "catch-22" are intact on every window that contains them.
export const SFX_TUT_BKI: Sfx[] = [
  { t:  0.00, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.22, dur: 0.97 }, // frame-0 cover cut (crest 0.15), inside the measured 0.000-0.145 silence
  { t: 15.34, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_3.wav'), vol: 0.09, dur: 1.50 }, // riser STARTS 0.815 s after the protected pause ends (14.525) and swells under "listed on binance by now"; dur 1.50 CUTS IT on the impact crest at 16.84. RETIMED from 14.59/2.25, which masked "by now" (see the note above)
  { t: 16.57, src: staticFile('sfx/Impacts/Soundjay_Impact_Main_01-short.wav'), vol: 0.26, dur: 0.68 }, // PAYOFF IMPACT at full gain, crest 16.84 dead centre of the measured 0.345 s silence 16.570-16.915; cuts the riser; natural decay ends 17.250 = start of the NEXT measured silence, so no truncation click
];

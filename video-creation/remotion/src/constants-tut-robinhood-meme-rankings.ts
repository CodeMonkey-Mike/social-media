import { staticFile } from 'remotion';
import type { Sfx } from './_kit';
import type { BadgeEv, OverlayEv, ThumbDef } from './LivestreamShort';

// ─── robinhood-meme-rankings (batch: tutorial, clip #2, variant: FULL) ───────────────────────────
// "My Robinhood Chain Meme Rankings: $IF, Cooper, Tendies, Yolo" (Mike's frozen 4b title)
// Hook type: RANKED-OPINION. A named, ordered, zero-hedge list, so the visual system IS the list:
// every rank is stated on screen at the moment he states it, and the top three picks each carry
// their project's REAL art.
//
// A 6-segment SCATTER-GATHER, assembly order [0,2,1,3,4,5], two segments from ~20 minutes later:
//   seg0  master  755.01- 764.10  the hook + the #1 pick: "in my opinion, what is the best meme on
//                                 the Robinhood chain? I would, without a doubt, unequivocally, I go
//                                 for What If. What If is my, my favorite."
//   seg2  master  885.31- 900.43  WHY $IF is #1: "It's a beautiful phrase... What if this happens?
//                                 Everybody does... So that's beautiful." (zero cuts)
//   seg1  master  871.49- 884.80  COOPER #2, the protected triple (one removal, a hesitation stall)
//   seg3  master  908.00- 948.63  the Toshi/Brian-Armstrong colour, the Robinhood HQ line, and
//                                 TENDIES #3 (four removals: the stuttered determiner, a rambling
//                                 aside, the abandoned restart, a drawled stall)
//   seg4  master 2126.29-2141.75  YOLO #4, zero cuts
//   seg5  master 2156.87-2160.89  SWAPPY #5, the list-completing HARD OUT, zero cuts
//
// ⛔ SIBLINGS: seven other clips of this batch share this batch's public dir. Everything this clip
// owns is `broll-tut-rhm-*` / `thumb-tutrhm.png`. NEVER read or write `broll-tut94x-*` /
// `thumb-tut94x-*` (clip 1), `broll-tut-bkc-ov-*` / `thumb-tutbkc.png` (clip 3), `broll-tut6-*` /
// `tail-tut6-hold.png` / `thumb-tut6.png` (clip 6).
//
// Base clip: robinhood-meme-rankings-final.mp4 (4b cut -> Phase 5 tighten -> 5B desilence at
// min-sil 0.95 -> 5C). ALREADY composited vertical (screen-share on top, webcam below),
// 1080x1920 @ 25 fps, 79.44 s video / 79.463 s audio. FINAL: do NOT re-cut, do NOT re-encode, do NOT
// re-split the zones. The comp runs at 30 fps; OffthreadVideo resamples the 25 fps source by TIME, so
// every cue below is plain clip-relative seconds.
//
// ⚠ The file referenced here is the render-assets COPY, re-encoded to a SEEK-FRIENDLY GOP by
//   `python video-creation/livestream-repurpose/scripts/setup_render_assets.py tutorial`.
//   Mandatory since the 2026-08-05 finding that concurrent OffthreadVideo seeks die on a long-GOP
//   source. The canonical spine in the clip folder is never touched.
//
// Render (public-dir = the BATCH render-assets/, shared with clips 1/3/4/5/6/7/8):
//   npx remotion render src/index.ts TutRobinhoodMemeRankings \
//     out/tutorial/2-robinhood-meme-rankings.mp4 \
//     --public-dir "<repo>/video-creation/shorts/tutorial/render-assets"

export const TUT_RHM_FPS = 30;
// 2383 frames = 79.4333 s; last frame index 2382 = t 79.400 s, which maps to source frame 1974 (the
// LAST of the spine's 1975 frames) and leaves 0.24 s of tail after "five" releases at 79.160. The
// Swappy hard-out is therefore complete, with nothing truncated.
export const TUT_RHM_DURATION = 2383;

export const CLIP_TUT_RHM  = staticFile('robinhood-meme-rankings.mp4');
export const THUMB_TUT_RHM = staticFile('thumb-tutrhm.png');

// Layout geometry, MEASURED on THIS clip (row-mean gradient scan at t = 0.5/5/12/20/28/36/45/52/60/
// 68/75/79 s; ALL TWELVE frames put the hard screen-share/webcam divider on row 854, delta 150-195).
export const TUT_RHM_SEAM  = 854; // content zone = 0..854; webcam below
export const TUT_RHM_CAP_Y = 906; // caption centre: 52 px under the seam, on his hair

// ─── ⛔ MIKE'S PHASE 7 VISUAL DIRECTIVE, WHOLE BATCH (2026-08-09, verbatim) ──────────────────────
// "i only do not want full screen broll, nor content zone broll. you can do captions, sfx, and any
//  overlaying graphics or images with background transparency."
// ALLOWED: captions, SFX, code-drawn graphics, image overlays WITH REAL BACKGROUND TRANSPARENCY.
// BANNED: full-screen b-roll and content-zone b-roll, i.e. ANY asset that covers the frame or fills
// the content zone. The test is COVERAGE, not the asset's source.
//
// Consequence, stated plainly instead of hidden: there is NO `BrollEv` array on this clip. Generated
// b-roll coverage is 0 %, base-showing 100 %, and there is no full-screen image at the hook. That is
// DELIBERATELY outside the finalized-short SKILL's ~25-35 % coverage band and outside its
// "full-screen at the hook / 1-3x" item, on Mike's own batch-level instruction, and it is reported as
// a flagged DEVIATION in the build report. Do not restore b-roll coverage from this file.
// Every image asset here is a TRUE-ALPHA RGBA PNG (39-44 % of each PNG is fully transparent for the
// two on-black arts, 19-31 % for the two keyed marks) and every other graphic is code-drawn; each
// occupies 12-21 % of the content zone and none of them fills it.
//
// WHAT THE BASE SHOWS, measured at 8 fps on the staged spine (mean|delta| of the DEXScreener art
// panel, crop=220:170:860:30 - the whole-zone scan is useless here because these pages are
// structurally near-identical, median delta 0.018):
//   0.000  CoinMarketCap $TUT page, with a live-chat banner burned in at rows ~730-780 reading
//          "In your opinion, what is the best meme coin on the Robinhood chain" - literally the
//          question this clip answers, so overlays before 9.125 stay ABOVE row 700
//   9.125  (delta  24.4) X / COOPER profile, "Meet Cooper: Robinhood's loyal office dog"
//  24.250  (delta  85.5) DEXScreener COOPER/WETH (its right rail already carries the real Cooper art)
//  31.875  (delta 254.7) BLACK - a page loading; a DEAD screen for 2.50 s
//  34.375  (delta 255.0) back to a near-WHITE X page
//  41.250  (delta  85.8) DEXScreener COOPER/WETH again
//  45.375  (delta  37.4) DEXScreener TENDIES/WETH - the page flips 0.9 s BEFORE he names Tendies
//  63.750  (delta  35.6) DEXScreener YOLO/WETH - 0.2 s before he says "Yolo"
// Full-frame luma scan of all 1975 frames: min YAVG 55.68 at t 32.760, tail frame t 79.400 at 113.8.
// ZERO baked-black frames at the tail or at any of the five internal joins (clips 1 and 6 of this
// batch both had the picture dying before the audio; this clip does not).
//
// staticFile() calls are LITERAL strings on purpose - the finalized-short gate scans for literal refs.

// ─── Transparent overlays (real RGBA PNGs) ──────────────────────────────────────────────────────
// `blend: 'normal'` on every one: the CMC page and the X pages are near-WHITE in places and a screen
// blend cannot darken white, so a screen-blended overlay would vanish there.
//
// REFERENCE-IMAGE GATE, run LIVE 2026-08-10 against schedule-tweets/images/reference/. Named
// projects/people in this clip: What If ($IF), Cooper, Tendies, Yolo, Swappy, Toshi, Brian Armstrong,
// Robinhood, Fartcoin.
//   what-if.jpg EXISTS -> beat 1     cooper.jpg EXISTS -> beat 2
//   tendies.jpg EXISTS -> beat 4     toshi.png  EXISTS -> beat 3
//   Yolo / Swappy / Robinhood / Fartcoin / Brian Armstrong -> NO reference on disk, so no logo,
//   mascot or face is invented for any of them; they are text-only beats (and Yolo's real art is
//   already in the base from 63.750).
// ⛔ ALL FOUR references are used DIRECTLY, not imitated: `robinhood-meme-rankings/_make_alpha_overlays.py`
// converts each to a true RGBA PNG (alpha-from-luminance for the two on-black arts, edge-connected
// flood colour-keying for the two flat-background marks). That is the strongest form of the gate -
// the branding is pixel-exact and cannot drift. It matters specifically here: **Cooper is a BLACK
// LAB**, and a previous batch generated a GOLDEN RETRIEVER for him and Mike caught it. Nothing is
// generated, so the breed cannot be wrong. The ONLY generated asset on this clip is the frame-0 cover
// background.
// PERSONA INSPECTION (all four PNGs viewed over a checkerboard AND over white before rendering): the
// $IF figure is faceless (seen from behind), no real-person face appears anywhere, and no text is
// baked into any asset. The three project marks are present DELIBERATELY, via the reference gate.
// The Tendies crop excludes the reference's furniture MECHANICALLY - the "TENDIES" wordmark, the
// blond suit figure, the candlestick chart and the rocket are all outside the crop, and the wordmark's
// neon brush stroke, which physically overlaps the platter's bounding box, is alpha-zeroed by a
// measured colour test (see that script's kill_neon_green()).
export const OVERLAYS_TUT_RHM: OverlayEv[] = [
  // #1 PICK. "I would, without a doubt, unequivocally, I go for What If" (3.38-7.38) - the real $IF
  // art. Placed LEFT and above row 700 so the burned-in live-chat question stays readable.
  { src: staticFile('broll-tut-rhm-ov-if.png'),      tIn:  4.10, tOut:  7.20, top: 130, left: 100, width: 430, blend: 'normal' },
  // #2 PICK's verdict. "And that is why it's my second favorite meme." (31.04-33.58) - the real
  // Cooper mark lands ON the dead black screen (31.875-34.375), the best slot in the clip.
  { src: staticFile('broll-tut-rhm-ov-cooper.png'),  tIn: 31.90, tOut: 34.30, top: 170, left: 320, width: 440, blend: 'normal' },
  // "it gives me that Toshi vibe, being the cat of Brian Armstrong" (36.80-40.02) - the real Toshi
  // mark, RIGHT of the X page's own Cooper photo.
  { src: staticFile('broll-tut-rhm-ov-toshi.png'),   tIn: 37.40, tOut: 39.90, top: 150, left: 620, width: 370, blend: 'normal' },
  // #3 PICK's pitch. "it's a very funny and stupid concept" (48.50-51.94) - the real Tendies frog and
  // platter. tOut 50.70 so the 0.18 s fade completes before the 50.800-51.325 hesitation beat.
  { src: staticFile('broll-tut-rhm-ov-tendies.png'), tIn: 47.95, tOut: 50.70, top: 150, left: 110, width: 420, blend: 'normal' },
];

// ─── Code-drawn badges (no image asset, no invented logo) ───────────────────────────────────────
// ⚠ GEOMETRY: the shared `Badge` is left:50% + translate(-50%,-50%) with no explicit width, so its
// shrink-to-fit box is capped at 540 px (1080 - left) => ~436 px of text after the 52 px side
// padding. Every line below is inside that: line1 <= 10 chars @60 px, line2 <= 7 chars @82 px,
// sub <= 16 chars @32 px + 0.12em tracking. `top` is the box CENTRE, and a line1+line2+sub badge is
// ~254 px tall, so top <= 700 keeps the box above the seam (854) and clear of the caption band
// (rows ~855-955).
// THE RANKED LIST IS THE SYSTEM: NUMBER 1..5 land exactly where he states each rank, coloured
// alternately neon-GREEN and YELLOW - the Robinhood-chain brand pair. ⛔ TEAL is used NOWHERE on this
// clip (it reads as Kaspa; standing rule for Robinhood-chain beats).
// Every string is his own claim. "$IF" honours the persona hard rule that the What If ticker is $IF,
// never $WHATIF, and "POTENTIAL LISTING" keeps his hedge instead of asserting a listing as fact.
export const BADGES_TUT_RHM: BadgeEv[] = [
  { tIn: 10.30, tOut: 12.30, color: '#39ff14', line1: 'NUMBER 1',   line2: '$IF',     sub: 'A CONCEPT',        top: 430 },
  { tIn: 13.20, tOut: 15.60, color: '#39ff14', line1: 'NOBODY',     line2: 'THOUGHT', sub: 'OF IT BEFORE',     top: 680 },
  { tIn: 19.95, tOut: 21.95, color: '#ffe600', line1: 'WHAT IF',    line2: 'THIS?',   sub: 'WHAT IF THAT?',    top: 430 },
  { tIn: 25.60, tOut: 27.80, color: '#39ff14', line1: 'NUMBER 2',   line2: 'COOPER',  sub: 'A REAL DOG',       top: 430 },
  { tIn: 41.70, tOut: 43.90, color: '#39ff14', line1: 'THE OFFICE', line2: 'DOG',     sub: 'AT ROBINHOOD HQ',  top: 680 },
  { tIn: 55.50, tOut: 57.50, color: '#39ff14', line1: 'POTENTIAL',  line2: 'LISTING', sub: 'ON ROBINHOOD',     top: 680 },
  { tIn: 60.75, tOut: 62.80, color: '#ffe600', line1: 'NUMBER 3',   line2: 'TENDIES', sub: 'FUNNY AND STUPID', top: 430 },
  { tIn: 68.95, tOut: 70.10, color: '#39ff14', line1: 'IT PUMPED',  line2: 'HARD',                             top: 700 },
  { tIn: 75.60, tOut: 77.60, color: '#ffe600', line1: 'NUMBER 4',   line2: 'YOLO',    sub: 'HELD ITS LEVEL',   top: 430 },
  // ⛔ tOut is deliberately PAST the comp end (last frame = t 79.400 s) so the 0.18 s fade-out never
  // starts: the clip HARD-OUTS on the closing rank at FULL opacity, no fade, no CTA. Caught on a
  // frame-2382 still, where a tOut of 79.40 had the #5 card fading to zero across the last 5 frames -
  // i.e. the list-completing punchline vanished exactly as the video ended.
  { tIn: 77.90, tOut: 80.20, color: '#39ff14', line1: 'NUMBER 5',   line2: 'SWAPPY',  sub: 'MAYBE',            top: 700 },
];

// COLLISION MATRIX (Phase 7 rule #3), every timed graphic in order:
//   thumb 0.000-0.033 | $IF 4.10-7.20 | b1 10.30-12.30 @430 | b2 13.20-15.60 @680 |
//   b3 19.95-21.95 @430 | b4 25.60-27.80 @430 | COOPER 31.90-34.30 | TOSHI 37.40-39.90 |
//   b5 41.70-43.90 @680 | TENDIES 47.95-50.70 | b6 55.50-57.50 @680 | b7 60.75-62.80 @430 |
//   b8 68.95-70.10 @700 | b9 75.60-77.60 @430 | b10 77.90-80.20 @700 (tOut past the comp end)
// NO two windows overlap. The smallest gap is 0.30 s (b9 -> b10) and those two also sit in DIFFERENT
// vertical bands (rows ~303-557 vs ~596-804), so even the Badges component's +/-0.1 s draw tolerance
// cannot collide them. Every other gap is >= 0.80 s. Nothing starts before the thumb frame ends, and
// LivestreamShort suppresses badges/overlays while the thumb is up anyway. No watermark and no
// logo-reveal plate are used, so the thumb frame carries no other graphic at all.
//
// ⛔ PROTECTED PERFORMANCE BEATS (Mike desilenced this batch at min-sil 0.95 expressly to KEEP them).
// Re-measured on THIS staged spine at 5 ms hop / 10 ms window, and every one falls in a graphic-free
// gap of the matrix above:
//   27.845-28.485 (0.640 s) THE DRAWLED "of" inside the Cooper triple. "office dog" releases at
//                 27.845 and "of Robinhood" re-onsets at 28.485. The shipped word JSON glues the
//                 pause INSIDE the token ('of' 27.98-28.84), which would have captioned the word
//                 0.50 s EARLY, on the beat itself; _patch_words.py re-onsets it to 28.485.
//                 Badge b4 ends 27.80, 45 ms before the pause, and no SFX exists between 25.07 and
//                 45.35. MEASURED added SFX energy in the span: -74.8 dB = zero.
//   30.175-31.035 (0.860 s) the beat after the THIRD limb, before "And that is why..."  (-72.7 dB)
//   22.115-23.285 (1.170 s) the beat after the anaphora chain, before "So that's beautiful." (-84.5 dB)
//   66.795-67.740 (0.945 s) "look what it's doing right here. [beat] It went up and pumped" (-113.1 dB)
//   70.180-71.060 (0.880 s) "it pumped hard over here. [beat] And then it's really maintaining"
//                 Badge b8 ends 70.10.  (-124.0 dB)
// The three protected PEAKS the tighten pass verified: clip 0.42-9.07 (hook, SFX -58.5 dB vs voice
// -19.9), 24.53-30.39 (Cooper triple, -56.8 vs -21.0), 48.50-59.955 ("funny and stupid" -> app
// listing -> fartcoin).

// ─── Frame-0 thumbnail (IG/TikTok cover) ────────────────────────────────────────────────────────
// ONE frame only (LivestreamShort defaults thumb.durS to 1/fps) - generated background art with the
// hook title drawn in CODE on top, never baked into the image. No em dashes.
// The art is a five-step neon-green podium with five BLANK featureless coin discs: the clip's own
// structure. Persona-inspected - no text, no lettering, no logo, no crypto symbol, no face, and every
// disc is smooth and unengraved. The title is an open loop off Mike's 4b title and the chip is his own
// words ("without a doubt").
export const THUMB_DEF_TUT_RHM: ThumbDef = {
  img: THUMB_TUT_RHM,
  title: 'MY ROBINHOOD\nMEME RANKINGS\nNUMBER 1 IS\nNOT EVEN CLOSE',
  chip: 'WITHOUT A DOUBT',
  chipColor: '#39ff14',
  // 88 px, sized from clip 3's MEASUREMENT of the same component (uppercase Montserrat Black runs
  // ~68 px per character at 96 px, i.e. ~0.708em). The longest line here is "NOT EVEN CLOSE"
  // (14 chars) => 14 x 62 = ~868 px, inside the 968 px text box, so the cover reads as the intended
  // four lines with no orphaned word. Verified on a frame-0 still before the full render.
  titleSize: 88,
};

// ─── SFX (shared library, copied into render-assets/sfx/) ───────────────────────────────────────
// 9 events, 3 distinct files: a whoosh on the frame-0 cover cut and on all FIVE measured picture
// cuts, a DING on the #1 rank reveal and on the Tendies overlay pop, and one payoff IMPACT.
//
// ⚠ Cue points are each file's own measured CREST, not its file start. Envelopes re-measured on THIS
//   machine at 0.1 s RMS / 0.01 s hop (16 kHz mono) for this build:
//     transition_rapid_whoosh crest 0.15 (dur 0.97, body ends 0.60)
//     DING-093                crest 0.17 (dur 0.93, 0.12 s fade-out, body ends 0.79)
//     Impact_Hit_01-2-short   crest 0.09 (dur 0.55, body ends 0.44)
//   Each cue starts EARLY by exactly that offset so the crest lands on the frame it punctuates.
//
// ⚠ EVERY `dur` BELOW IS THE FILE'S OWN FULL LENGTH, so nothing is truncated. Batch finding
//   (clips 1 and 6, independently): a `dur` window TRUNCATES, it does not fade - clip 6 measured its
//   truncation click at -2.3 dB, LOUDER than the speech 0.25 s later. The faded/short library variants
//   (DING-093.wav, Impact_Hit_01-2-short.wav) are used instead, at unchanged gain.
//
// ⚠ PICTURE CUTS VERIFIED, not assumed: see the 8 fps art-panel scan in the header. All five whoosh
//   crests sit inside a MEASURED silence: 9.065-9.600 (0.535 s), 24.195-24.480, 45.350-45.805,
//   63.745-63.960, 75.155-75.455.
//
// ⛔ THE RISER WAS DELETED, not retimed and not turned down. The plan called for
//   risers/Tension_Rise_Logo_Reveal_3-1s.wav building into the payoff impact. Offline whisper A/B
//   against an ENCODE-MATCHED control (the bare spine through the same 48 kHz/AAC chain) on short
//   staggered windows, zero renders:
//     riser 59.43 (crest on the impact): 0/3 windows matched control. "just like far far coin that"
//                 -> "just like fart- fart boring." / "just like fart fart going" / EMPTY.
//     riser 58.00 (ends BEFORE "fart coin" onsets at 59.02): still 3/6, still losing the token
//                 ("parkouring. that'll be my number three." -> "that'll be NOT my number three").
//     same placement at vol 0.09 -> 0.06: IDENTICAL failure, i.e. volume is not the knob (the fourth
//                 time that has been confirmed in this pipeline).
//   It could not be saved by TIMING and it is DECORATION rather than the payoff hit, so per the
//   contract it is DELETED. Do not re-add it. The impact keeps its full 0.26 gain and, with the riser
//   removed, scores 5/6 windows control-identical; the one residual DIFF is the mix HALLUCINATING an
//   extra word ("that'll be MY number three"), not losing one, and the impact's body ends at 60.60,
//   30 ms BEFORE "That'll" onsets at 60.630, so it never overlaps a word at all.
//
// ⚠ MEASURED added-SFX energy (sample-wise difference of the final mix against the encode-matched
//   control), for every word a cue sits near: cooper -53.2 dB vs voice -18.2 (35.0 dB under),
//   tendies -52.8 vs -18.1 (34.6 under), yolo -44.4 vs -20.6 (23.8 under), fartcoin -71.3 vs -23.1
//   (48.2 under), "but i think" -47.8 vs -20.0 (27.8 under). The tightest is the cut-1 whoosh tail
//   over "what if is a concept": -37.5 dB vs voice -18.6, i.e. 18.9 dB under, inside the 8-18 dB band
//   this pipeline has accepted before, and its words come back intact on three of the four staggered
//   windows (the fourth is the documented window-boundary artifact - the same window regresses
//   identically at a 0.10 s earlier crest, so it is not a timing problem).
//
// ⚠ DELIBERATELY DRY: the 31.875 cut to black and the 34.375 cut back (both mid-speech - a whoosh
//   there would sit on "it's my second favorite meme"); the 41.250 cut (it lands ON the word "dog");
//   and THE HARD OUT (nothing on "number five" - the abrupt no-CTA ending is the watch-time strategy,
//   and a stinger crested in the closing 0.240 s would be truncated by the comp end and click).
export const SFX_TUT_RHM: Sfx[] = [
  { t:  0.00, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.22, dur: 0.97 }, // frame-0 cover cut (crest 0.15), inside the 0.000-0.405 TRUE digital silence
  { t:  9.10, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.20, dur: 0.97 }, // MEASURED cut #1 CMC $TUT -> X/Cooper (crest 9.25) inside the 9.065-9.600 window
  { t: 10.13, src: staticFile('sfx/DING-093.wav'),                vol: 0.18, dur: 0.93 }, // NUMBER 1 / $IF badge pop (crest 10.30)
  { t: 24.10, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.20, dur: 0.97 }, // MEASURED cut #2 X -> DEXScreener COOPER (crest 24.25) inside the 24.195-24.480 silence
  { t: 45.35, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.20, dur: 0.97 }, // MEASURED cut #3 COOPER -> TENDIES (crest 45.50) inside the 45.350-45.805 silence
  { t: 47.78, src: staticFile('sfx/DING-093.wav'),                vol: 0.18, dur: 0.93 }, // TENDIES overlay pop (crest 47.95) inside the 47.630-48.485 window
  { t: 60.16, src: staticFile('sfx/Impacts/Impact_Hit_01-2-short.wav'), vol: 0.26, dur: 0.55 }, // PAYOFF IMPACT after "fartcoin" (crest 60.25); decay ends 60.60, 30 ms before "That'll"
  { t: 63.65, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.20, dur: 0.97 }, // MEASURED cut #4 TENDIES -> YOLO (crest 63.80) inside the 63.745-63.960 silence
  { t: 75.15, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.18, dur: 0.97 }, // MEASURED cut #5, the last scatter-gather join (crest 75.30) inside the 75.155-75.455 silence
];

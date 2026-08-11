import { staticFile } from 'remotion';
import type { BrollEv, Sfx } from './_kit';
import type { BadgeEv, OverlayEv, ThumbDef } from './LivestreamShort';

// ─── meme-fud-130x (batch: last-year, clip #1, variant: full) ───────────────────────────────────
// "They Called These Coins Dead. We're at a 130X."
// The stream's spine: named influencer FUD (Toshi, Peanut, Pengu "not gonna pump") against Mike's
// receipts - the public 94x $TUT call now officially at 130x, Velvet at a 58x from two months ago,
// open interest flying and shorts getting liquidated. Ends on the comment-bait question, "what meme
// coin is gonna replace Toshi now?", which IS the ending: nothing is placed over or after it.
//
// Base clip: meme-fud-130x-final.mp4 (raw cut -> Phase 5 tighten -> 5B desilence at min-sil 0.25 ->
// 5C filler pass, which was a PASSTHROUGH for this clip: 0 cuts, so -final == -tightened-desilenced).
// ALREADY composited vertical (screen-share on top, webcam below), 1080x1920 @ 25 fps, 86.337 s.
// FINAL, do NOT re-cut and do NOT re-split the zones. The comp runs at 30 fps; OffthreadVideo
// resamples the 25 fps source by TIME, so every cue below is plain seconds taken from the clip's own
// Whisper word timings (clip-relative, 0-based).
//
// ⚠ The file referenced here is the render-assets COPY, re-encoded to a SEEK-FRIENDLY GOP
//   (-g 25 -keyint_min 25 -bf 0 -sc_threshold 0) by
//   `python video-creation/livestream-repurpose/scripts/setup_render_assets.py last-year`.
//   VERIFIED on this copy for THIS build: keyframes at 0.000 / 1.000 / 2.000 / 3.000 ... (1.0 s GOP),
//   and its audio stream MD5 (837bf6500620793a70ee0d693973fb04) is byte-identical to the clip
//   folder's own -final.mp4 and DIFFERENT from all three sibling clips in this batch, i.e. this comp
//   provably references its OWN spine. The canonical spine in the clip folder is never touched.
//
// Render (public-dir = the BATCH render-assets/, shared with clips 2/3/4; every file this clip owns
// is `*-mfx-*` / `thumb-mfx` prefixed so the parallel builders cannot collide):
//   npx remotion render src/index.ts LastYearMemeFud130x \
//     out/last-year/1-meme-fud-130x.mp4 \
//     --public-dir "<repo>/video-creation/shorts/last-year/render-assets"

export const MFX_FPS = 30;
export const MFX_DURATION = 2590; // 86.337 s @30; last frame index 2589 = t 86.300 s, inside the clip

export const CLIP_MFX  = staticFile('meme-fud-130x.mp4');
export const THUMB_MFX = staticFile('thumb-mfx.png');

// Layout geometry, MEASURED on this clip (row-mean gradient scan at
// t = 1/6/12/18/24/30/38/45/52/60/68/75/82/85 s; 13 of those 14 frames put the hard
// screen-share/webcam divider on row 853, delta 11-215. The 14th, t=45, is a low-contrast frame
// with no hard edge anywhere and is the only outlier).
export const MFX_SEAM  = 853; // content zone = 0..853 (rain.trade bubbles -> Coinglass -> DEXScreener)
export const MFX_CAP_Y = 900; // caption centre: 47 px under the seam, on his hair; his eyes sit ~1180-1230

// ⛔ NOT TEAL. Teal (#00e5ff) is Kaspa's colour and this clip has nothing to do with Kaspa - a teal
// divider under a Toshi/meme-coin short misreads as a Kaspa short (the exact failure the early-crash
// Robinhood clips documented). Base blue is the on-message accent here: Toshi is "the face of Base",
// and it is the SAME colour the captions give the coin names (the <b> tag, #3aa0ff), so the divider
// and the caption accents agree.
export const MFX_BLUE = '#3aa0ff';

// ─── B-roll beats (authored in BROLL-PLAN.md BEFORE generation) ────────────────────────────────
//
// COVERAGE: 25.30 s of 86.337 s = 29.3 % b-roll / 70.7 % BASE SHOWING - inside the SKILL's halved
// band (~25-35 % b-roll). 8 distinct images, zero reuse inside the clip. TWO full-screens (the hook
// and the closing pivot) = inside the FIRM 1-3 cap.
//
// The base earns its two long stretches: the content zone here is a LIVE receipt that Mike is
// pointing AT. 11.20-29.70 is the rain.trade bubble map with a giant "TUT +950 %" bubble on screen
// while he calls the 94x and the 130x (covering it would hide the proof), and 47.90-66.20 is the
// Coinglass $TUT liquidation page while he reads the open interest and the liquidations off it.
// Both are carried by non-blanketing elements instead: 2 code badges, 1 alpha overlay, and SFX.
//
// B3 -> B4 are EXACTLY butted (32.10) so BrollLayer HARD-CUTS with zero base frames between, and
// that cut lands inside the MEASURED 31.78-32.12 s silence. Every other join leaves >= 2.40 s of
// base (the SKILL's minimum is 1.5 s), so no sub-1 s base flash exists anywhere and the two
// full-screens are 69.75 s apart.
//
// staticFile() calls are LITERAL strings on purpose - the finalized-short gate scans for literal refs.
export const BROLL_MFX: BrollEv[] = [
  // BASE 0.00-0.90 - the frame-0 thumb is ONE frame; the video opens on Mike + the live bubble map
  { src: staticFile('broll-mfx-hook-graveyard.png'),  tIn:  0.90, tOut:  4.20, mode: 'full'    }, // HOOK: "people are talking a lot of smack about some of these coins that came out like 2024, 2025" (0.00-5.84)
  // BASE 4.20-7.40 - "they're not gonna pump" plays over the bubble map, which is the counter-evidence
  { src: staticFile('broll-mfx-named-dead.png'),      tIn:  7.40, tOut: 11.20, mode: 'content' }, // the NAMED list: "toshi and peanut and like you name it and pengu" (7.32-11.22). Toshi from the reference; Peanut/Pengu have NO reference on disk, so their coins are BLANK
  // ⛔ BASE 11.20-29.70 (18.50 s) - the whole 94x -> 130x receipt run, DELIBERATELY barren.
  // He is pointing at the live TUT bubble. Carried by badges 1 + 2 and the peak impact.
  { src: staticFile('broll-mfx-toshi-ignite.png'),    tIn: 29.70, tOut: 32.10, mode: 'content' }, // "what if toshi is gonna pump?" (30.08-31.78)
  { src: staticFile('broll-mfx-swarm-liftoff.png'),   tIn: 32.10, tOut: 35.00, mode: 'content' }, // "what if pengu is gonna pump? what if all these others are gonna pump?" (32.12-34.98) - EXACTLY butted to the previous beat, hard cut inside the 31.78-32.12 silence. Pengu is LOGO-FREE (no reference exists): blank tokens only
  // BASE 35.00-37.40 - "now I know some of them are dead" lands on his face
  { src: staticFile('broll-mfx-devs-ghost.png'),      tIn: 37.40, tOut: 40.90, mode: 'content' }, // "died out in the bear market, the devs are like: ah, hell with this... they jump ship" (37.36-41.74)
  // BASE 40.90-45.20 (4.30 s) - "look at here VELVET, velvet is pumping too, right?" His cursor is
  // ON the VELVET bubble here (measured at t=45): do NOT cover his own pointing.
  { src: staticFile('broll-mfx-velvet-58x.png'),      tIn: 45.20, tOut: 47.90, mode: 'content' }, // "this is my 58x-er from just two months ago" (44.28-46.86) - generated WITH schedule-tweets/images/reference/velvet.png
  // ⛔ BASE 47.90-66.20 (18.30 s) - the Coinglass $TUT liquidation page: open interest, volume,
  // "people are shorting like crazy and people getting liquidated". Carried by the alpha overlay.
  { src: staticFile('broll-mfx-influencer-fud.png'),  tIn: 66.20, tOut: 69.80, mode: 'content' }, // "every single influencer spreading FUD about meme coins and some alts" (65.90-70.96)
  // BASE 69.80-73.95 - "just from last year, just from last year" (the kept persona doubling)
  { src: staticFile('broll-mfx-toshi-vs-fud.png'),    tIn: 73.95, tOut: 77.05, mode: 'full'    }, // CLIMAX/PIVOT: "what the hell. so if you're spreading FUD about toshi?" (74.02-77.02). Its cut lands inside the 73.46-74.02 silence and it ends on the last frame of "toshi?"
  // ⛔ BASE 77.05-86.337 (9.29 s) - "what is going to replace Toshi... what meme coin is gonna
  // replace Toshi NOW?" The question IS the ending: no b-roll, no badge, no overlay and no SFX sit
  // on it, and there is no CTA. That abruptness is the watch-time strategy, not an omission.
];

// ─── Transparent overlay (real alpha PNG) ───────────────────────────────────────────────────────
// The ONE image-based element allowed inside the second barren stretch, and the alpha PNG the SKILL
// requires per clip. Generated glow-on-black and converted to TRUE alpha (alpha = boosted luminance,
// per SKILL "Transparent overlays"), so it composites over the live page without a box.
// `blend: 'normal'` is MANDATORY here: the screen-share underneath is a WHITE Coinglass page, and a
// screen-blend cannot darken white, so a screen-blended overlay would vanish completely.
// Placement x 220-650, y 130-560 sits in the page's EMPTY plot area (measured at t=59: mean
// luminance 249, std 1 across that block), clear of the Coinglass tooltip (x > 650), of the seam
// (row 853) and of the caption band (centre 900). It sits on "people are shorting like crazy and
// people getting liquidated" and ends 5.30 s before the next b-roll beat, so nothing co-occurs.
export const OVERLAYS_MFX: OverlayEv[] = [
  { src: staticFile('broll-mfx-ov-liquidation.png'), tIn: 58.45, tOut: 61.00, top: 130, left: 220, width: 430, blend: 'normal' },
];

// ─── Code-drawn badges ──────────────────────────────────────────────────────────────────────────
// Both sit inside the FIRST barren stretch (the bubble-map receipt run) and are 1.90 s apart, so
// they can never co-occur; neither overlaps the alpha overlay (58.30) or any b-roll beat, and both
// start long after the 1-frame thumb (LivestreamShort also suppresses badges while the thumb is up).
//
// ⚠ GEOMETRY: the shared `Badge` is `left: 50%` with `translate(-50%,-50%)` and no explicit width, so
// the shrink-to-fit box caps at 540 px (~436 px of text after the 52 px side padding). Every line is
// kept short enough NOT to wrap: line1 <= 10 chars @60 px, line2 <= 8 chars @82 px, sub <= 19 chars
// @32 px. `top` is the box CENTRE, so a ~250 px tall badge at top 620 spans rows ~495-745: inside the
// bubble map but well above the seam (853) and the caption band (900).
export const BADGES_MFX: BadgeEv[] = [
  { tIn: 17.60, tOut: 20.40, color: '#ff9f1c', line1: '94X CALL', line2: '$TUT', sub: 'ON BNB, LAST SEPT', top: 620 },
  { tIn: 22.30, tOut: 25.60, color: '#39ff14', line1: 'NOW AT',   line2: '130X', sub: 'FROM THE 94X CALL', top: 620 },
];

// ─── Frame-0 thumbnail (IG/TikTok cover) ────────────────────────────────────────────────────────
// ONE frame only (LivestreamShort defaults thumb.durS to 1/fps) - generated background art with the
// hook title drawn in CODE on top, never baked into the image. No em dashes. The art was generated
// WITH schedule-tweets/images/reference/TUT-tutorial.jpg, so the one coin blazing out of the dead
// field carries the REAL $TUT mark (the reference gate for the clip's headline project).
export const THUMB_DEF_MFX: ThumbDef = {
  img: THUMB_MFX,
  title: 'THEY CALLED\nTHESE COINS\nDEAD',
  chip: "WE'RE AT A 130X",
  chipColor: '#39ff14',
  titleSize: 112, // longest line "THESE COINS" (11 chars) stays inside the 968 px text box
};

// ─── SFX (shared library, COPIED into render-assets/sfx/; every event stays under the VO) ───────
// Whoosh on the frame-0 cover cut and on the full-screen cuts, a ding on the 130X badge reveal, a
// receipt ting after the 58x, impacts on the two payoffs, and ONE riser that builds into the closing
// full-screen. NOTHING is placed on the closing question: "what meme coin is gonna replace Toshi
// now?" ends clean and abrupt on purpose.
//
// ⚠ Cue points are each file's own measured CREST, not its file start. Envelopes measured on THIS
//   machine at 0.10 s RMS / 0.05 s hop for this build:
//     transition_rapid_whoosh  crest 0.15 (peak -17.4 dB)   Cinematic Whoosh 02  crest 0.80 (-14.2)
//     DING                     crest 0.15 (-15.8)           TING SOUND EFFECT    crest 0.80 (-14.2)
//     Kick_Impact_01-short     crest 0.15 (-6.0)            Impact_Hit_01-2-short crest 0.10 (-11.6)
//     Boom - Big Reveal-short  crest 0.05 (-5.4)            Tension_Rise_Logo_Reveal_3 attack 0.90,
//                                                             crest 2.55 (a -12 dB PLATEAU, not a ramp)
//   Each cue starts EARLY by exactly that offset so the crest lands on the frame it punctuates.
//
// ⚠ FIVE of the eleven cues are deliberately anchored INSIDE a measured silence in the VO, which is
//   why this build needed no volume rescue on them: 21.88-22.48 (the ding), 27.96-28.24 (the peak
//   impact), 31.78-32.12 (the hard-cut whoosh), 47.60-47.80 (the receipt ting) and 73.46-74.02 (the
//   climax boom + the end of the riser). Timing beats gain - that is the SKILL's masking doctrine.
//
// ⚠ THE RISER IS TRIMMED, NOT TURNED DOWN. Tension_Rise_Logo_Reveal_3 is not a smooth ramp: it jumps
//   to a -12 dB plateau at 1.90 s and holds it (measured, and the same finding early-crash logged).
//   Played from 72.20 with dur 1.75 it stops at 73.95, so ONLY the quiet pre-plateau ramp
//   (-42 -> -17 dB) is ever heard, it ends EXACTLY on the climax cut, and it keeps its full gain.
//
// ⛔ THREE CUES WERE FIXED OR DELETED BY THE OFFLINE A/B, BEFORE ANY RENDER. Every candidate was
//   mixed onto the bare spine, pushed through the SAME 48 kHz AAC chain as the render, and scored on
//   3 SHORT STAGGERED windows against the encode-matched control (mfx_mix.py / mfx_sweep.py, zero
//   renders). Results:
//     A. 58.20 impact (the liquidation overlay). Its transient landed on the last 20 ms of "then" and
//        1 of 3 windows read "and then people" as "that people". TIMING FIXED, gain untouched:
//          t 58.20 vol 0.20 ......... 2/3   t 58.35 vol 0.20 (SHIPPED) ... 3/3
//          t 58.20 vol 0.12 ......... 3/3   deleted ...................... 3/3
//        The retime matches the deleted/halved variants window for window, so the cue KEEPS its full
//        0.20 gain and the overlay's tIn was moved to 58.45 to land with the hit.
//     B. 31.95 whoosh on the B3 -> B4 hard cut. DELETED. It sat on "what if pengu is gonna pump?" and
//        NEITHER knob saved it: trim to dur 0.55 -> 0/3, halve to vol 0.12 -> 0/3, deleted -> 2/3.
//        It is decoration on a b-roll cut, not a payoff hit, so the SKILL says delete it. (The one
//        window that still differs with the cue GONE is proven decoder variance, not masking: with
//        zero SFX energy in the span, the residual control-vs-mix difference measures -65.0 dB, i.e.
//        43.4 dB UNDER the VO, far below the SKILL's -40 dB masker threshold.) The library has no
//        shorter transition SFX to substitute (no swipe/slide sets on this machine).
//     C. 76.92 whoosh on the cut back from the climax. DELETED. It sat on "what is going to replace"
//        and again neither knob saved it: trim 0.40 -> 2/3, vol 0.12 -> 2/3, deleted -> 3/3. Same
//        verdict: decoration, not a payoff hit.
//   The 8 surviving cues re-scored 3/3 on every window of the whole-file A/B of the final list.
export const SFX_MFX: Sfx[] = [
  { t:  0.00, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.26, dur: 1.00 }, // frame-0 thumbnail cut (crest 0.15)
  { t:  0.10, src: staticFile('sfx/Cinematic Whoosh 02.wav'),               vol: 0.18, dur: 2.00 }, // sweeps INTO the HOOK full-screen (crest 0.90 = the 0.90 cut)
  { t:  4.05, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.22, dur: 1.00 }, // cut back to the base bubble map (crest 4.20)
  { t: 22.05, src: staticFile('sfx/DING.mp3'),                              vol: 0.22, dur: 1.60 }, // BADGE 2 "130X" reveal (crest 22.20, inside the 21.88-22.48 silence)
  { t: 27.95, src: staticFile('sfx/Impacts/Kick_Impact_01-short.wav'),      vol: 0.24, dur: 0.55 }, // THE PEAK, "holy crap" (crest 28.10, inside the 27.96-28.24 silence; the 0.55 s trimmed variant, so no tail smears over the line)
  // (a whoosh on the 32.10 B3 -> B4 hard cut was DELETED by the A/B - see note C above)
  { t: 46.90, src: staticFile('sfx/TING SOUND EFFECT.mp3'),                 vol: 0.20, dur: 2.00 }, // receipt ting after "my 58x-er from just two months ago" (crest 47.70, inside the 47.60-47.80 silence)
  { t: 58.35, src: staticFile('sfx/Impacts/Impact_Hit_01-2-short.wav'),     vol: 0.20, dur: 0.55 }, // the liquidation overlay pops (crest 58.45); the LIGHTEST impact in the library (-11.6 dB peak). RETIMED +0.15 s by the A/B, full gain kept - see note A above
  { t: 72.20, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_3.wav'), vol: 0.10, dur: 1.75 }, // riser BUILDS INTO the climax and ENDS exactly on it (73.95) - trimmed to the pre-plateau ramp, see the note above
  { t: 73.90, src: staticFile('sfx/Boom - Big Reveal-short.wav'),           vol: 0.26, dur: 1.05 }, // IMPACT on the CLIMAX full-screen cut (crest 73.95, inside the 73.46-74.02 silence). NOTHING fires after this point: the closing question is clean.
];

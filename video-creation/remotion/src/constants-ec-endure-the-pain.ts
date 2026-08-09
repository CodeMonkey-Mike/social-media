import { staticFile } from 'remotion';
import type { BrollEv, Sfx } from './_kit';
import type { BadgeEv, OverlayEv, ThumbDef } from './LivestreamShort';

// ─── endure-the-pain (batch: early-crash, clip #5, variant: full) ───────────────────────────────
// "Meme Coin Truth: You'll Be Lucky You Endured the Pain" (Mike's 4b title; the "Meme Coin Truth: "
// prepend is his wording, do not restyle it).
//
// A market-cycle argument, not a project pitch. He opens on the long-run promise ("eventually, in
// the long run, people are going to buy crypto"), runs a six-limb anaphora chain down the risk
// curve (bitcoin -> crypto -> meme coins -> the alts -> the Robinhood chain -> learning to swap),
// lands the escalation payoff ("the outlook is good and it's REALLY good"), then turns to the
// macro ("we're going into economic expansion") and closes on the peak: you will be LUCKY you
// endured the pain. Register: steady conviction / evergreen. Ends on a deliberate HARD-OUT, no CTA
// and no tail - that abruptness is Mike's watch-time strategy, not a defect.
//
// Base clip: endure-the-pain-final.mp4 (raw cut -> Phase 5 tighten -> 5B desilence at min-sil 0.25
// -> 5C filler pass). ALREADY composited vertical (screen-share on top, webcam below), 1080x1920 @
// 25 fps, 32.032 s. FINAL, do NOT re-cut and do NOT re-split the zones. The comp runs at 30 fps;
// OffthreadVideo resamples the 25 fps source by TIME, so every cue below is plain seconds taken
// from the clip's own Whisper word timings (clip-relative, 0-based).
//
// ⚠ The file referenced here is the render-assets COPY, re-encoded to a SEEK-FRIENDLY GOP
//   (-g 25 -keyint_min 25 -bf 0 -sc_threshold 0) by
//   `python video-creation/livestream-repurpose/scripts/setup_render_assets.py early-crash`.
//   Re-verified on this copy for this build: keyframes at 0.00 / 1.00 / 2.00 / 3.00 / 4.04 / 5.04
//   ... (~1.0 s GOP). The canonical spine in the clip folder is never touched.
//
// Render (public-dir = the BATCH render-assets/, shared with clips 1/3/4/6; every file this clip
// owns is `*-ec-etp-*` prefixed so the parallel builders cannot collide):
//   npx remotion render src/index.ts EcEndureThePain \
//     out/early-crash/5-endure-the-pain.mp4 \
//     --public-dir "<repo>/video-creation/shorts/early-crash/render-assets"

export const EC_ETP_FPS = 30;
export const EC_ETP_DURATION = 960; // floor(32.032 s x 30); last frame index 959 = t 31.967 s, inside the clip

export const CLIP_EC_ETP  = staticFile('endure-the-pain.mp4');
export const THUMB_EC_ETP = staticFile('thumb-ec-etp.png');

// Layout geometry, MEASURED on this clip (row-mean gradient scan over rows 700-1000 at
// t = 0.5/5/10/15/18.9/19.2/24/31.5 s; ALL EIGHT frames put the hard screen-share/webcam divider on
// row 854, delta 191-212 - i.e. the same livestream layout as clips #1/#4, and it does NOT move
// across the 19.000 s splice).
export const EC_ETP_SEAM  = 853; // content zone = 0..853 (the screen-share); webcam below
export const EC_ETP_CAP_Y = 890; // caption centre: 37 px under the seam, on his hair. Eyes measured
                                 // at rows ~1150 (t 12 s) and ~1215 (t 27 s), so captions never
                                 // cross them.
// Divider colour under a CONTENT-mode image. NOT the default TEAL: teal is the Kaspa brand colour
// and this clip is not about Kaspa, and the only content-mode image is a gold/amber dawn frame that
// teal would fight. House yellow matches the b-roll palette.
export const EC_ETP_ACCENT = '#ffe600';

// ─── B-roll beats (authored in BROLL-PLAN.md BEFORE generation; that file is the manifest) ──────
//
// WHAT THE BASE ACTUALLY SHOWS (read off rendered frames, not assumed). The screen-share is a
// FROZEN page for the whole clip - a 2 s-bucket content-zone frame-diff scan maxes at 0.94
// everywhere EXCEPT the splice - and it changes exactly once:
//   0.00-19.00  Yahoo Finance markets page: index strip (S&P/Dow/Nasdaq/Russell/VIX/Gold), lead
//               story "Jobs report helps Fed's case to hold rates", trending tickers incl.
//               BTC-USD 64,760.51. A live macro receipt under "in the long run... we're going into
//               economic expansion".
//   19.00-32.03 DexScreener KISHU/WETH: the 2021 vertical pump candle and the multi-year bleed
//               after it, MKT CAP $10.0M, transactions table. Literally a meme coin that pumped and
//               then bled for years, sitting under "endure the pain that we've been seeing".
// Both halves are ON MESSAGE, so the ~70 % base-showing budget is real coverage, not a dodge.
//
// ⚠ THE 19-MINUTE SPLICE JOIN IS AT t = 19.000 s AND IS COVERED BY B3.
// This clip is a scatter-gather of two master ranges 19 minutes apart (372.36-395.92 and
// 1522.90-1546.30). A full-clip frame-difference scan (800 frames) puts the join at 19.000 s with a
// total delta of 74.56 - 3.4x the next largest discontinuity - and BOTH zones jump (content 95.76:
// Yahoo Finance -> DexScreener; face 57.60: his head jumps and returns). B3 opens at 18.45 and
// BrollLayer fades in over 0.12 s, so the layer is fully opaque from 18.57 and the join frame is
// completely hidden. (October-bottom clip-1 precedent.)
// The other four spikes in that scan (10.40 = 21.65, 21.88 = 14.95, 28.00 = 12.98, 14.24 = 11.16)
// are all content-zone-static / face-only: ordinary 5B desilence micro-cuts and head motion. Every
// short in this pipeline has them and they are NOT covered.
//
// COVERAGE (halved budget, SKILL item 4): 9.58 s of b-roll = 29.9 % (band 25-35), 22.45 s of base
// showing = 70.1 % (band 65-75). FOUR distinct images, zero reuse. THREE full-screens = hook + the
// join/turn + the climax, i.e. exactly the three sanctioned moments, at the FIRM 1-3 cap. Beat
// lengths 2.00-2.68 s ("changes every 1-3 s"). No two beats are adjacent (base gaps 2.20 / 9.55 /
// 7.60 / 1.68 s), so every beat cross-fades to the base and no sub-1 s base flash exists.
//
// REFERENCE-IMAGE GATE (done LIVE for this build): `ls schedule-tweets/images/reference/` returns
// 21 entries (DogInMe, ElizaOS-ai16z x2, LAB, bittensor-tao, bobo, carousels, ethereum-eth,
// housecoin, kappy, kaspa-logo, kasy, kroak, linea, michael-saylor, nacho, slippy, toshi, troll,
// velvet, what-if). The only named entities in this clip are BITCOIN (4.50 s) and the ROBINHOOD
// CHAIN (9.80 s); NEITHER has a reference on disk, and the clip names no project it is about. So
// no logo is invented: all four images are atmosphere-metaphor with BLANK featureless discs and
// FACELESS silhouettes, and every one was visually inspected before render (no real coin mark, no
// real face, no text).
// staticFile() calls are LITERAL strings on purpose - the finalized-short gate scans for literal refs.
export const BROLL_EC_ETP: BrollEv[] = [
  // BASE 0.033-1.42 (1.39 s) - the frame-0 thumb is ONE frame; the video opens on Mike + the Yahoo
  // Finance page under "the good news is that eventually".
  { src: staticFile('broll-ec-etp-hook.png'),      tIn:  1.42, tOut:  4.10, mode: 'full'    }, // HOOK: "eventually, in the long run, people are going to buy crypto" (1.42-3.68). Lone faceless silhouette on a ridge, storm breaking open into gold dawn.
  // BASE 4.10-6.30 (2.20 s) - "people are going to be buying BITCOIN. they're going to be buying
  // crypto." The protected doubled limb lands on his face.
  { src: staticFile('broll-ec-etp-tide.png'),      tIn:  6.30, tOut:  8.90, mode: 'content' }, // THE CHAIN: "buying meme coins... buying the alts" (6.44-8.64). Rising tide of faceless silhouettes walking uphill toward a lit horizon, BLANK discs rising like embers. CONTENT mode so the anaphora rhythm keeps his face.
  // ⛔ BASE 8.90-18.45 (9.55 s) - DELIBERATE, the longest base stretch in the clip: the Robinhood
  // chain / "learn how to swap" / "maybe they don't need centralized exchanges" run and then the
  // escalation payoff ("the outlook is good and it's REALLY good"), which is pure delivery. The
  // Fed/jobs-report page under it IS the macro receipt. It is also why no Robinhood beat is
  // invented: no reference logo exists on disk.
  { src: staticFile('broll-ec-etp-expansion.png'), tIn: 18.45, tOut: 20.45, mode: 'full'    }, // THE TURN + THE JOIN COVER: "...hasn't checked out" -> [SPLICE 19.000] -> "we're going into economic expansion" (19.12-20.70). Dawn flooding a valley, storm retreating, green shoots.
  // BASE 20.45-28.05 (7.60 s) - DELIBERATE. "we're not feeling it yet. eventually we're going to
  // feel it. eventually we're going to start feeling it. the bull run is going to start over
  // again." The signature escalating doubling is a FACE beat, and the KISHU bleed chart sits under it.
  { src: staticFile('broll-ec-etp-endure.png'),    tIn: 28.05, tOut: 30.35, mode: 'full'    }, // CLIMAX: "a lot of you guys are going to be LUCKY that you just try to" (26.72-29.52). Lone faceless climber cresting the ridge into full sunrise, the storm falling away behind.
  // BASE 30.35-32.03 (1.68 s) - the deliberate HARD-OUT, "endure the pain that we've been seeing.",
  // plays on his face over the meme-coin bleed chart. Nothing over it, no tail, no CTA.
];

// ─── Overlays / badges: NONE, deliberately ──────────────────────────────────────────────────────
// There is no number, receipt, ticker or named project in this clip to badge, and the
// steady-conviction register does not carry hype furniture. So the only timed graphics are the
// frame-0 cover (ONE frame) and the caption band, which cannot collide with anything in time OR
// space: the cover is suppressed after frame 0 and the caption band lives at y 890, below the
// content zone that the one content-mode b-roll image occupies (0..853).
export const OVERLAYS_EC_ETP: OverlayEv[] = [];
export const BADGES_EC_ETP: BadgeEv[] = [];

// ─── Frame-0 thumbnail (IG/TikTok cover) ────────────────────────────────────────────────────────
// ONE frame only (LivestreamShort defaults thumb.durS to 1/fps) - generated background art with the
// hook title drawn in CODE on top, never baked into the image. No em dashes. The art was prompted
// with a DARK, detail-free storm sky filling the top half precisely so the code-drawn title block
// (rows ~240-742) and the chip (~776-861) sit on clean negative space, far above the 1680 px safe
// -zone line.
export const THUMB_DEF_EC_ETP: ThumbDef = {
  img: THUMB_EC_ETP,
  title: "YOU'LL BE\nLUCKY YOU\nENDURED\nTHE PAIN",
  chip: 'MEME COIN TRUTH',
  chipColor: '#ffe600',
  titleSize: 128, // longest lines "YOU'LL BE" / "LUCKY YOU" (9 chars) stay inside the 968 px text box
};

// ─── SFX (shared library, COPIED into render-assets/sfx/; every event stays under the VO) ───────
// Restrained on purpose: this is a steady-conviction clip with no receipts and no numbers, so there
// are no dings and no riser. What is here: a whoosh on the frame-0 cover cut, a sweep into the HOOK
// full-screen, a whoosh on the one content-zone cutaway, a whoosh on the TURN full-screen cut, an
// IMPACT on the 19.000 splice itself, and an IMPACT on the CLIMAX cut. NOTHING is placed on the
// hard-out: "endure the pain that we've been seeing." ends clean and abrupt on purpose.
//
// ⚠ Cue points are each file's own measured CREST, not its file start. Envelopes re-measured on
//   THIS machine at 0.1 s RMS / 0.05 s hop for this build:
//     transition_rapid_whoosh  crest 0.15 (peak -14.3 dB, 5 % tail 0.80)
//     Cinematic Whoosh 02      crest 0.80 (-11.2 dB, tail 1.15)
//     Boom - Big Reveal-short  crest 0.05 (-2.3 dB, tail 0.90)
//     Soundjay_Impact_Main_01-short crest 0.25 (-3.0 dB, tail 0.55)
//     Tension_Rise_Logo_Reveal_3    attack 0.90, crest 2.55 (-8.4 dB)
//   Each cue is started EARLY by exactly that offset so the crest lands on the frame it punctuates.
//   Both impacts are the TRIMMED library variants (short tails) because timing/tail is the first
//   masking knob, not gain (SKILL 7/7a).
//
// ⚠ TWO CUES WERE CUT BY AN OFFLINE, ENCODE-MATCHED WHISPER SWEEP (SKILL 7a; zero renders - each
//   candidate was mixed onto the BARE SPINE with ffmpeg and scored against a control that is the
//   same spine pushed through the render's own 48 kHz / AAC 317k chain, using SHORT STAGGERED
//   windows, medium.en at 1x):
//   1. A RISER (Tension_Rise_Logo_Reveal_3) building into the turn. Its loud ramp sat over
//      "hasn't checked out" (18.26-19.00) and MASKED it: with the riser the windows at 17.80 /
//      18.10 / 18.40 read "has us checked out" and "let's check it out"; with it removed they read
//      "hasn't checked out" identically to the control. TIMING could not save it (there is no
//      speech-free runway in a 32 s clip) and GAIN could not either - it still failed at vol 0.06,
//      which is exactly the SKILL's warning that gain is often the wrong knob. It is decoration,
//      not a payoff hit, so it was DELETED (eliza clip-3 precedent).
//   2. A whoosh on the b-roll fade-OUT at 20.45. At 19.90+2.00 the candidate DROPPED the word
//      "expansion" (19.66-20.70) that the control transcribes. It punctuated a soft fade back to
//      base, not a major transition, so it was DELETED; all three "expansion" windows then MATCH.
//   The surviving turn treatment was RE-VERIFIED: the 18.30 whoosh + the 18.97 impact score 3/4
//   MATCH on the turn windows, BETTER than a diagnostic mix with NO sfx at all there (2/4), i.e.
//   the two remaining DIFFs are decoder variance at the window edge ("goin'" vs "going",
//   "economic" vs "economics") and not masking. The climax impact scores MATCH on both windows that
//   contain the whole phrase; the two windows that OPEN mid-impact only add a hallucinated leading
//   syllable and lose no real word.
//   The IMPACT was also MOVED off a word: at its first placement (crest on the 18.45 picture cut)
//   it sat inside "hasn't" and broke it in every window. It now crests at 19.02, inside the real
//   19.00-19.12 SPEECH GAP and exactly on the splice it is covering, which is also the better edit.
//
// ⚠ FINAL-RENDER VERDICT ON THE TURN (8 staggered offsets, 17.80-18.85, final render vs the
//   encode-matched control): 3/8 exact MATCH, and the 5 diffs are decoder variance, NOT masking:
//   at 18.25 the CONTROL is the worse read ("and checked out" vs the render's correct "hasn't
//   checked out") and at 17.80 the control hallucinates an "it" the render gets right as "and";
//   two more diffs are edge tokens only ("economic"/"economics", a hallucinated leading word) with
//   identical content. Exactly ONE offset (18.40) loses content, and 18.55/18.70/18.85 all recover
//   it. This 18.2-18.5 span is intrinsically unstable for whisper - it is a fast low-energy
//   consonant cluster - which is the confound SKILL 7a documents ("in one case the SPINE
//   transcribed worse"). The decisive reads: the WHOLE-FILE pass of the final render reproduces the
//   line perfectly and matches the on-screen captions 147/147 words (similarity 1.0000), and a
//   per-span level measurement shows the deleted riser really is gone (+0.2 dB over the bare
//   control in its former 16.5-18.3 span, i.e. nothing) while the surviving cues add only +0.9 dB
//   over "hasn't". Shipped as-is; flagged in the build report for Mike's render review.
export const SFX_EC_ETP: Sfx[] = [
  { t:  0.00, src: staticFile('sfx/transition_rapid_whoosh.mp3'),                 vol: 0.24, dur: 1.00 }, // frame-0 thumbnail cut (0.033); crest 0.15
  { t:  0.62, src: staticFile('sfx/Cinematic Whoosh 02.wav'),                     vol: 0.18, dur: 2.24 }, // sweeps INTO the HOOK full-screen (crest 1.42 = the cut)
  { t:  6.15, src: staticFile('sfx/transition_rapid_whoosh.mp3'),                 vol: 0.20, dur: 1.00 }, // the content-zone cutaway (crest 6.30)
  { t: 18.30, src: staticFile('sfx/transition_rapid_whoosh.mp3'),                 vol: 0.14, dur: 1.00 }, // the TURN full-screen cut (crest 18.45); gain kept low, sweep-verified clean over "hasn't checked out"
  { t: 18.97, src: staticFile('sfx/Boom - Big Reveal-short.wav'),                 vol: 0.22, dur: 1.05 }, // IMPACT on the 19.000 SPLICE, crest 19.02 inside the 19.00-19.12 speech gap
  { t: 27.80, src: staticFile('sfx/Impacts/Soundjay_Impact_Main_01-short.wav'),   vol: 0.24, dur: 0.68 }, // IMPACT on the CLIMAX cut, just under "lucky" (crest 28.05)
];

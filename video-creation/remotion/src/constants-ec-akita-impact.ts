import { staticFile } from 'remotion';
import type { BrollEv, Sfx } from './_kit';
import type { BadgeEv, OverlayEv, ThumbDef } from './LivestreamShort';

// ─── akita-3b-robinhood-impact (batch: early-crash, clip #6, variant: IMPACT) ────────────────────
// "Watch This: $3 Billion. A Freaking Inu." (Mike's exact 4b title)
// The pure-peak cut of clip #1's material: he drags the live DEXScreener AKITA/WETH market-cap chart
// to the 2021 top, loses it ("oh my god, hold on, hold on"), hunts for the candle ("let me hover over
// that candle... what... where's... right here?") and reads the number off the screen: a $3 BILLION
// top on a dog meme coin, "without any centralized exchanges." Ends on a deliberate HARD-OUT on the
// second "a freaking inu." - no CTA, no padding, no fade. That is the watch-time strategy.
//
// ⛔ THIS IS THE IMPACT CUT OF CLIP #1 (`akita-3b-robinhood`, comp `EcAkita3bRobinhood`, constants
// `constants-ec-akita-3b-robinhood.ts`). Its master range 1121.16-1164.18 sits INSIDE clip #1's, and
// both clips share this batch's public dir. **Not one of clip #1's assets is reused or referenced**
// (`broll-ec-aka-*`, `thumb-eca.png` belong to clip #1): every image here is newly generated and
// `broll-ec-aki-*` / `thumb-ecaki` prefixed, per the every-image-is-unique rule and the "no duplicate
// b-roll across same-topic shorts" hard rule. Never edit clip #1's files from here.
//
// Base clip: akita-3b-robinhood-impact-final.mp4 (raw cut -> Phase 5 tighten, a justified
// ZERO-REMOVAL plan -> 5B desilence at min-sil 0.25 -> 5C filler pass). ALREADY composited vertical
// (screen-share on top, webcam below), 1080x1920 @ 25 fps, 30.77 s. FINAL, do NOT re-cut and do NOT
// re-split the zones. The comp runs at 30 fps; OffthreadVideo resamples the 25 fps source by TIME, so
// every cue below is plain seconds taken from the clip's own Whisper word timings (clip-relative).
//
// ⚠ The file referenced here is the render-assets COPY, re-encoded to a SEEK-FRIENDLY GOP by
//   `python video-creation/livestream-repurpose/scripts/setup_render_assets.py early-crash`.
//   Verified on this copy: keyframes at 0.00 / 1.00 / 2.00 / 3.04 / 4.04 ... (~1.0 s GOP). Mandatory
//   since the 2026-08-05 finding that concurrent OffthreadVideo seeks die on a long-GOP source. The
//   canonical spine in the clip folder is never touched.
//
// Render (public-dir = the BATCH render-assets/, shared with clips 1/3/4/5):
//   npx remotion render src/index.ts EcAkitaImpact \
//     out/early-crash/6-akita-3b-robinhood-impact.mp4 \
//     --public-dir "<repo>/video-creation/shorts/early-crash/render-assets"

export const EC_AKI_FPS = 30;
export const EC_AKI_DURATION = 923; // 30.767 s @30; last frame index 922 = t 30.733 s, inside the 30.77 s clip

export const CLIP_EC_AKI  = staticFile('akita-3b-robinhood-impact.mp4');
export const THUMB_EC_AKI = staticFile('thumb-ecaki.png');

// Layout geometry, MEASURED on THIS clip (row-mean gradient scan at t = 1/4/8/12/16/20/24/28/30 s;
// all NINE frames put the hard screen-share/webcam divider on row 853, delta 181-200).
export const EC_AKI_SEAM  = 853; // content zone = 0..853 (the live DEXScreener AKITA/WETH chart); webcam below
export const EC_AKI_CAP_Y = 890; // caption centre: 37 px under the seam, on his hair, never his eyes (~1180-1290)

// ⛔ NO TEAL on this clip (same rule clips #1 and #4 recorded): teal is Kaspa's colour and a teal
// accent on a Robinhood-chain / Akita short misreads as a Kaspa short. Badges use yellow + neon green
// only. `BrollLayer`'s `accent` (the divider under a CONTENT-mode image) is never reached here because
// every beat below is full-screen, so no divider is ever drawn.

// ─── B-roll beats (authored in BROLL-PLAN.md BEFORE generation) ─────────────────────────────────
//
// ⛔ MIKE'S CLIP-SPECIFIC DIRECTIVE (2nd review, 2026-08-07) OVERRIDES THE ~25-35 % COVERAGE BAND:
// "clips 1+6 are chart-walks - EXTREME-minimum b-roll (... clip 6: thumb + first ~1s + last ~5s;
// middles BARREN, transparent-bg overlays only)". So: the frame-0 cover, ONE 1.10 s beat at the head,
// and 4.17 s at the tail. The 1.70-26.60 s middle carries NO image at all - only 1 alpha PNG and
// 2 code-drawn badges, all clear of the candles.
//   coverage 5.27 s / 30.77 s = 17.1 % b-roll, 25.50 s = 82.9 % BASE SHOWING.
//   ⚠ DELIBERATELY BELOW the SKILL's 25-35 % band, by his instruction, reported as a deviation rather
//   than silently "fixed". Do not restore coverage from this file.
// 3 distinct images, zero reuse inside the clip, and zero overlap with clip #1's set.
// 3 full-screens (hook / punchline / close) = the FIRM 1-3 cap. B2->B3 are EXACTLY butted
// (tOut === tIn = 28.70) so BrollLayer HARD-CUTS with zero base frames between; the only other join
// is a 24.90 s deliberate base gap, so no sub-1 s base flash exists anywhere.
//
// ⚠ THE CONTENT ZONE IS NOT ALWAYS THE CHART. Measured at 4 fps on the staged spine (mean luminance
// of the chart crop x140-860 / y40-430: chart ~33, meme ~104-168), the chart panel is fully replaced
// by one of Mike's own livestream REACTION-MEME clips for 6.90-11.90 s (a cheering crowd) and
// 17.40-19.10 s (a shocked reaction). Those are BASE footage and on-brand hype punctuation, so the
// build leaves them alone (the persona no-real-faces rule governs GENERATED b-roll, not his stream),
// and they explain the two long "silences" in the word stream (7.12-12.32 and 17.58-19.62): the memes
// ARE those beats. ⚠ AND THOSE HOLES ARE NOT SILENT - he talks over both. The shipped word pass
// dropped a "look at that." in each (9.76 and 18.80); they are restored via the clip folder's
// `_patch_words.py` -> whisper-words-verified.json, which is what the captions are built from. The
// riser below therefore DOES sit over speech, and an encode-matched A/B (bare control vs this render,
// 4 short windows) returns the identical words on both, so at vol 0.10 it masks nothing.
// staticFile() calls are LITERAL strings on purpose - the finalized-short gate scans for literal refs.
export const BROLL_EC_AKI: BrollEv[] = [
  // BASE 0.03-0.60 - the frame-0 thumb is ONE frame; the video opens on Mike + the live chart (Phase 7 rule #5)
  { src: staticFile('broll-ec-aki-hook.png'),       tIn:  0.60, tOut:  1.70, mode: 'full' }, // HOOK: "now i'm going to go over here to the, to the, to the right" (0.00-2.96)
  // ⛔ BASE 1.70-26.60 (24.90 s) - BARREN BY DIRECTIVE. "now watch this", "oh my god" x2, "hold on" x3,
  // the crowd meme, "look at that", "holy crap" x2, the shocked meme, "3 billion", the candle hunt and
  // "is this the 3 billion, 3 billion market cap?" all play on the live chart + his face. Carried by
  // 2 code badges + 1 alpha PNG only.
  { src: staticFile('broll-ec-aki-inu-summit.png'), tIn: 26.60, tOut: 28.70, mode: 'full' }, // PUNCHLINE: "a freaking inu without any" (26.62-28.26)
  { src: staticFile('broll-ec-aki-nocex.png'),      tIn: 28.70, tOut: 31.20, mode: 'full' }, // CLOSE: "centralized exchanges. a freaking inu." (28.26-30.54) - EXACTLY butted to the previous beat, hard cut
  // ⚠ the last tOut is deliberately PAST the comp end (last frame = t 30.733 s) so BrollLayer's 0.12 s
  // fade-out never starts: the clip HARD-OUTS on the punchline at full opacity, no fade, no tail, no CTA.
];

// ─── Transparent overlay (real alpha PNG) ───────────────────────────────────────────────────────
// The ONE image-based element allowed mid-clip. Generated glow-on-black and converted to TRUE alpha
// (alpha = boosted luminance, per SKILL "Transparent overlays"), then cropped to the subject: 817x915,
// 63.8 % of it fully transparent, so it composites without a box. `blend: 'normal'` because the
// transactions table under the chart is near-WHITE (measured mean luminance 247) and a screen blend
// cannot darken white.
// Placement x 140-460, y 110-468: over the EMPTY dark left third of the chart, where the flat pre-2021
// price line runs. The candles he is hunting sit at x 490-800 in this window (verified on the t=23 s
// frame), so nothing he points at is covered. It lands on "where's... right here?" - the find - and it
// sits 0.70 s after badge 2 closes, so no two graphics ever share a frame.
export const OVERLAYS_EC_AKI: OverlayEv[] = [
  { src: staticFile('broll-ec-aki-ov-arrow.png'), tIn: 22.60, tOut: 24.30, top: 110, left: 140, width: 320, blend: 'normal' },
];

// ─── Code-drawn badges ──────────────────────────────────────────────────────────────────────────
// Both sit in the barren middle, in the static transactions-table band, and are 3.90 s apart, so they
// can never co-occur. Neither starts before the thumb frame ends (0.033 s), and LivestreamShort
// suppresses badges while the thumb is up anyway. They are in a DIFFERENT vertical band from the alpha
// overlay (rows ~535-785 vs rows 110-468), so a collision is impossible in space as well as in time.
//
// ⚠ GEOMETRY: the shared `Badge` is `left: 50%` with `translate(-50%,-50%)` and no explicit width, so
// the shrink-to-fit box is capped at 540 px (~436 px of text after the 52 px side padding). line1 <= 9
// chars @60 px, line2 <= 5 chars @82 px, sub <= 14 chars @32 px, so both boxes stay three lines tall.
// `top` is the box CENTRE: a ~250 px tall badge at 660 spans rows ~535-785 - below the candles
// (rows 40-430), above the caption band (centre 890) and above the seam (853).
//
// Both badges state only what THIS cut shows or says: the pair on screen is AKITA/WETH, the chart's
// own x-axis reads Mar/Apr/May '21 on every sampled frame, and the $3B top is the number he reads out
// at 19.62 s (the price axis reads 2.92B/3.00B). Nothing is imported from clip #1.
export const BADGES_EC_AKI: BadgeEv[] = [
  { tIn: 13.60, tOut: 15.80, color: '#ffe600', line1: 'AKITA',     line2: 'INU', sub: '2021 MEME COIN', top: 660 },
  { tIn: 19.70, tOut: 21.90, color: '#39ff14', line1: 'PEAKED AT', line2: '$3B', sub: 'MARKET CAP',     top: 660 },
];

// ─── Frame-0 thumbnail (IG/TikTok cover) ────────────────────────────────────────────────────────
// ONE frame only (LivestreamShort defaults thumb.durS to 1/fps) - generated background art with the
// hook title drawn in CODE on top, never baked into the image. No em dashes.
// The wording is Mike's 4b title minus its "Watch This:" lead-in, which is a spoken cue rather than
// cover text (he literally says "now watch this" at 3.02 s). The chip is his own claim from the close.
// No project mark is depicted and none is invented: the dog is an ANIMAL, not a token logo (Akita has
// no reference image on disk - gate run LIVE 2026-08-08).
export const THUMB_DEF_EC_AKI: ThumbDef = {
  img: THUMB_EC_AKI,
  title: '$3 BILLION\nA FREAKING\nINU',
  chip: 'ZERO CENTRALIZED EXCHANGES',
  chipColor: '#ffe600',
  titleSize: 104, // longest line "A FREAKING" (10 chars) stays well inside the 968 px text box
};

// ─── SFX (shared library, COPIED into render-assets/sfx/; every event stays under the VO) ────────
// Whoosh on the frame-0 cover cut and on both head b-roll cuts, a DING on badge 1, a riser that runs
// across the SILENT shocked-meme beat and ENDS exactly on the "3 billion" reveal, a kick ON that
// reveal (which doubles as badge 2's reveal hit, so badge 2 gets no separate DING and the two hits
// cannot clutter), a trimmed Boom on the punchline cut, and a whoosh on the B2 -> B3 hard cut.
// NOTHING is placed on the final "a freaking inu." - the hard-out ends clean and abrupt on purpose.
//
// ⚠ Cue points are each file's own measured CREST, not its file start. Envelopes re-measured on THIS
//   machine at 0.1 s RMS / 0.05 s hop for this build:
//     transition_rapid_whoosh crest 0.15 (peak -4.2 dB) - DING crest 0.15 (-6.5 dB) -
//     Kick_Impact_01 crest 0.15 (+2.7 dB) - Boom - Big Reveal-short crest 0.05 (+2.7 dB) -
//     Tension_Rise_Logo_Reveal_3 crests 2.55 (+1.6 dB).
//   Each cue is started EARLY by exactly that offset so the crest lands on the frame it punctuates,
//   and the riser's `dur` ends it exactly on the impact instead of smearing past it. The loud files
//   (Kick, Boom, riser) therefore carry the lower volumes.
//
// ⚠ FINAL-MIX MASKING SWEEP (contract items 7/7a, run on this clip 2026-08-08, ZERO renders spent).
//   All 8 cues were mixed onto the BARE spine OFFLINE and both the mix and an ENCODE-MATCHED CONTROL
//   (the same spine through the same 48 kHz AAC chain as the render) were scored with medium.en on
//   SHORT STAGGERED windows, two offsets per cue region: 0.00-3.20 / 0.20-3.40 (head whooshes),
//   13.10-15.10 / 13.30-15.30 (DING under "holy crap"), 19.20-21.20 / 19.40-21.40 (riser + kick on
//   "3 billion"), 26.20-28.40 / 26.40-28.60 (Boom on "a freaking inu"), 28.30-30.40 / 28.50-30.77
//   (whoosh under "centralized exchanges. a freaking inu."). Every region came back matching the
//   control. The ONE apparent regression - the 0.20-3.40 window dropping "now watch this" off the mix
//   - was re-scored on THREE staggered windows that fully contain the phrase (2.20-4.20 / 2.40-4.40 /
//   2.60-4.60): control and mix are BYTE-IDENTICAL on all three, i.e. it was the window-boundary
//   artifact contract item 7a warns about, not masking. No cue was retimed, trimmed or turned down.
export const SFX_EC_AKI: Sfx[] = [
  { t:  0.00, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.26, dur: 1.00 }, // frame-0 thumbnail cut (crest 0.15)
  { t:  0.45, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.24, dur: 1.00 }, // cut INTO the HOOK full-screen (crest 0.60)
  { t:  1.55, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.22, dur: 1.00 }, // cut back to the base chart (crest 1.70)
  { t: 13.45, src: staticFile('sfx/DING.mp3'),                              vol: 0.22, dur: 1.60 }, // BADGE 1 "AKITA INU" reveal (crest 13.60)
  { t: 17.07, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_3.wav'), vol: 0.10, dur: 2.55 }, // riser across the shocked-meme beat, ENDS exactly on the reveal (19.62); A/B-verified clean over the restored 18.80 "look at that."
  { t: 19.47, src: staticFile('sfx/Impacts/Kick_Impact_01.wav'),            vol: 0.24, dur: 1.60 }, // IMPACT on "3 BILLION" (crest 19.62) - also badge 2's reveal hit (19.70)
  { t: 26.55, src: staticFile('sfx/Boom - Big Reveal-short.wav'),           vol: 0.26, dur: 1.05 }, // IMPACT on the PUNCHLINE full-screen cut (crest 26.60); the 1.05 s trimmed library variant, so the tail is gone before "inu"
  { t: 28.55, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.22, dur: 1.00 }, // the B2 -> B3 HARD CUT (crest 28.70)
];

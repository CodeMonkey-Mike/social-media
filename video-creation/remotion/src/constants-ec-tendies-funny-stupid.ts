import { staticFile } from 'remotion';
import type { BrollEv, Sfx } from './_kit';
import type { BadgeEv, ThumbDef } from './LivestreamShort';

// ─── tendies-funny-stupid (batch: early-crash, clip #4, variant: full) ─────────────────────────
// "Robinhood Alert: Tendies Is Exactly What Vlad Wants to List" (Mike's 4b title).
// He lists the only meme coins that "float his boat" (What If, Cooper, and TENDIES), pitches
// Tendies as FUNNY AND STUPID in the Fartcoin mould, and calls it exactly the kind of meme Vlad
// wants on the Robinhood app: 16 million now, over a billion in a bull run, "imagine 10 billion".
// Ends on the double disclaimer and a deliberate HARD-OUT ("are you out of your mind?").
//
// Base clip: tendies-funny-stupid-final.mp4 (raw cut -> Phase 5 tighten -> 5B desilence at
// min-sil 0.25 -> 5C filler pass). ALREADY composited vertical (screen-share on top, webcam below),
// 1080x1920 @ 25 fps, 34.509 s. FINAL, do NOT re-cut and do NOT re-split the zones. The comp runs at
// 30 fps; OffthreadVideo resamples the 25 fps source by TIME, so every cue below is plain seconds
// taken from the clip's own Whisper word timings (clip-relative, 0-based).
//
// ⚠ The file referenced here is the render-assets COPY, re-encoded to a SEEK-FRIENDLY GOP
//   (mandatory since the 2026-08-03 finding that Remotion's concurrent OffthreadVideo seeks die
//   mid-render on a long-GOP source). The canonical spine in the clip folder is never touched.
//
// ⚠ FLAT NAMESPACE: `remotion/src/` holds every batch ever built, and this batch shares its
//   render-assets/ with four other clips being built in parallel. Every symbol here is EC_TFS_*
//   and every asset file is `*-ec-tfs-*` so no two builders can collide.
//
// Render (public-dir = the BATCH render-assets/, shared with clips 1/3/5/6):
//   npx remotion render src/index.ts EcTendiesFunnyStupid \
//     out/early-crash/4-tendies-funny-stupid.mp4 \
//     --public-dir "<repo>/video-creation/shorts/early-crash/render-assets"

export const EC_TFS_FPS = 30;
export const EC_TFS_DURATION = 1035; // 34.50 s @30; last frame index 1034 = t 34.467 s, inside the 34.509 s clip

export const CLIP_EC_TFS  = staticFile('tendies-funny-stupid.mp4');
export const THUMB_EC_TFS = staticFile('thumb-ec-tfs.png');

// Layout geometry, MEASURED on this clip (row-mean gradient scan at t=0.5/4.8/9/16/22/27.5/33.8 s;
// all SEVEN frames put the hard screen-share/webcam divider on the same row, delta 105-201).
export const EC_TFS_SEAM  = 853; // content zone = 0..853 (a DexScreener pair page); webcam below
export const EC_TFS_CAP_Y = 890; // caption centre: 37 px under the seam, on his hair, never his eyes (~1200)

// Robinhood's identity colour is neon LIME. ⛔ Never teal on this clip: teal is Kaspa's colour and a
// teal accent on a Robinhood short misreads as a Kaspa short. Passed into BrollLayer as the divider
// colour under content-mode images (the component still defaults to teal for every other comp).
export const EC_TFS_LIME = '#ccff00';

// ─── B-roll beats (authored in BROLL-PLAN.md BEFORE generation) ────────────────────────────────
// Coverage budget (SKILL "B-roll coverage budget", HALVED 2026-07-14):
//   10.22 s covered / 34.509 s = 29.6 % b-roll, 24.29 s = 70.4 % BASE SHOWING. Targets ~30 % / ~70 %
//   (bands 25-35 % / 65-75 %) => on target. 4 distinct images, zero reuse, beats 2.30-2.97 s
//   (the style guide's "changes every 1-3 s").
// 2 full-screens ONLY (hook + climax) = inside the FIRM 1-3 cap, and they are 24.48 s apart, so no
// full->full base flash can exist. The only image-to-image join is B1->B2, EXACTLY butted
// (tOut === tIn = 4.32) so BrollLayer HARD-CUTS with zero base frames between.
//
// ⚠ WHAT THE CONTENT ZONE ACTUALLY SHOWS (read off RENDERED FRAMES at 10.20 / 19.40 / 34.40 s, not
// off a statistic): a DexScreener pair page that is the previous topic's PEPE/WETH for 0.30 s, BLANK
// WHITE "Loading pair..." from 0.30-5.30 s, and then from 5.30 s to the end the REAL TENDIES/WETH
// page - the actual TENDIES logo and wordmark, $0.01681, LIQUIDITY $826K, MKT CAP $16.1M,
// Robinhood > Uniswap v3. (A first pass mislabelled that stretch a "frozen PEPE page" from a
// luma-only scan; both pair pages share a layout, so their luma is nearly identical. Frames win.)
// So the zone is an ON-MESSAGE LIVE RECEIPT for almost the whole clip: the hook full-screen covers
// the dead white stretch, the "$16M" badge at 19.30 sits right beside the page reading $16.1M, and
// the hard-out plays over it. It is also why nothing here has to fake a Tendies logo.
// staticFile() calls are LITERAL strings on purpose — the finalized-short gate scans for literal refs.
export const BROLL_EC_TFS: BrollEv[] = [
  // BASE 0.03-1.35 — the frame-0 thumb is ONE frame; the video opens on Mike + the screen-share
  { src: staticFile('broll-ec-tfs-hook.png'),      tIn:  1.35, tOut:  4.32, mode: 'full'    }, // HOOK: "float my boat is obviously WHAT IF, it's cooper, and then there's..." (1.22-4.38). Generated WITH schedule-tweets/images/reference/what-if.jpg (reference gate)
  { src: staticFile('broll-ec-tfs-tendies.png'),   tIn:  4.32, tOut:  6.62, mode: 'content' }, // THE NAME: "there's TENDIES, even though i haven't gotten any" (4.38-6.08). EXACTLY butted to B1 -> hard cut on the word, and the collapse to the content zone reveals his face for the punchline
  // ⛔ BASE 6.62-16.10 (9.48 s) — the PITCH and the gag: "it's funny and stupid ... this reminds me
  // of the fartcoin concept ... oh, that's stupid ... but it's kind of funny if people will buy into
  // it". Pure face comedy, no reveal in it; carried by BADGE 1 (10.10-12.40), not by images.
  { src: staticFile('broll-ec-tfs-vlad-list.png'), tIn: 16.10, tOut: 18.75, mode: 'content' }, // THE TITLE BEAT: "the type of meme that VLAD will want to LIST on the ROBINHOOD APP" (15.28-19.02). Content mode on purpose: his delivery carries this line, so the webcam stays visible
  // ⛔ BASE 18.75-28.80 (10.05 s) — the number ladder: "from 16 million right now ... in a bull run,
  // over a billion ... we'll see how far it goes. it could be insane." Carried by BADGES 2 and 3 and
  // by the riser that starts at 26.30.
  { src: staticFile('broll-ec-tfs-10b.png'),       tIn: 28.80, tOut: 31.10, mode: 'full'    }, // CLIMAX: "imagine this goes to like 10 BILLION. just imagine." (28.52-30.38)
  // BASE 31.10-34.51 (3.41 s) — "nothing's financial advice here, right? nothing's financial advice.
  // ARE YOU OUT OF YOUR MIND?" The disclaimer and the deliberate HARD-OUT play on his face, over the
  // real TENDIES page that arrives at 33.40. Nothing over it, no tail, no CTA.
];

// ─── Code-drawn badges ──────────────────────────────────────────────────────────────────────────
// Each one sits INSIDE a deliberate base stretch (never over a b-roll image); the windows are 6.90 s
// and 1.90 s apart, so no two can co-occur. None starts before the thumb frame ends (0.033 s), and
// LivestreamShort suppresses badges while the thumb is up anyway.
//
// ⚠ GEOMETRY (the eliza measurement, re-used deliberately): the shared `Badge` is `left: 50%` with
// `translate(-50%,-50%)` and no explicit width, so the shrink-to-fit box caps at 540 px (~436 px of
// text after the 52 px side padding) — about 8 characters at the 82 px `line2` size. Longer lines
// WRAP and the box grows DOWNWARDS into the caption band. Every `line2` here is <= 8 characters
// ("FARTCOIN", "$16M", "BILLION") and all three sit at top 560.
// MEASURED ON THIS FINAL RENDER (border-pixel scan for the box bottom vs the first white caption row):
//   t 11.20 s  box bottom y=713, caption top y=855 -> 142 px
//   t 20.40 s  box bottom y=725, caption top y=856 -> 131 px
//   t 24.50 s  box bottom y=713, caption top y=861 -> 148 px
// (`line1` "MARKET CAP" and the `sub` lines do wrap, which is what pushes badge 2 to y=725; the
// clearance still never drops below 131 px, so no badge can touch the caption band.)
export const BADGES_EC_TFS: BadgeEv[] = [
  { tIn: 10.10, tOut: 12.40, color: EC_TFS_LIME, line1: 'REMEMBER',   line2: 'FARTCOIN', sub: 'SAME STUPID FUNNY ENERGY', top: 560 },
  { tIn: 19.30, tOut: 21.50, color: '#ffe600',   line1: 'MARKET CAP', line2: '$16M',     sub: 'RIGHT NOW',                top: 560 },
  { tIn: 23.40, tOut: 25.60, color: EC_TFS_LIME, line1: 'OVER A',     line2: 'BILLION',  sub: 'IF ROBINHOOD LISTS IT',    top: 560 },
];

// ─── Frame-0 thumbnail (IG/TikTok cover) ────────────────────────────────────────────────────────
// ONE frame only (LivestreamShort defaults thumb.durS to 1/fps) — generated background art with the
// hook title drawn in CODE on top, never baked into the image. No em dashes.
export const THUMB_DEF_EC_TFS: ThumbDef = {
  img: THUMB_EC_TFS,
  title: 'VLAD WANTS\nTO LIST THIS\nON ROBINHOOD',
  chip: 'FUNNY AND STUPID',
  chipColor: EC_TFS_LIME,
  titleSize: 100, // MEASURED on the draft render: at 112 the wide-glyph line "ON ROBINHOOD" wrapped
                  // and stranded "ON" on its own row; 100 keeps all three authored lines intact
                  // inside the 968 px text box.
};

// ─── SFX (shared library, COPIED into render-assets/sfx/; every event stays under the VO) ───────
// Whoosh on the frame-0 cover cut and on the b-roll transitions, an impact on the name reveal, a
// ding on the $16M receipt badge, and a riser that BUILDS INTO the climax impact (per
// Impacts/WHEN-TO-USE-IMPACTS.md: "reserve them for the beats that actually matter"). NOTHING is
// placed on the hard-out: "are you out of your mind?" ends clean and abrupt on purpose.
//
// ⚠ Cue points are each SFX's own PEAK position, not its file start. Envelopes measured on this
//   machine at 0.1 s RMS for this build: transition_rapid_whoosh peaks 0.10 s (-18.1 dB) -
//   Cinematic Whoosh 02 peaks 0.80 s (-14.2 dB) - Kick_Impact_01 peaks 0.10 s (-6.1 dB) -
//   DING peaks 0.20 s (-16.3 dB) - Tension_Rise_Logo_Reveal_3 peaks 2.50 s (-11.7 dB) -
//   Boom - Big Reveal peaks 0.00 s (-5.5 dB) - Soundjay_Impact_Main_01-short peaks 0.25 s (-2.5 dB).
//   Each cue below is therefore started EARLY by exactly that offset so the crest lands on the frame
//   it punctuates, and the riser's `dur` is set to 2.50 so it ENDS exactly on the impact instead of
//   smearing across the line after it. Peak RMS differs by ~13 dB across these files, so the loud
//   ones (Boom, Soundjay) get the lower volumes.
//
// ⚠ THE "TENDIES" IMPACT IS A TRIMMED FILE, NOT A TRUNCATED CUE (contract item 7: fix a masker by
//   TIMING, and never leave a hard cut mid-decay). The first choice, `Impacts/Kick_Impact_01.wav`,
//   is not a transient at all: measured on this machine it is still at -19 to -25 dB (after the 0.24
//   volume scale) between 0.8 s and 1.2 s of its 4.03 s tail, so it would smear straight across
//   "even though i haven't gotten any" (4.92-6.08) AND a `dur` truncation would hard-cut it at
//   -24.7 dB, i.e. an audible click. Replaced with the library's already-trimmed variant
//   `Impacts/Soundjay_Impact_Main_01-short.wav` (0.68 s, crest 0.25 s, faded to -38 dB raw / -50 dB
//   after gain by 0.66 s): the transient lands on the 4.32 cut and the file is SILENT before the
//   line, at full gain. Same precedent as eliza/phantom-hack 2026-08-07.
//
// ⚠ FINAL-MIX MASKING SWEEP (contract item 7a). Every cue was mixed onto the bare spine OFFLINE and
//   whisper-scored (medium.en, 3 staggered short windows per cue) against an ENCODE-MATCHED control
//   (the bare spine through the same 48 kHz/AAC chain), so the sweep cost zero renders. Result: the
//   mix scores EQUAL to the control on all six probed regions. See the build report.
export const SFX_EC_TFS: Sfx[] = [
  { t:  0.00, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.26, dur: 1.00 }, // frame-0 thumbnail cut (crest 0.10)
  { t:  0.55, src: staticFile('sfx/Cinematic Whoosh 02.wav'),               vol: 0.20, dur: 2.00 }, // sweeps INTO the HOOK full-screen (crest 1.35 = the cut)
  { t:  4.07, src: staticFile('sfx/Impacts/Soundjay_Impact_Main_01-short.wav'), vol: 0.26, dur: 0.70 }, // IMPACT on the "and then there's TENDIES" hard cut (crest 4.32); pre-trimmed file, silent before the line
  { t: 16.00, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.28, dur: 1.00 }, // cut into the listing beat (16.10)
  { t: 19.10, src: staticFile('sfx/DING.mp3'),                              vol: 0.22, dur: 1.60 }, // receipt ding on BADGE 2, the $16M market cap (crest 19.30)
  { t: 26.30, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_3.wav'), vol: 0.10, dur: 2.50 }, // riser BUILDS INTO the climax and ENDS exactly on it (28.80)
  { t: 28.80, src: staticFile('sfx/Boom - Big Reveal.wav'),                 vol: 0.28, dur: 2.30 }, // IMPACT on the CLIMAX full-screen cut (peak 0.00 = fires on the frame)
];

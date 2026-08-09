import { staticFile } from 'remotion';
import type { BrollEv, Sfx } from './_kit';
import type { BadgeEv, OverlayEv, ThumbDef } from './LivestreamShort';

// ─── tut-94x-euphoria (batch: tutorial, clip #1, variant: full) ─────────────────────────────────
// "94X on $TUT, and It's Pumping Again" — the stream's emotional core. He called Tutorial ($TUT) on
// BNB publicly, it did a 94X, and it is pumping again LIVE on his CoinMarketCap page: 638% for the
// month, a 65 million market cap, roughly 65x off a $1-point-something million bottom. Then the pair
// of community numbers (the 94X, then a 550X on NYX one week later) and the euphoria break.
//
// Base clip: tut-94x-euphoria-final.mp4 (4b cut -> Phase 5 tighten -> 5B desilence at min-sil 0.95
// -> 5C filler). ALREADY composited vertical (CoinMarketCap screen-share on top, webcam below),
// 1080x1920 @ 25 fps, 78.83 s. FINAL, do NOT re-cut and do NOT re-split the zones. The comp runs at
// 30 fps; OffthreadVideo resamples the 25 fps source by TIME, so every cue below is plain seconds
// taken from the clip's OWN Whisper word timings (clip-relative, 0-based).
//
// ⚠ The file referenced here is the render-assets COPY, already re-encoded to a SEEK-FRIENDLY GOP
//   (-g 25 -keyint_min 25 -bf 0 -sc_threshold 0) by setup_render_assets.py. The canonical spine in
//   the clip folder is never touched.
//
// Render (public-dir = the BATCH render-assets/, SHARED with the other clips of this batch, which
// are built in parallel; every file of this clip is `*tut94x*` keyed so the builders cannot collide):
//   npx remotion render src/index.ts TutTut94xEuphoria \
//     out/tutorial/1-tut-94x-euphoria.mp4 \
//     --public-dir "<repo>/video-creation/shorts/tutorial/render-assets"

export const TUT94X_FPS = 30;
export const TUT94X_DURATION = 2364; // 78.83 s @30; last frame index 2363 = t 78.767 s, inside the clip

export const CLIP_TUT94X  = staticFile('tut-94x-euphoria.mp4');
export const THUMB_TUT94X = staticFile('thumb-tut94x-cover.png');

// Layout geometry, MEASURED on this clip (row-mean gradient scan at t=1/8/15/22/30/40/50/60/70/78 s;
// all TEN frames put the hard screen-share/webcam divider on the same row, delta 64-218).
export const TUT94X_SEAM  = 853; // content zone = 0..853 (the live CoinMarketCap $TUT page); webcam below
export const TUT94X_CAP_Y = 895; // caption centre: 42 px under the seam. A 2-line caption spans
                                 // 810-980, i.e. it stays above his eyes (measured at 1150+ in every
                                 // sampled frame) and inside the component's readability scrim.

// ⛔ ─── MIKE'S PHASE 7 VISUAL DIRECTIVE, WHOLE BATCH (2026-08-09, verbatim) ──────────────────────
// "i only do not want full screen broll, nor content zone broll. you can do captions, sfx, and any
//  overlaying graphics or images with background transparency."
// Recorded in shorts/tutorial/tighten-plan.json -> mike_4b.build_directives. So this comp ships
// ZERO `mode:'full'` and ZERO `mode:'content'` b-roll; every generated asset is composited through
// OVERLAYS_TUT94X as a TRUE alpha PNG sticker (blend 'normal'), and the numbers are code-drawn
// badges. The test is COVERAGE, not the asset source.
//
// This is a DEVIATION from the finalized-short checklist item #4 (the ~30 % zone/full b-roll
// coverage budget), it is Mike's own written instruction rather than a builder choice, and it is
// reported as a deviation in the build report. It is NOT a silent omission.
//
// It is also right on this clip: the content zone is the RECEIPT. The live CoinMarketCap Tutorial
// page shows $66.8M market cap, +642.1% (1M), the 0.080 price tag and the green pump curve, and from
// ~55 s it switches to the All / Mkt Cap view showing the 66.48M all-time spike off a flat 2025
// base. He points at it with his hand (measured at 60 s). Covering any of it would delete the
// evidence for every number he says.
export const BROLL_TUT94X: BrollEv[] = [];

// ⛔ ─── HARD GUARD: the Schwarzenegger soundboard drop, 66.30-71.40 s ───────────────────────────
// Master 353.36-358.62 ("And that's why CodeMonkey Mike has the greatest crypto community on the
// planet") is a SOUNDBOARD DROP, not Mike speaking, and the tighten pass relocked the segment
// out-point to 358.62 specifically to rescue 0.31 s of it. MEASURED on this spine, it is not
// audio-only either: the base video cuts to a FULL-FRAME Arnold Schwarzenegger clip. Green-screen
// fraction in the face zone (rows 1000-1800) sampled at 10 fps across 64.5-73.5 s reads
// 0.159 -> 0.000 at 66.30 -> 0.135 at 71.40.
// NOTHING may cover it: no overlay image, no badge, no logo plate, and no SFX cue (a sting on top of
// the drop covers it in the audio domain). Captions only. Enforced below at bundle time.
export const ARNOLD_IN = 66.30;
export const ARNOLD_OUT = 71.40;
const ARNOLD_GUARD_IN = 66.00;   // 0.30 s of headroom on each side
const ARNOLD_GUARD_OUT = 71.42;  // the post-drop whoosh may start the instant the drop is over

// ─── Transparent overlay stickers (the ONLY generated imagery in the running video) ─────────────
// Six alpha PNGs (alpha = boosted luminance, see video-creation/_make_tut94x_overlays_alpha.py):
// 43-73 % of every file is FULLY transparent, so these float over the screen-share instead of
// filling it. blend 'normal' is MANDATORY here - the CMC page is near-white and a 'screen' blend
// cannot darken white, so a bright sticker would simply vanish over it.
//
// Placement uses the two low-value regions that are free in EVERY non-PiP frame (verified on
// t=1/8/15/22/24/30/38/40/42/60/78 s):
//   P-RIGHT  left 690 top 385 w 295  -> x 690-985, y 385-680  ("Analyze Chart" / the empty
//                                       "Wallet Not Connected" block; the right edge stops at 985 so
//                                       the platform's 90 px action-button rail stays clear)
//   P-LEFT   left  60 top 390 w 290  -> x  60-350, y 390-680  (the 48% bar, the Boost button, the ad
//                                       tile and the Website/X/contract links)
// Both add the component's +/-10 px float, so the real bottom edge is 690-695.
// NEVER used: the chart plot and its curve (x 207-830, y 60-390), the left stats column (market cap
// / volume / liq / supply / holders, y 140-385) and the Markets exchange table rows. Those are the
// receipt.
//
// ⚠ THE BOTTOM EDGE IS SET BY THE LIVESTREAM'S OWN CHAT OVERLAY, not by taste. Measured on the base
// video: from 23.0 s to 43.0 s Mike's stream renders a viewer question ("@Muadib1234 / In your
// opinion, what is the best meme coin on the Robinhood chain") as a dark plate occupying roughly
// y 700-800, x 0-845. The first pass put P-RIGHT at y 400-740, P-LEFT at 430-750 and the badges at
// top 650 (box 554-746), all of which clipped the top of that plate for three of the nine graphics.
// Everything was raised so no graphic ever crosses y 700.
//
// Two base-video windows are also avoided outright: the crowd-celebration picture-in-picture that
// covers x 0-935, y 0-550 from 49.0 to 54.5 s, and the Arnold drop above.
export const OVERLAYS_TUT94X: OverlayEv[] = [
  // O1 "we have an old time favorite that is PUMPING LIKE CRAZY" (0.00-6.06)
  { src: staticFile('broll-tut94x-arrow.png'),    tIn:  1.70, tOut:  4.50, top: 385, left: 690, width: 295, blend: 'normal' },
  // O2 "this is $TUT on BNB" (9.18-12.06) - the named project, generated WITH the on-disk reference
  { src: staticFile('broll-tut94x-coin.png'),     tIn:  9.50, tOut: 12.20, top: 390, left:  60, width: 290, blend: 'normal' },
  // O3 "CONGRATULATIONS, PEOPLE. man, look at this." (23.62-24.98) - inside the chat-plate window
  { src: staticFile('broll-tut94x-confetti.png'), tIn: 23.50, tOut: 25.80, top: 385, left: 690, width: 295, blend: 'normal' },
  // O4 "like 65X FROM THE BOTTOM, man" (37.94-41.42) - the second, emphatic statement of the number
  { src: staticFile('broll-tut94x-rocket.png'),   tIn: 38.20, tOut: 41.00, top: 390, left:  60, width: 290, blend: 'normal' },
  // O5 "look at, look at this. LOOK, LOOK. holy crap." (46.02-49.44) - the live chart reveal, the
  // protected stutter. Ends 0.10 s before the crowd PiP takes the top of the frame at 49.00.
  { src: staticFile('broll-tut94x-firework.png'), tIn: 46.60, tOut: 48.90, top: 385, left: 690, width: 295, blend: 'normal' },
  // O6 "HOLY CRAP. it feels good to actually see this thing pumping again" (72.40-75.12), safely
  // after the Arnold drop ends at 71.40. Nothing rides the deliberate hard-out ("oh my god." 77.82).
  { src: staticFile('broll-tut94x-sparkle.png'),  tIn: 72.80, tOut: 75.40, top: 390, left:  60, width: 290, blend: 'normal' },
];

// ─── Code-drawn badges (the three hard numbers) ─────────────────────────────────────────────────
// One line + one sub each, deliberately: the shared `Badge` is `left:50%` with `translate(-50%,-50%)`
// and no width, so a shrink-to-fit box caps at 540 px (~436 px of text after the 52 px side padding).
// A 2-line badge measured ~252 px tall and its bottom edge came within ~20 px of a 2-line caption's
// top edge (810). Dropping `line2` puts the box at ~192 px; at top 590 it spans y ~494-686, i.e. it
// sits UNDER the chart range slider (bottom ~480), ABOVE the livestream's own chat plate (top ~700,
// on screen 23.0-43.0) and ~124 px clear of the caption band. Verified on the render at 21.4 s.
// No badge shares a time window with any overlay (smallest gap 0.30 s, B1 -> O3), so the "never
// collide in time AND space" rule holds on the time axis alone.
export const BADGES_TUT94X: BadgeEv[] = [
  { tIn: 20.90, tOut: 23.20, color: '#ffa800', line1: '94X',  sub: 'CALLED PUBLICLY', top: 590 },
  { tIn: 27.50, tOut: 29.40, color: '#39ff14', line1: '638%', sub: 'IN ONE MONTH',    top: 590 },
  { tIn: 61.40, tOut: 64.60, color: '#ffe600', line1: '550X', sub: 'ONE WEEK LATER',  top: 590 },
];

// ─── Frame-0 thumbnail (IG/TikTok cover) ────────────────────────────────────────────────────────
// ONE frame only (LivestreamShort defaults thumb.durS to 1/fps), base video from frame 1. The art is
// generated WITH the $TUT reference (941x1672, 9:16) and the hook text is drawn in CODE on top,
// never baked into the image. titleSize 104: the longest line is 13 characters, which measures
// ~923 px inside the 968 px text box. No em dashes.
export const THUMB_DEF_TUT94X: ThumbDef = {
  img: THUMB_TUT94X,
  title: '94X ON $TUT\nAND IT\'S\nPUMPING AGAIN',
  chip: 'YOU SHOULD HAVE KNOWN',
  chipColor: '#ffa800',
  titleSize: 104,
};

// ─── SFX (shared library, COPIED into render-assets/sfx/; every event stays under the VO) ───────
// Whoosh on the frame-0 cover cut and on the sticker pops, two risers that each BUILD INTO an impact
// (per Impacts/WHEN-TO-USE-IMPACTS.md, "reserve them for the beats that actually matter"), impacts
// on the two community numbers and on the live chart reveal, and a money hit on "congratulations".
//
// ⚠ Cue points are each file's own PEAK position, not its file start. Envelopes measured on THIS
//   machine at 10 ms RMS for this build: transition_rapid_whoosh peaks 0.18 s in -
//   Cinematic Whoosh 02 peaks 0.87 - DING peaks 0.21 - Cash Register Kaching attacks 0.52 and peaks
//   0.95 - Kick_Impact_01 peaks 0.18 (raw tail 3.92 s) - Impact_Hit_01-2 peaks 0.13 (raw tail
//   6.28 s) - Boom - Big Reveal-short peaks 0.04 - Tension_Rise_Logo_Reveal_3 attacks 1.09 and
//   peaks 3.48. Each cue starts EARLY by exactly that offset so the crest lands on the frame it
//   punctuates, each riser's `dur` is 2.50 so it ENDS exactly on its impact instead of smearing over
//   the line after it, and the two long-tailed impacts are truncated by `dur` (the contract's
//   "try TIMING first" knob) rather than turned down.
//
// ⛔ NOTHING is scheduled between 66.00 and 71.42 s: that is the Schwarzenegger drop, and a sting on
//   top of it would cover it. The next cue is the 71.42 whoosh, which starts 0.02 s AFTER the drop
//   ends. Nothing is placed on the deliberate hard-out ("oh my god." 77.82-78.72) either.
export const SFX_TUT94X: Sfx[] = [
  { t:  0.00, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.26, dur: 1.00 }, // frame-0 thumbnail cut (crest 0.18)
  { t:  0.83, src: staticFile('sfx/Cinematic Whoosh 02.wav'),               vol: 0.18, dur: 1.60 }, // sweeps into the O1 pump arrow (crest 1.70)
  { t:  9.32, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.24, dur: 1.00 }, // the $TUT coin lands as he names it (crest 9.50)
  { t: 18.40, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_3.wav'), vol: 0.10, dur: 2.50 }, // riser BUILDS INTO the 94X and ENDS exactly on it (20.90)
  { t: 20.72, src: staticFile('sfx/Impacts/Kick_Impact_01.wav'),            vol: 0.26, dur: 1.10 }, // IMPACT on the 94X badge (crest 20.90), tail trimmed off "did that 94x"
  { t: 22.98, src: staticFile('sfx/Cash Register Kaching  Sound Effect HD.mp3'), vol: 0.16, dur: 1.60 }, // money hit on "congratulations, people" (attack 23.50 = the confetti pop)
  { t: 27.39, src: staticFile('sfx/DING.mp3'),                              vol: 0.20, dur: 1.30 }, // 638% badge (crest 27.60, inside the 0.74 s gap after "month.")
  { t: 38.02, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.22, dur: 1.00 }, // the rocket pops on the second "65x from the bottom" (crest 38.20)
  { t: 46.47, src: staticFile('sfx/Impacts/Impact_Hit_01-2.wav'),           vol: 0.26, dur: 0.90 }, // IMPACT on the live chart reveal / firework (crest 46.60), tail trimmed
  { t: 58.86, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_3.wav'), vol: 0.09, dur: 2.50 }, // riser BUILDS INTO the 550X and ENDS exactly on it (61.36)
  { t: 61.36, src: staticFile('sfx/Boom - Big Reveal-short.wav'),           vol: 0.28, dur: 1.05 }, // IMPACT on the 550X badge (crest 61.40)
  { t: 71.42, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.24, dur: 1.00 }, // out of the Arnold drop, in the 1.00 s of silence before "holy crap." (crest 71.60)
];

// ─── Bundle-time guards ─────────────────────────────────────────────────────────────────────────
// Mechanical, because the two rules they enforce are exactly the ones this repo keeps re-breaking by
// hand: graphics colliding in time, and something being laid over a protected beat. They run at
// import, so a violation fails the bundle instead of shipping.
type Win = { id: string; tIn: number; tOut: number };

const GFX_WINDOWS: Win[] = [
  ...OVERLAYS_TUT94X.map((o, i) => ({ id: `O${i + 1} ${o.src.split('/').pop()}`, tIn: o.tIn, tOut: o.tOut })),
  ...BADGES_TUT94X.map((b, i) => ({ id: `B${i + 1} ${b.line1}`, tIn: b.tIn, tOut: b.tOut })),
];

function assertNoGraphicsOverArnold() {
  const bad = GFX_WINDOWS.filter(w => w.tIn < ARNOLD_GUARD_OUT && w.tOut > ARNOLD_GUARD_IN);
  if (bad.length) {
    throw new Error(
      `tut-94x-euphoria: ${bad.map(b => b.id).join(', ')} overlaps the Schwarzenegger soundboard drop ` +
      `(${ARNOLD_IN}-${ARNOLD_OUT} s). Mike's directive: captions only over that line, nothing may cover it.`);
  }
  const sfxBad = SFX_TUT94X.filter(s => s.t < ARNOLD_GUARD_OUT && s.t + (s.dur ?? 2) > ARNOLD_GUARD_IN);
  if (sfxBad.length) {
    throw new Error(
      `tut-94x-euphoria: an SFX cue at t=${sfxBad[0].t} runs across the Schwarzenegger drop ` +
      `(${ARNOLD_IN}-${ARNOLD_OUT} s). A sting on top of the drop covers it in the audio domain.`);
  }
}

function assertNoGraphicsOverlap() {
  const s = [...GFX_WINDOWS].sort((a, b) => a.tIn - b.tIn);
  for (let i = 1; i < s.length; i++) {
    if (s[i].tIn < s[i - 1].tOut) {
      throw new Error(`tut-94x-euphoria: graphics overlap in time: ${s[i - 1].id} and ${s[i].id}. ` +
        `Overlays and badges must never share a frame (SKILL Phase 7 production rule 3).`);
    }
  }
  // No graphic may start under the frame-0 thumbnail cover (one frame = 1/30 s).
  const early = s.filter(w => w.tIn < 1 / TUT94X_FPS);
  if (early.length) throw new Error(`tut-94x-euphoria: ${early[0].id} starts under the frame-0 thumb.`);
}

function assertNoZoneBroll() {
  if (BROLL_TUT94X.length) {
    throw new Error(`tut-94x-euphoria: BROLL_TUT94X must stay EMPTY. Mike's Phase 7 directive for ` +
      `batch tutorial bans full-screen and content-zone b-roll; generated imagery ships as ` +
      `transparent overlay stickers only.`);
  }
}

assertNoZoneBroll();
assertNoGraphicsOverArnold();
assertNoGraphicsOverlap();

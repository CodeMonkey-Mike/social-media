// october-bottom / clip #5 — cooper-robinhood-real-dog ("Cooper: The Real Robinhood Office Dog at 237k")
//
// Spine: cooper-robinhood-real-dog-tightened-desilenced.mp4, restaged into the SHARED batch
// render-assets with the GOP fix (-g 25 -keyint_min 25 -bf 0 -sc_threshold 0, forced CFR 25) so
// OffthreadVideo frame seeks land exactly. 66.20 s = 1655 frames @ 25 fps native.
//
// Zone seam MEASURED on this clip (row-gradient scan at 6 s / 24 s / 48 s): y = 854.
// Caption band at y = 955 — below the seam, above Mike's forehead, and clear of the livestream
// chat overlay baked into the base at y 726..790.
//
// PALETTE: Robinhood context = bright neon LIME green. NEVER teal (teal reads as Kaspa).
// Cooper has no logo asset and none is ever invented: every Cooper visual is a REAL black labrador.
//
// Coverage: 21.75 s b-roll / 66.20 s = 32.9 % (band 25-35 %), 9 distinct images, zero reuse,
// 3 full-screens (hook / pre-climax / close). Plan + receipts:
// video-creation/shorts/october-bottom/cooper-robinhood-real-dog/BROLL-PLAN.md
import { staticFile } from 'remotion';
import type { ShortData } from './LivestreamShort';
import { CAPTIONS_CRD } from './captionsCrd';

export const CRD_FPS = 25;
export const CRD_DUR_S = 66.2;
export const CRD_FRAMES = 1655;

/** Robinhood-context neon lime. Deliberately NOT the house TEAL (teal = Kaspa). */
export const CRD_LIME = '#c9ff00';

export const D_CRD: ShortData = {
  clip: staticFile('cooper-robinhood-real-dog.mp4'),
  fps: CRD_FPS,
  durationS: CRD_DUR_S,
  seam: 854,
  capY: 955,
  captions: CAPTIONS_CRD,

  // ── B-roll ──────────────────────────────────────────────────────────────────────────────────
  // Every gap between these windows is a DELIBERATE base beat (the screen-share receipt: the real
  // @robinhoodcooper profile, the Robinhood "design team" post, and the DexScreener 237.63K page).
  broll: [
    // HOOK full-screen — opens on the base for 1.56 s first (frame-0 cover rule), then the reveal.
    { src: staticFile('broll-crd-hook.png'), tIn: 1.60, tOut: 4.10, mode: 'full' },
    // "it's not a dog with a pipe" — the joke made literal, over an off-message chart.
    { src: staticFile('broll-crd-pipe.png'), tIn: 8.10, tOut: 10.30, mode: 'content' },
    // 10.30-18.10 BASE: the Robinhood post + the real photo of Cooper in the office is on screen.
    // "toshi is like brian armstrong's real cat" — REFERENCE BEAT (schedule-tweets/images/reference/toshi.png).
    { src: staticFile('broll-crd-toshi.png'), tIn: 18.10, tOut: 20.90, mode: 'content' },
    // 20.90-27.30 BASE: @robinhoodcooper profile + the quoted Robinhood post (receipt).
    { src: staticFile('broll-crd-meme.png'), tIn: 27.30, tOut: 29.40, mode: 'content' },
    // 29.40-32.20 BASE: the retweeted post itself.
    // "what if should be on the top" — REFERENCE BEAT (schedule-tweets/images/reference/what-if.jpg).
    { src: staticFile('broll-crd-whatif.png'), tIn: 32.20, tOut: 34.90, mode: 'content' },
    // PRE-CLIMAX full-screen — "still insanely early", riser underneath.
    { src: staticFile('broll-crd-early.png'), tIn: 39.60, tOut: 42.40, mode: 'full' },
    // 42.40-51.60 BASE (the longest gap, on purpose): DexScreener COOPER/WETH reads 237.63K on
    // screen exactly while he says the number. The payoff is punched by the badge + boom, never by
    // covering the receipt.
    { src: staticFile('broll-crd-russell.png'), tIn: 51.60, tOut: 54.10, mode: 'content' },
    // 54.10-57.90 BASE: the CoinMarketCap RUSSELL page.
    { src: staticFile('broll-crd-12x.png'), tIn: 57.90, tOut: 60.20, mode: 'content' },
    // 60.20-64.30 BASE: the profile "Joined July 2026" while he says "six days old".
    // CLOSE full-screen. tOut is parked PAST the last frame (66.20 s = frame 1655) on purpose:
    // BrollLayer fades out over the final 0.12 s of a window, so a tOut landing exactly on the comp
    // end ghosts the base video back in for the last 3 frames.
    { src: staticFile('broll-crd-close.png'), tIn: 64.30, tOut: 67.20, mode: 'full' },
  ],

  // ── TRUE-ALPHA OVERLAY (this clip's own unique transparent PNG, not a code-drawn plate) ────────
  // Glow-on-black lime paw print converted with alpha = 0 if maxRGB < 40 else min(255,(maxRGB-40)*2.6)
  // then cropped to the paw bbox (maxRGB, not luminance: a saturated glow has low luminance but is
  // clearly "on"). A GENERIC dog motif, never a $COOPER mark - Cooper has no logo and one is never
  // invented. Floated in the 4.10-8.10 BASE gap over an off-message NINEHOOD chart, so it costs no
  // b-roll coverage. Band x 620..980 / y 150..489: clear of the baked livestream chat overlay
  // (726..790), the seam (854), the caption band (~877..1033) and the 46.70 badge (both in time and
  // in space - the badge does not exist until 46.70).

  overlays: [
    { src: staticFile('overlay-crd-paw.png'), tIn: 4.95, tOut: 7.15, top: 150, left: 620, width: 360, blend: 'normal' },
  ],

  // ── Overlays ────────────────────────────────────────────────────────────────────────────────
  // Exactly ONE timed graphic besides the frame-0 cover, so nothing can collide in time OR space.
  // Centred at top 600 => spans ~509..691: clear of the baked chat overlay (726..790), the seam
  // (854) and the caption band (~915..995). No b-roll is active in 46.70-49.80.
  // SPLIT into line1/line2 (was a single '237K MARKET CAP'): as one line it wrapped to THREE rows at
  // 82 px, blowing the plate to ~350 px tall so it sat straight on the baked chat overlay (726..790).
  // Caught on the draft render 2026-08-05. Two lines + top 560 => the plate spans ~431..689: clear of
  // the chat overlay, the seam (854) and the caption band, and it never covers the DexScreener
  // 237.63K price tag at y~134, which is the receipt this badge is punching.
  badges: [
    { tIn: 46.70, tOut: 49.80, color: CRD_LIME, line1: '237K', line2: 'MARKET CAP', sub: 'STILL INSANELY EARLY', top: 500 },
  ],

  // ── SFX ─────────────────────────────────────────────────────────────────────────────────────
  sounds: [
    { t: 0.00, src: staticFile('sfx/Cinematic Whoosh 02.wav'), vol: 0.34, dur: 1.4 },   // frame-0 cover -> video cut
    { t: 1.60, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.32, dur: 1.2 }, // into the hook full-screen
    // dur 0.80, not 1.40: whisper-verify of the first full mix read "Brian Onstone's" where the spine
    // reads "Brian Armstrong's" — the ting's DECAY TAIL was ringing over 19.16-19.94. A volume sweep
    // proved level is not the lever (0.26/0.14/0.08 all still masked at dur 1.4); truncating the tail
    // at 0.80 restores "Brian Armstrong's" with the impact volume UNCHANGED, so the reveal hit on the
    // Toshi name-drop is not softened. (Method: SKILL QA item 7.)
    { t: 18.10, src: staticFile('sfx/TING SOUND EFFECT.mp3'), vol: 0.26, dur: 0.80 },   // Toshi name-drop
    { t: 32.20, src: staticFile('sfx/TING SOUND EFFECT.mp3'), vol: 0.26, dur: 1.4 },    // what if reveal
    { t: 39.60, src: staticFile('sfx/Cinematic Whoosh 06.wav'), vol: 0.32, dur: 1.4 },  // into the pre-climax full-screen
    { t: 44.00, src: staticFile('sfx/Riser Sound Effect.mp3'), vol: 0.20, dur: 2.7 },   // builds INTO the 237k payoff
    { t: 46.70, src: staticFile('sfx/Boom - Big Reveal.wav'), vol: 0.28, dur: 2.0 },    // 237k payoff + badge
    { t: 51.60, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.30, dur: 1.2 }, // Russell cutaway
    { t: 57.90, src: staticFile('sfx/Cash Register.mp3'), vol: 0.24, dur: 1.8 },        // the 12x win
    { t: 64.30, src: staticFile('sfx/Cinematic Whoosh 06.wav'), vol: 0.34, dur: 1.6 },  // into the close full-screen
  ],

  // ── Frame-0 cover (ONE frame; durS omitted so LivestreamShort uses 1/fps) ────────────────────
  // Title + chip stay CODE-DRAWN over the generated art, never baked into the image.
  thumb: {
    img: staticFile('thumb-crd.png'),
    title: "THE REAL DOG\nIN ROBINHOOD'S\nOFFICE",
    chip: '$COOPER AT 237K',
    chipColor: CRD_LIME,
    // 96, not 108: at 108 the line "IN ROBINHOOD'S" overflows the 968 px title box and wraps, so the
    // cover rendered as FOUR lines with a stranded "IN" (caught on the frame-0 still, 2026-08-05).
    titleSize: 96,
  },

  // No logo/watermark: $COOPER has no real logo asset and one must never be invented.
};

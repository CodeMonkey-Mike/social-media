// constants-rof.ts — batch `october-bottom`, clip #4: ring-of-fire-meme-judgment (variant `long`).
// Title: "Meme Coin: Unc Goes Down Down Down..."
//
// Data-only module for the shared <LivestreamShort> renderer. Plan of record (beats, budget,
// references, SFX, collision map, caption gates):
//   video-creation/shorts/october-bottom/ring-of-fire-meme-judgment/BROLL-PLAN.md
//
// Spine: 48.84 s, 1080x1920, NATIVE 25 fps -> the comp runs at 25 fps too (1:1 frame mapping, no
// judder from a 25->30 conversion) => 1221 frames. Same choice as siblings #2 and #3 in this batch.
// Every cue below is in SECONDS, so the fps choice moves nothing.
// The render copy in render-assets/ is that spine re-encoded with a 1 s GOP
// (-g 25 -keyint_min 25 -bf 0 -sc_threshold 0) so OffthreadVideo seeks land on a keyframe; the
// canonical spine was NOT touched.
//
// Measured seam (screen-share / webcam divider) = 854 px (row-gradient scan of frames 1/12/25/40:
// row 853 mean ~220-231, row 854 mean ~27-34). Captions sit at y=950, i.e. BELOW the seam and far
// above his eyes (~1150+), so no content-zone image ever lands on them.
//
// EDITORIAL GATES (batch delegation 2026-08-04):
//  1. The Johnny Cash / Ring of Fire singalong was CUT from this spine at Mike's order. There is
//     zero licensed music in the clip and NOTHING here may reference it: no flames, no fire rings,
//     no guitars. The peak is the LINE "500k market cap and it only goes down, down, down" and the
//     comedy rides the falling-chart bit (beat 3 + the accumulating caption staircase).
//  2. The mocked meme coin is NEVER named or branded. Every generated coin in this clip is a BLANK,
//     symbol-free disc; no invented logo, no invented ticker, no name on screen.
//  3. The receipts are REAL: beats 5 and 6 were generated WITH schedule-tweets/images/reference/
//     velvet.png and LAB.png, so both marks are the actual branding.
import { staticFile } from 'remotion';
import type { ShortData } from './LivestreamShort';
import { GREEN, ORANGE, RED } from './_kit';
import { CAPTIONS_ROF } from './captionsRof';

export const ROF_FPS = 25;
export const ROF_DURATION_S = 48.84;
export const ROF_FRAMES = Math.round(ROF_DURATION_S * ROF_FPS); // 1221

// NOTE: every asset below is a LITERAL staticFile call with an inline string. The batch asset stager
// and the finalized-short gate both scan this file with a regex, so wrapping the calls in a helper
// would make both of them see zero refs.
export const D_ROF: ShortData = {
  clip: staticFile('ring-of-fire-meme-judgment.mp4'),
  fps: ROF_FPS,
  durationS: ROF_DURATION_S,
  capY: 950,
  seam: 854,
  captions: CAPTIONS_ROF,

  // ── B-ROLL — 7 beats / 7 distinct assets, 15.74 s over 48.84 s = 32.2 % coverage ──────────────
  // (target ~30 %, band 25-35 %). 3 full-screens: hook / down-down-down climax / close (cap is 3).
  // Every BASE stretch is deliberate: the screen-share is the coin's own DexScreener page bleeding
  // down and to the right, which IS the joke, so it stays visible ~68 % of the clip.
  broll: [
    { src: staticFile('broll-rof-hook.png'),      tIn:  0.90, tOut:  2.90, mode: 'full'    }, // "how do you make judgments off of coins these days?"
    { src: staticFile('broll-rof-listing.png'),   tIn:  9.55, tOut: 11.35, mode: 'content' }, // "cost like a hundred grand and get on MEXC"
    // BASE 11.35-19.55 (8.20 s, the longest gap, deliberate): he points at the dead chart while he
    // says "what the hell is it doing? it's doing nothing. it's crap." Broken up by the alpha coin
    // overlay (12.60) and the 500K badge (17.60), neither of which costs b-roll coverage.
    { src: staticFile('broll-rof-downdown.png'),  tIn: 19.55, tOut: 22.60, mode: 'full'    }, // CLIMAX "500k market cap ... only goes down, down, down" (also hides the 27 s singalong-excision join at 22.06-22.46)
    { src: staticFile('broll-rof-utility.png'),   tIn: 29.75, tOut: 31.95, mode: 'content' }, // "great coins when it comes to utility coins"
    { src: staticFile('broll-rof-velvet58x.png'), tIn: 35.90, tOut: 37.80, mode: 'content' }, // RECEIPT "the 58x on velvet" (velvet.png reference)
    { src: staticFile('broll-rof-lab350x.png'),   tIn: 37.80, tOut: 39.90, mode: 'content' }, // RECEIPT "the month before that, 350x on lab" (LAB.png reference) - BUTTED to the beat above so it hard-cuts, no base flash
    { src: staticFile('broll-rof-close.png'),     tIn: 46.40, tOut: 49.10, mode: 'full'    }, // "been out for a couple of months and it looks like crap" (tOut past the end on purpose: no fade on the last frames)
  ],

  // ── BADGES (code-drawn) — all in the SAME top-300 band, so their windows are strictly disjoint
  // in time (Badges renders tIn-0.1 .. tOut+0.1: 11.40 < 17.50, 19.55 < 36.00, 37.80 < 38.10,
  // 39.90 < end). None starts under the frame-0 thumb. ────────────────────────────────────────────
  badges: [
    { tIn:  9.90, tOut: 11.30, color: ORANGE, line1: '$100K',     sub: 'JUST TO GET LISTED' },
    { tIn: 17.60, tOut: 19.45, color: RED,    line1: '500K',      line2: 'MARKET CAP', sub: 'AND IT ONLY GOES DOWN' },
    // The two receipt badges sit at top 700, NOT 300: at 300 they landed straight on top of the real
    // Velvet wordmark and the real LAB wordmark in the b-roll (caught on the draft render, 2026-08-04).
    // 700 puts them in the lower content zone (band 600-800), clear of both marks, clear of the seam
    // (854) and clear of the caption band (905-995).
    { tIn: 36.10, tOut: 37.70, color: GREEN,  line1: '58X',       sub: 'VELVET', top: 700 },
    { tIn: 38.20, tOut: 39.80, color: GREEN,  line1: '350X',      sub: 'LAB',    top: 700 },
  ],

  // ── TRUE-ALPHA OVERLAY (this clip's own unique transparent PNG, not a code-drawn plate) ────────
  // Glow-on-black render converted with alpha = 0 if maxRGB < 70 else min(255,(maxRGB-70)*2.6), then
  // cropped to the coin bbox. maxRGB (not luminance) because a saturated red glow has LOW luminance
  // but is clearly "on"; a luminance curve ate the coin body. Floated over the content zone inside a
  // BASE gap, so it costs no b-roll coverage. Band left 300-760 / top 170-648: never touches a badge
  // window in time (11.30 < 12.60, 14.60 < 17.60) and never reaches the caption band (905-995).
  overlays: [
    { src: staticFile('overlay-rof-coin.png'), tIn: 12.60, tOut: 14.60, top: 170, left: 300, width: 460, blend: 'normal' },
  ],

  // ── SFX — 18 events / 10 distinct files. Whoosh on the frame-0 cover cut and on every b-roll
  // transition, cash on the 100-grand listing fee, riser into the climax, impact on the falling
  // chart, three DESCENDING taps on the three "down"s, dings on the two receipts, soft impact on
  // the closing "crap". The three "down" taps are the quietest cues in the clip because they land
  // ON the payoff words; the final MIX is whisper-verified for VO masking. ───────────────────────
  sounds: [
    { t:  0.00, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.26, dur: 1.2 },
    { t:  0.80, src: staticFile('sfx/Cinematic Whoosh 02.wav'),     vol: 0.22, dur: 1.4 },
    { t:  2.85, src: staticFile('sfx/Cinematic Whoosh 06.wav'),     vol: 0.20, dur: 1.2 },
    { t:  9.45, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.28, dur: 1.2 },
    { t: 10.00, src: staticFile('sfx/Cash Register.mp3'),           vol: 0.22, dur: 1.8 },
    { t: 13.24, src: staticFile('sfx/ding/sudden-shock.mp3'),       vol: 0.16, dur: 1.4 },
    { t: 17.55, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_2.wav'), vol: 0.15, dur: 2.2 },
    { t: 19.55, src: staticFile('sfx/Impacts/Impact_Hit_01-2.wav'), vol: 0.28, dur: 2.4 },
    { t: 20.74, src: staticFile('sfx/Impacts/Impact_Hit_01-1.wav'), vol: 0.12, dur: 1.0 },
    { t: 21.32, src: staticFile('sfx/Impacts/Impact_Hit_01-3.wav'), vol: 0.13, dur: 1.0 },
    { t: 21.66, src: staticFile('sfx/Impacts/Kick_Impact_01.wav'),  vol: 0.14, dur: 1.0 },
    { t: 22.55, src: staticFile('sfx/Cinematic Whoosh 02.wav'),     vol: 0.20, dur: 1.2 },
    { t: 29.65, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.26, dur: 1.2 },
    { t: 35.80, src: staticFile('sfx/Cinematic Whoosh 06.wav'),     vol: 0.24, dur: 1.2 },
    { t: 36.40, src: staticFile('sfx/TING SOUND EFFECT.mp3'),       vol: 0.24, dur: 1.6 },
    { t: 38.86, src: staticFile('sfx/DING.mp3'),                    vol: 0.22, dur: 1.6 },
    { t: 46.30, src: staticFile('sfx/Cinematic Whoosh 02.wav'),     vol: 0.24, dur: 1.2 },
    { t: 48.02, src: staticFile('sfx/Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3'), vol: 0.16, dur: 1.6 },
  ],

  // ── FRAME-0 COVER (ONE frame only; LivestreamShort defaults thumbDur to 1/fps) ─────────────────
  // Generated background art with the title + chip drawn in CODE on top, never baked into the image.
  thumb: {
    title: 'IT ONLY\nGOES DOWN\nDOWN DOWN',
    chip: '500K MARKET CAP',
    chipColor: RED,
    titleSize: 118,
    img: staticFile('thumb-rof.png'),
  },
};

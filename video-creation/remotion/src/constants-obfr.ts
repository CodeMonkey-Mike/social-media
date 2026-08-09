// constants-obfr.ts — data for "The Bottom Is Being Front-Run"
// batch October-pumps, clip #2, slug october-bottom-frontrun (variant: full)
//
// Contract: video-creation/livestream-repurpose/skills/remotion-shorts-build/SKILL.md
// Plan:     video-creation/shorts/October-pumps/october-bottom-frontrun/BROLL-PLAN.md
//
// Render (public-dir = the CLIP's render-assets/, which holds the spine + thumbnail + b-roll + sfx):
//   npx remotion render src/index.ts OctoberBottomFrontrun out/October-pumps/2-october-bottom-frontrun.mp4 \
//     --public-dir "../shorts/October-pumps/october-bottom-frontrun/render-assets"
import { staticFile } from 'remotion';
import { CAPTIONS } from './captionsObfr';
import type { ShortData } from './LivestreamShort';
import type { BrollEv, Sfx } from './_kit';

export const OBFR_FPS = 30;
export const OBFR_DURATION = 2837; // 94.567 s @30, just inside the 94.584 s spine (no black tail frame)

export const OBFR_CLIP = staticFile('october-bottom-frontrun-final.mp4');
export const THUMB_OBFR = staticFile('thumbnail-obfr.png');

// Measured on THIS clip (row-gradient scan at t=3/20/45/70/90s): the screen-share (Dream Crypto
// YouTube channel page) ends and the webcam starts at y=853. Content-mode b-roll covers 0..853.
export const OBFR_SEAM = 853;
// Caption centre: 72 px below the seam, above his hairline (~1000), nowhere near his eyes (~1430).
export const OBFR_CAP_Y = 925;

// ─── B-ROLL ──────────────────────────────────────────────────────────────────────────────────────
// HALVED budget (SKILL "B-roll coverage budget"): 29.10 s of 94.58 s = 30.8 % b-roll / 69.2 % base.
// 11 distinct images, 3 full-screens (hook / receipt climax / punchline) = the firm 1-3 cap.
// The screen-share IS the receipt in this clip (his video titles), so base stretches are deliberate.
export const BROLL_OBFR: BrollEv[] = [
  // BASE 0.00-2.60 — frame-0 cover hands off to Mike + the channel page.
  { src: staticFile('broll-obfr-same-phrase.png'),      tIn:  2.60, tOut:  5.10, mode: 'content' }, // "actually says the same things as me"
  // BASE 5.10-6.60 (1.50 s gap before the full-screen, never a sub-1s flash)
  { src: staticFile('broll-obfr-zombies.png'),          tIn:  6.60, tOut:  9.30, mode: 'full'    }, // HOOK: "four year cycle zombies... this is my phrase"
  // BASE 9.30-17.00 — he says the title that is literally on screen ("do not wait until october")
  { src: staticFile('broll-obfr-frontrun.png'),         tIn: 17.00, tOut: 20.00, mode: 'content' }, // "the bottom is being front-run"
  // BASE 20.00-31.00 — pure explanation over the receipt page
  { src: staticFile('broll-obfr-september-red.png'),    tIn: 31.00, tOut: 33.40, mode: 'content' }, // "september is always red"
  { src: staticFile('broll-obfr-red-candles.png'),      tIn: 33.40, tOut: 35.80, mode: 'content' }, // adjacent -> HARD CUT, "in a post-halving year"
  // BASE 35.80-43.00
  { src: staticFile('broll-obfr-stampede.png'),         tIn: 43.00, tOut: 45.60, mode: 'content' }, // "that red september was front-run"
  // BASE 45.60-51.40 (carries the alpha overlay at 47.0-50.0)
  { src: staticFile('broll-obfr-august-low.png'),       tIn: 51.40, tOut: 54.10, mode: 'content' }, // "started selling in august... created that low"
  // BASE 54.10-55.60 (1.50 s gap before the full-screen)
  { src: staticFile('broll-obfr-september-green.png'),  tIn: 55.60, tOut: 58.60, mode: 'full'    }, // RECEIPT CLIMAX: "september turned GREEN"
  // BASE 58.60-67.30
  { src: staticFile('broll-obfr-october-zombies.png'),  tIn: 67.30, tOut: 70.20, mode: 'content' }, // "zombies come back in october"
  // BASE 70.20-74.10
  { src: staticFile('broll-obfr-green-candles.png'),    tIn: 74.10, tOut: 76.60, mode: 'content' }, // "pushing those candles green like crazy"
  // BASE 76.60-79.90 (the riser builds here)
  { src: staticFile('broll-obfr-psychiatrist.png'),     tIn: 79.90, tOut: 82.40, mode: 'full'    }, // PUNCHLINE: "appointment with a psychiatrist"
  // BASE 82.40-94.58 — close on Mike, the receipt page still visible
];

// ─── Badges (code-drawn, content zone) ───────────────────────────────────────────────────────────
// Each states something the captions do NOT, and every window sits inside a BASE stretch with no
// b-roll and no other badge/overlay running (overlays must never collide in time AND space).
export const BADGES_OBFR = [
  { tIn: 21.60, tOut: 25.40, color: '#00e5ff', line1: 'HIS CALL',  line2: 'BOTTOM IS BEHIND US', sub: 'SAME AS MIKE', top: 300 },
  { tIn: 37.20, tOut: 41.20, color: '#ff5252', line1: 'THE RULE',  line2: 'RED SEPTEMBER',       sub: 'EVERY POST-HALVING YEAR', top: 300 },
  { tIn: 59.20, tOut: 62.60, color: '#39ff14', line1: 'THE TELL',  line2: 'EVERYBODY KNEW',      sub: 'SO THE PATTERN MOVED', top: 300 },
  { tIn: 90.60, tOut: 94.10, color: '#ffe600', line1: 'FOLLOW ME', line2: 'FOR THE OCTOBER PLAN', sub: 'DAILY CRYPTO STREAMS', top: 300 },
];

// ─── Transparent alpha overlay (real RGBA PNG, alpha-from-luminance) ─────────────────────────────
// Sits in a base stretch, times/space clear of every badge and every b-roll beat.
export const OVERLAYS_OBFR = [
  { src: staticFile('overlay-obfr-red-arrow.png'), tIn: 47.00, tOut: 50.00, top: 190, left: 300, width: 480, blend: 'normal' as const },
];

// ─── Frame-0 thumbnail (IG/TikTok cover) ─────────────────────────────────────────────────────────
// ONE frame only (LivestreamShort defaults thumb.durS to 1/fps): generated background art with the
// title/chip drawn in CODE on top, never baked into the art. No em dashes.
export const THUMB_DEF = {
  title: 'THE BOTTOM\nIS BEING\nFRONT-RUN',
  chip: 'OCTOBER FOMO IS COMING',
  chipColor: '#00e5ff',
  titleSize: 128,
  img: THUMB_OBFR,
};

// ─── SFX ─────────────────────────────────────────────────────────────────────────────────────────
// Whoosh on the thumbnail cut and on each full-screen transition; an IMPACT on the receipt reveal;
// a RISER that builds into the punchline and is cut by the punchline IMPACT.
export const SFX_OBFR: Sfx[] = [
  { t:  0.02, src: staticFile('sfx/Cinematic Whoosh 02.wav'),          vol: 0.42, dur: 1.20 }, // frame-0 thumbnail cut
  { t:  6.58, src: staticFile('sfx/transition_rapid_whoosh.mp3'),      vol: 0.46, dur: 0.97 }, // cut into the zombie hook
  { t: 55.55, src: staticFile('sfx/Cinematic Whoosh 06.wav'),          vol: 0.42, dur: 1.10 }, // cut into the receipt full-screen
  { t: 56.50, src: staticFile('sfx/Boom - Big Reveal.wav'),            vol: 0.50, dur: 2.40 }, // IMPACT: "september turned GREEN"
  { t: 75.50, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_3.wav'), vol: 0.26, dur: 4.42 }, // RISER into the punchline
  { t: 79.88, src: staticFile('sfx/Impacts/Impact_2.wav'),             vol: 0.48, dur: 2.20 }, // IMPACT on the punchline cut
];

export const OBFR: ShortData = {
  clip: OBFR_CLIP,
  fps: OBFR_FPS,
  durationS: OBFR_DURATION / OBFR_FPS,
  capY: OBFR_CAP_Y,
  seam: OBFR_SEAM,
  captions: CAPTIONS,
  broll: BROLL_OBFR,
  badges: BADGES_OBFR,
  overlays: OVERLAYS_OBFR,
  sounds: SFX_OBFR,
  thumb: THUMB_DEF,
};

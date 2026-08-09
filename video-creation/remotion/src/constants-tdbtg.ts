// constants-tdbtg.ts — data for "TAO Under $200: Don't Be That Guy"
// batch new-bottom, clip #3, slug tao-dont-be-that-guy (variant: full)
//
// Contract: video-creation/livestream-repurpose/skills/remotion-shorts-build/SKILL.md
// Plan:     video-creation/shorts/new-bottom/tao-dont-be-that-guy/BROLL-PLAN.md
//
// Render (public-dir = the CLIP's render-assets/, which holds the spine + thumbnail + b-roll + sfx):
//   npx remotion render src/index.ts TaoDontBeThatGuy out/new-bottom/3-tao-dont-be-that-guy.mp4 \
//     --public-dir "../shorts/new-bottom/tao-dont-be-that-guy/render-assets"
import { staticFile } from 'remotion';
import { CAPTIONS_TDBTG } from './captionsTdbtg';
import type { ShortData, BadgeEv } from './LivestreamShort';
import type { BrollEv, Sfx } from './_kit';

export const TDBTG_FPS = 30;
// Spine is 50.858 s container / 50.840 s video stream @25fps. 1525 @30 = 50.833 s, just inside it,
// so the render never lands on a black tail frame.
export const TDBTG_DURATION = 1525;

export const TDBTG_CLIP = staticFile('tao-dont-be-that-guy.mp4');
export const THUMB_TDBTG = staticFile('thumbnail-tdbtg.png');

// Measured on THIS clip (green-screen onset scan at t=3/12/22/33/41/48 s): rows <=853 are 0 % green,
// rows >=855 are 66-97 % green -> the screen-share ends and the webcam starts at y=855.
// Content-mode b-roll covers 0..856.
export const TDBTG_SEAM = 856;
// Caption centre: 70 px below the seam, on his hairline, ~455 px above his eyes (~1380).
export const TDBTG_CAP_Y = 925;

// ─── B-ROLL ────────────────────────────────────────────────────────────────────────────────────────
// HALVED budget, then HALVED AGAIN by Mike mid-run 2026-07-25 (~3-4 images per clip instead of 6-8):
// 4 distinct images, 12.84 s of 50.84 s = 25.3 % b-roll / 74.7 % base showing. Coverage is held at the
// FLOOR of the documented 25-35 % band by giving the four surviving beats longer windows.
// 2 FULL-SCREEN moments (hook / close) - inside the firm 1-3 cap.
//
// The long 25.70-47.90 base stretch is the POINT of this clip: a measured screen-share cut at 28.75 s
// swaps the off-message CASHCAT dexscreener chart for the REAL Bittensor TAO CoinMarketCap page
// ($190.02 tooltip dated 07/24/2026, 24 h high $194.67, converter 189.93, Binance TAO/USDT $190.42,
// watchlist row "Bittensor TAO $190.46"). That IS the same-day receipt he is describing, so it is shown,
// not covered. Badges B/C/D/E + the riser and peak impact carry that stretch.
export const BROLL_TDBTG: BrollEv[] = [
  // BASE 0.00-1.30 — frame-0 cover hands off to Mike + the screen-share.
  { src: staticFile('broll-tdbtg-hold-the-line.png'), tIn:  1.30, tOut:  4.60, mode: 'full'    }, // HOOK: "just being realistic... when things go down"
  // BASE 4.60-5.40
  { src: staticFile('broll-tdbtg-buy-the-dip.png'),   tIn:  5.40, tOut:  8.60, mode: 'content' }, // THESIS: "just buy more, man, buy the dip"
  // BASE 8.60-22.30 — weak hands / check out of crypto / news flash, sold on camera (badge A)
  { src: staticFile('broll-tdbtg-crying-missed.png'), tIn: 22.30, tOut: 25.70, mode: 'content' }, // FOMO: "crying about how you should have gotten in"
  // BASE 25.70-47.90 — the REAL TAO receipt is on the screen-share from 28.75 (badges B, C, D, E)
  // tOut is deliberately 51.20, PAST the 50.833 s end of the comp: at tOut 50.84 the BrollLayer
  // fade-out (0.12 s) was already ~50 % through on the final rendered frame, ghosting the TAO art
  // over the base video. Running the window past the end keeps opacity 1 to the last frame.
  // Visible duration is unchanged at 2.94 s (47.90 -> 50.833).
  { src: staticFile('broll-tdbtg-tao-100x.png'),      tIn: 47.90, tOut: 51.20, mode: 'full'    }, // CLOSE: "the bittensor TAO... near 100x" (REFERENCE-GATED)
];

// ─── Badges (code-drawn, content zone) ───────────────────────────────────────────────────────────
// Each states something the captions do NOT, and every window sits inside a BASE stretch with no
// b-roll and no other badge running (overlays must never collide in time AND space).
// top 300 -> band y~200-400; top 600 -> band y~500-700. Both are above the seam (855) and above the
// caption centre (925). C/D/E use top 600 so the real $190 price tooltip on the TAO page stays visible.
export const BADGES_TDBTG: BadgeEv[] = [
  { tIn: 15.80, tOut: 19.00, color: '#00e5ff', line1: 'THE FOMO',    line2: 'ARRIVES LATE',      sub: 'AFTER THE MOVE',       top: 300 },
  { tIn: 26.20, tOut: 28.40, color: '#ffe600', line1: 'HE HAD',      line2: 'THE CHANCE',        sub: 'AND HE TOOK IT',       top: 300 },
  { tIn: 34.40, tOut: 37.40, color: '#39ff14', line1: 'BOUGHT NEAR', line2: 'THE 24H LOW',       sub: 'SAME DAY, TWICE',      top: 600 },
  { tIn: 40.35, tOut: 42.80, color: '#ff5252', line1: 'THAT GUY',    line2: 'SAW IT AT 188',     sub: 'AND DID NOTHING',      top: 600 },
  { tIn: 44.10, tOut: 47.30, color: '#ffe600', line1: 'FOLLOW ME',   line2: 'FOR THE TAO PLAN',  sub: 'DAILY CRYPTO STREAMS', top: 600 },
];

// ─── Frame-0 thumbnail (IG/TikTok cover) ─────────────────────────────────────────────────────────
// ONE frame only (LivestreamShort defaults thumb.durS to 1/fps): generated background art with the
// title/chip drawn in CODE on top, never baked into the art. No em dashes.
export const THUMB_DEF_TDBTG = {
  title: 'DON\'T BE\nTHAT GUY',
  chip: 'TAO UNDER $200',
  chipColor: '#ffe600',
  titleSize: 150,
  img: THUMB_TDBTG,
};

// ─── SFX ─────────────────────────────────────────────────────────────────────────────────────────
// Whoosh on the frame-0 cut and on both full-screen cuts; a DING on the buy-the-dip cutaway; a whoosh
// + TING on the receipt (the BASE screen-share itself cuts to the TAO page at 28.75); a RISER that
// builds INTO the tripled peak and is cut by the peak IMPACT; a payoff hit under "near 100x".
export const SFX_TDBTG: Sfx[] = [
  { t:  0.02, src: staticFile('sfx/Cinematic Whoosh 02.wav'),               vol: 0.42, dur: 1.20 }, // frame-0 thumbnail cut
  { t:  1.28, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.44, dur: 0.90 }, // cut into the hook full-screen
  { t:  5.38, src: staticFile('sfx/DING.mp3'),                              vol: 0.30, dur: 1.20 }, // cut into the buy-the-dip cutaway
  // QA sweep (SKILL item 7, "an SFX cue that MASKS the VO is a build defect"): at vol 0.38 / dur 1.00
  // this whoosh sat on "i got ME another tao" and Whisper lost "me" off the render but not off the
  // spine. Swept to 0.22 / 0.80 and the word came back; the TING was also nudged off "me" onto "today".
  { t: 28.72, src: staticFile('sfx/Cinematic Whoosh 06.wav'),               vol: 0.22, dur: 0.80 }, // the screen-share cuts to the TAO page
  { t: 29.55, src: staticFile('sfx/TING SOUND EFFECT.mp3'),                 vol: 0.26, dur: 1.30 }, // RECEIPT: "another TAO today"
  { t: 38.55, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_3.wav'), vol: 0.20, dur: 1.80 }, // riser into the tripled peak
  { t: 40.30, src: staticFile('sfx/Impacts/Impact_2.wav'),                  vol: 0.40, dur: 2.00 }, // IMPACT: "don't be that guy" (3rd)
  { t: 47.88, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.40, dur: 0.90 }, // cut into the near-100x close
  { t: 49.42, src: staticFile('sfx/Impacts/Impact_3.wav'),                  vol: 0.22, dur: 1.80 }, // payoff hit under "near 100x" (kept low so it never masks the line)
];

export const TDBTG: ShortData = {
  clip: TDBTG_CLIP,
  fps: TDBTG_FPS,
  durationS: TDBTG_DURATION / TDBTG_FPS,
  capY: TDBTG_CAP_Y,
  seam: TDBTG_SEAM,
  captions: CAPTIONS_TDBTG,
  broll: BROLL_TDBTG,
  badges: BADGES_TDBTG,
  sounds: SFX_TDBTG,
  thumb: THUMB_DEF_TDBTG,
};

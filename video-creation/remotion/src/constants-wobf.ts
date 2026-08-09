// constants-wobf.ts — data for "The October Bottom Is Getting Front-Run"
// batch whatif, clip #1, slug october-bottom-front-run (variant: full)
//
// Contract: video-creation/livestream-repurpose/skills/remotion-shorts-build/SKILL.md
// Plan:     video-creation/shorts/whatif/october-bottom-front-run/BROLL-PLAN.md
//
// Render (public-dir = the CLIP's render-assets/, which holds the spine + thumbnail + b-roll + sfx):
//   npx remotion render src/index.ts WhatifOctoberBottom out/whatif/1-october-bottom-front-run.mp4 \
//     --public-dir "../shorts/whatif/october-bottom-front-run/render-assets"
import { staticFile } from 'remotion';
import { CAPTIONS_WOBF } from './captionsWobf';
import type { ShortData, BadgeEv } from './LivestreamShort';
import type { BrollEv, Sfx } from './_kit';

export const WOBF_FPS = 30;
export const WOBF_DURATION = 2421; // 80.70 s @30, just inside the 80.708 s spine (no black tail frame)

export const WOBF_CLIP = staticFile('october-bottom-front-run.mp4');
export const THUMB_WOBF = staticFile('thumbnail-obfr.png');

// Measured on THIS clip (green-screen onset scan at t=3/20/45/70/79 s): the screen-share ends and the
// webcam starts at y=850. Content-mode b-roll covers 0..850 (also hides the baked livestream chat bar
// at ~y740-790, which is inside the content zone).
export const WOBF_SEAM = 850;
// Caption centre: 55 px below the seam, well above the eyes (~1450) and below the chat bar.
export const WOBF_CAP_Y = 905;

// ─── B-ROLL ────────────────────────────────────────────────────────────────────────────────────────
// HALVED budget (SKILL "B-roll coverage budget"): 27.45 s of 80.708 s = 34.0 % b-roll / 66 % base.
// 9 distinct images; 3 FULL-SCREEN moments — hook / black-swan trio (3 hard-cut images = ONE moment) /
// mocking-zombie close = the firm 1-3 cap. Everything else is a sparse content-zone cutaway with the
// webcam playing below; long deliberate BASE stretches show the talking head + screen-share.
export const BROLL_WOBF: BrollEv[] = [
  { src: staticFile('broll-obfr-90-lose.png'),                tIn:  1.40, tOut:  4.20, mode: 'full'    }, // HOOK: 90% always lose
  // BASE 4.20-9.00
  { src: staticFile('broll-obfr-frontrun.png'),              tIn:  9.00, tOut: 11.40, mode: 'content' }, // "the bottom might be front-run"
  // BASE 11.40-18.80
  { src: staticFile('broll-obfr-sly-september.png'),         tIn: 18.80, tOut: 21.60, mode: 'content' }, // "september is also going to be green"
  // BASE 21.60-37.10 (carries badge A)
  { src: staticFile('broll-obfr-red-september.png'),         tIn: 37.10, tOut: 40.20, mode: 'content' }, // "every september post-halving is always RED"
  // BASE 40.20-45.30
  { src: staticFile('broll-obfr-red-green-candles.png'),     tIn: 45.30, tOut: 48.60, mode: 'content' }, // "august RED then september GREEN" flip
  // BASE 48.60-57.55 (riser builds at the tail)
  { src: staticFile('broll-obfr-blackswan-msft.png'),        tIn: 57.55, tOut: 59.96, mode: 'full'    }, // TRIO 1: MicroStrategy collapses
  { src: staticFile('broll-obfr-blackswan-taiwan.png'),      tIn: 59.96, tOut: 62.88, mode: 'full'    }, // TRIO 2: China invades Taiwan (hard cut)
  { src: staticFile('broll-obfr-blackswan-yellowstone.png'), tIn: 62.88, tOut: 66.90, mode: 'full'    }, // TRIO 3: Yellowstone explodes (hard cut)
  // BASE 66.90-76.80 (carries badge B on "my socials")
  { src: staticFile('broll-obfr-zombie-mock.png'),           tIn: 76.80, tOut: 80.55, mode: 'full'    }, // CLOSE: mocking zombie impression
];

// ─── Badges (code-drawn, content zone) ───────────────────────────────────────────────────────────
// Each sits inside a BASE stretch with no b-roll and no other badge running (overlays never collide in
// time AND space). top=300 -> centre well above the seam (850) and above the captions (905).
export const BADGES_WOBF: BadgeEv[] = [
  { tIn: 28.40, tOut: 32.00, color: '#00e5ff', line1: 'LAST BUYS',  line2: 'IN SEPTEMBER',        sub: 'FRONT-RUN THE ZOMBIES', top: 300 },
  { tIn: 71.00, tOut: 74.60, color: '#ffe600', line1: 'FOLLOW ME',  line2: 'FOR THE OCTOBER PLAN', sub: 'DAILY CRYPTO STREAMS',  top: 300 },
];

// ─── Frame-0 thumbnail (IG/TikTok cover) ─────────────────────────────────────────────────────────
// ONE frame only (LivestreamShort defaults thumb.durS to 1/fps): generated background art with the
// title/chip drawn in CODE on top, never baked into the art. No em dashes.
export const THUMB_DEF_WOBF = {
  title: 'THE OCTOBER\nBOTTOM IS\nGETTING\nFRONT-RUN',
  chip: '90% ARE WAITING FOR IT',
  chipColor: '#ff5252',
  titleSize: 112,
  img: THUMB_WOBF,
};

// ─── SFX ─────────────────────────────────────────────────────────────────────────────────────────
// Whoosh on the thumbnail cut + each full-screen transition; a light DING on the GREEN flip; a RISER
// that builds INTO the black-swan trio, cut by the collapse IMPACT; a second IMPACT on the eruption.
export const SFX_WOBF: Sfx[] = [
  { t:  0.02, src: staticFile('sfx/Cinematic Whoosh 02.wav'),               vol: 0.42, dur: 1.20 }, // frame-0 thumbnail cut
  { t:  1.26, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.44, dur: 0.90 }, // cut into the hook full-screen
  { t: 48.05, src: staticFile('sfx/DING.mp3'),                              vol: 0.34, dur: 1.20 }, // "september turned GREEN"
  { t: 55.30, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_3.wav'), vol: 0.22, dur: 2.55 }, // riser into the trio
  { t: 57.53, src: staticFile('sfx/Cinematic Whoosh 06.wav'),               vol: 0.40, dur: 1.00 }, // cut into the black-swan trio
  { t: 57.62, src: staticFile('sfx/Impacts/Impact_2.wav'),                  vol: 0.44, dur: 2.20 }, // IMPACT: MicroStrategy collapses
  { t: 64.42, src: staticFile('sfx/Impacts/Impact_3.wav'),                  vol: 0.42, dur: 2.00 }, // IMPACT: Yellowstone explodes
  { t: 76.78, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.40, dur: 0.90 }, // cut into the mocking-zombie close
];

export const WOBF: ShortData = {
  clip: WOBF_CLIP,
  fps: WOBF_FPS,
  durationS: WOBF_DURATION / WOBF_FPS,
  capY: WOBF_CAP_Y,
  seam: WOBF_SEAM,
  captions: CAPTIONS_WOBF,
  broll: BROLL_WOBF,
  badges: BADGES_WOBF,
  sounds: SFX_WOBF,
  thumb: THUMB_DEF_WOBF,
};

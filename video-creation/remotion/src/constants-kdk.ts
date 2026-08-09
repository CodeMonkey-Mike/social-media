// constants-kdk.ts — data for "Kaspa at 2.7 Cents: Absolutely Unbelievable"
// batch new-bottom, clip #2, slug kaspa-dagknight-100x (variant: full)
//
// Contract: video-creation/livestream-repurpose/skills/remotion-shorts-build/SKILL.md
// Plan:     video-creation/shorts/new-bottom/kaspa-dagknight-100x/BROLL-PLAN.md
//
// Render (public-dir = the CLIP's render-assets/, which holds the spine + thumbnail + b-roll + sfx):
//   npx remotion render src/index.ts KaspaDagknight100x out/new-bottom/2-kaspa-dagknight-100x.mp4 \
//     --public-dir "../shorts/new-bottom/kaspa-dagknight-100x/render-assets"
import { staticFile } from 'remotion';
import { CAPTIONS_KDK } from './captionsKdk';
import type { ShortData, BadgeEv, OverlayEv } from './LivestreamShort';
import type { BrollEv, Sfx } from './_kit';

export const KDK_FPS = 30;
export const KDK_DURATION = 1436; // 47.867 s @30, just inside the 47.880 s spine (no black tail frame)

export const KDK_CLIP = staticFile('kaspa-dagknight-100x.mp4');
export const THUMB_KDK = staticFile('thumbnail-kdk.png');

// Measured on THIS clip (green-screen onset + max row-gradient edge at t=2/8/15/24/33/42/46 s):
// the screen-share (CoinMarketCap watchlist, then the Kaspa Marketplace KRC20 list) ends and the
// webcam starts at y=854. Content-mode b-roll covers 0..854; the webcam keeps playing below.
export const KDK_SEAM = 854;
// Caption centre: 61 px below the seam, over his hair, far above his eyes (~1430).
export const KDK_CAP_Y = 915;

// ─── B-ROLL ──────────────────────────────────────────────────────────────────────────────────────
// HALVED budget (SKILL "B-roll coverage budget"), halved AGAIN by Mike 2026-07-25 mid-build
// ("up to 50% fewer b-roll images... around 3-4 distinct images for this clip"):
// 4 distinct images, ZERO reuse, 12.15 s of 47.88 s = 25.4 % b-roll / 74.6 % base showing.
// 2 FULL-SCREEN moments only (the Kaspa hook + the DAGKnight Dog payoff), inside the firm 1-3 cap.
// The long base stretches are deliberate: the screen-share IS the receipt here (the real CMC row
// KAS $0.02763 / $762.67M, then the Kaspa Marketplace KRC20 token list).
export const BROLL_KDK: BrollEv[] = [
  // BASE 0.00-1.35 — the frame-0 cover hands off to Mike + the CMC watchlist.
  { src: staticFile('broll-kdk-hook-kaspa-27.png'), tIn:  1.35, tOut:  4.20, mode: 'full'    }, // HOOK: "it's at 2.7 cents"
  // BASE 4.20-10.25 — "anybody out there wants to collect 2.7 cents right now" over the REAL CMC row.
  { src: staticFile('broll-kdk-pause-penny.png'),   tIn: 10.25, tOut: 12.95, mode: 'content' }, // the protected ~2.96 s HELD PAUSE
  // BASE 12.95-15.10 — his face lands "absolutely unbelievable".
  { src: staticFile('broll-kdk-bps-upgrade.png'),   tIn: 15.10, tOut: 18.30, mode: 'content' }, // CATALYST: "25 blocks per second upgrade and 40"
  // BASE 18.30-42.15 — the 100 bps line, "massive pumps", "don't sleep on KRC20", "enduring the pain",
  // "easy 100x's": the screen-share becomes the Kaspa Marketplace KRC20 list, which IS the visual.
  // Carries Badges A/B/C and the alpha overlay; no generated cutaway by design.
  { src: staticFile('broll-kdk-dagknight-dog.png'), tIn: 42.15, tOut: 45.55, mode: 'full'    }, // CLIMAX: "DAGKnight Dog is a 200k market cap"
  // BASE 45.55-47.87 — hard-out on his face: "just go to 20 million. i think that's 100x." + Badge D.
];

// ─── Badges (code-drawn, content zone) ───────────────────────────────────────────────────────────
// Every window sits inside a BASE stretch with no b-roll, no overlay and no other badge running
// (overlays must never collide in time AND space). top=300 -> centre well above the seam (854) and
// above the captions (915). Nothing starts under the frame-0 thumbnail.
export const BADGES_KDK: BadgeEv[] = [
  // A lands ON the price line, while the screen-share behind it IS the CoinMarketCap row it quotes
  // (KAS $0.02763 / $762.67M) - the badge enlarges the receipt instead of hiding it.
  { tIn:  5.20, tOut:  8.20, color: '#00e5ff', line1: 'KAS TODAY',     line2: '$0.0276',      sub: '762M MARKET CAP',           top: 300 },
  { tIn: 24.50, tOut: 27.60, color: '#00e5ff', line1: 'TIMED WITH',    line2: 'THE UPGRADES', sub: '25 THEN 40 BLOCKS PER SEC', top: 300 },
  { tIn: 30.05, tOut: 32.35, color: '#39ff14', line1: 'KRC20 TOKENS',  line2: 'ON KASPA',     sub: 'MINTED ON THE KASPA CHAIN', top: 300 },
  { tIn: 35.30, tOut: 37.90, color: '#ff5252', line1: 'THE PLAYBOOK',  line2: 'ENDURE THE PAIN', sub: 'THEN THEY PUMP',         top: 300 },
  { tIn: 45.55, tOut: 47.85, color: '#ffe600', line1: 'DAGKNIGHT DOG', line2: '200K TO 20M',  sub: 'THAT IS A 100X',            top: 300 },
];

// ─── Transparent alpha overlay (real RGBA PNG, alpha-from-luminance off a glow-on-black render) ──
// Sits in the 35.05-42.15 base stretch, clear of every badge and every b-roll beat, in time AND space.
// The PNG is cropped to its visible bbox (692x1376, aspect 0.503), so width 330 -> height ~656:
// it spans y 150..806, entirely inside the content zone (seam 854) and clear of the captions (915).
export const OVERLAYS_KDK: OverlayEv[] = [
  { src: staticFile('overlay-kdk-100x-arrow.png'), tIn: 39.55, tOut: 41.90, top: 150, left: 375, width: 330, blend: 'normal' },
];

// ─── Frame-0 thumbnail (IG/TikTok cover) ─────────────────────────────────────────────────────────
// ONE frame only (LivestreamShort defaults thumb.durS to 1/fps): generated background art with the
// title/chip drawn in CODE on top, never baked into the art. No em dashes.
export const THUMB_DEF_KDK = {
  title: 'KASPA AT\n2.7 CENTS',
  chip: 'ABSOLUTELY UNBELIEVABLE',
  chipColor: '#00e5ff',
  titleSize: 132,
  img: THUMB_KDK,
};

// ─── SFX ─────────────────────────────────────────────────────────────────────────────────────────
// Whoosh on the frame-0 cut and every b-roll cut; a RISER through the protected held pause (silence,
// so nothing to mask) resolving on an IMPACT as "absolutely unbelievable" lands; a DING on the pump;
// a BOOM on the 200K -> 20M payoff. Volumes swept against Whisper on the final mix.
export const SFX_KDK: Sfx[] = [
  { t:  0.02, src: staticFile('sfx/Cinematic Whoosh 02.wav'),               vol: 0.42, dur: 1.20 }, // frame-0 thumbnail cut
  { t:  1.31, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.44, dur: 0.90 }, // cut into the hook full-screen
  { t: 10.25, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_3.wav'), vol: 0.20, dur: 2.75 }, // riser through the HELD PAUSE
  { t: 13.00, src: staticFile('sfx/Impacts/Impact_2.wav'),                  vol: 0.30, dur: 2.00 }, // impact on "absolutely unbelievable"
  { t: 15.06, src: staticFile('sfx/Cinematic Whoosh 06.wav'),               vol: 0.38, dur: 1.00 }, // cut into the 25/40 bps catalyst cutaway
  { t: 33.60, src: staticFile('sfx/DING.mp3'),                              vol: 0.30, dur: 1.20 }, // "gonna pump"
  { t: 42.10, src: staticFile('sfx/Cinematic Whoosh 02.wav'),               vol: 0.40, dur: 1.10 }, // cut into the DAGKnight Dog climax
  { t: 45.45, src: staticFile('sfx/Boom - Big Reveal.wav'),                 vol: 0.34, dur: 2.40 }, // the 200K -> 20M payoff
];

export const KDK: ShortData = {
  clip: KDK_CLIP,
  fps: KDK_FPS,
  durationS: KDK_DURATION / KDK_FPS,
  capY: KDK_CAP_Y,
  seam: KDK_SEAM,
  captions: CAPTIONS_KDK,
  broll: BROLL_KDK,
  badges: BADGES_KDK,
  overlays: OVERLAYS_KDK,
  sounds: SFX_KDK,
  thumb: THUMB_DEF_KDK, // durS omitted => ONE frame (frame-0 cover), base video from frame 1
};

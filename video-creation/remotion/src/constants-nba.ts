// constants-nba.ts — data for "The New Bottom Hits in August, Not October"
// batch new-bottom, clip #1, slug new-bottom-august (variant: full)
//
// Contract: video-creation/livestream-repurpose/skills/remotion-shorts-build/SKILL.md
// Plan:     video-creation/shorts/new-bottom/new-bottom-august/BROLL-PLAN.md
//
// Render (public-dir = the CLIP's render-assets/, which holds the spine + thumbnail + b-roll + sfx):
//   npx remotion render src/index.ts NewBottomAugust out/new-bottom/1-new-bottom-august.mp4 \
//     --public-dir "../shorts/new-bottom/new-bottom-august/render-assets"
//
// PERSONA GUARD (do not edit this comp so it violates it): the thesis is that the four-year-cycle
// zombies buy back in OCTOBER and TURN OCTOBER GREEN, so October can never be the bottom everyone is
// waiting for; the non-zombies front-run them with one last buy in September and turn September green;
// the real new bottom lands in AUGUST. Nothing on screen may read as "the bottom happens in October".
import { staticFile } from 'remotion';
import { CAPTIONS_NBA } from './captionsNba';
import type { ShortData, BadgeEv, OverlayEv } from './LivestreamShort';
import type { BrollEv, Sfx } from './_kit';

export const NBA_FPS = 30;
// Spine: video 42.000 s (last frame PTS 41.96), audio 42.036 s, last spoken word ends 41.94.
// 1259 frames = 41.967 s -> the last rendered frame lands inside the spine's last video frame, so
// there is no black tail frame.
export const NBA_DURATION = 1259;

export const NBA_CLIP = staticFile('new-bottom-august.mp4');
export const THUMB_NBA = staticFile('thumbnail-nba.png');

// Measured on THIS clip (green-screen onset scan at t=2/12/22/32/40 s): the screen-share ends and the
// webcam starts at y=854, identical at every sample. Content-mode b-roll covers 0..854.
export const NBA_SEAM = 854;
// Caption centre: 58 px below the seam, above his hairline (~1010) and far above his eyes (~1420).
export const NBA_CAP_Y = 912;

// ─── B-ROLL ──────────────────────────────────────────────────────────────────────────────────────
// HALVED budget (SKILL "B-roll coverage budget"), RE-CUT 2026-07-25 on Mike's "up to 50% fewer b-roll
// images" note: 4 distinct images, 10.70 s of 41.967 s = 25.5 % b-roll / 74.5 % base showing — still
// inside the canonical ~25-35 % band, at its base-heavy edge. 2 FULL-SCREEN moments (hook + August
// climax) = inside the firm 1-3 cap. Smallest gap between beats is 4.35 s, so the base never flashes
// for a fraction of a second between two images; no image is reused.
// (The de-scoped hourglass / zombies-buying / september-frontrun images are parked OUTSIDE the public
// dir in shorts/new-bottom/new-bottom-august/_unused-broll/, so render-assets/ has zero orphans.)
export const BROLL_NBA: BrollEv[] = [
  // BASE 0.00-1.30 — the frame-0 cover hands off to Mike + the screen-share.
  { src: staticFile('broll-nba-something-coming.png'), tIn:  1.30, tOut:  4.20, mode: 'full'    }, // HOOK: "something's gonna happen... i don't think it's good"
  // BASE 4.20-12.80 — "it's all gonna be over with soon" x2 plays on his face
  { src: staticFile('broll-nba-october-crowd.png'),    tIn: 12.80, tOut: 15.60, mode: 'content' }, // "building up for the october bottom"
  // BASE 15.60-19.95 — "i don't think it is true" + "the four-year cycle zombies are gonna be buying
  // back in october" play on his face (this stretch carries the red-X alpha overlay)
  { src: staticFile('broll-nba-october-green.png'),    tIn: 19.95, tOut: 22.85, mode: 'content' }, // THE MECHANISM: "october, to turn october green"
  // BASE 22.85-34.10 (carries badge A then badge B; the riser builds at the tail)
  { src: staticFile('broll-nba-august-bottom.png'),    tIn: 34.10, tOut: 36.20, mode: 'full'    }, // CLIMAX: "whether it is in august, like i say"
  // BASE 36.20-41.97 — close on Mike (carries badge C, the CTA). The August full-screen ENDS at 36.20,
  // before "or it's in october like everybody else said", so the art never sits under the word october.
];

// ─── Badges (code-drawn, content zone) ───────────────────────────────────────────────────────────
// Each window sits INSIDE a base stretch with no b-roll and no other badge/overlay running, so no two
// graphics ever collide in time AND space. top=300 -> centre well above the seam (854) and the
// captions (912). Copy states what the captions do not, and never inverts the thesis.
export const BADGES_NBA: BadgeEv[] = [
  { tIn: 23.60, tOut: 26.60, color: '#ff5252', line1: 'THE ZOMBIES', line2: 'TURN OCTOBER GREEN', sub: 'SO IT CANNOT BE THE BOTTOM', top: 300 },
  { tIn: 29.60, tOut: 32.60, color: '#00e5ff', line1: 'MY BASE CASE', line2: 'A NEW BOTTOM',       sub: 'COMING VERY SOON',            top: 300 },
  { tIn: 38.60, tOut: 41.60, color: '#ffe600', line1: 'FOLLOW ME',   line2: 'FOR THE AUGUST CALL', sub: 'DAILY CRYPTO STREAMS',        top: 300 },
];

// ─── Transparent alpha overlay (real RGBA PNG, alpha-from-luminance) ─────────────────────────────
// Sits in the base stretch 15.10-17.75 on "i don't think it is true", clear in time AND space of
// every badge and every b-roll beat.
export const OVERLAYS_NBA: OverlayEv[] = [
  { src: staticFile('overlay-nba-red-x.png'), tIn: 15.85, tOut: 18.10, top: 200, left: 310, width: 460, blend: 'normal' },
];

// ─── Frame-0 thumbnail (IG/TikTok cover) ─────────────────────────────────────────────────────────
// ONE frame only (LivestreamShort defaults thumb.durS to 1/fps): generated background art with the
// title/chip drawn in CODE on top, never baked into the art. No em dashes.
export const THUMB_DEF_NBA = {
  title: 'THE NEW\nBOTTOM HITS\nIN AUGUST',
  chip: 'NOT OCTOBER',
  // TEAL, not red: the chip lands over the bright red calendar page in the cover art, so a red chip
  // would sit red-on-red. Teal is the brand accent and the colour of the lone figure in the art.
  chipColor: '#00e5ff',
  titleSize: 124,
  img: THUMB_NBA,
};

// ─── SFX ─────────────────────────────────────────────────────────────────────────────────────────
// Whoosh on the frame-0 thumbnail cut and on every b-roll transition; a DING on the October-turns-
// green reveal; a RISER that builds INTO the August call and is cut by the climax IMPACT. Every cue
// is placed in a speech pause and mixed low so it never masks the VO (SKILL QA rule 7).
export const SFX_NBA: Sfx[] = [
  { t:  0.02, src: staticFile('sfx/Cinematic Whoosh 02.wav'),               vol: 0.42, dur: 1.20 }, // frame-0 thumbnail cut
  { t:  1.26, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.44, dur: 0.90 }, // cut into the hook full-screen
  { t: 12.70, src: staticFile('sfx/Cinematic Whoosh 06.wav'),               vol: 0.26, dur: 1.00 }, // cut into the october-crowd beat
  { t: 19.85, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.28, dur: 0.90 }, // cut into the october-turns-green beat
  { t: 21.52, src: staticFile('sfx/DING.mp3'),                              vol: 0.28, dur: 1.20 }, // REVEAL: october turned green (pause 21.48-21.76)
  { t: 32.55, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_3.wav'), vol: 0.20, dur: 1.52 }, // RISER into the august call
  { t: 34.03, src: staticFile('sfx/Impacts/Impact_2.wav'),                  vol: 0.42, dur: 2.20 }, // IMPACT on the august climax cut (pause 34.00-34.14)
];

export const NBA: ShortData = {
  clip: NBA_CLIP,
  fps: NBA_FPS,
  durationS: NBA_DURATION / NBA_FPS,
  capY: NBA_CAP_Y,
  seam: NBA_SEAM,
  captions: CAPTIONS_NBA,
  broll: BROLL_NBA,
  badges: BADGES_NBA,
  overlays: OVERLAYS_NBA,
  sounds: SFX_NBA,
  thumb: THUMB_DEF_NBA,
};

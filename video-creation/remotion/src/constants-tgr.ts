// constants-tgr.ts — data for "I'd Be a TON Maxi If Kaspa Never Existed"
// batch new-bottom, clip #4, slug ton-gram-rename (variant: full)
//
// Contract: video-creation/livestream-repurpose/skills/remotion-shorts-build/SKILL.md
// Plan:     video-creation/shorts/new-bottom/ton-gram-rename/BROLL-PLAN.md
//
// Render (public-dir = the CLIP's render-assets/, which holds the spine + thumbnail + b-roll + sfx):
//   npx remotion render src/index.ts TonGramRename out/new-bottom/4-ton-gram-rename.mp4 \
//     --public-dir "../shorts/new-bottom/ton-gram-rename/render-assets"
import { staticFile } from 'remotion';
import { CAPTIONS_TGR } from './captionsTgr';
import type { ShortData, BadgeEv } from './LivestreamShort';
import type { BrollEv, Sfx } from './_kit';

export const TGR_FPS = 30;
export const TGR_DURATION = 1400; // 46.667 s @30, just inside the 46.680 s spine (no black tail frame)

export const TGR_CLIP = staticFile('ton-gram-rename.mp4');
export const THUMB_TGR = staticFile('thumbnail-tgr.png');

// Measured on THIS clip (green-onset row scan at t=2/8/15/24/33/40/46 s -> y=854 every time): the
// screen-share (CoinMarketCap watchlist) ends and the green-screen webcam starts at y=854.
// Content-mode b-roll covers 0..854; the webcam keeps playing below it.
export const TGR_SEAM = 854;
// Caption centre: 71 px below the seam, over his hair, far above his eyes (~1390).
export const TGR_CAP_Y = 925;

// ─── B-ROLL ──────────────────────────────────────────────────────────────────────────────────────
// HALVED budget, then CUT AGAIN mid-build on Mike's "up to 50% fewer images" note (2026-07-25):
// 4 distinct images, 12.59 s of 46.68 s = 27.0 % b-roll / 73.0 % base showing (band 25-35 %).
// 2 full-screen moments (hook flex + $20 climax) = inside the firm 1-3 cap.
// The content zone IS the receipt here: the CMC row on screen literally reads "Gram (prev. Toncoin)
// GRAM $1.46", the exact fact he is explaining, so 17.55-39.28 is a DELIBERATE base stretch carried
// by three code-drawn badges instead of cutaways.
export const BROLL_TGR: BrollEv[] = [
  // BASE 0.00-6.45 — frame-0 cover hands off to Mike + the CoinMarketCap page.
  { src: staticFile('broll-tgr-kaspa-vs-ton.png'), tIn:  6.45, tOut:  9.55, mode: 'full'    }, // HOOK: "toncoin maxi if kaspa had never existed"
  // BASE 9.55-11.58 — "like I would have been a Toncoin maxi, right?"
  { src: staticFile('broll-tgr-rename.png'),       tIn: 11.58, tOut: 13.85, mode: 'content' }, // RENAME: "they changed their name to GRAM"
  { src: staticFile('broll-tgr-bittensor.png'),    tIn: 13.85, tOut: 17.55, mode: 'content' }, // adjacent -> HARD CUT. ANALOGY: "like bittensor: that's the chain, TAO is the token"
  // BASE 17.55-39.28 (21.73 s) — the whole rename explainer over the live CMC receipt, + badges A/B/C
  { src: staticFile('broll-tgr-20-dollar.png'),    tIn: 39.28, tOut: 42.80, mode: 'full'    }, // CLIMAX: "looking forward to like a $20 toncoin"
  // BASE 42.80-46.67 — hard-out close, + badge D (follow) ON the final lines, never after them.
];

// ─── Badges (code-drawn, content zone) ───────────────────────────────────────────────────────────
// top=265 -> MEASURED box y92-436 on the draft render (the badge is 344 px tall, not the ~270 the CSS
// suggests). The default top=300 put the box at y127-471, which covered the live CMC row
// "Gram (prev. Toncoin) | GRAM | $1.46" at y~444-480 — i.e. it hid the very receipt the badges point
// at. 265 clears that row while staying far above the seam (854) and the captions (925). Every window
// sits inside a BASE stretch with no b-roll and no other badge running (no collision in time AND space).
export const BADGES_TGR: BadgeEv[] = [
  { tIn: 19.20, tOut: 22.80, color: '#3aa0ff', line1: 'TON',       line2: 'IS THE CHAIN',      sub: 'GRAM IS THE TOKEN',    top: 265 },
  { tIn: 28.40, tOut: 31.40, color: '#3aa0ff', line1: 'TON',       line2: "TELEGRAM'S CHAIN",  sub: 'GRAM IS ITS TOKEN',    top: 265 },
  { tIn: 35.60, tOut: 38.60, color: '#ffe600', line1: 'GRAM',      line2: '$1.46 TODAY',       sub: 'PREV. TONCOIN',        top: 265 },
  { tIn: 43.30, tOut: 46.30, color: '#00e5ff', line1: 'FOLLOW ME', line2: 'DAILY CRYPTO',      sub: 'LIVE STREAMS',         top: 265 },
];

// ─── Frame-0 thumbnail (IG/TikTok cover) ─────────────────────────────────────────────────────────
// ONE frame only (LivestreamShort defaults thumb.durS to 1/fps): generated background art with the
// title/chip drawn in CODE on top, never baked into the art. No em dashes.
export const THUMB_DEF_TGR = {
  title: "I'D BE A\nTON MAXI\nIF KASPA\nNEVER EXISTED",
  chip: 'TONCOIN IS NOW GRAM',
  chipColor: '#3aa0ff',
  titleSize: 108,
  img: THUMB_TGR,
};

// ─── SFX ─────────────────────────────────────────────────────────────────────────────────────────
// Whoosh on the thumbnail cut and on each b-roll cut; a light DING on each rename reveal; a RISER
// that builds INTO the $20 payoff and is cut by the payoff IMPACT. Volumes are deliberately low: an
// SFX cue that masks the VO is a build defect (checklist item 7), and this clip's VO carries the
// whole TON / Toncoin / GRAM distinction.
// Volumes are MEASURED, not guessed: pass 1 rendered every cue 12-15 dB under the VO, which reads as
// "no SFX" on a phone speaker. Each cue below was re-levelled to land ~10 dB under the VO in the mix
// (aligned difference-signal measurement on the render), then whisper-verified on the FINAL MIX so the
// lift never costs a word. The $20 impact is deliberately the loudest hit and stays where pass 1 had
// it (1.6 dB under VO) because Whisper still read "$20" cleanly there.
export const SFX_TGR: Sfx[] = [
  { t:  0.02, src: staticFile('sfx/Cinematic Whoosh 02.wav'),               vol: 0.42, dur: 1.20 }, // frame-0 thumbnail cut
  { t:  6.43, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.62, dur: 0.90 }, // cut into the hook full-screen
  { t: 11.56, src: staticFile('sfx/DING.mp3'),                              vol: 0.48, dur: 1.10 }, // reveal: "changed their name to gram"
  { t: 13.83, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.58, dur: 0.90 }, // hard cut into the bittensor analogy
  { t: 30.68, src: staticFile('sfx/DING.mp3'),                              vol: 0.36, dur: 1.10 }, // the click: "so telegram, GRAM"
  { t: 37.30, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_3.wav'), vol: 0.32, dur: 2.60 }, // riser into the $20 payoff
  { t: 39.26, src: staticFile('sfx/Cinematic Whoosh 06.wav'),               vol: 0.38, dur: 1.00 }, // cut into the climax full-screen
  { t: 40.22, src: staticFile('sfx/Impacts/Impact_2.wav'),                  vol: 0.38, dur: 2.00 }, // IMPACT on "$20"
];

export const TGR: ShortData = {
  clip: TGR_CLIP,
  fps: TGR_FPS,
  durationS: TGR_DURATION / TGR_FPS,
  capY: TGR_CAP_Y,
  seam: TGR_SEAM,
  captions: CAPTIONS_TGR,
  broll: BROLL_TGR,
  badges: BADGES_TGR,
  sounds: SFX_TGR,
  thumb: THUMB_DEF_TGR,
};

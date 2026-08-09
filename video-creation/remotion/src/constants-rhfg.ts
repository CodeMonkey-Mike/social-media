import { staticFile } from 'remotion';

// ─── robinhood-floodgates (batch: robinhood, clip #1 rank 1, variant: full) ──────────
// Spine = tightened.mp4 (ALREADY tightened + desilenced; build on THIS, do not re-cut).
// Composited vertical 1080x1920: screen-share (Cash Cat / Robinhood-chain DexScreener chart) top
// 0..SEAM, Mike's green-screen face bottom. Seam y~846; caption band centred y~872 (over the
// forehead, well above the eyes at ~y1290). Clip 29.38s @ 25fps; comp @ 30fps (OffthreadVideo
// resamples by time).
//
// Built to the FINALIZED-SHORT contract (livestream-repurpose/skills/remotion-shorts-build/SKILL.md):
//   frame-0 designed thumbnail cover + b-roll LAYER (HALVED budget: 32.7% b-roll / 67.3% base,
//   3 full-screens = hook/floodgates-climax/six-billion button + 1 content-zone) + SFX (9 events).
// Robinhood-chain coins/glow = BRIGHT NEON GREEN (#CCFF00) + gold (persona.json robinhood_coin),
//   never teal. Named coins (Cash Cat/9Hood/Hoodrat) have NO reference logo -> generic thematic
//   b-roll only, blank coins, faceless crowds.
//
// Render (public-dir = the batch render-assets/, holds the spine mp4 + thumb + broll + sfx):
//   npx remotion render src/index.ts RobinhoodFloodgates out/robinhood/1-floodgates-100x-full.mp4 \
//     --public-dir "<repo>/video-creation/shorts/robinhood/render-assets"

export const RHFG_FPS = 30;
export const RHFG_DURATION = 882; // 29.38s * 30 = 881.4 -> 882 frames

export const CLIP  = staticFile('floodgates-100x-full.mp4');
export const THUMB = staticFile('broll-rh-thumb.png');
export const THUMB_TITLE = 'ROBINHOOD OPENS THE FLOODGATES';
export const THUMB_CHIP  = '100X TO RETAIL';

// Layout geometry (measured from extracted frames)
export const RHFG_SEAM  = 846;   // screen-share (top) / face (bottom) seam; content-zone broll covers 0..SEAM
export const RHFG_CAP_Y = 872;   // caption centre — just below the seam, over the forehead, never the eyes

// ─── B-roll beats ────────────────────────────────────────────────────────────────
// mode 'full' = whole frame (hook, floodgates climax, six-billion button); 'zone' = top screen-share
// zone only (0..SEAM), Mike's face stays visible below. Isolated beats fade to/from base; none are
// adjacent so there is no full-to-full base flash. staticFile() calls are LITERAL strings on purpose
// (the finalized-short gate scans for literal asset refs; keep them literal, not helper-built).
export type RhBroll = { src: string; tIn: number; tOut: number; mode: 'full' | 'zone' };
export const BROLL_RHFG: RhBroll[] = [
  { src: staticFile('broll-rh-hook.png'),       tIn:  0.00, tOut:  2.05, mode: 'full' }, // "good things about robinhood memes... the king"
  { src: staticFile('broll-rh-app.png'),        tIn:  9.45, tOut: 11.80, mode: 'zone' }, // "listed on the robinhood app"
  { src: staticFile('broll-rh-floodgates.png'), tIn: 18.42, tOut: 21.35, mode: 'full' }, // "open the floodgates to retail, to stock retail" — CLIMAX
  { src: staticFile('broll-rh-sixbillion.png'), tIn: 27.10, tOut: 29.38, mode: 'full' }, // "a hundred x... six billion" — CLIMAX BUTTON
];

// ─── Number badges (crisp code text over the six-billion button; never baked into art) ──────
// One at a time, top zone (y~300) — never overlaps the caption band (y872) in space, never overlaps
// another badge in time, never renders while the thumbnail cover is up.
export type RhBadge = { tIn: number; tOut: number; big: string; sub: string; color: 'green' | 'yellow' };
export const BADGES_RHFG: RhBadge[] = [
  { tIn: 27.20, tOut: 28.58, big: '100X',      sub: 'REALISTIC',  color: 'green'  },
  { tIn: 28.70, tOut: 29.38, big: '$6 BILLION', sub: 'MARKET CAP', color: 'yellow' },
];

// ─── SFX events ──────────────────────────────────────────────────────────────────
// whoosh on the thumbnail cut + hook->base, ting on the app listing, riser->impact into the
// floodgates climax, impact on "absolutely huge", riser->kick + cash register on the six-billion
// button. All literal sfx asset refs (gate-visible), all under the VO.
export type RhSfx = { t: number; src: string; vol: number; dur: number };
export const SFX_RHFG: RhSfx[] = [
  { t:  0.00, src: staticFile('sfx/Cinematic Whoosh 02.wav'),               vol: 0.50, dur: 1.6 }, // thumbnail cut -> hook
  { t:  2.05, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.42, dur: 1.0 }, // hook full -> base
  { t:  9.45, src: staticFile('sfx/TING SOUND EFFECT.mp3'),                 vol: 0.42, dur: 1.4 }, // "listed on the robinhood app"
  { t: 17.95, src: staticFile('sfx/Riser Sound Effect.mp3'),               vol: 0.38, dur: 2.4 }, // build into the floodgates
  { t: 18.42, src: staticFile('sfx/Boom - Big Reveal.wav'),                vol: 0.55, dur: 3.0 }, // floodgates BURST (biggest)
  { t: 22.00, src: staticFile('sfx/Impacts/Impact_1.wav'),                 vol: 0.48, dur: 1.8 }, // "they're absolutely huge"
  { t: 26.70, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_1.wav'), vol: 0.38, dur: 2.5 }, // build into the button
  { t: 27.10, src: staticFile('sfx/Impacts/Kick_Impact_01.wav'),           vol: 0.52, dur: 2.0 }, // "a hundred x"
  { t: 28.80, src: staticFile('sfx/Cash Register.mp3'),                    vol: 0.46, dur: 1.8 }, // "six billion" (kaching)
];

// ─── Captions ──────────────────────────────────────────────────────────────────
// Transcribed FRESH from this finalized clip (whisper-words-floodgates-100x-full.json), grouped
// word-by-word (2-4 words). STT fix: "lit" -> "lists"; "Robinhood" came through correct. "the king"
// kept as spoken (refers to Cash Cat; no coin name invented on screen). Colour spans (_kit.colourize):
// <gr>=green (Robinhood brand / bullish numbers), <y>=yellow (hype words).
export const CAPTIONS_RHFG: { t: number; h: string }[] = [
  { t:  0.00, h: 'now one of the' },
  { t:  0.74, h: 'good things about' },
  { t:  1.50, h: '<gr>robinhood</gr> memes' },
  { t:  2.40, h: 'in general,' },
  { t:  3.18, h: 'especially one' },
  { t:  3.82, h: 'like this,' },
  { t:  4.38, h: 'that appears' },
  { t:  4.86, h: 'to be the' },
  { t:  5.36, h: '<y>king</y> of the' },
  { t:  5.92, h: 'memes so far,' },
  { t:  7.02, h: 'is that some' },
  { t:  7.66, h: 'of these memes' },
  { t:  8.58, h: 'are gonna get' },
  { t:  9.36, h: '<y>listed</y> on' },
  { t: 10.72, h: 'the <gr>robinhood</gr> app,' },
  { t: 12.02, h: 'right? but if' },
  { t: 12.92, h: 'that does happen' },
  { t: 13.78, h: 'where <gr>robinhood</gr>' },
  { t: 14.68, h: 'lists some of' },
  { t: 15.26, h: 'these meme coins' },
  { t: 15.84, h: 'on their app,' },
  { t: 16.78, h: 'they open up' },
  { t: 17.20, h: 'the doorway,' },
  { t: 18.02, h: 'they open up the' },
  { t: 18.56, h: '<y>floodgates</y>' },
  { t: 19.18, h: 'to retail,' },
  { t: 20.36, h: 'to <y>stock retail</y>,' },
  { t: 21.62, h: 'and they\'re <y>huge</y>,' },
  { t: 23.08, h: 'they\'re <y>absolutely huge</y>.' },
  { t: 24.20, h: 'so something' },
  { t: 24.58, h: 'like that,' },
  { t: 25.20, h: 'it could realistically' },
  { t: 25.92, h: 'put this thing' },
  { t: 26.62, h: 'up like a' },
  { t: 27.14, h: '<gr>hundred x</gr>' },
  { t: 27.58, h: 'from where' },
  { t: 27.82, h: 'it is today,' },
  { t: 28.24, h: 'talking like' },
  { t: 28.80, h: '<gr>six billion</gr>' },
];

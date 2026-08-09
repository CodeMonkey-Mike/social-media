import { staticFile } from 'remotion';

// ─── 9hood-full (batch: robinhood, clip #3 rank 3, variant: full) ─────────────────────
// Spine = tightened.mp4 (ALREADY tightened + desilenced; build on THIS, do not re-cut).
// Composited vertical 1080x1920: screen-share (the real 9Hood project page / the poem Mike is
// presenting) top 0..SEAM, Mike's green-screen face bottom. Seam y~846 (same source framing as
// clips 1-2); caption band centred y~872 (over the forehead, well above the eyes ~y1290). Clip
// 84.0s @ 25fps; comp @ 30fps (OffthreadVideo resamples by time).
//
// Built to the FINALIZED-SHORT contract (livestream-repurpose/skills/remotion-shorts-build/SKILL.md),
// modelled on clip 1 (RobinhoodFloodgates) + clip 2 (CashcatKing) for consistency:
//   frame-0 designed thumbnail cover + b-roll LAYER (HALVED budget: 30.6% b-roll / 69.4% base,
//   3 full-screens = hook / BOMO-10M reveal / conviction-close climax + 4 content-zone cutaways) + SFX
//   (11 events). Robinhood-chain coins/glow = BRIGHT NEON LIME GREEN (#CCFF00) + gold (persona.json
//   robinhood_coin), never teal. 9Hood/BOMO have NO reference logo -> generic gray tabby cat in a GREEN
//   hood (the "one green hood" identity) + Robin-Hood-raider theme + BOMO 10M-track-record graphic;
//   blank coins, faceless whales/crowds, no real logos/faces.
// No number badges (like clip 2): the spoken numbers (10 million / $200K / $224K) live in the captions
//   only, so no corrected/disputed market-cap number is put on screen and no badge-vs-broll collision.
// The POEM READ (40.16-49.74) is left BASE (screen-share the poem, deliberate dramatic pauses).
//
// Render (public-dir = the batch render-assets/, holds the spine mp4 + thumb + broll + sfx):
//   npx remotion render src/index.ts NineHood out/robinhood/3-9hood-full.mp4 \
//     --public-dir "<repo>/video-creation/shorts/robinhood/render-assets"

export const N9H_FPS = 30;
export const N9H_DURATION = 2521; // 84.033s * 30; covers audio 84.014s + final word "us" (ends 83.96s)

export const CLIP  = staticFile('9hood-full.mp4');
export const THUMB = staticFile('broll-9h-thumb.png');
export const THUMB_TITLE = 'I BOUGHT NINEHOOD';
export const THUMB_CHIP  = 'THE BOMO TEAM PLAY';

// Layout geometry (measured from an extracted frame; same source framing as clips 1-2)
export const N9H_SEAM  = 846;   // screen-share (top) / face (bottom) seam; content-zone broll covers 0..SEAM
export const N9H_CAP_Y = 872;   // caption centre — just below the seam, over the forehead, never the eyes

// ─── B-roll beats ────────────────────────────────────────────────────────────────
// mode 'full' = whole frame (hook, BOMO-10M reveal, conviction climax); 'zone' = top screen-share zone
// only (0..SEAM), Mike's face stays visible below. Only bought->climax are adjacent (hard-cut zone->full,
// no base flash); all other beats fade to/from base. staticFile() calls are LITERAL strings on purpose
// (the finalized-short gate scans for literal asset refs; keep them literal, not helper-built).
export type N9hBroll = { src: string; tIn: number; tOut: number; mode: 'full' | 'zone' };
export const BROLL_N9H: N9hBroll[] = [
  { src: staticFile('broll-9h-hook.png'),        tIn:  0.00, tOut:  2.50, mode: 'full' }, // "a nice one... called 9Hood" — HOOK
  { src: staticFile('broll-9h-triple.png'),      tIn:  9.80, tOut: 13.40, mode: 'zone' }, // "9Hood = nine lives from a cat... in a hood" (triple meaning)
  { src: staticFile('broll-9h-bomo.png'),        tIn: 25.98, tOut: 29.40, mode: 'full' }, // "brought BOMO on base up to a 10 million market cap" — REVEAL/TRANSITION
  { src: staticFile('broll-9h-multipliers.png'), tIn: 35.40, tOut: 38.30, mode: 'zone' }, // "seeing some multipliers... pretty good play"
  { src: staticFile('broll-9h-raider.png'),      tIn: 55.70, tOut: 59.90, mode: 'zone' }, // "mixture of Robin Hood, stealing from the rich, giving to the poor"
  { src: staticFile('broll-9h-bought.png'),      tIn: 74.90, tOut: 79.85, mode: 'zone' }, // "only $200K... i got it yesterday at $200K" — receipts
  { src: staticFile('broll-9h-climax.png'),      tIn: 79.85, tOut: 84.10, mode: 'full' }, // "rock solid team... proven themselves" — CLIMAX BUTTON (hard-cut from bought)
];

// ─── SFX events ──────────────────────────────────────────────────────────────────
// whoosh on the thumbnail cut + hook->base, ting on the triple/multipliers/bought cutaways, riser->boom
// into the BOMO 10M reveal, impact on the raider "he raids" beat, tension-riser->kick + cash register on
// the conviction climax. Poem read (40.16-49.74) left SFX-free for its dramatic pauses. All literal sfx
// asset refs (gate-visible), all under the VO.
export type N9hSfx = { t: number; src: string; vol: number; dur: number };
export const SFX_N9H: N9hSfx[] = [
  { t:  0.00, src: staticFile('sfx/Cinematic Whoosh 02.wav'),               vol: 0.50, dur: 1.6 }, // thumbnail cut -> hook
  { t:  2.50, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.42, dur: 1.0 }, // hook full -> base
  { t:  9.80, src: staticFile('sfx/TING SOUND EFFECT.mp3'),                 vol: 0.40, dur: 1.4 }, // triple-meaning cutaway
  { t: 25.50, src: staticFile('sfx/Riser Sound Effect.mp3'),               vol: 0.36, dur: 2.4 }, // build into the BOMO reveal
  { t: 25.98, src: staticFile('sfx/Boom - Big Reveal.wav'),                vol: 0.52, dur: 3.0 }, // BOMO 10M reveal BURST
  { t: 35.40, src: staticFile('sfx/TING SOUND EFFECT.mp3'),                 vol: 0.40, dur: 1.4 }, // multipliers cutaway
  { t: 55.70, src: staticFile('sfx/Impacts/Impact_1.wav'),                 vol: 0.46, dur: 1.8 }, // raider "he raids" beat
  { t: 74.90, src: staticFile('sfx/TING SOUND EFFECT.mp3'),                 vol: 0.40, dur: 1.4 }, // bought-yesterday receipt
  { t: 79.40, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_1.wav'), vol: 0.38, dur: 2.5 }, // build into the climax
  { t: 79.85, src: staticFile('sfx/Impacts/Kick_Impact_01.wav'),           vol: 0.52, dur: 2.0 }, // climax button kick
  { t: 80.30, src: staticFile('sfx/Cash Register.mp3'),                    vol: 0.44, dur: 1.8 }, // kaching on the conviction close
];

// ─── Captions ──────────────────────────────────────────────────────────────────
// Transcribed FRESH from this finalized clip (whisper-words-9hood-full.json), grouped word-by-word
// (2-4 words). STT fixes for on-screen text ONLY (audio unchanged): "nine hood"->"9Hood",
// "nine lies from a cat"->"nine lives from a cat", "crypto C sales"->"crypto seas", "stealing from the
// ridge"->"stealing from the rich", "Bomo"->"BOMO", "200k"/"224"/"at 200"->"$200K"/"$224K"/"$200K".
// Whisper already had "Robin Hood" and "whales hoard" correct. UNCERTAIN MANGLES kept per persona (NOT
// replaced with an invented word): the garbled filler "concerned"/"concerted" (~74.7s), the mumbled
// "on KFC, 20" (~23.6s) and "makes a good center" (~52s) are routed around in the grouping (house style
// compresses mumbles), never invented. Colour spans (_kit.colourize): <gr>=green (Robinhood brand / coin
// name / receipts / bullish), <y>=yellow (hype), <r>=red (antagonist: insiders / rugged).
export const CAPTIONS_N9H: { t: number; h: string }[] = [
  { t:  0.00, h: 'this one is' },
  { t:  0.76, h: 'a <y>nice one</y>' },
  { t:  2.84, h: 'this is called' },
  { t:  3.34, h: '<gr>ninehood</gr>' },
  { t:  5.12, h: 'why do you' },
  { t:  5.72, h: 'call it?' },
  { t:  6.28, h: 'not like a' },
  { t:  6.70, h: '<y>double meaning</y>,' },
  { t:  7.38, h: 'but even a' },
  { t:  7.66, h: '<y>triple meaning</y>' },
  { t:  8.46, h: 'so you got' },
  { t:  8.72, h: '<gr>robin hood</gr>' },
  { t:  9.62, h: 'you got' },
  { t:  9.78, h: '<gr>ninehood</gr> meaning' },
  { t: 10.80, h: '<gr>nine lives</gr>' },
  { t: 11.44, h: 'from a cat' },
  { t: 12.18, h: 'you got <gr>hood</gr>' },
  { t: 12.84, h: 'because the thing' },
  { t: 13.62, h: 'is in a <gr>hood</gr>' },
  { t: 14.68, h: 'so, and the' },
  { t: 17.30, h: '<y>good thing</y> about' },
  { t: 17.98, h: 'this one is' },
  { t: 19.40, h: 'that this is from' },
  { t: 20.44, h: 'the <gr>bomo team</gr>' },
  { t: 21.52, h: 'so if you\'re' },
  { t: 22.26, h: 'familiar with <gr>bomo</gr>' },
  { t: 24.42, h: 'or <gr>bomo on base</gr>' },
  { t: 25.98, h: 'they brought <gr>bomo</gr>' },
  { t: 27.14, h: 'on base up to' },
  { t: 28.30, h: 'a <gr>10 million</gr>' },
  { t: 28.72, h: '<gr>market cap</gr>' },
  { t: 29.58, h: 'so even if' },
  { t: 30.22, h: 'it goes to just' },
  { t: 31.44, h: 'a <gr>10 million cap</gr>' },
  { t: 32.42, h: 'we\'re gonna be' },
  { t: 33.42, h: 'we know it\'s' },
  { t: 35.40, h: 'seeing some' },
  { t: 35.80, h: '<y>multipliers</y>' },
  { t: 36.64, h: 'i think it\'s a' },
  { t: 37.34, h: '<y>pretty good play</y>' },
  { t: 38.66, h: 'i just got some' },
  { t: 39.86, h: 'yes' },
  { t: 40.16, h: 'deep in the' },
  { t: 40.74, h: '<gr>crypto seas</gr>' },
  { t: 42.40, h: 'a gray <gr>tabby</gr>' },
  { t: 44.20, h: 'with <gr>nine lives</gr>' },
  { t: 45.40, h: 'and one <gr>green hood</gr>' },
  { t: 47.02, h: '<gr>ninehood</gr>,' },
  { t: 47.68, h: 'where the <y>whales hoard</y>,' },
  { t: 48.94, h: '<y>he raids</y>' },
  { t: 50.06, h: 'so i like this' },
  { t: 50.70, h: 'like the <y>whales</y>' },
  { t: 53.20, h: 'it makes sense' },
  { t: 54.78, h: 'for me' },
  { t: 55.22, h: 'so it\'s like a' },
  { t: 55.74, h: '<y>mixture</y> of' },
  { t: 56.16, h: '<gr>robin hood</gr>' },
  { t: 57.02, h: '<gr>stealing from</gr>' },
  { t: 57.48, h: '<gr>the rich</gr>,' },
  { t: 58.06, h: '<gr>giving back</gr>' },
  { t: 58.54, h: 'to the <gr>poor</gr>' },
  { t: 60.08, h: 'the whole thing' },
  { t: 60.78, h: 'where in <gr>crypto</gr>,' },
  { t: 61.66, h: 'you want to' },
  { t: 62.26, h: '<y>avoid</y> the' },
  { t: 62.76, h: '<r>insiders</r>' },
  { t: 63.26, h: 'so they don\'t' },
  { t: 63.76, h: 'take advantage' },
  { t: 64.32, h: 'of you' },
  { t: 64.88, h: 'the <y>little people</y>' },
  { t: 65.36, h: 'can <gr>profit</gr>' },
  { t: 66.46, h: 'and not' },
  { t: 66.58, h: 'get <r>rugged</r>' },
  { t: 68.08, h: 'so i think it has' },
  { t: 68.92, h: 'a really' },
  { t: 69.16, h: '<y>awesome narrative</y>' },
  { t: 70.16, h: 'i think it\'s' },
  { t: 71.82, h: '<gr>rock solid</gr>' },
  { t: 72.80, h: 'it has a' },
  { t: 73.10, h: '<gr>very good</gr>' },
  { t: 73.50, h: '<gr>market cap</gr>' },
  { t: 74.90, h: 'it\'s only' },
  { t: 75.38, h: '<gr>$200K</gr>,' },
  { t: 76.06, h: 'we\'re <gr>$224K</gr>' },
  { t: 76.80, h: 'right now' },
  { t: 77.78, h: 'and i got it' },
  { t: 78.88, h: '<y>yesterday</y> at' },
  { t: 79.38, h: '<gr>$200K</gr>' },
  { t: 79.98, h: 'i think it\'s their' },
  { t: 80.32, h: '<gr>rock solid team</gr>' },
  { t: 81.24, h: 'they\'ve already' },
  { t: 81.78, h: '<y>proven themselves</y>' },
  { t: 82.46, h: 'and let\'s see' },
  { t: 83.36, h: 'where it takes us' },
];

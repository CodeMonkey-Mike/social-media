import { staticFile } from 'remotion';

// ─── floodgates-100x-impact (batch: robinhood, clip #6 rank 1, variant: impact) ──────
// Spine = tightened.mp4 (ALREADY tightened + desilenced; build on THIS, do not re-cut).
// This is the PUNCH sub-cut of clip 1 (RobinhoodFloodgates): the floodgates run alone. Composited
// vertical 1080x1920: the Cash Cat / Robinhood-chain DexScreener chart (screen-share) top 0..SEAM,
// Mike's green-screen face bottom. Seam y~846 (same source framing as clips 1-5, verified from an
// extracted frame); caption band centred y~872 (over the forehead, well above the eyes). Clip 16.72s
// @ 25fps; comp @ 30fps (OffthreadVideo resamples by time). Last spoken word "billion" ends 16.62s.
//
// Built to the FINALIZED-SHORT contract (livestream-repurpose/skills/remotion-shorts-build/SKILL.md),
// modelled on clip 5 (ClarityActCatalyst) for consistency: frame-0 designed thumbnail cover + b-roll
// LAYER (HALVED budget: 33.6% b-roll / 66.4% base, 3 full-screens = hook / floodgates-climax /
// six-billion-button; NO content-zone beat, NO number badges) + SFX (8 events, riser->impact on the
// two bursts). Robinhood-chain coins/glow = BRIGHT NEON LIME GREEN (#CCFF00) + gold (persona.json
// robinhood_coin), never teal.
// ⛔ DISTINCT from clip 1: all b-roll uses NEW filenames (broll-fgi-*.png), freshly generated distinct
//   compositions, md5-verified distinct from clip 1's broll-rh-*.png (the feed must not see a recycled
//   frame). Named coin (Cash Cat) has NO reference logo -> generic thematic b-roll only, blank coins,
//   faceless crowds, no real Robinhood wordmark, no real faces.
//
// Render (public-dir = the batch render-assets/, holds the spine mp4 + thumb + broll + sfx):
//   npx remotion render src/index.ts FloodgatesImpact out/robinhood/6-floodgates-100x-impact.mp4 \
//     --public-dir "<repo>/video-creation/shorts/robinhood/render-assets"

export const FGI_FPS = 30;
export const FGI_DURATION = 502; // 16.72s * 30 = 501.6 -> 502; covers audio 16.721s + final word "billion" (ends 16.62s)

export const CLIP  = staticFile('floodgates-100x-impact.mp4');
export const THUMB = staticFile('broll-fgi-thumb.png');
export const THUMB_TITLE = 'THE FLOODGATES MOMENT';
export const THUMB_CHIP  = 'NOBODY IS PRICING IN';

// Layout geometry (measured from an extracted frame; same source framing as clips 1-5)
export const FGI_SEAM  = 846;   // screen-share (top) / face (bottom) seam; content-zone broll covers 0..SEAM
export const FGI_CAP_Y = 872;   // caption centre — just below the seam, over the forehead, never the eyes

// ─── B-roll beats ────────────────────────────────────────────────────────────────
// All 'full' = whole frame (hook, floodgates climax, six-billion button) — the 3 sanctioned
// hook/transition/climax full-screens at the firm 1-3 cap, right for an all-climax punch clip. None
// are adjacent (base gaps 3.80s and 7.30s, both >> 1.5s) so each fades to/from the base — no
// full-to-full base flash. The six-billion tOut (16.90) runs past comp-end (16.73s) so it HOLDS
// full-screen through the last frame. staticFile() calls are LITERAL strings on purpose (the
// finalized-short gate scans for literal asset refs; keep them literal, not helper-built).
export type FgiBroll = { src: string; tIn: number; tOut: number; mode: 'full' | 'zone' };
export const BROLL_FGI: FgiBroll[] = [
  { src: staticFile('broll-fgi-hook.png'),       tIn:  0.00, tOut:  1.75, mode: 'full' }, // "if that does happen where robinhood lists these meme coins on their app" — HOOK
  { src: staticFile('broll-fgi-floodgates.png'), tIn:  5.55, tOut:  7.55, mode: 'full' }, // "the floodgates to retail, to stock retail" — CLIMAX centerpiece
  { src: staticFile('broll-fgi-sixbillion.png'), tIn: 14.85, tOut: 16.90, mode: 'full' }, // "a hundred x from where it is today, talking like six billion" — CLIMAX BUTTON (holds to end)
];

// ─── SFX events ──────────────────────────────────────────────────────────────────
// whoosh on the thumbnail cut + hook->base, riser->BIG BOOM into the floodgates BURST, an impact on
// "they're huge", tension-riser->kick into the six-billion button, cash register (kaching) on "six
// billion". Only files present in render-assets/sfx/. All under the VO.
export type FgiSfx = { t: number; src: string; vol: number; dur: number };
export const SFX_FGI: FgiSfx[] = [
  { t:  0.00, src: staticFile('sfx/Cinematic Whoosh 02.wav'),                vol: 0.50, dur: 1.6 }, // thumbnail cut -> hook
  { t:  1.75, src: staticFile('sfx/transition_rapid_whoosh.mp3'),            vol: 0.42, dur: 1.0 }, // hook full -> base
  { t:  5.10, src: staticFile('sfx/Riser Sound Effect.mp3'),                 vol: 0.38, dur: 1.6 }, // build into the floodgates
  { t:  5.55, src: staticFile('sfx/Boom - Big Reveal.wav'),                  vol: 0.56, dur: 3.0 }, // floodgates BURST (biggest)
  { t:  9.30, src: staticFile('sfx/Impacts/Impact_1.wav'),                   vol: 0.48, dur: 1.8 }, // "they're huge"
  { t: 13.90, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_1.wav'),  vol: 0.38, dur: 2.2 }, // build into the six-billion button
  { t: 14.85, src: staticFile('sfx/Impacts/Kick_Impact_01.wav'),            vol: 0.52, dur: 2.0 }, // "a hundred x"
  { t: 16.10, src: staticFile('sfx/Cash Register.mp3'),                     vol: 0.46, dur: 1.6 }, // "six billion" (kaching)
];

// ─── Captions ──────────────────────────────────────────────────────────────────
// Transcribed FRESH from this finalized clip (whisper-words-floodgates-100x-impact.json, base word
// timings), grouped word-by-word (2-4 words). STT fixes for on-screen text ONLY (audio unchanged):
// "Robin Hood" -> "robinhood"; "lifts" -> "lists"; "immune coins" -> "meme coins"; trailing STT
// artifact "he's" dropped so the tail reads "talking like six billion" (matches clip 1's render of
// this same segment). Ends hard on "six billion". Colour spans (_kit.colourize): <gr>=green (brand:
// robinhood / bullish numbers: hundred x, six billion), <y>=yellow (hype: floodgates, stock retail,
// huge, absolutely huge).
export const CAPTIONS_FGI: { t: number; h: string }[] = [
  { t:  0.00, h: 'if that does' },
  { t:  0.80, h: 'happen where' },
  { t:  1.56, h: '<gr>robinhood</gr> lists' },
  { t:  2.34, h: 'some of these' },
  { t:  2.76, h: 'meme coins' },
  { t:  3.24, h: 'on their app,' },
  { t:  4.16, h: 'they open up' },
  { t:  4.58, h: 'the doorway,' },
  { t:  5.02, h: 'they open up the' },
  { t:  5.92, h: '<y>floodgates</y>' },
  { t:  6.46, h: 'to retail,' },
  { t:  7.58, h: 'to <y>stock retail</y>,' },
  { t:  8.76, h: 'and they\'re <y>huge</y>,' },
  { t:  9.84, h: 'they\'re <y>absolutely huge</y>.' },
  { t: 11.40, h: 'so something' },
  { t: 11.96, h: 'like that,' },
  { t: 12.34, h: 'they could' },
  { t: 12.76, h: 'realistically' },
  { t: 13.22, h: 'put this thing' },
  { t: 13.96, h: 'up to like a' },
  { t: 14.48, h: '<gr>hundred x</gr>' },
  { t: 14.94, h: 'from where' },
  { t: 15.14, h: 'it is today,' },
  { t: 15.84, h: 'talking like' },
  { t: 16.14, h: '<gr>six billion</gr>' },
];

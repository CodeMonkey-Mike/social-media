import { staticFile } from 'remotion';

// ─── hoodrat-matt-furie-full (batch: robinhood, clip #4 rank 4, variant: full) ────────
// Spine = tightened.mp4 (ALREADY tightened + desilenced; build on THIS, do not re-cut).
// Composited vertical 1080x1920: screen-share (the real HOODRAT Dexscreener chart / the HOODRAT-on-
// Robinhood project site Mike is presenting) top 0..SEAM, Mike's green-screen face bottom. Seam y~846
// (same source framing as clips 1-3); caption band centred y~872 (over the forehead, well above the
// eyes ~y1290). Clip 37.77s @ 25fps; comp @ 30fps (OffthreadVideo resamples by time).
//
// Built to the FINALIZED-SHORT contract (livestream-repurpose/skills/remotion-shorts-build/SKILL.md),
// modelled on clips 1-3 (RobinhoodFloodgates / CashcatKing / NineHood) for consistency:
//   frame-0 designed thumbnail cover + b-roll LAYER (HALVED budget: 33.8% b-roll / 66.2% base,
//   3 full-screens = hook / Matt-Furie discovery REVEAL(peak) / conviction-close CLIMAX + 1 content-zone
//   cutaway) + SFX (9 events). Robinhood-chain coins/glow = BRIGHT NEON LIME GREEN (#CCFF00) + gold
//   (persona.json robinhood_coin), never teal.
// ⛔ IP CARE: Matt Furie is a real person (Pepe's creator) + Pepe is a real copyrighted meme. Hoodrat
//   b-roll = a GENERIC original cartoon HOODED RAT (a rat in a hood, NOT a frog, NOT Pepe) in a loose
//   indie/underground-comic art style; NO Matt Furie face, NO real Pepe, blank coins, faceless figures,
//   no real logos. Matt Furie's NAME appears only in the spoken captions (and Mike's approved title).
// No number badges (like clips 2-3): no market-cap number is put on screen (no corrected/disputed figure,
//   no badge-vs-broll collision). The long conviction/site-read stretches (rock-solid-play / reading the
//   real CERTIFIED $HOODRAT site + "born on Robinhood") are left BASE.
//
// Render (public-dir = the batch render-assets/, holds the spine mp4 + thumb + broll + sfx):
//   npx remotion render src/index.ts HoodratMattFurie out/robinhood/4-hoodrat-matt-furie-full.mp4 \
//     --public-dir "<repo>/video-creation/shorts/robinhood/render-assets"

export const HR_FPS = 30;
export const HR_DURATION = 1135; // 37.833s * 30; covers audio 37.772s + final word "one" (ends 37.72s)

export const CLIP  = staticFile('hoodrat-matt-furie-full.mp4');
export const THUMB = staticFile('broll-hr-thumb.png');
export const THUMB_TITLE = 'THE MATT FURIE PLAY';
export const THUMB_CHIP  = 'BORN ON ROBINHOOD';

// Layout geometry (measured from an extracted frame; same source framing as clips 1-3)
export const HR_SEAM  = 846;   // screen-share (top) / face (bottom) seam; content-zone broll covers 0..SEAM
export const HR_CAP_Y = 872;   // caption centre — just below the seam, over the forehead, never the eyes

// ─── B-roll beats ────────────────────────────────────────────────────────────────
// mode 'full' = whole frame (hook, Matt-Furie reveal peak, conviction climax); 'zone' = top screen-share
// zone only (0..SEAM), Mike's face stays visible below. No beats are adjacent (all base gaps >> 1.5s) so
// every beat fades to/from the base — no base flash. staticFile() calls are LITERAL strings on purpose
// (the finalized-short gate scans for literal asset refs; keep them literal, not helper-built).
export type HrBroll = { src: string; tIn: number; tOut: number; mode: 'full' | 'zone' };
export const BROLL_HR: HrBroll[] = [
  { src: staticFile('broll-hr-hook.png'),   tIn:  0.00, tOut:  2.00, mode: 'full' }, // "certainly not least is Hoodrat" — HOOK
  { src: staticFile('broll-hr-reveal.png'), tIn:  9.55, tOut: 13.55, mode: 'full' }, // "oh, this is a Matt Furie play. Hell yeah." — PEAK REVEAL
  { src: staticFile('broll-hr-comic.png'),  tIn: 21.00, tOut: 23.90, mode: 'zone' }, // "it's like a typical Matt Furie site"
  { src: staticFile('broll-hr-climax.png'), tIn: 34.00, tOut: 38.20, mode: 'full' }, // "probably gonna be a good one" — CLIMAX BUTTON (tOut past comp-end 37.83s so it HOLDS full-screen through the last frame, no fade-to-base)
];

// ─── SFX events ──────────────────────────────────────────────────────────────────
// whoosh on the thumbnail cut + hook->base, riser->boom into the Matt-Furie reveal, a KICK IMPACT on the
// "Hell yeah" punch (the reveal ding), ting on the comic cutaway, tension-riser->impact + cash register on
// the conviction climax. All literal sfx asset refs (gate-visible), all under the VO.
export type HrSfx = { t: number; src: string; vol: number; dur: number };
export const SFX_HR: HrSfx[] = [
  { t:  0.00, src: staticFile('sfx/Cinematic Whoosh 02.wav'),                vol: 0.50, dur: 1.6 }, // thumbnail cut -> hook
  { t:  2.00, src: staticFile('sfx/transition_rapid_whoosh.mp3'),            vol: 0.42, dur: 1.0 }, // hook full -> base
  { t:  9.05, src: staticFile('sfx/Riser Sound Effect.mp3'),                vol: 0.36, dur: 1.0 }, // build into the Matt Furie reveal
  { t:  9.55, src: staticFile('sfx/Boom - Big Reveal.wav'),                 vol: 0.52, dur: 2.6 }, // reveal burst "oh, this is a Matt Furie play"
  { t: 12.62, src: staticFile('sfx/Impacts/Kick_Impact_01.wav'),            vol: 0.54, dur: 1.6 }, // "HELL YEAH" punch (reveal ding)
  { t: 21.00, src: staticFile('sfx/TING SOUND EFFECT.mp3'),                 vol: 0.40, dur: 1.4 }, // comic cutaway
  { t: 33.60, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_1.wav'), vol: 0.38, dur: 2.5 }, // build into the climax
  { t: 34.00, src: staticFile('sfx/Impacts/Impact_1.wav'),                  vol: 0.50, dur: 1.8 }, // climax button impact
  { t: 34.40, src: staticFile('sfx/Cash Register.mp3'),                     vol: 0.44, dur: 1.8 }, // kaching on the conviction close
];

// ─── Captions ──────────────────────────────────────────────────────────────────
// Transcribed FRESH from this finalized clip (whisper-words-hoodrat-matt-furie-full.json), grouped
// word-by-word (2-4 words). STT fixes for on-screen text ONLY (audio unchanged): "Matt Fury"/"Matt
// Furies"->"matt furie", "side"->"site", "I did rally"->"it did rally", "Robin Hood"->"robinhood".
// The comic title Whisper garbled as "Knight Rider's Comet" is kept GENERAL as spoken ("matt furie's
// comic") — an exact title is NOT invented (per the run guardrail). Colour spans (_kit.colourize):
// <gr>=green (Hoodrat / Robinhood / bullish "rock solid play"), <y>=yellow (hype: "pretty cool" /
// "matt furie play" reveal / "hell yeah" / "good one"). No antagonist -> no red.
export const CAPTIONS_HR: { t: number; h: string }[] = [
  { t:  0.00, h: 'and certainly' },
  { t:  0.72, h: 'not least is' },
  { t:  1.46, h: '<gr>hoodrat</gr>' },
  { t:  2.04, h: 'i think it\'s' },
  { t:  2.54, h: '<y>pretty cool</y>' },
  { t:  3.44, h: 'and it' },
  { t:  3.60, h: 'did rally again' },
  { t:  4.54, h: 'with some of' },
  { t:  5.38, h: 'the others and' },
  { t:  6.14, h: 'went up like' },
  { t:  6.64, h: 'a week ago' },
  { t:  7.50, h: 'but this one' },
  { t:  8.42, h: 'i looked into' },
  { t:  8.98, h: 'it and i\'m like' },
  { t:  9.58, h: 'oh,' },
  { t: 10.26, h: 'this is a' },
  { t: 10.94, h: '<y>matt furie play</y>' },
  { t: 12.62, h: '<y>hell yeah</y>' },
  { t: 14.14, h: 'hey, yeah man' },
  { t: 15.64, h: 'it\'s <y>pretty cool</y>' },
  { t: 16.46, h: 'now, yeah,' },
  { t: 17.24, h: 'it\'s just a' },
  { t: 18.06, h: '<gr>rock solid play</gr>' },
  { t: 19.32, h: 'you know,' },
  { t: 19.58, h: 'a good website' },
  { t: 20.78, h: 'it\'s like a' },
  { t: 21.12, h: 'typical matt furie' },
  { t: 21.96, h: 'site, you know' },
  { t: 24.18, h: 'so it\'s a' },
  { t: 24.96, h: 'legendary character' },
  { t: 25.74, h: 'inspired by' },
  { t: 26.46, h: 'matt furie\'s comic' },
  { t: 28.68, h: '<gr>hoodrat</gr> is born' },
  { t: 29.62, h: 'on <gr>robinhood</gr>' },
  { t: 30.58, h: 'so yeah, maybe' },
  { t: 31.30, h: 'this is like' },
  { t: 32.58, h: 'the <y>matt furie</y>' },
  { t: 33.46, h: '<y>play</y> on <gr>robinhood</gr>' },
  { t: 34.74, h: 'so not' },
  { t: 35.38, h: 'financial advice,' },
  { t: 36.36, h: 'but this is' },
  { t: 36.78, h: 'probably going to' },
  { t: 37.26, h: 'be a <y>good one</y>' },
];

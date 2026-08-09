import { staticFile } from 'remotion';

// ─── clarity-act-catalyst-full (batch: robinhood, clip #5 rank 5, variant: full) ──────
// Spine = tightened.mp4 (ALREADY tightened + desilenced; build on THIS, do not re-cut).
// Composited vertical 1080x1920: the market view Mike is presenting (screen-share) top 0..SEAM, Mike's
// green-screen face bottom. Seam y~846 (same source framing as clips 1-4); caption band centred y~872
// (over the forehead, well above the eyes). Clip 52.28s @ 25fps; comp @ 30fps (OffthreadVideo resamples
// by time). Last spoken word "gutter" ends 52.24s.
//
// Built to the FINALIZED-SHORT contract (livestream-repurpose/skills/remotion-shorts-build/SKILL.md),
// modelled on clips 1-4 (RobinhoodFloodgates / CashcatKing / NineHood / HoodratMattFurie) for
// consistency: frame-0 designed thumbnail cover + b-roll LAYER (HALVED budget: 32.4% b-roll / 67.6%
// base, 3 full-screens = hook / Clarity-Act-clears-Senate TRANSITION / "send us flying" CLIMAX + 3
// content-zone cutaways) + SFX (9 events, riser->impact into the peak). Robinhood-chain coins/glow =
// BRIGHT NEON LIME GREEN (#CCFF00) + gold (persona.json robinhood_coin), never teal.
// ⛔ IP CARE: the President / "Trump" is SPOKEN. NO real politician's face, NO Trump face in b-roll.
//   Legislative imagery is GENERIC: US Capitol dome, a bill/legislation document, a presidential-desk
//   pen-signing WITHOUT a face (hand + pen only), institutions/banks waiting at a vault gate, green
//   bullish candles/coins. NO real crypto logos, NO real faces; blank/generic coins; faceless figures.
//   "Trump" appears only in the spoken caption (lowercase "trump's desk"), never as a face.
// No number badges (like clips 2-4): no price/market-cap number on screen (no disputed figure, no
//   badge-vs-broll collision). The long explanation stretches (13-30 / 40-47) are left BASE.
//
// Render (public-dir = the batch render-assets/, holds the spine mp4 + thumb + broll + sfx):
//   npx remotion render src/index.ts ClarityActCatalyst out/robinhood/5-clarity-act-catalyst-full.mp4 \
//     --public-dir "<repo>/video-creation/shorts/robinhood/render-assets"

export const CAC_FPS = 30;
export const CAC_DURATION = 1569; // 52.30s * 30; covers audio 52.273s + final word "gutter" (ends 52.24s)

export const CLIP  = staticFile('clarity-act-catalyst-full.mp4');
export const THUMB = staticFile('broll-clarity-thumb.png');
export const THUMB_TITLE = 'THE CLARITY ACT';
export const THUMB_CHIP  = 'COULD SEND US FLYING';

// Layout geometry (measured from an extracted frame; same source framing as clips 1-4)
export const CAC_SEAM  = 846;   // screen-share (top) / face (bottom) seam; content-zone broll covers 0..SEAM
export const CAC_CAP_Y = 872;   // caption centre — just below the seam, over the forehead, never the eyes

// ─── B-roll beats ────────────────────────────────────────────────────────────────
// mode 'full' = whole frame (hook, Senate-pass transition, "send us flying" climax); 'zone' = top
// screen-share zone only (0..SEAM), Mike's face stays visible below. The senate FULL (tOut 11.00)
// hard-cuts into the desk ZONE (tIn 11.00, adjacency 0 <= 0.18) — a clean full->zone reveal of Mike's
// face, no base flash. All other beats have base gaps >> 1.5s so they fade to/from base (no base flash).
// staticFile() calls are LITERAL strings on purpose (the finalized-short gate scans for literal asset
// refs; keep them literal, not helper-built).
export type CacBroll = { src: string; tIn: number; tOut: number; mode: 'full' | 'zone' };
export const BROLL_CAC: CacBroll[] = [
  { src: staticFile('broll-clarity-hook.png'),   tIn:  0.00, tOut:  2.30, mode: 'full' }, // "expected in June, not happening" — HOOK
  { src: staticFile('broll-clarity-senate.png'), tIn:  8.55, tOut: 11.00, mode: 'full' }, // "clarity act might pass through the Senate" — TRANSITION/PIVOT
  { src: staticFile('broll-clarity-desk.png'),   tIn: 11.00, tOut: 13.00, mode: 'zone' }, // "get on the desk for him to sign it" (faceless pen-signing)
  { src: staticFile('broll-clarity-gates.png'),  tIn: 30.90, tOut: 33.40, mode: 'zone' }, // "institutions that were holding out" (sidelined, closed vault gate)
  { src: staticFile('broll-clarity-open.png'),   tIn: 37.40, tOut: 40.20, mode: 'zone' }, // "they'd open the door, now we can invest" (gate opens)
  { src: staticFile('broll-clarity-climax.png'), tIn: 47.50, tOut: 52.60, mode: 'full' }, // "send us flying... in the gutter" — CLIMAX (tOut past comp-end 52.30s so it HOLDS full-screen through the last frame)
];

// ─── SFX events ──────────────────────────────────────────────────────────────────
// whoosh on the thumbnail cut + hook->base, riser->impact into the Senate-pass transition, a kick on
// "sign it", ting on the institutions cutaway, whoosh on the gate opening, tension-riser->BIG BOOM into
// the "send us flying" PEAK (protected). Only files present in render-assets/sfx/. All under the VO.
export type CacSfx = { t: number; src: string; vol: number; dur: number };
export const SFX_CAC: CacSfx[] = [
  { t:  0.00, src: staticFile('sfx/Cinematic Whoosh 02.wav'),                vol: 0.50, dur: 1.6 }, // thumbnail cut -> hook
  { t:  2.30, src: staticFile('sfx/transition_rapid_whoosh.mp3'),            vol: 0.42, dur: 1.0 }, // hook full -> base
  { t:  8.05, src: staticFile('sfx/Riser Sound Effect.mp3'),                 vol: 0.36, dur: 1.2 }, // build into the Senate-pass transition
  { t:  8.55, src: staticFile('sfx/Impacts/Impact_1.wav'),                   vol: 0.50, dur: 1.8 }, // Clarity Act clears the Senate (transition impact)
  { t: 12.36, src: staticFile('sfx/Impacts/Kick_Impact_01.wav'),             vol: 0.50, dur: 1.4 }, // "sign it" stamp/gavel
  { t: 30.90, src: staticFile('sfx/TING SOUND EFFECT.mp3'),                  vol: 0.40, dur: 1.4 }, // institutions-holding-out cutaway
  { t: 37.40, src: staticFile('sfx/transition_rapid_whoosh.mp3'),            vol: 0.42, dur: 1.0 }, // the gate swings open
  { t: 46.90, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_1.wav'),  vol: 0.40, dur: 2.6 }, // build INTO the "send us flying" payoff
  { t: 49.14, src: staticFile('sfx/Boom - Big Reveal.wav'),                  vol: 0.58, dur: 2.6 }, // BOOM on "send us flying" — the protected PEAK
];

// ─── Captions ──────────────────────────────────────────────────────────────────
// Transcribed FRESH from this finalized clip (whisper-words-clarity-act-catalyst-full.json, base word
// timings; wording verified against the small model for the garbled regions). STT fixes for on-screen
// text ONLY (audio unchanged): "clarity act" kept as the bill name but rendered house-style LOWERCASE
// (green accent), like clip 4 lowercased "matt furie"/"robinhood"; "Trump's Decks" -> "trump's desk"
// (spoken, kept, lowercase, NO face rendered); "bear mark" -> "bear market"; "seven days a show" ->
// "seven days or so"; base garble "institutions are a whole and out" -> "institutions that were holding
// out on crypto"; base garble "recovery rally or really for Ali" -> "recovery rally or a relief rally".
// Colour spans (_kit.colourize): <gr>=green (brand/bullish), <y>=yellow (hype PEAK: "flying"),
// <r>=red (antagonist/foil: bear market / bearish / jitters / no clarity / no legislation / in the gutter).
export const CAPTIONS_CAC: { t: number; h: string }[] = [
  { t:  0.00, h: 'this rally' },
  { t:  1.30, h: 'that a lot' },
  { t:  1.72, h: 'of us were' },
  { t:  2.22, h: 'expecting to' },
  { t:  2.86, h: 'happen in june' },
  { t:  3.46, h: 'is just not' },
  { t:  4.16, h: 'happening now' },
  { t:  4.86, h: 'it could happen' },
  { t:  5.62, h: 'right, could' },
  { t:  6.14, h: 'happen in a' },
  { t:  7.26, h: 'couple of weeks' },
  { t:  8.02, h: 'because the' },
  { t:  8.86, h: '<gr>clarity act</gr>' },
  { t:  9.44, h: 'might pass through' },
  { t: 10.24, h: 'the senate' },
  { t: 10.78, h: 'and get on' },
  { t: 11.48, h: 'trump\'s desk' },
  { t: 12.14, h: 'for him to' },
  { t: 12.64, h: 'sign it' },
  { t: 13.02, h: 'and that will be' },
  { t: 13.90, h: 'like the' },
  { t: 14.46, h: '<gr>bullish catalyst</gr>' },
  { t: 15.20, h: 'that we need' },
  { t: 15.96, h: 'inside of this' },
  { t: 16.56, h: '<r>bear market</r>' },
  { t: 17.12, h: 'if it happens' },
  { t: 17.70, h: 'in a couple of' },
  { t: 18.40, h: 'weeks' },
  { t: 18.84, h: 'so yeah' },
  { t: 19.72, h: 'we might move' },
  { t: 20.36, h: 'there could be' },
  { t: 20.82, h: 'something <r>bearish</r>' },
  { t: 21.88, h: 'in about' },
  { t: 22.44, h: 'seven days or so' },
  { t: 23.46, h: 'right, but' },
  { t: 23.74, h: 'there could be' },
  { t: 24.16, h: 'something <gr>bullish</gr>' },
  { t: 25.10, h: 'seven days' },
  { t: 25.86, h: 'afterwards' },
  { t: 26.42, h: 'if the' },
  { t: 27.00, h: '<gr>clarity act</gr>' },
  { t: 27.58, h: 'is finally' },
  { t: 28.68, h: 'signed' },
  { t: 29.04, h: 'so what the' },
  { t: 29.78, h: '<gr>clarity act</gr> does' },
  { t: 30.44, h: 'it gives all' },
  { t: 31.20, h: 'the institutions' },
  { t: 31.92, h: 'that were holding' },
  { t: 32.36, h: 'out on crypto' },
  { t: 33.22, h: 'because they had' },
  { t: 33.86, h: '<r>jitters</r>' },
  { t: 34.22, h: 'because there was' },
  { t: 34.66, h: '<r>no clarity</r>' },
  { t: 35.34, h: 'right, there was' },
  { t: 35.82, h: '<r>no legislation</r>' },
  { t: 36.96, h: 'then they\'d' },
  { t: 37.62, h: 'open the door' },
  { t: 38.20, h: 'for them' },
  { t: 38.88, h: 'say okay now' },
  { t: 39.58, h: 'we can <gr>invest</gr>' },
  { t: 40.30, h: 'so that is' },
  { t: 41.04, h: 'very very' },
  { t: 41.64, h: '<gr>bullish news</gr>' },
  { t: 42.10, h: 'in fact' },
  { t: 42.50, h: 'it could cause' },
  { t: 43.76, h: 'like a decent' },
  { t: 44.56, h: 'size recovery' },
  { t: 45.64, h: 'rally or' },
  { t: 46.02, h: 'a relief rally' },
  { t: 46.96, h: 'i mean it could' },
  { t: 47.66, h: 'it could send us' },
  { t: 48.70, h: 'it could' },
  { t: 49.14, h: 'send us <y>flying</y>' },
  { t: 49.92, h: 'by comparison' },
  { t: 50.48, h: 'to where we' },
  { t: 50.88, h: 'are now' },
  { t: 51.38, h: 'which is like' },
  { t: 51.84, h: 'in the <r>gutter</r>' },
];

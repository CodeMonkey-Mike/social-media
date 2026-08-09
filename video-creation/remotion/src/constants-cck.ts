import { staticFile } from 'remotion';

// ─── cashcat-king (batch: robinhood, clip #2 rank 2, variant: full) ──────────────────
// Spine = tightened.mp4 (ALREADY tightened + desilenced; build on THIS, do not re-cut).
// Composited vertical 1080x1920: screen-share (the real Cash Cat X profile / Robinhood-chain
// DexScreener / CoinMarketCap Mike is presenting) top 0..SEAM, Mike's green-screen face bottom.
// Seam y~846 (verified from an extracted frame); caption band centred y~872 (over the forehead,
// well above the eyes). Clip 61.145s @ 25fps; comp @ 30fps (OffthreadVideo resamples by time).
//
// Built to the FINALIZED-SHORT contract (livestream-repurpose/skills/remotion-shorts-build/SKILL.md),
// modelled on clip 1 (RobinhoodFloodgates) for consistency:
//   frame-0 designed thumbnail cover + b-roll LAYER (HALVED budget: 31.6% b-roll / 68.4% base,
//   3 full-screens = hook / rally-peak / very-strong-play climax + 4 content-zone cutaways) + SFX
//   (8 events). Robinhood-chain coins/glow = BRIGHT NEON LIME GREEN (#CCFF00) + gold (persona.json
//   robinhood_coin), never teal. Cash Cat has NO reference logo -> generic gray/tabby cat character +
//   thematic Robinhood-chain b-roll only, blank coins, faceless crowds, no real logos/faces.
// No number badges (unlike clip 1): the spoken numbers (225 million / 12 / 1 billion) live in the
//   captions only, so no corrected/disputed market-cap number is put on screen.
//
// Render (public-dir = the batch render-assets/, holds the spine mp4 + thumb + broll + sfx):
//   npx remotion render src/index.ts CashcatKing out/robinhood/2-cashcat-king-full.mp4 \
//     --public-dir "<repo>/video-creation/shorts/robinhood/render-assets"

export const CCK_FPS = 30;
export const CCK_DURATION = 1835; // 61.145s * 30 = 1834.35 -> 1835 frames

export const CLIP  = staticFile('cashcat-king-full.mp4');
export const THUMB = staticFile('broll-cck-thumb.png');
export const THUMB_TITLE = 'CASH CAT IS KING';
export const THUMB_CHIP  = 'ROBINHOOD CHAIN';

// Layout geometry (measured from an extracted frame; same source framing as clip 1)
export const CCK_SEAM  = 846;   // screen-share (top) / face (bottom) seam; content-zone broll covers 0..SEAM
export const CCK_CAP_Y = 872;   // caption centre — just below the seam, over the forehead, never the eyes

// ─── B-roll beats ────────────────────────────────────────────────────────────────
// mode 'full' = whole frame (hook, rally peak, very-strong-play climax); 'zone' = top screen-share
// zone only (0..SEAM), Mike's face stays visible below. Isolated beats fade to/from base; none are
// adjacent so there is no full-to-full base flash. staticFile() calls are LITERAL strings on purpose
// (the finalized-short gate scans for literal asset refs; keep them literal, not helper-built).
export type CckBroll = { src: string; tIn: number; tOut: number; mode: 'full' | 'zone' };
export const BROLL_CCK: CckBroll[] = [
  { src: staticFile('broll-cck-hook.png'),       tIn:  0.00, tOut:  2.50, mode: 'full' }, // "it is cash cat... the king of meme coins" — HOOK
  { src: staticFile('broll-cck-outshines.png'),  tIn: 10.70, tOut: 12.70, mode: 'zone' }, // "outshines all the others"
  { src: staticFile('broll-cck-rally.png'),      tIn: 17.00, tOut: 19.90, mode: 'full' }, // "225 million... crazy... rock solid" — PEAK/TRANSITION
  { src: staticFile('broll-cck-cmc.png'),        tIn: 32.50, tOut: 35.40, mode: 'zone' }, // "listed on coinmarketcap" — the ONLY one
  { src: staticFile('broll-cck-12cex.png'),      tIn: 37.30, tOut: 40.30, mode: 'zone' }, // "tons of centralized exchanges, got 12"
  { src: staticFile('broll-cck-fairlaunch.png'), tIn: 48.70, tOut: 52.20, mode: 'zone' }, // "fair launched... 1 billion = max supply, no dilution"
  { src: staticFile('broll-cck-climax.png'),     tIn: 58.60, tOut: 61.10, mode: 'full' }, // "a very strong play" — CLIMAX BUTTON
];

// ─── SFX events ──────────────────────────────────────────────────────────────────
// whoosh on the thumbnail cut + hook->base, ting on the outshines/CMC/12-CEX cutaways, riser->boom
// into the rally peak, impact + cash register on the "very strong play" button. All literal sfx asset
// refs (gate-visible), all under the VO.
export type CckSfx = { t: number; src: string; vol: number; dur: number };
export const SFX_CCK: CckSfx[] = [
  { t:  0.00, src: staticFile('sfx/Cinematic Whoosh 02.wav'),               vol: 0.50, dur: 1.6 }, // thumbnail cut -> hook
  { t:  2.50, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.42, dur: 1.0 }, // hook full -> base
  { t: 10.70, src: staticFile('sfx/TING SOUND EFFECT.mp3'),                 vol: 0.40, dur: 1.4 }, // "outshines" cutaway
  { t: 16.55, src: staticFile('sfx/Riser Sound Effect.mp3'),               vol: 0.36, dur: 2.4 }, // build into the rally
  { t: 17.00, src: staticFile('sfx/Boom - Big Reveal.wav'),                vol: 0.52, dur: 3.0 }, // rally BURST ("225 million")
  { t: 32.50, src: staticFile('sfx/TING SOUND EFFECT.mp3'),                 vol: 0.40, dur: 1.4 }, // CoinMarketCap listing
  { t: 37.30, src: staticFile('sfx/Impacts/Impact_1.wav'),                 vol: 0.44, dur: 1.6 }, // 12 centralized exchanges
  { t: 58.60, src: staticFile('sfx/Impacts/Kick_Impact_01.wav'),           vol: 0.50, dur: 2.0 }, // "very strong play" button
  { t: 58.90, src: staticFile('sfx/Cash Register.mp3'),                    vol: 0.44, dur: 1.8 }, // kaching on the conviction close
];

// ─── Captions ──────────────────────────────────────────────────────────────────
// Transcribed FRESH from this finalized clip (whisper-words-cashcat-king-full.json), grouped
// word-by-word (2-4 words). STT fixes for on-screen text ONLY (audio unchanged): "Hashcat"->"cash cat",
// "Robin Hood change"/"Robin Hood chain"->"robinhood chain", "essentialized exchanges"->"centralized
// exchanges", "coin market cap"->"coinmarketcap", "his max supply"->"its max supply". SPOKEN "225
// million" STAYS as spoken on screen (no corrected market-cap number). Colour spans (_kit.colourize):
// <gr>=green (Robinhood brand / coin name / receipts / bullish numbers), <y>=yellow (hype words).
export const CAPTIONS_CCK: { t: number; h: string }[] = [
  { t:  0.68, h: 'it is' },
  { t:  1.56, h: '<gr>cash cat</gr>' },
  { t:  2.82, h: 'and it' },
  { t:  4.86, h: 'could be the' },
  { t:  5.80, h: '<y>king</y> of' },
  { t:  6.28, h: 'meme coins' },
  { t:  6.80, h: 'on the' },
  { t:  7.86, h: '<gr>robinhood chain</gr>' },
  { t:  8.70, h: "i'm gonna show" },
  { t:  9.12, h: 'where it' },
  { t:  9.74, h: 'sort of' },
  { t: 10.70, h: '<y>outshines</y>' },
  { t: 11.44, h: 'all the others' },
  { t: 13.26, h: 'now it went' },
  { t: 14.08, h: 'through a nice' },
  { t: 14.64, h: '<y>rally</y>' },
  { t: 15.30, h: 'it went up' },
  { t: 16.02, h: 'and even went' },
  { t: 16.50, h: 'as high as' },
  { t: 17.04, h: '<gr>225 million</gr>' },
  { t: 18.94, h: 'my god,' },
  { t: 19.28, h: "it's <y>crazy</y>," },
  { t: 19.78, h: 'right?' },
  { t: 20.02, h: "it's <y>rock solid</y>" },
  { t: 21.40, h: 'the devs are' },
  { t: 21.80, h: 'putting the work' },
  { t: 22.34, h: 'to get' },
  { t: 22.68, h: '<gr>centralized exchanges</gr>' },
  { t: 23.56, h: 'and they' },
  { t: 24.98, h: 'keep on' },
  { t: 25.40, h: 'keeping on' },
  { t: 25.90, h: 'i can tell you' },
  { t: 26.44, h: 'though,' },
  { t: 26.82, h: 'it <y>really really</y>' },
  { t: 27.60, h: '<y>outshines</y>' },
  { t: 28.10, h: 'because as far' },
  { t: 28.96, h: 'as i know,' },
  { t: 30.00, h: "there's no other" },
  { t: 30.46, h: 'meme coin on' },
  { t: 31.36, h: 'the <gr>robinhood chain</gr>' },
  { t: 32.22, h: 'that has been' },
  { t: 32.76, h: '<y>listed</y> on' },
  { t: 33.24, h: '<gr>coinmarketcap</gr>' },
  { t: 34.24, h: 'so that is' },
  { t: 34.74, h: 'like a <gr>plus</gr>' },
  { t: 35.40, h: 'right there' },
  { t: 37.26, h: 'it has <y>tons</y> of' },
  { t: 38.72, h: '<gr>centralized exchanges</gr>,' },
  { t: 39.86, h: 'got <gr>12</gr>, right?' },
  { t: 40.54, h: 'it is ending' },
  { t: 41.08, h: 'up and following' },
  { t: 41.96, h: 'this thing for' },
  { t: 42.70, h: 'like the last week' },
  { t: 43.50, h: 'and it keeps' },
  { t: 44.94, h: 'getting more' },
  { t: 45.56, h: '<y>and more and more</y>' },
  { t: 46.70, h: 'the good news' },
  { t: 47.28, h: "is that it's" },
  { t: 48.76, h: '<gr>fair launched</gr>' },
  { t: 49.38, h: "and it's" },
  { t: 49.88, h: '<gr>circulating supply</gr>' },
  { t: 50.82, h: '<gr>1 billion</gr>' },
  { t: 51.96, h: 'is equal to' },
  { t: 52.58, h: 'its <gr>max supply</gr>' },
  { t: 53.58, h: "so there's not" },
  { t: 54.42, h: 'going to be' },
  { t: 54.74, h: 'any more dilution' },
  { t: 55.72, h: 'out there, right?' },
  { t: 56.66, h: 'so that is' },
  { t: 57.20, h: '<gr>very good</gr>' },
  { t: 57.96, h: 'so this is like' },
  { t: 58.90, h: 'a <y>very</y>' },
  { t: 59.28, h: '<y>strong play</y>' },
  { t: 60.10, h: "it's a <y>very</y>" },
  { t: 60.50, h: '<y>strong play</y>' },
];

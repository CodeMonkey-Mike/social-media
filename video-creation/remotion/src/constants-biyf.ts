import { staticFile } from 'remotion';

// ─── bitcoin-inflation-year-five (batch: pump-season-is-back, clip #4, variant: full) ─
// The source clip is ALREADY composited vertical (screen-share top + Mike's face bottom,
// seam ~y848, same livestream layout as clips #1/#2/#3). It is played full-frame; the
// caption band is overlaid at the seam. Do NOT re-split screen/face.
// Clip is 1080x1920 @ 25fps, 132.0s; comp runs at 30fps (OffthreadVideo resamples by time).
//
// Render with (public-dir = render-assets/, which holds the clip mp4 + thumbnail-full.png):
//   npx remotion render src/index.ts BitcoinInflationYearFive out/pump-season-is-back/4-bitcoin-inflation-year-five.mp4 \
//     --public-dir "<repo>/video-creation/shorts/pump-season-is-back/bitcoin-inflation-year-five/render-assets"

export const BIYF_FPS = 30;
export const BIYF_DURATION = 3960; // 132.0s * 30

export const CLIP_BIYF  = staticFile('bitcoin-inflation-year-five-full.mp4');
export const THUMB_BIYF = staticFile('thumbnail-full.png');

// Layout geometry (measured from extracted frames — same source livestream layout as clips #1/#2/#3).
// The composited clip's screen-share (top) / face (bottom) seam sits at ~y848; zone b-roll covers
// 0..BIYF_SEAM so the low-value, off-message static BTC/USD TradingView chart in the top zone stays
// hidden the whole clip, while Mike's face plays below the seam (except at the 5 full-screen peaks).
export const BIYF_SEAM  = 848;   // screen-share (top) / face (bottom) seam; zone broll covers 0..SEAM
export const BIYF_CAP_Y = 866;   // caption centre — just below the seam, over Mike's hairline, never his eyes

// ─── B-roll beats (from BROLL-PLAN.md — molten-gold INFLATION/EROSION world matching the thumbnail;
// teal stays ONLY as the brand thread = the 5px zone seam line + caption <o> orange accents) ───────────
// 6 distinct assets on disk (Mike: NO regen). BROLL-PLAN budget = 5 full-screen peaks (hook / thesis
// "adjusted to inflation" / "everything doubled" turn / illusion CLIMAX / close) + 2 content-zone images
// REUSED and STRICTLY A/B alternated across all 41 zone beats, so no two adjacent zone beats share an
// image (top zone changes every ~2.5-3.4s). SUBSTITUTION (Mike, no-regen): the plan's ZONE B
// `broll-psb-lostpower.png` was CANCELLED and is NOT on disk. Zone B is remapped to the clean on-disk
// full `broll-psb-doubled-full.png` played in ZONE mode — its cart-of-goods-with-price-tags crop is the
// closest semantic match to the cancelled "prices doubled / lost purchasing power" intent and reads
// clearly distinct from zone A (nominalrise = coin + rising chart). Zone A = nominalrise, zone B =
// doubled-full. Every beat butts its neighbours (hard cut, no base flash); the 5 full-screens are each
// isolated between butted zone beats so the static chart top is never exposed. All 6 images inspected
// persona-clean (blank generic gold tokens, NO real bitcoin mark / no ETH / no faces / no baked text).
// staticFile() calls are LITERAL strings on purpose — the finalized-short gate scans for literal refs.
export type BiyfBroll = { src: string; tIn: number; tOut: number; mode: 'full' | 'zone' };
export const BROLL_BIYF: BiyfBroll[] = [
  { src: staticFile('broll-psb-hook-full.png'),     tIn:   0.00, tOut:   3.48, mode: 'full' }, // "the idea is that the bear market began in december of" (HOOK)
  { src: staticFile('broll-psb-nominalrise.png'),   tIn:   3.48, tOut:   6.88, mode: 'zone' }, // "2021, right? at the last real top" (A)
  { src: staticFile('broll-psb-doubled-full.png'),  tIn:   6.88, tOut:   9.94, mode: 'zone' }, // "not the rinky dink nonsense that we had in this past" (B)
  { src: staticFile('broll-psb-nominalrise.png'),   tIn:   9.94, tOut:  13.28, mode: 'zone' }, // "october, but the last real top. so the bear market began back" (A)
  { src: staticFile('broll-psb-doubled-full.png'),  tIn:  13.28, tOut:  16.66, mode: 'zone' }, // "then. and we're at year number five of the bear market" (B)
  { src: staticFile('broll-psb-nominalrise.png'),   tIn:  16.66, tOut:  19.56, mode: 'zone' }, // "which is hard to argue against. but what i've been saying this" (A)
  { src: staticFile('broll-psb-doubled-full.png'),  tIn:  19.56, tOut:  22.92, mode: 'zone' }, // "whole time is that the price of bitcoin really just" (B)
  { src: staticFile('broll-psb-tracked-full.png'),  tIn:  22.92, tOut:  27.06, mode: 'full' }, // "adjusted to inflation. 68k to 126k four years" (THESIS)
  { src: staticFile('broll-psb-nominalrise.png'),   tIn:  27.06, tOut:  30.48, mode: 'zone' }, // "well, the monetary supply in the us, the dollars increased by like" (A)
  { src: staticFile('broll-psb-doubled-full.png'),  tIn:  30.48, tOut:  33.74, mode: 'zone' }, // "what 40%. and everything is like cost almost double" (B)
  { src: staticFile('broll-psb-nominalrise.png'),   tIn:  33.74, tOut:  36.60, mode: 'zone' }, // "so it's like almost everything is almost double. i'll tell you one thing" (A)
  { src: staticFile('broll-psb-doubled-full.png'),  tIn:  36.60, tOut:  39.08, mode: 'zone' }, // "i just had a car today actually, not" (B)
  { src: staticFile('broll-psb-nominalrise.png'),   tIn:  39.08, tOut:  40.16, mode: 'zone' }, // "just yesterday, i paid for it" (A)
  { src: staticFile('broll-psb-doubled-full.png'),  tIn:  40.16, tOut:  43.44, mode: 'zone' }, // "so they're towing it today from a place in jersey to" (B)
  { src: staticFile('broll-psb-nominalrise.png'),   tIn:  43.44, tOut:  46.44, mode: 'zone' }, // "upstate new york, right? and it cost me" (A)
  { src: staticFile('broll-psb-doubled-full.png'),  tIn:  46.44, tOut:  49.70, mode: 'zone' }, // "$1,600. whereas 10 years ago" (B)
  { src: staticFile('broll-psb-nominalrise.png'),   tIn:  49.70, tOut:  52.74, mode: 'zone' }, // "10 years, no, nine years ago, i had a car" (A)
  { src: staticFile('broll-psb-doubled-full.png'),  tIn:  52.74, tOut:  55.96, mode: 'zone' }, // "towed from jersey to upstate new york. it was almost like the same" (B)
  { src: staticFile('broll-psb-nominalrise.png'),   tIn:  55.96, tOut:  57.30, mode: 'zone' }, // "thing. almost like the same distance" (A)
  { src: staticFile('broll-psb-doubled-full.png'),  tIn:  57.30, tOut:  60.10, mode: 'zone' }, // "and it was $800 nine years ago" (B)
  { src: staticFile('broll-psb-nominalrise.png'),   tIn:  60.10, tOut:  62.58, mode: 'zone' }, // "to do that. and then it was like $1600 today" (A)
  { src: staticFile('broll-psb-doubled-full.png'),  tIn:  62.58, tOut:  64.84, mode: 'full' }, // "so my point is like everything is doubled" (TURN)
  { src: staticFile('broll-psb-doubled-full.png'),  tIn:  64.84, tOut:  68.08, mode: 'zone' }, // "like i once do a plumbing job, i've probably seen like a water heater" (B)
  { src: staticFile('broll-psb-nominalrise.png'),   tIn:  68.08, tOut:  71.00, mode: 'zone' }, // "and the price i expected to pay, i would have" (A)
  { src: staticFile('broll-psb-doubled-full.png'),  tIn:  71.00, tOut:  73.20, mode: 'zone' }, // "paid like in year 2020. and so it's like it's" (B)
  { src: staticFile('broll-psb-nominalrise.png'),   tIn:  73.20, tOut:  74.46, mode: 'zone' }, // "like almost double" (A)
  { src: staticFile('broll-psb-doubled-full.png'),  tIn:  74.46, tOut:  77.48, mode: 'zone' }, // "what it was. so like everything is almost double" (B)
  { src: staticFile('broll-psb-nominalrise.png'),   tIn:  77.48, tOut:  80.18, mode: 'zone' }, // "in price. everything costs more" (A)
  { src: staticFile('broll-psb-doubled-full.png'),  tIn:  80.18, tOut:  82.72, mode: 'zone' }, // "so they just have to think how much does a bitcoin cost?" (B)
  { src: staticFile('broll-psb-nominalrise.png'),   tIn:  82.72, tOut:  85.30, mode: 'zone' }, // "like what's the value of bitcoin?" (A)
  { src: staticFile('broll-psb-doubled-full.png'),  tIn:  85.30, tOut:  88.28, mode: 'zone' }, // "forget about the dollars. what's the value of bitcoin? and what could" (B)
  { src: staticFile('broll-psb-nominalrise.png'),   tIn:  88.28, tOut:  91.70, mode: 'zone' }, // "that bitcoin buy you? what you can use it for to buy" (A)
  { src: staticFile('broll-psb-doubled-full.png'),  tIn:  91.70, tOut:  94.96, mode: 'zone' }, // "something, you know? and it's almost like a bitcoin" (B)
  { src: staticFile('broll-psb-nominalrise.png'),   tIn:  94.96, tOut:  98.28, mode: 'zone' }, // "in october of 2025 would buy you" (A)
  { src: staticFile('broll-psb-doubled-full.png'),  tIn:  98.28, tOut: 101.22, mode: 'zone' }, // "almost the same amount of stuff that it could" (B)
  { src: staticFile('broll-psb-nominalrise.png'),   tIn: 101.22, tOut: 103.80, mode: 'zone' }, // "buy you in november of 2021" (A)
  { src: staticFile('broll-psb-illusion-full.png'), tIn: 103.80, tOut: 109.04, mode: 'full' }, // "the value of bitcoin didn't increase that much, even though it looked like it did in dollars" (CLIMAX)
  { src: staticFile('broll-psb-doubled-full.png'),  tIn: 109.04, tOut: 111.56, mode: 'zone' }, // "it's just like a just a inflation. i'm starting to" (B)
  { src: staticFile('broll-psb-nominalrise.png'),   tIn: 111.56, tOut: 114.42, mode: 'zone' }, // "think more and more that it's going to be like new all-time" (A)
  { src: staticFile('broll-psb-doubled-full.png'),  tIn: 114.42, tOut: 117.64, mode: 'zone' }, // "highs every single year, just the same way the stock market" (B)
  { src: staticFile('broll-psb-nominalrise.png'),   tIn: 117.64, tOut: 120.78, mode: 'zone' }, // "went back in the 1990s. you know, it was like constant all-time" (A)
  { src: staticFile('broll-psb-doubled-full.png'),  tIn: 120.78, tOut: 123.58, mode: 'zone' }, // "highs, up and then a retracement. and then again" (B)
  { src: staticFile('broll-psb-nominalrise.png'),   tIn: 123.58, tOut: 126.38, mode: 'zone' }, // "up, and then a retracement. and then again up" (A)
  { src: staticFile('broll-psb-doubled-full.png'),  tIn: 126.38, tOut: 128.68, mode: 'zone' }, // "just kept happening like all the time. every single year" (B)
  { src: staticFile('broll-psb-nominalrise.png'),   tIn: 128.68, tOut: 130.02, mode: 'zone' }, // "up until the" (A)
  { src: staticFile('broll-psb-close-full.png'),    tIn: 130.02, tOut: 132.00, mode: 'full' }, // "year 2000. so it could be the same way" (CLOSE)
];

// ─── Badges (crisp code text, top zone y~300; time-separated, never over a full-screen peak, never over
// the caption band y866). Dollar prices carry the amber accent (#ff9f1c); percentages / years stay white.
// 'amber' = ORANGE brand accent; 'white' = neutral. Adaptive big-text size so long strings never overflow.
export type BiyfBadge = { tIn: number; tOut: number; big: string; sub: string; color: 'amber' | 'white' };
export const BADGES_BIYF: BiyfBadge[] = [
  { tIn:  14.60, tOut:  18.40, big: 'YEAR FIVE',         sub: 'OF THE BEAR',     color: 'amber' }, // over beats #5/#6
  { tIn:  27.20, tOut:  31.30, big: '+40%',              sub: 'MONEY SUPPLY',    color: 'white' }, // over beats #9/#10
  { tIn:  45.00, tOut:  48.40, big: '$1,600',            sub: 'TOW · TODAY',     color: 'amber' }, // over beats #15/#16
  { tIn:  57.40, tOut:  60.60, big: '$800',              sub: 'TOW · 9 YRS AGO', color: 'amber' }, // over beat #20
  { tIn:  98.40, tOut: 103.60, big: 'SAME BUYING POWER', sub: '2021 = 2025',     color: 'white' }, // over beats #35/#36
  { tIn: 115.50, tOut: 119.00, big: 'JUST LIKE',         sub: 'THE 1990s',       color: 'white' }, // over beats #40/#41
];

// ─── SFX events (copied into render-assets/sfx/; all vol <= 0.55 under the VO) ───────────────────
// whoosh on the thumbnail cut + layout transitions; kick on the "bear market began" thesis; risers build
// INTO the two big reveals; the biggest impact (boom) lands on the illusion CLIMAX; cash on the +40%
// money-supply beat; ding/ting on the tow-cost / same-buying-power accents; waitwhat on the deflating
// "it's just inflation" twist. Literal sfx/ path strings below (gate-visible). Per BROLL-PLAN SFX section.
// NOTE: the climax riser is placed at t102.30 (not the plan's t103.60) so it genuinely builds INTO the
// t103.80 boom — the SKILL contract mandates "a riser builds INTO an impact"; 0.2s of lead was too short.
export type BiyfSfx = { t: number; src: string; vol: number; dur: number };
export const SFX_BIYF: BiyfSfx[] = [
  { t:   0.00, src: staticFile('sfx/whoosh.wav'),       vol: 0.50, dur: 1.6 }, // thumbnail cut -> hook reveal
  { t:   2.22, src: staticFile('sfx/impact-kick.wav'),  vol: 0.48, dur: 1.8 }, // "bear market began" the thesis lands
  { t:   3.48, src: staticFile('sfx/whoosh-rapid.mp3'), vol: 0.42, dur: 1.0 }, // hook full -> zone
  { t:  21.40, src: staticFile('sfx/riser.wav'),        vol: 0.38, dur: 1.6 }, // build INTO the inflation reveal
  { t:  22.92, src: staticFile('sfx/impact-big.wav'),   vol: 0.52, dur: 3.2 }, // "adjusted to inflation" THESIS reveal (FULL)
  { t:  27.06, src: staticFile('sfx/whoosh-rapid.mp3'), vol: 0.42, dur: 1.0 }, // reveal full -> zone
  { t:  27.50, src: staticFile('sfx/cash.mp3'),         vol: 0.42, dur: 1.6 }, // money printer / +40% money supply (kaching)
  { t:  44.98, src: staticFile('sfx/ding.mp3'),         vol: 0.40, dur: 1.2 }, // "$1,600" cost reveal
  { t:  62.58, src: staticFile('sfx/whoosh-rapid.mp3'), vol: 0.42, dur: 1.0 }, // zone -> "everything is doubled" full
  { t:  62.72, src: staticFile('sfx/impact-big.wav'),   vol: 0.50, dur: 3.0 }, // "everything is doubled" turn lands (FULL)
  { t:  64.84, src: staticFile('sfx/whoosh-rapid.mp3'), vol: 0.42, dur: 1.0 }, // doubled full -> zone
  { t:  98.28, src: staticFile('sfx/ting.mp3'),         vol: 0.38, dur: 1.0 }, // "same buying power 2021 = 2025" accent
  { t: 102.30, src: staticFile('sfx/riser.wav'),        vol: 0.40, dur: 1.5 }, // build INTO the illusion climax
  { t: 103.80, src: staticFile('sfx/impact-boom.wav'),  vol: 0.55, dur: 3.0 }, // "it just looked like it did" CLIMAX (biggest, FULL)
  { t: 109.04, src: staticFile('sfx/whoosh-rapid.mp3'), vol: 0.42, dur: 1.0 }, // climax full -> zone
  { t: 109.34, src: staticFile('sfx/waitwhat.mp3'),     vol: 0.42, dur: 2.0 }, // "it's just inflation" the deflating twist
  { t: 130.02, src: staticFile('sfx/impact-big.wav'),   vol: 0.48, dur: 2.5 }, // CLOSE full "so it could be the same way" kicker
];

// ─── Captions ─────────────────────────────────────────────────────────────────
// Built via skills/captions/build_captions.py on the tightened+desilenced clip, then
// corrected against the audio (Mike's spoken words otherwise kept verbatim). Corrections
// verified by re-transcribing the ambiguous slices with whisper small.en:
//   - "not the rinking thing nonsense" -> "not the rinky dink nonsense" (t6.88/t7.82): the
//     idiom "rinky-dink" (worthless), i.e. the fake October 2025 top vs the last real top.
//     Written "rinky dink" (space, no hyphen) to keep the caption band clean.
//   - "and we're a year" -> "and we're at year" (t13.98): "we're at year number five".
//   - "to argue again" -> "to argue against" (t16.66): "hard to argue against".
//   - "$1" + ",600." split -> single "$1,600." caption (regrouped at t46.44, when the number
//     starts) so the price never breaks across two lines as "$1" / ",600.".
//   - "all -time" -> "all-time" (t112.92, t119.90): stray Whisper line-wrap space removed.
// Key numbers verified against the audio: 68k -> 126k (four years), 40% money-supply growth,
// $800 (nine years ago) -> $1,600 / $1600 (today), October 2025, November 2021.
// No em dashes on screen.
//
// Colour spans (from _kit.colourize): <o> = Bitcoin brand orange (#ff9f1c) on every "bitcoin"
//   and on the price figures — the BTC prices (68k / 126k) and the doubling tow-cost proof
//   ($800 -> $1,600 / $1600). This is a Bitcoin-macro clip, so the price numbers carry the
//   orange accent. The 40% money-supply figure (a percentage, not a price) and the calendar
//   years (2021 / 2024 / 2025 / 2020 / 2000 / 1990s) stay white.
export const CAPTIONS_BIYF: { t: number; h: string }[] = [
  { t:   0.00, h: 'the idea is that the' },
  { t:   1.06, h: 'bear market began' },
  { t:   2.22, h: 'in december of' },
  { t:   3.48, h: '2021, right?' },
  { t:   4.88, h: 'at the last real top' },
  { t:   6.88, h: 'not the rinky' },
  { t:   7.82, h: 'dink nonsense that' },
  { t:   9.10, h: 'we had in this past' },
  { t:   9.94, h: 'october, but the' },
  { t:  10.80, h: 'last real top.' },
  { t:  11.64, h: 'so the bear' },
  { t:  11.96, h: 'market began back' },
  { t:  13.28, h: 'then.' },
  { t:  13.98, h: 'and we\'re at year' },
  { t:  14.52, h: 'number five of' },
  { t:  15.22, h: 'the bear market' },
  { t:  15.92, h: 'which is hard' },
  { t:  16.66, h: 'to argue against' },
  { t:  18.00, h: 'right?' },
  { t:  18.46, h: 'but what i\'ve been' },
  { t:  18.96, h: 'saying this whole' },
  { t:  19.56, h: 'time is that the' },
  { t:  20.80, h: 'price of <o>bitcoin</o>' },
  { t:  21.40, h: 'really just, like' },
  { t:  22.92, h: 'adjusted to inflation' },
  { t:  24.58, h: '<o>68k</o> to <o>126k</o> four' },
  { t:  26.72, h: 'years.' },
  { t:  27.06, h: 'well, the monetary' },
  { t:  27.80, h: 'supply in the' },
  { t:  28.80, h: 'us, the dollars' },
  { t:  29.70, h: 'increased by like' },
  { t:  30.48, h: 'what 40%.' },
  { t:  31.36, h: 'and everything is' },
  { t:  32.36, h: 'like cost almost' },
  { t:  33.20, h: 'double.' },
  { t:  33.74, h: 'so it\'s like, you know' },
  { t:  34.54, h: 'almost everything is' },
  { t:  35.16, h: 'almost double.' },
  { t:  35.86, h: 'i\'ll tell you one' },
  { t:  36.34, h: 'thing.' },
  { t:  36.60, h: 'i just had a car' },
  { t:  37.42, h: 'today actually, not' },
  { t:  39.08, h: 'just yesterday, i' },
  { t:  39.82, h: 'paid for it.' },
  { t:  40.16, h: 'so they\'re towing' },
  { t:  40.58, h: 'it today from' },
  { t:  41.24, h: 'a place in' },
  { t:  41.94, h: 'jersey, to' },
  { t:  43.44, h: 'upstate new york' },
  { t:  44.48, h: 'right?' },
  { t:  44.98, h: 'and it cost me' },
  { t:  46.44, h: '<o>$1,600.</o>' },
  { t:  48.52, h: 'whereas 10 years' },
  { t:  49.70, h: 'ago, 10 years' },
  { t:  51.02, h: 'no, nine years' },
  { t:  51.64, h: 'ago, i had a car' },
  { t:  52.74, h: 'towed from jersey' },
  { t:  53.72, h: 'to upstate new' },
  { t:  54.66, h: 'york.' },
  { t:  55.00, h: 'it was almost' },
  { t:  55.22, h: 'like the same' },
  { t:  55.72, h: 'thing.' },
  { t:  55.96, h: 'almost like the' },
  { t:  56.56, h: 'same distance.' },
  { t:  57.30, h: 'and it was <o>$800</o>' },
  { t:  59.34, h: 'nine years ago' },
  { t:  60.10, h: 'to do that.' },
  { t:  60.68, h: 'and then it was like' },
  { t:  61.32, h: '<o>$1600</o> today.' },
  { t:  62.58, h: 'so my point' },
  { t:  63.52, h: 'is like everything' },
  { t:  64.08, h: 'is doubled.' },
  { t:  64.84, h: 'like i once do a' },
  { t:  65.54, h: 'plumbing job.' },
  { t:  66.16, h: 'i\'ve probably seen' },
  { t:  66.88, h: 'like a, you know' },
  { t:  67.48, h: 'water heater.' },
  { t:  68.08, h: 'and the price' },
  { t:  68.98, h: 'i expected to' },
  { t:  69.76, h: 'pay for like, you know' },
  { t:  70.72, h: 'i would have' },
  { t:  71.00, h: 'paid like in year 2020.' },
  { t:  72.28, h: 'and so it\'s like it\'s' },
  { t:  73.20, h: 'like almost double.' },
  { t:  74.46, h: 'what it was.' },
  { t:  76.72, h: 'so like everything' },
  { t:  77.48, h: 'is almost double' },
  { t:  78.34, h: 'in price.' },
  { t:  78.88, h: 'everything costs more.' },
  { t:  80.18, h: 'so they just have to' },
  { t:  81.06, h: 'think how much' },
  { t:  81.96, h: 'does a <o>bitcoin</o>' },
  { t:  82.72, h: 'cost?' },
  { t:  83.84, h: 'like what\'s the' },
  { t:  84.34, h: 'value of <o>bitcoin?</o>' },
  { t:  85.30, h: 'forget about the' },
  { t:  86.12, h: 'dollars.' },
  { t:  86.50, h: 'what\'s the value' },
  { t:  87.40, h: 'of <o>bitcoin?</o>' },
  { t:  88.08, h: 'and what could' },
  { t:  88.28, h: 'that <o>bitcoin</o> buy' },
  { t:  89.44, h: 'you?' },
  { t:  90.00, h: 'what you can use it' },
  { t:  90.90, h: 'for to buy' },
  { t:  91.70, h: 'something, you know?' },
  { t:  92.90, h: 'and it\'s almost' },
  { t:  93.94, h: 'like a <o>bitcoin</o>' },
  { t:  94.96, h: 'in october of' },
  { t:  96.94, h: '2025' },
  { t:  98.28, h: 'would buy you' },
  { t:  99.14, h: 'almost the same' },
  { t:  99.76, h: 'amount of stuff' },
  { t: 100.62, h: 'that it could' },
  { t: 101.22, h: 'buy you in' },
  { t: 102.16, h: 'november of 2021.' },
  { t: 103.80, h: 'so what i\'m' },
  { t: 104.26, h: 'saying is the' },
  { t: 104.82, h: 'value of <o>bitcoin</o>' },
  { t: 105.96, h: 'didn\'t increase that' },
  { t: 106.88, h: 'much.' },
  { t: 107.08, h: 'even though it' },
  { t: 107.58, h: 'looked like it' },
  { t: 108.24, h: 'did in dollars' },
  { t: 109.04, h: 'it\'s just like a just' },
  { t: 110.14, h: 'a inflation.' },
  { t: 111.10, h: 'i\'m starting to' },
  { t: 111.56, h: 'think more and' },
  { t: 112.10, h: 'more that it\'s' },
  { t: 112.54, h: 'going to be' },
  { t: 112.92, h: 'like new all-time' },
  { t: 113.70, h: 'highs every single' },
  { t: 114.42, h: 'year, just the same way' },
  { t: 115.40, h: 'the stock market' },
  { t: 116.32, h: 'went back in the' },
  { t: 117.64, h: '1990s.' },
  { t: 119.10, h: 'you know, it was like' },
  { t: 119.90, h: 'constant all-time' },
  { t: 120.78, h: 'highs, you know' },
  { t: 121.34, h: 'up' },
  { t: 122.12, h: 'and then a' },
  { t: 122.38, h: 'retracement.' },
  { t: 123.02, h: 'and then again' },
  { t: 123.58, h: 'up' },
  { t: 124.26, h: 'and then a' },
  { t: 124.56, h: 'retracement.' },
  { t: 125.10, h: 'and then again' },
  { t: 125.70, h: 'up' },
  { t: 126.38, h: 'just kept happening' },
  { t: 127.56, h: 'like all the time.' },
  { t: 128.68, h: 'every single year' },
  { t: 129.46, h: 'up until the' },
  { t: 130.02, h: 'year 2000.' },
  { t: 130.76, h: 'so it could' },
  { t: 131.20, h: 'be the same way.' },
];

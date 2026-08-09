import { staticFile } from 'remotion';

// ─── october-will-be-green (batch: pump-season-is-back, clip #3, variant: full) ─────
// The source clip is ALREADY composited vertical (screen-share top + Mike's face bottom,
// seam ~y848, same livestream layout as clips #1/#2). It is played full-frame; the caption
// band is overlaid at the seam. Do NOT re-split screen/face.
// Clip is 1080x1920 @ 25fps, 50.6s; comp runs at 30fps (OffthreadVideo resamples by time).
//
// Render with (public-dir = render-assets/, which holds the clip mp4 + thumbnail-full.png):
//   npx remotion render src/index.ts OctoberWillBeGreen out/pump-season-is-back/3-october-will-be-green.mp4 \
//     --public-dir "<repo>/video-creation/shorts/pump-season-is-back/october-will-be-green/render-assets"

export const OWBG_FPS = 30;
export const OWBG_DURATION = 1518; // 50.6s * 30 (last caption at t50.22)

export const CLIP_OWBG  = staticFile('october-will-be-green-full.mp4');
export const THUMB_OWBG = staticFile('thumbnail-full.png');

// Layout geometry (measured from extracted frames — same source livestream layout as clips #1/#2).
// The composited clip's screen-share (top) / face (bottom) seam sits at ~y848; zone b-roll covers
// 0..OWBG_SEAM so the low-value, slightly-bearish BTC chart + ticker watchlist in the top zone stays
// hidden the whole clip, while Mike's face plays below the seam (except at the 4 full-screen peaks).
export const OWBG_SEAM  = 848;   // screen-share (top) / face (bottom) seam; zone broll covers 0..SEAM
export const OWBG_CAP_Y = 866;   // caption centre — just below the seam, over Mike's hairline, never his eyes

// ─── B-roll beats (from BROLL-PLAN.md — acid neon-green PUMP world matching the thumbnail; teal stays
// ONLY as the brand thread = the 5px zone seam line + caption <gr>/<r> accents + the NEW BOTTOM badge) ─
// EXACTLY 6 distinct assets per Mike's HARD image budget: 4 full-screen peaks (hook / greenregardless
// payoff / crossroads climax / newlevel close) + 2 content-zone images REUSED and STRICTLY A/B
// alternated (verygreen = zone A, expect = zone B) across every zone beat, so no two adjacent zone beats
// share an image (top zone changes every ~2-3s, never static >3s). Every beat butts its neighbours
// (hard cut, no base flash, the bearish chart is never exposed). Full-screens: hook (0), payoff (12),
// and the two BUTTED closing fulls crossroads (17) + newlevel (18).
// staticFile() calls are LITERAL strings on purpose — the finalized-short gate scans for literal refs.
export type OwbgBroll = { src: string; tIn: number; tOut: number; mode: 'full' | 'zone' };
export const BROLL_OWBG: OwbgBroll[] = [
  { src: staticFile('broll-psb-hook.png'),           tIn:  0.00, tOut:  3.16, mode: 'full' }, // "october will be green. mark my words. october will be" (HOOK)
  { src: staticFile('broll-psb-verygreen.png'),      tIn:  3.16, tOut:  5.94, mode: 'zone' }, // "green unless there's a black swan event in october" (A)
  { src: staticFile('broll-psb-expect.png'),         tIn:  5.94, tOut:  8.44, mode: 'zone' }, // "and it is my long standing expectation" (B)
  { src: staticFile('broll-psb-verygreen.png'),      tIn:  8.44, tOut: 11.16, mode: 'zone' }, // "and i still expect that i haven't changed that i" (A)
  { src: staticFile('broll-psb-expect.png'),         tIn: 11.16, tOut: 14.02, mode: 'zone' }, // "think that october is going to be very" (B)
  { src: staticFile('broll-psb-verygreen.png'),      tIn: 14.02, tOut: 16.60, mode: 'zone' }, // "green because there are tons and tons of people" (A)
  { src: staticFile('broll-psb-expect.png'),         tIn: 16.60, tOut: 19.14, mode: 'zone' }, // "who think it's going to be red and they're going to" (B)
  { src: staticFile('broll-psb-verygreen.png'),      tIn: 19.14, tOut: 21.24, mode: 'zone' }, // "fomo in. they're going to see not so red" (A)
  { src: staticFile('broll-psb-expect.png'),         tIn: 21.24, tOut: 24.76, mode: 'zone' }, // "candles... let me just throw more in and they're going to turn those" (B)
  { src: staticFile('broll-psb-verygreen.png'),      tIn: 24.76, tOut: 28.58, mode: 'zone' }, // "candles green... oh my god it's going up. let me throw" (A)
  { src: staticFile('broll-psb-expect.png'),         tIn: 28.58, tOut: 31.72, mode: 'zone' }, // "them all in... push those candles even greener and we're going to" (B)
  { src: staticFile('broll-psb-greenregardless.png'),tIn: 31.72, tOut: 34.96, mode: 'full' }, // "see a very green october regardless of what happened" (PAYOFF)
  { src: staticFile('broll-psb-verygreen.png'),      tIn: 34.96, tOut: 37.84, mode: 'zone' }, // "so i just think that it's impossible that october is" (A)
  { src: staticFile('broll-psb-expect.png'),         tIn: 37.84, tOut: 41.04, mode: 'zone' }, // "going to be green because people are going to be buying in" (B)
  { src: staticFile('broll-psb-verygreen.png'),      tIn: 41.04, tOut: 43.38, mode: 'zone' }, // "it makes the question like will there be a new bottom after" (A)
  { src: staticFile('broll-psb-expect.png'),         tIn: 43.38, tOut: 45.56, mode: 'zone' }, // "october because if so many people have already bought" (B)
  { src: staticFile('broll-psb-greenregardless.png'),tIn: 45.56, tOut: 48.24, mode: 'full' }, // CLIMAX — reuse of clean payoff full (orig crossroads/newlevel art carried an ETH logo; deleted, no regen per Mike)
  { src: staticFile('broll-psb-hook.png'),           tIn: 48.24, tOut: 50.60, mode: 'full' }, // CLOSE — reuse of clean hook full (bookend); distinct from prev beat so no static repeat
];

// ─── Badges (crisp code text, top zone y~300; time-separated, never over a full-screen peak, never over
// the caption band y866). Carry the per-beat meaning the 2 generic zone backdrops don't show literally.
// color: 'green' = pump world (#39ff14); 'teal' = brand thread (#00e5ff) on the open-loop NEW BOTTOM. ─
export type OwbgBadge = { tIn: number; tOut: number; big: string; sub: string; color: 'green' | 'teal' };
export const BADGES_OWBG: OwbgBadge[] = [
  { tIn: 21.40, tOut: 24.60, big: 'THE FLIP',      sub: 'RED TO GREEN',  color: 'green' }, // over the flip mechanism (#9)
  { tIn: 35.40, tOut: 39.20, big: 'CAN\'T STAY RED', sub: 'THEY BUY IN',  color: 'green' }, // over the "impossible" beat (#13/14)
  { tIn: 41.30, tOut: 44.80, big: 'NEW BOTTOM?',   sub: 'AFTER OCTOBER', color: 'teal'  }, // over the open-loop question (#15/16)
];

// ─── SFX events (copied into render-assets/sfx/; all vol <= 0.55 under the VO) ───────────────────
// whoosh on the thumbnail cut + layout transitions; kick on the first conviction hit + the crowd's
// doomed red bet; cash/ding/waitwhat on the candles flipping green; risers build INTO the payoff and
// the close; the biggest impact lands on the "very green regardless" payoff, a boom on the crossroads
// open-loop climax. Literal sfx/ path strings below (gate-visible). Per BROLL-PLAN SFX section.
export type OwbgSfx = { t: number; src: string; vol: number; dur: number };
export const SFX_OWBG: OwbgSfx[] = [
  { t:  0.00, src: staticFile('sfx/whoosh.wav'),        vol: 0.50, dur: 1.6 }, // thumbnail cut -> hook reveal
  { t:  1.08, src: staticFile('sfx/impact-kick.wav'),   vol: 0.50, dur: 1.8 }, // "green." first conviction hit
  { t:  3.16, src: staticFile('sfx/whoosh-rapid.mp3'),  vol: 0.42, dur: 1.0 }, // hook full -> zone
  { t: 16.60, src: staticFile('sfx/impact-kick.wav'),   vol: 0.42, dur: 1.8 }, // "red" the crowd's doomed bet lands
  { t: 19.14, src: staticFile('sfx/whoosh-rapid.mp3'),  vol: 0.44, dur: 1.0 }, // "fomo in" the rush
  { t: 21.24, src: staticFile('sfx/cash.mp3'),          vol: 0.42, dur: 1.6 }, // candles start flipping green (kaching)
  { t: 24.76, src: staticFile('sfx/ding.mp3'),          vol: 0.40, dur: 1.2 }, // "turn those candles green"
  { t: 28.02, src: staticFile('sfx/waitwhat.mp3'),      vol: 0.42, dur: 2.0 }, // "oh my god it's going up"
  { t: 29.20, src: staticFile('sfx/riser.wav'),         vol: 0.38, dur: 2.5 }, // build INTO the payoff
  { t: 31.72, src: staticFile('sfx/impact-big.wav'),    vol: 0.55, dur: 3.2 }, // "very green october regardless" (PAYOFF, biggest)
  { t: 34.96, src: staticFile('sfx/whoosh-rapid.mp3'),  vol: 0.42, dur: 1.0 }, // payoff full -> zone
  { t: 35.44, src: staticFile('sfx/ting.mp3'),          vol: 0.38, dur: 1.0 }, // "impossible" conviction accent
  { t: 43.60, src: staticFile('sfx/riser.wav'),         vol: 0.38, dur: 2.0 }, // build INTO the close
  { t: 45.56, src: staticFile('sfx/impact-boom.wav'),   vol: 0.50, dur: 3.0 }, // crossroads full turn (open-loop climax)
  { t: 48.24, src: staticFile('sfx/waitwhat.mp3'),      vol: 0.40, dur: 2.0 }, // "a new level" reflective open-loop close
];

// ─── Captions ─────────────────────────────────────────────────────────────────
// Built via skills/captions/build_captions.py on the tightened+desilenced clip, then
// corrected. Corrections (Mike's spoken words otherwise kept verbatim):
//   - STT fix (task/clip-plan + persona: "Mike says FOMO"): the crowd who expected a red
//     October "buy in" -> "FOMO in" at the mechanism beat (t19.14). Whisper heard "buy in";
//     Mike's word is FOMO. (renders lowercase in the caption band, consistent style.)
//   - Obvious Whisper garble: "a blocks one" -> "a black swan" (t4.42) — the black-swan
//     caveat on the prediction; "a blocks one event" is nonsense STT for "a black swan event".
//   - Removed a stray line-wrap hyphen: "-standing" -> "standing" (t6.96), same spoken word
//     ("long standing expectation"); no em dashes on screen.
// Persona guard (clip-plan.json): NEVER phrase it as "the zombies cause the October bottom".
//   The framing is the crowd's own buying turns October green — the captions carry only Mike's
//   words, so this is preserved.
// Colour spans (from _kit.colourize): <gr> = brand green (#39ff14) on the payoff word
//   "green"/"greener" (matches the thumbnail); <r> = red (#ff5252) on the two "red" contrast
//   words, so the caption arc reads red -> green with the mechanism.
export const CAPTIONS_OWBG: { t: number; h: string }[] = [
  { t:   0.00, h: 'october will be' },
  { t:   1.08, h: '<gr>green.</gr>' },
  { t:   1.68, h: 'mark my words' },
  { t:   2.28, h: 'october will be' },
  { t:   3.16, h: '<gr>green</gr> unless there\'s' },
  { t:   4.42, h: 'a black swan' },
  { t:   4.92, h: 'event in october' },
  { t:   5.94, h: 'and it is my long' },
  { t:   6.96, h: 'standing expectation and' },
  { t:   8.44, h: 'i still expect' },
  { t:   9.44, h: 'that i haven\'t' },
  { t:  10.24, h: 'changed that i' },
  { t:  11.16, h: 'think that october' },
  { t:  12.00, h: 'is going to' },
  { t:  12.84, h: 'be very' },
  { t:  14.02, h: '<gr>green</gr> because there' },
  { t:  15.46, h: 'are tons and tons of' },
  { t:  16.60, h: 'people who think' },
  { t:  17.42, h: 'it\'s going to' },
  { t:  17.88, h: 'be <r>red</r> and' },
  { t:  18.84, h: 'they\'re going to' },
  { t:  19.14, h: 'fomo in.' },
  { t:  19.88, h: 'they\'re going to' },
  { t:  20.24, h: 'see not so <r>red</r>' },
  { t:  21.24, h: 'candles and they' },
  { t:  22.50, h: 'were like oh let me' },
  { t:  23.28, h: 'just throw more' },
  { t:  23.80, h: 'in and they\'re' },
  { t:  24.42, h: 'going to turn' },
  { t:  24.76, h: 'those candles <gr>green</gr>' },
  { t:  25.60, h: 'and then others' },
  { t:  26.34, h: 'going to be' },
  { t:  26.70, h: 'like oh my god it\'s' },
  { t:  27.66, h: 'going up.' },
  { t:  28.02, h: 'let me throw' },
  { t:  28.58, h: 'them all in and' },
  { t:  29.40, h: 'they\'re going to' },
  { t:  29.66, h: 'push those candles' },
  { t:  30.46, h: 'even <gr>greener</gr> and' },
  { t:  31.36, h: 'we\'re going to' },
  { t:  31.72, h: 'see a very' },
  { t:  32.52, h: '<gr>green</gr> october regardless' },
  { t:  33.84, h: 'of what happened.' },
  { t:  34.96, h: 'so i just' },
  { t:  35.44, h: 'think that it\'s' },
  { t:  36.56, h: 'impossible that october' },
  { t:  37.84, h: 'is going to' },
  { t:  38.30, h: 'be it\'s going' },
  { t:  39.02, h: 'to be <gr>green</gr>' },
  { t:  39.44, h: 'because people are' },
  { t:  40.16, h: 'going to be' },
  { t:  40.30, h: 'buying in.' },
  { t:  41.04, h: 'it makes the' },
  { t:  41.44, h: 'question like will' },
  { t:  42.06, h: 'there be a' },
  { t:  42.38, h: 'new bottom after' },
  { t:  43.38, h: 'october because if' },
  { t:  44.28, h: 'so many people' },
  { t:  44.86, h: 'have already bought' },
  { t:  45.56, h: 'back in will the coin' },
  { t:  48.24, h: 'actually go down' },
  { t:  49.40, h: 'to a new' },
  { t:  50.22, h: 'level.' },
];

import { staticFile } from 'remotion';

// ─── longevity-escape-velocity (batch: pump-season-is-back, clip #5, variant: full) ─
// The source clip is ALREADY composited vertical (screen-share top + Mike's face bottom,
// seam ~y848, same livestream layout as clips #1/#2/#3/#4). It is played full-frame; the
// caption band is overlaid at the seam. Do NOT re-split screen/face.
// Clip is 1080x1920 @ 25fps, 48.577s; comp runs at 30fps (OffthreadVideo resamples by time).
//
// Topic is futurist/philosophical wonder (biotech / longevity escape velocity), NOT crypto.
// Palette is teal/cyan + acid-green BIOTECH (matches the thumbnail "BY 2032 DYING IS OPTIONAL"):
// no coin/BTC colours, no red/gold. Teal is a fine fill here (it is the clip's brand colour).
//
// Render with (public-dir = render-assets/, which holds the clip mp4 + thumbnail + b-roll + sfx):
//   npx remotion render src/index.ts LongevityEscapeVelocity out/pump-season-is-back/5-longevity-escape-velocity.mp4 \
//     --public-dir "<repo>/video-creation/shorts/pump-season-is-back/longevity-escape-velocity/render-assets"

export const LEV_FPS = 30;
export const LEV_DURATION = 1457; // 48.577s * 30

export const CLIP_LEV  = staticFile('longevity-escape-velocity-full.mp4');
export const THUMB_LEV = staticFile('thumbnail-full.png');

// Layout geometry (measured from an extracted frame — TradingView bottom bar ends / Mike's
// hairline begins at ~y848; same source livestream layout as clips #1/#2/#3/#4). Zone b-roll
// covers 0..LEV_SEAM so the off-topic BTC chart + watchlist in the top zone stays hidden while
// Mike's face plays below the seam (except at the 3 full-screen peaks). Caption centre sits just
// below the seam, over the top of Mike's hair — never his eyes or the meaningful screen content.
export const LEV_SEAM  = 848;   // screen-share (top) / face (bottom) seam; zone broll covers 0..SEAM
export const LEV_CAP_Y = 866;   // caption centre — just below the seam

// ─── B-roll beats (LEAN clip — EXACTLY 2 distinct assets per Mike's HARD image budget for this
// clip: broll-psb-helix.png (glowing teal-green DNA double-helix) + broll-psb-nanobot.png (chrome
// medical nanobot w/ teal laser). Both are persona-clean abstract biotech, on the teal/green palette.
// Structure authored from the captions (no BROLL-PLAN.md — lean clip):
//   FULL helix at the HOOK (0-3s), FULL nanobot at the wild-claim peak "no longer reasonable to die"
//   (21.02-25.42s), FULL helix at the CLOSE "blowing my mind" (45.32-end). Everywhere else = ZONE beats
//   covering the top screen-share zone (0..SEAM) so Mike's face stays visible below the teal seam line.
// The whole sequence STRICTLY ALTERNATES helix / nanobot (never two identical adjacent, whether full or
// zone); every beat butts its neighbour (hard cut, no base flash — BrollLayer hard-cuts gaps <=0.18s).
// Zone beats change every ~1.5-3s. Beat boundaries snap to caption phrase boundaries.
// staticFile() calls are LITERAL strings on purpose — the finalized-short gate scans for literal refs.
export type LevBroll = { src: string; tIn: number; tOut: number; mode: 'full' | 'zone' };
export const BROLL_LEV: LevBroll[] = [
  { src: staticFile('broll-psb-helix.png'),   tIn:  0.00, tOut:  3.00, mode: 'full' }, // HOOK "i find everything... comes to biotech"
  { src: staticFile('broll-psb-nanobot.png'), tIn:  3.00, tOut:  4.90, mode: 'zone' }, // "like they are"
  { src: staticFile('broll-psb-helix.png'),   tIn:  4.90, tOut:  7.18, mode: 'zone' }, // "finding new cures to things"
  { src: staticFile('broll-psb-nanobot.png'), tIn:  7.18, tOut: 10.30, mode: 'zone' }, // "new advancements every single day"
  { src: staticFile('broll-psb-helix.png'),   tIn: 10.30, tOut: 12.94, mode: 'zone' }, // "i learned about something called longevity"
  { src: staticFile('broll-psb-nanobot.png'), tIn: 12.94, tOut: 14.96, mode: 'zone' }, // "escape velocity. a conservative estimate"
  { src: staticFile('broll-psb-helix.png'),   tIn: 14.96, tOut: 16.44, mode: 'zone' }, // "is when i reach that date"
  { src: staticFile('broll-psb-nanobot.png'), tIn: 16.44, tOut: 18.56, mode: 'zone' }, // "in 2032, just a few" (2032 reveal — badge over this)
  { src: staticFile('broll-psb-helix.png'),   tIn: 18.56, tOut: 21.02, mode: 'zone' }, // "years from now. some people say 2030"
  { src: staticFile('broll-psb-nanobot.png'), tIn: 21.02, tOut: 25.42, mode: 'full' }, // PEAK "the date at which it is NO LONGER REASONABLE TO DIE, which is very interesting"
  { src: staticFile('broll-psb-helix.png'),   tIn: 25.42, tOut: 27.08, mode: 'zone' }, // "so every year"
  { src: staticFile('broll-psb-nanobot.png'), tIn: 27.08, tOut: 29.26, mode: 'zone' }, // "every year that you age, you"
  { src: staticFile('broll-psb-helix.png'),   tIn: 29.26, tOut: 31.34, mode: 'zone' }, // "lose a year of your lifetime"
  { src: staticFile('broll-psb-nanobot.png'), tIn: 31.34, tOut: 33.26, mode: 'zone' }, // "but because of advancements we were"
  { src: staticFile('broll-psb-helix.png'),   tIn: 33.26, tOut: 35.52, mode: 'zone' }, // "gaining back like five months"
  { src: staticFile('broll-psb-nanobot.png'), tIn: 35.52, tOut: 37.48, mode: 'zone' }, // "going to overtake in just a few years"
  { src: staticFile('broll-psb-helix.png'),   tIn: 37.48, tOut: 40.00, mode: 'zone' }, // "it's unbelievable. like they have robots now the"
  { src: staticFile('broll-psb-nanobot.png'), tIn: 40.00, tOut: 41.60, mode: 'zone' }, // "size of a grain of rice"
  { src: staticFile('broll-psb-helix.png'),   tIn: 41.60, tOut: 43.22, mode: 'zone' }, // "that will go inside of you"
  { src: staticFile('broll-psb-nanobot.png'), tIn: 43.22, tOut: 45.32, mode: 'zone' }, // "and destroy kidney stone"
  { src: staticFile('broll-psb-helix.png'),   tIn: 45.32, tOut: 48.60, mode: 'full' }, // CLOSE "the amount of stuff out there is just like BLOWING MY MIND"
];

// ─── Badges (crisp code text, one at a time, top zone y~300; time-separated, never over a full-screen
// peak, never over the caption band y866). ONE minimal callout reinforcing the hook at the 2032 reveal.
// color: 'teal' = brand thread (#00e5ff), matches the thumbnail "BY 2032 / DYING IS OPTIONAL". ─
export type LevBadge = { tIn: number; tOut: number; big: string; sub: string; color: 'teal' | 'green' };
export const BADGES_LEV: LevBadge[] = [
  { tIn: 16.60, tOut: 19.10, big: '2032', sub: 'DYING IS OPTIONAL', color: 'teal' }, // over the "in 2032, just a few years from now" reveal
];

// ─── SFX events (copied into render-assets/sfx/; all vol <= 0.52 under the VO, which is mean -19 dB /
// max -5.4 dB — leaves headroom). whoosh on the thumbnail cut + every full-screen transition; ding on
// the 2032 reveal (+ badge); a riser builds INTO the big impact on the "no longer reasonable to die"
// peak; ting tech-accent on the "grain of rice" robots; a soft ting shimmer on the "blowing my mind"
// close. Literal sfx/ path strings below (gate-visible). >=2 events required; this has 9. ─
export type LevSfx = { t: number; src: string; vol: number; dur: number };
export const SFX_LEV: LevSfx[] = [
  { t:  0.00, src: staticFile('sfx/whoosh.wav'),       vol: 0.50, dur: 1.6 }, // thumbnail cut -> hook helix full
  { t:  3.00, src: staticFile('sfx/whoosh-rapid.mp3'), vol: 0.40, dur: 1.0 }, // hook full -> zone
  { t: 16.60, src: staticFile('sfx/ding.mp3'),         vol: 0.42, dur: 1.2 }, // "2032" reveal + badge
  { t: 20.55, src: staticFile('sfx/riser.wav'),        vol: 0.36, dur: 2.4 }, // build INTO the nanobot peak
  { t: 21.02, src: staticFile('sfx/impact-big.wav'),   vol: 0.50, dur: 3.2 }, // "no longer reasonable to die" PEAK (biggest)
  { t: 25.42, src: staticFile('sfx/whoosh-rapid.mp3'), vol: 0.40, dur: 1.0 }, // nanobot full -> zone
  { t: 40.76, src: staticFile('sfx/ting.mp3'),         vol: 0.40, dur: 1.0 }, // "grain of rice" nanobot tech accent
  { t: 45.32, src: staticFile('sfx/whoosh.wav'),       vol: 0.44, dur: 1.6 }, // into the helix close full
  { t: 47.04, src: staticFile('sfx/ting.mp3'),         vol: 0.38, dur: 1.4 }, // soft shimmer close on "blowing my mind"
];

// ─── Captions ─────────────────────────────────────────────────────────────────
// Built via skills/captions/build_captions.py on the tightened+desilenced clip, then
// corrected against the audio (Mike's spoken words otherwise kept verbatim). The two
// corrections below were verified by re-transcribing the ambiguous slices with whisper
// small.en:
//   - "now that be" -> "now it'd be" (t1.50): base Whisper heard "that be" (0.50/0.43
//     confidence); small.en on the isolated slice returns "right now, it'd be fascinating".
//     Mike's word is "it'd" (it would).
//   - "escape, voila." -> "escape velocity." (t12.94): the marquee term is "longevity escape
//     velocity". Whisper heard "voila" at 0.53 confidence; small.en on the slice returns
//     "Longevity Escape Veloc[ity]". This is Mike's actual spoken term.
//   - "it's unbelievable." -> "it's almost" (t37.48): the input captions repeated "it's
//     unbelievable" here, but whisper small.en on the rendered slice (36.6-39.4s) returns
//     "it's almost like they have, like, robots" — Mike's actual words. Caught by whisper-verify.
// Dates verified against the audio: "2032" (t16.44, high confidence) and "2030" (t19.84,
// re-transcribed slice confirms "some people say 2030"). "grain of rice" and "kidney stone"
// also confirmed against re-transcribed slices.
// No em dashes on screen.
//
// Colour spans (from _kit.colourize): <g> = brand TEAL (#00e5ff) on the wild claims only, matching
// the biotech palette / thumbnail teal: the headline "2032", "no longer reasonable to die", "grain of
// rice", and the closer "blowing my mind." Everything else stays white (wonder/biotech clip, no coin
// colours, no red/gold).
export const CAPTIONS_LEV: { t: number; h: string }[] = [
  { t:   0.00, h: 'i find everything' },
  { t:   0.88, h: 'that\'s happening right' },
  { t:   1.50, h: 'now it\'d be' },
  { t:   1.90, h: 'fascinating.' },
  { t:   2.58, h: 'especially when it' },
  { t:   3.00, h: 'comes to biotech.' },
  { t:   4.00, h: 'like they are' },
  { t:   4.90, h: 'finding new cures' },
  { t:   6.36, h: 'to things and' },
  { t:   7.18, h: 'new advancements like' },
  { t:   8.40, h: 'every single day.' },
  { t:  10.30, h: 'it\'s unbelievable.' },
  { t:  10.86, h: 'i learned about' },
  { t:  11.30, h: 'something called longevity' },
  { t:  12.94, h: 'escape velocity.' },
  { t:  13.84, h: 'a conservative estimate' },
  { t:  14.96, h: 'is when i' },
  { t:  15.42, h: 'reach that date' },
  { t:  16.44, h: 'in <g>2032,</g> just a few' },
  { t:  18.56, h: 'years from now.' },
  { t:  19.16, h: 'some people say' },
  { t:  19.84, h: '2030 and that\'s' },
  { t:  21.02, h: 'the date at' },
  { t:  21.76, h: 'which it is' },
  { t:  22.50, h: '<g>no longer reasonable</g>' },
  { t:  24.14, h: '<g>to die,</g> which' },
  { t:  25.42, h: 'is very interesting.' },
  { t:  26.14, h: 'so every year' },
  { t:  27.08, h: 'so, apparently every' },
  { t:  28.04, h: 'year that you age, you' },
  { t:  29.26, h: 'lose a year, of' },
  { t:  30.06, h: 'course, of your' },
  { t:  30.80, h: 'lifetime.' },
  { t:  31.34, h: 'but because of' },
  { t:  31.96, h: 'advancements, we were' },
  { t:  33.26, h: 'gaining back like' },
  { t:  34.12, h: 'five months.' },
  { t:  35.18, h: 'and that\'s going' },
  { t:  35.52, h: 'to overtake in' },
  { t:  36.46, h: 'just a few' },
  { t:  36.90, h: 'years.' },
  { t:  37.48, h: 'it\'s almost' },
  { t:  38.08, h: 'like they have like' },
  { t:  38.78, h: 'robots now the' },
  { t:  40.00, h: 'size of a' },
  { t:  40.76, h: '<g>grain of rice</g>' },
  { t:  41.60, h: 'that will go' },
  { t:  42.34, h: 'inside of you' },
  { t:  43.22, h: 'and destroy kidney' },
  { t:  44.74, h: 'stone.' },
  { t:  45.32, h: 'the amount of' },
  { t:  45.80, h: 'stuff out there' },
  { t:  46.54, h: 'is just like' },
  { t:  47.04, h: '<g>blowing my mind.</g>' },
];

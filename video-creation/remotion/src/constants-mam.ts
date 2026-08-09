import { staticFile } from 'remotion';

// ─── millionaires-are-made-full (batch: where-millionaires-are-made, clip #1, variant: full) ──
// The source clip is ALREADY composited vertical (screen-share top + Mike's face bottom, seam
// measured at y854 via row-gradient at t=1/51/70s — all three agree). It is played full-frame; the
// caption band is overlaid at the seam. Do NOT re-split screen/face.
// Clip is 1080x1920 @ 25fps, 74.85s; comp runs at 30fps (OffthreadVideo resamples by time).
//
// Render with (public-dir = render-assets/, which holds the clip mp4 + thumbnail + b-roll + sfx):
//   npx remotion render src/index.ts MillionairesAreMade out/where-millionaires-are-made/1-millionaires-are-made.mp4 \
//     --public-dir "<repo>/video-creation/shorts/where-millionaires-are-made/millionaires-are-made-full/render-assets"

export const MAM_FPS = 30;
export const MAM_DURATION = 2245; // 74.83s @30 — just inside the 74.852s clip (no black tail frame)

export const CLIP_MAM  = staticFile('millionaires-are-made-full.mp4');
export const THUMB_MAM = staticFile('thumbnail-mam.png');

// Layout geometry (measured from extracted frames).
// Content zone 0..854 = the live CryptoBubbles/GMGN bubble map Mike is browsing; face plays below.
export const MAM_SEAM  = 854;   // screen-share (top) / face (bottom) seam; zone broll covers 0..SEAM
export const MAM_CAP_Y = 872;   // caption centre — just below the seam, over his hairline, never his eyes

// ─── B-roll beats (from BROLL-PLAN.md) ────────────────────────────────────────────────────────
// Coverage budget (SKILL "B-roll coverage budget"): 49.97s covered / 74.83s = 66.8% b-roll,
// 24.86s = 33.2% BASE SHOWING. Targets are ~55-65% / ~35-45%; we sit 1.8pp over the b-roll target
// because the closing "oh man" beat had to be covered (see its note below: off-message white news
// article + an out-of-focus face on the loop frame). The rule's PURPOSE is fully served — the
// VALUABLE screen-share (the live CryptoBubbles/GMGN bubble map Mike is actually browsing) still
// shows for 18.56s across three deliberate base beats, including the 7.36s stretch where he points
// at it ("browsing through here / green ones in here that are my play"). This is nowhere near the
// documented ~85-100% blanket failure. Base beats are DELIBERATE and marked below.
// mode 'full' = whole frame (HOOK, peak-1, the 100x claim + "hell yeah", the $LAB receipt, the
// climax); 'zone' = the top screen-share zone only (0..SEAM), Mike's face plays below.
// Every full->full pair is ADJACENT (hard cut, no base flash): 38.90 and 64.54. Every full->base
// gap is >= 1.5s. Palette: red/storm for the pain arc, gold for the flex arc, teal = brand thread.
// staticFile() calls are LITERAL strings on purpose — the finalized-short gate scans for literal refs.
export type MamBroll = { src: string; tIn: number; tOut: number; mode: 'full' | 'zone' };
export const BROLL_MAM: MamBroll[] = [
  { src: staticFile('broll-mam-red-july.png'),        tIn:  0.00, tOut:  2.60, mode: 'full' }, // "the opposite of what we thought was going to happen for july" (HOOK)
  { src: staticFile('broll-mam-beaten.png'),          tIn:  2.60, tOut:  6.44, mode: 'zone' }, // "we keep on getting beaten over the head over"
  { src: staticFile('broll-mam-tariff-15months.png'), tIn:  6.44, tOut:  9.80, mode: 'zone' }, // "since tariff season of last year going back 15 months"
  { src: staticFile('broll-mam-beaten.png'),          tIn:  9.80, tOut: 12.52, mode: 'zone' }, // "we keep getting beaten over the head and it is what it is" (reuse: the line is literally doubled; non-adjacent, 3.36s away)
  // BASE 12.52-17.60 (5.08s) — "for those of you who are watching this video, you're still in it" (direct address)
  { src: staticFile('broll-mam-millionaires.png'),    tIn: 17.60, tOut: 19.44, mode: 'full' }, // "THIS IS WHEN MILLIONAIRES ARE MADE" (PEAK 1)
  { src: staticFile('broll-mam-make-money.png'),      tIn: 19.44, tOut: 23.20, mode: 'zone' }, // "this is when you really make your money"
  { src: staticFile('broll-mam-holding-on.png'),      tIn: 23.20, tOut: 25.62, mode: 'zone' }, // "you keep on, you keep on holding on"
  { src: staticFile('broll-mam-rough-ride.png'),      tIn: 25.62, tOut: 28.18, mode: 'zone' }, // "holding on with this rough ride"
  // BASE 28.18-34.30 (6.12s) — "you keep holding on and you don't get out. just keep riding it. and i'm open for a rally. it's like i always say,"
  { src: staticFile('broll-mam-rally-100x.png'),      tIn: 34.30, tOut: 38.90, mode: 'full' }, // "give me a rally and i'll give you a 100x" (CLAIM + the 2.1s dramatic pause)
  { src: staticFile('broll-mam-hell-yeah.png'),       tIn: 38.90, tOut: 41.18, mode: 'full' }, // "HELL YEAH" (adjacent hard cut off the claim)
  // BASE 41.18-44.66 (3.48s) — "this is because of all the stuff i got going on in my community"
  { src: staticFile('broll-mam-software-radar.png'),  tIn: 44.66, tOut: 47.54, mode: 'zone' }, // "as i build software to find all these really good plays"
  // BASE 47.54-54.90 (7.36s) — "we got a ton of them / i'm browsing through here / poker face / green ones in here that are my play"
  //   ^ THE screen-share reveal: he is pointing at the bubble map. No b-roll over it, by design.
  { src: staticFile('broll-mam-poker-vault.png'),     tIn: 54.90, tOut: 56.66, mode: 'zone' }, // "so i'm not going to expose those"
  { src: staticFile('broll-mam-another-100x.png'),    tIn: 56.66, tOut: 60.30, mode: 'zone' }, // "but give me a rally and i'll give you another 100x. that's just the way it goes"
  { src: staticFile('broll-mam-lab-350x.png'),        tIn: 60.30, tOut: 64.54, mode: 'full' }, // "we did the 350x a couple of months ago on $LAB" (RECEIPT — generated WITH the LAB.png reference)
  { src: staticFile('broll-mam-no-rally.png'),        tIn: 64.54, tOut: 65.66, mode: 'full' }, // "and there was no rally" (adjacent hard cut; the word "$LAB" ends at 64.54 so it lands on the logo)
  // BASE 65.66-68.48 (2.82s) — "so imagine, imagine what happens when we get to a rally" (breath before the climax)
  { src: staticFile('broll-mam-cycle-top-200x.png'),  tIn: 68.48, tOut: 72.80, mode: 'full' }, // "if we get a cycle top i'll give you like freaking 200x" (CLIMAX)
  // "oh man" (the closing exhale). NOT a base beat: QA of the render showed this window's screen-share
  // is an OFF-MESSAGE static Crypto Briefing article ("Trump warns of potential US government
  // shutdown"), a big white block, AND the webcam is out of focus here (face-region focus measure
  // ~1.9 vs ~5.5-6.9 on the mid-clip base beats). That is the loop frame of the short. SKILL b-roll
  // budget: "An off-message / low-value screen-share is NOT a license to blanket - leave base gaps or
  // drop in a brief full-screen". So we cover it. ZONE (not full) so the face returns after the 4.32s
  // climax full-screen (style guide: b-roll never replaces the face entirely for more than ~3s).
  // Hard cut in (prevAdj: the climax ends exactly at 72.80). tOut 75.20 is PAST the comp end
  // (MAM_DURATION 2245 = 74.833s) ON PURPOSE: the layer fades out over the 0.12s before tOut, so an
  // exact 74.83 tOut would fade the white article back in over the final ~4 frames.
  { src: staticFile('broll-mam-afterglow.png'),       tIn: 72.80, tOut: 75.20, mode: 'zone' }, // "oh man" (gold ember afterglow settling)
];

// ─── Badges (crisp code text, top zone y300; time-separated, never over the caption band y872,
// never while the frame-0 thumb is up). Both sit over BASE stretches and state something the
// captions do NOT — never baked into art. ───────────────────────────────────────────────────────
export type MamBadge = { tIn: number; tOut: number; big: string; sub: string; color: string };
export const BADGES_MAM: MamBadge[] = [
  { tIn: 50.20, tOut: 53.40, big: 'MY PLAYS', sub: 'HIDDEN IN PLAIN SIGHT', color: '#00e5ff' }, // over the live bubble map he is browsing
  { tIn: 66.20, tOut: 68.30, big: '350x',     sub: 'WITH NO RALLY',         color: '#ffe600' }, // receipt callback right before the climax
];

// ─── SFX events (copied into render-assets/sfx/; all vol <= 0.52 under the VO) ───────────────────
// whoosh on the thumbnail cut + every major layout transition; risers build INTO an impact at the
// two biggest beats (peak-1, the climax); impacts land on the reveals/punchlines; a kaching on the
// 350x receipt. Per Impacts/WHEN-TO-USE-IMPACTS.md: reserved for beats that actually matter.
// Literal sfx/ path strings below (gate-visible).
export type MamSfx = { t: number; src: string; vol: number; dur: number };
export const SFX_MAM: MamSfx[] = [
  { t:  0.00, src: staticFile('sfx/whoosh.wav'),       vol: 0.50, dur: 1.6 }, // thumbnail cut -> hook full-screen
  { t:  2.60, src: staticFile('sfx/whoosh-rapid.mp3'), vol: 0.40, dur: 1.0 }, // hook full -> zone transition
  { t: 14.20, src: staticFile('sfx/riser.wav'),        vol: 0.34, dur: 3.4 }, // builds INTO peak 1
  { t: 17.60, src: staticFile('sfx/impact-big.wav'),   vol: 0.52, dur: 3.2 }, // "millionaires are made" (PEAK 1 impact + full cut)
  { t: 34.30, src: staticFile('sfx/whoosh.wav'),       vol: 0.44, dur: 1.6 }, // cut to the 100x claim full-screen
  { t: 36.22, src: staticFile('sfx/impact-kick.wav'),  vol: 0.46, dur: 2.0 }, // "a 100x" lands
  { t: 38.90, src: staticFile('sfx/impact-boom.wav'),  vol: 0.50, dur: 3.0 }, // "hell yeah" (punchline hard cut)
  { t: 44.66, src: staticFile('sfx/whoosh-rapid.mp3'), vol: 0.36, dur: 1.0 }, // base -> software zone
  { t: 54.90, src: staticFile('sfx/whoosh-rapid.mp3'), vol: 0.36, dur: 1.0 }, // base -> poker-vault zone (out of the screen-share reveal)
  { t: 60.30, src: staticFile('sfx/whoosh2.wav'),      vol: 0.44, dur: 1.6 }, // cut into the $LAB receipt
  { t: 61.00, src: staticFile('sfx/cash.mp3'),         vol: 0.42, dur: 1.6 }, // the 350x receipt (kaching)
  { t: 64.54, src: staticFile('sfx/impact-kick.wav'),  vol: 0.44, dur: 1.4 }, // hard cut to "no rally"
  { t: 65.80, src: staticFile('sfx/riser.wav'),        vol: 0.36, dur: 2.7 }, // builds INTO the climax
  { t: 68.48, src: staticFile('sfx/impact-big2.wav'),  vol: 0.52, dur: 3.4 }, // "if we get a cycle top" (CLIMAX full cut)
  { t: 71.30, src: staticFile('sfx/impact-boom.wav'),  vol: 0.46, dur: 2.6 }, // "freaking 200x" (final button)
];

// ─── Captions ─────────────────────────────────────────────────────────────────
// Built with the CANONICAL captions skill:
//   python video-creation/skills/captions/build_captions.py --words mam.json --style montserrat \
//     --var CAPTIONS_MAM --colorize "y=100x,350x,200x,15 g=millionaires,made,rally"
// (montserrat preset = shorts house style: lowercase, 2-3 word chunks / up to 5 if all words <=4
// chars, bounce pop. Rendered by the Caption component below with the exemplar's verbatim styling:
// lowercase + Arial Black/Montserrat 900 + 13px black stroke + pop. NEVER uppercase.)
//
// Corrections applied to the builder output (STT only — the grouping/case/style is untouched):
//  - "a hundred x" -> "a 100x" and "another hundred x" -> "another 100x" (the builder's number-merge
//    only fires on DIGITS; Mike says "a hundred X" = 100x). Tagged <y> like the other numbers.
//  - "freaking 20 hundred xs" -> "freaking / 200x" (Whisper garbles "200x"; per the clip brief the
//    closer is "i'll give you like freaking 200x"). Split so 200x lands alone on the impact.
//  - "on lab" -> "on $LAB" (delegation STT fix: master 1447.16 "lab" IS the $LAB token). Tagged
//    <gr> = green because that is $LAB's real brand colour (verified against
//    schedule-tweets/images/reference/LAB.png: lime-green flask + LAB wordmark), not teal.
//  - "we did the 350x a" regrouped so <y>350x</y> lands alone on the receipt beat (cash SFX @61.00).
//  - "and there was no" (4 words incl. "there"=5 chars) re-split to "and there was" + "no <g>rally.</g>":
//    splitting $LAB out of the builder's "ago on lab and" had left a 4-word group that broke the
//    montserrat rule (max 3 words; 4-5 ONLY if every word <=4 chars). $LAB still lands alone on the logo.
//  - stray commas left by filler/stutter removal: "so it's, one of" -> "so it's one of";
//    "this, is when" -> "this is when".
// Colour spans (from _kit.colourize): <g> teal = the brand thread on the thesis spine
// (millionaires / made / rally); <y> yellow = the numbers (15, 100x, 350x, 200x); <gr> green = $LAB.
// No em dashes anywhere.
export const CAPTIONS_MAM: { t: number; h: string }[] = [
  { t:   0.24, h: 'it\'s the opposite' },
  { t:   0.80, h: 'of what we' },
  { t:   1.24, h: 'thought was going' },
  { t:   1.80, h: 'to happen for' },
  { t:   2.24, h: 'july.' },
  { t:   2.80, h: 'so it\'s one of' },
  { t:   3.70, h: 'those things we' },
  { t:   4.28, h: 'keep on getting' },
  { t:   4.88, h: 'beaten over the' },
  { t:   6.00, h: 'head over since' },
  { t:   6.64, h: 'tariff season of' },
  { t:   7.76, h: 'last year going' },
  { t:   8.78, h: 'back <y>15</y> months' },
  { t:   9.82, h: 'we keep getting' },
  { t:  10.46, h: 'beaten over the' },
  { t:  11.08, h: 'head and it is what' },
  { t:  12.10, h: 'it is, but as you' },
  { t:  14.20, h: 'know, for those' },
  { t:  15.38, h: 'of you who are' },
  { t:  15.90, h: 'watching this video' },
  { t:  16.72, h: 'you\'re still in' },
  { t:  17.46, h: 'it.' },
  { t:  17.68, h: 'this is when' },
  { t:  18.20, h: '<g>millionaires</g> are <g>made.</g>' },
  { t:  19.18, h: 'all right.' },
  { t:  19.48, h: 'this is when' },
  { t:  20.24, h: '<g>millionaires,</g> this is' },
  { t:  21.24, h: 'when, this is when you' },
  { t:  22.68, h: 'really make your' },
  { t:  23.20, h: 'money and you' },
  { t:  23.74, h: 'keep on, you keep on' },
  { t:  24.90, h: 'holding on, holding' },
  { t:  26.60, h: 'on with this' },
  { t:  27.46, h: 'rough ride.' },
  { t:  28.18, h: 'you keep holding' },
  { t:  28.82, h: 'on and you don\'t get' },
  { t:  30.28, h: 'out.' },
  { t:  30.66, h: 'just keep riding' },
  { t:  31.28, h: 'it.' },
  { t:  31.72, h: 'and i\'m open for a' },
  { t:  32.62, h: '<g>rally.</g>' },
  { t:  32.90, h: 'it\'s like i' },
  { t:  33.26, h: 'always say, give' },
  { t:  34.02, h: 'me a <g>rally</g>' },
  { t:  34.62, h: 'and i\'ll give you' },
  { t:  36.22, h: 'a <y>100x.</y>' },
  { t:  38.90, h: 'hell yeah.' },
  { t:  41.18, h: 'this is because' },
  { t:  42.04, h: 'of all the' },
  { t:  42.92, h: 'stuff i got' },
  { t:  43.44, h: 'going on in' },
  { t:  43.92, h: 'my community.' },
  { t:  44.66, h: 'like as i' },
  { t:  44.98, h: 'build software to' },
  { t:  46.04, h: 'find all these' },
  { t:  46.78, h: 'really good plays.' },
  { t:  47.54, h: 'we got a ton of' },
  { t:  48.30, h: 'them.' },
  { t:  48.52, h: 'i\'m browsing through' },
  { t:  49.26, h: 'here and i am' },
  { t:  51.18, h: 'having a poker' },
  { t:  51.76, h: 'face because there' },
  { t:  52.68, h: 'are a couple' },
  { t:  53.04, h: 'of green ones' },
  { t:  53.58, h: 'in here that are my' },
  { t:  54.56, h: 'play.' },
  { t:  55.06, h: 'so i\'m not' },
  { t:  55.74, h: 'going to expose' },
  { t:  56.28, h: 'those, but give' },
  { t:  56.98, h: 'me a <g>rally</g>' },
  { t:  57.56, h: 'and i\'ll give you' },
  { t:  58.30, h: 'another <y>100x.</y>' },
  { t:  59.30, h: 'that\'s just the' },
  { t:  59.72, h: 'way it goes.' },
  { t:  60.30, h: 'we did the' },
  { t:  60.86, h: '<y>350x</y>' },
  { t:  62.96, h: 'a couple of' },
  { t:  63.26, h: 'months ago on' },
  { t:  64.18, h: '<gr>$LAB</gr>' },
  { t:  64.54, h: 'and there was' },
  { t:  64.98, h: 'no <g>rally.</g>' },
  { t:  65.66, h: 'so imagine' },
  { t:  66.58, h: 'what happens when' },
  { t:  67.40, h: 'we get to a' },
  { t:  67.94, h: '<g>rally.</g>' },
  { t:  68.48, h: 'if we get a' },
  { t:  69.00, h: 'cycle top, i\'ll' },
  { t:  70.20, h: 'give you like' },
  { t:  70.70, h: 'freaking' },
  { t:  71.30, h: '<y>200x.</y>' },
  { t:  72.80, h: 'oh man.' },
];

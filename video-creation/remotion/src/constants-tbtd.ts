import { staticFile } from 'remotion';

// ─── tao-buy-the-dip (batch: where-millionaires-are-made, clip #4, variant: full) ──────────────────
// "Everything's Looking Like Crap. I Just Bought More TAO at $199"
//
// The source clip is ALREADY composited vertical (screen-share top + Mike's face bottom, seam ~y854).
// It is played full-frame; the caption band is overlaid at the seam. Do NOT re-split screen/face.
// Clip is 1080x1920 @ 25fps, 68.332s; comp runs at 30fps (OffthreadVideo resamples by time).
//
// EDITORIAL FRAMING (hard — see BROLL-PLAN.md): the clip is NON-CHRONOLOGICAL by design (pain first,
// buy second) so it ends on conviction. Mike defends Kaspa by UNIVERSALIZING — it is the whole market
// that is red, not the project. NO visual may imply Kaspa specifically is failing: the one Kaspa beat
// (the hook) is the teal Kaspa coin standing INTACT while the whole market bleeds around it. TAO's dip
// is the OPPORTUNITY, never a loss. The repeated "199" is a callback (badge A on the dip, badge B on
// the buy).
//
// Render with (public-dir = render-assets/, which holds the clip mp4 + b-roll + thumbnail + sfx/):
//   npx remotion render src/index.ts TaoBuyTheDip out/where-millionaires-are-made/4-tao-buy-the-dip.mp4 \
//     --public-dir "<repo>/video-creation/shorts/where-millionaires-are-made/tao-buy-the-dip/render-assets"

export const TBTD_FPS = 30;
export const TBTD_DURATION = 2050; // frames 0..2049 -> last frame t=68.30s, just inside the 68.332s clip

export const CLIP_TBTD  = staticFile('tao-buy-the-dip-full.mp4');
export const THUMB_TBTD = staticFile('thumbnail-full.png');

// Layout geometry — MEASURED from extracted frames (mean row-gradient peaks at row 854 on frames
// 5s / 30s / 45s / 67s; all four agree, so the seam does not drift).
export const TBTD_SEAM  = 854;   // screen-share (top) / face (bottom) seam; zone broll covers 0..SEAM
export const TBTD_CAP_Y = 872;   // caption centre — just below the seam, over his hairline, never his eyes

// ─── B-roll beats (from BROLL-PLAN.md, re-authored under Mike's HALVED budget 2026-07-14) ─────────
// Palette: deep matte black, molten GOLD (#ffb400) = TAO the hero, TEAL (#00e5ff) = Kaspa + the brand
// thread (the 5px zone seam line), RED (#ff3b3b) = the market bleed. Nothing gold is ever Kaspa.
//
// COVERAGE (measured): 22.90s b-roll (33.5%) / 45.43s base showing (66.5%) / 8 distinct images /
// 2 full-screens. Mike's HALVED budget is ~30% b-roll (band 25-35%) / ~70% base (band 65-75%),
// 6-8 distinct images, 1-3 full-screens. Every number is INSIDE the band. Base-showing is the
// DEFAULT state of this clip: the 31.60s stretch from 2.00-33.60 carries NO image at all, because the
// screen-share there IS the evidence he is narrating (red CMC pages -> CMC Bittensor TAO/USDT $199.87
// -> CMC Kaspa page + Kaspa Markets table). The sibling short (66.8%, 16 images, 5 full-screens) is the
// explicit ANTI-EXAMPLE.
//
// CONTENT-ZONE SURVEY — re-measured FRAME-ACCURATE at build time by scene-change scan (the BROLL-PLAN's
// window edges were approximate; the per-window VERDICTS below are unchanged from the approved plan):
//   0.00-33.60  SHOW  CASHCAT chart -> CMC Bittensor ($199.87) -> CMC Kaspa + Kaspa Markets  [BASE]
//   33.60-56.40 COVER static off-message X "Kraken Card" ad (scene cut measured at 33.60 and 56.40)
//   56.40-57.55 show  Bitcoin Markets, clean but only ~1.2s (too short for a base gap; not revealed)
//   57.55-61.00 COVER CMC search dropdown modal opens over the page (messy UI)
//   61.00-64.40 COVER "Loading Data... please wait, we are loading their data" (dead)
//   64.00-68.33 SHOW  Bittensor Markets table populated = THE MONEY SHOT, he says "bittensor is going
//                     to be big time" while it is literally on screen. Covering it is self-defeating. [BASE]
// The approved plan's X window was written 33-53; it MEASURES 33.60-56.40 (3.4s longer), and its
// "SHOW 53-60 Bitcoin Markets" is really only clean for ~1.2s.
//
// ⚠️ WEBCAM FOCUS (measured at build time, tight face-box Laplacian variance @1s):
//   0-33s SHARP (~5-9) | 33.5-52.5s SOFT (~2.1-3.4, i.e. ~40% of sharp) | 53-68s SHARP again (~4.8-7.7)
// The out-of-focus window almost exactly OVERLAPS the X-ad window, so 33.60-52.50 is DOUBLE-BAD: a
// static off-message ad on top AND a soft face below. There is therefore no fully-good base anywhere in
// the X window. Covering every bad window outright lands at ~44-47%, far OVER Mike's band, so per the
// SKILL's own remedy ("an off-message screen-share is NOT a license to blanket - leave base gaps"),
// base gaps are left inside the X window and are placed to MINIMISE soft-face exposure:
//   - 53.00-56.40 (3.40s) is the ONLY base gap in the X window where the face is SHARP; it is used in
//     full, as the breath before the climax ("of course. and i saw tao at um,").
//   - 39.56-43.40 (3.84s) is UNAVOIDABLE base: "what type of words would trump use?" cannot be
//     illustrated without a real-person face, which the persona rules forbid. Face is soft; his
//     delivery still carries the gag.
//   - 46.90-49.16 (2.26s) is the doubled "you know, maybe a lot of the subnets" filler; the SECOND,
//     better mention gets the b-roll instead.
// Total soft-face base exposure = 6.10s. That is the floor for this source at <=35% coverage.
//
// 'base' beats carry NO image on purpose (the screen-share IS the visual) and are listed here only as
// documentation; BrollLayer ignores them. Adjacent beats HARD-CUT (no base flash); isolated beats fade
// 0.12s to/from the base, which is a DELIBERATE reveal. Every base gap is >= 2.00s (no sub-1s flashes).
// Neither full-screen hides Mike's face for more than 3.0s (2.00s and 2.92s) per the style guide.
// staticFile() calls are LITERAL strings on purpose — the finalized-short gate scans for literal refs.
//
// `focus` = CSS objectPosition for zone beats. A 941x1672 image cover-fit into the 1080x854 zone shows
// only original rows ~463-1207 (the middle band), so a subject sitting low gets chopped. Default
// 'center' is right for 5 of the 6 zone beats; 'soaring' puts its tau core at rows ~1087-1304 (the
// trails occupy the top), so it is biased to 'center 75%' -> shows rows ~696-1440, tau fully inside.
export type TbtdBroll = { src: string; tIn: number; tOut: number; mode: 'full' | 'zone'; focus?: string };
export const BROLL_TBTD: TbtdBroll[] = [
  { src: staticFile('broll-tbtd-hook-full.png'),   tIn:  0.00, tOut:  2.00, mode: 'full' }, // HOOK "why is kaspa looking like dog shit?" — teal Kaspa coin INTACT in a market-wide red storm (Kaspa DEFENDED)
  //                                                2.00 33.60  BASE 31.60s — the receipts carry it: CASHCAT bleed, CMC Bittensor $199.87, CMC Kaspa + Kaspa Markets. Face SHARP. NO image, by design.
  { src: staticFile('broll-tbtd-bigtime.png'),     tIn: 33.60, tOut: 36.24, mode: 'zone' }, // THE TURN "bittensor is going to be like big time" (X ad + soft face both start ~33.6)
  { src: staticFile('broll-tbtd-colossal.png'),    tIn: 36.24, tOut: 39.56, mode: 'zone' }, // "very, very big time, huge, like bigly"
  //                                               39.56 43.40  BASE 3.84s — "what type of words would trump use?" + the 1.9s pause. UNAVOIDABLE base: a Trump gag cannot be drawn without a real face.
  { src: staticFile('broll-tbtd-insane-tao.png'),  tIn: 43.40, tOut: 46.90, mode: 'zone' }, // "i think it's going to be like insane in tao itself"
  //                                               46.90 49.16  BASE 2.26s — "and you know maybe a lot of the subnets" (the line is doubled; the 2nd, better mention gets the b-roll)
  { src: staticFile('broll-tbtd-soaring.png'),     tIn: 49.16, tOut: 53.00, mode: 'zone', focus: 'center 75%' }, // "a lot of the subnets are going to be soaring, but you have to choose the right ones"
  //                                               53.00 56.40  BASE 3.40s — "of course. and i saw tao at um," the breath before the climax. The ONLY SHARP-face base in the X window, used in full.
  { src: staticFile('broll-tbtd-buy199-full.png'), tIn: 56.40, tOut: 59.20, mode: 'full' }, // CLIMAX — THE BUY, landed on the PAYOFF words "$199 just before, i just bought another one" + RISER->IMPACT + KACHING
  { src: staticFile('broll-tbtd-another-tao.png'), tIn: 59.20, tOut: 61.60, mode: 'zone' }, // "let me just buy another tao" (hard cut off the climax; covers the search modal)
  { src: staticFile('broll-tbtd-good-deals.png'),  tIn: 61.60, tOut: 64.00, mode: 'zone' }, // "there's still $199. a lot of good deals" + BADGE B + DING (covers the dead "Loading Data")
  //                                               64.00 68.33  BASE 4.33s — MONEY SHOT: Bittensor Markets on screen under "you're looking at it right here". HARD RULE: stays base.
];

// ─── Badges (code-drawn text, content zone y300) ───────────────────────────────────────────────────
// The "199" CALLBACK: it lands once on the dip and once on the buy. Time-separated by 28.7s and both
// live in the SAME band (y300), so two badges can never share the frame. Neither overlaps a
// full-screen beat (A sits over base; B starts 2.16s after the climax full-screen ends) and both start
// long after the frame-0 thumb (0.033s), so no graphic ever stacks on the cover. Badges sit at y300,
// captions at y872 — different vertical bands, so they never collide in space either.
export type TbtdBadge = { tIn: number; tOut: number; big: string; sub: string };
export const BADGES_TBTD: TbtdBadge[] = [
  { tIn: 28.60, tOut: 30.70, big: '$199', sub: 'TAO JUST DIPPED' },      // over BASE; the word "$199" is spoken 30.00-30.54
  { tIn: 59.40, tOut: 62.80, big: '$199', sub: 'BOUGHT ANOTHER ONE' },   // over the buy beats; "another Tau" 59.92-60.80, "$199" 62.02-62.34
];

// ─── SFX (9 events, 7 distinct files) ─────────────────────────────────────────────────────────────
// All times are ONSET-COMPENSATED from the measured files, so the transient lands ON the cut/word:
//   Riser Sound Effect peaks at 5.14s -> started 25.72 so its peak resolves into the 30.86 impact.
//   Edgy_Riser        peaks at 5.07s -> started 51.33 so its peak resolves into the 56.40 buy impact.
//   Impact_3          onset 0.22s    -> started 30.64 to hit ON "everything's looking like CRAP" (30.86).
//   Impact_Hit_01-2   onset 0.05s    -> started 56.35 to hit ON the BUY full-screen cut (56.40).
//   Kaching           onset 0.49s    -> started 57.75 to hit ON the word "bought" (58.24).
//   DING              onset 0.14s    -> started 61.88 to hit ON the "$199" callback (62.02).
// Both risers RESOLVE INTO an impact (skill: "a riser builds INTO an impact where a payoff lands").
// All well under the VO.
export type TbtdSfx = { t: number; src: string; dur: number; vol: number };
export const SFX_TBTD: TbtdSfx[] = [
  { t:  0.00, src: staticFile('sfx/Cinematic Whoosh 02.wav'),                    dur: 2.24, vol: 0.50 }, // thumbnail cut -> hook full-screen
  { t:  2.00, src: staticFile('sfx/transition_rapid_whoosh.mp3'),                dur: 0.97, vol: 0.42 }, // hook full-screen -> the base reveal
  { t: 25.72, src: staticFile('sfx/Riser Sound Effect.mp3'),                     dur: 5.14, vol: 0.22 }, // riser -> builds into the punchline impact
  { t: 30.64, src: staticFile('sfx/Impacts/Impact_3.wav'),                       dur: 2.90, vol: 0.55 }, // IMPACT on "everything's looking like CRAP" (the doubled peak)
  { t: 33.60, src: staticFile('sfx/Cinematic Whoosh 06.wav'),                    dur: 2.10, vol: 0.45 }, // cut into the turn "bittensor is going to be big time"
  { t: 51.33, src: staticFile('sfx/risers/Edgy_Riser.wav'),                      dur: 5.07, vol: 0.20 }, // riser -> builds through the sharp-face base breath into the buy impact
  { t: 56.35, src: staticFile('sfx/Impacts/Impact_Hit_01-2.wav'),                dur: 2.60, vol: 0.50 }, // IMPACT on the CLIMAX cut (THE BUY); dur trimmed so its tail clears the kaching
  { t: 57.75, src: staticFile('sfx/Cash Register Kaching  Sound Effect HD.mp3'), dur: 3.09, vol: 0.40 }, // "i just bought another one" = the receipt
  { t: 61.88, src: staticFile('sfx/DING.mp3'),                                   dur: 2.14, vol: 0.40 }, // "there's still $199" = the callback lands
];

// ─── Frame-0 thumbnail hook text (code-drawn over thumbnail-full.png, ONE frame only) ─────────────
// Text is drawn in Remotion, NOT baked into the image (SKILL: never bake text into a ChatGPT image).
// The art is generated with a deliberately EMPTY dark top third so this text sits on clean negative
// space. The open loop = the pain, then the contrarian action. No em dashes.
// Sizes are set so the widest line ("EVERYTHING'S" / "LOOKING LIKE", 12 chars of Montserrat Black
// ~0.72em advance) stays inside 1080 - 2*52 = 976px: 12 * 0.72 * 108 = ~933px. Verified on a
// rendered still, not estimated.
export type TbtdThumbLine = { text: string; red?: boolean };
export const THUMB_TBTD_TITLE: TbtdThumbLine[] = [
  { text: "EVERYTHING'S" },
  { text: 'LOOKING LIKE' },
  { text: 'CRAP', red: true },
];
export const THUMB_TBTD_CHIP = 'SO I BOUGHT MORE TAO AT $199';

// ─── Word-by-word captions ────────────────────────────────────────────────────────────────────────
// Built by the CANONICAL captions skill: skills/captions/build_captions.py --style montserrat
// (house style: lowercase, 2-3 words, up to 5 if all <=4 chars, Montserrat 900 + 13px stroke, pop).
//   python fix_words.py                                        # clip-specific STT number/meaning fixes
//   python skills/captions/build_captions.py --words whisper-words-full-fixed.json --style montserrat \
//     --var CAPTIONS_TBTD --colorize 'g=kaspa y=$199,$200,$212,$220 o=tao,bittensor r=crap,shit'
// VERIFIED at build time: re-running the canonical builder off the hand-fixed STT reproduces this array
// byte-for-byte (71 lines), so these captions are current with whisper-words-full-fixed.json.
// STT: ALWAYS "tao" never "tau" (canonical CORRECTIONS); "But Tenzer"/"the Tenzer" -> "bittensor"
// (the 0.12s "But"/"the" IS the "bit-" syllable — added to CORRECTIONS + the cleanup() merge);
// "Casper" -> "kaspa"; spoken "two twelve"/"one ninety nine" -> $212/$199 (see fix_words.py).
// Colour: <g> teal = kaspa, <o> gold/orange = tao/bittensor, <y> yellow = prices, <r> red = crap/shit.
export const CAPTIONS_TBTD: { t: number; h: string }[] = [
  { t:   0.00, h: 'why is <g>kaspa</g>' },
  { t:   1.48, h: 'looking like dog' },
  { t:   2.28, h: '<r>shit?</r>' },
  { t:   2.62, h: 'he says' },
  { t:   6.42, h: 'everything looks like' },
  { t:   7.56, h: 'dog <r>shit.</r>' },
  { t:   8.28, h: '<o>bittensor</o> actually came' },
  { t:   9.40, h: 'down below <y>$200.</y>' },
  { t:  11.10, h: 'i was surprised' },
  { t:  11.64, h: 'if <o>bittensor</o> went' },
  { t:  12.96, h: 'down below <y>$200,</y>' },
  { t:  14.02, h: 'i was expecting' },
  { t:  15.12, h: '<g>kaspa</g> to be' },
  { t:  15.86, h: 'at 2.7' },
  { t:  16.70, h: 'cents.' },
  { t:  17.28, h: 'so, which is' },
  { t:  17.86, h: 'interesting because it' },
  { t:  18.92, h: 'typically would be' },
  { t:  19.80, h: 'like <g>kaspa,</g> it' },
  { t:  21.34, h: 'shows a little' },
  { t:  21.98, h: 'bit more weak than <o>tao.</o>' },
  { t:  23.68, h: 'but now i was' },
  { t:  25.02, h: 'expecting <o>tao</o> to' },
  { t:  25.78, h: 'be like <y>$212</y> or <y>$220,</y>' },
  { t:  27.62, h: 'whatever.' },
  { t:  28.12, h: 'it just went all the' },
  { t:  29.44, h: 'way down at <y>$199.</y>' },
  { t:  30.86, h: 'like everything\'s looking' },
  { t:  31.74, h: 'like <r>crap.</r>' },
  { t:  32.36, h: 'everything\'s looking like' },
  { t:  33.04, h: '<r>crap.</r>' },
  { t:  33.50, h: 'because i think' },
  { t:  33.96, h: 'that <o>bittensor</o> is' },
  { t:  34.86, h: 'going to be' },
  { t:  35.30, h: 'like big time' },
  { t:  36.24, h: 'very, very big time' },
  { t:  37.64, h: 'huge, like bigly' },
  { t:  39.56, h: 'what type of' },
  { t:  40.84, h: 'words would trump' },
  { t:  41.54, h: 'use?' },
  { t:  43.40, h: 'i think it\'s' },
  { t:  44.10, h: 'going to be' },
  { t:  44.48, h: 'like insane in' },
  { t:  46.20, h: '<o>tao</o> itself.' },
  { t:  47.28, h: 'and you know' },
  { t:  47.72, h: 'maybe a lot' },
  { t:  48.42, h: 'of the subnets' },
  { t:  49.16, h: 'you know, a lot of' },
  { t:  49.60, h: 'the subnets are' },
  { t:  50.20, h: 'going to be' },
  { t:  51.26, h: 'soaring, but you' },
  { t:  52.22, h: 'have to choose' },
  { t:  52.76, h: 'the right ones' },
  { t:  53.36, h: 'of course.' },
  { t:  54.32, h: 'and i saw <o>tao</o> at' },
  { t:  56.56, h: '<y>$199</y> just before' },
  { t:  57.98, h: 'i just bought' },
  { t:  58.44, h: 'another one.' },
  { t:  58.92, h: 'i was like, let me' },
  { t:  59.38, h: 'just, let me just buy' },
  { t:  59.92, h: 'another <o>tao.</o>' },
  { t:  61.66, h: 'there\'s still <y>$199.</y>' },
  { t:  62.78, h: 'yeah.' },
  { t:  63.06, h: 'so a lot of good' },
  { t:  63.76, h: 'deals out there.' },
  { t:  64.72, h: 'anybody\'s looking for' },
  { t:  65.34, h: 'some good deals.' },
  { t:  66.24, h: 'you\'re looking at' },
  { t:  66.84, h: 'it right here.' },
  { t:  67.34, h: 'you got some' },
  { t:  67.70, h: 'really good deals.' },
];

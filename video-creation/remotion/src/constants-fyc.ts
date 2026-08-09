import { staticFile } from 'remotion';

// ─── four-year-cycle-religion (batch: pump-season-is-back, clip #2, variant: full) ──
// The source clip is ALREADY composited vertical (screen-share top + Mike's face bottom,
// seam ~y848, same livestream layout as clip #1 community-receipts). It is played full-frame;
// the caption band is overlaid at the seam. Do NOT re-split screen/face.
// Clip is 1080x1920 @ 25fps, 65.48s; comp runs at 30fps (OffthreadVideo resamples by time).
//
// Render with (public-dir = render-assets/, which holds the clip mp4 + thumbnail-full.png):
//   npx remotion render src/index.ts FourYearCycleReligion out/pump-season-is-back/2-four-year-cycle-religion.mp4 \
//     --public-dir "<repo>/video-creation/shorts/pump-season-is-back/four-year-cycle-religion/render-assets"

export const FYC_FPS = 30;
export const FYC_DURATION = 1965; // 65.5s * 30 (covers the 65.48s clip; last caption 64.82, last beat 65.47)

export const CLIP_FYC  = staticFile('four-year-cycle-religion-full.mp4');
export const THUMB_FYC = staticFile('thumbnail-full.png');

// Layout geometry (measured from extracted frames — same source livestream layout as clip #1).
// Webcam seam sits at ~y854; zone b-roll covers 0..FYC_SEAM so it hides the burned-in @Pygoz stream
// comment (~y715-785) AND the low-value static BTC chart, while Mike's face stays visible below.
export const FYC_SEAM  = 848;   // screen-share (top) / face (bottom) seam; zone broll covers 0..SEAM
export const FYC_CAP_Y = 866;   // caption centre — just below the seam, over Mike's hairline, never his eyes

// ─── B-roll beats (from BROLL-PLAN.md — RED-RITUAL / cult-doctrine palette; teal stays ONLY as the
// brand thread = caption <g> accents + the 5px zone seam line + the 2 badges) ────────────────────
// mode 'full' = whole frame (HOOK, "religious" thesis peak, crypto-winter payoff, kicker climax);
// 'zone' = the top screen-share zone only (0..SEAM), Mike's face plays below. Every beat butts against
// its neighbours (hard cut, no base flash, the @Pygoz comment is never exposed). Reuses (prophecy@8/11,
// crash@10/14, data@3/18, cycle-crack@2/19) are all NON-ADJACENT so the top zone changes every ~2-4s.
// staticFile() calls are LITERAL strings on purpose — the finalized-short gate scans for literal refs.
export type FycBroll = { src: string; tIn: number; tOut: number; mode: 'full' | 'zone' };
export const BROLL_FYC: FycBroll[] = [
  // HOOK: broll-psb-hook.png ON DISK is a DEFECTIVE clip-1 leftover (green+gold crown coin, wrong
  // palette + off-topic) — NOT used. The red-ritual cult-congregation image (followers) is a strong,
  // on-thesis hook that flows from the "...IS A RELIGION" thumbnail; it also plays at beat 7 (20s away,
  // a clean far reuse). Flagged for Mike: regenerate a bespoke red hook or bless this substitution.
  { src: staticFile('broll-psb-followers.png'),    tIn:  0.00, tOut:  2.60, mode: 'full' }, // "i'm no longer a four year cycle zombie" (HOOK — substitute for defective hook.png)
  { src: staticFile('broll-psb-cycle-crack.png'), tIn:  2.60, tOut:  6.12, mode: 'zone' }, // "stopped believing... over a year ago"
  { src: staticFile('broll-psb-data.png'),        tIn:  6.12, tOut: 10.24, mode: 'zone' }, // "i look at the data and what causes everything"
  { src: staticFile('broll-psb-magical.png'),     tIn: 10.24, tOut: 14.84, mode: 'zone' }, // "a magical four year cycle that can't be explained"
  { src: staticFile('broll-psb-religion.png'),    tIn: 14.84, tOut: 18.00, mode: 'full' }, // "it's almost like something religious" (THESIS PEAK)
  { src: staticFile('broll-psb-doctrine.png'),    tIn: 18.00, tOut: 22.28, mode: 'zone' }, // "it's doctrine, you just believe, don't care about data"
  { src: staticFile('broll-psb-followers.png'),   tIn: 22.28, tOut: 25.38, mode: 'zone' }, // "these four year cycle people"
  { src: staticFile('broll-psb-prophecy.png'),    tIn: 25.38, tOut: 30.16, mode: 'zone' }, // "i had said, it's documented, as far back as last summer"
  { src: staticFile('broll-psb-winter.png'),      tIn: 30.16, tOut: 33.52, mode: 'zone' }, // "crypto winter for a quarter or two, started in january"
  { src: staticFile('broll-psb-crash.png'),       tIn: 33.52, tOut: 35.78, mode: 'zone' }, // "and obviously that happened. that has happened."
  { src: staticFile('broll-psb-prophecy.png'),    tIn: 35.78, tOut: 39.12, mode: 'zone' }, // "the reason why i said it was going to happen" (reuse — pointing back to his call)
  { src: staticFile('broll-psb-localtop.png'),    tIn: 39.12, tOut: 42.62, mode: 'zone' }, // "a very disappointing local top and bitcoin"
  { src: staticFile('broll-psb-capitulate.png'),  tIn: 42.62, tOut: 46.08, mode: 'zone' }, // "screw this, screw this, i'm out"
  { src: staticFile('broll-psb-crash.png'),       tIn: 46.08, tOut: 48.34, mode: 'zone' }, // "crypto and they're going to dump" (reuse — sell-off)
  { src: staticFile('broll-psb-winter-full.png'), tIn: 48.34, tOut: 50.66, mode: 'full' }, // "go into crypto winter, and it actually did happen" (PAYOFF)
  // NOTE: on disk the blackswan/shock FILES are content-inverted vs their names — shock.png holds the
  // ringing rotary PHONE, blackswan.png holds the red geopolitical WASTELAND. Referenced by CONTENT so
  // the phone lands on the "phone call" line and the abstract shockwave on the "iran/black swan" line.
  { src: staticFile('broll-psb-shock.png'),       tIn: 50.66, tOut: 53.96, mode: 'zone' }, // "trump forgot to give me a phone call" (the red rotary phone)
  { src: staticFile('broll-psb-blackswan.png'),   tIn: 53.96, tOut: 57.14, mode: 'zone' }, // "his plans about iran, i didn't know about that" (abstract geopolitical BLACK SWAN)
  { src: staticFile('broll-psb-data.png'),        tIn: 57.14, tOut: 60.30, mode: 'zone' }, // "you receive new data and you have to adjust" (reuse)
  { src: staticFile('broll-psb-cycle-crack.png'), tIn: 60.30, tOut: 63.68, mode: 'zone' }, // "the opposite of believe in the magical four year cycle" (reuse)
  { src: staticFile('broll-psb-kicker.png'),      tIn: 63.68, tOut: 65.47, mode: 'full' }, // "they receive new data and you have to adjust to it" (KICKER / CLIMAX)
];

// ─── Badges (crisp code text, top zone y~300; TEAL brand thread; time-separated, never over the
// caption band y866). Never baked into art. ─────────────────────────────────────────────────────
export type FycBadge = { tIn: number; tOut: number; big: string; sub: string };
export const BADGES_FYC: FycBadge[] = [
  { tIn: 26.60, tOut: 29.90, big: 'CALLED IT',   sub: 'LAST SUMMER' }, // over the prophecy beat (documented call)
  { tIn: 34.40, tOut: 35.70, big: 'IT HAPPENED', sub: 'ON RECORD'   }, // over the crash confirmation
];

// ─── SFX events (copied into render-assets/sfx/; all vol <= 0.55 under the VO) ───────────────────
// whoosh on the thumbnail cut + layout transitions; risers build INTO the "religious" peak, the
// crypto-winter payoff, and the kicker; impacts land on those peaks; a ding on the CALLED IT badge;
// waitwhat on the trump/iran black-swan surprise. Literal sfx/ path strings below (gate-visible).
export type FycSfx = { t: number; src: string; vol: number; dur: number };
export const SFX_FYC: FycSfx[] = [
  { t:  0.00, src: staticFile('sfx/whoosh.wav'),       vol: 0.50, dur: 1.6 }, // thumbnail cut -> hook reveal
  { t:  2.60, src: staticFile('sfx/whoosh-rapid.mp3'), vol: 0.42, dur: 1.0 }, // hook full -> zone (layout transition)
  { t: 12.40, src: staticFile('sfx/riser.wav'),        vol: 0.36, dur: 2.6 }, // build into the "religious" thesis peak
  { t: 15.18, src: staticFile('sfx/impact-big.wav'),   vol: 0.52, dur: 3.2 }, // "religious" (THESIS PEAK impact)
  { t: 18.00, src: staticFile('sfx/whoosh-rapid.mp3'), vol: 0.40, dur: 1.0 }, // religion full -> doctrine zone (transition)
  { t: 26.60, src: staticFile('sfx/ding.mp3'),         vol: 0.44, dur: 1.2 }, // CALLED IT badge
  { t: 34.40, src: staticFile('sfx/impact-kick.wav'),  vol: 0.48, dur: 2.0 }, // "that happened" / IT HAPPENED confirmation
  { t: 45.90, src: staticFile('sfx/riser.wav'),        vol: 0.38, dur: 2.5 }, // build into the crypto-winter payoff
  { t: 48.40, src: staticFile('sfx/impact-big.wav'),   vol: 0.52, dur: 3.0 }, // "crypto winter" (PAYOFF impact)
  { t: 50.66, src: staticFile('sfx/waitwhat.mp3'),     vol: 0.44, dur: 2.0 }, // "trump forgot to call me" (black-swan surprise)
  { t: 61.30, src: staticFile('sfx/riser.wav'),        vol: 0.38, dur: 2.4 }, // build into the kicker climax
  { t: 63.75, src: staticFile('sfx/impact-boom.wav'),  vol: 0.50, dur: 3.0 }, // kicker full-screen (CLIMAX impact)
  { t: 64.82, src: staticFile('sfx/impact-kick.wav'),  vol: 0.42, dur: 1.4 }, // "adjust to it" (final button)
];

// ─── Captions ─────────────────────────────────────────────────────────────────
// Built via skills/captions/build_captions.py on the desilenced clip, then corrected:
//  - STT fix (clip-plan.json): "four-year cycle is on me" -> "four year cycle zombie".
//  - "it's document that" -> "it's documented that" (obvious Whisper truncation of the spoken word).
//  - The Trump/Iran beat is kept verbatim: it already frames Iran as an unknowable external
//    event ("Trump forgot to tell me his plans... you receive new data and adjust"), a black
//    swan, NOT Mike's miss (no self-deprecation).
// Colour spans (from _kit.colourize): <g> = teal (brand accent) on the thesis spine only:
//  religious / doctrine / crypto winter (both mentions) / did happen / adjust to it (kicker).
export const CAPTIONS_FYC: { t: number; h: string }[] = [
  { t:   0.00, h: 'i\'m no longer' },
  { t:   1.10, h: 'a four year' },
  { t:   1.60, h: 'cycle zombie.' },
  { t:   2.52, h: 'i stopped believing' },
  { t:   3.16, h: 'in a four year' },
  { t:   3.72, h: 'cycle, like well' },
  { t:   4.88, h: 'over a year ago at' },
  { t:   5.74, h: 'this point.' },
  { t:   6.12, h: 'but i did say, you' },
  { t:   7.14, h: 'know, i look at the' },
  { t:   7.80, h: 'data and i look at' },
  { t:   8.76, h: 'what causes everything.' },
  { t:  10.24, h: 'i don\'t believe' },
  { t:  10.68, h: 'in a magical' },
  { t:  11.48, h: 'four year cycle' },
  { t:  12.70, h: 'that just can\'t be' },
  { t:  13.82, h: 'explained, right?' },
  { t:  14.84, h: 'because it\'s almost' },
  { t:  15.22, h: 'like something <g>religious.</g>' },
  { t:  16.50, h: 'and when you' },
  { t:  16.88, h: 'believe in something' },
  { t:  17.74, h: 'it\'s like, it\'s' },
  { t:  18.66, h: '<g>doctrine.</g>' },
  { t:  19.48, h: 'you just believe' },
  { t:  20.00, h: 'in it and you just' },
  { t:  20.76, h: 'don\'t care about' },
  { t:  21.74, h: 'data.' },
  { t:  22.28, h: 'so yeah, it\'s a' },
  { t:  22.98, h: 'thing i have' },
  { t:  23.46, h: 'with these four' },
  { t:  23.90, h: 'year cycle people.' },
  { t:  25.38, h: 'but i had said, and' },
  { t:  26.98, h: 'it\'s documented that' },
  { t:  27.76, h: 'i had said as far' },
  { t:  28.52, h: 'back as last' },
  { t:  29.02, h: 'summer, that we\'re' },
  { t:  29.78, h: 'going to go' },
  { t:  30.16, h: 'into a <g>crypto</g>' },
  { t:  30.74, h: '<g>winter</g> for a' },
  { t:  31.46, h: 'quarter or two' },
  { t:  32.10, h: 'started in january.' },
  { t:  33.52, h: 'and obviously that' },
  { t:  34.50, h: 'happened.' },
  { t:  35.06, h: 'that has happened.' },
  { t:  35.78, h: 'and the reason' },
  { t:  36.30, h: 'why i said it was' },
  { t:  37.06, h: 'going to happen' },
  { t:  37.50, h: 'is because i' },
  { t:  38.12, h: 'said that a lot of' },
  { t:  39.12, h: 'people are going' },
  { t:  39.78, h: 'to see a very' },
  { t:  40.84, h: 'disappointing local top' },
  { t:  42.16, h: 'and bitcoin.' },
  { t:  42.62, h: 'and i\'m going' },
  { t:  43.00, h: 'to like screw' },
  { t:  43.64, h: 'this.' },
  { t:  44.26, h: 'they\'re going to' },
  { t:  44.44, h: 'be like, screw' },
  { t:  44.98, h: 'this.' },
  { t:  45.46, h: 'i\'m out of' },
  { t:  46.08, h: 'crypto and they\'re' },
  { t:  46.90, h: 'going to dump.' },
  { t:  47.54, h: 'and they\'re going' },
  { t:  47.86, h: 'to cause us' },
  { t:  48.34, h: 'to go into' },
  { t:  48.60, h: '<g>crypto winter.</g>' },
  { t:  49.18, h: 'and i actually' },
  { t:  49.84, h: '<g>did happen.</g>' },
  { t:  50.66, h: 'lo and behold' },
  { t:  51.68, h: 'trump forgot to' },
  { t:  52.52, h: 'you know, give me a' },
  { t:  53.42, h: 'phone call and' },
  { t:  53.96, h: 'tell me his' },
  { t:  54.34, h: 'plans about iran.' },
  { t:  55.92, h: 'so i didn\'t' },
  { t:  56.44, h: 'know about that.' },
  { t:  57.14, h: 'so you receive' },
  { t:  57.94, h: 'new data and you have' },
  { t:  59.22, h: 'to adjust to' },
  { t:  60.30, h: 'it, which is' },
  { t:  60.86, h: 'the opposite of' },
  { t:  61.48, h: 'believe in the' },
  { t:  62.44, h: 'magical four year' },
  { t:  63.14, h: 'cycle.' },
  { t:  63.68, h: 'they receive new' },
  { t:  64.22, h: 'data and you have to' },
  { t:  64.82, h: '<g>adjust to it.</g>' },
];

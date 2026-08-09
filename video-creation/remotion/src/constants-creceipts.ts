import { staticFile } from 'remotion';

// ─── community-receipts (batch: pump-season-is-back, clip #1, variant: full) ──────
// Source clip is ALREADY composited vertical (screen-share top 0..848 + Mike's face bottom,
// seam ~y848). Played full-frame; caption band overlaid at the seam. Do NOT re-split.
// Clip 1080x1920 @ 25fps, 114.4s; comp runs at 30fps (OffthreadVideo resamples by time).
//
// Rebuilt to the FINALIZED-SHORT contract (video-creation/skills/remotion-building/SKILL.md):
// adds a b-roll LAYER (17 distinct assets, full-screen at hook / 500x tease / mirror climax,
// zone coin-cards synced to each receipt) + SFX (whoosh/riser/impacts/dings) + crisp Badge
// multipliers. The prior no-broll/no-sfx skeleton was the rejected build.
//
// Render (public-dir = render-assets/, which holds the clip mp4 + thumbnail + broll + sfx):
//   npx remotion render src/index.ts CommunityReceipts out/pump-season-is-back/1-community-receipts.mp4 \
//     --public-dir "<repo>/video-creation/shorts/pump-season-is-back/community-receipts/render-assets"

export const CR_FPS = 30;
export const CR_DURATION = 3432; // 114.4s * 30

export const CLIP  = staticFile('community-receipts-full.mp4');
export const THUMB = staticFile('thumbnail.png');

// Layout geometry (measured from extracted frames)
export const CR_SEAM  = 848;   // screen-share (top) / face (bottom) seam; content-zone broll covers 0..SEAM
export const CR_CAP_Y = 866;   // caption centre — just below the seam, over Mike's hairline, never his eyes

// ─── B-roll beats ──────────────────────────────────────────────────────────────
// mode 'full' = whole frame (hook, 500x tease, mirror climax); 'zone' = top screen-share zone only
// (0..SEAM), Mike's face stays visible below. Adjacent beats butt together (hard cut, no base flash).
// NOTE: staticFile() calls are LITERAL strings on purpose — the finalized-short gate scans for
// literal staticFile('...') refs, so helper-built paths would be invisible to the definition-of-done.
export type CrBroll = { src: string; tIn: number; tOut: number; mode: 'full' | 'zone' };
export const BROLL_CR: CrBroll[] = [
  { src: staticFile('broll-psb-hook.png'),    tIn:   0.0, tOut:   3.3, mode: 'full' }, // "there's a coin pumping in my community"
  { src: staticFile('broll-psb-pump.png'),    tIn:   3.3, tOut:   9.2, mode: 'zone' }, // "nice pumps, up like 10x"
  { src: staticFile('broll-psb-pump.png'),    tIn:  11.0, tOut:  18.0, mode: 'zone' }, // "got in at the bottom"
  { src: staticFile('broll-psb-gains.png'),   tIn:  20.4, tOut:  25.0, mode: 'zone' }, // "up a 5x, 8x, 10x"
  { src: staticFile('broll-psb-mystery.png'), tIn:  26.4, tOut:  31.0, mode: 'zone' }, // "not gonna reveal it yet ha"
  { src: staticFile('broll-psb-pump.png'),    tIn:  34.0, tOut:  35.4, mode: 'zone' }, // "when it gets to 100x"
  { src: staticFile('broll-psb-500x.png'),    tIn:  35.4, tOut:  39.6, mode: 'full' }, // "i'm expecting a 500x" — OPEN-LOOP PEAK
  { src: staticFile('broll-psb-peanut.png'),  tIn:  39.6, tOut:  44.0, mode: 'zone' }, // "the peanut scenario"
  { src: staticFile('broll-psb-peanut.png'),  tIn:  49.5, tOut:  53.0, mode: 'zone' }, // "52x on peanut"
  { src: staticFile('broll-psb-gains.png'),   tIn:  55.0, tOut:  58.9, mode: 'zone' }, // "in the last 10 months"
  { src: staticFile('broll-psb-myx.png'),     tIn:  58.9, tOut:  60.5, mode: 'zone' }, // "550x on myx"
  { src: staticFile('broll-psb-deagent.png'), tIn:  60.5, tOut:  63.4, mode: 'zone' }, // "130x on deagent ai"
  { src: staticFile('broll-psb-tut.png'),     tIn:  63.4, tOut:  66.8, mode: 'zone' }, // "94x on tut"
  { src: staticFile('broll-psb-pippin.png'),  tIn:  66.8, tOut:  69.0, mode: 'zone' }, // "85x on pippin"
  { src: staticFile('broll-psb-bear.png'),    tIn:  69.0, tOut:  71.0, mode: 'zone' }, // "in the bear market in january"
  { src: staticFile('broll-psb-disco.png'),   tIn:  71.0, tOut:  74.4, mode: 'zone' }, // "disco we got a 47x"
  { src: staticFile('broll-psb-gains.png'),   tIn:  74.4, tOut:  77.5, mode: 'zone' }, // "whatever is in the last nine months"
  { src: staticFile('broll-psb-giggle.png'),  tIn:  77.5, tOut:  80.2, mode: 'zone' }, // "giggle fun we got a 30x"
  { src: staticFile('broll-psb-gains.png'),   tIn:  80.2, tOut:  86.7, mode: 'zone' }, // "puppies 15x, folks 10x"
  { src: staticFile('broll-psb-lab.png'),     tIn:  86.7, tOut:  90.9, mode: 'zone' }, // "it's like lab, 350x" — PEAK RECEIPT (real LAB ref)
  { src: staticFile('broll-psb-velvet.png'),  tIn:  90.9, tOut:  93.8, mode: 'zone' }, // "58x on velvet"
  { src: staticFile('broll-psb-pump.png'),    tIn:  94.9, tOut:  97.6, mode: 'zone' }, // "5 and 10x not even public yet"
  { src: staticFile('broll-psb-overpay.png'), tIn:  99.2, tOut: 106.5, mode: 'zone' }, // "paying double and not getting good calls"
  { src: staticFile('broll-psb-mirror.png'),  tIn: 108.5, tOut: 114.4, mode: 'full' }, // "man in the mirror... change my group" — CLIMAX
];

// ─── Multiplier badges (crisp code text over the beat; never baked into generated art) ──────
// One at a time, top zone (y~300) — never overlaps the caption band (y866) in space, never
// overlaps another badge in time. Numbers are Mike's spoken figures.
export type CrBadge = { tIn: number; tOut: number; big: string; sub: string; color: 'green' | 'yellow' };
export const BADGES_CR: CrBadge[] = [
  { tIn:  36.1, tOut:  39.5, big: '500X', sub: 'EXPECTED',    color: 'yellow' },
  { tIn:  50.3, tOut:  53.0, big: '52X',  sub: 'PEANUT',      color: 'green'  },
  { tIn:  59.0, tOut:  60.5, big: '550X', sub: 'MYX',         color: 'green'  },
  { tIn:  60.6, tOut:  63.4, big: '130X', sub: 'DEAGENT AI',  color: 'green'  },
  { tIn:  63.5, tOut:  66.8, big: '94X',  sub: 'TUT',         color: 'green'  },
  { tIn:  66.9, tOut:  69.0, big: '85X',  sub: 'PIPPIN',      color: 'green'  },
  { tIn:  72.7, tOut:  74.4, big: '47X',  sub: 'DISCO',       color: 'green'  },
  { tIn:  78.3, tOut:  80.2, big: '30X',  sub: 'GIGGLE FUN',  color: 'green'  },
  { tIn:  89.1, tOut:  90.9, big: '350X', sub: 'LAB',         color: 'green'  },
  { tIn:  91.0, tOut:  93.8, big: '58X',  sub: 'VELVET',      color: 'green'  },
];

// ─── SFX events ────────────────────────────────────────────────────────────────
// whoosh on the thumbnail cut + layout transitions, riser INTO the 500x tease + mirror climax,
// impacts on the big receipts, light dings on the machine-gun run. All under the VO (vol <= 0.55).
// Literal staticFile('sfx/...') strings (gate-visible; see the b-roll note above).
export type CrSfx = { t: number; src: string; vol: number; dur: number };
export const SFX_CR: CrSfx[] = [
  { t:   0.00, src: staticFile('sfx/whoosh.wav'),        vol: 0.50, dur: 1.6 }, // thumbnail cut -> hook reveal
  { t:   3.30, src: staticFile('sfx/whoosh-rapid.mp3'),  vol: 0.42, dur: 1.0 }, // hook full -> zone
  { t:   5.44, src: staticFile('sfx/ding.mp3'),          vol: 0.40, dur: 1.2 }, // "10x"
  { t:  26.55, src: staticFile('sfx/waitwhat.mp3'),      vol: 0.42, dur: 2.0 }, // "not gonna reveal it yet ha" (open loop)
  { t:  33.30, src: staticFile('sfx/riser.wav'),         vol: 0.38, dur: 2.9 }, // build into the tease
  { t:  36.04, src: staticFile('sfx/impact-big.wav'),    vol: 0.55, dur: 3.5 }, // "500x" reveal (biggest)
  { t:  50.18, src: staticFile('sfx/cash.mp3'),          vol: 0.46, dur: 1.6 }, // "52x on peanut" (kaching)
  { t:  58.90, src: staticFile('sfx/impact-kick.wav'),   vol: 0.50, dur: 2.0 }, // "550x myx" — start machine-gun
  { t:  60.50, src: staticFile('sfx/ding.mp3'),          vol: 0.40, dur: 1.0 }, // 130x deagent
  { t:  63.40, src: staticFile('sfx/ting.mp3'),          vol: 0.40, dur: 1.0 }, // 94x tut
  { t:  66.86, src: staticFile('sfx/ding.mp3'),          vol: 0.40, dur: 1.0 }, // 85x pippin
  { t:  72.60, src: staticFile('sfx/ting.mp3'),          vol: 0.40, dur: 1.0 }, // 47x disco
  { t:  78.22, src: staticFile('sfx/ding.mp3'),          vol: 0.40, dur: 1.0 }, // 30x giggle
  { t:  89.04, src: staticFile('sfx/impact-big.wav'),    vol: 0.55, dur: 3.2 }, // "350x lab" — PEAK receipt
  { t:  90.94, src: staticFile('sfx/ting.mp3'),          vol: 0.40, dur: 1.0 }, // 58x velvet
  { t: 107.50, src: staticFile('sfx/riser.wav'),         vol: 0.40, dur: 2.7 }, // build into the mirror climax
  { t: 110.20, src: staticFile('sfx/impact-boom.wav'),   vol: 0.50, dur: 3.0 }, // "damn" (mirror)
  { t: 113.74, src: staticFile('sfx/impact-kick.wav'),   vol: 0.46, dur: 1.6 }, // "change my group" (final button)
];

// ─── Captions ─────────────────────────────────────────────────────────────────
// Built via skills/captions/build_captions.py, then COIN-NAME corrected against Mike's own
// on-screen "Top Performing Assets" table (visible ~t90): MYX=552x, AIA/DeAgent=127x, TUT=94x,
// PIPPIN=89x, DISCO=47x, GIGGLE=30x, PUPPIES=15x, FOLKS=10x. Mike's SPOKEN rounded numbers kept.
// Colour spans (_kit.colourize): <gr>=green multiplier, <y>=yellow (the 500x tease).
export const CAPTIONS_CR: { t: number; h: string }[] = [
  { t:   0.00, h: 'there\'s a coin' },
  { t:   0.78, h: 'that\'s it\'s pumping' },
  { t:   2.06, h: 'today in my' },
  { t:   2.92, h: 'community.' },
  { t:   3.42, h: 'we got some nice pump' },
  { t:   4.46, h: 'pumps on it' },
  { t:   5.44, h: 'like up like <gr>10x</gr> we' },
  { t:   7.04, h: 'have a discussion' },
  { t:   7.66, h: 'today about' },
  { t:   9.38, h: 'you know when' },
  { t:  11.38, h: 'we in the' },
  { t:  12.40, h: 'group got into' },
  { t:  13.36, h: 'it like at the' },
  { t:  14.04, h: 'bottom and some' },
  { t:  15.40, h: 'of us got in' },
  { t:  16.08, h: 'lower than others' },
  { t:  16.86, h: 'and so on you know' },
  { t:  18.22, h: 'it\'s difficult at' },
  { t:  18.78, h: 'the time the' },
  { t:  19.12, h: 'bottom so some' },
  { t:  20.24, h: 'people are up' },
  { t:  20.82, h: 'like a <gr>5x</gr> or an' },
  { t:  22.16, h: '<gr>8x</gr> and they\'re' },
  { t:  23.16, h: 'like a <gr>10x</gr> and' },
  { t:  24.10, h: 'stuff like that' },
  { t:  25.06, h: 'and this coin is' },
  { t:  25.98, h: 'pumping right now' },
  { t:  26.64, h: 'i\'m not gonna' },
  { t:  27.22, h: 'reveal it' },
  { t:  28.70, h: 'yet ha' },
  { t:  31.14, h: 'you guys know i don\'t' },
  { t:  32.50, h: 'do that publicly' },
  { t:  33.44, h: 'when it gets to like' },
  { t:  34.26, h: '<gr>100x</gr> i\'ll let you know' },
  { t:  35.40, h: 'i\'m expecting a' },
  { t:  36.04, h: '<y>500x</y> of this' },
  { t:  37.58, h: 'particular one that\'s' },
  { t:  38.40, h: 'been pumping today' },
  { t:  39.10, h: 'for it.' },
  { t:  39.70, h: 'it\'s like the' },
  { t:  40.02, h: 'peanut scenario and' },
  { t:  40.96, h: 'i peanut we' },
  { t:  42.00, h: 'got peanut at' },
  { t:  42.66, h: 'the pump as well like' },
  { t:  43.90, h: 'i was like yeah i' },
  { t:  45.52, h: 'was like i' },
  { t:  46.08, h: 'think this is' },
  { t:  46.48, h: 'gonna do good.' },
  { t:  47.06, h: 'it\'s already pumping' },
  { t:  47.92, h: 'like hell but i\'m' },
  { t:  48.74, h: 'gonna buy into' },
  { t:  49.22, h: 'it and then i' },
  { t:  49.76, h: 'ended up doing' },
  { t:  50.18, h: 'a <gr>52x</gr> for my for' },
  { t:  51.54, h: 'my buy on' },
  { t:  52.14, h: 'peanut if you' },
  { t:  53.02, h: 'know of any' },
  { t:  53.64, h: 'other community that' },
  { t:  54.54, h: 'does all that we\'ve got' },
  { t:  55.48, h: 'in the last 10' },
  { t:  56.64, h: 'months for nine' },
  { t:  57.66, h: 'months or whatever' },
  { t:  58.30, h: 'right we\'ve got' },
  { t:  58.90, h: 'a <gr>550x</gr> on myx' },
  { t:  60.50, h: 'we did <gr>130x</gr> on' },
  { t:  62.58, h: 'deagent ai' },
  { t:  63.40, h: 'yeah, <gr>94x</gr> on' },
  { t:  65.64, h: 'tut' },
  { t:  66.86, h: 'we got an <gr>85x</gr> on' },
  { t:  68.36, h: 'pippin and that' },
  { t:  69.06, h: 'was just like in the' },
  { t:  70.20, h: 'bear market in' },
  { t:  71.08, h: 'january right disco' },
  { t:  72.60, h: 'we got a <gr>47x</gr> and' },
  { t:  74.40, h: 'like i\'m just' },
  { t:  74.88, h: 'talking about whatever' },
  { t:  75.64, h: 'is in the last nine' },
  { t:  76.96, h: 'months.' },
  { t:  77.54, h: 'we got giggle' },
  { t:  78.22, h: 'fun we got a <gr>30x</gr>' },
  { t:  80.24, h: 'puppies we did' },
  { t:  80.88, h: 'a <gr>15x</gr> folks' },
  { t:  82.20, h: 'finance with a' },
  { t:  82.82, h: '<gr>10x</gr>' },
  { t:  84.20, h: 'advances we did' },
  { t:  84.84, h: 'the <gr>10x</gr> minus' },
  { t:  85.70, h: 'we did <gr>10x</gr> and then' },
  { t:  86.70, h: 'it\'s like lab' },
  { t:  87.76, h: 'and then it\'s like lab' },
  { t:  89.04, h: 'we got a <gr>350x</gr> just' },
  { t:  90.48, h: 'like a month' },
  { t:  90.94, h: 'ago got the <gr>58x</gr> on' },
  { t:  92.84, h: 'velvet' },
  { t:  93.84, h: 'and we\'re getting' },
  { t:  94.26, h: 'all these like' },
  { t:  94.90, h: 'five and <gr>10x</gr> is here' },
  { t:  95.94, h: 'in there that' },
  { t:  96.34, h: 'are not even' },
  { t:  96.76, h: 'public yet so' },
  { t:  97.62, h: 'i mean if' },
  { t:  98.70, h: 'you\'re in a' },
  { t:  99.18, h: 'group and you\'re' },
  { t: 100.04, h: 'paying for it' },
  { t: 100.72, h: 'and you\'re paying' },
  { t: 101.12, h: 'double the amount' },
  { t: 101.94, h: 'of money of' },
  { t: 102.48, h: 'my community and' },
  { t: 103.64, h: 'you\'re not getting' },
  { t: 104.20, h: 'that many that many good' },
  { t: 105.56, h: 'calls man i' },
  { t: 106.56, h: 'don\'t know man.' },
  { t: 107.18, h: 'you got to take a' },
  { t: 107.80, h: 'hard look at that man' },
  { t: 109.34, h: 'in the mirror and' },
  { t: 110.20, h: 'be like damn.' },
  { t: 111.38, h: 'i\'m thinking i\'m' },
  { t: 112.66, h: 'gonna change my' },
  { t: 113.74, h: 'group' },
];

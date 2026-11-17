import { staticFile } from 'remotion';
import { type BrollEv, type Sfx } from './_kit';
import type { ThumbDef, BadgeEv, OverlayEv } from './LivestreamShort';

// ─────────────────────────────────────────────────────────────────────────────────────────────
// batch peach / clip #5 - `dumping-and-im-buying` (variant: FULL)
// clip-plan title: "We've Been Dumping and I've Been Buying"
// Spine: shorts/peach/render-assets/dumping-and-im-buying.mp4 (1080x1920 @25, video 48.920 s, audio 48.927 s, GOP re-encoded).
// Plan of record: shorts/peach/dumping-and-im-buying/BROLL-PLAN.md
// Build directives for clip 5 (clip_directives.py --batch peach --clip 5): none. No coverage exemption.
// Flat-namespace check 2026-11-16: no existing PeachDumpingImBuying / PCH5_ / broll-pch5 / thumb-pch5.
// ─────────────────────────────────────────────────────────────────────────────────────────────

export const PCH5_FPS = 30;
// 1467 frames = 48.900 s; last frame (1466) at 48.867 s sits inside both tracks (video 48.920, audio 48.927).
export const PCH5_DURATION = 1467;
const END = PCH5_DURATION / PCH5_FPS;
// MEASURED: row-mean gradient step at 853/854 on t=3,15,40 s.
export const PCH5_SEAM = 854;
export const PCH5_CAP_Y = 900;
export const PCH5_ACCENT = '#28a0f0'; // Arbitrum blue
const YEL = '#ffe600';
const RED = '#ff4444';
const RH_GREEN = '#00c805'; // Robinhood green
const GREEN = '#39ff14';

export const CLIP_PCH5 = staticFile('dumping-and-im-buying.mp4');

// FRAME-0 COVER (ONE frame): crash storm, one calm figure scooping a Litecoin + an Arbitrum coin; title code-drawn.
export const THUMB_DEF_PCH5: ThumbDef = {
  img: staticFile('thumb-pch5-dump-buy.png'),
  title: "EVERYONE'S\nDUMPING.\nI'M BUYING",
  chip: 'LITECOIN AT $45. ARBITRUM 10X?',
  chipColor: PCH5_ACCENT,
  titleSize: 118,
};

// B-ROLL: 2.92 + 3.16 + 3.48 + 2.70 + 3.40 = 15.66 s of 48.90 s = 32.0 % b-roll / 68.0 % base. 5 images, each once.
// 2 full-screens (hook, climax), cap is 3. No two full-screens near each other (no base flash).
export const BROLL_PCH5: BrollEv[] = [
  // HOOK full-screen: "and i've been buying a whole bunch of plays"
  { src: staticFile('broll-pch5-buying-the-dump.png'), tIn: 3.30, tOut: 6.22, mode: 'full' },
  // "litecoin right now is an optional privacy coin" - content zone
  { src: staticFile('broll-pch5-ltc-privacy.png'), tIn: 11.46, tOut: 14.62, mode: 'content' },
  // "i got into this again after all these years. i was shocked that i did it" - content zone
  { src: staticFile('broll-pch5-ltc-after-years.png'), tIn: 18.30, tOut: 21.78, mode: 'content' },
  // "arbitrum. tokenized assets narrative" - content zone
  { src: staticFile('broll-pch5-arb-tokenized.png'), tIn: 33.36, tOut: 36.06, mode: 'content' },
  // CLIMAX full-screen: "what if it goes to 10 billion? you got a 10x. relatively safe". Holds past END (no base flash at the end).
  { src: staticFile('broll-pch5-arb-10x.png'), tIn: 45.50, tOut: END + 0.3, mode: 'full' },
];

export const OVERLAYS_PCH5: OverlayEv[] = [];

// Code-drawn badges, each alone in its window, none under the frame-0 cover (all tIn > 1 frame).
export const BADGES_PCH5: BadgeEv[] = [
  // over the dumping BTC chart (base)
  { tIn: 7.62, tOut: 9.40, color: RED, line1: 'REALLY', line2: 'LOW PRICES', top: 400 },
  // over the CMC Litecoin page (base): the number he says
  { tIn: 27.10, tOut: 30.34, color: YEL, line1: '$45', sub: 'LITECOIN RIGHT NOW', top: 400 },
  // over the CMC Arbitrum page (base)
  { tIn: 36.20, tOut: 38.90, color: RH_GREEN, line1: 'ROBINHOOD', sub: 'USES ARBITRUM TECH', top: 400 },
  // over the CMC Arbitrum page (base): "it was 900 million at arbitrum"
  { tIn: 43.98, tOut: 45.44, color: PCH5_ACCENT, line1: '$900M', sub: 'ARBITRUM MARKET CAP', top: 400 },
  // over the climax image (no text in it); runs past END so it holds to the last frame
  { tIn: 47.08, tOut: END + 0.3, color: GREEN, line1: '10X', sub: 'RELATIVELY SAFE', top: 400 },
];

// SFX: every `t` = cue - crest so the crest lands on the cut/badge frame, in the word gap where there is one.
// Crests (library.json attack_sec, as used by siblings): transition_rapid_whoosh-tight 0.165 · card-impact-layered 0.030
//   DING-093 0.150 · Cash Register-ching 0.120 · Riser Sound Effect-2s 2.015 · Boom - Big Reveal-short 0.030
export const SFX_PCH5: Sfx[] = [
  // frame-0 cover cut to the base
  { t: 0.00, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.30 },
  // hook full-screen hit (3.30, between "dumping" and "and")
  { t: 3.27, src: staticFile('sfx/Impacts/card-impact-layered.wav'), vol: 0.16, dur: 0.70, fade: 0.25 },
  // "really low prices" badge (7.62, between "prices" and "really")
  { t: 7.47, src: staticFile('sfx/DING-093.wav'), vol: 0.10, dur: 0.45 },
  // whoosh into the Litecoin cutaway (11.46)
  { t: 11.295, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.30 },
  // ching on the $45 badge (27.10, between "now" and "that's")
  { t: 26.98, src: staticFile('sfx/Cash Register-ching.wav'), vol: 0.12, dur: 0.60, fade: 0.2 },
  // whoosh into the Arbitrum cutaway (33.36)
  { t: 33.195, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.30 },
  // riser builds INTO the climax: crest lands on the 45.50 cut
  { t: 43.485, src: staticFile('sfx/Riser Sound Effect-2s.wav'), vol: 0.30, dur: 2.10 },
  // THE payoff boom on the climax cut (45.50, between "arbitrum" and "what")
  { t: 45.47, src: staticFile('sfx/Boom - Big Reveal-short.wav'), vol: 0.18, dur: 0.90, fade: 0.3 },
];

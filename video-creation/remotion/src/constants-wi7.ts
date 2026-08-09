// constants-wi7.ts — batch `what-if-1000x`, clip #7 `whatif-100x-impact` (variant: short, impact cut).
//
// Spine: whatif-100x-impact-tightened-desilenced.mp4 (1080x1920, 25 fps source, 12.567 s), copied
// into THIS CLIP's own render-assets/ as `whatif-100x-impact.mp4` (md5-identical to the spine).
// Rendered through the shared `LivestreamShort` component with
//   --public-dir video-creation/shorts/what-if-1000x/whatif-100x-impact/render-assets
// (the per-CLIP public dir every sibling in this batch uses; an earlier run mis-landed these assets
// at the BATCH root, which publish-shorts.py + cleanup both walk — reconciled 2026-08-03.)
//
// Measured seam (screen-share / webcam divider) for THIS clip = 854 px (row-gradient scan, frames
// 0.5 / 6.0 / 12.0 s all agree). Base content zone = the live DexScreener IF/WETH ($WHATIF) chart
// ripping upward, so BASE SHOWING is the deliberate default state of this clip.
// Captions sit at capY 900 (just below the seam) so they clear the burned-in stream-chat overlay
// that lives at y ~724-780 in this clip's content zone, and stay far above his eyes (~1180).
//
// B-roll budget (canonical: video-creation/SKILL.md "B-roll coverage budget (HALVED 2026-07-14)"):
//   3 distinct images / 4.253 s of b-roll = 33.8 % b-roll, 66.2 % base showing (band 25-35 % / 65-75 %).
//   2 full-screen beats (transition + climax), inside the FIRM 1-3 cap.
// Plan of record: video-creation/shorts/what-if-1000x/whatif-100x-impact/BROLL-PLAN.md
//
// The abrupt ending is DELIBERATE (watch-time strategy): no CTA, no outro card, no tail beat after
// the final spoken word at 12.30 s. The climax b-roll `tOut` is parked PAST the last rendered frame
// (12.533 s) so it never fades out and ghosts the artwork back over his face.
import { staticFile } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Montserrat';
import type { ShortData } from './LivestreamShort';

// Register Montserrat 900 (the caption/badge/thumb weight) so this comp does not depend on some
// other comp in the bundle having loaded it as a side effect.
loadFont('normal', { weights: ['900'], subsets: ['latin'], ignoreTooManyRequestsWarning: true });

export const WI7_FPS = 30;
export const WI7_DURATION_S = 12.567;
export const WI7_FRAMES = 377; // 12.567 s @30 fps (last rendered frame 376 = 12.533 s)

// Built by the canonical caption skill (`montserrat` preset), verbatim:
//   python video-creation/skills/captions/build_captions.py \
//     --words video-creation/shorts/what-if-1000x/whatif-100x-impact/whisper-words.json \
//     --style montserrat --var CAPTIONS_WI7 --colorize "gr=100x,bigger y=1.97,billion,2"
// Post-fix: merged the split `<y>2</y> <y>billion.</y>` tags into one span (render-identical).
// STT/persona pass, each fix VERIFIED against THIS clip's whisper-words.json before applying:
//   - spoken "hundred x" ALREADY transcribes as `100x` (words at 0.70 and 11.44) - nothing to fix.
//   - the Brett figure reads "1.97 billion" on screen and "$1.97 BILLION" on the badge/cover: one form.
//   - no `tau` and no Casper/Kasper token exists in this clip's transcript (fix not applicable).
//   - no em dashes anywhere on screen.
export const CAPTIONS_WI7: { t: number; h: string }[] = [
  { t:  0.00, h: 'i think it' },
  { t:  0.60, h: 'could <gr>100x</gr> from' },
  { t:  1.38, h: 'here.' },
  { t:  1.90, h: 'brett made it' },
  { t:  2.42, h: 'to a <y>1.97</y>' },
  { t:  3.96, h: '<y>billion</y> market cap.' },
  { t:  5.34, h: 'and then this' },
  { t:  5.78, h: 'thing is for' },
  { t:  6.36, h: 'many reasons that' },
  { t:  7.06, h: 'i just explained' },
  { t:  7.68, h: 'is going to' },
  { t:  8.04, h: 'be <gr>bigger</gr> than' },
  { t:  8.68, h: 'brett.' },
  { t:  8.92, h: 'and brett went' },
  { t:  9.38, h: 'to <y>2 billion.</y>' },
  { t: 10.14, h: 'so you\'re talking' },
  { t: 11.20, h: 'like <gr>100x</gr> from here.' },
];

export const D_WI7: ShortData = {
  clip: staticFile('whatif-100x-impact.mp4'),
  fps: WI7_FPS,
  durationS: WI7_DURATION_S,
  capY: 900,
  seam: 854,
  captions: CAPTIONS_WI7,

  // BASE beats (no image, deliberate - the live $WHATIF chart IS the visual):
  //   0.00-1.85 hook over the chart ripping | 3.62-7.95 the "for many reasons" build
  //   8.95-11.05 "and brett went to 2 billion"
  broll: [
    // full-screen: the precedent someone already climbed. NO Brett branding (no reference exists on
    // disk), so the figure is carried by the code-drawn badge, never an invented logo.
    { src: staticFile('broll-wi7-brett-peak.png'), tIn: 1.85, tOut: 3.62, mode: 'full' },
    // content-zone: the REAL $WHATIF art (ref schedule-tweets/images/reference/what-if.jpg).
    { src: staticFile('broll-wi7-bigger.png'), tIn: 7.95, tOut: 8.95, mode: 'content' },
    // full-screen climax: the $WHATIF payoff. tOut past the last rendered frame (12.533 s) on
    // purpose so the payoff never fades out over the hard-out.
    { src: staticFile('broll-wi7-climax.png'), tIn: 11.05, tOut: 12.75, mode: 'full' },
  ],

  // Overlay collision rule (time AND space):
  //   watermark plate  y  26-190  (always; the ONLY graphic allowed over the frame-0 cover)
  //   badge 1          y 219-481, t 2.85-5.30
  //   alpha overlay    y 435-715, t 5.55-7.60   <- starts AFTER badge 1 is fully gone (5.40)
  //   badge 2          y 234-426, t 11.25-12.75
  //   captions         y ~845-955, always
  // No two timed graphics share a window; nothing starts under the frame-0 thumb (0.033 s).
  badges: [
    // `Badge` is capped at ~540 px wide (absolute box at left:50% inside 1080), so line1 must stay
    // <= ~10 chars at fontSize 60 or it wraps: 'BRETT PEAKED AT' wrapped to two lines in the draft.
    { tIn: 2.85, tOut: 5.30, color: '#3aa0ff', line1: 'BRETT HIT', line2: '$1.97 BILLION', sub: 'MARKET CAP', top: 350 },
    { tIn: 11.25, tOut: 12.75, color: '#39ff14', line1: '100X', sub: 'FROM HERE', top: 330 },
  ],

  // Real transparent overlay (true alpha PNG, alpha-from-luminance per SKILL "B-ROLL IMAGE
  // GENERATION RULES") so the clip is not carried by code-drawn plates alone. Sits over the
  // low-value transactions table, never over the chart, the burned-in stream-chat bar (MEASURED at
  // y 728-780 on this clip) or the captions. 1425x950 (3:2) art at width 420 => 280 px tall, so the
  // box is y 435-715 and even at the extreme of the +-10 px float it clears the chat bar.
  overlays: [
    { src: staticFile('overlay-wi7-green-surge.png'), tIn: 5.55, tOut: 7.60, top: 435, left: 330, width: 420, blend: 'normal' },
  ],

  // SFX (video-creation/assets/sfx/, COPIED into render-assets/sfx/). Every cue is started EARLY by
  // that file's own MEASURED peak offset so its crest lands on the frame it punctuates:
  //   transition_rapid_whoosh 0.175 | Cinematic Whoosh 02 0.867 | Impact_Hit_01-2 0.146
  //   Cinematic Whoosh 06 0.601     | Boom - Big Reveal 0.041
  // VO runs wall-to-wall here, so every cue is mixed low and the FINAL MIX is whisper-verified.
  sounds: [
    { t:  0.000, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.32, dur: 0.97 }, // crest 0.18 - frame-0 cover cut
    { t:  0.983, src: staticFile('sfx/Cinematic Whoosh 02.wav'),     vol: 0.26, dur: 2.24 }, // crest 1.85 - cut to the precedent full-screen
    { t:  2.704, src: staticFile('sfx/Impacts/Impact_Hit_01-2.wav'), vol: 0.24, dur: 2.40 }, // crest 2.85 - $1.97 BILLION badge reveal
    { t:  5.375, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.15, dur: 0.97 }, // crest 5.55 - alpha overlay pop
    { t:  7.349, src: staticFile('sfx/Cinematic Whoosh 06.wav'),     vol: 0.22, dur: 2.10 }, // crest 7.95 - "bigger than brett" cutaway
    { t: 11.009, src: staticFile('sfx/Boom - Big Reveal.wav'),       vol: 0.24, dur: 1.60 }, // crest 11.05 - climax / the 100x payoff
  ],

  // FRAME-0 COVER ONLY: no durS -> the component default of 1/fps (one frame).
  // Number-first hook, deliberately NOT clip 2's cover ("WHATIF COULD / 100X / FROM HERE").
  thumb: {
    img: staticFile('thumb-wi7-cover.png'),
    title: 'BRETT DID\n$1.97\nBILLION',
    chip: '$WHATIF IS NEXT',
    chipColor: '#39ff14',
    titleSize: 140,
  },

  // Real $WHATIF token art as the persistent corner brand mark (the watermark is the only graphic
  // allowed over the frame-0 cover).
  logo: {
    src: staticFile('logo-wi7-whatif.jpg'),
    glow: '#39ff14',
    watermark: { width: 156, top: 26, left: 26 },
  },
};

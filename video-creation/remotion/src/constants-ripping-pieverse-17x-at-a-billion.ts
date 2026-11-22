import { staticFile } from 'remotion';
import { type BrollEv, type Sfx } from './_kit';
import type { BadgeEv, OverlayEv } from './LivestreamShort';

// ─────────────────────────────────────────────────────────────────────────────────────────────
// batch ripping / clip #1 - `pieverse-17x-at-a-billion` (variant: FULL)
// clip-plan title: "Pieverse Just Hit a Billion. That Is 17.5x From My Call"
// "If you got into Pieverse when I called it, earlier this year, you'd be up over 17x, man. Ooh! Look at that, and I
//  called it way back over here. My bot called it at a 20 million market cap... I bought it down in here and then
//  look what happened. We're doing this right now. Holy guacamole, dude. So it's like 1.05 billion, right? ...
//  divided by 60 because it was 60 million market cap. So is that a 17.5x? Holy guacamole, dude."
// Spine: shorts/ripping/render-assets/pieverse-17x-at-a-billion.mp4 (1080x1920 @25, video 1106 f = 44.24 s, audio 44.54 s).
// Plan of record: shorts/ripping/pieverse-17x-at-a-billion/BROLL-PLAN.md (stage-2 remaps recorded there).
// Build directives for clip 1 (clip_directives.py --batch ripping --clip 1): none. No coverage exemption.
// Flat-namespace check 2026-11-18: no existing RippingPieverse17x / RIP1_ / constants-ripping-pieverse-17x in
// remotion/src or Root.tsx (the 2026-11-14 longform `Pieverse` / `PieverseShort` comps are a different project).
// ─────────────────────────────────────────────────────────────────────────────────────────────

// render_short.py renders and verifies at 30 fps; the 25 fps spine is resampled by OffthreadVideo.
export const RIP1_FPS = 30;
// 1327 frames = 44.233 s; last frame (1326) at 44.20 s sits inside both tracks (video 44.24, audio 44.54).
export const RIP1_DURATION = 1327;
// MEASURED on this spine: row-mean gradient step at the 853/854 boundary on 13 of 13 frames (t=1..43).
export const RIP1_SEAM = 854;
// Caption band just under the seam: forehead/hair, the eyes sit at y~1200.
export const RIP1_CAP_Y = 960;
export const RIP1_ACCENT = '#00e5ff';
const YEL = '#ffe600';
const TEAL = '#00e5ff';

export const CLIP_RIP1 = staticFile('pieverse-17x-at-a-billion.mp4');

// FRAME-0 COVER (ONE frame), drawn by the comp (title block at the top of the clean sky, above the cat's ears at
// y~580 and left of the raised coin). Pieverse mascot on a rocketing green candle, gold coin high. pieverse.jpg ref.
export const THUMB_IMG_RIP1 = staticFile('broll-rip1-thumb.png');

// B-ROLL (images): 2.80 + 3.00 + 2.20 + 2.233 = 10.23 s of 44.23 s = 23.1 % generated images, + the code-drawn
// radar card 2.85 s (14.25-17.10, opaque over the whole content zone) = 13.08 s = 29.6 % of the runtime with the
// content zone covered; 70.4 % base. Full-screens: 2 (hook + climax), 37 s apart.
// STAGE-2 REMAPS (visual-qa round 2 FAIL, never regenerated here):
//   B3 broll-rip1-bot-radar.png  -> code-drawn RadarCard in the comp (same beat, same window, the bot + $20M as type)
//   B5 broll-rip1-guacamole.png  -> base-showing beat (the Pieverse pump he has just pointed at)
// B2 extended 9.45 -> 9.75: the base under it is still the off-message pippin page until ~9.8.
export const BROLL_RIP1: BrollEv[] = [
  // HOOK full-screen: "Pieverse when I called it" - the mascot shouting the call into a megaphone over the city.
  { src: staticFile('broll-rip1-hook-call.png'), tIn: 2.25, tOut: 5.05, mode: 'full' },
  // "you'd be up over 17x, man" - the mascot riding a green candle rocket through the clouds.
  { src: staticFile('broll-rip1-17x-ride.png'), tIn: 6.75, tOut: 9.75, mode: 'content' },
  // "it looks pretty good. I don't want to buy it because it's going up" - arms crossed, side-eye at the escalator.
  { src: staticFile('broll-rip1-hesitate.png'), tIn: 21.10, tOut: 23.30, mode: 'content' },
  // CLIMAX full-screen: the second "Holy guacamole, dude" after the 17.5x math. tOut past the last frame (44.20) so
  // BrollLayer's 0.12 s fade-out never starts: it holds fully opaque to the end.
  { src: staticFile('broll-rip1-climax-summit.png'), tIn: 42.00, tOut: 44.40, mode: 'full' },
];

// CODE-DRAWN RADAR CARD (remap of B3): covers 0..seam, "My bot called it at a 20 million market cap".
export const RADAR_RIP1 = { tIn: 14.25, tOut: 17.10 };

// ALPHA OVERLAY (glow-on-black -> alpha-from-luminance in place, cropped to its bbox 1234x820, true RGBA -> blend
// 'normal'). "and then look what happened": over the Social Insights column right of the chart, x 800-1070,
// y 120-300, so the dip he points at (left/centre of the chart, x 200-700) stays visible.
export const OVERLAYS_RIP1: OverlayEv[] = [
  { src: staticFile('broll-rip1-rocket-glow.png'), tIn: 26.00, tOut: 27.80, top: 120, left: 800, width: 270, blend: 'normal' },
];

// BADGES (kit Badge, centred). K1 sits low in the content zone (y ~560-720) over the "CMC AI / Pieverse Markets"
// rows, under the chart, above the caption band (~900-1020).
export const BADGES_RIP1: BadgeEv[] = [
  { tIn: 17.40, tOut: 19.30, color: TEAL, line1: 'ALERTS FIRING', sub: 'MESSAGE AFTER MESSAGE', top: 640 },
];

// LEFT-COLUMN STAMPS (code-drawn by the comp, x 26-456): the calculator window sits at x 510-1060, y 100-854 and its
// readout (1,050 / 60 / 17.5) at x 840-1040, y ~250-340, so nothing here ever touches it.
//   K2 "BOUGHT AT $60M" on "because it was 60 million market cap".
//   K3 "17.5X" lands in the 1.4 s pause AFTER "is that a 17.5x?" (40.72), with the ching: never over the number.
export const STAMPS_RIP1 = [
  { tIn: 36.30, tOut: 37.95, color: YEL, line1: 'BOUGHT AT', big: '$60M', top: 470 },
  { tIn: 40.75, tOut: 41.92, color: YEL, line1: 'THAT IS A', big: '17.5X', top: 470 },
];

// SFX: every `t` = cue - attack_sec (library.json) so the crest lands on the event frame.
//   transition_rapid_whoosh 0.18 · -tight 0.18 · Cinematic Whoosh 06 0.59 · MGS Alert 0.44 · Riser-2s 2.02
//   DING-093 0.15 · Cash Register-ching 0.12 · Kick_Impact_01-short 0.19
export const SFX_RIP1: Sfx[] = [
  // frame-0 cover cut to the base
  { t: 0.033, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.12, dur: 1.00 },
  // hook full-screen in (2.25): soft cinematic whoosh rising under the held "into"
  { t: 1.66, src: staticFile('sfx/Cinematic Whoosh 06.wav'), vol: 0.22, dur: 1.10, fade: 0.3 },
  // whoosh into the 17x ride cutaway (6.75)
  { t: 6.57, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.10, dur: 0.42 },
  // the bot alert: radar card in (14.25), in the gap after "over here." (14.16) before "My" (14.44)
  { t: 13.81, src: staticFile('sfx/MGS Alert.mp3'), vol: 0.09, dur: 0.75, fade: 0.2 },
  // whoosh into the hesitate cutaway (21.10)
  { t: 20.92, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.10, dur: 0.42 },
  // riser under "look what happened": crest at 27.30, after "happened." (27.26), with the rocket up
  { t: 25.28, src: staticFile('sfx/Riser Sound Effect-2s.wav'), vol: 0.35, dur: 2.14 },
  // $60M stamp (36.30)
  { t: 36.15, src: staticFile('sfx/DING-093.wav'), vol: 0.08, dur: 0.60, fade: 0.2 },
  // THE payoff: 17.5X stamp in the pause after the question (40.75)
  { t: 40.63, src: staticFile('sfx/Cash Register-ching.wav'), vol: 0.14, dur: 0.77 },
  // climax full-screen cut (42.00)
  { t: 41.81, src: staticFile('sfx/Impacts/Kick_Impact_01-short.wav'), vol: 0.16, dur: 0.55 },
];

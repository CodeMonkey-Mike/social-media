// kaspa-cocktails clip 4 `kcc20-nacho-migration-is-live` (FULL, 36.44 s video stream): composition data.
// Batch kaspa-cocktails (livestream 2026-11-02). Plan: shorts/kaspa-cocktails/kcc20-nacho-migration-is-live/BROLL-PLAN.md
// Public dir: shorts/kaspa-cocktails/render-assets. Spine is 25 fps; the comp runs at 30 fps.
// Seam MEASURED (row-gradient scan, t = 1 / 12 / 20 / 31.5 / 35 s): content rows 0..853, webcam from 854 -> SEAM 855.
// Segment joins MEASURED (content-zone frame diff): 9.64 / 16.20 / 30.40 / 34.08 s.
import { staticFile } from 'remotion';
import type { BrollEv, Sfx } from './_kit';
import type { BadgeEv, OverlayEv, RedactEv, ThumbDef } from './LivestreamShort';

export const KC4_FPS = 30;
export const KC4_DURATION_S = 36.43;
export const KC4_DURATION_FRAMES = 1093; // floor(36.44 s video stream * 30): never past the last spine frame
export const KC4_SEAM = 855;
export const KC4_CAP_Y = 880;
export const KC4_ACCENT = '#00e5ff'; // Kaspa teal: Nacho the Kat lives on Kaspa

export const KC4_CLIP = staticFile('kcc20-nacho-migration-is-live.mp4');

// 2 full-screens (hook, climax) + 2 content-zone cutaways, each tied to one talking point:
// full 3.19 + 2.51 = 5.70 s; content 3.26 + 3.64 = 6.90 s; 12.60 s of 36.43 s = 34.6 % b-roll / 65.4 % base (band 25-35 %).
// Base keeps the Nacho X post (the RECEIPT Mike reads: "NACHO MIGRATION IS LIVE", the deadline, "unmigrated tokens will
// not be eligible") and Mike's own channel page with his KCC20 video ("I was making this video about KCC20") on screen.
export const KC4_BROLL: BrollEv[] = [
  // hook: "KRC20 to KCC20 is live" (in at the 2.03-2.08 trough after "Nacho migration is live.", out after "KCC20" ends 5.22)
  { src: staticFile('broll-kc4-hook-launch.png'), tIn: 2.05, tOut: 5.24, mode: 'full' },
  // "Anybody got some Nacho, you want to bridge it over to the KCC20" (in at the 22.62 crest of its whoosh, the 22.64-22.69 trough, out at 25.84-25.94)
  { src: staticFile('broll-kc4-bridge.png'), tIn: 22.62, tOut: 25.92, mode: 'content' },
  // "But the good things are coming, right? Pretty soon. Good things are coming." Covers Mike's off-message channel page
  // (spine 30.40-34.08). tIn 30.28 so the 0.12 s fade-in is complete before the 30.40 join. Hard cut into the climax.
  { src: staticFile('broll-kc4-good-things.png'), tIn: 30.28, tOut: 33.92, mode: 'content' },
  // climax: "They're gonna pump like hell. We're still very, very early." (in at the 33.88-33.96 word gap). tOut past the
  // 36.43 end so the fade-out never ghosts the base through the last frames (clip 1's measured lesson).
  { src: staticFile('broll-kc4-climax-pump.png'), tIn: 33.92, tOut: 36.65, mode: 'full' },
];

// Burned-in VIEWER CHAT (MEASURED: handle pill "@Thorhammer-25" x 0-163 / y 704-734, message "40K!!!!!!" below it) shows
// ONLY in the two segments lifted from 21 min (spine 9.64-16.20 and 30.40-end; the X-post segments carry no chat).
// Message text stays (harmless hype), only the handle pill is plated: the batch precedent from clips 1 and 3.
// Painted UNDER the b-roll. Plate 1 edges MEASURED on the render: the chat segment is comp frames 289-484 (9.633-16.133 s),
// so 9.62 / 16.16 (was 9.6 / 16.25: the plate sat over the chat-free X post on frames 288 and 485-487, fixed by splice).
export const KC4_REDACTIONS: RedactEv[] = [
  { tIn: 9.62, tOut: 16.16, top: 699, height: 40, left: 0, width: 200 },
  { tIn: 30.35, tOut: 36.7, top: 699, height: 40, left: 0, width: 200 },
];

// Badge band: 2-line box ~215 px tall centred at `top` 430 -> spans ~322-538: above the chat plate (699) and the caption
// band (capY 880). Strictly sequential; every badge renders until tOut + 0.1 s and every tOut + 0.1 lands BEFORE the next
// b-roll tIn (no badge on top of an image). NBSP keeps each line one run (clip 3 measured plain spaces wrapping).
export const KC4_BADGES: BadgeEv[] = [
  { tIn: 6.55, tOut: 9.3, color: '#00e5ff', line1: 'KCC20 IS LIVE', line2: 'ON KASPA L1', top: 430 },
  { tIn: 11.6, tOut: 14.2, color: '#39ff14', line1: 'WENT LIVE', line2: 'THE SAME DAY', top: 430 },
  { tIn: 16.13, tOut: 18.95, color: '#ff9f1c', line1: 'DEADLINE', line2: 'JANUARY 31', top: 430 },
  { tIn: 19.6, tOut: 22.3, color: '#ff5252', line1: 'UNMIGRATED =', line2: 'NOT ELIGIBLE', top: 430 },
  { tIn: 26.75, tOut: 29.9, color: '#39ff14', line1: 'BRIDGE YOUR', line2: 'NACHO TO KCC20', top: 430 },
];

export const KC4_OVERLAYS: OverlayEv[] = [];

// t = crest - attack_sec (sfx library.json) so each crest lands in a MEASURED RMS trough between words.
export const KC4_SOUNDS: Sfx[] = [
  { t: 0.0, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.35, dur: 0.42 },     // cover cut (frame 1)
  { t: 2.02, src: staticFile('sfx/Boom - Big Reveal-short.wav'), vol: 0.32, dur: 0.3 },           // hook full-screen, crest 2.05
  { t: 6.53, src: staticFile('sfx/kinetic-text/knock-pop.wav'), vol: 0.28, dur: 0.25 },           // KCC20 IS LIVE badge (trough 6.52-6.56)
  { t: 15.98, src: staticFile('sfx/DING-093.wav'), vol: 0.24, dur: 0.3, fade: 0.1 },              // DEADLINE badge, crest 16.13 (trough 16.11-16.15)
  { t: 19.59, src: staticFile('sfx/kinetic-text/knock-pop.wav'), vol: 0.26, dur: 0.25 },          // NOT ELIGIBLE badge (trough 19.58-19.63)
  { t: 22.44, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.3, dur: 0.3 },     // bridge cutaway, crest 22.62 (was 22.66 / dur 0.42: dropped "anybody got some nacho" in 1/3 windows; moved 40 ms earlier + tail cut = control 5/5)
  { t: 26.74, src: staticFile('sfx/kinetic-text/knock-pop.wav'), vol: 0.24, dur: 0.25 },         // BRIDGE badge (trough 26.73-26.78). Was DING-093 crest 26.75: dropped "protocol on the" in 2/3 windows on the render; knock-pop = control 5/5
  { t: 30.22, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.3, dur: 0.42 },    // good-things cutaway, crest 30.40
  { t: 33.89, src: staticFile('sfx/Boom - Big Reveal-short.wav'), vol: 0.32, dur: 0.25 },         // climax full-screen, crest 33.92
];

export const KC4_THUMB: ThumbDef = {
  title: '<span style="color:#00e5ff">NACHO</span>\nMIGRATION\nIS <span style="color:#39ff14">LIVE</span>',
  chip: 'MIGRATE BEFORE JAN 31',
  chipColor: '#ff9f1c',
  titleSize: 140,
  img: staticFile('thumb-kc4-cover.png'),
};

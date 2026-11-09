// kaspa-cocktails clip 6 `kaspa-3-dollars-is-bearish-impact` (IMPACT, 25.96 s video stream): composition data.
// Batch kaspa-cocktails (livestream 2026-11-02). Plan: shorts/kaspa-cocktails/kaspa-3-dollars-is-bearish-impact/BROLL-PLAN.md
// Public dir: shorts/kaspa-cocktails/render-assets. Spine is 25 fps; the comp runs at 30 fps.
// Seam MEASURED at t = 12 s (row means): content rows 0..853, webcam from 854/855 -> SEAM 855.
// Every image is clip-6-only (`kc6`): the no-duplicate rule vs clip 1 (same topic, same batch).
import { staticFile } from 'remotion';
import type { BrollEv, Sfx } from './_kit';
import type { BadgeEv, OverlayEv, RedactEv, ThumbDef } from './LivestreamShort';

export const KC6_FPS = 30;
export const KC6_DURATION_FRAMES = 778; // floor(25.96 s video stream * 30): never past the last spine frame
export const KC6_DURATION_S = KC6_DURATION_FRAMES / KC6_FPS; // 25.933
export const KC6_SEAM = 855;
export const KC6_CAP_Y = 880;
export const KC6_ACCENT = '#00e5ff'; // Kaspa teal: this is a Kaspa clip

export const KC6_CLIP = staticFile('kaspa-3-dollars-is-bearish-impact.mp4');

// 2 full-screens (hook + climax) + 2 content-zone cutaways, each tied to one talking point. In/out points sit in
// MEASURED RMS troughs of the spine. full 1.74 + 2.68 = 4.42 s; content 2.79 + 1.56 = 4.35 s;
// 8.77 s of 25.93 s = 33.8 % b-roll / 66.2 % base (band 25-35 %). Base keeps the Top Performing Assets table on screen.
export const KC6_BROLL: BrollEv[] = [
  // hook: "crypto is going to be absolutely huge." (in at the 1.62 trough, out at the 3.33-3.37 trough after "huge")
  { src: staticFile('broll-kc6-hook-explode.png'), tIn: 1.62, tOut: 3.36, mode: 'full' },
  // "about like a hundred trillion dollars in crypto." (in at the 7.77 trough, out at the 10.58 trough)
  { src: staticFile('broll-kc6-100t-planet.png'), tIn: 7.78, tOut: 10.57, mode: 'content' },
  // "hundred trillion dollar market cap" (in at the 15.10 trough)
  { src: staticFile('broll-kc6-trillion-gauge.png'), tIn: 15.1, tOut: 16.66, mode: 'content' },
  // climax: "So three dollars is kind of bearish from that perspective." (in at the 23.25 trough). tOut past the end so
  // BrollLayer's fade-out never ghosts the base through the last frames (clip 1's measured lesson).
  { src: staticFile('broll-kc6-climax-staircase.png'), tIn: 23.25, tOut: 26.2, mode: 'full' },
];

// Burned-in VIEWER CHAT for the whole clip (MEASURED at t = 12 s: handle pill x 0-211 / y 706-736):
// "@Harmonic_Fisherman: $3.33 is NOT an outlandish marketcap either...." is on-topic, so the text stays and only
// the handle pill is plated. Painted UNDER the b-roll.
export const KC6_REDACTIONS: RedactEv[] = [
  { tIn: 0, tOut: 26.2, top: 699, height: 40, left: 0, width: 218 },
];

// Badge band: 2-line box ~215 px tall. Strictly sequential; every badge renders until tOut + 0.1 s, and every
// tOut + 0.1 lands BEFORE the next b-roll tIn (no badge on top of an image). Nothing under the frame-0 cover.
export const KC6_BADGES: BadgeEv[] = [
  { tIn: 4.3, tOut: 6.8, color: '#39ff14', line1: 'BIGGER THAN', line2: 'GLOBAL STOCKS', top: 430 },
  { tIn: 10.8, tOut: 13.95, color: '#00e5ff', line1: '$3 KASPA', line2: '= $100B MCAP', top: 520 },
  { tIn: 21.72, tOut: 23.1, color: '#39ff14', line1: 'A LOT MORE', line2: 'THAN $100B', top: 430 },
];

// Kaspa coin in a small glass jar ("only $100B"), generated WITH the kaspa-logo.png reference, glow-on-black ->
// alpha-from-luminance (true RGBA). Floats above the "$3 KASPA = $100B" badge: box 40-380 (jar ~45-375) vs the badge's ~412-628. Alpha = luminance glow OR a hole-filled solid silhouette, so the screen-share text never shows through the jar (still-frame QA).
export const KC6_OVERLAYS: OverlayEv[] = [
  { src: staticFile('ovl-kc6-kaspa-jar.png'), tIn: 10.8, tOut: 13.95, top: 40, left: 370, width: 340, blend: 'normal' },
];

// t = event - attack_sec (sfx library.json index) so each crest lands in a MEASURED RMS trough between words.
export const KC6_SOUNDS: Sfx[] = [
  { t: 0.0, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.35, dur: 0.42 },   // cover cut (frame 1)
  { t: 1.59, src: staticFile('sfx/Boom - Big Reveal-short.wav'), vol: 0.32, dur: 0.3 },          // hook full-screen, crest 1.62
  { t: 4.28, src: staticFile('sfx/kinetic-text/knock-pop.wav'), vol: 0.3, dur: 0.25 },           // BIGGER THAN badge (silence 4.21-4.33)
  { t: 7.53, src: staticFile('sfx/kinetic-text/fast-swoosh.wav'), vol: 0.3, dur: 0.3 },          // $100T planet in, crest 7.78
  { t: 10.66, src: staticFile('sfx/Impacts/Impact_Hit_01-2-tight.wav'), vol: 0.35, dur: 0.25 },  // $3 KASPA = $100B, crest 10.80
  { t: 14.85, src: staticFile('sfx/kinetic-text/fast-swoosh.wav'), vol: 0.3, dur: 0.3 },         // gauge in, crest 15.10
  { t: 21.71, src: staticFile('sfx/kinetic-text/knock-pop.wav'), vol: 0.3, dur: 0.25 },          // A LOT MORE badge (trough 21.70-21.71)
  { t: 23.22, src: staticFile('sfx/Boom - Big Reveal-short.wav'), vol: 0.32, dur: 0.35 },        // climax full-screen, crest 23.25
];

export const KC6_THUMB: ThumbDef = {
  title: 'A <span style="color:#00e5ff">$3 KASPA</span>\nIS <span style="color:#ff5252">TOO SMALL?</span>',
  chip: 'DO THE MATH',
  chipColor: '#00e5ff',
  titleSize: 140,
  img: staticFile('thumb-kc6-cover.png'),
};

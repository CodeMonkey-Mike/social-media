// 30x-tao clip 3 `hundred-dollars-a-week-to-350x` (FULL, 71.60 s spine): composition data.
// Batch 30x-tao (livestream 2026-10-28). Plan: shorts/30x-tao/hundred-dollars-a-week-to-350x/BROLL-PLAN.md
// Public dir: shorts/30x-tao/render-assets. Seam MEASURED 853/854 (6 frames, t = 2/13/20/40/60/70 s).
import { staticFile } from 'remotion';
import type { BrollEv, Sfx } from './_kit';
import type { BadgeEv, OverlayEv, RedactEv, ThumbDef } from './LivestreamShort';

export const XT3_FPS = 30;
export const XT3_DURATION_S = 71.6;
export const XT3_DURATION_FRAMES = 2148; // floor(71.6026 s video stream * 30): never past the last spine frame
export const XT3_SEAM = 854;
export const XT3_CAP_Y = 878;
export const XT3_ACCENT = '#b6ff20'; // LAB lime

export const XT3_CLIP = staticFile('hundred-dollars-a-week-to-350x.mp4');

// 3 full-screens (hook / the 350x eruption / climax) + 4 content-zone cutaways:
// 2.72 + 3.20 + 2.90 + 2.60 + 2.90 + 3.70 + 2.90 = 20.92 s of 71.6 s = 29.2 % b-roll / 70.8 % base (band 25-35 %).
// Deliberate base stretches: 5.7-17.2 (Mike pulls up the Top Performing Assets receipt, 353x), 39.2-58.2 (the
// multiplier badges ride over the chart), 61.9-67.2.
export const XT3_BROLL: BrollEv[] = [
  { src: staticFile('broll-xt3-hook-overshoot.png'), tIn: 1.78, tOut: 4.5, mode: 'full' },
  { src: staticFile('broll-xt3-lab-flask-small.png'), tIn: 17.2, tOut: 20.4, mode: 'content' },
  { src: staticFile('broll-xt3-lab-eruption.png'), tIn: 24.1, tOut: 27.0, mode: 'full' },
  { src: staticFile('broll-xt3-ten-plays.png'), tIn: 31.9, tOut: 34.5, mode: 'content' },
  { src: staticFile('broll-xt3-week-after-week.png'), tIn: 36.3, tOut: 39.2, mode: 'content' },
  { src: staticFile('broll-xt3-climax-7billion.png'), tIn: 58.2, tOut: 61.9, mode: 'full' },
  { src: staticFile('broll-xt3-dry-powder.png'), tIn: 67.2, tOut: 70.1, mode: 'content' },
];

// Burned-in viewer chat pill "@thedon69-crypto: I like Zbcn" (MEASURED x 0-168, y 702-778 at t = 1/12/28 s; gone from
// 29.57 at the segment join). Off-topic + a viewer handle: plated whole. Under the b-roll layer by design.
export const XT3_REDACTIONS: RedactEv[] = [
  { tIn: 0, tOut: 29.56, top: 698, height: 86, left: 0, width: 176, accent: '#b6ff20' },
];

// Badge band (top 430/500, spans ~320-610): above the redaction plate (698) and the caption band (878).
// Sequential, never under a full-screen or a content b-roll (each window clear of every b-roll window).
export const XT3_BADGES: BadgeEv[] = [
  { tIn: 7.95, tOut: 9.5, color: '#b6ff20', line1: 'WE DID 350X', top: 430 },
  { tIn: 20.5, tOut: 21.9, color: '#ffc83c', line1: 'EXPECTED: 20X', top: 430 },
  { tIn: 40.3, tOut: 41.6, color: '#39ff14', line1: 'SOME 50X', top: 430 },
  { tIn: 42.36, tOut: 43.8, color: '#ffc83c', line1: 'MOST 5‑10X', top: 430 },
  { tIn: 47.1, tOut: 48.7, color: '#b6ff20', line1: '350X', top: 500 },
  { tIn: 50.33, tOut: 52.2, color: '#b6ff20', line1: '550X', line2: 'LAST SEPTEMBER', top: 430 },
  { tIn: 64.4, tOut: 65.5, color: '#ffc83c', line1: '$100', top: 430 },
  { tIn: 66.2, tOut: 67.1, color: '#b6ff20', line1: '350X', top: 430 },
];

// (QA fix, splice) keyed logo read translucent over the white chart: now on an opaque dark lime-edged plate.
// The REAL LAB logo keyed to true alpha from schedule-tweets/images/reference/LAB.png, band 90-290: co-occurs only
// with the 350X badge, which sits at top 500 (band ~430-570).
export const XT3_OVERLAYS: OverlayEv[] = [
  { src: staticFile('ovl-xt3-lab-logo.png'), tIn: 47.1, tOut: 48.7, top: 90, left: 290, width: 500, blend: 'normal' },
];

// t = crest - attack_sec; every cue swept OFFLINE before the render (zero renders, _qa/sfx/).
export const XT3_SOUNDS: Sfx[] = [
  { t: 0.0, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.4, dur: 0.42 },     // cover cut (frame 1)
  { t: 1.75, src: staticFile('sfx/Boom - Big Reveal-short.wav'), vol: 0.32, dur: 0.3 },          // hook full-screen
  // (swapped) DING crest 7.95 read '350X' as '350 likes' (2/3); a zero-attack knock ending before '350' (8.00) instead.
  { t: 7.68, src: staticFile('sfx/kinetic-text/knock-pop.wav'), vol: 0.3, dur: 0.25 },          // WE DID 350X badge
  { t: 16.85, src: staticFile('sfx/kinetic-text/whoosh-4.mp3'), vol: 0.4, dur: 0.4 },            // LAB flask in (silence)
  { t: 20.5, src: staticFile('sfx/kinetic-text/knock-pop.wav'), vol: 0.3, dur: 0.3 },            // EXPECTED 20X
  { t: 22.1, src: staticFile('sfx/Riser Sound Effect-2s.wav'), vol: 0.06, dur: 2.0 },            // builds into the eruption
  { t: 24.07, src: staticFile('sfx/Boom - Big Reveal-short.wav'), vol: 0.35, dur: 0.3 },         // 350x eruption full-screen
  { t: 29.38, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.35, dur: 0.3 },   // segment join / scene cut 29.56
  { t: 31.67, src: staticFile('sfx/kinetic-text/swoosh-2.wav'), vol: 0.3, dur: 0.5 },            // ten plays card
  { t: 36.05, src: staticFile('sfx/kinetic-text/fast-swoosh.wav'), vol: 0.3, dur: 0.45 },        // week after week
  // (DELETED) the SOME 50X knock at 40.30 read 'gonna 50x' as 'going on 50x' at dur 0.30 (1/3) and 0.15 (2/5): the run
  // 'gonna 50x' has no gap, it is decoration, so the badge lands silently.            // SOME 50X
  { t: 42.36, src: staticFile('sfx/kinetic-text/knock-pop.wav'), vol: 0.3, dur: 0.15 }, // tail cut 0.3->0.15           // MOST 5-10X
  { t: 46.87, src: staticFile('sfx/kinetic-text/swoosh-2.wav'), vol: 0.3, dur: 0.5 },            // LAB logo in
  { t: 50.19, src: staticFile('sfx/Impacts/Impact_Hit_01-2-tight.wav'), vol: 0.3, dur: 0.3 },    // 550X
  { t: 56.2, src: staticFile('sfx/Riser Sound Effect-2s.wav'), vol: 0.06, dur: 2.0 },            // builds into the climax
  { t: 58.17, src: staticFile('sfx/Boom - Big Reveal-short.wav'), vol: 0.35, dur: 0.3 },         // climax 20M -> 7B
  { t: 66.05, src: staticFile('sfx/DING-093.wav'), vol: 0.26, dur: 0.5 },                        // 350X badge
  { t: 66.87, src: staticFile('sfx/kinetic-text/whoosh-4.mp3'), vol: 0.35, dur: 0.4 },           // dry powder in
];

export const XT3_THUMB: ThumbDef = {
  title: '$100 A WEEK.\nONE DID <span style="color:#b6ff20">350X</span>.',
  chip: 'I HAD NO IDEA',
  chipColor: '#b6ff20',
  titleSize: 130,
  img: staticFile('thumb-xt3-cover.png'),
};

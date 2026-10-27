// best-time clip 2 `ton-billion-users-at-1-26` (FULL, 37.40 s) — composition data.
// Batch best-time (livestream 2026-10-27). Plan: shorts/best-time/ton-billion-users-at-1-26/BROLL-PLAN.md
// Public dir: shorts/best-time/render-assets. Seam MEASURED 853/854 (6 frames).
import { staticFile } from 'remotion';
import type { BrollEv, Sfx } from './_kit';
import type { BadgeEv, ThumbDef } from './LivestreamShort';

export const BT2_FPS = 30;
export const BT2_DURATION_S = 37.4;
export const BT2_DURATION_FRAMES = 1122; // round(37.40 * 30)
export const BT2_SEAM = 854;
export const BT2_CAP_Y = 878;
export const BT2_ACCENT = '#3aa0ff'; // TON blue divider (teal would read as Kaspa)

export const BT2_CLIP = staticFile('ton-billion-users-at-1-26.mp4');

export const BT2_BROLL: BrollEv[] = [
  { src: staticFile('broll-bt2-hook-ton-launch.png'), tIn: 0.84, tOut: 3.12, mode: 'full' },
  { src: staticFile('broll-bt2-billion-users.png'), tIn: 6.92, tOut: 9.42, mode: 'content' },
  { src: staticFile('broll-bt2-mini-apps.png'), tIn: 13.92, tOut: 16.78, mode: 'content' },
  { src: staticFile('broll-bt2-distribution.png'), tIn: 20.0, tOut: 22.36, mode: 'content' },
  { src: staticFile('broll-bt2-climax-ath-smash.png'), tIn: 33.84, tOut: 36.2, mode: 'full' },
];

export const BT2_BADGES: BadgeEv[] = [
  { tIn: 24.5, tOut: 26.1, color: '#ffe600', line1: '$1.26', sub: 'RIGHT NOW', top: 430 },
  { tIn: 29.66, tOut: 31.8, color: '#39ff14', line1: 'ALL-TIME HIGH', line2: '$7.88', top: 430 },
];

export const BT2_SOUNDS: Sfx[] = [
  { t: 0.0, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.5, dur: 0.42 },
  { t: 0.81, src: staticFile('sfx/Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3'), vol: 0.4, dur: 0.9 },
  { t: 6.58, src: staticFile('sfx/kinetic-text/whoosh-4.mp3'), vol: 0.4, dur: 0.9 },
  { t: 13.69, src: staticFile('sfx/kinetic-text/swoosh-2.wav'), vol: 0.35, dur: 0.9 },
  // (deleted 2026-10-27) distribution-ingress whoosh @19.82: masked 'So' (20.00) on the final mix at vol 0.45 AND 0.2; decoration, not a payoff hit -> removed (SKILL row 7).
  { t: 24.38, src: staticFile('sfx/Cash Register-ching.wav'), vol: 0.35, dur: 0.77 },
  { t: 27.64, src: staticFile('sfx/Riser Sound Effect-2s.wav'), vol: 0.3, dur: 2.14 },
  { t: 29.47, src: staticFile('sfx/Impacts/Kick_Impact_01-tight.wav'), vol: 0.45, dur: 0.32 },
  { t: 33.7, src: staticFile('sfx/Impacts/Impact_Hit_01-2-short.wav'), vol: 0.45, dur: 0.55 },
];

export const BT2_THUMB: ThumbDef = {
  title: 'A BILLION USERS.\n<span style="color:#3aa0ff">$TON</span> AT $1.26?',
  chip: 'GRAM / TON',
  chipColor: '#3aa0ff',
  titleSize: 112,
  img: staticFile('thumb-bt2-cover.png'),
};

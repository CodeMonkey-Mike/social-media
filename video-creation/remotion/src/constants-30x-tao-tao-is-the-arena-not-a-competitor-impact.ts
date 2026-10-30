// 30x-tao clip 6 `tao-is-the-arena-not-a-competitor-impact` (IMPACT, 18.89 s): composition data.
// Batch 30x-tao (livestream 2026-10-28). Plan: shorts/30x-tao/tao-is-the-arena-not-a-competitor-impact/BROLL-PLAN.md
// Public dir: shorts/30x-tao/render-assets. Seam MEASURED 853/854 (6 frames).
import { staticFile } from 'remotion';
import type { BrollEv, Sfx } from './_kit';
import type { BadgeEv, OverlayEv, ThumbDef } from './LivestreamShort';

export const XT6_FPS = 30;
export const XT6_DURATION_S = 18.89;
export const XT6_DURATION_FRAMES = 567; // round(18.89 * 30), spine 18.890 s
export const XT6_SEAM = 854;
export const XT6_CAP_Y = 878;
export const XT6_ACCENT = '#ffc400'; // arena gold (teal would read as Kaspa)

export const XT6_CLIP = staticFile('tao-is-the-arena-not-a-competitor-impact.mp4');

// 2 full-screens (hook + climax) = 2.88 + 2.60 = 5.48 s of 18.89 s = 29.0 % b-roll / 71.0 % base.
export const XT6_BROLL: BrollEv[] = [
  { src: staticFile('broll-30xtao-c6-hook-arena.png'), tIn: 3.32, tOut: 6.2, mode: 'full' },
  { src: staticFile('broll-30xtao-c6-climax-multipliers.png'), tIn: 15.26, tOut: 17.86, mode: 'full' },
];

// Badge band ~300-560: above the burned-in chat line (rows ~743-775) and the caption band (capY 878).
export const XT6_BADGES: BadgeEv[] = [
  { tIn: 7.2, tOut: 9.4, color: '#39ff14', line1: 'DECENTRALIZED', line2: 'AI', top: 430 },
  { tIn: 12.62, tOut: 14.8, color: '#ff5252', line1: 'SOLANA', line2: 'CENTRALIZED', sub: 'MORE THAN TAO', top: 430 },
];

// The real Kaspa reference coin (kaspa-logo.png), alpha-from-luminance, on "same thing with Kaspa".
// tOut past the end so it holds to the last frame instead of fading out.
export const XT6_OVERLAYS: OverlayEv[] = [
  { src: staticFile('ovl-30xtao-c6-kaspa-coin.png'), tIn: 17.86, tOut: 19.2, top: 150, left: 560, width: 440, blend: 'normal' },
];

// t = event - attack_sec (library.json), so each crest lands on its frame.
export const XT6_SOUNDS: Sfx[] = [
  { t: 0.0, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.5, dur: 0.42 },
  { t: 3.29, src: staticFile('sfx/Boom - Big Reveal-short.wav'), vol: 0.32, dur: 0.5 },
  { t: 7.18, src: staticFile('sfx/kinetic-text/knock-pop.wav'), vol: 0.35, dur: 0.45 },
  // (retimed 2026-10-28, offline sweep SKILL row 7a) a Kick crest at 12.30 sat on "and" and read "Solana, Solana"
  // in 2 of 3 windows; the twist sting with its crest moved to 12.67 ("is") = control in all 5 windows.
  { t: 12.38, src: staticFile('sfx/ding/sudden-shock-tight.wav'), vol: 0.35, dur: 0.4 },
  // (deleted 2026-10-28) riser 13.32-15.36 under "than TAO, right?": decoration, cost "right?" in 1 of 4 windows.
  // (swapped 2026-10-28) Impact_Hit_01-2-short crest 15.34 + 0.4 s tail masked "Tau, I think you're gonna get"
  // (14.3-16.3 window, also with the riser lowered); the tight kick crest 15.25 ends at 15.38, before "Tau"
  // (15.40): control in all 5 climax windows. The full-screen cut moved to 15.26 to land on the hit.
  { t: 15.06, src: staticFile('sfx/Impacts/Kick_Impact_01-tight.wav'), vol: 0.45, dur: 0.32 },
  { t: 17.71, src: staticFile('sfx/DING-093.wav'), vol: 0.3, dur: 0.7 },
];

export const XT6_THUMB: ThumbDef = {
  title: 'TAO ISN\'T\nCOMPETING.\n<span style="color:#ffc400">IT\'S THE ARENA</span>',
  chip: 'BITTENSOR $TAO',
  chipColor: '#ffc400',
  titleSize: 104,
  img: staticFile('thumb-30xtao-c6-cover.png'),
};

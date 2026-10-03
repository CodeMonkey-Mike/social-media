// GoldenKitty.tsx: golden-kitty longform-edited comp (16:9, 1920x1080, 30 fps).
// Built TO the approved blueprint (EDIT-PLAN.md event log, CUE-SHEET.md, TRANSITIONS.md section 5 +
// TRANSITION-PLAN.json, COVER-PLAN.json, AS-RECORDED.md FACE windows, PROJECT-LOG.md Open flags) per
// video-creation/longform-edited/skills/comp-build/comp-build.md. Self-contained: imports only packages,
// the shared ./transitions infra and its own GoldenKitty* files.
// NO music, NO SFX, NO watermark in the comp (post-mix owns audio, comp-build §9). Every engine runs with sfx={false}.
//
// DIAGRAM_REFS: C4-s1-0-dark, C4-s1-a-2013, C4-s1-b-2015, C4-s2-a-chain, C4-s2-b-pool-pulse, C1-A1-core, C1-A2-gld-focus, C1-A3-gld-token, C1-A4-etf, C1-A5-gold-bars, C1-B1-pool, C1-B2-golden-side, C1-B3-both-sides, C1-B4-buy, C1-B5-sell, stock-pair-1-eyebrow, stock-pair-2-long, stock-pair-3-meme-pool, stock-pair-4-stock, stock-pair-5-eth-struck, C27-ov-1-stocks, C27-ov-2-gold, C27-ov-3-crypto, C27-ov-4-wbtc, C27-ov-5-sol, C27-ov-6-tao, gold-dates-1-sept4, gold-dates-2-oct1, C27-fin-1-token-on-gold, C27-fin-2-chain-glow, C21-1-users, C21-2-customers-tag, C21-3-wallet-chain, C21-4-apps-tokens, C21-5-flow-pulse
// COMPARISON_REFS: contrast-priced-s1, contrast-priced-s2
// (end declared refs)
//
// Diagram rows are kind 'deck' (one row per STATE, ref = the state PNG id as on disk, each shown once). The two
// planned diagram CALLBACKS (C4 at 1:58.8 reopening on C4-s1-b-2015, the C27 finale at 5:57.3 reopening on
// C27-ov-6-tao) re-show an already-shown state, so those two rows are kind 'container' (a callback spotlight,
// not a second full-slide showing). Card slides are kind 'container', one row per state.
import React, { createContext, useContext } from 'react';
import { AbsoluteFill, Easing, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { flip } from '@remotion/transitions/flip';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadAnton } from '@remotion/google-fonts/Anton';
import { loadFont as loadDMSans } from '@remotion/google-fonts/DMSans';
import { TransitionClip } from './transitions/TransitionClip';
import { getTransition, framesForRow } from './transitions/registry';
import { ZCAPTIONS, CAPTION_WINDOWS } from './GoldenKittyCaptions';
import { CapVsVolume, C2Formula, C3Fees, C19a, C19b, AppUsersShare } from './GoldenKittyCharts';

const { fontFamily: MONTSERRAT } = loadMontserrat('normal', { weights: ['900'], subsets: ['latin'] });
const { fontFamily: ANTON } = loadAnton('normal', { weights: ['400'], subsets: ['latin'] });
const { fontFamily: DMSANS } = loadDMSans('normal', { weights: ['600', '700'], subsets: ['latin'] });

// ── §2 timing model (spine/ALL.h.paused.json) ───────────────────────────────────────────────────────
export const FPS = 30;
export const PAUSE = 1.5;                                       // ALL.h.paused.json pause_s (NOT the 1.0 default)
export const CARD_T = [51.095, 170.97, 260.3, 363.36];          // ALL.h.paused.json pauses[].at (SOURCE secs)
export const SPINE_SECS = 470.456;                              // SOURCE spine spine/ALL.g.pickup.mp4
export const PAUSED_SPINE_SECS = 476.493;                       // ALL.h.paused.json output_duration_s (= assets/spine.mp4)
const sh = (t: number) => t + PAUSE * CARD_T.filter((c) => c <= t).length;    // source -> paused-spine secs
const cardStart = (b: number) => b + PAUSE * CARD_T.filter((c) => c < b).length;
const F = (t: number) => Math.round(sh(t) * FPS);
if (Math.abs(SPINE_SECS + CARD_T.length * PAUSE - PAUSED_SPINE_SECS) > 0.1) throw new Error('paused spine length does not match SPINE_SECS + pauses');
// DUR = ceil(paused spine * fps) = 14295 (check_spine_fps.py); the formula value (SPINE_SECS + 4 x 1.5) x 30 = 14293.7.
export const DUR = Math.ceil(PAUSED_SPINE_SECS * FPS);

// ── §3a FACE REFRAME (assets/face-reframe.json, measured, never hand-tuned) ───────────────────────────
export const FACE_REFRAME = { scale: 1.359, x: -575, y: -370 };
const FACE_POINT = { x: 960, y: 432 };                   // face-reframe.json face_point_out: punch-ins scale about it

// FACE windows (AS-RECORDED.md, exact). ALL NINE air the PRE-FRAMED Higgsfield swap clips (§3b), no FACE_REFRAME (Mike, 2026-10-02).
// head = the sidecar's window_starts_at_clip_frame (the handle that is thrown away).
export const FACES: { a: number; b: number; swap?: string; head?: number }[] = [
  { a: 0.0, b: 9.667, swap: 'face-swap/F1-higgsfield-bg-swap.mp4', head: 12 },
  { a: 40.233, b: 44.033, swap: 'face-swap/F2-higgsfield-bg-swap.mp4', head: 12 },
  { a: 89.6, b: 91.833, swap: 'face-swap/F3-higgsfield-bg-swap.mp4', head: 12 },
  { a: 122.1, b: 131.233, swap: 'face-swap/F4-higgsfield-bg-swap.mp4', head: 9 },
  { a: 167.433, b: 169.533, swap: 'face-swap/F5-higgsfield-bg-swap.mp4', head: 27 },
  { a: 213.933, b: 216.5, swap: 'face-swap/F6-higgsfield-bg-swap.mp4', head: 12 },
  { a: 342.567, b: 348.0, swap: 'face-swap/F7-higgsfield-bg-swap.mp4', head: 8 },
  { a: 407.533, b: 410.833, swap: 'face-swap/F8-higgsfield-bg-swap.mp4', head: 10 },
  { a: 453.1, b: 457.467, swap: 'face-swap/F9-higgsfield-bg-swap.mp4', head: 12 },
];

// hand:punch rows (TRANSITIONS.md section 5): t = source secs, s = scale, r = ramp secs (0 = hard snap on a join)
export const PUNCH = [
  { t: 4.3, s: 1.06, r: 0 },      // hand:punch F1 subtle (swap clip), on the F1a/F1b seam
  { t: 42.1, s: 1.06, r: 0 },     // hand:punch F2 subtle (swap clip)
  { t: 90.7, s: 1.06, r: 0 },     // hand:punch F3 subtle (swap clip)
  { t: 127.467, s: 1.06, r: 0 },  // hand:punch F4 subtle (swap clip), on the F4a/F4b seam, just before "a token launches"
  { t: 168.5, s: 1.06, r: 0 },    // hand:punch F5 subtle (swap clip)
  { t: 215.3, s: 1.06, r: 0 },    // hand:punch F6 subtle (swap clip) on "every"
  { t: 345.44, s: 1.06, r: 0 },   // hand:punch F7 subtle (swap clip) on "Golden Kitty has been"
  { t: 409.22, s: 1.06, r: 0 },   // hand:punch F8 subtle (swap clip) on "have barely"
  { t: 456.66, s: 1.2, r: 0.13 }, // hand:punch F9 CRASH ZOOM on "priced" (the vibe cut, 0.13 s): KEPT at full size on the swap clip, it is the hit of the video
];

// hand:film-burn on all 17 face edges (TRANSITIONS.md: 0.76 s, dialed down to 0.50 s on F3 / F5 / F6)
export const BURNS: { t: number; d: number }[] = [
  { t: 9.667, d: 0.76 }, { t: 40.233, d: 0.76 }, { t: 44.033, d: 0.76 }, { t: 89.6, d: 0.5 }, { t: 91.833, d: 0.5 },
  { t: 122.1, d: 0.76 }, { t: 131.233, d: 0.76 }, { t: 167.433, d: 0.5 }, { t: 169.533, d: 0.5 }, { t: 213.933, d: 0.5 },
  { t: 216.5, d: 0.5 }, { t: 342.567, d: 0.76 }, { t: 348.0, d: 0.76 }, { t: 407.533, d: 0.76 }, { t: 410.833, d: 0.76 },
  { t: 453.1, d: 0.76 }, { t: 457.467, d: 0.76 },
];

// Captions (§8): FACE windows only, generated data. CAPTION_SRC mirrors CAPTION_WINDOWS for lint_covers.py.
export const CAPTION_SRC: [number, number][] = [[0.0, 9.667], [122.1, 131.233], [342.567, 348.0]];
if (JSON.stringify(CAPTION_SRC) !== JSON.stringify(CAPTION_WINDOWS.map(([a, b]) => [a, b]))) throw new Error('CAPTION_SRC drifted from GoldenKittyCaptions.ts CAPTION_WINDOWS');

// ── §4 COVER track: one row per state / sub-point (EDIT-PLAN.md). fx = how the row ENTERS:
//   face = face-owned cut (the film burn owns it) · card = card-owned (the flip owns it) · xfade = hand:xfade-scale ·
//   fade = hand:fade · glitch / melt / spin = a library engine (tid) · state = a state swap inside the same
//   container (8f cross-fade, NO ingress transition) · pulse = sine cross-fade against `alt`.
export type Kind = 'still' | 'vid' | 'receipt' | 'deck' | 'container' | 'chart';
export type Cover = {
  tIn: number; tOut: number; kind: Kind; ref: string; state?: string; lead?: boolean; cap?: boolean;
  fx: 'face' | 'card' | 'xfade' | 'fade' | 'glitch' | 'melt' | 'spin' | 'state' | 'pulse';
  d?: number; tid?: string; grp?: string; alt?: string; sf?: number;
};
export const COVERS: Cover[] = [
  // CH1 THE TROPHY ─ F1 0.000-9.667 (swap clip)
  { tIn: 9.667, tOut: 13.4, kind: 'still', ref: 'IMG-1-eth-vs-stablecoin', fx: 'face' }, // hand:film-burn (face-owned)
  { tIn: 13.4, tOut: 14.8, kind: 'receipt', ref: 'C13-dexscreener-golden-gld-pair-header', fx: 'xfade', d: 0.35 }, // hand:xfade-scale 0.35
  { tIn: 14.8, tOut: 16.38, kind: 'receipt', ref: 'C13-gld-token-page-full-name', fx: 'xfade', d: 0.2 }, // hand:xfade-scale 0.20
  { tIn: 16.38, tOut: 21.2, kind: 'receipt', ref: 'C5-robinhood-2015-golden-kitty-post', fx: 'xfade', d: 0.35 }, // hand:xfade-scale 0.35
  { tIn: 21.2, tOut: 24.78, kind: 'vid', ref: 'IMG-11-vlad-trophy-overhead-confetti-motion', fx: 'glitch', tid: 'turbulent-v-4x' }, // lib:turbulent-v-4x
  { tIn: 24.78, tOut: 28.56, kind: 'container', ref: 'H1-s1', state: 's1', grp: 'H1', fx: 'xfade', d: 0.35 }, // hand:xfade-scale 0.35
  { tIn: 28.56, tOut: 30.04, kind: 'container', ref: 'H1-s2', state: 's2', grp: 'H1', fx: 'state' },
  { tIn: 30.04, tOut: 33.5, kind: 'vid', ref: 'BR-1-crowd-silhouettes', fx: 'fade', d: 0.27 }, // hand:fade 0.27
  { tIn: 33.5, tOut: 37.16, kind: 'still', ref: 'IMG-2-kitty-rising-from-chain', fx: 'glitch', tid: 'turbulent-v-5x' }, // lib:turbulent-v-5x
  { tIn: 37.16, tOut: 40.233, kind: 'vid', ref: 'BR-2-gold-bars-pan', fx: 'fade', d: 0.5 }, // hand:fade 0.50
  // F2 40.233-44.033 (swap clip)
  { tIn: 44.033, tOut: 46.96, kind: 'receipt', ref: 'C11a-matcarpenter-trophy-post', fx: 'face' }, // hand:film-burn (face-owned)
  { tIn: 46.96, tOut: 51.2, kind: 'vid', ref: 'BR-3-clock-vortex-flythrough', fx: 'fade', d: 0.27, lead: true }, // hand:fade 0.27, LEADING-MOTION 4.24 s
  // CH2 THE GOLDEN KITTY (card 1, rmn:flip)
  { tIn: 51.2, tOut: 54.7, kind: 'still', ref: 'IMG-3-kitty-spotlight-question', fx: 'card' }, // rmn:flip (card-owned)
  { tIn: 54.7, tOut: 58.58, kind: 'container', ref: 'ph-card-s1', state: 's1', grp: 'ph', fx: 'xfade', d: 0.35 }, // hand:xfade-scale 0.35
  { tIn: 58.58, tOut: 59.58, kind: 'container', ref: 'ph-card-s2', state: 's2', grp: 'ph', fx: 'state' },
  { tIn: 59.58, tOut: 64.3, kind: 'receipt', ref: 'C8-producthunt-golden-kitty-2015-hall-of-fame', fx: 'xfade', d: 0.35 }, // hand:xfade-scale 0.35
  { tIn: 64.3, tOut: 68.3, kind: 'vid', ref: 'BR-4-audience-applause', fx: 'fade', d: 0.5 }, // hand:fade 0.50
  { tIn: 68.3, tOut: 74.3, kind: 'receipt', ref: 'C11b-nivdror-trophy-video-post', fx: 'xfade', d: 0.35 }, // hand:xfade-scale 0.35
  { tIn: 74.3, tOut: 78.3, kind: 'receipt', ref: 'C11c-arthcmr-trophy-post', fx: 'xfade', d: 0.35 }, // hand:xfade-scale 0.35
  { tIn: 78.3, tOut: 78.76, kind: 'deck', ref: 'C4-s1-0-dark', state: 's1-0', grp: 'C4a', fx: 'xfade', d: 0.35 }, // hand:xfade-scale 0.35
  { tIn: 78.76, tOut: 84.52, kind: 'deck', ref: 'C4-s1-a-2013', state: 's1-a', grp: 'C4a', fx: 'state' },
  { tIn: 84.52, tOut: 86.0, kind: 'deck', ref: 'C4-s1-b-2015', state: 's1-b', grp: 'C4a', fx: 'state' },
  { tIn: 86.0, tOut: 89.6, kind: 'still', ref: 'IMG-12-vlad-desk-trophy-laptop', fx: 'glitch', tid: 'turbulent-h-2x' }, // lib:turbulent-h-2x
  // F3 89.6-91.833
  { tIn: 91.833, tOut: 93.34, kind: 'receipt', ref: 'C5b-robinhood-2015-post-graphic', fx: 'face' }, // hand:film-burn (face-owned)
  { tIn: 93.34, tOut: 98.4, kind: 'receipt', ref: 'C6-robinhood-rewind-2015', fx: 'xfade', d: 0.35 }, // hand:xfade-scale 0.35
  { tIn: 98.4, tOut: 100.9, kind: 'vid', ref: 'BR-5-golden-trophies', fx: 'fade', d: 0.5 }, // hand:fade 0.50
  { tIn: 100.9, tOut: 102.76, kind: 'container', ref: 'winners-card-s1', state: 's1', grp: 'win', fx: 'xfade', d: 0.35 }, // hand:xfade-scale 0.35
  { tIn: 102.76, tOut: 104.5, kind: 'container', ref: 'winners-card-s2', state: 's2', grp: 'win', fx: 'state' },
  { tIn: 104.5, tOut: 105.38, kind: 'container', ref: 'winners-card-s3', state: 's3', grp: 'win', fx: 'state' },
  { tIn: 105.38, tOut: 106.0, kind: 'container', ref: 'winners-card-s4', state: 's4', grp: 'win', fx: 'state' },
  { tIn: 106.0, tOut: 106.38, kind: 'container', ref: 'winners-card-s5', state: 's5', grp: 'win', fx: 'state' },
  { tIn: 106.38, tOut: 109.74, kind: 'container', ref: 'winners-card-s6', state: 's6', grp: 'win', fx: 'state' },
  { tIn: 109.74, tOut: 112.5, kind: 'container', ref: 'winners-card-s7', state: 's7', grp: 'win', fx: 'state' },
  { tIn: 112.5, tOut: 116.0, kind: 'receipt', ref: 'C7-producthunt-robinhood-awards', fx: 'xfade', d: 0.35 }, // hand:xfade-scale 0.35
  { tIn: 116.0, tOut: 118.78, kind: 'still', ref: 'IMG-13-vlad-cabinet-shelf', fx: 'glitch', tid: 'turbulent-h-3x' }, // lib:turbulent-h-3x
  { tIn: 118.78, tOut: 120.5, kind: 'container', ref: 'C4-s1-b-2015', state: 'callback-s1-b', grp: 'C4b', fx: 'xfade', d: 0.35 }, // hand:xfade-scale 0.35 (C4 callback)
  { tIn: 120.5, tOut: 121.0, kind: 'deck', ref: 'C4-s2-a-chain', state: 's2-a', grp: 'C4b', fx: 'state' },
  { tIn: 121.0, tOut: 122.1, kind: 'deck', ref: 'C4-s2-b-pool-pulse', state: 's2-b', grp: 'C4b', fx: 'pulse', alt: 'C4-s2-a-chain', sf: 1.0 },
  // F4 122.1-131.233 ─ CH3 THE TOKEN
  { tIn: 131.233, tOut: 133.52, kind: 'receipt', ref: 'C10-goldenkitty-vip-hero', fx: 'face' }, // hand:film-burn (face-owned)
  { tIn: 133.52, tOut: 142.25, kind: 'receipt', ref: 'C10-goldenkitty-vip-faq-fan-dedication', fx: 'xfade', d: 0.35 }, // hand:xfade-scale 0.35
  { tIn: 142.25, tOut: 156.25, kind: 'receipt', ref: 'C12-dexscreener-golden-gld-chart', fx: 'xfade', d: 0.35 }, // hand:xfade-scale 0.35
  { tIn: 156.25, tOut: 161.06, kind: 'container', ref: 'cap-holders-s1', state: 's1', grp: 'cap', fx: 'xfade', d: 0.35 }, // hand:xfade-scale 0.35
  { tIn: 161.06, tOut: 162.48, kind: 'container', ref: 'cap-holders-s2', state: 's2', grp: 'cap', fx: 'state' },
  { tIn: 162.48, tOut: 167.433, kind: 'chart', ref: 'cap-vs-volume', fx: 'xfade', d: 0.35 }, // hand:xfade-scale 0.35 (scale-in 0.96)
  // F5 167.433-169.533
  { tIn: 169.533, tOut: 171.2, kind: 'vid', ref: 'BR-6-molten-gold-pour', fx: 'face' }, // hand:film-burn (face-owned)
  // CH4 PRICED IN GOLD (card 2, rmn:flip)
  { tIn: 171.2, tOut: 173.9, kind: 'vid', ref: 'BR-7-ethereum-coin-spin', fx: 'card' }, // rmn:flip (card-owned)
  { tIn: 173.9, tOut: 175.55, kind: 'vid', ref: 'BR-8-money-counter', fx: 'fade', d: 0.27 }, // hand:fade 0.27
  { tIn: 175.55, tOut: 178.58, kind: 'deck', ref: 'C1-A1-core', state: 'A1', grp: 'C1A', fx: 'xfade', d: 0.35 }, // hand:xfade-scale 0.35
  { tIn: 178.58, tOut: 180.84, kind: 'deck', ref: 'C1-A2-gld-focus', state: 'A2', grp: 'C1A', fx: 'state' },
  { tIn: 180.84, tOut: 182.58, kind: 'deck', ref: 'C1-A3-gld-token', state: 'A3', grp: 'C1A', fx: 'state' },
  { tIn: 182.58, tOut: 186.52, kind: 'deck', ref: 'C1-A4-etf', state: 'A4', grp: 'C1A', fx: 'state' },
  { tIn: 186.52, tOut: 188.4, kind: 'deck', ref: 'C1-A5-gold-bars', state: 'A5', grp: 'C1A', fx: 'state' },
  { tIn: 188.4, tOut: 191.32, kind: 'container', ref: 'spdr-card-s1', state: 's1', grp: 'spdr', fx: 'xfade', d: 0.35 }, // hand:xfade-scale 0.35
  { tIn: 191.32, tOut: 191.9, kind: 'container', ref: 'spdr-card-s2', state: 's2', grp: 'spdr', fx: 'state' },
  { tIn: 191.9, tOut: 192.32, kind: 'container', ref: 'spdr-card-s3', state: 's3', grp: 'spdr', fx: 'state' },
  { tIn: 192.32, tOut: 192.98, kind: 'container', ref: 'spdr-card-s4', state: 's4', grp: 'spdr', fx: 'state' },
  { tIn: 192.98, tOut: 194.1, kind: 'container', ref: 'spdr-card-s5', state: 's5', grp: 'spdr', fx: 'state' },
  { tIn: 194.1, tOut: 196.3, kind: 'still', ref: 'IMG-4-spider-on-gold-bar', fx: 'glitch', tid: 'turbulent-h-4x' }, // lib:turbulent-h-4x
  { tIn: 196.3, tOut: 201.54, kind: 'receipt', ref: 'C16-stock-tokens-backed-1to1', fx: 'xfade', d: 0.35 }, // hand:xfade-scale 0.35
  { tIn: 201.54, tOut: 203.1, kind: 'vid', ref: 'BR-9-vault-corridor', fx: 'fade', d: 0.27 }, // hand:fade 0.27
  { tIn: 203.1, tOut: 206.82, kind: 'deck', ref: 'C1-B1-pool', state: 'B1', grp: 'C1B', fx: 'melt', tid: 'melt-equidistant-1' }, // lib:melt-equidistant-1 THE MARQUEE
  { tIn: 206.82, tOut: 208.06, kind: 'deck', ref: 'C1-B2-golden-side', state: 'B2', grp: 'C1B', fx: 'state' },
  { tIn: 208.06, tOut: 208.96, kind: 'deck', ref: 'C1-B3-both-sides', state: 'B3', grp: 'C1B', fx: 'state' },
  { tIn: 208.96, tOut: 211.88, kind: 'deck', ref: 'C1-B4-buy', state: 'B4', grp: 'C1B', fx: 'state' },
  { tIn: 211.88, tOut: 213.933, kind: 'deck', ref: 'C1-B5-sell', state: 'B5', grp: 'C1B', fx: 'state' },
  // F6 213.933-216.5
  { tIn: 216.5, tOut: 219.45, kind: 'vid', ref: 'BR-10-scale-dollars-vs-gold', fx: 'face' }, // hand:film-burn (face-owned)
  { tIn: 219.45, tOut: 230.86, kind: 'chart', ref: 'C2', fx: 'xfade', d: 0.35 }, // hand:xfade-scale 0.35
  { tIn: 230.86, tOut: 236.5, kind: 'receipt', ref: 'C15-tradingview-gld-two-year-percent', fx: 'xfade', d: 0.35 }, // hand:xfade-scale 0.35
  { tIn: 236.5, tOut: 238.66, kind: 'vid', ref: 'BR-11-gold-coins-falling', fx: 'fade', d: 0.5 }, // hand:fade 0.50
  { tIn: 238.66, tOut: 248.14, kind: 'chart', ref: 'C3', fx: 'xfade', d: 0.35 }, // hand:xfade-scale 0.35
  { tIn: 248.14, tOut: 255.66, kind: 'receipt', ref: 'C10b-goldenkitty-vip-disclaimer', fx: 'xfade', d: 0.35 }, // hand:xfade-scale 0.35
  { tIn: 255.66, tOut: 257.72, kind: 'container', ref: 'contrast-priced-s1', state: 's1', grp: 'contrast', fx: 'xfade', d: 0.35 }, // hand:xfade-scale 0.35
  { tIn: 257.72, tOut: 260.0, kind: 'container', ref: 'contrast-priced-s2', state: 's2', grp: 'contrast', fx: 'state' },
  // CH5 THE STONK NARRATIVE (card 3, rmn:flip)
  { tIn: 260.0, tOut: 262.5, kind: 'vid', ref: 'IMG-5-kitty-leads-coin-crowd-motion', fx: 'card' }, // rmn:flip (card-owned)
  { tIn: 262.5, tOut: 266.5, kind: 'vid', ref: 'BR-12-traders-desks', fx: 'fade', d: 0.5 }, // hand:fade 0.50
  { tIn: 266.5, tOut: 271.08, kind: 'deck', ref: 'stock-pair-1-eyebrow', state: '1', grp: 'sp', fx: 'xfade', d: 0.35 }, // hand:xfade-scale 0.35
  { tIn: 271.08, tOut: 272.88, kind: 'deck', ref: 'stock-pair-2-long', state: '2', grp: 'sp', fx: 'state' },
  { tIn: 272.88, tOut: 274.4, kind: 'deck', ref: 'stock-pair-3-meme-pool', state: '3', grp: 'sp', fx: 'state' },
  { tIn: 274.4, tOut: 275.32, kind: 'deck', ref: 'stock-pair-4-stock', state: '4', grp: 'sp', fx: 'state' },
  { tIn: 275.32, tOut: 276.26, kind: 'deck', ref: 'stock-pair-5-eth-struck', state: '5', grp: 'sp', fx: 'state' },
  { tIn: 276.26, tOut: 277.8, kind: 'vid', ref: 'BR-13-rocket-ignition', fx: 'fade', d: 0.27 }, // hand:fade 0.27
  { tIn: 277.8, tOut: 283.1, kind: 'receipt', ref: 'C23-theblock-stock-paired-quarter', fx: 'xfade', d: 0.35 }, // hand:xfade-scale 0.35
  { tIn: 283.1, tOut: 285.3, kind: 'vid', ref: 'BR-14-aerial-suburb-pools', fx: 'fade', d: 0.5 }, // hand:fade 0.50
  { tIn: 285.3, tOut: 288.24, kind: 'still', ref: 'IMG-6-artificial-inu-glow', fx: 'glitch', tid: 'turbulent-h-5x' }, // lib:turbulent-h-5x
  { tIn: 288.24, tOut: 290.15, kind: 'vid', ref: 'BR-15-circuit-board-glow', fx: 'fade', d: 0.27 }, // hand:fade 0.27
  { tIn: 290.15, tOut: 296.35, kind: 'receipt', ref: 'C23b-theblock-artificial-inu-sentence', fx: 'xfade', d: 0.35 }, // hand:xfade-scale 0.35
  { tIn: 296.35, tOut: 298.44, kind: 'vid', ref: 'BR-16-jump-flip-splash', fx: 'fade', d: 0.5 }, // hand:fade 0.50
  { tIn: 298.44, tOut: 302.0, kind: 'receipt', ref: 'C31-datawallet-stonkfun-explained-BENCH', fx: 'xfade', d: 0.35 }, // hand:xfade-scale 0.35
  { tIn: 302.0, tOut: 304.4, kind: 'still', ref: 'IMG-7-stonk-token-launch', fx: 'glitch', tid: 'turbulent-v-3x' }, // lib:turbulent-v-3x
  { tIn: 304.4, tOut: 310.24, kind: 'receipt', ref: 'C24-theblock-stonk-surges-headline', fx: 'xfade', d: 0.35 }, // hand:xfade-scale 0.35
  { tIn: 310.24, tOut: 315.54, kind: 'deck', ref: 'C27-ov-1-stocks', state: 'ov-1', grp: 'C27o', fx: 'spin', tid: 'spin-3d-center-ease-t-cw' }, // lib:spin-3d-center-ease-t-cw
  { tIn: 315.54, tOut: 318.62, kind: 'deck', ref: 'C27-ov-2-gold', state: 'ov-2', grp: 'C27o', fx: 'state' },
  { tIn: 318.62, tOut: 319.9, kind: 'deck', ref: 'C27-ov-3-crypto', state: 'ov-3', grp: 'C27o', fx: 'state' },
  { tIn: 319.9, tOut: 320.78, kind: 'deck', ref: 'C27-ov-4-wbtc', state: 'ov-4', grp: 'C27o', fx: 'state' },
  { tIn: 320.78, tOut: 321.44, kind: 'deck', ref: 'C27-ov-5-sol', state: 'ov-5', grp: 'C27o', fx: 'state' },
  { tIn: 321.44, tOut: 321.82, kind: 'deck', ref: 'C27-ov-6-tao', state: 'ov-6', grp: 'C27o', fx: 'state' },
  { tIn: 321.82, tOut: 325.1, kind: 'receipt', ref: 'C28-datawallet-stonkfun-holder-rewards-BENCH', fx: 'xfade', d: 0.35 }, // hand:xfade-scale 0.35
  { tIn: 325.1, tOut: 328.78, kind: 'vid', ref: 'BR-17-hologram-lab', fx: 'fade', d: 0.5 }, // hand:fade 0.50
  { tIn: 328.78, tOut: 331.1, kind: 'vid', ref: 'BR-18-night-festival-crowd', fx: 'fade', d: 0.5 }, // hand:fade 0.50
  { tIn: 331.1, tOut: 332.7, kind: 'vid', ref: 'BR-19-gold-leaves-falling', fx: 'fade', d: 0.27 }, // hand:fade 0.27
  { tIn: 332.7, tOut: 342.567, kind: 'receipt', ref: 'C25-stonkfun-gold-pairs-post', fx: 'xfade', d: 0.35 }, // hand:xfade-scale 0.35 (two-stage zoom)
  // F7 342.567-348.0
  { tIn: 348.0, tOut: 349.64, kind: 'deck', ref: 'gold-dates-1-sept4', state: '1', grp: 'gd', fx: 'face' }, // hand:film-burn (face-owned)
  { tIn: 349.64, tOut: 351.03, kind: 'deck', ref: 'gold-dates-2-oct1', state: '2', grp: 'gd', fx: 'state', d: 0.2 },
  { tIn: 351.03, tOut: 353.92, kind: 'receipt', ref: 'C26-cryptogalaxy-gold-narrative-post', fx: 'xfade', d: 0.35 }, // hand:xfade-scale 0.35
  { tIn: 353.92, tOut: 357.32, kind: 'vid', ref: 'BR-20-bull-charging', fx: 'fade', d: 0.5 }, // hand:fade 0.50
  { tIn: 357.32, tOut: 358.72, kind: 'container', ref: 'C27-ov-6-tao', state: 'callback-ov-6', grp: 'C27f', fx: 'melt', tid: 'melt-equidistant-1' }, // lib:melt-equidistant-1 thesis callback
  { tIn: 358.72, tOut: 360.24, kind: 'deck', ref: 'C27-fin-1-token-on-gold', state: 'fin-1', grp: 'C27f', fx: 'pulse', alt: 'C27-ov-6-tao', sf: 0.9 },
  { tIn: 360.24, tOut: 363.46, kind: 'deck', ref: 'C27-fin-2-chain-glow', state: 'fin-2', grp: 'C27f', fx: 'state' },
  // CH6 ROBINHOOD CHAIN (card 4, rmn:flip)
  { tIn: 363.46, tOut: 366.45, kind: 'still', ref: 'IMG-8-kitty-rooftop-lime-city', fx: 'card' }, // rmn:flip (card-owned)
  { tIn: 366.45, tOut: 371.0, kind: 'receipt', ref: 'C17-newsroom-mainnet-launch', fx: 'xfade', d: 0.35 }, // hand:xfade-scale 0.35
  { tIn: 371.0, tOut: 375.6, kind: 'receipt', ref: 'C32-docs-about-robinhood-chain', fx: 'xfade', d: 0.35 }, // hand:xfade-scale 0.35
  { tIn: 375.6, tOut: 380.5, kind: 'vid', ref: 'BR-21-earth-night-orbit', fx: 'fade', d: 0.5, lead: true }, // hand:fade 0.50, LEADING-MOTION 4.9 s
  { tIn: 380.5, tOut: 386.0, kind: 'receipt', ref: 'C18-defillama-robinhood-chain-dex-volume-daily', fx: 'xfade', d: 0.35 }, // hand:xfade-scale 0.35
  { tIn: 386.0, tOut: 393.0, kind: 'chart', ref: 'C19a', fx: 'xfade', d: 0.35 }, // hand:xfade-scale 0.35
  { tIn: 393.0, tOut: 394.3, kind: 'vid', ref: 'BR-22-jet-engine-fan', fx: 'fade', d: 0.27 }, // hand:fade 0.27
  { tIn: 394.3, tOut: 401.7, kind: 'chart', ref: 'C19b', fx: 'xfade', d: 0.35 }, // hand:xfade-scale 0.35
  { tIn: 401.7, tOut: 407.533, kind: 'chart', ref: 'app-users-share', fx: 'xfade', d: 0.35 }, // hand:xfade-scale 0.35
  // F8 407.533-410.833
  { tIn: 410.833, tOut: 414.2, kind: 'still', ref: 'IMG-9-vlad-podium-lime-glow', fx: 'face' }, // hand:film-burn (face-owned)
  { tIn: 414.2, tOut: 420.9, kind: 'receipt', ref: 'C20-tenev-x-post', fx: 'xfade', d: 0.35 }, // hand:xfade-scale 0.35
  { tIn: 420.9, tOut: 422.88, kind: 'container', ref: 'both-tags-s1', state: 's1', grp: 'tags', fx: 'xfade', d: 0.2 }, // hand:xfade-scale 0.20
  { tIn: 422.88, tOut: 423.78, kind: 'container', ref: 'both-tags-s2', state: 's2', grp: 'tags', fx: 'state' },
  { tIn: 423.78, tOut: 425.7, kind: 'container', ref: 'both-tags-s3', state: 's3', grp: 'tags', fx: 'state' },
  // CH7 THE CASE
  { tIn: 425.7, tOut: 427.3, kind: 'vid', ref: 'BR-23-gavel-strike', fx: 'fade', d: 0.27 }, // hand:fade 0.27
  { tIn: 427.3, tOut: 430.68, kind: 'deck', ref: 'C21-1-users', state: '1', grp: 'C21', fx: 'spin', tid: 'spin-3d-center-ease-t-cw' }, // lib:spin-3d-center-ease-t-cw
  { tIn: 430.68, tOut: 433.14, kind: 'deck', ref: 'C21-2-customers-tag', state: '2', grp: 'C21', fx: 'state' },
  { tIn: 433.14, tOut: 434.9, kind: 'deck', ref: 'C21-3-wallet-chain', state: '3', grp: 'C21', fx: 'state' },
  { tIn: 434.9, tOut: 437.3, kind: 'deck', ref: 'C21-4-apps-tokens', state: '4', grp: 'C21', fx: 'state' },
  { tIn: 437.3, tOut: 439.1, kind: 'deck', ref: 'C21-5-flow-pulse', state: '5', grp: 'C21', fx: 'pulse', alt: 'C21-4-apps-tokens', sf: 0.8 },
  { tIn: 439.1, tOut: 442.2, kind: 'vid', ref: 'BR-24-red-carpet-flashes', fx: 'fade', d: 0.5 }, // hand:fade 0.50
  { tIn: 442.2, tOut: 445.4, kind: 'vid', ref: 'BR-25-marquee-bulbs', fx: 'fade', d: 0.5 }, // hand:fade 0.50
  { tIn: 445.4, tOut: 453.1, kind: 'receipt', ref: 'C29-cryptotimes-amc-paired-coin-headline', fx: 'xfade', d: 0.35 }, // hand:xfade-scale 0.35
  // F9 453.1-457.467 (the vibe cut)
  { tIn: 457.467, tOut: 461.04, kind: 'vid', ref: 'IMG-10-kitty-token-on-gold-bars-motion', fx: 'face' }, // hand:film-burn (face-owned)
  { tIn: 461.04, tOut: 463.4, kind: 'vid', ref: 'BR-26-seedlings-timelapse', fx: 'fade', d: 0.5 }, // hand:fade 0.50
  { tIn: 463.4, tOut: 464.72, kind: 'container', ref: 'end-card-s1', state: 's1', grp: 'end', fx: 'xfade', d: 0.35 }, // hand:xfade-scale 0.35
  { tIn: 464.72, tOut: 466.1, kind: 'container', ref: 'end-card-s2', state: 's2', grp: 'end', fx: 'state' },
  { tIn: 466.1, tOut: 470.456, kind: 'container', ref: 'end-card-s3', state: 's3', grp: 'end', fx: 'state' },
];

// ── per-asset metadata ──────────────────────────────────────────────────────────────────────────────
const DIAGRAMS = new Set(COVERS.filter((c) => c.kind === 'deck').map((c) => c.ref).concat(['C4-s1-b-2015', 'C27-ov-6-tao']));
const MOTION: Record<string, string> = {           // img-motion clip -> its still (fallback + the frame a transition pulls)
  'IMG-11-vlad-trophy-overhead-confetti-motion': 'IMG-11-vlad-trophy-overhead-confetti',
  'IMG-5-kitty-leads-coin-crowd-motion': 'IMG-5-kitty-leads-coin-crowd',
  'IMG-10-kitty-token-on-gold-bars-motion': 'IMG-10-kitty-token-on-gold-bars',
};
const AI_TAG = new Set(['IMG-11-vlad-trophy-overhead-confetti-motion', 'IMG-12-vlad-desk-trophy-laptop', 'IMG-13-vlad-cabinet-shelf', 'IMG-9-vlad-podium-lime-glow']);
const LINE_CAPS: Record<string, string> = {        // broll-and-containers §3 LINE-CAPTION (4 of 26 video covers)
  'BR-1-crowd-silhouettes': 'MORE THAN 28 MILLION CUSTOMERS',
  'BR-14-aerial-suburb-pools': 'ACROSS MORE THAN 400 POOLS',
  'BR-21-earth-night-orbit': '24/7 IN MORE THAN 120 COUNTRIES',
  'BR-25-marquee-bulbs': 'A DIFFERENT MEME COIN',
};
const GUARD: Record<string, string> = { 'C29-cryptotimes-amc-paired-coin-headline': 'A DIFFERENT TOKEN' };
// §6a cost trap: a video side handed to an engine is a pre-extracted CUT-FRAME still (frame at the window start)
const CUTFRAME: Record<string, string> = {
  'BR-9-vault-corridor': 'transitions/cutframes/BR-9-cut.jpg',
  'BR-20-bull-charging': 'transitions/cutframes/BR-20-cut.jpg',
  'BR-23-gavel-strike': 'transitions/cutframes/BR-23-cut.jpg',
};

// Receipt framing: natural size + view keyframes [srcT, cx, cy, z] (cx/cy = image fractions at the frame centre;
// z = image width shown across 1920 px as a fraction of the image width; z < 0 = that multiple of the fit-all view).
type RV = { w: number; h: number; crop?: [number, number]; k: [number, number, number, number][]; hl?: { x0: number; y0: number; x1: number; y1: number; t: number; c: string; fill?: boolean } };   // fill = marker-pen highlight (multiply) for a line of text on a WHITE page, where a lime outline does not read
const LIME = '#ccff00', GOLD = '#ffd700';
const RECEIPTS: Record<string, RV> = {
  'C13-dexscreener-golden-gld-pair-header': { w: 1560, h: 894, k: [[13.4, 0.5, 0.5, -1], [14.8, 0.5, 0.45, -0.9]] },
  'C13-gld-token-page-full-name': { w: 1005, h: 990, crop: [0, 0.36], k: [[14.8, 0.5, 0.5, -1], [16.38, 0.47, 0.4, -0.93]], hl: { x0: 0.11, y0: 0.01, x1: 0.58, y1: 0.14, t: 15.0, c: GOLD } },
  'C5-robinhood-2015-golden-kitty-post': { w: 1842, h: 1512, k: [[16.38, 0.5, 0.5, -1], [19.4, 0.5, 0.45, -0.85], [20.4, 0.5, 0.2, 0.85], [21.2, 0.5, 0.2, 0.8]] },
  'C11a-matcarpenter-trophy-post': { w: 1644, h: 1941, k: [[44.033, 0.5, 0.0, 1.0], [46.96, 0.5, 0.55, 0.95]] },
  'C8-producthunt-golden-kitty-2015-hall-of-fame': { w: 3800, h: 2160, k: [[59.58, 0.5, 0.45, -1], [64.3, 0.5, 0.5, 0.62]] },
  'C11b-nivdror-trophy-video-post': { w: 1920, h: 1080, k: [[68.3, 0.5, 0.4, 0.62], [74.3, 0.5, 0.45, 0.58]] },
  'C11c-arthcmr-trophy-post': { w: 1842, h: 2133, k: [[74.3, 0.5, 0.3, 1.0], [78.3, 0.65, 0.32, 0.7]] },
  'C5b-robinhood-2015-post-graphic': { w: 600, h: 300, k: [[91.833, 0.5, 0.5, 1.0], [93.34, 0.5, 0.5, 0.95]] },
  'C6-robinhood-rewind-2015': { w: 3840, h: 3280, k: [[93.34, 0.45, 0.15, 0.6], [94.6, 0.45, 0.15, 0.58], [96.3, 0.465, 0.79, 0.46], [98.4, 0.465, 0.79, 0.44]], hl: { x0: 0.4518, y0: 0.7982, x1: 0.644, y1: 0.8125, t: 96.5, c: LIME, fill: true } }, // 'the coveted Golden Kitty Award from Product Hunt.' (measured px 1741-2465 x 2626-2655), marker stroke on "the coveted"
  'C7-producthunt-robinhood-awards': { w: 3800, h: 2160, k: [[112.5, 0.5, 0.5, -1], [113.6, 0.5, 0.5, -0.95], [115.0, 0.35, 0.62, 0.42], [116.0, 0.35, 0.62, 0.4]], hl: { x0: 0.295, y0: 0.515, x1: 0.405, y1: 0.735, t: 113.9, c: LIME } },
  'C10-goldenkitty-vip-hero': { w: 3840, h: 2160, k: [[131.233, 0.5, 0.5, -1], [133.52, 0.55, 0.45, 0.85]] },
  'C10-goldenkitty-vip-faq-fan-dedication': { w: 2520, h: 866, k: [[133.52, 0.5, 0.5, -1], [135.0, 0.44, 0.84, 0.68], [142.25, 0.44, 0.84, 0.64]] },
  'C12-dexscreener-golden-gld-chart': { w: 2030, h: 895, k: [[142.25, 0.5, 0.5, -1], [143.2, 0.5, 0.5, -1], [143.5, 0.1, 0.55, 0.45], [144.3, 0.1, 0.55, 0.45], [144.6, 0.5, 0.5, -1], [146.3, 0.5, 0.5, -1], [146.6, 0.4, 0.42, 0.5], [148.6, 0.4, 0.42, 0.5], [149.6, 0.5, 0.5, -1], [152.6, 0.5, 0.5, -1], [152.9, 0.72, 0.45, 0.55], [156.25, 0.8, 0.45, 0.5]] },
  'C16-stock-tokens-backed-1to1': { w: 3840, h: 2000, k: [[196.3, 0.5, 0.45, -1], [197.6, 0.5, 0.45, -0.95], [199.4, 0.66, 0.58, 0.42], [201.54, 0.66, 0.58, 0.4]], hl: { x0: 0.55, y0: 0.555, x1: 0.77, y1: 0.635, t: 199.6, c: GOLD } },
  'C15-tradingview-gld-two-year-percent': { w: 3840, h: 2160, k: [[230.86, 0.5, 0.5, -1], [236.5, 0.55, 0.48, 0.85]] },
  'C10b-goldenkitty-vip-disclaimer': { w: 3840, h: 1500, k: [[248.14, 0.5, 0.5, -1], [249.5, 0.5, 0.5, -0.95], [251.5, 0.5, 0.81, 0.45], [255.66, 0.5, 0.81, 0.43]], hl: { x0: 0.33, y0: 0.74, x1: 0.67, y1: 0.885, t: 252.6, c: GOLD } },
  'C23-theblock-stock-paired-quarter': { w: 2016, h: 222, k: [[277.8, 0.5, 0.5, -1], [283.1, 0.5, 0.5, -0.9]] },
  'C23b-theblock-artificial-inu-sentence': { w: 2016, h: 573, k: [[290.15, 0.5, 0.5, -1], [296.35, 0.5, 0.5, -0.9]] },
  'C31-datawallet-stonkfun-explained-BENCH': { w: 2024, h: 1050, k: [[298.44, 0.5, 0.5, -1], [302.0, 0.38, 0.3, 0.62]] },
  'C24-theblock-stonk-surges-headline': { w: 3840, h: 2000, k: [[304.4, 0.4, 0.45, -1], [305.5, 0.4, 0.45, -0.95], [307.5, 0.32, 0.27, 0.42], [310.24, 0.32, 0.27, 0.4]] },
  'C28-datawallet-stonkfun-holder-rewards-BENCH': { w: 2024, h: 710, k: [[321.82, 0.5, 0.5, -1], [325.1, 0.5, 0.5, -0.88]] },
  'C25-stonkfun-gold-pairs-post': { w: 1842, h: 1797, k: [[332.7, 0.5, 0.5, -1], [333.6, 0.5, 0.6, -0.8], [337.84, 0.5, 0.6, -0.75], [338.6, 0.45, 0.18, 0.7], [342.567, 0.45, 0.18, 0.66]] },
  'C26-cryptogalaxy-gold-narrative-post': { w: 1842, h: 2226, k: [[351.03, 0.5, 0.2, 1.0], [353.92, 0.42, 0.12, 0.75]] },
  'C17-newsroom-mainnet-launch': { w: 3840, h: 3000, k: [[366.45, 0.47, 0.22, 0.7], [371.0, 0.47, 0.13, 0.47]] },
  'C32-docs-about-robinhood-chain': { w: 3840, h: 2160, k: [[371.0, 0.6, 0.3, 0.85], [372.4, 0.6, 0.3, 0.82], [374.0, 0.67, 0.205, 0.45], [375.6, 0.67, 0.205, 0.43]] },
  'C18-defillama-robinhood-chain-dex-volume-daily': { w: 2200, h: 790, k: [[380.5, 0.32, 0.55, 0.62], [386.0, 0.68, 0.55, 0.62]] },
  'C20-tenev-x-post': { w: 1842, h: 627, k: [[414.2, 0.5, 0.5, -1], [418.0, 0.5, 0.5, -0.95], [418.8, 0.5, 0.35, 0.85], [420.9, 0.5, 0.35, 0.82]] },
  'C29-cryptotimes-amc-paired-coin-headline': { w: 3840, h: 2400, k: [[445.4, 0.4, 0.4, 0.8], [453.1, 0.38, 0.26, 0.55]] },
};

// ── frame tables ────────────────────────────────────────────────────────────────────────────────────
const IN_F = 12;                                          // rmn:flip turn-in, 0.40 s over the outgoing cover
const OUT_F = 10;                                         // rmn:flip turn-out onto the new chapter's first visual
const PAUSE_F = Math.round(PAUSE * FPS);
const CARD_START_F = CARD_T.map((c) => Math.round(cardStart(c) * FPS));
const CARD_END_F = CARD_START_F.map((f) => f + PAUSE_F);
const READABLE_S = (PAUSE_F - OUT_F) / FPS;               // card fully readable from the pause frame to the turn-out
if (READABLE_S < 1.0) throw new Error(`title card readable ${READABLE_S}s < 1.0s (comp-build §6)`);
const CARD_IMG = ['title-slides/title-card-ch2.png', 'title-slides/title-card-ch4.png', 'title-slides/title-card-ch5.png', 'title-slides/title-card-ch6.png'];
const nearestCard = (t: number) => CARD_T.reduce((bi, c, i) => (Math.abs(c - t) < Math.abs(CARD_T[bi] - t) ? i : bi), 0);

const START_F = COVERS.map((c) => (c.fx === 'card' ? CARD_END_F[nearestCard(c.tIn)] : F(c.tIn)));
const contiguous = (i: number) => i + 1 < COVERS.length && Math.abs(COVERS[i + 1].tIn - COVERS[i].tOut) < 0.01;
const END_F = COVERS.map((c, i) => (i === COVERS.length - 1 ? DUR : contiguous(i) ? START_F[i + 1] : F(c.tOut)));
const ingressFrames = (c: Cover) =>
  c.fx === 'xfade' || c.fx === 'fade' ? Math.round((c.d ?? 0.35) * FPS) : c.fx === 'state' ? Math.round((c.d ?? 8 / FPS) * FPS) : 0;
const TAIL_F = COVERS.map((_, i) => (contiguous(i) ? ingressFrames(COVERS[i + 1]) : 0));
const GROUP_START_F = COVERS.map((c, i) => {
  let j = i;
  while (c.grp && j > 0 && COVERS[j - 1].grp === c.grp && contiguous(j - 1)) j--;
  return START_F[j];
});
const GROUP_END_F = COVERS.map((c, i) => {
  let j = i;
  while (c.grp && contiguous(j) && COVERS[j + 1].grp === c.grp) j++;
  return END_F[j];
});
const coverAt = (f: number) => {
  for (let i = COVERS.length - 1; i >= 0; i--) if (START_F[i] <= f && f < END_F[i]) return i;
  return -1;
};

// ── absolute clock (§6a: every node handed to an engine reads ONE absolute clock) ──────────────────────
const AbsCtx = createContext(0);
const useAbs = () => useContext(AbsCtx);
const clampX = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const ease = Easing.inOut(Easing.cubic);
const fill: React.CSSProperties = { position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, objectFit: 'cover' };

/** A video that stays on the absolute clock in ANY nesting: clip frame 0 airs at composition frame startAbs. */
const AbsVideo: React.FC<{ src: string; startAbs: number; style?: React.CSSProperties }> = ({ src, startAbs, style }) => {
  const abs = useAbs();
  const local = useCurrentFrame();
  const offset = abs - local - startAbs;
  const v = <OffthreadVideo src={staticFile(src)} muted style={style ?? fill} />;
  if (offset >= 0) return <OffthreadVideo src={staticFile(src)} startFrom={offset} muted style={style ?? fill} />;
  return <Sequence from={-offset} layout="none">{v}</Sequence>;
};

// ── cover content ───────────────────────────────────────────────────────────────────────────────────
const Tag: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ position: 'absolute', right: 44, bottom: 40, padding: '8px 16px', borderRadius: 8, background: 'rgba(0,0,0,.58)',
    color: 'rgba(255,255,255,.92)', fontFamily: DMSANS, fontWeight: 700, fontSize: 22, letterSpacing: '.14em' }}>{text}</div>
);
const Guard: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ position: 'absolute', left: 56, top: 48, padding: '14px 26px', borderRadius: 12, background: 'rgba(10,12,16,.88)',
    border: '3px solid #ff4060', color: '#fff', fontFamily: DMSANS, fontWeight: 700, fontSize: 38, letterSpacing: '.12em' }}>{text}</div>
);
const LineCap: React.FC<{ text: string; local: number }> = ({ text, local }) => {
  const p = interpolate(local, [0, 8], [0, 1], { ...clampX, easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ position: 'absolute', left: 80, bottom: 96, maxWidth: 1350, fontFamily: ANTON, fontSize: 92, lineHeight: 1.02,
      color: '#fff', WebkitTextStroke: '10px #000', paintOrder: 'stroke fill', textShadow: '0 6px 18px rgba(0,0,0,.7)',
      opacity: p, transform: `translateY(${30 * (1 - p)}px)` }}>{text}</div>
  );
};

const ReceiptView: React.FC<{ id: string; tsrc: number; startAbs: number }> = ({ id, tsrc, startAbs }) => {
  const r0 = RECEIPTS[id];
  // crop = keep only image rows y0..y1 (e.g. C13: the pair identity, no live stats in frame); coords stay full-image
  const [y0, y1] = r0.crop ?? [0, 1];
  const r = { ...r0, h: r0.h * (y1 - y0) };
  const fit = Math.max(1, (r.h / r.w) * (16 / 9)) * 1.06;
  const ks = r.k.map(([t, x, y, z]) => ({ t, x, y, z: z < 0 ? fit * -z : z }));
  let x = ks[0].x, y = ks[0].y, z = ks[0].z;
  for (let i = 0; i < ks.length - 1; i++) {
    const a = ks[i], b = ks[i + 1];
    if (tsrc >= a.t) {
      const p = interpolate(tsrc, [a.t, b.t], [0, 1], { ...clampX, easing: ease });
      x = a.x + (b.x - a.x) * p; y = a.y + (b.y - a.y) * p; z = a.z + (b.z - a.z) * p;
    }
  }
  const s = 1920 / (z * r.w);                            // px per image px
  const dw = r.w * s, dh = r.h * s;
  // keep the view inside the image where it can be (no backdrop gap when the view is smaller than the image)
  let cx = x * dw, cy = y * dh;
  if (dw >= 1920) cx = Math.min(Math.max(cx, 960), dw - 960); else cx = dw / 2;
  if (dh >= 1080) cy = Math.min(Math.max(cy, 540), dh - 540); else cy = dh / 2;
  const left = 960 - cx, top = 540 - cy;
  const hlP = r.hl ? interpolate(tsrc, [r.hl.t, r.hl.t + 0.35], [0, 1], clampX) : 0;
  const isVid = id === 'C11b-nivdror-trophy-video-post';
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at center, #171b26 0%, #07090d 78%)', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left, top, width: dw, height: dh, boxShadow: dw < 1900 || dh < 1060 ? '0 30px 90px rgba(0,0,0,.65)' : undefined,
        borderRadius: dw < 1900 || dh < 1060 ? 10 : 0, overflow: 'hidden' }}>
        {isVid ? <AbsVideo src={`receipts/${id}.mp4`} startAbs={startAbs} style={{ width: dw, height: dh }} />
          : <Img src={staticFile(`receipts/${id}.png`)} style={{ position: 'absolute', left: 0, top: -y0 * r0.h * s, width: dw, height: r0.h * s, display: 'block' }} />}
        {r.hl && hlP > 0 && r.hl.fill && (
          <div style={{ position: 'absolute', left: r.hl.x0 * dw, top: (r.hl.y0 - y0) * r0.h * s, width: (r.hl.x1 - r.hl.x0) * dw, height: (r.hl.y1 - r.hl.y0) * r0.h * s,
            background: r.hl.c, mixBlendMode: 'multiply', borderRadius: 6, transformOrigin: '0 50%', transform: `scaleX(${hlP})` }} />
        )}
        {r.hl && hlP > 0 && !r.hl.fill && (
          <div style={{ position: 'absolute', left: r.hl.x0 * dw, top: (r.hl.y0 - y0) * r0.h * s, width: (r.hl.x1 - r.hl.x0) * dw, height: (r.hl.y1 - r.hl.y0) * r0.h * s,
            border: `5px solid ${r.hl.c}`, borderRadius: 14, opacity: hlP, boxShadow: `0 0 28px ${r.hl.c}88`,
            transform: `scale(${1.06 - 0.06 * hlP})` }} />
        )}
      </div>
    </AbsoluteFill>
  );
};

const ChartFor: React.FC<{ c: Cover; tsrc: number }> = ({ c, tsrc }) => {
  if (c.ref === 'cap-vs-volume') return <CapVsVolume t={tsrc} />;
  if (c.ref === 'C2') return <C2Formula t={tsrc} />;
  if (c.ref === 'C3') return <C3Fees t={tsrc} />;
  if (c.ref === 'C19a') return <C19a t={tsrc} />;
  if (c.ref === 'C19b') return <C19b t={tsrc} />;
  if (c.ref === 'app-users-share') return <AppUsersShare t={tsrc} />;
  throw new Error(`no animated chart component for ${c.ref}`);
};

const slidePath = (ref: string) => (DIAGRAMS.has(ref) ? `diagrams/${ref}.png` : `card-slides/${ref}.png`);

/** The cover's picture at the ABSOLUTE clock. `still` = transition frame (a motion clip shows its still). */
const CoverContent: React.FC<{ i: number; still?: boolean }> = ({ i, still }) => {
  const abs = useAbs();
  const c = COVERS[i];
  const st = START_F[i];
  const local = abs - st;
  const tsrc = c.tIn + local / FPS;
  const dur = Math.max(1, END_F[i] - st);
  let body: React.ReactNode;
  if (c.kind === 'still') {
    const k = 1 + 0.06 * interpolate(local, [0, dur], [0, 1], clampX);   // gentle Ken Burns push on AI stills
    body = <Img src={staticFile(`img/${c.ref}.png`)} style={{ ...fill, transform: `scale(${k})` }} />;
  } else if (c.kind === 'vid') {
    if (MOTION[c.ref]) {
      body = still || local < 0 ? <Img src={staticFile(`img/${MOTION[c.ref]}.png`)} style={fill} />
        : <AbsVideo src={`img-motion/${c.ref}.mp4`} startAbs={st} />;            // from clip 0, no extra push
    } else {
      body = <AbsVideo src={`vid/${c.ref}.mp4`} startAbs={st} />;
    }
  } else if (c.kind === 'receipt') {
    body = <ReceiptView id={c.ref} tsrc={tsrc} startAbs={st} />;
  } else if (c.kind === 'chart') {
    body = <AbsoluteFill style={{ background: '#0a0c10' }}><ChartFor c={c} tsrc={tsrc} /></AbsoluteFill>;
  } else {
    // deck (diagram state) / container (card-slide state): a gentle push across the whole group (§7a, max 4%)
    const gs = GROUP_START_F[i], ge = GROUP_END_F[i];
    const k = 1 + 0.035 * interpolate(abs, [gs, ge], [0, 1], { ...clampX, easing: Easing.inOut(Easing.sin) });
    const imgStyle: React.CSSProperties = { ...fill, transform: `scale(${k})` };
    if (c.fx === 'pulse' && c.alt) {
      const per = (c.sf ?? 1) * FPS;
      const o = 0.5 - 0.5 * Math.cos((2 * Math.PI * Math.max(0, local)) / per);
      body = (
        <AbsoluteFill style={{ background: '#0a0c10' }}>
          <Img src={staticFile(slidePath(c.alt))} style={imgStyle} />
          <Img src={staticFile(slidePath(c.ref))} style={{ ...imgStyle, opacity: o }} />
        </AbsoluteFill>
      );
    } else {
      body = <AbsoluteFill style={{ background: '#0a0c10' }}><Img src={staticFile(slidePath(c.ref))} style={imgStyle} /></AbsoluteFill>;
    }
  }
  return (
    <AbsoluteFill style={{ background: '#000', overflow: 'hidden' }}>
      {body}
      {LINE_CAPS[c.ref] && <LineCap text={LINE_CAPS[c.ref]} local={local} />}
      {AI_TAG.has(c.ref) && <Tag text="AI ILLUSTRATION" />}
      {GUARD[c.ref] && <Guard text={GUARD[c.ref]} />}
    </AbsoluteFill>
  );
};

/** Track wrapper: the row's ingress (hand:xfade-scale / hand:fade / state cross-fade); hard cuts otherwise. */
const CoverTrackItem: React.FC<{ i: number }> = ({ i }) => {
  const abs = useAbs();
  const c = COVERS[i];
  const n = ingressFrames(c);
  const local = abs - START_F[i];
  let opacity = 1, scale = 1;
  if (n > 0) {
    opacity = interpolate(local, [0, n], [0, 1], clampX);
    if (c.fx === 'xfade') scale = interpolate(local, [0, n], [c.kind === 'chart' ? 0.96 : 0.93, 1], { ...clampX, easing: Easing.out(Easing.cubic) });
  }
  return (
    <AbsoluteFill style={{ opacity, transform: `scale(${scale})` }}>
      <CoverContent i={i} />
    </AbsoluteFill>
  );
};

// ── library engines (glitch-still / MELT / SPIN), each in a Sequence of EXACTLY its window (§6a) ──────
const ENGINE_TX = COVERS.map((c, i) => ({ c, i })).filter(({ c }) => c.fx === 'glitch' || c.fx === 'melt' || c.fx === 'spin').map(({ c, i }) => {
  const row = getTransition(c.tid!);
  if (!row) throw new Error(`unknown transition id ${c.tid}`);
  const win = framesForRow(row, FPS);
  const p = row.params as any;
  // the engine's own A->B swap point, in seconds into its window
  const swapSec = row.engine === 'GlitchTurbulentDisplace' ? p.cut : row.engine === 'PerspectiveEase' ? p.outPhase.win[0] : p.cut * row.durationSeconds;
  const from = START_F[i] - Math.round(swapSec * FPS);    // the swap frame lands ON the cut
  return { i, id: c.tid!, win, from };
});
const imgSrcOf = (i: number) => {
  const c = COVERS[i];
  if (CUTFRAME[c.ref]) return CUTFRAME[c.ref];
  if (c.kind === 'still') return `img/${c.ref}.png`;
  if (c.kind === 'deck' || c.kind === 'container') return slidePath(c.ref);
  throw new Error(`no still for ${c.ref} (an image-only engine needs one)`);
};
const EngineLayer: React.FC = () => (
  <>
    {ENGINE_TX.map(({ i, id, win, from }) => {
      const prev = i - 1;
      const canvas = COVERS[i].fx === 'melt';            // MeltEquidistant is image-only: hand it stills
      return (
        <Sequence key={`tx${i}`} from={from} durationInFrames={win}>
          <TransitionClip
            id={id}
            cutFrame={Math.round(win / 2)}
            sfx={false}
            outgoing={() => (CUTFRAME[COVERS[prev].ref] ? <Img src={staticFile(CUTFRAME[COVERS[prev].ref])} style={fill} /> : <CoverContent i={prev} still />)}
            incoming={() => <CoverContent i={i} still />}
            fromSrc={canvas ? imgSrcOf(prev) : undefined}
            toSrc={canvas ? imgSrcOf(i) : undefined}
          />
        </Sequence>
      );
    })}
  </>
);

// ── rmn:flip title cards (@remotion/transitions flip presentation, used directly on the self-contained card
//    scene; the spine is never wrapped). Turn IN over the outgoing cover, hold through the 1.5 s pause, turn OUT
//    onto the new chapter's first visual in the last 10 frames. readable = READABLE_S (asserted >= 1.0 s). ─────
const FlipComp = flip({ direction: 'from-right' }).component as React.FC<any>;
const CardScene: React.FC<{ k: number }> = ({ k }) => {
  const abs = useAbs();
  const cs = CARD_START_F[k], ce = CARD_END_F[k];
  const card = <Img src={staticFile(CARD_IMG[k])} style={fill} />;
  const flipPair = (p: number, out: React.ReactNode, inn: React.ReactNode) => (
    <AbsoluteFill style={{ background: '#000' }}>
      <FlipComp presentationDirection="exiting" presentationProgress={p} passedProps={{ direction: 'from-right' }}>{out}</FlipComp>
      <FlipComp presentationDirection="entering" presentationProgress={p} passedProps={{ direction: 'from-right' }}>{inn}</FlipComp>
    </AbsoluteFill>
  );
  if (abs < cs) {
    const p = interpolate(abs, [cs - IN_F, cs], [0, 1], { ...clampX, easing: ease });
    const prevI = coverAt(cs - IN_F);
    return flipPair(p, prevI >= 0 ? <CoverContent i={prevI} /> : null, card);
  }
  if (abs < ce - OUT_F) return <AbsoluteFill>{card}</AbsoluteFill>;
  const p = interpolate(abs, [ce - OUT_F, ce], [0, 1], { ...clampX, easing: ease });
  const nextI = coverAt(ce);
  return flipPair(p, card, nextI >= 0 ? <CoverContent i={nextI} still /> : null);
};

// ── FACE layer: spine (VO audio) + measured reframe + punch-ins; all nine FACE windows air pre-framed swap clips ──────────
const punchAt = (abs: number) => {
  const fi = FACES.findIndex((w) => abs >= F(w.a) && abs < F(w.b));
  if (fi < 0) return 1;
  const w = FACES[fi];
  const p = PUNCH.find((q) => q.t >= w.a && q.t < w.b);
  if (!p) return 1;
  const pf = F(p.t);
  if (abs < pf) return 1;
  if (p.r <= 0) return p.s;
  return interpolate(abs, [pf, pf + Math.max(1, Math.round(p.r * FPS))], [1, p.s], { ...clampX, easing: Easing.out(Easing.cubic) });
};
const SpineLayer: React.FC = () => {
  const abs = useAbs();
  const punch = punchAt(abs);
  return (
    <AbsoluteFill style={{ background: '#000', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', transformOrigin: `${FACE_POINT.x}px ${FACE_POINT.y}px`, transform: `scale(${punch})` }}>
        <OffthreadVideo src={staticFile('spine.mp4')} style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080,
          transformOrigin: '0 0', transform: `translate(${FACE_REFRAME.x}px, ${FACE_REFRAME.y}px) scale(${FACE_REFRAME.scale})` }} />
      </div>
    </AbsoluteFill>
  );
};
const SwapClip: React.FC<{ src: string; head: number }> = ({ src, head }) => {
  const abs = useAbs();
  const punch = punchAt(abs);
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: '#000' }}>
      <div style={{ position: 'absolute', inset: 0, transformOrigin: `${FACE_POINT.x}px ${FACE_POINT.y}px`, transform: `scale(${punch})` }}>
        {/* PRE-FRAMED (§3b): full-frame, NO FACE_REFRAME, from window_starts_at_clip_s, muted (the spine carries the voice) */}
        <OffthreadVideo src={staticFile(src)} startFrom={head} muted style={fill} />
      </div>
    </AbsoluteFill>
  );
};

// ── overlays: light leak (overlays.md §1), film burn (hand:film-burn), captions (§8) ─────────────────
const LightLeak: React.FC<{ n: number }> = ({ n }) => {
  const f = useCurrentFrame();
  const p = f / Math.max(1, n);
  const o = 0.3 * Math.sin(Math.PI * Math.min(1, Math.max(0, p)));
  const x = 15 + 70 * p;
  return (
    <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: o, pointerEvents: 'none',
      background: `radial-gradient(ellipse 55% 75% at ${x}% 30%, rgba(255,200,110,1) 0%, rgba(255,140,40,.75) 35%, rgba(255,80,20,0) 72%),
        radial-gradient(ellipse 40% 60% at ${100 - x * 0.8}% 85%, rgba(255,215,0,.8) 0%, rgba(255,120,0,0) 70%)` }} />
  );
};
const FilmBurn: React.FC<{ n: number; peak: number }> = ({ n, peak }) => {
  const f = useCurrentFrame();
  const p = (f + 0.5) / n;
  const e = Math.pow(Math.sin(Math.PI * Math.min(1, Math.max(0, p))), 1.4) * peak;
  const x = 25 + 50 * p;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: e,
        background: `radial-gradient(circle at ${x}% 42%, rgba(255,250,235,1) 0%, rgba(255,196,96,.95) 20%, rgba(255,112,24,.78) 42%, rgba(150,30,0,.4) 64%, rgba(0,0,0,0) 82%),
          radial-gradient(circle at ${100 - x}% 80%, rgba(255,170,60,.9) 0%, rgba(200,60,0,.35) 40%, rgba(0,0,0,0) 70%)` }} />
      <AbsoluteFill style={{ background: 'rgb(255,236,200)', opacity: Math.pow(e, 3) * 0.55, mixBlendMode: 'screen' }} />
    </AbsoluteFill>
  );
};

const CAPS = ZCAPTIONS.map((c) => ({ tf: sh(c.t), h: c.h.replace(/\\/g, '') }));
const CAP_WIN_F = CAPTION_WINDOWS.map(([a, b]) => [F(a), F(b)] as [number, number]);   // frame-exact: clears ON the face-out cut frame
const Captions: React.FC = () => {
  const abs = useAbs();
  const t = abs / FPS;
  if (!CAP_WIN_F.some(([a, b]) => abs >= a && abs < b)) return null;  // only inside the caption windows
  let cur: { tf: number; h: string } | null = null;
  for (const c of CAPS) { if (c.tf <= t) cur = c; else break; }
  if (!cur) return null;
  const nextT = (CAPS.find((c) => c.tf > cur!.tf) || { tf: Infinity }).tf;
  if (t >= Math.min(nextT, cur.tf + 1.3)) return null;
  const lf = (t - cur.tf) * FPS;
  const pop = interpolate(lf, [0, 3, 6], [0.7, 1.12, 1], clampX);
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 110, pointerEvents: 'none' }}>
      <div style={{ fontFamily: `${MONTSERRAT},'Arial Black','Segoe UI',sans-serif`, fontWeight: 900, fontSize: 92, color: '#fff',
        textTransform: 'lowercase', WebkitTextStroke: '12px #000', paintOrder: 'stroke fill', transform: `scale(${pop})`,
        textAlign: 'center', lineHeight: 1.05, maxWidth: 1600 }}>{cur.h}</div>
    </AbsoluteFill>
  );
};

// ── LIGHT LEAKS: >5 s FACE holds only, centred pulse d = min(len - 2, 4) (F1, F4, F7) ────────────────
const LEAKS = FACES.filter((w) => w.b - w.a > 5).map((w) => {
  const m = (w.a + w.b) / 2, d = Math.min(w.b - w.a - 2, 4);
  return { a: m - d / 2, b: m + d / 2 };
});

// ── the composition ─────────────────────────────────────────────────────────────────────────────────
export const GoldenKitty: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsContainer frame={frame} />
  );
};
const AbsContainer: React.FC<{ frame: number }> = ({ frame }) => (
  <AbsCtx.Provider value={frame}>
    <AbsoluteFill style={{ background: '#000' }}>
      <SpineLayer />
      {FACES.filter((w) => w.swap).map((w) => (
        <Sequence key={w.swap} from={F(w.a)} durationInFrames={F(w.b) - F(w.a)}>
          <SwapClip src={w.swap!} head={w.head ?? 12} />
        </Sequence>
      ))}
      {LEAKS.map((l, i) => (
        <Sequence key={`leak${i}`} from={F(l.a)} durationInFrames={F(l.b) - F(l.a)}>
          <LightLeak n={F(l.b) - F(l.a)} />
        </Sequence>
      ))}
      {COVERS.map((c, i) => (
        <Sequence key={`cov${i}`} from={START_F[i]} durationInFrames={Math.min(DUR, END_F[i] + TAIL_F[i]) - START_F[i]}>
          <CoverTrackItem i={i} />
        </Sequence>
      ))}
      <EngineLayer />
      {BURNS.map((b, i) => {
        const n = Math.round(b.d * FPS);
        return (
          <Sequence key={`burn${i}`} from={Math.max(0, F(b.t) - Math.round(n / 2))} durationInFrames={n}>
            <FilmBurn n={n} peak={b.d >= 0.7 ? 1 : 0.8} />
          </Sequence>
        );
      })}
      {CARD_T.map((_, k) => (
        <Sequence key={`card${k}`} from={CARD_START_F[k] - IN_F} durationInFrames={IN_F + PAUSE_F}>
          <CardScene k={k} />
        </Sequence>
      ))}
      <Captions />
    </AbsoluteFill>
  </AbsCtx.Provider>
);

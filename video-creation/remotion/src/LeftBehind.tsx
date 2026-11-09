// LeftBehind.tsx: "If You're Refusing AI at Work, You'll Be Fired First" (longform-edited, project left-behind).
// Built TO the approved blueprint: media/left-behind/EDIT-PLAN.md (event log) + TRANSITIONS.md / TRANSITION-PLAN.json +
// COVER-PLAN.json + AS-RECORDED.md + PROJECT-LOG Open flags. Skeletons: skills/comp-build/comp-build.md (self-contained).
// Mike's rulings honoured here: THE PACE IS SLOW (soft cross-fades, paper sheet, warm film burn on the face, no glitch / whip /
// stinger, one gentle punch + soft leak); FACE windows air as the Higgsfield office + shirt/tie restyle (pre-framed, no
// FACE_REFRAME on the swap clip, section 3b); LIGHT container theme (the PNG cards / title slides / C2 are light); no medical
// count / no "found by AI" tally on screen. No music, no SFX, no watermark in the comp (post-mix owns audio, section 9).
// Public dir = media/left-behind/assets (render via scripts/render_comp.py).
import React, { createContext, useContext } from 'react';
import {
  AbsoluteFill, Easing, Freeze, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame,
} from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { flip } from '@remotion/transitions/flip';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadDMSans } from '@remotion/google-fonts/DMSans';
import { ENGINES, getTransition } from './transitions/registry';
import { TransitionClip } from './transitions/TransitionClip';
import { ZCAPTIONS, CAPTION_WINDOWS } from './LeftBehindCaptions';
import { C2Chart } from './LeftBehindCharts';

const { fontFamily: MONTSERRAT } = loadMontserrat('normal', { weights: ['900'], subsets: ['latin'] });
const { fontFamily: DMSANS } = loadDMSans('normal', { weights: ['700'], subsets: ['latin'] });

// ---------------------------------------------------------------------------------------------------------------
// 2. TIMING: spine/ALL.f.paused.json pauses[] IS the time map (cards = 1.5 s, clip inserts = the clip length).
// ---------------------------------------------------------------------------------------------------------------
export const FPS = 30;
export const SPINE_SECS = 398.8;                 // SOURCE spine spine/ALL.d.desilenced.mp4
export const PAUSE = 1.5;                        // pause_s (title cards)
export const CARD_T = [106.865, 187.445];        // CH2 THE CHANGING WORLD, CH3 THE DIVIDE (snapped troughs)
// every pause, cards AND clip inserts (lint-pause-silence / check_broll_motion read this table)
export const INSERTS = [
  { at: 26.475, dur: 15.5 },
  { at: 106.865, dur: 1.5 },
  { at: 187.445, dur: 1.5 },
  { at: 194.385, dur: 13.2 },
];
const CLIP_INSERTS = [
  { at: 26.475, frames: 465, clip: 'CLIP-2-armstrong-fired' },   // Brian Armstrong, own voice in the VO
  { at: 194.385, frames: 396, clip: 'CLIP-3-vance-paris' },      // JD Vance, own voice in the VO
];
const pausedBefore = (t: number, inclusive: boolean) =>
  INSERTS.filter((p) => (inclusive ? p.at <= t : p.at < t)).reduce((a, p) => a + p.dur, 0);
export const sh = (t: number) => t + pausedBefore(t, true);              // source -> paused-spine secs
const F = (t: number) => Math.round(sh(t) * FPS);                        // source secs -> frame
const PF = (at: number) => Math.round((at + pausedBefore(at, false)) * FPS);   // a pause's own FIRST frame
// = the paused spine's frame count (ceil(430.533 s x 30) = 12916; check_spine_fps.py)
export const DUR = Math.ceil((SPINE_SECS + INSERTS.reduce((a, p) => a + p.dur, 0)) * FPS + 0.99);

// The absolute composition frame, published at the root: every node handed to an engine / Freeze reads THIS (6a).
const AbsCtx = createContext(0);
const useAbs = () => useContext(AbsCtx);
const clamp01 = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const inOut = Easing.inOut(Easing.sin);

// ---------------------------------------------------------------------------------------------------------------
// 3a. FACE REFRAME (assets/face-reframe.json, measured, never hand-tuned) + 3b the pre-framed background swaps
// ---------------------------------------------------------------------------------------------------------------
export const FACE_REFRAME = { scale: 1.106, x: -97, y: -88 };
const FACE_POINT = { x: 960, y: 432 };     // face_point_out
// AS-RECORDED FACE windows (source s). Each airs as assets/face-swap/F<n>-higgsfield-bg-swap.mp4 from its JSON's
// window_starts_at_clip_frame, full frame, WITHOUT FACE_REFRAME (pre-framed), muted (the spine carries the voice).
const FACES = [
  { n: 1, w: [0.0, 8.367], head: 12 },
  { n: 2, w: [96.533, 99.367], head: 27 },
  { n: 3, w: [106.967, 111.1], head: 12 },
  { n: 4, w: [263.633, 268.667], head: 12 },
  { n: 5, w: [304.133, 308.733], head: 12 },
] as const;
// [PUNCH-IN] F5, the video's only punch point: ON the desilencer join 305.533 (jumpcuts-final.json), gentle ~10% (slow pace)
const PUNCH = { t: 305.533, end: 308.733, scale: 1.1 };
const punchAt = (abs: number) => (abs >= F(PUNCH.t) && abs < F(PUNCH.end) + 12 ? PUNCH.scale : 1);

// ---------------------------------------------------------------------------------------------------------------
// 4. COVERS: one row per state / sub-point, straight from the EDIT-PLAN event log (source seconds).
//   inT = the planned ingress (TRANSITION-PLAN id in the trailing comment): burn = hand:film-burn (face-cut),
//   fade = hand:fade (broll-fade), xfade = hand:xfade-scale (container-xfade), paper = hand:paper-sheet,
//   xwarp = hand:cross-warp (still-xwarp), swap = a STATE SWAP (same container, quiet cross-fade, no ingress move),
//   none = sits under a clip insert. edge pre/post = a clip-insert lead still (ends / starts under the clip).
//   mo = the [MOTION] lib move wrapping that receipt for its whole slot.
// ---------------------------------------------------------------------------------------------------------------
type Kind = 'vid' | 'still' | 'receipt' | 'deck' | 'container' | 'chart' | 'whiteboard' | 'clipstill';
type InT = 'burn' | 'fade' | 'xfade' | 'paper' | 'xwarp' | 'swap' | 'none';
type Cover = {
  tIn: number; tOut: number; kind: Kind; ref: string; inT: InT; inD: number;
  state?: string; from?: number; edge?: 'pre' | 'post'; mo?: string;
};
// prettier-ignore
const COVERS: Cover[] = [
  // CH1 FIRED FIRST
  { tIn: 8.367, tOut: 9.6, kind: 'receipt', ref: 'C3-challenger-header', inT: 'burn', inD: 0.27 },          // hand:film-burn F1 out
  { tIn: 9.6, tOut: 14.58, kind: 'receipt', ref: 'C3-challenger-ai-paragraph', inT: 'xfade', inD: 0.6 },    // hand:xfade-scale
  { tIn: 14.58, tOut: 18.38, kind: 'vid', ref: 'BR-1-fired-box', inT: 'fade', inD: 0.5 },                    // hand:fade
  { tIn: 18.38, tOut: 22.14, kind: 'receipt', ref: 'C13-techcrunch-coinbase', inT: 'xfade', inD: 0.6, mo: 'motion-3d-pan-1-right' },
  { tIn: 22.14, tOut: 26.475, kind: 'clipstill', ref: 'CLIP-2-armstrong-fired-first', inT: 'xfade', inD: 0.6, edge: 'pre' },
  { tIn: 26.475, tOut: 29.28, kind: 'clipstill', ref: 'CLIP-2-armstrong-fired-last', inT: 'none', inD: 0, edge: 'post' },
  { tIn: 29.28, tOut: 36.54, kind: 'receipt', ref: 'C12-fortune-accenture', inT: 'xfade', inD: 0.6 },       // hand:xfade-scale
  { tIn: 36.54, tOut: 39.6, kind: 'vid', ref: 'BR-2-office-lights-off', inT: 'fade', inD: 0.5 },            // hand:fade
  { tIn: 39.6, tOut: 58.5, kind: 'whiteboard', ref: 'WB1', from: 0, inT: 'paper', inD: 0.37 },              // hand:paper-sheet
  { tIn: 58.5, tOut: 61.92, kind: 'vid', ref: 'BR-15-dev-reading-phone', inT: 'fade', inD: 0.5 },           // hand:fade
  { tIn: 61.92, tOut: 86.94, kind: 'whiteboard', ref: 'WB2', from: 0, inT: 'paper', inD: 0.37 },            // hand:paper-sheet
  { tIn: 86.94, tOut: 90.68, kind: 'receipt', ref: 'C22-only-18-months-left-thumb', inT: 'xfade', inD: 0.6, mo: 'motion-3d-orbit-1-t-left' },
  { tIn: 90.68, tOut: 93.28, kind: 'deck', ref: 'K1-within-18-months', state: 'base', inT: 'xfade', inD: 0.6 },
  { tIn: 93.28, tOut: 94.2, kind: 'container', ref: 'K1-within-18-months-s1', state: 's1', inT: 'swap', inD: 0.4 },
  { tIn: 94.2, tOut: 94.94, kind: 'container', ref: 'K1-within-18-months-s2', state: 's2', inT: 'swap', inD: 0.4 },
  { tIn: 94.94, tOut: 96.38, kind: 'container', ref: 'K1-within-18-months-s3', state: 's3', inT: 'swap', inD: 0.4 },
  { tIn: 96.38, tOut: 96.533, kind: 'container', ref: 'K1-within-18-months-s4', state: 's4', inT: 'swap', inD: 0.15 },
  // F2 face 96.533-99.367
  { tIn: 99.367, tOut: 103.1, kind: 'still', ref: 'IMG-1-empty-office-night', inT: 'burn', inD: 0.27 },     // hand:film-burn F2 out
  { tIn: 103.1, tOut: 106.967, kind: 'vid', ref: 'BR-3-humanoid-robot-factory', inT: 'fade', inD: 0.5 },    // hand:fade (runs under the CH2 card)
  // CH2 card (pause 106.865) + F3 face 106.967-111.1
  { tIn: 111.1, tOut: 114.0, kind: 'vid', ref: 'BR-4-scientist-microscope', inT: 'burn', inD: 0.27 },       // hand:film-burn F3 out
  { tIn: 114.0, tOut: 119.02, kind: 'deck', ref: 'K2-2026-breakthroughs', state: 'base', inT: 'xfade', inD: 0.6 },
  { tIn: 119.02, tOut: 132.44, kind: 'receipt', ref: 'C5-insilico-phase3', inT: 'xfade', inD: 0.6 },
  { tIn: 132.44, tOut: 135.78, kind: 'still', ref: 'IMG-2-capsule-lungs', inT: 'xwarp', inD: 0.6 },         // hand:cross-warp
  { tIn: 135.78, tOut: 146.78, kind: 'receipt', ref: 'C6-gut-redmod', inT: 'xfade', inD: 0.6 },
  { tIn: 146.78, tOut: 149.68, kind: 'vid', ref: 'BR-5-ct-scanner', inT: 'fade', inD: 0.5 },
  { tIn: 149.68, tOut: 160.76, kind: 'receipt', ref: 'C7-technion-deephhf', inT: 'xfade', inD: 0.6 },
  { tIn: 160.76, tOut: 164.68, kind: 'vid', ref: 'BR-6-ecg-electrodes', inT: 'fade', inD: 0.5 },
  { tIn: 164.68, tOut: 169.98, kind: 'receipt', ref: 'C8-tenpoint-yuvezzi', inT: 'xfade', inD: 0.6 },
  { tIn: 169.98, tOut: 174.84, kind: 'receipt', ref: 'C9-technion-implant', inT: 'xfade', inD: 0.6, mo: 'motion-3d-pan-2-down' },
  { tIn: 174.84, tOut: 185.6, kind: 'receipt', ref: 'C10-frontiers-psilocybin', inT: 'xfade', inD: 0.6 },
  { tIn: 185.6, tOut: 187.52, kind: 'still', ref: 'IMG-3-sunrise-research-campus', inT: 'xwarp', inD: 0.6 }, // (runs under the CH3 card)
  // CH3 THE DIVIDE (card pause 187.445)
  { tIn: 187.52, tOut: 190.26, kind: 'vid', ref: 'BR-7-highway-light-trails', inT: 'fade', inD: 0.5 },      // the card exits onto it (hand:fade)
  { tIn: 190.26, tOut: 194.385, kind: 'clipstill', ref: 'CLIP-3-vance-paris-first', inT: 'xfade', inD: 0.6, edge: 'pre' },
  { tIn: 194.385, tOut: 197.98, kind: 'clipstill', ref: 'CLIP-3-vance-paris-last', inT: 'none', inD: 0, edge: 'post' },
  { tIn: 197.98, tOut: 201.96, kind: 'still', ref: 'IMG-4-vial-velvet-rope', inT: 'xwarp', inD: 0.6 },
  { tIn: 201.96, tOut: 213.42, kind: 'chart', ref: 'C2-who-owns-the-stock-market', inT: 'xfade', inD: 0.5 },
  { tIn: 213.42, tOut: 216.24, kind: 'receipt', ref: 'C17-mittr-lenmeldy', inT: 'xfade', inD: 0.5 },
  { tIn: 216.24, tOut: 238.7, kind: 'whiteboard', ref: 'WB3', from: 0, inT: 'paper', inD: 0.37 },
  { tIn: 238.7, tOut: 245.38, kind: 'receipt', ref: 'C16-isomorphic-2-1b', inT: 'xfade', inD: 0.6 },
  { tIn: 245.38, tOut: 263.6, kind: 'whiteboard', ref: 'WB4', from: 0, inT: 'paper', inD: 0.37 },
  // F4 face 263.633-268.667
  { tIn: 268.667, tOut: 271.28, kind: 'vid', ref: 'BR-8-envelope-opening', inT: 'burn', inD: 0.27 },       // hand:film-burn F4 out
  { tIn: 271.28, tOut: 281.02, kind: 'receipt', ref: 'C19-nber-w32719', inT: 'xfade', inD: 0.6 },
  { tIn: 281.02, tOut: 281.94, kind: 'deck', ref: 'K3-basics-not-assets', state: 'base', inT: 'xfade', inD: 0.6 },
  { tIn: 281.94, tOut: 284.42, kind: 'container', ref: 'K3-basics-not-assets-s1', state: 's1', inT: 'swap', inD: 0.4 },
  { tIn: 284.42, tOut: 285.6, kind: 'container', ref: 'K3-basics-not-assets-s2', state: 's2', inT: 'swap', inD: 0.4 },
  { tIn: 285.6, tOut: 287.96, kind: 'container', ref: 'K3-basics-not-assets-s3', state: 's3', inT: 'swap', inD: 0.4 },
  { tIn: 287.96, tOut: 288.84, kind: 'container', ref: 'K3-basics-not-assets-s4', state: 's4', inT: 'swap', inD: 0.4 },
  { tIn: 288.84, tOut: 292.4, kind: 'still', ref: 'IMG-5-man-on-sofa-tv', inT: 'xwarp', inD: 0.6 },
  { tIn: 292.4, tOut: 294.24, kind: 'vid', ref: 'BR-9-candle-blown-out', inT: 'fade', inD: 0.5 },
  // CH4 OWN ASSETS (cardless)
  { tIn: 294.24, tOut: 298.2, kind: 'vid', ref: 'BR-10-bills-calculator', inT: 'fade', inD: 0.5 },
  { tIn: 298.2, tOut: 302.08, kind: 'receipt', ref: 'C24-outlook-altman', inT: 'xfade', inD: 0.6 },
  { tIn: 302.08, tOut: 304.133, kind: 'still', ref: 'IMG-6-shrinking-room', inT: 'xwarp', inD: 0.6 },
  // F5 face 304.133-308.733 (punch + lib:lightleaks-soft-1 at 305.533)
  { tIn: 308.78, tOut: 329.32, kind: 'whiteboard', ref: 'WB5', from: 0, inT: 'paper', inD: 0.37 },         // hand:film-burn F5 out + paper sheet
  { tIn: 329.32, tOut: 335.86, kind: 'receipt', ref: 'C20-showcase', inT: 'xfade', inD: 0.6, mo: 'motion-3d-pan-1-down' },
  { tIn: 335.86, tOut: 350.5, kind: 'receipt', ref: 'C20-showcase', inT: 'xfade', inD: 0.6 },              // stage 2: the list rows + gold boxes (Mike 2026-11-02: LAB shown; PIPPIN 89x from the showcase, the X thread masked LAB)
  { tIn: 350.5, tOut: 355.1, kind: 'receipt', ref: 'C25-perpspad-showcase', inT: 'xfade', inD: 0.6 },
  { tIn: 355.1, tOut: 358.74, kind: 'vid', ref: 'BR-11-group-phones', inT: 'fade', inD: 0.5 },
  { tIn: 358.74, tOut: 362.68, kind: 'vid', ref: 'BR-12-cash-pile-growing', inT: 'fade', inD: 0.5 },
  { tIn: 362.68, tOut: 365.14, kind: 'still', ref: 'IMG-7-code-monkey', inT: 'xwarp', inD: 0.6 },
  { tIn: 365.14, tOut: 367.86, kind: 'vid', ref: 'BR-13-code-scrolling', inT: 'fade', inD: 0.5 },
  { tIn: 367.86, tOut: 373.52, kind: 'receipt', ref: 'C23-cryptorich-home', inT: 'xfade', inD: 0.6, mo: 'motion-3d-offset-1-right-up' },
  { tIn: 373.52, tOut: 380.34, kind: 'receipt', ref: 'C23c-history-of-crypto-title-slide', inT: 'xfade', inD: 0.6 },
  { tIn: 380.34, tOut: 383.32, kind: 'deck', ref: 'K4-cta', state: 'base', inT: 'xfade', inD: 0.6 },
  { tIn: 383.32, tOut: 384.32, kind: 'container', ref: 'K4-cta-s1', state: 's1', inT: 'swap', inD: 0.4 },
  { tIn: 384.32, tOut: 389.26, kind: 'container', ref: 'K4-cta-s2', state: 's2', inT: 'swap', inD: 0.4 },
  { tIn: 389.26, tOut: 393.22, kind: 'vid', ref: 'BR-14-skyline-golden-hour', inT: 'fade', inD: 0.5 },
  { tIn: 393.22, tOut: 398.8, kind: 'receipt', ref: 'C23-cryptorich-home', inT: 'xfade', inD: 0.6 },        // the sign-off link card
];
// Planned transition ids, by bucket (grep the plan against this): hand:film-burn x9 (FilmBurn, FACE edges) ·
// hand:xfade-scale / hand:fade / hand:paper-sheet / hand:cross-warp (CoverSeq ingress) · hand:fade insert-in / insert-out
// x2 each (ClipInsert) · rmn:flip x2 (TitleCard) · lib:lightleaks-soft-1 (F5 punch-leak, below) · lib:motion-3d-* (MotionWrap).
// The plan's face_leak_set also names soft-2 / soft-3; only soft-1 is placed (one punch point).
// DIAGRAM_REFS: (none)
// (end declared refs)

// Captions: ONLY inside the FACE caption windows (generated LeftBehindCaptions.ts; F2 / F3 / F5 are under the 5 s hold
// minimum and stay uncaptioned per captions.json skipped_short_faces). Literal copy for lint_covers; asserted equal below.
const CAPTION_SRC: [number, number][] = [[0.0, 8.367], [263.633, 268.667]];
if (JSON.stringify(CAPTION_SRC) !== JSON.stringify(CAPTION_WINDOWS)) throw new Error('CAPTION_SRC drifted from LeftBehindCaptions.ts');

// b-roll native rates: 24 / 25 fps clips play frame-for-frame (playbackRate = 30 / fps), comp-build section 11
const VID_FPS: Record<string, number> = {
  'BR-1-fired-box': 24000 / 1001,
  'BR-2-office-lights-off': 24 / 1,
  'BR-4-scientist-microscope': 25 / 1,
  'BR-5-ct-scanner': 25 / 1,
  'BR-6-ecg-electrodes': 25 / 1,
  'BR-7-highway-light-trails': 25 / 1,
  'BR-8-envelope-opening': 24 / 1,
  'BR-9-candle-blown-out': 25 / 1,
  'BR-10-bills-calculator': 25 / 1,
  'BR-12-cash-pile-growing': 25 / 1,
  'BR-13-code-scrolling': 25 / 1,
};
const vidRate = (ref: string) => (VID_FPS[ref] ? FPS / VID_FPS[ref] : 1);

// ---------------------------------------------------------------------------------------------------------------
// RECEIPT framing: views [t, x, y, w] in units of the capture WIDTH (y too), eased between keys; highlights in the same
// capture coordinates so they ride the push. bg = the capture's own page colour (a view may run past its edge).
// ---------------------------------------------------------------------------------------------------------------
type HL = { t: number; r: [number, number, number, number][]; mode: 'mark' | 'box' | 'ring' | 'under' };
type RX = { aspect: number; bg: string; keys: [number, number, number, number][]; hl?: HL[] };
const RX: Record<string, RX> = {
  'C3-challenger-header@8.367': { aspect: 2800 / 3840, bg: '#fcfaf1', keys: [[8.367, 0, 0, 1], [9.9, 0.02, 0.01, 0.96]] },
  'C3-challenger-ai-paragraph@9.6': { aspect: 1080 / 2640, bg: '#fcfaf1', keys: [[9.6, 0.03, -0.03, 0.92], [10.2, 0.03, -0.03, 0.92], [11.0, 0.04, 0.07, 0.88], [14.6, 0.05, 0.08, 0.86]],
    hl: [{ t: 11.04, mode: 'mark', r: [[0.196, 0.243, 0.41, 0.026]] }] },        // '120,136 job cut announcements, approximately 21% of all cuts'
  'C13-techcrunch-coinbase@18.38': { aspect: 2200 / 3840, bg: '#ffffff', keys: [[18.38, 0, 0, 1]] },
  'C12-fortune-accenture@29.28': { aspect: 2600 / 3840, bg: '#ffffff', keys: [[29.28, 0.12, 0.02, 0.78], [32.6, 0.14, 0.03, 0.74], [34.4, 0.2, 0.41, 0.44], [36.6, 0.21, 0.42, 0.42]],
    hl: [{ t: 35.56, mode: 'mark', r: [[0.488, 0.52, 0.056, 0.019]] }] },        // 'exiting people'
  'C22-only-18-months-left-thumb@86.94': { aspect: 1080 / 1920, bg: '#201f1e', keys: [[86.94, 0, 0, 1]] },
  'C5-insilico-phase3@119.02': { aspect: 2800 / 3840, bg: '#ffffff', keys: [[119.02, 0.24, 0.03, 0.52], [125.6, 0.25, 0.035, 0.5], [127.0, 0.29, 0.055, 0.42], [132.5, 0.3, 0.058, 0.4]],
    hl: [{ t: 128.32, mode: 'mark', r: [[0.597, 0.09, 0.083, 0.024]] }] },       // 'Phase III'
  'C6-gut-redmod@135.78': { aspect: 2800 / 3840, bg: '#f9f9f9', keys: [[135.78, 0.19, 0.16, 0.6], [140.8, 0.2, 0.17, 0.58], [142.6, 0.2, 0.39, 0.56], [146.8, 0.205, 0.395, 0.55]],
    hl: [{ t: 145.42, mode: 'mark', r: [[0.638, 0.494, 0.094, 0.018]] }] },        // 'at a median 475-day lead' (the paper's own figure)
  'C7-technion-deephhf@149.68': { aspect: 2800 / 3840, bg: '#ffffff', keys: [[149.68, 0.15, 0.19, 0.7], [157.6, 0.16, 0.2, 0.68], [158.5, 0.48, 0.44, 0.36], [160.8, 0.485, 0.445, 0.35]],
    hl: [{ t: 158.62, mode: 'mark', r: [[0.656, 0.545, 0.145, 0.018], [0.499, 0.558, 0.037, 0.018]] }] },   // 'If confirmed in larger international studies'
  'C8-tenpoint-yuvezzi@164.68': { aspect: 1860 / 1640, bg: '#ffffff', keys: [[164.68, 0.02, 0.0, 0.96], [170.0, 0.06, 0.08, 0.8]] },
  'C9-technion-implant@169.98': { aspect: 1080 / 1920, bg: '#ffffff', keys: [[169.98, 0, 0, 1]] },
  'C10-frontiers-psilocybin@174.84': { aspect: 2840 / 3840, bg: '#ffffff', keys: [[174.84, 0.24, 0.07, 0.52], [181.4, 0.25, 0.08, 0.5], [182.6, 0.285, 0.13, 0.44], [185.6, 0.29, 0.135, 0.43]],
    hl: [{ t: 184.2, mode: 'mark', r: [[0.299, 0.156, 0.098, 0.031]] }] },        // 'Transient'
  'C17-mittr-lenmeldy@213.42': { aspect: 1820 / 3840, bg: '#ffffff', keys: [[213.42, 0.08, 0.0, 0.84], [216.4, 0.16, 0.02, 0.66]] },
  'C16-isomorphic-2-1b@238.7': { aspect: 2900 / 3840, bg: '#ffffff', keys: [[238.7, 0.18, 0.04, 0.64], [245.4, 0.22, 0.055, 0.56]],
    hl: [{ t: 241.58, mode: 'mark', r: [[0.597, 0.096, 0.122, 0.038]] }] },       // '$2.1 Billion'
  'C19-nber-w32719@271.28': { aspect: 2800 / 3840, bg: '#ffffff', keys: [[271.28, 0.18, 0.1, 0.64], [275.0, 0.19, 0.11, 0.62], [277.0, 0.29, 0.33, 0.42], [281.0, 0.295, 0.335, 0.41]],
    hl: [{ t: 278.72, mode: 'mark', r: [[0.62, 0.371, 0.04, 0.017], [0.316, 0.384, 0.131, 0.017]] }] },  // '$1,000 per month unconditionally for three years'
  'C24-outlook-altman@298.2': { aspect: 2600 / 3840, bg: '#ffffff', keys: [[298.2, 0.15, 0.02, 0.66], [302.1, 0.2, 0.04, 0.54]] },
  'C20-showcase@329.32': { aspect: 7214 / 3840, bg: '#0e0c15', keys: [[329.32, 0, 0, 1]] },
  // stage 2: framed off C20-showcase.boxes.json rows (css px / 1920); 2026 rows -> the 2025 MYX row -> back to TUT
  'C20-showcase@335.86': { aspect: 7214 / 3840, bg: '#0e0c15', keys: [[335.86, 0.2, 0.12, 0.6], [341.0, 0.2, 0.12, 0.6], [341.8, 0.2, 0.5, 0.6], [343.5, 0.2, 0.5, 0.6], [344.2, 0.2, 0.12, 0.6]],
    hl: [
      { t: 337.76, mode: 'box', r: [[394 / 1920, 337 / 1920, 1132 / 1920, 44 / 1920]] },   // 2026 row 1, LAB 353x (shown, Mike 2026-11-02)
      { t: 341.96, mode: 'box', r: [[394 / 1920, 1073 / 1920, 1132 / 1920, 44 / 1920]] },  // 2025 MYX 552x
      { t: 344.34, mode: 'box', r: [[394 / 1920, 381 / 1920, 1132 / 1920, 44 / 1920]] },   // 2026 TUT 130x
      { t: 346.88, mode: 'box', r: [[394 / 1920, 469 / 1920, 1132 / 1920, 44 / 1920]] },   // 2026 PIPPIN 89x ('89x on Pippin')
    ] },
  'C25-perpspad-showcase@350.5': { aspect: 1450 / 2440, bg: '#110e1e', keys: [[350.5, 0, 0, 1], [355.1, 0.0, 0.02, 0.78]] },
  'C23-cryptorich-home@367.86': { aspect: 2160 / 3840, bg: '#110e1e', keys: [[367.86, 0, 0, 1]] },
  'C23c-history-of-crypto-title-slide@373.52': { aspect: 2160 / 3840, bg: '#141414', keys: [[373.52, 0.05, 0.0, 0.72], [380.4, 0.1, 0.02, 0.62]],
    hl: [{ t: 375.56, mode: 'under', r: [[0.147, 0.072, 0.565, 0.044]] }] },     // 'The History of Crypto' (dark slide: gold underline)
  'C23-cryptorich-home@393.22': { aspect: 2160 / 3840, bg: '#110e1e', keys: [[393.22, 0, 0, 1], [398.8, 0.06, 0.03, 0.88]] },
};

const viewAt = (keys: RX['keys'], abs: number): [number, number, number] => {
  if (keys.length === 1 || abs <= F(keys[0][0])) return [keys[0][1], keys[0][2], keys[0][3]];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    const fa = F(a[0]), fb = F(b[0]);
    if (abs <= fb) {
      const p = interpolate(abs, [fa, Math.max(fa + 1, fb)], [0, 1], { ...clamp01, easing: inOut });
      return [a[1] + (b[1] - a[1]) * p, a[2] + (b[2] - a[2]) * p, a[3] + (b[3] - a[3]) * p];
    }
  }
  const z = keys[keys.length - 1];
  return [z[1], z[2], z[3]];
};

const ReceiptNode: React.FC<{ c: Cover; still?: boolean }> = ({ c, still }) => {
  const abs = useAbs();
  const rx = RX[`${c.ref}@${c.tIn}`];
  if (!rx) throw new Error(`no RX framing for ${c.ref}@${c.tIn}`);
  const [x, y, w] = still ? [rx.keys[0][1], rx.keys[0][2], rx.keys[0][3]] : viewAt(rx.keys, abs);
  const dispW = 1920 / w;
  const left = -x * dispW, top = -y * dispW;
  return (
    <AbsoluteFill style={{ background: rx.bg, overflow: 'hidden' }}>
      <Img src={staticFile('receipts/' + c.ref + '.png')}
        style={{ position: 'absolute', left, top, width: dispW, height: dispW * rx.aspect }} />
      {(rx.hl || []).map((h, i) => {
        const p = interpolate(abs, [F(h.t), F(h.t) + 15], [0, 1], { ...clamp01, easing: Easing.out(Easing.cubic) });
        if (p <= 0) return null;
        return h.r.map((r, j) => {
          const rl = left + r[0] * dispW, rt = top + r[1] * dispW, rw = r[2] * dispW, rh = r[3] * dispW;
          const pj = h.r.length > 1 ? interpolate(p, [j / h.r.length, (j + 1) / h.r.length], [0, 1], clamp01) : p;
          if (h.mode === 'mark') return (
            <div key={`${i}-${j}`} style={{ position: 'absolute', left: rl - 4, top: rt - 2, width: (rw + 8) * pj, height: rh + 4,
              background: '#ffe14d', mixBlendMode: 'multiply', borderRadius: 3 }} />);
          if (h.mode === 'under') return (
            <div key={`${i}-${j}`} style={{ position: 'absolute', left: rl, top: rt + rh + 4, width: rw * pj, height: 8,
              background: '#ffd700', borderRadius: 4 }} />);
          if (h.mode === 'box') return (
            <div key={`${i}-${j}`} style={{ position: 'absolute', left: rl - 8, top: rt - 6, width: rw + 16, height: rh + 12,
              border: '5px solid #ffd700', borderRadius: 10, opacity: p, transform: `scale(${1.04 - 0.04 * p})`,
              boxShadow: '0 0 0 2px rgba(0,0,0,.35)' }} />);
          // ring: an ellipse drawn on (stroke dash) around the figure
          return (
            <svg key={`${i}-${j}`} style={{ position: 'absolute', left: rl - 30, top: rt - 30, overflow: 'visible' }}
              width={rw + 60} height={rh + 60}>
              <ellipse cx={(rw + 60) / 2} cy={(rh + 60) / 2} rx={(rw + 40) / 2} ry={(rh + 36) / 2} fill="none"
                stroke="#e6b800" strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p}
                transform={`rotate(-4 ${(rw + 60) / 2} ${(rh + 60) / 2})`} />
            </svg>);
        });
      })}
      {/* [LOWER-THIRD] 'cryptorich.vip' in gold on 'CryptoRich.VIP' (395.80), soft fade, no sound */}
      {c.ref === 'C23-cryptorich-home' && c.tIn === 393.22 && abs >= F(395.8) - 1 && (
        <div style={{ position: 'absolute', left: 90, bottom: 90, padding: '14px 34px', borderRadius: 14,
          background: 'rgba(10,8,18,.82)', border: '3px solid #ffd700', fontFamily: DMSANS, fontWeight: 700, fontSize: 54,
          color: '#ffd700', letterSpacing: '.01em', opacity: interpolate(abs, [F(395.8), F(395.8) + 12], [0, 1], clamp01) }}>
          cryptorich.vip
        </div>
      )}
    </AbsoluteFill>
  );
};

// [MOTION] lib:motion-3d-* : the engine wraps the live receipt for its whole slot; its 5 s move is fitted to the slot
// with a Freeze (inside a zero-offset Sequence, comp-build 6a rule 1); the receipt reads the absolute clock.
const MotionWrap: React.FC<{ id: string; s: number; e: number; children: React.ReactNode }> = ({ id, s, e, children }) => {
  const abs = useAbs();
  const row = getTransition(id);
  if (!row) throw new Error('unknown motion id ' + id);
  const Engine = ENGINES[row.engine] as React.FC<any>;
  const n = Math.min(149, Math.max(0, Math.round(((abs - s) / Math.max(1, e - s)) * 5 * FPS)));
  return (
    <Sequence from={0} layout="none">
      <Freeze frame={n}>
        <Engine from={children} to={children} outClip={() => children} durationInFrames={150} params={row.params} />
      </Freeze>
    </Sequence>
  );
};

// a video cover reading the absolute clock: frame 0 of the clip = abs frame t0
const VidNode: React.FC<{ refId: string; t0: number }> = ({ refId, t0 }) => {
  const local = useCurrentFrame();
  const abs = useAbs();
  const r = vidRate(refId);
  const startFrom = Math.max(0, Math.round((abs - local - t0) * r));
  return <OffthreadVideo src={staticFile('vid/' + refId + '.mp4')} muted playbackRate={r} startFrom={startFrom}
    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
};

// an image cover with a slow push (abs clock); AI stills + clip lead stills + the K cards
const PushImg: React.FC<{ src: string; s: number; e: number; z0?: number; z1?: number }> = ({ src, s, e, z0 = 1, z1 = 1.05 }) => {
  const abs = useAbs();
  const z = interpolate(abs, [s, e], [z0, z1], { ...clamp01, easing: inOut });
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: '#000' }}>
      <Img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${z})` }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// Row frame windows: a row starts on its cut, the outgoing row stays opaque UNDER the incoming fade (no black dip);
// a row next to a FACE window fades in under / out over the film burn.
// ---------------------------------------------------------------------------------------------------------------
const OUT_TO_FACE = 9;           // frames a cover lingers (fading) over the incoming face, under the burn
const faceEndingAt = (t: number) => FACES.find((f) => Math.abs(f.w[1] - t) < 0.1);
const faceStartingAt = (t: number) => FACES.find((f) => Math.abs(f.w[0] - t) < 0.1);
const inFrames = (c: Cover) => (c.inT === 'none' ? 0 : c.inT === 'paper' ? 11 : Math.max(1, Math.round(c.inD * FPS)));
type Win = { start: number; cut: number; end: number; inF: number; afterFace: boolean; toFace: boolean };
const WINS: Win[] = COVERS.map((c, i) => {
  const inF = inFrames(c);
  const cut = c.edge === 'post' ? PF(c.tIn) + 15 : F(c.tIn);
  const endBase = c.edge === 'pre' ? PF(c.tOut) + 15 : F(c.tOut);
  const fe = faceEndingAt(c.tIn);
  const fs = faceStartingAt(c.tOut);
  const start = fe ? F(fe.w[1]) - inF + 1 : cut;
  const next = COVERS[i + 1];
  const contiguous = next && Math.abs(next.tIn - c.tOut) < 0.1 && !fs;
  const tail = fs ? OUT_TO_FACE : contiguous ? inFrames(next) : 0;
  return { start, cut, end: endBase + tail, inF, afterFace: !!fe, toFace: !!fs };
});

const CoverContent: React.FC<{ c: Cover; w: Win }> = ({ c, w }) => {
  switch (c.kind) {
    case 'vid': {
      // [LINE-CAPTION] 'YOU'RE FIRST' static on BR-1 (CH1 red), lands on 'refused' (17.26), holds to the cut
      return (
        <AbsoluteFill>
          <VidNode refId={c.ref} t0={w.start} />
          {c.ref === 'BR-1-fired-box' && <LineCaption />}
        </AbsoluteFill>
      );
    }
    case 'still': return <PushImg src={'img/' + c.ref + '.png'} s={w.start} e={w.end} />;
    // lead-in: a settling push 1.04 -> 1 that lands EXACTLY on the clip's frame at the insert; lead-out: 1 -> 1.04 from the clip's end
    case 'clipstill': return c.edge === 'pre'
      ? <PushImg src={'clip-inserts/stills/' + c.ref + '.jpg'} s={w.cut} e={PF(c.tOut)} z0={1.04} z1={1} />
      : <PushImg src={'clip-inserts/stills/' + c.ref + '.jpg'} s={insertEnd(c.tIn)} e={w.end} z0={1} z1={1.04} />;
    case 'deck':
    case 'container': {
      // a K card block pushes 1 -> 1.025 across ALL its states (state rows share the block's clock: no restart)
      const blk = cardBlock(c);
      return <PushImg src={'card-slides/' + c.ref + '.png'} s={blk[0]} e={blk[1]} z0={1} z1={1.025} />;
    }
    case 'chart':
      if (c.ref === 'C2-who-owns-the-stock-market') return <ChartLive />;   // REAL animated chart (section 7)
      throw new Error('chart without a live component: ' + c.ref);
    case 'whiteboard': return <WhiteboardNode c={c} w={w} />;
    case 'receipt': {
      if (c.mo) return <MotionWrap id={c.mo} s={w.cut} e={F(c.tOut)}><ReceiptNode c={c} still /></MotionWrap>;
      return <ReceiptNode c={c} />;
    }
    default: return null;
  }
};
const insertEnd = (at: number) => PF(at) + CLIP_INSERTS.find((x) => x.at === at)!.frames;
const ChartLive: React.FC = () => <C2Chart abs={useAbs()} F={F} />;
const cardBlock = (c: Cover): [number, number] => {
  const stem = c.ref.replace(/-s\d+$/, '');
  const rows = COVERS.filter((x) => (x.kind === 'deck' || x.kind === 'container') && x.ref.replace(/-s\d+$/, '') === stem);
  return [F(rows[0].tIn), F(rows[rows.length - 1].tOut)];
};

// kind 'whiteboard': the rendered silent clip; frame 0 = the beat's tIn (a pre-roll before it holds frame 0)
const WhiteboardNode: React.FC<{ c: Cover; w: Win }> = ({ c, w }) => {
  const pre = F(c.tIn) - w.start;
  const src = staticFile('whiteboard/' + c.ref + '.mp4');
  const fill = { width: '100%', height: '100%', objectFit: 'cover' } as const;
  return (
    <AbsoluteFill style={{ background: '#fbf8f1' }}>
      {pre > 0 && (
        <Sequence from={0} durationInFrames={pre} layout="none">
          <AbsoluteFill><Freeze frame={0}><OffthreadVideo src={src} muted style={fill} /></Freeze></AbsoluteFill>
        </Sequence>
      )}
      <Sequence from={Math.max(0, pre)} layout="none">
        <AbsoluteFill>
          <OffthreadVideo src={src} startFrom={Math.round((c.from ?? 0) * FPS) + Math.max(0, -pre)} muted style={fill} />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

const LineCaption: React.FC = () => {
  const abs = useAbs();
  if (abs < F(17.26)) return null;
  return (
    <div style={{ position: 'absolute', left: 90, bottom: 96, fontFamily: MONTSERRAT, fontWeight: 900, fontSize: 92,
      color: '#ff4d4d', letterSpacing: '.02em', WebkitTextStroke: '10px #0b0b0b', paintOrder: 'stroke fill',
      textShadow: '0 6px 24px rgba(0,0,0,.45)' }}>
      YOU'RE FIRST
    </div>
  );
};

// one cover row: ingress per its planned move; egress only toward a FACE (else the next row covers it)
const CoverSeq: React.FC<{ c: Cover; w: Win }> = ({ c, w }) => {
  const abs = useAbs();
  const inEnd = w.afterFace ? w.start + w.inF : w.cut + w.inF;
  const inStart = w.afterFace ? w.start : w.cut;
  let op = w.inF > 0 ? interpolate(abs, [inStart, inEnd], [0, 1], clamp01) : 1;
  let scale = 1, blur = 0;
  if (c.inT === 'xfade') scale = interpolate(abs, [inStart, inEnd], [0.93, 1], { ...clamp01, easing: Easing.out(Easing.cubic) });
  if (c.inT === 'paper') scale = interpolate(abs, [inStart, inEnd], [0.97, 1], { ...clamp01, easing: Easing.out(Easing.cubic) });
  if (c.inT === 'xwarp') {
    scale = interpolate(abs, [inStart, inEnd], [1.06, 1], { ...clamp01, easing: Easing.out(Easing.cubic) });
    blur = interpolate(abs, [inStart, inEnd], [8, 0], clamp01);
  }
  if (w.toFace) {
    const o0 = w.end - OUT_TO_FACE;
    // a whiteboard leaves over 0.3 s (whiteboard-beat), everything else under the burn
    op *= interpolate(abs, [o0, w.end], [1, 0], clamp01);
  }
  return (
    <AbsoluteFill style={{ opacity: op, transform: `scale(${scale})`, filter: blur > 0.05 ? `blur(${blur}px)` : undefined }}>
      <CoverContent c={c} w={w} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// FACE layer (spine + the pre-framed swap clips), punch-in, the F5 library light leak
// ---------------------------------------------------------------------------------------------------------------
const SpineLayer: React.FC = () => {
  const abs = useAbs();
  return (
    <AbsoluteFill style={{ overflow: 'hidden', transformOrigin: `${FACE_POINT.x}px ${FACE_POINT.y}px`, transform: `scale(${punchAt(abs)})` }}>
      <OffthreadVideo src={staticFile('spine.mp4')}
        style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0',
          transform: `translate(${FACE_REFRAME.x}px, ${FACE_REFRAME.y}px) scale(${FACE_REFRAME.scale})` }} />
    </AbsoluteFill>
  );
};

// the swap clip of face n at the CURRENT absolute frame (works in any nesting: engine copies included), muted
const FaceSwapNode: React.FC<{ n: number }> = ({ n }) => {
  const local = useCurrentFrame();
  const abs = useAbs();
  const f = FACES.find((x) => x.n === n)!;
  const startFrom = Math.max(0, abs - local - F(f.w[0]) + f.head);
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: '#000', transformOrigin: `${FACE_POINT.x}px ${FACE_POINT.y}px`,
      transform: `scale(${punchAt(abs)})` }}>
      <OffthreadVideo src={staticFile(`face-swap/F${n}-higgsfield-bg-swap.mp4`)} muted startFrom={startFrom}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </AbsoluteFill>
  );
};

// hand:film-burn (the video's face pick): a warm radial flash peaking ON the face cut, 0.8 s, silent
const BURN_WIN = Math.round(0.8 * FPS);
const FilmBurn: React.FC<{ cut: number }> = ({ cut }) => {
  const abs = useAbs();
  const k = interpolate(abs, [cut - BURN_WIN / 2, cut, cut + BURN_WIN / 2], [0, 1, 0], { ...clamp01, easing: inOut });
  if (k <= 0.001) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'screen', opacity: 0.85 * k }}>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 75% 85% at 30% 45%, rgba(255,186,96,1) 0%, rgba(255,120,40,.85) 35%, rgba(170,40,10,.35) 70%, rgba(0,0,0,0) 100%)' }} />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 60% 70% at 78% 60%, rgba(255,220,160,.9) 0%, rgba(255,140,60,.5) 40%, rgba(0,0,0,0) 80%)',
        transform: `translateX(${(1 - k) * 60}px)` }} />
    </AbsoluteFill>
  );
};
const BURN_CUTS = FACES.flatMap((f) => (f.w[0] === 0 ? [F(f.w[1])] : [F(f.w[0]), F(f.w[1])]));   // 9 face edges

// ---------------------------------------------------------------------------------------------------------------
// CLIP INSERTS (section 3d): full frame, MUTED (the voice is in the paused spine), hand:fade 0.5 s in / out
// ---------------------------------------------------------------------------------------------------------------
const INS_FADE = 15;
const ClipInsert: React.FC<{ clip: string; frames: number }> = ({ clip, frames }) => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, INS_FADE, frames - INS_FADE, frames], [0, 1, 1, 0], clamp01);   // insert-in / insert-out hand:fade
  return (
    <AbsoluteFill style={{ opacity: op, background: '#000' }}>
      <OffthreadVideo src={staticFile('clip-inserts/' + clip + '.mp4')} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// TITLE CARDS: rmn:flip (the video's ONE card move), a self-contained scene that STARTS BEFORE the pause over the
// outgoing cover and HOLDS through it (never flips back out). readable = lead + PAUSE - turn >= 1.0 s (asserted).
// ---------------------------------------------------------------------------------------------------------------
const CARD_LEAD = 15;            // 0.5 s before the pause
const CARD_TURN = 24;            // 0.8 s flip (TRANSITION-PLAN duration_s 0.8)
const CARDS = [
  { at: 106.865, img: 'title-CH2', outRow: 'BR-3-humanoid-robot-factory', hold: F(106.967) },   // exits onto F3 (film burn)
  { at: 187.445, img: 'title-CH3', outRow: 'IMG-3-sunrise-research-campus', hold: PF(187.445) + 45 + 2 }, // exits onto BR-7
];
for (const k of CARDS) {
  const readable = (CARD_LEAD + Math.round(PAUSE * FPS) - CARD_TURN) / FPS;
  if (readable < 1.0) throw new Error(`title card ${k.img} readable ${readable}s < 1.0 s (comp-build section 6)`);
}
const CARD_EXIT = 15;
const TitleCard: React.FC<{ k: typeof CARDS[number] }> = ({ k }) => {
  const abs = useAbs();
  const start = PF(k.at) - CARD_LEAD;
  const total = k.hold - start + CARD_EXIT;
  const i = COVERS.findIndex((c) => c.ref === k.outRow);
  const out = COVERS[i], ow = WINS[i];
  const op = interpolate(abs, [k.hold, k.hold + CARD_EXIT], [1, 0], clamp01);
  return (
    <AbsoluteFill style={{ opacity: op }}>
      {/* opaque backdrop so the turn reads as a card turning over (not a see-through onto the same cover) */}
      <AbsoluteFill style={{ background: '#0b0b0d' }} />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={CARD_TURN}>
          <CoverContent c={out} w={ow} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition timing={linearTiming({ durationInFrames: CARD_TURN })}
          presentation={flip({ direction: 'from-right', perspective: 1600 })} />
        <TransitionSeries.Sequence durationInFrames={total}>
          <AbsoluteFill style={{ background: '#F6F4EE' }}>
            <Img src={staticFile('title-slides/' + k.img + '.png')} style={{ width: '100%', height: '100%' }} />
          </AbsoluteFill>
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// 8. CAPTIONS: Montserrat house style, FACE windows only, TOPMOST
// ---------------------------------------------------------------------------------------------------------------
const CAPS = ZCAPTIONS.map((c) => ({ tf: sh(c.t), h: c.h }));
const CAP_WINS = CAPTION_WINDOWS.map(([a, b]) => [sh(a), sh(b)] as [number, number]);
const Captions: React.FC = () => {
  const abs = useAbs();
  const t = abs / FPS;
  if (!CAP_WINS.some(([a, b]) => t >= a && t < b)) return null;
  let cur: { tf: number; h: string } | null = null;
  for (const c of CAPS) { if (c.tf <= t + 1e-6) cur = c; else break; }
  if (!cur) return null;
  const nextT = (CAPS.find((c) => c.tf > cur!.tf) || { tf: Infinity }).tf;
  if (t >= Math.min(nextT, cur.tf + 1.3)) return null;
  const lf = abs - Math.round(cur.tf * FPS);
  const s = interpolate(lf, [0, 4, 9], [0.7, 1.12, 1], clamp01);
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 110, pointerEvents: 'none' }}>
      <div style={{ fontFamily: `${MONTSERRAT},'Arial Black','Segoe UI',sans-serif`, fontWeight: 900, fontSize: 92,
        textTransform: 'lowercase', color: '#fff', WebkitTextStroke: '12px #000', paintOrder: 'stroke fill',
        transform: `scale(${s})`, textAlign: 'center', lineHeight: 1.05 }}>{cur.h}</div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// ROOT
// ---------------------------------------------------------------------------------------------------------------
const LEAK_ID = 'lightleaks-soft-1';   // [LIGHTLEAK] lib:lightleaks-soft-1 (punch-leak, 1.44 s) on the F5 join 305.533
const LEAK_WIN = Math.round(1.44 * FPS);

// captions / pops props: the short lane paints its 9:16 spans with {captions: false, pops: false} (longform-to-short.md,
// 'The 16:9 comp MUST honor captions: false'); both default true so the 16:9 render is unchanged.
export const LeftBehind: React.FC<{ captions?: boolean; pops?: boolean }> = ({ captions = true }) => {
  const abs = useCurrentFrame();
  const f5 = FACES[4];
  return (
    <AbsCtx.Provider value={abs}>
      <AbsoluteFill style={{ backgroundColor: '#000' }}>
        {/* the gated-face spine (carries ALL the audio: Mike's VO + the clip inserts' own voices) */}
        <SpineLayer />

        {/* FACE windows: the pre-framed Higgsfield office restyle, full frame, muted */}
        {FACES.map((f) => (
          <Sequence key={f.n} from={F(f.w[0])} durationInFrames={F(f.w[1]) - F(f.w[0])}>
            <FaceSwapNode n={f.n} />
          </Sequence>
        ))}

        {/* F5 punch-in + lib:lightleaks-soft-1, engine window EXACTLY win frames centred on the join (6a) */}
        <Sequence from={F(PUNCH.t) - Math.round(LEAK_WIN / 2)} durationInFrames={LEAK_WIN}>
          <TransitionClip id={LEAK_ID} cutFrame={Math.round(LEAK_WIN / 2)} sfx={false}
            outgoing={() => <FaceSwapNode n={f5.n} />} incoming={() => <FaceSwapNode n={f5.n} />} />
        </Sequence>

        {/* COVER layer */}
        {COVERS.map((c, i) => (
          <Sequence key={i} from={WINS[i].start} durationInFrames={WINS[i].end - WINS[i].start}>
            <CoverSeq c={c} w={WINS[i]} />
          </Sequence>
        ))}

        {/* CLIP INSERTS over their paused windows */}
        {CLIP_INSERTS.map((ci) => (
          <Sequence key={ci.clip} from={PF(ci.at)} durationInFrames={ci.frames}>
            <ClipInsert clip={ci.clip} frames={ci.frames} />
          </Sequence>
        ))}

        {/* hand:film-burn on every FACE edge */}
        {BURN_CUTS.map((cut) => (
          <Sequence key={cut} from={Math.max(0, cut - BURN_WIN / 2)} durationInFrames={BURN_WIN}>
            <FilmBurn cut={cut} />
          </Sequence>
        ))}

        {/* rmn:flip title cards (CH2, CH3) */}
        {CARDS.map((k) => (
          <Sequence key={k.img} from={PF(k.at) - CARD_LEAD} durationInFrames={k.hold - (PF(k.at) - CARD_LEAD) + CARD_EXIT}>
            <TitleCard k={k} />
          </Sequence>
        ))}
        {/* the CH2 card's exit onto F3 rides the F3 cut-in film burn (BURN_CUTS) */}

        {captions && <Captions />}
      </AbsoluteFill>
    </AbsCtx.Provider>
  );
};

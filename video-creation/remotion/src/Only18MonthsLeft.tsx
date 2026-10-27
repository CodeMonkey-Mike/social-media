// Only18MonthsLeft.tsx: the longform-edited comp of media/only-18-months-left ("AI Will Wipe These Jobs Out Next").
// Built TO the approved blueprint: EDIT-PLAN.md (event log), CUE-SHEET.md, TRANSITIONS.md + TRANSITION-PLAN.json,
// COVER-PLAN.json (cover beats + chapter_themes), AS-RECORDED.md (FACE windows), PROJECT-LOG.md Open flags.
// Canon: video-creation/longform-edited/skills/comp-build/comp-build.md (sections cited inline).
//
// Model (section 0): ONE continuous paused spine (assets/spine.mp4 = spine/ALL.h.paused.mp4) carries the VO; every layer
// is cued to a SOURCE-spine second routed through sh()/F(). Every FACE window airs as its Mad Max Higgsfield clip
// (assets/face-swap/F<n>-higgsfield-bg-swap.mp4, section 3b: PRE-FRAMED, full-frame, NO FACE_REFRAME, from the clip's
// window_starts_at_clip_s 0.4 s = frame 12, muted, spine audio kept). No music, no SFX, no watermark (section 9): the
// library transitions run with sfx={false}; mix_music.py owns every sound.
//
// THE ONE CLOCK (section 6a rule 2): the root publishes the composition frame (AbsF) and the SOURCE-spine second (KtClock,
// held inside a spine pause). Every node handed to an engine (and the live cover track itself) renders from that absolute
// frame through <Freeze>, so a node mounted inside an engine's nested Sequences shows exactly what airs.
//
// DIAGRAM_REFS: C2-clock-his-window, old-workflow-flow-base, wef-editions-timeline-first-time, C14-tilly-timeline-base, legal-work-diagram-courtroom, money-moves-diagram-cures
// OVERVIEW_REFS: ch6-four-skeletons, risk-ladder-overview-s1
// (end declared refs)
import React from 'react';
import { AbsoluteFill, Easing, Freeze, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadLato } from '@remotion/google-fonts/Lato';
import { TransitionClip } from './transitions/TransitionClip';
import { ENGINES, framesForRow, getTransition } from './transitions/registry';
import { MotionShake } from './transitions/engines/MotionShake';
import { KtClock } from './effects/kinetic-text';
import { HwBloodPromo, HwPromoScene, HwSlide, HwSubscribeLikeBell, HwWordPop, HwZoomSlideshow } from './effects/halloween-2022';
import { CAPTION_WINDOWS, ZCAPTIONS } from './Only18MonthsLeftCaptions';
import { C22Chart, C35Chart, C4Chart, C4bChart, ChartProps, H1Chart, ROLL1, ROLL1_END } from './Only18MonthsLeftCharts';

loadMontserrat('normal', { weights: ['900'] });
loadLato('normal', { weights: ['900'] });

// ---------------------------------------------------------------------------------------------------------------------
// 1. TIME MAP (sections 2 + 3d): spine/ALL.h.paused.json pauses[] IS the time map. sh(t) = t + sum(dur for at <= t).
export const FPS = 30;
export const PAUSE = 1.5; // the sidecar's pause_s (title cards); inserts and the braam beat carry their own dur
export const SPINE_SECS = 610.133; // SOURCE spine spine/ALL.f.restored.mp4
// snap = frames the bake added after a pause (MEASURED: spine audio cross-correlated against the source spine at 11 points,
// 2026-10-27: +1 frame from CLIP-5 on, +1 more from the CH8 card on; 0 elsewhere). It is why the spine is 20043 f, not 20041.
type Pause = { at: number; dur: number; kind: 'insert' | 'card' | 'beat'; label: string; snap?: number };
const PAUSES: Pause[] = [
  { at: 32.3, dur: 15.6, kind: 'insert', label: 'CLIP-1' },
  { at: 70.86, dur: 1.5, kind: 'card', label: 'ALREADY GONE' },
  { at: 161.88, dur: 1.5, kind: 'card', label: 'NEXT ON THE LIST' },
  { at: 181.32, dur: 9.2, kind: 'insert', label: 'CLIP-5', snap: 1 },
  { at: 224.905, dur: 10.1, kind: 'insert', label: 'CLIP-4' },
  { at: 239.3, dur: 11.9, kind: 'insert', label: 'CLIP-3' },
  { at: 438.845, dur: 1.5, kind: 'card', label: 'THE FLIP SIDE' },
  { at: 532.88, dur: 5.1, kind: 'beat', label: 'BRAAM-1' },
  { at: 547.45, dur: 1.5, kind: 'card', label: 'OWN THE ASSETS', snap: 1 },
];
// CARD_T as the brief gives it (the four title cards + the BRAAM-1 beat pause at 532.88, which carries no card)
export const CARD_T = [70.86, 161.88, 438.845, 532.88, 547.45];
// every pause of the spine (lint-pause-silence.py / bed-duck-expr.py read this)
export const INSERTS = [
  { at: 32.3, dur: 15.6 },
  { at: 70.86, dur: 1.5 },
  { at: 161.88, dur: 1.5 },
  { at: 181.32, dur: 9.2 },
  { at: 224.905, dur: 10.1 },
  { at: 239.3, dur: 11.9 },
  { at: 438.845, dur: 1.5 },
  { at: 532.88, dur: 5.1 },
  { at: 547.45, dur: 1.5 },
];
const pLen = (p: Pause) => p.dur + (p.snap ?? 0) / FPS; // the pause's length on the baked spine
export const sh = (t: number) => t + PAUSES.filter((p) => p.at <= t + 1e-9).reduce((a, p) => a + pLen(p), 0);
const cardStart = (b: number) => b + PAUSES.filter((p) => p.at < b - 1e-9).reduce((a, p) => a + pLen(p), 0);
export const F = (t: number) => Math.round(sh(t) * FPS);
/** the first frame of a pause (a row that ENDS at a pause point ends here) */
const FS = (t: number) => Math.round(cardStart(t) * FPS);
const isPauseAt = (t: number) => PAUSES.some((p) => Math.abs(p.at - t) < 1e-6);
const endF = (t: number) => (isPauseAt(t) ? FS(t) : F(t));
// DUR = the paused spine's own frames (ffprobe: 20043 = 668.1 s) = SPINE_SECS + every pause incl. its measured snap
export const DUR = 20043;
if (DUR !== Math.round((SPINE_SECS + PAUSES.reduce((a, p) => a + pLen(p), 0)) * FPS)) throw new Error('DUR drifted from the pause table');
/** composition frame -> SOURCE-spine second (held at the pause point inside a pause) */
const srcT = (f: number) => {
  let acc = 0;
  for (const p of PAUSES) {
    const s = FS(p.at);
    const n = Math.round(pLen(p) * FPS);
    if (f < s) break;
    if (f < s + n) return p.at;
    acc += n;
  }
  return (f - acc) / FPS;
};

// ---------------------------------------------------------------------------------------------------------------------
// 2. FACE (section 3a + 3b). Measured reframe (assets/face-reframe.json): applied to the spine. The swap clips are
// pre-framed and take NONE; punch-ins scale them about the reframed face point.
export const FACE_REFRAME = { scale: 1.407, x: -576, y: -437 };
const FACE_POINT = { x: 960, y: 432 }; // face-reframe.json face_point_out
const PUNCH = 1.18;
const SWAP_HEAD = 12; // window_starts_at_clip_frame (0.4 s) of every F<n>-higgsfield-bg-swap.json
const SWAP_FRAMES: Record<number, number> = { 1: 150, 2: 210, 3: 284, 4: 394, 5: 120, 6: 210, 7: 180, 8: 210, 9: 210, 10: 120, 11: 120 };
// shake = hw-camera-shake (the long MotionShake rows) from t to t1. It runs BETWEEN the engine windows, never under one:
// a MotionShake'd face handed to an engine as a live node stalled the render twice (section 6a cost trap, chunk QA
// 2026-10-27), and a CUTFRAME there would freeze his lips on the verdict words. So F3's shake starts as the punch glitch
// ends (0.5 s after the join), F5's starts as its cut-in split ends and stops as the CH3 card split begins.
type Face = { n: number; a: number; b: number; join?: number; shake?: { t: number; t1?: number; row: string } };
// windows = AS-RECORDED.md (blackdetect on the FINAL spine f). Punch joins = spine/jumpcuts-final.json; that file is on
// the pre-restore spine e, so every join after 332.733 is +0.233 s on f (ALL.f.restored.json): F8 438.033 -> 438.267,
// F9 446.767 -> 447.0, F10 546.433 -> 546.667, F11 567.733 -> 567.967 (the EDIT-PLAN carries the e values).
const FACES: Face[] = [
  { n: 1, a: 0.0, b: 4.167 }, // opens ON face, a slow push over the line, no punch (EDIT-PLAN 0:00.0)
  { n: 2, a: 37.133, b: 43.233, join: 39.667 },
  { n: 3, a: 45.967, b: 55.033, join: 49.267, shake: { t: 49.767, row: 'motion-shake-optics-2x-long' } }, // plan lib:motion-shake-optics-2x-long (CAMERA SHAKE 1)
  { n: 4, a: 99.5, b: 112.233, join: 109.3 },
  { n: 5, a: 159.5, b: 161.833, shake: { t: 159.74, t1: 161.446, row: 'motion-shake-optics-3x-long' } }, // plan lib:motion-shake-optics-3x-long (CAMERA SHAKE 2)
  { n: 6, a: 165.667, b: 171.833 },
  { n: 7, a: 328.367, b: 332.733, join: 332.1 },
  { n: 8, a: 433.267, b: 438.733, join: 438.267 },
  { n: 9, a: 442.167, b: 447.533, join: 447.0 },
  { n: 10, a: 544.4, b: 547.333, join: 546.667 },
  { n: 11, a: 566.167, b: 568.733, join: 567.967 },
];

// ---------------------------------------------------------------------------------------------------------------------
// 3. COVER layer (section 4): one row per state / sub-point straight from the EDIT-PLAN + COVER-PLAN cover_beats.
// x = ingress: 'fade' (hand:fade 0.5 s, Envato video) | 'xs' (hand:xfade-scale 0.35 s, 0.93 -> 1) | 'swap' (STATE SWAP:
// same container, new state, no ingress transition) | 'lib' (a library engine owns the cut, see TX) | 'card' (the cube
// turn out of a title card) | 'cut' (the insert scene's own fade owns it). mo = a lib:motion-3d-* camera move on a
// receipt (section 6 MOTION). g = a container group (one push across its states). push 'obj' = shown as an object.
type Kind = 'vid' | 'still' | 'receipt' | 'chart' | 'deck' | 'container' | 'clipstill';
type Cover = { tIn: number; tOut: number; kind: Kind; ref: string; state?: string; x?: string; g?: string; mo?: string; push?: string; lead?: boolean; cap?: boolean };
const COVERS: Cover[] = [
  // CH1 THE ROLL CALL (red)
  { tIn: 4.167, tOut: 5.8, kind: 'vid', ref: 'BR-1-fog-road-night', x: 'lib' },
  { tIn: 5.8, tOut: 7.68, kind: 'deck', ref: 'h0-next-wave-card', state: 'slam', x: 'xs' },
  { tIn: 7.68, tOut: 17.46, kind: 'chart', ref: 'C1-roll1', x: 'lib' },
  { tIn: 17.46, tOut: 19.24, kind: 'vid', ref: 'BR-2-particle-brain', x: 'fade' },
  { tIn: 19.24, tOut: 21.52, kind: 'still', ref: 'IMG-1-writer-desk', x: 'lib', g: 'roll2' },
  { tIn: 21.52, tOut: 23.48, kind: 'still', ref: 'IMG-2-design-studio', x: 'swap', g: 'roll2' },
  { tIn: 23.48, tOut: 24.44, kind: 'still', ref: 'IMG-3-edit-suite', x: 'swap', g: 'roll2' },
  { tIn: 24.44, tOut: 25.58, kind: 'still', ref: 'IMG-4-accounting-office', x: 'swap', g: 'roll2' },
  { tIn: 25.58, tOut: 26.54, kind: 'still', ref: 'IMG-5-law-office', x: 'swap', g: 'roll2' },
  { tIn: 26.54, tOut: 30.1, kind: 'vid', ref: 'BR-3-pocket-watch', x: 'fade' },
  { tIn: 30.1, tOut: 32.3, kind: 'clipstill', ref: 'CLIP-1-lead-in', x: 'xs' },
  { tIn: 32.3, tOut: 34.1, kind: 'clipstill', ref: 'CLIP-1-lead-out', x: 'cut' },
  { tIn: 34.1, tOut: 37.133, kind: 'deck', ref: 'C2-clock-his-window', state: 'his-window', x: 'xs' },
  { tIn: 43.233, tOut: 45.967, kind: 'container', ref: 'C2-clock-mikes-call', state: 'mikes-call', x: 'lib' },
  { tIn: 55.033, tOut: 64.58, kind: 'chart', ref: 'H1', x: 'lib' },
  { tIn: 64.58, tOut: 68.78, kind: 'deck', ref: 'rl-skeleton', state: 'skeleton', x: 'xs' },
  { tIn: 68.78, tOut: 70.86, kind: 'vid', ref: 'BR-4-tall-grass-dusk', x: 'fade' },
  // CH2 ALREADY GONE (gold)
  { tIn: 70.86, tOut: 73.16, kind: 'still', ref: 'IMG-6-abandoned-desk', x: 'card' },
  { tIn: 73.16, tOut: 75.82, kind: 'vid', ref: 'BR-5-typewriter-night', x: 'fade' },
  { tIn: 75.82, tOut: 80.78, kind: 'receipt', ref: 'R1-openai-plus', x: 'xs' },
  { tIn: 80.78, tOut: 92.32, kind: 'chart', ref: 'C4', x: 'xs' },
  { tIn: 92.32, tOut: 95.88, kind: 'receipt', ref: 'C6-bls-writers-outlook', x: 'xs' },
  { tIn: 95.88, tOut: 99.5, kind: 'deck', ref: 'RL-1-copywriters', state: 'already-gone', x: 'lib' },
  { tIn: 112.233, tOut: 115.16, kind: 'deck', ref: 'C8-price-card-s1', state: 's1', x: 'lib', g: 'c8' },
  { tIn: 115.16, tOut: 117.32, kind: 'container', ref: 'C8-price-card-s2', state: 's2', x: 'swap', g: 'c8' },
  { tIn: 117.32, tOut: 121.0, kind: 'receipt', ref: 'C10-mike-thumbnail-wall', x: 'xs', mo: 'motion-3d-pan-1-left', push: 'obj' },
  { tIn: 121.0, tOut: 123.08, kind: 'deck', ref: 'old-workflow-flow-base', state: 'base', x: 'xs', g: 'wf' },
  { tIn: 123.08, tOut: 124.0, kind: 'container', ref: 'old-workflow-flow-brief', state: 'brief', x: 'swap', g: 'wf' },
  { tIn: 124.0, tOut: 124.82, kind: 'container', ref: 'old-workflow-flow-wait', state: 'wait', x: 'swap', g: 'wf' },
  { tIn: 124.82, tOut: 125.96, kind: 'container', ref: 'old-workflow-flow-revisions', state: 'revisions', x: 'swap', g: 'wf' },
  { tIn: 125.96, tOut: 127.66, kind: 'container', ref: 'old-workflow-flow-invoice', state: 'invoice', x: 'swap', g: 'wf' },
  { tIn: 127.66, tOut: 129.52, kind: 'container', ref: 'old-workflow-flow-days', state: 'days', x: 'swap', g: 'wf' },
  { tIn: 129.52, tOut: 132.38, kind: 'vid', ref: 'BR-6-tired-freelancer-laptop', x: 'fade' },
  { tIn: 132.38, tOut: 134.98, kind: 'vid', ref: 'BR-7-ai-image-resolving', x: 'fade' },
  { tIn: 134.98, tOut: 140.28, kind: 'receipt', ref: 'C9-midjourney-plans', x: 'xs' },
  { tIn: 140.28, tOut: 148.82, kind: 'receipt', ref: 'C7-wef-graphic-designers', x: 'xs' },
  { tIn: 148.82, tOut: 151.18, kind: 'deck', ref: 'wef-editions-timeline-first-time', state: 'first-time', x: 'xs', g: 'wef' },
  { tIn: 151.18, tOut: 154.02, kind: 'container', ref: 'wef-editions-timeline-growing', state: 'growing', x: 'swap', g: 'wef' },
  { tIn: 154.02, tOut: 157.2, kind: 'chart', ref: 'C4b', x: 'xs' },
  { tIn: 157.2, tOut: 159.5, kind: 'deck', ref: 'RL-2-graphic-designers', state: 'already-gone', x: 'lib' },
  // CH3 NEXT: VIDEO EDITORS (purple)
  { tIn: 161.88, tOut: 165.667, kind: 'still', ref: 'IMG-7-edit-bay', x: 'card' },
  { tIn: 171.833, tOut: 173.94, kind: 'vid', ref: 'BR-8-studio-light-on', x: 'lib' },
  { tIn: 173.94, tOut: 178.2, kind: 'receipt', ref: 'R2-netflix-q2-2025', x: 'xs', mo: 'motion-3d-orbit-1-t-right', push: 'obj' },
  { tIn: 178.2, tOut: 181.32, kind: 'clipstill', ref: 'CLIP-5-lead-in', x: 'xs' },
  { tIn: 181.32, tOut: 183.44, kind: 'clipstill', ref: 'CLIP-5-lead-out', x: 'cut' },
  { tIn: 183.44, tOut: 190.0, kind: 'receipt', ref: 'C13-adobe-premiere-generative-extend', x: 'xs', mo: 'motion-3d-offset-2-right-up', push: 'obj' },
  { tIn: 190.0, tOut: 195.33, kind: 'receipt', ref: 'R3-bls-editors', x: 'xs' },
  { tIn: 195.33, tOut: 201.31, kind: 'deck', ref: 'RL-3-video-editors', state: '18-months', x: 'lib' },
  { tIn: 201.31, tOut: 205.25, kind: 'vid', ref: 'BR-9-hand-grading-console-purple', x: 'fade' },
  { tIn: 205.25, tOut: 212.23, kind: 'deck', ref: 'human-touch-card-s1', state: 's1', x: 'xs', g: 'ht' },
  { tIn: 212.23, tOut: 213.01, kind: 'container', ref: 'human-touch-card-s2', state: 's2', x: 'swap', g: 'ht' },
  { tIn: 213.01, tOut: 215.33, kind: 'vid', ref: 'BR-10-ekg-flatline', x: 'fade' },
  // CH4 NEXT: ACTORS AND MODELS (purple, no card)
  { tIn: 215.33, tOut: 219.19, kind: 'still', ref: 'IMG-8-mannequins', x: 'lib' },
  { tIn: 219.19, tOut: 222.91, kind: 'receipt', ref: 'R4-particle6-sketch', x: 'xs', mo: 'motion-3d-pan-2-left', push: 'obj' },
  { tIn: 222.91, tOut: 224.905, kind: 'clipstill', ref: 'CLIP-4-lead-in', x: 'xs' },
  { tIn: 224.905, tOut: 227.75, kind: 'clipstill', ref: 'CLIP-4-lead-out', x: 'cut' },
  { tIn: 227.75, tOut: 230.29, kind: 'vid', ref: 'BR-11-face-mesh-scan', x: 'fade' },
  { tIn: 230.29, tOut: 232.55, kind: 'deck', ref: 'C14-tilly-timeline-base', state: 'base', x: 'xs', g: 'c14' },
  { tIn: 232.55, tOut: 233.57, kind: 'container', ref: 'C14-tilly-timeline-sketch', state: 'sketch', x: 'swap', g: 'c14' },
  { tIn: 233.57, tOut: 237.37, kind: 'container', ref: 'C14-tilly-timeline-zurich', state: 'zurich', x: 'swap', g: 'c14' },
  { tIn: 237.37, tOut: 239.3, kind: 'clipstill', ref: 'CLIP-3-lead-in', x: 'xs' },
  { tIn: 239.3, tOut: 241.69, kind: 'clipstill', ref: 'CLIP-3-lead-out', x: 'cut' },
  { tIn: 241.69, tOut: 246.41, kind: 'receipt', ref: 'R5-nbc-sag-aftra', x: 'xs' },
  { tIn: 246.41, tOut: 252.89, kind: 'receipt', ref: 'C15-deadline-misaligned', x: 'xs', mo: 'motion-3d-orbit-2-right-down', push: 'obj' },
  { tIn: 252.89, tOut: 258.77, kind: 'receipt', ref: 'C16-1-hm-ai-twins', x: 'lib', g: 'promo' },
  { tIn: 258.77, tOut: 261.85, kind: 'receipt', ref: 'C16-2-guess-vogue-ai-models', x: 'swap', g: 'promo' },
  { tIn: 261.85, tOut: 266.49, kind: 'receipt', ref: 'C16-3-coke-ad', x: 'swap', g: 'promo' },
  { tIn: 266.49, tOut: 269.69, kind: 'receipt', ref: 'R6-marketingweek-coke', x: 'xs' },
  { tIn: 269.69, tOut: 273.79, kind: 'receipt', ref: 'C18-caixin-ai-movie', x: 'xs' },
  { tIn: 273.79, tOut: 276.65, kind: 'deck', ref: 'RL-4-actors-models', state: 'high', x: 'lib' },
  // CH5 UNIVERSITIES (cyan, no card)
  { tIn: 276.65, tOut: 280.29, kind: 'vid', ref: 'BR-12-campus-night-columns', x: 'lib' },
  { tIn: 280.29, tOut: 282.69, kind: 'deck', ref: 'arg-1-information', state: 'pop', x: 'xs' },
  { tIn: 282.69, tOut: 286.45, kind: 'vid', ref: 'BR-13-phone-chat-dark', x: 'fade' },
  { tIn: 286.45, tOut: 290.01, kind: 'vid', ref: 'BR-14-clock-3am', x: 'fade' },
  { tIn: 290.01, tOut: 292.41, kind: 'still', ref: 'IMG-9-campus-quad', x: 'lib' },
  { tIn: 292.41, tOut: 297.71, kind: 'receipt', ref: 'C20-nyfed-recent-grads', x: 'xs' },
  { tIn: 297.71, tOut: 304.33, kind: 'deck', ref: 'C19-university-card-s1', state: 's1', x: 'xs', g: 'c19' },
  { tIn: 304.33, tOut: 307.93, kind: 'container', ref: 'C19-university-card-s2', state: 's2', x: 'swap', g: 'c19' },
  { tIn: 307.93, tOut: 311.89, kind: 'container', ref: 'C19-university-card-s3', state: 's3', x: 'swap', g: 'c19' },
  { tIn: 311.89, tOut: 316.51, kind: 'receipt', ref: 'R7-nyfed-hhdc', x: 'xs' },
  { tIn: 316.51, tOut: 321.93, kind: 'receipt', ref: 'R8-nsc-enrollment', x: 'xs' },
  { tIn: 321.93, tOut: 325.59, kind: 'receipt', ref: 'C21-restofworld-china-universities', x: 'xs' },
  { tIn: 325.59, tOut: 328.367, kind: 'deck', ref: 'RL-5-university-jobs', state: '3-to-5-years', x: 'lib' },
  // CH6 ACCOUNTANTS AND LAWYERS (cyan, no card)
  { tIn: 332.733, tOut: 338.53, kind: 'deck', ref: 'ch6-four-skeletons', state: 'overview', x: 'lib' },
  { tIn: 338.53, tOut: 342.17, kind: 'vid', ref: 'BR-15-adding-machine-tape', x: 'fade' },
  { tIn: 342.17, tOut: 349.85, kind: 'receipt', ref: 'R9-bls-bookkeepers', x: 'xs' },
  { tIn: 349.85, tOut: 352.37, kind: 'deck', ref: 'RL-6-bookkeepers', state: 'shrinking-now', x: 'lib' },
  { tIn: 352.37, tOut: 358.89, kind: 'receipt', ref: 'R10-goldman-2025', x: 'xs' },
  { tIn: 358.89, tOut: 366.67, kind: 'receipt', ref: 'R11-accountancyage-kpmg', x: 'xs' },
  { tIn: 366.67, tOut: 375.03, kind: 'deck', ref: 'RL-7-accountants', state: 'entry-level-first', x: 'lib' },
  { tIn: 375.03, tOut: 378.95, kind: 'vid', ref: 'BR-16-desk-lamp-office-night', x: 'fade' },
  { tIn: 378.95, tOut: 382.91, kind: 'receipt', ref: 'R12-bls-paralegals', x: 'xs' },
  { tIn: 382.91, tOut: 385.55, kind: 'deck', ref: 'RL-8-paralegals', state: 'stalled', x: 'lib' },
  { tIn: 385.55, tOut: 395.99, kind: 'chart', ref: 'C22', x: 'xs' },
  { tIn: 395.99, tOut: 403.55, kind: 'receipt', ref: 'R13-harvey-blog', x: 'xs' },
  { tIn: 403.55, tOut: 407.47, kind: 'vid', ref: 'BR-17-empty-courtroom', x: 'fade' },
  { tIn: 407.47, tOut: 409.63, kind: 'deck', ref: 'legal-work-diagram-courtroom', state: 'courtroom', x: 'xs', g: 'legal' },
  { tIn: 409.63, tOut: 413.65, kind: 'container', ref: 'legal-work-diagram-never-sees-a-judge', state: 'never', x: 'swap', g: 'legal' },
  { tIn: 413.65, tOut: 414.51, kind: 'container', ref: 'legal-work-diagram-contracts', state: 'contracts', x: 'swap', g: 'legal' },
  { tIn: 414.51, tOut: 418.17, kind: 'vid', ref: 'BR-18-fountain-pen-fine-print', x: 'fade' },
  { tIn: 418.17, tOut: 422.11, kind: 'still', ref: 'IMG-10-paper-particles', x: 'lib' },
  { tIn: 422.11, tOut: 427.73, kind: 'receipt', ref: 'C26-bls-lawyers-outlook', x: 'xs' },
  { tIn: 427.73, tOut: 433.267, kind: 'deck', ref: 'RL-9-lawyers', state: 'work-changes-first', x: 'lib' },
  // CH7 HEALTHCARE GETS CHEAPER (green)
  { tIn: 438.845, tOut: 442.167, kind: 'still', ref: 'IMG-11-hospital-corridor', x: 'card' },
  { tIn: 447.533, tOut: 449.99, kind: 'deck', ref: 'C27-last-30-days-s1', state: 's1-empty', x: 'lib', g: 'c27a' },
  { tIn: 449.99, tOut: 452.67, kind: 'container', ref: 'C27-last-30-days-s2', state: 's2-oct8', x: 'swap', g: 'c27a' },
  { tIn: 452.67, tOut: 454.67, kind: 'receipt', ref: 'C31-life-bio-er100-release', x: 'xs' },
  { tIn: 454.67, tOut: 462.57, kind: 'container', ref: 'C27-last-30-days-s3', state: 's3-oct12', x: 'xs' },
  { tIn: 462.57, tOut: 466.53, kind: 'deck', ref: 'weeks-to-a-day-card-s1', state: 's1', x: 'xs', g: 'weeks' },
  { tIn: 466.53, tOut: 467.35, kind: 'container', ref: 'weeks-to-a-day-card-s2', state: 's2', x: 'swap', g: 'weeks' },
  { tIn: 467.35, tOut: 470.89, kind: 'container', ref: 'C27-last-30-days-s4', state: 's4-oct19', x: 'xs' },
  { tIn: 470.89, tOut: 476.95, kind: 'receipt', ref: 'C28-a-fda-jemperli', x: 'xs', mo: 'motion-3d-orbit-2-left-up', push: 'obj' },
  { tIn: 476.95, tOut: 482.43, kind: 'container', ref: 'C27-last-30-days-s5', state: 's5-oct20', x: 'xs' },
  { tIn: 482.43, tOut: 487.85, kind: 'receipt', ref: 'C28-b-fda-hibsago', x: 'xs' },
  { tIn: 487.85, tOut: 491.37, kind: 'vid', ref: 'BR-19-lab-green-dish', x: 'fade' },
  { tIn: 491.37, tOut: 499.39, kind: 'receipt', ref: 'C30-waterloo-kidney-stone-robots', x: 'xs' },
  { tIn: 499.39, tOut: 506.23, kind: 'container', ref: 'C27-last-30-days-s6', state: 's6-overview', x: 'xs' },
  { tIn: 506.23, tOut: 508.27, kind: 'vid', ref: 'BR-20-earth-sunrise-orbit', x: 'fade' },
  { tIn: 508.27, tOut: 532.93, kind: 'chart', ref: 'C35', x: 'lib' },
  { tIn: 532.93, tOut: 536.75, kind: 'vid', ref: 'BR-21-pipette-green', x: 'fade' },
  { tIn: 536.75, tOut: 539.93, kind: 'deck', ref: 'money-moves-diagram-cures', state: 'cures', x: 'xs', g: 'money' },
  { tIn: 539.93, tOut: 540.39, kind: 'container', ref: 'money-moves-diagram-hospital', state: 'hospital', x: 'swap', g: 'money' },
  { tIn: 540.39, tOut: 544.37, kind: 'vid', ref: 'BR-22-empty-hospital-ward', x: 'fade' },
  // CH8 OWN ASSETS (red)
  { tIn: 547.45, tOut: 549.43, kind: 'vid', ref: 'BR-23-silhouette-red-blinds', x: 'card' },
  { tIn: 549.43, tOut: 552.17, kind: 'vid', ref: 'BR-24-office-windows-night', x: 'fade' },
  { tIn: 552.17, tOut: 555.83, kind: 'vid', ref: 'BR-25-server-racks-red', x: 'fade' },
  { tIn: 555.83, tOut: 557.35, kind: 'vid', ref: 'BR-26-robot-arms-welding', x: 'fade' },
  { tIn: 557.35, tOut: 560.21, kind: 'vid', ref: 'BR-27-phone-hand-night-city', x: 'fade' },
  { tIn: 560.21, tOut: 561.71, kind: 'vid', ref: 'BR-28-gate-opening-dark', x: 'fade' },
  { tIn: 561.71, tOut: 564.09, kind: 'receipt', ref: 'R14-last-video', x: 'xs', mo: 'motion-3d-pan-1-right', push: 'obj' },
  { tIn: 564.09, tOut: 565.25, kind: 'deck', ref: 'coin-marks-s1', state: 'bitcoin', x: 'xs', g: 'coins' },
  { tIn: 565.25, tOut: 565.83, kind: 'container', ref: 'coin-marks-s2', state: 'kaspa', x: 'swap', g: 'coins' },
  { tIn: 565.83, tOut: 566.167, kind: 'container', ref: 'coin-marks-s3', state: 'tao', x: 'swap', g: 'coins' },
  { tIn: 568.733, tOut: 571.19, kind: 'vid', ref: 'BR-29-silhouette-corridor', x: 'lib' },
  { tIn: 571.19, tOut: 574.57, kind: 'vid', ref: 'BR-30-campfire-silhouettes', x: 'fade' },
  { tIn: 574.57, tOut: 579.73, kind: 'receipt', ref: 'R15-cryptorich-home', x: 'xs' },
  { tIn: 579.73, tOut: 582.61, kind: 'deck', ref: 'risk-ladder-overview-s1', state: 'all-dark', x: 'xs', g: 'ladder' },
  { tIn: 582.61, tOut: 585.03, kind: 'container', ref: 'risk-ladder-overview-s2', state: 'gone', x: 'swap', g: 'ladder' },
  { tIn: 585.03, tOut: 587.67, kind: 'container', ref: 'risk-ladder-overview-s3', state: 'next', x: 'swap', g: 'ladder' },
  { tIn: 587.67, tOut: 590.73, kind: 'container', ref: 'risk-ladder-overview-s4', state: 'clock', x: 'swap', g: 'ladder' },
  { tIn: 590.73, tOut: 596.39, kind: 'container', ref: 'risk-ladder-overview-s5', state: 'cheaper-own', x: 'swap', g: 'ladder' },
  { tIn: 596.39, tOut: 600.45, kind: 'deck', ref: 'comment-card', state: 'card', x: 'xs' },
  { tIn: 600.45, tOut: 604.25, kind: 'vid', ref: 'BR-31-red-smoke-black', x: 'fade' },
  { tIn: 604.25, tOut: 610.133, kind: 'deck', ref: 'end-card', state: 'overlay', x: 'lib' },
];
// captions (section 8): the generated windows (FACE holds over 5 s); asserted identical to the import below
const CAPTION_SRC: [number, number][] = [[37.133, 43.233], [45.967, 55.033], [99.5, 112.233], [165.667, 171.833], [433.267, 438.733], [442.167, 447.533]];
if (JSON.stringify(CAPTION_SRC) !== JSON.stringify(CAPTION_WINDOWS.map(([a, b]) => [a, b]))) throw new Error('CAPTION_SRC drifted from Only18MonthsLeftCaptions.ts');

const DIAGRAMS = new Set(['C2-clock-his-window', 'C2-clock-mikes-call', 'C14-tilly-timeline-base', 'C14-tilly-timeline-sketch', 'C14-tilly-timeline-zurich',
  'legal-work-diagram-courtroom', 'legal-work-diagram-never-sees-a-judge', 'legal-work-diagram-contracts', 'money-moves-diagram-cures', 'money-moves-diagram-hospital',
  'old-workflow-flow-base', 'old-workflow-flow-brief', 'old-workflow-flow-wait', 'old-workflow-flow-revisions', 'old-workflow-flow-invoice', 'old-workflow-flow-days',
  'wef-editions-timeline-first-time', 'wef-editions-timeline-growing']);
const deckSrc = (ref: string) => staticFile(`${DIAGRAMS.has(ref) ? 'diagrams' : 'card-slides'}/${ref}.png`);

// b-roll clip facts (ffprobe): seconds, and the 24 / 25 fps clips that play frame-for-frame (section 11)
const VID_LEN: Record<string, number> = {
  'BR-1-fog-road-night': 3.637, 'BR-2-particle-brain': 3.804, 'BR-3-pocket-watch': 5.572, 'BR-4-tall-grass-dusk': 4.104, 'BR-5-typewriter-night': 4.671,
  'BR-6-tired-freelancer-laptop': 4.88, 'BR-7-ai-image-resolving': 3.8, 'BR-8-studio-light-on': 4.137, 'BR-9-hand-grading-console-purple': 6.006,
  'BR-10-ekg-flatline': 4.333, 'BR-11-face-mesh-scan': 4.56, 'BR-12-campus-night-columns': 5.667, 'BR-13-phone-chat-dark': 5.76, 'BR-14-clock-3am': 5.56,
  'BR-15-adding-machine-tape': 5.672, 'BR-16-desk-lamp-office-night': 5.92, 'BR-17-empty-courtroom': 5.923, 'BR-18-fountain-pen-fine-print': 5.667,
  'BR-19-lab-green-dish': 5.539, 'BR-20-earth-sunrise-orbit': 4.071, 'BR-21-pipette-green': 5.84, 'BR-22-empty-hospital-ward': 6.0,
  'BR-23-silhouette-red-blinds': 4.054, 'BR-24-office-windows-night': 4.755, 'BR-25-server-racks-red': 5.667, 'BR-26-robot-arms-welding': 3.533,
  'BR-27-phone-hand-night-city': 4.88, 'BR-28-gate-opening-dark': 3.52, 'BR-29-silhouette-corridor': 4.471, 'BR-30-campfire-silhouettes': 5.4, 'BR-31-red-smoke-black': 5.8,
};
// value = the clip's own fps (n / d); it plays at playbackRate 30 / fps, frame for frame (check_broll_motion.py reads it)
const VID_FPS: Record<string, number> = {
  'BR-6-tired-freelancer-laptop': 25 / 1, 'BR-7-ai-image-resolving': 25 / 1, 'BR-11-face-mesh-scan': 25 / 1, 'BR-12-campus-night-columns': 24 / 1, 'BR-13-phone-chat-dark': 25 / 1,
  'BR-14-clock-3am': 25 / 1, 'BR-16-desk-lamp-office-night': 25 / 1, 'BR-17-empty-courtroom': 24000 / 1001, 'BR-21-pipette-green': 25 / 1, 'BR-22-empty-hospital-ward': 25 / 1,
  'BR-24-office-windows-night': 24000 / 1001, 'BR-27-phone-hand-night-city': 25 / 1, 'BR-28-gate-opening-dark': 25 / 1, 'BR-30-campfire-silhouettes': 25 / 1,
};
// receipts: display height at full width (px), the burned-in highlight's centre (measured on the PNG, null = none / an
// object receipt) and the page's content column (measured): the camera reads the page at a legible scale (section 4)
const RECEIPT: Record<string, { h: number; fx: number; fy: number | null; cx: number; cw: number; pan?: { fx: number; fy: number; t0: number; t1: number } }> = {
  'C10-mike-thumbnail-wall': { h: 1080, fx: 960, fy: null, cx: 958, cw: 1772 },
  'R15-cryptorich-home': { h: 1080, fx: 960, fy: null, cx: 960, cw: 1600 },
  'C13-adobe-premiere-generative-extend': { h: 1400, fx: 960, fy: null, cx: 958, cw: 1324 },
  'C15-deadline-misaligned': { h: 1500, fx: 960, fy: null, cx: 960, cw: 1144 },
  'C18-caixin-ai-movie': { h: 1200, fx: 548, fy: 640, cx: 954, cw: 1180 },
  'C20-nyfed-recent-grads': { h: 1400, fx: 711, fy: 791, cx: 958, cw: 1916 },
  'C21-restofworld-china-universities': { h: 1500, fx: 931, fy: 950, cx: 958, cw: 796 },
  'C26-bls-lawyers-outlook': { h: 1400, fx: 714, fy: 716, cx: 958, cw: 1916 },
  'C28-a-fda-jemperli': { h: 1500, fx: 960, fy: null, cx: 958, cw: 1916 },
  'C28-b-fda-hibsago': { h: 1650, fx: 951, fy: 1411, cx: 958, cw: 1916 },
  'C30-waterloo-kidney-stone-robots': { h: 1830, fx: 1175, fy: 521, cx: 958, cw: 1892 },
  'C31-life-bio-er100-release': { h: 1300, fx: 743, fy: 404, cx: 958, cw: 1916 },
  'C6-bls-writers-outlook': { h: 1400, fx: 694, fy: 674, cx: 958, cw: 1916 },
  'C7-wef-graphic-designers': { h: 2716, fx: 780, fy: 1137, cx: 958, cw: 1684, pan: { fx: 1520, fy: 128, t0: 146.9, t1: 148.0 } }, // the highlight runs over the column break
  'C9-midjourney-plans': { h: 1300, fx: 988, fy: 649, cx: 1170, cw: 1444 },
  'R1-openai-plus': { h: 1100, fx: 772, fy: 548, cx: 958, cw: 1020 },
  'R10-goldman-2025': { h: 1520, fx: 965, fy: 1373, cx: 958, cw: 1916 },
  'R11-accountancyage-kpmg': { h: 1080, fx: 820, fy: 863, cx: 958, cw: 1916 },
  'R12-bls-paralegals': { h: 1400, fx: 697, fy: 716, cx: 958, cw: 1916 },
  'R13-harvey-blog': { h: 1400, fx: 928, fy: 1293, cx: 956, cw: 672 },
  'R14-last-video': { h: 1300, fx: 960, fy: null, cx: 956, cw: 1880 },
  'R2-netflix-q2-2025': { h: 1300, fx: 960, fy: null, cx: 954, cw: 1884 },
  'R3-bls-editors': { h: 1400, fx: 1324, fy: 571, cx: 958, cw: 1916 },
  'R4-particle6-sketch': { h: 1300, fx: 960, fy: null, cx: 956, cw: 1880 },
  'R5-nbc-sag-aftra': { h: 1080, fx: 841, fy: 894, cx: 958, cw: 1916 },
  'R6-marketingweek-coke': { h: 1320, fx: 767, fy: 875, cx: 958, cw: 1916 },
  'R7-nyfed-hhdc': { h: 2485, fx: 565, fy: 1792, cx: 952, cw: 1680 },
  'R8-nsc-enrollment': { h: 2100, fx: 1192, fy: 797, cx: 958, cw: 1916 },
  'R9-bls-bookkeepers': { h: 1400, fx: 718, fy: 592, cx: 958, cw: 1916 },
};
const CLIP_FRAMES: Record<string, number> = { 'CLIP-1': 467, 'CLIP-3': 356, 'CLIP-4': 302, 'CLIP-5': 276 };
const CLIP_FILE: Record<string, string> = {
  'CLIP-1': 'CLIP-1-suleyman-12-to-18-months', 'CLIP-3': 'CLIP-3-van-der-velden-agency', 'CLIP-4': 'CLIP-4-particle6-sketch-tilly', 'CLIP-5': 'CLIP-5-netflix-vfx-10x-faster',
};

// derived rows: frames, the hand-ingress overlap (B fades in centred on the cut; A runs on under it until B is opaque)
const IN_D: Record<string, number> = { fade: 15, xs: 11, swap: 6 };
type Row = Cover & { s: number; e: number; inD: number; pre: number; post: number; seq: number; gs: number; ge: number };
const ROWS: Row[] = (() => {
  const r: Row[] = COVERS.map((c) => {
    const inD = IN_D[c.x ?? ''] ?? 0;
    return { ...c, s: F(c.tIn), e: endF(c.tOut), inD, pre: Math.floor(inD / 2), post: 0, seq: 0, gs: 0, ge: 0 };
  });
  r.forEach((c, i) => {
    const n = r[i + 1];
    if (n && n.s === c.e && n.inD > 0) c.post = n.inD - n.pre;
    c.seq = c.s - c.pre;
  });
  // container groups: one push across all states of a group
  r.forEach((c, i) => {
    const key = c.g ?? c.ref;
    let a = i;
    while (a > 0 && (r[a - 1].g ?? r[a - 1].ref) === key && r[a - 1].e === r[a].s) a--;
    let b = i;
    while (b < r.length - 1 && (r[b + 1].g ?? r[b + 1].ref) === key && r[b + 1].s === r[b].e) b++;
    c.gs = r[a].s;
    c.ge = r[b].e;
  });
  return r;
})();
const rowByRef = (ref: string) => {
  const i = ROWS.findIndex((r) => r.ref === ref);
  if (i < 0) throw new Error(`no COVERS row ${ref}`);
  return ROWS[i];
};

// ---------------------------------------------------------------------------------------------------------------------
// 4. CLOCKS + node bodies (every body renders from the ABSOLUTE frame, section 6a rule 2)
const AbsF = React.createContext(0);
const fill: React.CSSProperties = { position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, objectFit: 'cover' };
const cl = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const easeOut = Easing.out(Easing.cubic);

const FaceBody: React.FC<{ fi: number; abs: number; punch?: number }> = ({ fi, abs, punch }) => {
  const fc = FACES[fi];
  const a = F(fc.a);
  const rel = Math.max(0, abs - a);
  let sc = punch ?? (fc.join !== undefined && abs >= F(fc.join) ? PUNCH : 1);
  if (fc.n === 1) sc = 1 + 0.06 * Math.min(1, rel / (F(fc.b) - a)); // F1: the slow push over the hook line
  const video = () => (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', transformOrigin: `${FACE_POINT.x}px ${FACE_POINT.y}px`, transform: `scale(${sc})` }}>
      <Freeze frame={Math.min(SWAP_FRAMES[fc.n] - 1, rel + SWAP_HEAD)}>
        <OffthreadVideo src={staticFile(`face-swap/F${fc.n}-higgsfield-bg-swap.mp4`)} muted style={fill} />
      </Freeze>
    </div>
  );
  if (fc.shake && abs >= F(fc.shake.t) && (fc.shake.t1 === undefined || abs < F(fc.shake.t1))) {
    // hw-camera-shake: the TRANSITIONS row's MotionShake, track t = 0 on its first frame, frame-locked to the comp
    const row = getTransition(fc.shake.row);
    if (!row) throw new Error(`missing ${fc.shake.row}`);
    return (
      <Freeze frame={abs - F(fc.shake.t)}>
        <MotionShake from={null} to={null} durationInFrames={F(fc.b) - F(fc.shake.t)} params={row.params as never} outClip={video} />
      </Freeze>
    );
  }
  return video();
};

const ReceiptView: React.FC<{ c: Row; abs: number }> = ({ c, abs }) => {
  const r = RECEIPT[c.ref];
  const dur = Math.max(1, c.e - c.s);
  const rel = abs - c.s;
  const obj = c.push === 'obj' || r.fy === null;
  // read scale: a narrow page fills the frame with its column; a full-width page (nav bars) gets a 1.45x read zoom
  const s0 = obj ? Math.min(1.4, 1840 / r.cw) : r.cw < 1500 ? Math.min(1.6, 1800 / r.cw) : 1.45;
  const k = obj ? 0 : interpolate(rel, [0, dur], [0, 1], { ...cl, easing: Easing.inOut(Easing.sin) });
  const s = Math.max(s0 * (1 + 0.06 * k), 1080 / r.h);
  // focus: the highlight (or the column's top for an object receipt), clamped so the page always covers the frame
  let fxRaw = r.cw < 1500 ? r.cx : obj ? r.cx : r.fx;
  let fyRaw = obj ? 0 : (r.fy as number);
  if (r.pan) {
    // a two-point read: the camera travels from the first highlight to the second ON the words
    const q = interpolate(abs, [F(r.pan.t0), F(r.pan.t1)], [0, 1], { ...cl, easing: Easing.inOut(Easing.cubic) });
    fxRaw += (r.pan.fx - fxRaw) * q;
    fyRaw += (r.pan.fy - fyRaw) * q;
  }
  const fx = Math.max(960 / s, Math.min(1920 - 960 / s, fxRaw));
  const fy = Math.max(540 / s, Math.min(r.h - 540 / s, fyRaw));
  const view = () => (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#ffffff' }}>
      <Img
        src={staticFile(`receipts/${c.ref}.png`)}
        style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: r.h, transformOrigin: '0 0', transform: `translate(${960 - fx * s}px, ${540 - fy * s}px) scale(${s})` }}
      />
    </div>
  );
  if (c.mo) {
    // [MOTION] lib:motion-3d-*: the 5 s camera move fitted to the slot (t * 5 / slot), clock set with <Freeze>
    const row = getTransition(c.mo);
    if (!row) throw new Error(`missing ${c.mo}`);
    const Engine = ENGINES[row.engine];
    const n = framesForRow(row, FPS);
    return (
      <Freeze frame={Math.max(0, Math.min(n - 1, Math.round((rel / dur) * (n - 1))))}>
        <Engine from={null} to={null} durationInFrames={n} params={row.params} outClip={view} />
      </Freeze>
    );
  }
  return view();
};

// ROLL 2 (hw-zoom-slideshow, faster): the five AI stills, each with its code-rendered BLS label, cut on the spoken words
const ROLL2_LABELS: Record<string, string> = {
  'IMG-1-writer-desk': 'WRITERS AND AUTHORS 140K', 'IMG-2-design-studio': 'GRAPHIC DESIGNERS 253K', 'IMG-3-edit-suite': 'FILM AND VIDEO EDITORS 39K',
  'IMG-4-accounting-office': 'ACCOUNTANTS AND AUDITORS 1.6M', 'IMG-5-law-office': 'LAWYERS 864K',
};
const LEAKS = [1, 2, 3, 4, 5, 6].map((n) => staticFile(`effects/halloween-2022/textures/leak-${n}.mp4`));
const ROLL2_SLIDES: HwSlide[] = COVERS.filter((c) => c.g === 'roll2').map((c) => ({
  src: staticFile(`img/${c.ref}.png`), title: ROLL2_LABELS[c.ref], len: c.tOut - c.tIn,
}));
const ROLL1_MOVES: HwSlide['move'][] = ['out', 'in-slide', 'out', 'in-drift'];
const ROLL1_SLIDES: HwSlide[] = ROLL1.map((r, i) => ({
  src: staticFile(`charts/${r.ref}.png`), len: (i + 1 < ROLL1.length ? ROLL1[i + 1].t : ROLL1_END) - r.t,
  move: ROLL1_MOVES[i % 4], focusX: 960, focusY: 720,
}));
// hw-blood-promo (the 1:27 After-Effects slideshow): the three REAL brand images, one blood title per brand
const PROMO: HwPromoScene[] = [
  { kind: 'diagonal', src: staticFile('receipts/C16-1-hm-ai-twins.png'), title: 'H&M', dur: 258.77 - 252.89, titleAt: 0.3 },
  { kind: 'panels', src: staticFile('receipts/C16-2-guess-vogue-ai-models.png'), title: 'GUESS', dur: 261.85 - 258.77, titleAt: 1.1 },
  { kind: 'panels', src: staticFile('receipts/C16-3-coke-ad.mp4'), video: true, title: 'COCA-COLA', dur: 266.49 - 261.85, titleAt: 1.3 },
];
const HW = 'effects/halloween-2022/';

const ChartFor: React.FC<{ c: Row; abs: number }> = ({ c, abs }) => {
  const p: ChartProps = { rel: abs - c.s, fr: (t: number) => F(t) - c.s, abs };
  if (c.ref === 'C1-roll1') return <HwZoomSlideshow t0={ROLL1[0].t} slides={ROLL1_SLIDES} speed={1} leakSrcs={LEAKS} />;
  if (c.ref === 'H1') return <H1Chart {...p} />;
  if (c.ref === 'C4') return <C4Chart {...p} />;
  if (c.ref === 'C4b') return <C4bChart {...p} />;
  if (c.ref === 'C22') return <C22Chart {...p} />;
  if (c.ref === 'C35') return <C35Chart {...p} pause={{ from: FS(532.88), frames: Math.round(5.1 * FPS) }} />;
  throw new Error(`no animated chart for ${c.ref}`);
};

const ClipStill: React.FC<{ c: Row; abs: number }> = ({ c, abs }) => {
  const id = c.ref.slice(0, 6);
  const lead = c.ref.endsWith('lead-in');
  const rel = abs - c.s;
  const dur = Math.max(1, c.e - c.s);
  // lead-in: a settling push that lands at 1.0 ON the splice (the clip starts on this very frame); lead-out pushes on
  const s = lead ? interpolate(rel, [0, dur], [1.04, 1], { ...cl, easing: easeOut }) : interpolate(rel, [0, dur], [1, 1.04], cl);
  let filter = 'none';
  let glitch: React.ReactNode = null;
  if (id === 'CLIP-4' && !lead) {
    // the sketch's last frame freezes, desaturates and glitches under 'Nobody is real in that clip'
    filter = `grayscale(${interpolate(rel, [0, 15], [0, 1], cl)})`;
    if (rel >= 15 && rel < 24) {
      const bands = [0, 1, 2, 3, 4].map((i) => {
        const h = (Math.sin(rel * 12.9898 + i * 78.233) * 43758.5453) % 1;
        return { y: Math.floor(Math.abs(h) * 900), hh: 40 + Math.floor(Math.abs(h * 7) % 1 * 120), dx: (h - 0.5) * 220 };
      });
      glitch = bands.map((b, i) => (
        <div key={i} style={{ position: 'absolute', left: 0, top: b.y, width: 1920, height: b.hh, overflow: 'hidden' }}>
          <Img src={staticFile(`clip-inserts/stills/${id}-last.png`)} style={{ ...fill, top: -b.y, left: b.dx, filter: 'grayscale(1) contrast(1.4)' }} />
        </div>
      ));
    }
  }
  return (
    <AbsoluteFill style={{ background: 'black', overflow: 'hidden' }}>
      <Img src={staticFile(`clip-inserts/stills/${id}-${lead ? 'first' : 'last'}.png`)} style={{ ...fill, transform: `scale(${s})`, filter }} />
      {glitch}
    </AbsoluteFill>
  );
};

const CoverBody: React.FC<{ c: Row; abs: number }> = ({ c, abs }) => {
  const rel = abs - c.s;
  switch (c.kind) {
    case 'vid': {
      const rate = VID_FPS[c.ref] ? FPS / VID_FPS[c.ref] : 1;
      const maxF = Math.floor((VID_LEN[c.ref] * FPS) / rate) - 2;
      const vf = Math.max(0, Math.min(maxF, rel + c.pre));
      return (
        <AbsoluteFill style={{ background: 'black' }}>
          <Freeze frame={vf}>
            <OffthreadVideo src={staticFile(`vid/${c.ref}.mp4`)} muted playbackRate={rate} style={fill} />
          </Freeze>
        </AbsoluteFill>
      );
    }
    case 'still': {
      if (c.g === 'roll2') return <HwZoomSlideshow t0={19.24} slides={ROLL2_SLIDES} speed={1} leakSrcs={LEAKS} titleSize={84} />;
      const dur = Math.max(1, c.e - c.s);
      const s = 1 + 0.06 * interpolate(rel, [0, dur], [0, 1], cl); // a slow push, never a dead-still AI image
      return (
        <AbsoluteFill style={{ background: 'black', overflow: 'hidden' }}>
          <Img src={staticFile(`img/${c.ref}.png`)} style={{ ...fill, transform: `scale(${s})` }} />
        </AbsoluteFill>
      );
    }
    case 'receipt':
      if (c.g === 'promo') {
        return (
          <AbsoluteFill style={{ background: 'black' }}>
            <HwBloodPromo
              t0={252.89}
              scenes={PROMO}
              matteSrc={(n) => staticFile(`${HW}graphics/matte-t${n}.mp4`)}
              bloodSrc={(n) => ({ fill: staticFile(`${HW}graphics/blood-${n}-fill.mp4`), key: staticFile(`${HW}graphics/blood-${n}-key.mp4`) })}
              squareSrc={staticFile(`${HW}textures/square-motion.mp4`)}
              particlesSrc={staticFile(`${HW}textures/particles.mp4`)}
            />
          </AbsoluteFill>
        );
      }
      return <ReceiptView c={c} abs={abs} />;
    case 'chart':
      return <ChartFor c={c} abs={abs} />;
    case 'clipstill':
      return <ClipStill c={c} abs={abs} />;
    case 'deck':
    case 'container': {
      if (c.ref === 'end-card') {
        // base under the pumpkin plate: BR-31's red smoke held on its last frame (the plate burns over it)
        return <CoverBody c={rowByRef('BR-31-red-smoke-black')} abs={abs} />;
      }
      // a Type 2 still never sits dead still (section 7a): one gentle push across the whole group of states,
      // starting after the ingress engine (so a MELT's still target and the live card match)
      const k = interpolate(abs, [c.gs + 15, Math.max(c.gs + 16, c.ge)], [0, 1], cl);
      let s = 1 + 0.03 * k;
      if (c.ref === 'h0-next-wave-card') {
        const slam = F(5.86) - c.s; // slams ON 'date'
        s *= rel < slam ? 1.08 : interpolate(rel, [slam, slam + 5], [1.3, 1], { ...cl, easing: easeOut });
      }
      if (c.ref === 'arg-1-information') {
        // hw-word-pop motion on the card itself ON 'One' (75 -> 115 -> 100)
        s *= interpolate(rel, [0, 2, 4, 6], [0.75, 0.75, 1.15, 1], cl);
      }
      const jolt = c.ref === 'h0-next-wave-card' && rel >= F(5.86) - c.s && rel < F(5.86) - c.s + 6 ? Math.sin(rel * 9) * 10 : 0;
      return (
        <AbsoluteFill style={{ background: '#0d0f14', overflow: 'hidden' }}>
          <Img src={deckSrc(c.ref)} style={{ ...fill, transform: `translate(${jolt}px, 0) scale(${s})` }} />
        </AbsoluteFill>
      );
    }
  }
  return null;
};

const TrackRow: React.FC<{ c: Row }> = ({ c }) => {
  const abs = React.useContext(AbsF);
  const k = abs - c.seq;
  let op = 1;
  let sc = 1;
  if (c.inD > 0 && k < c.inD) {
    const p = Math.max(0, k / c.inD);
    op = c.x === 'swap' ? p : easeOut(p);
    if (c.x === 'xs') sc = 0.93 + 0.07 * easeOut(p); // hand:xfade-scale
  }
  return (
    <AbsoluteFill style={{ opacity: op, transform: sc !== 1 ? `scale(${sc})` : undefined }}>
      <CoverBody c={c} abs={abs} />
    </AbsoluteFill>
  );
};

// a node by key, rendered from the absolute clock: 'F<n>' face, 'F<n>@0' / 'F<n>@1' face before / after its punch, a
// COVERS ref, 'title-CH<n>' a title card
const Node: React.FC<{ k: string }> = ({ k }) => {
  const abs = React.useContext(AbsF);
  const m = /^F(\d+)(?:@([01]))?$/.exec(k);
  if (m) {
    const fi = FACES.findIndex((f) => f.n === Number(m[1]));
    return <FaceBody fi={fi} abs={abs} punch={m[2] === undefined ? undefined : m[2] === '1' ? PUNCH : 1} />;
  }
  if (k.startsWith('title-')) return <Img src={staticFile(`title-slides/${k}.png`)} style={fill} />;
  return <CoverBody c={rowByRef(k)} abs={abs} />;
};
const nodeFn = (k: string) => () => <AbsoluteFill><Node k={k} /></AbsoluteFill>;

// ---------------------------------------------------------------------------------------------------------------------
// 5. TRANSITIONS (section 6 + 6a), every row tagged with its TRANSITION-PLAN id. Each engine gets a Sequence of EXACTLY
// its window, centred on the cut (cutFrame = win / 2); outside it the cover track is the truth. sfx={false}: section 9.
// melt = MeltEquidistant is an image-only canvas engine: its two sides are CUTFRAME stills (section 6a cost trap), A = the
// comp's own frame just before the window, B = the card PNG it lands on (or the comp's frame just after the window).
// cutA = a CUTFRAME still for the A side (section 6a cost trap): the comp's own frame just before the window, used when
// a live video side made the engine's wrap-tiled copies stall the render (F3: the shaken face under 6 block offsets
// timed out fetching the clip, 2026-10-27 chunk QA)
type Tx = { id: string; t: number; A: string; B: string; melt?: { from: string; to: string }; cutA?: string };
const CF = 'transitions/cutframes/';
const TX: Tx[] = [
  // CH1
  { id: 'blocks-max-2', t: 4.167, A: 'F1', B: 'BR-1-fog-road-night' }, // plan lib:blocks-max-2 face-out
  { id: 'scary-6', t: 7.68, A: 'h0-next-wave-card', B: 'C1-roll1' }, // plan lib:scary-6 PUMPKIN 1 of 3 into the roll call
  { id: 'scary-6-normal75', t: 19.24, A: 'BR-2-particle-brain', B: 'IMG-1-writer-desk' }, // plan lib:scary-6-normal75 glitch-still
  { id: 'split-swinging-offset-combs-1', t: 37.133, A: 'C2-clock-his-window', B: 'F2' }, // plan face-in
  { id: 'glitchoffset-3x', t: 39.667, A: 'F2@0', B: 'F2@1' }, // plan punch-glitch ON the join 39.667
  { id: 'blocks-max-2', t: 43.233, A: 'F2', B: 'C2-clock-mikes-call' }, // plan face-out
  { id: 'split-swinging-offset-short-layout-2x1-1', t: 45.967, A: 'C2-clock-mikes-call', B: 'F3' }, // plan face-in
  { id: 'blocks-medium-2', t: 49.267, A: 'F3@0', B: 'F3@1' }, // plan punch-glitch ON the join 49.267
  { id: 'blocks-max-2', t: 55.033, A: 'F3', B: 'H1', cutA: `${CF}F3-out-A.png` }, // plan face-out (CUTFRAME A side)
  // CH2
  { id: 'melt-equidistant-1', t: 95.88, A: 'C6-bls-writers-outlook', B: 'RL-1-copywriters', melt: { from: `${CF}melt-equidistant-1-A.png`, to: 'card-slides/RL-1-copywriters.png' } },
  { id: 'split-swinging-offset-layout-1x2-2', t: 99.5, A: 'RL-1-copywriters', B: 'F4' }, // plan face-in
  { id: 'glitchoffset-5x', t: 109.3, A: 'F4@0', B: 'F4@1' }, // plan punch-glitch ON the join 109.300
  { id: 'blocks-max-2', t: 112.233, A: 'F4', B: 'C8-price-card-s1' }, // plan face-out
  { id: 'melt-equidistant-short-3', t: 157.2, A: 'C4b', B: 'RL-2-graphic-designers', melt: { from: `${CF}melt-equidistant-short-3-A.png`, to: 'card-slides/RL-2-graphic-designers.png' } },
  { id: 'split-swinging-offset-short-combs-4', t: 159.5, A: 'RL-2-graphic-designers', B: 'F5' }, // plan face-in
  // CH3
  { id: 'split-swinging-offset-layout-2x1-1', t: 165.667, A: 'IMG-7-edit-bay', B: 'F6' }, // plan face-in
  { id: 'blocks-max-2', t: 171.833, A: 'F6', B: 'BR-8-studio-light-on' }, // plan face-out
  { id: 'spin-shake-1x-cw', t: 195.33, A: 'R3-bls-editors', B: 'RL-3-video-editors' }, // plan SPIN-newfacet
  { id: 'glass-blocks-2-horizontal', t: 215.33, A: 'BR-10-ekg-flatline', B: 'IMG-8-mannequins' }, // plan chapter SPLIT into CH4 (no card)
  // CH4
  { id: 'scary-6', t: 252.89, A: 'C15-deadline-misaligned', B: 'C16-1-hm-ai-twins' }, // plan lib:scary-6 PUMPKIN 2 of 3 into hw-blood-promo
  { id: 'spin-shake-2x-ccw', t: 273.79, A: 'C18-caixin-ai-movie', B: 'RL-4-actors-models' }, // plan SPIN-newfacet
  { id: 'glass-blocks-2-horizontal', t: 276.65, A: 'RL-4-actors-models', B: 'BR-12-campus-night-columns' }, // plan chapter SPLIT into CH5
  // CH5
  { id: 'scary-6-normal75', t: 290.01, A: 'BR-14-clock-3am', B: 'IMG-9-campus-quad' }, // plan glitch-still
  { id: 'spin-shake-short-1x-cw', t: 325.59, A: 'C21-restofworld-china-universities', B: 'RL-5-university-jobs' }, // plan SPIN-newfacet
  { id: 'split-swinging-offset-short-layout-1x2-2', t: 328.367, A: 'RL-5-university-jobs', B: 'F7' }, // plan face-in
  { id: 'blocks-strips-2x', t: 332.1, A: 'F7@0', B: 'F7@1' }, // plan punch-glitch ON the join 332.100
  { id: 'glass-blocks-2-horizontal', t: 332.733, A: 'F7', B: 'ch6-four-skeletons' }, // plan face-out = chapter SPLIT into CH6
  // CH6
  { id: 'melt-equidistant-short-1', t: 349.85, A: 'R9-bls-bookkeepers', B: 'RL-6-bookkeepers', melt: { from: `${CF}melt-equidistant-short-1-A.png`, to: 'card-slides/RL-6-bookkeepers.png' } },
  { id: 'melt-equidistant-2', t: 366.67, A: 'R11-accountancyage-kpmg', B: 'RL-7-accountants', melt: { from: `${CF}melt-equidistant-2-A.png`, to: 'card-slides/RL-7-accountants.png' } },
  { id: 'melt-equidistant-short-4', t: 382.91, A: 'R12-bls-paralegals', B: 'RL-8-paralegals', melt: { from: `${CF}melt-equidistant-short-4-A.png`, to: 'card-slides/RL-8-paralegals.png' } },
  { id: 'scary-6', t: 418.17, A: 'BR-18-fountain-pen-fine-print', B: 'IMG-10-paper-particles' }, // plan lib:scary-6 glitch-still
  { id: 'spin-shake-1x-ccw', t: 427.73, A: 'C26-bls-lawyers-outlook', B: 'RL-9-lawyers' }, // plan SPIN-newfacet
  { id: 'split-swinging-offset-combs-3', t: 433.267, A: 'RL-9-lawyers', B: 'F8' }, // plan face-in
  { id: 'glitchoffset-1x', t: 438.267, A: 'F8@0', B: 'F8@1' }, // plan punch-glitch ON the join (f-time, see FACES)
  // CH7
  { id: 'split-swinging-offset-short-combs-2', t: 442.167, A: 'IMG-11-hospital-corridor', B: 'F9' }, // plan face-in
  { id: 'blocks-strips-4x', t: 447.0, A: 'F9@0', B: 'F9@1' }, // plan punch-glitch ON the join (f-time)
  { id: 'blocks-max-2', t: 447.533, A: 'F9', B: 'C27-last-30-days-s1' }, // plan face-out
  { id: 'melt-equidistant-3', t: 508.27, A: 'BR-20-earth-sunrise-orbit', B: 'C35', melt: { from: `${CF}melt-equidistant-3-A.png`, to: `${CF}melt-equidistant-3-B.png` } },
  { id: 'split-swinging-offset-layout-1x2-1', t: 544.4, A: 'BR-22-empty-hospital-ward', B: 'F10' }, // plan face-in
  { id: 'glitchoffset-2x', t: 546.667, A: 'F10@0', B: 'F10@1' }, // plan punch-glitch ON the join (f-time)
  // CH8
  { id: 'split-swinging-offset-short-layout-2x1-2', t: 566.167, A: 'coin-marks-s3', B: 'F11' }, // plan face-in
  { id: 'blocks-strips-6x', t: 567.967, A: 'F11@0', B: 'F11@1' }, // plan punch-glitch ON the join (f-time)
  { id: 'blocks-max-2', t: 568.733, A: 'F11', B: 'BR-29-silhouette-corridor' }, // plan face-out
];
export const TX_WINDOWS = TX.map((x) => {
  const row = getTransition(x.id);
  if (!row) throw new Error(`unknown transition ${x.id}`);
  const win = framesForRow(row, FPS);
  return { ...x, win, from: F(x.t) - Math.round(win / 2) };
});
const TxLayer: React.FC = () => (
  <>
    {TX_WINDOWS.map((x, i) => (
      <Sequence key={i} from={x.from} durationInFrames={x.win} name={`tx ${x.id} @${x.t}`}>
        <TransitionClip id={x.id} cutFrame={Math.round(x.win / 2)} sfx={false} outgoing={x.cutA ? () => <Img src={staticFile(x.cutA as string)} style={fill} /> : nodeFn(x.A)} incoming={nodeFn(x.B)} fromSrc={x.melt?.from} toSrc={x.melt?.to} />
      </Sequence>
    ))}
  </>
);

// ---------------------------------------------------------------------------------------------------------------------
// 6. TITLE CARDS (section 6 bucket 1). Plan card pick rmn:cube: @remotion/transitions ships NO cube presentation (and the
// package is not installed here), so it is the hand-rolled rotateY turn, tag hand:cube-3d. The chapter SPLIT (plan
// lib:glass-blocks-2-horizontal) brings each card in centred on the pause start; the card holds through the 1.5 s pause;
// the cube turns it away onto the chapter's first cover (never back onto the outgoing shot).
const CARDS = [
  { at: 70.86, img: 'title-CH2', A: 'BR-4-tall-grass-dusk', B: 'IMG-6-abandoned-desk' },
  { at: 161.88, img: 'title-CH3', A: 'F5', B: 'IMG-7-edit-bay' },
  { at: 438.845, img: 'title-CH7', A: 'F8', B: 'IMG-11-hospital-corridor' },
  { at: 547.45, img: 'title-CH8', A: 'F10', B: 'BR-23-silhouette-red-blinds' },
];
const SPLIT_ID = 'glass-blocks-2-horizontal';
const CUBE_F = 18; // 0.6 s (plan rmn:cube 0.60 s)
const CARD_WIN = (() => {
  const row = getTransition(SPLIT_ID);
  if (!row) throw new Error('missing split row');
  return framesForRow(row, FPS);
})();
CARDS.forEach((c) => {
  const P0 = FS(c.at);
  const P1 = F(c.at);
  const readable = (P1 - (P0 - Math.round(CARD_WIN / 2) + CARD_WIN)) / FPS;
  if (readable < 1.0) throw new Error(`title card ${c.img} readable only ${readable.toFixed(2)} s (< 1.0 s, comp-build section 6)`);
});
const CubeOut: React.FC<{ img: string; B: string }> = ({ img, B }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, CUBE_F - 1], [0, 1], { ...cl, easing: Easing.inOut(Easing.cubic) });
  const face: React.CSSProperties = { position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transformOrigin: '50% 50% -960px' };
  return (
    <AbsoluteFill style={{ background: 'black', perspective: 2400, overflow: 'hidden' }}>
      <div style={{ ...face, transform: `rotateY(${90 * (1 - p)}deg)` }}><Node k={B} /></div>
      <div style={{ ...face, transform: `rotateY(${-90 * p}deg)` }}><Img src={staticFile(`title-slides/${img}.png`)} style={fill} /></div>
    </AbsoluteFill>
  );
};
const CardLayer: React.FC = () => (
  <>
    {CARDS.map((c) => {
      const P0 = FS(c.at);
      const P1 = F(c.at);
      const half = Math.round(CARD_WIN / 2);
      const holdFrom = P0 - half + CARD_WIN;
      return (
        <React.Fragment key={c.img}>
          <Sequence from={P0 - half} durationInFrames={CARD_WIN} name={`card ${c.img} split-in`}>
            {/* plan lib:glass-blocks-2-horizontal: the chapter SPLIT into the card */}
            <TransitionClip id={SPLIT_ID} cutFrame={half} sfx={false} outgoing={nodeFn(c.A)} incoming={() => <Img src={staticFile(`title-slides/${c.img}.png`)} style={fill} />} />
          </Sequence>
          <Sequence from={holdFrom} durationInFrames={P1 - holdFrom} name={`card ${c.img} hold`}>
            <Img src={staticFile(`title-slides/${c.img}.png`)} style={fill} />
          </Sequence>
          <Sequence from={P1} durationInFrames={CUBE_F} name={`card ${c.img} hand:cube-3d out`}>
            <CubeOut img={c.img} B={c.B} />
          </Sequence>
        </React.Fragment>
      );
    })}
  </>
);

// ---------------------------------------------------------------------------------------------------------------------
// 7. CLIP INSERTS (section 3d): over each insert's paused window the clip plays FULL-FRAME and MUTED (its voice is in
// the VO). insert-in / insert-out = hand:fade 0.5 s (TRANSITIONS.md bucket insert): the clip fades up over its own first
// frame (the lead-in still) and its last frame (the lead-out still) fades up over its tail.
const InsertLayer: React.FC = () => {
  const abs = React.useContext(AbsF);
  return (
    <>
      {PAUSES.filter((p) => p.kind === 'insert').map((p) => {
        const P0 = FS(p.at);
        const n = Math.round(pLen(p) * FPS);
        const rel = abs - P0;
        const id = p.label;
        const fin = interpolate(rel, [0, 15], [0, 1], cl);
        const fout = interpolate(rel, [n - 15, n], [0, 1], cl);
        return (
          <Sequence key={id} from={P0} durationInFrames={n} name={`insert ${id}`}>
            <AbsoluteFill style={{ background: 'black' }}>
              <Img src={staticFile(`clip-inserts/stills/${id}-first.png`)} style={fill} />
              <AbsoluteFill style={{ opacity: fin }}>
                <Freeze frame={Math.max(0, Math.min(CLIP_FRAMES[id] - 1, rel))}>
                  <OffthreadVideo src={staticFile(`clip-inserts/${CLIP_FILE[id]}.mp4`)} muted style={fill} />
                </Freeze>
              </AbsoluteFill>
              <Img src={staticFile(`clip-inserts/stills/${id}-last.png`)} style={{ ...fill, opacity: fout }} />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// 8. THE CLOSE: PUMPKIN 3 of 3 (plan lib:scary-pumpkin-fire, AlphaPlate, 10.17 s) fades in 1 s before the end card and
// burns on under it to the last frame (its A->B swap point lies past the video's end, so the scene under the plate is
// BR-31 running out and held); the transparent end-card overlay: the CryptoRich bug fades in at 604.25, the GET INVOLVED
// band lands ON 'click that link' 606.45. hw-subscribe-like-bell ON 'subscribe' 603.23 rides above both.
const PUMPKIN_ID = 'scary-pumpkin-fire';
const EndLayer: React.FC = () => {
  const abs = React.useContext(AbsF);
  const row = getTransition(PUMPKIN_ID);
  if (!row) throw new Error('missing pumpkin row');
  const win = framesForRow(row, FPS);
  const from = F(604.25) - 30;
  const bug = interpolate(abs, [F(604.25), F(604.25) + 12], [0, 1], cl);
  const band = interpolate(abs, [F(606.45), F(606.45) + 12], [0, 1], { ...cl, easing: easeOut });
  return (
    <>
      <Sequence from={from} durationInFrames={Math.min(win, DUR - from)} name="pumpkin fire plate">
        <TransitionClip id={PUMPKIN_ID} cutFrame={Math.round(win / 2)} sfx={false} outgoing={nodeFn('BR-31-red-smoke-black')} incoming={nodeFn('BR-31-red-smoke-black')} />
      </Sequence>
      <Sequence from={F(604.25)} name="end-card overlay">
        <Img src={staticFile('card-slides/end-card.png')} style={{ ...fill, opacity: bug, clipPath: 'inset(0 0 55% 0)' }} />
        <Img src={staticFile('card-slides/end-card.png')} style={{ ...fill, opacity: band, clipPath: 'inset(65% 0 0 0)', transform: `translateX(${-120 * (1 - band)}px)` }} />
      </Sequence>
    </>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// 9. KINETIC TEXT: hw-word-pop (silent device; Showcard Gothic #27FF14, low in frame) above the covers + faces, below the
// captions, captions OFF under every pop. Sizes keep each phrase inside the frame (the device's 212 px for short words).
const POPS = [
  { t: 38.88, t1: 40.1, text: '18 MONTHS', size: 212 },
  { t: 169.84, t1: 171.4, text: 'A FIFTH OF THE TIME', size: 150 },
  { t: 290.01, t1: 292.41, text: '2. THE JOBS', size: 212 },
  { t: 418.63, t1: 419.8, text: 'PAPERWORK', size: 212 },
  { t: 555.83, t1: 557.35, text: 'PRODUCTIVE ASSETS', size: 170 },
  { t: 557.51, t1: 560.21, text: 'CRYPTO: NO GATEKEEPER', size: 140 },
];
const PopLayer: React.FC = () => (
  <>
    {POPS.map((p) => (
      <HwWordPop key={p.text} t1={p.t1} words={[{ t: p.t, t1: p.t1, text: p.text }]} fontSize={p.size} />
    ))}
  </>
);

// 10. CAPTIONS (section 8): ZCAPTIONS from build_captions.py, only inside CAPTION_WINDOWS, Montserrat 900 house style
const Captions: React.FC = () => {
  const abs = React.useContext(AbsF);
  const t = srcT(abs);
  if (!CAPTION_WINDOWS.some(([a, b]) => t >= a && t < b)) return null;
  if (POPS.some((p) => t >= p.t && t < p.t1)) return null;
  let cur: { t: number; h: string } | null = null;
  for (const c of ZCAPTIONS) {
    if (c.t <= t) cur = c;
    else break;
  }
  if (!cur) return null;
  const c0 = cur;
  const next = ZCAPTIONS.find((c) => c.t > c0.t);
  if (t >= Math.min(next ? next.t : Infinity, c0.t + 1.3)) return null;
  const k = (t - c0.t) * FPS;
  const s = interpolate(k, [0, 3, 6], [0.7, 1.12, 1], cl);
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 120 }}>
      <div
        style={{
          fontFamily: "Montserrat,'Arial Black','Segoe UI',sans-serif", fontWeight: 900, fontSize: 84, color: '#ffffff',
          textTransform: 'lowercase', WebkitTextStroke: '12px #000', paintOrder: 'stroke fill', transform: `scale(${s})`,
          textAlign: 'center', maxWidth: 1600, lineHeight: 1.1,
        }}
      >
        {c0.h}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
export const Only18MonthsLeft: React.FC = () => {
  const abs = useCurrentFrame();
  return (
    <AbsF.Provider value={abs}>
      <KtClock.Provider value={{ t: srcT(abs) }}>
        <AbsoluteFill style={{ background: 'black' }}>
          {/* the spine (section 3 + 3a): VO audio + the measured reframe; every visible face is its swap clip on top */}
          <OffthreadVideo
            src={staticFile('spine.mp4')}
            style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0',
              transform: `translate(${FACE_REFRAME.x}px, ${FACE_REFRAME.y}px) scale(${FACE_REFRAME.scale})` }}
          />
          {ROWS.map((c, i) => (
            <Sequence key={i} from={c.seq} durationInFrames={c.e + c.post - c.seq} name={`${c.kind} ${c.ref}`}>
              <TrackRow c={c} />
            </Sequence>
          ))}
          <InsertLayer />
          {FACES.map((fc, i) => (
            <Sequence key={fc.n} from={F(fc.a)} durationInFrames={F(fc.b) - F(fc.a)} name={`FACE F${fc.n}`}>
              <AbsoluteFill><FaceBody fi={i} abs={abs} /></AbsoluteFill>
            </Sequence>
          ))}
          <TxLayer />
          <CardLayer />
          <EndLayer />
          <PopLayer />
          <HwSubscribeLikeBell t0={603.23} fillSrc={staticFile(`${HW}graphics/subscribe-like-bell-fill.mp4`)} keySrc={staticFile(`${HW}graphics/subscribe-like-bell-key.mp4`)} />
          <Captions />
        </AbsoluteFill>
      </KtClock.Provider>
    </AbsF.Provider>
  );
};

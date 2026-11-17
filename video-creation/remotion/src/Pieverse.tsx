// pieverse (longform-edited, 2026-11-14): "What Is Pieverse?", the 16:9 draft build (comp-builder), built TO the approved
// blueprint: media/pieverse/EDIT-PLAN.md (event log) + CUE-SHEET.md + TRANSITIONS.md / TRANSITION-PLAN.json + COVER-PLAN.json
// + AS-RECORDED.md + PROJECT-LOG.md (Open flags, all RULED 2026-11-14: "leave the recording as is", the cards print the sourced
// figures). Skeletons: video-creation/longform-edited/skills/comp-build/comp-build.md (sections 2, 3a, 4, 4c, 4c-mixed, 5, 6, 7, 8).
// Mike's per-video rulings (PROJECT-LOG "Hard constraints", 2026-11-11): NO music, NO sound effects, NO captions, NO receipts,
// NO clip inserts, NO whiteboard, NO Envato / ChatGPT b-roll. Visual budget: C1 (the one system-design chart, 13 state PNGs),
// C2 + C3 (the two ANIMATED charts, live components in PieverseCharts.tsx), 21 deck cards + END (state PNGs), 4 title slides.
// FACE MODE = MIXED (house rule #1c): F1 / F4 / F7 / F8 are gated faces (the MEASURED reframe), F2 / F3 / F5 / F6 are Mike's OBS
// screen share played VERBATIM (identity transform), the deck area x 0-1464 painted with the screen-share body rows.
// No punch-ins and no light leaks anywhere (spine/jumpcuts-final.json punch_points_total 0). The comp outputs VIDEO + the spine's
// own VO only: no music, no SFX, no watermark (comp-build section 9; the post-mix owns audio and has nothing to lay here).
// Every cue below is a SOURCE-spine second (spine/ALL.d.enhanced.mp4) routed through sh() / F(); nothing is hand-shifted.
import React, { createContext, useContext } from 'react';
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { flip } from '@remotion/transitions/flip';
import { ZCAPTIONS, CAPTION_WINDOWS } from './PieverseCaptions';
import { C2Chart, C3Chart } from './PieverseCharts';

// ---------------------------------------------------------------------------------------------------------------------
// 1. Timing (comp-build section 2 + 3d): the paused-spine sidecar spine/ALL.e.paused.json is the time map.
// ---------------------------------------------------------------------------------------------------------------------
export const FPS = 30;
export const SPINE_SECS = 373.235;   // the SOURCE spine, spine/ALL.d.enhanced.mp4 (ffprobe 373.235351 s)
export const PAUSE = 1.5;            // sidecar pause_s: each title card is a 1.5 s freeze + silence, snapped into its word-gap trough
export const CARD_T = [34.795, 115.525, 151.38, 319.825];   // sidecar pauses[].at (planned 35.20 / 115.56 / 151.56 / 319.98)
export const INSERTS: { at: number; dur: number }[] = [     // EVERY sidecar pause row {at, dur} (cards only: no clip inserts)
  { at: 34.795, dur: 1.5 },
  { at: 115.525, dur: 1.5 },
  { at: 151.38, dur: 1.5 },
  { at: 319.825, dur: 1.5 },
];
const PAUSE_TOTAL = INSERTS.reduce((a, p) => a + p.dur, 0);
export const sh = (t: number) => t + INSERTS.filter((p) => p.at <= t).reduce((a, p) => a + p.dur, 0);   // source -> paused secs
export const F = (t: number) => Math.round(sh(t) * FPS);                                                  // source secs -> frame
// paused secs -> source secs (frozen at the pause point while a pause runs): the animated charts read the SOURCE clock
const unsh = (T: number) => {
  let off = 0;
  for (const p of INSERTS) {
    const start = p.at + off;
    if (T < start) break;
    if (T < start + p.dur) return p.at;
    off += p.dur;
  }
  return T - off;
};
const SPINE_FRAMES = 11378;   // assets/spine.mp4 (= spine/ALL.e.paused.mp4) nb_frames, 379.267 s; the formula below gives 11377
export const DUR = Math.max(Math.round((SPINE_SECS + PAUSE_TOTAL) * FPS), SPINE_FRAMES);

// ---------------------------------------------------------------------------------------------------------------------
// 2. The spine (section 3 + 3a + 4c-mixed): the MEASURED reframe outside the screen shares, the identity inside them.
// ---------------------------------------------------------------------------------------------------------------------
export const FACE_REFRAME = { scale: 1.535, x: -903, y: -391 };   // assets/face-reframe.json, never hand-tuned
const FACE_POINT = { x: 960, y: 432 };                            // json face_point_out: where his face sits after the reframe
export const SCREENSHARE_WINDOWS: [number, number][] = [[19.189, 28.555], [104.522, 108.722], [171.022, 177.755], [241.669, 248.669]];
const inShare = (T: number) => SCREENSHARE_WINDOWS.some(([a, b]) => T >= sh(a) && T < sh(b));   // T = the paused-spine second
const spineTransform = (T: number) =>
  inShare(T) ? 'none' : `translate(${FACE_REFRAME.x}px, ${FACE_REFRAME.y}px) scale(${FACE_REFRAME.scale})`;
// punch-ins: NONE planned (EDIT-PLAN PUNCH-IN 0 / LIGHTLEAK 0: every face-window join sits inside the 0.5 s edge margin)
export const PUNCHES: { at: number; scale: number }[] = [];
const punchAt = (T: number) => {
  let s = 1;
  for (const p of PUNCHES) if (T >= sh(p.at)) s = p.scale;
  return s;
};

// the 8 visible windows (COVER-PLAN visible_windows, kinds stamped by scripts/window_kinds.py)
export const VISIBLE_WINDOWS: { n: number; a: number; b: number; kind: 'face' | 'screenshare' }[] = [
  { n: 1, a: 0.0, b: 9.689, kind: 'face' },
  { n: 2, a: 19.189, b: 28.555, kind: 'screenshare' },
  { n: 3, a: 104.522, b: 108.722, kind: 'screenshare' },
  { n: 4, a: 139.222, b: 145.155, kind: 'face' },
  { n: 5, a: 171.022, b: 177.755, kind: 'screenshare' },
  { n: 6, a: 241.669, b: 248.669, kind: 'screenshare' },
  { n: 7, a: 334.902, b: 339.335, kind: 'face' },
  { n: 8, a: 352.669, b: 360.335, kind: 'face' },
];

// captions: OFF for this video (Mike's caption scope `none`; CUE-SHEET "CAPTIONS: OFF (Mike, 2026-11-04)"): no caption layer.
if (ZCAPTIONS.length || CAPTION_WINDOWS.length) {
  throw new Error('pieverse captions are OFF by Mike\'s ruling, but PieverseCaptions.ts is not empty: regenerate it with scope none');
}

// ---------------------------------------------------------------------------------------------------------------------
// 3. The transition plan, row for row (TRANSITIONS.md section 5, 35 scene changes). Every row is consumed below; a row that
//    no cut consumes throws at build time (a planned transition is never silently missing).
// ---------------------------------------------------------------------------------------------------------------------
type TransId = 'hand:film-burn' | 'rmn:flip' | 'hand:xfade-scale';
export const TRANSITION_ROWS: { tc: string; at: number; bucket: 'face' | 'card' | 'container'; id: TransId; dur: number; change: string }[] = [
  { tc: '0:09.7', at: 9.689, bucket: 'face', id: 'hand:film-burn', dur: 0.76, change: 'F1 gated face out to D1' },
  { tc: '0:19.2', at: 19.189, bucket: 'face', id: 'hand:film-burn', dur: 0.76, change: 'D1 to F2 SCREEN SHARE in (deck area D9)' },
  { tc: '0:28.6', at: 28.555, bucket: 'face', id: 'hand:film-burn', dur: 0.76, change: 'F2 out, D9 grows from the deck area to full frame' },
  { tc: '0:35.2', at: 34.795, bucket: 'card', id: 'rmn:flip', dur: 0.4, change: 'CH2 title card WHAT IT IS' },
  { tc: '0:59.6', at: 59.64, bucket: 'container', id: 'hand:xfade-scale', dur: 0.35, change: 'D2-s6 to C1-overview' },
  { tc: '1:17.7', at: 77.7, bucket: 'container', id: 'hand:xfade-scale', dur: 0.35, change: 'C1-wallet-tee to D17' },
  { tc: '1:23.2', at: 83.22, bucket: 'container', id: 'hand:xfade-scale', dur: 0.35, change: 'D17-s2 to C1 RETURN on C1-chat' },
  { tc: '1:39.0', at: 98.98, bucket: 'container', id: 'hand:xfade-scale', dur: 0.35, change: 'C1-a2a to D4' },
  { tc: '1:44.5', at: 104.522, bucket: 'face', id: 'hand:film-burn', dur: 0.76, change: 'D4-s1 to F3 SCREEN SHARE in (deck area C1-token)' },
  { tc: '1:48.7', at: 108.722, bucket: 'face', id: 'hand:film-burn', dur: 0.76, change: 'F3 out to D18' },
  { tc: '1:55.6', at: 115.525, bucket: 'card', id: 'rmn:flip', dur: 0.4, change: "CH3 title card WHAT'S REAL" },
  { tc: '2:05.7', at: 125.74, bucket: 'container', id: 'hand:xfade-scale', dur: 0.35, change: 'D5-s3 to D6' },
  { tc: '2:19.2', at: 139.222, bucket: 'face', id: 'hand:film-burn', dur: 0.76, change: 'D6-s4 to F4 gated face in' },
  { tc: '2:25.2', at: 145.155, bucket: 'face', id: 'hand:film-burn', dur: 0.76, change: 'F4 out to D5 RETURN (D5-s4)' },
  { tc: '2:31.6', at: 151.38, bucket: 'card', id: 'rmn:flip', dur: 0.4, change: 'CH4 title card THE TOKEN' },
  { tc: '2:51.0', at: 171.022, bucket: 'face', id: 'hand:film-burn', dur: 0.76, change: 'C2 full frame to F5 SCREEN SHARE in (C2 continues in the deck area)' },
  { tc: '2:57.8', at: 177.755, bucket: 'face', id: 'hand:film-burn', dur: 0.76, change: 'F5 out to D21' },
  { tc: '3:10.8', at: 190.8, bucket: 'container', id: 'hand:xfade-scale', dur: 0.35, change: 'D21-s3 to D24' },
  { tc: '3:32.6', at: 212.58, bucket: 'container', id: 'hand:xfade-scale', dur: 0.35, change: 'D24-s5 to D25' },
  { tc: '3:45.2', at: 225.22, bucket: 'container', id: 'hand:xfade-scale', dur: 0.35, change: 'D25-s2 to D19' },
  { tc: '3:54.8', at: 234.78, bucket: 'container', id: 'hand:xfade-scale', dur: 0.35, change: 'D19-s2 to D8' },
  { tc: '4:01.7', at: 241.669, bucket: 'face', id: 'hand:film-burn', dur: 0.76, change: 'D8-s4 to F6 SCREEN SHARE in (deck area C3)' },
  { tc: '4:08.7', at: 248.669, bucket: 'face', id: 'hand:film-burn', dur: 0.76, change: 'F6 out to D10' },
  { tc: '4:16.7', at: 256.68, bucket: 'container', id: 'hand:xfade-scale', dur: 0.35, change: 'D10-s3 to C3 RETURN full frame' },
  { tc: '4:22.4', at: 262.44, bucket: 'container', id: 'hand:xfade-scale', dur: 0.35, change: 'C3 payoff to D11' },
  { tc: '4:35.1', at: 275.1, bucket: 'container', id: 'hand:xfade-scale', dur: 0.35, change: 'D11-s3 to D14' },
  { tc: '4:41.2', at: 281.18, bucket: 'container', id: 'hand:xfade-scale', dur: 0.35, change: 'D14-s3 to D22' },
  { tc: '5:03.4', at: 303.42, bucket: 'container', id: 'hand:xfade-scale', dur: 0.35, change: 'D22-s8 to D23' },
  { tc: '5:20.0', at: 319.825, bucket: 'card', id: 'rmn:flip', dur: 0.4, change: "CH5 title card WHO'S BEHIND IT" },
  { tc: '5:27.5', at: 327.54, bucket: 'container', id: 'hand:xfade-scale', dur: 0.35, change: 'D20-s2 to D13' },
  { tc: '5:34.9', at: 334.902, bucket: 'face', id: 'hand:film-burn', dur: 0.76, change: 'D13-s3 to F7 gated face in' },
  { tc: '5:39.3', at: 339.335, bucket: 'face', id: 'hand:film-burn', dur: 0.76, change: 'F7 out to D15' },
  { tc: '5:52.7', at: 352.669, bucket: 'face', id: 'hand:film-burn', dur: 0.76, change: 'D15-s3 to F8 gated face in' },
  { tc: '6:00.3', at: 360.335, bucket: 'face', id: 'hand:film-burn', dur: 0.76, change: 'F8 out to the D15 CALLBACK (D15-s4)' },
  { tc: '6:04.6', at: 364.56, bucket: 'container', id: 'hand:xfade-scale', dur: 0.35, change: 'D15-s4 to the END card' },
];
const XF_F = Math.round(0.35 * FPS);       // hand:xfade-scale: cross-fade + 0.93 -> 1 scale-in, 0.35 s (11 f)
const BURN_HALF = 11;                       // hand:film-burn: 0.76 s centred on the cut (warm flash 0.38 s each side), 23 f
const BURN_PEAK = 0.45;                     // intensity kept LOW (TRANSITIONS.md section 3: 15 flashes, no music under them)
const TURN_F = Math.round(0.4 * FPS);       // rmn:flip: 0.40 s card turn (12 f)
const CARD_LEAD_F = 9;                      // the flip starts 0.3 s BEFORE the pause, over the outgoing cover (section 6)
const C1_XS_F = 9;                          // C1 intra-diagram state swaps: 0.3 s cross-fade, shared pixels hold (diagrams/_state-cues.md)
const ENTER_F = 11;                         // the container entrance in the deck area: 0.35 s fade + 0.97 -> 1 (section 4c)
const GROW_F = 9;                           // D9 grows from the deck area to the full stage across the F2 edge (house rule #1b)

// the 4 chapter title cards (rmn:flip, ONE pick for every card; silent, no impact: Mike's no-SFX ruling)
export const CARDS: { at: number; png: string; label: string; next: number }[] = [
  { at: 34.795, png: 'title-CH2', label: 'WHAT IT IS', next: 35.2 },          // next = the chapter's first cover tIn
  { at: 115.525, png: 'title-CH3', label: "WHAT'S REAL", next: 115.56 },
  { at: 151.38, png: 'title-CH4', label: 'THE TOKEN', next: 151.56 },
  { at: 319.825, png: 'title-CH5', label: "WHO'S BEHIND IT", next: 319.98 },
];
const PAUSE_F = Math.round(PAUSE * FPS);
const CARD_READABLE_S = (CARD_LEAD_F + PAUSE_F - TURN_F) / FPS;   // readable = lead + PAUSE - turn
if (CARD_READABLE_S < 1.0) throw new Error(`title card readable ${CARD_READABLE_S.toFixed(2)} s < 1.0 s (comp-build section 6)`);

// ---------------------------------------------------------------------------------------------------------------------
// 4. The cover track, one row per state (EDIT-PLAN CONTAINER / DIAGRAM / CHART rows; slide-sources + diagrams _state-cues.md).
//    kind 'container' = a deck card or a C1 state (spotlit one sub-point at a time); kind 'deck' = the C1 overview, the ONE
//    full-diagram view (shown once, THE BALANCE); kind 'chart' = a live animated chart. state = the PNG stem / chart look.
//    Consecutive same-ref rows are STATE SWAPS: the ingress transition fires on ENTRY only.
// ---------------------------------------------------------------------------------------------------------------------
type Kind = 'deck' | 'container' | 'chart';
type Cover = { tIn: number; tOut: number; kind: Kind; ref: string; state: string; cues?: [number, string][]; fb?: string };
// DIAGRAM_REFS: C1
// (end declared refs)
export const COVERS: Cover[] = [
  // CH1 THE OPEN (no card): F1 face 0.000-9.689
  { tIn: 9.689, tOut: 12.36, kind: 'container', ref: 'D1', state: 'D1' },
  { tIn: 12.36, tOut: 13.8, kind: 'container', ref: 'D1', state: 'D1-s1' },
  { tIn: 13.8, tOut: 16.48, kind: 'container', ref: 'D1', state: 'D1-s2' },
  { tIn: 16.48, tOut: 19.189, kind: 'container', ref: 'D1', state: 'D1-s3' },
  // F2 screen share 19.189-28.555 (deck area FB1 + FB2 = D9), then D9 continues FULL FRAME
  { tIn: 28.555, tOut: 32.62, kind: 'container', ref: 'D9', state: 'D9-s3' },
  { tIn: 32.62, tOut: 35.2, kind: 'container', ref: 'D9', state: 'D9-s4' },
  // CH2 WHAT IT IS (card pause 34.795)
  { tIn: 35.2, tOut: 38.46, kind: 'container', ref: 'D2', state: 'D2' },
  { tIn: 38.46, tOut: 44.64, kind: 'container', ref: 'D2', state: 'D2-s1' },
  { tIn: 44.64, tOut: 46.28, kind: 'container', ref: 'D2', state: 'D2-s2' },
  { tIn: 46.28, tOut: 51.96, kind: 'container', ref: 'D2', state: 'D2-s3' },
  { tIn: 51.96, tOut: 56.04, kind: 'container', ref: 'D2', state: 'D2-s4' },
  { tIn: 56.04, tOut: 56.96, kind: 'container', ref: 'D2', state: 'D2-s5' },
  { tIn: 56.96, tOut: 59.64, kind: 'container', ref: 'D2', state: 'D2-s6' },
  { tIn: 59.64, tOut: 61.22, kind: 'deck', ref: 'C1', state: 'C1-overview' },
  { tIn: 61.22, tOut: 67.06, kind: 'container', ref: 'C1', state: 'C1-agent' },
  { tIn: 67.06, tOut: 70.34, kind: 'container', ref: 'C1', state: 'C1-agent-price' },
  { tIn: 70.34, tOut: 72.88, kind: 'container', ref: 'C1', state: 'C1-agent-price' },
  { tIn: 72.88, tOut: 76.68, kind: 'container', ref: 'C1', state: 'C1-wallet' },
  { tIn: 76.68, tOut: 77.7, kind: 'container', ref: 'C1', state: 'C1-wallet-tee' },
  { tIn: 77.7, tOut: 79.56, kind: 'container', ref: 'D17', state: 'D17' },
  { tIn: 79.56, tOut: 82.36, kind: 'container', ref: 'D17', state: 'D17-s1' },
  { tIn: 82.36, tOut: 83.22, kind: 'container', ref: 'D17', state: 'D17-s2' },
  { tIn: 83.22, tOut: 87.44, kind: 'container', ref: 'C1', state: 'C1-chat' },
  { tIn: 87.44, tOut: 88.5, kind: 'container', ref: 'C1', state: 'C1-chat-swap' },
  { tIn: 88.5, tOut: 90.2, kind: 'container', ref: 'C1', state: 'C1-path' },
  { tIn: 90.2, tOut: 91.88, kind: 'container', ref: 'C1', state: 'C1-path' },
  { tIn: 91.88, tOut: 93.46, kind: 'container', ref: 'C1', state: 'C1-skills' },
  { tIn: 93.46, tOut: 95.14, kind: 'container', ref: 'C1', state: 'C1-skills-feed' },
  { tIn: 95.14, tOut: 96.32, kind: 'container', ref: 'C1', state: 'C1-skills-feed' },
  { tIn: 96.32, tOut: 98.98, kind: 'container', ref: 'C1', state: 'C1-a2a' },
  { tIn: 98.98, tOut: 103.78, kind: 'container', ref: 'D4', state: 'D4' },
  { tIn: 103.78, tOut: 104.522, kind: 'container', ref: 'D4', state: 'D4-s1' },
  // F3 screen share 104.522-108.722 (deck area FB3 = C1-token, C1-token-tag)
  { tIn: 108.722, tOut: 110.8, kind: 'container', ref: 'D18', state: 'D18' },
  { tIn: 110.8, tOut: 111.64, kind: 'container', ref: 'D18', state: 'D18-s1' },
  { tIn: 111.64, tOut: 112.08, kind: 'container', ref: 'D18', state: 'D18-s2' },
  { tIn: 112.08, tOut: 113.24, kind: 'container', ref: 'D18', state: 'D18-s3' },
  { tIn: 113.24, tOut: 115.56, kind: 'container', ref: 'D18', state: 'D18-s4' },
  // CH3 WHAT'S REAL (card pause 115.525)
  { tIn: 115.56, tOut: 119.42, kind: 'container', ref: 'D5', state: 'D5' },
  { tIn: 119.42, tOut: 121.98, kind: 'container', ref: 'D5', state: 'D5-s1' },
  { tIn: 121.98, tOut: 123.9, kind: 'container', ref: 'D5', state: 'D5-s2' },
  { tIn: 123.9, tOut: 125.74, kind: 'container', ref: 'D5', state: 'D5-s3' },
  { tIn: 125.74, tOut: 127.32, kind: 'container', ref: 'D6', state: 'D6' },
  { tIn: 127.32, tOut: 131.0, kind: 'container', ref: 'D6', state: 'D6-s1' },
  { tIn: 131.0, tOut: 133.68, kind: 'container', ref: 'D6', state: 'D6-s2' },
  { tIn: 133.68, tOut: 134.38, kind: 'container', ref: 'D6', state: 'D6-s2' },
  { tIn: 134.38, tOut: 137.26, kind: 'container', ref: 'D6', state: 'D6-s3' },
  { tIn: 137.26, tOut: 139.222, kind: 'container', ref: 'D6', state: 'D6-s4' },
  // F4 gated face 139.222-145.155; D5 RETURNS in its NOT PUBLISHED state (a new state of the same card, not a repeat)
  { tIn: 145.155, tOut: 146.74, kind: 'container', ref: 'D5', state: 'D5-s4' },
  { tIn: 146.74, tOut: 147.62, kind: 'container', ref: 'D5', state: 'D5-s5' },
  { tIn: 147.62, tOut: 148.7, kind: 'container', ref: 'D5', state: 'D5-s6' },
  { tIn: 148.7, tOut: 149.82, kind: 'container', ref: 'D5', state: 'D5-s7' },
  { tIn: 149.82, tOut: 151.56, kind: 'container', ref: 'D5', state: 'D5-s8' },
  // CH4 THE TOKEN (card pause 151.38); C2 = ANIMATED chart 1 (axes -> marker 1 -> marker 2), continues in F5 (FB4)
  { tIn: 151.56, tOut: 159.84, kind: 'chart', ref: 'C2', state: 'start' },
  { tIn: 159.84, tOut: 171.022, kind: 'chart', ref: 'C2', state: 'mid' },
  // F5 screen share 171.022-177.755 (deck area FB4 = C2 to marker 3 and the read price)
  { tIn: 177.755, tOut: 181.96, kind: 'container', ref: 'D21', state: 'D21' },
  { tIn: 181.96, tOut: 185.18, kind: 'container', ref: 'D21', state: 'D21-s1' },
  { tIn: 185.18, tOut: 188.64, kind: 'container', ref: 'D21', state: 'D21-s2' },
  { tIn: 188.64, tOut: 190.8, kind: 'container', ref: 'D21', state: 'D21-s3' },
  { tIn: 190.8, tOut: 196.5, kind: 'container', ref: 'D24', state: 'D24' },
  { tIn: 196.5, tOut: 200.12, kind: 'container', ref: 'D24', state: 'D24-s1' },
  { tIn: 200.12, tOut: 201.48, kind: 'container', ref: 'D24', state: 'D24-s2' },
  { tIn: 201.48, tOut: 203.3, kind: 'container', ref: 'D24', state: 'D24-s2' },
  { tIn: 203.3, tOut: 208.52, kind: 'container', ref: 'D24', state: 'D24-s3' },
  { tIn: 208.52, tOut: 210.32, kind: 'container', ref: 'D24', state: 'D24-s4' },
  { tIn: 210.32, tOut: 212.58, kind: 'container', ref: 'D24', state: 'D24-s5' },
  { tIn: 212.58, tOut: 221.08, kind: 'container', ref: 'D25', state: 'D25' },
  { tIn: 221.08, tOut: 223.74, kind: 'container', ref: 'D25', state: 'D25-s1' },
  { tIn: 223.74, tOut: 225.22, kind: 'container', ref: 'D25', state: 'D25-s2' },
  { tIn: 225.22, tOut: 229.86, kind: 'container', ref: 'D19', state: 'D19' },
  { tIn: 229.86, tOut: 233.28, kind: 'container', ref: 'D19', state: 'D19-s1' },
  { tIn: 233.28, tOut: 234.78, kind: 'container', ref: 'D19', state: 'D19-s2' },
  { tIn: 234.78, tOut: 238.18, kind: 'container', ref: 'D8', state: 'D8' },
  { tIn: 238.18, tOut: 238.72, kind: 'container', ref: 'D8', state: 'D8-s1' },
  { tIn: 238.72, tOut: 239.46, kind: 'container', ref: 'D8', state: 'D8-s2' },
  { tIn: 239.46, tOut: 240.7, kind: 'container', ref: 'D8', state: 'D8-s3' },
  { tIn: 240.7, tOut: 241.669, kind: 'container', ref: 'D8', state: 'D8-s4' },
  // F6 screen share 241.669-248.669 (deck area FB5 = C3 launch -> marker -> switch)
  { tIn: 248.669, tOut: 252.28, kind: 'container', ref: 'D10', state: 'D10' },
  { tIn: 252.28, tOut: 253.76, kind: 'container', ref: 'D10', state: 'D10-s1' },
  { tIn: 253.76, tOut: 255.14, kind: 'container', ref: 'D10', state: 'D10-s2' },
  { tIn: 255.14, tOut: 256.68, kind: 'container', ref: 'D10', state: 'D10-s3' },
  { tIn: 256.68, tOut: 262.44, kind: 'chart', ref: 'C3', state: 'payoff' },
  { tIn: 262.44, tOut: 263.44, kind: 'container', ref: 'D11', state: 'D11' },
  { tIn: 263.44, tOut: 266.84, kind: 'container', ref: 'D11', state: 'D11-s1' },
  { tIn: 266.84, tOut: 272.34, kind: 'container', ref: 'D11', state: 'D11-s2' },
  { tIn: 272.34, tOut: 275.1, kind: 'container', ref: 'D11', state: 'D11-s3' },
  { tIn: 275.1, tOut: 275.44, kind: 'container', ref: 'D14', state: 'D14' },
  { tIn: 275.44, tOut: 277.22, kind: 'container', ref: 'D14', state: 'D14-s1' },
  { tIn: 277.22, tOut: 280.42, kind: 'container', ref: 'D14', state: 'D14-s2' },
  { tIn: 280.42, tOut: 281.18, kind: 'container', ref: 'D14', state: 'D14-s3' },
  { tIn: 281.18, tOut: 285.28, kind: 'container', ref: 'D22', state: 'D22' },
  { tIn: 285.28, tOut: 287.48, kind: 'container', ref: 'D22', state: 'D22-s1' },
  { tIn: 287.48, tOut: 288.6, kind: 'container', ref: 'D22', state: 'D22-s2' },
  { tIn: 288.6, tOut: 289.38, kind: 'container', ref: 'D22', state: 'D22-s3' },
  { tIn: 289.38, tOut: 291.96, kind: 'container', ref: 'D22', state: 'D22-s4' },
  { tIn: 291.96, tOut: 293.94, kind: 'container', ref: 'D22', state: 'D22-s5' },
  { tIn: 293.94, tOut: 295.22, kind: 'container', ref: 'D22', state: 'D22-s6' },
  { tIn: 295.22, tOut: 295.46, kind: 'container', ref: 'D22', state: 'D22-s6' },
  { tIn: 295.46, tOut: 299.8, kind: 'container', ref: 'D22', state: 'D22-s7' },
  { tIn: 299.8, tOut: 303.42, kind: 'container', ref: 'D22', state: 'D22-s8' },
  { tIn: 303.42, tOut: 307.38, kind: 'container', ref: 'D23', state: 'D23' },
  { tIn: 307.38, tOut: 309.42, kind: 'container', ref: 'D23', state: 'D23-s1' },
  { tIn: 309.42, tOut: 311.98, kind: 'container', ref: 'D23', state: 'D23-s2' },
  { tIn: 311.98, tOut: 312.26, kind: 'container', ref: 'D23', state: 'D23-s2' },
  { tIn: 312.26, tOut: 315.58, kind: 'container', ref: 'D23', state: 'D23-s3' },
  { tIn: 315.58, tOut: 319.98, kind: 'container', ref: 'D23', state: 'D23-s4' },
  // CH5 WHO'S BEHIND IT (card pause 319.825)
  { tIn: 319.98, tOut: 322.12, kind: 'container', ref: 'D20', state: 'D20' },
  { tIn: 322.12, tOut: 324.08, kind: 'container', ref: 'D20', state: 'D20-s1' },
  { tIn: 324.08, tOut: 327.54, kind: 'container', ref: 'D20', state: 'D20-s2' },
  { tIn: 327.54, tOut: 328.14, kind: 'container', ref: 'D13', state: 'D13' },
  { tIn: 328.14, tOut: 332.82, kind: 'container', ref: 'D13', state: 'D13-s1' },
  { tIn: 332.82, tOut: 333.7, kind: 'container', ref: 'D13', state: 'D13-s2' },
  { tIn: 333.7, tOut: 334.902, kind: 'container', ref: 'D13', state: 'D13-s3' },
  // F7 gated face 334.902-339.335
  { tIn: 339.335, tOut: 341.4, kind: 'container', ref: 'D15', state: 'D15' },
  { tIn: 341.4, tOut: 345.12, kind: 'container', ref: 'D15', state: 'D15-s1' },
  { tIn: 345.12, tOut: 349.76, kind: 'container', ref: 'D15', state: 'D15-s2' },
  { tIn: 349.76, tOut: 352.669, kind: 'container', ref: 'D15', state: 'D15-s3' },
  // CH6 THE CLOSE (no card): F8 gated face 352.669-360.335; D15 CALLBACK (the screenplay's ONE deliberate return), END card
  { tIn: 360.335, tOut: 364.56, kind: 'container', ref: 'D15', state: 'D15-s4' },
  { tIn: 364.56, tOut: 366.42, kind: 'container', ref: 'END', state: 'END' },
  { tIn: 366.42, tOut: 367.26, kind: 'container', ref: 'END', state: 'END-s1' },
  { tIn: 367.26, tOut: 369.28, kind: 'container', ref: 'END', state: 'END-s2' },
  { tIn: 369.28, tOut: 370.92, kind: 'container', ref: 'END', state: 'END-s3' },
  { tIn: 370.92, tOut: 373.24, kind: 'container', ref: 'END', state: 'END-s4' },
];

// the screen-share deck-area body (COVER-PLAN face_body FB1-FB5; section 4c / 4c-mixed): SCREENSHARE windows only.
// cues = the sub-states inside one row (the spotlight moves while the row holds).
export const DECK_AREA = { x: 0, y: 0, w: 1464, h: 1080 };   // the binance OBS geometry (house rule #1b)
const DECK_SCALE = DECK_AREA.w / 1920;                        // 0.7625
const PAGE_BG = '#0a0c10';                                    // the dark container stylesheet's page colour (--bg-deep)
export const FACE_BODY: Cover[] = [
  { tIn: 19.189, tOut: 24.96, kind: 'container', ref: 'D9', state: 'D9', fb: 'FB1', cues: [[19.189, 'D9'], [20.66, 'D9-s1'], [22.84, 'D9-s2']] },
  { tIn: 24.96, tOut: 28.555, kind: 'container', ref: 'D9', state: 'D9-s2', fb: 'FB2', cues: [[24.96, 'D9-s2'], [25.48, 'D9-s3']] },
  { tIn: 104.522, tOut: 108.722, kind: 'container', ref: 'C1', state: 'C1-token', fb: 'FB3', cues: [[104.522, 'C1-token'], [107.1, 'C1-token-tag']] },
  { tIn: 171.022, tOut: 177.755, kind: 'chart', ref: 'C2', state: 'payoff', fb: 'FB4' },
  { tIn: 241.669, tOut: 248.669, kind: 'chart', ref: 'C3', state: 'switch', fb: 'FB5' },
];

// ---------------------------------------------------------------------------------------------------------------------
// 5. Runs: consecutive same-ref rows are ONE on-screen appearance (state swaps inside); each run gets its planned ingress.
// ---------------------------------------------------------------------------------------------------------------------
type Ingress = 'xfade' | 'afterCard' | 'cut' | 'grow' | 'entrance' | 'open';
type Run = {
  layer: 'cover' | 'fb'; ref: string; kind: 'img' | 'chart'; tIn: number; tOut: number; fromF: number; toF: number; tailF: number;
  cues: { f: number; png: string }[]; ingress: Ingress; via: string;
};
const near = (a: number, b: number) => Math.abs(a - b) < 0.005;
const buildRuns = (rows: Cover[], layer: 'cover' | 'fb'): Run[] => {
  const runs: Run[] = [];
  for (const r of rows) {
    const cues = r.kind === 'chart' ? [] : (r.cues ?? [[r.tIn, r.state] as [number, string]]).map(([t, png]) => ({ f: F(t), png }));
    const last = runs[runs.length - 1];
    if (last && last.ref === r.ref && near(last.tOut, r.tIn)) {
      last.tOut = r.tOut;
      for (const c of cues) if (last.cues[last.cues.length - 1]?.png !== c.png) last.cues.push(c);
      continue;
    }
    runs.push({ layer, ref: r.ref, kind: r.kind === 'chart' ? 'chart' : 'img', tIn: r.tIn, tOut: r.tOut, fromF: F(r.tIn), toF: 0, tailF: 0,
      cues, ingress: 'open', via: '' });
  }
  for (const run of runs) run.toF = run.tOut >= SPINE_SECS - 0.01 ? DUR : F(run.tOut);
  return runs;
};
const COVER_RUNS = buildRuns(COVERS, 'cover');
const FB_RUNS = buildRuns(FACE_BODY, 'fb');
const usedTrans = new Set<number>();
for (const run of FB_RUNS) {
  const w = VISIBLE_WINDOWS.find((v) => run.tIn >= v.a - 0.01 && run.tOut <= v.b + 0.01);
  if (!w || w.kind !== 'screenshare') throw new Error(`screen-share body ${run.ref}@${run.tIn} is not inside a SCREENSHARE window`);
  const k = TRANSITION_ROWS.findIndex((r) => r.bucket === 'face' && near(r.at, run.tIn));
  if (k < 0) throw new Error(`screen-share body ${run.ref}@${run.tIn}: no planned face cut-in at its window edge`);
  usedTrans.add(k);
  run.ingress = 'entrance';
  run.via = TRANSITION_ROWS[k].id;
}
for (let i = 0; i < COVER_RUNS.length; i++) {
  const run = COVER_RUNS[i];
  const k = TRANSITION_ROWS.findIndex((r) => r.bucket !== 'card' && near(r.at, run.tIn));
  const card = CARDS.find((c) => near(c.next, run.tIn));
  if (k >= 0 && TRANSITION_ROWS[k].bucket === 'container') {
    run.ingress = 'xfade';
    const prev = COVER_RUNS[i - 1];
    if (!prev || !near(prev.tOut, run.tIn)) throw new Error(`xfade into ${run.ref}@${run.tIn} has no contiguous outgoing cover`);
    prev.tailF = XF_F;   // the outgoing cover holds under the incoming fade
  } else if (k >= 0 && TRANSITION_ROWS[k].bucket === 'face') {
    const fbPrev = FB_RUNS.find((f) => near(f.tOut, run.tIn));
    run.ingress = fbPrev && fbPrev.ref === run.ref ? 'grow' : 'cut';
  } else if (card) {
    run.ingress = 'afterCard';
  } else if (run.tIn > 0.01) {
    throw new Error(`cover run ${run.ref}@${run.tIn} has no planned ingress (TRANSITIONS.md section 5)`);
  }
  if (k >= 0) { usedTrans.add(k); run.via = TRANSITION_ROWS[k].id; }
  if (card) run.via = 'after ' + card.png;
}
TRANSITION_ROWS.forEach((r, k) => {
  if (r.bucket === 'card') {
    if (!CARD_T.some((c) => near(c, r.at))) throw new Error(`card transition ${r.tc} is not a card pause`);
    usedTrans.add(k);
  } else if (r.bucket === 'face') {
    if (!VISIBLE_WINDOWS.some((v) => near(v.a, r.at) || near(v.b, r.at))) throw new Error(`face cut ${r.tc} is not a visible-window edge`);
    usedTrans.add(k);   // every face edge carries its film burn (BURNS below), cover runs or not
  }
});
TRANSITION_ROWS.forEach((r, k) => {
  if (!usedTrans.has(k)) throw new Error(`planned transition ${r.tc} ${r.id} (${r.change}) is not wired`);
});
const BURNS = TRANSITION_ROWS.filter((r) => r.bucket === 'face');   // 15 x hand:film-burn

// ---------------------------------------------------------------------------------------------------------------------
// 6. Elements. Every node reads ONE absolute clock (section 6a): the composition frame, published through a context.
// ---------------------------------------------------------------------------------------------------------------------
const AbsFrame = createContext(0);
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const IN_OUT = Easing.inOut(Easing.sin);
const OUT = Easing.out(Easing.cubic);
const FILL: React.CSSProperties = { position: 'absolute', left: 0, top: 0, width: 1920, height: 1080 };
const DIR = (ref: string) => (ref === 'C1' ? 'diagrams' : 'card-slides');

// C1 (diagrams/_state-cues.md "Never dead still"): the slow push centres on the LIT node
const C1_FOCUS: Record<string, [number, number]> = {
  'C1-overview': [960, 600], 'C1-agent': [742, 581], 'C1-agent-price': [742, 581], 'C1-wallet': [1178, 581], 'C1-wallet-tee': [1178, 581],
  'C1-chat': [305, 581], 'C1-chat-swap': [305, 581], 'C1-path': [1615, 581], 'C1-skills': [742, 325], 'C1-skills-feed': [742, 325],
  'C1-a2a': [837, 870], 'C1-token': [1615, 889], 'C1-token-tag': [1615, 889],
};
// C1-path is revealed over C1-chat-swap by a left-to-right linear mask, x 140 -> 1800 over 88.50-89.10 (the arrows RUN)
const REVEALS: Record<string, { fa: number; fb: number; x0: number; x1: number }> = {
  'C1-path': { fa: F(88.5), fb: F(89.1), x0: 140, x1: 1800 },
};
const cueIndex = (cues: { f: number }[], absF: number) => {
  let i = 0;
  for (let k = 0; k < cues.length; k++) if (cues[k].f <= absF) i = k;
  return i;
};

// a state image (deck card or C1 state): hard swap for the cards (pixel-locked states), 0.3 s cross-fade inside C1
const StateImg: React.FC<{ run: Run; absF: number }> = ({ run, absF }) => {
  const dir = DIR(run.ref);
  const i = cueIndex(run.cues, absF);
  const cur = run.cues[i];
  const prev = i > 0 ? run.cues[i - 1] : null;
  const src = (png: string) => staticFile(`${dir}/${png}.png`);
  const rv = REVEALS[cur.png];
  if (rv && prev && absF < rv.fb) {
    const x = interpolate(absF, [rv.fa, rv.fb], [rv.x0, rv.x1], clamp);
    const mask = `linear-gradient(90deg, #000 0px, #000 ${x - 70}px, transparent ${x + 70}px)`;
    return (
      <>
        <Img src={src(prev.png)} style={FILL} />
        <Img src={src(cur.png)} style={{ ...FILL, WebkitMaskImage: mask, maskImage: mask }} />
      </>
    );
  }
  const xs = run.ref === 'C1' ? C1_XS_F : 0;
  if (xs > 0 && prev && absF - cur.f < xs) {
    return (
      <>
        <Img src={src(prev.png)} style={FILL} />
        <Img src={src(cur.png)} style={{ ...FILL, opacity: interpolate(absF - cur.f, [0, xs], [0, 1], clamp) }} />
      </>
    );
  }
  return <Img src={src(cur.png)} style={FILL} />;
};

// the slow push on every hold (comp-build 7a; CUE-SHEET "Every hold gets a slow push"): cards 1.00 -> 1.02 about the centre,
// C1 1.00 -> 1.03 about the lit node (the origin eases between nodes over 0.6 s), the C1 deck-area body at most 1.02 on the token.
// No push on the END card (YouTube end-screen slot geometry is fixed) nor on the charts (they animate).
const pushOf = (run: Run, absF: number) => {
  const p = interpolate(absF, [run.fromF, run.toF], [0, 1], clamp);
  if (run.kind === 'chart' || run.ref === 'END') return { s: 1, ox: 960, oy: 540 };
  if (run.ref === 'C1') {
    const i = cueIndex(run.cues, absF);
    const cur = C1_FOCUS[run.cues[i].png];
    const prev = i > 0 ? C1_FOCUS[run.cues[i - 1].png] : cur;
    const q = IN_OUT(interpolate(absF - run.cues[i].f, [0, 18], [0, 1], clamp));
    const ox = prev[0] + (cur[0] - prev[0]) * q;
    const oy = prev[1] + (cur[1] - prev[1]) * q;
    return { s: 1 + (run.layer === 'fb' ? 0.02 * p : 0.03 * IN_OUT(p)), ox, oy };
  }
  return { s: 1 + 0.02 * IN_OUT(p), ox: 960, oy: 540 };
};

// CoverEl: the element a row of each kind renders, the SAME for the full-frame cover and the deck-area body
const ChartFor: React.FC<{ c: Run; absF: number }> = ({ c, absF }) => {
  const t = unsh(absF / FPS);   // the SOURCE-spine second: one clock across the cover and the screen-share copy
  if (c.ref === 'C2') return <C2Chart t={t} uid={`c2${c.layer}${c.fromF}`} />;
  if (c.ref === 'C3') return <C3Chart t={t} uid={`c3${c.layer}${c.fromF}`} />;
  throw new Error(`chart ${c.ref} has no live animated component`);
};
const CoverEl: React.FC<{ run: Run; absF: number }> = ({ run, absF }) => {
  const push = pushOf(run, absF);
  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: PAGE_BG }}>
      <AbsoluteFill style={{ transformOrigin: `${push.ox}px ${push.oy}px`, transform: `scale(${push.s})` }}>
        {run.kind === 'chart' ? <ChartFor c={run} absF={absF} /> : <StateImg run={run} absF={absF} />}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// a full-frame cover run with its planned ingress (read off the absolute clock, so a copy inside a card scene is identical)
const RunEl: React.FC<{ run: Run }> = ({ run }) => {
  const absF = useContext(AbsFrame);
  const lf = absF - run.fromF;
  let opacity = 1;
  let transform = 'none';
  let origin = '50% 50%';
  if (run.ingress === 'xfade') {                 // hand:xfade-scale: the incoming fades + scales in over the held outgoing
    opacity = interpolate(lf, [0, XF_F], [0, 1], clamp);
    transform = `scale(${interpolate(lf, [0, XF_F], [0.93, 1], { ...clamp, easing: OUT })})`;
  } else if (run.ingress === 'afterCard') {      // the title card fades off above while the chapter's first cover scales in
    transform = `scale(${interpolate(lf, [0, XF_F], [0.93, 1], { ...clamp, easing: OUT })})`;
  } else if (run.ingress === 'cut') {            // hand:film-burn face-out: a hard cut under the warm flash, the card settles
    transform = `scale(${interpolate(lf, [0, ENTER_F], [0.97, 1], { ...clamp, easing: OUT })})`;
  } else if (run.ingress === 'grow') {           // the deck-area body grows to the full stage (one continuous appearance)
    const g = interpolate(lf, [0, GROW_F], [0, 1], { ...clamp, easing: IN_OUT });
    const s = DECK_SCALE + (1 - DECK_SCALE) * g;
    const ty = ((DECK_AREA.h - 1080 * DECK_SCALE) / 2) * (1 - g);
    transform = `translate(${DECK_AREA.x * (1 - g)}px, ${ty}px) scale(${s})`;
    origin = '0 0';
  }
  return (
    <AbsoluteFill style={{ opacity }}>
      <AbsoluteFill style={{ transform, transformOrigin: origin }}>
        <CoverEl run={run} absF={absF} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// the screen-share body: the SAME element in a clipped deck-area box, the 1920x1080 stage scaled 1464/1920, centred
// vertically on the page colour, with the container entrance (0.35 s fade + 0.97 -> 1); the webcam column is never touched
const FaceBodyEl: React.FC<{ run: Run }> = ({ run }) => {
  const absF = useContext(AbsFrame);
  const lf = absF - run.fromF;
  const a = run.ingress === 'entrance' ? interpolate(lf, [0, ENTER_F], [0, 1], clamp) : 1;
  const s = run.ingress === 'entrance' ? interpolate(lf, [0, ENTER_F], [0.97, 1], { ...clamp, easing: OUT }) : 1;
  return (
    <div style={{ position: 'absolute', left: DECK_AREA.x, top: DECK_AREA.y, width: DECK_AREA.w, height: DECK_AREA.h, overflow: 'hidden',
      background: PAGE_BG, opacity: a, transform: `scale(${s})`, transformOrigin: '50% 50%' }}>
      <div style={{ position: 'absolute', left: 0, top: (DECK_AREA.h - 1080 * DECK_SCALE) / 2, width: 1920, height: 1080,
        transformOrigin: '0 0', transform: `scale(${DECK_SCALE})` }}>
        <CoverEl run={run} absF={absF} />
      </div>
    </div>
  );
};

// the spine: the VO track + the face windows; reframe + punch outside the screen shares, identity inside them
const SpineLayer: React.FC = () => {
  const T = useContext(AbsFrame) / FPS;
  const punch = inShare(T) ? 1 : punchAt(T);
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', transformOrigin: `${FACE_POINT.x}px ${FACE_POINT.y}px`, transform: `scale(${punch})` }}>
        <OffthreadVideo src={staticFile('spine.mp4')}
          style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', transform: spineTransform(T) }} />
      </div>
    </AbsoluteFill>
  );
};

// rmn:flip title card: a self-contained pause scene (never the spine in TransitionSeries). The flip turns IN over the
// outgoing cover 0.3 s before the pause, holds through the 1.5 s silent pause and the word gap, never flips back out; it fades
// off over the chapter's first cover. Silent (no impact sound, Mike's no-SFX ruling).
const CardScene: React.FC<{ png: string; outRun: Run; durF: number }> = ({ png, outRun, durF }) => {
  const f = useCurrentFrame();
  const out = interpolate(f, [durF - XF_F, durF], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ opacity: out, backgroundColor: PAGE_BG }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={TURN_F}>
          <RunEl run={outRun} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={flip({ direction: 'from-right' })} timing={linearTiming({ durationInFrames: TURN_F })} />
        <TransitionSeries.Sequence durationInFrames={durF}>
          <Img src={staticFile(`title-slides/${png}.png`)} style={FILL} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
const CARD_SCENES = CARDS.map((c) => {
  const pauseStartF = Math.round((sh(c.at) - PAUSE) * FPS);
  const startF = pauseStartF - CARD_LEAD_F;
  const durF = F(c.next) + XF_F - startF;
  const outRun = COVER_RUNS.find((r) => r.fromF <= startF && startF < r.toF);
  if (!outRun) throw new Error(`card ${c.png}: no outgoing cover at frame ${startF}`);
  return { ...c, startF, durF, outRun };
});

// hand:film-burn: a warm radial flash peaking ON the cut, drifting across the frame, screen-blended, intensity kept low
const FilmBurn: React.FC<{ durF: number; seed: number }> = ({ durF, seed }) => {
  const f = useCurrentFrame();
  const p = Math.min(1, Math.max(0, f / (durF - 1)));
  const a = Math.sin(Math.PI * p);
  const dir = seed % 2 === 0 ? 1 : -1;
  const cx = 50 + dir * (p - 0.5) * 60;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'screen', opacity: BURN_PEAK * a }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 75% 95% at ${cx}% 42%, rgba(255,222,160,1) 0%, rgba(255,150,60,.92) 26%, rgba(214,70,22,.6) 52%, rgba(0,0,0,0) 80%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 45% 55% at ${100 - cx}% 78%, rgba(255,186,96,.55) 0%, rgba(0,0,0,0) 72%)` }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// 7. The composition: spine -> screen-share body -> cover track -> title cards -> film burns. No captions (OFF), no music,
//    no SFX, no watermark.
// ---------------------------------------------------------------------------------------------------------------------
export const Pieverse: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsFrame.Provider value={frame}>
      <AbsoluteFill style={{ backgroundColor: '#000' }}>
        <SpineLayer />
        {FB_RUNS.map((r) => (
          <Sequence key={`fb${r.fromF}`} from={r.fromF} durationInFrames={r.toF - r.fromF} name={`FB ${r.ref}`}>
            <FaceBodyEl run={r} />
          </Sequence>
        ))}
        {COVER_RUNS.map((r) => (
          <Sequence key={`cv${r.fromF}`} from={r.fromF} durationInFrames={r.toF - r.fromF + r.tailF} name={`${r.ref} (${r.ingress})`}>
            <RunEl run={r} />
          </Sequence>
        ))}
        {CARD_SCENES.map((c) => (
          <Sequence key={c.png} from={c.startF} durationInFrames={c.durF} name={`card ${c.label} rmn:flip`}>
            <CardScene png={c.png} outRun={c.outRun} durF={c.durF} />
          </Sequence>
        ))}
        {BURNS.map((b, i) => (
          <Sequence key={`burn${b.at}`} from={F(b.at) - BURN_HALF} durationInFrames={2 * BURN_HALF + 1} name={`${b.id} ${b.tc}`}>
            <FilmBurn durF={2 * BURN_HALF + 1} seed={i} />
          </Sequence>
        ))}
      </AbsoluteFill>
    </AbsFrame.Provider>
  );
};

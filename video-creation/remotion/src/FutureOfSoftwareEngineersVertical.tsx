/**
 * future-of-software-engineers · "Software Engineers Who Only Code Are Running Out of Time" · the VERTICAL (1080x1920) cut.
 * Built by the comp-builder (VERTICAL mode) 2026-11-15 per vertical-repurpose.md sections 1b + 2, from the APPROVED 16:9
 * comp FutureOfSoftwareEngineers.tsx (this project's own file) and its blueprint: EDIT-PLAN.md · CUE-SHEET.md ·
 * TRANSITIONS.md section 5 + TRANSITION-PLAN.json · assets/vertical/NOTES.md · assets/vertical/charts/*.vertical.spec.md ·
 * assets/vertical/diagrams/*.vertical.spec.md · assets/vertical/face-crop.json.
 *
 * The vertical is a REFRAME, never a re-edit: the same spine, the same time map (DUR, CARD_T, PAUSE, SPINE_SECS), the
 * cover table copied verbatim from the 16:9 and asserted byte-identical to it at module load, the same 48 transition rows
 * (ids verbatim), the same (empty) caption windows. Only the framing changes:
 *   - the spine plays cropped tall at the MEASURED face position (face-crop.json, per FACE window), section 1b;
 *   - every cover asset resolves through ONE explicit 16:9-ref -> vertical-asset table (V_ASSET): a ref with no entry
 *     throws at module load, a table path missing from the lean public dir throws on the first frame (remotion_staticFiles);
 *   - containers + receipts are the portrait re-shoots, full frame; C1 / C2 run their PORTRAIT op programs; C3 / C4 are the
 *     portrait chart components, entered OPACITY ONLY (NOTES item 1); the 3 receipt MOTION moves get portrait pre-framed scenes.
 * Rulings carried over from the 16:9 (NOTES item 3): no title cards, no clip inserts, NO CAPTIONS (caption_scope none),
 * no Envato / ChatGPT images, no whiteboards, no kinetic text, no music / SFX in the comp, no watermark.
 * Render: public dir = assets/vertical ONLY (lean); the graph renders (render_comp.py --comp FutureOfSoftwareEngineersVertical).
 *
 * Kinds (the gates' vocabulary, as the 16:9): 'container' = a spotlight container (the D cards, the C1 / C2 spotlight
 * states), 'deck' = the rich full diagram shown ONCE (C1 ALL), 'chart' = a live animated chart, 'receipt' = a capture view.
 * DIAGRAM_REFS: C1, C2
 * (end declared refs)
 */
import React, { createContext, useContext, useMemo } from 'react';
import {
  AbsoluteFill, Freeze, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame,
} from 'remotion';
import { ENGINES, getTransition } from './transitions';
import { TransitionClip } from './transitions/TransitionClip';
import { C3ChartV, C4ChartV } from './FutureOfSoftwareEngineersVerticalCharts';
// Captions OFF for this video (16:9 ruling, NOTES item 3): the same empty module, never mounted.
import { ZCAPTIONS, CAPTION_WINDOWS } from './FutureOfSoftwareEngineersCaptions';
import * as P169 from './FutureOfSoftwareEngineers';
import { FACE_TRACK, FACE_TRACK_STEP } from './FutureOfSoftwareEngineersVerticalFaceTrack';

// =====================================================================================================================
// 4. THE COVER TABLE, verbatim from FutureOfSoftwareEngineers.tsx (byte-identical beat times, asserted below)
// =====================================================================================================================
type Kind = 'container' | 'deck' | 'chart' | 'receipt';
type Cover = { tIn: number; tOut: number; kind: Kind; ref: string; state: string; mo?: string };
export const COVERS: Cover[] = [
  // ---- CH1 THE OPEN ----
  { tIn: 5.355, tOut: 7.06, kind: 'receipt', ref: 'C5', state: 'C5-sentence' },
  { tIn: 7.06, tOut: 10.85, kind: 'receipt', ref: 'C5', state: 'C5-header' },
  { tIn: 10.85, tOut: 20.04, kind: 'receipt', ref: 'C6', state: 'C6-sentence' },
  { tIn: 20.04, tOut: 22.555, kind: 'receipt', ref: 'C6', state: 'C6-cover', mo: 'motion-3d-pan-1-up' },
  { tIn: 25.955, tOut: 28.8, kind: 'container', ref: 'D1', state: 'D1' },
  { tIn: 28.8, tOut: 33.78, kind: 'container', ref: 'D1', state: 'D1-s1' },
  // ---- CH2 THE SHIFT ----
  { tIn: 33.78, tOut: 68.14, kind: 'chart', ref: 'C3', state: 'live' },
  { tIn: 68.14, tOut: 70.98, kind: 'container', ref: 'D2', state: 'D2' },
  { tIn: 70.98, tOut: 71.56, kind: 'container', ref: 'D2', state: 'D2-s1' },
  { tIn: 71.56, tOut: 74.74, kind: 'container', ref: 'D2', state: 'D2-s2' },
  { tIn: 74.74, tOut: 75.68, kind: 'container', ref: 'D2', state: 'D2-s3' },
  { tIn: 75.68, tOut: 76.86, kind: 'container', ref: 'D2', state: 'D2-s4' },
  { tIn: 76.86, tOut: 77.6, kind: 'container', ref: 'D2', state: 'D2-s5' },
  { tIn: 77.6, tOut: 79.62, kind: 'container', ref: 'D3', state: 'D3' },
  { tIn: 79.62, tOut: 81.3, kind: 'container', ref: 'D3', state: 'D3-s1' },
  { tIn: 81.3, tOut: 84.94, kind: 'container', ref: 'D3', state: 'D3-s2' },
  { tIn: 84.94, tOut: 86.3, kind: 'receipt', ref: 'C7', state: 'C7-title-sentence' },
  { tIn: 86.3, tOut: 90.49, kind: 'receipt', ref: 'C7', state: 'C7-sentence' },
  { tIn: 90.49, tOut: 94.16, kind: 'container', ref: 'D3', state: 'D3-s3' },
  { tIn: 94.16, tOut: 97.8, kind: 'container', ref: 'D3', state: 'D3-s4' },
  { tIn: 97.8, tOut: 102.4, kind: 'container', ref: 'D3', state: 'D3-s5' },
  { tIn: 102.4, tOut: 107.31, kind: 'container', ref: 'D3', state: 'D3-s6' },
  { tIn: 107.31, tOut: 110.2, kind: 'container', ref: 'D4', state: 'D4' },
  { tIn: 110.2, tOut: 112.4, kind: 'container', ref: 'D4', state: 'D4-s1' },
  { tIn: 112.4, tOut: 115.84, kind: 'container', ref: 'D4', state: 'D4-s2' },
  { tIn: 115.84, tOut: 118.98, kind: 'container', ref: 'D4', state: 'D4-s3' },
  { tIn: 118.98, tOut: 123.322, kind: 'container', ref: 'D4', state: 'D4-s4' },
  { tIn: 125.255, tOut: 127.34, kind: 'container', ref: 'D5', state: 'D5' },
  { tIn: 127.34, tOut: 129.92, kind: 'container', ref: 'D5', state: 'D5-s1' },
  // ---- CH3 THE POD ---- (C2: one diagram, its THEN -> NOW states, camera per _state-cues.md)
  { tIn: 129.92, tOut: 135.78, kind: 'container', ref: 'C2', state: 'C2-empty' },
  { tIn: 135.78, tOut: 144.78, kind: 'container', ref: 'C2', state: 'C2-scope' },
  { tIn: 144.78, tOut: 151.6, kind: 'container', ref: 'C2', state: 'C2-seats' },
  { tIn: 151.6, tOut: 153.4, kind: 'container', ref: 'C2', state: 'C2-then' },
  { tIn: 153.4, tOut: 158.18, kind: 'container', ref: 'C2', state: 'C2-now-base' },
  { tIn: 158.18, tOut: 159.92, kind: 'container', ref: 'C2', state: 'C2-goal' },
  { tIn: 159.92, tOut: 162.54, kind: 'container', ref: 'C2', state: 'C2-agents' },
  { tIn: 162.54, tOut: 163.98, kind: 'container', ref: 'C2', state: 'C2-now' },
  { tIn: 163.98, tOut: 165.6, kind: 'container', ref: 'C2', state: 'C2-dim' },
  { tIn: 165.6, tOut: 167.38, kind: 'container', ref: 'C2', state: 'C2-final' },
  // D18 over the BLACKED-OUT FACE 4 line (PROJECT-LOG open flag; GATE 3 ruling 1): lands ON C2's out
  { tIn: 167.38, tOut: 169.7, kind: 'container', ref: 'D18', state: 'D18' },
  { tIn: 169.7, tOut: 170.48, kind: 'container', ref: 'D18', state: 'D18-s1' },
  { tIn: 170.48, tOut: 171.36, kind: 'container', ref: 'D18', state: 'D18-s2' },
  { tIn: 171.36, tOut: 172.18, kind: 'container', ref: 'D18', state: 'D18-s3' },
  { tIn: 172.18, tOut: 173.42, kind: 'container', ref: 'D18', state: 'D18-s4' },
  { tIn: 173.42, tOut: 174.82, kind: 'container', ref: 'D18', state: 'D18-s5' },
  { tIn: 174.82, tOut: 176.02, kind: 'container', ref: 'D18', state: 'D18-s6' },
  { tIn: 176.02, tOut: 177.02, kind: 'container', ref: 'D18', state: 'D18-s7' },
  { tIn: 177.02, tOut: 180.34, kind: 'container', ref: 'D18', state: 'D18-s8' },
  { tIn: 180.34, tOut: 185.34, kind: 'container', ref: 'D6', state: 'D6' },
  { tIn: 185.34, tOut: 187.08, kind: 'container', ref: 'D6', state: 'D6-s1' },
  { tIn: 187.08, tOut: 188.18, kind: 'container', ref: 'D6', state: 'D6-s2' },
  { tIn: 188.18, tOut: 191.4, kind: 'container', ref: 'D6', state: 'D6-s3' },
  { tIn: 191.4, tOut: 194.41, kind: 'container', ref: 'D6', state: 'D6-s4' },
  // ---- CH4 THE VERSIONS OF THE ENGINEER ---- (C1 FUNNEL)
  { tIn: 194.41, tOut: 196.46, kind: 'container', ref: 'C1', state: 'C1-funnel-outline' },
  { tIn: 196.46, tOut: 197.4, kind: 'container', ref: 'C1', state: 'C1-funnel-title' },
  { tIn: 197.4, tOut: 199.86, kind: 'container', ref: 'C1', state: 'C1-funnel-letters' },
  { tIn: 199.86, tOut: 204.0, kind: 'container', ref: 'C1', state: 'C1-funnel-names' },
  { tIn: 204.0, tOut: 209.72, kind: 'container', ref: 'C1', state: 'C1-funnel' },
  { tIn: 209.72, tOut: 214.72, kind: 'container', ref: 'D7', state: 'D7' },
  { tIn: 214.72, tOut: 215.52, kind: 'container', ref: 'D7', state: 'D7-s1' },
  { tIn: 215.52, tOut: 219.7, kind: 'container', ref: 'D7', state: 'D7-s2' },
  { tIn: 219.7, tOut: 220.98, kind: 'container', ref: 'D7', state: 'D7-s3' },
  { tIn: 220.98, tOut: 221.7, kind: 'container', ref: 'D7', state: 'D7-s4' },
  { tIn: 221.7, tOut: 225.24, kind: 'container', ref: 'D8', state: 'D8' },
  { tIn: 225.24, tOut: 228.42, kind: 'container', ref: 'D8', state: 'D8-s1' },
  { tIn: 228.42, tOut: 230.32, kind: 'container', ref: 'D8', state: 'D8-s2' },
  { tIn: 230.32, tOut: 231.54, kind: 'container', ref: 'D8', state: 'D8-s3' },
  { tIn: 231.54, tOut: 235.48, kind: 'container', ref: 'D8', state: 'D8-s4' },
  // C1 GROWTH
  { tIn: 235.48, tOut: 236.02, kind: 'container', ref: 'C1', state: 'C1-funnel' },
  { tIn: 236.02, tOut: 237.2, kind: 'container', ref: 'C1', state: 'C1-funnel-glow' },
  { tIn: 237.2, tOut: 237.8, kind: 'container', ref: 'C1', state: 'C1-funnel' },
  { tIn: 237.8, tOut: 239.6, kind: 'container', ref: 'C1', state: 'C1-growth-bracket' },
  { tIn: 239.6, tOut: 243.76, kind: 'container', ref: 'C1', state: 'C1-growth-tags' },
  { tIn: 243.76, tOut: 248.6, kind: 'container', ref: 'C1', state: 'C1-growth-test' },
  { tIn: 248.6, tOut: 250.508, kind: 'container', ref: 'C1', state: 'C1-growth' },
  { tIn: 256.741, tOut: 259.68, kind: 'container', ref: 'D9', state: 'D9' },
  { tIn: 259.68, tOut: 262.89, kind: 'container', ref: 'D9', state: 'D9-s1' },
  // C1 PRODUCT
  { tIn: 262.89, tOut: 263.84, kind: 'container', ref: 'C1', state: 'C1-product-bracket' },
  { tIn: 263.84, tOut: 269.38, kind: 'container', ref: 'C1', state: 'C1-product-overlap' },
  { tIn: 269.38, tOut: 272.02, kind: 'container', ref: 'C1', state: 'C1-product-customer' },
  { tIn: 272.02, tOut: 272.98, kind: 'container', ref: 'C1', state: 'C1-product-retention' },
  { tIn: 272.98, tOut: 275.03, kind: 'container', ref: 'C1', state: 'C1-product' },
  { tIn: 275.03, tOut: 278.14, kind: 'container', ref: 'D10', state: 'D10' },
  { tIn: 278.14, tOut: 278.92, kind: 'container', ref: 'D10', state: 'D10-s1' },
  { tIn: 278.92, tOut: 281.97, kind: 'container', ref: 'D10', state: 'D10-s2' },
  { tIn: 281.97, tOut: 283.5, kind: 'container', ref: 'D9', state: 'D9-s2' },
  { tIn: 283.5, tOut: 288.28, kind: 'container', ref: 'D9', state: 'D9-s3' },
  { tIn: 288.28, tOut: 289.741, kind: 'container', ref: 'D9', state: 'D9-s4' },
  { tIn: 292.608, tOut: 295.02, kind: 'container', ref: 'D11', state: 'D11' },
  { tIn: 295.02, tOut: 299.2, kind: 'container', ref: 'D11', state: 'D11-s1' },
  { tIn: 299.2, tOut: 304.14, kind: 'container', ref: 'D11', state: 'D11-s2' },
  // C1 PLATFORM
  { tIn: 304.14, tOut: 306.46, kind: 'container', ref: 'C1', state: 'C1-platform-floor' },
  { tIn: 306.46, tOut: 310.02, kind: 'container', ref: 'C1', state: 'C1-platform-customers' },
  { tIn: 310.02, tOut: 312.98, kind: 'container', ref: 'C1', state: 'C1-platform-arrows' },
  { tIn: 312.98, tOut: 316.34, kind: 'container', ref: 'C1', state: 'C1-platform-pm' },
  { tIn: 316.34, tOut: 317.975, kind: 'container', ref: 'C1', state: 'C1-platform' },
  { tIn: 321.908, tOut: 325.18, kind: 'container', ref: 'D12', state: 'D12' },
  { tIn: 325.18, tOut: 327.64, kind: 'container', ref: 'D12', state: 'D12-s1' },
  { tIn: 327.64, tOut: 329.58, kind: 'container', ref: 'D12', state: 'D12-s2' },
  { tIn: 329.58, tOut: 332.94, kind: 'receipt', ref: 'C12', state: 'C12-title-date', mo: 'motion-3d-orbit-2-right-down' },
  { tIn: 332.94, tOut: 339.35, kind: 'receipt', ref: 'C12', state: 'C12-definition' },
  // C1 GTM
  { tIn: 339.35, tOut: 343.4, kind: 'container', ref: 'C1', state: 'C1-gtm-lane' },
  { tIn: 343.4, tOut: 350.481, kind: 'container', ref: 'C1', state: 'C1-gtm' },
  // C1 ALL: the finished map shown ONCE (the overview after its pieces were spotlighted; C1-all-base, then the in-row
  // 359.06 cross-fade to C1-all + the four label rings)
  { tIn: 353.481, tOut: 368.28, kind: 'deck', ref: 'C1', state: 'C1-all-base' },
  // ---- CH5 WHO FALLS BEHIND ----
  { tIn: 368.28, tOut: 372.42, kind: 'container', ref: 'D13', state: 'D13' },
  { tIn: 372.42, tOut: 374.72, kind: 'container', ref: 'D13', state: 'D13-s1' },
  { tIn: 374.72, tOut: 376.29, kind: 'container', ref: 'D13', state: 'D13-s2' },
  { tIn: 376.29, tOut: 381.39, kind: 'receipt', ref: 'C9', state: 'C9-chart' },
  { tIn: 381.39, tOut: 381.64, kind: 'container', ref: 'D13', state: 'D13-s3' },
  { tIn: 381.64, tOut: 382.88, kind: 'container', ref: 'D13', state: 'D13-s4' },
  { tIn: 382.88, tOut: 385.88, kind: 'container', ref: 'D13', state: 'D13-s5' },
  { tIn: 385.88, tOut: 408.31, kind: 'chart', ref: 'C4', state: 'live' },
  { tIn: 408.31, tOut: 411.54, kind: 'container', ref: 'D15', state: 'D15' },
  { tIn: 411.54, tOut: 415.64, kind: 'container', ref: 'D15', state: 'D15-s1' },
  { tIn: 415.64, tOut: 418.07, kind: 'container', ref: 'D15', state: 'D15-s2' },
  { tIn: 418.07, tOut: 422.08, kind: 'receipt', ref: 'C10', state: 'C10-headline', mo: 'motion-3d-pan-2-left' },
  { tIn: 422.08, tOut: 433.34, kind: 'receipt', ref: 'C10', state: 'C10-reduced-hiring' },
  { tIn: 433.34, tOut: 437.348, kind: 'container', ref: 'D15', state: 'D15-s3' },
  // ---- CH6 THE CLOSE ----
  { tIn: 442.281, tOut: 443.76, kind: 'container', ref: 'D16', state: 'D16' },
  { tIn: 443.76, tOut: 445.82, kind: 'container', ref: 'D16', state: 'D16-s1' },
  { tIn: 445.82, tOut: 447.02, kind: 'container', ref: 'D16', state: 'D16-s2' },
  { tIn: 447.02, tOut: 448.04, kind: 'container', ref: 'D16', state: 'D16-s3' },
  { tIn: 448.04, tOut: 449.62, kind: 'container', ref: 'D16', state: 'D16-s4' },
  { tIn: 449.62, tOut: 451.08, kind: 'container', ref: 'D16', state: 'D16-s5' },
  { tIn: 451.08, tOut: 452.02, kind: 'container', ref: 'D16', state: 'D16-s6' },
  { tIn: 452.02, tOut: 452.94, kind: 'container', ref: 'D16', state: 'D16-s7' },
  { tIn: 452.94, tOut: 453.82, kind: 'container', ref: 'D16', state: 'D16-s8' },
  { tIn: 453.82, tOut: 454.5, kind: 'container', ref: 'D16', state: 'D16-s9' },
  { tIn: 454.5, tOut: 455.46, kind: 'container', ref: 'D16', state: 'D16-s10' },
  { tIn: 455.46, tOut: 458.58, kind: 'container', ref: 'D16', state: 'D16-s11' },
  { tIn: 458.58, tOut: 460.181, kind: 'container', ref: 'D16', state: 'D16-s12' },
  // D17 END CARD (slots EMPTY, GATE 3 ruling 7), to the last frame
  { tIn: 465.148, tOut: 466.04, kind: 'container', ref: 'D17', state: 'D17' },
  { tIn: 466.04, tOut: 473.98, kind: 'container', ref: 'D17', state: 'D17-s1' },
  { tIn: 473.98, tOut: 477.381, kind: 'container', ref: 'D17', state: 'D17-s2' },
];

// =====================================================================================================================
// 1-2. TIME MODEL, verbatim from the 16:9 (spine/ALL.f.paused.json pauses[] = []: no card, no insert, sh() = identity)
// =====================================================================================================================
export const FPS = 30;
export const PAUSE = 1.5;                                     // ALL.f.paused.json pause_s (no card uses it)
export const PAUSES: { at: number; dur: number; clip?: string; label?: string }[] = [];   // ALL.f.paused.json pauses[]
export const CARD_T: number[] = [];                           // no title card
export const INSERTS: { at: number; dur: number }[] = [];     // {at, dur} for EVERY pause: none
export const SPINE_SECS = 477.381;                            // the SOURCE spine spine/ALL.e.enhanced.mp4
export const sh = (t: number) => t + PAUSES.filter((p) => p.at <= t).reduce((s, p) => s + p.dur, 0);   // source -> paused
export const F = (t: number) => Math.round(sh(t) * FPS);                                                // source -> frame
const unsh = (tp: number) => {
  let off = 0;
  for (const p of [...PAUSES].sort((a, b) => a.at - b.at)) {
    if (tp < p.at + off) break;
    if (tp < p.at + off + p.dur) return p.at;
    off += p.dur;
  }
  return tp - off;
};
export const DUR = Math.ceil((SPINE_SECS + PAUSES.reduce((s, p) => s + p.dur, 0)) * FPS);   // 14322 frames = the 16:9's
export const FACE_WINDOWS: [number, number][] = [             // AS-RECORDED / COVER-PLAN face_windows (source s)
  [0.0, 5.355], [22.555, 25.955], [123.322, 125.255], [250.508, 256.741], [289.741, 292.608],
  [317.975, 321.908], [350.481, 353.481], [437.348, 442.281], [460.181, 465.148],
];
// the twin contract (vertical-repurpose.md section 2): drift from the 16:9 cannot render
(() => {
  const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
  const checks: [string, unknown, unknown][] = [
    ['COVERS', COVERS, P169.COVERS], ['FPS', FPS, P169.FPS], ['DUR', DUR, P169.DUR], ['PAUSE', PAUSE, P169.PAUSE],
    ['PAUSES', PAUSES, P169.PAUSES], ['CARD_T', CARD_T, P169.CARD_T], ['INSERTS', INSERTS, P169.INSERTS],
    ['SPINE_SECS', SPINE_SECS, P169.SPINE_SECS], ['FACE_WINDOWS', FACE_WINDOWS, P169.FACE_WINDOWS],
  ];
  for (const [k, a, b] of checks) if (!same(a, b)) throw new Error(`vertical ${k} drifted from the 16:9 FutureOfSoftwareEngineers.tsx`);
  if (ZCAPTIONS.length || CAPTION_WINDOWS.length) throw new Error('captions are OFF for this video (caption_scope none)');
})();

// =====================================================================================================================
// 1b. THE FACE CROP, MEASURED (assets/vertical/face-crop.json, measure_face_crop.py, method face-detect): Mike's horizontal
//     centre per FACE window as a % of the 1920 source width (mean 60.32, spread 55.18 to 68.67; all windows fit one offset).
//     The spine (1920x1080) covers the 1080x1920 frame at 16/9 scale, so the visible window is 607.5 SOURCE px wide; CSS
//     objectPosition P% aligns the image's P% point with the frame's P% point, so to put a measured centre c on the frame's
//     CENTRE: P = (c - 303.75) / (1920 - 607.5). (Writing c itself as P, 60.3%, would leave him 111 px right of centre.)
//     Per-window offsets (the skill allows them; the spread between window means is 2.5%); outside a face window the spine
//     is blacked out under the covers, so it takes the global mean.
//     + a DAMPED FOLLOW inside each window (chunk QA 2026-11-15): Mike sways up to 15% of the source width INSIDE a window
//     (F4 55.9 -> 69.6%, F8 52.7 -> 67.9%, dense samples every 2 frames), against 16% of slack in the 607.5 px crop, so a
//     constant offset put his face at 25% to 77% of the portrait width with his hair cut at the frame edge. The crop now
//     follows HALF of his smoothed, measured face track (FutureOfSoftwareEngineersVerticalFaceTrack.ts, the measure script's own
//     detector, sigma 0.4 s) around the window's face-crop.json value: he stays clear of both edges and the room drifts at half
//     his motion instead of chasing him. FACE_FOLLOW = 0 restores the constant per-window crop exactly.
// =====================================================================================================================
// FACE_REFRAME_WAIVED: comp-build.md section 3a (last bullet) + vertical-repurpose.md section 1b, 2026-11-15: the 16:9 face-reframe.json
//   transform is the 16:9 cut's; the VERTICAL cut applies its own measured crop (assets/vertical/face-crop.json) below.
const FACE_CROP_MEAN = 60.32;
const FACE_CROP_WINDOWS: { w: [number, number]; pct: number }[] = [
  { w: [0.0, 5.355], pct: 58.94 }, { w: [22.555, 25.955], pct: 60.26 }, { w: [123.322, 125.255], pct: 61.37 },
  { w: [250.508, 256.741], pct: 60.81 }, { w: [289.741, 292.608], pct: 60.81 }, { w: [317.975, 321.908], pct: 59.82 },
  { w: [350.481, 353.481], pct: 58.88 }, { w: [437.348, 442.281], pct: 60.74 }, { w: [460.181, 465.148], pct: 61.22 },
];
if (JSON.stringify(FACE_CROP_WINDOWS.map((r) => r.w)) !== JSON.stringify(FACE_WINDOWS)) throw new Error('face-crop windows != FACE_WINDOWS');
const SRC_W = 1920, SRC_H = 1080, OUT_W = 1080, OUT_H = 1920;
const COVER_K = OUT_H / SRC_H;                                // 16/9: the spine scaled to cover the portrait frame
const CROP_W = OUT_W / COVER_K;                               // 607.5 source px visible
const cropPos = (pct: number) => (((pct / 100) * SRC_W - CROP_W / 2) / (SRC_W - CROP_W)) * 100;
const FACE_FOLLOW = 0.5;
if (FACE_TRACK.length !== FACE_CROP_WINDOWS.length || FACE_TRACK.some((r, i) => r.f0 !== Math.round(FACE_CROP_WINDOWS[i].w[0] * FPS))) throw new Error('face track != the FACE windows');
const facePctAt = (srcT: number) => {
  const i = FACE_CROP_WINDOWS.findIndex((r) => srcT >= r.w[0] - 0.5 && srcT < r.w[1] + 0.5);
  if (i < 0) return FACE_CROP_MEAN;
  const anchor = FACE_CROP_WINDOWS[i].pct, tr = FACE_TRACK[i];
  const x = Math.max(0, Math.min(tr.pct.length - 1, (srcT * FPS - tr.f0) / FACE_TRACK_STEP));
  const j = Math.floor(x), q = x - j;
  const track = j + 1 < tr.pct.length ? tr.pct[j] * (1 - q) + tr.pct[j + 1] * q : tr.pct[j];
  return anchor + FACE_FOLLOW * (track - anchor);
};
// where his face sits on the portrait frame (punch-ins scale about it): centred x; y = the measured eye line (16:9
// face-reframe.json eye_y 547.4 source px) at the cover scale
const FACE_POINT = { x: OUT_W / 2, y: Math.round(547.4 * COVER_K) };

// [PUNCH-IN] the 16:9's ONE punch (F3 join 124.289, airs from comp frame 3728), same frames, same 1.18 step
export const PUNCHES = [{ at: 124.289, frame: 3728, until: 125.255, scale: 1.18 }];
if (JSON.stringify(PUNCHES) !== JSON.stringify(P169.PUNCHES)) throw new Error('vertical PUNCHES drifted from the 16:9');
const punchAt = (abs: number) => {
  for (const p of PUNCHES) if (abs >= p.frame && abs < F(p.until)) return p.scale;
  return 1;
};
// F1's face-out last frame was dropped by a desilencer join: its cover enters one frame early (the 16:9's measured edge fix)
const EDGE_LEAD: Record<string, number> = { '5.355': 1 };

const AbsClock = createContext(0);
const useAbs = () => useContext(AbsClock);
const useSrcT = () => unsh(useAbs() / FPS);

/** The spine, cropped tall at the measured face position + punched. `startFrom = abs - local` keeps a copy in sync in ANY
 * nesting (comp-build.md section 6a), so the light leak's two muted copies are faithful to the live layer. */
const SpineView: React.FC<{ audio?: boolean }> = ({ audio }) => {
  const abs = useAbs();
  const local = useCurrentFrame();
  const pos = cropPos(facePctAt(unsh(abs / FPS)));
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: '#000' }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', transformOrigin: `${FACE_POINT.x}px ${FACE_POINT.y}px`, transform: `scale(${punchAt(abs)})` }}>
        <OffthreadVideo
          src={staticFile('spine.mp4')}
          muted={!audio}
          startFrom={Math.max(0, abs - local)}
          style={{ position: 'absolute', left: 0, top: 0, width: OUT_W, height: OUT_H, objectFit: 'cover', objectPosition: `${pos.toFixed(3)}% center` }}
        />
      </div>
    </AbsoluteFill>
  );
};

// =====================================================================================================================
// THE 16:9-REF -> VERTICAL-ASSET LOOKUP (vertical-repurpose.md section 2). Every still a cover shows resolves HERE; a
// ref / state / op image with no entry throws at module load, and a listed path missing from the lean public dir
// (assets/vertical) throws on the first rendered frame. C3 / C4 resolve to the portrait chart components (V_CHART).
// assets/vertical/NOTES.md substitutions honoured: the charts' entry is opacity only; nothing else is substituted
// (no cards, inserts, captions, Envato / ChatGPT images, whiteboards, kinetic text, SFX in either cut).
// =====================================================================================================================
const V_ASSET: Record<string, string> = {
  // card-slides: the slide-builder's portrait re-shoots of assets/vertical/slide-sources/containers.html
  'D1': 'card-slides/D1.png', 'D1-s1': 'card-slides/D1-s1.png',
  'D2': 'card-slides/D2.png', 'D2-s1': 'card-slides/D2-s1.png', 'D2-s2': 'card-slides/D2-s2.png', 'D2-s3': 'card-slides/D2-s3.png', 'D2-s4': 'card-slides/D2-s4.png', 'D2-s5': 'card-slides/D2-s5.png',
  'D3': 'card-slides/D3.png', 'D3-s1': 'card-slides/D3-s1.png', 'D3-s2': 'card-slides/D3-s2.png', 'D3-s3': 'card-slides/D3-s3.png', 'D3-s4': 'card-slides/D3-s4.png', 'D3-s5': 'card-slides/D3-s5.png', 'D3-s6': 'card-slides/D3-s6.png',
  'D4': 'card-slides/D4.png', 'D4-s1': 'card-slides/D4-s1.png', 'D4-s2': 'card-slides/D4-s2.png', 'D4-s3': 'card-slides/D4-s3.png', 'D4-s4': 'card-slides/D4-s4.png',
  'D5': 'card-slides/D5.png', 'D5-s1': 'card-slides/D5-s1.png',
  'D18': 'card-slides/D18.png', 'D18-s1': 'card-slides/D18-s1.png', 'D18-s2': 'card-slides/D18-s2.png', 'D18-s3': 'card-slides/D18-s3.png', 'D18-s4': 'card-slides/D18-s4.png', 'D18-s5': 'card-slides/D18-s5.png', 'D18-s6': 'card-slides/D18-s6.png', 'D18-s7': 'card-slides/D18-s7.png', 'D18-s8': 'card-slides/D18-s8.png',
  'D6': 'card-slides/D6.png', 'D6-s1': 'card-slides/D6-s1.png', 'D6-s2': 'card-slides/D6-s2.png', 'D6-s3': 'card-slides/D6-s3.png', 'D6-s4': 'card-slides/D6-s4.png',
  'D7': 'card-slides/D7.png', 'D7-s1': 'card-slides/D7-s1.png', 'D7-s2': 'card-slides/D7-s2.png', 'D7-s3': 'card-slides/D7-s3.png', 'D7-s4': 'card-slides/D7-s4.png',
  'D8': 'card-slides/D8.png', 'D8-s1': 'card-slides/D8-s1.png', 'D8-s2': 'card-slides/D8-s2.png', 'D8-s3': 'card-slides/D8-s3.png', 'D8-s4': 'card-slides/D8-s4.png',
  'D9': 'card-slides/D9.png', 'D9-s1': 'card-slides/D9-s1.png', 'D9-s2': 'card-slides/D9-s2.png', 'D9-s3': 'card-slides/D9-s3.png', 'D9-s4': 'card-slides/D9-s4.png',
  'D10': 'card-slides/D10.png', 'D10-s1': 'card-slides/D10-s1.png', 'D10-s2': 'card-slides/D10-s2.png',
  'D11': 'card-slides/D11.png', 'D11-s1': 'card-slides/D11-s1.png', 'D11-s2': 'card-slides/D11-s2.png',
  'D12': 'card-slides/D12.png', 'D12-s1': 'card-slides/D12-s1.png', 'D12-s2': 'card-slides/D12-s2.png',
  'D13': 'card-slides/D13.png', 'D13-s1': 'card-slides/D13-s1.png', 'D13-s2': 'card-slides/D13-s2.png', 'D13-s3': 'card-slides/D13-s3.png', 'D13-s4': 'card-slides/D13-s4.png', 'D13-s5': 'card-slides/D13-s5.png',
  'D15': 'card-slides/D15.png', 'D15-s1': 'card-slides/D15-s1.png', 'D15-s2': 'card-slides/D15-s2.png', 'D15-s3': 'card-slides/D15-s3.png',
  'D16': 'card-slides/D16.png', 'D16-s1': 'card-slides/D16-s1.png', 'D16-s2': 'card-slides/D16-s2.png', 'D16-s3': 'card-slides/D16-s3.png', 'D16-s4': 'card-slides/D16-s4.png', 'D16-s5': 'card-slides/D16-s5.png', 'D16-s6': 'card-slides/D16-s6.png', 'D16-s7': 'card-slides/D16-s7.png', 'D16-s8': 'card-slides/D16-s8.png', 'D16-s9': 'card-slides/D16-s9.png', 'D16-s10': 'card-slides/D16-s10.png', 'D16-s11': 'card-slides/D16-s11.png', 'D16-s12': 'card-slides/D16-s12.png',
  'D17': 'card-slides/D17.png', 'D17-s1': 'card-slides/D17-s1.png', 'D17-s2': 'card-slides/D17-s2.png',
  // receipts: the receipt-capturer's MOBILE-VIEW captures (390 css wide x3), one per view
  'C5-sentence': 'receipts/C5-sentence.png', 'C5-header': 'receipts/C5-header.png', 'C6-sentence': 'receipts/C6-sentence.png', 'C6-cover': 'receipts/C6-cover.png', 'C7-title-sentence': 'receipts/C7-title-sentence.png', 'C7-sentence': 'receipts/C7-sentence.png', 'C12-title-date': 'receipts/C12-title-date.png', 'C12-definition': 'receipts/C12-definition.png', 'C9-chart': 'receipts/C9-chart.png', 'C10-headline': 'receipts/C10-headline.png', 'C10-reduced-hiring': 'receipts/C10-reduced-hiring.png',
  // diagrams: the chart-builder's portrait C1 / C2 states (assets/vertical/diagrams/C1.html, C2.html)
  'C1-funnel-outline': 'diagrams/C1-funnel-outline.png', 'C1-funnel-title': 'diagrams/C1-funnel-title.png', 'C1-funnel-letters': 'diagrams/C1-funnel-letters.png', 'C1-funnel-names': 'diagrams/C1-funnel-names.png', 'C1-funnel': 'diagrams/C1-funnel.png', 'C1-funnel-glow': 'diagrams/C1-funnel-glow.png',
  'C1-growth-bracket': 'diagrams/C1-growth-bracket.png', 'C1-growth-tags': 'diagrams/C1-growth-tags.png', 'C1-growth-test': 'diagrams/C1-growth-test.png', 'C1-growth': 'diagrams/C1-growth.png',
  'C1-product-bracket': 'diagrams/C1-product-bracket.png', 'C1-product-overlap': 'diagrams/C1-product-overlap.png', 'C1-product-customer': 'diagrams/C1-product-customer.png', 'C1-product-retention': 'diagrams/C1-product-retention.png', 'C1-product': 'diagrams/C1-product.png',
  'C1-platform-floor': 'diagrams/C1-platform-floor.png', 'C1-platform-customers': 'diagrams/C1-platform-customers.png', 'C1-platform-arrows': 'diagrams/C1-platform-arrows.png', 'C1-platform-pm': 'diagrams/C1-platform-pm.png', 'C1-platform': 'diagrams/C1-platform.png',
  'C1-gtm-lane': 'diagrams/C1-gtm-lane.png', 'C1-gtm': 'diagrams/C1-gtm.png', 'C1-all-base': 'diagrams/C1-all-base.png', 'C1-all': 'diagrams/C1-all.png',
  'C2-empty': 'diagrams/C2-empty.png', 'C2-scope': 'diagrams/C2-scope.png', 'C2-seats': 'diagrams/C2-seats.png', 'C2-then': 'diagrams/C2-then.png', 'C2-now-base': 'diagrams/C2-now-base.png',
  'C2-goal': 'diagrams/C2-goal.png', 'C2-agents': 'diagrams/C2-agents.png', 'C2-now': 'diagrams/C2-now.png', 'C2-dim': 'diagrams/C2-dim.png', 'C2-final': 'diagrams/C2-final.png',
};
const V_CHART: Record<string, React.FC<{ t: number }>> = { C3: C3ChartV, C4: C4ChartV };   // portrait chart components
const vAsset = (key: string) => {
  const p = V_ASSET[key];
  if (!p) throw new Error(`no vertical asset for 16:9 ref "${key}" (add it to V_ASSET in FutureOfSoftwareEngineersVertical.tsx)`);
  return staticFile(p);
};
// transition files the comp mounts (the lean copy of the 16:9 assets/transitions/lib for lib:lightleaks-soft-short-5)
const V_TRANSITION_FILES = ['transitions/lib/leaks/lightleaks-soft-2-rev.mp4', 'transitions/lib/leaks/lightleaks-soft-3.mp4'];
/** the lean public dir check: every V_ASSET path + the spine + the leak plates must be in the bundle's file list */
const verifyPublicDir = () => {
  const files = (typeof window !== 'undefined' ? (window as unknown as { remotion_staticFiles?: { name: string }[] }).remotion_staticFiles : undefined);
  if (!files || !files.length) return;                         // not a bundle (e.g. a server-side import): nothing to check
  const have = new Set(files.map((f) => decodeURIComponent(f.name).replace(/\\/g, '/')));
  const want = ['spine.mp4', ...Object.values(V_ASSET), ...V_TRANSITION_FILES];
  const missing = want.filter((p) => !have.has(p));
  if (missing.length) throw new Error(`vertical public dir (assets/vertical) is missing ${missing.length} asset(s): ${missing.slice(0, 8).join(', ')}`);
};

// =====================================================================================================================
// 6. TRANSITIONS, exactly TRANSITIONS.md section 5 / TRANSITION-PLAN.json (48 rows, ids verbatim from the 16:9), reconciled
//    against the cover edges at module load.
// =====================================================================================================================
const XF = 11;                                                // hand:xfade-scale 0.35 s (0.93 -> 1; charts opacity only, NOTES 1)
const RECEIPT_VIEW_XF = 9;                                    // a view change inside one receipt: quick 0.3 s cross-fade
const FACE_CUTS: { tc: number; id: 'hand:film-burn'; dir: 'in' | 'out' }[] = [
  { tc: 5.355, id: 'hand:film-burn', dir: 'out' },    // 0:05.4 F1 out -> C5
  { tc: 22.555, id: 'hand:film-burn', dir: 'in' },    // 0:22.6 C6 -> F2
  { tc: 25.955, id: 'hand:film-burn', dir: 'out' },   // 0:26.0 F2 out -> D1
  { tc: 123.322, id: 'hand:film-burn', dir: 'in' },   // 2:03.3 D4 -> F3
  { tc: 125.255, id: 'hand:film-burn', dir: 'out' },  // 2:05.3 F3 out -> D5
  { tc: 250.508, id: 'hand:film-burn', dir: 'in' },   // 4:10.5 C1 GROWTH -> F4
  { tc: 256.741, id: 'hand:film-burn', dir: 'out' },  // 4:16.7 F4 out -> D9
  { tc: 289.741, id: 'hand:film-burn', dir: 'in' },   // 4:49.7 D9 -> F5
  { tc: 292.608, id: 'hand:film-burn', dir: 'out' },  // 4:52.6 F5 out -> D11
  { tc: 317.975, id: 'hand:film-burn', dir: 'in' },   // 5:18.0 C1 PLATFORM -> F6
  { tc: 321.908, id: 'hand:film-burn', dir: 'out' },  // 5:21.9 F6 out -> D12
  { tc: 350.481, id: 'hand:film-burn', dir: 'in' },   // 5:50.5 C1 GTM -> F7
  { tc: 353.481, id: 'hand:film-burn', dir: 'out' },  // 5:53.5 F7 out -> C1 ALL
  { tc: 437.348, id: 'hand:film-burn', dir: 'in' },   // 7:17.3 D15 -> F8
  { tc: 442.281, id: 'hand:film-burn', dir: 'out' },  // 7:22.3 F8 out -> D16
  { tc: 460.181, id: 'hand:film-burn', dir: 'in' },   // 7:40.2 D16 -> F9
  { tc: 465.148, id: 'hand:film-burn', dir: 'out' },  // 7:45.1 F9 out -> D17
];
const XFADES: { tc: number; id: 'hand:xfade-scale' }[] = [   // role container-xfade, 27 cover swaps
  10.85, 33.78, 68.14, 77.6, 84.94, 90.49, 107.31, 129.92, 167.38, 180.34, 194.41, 209.72, 221.7, 235.48, 262.89,
  275.03, 281.97, 304.14, 329.58, 339.35, 368.28, 376.29, 381.39, 385.88, 408.31, 418.07, 433.34,
].map((tc) => ({ tc, id: 'hand:xfade-scale' as const }));
// receipt-motion rows (single-scene camera moves fitted to the view, no sound), keyed by the view they wrap; must equal the
// cover table's `mo` (checked below)
const MOTION_IDS: Record<string, string> = {
  'C6-cover': 'motion-3d-pan-1-up',                   // 0:20.0
  'C12-title-date': 'motion-3d-orbit-2-right-down',   // 5:29.6
  'C10-headline': 'motion-3d-pan-2-left',             // 6:58.1
};
// punch-leak row: 'lightleaks-soft-short-5' (2:04.3 F3, peaks ON the join frame, sfx off: the no-SFX ruling)
const LEAK = { id: 'lightleaks-soft-short-5', at: 124.289 };
// TRANSITIONS_WAIVED: melt-rgb-soft-1 — named ONLY in TRANSITIONS.md "Open questions" as the strategist's optional, advised-against
//   marquee for 194.41 if Mike asks; it is not a planned row (TRANSITION-PLAN.json melt budget 0, section 5 has no melt row).

type Block = { ref: string; kind: Kind; tIn: number; tOut: number; rows: Cover[]; entry: 'xfade' | 'cut'; tail: number };
const BLOCKS: Block[] = (() => {
  const out: Block[] = [];
  for (const c of COVERS) {
    const last = out[out.length - 1];
    if (last && last.ref === c.ref && Math.abs(last.tOut - c.tIn) < 0.01) {      // STATE SWAP: same placement
      last.rows.push(c); last.tOut = c.tOut;
      if (c.kind === 'deck') last.kind = 'deck';
      continue;
    }
    const contiguous = !!last && Math.abs(last.tOut - c.tIn) < 0.01;
    if (contiguous) last.tail = XF;                                               // held under the incoming fade
    out.push({ ref: c.ref, kind: c.kind, tIn: c.tIn, tOut: c.tOut, rows: [c], entry: contiguous ? 'xfade' : 'cut', tail: 0 });
  }
  return out;
})();
(() => {   // reconcile to TRANSITIONS.md section 5 + the lookup (throws, so a drift or a missing asset cannot render)
  const near = (a: number, b: number) => Math.abs(a - b) < 0.02;
  const swapEdges = BLOCKS.filter((b) => b.entry === 'xfade').map((b) => b.tIn);
  for (const e of swapEdges) if (!XFADES.some((x) => near(x.tc, e))) throw new Error(`cover swap at ${e}s has no container-xfade row`);
  for (const x of XFADES) if (!swapEdges.some((e) => near(x.tc, e))) throw new Error(`container-xfade ${x.tc}s has no cover swap`);
  const faceEdges = FACE_WINDOWS.flatMap(([a, b]) => [a, b]).filter((t) => t > 0.01);
  for (const e of faceEdges) if (!FACE_CUTS.some((c) => near(c.tc, e))) throw new Error(`face edge ${e}s has no film-burn row`);
  if (FACE_CUTS.length !== faceEdges.length) throw new Error('film-burn rows != face edges');
  for (const b of BLOCKS) if (b.entry === 'cut' && !FACE_WINDOWS.some(([, z]) => near(z, b.tIn))) throw new Error(`cover ${b.ref} at ${b.tIn}s neither swaps nor follows a face`);
  for (const c of COVERS) {
    if (c.mo !== MOTION_IDS[c.state]) throw new Error(`motion id for ${c.state} drifted: ${c.mo} vs ${MOTION_IDS[c.state]}`);
    if (c.kind === 'chart') { if (!V_CHART[c.ref]) throw new Error(`no vertical chart component for ${c.ref}`); continue; }
    vAsset(c.state);                                          // every state row resolves in the table
  }
})();

// =====================================================================================================================
// helpers: easing, portrait camera rects ({x, y, w}, h = w * 16/9 on the 1080x1920 stage)
// =====================================================================================================================
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const ramp = (t: number, at: number, dur: number) => (dur <= 0 ? (t >= at ? 1 : 0) : clamp01((t - at) / dur));
const easeOut = (p: number) => 1 - Math.pow(1 - p, 3);
const easeInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const mix = (a: number, b: number, p: number) => a + (b - a) * p;
type Rect = [number, number, number];                        // x, y, w (stage px); h = w * 16/9
type CamKey = { t: number; r: Rect; e?: 'out' | 'inout' };
const camAt = (keys: CamKey[], t: number): Rect => {
  if (t <= keys[0].t) return keys[0].r;
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1], b = keys[i];
    if (t < b.t) {
      const p0 = (t - a.t) / (b.t - a.t);
      const p = b.e === 'out' ? easeOut(p0) : easeInOut(p0);
      return [mix(a.r[0], b.r[0], p), mix(a.r[1], b.r[1], p), mix(a.r[2], b.r[2], p)];
    }
  }
  return keys[keys.length - 1].r;
};
const shrink = (r: Rect, d: number): Rect => {               // a slow drift inside a camera: the same centre, 1/d wide
  const h = (r[2] * 16) / 9, cx = r[0] + r[2] / 2, cy = r[1] + h / 2, w = r[2] / d;
  return [cx - w / 2, cy - (w * 16) / 18, w];
};
/** The portrait stage box with a camera rect applied: s = 1080 / w, translate(-x s, -y s) scale(s), origin 0 0. */
const Stage: React.FC<{ cam: Rect; bg?: string; children: React.ReactNode }> = ({ cam, bg, children }) => {
  const s = OUT_W / cam[2];
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: bg ?? '#0a0c10' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: OUT_W, height: OUT_H, transformOrigin: '0 0', isolation: 'isolate',
                    transform: `translate(${-cam[0] * s}px, ${-cam[1] * s}px) scale(${s})` }}>
        {children}
      </div>
    </AbsoluteFill>
  );
};
const fullImg = { position: 'absolute', left: 0, top: 0, width: OUT_W, height: OUT_H } as const;

// =====================================================================================================================
// 5. CONTAINERS: the D cards (portrait state PNGs, hard swaps on identical pixels, one point lit at a time, FULL FRAME) +
//    the 16:9's slow push 1.00 -> 1.02 over each placement (never dead still).
// =====================================================================================================================
const stateAt = (b: Block, t: number) => {
  let s = b.rows[0].state;
  for (const r of b.rows) if (t >= r.tIn - 1e-6) s = r.state;
  return s;
};
const CardBlock: React.FC<{ c: Block }> = ({ c }) => {
  const t = useSrcT();
  const push = mix(1, 1.02, easeInOut(ramp(t, c.tIn, c.tOut - c.tIn)));
  return (
    <AbsoluteFill style={{ background: '#0a0c10', overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        <Img src={vAsset(stateAt(c, t))} style={fullImg} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// =====================================================================================================================
// 5 / 7a. SYSTEM-DESIGN DIAGRAMS C1 + C2: the PORTRAIT op programs (assets/vertical/diagrams/C1.vertical.spec.md +
//    C2.vertical.spec.md), the 16:9 op grammar with the frame constants 1080 (width) / 1920 (height): pixel-locked state
//    stills, every swap a spotlight over shared pixels, every hold pushes (C1) or drifts inside its camera (C2).
// =====================================================================================================================
type Op =
  | { k: 'base'; img: string }
  | { k: 'xf'; img: string; at: number; dur: number }
  | { k: 'pulse'; img: string; at: number; up: number; holdTo: number; down: number }
  | { k: 'tb'; img: string; xs: [number, number]; at: number[]; edges: number[] }
  | { k: 'box'; img: string; fade: number; boxes: [number, number, number, number, number][] }
  | { k: 'wipeUp'; img: string; at: number; end: number; y0: number; y1: number };
const STRIP = 0.15, PAD = 4;
const opStart = (o: Op) => (o.k === 'base' ? -Infinity : o.k === 'tb' ? o.at[0] : o.k === 'box' ? o.boxes[0][4] : o.at);
const opFull = (o: Op, t: number) =>     // does this op cover the whole frame at t? (pixel contract: B == A outside a mask)
  o.k === 'base' || (o.k === 'xf' && t >= o.at + o.dur) || (o.k === 'wipeUp' && t >= o.end + 0.05)
  || (o.k === 'tb' && o.xs[0] <= 0 && o.xs[1] >= OUT_W && t >= o.at[o.at.length - 1] + STRIP);
const OpLayer: React.FC<{ o: Op; t: number }> = ({ o, t }) => {
  switch (o.k) {
    case 'base': return <Img src={vAsset(o.img)} style={fullImg} />;
    case 'xf': return <Img src={vAsset(o.img)} style={{ ...fullImg, opacity: ramp(t, o.at, o.dur) }} />;
    case 'pulse': {
      const a = t < o.holdTo ? ramp(t, o.at, o.up) : 1 - ramp(t, o.holdTo, o.down);
      return a > 0 ? <Img src={vAsset(o.img)} style={{ ...fullImg, opacity: a }} /> : null;
    }
    case 'tb': return <>{o.at.map((at, i) => {   // top-to-bottom stepped mask over the x range
      const a = ramp(t, at, STRIP); if (a <= 0) return null;
      const y0 = i ? o.edges[i - 1] : 0, y1 = o.edges[i];
      return <Img key={i} src={vAsset(o.img)} style={{ ...fullImg, opacity: a, clipPath: `inset(${y0}px ${OUT_W - o.xs[1]}px ${OUT_H - y1}px ${o.xs[0]}px)` }} />;
    })}</>;
    case 'box': return <>{o.boxes.map(([x0, y0, x1, y1, at], i) => {
      const a = ramp(t, at, o.fade); if (a <= 0) return null;
      return <Img key={i} src={vAsset(o.img)} style={{ ...fullImg, opacity: a, clipPath: `inset(${y0 - PAD}px ${OUT_W - x1 - PAD}px ${OUT_H - y1 - PAD}px ${x0 - PAD}px)` }} />;
    })}</>;
    case 'wipeUp': {
      if (t < o.at) return null;
      const edge = mix(o.y0, o.y1, easeOut(ramp(t, o.at, o.end - o.at)));
      return <Img src={vAsset(o.img)} style={{ ...fullImg, clipPath: `inset(${edge}px 0px 0px 0px)` }} />;
    }
  }
};
const OpStack: React.FC<{ ops: Op[]; t: number }> = ({ ops, t }) => {
  const live = ops.filter((o) => opStart(o) <= t);
  let from = 0;
  live.forEach((o, i) => { if (opFull(o, t)) from = i; });
  return <>{live.slice(from).map((o, i) => <OpLayer key={from + i} o={o} t={t} />)}</>;
};

// C1 · the AAARRR funnel map, flowing DOWN (portrait spec): one program per placement, same cues as the 16:9
const C1_BOX = 0.15;                                          // portrait spec: box fades at the strips' 0.15 s rhythm
const SLICE_EDGES_V = [632, 756, 880, 1004, 1128, 1920];      // y edges between slices (mid-gap), last = frame bottom
type C1Place = { tIn: number; ops: Op[]; push: [number, number, number] };   // push: cx, cy, to-scale
const C1_PLACES: C1Place[] = [
  { tIn: 194.41, push: [540, 880, 1.03], ops: [   // FUNNEL
    { k: 'base', img: 'C1-funnel-outline' },
    { k: 'xf', img: 'C1-funnel-title', at: 196.46, dur: 0.3 },
    { k: 'tb', img: 'C1-funnel-letters', xs: [0, 1080], at: [197.4, 198.14, 198.34, 198.66, 198.92, 199.18], edges: SLICE_EDGES_V },
    { k: 'tb', img: 'C1-funnel-names', xs: [0, 1080], at: [199.86, 200.32, 201.12, 201.76, 202.34, 202.9], edges: SLICE_EDGES_V },
    { k: 'xf', img: 'C1-funnel', at: 204.0, dur: 0.3 },
  ] },
  { tIn: 235.48, push: [540, 640, 1.03], ops: [   // GROWTH
    { k: 'base', img: 'C1-funnel' },
    { k: 'pulse', img: 'C1-funnel-glow', at: 236.02, up: 0.25, holdTo: 236.8, down: 0.4 },
    { k: 'xf', img: 'C1-growth-bracket', at: 237.8, dur: 0.3 },
    { k: 'box', img: 'C1-growth-tags', fade: C1_BOX, boxes: [
      [72, 362, 288, 404, 239.6], [300, 362, 433, 404, 240.52], [445, 362, 633, 404, 241.18], [645, 362, 815, 404, 241.8],
      [746, 899, 772, 925, 242.8]] },                          // the LIGHT tick on RETENTION
    { k: 'box', img: 'C1-growth-test', fade: C1_BOX, boxes: [
      [72, 418, 411, 460, 243.76], [429, 418, 582, 460, 245.8], [594, 418, 718, 460, 246.42]] },
    { k: 'box', img: 'C1-growth', fade: C1_BOX, boxes: [
      [72, 276, 458, 340, 248.6],                              // OWNS SIGNUPS, SUBSCRIPTIONS, REVENUE
      [707, 1023, 733, 1049, 249.9], [668, 1147, 694, 1173, 249.9]] },   // ticks on REFERRAL + REVENUE
  ] },
  { tIn: 262.89, push: [700, 640, 1.03], ops: [   // PRODUCT (cross-fades only)
    { k: 'base', img: 'C1-product-bracket' },
    { k: 'xf', img: 'C1-product-overlap', at: 263.84, dur: 0.3 },
    { k: 'xf', img: 'C1-product-customer', at: 269.38, dur: 0.3 },
    { k: 'xf', img: 'C1-product-retention', at: 272.02, dur: 0.35 },
    { k: 'xf', img: 'C1-product', at: 272.98, dur: 0.3 },
  ] },
  { tIn: 304.14, push: [540, 1200, 1.03], ops: [  // PLATFORM
    { k: 'base', img: 'C1-platform-floor' },
    { k: 'box', img: 'C1-platform-customers', fade: C1_BOX, boxes: [[72, 1666, 664, 1700, 306.46], [72, 1704, 272, 1738, 307.78]] },
    { k: 'wipeUp', img: 'C1-platform-arrows', at: 310.02, end: 310.52, y0: 1578, y1: 528 },   // the riser + six arrows rise from the floor
    { k: 'xf', img: 'C1-platform-pm', at: 312.98, dur: 0.3 },
    { k: 'box', img: 'C1-platform', fade: C1_BOX, boxes: [[606, 1592, 759, 1626, 316.34], [759, 1592, 916, 1626, 316.5], [916, 1592, 984, 1626, 317.48]] },
  ] },
  { tIn: 339.35, push: [560, 1300, 1.03], ops: [  // GTM
    { k: 'base', img: 'C1-gtm-lane' },
    { k: 'box', img: 'C1-gtm', fade: C1_BOX, boxes: [
      [150, 1394, 500, 1452, 343.4], [150, 1464, 404, 1516, 344.64], [520, 1394, 750, 1452, 348.08], [770, 1394, 988, 1452, 349.52]] },
  ] },
  { tIn: 353.481, push: [540, 960, 1.025], ops: [ // ALL (the finished map, shown once)
    { k: 'base', img: 'C1-all-base' },
    { k: 'xf', img: 'C1-all', at: 359.06, dur: 0.4 },
  ] },
];
for (const p of C1_PLACES) for (const o of p.ops) vAsset(o.img);   // every op image resolves (module load)
// FUNNEL: the comp-drawn customer dot down the funnel's right side + the travelling C1-funnel-glow band spotlight
const DOT_IN = 206.76, DOT_START: [number, number] = [896.7, 472];
const DOT_HOPS: { t: number; x: number; y: number }[] = [
  { t: 207.0, x: 857.9, y: 570 }, { t: 207.45, x: 819.1, y: 694 }, { t: 207.9, x: 780.4, y: 818 },
  { t: 208.35, x: 741.6, y: 942 }, { t: 208.8, x: 702.9, y: 1066 }, { t: 209.25, x: 664.1, y: 1190 },
];
const SLICE_BANDS: [number, number][] = [[512, 628], [636, 752], [760, 876], [884, 1000], [1008, 1124], [1132, 1248]];
const SLICE_CY = [570, 694, 818, 942, 1066, 1190];
const dotXY = (t: number): [number, number] => {
  let prev = { t: DOT_IN, x: DOT_START[0], y: DOT_START[1] };
  for (const h of DOT_HOPS) {
    if (t < h.t) {
      if (t < prev.t) return [prev.x, prev.y];
      const p = easeInOut((t - prev.t) / (h.t - prev.t));
      return [mix(prev.x, h.x, p), mix(prev.y, h.y, p)];
    }
    prev = h;
  }
  return [prev.x, prev.y];
};
const CustomerDot: React.FC<{ t: number }> = ({ t }) => {
  if (t < DOT_IN) return null;
  const a = ramp(t, DOT_IN, 0.2);
  const [x, y] = dotXY(t);
  return (
    <>
      {SLICE_BANDS.map(([y0, y1], i) => {
        const w = clamp01(1 - Math.abs(y - SLICE_CY[i]) / 94) * 0.6 * a;
        if (w <= 0.01) return null;
        return <Img key={i} src={vAsset('C1-funnel-glow')} style={{ ...fullImg, opacity: w, clipPath: `inset(${y0}px 0px ${OUT_H - y1}px 0px)` }} />;
      })}
      <svg width={OUT_W} height={OUT_H} style={{ ...fullImg, overflow: 'visible' }}>
        <circle cx={x} cy={y} r={20} fill="rgba(0,230,138,.35)" opacity={a} />
        <circle cx={x} cy={y} r={9} fill="#e8eaf0" opacity={a} />
      </svg>
    </>
  );
};
// ALL: label rings 1 GROWTH, 2 PRODUCT, 3 PLATFORM, 4 GTM (r 22, 2.5 px #00e68a, glow, label box padded 10; in 0.12 s, out 0.35 s)
const RINGS: [number, number, number, number, number][] = [
  [72, 228, 450, 268, 355.02], [584, 228, 972, 268, 355.32], [96, 1588, 502, 1628, 355.62], [130, 1280, 434, 1320, 355.92],
];
const LabelRings: React.FC<{ t: number }> = ({ t }) => (
  <>{RINGS.map(([x0, y0, x1, y1, at], i) => {
    const a = t < at + 0.12 ? ramp(t, at, 0.12) : 1 - ramp(t, at + 0.12, 0.35);
    if (a <= 0) return null;
    return <div key={i} style={{ position: 'absolute', left: x0 - 10, top: y0 - 10, width: x1 - x0 + 20, height: y1 - y0 + 20, borderRadius: 22,
      border: '2.5px solid #00e68a', boxShadow: '0 0 24px rgba(0,230,138,.5)', boxSizing: 'border-box', opacity: a }} />;
  })}</>
);
const C1Block: React.FC<{ c: Block }> = ({ c }) => {
  const t = useSrcT();
  const place = C1_PLACES.find((p) => Math.abs(p.tIn - c.tIn) < 0.01);
  if (!place) throw new Error(`C1 placement at ${c.tIn}s has no portrait program`);
  const [cx, cy, to] = place.push;
  const s = mix(1, to, easeInOut(ramp(t, c.tIn, c.tOut - c.tIn)));
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: '#0a0c10' }}>
      <div style={{ ...fullImg, transformOrigin: `${cx}px ${cy}px`, transform: `scale(${s})` }}>
        <OpStack ops={place.ops} t={t} />
        {place.tIn === 194.41 && <CustomerDot t={t} />}
        {place.tIn === 353.481 && <LabelRings t={t} />}
      </div>
    </AbsoluteFill>
  );
};

// C2 · the pod, then and now: THEN stacked over NOW (portrait spec), 1080x1920 stills + a gentle camera lean
const C2_BOX = 0.25;                                          // portrait spec: the 16:9 region-box timing
const CAM_TOP: Rect = [25, 0, 1030], CAM_BOTTOM: Rect = [25, 88.9, 1030], CAM_FULL: Rect = [0, 0, 1080];
const C2_OPS: Op[] = [
  { k: 'base', img: 'C2-empty' },
  { k: 'box', img: 'C2-scope', fade: C2_BOX, boxes: [[113, 329, 797, 358, 135.78], [113, 365, 507, 391, 139.32]] },   // caption, then scope line
  { k: 'box', img: 'C2-seats', fade: C2_BOX, boxes: [                         // one seat per spoken role, a person in each
    [113, 417, 385, 547, 144.78], [405, 417, 677, 547, 145.82], [697, 417, 969, 547, 146.84],
    [113, 563, 385, 693, 148.22], [405, 563, 677, 693, 149.84], [697, 563, 969, 693, 150.74]] },
  { k: 'xf', img: 'C2-then', at: 151.6, dur: 0.3 },                           // all six light + 6 SEATS, 6 PEOPLE
  { k: 'xf', img: 'C2-now-base', at: 153.58, dur: 0.4 },                      // the ghost frame draws in as the NOW panel
  { k: 'xf', img: 'C2-goal', at: 158.18, dur: 0.3 },
  { k: 'xf', img: 'C2-agents', at: 159.92, dur: 0.3 },
  { k: 'xf', img: 'C2-now', at: 162.54, dur: 0.3 },
  { k: 'xf', img: 'C2-dim', at: 163.98, dur: 0.8 },                           // old pod dims to .30 + takeaway line 1
  { k: 'xf', img: 'C2-final', at: 165.6, dur: 0.3 },                          // ONE ENGINEER lights + takeaway line 2
];
for (const o of C2_OPS) vAsset(o.img);
// holds drift 1.00 -> 1.015 inside the current camera; moves ease in-out: TOP -> BOTTOM 153.40 -> 154.25, BOTTOM -> FULL 163.98 -> 164.78
const C2_HOLDS: { cam: Rect; a: number; b: number }[] = [
  { cam: CAM_TOP, a: 129.92, b: 153.4 }, { cam: CAM_BOTTOM, a: 154.25, b: 163.98 }, { cam: CAM_FULL, a: 164.78, b: 167.38 },
];
const C2_DRIFT = 1.015;
const c2Cam = (t: number): Rect => {
  for (let i = 0; i < C2_HOLDS.length; i++) {
    const h = C2_HOLDS[i];
    if (t < h.a && i > 0) {
      const prev = C2_HOLDS[i - 1];
      const p = easeInOut(ramp(t, prev.b, h.a - prev.b));
      const r0 = shrink(prev.cam, C2_DRIFT);
      return [mix(r0[0], h.cam[0], p), mix(r0[1], h.cam[1], p), mix(r0[2], h.cam[2], p)];
    }
    if (t < h.b || i === C2_HOLDS.length - 1) return shrink(h.cam, mix(1, C2_DRIFT, easeInOut(ramp(t, h.a, h.b - h.a))));
  }
  return CAM_FULL;
};
const C2Block: React.FC = () => {
  const t = useSrcT();
  return <Stage cam={c2Cam(t)}><OpStack ops={C2_OPS} t={t} /></Stage>;
};

// =====================================================================================================================
// RECEIPTS: the MOBILE-VIEW captures, full frame (1080x1920). Each VIEW = a settling camera program that STOPS before any
// highlight + its [HIGHLIGHT] rows (#ffe14d, wiping left to right over the quoted words, drawn in capture px inside the
// camera, multiply). Highlight rects were located on these portrait captures by ink (word boxes,
// _previews/vertical/qa/work/wordboxes.py; C6 from vertical-receipts-geometry.json sentence_line_rects); same words, same cues
// as the 16:9 EDIT-PLAN rows. The mobile captures run text almost edge to edge (measured ink x 25..1054 on C5 / C6 / C9 / C12),
// so their settles stop at ~1.03 and every settled rect keeps ALL of the capture's ink inside the frame (C7 / C10, narrower
// text, settle to 1.08 / 1.125). The one deliberate crop is C9's push onto the 71% bar (1.64x, the 37% bar left out whole).
// =====================================================================================================================
type HL = { at: number; dur: number; rects: [number, number, number, number][] };
type View = { cam: CamKey[]; hl: HL[] };
const VIEWS: Record<string, View> = {
  // C5 Pichai, Cloud Next '26: 'approved by engineers' on "approve" (5.96)
  'C5-sentence': { cam: [{ t: 5.355, r: [0, 0, 1080] }, { t: 5.92, r: [10, 20, 1048], e: 'out' }],
    hl: [{ at: 5.96, dur: 0.55, rects: [[192, 672, 476, 52]] }] },
  // byline 'CEO of Google and Alphabet' on "CEO" (7.96), date 'Apr 22, 2026' on "April" (9.14)
  'C5-header': { cam: [{ t: 7.06, r: [0, 0, 1080] }, { t: 7.9, r: [16, 50, 1048], e: 'out' }],
    hl: [{ at: 7.96, dur: 0.5, rects: [[40, 1711, 524, 48]] }, { at: 9.14, dur: 0.4, rects: [[39, 1077, 229, 47]] }] },
  // C6 the S-1 'over 90% of the contributions to our codebase in September 2026 were written by Claude.' 13.64 -> 19.4
  'C6-sentence': { cam: [{ t: 10.85, r: [0, 0, 1080] }, { t: 13.4, r: [16, 40, 1048], e: 'out' }],
    hl: [{ at: 13.64, dur: 5.76, rects: [[273, 765, 171, 47], [444, 765, 486, 47], [100, 824, 812, 47], [100, 882, 137, 47]] }] },
  'C6-cover': { cam: [{ t: 20.04, r: [0, 0, 1080] }], hl: [] },                      // lib:motion-3d-pan-1-up
  // C7 the essay: a 1.4 s establishing push toward the intro, then the tight view: 'We are not there yet' (86.88 -> 88.08)
  'C7-title-sentence': { cam: [{ t: 84.94, r: [0, 0, 1080] }, { t: 86.3, r: [40, 64, 1000] }], hl: [] },
  'C7-sentence': { cam: [{ t: 86.3, r: [0, 0, 1080] }, { t: 86.85, r: [57, 100, 960], e: 'out' }],
    hl: [{ at: 86.88, dur: 1.2, rects: [[806, 882, 151, 52], [84, 950, 283, 52]] }] },
  'C12-title-date': { cam: [{ t: 329.58, r: [0, 0, 1080] }], hl: [] },               // lib:motion-3d-orbit-2-right-down
  // C12 Clay's definition, 'building automated revenue systems using AI, data enrichment, and workflow automation' 333.84 -> 338.60
  'C12-definition': { cam: [{ t: 332.94, r: [0, 0, 1080] }, { t: 333.8, r: [16, 0, 1048], e: 'out' }],
    hl: [{ at: 333.84, dur: 4.76, rects: [[166, 362, 577, 51], [164, 434, 707, 51], [165, 506, 533, 51]] }] },
  // C9 Indeed's own chart, never restyled: full view, then the push heads for the Senior roles 71% bar from "71%" (378.50)
  // (VISUAL-QA comp note: the senior bar sits in the LOWER half of the portrait capture, x 240-472, y 1270-1600; the frame's right
  // edge 660 stops short of the 37% bar at x 672, so no bar is cut in half)
  'C9-chart': { cam: [{ t: 376.29, r: [0, 0, 1080] }, { t: 378.5, r: [15, 18, 1048] }, { t: 379.8, r: [0, 746, 660] }], hl: [] },
  'C10-headline': { cam: [{ t: 418.07, r: [0, 0, 1080] }], hl: [] },                 // lib:motion-3d-pan-2-left
  // C10 the six facts: Fact 2 'about 19% below' on "19" (424.94), then a lean onto Fact 4 'reduced hiring of young workers'
  // from "mostly" (431.12) to "hired" (432.72); each camera move ends before its highlight starts
  'C10-reduced-hiring': { cam: [{ t: 422.08, r: [0, 0, 1080] }, { t: 422.9, r: [34, 40, 1000], e: 'out' },
    { t: 430.2, r: [34, 40, 1000] }, { t: 431.05, r: [34, 100, 1000] }],
    hl: [{ at: 424.94, dur: 0.6, rects: [[290, 700, 359, 42]] }, { at: 431.12, dur: 1.6, rects: [[503, 1448, 492, 50], [142, 1509, 171, 50]] }] },
};
for (const [k, v] of Object.entries(VIEWS)) {               // every camera rect stays inside the capture (no page edge shows)
  vAsset(k);
  for (const c of v.cam) if (c.r[0] < 0 || c.r[1] < 0 || c.r[0] + c.r[2] > OUT_W + 0.01 || c.r[1] + (c.r[2] * 16) / 9 > OUT_H + 0.01) throw new Error(`receipt camera for ${k} at ${c.t}s leaves the capture`);
}
const Highlights: React.FC<{ hl: HL[]; t: number }> = ({ hl, t }) => (
  <>{hl.map((h, i) => {
    const total = h.rects.reduce((s, r) => s + r[2], 0);
    let done = easeInOut(ramp(t, h.at, h.dur)) * total;
    if (done <= 0) return null;
    return h.rects.map((r, j) => {
      const w = Math.max(0, Math.min(r[2], done));
      done -= r[2];
      if (w <= 0) return null;
      return <div key={`${i}-${j}`} style={{ position: 'absolute', left: r[0], top: r[1], width: w, height: r[3], background: '#ffe14d', mixBlendMode: 'multiply', borderRadius: 3 }} />;
    });
  })}</>
);
const ReceiptStage: React.FC<{ state: string; t: number }> = ({ state, t }) => {
  const v = VIEWS[state];
  return (
    <Stage cam={camAt(v.cam, t)} bg="#fff">
      <Img src={vAsset(state)} style={fullImg} />
      <Highlights hl={v.hl} t={t} />
    </Stage>
  );
};
/** The SCENE a Motion3D move is handed, PRE-FRAMED for that move IN THE PORTRAIT FRAME (the 16:9 lesson: the engine
 * wrap-tiles its scene 3x3 and its 3D pose swings it, so a full-frame capture shows wrapped copies and cuts the object).
 * Each scene is the planned OBJECT (the capture's own crop, unaltered pixels) on its page colour, placed in the largest box
 * that stays on screen for the whole fitted run with no wrapped copy on screen: solved with a portrait model of the
 * engine's transform chain (_previews/vertical/qa/work/motion_portrait.py + motion_fit.py; margins printed in the report). */
type MotionScene = { bg: string; crop: [number, number, number, number]; box: [number, number, number, number]; wrapX?: boolean };
const MOTION_SCENES: Record<string, MotionScene> = {
  // the S-1 cover page (the sec.gov URL line + the page) on its own gray, pan up: margin 44 px, 0 wrapped-copy samples
  'C6-cover': { bg: 'rgb(228,228,228)', crop: [30, 340, 1050, 1590], box: [217, 764, 863, 1556] },
  // the Clay post: mark + nav, the title, authors, category + 'Apr 21, 2026' (no hero art), orbit right-down
  'C12-title-date': { bg: '#fff', crop: [20, 10, 1060, 990], box: [359, 759, 721, 1101] },
  // the Stanford block: lab + date line, the WHOLE headline, the tags and the "Canaries" line on the page maroon, pan left;
  // the box crosses the tile seam (x 1080), so the block is drawn twice and the wrap stitches it
  'C10-headline': { bg: 'rgb(64,20,21)', crop: [40, 390, 1040, 1540], box: [618, 359, 1212, 1041], wrapX: true },
};
const MotionSceneEl: React.FC<{ state: string }> = ({ state }) => {
  const m = MOTION_SCENES[state];
  const [cx0, cy0, cx1, cy1] = m.crop, [bx0, by0, bx1] = m.box;
  const s = (bx1 - bx0) / (cx1 - cx0);
  const block = (dx: number) => (
    <div key={dx} style={{ position: 'absolute', left: bx0 + dx, top: by0, width: (cx1 - cx0) * s, height: (cy1 - cy0) * s, overflow: 'hidden' }}>
      <Img src={vAsset(state)} style={{ position: 'absolute', left: -cx0 * s, top: -cy0 * s, width: OUT_W * s, height: OUT_H * s }} />
    </div>
  );
  return (
    <AbsoluteFill style={{ background: m.bg, overflow: 'hidden' }}>
      {block(0)}
      {m.wrapX && block(-OUT_W)}
    </AbsoluteFill>
  );
};
/** [MOTION] lib:motion-3d-*: the library Motion3D engine wraps the receipt for its whole view; its 5 s move is fitted to
 * the view (engine frame = view frame * 5 / view seconds), clock set with a Freeze inside a zero-offset Sequence
 * (comp-build.md section 6 MOTION + 6a Freeze trap). The engine reads the 1080x1920 video config. No sound. */
const MotionView: React.FC<{ row: Cover; t: number }> = ({ row, t }) => {
  const lib = getTransition(row.mo!);
  if (!lib) throw new Error(`unknown motion id ${row.mo}`);
  if (!MOTION_SCENES[row.state]) throw new Error(`motion view ${row.state} has no pre-framed portrait scene`);
  const Engine = ENGINES[lib.engine] as React.FC<any>;
  const engFrames = Math.round(lib.durationSeconds * FPS);
  const slot = row.tOut - row.tIn;
  const ef = Math.max(0, Math.min(engFrames, Math.round(((t - row.tIn) / slot) * engFrames)));
  return (
    <Sequence from={0} layout="none">
      <Freeze frame={ef}>
        <Engine from={null} to={null} outClip={() => <MotionSceneEl state={row.state} />} durationInFrames={engFrames} params={lib.params} />
      </Freeze>
    </Sequence>
  );
};
const ReceiptBlock: React.FC<{ c: Block }> = ({ c }) => {
  const t = useSrcT();
  const started = c.rows.filter((r, i) => i === 0 || t >= r.tIn);
  let from = 0;
  started.forEach((r, i) => { if (i === 0 || t >= r.tIn + RECEIPT_VIEW_XF / FPS) from = i; });
  return (
    <AbsoluteFill style={{ background: '#fff' }}>
      {started.slice(from).map((r, i) => {
        const a = from + i === 0 ? 1 : ramp(t, r.tIn, RECEIPT_VIEW_XF / FPS);
        return (
          <AbsoluteFill key={r.state} style={{ opacity: a }}>
            {r.mo ? <MotionView row={r} t={t} /> : <ReceiptStage state={r.state} t={t} />}
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

// =====================================================================================================================
// the COVER element per placement (the two animated charts are LIVE portrait components, never a PNG)
// =====================================================================================================================
const CoverEl: React.FC<{ c: Block }> = ({ c }) => {
  const t = useSrcT();
  if (c.ref === 'C3') return <C3ChartV t={t} />;                // CHART(anim) 1, portrait useCurrentFrame component
  if (c.ref === 'C4') return <C4ChartV t={t} />;                // CHART(anim) 2, portrait useCurrentFrame component
  if (c.ref === 'C1') return <C1Block c={c} />;                 // CHART(sysdesign) 1, portrait op programs
  if (c.ref === 'C2') return <C2Block />;                       // CHART(sysdesign) 2, portrait camera + spotlight
  if (c.kind === 'receipt') return <ReceiptBlock c={c} />;
  return <CardBlock c={c} />;
};
/** hand:xfade-scale ingress (container-xfade 0.35 s, 0.93 -> 1). The two SVG-text charts fade in OPACITY ONLY
 * (assets/vertical/NOTES.md item 1: a scale on this wrapper locked their text layout off the gridlines per render session).
 * A placement that follows a face-out enters at full opacity under the film burn, so the black spine never shows. */
const Placement: React.FC<{ c: Block }> = ({ c }) => {
  const local = useCurrentFrame();
  if (c.entry === 'cut') return <CoverEl c={c} />;
  const p = easeOut(clamp01(local / XF));
  if (c.kind === 'chart') return <AbsoluteFill style={{ opacity: p }}><CoverEl c={c} /></AbsoluteFill>;
  return (
    <AbsoluteFill style={{ opacity: p, transform: `scale(${mix(0.93, 1, p)})` }}>
      <CoverEl c={c} />
    </AbsoluteFill>
  );
};

// =====================================================================================================================
// FACE cut in / out = hand:film-burn (the video's ONE face pick): a warm radial flash peaking ON the cut, 0.38 s each side,
// silent, drawn over everything (no captions in this video).
// =====================================================================================================================
const BURN_HALF = 0.38 * FPS;
const FilmBurn: React.FC<{ cut: number; dir: 'in' | 'out' }> = ({ cut, dir }) => {
  const abs = useAbs();
  const x = (abs - cut) / BURN_HALF;
  if (Math.abs(x) >= 1) return null;
  const env = Math.pow(Math.cos((x * Math.PI) / 2), 2);
  const sweep = (x + 1) / 2;                                    // the burn travels across the frame as it flashes
  const cx = dir === 'out' ? mix(22, 70, sweep) : mix(78, 30, sweep);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: 0.82 * env,
        background: `radial-gradient(ellipse 95% 75% at ${cx}% 45%, rgba(255,206,140,0.95) 0%, rgba(255,138,48,0.78) 28%, rgba(196,58,12,0.38) 58%, rgba(0,0,0,0) 86%)` }} />
      <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: 0.55 * env * env,
        background: `radial-gradient(circle at ${100 - cx}% 72%, rgba(255,238,205,0.9) 0%, rgba(255,168,88,0.35) 26%, rgba(0,0,0,0) 52%)` }} />
    </AbsoluteFill>
  );
};

// [LIGHTLEAK] lib:lightleaks-soft-short-5 on the F3 join: a Sequence of EXACTLY the engine window, cutFrame = win/2, the
// continuous spine (cropped + punched, muted) as A and B; the engine swaps at window frame 5 == the punch frame.
const LEAK_ROW = getTransition(LEAK.id);
const LEAK_WIN = LEAK_ROW ? Math.round(LEAK_ROW.durationSeconds * FPS) : 12;
const LEAK_FROM = PUNCHES[0].frame - 5;

// =====================================================================================================================
// the composition (1080x1920, fps 30, DUR = the 16:9's 14322 frames; Root.tsx)
// =====================================================================================================================
export const FutureOfSoftwareEngineersVertical: React.FC = () => {
  const frame = useCurrentFrame();
  useMemo(verifyPublicDir, []);
  return (
    <AbsClock.Provider value={frame}>
      <AbsoluteFill style={{ background: '#000' }}>
        {/* the spine: gated face cropped tall at the measured position, COVER spans black, its own VO = the only audio */}
        <SpineView audio />

        {/* F3 punch-in join: library light leak over the cropped spine */}
        <Sequence from={LEAK_FROM} durationInFrames={LEAK_WIN} name="punch-leak lightleaks-soft-short-5">
          <TransitionClip id="lightleaks-soft-short-5" cutFrame={Math.round(LEAK_WIN / 2)} sfx={false}
            outgoing={() => <SpineView />} incoming={() => <SpineView />} />
        </Sequence>

        {/* the COVER track: one Sequence per placement; held XF frames under the next cover's fade-in */}
        {BLOCKS.map((c, i) => {
          const lead = EDGE_LEAD[String(c.tIn)] ?? 0;
          const end = i === BLOCKS.length - 1 ? DUR : F(c.tOut) + c.tail;   // the END CARD holds to the very last frame
          return (
            <Sequence key={i} from={F(c.tIn) - lead} durationInFrames={end - F(c.tIn) + lead} name={`${c.ref} ${c.rows[0].state}`}>
              <Placement c={c} />
            </Sequence>
          );
        })}

        {/* FACE cut in / out: hand:film-burn on all 17 face edges */}
        {FACE_CUTS.map((fc) => (
          <Sequence key={fc.tc} from={F(fc.tc) - Math.ceil(BURN_HALF)} durationInFrames={2 * Math.ceil(BURN_HALF) + 1} name={`film-burn ${fc.dir} ${fc.tc}`}>
            <FilmBurn cut={F(fc.tc)} dir={fc.dir} />
          </Sequence>
        ))}
      </AbsoluteFill>
    </AbsClock.Provider>
  );
};

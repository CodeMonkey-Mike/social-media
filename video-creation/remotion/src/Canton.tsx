// Canton.tsx: longform-edited "What Is Canton?" (media/canton), built TO the approved blueprint (EDIT-PLAN.md event log,
// CUE-SHEET.md, TRANSITIONS.md section 5 + TRANSITION-PLAN.json, COVER-PLAN.json, AS-RECORDED.md, PROJECT-LOG.md Open flags).
// Structure = comp-build.md (self-contained skeletons only, no other project's comp opened or imported):
//   section 2/3d the time map (card pauses + two spliced clip inserts, the sidecar spine/ALL.h.paused.json is the table)
//   section 3a + 4c-mixed the measured face reframe, gated OFF inside the four screen shares (identity there)
//   section 4 / 4b / 4c the cover track, the four whiteboard beats, the screen-share deck-area bodies
//   section 6 / 6a the three transition buckets, every engine window exact, every face-side still a real Freeze
//   section 7 the C6 animated chart (CantonCharts.tsx), section 8 captions (FACE windows only, Montserrat house style)
//   section 9: NO music, NO SFX, NO watermark here (ffmpeg post-mix owns the audio; the comp carries the spine VO only).
// FACE MODE = mixed (GRAPH-PROGRESS settings.face_mode): gated faces F1 F3 F5 F8 (reframe, captions, the F8 punch-ins
// + library leaks) and verbatim OBS screen shares F2 F4 F6 F7 (identity, deck area x 0-1464 painted, no captions).
// Face style = the house default (leak): cut-ins and cut-outs take the face pick hand:film-burn on all 15 edges.
import React from 'react';
import { AbsoluteFill, Easing, Freeze, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { slide } from '@remotion/transitions/slide';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadDMSans } from '@remotion/google-fonts/DMSans';
import { TransitionClip } from './transitions/TransitionClip';
import { ENGINES, getTransition } from './transitions';
import { CAPTION_WINDOWS, ZCAPTIONS } from './CantonCaptions';
import { ClockCtx, FrozenClock, ReceiptView, clamp01, easeOut, useClock } from './CantonKit';
import { C6Chart } from './CantonCharts';

const { fontFamily: MONTSERRAT } = loadMontserrat('normal', { weights: ['900'], subsets: ['latin'] });
const { fontFamily: DMSANS } = loadDMSans('normal', { weights: ['500', '700'], subsets: ['latin'] });

// ============================================================================================================
// 1. TIME MAP (comp-build.md sections 2 + 3d). Every cue below is a SOURCE-spine second (spine/ALL.f.enhanced.mp4,
//    278.333 s) and reaches the paused spine (assets/spine.mp4 = spine/ALL.h.paused.mp4) only through sh() / F().
// ============================================================================================================
export const FPS = 30;
export const PAUSE = 1.5;                                  // the title-card pause (sidecar pause_s)
export const SPINE_SECS = 278.333;                         // the SOURCE spine
export const CARD_T = [40.51, 129.68, 167.155];            // sidecar pauses[] card rows (trough-snapped)
// every pause of the sidecar, cards = pause_s, clip inserts = the clip length (their voice is in the VO track):
export const INSERTS = [
  { at: 40.51, dur: 1.5 },
  { at: 48.185, dur: 11.2 },
  { at: 129.68, dur: 1.5 },
  { at: 167.155, dur: 1.5 },
  { at: 206.835, dur: 11.5 },
];
export const sh = (t: number) => t + INSERTS.reduce((s, p) => (p.at <= t ? s + p.dur : s), 0);
// MEASURED (2026-11-10, comp-builder): the baked spine's PICTURE runs late of sh() by 1 frame from the 129.68 card and
// by 2 frames from the CLIP-3 splice (bake rounding: face frames matched source vs paused, zero-diff at lag 0 / +1 / +2;
// the VO track sits within 25 ms of the same map). F() carries the correction so every cut, punch and caption lands on
// the frame the spine actually shows; sh() itself is untouched (the mixer and the gates read the sidecar map).
const PIC_LAG: [number, number][] = [[129.68, 1], [206.835, 2]];
const lagF = (t: number, strict = false) => PIC_LAG.reduce((l, [a, n]) => ((strict ? a < t : a <= t) ? n : l), 0);
export const F = (t: number) => Math.round(sh(t) * FPS) + lagF(t);                 // source s -> frame (after a pause AT t)
const Fpre = (t: number) =>                                                           // source s -> frame (before a pause AT t)
  Math.round((t + INSERTS.reduce((s, p) => (p.at < t ? s + p.dur : s), 0)) * FPS) + lagF(t, true);
const pauseAt = (t: number) => INSERTS.find((p) => Math.abs(p.at - t) < 1e-6);
const Fend = (t: number) => (pauseAt(t) ? Fpre(t) : F(t));                           // a row ending AT a pause ends before it
export const DUR = 9168;                                   // = the paused spine's 9168 frames (ffprobe nb_frames)
if (F(SPINE_SECS) !== DUR) throw new Error(`Canton: F(SPINE_SECS)=${F(SPINE_SECS)} != DUR ${DUR}`);

// ============================================================================================================
// 2. FACE REFRAME (section 3a, measured by scripts/measure_face_reframe.py, never hand-tuned) + MIXED gating (4c-mixed)
// ============================================================================================================
export const FACE_REFRAME = { scale: 1.45, x: -747, y: -339 };            // assets/face-reframe.json
const FACE_POINT = { x: 960, y: 432 };                                       // json face_point_out: punch-ins scale about it
export const SCREENSHARE_WINDOWS: [number, number][] = [[29.833, 38.467], [136.6, 140.667], [179.867, 189.2], [241.367, 248.933]];
const inShare = (f: number) => SCREENSHARE_WINDOWS.some(([a, b]) => f >= F(a) && f < F(b));
const REFRAME_CSS = `translate(${FACE_REFRAME.x}px, ${FACE_REFRAME.y}px) scale(${FACE_REFRAME.scale})`;
const spineTransform = (f: number) => (inShare(f) ? 'none' : REFRAME_CSS);

// COVER-PLAN visible_windows (the kinds stamped by scripts/window_kinds.py)
type Vis = { n: number; a: number; b: number; kind: 'face' | 'screenshare' };
const VIS: Vis[] = [
  { n: 1, a: 0.0, b: 6.133, kind: 'face' },
  { n: 2, a: 29.833, b: 38.467, kind: 'screenshare' },
  { n: 3, a: 100.2, b: 102.867, kind: 'face' },
  { n: 4, a: 136.6, b: 140.667, kind: 'screenshare' },
  { n: 5, a: 159.933, b: 167.1, kind: 'face' },
  { n: 6, a: 179.867, b: 189.2, kind: 'screenshare' },
  { n: 7, a: 241.367, b: 248.933, kind: 'screenshare' },
  { n: 8, a: 260.867, b: 269.1, kind: 'face' },
];
const visAt = (f: number) => VIS.find((w) => f >= F(w.a) && f < F(w.b));

// PUNCH-INS (overlays.md section 1): ON the desilencer joins of spine/jumpcuts-final.json, FACE windows only. F8 is the
// only face with interior joins (F1 none, F3 102.700 and F5 166.800 sit in the 0.5 s edge margin; screen shares never).
// Step IN on 265.100, step BACK to the base frame on 268.600 (alternate, never compound); each carries its punch-leak.
const PUNCHES = [
  { at: 265.1, scale: 1.18, leak: 'lightleaks-soft-2' },        // TRANSITIONS 4:25.1 punch-leak lib:lightleaks-soft-2
  { at: 268.6, scale: 1.0, leak: 'lightleaks-soft-short-8' },   // TRANSITIONS 4:28.6 punch-leak lib:lightleaks-soft-short-8
];
const punchAt = (f: number) => {
  const w = visAt(f);
  if (!w || w.kind !== 'face') return 1;
  let s = 1;
  for (const p of PUNCHES) if (p.at >= w.a && p.at < w.b && f >= F(p.at)) s = p.scale;
  return s;
};

// ============================================================================================================
// 3. COVER TRACK (section 4): one row per state / sub-point, straight from the EDIT-PLAN event log (SOURCE seconds).
//    Consecutive same-ref rows are STATE SWAPS: the ingress fires on the run's FIRST row only (built in RUNS below).
//    kinds: receipt (a capture, its camera + highlights in CantonKit RECEIPT_FX[fx]) · container (a card-slides / C3
//    diagram state PNG, spotlighted one state at a time) · deck (C1, THE system-design diagram, shown ONCE, its
//    spotlights on C1_SPOTS) · chart (C6, live) · whiteboard (assets/whiteboard/<WB>.mp4 from `from` s) · clipstill
//    (a clip insert's first / last frame held under the set-up / resume line, section 3d).
// ============================================================================================================
type Kind = 'receipt' | 'container' | 'deck' | 'chart' | 'whiteboard' | 'clipstill';
export type Cover = {
  tIn: number; tOut: number; kind: Kind; ref: string;
  state?: string; img?: string; fx?: string; from?: number; frame?: 'first' | 'last'; mo?: string; enter?: 'cut' | 'spin';
};
// DIAGRAM_REFS: C1
// (end declared refs)
export const COVERS: Cover[] = [
  // ---- CH1 THE OPEN (F1 face 0.000-6.133 opens the video; no cut-in) ----
  { tIn: 6.133, tOut: 8.08, kind: 'receipt', ref: 'C9', img: 'C9-canton-homepage-hero', fx: 'C9', state: 'push' },
  { tIn: 8.08, tOut: 8.46, kind: 'container', ref: 'K1', state: 'rest' },
  { tIn: 8.46, tOut: 12.18, kind: 'container', ref: 'K1', state: 's1' },
  { tIn: 12.18, tOut: 14.46, kind: 'container', ref: 'K1', state: 's2' },
  { tIn: 14.46, tOut: 18.46, kind: 'container', ref: 'K1', state: 's3' },
  { tIn: 18.46, tOut: 19.84, kind: 'container', ref: 'K1', state: 's4' },
  { tIn: 19.84, tOut: 24.42, kind: 'receipt', ref: 'C14', img: 'C14-headline', fx: 'C14h', state: 's1' },
  { tIn: 24.42, tOut: 28.16, kind: 'receipt', ref: 'C14', img: 'C14-headline', fx: 'C14h', state: 's2' },
  { tIn: 28.16, tOut: 29.833, kind: 'receipt', ref: 'C14', img: 'C14-headline', fx: 'C14h', state: 's3' },
  // F2 SCREEN SHARE 29.833-38.467: body FB1 (C14 paragraph strip, a face_body row)
  { tIn: 38.467, tOut: 40.43, kind: 'receipt', ref: 'C14', img: 'C14-paragraph', fx: 'C14p', state: 's4' },
  // ---- CH2 WHAT IT DOES (T2 card at the 40.51 pause) ----
  { tIn: 40.43, tOut: 42.44, kind: 'container', ref: 'K2', state: 'rest' },
  { tIn: 42.44, tOut: 44.28, kind: 'container', ref: 'K2', state: 's1' },
  { tIn: 44.28, tOut: 46.14, kind: 'container', ref: 'K2', state: 's2' },
  { tIn: 46.14, tOut: 48.185, kind: 'clipstill', ref: 'CLIP-2-leadin', frame: 'first' },
  // CLIP-2 spliced at 48.185 (11.2 s, Saraniecki's own voice), played full-frame + muted in the insert layer
  { tIn: 48.185, tOut: 48.36, kind: 'clipstill', ref: 'CLIP-2-leadout', frame: 'last' },
  { tIn: 48.36, tOut: 64.22, kind: 'whiteboard', ref: 'WB1', from: 0 },
  { tIn: 64.22, tOut: 83.58, kind: 'whiteboard', ref: 'WB2', from: 0, enter: 'cut' },
  { tIn: 83.58, tOut: 85.6, kind: 'receipt', ref: 'C10', img: 'C10-global-synchronizer-headline', fx: 'C10', state: 'atomic' },
  { tIn: 85.6, tOut: 100.2, kind: 'whiteboard', ref: 'WB3', from: 0 },
  // F3 face 100.2-102.867
  { tIn: 102.867, tOut: 107.3, kind: 'container', ref: 'K6', state: 'rest' },
  { tIn: 107.3, tOut: 109.58, kind: 'container', ref: 'K6', state: 's1' },
  { tIn: 109.58, tOut: 114.52, kind: 'container', ref: 'K6', state: 's2' },
  { tIn: 114.52, tOut: 117.62, kind: 'container', ref: 'K6', state: 's3' },
  { tIn: 117.62, tOut: 121.62, kind: 'container', ref: 'K6', state: 's4' },
  { tIn: 121.62, tOut: 127.58, kind: 'container', ref: 'K6', state: 's5' },
  { tIn: 127.58, tOut: 129.68, kind: 'container', ref: 'K6', state: 's6' },
  // ---- CH3 CANTON VS QUANT (T3 card at the 129.68 pause) ----
  { tIn: 129.68, tOut: 133.56, kind: 'container', ref: 'C3', state: 's0-columns' },
  { tIn: 133.56, tOut: 136.6, kind: 'container', ref: 'C3', state: 's1-header' },
  // F4 SCREEN SHARE 136.6-140.667: body FB2 (C21 hero, then the claim crop)
  { tIn: 140.667, tOut: 142.36, kind: 'container', ref: 'C3', state: 's1-header' },
  { tIn: 142.36, tOut: 143.42, kind: 'container', ref: 'C3', state: 's2a-connects' },
  { tIn: 143.42, tOut: 146.9, kind: 'container', ref: 'C3', state: 's2b-overledger' },
  { tIn: 146.9, tOut: 147.86, kind: 'container', ref: 'C3', state: 's2c-fusion' },
  { tIn: 147.86, tOut: 148.56, kind: 'container', ref: 'C3', state: 's2d-company' },
  { tIn: 148.56, tOut: 149.94, kind: 'container', ref: 'C3', state: 's2e-qnt' },
  { tIn: 149.94, tOut: 151.6, kind: 'container', ref: 'C3', state: 's3-canton' },
  { tIn: 151.6, tOut: 159.933, kind: 'deck', ref: 'C1', state: 'spotlit', enter: 'spin' },
  // F5 face 159.933-167.1 (the locked verdict)
  // ---- CH4 WHO USES IT AND THE TOKEN (T4 card at the 167.155 pause) ----
  { tIn: 167.1, tOut: 173.74, kind: 'receipt', ref: 'C15', img: 'C15-dlr-hero-stats-WAYBACK-2026-07-03', fx: 'C15a', state: 's1', mo: 'motion-3d-pan-1-up' },
  { tIn: 173.74, tOut: 176.1, kind: 'receipt', ref: 'C15', img: 'C15-dlr-built-on-canton', fx: 'C15b', state: 's2' },
  { tIn: 176.1, tOut: 179.867, kind: 'receipt', ref: 'C15', img: 'C15-dlr-hero-stats-WAYBACK-2026-07-03', fx: 'C15c', state: 's3' },
  // F6 SCREEN SHARE 179.867-189.2: body FB3 (C12 Super Validator list)
  { tIn: 189.2, tOut: 191.56, kind: 'container', ref: 'K3', state: 'rest' },
  { tIn: 191.56, tOut: 192.48, kind: 'container', ref: 'K3', state: 's1' },
  { tIn: 192.48, tOut: 194.12, kind: 'container', ref: 'K3', state: 's2' },
  { tIn: 194.12, tOut: 197.28, kind: 'container', ref: 'K3', state: 's3' },
  { tIn: 197.28, tOut: 200.34, kind: 'receipt', ref: 'C19', img: 'C19-mica-whitepaper-p9', fx: 'C19', state: 'sentence', mo: 'motion-3d-pan-2-left' },
  { tIn: 200.34, tOut: 200.6, kind: 'container', ref: 'K4', state: 'rest' },
  { tIn: 200.6, tOut: 202.52, kind: 'container', ref: 'K4', state: 's1' },
  { tIn: 202.52, tOut: 203.9, kind: 'container', ref: 'K4', state: 's2' },
  { tIn: 203.9, tOut: 206.835, kind: 'clipstill', ref: 'CLIP-3-leadin', frame: 'first' },
  // CLIP-3 spliced at 206.835 (11.5 s, Rooz's own voice), played full-frame + muted in the insert layer
  { tIn: 206.835, tOut: 208.3, kind: 'clipstill', ref: 'CLIP-3-leadout', frame: 'last' },
  { tIn: 208.3, tOut: 210.94, kind: 'container', ref: 'K3', state: 's4' },
  { tIn: 210.94, tOut: 211.5, kind: 'container', ref: 'K3', state: 's5' },
  { tIn: 211.5, tOut: 233.4, kind: 'whiteboard', ref: 'WB4', from: 0 },
  { tIn: 233.4, tOut: 238.18, kind: 'receipt', ref: 'C18', img: 'C18-sec-no-action-canton-coin', fx: 'C18', state: 's1' },
  { tIn: 238.18, tOut: 241.367, kind: 'receipt', ref: 'C18', img: 'C18-sec-no-action-canton-coin', fx: 'C18', state: 's2' },
  // F7 SCREEN SHARE 241.367-248.933: body FB4 (the C6 animated chart)
  { tIn: 248.933, tOut: 252.0, kind: 'receipt', ref: 'C22', img: 'C22-cmc-canton-live', fx: 'C22', state: 'push' },
  { tIn: 252.0, tOut: 252.48, kind: 'container', ref: 'C7', state: 'rest' },
  { tIn: 252.48, tOut: 254.46, kind: 'container', ref: 'C7', state: 's1' },
  // ---- CH5 THE CLOSE (no card) ----
  { tIn: 254.46, tOut: 256.94, kind: 'container', ref: 'K5', state: 'rest' },
  { tIn: 256.94, tOut: 258.1, kind: 'container', ref: 'K5', state: 's1' },
  { tIn: 258.1, tOut: 259.26, kind: 'container', ref: 'K5', state: 's2' },
  { tIn: 259.26, tOut: 260.867, kind: 'container', ref: 'K5', state: 's3' },
  // F8 face 260.867-269.1 (punch in 265.1, back 268.6)
  { tIn: 269.1, tOut: 271.02, kind: 'container', ref: 'K5', state: 's4' },
  { tIn: 271.02, tOut: 278.333, kind: 'container', ref: 'K5', state: 's5' },
];

// SCREEN-SHARE BODIES (section 4c, COVER-PLAN face_body FB1-FB4): the deck area painted during the SCREENSHARE windows.
export const DECK_AREA = { x: 0, y: 0, w: 1464, h: 1080 };   // the binance / quant OBS geometry (house rule #1b)
const DECK_SCALE = DECK_AREA.w / 1920;                        // 0.7625
const PAGE_BG = '#030206';                                     // the canton container page colour (dark + canton accent)
export const FACE_BODY: Cover[] = [
  { tIn: 29.833, tOut: 38.467, kind: 'receipt', ref: 'C14', img: 'C14-paragraph', fx: 'C14p', state: 'FB1' },
  { tIn: 136.6, tOut: 138.0, kind: 'receipt', ref: 'C21', img: 'C21-quant-flow-hero', fx: 'C21h', state: 'FB2-hero' },
  { tIn: 138.0, tOut: 140.667, kind: 'receipt', ref: 'C21', img: 'C21-quant-flow-no-new-network', fx: 'C21n', state: 'FB2-claim' },
  { tIn: 179.867, tOut: 189.2, kind: 'receipt', ref: 'C12', img: 'C12-super-validators-list', fx: 'C12', state: 'FB3' },
  { tIn: 241.367, tOut: 248.933, kind: 'chart', ref: 'C6', state: 'FB4' },
];

// C1 spotlights (assets/diagrams/C1.html STATES): one rich diagram row, its lit region swapped on the words
const C1_SPOTS: [number, string][] = [[151.6, 's0-whole'], [151.76, 's1-nodes'], [154.12, 's2-hub'], [156.96, 's3-governance'], [158.84, 's4-coin']];
const WB_FRAMES: Record<string, number> = { WB1: 476, WB2: 581, WB3: 452, WB4: 657 };   // ffprobe nb_frames, 30 fps
const CLIPS: Record<string, { file: string; frames: number; at: number }> = {
  'CLIP-2': { file: 'clip-inserts/CLIP-2-saraniecki-settlement.mp4', frames: 335, at: 48.185 },
  'CLIP-3': { file: 'clip-inserts/CLIP-3-rooz-allocation.mp4', frames: 345, at: 206.835 },
};

// TITLE CARDS (TRANSITIONS bucket 1, the ONE card move rmn:slide from-right on all three). Each card scene starts where the
// outgoing picture ends (the C14 hold / K6-s6 / F5's last face frame), pushes in over 15 frames, holds through the pause,
// and fades off over the next cover's 12-frame scale-in. readable = lead + PAUSE - turn >= 1.0 s is asserted below.
const CARD_TURN = 15;
const CARD_TAIL = 12;
const CARDS = [
  { id: 'T2', at: 40.51, lead: 40.43 },
  { id: 'T3', at: 129.68, lead: 129.68 },
  { id: 'T4', at: 167.155, lead: 167.1 },
].map((c) => ({ ...c, cs: Fend(c.lead), f0: Fpre(c.at), f1: F(c.at) }));
CARDS.forEach((c) => {
  const readable = (c.f1 - c.cs - CARD_TURN) / FPS;
  if (readable < 1.0) throw new Error(`Canton: title card ${c.id} readable ${readable.toFixed(2)} s < 1.0 s`);
});

// CLIP INSERT windows (section 3d): the paused frames, the clip played full-frame and muted (its voice is in the VO).
// insert-in / insert-out = hand:fade (TRANSITIONS bucket insert), realised FRAME-MATCHED: the lead-in still IS the clip's
// frame 0 and the lead-out still IS its last frame, so the dissolve is between identical pictures. Chunk QA (frame 1500):
// a literal 15-frame cross-dissolve of the moving clip over its own frozen frame 0 ghosted CLIP-2's scrolling LED wall.
const INSERT_WIN = Object.entries(CLIPS).map(([id, c]) => ({ id, ...c, f0: Fpre(c.at), f1: F(c.at) }));

// ============================================================================================================
// 4. RUNS + ROWS: the frame plan of every cover row (entrance, tail under the next entrance, the face hold)
// ============================================================================================================
type InKind = 'xfade' | 'sheet' | 'fade' | 'body' | 'none';
const IN_FRAMES: Record<InKind, number> = { xfade: 12, sheet: 11, fade: 15, body: 11, none: 0 };
type Run = { s: number; e: number; kind: InKind; n: number; hold?: number; afterCard: boolean };
type Row = Cover & { s: number; e: number; tail: number; inner: number; run: Run };

const entranceOf = (c: Cover): InKind => {
  if (c.enter === 'spin' || c.enter === 'cut') return 'none';     // lib spin marquee / hand:cut on the same drawing
  if (c.kind === 'whiteboard') return 'sheet';                     // hand:paper-sheet-in, 11 frames
  if (c.kind === 'clipstill') return c.frame === 'first' ? 'fade' : 'none';   // hand:fade (broll-fade) / frame-matched
  return 'xfade';                                                  // hand:xfade-scale, 0.40 s
};
const cardOver = (f: number) => CARDS.find((c) => f >= c.cs && f <= c.f1);
const holdFor = (t: number) => {
  const w = VIS.find((v) => Math.abs(v.b - t) < 0.01);
  return w ? F(w.b) - 1 : undefined;                               // the last frame of the face / screen share it leaves
};
const buildRows = (list: Cover[], body: boolean): Row[] => {
  const sorted = [...list].sort((a, b) => a.tIn - b.tIn);
  const rows: Row[] = [];
  let run: Run | null = null;
  sorted.forEach((c, i) => {
    const prev = sorted[i - 1];
    const contiguous = !body && !!prev && prev.ref === c.ref && Math.abs(prev.tOut - c.tIn) < 0.01;
    const raw = F(c.tIn);
    const card = body ? undefined : cardOver(raw);
    const s = card ? card.f1 : raw;
    const e = Fend(c.tOut);
    if (!contiguous || !run) {
      const kind: InKind = body ? 'body' : entranceOf(c);
      run = { s, e, kind, n: IN_FRAMES[kind], hold: body ? undefined : holdFor(c.tIn), afterCard: !!card };
    }
    run.e = e;
    const inner = contiguous && c.kind === 'receipt' && c.img !== prev.img ? 12 : 0;   // an xfade inside one capture run
    rows.push({ ...c, s, e, tail: 0, inner, run });
  });
  rows.forEach((r, i) => {
    const nx = rows[i + 1];
    if (nx && nx.s === r.e) {
      if (nx.run !== r.run) { if (!nx.run.afterCard && nx.run.n > 0) r.tail = nx.run.n; }
      else if (nx.inner > 0) r.tail = nx.inner;
    }
  });
  return rows;
};
const ROWS = buildRows(COVERS, false);
const FB_ROWS = buildRows(FACE_BODY, true);

// ============================================================================================================
// 5. ELEMENTS (absolute clock only; section 6a)
// ============================================================================================================
const fill = { position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, objectFit: 'cover' } as const;

/** A video frame held exactly (section 6a rule 1: a real Freeze inside a zero-offset Sequence; rule 2: muted). */
const VideoFrame: React.FC<{ src: string; frame: number; style?: React.CSSProperties }> = ({ src, frame, style }) => (
  <Sequence from={0} layout="none">
    <Freeze frame={frame}>
      <OffthreadVideo src={staticFile(src)} muted style={style ?? fill} />
    </Freeze>
  </Sequence>
);

/** The spine frozen at frame n with the transform that airs at n (section 6a rules 1-4: Freeze, muted, same transform
 *  incl. the punch scale, same source spine.mp4; identity inside a screen share). */
const SpineStill: React.FC<{ n: number }> = ({ n }) => (
  <AbsoluteFill style={{ overflow: 'hidden', transformOrigin: `${FACE_POINT.x}px ${FACE_POINT.y}px`, transform: `scale(${inShare(n) ? 1 : punchAt(n)})` }}>
    <VideoFrame src="spine.mp4" frame={n}
      style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', transform: spineTransform(n) }} />
  </AbsoluteFill>
);

/** The LIVE spine for an engine node: muted, synced to the absolute clock in ANY nesting (trimBefore = abs - local). */
const SpineSynced: React.FC<{ scale: number }> = ({ scale }) => {
  const { abs } = useClock();
  const local = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: 'hidden', transformOrigin: `${FACE_POINT.x}px ${FACE_POINT.y}px`, transform: `scale(${scale})` }}>
      <OffthreadVideo src={staticFile('spine.mp4')} muted trimBefore={Math.max(0, abs - local)}
        style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', transform: spineTransform(abs) }} />
    </AbsoluteFill>
  );
};

const slideFile = (ref: string, state: string) =>
  ref === 'C1' || ref === 'C3' ? `diagrams/${ref}-${state}.png` : state === 'rest' ? `card-slides/${ref}.png` : `card-slides/${ref}-${state}.png`;

/** A card / diagram state PNG, FULL FRAME, one spotlight at a time, with a gentle push over its whole run (section 7a:
 *  a still never sits dead still; a full view pushes 2.5 %, under the ~4 % edge limit). */
const SlideView: React.FC<{ r: Row }> = ({ r }) => {
  const { abs, F: f } = useClock();
  let state = r.state as string;
  if (r.ref === 'C1') for (const [t, st] of C1_SPOTS) if (abs >= f(t)) state = st;
  if (r.ref === 'C1' && abs < f(C1_SPOTS[0][0])) state = C1_SPOTS[0][1];
  const p = clamp01((abs - r.run.s) / Math.max(1, r.run.e - r.run.s));
  return (
    <AbsoluteFill style={{ background: PAGE_BG, overflow: 'hidden' }}>
      <Img src={staticFile(slideFile(r.ref, state))} style={{ ...fill, transform: `scale(${1 + 0.025 * p})`, transformOrigin: '50% 50%' }} />
    </AbsoluteFill>
  );
};

const ChartFor: React.FC<{ c: Cover }> = ({ c }) => {
  if (c.ref === 'C6') return <C6Chart />;          // REAL animated chart (CantonCharts.tsx), never a PNG with a wipe
  throw new Error(`Canton: no animated chart component for '${c.ref}'`);
};

/** WHITEBOARD (section 4b): the rendered silent clip, frame-for-frame with the spine from `from` s into the clip. */
const WhiteboardEl: React.FC<{ c: Cover }> = ({ c }) => {
  const { abs, F: f } = useClock();
  const n = WB_FRAMES[c.ref];
  const idx = Math.max(0, Math.min(n - 1, abs - f(c.tIn) + Math.round((c.from ?? 0) * FPS)));
  return <VideoFrame src={`whiteboard/${c.ref}.mp4`} frame={idx} />;
};

/** CLIP STILL (section 3d): the clip's FIRST frame under the set-up line / its LAST frame under the resume line. */
const ClipStillEl: React.FC<{ c: Cover }> = ({ c }) => {
  const clip = CLIPS[c.ref.slice(0, 6)];
  return <VideoFrame src={clip.file} frame={c.frame === 'first' ? 0 : clip.frames - 1} />;
};

const MOTION_CENTRED = new Set(['C19']);
/** A library MOTION move wrapping ONE receipt for its whole slot (section 6, MOTION moves): the live receipt is the
 *  engine's outClip and the engine clock is a Freeze fitted to the slot (t * 4.96 / slot). */
const MotionWrap: React.FC<{ r: Row }> = ({ r }) => {
  const { abs } = useClock();
  const row = getTransition(r.mo as string);
  if (!row) throw new Error(`Canton: unknown motion id ${r.mo}`);
  const Engine = ENGINES[row.engine] as React.FC<any>;
  const last = Math.round(4.96 * FPS);
  const eng = Math.round(clamp01((abs - r.s) / Math.max(1, r.e - r.s - 1)) * last);
  // C19: the blueprint asks the sentence crop to FILL THE FRAME WIDTH the whole time; the row's lateral drift (a 731 px wrap
  // pan) carries the sentence off frame and shows the tile seam, so on C19 the drift + static offset are held at centre and
  // the row's own swivel, distance and edge accents run unchanged (deviation logged in the comp-build report).
  const params = MOTION_CENTRED.has(r.fx as string)
    ? { ...row.params, drift: [{ t: 0, x: 0.5, y: 0.5 }, { t: 4.96, x: 0.5, y: 0.5 }], geoPos: [0.5, 0.5] }
    : row.params;
  return (
    <Sequence from={0} layout="none">
      <Freeze frame={eng}>
        <Engine from={null} to={null} outClip={() => <ReceiptView fx={r.fx as string} />}
          durationInFrames={Math.round(row.durationSeconds * FPS)} params={params} />
      </Freeze>
    </Sequence>
  );
};

/** The element a COVERS (or FACE_BODY) row renders (section 4 CoverEl). */
const CoverEl: React.FC<{ r: Row }> = ({ r }) => {
  switch (r.kind) {
    case 'receipt': return r.mo ? <MotionWrap r={r} /> : <ReceiptView fx={r.fx as string} />;
    case 'container':
    case 'deck': return <SlideView r={r} />;
    case 'chart': return <ChartFor c={r} />;
    case 'whiteboard': return <WhiteboardEl c={r} />;
    case 'clipstill': return <ClipStillEl c={r} />;
  }
  return null;
};

/** The FACE BODY deck-area box (section 4c skeleton): the 1920 x 1080 stage scaled 1464/1920, vertically centred on the
 *  page colour, the container entrance 0.35 s fade + 0.97 -> 1. */
const FaceBodyEl: React.FC<{ r: Row }> = ({ r }) => {
  const { abs } = useClock();
  const a = clamp01((abs - r.s) / 11);
  const s = 0.97 + 0.03 * a;
  return (
    <div style={{ position: 'absolute', left: DECK_AREA.x, top: DECK_AREA.y, width: DECK_AREA.w, height: DECK_AREA.h,
      overflow: 'hidden', background: PAGE_BG, opacity: a, transform: `scale(${s})`, transformOrigin: '50% 50%' }}>
      <div style={{ position: 'absolute', left: 0, top: (DECK_AREA.h - 1080 * DECK_SCALE) / 2, width: 1920, height: 1080,
        transformOrigin: '0 0', transform: `scale(${DECK_SCALE})` }}>
        <CoverEl r={r} />
      </div>
    </div>
  );
};

/** Exactly what airs at frame n, frozen (a card's outgoing side, the face hold under a cover's cross-fade). */
const AirStill: React.FC<{ n: number }> = ({ n }) => {
  const w = visAt(n);
  if (w) {
    return (
      <FrozenClock at={n}>
        <AbsoluteFill>
          <SpineStill n={n} />
          {w.kind === 'screenshare' && FB_ROWS.filter((r) => n >= r.s && n < r.e + r.tail).map((r, i) => <FaceBodyEl key={i} r={r} />)}
        </AbsoluteFill>
      </FrozenClock>
    );
  }
  return (
    <FrozenClock at={n}>
      <AbsoluteFill>
        {ROWS.filter((r) => n >= r.s && n < r.e + r.tail).map((r, i) => <RowLayer key={i} r={r} />)}
      </AbsoluteFill>
    </FrozenClock>
  );
};

/** One cover row: its run's entrance (xfade-scale / paper sheet / fade, or none on a state swap), an inner xfade on a
 *  capture change inside a run, and the frozen last face frame held under a face -> cover cross-fade. */
const RowLayer: React.FC<{ r: Row }> = ({ r }) => {
  const { abs } = useClock();
  const run = r.run;
  const q = run.n > 0 ? easeOut(clamp01((abs - run.s) / run.n)) : 1;
  const qi = r.inner > 0 ? easeOut(clamp01((abs - r.s) / r.inner)) : 1;
  let op = run.kind === 'none' || run.afterCard ? 1 : q;
  let sc = run.kind === 'xfade' ? 0.93 + 0.07 * q : run.kind === 'sheet' ? 0.97 + 0.03 * q : 1;
  if (r.inner > 0) { op *= qi; sc *= 0.93 + 0.07 * qi; }
  return (
    <AbsoluteFill>
      {run.hold !== undefined && q < 1 && <AirStill n={run.hold} />}
      <AbsoluteFill style={{ opacity: op, transform: `scale(${sc})`, transformOrigin: '50% 50%' }}>
        <CoverEl r={r} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** CLIP INSERT playback over its paused window (section 3d): full-frame, MUTED, frame 0 continuing the lead-in still
 *  (hand:fade insert-in, frame-matched) and its last frame handing to the identical lead-out still (insert-out). */
const InsertEl: React.FC<{ w: (typeof INSERT_WIN)[number] }> = ({ w }) => {
  const { abs } = useClock();
  const idx = Math.max(0, Math.min(w.frames - 1, abs - w.f0));
  return (
    <AbsoluteFill>
      <VideoFrame src={w.file} frame={idx} />
    </AbsoluteFill>
  );
};

/** rmn:slide title card (from-right), a self-contained scene: the frozen outgoing picture -> the title PNG. */
const CardScene: React.FC<{ c: (typeof CARDS)[number] }> = ({ c }) => {
  const { abs } = useClock();
  const off = clamp01((abs - c.f1) / CARD_TAIL);
  return (
    <AbsoluteFill style={{ opacity: 1 - off }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={CARD_TURN}>
          <AirStill n={c.cs - 1} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: 'from-right' })}
          timing={linearTiming({ durationInFrames: CARD_TURN, easing: Easing.bezier(0.45, 0, 0.25, 1) })} />
        <TransitionSeries.Sequence durationInFrames={c.f1 - c.cs + CARD_TAIL}>
          <Img src={staticFile(`title-slides/${c.id}.png`)} style={fill} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};

/** hand:film-burn, the video's face pick (TRANSITIONS bucket 3): a warm radial flash +-0.38 s peaking ON the cut,
 *  screen-blended, dialled down (peak 0.78) so 15 edges in 4:38 do not strobe. Silent. */
const FilmBurn: React.FC<{ cut: number }> = ({ cut }) => {
  const { abs } = useClock();
  const d = abs - cut;
  const p = 1 - Math.abs(d) / 12;
  if (p <= 0) return null;
  const e = p * p * (3 - 2 * p);
  const k = d / 11;
  return (
    <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: 0.78 * e }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 62% 78% at ${40 + 20 * k}% ${46 - 6 * k}%, rgba(255,238,196,1) 0%, rgba(255,176,78,0.95) 22%, rgba(236,98,28,0.7) 48%, rgba(120,32,6,0.25) 72%, rgba(0,0,0,0) 100%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 34% 46% at ${82 - 30 * k}% 72%, rgba(255,140,40,0.55) 0%, rgba(0,0,0,0) 100%)` }} />
    </AbsoluteFill>
  );
};
const FACE_EDGES = VIS.flatMap((w) => [w.a, w.b]).filter((t) => t > 0);   // 15 edges (F1 opens the video)

/** [LT] gloss lower-thirds (EDIT-PLAN, our text, house container look: dark glass, violet outline, the lime term). */
const LOWER_THIRDS = [
  { t1: 170.46, t2: 173.74, term: 'repo', text: 'short-term loans backed by securities' },
  { t1: 237.08, t2: 241.367, term: 'no-action letter', text: 'staff will not recommend enforcement' },
];
const LowerThird: React.FC<{ lt: (typeof LOWER_THIRDS)[number] }> = ({ lt }) => {
  const { abs, F: f } = useClock();
  const a = f(lt.t1), b = f(lt.t2);
  const qin = easeOut(clamp01((abs - a) / 10));
  const qout = clamp01((b - abs) / 6);
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: 110, bottom: 96, opacity: Math.min(qin, qout), transform: `translateY(${(1 - qin) * 40}px)`,
        display: 'flex', alignItems: 'stretch', background: 'rgba(6,4,22,0.88)', border: '1.5px solid #3D2D8A', borderRadius: 16,
        boxShadow: '0 0 0 1px rgba(135,92,255,0.18), 0 18px 40px rgba(0,0,0,0.45)', overflow: 'hidden' }}>
        <div style={{ width: 8, background: '#F3FF97' }} />
        <div style={{ padding: '22px 36px 24px 28px', fontFamily: DMSANS, fontSize: 42, fontWeight: 500, color: '#FFFFFF', letterSpacing: '-0.005em' }}>
          <span style={{ color: '#F3FF97', fontWeight: 700 }}>{lt.term}:</span> {lt.text}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// CAPTIONS (section 8; generated by build_captions.py into CantonCaptions.ts, FACE windows only): topmost, Montserrat 900,
// lowercase, 12 px black stroke painted under the fill, pop 0.7 -> 1.12 -> 1, bottom centre.
const CAPS = ZCAPTIONS.map((c) => ({ f: F(c.t), h: c.h }));
const CAP_WIN = CAPTION_WINDOWS.map(([a, b]) => [F(a), F(b)] as [number, number]);
const Captions: React.FC = () => {
  const { abs } = useClock();
  if (!CAP_WIN.some(([a, b]) => abs >= a && abs < b)) return null;
  let cur: { f: number; h: string } | null = null;
  for (const c of CAPS) { if (c.f <= abs) cur = c; else break; }
  if (!cur) return null;
  const nxt = CAPS.find((c) => c.f > (cur as { f: number }).f);
  if (abs >= Math.min(nxt ? nxt.f : Infinity, cur.f + Math.round(1.3 * FPS))) return null;
  const lf = abs - cur.f;
  const sc = lf <= 4 ? 0.7 + (1.12 - 0.7) * (lf / 4) : lf <= 8 ? 1.12 - 0.12 * ((lf - 4) / 4) : 1;
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 120 }}>
      <div style={{ fontFamily: `${MONTSERRAT},'Arial Black','Segoe UI',sans-serif`, fontWeight: 900, fontSize: 90, lineHeight: 1.05,
        textTransform: 'lowercase', color: '#FFFFFF', WebkitTextStroke: '12px #000', paintOrder: 'stroke fill', letterSpacing: '0.01em',
        textAlign: 'center', transform: `scale(${sc})`, transformOrigin: '50% 80%', maxWidth: 1500 }}>
        {cur.h}
      </div>
    </AbsoluteFill>
  );
};

// The library MARQUEE (TRANSITIONS section 4): ONE spin, C3 (Canton column filled) -> C1 at 151.6, window exactly win frames
// centred on the cut (section 6a), cover -> cover full frame, both sides the live cover nodes on the absolute clock.
const SPIN = { id: 'spin-3d-corner-ease-short-t-cw', at: 151.6 };

// ============================================================================================================
// 6. THE COMPOSITION
// ============================================================================================================
const SpineLayer: React.FC = () => {
  const { abs } = useClock();
  return (
    <AbsoluteFill style={{ overflow: 'hidden', transformOrigin: `${FACE_POINT.x}px ${FACE_POINT.y}px`, transform: `scale(${inShare(abs) ? 1 : punchAt(abs)})` }}>
      <OffthreadVideo src={staticFile('spine.mp4')}
        style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', transform: spineTransform(abs) }} />
    </AbsoluteFill>
  );
};

const spinRows = () => {
  const out = ROWS.find((r) => r.ref === 'C3' && r.state === 's3-canton');
  const inc = ROWS.find((r) => r.ref === 'C1');
  if (!out || !inc) throw new Error('Canton: spin rows missing');
  return { out, inc };
};

// `captions` / `pops` (short_graph s_paint_16x9, longform-to-short.md): the 16:9-sourced short renders spans with both OFF,
// the short draws its own captions; `pops` gates the [LT] lower-thirds, 1920-wide text a 608 px slice would cut.
export const Canton: React.FC<{ captions?: boolean; pops?: boolean }> = ({ captions = true, pops = true }) => {
  const abs = useCurrentFrame();
  const spinRow = getTransition(SPIN.id);
  if (!spinRow) throw new Error(`Canton: unknown transition ${SPIN.id}`);
  const spinWin = Math.round(spinRow.durationSeconds * FPS);
  const { out: spinOut, inc: spinIn } = spinRows();
  return (
    <ClockCtx.Provider value={{ abs, F }}>
      <AbsoluteFill style={{ backgroundColor: '#000' }}>
        {/* the spine: the VO + the face (reframed on FACE windows, identity on SCREENSHARE windows, F8's punch steps) */}
        <SpineLayer />

        {/* screen-share deck-area bodies: above the spine, below covers, transitions and overlays (section 4c) */}
        {FB_ROWS.map((r, i) => (
          <Sequence key={'fb' + i} from={r.s} durationInFrames={r.e - r.s + r.tail}>
            <FaceBodyEl r={r} />
          </Sequence>
        ))}

        {/* the COVER track (hand:xfade-scale / hand:paper-sheet-in / hand:fade entrances, hand:cut WB1 -> WB2) */}
        {ROWS.map((r, i) => (
          <Sequence key={'cv' + i} from={r.s} durationInFrames={r.e - r.s + r.tail}>
            <RowLayer r={r} />
          </Sequence>
        ))}

        {/* CLIP INSERTS over their paused windows (hand:fade insert-in / insert-out) */}
        {INSERT_WIN.map((w) => (
          <Sequence key={w.id} from={w.f0} durationInFrames={w.f1 - w.f0}>
            <InsertEl w={w} />
          </Sequence>
        ))}

        {/* title cards, rmn:slide (TRANSITIONS 0:40.4 / 2:10.0 / 2:47.1) */}
        {CARDS.map((c) => (
          <Sequence key={c.id} from={c.cs} durationInFrames={c.f1 - c.cs + CARD_TAIL}>
            <CardScene c={c} />
          </Sequence>
        ))}

        {/* lib:spin-3d-corner-ease-short-t-cw, the one marquee (TRANSITIONS 2:31.6, SPIN-newfacet); SFX post-mixed */}
        <Sequence from={F(SPIN.at) - Math.round(spinWin / 2)} durationInFrames={spinWin}>
          <TransitionClip id={SPIN.id} cutFrame={Math.round(spinWin / 2)} sfx={false}
            outgoing={() => <CoverEl r={spinOut} />} incoming={() => <CoverEl r={spinIn} />} />
        </Sequence>

        {/* punch-leak light leaks (lib:lightleaks-soft-2 / lib:lightleaks-soft-short-8), the engine's A->B swap placed ON
            the join frame so the leak peaks with the punch step; the continuous spine is both A and B (old / new scale) */}
        {PUNCHES.map((p, i) => {
          const row = getTransition(p.leak);
          if (!row) throw new Error(`Canton: unknown leak ${p.leak}`);
          const win = Math.round(row.durationSeconds * FPS);
          const swap = Math.ceil(((row.params as { cut: number }).cut) * (win - 1));
          const jf = F(p.at);
          const before = punchAt(jf - 1);
          return (
            <Sequence key={'leak' + i} from={jf - swap} durationInFrames={win}>
              <TransitionClip id={p.leak} cutFrame={Math.round(win / 2)} sfx={false}
                outgoing={() => <SpineSynced scale={before} />} incoming={() => <SpineSynced scale={p.scale} />} />
            </Sequence>
          );
        })}

        {/* [LT] gloss lower-thirds */}
        {pops && LOWER_THIRDS.map((lt, i) => (
          <Sequence key={'lt' + i} from={F(lt.t1)} durationInFrames={F(lt.t2) - F(lt.t1)}>
            <LowerThird lt={lt} />
          </Sequence>
        ))}

        {/* hand:film-burn on all 15 face / screen-share edges (the face pick, plain on the screen shares too) */}
        {FACE_EDGES.map((t, i) => (
          <Sequence key={'burn' + i} from={F(t) - 11} durationInFrames={23}>
            <FilmBurn cut={F(t)} />
          </Sequence>
        ))}

        {/* captions, topmost, FACE windows only */}
        {captions && <Captions />}
      </AbsoluteFill>
    </ClockCtx.Provider>
  );
};

// TRANSITION WIRING, every TRANSITIONS.md section 5 row (TC on the delivered clock; grep the plan id against this file):
//  0:06.1 face-cut hand:film-burn (FACE_EDGES 6.133) + container-xfade hand:xfade-scale (C9 run, over the F1 hold)
//  0:08.1 / 0:19.8 hand:xfade-scale (K1, C14 runs)  · 0:29.8 / 0:38.5 hand:film-burn (F2 edges) · 0:38.5 hand:xfade-scale (C14 hold)
//  0:40.4 card rmn:slide (CARDS T2) + hand:xfade-scale (K2 after the card) · 0:46.1 broll-fade hand:fade (CLIP-2 lead-in)
//  0:48.4 insert-in / insert-out hand:fade (InsertEl + the frame-matched CLIP-2 lead-out) + hand:paper-sheet-in (WB1)
//  1:04.2 hand:cut (WB2 enter 'cut') · 1:23.6 hand:xfade-scale (C10) · 1:25.6 hand:paper-sheet-in (WB3)
//  1:40.2 / 1:42.9 hand:film-burn (F3) + hand:xfade-scale (K6) · 2:10.0 rmn:slide (T3) + hand:xfade-scale (C3)
//  2:16.6 / 2:20.7 hand:film-burn (F4) + hand:xfade-scale (C3 return) · 2:31.6 lib:spin-3d-corner-ease-short-t-cw (SPIN)
//  2:39.9 / 2:47.1 hand:film-burn (F5) · 2:47.1 rmn:slide (T4) + hand:xfade-scale (C15) + receipt-motion lib:motion-3d-pan-1-up
//  2:59.9 / 3:09.2 hand:film-burn (F6) + hand:xfade-scale (K3) · 3:17.3 hand:xfade-scale + lib:motion-3d-pan-2-left (C19)
//  3:20.3 hand:xfade-scale (K4) · 3:23.9 hand:fade (CLIP-3 lead-in) · 3:26.7 insert-in / insert-out hand:fade + broll-fade
//  3:28.3 hand:xfade-scale (K3 return) · 3:31.5 hand:paper-sheet-in (WB4) · 3:53.4 hand:xfade-scale (C18)
//  4:01.4 / 4:08.9 hand:film-burn (F7) + hand:xfade-scale (C22) · 4:12.0 / 4:14.5 hand:xfade-scale (C7, K5)
//  4:20.9 hand:film-burn (F8 in) · 4:25.1 lib:lightleaks-soft-2 · 4:28.6 lib:lightleaks-soft-short-8 (PUNCHES)
//  4:29.1 hand:film-burn (F8 out) + hand:xfade-scale (K5-s4 end card, held to the last frame)

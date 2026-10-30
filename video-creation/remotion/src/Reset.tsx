// Reset.tsx: longform-edited comp for media/reset ("Crypto Billionaires Will Be Made Next Year"), 1920x1080 @30.
// Built TO the approved blueprint: EDIT-PLAN.md (event log) + TRANSITIONS.md / TRANSITION-PLAN.json (ids) + COVER-PLAN.json
// + spine/ALL.f.paused.json (the pause table = the time map) + PROJECT-LOG.md Open flags. Skeleton authority:
// skills/comp-build/comp-build.md (no other project comp was opened or imported).
// Every cue below is a SOURCE-spine second (spine/ALL.d.desilenced.mp4) routed through sh()/F().
// No music, no SFX, no watermark in this comp: audio = the paused spine's own VO (clip voices included); the post-mix owns the rest.
import React, { createContext, useContext } from 'react';
import { AbsoluteFill, Freeze, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { slide } from '@remotion/transitions/slide';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { TransitionClip } from './transitions/TransitionClip';
import { ENGINES, getTransition, framesForRow } from './transitions';
import { ZCAPTIONS, CAPTION_WINDOWS } from './ResetCaptions';
import { ChartC4, ChartH5, ChartC6, ChartC7, ChartC2, ChartC8, ChartC17, DMSANS, JBMONO } from './ResetCharts';

const MONTSERRAT = loadMontserrat('normal', { weights: ['900'], subsets: ['latin'], ignoreTooManyRequestsWarning: true }).fontFamily;

// ============================================================================================================
// 1. TIMING: the paused spine's pause table (spine/ALL.i.paused.json pauses[]) IS the time map.
// ============================================================================================================
export const FPS = 30;
export const SPINE_SECS = 748.233;            // the SOURCE spine ALL.g.restored.mp4 (= ALL.d + the restored 'The debt', +1.10 s at 99.10, 2026-10-30)
export const PAUSE = 2.5;                   // pause_s (the title-card pause): 1.0 s silent H2 hold + the 1.5 s CH2 card (Mike 2026-10-30)
const H2_HOLD = 1.0;                        // the H2 'WILL YOU BE ONE OF THEM?' card holds this long, voice silent, before the CH2 title slides in
export const INSERTS = [
  { at: 45.82, dur: 4.0 },
  { at: 99.15, dur: 2.5 },
  { at: 333.36, dur: 13.8 },
  { at: 402.38, dur: 17.6 },
  { at: 458.94, dur: 13.8 },
  { at: 615.155, dur: 5.333333 },
];
// CARD_T = the non-clip pauses (the brief): 99.15 = the CH2 title card (2.5 s: 1.0 s silent H2 hold + the slide); 615.16 = the BRAAM beat pause (no card is drawn
// there, the C17 cover holds and slowly zooms to 13.1T through it, comp-build section 9).
export const CARD_T = [99.15, 615.155];
const TITLE_AT = 99.15;
const BRAAM_AT = 615.155;
// the clip-insert rows of the pause table (their voices are already in the VO track)
// `shift` = frames the clip's own audio actually starts after Fe(at) in assets/spine.mp4 (envelope cross-correlation of each
// clip against the paused spine, 2026-10-29: +0 / +25 / +45 / +45 ms), so the muted picture sits on its voice.
const CLIP_INSERTS = [
  { at: 45.82, id: 'CLIP-1', file: 'clip-inserts/CLIP-1-trump-inflation.mp4', frames: 120, shift: 0 },
  { at: 333.36, id: 'CLIP-5', file: 'clip-inserts/CLIP-5-warsh-10yr.mp4', frames: 413, shift: 1 },
  { at: 402.38, id: 'CLIP-4', file: 'clip-inserts/CLIP-4-bessent-equilibrium.mp4', frames: 528, shift: 1 },
  { at: 458.94, id: 'CLIP-6', file: 'clip-inserts/CLIP-6-schwab-reset.mp4', frames: 414, shift: 1 },
];
const pauseSum = (t: number, incl: boolean) => INSERTS.filter((p) => (incl ? p.at <= t : p.at < t)).reduce((s, p) => s + p.dur, 0);
export const sh = (t: number) => t + pauseSum(t, true);              // source -> paused-spine seconds (after a pause at t)
const cardStart = (t: number) => t + pauseSum(t, false);              // a pause's own start (before the pause at t)
export const F = (t: number) => Math.round(sh(t) * FPS);
const Fe = (t: number) => Math.round(cardStart(t) * FPS);             // the END frame of a row that ends ON a pause point
const pauseF = (dur: number) => Math.round(dur * FPS);
// paused-spine frame -> source seconds (frozen at `at` inside a pause)
const srcOf = (absF: number) => {
  const T = absF / FPS;
  let shift = 0;
  for (const p of INSERTS) {
    const start = p.at + shift;
    if (T < start) break;
    if (T < start + p.dur) return p.at;
    shift += p.dur;
  }
  return T - shift;
};
// DUR = the paused spine's own frame count (ffprobe assets/spine.mp4 = spine/ALL.i.paused.mp4: 24159 f = 805.3 s, CFR 30; 2026-10-30).
export const DUR = 24159;
if (Math.abs(DUR - Math.round((SPINE_SECS + INSERTS.reduce((s, p) => s + p.dur, 0)) * FPS)) > 3) {
  throw new Error('Reset: DUR drifted from SPINE_SECS + the pause table');
}

// ============================================================================================================
// 2. THE SPINE: measured face reframe (assets/face-reframe.json, never hand-tuned) + punch-ins on desilencer joins.
// ============================================================================================================
export const FACE_REFRAME = { scale: 1.323, x: -513, y: -139 };
const FACE_POINT = { x: 960, y: 432 };                                 // face_point_out: punch-ins scale about it
const PUNCH_SCALE = 1.18;
// FACE windows (AS-RECORDED / blackdetect), source seconds
const FACE_WIN: [number, number][] = [[0.0, 10.633], [30.933, 33.567], [71.633, 77.467], [91.0, 96.9], [101.533, 104.0], [131.133, 137.267],
  [170.5, 179.8], [195.2, 202.7], [238.967, 245.267], [313.633, 333.067], [371.9, 376.667], [384.7, 392.467], [421.9, 432.533],
  [465.067, 476.867], [568.133, 582.233], [629.4, 634.6], [678.267, 692.633], [719.0, 748.2]];
// The same windows MEASURED on assets/spine.mp4 as [first face frame, first black frame) (luma > 8 on 96x54, 2026-10-29).
// The source spine is VFR (22382 frames over 747.1 s; ALL.g re-encoded CFR 30, 2026-10-30), so its CFR paused copy runs 0 to 2 frames behind the nominal sh() map;
// every face EDGE (cover in / out, film burn, caption gate, leak clamp) is pinned to these frames so no cut flashes black.
const FACE_FR: [number, number][] = [[0, 319], [929, 1008], [2270, 2445], [2851, 3028], [3242, 3316], [4130, 4314], [5311, 5590], [6051, 6277], [7365, 7554], [9605, 10188], [11766, 11910], [12150, 12384], [13796, 14115], [15505, 15859], [18597, 19020], [20595, 20751], [22061, 22492], [23283, 24159]];
if (FACE_FR.length !== FACE_WIN.length) throw new Error('Reset: FACE_FR / FACE_WIN mismatch');
// [PUNCH-IN] + [LIGHTLEAK] rows (EDIT-PLAN / TRANSITION-PLAN punch-leak): the punch steps ON the join (spine/jumpcuts-final.json),
// alternating in / back out per face window; the library leak peaks on the same frame. `f` = the join's frame in the paused
// spine (nominal F(t) + that window's measured drift; 32.433 = its measured jump cut, frame 977).
const PUNCHES: { t: number; f: number; leak: string }[] = [
  { t: 32.433, f: 977, leak: 'lightleaks-soft-6' }, { t: 102.9, f: 3283, leak: 'lightleaks-soft-8' }, { t: 174.7, f: 5437, leak: 'lightleaks-soft-6' },
  { t: 177.367, f: 5517, leak: 'lightleaks-soft-8' }, { t: 197.967, f: 6134, leak: 'lightleaks-soft-6' }, { t: 319.1, f: 9769, leak: 'lightleaks-soft-8' },
  { t: 323.433, f: 9899, leak: 'lightleaks-soft-6' }, { t: 327.833, f: 10031, leak: 'lightleaks-soft-8' }, { t: 332.533, f: 10172, leak: 'lightleaks-soft-short-7' },
  { t: 376.033, f: 11891, leak: 'lightleaks-soft-short-9' }, { t: 385.867, f: 12185, leak: 'lightleaks-soft-6' }, { t: 391.767, f: 12363, leak: 'lightleaks-soft-short-7' },
  { t: 426.567, f: 13936, leak: 'lightleaks-soft-8' }, { t: 431.8, f: 14093, leak: 'lightleaks-soft-short-9' }, { t: 470.233, f: 15660, leak: 'lightleaks-soft-6' },
  { t: 472.567, f: 15730, leak: 'lightleaks-soft-short-7' }, { t: 474.333, f: 15783, leak: 'lightleaks-soft-short-9' }, { t: 476.033, f: 15834, leak: 'lightleaks-soft-short-7' },
  { t: 577.033, f: 18864, leak: 'lightleaks-soft-8' }, { t: 581.233, f: 18990, leak: 'lightleaks-soft-6' }, { t: 633.567, f: 20720, leak: 'lightleaks-soft-8' },
  { t: 683.3, f: 22212, leak: 'lightleaks-soft-6' }, { t: 691.533, f: 22459, leak: 'lightleaks-soft-8' }, { t: 722.7, f: 23394, leak: 'lightleaks-soft-6' },
  { t: 746.267, f: 24101, leak: 'lightleaks-soft-8' },
];
const faceIdxOfT = (t: number) => FACE_WIN.findIndex(([a, b]) => t >= a && t <= b);
const faceIdxOfF = (absF: number) => FACE_FR.findIndex(([a, b]) => absF >= a && absF < b);
const punchAt = (absF: number) => {
  const k = faceIdxOfF(absF);
  if (k < 0) return 1;
  const n = PUNCHES.filter((p) => faceIdxOfT(p.t) === k && p.f <= absF).length;
  return n % 2 === 1 ? PUNCH_SCALE : 1;
};
// the paused frame of a source time inside a face window, drift-corrected (captions)
const faceFrameOf = (t: number) => {
  const k = faceIdxOfT(t);
  if (k < 0) return F(t);
  const [a, b] = FACE_WIN[k];
  const din = a > 0 ? FACE_FR[k][0] - F(a) : 0;
  const dout = b < SPINE_SECS - 0.05 ? FACE_FR[k][1] - Fe(b) : din;
  return F(t) + Math.round(din + (dout - din) * (t - a) / Math.max(1e-6, b - a));
};

// ONE absolute clock for every node an engine may mount (comp-build section 6a)
const AbsCtx = createContext(0);
const useAbs = () => useContext(AbsCtx);

const spineStyle: React.CSSProperties = { position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0',
  transform: `translate(${FACE_REFRAME.x}px, ${FACE_REFRAME.y}px) scale(${FACE_REFRAME.scale})` };
const punchWrap = (s: number): React.CSSProperties => ({ position: 'absolute', inset: 0, overflow: 'hidden',
  transformOrigin: `${FACE_POINT.x}px ${FACE_POINT.y}px`, transform: `scale(${s})` });

// the LIVE spine (carries the VO audio)
const SpineLive: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: '#000', overflow: 'hidden' }}>
      <div style={punchWrap(punchAt(f))}>
        <OffthreadVideo src={staticFile('spine.mp4')} style={spineStyle} />
      </div>
    </AbsoluteFill>
  );
};
// SpineFrozen: a faithful freeze of what AIRS at frame n (section 6a: a real <Freeze> inside a zero-offset Sequence, muted,
// the same FACE_REFRAME + punch transform, the same source). With no `frame` it freezes the CURRENT absolute frame = live.
const SpineFrozen: React.FC<{ frame?: number }> = ({ frame }) => {
  const absF = useAbs();
  const n = Math.max(0, Math.min(DUR - 1, frame ?? absF));
  return (
    <AbsoluteFill style={{ background: '#000', overflow: 'hidden' }}>
      <Sequence from={0} layout="none">
        <Freeze frame={n}>
          <div style={punchWrap(punchAt(n))}>
            <OffthreadVideo src={staticFile('spine.mp4')} muted style={spineStyle} />
          </div>
        </Freeze>
      </Sequence>
    </AbsoluteFill>
  );
};

// ============================================================================================================
// 3. THE COVER LAYER: one row per state / sub-point, straight from EDIT-PLAN.md. Ingress `tr` = the TRANSITIONS.md move:
//    xfade = hand:xfade-scale (0.40 s) · fade = hand:fade (0.50 s) · swap = a state swap of the same container (no ingress)
//    face = the face-owned cut (hand:film-burn sits on the face edge) · cut = hand:cut · lib = the library id in `lib`.
// ============================================================================================================
type Kind = 'vid' | 'still' | 'receipt' | 'chart' | 'deck' | 'container' | 'leadin' | 'leadout' | 'title';
type Cover = {
  tIn: number; tOut: number; kind: Kind; ref: string; state?: string; grp?: string; tr?: string; lib?: string;
  lead?: boolean; cap?: boolean; mv?: string; mo?: string; moDur?: number;
  z0?: number; z1?: number; pull?: number; fx?: number; fy?: number;
  wa?: number; wb?: number; wn?: number; wc?: number; wd?: number;
  bz?: { x: number; y: number; s: number };
};
// DIAGRAM_REFS: T1-dim, T1-ww2, T1-y2020, T2-dim, T2-zero, T2-hike, T2-cpi, T2-debt-133, T2-debt-116, C1-dim, C1-rates, C1-real-value, C1-who-pays, C1-all-lit, C23-hub, C23-mortgage, C23-business, C23-gov-debt, MAP-base, MAP-china, MAP-russia, MAP-iran, C19-dim, C19-debt, C19-crisis, C19-printing, C19-rescue
// (end declared refs)
// TRANSITIONS_WAIVED: motion-3d-pan-2-right — Mike's draft note 2026-10-30: the C22 Forbes receipt is a plain held full-frame screenshot, no 3D pan
// TRANSITIONS_WAIVED: motion-3d-pan-2-left — R-GRID-NEWS was never captured; its FALLBACK IMG-6 airs in the slot and the plan drops this receipt pan while IMG-6 airs (TRANSITION-PLAN fallback block)
const COVERS: Cover[] = [
  // ---------------- CH1 THE ADMISSION ----------------
  { tIn: 10.633, tOut: 13.74, kind: 'receipt', ref: 'C3-time-trump-inflation', grp: 'C3', tr: 'face', z0: 1.3, z1: 1.45, pull: 0.5 },
  { tIn: 13.74, tOut: 22.4, kind: 'receipt', ref: 'C3-time-trump-inflation-tight', grp: 'C3', tr: 'swap', z0: 1.0, z1: 1.08, pull: 0.3, wa: 13.74, wb: 17.94 },
  { tIn: 22.4, tOut: 27.38, kind: 'chart', ref: 'C4', tr: 'xfade' },
  { tIn: 27.38, tOut: 30.933, kind: 'vid', ref: 'BR-1-dollar-handover', tr: 'fade' },
  { tIn: 33.567, tOut: 35.66, kind: 'container', ref: 'H4-s1', state: 's1', grp: 'H4', tr: 'face' },
  { tIn: 35.66, tOut: 38.38, kind: 'container', ref: 'H4-s2', state: 's2', grp: 'H4', tr: 'swap' },
  { tIn: 38.38, tOut: 40.16, kind: 'container', ref: 'H4-s3', state: 's3', grp: 'H4', tr: 'swap' },
  { tIn: 40.16, tOut: 42.86, kind: 'vid', ref: 'BR-2-press-mics', tr: 'fade' },
  { tIn: 42.86, tOut: 45.82, kind: 'leadin', ref: 'CLIP-1', tr: 'fade' },
  { tIn: 45.82, tOut: 48.32, kind: 'leadout', ref: 'CLIP-1', tr: 'out' },
  { tIn: 48.32, tOut: 53.78, kind: 'receipt', ref: 'C24-bls-cpi-sept-2026-tight', tr: 'xfade', z0: 1.0, z1: 1.55, pull: 0.8, wa: 48.6, wb: 49.6 },
  { tIn: 53.78, tOut: 56.4, kind: 'deck', ref: 'T1-dim', state: 'dim', grp: 'T1', tr: 'xfade' },
  { tIn: 56.4, tOut: 59.1, kind: 'deck', ref: 'T1-ww2', state: 'ww2', grp: 'T1', tr: 'swap' },
  { tIn: 59.1, tOut: 60.26, kind: 'deck', ref: 'T1-y2020', state: 'y2020', grp: 'T1', tr: 'swap' },
  { tIn: 60.26, tOut: 64.7, kind: 'container', ref: 'H3', state: 'slam', tr: 'xfade' },
  { tIn: 64.7, tOut: 68.32, kind: 'vid', ref: 'BR-3-protest-megaphone-night', tr: 'fade' },
  { tIn: 68.32, tOut: 71.633, kind: 'still', ref: 'IMG-1-printing-press', tr: 'lib', lib: 'turbulent-h-1x' },
  { tIn: 77.467, tOut: 80.1, kind: 'vid', ref: 'BR-4-money-counter-macro', tr: 'face' },
  { tIn: 80.1, tOut: 84.0, kind: 'still', ref: 'IMG-2-vault-open', tr: 'lib', lib: 'turbulent-v-2x' },
  { tIn: 84.0, tOut: 91.0, kind: 'chart', ref: 'H5', tr: 'xfade' },
  { tIn: 96.9, tOut: 99.15, kind: 'container', ref: 'H2', state: 'single', tr: 'face' },
  // ---------------- CH2 THE DEBT NOBODY CAN PAY ----------------
  { tIn: 99.15, tOut: 101.533, kind: 'title', ref: 'title-CH2', tr: 'card' },
  { tIn: 104.0, tOut: 107.9, kind: 'receipt', ref: 'C5-debt-to-the-penny', grp: 'C5', tr: 'face', z0: 1.0, z1: 1.12, pull: 0.55 },
  { tIn: 107.9, tOut: 110.24, kind: 'receipt', ref: 'C5-debt-to-the-penny-tight', grp: 'C5', tr: 'swap', z0: 1.0, z1: 1.05, pull: 0.4 },
  { tIn: 110.24, tOut: 114.24, kind: 'container', ref: 'card-1.1+1.2-s1', state: 's1', grp: 'card-1.1', tr: 'xfade' },
  { tIn: 114.24, tOut: 118.34, kind: 'container', ref: 'card-1.1+1.2-s2', state: 's2', grp: 'card-1.1', tr: 'swap' },
  { tIn: 118.34, tOut: 131.133, kind: 'chart', ref: 'C6', tr: 'xfade' },
  { tIn: 137.267, tOut: 149.8, kind: 'chart', ref: 'C6', tr: 'face' },
  { tIn: 149.8, tOut: 151.92, kind: 'vid', ref: 'BR-5-trading-room-dark', tr: 'fade' },
  { tIn: 151.92, tOut: 156.24, kind: 'container', ref: 'card-2.1-s1', state: 's1', grp: 'card-2.1', tr: 'xfade' },
  { tIn: 156.24, tOut: 159.92, kind: 'container', ref: 'card-2.1-s2', state: 's2', grp: 'card-2.1', tr: 'swap' },
  { tIn: 159.92, tOut: 163.4, kind: 'vid', ref: 'BR-6-dc-columns-flags', tr: 'fade' },
  { tIn: 163.4, tOut: 167.86, kind: 'container', ref: 'card-2.2-s1', state: 's1', grp: 'card-2.2', tr: 'xfade' },
  { tIn: 167.86, tOut: 170.5, kind: 'container', ref: 'card-2.2-s2', state: 's2', grp: 'card-2.2', tr: 'swap' },
  { tIn: 179.8, tOut: 195.2, kind: 'chart', ref: 'C7', tr: 'face' },
  // ---------------- CH3 HOW YOU INFLATE A DEBT AWAY ----------------
  { tIn: 202.7, tOut: 205.8, kind: 'still', ref: 'IMG-9-1946-street', tr: 'face', mv: 'img/IMG-9-1946-street.mp4' },
  { tIn: 205.8, tOut: 225.8, kind: 'chart', ref: 'C2', tr: 'xfade' },
  { tIn: 225.8, tOut: 229.78, kind: 'container', ref: 'card-3.1-s1', state: 's1', grp: 'card-3.1', tr: 'xfade' },
  { tIn: 229.78, tOut: 232.26, kind: 'container', ref: 'card-3.1-s2', state: 's2', grp: 'card-3.1', tr: 'swap' },
  { tIn: 232.26, tOut: 238.967, kind: 'chart', ref: 'C2', tr: 'xfade' },
  { tIn: 245.267, tOut: 248.96, kind: 'vid', ref: 'BR-8-empty-street-2020', tr: 'face' },
  { tIn: 248.96, tOut: 251.86, kind: 'deck', ref: 'T2-dim', state: 'dim', grp: 'T2', tr: 'xfade' },
  { tIn: 251.86, tOut: 253.9, kind: 'deck', ref: 'T2-zero', state: 'zero', grp: 'T2', tr: 'swap' },
  { tIn: 253.9, tOut: 255.9, kind: 'deck', ref: 'T2-hike', state: 'hike', grp: 'T2', tr: 'swap' },
  { tIn: 255.9, tOut: 262.6, kind: 'deck', ref: 'T2-cpi', state: 'cpi', grp: 'T2', tr: 'swap' },
  { tIn: 262.6, tOut: 264.2, kind: 'deck', ref: 'T2-debt-133', state: 'debt-133', grp: 'T2', tr: 'swap' },
  { tIn: 264.2, tOut: 267.64, kind: 'deck', ref: 'T2-debt-116', state: 'debt-116', grp: 'T2', tr: 'swap' },
  { tIn: 267.64, tOut: 271.4, kind: 'still', ref: 'IMG-3-shrinking-piggy-bank', tr: 'lib', lib: 'turbulent-h-2x' },
  { tIn: 271.4, tOut: 274.1, kind: 'deck', ref: 'C1-dim', state: 'dim', grp: 'C1', tr: 'lib', lib: 'spin-3d-side-ease-up' },
  { tIn: 274.1, tOut: 277.9, kind: 'deck', ref: 'C1-rates', state: 'rates', grp: 'C1', tr: 'swap' },
  { tIn: 277.9, tOut: 280.5, kind: 'deck', ref: 'C1-real-value', state: 'real-value', grp: 'C1', tr: 'swap' },
  { tIn: 280.5, tOut: 281.42, kind: 'deck', ref: 'C1-who-pays', state: 'who-pays', grp: 'C1', tr: 'swap' },
  { tIn: 281.42, tOut: 285.6, kind: 'receipt', ref: 'C25-bis-wp363-abstract', grp: 'C25', tr: 'xfade', z0: 1.0, z1: 1.12, pull: 0.5 },
  { tIn: 285.6, tOut: 289.38, kind: 'receipt', ref: 'C25-bis-wp363-abstract-tight', grp: 'C25', tr: 'swap', z0: 1.0, z1: 1.06, pull: 0.3, wa: 285.8, wb: 288.84 },
  { tIn: 289.38, tOut: 294.42, kind: 'deck', ref: 'C1-all-lit', state: 'all-lit', grp: 'C1b', tr: 'lib', lib: 'melt-rgb-soft-short-1' },
  { tIn: 294.42, tOut: 298.4, kind: 'vid', ref: 'BR-9-couple-counting-cash', tr: 'fade' },
  { tIn: 298.4, tOut: 299.14, kind: 'container', ref: 'C1-breakout-s1', state: 's1', grp: 'C1-breakout', tr: 'xfade' },
  { tIn: 299.14, tOut: 300.84, kind: 'container', ref: 'C1-breakout-s2', state: 's2', grp: 'C1-breakout', tr: 'swap' },
  { tIn: 300.84, tOut: 303.36, kind: 'container', ref: 'C1-breakout-s3', state: 's3', grp: 'C1-breakout', tr: 'swap' },
  { tIn: 303.36, tOut: 306.24, kind: 'vid', ref: 'BR-10-nyc-market-ticker', tr: 'fade' },
  { tIn: 306.24, tOut: 310.26, kind: 'container', ref: 'card-4.5-s1', state: 's1', grp: 'card-4.5', tr: 'xfade' },
  { tIn: 310.26, tOut: 313.633, kind: 'container', ref: 'card-4.5-s2', state: 's2', grp: 'card-4.5', tr: 'swap' },
  // ---------------- CH4 THE BOND MARKET SAYS NO ----------------
  { tIn: 333.067, tOut: 333.36, kind: 'leadin', ref: 'CLIP-5', tr: 'face' },
  { tIn: 333.36, tOut: 336.02, kind: 'leadout', ref: 'CLIP-5', tr: 'out' },
  { tIn: 336.02, tOut: 337.4, kind: 'deck', ref: 'C23-hub', state: 'hub', grp: 'C23', tr: 'xfade' },
  { tIn: 337.4, tOut: 338.6, kind: 'deck', ref: 'C23-mortgage', state: 'mortgage', grp: 'C23', tr: 'swap' },
  { tIn: 338.6, tOut: 340.5, kind: 'deck', ref: 'C23-business', state: 'business', grp: 'C23', tr: 'swap' },
  { tIn: 340.5, tOut: 342.76, kind: 'deck', ref: 'C23-gov-debt', state: 'gov-debt', grp: 'C23', tr: 'swap' },
  { tIn: 342.76, tOut: 345.96, kind: 'vid', ref: 'BR-11-red-bear-candles', tr: 'cut' },
  { tIn: 345.96, tOut: 349.2, kind: 'receipt', ref: 'C9-tradingview-us10y-monthly', grp: 'C9', tr: 'xfade', z0: 1.0, z1: 1.04, pull: 0.15 },
  { tIn: 349.2, tOut: 353.6, kind: 'receipt', ref: 'C9-tradingview-us10y-daily-oct5', grp: 'C9', tr: 'swap', z0: 1.0, z1: 1.22, pull: 0.6 },
  { tIn: 353.6, tOut: 355.72, kind: 'receipt', ref: 'C9-tradingview-us10y-monthly', grp: 'C9', tr: 'swap', z0: 1.05, z1: 1.25, pull: 0.6 },
  { tIn: 355.72, tOut: 365.3, kind: 'chart', ref: 'C8', tr: 'xfade' },
  { tIn: 365.3, tOut: 367.2, kind: 'container', ref: 'card-5.1-s1', state: 's1', grp: 'card-5.1', tr: 'xfade' },
  { tIn: 367.2, tOut: 368.22, kind: 'container', ref: 'card-5.1-s2', state: 's2', grp: 'card-5.1', tr: 'swap' },
  { tIn: 368.22, tOut: 371.04, kind: 'container', ref: 'card-5.1-s3', state: 's3', grp: 'card-5.1', tr: 'swap' },
  { tIn: 371.04, tOut: 371.9, kind: 'container', ref: 'card-5.1-s4', state: 's4', grp: 'card-5.1', tr: 'swap' },
  { tIn: 376.667, tOut: 378.84, kind: 'vid', ref: 'BR-12-for-sale-sign', tr: 'face' },
  { tIn: 378.84, tOut: 380.7, kind: 'receipt', ref: 'C16-freddie-mac-pmms', grp: 'C16', tr: 'xfade', z0: 1.0, z1: 1.05, pull: 0.3 },
  { tIn: 380.7, tOut: 384.7, kind: 'receipt', ref: 'C16-freddie-mac-pmms-tight', grp: 'C16', tr: 'swap', z0: 1.0, z1: 1.05, pull: 0.3, fx: 752 },
  { tIn: 392.467, tOut: 393.5, kind: 'receipt', ref: 'C18-treasury-buybacks-2026-10-01', grp: 'C18', tr: 'face', z0: 1.0, z1: 1.06, pull: 0.4 },
  { tIn: 393.5, tOut: 398.52, kind: 'receipt', ref: 'C18-treasury-buybacks-2026-10-01-tight', grp: 'C18', tr: 'swap', z0: 1.0, z1: 1.12, pull: 0.55 },
  { tIn: 398.52, tOut: 402.38, kind: 'leadin', ref: 'CLIP-4', tr: 'fade' },
  { tIn: 402.38, tOut: 407.7, kind: 'leadout', ref: 'CLIP-4', tr: 'out' },
  { tIn: 407.7, tOut: 410.8, kind: 'receipt', ref: 'C13-fomc-sept-16-statement', grp: 'C13', tr: 'xfade', z0: 1.25, z1: 1.4, pull: 0.6 },
  { tIn: 410.8, tOut: 414.82, kind: 'receipt', ref: 'C13-fomc-sept-16-statement-tight', grp: 'C13', tr: 'swap', z0: 1.35, z1: 1.5, pull: 0.65, fx: 1000, fy: 380, wa: 411.0, wb: 412.1, wn: 2, wc: 413.2, wd: 414.0 },
  { tIn: 414.82, tOut: 417.18, kind: 'container', ref: 'card-6.2-s1', state: 's1', grp: 'card-6.2', tr: 'xfade' },
  { tIn: 417.18, tOut: 421.9, kind: 'container', ref: 'card-6.2-s2', state: 's2', grp: 'card-6.2', tr: 'swap' },
  // ---------------- CH5 THE EXCUSE: A RESET ----------------
  { tIn: 432.533, tOut: 435.94, kind: 'vid', ref: 'BR-13-grocery-receipt', tr: 'face' },
  { tIn: 435.94, tOut: 441.64, kind: 'container', ref: 'card-7.3', state: 'single', tr: 'xfade' },
  { tIn: 441.64, tOut: 443.86, kind: 'still', ref: 'IMG-4-rescue-helicopter', tr: 'lib', lib: 'turbulent-v-1x' },
  { tIn: 443.86, tOut: 446.48, kind: 'container', ref: 'card-7.1-s1', state: 's1', grp: 'card-7.1', tr: 'xfade' },
  { tIn: 446.48, tOut: 448.76, kind: 'container', ref: 'card-7.1-s2', state: 's2', grp: 'card-7.1', tr: 'swap' },
  { tIn: 448.76, tOut: 453.56, kind: 'container', ref: 'card-7.2-s1', state: 's1', grp: 'card-7.2', tr: 'xfade' },
  { tIn: 453.56, tOut: 455.04, kind: 'container', ref: 'card-7.2-s2', state: 's2', grp: 'card-7.2', tr: 'swap' },
  { tIn: 455.04, tOut: 458.94, kind: 'leadin', ref: 'CLIP-6', tr: 'fade' },
  { tIn: 458.94, tOut: 461.68, kind: 'leadout', ref: 'CLIP-6', tr: 'out' },
  { tIn: 461.68, tOut: 465.067, kind: 'receipt', ref: 'C10-schwab-project-syndicate-tight', tr: 'xfade', z0: 1.0, z1: 1.08, pull: 0.35, wa: 462.92, wb: 464.22 },
  { tIn: 476.867, tOut: 479.3, kind: 'vid', ref: 'BR-14-tanker-dusk-aerial', tr: 'face' },
  { tIn: 479.3, tOut: 486.4, kind: 'receipt', ref: 'C26-eia-brent-spot-table', grp: 'C26', tr: 'xfade', z0: 1.0, z1: 1.3, pull: 0.6 },
  { tIn: 486.4, tOut: 488.34, kind: 'receipt', ref: 'C26-eia-brent-spot-table-tight', grp: 'C26', tr: 'swap', z0: 1.05, z1: 1.2, pull: 0.6 },
  { tIn: 488.34, tOut: 491.72, kind: 'vid', ref: 'BR-15-layoff-box', tr: 'fade' },
  { tIn: 491.72, tOut: 494.8, kind: 'receipt', ref: 'C27-challenger-sept-2026', grp: 'C27', tr: 'xfade', mo: 'motion-3d-pan-1-down', moDur: 3.08 },
  { tIn: 494.8, tOut: 498.62, kind: 'receipt', ref: 'C27-challenger-sept-2026-tight', grp: 'C27', tr: 'swap', z0: 1.0, z1: 1.08, pull: 0.4, wa: 494.85, wb: 495.2, wn: 1, wc: 495.65, wd: 496.7 },
  { tIn: 498.62, tOut: 502.5, kind: 'still', ref: 'IMG-5-phone-fingerprint', tr: 'lib', lib: 'turbulent-h-2x' },
  { tIn: 502.5, tOut: 505.0, kind: 'container', ref: 'card-8.3-s1', state: 's1', grp: 'card-8.3', tr: 'xfade' },
  { tIn: 505.0, tOut: 510.22, kind: 'container', ref: 'card-8.3-s2', state: 's2', grp: 'card-8.3', tr: 'swap' },
  { tIn: 510.22, tOut: 511.42, kind: 'container', ref: 'card-8.3-s3', state: 's3', grp: 'card-8.3', tr: 'swap' },
  { tIn: 511.42, tOut: 517.72, kind: 'receipt', ref: 'C21-un-sdg-16-9-tight', tr: 'xfade', z0: 1.45, z1: 1.55, pull: 0.7, wa: 511.7, wb: 513.4 },
  { tIn: 517.72, tOut: 522.0, kind: 'receipt', ref: 'C20-eo-14178-header', grp: 'C20', tr: 'xfade', mo: 'motion-3d-offset-2-right-up', moDur: 4.28 },
  { tIn: 522.0, tOut: 526.88, kind: 'receipt', ref: 'C20-eo-14178-sec5-tight', grp: 'C20', tr: 'swap', z0: 1.0, z1: 1.08, pull: 0.35, wa: 522.3, wb: 524.74 },
  { tIn: 526.88, tOut: 530.68, kind: 'vid', ref: 'BR-16-laptop-night', tr: 'fade' },
  { tIn: 530.68, tOut: 535.4, kind: 'vid', ref: 'BR-17-convoy-lead', tr: 'fade', lead: true },
  // R-GRID-X / R-GRID-NEWS are NOT captured (EDIT-PLAN open decision 1): their planned FALLBACKS air in the two slots.
  { tIn: 535.4, tOut: 538.32, kind: 'vid', ref: 'BR-18-substation-dusk', tr: 'fade' },
  { tIn: 538.32, tOut: 541.54, kind: 'still', ref: 'IMG-6-skyline-blackout', tr: 'lib', lib: 'turbulent-v-3x' },
  { tIn: 541.54, tOut: 545.18, kind: 'vid', ref: 'BR-19-eu-flags', tr: 'fade' },
  { tIn: 545.18, tOut: 547.32, kind: 'vid', ref: 'BR-20-empty-boardroom', tr: 'fade' },
  { tIn: 547.32, tOut: 549.74, kind: 'deck', ref: 'MAP-base', state: 'base', grp: 'MAP', tr: 'xfade' },
  { tIn: 549.74, tOut: 550.7, kind: 'deck', ref: 'MAP-china', state: 'china', grp: 'MAP', tr: 'swap' },
  { tIn: 550.7, tOut: 552.2, kind: 'deck', ref: 'MAP-russia', state: 'russia', grp: 'MAP', tr: 'swap' },
  { tIn: 552.2, tOut: 555.78, kind: 'deck', ref: 'MAP-iran', state: 'iran', grp: 'MAP', tr: 'swap' },
  { tIn: 555.78, tOut: 558.7, kind: 'deck', ref: 'C19-dim', state: 'dim', grp: 'C19', tr: 'lib', lib: 'melt-rgb-soft-1' },
  { tIn: 558.7, tOut: 560.9, kind: 'deck', ref: 'C19-debt', state: 'debt', grp: 'C19', tr: 'swap' },
  { tIn: 560.9, tOut: 562.2, kind: 'deck', ref: 'C19-crisis', state: 'crisis', grp: 'C19', tr: 'swap' },
  { tIn: 562.2, tOut: 565.0, kind: 'deck', ref: 'C19-printing', state: 'printing', grp: 'C19', tr: 'swap' },
  { tIn: 565.0, tOut: 568.133, kind: 'deck', ref: 'C19-rescue', state: 'rescue', grp: 'C19', tr: 'swap' },
  // ---------------- CH6 WHERE BILLIONAIRES GET MADE ----------------
  { tIn: 582.233, tOut: 584.1, kind: 'receipt', ref: 'C28-fred-walcl-2019-2022-page', grp: 'C28', tr: 'face', mo: 'motion-3d-orbit-2-left-up', moDur: 1.867 },
  { tIn: 584.1, tOut: 587.0, kind: 'receipt', ref: 'C28-fred-walcl-2019-2022', grp: 'C28', tr: 'swap', z0: 1.0, z1: 1.06, pull: 0.3 },
  { tIn: 587.0, tOut: 600.66, kind: 'chart', ref: 'C17', tr: 'lib', lib: 'melt-rgb-soft-3' },
  { tIn: 600.66, tOut: 607.72, kind: 'receipt', ref: 'C22-forbes-2021-billionaires', tr: 'xfade', z0: 1.0, z1: 1.0, pull: 0 },   // Mike 2026-10-30: a plain full-frame screenshot held for the beat (the 3D pan froze mid-move)
  { tIn: 607.72, tOut: 615.28, kind: 'chart', ref: 'C17', tr: 'xfade', bz: { x: 1410, y: 422, s: 2.4 } },
  { tIn: 615.28, tOut: 618.74, kind: 'vid', ref: 'BR-21-jet-nose-golden', tr: 'fade' },
  { tIn: 618.74, tOut: 626.42, kind: 'container', ref: 'card-9.1-s1', state: 's1', grp: 'card-9.1', tr: 'xfade' },
  { tIn: 626.42, tOut: 627.54, kind: 'container', ref: 'card-9.1-count', state: 'n118-n137', grp: 'card-9.1', tr: 'swap' },
  { tIn: 627.54, tOut: 629.4, kind: 'container', ref: 'card-9.1-s2', state: 's2', grp: 'card-9.1', tr: 'swap' },
  { tIn: 634.6, tOut: 637.5, kind: 'receipt', ref: 'C29-tradingview-btcusd-2020-2021', grp: 'C29', tr: 'face', z0: 1.0, z1: 1.04, pull: 0.2 },
  { tIn: 637.5, tOut: 641.8, kind: 'receipt', ref: 'C29-fred-cbbtcusd-mar2020', grp: 'C29', tr: 'swap', z0: 1.3, z1: 1.45, pull: 0.65 },
  { tIn: 641.8, tOut: 646.1, kind: 'receipt', ref: 'C29-fred-cbbtcusd-nov2021', grp: 'C29', tr: 'swap', z0: 1.3, z1: 1.45, pull: 0.65 },
  { tIn: 646.1, tOut: 648.3, kind: 'receipt', ref: 'C29-tradingview-btcusd-2020-2021', grp: 'C29', tr: 'swap', z0: 1.06, z1: 1.0, pull: 0.1 },
  { tIn: 648.3, tOut: 651.26, kind: 'container', ref: 'card-9.3-s1', state: 's1', grp: 'card-9.3', tr: 'xfade' },
  { tIn: 651.26, tOut: 657.2, kind: 'container', ref: 'card-9.3-s2', state: 's2', grp: 'card-9.3', tr: 'swap' },
  { tIn: 657.2, tOut: 661.2, kind: 'vid', ref: 'BR-22-dollar-printing', tr: 'fade' },
  { tIn: 661.2, tOut: 663.1, kind: 'receipt', ref: 'C30-bitcoin-core-amount-h', grp: 'C30', tr: 'xfade', z0: 1.0, z1: 1.15, pull: 0.5 },
  { tIn: 663.1, tOut: 667.66, kind: 'receipt', ref: 'C30-bitcoin-core-amount-h-tight', grp: 'C30', tr: 'swap', z0: 1.0, z1: 1.1, pull: 0.45, wa: 663.2, wb: 664.0 },
  { tIn: 667.66, tOut: 670.24, kind: 'vid', ref: 'BR-23-fed-seal-macro', tr: 'fade' },
  { tIn: 670.24, tOut: 673.72, kind: 'still', ref: 'IMG-7-kaspa-coin', tr: 'lib', lib: 'turbulent-h-3x' },
  { tIn: 673.72, tOut: 678.267, kind: 'container', ref: 'card-10.3', state: 'single', tr: 'xfade' },
  { tIn: 692.633, tOut: 696.58, kind: 'still', ref: 'IMG-8-penthouse-dawn', tr: 'face' },
  { tIn: 696.58, tOut: 702.76, kind: 'container', ref: 'card-10.4', state: 'single', tr: 'xfade' },
  // ---------------- CH7 THE CLOSE ----------------
  { tIn: 702.76, tOut: 708.82, kind: 'container', ref: 'card-11.1-s1', state: 's1', grp: 'card-11.1', tr: 'xfade' },
  { tIn: 708.82, tOut: 712.24, kind: 'container', ref: 'card-11.1-s2', state: 's2', grp: 'card-11.1', tr: 'swap' },
  { tIn: 712.24, tOut: 716.92, kind: 'container', ref: 'card-11.1-s3', state: 's3', grp: 'card-11.1', tr: 'swap' },
  { tIn: 716.92, tOut: 719.0, kind: 'container', ref: 'card-11.1-s4', state: 's4', grp: 'card-11.1', tr: 'swap' },
];

// 24 / 25 fps b-roll plays frame-for-frame (comp-build section 11): playbackRate = 30 / fps
const VID_FPS: Record<string, number> = {
  'BR-4-money-counter-macro': 25 / 1,
  'BR-5-trading-room-dark': 24 / 1,
  'BR-8-empty-street-2020': 24000 / 1001,
  'BR-9-couple-counting-cash': 25 / 1,
  'BR-11-red-bear-candles': 25 / 1,
  'BR-12-for-sale-sign': 25 / 1,
  'BR-13-grocery-receipt': 24000 / 1001,
  'BR-18-substation-dusk': 25 / 1,
  'BR-20-empty-boardroom': 25 / 1,
  'BR-21-jet-nose-golden': 24 / 1,
  'BR-23-fed-seal-macro': 25 / 1,
  'IMG-9-1946-street': 24 / 1,
};
const rateOf = (ref: string) => (VID_FPS[ref] ? FPS / VID_FPS[ref] : 1);

// The captions are generated (ResetCaptions.ts); CAPTION_SRC restates its windows as literals for lint_covers.py, and the
// comp refuses to render if the two ever drift apart.
const CAPTION_SRC: [number, number][] = [[0.000, 10.633], [71.633, 77.467], [91.000, 96.900], [131.133, 137.267], [170.500, 179.800], [195.200, 202.700], [238.967, 245.267], [313.633, 333.067], [384.700, 392.467], [421.900, 432.533], [465.067, 476.867], [568.133, 582.233], [629.400, 634.600], [678.267, 692.633], [719.000, 748.200]];
if (JSON.stringify(CAPTION_SRC) !== JSON.stringify(CAPTION_WINDOWS)) throw new Error('Reset: CAPTION_SRC drifted from ResetCaptions.ts CAPTION_WINDOWS');

// ---- receipt captures: natural size, camera focus (the baked highlight / the boxed figure), the highlight line boxes
//      (measured off the PNGs) a wipe reveals. A capture's highlight is baked; before its [HIGHLIGHT] cue the comp shows
//      the boxes un-highlighted (luma of the red channel), then wipes the yellow back in left to right, line by line.
type Rcp = { w: number; h: number; fx: number; fy: number; hl?: number[][] };
const RCP: Record<string, Rcp> = {
  'C3-time-trump-inflation': { w: 3840, h: 1910, fx: 1625, fy: 710, hl: [[1148, 684, 2104, 736]] },
  'C3-time-trump-inflation-tight': { w: 2000, h: 660, fx: 1105, fy: 360, hl: [[628, 334, 1584, 386]] },
  'C24-bls-cpi-sept-2026-tight': { w: 2120, h: 400, fx: 928, fy: 271, hl: [[552, 244, 1304, 298]] },
  'C5-debt-to-the-penny': { w: 2480, h: 1708, fx: 1015, fy: 1207 },
  'C5-debt-to-the-penny-tight': { w: 2162, h: 774, fx: 1070, fy: 610 },
  'C25-bis-wp363-abstract': { w: 3840, h: 1902, fx: 2500, fy: 812, hl: [[2078, 755, 3322, 814], [1714, 808, 2074, 869]] },
  'C25-bis-wp363-abstract-tight': { w: 1880, h: 663, fx: 940, fy: 255, hl: [[508, 197, 1752, 256], [144, 250, 504, 311]] },
  'C9-tradingview-us10y-monthly': { w: 3040, h: 2080, fx: 2700, fy: 600 },
  'C9-tradingview-us10y-daily-oct5': { w: 3040, h: 2080, fx: 2090, fy: 420 },
  'C16-freddie-mac-pmms': { w: 1504, h: 1012, fx: 752, fy: 640 },
  'C16-freddie-mac-pmms-tight': { w: 1504, h: 864, fx: 760, fy: 530 },
  'C18-treasury-buybacks-2026-10-01': { w: 3840, h: 1636, fx: 1745, fy: 1076 },
  'C18-treasury-buybacks-2026-10-01-tight': { w: 2245, h: 960, fx: 1116, fy: 731 },
  'C13-fomc-sept-16-statement': { w: 3840, h: 2200, fx: 1500, fy: 960, hl: [[1158, 754, 2248, 808], [774, 800, 1008, 854], [774, 1114, 1160, 1168]] },
  'C13-fomc-sept-16-statement-tight': { w: 2800, h: 840, fx: 990, fy: 380, hl: [[638, 174, 1728, 228], [254, 220, 488, 274], [254, 534, 640, 588]] },
  'C10-schwab-project-syndicate-tight': { w: 1851, h: 824, fx: 900, fy: 560, hl: [[480, 542, 1488, 604], [302, 604, 1298, 662]] },
  'C26-eia-brent-spot-table': { w: 2120, h: 1034, fx: 1785, fy: 260 },
  'C26-eia-brent-spot-table-tight': { w: 1951, h: 631, fx: 796, fy: 532 },
  'C27-challenger-sept-2026': { w: 1836, h: 2376, fx: 918, fy: 540, hl: [[1063, 1849, 1596, 1895], [709, 1891, 1397, 1939]] },
  'C27-challenger-sept-2026-tight': { w: 1735, h: 737, fx: 1100, fy: 560, hl: [[1016, 513, 1549, 559], [662, 555, 1350, 601]] },
  'C21-un-sdg-16-9-tight': { w: 2376, h: 497, fx: 700, fy: 258, hl: [[309, 231, 1105, 285]] },
  'C20-eo-14178-header': { w: 3840, h: 1874, fx: 1920, fy: 937 },
  'C20-eo-14178-sec5-tight': { w: 2100, h: 575, fx: 1030, fy: 334, hl: [[932, 268, 1900, 334], [144, 334, 1096, 400]] },
  'C28-fred-walcl-2019-2022-page': { w: 2800, h: 1444, fx: 1400, fy: 722 },
  'C28-fred-walcl-2019-2022': { w: 2680, h: 1092, fx: 1340, fy: 546 },
  'C22-forbes-2021-billionaires': { w: 2640, h: 1320, fx: 1290, fy: 1215 },
  'C29-tradingview-btcusd-2020-2021': { w: 3040, h: 2080, fx: 1520, fy: 1040 },
  'C29-fred-cbbtcusd-mar2020': { w: 2679, h: 1830, fx: 380, fy: 1421 },
  'C29-fred-cbbtcusd-nov2021': { w: 2679, h: 1830, fx: 390, fy: 1421 },
  'C30-bitcoin-core-amount-h': { w: 3840, h: 1480, fx: 700, fy: 860, hl: [[78, 824, 942, 896]] },
  'C30-bitcoin-core-amount-h-tight': { w: 1759, h: 772, fx: 595, fy: 486, hl: [[163, 450, 1027, 522]] },
};

// cut-frame stills for the VIDEO side of an engine transition (comp-build section 6a cost trap): the frame the clip shows at
// the engine window's first frame, pre-extracted with ffmpeg into assets/transitions/cutframes/.
const CUTFRAME: Record<string, string> = {
  'BR-3-protest-megaphone-night': 'transitions/cutframes/BR-3-protest-megaphone-night.jpg',
  'BR-4-money-counter-macro': 'transitions/cutframes/BR-4-money-counter-macro.jpg',
  'BR-18-substation-dusk': 'transitions/cutframes/BR-18-substation-dusk.jpg',
  'BR-23-fed-seal-macro': 'transitions/cutframes/BR-23-fed-seal-macro.jpg',
};

// ---- the ingress plumbing: pre-roll (frames before tIn the incoming row mounts) + opacity ramp per move
const MOVES: Record<string, { pre: number; ramp: number; scaleIn: boolean }> = {
  xfade: { pre: 6, ramp: 12, scaleIn: true },     // hand:xfade-scale 0.40 s, 0.93 -> 1
  fade: { pre: 7, ramp: 15, scaleIn: false },     // hand:fade 0.50 s
  swap: { pre: 3, ramp: 5, scaleIn: false },      // a state swap: a 5-frame dissolve, no ingress move
  out: { pre: 15, ramp: 0, scaleIn: false },      // a lead-out still under the clip's insert-out fade
};
const INSERT_FADE = 15;                           // insert-in / insert-out hand:fade 0.50 s
const faceEndAt = (t: number) => FACE_WIN.findIndex(([, b]) => Math.abs(b - t) < 0.005);
const faceStartAt = (t: number) => FACE_WIN.findIndex(([a]) => Math.abs(a - t) < 0.005);
const startOf = (c: Cover) => {
  const k = faceEndAt(c.tIn);
  if (k >= 0) return FACE_FR[k][1];                 // the cover cuts in on the measured first black frame
  return c.kind === 'title' ? Fe(c.tIn) : F(c.tIn);
};
const endOf = (c: Cover) => {
  const k = faceStartAt(c.tOut);
  if (k >= 0) return FACE_FR[k][0];                 // ... and hands over on the measured first face frame
  return Fe(c.tOut);
};
const contiguous = (a: Cover, b: Cover) => Math.abs(a.tOut - b.tIn) < 0.005;
const ROWS = COVERS.map((c, i) => {
  const mv = MOVES[c.tr ?? ''];
  const next = COVERS[i + 1];
  const nmv = next && contiguous(c, next) ? MOVES[next.tr ?? ''] : undefined;
  let post = nmv && next.tr !== 'out' ? Math.max(0, nmv.ramp - nmv.pre) : 0;
  if (c.kind === 'leadin') post = INSERT_FADE;     // held under the clip's insert-in fade
  return { c, i, from: startOf(c) - (mv ? mv.pre : 0), to: endOf(c) + post, ramp: mv ? mv.ramp : 0, scaleIn: mv ? mv.scaleIn : false };
});
// group spans (a container / diagram group pushes continuously across its state swaps)
const GROUPS: Record<string, [number, number]> = {};
for (const c of COVERS) {
  const g = c.grp ?? c.ref;
  GROUPS[g] = GROUPS[g] ? [Math.min(GROUPS[g][0], c.tIn), Math.max(GROUPS[g][1], c.tOut)] : [c.tIn, c.tOut];
}

// ============================================================================================================
// 4. COVER NODES. Every node reads the ABSOLUTE clock, so an engine may mount it anywhere.
// ============================================================================================================
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const prog = (t: number, a: number, b: number) => clamp01((t - a) / Math.max(1e-6, b - a));
const easeOut = (x: number) => 1 - Math.pow(1 - clamp01(x), 3);
const easeInOutSine = (x: number) => -(Math.cos(Math.PI * clamp01(x)) - 1) / 2;
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const fill: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };

const ChartFor: React.FC<{ c: Cover }> = ({ c }) => {
  const absF = useAbs();
  const t = srcOf(absF);
  let el: React.ReactNode = null;
  if (c.ref === 'C4') el = <ChartC4 t={t} />;
  else if (c.ref === 'H5') el = <ChartH5 t={t} />;
  else if (c.ref === 'C6') el = <ChartC6 t={t} />;
  else if (c.ref === 'C7') el = <ChartC7 t={t} />;
  else if (c.ref === 'C2') el = <ChartC2 t={t} />;
  else if (c.ref === 'C8') el = <ChartC8 t={t} />;
  else if (c.ref === 'C17') el = <ChartC17 t={t} />;
  else throw new Error(`Reset: no animated chart for ${c.ref}`);
  if (!c.bz) return <AbsoluteFill>{el}</AbsoluteFill>;
  // BRAAM beat: an eased (inOut sine) push over EXACTLY the pause frames, the figure moved to frame centre, then held
  const p0 = Fe(BRAAM_AT);
  const n = pauseF(INSERTS.find((p) => p.at === BRAAM_AT)!.dur);
  const p = easeInOutSine((absF - p0) / n);
  const S = lerp(1, c.bz.s, p);
  const tx = lerp(c.bz.x, 960, p) - c.bz.x * S;
  const ty = lerp(c.bz.y, 540, p) - c.bz.y * S;
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: '#F6F4EE' }}>
      <AbsoluteFill style={{ transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${S})` }}>{el}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// a still image: slow push (the ChatGPT stills); an img-motion clip plays instead when the slot names one (section 3c)
const StillCover: React.FC<{ c: Cover }> = ({ c }) => {
  const absF = useAbs();
  const lt = (absF - F(c.tIn)) / FPS;
  if (c.mv) {
    // the Seedance clip (Mike approved 2026-10-29), from clip 0, cut at the slot end, no extra push; the still is the fallback
    return (
      <AbsoluteFill style={{ background: '#000' }}>
        <Sequence from={0} layout="none">
          <Freeze frame={Math.max(0, Math.round(lt * FPS * rateOf(c.ref)))}>
            <OffthreadVideo src={staticFile(c.mv)} muted style={fill} />
          </Freeze>
        </Sequence>
      </AbsoluteFill>
    );
  }
  const s = lerp(1.0, 1.06, prog(lt, 0, c.tOut - c.tIn));
  return (
    <AbsoluteFill style={{ background: '#000', overflow: 'hidden' }}>
      <Img src={staticFile(`img/${c.ref}.png`)} style={{ ...fill, transform: `scale(${s})`, transformOrigin: '50% 45%' }} />
    </AbsoluteFill>
  );
};

// a video b-roll clip, muted, from clip 0 at the row's first mounted frame, frame-for-frame for 24 / 25 fps sources
const VidCover: React.FC<{ c: Cover }> = ({ c }) => (
  <AbsoluteFill style={{ background: '#000' }}>
    <OffthreadVideo src={staticFile(`vid/${c.ref}.mp4`)} muted playbackRate={rateOf(c.ref)} style={fill} />
  </AbsoluteFill>
);

// receipt camera: full WIDTH fit, top-aligned when taller than the frame; a push toward the focus point
const camera = (r: Rcp, z: number, pull: number, fx: number, fy: number) => {
  const S0 = 1920 / r.w;
  const S = S0 * z;
  const baseY = r.h * S0 > 1080 ? 0 : (1080 - r.h * S0) / 2;
  const bx = fx * S0, by = baseY + fy * S0;            // focus on screen at z = 1
  const target = { x: lerp(bx, 960, pull), y: lerp(by, 540, pull) };
  let tx = target.x - fx * S, ty = target.y - fy * S;
  const W = r.w * S, H = r.h * S;
  tx = W >= 1920 ? Math.min(0, Math.max(1920 - W, tx)) : (1920 - W) / 2;
  ty = H >= 1080 ? Math.min(0, Math.max(1080 - H, ty)) : (1080 - H) / 2;
  return { tx, ty, S };
};
const wipeFrac = (c: Cover, r: Rcp, i: number, t: number) => {
  if (!r.hl || c.wa === undefined || c.wb === undefined) return 0;           // un-highlighted until this row's cue
  const n1 = c.wn ?? r.hl.length;
  const [a, b, lo, hi] = i < n1 ? [c.wa, c.wb, 0, n1] : [c.wc ?? 1e9, c.wd ?? 1e9, n1, r.hl.length];
  const widths = r.hl.slice(lo, hi).map((bx) => bx[2] - bx[0]);
  const total = widths.reduce((s, w) => s + w, 0);
  const before = widths.slice(0, i - lo).reduce((s, w) => s + w, 0);
  const done = prog(t, a, b) * total;
  return clamp01((done - before) / widths[i - lo]);
};
const ReceiptView: React.FC<{ c: Cover; still?: boolean }> = ({ c, still }) => {
  const absF = useAbs();
  const t = srcOf(absF);
  const r = RCP[c.ref];
  if (!r) throw new Error(`Reset: no receipt config for ${c.ref}`);
  const p = easeOut(prog(t, c.tIn, c.tOut));
  const z = still ? 1 : lerp(c.z0 ?? 1, c.z1 ?? 1.06, p);
  const pull = still ? 0 : lerp(0, c.pull ?? 0.4, p);
  const { tx, ty, S } = camera(r, z, pull, c.fx ?? r.fx, c.fy ?? r.fy);
  const src = staticFile(`receipts/${c.ref}.png`);
  return (
    <AbsoluteFill style={{ background: '#ECEAE4', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: r.w, height: r.h, transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${S})`,
        boxShadow: '0 30px 80px rgba(20,22,26,.18)' }}>
        <Img src={src} style={{ position: 'absolute', left: 0, top: 0, width: r.w, height: r.h }} />
        {(r.hl ?? []).map((bx, i) => {
          const rev = wipeFrac(c, r, i, t);
          const x0 = bx[0] + (bx[2] - bx[0]) * rev;
          if (x0 >= bx[2] - 0.5) return null;
          return (
            <div key={i} style={{ position: 'absolute', left: x0, top: bx[1], width: bx[2] - x0, height: bx[3] - bx[1], overflow: 'hidden' }}>
              <Img src={src} style={{ position: 'absolute', left: -x0, top: -bx[1], width: r.w, height: r.h, filter: 'url(#rs-unhighlight)' }} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
// [MOTION] lib:motion-3d-* : the Motion3D engine wraps the live receipt for its slot; its clock is a Freeze fitted to the move
const MotionWrap: React.FC<{ c: Cover }> = ({ c }) => {
  const absF = useAbs();
  const row = getTransition(c.mo!);
  if (!row) throw new Error(`Reset: unknown motion id ${c.mo}`);
  const Engine = ENGINES[row.engine] as React.FC<any>;
  const lt = srcOf(absF) - c.tIn;
  const mt = clamp01(lt / (c.moDur ?? c.tOut - c.tIn)) * 4.96;
  return (
    <AbsoluteFill style={{ background: '#ECEAE4' }}>
      <Sequence from={0} layout="none">
        <Freeze frame={Math.round(mt * FPS)}>
          <Engine from={null} outClip={() => <ReceiptView c={c} still />} params={row.params} durationInFrames={framesForRow(row, FPS)} />
        </Freeze>
      </Sequence>
    </AbsoluteFill>
  );
};

// card / diagram PNG states: one container at a time, a gentle continuous push across the group (section 7a: never dead still)
const COUNT_FRAMES = Array.from({ length: 20 }, (_, i) => `card-9.1-n${118 + i}`);
const SlideCover: React.FC<{ c: Cover }> = ({ c }) => {
  const absF = useAbs();
  const t = srcOf(absF);
  const g = GROUPS[c.grp ?? c.ref];
  const amt = c.kind === 'deck' ? 0.03 : 0.025;
  const s = 1 + amt * easeInOutSine(prog(t, g[0], g[1]));
  const dir = c.kind === 'deck' ? 'diagrams' : 'card-slides';
  let file = c.ref;
  if (c.ref === 'card-9.1-count') file = COUNT_FRAMES[Math.min(19, Math.floor(prog(t, c.tIn, c.tOut) * 20))];
  const base = <Img src={staticFile(`${dir}/${file}.png`)} style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080 }} />;
  if (c.ref === 'H3') {
    // [CONTAINER] H3: the card opens on the plate, the words held back; 'ON PURPOSE?' SLAMS in on 'on purpose' (62.76), 1.15 -> 1.0 in 4 frames
    const SLAM = 62.76;
    const k = prog(t, SLAM, SLAM + 4 / FPS);
    const sc = lerp(1.15, 1.0, easeOut(k));
    return (
      <AbsoluteFill style={{ background: '#F6F4EE', overflow: 'hidden' }}>
        <AbsoluteFill style={{ transform: `scale(${s})` }}>
          {base}
          {/* the words held back: a feathered card-white plate over the type (no hard edge to read as a box) */}
          <div style={{ position: 'absolute', left: 215, top: 280, width: 1330, height: 480,
            WebkitMaskImage: 'linear-gradient(to right, transparent 0px, black 30px, black 1300px, transparent 1330px)' }}>
            <div style={{ position: 'absolute', inset: 0, background: '#FDFDFD',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0px, black 30px, black 450px, transparent 480px)' }} />
          </div>
          {t >= SLAM && (
            <div style={{ position: 'absolute', left: 245, top: 300, width: 1275, height: 432, overflow: 'visible', transform: `scale(${sc})`, transformOrigin: '635px 215px' }}>
              <Img src={staticFile('card-slides/H3.png')} style={{ position: 'absolute', left: -245, top: -300, width: 1920, height: 1080,
                clipPath: 'inset(300px 400px 348px 245px)' }} />
            </div>
          )}
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: '#F6F4EE', overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `scale(${s})` }}>{base}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// a clip insert's lead still: its FIRST frame under the set-up line, its LAST frame under the resume line (a real Freeze)
const LeadStill: React.FC<{ c: Cover }> = ({ c }) => {
  const clip = CLIP_INSERTS.find((x) => x.id === c.ref)!;
  const n = c.kind === 'leadin' ? 0 : clip.frames - 1;
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <Sequence from={0} layout="none">
        <Freeze frame={n}>
          <OffthreadVideo src={staticFile(clip.file)} muted style={fill} />
        </Freeze>
      </Sequence>
    </AbsoluteFill>
  );
};

const CoverNode: React.FC<{ c: Cover; cutStill?: boolean }> = ({ c, cutStill }) => {
  switch (c.kind) {
    case 'chart': return <ChartFor c={c} />;
    case 'still': return <StillCover c={c} />;
    case 'vid':
      if (cutStill && CUTFRAME[c.ref]) return <AbsoluteFill><Img src={staticFile(CUTFRAME[c.ref])} style={fill} /></AbsoluteFill>;
      return <VidCover c={c} />;
    case 'receipt': return c.mo ? <MotionWrap c={c} /> : <ReceiptView c={c} />;
    case 'deck':
    case 'container': return <SlideCover c={c} />;
    case 'leadin':
    case 'leadout': return <LeadStill c={c} />;
    case 'title': return <TitleScene c={c} />;
  }
};

// ---- [CARD] CH2 'THE DEBT NOBODY CAN PAY': rmn:slide (from-right), the ONE card pick; a self-contained scene over the
//      outgoing H2 card, it starts on the pause's first frame and holds through it and past it under 'Nobody can pay.'
const CARD_LEAD = 0;                 // seconds the scene starts before the pause
const CARD_TURN = 0.5;               // the slide
const CARD_HOLD_AFTER = 101.533 - TITLE_AT;
const CARD_READABLE = CARD_LEAD + PAUSE - H2_HOLD - CARD_TURN + CARD_HOLD_AFTER;
if (CARD_READABLE < 1.0) throw new Error(`Reset: the CH2 title is readable for ${CARD_READABLE.toFixed(2)} s (< 1.0 s, comp-build section 6)`);
const TitleScene: React.FC<{ c: Cover }> = ({ c }) => {
  const turn = Math.round(CARD_TURN * FPS);
  const hold = Math.round(H2_HOLD * FPS);
  const total = endOf(c) - startOf(c);
  const h2 = COVERS.find((x) => x.ref === 'H2')!;
  return (
    <AbsoluteFill style={{ background: '#F6F4EE' }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={hold + turn}>
          <SlideCover c={h2} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: 'from-right' })} timing={linearTiming({ durationInFrames: turn })} />
        <TransitionSeries.Sequence durationInFrames={total}>
          <AbsoluteFill><Img src={staticFile('title-slides/title-CH2.png')} style={fill} /></AbsoluteFill>
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};

// ---- the cover track
const CoverTrack: React.FC = () => (
  <>
    {ROWS.map(({ c, i, from, to, ramp, scaleIn }) => (
      <Sequence key={i} from={from} durationInFrames={Math.max(1, to - from)}>
        <RampIn ramp={ramp} scaleIn={scaleIn}>
          {c.kind === 'vid' ? <VidCover c={c} /> : <CoverNode c={c} />}
        </RampIn>
      </Sequence>
    ))}
  </>
);
const RampIn: React.FC<{ ramp: number; scaleIn: boolean; children: React.ReactNode }> = ({ ramp, scaleIn, children }) => {
  const f = useCurrentFrame();
  if (!ramp) return <AbsoluteFill>{children}</AbsoluteFill>;
  const p = easeOut(f / ramp);
  return <AbsoluteFill style={{ opacity: clamp01(f / ramp), transform: scaleIn ? `scale(${lerp(0.93, 1, p)})` : undefined }}>{children}</AbsoluteFill>;
};

// ============================================================================================================
// 5. LIBRARY TRANSITIONS between covers (glitch stills, the SPIN, the MELTs): TransitionClip in a Sequence of EXACTLY the
//    engine window, its swap frame ON the cut, nodes on the absolute clock, a video side handed over as its cut-frame still.
// ============================================================================================================
const swapFrame = (id: string, win: number) => {
  const row = getTransition(id)!;
  const p = row.params as any;
  if (row.engine === 'GlitchTurbulentDisplace') return Math.ceil(p.cut * FPS - 1e-6);
  if (row.engine === 'PerspectiveEase') return Math.ceil(p.outPhase.win[0] * FPS - 1e-6);
  if (row.engine === 'MeltRGB') return Math.ceil(p.cut * (win - 1) - 1e-6);
  return Math.round(win / 2);
};
const LIB_TR = COVERS.map((c, i) => ({ c, prev: COVERS[i - 1] })).filter(({ c }) => c.tr === 'lib').map(({ c, prev }) => {
  const id = c.lib!;
  const win = framesForRow(getTransition(id)!, FPS);
  let start = F(c.tIn) - swapFrame(id, win);
  // MAP -> C19 melt: the re-fused (last) frame IS the PUSH #2 drop frame 556.16 (TRANSITIONS.md open question, applied)
  if (id === 'melt-rgb-soft-1') start = F(556.16) - win + 1;
  return { id, c, prev, start, win };
});
const Overscan: React.FC<{ bg: string; children: React.ReactNode }> = ({ bg, children }) => (
  <AbsoluteFill>
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, background: bg, boxShadow: `0 0 0 80000px ${bg}` }} />
    {children}
  </AbsoluteFill>
);
const bgOf = (c: Cover) => (c.kind === 'receipt' ? '#ECEAE4' : '#F6F4EE');
const LibTransitions: React.FC = () => (
  <>
    {LIB_TR.map(({ id, c, prev, start, win }) => {
      const melt = getTransition(id)!.engine === 'MeltRGB';
      const node = (x: Cover) => (melt ? <Overscan bg={bgOf(x)}><CoverNode c={x} cutStill /></Overscan> : <CoverNode c={x} cutStill />);
      return (
        <Sequence key={id + c.tIn} from={start} durationInFrames={win}>
          <TransitionClip id={id} cutFrame={Math.round(win / 2)} sfx={false} outgoing={() => node(prev)} incoming={() => node(c)} />
        </Sequence>
      );
    })}
  </>
);
// wired ids (grep against TRANSITION-PLAN.json): turbulent-h-1x · turbulent-v-2x · turbulent-h-2x · turbulent-v-1x · turbulent-h-3x ·
// turbulent-v-3x (the IMG-6 fallback) · spin-3d-side-ease-up · melt-rgb-soft-short-1 · melt-rgb-soft-1 · melt-rgb-soft-3 (the
// `lib` fields above) · motion-3d-pan-1-down · motion-3d-offset-2-right-up · motion-3d-orbit-2-left-up · motion-3d-pan-2-right (`mo`).

// ============================================================================================================
// 6. CLIP INSERTS (section 3d): over each insert's paused window the clip plays FULL-FRAME and MUTED (its voice is in the VO),
//    insert-in / insert-out = hand:fade 0.5 s against the lead-in / lead-out stills of the cover track.
// ============================================================================================================
const InsertLayer: React.FC = () => (
  <>
    {CLIP_INSERTS.map((k) => {
      const dur = INSERTS.find((p) => p.at === k.at)!.dur;
      const n = Math.min(k.frames, pauseF(dur));
      return (
        <Sequence key={k.id} from={Fe(k.at) + k.shift} durationInFrames={n}>
          <InsertClip file={k.file} n={n} />
        </Sequence>
      );
    })}
  </>
);
const InsertClip: React.FC<{ file: string; n: number }> = ({ file, n }) => {
  const f = useCurrentFrame();
  const op = Math.min(clamp01(f / INSERT_FADE), clamp01((n - 1 - f) / INSERT_FADE + 0.0001));
  return (
    <AbsoluteFill style={{ opacity: op, background: '#000' }}>
      <OffthreadVideo src={staticFile(file)} muted style={fill} />
    </AbsoluteFill>
  );
};

// ============================================================================================================
// 7. FACE MOVES: [PUNCH-IN] + [LIGHTLEAK] (library leak, screen blend, spine as A and B) and hand:film-burn on every face edge.
// ============================================================================================================
const leakPeak = (id: string) => {
  const p = getTransition(id)!.params as any;
  const kf = (p.brightness as { t: number; v: number }[]).reduce((a, b) => (b.v > a.v ? b : a));
  return Math.round(kf.t * FPS);
};
const LEAKS = PUNCHES.map((p) => {
  const w = FACE_FR[faceIdxOfT(p.t)];
  const win = framesForRow(getTransition(p.leak)!, FPS);
  const start = Math.max(w[0], p.f - leakPeak(p.leak));
  const end = Math.min(w[1], start + win);               // never spill the spine onto the next cover
  return { ...p, start, n: end - start, win };
});
const LEAK_MIX = 0.5;
const LeakLayer: React.FC = () => (
  <>
    {LEAKS.map((l) => (
      <Sequence key={l.t} from={l.start} durationInFrames={l.n}>
        <AbsoluteFill style={{ opacity: LEAK_MIX }}>
          <TransitionClip id={l.leak} cutFrame={Math.round(l.win / 2)} sfx={false}
            outgoing={() => <SpineFrozen />} incoming={() => <SpineFrozen />} />
        </AbsoluteFill>
      </Sequence>
    ))}
  </>
);
// hand:film-burn: a warm radial flash, +-0.25 s around the cut, dialed low (34 face edges must not strobe)
const FACE_EDGES = FACE_FR.flatMap(([a, b]) => [a > 0 ? a : null, b < DUR ? b : null]).filter((x): x is number => x !== null);
const FilmBurn: React.FC = () => {
  const f = useCurrentFrame();
  const a = f <= 7 ? easeOut(f / 7) : 1 - easeOut((f - 7) / 8);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: 0.62 * a,
        background: 'radial-gradient(ellipse 75% 70% at 70% 40%, rgba(255,214,140,1) 0%, rgba(255,140,50,0.85) 32%, rgba(200,60,15,0.35) 62%, rgba(0,0,0,0) 85%)' }} />
      <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: 0.25 * a, background: 'linear-gradient(100deg, rgba(255,120,40,0.0) 20%, rgba(255,170,90,0.9) 60%, rgba(255,90,30,0.0) 95%)' }} />
    </AbsoluteFill>
  );
};
const BurnLayer: React.FC = () => (
  <>
    {FACE_EDGES.map((e) => (
      <Sequence key={e} from={e - 7} durationInFrames={15}>
        <FilmBurn />
      </Sequence>
    ))}
  </>
);

// ============================================================================================================
// 8. LOWER THIRDS (code-drawn, light theme): the C3 interview line and [CTA] LT-LINK, both under the captions.
// ============================================================================================================
const LowerThird: React.FC<{ text: React.ReactNode; accent: string; dur: number; bottom: number; caps?: boolean }> = ({ text, accent, dur, bottom, caps }) => {
  const f = useCurrentFrame();
  const a = Math.min(easeOut(f / 10), clamp01((dur - f) / 10));
  return (
    <div style={{ position: 'absolute', left: 120, bottom, opacity: a, transform: `translateX(${(1 - a) * -30}px)`, background: '#FFFFFF',
      borderLeft: `8px solid ${accent}`, borderRadius: 12, padding: '18px 30px', boxShadow: '0 1px 2px rgba(20,22,26,.06),0 14px 34px rgba(20,22,26,.16)',
      fontFamily: DMSANS, fontWeight: caps ? 700 : 600, fontSize: caps ? 32 : 30, letterSpacing: caps ? '.14em' : 0, textTransform: caps ? 'uppercase' : 'none',
      color: '#14161A', whiteSpace: 'nowrap' }}>
      {text}
    </div>
  );
};
const LowerThirds: React.FC = () => {
  const c3a = F(11.1), c3b = Fe(22.2);
  const lka = F(733.7), lkb = F(742.2);
  return (
    <>
      <Sequence from={c3a} durationInFrames={c3b - c3a}>
        <LowerThird accent="#C41E3A" dur={c3b - c3a} bottom={70} text={<>TIME interview at the White House, <span style={{ fontFamily: JBMONO }}>Sept 28, 2026</span></>} />
      </Sequence>
      <Sequence from={lka} durationInFrames={lkb - lka}>
        <LowerThird accent="#8F6500" dur={lkb - lka} bottom={250} caps text="Link in the description" />
      </Sequence>
    </>
  );
};

// ============================================================================================================
// 9. CAPTIONS (ResetCaptions.ts, build_captions.py montserrat): only inside CAPTION_WINDOWS (Mike's FACE holds > 5 s), topmost.
// ============================================================================================================
const CAPS = ZCAPTIONS.map((c) => ({ tf: faceFrameOf(c.t) / FPS, h: c.h }));
// each caption window IS a FACE window (holds > 5 s): gate on its measured frames
const CAP_WIN = CAPTION_WINDOWS.map(([a]) => {
  const k = faceStartAt(a);
  if (k < 0) throw new Error('Reset: caption window ' + a + ' is not a FACE window');
  return [FACE_FR[k][0] / FPS, FACE_FR[k][1] / FPS] as [number, number];
});
const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  if (!CAP_WIN.some(([a, b]) => t >= a && t < b)) return null;
  let cur: { tf: number; h: string } | null = null;
  for (const c of CAPS) { if (c.tf <= t) cur = c; else break; }
  if (!cur) return null;
  const nextT = (CAPS.find((c) => c.tf > cur!.tf) || { tf: Infinity }).tf;
  if (t >= Math.min(nextT, cur.tf + 1.3)) return null;
  const k = (t - cur.tf) * FPS;
  const s = k < 3 ? lerp(0.7, 1.12, k / 3) : k < 6 ? lerp(1.12, 1, (k - 3) / 3) : 1;
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 92, pointerEvents: 'none' }}>
      <div style={{ fontFamily: `${MONTSERRAT},'Arial Black','Segoe UI',sans-serif`, fontWeight: 900, fontSize: 82, textTransform: 'lowercase',
        color: '#FFFFFF', WebkitTextStroke: '12px #000', paintOrder: 'stroke fill', transform: `scale(${s})`, textAlign: 'center', lineHeight: 1.05,
        maxWidth: 1600, letterSpacing: 0.5 }}>
        {cur.h}
      </div>
    </AbsoluteFill>
  );
};

// ============================================================================================================
// 10. THE COMPOSITION
// ============================================================================================================
// inputProps.captions=false renders the picture WITHOUT the burned caption track (the 16:9-sourced short re-frames spans 9:16 and
// captions them itself; longform-to-short.md 16:9-SOURCED MODE). Default true = the delivered longform. The comp has no kinetic
// word pops, so `pops` is accepted for the contract and has nothing to switch off.
export const Reset: React.FC<{ captions?: boolean; pops?: boolean }> = ({ captions = true }) => {
  const f = useCurrentFrame();
  return (
    <AbsCtx.Provider value={f}>
      <AbsoluteFill style={{ background: '#000' }}>
        {/* the luma-of-red "un-highlight" used by the receipt highlight wipes */}
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            <filter id="rs-unhighlight" colorInterpolationFilters="sRGB">
              <feColorMatrix type="matrix" values="1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 1 0" />
            </filter>
          </defs>
        </svg>
        <SpineLive />
        <CoverTrack />
        <InsertLayer />
        <LibTransitions />
        <LeakLayer />
        <BurnLayer />
        <LowerThirds />
        {captions && <Captions />}
      </AbsoluteFill>
    </AbsCtx.Provider>
  );
};

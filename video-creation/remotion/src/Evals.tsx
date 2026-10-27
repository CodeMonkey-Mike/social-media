// Evals.tsx — longform-edited "AI Evals Explained: How to Know Your AI Product Actually Works" (project `evals`).
// Built TO the approved blueprint (EDIT-PLAN.md event log, CUE-SHEET.md, TRANSITIONS.md section 5 + TRANSITION-PLAN.json,
// COVER-PLAN.json, AS-RECORDED.md, PROJECT-LOG Open flags) per skills/comp-build/comp-build.md. Every cue below is a
// SOURCE-spine time (spine/ALL.g.third-breath.mp4) routed through sh() / F(); the paused spine is assets/spine.mp4
// (= spine/ALL.i.paused.mp4). No music, no SFX, no watermark: post-mix owns audio (comp-build section 9).
//
// Wired transitions (plan id -> where), so the plan can be grepped against the comp:
//   card       rmn:slide from-right, 0.50 s, all four title cards (CARDS + CardScene; readable asserted >= 1.0 s)
//   face-cut   hand:film-burn 0.76 s on all eleven face edges (FILM_BURNS; F1 opens on the face, no cut-in)
//   punch-leak lib:lightleaks-1 1.667 · lib:lightleaks-7 179.733 · lib:lightleaks-short-7 434.333 ·
//              lib:lightleaks-short-4 556.233 · lib:lightleaks-7 644.200 · lib:lightleaks-short-7 646.633 (PUNCHES)
//   glitch-still lib:roughly-4x 9.16 · lib:roughly-2x 366.26 · lib:roughly-3x 488.2 · lib:roughly-1x 652.58 ·
//              lib:roughly-6x 814.1 (cover rows with tx 'eng' + fx)
//   MELT       lib:melt-equidistant-3 84.1 · lib:melt-equidistant-1 616.22;  SPIN lib:spin-center-swinging-short-cw 318.0
//   broll-fade hand:fade 0.5 s (Envato rows tx 'fade'; 0.00 s rows are tx 'cut'; BR-25 vibe cut fd 0.13 + crash zoom)
//   container-xfade hand:xfade-scale 0.35 s, 0.93 -> 1 (rows tx 'xfade'); state swaps tx 'swap' (ingress suppressed)
//   insert-in / insert-out hand:fade 0.5 s around the CLIP-2 splice (ClipView)
// TRANSITIONS_WAIVED: roughly-5x — only an Open-question option in TRANSITIONS.md (IMG-4 at 557.033); the plan row gives
//   IMG-4's ingress to the F5 face-out hand:film-burn and Mike approved the suggestions as written (blueprint gate 2026-10-20)
// TRANSITIONS_WAIVED: spin-3d-side-ease-short-right — the SPIN fallback only "if the overshoot reads playful"; Mike kept
//   lib:spin-center-swinging-short-cw at 318.0 (blueprint gate ruling 3, PROJECT-LOG 2026-10-20)
import React, { createContext, useContext } from 'react';
import { AbsoluteFill, Easing, Freeze, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { slide } from '@remotion/transitions/slide';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadOswald } from '@remotion/google-fonts/Oswald';
import { ENGINES, getTransition, framesForRow } from './transitions';
import { ZCAPTIONS, CAPTION_WINDOWS } from './EvalsCaptions';
import { ChartSaturation, ChartC5, ChartTwoSuites, ChartScoreOverVersions } from './EvalsCharts';

const { fontFamily: MONTSERRAT } = loadMontserrat('normal', { weights: ['900'], subsets: ['latin'], ignoreTooManyRequestsWarning: true });
const { fontFamily: OSWALD } = loadOswald('normal', { weights: ['700'], subsets: ['latin'] });

// ===================================================================================== §2 the time map
export const FPS = 30;
export const PAUSE = 1.5;                       // spine/ALL.i.paused.json pause_s (card pauses)
// spine/ALL.i.paused.json pauses[] IS the time map: four 1.5 s card pauses + the 10.0 s CLIP-2 splice (comp-build §3d).
export const INSERTS = [
  { at: 70.025, dur: 1.5 },
  { at: 227.04, dur: 1.5 },
  { at: 483.115, dur: 1.5 },
  { at: 820.405, dur: 1.5 },
  { at: 870.25, dur: 10.0 },
];
export const CARD_T = [70.025, 227.04, 483.115, 820.405];
export const SPINE_SECS = 1018.9;               // the SOURCE spine spine/ALL.g.third-breath.mp4
const SPINE_FRAMES = 31048;                     // assets/spine.mp4 (check_spine_fps: ceil(1034.933 x 30))
const sh = (t: number) => t + INSERTS.filter((p) => p.at <= t).reduce((a, p) => a + p.dur, 0);
const shEnd = (t: number) => t + INSERTS.filter((p) => p.at < t).reduce((a, p) => a + p.dur, 0); // an END at a pause stops before it
const F = (t: number) => Math.round(sh(t) * FPS);
const FE = (t: number) => Math.round(shEnd(t) * FPS);
// The end card HOLDS past the spine to sh(1022.94) for the Bed E epic_hit on 'button.' (Mike, plan gate 2026-10-20).
export const END_HOLD = 1022.94;
export const DUR = F(END_HOLD);
if (Math.round((SPINE_SECS + INSERTS.reduce((a, p) => a + p.dur, 0)) * FPS) !== SPINE_FRAMES - 1 && Math.round((SPINE_SECS + INSERTS.reduce((a, p) => a + p.dur, 0)) * FPS) !== SPINE_FRAMES) {
  throw new Error('time map does not add up to the paused spine');
}

// ===================================================================================== §3a face reframe (measured)
export const FACE_REFRAME = { scale: 1.475, x: -792, y: -360 };   // assets/face-reframe.json, never hand-tuned
const FACE_POINT = { x: 960, y: 432 };                             // json face_point_out: punch-ins scale about it
const REFRAME_STYLE: React.CSSProperties = {
  position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0',
  transform: `translate(${FACE_REFRAME.x}px, ${FACE_REFRAME.y}px) scale(${FACE_REFRAME.scale})`,
};
const fill: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };

// AS-RECORDED FACE windows. F1 + F2 air as the Mike-approved Higgsfield background swaps (PRE-FRAMED: full-frame, NO
// FACE_REFRAME, from window_starts_at_clip_s 0.4 = clip frame 12; comp-build §3b); F3-F6 keep the recorded room.
const FACES: { a: number; b: number; swap?: string; head?: number }[] = [
  { a: 0.0, b: 3.733, swap: 'face-swap/F1-higgsfield-bg-swap.mp4', head: 12 },
  { a: 53.833, b: 58.3, swap: 'face-swap/F2-higgsfield-bg-swap.mp4', head: 12 },
  { a: 178.4, b: 184.567 },
  { a: 431.467, b: 434.933 },
  { a: 552.233, b: 557.033 },
  { a: 641.933, b: 647.5 },
];
// Punch-ins ON the desilencer joins (spine/jumpcuts-final.json, ALL.e clock + 0.1 s = ALL.g), each with its LIBRARY
// light leak peaking on the same frame (TRANSITIONS.md role punch-leak). F1 is SUBTLE (~8 %) on the bg-swap (Mike
// 2026-10-20); F6's second join steps BACK to the base frame (alternate, never compound).
const PUNCHES: { t: number; s: number; leak: string }[] = [
  { t: 1.667, s: 1.08, leak: 'lightleaks-1' },
  { t: 179.733, s: 1.18, leak: 'lightleaks-7' },
  { t: 434.333, s: 1.18, leak: 'lightleaks-short-7' },
  { t: 556.233, s: 1.18, leak: 'lightleaks-short-4' },
  { t: 644.2, s: 1.18, leak: 'lightleaks-7' },
  { t: 646.633, s: 1.0, leak: 'lightleaks-short-7' },
];
const faceAt = (f: number) => FACES.find((w) => f >= F(w.a) && f < FE(w.b));
const punchAt = (f: number) => {
  const w = faceAt(f);
  if (!w) return 1;
  let s = 1;
  for (const p of PUNCHES) if (p.t >= w.a && p.t < w.b && F(p.t) <= f) s = p.s;
  return s;
};

// ===================================================================================== the absolute clock (§6a)
const AbsCtx = createContext(0);
const useAbs = () => useContext(AbsCtx);

const PunchWrap: React.FC<{ s: number; children: React.ReactNode }> = ({ s, children }) => (
  <AbsoluteFill style={{ overflow: 'hidden', transformOrigin: `${FACE_POINT.x}px ${FACE_POINT.y}px`, transform: `scale(${s})` }}>{children}</AbsoluteFill>
);

/** what the face layer airs at absolute frame `abs`, for a node an engine mounts (§6a): muted, the same transform, the
 * same source (the bg-swap clip inside F1/F2, the reframed spine elsewhere), and LIVE on the absolute clock via
 * startFrom = target media frame - useCurrentFrame(), which stays in sync in ANY Sequence nesting (the punch-leak runs
 * across a join while he keeps talking, so it is a moving node, not a freeze). */
const SpineAt: React.FC<{ abs: number; s: number }> = ({ abs, s }) => {
  const lf = useCurrentFrame();
  const w = faceAt(abs);
  if (w?.swap) {
    return (
      <PunchWrap s={s}>
        <OffthreadVideo src={staticFile(w.swap)} muted startFrom={Math.max(0, abs - F(w.a) + (w.head ?? 0) - lf)} style={fill} />
      </PunchWrap>
    );
  }
  return (
    <PunchWrap s={s}>
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        <OffthreadVideo src={staticFile('spine.mp4')} muted startFrom={Math.max(0, abs - lf)} style={REFRAME_STYLE} />
      </AbsoluteFill>
    </PunchWrap>
  );
};
const LiveSpine: React.FC<{ s: number }> = ({ s }) => <SpineAt abs={useAbs()} s={s} />;

/** the live face layer: the ONE continuous spine (VO audio source) + the two bg-swap clips over F1 / F2 */
const FaceLayer: React.FC = () => {
  const abs = useAbs();
  const s = punchAt(abs);
  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      <Sequence from={0} durationInFrames={SPINE_FRAMES}>
        <PunchWrap s={s}>
          <AbsoluteFill style={{ overflow: 'hidden' }}>
            <OffthreadVideo src={staticFile('spine.mp4')} style={REFRAME_STYLE} />
          </AbsoluteFill>
        </PunchWrap>
      </Sequence>
      {FACES.filter((w) => w.swap).map((w) => (
        <Sequence key={w.a} from={F(w.a)} durationInFrames={FE(w.b) - F(w.a)}>
          <PunchWrap s={s}><OffthreadVideo src={staticFile(w.swap!)} startFrom={w.head} muted style={fill} /></PunchWrap>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// ===================================================================================== §4 the COVER track
type Cover = {
  tIn: number; tOut: number; kind: 'container' | 'deck' | 'receipt' | 'vid' | 'still' | 'chart' | 'clip'; ref: string;
  state?: string; grp: string; tx: 'cut' | 'swap' | 'fade' | 'xfade' | 'eng';
  cap?: boolean; lead?: boolean; np?: boolean; fd?: number; fx?: string; mo?: string; pu?: number[][]; fo?: number[][];
};
// DIAGRAM_REFS / COMPARISON_REFS for lint-deck-containers (the Type 2 system-design + code containers in assets/diagrams):
/* DIAGRAM_REFS: C1-s1-left, C1-s2-right, C1-s3-exits, C1-s3-exit1, C1-s3-exit2, C1-s4-exit3, C1-s4-exit3-args,
   C1-s4-exit3-clean, C2-s1-model, C2-s2-product, C3-s1-dim, C3-s2-dataset, C3-s3-rail, C3-s4-testcase, C3-s5-example,
   C3-s6-task, C4-s1-families, C4-s2-code, C4-s3-exact-match, C4-s4-key-phrase, C4-s5-json-schema, diagram-said-booked-s1-transcript,
   diagram-said-booked-s2-database, diagram-rag-s1-question, diagram-rag-s2-retrieve, diagram-rag-s3-answer, C8-s0-pipeline,
   C8-s1a-strategist, C8-s1b-lints, C8-s1c-builders, C8-s1d-visual-qa, C8-s1e-gate, C27a-s1-code, C27a-s2-graders,
   C27a-s3-machine-line, C27b-s1-code, C27b-s2-judge, C27b-s3-opens-every-asset, C8-s2a-verdicts, C8-s2b-dataset,
   C8-s2c-replay, C8-s2d-score, C8-s2e-precision, C9-sA1-chain, C9-sA1b-documented, C9-sA2-logs, C9-sA3-detector,
   C9-sA4-flags, C9-sB1-alarm-lambda, C9-sB2-you-build, C9-sB3-bedrock, C9-sC1-severity, C9-sC2-category, C9-sC3-alert,
   C9-sC4-sns, C9-sC5-page, C6-s1-cycle, C6-s2-error-analysis, C6-s3-measure, C6-s4-improve, C6-s5-read-traces,
   C6-s6-cluster, C6-s7-most-important, C6-s8-grader, C6-s9-code, C6-s10-judge, C6-s11-measure, C6-s12-fix-biggest,
   C6-s13-rerun, C6-s14-again, C12-s1-overview, C12-s2-platforms, C12-s3-langsmith, C13-s1-row, C13-s2-function,
   C13-s3-exact-match, C13-s4-key-phrase, C14-s1-prompt, C14-s2-rubric, C14-s3-answer, C14-s4-result, C14-s5-anthropic,
   C15-s1-file, C15-s2-loop, C15-s3-calls, C15-s4-table, C15-s5-ci-gate */
/* COMPARISON_REFS: diagram-one-vs-many-s1-left, diagram-one-vs-many-s2-right, diagram-one-vs-many-s3-looks-fine */
// Rows: EDIT-PLAN.md, row for row (word times from COVER-PLAN cover_beats). tx = the row's ingress; consecutive same-grp
// rows are STATE SWAPS (no ingress transition). cap: true = exactly the Envato beats of captions.json cover_windows.
// pu = chip / line pulses [t, x, y, w, h]; fo = push + vignette focus [t, x, y, w, h] (0 box = release); np = no push
// (the row hands a raw PNG to a MELT engine, so it must air at scale 1).
const COVERS: Cover[] = [
  { tIn: 3.733, tOut: 5.12, kind: 'container', ref: 'h0-it-worked-s1', state: 's1', grp: 'h0-it-worked', tx: 'cut' },
  { tIn: 5.12, tOut: 6.78, kind: 'container', ref: 'h0-it-worked-s2', state: 's2', grp: 'h0-it-worked', tx: 'swap' },
  { tIn: 6.78, tOut: 8.7, kind: 'container', ref: 'h0-it-worked-s3', state: 's3', grp: 'h0-it-worked', tx: 'swap' },
  { tIn: 8.7, tOut: 9.16, kind: 'container', ref: 'h0-it-worked-s4', state: 's4', grp: 'h0-it-worked', tx: 'swap' },
  { tIn: 9.16, tOut: 12.0, kind: 'still', ref: 'IMG-1-monitor-check', grp: 'IMG-1-monitor-check', tx: 'eng', fx: 'roughly-4x' },
  { tIn: 12.0, tOut: 15.64, kind: 'vid', ref: 'BR-1-confident-smirk-dim-office', grp: 'BR-1-confident-smirk-dim-office', tx: 'fade', cap: true },
  { tIn: 15.64, tOut: 17.74, kind: 'vid', ref: 'BR-2-green-server-dolly', grp: 'BR-2-green-server-dolly', tx: 'fade', cap: true },
  { tIn: 17.74, tOut: 19.86, kind: 'vid', ref: 'BR-3-stairwell-pipes-fall', grp: 'BR-3-stairwell-pipes-fall', tx: 'fade', cap: true },
  { tIn: 19.86, tOut: 26.68, kind: 'deck', ref: 'diagram-one-vs-many-s1-left', state: 's1-left', grp: 'diagram-one-vs-many', tx: 'xfade' },
  { tIn: 26.68, tOut: 31.6, kind: 'deck', ref: 'diagram-one-vs-many-s2-right', state: 's2-right', grp: 'diagram-one-vs-many', tx: 'swap' },
  { tIn: 31.6, tOut: 32.52, kind: 'deck', ref: 'diagram-one-vs-many-s3-looks-fine', state: 's3-looks-fine', grp: 'diagram-one-vs-many', tx: 'swap' },
  { tIn: 32.52, tOut: 36.24, kind: 'receipt', ref: 'C17a-anthropic-flight-booked', grp: 'C17a', tx: 'xfade' },
  { tIn: 36.24, tOut: 40.12, kind: 'vid', ref: 'BR-4-splitflap-departures', grp: 'BR-4-splitflap-departures', tx: 'fade', cap: true },
  { tIn: 40.12, tOut: 43.56, kind: 'deck', ref: 'diagram-said-booked-s1-transcript', state: 's1-transcript', grp: 'diagram-said-booked', tx: 'xfade' },
  { tIn: 43.56, tOut: 46.56, kind: 'deck', ref: 'diagram-said-booked-s2-database', state: 's2-database', grp: 'diagram-said-booked', tx: 'swap' },
  { tIn: 46.56, tOut: 48.56, kind: 'container', ref: 'card-transcript-success-s1', state: 's1', grp: 'card-transcript-success', tx: 'xfade' },
  { tIn: 48.56, tOut: 50.82, kind: 'container', ref: 'card-transcript-success-s2', state: 's2', grp: 'card-transcript-success', tx: 'swap' },
  { tIn: 50.82, tOut: 53.833, kind: 'container', ref: 'card-transcript-success-s3', state: 's3', grp: 'card-transcript-success', tx: 'swap' },
  { tIn: 58.3, tOut: 60.84, kind: 'container', ref: 'h1-dataset-grader-score-s1', state: 's1', grp: 'h1-dataset-grader-score', tx: 'cut' },
  { tIn: 60.84, tOut: 63.08, kind: 'container', ref: 'h1-dataset-grader-score-s2', state: 's2', grp: 'h1-dataset-grader-score', tx: 'swap' },
  { tIn: 63.08, tOut: 66.02, kind: 'container', ref: 'h1-dataset-grader-score-s3', state: 's3', grp: 'h1-dataset-grader-score', tx: 'swap' },
  { tIn: 66.02, tOut: 68.28, kind: 'container', ref: 'h1-dataset-grader-score-s4', state: 's4', grp: 'h1-dataset-grader-score', tx: 'swap', pu: [[66.02,710,679,144,52],[66.70,868,679,128,52],[67.60,1010,679,272,52]] },
  { tIn: 68.28, tOut: 70.025, kind: 'vid', ref: 'BR-5-mono-corridor-flythrough', grp: 'BR-5-mono-corridor-flythrough', tx: 'fade', cap: true },
  { tIn: 70.025, tOut: 84.1, kind: 'deck', ref: 'C1-s1-left', state: 's1-left', grp: 'C1', tx: 'cut', np: true, fo: [[73.14,200,372,360,76],[74.46,200,480,360,76],[75.26,200,588,360,76],[77.34,200,696,360,76],[79.10,268,801,224,56],[80.86,200,874,360,86],[83.4,0,0,0,0]] },
  { tIn: 84.1, tOut: 106.88, kind: 'deck', ref: 'C1-s2-right', state: 's2-right', grp: 'C1', tx: 'eng', fx: 'melt-equidistant-3', pu: [[89.22,1180,313,110,40],[90.14,1302,313,87,40],[90.92,1401,313,121,40],[91.78,1534,313,144,40],[93.78,938,533,127,38],[95.16,1075,533,127,38],[96.18,938,580,127,38],[97.48,1075,580,127,38],[103.68,1270,440,150,220],[105.24,1470,500,300,100]] },
  { tIn: 106.88, tOut: 112.82, kind: 'receipt', ref: 'C18-anthropic-passk', grp: 'C18', tx: 'xfade' },
  { tIn: 112.82, tOut: 117.72, kind: 'container', ref: 'card-passk-s1', state: 's1', grp: 'card-passk', tx: 'xfade' },
  { tIn: 117.72, tOut: 119.0, kind: 'container', ref: 'card-passk-s2', state: 's2', grp: 'card-passk', tx: 'swap' },
  { tIn: 119.0, tOut: 122.66, kind: 'vid', ref: 'BR-6-sensor-red-led-dark', grp: 'BR-6-sensor-red-led-dark', tx: 'fade', cap: true },
  { tIn: 122.66, tOut: 125.02, kind: 'deck', ref: 'C1-s3-exits', state: 's3-exits', grp: 'C1', tx: 'xfade' },
  { tIn: 125.02, tOut: 131.24, kind: 'deck', ref: 'C1-s3-exit1', state: 's3-exit1', grp: 'C1', tx: 'swap' },
  { tIn: 131.24, tOut: 136.06, kind: 'deck', ref: 'C1-s3-exit2', state: 's3-exit2', grp: 'C1', tx: 'swap' },
  { tIn: 136.06, tOut: 141.32, kind: 'receipt', ref: 'C30-xstest-abstract', grp: 'C30', tx: 'xfade' },
  { tIn: 141.32, tOut: 145.1, kind: 'vid', ref: 'BR-7-hand-stop-closeup', grp: 'BR-7-hand-stop-closeup', tx: 'fade', cap: true },
  { tIn: 145.1, tOut: 150.74, kind: 'container', ref: 'card-exaggerated-safety', state: 'one', grp: 'card-exaggerated-safety', tx: 'xfade', pu: [[149.38,226,378,600,92]] },
  { tIn: 150.74, tOut: 154.12, kind: 'deck', ref: 'C1-s4-exit3', state: 's4-exit3', grp: 'C1', tx: 'xfade' },
  { tIn: 154.12, tOut: 156.24, kind: 'deck', ref: 'C1-s4-exit3-args', state: 's4-exit3-args', grp: 'C1', tx: 'swap' },
  { tIn: 156.24, tOut: 158.04, kind: 'deck', ref: 'C1-s4-exit3-clean', state: 's4-exit3-clean', grp: 'C1', tx: 'swap' },
  { tIn: 158.04, tOut: 161.18, kind: 'vid', ref: 'BR-8-mousetrap-snap', grp: 'BR-8-mousetrap-snap', tx: 'fade', cap: true },
  { tIn: 161.18, tOut: 165.24, kind: 'container', ref: 'card-benchmark-trap-s1', state: 's1', grp: 'card-benchmark-trap', tx: 'xfade' },
  { tIn: 165.24, tOut: 166.7, kind: 'container', ref: 'card-benchmark-trap-s2', state: 's2', grp: 'card-benchmark-trap', tx: 'swap' },
  { tIn: 166.7, tOut: 168.06, kind: 'container', ref: 'card-benchmark-trap-s3', state: 's3', grp: 'card-benchmark-trap', tx: 'swap' },
  { tIn: 168.06, tOut: 178.4, kind: 'receipt', ref: 'C20-mmlu-pro-abstract', grp: 'C20', tx: 'xfade' },
  { tIn: 184.567, tOut: 186.14, kind: 'deck', ref: 'C2-s1-model', state: 's1-model', grp: 'C2', tx: 'cut' },
  { tIn: 186.14, tOut: 191.24, kind: 'deck', ref: 'C2-s2-product', state: 's2-product', grp: 'C2', tx: 'swap' },
  { tIn: 191.24, tOut: 198.38, kind: 'receipt', ref: 'C31-anthropic-design-principles', grp: 'C31', tx: 'xfade' },
  { tIn: 198.38, tOut: 206.14, kind: 'chart', ref: 'chart-saturation', grp: 'chart-saturation', tx: 'xfade' },
  { tIn: 206.14, tOut: 216.42, kind: 'receipt', ref: 'C17c-anthropic-saturation', grp: 'C17c', tx: 'xfade' },
  { tIn: 216.42, tOut: 223.7, kind: 'receipt', ref: 'C22a-header', grp: 'C22a', tx: 'xfade' },
  { tIn: 223.7, tOut: 227.04, kind: 'receipt', ref: 'C22a-hamel-faq-generic-evals', grp: 'C22a', tx: 'swap' },
  { tIn: 227.04, tOut: 230.92, kind: 'vid', ref: 'BR-9-steel-pipeline-glide', grp: 'BR-9-steel-pipeline-glide', tx: 'cut', cap: true },
  { tIn: 230.92, tOut: 231.86, kind: 'deck', ref: 'C3-s1-dim', state: 's1-dim', grp: 'C3', tx: 'xfade' },
  { tIn: 231.86, tOut: 234.44, kind: 'deck', ref: 'C3-s2-dataset', state: 's2-dataset', grp: 'C3', tx: 'swap' },
  { tIn: 234.44, tOut: 238.36, kind: 'deck', ref: 'C3-s3-rail', state: 's3-rail', grp: 'C3', tx: 'swap' },
  { tIn: 238.36, tOut: 240.5, kind: 'deck', ref: 'C3-s4-testcase', state: 's4-testcase', grp: 'C3', tx: 'swap' },
  { tIn: 240.5, tOut: 242.46, kind: 'deck', ref: 'C3-s5-example', state: 's5-example', grp: 'C3', tx: 'swap' },
  { tIn: 242.46, tOut: 244.2, kind: 'deck', ref: 'C3-s6-task', state: 's6-task', grp: 'C3', tx: 'swap' },
  { tIn: 244.2, tOut: 247.56, kind: 'container', ref: 'card-runner-s1', state: 's1', grp: 'card-runner', tx: 'xfade' },
  { tIn: 247.56, tOut: 251.08, kind: 'container', ref: 'card-runner-s2', state: 's2', grp: 'card-runner', tx: 'swap' },
  { tIn: 251.08, tOut: 253.52, kind: 'container', ref: 'card-runner-s3', state: 's3', grp: 'card-runner', tx: 'swap' },
  { tIn: 253.52, tOut: 254.84, kind: 'container', ref: 'card-runner-s4', state: 's4', grp: 'card-runner', tx: 'swap' },
  { tIn: 254.84, tOut: 261.74, kind: 'container', ref: 'card-grader-s1', state: 's1', grp: 'card-grader', tx: 'xfade' },
  { tIn: 261.74, tOut: 263.44, kind: 'container', ref: 'card-grader-s2', state: 's2', grp: 'card-grader', tx: 'swap' },
  { tIn: 263.44, tOut: 268.04, kind: 'container', ref: 'card-score-s1', state: 's1', grp: 'card-score', tx: 'xfade' },
  { tIn: 268.04, tOut: 270.08, kind: 'container', ref: 'card-score-s2', state: 's2', grp: 'card-score', tx: 'swap', pu: [[268.04,708,641,144,52],[268.46,866,641,128,52],[269.26,1008,641,272,52]] },
  { tIn: 270.08, tOut: 273.2, kind: 'container', ref: 'card-score-s3', state: 's3', grp: 'card-score', tx: 'swap' },
  { tIn: 273.2, tOut: 279.9, kind: 'container', ref: 'card-two-words-s1', state: 's1', grp: 'card-two-words', tx: 'xfade' },
  { tIn: 279.9, tOut: 283.32, kind: 'container', ref: 'card-two-words-s2', state: 's2', grp: 'card-two-words', tx: 'swap' },
  { tIn: 283.32, tOut: 286.16, kind: 'container', ref: 'card-two-words-s3', state: 's3', grp: 'card-two-words', tx: 'swap' },
  { tIn: 286.16, tOut: 289.16, kind: 'vid', ref: 'BR-10-red-error-windows', grp: 'BR-10-red-error-windows', tx: 'fade', cap: true },
  { tIn: 289.16, tOut: 298.56, kind: 'receipt', ref: 'C17b-anthropic-dataset-size', grp: 'C17b', tx: 'xfade' },
  { tIn: 298.56, tOut: 305.46, kind: 'container', ref: 'card-rule-1-s1', state: 's1', grp: 'card-rule-1', tx: 'xfade' },
  { tIn: 305.46, tOut: 309.5, kind: 'container', ref: 'card-rule-1-s2', state: 's2', grp: 'card-rule-1', tx: 'swap' },
  { tIn: 309.5, tOut: 313.5, kind: 'container', ref: 'card-rule-2-s1', state: 's1', grp: 'card-rule-2', tx: 'xfade' },
  { tIn: 313.5, tOut: 315.08, kind: 'container', ref: 'card-rule-2-s2', state: 's2', grp: 'card-rule-2', tx: 'swap' },
  { tIn: 315.08, tOut: 318.0, kind: 'container', ref: 'card-rule-2-s3', state: 's3', grp: 'card-rule-2', tx: 'swap' },
  { tIn: 318.0, tOut: 323.24, kind: 'deck', ref: 'C4-s1-families', state: 's1-families', grp: 'C4', tx: 'eng', fx: 'spin-center-swinging-short-cw' },
  { tIn: 323.24, tOut: 324.56, kind: 'deck', ref: 'C4-s2-code', state: 's2-code', grp: 'C4', tx: 'swap' },
  { tIn: 324.56, tOut: 325.52, kind: 'deck', ref: 'C4-s3-exact-match', state: 's3-exact-match', grp: 'C4', tx: 'swap' },
  { tIn: 325.52, tOut: 327.46, kind: 'deck', ref: 'C4-s4-key-phrase', state: 's4-key-phrase', grp: 'C4', tx: 'swap' },
  { tIn: 327.46, tOut: 328.78, kind: 'deck', ref: 'C4-s5-json-schema', state: 's5-json-schema', grp: 'C4', tx: 'swap' },
  { tIn: 328.78, tOut: 334.08, kind: 'container', ref: 'card-code-graders-s1', state: 's1', grp: 'card-code-graders', tx: 'xfade', pu: [[329.22,544,473,260,52],[331.08,818,473,148,52],[332.78,980,473,105,52]] },
  { tIn: 334.08, tOut: 336.56, kind: 'container', ref: 'card-code-graders-s2', state: 's2', grp: 'card-code-graders', tx: 'swap' },
  { tIn: 336.56, tOut: 339.78, kind: 'container', ref: 'card-code-graders-s3', state: 's3', grp: 'card-code-graders', tx: 'swap' },
  { tIn: 339.78, tOut: 343.42, kind: 'vid', ref: 'BR-11-expert-reads-report-dark', grp: 'BR-11-expert-reads-report-dark', tx: 'fade', cap: true },
  { tIn: 343.42, tOut: 346.26, kind: 'container', ref: 'card-human-graders-s1', state: 's1', grp: 'card-human-graders', tx: 'xfade' },
  { tIn: 346.26, tOut: 348.1, kind: 'container', ref: 'card-human-graders-s2', state: 's2', grp: 'card-human-graders', tx: 'swap' },
  { tIn: 348.1, tOut: 351.5, kind: 'container', ref: 'card-human-graders-s3', state: 's3', grp: 'card-human-graders', tx: 'swap' },
  { tIn: 351.5, tOut: 357.1, kind: 'container', ref: 'card-llm-judge-s1', state: 's1', grp: 'card-llm-judge', tx: 'xfade' },
  { tIn: 357.1, tOut: 360.3, kind: 'container', ref: 'card-llm-judge-s2', state: 's2', grp: 'card-llm-judge', tx: 'swap' },
  { tIn: 360.3, tOut: 361.46, kind: 'container', ref: 'card-llm-judge-s3', state: 's3', grp: 'card-llm-judge', tx: 'swap' },
  { tIn: 361.46, tOut: 366.26, kind: 'receipt', ref: 'C16-anthropic-grading-list', grp: 'C16', tx: 'xfade' },
  { tIn: 366.26, tOut: 368.84, kind: 'still', ref: 'IMG-2-gavel', grp: 'IMG-2-gavel', tx: 'eng', fx: 'roughly-2x' },
  { tIn: 368.84, tOut: 371.7, kind: 'container', ref: 'card-three-habits-s1', state: 's1', grp: 'card-three-habits', tx: 'xfade' },
  { tIn: 371.7, tOut: 378.64, kind: 'container', ref: 'card-three-habits-s2', state: 's2', grp: 'card-three-habits', tx: 'swap', pu: [[375.00,760,582,352,52],[376.34,1126,582,176,52],[377.14,1316,582,272,52]] },
  { tIn: 378.64, tOut: 381.62, kind: 'container', ref: 'card-three-habits-s3', state: 's3', grp: 'card-three-habits', tx: 'swap' },
  { tIn: 381.62, tOut: 404.14, kind: 'chart', ref: 'C5', grp: 'C5', tx: 'xfade' },
  { tIn: 404.14, tOut: 412.02, kind: 'receipt', ref: 'C22b-hamel-faq-validation', grp: 'C22b', tx: 'xfade' },
  { tIn: 412.02, tOut: 415.1, kind: 'receipt', ref: 'C22b-hamel-faq-100-200-labels', grp: 'C22b', tx: 'swap' },
  { tIn: 415.1, tOut: 424.42, kind: 'receipt', ref: 'C21-zheng-judge-abstract', grp: 'C21', tx: 'xfade' },
  { tIn: 424.42, tOut: 429.18, kind: 'container', ref: 'card-judge-biases-s1', state: 's1', grp: 'card-judge-biases', tx: 'xfade' },
  { tIn: 429.18, tOut: 429.98, kind: 'container', ref: 'card-judge-biases-s2', state: 's2', grp: 'card-judge-biases', tx: 'swap' },
  { tIn: 429.98, tOut: 431.467, kind: 'container', ref: 'card-judge-biases-s3', state: 's3', grp: 'card-judge-biases', tx: 'swap' },
  { tIn: 434.933, tOut: 438.14, kind: 'vid', ref: 'BR-12-glasses-screen-reflection', grp: 'BR-12-glasses-screen-reflection', tx: 'cut', cap: true },
  { tIn: 438.14, tOut: 444.24, kind: 'container', ref: 'card-96-12-s1', state: 's1', grp: 'card-96-12', tx: 'xfade' },
  { tIn: 444.24, tOut: 448.66, kind: 'container', ref: 'card-96-12-s2', state: 's2', grp: 'card-96-12', tx: 'swap' },
  { tIn: 448.66, tOut: 451.7, kind: 'vid', ref: 'BR-13-server-aisle-teal-dolly', grp: 'BR-13-server-aisle-teal-dolly', tx: 'fade', cap: true },
  { tIn: 451.7, tOut: 460.46, kind: 'receipt', ref: 'C23-langfuse-offline-online', grp: 'C23', tx: 'xfade' },
  { tIn: 460.46, tOut: 463.52, kind: 'vid', ref: 'BR-14-night-highway-trails', grp: 'BR-14-night-highway-trails', tx: 'fade', cap: true },
  { tIn: 463.52, tOut: 465.54, kind: 'container', ref: 'card-online-s1', state: 's1', grp: 'card-online', tx: 'xfade' },
  { tIn: 465.54, tOut: 467.8, kind: 'container', ref: 'card-online-s2', state: 's2', grp: 'card-online', tx: 'swap' },
  { tIn: 467.8, tOut: 470.72, kind: 'container', ref: 'card-online-s3', state: 's3', grp: 'card-online', tx: 'swap' },
  { tIn: 470.72, tOut: 472.72, kind: 'container', ref: 'card-online-s4', state: 's4', grp: 'card-online', tx: 'swap' },
  { tIn: 472.72, tOut: 478.58, kind: 'container', ref: 'card-hamel-split-s1', state: 's1', grp: 'card-hamel-split', tx: 'xfade' },
  { tIn: 478.58, tOut: 481.38, kind: 'container', ref: 'card-hamel-split-s2', state: 's2', grp: 'card-hamel-split', tx: 'swap' },
  { tIn: 481.38, tOut: 483.115, kind: 'container', ref: 'card-hamel-split-s3', state: 's3', grp: 'card-hamel-split', tx: 'swap' },
  { tIn: 483.115, tOut: 484.8, kind: 'container', ref: 'card-five-products-s1', state: 's1', grp: 'card-five-products', tx: 'cut' },
  { tIn: 484.8, tOut: 485.7, kind: 'container', ref: 'card-five-products-s2', state: 's2', grp: 'card-five-products', tx: 'swap' },
  { tIn: 485.7, tOut: 486.4, kind: 'container', ref: 'card-five-products-s3', state: 's3', grp: 'card-five-products', tx: 'swap' },
  { tIn: 486.4, tOut: 487.0, kind: 'container', ref: 'card-five-products-s4', state: 's4', grp: 'card-five-products', tx: 'swap' },
  { tIn: 487.0, tOut: 488.2, kind: 'container', ref: 'card-five-products-s5', state: 's5', grp: 'card-five-products', tx: 'swap' },
  { tIn: 488.2, tOut: 492.1, kind: 'still', ref: 'IMG-3-chat-laptop', grp: 'IMG-3-chat-laptop', tx: 'eng', fx: 'roughly-3x' },
  { tIn: 492.1, tOut: 494.9, kind: 'deck', ref: 'diagram-rag-s1-question', state: 's1-question', grp: 'diagram-rag', tx: 'xfade' },
  { tIn: 494.9, tOut: 497.02, kind: 'deck', ref: 'diagram-rag-s2-retrieve', state: 's2-retrieve', grp: 'diagram-rag', tx: 'swap' },
  { tIn: 497.02, tOut: 497.8, kind: 'deck', ref: 'diagram-rag-s3-answer', state: 's3-answer', grp: 'diagram-rag', tx: 'swap' },
  { tIn: 497.8, tOut: 500.8, kind: 'vid', ref: 'BR-15-hand-pulls-library-book', grp: 'BR-15-hand-pulls-library-book', tx: 'fade', cap: true },
  { tIn: 500.8, tOut: 512.44, kind: 'container', ref: 'C7-s1', state: 's1', grp: 'C7', tx: 'xfade', pu: [[503.90,1224,354,149,44],[504.96,1387,354,191,44],[506.10,1592,354,78,44],[507.18,322,382,560,36],[510.04,920,382,192,36]] },
  { tIn: 512.44, tOut: 518.98, kind: 'container', ref: 'C7-s2', state: 's2', grp: 'C7', tx: 'swap' },
  { tIn: 518.98, tOut: 525.28, kind: 'receipt', ref: 'C32-ragas-faithfulness', grp: 'C32', tx: 'xfade' },
  { tIn: 525.28, tOut: 531.56, kind: 'container', ref: 'C7-s3', state: 's3', grp: 'C7', tx: 'xfade', pu: [[527.78,322,632,428,36],[530.12,756,632,355,36]] },
  { tIn: 531.56, tOut: 540.4, kind: 'container', ref: 'C7-s4', state: 's4', grp: 'C7', tx: 'swap', pu: [[536.02,322,757,540,36],[537.64,1324,729,346,44]] },
  { tIn: 540.4, tOut: 542.02, kind: 'container', ref: 'card-balanced-set-s1', state: 's1', grp: 'card-balanced-set', tx: 'xfade' },
  { tIn: 542.02, tOut: 545.84, kind: 'container', ref: 'card-balanced-set-s2', state: 's2', grp: 'card-balanced-set', tx: 'swap' },
  { tIn: 545.84, tOut: 552.233, kind: 'container', ref: 'C7-s5', state: 's5', grp: 'C7', tx: 'xfade', pu: [[547.24,1465,854,205,44],[549.36,322,882,695,36]] },
  { tIn: 557.033, tOut: 561.02, kind: 'still', ref: 'IMG-4-control-room', grp: 'IMG-4-control-room', tx: 'cut' },
  { tIn: 561.02, tOut: 566.6, kind: 'deck', ref: 'C8-s0-pipeline', state: 's0-pipeline', grp: 'C8', tx: 'xfade' },
  { tIn: 566.6, tOut: 569.22, kind: 'deck', ref: 'C8-s1a-strategist', state: 's1a-strategist', grp: 'C8', tx: 'swap' },
  { tIn: 569.22, tOut: 571.28, kind: 'deck', ref: 'C8-s1b-lints', state: 's1b-lints', grp: 'C8', tx: 'swap' },
  { tIn: 571.28, tOut: 573.3, kind: 'deck', ref: 'C8-s1c-builders', state: 's1c-builders', grp: 'C8', tx: 'swap' },
  { tIn: 573.3, tOut: 576.24, kind: 'deck', ref: 'C8-s1d-visual-qa', state: 's1d-visual-qa', grp: 'C8', tx: 'swap' },
  { tIn: 576.24, tOut: 579.08, kind: 'deck', ref: 'C8-s1e-gate', state: 's1e-gate', grp: 'C8', tx: 'swap' },
  { tIn: 579.08, tOut: 580.88, kind: 'deck', ref: 'C27a-s1-code', state: 's1-code', grp: 'C27a', tx: 'xfade' },
  { tIn: 580.88, tOut: 583.48, kind: 'deck', ref: 'C27a-s2-graders', state: 's2-graders', grp: 'C27a', tx: 'swap' },
  { tIn: 583.48, tOut: 587.28, kind: 'deck', ref: 'C27a-s3-machine-line', state: 's3-machine-line', grp: 'C27a', tx: 'swap' },
  { tIn: 587.28, tOut: 588.68, kind: 'container', ref: 'card-lint-rules-s1', state: 's1', grp: 'card-lint-rules', tx: 'xfade' },
  { tIn: 588.68, tOut: 591.18, kind: 'container', ref: 'card-lint-rules-s2', state: 's2', grp: 'card-lint-rules', tx: 'swap' },
  { tIn: 591.18, tOut: 593.54, kind: 'container', ref: 'card-lint-rules-s3', state: 's3', grp: 'card-lint-rules', tx: 'swap' },
  { tIn: 593.54, tOut: 595.26, kind: 'deck', ref: 'C27b-s1-code', state: 's1-code', grp: 'C27b', tx: 'xfade' },
  { tIn: 595.26, tOut: 596.6, kind: 'deck', ref: 'C27b-s2-judge', state: 's2-judge', grp: 'C27b', tx: 'swap' },
  { tIn: 596.6, tOut: 601.02, kind: 'deck', ref: 'C27b-s3-opens-every-asset', state: 's3-opens-every-asset', grp: 'C27b', tx: 'swap' },
  { tIn: 601.02, tOut: 605.28, kind: 'container', ref: 'card-visual-qa-verdict-s1', state: 's1', grp: 'card-visual-qa-verdict', tx: 'xfade' },
  { tIn: 605.28, tOut: 609.02, kind: 'container', ref: 'card-visual-qa-verdict-s2', state: 's2', grp: 'card-visual-qa-verdict', tx: 'swap' },
  { tIn: 609.02, tOut: 611.94, kind: 'container', ref: 'card-hitl-gate-s1', state: 's1', grp: 'card-hitl-gate', tx: 'xfade', np: true },
  { tIn: 611.94, tOut: 612.96, kind: 'container', ref: 'card-hitl-gate-s2', state: 's2', grp: 'card-hitl-gate', tx: 'swap', np: true },
  { tIn: 612.96, tOut: 614.46, kind: 'container', ref: 'card-hitl-gate-s3', state: 's3', grp: 'card-hitl-gate', tx: 'swap', np: true },
  { tIn: 614.46, tOut: 616.22, kind: 'container', ref: 'card-hitl-gate-s4', state: 's4', grp: 'card-hitl-gate', tx: 'swap', np: true },
  { tIn: 616.22, tOut: 623.56, kind: 'deck', ref: 'C8-s2a-verdicts', state: 's2a-verdicts', grp: 'C8', tx: 'eng', fx: 'melt-equidistant-1' },
  { tIn: 623.56, tOut: 626.24, kind: 'deck', ref: 'C8-s2b-dataset', state: 's2b-dataset', grp: 'C8', tx: 'swap' },
  { tIn: 626.24, tOut: 627.88, kind: 'deck', ref: 'C8-s2c-replay', state: 's2c-replay', grp: 'C8', tx: 'swap' },
  { tIn: 627.88, tOut: 630.5, kind: 'deck', ref: 'C8-s2d-score', state: 's2d-score', grp: 'C8', tx: 'swap' },
  { tIn: 630.5, tOut: 633.14, kind: 'deck', ref: 'C8-s2e-precision', state: 's2e-precision', grp: 'C8', tx: 'swap' },
  { tIn: 633.14, tOut: 637.7, kind: 'container', ref: 'card-precision-only-s1', state: 's1', grp: 'card-precision-only', tx: 'xfade' },
  { tIn: 637.7, tOut: 639.58, kind: 'container', ref: 'card-precision-only-s2', state: 's2', grp: 'card-precision-only', tx: 'swap' },
  { tIn: 639.58, tOut: 641.933, kind: 'container', ref: 'card-precision-only-s3', state: 's3', grp: 'card-precision-only', tx: 'swap' },
  { tIn: 647.5, tOut: 650.82, kind: 'vid', ref: 'BR-16-server-racks-blinking', grp: 'BR-16-server-racks-blinking', tx: 'cut', cap: true },
  { tIn: 650.82, tOut: 652.58, kind: 'vid', ref: 'BR-17-scrolling-metrics-graph', grp: 'BR-17-scrolling-metrics-graph', tx: 'fade', cap: true },
  { tIn: 652.58, tOut: 655.88, kind: 'still', ref: 'IMG-5-phone-alert-glow', grp: 'IMG-5-phone-alert-glow', tx: 'eng', fx: 'roughly-1x', mo: 'img' },
  { tIn: 655.88, tOut: 657.52, kind: 'deck', ref: 'C9-sA1-chain', state: 'sA1-chain', grp: 'C9', tx: 'xfade' },
  { tIn: 657.52, tOut: 660.68, kind: 'deck', ref: 'C9-sA1b-documented', state: 'sA1b-documented', grp: 'C9', tx: 'swap' },
  { tIn: 660.68, tOut: 664.02, kind: 'deck', ref: 'C9-sA2-logs', state: 'sA2-logs', grp: 'C9', tx: 'swap' },
  { tIn: 664.02, tOut: 666.82, kind: 'deck', ref: 'C9-sA3-detector', state: 'sA3-detector', grp: 'C9', tx: 'swap' },
  { tIn: 666.82, tOut: 670.5, kind: 'deck', ref: 'C9-sA4-flags', state: 'sA4-flags', grp: 'C9', tx: 'swap' },
  { tIn: 670.5, tOut: 676.1, kind: 'receipt', ref: 'C24a-cloudwatch-alarm', grp: 'C24a', tx: 'xfade' },
  { tIn: 676.1, tOut: 678.9, kind: 'deck', ref: 'C9-sB1-alarm-lambda', state: 'sB1-alarm-lambda', grp: 'C9', tx: 'xfade' },
  { tIn: 678.9, tOut: 681.22, kind: 'deck', ref: 'C9-sB2-you-build', state: 'sB2-you-build', grp: 'C9', tx: 'swap' },
  { tIn: 681.22, tOut: 683.26, kind: 'deck', ref: 'C9-sB3-bedrock', state: 'sB3-bedrock', grp: 'C9', tx: 'swap' },
  { tIn: 683.26, tOut: 689.2, kind: 'receipt', ref: 'C25-bedrock-structured-output', grp: 'C25', tx: 'xfade' },
  { tIn: 689.2, tOut: 690.7, kind: 'deck', ref: 'C9-sC1-severity', state: 'sC1-severity', grp: 'C9', tx: 'xfade' },
  { tIn: 690.7, tOut: 692.18, kind: 'deck', ref: 'C9-sC2-category', state: 'sC2-category', grp: 'C9', tx: 'swap' },
  { tIn: 692.18, tOut: 694.18, kind: 'deck', ref: 'C9-sC3-alert', state: 'sC3-alert', grp: 'C9', tx: 'swap' },
  { tIn: 694.18, tOut: 696.96, kind: 'deck', ref: 'C9-sC4-sns', state: 'sC4-sns', grp: 'C9', tx: 'swap' },
  { tIn: 696.96, tOut: 697.9, kind: 'deck', ref: 'C9-sC5-page', state: 'sC5-page', grp: 'C9', tx: 'swap' },
  { tIn: 697.9, tOut: 702.8, kind: 'container', ref: 'card-c9-eval-1-s1', state: 's1', grp: 'card-c9-eval-1', tx: 'xfade' },
  { tIn: 702.8, tOut: 705.04, kind: 'container', ref: 'card-c9-eval-1-s2', state: 's2', grp: 'card-c9-eval-1', tx: 'swap' },
  { tIn: 705.04, tOut: 708.0, kind: 'vid', ref: 'BR-18-tired-rubs-eyes', grp: 'BR-18-tired-rubs-eyes', tx: 'fade', cap: true },
  { tIn: 708.0, tOut: 716.34, kind: 'receipt', ref: 'C24b-cloudwatch-flagged', grp: 'C24b', tx: 'xfade' },
  { tIn: 716.34, tOut: 720.38, kind: 'container', ref: 'card-c9-eval-3-s1', state: 's1', grp: 'card-c9-eval-3', tx: 'xfade' },
  { tIn: 720.38, tOut: 721.74, kind: 'container', ref: 'card-c9-eval-3-s2', state: 's2', grp: 'card-c9-eval-3', tx: 'swap' },
  { tIn: 721.74, tOut: 725.14, kind: 'container', ref: 'card-c9-eval-4-s1', state: 's1', grp: 'card-c9-eval-4', tx: 'xfade' },
  { tIn: 725.14, tOut: 730.52, kind: 'container', ref: 'card-c9-eval-4-s2', state: 's2', grp: 'card-c9-eval-4', tx: 'swap' },
  { tIn: 730.52, tOut: 732.86, kind: 'vid', ref: 'BR-19-hand-points-at-code', grp: 'BR-19-hand-points-at-code', tx: 'fade', cap: true },
  { tIn: 732.86, tOut: 742.6, kind: 'receipt', ref: 'C28-copilot-review-limits', grp: 'C28', tx: 'xfade' },
  { tIn: 742.6, tOut: 750.72, kind: 'container', ref: 'C10-s1', state: 's1', grp: 'C10', tx: 'xfade' },
  { tIn: 750.72, tOut: 756.28, kind: 'container', ref: 'C10-s2', state: 's2', grp: 'C10', tx: 'swap', pu: [[754.06,453,568,440,36]] },
  { tIn: 756.28, tOut: 759.7, kind: 'container', ref: 'C10-s3', state: 's3', grp: 'C10', tx: 'swap' },
  { tIn: 759.7, tOut: 766.54, kind: 'container', ref: 'C10-s4', state: 's4', grp: 'C10', tx: 'swap' },
  { tIn: 766.54, tOut: 769.28, kind: 'vid', ref: 'BR-20-taking-notes-closeup', grp: 'BR-20-taking-notes-closeup', tx: 'fade', cap: true },
  { tIn: 769.28, tOut: 773.46, kind: 'container', ref: 'C11-s1', state: 's1', grp: 'C11', tx: 'xfade' },
  { tIn: 773.46, tOut: 781.98, kind: 'container', ref: 'C11-s2', state: 's2', grp: 'C11', tx: 'swap', pu: [[775.32,1224,463,163,44],[775.96,1401,463,120,44],[776.96,1535,463,135,44],[779.60,567,490,533,36]] },
  { tIn: 781.98, tOut: 792.62, kind: 'receipt', ref: 'C26-anthropic-structured-outputs', grp: 'C26', tx: 'xfade' },
  { tIn: 792.62, tOut: 800.32, kind: 'container', ref: 'C11-s3', state: 's3', grp: 'C11', tx: 'xfade', pu: [[795.78,322,615,718,36]] },
  { tIn: 800.32, tOut: 805.0, kind: 'container', ref: 'C11-s4', state: 's4', grp: 'C11', tx: 'swap' },
  { tIn: 805.0, tOut: 814.1, kind: 'container', ref: 'C11-s5', state: 's5', grp: 'C11', tx: 'swap', pu: [[807.42,322,865,272,36],[809.56,600,865,635,36]] },
  { tIn: 814.1, tOut: 818.04, kind: 'still', ref: 'IMG-6-action-items', grp: 'IMG-6-action-items', tx: 'eng', fx: 'roughly-6x' },
  { tIn: 818.04, tOut: 820.405, kind: 'vid', ref: 'BR-21-document-on-desk-night', grp: 'BR-21-document-on-desk-night', tx: 'fade', cap: true },
  { tIn: 820.405, tOut: 823.84, kind: 'vid', ref: 'BR-22-hands-typing-night', grp: 'BR-22-hands-typing-night', tx: 'cut', cap: true },
  { tIn: 823.84, tOut: 827.7, kind: 'deck', ref: 'C6-s1-cycle', state: 's1-cycle', grp: 'C6', tx: 'xfade' },
  { tIn: 827.7, tOut: 829.02, kind: 'deck', ref: 'C6-s2-error-analysis', state: 's2-error-analysis', grp: 'C6', tx: 'swap' },
  { tIn: 829.02, tOut: 830.1, kind: 'deck', ref: 'C6-s3-measure', state: 's3-measure', grp: 'C6', tx: 'swap' },
  { tIn: 830.1, tOut: 830.74, kind: 'deck', ref: 'C6-s4-improve', state: 's4-improve', grp: 'C6', tx: 'swap' },
  { tIn: 830.74, tOut: 837.64, kind: 'receipt', ref: 'C22c-hamel-faq-100-traces', grp: 'C22c', tx: 'xfade' },
  { tIn: 837.64, tOut: 839.0, kind: 'deck', ref: 'C6-s5-read-traces', state: 's5-read-traces', grp: 'C6', tx: 'xfade' },
  { tIn: 839.0, tOut: 843.26, kind: 'deck', ref: 'C6-s6-cluster', state: 's6-cluster', grp: 'C6', tx: 'swap' },
  { tIn: 843.26, tOut: 845.06, kind: 'deck', ref: 'C6-s7-most-important', state: 's7-most-important', grp: 'C6', tx: 'swap' },
  { tIn: 845.06, tOut: 847.96, kind: 'deck', ref: 'C6-s8-grader', state: 's8-grader', grp: 'C6', tx: 'swap' },
  { tIn: 847.96, tOut: 849.58, kind: 'deck', ref: 'C6-s9-code', state: 's9-code', grp: 'C6', tx: 'swap' },
  { tIn: 849.58, tOut: 851.48, kind: 'deck', ref: 'C6-s10-judge', state: 's10-judge', grp: 'C6', tx: 'swap' },
  { tIn: 851.48, tOut: 853.9, kind: 'deck', ref: 'C6-s11-measure', state: 's11-measure', grp: 'C6', tx: 'swap' },
  { tIn: 853.9, tOut: 855.36, kind: 'deck', ref: 'C6-s12-fix-biggest', state: 's12-fix-biggest', grp: 'C6', tx: 'swap' },
  { tIn: 855.36, tOut: 855.76, kind: 'deck', ref: 'C6-s13-rerun', state: 's13-rerun', grp: 'C6', tx: 'swap' },
  { tIn: 855.76, tOut: 858.1, kind: 'deck', ref: 'C6-s14-again', state: 's14-again', grp: 'C6', tx: 'swap' },
  { tIn: 858.1, tOut: 860.8, kind: 'receipt', ref: 'C22d-hamel-faq-never-skip', grp: 'C22d', tx: 'xfade' },
  { tIn: 860.8, tOut: 866.06, kind: 'receipt', ref: 'C33-who-validates-abstract', grp: 'C33', tx: 'xfade' },
  { tIn: 866.06, tOut: 871.6, kind: 'clip', ref: 'CLIP-2-shreya-never-going-to-find-it', grp: 'CLIP-2-shreya-never-going-to-find-it', tx: 'fade' },
  { tIn: 871.6, tOut: 874.44, kind: 'container', ref: 'card-write-it-down-s1', state: 's1', grp: 'card-write-it-down', tx: 'fade' },
  { tIn: 874.44, tOut: 877.56, kind: 'container', ref: 'card-write-it-down-s2', state: 's2', grp: 'card-write-it-down', tx: 'swap' },
  { tIn: 877.56, tOut: 880.1, kind: 'container', ref: 'card-write-it-down-s3', state: 's3', grp: 'card-write-it-down', tx: 'swap' },
  { tIn: 880.1, tOut: 890.04, kind: 'chart', ref: 'chart-two-suites', grp: 'chart-two-suites', tx: 'xfade' },
  { tIn: 890.04, tOut: 893.04, kind: 'deck', ref: 'C12-s1-overview', state: 's1-overview', grp: 'C12', tx: 'xfade' },
  { tIn: 893.04, tOut: 898.14, kind: 'deck', ref: 'C12-s2-platforms', state: 's2-platforms', grp: 'C12', tx: 'swap' },
  { tIn: 898.14, tOut: 899.94, kind: 'deck', ref: 'C12-s3-langsmith', state: 's3-langsmith', grp: 'C12', tx: 'swap' },
  { tIn: 899.94, tOut: 905.42, kind: 'container', ref: 'card-platforms-s2', state: 's2', grp: 'card-platforms', tx: 'xfade' },
  { tIn: 905.42, tOut: 911.56, kind: 'container', ref: 'card-platforms-s3', state: 's3', grp: 'card-platforms', tx: 'swap' },
  { tIn: 911.56, tOut: 915.36, kind: 'container', ref: 'card-platforms-s4', state: 's4', grp: 'card-platforms', tx: 'swap' },
  { tIn: 915.36, tOut: 923.84, kind: 'container', ref: 'card-metric-libraries-s1', state: 's1', grp: 'card-metric-libraries', tx: 'xfade' },
  { tIn: 923.84, tOut: 929.06, kind: 'container', ref: 'card-metric-libraries-s2', state: 's2', grp: 'card-metric-libraries', tx: 'swap' },
  { tIn: 929.06, tOut: 937.28, kind: 'container', ref: 'card-runners-s1', state: 's1', grp: 'card-runners', tx: 'xfade' },
  { tIn: 937.28, tOut: 941.72, kind: 'container', ref: 'card-runners-s2', state: 's2', grp: 'card-runners', tx: 'swap' },
  { tIn: 941.72, tOut: 951.32, kind: 'receipt', ref: 'C19-openai-evals-deprecation', grp: 'C19', tx: 'xfade' },
  { tIn: 951.32, tOut: 953.56, kind: 'container', ref: 'card-openai-evals-s1', state: 's1', grp: 'card-openai-evals', tx: 'xfade' },
  { tIn: 953.56, tOut: 956.58, kind: 'container', ref: 'card-openai-evals-s2', state: 's2', grp: 'card-openai-evals', tx: 'swap' },
  { tIn: 956.58, tOut: 958.8, kind: 'vid', ref: 'BR-23-chip-in-gloved-hand', grp: 'BR-23-chip-in-gloved-hand', tx: 'fade', cap: true },
  { tIn: 958.8, tOut: 963.4, kind: 'deck', ref: 'C13-s1-row', state: 's1-row', grp: 'C13', tx: 'xfade' },
  { tIn: 963.4, tOut: 965.52, kind: 'deck', ref: 'C13-s2-function', state: 's2-function', grp: 'C13', tx: 'swap' },
  { tIn: 965.52, tOut: 967.28, kind: 'deck', ref: 'C13-s3-exact-match', state: 's3-exact-match', grp: 'C13', tx: 'swap' },
  { tIn: 967.28, tOut: 968.52, kind: 'deck', ref: 'C13-s4-key-phrase', state: 's4-key-phrase', grp: 'C13', tx: 'swap' },
  { tIn: 968.52, tOut: 970.1, kind: 'deck', ref: 'C14-s1-prompt', state: 's1-prompt', grp: 'C14', tx: 'xfade' },
  { tIn: 970.1, tOut: 971.0, kind: 'deck', ref: 'C14-s2-rubric', state: 's2-rubric', grp: 'C14', tx: 'swap' },
  { tIn: 971.0, tOut: 973.96, kind: 'deck', ref: 'C14-s3-answer', state: 's3-answer', grp: 'C14', tx: 'swap' },
  { tIn: 973.96, tOut: 975.3, kind: 'deck', ref: 'C14-s4-result', state: 's4-result', grp: 'C14', tx: 'swap' },
  { tIn: 975.3, tOut: 978.2, kind: 'deck', ref: 'C14-s5-anthropic', state: 's5-anthropic', grp: 'C14', tx: 'swap' },
  { tIn: 978.2, tOut: 980.06, kind: 'deck', ref: 'C15-s1-file', state: 's1-file', grp: 'C15', tx: 'xfade' },
  { tIn: 980.06, tOut: 981.38, kind: 'deck', ref: 'C15-s2-loop', state: 's2-loop', grp: 'C15', tx: 'swap' },
  { tIn: 981.38, tOut: 983.26, kind: 'deck', ref: 'C15-s3-calls', state: 's3-calls', grp: 'C15', tx: 'swap' },
  { tIn: 983.26, tOut: 984.58, kind: 'deck', ref: 'C15-s4-table', state: 's4-table', grp: 'C15', tx: 'swap' },
  { tIn: 984.58, tOut: 988.26, kind: 'deck', ref: 'C15-s5-ci-gate', state: 's5-ci-gate', grp: 'C15', tx: 'swap' },
  { tIn: 988.26, tOut: 989.14, kind: 'container', ref: 'card-the-rule-s1', state: 's1', grp: 'card-the-rule', tx: 'xfade' },
  { tIn: 989.14, tOut: 990.34, kind: 'container', ref: 'card-the-rule-s2', state: 's2', grp: 'card-the-rule', tx: 'swap' },
  { tIn: 990.34, tOut: 991.36, kind: 'container', ref: 'card-the-rule-s3', state: 's3', grp: 'card-the-rule', tx: 'swap' },
  { tIn: 991.36, tOut: 993.68, kind: 'container', ref: 'card-the-rule-s4', state: 's4', grp: 'card-the-rule', tx: 'swap' },
  { tIn: 993.68, tOut: 995.62, kind: 'vid', ref: 'BR-24-tape-measure-dark-macro', grp: 'BR-24-tape-measure-dark-macro', tx: 'fade', cap: true },
  { tIn: 995.62, tOut: 1007.64, kind: 'chart', ref: 'chart-score-over-versions', grp: 'chart-score-over-versions', tx: 'xfade' },
  { tIn: 1007.64, tOut: 1010.66, kind: 'vid', ref: 'BR-25-cargo-ship-night-dock', grp: 'BR-25-cargo-ship-night-dock', tx: 'fade', cap: true, fd: 0.13 },
  { tIn: 1010.66, tOut: 1013.06, kind: 'container', ref: 'card-the-ask-s1', state: 's1', grp: 'card-the-ask', tx: 'xfade' },
  { tIn: 1013.06, tOut: 1014.9, kind: 'container', ref: 'card-the-ask-s2', state: 's2', grp: 'card-the-ask', tx: 'swap' },
  { tIn: 1014.9, tOut: 1015.94, kind: 'container', ref: 'card-the-ask-s3', state: 's3', grp: 'card-the-ask', tx: 'swap' },
  { tIn: 1015.94, tOut: 1022.94, kind: 'container', ref: 'end-card', state: 'one', grp: 'end-card', tx: 'xfade' },
];

// 24 / 25 / 29.97 fps Envato clips play frame-for-frame (playbackRate 30 / fps; comp-build §11, check_broll_motion).
const VID_FPS: Record<string, number> = {
  'BR-1-confident-smirk-dim-office': 25 / 1, 'BR-2-green-server-dolly': 30 / 1, 'BR-3-stairwell-pipes-fall': 30000 / 1001,
  'BR-4-splitflap-departures': 25 / 1, 'BR-5-mono-corridor-flythrough': 30 / 1, 'BR-6-sensor-red-led-dark': 25 / 1,
  'BR-7-hand-stop-closeup': 25 / 1, 'BR-8-mousetrap-snap': 30000 / 1001, 'BR-9-steel-pipeline-glide': 25 / 1,
  'BR-10-red-error-windows': 30 / 1, 'BR-11-expert-reads-report-dark': 25 / 1, 'BR-12-glasses-screen-reflection': 25 / 1,
  'BR-13-server-aisle-teal-dolly': 25 / 1, 'BR-14-night-highway-trails': 24 / 1, 'BR-15-hand-pulls-library-book': 25 / 1,
  'BR-16-server-racks-blinking': 24 / 1, 'BR-17-scrolling-metrics-graph': 30 / 1, 'BR-18-tired-rubs-eyes': 25 / 1,
  'BR-19-hand-points-at-code': 25 / 1, 'BR-20-taking-notes-closeup': 30000 / 1001, 'BR-21-document-on-desk-night': 25 / 1,
  'BR-22-hands-typing-night': 30000 / 1001, 'BR-23-chip-in-gloved-hand': 25 / 1, 'BR-24-tape-measure-dark-macro': 24 / 1,
  'BR-25-cargo-ship-night-dock': 25 / 1,
};
// §6a cost trap: an engine fed two VIDEO sides gets the exact cut frames as stills (BR-17 out -> IMG-5 glow clip in).
const CUTFRAME: Record<string, string> = {
  'BR-17-scrolling-metrics-graph': 'transitions/cutframes/BR-17-out.jpg',
  'IMG-5-phone-alert-glow': 'transitions/cutframes/IMG-5-in.jpg',
};
// §3c: the IMG-5 slot plays its Seedance motion clip (assets/img/IMG-5-phone-alert-glow.mp4, from clip 0, cut at the
// slot end, no extra push; COVER-PLAN notes + PROJECT-LOG). The still img/IMG-5-phone-alert.png is the BENCH fallback.

const ACCENTS: [number, string][] = [[70.025, '#ff5c5c'], [227.04, '#00c2ff'], [483.115, '#a78bfa'], [820.405, '#2dd4bf'], [993.68, '#22c55e'], [1e9, '#ffd700']];
const accentAt = (t: number) => ACCENTS.find(([end]) => t < end)![1];
const ease = Easing.inOut(Easing.cubic);
const clampX = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// push blocks: contiguous rows of one grp + kind push as ONE move, so a state swap never jumps scale (§7a)
const BLOCKS: { s: number; e: number }[] = (() => {
  const out: { s: number; e: number }[] = [];
  let start = 0;
  COVERS.forEach((c, i) => {
    const prev = COVERS[i - 1];
    if (!prev || prev.grp !== c.grp || prev.kind !== c.kind || Math.abs(prev.tOut - c.tIn) > 1e-6) start = i;
    out[i] = { s: start, e: i };
  });
  for (let i = COVERS.length - 1; i >= 0; i--) {
    const nx = COVERS[i + 1];
    if (nx && out[i + 1].s === out[i].s) out[i].e = out[i + 1].e;
  }
  return out.map((b) => ({ s: F(COVERS[b.s].tIn), e: FE(COVERS[b.e].tOut) }));
})();

/** sub-spotlights on a slide PNG: pulses (chip rings, previous ones stay faintly lit) and focus (push + vignette) */
const Spots: React.FC<{ c: Cover; t: number; accent: string }> = ({ c, t, accent }) => (
  <>
    {(c.pu ?? []).map(([t0, x, y, w, h], j) => {
      if (t < t0) return null;
      const next = (c.pu ?? [])[j + 1];
      const active = !next || t < next[0];
      const k = (t - t0) * FPS;
      const pop = interpolate(k, [0, 4, 9], [0.92, 1.06, 1], clampX);
      const op = interpolate(k, [0, 4], [0, 1], clampX) * (active ? 1 : 0.45);
      return (
        <div key={j} style={{ position: 'absolute', left: x - 7, top: y - 7, width: w + 14, height: h + 14, borderRadius: 16,
          border: `3px solid ${accent}`, boxShadow: `0 0 26px ${accent}, inset 0 0 18px ${accent}55`, opacity: op, transform: `scale(${pop})` }} />
      );
    })}
  </>
);
const focusState = (c: Cover, t: number) => {
  const fo = c.fo ?? [];
  let cur = -1;
  fo.forEach(([t0], j) => { if (t >= t0) cur = j; });
  type FS = { x: number; y: number; w: number; h: number; s: number; dim: number };
  const st = (j: number): FS => {
    if (j < 0) return { x: 0, y: 0, w: 1920, h: 1080, s: 1, dim: 0 };
    const [, x, y, w, h] = fo[j];
    if (w <= 0) { const prev: FS = st(j - 1); return { ...prev, s: 1, dim: 0 }; }
    return { x, y, w, h, s: 1.12, dim: 1 };
  };
  const a = st(cur - 1); const b = st(cur);
  const p = cur < 0 ? 1 : interpolate(t, [fo[cur][0], fo[cur][0] + 0.3], [0, 1], { ...clampX, easing: ease });
  const m = (u: number, v: number) => u + (v - u) * p;
  return { x: m(a.x, b.x), y: m(a.y, b.y), w: m(a.w, b.w), h: m(a.h, b.h), s: m(a.s, b.s), dim: m(a.dim, b.dim) };
};
/** camera: show point (cx, cy) at scale s, clamped so the frame always stays covered */
const camXform = (cx: number, cy: number, s: number) => {
  const tx = Math.min(0, Math.max(1920 - 1920 * s, 960 - cx * s));
  const ty = Math.min(0, Math.max(1080 - 1080 * s, 540 - cy * s));
  return `translate(${tx}px, ${ty}px) scale(${s})`;
};

const SlideView: React.FC<{ c: Cover; abs: number; dir: string }> = ({ c, abs, dir }) => {
  const t = c.tIn + (abs - F(c.tIn)) / FPS;
  const i = COVERS.indexOf(c);
  const b = BLOCKS[i];
  const push = c.np ? 1 : interpolate(abs, [b.s, b.e], [1, c.kind === 'deck' ? 1.03 : 1.025], clampX);
  const fs = focusState(c, t);
  const cx = 960 + (fs.x + fs.w / 2 - 960) * 0.7;
  const cy = 540 + (fs.y + fs.h / 2 - 540) * 0.7;
  const accent = accentAt(c.tIn);
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0c10', overflow: 'hidden' }}>
      <AbsoluteFill style={{ transformOrigin: '0 0', transform: c.fo ? camXform(cx, cy, fs.s) : `translate(${960 - 960 * push}px, ${540 - 540 * push}px) scale(${push})` }}>
        <Img src={staticFile(`${dir}/${c.ref}.png`)} style={fill} />
        <Spots c={c} t={t} accent={accent} />
        {c.fo && fs.dim > 0.001 && (
          <div style={{ position: 'absolute', left: fs.x - 10, top: fs.y - 10, width: fs.w + 20, height: fs.h + 20, borderRadius: 18,
            border: `3px solid ${accent}`, boxShadow: `0 0 0 4000px rgba(4,6,10,${0.62 * fs.dim}), 0 0 30px ${accent}`, opacity: fs.dim }} />
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// receipts: camera keys [t, cx, cy, s] (capture CSS coords, 1920 x 1080 of the @2x PNG) and [HIGHLIGHT] rects measured on
// the capture (receipts/*.json anchors, refined on gridded crops _previews/qa/receipt-crops/). #ffe14d, multiply,
// wiping left to right from the quoted word's onset, inside the camera transform so it rides the push.
const RC: Record<string, { cam: number[][]; hl: [number, number[][]][] }> = {
  'C17a-anthropic-flight-booked': { cam: [[32.52, 965, 520, 1.9], [36.24, 1000, 522, 2.2]], hl: [[34.0, [[905, 513, 240, 26]]]] },
  'C18-anthropic-passk': { cam: [[106.88, 960, 420, 1.9], [112.82, 960, 410, 2.2]], hl: [[108.8, [[637, 389, 646, 24], [637, 415, 94, 24]]]] },
  'C30-xstest-abstract': { cam: [[136.06, 838, 200, 1.15], [141.32, 838, 210, 1.2]], hl: [[137.3, [[1588, 228, 24, 19], [39, 249, 83, 19]]], [139.6, [[662, 249, 124, 19]]]] },
  'C20-mmlu-pro-abstract': { cam: [[168.06, 560, 160, 1.5], [172.9, 560, 160, 1.6], [173.6, 856, 236, 2.4], [178.4, 856, 236, 2.55]], hl: [[173.7, [[707, 228, 298, 19]]]] },
  'C31-anthropic-design-principles': { cam: [[191.24, 943, 470, 1.8], [198.38, 943, 460, 2.1]], hl: [[191.3, [[552, 429, 125, 22]]], [193.1, [[817, 429, 259, 22]]], [197.3, [[1178, 429, 155, 22]]]] },
  'C17c-anthropic-saturation': { cam: [[206.14, 960, 450, 1.9], [216.42, 940, 430, 2.2]], hl: [[208.1, [[638, 409, 598, 25]]]] },
  // authors lit as they are said (Mike's draft-v1 note 2026-10-20): 'Hamel Husain' on its onset 216.42, 'Shreya Shankar' 220.04
  'C22a-header': { cam: [[216.42, 775, 240, 1.7], [223.7, 775, 240, 1.85]], hl: [[216.45, [[486, 261, 94, 23]]], [220.04, [[486, 285, 104, 23]]]] },
  'C22a-hamel-faq-generic-evals': { cam: [[223.7, 890, 540, 1.9], [227.04, 890, 540, 2.05]], hl: [[223.8, [[515, 530, 440, 24]]]] },
  'C17b-anthropic-dataset-size': { cam: [[289.16, 960, 470, 1.9], [298.56, 960, 450, 2.2]], hl: [[289.5, [[763, 448, 462, 24]]], [294.3, [[696, 421, 213, 24]]]] },
  'C16-anthropic-grading-list': { cam: [[361.46, 943, 520, 1.8], [366.26, 943, 540, 2.1]], hl: [[363.6, [[1129, 557, 206, 22], [552, 581, 80, 22]]]] },
  'C22b-hamel-faq-validation': { cam: [[404.14, 890, 220, 1.85], [412.02, 900, 240, 2.05]], hl: [[405.52, [[832, 246, 296, 26]]]] },
  'C22b-hamel-faq-100-200-labels': { cam: [[412.02, 867, 480, 1.9], [415.1, 867, 480, 2.05]], hl: [[412.1, [[1080, 458, 168, 26], [486, 484, 230, 26]]]] },
  'C21-zheng-judge-abstract': { cam: [[415.1, 450, 160, 1.5], [418.0, 450, 160, 1.6], [418.7, 405, 258, 2.4], [424.42, 405, 258, 2.5]], hl: [[418.8, [[340, 249, 130, 19]]]] },
  'C23-langfuse-offline-online': { cam: [[451.7, 960, 300, 1.9], [460.46, 990, 290, 2.2]], hl: [[451.9, [[766, 264, 444, 22]]]] },
  'C32-ragas-faithfulness': { cam: [[518.98, 960, 250, 1.7], [525.28, 960, 250, 2.0]], hl: [[520.0, [[1166, 120, 166, 22]]], [521.1, [[546, 306, 826, 60]]]] },
  'C24a-cloudwatch-alarm': { cam: [[670.5, 800, 470, 1.8], [676.1, 800, 470, 2.0]], hl: [[672.7, [[549, 429, 116, 22]]], [673.8, [[818, 488, 228, 22]]]] },
  'C25-bedrock-structured-output': { cam: [[683.26, 865, 440, 1.8], [689.2, 865, 440, 2.0]], hl: [[687.6, [[758, 431, 212, 22]]]] },
  'C24b-cloudwatch-flagged': { cam: [[708.0, 864, 480, 1.6], [716.34, 864, 480, 1.72]], hl: [[712.4, [[1328, 453, 78, 21], [323, 479, 542, 22]]]] },
  'C28-copilot-review-limits': { cam: [[732.86, 832, 480, 1.9], [740.9, 832, 485, 2.05], [741.6, 760, 500, 2.2], [742.6, 760, 500, 2.25]], hl: [[736.68, [[566, 466, 533, 22]]], [741.02, [[566, 493, 334, 22]]]] },
  'C26-anthropic-structured-outputs': { cam: [[781.98, 856, 372, 1.9], [786.6, 856, 380, 2.0], [787.4, 700, 570, 1.5], [792.62, 700, 570, 1.55]], hl: [[783.5, [[697, 362, 318, 21]]], [787.0, [[514, 420, 268, 24]]], [787.6, [[515, 708, 370, 24]]]] },
  'C22c-hamel-faq-100-traces': { cam: [[830.74, 870, 515, 1.8], [834.2, 870, 515, 1.85], [834.9, 870, 90, 1.85], [837.64, 870, 90, 1.9]], hl: [[832.6, [[486, 503, 313, 24]]], [834.7, [[1188, 52, 60, 24], [486, 78, 262, 24]]]] },
  'C22d-hamel-faq-never-skip': { cam: [[858.1, 875, 545, 1.9], [860.8, 875, 545, 2.0]], hl: [[858.3, [[1102, 530, 128, 22], [520, 555, 82, 22]]]] },
  'C33-who-validates-abstract': { cam: [[860.8, 600, 150, 1.5], [866.06, 600, 150, 1.6]], hl: [[861.0, [[18, 105, 1176, 30]]], [862.9, [[18, 147, 119, 21]]]] },
  'C19-openai-evals-deprecation': { cam: [[941.72, 800, 340, 1.8], [951.32, 800, 390, 2.0]], hl: [[946.3, [[513, 358, 390, 24]]], [949.0, [[513, 399, 548, 24]]]] },
};
const camAt = (cam: number[][], t: number) => {
  if (t <= cam[0][0]) return cam[0].slice(1);
  for (let i = 1; i < cam.length; i++) {
    if (t <= cam[i][0]) {
      const p = interpolate(t, [cam[i - 1][0], cam[i][0]], [0, 1], { ...clampX, easing: Easing.inOut(Easing.sin) });
      return [1, 2, 3].map((k) => cam[i - 1][k] + (cam[i][k] - cam[i - 1][k]) * p);
    }
  }
  return cam[cam.length - 1].slice(1);
};
const ReceiptView: React.FC<{ c: Cover; abs: number }> = ({ c, abs }) => {
  const t = c.tIn + (abs - F(c.tIn)) / FPS;
  const rc = RC[c.ref];
  if (!rc) throw new Error(`receipt ${c.ref} has no camera row`);
  const [cx, cy, s] = camAt(rc.cam, t);
  return (
    <AbsoluteFill style={{ backgroundColor: '#f8f7f3', overflow: 'hidden' }}>
      <AbsoluteFill style={{ transformOrigin: '0 0', transform: camXform(cx, cy, s) }}>
        <Img src={staticFile(`receipts/${c.ref}.png`)} style={{ width: 1920, height: 1080 }} />
        {rc.hl.map(([t0, rects], j) => rects.map(([x, y, w, h], k) => {
          const p = interpolate(t, [t0 + k * 0.28, t0 + k * 0.28 + 0.32], [0, 1], { ...clampX, easing: Easing.out(Easing.quad) });
          return p > 0 ? <div key={`${j}-${k}`} style={{ position: 'absolute', left: x, top: y, width: w * p, height: h, background: '#ffe14d', mixBlendMode: 'multiply', borderRadius: 3 }} /> : null;
        }))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const StillView: React.FC<{ c: Cover; abs: number }> = ({ c, abs }) => {
  const lf = abs - F(c.tIn);
  const s = interpolate(lf, [0, FE(c.tOut) - F(c.tIn)], [1, 1.08], clampX);   // slow push (AI stills never sit dead still)
  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: 'black' }}>
      <Img src={staticFile(`img/${c.ref}.png`)} style={{ ...fill, transform: `scale(${s})` }} />
    </AbsoluteFill>
  );
};

const ChartFor: React.FC<{ c: Cover; lf: number }> = ({ c, lf }) => {
  if (c.ref === 'chart-saturation') return <ChartSaturation lf={lf} />;
  if (c.ref === 'C5') return <ChartC5 lf={lf} />;
  if (c.ref === 'chart-two-suites') return <ChartTwoSuites lf={lf} />;
  if (c.ref === 'chart-score-over-versions') return <ChartScoreOverVersions lf={lf} />;
  throw new Error(`no animated chart component for ${c.ref}`);
};

// §3d the CLIP-2 splice: lead-in = the clip's FIRST frame held under the set-up line; over the paused window (its voice is
// already in the VO track) the clip plays FULL-FRAME and MUTED; lead-out = its LAST frame held under the resume line.
// insert-in / insert-out = hand:fade 0.5 s (TRANSITIONS.md bucket insert) between the held frame and the playing clip.
const CLIP_PAUSE = INSERTS[4];
const CLIP_FRAMES = 300;
const ClipView: React.FC<{ c: Cover; abs: number }> = ({ c, abs }) => {
  const src = staticFile(`clip-inserts/${c.ref}.mp4`);
  const p0 = FE(CLIP_PAUSE.at), p1 = F(CLIP_PAUSE.at);
  const k = abs < p0 ? 0 : abs < p1 ? abs - p0 : CLIP_FRAMES - 1;
  const fin = interpolate(abs, [p0, p0 + 15], [0, 1], clampX);        // hand:fade insert-in
  const fout = interpolate(abs, [p1 - 15, p1], [0, 1], clampX);       // hand:fade insert-out
  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      <Freeze frame={abs < p0 + 15 ? 0 : CLIP_FRAMES - 1}><OffthreadVideo src={src} muted style={fill} /></Freeze>
      {abs >= p0 && abs < p1 && (
        <AbsoluteFill style={{ opacity: fin * (1 - fout) }}><Freeze frame={k}><OffthreadVideo src={src} muted style={fill} /></Freeze></AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

/** BR-25, THE VIBE CUT: crash zoom 1.00 -> 1.12 over 6 frames ON the cut + the LINE-CAPTION (replaces the house caption) */
const LineCaption: React.FC<{ lf: number }> = ({ lf }) => {
  const p = interpolate(lf, [2, 8], [0, 1], { ...clampX, easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ position: 'absolute', left: 96, bottom: 104, maxWidth: 1300, fontFamily: `${OSWALD}, 'Arial Narrow', sans-serif`, fontWeight: 700,
      fontSize: 76, lineHeight: 1.02, letterSpacing: '0.01em', textTransform: 'uppercase', color: '#fff',
      textShadow: '0 4px 24px rgba(0,0,0,.85), 0 0 2px rgba(0,0,0,.9)', opacity: p, transform: `translateY(${(1 - p) * 24}px)` }}>
      TEAMS THAT SHIP AI THAT WORKS MEASURE IT
    </div>
  );
};

/** what a cover row shows at absolute frame `abs`. `eng` = mounted inside a transition engine: videos become their
 * CUTFRAME stills (§6a cost trap). Everything else is a pure function of abs, so engine copies match the live track. */
const CoverView: React.FC<{ c: Cover; abs: number; eng?: boolean }> = ({ c, abs, eng }) => {
  const lf = abs - F(c.tIn);
  switch (c.kind) {
    case 'container': return <SlideView c={c} abs={abs} dir="card-slides" />;
    case 'deck': return <SlideView c={c} abs={abs} dir="diagrams" />;
    case 'receipt': return <ReceiptView c={c} abs={abs} />;
    case 'chart': return <AbsoluteFill><ChartFor c={c} lf={lf} /></AbsoluteFill>;
    case 'clip': return <ClipView c={c} abs={abs} />;
    case 'still':
      if (c.mo) {
        if (eng) return <Img src={staticFile(CUTFRAME[c.ref])} style={fill} />;
        return <OffthreadVideo src={staticFile(`img/${c.ref}.mp4`)} muted style={fill} />;
      }
      return <StillView c={c} abs={abs} />;
    case 'vid': {
      if (eng && CUTFRAME[c.ref]) return <Img src={staticFile(CUTFRAME[c.ref])} style={fill} />;
      const crash = c.ref === 'BR-25-cargo-ship-night-dock' ? interpolate(lf, [0, 6], [1, 1.12], clampX) : 1;
      return (
        <AbsoluteFill style={{ backgroundColor: 'black', overflow: 'hidden' }}>
          <AbsoluteFill style={{ transform: `scale(${crash})` }}>
            <OffthreadVideo src={staticFile(`vid/${c.ref}.mp4`)} muted playbackRate={FPS / (VID_FPS[c.ref] ?? FPS)} style={fill} />
          </AbsoluteFill>
          {c.ref === 'BR-25-cargo-ship-night-dock' && <LineCaption lf={lf} />}
        </AbsoluteFill>
      );
    }
  }
};
const LiveCover: React.FC<{ c: Cover; eng?: boolean }> = ({ c, eng }) => <CoverView c={c} abs={useAbs()} eng={eng} />;

const ingressFrames = (c: Cover) =>
  c.tx === 'xfade' ? 11 : c.tx === 'fade' ? Math.round((c.fd ?? 0.5) * FPS) : c.tx === 'swap' ? 6 : 0;

const CoverRow: React.FC<{ c: Cover }> = ({ c }) => {
  const abs = useAbs();
  const lf = abs - F(c.tIn);
  const n = ingressFrames(c);
  const op = n ? interpolate(lf, [0, n], [0, 1], clampX) : 1;
  const sc = c.tx === 'xfade' ? interpolate(lf, [0, n], [0.93, 1], { ...clampX, easing: Easing.out(Easing.cubic) }) : 1;
  return (
    <AbsoluteFill style={{ opacity: op, transform: `scale(${sc})` }}>
      <CoverView c={c} abs={abs} />
    </AbsoluteFill>
  );
};

const CoverTrack: React.FC = () => (
  <>
    {COVERS.map((c, i) => {
      const nx = COVERS[i + 1];
      const tail = nx && Math.abs(nx.tIn - c.tOut) < 1e-6 && F(nx.tIn) === FE(c.tOut) ? ingressFrames(nx) : 0;
      const from = F(c.tIn);
      return (
        <Sequence key={i} from={from} durationInFrames={FE(c.tOut) - from + tail}>
          <CoverRow c={c} />
        </Sequence>
      );
    })}
  </>
);

// ===================================================================================== §6 library engines over the track
const swapFrames = (row: ReturnType<typeof getTransition>, win: number) => {
  const p = (row!.params ?? {}) as any;
  if (row!.engine === 'LightLeaks' || row!.engine === 'MeltEquidistant') return Math.ceil(p.cut * (win - 1) - 1e-6);
  if (row!.engine === 'PerspectiveEase') return Math.ceil(p.outPhase.win[0] * FPS - 1e-6);
  return Math.ceil(p.cut * FPS - 1e-6);                                   // GlitchRoughly: cut in seconds
};
/** one library transition, its Sequence EXACTLY the engine window, the engine's A->B swap landing ON `cutF` (§6a) */
const EngineAt: React.FC<{ id: string; cutF: number; outClip: () => React.ReactNode; inClip: () => React.ReactNode; fromSrc?: string; toSrc?: string }> =
  ({ id, cutF, outClip, inClip, fromSrc, toSrc }) => {
    const row = getTransition(id);
    if (!row) throw new Error(`unknown transition id ${id}`);
    const Engine = ENGINES[row.engine] as React.FC<any>;
    const win = framesForRow(row, FPS);
    return (
      <Sequence from={cutF - swapFrames(row, win)} durationInFrames={win}>
        <Engine from={outClip()} to={inClip()} outClip={outClip} inClip={inClip} fromSrc={fromSrc} toSrc={toSrc}
          durationInFrames={win} params={row.params} sfxSrc={null} sfx={false} />
      </Sequence>
    );
  };
// MELT engines are canvas warps that read STILLS: hand them the exact PNGs the rows air at that instant (np rows).
const MELT_SRC: Record<string, [string, string]> = {
  'melt-equidistant-3': ['diagrams/C1-s1-left.png', 'diagrams/C1-s2-right.png'],
  'melt-equidistant-1': ['card-slides/card-hitl-gate-s4.png', 'diagrams/C8-s2a-verdicts.png'],
};
const CoverEngines: React.FC = () => (
  <>
    {COVERS.map((c, i) => {
      if (c.tx !== 'eng' || !c.fx) return null;
      const out = COVERS[i - 1];
      const ms = MELT_SRC[c.fx];
      return (
        <EngineAt key={i} id={c.fx} cutF={F(c.tIn)} fromSrc={ms?.[0]} toSrc={ms?.[1]}
          outClip={() => <LiveCover c={out} eng />} inClip={() => <LiveCover c={c} eng />} />
      );
    })}
  </>
);
// punch-leak: the LightLeaks engine with the continuous spine as A (pre-step scale) and B (post-step scale), the step on
// the join frame; it sits under the captions.
const PunchLeaks: React.FC = () => (
  <>
    {PUNCHES.map((p) => {
      const jf = F(p.t);
      const before = punchAt(jf - 1);
      return <EngineAt key={p.t} id={p.leak} cutF={jf} outClip={() => <LiveSpine s={before} />} inClip={() => <LiveSpine s={p.s} />} />;
    })}
  </>
);

// hand:film-burn on every face edge: warm radial flash peaking ON the cut, +/- 0.38 s (11 frames each side)
const FILM_BURNS: number[] = FACES.flatMap((w) => (w.a === 0 ? [F(w.b)] : [F(w.a), F(w.b)]));
const FilmBurn: React.FC = () => {
  const f = useCurrentFrame();
  const e = interpolate(f, [0, 11, 22], [0, 1, 0], { ...clampX, easing: Easing.inOut(Easing.sin) });
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: e,
        background: 'radial-gradient(ellipse at 28% 42%, rgba(255,246,220,1) 0%, rgba(255,170,70,.95) 22%, rgba(230,90,20,.7) 48%, rgba(120,20,0,.25) 72%, rgba(0,0,0,0) 90%)' }} />
      <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: e * 0.55,
        background: 'radial-gradient(ellipse at 82% 70%, rgba(255,200,120,.9) 0%, rgba(255,110,30,.5) 35%, rgba(0,0,0,0) 70%)' }} />
    </AbsoluteFill>
  );
};

// ===================================================================================== chapter cards (rmn:slide)
const CARDS = [
  { at: 70.025, img: 'title-card-ch2' },   // WHY NORMAL TESTS FAIL
  { at: 227.04, img: 'title-card-ch3' },   // THE ANATOMY OF AN EVAL
  { at: 483.115, img: 'title-card-ch4' },  // FIVE PRODUCTS, FIVE EVAL SETS
  { at: 820.405, img: 'title-card-ch5' },  // SETTING IT UP
];
const TURN = 15;                           // rmn:slide 0.50 s (TRANSITIONS.md section 1)
// The card slides in BEFORE the pause (lead = TURN), holds through the whole 1.5 s pause, slides out after it:
// readable = lead + PAUSE - turn = 1.5 s. Asserted so it cannot regress (comp-build §6, Mike 2026-07-25).
for (const c of CARDS) {
  const readable = (F(c.at) - FE(c.at)) / FPS;
  if (readable < 1.0) throw new Error(`card ${c.img} readable ${readable}s < 1.0 s`);
}
const SLIDE = slide({ direction: 'from-right' });
const SlidePres = SLIDE.component as React.FC<any>;
const noop = () => undefined;
const cardPhase = (abs: number) => {
  for (const c of CARDS) {
    const a = FE(c.at), b = F(c.at);
    if (abs >= a - TURN && abs < a) return { c, dir: 'in' as const, p: interpolate(abs, [a - TURN, a], [0, 1], { ...clampX, easing: ease }) };
    if (abs >= a && abs < b) return { c, dir: 'hold' as const, p: 1 };
    if (abs >= b && abs < b + TURN) return { c, dir: 'out' as const, p: interpolate(abs, [b, b + TURN], [0, 1], { ...clampX, easing: ease }) };
  }
  return null;
};
const CardScene: React.FC<{ phase: NonNullable<ReturnType<typeof cardPhase>> }> = ({ phase }) => (
  <SlidePres presentationProgress={phase.dir === 'out' ? phase.p : phase.dir === 'in' ? phase.p : 1}
    presentationDirection={phase.dir === 'out' ? 'exiting' : 'entering'} passedProps={SLIDE.props}
    presentationDurationInFrames={TURN} onElementImage={noop} onUnmount={noop} bothEnteringAndExiting={false}>
    <Img src={staticFile(`title-slides/${phase.c.img}.png`)} style={fill} />
  </SlidePres>
);

// ===================================================================================== §8 captions (Montserrat, topmost)
// CAPTION_SRC = EvalsCaptions CAPTION_WINDOWS, each window clipped at a card pause it overruns by < 0.1 s (the generator
// used the planned 70.08; the baked CH2 pause sits at 70.025). Asserted equal below so the two cannot drift.
const CAPTION_SRC: [number, number][] = [
  [0.0, 3.733], [12.0, 19.86], [36.24, 40.12], [53.833, 58.3], [68.28, 70.025], [119.0, 122.66], [141.32, 145.1],
  [158.04, 161.18], [178.4, 184.567], [227.42, 230.92], [286.16, 289.16], [339.78, 343.42], [431.467, 438.14],
  [448.66, 451.7], [460.46, 463.52], [497.8, 500.8], [552.233, 557.033], [641.933, 652.58], [705.04, 708.0],
  [730.52, 732.86], [766.54, 769.28], [818.04, 823.84], [956.58, 958.8], [993.68, 995.62], [1007.64, 1010.66],
];
const clipToPause = ([a, b]: [number, number]): [number, number] => {
  for (const p of CARD_T) if (a < p && p < b && b - p < 0.1) return [a, p];
  return [a, b];
};
if (CAPTION_SRC.length !== CAPTION_WINDOWS.length || CAPTION_WINDOWS.some((w, i) => {
  const c = clipToPause(w);
  return Math.abs(c[0] - CAPTION_SRC[i][0]) > 1e-6 || Math.abs(c[1] - CAPTION_SRC[i][1]) > 1e-6;
})) throw new Error('CAPTION_SRC drifted from EvalsCaptions CAPTION_WINDOWS');
const CAP_WIN_F = CAPTION_SRC.map(([a, b]) => [sh(a) * FPS, shEnd(b) * FPS]);
// BR-25 carries its LINE-CAPTION instead of the house caption (EDIT-PLAN 16:47.6)
const LINE_CAPTION_F = [F(1007.64), FE(1010.66)];
const CAPS = ZCAPTIONS.map((c) => ({ tf: sh(c.t) * FPS, h: c.h }));
const Captions: React.FC = () => {
  const f = useAbs();
  if (!CAP_WIN_F.some(([a, b]) => f >= a && f < b)) return null;
  if (f >= LINE_CAPTION_F[0] && f < LINE_CAPTION_F[1]) return null;
  if (cardPhase(f) || (f >= FE(CLIP_PAUSE.at) && f < F(CLIP_PAUSE.at))) return null;
  let cur: { tf: number; h: string } | null = null;
  let nextTf = Infinity;
  for (const c of CAPS) { if (c.tf <= f) cur = c; else { nextTf = c.tf; break; } }
  if (!cur || f >= Math.min(nextTf, cur.tf + 1.3 * FPS)) return null;
  const k = f - cur.tf;
  const s = interpolate(k, [0, 4, 9], [0.7, 1.12, 1], clampX);
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 96, pointerEvents: 'none' }}>
      <div style={{ fontFamily: `${MONTSERRAT}, 'Arial Black', 'Segoe UI', sans-serif`, fontWeight: 900, textTransform: 'lowercase',
        fontSize: 86, lineHeight: 1.1, color: '#fff', WebkitTextStroke: '12px #000', paintOrder: 'stroke fill', textAlign: 'center',
        maxWidth: 1600, transform: `scale(${s})` }}>{cur.h}</div>
    </AbsoluteFill>
  );
};

// ===================================================================================== the composition
export const Evals: React.FC = () => {
  const abs = useCurrentFrame();   // the comp root: absolute frame, published to every engine node (§6a)
  const phase = cardPhase(abs);
  const baseDir = phase ? (phase.dir === 'out' ? 'entering' : 'exiting') : 'exiting';
  const baseP = phase ? (phase.dir === 'hold' ? 1 : phase.p) : 0;
  return (
    <AbsCtx.Provider value={abs}>
      <AbsoluteFill style={{ backgroundColor: 'black' }}>
        <SlidePres presentationProgress={baseP} presentationDirection={baseDir} passedProps={SLIDE.props}
          presentationDurationInFrames={TURN} onElementImage={noop} onUnmount={noop} bothEnteringAndExiting={false}>
          <AbsoluteFill style={{ backgroundColor: 'black' }}>
            <FaceLayer />
            <CoverTrack />
            <CoverEngines />
            <PunchLeaks />
            {FILM_BURNS.map((cf) => (
              <Sequence key={cf} from={cf - 11} durationInFrames={23}><FilmBurn /></Sequence>
            ))}
          </AbsoluteFill>
        </SlidePres>
        {phase && <CardScene phase={phase} />}
        <Captions />
      </AbsoluteFill>
    </AbsCtx.Provider>
  );
};

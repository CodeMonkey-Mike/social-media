// AIVsMLVertical.tsx: the VERTICAL (1080x1920) twin of AIVsML.tsx, "AI Engineer or ML Engineer? Pick Wrong and It Costs You"
// (longform-edited, AI Engineering Simplified), built 2026-11-11 by the comp-builder in VERTICAL mode per
// longform-edited/skills/vertical-repurpose/vertical-repurpose.md sections 1b + 2. A REFRAME, not a re-edit: the same spine,
// FPS, DUR, CARD_T / INSERTS / PAUSE / SPINE_SECS, the COVERS table byte-identical to the 16:9 (asserted below), the same
// transition ids at the same times, the same caption phrases + windows. What changes is only where things sit in the frame:
//   - the spine: the MEASURED face crop (assets/vertical/face-crop.json, objectPosition 62.2% center) refined by a dense
//     MEASURED face track (AIVsMLVerticalFaceTrack.ts, the same detector every 3rd frame) so the face stays centred while
//     Mike leans inside a window (F1 runs 68 -> 51 percent of the source width, F2 / F4 / F6 drift ~10 percent);
//   - every cover plays its NATIVE PORTRAIT asset from the lean public dir assets/vertical/ through the lookup tables
//     V_ASSET / V_EXTRA (a ref with no entry throws at module load, a mapped file missing from the public dir throws at
//     render); vertical-only substitutions from assets/vertical/NOTES.md: the wave wall plays kt-renders/wave-wall.mp4
//     (the 1080x1920 derivation) from its frame 0, never a cover-crop of the 16:9 clip; card slides keep their 16:9 names;
//   - the chart C3 is ChartC3V (AIVsMLVerticalCharts.tsx, C3.vertical.spec.md), C1 uses the portrait node rects
//     (C1-geometry.json), the end-screen arrows use portrait sprites + boxes (assets/vertical/kt/);
//   - the kinetic-text devices whose 16:9 build hard-codes 1920x1080 are their portrait builds (AIVsMLVerticalKit.tsx), the
//     same library numbers laid out for the portrait frame.
// NO music, NO SFX, NO watermark: the post-mix (mix_music.py) reuses the 16:9 mix verbatim (vertical-repurpose.md section 4).
// Every cue below is a SOURCE-spine second routed through sh() / F().
import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  Freeze,
  Img,
  OffthreadVideo,
  Sequence,
  continueRender,
  delayRender,
  getStaticFiles,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import { CL, KtClock, KtIconPop, KtKeywordPop, KtWhipCut, KtWhipVariant, KtWordByWord, useKtTime } from './effects/kinetic-text';
import { ENGINES, getTransition } from './transitions';
import { TransitionClip } from './transitions/TransitionClip';
import { CAPTION_WINDOWS, ZCAPTIONS } from './AIVsMLCaptions';
import {
  CARD_T as CARD_T_169,
  COVERS as COVERS_169,
  DUR as DUR_169,
  FPS as FPS_169,
  INSERTS as INSERTS_169,
} from './AIVsML';
import { ChartC3V } from './AIVsMLVerticalCharts';
import { FACE_TRACK } from './AIVsMLVerticalFaceTrack';
import { AI_YELLOW, AbsFrame, BadgeRow, BandText, CaptionPhrase, ML_GREEN, PanelItems, PanelText, RocketIcon, useAbsFrame, wobbleCss } from './AIVsMLKit';
import {
  BoxedWordsCardV,
  CaptionLineV,
  DownArrow,
  EndScreenArrowV,
  GRID_OPEN_V,
  GridZoomInV,
  HeadlinePopV,
  KeywordPopSparkV,
  PANEL_V,
  PUSH_V,
  PanelV,
  PushSlideV,
  SHAKE_DUR_V,
  ShakeCutV,
  SpinCutV,
  SubscribeBarV,
  VFULL,
  VH,
  VW,
  VerdictBandV,
  VersusStackV,
  panelShiftV,
} from './AIVsMLVerticalKit';

// =====================================================================================================================
// 1. TIMING: IDENTICAL to the 16:9 (spine/ALL.f.paused.json pauses[] = [], pause_s 1.5: sh(t) = t). Asserted against the
//    16:9 exports so the two cuts cannot drift.
// =====================================================================================================================
export const FPS = 30;
const PAUSE = 1.5; // sidecar pause_s (no card pause is baked: every chapter card is OFF)
export const CARD_T: number[] = []; // sidecar pauses[].at of the card rows: none
export const INSERTS: { at: number; dur: number }[] = []; // every sidecar pause row: none
const SPINE_SECS = 145.2; // the SOURCE spine spine/ALL.e.enhanced.mp4
const LAST_WORD = 145.0; // "Or even this one!" ends 145.00
const END_HOLD = 2.0; // PROJECT-LOG END HOLD (Mike): end screen + bed 2.0 s past the last word
const sh = (t: number) => t + INSERTS.filter((p) => p.at <= t).reduce((s, p) => s + p.dur, 0);
const unsh = (tp: number) => {
  let t = tp;
  for (const p of INSERTS) if (sh(p.at) + p.dur <= tp) t -= p.dur;
  return t;
};
const F = (t: number) => Math.round(sh(t) * FPS);
const SPINE_FRAMES = Math.ceil(sh(SPINE_SECS) * FPS); // 4356
export const DUR = Math.round((sh(LAST_WORD) + END_HOLD) * FPS); // 4410 = 147.00 s
if (CARD_T.length * PAUSE !== 0 || DUR < SPINE_FRAMES) throw new Error('AIVsMLVertical: time map out of step with the sidecar');
if (FPS !== FPS_169 || DUR !== DUR_169 || JSON.stringify(CARD_T) !== JSON.stringify(CARD_T_169) || JSON.stringify(INSERTS) !== JSON.stringify(INSERTS_169))
  throw new Error('AIVsMLVertical: FPS / DUR / CARD_T / INSERTS differ from the 16:9 AIVsML.tsx');
const at = (t: number) => F(t) / FPS;
const WHIP_LENS = false; // as the 16:9 (the lens made a whip frame take 104-184 s; flagged to Mike on the 16:9)
const WHIP_BLUR = true;
const EASE_OUT = Easing.out(Easing.cubic);
const EASE_INOUT = Easing.inOut(Easing.cubic);

// =====================================================================================================================
// 2. FACE: the MEASURED portrait crop. The 1920x1080 spine is scaled to cover the 1920 px height (x 1.7778) and shifted so
//    the face centre measured on the SOURCE spine lands on x = 540. face-crop.json (5 samples a window, mean 62.2 percent,
//    all windows fit one offset) is the base; FACE_TRACK (every 3rd frame, 5-tap median + 0.30 s Gaussian, steps only at the
//    desilencer join 134.767) is the same measurement, dense, so the crop follows Mike's lean inside a window.
//    NOTE: CSS objectPosition '62.2% center' would put that point at 62 percent ACROSS the portrait frame (CSS semantics),
//    not at the centre; the comp converts the measured percent into a centring translate instead.
//    No 16:9 FACE_REFRAME here: the vertical has its own measured crop (comp-build.md section 3a, last bullet).
// =====================================================================================================================
// FACE_REFRAME_WAIVED: the vertical twin uses the measured 9:16 face crop (assets/vertical/face-crop.json), not the 16:9 reframe (comp-build.md section 3a; vertical-repurpose.md section 1b)
export const FACE_CROP = { objectPositionPct: 62.2, spread: [50.73, 74.35] }; // assets/vertical/face-crop.json, verbatim
const SPINE_K = VH / 1080; // 1.7778
const SPINE_W = 1920 * SPINE_K; // 3413.3 px wide once it covers the portrait height
/** the measured face centre (percent of the source width) at source second t */
const facePct = (t: number) => {
  const seg = FACE_TRACK.find((s) => t >= s.a && t < s.b) ?? FACE_TRACK.reduce((p, s) => (Math.min(Math.abs(t - s.a), Math.abs(t - s.b)) < Math.min(Math.abs(t - p.a), Math.abs(t - p.b)) ? s : p));
  const kf = seg.kf;
  if (t <= kf[0][0]) return kf[0][1];
  if (t >= kf[kf.length - 1][0]) return kf[kf.length - 1][1];
  return interpolate(t, kf.map((k) => k[0]), kf.map((k) => k[1]));
};
/** the spine's x offset (px) that puts the face centre on x 540, clamped so the frame is always covered */
const spineX = (t: number) => Math.max(VW - SPINE_W, Math.min(0, VW / 2 - (facePct(t) / 100) * SPINE_W));
for (const s of FACE_TRACK) for (const [, p] of s.kf) if (Math.abs(p - FACE_CROP.objectPositionPct) > 15) throw new Error('AIVsMLVertical: face track far off the measured crop');

const FACE_POINT_V = { x: 540, y: 977 }; // the eye line after the crop: face-reframe.json measured.eye_y 549.4 x 1.7778
const FACE_WINDOWS: [number, number][] = [
  [0.0, 2.567], // F1 the signature open (opens ON face)
  [8.267, 12.367], // F2
  [33.333, 39.967], // F3
  [45.633, 58.1], // F4 (the boxed-words card 48.68-50.78 rides over it)
  [77.633, 82.4], // F5 the versus stack
  [123.7, 127.533], // F6
  [130.4, 139.533], // F7 subscribe + the one punch
];
/** cover -> face cut-ins: hand:kt-whip-cut (TRANSITION-PLAN face pick, 0.37 s, on the INCOMING face) */
const FACE_WHIPS = [8.267, 33.333, 45.633, 77.633, 123.7, 130.4];
const SHAKE_T = 50.78; // hand:kt-shake-cut back to the F4 face ON "host" (TRANSITION-PLAN 50.780)
/** [PUNCH-IN] F7 ON the desilencer join 134.767 (frame 4043): 2 frames, linear, 360-degree shutter, 20 percent about the face */
const PUNCH = { t: 134.767, s: 1.2, dur: 0.067, end: 139.533 };
/** F5 (versus stack): the deep framing, 130 percent with the picture 0.085 of the frame height lower (as the 16:9) */
const VERSUS_FRAME = { a: 77.633, b: 82.4, s: 1.3, dy: 0.085 * VH };
/** F4 out (58.100): the face HELD on its last frame for the paper card's 2-frame push (a real Freeze, muted, same transform).
 * F7 end (139.533): the spine's last F7 frame (comp frame 4185) reads BLACK in Remotion (a timestamp gap in the variable-rate
 * spine right at the blackout edge; the delivered 16:9 FINAL shows the same black frame), so the face before it is held for
 * that one frame (QA 2026-11-11, chunk 3900-4250). */
const SPINE_HOLDS = [
  { from: F(58.1), to: F(58.1) + 3, frame: F(58.1) - 1 },
  { from: F(139.533) - 1, to: F(139.533), frame: F(139.533) - 2 },
];

const tPunch = at(PUNCH.t);
const faceTransform = (t: number) => {
  if (t < FACE_WINDOWS[0][1]) {
    const s = interpolate(t, [0, FACE_WINDOWS[0][1]], [1, 1.05], CL); // the open's slow ~5 percent push
    return { origin: `${FACE_POINT_V.x}px ${FACE_POINT_V.y}px`, css: `scale(${s})` };
  }
  if (t >= VERSUS_FRAME.a && t < VERSUS_FRAME.b) return { origin: `${VW / 2}px ${VH / 2}px`, css: `translate(0px, ${VERSUS_FRAME.dy}px) scale(${VERSUS_FRAME.s})` };
  if (t >= tPunch - 0.02 && t < PUNCH.end) {
    const s = 1 + (PUNCH.s - 1) * interpolate(t, [tPunch, tPunch + PUNCH.dur], [0, 1], CL);
    return { origin: `${FACE_POINT_V.x}px ${FACE_POINT_V.y}px`, css: `scale(${s})` };
  }
  return { origin: '50% 50%', css: 'none' };
};

/** the spine through the portrait crop. x comes from the FRAME's own time (never a shutter sample time), so a shutter sample
 * never shows the frame through another moment's crop. sync 'local' = the enclosing Sequence's frame; 'abs' = the comp frame
 * from the absolute clock in ANY nesting (an engine's re-mounts). */
const SpineVideoV: React.FC<{ sync: 'local' | 'abs'; x: number }> = ({ sync, x }) => {
  const abs = useAbsFrame();
  const local = useCurrentFrame();
  const trim = sync === 'abs' ? Math.max(0, abs - local) : 0;
  return (
    <OffthreadVideo
      src={staticFile(V_EXTRA.spine)}
      muted
      trimBefore={trim}
      style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', transform: `translate(${x}px, 0px) scale(${SPINE_K})` }}
    />
  );
};
const FaceShot: React.FC<{ t: number; tFrame: number; sync: 'local' | 'abs' }> = ({ t, tFrame, sync }) => {
  const tf = faceTransform(t);
  return (
    <div style={{ ...VFULL, overflow: 'hidden', transformOrigin: tf.origin, transform: tf.css }}>
      <SpineVideoV sync={sync} x={spineX(tFrame)} />
    </div>
  );
};
/** the LIVE face: the punch step carries its 360-degree shutter (5 samples, an exact average of opaque layers) */
const FaceLive: React.FC<{ sync: 'local' | 'abs'; t?: number }> = ({ sync, t: tFixed }) => {
  const tNow = useKtTime();
  const t = tFixed ?? tNow;
  const blurOn = t >= tPunch - 1 / 60 && t < tPunch + PUNCH.dur + 1 / 60;
  if (!blurOn) return <FaceShot t={t} tFrame={t} sync={sync} />;
  const n = 5;
  const ts = Array.from({ length: n }, (_, i) => t + (i / (n - 1) - 0.5) / FPS);
  return (
    <div style={{ ...VFULL, isolation: 'isolate', background: 'black' }}>
      {ts.map((s, i) => (
        <div key={i} style={{ ...VFULL, opacity: 1 / (i + 1) }}>
          <FaceShot t={s} tFrame={t} sync={sync} />
        </div>
      ))}
    </div>
  );
};

const SpineLayer: React.FC = () => {
  const f = useAbsFrame();
  const t = unsh(f / FPS) + 0.001;
  const hold = SPINE_HOLDS.find((h) => f >= h.from && f < h.to);
  if (hold) {
    return (
      <Freeze frame={hold.frame}>
        <FaceLive sync="local" t={unsh(hold.frame / FPS)} />
      </Freeze>
    );
  }
  const inFace = FACE_WINDOWS.some(([a, b]) => f >= F(a) && f < F(b));
  if (!inFace) return null; // COVER beats are blacked in the spine and fully covered: no decode spent there
  if (t < GRID_OPEN_V.dur) return <GridZoomInV t={t} render={() => <FaceLive sync="local" />} />; // hand:kt-grid-zoom-in (0.000)
  const tShake = at(SHAKE_T);
  if (t >= tShake && t < tShake + SHAKE_DUR_V) return <ShakeCutV t0={tShake} render={() => <FaceLive sync="local" />} />; // hand:kt-shake-cut
  const whip = [...FACE_WHIPS].reverse().find((c) => t >= at(c));
  if (whip !== undefined && t < at(whip) + 0.4)
    return (
      // hand:kt-whip-cut face cut-in (8.267 / 33.333 / 45.633 / 77.633 / 123.700 / 130.400)
      <KtWhipCut t0={at(whip)} lens={WHIP_LENS} motionBlur={WHIP_BLUR} width={VW} height={VH}>
        <FaceLive sync="local" />
      </KtWhipCut>
    );
  return <FaceLive sync="local" />;
};

// =====================================================================================================================
// 3. COVERS: BYTE-IDENTICAL to AIVsML.tsx (asserted against the imported 16:9 table right below). `grp` = one card / diagram /
//    page; contiguous rows of one grp are STATE SWAPS. tr = the INGRESS transition id, wv = whip variant, pd = push from,
//    out = egress move, sp / spT = a side panel from spT, st = card state.
// =====================================================================================================================
type Kind = 'vid' | 'still' | 'deck' | 'container' | 'receipt' | 'chart' | 'ktclip';
type Cover = {
  tIn: number;
  tOut: number;
  kind: Kind;
  ref: string;
  tr?: string;
  wv?: KtWhipVariant;
  pd?: 'L' | 'R' | 'U'; // U = revealed UNDER the outgoing row's push-out
  out?: string;
  grp?: string;
  state?: string;
  sp?: 'L' | 'R';
  spT?: number;
  rock?: boolean;
  nw?: boolean;
  grade?: number;
};
// DIAGRAM_REFS: C1-s0-base, C1-s1-model, C1-s2-api, C1-s3-data, C1-s4-product, C1-s5-evals
// (end declared refs)
export const COVERS: Cover[] = [
  // ---- CH1 ----
  { tIn: 2.567, tOut: 5.25, kind: 'vid', ref: 'BR-1-two-engineers-side-by-side', tr: 'hand:kt-whip-cut' },
  { tIn: 5.25, tOut: 8.267, kind: 'still', ref: 'IMG-1-cash-stacks', tr: 'hand:kt-whip-cut' },
  { tIn: 12.367, tOut: 13.97, kind: 'container', ref: 'roles-split', tr: 'hand:kt-whip-cut', grp: 'roles-split', state: 'overview' },
  // ---- CH2 ----
  { tIn: 13.97, tOut: 17.33, kind: 'vid', ref: 'BR-2-app-ui-on-laptop', tr: 'hand:kt-push-slide', sp: 'R', spT: 14.06 },
  { tIn: 17.33, tOut: 18.22, kind: 'container', ref: 'ai-identity', tr: 'hand:kt-push-slide', grp: 'ai-identity', state: 'base' },
  { tIn: 18.22, tOut: 19.7, kind: 'container', ref: 'ai-identity-s1', grp: 'ai-identity', state: 's1' },
  { tIn: 19.7, tOut: 23.6, kind: 'vid', ref: 'BR-3-neural-network-model', tr: 'hand:kt-push-slide', sp: 'L', spT: 19.8 },
  { tIn: 23.6, tOut: 23.9, kind: 'container', ref: 'build-train-deploy', tr: 'hand:kt-push-slide', grp: 'build-train-deploy', state: 'eyebrow' },
  { tIn: 23.9, tOut: 24.7, kind: 'container', ref: 'build-train-deploy-s1', grp: 'build-train-deploy', state: 's1' },
  { tIn: 24.7, tOut: 25.5, kind: 'container', ref: 'build-train-deploy-s2', grp: 'build-train-deploy', state: 's2' },
  { tIn: 25.5, tOut: 26.24, kind: 'container', ref: 'build-train-deploy-s3', grp: 'build-train-deploy', state: 's3' },
  { tIn: 26.24, tOut: 28.18, kind: 'deck', ref: 'C1-s0-base', tr: 'lib:melt-equidistant-short-3', grp: 'C1', state: 's0' },
  { tIn: 28.18, tOut: 28.7, kind: 'deck', ref: 'C1-s1-model', grp: 'C1', state: 's1' },
  { tIn: 28.7, tOut: 29.64, kind: 'deck', ref: 'C1-s2-api', grp: 'C1', state: 's2' },
  { tIn: 29.64, tOut: 30.46, kind: 'deck', ref: 'C1-s3-data', grp: 'C1', state: 's3' },
  { tIn: 30.46, tOut: 31.4, kind: 'deck', ref: 'C1-s4-product', grp: 'C1', state: 's4' },
  { tIn: 31.4, tOut: 33.333, kind: 'deck', ref: 'C1-s5-evals', grp: 'C1', state: 's5' },
  { tIn: 39.967, tOut: 42.57, kind: 'still', ref: 'IMG-2-dev-vs-machine', tr: 'hand:kt-whip-cut' },
  { tIn: 42.57, tOut: 45.633, kind: 'vid', ref: 'BR-4-leaning-back-hands-behind-head', tr: 'hand:kt-push-slide', grade: 0.9 },
  { tIn: 58.1, tOut: 62.0, kind: 'container', ref: 'paper-sum-up', tr: 'hand:kt-push-slide', pd: 'R', grp: 'paper-sum-up', state: 'lines-1-2', rock: true },
  { tIn: 62.0, tOut: 62.78, kind: 'container', ref: 'paper-sum-up-s1', grp: 'paper-sum-up', state: 's1', rock: true },
  { tIn: 62.78, tOut: 63.5, kind: 'container', ref: 'paper-sum-up-s2', grp: 'paper-sum-up', state: 's2', rock: true },
  { tIn: 63.5, tOut: 64.39, kind: 'container', ref: 'paper-sum-up-s3', grp: 'paper-sum-up', state: 's3', rock: true, out: 'hand:kt-push-slide' },
  // ---- CH3 ----
  { tIn: 64.39, tOut: 67.86, kind: 'vid', ref: 'BR-5-chalk-math-equations', tr: 'hand:kt-push-slide', pd: 'U' },
  { tIn: 67.86, tOut: 70.2, kind: 'still', ref: 'IMG-3-grad-cap-textbooks', tr: 'hand:cut' },
  { tIn: 70.2, tOut: 73.05, kind: 'vid', ref: 'BR-6-developer-coding-over-shoulder', tr: 'hand:cut' },
  { tIn: 73.05, tOut: 75.37, kind: 'ktclip', ref: 'wave-wall', tr: 'hand:kt-spin-cut' },
  { tIn: 75.37, tOut: 77.633, kind: 'vid', ref: 'BR-7-team-celebrating-launch', tr: 'hand:kt-whip-cut', wv: 'blur-in' },
  { tIn: 82.4, tOut: 86.78, kind: 'receipt', ref: 'C12-headline', tr: 'hand:kt-whip-cut', grp: 'C12' },
  { tIn: 86.78, tOut: 88.6, kind: 'receipt', ref: 'C12-entry', tr: 'hand:cut', grp: 'C12' },
  { tIn: 88.6, tOut: 92.02, kind: 'vid', ref: 'BR-8-code-scrolling-dark-screen', tr: 'hand:kt-push-slide', sp: 'R', spT: 88.7 },
  { tIn: 92.02, tOut: 92.76, kind: 'container', ref: 'math-not-code', tr: 'hand:kt-push-slide', grp: 'math-not-code', state: 'rest' },
  { tIn: 92.76, tOut: 93.58, kind: 'container', ref: 'math-not-code-s1', grp: 'math-not-code', state: 's1' },
  { tIn: 93.58, tOut: 94.58, kind: 'container', ref: 'math-not-code-s2', grp: 'math-not-code', state: 's2' },
  { tIn: 94.58, tOut: 96.06, kind: 'receipt', ref: 'C9-stripe-radar-header', tr: 'hand:kt-push-slide', grp: 'C9' },
  { tIn: 96.06, tOut: 98.05, kind: 'receipt', ref: 'C9-stripe-radar-requirements', tr: 'hand:cut', grp: 'C9' },
  { tIn: 98.05, tOut: 101.7, kind: 'receipt', ref: 'C6-levelsfyi-ai-engineer-us', tr: 'hand:cut' },
  { tIn: 101.7, tOut: 117.18, kind: 'chart', ref: 'C3', tr: 'lib:spin-center-ease-short-cw' },
  { tIn: 117.18, tOut: 119.75, kind: 'still', ref: 'IMG-4-three-chairs', tr: 'hand:fade' },
  { tIn: 119.75, tOut: 123.7, kind: 'vid', ref: 'BR-9-research-scientists-lab', tr: 'hand:kt-whip-cut' },
  // ---- CH4 ----
  { tIn: 127.533, tOut: 130.4, kind: 'vid', ref: 'BR-10-door-opening-light', tr: 'hand:kt-whip-cut' },
  { tIn: 139.533, tOut: 140.86, kind: 'container', ref: 'end-screen', tr: 'hand:kt-whip-cut', grp: 'end-screen', state: 'slots', nw: true },
  { tIn: 140.86, tOut: 142.32, kind: 'container', ref: 'end-screen-s1', grp: 'end-screen', state: 's1', nw: true },
  { tIn: 142.32, tOut: 143.14, kind: 'container', ref: 'end-screen-s2', grp: 'end-screen', state: 's2', nw: true },
  { tIn: 143.14, tOut: 144.44, kind: 'container', ref: 'end-screen-s3', grp: 'end-screen', state: 's3', nw: true },
  { tIn: 144.44, tOut: 147.0, kind: 'container', ref: 'end-screen-s4', grp: 'end-screen', state: 's4', nw: true },
];
if (JSON.stringify(COVERS) !== JSON.stringify(COVERS_169)) throw new Error('AIVsMLVertical: COVERS differ from the 16:9 AIVsML.tsx (the two cuts must diff clean)');

// ---- the 16:9-ref -> VERTICAL asset lookup (staticFile paths inside the lean public dir assets/vertical/) -------------
const V_ASSET: Record<string, string> = {
  // vid: native portrait b-roll (envato-sourcer, vertical brief), 1080x1920
  'BR-1-two-engineers-side-by-side': 'vid/BR-1-two-engineers-side-by-side.mp4',
  'BR-2-app-ui-on-laptop': 'vid/BR-2-app-ui-on-laptop.mp4',
  'BR-3-neural-network-model': 'vid/BR-3-neural-network-model.mp4',
  'BR-4-leaning-back-hands-behind-head': 'vid/BR-4-leaning-back-hands-behind-head.mp4',
  'BR-5-chalk-math-equations': 'vid/BR-5-chalk-math-equations.mp4',
  'BR-6-developer-coding-over-shoulder': 'vid/BR-6-developer-coding-over-shoulder.mp4',
  'BR-7-team-celebrating-launch': 'vid/BR-7-team-celebrating-launch.mp4',
  'BR-8-code-scrolling-dark-screen': 'vid/BR-8-code-scrolling-dark-screen.mp4',
  'BR-9-research-scientists-lab': 'vid/BR-9-research-scientists-lab.mp4',
  'BR-10-door-opening-light': 'vid/BR-10-door-opening-light.mp4',
  // still: true 9:16 recompositions (image-gen, vertical brief)
  'IMG-1-cash-stacks': 'img/IMG-1-cash-stacks.png',
  'IMG-2-dev-vs-machine': 'img/IMG-2-dev-vs-machine.png',
  'IMG-3-grad-cap-textbooks': 'img/IMG-3-grad-cap-textbooks.png',
  'IMG-4-three-chairs': 'img/IMG-4-three-chairs.png',
  // container: the card slides re-shot at 1080x1920 (same names + states, NOTES.md)
  'roles-split': 'card-slides/roles-split.png',
  'ai-identity': 'card-slides/ai-identity.png',
  'ai-identity-s1': 'card-slides/ai-identity-s1.png',
  'build-train-deploy': 'card-slides/build-train-deploy.png',
  'build-train-deploy-s1': 'card-slides/build-train-deploy-s1.png',
  'build-train-deploy-s2': 'card-slides/build-train-deploy-s2.png',
  'build-train-deploy-s3': 'card-slides/build-train-deploy-s3.png',
  'paper-sum-up': 'card-slides/paper-sum-up.png',
  'paper-sum-up-s1': 'card-slides/paper-sum-up-s1.png',
  'paper-sum-up-s2': 'card-slides/paper-sum-up-s2.png',
  'paper-sum-up-s3': 'card-slides/paper-sum-up-s3.png',
  'math-not-code': 'card-slides/math-not-code.png',
  'math-not-code-s1': 'card-slides/math-not-code-s1.png',
  'math-not-code-s2': 'card-slides/math-not-code-s2.png',
  'end-screen': 'card-slides/end-screen.png',
  'end-screen-s1': 'card-slides/end-screen-s1.png',
  'end-screen-s2': 'card-slides/end-screen-s2.png',
  'end-screen-s3': 'card-slides/end-screen-s3.png',
  'end-screen-s4': 'card-slides/end-screen-s4.png',
  // deck: C1 system-design states re-shot tall (two columns)
  'C1-s0-base': 'diagrams/C1-s0-base.png',
  'C1-s1-model': 'diagrams/C1-s1-model.png',
  'C1-s2-api': 'diagrams/C1-s2-api.png',
  'C1-s3-data': 'diagrams/C1-s3-data.png',
  'C1-s4-product': 'diagrams/C1-s4-product.png',
  'C1-s5-evals': 'diagrams/C1-s5-evals.png',
  // receipt: MOBILE-VIEW captures (receipt-capturer, vertical brief), 1080x1920
  'C12-headline': 'receipts/C12-headline.png',
  'C12-entry': 'receipts/C12-entry.png',
  'C9-stripe-radar-header': 'receipts/C9-stripe-radar-header.png',
  'C9-stripe-radar-requirements': 'receipts/C9-stripe-radar-requirements.png',
  'C6-levelsfyi-ai-engineer-us': 'receipts/C6-levelsfyi-ai-engineer-us.png',
  // ktclip: NOTES.md substitution, the 1080x1920 derivation, played from its frame 0 (never a cover-crop of the 16:9 clip)
  'wave-wall': 'kt-renders/wave-wall.mp4',
};
/** the chart refs: a LIVE portrait component, never a PNG (charts.md) */
const CHART_V: Record<string, React.FC> = { C3: ChartC3V };
/** every other file the vertical comp reads (transitions, kinetic-text plates, the end-screen arrow sprites, the spine) */
const V_EXTRA = {
  spine: 'spine.mp4',
  texture: 'kt/animated-texture.mp4',
  subFill: 'kt/subscribe-bar-fill.mp4',
  subKey: 'kt/subscribe-bar-key.mp4',
  arrows: [1, 2, 3, 4].map((n) => `kt/end-screen-arrow-s${n}.png`),
  spinOut: [83, 84, 85].map((n) => `transitions/cutframes/BR-6-f${n}.jpg`), // the vertical BR-6 clip's frames 83-85 (frame-for-frame playback)
  spinIn: [0, 1, 2, 3, 4, 5].map((n) => `transitions/cutframes/wave-wall-f${n}.jpg`), // the vertical wave wall's frames 0-5
};
for (const c of COVERS) {
  if (c.kind === 'chart' ? !CHART_V[c.ref] : !V_ASSET[c.ref]) throw new Error(`AIVsMLVertical: no VERTICAL asset mapped for 16:9 ref ${c.ref}`);
}
const vsrc = (ref: string) => {
  const p = V_ASSET[ref];
  if (!p) throw new Error(`AIVsMLVertical: no VERTICAL asset mapped for 16:9 ref ${ref}`);
  return p;
};
const ALL_FILES = [...Object.values(V_ASSET), V_EXTRA.spine, V_EXTRA.texture, V_EXTRA.subFill, V_EXTRA.subKey, ...V_EXTRA.arrows, ...V_EXTRA.spinOut, ...V_EXTRA.spinIn];
/** a mapped file missing from the public dir throws at render (getStaticFiles() lists the bundle's public dir in the browser;
 * it is empty on the server, where nothing is checked). Checked inside the comp, never at module scope: Root.tsx bundles
 * every project's comp, and another project's render must not fail on this one's assets. */
const useAssertVerticalAssets = () => {
  React.useMemo(() => {
    const listed = getStaticFiles().map((f) => f.name.replace(/\\/g, '/'));
    if (!listed.length) return;
    const have = new Set(listed);
    const missing = ALL_FILES.filter((p) => !have.has(p));
    if (missing.length) throw new Error(`AIVsMLVertical: ${missing.length} vertical asset(s) missing from the public dir: ${missing.join(', ')}`);
  }, []);
};

/** 24 / 25 fps clips play frame-for-frame (comp-build section 11): playbackRate = 30 / clip fps (the VERTICAL clips, probed) */
const VID_FPS: Record<string, number> = {
  'BR-1-two-engineers-side-by-side': 24 / 1,
  'BR-2-app-ui-on-laptop': 24000 / 1001,
  'BR-3-neural-network-model': 24000 / 1001,
  'BR-4-leaning-back-hands-behind-head': 25 / 1,
  'BR-5-chalk-math-equations': 25 / 1,
  'BR-6-developer-coding-over-shoulder': 24000 / 1001,
  'BR-7-team-celebrating-launch': 24 / 1,
  'BR-8-code-scrolling-dark-screen': 30 / 1,
  'BR-9-research-scientists-lab': 30000 / 1001,
  'BR-10-door-opening-light': 30 / 1,
};

const contig = (a: Cover, b: Cover) => Math.abs(F(a.tOut) - F(b.tIn)) <= 0;
const isSwap = (i: number) => i > 0 && !!COVERS[i].grp && COVERS[i - 1].grp === COVERS[i].grp && contig(COVERS[i - 1], COVERS[i]);
const grpStart = (i: number) => {
  let k = i;
  while (isSwap(k)) k--;
  return COVERS[k].tIn;
};
const FADE_IN = 0.33; // hand:fade (glitch-still, 0.33 s) C3 -> IMG-4, the ONE soft move
/** frames the OUTGOING row stays under the next one (push-in over it, the 0.33 s fade, or its own push-out) */
const tailFrames = (i: number) => {
  const c = COVERS[i];
  const n = COVERS[i + 1];
  if (c.out === 'hand:kt-push-slide') return Math.ceil(PUSH_V.outLeft.dur * FPS) + 1;
  if (!n || !contig(c, n) || isSwap(i + 1)) return 0;
  if (n.tr === 'hand:kt-push-slide' && n.pd !== 'U') return Math.ceil((n.pd === 'R' ? PUSH_V.inRight.dur : PUSH_V.inLeft.dur) * FPS) + 1;
  if (n.tr === 'hand:fade') return Math.round(FADE_IN * FPS);
  return 0;
};

// ---- receipts: crop boxes in CAPTURE px [x, y, w] of the 1080x1920 mobile captures (h = w * 16 / 9), the settle push, the
//      [HIGHLIGHT] in capture coords (re-measured on the portrait captures)
type RView = { W: number; H: number; a: [number, number, number]; b?: [number, number, number]; push?: number; ease?: 'out' | 'inout'; hl?: { x: number; y: number; w: number; h: number; t: number } };
const RECEIPTS: Record<string, RView> = {
  // the article page under lib:motion-3d-pan-1-right, aimed at the move's END pose (net content offset -346 -> +65 px, depth
  // zoom 1.48 -> 1.29): at 82 percent on the white page, biased left, so the whole title + the Published date land inside
  // x 88-862 / above the band (y 1290) when the pan settles; the start of the sweep crops the left, as the 16:9 move does
  'C12-headline': { W: 1080, H: 1920, a: [-49, 0, 1314] },
  // the number 1 entry: a 2.9 percent settling push, then the highlighter wipe on 'AI engineers' ON "AI" (87.54)
  'C12-entry': { W: 1080, H: 1920, a: [0, 0, 1080], b: [15, 27, 1050], push: 0.7, hl: { x: 250, y: 298, w: 236, h: 58, t: 87.54 } },
  // Stripe 'Machine Learning Engineer, Radar': a short settling push on the title (1.48 s flash)
  'C9-stripe-radar-header': { W: 1080, H: 1920, a: [0, 0, 1080], b: [30, 50, 1020], push: 1.48 },
  // the Minimum requirements: settling push that stops, then the wipe across 'in a production environment.' ON "shipping"
  'C9-stripe-radar-requirements': { W: 1080, H: 1920, a: [0, 0, 1080], b: [20, 0, 1040], push: 0.75, hl: { x: 272, y: 274, w: 552, h: 46, t: 96.82 } },
  // Levels.fyi AI Engineer, United States: plain push toward the title + median panel
  'C6-levelsfyi-ai-engineer-us': { W: 1080, H: 1920, a: [0, 0, 1080], b: [60, 200, 960], push: 3.65, ease: 'inout' },
};
const HL_WIPE = 0.35;
const ReceiptView: React.FC<{ id: string; tIn: number }> = ({ id, tIn }) => {
  const t = useKtTime();
  const r = RECEIPTS[id];
  const u = r.b && r.push ? interpolate(t - tIn, [0, r.push], [0, 1], { ...CL, easing: r.ease === 'inout' ? EASE_INOUT : EASE_OUT }) : 0;
  const box = r.b ? r.a.map((v, i) => v + (r.b![i] - v) * u) : r.a;
  const k = VW / box[2];
  const hlw = r.hl && r.hl.w > 0 ? interpolate(t - r.hl.t, [0, HL_WIPE], [0, 1], { ...CL, easing: EASE_OUT }) : 0;
  return (
    <div style={{ ...VFULL, overflow: 'hidden', background: '#FFFFFF' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: r.W, height: r.H, transformOrigin: '0 0', transform: `scale(${k}) translate(${-box[0]}px, ${-box[1]}px)` }}>
        <Img src={staticFile(vsrc(id))} style={{ position: 'absolute', left: 0, top: 0, width: r.W, height: r.H }} />
        {r.hl && hlw > 0 && (
          // [HIGHLIGHT] a #ffe14d rect wiping left to right over the quoted words, capture coords, multiply (text stays black)
          <div style={{ position: 'absolute', left: r.hl.x, top: r.hl.y, width: r.hl.w * hlw, height: r.hl.h, background: '#ffe14d', mixBlendMode: 'multiply' }} />
        )}
      </div>
    </div>
  );
};

// ---- C1 (Type 2 system-design states): 4-frame cross-fade + the newly lit node 1.00 -> 1.03 -> 1.00 over 8 frames; the
//      PORTRAIT node rects (assets/vertical/diagrams/C1-geometry.json nodes.ai)
const C1_NODES = [
  { x: 96, y: 548, w: 408, h: 148 },
  { x: 96, y: 758, w: 408, h: 148 },
  { x: 96, y: 968, w: 408, h: 148 },
  { x: 96, y: 1178, w: 408, h: 148 },
  { x: 96, y: 1388, w: 408, h: 148 },
];
const C1_NODE_OF: Record<string, number> = { 'C1-s1-model': 0, 'C1-s2-api': 1, 'C1-s3-data': 2, 'C1-s4-product': 3, 'C1-s5-evals': 4 };

const CardView: React.FC<{ i: number }> = ({ i }) => {
  const t = useKtTime();
  const c = COVERS[i];
  const src = staticFile(vsrc(c.ref));
  const prev = isSwap(i) ? COVERS[i - 1] : null;
  const dt = t - at(c.tIn);
  const xf = c.grp === 'C1' && prev ? interpolate(dt, [0, 4 / FPS], [0, 1], CL) : 1;
  const node = C1_NODE_OF[c.ref];
  const spot = node !== undefined ? interpolate(dt, [0, 4 / FPS, 8 / FPS], [1, 1.03, 1], CL) : 1;
  const nb = node !== undefined ? C1_NODES[node] : null;
  const arrowN = c.grp === 'end-screen' && c.ref !== 'end-screen' ? Number(c.ref.slice(-1)) : 0;
  const body = (
    <>
      {prev && xf < 1 && <Img src={staticFile(vsrc(prev.ref))} style={{ ...VFULL }} />}
      <Img src={src} style={{ ...VFULL, opacity: xf }} />
      {nb && spot !== 1 && (
        <div style={{ position: 'absolute', left: nb.x, top: nb.y, width: nb.w, height: nb.h, overflow: 'hidden', transformOrigin: '50% 50%', transform: `scale(${spot})` }}>
          <Img src={src} style={{ position: 'absolute', left: -nb.x, top: -nb.y, width: VW, height: VH }} />
        </div>
      )}
      {arrowN > 0 && <EndScreenArrowV n={arrowN} t0={at(c.tIn)} base={vsrc('end-screen')} sprite={V_EXTRA.arrows[arrowN - 1]} />}
    </>
  );
  if (c.nw) return <div style={{ ...VFULL, overflow: 'hidden' }}>{body}</div>; // the end screen sits still
  return (
    <div style={{ ...VFULL, overflow: 'hidden', background: '#0a0c10' }}>
      {/* kt-camera-wobble: 105 percent + the 8.6 s drift path, from the card's first frame (state swaps keep the phase) */}
      <div style={{ ...VFULL, transformOrigin: '50% 50%', transform: wobbleCss(t - at(grpStart(i)), !!c.rock) }}>{body}</div>
    </div>
  );
};

/** portrait-only legibility shade under a headline that the 9:16 recomposition puts over a bright subject (IMG-1: the stack
 * rises into the top band the 16:9 headline used), fixed to the frame, not riding the wobble */
const V_SHADE: Record<string, string> = {
  'IMG-1-cash-stacks': 'linear-gradient(180deg, rgba(4,10,22,0.78) 0%, rgba(4,10,22,0.62) 22%, rgba(4,10,22,0.0) 38%)',
};
const StillView: React.FC<{ c: Cover }> = ({ c }) => {
  const t = useKtTime();
  const dt = t - at(c.tIn);
  const push = interpolate(dt, [0, c.tOut - c.tIn], [1, 1.06], CL); // slow push over the slot
  return (
    <div style={{ ...VFULL, overflow: 'hidden', background: 'black' }}>
      <Img src={staticFile(vsrc(c.ref))} style={{ ...VFULL, objectFit: 'cover', transformOrigin: '50% 50%', transform: wobbleCss(dt, false, push) }} />
      {V_SHADE[c.ref] && <div style={{ ...VFULL, background: V_SHADE[c.ref] }} />}
    </div>
  );
};

/** per-ref brightness under a white headline in portrait (the 16:9's BR-4 grade carries over) */
const V_GRADE: Record<string, number> = { 'BR-9-research-scientists-lab': 0.72 };
const VidView: React.FC<{ c: Cover }> = ({ c }) => {
  const t = useKtTime();
  const shift = c.sp && c.spT !== undefined ? panelShiftV(t, c.spT) : { y: 0, scale: 1 };
  const grade = V_GRADE[c.ref] ?? c.grade;
  return (
    <div style={{ ...VFULL, overflow: 'hidden', background: 'black' }}>
      <OffthreadVideo
        src={staticFile(vsrc(c.ref))}
        muted
        playbackRate={FPS / (VID_FPS[c.ref] ?? FPS)}
        style={{ ...VFULL, objectFit: 'cover', transformOrigin: '50% 50%', transform: `translateY(${shift.y}px) scale(${shift.scale})`, filter: grade ? `brightness(${grade})` : undefined }}
      />
    </div>
  );
};

/** kt-wave-wall (NOTES.md): the 1080x1920 derivation, full frame, from its frame 0; the library's blur-out at +1.902 s */
const WaveWall: React.FC<{ c: Cover }> = ({ c }) => {
  const t = useKtTime();
  const blur = interpolate(t - at(c.tIn), [1.902, 1.902 + 2 / FPS], [0, 3.2], CL);
  return (
    <div style={{ ...VFULL, overflow: 'hidden', background: 'black' }}>
      <OffthreadVideo src={staticFile(vsrc(c.ref))} muted style={{ ...VFULL, filter: blur > 0.05 ? `blur(${blur}px)` : undefined }} />
    </div>
  );
};

/** C12-headline: lib:motion-3d-pan-1-right (Motion3D) over the receipt for its whole 4.38 s slot, the 5 s move fitted to the
 * slot (the engine's clock set by a <Freeze>, inside a zero-offset Sequence); the engine reads the comp size */
const MOTION_ID = 'motion-3d-pan-1-right';
const MotionReceipt: React.FC<{ c: Cover }> = ({ c }) => {
  const t = useKtTime();
  const row = getTransition(MOTION_ID);
  if (!row) throw new Error(`transition row missing: ${MOTION_ID}`);
  const Engine = ENGINES[row.engine];
  const engF = Math.max(0, Math.min(149, Math.round(((t - at(c.tIn)) * 5) / (c.tOut - c.tIn) * FPS)));
  return (
    <Sequence from={0} layout="none">
      <Freeze frame={engF}>
        <Engine from={null} to={null} durationInFrames={150} params={row.params} outClip={() => <ReceiptView id={c.ref} tIn={c.tIn} />} />
      </Freeze>
    </Sequence>
  );
};

/** C3 + its kt-word-by-word (C3.vertical.spec.md: phrases centred (540, 1595), the payoff TRAIN at (540, 1225) ~180 px on
 * screen). KtWordByWord centres on x 960 (its 16:9 frame): the layer is shifted 420 px left so its x lands on 540. */
const C3Cover: React.FC<{ c: Cover }> = ({ c }) => {
  const Chart = CHART_V[c.ref];
  return (
    <AbsoluteFill>
      <Chart />
      <div style={{ position: 'absolute', left: VW / 2 - 960, top: 0, width: 1920, height: VH }}>
        <KtWordByWord
          t0={114.54}
          t1={c.tOut + 0.5}
          phrases={[
            { t: 114.54, text: 'AND IT GOES TO' },
            { t: 115.3, text: 'THE PEOPLE WHO' },
          ]}
          payoff={{ t: 116.06, text: 'TRAIN' }}
          payoffColor="#00e68a"
          phraseY={1595}
          phraseFontSize={84}
          payoffY={1225}
          payoffFontSize={164}
        />
      </div>
    </AbsoluteFill>
  );
};

const CoverEl: React.FC<{ i: number }> = ({ i }) => {
  const c = COVERS[i];
  if (c.kind === 'chart') {
    if (c.ref === 'C3') return <C3Cover c={c} />; // the REAL animated chart (charts.md: never a PNG with a wipe)
    throw new Error(`no animated component for chart ${c.ref}`);
  }
  if (c.kind === 'vid') return <VidView c={c} />;
  if (c.kind === 'still') return <StillView c={c} />;
  if (c.kind === 'ktclip') return <WaveWall c={c} />;
  if (c.kind === 'receipt') return c.ref === 'C12-headline' ? <MotionReceipt c={c} /> : <ReceiptView id={c.ref} tIn={c.tIn} />;
  return <CardView i={i} />;
};

const CoverRow: React.FC<{ i: number }> = ({ i }) => {
  const c = COVERS[i];
  const t = useKtTime();
  const tCut = at(c.tIn);
  let node: React.ReactNode = <CoverEl i={i} />;
  if (!isSwap(i)) {
    if (c.tr === 'hand:kt-whip-cut') node = <KtWhipCut t0={tCut} variant={c.wv ?? 'default'} lens={WHIP_LENS} motionBlur={WHIP_BLUR} width={VW} height={VH}>{node}</KtWhipCut>;
    else if (c.tr === 'hand:kt-push-slide' && c.pd !== 'U') node = <PushSlideV t0={tCut} {...(c.pd === 'R' ? PUSH_V.inRight : PUSH_V.inLeft)}>{node}</PushSlideV>;
    else if (c.tr === 'hand:fade') node = <div style={{ ...VFULL, opacity: interpolate(t - tCut, [0, FADE_IN], [0, 1], CL) }}>{node}</div>;
    // hand:cut / a push with pd 'U' (revealed by the paper's push-out) = a plain cut here; the lib:* moves and
    // hand:kt-spin-cut are separate full-frame layers over the track (section 4 below)
  }
  if (c.out === 'hand:kt-push-slide') node = <PushSlideV t0={at(c.tOut)} {...PUSH_V.outLeft}>{node}</PushSlideV>;
  return <>{node}</>;
};

const CoverTrack: React.FC = () => (
  <>
    {COVERS.map((c, i) => {
      const from = F(c.tIn);
      const dur = F(c.tOut) - from + tailFrames(i);
      return (
        <Sequence key={i} from={from} durationInFrames={dur} name={`cover ${c.ref}`} style={c.out ? { zIndex: 2 } : undefined}>
          <CoverRow i={i} />
        </Sequence>
      );
    })}
  </>
);

// =====================================================================================================================
// 4. LIBRARY + THEME TRANSITIONS OVER THE TRACK (the same ids and windows as the 16:9; the engines read the comp size)
// =====================================================================================================================
const libWindow = (id: string, cut: number) => {
  const row = getTransition(id);
  if (!row) throw new Error(`transition row missing: ${id}`);
  const win = Math.round(row.durationSeconds * FPS);
  const half = Math.round(win / 2);
  return { win, half, from: F(cut) - half };
};
const iOf = (ref: string) => COVERS.findIndex((c) => c.ref === ref);

// lib:melt-equidistant-short-3 (MELT-transform, 0.44 s) build-train-deploy -> C1, 26.24: the two PORTRAIT states as stills,
// the engine output riding the same kt-camera-wobble as the live scene it shows
const MELT = { id: 'melt-equidistant-short-3', cut: 26.24, out: 'build-train-deploy-s3', in: 'C1-s0-base' };
const MeltWrap: React.FC<{ children: React.ReactNode; win: number; from: number; cutFrac: number }> = ({ children, win, from, cutFrac }) => {
  const f = useAbsFrame();
  const t = f / FPS;
  const swapped = (f - from) / Math.max(1, win - 1) >= cutFrac;
  const gi = swapped ? iOf(MELT.in) : iOf(MELT.out);
  return (
    <div style={{ ...VFULL, overflow: 'hidden', background: '#0a0c10' }}>
      <div style={{ ...VFULL, transformOrigin: '50% 50%', transform: wobbleCss(t - at(grpStart(gi))) }}>{children}</div>
    </div>
  );
};
/** comp-side guard for the MeltEquidistant CANVAS engine (shared infra, untouched): the engine takes its delayRender inside a
 * useEffect, which can fire after Remotion has already captured the frame, so a tab's first frame on each still (outgoing,
 * then incoming) screenshots a blank canvas (QA 2026-11-11: frames 780-782 + 784 black in the first chunk render; the
 * delivered 16:9 FINAL carries 781-782). This takes a handle synchronously DURING render and releases it in its own effect,
 * which React runs after the engine's (child) effect: when the engine has to load, its handle is registered before ours
 * clears, and the frame waits for the painted canvas. */
const RenderGuard: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => {
  const f = useCurrentFrame();
  const handle = React.useMemo(() => delayRender(`${label} guard f${f}`), [label, f]);
  React.useEffect(() => {
    continueRender(handle);
  }, [handle]);
  return <>{children}</>;
};
const MeltLayer: React.FC = () => {
  const w = libWindow(MELT.id, MELT.cut);
  const cutFrac = (getTransition(MELT.id)!.params as { cut: number }).cut;
  return (
    <Sequence from={w.from} durationInFrames={w.win} name="lib:melt-equidistant-short-3">
      <MeltWrap win={w.win} from={w.from} cutFrac={cutFrac}>
        <RenderGuard label="melt-equidistant-short-3">
        <TransitionClip
          id="melt-equidistant-short-3"
          cutFrame={w.half}
          sfx={false}
          fromSrc={vsrc(MELT.out)}
          toSrc={vsrc(MELT.in)}
          outgoing={() => <Img src={staticFile(vsrc(MELT.out))} style={{ ...VFULL }} />}
          incoming={() => <Img src={staticFile(vsrc(MELT.in))} style={{ ...VFULL }} />}
        />
        </RenderGuard>
      </MeltWrap>
    </Sequence>
  );
};

// lib:spin-center-ease-short-cw (SPIN-newfacet, 0.44 s) C6 receipt -> C3 chart, 101.70; both nodes read the absolute clock
const SPIN_LIB = { id: 'spin-center-ease-short-cw', cut: 101.7 };
const SpinLibLayer: React.FC = () => {
  const w = libWindow(SPIN_LIB.id, SPIN_LIB.cut);
  return (
    <Sequence from={w.from} durationInFrames={w.win} name="lib:spin-center-ease-short-cw">
      <TransitionClip
        id="spin-center-ease-short-cw"
        cutFrame={w.half}
        sfx={false}
        outgoing={() => <CoverEl i={iOf('C6-levelsfyi-ai-engineer-us')} />}
        incoming={() => <CoverEl i={iOf('C3')} />}
      />
    </Sequence>
  );
};

// hand:kt-spin-cut (container-xfade) BR-6 -> the wave wall, 73.05: keyed -0.100 / +0.033 / +0.167 s around the cut, the
// sources = the CUT FRAME stills of the live PORTRAIT frames (assets/vertical/transitions/cutframes/)
const SPIN_CUT_T = 73.05;
const SpinCutLayer: React.FC = () => {
  const cf = F(SPIN_CUT_T);
  return (
    <Sequence from={cf - 3} durationInFrames={9} name="hand:kt-spin-cut">
      <SpinCutV cut={at(SPIN_CUT_T)} cutFrame={cf} outStills={V_EXTRA.spinOut} inStills={V_EXTRA.spinIn} />
    </Sequence>
  );
};

// [PUNCH-IN] + [LIGHTLEAK] lib:lightleaks-6 (punch-leak, 1.12 s): its flash peaks ON the join frame 4043, screen blend, real
// leak plates (cover-fitted to the portrait frame by the engine), UNDER the captions; the scene it washes is the live punched
// face (absolute clock, muted, the same crop + punch transform, the same source)
const LEAK = { id: 'lightleaks-6', join: PUNCH.t, peak: 0.32 };
const LeakLayer: React.FC = () => {
  const row = getTransition(LEAK.id);
  if (!row) throw new Error('lightleaks-6 missing');
  const win = Math.round(row.durationSeconds * FPS);
  const from = F(LEAK.join) - Math.round(LEAK.peak * FPS);
  return (
    <Sequence from={from} durationInFrames={win} name="lib:lightleaks-6">
      <TransitionClip id="lightleaks-6" cutFrame={Math.round(win / 2)} sfx={false} outgoing={() => <FaceLive sync="abs" />} incoming={() => <FaceLive sync="abs" />} />
    </Sequence>
  );
};

// =====================================================================================================================
// 5. KINETIC TEXT (the EDIT-PLAN [KT-*] rows at their 16:9 times; above the cover layer, below the captions), laid out for
//    the portrait frame. Their [WHOOSH] / [ACCENT] sounds are NOT here: mix_music.py places them from the event log.
// =====================================================================================================================
const TEX = () => staticFile(V_EXTRA.texture);
const B_ROW1 = { label: 'TRAIN MODELS', verdict: 'ML ENGINEER', verdictColor: ML_GREEN };
const B_ROW2 = { label: 'SHIP PRODUCTS', verdict: 'AI ENGINEER', verdictColor: AI_YELLOW };
const LabelDown: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
    <BandText lines={[text]} caps={40} />
    <DownArrow w={50} />
  </div>
);

const KineticText: React.FC = () => (
  <>
    {/* CH1 signature open: label A ON the grid landing (0.483), label B ON "ML" (1.60), stacked in the lower third, to 2.567 */}
    <KtKeywordPop t0={0.483} t1={2.567} lines={['AI ENGINEER']} accent={AI_YELLOW} x={540} y={1400} fontSize={100} />
    <KtKeywordPop t0={1.6} t1={2.567} lines={['ML ENGINEER']} accent={ML_GREEN} x={540} y={1560} fontSize={100} />
    {/* [KT-HEADLINE] over IMG-1, ON "huge" (7.68), with its role-free framing line (GATE plan ruling) */}
    <HeadlinePopV t0={7.68} t1={8.267} lines={['AT THE TOP:', 'A *$340K* GAP']} y={330} fontSize={100} pitch={102} framing={['TOP 10% VS TYPICAL · LEVELS.FYI', 'US · TOTAL COMP · 2026']} />
    {/* [KT-PANEL] RIGHT dark panel over BR-2 ON 14.06 (portrait: the bottom panel slides in from the right) */}
    <PanelV t0={14.06} t1={17.33} side="R" lines={['*AI ENGINEER*', 'SHIPS PRODUCTS']} accent={AI_YELLOW} textureSrc={TEX()} />
    {/* [KT-ICON] rocket ON "shipping" (16.46), from the LEFT edge, 0.50 s, in the free band above the panel */}
    <KtIconPop t0={16.46} t1={17.33} preset="rocket-left" x={250} y={860} icon={<RocketIcon />} />
    {/* [KT-PANEL] LEFT panel over BR-3 ON "The" (19.80): ML ENGINEER rises with the panel, THE MODEL ITSELF ON "model" (22.50) */}
    <PanelV t0={19.8} t1={23.6} side="L" textureSrc={TEX()} textureIn={7} />
    <PanelItems
      t0={19.8}
      t1={23.6}
      cx={540}
      seed={19.8}
      items={[
        { t: 19.8 + 0.23, y: 1335, mode: 'rise', node: <PanelText text="ML ENGINEER" color={ML_GREEN} fontSize={84} /> },
        { t: 22.5, y: 1450, mode: 'rise', node: <PanelText text="THE MODEL ITSELF" fontSize={76} /> },
      ]}
    />
    {/* [KT-POP] EVALS at (540, 1652) portrait (C1.vertical.spec.md clear band) ON "any good" (32.76), removed by the 33.333 cut */}
    <KtKeywordPop t0={32.76} t1={33.333} lines={['EVALS']} accent={AI_YELLOW} x={540} y={1652} />
    {/* [KT-BOXED] hand:kt-boxed-words: the card cuts in SILENT ON "you" (48.68), CAN ON "can" (49.04), SHOULD ON "should"
        (50.06); hand:kt-shake-cut back to the face ON "host" (50.78) */}
    <BoxedWordsCardV t0={48.68} t1={at(SHAKE_T)} w1={{ t: 49.04, text: 'CAN' }} w2={{ t: 50.06, text: 'SHOULD' }} />
    {/* [KT-BAND] verdict band 1: up with the paper push-out (64.39); question 1, ML ENGINEER ON "ML." (69.82); question 2 ON
        "If" (70.30), AI ENGINEER ON "AI." (72.44); cut as the spin into the wave wall starts */}
    <VerdictBandV
      t0={64.39}
      t1={(F(SPIN_CUT_T) - 3) / FPS}
      textureSrc={TEX()}
      textureIn={21}
      items={[
        { t: 64.39, t1: 70.3, kind: 'slide', y: 1405, node: <BandText lines={['IF YOU HAVE THE', 'RESEARCH BACKGROUND']} caps={42} /> },
        { t: 69.82, t1: 70.3, kind: 'pop', y: 1568, node: <BandText lines={['ML ENGINEER']} caps={55} color={ML_GREEN} /> },
        { t: 70.3, t1: 99, kind: 'slide', y: 1405, node: <BandText lines={["IF YOU'RE A", 'SOFTWARE DEVELOPER']} caps={42} /> },
        { t: 72.44, t1: 99, kind: 'pop', y: 1568, node: <BandText lines={['AI ENGINEER']} caps={55} color={AI_YELLOW} /> },
      ]}
    />
    {/* [KT-BAND] the both-verdicts band rides back up with BR-7 (75.37), the two rows STACKED for the portrait frame (label +
        down arrow over its verdict); AI ENGINEER pops on row 2 ON "AI." (77.14) */}
    <VerdictBandV
      t0={75.37}
      t1={77.633}
      textureSrc={TEX()}
      textureIn={33}
      seed={3}
      items={[
        { t: 75.37, t1: 99, kind: 'slide', y: 1366, node: <LabelDown text={B_ROW1.label} /> },
        { t: 75.37, t1: 99, kind: 'slide', y: 1444, node: <BandText lines={[B_ROW1.verdict]} caps={46} color={B_ROW1.verdictColor} /> },
        { t: 75.37, t1: 99, kind: 'slide', y: 1550, node: <LabelDown text={B_ROW2.label} /> },
        { t: 77.14, t1: 99, kind: 'pop', y: 1628, node: <BandText lines={[B_ROW2.verdict]} caps={46} color={B_ROW2.verdictColor} /> },
      ]}
    />
    {/* [KT-VERSUS] the ONE versus stack over the F5 face: matte 77.77, A ON "shipping" (78.10), VS ON "versus" (80.44),
        B ON "training" (81.04); all hold to the 82.40 cut. Lines re-broken for the 1080 width (same words) */}
    <VersusStackV
      t0={77.77}
      t1={82.4}
      lines={[
        { t: 78.1, y: 390, lines: ['SHIP A SUPPORT', 'CHATBOT', 'ON CLAUDE'], color: AI_YELLOW, fontSize: 92 },
        { t: 80.44, y: 650, lines: ['VS'], color: '#FFFFFF', fontSize: 104 },
        { t: 81.04, y: 880, lines: ['TRAIN A', 'FRAUD MODEL'], color: ML_GREEN, fontSize: 100 },
      ]}
    />
    {/* [KT-BAND] WHAT'S HIRING NOW ON "right now" (82.76) over C12; AI ENGINEER ON "AI" (87.54, with the highlighter) */}
    <VerdictBandV
      t0={82.76}
      t1={88.6}
      textureSrc={TEX()}
      textureIn={41}
      seed={5}
      items={[
        { t: 82.76, t1: 99, kind: 'slide', y: 1420, node: <BandText lines={["WHAT'S HIRING NOW"]} caps={44} /> },
        { t: 87.54, t1: 99, kind: 'pop', y: 1572, node: <BandText lines={['AI ENGINEER']} caps={55} color={AI_YELLOW} /> },
      ]}
    />
    {/* [KT-PANEL] RIGHT panel over BR-8 ON "If" (88.70): CODE + tick ON "code" (89.34), MATH + cross ON "math" (90.12),
        [KT-POP] AI ENGINEER ON "AI" (90.54), all to 92.02 */}
    <PanelV t0={88.7} t1={92.02} side="R" textureSrc={TEX()} textureIn={52} />
    <PanelItems
      t0={88.7}
      t1={92.02}
      cx={540}
      seed={88.7}
      items={[
        { t: 89.34, y: 1250, mode: 'rise', node: <BadgeRow text="CODE" ok /> },
        { t: 90.12, y: 1370, mode: 'rise', node: <BadgeRow text="MATH" ok={false} /> },
        { t: 90.54, y: 1540, mode: 'pop', node: <PanelText text="AI ENGINEER" color={AI_YELLOW} fontSize={92} /> },
      ]}
    />
    {/* [KT-HEADLINE] COMPETING WITH PhDs ON "competing" (120.32), held to 123.70 (W3: never NEED A); lines re-broken */}
    <HeadlinePopV t0={120.32} t1={123.7} lines={['COMPETING', 'WITH PhDs']} y={1400} fontSize={124} pitch={128} uppercase={false} />
    {/* [KT-POP] AI ENGINEERING on the final drop (125.865) to the F6 cut; [KT-SPARK] on its last letter ON "the key" (127.10) */}
    <KeywordPopSparkV t0={125.865} t1={127.533} text="AI ENGINEERING" color={AI_YELLOW} y={1520} fontSize={84} spark={{ word: 'ENGINEERING', t: 127.1 }} />
    {/* [KT-HEADLINE] THE DOOR IS OPEN ON "door" (127.80), held to 130.40, in the sky above the door */}
    <HeadlinePopV t0={127.8} t1={130.4} lines={['THE DOOR', 'IS OPEN']} y={300} fontSize={136} pitch={136} />
    {/* [KT-CLOSE] the subscribe bar: ON "subscribe" (130.76), clicks LIKE then SUBSCRIBE, out at 133.69 */}
    <SubscribeBarV t0={130.76} tOut={133.69} fillSrc={staticFile(V_EXTRA.subFill)} keySrc={staticFile(V_EXTRA.subKey)} />
  </>
);

// =====================================================================================================================
// 6. CAPTIONS: the same kt-caption-highlight phrases and windows as the 16:9 (CAPTION_SRC / CAPTION_OFF, AIVsMLCaptions.ts
//    CAPTION_WINDOWS), restyled for the portrait frame (CaptionLineV: lower third, wraps to two lines at phone size). The
//    16:9 lift over the subscribe bar is not needed: the portrait bar sits in the headroom above Mike's head.
// =====================================================================================================================
const KT_CAPTIONS: CaptionPhrase[] = [
  { t: 8.38, text: 'ONE OF THESE ROLES' },
  { t: 9.26, text: 'GETS THE *BIG CHECKS*' },
  { t: 10.68, text: 'THE OTHER ONE' },
  { t: 11.3, text: 'GETS THE *DOOR OPEN*', spark: { word: 'DOOR', t: 11.74 } },
  { t: 33.3, text: "THAT'S MY SIDE" },
  { t: 34.62, text: "I'VE RUN CLAUDE AGENTS" },
  { t: 35.68, text: 'ACROSS WHOLE PIPELINES' },
  { t: 37.38, text: 'AND I *NEVER* ACTUALLY' },
  { t: 38.84, text: '*TRAINED A MODEL*' },
  { t: 45.68, text: 'BUT AS SOON AS' },
  { t: 46.58, text: 'THAT API BILL GETS *TOO BIG*' },
  { t: 50.78, text: '*HOST AND TUNE*' },
  { t: 51.76, text: 'YOUR *OWN MODEL*' },
  { t: 53.08, text: 'WHICH IS SOMETHING' },
  { t: 54.04, text: "I'VE BEEN THINKING ABOUT LATELY" },
  { t: 55.98, text: 'HMM,' },
  { t: 56.8, text: 'HOW TO *CUT THOSE COSTS*' },
  { t: 123.98, text: 'THEREFORE, FOR MOST DEVELOPERS' },
  { t: 130.48, text: 'SO SUBSCRIBE' },
  { t: 131.46, text: 'FOR MORE STEADY CONTENT' },
  { t: 132.78, text: 'ON *HOW TO BECOME AN AI ENGINEER*' },
  { t: 135.08, text: 'ALL MY CONTENT' },
  { t: 135.82, text: 'ON THIS CHANNEL' },
  { t: 136.5, text: 'IS GEARED TO HELP YOU' },
  { t: 137.82, text: 'ON YOUR *AI ENGINEERING* JOURNEY' },
];
/** the windows the caption line shows in (source seconds): FACE windows minus the planned OFF spans (as the 16:9) */
const CAPTION_SRC: [number, number][] = [
  [8.267, 12.367],
  [33.333, 39.967],
  [45.633, 48.68],
  [50.78, 58.1],
  [123.7, 125.865],
  [130.4, 139.533],
];
const CAPTION_OFF: [number, number][] = [[48.68, 50.78]]; // under the boxed-words card (the card carries CAN / SHOULD)
for (const [a, b] of CAPTION_WINDOWS) {
  const segs = [...CAPTION_SRC, ...CAPTION_OFF].filter(([x, y]) => y > a && x < b).sort((p, q) => p[0] - q[0]);
  let cur = a;
  for (const [x, y] of segs) if (x <= cur + 0.01) cur = Math.max(cur, y);
  if (cur < b - 0.01) throw new Error(`caption window [${a}, ${b}] is not covered by the kt-caption-highlight line`);
}
const inSpans = (t: number, spans: [number, number][]) => spans.some(([a, b]) => t >= a && t < b);
const CAPS = ZCAPTIONS.map((c) => ({ tf: sh(c.t), h: c.h }));
/** the house Montserrat caption (comp-build section 8 style, verbatim, portrait size + position), rendered only inside
 * CAPTION_WINDOWS and outside the KT line's spans: the KT line carries every window here, so this renders nothing. */
const HouseCaptions: React.FC = () => {
  const f = useAbsFrame();
  const t = f / FPS;
  if (!CAPTION_WINDOWS.some(([a, b]) => t >= sh(a) && t < sh(b))) return null;
  const ts = unsh(t);
  if (inSpans(ts, CAPTION_SRC) || inSpans(ts, CAPTION_OFF)) return null;
  let cur: { tf: number; h: string } | null = null;
  for (const c of CAPS) {
    if (c.tf <= t) cur = c;
    else break;
  }
  if (!cur) return null;
  const c0 = cur;
  const nextT = (CAPS.find((c) => c.tf > c0.tf) || { tf: Infinity }).tf;
  if (t >= Math.min(nextT, c0.tf + 1.3)) return null;
  const s = interpolate((t - c0.tf) * FPS, [0, 4, 9], [0.7, 1.12, 1], CL);
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: 1480, display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          fontFamily: "Montserrat,'Arial Black','Segoe UI',sans-serif",
          fontWeight: 900,
          fontSize: 80,
          textTransform: 'lowercase',
          color: '#FFFFFF',
          WebkitTextStroke: '12px #000',
          paintOrder: 'stroke fill',
          transform: `scale(${s})`,
        }}
      >
        {c0.h}
      </div>
    </div>
  );
};

// =====================================================================================================================
// 7. THE COMPOSITION (1080x1920, Root.tsx registers it with the 16:9 DUR)
// =====================================================================================================================
export const AIVsMLVertical: React.FC = () => {
  const frame = useCurrentFrame();
  useAssertVerticalAssets();
  return (
    <AbsFrame.Provider value={frame}>
      <KtClock.Provider value={{ t: unsh(frame / FPS) }}>
        <AbsoluteFill style={{ backgroundColor: 'black', width: VW, height: VH }}>
          {/* the VO: the paused spine's own audio, ONCE (every picture copy of the spine is muted) */}
          <Sequence from={0} durationInFrames={SPINE_FRAMES} layout="none" name="VO">
            <Audio src={staticFile(V_EXTRA.spine)} />
          </Sequence>
          <Sequence from={0} durationInFrames={SPINE_FRAMES} layout="none" name="spine">
            <SpineLayer />
          </Sequence>
          <LeakLayer />
          <CoverTrack />
          <MeltLayer />
          <SpinCutLayer />
          <SpinLibLayer />
          <KineticText />
          <CaptionLineV phrases={KT_CAPTIONS} spans={CAPTION_SRC} />
          <HouseCaptions />
        </AbsoluteFill>
      </KtClock.Provider>
    </AbsFrame.Provider>
  );
};

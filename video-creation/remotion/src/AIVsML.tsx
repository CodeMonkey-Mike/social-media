// AIVsML.tsx: "AI Engineer or ML Engineer? Pick Wrong and It Costs You" (longform-edited, AI Engineering Simplified),
// the 16:9 comp built TO the approved blueprint (comp-builder, 2026-11-11):
//   media/AI vs ML/EDIT-PLAN.md (event log) · CUE-SHEET.md · TRANSITIONS.md + TRANSITION-PLAN.json · COVER-PLAN.json ·
//   AS-RECORDED.md · PROJECT-LOG.md Open flags (END HOLD 2.0 s, the accuracy labels) · assets/slide-sources/_state-cues.md ·
//   assets/diagrams/C1-spec.md · assets/charts/C3-spec.md.
// Effects theme kinetic-text-2023 ("Energetic"): the shared engines from ./effects/kinetic-text, the devices with no engine
// yet in ./AIVsMLKit (built to their library rows). NO music, NO SFX, NO watermark: the post-mix (mix_music.py) owns audio.
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
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadDMSans } from '@remotion/google-fonts/DMSans';
import { loadFont as loadJetBrains } from '@remotion/google-fonts/JetBrainsMono';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import {
  CL,
  KtClock,
  KtIconPop,
  KtKeywordPop,
  KtSidePanel,
  KtWhipCut,
  KtWordByWord,
  KtWhipVariant,
  ktSidePanelShift,
  useKtTime,
} from './effects/kinetic-text';
import { HwAlphaPlate } from './effects/halloween-2022';
import { ENGINES, getTransition } from './transitions';
import { TransitionClip } from './transitions/TransitionClip';
import { CAPTION_WINDOWS, ZCAPTIONS } from './AIVsMLCaptions';
import { ChartC3 } from './AIVsMLCharts';
import {
  AI_YELLOW,
  AbsFrame,
  ArrowGlyph,
  BadgeRow,
  BandText,
  BoxedWordsCard,
  CaptionLine,
  CaptionPhrase,
  EndScreenArrow,
  FULL,
  GRID_OPEN,
  GridZoomIn,
  H,
  HeadlinePop,
  KeywordPopSpark,
  ML_GREEN,
  PUSH,
  PanelItems,
  PanelText,
  PushSlide,
  RocketIcon,
  SHAKE_DUR,
  ShakeCut,
  SpinCut,
  VerdictBand,
  VersusStack,
  W,
  useAbsFrame,
  wobbleCss,
} from './AIVsMLKit';

loadMontserrat('italic', { weights: ['800', '900'], subsets: ['latin'] });
loadMontserrat('normal', { weights: ['700', '800', '900'], subsets: ['latin'] });
loadDMSans('normal', { weights: ['400', '600', '700'], subsets: ['latin'] });
loadJetBrains('normal', { weights: ['400', '600'], subsets: ['latin'] });
loadPlayfair('normal', { weights: ['900'], subsets: ['latin'] });

// =====================================================================================================================
// 1. TIMING (comp-build section 2 / 3d): spine/ALL.f.paused.json pauses[] = [] (no title card, no clip insert, no braam
//    pause: an identity copy of the final spine), pause_s 1.5. The pauses table IS the time map, so sh(t) = t here.
// =====================================================================================================================
export const FPS = 30;
const PAUSE = 1.5; // sidecar pause_s (no card pause is baked: every chapter card is OFF)
export const CARD_T: number[] = []; // sidecar pauses[].at of the card rows: none
export const INSERTS: { at: number; dur: number }[] = []; // every sidecar pause row: none
const SPINE_SECS = 145.2; // the SOURCE spine spine/ALL.e.enhanced.mp4
const LAST_WORD = 145.0; // "Or even this one!" ends 145.00
const END_HOLD = 2.0; // PROJECT-LOG END HOLD (Mike, spoken + spine_review 2026-11-10): end screen + bed 2.0 s past the last word
const sh = (t: number) => t + INSERTS.filter((p) => p.at <= t).reduce((s, p) => s + p.dur, 0);
const unsh = (tp: number) => {
  let t = tp;
  for (const p of INSERTS) if (sh(p.at) + p.dur <= tp) t -= p.dur;
  return t;
};
const F = (t: number) => Math.round(sh(t) * FPS);
const SPINE_FRAMES = Math.ceil(sh(SPINE_SECS) * FPS); // 4356
export const DUR = Math.round((sh(LAST_WORD) + END_HOLD) * FPS); // 4410 = 147.00 s
if (CARD_T.length * PAUSE !== 0 || DUR < SPINE_FRAMES) throw new Error('AIVsML: time map out of step with the sidecar');
/** frame-aligned source second of a cue (the frame a Sequence starting at F(t) begins on) */
const at = (t: number) => F(t) / FPS;
/** kt-whip-cut: scale 200 -> 100 + the radial (zoom) shutter blur, lens curvature OFF (the engine's `lens` option).
 * Measured 2026-11-11 on a draft still: a whip frame with the lens takes 104-184 s (over the render's 120 s per-frame
 * timeout; ~150 whip frames), 55 s with the lens and no shutter, 13 s with the shutter and no lens. Flagged for Mike. */
const WHIP_LENS = false;
const WHIP_BLUR = true;
const EASE_OUT = Easing.out(Easing.cubic);
const EASE_INOUT = Easing.inOut(Easing.cubic);

// =====================================================================================================================
// 2. FACE (comp-build 3a): the MEASURED reframe (assets/face-reframe.json, never hand-tuned), FACE windows (AS-RECORDED)
// =====================================================================================================================
export const FACE_REFRAME = { scale: 1.506, x: -849, y: -395 };
const FACE_POINT = { x: 960, y: 432 }; // face-reframe.json face_point_out: punch-ins scale about it
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
/** [PUNCH-IN] F7 ON the desilencer join 134.767 (spine/jumpcuts-final.json, frame 4043): kt-snap-zoom 2 frames, LINEAR,
 * 360-degree shutter, ~20 percent, about FACE_POINT; the library leak peaks on the same frame (below) */
const PUNCH = { t: 134.767, s: 1.2, dur: 0.067, end: 139.533 };
/** F5 (versus stack): kt-snap-zoom 'deep' framing, 130 percent with position y 0.500 -> 0.585 (the whip lands on it) */
const VERSUS_FRAME = { a: 77.633, b: 82.4, s: 1.3, dy: 0.085 * H };
/** F4 out (58.100): the paper card pushes in from the RIGHT in 2 frames over the outgoing face: the face is HELD on its
 * last frame for those frames (a real Freeze of the spine, muted, same transform, same source: comp-build 6a) */
const SPINE_HOLDS = [{ from: F(58.1), to: F(58.1) + 3, frame: F(58.1) - 1 }];

const tPunch = at(PUNCH.t);
const faceTransform = (t: number) => {
  if (t < FACE_WINDOWS[0][1]) {
    // the signature open's slow ~5 percent push over the line
    const s = interpolate(t, [0, FACE_WINDOWS[0][1]], [1, 1.05], CL);
    return { origin: `${FACE_POINT.x}px ${FACE_POINT.y}px`, css: `scale(${s})` };
  }
  if (t >= VERSUS_FRAME.a && t < VERSUS_FRAME.b) return { origin: '960px 540px', css: `translate(0px, ${VERSUS_FRAME.dy}px) scale(${VERSUS_FRAME.s})` };
  if (t >= tPunch - 0.02 && t < PUNCH.end) {
    const s = 1 + (PUNCH.s - 1) * interpolate(t, [tPunch, tPunch + PUNCH.dur], [0, 1], CL);
    return { origin: `${FACE_POINT.x}px ${FACE_POINT.y}px`, css: `scale(${s})` };
  }
  return { origin: '50% 50%', css: 'none' };
};

/** the spine picture through the measured reframe. sync 'local' = the frame of the enclosing Sequence (the root spine
 * layer, a root Freeze); sync 'abs' = the comp frame from the absolute clock in ANY nesting (an engine's re-mounts). */
const SpineVideo: React.FC<{ sync: 'local' | 'abs' }> = ({ sync }) => {
  const abs = useAbsFrame();
  const local = useCurrentFrame();
  const trim = sync === 'abs' ? Math.max(0, abs - local) : 0;
  return (
    <OffthreadVideo
      src={staticFile('spine.mp4')}
      muted
      trimBefore={trim}
      style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: '0 0', transform: `translate(${FACE_REFRAME.x}px, ${FACE_REFRAME.y}px) scale(${FACE_REFRAME.scale})` }}
    />
  );
};
const FaceShot: React.FC<{ t: number; sync: 'local' | 'abs' }> = ({ t, sync }) => {
  const tf = faceTransform(t);
  return (
    <div style={{ ...FULL, overflow: 'hidden', transformOrigin: tf.origin, transform: tf.css }}>
      <SpineVideo sync={sync} />
    </div>
  );
};
/** the LIVE face: the punch step carries its 360-degree shutter (5 samples, an exact average of opaque layers) */
const FaceLive: React.FC<{ sync: 'local' | 'abs'; t?: number }> = ({ sync, t: tFixed }) => {
  const tNow = useKtTime();
  const t = tFixed ?? tNow;
  const blurOn = t >= tPunch - 1 / 60 && t < tPunch + PUNCH.dur + 1 / 60;
  if (!blurOn) return <FaceShot t={t} sync={sync} />;
  const n = 5;
  const ts = Array.from({ length: n }, (_, i) => t + (i / (n - 1) - 0.5) / FPS);
  return (
    <div style={{ ...FULL, isolation: 'isolate', background: 'black' }}>
      {ts.map((s, i) => (
        <div key={i} style={{ ...FULL, opacity: 1 / (i + 1) }}>
          <FaceShot t={s} sync={sync} />
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
  if (t < GRID_OPEN.dur) return <GridZoomIn t={t} render={() => <FaceLive sync="local" />} />; // hand:kt-grid-zoom-in (0.000)
  const tShake = at(SHAKE_T);
  if (t >= tShake && t < tShake + SHAKE_DUR) return <ShakeCut t0={tShake} render={() => <FaceLive sync="local" />} />; // hand:kt-shake-cut
  const whip = [...FACE_WHIPS].reverse().find((c) => t >= at(c));
  if (whip !== undefined && t < at(whip) + 0.4)
    return (
      // hand:kt-whip-cut face cut-in (8.267 / 33.333 / 45.633 / 77.633 / 123.700 / 130.400)
      <KtWhipCut t0={at(whip)} lens={WHIP_LENS} motionBlur={WHIP_BLUR}>
        <FaceLive sync="local" />
      </KtWhipCut>
    );
  return <FaceLive sync="local" />;
};

// =====================================================================================================================
// 3. COVERS (comp-build section 4): one row per state / sub-point, straight from the EDIT-PLAN event log. `grp` = one
//    card / diagram / page; contiguous rows of one grp are STATE SWAPS (no ingress transition, the wobble continues).
//    tr = the INGRESS transition id (TRANSITION-PLAN), wv = whip variant, pd = push from (L / R), out = egress move,
//    sp / spT = a side panel on that side from spT (the b-roll framed toward the free side), st = card state.
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

/** 24 / 25 fps clips play frame-for-frame (comp-build section 11): playbackRate = 30 / clip fps */
const VID_FPS: Record<string, number> = {
  'BR-1-two-engineers-side-by-side': 30000 / 1001,
  'BR-2-app-ui-on-laptop': 30000 / 1001,
  'BR-3-neural-network-model': 30 / 1,
  'BR-4-leaning-back-hands-behind-head': 25 / 1,
  'BR-5-chalk-math-equations': 25 / 1,
  'BR-6-developer-coding-over-shoulder': 25 / 1,
  'BR-7-team-celebrating-launch': 24000 / 1001,
  'BR-8-code-scrolling-dark-screen': 25 / 1,
  'BR-9-research-scientists-lab': 25 / 1,
  'BR-10-door-opening-light': 30 / 1,
};

const contig = (a: Cover, b: Cover) => Math.abs(F(a.tOut) - F(b.tIn)) <= 0;
const isSwap = (i: number) => i > 0 && !!COVERS[i].grp && COVERS[i - 1].grp === COVERS[i].grp && contig(COVERS[i - 1], COVERS[i]);
const grpStart = (i: number) => {
  let k = i;
  while (isSwap(k)) k--;
  return COVERS[k].tIn;
};
/** frames the OUTGOING row stays under the next one (push-in over it, the 0.33 s fade, or its own push-out) */
const tailFrames = (i: number) => {
  const c = COVERS[i];
  const n = COVERS[i + 1];
  if (c.out === 'hand:kt-push-slide') return Math.ceil(PUSH.outLeft.dur * FPS) + 1;
  if (!n || !contig(c, n) || isSwap(i + 1)) return 0;
  if (n.tr === 'hand:kt-push-slide' && n.pd !== 'U') return Math.ceil((n.pd === 'R' ? PUSH.inRight.dur : PUSH.inLeft.dur) * FPS) + 1;
  if (n.tr === 'hand:fade') return Math.round(FADE_IN * FPS);
  return 0;
};
const FADE_IN = 0.33; // hand:fade (glitch-still, 0.33 s) C3 -> IMG-4, the ONE soft move

// ---- receipts: crop boxes in CAPTURE px [x, y, w] (h = w * 9 / 16), the settle / push, the [HIGHLIGHT] in capture coords
type RView = { W: number; H: number; a: [number, number, number]; b?: [number, number, number]; push?: number; ease?: 'out' | 'inout'; hl?: { x: number; y: number; w: number; h: number; t: number } };
const RECEIPTS: Record<string, RView> = {
  // R(article): the title block shown as an OBJECT, title above 66 percent of the frame (the band); treatment = the pan
  'C12-headline': { W: 3840, H: 2160, a: [-65, 560, 2600] }, // biased right: the pan's static geo offset + drift run -613 -> +117 px
  // the number 1 entry: settling push, then the highlighter wipe on 'AI engineers' ON "AI" (87.54)
  'C12-entry': { W: 3838, H: 2160, a: [470, 0, 2900], b: [560, 20, 2680], push: 0.7, hl: { x: 1145, y: 284, w: 600, h: 104, t: 87.54 } },
  // Stripe 'Machine Learning Engineer, Radar': a short settling push on the title (1.48 s flash)
  'C9-stripe-radar-header': { W: 3838, H: 2160, a: [150, 100, 2700], b: [230, 260, 2400], push: 1.48 },
  // the Minimum requirements: settling push that stops, then the wipe across '...in a production environment.' ON "shipping"
  'C9-stripe-radar-requirements': { W: 3838, H: 2158, a: [600, 0, 2400], b: [650, 60, 2200], push: 0.75, hl: { x: 1418, y: 300, w: 700, h: 62, t: 96.82 } },
  // Levels.fyi AI Engineer, United States: plain push toward the median panel, ends on title + median (crops the strip)
  'C6-levelsfyi-ai-engineer-us': { W: 3840, H: 2160, a: [0, 0, 3840], b: [840, 340, 2100], push: 3.65, ease: 'inout' },
};
const HL_WIPE = 0.35;
const ReceiptView: React.FC<{ id: string; tIn: number }> = ({ id, tIn }) => {
  const t = useKtTime();
  const r = RECEIPTS[id];
  const u = r.b && r.push ? interpolate(t - tIn, [0, r.push], [0, 1], { ...CL, easing: r.ease === 'inout' ? EASE_INOUT : EASE_OUT }) : 0;
  const box = r.b ? r.a.map((v, i) => v + (r.b![i] - v) * u) : r.a;
  const k = W / box[2];
  const hlw = r.hl ? interpolate(t - r.hl.t, [0, HL_WIPE], [0, 1], { ...CL, easing: EASE_OUT }) : 0;
  return (
    <div style={{ ...FULL, overflow: 'hidden', background: '#FFFFFF' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: r.W, height: r.H, transformOrigin: '0 0', transform: `scale(${k}) translate(${-box[0]}px, ${-box[1]}px)` }}>
        <Img src={staticFile(`receipts/${id}.png`)} style={{ position: 'absolute', left: 0, top: 0, width: r.W, height: r.H }} />
        {r.hl && hlw > 0 && (
          // [HIGHLIGHT] a #ffe14d rect wiping left to right over the quoted words, capture coords, multiply (text stays black)
          <div style={{ position: 'absolute', left: r.hl.x, top: r.hl.y, width: r.hl.w * hlw, height: r.hl.h, background: '#ffe14d', mixBlendMode: 'multiply' }} />
        )}
      </div>
    </div>
  );
};

// ---- C1 (Type 2 system-design states): 4-frame cross-fade + the newly lit node 1.00 -> 1.03 -> 1.00 over 8 frames
const C1_NODES = [
  { x: 168, y: 354, w: 330, h: 158 },
  { x: 576, y: 354, w: 236, h: 158 },
  { x: 889, y: 354, w: 236, h: 158 },
  { x: 1203, y: 354, w: 236, h: 158 },
  { x: 1516, y: 354, w: 236, h: 158 },
];
const C1_NODE_OF: Record<string, number> = { 'C1-s1-model': 0, 'C1-s2-api': 1, 'C1-s3-data': 2, 'C1-s4-product': 3, 'C1-s5-evals': 4 };
const imgDir = (c: Cover) => (c.kind === 'deck' ? 'diagrams' : 'card-slides');

const CardView: React.FC<{ i: number }> = ({ i }) => {
  const t = useKtTime();
  const c = COVERS[i];
  const src = staticFile(`${imgDir(c)}/${c.ref}.png`);
  const prev = isSwap(i) ? COVERS[i - 1] : null;
  const dt = t - at(c.tIn);
  const xf = c.grp === 'C1' && prev ? interpolate(dt, [0, 4 / FPS], [0, 1], CL) : 1;
  const node = C1_NODE_OF[c.ref];
  const spot = node !== undefined ? interpolate(dt, [0, 4 / FPS, 8 / FPS], [1, 1.03, 1], CL) : 1;
  const nb = node !== undefined ? C1_NODES[node] : null;
  const arrowN = c.grp === 'end-screen' && c.ref !== 'end-screen' ? Number(c.ref.slice(-1)) : 0;
  const body = (
    <>
      {prev && xf < 1 && <Img src={staticFile(`${imgDir(prev)}/${prev.ref}.png`)} style={{ ...FULL }} />}
      <Img src={src} style={{ ...FULL, opacity: xf }} />
      {nb && spot !== 1 && (
        <div style={{ position: 'absolute', left: nb.x, top: nb.y, width: nb.w, height: nb.h, overflow: 'hidden', transformOrigin: '50% 50%', transform: `scale(${spot})` }}>
          <Img src={src} style={{ position: 'absolute', left: -nb.x, top: -nb.y, width: W, height: H }} />
        </div>
      )}
      {arrowN > 0 && <EndScreenArrow n={arrowN} t0={at(c.tIn)} />}
    </>
  );
  if (c.nw) return <div style={{ ...FULL, overflow: 'hidden' }}>{body}</div>; // the end screen sits still (YouTube end-screen elements)
  return (
    <div style={{ ...FULL, overflow: 'hidden', background: '#0a0c10' }}>
      {/* kt-camera-wobble: 105 percent + the 8.6 s drift path, from the card's first frame (state swaps keep the phase) */}
      <div style={{ ...FULL, transformOrigin: '50% 50%', transform: wobbleCss(t - at(grpStart(i)), !!c.rock) }}>{body}</div>
    </div>
  );
};

const StillView: React.FC<{ c: Cover }> = ({ c }) => {
  const t = useKtTime();
  const dt = t - at(c.tIn);
  const push = interpolate(dt, [0, c.tOut - c.tIn], [1, 1.06], CL); // slow push over the slot
  return (
    <div style={{ ...FULL, overflow: 'hidden', background: 'black' }}>
      <Img src={staticFile(`img/${c.ref}.png`)} style={{ ...FULL, objectFit: 'cover', transformOrigin: '50% 50%', transform: wobbleCss(dt, false, push) }} />
    </div>
  );
};

const VidView: React.FC<{ c: Cover }> = ({ c }) => {
  const t = useKtTime();
  const shift = c.sp && c.spT !== undefined ? ktSidePanelShift(t, c.spT, { side: c.sp }) : { x: 0, scale: 1 };
  return (
    <div style={{ ...FULL, overflow: 'hidden', background: 'black' }}>
      <OffthreadVideo
        src={staticFile(`vid/${c.ref}.mp4`)}
        muted
        playbackRate={FPS / (VID_FPS[c.ref] ?? FPS)}
        style={{ ...FULL, objectFit: 'cover', transformOrigin: '50% 50%', transform: `translateX(${shift.x}px) scale(${shift.scale})`, filter: c.grade ? `brightness(${c.grade})` : undefined }}
      />
    </div>
  );
};

/** kt-wave-wall: the rendered Scene_22 template (assets/kt-renders/wave-wall.mp4, already offset), from its frame 0, no
 * startFrom; the library's blur-out (Gaussian 0 -> 32 over 2 frames at +1.902 s) */
const WaveWall: React.FC<{ c: Cover }> = ({ c }) => {
  const t = useKtTime();
  const blur = interpolate(t - at(c.tIn), [1.902, 1.902 + 2 / FPS], [0, 3.2], CL);
  return (
    <div style={{ ...FULL, overflow: 'hidden', background: 'black' }}>
      <OffthreadVideo src={staticFile('kt-renders/wave-wall.mp4')} muted style={{ ...FULL, filter: blur > 0.05 ? `blur(${blur}px)` : undefined }} />
    </div>
  );
};

/** C12-headline: lib:motion-3d-pan-1-right (Motion3D) over the receipt for its whole 4.38 s slot, the 5 s move fitted to
 * the slot (comp-build section 6 MOTION: the engine's clock set by a <Freeze>, inside a zero-offset Sequence) */
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

/** C3 + its kt-word-by-word (phrases 114.54 / 115.30, payoff TRAIN 116.06 in the chart's ML green), dissolving together */
const C3Cover: React.FC<{ c: Cover }> = ({ c }) => (
  <AbsoluteFill>
    <ChartC3 />
    <KtWordByWord
      t0={114.54}
      t1={c.tOut + 0.5}
      phrases={[
        { t: 114.54, text: 'AND IT GOES TO' },
        { t: 115.3, text: 'THE PEOPLE WHO' },
      ]}
      payoff={{ t: 116.06, text: 'TRAIN' }}
      payoffColor="#00e68a"
      phraseY={918}
    />
  </AbsoluteFill>
);

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
    if (c.tr === 'hand:kt-whip-cut') node = <KtWhipCut t0={tCut} variant={c.wv ?? 'default'} lens={WHIP_LENS} motionBlur={WHIP_BLUR}>{node}</KtWhipCut>;
    else if (c.tr === 'hand:kt-push-slide' && c.pd !== 'U') node = <PushSlide t0={tCut} {...(c.pd === 'R' ? PUSH.inRight : PUSH.inLeft)}>{node}</PushSlide>;
    else if (c.tr === 'hand:fade') node = <div style={{ ...FULL, opacity: interpolate(t - tCut, [0, FADE_IN], [0, 1], CL) }}>{node}</div>;
    // hand:cut / a push with pd 'U' (revealed by the paper's push-out) = a plain cut here; the lib:* moves and
    // hand:kt-spin-cut are separate full-frame layers over the track (section 4 below)
  }
  if (c.out === 'hand:kt-push-slide') node = <PushSlide t0={at(c.tOut)} {...PUSH.outLeft}>{node}</PushSlide>;
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
// 4. LIBRARY + THEME TRANSITIONS OVER THE TRACK (comp-build 6 / 6a: a Sequence of EXACTLY the engine window, cutFrame = win/2,
//    absolute-clock nodes, no SFX in the comp)
// =====================================================================================================================
const libWindow = (id: string, cut: number) => {
  const row = getTransition(id);
  if (!row) throw new Error(`transition row missing: ${id}`);
  const win = Math.round(row.durationSeconds * FPS);
  const half = Math.round(win / 2);
  return { win, half, from: F(cut) - half };
};
const iOf = (ref: string) => COVERS.findIndex((c) => c.ref === ref);

// lib:melt-equidistant-short-3 (MELT-transform, 0.44 s) build-train-deploy -> C1, 26.24. Image engine: the two states as
// stills; the engine output rides the SAME kt-camera-wobble as the live scene it shows (card before the swap, C1 after)
const MELT = { id: 'melt-equidistant-short-3', cut: 26.24, out: 'build-train-deploy-s3', in: 'C1-s0-base' };
const MeltWrap: React.FC<{ children: React.ReactNode; win: number; from: number; cutFrac: number }> = ({ children, win, from, cutFrac }) => {
  const f = useAbsFrame();
  const t = f / FPS;
  const swapped = (f - from) / Math.max(1, win - 1) >= cutFrac;
  const gi = swapped ? iOf(MELT.in) : iOf(MELT.out);
  return (
    <div style={{ ...FULL, overflow: 'hidden', background: '#0a0c10' }}>
      <div style={{ ...FULL, transformOrigin: '50% 50%', transform: wobbleCss(t - at(grpStart(gi))) }}>{children}</div>
    </div>
  );
};
const MeltLayer: React.FC = () => {
  const w = libWindow(MELT.id, MELT.cut);
  const cutFrac = (getTransition(MELT.id)!.params as { cut: number }).cut;
  return (
    <Sequence from={w.from} durationInFrames={w.win} name="lib:melt-equidistant-short-3">
      <MeltWrap win={w.win} from={w.from} cutFrac={cutFrac}>
        <TransitionClip
          id="melt-equidistant-short-3"
          cutFrame={w.half}
          sfx={false}
          fromSrc={`card-slides/${MELT.out}.png`}
          toSrc={`diagrams/${MELT.in}.png`}
          outgoing={() => <Img src={staticFile(`card-slides/${MELT.out}.png`)} style={{ ...FULL }} />}
          incoming={() => <Img src={staticFile(`diagrams/${MELT.in}.png`)} style={{ ...FULL }} />}
        />
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
// sources = the CUT FRAME stills of the live frames (assets/transitions/cutframes/: BR-6 clip frames 83-85 at its 1.2x rate,
// wave-wall clip frames 0-5)
const SPIN_CUT_T = 73.05;
const SpinCutLayer: React.FC = () => {
  const cf = F(SPIN_CUT_T);
  return (
    <Sequence from={cf - 3} durationInFrames={9} name="hand:kt-spin-cut">
      <SpinCut
        cut={at(SPIN_CUT_T)}
        cutFrame={cf}
        outStills={[83, 84, 85].map((n) => `transitions/cutframes/BR-6-f${n}.jpg`)}
        inStills={[0, 1, 2, 3, 4, 5].map((n) => `transitions/cutframes/wave-wall-f${n}.jpg`)}
      />
    </Sequence>
  );
};

// [PUNCH-IN] + [LIGHTLEAK] lib:lightleaks-6 (punch-leak, 1.12 s): its flash peaks ON the join frame 4043 (the engine's
// envelope peaks at 0.32 s = frame 10 of its 34), screen blend, real leak plates, UNDER the captions. The scene it washes
// is the live punched face (absolute clock, muted, the same reframe + punch transform, the same source).
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
// 5. KINETIC TEXT (EDIT-PLAN [KT-*] rows; above the cover layer, below the captions). Their [WHOOSH] / [ACCENT] sounds are
//    NOT here: mix_music.py places them from the event log.
// =====================================================================================================================
const TEX = () => staticFile('kt/animated-texture.mp4');
const ROW = (label: string, verdict: string, verdictColor: string) => ({ label, verdict, verdictColor });
const B_ROW1 = ROW('TRAIN MODELS', 'ML ENGINEER', ML_GREEN);
const B_ROW2 = ROW('SHIP PRODUCTS', 'AI ENGINEER', AI_YELLOW);
const LabelArrow: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
    <BandText lines={[text]} caps={44} />
    <ArrowGlyph w={72} />
  </div>
);

const SubscribeBar: React.FC = () => {
  // [KT-CLOSE] kt-subscribe-close BAR: plate graphics/subscribe-bar-fill + -key (FILL + KEY alpha pair), the clip at
  // position (0.5, 0.579), 73.5 percent (bar 699 x 134 at (960, 881)); rises 538 px over 0.262 s ON "subscribe" (130.76),
  // the plate's own cursor clicks LIKE then SUBSCRIBE (-> SUBSCRIBED, 133.08), drops below the frame over 0.200 s (133.69)
  const t = useKtTime();
  const T0 = 130.76;
  const TOUT = 133.69;
  if (t < T0 || t >= TOUT + 0.2) return null;
  const rise = interpolate(t - T0, [0, 0.262], [538, 0], { ...CL, easing: Easing.bezier(0.19, 0.45, 0, 1) });
  const drop = interpolate(t - TOUT, [0, 0.2], [0, 796], { ...CL, easing: Easing.in(Easing.cubic) });
  return <HwAlphaPlate fillSrc={staticFile('kt/subscribe-bar-fill.mp4')} keySrc={staticFile('kt/subscribe-bar-key.mp4')} sec={t - T0} cx={960} cy={625 + rise + drop} scale={0.735} />;
};

const KineticText: React.FC = () => (
  <>
    {/* CH1 signature open: label A ON the grid landing (0.483), label B ON "ML" (1.60), both to the F1 cut 2.567 */}
    <KtKeywordPop t0={0.483} t1={2.567} lines={['AI ENGINEER']} accent={AI_YELLOW} x={470} y={860} />
    <KtKeywordPop t0={1.6} t1={2.567} lines={['ML ENGINEER']} accent={ML_GREEN} x={1450} y={860} />
    {/* [KT-HEADLINE] over IMG-1 (top clean band), ON "huge" (7.68), with its role-free framing line (GATE plan ruling) */}
    <HeadlinePop t0={7.68} t1={8.267} lines={['AT THE TOP:', 'A *$340K* GAP']} x={535} y={290} fontSize={104} pitch={104} framing="TOP 10% VS TYPICAL · LEVELS.FYI · US · TOTAL COMP · 2026" />
    {/* [KT-PANEL] RIGHT dark panel over BR-2 (swoosh-1 file start 13.89 = 0.17 s before the panel moves) */}
    <KtSidePanel t0={14.06} t1={17.33} side="R" lines={['*AI ENGINEER*', 'SHIPS PRODUCTS']} accent={AI_YELLOW} textureSrc={TEX()} />
    {/* [KT-ICON] rocket ON "shipping" (16.46), from the LEFT edge, 0.50 s */}
    <KtIconPop t0={16.46} t1={17.33} preset="rocket-left" icon={<RocketIcon />} />
    {/* [KT-PANEL] LEFT panel over BR-3 ON "The" (19.80): ML ENGINEER rises with the panel, THE MODEL ITSELF ON "model" (22.50) */}
    <KtSidePanel t0={19.8} t1={23.6} side="L" lines={[]} textureSrc={TEX()} textureIn={7} />
    <PanelItems
      t0={19.8}
      t1={23.6}
      cx={431}
      seed={19.8}
      items={[
        { t: 19.8 + 0.23, y: 495, mode: 'rise', node: <PanelText text="ML ENGINEER" color={ML_GREEN} /> },
        { t: 22.5, y: 590, mode: 'rise', node: <PanelText text="THE MODEL ITSELF" /> },
      ]}
    />
    {/* [KT-POP] EVALS at (960, 915) ON "any good" (32.76), removed by the 33.333 cut */}
    <KtKeywordPop t0={32.76} t1={33.333} lines={['EVALS']} accent={AI_YELLOW} x={960} y={915} />
    {/* [KT-BOXED] hand:kt-boxed-words (container-xfade, 0.00 s): the card cuts in SILENT ON "you" (48.68), CAN ON "can"
        (49.04), SHOULD ON "should" (50.06); hand:kt-shake-cut back to the face ON "host" (50.78) */}
    <BoxedWordsCard t0={48.68} t1={at(SHAKE_T)} w1={{ t: 49.04, text: 'CAN' }} w2={{ t: 50.06, text: 'SHOULD' }} />
    {/* [KT-BAND] verdict band 1: up with the paper push-out (64.39); question 1, ML ENGINEER ON "ML." (69.82); question 2 ON
        "If" (70.30), AI ENGINEER ON "AI." (72.44); cut as the spin into the wave wall starts */}
    <VerdictBand
      t0={64.39}
      t1={(F(SPIN_CUT_T) - 3) / FPS}
      textureSrc={TEX()}
      textureIn={21}
      items={[
        { t: 64.39, t1: 70.3, kind: 'slide', y: 790, node: <BandText lines={['IF YOU HAVE THE', 'RESEARCH BACKGROUND']} caps={42} /> },
        { t: 69.82, t1: 70.3, kind: 'pop', y: 932, node: <BandText lines={['ML ENGINEER']} caps={55} color={ML_GREEN} /> },
        { t: 70.3, t1: 99, kind: 'slide', y: 790, node: <BandText lines={["IF YOU'RE A", 'SOFTWARE DEVELOPER']} caps={42} /> },
        { t: 72.44, t1: 99, kind: 'pop', y: 932, node: <BandText lines={['AI ENGINEER']} caps={55} color={AI_YELLOW} /> },
      ]}
    />
    {/* [KT-BAND] the both-verdicts band rides back up with BR-7 (75.37); AI ENGINEER pops on line 2 ON "AI." (77.14) */}
    <VerdictBand
      t0={75.37}
      t1={77.633}
      textureSrc={TEX()}
      textureIn={33}
      seed={3}
      items={[
        { t: 75.37, t1: 99, kind: 'slide', x: 930, align: 'right', y: 812, node: <LabelArrow text={B_ROW1.label} /> },
        { t: 75.37, t1: 99, kind: 'slide', x: 990, align: 'left', y: 812, node: <BandText lines={[B_ROW1.verdict]} caps={50} color={B_ROW1.verdictColor} align="left" /> },
        { t: 75.37, t1: 99, kind: 'slide', x: 930, align: 'right', y: 935, node: <LabelArrow text={B_ROW2.label} /> },
        { t: 77.14, t1: 99, kind: 'pop', x: 990, align: 'left', y: 935, node: <BandText lines={[B_ROW2.verdict]} caps={50} color={B_ROW2.verdictColor} align="left" /> },
      ]}
    />
    {/* [KT-VERSUS] the ONE versus stack over the F5 face: matte 77.77, A ON "shipping" (78.10), VS ON "versus" (80.44),
        B ON "training" (81.04); all hold to the 82.40 cut */}
    <VersusStack
      t0={77.77}
      t1={82.4}
      lines={[
        { t: 78.1, y: 255, lines: ['SHIP A SUPPORT', 'CHATBOT ON CLAUDE'], color: AI_YELLOW, fontSize: 110 },
        { t: 80.44, y: 452, lines: ['VS'], color: '#FFFFFF', fontSize: 104 },
        { t: 81.04, y: 615, lines: ['TRAIN A FRAUD MODEL'], color: ML_GREEN, fontSize: 110 },
      ]}
    />
    {/* [KT-BAND] WHAT'S HIRING NOW ON "right now" (82.76) over C12; AI ENGINEER ON "AI" (87.54, with the highlighter) */}
    <VerdictBand
      t0={82.76}
      t1={88.6}
      textureSrc={TEX()}
      textureIn={41}
      seed={5}
      items={[
        { t: 82.76, t1: 99, kind: 'slide', y: 800, node: <BandText lines={["WHAT'S HIRING NOW"]} caps={44} /> },
        { t: 87.54, t1: 99, kind: 'pop', y: 925, node: <BandText lines={['AI ENGINEER']} caps={55} color={AI_YELLOW} /> },
      ]}
    />
    {/* [KT-PANEL] RIGHT panel over BR-8 ON "If" (88.70): CODE + tick ON "code" (89.34), MATH + cross ON "math" (90.12),
        [KT-POP] AI ENGINEER ON "AI" (90.54), all to 92.02 */}
    <KtSidePanel t0={88.7} t1={92.02} side="R" lines={[]} textureSrc={TEX()} textureIn={52} />
    <PanelItems
      t0={88.7}
      t1={92.02}
      cx={1489}
      seed={88.7}
      items={[
        { t: 89.34, y: 380, mode: 'rise', node: <BadgeRow text="CODE" ok /> },
        { t: 90.12, y: 520, mode: 'rise', node: <BadgeRow text="MATH" ok={false} /> },
        { t: 90.54, y: 720, mode: 'pop', node: <PanelText text="AI ENGINEER" color={AI_YELLOW} fontSize={92} /> },
      ]}
    />
    {/* [KT-HEADLINE] COMPETING WITH PhDs ON "competing" (120.32), held to 123.70 (W3: never NEED A) */}
    <HeadlinePop t0={120.32} t1={123.7} lines={['COMPETING WITH', 'PhDs']} fontSize={136} pitch={140} uppercase={false} />
    {/* [KT-POP] AI ENGINEERING on the final drop (125.865) to the F6 cut; [KT-SPARK] on its last letter ON "the key" (127.10) */}
    <KeywordPopSpark t0={125.865} t1={127.533} text="AI ENGINEERING" color={AI_YELLOW} spark={{ word: 'ENGINEERING', t: 127.1 }} />
    {/* [KT-HEADLINE] THE DOOR IS OPEN ON "door" (127.80), held to 130.40 */}
    <HeadlinePop t0={127.8} t1={130.4} lines={['THE DOOR', 'IS OPEN']} fontSize={150} pitch={150} />
    {/* [KT-CLOSE] the subscribe bar (130.76 -> 133.69) */}
    <SubscribeBar />
  </>
);

// =====================================================================================================================
// 6. CAPTIONS (comp-build section 8 + overlays.md section 2): the running kt-caption-highlight line IS the caption on the
//    FACE windows (EDIT-PLAN [KT-CAPTION] rows, one per phrase ON its first word); the house caption track is OFF for its
//    spans. OFF over F1 (the role labels) and F5 (the versus stack), under the boxed words and the AI ENGINEERING pop.
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
/** the windows the caption line shows in (source seconds): FACE windows minus the planned OFF spans */
const CAPTION_SRC: [number, number][] = [
  [8.267, 12.367],
  [33.333, 39.967],
  [45.633, 48.68],
  [50.78, 58.1],
  [123.7, 125.865],
  [130.4, 139.533],
];
const CAPTION_OFF: [number, number][] = [[48.68, 50.78]]; // under the boxed-words card (the card carries CAN / SHOULD)
const CAPTION_LIFT: [number, number][] = [[130.76, 133.69]]; // rides above the subscribe bar
// integrity: every house caption window (AIVsMLCaptions.ts, the captions node's FACE holds) is carried by the KT line or a
// planned OFF span, so no planned caption second goes uncaptioned
for (const [a, b] of CAPTION_WINDOWS) {
  const segs = [...CAPTION_SRC, ...CAPTION_OFF].filter(([x, y]) => y > a && x < b).sort((p, q) => p[0] - q[0]);
  let cur = a;
  for (const [x, y] of segs) if (x <= cur + 0.01) cur = Math.max(cur, y);
  if (cur < b - 0.01) throw new Error(`caption window [${a}, ${b}] is not covered by the kt-caption-highlight line`);
}
const inSpans = (t: number, spans: [number, number][]) => spans.some(([a, b]) => t >= a && t < b);
const CAPS = ZCAPTIONS.map((c) => ({ tf: sh(c.t), h: c.h }));
/** the house Montserrat caption (section 8 style, verbatim), rendered only inside CAPTION_WINDOWS and outside the KT line's
 * spans: in this video the KT line carries every window, so this renders nothing (kept so a KT span change cannot
 * silently drop a caption). */
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
  const k = (t - c0.tf) * FPS;
  const s = interpolate(k, [0, 4, 9], [0.7, 1.12, 1], CL);
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 110, display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          fontFamily: "Montserrat,'Arial Black','Segoe UI',sans-serif",
          fontWeight: 900,
          fontSize: 84,
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
// 7. THE COMPOSITION
// =====================================================================================================================
export const AIVsML: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsFrame.Provider value={frame}>
      <KtClock.Provider value={{ t: unsh(frame / FPS) }}>
        <AbsoluteFill style={{ backgroundColor: 'black' }}>
          {/* the VO: the paused spine's own audio, ONCE (every picture copy of the spine is muted) */}
          <Sequence from={0} durationInFrames={SPINE_FRAMES} layout="none" name="VO">
            <Audio src={staticFile('spine.mp4')} />
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
          <CaptionLine phrases={KT_CAPTIONS} spans={CAPTION_SRC} lift={CAPTION_LIFT} />
          <HouseCaptions />
        </AbsoluteFill>
      </KtClock.Provider>
    </AbsFrame.Provider>
  );
};

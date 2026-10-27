// Inference.tsx: longform-edited `inference` ("AI Inference Explained"), 16:9 draft build (comp-builder 2026-10-26).
// Built TO the approved blueprint: media/inference/EDIT-PLAN.md (event log) + CUE-SHEET.md + TRANSITIONS.md /
// TRANSITION-PLAN.json + COVER-PLAN.json + AS-RECORDED.md + PROJECT-LOG.md Open flags. Skill: comp-build.md (self-contained).
// Public dir = media/inference/assets. NO music, NO SFX, NO watermark in this comp (§9: post-mix owns all audio; every
// [WHOOSH] / [ACCENT] row of the EDIT-PLAN is mixed by mix_music.py from the log, so the library transitions are mounted
// with their SFX off).
//
// Clock model (§2 + §3d): every cue below is a SOURCE-spine second (ALL.d.desilenced.mp4, 190.400 s). The paused spine
// (assets/spine.mp4 = spine/ALL.e.paused.mp4) carries ONE pause: the CLIP-3 splice (171.385 s, 5.1 s, 153 frames, the
// clip's own audio baked in). sh(t) = t + sum(dur of pauses with at <= t). No title cards in this video (one continuous
// bed, Mike 2026-10-25), so CARD_T is empty. The comp publishes ONE absolute clock (AbsFrame + KtClock {t = source s})
// and every cover / chart / device / spine copy reads it, never a local Sequence frame (§6a).
import React from 'react';
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, Easing } from 'remotion';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { ENGINES, getTransition, TransitionRow } from './transitions';
import {
  KtClock,
  KtWhipCut,
  KtKeywordPop,
  KtHeadlineOverBroll,
  KtSidePanel,
  ktSidePanelShift,
  KtLowerThirdBand,
  ktBandFaceLift,
  KtIconPop,
  KtSubscribeClose,
  KT_2023,
} from './effects/kinetic-text';
import { ZCAPTIONS, CAPTION_WINDOWS } from './InferenceCaptions';
import {
  QuantizationChart,
  ThinkingTokensChart,
  C3ListCard,
  IncentiveSpot,
  EngineNamesLine,
  IconToken,
  IconClock,
  IconChip,
  IconDollar,
  DISPLAY_FONT,
  ACCENT,
  ACCENT_LIGHT,
} from './InferenceCharts';

loadMontserrat('normal', { weights: ['900'], subsets: ['latin'] });

// ---------------------------------------------------------------------------------------------------- §2 time map
export const FPS = 30;
export const SPINE_SECS = 190.4; // SOURCE spine (spine/ALL.d.desilenced.mp4), the sidecar's `source`
export const PAUSE = 1.5; // sidecar pause_s (nominal: this video has no title-card pauses)
export const CARD_T: number[] = []; // no title cards (PROJECT-LOG hard constraint, TRANSITIONS.md section 1)
// spine/ALL.e.paused.json pauses[]: EVERY pause (cards + clip inserts) with its own dur
export const INSERTS = [
  { at: 171.385, dur: 5.1 },
];
const CLIP_INSERTS = [
  { at: 171.385, frames: 153, label: 'CLIP-3', src: 'clip-inserts/CLIP-3-huang-inference.mp4', leadIn: 'CLIP-3-STILLS-lead-in', leadOut: 'CLIP-3-STILLS-lead-out' },
];
const pausedBefore = (t: number, strict: boolean) => INSERTS.filter((p) => (strict ? p.at < t : p.at <= t)).reduce((a, p) => a + p.dur, 0);
export const sh = (t: number) => t + pausedBefore(t, false); // source -> paused-spine seconds
const shEdge = (t: number) => t + pausedBefore(t, true); // a cover's OUT edge that lands ON a pause ends before it
export const F = (t: number) => Math.round(sh(t) * FPS);
const FE = (t: number) => Math.round(shEdge(t) * FPS);
/** paused-spine frame -> SOURCE seconds (held at the pause point while a pause runs) */
export const srcT = (frame: number) => {
  const p = frame / FPS;
  let acc = 0;
  for (const x of INSERTS) {
    const s = x.at + acc;
    if (p < s) break;
    if (p < s + x.dur) return x.at;
    acc += x.dur;
  }
  return p - acc;
};
// DUR = the paused spine's own frame count (ffprobe nb_frames 5866 = 195.533 s); the formula gives 5865, the bake's
// frame-exact rounding adds one frame (asserted below so a re-bake that moves it throws)
export const DUR = 5866;
const DUR_FORMULA = Math.round((SPINE_SECS + INSERTS.reduce((a, p) => a + p.dur, 0)) * FPS);
if (Math.abs(DUR - DUR_FORMULA) > 1) throw new Error(`DUR ${DUR} vs time map ${DUR_FORMULA}`);
const insertStartFrame = (at: number) => Math.round(shEdge(at) * FPS);
for (const c of CLIP_INSERTS) if (insertStartFrame(c.at) + c.frames !== F(c.at)) throw new Error(`insert ${c.label} frames do not tile`);

// ---------------------------------------------------------------------------------------------------- the clock
const AbsFrame = React.createContext(0);
const useAbs = () => React.useContext(AbsFrame);
const useT = () => srcT(React.useContext(AbsFrame));
const CL = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const sine = Easing.inOut(Easing.sin);

// ---------------------------------------------------------------------------------------------------- §3a FACE
// assets/face-reframe.json, measured (scale capped at 1.6, centered:false), never hand-tuned
export const FACE_REFRAME = { scale: 1.6, x: -966, y: -645 };
const FACE_POINT = { x: 960, y: 432 }; // face_point_out
// AS-RECORDED / CUE-SHEET FACE windows (source s)
const FACE: [number, number][] = [
  [0.0, 6.467], [11.933, 16.9], [61.3, 66.933], [67.733, 70.267], [108.767, 113.067], [141.933, 147.7], [158.033, 164.633], [176.367, 190.4],
];
// cover -> face cut-ins: hand:kt-whip-cut (face-cut, 0.37 s), the video's face pick (TRANSITIONS.md section 3)
const FACE_IN_WHIPS = [11.933, 61.3, 67.733, 108.767, 141.933, 158.033, 176.367];
// [PUNCH-IN] ON desilencer joins (spine/jumpcuts-final.json), one per window, a hard ~15 percent step held to the cut
const PUNCH_JOINS = [2.867, 15.5, 62.733, 109.533, 161.967];
const PUNCH = 1.15;
// [LIGHTLEAK] the library leak peaking ON the same join (punch-leak rows, TRANSITION-PLAN)
const LEAKS: { tc: number; id: string }[] = [
  { tc: 2.867, id: 'lightleaks-short-6' }, // lib:lightleaks-short-6
  { tc: 15.5, id: 'lightleaks-soft-short-3' }, // lib:lightleaks-soft-short-3
  { tc: 62.733, id: 'lightleaks-short-7' }, // lib:lightleaks-short-7
  { tc: 109.533, id: 'lightleaks-7' }, // lib:lightleaks-7
  { tc: 161.967, id: 'lightleaks-short-6' }, // lib:lightleaks-short-6 (cycle restarts)
];
const BAND = { t0: 63.17, swap: 65.46 }; // kt-lower-third-band on F3 (face lifted so the head clears the band)
const DARK_PANEL = { t0: 108.9, t1: 113.067 }; // kt-side-panel DARK LEFT on F5: the face shifts RIGHT

/** the spine's picture transform at source time t (one function for the live layer AND every engine copy, §6a rule 3) */
const spineMove = (t: number) => {
  let s = 1;
  let dx = 0;
  let dy = 0;
  const w = FACE.find(([a, b]) => t >= a && t < b);
  if (t < 6.467) s *= 1 + 0.05 * clamp01(t / 6.467); // kt-signature-open: slow 5 percent push over the hook line
  if (w) for (const j of PUNCH_JOINS) if (j >= w[0] && j < w[1] && t >= j) s *= PUNCH;
  if (t >= 61.3 && t < 66.933) dy += ktBandFaceLift(t, BAND.t0, [BAND.swap]);
  if (t >= 108.767 && t < 113.067) {
    const m = ktSidePanelShift(t, DARK_PANEL.t0, { side: 'L', texture: 'dark' });
    dx += m.x;
    s *= m.scale;
  }
  return { s, dx, dy };
};

/** Show `children` at timeline frame `frame` regardless of nesting: a Sequence re-anchored so its local frame IS `frame`.
 * (Remotion 4.0.462 <Freeze> adds the parent Sequence's relativeFrom, so a Freeze of spine.mp4 inside an engine window or a
 * cover Sequence seeks the WRONG spine frame: it rendered black inside the F5 leak, QA frame 3300. This is the faithful
 * still of §6a rule 1: a fixed frame never advances.) */
const AtFrame: React.FC<{ frame: number; children: React.ReactNode }> = ({ frame, children }) => {
  const local = useCurrentFrame();
  return (
    <Sequence from={local - frame} layout="none">
      {children}
    </Sequence>
  );
};

/** The spine as it AIRS at paused-spine frame `frame`: a frame-exact freeze (AtFrame) of spine.mp4, MUTED (the VO is the root <Audio>),
 * with the SAME reframe + punch / lift / shift transform, from the SAME source (no bg-swap clips in this project). Used
 * live (frame = the composition frame) and as every SpineStill (§6a rules 1-4). */
const SpineView: React.FC<{ frame: number }> = ({ frame }) => {
  const m = spineMove(srcT(frame));
  return (
    <AbsoluteFill style={{ background: 'black', overflow: 'hidden' }}>
      <AbsoluteFill style={{ transformOrigin: `${FACE_POINT.x}px ${FACE_POINT.y}px`, transform: `translate(${m.dx}px, ${m.dy}px) scale(${m.s})` }}>
        <AtFrame frame={frame}>
          <OffthreadVideo
            src={staticFile('spine.mp4')}
            muted
            style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', transform: `translate(${FACE_REFRAME.x}px, ${FACE_REFRAME.y}px) scale(${FACE_REFRAME.scale})` }}
          />
        </AtFrame>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// the paused spine's last 3 frames (5863-5865) are blackout tail (measured YAVG 16 vs ~81): the live layer holds the last
// FACE frame over them (0.1 s) so the video ends ON the last word with picture, never a black flash (EDIT-PLAN [END])
const LAST_PICTURE_FRAME = 5862;
const SpineLayer: React.FC = () => {
  const abs = useAbs();
  const t = useT();
  let node = <SpineView frame={Math.min(abs, LAST_PICTURE_FRAME)} />;
  // hand:kt-whip-cut frame-0 signature WHIP-IN (the open variant, 0.73 s, 25 -> 0 degree roll) onto F1
  // §6a video cost trap: the whip's 8-sample shutter mounts 8 copies of the SAME spine frame per tab and the
  // OffthreadVideo proxy stalls (chunk 0-299 timed out at frame 11). Over a video side the whip runs WITHOUT the shutter
  // samples (scale + roll + lens curvature kept, one copy).
  if (t < 0.73) node = <KtWhipCut t0={0} variant="open" motionBlur={false}>{node}</KtWhipCut>;
  const w = FACE_IN_WHIPS.find((c) => t >= c && t < c + 0.37);
  if (w !== undefined) node = <KtWhipCut t0={w} motionBlur={false}>{node}</KtWhipCut>; // hand:kt-whip-cut cover -> face cut-in
  return node;
};

// ---------------------------------------------------------------------------------------------------- §4 COVERS
// One row per state / sub-point, straight from the EDIT-PLAN. `grp` = rows of one container (consecutive rows of a grp are
// STATE SWAPS: one 6 f in-place cross-fade, the ingress transition fires on the group's ENTRY only). `tr` = the group's
// ingress (TRANSITION-PLAN id in the trailing comment): whip = hand:kt-whip-cut 0.37 s, blurin = hand:kt-whip-cut
// blur-in 0.17 s, xfade = hand:xfade-scale 0.35 s (cross-fade + 0.93 -> 1), fade = hand:fade 0.5 s, lib = a library
// transition placed in LIBS, list = hand:kt-list-card, none = handed over by the clip insert. Receipts read RECEIPT_VIEW.
type Cover = {
  tIn: number;
  tOut: number;
  kind: 'vid' | 'still' | 'deck' | 'container' | 'receipt' | 'chart';
  ref: string;
  state?: string;
  grp?: string;
  tr?: 'whip' | 'blurin' | 'xfade' | 'fade' | 'lib' | 'list' | 'none';
  mo?: string;
  ps?: number; // kt-side-panel PAPER over this cover: the cover's LINEAR translate left (ktSidePanelShift paper) from ps
  lead?: boolean;
  cap?: boolean;
};
// DIAGRAM_REFS: tokenizer-split-text, tokenizer-split-split, tokenizer-split-ids, C1-rest, C1-prefill, C1-kvcache, c1-decode-spotlight-step, c1-decode-spotlight-reload, one-token-chain-start, one-token-chain-mid, one-token-chain-payoff, batching-lane-lane, batching-lane-swap, batching-lane-full, prefix-cache-rest, prefix-cache-shared, speculative-decoding-rest, speculative-decoding-draft, speculative-decoding-verify, speculative-decoding-same, engines-datacenter-rest, engines-datacenter-vllm, engines-datacenter-sglang, engines-datacenter-trtllm, engines-laptop-rest, engines-laptop-ollama, engines-laptop-llamacpp, my-pipeline-rest, my-pipeline-inference, load-once-load, load-once-run
// (end declared refs)
const COVERS: Cover[] = [
  // CH1 WHAT INFERENCE IS
  { tIn: 6.467, tOut: 9.7, kind: 'vid', ref: 'BR-1-datacenter-aisle', tr: 'blurin' }, // hand:kt-whip-cut blur-in (signature whip-out)
  { tIn: 9.7, tOut: 11.933, kind: 'container', ref: 'c2-training', state: 'training', tr: 'xfade' }, // hand:xfade-scale
  { tIn: 16.9, tOut: 18.6, kind: 'still', ref: 'IMG-1-press-flashes-server-cluster', tr: 'whip' }, // hand:kt-whip-cut (face-out)
  { tIn: 18.6, tOut: 19.64, kind: 'container', ref: 'c2-contrast', state: 'base', grp: 'c2c', tr: 'xfade' }, // hand:xfade-scale
  { tIn: 19.64, tOut: 20.34, kind: 'container', ref: 'c2-contrast-s1', state: 'the-bill', grp: 'c2c' },
  { tIn: 20.34, tOut: 21.3, kind: 'container', ref: 'c2-contrast-s2', state: 'the-latency', grp: 'c2c' },
  { tIn: 21.3, tOut: 22.4, kind: 'container', ref: 'c2-contrast-s3', state: 'the-part-you-operate', grp: 'c2c' },
  { tIn: 22.4, tOut: 25.3, kind: 'vid', ref: 'BR-2-server-leds-bokeh', tr: 'whip' }, // hand:kt-whip-cut (broll-whip)
  { tIn: 25.3, tOut: 27.6, kind: 'receipt', ref: 'C17-ibm-inference-90pct', tr: 'xfade' }, // hand:xfade-scale
  // CH2 ONE REQUEST
  { tIn: 27.6, tOut: 30.6, kind: 'vid', ref: 'BR-3-typing-laptop-dark', tr: 'whip' }, // hand:kt-whip-cut (chapter-whip)
  { tIn: 30.6, tOut: 31.46, kind: 'deck', ref: 'tokenizer-split-text', state: 'text', grp: 'tok', tr: 'xfade' }, // hand:xfade-scale
  { tIn: 31.46, tOut: 32.38, kind: 'deck', ref: 'tokenizer-split-split', state: 'split', grp: 'tok' },
  { tIn: 32.38, tOut: 33.6, kind: 'deck', ref: 'tokenizer-split-ids', state: 'ids', grp: 'tok' },
  { tIn: 33.6, tOut: 35.4, kind: 'receipt', ref: 'C8-anthropic-pricing-tokens', tr: 'xfade' }, // hand:xfade-scale
  { tIn: 35.4, tOut: 36.42, kind: 'deck', ref: 'C1-rest', state: 'rest', grp: 'c1', tr: 'lib' }, // lib:spin-corner-bounce-rb
  { tIn: 36.42, tOut: 43.62, kind: 'deck', ref: 'C1-prefill', state: 'prefill', grp: 'c1' },
  { tIn: 43.62, tOut: 44.5, kind: 'deck', ref: 'C1-kvcache', state: 'kvcache', grp: 'c1' },
  { tIn: 44.5, tOut: 46.5, kind: 'vid', ref: 'BR-4-gpu-fans', tr: 'whip' }, // hand:kt-whip-cut (broll-whip)
  { tIn: 46.5, tOut: 48.1, kind: 'container', ref: 'prefill-compute-bound', state: 'compute-bound', tr: 'xfade' }, // hand:xfade-scale
  { tIn: 48.1, tOut: 51.88, kind: 'deck', ref: 'c1-decode-spotlight-step', state: 'step', grp: 'dec', tr: 'xfade' }, // hand:xfade-scale
  { tIn: 51.88, tOut: 53.5, kind: 'deck', ref: 'c1-decode-spotlight-reload', state: 'reload', grp: 'dec' },
  { tIn: 53.5, tOut: 56.16, kind: 'deck', ref: 'one-token-chain-start', state: 'start', grp: 'chain', tr: 'lib' }, // lib:melt-equidistant-short-3
  { tIn: 56.16, tOut: 57.5, kind: 'deck', ref: 'one-token-chain-mid', state: 'mid', grp: 'chain' },
  { tIn: 57.5, tOut: 58.0, kind: 'deck', ref: 'one-token-chain-payoff', state: 'payoff', grp: 'chain' },
  { tIn: 58.0, tOut: 59.9, kind: 'vid', ref: 'BR-5-ram-macro', tr: 'whip' }, // hand:kt-whip-cut (broll-whip)
  { tIn: 59.9, tOut: 61.3, kind: 'receipt', ref: 'C13-vllm-compute-memory-bound', tr: 'xfade' }, // hand:xfade-scale
  // F3 61.3-66.933 (face)
  { tIn: 66.933, tOut: 67.733, kind: 'still', ref: 'IMG-2-four-chrome-levers', tr: 'whip' }, // hand:kt-whip-cut (CH3 chapter whip)
  // F4 67.733-70.267 (face)
  // CH3 THE LEVERS
  { tIn: 70.267, tOut: 72.0, kind: 'container', ref: 'C3', state: 'overview-item1', tr: 'list' }, // hand:kt-list-card
  { tIn: 72.0, tOut: 72.48, kind: 'deck', ref: 'batching-lane-lane', state: 'lane', grp: 'bat', tr: 'xfade' }, // hand:xfade-scale
  { tIn: 72.48, tOut: 74.86, kind: 'deck', ref: 'batching-lane-swap', state: 'swap', grp: 'bat' },
  { tIn: 74.86, tOut: 75.9, kind: 'deck', ref: 'batching-lane-full', state: 'full', grp: 'bat' },
  { tIn: 75.9, tOut: 80.2, kind: 'receipt', ref: 'C11-arxiv-pagedattention', tr: 'xfade' }, // hand:xfade-scale
  { tIn: 80.2, tOut: 81.1, kind: 'deck', ref: 'prefix-cache-rest', state: 'rest', grp: 'pfx', tr: 'xfade' }, // hand:xfade-scale
  { tIn: 81.1, tOut: 83.3, kind: 'deck', ref: 'prefix-cache-shared', state: 'shared', grp: 'pfx' },
  { tIn: 83.3, tOut: 88.6, kind: 'chart', ref: 'quantization-memory', state: 'start-mid-payoff', tr: 'lib' }, // lib:spin-corner-bounce-short-lb
  { tIn: 88.6, tOut: 90.76, kind: 'deck', ref: 'speculative-decoding-rest', state: 'rest', grp: 'spec', tr: 'xfade' }, // hand:xfade-scale
  { tIn: 90.76, tOut: 92.14, kind: 'deck', ref: 'speculative-decoding-draft', state: 'draft', grp: 'spec' },
  { tIn: 92.14, tOut: 94.16, kind: 'deck', ref: 'speculative-decoding-verify', state: 'verify', grp: 'spec' },
  { tIn: 94.16, tOut: 94.9, kind: 'deck', ref: 'speculative-decoding-same', state: 'same', grp: 'spec' },
  { tIn: 94.9, tOut: 97.9, kind: 'vid', ref: 'BR-6-server-cabinet-pushin', tr: 'whip' }, // hand:kt-whip-cut (broll-whip)
  { tIn: 97.9, tOut: 98.02, kind: 'deck', ref: 'engines-datacenter-rest', state: 'rest', grp: 'edc', tr: 'xfade' }, // hand:xfade-scale
  { tIn: 98.02, tOut: 98.88, kind: 'deck', ref: 'engines-datacenter-vllm', state: 'vllm', grp: 'edc' },
  { tIn: 98.88, tOut: 100.08, kind: 'deck', ref: 'engines-datacenter-sglang', state: 'sglang', grp: 'edc' },
  { tIn: 100.08, tOut: 101.8, kind: 'deck', ref: 'engines-datacenter-trtllm', state: 'trtllm', grp: 'edc' },
  { tIn: 101.8, tOut: 102.96, kind: 'deck', ref: 'engines-laptop-rest', state: 'rest', grp: 'elp', tr: 'lib' }, // lib:melt-equidistant-short-1
  { tIn: 102.96, tOut: 104.0, kind: 'deck', ref: 'engines-laptop-ollama', state: 'ollama', grp: 'elp' },
  { tIn: 104.0, tOut: 105.1, kind: 'deck', ref: 'engines-laptop-llamacpp', state: 'llamacpp', grp: 'elp' },
  { tIn: 105.1, tOut: 108.767, kind: 'vid', ref: 'BR-7-terminal-log-scroll', tr: 'whip', ps: 105.1 }, // hand:kt-whip-cut (broll-whip)
  // F5 108.767-113.067 (face)
  // CH4 WE DO THIS EVERY DAY
  { tIn: 113.067, tOut: 116.9, kind: 'vid', ref: 'BR-8-edit-timeline', tr: 'whip' }, // hand:kt-whip-cut (CH4 chapter whip)
  { tIn: 116.9, tOut: 118.12, kind: 'deck', ref: 'my-pipeline-rest', state: 'rest', grp: 'pipe', tr: 'xfade' }, // hand:xfade-scale
  { tIn: 118.12, tOut: 119.8, kind: 'deck', ref: 'my-pipeline-inference', state: 'inference', grp: 'pipe' },
  { tIn: 119.8, tOut: 126.0, kind: 'receipt', ref: 'C4-whisper-jobs-editor', tr: 'xfade', mo: 'motion-3d-pan-1-left' }, // hand:xfade-scale + lib:motion-3d-pan-1-left
  { tIn: 126.0, tOut: 129.3, kind: 'receipt', ref: 'C5-sweep-log-model-load', tr: 'xfade' }, // hand:xfade-scale
  { tIn: 129.3, tOut: 131.58, kind: 'deck', ref: 'load-once-load', state: 'load', grp: 'load', tr: 'xfade' }, // hand:xfade-scale
  { tIn: 131.58, tOut: 132.9, kind: 'deck', ref: 'load-once-run', state: 'run', grp: 'load' },
  { tIn: 132.9, tOut: 134.8, kind: 'still', ref: 'IMG-3-gpu-forged-hot', tr: 'lib' }, // lib:roughly-4x
  { tIn: 134.8, tOut: 137.24, kind: 'receipt', ref: 'C6-spawn-agent-editor', tr: 'whip', mo: 'motion-3d-pan-2-right' }, // hand:kt-whip-cut (cover-whip) + lib:motion-3d-pan-2-right
  { tIn: 137.24, tOut: 140.7, kind: 'receipt', ref: 'C7-agent-logs-listing', tr: 'xfade' }, // hand:xfade-scale
  { tIn: 140.7, tOut: 141.933, kind: 'still', ref: 'IMG-4-distant-datacenter-night', tr: 'lib' }, // lib:roughly-2x
  // F6 141.933-147.7 (face)
  // CH5 THE CLOSE
  { tIn: 147.7, tOut: 150.1, kind: 'vid', ref: 'BR-9-data-stream', tr: 'whip' }, // hand:kt-whip-cut (CH5 chapter whip)
  { tIn: 150.1, tOut: 154.4, kind: 'chart', ref: 'thinking-tokens', state: 'start-mid-payoff', tr: 'xfade' }, // hand:xfade-scale
  { tIn: 154.4, tOut: 156.3, kind: 'receipt', ref: 'C9-openai-reasoning-billed', tr: 'xfade' }, // hand:xfade-scale
  { tIn: 156.3, tOut: 158.033, kind: 'receipt', ref: 'C10-anthropic-thinking-tokens', tr: 'xfade' }, // hand:xfade-scale
  // F7 158.033-164.633 (face)
  { tIn: 164.633, tOut: 168.0, kind: 'container', ref: 'huang-id-card', state: 'id', tr: 'whip' }, // hand:kt-whip-cut (face-out)
  { tIn: 168.0, tOut: 171.385, kind: 'receipt', ref: 'CLIP-3-STILLS-lead-in', tr: 'xfade' }, // hand:xfade-scale (lead-in still)
  // ---- CLIP-3 spliced insert plays over the 5.1 s pause (INSERT layer; hand:fade insert-in / insert-out)
  { tIn: 171.385, tOut: 172.4, kind: 'receipt', ref: 'CLIP-3-STILLS-lead-out', tr: 'none' }, // lead-out still (resume line)
  { tIn: 172.4, tOut: 174.5, kind: 'vid', ref: 'BR-10-wafer-dies-macro', tr: 'fade' }, // hand:fade (broll-fade)
  { tIn: 174.5, tOut: 176.367, kind: 'container', ref: 'incentive-vs-engineering', state: 'right-lit', tr: 'xfade' }, // hand:xfade-scale
  // F8 176.367-190.4 (face, subscribe close, the picture ends ON the last word: hand:cut at EOF)
];

// source fps of every Envato clip: played frame-for-frame (playbackRate = 30 / fps, comp-build §11)
const VID_FPS: Record<string, number> = {
  'BR-1-datacenter-aisle': 25 / 1,
  'BR-2-server-leds-bokeh': 30 / 1,
  'BR-3-typing-laptop-dark': 30000 / 1001,
  'BR-4-gpu-fans': 30 / 1,
  'BR-5-ram-macro': 25 / 1,
  'BR-6-server-cabinet-pushin': 24 / 1,
  'BR-7-terminal-log-scroll': 24000 / 1001,
  'BR-8-edit-timeline': 25 / 1,
  'BR-9-data-stream': 25 / 1,
  'BR-10-wafer-dies-macro': 30000 / 1001,
};

// receipt camera: the visible window (capture px) eases from (cx0, cy0, width z0) to (cx1, cy1, z1) over the slot.
// hl = the highlight rows ([HIGHLIGHT]): the baked yellow band is REVEALED left to right from `t` (one line after the other).
type View = { w: number; h: number; bg: string; cx0: number; cy0: number; z0: number; cx1: number; cy1: number; z1: number; hl?: { t: number; rects: [number, number, number, number][] } };
const RECEIPT_VIEW: Record<string, View> = {
  'C17-ibm-inference-90pct': { w: 3840, h: 2400, bg: '#FFFFFF', cx0: 2110, cy0: 760, z0: 2000, cx1: 2110, cy1: 700, z1: 1720, hl: { t: 25.4, rects: [[1536, 634, 1256, 62], [1374, 694, 1210, 60]] } },
  'C8-anthropic-pricing-tokens': { w: 1824, h: 640, bg: '#FCFCFB', cx0: 820, cy0: 320, z0: 1680, cx1: 720, cy1: 320, z1: 1400 },
  'C13-vllm-compute-memory-bound': { w: 3840, h: 1860, bg: '#FFFFFF', cx0: 1920, cy0: 560, z0: 1900, cx1: 1880, cy1: 500, z1: 1680, hl: { t: 60.56, rects: [[1320, 458, 834, 54]] } },
  'C11-arxiv-pagedattention': { w: 1300, h: 696, bg: '#FFFFFF', cx0: 650, cy0: 360, z0: 1300, cx1: 600, cy1: 300, z1: 1140, hl: { t: 79.3, rects: [[74, 605, 458, 37]] } },
  'C4-whisper-jobs-editor': { w: 3840, h: 2160, bg: '#FFFFFF', cx0: 1920, cy0: 1080, z0: 3840, cx1: 1920, cy1: 1080, z1: 3840 },
  'C5-sweep-log-model-load': { w: 3840, h: 2160, bg: '#FBFBFD', cx0: 1920, cy0: 1080, z0: 3840, cx1: 1460, cy1: 760, z1: 2700 },
  'C6-spawn-agent-editor': { w: 3840, h: 2160, bg: '#FFFFFF', cx0: 1920, cy0: 1080, z0: 3840, cx1: 1920, cy1: 1080, z1: 3840 },
  'C7-agent-logs-listing': { w: 3840, h: 2160, bg: '#FFFFFF', cx0: 1920, cy0: 1080, z0: 3840, cx1: 1750, cy1: 1000, z1: 3500 },
  'C9-openai-reasoning-billed': { w: 3840, h: 2800, bg: '#FFFFFF', cx0: 1900, cy0: 1440, z0: 2300, cx1: 1880, cy1: 1400, z1: 1950, hl: { t: 155.0, rects: [[1124, 1364, 1494, 40], [1124, 1404, 184, 34]] } },
  'C10-anthropic-thinking-tokens': { w: 1824, h: 854, bg: '#FCFCFB', cx0: 912, cy0: 427, z0: 1824, cx1: 912, cy1: 427, z1: 1600 },
  'CLIP-3-STILLS-lead-in': { w: 1920, h: 1080, bg: '#000000', cx0: 960, cy0: 540, z0: 1860, cx1: 960, cy1: 540, z1: 1920 }, // settles OUT to 1.0 = the clip's first frame at the insert-in,
  'CLIP-3-STILLS-lead-out': { w: 1920, h: 1080, bg: '#000000', cx0: 960, cy0: 540, z0: 1920, cx1: 960, cy1: 540, z1: 1880 },
};
const HL_LINE = 0.45; // seconds per highlighted line

const ReceiptView: React.FC<{ c: Cover; still?: boolean }> = ({ c, still }) => {
  const t = useT();
  const v = RECEIPT_VIEW[c.ref];
  if (!v) throw new Error(`no RECEIPT_VIEW for ${c.ref}`);
  const u = still ? 0 : sine(clamp01((t - c.tIn) / (c.tOut - c.tIn)));
  const cx = v.cx0 + (v.cx1 - v.cx0) * u;
  const cy = v.cy0 + (v.cy1 - v.cy0) * u;
  const z = v.z0 + (v.z1 - v.z0) * u;
  const k = 1920 / z;
  const src = staticFile('receipts/' + c.ref + '.png');
  const greys = (v.hl?.rects ?? []).map(([x, y, w, h], i) => {
    const rev = clamp01((t - v.hl!.t - i * HL_LINE) / HL_LINE);
    if (rev >= 1) return null;
    const left = x + w * rev;
    return (
      <Img
        key={i}
        src={src}
        style={{ position: 'absolute', left: 0, top: 0, width: v.w, height: v.h, filter: 'grayscale(1) brightness(1.17)', clipPath: `inset(${y}px ${v.w - (x + w)}px ${v.h - (y + h)}px ${left}px)` }}
      />
    );
  });
  return (
    <AbsoluteFill style={{ background: v.bg, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 960 - cx * k, top: 540 - cy * k, width: v.w, height: v.h, transformOrigin: '0 0', transform: `scale(${k})` }}>
        <Img src={src} style={{ position: 'absolute', left: 0, top: 0, width: v.w, height: v.h }} />
        {greys}
      </div>
    </AbsoluteFill>
  );
};

/** lib MOTION move wrapping ONE receipt for its whole slot (§6 MOTION): the engine's 5 s move fitted to the slot, its
 * clock set with AtFrame (the frame-exact freeze); the receipt inside reads the absolute clock. */
const MotionWrap: React.FC<{ c: Cover; children: () => React.ReactNode }> = ({ c, children }) => {
  const t = useT();
  const row = getTransition(c.mo!) as TransitionRow;
  const Engine = ENGINES[row.engine] as React.FC<any>;
  const n = Math.round(row.durationSeconds * FPS);
  const f = Math.min(n - 1, Math.max(0, Math.round(((t - c.tIn) / (c.tOut - c.tIn)) * (n - 1))));
  return (
    <AbsoluteFill style={{ background: '#0b0d12' }}>
      <AtFrame frame={f}>
        <Engine from={children()} outClip={children} durationInFrames={n} params={row.params} sfxSrc={null} />
      </AtFrame>
    </AbsoluteFill>
  );
};

type Group = { rows: Cover[]; tIn: number; tOut: number; tr: Cover['tr']; key: string };
const GROUPS: Group[] = [];
for (const c of COVERS) {
  const last = GROUPS[GROUPS.length - 1];
  if (c.grp && last && last.rows[0].grp === c.grp && Math.abs(last.tOut - c.tIn) < 1e-6) {
    last.rows.push(c);
    last.tOut = c.tOut;
  } else GROUPS.push({ rows: [c], tIn: c.tIn, tOut: c.tOut, tr: c.tr ?? 'whip', key: c.grp ?? c.ref });
}
const G = (ref: string) => {
  const g = GROUPS.find((x) => x.rows.some((r) => r.ref === ref));
  if (!g) throw new Error(`no cover group with ${ref}`);
  return g;
};
// 7a: a Type 2 / container still never sits dead still: a gentle continuous push across the group (<= 3 percent so edge
// titles never clip). Groups on either side of a MELT are held flat so the melt's still frames match what airs.
const NO_PUSH = new Set(['dec', 'chain', 'edc', 'elp']);
const SWAP = 0.2; // the 6 f in-place state swap

const rowBody = (c: Cover, g: Group): React.ReactNode => {
  switch (c.kind) {
    case 'deck':
      return <Img src={staticFile('diagrams/' + c.ref + '.png')} style={{ width: 1920, height: 1080 }} />;
    case 'container':
      return <Img src={staticFile('card-slides/' + c.ref + '.png')} style={{ width: 1920, height: 1080 }} />;
    default:
      return null;
  }
};

/** what a cover group shows at the current (absolute) time, WITHOUT its ingress move: the single source of truth used
 * by the cover track AND handed to library engines as their outgoing / incoming scene */
const GroupBody: React.FC<{ g: Group }> = ({ g }) => {
  const t = useT();
  const c0 = g.rows[0];
  // vid / still / receipt / chart groups are single-row
  if (c0.kind === 'vid') {
    const fps = VID_FPS[c0.ref];
    if (!fps) throw new Error(`no VID_FPS for ${c0.ref}`);
    const sx = c0.ps !== undefined ? ktSidePanelShift(t, c0.ps, { texture: 'paper' }).x : 0;
    return (
      <AbsoluteFill style={{ background: 'black', transform: `translateX(${sx}px)` }}>
        <OffthreadVideo src={staticFile('vid/' + c0.ref + '.mp4')} muted playbackRate={30 / fps} style={{ width: 1920, height: 1080, objectFit: 'cover' }} />
      </AbsoluteFill>
    );
  }
  if (c0.kind === 'still') {
    const u = clamp01((t - c0.tIn) / (c0.tOut - c0.tIn));
    return (
      <AbsoluteFill style={{ background: 'black', overflow: 'hidden' }}>
        <Img src={staticFile('img/' + c0.ref + '.png')} style={{ width: 1920, height: 1080, objectFit: 'cover', transform: `scale(${1.02 + 0.05 * u})` }} />
      </AbsoluteFill>
    );
  }
  if (c0.kind === 'receipt') {
    if (c0.mo) return <MotionWrap c={c0}>{() => <ReceiptView c={c0} />}</MotionWrap>;
    return <ReceiptView c={c0} />;
  }
  if (c0.kind === 'chart') {
    return <ChartFor c={c0} t={t} />;
  }
  if (c0.ref === 'C3') {
    // hand:kt-list-card: the card slides in over the F4 face's last frame (a faithful SpineStill, §6a)
    return <C3ListCard t={t} fps={FPS} underlay={<SpineView frame={FE(70.267) - 1} />} />;
  }
  // deck / container groups: state rows with in-place swaps
  let i = g.rows.findIndex((r) => t >= r.tIn && t < r.tOut);
  if (i < 0) i = t < g.tIn ? 0 : g.rows.length - 1;
  const r = g.rows[i];
  const push = NO_PUSH.has(c0.grp ?? '') ? 1 : 1 + 0.03 * sine(clamp01((t - g.tIn) / (g.tOut - g.tIn)));
  const swapU = i > 0 ? clamp01((t - r.tIn) / SWAP) : 1;
  return (
    <AbsoluteFill style={{ background: '#F3F1EC', overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        {swapU < 1 && <AbsoluteFill>{rowBody(g.rows[i - 1], g)}</AbsoluteFill>}
        <AbsoluteFill style={{ opacity: swapU }}>{rowBody(r, g)}</AbsoluteFill>
        {r.ref === 'incentive-vs-engineering' && <IncentiveSpot t={t} t0={176.14} fps={FPS} />}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** §7 REAL animated charts (lint_animated_charts routes) */
const ChartFor: React.FC<{ c: Cover; t: number }> = ({ c, t }) => {
  if (c.ref === 'quantization-memory') return <QuantizationChart t={t} />;
  if (c.ref === 'thinking-tokens') return <ThinkingTokensChart t={t} />;
  throw new Error(`chart ${c.ref} has no animated component`);
};

// §6a CUTFRAME: the exact first frame of a clip, handed to a copy-heavy engine instead of the live video
const CUTFRAME: Record<string, string> = {
  'BR-1-datacenter-aisle': 'transitions/cutframes/BR-1-datacenter-aisle.jpg',
};

const ingressFrames = (g?: Group) => (!g ? 0 : g.tr === 'xfade' ? Math.round(0.35 * FPS) : g.tr === 'fade' ? Math.round(0.5 * FPS) : 0);

const CoverGroup: React.FC<{ g: Group }> = ({ g }) => {
  const t = useT();
  const body = <GroupBody g={g} />;
  const isVid = g.rows[0].kind === 'vid';
  if (g.tr === 'whip') return <KtWhipCut t0={g.tIn} motionBlur={!isVid}>{body}</KtWhipCut>;
  if (g.tr === 'blurin') {
    // the blur-in mounts 6 copies (wrap x RGB split): hand it the clip's CUTFRAME still for its 0.17 s window (§6a)
    const still = CUTFRAME[g.rows[0].ref];
    const inWin = t < g.tIn + 0.17;
    const node = inWin && still ? <Img src={staticFile(still)} style={{ width: 1920, height: 1080, objectFit: 'cover' }} /> : body;
    return <KtWhipCut t0={g.tIn} variant="blur-in">{node}</KtWhipCut>;
  }
  if (g.tr === 'xfade') {
    const u = clamp01((t - g.tIn) / 0.35);
    const e = Easing.out(Easing.cubic)(u);
    return <AbsoluteFill style={{ opacity: u, transform: `scale(${0.93 + 0.07 * e})` }}>{body}</AbsoluteFill>;
  }
  if (g.tr === 'fade') return <AbsoluteFill style={{ opacity: clamp01((t - g.tIn) / 0.5) }}>{body}</AbsoluteFill>;
  return body;
};

const CoverLayer: React.FC = () => (
  <>
    {GROUPS.map((g, i) => {
      const from = F(g.tIn);
      const next = GROUPS[i + 1];
      const contiguous = next && Math.abs(next.tIn - g.tOut) < 1e-6;
      const tail = contiguous ? ingressFrames(next) : 0; // the outgoing group stays under the incoming cross-fade
      const dur = FE(g.tOut) - from + tail;
      return (
        <Sequence key={i} from={from} durationInFrames={dur} name={`cover ${g.key}`}>
          <CoverGroup g={g} />
        </Sequence>
      );
    })}
  </>
);

// ---------------------------------------------------------------------------------------------------- §3d CLIP INSERT
// CLIP-3 plays FULL-FRAME and MUTED over its paused window (its voice is in the VO track); hand:fade insert-in (0.5 s,
// over the lead-in still = the clip's first frame) and hand:fade insert-out (0.5 s, onto the lead-out still = its last).
const InsertLayer: React.FC = () => (
  <>
    {CLIP_INSERTS.map((c) => {
      const from = insertStartFrame(c.at);
      const fadeF = Math.round(0.5 * FPS);
      const leadIn = G(c.leadIn).rows[0];
      return (
        <Sequence key={c.label} from={from} durationInFrames={c.frames} name={`insert ${c.label}`}>
          <InsertBody c={c} fadeF={fadeF} leadIn={leadIn} />
        </Sequence>
      );
    })}
  </>
);
const InsertBody: React.FC<{ c: (typeof CLIP_INSERTS)[number]; fadeF: number; leadIn: Cover }> = ({ c, fadeF, leadIn }) => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, fadeF, c.frames - fadeF, c.frames - 1], [0, 1, 1, 0], CL);
  const leadOut = G(c.leadOut).rows[0];
  return (
    <AbsoluteFill style={{ background: 'black' }}>
      {f < fadeF && <ReceiptView c={{ ...leadIn, tIn: leadIn.tIn, tOut: leadIn.tOut }} />}
      {f >= c.frames - fadeF && <ReceiptView c={leadOut} still />}
      <AbsoluteFill style={{ opacity: op }}>
        <OffthreadVideo src={staticFile(c.src)} muted style={{ width: 1920, height: 1080 }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------- LIBRARY transitions
// §6a: each engine gets a Sequence of EXACTLY its window, placed so the engine's own cut lands ON the planned tc; both
// sides are the live scene nodes (absolute clock), the face side a faithful SpineView. SFX off (post-mix).
const cutFrameOf = (row: TransitionRow, win: number) => {
  const p = row.params as any;
  if (row.engine === 'GlitchRoughly') return Math.round(p.cut * FPS);
  if (row.engine === 'PerspectiveEase') return Math.round(p.outPhase.win[0] * FPS);
  return Math.ceil(p.cut * (win - 1)); // LightLeaks / MeltEquidistant: progress frame / (win - 1) >= cut
};
type Lib = { tc: number; id: string; out: () => React.ReactNode; inn: () => React.ReactNode; fromSrc?: string; toSrc?: string };
const SpineLive: React.FC = () => <SpineView frame={useAbs()} />;
const LIBS: Lib[] = [
  ...LEAKS.map((l) => ({ tc: l.tc, id: l.id, out: () => <SpineLive />, inn: () => <SpineLive /> })),
  { tc: 35.4, id: 'spin-corner-bounce-rb', out: () => <GroupBody g={G('C8-anthropic-pricing-tokens')} />, inn: () => <GroupBody g={G('C1-rest')} /> }, // lib:spin-corner-bounce-rb
  { tc: 53.5, id: 'melt-equidistant-short-3', out: () => null, inn: () => null, fromSrc: 'diagrams/c1-decode-spotlight-reload.png', toSrc: 'diagrams/one-token-chain-start.png' }, // lib:melt-equidistant-short-3
  { tc: 83.3, id: 'spin-corner-bounce-short-lb', out: () => <GroupBody g={G('prefix-cache-shared')} />, inn: () => <GroupBody g={G('quantization-memory')} /> }, // lib:spin-corner-bounce-short-lb
  { tc: 101.8, id: 'melt-equidistant-short-1', out: () => null, inn: () => null, fromSrc: 'diagrams/engines-datacenter-trtllm.png', toSrc: 'diagrams/engines-laptop-rest.png' }, // lib:melt-equidistant-short-1
  { tc: 132.9, id: 'roughly-4x', out: () => <GroupBody g={G('load-once-run')} />, inn: () => <GroupBody g={G('IMG-3-gpu-forged-hot')} /> }, // lib:roughly-4x
  { tc: 140.7, id: 'roughly-2x', out: () => <GroupBody g={G('C7-agent-logs-listing')} />, inn: () => <GroupBody g={G('IMG-4-distant-datacenter-night')} /> }, // lib:roughly-2x
];
// TRANSITIONS.md also lists lib:motion-3d-pan-1-left / lib:motion-3d-pan-2-right: wired as MotionWrap on C4 / C6 (COVERS `mo`).

const LibLayer: React.FC = () => (
  <>
    {LIBS.map((l) => {
      const row = getTransition(l.id);
      if (!row) throw new Error(`unknown transition ${l.id}`);
      const Engine = ENGINES[row.engine] as React.FC<any>;
      const win = Math.round(row.durationSeconds * FPS);
      const from = F(l.tc) - cutFrameOf(row, win);
      return (
        <Sequence key={l.id + l.tc} from={from} durationInFrames={win} name={`lib ${l.id} @${l.tc}`}>
          <Engine from={l.out()} to={l.inn()} outClip={l.fromSrc ? undefined : l.out} inClip={l.toSrc ? undefined : l.inn} fromSrc={l.fromSrc} toSrc={l.toSrc} durationInFrames={win} params={row.params} sfxSrc={null} />
        </Sequence>
      );
    })}
  </>
);

// ---------------------------------------------------------------------------------------------------- KINETIC TEXT
// EFFECTS library kinetic-text-2023 devices ([KT-*] rows), shared engines, house look: Playfair Display 900 (the house
// display font), cyan accent; the punch words keep the device's red. Above the covers, below the captions. Sounds: post-mix.
const KTF = { font: DISPLAY_FONT, fontWeight: 900, fontStyle: 'normal' as const };
const PAPER = 'effects/paper-crumpled.mp4';
const TEXTURE = 'effects/animated-texture.mp4';
const KtLayer: React.FC = () => {
  const t = useT();
  return (
    <>
      {/* kt-signature-open: label A 'TRAINING' ON "trained" 1.98, label B 'INFERENCE' stacked below ON "inference" 6.10 */}
      <KtKeywordPop {...KTF} t0={1.98} t1={6.467} lines={['*TRAINING*']} x={1600} y={390} fontSize={80} accent={ACCENT} />
      <KtKeywordPop {...KTF} t0={6.1} t1={6.467} lines={['*INFERENCE*']} x={1600} y={495} fontSize={80} accent={ACCENT} />
      {/* kt-headline-over-broll 'TRAINED ONCE' 0.8 s after the BR-1 cut */}
      <KtHeadlineOverBroll {...KTF} t0={7.267} t1={9.7} lines={['TRAINED *ONCE*']} fontSize={170} linePitch={170} accent={ACCENT} />
      {/* kt-keyword-pop PUNCH red 'EVERY REQUEST' ON "every" 15.80 */}
      <KtKeywordPop {...KTF} t0={15.8} t1={16.9} variant="punch-red" lines={['EVERY REQUEST']} y={850} fontSize={150} linePitch={150} />
      {/* kt-headline-over-broll 'UP TO 90%' ON "90" 24.36 */}
      <KtHeadlineOverBroll {...KTF} t0={24.36} t1={25.3} lines={['UP TO *90%*']} fontSize={210} linePitch={210} accent={ACCENT} />
      {/* kt-side-panel PAPER RIGHT 'TOKEN IDS / BILLED PER TOKEN' + TOKEN icon (panel-up) */}
      <KtSidePanel {...KTF} t0={32.38} t1={33.6} texture="paper" side="R" paperSrc={staticFile(PAPER)} lines={['TOKEN IDS', 'BILLED PER TOKEN']} labelColor={ACCENT_LIGHT} fontSize={64} linePitch={80} icon={<IconToken />} iconPreset="panel-up" />
      {/* kt-icon-pop CLOCK on the F3 cut-in (beside the head: the measured reframe puts the chin at y ~740 and the captions
          on the chest, so the 2023 chest box would sit on his face; see report deviations) */}
      <KtIconPop t0={61.3} t1={66.933} icon={<IconClock />} preset="gauge-right" x={1700} y={290} w={200} h={200} />
      {/* kt-lower-third-band F3 + text_swap */}
      <KtLowerThirdBand {...KTF} t0={BAND.t0} t1={66.933} lines={['TIME TO FIRST TOKEN', '= *PREFILL*']} swaps={[{ t: BAND.swap, lines: ['TIME PER OUTPUT TOKEN', '= *DECODE*'] }]} textureSrc={staticFile(TEXTURE)} accent={ACCENT} fontSize={62} linePitch={78} />
      {/* kt-keyword-pop '4 LEVERS' ON "four" 68.26 */}
      <KtKeywordPop {...KTF} t0={68.26} t1={70.267} lines={['*4* LEVERS']} fontSize={120} linePitch={120} accent={ACCENT} />
      {/* kt-headline-over-broll two-line 'THE INFERENCE ENGINE' + the five engine names ON "engine" 96.68 */}
      <KtHeadlineOverBroll {...KTF} t0={96.68} t1={97.9} lines={['*THE INFERENCE ENGINE*']} y={470} fontSize={120} linePitch={120} accent={ACCENT} />
      <EngineNamesLine t={t} t0={96.68} t1={97.9} fps={FPS} text="vLLM · SGLang · TensorRT-LLM · Ollama · llama.cpp" y={600} fontSize={52} shadow={KT_2023.shadow} />
      {/* kt-side-panel PAPER RIGHT 'HOSTED / PAY PER TOKEN / THEIR GPU' with the BR-7 cut (C16 state 1) */}
      <KtSidePanel {...KTF} t0={105.1} t1={108.767} texture="paper" side="R" paperSrc={staticFile(PAPER)} lines={['HOSTED', 'PAY PER TOKEN', 'THEIR GPU']} labelColor={ACCENT_LIGHT} fontSize={64} linePitch={80} />
      {/* kt-side-panel DARK LEFT 'SELF-HOSTED ...' ON "Self-hosted" 108.90 (C16 state 2), the face shifts RIGHT */}
      <KtSidePanel {...KTF} t0={DARK_PANEL.t0} t1={DARK_PANEL.t1} texture="dark" side="L" textureSrc={staticFile(TEXTURE)} lines={['*SELF-HOSTED*', 'PAY FOR THE GPU', 'YOUR MODEL,', 'YOUR ENGINE']} accent={ACCENT} fontSize={58} linePitch={78} />
      {/* kt-side-panel PAPER RIGHT 'SELF-HOSTED / WHISPER MEDIUM / MY OWN GPU' + CHIP icon (panel-right) with the C4 cut */}
      <KtSidePanel {...KTF} t0={119.8} t1={126.0} texture="paper" side="R" paperSrc={staticFile(PAPER)} lines={['SELF-HOSTED', 'WHISPER MEDIUM', 'MY OWN GPU']} labelColor={ACCENT_LIGHT} fontSize={64} linePitch={80} />
      <KtIconPop t0={119.8} t1={126.0} icon={<IconChip />} preset="panel-right" y={850} w={190} h={190} />
      {/* kt-side-panel PAPER RIGHT 'HOSTED / CLAUDE, BILLED PER TOKEN' + DOLLAR icon (panel-up) with the C7 cut */}
      <KtSidePanel {...KTF} t0={137.24} t1={140.7} texture="paper" side="R" paperSrc={staticFile(PAPER)} lines={['HOSTED', 'CLAUDE, BILLED', 'PER TOKEN']} labelColor={ACCENT_LIGHT} fontSize={64} linePitch={80} />
      <KtIconPop t0={137.24} t1={140.7} icon={<IconDollar />} preset="panel-up" y={850} w={190} h={190} />
      {/* kt-keyword-pop PUNCH white 'NEVER TRAINED A MODEL' ON "never" 142.42, held through F6 */}
      <KtKeywordPop {...KTF} t0={142.42} t1={147.7} variant="punch-white" lines={['NEVER TRAINED', 'A MODEL']} y={930} fontSize={108} linePitch={118} seed={3} />
      {/* kt-headline-over-broll '2026' ON "2026" 148.56 */}
      <KtHeadlineOverBroll {...KTF} t0={148.56} t1={150.1} lines={['*2026*']} accent={ACCENT} />
      {/* kt-keyword-pop PUNCH red 'LANDS ON INFERENCE' ON "inference" 164.04 */}
      <KtKeywordPop {...KTF} t0={164.04} t1={164.633} variant="punch-red" lines={['LANDS ON', 'INFERENCE']} y={860} fontSize={120} linePitch={125} />
      {/* kt-subscribe-close: SUBSCRIBE on the chest ON "subscribe" 177.46, arrow 1 ON "right" 180.24, arrow 2 ON "playlist" 187.62 */}
      <KtSubscribeClose t0={177.46} t1={187.62} arrowT={180.24} buttonSrc={staticFile('effects/subscribe-button-alt.mp4')} arrowSrc={staticFile('effects/arrow-red.png')} />
      <KtSubscribeClose t0={187.62} t1={190.5} arrowT={187.62} arrowSide="left" buttonSrc={staticFile('effects/subscribe-button-alt.mp4')} arrowSrc={staticFile('effects/arrow-red.png')} />
    </>
  );
};

// ---------------------------------------------------------------------------------------------------- §8 CAPTIONS
// Generated (InferenceCaptions.ts, build_captions.py montserrat 2/4): rendered ONLY inside CAPTION_WINDOWS (the FACE
// holds) and OFF for the hold of every pop / band / button in the caption zone (EDIT-PLAN [CAPTION] rows).
const CAPTION_SRC: [number, number][] = [[0.0, 6.467], [61.3, 66.933], [141.933, 147.7], [158.033, 164.633], [176.367, 190.4]];
if (JSON.stringify(CAPTION_SRC) !== JSON.stringify(CAPTION_WINDOWS)) throw new Error('CAPTION_SRC drifted from InferenceCaptions.CAPTION_WINDOWS');
const CAPTION_OFF: [number, number][] = [
  [1.98, 6.467], // TRAINING / INFERENCE labels hold
  [63.17, 66.933], // the lower-third band
  [141.933, 147.7], // NEVER TRAINED A MODEL holds the whole F6 window
  [164.04, 164.633], // LANDS ON INFERENCE
  [177.46, 180.24], // the SUBSCRIBE button on the chest
];
const Captions: React.FC = () => {
  const t = useT();
  if (!CAPTION_WINDOWS.some(([a, b]) => t >= a && t < b)) return null;
  if (CAPTION_OFF.some(([a, b]) => t >= a && t < b)) return null;
  let cur: { t: number; h: string } | null = null;
  for (const c of ZCAPTIONS) {
    if (c.t <= t + 1e-6) cur = c;
    else break;
  }
  if (!cur) return null;
  const nextT = (ZCAPTIONS.find((c) => c.t > cur!.t) || { t: Infinity }).t;
  if (t >= Math.min(nextT, cur.t + 1.3)) return null;
  const d = t - cur.t;
  const s = interpolate(d, [0, 0.08, 0.16], [0.7, 1.12, 1], CL);
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 92 }}>
      <div
        style={{
          fontFamily: "Montserrat,'Arial Black','Segoe UI',sans-serif",
          fontWeight: 900,
          fontSize: 92,
          textTransform: 'lowercase',
          color: '#FFFFFF',
          WebkitTextStroke: '12px #000',
          paintOrder: 'stroke fill',
          transform: `scale(${s})`,
          whiteSpace: 'nowrap',
          lineHeight: 1.1,
        }}
      >
        {cur.h}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------- the comp
export const Inference: React.FC = () => {
  const frame = useCurrentFrame();
  const t = srcT(frame);
  return (
    <AbsFrame.Provider value={frame}>
      <KtClock.Provider value={{ t }}>
        <AbsoluteFill style={{ background: 'black' }}>
          {/* the VO: the paused spine's own audio (cards none, the CLIP-3 voice baked in the pause) */}
          <Audio src={staticFile('spine.mp4')} />
          <SpineLayer />
          <CoverLayer />
          <InsertLayer />
          <LibLayer />
          <KtLayer />
          <Captions />
        </AbsoluteFill>
      </KtClock.Provider>
    </AbsFrame.Provider>
  );
};

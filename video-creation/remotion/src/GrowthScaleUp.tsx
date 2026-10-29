// GrowthScaleUp.tsx: longform-edited comp for media/growth-scale-up ("How a Growth Engineer Scales Up using AI").
// Built TO the approved blueprint (EDIT-PLAN.md event log, CUE-SHEET.md, TRANSITION-PLAN.json, COVER-PLAN.json,
// AS-RECORDED.md, PROJECT-LOG Open flags) per skills/comp-build/comp-build.md. No music, no SFX, no watermark: the
// kinetic-text sounds + the carved bed are the ffmpeg post-mix (mix_music.py reads them off EDIT-PLAN.md).
// Imports: packages, the shared ./transitions + ./effects/kinetic-text engines, and this project's own files only.
//
// DIAGRAM_REFS: C1-split-diagram-strategy, C1-split-diagram-execution, C1-split-diagram-analysis, C3-experiment-loop-diagram-mine, C3-experiment-loop-diagram-backlog, C3-experiment-loop-diagram-plan, C3-experiment-loop-diagram-variants, C3-experiment-loop-diagram-readout, C3-experiment-loop-diagram-human
// TRANSITIONS_WAIVED: melt-rgb-short-3 — TRANSITIONS.md open question only (MELT = 0); Mike's GATE blueprint ruling: no melt, the face pick stays at 103.267
// (end declared refs)
import React, { useContext } from 'react';
import { AbsoluteFill, Freeze, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, Easing } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Montserrat';
import { TransitionClip } from './transitions/TransitionClip';
import { ENGINES, framesForRow, getTransition } from './transitions';
import {
  KtClock,
  KtWhipCut,
  KtSidePanel,
  KtKeywordPop,
  KtHeadlineOverBroll,
  KtWordByWord,
  KtLowerThirdBand,
  KtIconPop,
  KtSubscribeClose,
  KtScatterWords,
  ktSidePanelShift,
  ktBandFaceLift,
  easeInfluence325,
  KT_LIST,
} from './effects/kinetic-text';
import { ZCAPTIONS, CAPTION_WINDOWS } from './GrowthScaleUpCaptions';
import {
  SEAT_A,
  SEAT_B,
  SEAT_A_LIGHT,
  OnePersonIcon,
  FivePeopleIcon,
  CalendarIcon,
  AgentIcon,
  FunnelIcon,
  LifebuoyIcon,
  SeatTag,
} from './GrowthScaleUpIcons';

loadFont('normal', { weights: ['900'], subsets: ['latin'] });
loadFont('italic', { weights: ['800'], subsets: ['latin'] });

// ───────────────────────────── timing (§2): spine/ALL.f.paused.json ─────────────────────────────
// pauses[] is EMPTY (no card ON by Mike's one-bed ruling, no clip insert, no beat pause): sh() is the identity.
export const FPS = 30;
export const PAUSE = 1.5; // the sidecar's pause_s (unused: no pauses)
export const CARD_T: number[] = [];
export const INSERTS: { at: number; dur: number }[] = [];
export const SPINE_SECS = 229.715; // spine/ALL.e.desilenced.mp4 (the SOURCE spine)
const sh = (t: number) => t + INSERTS.filter((p) => p.at <= t).reduce((s, p) => s + p.dur, 0);
const F = (t: number) => Math.round(sh(t) * FPS);
export const DUR = Math.ceil((SPINE_SECS + INSERTS.reduce((s, p) => s + p.dur, 0)) * FPS);

// ───────────────────────────── face reframe (§3a, measured: assets/face-reframe.json) ─────────────────────────────
export const FACE_REFRAME = { scale: 1.515, x: -553, y: -553 };
const FACE_POINT = { x: 960, y: 432 }; // face_point_out
// PROJECT-LOG 2026-10-27 (Mike): "Welcome to the AI world" 10.933-13.0, arms raised, NO punch and no reframe zoom, both
// hands in frame. The looser crop = the smallest zoom that still pushes the 88 px pillar bars out of frame
// (active_area 88..1839 x 2..1078 in face-reframe.json -> scale 1.1, x in [-102.9, -96.8]).
const LOOSE_REFRAME = { scale: 1.1, x: -100, y: -105 };

const FACE_WINDOWS: [number, number][] = [
  [0.0, 13.0], [23.4, 35.367], [68.133, 73.833], [99.6, 103.267], [120.7, 125.567], [138.567, 142.633], [158.367, 161.867], [216.933, 229.715],
];
// [PUNCH-IN] steps, each ON a spine/jumpcuts-final.json join (hard ~15% step, alternating in / back out in a window)
const PUNCH: [number, number][] = [
  [2.533, 1.15], [6.9, 1.0], // F1 (10.933: leak only, no punch, Mike)
  [24.633, 1.15], [31.4, 1.0], // F2
  [70.967, 1.15], // F3
  [123.133, 1.15], // F5
  [139.767, 1.15], // F6
  [159.333, 1.15], [161.367, 1.0], // F7 (step back out)
  [218.067, 1.15], [220.833, 1.0], [228.9, 1.15], // F8
];
// [LIGHTLEAK] on the joins (TRANSITION-PLAN face_leak_set, role punch-leak, engine LightLeaks, screen blend under the captions)
const LEAKS: { t: number; id: string }[] = [
  { t: 2.533, id: 'lightleaks-soft-short-1' }, // plan: lib:lightleaks-soft-short-1
  { t: 6.9, id: 'lightleaks-soft-short-2' }, // plan: lib:lightleaks-soft-short-2
  { t: 10.933, id: 'lightleaks-soft-short-4' }, // plan: lib:lightleaks-soft-short-4 (signature-open part 2 hard cut, hand:cut)
  { t: 24.633, id: 'lightleaks-soft-short-5' }, // plan: lib:lightleaks-soft-short-5
  { t: 31.4, id: 'lightleaks-soft-short-1' }, // plan: lib:lightleaks-soft-short-1
  { t: 70.967, id: 'lightleaks-soft-short-2' }, // plan: lib:lightleaks-soft-short-2
  { t: 123.133, id: 'lightleaks-soft-short-4' }, // plan: lib:lightleaks-soft-short-4
  { t: 139.767, id: 'lightleaks-soft-short-5' }, // plan: lib:lightleaks-soft-short-5
  { t: 159.333, id: 'lightleaks-soft-short-1' }, // plan: lib:lightleaks-soft-short-1
  { t: 161.367, id: 'lightleaks-soft-short-2' }, // plan: lib:lightleaks-soft-short-2
  { t: 218.067, id: 'lightleaks-soft-short-4' }, // plan: lib:lightleaks-soft-short-4
  { t: 220.833, id: 'lightleaks-soft-short-5' }, // plan: lib:lightleaks-soft-short-5
  { t: 228.9, id: 'lightleaks-soft-short-1' }, // plan: lib:lightleaks-soft-short-1
];
// [KT-BAND] lower-third bands over a face (the face lifts per ktBandFaceLift)
const BANDS = [
  { t0: 28.35, t1: 31.4, lines: ['LIST THE *WORK YOU HATE*'], swaps: [{ t: 31.14, lines: ['HIRE A *JUNIOR*'] }] },
  { t0: 123.01, t1: 125.567, lines: ['THE 1:1 =', '*JUDGMENT TRANSFER*'], swaps: [{ t: 124.96, lines: ['NOT A', '*STATUS UPDATE*'] }] },
];

const EPS = 0.001;
type Xf = { r: { scale: number; x: number; y: number }; punch: number; lift: number };
const spineXf = (t: number): Xf => {
  const w = FACE_WINDOWS.find(([a, b]) => t >= a - 0.5 && t < b + 0.5);
  let punch = 1;
  if (w) for (const [j, s] of PUNCH) if (j >= w[0] - 0.5 && j <= t + EPS) punch = s;
  let lift = 0;
  for (const b of BANDS) if (t + EPS >= b.t0 && t < b.t1) lift = ktBandFaceLift(t + EPS, b.t0, b.swaps.map((s) => s.t));
  const loose = t + EPS >= 10.933 && t < 13.4;
  return { r: loose ? LOOSE_REFRAME : FACE_REFRAME, punch, lift };
};

// ───────────────────────────── the absolute clock (§6a) ─────────────────────────────
const AbsFrame = React.createContext(0);
const useAbs = () => useContext(AbsFrame);

/** The spine picture with the live layer's exact transform (reframe + punch about FACE_POINT + band lift). */
const SpinePicture: React.FC<{ xf: Xf; children: React.ReactNode }> = ({ xf, children }) => (
  <AbsoluteFill style={{ overflow: 'hidden', background: 'black' }}>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transformOrigin: `${FACE_POINT.x}px ${FACE_POINT.y}px`,
        transform: `translateY(${xf.lift}px) scale(${xf.punch})`,
      }}
    >
      {children}
    </div>
  </AbsoluteFill>
);
const spineStyle = (xf: Xf): React.CSSProperties => ({
  position: 'absolute',
  left: 0,
  top: 0,
  width: 1920,
  height: 1080,
  transformOrigin: '0 0',
  transform: `translate(${xf.r.x}px, ${xf.r.y}px) scale(${xf.r.scale})`,
});

/** The spine frozen on ONE absolute frame, muted, same transform. The zero-offset <Sequence> is load-bearing: Remotion's
 * <Freeze> (4.0.462) sets the timeline to frame + the PARENT Sequence's from, and a timeline past the last frame is
 * clamped, so straight under a Sequence that starts late (a face whip at 120.7) it froze on frame (DUR - 1 - from): a
 * blacked cover frame (2:00.7, 2:18.6) or a face from another minute (2:38.4, 3:36.9). Draft v1 QA, 2026-10-28. */
const SpineFrozen: React.FC<{ at: number }> = ({ at }) => {
  const xf = spineXf(at / FPS);
  return (
    <SpinePicture xf={xf}>
      <Sequence from={0} layout="none">
        <Freeze frame={at}>
          <OffthreadVideo src={staticFile('spine.mp4')} muted style={spineStyle(xf)} />
        </Freeze>
      </Sequence>
    </SpinePicture>
  );
};

/** §6a SpineStill: a real <Freeze> of what AIRS at the absolute frame, muted, same transform, same source (spine.mp4;
 * no face-swap clip on this video). Read off the ABSOLUTE clock, so it stays correct in any engine nesting. */
const SpineStill: React.FC = () => <SpineFrozen at={useAbs()} />;

/** The live spine: the ONE audible layer (the VO). */
const SpineLive: React.FC = () => {
  const f = useCurrentFrame();
  const xf = spineXf(f / FPS);
  return (
    <SpinePicture xf={xf}>
      <OffthreadVideo src={staticFile('spine.mp4')} style={spineStyle(xf)} />
    </SpinePicture>
  );
};

// ───────────────────────────── COVERS (§4) ─────────────────────────────
// tr = the INGRESS transition (plan id in the trailing comment). Consecutive same-container rows are STATE SWAPS (tr 'none').
type Tr = 'whip' | 'whipBlur' | 'cut' | 'xfade' | 'slide' | 'spin' | 'none';
type Cover = {
  tIn: number;
  tOut: number;
  kind: 'vid' | 'container' | 'deck' | 'receipt';
  ref: string;
  state?: string;
  tr: Tr;
  lead?: boolean;
  cap?: boolean;
  mo?: string;
};
export const COVERS: Cover[] = [
  // CH1
  { tIn: 13.0, tOut: 16.5, kind: 'vid', ref: 'BR-1-solo-night-desk', tr: 'whipBlur' }, // F1 out: hand:kt-whip-cut (face-cut 0.37 s, blur-in variant)
  { tIn: 16.5, tOut: 18.6, kind: 'vid', ref: 'BR-2-chat-windows-monitors', tr: 'cut' }, // hand:cut (broll-cut)
  { tIn: 18.6, tOut: 23.4, kind: 'vid', ref: 'BR-3-team-table-pushin', tr: 'whip', lead: true }, // hand:kt-whip-cut (broll-whip); lead ruled at GATE plan
  // CH2
  { tIn: 35.367, tOut: 39.36, kind: 'vid', ref: 'BR-4-sticky-notes-glass', tr: 'whip' }, // F2 out: hand:kt-whip-cut (face-cut)
  { tIn: 39.36, tOut: 46.1, kind: 'container', ref: 'K1-better-move-card', state: 'one-point', tr: 'xfade' }, // hand:xfade-scale (container-xfade)
  { tIn: 46.1, tOut: 52.34, kind: 'container', ref: 'C2-agents-take-list-s1', state: 'item1', tr: 'slide' }, // hand:kt-list-card (container-slide); item 1 masked to 50.20
  { tIn: 52.34, tOut: 53.78, kind: 'container', ref: 'C2-agents-take-list-s2', state: 'item2', tr: 'none' },
  { tIn: 53.78, tOut: 55.46, kind: 'container', ref: 'C2-agents-take-list-s3', state: 'item3', tr: 'none' },
  { tIn: 55.46, tOut: 56.98, kind: 'container', ref: 'C2-agents-take-list-s4', state: 'item4', tr: 'none' },
  { tIn: 56.98, tOut: 57.92, kind: 'container', ref: 'C2-agents-take-list-s5', state: 'item5', tr: 'none' },
  { tIn: 57.92, tOut: 59.0, kind: 'container', ref: 'C2-agents-take-list-s6', state: 'item6', tr: 'none' },
  { tIn: 59.0, tOut: 63.0, kind: 'vid', ref: 'BR-5-team-laptops', tr: 'whip' }, // hand:kt-whip-cut (cover-whip)
  { tIn: 63.0, tOut: 68.133, kind: 'container', ref: 'K2-hire-into-impact-card', state: 'one-point', tr: 'xfade' }, // hand:xfade-scale
  // CH3
  { tIn: 73.833, tOut: 81.58, kind: 'deck', ref: 'C1-split-diagram-strategy', state: 'strategy', tr: 'whip' }, // F3 out: hand:kt-whip-cut (face-cut); no melt (gate)
  { tIn: 81.58, tOut: 86.12, kind: 'deck', ref: 'C1-split-diagram-execution', state: 'execution', tr: 'none' },
  { tIn: 86.12, tOut: 90.5, kind: 'deck', ref: 'C1-split-diagram-analysis', state: 'analysis', tr: 'none' },
  { tIn: 90.5, tOut: 95.9, kind: 'container', ref: 'K3-anti-pattern-card', state: 'one-point', tr: 'xfade' }, // hand:xfade-scale
  { tIn: 95.9, tOut: 99.6, kind: 'vid', ref: 'BR-6-document-laptop', tr: 'whip' }, // hand:kt-whip-cut (cover-whip)
  { tIn: 103.267, tOut: 105.72, kind: 'container', ref: 'C1-seats-row-s1', state: 'seat-one', tr: 'whip' }, // F4 out: hand:kt-whip-cut
  { tIn: 105.72, tOut: 112.4, kind: 'container', ref: 'C1-seats-row-s2', state: 'seat-five', tr: 'none' },
  // CH4
  { tIn: 112.4, tOut: 116.1, kind: 'vid', ref: 'BR-7-one-on-one', tr: 'whip' }, // hand:kt-whip-cut (chapter-whip)
  { tIn: 116.1, tOut: 120.7, kind: 'receipt', ref: 'C6-statsig-ai-experiment-summary', tr: 'cut' }, // hand:kt-side-panel (receipt-panel): paper panel slides over
  { tIn: 125.567, tOut: 129.4, kind: 'vid', ref: 'BR-8-whiteboard-pointing', tr: 'whip' }, // F5 out: hand:kt-whip-cut
  { tIn: 129.4, tOut: 132.5, kind: 'vid', ref: 'BR-9-present-back', tr: 'cut' }, // hand:cut (broll-cut)
  { tIn: 132.5, tOut: 135.2, kind: 'container', ref: 'L1-principles-list-s1', state: 'item1', tr: 'slide' }, // hand:kt-list-card; item 1 masked to 134.16
  { tIn: 135.2, tOut: 136.98, kind: 'container', ref: 'L1-principles-list-s2', state: 'item2', tr: 'none' },
  { tIn: 136.98, tOut: 138.567, kind: 'container', ref: 'L1-principles-list-s3', state: 'item3', tr: 'none' },
  { tIn: 142.633, tOut: 151.1, kind: 'receipt', ref: 'C14-agents-folder-29-definitions', tr: 'whip', mo: 'motion-3d-pan-1-down' }, // F6 out: hand:kt-whip-cut; [MOTION] lib:motion-3d-pan-1-down
  { tIn: 151.1, tOut: 154.2, kind: 'receipt', ref: 'C14b-claude-md-5-hitl-gates', tr: 'xfade' }, // hand:xfade-scale (container-xfade) + [HIGHLIGHT]
  { tIn: 154.2, tOut: 158.367, kind: 'vid', ref: 'BR-10-team-shared-screen', tr: 'whip', lead: true }, // hand:kt-whip-cut (cover-whip); lead ruled at GATE plan
  // CH5
  { tIn: 161.867, tOut: 164.1, kind: 'container', ref: 'L2-plays-list-s1', state: 'item1', tr: 'slide' }, // F7 out: hand:kt-list-card (face-cut 0.40 s); item 1 masked to 163.06
  { tIn: 164.1, tOut: 167.92, kind: 'deck', ref: 'C3-experiment-loop-diagram-mine', state: 'mine', tr: 'spin' }, // lib:spin-corner-swinging-short-rb (SPIN-newfacet)
  { tIn: 167.92, tOut: 168.64, kind: 'deck', ref: 'C3-experiment-loop-diagram-backlog', state: 'backlog', tr: 'none' },
  { tIn: 168.64, tOut: 170.18, kind: 'deck', ref: 'C3-experiment-loop-diagram-plan', state: 'plan', tr: 'none' },
  { tIn: 170.18, tOut: 171.9, kind: 'deck', ref: 'C3-experiment-loop-diagram-variants', state: 'variants', tr: 'none' },
  { tIn: 171.9, tOut: 172.34, kind: 'deck', ref: 'C3-experiment-loop-diagram-readout', state: 'readout', tr: 'none' },
  { tIn: 172.34, tOut: 174.8, kind: 'deck', ref: 'C3-experiment-loop-diagram-human', state: 'human', tr: 'none' },
  { tIn: 174.8, tOut: 179.0, kind: 'receipt', ref: 'C15-evan-miller-sample-size', tr: 'cut' }, // hand:kt-side-panel (receipt-panel)
  { tIn: 179.0, tOut: 179.92, kind: 'container', ref: 'L2-plays-list-s1', state: 'item1', tr: 'cut' }, // hand:cut (container-cut), declared callback: back to the card as it was left
  { tIn: 179.92, tOut: 180.9, kind: 'container', ref: 'L2-plays-list-s2', state: 'item2', tr: 'none' }, // item 2 CHURN AGENT ON "churn" (179.92, the ting)
  { tIn: 180.9, tOut: 184.1, kind: 'receipt', ref: 'C11-amplitude-predictive-cohorts', tr: 'whip' }, // hand:kt-whip-cut (cover-whip) + [HIGHLIGHT]
  { tIn: 184.1, tOut: 186.9, kind: 'receipt', ref: 'C12-stripe-smart-retries', tr: 'whip', mo: 'motion-3d-offset-2-right-up' }, // hand:kt-whip-cut; [MOTION] lib:motion-3d-offset-2-right-up
  { tIn: 186.9, tOut: 188.38, kind: 'container', ref: 'CHURN-agent-panel-s1', state: 'drafts', tr: 'xfade' }, // hand:xfade-scale
  { tIn: 188.38, tOut: 190.6, kind: 'container', ref: 'CHURN-agent-panel-s2', state: 'you-own', tr: 'none' },
  { tIn: 190.6, tOut: 191.74, kind: 'container', ref: 'L2-plays-list-s2', state: 'item2', tr: 'cut' }, // hand:cut (container-cut), declared callback: back to the card as it was left
  { tIn: 191.74, tOut: 192.9, kind: 'container', ref: 'L2-plays-list-s3', state: 'item3', tr: 'none' }, // item 3 MONDAY DIGEST ON "Monday" (191.74, the ting)
  { tIn: 192.9, tOut: 196.9, kind: 'vid', ref: 'BR-11-analytics-dashboard', tr: 'whip' }, // hand:kt-whip-cut (cover-whip)
  { tIn: 196.9, tOut: 199.96, kind: 'container', ref: 'L2-plays-list-s3', state: 'three-hover', tr: 'cut' }, // hand:cut (container-cut)
  { tIn: 199.96, tOut: 201.6, kind: 'container', ref: 'L2-plays-list-s4', state: 'item4', tr: 'none' },
  { tIn: 201.6, tOut: 204.0, kind: 'vid', ref: 'BR-12-screen-wall', tr: 'whip' }, // hand:kt-whip-cut (cover-whip)
  { tIn: 204.0, tOut: 210.5, kind: 'receipt', ref: 'C13-google-scaled-content-abuse', tr: 'cut' }, // hand:kt-side-panel (receipt-panel) + [HIGHLIGHT]
  { tIn: 210.5, tOut: 210.72, kind: 'container', ref: 'L2-plays-list-s4', state: 'all-four', tr: 'cut' }, // hand:cut (container-cut)
  { tIn: 210.72, tOut: 212.88, kind: 'container', ref: 'L2-plays-list-s5', state: 'seat-one', tr: 'none' },
  { tIn: 212.88, tOut: 216.933, kind: 'container', ref: 'L2-plays-list-s6', state: 'full', tr: 'none' },
  // F8 to the end: hand:cut (face-cut 0.00 s) at 229.715, the video ends ON the last word
];

// caption windows (literal copy of GrowthScaleUpCaptions.ts CAPTION_WINDOWS for lint_covers; asserted equal below)
const CAPTION_SRC: [number, number][] = [[0.0, 13.0], [23.4, 35.367], [68.133, 73.833], [216.933, 229.715]];
if (JSON.stringify(CAPTION_SRC) !== JSON.stringify(CAPTION_WINDOWS)) throw new Error('CAPTION_SRC drifted from GrowthScaleUpCaptions.ts');
// captions OFF under the kinetic-text holds (EDIT-PLAN [CAPTION] rows)
const CAPTION_OFF: [number, number][] = [
  [3.48, 13.0], // signature-open labels + WELCOME pop
  [24.34, 31.4], // THE FORK pop + the band
  [32.86, 35.367], // ZERO / LEVERAGE verdict
  [71.62, 73.833], // scatter words
  [217.06, 222.74], // word-by-word + JUDGMENT payoff
  [222.74, 224.907], // the subscribe button
  [228.94, 229.715], // the arrow
];

// clip fps (24 / 25 fps clips play frame-for-frame: playbackRate = 30 / fps, comp-build §11)
const VID_FPS: Record<string, number> = {
  'BR-1-solo-night-desk': 25,
  'BR-2-chat-windows-monitors': 25,
  'BR-3-team-table-pushin': 23.976,
  'BR-4-sticky-notes-glass': 29.97,
  'BR-5-team-laptops': 25,
  'BR-6-document-laptop': 25,
  'BR-7-one-on-one': 25,
  'BR-8-whiteboard-pointing': 24,
  'BR-9-present-back': 29.97,
  'BR-10-team-shared-screen': 25,
  'BR-11-analytics-dashboard': 30,
  'BR-12-screen-wall': 24,
};

// dark side panels over b-roll (the b-roll reframes into the free side: ktSidePanelShift)
const DARK_PANELS = [
  { t0: 13.0, t1: 18.6, side: 'R' as const, accent: SEAT_A, lines: ['*TEAM OF ONE*', 'STRATEGIST', 'EXECUTOR · LEADER', 'YOUR AGENTS', 'ARE THE TEAM'], icon: 'one' as const },
  { t0: 18.6, t1: 23.4, side: 'L' as const, accent: SEAT_B, lines: ['*TEAM OF FIVE*', 'PLAYER-COACH', 'EVERY REPORT', 'RUNS AGENTS'], icon: 'five' as const },
  { t0: 154.2, t1: 158.367, side: 'L' as const, accent: SEAT_B, lines: ['*TEAM OF FIVE*', 'ONE DOC', 'PEOPLE AND AGENTS', 'ALIGNED'], icon: 'five' as const },
];

// ───────────────────────────── receipts (views in CAPTURE px; box 'left' = the free side beside a paper panel) ─────────────────────────────
type View = { box: 'full' | 'left'; cx0: number; cy0: number; s0: number; cx1: number; cy1: number; s1: number };
const RECEIPT_SIZE: Record<string, [number, number]> = {
  'C6-statsig-ai-experiment-summary': [3840, 2160],
  'C14-agents-folder-29-definitions': [3840, 2160],
  'C14b-claude-md-5-hitl-gates': [3840, 2160],
  'C15-evan-miller-sample-size': [1760, 990],
  'C11-amplitude-predictive-cohorts': [3840, 2160],
  'C12-stripe-smart-retries': [3840, 2400],
  'C13-google-scaled-content-abuse': [3840, 2600],
};
const RECEIPT_BG: Record<string, string> = { 'C14-agents-folder-29-definitions': '#1e1e1e', 'C14b-claude-md-5-hitl-gates': '#1e1e1e' };
const VIEWS: Record<string, View> = {
  // treatment push: settling push toward the 'make a ship recommendation' paragraph; the view's top edge holds at capture
  // y ~430, just under the page's H1 (y 290-415), so the title is never sliced (draft v1 QA)
  'C6-statsig-ai-experiment-summary': { box: 'left', cx0: 2290, cy0: 1430, s0: 0.54, cx1: 2290, cy1: 1360, s1: 0.58 },
  // treatment pan: Motion3D wraps the whole capture
  'C14-agents-folder-29-definitions': { box: 'left', cx0: 1500, cy0: 700, s0: 0.62, cx1: 1500, cy1: 700, s1: 0.62 },
  // treatment highlight: settling push, then the wipe on '5 HITL gates'
  'C14b-claude-md-5-hitl-gates': { box: 'left', cx0: 2900, cy0: 1060, s0: 0.6, cx1: 3100, cy1: 1050, s1: 0.7 },
  // treatment push to the 1,030 figure (the site's own number, never retyped)
  'C15-evan-miller-sample-size': { box: 'left', cx0: 880, cy0: 520, s0: 0.54, cx1: 900, cy1: 640, s1: 0.74 },
  // treatment highlight
  'C11-amplitude-predictive-cohorts': { box: 'left', cx0: 1940, cy0: 1120, s0: 0.47, cx1: 1945, cy1: 1180, s1: 0.5 },
  // treatment pan: Motion3D over the Smart Retries section
  'C12-stripe-smart-retries': { box: 'full', cx0: 1930, cy0: 1650, s0: 1.1, cx1: 1930, cy1: 1650, s1: 1.1 },
  // treatment highlight
  'C13-google-scaled-content-abuse': { box: 'left', cx0: 1935, cy0: 760, s0: 0.47, cx1: 1935, cy1: 720, s1: 0.5 },
};
// [HIGHLIGHT] #ffe14d wipes in CAPTURE coordinates (ride the push), multiply on light pages
const HIGHLIGHTS: Record<string, { t: number; rects: [number, number, number, number][] }> = {
  'C14b-claude-md-5-hitl-gates': { t: 151.6, rects: [[2898, 1012, 3312, 1090]] }, // '5 HITL gates'
  'C11-amplitude-predictive-cohorts': { t: 182.7, rects: [[2366, 1152, 2716, 1200], [1180, 1204, 1690, 1252]] }, // 'forecast who is likely to / convert, churn, or take an action.'
  'C13-google-scaled-content-abuse': { t: 206.02, rects: [[2782, 650, 2900, 700], [922, 700, 1164, 748]] }, // 'no matter / how it's created'
};
const HL_WIPE = 0.35;

// list-card item 1 masked until its word (gate ruling: no slide rebuild): copy the next EMPTY slot (one pitch down) over
// slot 1 and relabel its number. Rects in frame px, measured on the PNGs.
const MASKS: Record<string, { until: number; rect: [number, number, number, number]; pitch: number; num: [number, number, number, number] }> = {
  'C2-agents-take-list-s1': { until: 50.2, rect: [210, 295, 736, 218], pitch: 217, num: [246, 386, 50, 38] },
  'L1-principles-list-s1': { until: 134.16, rect: [210, 324, 1502, 158], pitch: 162, num: [246, 384, 50, 36] },
  'L2-plays-list-s1': { until: 163.06, rect: [210, 243, 1502, 158], pitch: 162, num: [246, 306, 50, 36] },
};

const fill: React.CSSProperties = { position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, objectFit: 'cover' };

const VidCover: React.FC<{ c: Cover; noBlurClock?: boolean }> = ({ c }) => {
  const abs = useAbs();
  const t = abs / FPS;
  const p = DARK_PANELS.find((d) => t + EPS >= d.t0 && t < d.t1);
  const s = p ? ktSidePanelShift(t + EPS, p.t0, { side: p.side, texture: 'dark' }) : { x: 0, scale: 1 };
  const rate = 30 / (VID_FPS[c.ref] ?? 30);
  return (
    <AbsoluteFill style={{ background: 'black', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, transform: `translateX(${s.x}px) scale(${s.scale})` }}>
        <OffthreadVideo src={staticFile(`vid/${c.ref}.mp4`)} muted playbackRate={rate} style={fill} />
      </div>
    </AbsoluteFill>
  );
};

const MaskSlot: React.FC<{ png: string; m: (typeof MASKS)[string] }> = ({ png, m }) => {
  const [x, y, w, h] = m.rect;
  const [nx, ny, nw, nh] = m.num;
  const bg = (bx: number, by: number): React.CSSProperties => ({
    backgroundImage: `url(${png})`,
    backgroundSize: '1920px 1080px',
    backgroundPosition: `${-bx}px ${-by}px`,
  });
  return (
    <>
      <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, ...bg(x, y + m.pitch) }} />
      {/* the copied slot's own number, wiped with blank slot fill and relabelled 01 */}
      <div style={{ position: 'absolute', left: nx, top: ny, width: nw, height: nh, ...bg(nx + 90, ny + m.pitch) }} />
      <div
        style={{
          position: 'absolute',
          left: nx,
          top: ny,
          width: nw,
          height: nh,
          display: 'flex',
          alignItems: 'center',
          fontFamily: "'JetBrains Mono', 'Consolas', monospace",
          fontWeight: 600,
          fontSize: 30,
          color: '#6f7683',
        }}
      >
        01
      </div>
    </>
  );
};

const ContainerCover: React.FC<{ c: Cover }> = ({ c }) => {
  const t = useAbs() / FPS;
  const png = staticFile(`card-slides/${c.ref}.png`);
  const m = MASKS[c.ref];
  return (
    <AbsoluteFill style={{ background: '#f1efe9' }}>
      <Img src={png} style={fill} />
      {m && t + EPS < m.until && <MaskSlot png={png} m={m} />}
    </AbsoluteFill>
  );
};

// §7a: a system-design still never sits dead still: a gentle push (<= 4%, edge titles stay in) across the WHOLE diagram
const DIAGRAM_SPAN: Record<string, [number, number]> = { C1: [73.833, 90.5], C3: [164.1, 174.8] };
const DeckCover: React.FC<{ c: Cover }> = ({ c }) => {
  const t = useAbs() / FPS;
  const [a, b] = DIAGRAM_SPAN[c.ref.slice(0, 2)];
  const s = interpolate(t, [a, b], [1.0, 1.035], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.sin) });
  return (
    <AbsoluteFill style={{ background: '#f1efe9', overflow: 'hidden' }}>
      <Img src={staticFile(`diagrams/${c.ref}.png`)} style={{ ...fill, transform: `scale(${s})`, transformOrigin: '50% 55%' }} />
    </AbsoluteFill>
  );
};

const ReceiptView: React.FC<{ c: Cover; still?: boolean }> = ({ c, still }) => {
  const t = useAbs() / FPS;
  const v = VIEWS[c.ref];
  const [W, H] = RECEIPT_SIZE[c.ref];
  const u = still ? 0 : interpolate(t, [c.tIn, c.tOut], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const cx = v.cx0 + (v.cx1 - v.cx0) * u;
  const cy = v.cy0 + (v.cy1 - v.cy0) * u;
  const s = v.s0 + (v.s1 - v.s0) * u;
  const box = v.box === 'left' ? { x: 0, y: 0, w: 947, h: 1080 } : { x: 0, y: 0, w: 1920, h: 1080 };
  const left = box.x + box.w / 2 - cx * s;
  const top = box.y + box.h / 2 - cy * s;
  const hl = HIGHLIGHTS[c.ref];
  const dark = !!RECEIPT_BG[c.ref];
  return (
    <AbsoluteFill style={{ background: RECEIPT_BG[c.ref] ?? '#ffffff', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left, top, width: W, height: H, transformOrigin: '0 0', transform: `scale(${s})` }}>
        <Img src={staticFile(`receipts/${c.ref}.png`)} style={{ position: 'absolute', left: 0, top: 0, width: W, height: H }} />
        {hl &&
          hl.rects.map(([x0, y0, x1, y1], i) => {
            // the rects wipe one after another, left to right, from the word's onset
            const per = HL_WIPE / hl.rects.length;
            const p = interpolate(t, [hl.t + i * per, hl.t + (i + 1) * per], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            if (p <= 0) return null;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: x0,
                  top: y0,
                  width: (x1 - x0) * p,
                  height: y1 - y0,
                  background: dark ? 'rgba(255,225,77,0.42)' : '#ffe14d',
                  mixBlendMode: dark ? 'normal' : 'multiply',
                  borderRadius: 6,
                }}
              />
            );
          })}
      </div>
    </AbsoluteFill>
  );
};

/** [MOTION] a library camera move wrapping ONE receipt for its whole slot: the engine's 5 s clock fitted to the slot. */
const MotionWrap: React.FC<{ id: string; c: Cover }> = ({ id, c }) => {
  const abs = useAbs();
  const row = getTransition(id)!;
  const Engine = ENGINES[row.engine] as React.FC<any>;
  const total = framesForRow(row, FPS);
  const slot = F(c.tOut) - F(c.tIn);
  const ff = Math.min(total - 1, Math.max(0, Math.round(((abs - F(c.tIn)) * total) / slot)));
  const node = () => <ReceiptView c={c} still />;
  return (
    <AbsoluteFill style={{ background: RECEIPT_BG[c.ref] ?? '#0d1117' }}>
      <Freeze frame={ff}>
        <Engine from={node()} outClip={node} durationInFrames={total} params={row.params} />
      </Freeze>
    </AbsoluteFill>
  );
};

const CoverEl: React.FC<{ c: Cover }> = ({ c }) => {
  switch (c.kind) {
    case 'vid':
      return <VidCover c={c} />;
    case 'container':
      return <ContainerCover c={c} />;
    case 'deck':
      return <DeckCover c={c} />;
    case 'receipt':
      return c.mo ? <MotionWrap id={c.mo} c={c} /> : <ReceiptView c={c} />;
  }
};

const XFADE = 0.35;
const SLIDE = KT_LIST.slide; // 0.5 s, the 'influence 32.5 -> 100' ease, 1714 px travel from the right
const tailFor = (i: number) => {
  const n = COVERS[i + 1];
  if (!n || Math.abs(n.tIn - COVERS[i].tOut) > 0.05) return 0;
  if (n.tr === 'xfade') return Math.round(XFADE * FPS) + 1;
  if (n.tr === 'slide') return Math.round(SLIDE * FPS) + 1;
  return 0;
};

const Ingress: React.FC<{ c: Cover; children: React.ReactNode }> = ({ c, children }) => {
  const t = useAbs() / FPS + EPS;
  const dt = t - c.tIn;
  if (c.tr === 'whip' || c.tr === 'whipBlur') {
    // video children are mounted ONCE (no 8-sample shutter) so a whip never multiplies frame fetches (§6a cost trap)
    const heavy = c.kind === 'vid' || !!c.mo;
    return (
      <KtWhipCut t0={c.tIn} variant={c.tr === 'whipBlur' ? 'blur-in' : 'default'} motionBlur={!heavy}>
        {children}
      </KtWhipCut>
    );
  }
  if (c.tr === 'xfade') {
    const u = interpolate(dt, [0, XFADE], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const e = Easing.out(Easing.cubic)(u);
    return <AbsoluteFill style={{ opacity: e, transform: `scale(${0.93 + 0.07 * e})` }}>{children}</AbsoluteFill>;
  }
  if (c.tr === 'slide') {
    const u = interpolate(dt, [0, SLIDE], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const x = KT_LIST.travel * (1 - easeInfluence325(u));
    return <AbsoluteFill style={{ transform: `translateX(${x}px)` }}>{children}</AbsoluteFill>;
  }
  return <>{children}</>;
};

const CoverTrack: React.FC = () => (
  <>
    {COVERS.map((c, i) => (
      <Sequence key={i} from={F(c.tIn)} durationInFrames={F(c.tOut) - F(c.tIn) + tailFor(i)} name={`cover ${c.ref}`}>
        <Ingress c={c}>
          <CoverEl c={c} />
        </Ingress>
      </Sequence>
    ))}
  </>
);

// the spine HELD where the live spine cannot show the face (draft v1 QA): under the F7-out list card's slide, whose
// outgoing side is the face but the cover beat blacks the spine from 161.867; and over the spine's last two frames, a
// desilencer sliver from another moment (picture only: the live spine under it stays the audible layer)
const HOLDS: { from: number; frames: number; at: number }[] = [
  { from: F(161.867), frames: Math.round(SLIDE * FPS) + 1, at: F(161.867) - 1 },
  { from: DUR - 2, frames: 2, at: DUR - 3 },
];
const SpineHolds: React.FC = () => (
  <>
    {HOLDS.map((h, i) => (
      <Sequence key={i} from={h.from} durationInFrames={h.frames} name={`spine hold ${h.at}`}>
        <SpineFrozen at={h.at} />
      </Sequence>
    ))}
  </>
);

// ───────────────────────────── transitions over the spine / between covers ─────────────────────────────
const EngineWindow: React.FC<{ id: string; t: number; outgoing: () => React.ReactNode; incoming: () => React.ReactNode }> = ({ id, t, outgoing, incoming }) => {
  const row = getTransition(id)!;
  const win = framesForRow(row, FPS);
  const half = Math.round(win / 2);
  // §6a: a Sequence of EXACTLY the engine window, cutFrame = win/2
  return (
    <Sequence from={F(t) - half} durationInFrames={win} name={`tr ${id}`}>
      <TransitionClip id={id} cutFrame={half} outgoing={outgoing} incoming={incoming} sfx={false} />
    </Sequence>
  );
};

// cover -> face cut-ins: hand:kt-whip-cut (face pick) onto the live spine (F1 opens on the 0.73 s signature-open whip)
const FACE_IN: { t: number; variant: 'open' | 'default' }[] = [
  { t: 0.0, variant: 'open' }, // hand:kt-whip-cut (face-cut, 0.73 s) kt-signature-open part 1
  { t: 23.4, variant: 'default' }, // hand:kt-whip-cut F2 (chapter whip)
  { t: 68.133, variant: 'default' }, // hand:kt-whip-cut F3
  { t: 99.6, variant: 'default' }, // hand:kt-whip-cut F4
  { t: 120.7, variant: 'default' }, // hand:kt-whip-cut F5
  { t: 138.567, variant: 'default' }, // hand:kt-whip-cut F6
  { t: 158.367, variant: 'default' }, // hand:kt-whip-cut F7
  { t: 216.933, variant: 'default' }, // hand:kt-whip-cut F8
];

const FaceWhips: React.FC = () => (
  <>
    {FACE_IN.map((w, i) => {
      const dur = w.variant === 'open' ? 0.73 : 0.37;
      return (
        <Sequence key={i} from={F(w.t)} durationInFrames={Math.ceil(dur * FPS) + 1} name={`face whip ${w.t}`}>
          <KtWhipCut t0={w.t} variant={w.variant} motionBlur={false}>
            <SpineStill />
          </KtWhipCut>
        </Sequence>
      );
    })}
  </>
);

const Leaks: React.FC = () => (
  <>
    {LEAKS.map((l, i) => (
      <EngineWindow key={i} id={l.id} t={l.t} outgoing={() => <SpineStill />} incoming={() => <SpineStill />} />
    ))}
  </>
);

const coverByRef = (ref: string) => COVERS.find((c) => c.ref === ref)!;
const Spin: React.FC = () => (
  // lib:spin-corner-swinging-short-rb (SPIN-newfacet, 0.44 s): the plays card turns away, the experiment-loop diagram turns in
  <EngineWindow
    id="spin-corner-swinging-short-rb"
    t={164.1}
    outgoing={() => <ContainerCover c={coverByRef('L2-plays-list-s1')} />}
    incoming={() => <DeckCover c={coverByRef('C3-experiment-loop-diagram-mine')} />}
  />
);

// ───────────────────────────── kinetic-text devices (EDIT-PLAN [KT-*] rows; above covers, below captions) ─────────────────────────────
const Win: React.FC<{ a: number; b: number; children: React.ReactNode }> = ({ a, b, children }) => (
  <Sequence from={Math.max(0, F(a) - 1)} durationInFrames={Math.max(1, F(b) - Math.max(0, F(a) - 1))} layout="none">
    {children}
  </Sequence>
);
const TEX = 'kt/animated-texture.mp4';
const PAPER = 'kt/paper-crumpled.mp4';
const WHITE = '#FFFFFF';
const BLUE = '#030AF4';

const seatTag = (seat: 'one' | 'five', side: 'L' | 'R', t0: number, t1: number, y = 120) => (
  <Win a={t0} b={t1}>
    <KtIconPop
      t0={t0}
      t1={t1}
      icon={<SeatTag seat={seat} />}
      x={side === 'L' ? 320 : 1600}
      y={y}
      w={520}
      h={112}
      dir={side === 'L' ? 'from-left' : 'from-right'}
      travel={900}
    />
  </Win>
);

/** the AAARRR pirate: the generated portrait (assets/kt/icon-pirate.png) in a round badge, ringed like the house icon
 * badges (GrowthScaleUpIcons blob: a 3 percent white ring). The portrait fills ~90 percent of its square, so it sits at
 * 88 percent inside the circle on its own navy (#000918, sampled) and the hat brim clears the ring. */
const PirateBadge: React.FC = () => (
  <div
    style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      overflow: 'hidden',
      border: '9px solid #ffffff',
      boxSizing: 'border-box',
      background: '#000918',
      boxShadow: '0 10px 28px rgba(0,0,0,0.55)',
    }}
  >
    <Img src={staticFile('kt/icon-pirate.png')} style={{ position: 'absolute', left: '6%', top: '6%', width: '88%', height: '88%', objectFit: 'cover' }} />
  </div>
);

const KtLayer: React.FC = () => (
  <>
    {/* CH1 signature open: labels A + B (TEAM OF / ONE in seat A, TEAM OF / FIVE in seat B), right third */}
    <Win a={3.48} b={10.933}>
      <KtKeywordPop t0={3.48} t1={10.933} lines={['TEAM OF', '*ONE*']} accent={SEAT_A} textColor={WHITE} x={1500} y={300} />
    </Win>
    <Win a={7.74} b={10.933}>
      <KtKeywordPop t0={7.74} t1={10.933} lines={['TEAM OF', '*FIVE*']} accent={SEAT_B} textColor={WHITE} x={1500} y={560} seed={2} />
    </Win>
    <Win a={11.06} b={13.0}>
      <KtKeywordPop t0={11.06} t1={13.0} lines={['WELCOME TO', 'THE AI WORLD']} accent={WHITE} y={905} />
    </Win>
    {/* dark side panels over b-roll, seat icon inside */}
    {DARK_PANELS.map((p, i) => (
      <Win key={i} a={p.t0} b={p.t1}>
        <KtSidePanel t0={p.t0} t1={p.t1} side={p.side} texture="dark" textureSrc={staticFile(TEX)} textureIn={i * 9} lines={p.lines} accent={p.accent} seed={i} fontSize={66} linePitch={76} />
        <KtIconPop
          t0={p.t0 + 0.23}
          t1={p.t1}
          icon={p.icon === 'one' ? <OnePersonIcon /> : <FivePeopleIcon />}
          x={p.side === 'R' ? 1489 : 431}
          y={190}
          w={170}
          h={170}
          dir={p.side === 'R' ? 'from-right' : 'from-left'}
          travel={700}
        />
      </Win>
    ))}
    {/* CH2 */}
    <Win a={24.34} b={28.35}>
      <KtKeywordPop t0={24.34} t1={28.35} lines={['THE FORK']} accent={WHITE} />
    </Win>
    {BANDS.map((b, i) => (
      <Win key={i} a={b.t0} b={b.t1}>
        <KtLowerThirdBand t0={b.t0} t1={b.t1} lines={b.lines} swaps={b.swaps} textureSrc={staticFile(TEX)} textureIn={20 + i * 7} accent={i === 0 ? '#FCFE40' : SEAT_A} seed={i} />
      </Win>
    ))}
    <Win a={32.86} b={35.367}>
      <KtKeywordPop t0={32.86} t1={35.367} lines={['ZERO', 'LEVERAGE']} accent={WHITE} />
    </Win>
    <Win a={36.2} b={39.36}>
      <KtHeadlineOverBroll t0={36.2} t1={39.36} lines={['LIST THE', 'HIGHEST-IMPACT WORK']} />
    </Win>
    {seatTag('five', 'L', 59.0, 63.0)}
    <Win a={59.8} b={63.0}>
      <KtHeadlineOverBroll t0={59.8} t1={63.0} lines={['HIRE INTO', 'THE HIGHEST-IMPACT WORK']} />
    </Win>
    {/* CH3 */}
    <Win a={71.62} b={73.833}>
      <KtScatterWords
        t0={71.62}
        t1={73.833}
        accent={WHITE}
        words={[
          { t: 71.62, text: 'STRATEGY', anchor: 'right-of-head' },
          { t: 72.06, text: 'EXECUTION', anchor: 'left-of-head' },
          { t: 73.04, text: 'ANALYSIS', anchor: 'chest' },
        ]}
      />
    </Win>
    {seatTag('five', 'L', 95.9, 99.6)}
    <Win a={96.7} b={99.6}>
      <KtHeadlineOverBroll t0={96.7} t1={99.6} lines={['THE LONG', 'AI-WRITTEN STRATEGY DOC']} />
    </Win>
    <Win a={102.14} b={103.267}>
      <KtKeywordPop t0={102.14} t1={103.267} variant="punch-red" lines={['NOT WHY YOU', 'HIRED THEM']} />
    </Win>
    {/* CH4 */}
    {seatTag('five', 'L', 112.4, 116.1)}
    <Win a={113.4} b={116.1}>
      <KtIconPop t0={113.4} t1={116.1} preset="gauge-right" icon={<CalendarIcon />} />
    </Win>
    <Win a={116.1} b={120.7}>
      <KtSidePanel t0={116.1} t1={120.7} texture="paper" paperSrc={staticFile(PAPER)} lines={['THE READOUT', "IS THE AGENT'S", 'JOB']} labelColor={BLUE} />
    </Win>
    <Win a={126.4} b={132.5}>
      <KtHeadlineOverBroll t0={126.4} t1={132.5} lines={['SAY IT.', 'HAVE THEM PLAY IT BACK.']} />
    </Win>
    <Win a={138.567} b={142.633}>
      <KtIconPop t0={138.567} t1={142.633} preset="chest-up" icon={<AgentIcon />} />
    </Win>
    <Win a={142.4} b={142.633}>
      <KtKeywordPop t0={142.4} t1={142.633} lines={['PUT IT IN WRITING']} accent={WHITE} />
    </Win>
    <Win a={143.0} b={154.2}>
      <KtSidePanel
        t0={143.0}
        t1={154.2}
        texture="paper"
        paperSrc={staticFile(PAPER)}
        lines={['TEAM OF ONE', '29 AGENT', 'DEFINITIONS', '5 HUMAN GATES']}
        labelColor={SEAT_A_LIGHT}
        fontSize={80}
        linePitch={86}
      />
    </Win>
    {seatTag('one', 'R', 142.633, 154.2)}
    {/* CH5 */}
    <Win a={159.18} b={161.867}>
      <KtKeywordPop t0={159.18} t1={161.867} lines={['SCALE-UP MODE']} accent={WHITE} />
    </Win>
    <Win a={174.8} b={179.0}>
      <KtSidePanel t0={174.8} t1={179.0} texture="paper" paperSrc={staticFile(PAPER)} lines={['SAME', 'SAMPLE SIZE']} labelColor={BLUE} />
    </Win>
    <Win a={180.9} b={186.9}>
      <KtSidePanel
        t0={180.9}
        t1={186.9}
        texture="paper"
        paperSrc={staticFile(PAPER)}
        lines={['CHURN AGENT', 'FLAGS · RETRIES', '· DRAFTS', 'YOU OWN', 'THE OFFER']}
        labelColor={BLUE}
        fontSize={74}
        linePitch={80}
        icon={<LifebuoyIcon />}
        iconPreset="panel-up"
      />
    </Win>
    <Win a={192.9} b={196.9}>
      <KtIconPop t0={192.9} t1={196.9} preset="gauge-right" icon={<FunnelIcon />} />
    </Win>
    {/* AAARRR (Mike at the draft gate: "a punch sfx with AAARRR on the screen in big red text ... a picture of a pirate,
        because that is from the Pirate Funnel"): the 1:42 punch-red device ON the word (194.08), caps 185 px, set lower
        (y 735) so it clears both badges; the pirate badge slides in from the LEFT opposite the funnel, held to the cut */}
    <Win a={194.08} b={195.38}>
      <KtKeywordPop t0={194.08} t1={195.38} variant="punch-red" lines={['AAARRR']} y={735} fontSize={264} linePitch={264} />
    </Win>
    <Win a={194.08} b={196.9}>
      <KtIconPop t0={194.08} t1={196.9} preset="rocket-left" w={300} h={300} icon={<PirateBadge />} />
    </Win>
    {/* the band, not a headline: white headline text over the LIGHT plays card collided with its item text (draft v1 QA);
        the band never exits, so it holds to the card's next state swap (199.96, "Play four") and leaves on that cut */}
    <Win a={197.78} b={199.96}>
      <KtLowerThirdBand t0={197.78} t1={199.96} lines={['*NO* STATUS MEETING']} textureSrc={staticFile(TEX)} textureIn={34} accent="#FCFE40" seed={2} />
    </Win>
    <Win a={204.0} b={210.5}>
      <KtSidePanel
        t0={204.0}
        t1={210.5}
        texture="paper"
        paperSrc={staticFile(PAPER)}
        lines={['VALUE TO', 'THE USER,', 'NO MATTER', "HOW IT'S MADE"]}
        labelColor={BLUE}
        fontSize={80}
        linePitch={86}
      />
    </Win>
    {seatTag('one', 'R', 210.72, 216.933, 1010)}
    {seatTag('five', 'L', 212.88, 216.933, 1010)}
    {/* CH6 close */}
    <Win a={217.06} b={222.74}>
      <KtWordByWord
        t0={217.06}
        t1={222.74}
        phrases={[
          { t: 217.06, text: 'FEWER PEOPLE' },
          { t: 218.16, text: 'HIGHER VELOCITY' },
        ]}
        payoff={{ t: 221.26, text: 'JUDGMENT' }}
        payoffColor={SEAT_A}
      />
    </Win>
    {/* kt-subscribe-close: the button grows ON 'subscribe' and holds its own 2.167 s; the red arrow pops ON 'click' */}
    <Win a={222.74} b={224.907}>
      <KtSubscribeClose t0={222.74} t1={224.907} buttonSrc={staticFile('kt/subscribe-button-alt.mp4')} arrowSrc={staticFile('kt/arrow-red.png')} />
    </Win>
    <Win a={228.94} b={229.715}>
      <KtSubscribeClose t0={228.94} t1={229.8} arrowT={228.94} arrowSide="left" buttonSrc={staticFile('kt/subscribe-button-alt.mp4')} arrowSrc={staticFile('kt/arrow-red.png')} />
    </Win>
  </>
);

// ───────────────────────────── captions (§8, Montserrat house style, FACE windows only, topmost) ─────────────────────────────
const CAPS = ZCAPTIONS.map((c) => ({ tf: sh(c.t), h: c.h }));
const Captions: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  if (!CAPTION_SRC.some(([a, b]) => t >= sh(a) && t < sh(b))) return null;
  if (CAPTION_OFF.some(([a, b]) => t + EPS >= sh(a) && t < sh(b))) return null;
  let cur: { tf: number; h: string } | null = null;
  for (const c of CAPS) {
    if (c.tf <= t + EPS) cur = c;
    else break;
  }
  if (!cur) return null;
  const nextT = (CAPS.find((c) => c.tf > cur!.tf) || { tf: Infinity }).tf;
  if (t >= Math.min(nextT, cur.tf + 1.3)) return null;
  const d = t - cur.tf;
  const s = interpolate(d, [0, 0.08, 0.16], [0.7, 1.12, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 110 }}>
      <div
        style={{
          fontFamily: "Montserrat,'Arial Black','Segoe UI',sans-serif",
          fontWeight: 900,
          fontSize: 92,
          textTransform: 'lowercase',
          color: '#ffffff',
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

// ───────────────────────────── the comp ─────────────────────────────
export const GrowthScaleUp: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsFrame.Provider value={frame}>
      <KtClock.Provider value={{ t: frame / FPS }}>
        <AbsoluteFill style={{ background: 'black' }}>
          <SpineLive />
          <SpineHolds />
          <Leaks />
          <CoverTrack />
          <Spin />
          <FaceWhips />
          <KtLayer />
          <Captions />
        </AbsoluteFill>
      </KtClock.Provider>
    </AbsFrame.Provider>
  );
};

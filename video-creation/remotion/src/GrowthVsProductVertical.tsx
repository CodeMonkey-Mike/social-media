// GrowthVsProductVertical.tsx: the VERTICAL (1080x1920) twin of GrowthVsProduct.tsx for media/growth-vs-product
// (vertical-repurpose.md sections 1b + 2; comp-build.md). comp-builder VERTICAL mode, 2026-10-23.
// - SAME spine (assets/vertical/spine.mp4 == assets/spine.mp4, byte-identical), SAME DUR / CARD_T / PAUSE / INSERTS /
//   SPINE_SECS, byte-identical COVERS beat times and transition ids, the same caption file + windows. Every table that must
//   not drift is declared literally here (the lints read them) AND asserted equal to the 16:9 export at module load.
// - Assets: the render's ONLY public dir is media/growth-vs-product/assets/vertical (lean). Every 16:9 ref resolves through
//   the explicit V_* lookup tables below: a ref with no entry THROWS when the module loads, a mapped file that is not in the
//   public dir THROWS on the first rendered frame (getStaticFiles), so a hole never renders.
// - FACE: the MEASURED portrait crop (assets/vertical/face-crop.json: mean 58.17 percent, spread 48.96-65.6). He drifts up
//   to about 13 percent of the frame width INSIDE a window, so one offset per window would leave him off centre; the crop
//   follows the measured, smoothed track in GrowthVsProductVerticalFace.ts (per-window offsets, sampled at 10 fps), which
//   puts the face centre ON x 540 of the portrait frame. Spine scale = cover (16/9), no extra zoom.
//   FACE_REFRAME_WAIVED: comp-builder 2026-10-23, the 16:9 FACE_REFRAME is a landscape transform; the vertical cut uses its own measured crop (vertical-repurpose.md 1b + face-crop.json + the measured track)
// - No music, no SFX, no watermark (the vertical lane's mix_music.py reuses the 16:9 mix on the spine's own VO).
import React from 'react';
import {
  AbsoluteFill, Easing, Freeze, Img, OffthreadVideo, Sequence, getStaticFiles, interpolate, staticFile, useCurrentFrame,
} from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { flip } from '@remotion/transitions/flip';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { TransitionClip } from './transitions/TransitionClip';
import { ENGINES, getTransition } from './transitions/registry';
import { CAPTION_WINDOWS, ZCAPTIONS } from './GrowthVsProductCaptions';
import { GvpClock, GvpStyle, RoleLabelPop, useGvp } from './GrowthVsProductCharts';
import { GvpVStyle, KtBottomPanelV, PassRateMeterChartV, SplitTestChartV } from './GrowthVsProductVerticalCharts';
import { FACE_EYE_Y_SRC, FACE_TRACK } from './GrowthVsProductVerticalFace';
import {
  BURNS, CAPTION_SRC as CAPTION_SRC_169, CARDS as CARDS_169, CARD_T as CARD_T_169, COVERS as COVERS_169, Cover,
  DUR as DUR_169, FACES, FPS as FPS_169, INSERTS as INSERTS_169, LIB_TR as LIB_TR_169, PANELS, PAUSE as PAUSE_169,
  SPINE_SECS as SPINE_SECS_169, STILL_PUSH, TURN, cardStart, sh, srcT,
} from './GrowthVsProduct';

loadMontserrat('normal', { weights: ['900'], subsets: ['latin'] });

// ---------------------------------------------------------------------------------------------------------------------
// 1. TIME MAP: identical to the 16:9 (declared literally for the lints, asserted equal to the 16:9 export).
// ---------------------------------------------------------------------------------------------------------------------
export const FPS = 30;
export const PAUSE = 1.5;                                     // sidecar pause_s
export const CARD_T = [50.36, 173.085];                       // THE SCOREBOARD · WHICH ONE? (waived exact cut)
export const INSERTS = [{ at: 50.36, dur: 1.5 }, { at: 173.085, dur: 1.5 }];
export const SPINE_SECS = 219.663;                            // SOURCE spine spine/ALL.d.desilenced.mp4
export const F = (t: number) => Math.round(sh(t) * FPS);
export const DUR = Math.round((SPINE_SECS + INSERTS.reduce((s, p) => s + p.dur, 0)) * FPS);   // 6680 = spine.mp4 frames
const same = (a: unknown, b: unknown, what: string) => {
  if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`GrowthVsProductVertical: ${what} drifted from the 16:9 GrowthVsProduct.tsx`);
};
same([FPS, PAUSE, CARD_T, INSERTS, SPINE_SECS, DUR], [FPS_169, PAUSE_169, CARD_T_169, INSERTS_169, SPINE_SECS_169, DUR_169], 'the time map');

// ---------------------------------------------------------------------------------------------------------------------
// 2. FACE: the measured portrait crop + the F1 signature open + the bottom-panel lifts (F3 / F4 / F5).
// ---------------------------------------------------------------------------------------------------------------------
const S0 = 1920 / 1080;                         // the 1920x1080 spine scaled to COVER the 1920 px portrait height
const ACTIVE_X = [88, 1840];                    // the master's live area (pillar bars outside, face-reframe.json active_area)
/** measured face centre (SOURCE px) at SOURCE time t: linear between the 0.1 s keys of the window holding t (nearest window
 * edge outside the windows: the spine is black there, and a face-edge still freezes the window's own last frame) */
const faceCxSrc = (t: number) => {
  let w = FACE_TRACK[0];
  let best = Infinity;
  for (const x of FACE_TRACK) {
    const d = t < x.a ? x.a - t : t > x.b ? t - x.b : 0;
    if (d < best) { best = d; w = x; }
  }
  const k = Math.max(0, Math.min(w.keys.length - 1, (t - w.a) / 0.1));
  const i = Math.floor(k), f = k - i;
  const b = w.keys[Math.min(w.keys.length - 1, i + 1)];
  return w.keys[i] + (b - w.keys[i]) * f;
};
/** the crop: the spine's left edge in portrait px so the face centre lands on x 540, clamped inside the live area */
const cropLeft = (t: number) => Math.max(1080 - ACTIVE_X[1] * S0, Math.min(-ACTIVE_X[0] * S0, 540 - faceCxSrc(t) * S0));
const FACE_POINT = { x: 540, y: Math.round(FACE_EYE_Y_SRC * S0) };   // the eye line after the crop (measured, 935)

const clampOpt = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const easeOut = Easing.out(Easing.cubic);
const c01 = (v: number) => Math.max(0, Math.min(1, v));

// The bottom-panel lift (portrait kt-side-panel): the face scales 1.28x about the eye line and rises 273 px so his chin
// clears the panel band (y 1180+) and the frame stays covered (bottom edge 935 + 985 * 1.28 - 273 = 1923 >= 1920).
const PANEL_S = 1.28, PANEL_DY = -273;
type Fx = { s: number; dy: number; rot: number };
const faceFx = (t: number): Fx => {
  if (t < FACES[0][1]) {
    // kt-signature-open: frame-0 kt-whip-cut IN (0.73 s, scale 200 -> 100 + a 25 -> 0 degree roll) x a slow ~5 percent push
    const e = easeOut(c01(t / 0.73));
    const rot = 25 * (1 - e);
    const r = (rot * Math.PI) / 180;
    const cover = Math.cos(r) + (1920 / 1080) * Math.sin(r);   // keep the rolled portrait frame covered
    return { s: Math.max(2 - e, cover) * (1 + 0.05 * c01(t / FACES[0][1])), dy: 0, rot };
  }
  for (const p of PANELS) {
    if (t >= p.r0 && t < p.l0) {
      const e = easeOut(c01((t - p.r0) / 0.47));
      return { s: 1 + (PANEL_S - 1) * e, dy: PANEL_DY * e, rot: 0 };
    }
    if (t >= p.l0 && t < p.end + 0.05) {
      const wz = 2 - easeOut(c01((t - p.l0) / 0.37));          // in-take kt-whip-cut (0.37 s): scale 200 -> 100
      return { s: PANEL_S * wz, dy: PANEL_DY, rot: 0 };
    }
  }
  return { s: 1, dy: 0, rot: 0 };
};

const SpineFrame: React.FC<{ fx: Fx; children: React.ReactNode }> = ({ fx, children }) => (
  <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: 'black' }}>
    <div style={{ position: 'absolute', inset: 0, transformOrigin: `${FACE_POINT.x}px ${FACE_POINT.y}px`,
      transform: `translateY(${fx.dy}px) rotate(${fx.rot}deg) scale(${fx.s})` }}>
      {children}
    </div>
  </AbsoluteFill>
);
const spineStyle = (t: number): React.CSSProperties => ({ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080,
  transformOrigin: '0 0', transform: `translateX(${cropLeft(t).toFixed(1)}px) scale(${S0})` });

/** The live spine: the comp's ONLY audio (the VO), the measured portrait crop + the face moves. */
const LiveSpine: React.FC = () => {
  const { t } = useGvp();
  return <SpineFrame fx={faceFx(t)}><OffthreadVideo src={staticFile(V('spine'))} style={spineStyle(t)} /></SpineFrame>;
};
/** SpineStill (comp-build 6a): a real Freeze, muted, the SAME crop + transform at the frozen moment, the SAME source. */
const SpineStill: React.FC<{ frame: number }> = ({ frame }) => {
  const t = srcT(frame / FPS);
  return (
    <SpineFrame fx={faceFx(t)}>
      <Freeze frame={frame}><OffthreadVideo src={staticFile(V('spine'))} muted style={spineStyle(t)} /></Freeze>
    </SpineFrame>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// 3. COVERS: BYTE-IDENTICAL to the 16:9 (copied, asserted). The 16:9 ref is the key; the portrait asset comes from V_*.
// ---------------------------------------------------------------------------------------------------------------------
const COVERS: Cover[] = [
  // CH1 TWO TITLES, ONE WORD
  { tIn: 4.733, tOut: 8.24, kind: 'container', ref: 'C2-s1-s1', state: 's1', grp: 'C2a', tr: 'whip', ff: true },          // hand:kt-whip-cut (face-cut, 0.17s) blur-in
  { tIn: 8.24, tOut: 13.32, kind: 'container', ref: 'C2-s1-s2', state: 's2', grp: 'C2a', tr: 'pop' },                       // GROWTH label pop
  { tIn: 13.32, tOut: 14.78, kind: 'container', ref: 'C2-s1-s3', state: 's3', grp: 'C2a', tr: 'xfade' },
  { tIn: 14.78, tOut: 16.4, kind: 'receipt', ref: 'C12-title-date', tr: 'xfs' },                                            // hand:xfade-scale
  { tIn: 16.4, tOut: 18.92, kind: 'receipt', ref: 'C12-pragmatic-engineer-paragraph', tr: 'xfs' },                          // C12 file 2, [HIGHLIGHT] 16.66
  { tIn: 18.92, tOut: 19.6, kind: 'container', ref: 'C2-s1b-s1', state: 's1', grp: 'C2b', tr: 'xfs' },                      // hand:xfade-scale + PRODUCT pop
  { tIn: 19.6, tOut: 20.74, kind: 'container', ref: 'C2-s1b-s2', state: 's2', grp: 'C2b', tr: 'xfade' },
  { tIn: 20.74, tOut: 21.4, kind: 'container', ref: 'C2-s2-s1', state: 's1', grp: 'C2b', tr: 'xfade' },                     // hand:xfade (container-xfade, 0.20s)
  { tIn: 21.4, tOut: 21.94, kind: 'container', ref: 'C2-s2-s2', state: 's2', grp: 'C2b', tr: 'pop' },                       // AI onto A
  { tIn: 21.94, tOut: 32.82, kind: 'container', ref: 'C2-s2-s3', state: 's3', grp: 'C2b', tr: 'pop' },                      // AI onto B
  { tIn: 32.82, tOut: 39.58, kind: 'container', ref: 'C2-s2-s4', state: 's4', grp: 'C2b', tr: 'xfade' },
  { tIn: 39.58, tOut: 40.32, kind: 'container', ref: 'C2-s2-s5', state: 's5', grp: 'C2b', tr: 'xfade' },
  { tIn: 40.32, tOut: 42.7, kind: 'receipt', ref: 'C4a-crowdstrike-title-block', mo: 'motion-3d-pan-2-right', tr: 'xfs' },  // + [MOTION] lib
  { tIn: 42.7, tOut: 45.133, kind: 'receipt', ref: 'C5a-citian-title-block', mo: 'motion-3d-orbit-1-t-left', tr: 'xfs' },   // + [MOTION] lib
  // F2 45.133-48.8 (thesis)
  { tIn: 48.8, tOut: 50.35, kind: 'container', ref: 'C2-s2-s6', state: 's6', grp: 'C2c', tr: 'xfs', ff: true },            // resumes under the F2 burn
  // CH2 THE SCOREBOARD (card at 50.36)
  { tIn: 50.36, tOut: 52.68, kind: 'vid', ref: 'BR-1-data-dashboard', cap: true, tr: 'cut' },                               // in out of the card's exit flip
  { tIn: 52.68, tOut: 55.62, kind: 'container', ref: 'scoreboard-growth-s1', state: 's1', grp: 'SB', tr: 'xfs' },
  { tIn: 55.62, tOut: 56.02, kind: 'container', ref: 'scoreboard-growth-s2', state: 's2', grp: 'SB', tr: 'xfade' },
  { tIn: 56.02, tOut: 56.7, kind: 'container', ref: 'scoreboard-growth-s3', state: 's3', grp: 'SB', tr: 'xfade' },
  { tIn: 56.7, tOut: 57.5, kind: 'container', ref: 'scoreboard-growth-s4', state: 's4', grp: 'SB', tr: 'xfade' },
  { tIn: 57.5, tOut: 58.0, kind: 'container', ref: 'scoreboard-growth-s5', state: 's5', grp: 'SB', tr: 'xfade' },
  { tIn: 58.0, tOut: 60.72, kind: 'still', ref: 'IMG-1-feature-module-gauge', tr: 'cut' },                                   // lib:glitchmonitor-2 ingress
  { tIn: 60.72, tOut: 64.84, kind: 'receipt', ref: 'C5b-citian-evals-duty', tr: 'xfs' },
  { tIn: 64.84, tOut: 70.0, kind: 'receipt', ref: 'C7a-govwell-ai-stack', tr: 'xfs' },
  { tIn: 70.0, tOut: 72.0, kind: 'vid', ref: 'BR-2-laptop-browsing', cap: true, tr: 'fade' },                                // hand:fade (broll-fade, 0.50s)
  { tIn: 72.0, tOut: 77.52, kind: 'chart', ref: 'split-test', tr: 'xfs' },                                                 // Type 1 ANIMATED, 0.97 -> 1 / 12 f
  { tIn: 77.52, tOut: 82.6, kind: 'chart', ref: 'pass-rate-meter', tr: 'xfade' },                                           // hand:xfade (container-xfade, 0.20s)
  // F3 82.6-87.0 (side panels)
  // CH3 THE CLOCK (cardless)
  { tIn: 87.0, tOut: 89.04, kind: 'vid', ref: 'BR-3-stopwatch', cap: true, tr: 'fade', ff: true },                          // under the F3 face-out burn
  { tIn: 89.04, tOut: 90.2, kind: 'container', ref: 'ship-to-learn-s1', state: 's1', grp: 'SL', tr: 'xfs' },
  { tIn: 90.2, tOut: 92.02, kind: 'container', ref: 'ship-to-learn-s2', state: 's2', grp: 'SL', tr: 'xfade' },
  { tIn: 92.02, tOut: 94.72, kind: 'container', ref: 'ship-to-learn-s3', state: 's3', grp: 'SL', tr: 'xfade' },
  { tIn: 94.72, tOut: 95.18, kind: 'container', ref: 'ship-to-learn-s4', state: 's4', grp: 'SL', tr: 'xfade' },
  { tIn: 95.18, tOut: 97.5, kind: 'deck', ref: 'loop-s1-base', state: 'base', grp: 'LOOP1', tr: 'xfs' },
  { tIn: 97.5, tOut: 99.82, kind: 'deck', ref: 'loop-s1-test-set', state: 'test-set', grp: 'LOOP1', tr: 'xfade' },
  { tIn: 99.82, tOut: 100.54, kind: 'deck', ref: 'loop-s1-gate', state: 'gate', grp: 'LOOP1', tr: 'xfade' },
  { tIn: 100.54, tOut: 103.22, kind: 'receipt', ref: 'C10-hamel-evals-root-cause', tr: 'xfs' },
  { tIn: 103.22, tOut: 105.28, kind: 'still', ref: 'IMG-2-calendar-sheets-hourglass', tr: 'cut' },                          // lib:glitchmonitor-4 ingress
  { tIn: 105.28, tOut: 108.44, kind: 'vid', ref: 'BR-4-phone-signup', cap: true, tr: 'fade' },
  { tIn: 108.44, tOut: 111.18, kind: 'deck', ref: 'aarrr-funnel-base', state: 'base', grp: 'AARRR', tr: 'xfs' },
  { tIn: 111.18, tOut: 113.18, kind: 'deck', ref: 'aarrr-funnel-within-days', state: 'within-days', grp: 'AARRR', tr: 'xfade' },
  { tIn: 113.18, tOut: 113.9, kind: 'deck', ref: 'aarrr-funnel-activation', state: 'activation', grp: 'AARRR', tr: 'xfade' },
  { tIn: 113.9, tOut: 116.44, kind: 'deck', ref: 'loop-s2-base', state: 'base', grp: 'LOOP2', tr: 'cut' },                    // lib:melt-rgb-short-4 MELT
  { tIn: 116.44, tOut: 117.68, kind: 'deck', ref: 'loop-s2-eval-pulse', state: 'eval-pulse', grp: 'LOOP2', tr: 'cut' },       // pulse: in 4 f, hold 0.6 s, out 8 f
  { tIn: 117.68, tOut: 118.5, kind: 'deck', ref: 'loop-s2-retrieval', state: 'retrieval', grp: 'LOOP2', tr: 'xfade' },
  { tIn: 118.5, tOut: 121.04, kind: 'deck', ref: 'loop-s2-day3', state: 'day3', grp: 'LOOP2', tr: 'xfade' },
  { tIn: 121.04, tOut: 122.1, kind: 'deck', ref: 'loop-s2-upgrade', state: 'upgrade', grp: 'LOOP2', tr: 'xfade' },
  // F4 122.1-126.1 (side panels)
  // CH4 THE BIAS (cardless)
  { tIn: 126.1, tOut: 129.64, kind: 'vid', ref: 'BR-5-reach-for-tool', cap: true, tr: 'fade', ff: true },                   // under the F4 face-out burn
  { tIn: 129.64, tOut: 132.14, kind: 'still', ref: 'IMG-3-glass-funnel-particles', tr: 'cut' },                              // lib:glitchmonitor-1 ingress
  { tIn: 132.14, tOut: 132.94, kind: 'deck', ref: 'C1-s1-base', state: 'base', grp: 'C1A', tr: 'cut' },                       // lib:spin-twirl-cw MARQUEE
  { tIn: 132.94, tOut: 134.14, kind: 'deck', ref: 'C1-s1-web', state: 'web', grp: 'C1A', tr: 'xfade' },
  { tIn: 134.14, tOut: 135.06, kind: 'deck', ref: 'C1-s1-analytics', state: 'analytics', grp: 'C1A', tr: 'xfade' },
  { tIn: 135.06, tOut: 135.84, kind: 'deck', ref: 'C1-s1-crm', state: 'crm', grp: 'C1A', tr: 'xfade' },
  { tIn: 135.84, tOut: 136.48, kind: 'deck', ref: 'C1-s1-cdp', state: 'cdp', grp: 'C1A', tr: 'xfade' },
  { tIn: 136.48, tOut: 137.72, kind: 'deck', ref: 'C1-s1-experiment', state: 'experiment', grp: 'C1A', tr: 'xfade' },
  { tIn: 137.72, tOut: 138.78, kind: 'deck', ref: 'C1-s1-outbound', state: 'outbound', grp: 'C1A', tr: 'xfade' },
  { tIn: 138.78, tOut: 139.48, kind: 'deck', ref: 'C1-s1-agents', state: 'agents', grp: 'C1A', tr: 'xfade' },
  { tIn: 139.48, tOut: 142.32, kind: 'still', ref: 'IMG-4-neural-core-chip', tr: 'cut' },                                    // lib:glitchmonitor-3 ingress
  { tIn: 142.32, tOut: 143.92, kind: 'deck', ref: 'C1-s2-base', state: 'base', grp: 'C1B', tr: 'xfade', xf: 8 },              // hand:xfade (container-xfade, 0.25s) in place
  { tIn: 143.92, tOut: 144.32, kind: 'deck', ref: 'C1-s2-prompting', state: 'prompting', grp: 'C1B', tr: 'xfade' },
  { tIn: 144.32, tOut: 144.8, kind: 'deck', ref: 'C1-s2-retrieval', state: 'retrieval', grp: 'C1B', tr: 'xfade' },
  { tIn: 144.8, tOut: 145.28, kind: 'deck', ref: 'C1-s2-routing', state: 'routing', grp: 'C1B', tr: 'xfade' },
  { tIn: 145.28, tOut: 146.18, kind: 'deck', ref: 'C1-s2-evalharness', state: 'evalharness', grp: 'C1B', tr: 'xfade' },
  { tIn: 146.18, tOut: 146.52, kind: 'deck', ref: 'C1-s2-latency', state: 'latency', grp: 'C1B', tr: 'xfade' },
  { tIn: 146.52, tOut: 148.68, kind: 'deck', ref: 'C1-s2-guardrails', state: 'guardrails', grp: 'C1B', tr: 'xfade' },
  { tIn: 148.68, tOut: 151.22, kind: 'deck', ref: 'C1-s2-featureui', state: 'featureui', grp: 'C1B', tr: 'xfade' },
  { tIn: 151.22, tOut: 152.84, kind: 'deck', ref: 'C1-s3-base', state: 'base', grp: 'C1B', tr: 'xfade' },                    // hand:xfade (container-xfade, 0.20s) in place
  { tIn: 152.84, tOut: 154.34, kind: 'deck', ref: 'C1-s3-llm', state: 'llm', grp: 'C1B', tr: 'xfade' },
  { tIn: 154.34, tOut: 155.16, kind: 'deck', ref: 'C1-s3-agentsorch', state: 'agentsorch', grp: 'C1B', tr: 'xfade' },
  { tIn: 155.16, tOut: 155.9, kind: 'deck', ref: 'C1-s3-evals', state: 'evals', grp: 'C1B', tr: 'xfade' },
  { tIn: 155.9, tOut: 157.32, kind: 'deck', ref: 'C1-s3-pyts', state: 'pyts', grp: 'C1B', tr: 'xfade' },
  { tIn: 157.32, tOut: 161.94, kind: 'receipt', ref: 'C4c-crowdstrike-translate-bullet', tr: 'xfs' },
  { tIn: 161.94, tOut: 168.567, kind: 'receipt', ref: 'C5c-citian-demo-vs-dependable', tr: 'xfs' },
  // F5 168.567-173.067 (side panels), then the CH5 card at the waived cut 173.085
  // CH5 WHICH ONE
  { tIn: 173.1, tOut: 175.16, kind: 'vid', ref: 'BR-6-interview-handshake', cap: true, tr: 'cut' },                        // in out of the card's exit flip
  { tIn: 175.16, tOut: 177.0, kind: 'receipt', ref: 'C7b-govwell-title-block', tr: 'xfs' },
  { tIn: 177.0, tOut: 180.8, kind: 'receipt', ref: 'C7b-govwell-closing-gap-bullet', tr: 'xfs' },
  { tIn: 180.8, tOut: 185.02, kind: 'receipt', ref: 'C6-fictiv-misumi-title-block', mo: 'motion-3d-pan-1-left', tr: 'xfs' }, // + [MOTION] lib
  { tIn: 185.02, tOut: 187.78, kind: 'vid', ref: 'BR-7-developer-night-desk', cap: true, tr: 'fade' },
  { tIn: 187.78, tOut: 189.06, kind: 'container', ref: 'become-compare-s1', state: 's1', grp: 'BC', tr: 'cut' },             // lib:spin-twirl-ccw MARQUEE
  { tIn: 189.06, tOut: 192.86, kind: 'container', ref: 'become-compare-s2', state: 's2', grp: 'BC', tr: 'xfade' },
  { tIn: 192.86, tOut: 193.62, kind: 'container', ref: 'become-compare-s3', state: 's3', grp: 'BC', tr: 'pop' },            // GROWTH label pop
  { tIn: 193.62, tOut: 196.14, kind: 'container', ref: 'become-compare-s4', state: 's4', grp: 'BC', tr: 'xfade' },
  { tIn: 196.14, tOut: 196.9, kind: 'container', ref: 'become-compare-s5', state: 's5', grp: 'BC', tr: 'pop' },             // PRODUCT label pop
  { tIn: 196.9, tOut: 200.767, kind: 'still', ref: 'IMG-5-founder-late-night-desk', tr: 'cut' },                             // lib:glitchmonitor-5 ingress
  // F6 200.767-206.1
  // CH6 THE CLOSE
  { tIn: 206.1, tOut: 207.5, kind: 'container', ref: 'C2-s4-s1', state: 's1', grp: 'C2d', tr: 'xfs', ff: true },          // under the F6 burn, both label pops
  { tIn: 207.5, tOut: 208.38, kind: 'container', ref: 'C2-s4-s2', state: 's2', grp: 'C2d', tr: 'xfade' },
  { tIn: 208.38, tOut: 209.16, kind: 'container', ref: 'C2-s4-s3', state: 's3', grp: 'C2d', tr: 'xfade' },
  { tIn: 209.16, tOut: 209.84, kind: 'container', ref: 'C2-s4-s4', state: 's4', grp: 'C2d', tr: 'xfade' },
  { tIn: 209.84, tOut: 211.7, kind: 'container', ref: 'C2-s4-s5', state: 's5', grp: 'C2d', tr: 'xfade' },
  // F7 211.7-219.663 EOF: the CTA hold, the picture ends on 'channel.' (hand:cut at 219.663, no held still)
];
same(COVERS, COVERS_169, 'COVERS');
// DIAGRAM_REFS: loop-s1-base, loop-s1-test-set, loop-s1-gate, aarrr-funnel-base, aarrr-funnel-within-days, aarrr-funnel-activation, loop-s2-base, loop-s2-eval-pulse, loop-s2-retrieval, loop-s2-day3, loop-s2-upgrade, C1-s1-base, C1-s1-web, C1-s1-analytics, C1-s1-crm, C1-s1-cdp, C1-s1-experiment, C1-s1-outbound, C1-s1-agents, C1-s2-base, C1-s2-prompting, C1-s2-retrieval, C1-s2-routing, C1-s2-evalharness, C1-s2-latency, C1-s2-guardrails, C1-s2-featureui, C1-s3-base, C1-s3-llm, C1-s3-agentsorch, C1-s3-evals, C1-s3-pyts
// COMPARISON_REFS: become-compare-s1, become-compare-s2, become-compare-s3, become-compare-s4, become-compare-s5
// (end declared refs)

// The caption windows: the SAME file + windows as the 16:9 (a literal copy for lint_covers, asserted equal).
const CAPTION_SRC: [number, number][] = [[0.0, 4.733], [45.133, 48.8], [50.35, 52.68], [70.0, 72.0], [82.6, 89.04], [105.28, 108.44], [122.1, 129.64], [168.567, 175.16], [185.02, 187.78], [200.767, 206.1], [211.7, 219.663]];
same(CAPTION_SRC, CAPTION_WINDOWS, 'CAPTION_SRC vs GrowthVsProductCaptions.CAPTION_WINDOWS');
same(CAPTION_SRC, CAPTION_SRC_169, 'CAPTION_SRC');

// ---------------------------------------------------------------------------------------------------------------------
// 4. THE 16:9-REF -> VERTICAL-ASSET LOOKUP (explicit; a ref without an entry throws at module load).
//    assets/vertical/NOTES.md does not exist on disk (2026-10-23): no vertical-only substitutions were recorded, so every
//    row maps to the same-named portrait file, except the two receipts the portrait capture SPLIT into two views each
//    (C5c, C6; see RECEIPTS_V).
// ---------------------------------------------------------------------------------------------------------------------
const V_FILES: Record<string, string> = {
  spine: 'spine.mp4',
  // card-slide containers (slide-builder, portrait re-shoot)
  'C2-s1-s1': 'card-slides/C2-s1-s1.png', 'C2-s1-s2': 'card-slides/C2-s1-s2.png', 'C2-s1-s3': 'card-slides/C2-s1-s3.png',
  'C2-s1b-s1': 'card-slides/C2-s1b-s1.png', 'C2-s1b-s2': 'card-slides/C2-s1b-s2.png',
  'C2-s2-s1': 'card-slides/C2-s2-s1.png', 'C2-s2-s2': 'card-slides/C2-s2-s2.png', 'C2-s2-s3': 'card-slides/C2-s2-s3.png',
  'C2-s2-s4': 'card-slides/C2-s2-s4.png', 'C2-s2-s5': 'card-slides/C2-s2-s5.png', 'C2-s2-s6': 'card-slides/C2-s2-s6.png',
  'scoreboard-growth-s1': 'card-slides/scoreboard-growth-s1.png', 'scoreboard-growth-s2': 'card-slides/scoreboard-growth-s2.png',
  'scoreboard-growth-s3': 'card-slides/scoreboard-growth-s3.png', 'scoreboard-growth-s4': 'card-slides/scoreboard-growth-s4.png',
  'scoreboard-growth-s5': 'card-slides/scoreboard-growth-s5.png',
  'ship-to-learn-s1': 'card-slides/ship-to-learn-s1.png', 'ship-to-learn-s2': 'card-slides/ship-to-learn-s2.png',
  'ship-to-learn-s3': 'card-slides/ship-to-learn-s3.png', 'ship-to-learn-s4': 'card-slides/ship-to-learn-s4.png',
  'become-compare-s1': 'card-slides/become-compare-s1.png', 'become-compare-s2': 'card-slides/become-compare-s2.png',
  'become-compare-s3': 'card-slides/become-compare-s3.png', 'become-compare-s4': 'card-slides/become-compare-s4.png',
  'become-compare-s5': 'card-slides/become-compare-s5.png',
  'C2-s4-s1': 'card-slides/C2-s4-s1.png', 'C2-s4-s2': 'card-slides/C2-s4-s2.png', 'C2-s4-s3': 'card-slides/C2-s4-s3.png',
  'C2-s4-s4': 'card-slides/C2-s4-s4.png', 'C2-s4-s5': 'card-slides/C2-s4-s5.png',
  // Type 2 system-design diagram states (chart-builder, portrait reflow)
  'loop-s1-base': 'diagrams/loop-s1-base.png', 'loop-s1-test-set': 'diagrams/loop-s1-test-set.png', 'loop-s1-gate': 'diagrams/loop-s1-gate.png',
  'aarrr-funnel-base': 'diagrams/aarrr-funnel-base.png', 'aarrr-funnel-within-days': 'diagrams/aarrr-funnel-within-days.png',
  'aarrr-funnel-activation': 'diagrams/aarrr-funnel-activation.png',
  'loop-s2-base': 'diagrams/loop-s2-base.png', 'loop-s2-eval-pulse': 'diagrams/loop-s2-eval-pulse.png', 'loop-s2-retrieval': 'diagrams/loop-s2-retrieval.png',
  'loop-s2-day3': 'diagrams/loop-s2-day3.png', 'loop-s2-upgrade': 'diagrams/loop-s2-upgrade.png',
  'C1-s1-base': 'diagrams/C1-s1-base.png', 'C1-s1-web': 'diagrams/C1-s1-web.png', 'C1-s1-analytics': 'diagrams/C1-s1-analytics.png',
  'C1-s1-crm': 'diagrams/C1-s1-crm.png', 'C1-s1-cdp': 'diagrams/C1-s1-cdp.png', 'C1-s1-experiment': 'diagrams/C1-s1-experiment.png',
  'C1-s1-outbound': 'diagrams/C1-s1-outbound.png', 'C1-s1-agents': 'diagrams/C1-s1-agents.png',
  'C1-s2-base': 'diagrams/C1-s2-base.png', 'C1-s2-prompting': 'diagrams/C1-s2-prompting.png', 'C1-s2-retrieval': 'diagrams/C1-s2-retrieval.png',
  'C1-s2-routing': 'diagrams/C1-s2-routing.png', 'C1-s2-evalharness': 'diagrams/C1-s2-evalharness.png', 'C1-s2-latency': 'diagrams/C1-s2-latency.png',
  'C1-s2-guardrails': 'diagrams/C1-s2-guardrails.png', 'C1-s2-featureui': 'diagrams/C1-s2-featureui.png',
  'C1-s3-base': 'diagrams/C1-s3-base.png', 'C1-s3-llm': 'diagrams/C1-s3-llm.png', 'C1-s3-agentsorch': 'diagrams/C1-s3-agentsorch.png',
  'C1-s3-evals': 'diagrams/C1-s3-evals.png', 'C1-s3-pyts': 'diagrams/C1-s3-pyts.png',
  // ChatGPT stills recomposed 9:16 (image-gen --reference-image)
  'IMG-1-feature-module-gauge': 'img/IMG-1-feature-module-gauge.png', 'IMG-2-calendar-sheets-hourglass': 'img/IMG-2-calendar-sheets-hourglass.png',
  'IMG-3-glass-funnel-particles': 'img/IMG-3-glass-funnel-particles.png', 'IMG-4-neural-core-chip': 'img/IMG-4-neural-core-chip.png',
  'IMG-5-founder-late-night-desk': 'img/IMG-5-founder-late-night-desk.png',
  // native-portrait Envato b-roll (envato-sourcer)
  'BR-1-data-dashboard': 'vid/BR-1-data-dashboard.mp4', 'BR-2-laptop-browsing': 'vid/BR-2-laptop-browsing.mp4',
  'BR-3-stopwatch': 'vid/BR-3-stopwatch.mp4', 'BR-4-phone-signup': 'vid/BR-4-phone-signup.mp4',
  'BR-5-reach-for-tool': 'vid/BR-5-reach-for-tool.mp4', 'BR-6-interview-handshake': 'vid/BR-6-interview-handshake.mp4',
  'BR-7-developer-night-desk': 'vid/BR-7-developer-night-desk.mp4',
  // chapter title cards (portrait re-shoot)
  'title-slides/title-card-CH2.png': 'title-slides/title-card-CH2.png', 'title-slides/title-card-CH5.png': 'title-slides/title-card-CH5.png',
  // transition stills: the portrait clips' own cut frames (BR-5 frame 96 @25 fps, BR-7 frame 71 @23.976 fps)
  'cut:BR-5-reach-for-tool': 'transitions/cutframes/BR-5-cut.jpg', 'cut:BR-7-developer-night-desk': 'transitions/cutframes/BR-7-cut.jpg',
  // mobile-view receipts (receipt-capturer); C5c and C6 were captured as TWO portrait views each
  'rc:C12-title-date': 'receipts/C12-title-date.png', 'rc:C12-pragmatic-engineer-paragraph': 'receipts/C12-pragmatic-engineer-paragraph.png',
  'rc:C4a-crowdstrike-title-block': 'receipts/C4a-crowdstrike-title-block.png', 'rc:C5a-citian-title-block': 'receipts/C5a-citian-title-block.png',
  'rc:C5b-citian-evals-duty': 'receipts/C5b-citian-evals-duty.png', 'rc:C7a-govwell-ai-stack': 'receipts/C7a-govwell-ai-stack.png',
  'rc:C10-hamel-evals-root-cause': 'receipts/C10-hamel-evals-root-cause.png', 'rc:C4c-crowdstrike-translate-bullet': 'receipts/C4c-crowdstrike-translate-bullet.png',
  'rc:C5c-citian-demo-vs-dependable': 'receipts/C5c-citian-demo-vs-dependable.png', 'rc:C5c-citian-no-ai-bullet': 'receipts/C5c-citian-no-ai-bullet.png',
  'rc:C7b-govwell-title-block': 'receipts/C7b-govwell-title-block.png', 'rc:C7b-govwell-closing-gap-bullet': 'receipts/C7b-govwell-closing-gap-bullet.png',
  'rc:C6-fictiv-misumi-title-block': 'receipts/C6-fictiv-misumi-title-block.png', 'rc:C6-fictiv-misumi-opening-sentence': 'receipts/C6-fictiv-misumi-opening-sentence.png',
};
/** the portrait asset path for a key; THROWS when the key has no entry (build-time hole) */
const V = (key: string) => {
  const p = V_FILES[key];
  if (!p) throw new Error(`GrowthVsProductVertical: no vertical asset mapped for '${key}'`);
  return p;
};
/** first rendered frame: every mapped file must be in the lean public dir (assets/vertical), or the render stops */
let filesChecked = false;
const assertPublicDir = () => {
  if (filesChecked) return;
  const have = new Set(getStaticFiles().map((f) => f.name.replace(/\\/g, '/')));
  const missing = Object.values(V_FILES).filter((p) => !have.has(p));
  if (missing.length) throw new Error(`GrowthVsProductVertical: missing in the vertical public dir: ${missing.join(', ')}`);
  filesChecked = true;
};

// Portrait clips: their OWN frame rates (assets/vertical/vid, ffprobe 2026-10-23); played frame for frame (comp-build 11).
// slot x rate fits every clip: BR-1 2.90 of 4.34 s, BR-2 2.50 of 4.00, BR-3 2.04 of 4.00, BR-4 3.16 of 5.20, BR-5 4.25 of 5.52,
// BR-6 2.47 of 4.12, BR-7 3.45 of 4.84.
const VID_FPS_V: Record<string, number> = { 'BR-1-data-dashboard': 24000 / 1001, 'BR-2-laptop-browsing': 24000 / 1001, 'BR-3-stopwatch': 30000 / 1001, 'BR-4-phone-signup': 30 / 1, 'BR-5-reach-for-tool': 25 / 1, 'BR-6-interview-handshake': 25 / 1, 'BR-7-developer-night-desk': 24000 / 1001 };

// Role-label pops inside the PORTRAIT card containers: the label box in 1080x1920 slide px, MEASURED as the changed-pixel
// bbox between consecutive portrait state PNGs (C2-s4-s1: the gold / green label pixels of the state itself).
const POPS_V: Record<string, { t: number; box: number[]; hide?: boolean }[]> = {
  'C2-s1-s2': [{ t: 8.24, box: [127, 392, 473, 154] }],
  'C2-s1b-s1': [{ t: 18.92, box: [127, 1072, 473, 154] }],
  'C2-s2-s2': [{ t: 21.4, box: [122, 392, 552, 154] }],
  'C2-s2-s3': [{ t: 21.94, box: [122, 1072, 574, 154] }],
  'become-compare-s3': [{ t: 192.86, box: [126, 860, 452, 151] }],
  'become-compare-s5': [{ t: 196.14, box: [126, 1264, 452, 150] }],
  'C2-s4-s1': [{ t: 206.1, box: [127, 511, 342, 114] }, { t: 206.7, box: [530, 511, 342, 114], hide: true }],
};
const CARD_BG = 'rgb(22,25,30)';   // the portrait card body colour under the hidden label B (sampled)

// Portrait receipts (all 1080x1920, mobile view). One 16:9 row = one or more portrait VIEWS (from = view start).
// cams [t, cx, cy, z]: the image point (fraction) at frame centre, z = scale (1 = the capture fills the frame exactly; the
// settling push is capped per capture by its page margins: crop 540 * (1 - 1 / z) < margin, so no line is ever clipped). hl lines = the sidecar anchors, IMAGE px [x, y, w, h].
// free = a [MOTION] receipt: the page sits at z 0.62-0.68 as a card (the engines magnify it mid-move; cx leans AGAINST the pan's drift so the title stays in frame; QA'd at start / mid / end) on the house dark so the 3D move keeps its text in frame.
type RcView = { file: string; from: number; free?: boolean; cams: number[][]; hl?: { t: number; dur?: number; lines: number[][] }[] };
const RECEIPTS_V: Record<string, RcView[]> = {
  'C12-title-date': [{ file: 'rc:C12-title-date', from: 14.78, cams: [[14.78, 0.5, 0.5, 1.0], [16.4, 0.5, 0.3, 1.04]] }],
  'C12-pragmatic-engineer-paragraph': [{ file: 'rc:C12-pragmatic-engineer-paragraph', from: 16.4, cams: [[16.4, 0.5, 0.5, 1.0], [17.3, 0.5, 0.42, 1.04], [18.92, 0.5, 0.42, 1.05]],
    hl: [{ t: 16.66, lines: [[670, 692, 162, 61], [44, 768, 919, 61], [44, 843, 212, 61]] }] }],                       // product_sentence
  'C4a-crowdstrike-title-block': [{ file: 'rc:C4a-crowdstrike-title-block', from: 40.32, free: true, cams: [[40.32, 0.68, 0.36, 0.62]] }],
  'C5a-citian-title-block': [{ file: 'rc:C5a-citian-title-block', from: 42.7, free: true, cams: [[42.7, 0.5, 0.45, 0.68]] }],
  'C5b-citian-evals-duty': [{ file: 'rc:C5b-citian-evals-duty', from: 60.72, cams: [[60.72, 0.5, 0.5, 1.0], [61.9, 0.5, 0.33, 1.12], [64.84, 0.5, 0.33, 1.15]],
    hl: [{ t: 62.7, lines: [[581, 504, 221, 58]] }] }],                                                                   // evaluations_word
  'C7a-govwell-ai-stack': [{ file: 'rc:C7a-govwell-ai-stack', from: 64.84, cams: [[64.84, 0.5, 0.5, 1.0], [65.6, 0.477, 0.75, 1.08], [70.0, 0.477, 0.75, 1.1]],
    hl: [{ t: 65.64, lines: [[331, 1496, 645, 53], [166, 1562, 139, 53]] }] }],                                          // pass_rate_line
  'C10-hamel-evals-root-cause': [{ file: 'rc:C10-hamel-evals-root-cause', from: 100.54, cams: [[100.54, 0.5, 0.3, 1.0], [101.3, 0.5, 0.3, 1.0], [102.45, 0.5, 0.72, 1.1], [103.22, 0.5, 0.72, 1.12]],
    hl: [{ t: 102.7, dur: 0.3, lines: [[561, 1284, 437, 61], [71, 1354, 875, 61], [71, 1425, 881, 61]] }] }],          // root_cause_sentence
  'C4c-crowdstrike-translate-bullet': [{ file: 'rc:C4c-crowdstrike-translate-bullet', from: 157.32, cams: [[157.32, 0.5, 0.5, 1.0], [158.4, 0.5, 0.26, 1.1], [161.94, 0.5, 0.26, 1.13]],
    hl: [{ t: 158.72, lines: [[386, 366, 562, 58], [166, 444, 705, 58], [166, 522, 404, 58]] }] }],                     // translate_sentence
  'C5c-citian-demo-vs-dependable': [
    { file: 'rc:C5c-citian-demo-vs-dependable', from: 161.94, cams: [[161.94, 0.5, 0.5, 1.0], [162.9, 0.5, 0.4, 1.12], [166.2, 0.5, 0.4, 1.14]],
      hl: [{ t: 163.88, lines: [[228, 704, 708, 58], [111, 782, 644, 58]] }] },                                         // wipe 1: demo_vs_dependable
    { file: 'rc:C5c-citian-no-ai-bullet', from: 166.2, cams: [[166.2, 0.5, 0.68, 1.1], [168.567, 0.5, 0.68, 1.14]],      // view 2 on 'and' 166.20
      hl: [{ t: 166.42, lines: [[645, 1319, 263, 58]] }] },                                                             // wipe 2: no_ai_at_all
  ],
  'C7b-govwell-title-block': [{ file: 'rc:C7b-govwell-title-block', from: 175.16, cams: [[175.16, 0.5, 0.5, 1.0], [177.0, 0.5, 0.42, 1.04]] }],
  'C7b-govwell-closing-gap-bullet': [{ file: 'rc:C7b-govwell-closing-gap-bullet', from: 177.0, cams: [[177.0, 0.5, 0.5, 1.0], [177.9, 0.5, 0.8, 1.08], [180.8, 0.5, 0.8, 1.1]],
    hl: [{ t: 178.04, lines: [[278, 1304, 468, 79], [278, 1405, 465, 79], [278, 1507, 650, 79], [278, 1608, 621, 79], [278, 1710, 633, 79]] }] }],
  'C6-fictiv-misumi-title-block': [
    { file: 'rc:C6-fictiv-misumi-title-block', from: 180.8, free: true, cams: [[180.8, 0.62, 0.45, 0.62]] },
    { file: 'rc:C6-fictiv-misumi-opening-sentence', from: 182.58, free: true, cams: [[182.58, 0.56, 0.42, 0.6]] },          // view 2 on 'a funnel' 182.58
  ],
};
for (const c of COVERS) {
  if (c.kind === 'receipt' && !RECEIPTS_V[c.ref]) throw new Error(`GrowthVsProductVertical: no portrait receipt views for '${c.ref}'`);
  if (c.kind === 'receipt') RECEIPTS_V[c.ref].forEach((v) => V(v.file));
  if (c.kind !== 'receipt' && c.kind !== 'chart') V(c.ref);
}

// Scene groups: one slow push per scene (comp-build 7a), as the 16:9.
const GROUPS: Record<string, [number, number]> = {};
for (const c of COVERS) if (c.grp) GROUPS[c.grp] = [Math.min(GROUPS[c.grp]?.[0] ?? 1e9, c.tIn), Math.max(GROUPS[c.grp]?.[1] ?? 0, c.tOut)];
const groupPush = (c: Cover, t: number) => {
  if (!c.grp) return 1;
  const [a, b] = GROUPS[c.grp];
  return 1 + (c.kind === 'deck' ? 0.035 : 0.02) * c01((t - a) / (b - a));
};

// ---------------------------------------------------------------------------------------------------------------------
// 5. COVER NODES (portrait): every node reads the ABSOLUTE clock (GvpClock), so it is correct inside any engine nesting.
// ---------------------------------------------------------------------------------------------------------------------
const fill: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };

const cardPop = (dt: number) => {
  const s = interpolate(dt, [0, 0.2, 0.35], [1, 1.1, 1], clampOpt);
  const rot = interpolate(dt, [0, 0.03, 0.08, 0.13, 0.2, 0.27], [0, 2, -2, 1, -0.5, 0], clampOpt);
  const blur = interpolate(dt, [0, 0.1], [5, 0], clampOpt);
  return { s, rot, blur };
};
const SlideImg: React.FC<{ src: string; pops?: { t: number; box: number[]; hide?: boolean }[] }> = ({ src, pops }) => {
  const { t } = useGvp();
  return (
    <AbsoluteFill>
      <Img src={staticFile(src)} style={fill} />
      {(pops || []).map((p, i) => {
        const [x, y, w, h] = p.box;
        const pad = 8;
        if (t < p.t) {
          return p.hide ? <div key={i} style={{ position: 'absolute', left: x - pad, top: y - pad, width: w + 2 * pad, height: h + 2 * pad, background: CARD_BG }} /> : null;
        }
        const pm = cardPop(t - p.t);
        if (pm.s === 1 && pm.rot === 0 && pm.blur === 0) return null;
        return (
          <div key={i} style={{ position: 'absolute', left: x - pad, top: y - pad, width: w + 2 * pad, height: h + 2 * pad, overflow: 'hidden',
            transform: `scale(${pm.s}) rotate(${pm.rot}deg)`, filter: pm.blur > 0.2 ? `blur(${pm.blur}px)` : undefined }}>
            <Img src={staticFile(src)} style={{ position: 'absolute', left: -(x - pad), top: -(y - pad), width: 1080, height: 1920 }} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const camAt = (cams: number[][], t: number) => {
  if (t <= cams[0][0]) return cams[0];
  for (let i = 1; i < cams.length; i++) {
    if (t <= cams[i][0]) {
      const a = cams[i - 1], b = cams[i];
      const k = Easing.inOut(Easing.cubic)(c01((t - a[0]) / (b[0] - a[0])));
      return [t, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k, a[3] + (b[3] - a[3]) * k];
    }
  }
  return cams[cams.length - 1];
};
const RcPage: React.FC<{ v: RcView }> = ({ v }) => {
  const { t } = useGvp();
  const [, cx, cy, z] = camAt(v.cams, t);
  const Wd = 1080 * z, Hd = 1920 * z;
  let left = 540 - cx * Wd, top = 960 - cy * Hd;
  if (!v.free) {
    left = Wd >= 1080 ? Math.min(0, Math.max(1080 - Wd, left)) : (1080 - Wd) / 2;
    top = Hd >= 1920 ? Math.min(0, Math.max(1920 - Hd, top)) : (1920 - Hd) / 2;
  }
  const k = z;   // image px -> frame px
  return (
    <AbsoluteFill style={{ backgroundColor: v.free ? '#0c0f12' : '#ffffff', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left, top, width: Wd, height: Hd, boxShadow: v.free ? '0 30px 80px rgba(0,0,0,.55)' : undefined }}>
        <Img src={staticFile(V(v.file))} style={{ position: 'absolute', left: 0, top: 0, width: Wd, height: Hd }} />
        {(v.hl || []).map((h, gi) => {
          // [HIGHLIGHT] a #ffe14d rect wiping left to right over the quoted words (multiply: black text stays black)
          const total = h.lines.reduce((s, l) => s + l[2], 0);
          const p = c01((t - h.t) / (h.dur ?? 0.5)) * total;
          let before = 0;
          return h.lines.map((l, li) => {
            const kk = c01((p - before) / l[2]);
            before += l[2];
            if (kk <= 0) return null;
            const hp = l[3] * k, pad = hp * 0.16;
            return <div key={`${gi}-${li}`} style={{ position: 'absolute', left: l[0] * k - pad, top: l[1] * k - pad * 0.6, width: (l[2] * k + 2 * pad) * kk,
              height: hp + pad * 1.2, background: '#ffe14d', mixBlendMode: 'multiply', borderRadius: pad * 0.5 }} />;
          });
        })}
      </div>
    </AbsoluteFill>
  );
};
/** one 16:9 receipt row in portrait: its views in order, a 6-frame cross-fade into each later view */
const ReceiptViewV: React.FC<{ id: string }> = ({ id }) => {
  const { t } = useGvp();
  const views = RECEIPTS_V[id];
  let cur = 0;
  views.forEach((v, i) => { if (t >= v.from) cur = i; });
  const o = cur > 0 ? c01((t - views[cur].from) / (6 / FPS)) : 1;
  return (
    <AbsoluteFill>
      {cur > 0 && o < 1 && <RcPage v={views[cur - 1]} />}
      <AbsoluteFill style={{ opacity: o }}><RcPage v={views[cur]} /></AbsoluteFill>
    </AbsoluteFill>
  );
};

/** [MOTION] lib:motion-3d-* on a receipt: the engine wraps the live receipt for its whole slot; its clock is set with Freeze
 * and the 5 s camera move is fitted to the slot (t * 5 / slot). The engines read the portrait frame size from the config. */
const MotionWrap: React.FC<{ id: string; tIn: number; tOut: number; children: React.ReactNode }> = ({ id, tIn, tOut, children }) => {
  const { t } = useGvp();
  const row = getTransition(id);
  if (!row) throw new Error('unknown motion id ' + id);
  const Engine = ENGINES[row.engine] as React.FC<any>;
  const slot = tOut - tIn;
  const ff = (c01((t - tIn) / slot) * 5) * FPS;
  return (
    <Freeze frame={ff}>
      <Engine from={null} outClip={() => children} params={row.params} durationInFrames={150} />
    </Freeze>
  );
};

const VidNode: React.FC<{ c: Cover }> = ({ c }) => {
  const { abs } = useGvp();
  const rate = 30 / VID_FPS_V[c.ref];
  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      <Freeze frame={Math.max(0, abs - F(c.tIn))}>
        <OffthreadVideo src={staticFile(V(c.ref))} muted playbackRate={rate} style={fill} />
      </Freeze>
    </AbsoluteFill>
  );
};

const CoverNode: React.FC<{ c: Cover }> = ({ c }) => {
  const { t } = useGvp();
  if (c.kind === 'chart') {
    if (c.ref === 'split-test') return <SplitTestChartV />;
    if (c.ref === 'pass-rate-meter') return <PassRateMeterChartV />;
    throw new Error('chart without an animated component: ' + c.ref);
  }
  if (c.kind === 'vid') return <VidNode c={c} />;
  if (c.kind === 'still') {
    const [s0, s1, tEnd] = STILL_PUSH[c.ref] ?? [1.0, 1.06, c.tOut];
    const s = interpolate(t, [c.tIn, tEnd], [s0, s1], clampOpt);
    return (
      <AbsoluteFill style={{ backgroundColor: 'black', overflow: 'hidden' }}>
        <Img src={staticFile(V(c.ref))} style={{ ...fill, transform: `scale(${s})` }} />
      </AbsoluteFill>
    );
  }
  if (c.kind === 'receipt') {
    const view = <ReceiptViewV id={c.ref} />;
    return c.mo ? <MotionWrap id={c.mo} tIn={c.tIn} tOut={c.tOut}>{view}</MotionWrap> : view;
  }
  // deck (diagram state) / container (card-slide state)
  const s = groupPush(c, t);
  let pulse: React.ReactNode = null;
  let src = V(c.ref);
  if (c.ref === 'loop-s2-eval-pulse') {
    // state cue: cross-fade in over 4 f, hold ~0.6 s, fade back to base over 8 f
    const o = interpolate(t, [c.tIn, c.tIn + 4 / FPS, c.tIn + 4 / FPS + 0.6, c.tIn + 12 / FPS + 0.6], [0, 1, 1, 0], clampOpt);
    src = V('loop-s2-base');
    pulse = <AbsoluteFill style={{ opacity: o }}><Img src={staticFile(V(c.ref))} style={fill} /></AbsoluteFill>;
  }
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0c10', overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `scale(${s})` }}>
        <SlideImg src={src} pops={POPS_V[c.ref]} />
        {pulse}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
const nodeFor = (ref: string) => {
  const c = COVERS.find((r) => r.ref === ref);
  if (!c) throw new Error('no cover row ' + ref);
  return c;
};

const ingressF = (c: Cover) => {
  if (c.tr === 'xfade') return c.xf ?? 6;                // hand:xfade (container-xfade, 0.20s)
  if (c.tr === 'xfs') return c.ref === 'split-test' ? 12 : 11;   // hand:xfade-scale (container-xfade, 0.35s); split-test spec 12 f
  if (c.tr === 'fade') return 15;                        // hand:fade (broll-fade, 0.50s)
  if (c.tr === 'whip') return 5;                         // hand:kt-whip-cut blur-in variant (0.17s)
  return 0;
};
const CoverSlot: React.FC<{ c: Cover }> = ({ c }) => {
  const { abs } = useGvp();
  const lf = abs - F(c.tIn);
  const n = ingressF(c);
  let style: React.CSSProperties = {};
  if (n > 0 && lf < n) {
    const p = c01(lf / n);
    if (c.tr === 'whip') {
      const e = easeOut(p);
      style = { filter: `blur(${(40 * (1 - e)).toFixed(2)}px)`, transform: `translateY(${960 * (1 - e)}px) scale(${1.2 - 0.2 * e})` };
    } else if (c.tr === 'xfs') {
      const e = easeOut(p);
      const s0 = c.ref === 'split-test' ? 0.97 : 0.93;
      style = { opacity: p, transform: `scale(${s0 + (1 - s0) * e})` };
    } else {
      style = { opacity: p };
    }
  }
  return (
    <AbsoluteFill>
      {c.ff && lf < n && <SpineStill frame={F(c.tIn) - 1} />}
      <AbsoluteFill style={style}><CoverNode c={c} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
const isXfade = (c?: Cover) => !!c && (c.tr === 'xfade' || c.tr === 'xfs' || c.tr === 'fade');
const CoverTrack: React.FC = () => (
  <>
    {COVERS.map((c, i) => {
      const nx = COVERS[i + 1];
      const tail = nx && isXfade(nx) && !nx.ff && Math.abs(nx.tIn - c.tOut) < 0.05 ? ingressF(nx) : 0;
      return (
        <Sequence key={c.ref} from={F(c.tIn)} durationInFrames={F(c.tOut) - F(c.tIn) + tail} name={c.ref}>
          <CoverSlot c={c} />
        </Sequence>
      );
    })}
  </>
);

// ---------------------------------------------------------------------------------------------------------------------
// 6. LIBRARY TRANSITIONS: the SAME cuts + ids as the 16:9 (literal copy, asserted); each TransitionClip gets a Sequence of
//    EXACTLY its engine window; sfx={false} (post-mix). Video sides hand the engine the PORTRAIT cut-frame still.
// ---------------------------------------------------------------------------------------------------------------------
// TRANSITIONS_WAIVED: melt-rgb-short-3 — named only in TRANSITIONS.md Open questions as a promotable alternative for 77.52 (Mike's call); the plan row is hand:xfade
// TRANSITIONS_WAIVED: roughly-1x — named only in TRANSITIONS.md Open questions as the quieter AI-still fallback; the plan rows are GLITCH/Monitor
// TRANSITIONS_WAIVED: roughly-2x — named only in TRANSITIONS.md Open questions as the quieter AI-still fallback; the plan rows are GLITCH/Monitor
const LIB_TR: { cut: number; id: string; from: string; to: string; fromSrc?: string; toSrc?: string }[] = [
  { cut: 58.0, id: 'glitchmonitor-2', from: 'scoreboard-growth-s5', to: 'IMG-1-feature-module-gauge' },             // lib:glitchmonitor-2 (glitch-still, 0.52s)
  { cut: 103.22, id: 'glitchmonitor-4', from: 'C10-hamel-evals-root-cause', to: 'IMG-2-calendar-sheets-hourglass' }, // lib:glitchmonitor-4 (glitch-still, 0.56s)
  { cut: 113.9, id: 'melt-rgb-short-4', from: 'aarrr-funnel-activation', to: 'loop-s2-base' },                      // lib:melt-rgb-short-4 (MELT-transform, 0.44s)
  { cut: 129.64, id: 'glitchmonitor-1', from: 'BR-5-reach-for-tool', to: 'IMG-3-glass-funnel-particles' },          // lib:glitchmonitor-1 (glitch-still, 0.64s)
  { cut: 132.14, id: 'spin-twirl-cw', from: 'IMG-3-glass-funnel-particles', to: 'C1-s1-base',                         // lib:spin-twirl-cw (SPIN-newfacet, 0.72s)
    fromSrc: 'img/IMG-3-glass-funnel-particles.png', toSrc: 'diagrams/C1-s1-base.png' },
  { cut: 139.48, id: 'glitchmonitor-3', from: 'C1-s1-agents', to: 'IMG-4-neural-core-chip' },                       // lib:glitchmonitor-3 (glitch-still, 0.60s)
  { cut: 187.78, id: 'spin-twirl-ccw', from: 'BR-7-developer-night-desk', to: 'become-compare-s1',                   // lib:spin-twirl-ccw (SPIN-newfacet, 0.72s)
    fromSrc: 'transitions/cutframes/BR-7-cut.jpg', toSrc: 'card-slides/become-compare-s1.png' },
  { cut: 196.9, id: 'glitchmonitor-5', from: 'become-compare-s5', to: 'IMG-5-founder-late-night-desk' },            // lib:glitchmonitor-5 (glitch-still, 0.64s)
];
same(LIB_TR.map((r) => [r.cut, r.id, r.from, r.to]), LIB_TR_169.map((r) => [r.cut, r.id, r.from, r.to]), 'LIB_TR');
// the image-only canvas engines read these portrait stills (resolved through the lookup, so a missing one throws)
const SRC_V: Record<string, string> = {
  'img/IMG-3-glass-funnel-particles.png': V('IMG-3-glass-funnel-particles'), 'diagrams/C1-s1-base.png': V('C1-s1-base'),
  'transitions/cutframes/BR-7-cut.jpg': V('cut:BR-7-developer-night-desk'), 'card-slides/become-compare-s1.png': V('become-compare-s1'),
};
const srcV = (p?: string) => (p ? (SRC_V[p] ?? (() => { throw new Error('no portrait still for ' + p); })()) : undefined);
const CUTFRAME_V: Record<string, string> = { 'BR-5-reach-for-tool': V('cut:BR-5-reach-for-tool'), 'BR-7-developer-night-desk': V('cut:BR-7-developer-night-desk') };
const sceneFn = (ref: string) => {
  const cf = CUTFRAME_V[ref];
  if (cf) return () => <Img src={staticFile(cf)} style={{ width: 1080, height: 1920, objectFit: 'cover' }} />;
  const c = nodeFor(ref);
  return () => <CoverNode c={c} />;
};
const LibTransitions: React.FC = () => (
  <>
    {LIB_TR.map((r) => {
      const row = getTransition(r.id);
      if (!row) throw new Error('unknown transition id ' + r.id);
      const win = Math.round(row.durationSeconds * FPS);
      const half = Math.round(win / 2);
      return (
        <Sequence key={r.id} from={F(r.cut) - half} durationInFrames={win} name={'lib:' + r.id}>
          <TransitionClip id={r.id} cutFrame={half} sfx={false} outgoing={sceneFn(r.from)} incoming={sceneFn(r.to)}
            fromSrc={srcV(r.fromSrc)} toSrc={srcV(r.toSrc)} />
        </Sequence>
      );
    })}
  </>
);

// ---------------------------------------------------------------------------------------------------------------------
// 7. TITLE CARDS: rmn:flip (card, 0.50s), the 16:9's ONE card pick, same timing (CARDS asserted), portrait card PNGs.
// ---------------------------------------------------------------------------------------------------------------------
const CARDS = CARDS_169.map((cd) => ({ ...cd, png: V(cd.png) }));
for (const cd of CARDS) {
  const pauseF = Math.round(INSERTS.find((p) => p.at === cd.at)!.dur * FPS);
  const readable = (cd.lead + pauseF - TURN) / FPS;
  if (readable < 1.0) throw new Error(`title card at ${cd.at}: readable ${readable.toFixed(2)} s < 1.0 s`);
}
const CardScenes: React.FC = () => (
  <>
    {CARDS.map((cd) => {
      const P0 = Math.round(cardStart(cd.at) * FPS);
      const pauseF = Math.round(INSERTS.find((p) => p.at === cd.at)!.dur * FPS);
      const S = P0 - cd.lead;
      const cardDur = cd.lead + pauseF + TURN;
      const outNode = cd.faceEnd ? <SpineStill frame={F(cd.faceEnd) - 1} /> : <CoverNode c={nodeFor(cd.from)} />;
      return (
        <Sequence key={cd.at} from={S} durationInFrames={cardDur} name={'card ' + cd.at}>
          <AbsoluteFill style={{ backgroundColor: 'black' }}>
            <TransitionSeries>
              <TransitionSeries.Sequence durationInFrames={TURN}>{outNode}</TransitionSeries.Sequence>
              <TransitionSeries.Transition presentation={flip({ direction: 'from-right' })} timing={linearTiming({ durationInFrames: TURN })} />
              <TransitionSeries.Sequence durationInFrames={cardDur}>
                <Img src={staticFile(cd.png)} style={fill} />
              </TransitionSeries.Sequence>
              <TransitionSeries.Transition presentation={flip({ direction: 'from-right' })} timing={linearTiming({ durationInFrames: TURN })} />
              <TransitionSeries.Sequence durationInFrames={TURN}><CoverNode c={nodeFor(cd.to)} /></TransitionSeries.Sequence>
            </TransitionSeries>
          </AbsoluteFill>
        </Sequence>
      );
    })}
  </>
);
const inCardPause = (T: number) => INSERTS.some((p) => { const a = cardStart(p.at); return T >= a && T < a + p.dur; });

// ---------------------------------------------------------------------------------------------------------------------
// 8. FILM BURN: hand:film-burn (face-cut, 0.76s) on every regular FACE edge (the 16:9 BURNS), the portrait frame.
// ---------------------------------------------------------------------------------------------------------------------
const FilmBurn: React.FC<{ cut: number }> = ({ cut }) => {
  const { abs } = useGvp();
  const u = (abs - F(cut)) / 11.4;
  if (Math.abs(u) > 1) return null;
  const env = Math.pow(1 - Math.abs(u), 1.6);
  const x = 28 + 44 * ((u + 1) / 2);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: env,
        background: `radial-gradient(ellipse 95% 70% at ${x}% 45%, rgba(255,240,210,1) 0%, rgba(255,160,50,.95) 26%, rgba(225,80,15,.75) 52%, rgba(120,25,0,0) 86%)` }} />
      <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: env * 0.55,
        background: `radial-gradient(circle at ${100 - x}% 72%, rgba(255,120,30,.9) 0%, rgba(255,60,0,0) 58%)` }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// 9. KINETIC TEXT (overlays.md 2), portrait: above the covers, below the captions.
// ---------------------------------------------------------------------------------------------------------------------
const KineticText: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: 'none' }}>
    {/* kt-signature-open: ROLE LABEL A on 'AI growth engineer' 2.00, LABEL B on 'AI product engineer' 3.64, in the free band
        above his head (portrait: side by side, A left / B right), held to the 4.733 whip-out */}
    <RoleLabelPop t0={2.0} t1={4.733} role="a" line1="AI GROWTH" x={290} y={215} size={66} align="center" />
    <RoleLabelPop t0={3.64} t1={4.733} role="b" line1="AI PRODUCT" x={790} y={215} size={66} align="center" />
    {/* kt-side-panel pairs as BOTTOM panels: RIGHT-in = growth verdict, in-take kt-whip-cut, LEFT-in = product verdict.
        hand:kt-whip-cut (kt-whip-cut, 0.37s) at 85.32 / 124.48 / 170.62 lives in faceFx. */}
    {PANELS.map((p) => (
      <React.Fragment key={p.id}>
        <KtBottomPanelV side="R" t0={p.r0} t1={p.l0} role="a" lines={p.rLines} />
        <KtBottomPanelV side="L" t0={p.l0} t1={p.end} role="b" lines={p.lLines} />
      </React.Fragment>
    ))}
    {/* the role labels return over IMG-5 on 'ends' 199.68 / 'being' 200.26, removed by the F6 cut-in 200.767 */}
    <RoleLabelPop t0={199.68} t1={200.76} role="a" line1="GROWTH" x={290} y={1560} size={56} align="center" boxed />
    <RoleLabelPop t0={200.26} t1={200.76} role="b" line1="PRODUCT" x={790} y={1560} size={56} align="center" boxed />
  </AbsoluteFill>
);

// ---------------------------------------------------------------------------------------------------------------------
// 10. CAPTIONS: the SAME generated data + windows, Montserrat house style restyled for portrait (bigger, narrower, the
//     line sits under his chin at y ~1370-1460, above the platform UI zone), TOPMOST.
// ---------------------------------------------------------------------------------------------------------------------
const CAPS = ZCAPTIONS.map((c) => ({ tf: sh(c.t), h: c.h }));
const CAP_WIN = CAPTION_WINDOWS.map(([a, b]) => [sh(a), sh(b)]);
export const CAPTION_TOP = 1370;
const Captions: React.FC = () => {
  const { abs } = useGvp();
  const T = abs / FPS;
  if (!CAP_WIN.some(([a, b]) => T >= a && T < b)) return null;
  if (inCardPause(T)) return null;
  let cur: { tf: number; h: string } | null = null;
  for (const c of CAPS) { if (c.tf <= T) cur = c; else break; }
  if (!cur) return null;
  const nextT = (CAPS.find((c) => c.tf > cur!.tf) || { tf: Infinity }).tf;
  if (T >= Math.min(nextT, cur.tf + 1.3)) return null;
  const k = (T - cur.tf) * FPS;
  const s = interpolate(k, [0, 5, 9], [0.7, 1.12, 1], clampOpt);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', left: 50, right: 50, top: CAPTION_TOP, display: 'flex', justifyContent: 'center' }}>
        <div style={{ fontFamily: "Montserrat,'Arial Black','Segoe UI',sans-serif", fontWeight: 900, textTransform: 'lowercase', fontSize: 92,
          color: '#ffffff', WebkitTextStroke: '12px #000', paintOrder: 'stroke fill', lineHeight: 1.05, textAlign: 'center', maxWidth: 980,
          transform: `scale(${s})`, transformOrigin: '50% 50%', letterSpacing: '0.01em' }}>{cur.h}</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// THE COMPOSITION (1080x1920, fps 30, DUR = the 16:9's 6680)
// ---------------------------------------------------------------------------------------------------------------------
export const GrowthVsProductVertical: React.FC = () => {
  assertPublicDir();
  const abs = useCurrentFrame();
  const t = srcT(abs / FPS);
  return (
    <GvpClock.Provider value={{ abs, t }}>
      <AbsoluteFill style={{ backgroundColor: 'black' }}>
        <GvpStyle />
        <GvpVStyle />
        <LiveSpine />
        <CoverTrack />
        <LibTransitions />
        <KineticText />
        <CardScenes />
        {BURNS.map((b) => (
          <Sequence key={b} from={F(b) - 12} durationInFrames={25} name={'burn ' + b}><FilmBurn cut={b} /></Sequence>
        ))}
        <Captions />
      </AbsoluteFill>
    </GvpClock.Provider>
  );
};

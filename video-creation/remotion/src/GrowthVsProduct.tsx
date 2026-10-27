// GrowthVsProduct.tsx: longform-edited comp for media/growth-vs-product ("AI Growth Engineers vs. AI Product Engineers").
// Built TO the approved blueprint (EDIT-PLAN.md event log, CUE-SHEET.md, TRANSITIONS.md + TRANSITION-PLAN.json,
// COVER-PLAN.json, AS-RECORDED.md, PROJECT-LOG.md Open flags) per skills/comp-build/comp-build.md. comp-builder 2026-10-23.
// - Spine: assets/spine.mp4 = spine/ALL.e.paused.mp4 (two 1.5 s title-card pauses); every cue below is a SOURCE second of
//   spine/ALL.d.desilenced.mp4 routed through sh() / F() (the sidecar's pauses table is the time map).
// - FACE: the measured reframe (assets/face-reframe.json) on the spine and on every SpineStill; the kt-signature-open
//   whip-in + slow push on F1, the kt-side-panel picture shift + in-take kt-whip-cut on F3 / F4 / F5. No join punch-ins
//   (jumpcuts-final.json has zero punch points), so no light leaks. No bg-swap clips, no img-motion clips exist.
// - No music, no SFX, no watermark: the post-mix (mix_music.py) owns all audio but the spine VO (comp-build section 9).
import React from 'react';
import {
  AbsoluteFill, Easing, Freeze, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame,
} from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { flip } from '@remotion/transitions/flip';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { TransitionClip } from './transitions/TransitionClip';
import { ENGINES, getTransition } from './transitions/registry';
import { CAPTION_WINDOWS, ZCAPTIONS } from './GrowthVsProductCaptions';
import {
  GvpClock, GvpStyle, KtSidePanel, PassRateMeterChart, RoleLabelPop, SplitTestChart, useGvp,
} from './GrowthVsProductCharts';

loadMontserrat('normal', { weights: ['900'], subsets: ['latin'] });

// ---------------------------------------------------------------------------------------------------------------------
// 1. TIME MAP (comp-build 2 + 3d): spine/ALL.e.paused.json pauses[] (at, dur). sh(t) = t + sum(dur for at <= t).
// ---------------------------------------------------------------------------------------------------------------------
export const FPS = 30;
export const PAUSE = 1.5;                                     // sidecar pause_s (NOT the skill's 1.0 default)
export const CARD_T = [50.36, 173.085];                       // THE SCOREBOARD · WHICH ONE? (waived exact cut)
export const INSERTS = [{ at: 50.36, dur: 1.5 }, { at: 173.085, dur: 1.5 }];
export const SPINE_SECS = 219.663;                            // SOURCE spine spine/ALL.d.desilenced.mp4
export const sh = (t: number) => t + INSERTS.filter((p) => p.at <= t).reduce((s, p) => s + p.dur, 0);
export const cardStart = (b: number) => b + INSERTS.filter((p) => p.at < b).reduce((s, p) => s + p.dur, 0);
export const F = (t: number) => Math.round(sh(t) * FPS);
export const DUR = Math.round((SPINE_SECS + INSERTS.reduce((s, p) => s + p.dur, 0)) * FPS);   // 6680 = spine.mp4 frames
/** paused-spine seconds -> SOURCE seconds (held at the pause's `at` while a pause runs) */
export const srcT = (T: number) => {
  let shift = 0;
  for (const p of INSERTS) {
    const start = p.at + shift;
    if (T < start) break;
    if (T < start + p.dur) return p.at;
    shift += p.dur;
  }
  return T - shift;
};

// ---------------------------------------------------------------------------------------------------------------------
// 2. FACE: the measured reframe (comp-build 3a), the F1 signature open, the side-panel shifts.
// ---------------------------------------------------------------------------------------------------------------------
export const FACE_REFRAME = { scale: 1.313, x: -496, y: -252 };   // assets/face-reframe.json, never hand-tuned
const FACE_POINT = { x: 960, y: 432 };                            // face_point_out of the same json
const clampOpt = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const easeOut = Easing.out(Easing.cubic);
const c01 = (v: number) => Math.max(0, Math.min(1, v));

// AS-RECORDED FACE windows (blackdetect on the baked spine)
export const FACES: [number, number][] = [[0, 4.733], [45.133, 48.8], [82.6, 87.0], [122.1, 126.1], [168.567, 173.067], [200.767, 206.1], [211.7, 219.663]];

// kt-side-panel pairs on the three "this or that" FACE lines (EDIT-PLAN [KT-PANEL] rows). The picture shifts toward the free
// side: the 2023 numbers are -80 px / scale 120 percent over 0.47 s, but our measured reframe CENTRES him, so -80 px leaves
// his face under the 862 px panel. The shift therefore lands his face (measured face_cx of each window, face-reframe.json
// windows[]) in the middle of the free 55 percent: x 540 beside a RIGHT panel, x 1380 beside a LEFT panel (scale 120, 0.47 s).
const PANEL_FACE_CX_SRC: Record<string, number> = { F3: 1101.0, F4: 1194.0, F5: 1153.5 };   // face-reframe.json windows[].face_cx
const faceOut = (cxSrc: number) => cxSrc * FACE_REFRAME.scale + FACE_REFRAME.x;
export const PANELS = [
  { id: 'F3', r0: 82.7, l0: 85.32, end: 87.0, rLines: ['THE BUSINESS', 'NUMBER MOVED'], lLines: ['THE EVAL', 'SCORE MOVED'] },
  { id: 'F4', r0: 122.32, l0: 124.48, end: 126.1, rLines: ['RAPID RESULTS', 'THIS WEEK'], lLines: ['COMPOUNDING QUALITY', 'THE EVAL SET', 'OUTLIVES THE MODEL'] },
  { id: 'F5', r0: 168.7, l0: 170.62, end: 173.067, rLines: ['DISTRIBUTION', 'DATA', 'THE FUNNEL'], lLines: ['THE MODEL', 'AND THE USER'] },
].map((p) => {
  const fx = 960 + (faceOut(PANEL_FACE_CX_SRC[p.id]) - 960) * 1.2;
  return { ...p, shiftR: 540 - fx, shiftL: 1380 - fx };
});

type Fx = { s: number; dx: number; rot: number };
const faceFx = (t: number): Fx => {
  if (t < FACES[0][1]) {
    // kt-signature-open: frame-0 kt-whip-cut IN (0.73 s, scale 200 -> 100 + a 25 -> 0 degree roll) x a slow ~5 percent push
    const e = easeOut(c01(t / 0.73));
    const rot = 25 * (1 - e);
    const r = (rot * Math.PI) / 180;
    const cover = Math.cos(r) + (1920 / 1080) * Math.sin(r);   // keep the rolled frame covered
    return { s: Math.max(2 - e, cover) * (1 + 0.05 * c01(t / FACES[0][1])), dx: 0, rot };
  }
  for (const p of PANELS) {
    if (t >= p.r0 && t < p.l0) {
      const e = easeOut(c01((t - p.r0) / 0.47));
      return { s: 1 + 0.2 * e, dx: p.shiftR * e, rot: 0 };
    }
    if (t >= p.l0 && t < p.end + 0.05) {
      // in-take kt-whip-cut (0.37 s): the incoming framing lands with scale 200 -> 100
      const wz = 2 - easeOut(c01((t - p.l0) / 0.37));
      return { s: 1.2 * wz, dx: p.shiftL, rot: 0 };
    }
  }
  return { s: 1, dx: 0, rot: 0 };
};

const SpineFrame: React.FC<{ fx: Fx; children: React.ReactNode }> = ({ fx, children }) => (
  <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: 'black' }}>
    <div style={{ position: 'absolute', inset: 0, transformOrigin: `${FACE_POINT.x}px ${FACE_POINT.y}px`,
      transform: `translateX(${fx.dx}px) rotate(${fx.rot}deg) scale(${fx.s})` }}>
      {children}
    </div>
  </AbsoluteFill>
);
const spineStyle: React.CSSProperties = { position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0',
  transform: `translate(${FACE_REFRAME.x}px, ${FACE_REFRAME.y}px) scale(${FACE_REFRAME.scale})` };

/** The live spine: the comp's ONLY audio (the VO), the face reframe + the face moves. */
const LiveSpine: React.FC = () => {
  const { t } = useGvp();
  return <SpineFrame fx={faceFx(t)}><OffthreadVideo src={staticFile('spine.mp4')} style={spineStyle} /></SpineFrame>;
};
/** SpineStill (comp-build 6a): a real Freeze, muted, the SAME transform, the SAME source (no bg-swap clips here). */
const SpineStill: React.FC<{ frame: number }> = ({ frame }) => (
  <SpineFrame fx={faceFx(srcT(frame / FPS))}>
    <Freeze frame={frame}><OffthreadVideo src={staticFile('spine.mp4')} muted style={spineStyle} /></Freeze>
  </SpineFrame>
);

// ---------------------------------------------------------------------------------------------------------------------
// 3. COVERS (comp-build 4): one row per state / sub-point, straight from the EDIT-PLAN event log.
//    kind 'deck' = the Type 2 system-design DIAGRAM states (the rich slides, each state once); kind 'container' = the
//    card-slide text containers, spotlighted one line at a time (state). grp = one scene (state swaps keep its geometry and
//    its slow push; no ingress transition between same-grp rows). tr = the hand-rolled ingress: xfade (6 f, or xf frames),
//    xfs = cross-fade + 0.93 -> 1 scale-in (0.35 s), fade (0.5 s, Envato), pop (the role-label pop, no fade), whip (the
//    kt-whip-cut blur-in), cut (a library transition or a title card owns the edge). ff = enters from a FACE edge (the
//    frozen last face frame sits under the ingress). cap = captions over this Envato cover (caption scope envato).
// ---------------------------------------------------------------------------------------------------------------------
export type Kind = 'chart' | 'still' | 'vid' | 'deck' | 'container' | 'receipt';
export type Cover = { tIn: number; tOut: number; kind: Kind; ref: string; state?: string; grp?: string; tr: string; xf?: number;
  ff?: boolean; cap?: boolean; mo?: string; lead?: boolean };
export const COVERS: Cover[] = [
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
// DIAGRAM_REFS: loop-s1-base, loop-s1-test-set, loop-s1-gate, aarrr-funnel-base, aarrr-funnel-within-days, aarrr-funnel-activation, loop-s2-base, loop-s2-eval-pulse, loop-s2-retrieval, loop-s2-day3, loop-s2-upgrade, C1-s1-base, C1-s1-web, C1-s1-analytics, C1-s1-crm, C1-s1-cdp, C1-s1-experiment, C1-s1-outbound, C1-s1-agents, C1-s2-base, C1-s2-prompting, C1-s2-retrieval, C1-s2-routing, C1-s2-evalharness, C1-s2-latency, C1-s2-guardrails, C1-s2-featureui, C1-s3-base, C1-s3-llm, C1-s3-agentsorch, C1-s3-evals, C1-s3-pyts
// COMPARISON_REFS: become-compare-s1, become-compare-s2, become-compare-s3, become-compare-s4, become-compare-s5
// (end declared refs)

// The caption windows lint_covers checks against COVERS: a literal copy of CAPTION_WINDOWS (asserted equal below).
export const CAPTION_SRC: [number, number][] = [[0.0, 4.733], [45.133, 48.8], [50.35, 52.68], [70.0, 72.0], [82.6, 89.04], [105.28, 108.44], [122.1, 129.64], [168.567, 175.16], [185.02, 187.78], [200.767, 206.1], [211.7, 219.663]];
if (JSON.stringify(CAPTION_SRC) !== JSON.stringify(CAPTION_WINDOWS)) throw new Error('CAPTION_SRC drifted from GrowthVsProductCaptions.CAPTION_WINDOWS');

// 24 / 25 fps clips play frame for frame (comp-build 11): playbackRate = 30 / fps (every slot x rate fits its clip).
const VID_FPS: Record<string, number> = { 'BR-1-data-dashboard': 25 / 1, 'BR-2-laptop-browsing': 30000 / 1001, 'BR-3-stopwatch': 25 / 1, 'BR-4-phone-signup': 25 / 1, 'BR-5-reach-for-tool': 24000 / 1001, 'BR-6-interview-handshake': 25 / 1, 'BR-7-developer-night-desk': 25 / 1 };

// Role-label pops inside the card containers (EDIT-PLAN "role-label pop motion" rows): the label box (1920x1080 slide px,
// measured as the changed-pixel bbox between consecutive state PNGs) pops with the kt-keyword-pop jiggle. hide = the label
// is not on the card until its pop (C2-s4: LABEL B 0.6 s after A).
const POPS: Record<string, { t: number; box: number[]; hide?: boolean }[]> = {
  'C2-s1-s2': [{ t: 8.24, box: [222, 296, 423, 148] }],
  'C2-s1b-s1': [{ t: 18.92, box: [1018, 296, 423, 148] }],
  'C2-s2-s2': [{ t: 21.4, box: [222, 296, 486, 150] }],
  'C2-s2-s3': [{ t: 21.94, box: [1018, 296, 506, 150] }],
  'become-compare-s3': [{ t: 192.86, box: [222, 654, 283, 105] }],
  'become-compare-s5': [{ t: 196.14, box: [1018, 655, 283, 104] }],
  'C2-s4-s1': [{ t: 206.1, box: [222, 376, 284, 106] }, { t: 206.7, box: [600, 376, 280, 106], hide: true }],
};

// Receipt cameras (treatment highlight = a settling push, then the #ffe14d wipe in CAPTURE coordinates; treatment pan =
// the row's [MOTION] library move). cams: [t, cx, cy, z] = the image point (fraction) at frame centre, z = width / 1920.
// hl lines = the capture JSON anchor lines (page px minus clip, / clip size).
type Rc = { aspect: number; free?: boolean; cams: number[][]; hl?: { t: number; dur?: number; lines: number[][] }[] };
const RECEIPTS: Record<string, Rc> = {
  'C12-title-date': { aspect: 3720 / 2172, cams: [[14.78, 0.45, 0.3, 1.3], [16.2, 0.42, 0.29, 1.55]] },
  'C12-pragmatic-engineer-paragraph': { aspect: 3000 / 1623, cams: [[16.4, 0.47, 0.36, 1.05], [17.3, 0.42, 0.3, 1.18], [18.92, 0.42, 0.3, 1.21]],
    hl: [{ t: 16.66, lines: [[0.136, 0.2506, 0.5325, 0.0481]] }] },
  'C4a-crowdstrike-title-block': { aspect: 3440 / 1664, free: true, cams: [[40.32, 0.36, 0.45, 0.9]] },
  'C5a-citian-title-block': { aspect: 3440 / 1696, free: true, cams: [[42.7, 0.22, 0.45, 0.95]] },
  'C5b-citian-evals-duty': { aspect: 3258 / 1833, cams: [[60.72, 0.47, 0.45, 1.1], [61.9, 0.42, 0.4, 1.55], [64.84, 0.42, 0.4, 1.6]],
    hl: [{ t: 62.7, lines: [[0.3433, 0.3863, 0.0734, 0.0344]] }] },
  'C7a-govwell-ai-stack': { aspect: 3930 / 2211, cams: [[64.84, 0.4, 0.5, 1.2], [65.6, 0.47, 0.54, 1.75], [70.0, 0.47, 0.54, 1.8]],
    hl: [{ t: 65.64, lines: [[0.506, 0.5448, 0.2183, 0.0258]] }] },
  'C10-hamel-evals-root-cause': { aspect: 3840 / 2320, cams: [[100.54, 0.4, 0.2, 1.25], [101.3, 0.4, 0.2, 1.3], [102.45, 0.456, 0.86, 2.0], [103.22, 0.456, 0.86, 2.05]],
    hl: [{ t: 102.7, dur: 0.3, lines: [[0.3465, 0.8572, 0.2437, 0.019], [0.5902, 0.8572, 0.0681, 0.019], [0.2542, 0.8792, 0.1023, 0.019]] }] },
  'C4c-crowdstrike-translate-bullet': { aspect: 3600 / 2024, cams: [[157.32, 0.45, 0.3, 1.15], [158.4, 0.44, 0.22, 1.4], [161.94, 0.44, 0.22, 1.45]],
    hl: [{ t: 158.72, lines: [[0.4957, 0.1739, 0.2253, 0.0415], [0.1444, 0.2292, 0.4501, 0.0415]] }] },
  'C5c-citian-demo-vs-dependable': { aspect: 5190 / 2919, cams: [[161.94, 0.46, 0.16, 1.6], [162.9, 0.46, 0.11, 2.2], [165.5, 0.46, 0.11, 2.25], [166.25, 0.46, 0.9, 2.2], [168.567, 0.46, 0.9, 2.25]],
    hl: [{ t: 163.88, lines: [[0.3985, 0.0822, 0.1991, 0.0216], [0.3012, 0.111, 0.0831, 0.0216]] }, { t: 166.42, lines: [[0.4151, 0.925, 0.0549, 0.0216]] }] },
  'C7b-govwell-title-block': { aspect: 6000 / 1716, cams: [[175.16, 0.5, 0.5, 1.0], [176.8, 0.15, 0.5, 2.4], [177.0, 0.15, 0.5, 2.45]] },
  // C7b bullet: the PNG was padded after the shot (3459x546, not clip x scale), so its line comes from the JSON's image_px_lines
  'C7b-govwell-closing-gap-bullet': { aspect: 3459 / 546, cams: [[177.0, 0.5, 0.5, 1.0], [177.9, 0.546, 0.66, 1.5], [180.8, 0.546, 0.66, 1.55]],
    hl: [{ t: 178.04, lines: [[0.2509, 0.6282, 0.5909, 0.1044]] }] },
  'C6-fictiv-misumi-title-block': { aspect: 3372 / 1896, free: true, cams: [[180.8, 0.45, 0.5, 0.95]] },
};

// Scene groups: one slow push per scene so no Type 2 still sits dead still (comp-build 7a; a full diagram view pushes
// <= ~4 percent). Text containers 2 percent. AI stills 6 percent (IMG-3 pulls OUT to 1.0 by its twirl window start so the
// SpinTwirl canvas, which paints the raw PNG, takes over without a zoom pop).
const GROUPS: Record<string, [number, number]> = {};
for (const c of COVERS) if (c.grp) GROUPS[c.grp] = [Math.min(GROUPS[c.grp]?.[0] ?? 1e9, c.tIn), Math.max(GROUPS[c.grp]?.[1] ?? 0, c.tOut)];
const groupPush = (c: Cover, t: number) => {
  if (!c.grp) return 1;
  const [a, b] = GROUPS[c.grp];
  return 1 + (c.kind === 'deck' ? 0.035 : 0.02) * c01((t - a) / (b - a));
};
export const STILL_PUSH: Record<string, [number, number, number]> = { 'IMG-3-glass-funnel-particles': [1.06, 1.0, 131.76] };

// ---------------------------------------------------------------------------------------------------------------------
// 4. COVER NODES: every node reads the ABSOLUTE clock (GvpClock), so the same node is correct inside any engine nesting.
// ---------------------------------------------------------------------------------------------------------------------
const fill: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };

const cardPop = (dt: number) => {
  // the kt-keyword-pop jiggle (100 -> 110 over 0.20 s, 0/+2/-2/+1/-0.5/0 deg) settling back to 100 by 0.35 s inside a card,
  // so the next state's cross-fade never shrinks a held 110 label
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
          return p.hide ? <div key={i} style={{ position: 'absolute', left: x - pad, top: y - pad, width: w + 2 * pad, height: h + 2 * pad, background: 'rgb(21,24,31)' }} /> : null;
        }
        const pm = cardPop(t - p.t);
        if (pm.s === 1 && pm.rot === 0 && pm.blur === 0) return null;
        return (
          <div key={i} style={{ position: 'absolute', left: x - pad, top: y - pad, width: w + 2 * pad, height: h + 2 * pad, overflow: 'hidden',
            transform: `scale(${pm.s}) rotate(${pm.rot}deg)`, filter: pm.blur > 0.2 ? `blur(${pm.blur}px)` : undefined }}>
            <Img src={staticFile(src)} style={{ position: 'absolute', left: -(x - pad), top: -(y - pad), width: 1920, height: 1080 }} />
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
const ReceiptView: React.FC<{ id: string }> = ({ id }) => {
  const { t } = useGvp();
  const rc = RECEIPTS[id];
  const [, cx, cy, z] = camAt(rc.cams, t);
  const Wd = 1920 * z, Hd = Wd / rc.aspect;
  let left = 960 - cx * Wd, top = 540 - cy * Hd;
  if (!rc.free) {   // free = a [MOTION] receipt: the title block sits at frame centre on the white page, the 3D move needs the room
    left = Wd >= 1920 ? Math.min(0, Math.max(1920 - Wd, left)) : (1920 - Wd) / 2;
    top = Hd >= 1080 ? Math.min(0, Math.max(1080 - Hd, top)) : (1080 - Hd) / 2;
  }
  return (
    <AbsoluteFill style={{ backgroundColor: '#ffffff', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left, top, width: Wd, height: Hd }}>
        <Img src={staticFile('receipts/' + id + '.png')} style={{ position: 'absolute', left: 0, top: 0, width: Wd, height: Hd }} />
        {(rc.hl || []).map((h, gi) => {
          // [HIGHLIGHT] a #ffe14d rect wiping left to right over the quoted words (multiply: black text stays black)
          const total = h.lines.reduce((s, l) => s + l[2], 0);
          const p = c01((t - h.t) / (h.dur ?? 0.5)) * total;
          let before = 0;
          return h.lines.map((l, li) => {
            const k = c01((p - before) / l[2]);
            before += l[2];
            if (k <= 0) return null;
            const hp = l[3] * Hd, pad = hp * 0.16;
            return <div key={`${gi}-${li}`} style={{ position: 'absolute', left: l[0] * Wd - pad, top: l[1] * Hd - pad * 0.6, width: (l[2] * Wd + 2 * pad) * k,
              height: hp + pad * 1.2, background: '#ffe14d', mixBlendMode: 'multiply', borderRadius: pad * 0.5 }} />;
          });
        })}
      </div>
    </AbsoluteFill>
  );
};

/** [MOTION] lib:motion-3d-* on a receipt (comp-build 6, the MOTION category): the engine wraps the live receipt for its whole
 * slot; its clock is set with Freeze and the 5 s camera move is fitted to the slot (t * 5 / slot). */
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
  const rate = 30 / VID_FPS[c.ref];
  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      <Freeze frame={Math.max(0, abs - F(c.tIn))}>
        <OffthreadVideo src={staticFile('vid/' + c.ref + '.mp4')} muted playbackRate={rate} style={fill} />
      </Freeze>
    </AbsoluteFill>
  );
};

const CoverNode: React.FC<{ c: Cover }> = ({ c }) => {
  const { t } = useGvp();
  if (c.kind === 'chart') {
    if (c.ref === 'split-test') return <SplitTestChart />;
    if (c.ref === 'pass-rate-meter') return <PassRateMeterChart />;
    throw new Error('chart without an animated component: ' + c.ref);
  }
  if (c.kind === 'vid') return <VidNode c={c} />;
  if (c.kind === 'still') {
    const [s0, s1, tEnd] = STILL_PUSH[c.ref] ?? [1.0, 1.06, c.tOut];
    const s = interpolate(t, [c.tIn, tEnd], [s0, s1], clampOpt);
    return (
      <AbsoluteFill style={{ backgroundColor: 'black', overflow: 'hidden' }}>
        <Img src={staticFile('img/' + c.ref + '.png')} style={{ ...fill, transform: `scale(${s})` }} />
      </AbsoluteFill>
    );
  }
  if (c.kind === 'receipt') {
    const view = <ReceiptView id={c.ref} />;
    return c.mo ? <MotionWrap id={c.mo} tIn={c.tIn} tOut={c.tOut}>{view}</MotionWrap> : view;
  }
  // deck (diagram state) / container (card-slide state)
  const dir = c.kind === 'deck' ? 'diagrams/' : 'card-slides/';
  const s = groupPush(c, t);
  let pulse: React.ReactNode = null;
  let src = dir + c.ref + '.png';
  if (c.ref === 'loop-s2-eval-pulse') {
    // state cue: cross-fade in over 4 f, hold ~0.6 s, fade back to base over 8 f
    const o = interpolate(t, [c.tIn, c.tIn + 4 / FPS, c.tIn + 4 / FPS + 0.6, c.tIn + 12 / FPS + 0.6], [0, 1, 1, 0], clampOpt);
    src = dir + 'loop-s2-base.png';
    pulse = <AbsoluteFill style={{ opacity: o }}><Img src={staticFile(dir + c.ref + '.png')} style={fill} /></AbsoluteFill>;
  }
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0c10', overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `scale(${s})` }}>
        <SlideImg src={src} pops={POPS[c.ref]} />
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

// ingress frames per hand-rolled transition
const ingressF = (c: Cover) => {
  if (c.tr === 'xfade') return c.xf ?? 6;                // hand:xfade (container-xfade, 0.20s)
  if (c.tr === 'xfs') return c.ref === 'split-test' ? 12 : 11;   // hand:xfade-scale (container-xfade, 0.35s); split-test spec 12 f
  if (c.tr === 'fade') return 15;                        // hand:fade (broll-fade, 0.50s)
  if (c.tr === 'whip') return 5;                         // hand:kt-whip-cut blur-in variant (0.17s)
  return 0;
};

/** One COVERS row on the cover track: the row's node + its hand-rolled ingress. A cross-fade keeps the previous row drawn
 * underneath for the ingress frames (its Sequence carries a tail); a FACE-edge ingress puts the frozen last face frame under. */
const CoverSlot: React.FC<{ c: Cover }> = ({ c }) => {
  const { abs } = useGvp();
  const lf = abs - F(c.tIn);
  const n = ingressF(c);
  let style: React.CSSProperties = {};
  if (n > 0 && lf < n) {
    const p = c01(lf / n);
    if (c.tr === 'whip') {
      const e = easeOut(p);
      style = { filter: `blur(${(40 * (1 - e)).toFixed(2)}px)`, transform: `translateY(${540 * (1 - e)}px) scale(${1.2 - 0.2 * e})` };
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
// 5. LIBRARY TRANSITIONS (comp-build 6 + 6a): each TransitionClip gets a Sequence of EXACTLY its engine window
//    (from = F(cut) - round(win/2), durationInFrames = win, cutFrame = round(win/2)); nodes read the absolute clock;
//    the comp's SFX are the post-mix (sfx={false}). Video sides hand the engine a CUTFRAME still (the cost trap).
// ---------------------------------------------------------------------------------------------------------------------
// TRANSITIONS_WAIVED: melt-rgb-short-3 — named only in TRANSITIONS.md Open questions as a promotable alternative for 77.52 (Mike's call); the plan row is hand:xfade
// TRANSITIONS_WAIVED: roughly-1x — named only in TRANSITIONS.md Open questions as the quieter AI-still fallback; the plan rows are GLITCH/Monitor
// TRANSITIONS_WAIVED: roughly-2x — named only in TRANSITIONS.md Open questions as the quieter AI-still fallback; the plan rows are GLITCH/Monitor
const CUTFRAME: Record<string, string> = {
  'BR-5-reach-for-tool': 'transitions/cutframes/BR-5-cut.jpg',        // clip frame 96 = the window's first frame
  'BR-7-developer-night-desk': 'transitions/cutframes/BR-7-cut.jpg',  // clip frame 71 = the window's first frame
};
export const LIB_TR: { cut: number; id: string; from: string; to: string; fromSrc?: string; toSrc?: string }[] = [
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
const sceneFn = (ref: string) => {
  const cf = CUTFRAME[ref];
  if (cf) return () => <Img src={staticFile(cf)} style={{ width: 1920, height: 1080, objectFit: 'cover' }} />;
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
            fromSrc={r.fromSrc} toSrc={r.toSrc} />
        </Sequence>
      );
    })}
  </>
);

// ---------------------------------------------------------------------------------------------------------------------
// 6. TITLE CARDS: rmn:flip (card, 0.50s), from-right, the ONE card pick. A self-contained TransitionSeries scene around each
//    baked 1.5 s pause (never the spine): outgoing -> flip in -> the card held through the pause -> flip out to the incoming
//    cover. The card turns in BEFORE / AT the pause and stays fully readable >= 1.0 s (asserted).
// ---------------------------------------------------------------------------------------------------------------------
export const TURN = 15;   // 0.50 s
export const CARDS = [
  { at: 50.36, png: 'title-slides/title-card-CH2.png', lead: 9, from: 'C2-s2-s6', faceEnd: 0, to: 'BR-1-data-dashboard' },
  // CH5: the F5 face-out film burn peaks on the face's last frame, the flip takes over at the waived cut (lead 0)
  { at: 173.085, png: 'title-slides/title-card-CH5.png', lead: 0, from: '', faceEnd: 173.067, to: 'BR-6-interview-handshake' },
];
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
      const cardDur = cd.lead + pauseF + TURN;   // the exit flip starts on the pause's last frame + 1
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
// 7. FILM BURN: hand:film-burn (face-cut, 0.76s), the video's face pick, on every regular FACE edge (TRANSITION-PLAN rows).
// ---------------------------------------------------------------------------------------------------------------------
export const BURNS = [45.133, 48.8, 82.6, 87.0, 122.1, 126.1, 168.567, 173.067, 200.767, 206.1, 211.7];
const FilmBurn: React.FC<{ cut: number }> = ({ cut }) => {
  const { abs } = useGvp();
  const u = (abs - F(cut)) / 11.4;   // -1 .. 1 over the 0.76 s window, peak ON the cut frame
  if (Math.abs(u) > 1) return null;
  const env = Math.pow(1 - Math.abs(u), 1.6);
  const x = 28 + 44 * ((u + 1) / 2);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: env,
        background: `radial-gradient(ellipse 70% 95% at ${x}% 45%, rgba(255,240,210,1) 0%, rgba(255,160,50,.95) 26%, rgba(225,80,15,.75) 52%, rgba(120,25,0,0) 86%)` }} />
      <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: env * 0.55,
        background: `radial-gradient(circle at ${100 - x}% 72%, rgba(255,120,30,.9) 0%, rgba(255,60,0,0) 58%)` }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// 8. KINETIC TEXT (overlays.md 2): above the covers, below the captions.
// ---------------------------------------------------------------------------------------------------------------------
const KineticText: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: 'none' }}>
    {/* kt-signature-open: ROLE LABEL A on 'AI growth engineer' 2.00, LABEL B stacked below on 'AI product engineer' 3.64,
        right third, held to the 4.733 whip-out (cash-register / wooden-rattle-whoosh are post-mix) */}
    <RoleLabelPop t0={2.0} t1={4.733} role="a" line1="AI GROWTH" x={1215} y={400} size={80} />
    <RoleLabelPop t0={3.64} t1={4.733} role="b" line1="AI PRODUCT" x={1215} y={610} size={80} />
    {/* kt-side-panel pairs: RIGHT = growth verdict, in-take kt-whip-cut, LEFT = product verdict (swoosh-1 / whoosh-4 /
        swoosh-2 are post-mix). hand:kt-whip-cut (kt-whip-cut, 0.37s) at 85.32 / 124.48 / 170.62 lives in faceFx. */}
    {PANELS.map((p) => (
      <React.Fragment key={p.id}>
        <KtSidePanel side="R" t0={p.r0} t1={p.l0} role="a" lines={p.rLines} />
        <KtSidePanel side="L" t0={p.l0} t1={p.end} role="b" lines={p.lLines} />
      </React.Fragment>
    ))}
    {/* the role labels return over IMG-5 on 'ends' 199.68 / 'being' 200.26, removed by the F6 cut-in 200.767 (t1 200.76: frame 6113 is the first F6 frame, t = 200.7667) */}
    <RoleLabelPop t0={199.68} t1={200.76} role="a" line1="GROWTH" x={1150} y={853} size={58} align="center" boxed />
    <RoleLabelPop t0={200.26} t1={200.76} role="b" line1="PRODUCT" x={1590} y={853} size={58} align="center" boxed />
  </AbsoluteFill>
);

// ---------------------------------------------------------------------------------------------------------------------
// 9. CAPTIONS (comp-build 8): generated data only, inside CAPTION_WINDOWS, Montserrat house style, TOPMOST.
// ---------------------------------------------------------------------------------------------------------------------
const CAPS = ZCAPTIONS.map((c) => ({ tf: sh(c.t), h: c.h }));
const CAP_WIN = CAPTION_WINDOWS.map(([a, b]) => [sh(a), sh(b)]);
const Captions: React.FC = () => {
  const { abs } = useGvp();
  const T = abs / FPS;
  if (!CAP_WIN.some(([a, b]) => T >= a && T < b)) return null;
  if (inCardPause(T)) return null;   // never a caption over a title card
  let cur: { tf: number; h: string } | null = null;
  for (const c of CAPS) { if (c.tf <= T) cur = c; else break; }
  if (!cur) return null;
  const nextT = (CAPS.find((c) => c.tf > cur!.tf) || { tf: Infinity }).tf;
  if (T >= Math.min(nextT, cur.tf + 1.3)) return null;
  const k = (T - cur.tf) * FPS;
  const s = interpolate(k, [0, 5, 9], [0.7, 1.12, 1], clampOpt);
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 86, pointerEvents: 'none' }}>
      <div style={{ fontFamily: "Montserrat,'Arial Black','Segoe UI',sans-serif", fontWeight: 900, textTransform: 'lowercase', fontSize: 84,
        color: '#ffffff', WebkitTextStroke: '12px #000', paintOrder: 'stroke fill', lineHeight: 1.05, textAlign: 'center', maxWidth: 1500,
        transform: `scale(${s})`, letterSpacing: '0.01em' }}>{cur.h}</div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// THE COMPOSITION
// ---------------------------------------------------------------------------------------------------------------------
// inputProps.captions=false renders the picture WITHOUT the burned caption track (the 16:9-sourced short re-frames spans 9:16 and
// captions them itself; longform-to-short.md 16:9-SOURCED MODE, growth-vs-product 2026-10-23). Default true = the delivered longform.
export const GrowthVsProduct: React.FC<{ captions?: boolean }> = ({ captions = true }) => {
  const abs = useCurrentFrame();
  const t = srcT(abs / FPS);
  return (
    <GvpClock.Provider value={{ abs, t }}>
      <AbsoluteFill style={{ backgroundColor: 'black' }}>
        <GvpStyle />
        <LiveSpine />
        <CoverTrack />
        <LibTransitions />
        <KineticText />
        <CardScenes />
        {BURNS.map((b) => (
          <Sequence key={b} from={F(b) - 12} durationInFrames={25} name={'burn ' + b}><FilmBurn cut={b} /></Sequence>
        ))}
        {captions && <Captions />}
      </AbsoluteFill>
    </GvpClock.Provider>
  );
};

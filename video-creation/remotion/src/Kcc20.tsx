// Kcc20.tsx: longform-edited "kcc20" (KCC-20: Real Tokens on Kaspa L1), built TO the approved blueprint
// (EDIT-PLAN.md event log, CUE-SHEET.md, TRANSITIONS.md + TRANSITION-PLAN.json, COVER-PLAN.json, PROJECT-LOG Open flags).
// Skeletons: video-creation/longform-edited/skills/comp-build/comp-build.md ONLY (no other project's comp read or imported).
// No music, no SFX, no watermark: the post-mix (mix_music.py) owns all audio but the spine's VO.
import React from 'react';
import { AbsoluteFill, Easing, Freeze, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { slide } from '@remotion/transitions/slide';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { TransitionClip } from './transitions/TransitionClip';
import { ENGINES, getTransition, framesForRow } from './transitions/registry';
import { ZCAPTIONS, CAPTION_WINDOWS } from './Kcc20Captions';
import { ChartC15, ChartC17, ChartC4, ChartC5, H0Card, K20Clock, K20Style, KtKeywordPop, KtSidePanel, ramp, useK20 } from './Kcc20Charts';

loadMontserrat('normal', { weights: ['900'], subsets: ['latin'] });

// ---------------------------------------------------------------------------------------------------------------------
// 1. TIME MAP (comp-build sections 2 + 3d): spine/ALL.g.paused.json `pauses[]` IS the map. Every cue below is a SOURCE
//    second on spine/ALL.e.desilenced.mp4 and routes through sh()/F(). sh(t) = t + sum(dur of every pause with at <= t).
// ---------------------------------------------------------------------------------------------------------------------
export const FPS = 30;
const PAUSE = 1.5;                                                       // sidecar pause_s (the card pauses)
// pause rows that are not the clip insert: the three chapter cards + the BRAAM-1 beat pause (240.74, no card is drawn there)
export const CARD_T = [30.355, 174.455, 207.36, 240.74];
// every pause, as baked: 3 cards (1.5 s), CLIP-1 (20.5 s, Sivan Helfer's own voice is in the VO), BRAAM-1 (4.7 s beat)
export const INSERTS = [
  { at: 30.355, dur: 1.5 },
  { at: 162.295, dur: 20.5 },
  { at: 174.455, dur: 1.5 },
  { at: 207.36, dur: 1.5 },
  { at: 240.74, dur: 4.7 },
];
export const SPINE_SECS = 328.992;                                      // SOURCE spine (ALL.e.desilenced.mp4)
const SPINE_FRAMES = 10761;                                             // assets/spine.mp4 = ALL.g.paused.mp4, 358.71 s
const END_HOLD_SRC = SPINE_SECS;                                        // no hold: Mike 2026-10-22 cut the video after "later." (MUSIC-PLAN end_card_hold.trim; the mixer keeps the chord's placement)
export const sh = (t: number) => t + INSERTS.filter((p) => p.at <= t + 1e-6).reduce((s, p) => s + p.dur, 0);
const preSh = (t: number) => t + INSERTS.filter((p) => p.at < t - 1e-6).reduce((s, p) => s + p.dur, 0);   // a pause's own start
export const F = (t: number) => Math.round(sh(t) * FPS);
const preF = (t: number) => Math.round(preSh(t) * FPS);
/** composition frame -> SOURCE second (held at `at` inside a pause; past the spine end it keeps running) */
const srcT = (abs: number) => {
  const p = abs / FPS;
  let acc = 0;
  for (const q of INSERTS) {
    const start = q.at + acc;
    if (p < start) break;
    if (p < start + q.dur) return q.at;
    acc += q.dur;
  }
  return p - acc;
};
// DUR = the paused spine + the approved end-card hold (the last face frame held while Bed D's chord rings out)
export const DUR = SPINE_FRAMES + Math.round((END_HOLD_SRC - SPINE_SECS) * FPS);
if (F(SPINE_SECS) !== SPINE_FRAMES) throw new Error(`time map drift: F(SPINE_SECS)=${F(SPINE_SECS)} vs spine ${SPINE_FRAMES} frames`);
if (Math.abs(INSERTS.reduce((s, p) => s + p.dur, 0) - (358.71 - SPINE_SECS)) > 0.05) throw new Error('INSERT durations do not add up to the paused spine');

// ---------------------------------------------------------------------------------------------------------------------
// 2. FACE REFRAME (comp-build 3a, MEASURED by measure_face_reframe.py -> assets/face-reframe.json; never hand-tuned)
// ---------------------------------------------------------------------------------------------------------------------
export const FACE_REFRAME = { scale: 1.248, x: -377, y: -167 };
const FACE_POINT = { x: 960, y: 432 };                                  // json face_point_out: punch-ins scale about it
const FACE_WINDOWS: [number, number][] = [[0.0, 6.833], [19.633, 28.167], [252.9, 328.992]];
const PUNCH_K = 1.18;
// [PUNCH-IN] rows: a hard step ON a desilencer / burst join (spine/jumpcuts-final.json), alternating in / out per window
const PUNCHES: { t: number; dir: 'in' | 'out'; leak: string }[] = [
  { t: 3.8, dir: 'in', leak: 'lightleaks-1' },          // F1 · TRANSITIONS lib:lightleaks-1 (punch-leak)
  { t: 22.567, dir: 'in', leak: 'lightleaks-4' },       // F2 · lib:lightleaks-4
  { t: 26.267, dir: 'out', leak: 'lightleaks-short-1' },// F2 · lib:lightleaks-short-1
  { t: 257.6, dir: 'in', leak: 'lightleaks-1' },        // F3 · lib:lightleaks-1
  { t: 262.267, dir: 'out', leak: 'lightleaks-4' },     // F3 head-jump mask · lib:lightleaks-4
  { t: 285.667, dir: 'in', leak: 'lightleaks-1' },      // F3 · lib:lightleaks-1
  { t: 295.767, dir: 'out', leak: 'lightleaks-short-4' },// F3 · lib:lightleaks-short-4
  { t: 308.567, dir: 'in', leak: 'lightleaks-4' },      // F3 · lib:lightleaks-4
  { t: 328.367, dir: 'out', leak: 'lightleaks-short-1' },// F3 on 'later.' · lib:lightleaks-short-1
];
const punchAt = (t: number) => {
  const w = FACE_WINDOWS.find(([a, b]) => t >= a && t < b);
  if (!w) return 1;
  let k = 1;
  for (const p of PUNCHES) if (p.t >= w[0] && p.t <= t + 1e-6) k = p.dir === 'in' ? PUNCH_K : 1;
  return k;
};
const spineStyle: React.CSSProperties = {
  position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0',
  transform: `translate(${FACE_REFRAME.x}px, ${FACE_REFRAME.y}px) scale(${FACE_REFRAME.scale})`,
};
const PunchBox: React.FC<{ k: number; children: React.ReactNode }> = ({ k, children }) => (
  <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: 'black', transformOrigin: `${FACE_POINT.x}px ${FACE_POINT.y}px`, transform: `scale(${k})` }}>{children}</AbsoluteFill>
);
/** the live spine (THE VO): the only unmuted media in the comp */
const SpineLayer: React.FC = () => {
  const { t } = useK20();
  return <PunchBox k={punchAt(t)}><OffthreadVideo src={staticFile('spine.mp4')} style={spineStyle} /></PunchBox>;
};
/** a LIVE muted copy of the spine for an engine window, synced to the absolute clock in any nesting (6a) */
const SpineLive: React.FC<{ k: number }> = ({ k }) => {
  const { abs } = useK20();
  const local = useCurrentFrame();
  return <PunchBox k={k}><OffthreadVideo src={staticFile('spine.mp4')} muted trimBefore={Math.max(0, abs - local)} style={spineStyle} /></PunchBox>;
};
/** SpineStill (6a): a REAL <Freeze>, muted, the SAME transform, the SAME source (no bg-swap clip exists on this video) */
const SpineStill: React.FC<{ frame: number; k: number }> = ({ frame, k }) => (
  <PunchBox k={k}><Freeze frame={frame}><OffthreadVideo src={staticFile('spine.mp4')} muted style={spineStyle} /></Freeze></PunchBox>
);

// ---------------------------------------------------------------------------------------------------------------------
// 3. COVER TRACK (comp-build section 4): one row per state / sub-point, straight from the EDIT-PLAN event log.
//    Consecutive same-ref rows are STATE SWAPS (no ingress transition, a 6-frame state cross-fade only).
//    kinds: vid (Envato) · still (ChatGPT image; `clip` = its img-motion Seedance clip, 3c) · receipt · deck (a rich
//    diagram's first state) · container (its next spotlight states) · chart (Type 1 animated, live code) · clipstill
//    (CLIP-1 lead-in / lead-out frame, 3d). Pause-adjacent edges use the BAKED pause times (30.355, 162.295, 174.455, 207.36).
// ---------------------------------------------------------------------------------------------------------------------
type Cover = {
  tIn: number; tOut: number; kind: 'vid' | 'still' | 'receipt' | 'deck' | 'container' | 'chart' | 'clipstill'; ref: string;
  state?: string; lead?: boolean; cap?: boolean; clip?: string; tr?: 'pan' | 'highlight' | 'push'; mo?: string; side?: 'L' | 'R';
  bzx?: number; bzy?: number; bzs?: number;
};
// DIAGRAM_REFS: diagram-covenant-stack, c1-state-01, c1-state-02, c1-state-03, c2-borrowed-receive-left, c2-borrowed-receive-right, c3-marquee
// (end declared refs)
export const COVERS: Cover[] = [
  // CH1 LAST CALL
  { tIn: 6.833, tOut: 9.36, kind: 'vid', ref: 'BR-1-teal-particles' },                                  // + the H0 card; face-owned cut (hand:film-burn)
  { tIn: 9.36, tOut: 13.84, kind: 'receipt', ref: 'C9-pr31-merged', tr: 'pan', mo: 'motion-3d-pan-1-right' },   // hand:xfade-scale · [MOTION] lib:motion-3d-pan-1-right
  { tIn: 13.84, tOut: 16.98, kind: 'receipt', ref: 'RX4-pr31-status-diff', tr: 'highlight' },          // hand:xfade-scale · [HIGHLIGHT] 'Status: Last Call' 15.48
  { tIn: 16.98, tOut: 19.633, kind: 'vid', ref: 'BR-2-server-corridor', lead: true },                   // hand:fade · leading dolly into F2
  { tIn: 28.167, tOut: 30.355, kind: 'still', ref: 'IMG-1-circuit-k-macro', clip: 'IMG-1-circuit-k-macro-motion' },  // face-owned ingress (hand:film-burn)
  // CH2 HOW KCC-20 WORKS
  { tIn: 30.355, tOut: 32.6, kind: 'vid', ref: 'BR-4-network-nodes' },                                  // hand:fade off the card
  { tIn: 32.6, tOut: 37.62, kind: 'receipt', ref: 'C12-toccata-release-v2.0.0', tr: 'highlight' },     // hand:xfade-scale · [HIGHLIGHT] 'June 30, 2026'
  { tIn: 37.62, tOut: 40.5, kind: 'deck', ref: 'diagram-covenant-stack', state: 'coin' },              // hand:xfade-scale
  { tIn: 40.5, tOut: 42.7, kind: 'container', ref: 'diagram-covenant-stack', state: 'spent' },
  { tIn: 42.7, tOut: 44.46, kind: 'container', ref: 'diagram-covenant-stack', state: 'next' },
  { tIn: 44.46, tOut: 50.74, kind: 'deck', ref: 'card-rulebook', state: 'solo' },                      // hand:xfade-scale, slow push
  { tIn: 50.74, tOut: 54.24, kind: 'still', ref: 'IMG-2-identical-coin-grid' },                         // hand:cross-warp
  { tIn: 54.24, tOut: 60.28, kind: 'deck', ref: 'c1-state-01', state: 'base', side: 'L' },             // hand:xfade-scale + kt-side-panel RIGHT 'IDEA ONE'
  { tIn: 60.28, tOut: 61.16, kind: 'container', ref: 'c1-state-01', state: 'amount', side: 'L' },
  { tIn: 61.16, tOut: 62.22, kind: 'container', ref: 'c1-state-01', state: 'owner', side: 'L' },
  { tIn: 62.22, tOut: 63.68, kind: 'container', ref: 'c1-state-01', state: 'settings', side: 'L' },
  { tIn: 63.68, tOut: 65.02, kind: 'container', ref: 'c1-state-01', state: 'entrypoint', side: 'L' },
  { tIn: 65.02, tOut: 68.92, kind: 'vid', ref: 'BR-5-phone-hand-cyan' },                                // hand:fade
  { tIn: 68.92, tOut: 74.66, kind: 'deck', ref: 'c1-state-02', state: 'base', side: 'R' },             // hand:xfade-scale + panel LEFT 'IDEA TWO'
  { tIn: 74.66, tOut: 75.48, kind: 'container', ref: 'c1-state-02', state: 'digest', side: 'R' },
  { tIn: 75.48, tOut: 78.5, kind: 'vid', ref: 'BR-6-envelope-handoff' },                                // hand:fade
  { tIn: 78.5, tOut: 84.92, kind: 'deck', ref: 'c1-state-03', state: 'base', side: 'L' },              // hand:xfade-scale + panel RIGHT 'IDEA THREE'
  { tIn: 84.92, tOut: 86.06, kind: 'container', ref: 'c1-state-03', state: 's00', side: 'L' },
  { tIn: 86.06, tOut: 87.3, kind: 'container', ref: 'c1-state-03', state: 's01', side: 'L' },
  { tIn: 87.3, tOut: 88.16, kind: 'container', ref: 'c1-state-03', state: 's03', side: 'L' },
  { tIn: 88.16, tOut: 91.9, kind: 'container', ref: 'c1-state-03', state: 's04', side: 'L' },          // + kt-keyword-pop 89.28
  { tIn: 91.9, tOut: 98.92, kind: 'deck', ref: 'c2-borrowed-receive-left', state: 'base', side: 'R' }, // hand:xfade-scale + panel LEFT 'IDEA FOUR'
  { tIn: 98.92, tOut: 100.88, kind: 'container', ref: 'c2-borrowed-receive-left', state: 'kas', side: 'R' },
  { tIn: 100.88, tOut: 104.92, kind: 'container', ref: 'c2-borrowed-receive-left', state: 'mass', side: 'R' },   // + kt-keyword-pop 'STORAGE MASS'
  { tIn: 104.92, tOut: 110.66, kind: 'deck', ref: 'c2-borrowed-receive-right', state: 'base' },        // hand:xfade-scale (the declared A-vs-B second state)
  { tIn: 110.66, tOut: 112.7, kind: 'container', ref: 'c2-borrowed-receive-right', state: 'owner' },
  { tIn: 112.7, tOut: 115.04, kind: 'container', ref: 'c2-borrowed-receive-right', state: 'floor' },
  { tIn: 115.04, tOut: 116.22, kind: 'container', ref: 'c2-borrowed-receive-right', state: 'amount' }, // + kt-keyword-pop 'ONLY THE TOKEN AMOUNT GROWS'
  // CH3 KCC-20 VS KRC-20
  { tIn: 116.22, tOut: 120.14, kind: 'still', ref: 'IMG-3-krc20-token-crowd' },                         // hand:cross-warp
  { tIn: 120.14, tOut: 125.46, kind: 'receipt', ref: 'RX1-kasplex-org', tr: 'pan', mo: 'motion-3d-offset-2-left-up' },   // hand:xfade-scale · [MOTION]
  { tIn: 125.46, tOut: 129.74, kind: 'chart', ref: 'c4-token-count', state: 's1' },                    // hand:xfade-scale · live C4
  { tIn: 129.74, tOut: 131.22, kind: 'vid', ref: 'BR-7-stadium-roar' },                                 // hand:fade
  { tIn: 131.22, tOut: 133.48, kind: 'deck', ref: 'c3-marquee', state: 'base' },                       // SPIN lib:spin-center-swinging-cw (FX below)
  { tIn: 133.48, tOut: 136.48, kind: 'container', ref: 'c3-marquee', state: 'krc-1' },
  { tIn: 136.48, tOut: 138.8, kind: 'container', ref: 'c3-marquee', state: 'krc-2' },
  { tIn: 138.8, tOut: 141.5, kind: 'container', ref: 'c3-marquee', state: 'krc-3' },
  { tIn: 141.5, tOut: 143.64, kind: 'container', ref: 'c3-marquee', state: 'krc-4' },
  { tIn: 143.64, tOut: 147.14, kind: 'container', ref: 'c3-marquee', state: 'kcc-1' },
  { tIn: 147.14, tOut: 150.06, kind: 'container', ref: 'c3-marquee', state: 'kcc-2' },
  { tIn: 150.06, tOut: 153.08, kind: 'container', ref: 'c3-marquee', state: 'kcc-3' },
  { tIn: 153.08, tOut: 153.66, kind: 'container', ref: 'c3-marquee', state: 'kcc-4' },
  { tIn: 153.66, tOut: 154.62, kind: 'container', ref: 'c3-marquee', state: 'both' },
  { tIn: 154.62, tOut: 158.48, kind: 'receipt', ref: 'RX2-xxim-masterclass-watch', tr: 'push' },       // hand:xfade-scale
  { tIn: 158.48, tOut: 162.295, kind: 'clipstill', ref: 'CLIP-1-first' },                              // LEAD-IN still, hand:xfade-scale
  { tIn: 162.295, tOut: 164.44, kind: 'clipstill', ref: 'CLIP-1-last' },                               // LEAD-OUT still (out of the insert-out fade)
  { tIn: 164.44, tOut: 169.54, kind: 'chart', ref: 'c4-token-count', state: 's2' },                    // MELT lib:melt-equidistant-short-2 (FX below)
  { tIn: 169.54, tOut: 171.52, kind: 'receipt', ref: 'C18-kasstacker-covenants', tr: 'push' },         // hand:xfade-scale
  { tIn: 171.52, tOut: 174.455, kind: 'still', ref: 'IMG-4-coin-fused-bedrock' },                       // hand:cross-warp
  // CH4 WHERE IT STANDS
  { tIn: 174.455, tOut: 177.06, kind: 'receipt', ref: 'C10-kccs-commits-log', tr: 'pan', mo: 'motion-3d-orbit-2-right-down' },   // [MOTION]
  { tIn: 177.06, tOut: 190.52, kind: 'chart', ref: 'c5-timeline', state: 'p1' },                       // hand:xfade-scale · live C5 path
  { tIn: 190.52, tOut: 193.78, kind: 'vid', ref: 'BR-8-board-game-hop' },                               // hand:fade
  { tIn: 193.78, tOut: 199.46, kind: 'chart', ref: 'c5-timeline', state: 'p2' },                       // hand:xfade-scale
  { tIn: 199.46, tOut: 204.36, kind: 'chart', ref: 'c5-final-square', state: 'final' },                // hand:cut (one continuous board) · the FINAL stamp
  { tIn: 204.36, tOut: 205.86, kind: 'receipt', ref: 'RX3-kccs-readme-final', tr: 'highlight' },       // hand:xfade-scale
  { tIn: 205.86, tOut: 207.36, kind: 'receipt', ref: 'C20-issue11-kaspacom', tr: 'highlight' },        // hand:xfade-scale
  // CH5 THE BIGGER PICTURE
  { tIn: 207.36, tOut: 209.9, kind: 'vid', ref: 'BR-11-earth-pullback', lead: true },                   // hand:fade off the card
  { tIn: 209.9, tOut: 214.72, kind: 'receipt', ref: 'C13-rusty-kaspa-master-commits', tr: 'push' },    // hand:xfade-scale, two-stage push
  { tIn: 214.72, tOut: 218.2, kind: 'vid', ref: 'BR-12-coders-night' },                                 // hand:fade
  { tIn: 218.2, tOut: 221.14, kind: 'vid', ref: 'BR-13-steam-night-teal' },                             // hand:fade
  { tIn: 221.14, tOut: 223.44, kind: 'still', ref: 'IMG-7-knight-ridge', clip: 'IMG-7-knight-ridge-motion' },   // lib:blocks-short-1 (FX below)
  { tIn: 223.44, tOut: 225.48, kind: 'receipt', ref: 'C14-branch-commits', tr: 'push' },               // hand:xfade-scale
  { tIn: 225.48, tOut: 233.28, kind: 'chart', ref: 'c15-daily-transactions', state: 'draw' },          // hand:xfade-scale · live C15
  { tIn: 233.28, tOut: 236.78, kind: 'vid', ref: 'BR-14-asic-mining-rigs', lead: true },                // hand:fade
  { tIn: 236.78, tOut: 241.06, kind: 'chart', ref: 'c17-supply-ring', state: 'fill', bzx: 600, bzy: 622, bzs: 2.4 },   // hand:xfade-scale · BRAAM zoom
  { tIn: 241.06, tOut: 243.64, kind: 'still', ref: 'IMG-8-crowd-narrow-pass' },                         // hand:cross-warp
  { tIn: 243.64, tOut: 246.8, kind: 'still', ref: 'IMG-9-balance-scale-asymmetry' },                    // hand:cross-warp
  { tIn: 246.8, tOut: 249.76, kind: 'still', ref: 'IMG-10-summit-cyan-moon-k' },                        // lib:blocks-max-2 (FX below), slow push-in
  { tIn: 249.76, tOut: 252.9, kind: 'vid', ref: 'BR-15-ridge-flight-twilight', lead: true },            // hand:fade, ends on the F3 edge
];
// captions: ON over the 3 FACE windows only (never over a cover); must equal Kcc20Captions.ts CAPTION_WINDOWS
const CAPTION_SRC: [number, number][] = [[0.000, 6.833], [19.633, 28.167], [252.900, 328.992]];
if (JSON.stringify(CAPTION_SRC) !== JSON.stringify(CAPTION_WINDOWS)) throw new Error('CAPTION_SRC differs from Kcc20Captions CAPTION_WINDOWS');

// clip frame rates (comp-build section 11: 24 / 25 fps clips play frame-for-frame, playbackRate = 30 / fps)
const VID_FPS: Record<string, number> = {
  'BR-1-teal-particles': 30000 / 1001,
  'BR-2-server-corridor': 30000 / 1001,
  'BR-4-network-nodes': 25 / 1,
  'BR-5-phone-hand-cyan': 25 / 1,
  'BR-6-envelope-handoff': 30000 / 1001,
  'BR-7-stadium-roar': 24000 / 1001,
  'BR-8-board-game-hop': 25 / 1,
  'BR-11-earth-pullback': 25 / 1,
  'BR-12-coders-night': 24 / 1,
  'BR-13-steam-night-teal': 30000 / 1001,
  'BR-14-asic-mining-rigs': 24000 / 1001,
  'BR-15-ridge-flight-twilight': 30000 / 1001,
  'IMG-1-circuit-k-macro-motion': 24 / 1,
  'IMG-7-knight-ridge-motion': 24 / 1,
};
const VID_DUR: Record<string, number> = {
  'BR-1-teal-particles': 4.5045, 'BR-2-server-corridor': 5.2052, 'BR-4-network-nodes': 4.0, 'BR-5-phone-hand-cyan': 4.8,
  'BR-6-envelope-handoff': 5.005, 'BR-7-stadium-roar': 3.5035, 'BR-8-board-game-hop': 4.12, 'BR-11-earth-pullback': 4.28,
  'BR-12-coders-night': 6.0, 'BR-13-steam-night-teal': 4.6713, 'BR-14-asic-mining-rigs': 5.4221, 'BR-15-ridge-flight-twilight': 5.005,
  'IMG-1-circuit-k-macro-motion': 4.0417, 'IMG-7-knight-ridge-motion': 4.0417,
};

// ---------------------------------------------------------------------------------------------------------------------
// 4. RECEIPTS: real pixels, full video WIDTH (CH1-CH3), inside the chapter's accent frame (CH4 gold, CH5 cyan; Mike
//    2026-10-20). treatment pan = the library MOTION move (TRANSITIONS section 5), push = settling camera, highlight =
//    #ffe14d wipe in CAPTURE coordinates, multiply, on the word's onset (longform-edited section 7).
// ---------------------------------------------------------------------------------------------------------------------
type CamKey = { t: number; s: number; fx: number; fy: number };
type Hl = { x: number; y: number; w: number; h: number; t0: number };
type RxSpec = { w: number; h: number; frame: 'none' | 'gold' | 'cyan'; bg: string; cam: CamKey[]; hl?: Hl[] };
const RX: Record<string, RxSpec> = {
  'C9-pr31-merged': { w: 1906, h: 366, frame: 'none', bg: '#ffffff', cam: [{ t: 9.36, s: 1, fx: 953, fy: 183 }] },
  'RX4-pr31-status-diff': { w: 3104, h: 912, frame: 'none', bg: '#ffffff',
    cam: [{ t: 13.84, s: 1, fx: 1552, fy: 456 }, { t: 15.3, s: 2.0, fx: 760, fy: 560 }],
    hl: [{ x: 225, y: 594, w: 233, h: 28, t0: 15.48 }] },
  'C12-toccata-release-v2.0.0': { w: 2500, h: 1406, frame: 'none', bg: '#ffffff',
    cam: [{ t: 32.6, s: 1, fx: 1250, fy: 703 }, { t: 33.6, s: 1.3, fx: 1900, fy: 520 }, { t: 36.74, s: 1.3, fx: 1900, fy: 520 }, { t: 37.5, s: 1.45, fx: 1500, fy: 470 }],
    hl: [{ x: 2027, y: 481, w: 204, h: 36, t0: 32.75 }] },
  'RX1-kasplex-org': { w: 1920, h: 1210, frame: 'none', bg: '#ffffff', cam: [{ t: 120.14, s: 1, fx: 960, fy: 540 }] },
  'RX2-xxim-masterclass-watch': { w: 2720, h: 2000, frame: 'none', bg: '#ffffff',
    cam: [{ t: 154.62, s: 1, fx: 1360, fy: 765 }, { t: 157.4, s: 1.3, fx: 900, fy: 1640 }] },
  'C18-kasstacker-covenants': { w: 2088, h: 1760, frame: 'none', bg: '#f5f9f8',
    cam: [{ t: 169.54, s: 1, fx: 1044, fy: 1100 }, { t: 171.0, s: 1.25, fx: 980, fy: 1440 }] },
  'C10-kccs-commits-log': { w: 2712, h: 926, frame: 'gold', bg: '#ffffff', cam: [{ t: 174.455, s: 1, fx: 1356, fy: 463 }] },
  'RX3-kccs-readme-final': { w: 2574, h: 1335, frame: 'gold', bg: '#ffffff',
    cam: [{ t: 204.36, s: 1, fx: 1287, fy: 668 }, { t: 205.3, s: 1.25, fx: 1900, fy: 800 }],
    hl: [{ x: 2368, y: 624, w: 100, h: 44, t0: 204.55 }, { x: 2368, y: 771, w: 100, h: 44, t0: 204.75 }, { x: 2368, y: 918, w: 100, h: 44, t0: 204.95 }] },
  'C20-issue11-kaspacom': { w: 2032, h: 1132, frame: 'gold', bg: '#ffffff',
    cam: [{ t: 205.86, s: 1, fx: 1016, fy: 566 }, { t: 206.9, s: 1.3, fx: 1100, fy: 760 }],
    hl: [{ x: 862, y: 772, w: 464, h: 32, t0: 205.95 }] },
  'C13-rusty-kaspa-master-commits': { w: 2640, h: 2220, frame: 'cyan', bg: '#ffffff',
    cam: [{ t: 210.36, s: 1, fx: 1320, fy: 1500 }, { t: 211.2, s: 1.25, fx: 1000, fy: 1830 }, { t: 213.1, s: 1.25, fx: 1000, fy: 1830 }, { t: 214.0, s: 1.45, fx: 900, fy: 1650 }] },
  'C14-branch-commits': { w: 2752, h: 632, frame: 'cyan', bg: '#ffffff',
    cam: [{ t: 223.44, s: 1, fx: 1376, fy: 316 }, { t: 224.6, s: 1.7, fx: 420, fy: 344 }] },
};
const camAt = (keys: CamKey[], t: number) => {
  if (t <= keys[0].t) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (t < b.t) {
      const u = Easing.inOut(Easing.cubic)((t - a.t) / (b.t - a.t));
      return { t, s: a.s + (b.s - a.s) * u, fx: a.fx + (b.fx - a.fx) * u, fy: a.fy + (b.fy - a.fy) * u };
    }
  }
  return keys[keys.length - 1];
};
const FRAME_ACCENT = { gold: { c: '#ffd700', rgb: '255,215,0' }, cyan: { c: '#70c7ba', rgb: '112,199,186' } };
/** a capture placed through a camera (scale s about focus fx,fy in capture px), edges clamped so the page never shows a gap */
const CapturePlate: React.FC<{ src: string; w: number; h: number; vw: number; vh: number; cam: { s: number; fx: number; fy: number }; hl?: Hl[]; t: number }> = ({ src, w, h, vw, vh, cam, hl, t }) => {
  const k = (vw / w) * cam.s;
  const dw = w * k, dh = h * k;
  let left = vw / 2 - cam.fx * k, top = vh / 2 - cam.fy * k;
  left = dw >= vw ? Math.min(0, Math.max(vw - dw, left)) : (vw - dw) / 2;
  top = dh >= vh ? Math.min(0, Math.max(vh - dh, top)) : (vh - dh) / 2;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, transformOrigin: '0 0', transform: `translate(${left}px, ${top}px) scale(${k})` }}>
      <Img src={staticFile(src)} style={{ width: w, height: h, display: 'block' }} />
      {(hl || []).map((r, i) => {
        const p = interpolate(t, [r.t0, r.t0 + 0.45], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) });
        return p > 0 ? <div key={i} style={{ position: 'absolute', left: r.x - 6, top: r.y - 4, width: (r.w + 12) * p, height: r.h + 8, background: '#ffe14d', mixBlendMode: 'multiply', borderRadius: 4 }} /> : null;
      })}
    </div>
  );
};
const ReceiptView: React.FC<{ id: string }> = ({ id }) => {
  const { t } = useK20();
  const r = RX[id];
  if (!r) throw new Error('no receipt spec for ' + id);
  const cam = camAt(r.cam, t);
  if (r.frame === 'none') {
    return <AbsoluteFill style={{ background: r.bg, overflow: 'hidden' }}><CapturePlate src={`receipts/${id}.png`} w={r.w} h={r.h} vw={1920} vh={1080} cam={cam} hl={r.hl} t={t} /></AbsoluteFill>;
  }
  const a = FRAME_ACCENT[r.frame];
  const vp = { x: 70, y: 60, w: 1780, h: 960 };
  return (
    <AbsoluteFill style={{ background: r.frame === 'cyan' ? 'radial-gradient(ellipse at 50% 115%, #0d2a27 0%, #0a0c10 60%)' : 'radial-gradient(ellipse at 85% -10%, #2a2410 0%, #0a0c10 55%)' }}>
      <div style={{ position: 'absolute', left: vp.x, top: vp.y, width: vp.w, height: vp.h, borderRadius: 18, overflow: 'hidden', background: r.bg,
        boxShadow: `0 0 0 3px ${a.c}, 0 0 60px rgba(${a.rgb},.45), 0 30px 80px rgba(0,0,0,.6)` }}>
        <CapturePlate src={`receipts/${id}.png`} w={r.w} h={r.h} vw={vp.w} vh={vp.h} cam={cam} hl={r.hl} t={t} />
      </div>
    </AbsoluteFill>
  );
};
/** [MOTION] lib:motion-3d-* on a receipt (comp-build section 6): the engine gets the live receipt as outClip; its 5 s
 * clock is fitted to the slot with <Freeze> (t * 5 / slot). */
const MotionWrap: React.FC<{ id: string; slotF: number; children: React.ReactNode }> = ({ id, slotF, children }) => {
  const local = useCurrentFrame();
  const row = getTransition(id)!;
  const Engine = ENGINES[row.engine] as React.FC<any>;
  const win = framesForRow(row, FPS);
  const ff = Math.min(win - 1, Math.round((local * win) / Math.max(1, slotF)));
  const node = () => <AbsoluteFill>{children}</AbsoluteFill>;
  return <Freeze frame={ff}><Engine from={node()} outClip={node} durationInFrames={win} params={row.params} /></Freeze>;
};

// ---------------------------------------------------------------------------------------------------------------------
// 5. Stills, motion clips, diagrams, charts
// ---------------------------------------------------------------------------------------------------------------------
const fill: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };
const StillView: React.FC<{ c: Cover }> = ({ c }) => {
  const { t } = useK20();
  const amt = c.ref === 'IMG-10-summit-cyan-moon-k' ? 0.12 : 0.06;          // I1 = the marquee image's slow push-in
  const s = 1 + amt * ramp(t, c.tIn, c.tOut, Easing.linear);
  return <AbsoluteFill style={{ overflow: 'hidden', background: '#0a0c10' }}><Img src={staticFile(`img/${c.ref}.png`)} style={{ ...fill, transform: `scale(${s})` }} /></AbsoluteFill>;
};
/** a video that freezes on its last frame instead of running off the end (a tail under the next cover's fade) */
const VidPlay: React.FC<{ src: string; ref_: string }> = ({ src, ref_ }) => {
  const local = useCurrentFrame();
  const rate = 30 / VID_FPS[ref_];
  const lastLocal = Math.floor(((VID_DUR[ref_] - 1.5 / VID_FPS[ref_]) * 30) / rate);
  return (
    <Freeze frame={lastLocal} active={local > lastLocal}>
      <OffthreadVideo src={staticFile(src)} muted playbackRate={rate} style={fill} />
    </Freeze>
  );
};
/** 3c: an image slot with a Seedance motion clip plays the clip (from clip 0, cut at the slot end, no push on top).
 * `delay` = frames held on the clip's first frame while a library glitch owns the ingress (IMG-7). */
const MotionStill: React.FC<{ c: Cover; delay: number }> = ({ c, delay }) => {
  const local = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: '#0a0c10' }}>
      {local < delay && <Img src={staticFile('transitions/cutframes/IMG-7-motion-f0.png')} style={fill} />}
      <Sequence from={delay} layout="none"><VidPlay src={`img-motion/${c.clip}.mp4`} ref_={c.clip!} /></Sequence>
    </AbsoluteFill>
  );
};
// the kinetic side panels ride their diagram (overlays.md section 2: on a cover the container is reframed into the free 55%)
const PANELS: Record<string, { t0: number; eyebrow: string; lines: string[] }> = {
  'c1-state-01': { t0: 54.24, eyebrow: 'IDEA ONE', lines: ['A COMMON', '[INTERFACE]'] },
  'c1-state-02': { t0: 69.04, eyebrow: 'IDEA TWO', lines: ['EXTENDED', '[STATE]'] },
  'c1-state-03': { t0: 78.5, eyebrow: 'IDEA THREE', lines: ['FLEXIBLE', 'AUTHORITY', 'FROM [KCC-2]'] },
  'c2-borrowed-receive-left': { t0: 91.9, eyebrow: 'IDEA FOUR', lines: ['BORROWED', '[RECEIVE]'] },
};
// kt-keyword-pop ON the word, held to the cut (captions are never on a cover here, so nothing stacks)
const POPS: { t0: number; t1: number; cx: number; text: string }[] = [
  { t0: 89.28, t1: 91.9, cx: 529, text: 'COVENANTS CAN<br>[OWN TOKENS]' },      // twinkle (post-mix)
  { t0: 100.88, t1: 102.9, cx: 1391, text: '[STORAGE MASS]' },                   // knock-pop (post-mix)
  { t0: 115.04, t1: 116.22, cx: 960, text: 'ONLY THE TOKEN AMOUNT [GROWS]' },     // cash-register (post-mix)
];
// reframe into the free 1058 px beside the 862 px panel: scale FITTED to each diagram's measured content span (1920-px
// coords, measured off the state PNGs) so the content never runs under the panel, 40 px margins, room for the 2% drift
const PANEL_FREE = 1920 - 862, REFRAME_M = 40, DRIFT = 0.02;
const CONTENT_X: Record<string, [number, number]> = {
  'c1-state-01': [105, 1810], 'c1-state-02': [104, 1800], 'c1-state-03': [105, 1800], 'c2-borrowed-receive-left': [109, 1772],
};
const reframeOf = (ref: string, side: 'L' | 'R') => {
  const [x0, x1] = CONTENT_X[ref] ?? [0, 1920];
  const s = Math.min(0.6, (PANEL_FREE - 2 * REFRAME_M) / (x1 * (1 + DRIFT) - x0));
  const left = (side === 'L' ? 0 : 862) + REFRAME_M - x0 * s;
  return { s, left, top: (1080 - 1080 * s) / 2 };
};
const blockOf = (i: number) => {
  let a = i, b = i;
  while (a > 0 && COVERS[a - 1].ref === COVERS[i].ref && Math.abs(COVERS[a - 1].tOut - COVERS[a].tIn) < 0.01) a--;
  while (b < COVERS.length - 1 && COVERS[b + 1].ref === COVERS[i].ref && Math.abs(COVERS[b + 1].tIn - COVERS[b].tOut) < 0.01) b++;
  return { b0: COVERS[a].tIn, b1: COVERS[b].tOut, head: COVERS[a].ref };
};
const DiagramView: React.FC<{ c: Cover; b0: number; b1: number }> = ({ c, b0, b1 }) => {
  const { t } = useK20();
  const src = c.ref === 'card-rulebook' ? 'card-slides/card-rulebook.png' : `diagrams/${c.ref}-${c.state}.png`;
  // a Type 2 still never sits dead still (7a): a gentle push across the whole diagram block (full view, <= 4%)
  const push = 1 + 0.035 * ramp(t, b0, b1, Easing.linear);
  const panel = PANELS[c.ref];
  const pops = POPS.filter((p) => t >= p.t0 && t < p.t1 && p.t0 >= c.tIn - 0.01 && p.t0 < c.tOut);
  if (c.side) {
    const rf = reframeOf(c.ref, c.side);
    const drift = 1 + DRIFT * ramp(t, b0, b1, Easing.linear);
    return (
      <AbsoluteFill style={{ background: '#0a0c10', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: rf.left, top: rf.top, width: 1920, height: 1080, transformOrigin: '0 0', transform: `scale(${rf.s * drift})`,
          WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, #000 7%, #000 93%, transparent 100%)' }}>
          <Img src={staticFile(src)} style={{ width: 1920, height: 1080 }} />
        </div>
        {panel && <KtSidePanel side={c.side === 'L' ? 'R' : 'L'} t0={panel.t0} eyebrow={panel.eyebrow} lines={panel.lines} />}
        {pops.map((p) => <KtKeywordPop key={p.t0} t0={p.t0} t1={p.t1} cx={p.cx} text={p.text} />)}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: '#0a0c10', overflow: 'hidden' }}>
      <Img src={staticFile(src)} style={{ ...fill, transform: `scale(${push})` }} />
      {pops.map((p) => <KtKeywordPop key={p.t0} t0={p.t0} t1={p.t1} cx={p.cx} text={p.text} />)}
    </AbsoluteFill>
  );
};
/** Type 1 animated charts: every `chart` ref routes to a LIVE useCurrentFrame-clocked component, never a PNG */
const ChartFor: React.FC<{ c: Cover }> = ({ c }) => {
  const { abs } = useK20();
  let el: React.ReactNode = null;
  if (c.ref === 'c4-token-count') el = <ChartC4 state={c.state as 's1' | 's2'} />;
  else if (c.ref === 'c15-daily-transactions') el = <ChartC15 />;
  else if (c.ref === 'c17-supply-ring') el = <ChartC17 />;
  else if (c.ref === 'c5-timeline') el = <ChartC5 mode={c.state as 'p1' | 'p2'} />;
  else if (c.ref === 'c5-final-square') el = <ChartC5 mode="final" />;
  else throw new Error('chart ref with no animated component: ' + c.ref);
  if (c.bzs) {
    // the BRAAM beat pause (comp-build section 9): an eased zoom to the figure over exactly the pause frames, held after
    const braam = INSERTS.find((p) => p.at > c.tIn && p.at < c.tOut)!;
    const p = interpolate(abs, [preF(braam.at), F(braam.at)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.sin) });
    const s = 1 + (c.bzs - 1) * p;
    return <AbsoluteFill style={{ overflow: 'hidden', background: '#0a0c10' }}><AbsoluteFill style={{ transformOrigin: `${c.bzx}px ${c.bzy}px`, transform: `translate(${(960 - c.bzx!) * p}px, ${(540 - c.bzy!) * p}px) scale(${s})` }}>{el}</AbsoluteFill></AbsoluteFill>;
  }
  return <>{el}</>;
};
/** 3d lead-in / lead-out: the clip's FIRST frame under the set-up line, its LAST frame under the resume line */
const LEADIN_K = 1.06;
const ClipStill: React.FC<{ c: Cover }> = ({ c }) => {
  const { t } = useK20();
  const first = c.ref === 'CLIP-1-first';
  // lead-in: a slow settle onto his face (1.0 -> LEADIN_K); lead-out: starts at 1.0 (matches the clip's last frame through
  // the insert-out fade), drifts to 1.025 and is back at 1.0 when the MELT takes its unscaled frame
  const s = first ? 1 + (LEADIN_K - 1) * ramp(t, c.tIn, c.tOut, Easing.inOut(Easing.sin))
    : 1 + 0.025 * Math.sin(Math.PI * ramp(t, c.tIn, c.tOut - 0.2, Easing.linear));
  return <AbsoluteFill style={{ overflow: 'hidden', background: 'black' }}><Img src={staticFile(`transitions/cutframes/${c.ref}.png`)} style={{ ...fill, transformOrigin: '1300px 560px', transform: `scale(${s})` }} /></AbsoluteFill>;
};

// ---------------------------------------------------------------------------------------------------------------------
// 6. INGRESS per row (TRANSITIONS.md section 5, hand-rolled, never TransitionSeries on the spine)
// ---------------------------------------------------------------------------------------------------------------------
type Ingress = 'cut' | 'swap' | 'fade' | 'warp' | 'xscale';
const ING_F: Record<Ingress, number> = { cut: 0, swap: 6, fade: 15, warp: 15, xscale: 11 };
const ENGINE_IN = new Set([131.22, 164.44, 221.14, 246.8]);              // a library move owns these cuts (FX below)
const CARD_AT = new Set([30.355, 174.455, 207.36]);
const INSERT_FADE = 15;                                                  // hand:fade 0.5 s insert-in / insert-out
const ingressOf = (i: number): Ingress => {
  const c = COVERS[i], prev = COVERS[i - 1];
  const touches = prev && Math.abs(prev.tOut - c.tIn) < 0.01;
  if (!touches) return 'cut';                                            // out of a FACE window: the film burn owns the cut
  if (prev.ref === c.ref) return 'swap';                                 // STATE SWAP: no ingress transition
  if (CARD_AT.has(c.tIn) || ENGINE_IN.has(c.tIn)) return 'cut';          // the card's own fade / the library move owns it
  if (c.ref === 'c5-final-square') return 'cut';                         // hand:cut, one continuous board
  if (c.ref === 'CLIP-1-last') return 'cut';                             // revealed by the insert-out fade
  if (c.kind === 'vid') return 'fade';                                   // hand:fade (broll-fade 0.5 s)
  if (c.kind === 'still') return 'warp';                                 // hand:cross-warp (image-warp 0.5 s)
  return 'xscale';                                                       // hand:xfade-scale (container-xfade 0.35 s, 0.93 -> 1)
};
const TRACK = COVERS.map((c, i) => {
  const ing = ingressOf(i);
  const next = COVERS[i + 1];
  const nextIng = next ? ingressOf(i + 1) : 'cut';
  let from = F(c.tIn), to = F(c.tOut);
  if (c.ref === 'CLIP-1-last') from = F(c.tIn) - INSERT_FADE;          // under the insert-out fade
  if (c.ref === 'CLIP-1-first') to = preF(c.tOut) + INSERT_FADE;        // under the insert-in fade
  if (next && Math.abs(next.tIn - c.tOut) < 0.01) to += ING_F[nextIng];  // the outgoing stays under the incoming's fade
  return { c, i, ing, from, to, ...blockOf(i) };
});
const IngressWrap: React.FC<{ ing: Ingress; children: React.ReactNode }> = ({ ing, children }) => {
  const f = useCurrentFrame();
  const n = ING_F[ing];
  if (!n || f >= n) return <AbsoluteFill>{children}</AbsoluteFill>;
  const p = interpolate(f, [0, n], [0, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const style: React.CSSProperties = { opacity: p };
  if (ing === 'xscale') style.transform = `scale(${0.93 + 0.07 * p})`;
  if (ing === 'warp') { style.transform = `scale(${1.08 - 0.08 * p})`; style.filter = `blur(${(1 - p) * 10}px)`; }
  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};
const CoverEl: React.FC<{ row: typeof TRACK[number] }> = ({ row }) => {
  const { c } = row;
  switch (c.kind) {
    case 'vid':
      return (
        <AbsoluteFill style={{ background: 'black' }}>
          <VidPlay src={`vid/${c.ref}.mp4`} ref_={c.ref} />
          {c.ref === 'BR-1-teal-particles' && <H0Card t0={c.tIn} t1={c.tOut} />}
        </AbsoluteFill>
      );
    case 'still':
      if (c.clip) {
        const fx = FX.find((x) => Math.abs(x.at - c.tIn) < 0.01);
        return <MotionStill c={c} delay={fx ? fx.from + fx.win - row.from : 0} />;
      }
      return <StillView c={c} />;
    case 'receipt':
      return c.mo ? <MotionWrap id={c.mo} slotF={F(c.tOut) - F(c.tIn)}><ReceiptView id={c.ref} /></MotionWrap> : <ReceiptView id={c.ref} />;
    case 'deck':
    case 'container':
      return <DiagramView c={c} b0={row.b0} b1={row.b1} />;
    case 'chart':
      return <ChartFor c={c} />;
    case 'clipstill':
      return <ClipStill c={c} />;
  }
};

// ---------------------------------------------------------------------------------------------------------------------
// 7. LIBRARY TRANSITIONS over the cover / spine (6a): each mounted in a Sequence of EXACTLY its engine window, the swap
//    landing ON the cut frame; video sides are handed a pre-extracted CUTFRAME still (6a cost trap); every node reads the
//    absolute clock; SFX off (post-mix). Ids are the TRANSITION-PLAN's.
// ---------------------------------------------------------------------------------------------------------------------
// Ids TRANSITIONS.md names ONLY as open-question alternatives (not chosen by the plan, so deliberately not wired):
// TRANSITIONS_WAIVED: blocks-max-1 — open question 2 alternative (Blocks Max face device); the plan's face pick is hand:film-burn
// TRANSITIONS_WAIVED: blocks-max-3 — open question 2 alternative (Blocks Max face device); the plan's face pick is hand:film-burn
// TRANSITIONS_WAIVED: spin-center-swinging-ccw — open question 8 alternative (a spin on I1); the plan keeps I1 on lib:blocks-max-2
// TRANSITIONS_WAIVED: spin-center-swinging-short-cw — open question 4 alternative (short spin); the plan wires the full spin-center-swinging-cw
const CUTFRAME: Record<string, string> = {
  'BR-7-stadium-roar': 'transitions/cutframes/BR-7-cut.png',              // its frame at the spin window start (clip t 1.585 s)
  'BR-13-steam-night-teal': 'transitions/cutframes/BR-13-cut.png',        // its frame at the blocks window start (clip t 2.603 s)
  'IMG-7-knight-ridge-motion': 'transitions/cutframes/IMG-7-motion-f0.png',
  'CLIP-1-last': 'transitions/cutframes/CLIP-1-last.png',
};
const stillNode = (src: string) => () => <Img src={staticFile(src)} style={{ width: 1920, height: 1080, objectFit: 'cover' }} />;
const coverNode = (tIn: number) => { const row = TRACK.find((r) => Math.abs(r.c.tIn - tIn) < 0.01)!; return () => <CoverEl row={row} />; };
type Fx = { at: number; id: string; win: number; from: number; out: () => React.ReactNode; inn: () => React.ReactNode; fromSrc?: string; toSrc?: string };
const fx = (at: number, id: string, out: () => React.ReactNode, inn: () => React.ReactNode, extra: Partial<Fx> = {}): Fx => {
  const row = getTransition(id);
  if (!row) throw new Error('unknown transition id ' + id);
  const win = framesForRow(row, FPS);
  const cut = (row.params as { cut?: number; opacityPeak?: number }).cut ?? (row.params as { opacityPeak?: number }).opacityPeak ?? 0.5;
  return { at, id, win, from: F(at) - Math.round(cut * win), out, inn, ...extra };
};
const FX: Fx[] = [
  // 2:11.2 SPIN-newfacet: BR-7 stadium roar -> the C3 two-lane marquee (TRANSITIONS section 4)
  fx(131.22, 'spin-center-swinging-cw', stillNode(CUTFRAME['BR-7-stadium-roar']), () => coverNode(131.22)()),
  // 2:44.4 MELT-transform: the CLIP-1 lead-out still reforms into the C4 callback (image-only canvas engine: stills both sides)
  fx(164.44, 'melt-equidistant-short-2', stillNode(CUTFRAME['CLIP-1-last']), stillNode('charts/c4-token-count-s1-payoff.png'),
    { fromSrc: CUTFRAME['CLIP-1-last'], toSrc: 'charts/c4-token-count-s1-payoff.png' }),
  // 3:41.1 glitch-still: BR-13 -> IMG-7 knight ridge (its motion clip starts on the window's last frame)
  fx(221.14, 'blocks-short-1', stillNode(CUTFRAME['BR-13-steam-night-teal']), stillNode(CUTFRAME['IMG-7-knight-ridge-motion']),
    { fromSrc: CUTFRAME['BR-13-steam-night-teal'], toSrc: CUTFRAME['IMG-7-knight-ridge-motion'] }),
  // 4:06.8 glitch-still: IMG-9 -> IMG-10 = I1, the marquee image (live still nodes both sides)
  fx(246.8, 'blocks-max-2', () => coverNode(243.64)(), () => coverNode(246.8)()),
];
// [PUNCH-IN] + [LIGHTLEAK]: the leak's flash peaks ON the join frame (the engine swaps at row.params.cut), spine as A and B
const LEAKS: Fx[] = PUNCHES.map((p) => {
  const before = punchAt(p.t - 1 / FPS), after = punchAt(p.t + 1e-4);
  return fx(p.t, p.leak, () => <SpineLive k={before} />, () => <SpineLive k={after} />);
});
const FxLayer: React.FC<{ list: Fx[] }> = ({ list }) => (
  <>
    {list.map((x, i) => (
      <Sequence key={i} from={x.from} durationInFrames={x.win} name={`fx ${x.id} @${x.at}`}>
        <TransitionClip id={x.id} cutFrame={Math.round(x.win / 2)} outgoing={x.out} incoming={x.inn} sfx={false} fromSrc={x.fromSrc} toSrc={x.toSrc} />
      </Sequence>
    ))}
  </>
);

// FACE cut in/out = hand:film-burn (the video's face pick, TRANSITIONS section 3): a warm radial flash peaking ON the cut, +-0.38 s
const FACE_CUTS = [6.833, 19.633, 28.167, 252.9];
const BURN_HALF = 11;
const FilmBurn: React.FC = () => {
  const f = useCurrentFrame();
  const e = interpolate(f, [0, BURN_HALF, 2 * BURN_HALF], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad) });
  const x = interpolate(f, [0, 2 * BURN_HALF], [22, 64]);
  return (
    <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: e,
      background: `radial-gradient(ellipse 90% 120% at ${x}% 42%, rgba(255,246,220,1) 0%, rgba(255,176,72,.95) 26%, rgba(214,82,18,.75) 52%, rgba(90,20,0,.35) 74%, rgba(0,0,0,0) 92%)` }}>
      <AbsoluteFill style={{ background: 'rgba(255,214,150,1)', opacity: interpolate(e, [0.75, 1], [0, 0.85], { extrapolateLeft: 'clamp' }) }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// 8. CHAPTER CARDS: the ONE card pick rmn:slide (from-right), a self-contained @remotion/transitions scene that starts
//    BEFORE the baked pause and holds through it; never slides back out (the next cover dissolves in under its fade).
// ---------------------------------------------------------------------------------------------------------------------
const CARDS = [{ at: 30.355, png: 'title-card-ch2' }, { at: 174.455, png: 'title-card-ch4' }, { at: 207.36, png: 'title-card-ch5' }];
const CARD_LEAD = 6, CARD_TURN = 12, CARD_FADE = 15;
const PAUSE_F = Math.round(PAUSE * FPS);
const CARD_READABLE = (CARD_LEAD + PAUSE_F - CARD_TURN) / FPS;
if (CARD_READABLE < 1.0) throw new Error(`chapter card readable ${CARD_READABLE}s < 1.0 s (comp-build section 6)`);
const CardScene: React.FC<{ png: string; total: number }> = ({ png, total }) => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={CARD_TURN}><AbsoluteFill /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={slide({ direction: 'from-right' })} timing={linearTiming({ durationInFrames: CARD_TURN })} />
    <TransitionSeries.Sequence durationInFrames={total}><CardFace png={png} total={total} /></TransitionSeries.Sequence>
  </TransitionSeries>
);
const CardFace: React.FC<{ png: string; total: number }> = ({ png, total }) => {
  const f = useCurrentFrame();
  const op = interpolate(f, [total - CARD_FADE, total], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ opacity: op }}><Img src={staticFile(`title-slides/${png}.png`)} style={fill} /></AbsoluteFill>;
};

// ---------------------------------------------------------------------------------------------------------------------
// 9. CLIP INSERT (3d): CLIP-1 full-frame and MUTED over its paused window (its voice is in the VO), insert-in / insert-out
//    hand:fade 0.5 s (TRANSITIONS bucket insert).
// ---------------------------------------------------------------------------------------------------------------------
const CLIP1 = { at: 162.295, dur: 20.5, file: 'clip-inserts/CLIP-1-helfer-real-assets.mp4' };
const InsertClip: React.FC<{ frames: number }> = ({ frames }) => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, INSERT_FADE, frames - INSERT_FADE, frames], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // the clip enters at the lead-in still's final scale (same origin) so the 0.5 s fade never double-exposes, then eases to 1.0
  const k = 1 + (LEADIN_K - 1) * interpolate(f, [0, 36], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.sin) });
  return <AbsoluteFill style={{ opacity: op, background: 'black', overflow: 'hidden' }}><OffthreadVideo src={staticFile(CLIP1.file)} muted style={{ ...fill, transformOrigin: '1300px 560px', transform: `scale(${k})` }} /></AbsoluteFill>;
};

// ---------------------------------------------------------------------------------------------------------------------
// 10. CAPTIONS (comp-build section 8): generated Kcc20Captions.ts, only inside CAPTION_WINDOWS, TOPMOST, Montserrat house style
// ---------------------------------------------------------------------------------------------------------------------
const CAPS = ZCAPTIONS.map((c) => ({ tf: sh(c.t), h: c.h }));
const Captions: React.FC = () => {
  const { abs, t: src } = useK20();
  const t = abs / FPS;
  if (abs >= SPINE_FRAMES) return null;
  if (!CAPTION_WINDOWS.some(([a, b]) => src >= a && src < b)) return null;
  let cur: { tf: number; h: string } | null = null;
  for (const c of CAPS) { if (c.tf <= t) cur = c; else break; }
  if (!cur) return null;
  const nextT = (CAPS.find((c) => c.tf > cur!.tf) || { tf: Infinity }).tf;
  if (t >= Math.min(nextT, cur.tf + 1.3)) return null;
  const df = abs - Math.round(cur.tf * FPS);
  const s = interpolate(df, [0, 5, 9], [0.7, 1.12, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) });
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 92 }}>
      <div style={{ fontFamily: "Montserrat,'Arial Black','Segoe UI',sans-serif", fontWeight: 900, textTransform: 'lowercase', fontSize: 86, lineHeight: 1.05,
        color: '#ffffff', WebkitTextStroke: '12px #000', paintOrder: 'stroke fill', letterSpacing: '0.01em', textAlign: 'center',
        transform: `scale(${s})`, maxWidth: 1600 }}>{cur.h}</div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// THE COMPOSITION
// ---------------------------------------------------------------------------------------------------------------------
export const Kcc20: React.FC = () => {
  const abs = useCurrentFrame();
  const clock = { abs, t: srcT(abs) };
  return (
    <K20Clock.Provider value={clock}>
      <AbsoluteFill style={{ backgroundColor: 'black' }}>
        <K20Style />
        {/* the spine: one continuous OffthreadVideo (face baked, covers black, pauses baked), then the end-card hold */}
        <Sequence from={0} durationInFrames={SPINE_FRAMES} name="spine"><SpineLayer /></Sequence>
        {/* end hold: mounted at the ROOT (no Sequence offset) so <Freeze frame> addresses the spine's own last frame */}
        {abs >= SPINE_FRAMES && <SpineStill frame={SPINE_FRAMES - 1} k={punchAt(328.9)} />}
        {/* the cover track */}
        {TRACK.map((r) => (
          <Sequence key={r.i} from={r.from} durationInFrames={r.to - r.from} name={`${r.c.kind} ${r.c.ref}${r.c.state ? ':' + r.c.state : ''}`}>
            <IngressWrap ing={r.ing}><CoverEl row={r} /></IngressWrap>
          </Sequence>
        ))}
        {/* CLIP-1 spliced insert over its paused window */}
        <Sequence from={preF(CLIP1.at)} durationInFrames={Math.round(CLIP1.dur * FPS)} name="CLIP-1 insert"><InsertClip frames={Math.round(CLIP1.dur * FPS)} /></Sequence>
        {/* library moves: marquees + glitch stills, then the punch leaks over the face spine */}
        <FxLayer list={FX} />
        <FxLayer list={LEAKS} />
        {/* face cuts: film burn */}
        {FACE_CUTS.map((t) => (
          <Sequence key={t} from={F(t) - BURN_HALF} durationInFrames={2 * BURN_HALF + 1} name={`film-burn @${t}`}><FilmBurn /></Sequence>
        ))}
        {/* chapter cards (rmn:slide) */}
        {CARDS.map((c) => {
          const from = preF(c.at) - CARD_LEAD;
          const total = F(c.at) + CARD_FADE - from;
          return <Sequence key={c.at} from={from} durationInFrames={total} name={`card ${c.png}`}><CardScene png={c.png} total={total} /></Sequence>;
        })}
        <Captions />
      </AbsoluteFill>
    </K20Clock.Provider>
  );
};

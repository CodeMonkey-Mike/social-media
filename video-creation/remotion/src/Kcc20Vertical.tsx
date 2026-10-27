// Kcc20Vertical.tsx: the VERTICAL (1080x1920) twin of Kcc20.tsx for longform-edited "kcc20"
// (skills/vertical-repurpose/vertical-repurpose.md sections 1b + 2; comp-build.md skeletons; comp-builder VERTICAL mode).
// The content is LOCKED: same paused spine, same DUR, same time map (CARD_T / PAUSE / INSERTS / SPINE_SECS), the cover rows
// byte-identical to the 16:9 (asserted against the import below), the same transition ids at the same frames, the same
// caption windows. What changes is the FRAMING: the spine is cropped tall on the MEASURED face (assets/vertical/face-crop.json),
// every 16:9 ref resolves to its native-portrait file through the explicit V_* lookup tables (a missing entry THROWS when the
// module loads, a missing FILE throws on the first frame via getStaticFiles), receipts get portrait cameras, the animated
// charts are re-laid for portrait in code (Kcc20VerticalCharts.tsx), and the kt-side-panel becomes a top band.
// Public dir: media/kcc20/assets/vertical ONLY. No music, no SFX, no watermark (the post-mix owns audio but the VO).
// assets/vertical/NOTES.md did not exist at build time (2026-10-22): the substitutions below come from the vertical asset
// tree, BROLL-SOURCES-vertical.md (frame-rate / length tables) and the builders' reports (receipts: highlights BAKED).
import React from 'react';
import { AbsoluteFill, Easing, Freeze, Img, OffthreadVideo, Sequence, getStaticFiles, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { slide } from '@remotion/transitions/slide';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { TransitionClip } from './transitions/TransitionClip';
import { ENGINES, getTransition, framesForRow } from './transitions/registry';
import { ZCAPTIONS, CAPTION_WINDOWS } from './Kcc20Captions';
import { H0Card, K20Clock, K20Style, ramp, useK20 } from './Kcc20Charts';
import { ChartC15V, ChartC17V, ChartC4V, ChartC5V, K20VStyle, KtKeywordPopV, KtTopPanelV, PANEL_H_V } from './Kcc20VerticalCharts';
import * as K169 from './Kcc20';

loadMontserrat('normal', { weights: ['900'], subsets: ['latin'] });

// ---------------------------------------------------------------------------------------------------------------------
// 1. TIME MAP: copied from the 16:9 and ASSERTED equal to it (spine/ALL.g.paused.json pauses[] is the map)
// ---------------------------------------------------------------------------------------------------------------------
export const FPS = 30;
export const WIDTH = 1080, HEIGHT = 1920;                               // portrait 1080x1920
const PAUSE = 1.5;
export const CARD_T = [30.355, 174.455, 207.36, 240.74];
export const INSERTS = [
  { at: 30.355, dur: 1.5 },
  { at: 162.295, dur: 20.5 },
  { at: 174.455, dur: 1.5 },
  { at: 207.36, dur: 1.5 },
  { at: 240.74, dur: 4.7 },
];
export const SPINE_SECS = 328.992;
const SPINE_FRAMES = 10761;
export const sh = (t: number) => t + INSERTS.filter((p) => p.at <= t + 1e-6).reduce((s, p) => s + p.dur, 0);
const preSh = (t: number) => t + INSERTS.filter((p) => p.at < t - 1e-6).reduce((s, p) => s + p.dur, 0);
export const F = (t: number) => Math.round(sh(t) * FPS);
const preF = (t: number) => Math.round(preSh(t) * FPS);
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
export const DUR = K169.DUR;                                             // the SAME duration as the 16:9 (10761 frames)
const same = (a: unknown, b: unknown, what: string) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`vertical ${what} differs from the 16:9 Kcc20.tsx`); };
same(CARD_T, K169.CARD_T, 'CARD_T');
same(INSERTS, K169.INSERTS, 'INSERTS');
same(SPINE_SECS, K169.SPINE_SECS, 'SPINE_SECS');
same(K169.FPS, FPS, 'FPS');
if (DUR !== SPINE_FRAMES || F(SPINE_SECS) !== SPINE_FRAMES) throw new Error(`time map drift: DUR ${DUR}, F(SPINE_SECS) ${F(SPINE_SECS)} vs spine ${SPINE_FRAMES}`);
for (const t of [0, 30.355, 100, 162.295, 174.455, 207.36, 240.74, 300, SPINE_SECS]) if (F(t) !== K169.F(t)) throw new Error('F() differs from the 16:9 at ' + t);

// ---------------------------------------------------------------------------------------------------------------------
// 2. THE PORTRAIT FACE CROP (vertical-repurpose 1b): MEASURED by measure_face_crop.py -> assets/vertical/face-crop.json
//    (face detection, 5 samples per FACE window; overall 56.36%, objectPosition '56.4% center', spread [51.74, 63.36]).
//    The spine (1920x1080) is scaled to the full 1920 px height (3413 px wide) and cropped to 1080. A per-window offset is
//    used (the spread is ~12% of the frame): each window's measured face centre is put on the frame's horizontal centre.
//    CSS objectPosition X% aligns the image's X% point with the frame's X% point, so a face at cx% is CENTRED by
//    objectPosition p = (cx * DW - 540) / (DW - 1080) (DW = 3413.3), not by p = cx; the conversion is done here, explicitly.
// ---------------------------------------------------------------------------------------------------------------------
const FACE_CROP_JSON = { objectPosition: '56.4% center', mean_pct: 56.36 };
// [a, b, face cx %]: the SAME detector (measure_face_crop.face_centre_pct) re-run densely, every 1.5 s of each window on the
// source spine (5 / 6 / 51 samples, _previews/vertical/qa/facescan/facescan.json) because face-crop.json's 5 samples left F3
// visibly right of centre on the smoke stills; face-crop.json per-window means were 58.32 / 54.66 / 56.11.
const FACE_WINDOWS: [number, number, number][] = [[0.0, 6.833, 58.14], [19.633, 28.167, 55.8], [252.9, 328.992, 56.85]];
const DW = 1920 * (HEIGHT / 1080);
const centerPos = (cxPct: number) => Math.max(0, Math.min(100, ((cxPct / 100) * DW - WIDTH / 2) / (DW - WIDTH) * 100));
const posAt = (t: number) => {
  const w = FACE_WINDOWS.find(([a, b]) => t >= a - 0.5 && t < b + 0.5);
  return centerPos(w ? w[2] : FACE_CROP_JSON.mean_pct);
};
const FACE_POINT_V = { x: 540, y: 853 };                                 // eye line: source eye_y 479.6 (face-reframe.json) x 1920/1080
const PUNCH_K = 1.18;
// [PUNCH-IN] + [LIGHTLEAK] rows: byte-identical to the 16:9 (desilencer joins, spine/jumpcuts-final.json)
const PUNCHES: { t: number; dir: 'in' | 'out'; leak: string }[] = [
  { t: 3.8, dir: 'in', leak: 'lightleaks-1' },          // F1 · lib:lightleaks-1 (punch-leak)
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
const spineStyle = (pos: number): React.CSSProperties => ({
  position: 'absolute', left: 0, top: 0, width: WIDTH, height: HEIGHT, objectFit: 'cover', objectPosition: `${pos.toFixed(2)}% center`,
});
const PunchBox: React.FC<{ k: number; children: React.ReactNode }> = ({ k, children }) => (
  <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: 'black', transformOrigin: `${FACE_POINT_V.x}px ${FACE_POINT_V.y}px`, transform: `scale(${k})` }}>{children}</AbsoluteFill>
);
/** the live spine (THE VO): the only unmuted media in the comp */
const SpineLayer: React.FC = () => {
  const { t } = useK20();
  return <PunchBox k={punchAt(t)}><OffthreadVideo src={staticFile(need('spine.mp4'))} style={spineStyle(posAt(t))} /></PunchBox>;
};
/** a LIVE muted copy of the spine for an engine window, synced to the absolute clock in any nesting (6a) */
const SpineLive: React.FC<{ k: number; pos: number }> = ({ k, pos }) => {
  const { abs } = useK20();
  const local = useCurrentFrame();
  return <PunchBox k={k}><OffthreadVideo src={staticFile('spine.mp4')} muted trimBefore={Math.max(0, abs - local)} style={spineStyle(pos)} /></PunchBox>;
};

// ---------------------------------------------------------------------------------------------------------------------
// 3. THE 16:9-REF -> PORTRAIT-ASSET LOOKUP TABLES (explicit; a ref with no entry throws when the module loads)
// ---------------------------------------------------------------------------------------------------------------------
const REQUIRED = new Set<string>();
function need(p: string) { REQUIRED.add(p); return p; }
const look = <T,>(table: Record<string, T>, key: string, what: string): T => {
  const v = table[key];
  if (v === undefined) throw new Error(`Kcc20Vertical: no portrait ${what} for 16:9 ref '${key}' (add it to the lookup table)`);
  return v;
};
// Envato b-roll, NATIVE vertical, frame rates + lengths RE-PROBED (BROLL-SOURCES-vertical.md: never the 16:9 tables)
const V_VID: Record<string, { file: string; fps: number; dur: number }> = {
  'BR-1-teal-particles': { file: 'vid/BR-1-teal-particles.mp4', fps: 30000 / 1001, dur: 4.5045 },
  'BR-2-server-corridor': { file: 'vid/BR-2-server-corridor.mp4', fps: 25, dur: 4.72 },
  'BR-4-network-nodes': { file: 'vid/BR-4-network-nodes.mp4', fps: 30000 / 1001, dur: 4.104 },
  'BR-5-phone-hand-cyan': { file: 'vid/BR-5-phone-hand-cyan.mp4', fps: 25, dur: 5.6 },
  'BR-6-envelope-handoff': { file: 'vid/BR-6-envelope-handoff.mp4', fps: 25, dur: 4.4 },
  'BR-7-stadium-roar': { file: 'vid/BR-7-stadium-roar.mp4', fps: 24000 / 1001, dur: 3.5035 },
  'BR-8-board-game-hop': { file: 'vid/BR-8-board-game-hop.mp4', fps: 30000 / 1001, dur: 5.2052 },
  'BR-11-earth-pullback': { file: 'vid/BR-11-earth-pullback.mp4', fps: 30, dur: 4.4 },
  'BR-12-coders-night': { file: 'vid/BR-12-coders-night.mp4', fps: 24000 / 1001, dur: 5.5055 },
  'BR-13-steam-night-teal': { file: 'vid/BR-13-steam-night-teal.mp4', fps: 30, dur: 4.9 },
  'BR-14-asic-mining-rigs': { file: 'vid/BR-14-asic-mining-rigs.mp4', fps: 30, dur: 5.5 },
  'BR-15-ridge-flight-twilight': { file: 'vid/BR-15-ridge-flight-twilight.mp4', fps: 30000 / 1001, dur: 5.1051 },
};
// ChatGPT stills, recomposed TRUE 9:16. The 16:9 IMG-1 / IMG-7 slots played Seedance motion clips (comp-build 3c); no
// portrait motion clips exist (assets/vertical/img-motion/ was never built), so both slots play the portrait STILL with the
// house slow push (flagged in the build report, vertical-repurpose 1c step 4).
const V_IMG: Record<string, string> = {
  'IMG-1-circuit-k-macro': 'img/IMG-1-circuit-k-macro.png',
  'IMG-2-identical-coin-grid': 'img/IMG-2-identical-coin-grid.png',
  'IMG-3-krc20-token-crowd': 'img/IMG-3-krc20-token-crowd.png',
  'IMG-4-coin-fused-bedrock': 'img/IMG-4-coin-fused-bedrock.png',
  'IMG-7-knight-ridge': 'img/IMG-7-knight-ridge.png',
  'IMG-8-crowd-narrow-pass': 'img/IMG-8-crowd-narrow-pass.png',
  'IMG-9-balance-scale-asymmetry': 'img/IMG-9-balance-scale-asymmetry.png',
  'IMG-10-summit-cyan-moon-k': 'img/IMG-10-summit-cyan-moon-k.png',
};
// system-design diagrams + the card slide: the SAME state names, re-shot at 1080x1920
const V_DIAG: Record<string, string> = {
  'diagram-covenant-stack:coin': 'diagrams/diagram-covenant-stack-coin.png',
  'diagram-covenant-stack:spent': 'diagrams/diagram-covenant-stack-spent.png',
  'diagram-covenant-stack:next': 'diagrams/diagram-covenant-stack-next.png',
  'card-rulebook:solo': 'card-slides/card-rulebook.png',
  'c1-state-01:base': 'diagrams/c1-state-01-base.png',
  'c1-state-01:amount': 'diagrams/c1-state-01-amount.png',
  'c1-state-01:owner': 'diagrams/c1-state-01-owner.png',
  'c1-state-01:settings': 'diagrams/c1-state-01-settings.png',
  'c1-state-01:entrypoint': 'diagrams/c1-state-01-entrypoint.png',
  'c1-state-02:base': 'diagrams/c1-state-02-base.png',
  'c1-state-02:digest': 'diagrams/c1-state-02-digest.png',
  'c1-state-03:base': 'diagrams/c1-state-03-base.png',
  'c1-state-03:s00': 'diagrams/c1-state-03-s00.png',
  'c1-state-03:s01': 'diagrams/c1-state-03-s01.png',
  'c1-state-03:s03': 'diagrams/c1-state-03-s03.png',
  'c1-state-03:s04': 'diagrams/c1-state-03-s04.png',
  'c2-borrowed-receive-left:base': 'diagrams/c2-borrowed-receive-left-base.png',
  'c2-borrowed-receive-left:kas': 'diagrams/c2-borrowed-receive-left-kas.png',
  'c2-borrowed-receive-left:mass': 'diagrams/c2-borrowed-receive-left-mass.png',
  'c2-borrowed-receive-right:base': 'diagrams/c2-borrowed-receive-right-base.png',
  'c2-borrowed-receive-right:owner': 'diagrams/c2-borrowed-receive-right-owner.png',
  'c2-borrowed-receive-right:floor': 'diagrams/c2-borrowed-receive-right-floor.png',
  'c2-borrowed-receive-right:amount': 'diagrams/c2-borrowed-receive-right-amount.png',
  'c3-marquee:base': 'diagrams/c3-marquee-base.png',
  'c3-marquee:krc-1': 'diagrams/c3-marquee-krc-1.png',
  'c3-marquee:krc-2': 'diagrams/c3-marquee-krc-2.png',
  'c3-marquee:krc-3': 'diagrams/c3-marquee-krc-3.png',
  'c3-marquee:krc-4': 'diagrams/c3-marquee-krc-4.png',
  'c3-marquee:kcc-1': 'diagrams/c3-marquee-kcc-1.png',
  'c3-marquee:kcc-2': 'diagrams/c3-marquee-kcc-2.png',
  'c3-marquee:kcc-3': 'diagrams/c3-marquee-kcc-3.png',
  'c3-marquee:kcc-4': 'diagrams/c3-marquee-kcc-4.png',
  'c3-marquee:both': 'diagrams/c3-marquee-both.png',
};
const V_TITLE: Record<string, string> = {
  'title-card-ch2': 'title-slides/title-card-ch2.png',
  'title-card-ch4': 'title-slides/title-card-ch4.png',
  'title-card-ch5': 'title-slides/title-card-ch5.png',
};
// pre-extracted cut-frame stills (6a cost trap) + the CLIP-1 lead-in / lead-out frames, re-cut from the PORTRAIT files
// (BR-7 frame 38 = clip t 1.585 s and BR-13 frame 78 = clip t 2.6 s: the frame each plays at its engine window's start)
const V_CUT: Record<string, string> = {
  'BR-7-stadium-roar': 'transitions/cutframes/BR-7-cut.png',
  'BR-13-steam-night-teal': 'transitions/cutframes/BR-13-cut.png',
  'CLIP-1-first': 'transitions/cutframes/CLIP-1-first.png',
  'CLIP-1-last': 'transitions/cutframes/CLIP-1-last.png',
};
const V_CHART_STILL: Record<string, string> = {
  'charts/c4-token-count-s1-payoff.png': 'charts/c4-token-count-s1-payoff.png',     // the MELT's toSrc: the PORTRAIT twin
};
const V_CLIP: Record<string, string> = { 'CLIP-1': 'clip-inserts/CLIP-1-helfer-real-assets.mp4' };
// BRAAM-pause zoom target on the portrait chart (c17 spec: the centre of the 96.72% figure)
const V_BZ: Record<string, { x: number; y: number; s: number }> = { 'c17-supply-ring': { x: 540, y: 837, s: 2.4 } };
const CHART_REFS = new Set(['c4-token-count', 'c15-daily-transactions', 'c17-supply-ring', 'c5-timeline', 'c5-final-square']);

// ---------------------------------------------------------------------------------------------------------------------
// 4. THE COVER TRACK: the rows below are a VERBATIM copy of the 16:9's, asserted equal right after the array.
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
same(COVERS, K169.COVERS, 'cover rows');
// captions: ON over the 3 FACE windows only (never over a cover); the same windows as the 16:9 and Kcc20Captions.ts
const CAPTION_SRC: [number, number][] = [[0.000, 6.833], [19.633, 28.167], [252.900, 328.992]];
same(CAPTION_SRC, CAPTION_WINDOWS, 'CAPTION_SRC');

// resolve EVERY row through the lookup tables now, so a missing portrait asset fails the build, not the render
const assetOf = (c: Cover): string | null => {
  switch (c.kind) {
    case 'vid': return need(look(V_VID, c.ref, 'b-roll clip').file);
    case 'still': return need(look(V_IMG, c.ref, 'image'));
    case 'receipt': return need(look(V_RX, c.ref, 'receipt').file);
    case 'deck': case 'container': return need(look(V_DIAG, `${c.ref}:${c.state}`, 'diagram state'));
    case 'chart': if (!CHART_REFS.has(c.ref)) throw new Error('chart ref with no portrait component: ' + c.ref); return null;
    case 'clipstill': return need(look(V_CUT, c.ref, 'clip still'));
  }
};

// ---------------------------------------------------------------------------------------------------------------------
// 5. RECEIPTS, portrait: the MOBILE-VIEW captures (1080 wide, 1446-3913 tall, highlights BAKED by the receipt-capturer, so
//    the comp never redraws the 16:9 #ffe14d wipe). CH1-CH3 play full frame WIDTH; CH4 gold / CH5 cyan sit inside the
//    chapter's accent frame (Mike 2026-10-20). Each gets a reading camera in CAPTURE px (s = zoom, fx/fy = focus), timed
//    on the 16:9's beats, pushes capped at ~1.1x so a text column is never cut mid-word; the MOTION rows keep their library move (TRANSITIONS section 5).
// ---------------------------------------------------------------------------------------------------------------------
type CamKey = { t: number; s: number; fx: number; fy: number };
type RxV = { file: string; w: number; h: number; frame: 'none' | 'gold' | 'cyan'; bg: string; cam: CamKey[] };
const rx = (id: string, h: number, frame: RxV['frame'], cam: [number, number, number, number][], bg = '#ffffff'): RxV =>
  ({ file: `receipts/${id}.png`, w: 1080, h, frame, bg, cam: cam.map(([t, s, fx, fy]) => ({ t, s, fx, fy })) });
const V_RX: Record<string, RxV> = {
  'C9-pr31-merged': rx('C9-pr31-merged', 1484, 'none', [[9.36, 1, 540, 742]]),
  'RX4-pr31-status-diff': rx('RX4-pr31-status-diff', 2174, 'none', [[13.84, 1, 540, 880], [15.3, 1.15, 560, 1905]]),            // 'Status: Last Call' y 1881-1930
  'C12-toccata-release-v2.0.0': rx('C12-toccata-release-v2.0.0', 3002, 'none', [[32.6, 1, 540, 960], [33.6, 1.08, 545, 1300], [36.74, 1.08, 545, 1300], [37.5, 1.12, 545, 1483]]),   // 'June 30, 2026' y 1449-1517
  'RX1-kasplex-org': rx('RX1-kasplex-org', 2974, 'none', [[120.14, 1, 540, 960]]),
  'RX2-xxim-masterclass-watch': rx('RX2-xxim-masterclass-watch', 1709, 'none', [[154.62, 1, 540, 855], [157.4, 1.1, 540, 1150]]),
  'C18-kasstacker-covenants': rx('C18-kasstacker-covenants', 3913, 'none', [[169.54, 1, 540, 2900], [171.0, 1.1, 540, 3300]], '#f5f9f8'),
  'C10-kccs-commits-log': rx('C10-kccs-commits-log', 1531, 'gold', [[174.455, 1, 540, 765]]),
  'RX3-kccs-readme-final': rx('RX3-kccs-readme-final', 1792, 'gold', [[204.36, 1, 540, 896], [205.3, 1.1, 545, 1130]]),        // three Final cells y 929-1325
  'C20-issue11-kaspacom': rx('C20-issue11-kaspacom', 2562, 'gold', [[205.86, 1, 540, 1250], [206.9, 1.1, 545, 1800]]),         // y 1837-1958
  'C13-rusty-kaspa-master-commits': rx('C13-rusty-kaspa-master-commits', 1920, 'cyan', [[210.36, 1, 540, 960], [211.2, 1.08, 540, 800], [213.1, 1.08, 540, 800], [214.0, 1.12, 540, 1650]]),
  'C14-branch-commits': rx('C14-branch-commits', 1446, 'cyan', [[223.44, 1, 540, 723], [224.6, 1.2, 500, 757]]),               // y 726-789
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
const CapturePlate: React.FC<{ src: string; w: number; h: number; vw: number; vh: number; cam: { s: number; fx: number; fy: number } }> = ({ src, w, h, vw, vh, cam }) => {
  const k = (vw / w) * cam.s;
  const dw = w * k, dh = h * k;
  let left = vw / 2 - cam.fx * k, top = vh / 2 - cam.fy * k;
  left = dw >= vw ? Math.min(0, Math.max(vw - dw, left)) : (vw - dw) / 2;
  top = dh >= vh ? Math.min(0, Math.max(vh - dh, top)) : (vh - dh) / 2;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, transformOrigin: '0 0', transform: `translate(${left}px, ${top}px) scale(${k})` }}>
      <Img src={staticFile(src)} style={{ width: w, height: h, display: 'block' }} />
    </div>
  );
};
const ReceiptView: React.FC<{ id: string }> = ({ id }) => {
  const { t } = useK20();
  const r = look(V_RX, id, 'receipt');
  const cam = camAt(r.cam, t);
  if (r.frame === 'none') {
    // full frame WIDTH; a capture shorter than the frame sits centred on the dark house backdrop
    const vh = Math.min(HEIGHT, r.h * (WIDTH / r.w));
    return (
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, #12181c 0%, #0a0c10 70%)' }}>
        <div style={{ position: 'absolute', left: 0, top: (HEIGHT - vh) / 2, width: WIDTH, height: vh, overflow: 'hidden', background: r.bg,
          boxShadow: '0 30px 80px rgba(0,0,0,.6)' }}>
          <CapturePlate src={r.file} w={r.w} h={r.h} vw={WIDTH} vh={vh} cam={cam} />
        </div>
      </AbsoluteFill>
    );
  }
  const a = FRAME_ACCENT[r.frame];
  const vw = 1000, vh = Math.min(1760, r.h * (vw / r.w));
  return (
    <AbsoluteFill style={{ background: r.frame === 'cyan' ? 'radial-gradient(ellipse at 50% 112%, #0d2a27 0%, #0a0c10 60%)' : 'radial-gradient(ellipse at 85% -6%, #2a2410 0%, #0a0c10 55%)' }}>
      <div style={{ position: 'absolute', left: 40, top: (HEIGHT - vh) / 2, width: vw, height: vh, borderRadius: 18, overflow: 'hidden', background: r.bg,
        boxShadow: `0 0 0 3px ${a.c}, 0 0 60px rgba(${a.rgb},.45), 0 30px 80px rgba(0,0,0,.6)` }}>
        <CapturePlate src={r.file} w={r.w} h={r.h} vw={vw} vh={vh} cam={cam} />
      </div>
    </AbsoluteFill>
  );
};
/** [MOTION] lib:motion-3d-* on a receipt (comp-build section 6): the engine gets the live receipt as outClip; its 5 s clock is
 * fitted to the slot with <Freeze> (t * 5 / slot). The engine sizes itself off useVideoConfig (1080x1920 here). */
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
// 6. Stills, b-roll, diagrams, charts, the CLIP-1 stills
// ---------------------------------------------------------------------------------------------------------------------
const fill: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };
const StillView: React.FC<{ c: Cover }> = ({ c }) => {
  const { t } = useK20();
  const amt = c.ref === 'IMG-10-summit-cyan-moon-k' ? 0.12 : 0.06;          // I1 = the marquee image's slow push-in
  const s = 1 + amt * ramp(t, c.tIn, c.tOut, Easing.linear);
  return <AbsoluteFill style={{ overflow: 'hidden', background: '#0a0c10' }}><Img src={staticFile(look(V_IMG, c.ref, 'image'))} style={{ ...fill, transform: `scale(${s})` }} /></AbsoluteFill>;
};
/** a portrait clip played frame-for-frame (playbackRate = 30 / fps), frozen on its last frame instead of running off the end */
const VidPlay: React.FC<{ ref_: string }> = ({ ref_ }) => {
  const local = useCurrentFrame();
  const v = look(V_VID, ref_, 'b-roll clip');
  const rate = 30 / v.fps;
  const lastLocal = Math.floor(((v.dur - 1.5 / v.fps) * 30) / rate);
  return (
    <Freeze frame={lastLocal} active={local > lastLocal}>
      <OffthreadVideo src={staticFile(v.file)} muted playbackRate={rate} style={fill} />
    </Freeze>
  );
};
// kt-side-panel rows (overlays.md section 2): in portrait the panel is a TOP BAND and the diagram is reframed into the
// frame below it. Same eyebrows / lines / start times as the 16:9 PANELS.
const PANELS: Record<string, { t0: number; eyebrow: string; lines: string[] }> = {
  'c1-state-01': { t0: 54.24, eyebrow: 'IDEA ONE', lines: ['A COMMON', '[INTERFACE]'] },
  'c1-state-02': { t0: 69.04, eyebrow: 'IDEA TWO', lines: ['EXTENDED', '[STATE]'] },
  'c1-state-03': { t0: 78.5, eyebrow: 'IDEA THREE', lines: ['FLEXIBLE', 'AUTHORITY', 'FROM [KCC-2]'] },
  'c2-borrowed-receive-left': { t0: 91.9, eyebrow: 'IDEA FOUR', lines: ['BORROWED', '[RECEIVE]'] },
};
// kt-keyword-pop ON the word, held to the cut: the 16:9 times and words; the long one is broken for the 1080 width
const POPS: { t0: number; t1: number; text: string }[] = [
  { t0: 89.28, t1: 91.9, text: 'COVENANTS CAN<br>[OWN TOKENS]' },        // twinkle (post-mix)
  { t0: 100.88, t1: 102.9, text: '[STORAGE MASS]' },                     // knock-pop (post-mix)
  { t0: 115.04, t1: 116.22, text: 'ONLY THE TOKEN<br>AMOUNT [GROWS]' },  // cash-register (post-mix)
];
// the reframe under the top band: each panel diagram's MEASURED content span on its portrait PNG (y 150-1699, x 55-1056)
// is fitted into the frame below the band (y PANEL_H_V+30 .. 1890), centred on x
const CONTENT_Y: Record<string, [number, number]> = {
  'c1-state-01': [150, 1665], 'c1-state-02': [150, 1693], 'c1-state-03': [150, 1665], 'c2-borrowed-receive-left': [150, 1699],
};
const DRIFT = 0.02;
const reframeOf = (ref: string) => {
  const [y0, y1] = look(CONTENT_Y, ref, 'content span');
  const top0 = PANEL_H_V + 30, bottom = 1890;
  const s = Math.min(0.92, (bottom - top0) / ((y1 - y0) * (1 + DRIFT)));
  return { s, cy0: (y0 + y1) / 2, cy: (top0 + bottom) / 2 };          // content centre (PNG px) -> its place on the frame
};
const blockOf = (i: number) => {
  let a = i, b = i;
  while (a > 0 && COVERS[a - 1].ref === COVERS[i].ref && Math.abs(COVERS[a - 1].tOut - COVERS[a].tIn) < 0.01) a--;
  while (b < COVERS.length - 1 && COVERS[b + 1].ref === COVERS[i].ref && Math.abs(COVERS[b + 1].tIn - COVERS[b].tOut) < 0.01) b++;
  return { b0: COVERS[a].tIn, b1: COVERS[b].tOut, head: COVERS[a].ref };
};
const DiagramView: React.FC<{ c: Cover; b0: number; b1: number }> = ({ c, b0, b1 }) => {
  const { t } = useK20();
  const src = look(V_DIAG, `${c.ref}:${c.state}`, 'diagram state');
  const push = 1 + 0.035 * ramp(t, b0, b1, Easing.linear);              // 7a: a Type 2 still never sits dead still
  const panel = PANELS[c.ref];
  const pops = POPS.filter((p) => t >= p.t0 && t < p.t1 && p.t0 >= c.tIn - 0.01 && p.t0 < c.tOut);
  if (c.side && panel) {
    const rf = reframeOf(c.ref);
    const S = rf.s * (1 + DRIFT * ramp(t, b0, b1, Easing.linear));
    const left = WIDTH / 2 - (WIDTH / 2) * S, top = rf.cy - rf.cy0 * S;
    return (
      <AbsoluteFill style={{ background: '#0a0c10', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left, top, width: WIDTH, height: HEIGHT, transformOrigin: '0 0', transform: `scale(${S})`,
          WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, #000 5%, #000 95%, transparent 100%)' }}>
          <Img src={staticFile(src)} style={{ width: WIDTH, height: HEIGHT }} />
        </div>
        <KtTopPanelV t0={panel.t0} eyebrow={panel.eyebrow} lines={panel.lines} />
        {pops.map((p) => <KtKeywordPopV key={p.t0} t0={p.t0} t1={p.t1} text={p.text} />)}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: '#0a0c10', overflow: 'hidden' }}>
      <Img src={staticFile(src)} style={{ ...fill, transform: `scale(${push})` }} />
      {pops.map((p) => <KtKeywordPopV key={p.t0} t0={p.t0} t1={p.t1} text={p.text} />)}
    </AbsoluteFill>
  );
};
/** Type 1 animated charts: every `chart` ref routes to a LIVE portrait component, never a PNG */
const ChartFor: React.FC<{ c: Cover }> = ({ c }) => {
  const { abs } = useK20();
  let el: React.ReactNode = null;
  if (c.ref === 'c4-token-count') el = <ChartC4V state={c.state as 's1' | 's2'} />;
  else if (c.ref === 'c15-daily-transactions') el = <ChartC15V />;
  else if (c.ref === 'c17-supply-ring') el = <ChartC17V />;
  else if (c.ref === 'c5-timeline') el = <ChartC5V mode={c.state as 'p1' | 'p2'} />;
  else if (c.ref === 'c5-final-square') el = <ChartC5V mode="final" />;
  else throw new Error('chart ref with no animated component: ' + c.ref);
  if (c.bzs) {
    // the BRAAM beat pause (comp-build 9): an eased zoom to the figure over exactly the pause frames, recentred on the
    // PORTRAIT frame centre (540, 960); the target is the portrait figure (V_BZ), not the 16:9 row's bzx / bzy
    const bz = look(V_BZ, c.ref, 'braam zoom target');
    const braam = INSERTS.find((p) => p.at > c.tIn && p.at < c.tOut)!;
    const p = interpolate(abs, [preF(braam.at), F(braam.at)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.sin) });
    const s = 1 + (bz.s - 1) * p;
    return <AbsoluteFill style={{ overflow: 'hidden', background: '#0a0c10' }}><AbsoluteFill style={{ transformOrigin: `${bz.x}px ${bz.y}px`, transform: `translate(${(WIDTH / 2 - bz.x) * p}px, ${(HEIGHT / 2 - bz.y) * p}px) scale(${s})` }}>{el}</AbsoluteFill></AbsoluteFill>;
  }
  return <>{el}</>;
};
/** 3d lead-in / lead-out: the PORTRAIT clip's FIRST frame under the set-up line, its LAST frame under the resume line */
const LEADIN_K = 1.06;
const CLIP_FACE = '520px 800px';                                         // Sivan's face on the portrait CLIP-1 frames
const ClipStill: React.FC<{ c: Cover }> = ({ c }) => {
  const { t } = useK20();
  const first = c.ref === 'CLIP-1-first';
  const s = first ? 1 + (LEADIN_K - 1) * ramp(t, c.tIn, c.tOut, Easing.inOut(Easing.sin))
    : 1 + 0.025 * Math.sin(Math.PI * ramp(t, c.tIn, c.tOut - 0.2, Easing.linear));
  return <AbsoluteFill style={{ overflow: 'hidden', background: 'black' }}><Img src={staticFile(look(V_CUT, c.ref, 'clip still'))} style={{ ...fill, transformOrigin: CLIP_FACE, transform: `scale(${s})` }} /></AbsoluteFill>;
};

// ---------------------------------------------------------------------------------------------------------------------
// 7. INGRESS per row (TRANSITIONS.md section 5, hand-rolled, never TransitionSeries on the spine): the 16:9's, unchanged
// ---------------------------------------------------------------------------------------------------------------------
type Ingress = 'cut' | 'swap' | 'fade' | 'warp' | 'xscale';
const ING_F: Record<Ingress, number> = { cut: 0, swap: 6, fade: 15, warp: 15, xscale: 11 };
const ENGINE_IN = new Set([131.22, 164.44, 221.14, 246.8]);
const CARD_AT = new Set([30.355, 174.455, 207.36]);
const INSERT_FADE = 15;
const ingressOf = (i: number): Ingress => {
  const c = COVERS[i], prev = COVERS[i - 1];
  const touches = prev && Math.abs(prev.tOut - c.tIn) < 0.01;
  if (!touches) return 'cut';
  if (prev.ref === c.ref) return 'swap';
  if (CARD_AT.has(c.tIn) || ENGINE_IN.has(c.tIn)) return 'cut';
  if (c.ref === 'c5-final-square') return 'cut';
  if (c.ref === 'CLIP-1-last') return 'cut';
  if (c.kind === 'vid') return 'fade';
  if (c.kind === 'still') return 'warp';
  return 'xscale';
};
const TRACK = COVERS.map((c, i) => {
  assetOf(c);                                                           // throws on a missing portrait mapping
  const ing = ingressOf(i);
  const next = COVERS[i + 1];
  const nextIng = next ? ingressOf(i + 1) : 'cut';
  let from = F(c.tIn), to = F(c.tOut);
  if (c.ref === 'CLIP-1-last') from = F(c.tIn) - INSERT_FADE;
  if (c.ref === 'CLIP-1-first') to = preF(c.tOut) + INSERT_FADE;
  if (next && Math.abs(next.tIn - c.tOut) < 0.01) to += ING_F[nextIng];
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
          <VidPlay ref_={c.ref} />
          {c.ref === 'BR-1-teal-particles' && <H0Card t0={c.tIn} t1={c.tOut} />}
        </AbsoluteFill>
      );
    case 'still':
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
// 8. LIBRARY TRANSITIONS (6a): the 16:9's ids at the 16:9's frames, each in a Sequence of EXACTLY its engine window;
//    video sides get the PORTRAIT cut-frame still; every node reads the absolute clock; SFX off (post-mix).
// ---------------------------------------------------------------------------------------------------------------------
// TRANSITIONS_WAIVED: blocks-max-1 — open question 2 alternative (Blocks Max face device); the plan's face pick is hand:film-burn
// TRANSITIONS_WAIVED: blocks-max-3 — open question 2 alternative (Blocks Max face device); the plan's face pick is hand:film-burn
// TRANSITIONS_WAIVED: spin-center-swinging-ccw — open question 8 alternative (a spin on I1); the plan keeps I1 on lib:blocks-max-2
// TRANSITIONS_WAIVED: spin-center-swinging-short-cw — open question 4 alternative (short spin); the plan wires the full spin-center-swinging-cw
const stillNode = (src: string) => () => <Img src={staticFile(need(src))} style={{ width: WIDTH, height: HEIGHT, objectFit: 'cover' }} />;
const coverNode = (tIn: number) => { const row = TRACK.find((r) => Math.abs(r.c.tIn - tIn) < 0.01)!; return () => <CoverEl row={row} />; };
type Fx = { at: number; id: string; win: number; from: number; out: () => React.ReactNode; inn: () => React.ReactNode; fromSrc?: string; toSrc?: string };
const fx = (at: number, id: string, out: () => React.ReactNode, inn: () => React.ReactNode, extra: Partial<Fx> = {}): Fx => {
  const row = getTransition(id);
  if (!row) throw new Error('unknown transition id ' + id);
  const win = framesForRow(row, FPS);
  const cut = (row.params as { cut?: number; opacityPeak?: number }).cut ?? (row.params as { opacityPeak?: number }).opacityPeak ?? 0.5;
  return { at, id, win, from: F(at) - Math.round(cut * win), out, inn, ...extra };
};
const MELT_TO = look(V_CHART_STILL, 'charts/c4-token-count-s1-payoff.png', 'chart still');
const FX: Fx[] = [
  // 2:11.2 SPIN-newfacet: BR-7 stadium roar -> the C3 two-lane marquee (TRANSITIONS section 4) · lib:spin-center-swinging-cw
  fx(131.22, 'spin-center-swinging-cw', stillNode(V_CUT['BR-7-stadium-roar']), () => coverNode(131.22)()),
  // 2:44.4 MELT-transform: the CLIP-1 lead-out still reforms into the C4 callback · lib:melt-equidistant-short-2
  fx(164.44, 'melt-equidistant-short-2', stillNode(V_CUT['CLIP-1-last']), stillNode(MELT_TO), { fromSrc: V_CUT['CLIP-1-last'], toSrc: MELT_TO }),
  // 3:41.1 glitch-still: BR-13 -> IMG-7 knight ridge (the portrait still, live) · lib:blocks-short-1
  fx(221.14, 'blocks-short-1', stillNode(V_CUT['BR-13-steam-night-teal']), () => coverNode(221.14)(), { fromSrc: V_CUT['BR-13-steam-night-teal'] }),
  // 4:06.8 glitch-still: IMG-9 -> IMG-10 = I1, the marquee image (live still nodes both sides) · lib:blocks-max-2
  fx(246.8, 'blocks-max-2', () => coverNode(243.64)(), () => coverNode(246.8)()),
];
// [PUNCH-IN] + [LIGHTLEAK]: the leak peaks ON the join frame, the spine as A and B with the window's crop and punch scale
const LEAKS: Fx[] = PUNCHES.map((p) => {
  const before = punchAt(p.t - 1 / FPS), after = punchAt(p.t + 1e-4), pos = posAt(p.t);
  return fx(p.t, p.leak, () => <SpineLive k={before} pos={pos} />, () => <SpineLive k={after} pos={pos} />);
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
// FACE cut in/out = hand:film-burn (the video's face pick, TRANSITIONS section 3): a warm radial flash peaking ON the cut
const FACE_CUTS = [6.833, 19.633, 28.167, 252.9];
const BURN_HALF = 11;
const FilmBurn: React.FC = () => {
  const f = useCurrentFrame();
  const e = interpolate(f, [0, BURN_HALF, 2 * BURN_HALF], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad) });
  const y = interpolate(f, [0, 2 * BURN_HALF], [26, 66]);
  return (
    <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: e,
      background: `radial-gradient(ellipse 140% 80% at 52% ${y}%, rgba(255,246,220,1) 0%, rgba(255,176,72,.95) 26%, rgba(214,82,18,.75) 52%, rgba(90,20,0,.35) 74%, rgba(0,0,0,0) 92%)` }}>
      <AbsoluteFill style={{ background: 'rgba(255,214,150,1)', opacity: interpolate(e, [0.75, 1], [0, 0.85], { extrapolateLeft: 'clamp' }) }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// 9. CHAPTER CARDS: the ONE card pick rmn:slide (from-right), started BEFORE the pause, held through it (portrait PNGs)
// ---------------------------------------------------------------------------------------------------------------------
const CARDS = [{ at: 30.355, png: 'title-card-ch2' }, { at: 174.455, png: 'title-card-ch4' }, { at: 207.36, png: 'title-card-ch5' }];
CARDS.forEach((c) => need(look(V_TITLE, c.png, 'title card')));
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
  return <AbsoluteFill style={{ opacity: op }}><Img src={staticFile(look(V_TITLE, png, 'title card'))} style={fill} /></AbsoluteFill>;
};

// ---------------------------------------------------------------------------------------------------------------------
// 10. CLIP INSERT (3d): the PORTRAIT CLIP-1, full-frame and MUTED over its paused window (its voice is in the VO),
//     insert-in / insert-out hand:fade 0.5 s (TRANSITIONS bucket insert)
// ---------------------------------------------------------------------------------------------------------------------
const CLIP1 = { at: 162.295, dur: 20.5, file: need(look(V_CLIP, 'CLIP-1', 'clip insert')) };
const InsertClip: React.FC<{ frames: number }> = ({ frames }) => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, INSERT_FADE, frames - INSERT_FADE, frames], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const k = 1 + (LEADIN_K - 1) * interpolate(f, [0, 36], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.sin) });
  return <AbsoluteFill style={{ opacity: op, background: 'black', overflow: 'hidden' }}><OffthreadVideo src={staticFile(CLIP1.file)} muted style={{ ...fill, transformOrigin: CLIP_FACE, transform: `scale(${k})` }} /></AbsoluteFill>;
};

// ---------------------------------------------------------------------------------------------------------------------
// 11. CAPTIONS (comp-build 8): the generated Kcc20Captions.ts, only inside CAPTION_WINDOWS, TOPMOST, the Montserrat house
//     style, restyled for portrait: its top at 1470 px (~77% of the height, below his chin and inside the phone-safe zone)
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
    <AbsoluteFill style={{ justifyContent: 'flex-start', alignItems: 'center', paddingTop: 1470 }}>
      <div style={{ fontFamily: "Montserrat,'Arial Black','Segoe UI',sans-serif", fontWeight: 900, textTransform: 'lowercase', fontSize: 92, lineHeight: 1.05,
        color: '#ffffff', WebkitTextStroke: '12px #000', paintOrder: 'stroke fill', letterSpacing: '0.01em', textAlign: 'center',
        transform: `scale(${s})`, maxWidth: 960 }}>{cur.h}</div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// THE COMPOSITION (1080x1920)
// ---------------------------------------------------------------------------------------------------------------------
let filesChecked = false;
const checkFiles = () => {
  if (filesChecked) return;
  const have = new Set(getStaticFiles().map((f) => f.name.replace(/\\/g, '/')));
  const missing = [...REQUIRED].filter((p) => !have.has(p));
  if (missing.length) throw new Error('Kcc20Vertical: portrait asset(s) missing from the public dir: ' + missing.join(', '));
  filesChecked = true;
};
export const Kcc20Vertical: React.FC = () => {
  checkFiles();
  const abs = useCurrentFrame();
  const clock = { abs, t: srcT(abs) };
  return (
    <K20Clock.Provider value={clock}>
      <AbsoluteFill style={{ backgroundColor: 'black', width: WIDTH, height: HEIGHT }}>
        <K20Style />
        <K20VStyle />
        <Sequence from={0} durationInFrames={SPINE_FRAMES} name="spine"><SpineLayer /></Sequence>
        {TRACK.map((r) => (
          <Sequence key={r.i} from={r.from} durationInFrames={r.to - r.from} name={`${r.c.kind} ${r.c.ref}${r.c.state ? ':' + r.c.state : ''}`}>
            <IngressWrap ing={r.ing}><CoverEl row={r} /></IngressWrap>
          </Sequence>
        ))}
        <Sequence from={preF(CLIP1.at)} durationInFrames={Math.round(CLIP1.dur * FPS)} name="CLIP-1 insert"><InsertClip frames={Math.round(CLIP1.dur * FPS)} /></Sequence>
        <FxLayer list={FX} />
        <FxLayer list={LEAKS} />
        {FACE_CUTS.map((t) => (
          <Sequence key={t} from={F(t) - BURN_HALF} durationInFrames={2 * BURN_HALF + 1} name={`film-burn @${t}`}><FilmBurn /></Sequence>
        ))}
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

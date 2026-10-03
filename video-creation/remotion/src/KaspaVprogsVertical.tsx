// KaspaVprogsVertical.tsx: the 1080x1920 (9:16) twin of KaspaVprogs.tsx for media/kaspa-vprogs, per
// skills/vertical-repurpose/vertical-repurpose.md §1b + §2 and skills/comp-build/comp-build.md.
// A REFRAME, not a re-edit: same spine (assets/vertical/spine.mp4 == assets/spine.mp4, byte-identical), same
// DUR / CARD_T / PAUSE / SPINE_SECS, a byte-identical COVERS array, the same card pick (hand:cube-3d), the same
// library transition ids at the same beats, the same caption windows. All of it is ASSERTED against the 16:9
// comp's exports at module load, so the two comps cannot drift. What changes is only the framing:
//   - spine: cropped tall with the MEASURED face position (assets/vertical/face-crop.json, §1b), never centred
//   - containers / diagrams / cards / title slides: the native 1080x1920 re-shoots in assets/vertical/
//   - receipts: the MOBILE-VIEW captures, full width, with a vertical reading camera to the baked highlights
//   - the c3-ladder animated chart: KaspaVprogsVerticalLadder (portrait re-layout, same cues)
//   - b-roll: the vertical clips (explicit 16:9-ref -> vertical-file table below)
// Every 16:9 ref resolves through an explicit lookup and every resolved file is checked against the public dir
// (getStaticFiles) at module load: a missing vertical asset THROWS instead of rendering a hole.
// Render with --public-dir media/kaspa-vprogs/assets/vertical (the lean vertical folder ONLY).
// No music, no SFX, no watermark: audio = the spine VO only (post-mix owns the rest).
//
// DIAGRAM_REFS: vprog-loop-mini, c2-l2-stack, c1-overview, c1-kaspa-four-jobs, c1-vprog-nodes, c1-provers, composability-card, c3-next-rungs
// (end declared refs)
// TRANSITIONS_WAIVED: spin-3d-side-ease-right — named only in TRANSITIONS.md "Open questions" as an OPTIONAL
// second SPIN at 81.7 whose stated default is NO; it is not a §5 scene change, so it is not wired (same as 16:9).
import React, { createContext, useContext } from 'react';
import {
  AbsoluteFill, Easing, Freeze, Img, OffthreadVideo, Sequence, getStaticFiles, interpolate, staticFile,
  useCurrentFrame,
} from 'remotion';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadMono } from '@remotion/google-fonts/JetBrainsMono';
import { TransitionClip } from './transitions/TransitionClip';
import { getTransition, framesForRow } from './transitions';
import { ZCAPTIONS, CAPTION_WINDOWS } from './KaspaVprogsCaptions';
import { KaspaVprogsVerticalLadder } from './KaspaVprogsVerticalLadder';
import {
  COVERS as COVERS_169, CARDS as CARDS_169, LIB_PLAN as LIB_PLAN_169, DUR as DUR_169, FPS as FPS_169,
  PAUSE as PAUSE_169, CARD_T as CARD_T_169, SPINE_SECS as SPINE_SECS_169,
} from './KaspaVprogs';
import type { Cover, Kind } from './KaspaVprogs';

const MONTSERRAT = loadMontserrat('normal', { weights: ['900'], subsets: ['latin'] }).fontFamily;
const MONO = loadMono('normal', { weights: ['600', '700'], subsets: ['latin'] }).fontFamily;

export const W = 1080;
export const H = 1920;

// ─── §2 timing model (identical to the 16:9; asserted below) ─────────────────────────────────────
export const FPS = 30;
const PAUSE = 1.5;                       // spine/ALL.g.paused.json pause_s
const CARD_T = [40.22, 137.46];          // spine/ALL.g.paused.json pauses[].at
const SPINE_SECS = 202.822;              // SOURCE spine (ALL.f.cut.mp4) duration
const sh = (t: number) => t + PAUSE * CARD_T.filter((c) => c <= t).length;   // source -> paused-spine secs
const cardStart = (b: number) => b + PAUSE * CARD_T.filter((c) => c < b).length;
const F = (t: number) => Math.round(sh(t) * FPS);                           // source secs -> comp frame
export const DUR = Math.round((SPINE_SECS + CARD_T.length * PAUSE) * FPS);  // 6175 = the paused spine's frame count

const AbsFrame = createContext(0);
const useAbs = () => useContext(AbsFrame);

const fill = { width: '100%', height: '100%', objectFit: 'cover' } as const;
const clampX = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const eo = Easing.out(Easing.cubic);
const eio = Easing.inOut(Easing.cubic);

// ─── FACE windows + the MEASURED tall crop (§1b) ─────────────────────────────────────────────────────
const FACE: [number, number][] = [[0.0, 7.333], [28.167, 31.933]];
// assets/vertical/face-crop.json (face-detect, both FACE windows): subject centre mean 62.25 % of the 1920
// source width, spread 57.3-67.1 %, one offset fits both windows. CSS objectPosition X% aligns the X% point
// of the IMAGE with the X% point of the FRAME, so "62.25% center" would centre source x = 58.3 %, not the
// subject. Convert properly: the spine is cover-scaled by S = 1920/1080 to 3413 px wide; the offset that puts
// source x = cx at frame x = 540 is p = (cx*S - 540) / (1920*S - 1080).
const FACE_PCT = 62.25;
const SPINE_S = H / 1080;
const SPINE_POS = `${(((FACE_PCT / 100) * 1920 * SPINE_S - W / 2) / (1920 * SPINE_S - W)) * 100}% center`;
const PUNCH_SRC: [number, number][] = [[3.78, 7.333], [30.62, 31.933]];   // hand:punch (plan 0:03.8 + 0:30.6)
const PUNCH = 1.17;
const PUNCH_ORIGIN = '540px 1040px';     // Mike's face on the tall crop (centred x; eyes ~y 1030)
const punchAt = (f: number) => (PUNCH_SRC.some(([a, b]) => f >= F(a) && f < F(b)) ? PUNCH : 1);

// ─── §4 cover track: BYTE-IDENTICAL to KaspaVprogs.tsx (asserted below; refs are the 16:9 ids) ──────
const COVERS: Cover[] = [
  // CH1 STRAIGHT INTO IT (F1 face 0.000-7.333 above)
  { tIn: 7.333, tOut: 9.5, kind: 'receipt', ref: 'R1-yellow-paper-title-page', state: 'title', ing: 'lib:blocks-max-1' },
  { tIn: 9.5, tOut: 10.86, kind: 'deck', ref: 'vprog-loop-mini', state: 'nodes', ing: 'hand:xfade-scale' },
  { tIn: 10.86, tOut: 11.4, kind: 'container', ref: 'vprog-loop-mini', state: 'state' },
  { tIn: 11.4, tOut: 14.02, kind: 'container', ref: 'vprog-loop-mini', state: 'proof' },
  { tIn: 14.02, tOut: 14.54, kind: 'container', ref: 'vprog-loop-mini', state: 'landed' },
  { tIn: 14.54, tOut: 17.16, kind: 'receipt', ref: 'R2-rusty-kaspa-v2-toccata-release', state: 'header', ing: 'hand:xfade-scale' },
  { tIn: 17.16, tOut: 18.42, kind: 'receipt', ref: 'R2-rusty-kaspa-v2-toccata-release', state: 'kips' },
  { tIn: 18.42, tOut: 21.22, kind: 'receipt', ref: 'R2-rusty-kaspa-v2-toccata-release', state: 'activation' },
  { tIn: 21.22, tOut: 25.22, kind: 'vid', ref: 'BR-1-glass-planes-rising', clip: 1.0, ing: 'hand:fade' },
  { tIn: 25.22, tOut: 25.92, kind: 'container', ref: 'ten-bps-card', state: 'rest', ing: 'hand:fade' },
  { tIn: 25.92, tOut: 28.167, kind: 'container', ref: 'ten-bps-card', state: 'slam' },
  // F2 face 28.167-31.933 (lib:blocks-max-2 in, lib:blocks-max-3 out)
  { tIn: 31.933, tOut: 32.58, kind: 'container', ref: 'execute-verify-flip', state: 's1', ing: 'lib:blocks-max-3' },
  { tIn: 32.58, tOut: 33.94, kind: 'container', ref: 'execute-verify-flip', state: 's2' },
  { tIn: 33.94, tOut: 35.92, kind: 'container', ref: 'execute-verify-flip', state: 's3' },
  { tIn: 35.92, tOut: 37.94, kind: 'container', ref: 'execute-verify-flip', state: 's4' },
  { tIn: 37.94, tOut: 38.82, kind: 'container', ref: 'execute-verify-flip', state: 's5' },
  { tIn: 38.82, tOut: 40.22, kind: 'vid', ref: 'BR-2-glass-shatter', clip: 1.0, ing: 'hand:fade' },
  // CH2 NOT AN L2 (card hand:cube-3d at 40.22)
  { tIn: 40.22, tOut: 44.64, kind: 'receipt', ref: 'R3-vitalik-rollup-centric-roadmap', state: 'establish', ing: 'hand:xfade-scale' },
  { tIn: 44.64, tOut: 47.52, kind: 'receipt', ref: 'R3-vitalik-rollup-centric-roadmap', state: 'all-in' },
  { tIn: 47.52, tOut: 52.18, kind: 'receipt', ref: 'R3-vitalik-rollup-centric-roadmap', state: 'accounts' },
  { tIn: 52.18, tOut: 54.04, kind: 'deck', ref: 'c2-l2-stack', state: 'empty', ing: 'hand:xfade-scale' },
  { tIn: 54.04, tOut: 55.38, kind: 'container', ref: 'c2-l2-stack', state: 'chain' },
  { tIn: 55.38, tOut: 58.96, kind: 'container', ref: 'c2-l2-stack', state: 'sequencer' },
  { tIn: 58.96, tOut: 60.6, kind: 'container', ref: 'c2-l2-stack', state: 'bridge' },
  { tIn: 60.6, tOut: 62.12, kind: 'container', ref: 'c2-l2-stack', state: 'liquidity' },
  { tIn: 62.12, tOut: 64.6, kind: 'container', ref: 'c2-l2-stack', state: 'pieces' },
  { tIn: 64.6, tOut: 67.8, kind: 'vid', ref: 'BR-3-ice-glow-cracks-split', clip: 1.0, ing: 'hand:fade' },
  { tIn: 67.8, tOut: 72.38, kind: 'container', ref: 'sompolinsky-name-card', state: 's1', ing: 'hand:fade' },
  { tIn: 72.38, tOut: 72.96, kind: 'container', ref: 'sompolinsky-name-card', state: 's2' },
  { tIn: 72.96, tOut: 76.78, kind: 'receipt', ref: 'R4-kasmagazine-obsolete-path-quote', state: 'push', ing: 'hand:xfade-scale' },
  { tIn: 76.78, tOut: 81.7, kind: 'receipt', ref: 'R4-kasmagazine-obsolete-path-quote', state: 'landed' },
  { tIn: 81.7, tOut: 84.74, kind: 'deck', ref: 'c1-overview', state: 'dim', ing: 'hand:xfade-scale' },
  { tIn: 84.74, tOut: 87.44, kind: 'container', ref: 'c1-overview', state: 'users' },
  { tIn: 87.44, tOut: 88.62, kind: 'container', ref: 'c1-overview', state: 'reads' },
  { tIn: 88.62, tOut: 89.8, kind: 'container', ref: 'c1-overview', state: 'writes' },
  { tIn: 89.8, tOut: 90.96, kind: 'container', ref: 'c1-overview', state: 'kaspa' },
  { tIn: 90.96, tOut: 94.5, kind: 'container', ref: 'c1-overview', state: 'orders' },
  { tIn: 94.5, tOut: 94.66, kind: 'deck', ref: 'c1-kaspa-four-jobs', state: 'orders', ing: 'lib:melt-rgb-3' },
  { tIn: 94.66, tOut: 96.22, kind: 'container', ref: 'c1-kaspa-four-jobs', state: 'stores' },
  { tIn: 96.22, tOut: 97.42, kind: 'container', ref: 'c1-kaspa-four-jobs', state: 'checks' },
  { tIn: 97.42, tOut: 98.54, kind: 'container', ref: 'c1-kaspa-four-jobs', state: 'meters' },
  { tIn: 98.54, tOut: 100.26, kind: 'container', ref: 'c1-kaspa-four-jobs', state: 'execute' },
  { tIn: 100.26, tOut: 100.42, kind: 'container', ref: 'c1-kaspa-four-jobs', state: 'dropped' },
  { tIn: 100.42, tOut: 101.7, kind: 'deck', ref: 'c1-vprog-nodes', state: 'entry', ing: 'hand:xfade-scale' },
  { tIn: 101.7, tOut: 104.0, kind: 'container', ref: 'c1-vprog-nodes', state: 'nodes' },
  { tIn: 104.0, tOut: 106.34, kind: 'container', ref: 'c1-vprog-nodes', state: 'accounts' },
  { tIn: 106.34, tOut: 106.9, kind: 'container', ref: 'c1-vprog-nodes', state: 'lock' },
  { tIn: 106.9, tOut: 108.3, kind: 'deck', ref: 'c1-provers', state: 'entry', ing: 'hand:xfade-scale' },
  { tIn: 108.3, tOut: 110.02, kind: 'container', ref: 'c1-provers', state: 'operators' },
  { tIn: 110.02, tOut: 111.66, kind: 'container', ref: 'c1-provers', state: 'launch' },
  { tIn: 111.66, tOut: 112.06, kind: 'container', ref: 'c1-provers', state: 'landed' },
  { tIn: 112.06, tOut: 114.36, kind: 'container', ref: 'zk-math-receipt', state: 's1', ing: 'hand:xfade-scale' },
  { tIn: 114.36, tOut: 115.8, kind: 'container', ref: 'zk-math-receipt', state: 's2' },
  { tIn: 115.8, tOut: 118.18, kind: 'container', ref: 'zk-math-receipt', state: 's3' },
  { tIn: 118.18, tOut: 118.38, kind: 'container', ref: 'zk-math-receipt', state: 's4' },
  { tIn: 118.38, tOut: 121.52, kind: 'container', ref: 'sovereignty-card', state: 's1', ing: 'hand:xfade-scale' },
  { tIn: 121.52, tOut: 122.5, kind: 'container', ref: 'sovereignty-card', state: 's2' },
  { tIn: 122.5, tOut: 123.34, kind: 'container', ref: 'sovereignty-card', state: 's3' },
  { tIn: 123.34, tOut: 124.72, kind: 'deck', ref: 'composability-card', state: 'entry', ing: 'hand:xfade-scale' },
  { tIn: 124.72, tOut: 126.06, kind: 'container', ref: 'composability-card', state: 'read' },
  { tIn: 126.06, tOut: 129.02, kind: 'container', ref: 'composability-card', state: 'tx' },
  { tIn: 129.02, tOut: 130.44, kind: 'container', ref: 'composability-card', state: 'one-unit' },
  { tIn: 130.44, tOut: 133.44, kind: 'receipt', ref: 'R5-a-docs-kaspa-toccata-activation', state: 'activation', ing: 'hand:xfade-scale' },
  { tIn: 133.44, tOut: 134.52, kind: 'receipt', ref: 'R5-b-docs-kaspa-toccata-zk-precompiles', state: 'push', ing: 'hand:xfade' },
  { tIn: 134.52, tOut: 137.46, kind: 'receipt', ref: 'R5-b-docs-kaspa-toccata-zk-precompiles', state: 'landed' },
  // CH3 WHERE IT STANDS (card hand:cube-3d at 137.46)
  { tIn: 137.46, tOut: 139.84, kind: 'still', ref: 'IMG-1-ladder-into-dag-sky', ing: 'lib:badsignal-short-1' },
  { tIn: 139.84, tOut: 140.7, kind: 'chart', ref: 'c3-ladder', state: 'empty', ing: 'lib:spin-3d-side-ease-up' },
  { tIn: 140.7, tOut: 144.92, kind: 'chart', ref: 'c3-ladder', state: 'crescendo' },
  { tIn: 144.92, tOut: 147.46, kind: 'chart', ref: 'c3-ladder', state: 'yellow-paper' },
  { tIn: 147.46, tOut: 156.28, kind: 'chart', ref: 'c3-ladder', state: 'toccata' },
  { tIn: 156.28, tOut: 160.34, kind: 'chart', ref: 'c3-ladder', state: 'silverscript' },
  { tIn: 160.34, tOut: 162.22, kind: 'receipt', ref: 'R6-silverscript-v1-0-0-release', state: 'header', ing: 'hand:xfade-scale' },
  { tIn: 162.22, tOut: 163.28, kind: 'receipt', ref: 'R6-silverscript-v1-0-0-release', state: 'official' },
  { tIn: 163.28, tOut: 164.78, kind: 'deck', ref: 'c3-next-rungs', state: 'entry', ing: 'hand:xfade-scale' },
  { tIn: 164.78, tOut: 167.2, kind: 'container', ref: 'c3-next-rungs', state: 'next' },
  { tIn: 167.2, tOut: 169.2, kind: 'container', ref: 'c3-next-rungs', state: 'full' },
  { tIn: 169.2, tOut: 169.78, kind: 'container', ref: 'c3-next-rungs', state: 'construction' },
  { tIn: 169.78, tOut: 172.12, kind: 'receipt', ref: 'R7-kaspa-org-build-vprogs-in-construction', state: 'push', ing: 'hand:xfade-scale' },
  { tIn: 172.12, tOut: 172.84, kind: 'receipt', ref: 'R7-kaspa-org-build-vprogs-in-construction', state: 'landed' },
  { tIn: 172.84, tOut: 176.3, kind: 'receipt', ref: 'R8-kasmagazine-covenant-fork-3-6-months', state: 'wide', ing: 'hand:xfade-scale' },
  { tIn: 176.3, tOut: 177.66, kind: 'receipt', ref: 'R8-kasmagazine-covenant-fork-3-6-months', state: 'three-six' },
  { tIn: 177.66, tOut: 178.54, kind: 'receipt', ref: 'R8-kasmagazine-covenant-fork-3-6-months', state: 'delivered' },
  { tIn: 178.54, tOut: 181.4, kind: 'vid', ref: 'BR-4-datacenter-corridor-dolly', clip: 1.0, lead: true, ing: 'hand:fade' },
  { tIn: 181.4, tOut: 184.76, kind: 'still', ref: 'IMG-2-lone-layer-above-towers', ing: 'lib:badsignal-max-1' },
  { tIn: 184.76, tOut: 186.3, kind: 'container', ref: 'pow-money-hammer', state: 's1', ing: 'hand:xfade-scale' },
  { tIn: 186.3, tOut: 187.72, kind: 'container', ref: 'pow-money-hammer', state: 's2' },
  { tIn: 187.72, tOut: 188.64, kind: 'container', ref: 'pow-money-hammer', state: 's3' },
  { tIn: 188.64, tOut: 190.04, kind: 'container', ref: 'cta-engage', state: 's1', ing: 'hand:xfade-scale' },
  { tIn: 190.04, tOut: 192.92, kind: 'container', ref: 'cta-engage', state: 's2' },
  { tIn: 192.92, tOut: 195.1, kind: 'container', ref: 'cta-engage', state: 's3' },
  { tIn: 195.1, tOut: 196.98, kind: 'still', ref: 'IMG-3-kaspa-coin-sunrise', ing: 'lib:badsignal-short-2' },
  { tIn: 196.98, tOut: 199.8, kind: 'container', ref: 'end-card-community', state: 's1', ing: 'hand:xfade-scale' },
  { tIn: 199.8, tOut: 202.822, kind: 'container', ref: 'end-card-community', state: 's2' },
];

// ─── the twin contract: the vertical may not drift from the 16:9 in time, beats, cards or transitions ──
const same = (a: unknown, b: unknown, what: string) => {
  if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`KaspaVprogsVertical drifted from KaspaVprogs: ${what}`);
};
same(COVERS, COVERS_169, 'COVERS');
same([FPS, PAUSE, CARD_T, SPINE_SECS, DUR], [FPS_169, PAUSE_169, CARD_T_169, SPINE_SECS_169, DUR_169], 'timing');

// ─── §8 captions: the same generated windows as the 16:9 ─────────────────────────────────────────────
const CAPTION_SRC: [number, number][] = [[0.0, 7.333]];   // literal mirror of CAPTION_WINDOWS for lint_covers
same(CAPTION_SRC, CAPTION_WINDOWS, 'CAPTION_SRC vs the generated CAPTION_WINDOWS');

// ─── EXPLICIT 16:9-ref -> vertical-asset lookups (assets/vertical/NOTES.md) ───────────────────────────
// b-roll: BR-1 / BR-3 are FLAGGED centre-crops of the 16:9 clips (no vertical inventory); BR-2 / BR-4 are
// native vertical (BR-2 is a DIFFERENT clip from the 16:9 BR-2-glass-shatter).
const VID_FILE: Record<string, { file: string; secs: number }> = {
  'BR-1-glass-planes-rising': { file: 'vid/BR-1-glass-planes-rising.mp4', secs: 6.0 },
  'BR-2-glass-shatter': { file: 'vid/BR-2-glass-shards-burst.mp4', secs: 3.4 },
  'BR-3-ice-glow-cracks-split': { file: 'vid/BR-3-ice-glow-cracks-split.mp4', secs: 5.16 },
  'BR-4-datacenter-corridor-dolly': { file: 'vid/BR-4-datacenter-corridor-dolly.mp4', secs: 4.88 },
};
const STILL_FILE: Record<string, string> = {                       // true 9:16 re-compositions (941x1672)
  'IMG-1-ladder-into-dag-sky': 'img/IMG-1-ladder-into-dag-sky.png',
  'IMG-2-lone-layer-above-towers': 'img/IMG-2-lone-layer-above-towers.png',
  'IMG-3-kaspa-coin-sunrise': 'img/IMG-3-kaspa-coin-sunrise.png',
};
const DIAGRAMS = new Set(['vprog-loop-mini', 'c2-l2-stack', 'c1-overview', 'c1-kaspa-four-jobs', 'c1-vprog-nodes',
  'c1-provers', 'composability-card', 'c3-next-rungs']);
const CARD_SLIDES = new Set(['ten-bps-card', 'execute-verify-flip', 'sompolinsky-name-card', 'zk-math-receipt',
  'sovereignty-card', 'pow-money-hammer', 'cta-engage', 'end-card-community']);
/** deck / container state PNG, portrait re-shoot (same file names as the 16:9 under assets/vertical/) */
const pngFor = (ref: string, state?: string) => {
  if (ref === 'ten-bps-card') return 'card-slides/ten-bps-card.png';
  if (DIAGRAMS.has(ref)) return 'diagrams/' + ref + '-' + state + '.png';
  if (CARD_SLIDES.has(ref)) return 'card-slides/' + ref + '-' + state + '.png';
  throw new Error('no vertical container for ' + ref);
};
// §6a cost trap (same two as the 16:9): the badsignal OUT of BR-4 gets the pre-extracted VERTICAL clip frame
// at its window start; the SPIN into c3-ladder gets this comp's own render of the ladder's static 'empty'
// frame (remotion still KaspaVprogsVertical --frame=4299), the live chart plays from the window's end.
const CUTFRAME: Record<string, string> = {
  'BR-4-datacenter-corridor-dolly': 'vid/cutframes/BR-4-datacenter-corridor-dolly.cut.jpg',
  'c3-ladder': 'charts/cutframes/c3-ladder-entry.cut.png',
};

// ─── receipts: mobile-view captures, FULL WIDTH, a vertical reading camera ────────────────────────────
// kf = [source t, fx (0..1 across), fy (image px at fit-width, held at frame centre), scale vs fit-width].
// Text runs edge to edge in a mobile capture, so pushes stay small (<= 1.08) and the MOVE is the pan.
type Kf = [number, number, number, number];
type Shot = { file: string; h: number; bg: string; kf: Kf[] };
type Rc = Shot & { alt?: { states: string[] } & Shot };
const RECEIPTS: Record<string, Rc> = {
  // a CODE CONTAINER quoting the PDF title page (NOTES.md): treat like a card, a quick scale-back pop, no read
  'R1-yellow-paper-title-page': { file: 'receipts/R1-yellow-paper-title-page.png', h: 1920, bg: '#0c0f13',
    kf: [[7.333, 0.5, 960, 1.06], [7.62, 0.5, 960, 1.0]] },
  // header -> the KIP list (y~1130) on 17.16 -> the activation line (y~1400) on 18.42
  'R2-rusty-kaspa-v2-toccata-release': { file: 'receipts/R2-rusty-kaspa-v2-toccata-release.png', h: 2769, bg: '#ffffff',
    kf: [[14.54, 0.5, 960, 1.0], [16.3, 0.5, 980, 1.02], [17.16, 0.5, 1130, 1.04], [17.6, 0.5, 1150, 1.04],
      [18.42, 0.5, 1400, 1.05], [21.22, 0.5, 1430, 1.06]] },
  // 'establish' = forum header, then down to the baked 'all-in' highlight (y 2252-2431);
  // 'accounts' = the R3-b capture (baked 'primary accounts ... inside an L2' highlight, y 914-1031)
  'R3-vitalik-rollup-centric-roadmap': { file: 'receipts/R3-vitalik-rollup-centric-roadmap.png', h: 2746, bg: '#ffffff',
    kf: [[40.22, 0.5, 960, 1.0], [44.64, 0.5, 960, 1.02], [46.4, 0.5, 2340, 1.03], [47.52, 0.5, 2340, 1.04]],
    alt: { states: ['accounts'], file: 'receipts/R3-b-vitalik-rollup-centric-roadmap-l2-accounts.png', h: 2629, bg: '#ffffff',
      kf: [[47.52, 0.5, 972, 1.0], [52.18, 0.5, 972, 1.04]] } },
  // highlight 'avoid the obsolete path of L2's' sits high (y 638-709): a slow push, top-anchored
  'R4-kasmagazine-obsolete-path-quote': { file: 'receipts/R4-kasmagazine-obsolete-path-quote.png', h: 2769, bg: '#ffffff',
    kf: [[72.96, 0.5, 960, 1.0], [76.78, 0.5, 900, 1.03], [81.7, 0.5, 700, 1.06]] },
  // 1080x1640 (cropped above the code block): shorter than the frame, so it sits centred on its own white
  // page colour and pushes gently at the activation highlight (y 889-1112); never pans past its bottom edge
  'R5-a-docs-kaspa-toccata-activation': { file: 'receipts/R5-a-docs-kaspa-toccata-activation.png', h: 1640, bg: '#ffffff',
    kf: [[130.44, 0.5, 1000, 1.0], [133.44, 0.5, 1000, 1.04]] },
  'R5-b-docs-kaspa-toccata-zk-precompiles': { file: 'receipts/R5-b-docs-kaspa-toccata-zk-precompiles.png', h: 2160, bg: '#ffffff',
    kf: [[133.44, 0.5, 960, 1.0], [134.52, 0.5, 1258, 1.03], [137.46, 0.5, 1258, 1.05]] },
  // the vertical capture BAKES the 'official release' highlight (y 886-1015), so the 16:9's drawn R6 marker
  // is not re-drawn (it would double); the push lands on it at 162.22 instead
  'R6-silverscript-v1-0-0-release': { file: 'receipts/R6-silverscript-v1-0-0-release.png', h: 2580, bg: '#ffffff',
    kf: [[160.34, 0.5, 960, 1.0], [162.0, 0.5, 950, 1.02], [162.22, 0.5, 950, 1.03], [163.28, 0.5, 950, 1.06]] },
  // the vPROGS card: 'In construction' pill (y 914-968) -> 'Full vProgs remain a future direction' (y 1374-1506)
  'R7-kaspa-org-build-vprogs-in-construction': { file: 'receipts/R7-kaspa-org-build-vprogs-in-construction.png', h: 2769, bg: '#f5f5f7',
    kf: [[169.78, 0.5, 1150, 1.0], [172.12, 0.5, 1380, 1.05], [172.84, 0.5, 1390, 1.06]] },
  // 'three to six months' (y 1163-1233) on 176.3, DELIVERED stamp slams under it on "shipped" 177.66
  'R8-kasmagazine-covenant-fork-3-6-months': { file: 'receipts/R8-kasmagazine-covenant-fork-3-6-months.png', h: 2769, bg: '#ffffff',
    kf: [[172.84, 0.5, 960, 1.0], [174.6, 0.5, 960, 1.02], [176.3, 0.5, 1200, 1.08], [178.54, 0.5, 1200, 1.09]] },
};
const R8_STAMP = { x: 540, y: 1290 };    // frame px: under the highlight (screen y ~920-1000 at the 176.3 camera)

// ─── every resolved vertical file (checked against the public dir right after CARDS, below) ─────────────
const REQUIRED: string[] = (() => {
  const out = new Set<string>(['spine.mp4', ...Object.values(CUTFRAME)]);
  for (const c of COVERS) {
    if (c.kind === 'vid') {
      if (!VID_FILE[c.ref]) throw new Error('no vertical b-roll mapped for ' + c.ref);
      out.add(VID_FILE[c.ref].file);
    } else if (c.kind === 'still') {
      if (!STILL_FILE[c.ref]) throw new Error('no vertical still mapped for ' + c.ref);
      out.add(STILL_FILE[c.ref]);
    } else if (c.kind === 'receipt') {
      const r = RECEIPTS[c.ref];
      if (!r) throw new Error('no vertical receipt mapped for ' + c.ref);
      out.add(r.alt && r.alt.states.includes(c.state ?? '') ? r.alt.file : r.file);
    } else if (c.kind === 'deck' || c.kind === 'container') {
      out.add(pngFor(c.ref, c.state));
    }
  }
  return [...out];
})();

// ─── groups: contiguous same-ref runs (a state swap never re-fires the ingress) ─────────────────
type Group = { ref: string; kind: Kind; rows: Cover[]; a: number; b: number; ing: string };
const GROUPS: Group[] = [];
for (const c of COVERS) {
  const g = GROUPS[GROUPS.length - 1];
  if (g && g.ref === c.ref && Math.abs(g.rows[g.rows.length - 1].tOut - c.tIn) < 0.05) {
    g.rows.push(c); g.b = F(c.tOut);
  } else {
    GROUPS.push({ ref: c.ref, kind: c.kind, rows: [c], a: F(c.tIn), b: F(c.tOut), ing: c.ing ?? '' });
  }
}
const G = (ref: string) => {
  const g = GROUPS.find((x) => x.ref === ref);
  if (!g) throw new Error('no cover group ' + ref);
  return g;
};
const HAND_IN: Record<string, number> = { 'hand:xfade-scale': 11, 'hand:fade': 15, 'hand:xfade': 8 };
const inFrames = (g: Group) => HAND_IN[g.ing] ?? 0;

// ─── chapter cards: ONE pick, hand:cube-3d (rotateY in ~11f, hold through the pause, never cube out) ──
type Card = { t: number; png: string; lead: number };
const CARDS: Card[] = [
  { t: 40.22, png: 'title-slides/title-card-ch2.png', lead: 0.0 },    // plan 0:40.2 hand:cube-3d 'NOT AN L2'
  { t: 137.46, png: 'title-slides/title-card-ch3.png', lead: 0.25 },  // plan 2:17.6 hand:cube-3d 'WHERE IT STANDS'
];
same(CARDS, CARDS_169, 'CARDS');                                         // same file names, portrait re-shoots
// build-time asset check (incl. the cards). Runs when THIS composition renders (called at the top of the
// component), NOT at module load: Root.tsx imports every comp, so a module-level throw killed every OTHER
// render whose public dir is not assets/vertical (found by KaspaVprogsShort, 2026-09-29). Same guarantee here.
let verticalAssetsChecked = false;
const assertVerticalAssets = () => {
  if (verticalAssetsChecked) return;
  const have = new Set(getStaticFiles().map((s) => s.name.split('\\').join('/')));
  const missing = [...REQUIRED, ...CARDS.map((k) => k.png)].filter((p) => !have.has(p));
  if (missing.length) {
    throw new Error(`KaspaVprogsVertical: ${missing.length} vertical asset(s) missing from the public dir ` +
      `(render with --public-dir media/kaspa-vprogs/assets/vertical): ${missing.join(', ')}`);
  }
  verticalAssetsChecked = true;
};
const TURN = 11;
const cardFrames = (k: Card) => ({ cs: Math.round((cardStart(k.t) - k.lead) * FPS), ce: F(k.t) });

// ─── library transitions (TransitionClip over EXACTLY the engine window, §6a) ──────────────────────
type LibCut = { t: number; id: string; out: () => React.ReactNode; inn: () => React.ReactNode };
const winOf = (id: string) => {
  const row = getTransition(id);
  if (!row) throw new Error('unknown transition ' + id);
  const win = framesForRow(row, FPS);
  return { win, half: Math.round(win / 2) };
};

// readable >= 1.0 s on every card (comp-build §6, Mike 2026-07-25): turn-in done -> first exit frame
for (const k of CARDS) {
  const { cs, ce } = cardFrames(k);
  const next = GROUPS.find((g) => g.a >= ce);
  const exit = next && next.ing.startsWith('lib:') ? ce - winOf(next.ing.slice(4)).half : ce;
  const readable = (exit - (cs + TURN)) / FPS;
  if (readable < 1.0) throw new Error(`card @${k.t}: readable ${readable.toFixed(2)} s < 1.0 s`);
}

const camAt = (kf: Kf[], f: number) => {
  const fr = kf.map((k) => F(k[0]));
  if (f <= fr[0]) return kf[0].slice(1) as [number, number, number];
  for (let i = 0; i < kf.length - 1; i++) {
    if (f <= fr[i + 1]) {
      const p = interpolate(f, [fr[i], fr[i + 1]], [0, 1], { ...clampX, easing: eio });
      return [1, 2, 3].map((j) => kf[i][j] + (kf[i + 1][j] - kf[i][j]) * p) as [number, number, number];
    }
  }
  return kf[kf.length - 1].slice(1) as [number, number, number];
};

/** one full-width page at the camera for frame f (fit-width = 1080; clamped so no edge ever shows) */
const Page: React.FC<{ s: Shot; f: number; op?: number }> = ({ s, f, op = 1 }) => {
  const [fx, fy, sc] = camAt(s.kf, f);
  const pw = W * sc;
  const ph = s.h * sc;
  let left = W / 2 - fx * pw;
  let top = H / 2 - fy * sc;
  left = pw >= W ? Math.min(0, Math.max(W - pw, left)) : (W - pw) / 2;
  top = ph >= H ? Math.min(0, Math.max(H - ph, top)) : (H - ph) / 2;
  return (
    <AbsoluteFill style={{ background: s.bg, opacity: op }}>
      <Img src={staticFile(s.file)} style={{ position: 'absolute', left, top, width: pw, height: ph }} />
    </AbsoluteFill>
  );
};

const ReceiptView: React.FC<{ g: Group; f: number }> = ({ g, f }) => {
  const r = RECEIPTS[g.ref];
  let i = 0;
  g.rows.forEach((row, j) => { if (F(row.tIn) <= f) i = j; });
  const cur = g.rows[i];
  const onAlt = !!r.alt && r.alt.states.includes(cur.state ?? '');
  let page: React.ReactNode = <Page s={r} f={f} />;
  if (onAlt && r.alt) {                                    // file swap inside the same receipt: 7f cross-fade
    const s0 = F(cur.tIn);
    const op = interpolate(f, [s0, s0 + 7], [0, 1], clampX);
    page = (
      <>
        {op < 1 && <Page s={r} f={f} />}
        <AbsoluteFill><Page s={r.alt} f={f} op={op} /></AbsoluteFill>
      </>
    );
  }
  const isR8 = g.ref === 'R8-kasmagazine-covenant-fork-3-6-months';
  const st = F(177.66);
  const crash = isR8 ? interpolate(f, [st, st + 4, st + 14], [1, 1.12, 1.08], { ...clampX, easing: eo }) : 1;
  const chip = isR8 ? interpolate(f, [F(174.4), F(174.9)], [1, 0], clampX) : 0;
  return (
    <AbsoluteFill style={{ background: r.bg, overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `scale(${crash})`, transformOrigin: `${R8_STAMP.x}px ${R8_STAMP.y}px` }}>
        {page}
        {isR8 && chip > 0 && (
          <div style={{
            position: 'absolute', left: 60, top: 150, opacity: chip, fontFamily: MONO, fontWeight: 600,
            fontSize: 30, letterSpacing: '.08em', color: '#12151c', background: '#eef1f5', border: '2px solid #cfd5de',
            borderRadius: 100, padding: '8px 22px',
          }}>KASPA MAGAZINE · 2025-12-17</div>
        )}
        {isR8 && f >= st && <DeliveredStamp f={f - st} />}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const DeliveredStamp: React.FC<{ f: number }> = ({ f }) => {
  const p = interpolate(f, [0, 5], [0, 1], { ...clampX, easing: Easing.in(Easing.cubic) });
  const sc = 2.4 - 1.4 * p;
  return (
    <div style={{
      position: 'absolute', left: R8_STAMP.x, top: R8_STAMP.y, transform: `translate(-50%, -50%) rotate(-8deg) scale(${sc})`,
      opacity: interpolate(f, [0, 2], [0, 1], clampX),
      background: 'rgba(10,12,16,0.94)', border: '6px solid #00e68a', borderRadius: 18, padding: '18px 40px 20px',
      boxShadow: '0 0 0 4px rgba(0,230,138,.25), 0 0 60px rgba(0,230,138,.45)', textAlign: 'center', whiteSpace: 'nowrap',
    }}>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 76, letterSpacing: '.14em', color: '#00e68a', lineHeight: 1 }}>DELIVERED</div>
      <div style={{ fontFamily: MONO, fontWeight: 600, fontSize: 44, letterSpacing: '.1em', color: '#e8eaf0', marginTop: 10 }}>2026-06-30</div>
    </div>
  );
};

// ─── state PNG containers (diagrams + card slides): 7f state cross-fade, never a dead still ───────
const XF = 7;
// c1-kaspa-four-jobs EXECUTE drop, PORTRAIT geometry (assets/vertical/diagrams/_state-cues.md): the row
// x 100..906, y 1212..1328 falls 99.80 -> 100.26 (14f, ease-in) by translate(28px,176px) rotate(1.5deg),
// opacity 1 -> .45; above `split` the 'dropped' state shows (the dashed slot revealed behind it).
const DROP = { a: 99.8, b: 100.26, x0: 100, y0: 1212, x1: 906, y1: 1328, split: 1360, dx: 28, dy: 176 };

const StateView: React.FC<{ g: Group; f: number }> = ({ g, f }) => {
  let i = 0;
  g.rows.forEach((r, j) => { if (F(r.tIn) <= f) i = j; });
  const cur = g.rows[i];
  const prev = i > 0 ? g.rows[i - 1] : null;
  const s0 = F(cur.tIn);
  let op = prev ? interpolate(f, [s0, s0 + XF], [0, 1], clampX) : 1;
  const diagram = DIAGRAMS.has(g.ref);
  const scale = interpolate(f, [g.a, g.b], [1, diagram ? 1.03 : 1.02], clampX);   // §7a slow push
  let extra = 1;
  let extraOrigin = '50% 50%';
  let under: string | null = prev ? pngFor(g.ref, prev.state) : null;
  let drop: React.ReactNode = null;

  if (g.ref === 'c2-l2-stack' && cur.state === 'pieces') {          // red outlines pulse twice 1 -> .6 -> 1 (20f each)
    const p = s0 + XF;
    op = Math.min(op, interpolate(f, [p, p + 10, p + 20, p + 30, p + 40], [1, 0.6, 1, 0.6, 1], clampX));
  }
  if (g.ref === 'c1-overview') {                                    // ORDERS pulse on "sequencer" 94.06, 16f
    const p = F(94.06);
    extra = interpolate(f, [p, p + 8, p + 16], [1, 1.03, 1], { ...clampX, easing: eio });
    extraOrigin = '473px 853px';                                    // vertical ORDERS row x 98..848, y 810..896
  }
  if (g.ref === 'ten-bps-card') {                                   // '10 blocks / sec' slam on "10" 25.92
    const p = F(25.92);
    extra = interpolate(f, [p, p + 3, p + 9], [1, 1.12, 1.08], { ...clampX, easing: eo });
    extraOrigin = '330px 900px';                                    // the big '10 / blocks / sec' block
    op = 1; under = null;
  }
  if (g.ref === 'end-card-community') {                             // pulse on "link" 197.54
    const p = F(197.54);
    extra = interpolate(f, [p, p + 7, p + 18], [1, 1.04, 1], { ...clampX, easing: eio });
    extraOrigin = '430px 1195px';                                   // 'Link in the description'
  }
  if (g.ref === 'c1-kaspa-four-jobs') {
    const da = F(DROP.a), db = F(DROP.b);
    if (cur.state === 'dropped') { op = 1; under = null; }
    if (cur.state === 'execute' && f >= da) {
      const p = interpolate(f, [da, db], [0, 1], { ...clampX, easing: Easing.in(Easing.quad) });
      const exe = staticFile(pngFor(g.ref, 'execute'));
      const dropped = staticFile(pngFor(g.ref, 'dropped'));
      drop = (
        <AbsoluteFill>
          <Img src={dropped} style={{ ...fill, position: 'absolute', clipPath: `inset(0 0 ${H - DROP.split}px 0)` }} />
          <Img src={exe} style={{ ...fill, position: 'absolute', clipPath: `inset(${DROP.split}px 0 0 0)` }} />
          <div style={{
            position: 'absolute', left: DROP.x0, top: DROP.y0, width: DROP.x1 - DROP.x0, height: DROP.y1 - DROP.y0,
            overflow: 'hidden', opacity: 1 - 0.55 * p,
            transform: `translate(${DROP.dx * p}px, ${DROP.dy * p}px) rotate(${1.5 * p}deg)`, transformOrigin: '50% 50%',
          }}>
            <Img src={exe} style={{ position: 'absolute', left: -DROP.x0, top: -DROP.y0, width: W, height: H }} />
          </div>
        </AbsoluteFill>
      );
    }
  }
  return (
    <AbsoluteFill style={{ background: '#0a0c10', overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: '50% 50%' }}>
        <AbsoluteFill style={{ transform: `scale(${extra})`, transformOrigin: extraOrigin }}>
          {drop ?? (
            <>
              {under && op < 1 && <Img src={staticFile(under)} style={fill} />}
              <Img src={staticFile(pngFor(g.ref, cur.state))} style={{ ...fill, position: 'absolute', opacity: op }} />
            </>
          )}
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── video b-roll (muted; media frame from the absolute clock via <Freeze>, clamped to the file) ─────
const VidView: React.FC<{ g: Group; f: number }> = ({ g, f }) => {
  const v = VID_FILE[g.ref];
  const clip = g.rows[0].clip ?? 0;
  const mf = Math.min(Math.floor(v.secs * FPS) - 2, Math.round(clip * FPS) + (f - g.a));
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <Freeze frame={mf}>
        <OffthreadVideo src={staticFile(v.file)} muted style={fill} />
      </Freeze>
    </AbsoluteFill>
  );
};

const StillView: React.FC<{ g: Group; f: number }> = ({ g, f }) => {
  const kb = interpolate(f, [g.a, g.b], [1.0, 1.06], clampX);   // AI stills: slow push, never dead
  return (
    <AbsoluteFill style={{ background: '#000', overflow: 'hidden' }}>
      <Img src={staticFile(STILL_FILE[g.ref])} style={{ ...fill, transform: `scale(${kb})` }} />
    </AbsoluteFill>
  );
};

/** One cover group's CONTENT at the absolute clock (clamped to its entry), no ingress styling. */
const GroupNode: React.FC<{ g: Group }> = ({ g }) => {
  const f = Math.max(g.a, useAbs());
  const c = g.rows[0];
  if (c.kind === 'chart') {
    if (c.ref === 'c3-ladder') return <KaspaVprogsVerticalLadder frame={f} F={F} />;   // Type 1 ANIMATED, portrait
    throw new Error('chart without a live component: ' + c.ref);
  }
  if (c.kind === 'receipt') return <ReceiptView g={g} f={f} />;
  if (c.kind === 'vid') return <VidView g={g} f={f} />;
  if (c.kind === 'still') return <StillView g={g} f={f} />;
  return <StateView g={g} f={f} />;
};

/** Cover-track layer: the group + its hand-rolled ingress (xfade-scale 0.93->1 / fade / xfade). */
const GroupLayer: React.FC<{ g: Group }> = ({ g }) => {
  const abs = useAbs();
  const n = inFrames(g);
  let op = 1, sc = 1;
  if (n > 0) {
    op = interpolate(abs, [g.a, g.a + n], [0, 1], { ...clampX, easing: eo });
    if (g.ing === 'hand:xfade-scale' || g.ref === 'ten-bps-card') {
      sc = interpolate(abs, [g.a, g.a + n], [0.93, 1], { ...clampX, easing: eo });
    }
  }
  return (
    <AbsoluteFill style={{ opacity: op, transform: `scale(${sc})` }}>
      <GroupNode g={g} />
    </AbsoluteFill>
  );
};

// ─── the card scene: cube from-right over the outgoing cover, then hold (cube depth = half the 1080 width) ──
const CardHeld: React.FC<{ k: Card }> = ({ k }) => <Img src={staticFile(k.png)} style={fill} />;
const CubeCard: React.FC<{ k: Card; out: Group }> = ({ k, out }) => {
  const abs = useAbs();
  const { cs } = cardFrames(k);
  const p = interpolate(abs, [cs, cs + TURN], [0, 1], { ...clampX, easing: eio });
  if (p >= 1) return <CardHeld k={k} />;
  return (
    <AbsoluteFill style={{ background: '#000', perspective: 2400, overflow: 'hidden' }}>
      <AbsoluteFill style={{ transformStyle: 'preserve-3d', transform: `translateZ(-${W / 2}px) rotateY(${-90 * p}deg)` }}>
        <AbsoluteFill style={{ transform: `translateZ(${W / 2}px)`, backfaceVisibility: 'hidden' }}>
          <GroupNode g={out} />
        </AbsoluteFill>
        <AbsoluteFill style={{ transform: `rotateY(90deg) translateZ(${W / 2}px)`, backfaceVisibility: 'hidden' }}>
          <CardHeld k={k} />
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── the spine (tall measured crop) and its faithful freeze (§6a: <Freeze>, muted, same transform, same source) ──
const spineStyle = { ...fill, objectPosition: SPINE_POS } as const;
const Spine: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: '#000' }}>
      <AbsoluteFill style={{ transform: `scale(${punchAt(f)})`, transformOrigin: PUNCH_ORIGIN }}>
        <OffthreadVideo src={staticFile('spine.mp4')} style={spineStyle} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
const SpineStill: React.FC<{ lo: number; hi: number }> = ({ lo, hi }) => {
  const f = Math.min(hi, Math.max(lo, useAbs()));
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: '#000' }}>
      <AbsoluteFill style={{ transform: `scale(${punchAt(f)})`, transformOrigin: PUNCH_ORIGIN }}>
        <Freeze frame={f}>
          <OffthreadVideo src={staticFile('spine.mp4')} muted style={spineStyle} />
        </Freeze>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
const faceLo = (i: number) => F(FACE[i][0]);
const faceHi = (i: number) => F(FACE[i][1]) - 1;

// every lib: transition of TRANSITIONS.md §5 (same ids, same beats as the 16:9; asserted), SFX left to the post-mix
const LIB_CUTS: LibCut[] = [
  // plan 0:07.3 lib:blocks-max-1: F1 face OUT -> R1
  { t: 7.333, id: 'blocks-max-1', out: () => <SpineStill lo={faceLo(0)} hi={faceHi(0)} />, inn: () => <GroupNode g={G('R1-yellow-paper-title-page')} /> },
  // plan 0:28.2 lib:blocks-max-2: ten-bps-card -> F2 face IN
  { t: 28.167, id: 'blocks-max-2', out: () => <GroupNode g={G('ten-bps-card')} />, inn: () => <SpineStill lo={faceLo(1)} hi={faceHi(1)} /> },
  // plan 0:31.9 lib:blocks-max-3: F2 face OUT -> execute-verify-flip s1
  { t: 31.933, id: 'blocks-max-3', out: () => <SpineStill lo={faceLo(1)} hi={faceHi(1)} />, inn: () => <GroupNode g={G('execute-verify-flip')} /> },
  // plan 1:34.5 lib:melt-rgb-3 (MELT = TRANSFORM): c1-overview -> c1-kaspa-four-jobs
  { t: 94.5, id: 'melt-rgb-3', out: () => <GroupNode g={G('c1-overview')} />, inn: () => <GroupNode g={G('c1-kaspa-four-jobs')} /> },
  // plan 2:17.6 lib:badsignal-short-1: CH3 card (pause end) -> IMG-1
  { t: 137.46, id: 'badsignal-short-1', out: () => <CardHeld k={CARDS[1]} />, inn: () => <GroupNode g={G('IMG-1-ladder-into-dag-sky')} /> },
  // plan 2:19.8 lib:spin-3d-side-ease-up (SPIN = NEW FACET): IMG-1 -> the live c3-ladder chart (CUTFRAME still)
  { t: 139.84, id: 'spin-3d-side-ease-up', out: () => <GroupNode g={G('IMG-1-ladder-into-dag-sky')} />, inn: () => <Img src={staticFile(CUTFRAME['c3-ladder'])} style={fill} /> },
  // plan 3:01.4 lib:badsignal-max-1: BR-4 (CUTFRAME still, §6a cost trap) -> IMG-2
  { t: 181.4, id: 'badsignal-max-1', out: () => <Img src={staticFile(CUTFRAME['BR-4-datacenter-corridor-dolly'])} style={fill} />, inn: () => <GroupNode g={G('IMG-2-lone-layer-above-towers')} /> },
  // plan 3:15.1 lib:badsignal-short-2: cta-engage s3 -> IMG-3
  { t: 195.1, id: 'badsignal-short-2', out: () => <GroupNode g={G('cta-engage')} />, inn: () => <GroupNode g={G('IMG-3-kaspa-coin-sunrise')} /> },
];
same(LIB_CUTS.map((c) => [c.t, c.id]), LIB_PLAN_169, 'library transitions (beats / ids)');

// ─── overlays: F1 light leak (same window as the 16:9; percentage geometry reads the same on 9:16) ─────
const LEAK: [number, number] = [3.6665 - 2, 3.6665 + 2];
const LightLeak: React.FC = () => {
  const f = useCurrentFrame();
  const a = F(LEAK[0]), b = F(LEAK[1]);
  if (f < a || f >= b) return null;
  const op = interpolate(f, [a, a + 24, b - 24, b], [0, 0.3, 0.3, 0], clampX);
  const d = (f - a) / (b - a);
  return (
    <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: op, pointerEvents: 'none' }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 60% at ${78 - 30 * d}% ${18 + 20 * d}%, rgba(255,150,60,1) 0%, rgba(255,90,40,.55) 35%, rgba(255,60,30,0) 70%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 55% 45% at ${10 + 22 * d}% ${85 - 25 * d}%, rgba(255,200,120,.8) 0%, rgba(255,120,80,.3) 40%, rgba(255,80,60,0) 70%)` }} />
    </AbsoluteFill>
  );
};

// ─── captions: Montserrat 900, lowercase, 12px black stroke, pop 0.7 -> 1.12 -> 1, bottom-center, TOPMOST ──
// Portrait placement: over the chest/mic band (baseline ~y 1440), above the Shorts/Reels UI band.
const CAPS = ZCAPTIONS.map((c) => ({ tf: sh(c.t), h: c.h }));
const CAP_WINS = CAPTION_WINDOWS.map(([a, b]) => [sh(a), sh(b)] as [number, number]);
const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (!CAP_WINS.some(([a, b]) => t >= a && t < b)) return null;
  let cur: { tf: number; h: string } | null = null;
  for (const c of CAPS) { if (c.tf <= t) cur = c; else break; }
  if (!cur) return null;
  const nextT = (CAPS.find((c) => c.tf > cur!.tf) || { tf: Infinity }).tf;
  if (t >= Math.min(nextT, cur.tf + 1.3)) return null;
  const age = frame - Math.round(cur.tf * FPS);
  const sc = interpolate(age, [0, 4, 9], [0.7, 1.12, 1], clampX);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', left: 50, right: 50, bottom: 480, display: 'flex', justifyContent: 'center' }}>
        <div style={{
          fontFamily: `${MONTSERRAT},'Arial Black','Segoe UI',sans-serif`, fontWeight: 900, fontSize: 92,
          textTransform: 'lowercase', color: '#fff', WebkitTextStroke: '12px #000', paintOrder: 'stroke fill',
          letterSpacing: '0.01em', lineHeight: 1.05, textAlign: 'center', transform: `scale(${sc})`,
        } as React.CSSProperties}>{cur.h}</div>
      </div>
    </AbsoluteFill>
  );
};

// ─── the cover track: groups + card scenes in time order (later = on top) ──────────────────────────
type Layer = { from: number; to: number; node: React.ReactNode; key: string };
const LAYERS: Layer[] = (() => {
  const out: Layer[] = [];
  GROUPS.forEach((g, i) => {
    const next = GROUPS[i + 1];
    const card = CARDS.find((k) => Math.abs(F(k.t) - g.b) <= 1 && cardFrames(k).cs < g.b);
    let to = g.b + (next ? inFrames(next) : 0);
    if (card) to = cardFrames(card).cs + 1;
    out.push({ from: g.a, to: Math.min(to, DUR), node: <GroupLayer g={g} />, key: 'g' + i });
    if (card) {
      const nx = GROUPS[i + 1];
      const { cs, ce } = cardFrames(card);
      out.push({ from: cs, to: ce + (nx ? inFrames(nx) : 0), node: <CubeCard k={card} out={g} />, key: 'card' + card.t });
    }
  });
  return out;
})();

export const KaspaVprogsVertical: React.FC = () => {
  assertVerticalAssets();
  const frame = useCurrentFrame();
  return (
    <AbsFrame.Provider value={frame}>
      <AbsoluteFill style={{ background: '#000' }}>
        <Spine />
        <LightLeak />
        {LAYERS.map((l) => (
          <Sequence key={l.key} from={l.from} durationInFrames={Math.max(1, l.to - l.from)}>
            {l.node}
          </Sequence>
        ))}
        {LIB_CUTS.map((c) => {
          const { win, half } = winOf(c.id);
          return (
            <Sequence key={c.id} from={F(c.t) - half} durationInFrames={win}>
              <TransitionClip id={c.id} cutFrame={half} outgoing={c.out} incoming={c.inn} sfx={false} />
            </Sequence>
          );
        })}
        <Captions />
      </AbsoluteFill>
    </AbsFrame.Provider>
  );
};

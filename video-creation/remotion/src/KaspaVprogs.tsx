// KaspaVprogs.tsx: longform-edited comp for media/kaspa-vprogs, built TO the approved blueprint
// (EDIT-PLAN.md event log · CUE-SHEET.md · TRANSITIONS.md §5 / TRANSITION-PLAN.json · COVER-PLAN.json ·
// assets/diagrams/_state-cues.md · assets/charts/c3-ladder.spec.md), per skills/comp-build/comp-build.md.
// Spine = assets/spine.mp4 (spine/ALL.g.paused.mp4: face baked on the 2 FACE windows, cover beats black,
// two 1.5 s title-card pauses baked in). Every cue below is a SOURCE time (spine/ALL.f.cut.mp4) routed
// through sh()/F(). No music, no SFX, no watermark: audio = the spine VO only (post-mix owns the rest).
//
// DIAGRAM_REFS: vprog-loop-mini, c2-l2-stack, c1-overview, c1-kaspa-four-jobs, c1-vprog-nodes, c1-provers, composability-card, c3-next-rungs
// (end declared refs)
// TRANSITIONS_WAIVED: spin-3d-side-ease-right — named only in TRANSITIONS.md "Open questions" as an OPTIONAL
// second SPIN at 81.7 whose stated default is NO; it is not a §5 scene change, so it is not wired.
//
// Row kinds: 'deck' = a Type 2 system-design diagram's ENTRY (its full view, shown once) and 'container' =
// its spotlight states that follow (same ref = STATE SWAP, no ingress transition) plus every card-slide
// state; 'receipt' / 'vid' / 'still' as in comp-build §4; 'chart' = the live c3-ladder component.
import React, { createContext, useContext } from 'react';
import {
  AbsoluteFill, Easing, Freeze, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame,
} from 'remotion';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadMono } from '@remotion/google-fonts/JetBrainsMono';
import { TransitionClip } from './transitions/TransitionClip';
import { getTransition, framesForRow } from './transitions';
import { ZCAPTIONS, CAPTION_WINDOWS } from './KaspaVprogsCaptions';
import { KaspaVprogsLadder } from './KaspaVprogsLadder';

const MONTSERRAT = loadMontserrat('normal', { weights: ['900'], subsets: ['latin'] }).fontFamily;
const MONO = loadMono('normal', { weights: ['600', '700'], subsets: ['latin'] }).fontFamily;

// ─── §2 timing model ──────────────────────────────────────────────────────────────────────────────
export const FPS = 30;
const PAUSE = 1.5;                       // spine/ALL.g.paused.json pause_s (Mike GATE 3: 1.5 s, not the 1.0 default)
const CARD_T = [40.22, 137.46];          // spine/ALL.g.paused.json pauses[].at (CH3 snapped 137.58 -> 137.46 trough)
const SPINE_SECS = 202.822;              // SOURCE spine (ALL.f.cut.mp4) duration
const sh = (t: number) => t + PAUSE * CARD_T.filter((c) => c <= t).length;   // source -> paused-spine secs
const cardStart = (b: number) => b + PAUSE * CARD_T.filter((c) => c < b).length;
const F = (t: number) => Math.round(sh(t) * FPS);                           // source secs -> comp frame
export const DUR = Math.round((SPINE_SECS + CARD_T.length * PAUSE) * FPS);  // 6175 = the paused spine's frame count

// ─── the ONE absolute clock (§6a): engines re-mount nodes in nested Sequences ─────────────────────
const AbsFrame = createContext(0);
const useAbs = () => useContext(AbsFrame);

const fill = { width: '100%', height: '100%', objectFit: 'cover' } as const;
const clampX = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const eo = Easing.out(Easing.cubic);
const eio = Easing.inOut(Easing.cubic);

// ─── FACE windows (AS-RECORDED / blackdetect; verified on the paused spine: F1 frames 0-219, F2 845-957) ──
const FACE: [number, number][] = [[0.0, 7.333], [28.167, 31.933]];
// hand:punch (plan 0:03.8 + 0:30.6): hard ~17% snap on the word onset, held to the face-out.
const PUNCH_SRC: [number, number][] = [[3.78, 7.333], [30.62, 31.933]];
const PUNCH = 1.17;
const PUNCH_ORIGIN = '1240px 500px';     // Mike's face center on the 16:9 spine; clears both pillarbox bars at 1.17
const punchAt = (f: number) => (PUNCH_SRC.some(([a, b]) => f >= F(a) && f < F(b)) ? PUNCH : 1);

// ─── §4 cover track (one row per state / sub-point, SOURCE seconds, EDIT-PLAN row for row) ───────
type Kind = 'receipt' | 'deck' | 'container' | 'vid' | 'still' | 'chart';
type Cover = {
  tIn: number; tOut: number; kind: Kind; ref: string; state?: string;
  ing?: string;          // ingress (plan id) on a group's FIRST row; state swaps carry none
  clip?: number;         // vid: file seconds the slot starts at
  lead?: boolean; cap?: boolean;
};
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

// ─── §8 captions: generated data, gated to the >5 s FACE holds (F1 only; F2 is 3.77 s) ───────────
const CAPTION_SRC: [number, number][] = [[0.0, 7.333]];   // literal mirror of CAPTION_WINDOWS for lint_covers
if (JSON.stringify(CAPTION_SRC) !== JSON.stringify(CAPTION_WINDOWS)) {
  throw new Error('CAPTION_SRC drifted from the generated CAPTION_WINDOWS');
}

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
// hand-rolled ingress lengths (TRANSITIONS.md §3): xfade-scale 0.35 s · Envato fade 0.5 s · same-page xfade 0.27 s
const HAND_IN: Record<string, number> = { 'hand:xfade-scale': 11, 'hand:fade': 15, 'hand:xfade': 8 };
const inFrames = (g: Group) => HAND_IN[g.ing] ?? 0;

// ─── chapter cards: ONE pick, hand:cube-3d (rotateY in ~11f, hold through the pause, never cube out) ──
type Card = { t: number; png: string; lead: number };
const CARDS: Card[] = [
  { t: 40.22, png: 'title-slides/title-card-ch2.png', lead: 0.0 },    // plan 0:40.2 hand:cube-3d 'NOT AN L2'
  { t: 137.46, png: 'title-slides/title-card-ch3.png', lead: 0.25 },  // plan 2:17.6 hand:cube-3d 'WHERE IT STANDS'
];
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

// ─── receipts: full-width page + a reading camera (fx, fy = image point held at frame center) ────────
type Kf = [number, number, number, number];   // [source t, fx, fy, scale vs fit-width]
type Rc = { file: string; w: number; h: number; bg: string; kf: Kf[] };
const RECEIPTS: Record<string, Rc> = {
  'R1-yellow-paper-title-page': { file: 'R1-yellow-paper-title-page.png', w: 2382, h: 3368, bg: '#fffdf0',
    kf: [[7.333, 0.5, 0.24, 1.25], [7.62, 0.5, 0.24, 1.15]] },                    // quick scale-back pop, no reading move
  'R2-rusty-kaspa-v2-toccata-release': { file: 'R2-rusty-kaspa-v2-toccata-release.png', w: 3840, h: 1560, bg: '#ffffff',
    kf: [[14.54, 0.5, 0.4, 1.45], [15.4, 0.5, 0.4, 1.47], [17.16, 0.5, 0.555, 2.0], [17.6, 0.5, 0.555, 2.0],
      [18.42, 0.6, 0.57, 2.05], [21.22, 0.61, 0.57, 2.1]] },                         // push to the KIP list, then the activation line
  'R3-vitalik-rollup-centric-roadmap': { file: 'R3-vitalik-rollup-centric-roadmap.png', w: 1776, h: 3036, bg: '#ffffff',
    kf: [[40.22, 0.5, 0.0, 1.0], [44.64, 0.5, 0.0, 1.02], [46.4, 0.54, 0.33, 1.22], [47.52, 0.54, 0.33, 1.24],
      [49.0, 0.45, 0.975, 1.22], [52.18, 0.45, 0.975, 1.25]] },                      // wide establish -> 'all-in' -> 'primary accounts'
  'R4-kasmagazine-obsolete-path-quote': { file: 'R4-kasmagazine-obsolete-path-quote.png', w: 1662, h: 632, bg: '#ffffff',
    kf: [[72.96, 0.5, 0.5, 1.0], [76.78, 0.53, 0.52, 1.12], [81.7, 0.53, 0.52, 1.17]] },
  'R5-a-docs-kaspa-toccata-activation': { file: 'R5-a-docs-kaspa-toccata-activation.png', w: 2186, h: 492, bg: '#ffffff',
    kf: [[130.44, 0.5, 0.5, 1.05], [133.44, 0.5, 0.6, 1.2]] },
  'R5-b-docs-kaspa-toccata-zk-precompiles': { file: 'R5-b-docs-kaspa-toccata-zk-precompiles.png', w: 2178, h: 1276, bg: '#ffffff',
    kf: [[133.44, 0.5, 0.45, 1.0], [134.52, 0.5, 0.66, 1.3], [137.46, 0.5, 0.66, 1.34]] },
  'R6-silverscript-v1-0-0-release': { file: 'R6-silverscript-v1-0-0-release.png', w: 3840, h: 1800, bg: '#ffffff',
    kf: [[160.34, 0.45, 0.4, 1.5], [162.0, 0.42, 0.47, 1.85], [163.28, 0.42, 0.47, 1.9]] },
  'R7-kaspa-org-build-vprogs-in-construction': { file: 'R7-kaspa-org-build-vprogs-in-construction.png', w: 1768, h: 444, bg: '#f5f5f7',
    kf: [[169.78, 0.5, 0.5, 1.0], [172.12, 0.47, 0.55, 1.3], [172.84, 0.47, 0.55, 1.32]] },
  'R8-kasmagazine-covenant-fork-3-6-months': { file: 'R8-kasmagazine-covenant-fork-3-6-months.png', w: 1698, h: 360, bg: '#ffffff',
    kf: [[172.84, 0.5, 0.5, 1.0], [174.6, 0.5, 0.5, 1.03], [176.3, 0.35, 0.3, 1.6], [178.54, 0.35, 0.3, 1.62]] },
};
// R6 has no baked highlight: the comp draws the 'official release' marker over the page's own words (162.22)
const R6_MARK = { t: 162.22, x0: 0.271, y0: 0.459, x1: 0.346, y1: 0.486 };

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

const ReceiptView: React.FC<{ g: Group; f: number }> = ({ g, f }) => {
  const r = RECEIPTS[g.ref];
  const [fx, fy, s] = camAt(r.kf, f);
  const W = 1920 * s;
  const H = r.h * (1920 / r.w) * s;
  let left = 960 - fx * W;
  let top = 540 - fy * H;
  left = W >= 1920 ? Math.min(0, Math.max(1920 - W, left)) : (1920 - W) / 2;
  top = H >= 1080 ? Math.min(0, Math.max(1080 - H, top)) : (1080 - H) / 2;
  const isR6 = g.ref === 'R6-silverscript-v1-0-0-release';
  const isR8 = g.ref === 'R8-kasmagazine-covenant-fork-3-6-months';
  const mk = isR6 ? interpolate(f, [F(R6_MARK.t), F(R6_MARK.t) + 8], [0, 1], { ...clampX, easing: eo }) : 0;
  // R8: 'DELIVERED 2026-06-30' stamp slams on "shipped" (177.66, Mike APPROVED) + comp crash zoom on it
  const st = F(177.66);
  const crash = isR8 ? interpolate(f, [st, st + 4, st + 14], [1, 1.12, 1.08], { ...clampX, easing: eo }) : 1;
  const chip = isR8 ? interpolate(f, [F(174.4), F(174.9)], [1, 0], clampX) : 0;
  return (
    <AbsoluteFill style={{ background: r.bg, overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `scale(${crash})`, transformOrigin: '1440px 925px' }}>
        <Img src={staticFile('receipts/' + r.file)} style={{ position: 'absolute', left, top, width: W, height: H }} />
        {isR6 && mk > 0 && (
          <div style={{
            position: 'absolute', left: left + R6_MARK.x0 * W, top: top + R6_MARK.y0 * H,
            width: (R6_MARK.x1 - R6_MARK.x0) * W * mk, height: (R6_MARK.y1 - R6_MARK.y0) * H,
            background: 'rgba(255, 214, 0, 0.55)', mixBlendMode: 'multiply', borderRadius: 4,
          }} />
        )}
        {isR8 && chip > 0 && (
          <div style={{
            position: 'absolute', left: 1920 * 0.042, top: 250, opacity: chip, fontFamily: MONO, fontWeight: 600,
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
      position: 'absolute', left: 1440, top: 925, transform: `translate(-50%, -50%) rotate(-8deg) scale(${sc})`,
      opacity: interpolate(f, [0, 2], [0, 1], clampX),
      background: 'rgba(10,12,16,0.94)', border: '6px solid #00e68a', borderRadius: 18, padding: '18px 40px 20px',
      boxShadow: '0 0 0 4px rgba(0,230,138,.25), 0 0 60px rgba(0,230,138,.45)', textAlign: 'center',
    }}>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 76, letterSpacing: '.14em', color: '#00e68a', lineHeight: 1 }}>DELIVERED</div>
      <div style={{ fontFamily: MONO, fontWeight: 600, fontSize: 44, letterSpacing: '.1em', color: '#e8eaf0', marginTop: 10 }}>2026-06-30</div>
    </div>
  );
};

// ─── state PNG containers (diagrams + card slides): 7f state cross-fade, never a dead still ───────
const DIAGRAMS = new Set(['vprog-loop-mini', 'c2-l2-stack', 'c1-overview', 'c1-kaspa-four-jobs', 'c1-vprog-nodes',
  'c1-provers', 'composability-card', 'c3-next-rungs']);
const pngFor = (ref: string, state?: string) =>
  ref === 'ten-bps-card' ? 'card-slides/ten-bps-card.png'
    : (DIAGRAMS.has(ref) ? 'diagrams/' : 'card-slides/') + ref + '-' + state + '.png';
const XF = 7;
// c1-kaspa-four-jobs EXECUTE drop (state cues): the SAME row falls 99.80 -> 100.26 (14f, ease-in):
// translate(0,0)->(30,144) px, rotate 0->1.5deg, opacity 1->.45; the dashed slot is revealed behind it.
const DROP = { a: 99.8, b: 100.26, x0: 150, y0: 728, x1: 1062, y1: 824, split: 850 };

const StateView: React.FC<{ g: Group; f: number }> = ({ g, f }) => {
  let i = 0;
  g.rows.forEach((r, j) => { if (F(r.tIn) <= f) i = j; });
  const cur = g.rows[i];
  const prev = i > 0 ? g.rows[i - 1] : null;
  const s0 = F(cur.tIn);
  let op = prev ? interpolate(f, [s0, s0 + XF], [0, 1], clampX) : 1;
  const diagram = DIAGRAMS.has(g.ref);
  let scale = interpolate(f, [g.a, g.b], [1, diagram ? 1.03 : 1.02], clampX);   // §7a slow push
  let origin = '50% 50%';
  let extra = 1;
  let extraOrigin = '50% 50%';
  let under: string | null = prev ? pngFor(g.ref, prev.state) : null;
  let drop: React.ReactNode = null;

  if (g.ref === 'c2-l2-stack' && cur.state === 'pieces') {          // red outlines pulse twice 1 -> .6 -> 1 (20f each)
    const p = s0 + XF;
    op = Math.min(op, interpolate(f, [p, p + 10, p + 20, p + 30, p + 40], [1, 0.6, 1, 0.6, 1], clampX));
  }
  if (g.ref === 'c1-overview') {                                    // ORDERS pulse on "sequencer" 94.06, 16f, Kaspa-node crop
    const p = F(94.06);
    extra = interpolate(f, [p, p + 8, p + 16], [1, 1.03, 1], { ...clampX, easing: eio });
    extraOrigin = '889px 420px';
  }
  if (g.ref === 'ten-bps-card') {                                   // '10 BLOCKS / SEC' slam on "10" 25.92 = punch on the card
    const p = F(25.92);
    extra = interpolate(f, [p, p + 3, p + 9], [1, 1.12, 1.08], { ...clampX, easing: eo });
    extraOrigin = '390px 490px';
    op = 1; under = null;
  }
  if (g.ref === 'end-card-community') {                             // lower-third pulse on "link" 197.54
    const p = F(197.54);
    extra = interpolate(f, [p, p + 7, p + 18], [1, 1.04, 1], { ...clampX, easing: eio });
    extraOrigin = '600px 392px';
  }
  if (g.ref === 'c1-kaspa-four-jobs') {
    const da = F(DROP.a), db = F(DROP.b);
    if (cur.state === 'dropped') { op = 1; under = null; }          // the drop composite already equals 'dropped'
    if (cur.state === 'execute' && f >= da) {
      const p = interpolate(f, [da, db], [0, 1], { ...clampX, easing: Easing.in(Easing.quad) });
      const exe = staticFile(pngFor(g.ref, 'execute'));
      const dropped = staticFile(pngFor(g.ref, 'dropped'));
      drop = (
        <AbsoluteFill>
          <Img src={dropped} style={{ ...fill, position: 'absolute', clipPath: `inset(0 0 ${1080 - DROP.split}px 0)` }} />
          <Img src={exe} style={{ ...fill, position: 'absolute', clipPath: `inset(${DROP.split}px 0 0 0)` }} />
          <div style={{
            position: 'absolute', left: DROP.x0, top: DROP.y0, width: DROP.x1 - DROP.x0, height: DROP.y1 - DROP.y0,
            overflow: 'hidden', opacity: 1 - 0.55 * p,
            transform: `translate(${30 * p}px, ${144 * p}px) rotate(${1.5 * p}deg)`, transformOrigin: '50% 50%',
          }}>
            <Img src={exe} style={{ position: 'absolute', left: -DROP.x0, top: -DROP.y0, width: 1920, height: 1080 }} />
          </div>
        </AbsoluteFill>
      );
    }
  }
  return (
    <AbsoluteFill style={{ background: '#0a0c10', overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: origin }}>
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
const VID_SECS: Record<string, number> = {
  'BR-1-glass-planes-rising': 6.0, 'BR-2-glass-shatter': 3.4,
  'BR-3-ice-glow-cracks-split': 5.16, 'BR-4-datacenter-corridor-dolly': 4.84,
};
const VidView: React.FC<{ g: Group; f: number }> = ({ g, f }) => {
  const clip = g.rows[0].clip ?? 0;
  const mf = Math.min(Math.floor(VID_SECS[g.ref] * FPS) - 2, Math.round(clip * FPS) + (f - g.a));
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <Freeze frame={mf}>
        <OffthreadVideo src={staticFile('vid/' + g.ref + '.mp4')} muted style={fill} />
      </Freeze>
    </AbsoluteFill>
  );
};
// §6a cost trap: the badsignal engine OUT of BR-4 gets the pre-extracted frame at its window start, not the video.
const CUTFRAME: Record<string, string> = {
  'BR-4-datacenter-corridor-dolly': 'vid/cutframes/BR-4-datacenter-corridor-dolly.cut.jpg',
  // Same trap, CODE side: the spin motion-blurs mirrored copies of the incoming node, and fed the live chart
  // DOM it hung Chrome at frame 4282 (chunk QA, twice). The chart is STATIC in its 'empty' state for the whole
  // spin window (first move = 140.70 rung, after the window), so the engine gets the comp's own render of
  // that frame (remotion still --frame=4299); the live KaspaVprogsLadder plays from the window's end.
  'c3-ladder': 'charts/cutframes/c3-ladder-entry.cut.png',
};

const StillView: React.FC<{ g: Group; f: number }> = ({ g, f }) => {
  const kb = interpolate(f, [g.a, g.b], [1.0, 1.06], clampX);   // AI stills: slow push, never dead
  return (
    <AbsoluteFill style={{ background: '#000', overflow: 'hidden' }}>
      <Img src={staticFile('img/' + g.ref + '.png')} style={{ ...fill, transform: `scale(${kb})` }} />
    </AbsoluteFill>
  );
};

/** One cover group's CONTENT at the absolute clock (clamped to its entry), no ingress styling:
 * the same node feeds the cover track and every engine window, so both sides always match. */
const GroupNode: React.FC<{ g: Group }> = ({ g }) => {
  const f = Math.max(g.a, useAbs());
  const c = g.rows[0];
  if (c.kind === 'chart') {
    if (c.ref === 'c3-ladder') return <KaspaVprogsLadder frame={f} F={F} />;   // Type 1 ANIMATED, code-built
    throw new Error('chart without a live component: ' + c.ref);
  }
  if (c.kind === 'receipt') return <ReceiptView g={g} f={f} />;
  if (c.kind === 'vid') return <VidView g={g} f={f} />;
  if (c.kind === 'still') return <StillView g={g} f={f} />;
  return <StateView g={g} f={f} />;                                           // deck / container
};

/** Cover-track layer: the group + its hand-rolled ingress (xfade-scale 0.93->1 / fade / xfade). */
const GroupLayer: React.FC<{ g: Group }> = ({ g }) => {
  const abs = useAbs();
  const n = inFrames(g);
  let op = 1, sc = 1;
  if (n > 0) {
    op = interpolate(abs, [g.a, g.a + n], [0, 1], { ...clampX, easing: eo });
    if (g.ing === 'hand:xfade-scale' || g.ref === 'ten-bps-card') {   // ten-bps-card rides in with its 0.93->1 scale-in
      sc = interpolate(abs, [g.a, g.a + n], [0.93, 1], { ...clampX, easing: eo });
    }
  }
  return (
    <AbsoluteFill style={{ opacity: op, transform: `scale(${sc})` }}>
      <GroupNode g={g} />
    </AbsoluteFill>
  );
};

// ─── the card scene: cube from-right over the outgoing cover, then hold ─────────────────────────────
const CardHeld: React.FC<{ k: Card }> = ({ k }) => <Img src={staticFile(k.png)} style={fill} />;
const CubeCard: React.FC<{ k: Card; out: Group }> = ({ k, out }) => {
  const abs = useAbs();
  const { cs } = cardFrames(k);
  const p = interpolate(abs, [cs, cs + TURN], [0, 1], { ...clampX, easing: eio });
  if (p >= 1) return <CardHeld k={k} />;
  return (
    <AbsoluteFill style={{ background: '#000', perspective: 2400, overflow: 'hidden' }}>
      <AbsoluteFill style={{ transformStyle: 'preserve-3d', transform: `translateZ(-960px) rotateY(${-90 * p}deg)` }}>
        <AbsoluteFill style={{ transform: 'translateZ(960px)', backfaceVisibility: 'hidden' }}>
          <GroupNode g={out} />
        </AbsoluteFill>
        <AbsoluteFill style={{ transform: 'rotateY(90deg) translateZ(960px)', backfaceVisibility: 'hidden' }}>
          <CardHeld k={k} />
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── the spine and its faithful freeze (§6a: <Freeze>, muted, same transform, same source) ─────────
const Spine: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: '#000' }}>
      <AbsoluteFill style={{ transform: `scale(${punchAt(f)})`, transformOrigin: PUNCH_ORIGIN }}>
        <OffthreadVideo src={staticFile('spine.mp4')} style={fill} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
/** Face side of a face cut: the live spine frame while the face still airs, held on the face window's
 * edge frame past it (never walks into the blackout), muted, with the live punch scale. */
const SpineStill: React.FC<{ lo: number; hi: number }> = ({ lo, hi }) => {
  const f = Math.min(hi, Math.max(lo, useAbs()));
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: '#000' }}>
      <AbsoluteFill style={{ transform: `scale(${punchAt(f)})`, transformOrigin: PUNCH_ORIGIN }}>
        <Freeze frame={f}>
          <OffthreadVideo src={staticFile('spine.mp4')} muted style={fill} />
        </Freeze>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
const faceLo = (i: number) => F(FACE[i][0]);
const faceHi = (i: number) => F(FACE[i][1]) - 1;

// every lib: transition of TRANSITIONS.md §5, cover->cover / face<->cover, SFX left to the post-mix
const LIB_CUTS: LibCut[] = [
  // plan 0:07.3 lib:blocks-max-1: F1 face OUT -> R1 (outgoing = SpineStill at the punched scale)
  { t: 7.333, id: 'blocks-max-1', out: () => <SpineStill lo={faceLo(0)} hi={faceHi(0)} />, inn: () => <GroupNode g={G('R1-yellow-paper-title-page')} /> },
  // plan 0:28.2 lib:blocks-max-2: ten-bps-card -> F2 face IN on the picture edge 28.167
  { t: 28.167, id: 'blocks-max-2', out: () => <GroupNode g={G('ten-bps-card')} />, inn: () => <SpineStill lo={faceLo(1)} hi={faceHi(1)} /> },
  // plan 0:31.9 lib:blocks-max-3: F2 face OUT -> execute-verify-flip s1
  { t: 31.933, id: 'blocks-max-3', out: () => <SpineStill lo={faceLo(1)} hi={faceHi(1)} />, inn: () => <GroupNode g={G('execute-verify-flip')} /> },
  // plan 1:34.5 lib:melt-rgb-3 (MELT = TRANSFORM): c1-overview -> c1-kaspa-four-jobs (replaces the push-in match)
  { t: 94.5, id: 'melt-rgb-3', out: () => <GroupNode g={G('c1-overview')} />, inn: () => <GroupNode g={G('c1-kaspa-four-jobs')} /> },
  // plan 2:17.6 lib:badsignal-short-1: CH3 card (pause end) -> IMG-1 (cut on the real pause end 137.46)
  { t: 137.46, id: 'badsignal-short-1', out: () => <CardHeld k={CARDS[1]} />, inn: () => <GroupNode g={G('IMG-1-ladder-into-dag-sky')} /> },
  // plan 2:19.8 lib:spin-3d-side-ease-up (SPIN = NEW FACET): IMG-1 -> the live c3-ladder chart
  { t: 139.84, id: 'spin-3d-side-ease-up', out: () => <GroupNode g={G('IMG-1-ladder-into-dag-sky')} />, inn: () => <Img src={staticFile(CUTFRAME['c3-ladder'])} style={fill} /> },
  // plan 3:01.4 lib:badsignal-max-1: BR-4 (CUTFRAME still, §6a cost trap) -> IMG-2
  { t: 181.4, id: 'badsignal-max-1', out: () => <Img src={staticFile(CUTFRAME['BR-4-datacenter-corridor-dolly'])} style={fill} />, inn: () => <GroupNode g={G('IMG-2-lone-layer-above-towers')} /> },
  // plan 3:15.1 lib:badsignal-short-2: cta-engage s3 -> IMG-3
  { t: 195.1, id: 'badsignal-short-2', out: () => <GroupNode g={G('cta-engage')} />, inn: () => <GroupNode g={G('IMG-3-kaspa-coin-sunrise')} /> },
];

// ─── overlays: F1 light leak (hold 7.33 s > 5 s: centered, min(7.333 - 2, 4) = 4 s, ~0.3 screen) ─────
const LEAK: [number, number] = [3.6665 - 2, 3.6665 + 2];
const LightLeak: React.FC = () => {
  const f = useCurrentFrame();
  const a = F(LEAK[0]), b = F(LEAK[1]);
  if (f < a || f >= b) return null;
  const op = interpolate(f, [a, a + 24, b - 24, b], [0, 0.3, 0.3, 0], clampX);
  const d = (f - a) / (b - a);
  return (
    <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: op, pointerEvents: 'none' }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 70% at ${78 - 30 * d}% ${18 + 20 * d}%, rgba(255,150,60,1) 0%, rgba(255,90,40,.55) 35%, rgba(255,60,30,0) 70%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 45% 55% at ${10 + 22 * d}% ${85 - 25 * d}%, rgba(255,200,120,.8) 0%, rgba(255,120,80,.3) 40%, rgba(255,80,60,0) 70%)` }} />
    </AbsoluteFill>
  );
};

// ─── captions: Montserrat 900, lowercase, 12px black stroke, pop 0.7 -> 1.12 -> 1, bottom-center, TOPMOST ──
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
      <div style={{ position: 'absolute', left: 60, right: 60, bottom: 120, display: 'flex', justifyContent: 'center' }}>
        <div style={{
          fontFamily: `${MONTSERRAT},'Arial Black','Segoe UI',sans-serif`, fontWeight: 900, fontSize: 86,
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
    if (card) to = cardFrames(card).cs + 1;          // hidden behind the cube from its first frame
    out.push({ from: g.a, to: Math.min(to, DUR), node: <GroupLayer g={g} />, key: 'g' + i });
    if (card) {
      const nx = GROUPS[i + 1];
      const { cs, ce } = cardFrames(card);
      out.push({ from: cs, to: ce + (nx ? inFrames(nx) : 0), node: <CubeCard k={card} out={g} />, key: 'card' + card.t });
    }
  });
  return out;
})();

export const KaspaVprogs: React.FC = () => {
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

// BullishOnKaspa.tsx: bullish-on-kaspa (longform-edited, 16:9, comp-build.md), built TO EDIT-PLAN.md row for row.
// Spine + a muted cover track, library transitions in exact engine windows, kinetic-text 2023 devices (Energetic theme),
// face style optics, LIGHT containers. NO music, NO SFX, NO watermark: post-mix owns the audio (comp-build.md section 9).
//
// TIME: every cue is a SOURCE-spine second through sh() / F(). The sidecar spine/ALL.f.paused.json pauses[] IS the time map.
// LIBRARY WINDOW PLACEMENT: a window is exactly `win` frames (section 6a) and its engine's SWAP fraction (params.cut /
// swapAt) sits ON the cut frame, so a leak peaks ON its join and the B side never shows a pre-cut (black) spine frame.
//
// DIAGRAM_REFS: C1-A-chain, C1-A-fork, C1-A, C1-B, C1-B-lit, C1-C-start, C1-C-mid, C1-C, C5-overview, C5-toccata, C5-intro, C5-zk, C5-jul2, indexer-vs-l1-l1, indexer-vs-l1-flaw, consensus-validates-rules, consensus-validates-validators, consensus-validates-indexer-out, kasplex-based-rollup-base, kasplex-based-rollup-gas, D1-A, D1-A-lit, D1-A-norollup, cascade-base, cascade-wave1, cascade-wave2, cascade-wave3
// (end declared refs)
import React from 'react';
import { AbsoluteFill, Easing, Freeze, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { ENGINES, TransitionClip, framesForRow, getTransitionRow } from './BullishOnKaspaTransitions';
import {
  DirBlur,
  KtClock,
  KtHeadlineOverBroll,
  KtIconPop,
  KtKeywordPop,
  KtLowerThirdBand,
  KtSidePanel,
  KtWhipCut,
  ktSidePanelShift,
} from './effects/kinetic-text';
import {
  ACCENT,
  C17,
  C2A,
  C2B,
  C2C,
  C2D,
  C3,
  C4,
  FilmBurn,
  IconPickaxe,
  IconShieldCheck,
  KT_FONT,
  KtCaptionLine,
  KtChip,
  KtPhrase,
  KtStack,
  KtSubscribeBar,
  KtTwoColourPop,
  KtWall,
  LightPop,
  StickerDiscord,
  StickerKaspa,
} from './BullishOnKaspaCharts';
import { KT_PHRASES } from './BullishOnKaspaData';
import { CAPTION_WINDOWS, ZCAPTIONS } from './BullishOnKaspaCaptions';

export const FPS = 30;
export const SPINE_SECS = 528.367; // spine/ALL.d.desilenced.mp4
export const PAUSE = 3.5; // the card pause (mixed durations: pauses[].dur below)
export const CARD_T = [65.4, 455.705];
// spine/ALL.f.paused.json pauses[]: BRAAM-1 beat pause · CLIP-1 insert · TEXT WALL card
export const INSERTS = [{ at: 65.4, dur: 1.0 }, { at: 302.165, dur: 10.8 }, { at: 455.705, dur: 3.5 }];
export const sh = (t: number) => t + INSERTS.reduce((a, p) => a + (p.at <= t ? p.dur : 0), 0);
export const F = (t: number) => Math.round(sh(t) * FPS);
const T = (t: number) => F(t) / FPS; // comp-clock second of a source second, on its frame
export const DUR = 16311; // assets/spine.mp4 frames (ffprobe, 543.7 s)

/** comp frame -> SOURCE second (held inside a pause) */
const srcOf = (frame: number) => {
  const tc = frame / FPS;
  let sum = 0;
  for (const p of INSERTS) {
    if (tc < p.at + sum) return tc - sum;
    if (tc < p.at + sum + p.dur) return p.at;
    sum += p.dur;
  }
  return tc - sum;
};

export const FACE_REFRAME = { scale: 1.398, x: -651, y: -415 }; // assets/face-reframe.json, never hand-tuned
const FACE_POINT = { x: 960, y: 432 }; // face_point_out
const FACE_WINDOWS: [number, number][] = [[0.0, 3.367], [19.433, 26.633], [31.433, 35.7], [97.3, 104.2], [233.233, 237.9], [302.133, 335.933], [447.9, 455.667], [490.967, 500.033], [511.033, 528.367]];
// pre-framed swap clips (section 3b): full-frame, NO FACE_REFRAME, from the sidecar's window_starts_at_clip_s, muted
const SWAPS = [
  { id: 'F1', tIn: 0.0, tOut: 3.367, ws: 0.0 },
  { id: 'F2', tIn: 19.433, tOut: 26.633, ws: 0.4 },
  { id: 'F3', tIn: 31.433, tOut: 35.7, ws: 0.4 },
];

// punch-ins ON the desilencer joins (spine/jumpcuts-final.json), alternating in / back, hard 18 percent about the face point
const PUNCH_SCALE = 1.18;
const PUNCHES = [
  { at: 311.567, s: PUNCH_SCALE, until: 335.933 }, // [PUNCH-IN] F6
  { at: 455.1, s: PUNCH_SCALE, until: 455.705 }, // [PUNCH-IN] F7
  { at: 495.467, s: PUNCH_SCALE, until: 499.367 }, // [PUNCH-IN] F8 in
  { at: 527.467, s: PUNCH_SCALE, until: 999 }, // [PUNCH-IN] F9 (499.367 = F8 back to the base frame)
];
const punchAt = (t: number) => PUNCHES.find((p) => t >= p.at && t < p.until)?.s ?? 1;

// Comp frame context: every node an engine re-mounts reads ONE absolute clock (section 6a)
const AbsFrame = React.createContext(0);
const useAbs = () => React.useContext(AbsFrame);

const fill: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };
const box: React.CSSProperties = { position: 'absolute', inset: 0 };
const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// frame-for-frame playback of the 24 / 25 fps clips (comp-build.md section 11)
const VID_FPS: Record<string, number> = {
  'BR-1-phone-chart-hands': 25/1,
  'BR-4-code-monitor-closeup': 25/1,
  'BR-5-programmer-night-office': 24000/1001,
  'BR-6-night-aerial-city-dusk': 25/1,
  'BR-7-old-books-library': 25/1,
  'BR-8-cargo-ship-sailing': 25/1,
  'BR-10-red-server-room': 25/1,
  'BR-12-datacenter-hallway': 25/1,
  'BR-16-speaker-on-stage': 24/1,
  'BR-19-mining-warehouse-rows': 25/1,
};
const rateOf = (ref: string) => (VID_FPS[ref] ? 30 / VID_FPS[ref] : 1);

type Cover = {
  tIn: number;
  tOut: number;
  kind: 'vid' | 'still' | 'receipt' | 'deck' | 'container' | 'chart';
  ref: string;
  state?: string;
  tx?: 'cut' | 'fade' | 'xfade' | 'swap' | 'pushL' | 'pushT' | 'pushoutR' | 'whip' | 'lib';
  d?: number; // ingress frames (swap / fade)
  lead?: boolean;
  cap?: boolean;
};

// one row per state / sub-point (EDIT-PLAN + COVER-PLAN edges). tx = the wired ingress, tagged with its plan id.
export const COVERS: Cover[] = [
  // CH1 THE HOOK
  { tIn: 3.367, tOut: 6.0, kind: 'vid', ref: 'BR-1-phone-chart-hands', tx: 'whip' }, // hand:film-burn + the headline's whip-zoom landing
  { tIn: 6.0, tOut: 9.7, kind: 'vid', ref: 'BR-2-asic-shelves-blue', tx: 'whip' }, // hand:kt-whip-cut
  { tIn: 9.7, tOut: 13.36, kind: 'vid', ref: 'BR-3-teal-cooling-fans', tx: 'fade', d: 15 }, // hand:fade
  { tIn: 13.36, tOut: 17.12, kind: 'receipt', ref: 'C21-kaspa-org-hero', tx: 'pushoutR' }, // hand:kt-push-slide, the stack pushes out RIGHT with its footage
  { tIn: 17.12, tOut: 19.433, kind: 'still', ref: 'IMG-1-pickaxe-coin', tx: 'lib' }, // lib:invert-short-2
  { tIn: 26.633, tOut: 29.4, kind: 'vid', ref: 'BR-4-code-monitor-closeup', tx: 'whip' }, // hand:film-burn + whip-zoom landing
  { tIn: 29.4, tOut: 31.433, kind: 'vid', ref: 'BR-5-programmer-night-office', tx: 'fade', d: 15 }, // hand:fade
  { tIn: 35.7, tOut: 37.84, kind: 'vid', ref: 'BR-6-night-aerial-city-dusk', tx: 'cut' }, // hand:film-burn
  // CH2 WHAT IT IS
  { tIn: 37.84, tOut: 40.12, kind: 'still', ref: 'IMG-2-coin-hero', tx: 'whip' }, // hand:kt-whip-cut chapter whip
  { tIn: 40.12, tOut: 43.52, kind: 'deck', ref: 'C1-A-chain', state: 'chain', tx: 'pushL' }, // hand:kt-push-slide
  { tIn: 43.52, tOut: 46.26, kind: 'deck', ref: 'C1-A-fork', state: 'fork', tx: 'swap', d: 8 },
  { tIn: 46.26, tOut: 46.98, kind: 'deck', ref: 'C1-A', state: 'dropped', tx: 'swap', d: 8 },
  { tIn: 46.98, tOut: 51.36, kind: 'deck', ref: 'C1-B', state: 'dag', tx: 'lib' }, // lib:melt-rgb-short-3
  { tIn: 51.36, tOut: 52.98, kind: 'deck', ref: 'C1-B-lit', state: 'thread', tx: 'swap', d: 42 }, // the thread lands on 'order' 52.76
  { tIn: 52.98, tOut: 56.44, kind: 'deck', ref: 'C1-C-start', state: 'bracket', tx: 'swap', d: 8 },
  { tIn: 56.44, tOut: 57.78, kind: 'deck', ref: 'C1-C-mid', state: 'filling', tx: 'swap', d: 30 },
  { tIn: 57.78, tOut: 59.3, kind: 'deck', ref: 'C1-C', state: 'ten', tx: 'swap', d: 8 },
  { tIn: 59.3, tOut: 63.6, kind: 'receipt', ref: 'C27-rusty-kaspa-v1', tx: 'xfade' }, // hand:xfade-scale
  { tIn: 63.6, tOut: 65.54, kind: 'still', ref: 'IMG-3-sombrero-coin', tx: 'lib' }, // lib:invert-max-1, holds through the beat pause
  { tIn: 65.54, tOut: 75.1, kind: 'chart', ref: 'C2-A', tx: 'pushL' }, // hand:kt-push-slide
  { tIn: 75.1, tOut: 78.72, kind: 'vid', ref: 'BR-7-old-books-library', tx: 'whip' }, // hand:kt-whip-cut
  { tIn: 78.72, tOut: 87.18, kind: 'receipt', ref: 'C19-eth-whitepaper-ghost', tx: 'xfade' }, // hand:xfade-scale
  { tIn: 87.18, tOut: 88.94, kind: 'container', ref: 'research-stack-s1', tx: 'xfade' }, // hand:xfade-scale
  { tIn: 88.94, tOut: 91.1, kind: 'container', ref: 'research-stack-s2', tx: 'swap', d: 5 },
  { tIn: 91.1, tOut: 92.26, kind: 'container', ref: 'research-stack-s3', tx: 'swap', d: 5 },
  { tIn: 92.26, tOut: 97.3, kind: 'receipt', ref: 'C16-arxiv-founder', tx: 'xfade' }, // hand:xfade-scale
  // CH3 WHAT JUST LAUNCHED
  { tIn: 104.2, tOut: 107.86, kind: 'vid', ref: 'BR-8-cargo-ship-sailing', tx: 'cut' }, // hand:film-burn
  { tIn: 107.86, tOut: 111.7, kind: 'receipt', ref: 'C6-rusty-kaspa-v2-toccata', tx: 'xfade' }, // hand:xfade-scale
  { tIn: 111.7, tOut: 111.8, kind: 'deck', ref: 'C5-overview', state: 'overview', tx: 'pushT' }, // hand:kt-push-slide, shown ONCE, the push-in only
  { tIn: 111.8, tOut: 112.64, kind: 'deck', ref: 'C5-toccata', state: 'toccata', tx: 'swap', d: 6 },
  { tIn: 112.64, tOut: 114.52, kind: 'deck', ref: 'C5-intro', state: 'intro', tx: 'swap', d: 8 },
  { tIn: 114.52, tOut: 119.4, kind: 'deck', ref: 'C5-zk', state: 'zk', tx: 'swap', d: 8 },
  { tIn: 119.4, tOut: 123.5, kind: 'deck', ref: 'C5-jul2', state: 'jul2', tx: 'swap', d: 8 },
  { tIn: 123.5, tOut: 127.0, kind: 'receipt', ref: 'C8-silverscript-v1', tx: 'lib' }, // lib:spin-3d-center-ease-t-cw + lib:motion-3d-pan-2-right
  { tIn: 127.0, tOut: 130.6, kind: 'container', ref: 'silverscript-60-lines-s1', tx: 'xfade' }, // hand:xfade-scale
  { tIn: 130.6, tOut: 131.2, kind: 'container', ref: 'silverscript-60-lines-s2', tx: 'swap', d: 3 },
  { tIn: 131.2, tOut: 133.08, kind: 'container', ref: 'silverscript-60-lines-s3', tx: 'swap', d: 3 },
  { tIn: 133.08, tOut: 135.14, kind: 'vid', ref: 'BR-9-hammer-dust', tx: 'fade', d: 8 }, // hand:fade 0.25 s
  { tIn: 135.14, tOut: 138.8, kind: 'vid', ref: 'BR-10-red-server-room', tx: 'whip' }, // hand:kt-whip-cut
  { tIn: 138.8, tOut: 141.62, kind: 'vid', ref: 'BR-11-rusty-padlock-opens', tx: 'fade', d: 15 }, // hand:fade
  { tIn: 141.62, tOut: 144.02, kind: 'deck', ref: 'indexer-vs-l1-l1', state: 'l1', tx: 'lib' }, // lib:spin-3d-center-ease-short-b-ccw
  { tIn: 144.02, tOut: 146.88, kind: 'deck', ref: 'indexer-vs-l1-flaw', state: 'flaw', tx: 'swap', d: 8 },
  { tIn: 146.88, tOut: 154.26, kind: 'receipt', ref: 'C28-kccs-readme', tx: 'xfade' }, // hand:xfade-scale + lib:motion-3d-pan-1-left
  { tIn: 154.26, tOut: 158.48, kind: 'receipt', ref: 'C7-kccforum-final-post', tx: 'xfade' }, // hand:xfade-scale
  { tIn: 158.48, tOut: 162.4, kind: 'deck', ref: 'consensus-validates-rules', state: 'rules', tx: 'xfade' }, // hand:xfade-scale
  { tIn: 162.4, tOut: 164.72, kind: 'deck', ref: 'consensus-validates-validators', state: 'validators', tx: 'swap', d: 8 },
  { tIn: 164.72, tOut: 166.28, kind: 'deck', ref: 'consensus-validates-indexer-out', state: 'indexer-out', tx: 'swap', d: 8 },
  { tIn: 166.28, tOut: 175.08, kind: 'receipt', ref: 'C9-kascov-tokens-scroll', tx: 'pushL' }, // hand:kt-push-slide, the recording from 0
  { tIn: 175.08, tOut: 178.64, kind: 'still', ref: 'IMG-4-nacho-coin', tx: 'lib' }, // lib:invert-short-3
  { tIn: 178.64, tOut: 186.32, kind: 'receipt', ref: 'C10-nacho-migration', tx: 'xfade' }, // hand:xfade-scale
  { tIn: 186.32, tOut: 189.9, kind: 'vid', ref: 'BR-12-datacenter-hallway', tx: 'whip' }, // hand:kt-whip-cut
  { tIn: 189.9, tOut: 194.8, kind: 'receipt', ref: 'C29-igra-cryptopotato', tx: 'xfade' }, // hand:xfade-scale
  { tIn: 194.8, tOut: 198.4, kind: 'receipt', ref: 'C20-kaskad-hero', tx: 'xfade' }, // hand:xfade-scale
  { tIn: 198.4, tOut: 199.5, kind: 'receipt', ref: 'C20-kaskad-about', tx: 'swap', d: 6 },
  { tIn: 199.5, tOut: 200.6, kind: 'receipt', ref: 'C20-kaskad-audits', tx: 'swap', d: 6 }, // side-panel size over the dimmed page
  { tIn: 200.6, tOut: 201.88, kind: 'receipt', ref: 'C20-kaskad-staking', tx: 'swap', d: 6 },
  { tIn: 201.88, tOut: 209.34, kind: 'receipt', ref: 'C23-kasplex-docs', tx: 'pushL' }, // hand:kt-push-slide
  { tIn: 209.34, tOut: 212.98, kind: 'deck', ref: 'kasplex-based-rollup-base', state: 'base', tx: 'xfade' }, // hand:xfade-scale
  { tIn: 212.98, tOut: 214.78, kind: 'deck', ref: 'kasplex-based-rollup-gas', state: 'gas', tx: 'swap', d: 8 },
  { tIn: 214.78, tOut: 220.74, kind: 'receipt', ref: 'C24-defillama-kasplex', tx: 'xfade' }, // hand:xfade-scale
  { tIn: 220.74, tOut: 224.02, kind: 'receipt', ref: 'C30-gate-kasplex-cryptonews', tx: 'xfade' }, // hand:xfade-scale + lib:motion-3d-pan-2-up
  { tIn: 224.02, tOut: 233.233, kind: 'receipt', ref: 'C14-explorer-stats', tx: 'pushT' }, // hand:kt-push-slide, stage 2 is a camera key at 229.1
  // CH4 WHAT IS COMING
  { tIn: 237.9, tOut: 240.2, kind: 'vid', ref: 'BR-13-night-road-horizon', tx: 'cut' }, // hand:film-burn
  { tIn: 240.2, tOut: 243.54, kind: 'deck', ref: 'D1-A', state: 'quiet', tx: 'pushL' }, // hand:kt-push-slide
  { tIn: 243.54, tOut: 245.32, kind: 'deck', ref: 'D1-A-lit', state: 'lit', tx: 'swap', d: 8 },
  { tIn: 245.32, tOut: 246.96, kind: 'deck', ref: 'D1-A-norollup', state: 'norollup', tx: 'swap', d: 8 },
  { tIn: 246.96, tOut: 251.92, kind: 'receipt', ref: 'C32-kaspa-build', tx: 'xfade' }, // hand:xfade-scale
  { tIn: 251.92, tOut: 256.88, kind: 'receipt', ref: 'C15-kaspa-lore', tx: 'xfade' }, // hand:xfade-scale
  { tIn: 256.88, tOut: 260.5, kind: 'vid', ref: 'BR-14-data-tunnel-streaks', tx: 'whip' }, // hand:kt-whip-cut
  { tIn: 260.5, tOut: 261.0, kind: 'container', ref: 'bps-ladder-s1', tx: 'xfade' }, // hand:xfade-scale
  { tIn: 261.0, tOut: 263.3, kind: 'container', ref: 'bps-ladder-s2', tx: 'swap', d: 3 },
  { tIn: 263.3, tOut: 267.9, kind: 'container', ref: 'bps-ladder-s3', tx: 'swap', d: 3 },
  { tIn: 267.9, tOut: 271.6, kind: 'vid', ref: 'BR-15-dollar-printing-press', tx: 'whip' }, // hand:kt-whip-cut
  { tIn: 271.6, tOut: 273.6, kind: 'container', ref: 'stablecoin-card-A-s1', tx: 'xfade' }, // hand:xfade-scale
  { tIn: 273.6, tOut: 274.6, kind: 'container', ref: 'stablecoin-card-A-s2', tx: 'swap', d: 5 },
  { tIn: 274.6, tOut: 277.9, kind: 'container', ref: 'stablecoin-card-A-s3', tx: 'swap', d: 5 },
  { tIn: 277.9, tOut: 280.1, kind: 'container', ref: 'stablecoin-card-A-s4', tx: 'swap', d: 5 },
  { tIn: 280.1, tOut: 281.2, kind: 'container', ref: 'stablecoin-card-B-s1', tx: 'xfade' }, // hand:xfade-scale
  { tIn: 281.2, tOut: 284.2, kind: 'container', ref: 'stablecoin-card-B-s2', tx: 'swap', d: 5 },
  { tIn: 284.2, tOut: 287.0, kind: 'container', ref: 'stablecoin-card-B-s3', tx: 'swap', d: 5 },
  { tIn: 287.0, tOut: 288.9, kind: 'container', ref: 'stablecoin-card-B-s4', tx: 'swap', d: 5 },
  { tIn: 288.9, tOut: 292.3, kind: 'container', ref: 'stablecoin-card-C-s1', tx: 'xfade' }, // hand:xfade-scale
  { tIn: 292.3, tOut: 293.14, kind: 'container', ref: 'stablecoin-card-C-s2', tx: 'swap', d: 5 },
  { tIn: 293.14, tOut: 296.9, kind: 'vid', ref: 'BR-16-speaker-on-stage', tx: 'whip' }, // hand:kt-whip-cut
  { tIn: 296.9, tOut: 302.133, kind: 'receipt', ref: 'C33-youtube-midchain-page', tx: 'xfade' }, // hand:xfade-scale
  // CH5 WHERE IT STANDS
  { tIn: 335.933, tOut: 339.88, kind: 'vid', ref: 'BR-17-trader-monitors-dark', tx: 'cut' }, // hand:film-burn; hand:kt-whip-cut re-lands at 337.3
  { tIn: 339.88, tOut: 347.3, kind: 'receipt', ref: 'C13-tradingview-kasusd', tx: 'xfade' }, // hand:xfade-scale
  { tIn: 347.3, tOut: 352.68, kind: 'receipt', ref: 'C34-coingecko-kaspa', tx: 'xfade' }, // hand:xfade-scale
  { tIn: 352.68, tOut: 358.96, kind: 'chart', ref: 'C2-B', tx: 'pushT' }, // hand:kt-push-slide
  { tIn: 358.96, tOut: 364.52, kind: 'chart', ref: 'C2-C', tx: 'xfade' }, // hand:xfade-scale
  { tIn: 364.52, tOut: 372.5, kind: 'chart', ref: 'C2-D', tx: 'xfade' }, // hand:xfade-scale
  { tIn: 372.5, tOut: 375.76, kind: 'receipt', ref: 'C35-2miners-kas-hashrate', tx: 'xfade' }, // hand:xfade-scale
  { tIn: 375.76, tOut: 386.74, kind: 'chart', ref: 'C3', tx: 'pushL' }, // hand:kt-push-slide
  { tIn: 386.74, tOut: 392.14, kind: 'chart', ref: 'C4', tx: 'pushT' }, // hand:kt-push-slide
  { tIn: 392.14, tOut: 400.5, kind: 'chart', ref: 'C17', tx: 'pushL' }, // hand:kt-push-slide
  { tIn: 400.5, tOut: 403.4, kind: 'receipt', ref: 'C12-a-defillama-igra', tx: 'pushT' }, // hand:kt-push-slide
  { tIn: 403.4, tOut: 407.06, kind: 'receipt', ref: 'C12-b-defillama-kasplex', tx: 'xfade' }, // hand:xfade-scale
  { tIn: 407.06, tOut: 409.8, kind: 'vid', ref: 'BR-18-dawn-street', tx: 'fade', d: 15 }, // hand:fade
  { tIn: 409.8, tOut: 436.06, kind: 'receipt', ref: 'C22-tradingview-solusdt-hovers', tx: 'pushT' }, // hand:kt-push-slide, the recording from clip 1.0 s, legend states A / B / C inside it
  { tIn: 436.06, tOut: 440.26, kind: 'receipt', ref: 'C25-coingecko-solana', tx: 'xfade' }, // hand:xfade-scale
  { tIn: 440.26, tOut: 444.34, kind: 'container', ref: 'parallel-not-prediction-A', tx: 'xfade' }, // hand:xfade-scale
  { tIn: 444.34, tOut: 447.9, kind: 'container', ref: 'parallel-not-prediction-B', tx: 'swap', d: 8 },
  // CH6 THE CLOSE
  { tIn: 455.667, tOut: 459.18, kind: 'still', ref: 'IMG-5-summit-flag', tx: 'cut' }, // plays img-motion (section 3c), the wall covers it through the pause
  { tIn: 459.18, tOut: 460.14, kind: 'container', ref: 'where-i-stand-s1', tx: 'xfade' }, // hand:xfade-scale
  { tIn: 460.14, tOut: 461.96, kind: 'container', ref: 'where-i-stand-s2', tx: 'swap', d: 5 },
  { tIn: 461.96, tOut: 464.7, kind: 'container', ref: 'where-i-stand-s3', tx: 'swap', d: 5 },
  { tIn: 464.7, tOut: 468.5, kind: 'vid', ref: 'BR-19-mining-warehouse-rows', tx: 'whip' }, // hand:kt-whip-cut
  { tIn: 468.5, tOut: 476.36, kind: 'container', ref: 'my-theory', tx: 'xfade' }, // hand:xfade-scale, kt-statement hover
  { tIn: 476.36, tOut: 480.2, kind: 'still', ref: 'IMG-6-coin-waterfall', tx: 'pushL' }, // hand:kt-push-slide, silent, plays img-motion
  { tIn: 480.2, tOut: 482.34, kind: 'deck', ref: 'cascade-base', state: 'base', tx: 'lib' }, // lib:melt-rgb-3
  { tIn: 482.34, tOut: 483.78, kind: 'deck', ref: 'cascade-wave1', state: 'wave1', tx: 'swap', d: 8 },
  { tIn: 483.78, tOut: 485.84, kind: 'deck', ref: 'cascade-wave2', state: 'wave2', tx: 'swap', d: 8 },
  { tIn: 485.84, tOut: 487.0, kind: 'deck', ref: 'cascade-wave3', state: 'wave3', tx: 'swap', d: 8 },
  { tIn: 487.0, tOut: 490.967, kind: 'vid', ref: 'BR-20-hand-stacking-coins', tx: 'fade', d: 15 }, // hand:fade
  { tIn: 500.033, tOut: 503.56, kind: 'vid', ref: 'BR-21-audience-hands-raised', tx: 'cut' }, // hand:film-burn
  { tIn: 503.56, tOut: 508.2, kind: 'container', ref: 'community-stack-s1', tx: 'xfade' }, // hand:xfade-scale
  { tIn: 508.2, tOut: 509.1, kind: 'container', ref: 'community-stack-s2', tx: 'swap', d: 5 },
  { tIn: 509.1, tOut: 510.26, kind: 'container', ref: 'community-stack-s3', tx: 'swap', d: 5 },
  { tIn: 510.26, tOut: 511.033, kind: 'container', ref: 'community-stack-s4', tx: 'swap', d: 5 },
];
const coverByRef = (ref: string) => COVERS.find((c) => c.ref === ref) as Cover;

// ---------------------------------------------------------------------------------------------------------------------
// RECEIPTS: a plane at full width, its camera keyed in SOURCE seconds. x in percent of the width, y in percent OF THE WIDTH.
// cam rows: [t, focus x, focus y, scale]; hl rows: [t, x0, y0, x1, y1] wiped left to right (HIGHLIGHT: multiply on a light page).
// ---------------------------------------------------------------------------------------------------------------------
type Rcpt = { h: number; ext?: string; cam: [number, number, number, number][]; hl?: [number, number, number, number, number][]; dark?: boolean; mo?: string };
const RECEIPTS: Record<string, Rcpt> = {
  'C21-kaspa-org-hero': { h: 56.25, cam: [[13.36, 50, 28.1, 1], [15.0, 24, 30, 2.0]], hl: [[14.1, 17.7, 30.4, 21.4, 31.7]] },
  'C27-rusty-kaspa-v1': { h: 86.1, cam: [[59.3, 50, 28.1, 1], [61.0, 50, 23.5, 1.7]], hl: [[61.3, 33.4, 23.2, 45.0, 24.6]] },
  'C19-eth-whitepaper-ghost': { h: 79.8, cam: [[78.72, 32, 38, 1.3], [81.0, 32, 38.5, 1.9]], hl: [[81.9, 40.4, 36.3, 49.3, 37.7], [82.5, 11.7, 37.8, 33.7, 39.2]] },
  'C16-arxiv-founder': { h: 80.9, cam: [[92.26, 50, 28.1, 1], [94.5, 50, 13, 1.42]] },
  'C6-rusty-kaspa-v2-toccata': { h: 63.6, cam: [[107.86, 50, 28.1, 1], [109.5, 58, 22.5, 1.7]], hl: [[108.0, 37.2, 21.9, 80.6, 23.3]] },
  'C8-silverscript-v1': { h: 78.1, cam: [[123.5, 50, 28.1, 1]], mo: 'motion-3d-pan-2-right' },
  'C28-kccs-readme': { h: 45.05, cam: [[146.88, 50, 22.5, 1]], mo: 'motion-3d-pan-1-left' },
  'C7-kccforum-final-post': { h: 46.9, cam: [[154.26, 46, 23.4, 1], [156.5, 46, 10, 1.9]] },
  'C9-kascov-tokens-scroll': { h: 56.25, ext: 'mp4', cam: [[166.28, 42, 23.7, 1.19], [175.08, 42, 23.7, 1.24]] },
  'C10-nacho-migration': { h: 51.05, dark: true, cam: [[178.64, 50, 25, 1], [180.5, 71, 12, 2.0]], hl: [[183.9, 66.6, 9.8, 76.4, 12.8]] },
  'C29-igra-cryptopotato': { h: 56.25, cam: [[189.9, 50, 28.1, 1], [191.5, 48, 24.5, 1.6]], hl: [[192.2, 19.4, 22.3, 41.2, 23.7], [193.6, 64.9, 23.7, 77.3, 25.1], [193.9, 19.4, 25.1, 33.3, 26.4]] },
  'C20-kaskad-hero': { h: 57.3, cam: [[194.8, 50, 28.1, 1], [198.4, 50, 28.1, 1.12]] },
  'C20-kaskad-about': { h: 56.25, cam: [[198.4, 66, 20, 1.5], [199.5, 66, 22, 1.6]], hl: [[198.5, 68.4, 26.0, 78.2, 27.4]] },
  'C20-kaskad-staking': { h: 56.9, cam: [[200.6, 65, 20, 1.6], [201.88, 65, 23, 1.7]], hl: [[200.65, 52.2, 24.8, 78.6, 26.0]] },
  'C23-kasplex-docs': { h: 56.25, cam: [[201.88, 50, 28.1, 1], [204.0, 52, 26, 1.75]], hl: [[204.2, 33.1, 22.0, 41.5, 23.3], [208.0, 44.1, 27.9, 70.1, 29.1], [208.4, 33.1, 29.1, 36.5, 30.3]] },
  'C24-defillama-kasplex': { h: 55.2, dark: true, cam: [[214.78, 50, 27, 1.02], [215.8, 46, 45, 1.55]], hl: [[214.8, 13.5, 46.2, 78, 48.9], [215.4, 13.5, 40.8, 78, 43.2], [216.4, 13.5, 43.6, 78, 46.0]] },
  'C30-gate-kasplex-cryptonews': { h: 78.1, cam: [[220.74, 50, 28.1, 1]], mo: 'motion-3d-pan-2-up' },
  'C14-explorer-stats': { h: 56.25, cam: [[224.02, 50, 28.1, 1], [226.0, 50, 12, 1.35], [229.1, 50, 12, 1.35], [230.6, 41, 14, 2.1]] },
  'C32-kaspa-build': { h: 56.25, cam: [[246.96, 50, 28.1, 1], [248.8, 54, 25, 1.7]], hl: [[249.4, 39.4, 26.1, 60.6, 27.3], [250.1, 42.3, 27.4, 59.6, 28.6]] },
  'C15-kaspa-lore': { h: 56.25, cam: [[251.92, 50, 28.1, 1], [253.6, 50, 16.5, 1.8]], hl: [[253.9, 33, 15.6, 60.3, 16.8]] },
  'C33-youtube-midchain-page': { h: 56.25, cam: [[296.9, 35, 28, 1.45], [299.0, 35, 42, 1.8]] },
  'C13-tradingview-kasusd': { h: 52.1, cam: [[339.88, 50, 26, 1.08], [347.3, 50, 26, 1.2]] },
  'C34-coingecko-kaspa': { h: 56.25, cam: [[347.3, 50, 28.1, 1], [349.0, 60, 23, 2.2]] },
  'C35-2miners-kas-hashrate': { h: 67.7, cam: [[372.5, 50, 28.1, 1], [374.0, 62, 8, 2.4]] },
  'C12-a-defillama-igra': { h: 56.25, cam: [[400.5, 50, 28.1, 1], [403.4, 50, 28.1, 1.06]] },
  'C12-b-defillama-kasplex': { h: 56.25, cam: [[403.4, 50, 28.1, 1], [407.06, 50, 28.1, 1.06]] },
  'C22-tradingview-solusdt-hovers': { h: 56.25, ext: 'mp4', cam: [[409.8, 50, 28.1, 1], [411.6, 31, 17.5, 1.6]] }, // framed on the legend, the crosshair tag stays out
  'C25-coingecko-solana': { h: 57.3, cam: [[436.06, 50, 28.1, 1], [437.8, 20, 23.8, 2.4]] },
};
// clip start inside the recording (C22 skips the toolbar in frame 0, VISUAL-QA)
const REC_FROM: Record<string, number> = { 'C22-tradingview-solusdt-hovers': 30, 'C9-kascov-tokens-scroll': 0 };

const camAt = (r: Rcpt, t: number) => {
  const k = r.cam;
  let p = k[k.length - 1];
  if (t <= k[0][0]) p = k[0];
  else
    for (let i = 1; i < k.length; i++) {
      if (t < k[i][0]) {
        const e = Easing.bezier(0.2, 0, 0.1, 1)(interpolate(t, [k[i - 1][0], k[i][0]], [0, 1], CLAMP));
        p = [t, k[i - 1][1] + (k[i][1] - k[i - 1][1]) * e, k[i - 1][2] + (k[i][2] - k[i - 1][2]) * e, k[i - 1][3] + (k[i][3] - k[i - 1][3]) * e];
        break;
      }
    }
  const planeH = (r.h / 100) * 1920;
  const s = Math.max(p[3], 1, 1080 / planeH);
  const fx = (p[1] / 100) * 1920;
  const fy = (p[2] / 100) * 1920;
  const x = Math.min(0, Math.max(1920 - 1920 * s, 960 - fx * s));
  const y = Math.min(0, Math.max(1080 - planeH * s, 540 - fy * s));
  return { x, y, s };
};

const ReceiptPlane: React.FC<{ id: string; r: Rcpt; t: number; frozenFrame?: number }> = ({ id, r, t, frozenFrame }) => {
  const c = camAt(r, t);
  const local = useCurrentFrame();
  const abs = useAbs();
  const planeH = (r.h / 100) * 1920;
  let media: React.ReactNode;
  if (r.ext === 'mp4') {
    const cv = coverByRef(id);
    const base = REC_FROM[id] ?? 0;
    if (frozenFrame !== undefined) {
      media = (
        <Sequence from={0} layout="none">
          <Freeze frame={frozenFrame}>
            <OffthreadVideo src={staticFile(`receipts/${id}.mp4`)} muted style={{ width: 1920, height: 1080 }} />
          </Freeze>
        </Sequence>
      );
    } else {
      media = <OffthreadVideo src={staticFile(`receipts/${id}.mp4`)} muted startFrom={Math.max(0, base + (abs - F(cv.tIn)) - local)} style={{ width: 1920, height: 1080 }} />;
    }
  } else {
    media = <Img src={staticFile(`receipts/${id}.png`)} style={{ width: 1920, height: planeH, display: 'block' }} />;
  }
  return (
    <div style={{ ...box, background: r.dark ? '#05070c' : '#FFFFFF', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: planeH, transformOrigin: '0 0', transform: `translate(${c.x}px, ${c.y}px) scale(${c.s})` }}>
        {media}
        {(r.hl ?? []).map(([ht, x0, y0, x1, y1], i) => {
          const u = interpolate(t, [ht, ht + 0.35], [0, 1], { ...CLAMP, easing: Easing.out(Easing.quad) });
          if (u <= 0) return null;
          const W = 19.2;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x0 * W,
                top: y0 * W,
                width: (x1 - x0) * W * u,
                height: (y1 - y0) * W,
                background: r.dark ? 'rgba(255,225,77,0.22)' : '#ffe14d',
                mixBlendMode: r.dark ? 'normal' : 'multiply',
                outline: r.dark ? '3px solid #ffe14d' : undefined,
                borderRadius: r.dark ? 6 : 2,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

// MOTION on a receipt: the library 3D pan wraps the cover for its whole slot, clock set with <Freeze> (comp-build.md section 6)
const MotionWrap: React.FC<{ id: string; t0: number; t1: number; t: number; children: React.ReactNode }> = ({ id, t0, t1, t, children }) => {
  const row = getTransitionRow(id);
  const Engine = ENGINES[row.engine] as React.FC<any>;
  const u = interpolate(t, [t0, t1], [0, 1], CLAMP);
  const n = Math.min(149, Math.round(u * 4.9 * FPS));
  return (
    <Sequence from={0} layout="none">
      <Freeze frame={n}>
        <Engine from={children} to={children} outClip={() => children} inClip={() => children} durationInFrames={150} params={row.params} />
      </Freeze>
    </Sequence>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// COVER bodies: pure functions of the absolute clock
// ---------------------------------------------------------------------------------------------------------------------
const DIR_OF = (k: Cover['kind']) => (k === 'container' ? 'card-slides' : 'diagrams');
// family spans: every state of one container shares ONE gentle push so a swap reads as a transform (section 7a: never dead still)
const familyOf = (ref: string) => {
  const m = ref.match(/^(C1|C5|D1|cascade|indexer-vs-l1|consensus-validates|kasplex-based-rollup|research-stack|silverscript-60-lines|bps-ladder|stablecoin-card-[ABC]|parallel-not-prediction|where-i-stand|community-stack|my-theory)/);
  return m ? m[1] : ref;
};
const familySpan = (ref: string) => {
  const rows = COVERS.filter((c) => familyOf(c.ref) === familyOf(ref));
  return [rows[0].tIn, rows[rows.length - 1].tOut];
};
const MOTION_IMG: Record<string, boolean> = { 'IMG-5-summit-flag': true, 'IMG-6-coin-waterfall': true };
const BZ_START = 65.4; // [BRAAM] the sombrero coin eases toward its point over the beat pause

const CoverBody: React.FC<{ c: Cover; frozen?: boolean; frozenAt?: 'first' | 'last' }> = ({ c, frozen, frozenAt = 'last' }) => {
  const abs = useAbs();
  const local = useCurrentFrame();
  const t = srcOf(abs);
  if (c.kind === 'vid') {
    const src = staticFile(`vid/${c.ref}.mp4`);
    const rate = rateOf(c.ref);
    if (frozen) {
      const n = frozenAt === 'first' ? 1 : Math.round((F(c.tOut) - F(c.tIn) - 1) * rate);
      return (
        <Sequence from={0} layout="none">
          <Freeze frame={n}>
            <OffthreadVideo src={src} muted style={fill} />
          </Freeze>
        </Sequence>
      );
    }
    return <OffthreadVideo src={src} muted playbackRate={rate} style={fill} />;
  }
  if (c.kind === 'still') {
    if (MOTION_IMG[c.ref]) {
      // section 3c: plays the motion clip from clip 0 (the slot's visible start), cut at the slot end, no extra push. 4.04 s covers the
      // slot at the clip's own speed; the still is the fallback and the first frame under the wall.
      const start = c.ref === 'IMG-5-summit-flag' ? F(455.705) : F(c.tIn);
      const src = staticFile(`img-motion/${c.ref}-motion.mp4`);
      if (frozen) {
        const n = frozenAt === 'first' ? 1 : Math.max(1, Math.round((F(c.tOut) - start - 1)));
        return (
          <Sequence from={0} layout="none">
            <Freeze frame={n}>
              <OffthreadVideo src={src} muted style={fill} />
            </Freeze>
          </Sequence>
        );
      }
      if (abs < start) return <Img src={staticFile(`img/${c.ref}.png`)} style={fill} />;
      return <OffthreadVideo src={src} muted startFrom={Math.max(0, abs - local - start)} style={fill} />;
    }
    const u = interpolate(abs, [F(c.tIn), F(c.tOut)], [0, 1], CLAMP);
    const isBz = c.ref === 'IMG-3-sombrero-coin';
    const bz = isBz ? Easing.inOut(Easing.sin)(interpolate(abs, [F(BZ_START) - 30, F(BZ_START)], [0, 1], CLAMP)) : 0;
    const s = (1.0 + 0.05 * u) * (1 + 0.22 * bz);
    return (
      <div style={{ ...box, overflow: 'hidden', background: '#000' }}>
        <Img src={staticFile(`img/${c.ref}.png`)} style={{ ...fill, transform: `scale(${s})`, transformOrigin: isBz ? '50% 42%' : '50% 50%' }} />
      </div>
    );
  }
  if (c.kind === 'receipt') {
    if (c.ref === 'C20-kaskad-audits') {
      // the file is 770x367: side-panel size over the dimmed page, never full frame
      const about = RECEIPTS['C20-kaskad-about'];
      return (
        <div style={box}>
          <ReceiptPlane id="C20-kaskad-about" r={about} t={199.5} />
          <div style={{ ...box, background: 'rgba(20,22,26,.55)' }} />
          <Img src={staticFile('receipts/C20-kaskad-audits.png')} style={{ position: 'absolute', left: 575, top: 357, width: 770, height: 367, boxShadow: '0 22px 60px rgba(0,0,0,.45)', borderRadius: 12 }} />
        </div>
      );
    }
    const r = RECEIPTS[c.ref];
    const frozenFrame = r.ext === 'mp4' && frozen ? (REC_FROM[c.ref] ?? 0) + (frozenAt === 'first' ? 0 : F(c.tOut) - F(c.tIn) - 1) : undefined;
    const plane = <ReceiptPlane id={c.ref} r={r} t={t} frozenFrame={frozenFrame} />;
    return r.mo ? (
      <MotionWrap id={r.mo} t0={c.tIn} t1={c.tOut} t={t}>
        {plane}
      </MotionWrap>
    ) : (
      plane
    );
  }
  if (c.kind === 'chart') {
    if (c.ref === 'C2-A') return <C2A t={t} />;
    if (c.ref === 'C2-B') return <C2B t={t} />;
    if (c.ref === 'C2-C') return <C2C t={t} />;
    if (c.ref === 'C2-D') return <C2D t={t} />;
    if (c.ref === 'C3') return <C3 t={t} />;
    if (c.ref === 'C4') return <C4 t={t} />;
    if (c.ref === 'C17') return <C17 t={t} />;
    return null;
  }
  // deck / container: the state PNG, one spotlight at a time, on the family's gentle push (statement hover on my-theory)
  const [a, b] = familySpan(c.ref);
  const u = interpolate(t, [a, b], [0, 1], CLAMP);
  const s = 1 + 0.03 * u;
  const isStatement = c.ref === 'my-theory';
  const hx = isStatement ? 8 * Math.sin(t * 1.3) : 0;
  const hy = isStatement ? 5 * Math.cos(t * 1.1) : 0;
  const rot = isStatement ? 0.25 * Math.sin((2 * Math.PI * t) / 3.2) : 0;
  return (
    <div style={{ ...box, overflow: 'hidden', background: '#F6F4EE' }}>
      <Img src={staticFile(`${DIR_OF(c.kind)}/${c.ref}.png`)} style={{ ...fill, transform: `translate(${hx}px, ${hy}px) rotate(${rot}deg) scale(${isStatement ? s + 0.015 : s})`, transformOrigin: '50% 50%' }} />
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// the cover track: ingress wrappers + the outgoing row's tail under a dissolve
// ---------------------------------------------------------------------------------------------------------------------
const ingressFrames = (c?: Cover) => {
  if (!c) return 0;
  if (c.tx === 'xfade') return 11; // hand:xfade-scale 0.35 s
  if (c.tx === 'swap' || c.tx === 'fade') return c.d ?? 8;
  if (c.tx === 'pushL' || c.tx === 'pushT') return 3; // hand:kt-push-slide 0.100 s
  return 0;
};
const pushEase = Easing.bezier(0.33, 0.6, 0, 1);

const Ingress: React.FC<{ c: Cover; children: React.ReactNode; prev?: Cover }> = ({ c, children, prev }) => {
  const f = useCurrentFrame();
  const n = ingressFrames(c);
  if (c.tx === 'xfade' && f < n) {
    const u = f / n;
    return <div style={{ ...box, opacity: u, transform: `scale(${0.93 + 0.07 * u})` }}>{children}</div>;
  }
  if ((c.tx === 'swap' || c.tx === 'fade') && f < n) return <div style={{ ...box, opacity: f / n }}>{children}</div>;
  if ((c.tx === 'pushL' || c.tx === 'pushT') && f < n) {
    const u = pushEase(f / n);
    const off = c.tx === 'pushL' ? { x: -0.85 * 1920 * (1 - u), y: 0 } : { x: 0, y: -0.68 * 1080 * (1 - u) };
    return (
      <DirBlur sx={c.tx === 'pushL' ? 60 * (1 - u) : 0} sy={c.tx === 'pushT' ? 40 * (1 - u) : 0}>
        <div style={{ ...box, transform: `translate(${off.x}px, ${off.y}px)` }}>{children}</div>
      </DirBlur>
    );
  }
  if (c.tx === 'pushoutR') {
    // the stack and its footage push out RIGHT over the incoming receipt (kt-push-slide out, 3 frames)
    return (
      <>
        {children}
        {f < 3 && prev && (
          <div style={{ ...box, transform: `translateX(${0.96 * 1920 * pushEase(f / 3)}px)` }}>
            <CoverBody c={prev} frozen />
            <KtClock.Provider value={{ t: T(prev.tOut) - 1 / FPS }}>
              <FairLaunchStack t={T(prev.tOut) - 1 / FPS} />
            </KtClock.Provider>
          </div>
        )}
      </>
    );
  }
  return <>{children}</>;
};

// whip-zoom windows on a video row (hand:kt-whip-cut), BR-17 re-lands on its own clip
const WHIP_ALSO: Record<string, number> = { 'BR-17-trader-monitors-dark': 337.3 };
// section 6a cost trap: BR-4's whip hung the page twice (frames 801, 803). Inside the 0.37 s whip a video row feeds the engine its CUTFRAME
// still (assets/cutframes/, the clip's frame where the whip lands), the blur and lens hide the hold; the live clip resumes on that frame.
const WhipRow: React.FC<{ c: Cover; t0: number; children: React.ReactNode }> = ({ c, t0, children }) => {
  const dt = useAbs() / FPS - t0;
  const useStill = c.kind === 'vid' && dt >= -0.001 && dt < 0.37;
  return <KtWhipCut t0={t0}>{useStill ? <Img src={staticFile(`cutframes/${c.ref}.jpg`)} style={fill} /> : children}</KtWhipCut>;
};
const CoverTrack: React.FC = () => (
  <>
    {COVERS.map((c, i) => {
      const from = F(c.tIn);
      const next = COVERS[i + 1];
      const contiguous = next && Math.abs(next.tIn - c.tOut) < 0.01;
      const tail = contiguous ? ingressFrames(next) : 0;
      const whipT = c.tx === 'whip' ? T(c.tIn) : WHIP_ALSO[c.ref] !== undefined ? T(WHIP_ALSO[c.ref]) : null;
      const body = <CoverBody c={c} />;
      return (
        <Sequence key={c.ref + i} from={from} durationInFrames={F(c.tOut) - from + tail} name={c.ref}>
          <AbsoluteFill>
            <Ingress c={c} prev={COVERS[i - 1]}>
              {whipT !== null ? <WhipRow c={c} t0={whipT}>{body}</WhipRow> : body}
            </Ingress>
          </AbsoluteFill>
        </Sequence>
      );
    })}
  </>
);

// ---------------------------------------------------------------------------------------------------------------------
// the spine and its stills (section 6a: real Freeze, muted, the same transform, the same source)
// ---------------------------------------------------------------------------------------------------------------------
const reframeStyle: React.CSSProperties = {
  position: 'absolute',
  left: 0,
  top: 0,
  width: 1920,
  height: 1080,
  transformOrigin: '0 0',
  transform: `translate(${FACE_REFRAME.x}px, ${FACE_REFRAME.y}px) scale(${FACE_REFRAME.scale})`,
};
const PunchBox: React.FC<{ punch: number; x?: number; y?: number; extra?: number; children: React.ReactNode }> = ({ punch, x = 0, y = 0, extra = 1, children }) => (
  <div style={{ ...box, overflow: 'hidden', background: '#000' }}>
    <div style={{ ...box, transformOrigin: `${FACE_POINT.x}px ${FACE_POINT.y}px`, transform: `translate(${x}px, ${y}px) scale(${punch * extra})` }}>{children}</div>
  </div>
);

// the one audible copy: the VO lives here
const SpineLive: React.FC<{ x: number; y: number; extra: number; punch: number }> = ({ x, y, extra, punch }) => (
  <PunchBox punch={punch} x={x} y={y} extra={extra}>
    <OffthreadVideo src={staticFile('spine.mp4')} style={reframeStyle} />
  </PunchBox>
);

/** a faithful freeze of the airing spine frame (muted), inside the zero-offset Sequence the Freeze clamp needs */
const SpineStill: React.FC<{ frame: number; punch?: number }> = ({ frame, punch = 1 }) => {
  const abs = useAbs();
  const pose = spinePose(srcOf(abs), abs / FPS);
  return (
    <PunchBox punch={punch} x={pose.x} y={pose.y} extra={pose.extra}>
      <Sequence from={0} layout="none">
        <Freeze frame={frame}>
          <OffthreadVideo src={staticFile('spine.mp4')} muted style={reframeStyle} />
        </Freeze>
      </Sequence>
    </PunchBox>
  );
};
/** the swap clip's frame: the same source as the live layer, no FACE_REFRAME (pre-framed) */
const SwapStill: React.FC<{ id: string; frame: number }> = ({ id, frame }) => (
  <div style={{ ...box, background: '#000' }}>
    <Sequence from={0} layout="none">
      <Freeze frame={frame}>
        <OffthreadVideo src={staticFile(`face-swap/${id}-higgsfield-bg-swap.mp4`)} muted style={fill} />
      </Freeze>
    </Sequence>
  </div>
);
/** the live spine, muted, in sync in ANY nesting (the punch-leak's two sides) */
const SpineMuted: React.FC<{ punch: number }> = ({ punch }) => {
  const abs = useAbs();
  const local = useCurrentFrame();
  return (
    <PunchBox punch={punch}>
      <OffthreadVideo src={staticFile('spine.mp4')} muted startFrom={Math.max(0, abs - local)} style={reframeStyle} />
    </PunchBox>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// LIBRARY transitions: exact window, the engine's swap ON the cut frame, no SFX (post-mix)
// ---------------------------------------------------------------------------------------------------------------------
type LibCut = { id: string; cutFrame: number; a: () => React.ReactNode; b: () => React.ReactNode };
const fromRef = (ref: string, at: 'first' | 'last') => () => <CoverBody c={coverByRef(ref)} frozen frozenAt={at} />;
const liveRef = (ref: string) => () => <CoverBody c={coverByRef(ref)} frozen frozenAt="first" />;

const CLIP_END = F(302.165); // first frame after the paused window: the resume on F6
const optics = (id: string, cut: number, a: string, b: React.ReactNode): LibCut => ({ id, cutFrame: F(cut), a: fromRef(a, 'last'), b: () => b });

const LIB_CUTS: LibCut[] = [
  { id: 'invert-short-2', cutFrame: F(17.12), a: fromRef('C21-kaspa-org-hero', 'last'), b: liveRef('IMG-1-pickaxe-coin') }, // lib:invert-short-2
  optics('zoom-optics-in', 19.433, 'IMG-1-pickaxe-coin', <SwapStill id="F2" frame={13} />), // lib:zoom-optics-in, F2 swap source
  optics('zoom-optics-in-impact', 31.433, 'BR-5-programmer-night-office', <SwapStill id="F3" frame={13} />), // lib:zoom-optics-in-impact, F3 swap source
  { id: 'melt-rgb-short-3', cutFrame: F(46.98), a: fromRef('C1-A', 'last'), b: liveRef('C1-B') }, // lib:melt-rgb-short-3
  { id: 'invert-max-1', cutFrame: F(63.6), a: fromRef('C27-rusty-kaspa-v1', 'last'), b: liveRef('IMG-3-sombrero-coin') }, // lib:invert-max-1
  optics('zoom-optics-in-out-1', 97.3, 'C16-arxiv-founder', <SpineStill frame={F(97.3) + 1} />), // lib:zoom-optics-in-out-1
  { id: 'spin-3d-center-ease-t-cw', cutFrame: F(123.5), a: fromRef('C5-jul2', 'last'), b: liveRef('C8-silverscript-v1') }, // lib:spin-3d-center-ease-t-cw
  { id: 'spin-3d-center-ease-short-b-ccw', cutFrame: F(141.62), a: fromRef('BR-11-rusty-padlock-opens', 'last'), b: liveRef('indexer-vs-l1-l1') }, // lib:spin-3d-center-ease-short-b-ccw
  { id: 'invert-short-3', cutFrame: F(175.08), a: fromRef('C9-kascov-tokens-scroll', 'last'), b: liveRef('IMG-4-nacho-coin') }, // lib:invert-short-3
  optics('zoom-optics-out', 233.233, 'C14-explorer-stats', <SpineStill frame={F(233.233) + 1} />), // lib:zoom-optics-out
  // lib:zoom-optics-in-out-3: the F6 cut-in behind the CLIP-1 insert-out (the resume's first frame is after the paused window)
  { id: 'zoom-optics-in-out-3', cutFrame: CLIP_END, a: () => <ClipFrozen last />, b: () => <ResumeUnderFade /> },
  optics('zoom-optics-in-out-2', 447.9, 'parallel-not-prediction-B', <SpineStill frame={F(447.9) + 1} />), // lib:zoom-optics-in-out-2
  { id: 'melt-rgb-3', cutFrame: F(480.2), a: fromRef('IMG-6-coin-waterfall', 'last'), b: liveRef('cascade-base') }, // lib:melt-rgb-3
  optics('zoom-optics-in', 490.967, 'BR-20-hand-stacking-coins', <SpineStill frame={F(490.967) + 1} />), // lib:zoom-optics-in (F8)
  optics('zoom-optics-in-impact', 511.033, 'community-stack-s4', <SpineStill frame={F(511.033) + 1} />), // lib:zoom-optics-in-impact (F9)
];
// [LIGHTLEAK] each library leak peaks ON its join, the punch steps on the same frame, the spine is both sides, under the captions
const LEAKS: { id: string; at: number; before: number; after: number }[] = [
  { id: 'lightleaks-soft-3', at: 311.567, before: 1, after: PUNCH_SCALE }, // lib:lightleaks-soft-3 F6 in
  { id: 'lightleaks-soft-short-8', at: 455.1, before: 1, after: PUNCH_SCALE }, // lib:lightleaks-soft-short-8 F7 in
  { id: 'lightleaks-6', at: 495.467, before: 1, after: PUNCH_SCALE }, // lib:lightleaks-6 F8 in
  { id: 'lightleaks-soft-short-8', at: 499.367, before: PUNCH_SCALE, after: 1 }, // lib:lightleaks-soft-short-8 F8 back
  { id: 'lightleaks-soft-7', at: 527.467, before: 1, after: PUNCH_SCALE }, // lib:lightleaks-soft-7 F9 in
];

const swapOf = (row: { params: Record<string, unknown> }) => Number(row.params.cut ?? row.params.swapAt ?? 0.5);
const LibWindow: React.FC<{ id: string; cutFrame: number; a: () => React.ReactNode; b: () => React.ReactNode }> = ({ id, cutFrame, a, b }) => {
  const row = getTransitionRow(id);
  const win = framesForRow(row, FPS);
  const swap = Math.round(win * swapOf(row));
  return (
    <Sequence from={cutFrame - swap} durationInFrames={win} name={`lib:${id}`}>
      <TransitionClip id={id} cutFrame={Math.round(win / 2)} outgoing={a} incoming={b} sfx={false} />
    </Sequence>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// CLIP-1 (section 3d): full-frame, MUTED (its voice is in the VO), lead-in + lead-out stills, hand:fade 0.5 s each side
// ---------------------------------------------------------------------------------------------------------------------
const CLIP_SRC = 'clip-inserts/CLIP-1-sompolinsky-if-this-then-that.mp4';
const CLIP_START = CLIP_END - 324;
const ClipFrozen: React.FC<{ last?: boolean }> = ({ last }) => (
  <Sequence from={0} layout="none">
    <Freeze frame={last ? 322 : 0}>
      <OffthreadVideo src={staticFile(CLIP_SRC)} muted style={fill} />
    </Freeze>
  </Sequence>
);
const ClipInsert: React.FC = () => {
  const leadFrom = F(301.18);
  return (
    <>
      {/* [STILL] LEAD-IN + hand:fade insert-in: the clip's first frame over C33 under 'research goes next.' */}
      <Sequence from={leadFrom} durationInFrames={CLIP_START - leadFrom} name="CLIP-1 lead-in">
        <LeadIn dur={15}>
          <ClipFrozen />
        </LeadIn>
      </Sequence>
      {/* [INSERT] the paused window */}
      <Sequence from={CLIP_START} durationInFrames={324} name="CLIP-1">
        <OffthreadVideo src={staticFile(CLIP_SRC)} muted style={fill} />
      </Sequence>
    </>
  );
};
const LeadIn: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: interpolate(f, [0, dur], [0, 1], CLAMP) }}>{children}</AbsoluteFill>;
};
/* [STILL] LEAD-OUT + hand:fade insert-out: the clip's last frame fading off the resume, inside the optics window's B side */
const ResumeUnderFade: React.FC = () => {
  const abs = useAbs();
  return (
    <AbsoluteFill>
      <SpineStill frame={CLIP_END + 1} />
      <AbsoluteFill style={{ opacity: interpolate(abs, [CLIP_END, CLIP_END + 15], [1, 0], CLAMP) }}>
        <ClipFrozen last />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// KINETIC TEXT, comp clock = absolute comp seconds, device times are T(source second)
// ---------------------------------------------------------------------------------------------------------------------
const KT = { font: KT_FONT, accent: ACCENT };

const FairLaunchStack: React.FC<{ t: number }> = ({ t }) => (
  <KtStack
    t={t}
    t0={T(6.62)}
    t1={T(13.36)}
    head="FAIR LAUNCH"
    items={[
      { t: T(9.74), text: 'NO PREMINE' },
      { t: T(10.86), text: 'NO PRE-SALE' },
      { t: T(11.94), text: 'NO INSIDER ALLOCATION' },
    ]}
  />
);

const SPARKS: Record<string, { anchor: string; times: number[] }> = {
  'YOU EARNED IT FROM A MACHINE': { anchor: 'EARNED', times: [22.54, 22.94] },
  "THAT'S NEARLY 8 YEARS OF PUBLISHED RESEARCH": { anchor: 'RESEARCH', times: [99.94] },
  'YET IT ALL SHIPS': { anchor: 'SHIPS', times: [236.96, 237.36] },
  "AND THAT'S EXACTLY THE GAP WHERE I WANT TO BE STANDING": { anchor: 'GAP', times: [453.92] },
  'THIS NETWORK IS WAITING FOR IT': { anchor: 'WAITING', times: [499.28, 499.68] },
};
// kt-caption-highlight IS the caption (EDIT-PLAN header + PROJECT-LOG, house caption track OFF for these spans, never a second caption)
const windowEnd = (t: number) => FACE_WINDOWS.find(([a, b]) => t >= a - 0.25 && t < b)?.[1] ?? t;
const CAP_LIMIT: Record<string, number> = {
  'CLICK THE LINK': 334.9, // replaced by the band
  'MAKE SURE YOU CLICK THAT LIKE BUTTON': 525.0, // the subscribe bar replaces the caption
  'BULLISH ON / KASPA': 37.84, // the title holds across BR-6 to the chapter whip
};
const PHRASES: KtPhrase[] = KT_PHRASES.map((p, i) => {
  const next = KT_PHRASES[i + 1]?.t ?? 999;
  const sp = SPARKS[p.h];
  const t1 = CAP_LIMIT[p.h] ?? Math.min(next, windowEnd(p.t));
  return { ...p, t: T(p.t), t1: T(t1), anchor: sp?.anchor, sparks: sp?.times.map(T) };
});
const POPS = PHRASES.filter((p) => p.kind === 'pop');
const LINES = PHRASES.filter((p) => p.kind !== 'pop');

const PANEL_C26 = { t0: 324.6, t1: 328.9 };
const C26Card: React.FC<{ t: number }> = ({ t }) => {
  // the receipt carried inside the paper panel: the 2026 table, PERPSPAD 114x highlighted (real pixels)
  const t0 = T(PANEL_C26.t0);
  const left = interpolate(t - t0, [0, 0.233], [1988, 947], CLAMP);
  const u = interpolate(t - t0, [0.4, 4.3], [0, 1], CLAMP);
  const W = 1467 * (1 + 0.03 * u); // x 20 to 80 percent of the page fills the card
  const k = W / 100;
  return (
    <div style={{ position: 'absolute', left: left + 44, top: 180, width: 885, height: 720, overflow: 'hidden', borderRadius: 14, boxShadow: '0 18px 44px rgba(0,0,0,.42)', background: '#0d0d1f' }}>
      <div style={{ position: 'absolute', left: -20.3 * k, top: -6.2 * k, width: W, height: W * 0.677 }}>
        <Img src={staticFile('receipts/C26-cryptorich-showcase.png')} style={{ width: '100%', height: '100%' }} />
        <div style={{ position: 'absolute', left: 20.4 * k, top: 22.1 * k, width: 59.2 * k, height: 2.3 * k, background: 'rgba(255,225,77,.28)', outline: '3px solid #ffe14d', borderRadius: 3 }} />
      </div>
    </div>
  );
};

const KtLayer: React.FC<{ t: number }> = ({ t }) => {
  const panelUp = t >= T(PANEL_C26.t0) && t < T(PANEL_C26.t1);
  const band1Out = interpolate(t, [T(140.5), T(141.4)], [0, 400], { ...CLAMP, easing: Easing.in(Easing.quad) });
  const band2Out = interpolate(t, [T(336.4), T(337.3)], [0, 400], { ...CLAMP, easing: Easing.in(Easing.quad) });
  const texture = staticFile('effects-kt/animated-texture.mp4');
  return (
    <>
      {/* CH1 */}
      <KtHeadlineOverBroll {...KT} t0={T(4.167)} t1={T(6.0)} lines={['NOTHING TO DO', 'WITH THE PRICE']} /> {/* [KT-HEADLINE] */}
      {t < T(13.36) && <FairLaunchStack t={t} />} {/* [KT-STACK] */}
      <KtIconPop t0={T(15.6)} t1={T(17.12)} preset="rocket-left" w={220} h={220} x={1280} y={640} travel={1500} icon={<IconPickaxe />} /> {/* [KT-ICON] PICKAXE */}
      <KtHeadlineOverBroll {...KT} t0={T(27.433)} t1={T(31.433)} lines={['5 YEARS OF BUILDING']} /> {/* [KT-HEADLINE] */}
      <StickerKaspa t={t} t0={T(31.433)} t1={T(35.7)} /> {/* [KT-ICON] image_sticker */}
      {/* CH2 */}
      <LightPop t={t} t0={T(46.26)} t1={T(47.3)} lines={['THROWN AWAY']} x={930} y={770} size={92} /> {/* [KT-POP] */}
      <LightPop t={t} t0={T(47.9)} t1={T(49.9)} lines={['EVERY BLOCK COUNTS']} y={980} size={62} /> {/* [KT-POP] */}
      <KtChip t={t} t0={T(57.78)} t1={T(59.3)} text="10 BLOCKS / SECOND" /> {/* [KT-POP] chip */}
      <LightPop t={t} t0={T(79.94)} t1={T(81.74)} lines={['2013']} y={850} size={150} /> {/* [KT-POP] */}
      {/* CH3 */}
      <LightPop t={t} t0={T(110.4)} t1={T(111.7)} lines={['LAYER 1 IS PROGRAMMABLE']} size={88} /> {/* [KT-POP] */}
      <KtChip t={t} t0={T(119.4)} t1={T(123.5)} text="JULY 2" /> {/* [KT-POP] chip */}
      <div style={{ ...box, transform: `translateY(${band1Out}px)` }}>
        <KtLowerThirdBand {...KT} t0={T(136.38)} t1={T(141.4)} textureSrc={texture} lines={['AN OUTSIDE INDEXER WAS EXPLOITED.', "*KASPA'S LAYER 1 WAS NOT.*"]} /> {/* [KT-BAND] */}
      </div>
      <KtIconPop t0={T(157.1)} t1={T(158.48)} preset="gauge-right" w={220} h={220} x={1560} y={300} icon={<IconShieldCheck />} /> {/* [KT-ICON] SHIELD-CHECK */}
      <KtKeywordPop {...KT} t0={T(157.5)} t1={T(158.48)} variant="punch-red" accent="#E70001" lines={['FINAL']} /> {/* [KT-POP] punch */}
      {t >= T(187.48) && t < T(189.9) && <KtStack t={t} t0={T(187.48)} t1={T(189.9)} head="THE L2 STACK" items={[{ t: T(188.06), text: 'IGRA · MAR 19 2026' }]} />} {/* [KT-STACK] */}
      <LightPop t={t} t0={T(227.1)} t1={T(228.9)} lines={['2.4 BILLION TRANSACTIONS']} size={84} /> {/* [KT-POP] */}
      {/* CH4 */}
      <LightPop t={t} t0={T(247.66)} t1={T(249.46)} lines={['UNDER CONSTRUCTION']} size={96} /> {/* [KT-POP] */}
      <KtHeadlineOverBroll {...KT} t0={T(293.94)} t1={T(296.9)} lines={['THE FOUNDER, ON STAGE']} /> {/* [KT-HEADLINE] */}
      <KtSidePanel {...KT} t0={T(PANEL_C26.t0)} t1={T(PANEL_C26.t1)} side="R" texture="paper" paperSrc={staticFile('effects-kt/paper-crumpled.mp4')} lines={[]} /> {/* [KT-PANEL] C26 */}
      {panelUp && <C26Card t={t} />}
      <div style={{ ...box, transform: `translateY(${band2Out}px)` }}>
        <KtLowerThirdBand {...KT} t0={T(334.9)} t1={T(337.3)} textureSrc={texture} lines={['*LINK* IN THE DESCRIPTION']} /> {/* [KT-BAND] */}
      </div>
      {/* CH5 */}
      <KtSidePanel {...KT} t0={T(448.0)} t1={T(450.1)} side="R" texture="dark" textureSrc={texture} fontSize={92} linePitch={104} lines={['THE *TOOLS*', 'CAME FIRST']} /> {/* [KT-PANEL] screen RIGHT, Mike's left hand side (draft note 2026-11-05) */}
      <KtSidePanel {...KT} t0={T(449.86)} t1={T(452.4)} side="L" texture="dark" textureSrc={texture} fontSize={84} linePitch={98} lines={['THE CROWD', 'HAS NOT', 'ARRIVED *YET*']} /> {/* [KT-PANEL] RIGHT */}
      {/* CH6 */}
      <KtHeadlineOverBroll {...KT} t0={T(458.5)} t1={T(459.18)} lines={['MINED BY ANYONE', 'OWNED BY NO ONE']} /> {/* [KT-HEADLINE] */}
      <LightPop t={t} t0={T(481.0)} t1={T(482.34)} lines={['A CASCADE']} y={960} size={84} /> {/* [KT-POP] */}
      {t >= T(500.82) && t < T(503.56) && <KtStack t={t} t0={T(500.82)} t1={T(503.56)} head="THE KASPA COMMUNITY" items={[]} />} {/* [KT-STACK] */}
      <StickerDiscord t={t} t0={T(515.5)} t1={T(516.82)} /> {/* [KT-ICON] image_sticker */}
      <KtSubscribeBar t={t} tPlate={T(525.0)} t1={T(527.9)} /> {/* [KT-CTA] bar */}
      {/* captions: topmost, the running kt-caption-highlight line + its two_colour_pop phrases */}
      {POPS.map((p) => (t >= p.t && t < p.t1 ? <KtTwoColourPop key={p.h} t={t} t0={p.t} lines={p.h === 'BULLISH ON / KASPA' ? ['BULLISH ON', '*KASPA*'] : ['*DROP A COMMENT*', 'IN THE COMMENT SECTION']} /> : null))}
      {LINES.map((p) => (t >= p.t && t < p.t1 ? <KtCaptionLine key={p.h + p.t} p={p} t={t} narrow={panelUp} /> : null))}
    </>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// the house caption data stays generated and in the comp; the plan's caption device replaces its render on every window
// ---------------------------------------------------------------------------------------------------------------------
const HOUSE_CAPTION_TRACK = false; // EDIT-PLAN header, CUE-SHEET, PROJECT-LOG constraints: 'kt-caption-highlight IS the caption ... house caption track OFF'
const HouseCaptions: React.FC<{ t: number }> = ({ t }) => {
  if (!HOUSE_CAPTION_TRACK || !CAPTION_WINDOWS.some(([a, b]) => t >= a && t < b)) return null;
  let cur: { t: number; h: string } | null = null;
  for (const c of ZCAPTIONS) {
    if (c.t <= t) cur = c;
    else break;
  }
  return cur ? <div style={{ position: 'absolute', bottom: 90, width: '100%', textAlign: 'center', fontFamily: "Montserrat,'Arial Black','Segoe UI',sans-serif", fontWeight: 900, fontSize: 96, color: '#fff', textTransform: 'lowercase', WebkitTextStroke: '12px #000', paintOrder: 'stroke fill' }}>{cur.h}</div> : null;
};

// ---------------------------------------------------------------------------------------------------------------------
// ROOT
// ---------------------------------------------------------------------------------------------------------------------
const CARD_START = F(455.705) - 105; // the wall's paused window
// TRANSITIONS_WAIVED: rmn:cube, Mike's draft note 2026-11-05: the wall is his After Effects template and cuts in hard like the original
const WALL_TURN_S = 0; // a hard cut in, as the 2023 original
const readable = PAUSE - WALL_TURN_S;
if (readable < 1.0) throw new Error(`chapter card readable ${readable} s, under the 1.0 s rule`);

const BURNS = [3.367, 26.633, 35.7, 104.2, 237.9, 335.933, 455.667, 500.033]; // hand:film-burn on the 8 face cut-outs

const Wall: React.FC = () => {
  const f = useCurrentFrame();
  return <KtWall dt={f / FPS} turn={WALL_TURN_S} />;
};

const spinePose = (t: number, tc: number) => {
  // kt-side-panel picture moves + the band's face lift, all on the comp clock
  let x = 0;
  let y = 0;
  let extra = 1;
  const pL = T(448.0);
  const pR = T(449.86);
  const pEnd = T(452.4);
  if (tc >= pL && tc < pEnd) {
    const a = ktSidePanelShift(tc, pL, { side: 'R', texture: 'dark', px: 330 });
    if (tc < pR) {
      x = a.x;
      extra = a.scale;
    } else {
      const b = ktSidePanelShift(tc, pR, { side: 'L', texture: 'dark', px: 660 });
      x = -330 + b.x;
      extra = 1.2;
    }
  }
  const c26a = T(PANEL_C26.t0);
  if (tc >= c26a && tc < T(PANEL_C26.t1)) x = ktSidePanelShift(tc, c26a, { side: 'R', texture: 'paper' }).x;
  const lift = T(334.9);
  if (tc >= lift && tc < T(335.933)) y = -68 * interpolate(tc - lift - 0.13, [0, 0.1], [0, 1], CLAMP);
  return { x, y, extra, punch: punchAt(t) };
};

export const BullishOnKaspa: React.FC = () => {
  const frame = useCurrentFrame();
  const tc = frame / FPS;
  const t = srcOf(frame);
  const pose = spinePose(t, tc);
  return (
    <AbsFrame.Provider value={frame}>
      <KtClock.Provider value={{ t: tc }}>
        <AbsoluteFill style={{ background: '#000' }}>
          {/* the paused spine: the only audio in the comp */}
          <SpineLive {...pose} />
          {/* F1, F2, F3 air as the approved superhero swap clips, pre-framed, muted, spine audio kept */}
          {SWAPS.map((s) => {
            const from = F(s.tIn);
            const dur = F(s.tOut) - from;
            return (
              <Sequence key={s.id} from={from} durationInFrames={dur} name={s.id}>
                <SwapClip id={s.id} ws={s.ws} push={s.id === 'F1'} dur={dur} />
              </Sequence>
            );
          })}
          <CoverTrack />
          {/* [OVERLAY] confetti above the cover, source 64.23, cut at the cover's end */}
          <Sequence from={F(64.23)} durationInFrames={F(65.54) - F(64.23)} name="confetti">
            <OffthreadVideo src={staticFile('overlays/confetti-burst-alpha.webm')} muted transparent style={fill} />
          </Sequence>
          <ClipInsert />
          {LIB_CUTS.map((l, i) => (
            <LibWindow key={l.id + i} id={l.id} cutFrame={l.cutFrame} a={l.a} b={l.b} />
          ))}
          {LEAKS.map((l, i) => (
            <LibWindow key={l.id + i} id={l.id} cutFrame={F(l.at)} a={() => <SpineMuted punch={l.before} />} b={() => <SpineMuted punch={l.after} />} />
          ))}
          {/* [CARD] + [KT-WALL] the one title card, a hard cut in */}
          <Sequence from={CARD_START} durationInFrames={105} name="TEXT WALL">
            <Wall />
          </Sequence>
          {BURNS.map((b) => (
            <FilmBurn key={b} frame={frame} cut={F(b)} />
          ))}
          <KtLayer t={tc} />
          <HouseCaptions t={t} />
        </AbsoluteFill>
      </KtClock.Provider>
    </AbsFrame.Provider>
  );
};

const SwapClip: React.FC<{ id: string; ws: number; push: boolean; dur: number }> = ({ id, ws, push, dur }) => {
  const f = useCurrentFrame();
  const s = push ? interpolate(f, [0, dur], [1, 1.05], CLAMP) : 1;
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: '#000' }}>
      <OffthreadVideo src={staticFile(`face-swap/${id}-higgsfield-bg-swap.mp4`)} muted startFrom={Math.round(ws * FPS)} style={{ ...fill, transform: `scale(${s})`, transformOrigin: '50% 40%' }} />
    </AbsoluteFill>
  );
};

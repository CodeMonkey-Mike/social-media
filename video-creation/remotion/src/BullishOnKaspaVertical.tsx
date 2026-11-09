// BullishOnKaspaVertical.tsx: bullish-on-kaspa, the 1080x1920 twin of the 16:9 BullishOnKaspa (vertical-repurpose.md section 2).
// Same spine, same DUR, same beat table and pause map, same transition ids, same caption windows; assets from the LEAN public dir
// assets/vertical/ ONLY. The spine crop is MEASURED (assets/vertical/face-crop.json, per window), never a centre crop.
// NO music, NO SFX, NO watermark: post-mix owns the audio (comp-build.md section 9), the spine's VO is the one audio in the comp.
//
// TIME: every cue is a SOURCE-spine second through sh() / F(). The sidecar spine/ALL.f.paused.json pauses[] IS the time map.
// LIBRARY WINDOW PLACEMENT: a window is exactly `win` frames (section 6a) and its engine's swap fraction sits ON the cut frame.
//
// DIAGRAM_REFS: C1-A-chain, C1-A-fork, C1-A, C1-B, C1-B-lit, C1-C-start, C1-C-mid, C1-C, C5-overview, C5-toccata, C5-intro, C5-zk, C5-jul2, indexer-vs-l1-l1, indexer-vs-l1-flaw, consensus-validates-rules, consensus-validates-validators, consensus-validates-indexer-out, kasplex-based-rollup-base, kasplex-based-rollup-gas, D1-A, D1-A-lit, D1-A-norollup, cascade-base, cascade-wave1, cascade-wave2, cascade-wave3
// (end declared refs)
import React from 'react';
import { AbsoluteFill, Easing, Freeze, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { ENGINES, TransitionClip, framesForRow, getTransitionRow } from './BullishOnKaspaTransitions';
import { DirBlur, KtClock, KtHeadlineOverBroll, KtIconPop, KtKeywordPop, KtWhipCut, ktSidePanelShift } from './effects/kinetic-text';
import { ACCENT, FilmBurn, IconPickaxe, IconShieldCheck, KT_FONT, KtPhrase, KtSubscribeBar } from './BullishOnKaspaCharts';
import { KT_PHRASES } from './BullishOnKaspaData';
import { CAPTION_WINDOWS, ZCAPTIONS } from './BullishOnKaspaCaptions';
import * as P169 from './BullishOnKaspa';
import {
  VBand,
  VC17,
  VC26Panel,
  VC2A,
  VC2B,
  VC2C,
  VC2D,
  VC3,
  VC4,
  VCaptionLine,
  VChip,
  VLightPop,
  VSidePanelDark,
  VStack,
  VStickerDiscord,
  VStickerKaspa,
  VTwoColourPop,
  VWall,
} from './BullishOnKaspaVerticalCharts';

export const W = 1080;
export const H = 1920;
export const FPS = 30;
export const SPINE_SECS = 528.367; // spine/ALL.d.desilenced.mp4
export const PAUSE = 3.5; // the card pause (mixed durations: pauses[].dur below)
export const CARD_T = [65.4, 455.705];
// spine/ALL.f.paused.json pauses[]: BRAAM-1 beat pause · CLIP-1 insert · TEXT WALL card
export const INSERTS = [{ at: 65.4, dur: 1.0 }, { at: 302.165, dur: 10.8 }, { at: 455.705, dur: 3.5 }];
export const sh = (t: number) => t + INSERTS.reduce((a, p) => a + (p.at <= t ? p.dur : 0), 0);
export const F = (t: number) => Math.round(sh(t) * FPS);
const T = (t: number) => F(t) / FPS;
export const DUR = 16311; // assets/spine.mp4 frames (ffprobe, 543.7 s), the SAME as the 16:9

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

// ---------------------------------------------------------------------------------------------------------------------
// THE MEASURED FACE CROP (assets/vertical/face-crop.json, vertical-repurpose.md section 1b). `objectFit: cover` shows 607.5 source px
// of the 1920; a CSS objectPosition of P% puts the P% point of the picture at P% of the BOX, so a head at c% of the source only sits
// on the box centre with P = (c * 3413.33 - 540) / 2333.33. FACE_CROP_PCT holds each window's measured mean_pct.
// ---------------------------------------------------------------------------------------------------------------------
const FACE_CROP_PCT: { w: [number, number]; c: number }[] = [
  { w: [0.0, 3.367], c: 58.78 },
  { w: [19.433, 26.633], c: 58.58 },
  { w: [31.433, 35.7], c: 58.98 },
  { w: [97.3, 104.2], c: 62.64 },
  { w: [233.233, 237.9], c: 62.0 },
  { w: [302.133, 335.933], c: 61.07 },
  { w: [447.9, 455.667], c: 61.93 },
  { w: [490.967, 500.033], c: 61.27 },
  { w: [511.033, 528.367], c: 61.58 },
];
const SPINE_FIT_W = (1920 * H) / 1080; // 3413.33
const faceCentrePct = (t: number) => {
  let best = FACE_CROP_PCT[0];
  let bd = Infinity;
  for (const r of FACE_CROP_PCT) {
    const d = t < r.w[0] ? r.w[0] - t : t > r.w[1] ? t - r.w[1] : 0;
    if (d < bd) {
      bd = d;
      best = r;
    }
  }
  return best.c;
};
/** the spine's objectPosition for source second t, with the picture moved x output px (toward a side panel's free side) */
const spineObjectPosition = (t: number, x: number) => {
  const left = (faceCentrePct(t) / 100) * SPINE_FIT_W - W / 2 - x;
  const p = (left / (SPINE_FIT_W - W)) * 100;
  return `${Math.max(0, Math.min(100, p)).toFixed(3)}% center`;
};
const FACE_POINT = { x: 540, y: 1000 }; // where his face sits after the crop: punch-ins scale about it

const SWAPS = [
  { id: 'F1', tIn: 0.0, tOut: 3.367, ws: 0.0 },
  { id: 'F2', tIn: 19.433, tOut: 26.633, ws: 0.4 },
  { id: 'F3', tIn: 31.433, tOut: 35.7, ws: 0.4 },
];
const PUNCH_SCALE = 1.18;
const PUNCHES = [
  { at: 311.567, s: PUNCH_SCALE, until: 335.933 }, // [PUNCH-IN] F6
  { at: 455.1, s: PUNCH_SCALE, until: 455.705 }, // [PUNCH-IN] F7
  { at: 495.467, s: PUNCH_SCALE, until: 499.367 }, // [PUNCH-IN] F8 in
  { at: 527.467, s: PUNCH_SCALE, until: 999 }, // [PUNCH-IN] F9 (499.367 = F8 back to the base frame)
];
const punchAt = (t: number) => PUNCHES.find((p) => t >= p.at && t < p.until)?.s ?? 1;

const AbsFrame = React.createContext(0);
const useAbs = () => React.useContext(AbsFrame);

const fill: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };
const box: React.CSSProperties = { position: 'absolute', inset: 0 };
const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// frame-for-frame playback, rebuilt with ffprobe from the VERTICAL files (NOTES.md: the 16:9 table no longer matches). Every clip plays from its first frame.
const VID_FPS: Record<string, number> = {
  'BR-1-phone-chart-hands': 25,
  'BR-5-programmer-night-office': 30000 / 1001,
  'BR-7-old-books-library': 24000 / 1001,
  'BR-8-cargo-ship-sailing': 30000 / 1001,
  'BR-9-hammer-dust': 25,
  'BR-10-red-server-room': 24000 / 1001,
  'BR-12-datacenter-hallway': 25,
  'BR-13-night-road-horizon': 30000 / 1001,
  'BR-15-dollar-printing-press': 30000 / 1001,
  'BR-16-speaker-on-stage': 25,
  'BR-17-trader-monitors-dark': 25,
  'BR-18-dawn-street': 30000 / 1001,
  'BR-19-mining-warehouse-rows': 25,
  'BR-20-hand-stacking-coins': 25,
  'BR-21-audience-hands-raised': 30000 / 1001,
};
const rateOf = (ref: string) => (VID_FPS[ref] ? 30 / VID_FPS[ref] : 1);

type Cover = {
  tIn: number;
  tOut: number;
  kind: 'vid' | 'still' | 'receipt' | 'deck' | 'container' | 'chart';
  ref: string;
  state?: string;
  tx?: 'cut' | 'fade' | 'xfade' | 'swap' | 'pushL' | 'pushT' | 'pushoutR' | 'whip' | 'lib';
  d?: number;
  lead?: boolean;
  cap?: boolean;
};

// one row per state / sub-point: BYTE-IDENTICAL to the 16:9 table (asserted below, so the two comps can never drift)
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

if (JSON.stringify(COVERS) !== JSON.stringify(P169.COVERS)) throw new Error('vertical beat table differs from the 16:9 comp');
if (DUR !== P169.DUR || SPINE_SECS !== P169.SPINE_SECS || PAUSE !== P169.PAUSE || JSON.stringify(CARD_T) !== JSON.stringify(P169.CARD_T) || JSON.stringify(INSERTS) !== JSON.stringify(P169.INSERTS)) {
  throw new Error('vertical timing constants differ from the 16:9 comp');
}

// ---------------------------------------------------------------------------------------------------------------------
// the 16:9 ref -> VERTICAL asset lookup: an unmapped ref throws at module load, a mapped file that is missing fails the render
// ---------------------------------------------------------------------------------------------------------------------
const VERTICAL_ASSET: Record<string, string> = Object.fromEntries(
  ([
    ['vid', 'mp4', ['BR-1-phone-chart-hands', 'BR-2-asic-shelves-blue', 'BR-3-teal-cooling-fans', 'BR-4-code-monitor-closeup', 'BR-5-programmer-night-office', 'BR-6-night-aerial-city-dusk', 'BR-7-old-books-library', 'BR-8-cargo-ship-sailing', 'BR-9-hammer-dust', 'BR-10-red-server-room', 'BR-11-rusty-padlock-opens', 'BR-12-datacenter-hallway', 'BR-13-night-road-horizon', 'BR-14-data-tunnel-streaks', 'BR-15-dollar-printing-press', 'BR-16-speaker-on-stage', 'BR-17-trader-monitors-dark', 'BR-18-dawn-street', 'BR-19-mining-warehouse-rows', 'BR-20-hand-stacking-coins', 'BR-21-audience-hands-raised']],
    ['img', 'png', ['IMG-1-pickaxe-coin', 'IMG-2-coin-hero', 'IMG-3-sombrero-coin', 'IMG-4-nacho-coin', 'IMG-5-summit-flag', 'IMG-6-coin-waterfall']],
    ['receipts', 'png', ['C21-kaspa-org-hero', 'C27-rusty-kaspa-v1', 'C19-eth-whitepaper-ghost', 'C16-arxiv-founder', 'C6-rusty-kaspa-v2-toccata', 'C8-silverscript-v1', 'C28-kccs-readme', 'C7-kccforum-final-post', 'C10-nacho-migration', 'C29-igra-cryptopotato', 'C20-kaskad-hero', 'C20-kaskad-about', 'C20-kaskad-audits', 'C20-kaskad-staking', 'C23-kasplex-docs', 'C24-defillama-kasplex', 'C30-gate-kasplex-cryptonews', 'C14-explorer-stats', 'C32-kaspa-build', 'C15-kaspa-lore', 'C33-youtube-midchain-page', 'C13-tradingview-kasusd', 'C34-coingecko-kaspa', 'C35-2miners-kas-hashrate', 'C12-a-defillama-igra', 'C12-b-defillama-kasplex', 'C25-coingecko-solana']],
    ['receipts', 'mp4', ['C9-kascov-tokens-scroll', 'C22-tradingview-solusdt-hovers']],
    ['diagrams', 'png', ['C1-A-chain', 'C1-A-fork', 'C1-A', 'C1-B', 'C1-B-lit', 'C1-C-start', 'C1-C-mid', 'C1-C', 'C5-overview', 'C5-toccata', 'C5-intro', 'C5-zk', 'C5-jul2', 'indexer-vs-l1-l1', 'indexer-vs-l1-flaw', 'consensus-validates-rules', 'consensus-validates-validators', 'consensus-validates-indexer-out', 'kasplex-based-rollup-base', 'kasplex-based-rollup-gas', 'D1-A', 'D1-A-lit', 'D1-A-norollup', 'cascade-base', 'cascade-wave1', 'cascade-wave2', 'cascade-wave3']],
    ['card-slides', 'png', ['research-stack-s1', 'research-stack-s2', 'research-stack-s3', 'silverscript-60-lines-s1', 'silverscript-60-lines-s2', 'silverscript-60-lines-s3', 'bps-ladder-s1', 'bps-ladder-s2', 'bps-ladder-s3', 'stablecoin-card-A-s1', 'stablecoin-card-A-s2', 'stablecoin-card-A-s3', 'stablecoin-card-A-s4', 'stablecoin-card-B-s1', 'stablecoin-card-B-s2', 'stablecoin-card-B-s3', 'stablecoin-card-B-s4', 'stablecoin-card-C-s1', 'stablecoin-card-C-s2', 'parallel-not-prediction-A', 'parallel-not-prediction-B', 'where-i-stand-s1', 'where-i-stand-s2', 'where-i-stand-s3', 'my-theory', 'community-stack-s1', 'community-stack-s2', 'community-stack-s3', 'community-stack-s4']],
  ] as [string, string, string[]][]).flatMap(([dir, ext, refs]) => refs.map((r) => [r, `${dir}/${r}.${ext}`] as [string, string])),
);
const CHART_REFS = ['C2-A', 'C2-B', 'C2-C', 'C2-D', 'C3', 'C4', 'C17'];
for (const c of COVERS) {
  if (c.kind === 'chart' ? !CHART_REFS.includes(c.ref) : !VERTICAL_ASSET[c.ref]) throw new Error(`no vertical asset mapped for ${c.ref}`);
}
const vAsset = (ref: string) => {
  const f = VERTICAL_ASSET[ref];
  if (!f) throw new Error(`no vertical asset mapped for ${ref}`);
  return staticFile(f);
};
// section 3c + NOTES.md: the slots that play a portrait motion clip; the still stays the fallback
const MOTION_CLIP: Record<string, string> = { 'IMG-5-summit-flag': 'img-motion/IMG-5-summit-flag-motion.mp4', 'IMG-6-coin-waterfall': 'img-motion/IMG-6-coin-waterfall-motion.mp4' };

// ---------------------------------------------------------------------------------------------------------------------
// RECEIPTS: the mobile captures are 1080x1920 planes. cam rows: [t, focus x, focus y, scale] in capture px, clamped so the plane always
// covers the frame; the push stays small (a mobile capture's text runs to its margins, a deep push clips it). hl rows: [t, x0, y0, x1, y1] in capture px, re-measured on the mobile captures, wiped left to right.
// ---------------------------------------------------------------------------------------------------------------------
type Rcpt = { cam: [number, number, number, number][]; hl?: [number, number, number, number, number][]; dark?: boolean; mo?: string };
const STILL_CAM = (t: number, s = 1): Rcpt['cam'] => [[t, 540, 960, s]];
const RECEIPTS: Record<string, Rcpt> = {
  'C21-kaspa-org-hero': { cam: [[13.36, 540, 960, 1], [15.0, 540, 960, 1.1]], hl: [[14.1, 748, 940, 975, 982]] },
  'C27-rusty-kaspa-v1': { cam: [[59.3, 540, 960, 1], [61.0, 540, 1500, 1.08]], hl: [[61.3, 325, 1530, 905, 1566], [61.65, 85, 1597, 205, 1633]] },
  'C19-eth-whitepaper-ghost': { cam: [[78.72, 540, 700, 1.0], [81.0, 540, 480, 1.06]], hl: [[81.9, 771, 388, 858, 425], [82.1, 45, 460, 990, 497], [82.5, 45, 532, 558, 569]] },
  'C16-arxiv-founder': { cam: [[92.26, 540, 960, 1], [94.5, 540, 620, 1.1]] },
  'C6-rusty-kaspa-v2-toccata': { cam: [[107.86, 540, 960, 1], [109.5, 540, 1330, 1.08]], hl: [[108.0, 85, 1330, 835, 1366], [108.4, 85, 1395, 860, 1431]] },
  'C8-silverscript-v1': { cam: STILL_CAM(123.5), mo: 'motion-3d-pan-2-right' },
  'C28-kccs-readme': { cam: STILL_CAM(146.88), mo: 'motion-3d-pan-1-left' },
  'C7-kccforum-final-post': { cam: [[154.26, 540, 960, 1], [156.5, 540, 470, 1.06]] },
  'C9-kascov-tokens-scroll': { cam: [[166.28, 540, 960, 1], [175.08, 540, 960, 1.05]] },
  'C10-nacho-migration': { dark: true, cam: [[178.64, 540, 960, 1], [180.5, 540, 800, 1.08]], hl: [[183.9, 100, 806, 620, 852]] },
  'C29-igra-cryptopotato': { cam: [[189.9, 540, 960, 1], [191.5, 540, 1440, 1.06]], hl: [[192.2, 55, 1220, 960, 1258], [192.5, 55, 1290, 255, 1328], [193.6, 55, 1650, 990, 1688], [193.9, 55, 1715, 485, 1753]] },
  'C20-kaskad-hero': { cam: [[194.8, 540, 960, 1], [198.4, 540, 960, 1.08]] },
  'C20-kaskad-about': { cam: [[198.4, 540, 1300, 1.04], [199.5, 540, 1500, 1.08]], hl: [[198.5, 548, 1606, 987, 1644], [198.75, 355, 1670, 470, 1708]] },
  'C20-kaskad-audits': { cam: [[199.5, 540, 1100, 1.02], [200.6, 540, 1100, 1.06]] },
  'C20-kaskad-staking': { cam: [[200.6, 540, 960, 1.04], [201.88, 540, 920, 1.1]], hl: [[200.65, 147, 880, 795, 915], [200.9, 147, 945, 836, 980]] },
  'C23-kasplex-docs': { cam: [[201.88, 540, 960, 1], [204.0, 540, 900, 1.06], [207.4, 540, 900, 1.06], [207.9, 540, 1200, 1.06]], hl: [[204.2, 120, 665, 590, 705], [208.0, 306, 1310, 1005, 1346], [208.4, 120, 1378, 805, 1414]] },
  'C24-defillama-kasplex': { dark: true, cam: [[214.78, 540, 960, 1], [215.8, 540, 1200, 1.04]], hl: [[214.8, 30, 1340, 1050, 1465], [215.4, 30, 1045, 1050, 1170], [216.4, 30, 1190, 1050, 1315]] },
  'C30-gate-kasplex-cryptonews': { cam: STILL_CAM(220.74), mo: 'motion-3d-pan-2-up' },
  'C14-explorer-stats': { cam: [[224.02, 540, 960, 1], [226.0, 540, 620, 1.06], [229.1, 540, 620, 1.06], [230.6, 540, 1500, 1.08]], hl: [[227.0, 85, 505, 200, 540], [230.7, 85, 1648, 275, 1688]] },
  'C32-kaspa-build': { cam: [[246.96, 540, 960, 1], [248.8, 540, 1040, 1.08]], hl: [[249.4, 257, 833, 669, 883], [249.6, 257, 931, 869, 981], [249.8, 257, 1026, 590, 1076], [250.1, 730, 1222, 907, 1272], [250.25, 257, 1313, 707, 1363], [250.4, 257, 1411, 628, 1461]] },
  'C15-kaspa-lore': { cam: [[251.92, 540, 960, 1], [253.6, 540, 420, 1.06]], hl: [[253.9, 64, 238, 994, 276], [254.25, 64, 310, 348, 348]] },
  'C33-youtube-midchain-page': { cam: [[296.9, 540, 960, 1], [299.0, 540, 700, 1.06]] },
  'C13-tradingview-kasusd': { cam: [[339.88, 540, 1000, 1.02], [347.3, 540, 1000, 1.08]] },
  'C34-coingecko-kaspa': { cam: [[347.3, 540, 960, 1], [349.0, 540, 1100, 1.03]] },
  'C35-2miners-kas-hashrate': { dark: true, cam: [[372.5, 540, 960, 1], [374.0, 540, 360, 1.08]] },
  'C12-a-defillama-igra': { dark: true, cam: [[400.5, 540, 1000, 1.0], [403.4, 540, 1000, 1.06]] },
  'C12-b-defillama-kasplex': { dark: true, cam: [[403.4, 540, 1000, 1.0], [407.06, 540, 1000, 1.06]] },
  'C22-tradingview-solusdt-hovers': { cam: [[409.8, 540, 960, 1], [411.6, 620, 500, 1.2]] }, // framed on the legend
  'C25-coingecko-solana': { cam: [[436.06, 540, 960, 1.0], [437.8, 540, 980, 1.06]] },
};
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
  const s = Math.max(p[3], 1);
  const x = Math.min(0, Math.max(W - W * s, W / 2 - p[1] * s));
  const y = Math.min(0, Math.max(H - H * s, H / 2 - p[2] * s));
  return { x, y, s };
};

const ReceiptPlane: React.FC<{ id: string; r: Rcpt; t: number; frozenFrame?: number }> = ({ id, r, t, frozenFrame }) => {
  const c = camAt(r, t);
  const local = useCurrentFrame();
  const abs = useAbs();
  const src = vAsset(id);
  let media: React.ReactNode;
  if (VERTICAL_ASSET[id].endsWith('.mp4')) {
    const cv = coverByRef(id);
    const base = REC_FROM[id] ?? 0;
    if (frozenFrame !== undefined) {
      media = (
        <Sequence from={0} layout="none">
          <Freeze frame={frozenFrame}>
            <OffthreadVideo src={src} muted style={{ width: W, height: H }} />
          </Freeze>
        </Sequence>
      );
    } else {
      media = <OffthreadVideo src={src} muted startFrom={Math.max(0, base + (abs - F(cv.tIn)) - local)} style={{ width: W, height: H }} />;
    }
  } else {
    media = <Img src={src} style={{ width: W, height: H, display: 'block' }} />;
  }
  return (
    <div style={{ ...box, background: r.dark ? '#05070c' : '#FFFFFF', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: '0 0', transform: `translate(${c.x}px, ${c.y}px) scale(${c.s})` }}>
        {media}
        {(r.hl ?? []).map(([ht, x0, y0, x1, y1], i) => {
          const u = interpolate(t, [ht, ht + 0.35], [0, 1], { ...CLAMP, easing: Easing.out(Easing.quad) });
          if (u <= 0) return null;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x0,
                top: y0,
                width: (x1 - x0) * u,
                height: y1 - y0,
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
const familyOf = (ref: string) => {
  const m = ref.match(/^(C1|C5|D1|cascade|indexer-vs-l1|consensus-validates|kasplex-based-rollup|research-stack|silverscript-60-lines|bps-ladder|stablecoin-card-[ABC]|parallel-not-prediction|where-i-stand|community-stack|my-theory)/);
  return m ? m[1] : ref;
};
const familySpan = (ref: string) => {
  const rows = COVERS.filter((c) => familyOf(c.ref) === familyOf(ref));
  return [rows[0].tIn, rows[rows.length - 1].tOut];
};
const BZ_START = 65.4; // [BRAAM] the sombrero coin eases toward its point over the beat pause

const CoverBody: React.FC<{ c: Cover; frozen?: boolean; frozenAt?: 'first' | 'last' }> = ({ c, frozen, frozenAt = 'last' }) => {
  const abs = useAbs();
  const local = useCurrentFrame();
  const t = srcOf(abs);
  if (c.kind === 'vid') {
    const src = vAsset(c.ref);
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
    if (MOTION_CLIP[c.ref]) {
      const start = c.ref === 'IMG-5-summit-flag' ? F(455.705) : F(c.tIn);
      const src = staticFile(MOTION_CLIP[c.ref]);
      if (frozen) {
        const n = frozenAt === 'first' ? 1 : Math.max(1, Math.round(F(c.tOut) - start - 1));
        return (
          <Sequence from={0} layout="none">
            <Freeze frame={n}>
              <OffthreadVideo src={src} muted style={fill} />
            </Freeze>
          </Sequence>
        );
      }
      if (abs < start) return <Img src={vAsset(c.ref)} style={fill} />;
      return <OffthreadVideo src={src} muted startFrom={Math.max(0, abs - local - start)} style={fill} />;
    }
    const u = interpolate(abs, [F(c.tIn), F(c.tOut)], [0, 1], CLAMP);
    const isBz = c.ref === 'IMG-3-sombrero-coin';
    const bz = isBz ? Easing.inOut(Easing.sin)(interpolate(abs, [F(BZ_START) - 30, F(BZ_START)], [0, 1], CLAMP)) : 0;
    const s = (1.0 + 0.05 * u) * (1 + 0.22 * bz);
    return (
      <div style={{ ...box, overflow: 'hidden', background: '#000' }}>
        <Img src={vAsset(c.ref)} style={{ ...fill, transform: `scale(${s})`, transformOrigin: isBz ? '50% 42%' : '50% 50%' }} />
      </div>
    );
  }
  if (c.kind === 'receipt') {
    const r = RECEIPTS[c.ref];
    if (!r) throw new Error(`no vertical receipt camera for ${c.ref}`);
    const isRec = VERTICAL_ASSET[c.ref].endsWith('.mp4');
    const frozenFrame = isRec && frozen ? (REC_FROM[c.ref] ?? 0) + (frozenAt === 'first' ? 0 : F(c.tOut) - F(c.tIn) - 1) : undefined;
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
    if (c.ref === 'C2-A') return <VC2A t={t} />;
    if (c.ref === 'C2-B') return <VC2B t={t} />;
    if (c.ref === 'C2-C') return <VC2C t={t} />;
    if (c.ref === 'C2-D') return <VC2D t={t} />;
    if (c.ref === 'C3') return <VC3 t={t} />;
    if (c.ref === 'C4') return <VC4 t={t} />;
    if (c.ref === 'C17') return <VC17 t={t} />;
    return null;
  }
  const [a, b] = familySpan(c.ref);
  const u = interpolate(t, [a, b], [0, 1], CLAMP);
  const s = 1 + 0.03 * u;
  const isStatement = c.ref === 'my-theory';
  const hx = isStatement ? 8 * Math.sin(t * 1.3) : 0;
  const hy = isStatement ? 5 * Math.cos(t * 1.1) : 0;
  const rot = isStatement ? 0.25 * Math.sin((2 * Math.PI * t) / 3.2) : 0;
  return (
    <div style={{ ...box, overflow: 'hidden', background: '#F6F4EE' }}>
      <Img src={vAsset(c.ref)} style={{ ...fill, transform: `translate(${hx}px, ${hy}px) rotate(${rot}deg) scale(${isStatement ? s + 0.015 : s})`, transformOrigin: '50% 50%' }} />
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// the cover track: ingress wrappers + the outgoing row's tail under a dissolve
// ---------------------------------------------------------------------------------------------------------------------
const ingressFrames = (c?: Cover) => {
  if (!c) return 0;
  if (c.tx === 'xfade') return 11;
  if (c.tx === 'swap' || c.tx === 'fade') return c.d ?? 8;
  if (c.tx === 'pushL' || c.tx === 'pushT') return 3;
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
    const off = c.tx === 'pushL' ? { x: -0.85 * W * (1 - u), y: 0 } : { x: 0, y: -0.68 * H * (1 - u) };
    return (
      <DirBlur sx={c.tx === 'pushL' ? 60 * (1 - u) : 0} sy={c.tx === 'pushT' ? 40 * (1 - u) : 0}>
        <div style={{ ...box, transform: `translate(${off.x}px, ${off.y}px)` }}>{children}</div>
      </DirBlur>
    );
  }
  if (c.tx === 'pushoutR') {
    return (
      <>
        {children}
        {f < 3 && prev && (
          <div style={{ ...box, transform: `translateX(${0.96 * W * pushEase(f / 3)}px)` }}>
            <CoverBody c={prev} frozen />
            <FairLaunchStack t={T(prev.tOut) - 1 / FPS} />
          </div>
        )}
      </>
    );
  }
  return <>{children}</>;
};

const WHIP_ALSO: Record<string, number> = { 'BR-17-trader-monitors-dark': 337.3 };
// section 6a cost trap: inside the 0.37 s whip a video row feeds the engine its CUTFRAME still (assets/vertical/cutframes/, rebuilt from the VERTICAL clips)
const WhipRow: React.FC<{ c: Cover; t0: number; children: React.ReactNode }> = ({ c, t0, children }) => {
  const dt = useAbs() / FPS - t0;
  const useStill = c.kind === 'vid' && dt >= -0.001 && dt < 0.37;
  return <KtWhipCut t0={t0} width={W} height={H}>{useStill ? <Img src={staticFile(`cutframes/${c.ref}.jpg`)} style={fill} /> : children}</KtWhipCut>;
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
// the spine and its stills (section 6a: real Freeze, muted, the same crop + transform, the same source)
// ---------------------------------------------------------------------------------------------------------------------
const PunchBox: React.FC<{ punch: number; y?: number; children: React.ReactNode }> = ({ punch, y = 0, children }) => (
  <div style={{ ...box, overflow: 'hidden', background: '#000' }}>
    <div style={{ ...box, transformOrigin: `${FACE_POINT.x}px ${FACE_POINT.y}px`, transform: `translateY(${y}px) scale(${punch})` }}>{children}</div>
  </div>
);
const spineStyle = (t: number, x: number): React.CSSProperties => ({ width: W, height: H, objectFit: 'cover', objectPosition: spineObjectPosition(t, x) });

// the one audible copy: the VO lives here
const SpineLive: React.FC<{ t: number; x: number; y: number; punch: number }> = ({ t, x, y, punch }) => (
  <PunchBox punch={punch} y={y}>
    <OffthreadVideo src={staticFile('spine.mp4')} style={spineStyle(t, x)} />
  </PunchBox>
);

/** a faithful freeze of the airing spine frame (muted), inside the zero-offset Sequence the Freeze clamp needs */
const SpineStill: React.FC<{ frame: number; punch?: number }> = ({ frame, punch = 1 }) => {
  const abs = useAbs();
  const pose = spinePose(abs / FPS);
  return (
    <PunchBox punch={punch} y={pose.y}>
      <Sequence from={0} layout="none">
        <Freeze frame={frame}>
          <OffthreadVideo src={staticFile('spine.mp4')} muted style={spineStyle(srcOf(frame), pose.x)} />
        </Freeze>
      </Sequence>
    </PunchBox>
  );
};
/** the swap clip's frame: the same source as the live layer, native 9:16, no crop (section 1c) */
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
      <OffthreadVideo src={staticFile('spine.mp4')} muted startFrom={Math.max(0, abs - local)} style={spineStyle(srcOf(abs), 0)} />
    </PunchBox>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// LIBRARY transitions: the 16:9's exact ids and cut frames
// ---------------------------------------------------------------------------------------------------------------------
type LibCut = { id: string; cutFrame: number; a: () => React.ReactNode; b: () => React.ReactNode };
const fromRef = (ref: string, at: 'first' | 'last') => () => <CoverBody c={coverByRef(ref)} frozen frozenAt={at} />;
const liveRef = (ref: string) => () => <CoverBody c={coverByRef(ref)} frozen frozenAt="first" />;

const CLIP_END = F(302.165);
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
  // lib:zoom-optics-in-out-3: the F6 cut-in behind the CLIP-1 insert-out
  { id: 'zoom-optics-in-out-3', cutFrame: CLIP_END, a: () => <ClipFrozen last />, b: () => <ResumeUnderFade /> },
  optics('zoom-optics-in-out-2', 447.9, 'parallel-not-prediction-B', <SpineStill frame={F(447.9) + 1} />), // lib:zoom-optics-in-out-2
  { id: 'melt-rgb-3', cutFrame: F(480.2), a: fromRef('IMG-6-coin-waterfall', 'last'), b: liveRef('cascade-base') }, // lib:melt-rgb-3
  optics('zoom-optics-in', 490.967, 'BR-20-hand-stacking-coins', <SpineStill frame={F(490.967) + 1} />), // lib:zoom-optics-in (F8)
  optics('zoom-optics-in-impact', 511.033, 'community-stack-s4', <SpineStill frame={F(511.033) + 1} />), // lib:zoom-optics-in-impact (F9)
];
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
const LeadIn: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: interpolate(f, [0, dur], [0, 1], CLAMP) }}>{children}</AbsoluteFill>;
};
const ClipInsert: React.FC = () => {
  const leadFrom = F(301.18);
  return (
    <>
      {/* [STILL] LEAD-IN + hand:fade insert-in */}
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
/* [STILL] LEAD-OUT + hand:fade insert-out, inside the optics window's B side */
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
// KINETIC TEXT, comp clock = absolute comp seconds, device times are T(source second), the same rows as the 16:9
// ---------------------------------------------------------------------------------------------------------------------
const KT = { font: KT_FONT, accent: ACCENT };
const HL_X = 540;
const HL_Y = 900;

const FairLaunchStack: React.FC<{ t: number }> = ({ t }) => (
  <VStack
    t={t}
    t0={T(6.62)}
    t1={T(13.36)}
    head={['FAIR LAUNCH']}
    headY={540}
    items={[
      { t: T(9.74), lines: ['NO PREMINE'], y: 740 },
      { t: T(10.86), lines: ['NO PRE-SALE'], y: 880 },
      { t: T(11.94), lines: ['NO INSIDER', 'ALLOCATION'], y: 1060 },
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
const FACE_WINDOWS = FACE_CROP_PCT.map((r) => r.w);
const windowEnd = (t: number) => FACE_WINDOWS.find(([a, b]) => t >= a - 0.25 && t < b)?.[1] ?? t;
const CAP_LIMIT: Record<string, number> = {
  'CLICK THE LINK': 334.9,
  'MAKE SURE YOU CLICK THAT LIKE BUTTON': 525.0,
  'BULLISH ON / KASPA': 37.84,
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
// the subscribe bar: the shared plates, its 1920-wide stage scaled so the 1411 px bar fills the portrait width, lifted above the phone's bottom UI
const SUB_S = 1.3;
const SUB_X = W / 2 - 960 * SUB_S;
const SUB_Y = 1500 - (625 + 251) * SUB_S; // the plate's bar sits 251 stage px under the plate centre

const KtLayer: React.FC<{ t: number }> = ({ t }) => {
  const panelUp = t >= T(PANEL_C26.t0) && t < T(PANEL_C26.t1);
  const band1Out = interpolate(t, [T(140.5), T(141.4)], [0, 620], { ...CLAMP, easing: Easing.in(Easing.quad) });
  const band2Out = interpolate(t, [T(336.4), T(337.3)], [0, 620], { ...CLAMP, easing: Easing.in(Easing.quad) });
  return (
    <>
      {/* CH1 */}
      <KtHeadlineOverBroll {...KT} t0={T(4.167)} t1={T(6.0)} x={HL_X} y={HL_Y} lines={['NOTHING TO DO', 'WITH THE PRICE']} fontSize={88} linePitch={104} /> {/* [KT-HEADLINE] */}
      {t < T(13.36) && <FairLaunchStack t={t} />} {/* [KT-STACK] */}
      <KtIconPop t0={T(15.6)} t1={T(17.12)} preset="rocket-left" w={220} h={220} x={820} y={1420} travel={1100} icon={<IconPickaxe />} /> {/* [KT-ICON] PICKAXE */}
      <KtHeadlineOverBroll {...KT} t0={T(27.433)} t1={T(31.433)} x={HL_X} y={HL_Y} lines={['5 YEARS', 'OF BUILDING']} fontSize={120} linePitch={136} /> {/* [KT-HEADLINE] */}
      <VStickerKaspa t={t} t0={T(31.433)} t1={T(35.7)} /> {/* [KT-ICON] image_sticker */}
      {/* CH2 */}
      <VLightPop t={t} t0={T(46.26)} t1={T(47.3)} lines={['THROWN AWAY']} y={1560} size={100} /> {/* [KT-POP] */}
      <VLightPop t={t} t0={T(47.9)} t1={T(49.9)} lines={['EVERY BLOCK', 'COUNTS']} y={1690} size={92} /> {/* [KT-POP] */}
      <VChip t={t} t0={T(57.78)} t1={T(59.3)} text="10 BLOCKS / SECOND" y={1760} /> {/* [KT-POP] chip */}
      <VLightPop t={t} t0={T(79.94)} t1={T(81.74)} lines={['2013']} y={1300} size={170} /> {/* [KT-POP] */}
      {/* CH3 */}
      <VLightPop t={t} t0={T(110.4)} t1={T(111.7)} lines={['LAYER 1 IS', 'PROGRAMMABLE']} y={1600} size={96} /> {/* [KT-POP] */}
      <VChip t={t} t0={T(119.4)} t1={T(123.5)} text="JULY 2" x={830} y={250} /> {/* [KT-POP] chip */}
      <div style={{ ...box, transform: `translateY(${band1Out}px)` }}>
        <VBand t={t} t0={T(136.38)} t1={T(141.4)} lines={['AN OUTSIDE INDEXER', 'WAS EXPLOITED.', "*KASPA'S LAYER 1*", '*WAS NOT.*']} fontSize={76} pitch={92} y={1630} /> {/* [KT-BAND] */}
      </div>
      <KtIconPop t0={T(157.1)} t1={T(158.48)} preset="gauge-right" w={220} h={220} x={860} y={1300} travel={500} icon={<IconShieldCheck />} /> {/* [KT-ICON] SHIELD-CHECK */}
      <KtKeywordPop {...KT} t0={T(157.5)} t1={T(158.48)} x={HL_X} y={1000} variant="punch-red" accent="#E70001" lines={['FINAL']} /> {/* [KT-POP] punch */}
      {t >= T(187.48) && t < T(189.9) && <VStack t={t} t0={T(187.48)} t1={T(189.9)} head={['THE L2 STACK']} headY={760} items={[{ t: T(188.06), lines: ['IGRA · MAR 19 2026'], y: 960 }]} itemSize={76} />} {/* [KT-STACK] */}
      <VLightPop t={t} t0={T(227.1)} t1={T(228.9)} lines={['2.4 BILLION', 'TRANSACTIONS']} y={1360} size={100} /> {/* [KT-POP] */}
      {/* CH4 */}
      <VLightPop t={t} t0={T(247.66)} t1={T(249.46)} lines={['UNDER', 'CONSTRUCTION']} y={1660} size={100} /> {/* [KT-POP] */}
      <KtHeadlineOverBroll {...KT} t0={T(293.94)} t1={T(296.9)} x={HL_X} y={HL_Y} lines={['THE FOUNDER,', 'ON STAGE']} fontSize={108} linePitch={124} /> {/* [KT-HEADLINE] */}
      <VC26Panel t={t} t0={T(PANEL_C26.t0)} t1={T(PANEL_C26.t1)} /> {/* [KT-PANEL] C26, side R */}
      <div style={{ ...box, transform: `translateY(${band2Out}px)` }}>
        <VBand t={t} t0={T(334.9)} t1={T(337.3)} lines={['*LINK* IN THE', 'DESCRIPTION']} fontSize={100} pitch={116} y={1630} /> {/* [KT-BAND] */}
      </div>
      {/* CH5: the panels follow his hands, same sides as the 16:9 (Mike's draft note 2026-11-05) */}
      <VSidePanelDark t={t} t0={T(448.0)} t1={T(450.1)} side="R" lines={['THE *TOOLS*', 'CAME FIRST']} fontSize={78} pitch={94} /> {/* [KT-PANEL] screen RIGHT */}
      <VSidePanelDark t={t} t0={T(449.86)} t1={T(452.4)} side="L" lines={['THE CROWD', 'HAS NOT', 'ARRIVED *YET*']} fontSize={72} pitch={90} /> {/* [KT-PANEL] screen LEFT */}
      {/* CH6 */}
      <KtHeadlineOverBroll {...KT} t0={T(458.5)} t1={T(459.18)} x={HL_X} y={HL_Y} lines={['MINED BY ANYONE', 'OWNED BY NO ONE']} fontSize={80} linePitch={96} /> {/* [KT-HEADLINE] */}
      <VLightPop t={t} t0={T(481.0)} t1={T(482.34)} lines={['A CASCADE']} y={1660} size={100} /> {/* [KT-POP] */}
      {t >= T(500.82) && t < T(503.56) && <VStack t={t} t0={T(500.82)} t1={T(503.56)} head={['THE KASPA', 'COMMUNITY']} headY={840} items={[]} />} {/* [KT-STACK] */}
      <VStickerDiscord t={t} t0={T(515.5)} t1={T(516.82)} /> {/* [KT-ICON] image_sticker */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', transform: `translate(${SUB_X}px, ${SUB_Y}px) scale(${SUB_S})` }}>
        <KtSubscribeBar t={t} tPlate={T(525.0)} t1={T(527.9)} /> {/* [KT-CTA] bar */}
      </div>
      {/* captions: topmost, the running kt-caption-highlight line + its two_colour_pop phrases */}
      {POPS.map((p) => (t >= p.t && t < p.t1 ? <VTwoColourPop key={p.h} t={t} t0={p.t} lines={p.h === 'BULLISH ON / KASPA' ? ['BULLISH ON', '*KASPA*'] : ['*DROP A COMMENT*', 'IN THE COMMENT', 'SECTION']} size={p.h === 'BULLISH ON / KASPA' ? 112 : 84} pitch={p.h === 'BULLISH ON / KASPA' ? 124 : 98} /> : null))}
      {LINES.map((p) => (t >= p.t && t < p.t1 ? <VCaptionLine key={p.h + p.t} p={p} t={t} narrow={panelUp} /> : null))}
    </>
  );
};

// the house caption data stays generated and in the comp; the plan's caption device replaces its render on every window, as in the 16:9
const HOUSE_CAPTION_TRACK = false; // EDIT-PLAN header, CUE-SHEET, PROJECT-LOG constraints: 'kt-caption-highlight IS the caption ... house caption track OFF'
const HouseCaptions: React.FC<{ t: number }> = ({ t }) => {
  if (!HOUSE_CAPTION_TRACK || !CAPTION_WINDOWS.some(([a, b]) => t >= a && t < b)) return null;
  let cur: { t: number; h: string } | null = null;
  for (const c of ZCAPTIONS) {
    if (c.t <= t) cur = c;
    else break;
  }
  return cur ? <div style={{ position: 'absolute', bottom: 330, width: '100%', textAlign: 'center', fontFamily: "Montserrat,'Arial Black','Segoe UI',sans-serif", fontWeight: 900, fontSize: 96, color: '#fff', textTransform: 'lowercase', WebkitTextStroke: '12px #000', paintOrder: 'stroke fill' }}>{cur.h}</div> : null;
};

// ---------------------------------------------------------------------------------------------------------------------
// ROOT
// ---------------------------------------------------------------------------------------------------------------------
const CARD_START = F(455.705) - 105; // the wall's paused window
// TRANSITIONS_WAIVED: rmn:cube, Mike's draft note 2026-11-05: the wall is his After Effects template and cuts in hard like the original
const WALL_TURN_S = 0;
const readable = PAUSE - WALL_TURN_S;
if (readable < 1.0) throw new Error(`chapter card readable ${readable} s, under the 1.0 s rule`);

const BURNS = [3.367, 26.633, 35.7, 104.2, 237.9, 335.933, 455.667, 500.033]; // hand:film-burn on the 8 face cut-outs

const Wall: React.FC = () => {
  const f = useCurrentFrame();
  return <VWall dt={f / FPS} />;
};

// kt-side-panel picture moves, on the comp clock: the head goes into the free width beside a 594 px panel (crop, never a black edge)
const PANEL_SHIFT = 260;
const spinePose = (tc: number) => {
  let x = 0;
  let y = 0;
  const pR = T(448.0);
  const pL = T(449.86);
  const pEnd = T(452.4);
  if (tc >= pR && tc < pEnd) {
    x = tc < pL ? ktSidePanelShift(tc, pR, { side: 'R', texture: 'dark', px: PANEL_SHIFT }).x : -PANEL_SHIFT + ktSidePanelShift(tc, pL, { side: 'L', texture: 'dark', px: PANEL_SHIFT * 2 }).x;
  }
  const c26a = T(PANEL_C26.t0);
  if (tc >= c26a && tc < T(PANEL_C26.t1)) x = ktSidePanelShift(tc, c26a, { side: 'R', texture: 'paper', px: PANEL_SHIFT }).x;
  const lift = T(334.9);
  if (tc >= lift && tc < T(335.933)) y = -68 * interpolate(tc - lift - 0.13, [0, 0.1], [0, 1], CLAMP);
  return { x, y };
};

export const BullishOnKaspaVertical: React.FC = () => {
  const frame = useCurrentFrame();
  const tc = frame / FPS;
  const t = srcOf(frame);
  const pose = spinePose(tc);
  return (
    <AbsFrame.Provider value={frame}>
      <KtClock.Provider value={{ t: tc }}>
        <AbsoluteFill style={{ background: '#000' }}>
          {/* the paused spine: the only audio in the comp */}
          <SpineLive t={t} x={pose.x} y={pose.y} punch={punchAt(t)} />
          {/* F1, F2, F3 air as the native 9:16 superhero swap clips, full-frame, no crop, muted, spine audio kept */}
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
          {/* [OVERLAY] confetti above the cover, source 64.23, cut at the cover's end; 16:9 with alpha, a centre crop is correct (NOTES.md) */}
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

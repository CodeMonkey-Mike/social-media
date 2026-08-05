import React from 'react';
import {
  AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile,
  interpolate, useCurrentFrame, Easing,
} from 'remotion';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { TransitionClip } from './transitions/TransitionClip';
import { getTransition, framesForRow } from './transitions/registry';
import { C1 } from './Kaspa40ChartC1';
import { H1, C2, C3, FIN } from './Kaspa40Charts';
import { ZCAPTIONS } from './Kaspa40Captions';

/**
 * kaspa 30bps — "40 blocks per second" (longform-edited, 16:9).
 *
 * Built to media/kaspa 30bps/EDIT-PLAN.md + CUE-SHEET.md + TRANSITIONS.md.
 * Architecture: comp-build.md (spine + sh() re-mapper + one COVER track + library transitions).
 * Music and SFX are NOT here — they are ffmpeg-mixed onto the finished render (MUSIC-PLAN.json).
 */

const { fontFamily: MONT } = loadMontserrat('normal', {
  weights: ['900'], subsets: ['latin'], ignoreTooManyRequestsWarning: true,
});

// ─── timing model (comp-build.md §2) ─────────────────────────────────────────
export const K40_FPS = 30;
const FPS = K40_FPS;
const SPINE_SECS = 455.33;          // spine/ALL.e.desilenced.mp4
export const PAUSE = 1.0;                  // 1s freeze+silence baked per chapter card

/** Card-pause points, in SOURCE seconds, exactly as baked into spine/ALL.f.paused.mp4.
 *  CH3 sits after "So what actually is DAGKnight?" (the planned 134.52 chapter seam has no
 *  silence at all — the desilencer had already closed that breath — so the card answers the
 *  question instead of interrupting it; see PROJECT-LOG + spine/ALL.f.paused.json). */
export const CARD_T = [52.81, 137.0667];

/** The same two points as spine INSERTS, for `skills/lint-pause-silence.py` to verify against
 *  the SOURCE spine (spine/ALL.e.desilenced.mp4) — every insert must sit inside a silence dip. */
const INSERTS = [
  { at: 52.81, dur: 1.0 },
  { at: 137.0667, dur: 1.0 },
];

export const sh = (t: number) => t + PAUSE * CARD_T.filter((c) => c <= t).length;
export const cardStart = (b: number) => b + PAUSE * CARD_T.filter((c) => c < b).length;
export const F = (t: number) => Math.round(sh(t) * FPS);
export const K40_DURATION = Math.round((SPINE_SECS + CARD_T.length * PAUSE) * FPS);

/** paused-spine seconds -> SOURCE seconds (frozen at the card time during a pause). */
export const unsh = (tp: number) => {
  let s = tp;
  for (const c of CARD_T) {
    const cs = cardStart(c);
    if (tp >= cs + PAUSE) s -= PAUSE;
    else if (tp >= cs) return c;
  }
  return s;
};

/**
 * The composition clock, in ABSOLUTE frames.
 * `useCurrentFrame()` is Sequence-relative, and a transition engine re-mounts the same cover node
 * inside several nested Sequences (its window, then its clean tail), so a node that timed itself
 * off the local frame froze on a stale image and painted it over the live layer underneath.
 * Everything here is authored against one absolute clock, so it is published once and read anywhere.
 */
const AbsFrameCtx = React.createContext(0);

export const ease = Easing.out(Easing.cubic);
export const ip = (t: number, rng: number[], out: number[], easing?: (n: number) => number) =>
  interpolate(t, rng, out, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', ...(easing ? { easing } : {}) });

const fill = { width: '100%', height: '100%', objectFit: 'cover' } as const;

// ─── FACE windows (blackdetect on the baked spine) + captions ────────────────
export const FACE: [number, number][] = [
  [0.00, 4.70], [32.40, 38.53], [107.93, 112.37], [184.97, 191.30],
  [227.77, 305.07], [321.50, 326.27], [392.30, 394.90], [452.33, 455.22],
];
export const CAPTION_SRC: [number, number][] = FACE;

/** Light leaks: face holds > 5s only, a pulse CENTERED on the hold (overlays.md §1). */
export const LEAKS = FACE.filter(([a, b]) => b - a > 5).map(([a, b]) => {
  const m = (a + b) / 2, d = Math.min(b - a - 2, 4);
  return [m - d / 2, m + d / 2] as [number, number];
});

/** Punch-ins / re-frames. Every `at` is a real silence anchor from spine/jumpcuts-final.json,
 *  so a punch lands between sentences, never mid-word. F3 has NO internal anchor and F7 has no
 *  room (2.6s bracketed by two 0.96s glitches) — both correctly get no punch. */
export const PUNCH: { at: number; to: number }[] = [
  { at: 3.180, to: 1.06 },   // F1 — subtle: the Higgsfield swap already bakes ~5%
  { at: 35.752, to: 1.17 },  // F2
  { at: 188.647, to: 1.17 }, // F4
  { at: 230.450, to: 1.12 }, // F5 plug re-frames, alternating, ~every 12s
  { at: 242.903, to: 1.00 },
  { at: 253.072, to: 1.13 },
  { at: 266.220, to: 1.00 },
  { at: 278.293, to: 1.14 },
  { at: 289.707, to: 1.00 },
  { at: 299.335, to: 1.12 },
  { at: 323.898, to: 1.16 }, // F6
  { at: 453.835, to: 1.18 }, // F8 — lands on "my number one"
];

export const spineScale = (t: number) => {
  const w = FACE.find(([a, b]) => t >= a && t < b);
  if (!w) return 1;
  let prev = 1, cur = 1, at = w[0];
  for (const p of PUNCH) {
    if (p.at < w[0] || p.at >= w[1] || t < p.at) continue;
    prev = cur; cur = p.to; at = p.at;
  }
  return ip(t, [at, at + 0.25], [prev, cur], ease);
};

// ─── asset tables ────────────────────────────────────────────────────────────
const SLIDE: Record<string, string> = {
  'card-40bps-open': 'title-slides/card-40bps-open.png',
  'card-fastest-pow': 'title-slides/card-fastest-pow.png',
  'card-negation': 'title-slides/card-negation.png',
  'card-dagknight-intro': 'title-slides/card-dagknight-intro.png',
  'stamp-subsecond': 'title-slides/stamp-subsecond.png',
  'toccata-features': 'card-slides/toccata-features.png',
  'card-security-50': 'card-slides/card-security-50.png',
  'compare-solana-kaspa': 'card-slides/compare-solana-kaspa.png',
  'card-honest-target': 'card-slides/card-honest-target.png',
};
/** state -> file override (spotlight variants shipped by slide-builder / chart-builder). */
const STATEFILE: Record<string, string> = {
  'toccata-features:s1': 'card-slides/toccata-features-s1.png',
  'toccata-features:s2': 'card-slides/toccata-features-s2.png',
  'toccata-features:s3': 'card-slides/toccata-features-s3.png',
  'compare-solana-kaspa:s1': 'card-slides/compare-solana-kaspa-s1.png',
  'compare-solana-kaspa:s2': 'card-slides/compare-solana-kaspa-s2.png',
  'compare-solana-kaspa:s3': 'card-slides/compare-solana-kaspa-s3.png',
  'compare-solana-kaspa:s4': 'card-slides/compare-solana-kaspa-s4.png',
  'card-honest-target:s1': 'card-slides/card-honest-target-s1.png',
  'card-honest-target:s3': 'card-slides/card-honest-target-s3.png',
  'd-dag:base': 'diagrams/d-dag-base.png',
  'd-dag:highlight': 'diagrams/d-dag-highlight.png',
  'c4-left:full': 'diagrams/c4-left-ghostdag.png',
  'c4-left:title': 'diagrams/c4-left-ghostdag.png',
  'c4-left:box': 'diagrams/c4-left-ghostdag.png',
  'c4-left:guess': 'diagrams/c4-left-ghostdag.png',
  'c4-left:readout': 'diagrams/c4-left-ghostdag.png',
  'c4-left:pulse': 'diagrams/c4-left-ghostdag.png',
  'c4-right:full': 'diagrams/c4-right-dagknight.png',
  'c4-right:readout': 'diagrams/c4-right-dagknight.png',
};
/** Comp-level sub-spotlight on a SYSTEM-DESIGN still: [focusX, focusY, scale] (0-1 focus).
 *  Type 2 charts carry NO baked animation, so every move here is comp-level (BROLL-PLAN). */
/** Every spotlight region on C4 lives against the LEFT edge (title, then the red assumption box),
 *  so the origin is pinned to x=0: scaling about the region's own centre pushed "GHOSTDAG" and the
 *  box's left border off frame. Scales are also pulled back so no glyph crosses the safe margin. */
const SPOT: Record<string, [number, number, number]> = {
  'c4-left:full': [0.5, 0.5, 1.0],
  'c4-left:title': [0.00, 0.00, 1.30],
  'c4-left:box': [0.00, 0.22, 1.34],
  'c4-left:guess': [0.00, 0.28, 1.40],
  'c4-left:readout': [0.50, 1.00, 1.30],
  'c4-left:pulse': [0.50, 0.50, 1.10],
  'c4-right:full': [0.5, 0.5, 1.0],
  // Gentle now: the PACKETS carry the motion, so the camera only needs to ease toward the readout.
  // The earlier deep push cropped "MEASURED NETWORK LATENCY" mid-word off the left edge.
  'c4-right:readout': [0.50, 0.70, 1.02],
};
/**
 * Where a spotlight DRIFTS to across its hold: [focusX, focusY, scale] at the end of the window.
 * A Type 2 chart bakes no animation of its own, so the C4 DAGKnight state sat dead still for 17.8s
 * (Mike, 2026-07-25: "was there meant to be any motion in that?"). The EDIT-PLAN beat at 200.9 is
 * "readout CLIMBS", so the hold is now a full view that pushes gently, then a deliberate spotlight
 * down into the NETWORK SPEED bar. Note a full-diagram view can only push ~4%: any more and the
 * DAGKNIGHT title and the MEASURED-latency box crop off the left edge. Deep pushes are only for
 * rows that are DELIBERATELY spotlighting one region.
 */
const MOTION: Record<string, [number, number, number]> = {
  'c4-right:full': [0.50, 0.54, 1.04],
  'c4-right:readout': [0.50, 0.80, 1.06],
};

/**
 * `off` = seconds into the clip (skip the sourcer's handles / pick the strongest segment).
 * `fit` = per-clip reframe. BR-4 and BR-5 are the storm-vs-sunny smash-cut PAIR: as licensed,
 * BR-4's horizon sits at ~84% of frame height (elevated dashcam) and BR-5's at ~48% (low
 * bumper-cam), so cutting between them jumped the camera height and broke the gag. BR-5 is
 * scaled and pushed up to bring the two horizons into the same band.
 */
const BROLL: Record<string, { file: string; off: number; fit?: string; rate?: number }> = {
  'BR-1': { file: 'vid/BR-1-warp-tunnel.mp4', off: 0 },
  'BR-2': { file: 'vid/BR-2-gauge-dial.mp4', off: 0.6 },
  'BR-3': { file: 'vid/BR-3-reactor-core.mp4', off: 0 },
  'BR-4': { file: 'vid/BR-4-storm-pov.mp4', off: 0 },
  // Slowed to 40% (Mike, 2026-07-25: "we should see the driving happening much slower"). It also
  // earns its keep: the line is "sunny day, empty road, doesn't matter" — crawling on a clear road
  // IS the point, the network still runs at the worst-case guess. 6.8s source covers the 4.76s slot.
  'BR-5': { file: 'vid/BR-5-sunny-pov.mp4', off: 0, fit: 'scale(1.16) translateY(-7%)', rate: 0.40 },
  'BR-6': { file: 'vid/BR-6-traffic-jam.mp4', off: 0 },
  'BR-7': { file: 'vid/BR-7-rusty-gears.mp4', off: 0 },
  'BR-8': { file: 'vid/BR-8-boardroom.mp4', off: 0 },
  'BR-9': { file: 'vid/BR-9-cloud-ascent.mp4', off: 1.4 },
  'BR-10': { file: 'vid/BR-10-earth-network.mp4', off: 0 },
  'BR-11': { file: 'vid/BR-11-rail-junction.mp4', off: 0.85 },
  'BR-12': { file: 'vid/BR-12-purple-stage.mp4', off: 1.0 },
};
const STILL: Record<string, string> = {
  'IMG-1': 'img/IMG-1-kaspa-coin-teal-backwards-k.png',
  'IMG-2': 'img/IMG-2-dark-armored-knight.png',
  'IMG-4': 'img/IMG-4-bitcoin-museum-relic.png',
  'IMG-5': 'img/IMG-5-velvet-token-coin.png',
  'IMG-6': 'img/IMG-6-lab-token-flask-coin.png',
  'IMG-7': 'img/IMG-7-coin-cascade-momentum.png',
};
/**
 * Receipts render FULL WIDTH, top-aligned and readable (comp-build §4) — every page capture here
 * is taller than 16:9, so `cover` fits the width and `pos` picks which band of the page is on
 * screen (start% -> end%, i.e. the read). A narrow portrait panel instead fits by HEIGHT so it is
 * never upscaled into mush. R(article) receipts carry the mandatory reading move; R(other)
 * captures stay quieter (broll-and-containers.md "Cover STYLE devices" §1/§2).
 */
type Receipt = {
  file: string; video?: boolean; fit?: 'width' | 'height';
  pos?: [number, number]; zoom?: [number, number];
  /** SINGLE-IMAGE MOTION MOVE (broll-and-containers.md "Cover STYLE devices" §2): a library camera-move
   *  run with the SAME image on both sides, so nothing is revealed, the frame itself moves. ONE move per
   *  article. Safe for the render because a still is one request, unlike a video-backed transition. */
  libMove?: string;
};
const RECEIPT: Record<string, Receipt> = {
  'R1': { file: 'receipts/R1-github-release-v2.0.0.png', fit: 'width', pos: [8, 24], zoom: [1.0, 1.06] },
  'R2': { file: 'receipts/R2-explorer-kaspa-blocks.mp4', video: true },
  // R3 is the video's ONE library motion move (Mike picked Motion · 3D Pan 1 · Down, 2026-07-25).
  // Chosen over R6, which already has a working reading pan; R3 only had a flat zoom, so the move adds
  // motion where there was none. A downward pan also suits a paper: it reads title into abstract.
  'R3': { file: 'receipts/R3-dagknight-paper-title.png', fit: 'width', pos: [4, 14], libMove: 'motion-3d-pan-1-down' },
  'R4': { file: 'receipts/R4-rusty-kaspa-commits-scroll.mp4', video: true },
  'R5': { file: 'receipts/R5-cmc-kaspa-supply.png', fit: 'height', zoom: [1.0, 1.05] },
  'R6': { file: 'receipts/R6-alpenglow-anza.png', fit: 'width', pos: [10, 34] },
  'R7': { file: 'receipts/R7-cryptorich-products.png', fit: 'width', pos: [3, 24], zoom: [1.0, 1.09] },
};

// ─── the COVER track ─────────────────────────────────────────────────────────
// ing: 'x' xfade+scale (quiet default) · 'f' b-roll fade · 'cut' smash · 'lib' a library
// transition owns the ingress (see LIBCUTS) · 'sw' state swap (cross-fade only, no re-ingress).
// kind: 'deck' is the rich ANCHOR slide/diagram, shown ONCE; 'container' is a spotlight
// break-up of it (⛔ THE BALANCE, broll-and-containers.md — the two must coexist).
export type Ing = 'x' | 'f' | 'cut' | 'lib' | 'sw';
export type Cover = {
  tIn: number; tOut: number; kind: 'deck' | 'container' | 'chart' | 'still' | 'vid' | 'receipt';
  ref: string; state?: string; ing?: Ing; lead?: boolean; cap?: boolean;
};

// card-40bps-open is a TITLE SLIDE over a BlockDAG node mesh — zero card-boxes. The mesh's
// nodes+edges dilate into one blob next to the headline blob, which is the node-graphic false
// positive the DIAGRAM exemption is for, not a two-card whole-slide crop.
// DIAGRAM_REFS: c4-left, c4-right, d-dag, card-40bps-open
// COMPARISON_REFS: compare-solana-kaspa
// (end declared refs)
export const COVERS: Cover[] = [
  // ── CH1 THE TARGET
  { tIn: 4.70, tOut: 11.70, kind: 'deck', ref: 'card-40bps-open', state: 'base', ing: 'lib' },
  { tIn: 11.70, tOut: 15.66, kind: 'receipt', ref: 'R2', ing: 'x' },
  { tIn: 15.66, tOut: 20.90, kind: 'deck', ref: 'card-fastest-pow', state: 'base', ing: 'x' },
  { tIn: 20.90, tOut: 32.40, kind: 'chart', ref: 'H1', ing: 'lib' },
  { tIn: 38.53, tOut: 42.50, kind: 'vid', ref: 'BR-1', ing: 'lib' },
  { tIn: 42.50, tOut: 46.06, kind: 'vid', ref: 'BR-2', ing: 'f' },
  { tIn: 46.06, tOut: 50.06, kind: 'vid', ref: 'BR-3', ing: 'f' },
  { tIn: 50.06, tOut: 52.81, kind: 'still', ref: 'IMG-1', ing: 'lib' },
  // ── CH2 THE UPGRADE LADDER   (card pause @52.81)
  { tIn: 52.81, tOut: 75.26, kind: 'chart', ref: 'C1', ing: 'x' },
  { tIn: 75.26, tOut: 79.74, kind: 'receipt', ref: 'R1', ing: 'x' },
  { tIn: 79.74, tOut: 83.30, kind: 'container', ref: 'toccata-features', state: 's1', ing: 'x' },
  { tIn: 83.30, tOut: 84.90, kind: 'container', ref: 'toccata-features', state: 's2', ing: 'sw' },
  { tIn: 84.90, tOut: 88.38, kind: 'container', ref: 'toccata-features', state: 's3', ing: 'sw' },
  { tIn: 88.38, tOut: 94.66, kind: 'deck', ref: 'card-negation', state: 'base', ing: 'x' },
  { tIn: 94.66, tOut: 97.88, kind: 'chart', ref: 'C1', ing: 'x' },
  { tIn: 97.88, tOut: 101.50, kind: 'vid', ref: 'BR-11', ing: 'f' },
  { tIn: 101.50, tOut: 107.93, kind: 'chart', ref: 'C1', ing: 'f' },
  { tIn: 112.37, tOut: 116.30, kind: 'still', ref: 'IMG-2', ing: 'lib' },
  { tIn: 116.30, tOut: 120.00, kind: 'deck', ref: 'd-dag', state: 'base', ing: 'x' },
  { tIn: 120.00, tOut: 121.78, kind: 'container', ref: 'd-dag', state: 'highlight', ing: 'sw' },
  { tIn: 121.78, tOut: 137.0667, kind: 'chart', ref: 'C1', ing: 'x' },
  // ── CH3 DAGKNIGHT   (card pause @137.0667)
  { tIn: 137.0667, tOut: 142.82, kind: 'deck', ref: 'card-dagknight-intro', state: 'base', ing: 'x' },
  { tIn: 142.82, tOut: 148.98, kind: 'receipt', ref: 'R3', ing: 'x' },
  { tIn: 148.98, tOut: 152.80, kind: 'deck', ref: 'c4-left', state: 'full', ing: 'x' },
  { tIn: 152.80, tOut: 159.40, kind: 'container', ref: 'c4-left', state: 'title', ing: 'sw' },
  { tIn: 159.40, tOut: 161.90, kind: 'container', ref: 'c4-left', state: 'box', ing: 'sw' },
  { tIn: 161.90, tOut: 170.30, kind: 'container', ref: 'c4-left', state: 'guess', ing: 'sw' },
  { tIn: 170.30, tOut: 171.92, kind: 'container', ref: 'c4-left', state: 'readout', ing: 'sw' },
  { tIn: 171.92, tOut: 176.90, kind: 'vid', ref: 'BR-4', ing: 'f', lead: true },
  { tIn: 176.90, tOut: 181.66, kind: 'vid', ref: 'BR-5', ing: 'cut', lead: true },
  { tIn: 181.66, tOut: 184.97, kind: 'vid', ref: 'BR-6', ing: 'f' },
  { tIn: 191.30, tOut: 194.80, kind: 'container', ref: 'c4-left', state: 'pulse', ing: 'lib' },
  { tIn: 194.80, tOut: 200.90, kind: 'deck', ref: 'c4-right', state: 'full', ing: 'lib' },
  { tIn: 200.90, tOut: 212.60, kind: 'container', ref: 'c4-right', state: 'readout', ing: 'sw' },
  { tIn: 212.60, tOut: 217.36, kind: 'deck', ref: 'card-security-50', state: 'base', ing: 'x' },
  { tIn: 217.36, tOut: 227.77, kind: 'chart', ref: 'FIN', ing: 'x' },
  // F5 community plug — overlays ON the face (deliberate: cap flags the caption overlap)
  { tIn: 268.80, tOut: 271.50, kind: 'still', ref: 'IMG-5', ing: 'lib', cap: true },
  { tIn: 271.60, tOut: 275.55, kind: 'still', ref: 'IMG-6', ing: 'lib', cap: true },
  { tIn: 275.80, tOut: 279.75, kind: 'still', ref: 'IMG-7', ing: 'lib', cap: true },
  { tIn: 291.40, tOut: 305.07, kind: 'receipt', ref: 'R7', ing: 'x', cap: true },
  { tIn: 305.07, tOut: 321.50, kind: 'chart', ref: 'C1', ing: 'x' },
  // ── CH4 WHAT 40 UNLOCKS
  { tIn: 326.27, tOut: 347.32, kind: 'chart', ref: 'C2', ing: 'x' },
  { tIn: 347.32, tOut: 373.26, kind: 'chart', ref: 'C3', ing: 'lib' },
  { tIn: 373.26, tOut: 376.50, kind: 'vid', ref: 'BR-12', ing: 'f' },
  { tIn: 376.50, tOut: 382.38, kind: 'receipt', ref: 'R6', ing: 'x' },
  { tIn: 382.38, tOut: 387.50, kind: 'deck', ref: 'compare-solana-kaspa', state: 'base', ing: 'x' },
  { tIn: 387.50, tOut: 388.90, kind: 'container', ref: 'compare-solana-kaspa', state: 's1', ing: 'sw' },
  { tIn: 388.90, tOut: 390.10, kind: 'container', ref: 'compare-solana-kaspa', state: 's2', ing: 'sw' },
  { tIn: 390.10, tOut: 391.30, kind: 'container', ref: 'compare-solana-kaspa', state: 's3', ing: 'sw' },
  { tIn: 391.30, tOut: 392.30, kind: 'container', ref: 'compare-solana-kaspa', state: 's4', ing: 'sw' },
  { tIn: 394.90, tOut: 397.36, kind: 'deck', ref: 'stamp-subsecond', state: 'base', ing: 'lib' },
  { tIn: 397.36, tOut: 398.70, kind: 'deck', ref: 'card-honest-target', state: 'base', ing: 'x' },
  { tIn: 398.70, tOut: 402.80, kind: 'container', ref: 'card-honest-target', state: 's1', ing: 'sw' },
  { tIn: 402.80, tOut: 405.00, kind: 'container', ref: 'card-honest-target', state: 's3', ing: 'sw' },
  { tIn: 405.00, tOut: 413.46, kind: 'receipt', ref: 'R4', ing: 'x' },
  // ── CH5 THE CLOSE
  { tIn: 413.46, tOut: 417.08, kind: 'vid', ref: 'BR-7', ing: 'f' },
  { tIn: 417.08, tOut: 419.94, kind: 'still', ref: 'IMG-4', ing: 'lib' },
  { tIn: 419.94, tOut: 423.94, kind: 'vid', ref: 'BR-8', ing: 'f' },
  { tIn: 423.94, tOut: 436.30, kind: 'chart', ref: 'C1', ing: 'lib' },
  { tIn: 436.30, tOut: 442.96, kind: 'receipt', ref: 'R5', ing: 'x' },
  { tIn: 442.96, tOut: 447.34, kind: 'vid', ref: 'BR-9', ing: 'f', lead: true },
  { tIn: 447.34, tOut: 452.33, kind: 'vid', ref: 'BR-10', ing: 'f', lead: true },
];

// ─── library transitions (TRANSITIONS.md) ────────────────────────────────────
// Every cut whose ingress is owned by the library: the 14 FACE cuts (blocks-max, rotating
// 1/2/3), the AI-still badsignal hits, and the reserved MELT/SPIN marquees.
export type LibCut = { at: number; id: string; from: 'face' | string; to: 'face' | string };
export const LIBCUTS: LibCut[] = [
  { at: 4.70, id: 'blocks-max-1', from: 'face', to: 'cover' },
  { at: 20.90, id: 'melt-rgb-1', from: 'cover', to: 'cover' },      // MARQUEE 1: stat card -> live H1
  { at: 32.40, id: 'blocks-max-2', from: 'cover', to: 'face' },
  { at: 38.53, id: 'blocks-max-3', from: 'face', to: 'cover' },
  { at: 50.06, id: 'badsignal-max-1', from: 'cover', to: 'cover' }, // IMG-1
  { at: 107.93, id: 'blocks-max-1', from: 'cover', to: 'face' },
  { at: 112.37, id: 'blocks-max-2', from: 'face', to: 'cover' },    // owns the IMG-2 ingress
  { at: 184.97, id: 'blocks-max-3', from: 'cover', to: 'face' },
  { at: 191.30, id: 'blocks-max-1', from: 'face', to: 'cover' },
  { at: 194.80, id: 'melt-rgb-1', from: 'cover', to: 'cover' },     // MARQUEE 2: C4 LEFT -> RIGHT
  { at: 227.77, id: 'blocks-max-2', from: 'cover', to: 'face' },
  { at: 268.80, id: 'badsignal-max-2', from: 'face', to: 'cover' }, // plug overlays, on the face
  { at: 271.60, id: 'badsignal-short-2', from: 'face', to: 'cover' },
  { at: 275.80, id: 'badsignal-short-3', from: 'face', to: 'cover' },
  { at: 305.07, id: 'blocks-max-3', from: 'face', to: 'cover' },
  { at: 321.50, id: 'blocks-max-1', from: 'cover', to: 'face' },
  { at: 326.27, id: 'blocks-max-2', from: 'face', to: 'cover' },
  { at: 347.32, id: 'spin-3d-side-ease-short-right', from: 'cover', to: 'cover' }, // MARQUEE 3: C2 -> C3
  { at: 392.30, id: 'blocks-max-3', from: 'cover', to: 'face' },
  { at: 394.90, id: 'blocks-max-1', from: 'face', to: 'cover' },
  { at: 417.08, id: 'badsignal-short-1', from: 'cover', to: 'cover' }, // IMG-4
  { at: 423.94, id: 'spin-3d-side-ease-up', from: 'cover', to: 'cover' }, // MARQUEE 4: strawmen -> C1
  { at: 452.33, id: 'blocks-max-2', from: 'cover', to: 'face' },
];

// ─── cover rendering ─────────────────────────────────────────────────────────
const CoverEl: React.FC<{ c: Cover; ts: number }> = ({ c, ts }) => {
  const age = ts - c.tIn;
  switch (c.kind) {
    case 'chart': {
      if (c.ref === 'C1') return <C1 ts={ts} />;
      if (c.ref === 'H1') return <H1 ts={ts} />;
      if (c.ref === 'C2') return <C2 ts={ts} />;
      if (c.ref === 'C3') return <C3 ts={ts} />;
      return <FIN ts={ts} />;
    }
    case 'deck':
    case 'container': {
      const key = `${c.ref}:${c.state}`;
      const file = STATEFILE[key] ?? SLIDE[c.ref];
      const spot = SPOT[key];
      if (spot) {
        // comp-level sub-spotlight on a SYSTEM-DESIGN still (no baked animation in the asset)
        const [fx0, fy0, sc0] = spot;
        const prog = ip(ts, [c.tIn, c.tOut], [0, 1]);
        const to = MOTION[key];
        const fx = to ? fx0 + (to[0] - fx0) * prog : fx0;
        const fy = to ? fy0 + (to[1] - fy0) * prog : fy0;
        // a still is never allowed to sit dead still: it either travels to its MOTION target or
        // gets a gentle push scaled to how long it holds
        const sc = to ? sc0 + (to[2] - sc0) * prog : sc0 * (1 + 0.045 * prog);
        const dim = sc > 1.05 ? 1 : 0;
        // packets ride INSIDE the spotlight transform so they track every push and move with the mesh
        const packets = c.ref === 'c4-left' ? 'left' : c.ref === 'c4-right' ? 'right' : null;
        return (
          <AbsoluteFill style={{ backgroundColor: '#0a0c10', overflow: 'hidden' }}>
            <AbsoluteFill style={{ transform: `scale(${sc})`, transformOrigin: `${fx * 100}% ${fy * 100}%` }}>
              <Img src={staticFile(file)} style={fill} />
              {packets ? <C4Packets state={packets} ts={ts} tIn={c.tIn} tOut={c.tOut} /> : null}
            </AbsoluteFill>
            {dim ? (
              <AbsoluteFill style={{
                background: `radial-gradient(ellipse 62% 62% at ${fx * 100}% ${fy * 100}%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)`,
              }} />
            ) : null}
          </AbsoluteFill>
        );
      }
      // A slide sub-line landing is an EMPHASIS pulse, never a visibility toggle
      // (slide-builder rule: "spotlight adds emphasis, does not toggle visibility").
      const pulse = c.ref === 'card-40bps-open' ? 1 + 0.012 * Math.max(0, 1 - Math.abs(ts - 9.50) / 0.6) : 1;
      return <Img src={staticFile(file)} style={{ ...fill, transform: `scale(${pulse})` }} />;
    }
    case 'still': {
      // Stills are 1672x941, so the drift stays modest or the upscale goes soft. IMG-2 gets an
      // even smaller move: pushing in on the knight's helmet crest is what would start reading
      // as bat ears, and the visual-qa pass cleared the shot only at this framing.
      const z = c.ref === 'IMG-2' ? [1.02, 1.05] : [1.04, 1.10];
      const kb = ip(age, [0, c.tOut - c.tIn], z);
      return <Img src={staticFile(STILL[c.ref])} style={{ ...fill, transform: `scale(${kb})` }} />;
    }
    case 'vid': {
      const b = BROLL[c.ref];
      return (
        <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: '#000' }}>
          <OffthreadVideo
            src={staticFile(b.file)}
            startFrom={Math.round(b.off * FPS)}
            playbackRate={b.rate ?? 1}
            muted
            style={{ ...fill, ...(b.fit ? { transform: b.fit } : {}) }}
          />
        </AbsoluteFill>
      );
    }
    case 'receipt': {
      const r = RECEIPT[c.ref];
      if (r.video) return <OffthreadVideo src={staticFile(r.file)} muted style={fill} />;
      const dur = c.tOut - c.tIn;
      const z = r.zoom ? ip(age, [0, dur], r.zoom) : 1;
      if (r.fit === 'height') {
        return (
          <AbsoluteFill style={{ backgroundColor: '#0a0c10', overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}>
            <Img src={staticFile(r.file)} style={{ height: '100%', width: 'auto', transform: `scale(${z})` }} />
          </AbsoluteFill>
        );
      }
      const y = r.pos ? ip(age, [0, dur], r.pos) : 0;
      const plate = () => (
        <Img
          src={staticFile(r.file)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `center ${y}%`, transform: `scale(${z})` }}
        />
      );
      if (r.libMove) {
        const row = getTransition(r.libMove);
        const win = row ? framesForRow(row, FPS) : 0;
        // same image both sides: the move IS the effect, nothing is revealed and no cut is implied
        return (
          <AbsoluteFill style={{ backgroundColor: '#0a0c10', overflow: 'hidden' }}>
            <TransitionClip id={r.libMove} cutFrame={Math.round(win / 2)} outgoing={plate} incoming={plate} />
          </AbsoluteFill>
        );
      }
      return (
        <AbsoluteFill style={{ backgroundColor: '#0a0c10', overflow: 'hidden' }}>
          {plate()}
        </AbsoluteFill>
      );
    }
  }
};

/**
 * Ingress/egress envelope.
 * A library-owned cut gets no envelope at all (the engine owns that frame).
 * When the next cover butts straight up against this one, this cover does NOT fade out —
 * it holds and the next one fades in ON TOP of it. Fading both would open a hole to the
 * black spine for a frame or two, which is the classic back-to-back-cover flash.
 */
const coverEnvelope = (c: Cover, ts: number, nextIsLib: boolean, contiguous: boolean) => {
  const inD = c.ing === 'sw' ? 0.25 : 0.35;
  const opIn = c.ing === 'lib' || c.ing === 'cut' ? 1 : ip(ts, [c.tIn, c.tIn + inD], [0, 1]);
  const opOut = nextIsLib || contiguous ? 1 : ip(ts, [c.tOut - 0.25, c.tOut], [1, 0]);
  const scale = c.ing === 'x' ? ip(ts, [c.tIn, c.tIn + 0.35], [0.93, 1], ease) : 1;
  return { opacity: Math.min(opIn, opOut), scale };
};

/** How this cover hands over to the next one. */
const handover = (c: Cover) => {
  const nextIsLib = LIBCUTS.some((L) => Math.abs(L.at - c.tOut) < 0.01);
  const next = COVERS.find((x) => x.tIn >= c.tOut - 0.01);
  const contiguous =
    !nextIsLib && !!next && next.tIn - c.tOut < 0.05 && next.ing !== 'cut';
  // hold under the incoming cross-fade so the spine never flashes through between covers
  const tail = contiguous ? Math.round(0.35 * FPS) : 0;
  return { nextIsLib, contiguous, tail };
};

// ─── C4 packet animation ─────────────────────────────────────────────────────
/**
 * The C4 mesh held for 17.8s (RIGHT) and 23s (LEFT) as a dead-still PNG (Mike, 2026-07-25: "it is a
 * static diagram for up to 15 seconds"). These are the REAL link coordinates from `diagrams/c4.html`
 * (same 1920x1080 viewBox as the comp), so packets ride the actual edges and the locked artwork stays
 * pixel-identical underneath — no re-render of the diagram, no AI footage garbling the labels.
 *
 * The motion argues the point rather than just moving:
 *  - GHOSTDAG (left) crawls at ONE fixed rate the whole time. That IS the hardcoded worst-case guess.
 *  - DAGKnight (right) starts at that same crawl, then ADAPTS to what he is saying: it opens up on
 *    "the chain runs faster" (207.5), throttles back on "conditions change" (208.8), and recovers on
 *    "it adjusts and it does it on its own" (210.5).
 * This promotes C4 from a Type 2 (static system-design) chart to a Type 1 animated one.
 */
const C4_EDGES: [number, number, number, number][] = [
  [790, 515, 930, 360], [790, 515, 950, 650], [790, 515, 1090, 490], [930, 360, 1150, 290],
  [930, 360, 1090, 490], [950, 650, 1090, 490], [950, 650, 1200, 720], [1090, 490, 1290, 545],
  [1150, 290, 1370, 380], [1200, 720, 1430, 690], [1290, 545, 1370, 380], [1290, 545, 1430, 690],
  [1290, 545, 1530, 510], [1370, 380, 1590, 300], [1430, 690, 1650, 670], [1530, 510, 1590, 300],
  [1530, 510, 1650, 670], [1530, 510, 1750, 455], [1590, 300, 1750, 455], [1650, 670, 1750, 455],
];
/** cumulative packet travel (in edge-lengths) — the SLOPE is the speed, so the words set the pace. */
const C4_PHASE_RIGHT: [number, number][] = [
  [194.80, 0.00],   // inherited crawl: the guess has just been deleted
  [200.90, 1.83],   // "the protocol measures the real network"
  [205.50, 3.61],   // "...and adapts to it"
  [206.80, 4.13],   // "the internet's fast, great"
  [207.50, 4.55],
  [208.60, 6.20],   // "THE CHAIN RUNS FASTER"
  [209.20, 6.65],   // "conditions change, okay" -> throttle back
  [210.40, 7.05],
  [211.20, 7.60],   // "it adjusts..."
  [212.60, 9.60],   // "...and it does it on its own"
];
const c4Phase = (state: 'left' | 'right', ts: number) => {
  if (state === 'left') return 0.30 * (ts - 148.98);      // never changes, by design
  const K = C4_PHASE_RIGHT;
  if (ts <= K[0][0]) return K[0][1];
  for (let i = 1; i < K.length; i++) {
    if (ts <= K[i][0]) return ip(ts, [K[i - 1][0], K[i][0]], [K[i - 1][1], K[i][1]]);
  }
  return K[K.length - 1][1] + 1.35 * (ts - K[K.length - 1][0]);
};

const C4Packets: React.FC<{ state: 'left' | 'right'; ts: number; tIn: number; tOut: number }> = ({ state, ts, tIn, tOut }) => {
  const p = c4Phase(state, ts);
  const col = state === 'left' ? '#00c2ff' : '#00e68a';
  const op = ip(ts, [tIn, tIn + 0.6, tOut - 0.4, tOut], [0, 1, 1, 0]);
  if (op <= 0) return null;
  return (
    <AbsoluteFill style={{ opacity: op, pointerEvents: 'none' }}>
      <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        {C4_EDGES.map(([x1, y1, x2, y2], i) => {
          const u = ((p + i * 0.137) % 1 + 1) % 1;
          const ut = Math.max(0, u - 0.11);
          const x = x1 + (x2 - x1) * u, y = y1 + (y2 - y1) * u;
          const xt = x1 + (x2 - x1) * ut, yt = y1 + (y2 - y1) * ut;
          return (
            <g key={i}>
              <line x1={xt} y1={yt} x2={x} y2={y} stroke={col} strokeWidth={3.5} strokeLinecap="round" opacity={0.45} />
              <circle cx={x} cy={y} r={12} fill={col} opacity={0.16} />
              <circle cx={x} cy={y} r={5} fill={col} opacity={0.95} />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

export const LINE_CAPTION = { ref: 'BR-11', text: 'TWO HARD FORKS IN A SINGLE YEAR' };

/**
 * LT-LINK — the plug's lower-third. Documented in EDIT-PLAN CH3 and the CUE-SHEET inserts list, but
 * it fell out of the first build entirely (caught by visual-qa 2026-07-25). It is load-bearing: the
 * caption at 288.9 reads "description below" while he says it, with nothing on screen backing it.
 * Timed to that line rather than to the top of the plug, and it sits over the bare face (the plug
 * overlays IMG-5/6/7 and R7 do not overlap this window).
 */
export const LT_LINK = { tIn: 286.6, tOut: 294.4, text: 'LINK IN THE DESCRIPTION' };

const LowerThird: React.FC<{ ts: number }> = ({ ts }) => {
  if (ts < LT_LINK.tIn || ts > LT_LINK.tOut) return null;
  const op = ip(ts, [LT_LINK.tIn, LT_LINK.tIn + 0.35, LT_LINK.tOut - 0.4, LT_LINK.tOut], [0, 1, 1, 0]);
  const dx = ip(ts, [LT_LINK.tIn, LT_LINK.tIn + 0.5], [-60, 0], ease);
  return (
    <AbsoluteFill style={{ zIndex: 380, pointerEvents: 'none', opacity: op }}>
      <div style={{
        position: 'absolute', left: 96, bottom: 210, transform: `translateX(${dx}px)`,
        display: 'flex', alignItems: 'stretch',
        background: 'rgba(10,12,16,0.86)', borderRadius: 10,
        boxShadow: '0 10px 40px rgba(0,0,0,0.6)', overflow: 'hidden',
      }}>
        <div style={{ width: 8, background: 'linear-gradient(180deg,#00e68a,#00c2ff)' }} />
        <div style={{ padding: '18px 34px 18px 26px' }}>
          <div style={{
            fontFamily: MONT, fontWeight: 900, fontSize: 44, letterSpacing: '0.06em',
            color: '#e8eaf0', textTransform: 'uppercase', lineHeight: 1,
          }}>
            {LT_LINK.text}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── chapter card (the one per-video pick: a 3D cube turn) ───────────────────
/**
 * ⛔ A chapter title must be FULLY READABLE for at least 1 second (Mike, 2026-07-25: the card was
 * "shown so fast, in under a second, that some people will hardly notice it").
 * The baked spine pause is only 1s and the cube turn eats ~0.4s of it, so the card scene now starts
 * `lead` seconds BEFORE the pause, over the outgoing cover, and holds through it. CH3 leads by 2.55s
 * so it comes up as he asks "so what actually is DAGKnight" and the title answers the question.
 */
export const CARD_TURN = 11;           // frames of cube rotation
export const CARDS: { t: number; title: string; eyebrow: string; lead: number }[] = [
  { t: 52.81, title: 'THE UPGRADE LADDER', eyebrow: 'CHAPTER TWO', lead: 1.0 },
  { t: 137.0667, title: 'DAGKNIGHT', eyebrow: 'CHAPTER THREE', lead: 2.55 },
];
/**
 * Fail at MODULE LOAD if any slide/diagram row cannot resolve to a file. Adding a spotlight state
 * without its STATEFILE entry passed every linter and then threw `undefined was passed to
 * staticFile()` 25 minutes into a render (2026-07-25). Cheap assertion, expensive omission.
 */
COVERS.filter((c) => c.kind === 'deck' || c.kind === 'container').forEach((c) => {
  if (!(STATEFILE[`${c.ref}:${c.state}`] ?? SLIDE[c.ref])) {
    throw new Error(`cover "${c.ref}" state "${c.state}" @${c.tIn}s resolves to no file — add it to STATEFILE or SLIDE`);
  }
});

/** Readable seconds = lead + pause - turn. Both must clear 1.0s. */
CARDS.forEach((c) => {
  const readable = c.lead + PAUSE - CARD_TURN / FPS;
  if (readable < 1.0) throw new Error(`chapter card "${c.title}" is readable for only ${readable.toFixed(2)}s (min 1.0s)`);
});

const CubeCard: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
  const f = useCurrentFrame();          // 0 = card ingress, holds to the end of the baked pause
  const rot = ip(f, [0, CARD_TURN], [90, 0], Easing.out(Easing.cubic));
  const dep = ip(f, [0, CARD_TURN], [520, 0], Easing.out(Easing.cubic));
  return (
    <AbsoluteFill style={{ perspective: 1800, backgroundColor: 'transparent' }}>
      <AbsoluteFill
        style={{
          transform: `translateZ(${-dep}px) rotateY(${rot}deg)`,
          transformOrigin: '50% 50%',
          backgroundColor: '#0a0c10',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          backfaceVisibility: 'hidden',
        }}
      >
        <div style={{
          position: 'absolute', width: 900, height: 900, borderRadius: '50%', filter: 'blur(150px)',
          background: '#00e68a', opacity: 0.16, left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
        }} />
        <div style={{
          fontFamily: MONT, fontWeight: 900, fontSize: 26, letterSpacing: '0.34em',
          color: '#505a6e', marginBottom: 30, zIndex: 1,
        }}>
          {eyebrow}
        </div>
        <div style={{
          fontFamily: MONT, fontWeight: 900, fontSize: 116, letterSpacing: '0.02em',
          color: '#e8eaf0', textAlign: 'center', lineHeight: 1.04, zIndex: 1,
          textShadow: '0 0 70px rgba(0,230,138,0.35)',
        }}>
          {title}
        </div>
        <div style={{
          width: ip(f, [8, 26], [0, 460]), height: 5, marginTop: 40, zIndex: 1,
          background: 'linear-gradient(90deg,#00e68a,#00c2ff)', borderRadius: 3,
        }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── captions (skills/captions — style copied verbatim from the builder) ─────
const CAPS = ZCAPTIONS.map((c) => ({ tf: sh(c.t), h: c.h }));

const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const src = unsh(t);
  if (!CAPTION_SRC.some(([a, b]) => src >= a && src < b)) return null;
  let cur: { tf: number; h: string } | null = null;
  let next = Infinity;
  for (const c of CAPS) {
    if (c.tf <= t) cur = c;
    else { next = c.tf; break; }
  }
  if (!cur) return null;
  if (t >= Math.min(next, cur.tf + 1.3)) return null;
  const age = frame - Math.round(cur.tf * FPS);
  const scale = ip(age, [0, 4, 9], [0.7, 1.12, 1], ease);
  return (
    <AbsoluteFill style={{ zIndex: 400, pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', bottom: 96, left: 80, right: 80,
        display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
      }}>
        <div style={{
          fontFamily: `${MONT},'Arial Black','Segoe UI',sans-serif`,
          fontWeight: 900, fontSize: 78, color: '#fff',
          textTransform: 'lowercase', textAlign: 'center', lineHeight: 1.06,
          WebkitTextStroke: '12px #000', paintOrder: 'stroke fill' as any,
          transform: `scale(${scale})`,
        }}>
          {cur.h}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── light leak overlay (overlays.md §1) ─────────────────────────────────────
const LightLeak: React.FC<{ a: number; b: number; ts: number }> = ({ a, b, ts }) => {
  if (ts < a || ts > b) return null;
  const p = (ts - a) / (b - a);
  const op = Math.sin(Math.PI * p) * 0.3;
  const drift = ip(p, [0, 1], [-14, 16]);
  return (
    <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: op, pointerEvents: 'none' }}>
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse 70% 90% at ${64 + drift}% ${30 + drift * 0.6}%, rgba(255,178,92,0.85) 0%, rgba(255,120,40,0.34) 38%, rgba(0,0,0,0) 72%)`,
      }} />
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse 46% 60% at ${18 - drift * 0.5}% ${72 - drift * 0.4}%, rgba(255,214,150,0.5) 0%, rgba(0,0,0,0) 66%)`,
      }} />
    </AbsoluteFill>
  );
};

// ─── library-transition placement ────────────────────────────────────────────
/** Renders ONLY the engine window (cutFrame == win/2 => no clean head/tail copies),
 *  so the underlying layers stay the single source of truth outside the window. */
const LiveCover: React.FC<{ c: Cover }> = ({ c }) => {
  const abs = React.useContext(AbsFrameCtx);
  // clamp into the cover's own window so a chart never renders its pre-IN empty state
  const raw = unsh(abs / FPS);
  const ts = Math.min(Math.max(raw, c.tIn), c.tOut - 0.01);
  return <CoverEl c={c} ts={ts} />;
};

/** The spine, in sync no matter which nested Sequence re-mounts it. */
const SpineAt: React.FC = () => {
  const abs = React.useContext(AbsFrameCtx);
  const local = useCurrentFrame();
  return <OffthreadVideo src={staticFile('spine.mp4')} startFrom={abs - local} muted style={fill} />;
};

/**
 * A library transition whose scene is a VIDEO makes the engine fetch that clip's frame from dozens
 * of displaced copies at once; Remotion's proxy saturates and the render dies. It killed this render
 * three times, always on the SPIN out of BR-8. The engine only needs a picture to displace, so hand
 * it a pre-extracted STILL of the exact cut frame: identical on screen for a 0.88s turn, one request.
 */
const CUTFRAME: Record<string, string> = { 'BR-8': 'vid/BR-8-cutframe.jpg' };

const LibCutClip: React.FC<{ cut: LibCut }> = ({ cut }) => {
  const row = getTransition(cut.id);
  if (!row) return null;
  const win = framesForRow(row, FPS);
  const half = Math.round(win / 2);
  // An engine does NOT swap A->B at the middle of its window: it buries the swap at its own peak
  // (GlitchBlocks at `opacityPeak`, the shader/geometric engines at `cut`), all of which are ~0.32,
  // not 0.5. Starting the window at cut-win/2 therefore lands every cut ~0.15s EARLY — which also
  // dragged a caption onto the incoming cover for those frames. Offset by the engine's real swap
  // point so the cut lands on the beat it was planned for.
  const p = row.params as { cut?: number; opacityPeak?: number };
  const swapFrac = p?.cut ?? p?.opacityPeak ?? 0.5;
  const start = F(cut.at) - Math.round(win * swapFrac);

  const before = COVERS.filter((c) => c.tOut <= cut.at + 0.01).slice(-1)[0];
  const after = COVERS.find((c) => c.tIn >= cut.at - 0.01);
  const nodeFor = (side: 'from' | 'to') => {
    if (cut[side] === 'face') return () => <SpineAt />;
    const c = side === 'from' ? before : after;
    if (!c) return () => <AbsoluteFill style={{ backgroundColor: '#0a0c10' }} />;
    const frozen = c.kind === 'vid' ? CUTFRAME[c.ref] : undefined;
    if (frozen) return () => <Img src={staticFile(frozen)} style={fill} />;
    return () => <LiveCover c={c} />;
  };

  return (
    <Sequence from={start} durationInFrames={win + 12} layout="none">
      <TransitionClip id={cut.id} cutFrame={half} outgoing={nodeFor('from')} incoming={nodeFor('to')} />
    </Sequence>
  );
};

// ─── the composition ─────────────────────────────────────────────────────────
export const Kaspa40Bps: React.FC = () => {
  const frame = useCurrentFrame();
  const tp = frame / FPS;            // paused-spine seconds
  const ts = unsh(tp);               // SOURCE seconds — everything is authored in these
  const sc = spineScale(ts);
  const inPause = CARDS.some((c) => tp >= cardStart(c.t) && tp < cardStart(c.t) + PAUSE);

  return (
    <AbsFrameCtx.Provider value={frame}>
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* 1 — the locked spine (face baked, COVER beats black), with punch-in re-frames */}
      <AbsoluteFill style={{ transform: `scale(${sc})`, overflow: 'hidden' }}>
        {/* The RAW master is PILLARBOXED: the camera content sits at x 82..1837 inside the 1920
            frame, so `cover` alone leaves an 82px black bar down each side of every FACE beat.
            Scale the spine (and only the spine — the F1 swap clip already fills) by 1920/1756 to
            push the bars off frame. Costs ~2.3% off the top and bottom, which is empty headroom. */}
        <OffthreadVideo src={staticFile('spine.mp4')} style={{ ...fill, transform: 'scale(1.0934)' }} />
        {/* F1 opener airs as the Higgsfield background swap; spine audio is kept.
            Aligned via the clip's 0.4s head handle: swap t=0.4 == spine t=0. */}
        <Sequence from={0} durationInFrames={F(4.70)} layout="none">
          <AbsoluteFill>
            <OffthreadVideo src={staticFile('vid/F1-higgsfield-bg-swap.mp4')} startFrom={12} muted style={fill} />
          </AbsoluteFill>
        </Sequence>
      </AbsoluteFill>

      {/* 2 — light leaks: UNDER all cover, so they only ever warm the bare face */}
      {LEAKS.map(([a, b], i) => <LightLeak key={i} a={a} b={b} ts={ts} />)}

      {/* 3 — the COVER track (containers/charts/receipts first, b-roll punches through on top) */}
      {COVERS.map((c, i) => {
        const { nextIsLib, contiguous, tail } = handover(c);
        const dur = F(c.tOut) - F(c.tIn) + tail;
        if (dur <= 0) return null;
        return (
          <Sequence key={i} from={F(c.tIn)} durationInFrames={dur} layout="none">
            <CoverWrap c={c} nextIsLib={nextIsLib} contiguous={contiguous} />
          </Sequence>
        );
      })}

      {/* 4 — library transitions (14 face cuts + AI-still hits + the 2 MELT / 2 SPIN marquees) */}
      {LIBCUTS.map((cut, i) => <LibCutClip key={i} cut={cut} />)}

      {/* 5 — chapter title cards: self-contained scenes inside the baked 1s pause */}
      {CARDS.map((c, i) => (
        <Sequence
          key={i}
          from={Math.round((cardStart(c.t) - c.lead) * FPS)}
          durationInFrames={Math.round((c.lead + PAUSE) * FPS)}
          layout="none"
        >
          <CubeCard title={c.title} eyebrow={c.eyebrow} />
        </Sequence>
      ))}

      {/* 5b — LT-LINK lower-third over the plug (under the captions, over the bare face) */}
      <LowerThird ts={ts} />

      {/* 6 — captions, TOPMOST, FACE windows only (never over a cover; the plug overlays are
             the one deliberate exception and are flagged cap:true) */}
      {!inPause && <Captions />}
    </AbsoluteFill>
    </AbsFrameCtx.Provider>
  );
};

/** Wrapper so a cover can read the SOURCE clock while living inside its own Sequence. */
const CoverWrap: React.FC<{ c: Cover; nextIsLib: boolean; contiguous: boolean }> = ({ c, nextIsLib, contiguous }) => {
  const ts = unsh(React.useContext(AbsFrameCtx) / FPS);
  const env = coverEnvelope(c, ts, nextIsLib, contiguous);
  return (
    <AbsoluteFill style={{ opacity: env.opacity, transform: `scale(${env.scale})` }}>
      <CoverEl c={c} ts={ts} />
      {LINE_CAPTION.ref === c.ref && (
        <div style={{
          position: 'absolute', left: 96, bottom: 92, width: 1000,
          fontFamily: `${MONT},'Arial Black',sans-serif`, fontWeight: 900,
          fontSize: 62, lineHeight: 1.08, color: '#fff', textTransform: 'uppercase',
          letterSpacing: '-0.01em',
          WebkitTextStroke: '10px #000', paintOrder: 'stroke fill' as any,
          textShadow: '0 8px 34px rgba(0,0,0,0.9)',
          opacity: ip(ts, [c.tIn + 0.15, c.tIn + 0.5, c.tOut - 0.35, c.tOut - 0.1], [0, 1, 1, 0]),
          transform: `translateY(${ip(ts, [c.tIn + 0.15, c.tIn + 0.6], [26, 0], ease)}px)`,
        }}>
          {LINE_CAPTION.text}
        </div>
      )}
    </AbsoluteFill>
  );
};

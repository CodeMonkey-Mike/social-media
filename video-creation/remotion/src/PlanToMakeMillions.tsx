// PlanToMakeMillions.tsx: "The Crypto Strategy I'm Using to Make Millions by 2028" (longform-edited, 16:9, LIGHT containers).
// Built TO the approved blueprint: media/plan-to-make-millions/EDIT-PLAN.md (event log) · CUE-SHEET.md · TRANSITIONS.md +
// TRANSITION-PLAN.json (exact ids, tagged on every wired transition below) · COVER-PLAN.json · AS-RECORDED.md · PROJECT-LOG.md
// Open flags (city-look face swaps on all 8 FACE windows; captions on FACE 1-3 only; no on-screen 35X; no closing figure of
// 20% on the Nasdaq; whiteboard 24.14 s). Skill: longform-edited/skills/comp-build/comp-build.md (self-contained skeletons).
// The comp renders VIDEO + the spine's VO only: no music, no SFX, no watermark (section 9; mix_music.py owns the audio).
// Every cue below is a SOURCE-spine second (spine/ALL.e.enhanced.mp4) routed through sh() / F() (section 2 + 3d).
//
// DIAGRAM_REFS: D-RATES, D-ROTATE, C22, C22B, T-2028, D-IMAGINE
// COMPARISON_REFS: D-COMMON
// OVERVIEW_REFS: C26
// (end declared refs)
import React, { createContext, useContext } from 'react';
import {
  AbsoluteFill, Audio, Easing, Freeze, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame,
} from 'remotion';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadDMSans } from '@remotion/google-fonts/DMSans';
import { loadFont as loadJetBrains } from '@remotion/google-fonts/JetBrainsMono';
import { TransitionClip } from './transitions/TransitionClip';
import { ENGINES, getTransition } from './transitions/index';
import { ZCAPTIONS, CAPTION_WINDOWS } from './PlanToMakeMillionsCaptions';
import { ChartStyles, LiveChart } from './PlanToMakeMillionsCharts';

const { fontFamily: MONTSERRAT } = loadMontserrat('normal', { weights: ['900'], subsets: ['latin'] });
loadPlayfair('normal', { weights: ['400', '700', '900'], subsets: ['latin'] });
loadDMSans('normal', { weights: ['300', '400', '500', '600', '700'], subsets: ['latin'] });
loadJetBrains('normal', { weights: ['400', '600'], subsets: ['latin'] });

// ================================================================================================ 1-2. timing (section 2 + 3d)
export const FPS = 30;
export const PAUSE = 1.5;                                  // spine/ALL.g.paused.json pause_s (title cards)
export const SPINE_SECS = 590.235;                         // the SOURCE spine spine/ALL.e.enhanced.mp4 (the sidecar's `source`)
export const CARD_T = [79.2, 265.6, 471.33];               // the card rows of the sidecar (WHY EVERYTHING DUMPED · THE TRADES · THE PLAN TO 2028)
// EVERY pause of the paused spine (spine/ALL.g.paused.json pauses[]): the 4 spliced clips of the CH1 montage (back to back at
// one splice, their voices already in the VO) and the 3 title-card pauses. The pauses table IS the time map.
export const INSERTS = [
  { at: 9.815, dur: 2.6 },
  { at: 9.815, dur: 3.2 },
  { at: 9.815, dur: 3.5 },
  { at: 9.815, dur: 3.6 },
  { at: 79.2, dur: 1.5 },
  { at: 265.6, dur: 1.5 },
  { at: 471.33, dur: 1.5 },
];
const CLIPS = [                                            // the montage, play order = the sidecar order (CLIP-1, 4, 3, 8)
  { id: 'CLIP-1', file: 'CLIP-1-bloomberg-crypto-exchange-hacked', frames: 78 },
  { id: 'CLIP-4', file: 'CLIP-4-abc-democrats-control-congress', frames: 95 },
  { id: 'CLIP-3', file: 'CLIP-3-cnn-huang-resigned', frames: 104 },
  { id: 'CLIP-8', file: 'CLIP-8-fox-historically-bad-day', frames: 107 },
];
export const sh = (t: number) => t + INSERTS.filter((p) => p.at <= t).reduce((s, p) => s + p.dur, 0);   // source -> paused secs
const shEnd = (t: number) => t + INSERTS.filter((p) => p.at < t).reduce((s, p) => s + p.dur, 0);      // a span ENDING at t stops before a pause at t
export const F = (t: number) => Math.round(sh(t) * FPS);
const Fe = (t: number) => Math.round(shEnd(t) * FPS);
export const DUR = Math.round((SPINE_SECS + INSERTS.reduce((s, p) => s + p.dur, 0)) * FPS);           // 18229 = the paused spine's frames
// each pause's own frames on the paused spine
const PAUSE_WIN = INSERTS.map((p, i) => {
  const start = Math.round((p.at + INSERTS.slice(0, i).reduce((s, q) => s + q.dur, 0)) * FPS);
  return { ...p, start, frames: Math.round(p.dur * FPS) };
});
// the absolute clock: composition frame -> SOURCE second (frozen at `at` inside a pause)
const srcT = (fr: number) => {
  let cum = 0;
  for (const p of PAUSE_WIN) {
    if (fr < p.start) return fr / FPS - cum;
    if (fr < p.start + p.frames) return p.at;
    cum += p.dur;
  }
  return fr / FPS - cum;
};
const AbsCtx = createContext(0);
const useAbs = () => useContext(AbsCtx);
const useT = () => srcT(useAbs());
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const inOut = Easing.inOut(Easing.cubic);
const outC = Easing.out(Easing.cubic);

// ================================================================================================ 3a. FACE REFRAME (measured)
export const FACE_REFRAME = { scale: 1.266, x: -408, y: -229 };   // assets/face-reframe.json, never hand-tuned
const FACE_POINT = { x: 960, y: 432 };                             // json face_point_out: punch-ins scale about it
const PUNCH = 1.18;                                                // hard ~18% step ON a desilencer join
// The 8 FACE windows (AS-RECORDED / COVER-PLAN face_windows). ALL air as the city-look background-swap clips (section 3b:
// PRE-FRAMED, full frame, NO FACE_REFRAME, from window_starts_at_clip_s, muted: spine audio kept). Captions on F1-F3 only.
const FACES = [
  { id: 'F1', a: 0.0, b: 7.022, clipStart: 12 },
  { id: 'F2', a: 9.889, b: 16.289, clipStart: 12 },
  { id: 'F3', a: 46.789, b: 53.555, clipStart: 12 },
  { id: 'F4', a: 216.528, b: 223.961, clipStart: 8 },
  { id: 'F5', a: 348.395, b: 359.395, clipStart: 12 },
  { id: 'F6', a: 464.528, b: 471.195, clipStart: 12 },
  { id: 'F7', a: 565.601, b: 570.567, clipStart: 12 },
  { id: 'F8', a: 588.635, b: 590.213, clipStart: 38 },
];
// PUNCH-INS: only on the 3 INTERIOR joins of spine/jumpcuts-final.json (F1-F5 have their join on a window edge: no punch)
const PUNCHES = [
  { at: 470.567, face: 'F6', leak: 'lightleaks-soft-short-1' },   // [PUNCH-IN] + [LIGHTLEAK] lib:lightleaks-soft-short-1 (punch-leak)
  { at: 569.867, face: 'F7', leak: 'lightleaks-soft-short-2' },   // [PUNCH-IN] + [LIGHTLEAK] lib:lightleaks-soft-short-2 (punch-leak)
  { at: 589.5, face: 'F8', leak: 'lightleaks-soft-short-4' },     // [PUNCH-IN] + [LIGHTLEAK] lib:lightleaks-soft-short-4 (punch-leak)
];
const faceEnd = (w: { id: string; b: number }) => (w.id === 'F8' ? DUR : Fe(w.b));   // F8 holds to EOF (hard out on 'later.')
const punchAt = (fr: number) => (PUNCHES.some((p) => {
  const w = FACES.find((f) => f.id === p.face)!;
  return fr >= F(p.at) && fr < faceEnd(w);
}) ? PUNCH : 1);

// ================================================================================================ 4. COVER track
type Kind = 'chart' | 'still' | 'vid' | 'deck' | 'receipt' | 'container' | 'diagram' | 'whiteboard' | 'clipstill' | 'title';
type Tr = 'cut' | 'xf' | 'xf6' | 'fade' | 'warp' | 'paper';
type Cover = { tIn: number; tOut: number; kind: Kind; ref: string; state?: string; tr?: Tr; td?: number; mo?: string; grp?: string; from?: number; lead?: boolean; cap?: boolean };
// One row per state / sub-point, timed off the EDIT-PLAN event log. tr = the ingress (TRANSITION-PLAN): xf = hand:xfade-scale
// (container-xfade 0.35 s; charts opacity only), fade = hand:fade (broll-fade), cut = hand:cut (and every row whose entry is
// owned by an overlay: film burn on a face edge, a library glitch / melt / spin), warp = hand:cross-warp, paper = hand:paper-sheet,
// xf6 = a receipt's second stage (6 frames). Consecutive same-ref rows are STATE SWAPS: no ingress, a 6-frame state cross-fade.
export const COVERS: Cover[] = [
  // ---------------------------------------------------------------- CH1 THE HOOK (gold)
  { tIn: 7.022, tOut: 7.7, kind: 'receipt', ref: 'R-HL1-techcrunch-headline', tr: 'cut' },          // F1 out: hand:film-burn
  { tIn: 7.7, tOut: 8.36, kind: 'receipt', ref: 'R-HL2-aljazeera-headline', tr: 'cut' },             // hand:cut (headline stack)
  { tIn: 8.36, tOut: 9.02, kind: 'receipt', ref: 'R-HL3-foxbusiness-headline', tr: 'cut' },          // hand:cut
  { tIn: 9.02, tOut: 9.815, kind: 'receipt', ref: 'R-HL4-fool-headline', tr: 'cut' },                // hand:cut; montage lead-in (cuts HARD into CLIP-1)
  { tIn: 9.815, tOut: 9.889, kind: 'clipstill', ref: 'CLIP-8-fox-historically-bad-day', tr: 'cut' }, // CLIP-8 LEAD-OUT: its last frame held to F2
  { tIn: 16.289, tOut: 23.3, kind: 'chart', ref: 'C3', tr: 'cut' },                                  // F2 out: hand:film-burn
  { tIn: 23.3, tOut: 26.5, kind: 'receipt', ref: 'C27-tradingview-btcusd-daily', tr: 'xf', td: 0.35 }, // hand:xfade-scale
  { tIn: 26.5, tOut: 30.4, kind: 'vid', ref: 'BR-1-distressed-trader', tr: 'fade', td: 0.5 },        // hand:fade
  { tIn: 30.4, tOut: 33.9, kind: 'still', ref: 'IMG-1-trader-red-monitors', tr: 'cut' },             // lib:badsignal-max-3
  { tIn: 33.9, tOut: 39.85, kind: 'chart', ref: 'C16', tr: 'xf', td: 0.35 },                         // hand:xfade-scale (HOOK run)
  { tIn: 39.85, tOut: 46.789, kind: 'chart', ref: 'C14', tr: 'xf', td: 0.35 },                       // hand:xfade-scale (HOOK run; no 35X on screen)
  { tIn: 53.555, tOut: 56.95, kind: 'vid', ref: 'BR-2-data-scan', tr: 'cut' },                       // F3 out: hand:film-burn
  { tIn: 56.95, tOut: 58.2, kind: 'container', ref: 'H1', state: 's1', tr: 'xf', td: 0.35 },         // hand:xfade-scale
  { tIn: 58.2, tOut: 59.94, kind: 'container', ref: 'H1', state: 's2' },
  { tIn: 59.94, tOut: 62.25, kind: 'container', ref: 'H1', state: 's3' },
  { tIn: 62.25, tOut: 65.3, kind: 'container', ref: 'C26', state: 's0', tr: 'xf', td: 0.35 },        // hand:xfade-scale; cards held back
  { tIn: 65.3, tOut: 67.4, kind: 'container', ref: 'C26', state: 's1' },
  { tIn: 67.4, tOut: 70.18, kind: 'container', ref: 'C26', state: 's2' },
  { tIn: 70.18, tOut: 71.8, kind: 'container', ref: 'C26', state: 's3' },
  { tIn: 71.8, tOut: 74.15, kind: 'deck', ref: 'C26', state: 's4' },                                 // the CH1 OVERVIEW (all three lit)
  { tIn: 74.15, tOut: 77.75, kind: 'still', ref: 'IMG-2-newsroom-dusk', tr: 'cut' },                 // lib:badsignal-max-2
  { tIn: 77.75, tOut: 79.2, kind: 'vid', ref: 'BR-3-clock-rewind', tr: 'fade', td: 0.35 },           // hand:fade, holds to the CH2 card
  // ---------------------------------------------------------------- CH2 THE DUMP (red) · card WHY EVERYTHING DUMPED (hand:cube-3d)
  { tIn: 79.2, tOut: 89.2, kind: 'chart', ref: 'C1', tr: 'xf', td: 0.35 },                           // hand:xfade-scale at the resume
  { tIn: 89.2, tOut: 92.1, kind: 'receipt', ref: 'C7-binance-incident-update-2', tr: 'xf', td: 0.35 },
  { tIn: 92.1, tOut: 94.2, kind: 'receipt', ref: 'R-ALJ-headline', tr: 'xf', td: 0.35, grp: 'R-ALJ' },
  { tIn: 94.2, tOut: 97.9, kind: 'receipt', ref: 'R-ALJ-sentence', tr: 'xf6', grp: 'R-ALJ' },
  { tIn: 97.9, tOut: 103.5, kind: 'chart', ref: 'C1', tr: 'xf', td: 0.35 },                          // C1 returns (s1b)
  { tIn: 103.5, tOut: 104.5, kind: 'receipt', ref: 'R-BLOCK-headline', tr: 'xf', td: 0.35, grp: 'R-BLOCK' },
  { tIn: 104.5, tOut: 108.6, kind: 'receipt', ref: 'R-BLOCK-liquidations', tr: 'xf6', grp: 'R-BLOCK' },
  { tIn: 108.6, tOut: 113.65, kind: 'chart', ref: 'C1', tr: 'xf', td: 0.35 },                        // C1 returns (s2)
  { tIn: 113.65, tOut: 117.15, kind: 'vid', ref: 'BR-4-oil-tanker', tr: 'fade', td: 0.5 },
  { tIn: 117.15, tOut: 122.45, kind: 'chart', ref: 'C5', tr: 'xf', td: 0.35 },
  { tIn: 122.45, tOut: 123.55, kind: 'receipt', ref: 'C10-header', tr: 'xf', td: 0.35, grp: 'C10' },
  { tIn: 123.55, tOut: 125.7, kind: 'receipt', ref: 'C10-gasoline', tr: 'xf6', grp: 'C10' },
  { tIn: 125.7, tOut: 127.18, kind: 'container', ref: 'C6', state: 's1', tr: 'xf', td: 0.35 },
  { tIn: 127.18, tOut: 128.82, kind: 'container', ref: 'C6', state: 's2' },
  { tIn: 128.82, tOut: 131.1, kind: 'container', ref: 'C6', state: 's3' },
  { tIn: 131.1, tOut: 132.08, kind: 'diagram', ref: 'D-RATES', state: 's1', tr: 'xf', td: 0.35 },
  { tIn: 132.08, tOut: 134.46, kind: 'diagram', ref: 'D-RATES', state: 's2' },
  { tIn: 134.46, tOut: 136.84, kind: 'diagram', ref: 'D-RATES', state: 's3' },
  { tIn: 136.84, tOut: 138.84, kind: 'diagram', ref: 'D-RATES', state: 's4' },
  { tIn: 138.84, tOut: 140.06, kind: 'diagram', ref: 'D-RATES', state: 's5' },
  { tIn: 140.06, tOut: 143.65, kind: 'diagram', ref: 'D-RATES', state: 's6' },
  { tIn: 143.65, tOut: 146.9, kind: 'vid', ref: 'BR-5-capitol', tr: 'fade', td: 0.5 },
  { tIn: 146.9, tOut: 151.25, kind: 'chart', ref: 'C1', tr: 'xf', td: 0.35 },                        // C1 returns (s3)
  { tIn: 151.25, tOut: 155.95, kind: 'receipt', ref: 'C11-foxbusiness-headline', tr: 'xf', td: 0.35 },
  { tIn: 155.95, tOut: 159.7, kind: 'vid', ref: 'BR-6-trading-floor', tr: 'fade', td: 0.5 },
  { tIn: 159.7, tOut: 166.5, kind: 'chart', ref: 'C1', tr: 'xf', td: 0.35 },                         // C1 returns (s3b, s4)
  { tIn: 166.5, tOut: 170.1, kind: 'receipt', ref: 'C8-nvidia-ceo-transition-release', tr: 'xf', td: 0.35, mo: 'motion-3d-pan-1-right' },
  { tIn: 170.1, tOut: 172.3, kind: 'vid', ref: 'BR-7-server-aisle', tr: 'fade', td: 0.35 },
  { tIn: 172.3, tOut: 176.55, kind: 'chart', ref: 'C-NVDA', tr: 'xf', td: 0.35 },
  { tIn: 176.55, tOut: 179.6, kind: 'chart', ref: 'C1', tr: 'xf', td: 0.35 },                        // C1 returns (s5)
  { tIn: 179.6, tOut: 184.05, kind: 'receipt', ref: 'C9-aljazeera-anthropic-ipo', tr: 'xf', td: 0.35 },
  { tIn: 184.05, tOut: 188.38, kind: 'container', ref: 'D-THEORY', state: 's1', tr: 'xf', td: 0.35 },
  { tIn: 188.38, tOut: 189.4, kind: 'container', ref: 'D-THEORY', state: 's2' },
  { tIn: 189.4, tOut: 192.9, kind: 'vid', ref: 'BR-8-rocket-launch', tr: 'fade', td: 0.5 },
  { tIn: 192.9, tOut: 201.45, kind: 'chart', ref: 'C-SPACEX', tr: 'xf', td: 0.35 },
  { tIn: 201.45, tOut: 206.8, kind: 'chart', ref: 'C1', tr: 'cut' },                                 // C1 FINAL, IN on lib:melt-rgb-soft-2
  { tIn: 206.8, tOut: 216.528, kind: 'chart', ref: 'C2', tr: 'xf', td: 0.35 },
  { tIn: 223.961, tOut: 227.6, kind: 'still', ref: 'IMG-3-storm-harbour-tanker', tr: 'cut' },        // F4 out: hand:film-burn
  { tIn: 227.6, tOut: 228.22, kind: 'container', ref: 'D-PRIOR', state: 's1', tr: 'xf', td: 0.35 },
  { tIn: 228.22, tOut: 233.74, kind: 'container', ref: 'D-PRIOR', state: 's2' },
  { tIn: 233.74, tOut: 235.0, kind: 'container', ref: 'D-PRIOR', state: 's3' },
  { tIn: 235.0, tOut: 237.3, kind: 'receipt', ref: 'C12-headline', tr: 'xf', td: 0.35, mo: 'motion-3d-orbit-2-right-down', grp: 'C12' },
  { tIn: 237.3, tOut: 239.66, kind: 'receipt', ref: 'C12-causes', tr: 'xf6', mo: 'motion-3d-orbit-2-right-down', grp: 'C12' },
  { tIn: 239.66, tOut: 243.5, kind: 'vid', ref: 'BR-9-flip-calendar', tr: 'fade', td: 0.5 },
  { tIn: 243.5, tOut: 247.45, kind: 'vid', ref: 'BR-10-control-room', tr: 'fade', td: 0.5 },
  { tIn: 247.45, tOut: 254.7, kind: 'receipt', ref: 'R-NVDA-NEWS-headline', tr: 'xf', td: 0.35 },
  { tIn: 254.7, tOut: 257.9, kind: 'receipt', ref: 'R-NVDA-CHART-tradingview-nvda-daily', tr: 'xf', td: 0.35 },
  { tIn: 257.9, tOut: 261.8, kind: 'still', ref: 'IMG-4-empty-trading-floor', tr: 'cut' },           // lib:badsignal-short-3
  { tIn: 261.8, tOut: 265.6, kind: 'vid', ref: 'BR-11-trader-desk', tr: 'fade', td: 0.5 },           // holds to the CH3 card
  // ---------------------------------------------------------------- CH3 THE TRADES (green) · card THE TRADES (hand:cube-3d)
  { tIn: 265.6, tOut: 267.45, kind: 'still', ref: 'IMG-5-pieverse-coin', tr: 'cut' },                // lib:badsignal-short-1 at the resume
  { tIn: 267.45, tOut: 272.15, kind: 'receipt', ref: 'C15-coingecko-pieverse-max', tr: 'xf', td: 0.35 },
  { tIn: 272.15, tOut: 290.4, kind: 'chart', ref: 'C16', tr: 'xf', td: 0.35 },                       // WALK run
  { tIn: 290.4, tOut: 294.3, kind: 'receipt', ref: 'C18-x-post-nov-19', tr: 'xf', td: 0.35 },        // the post column only
  { tIn: 294.3, tOut: 300.15, kind: 'chart', ref: 'C16', tr: 'xf', td: 0.35 },
  { tIn: 300.15, tOut: 301.5, kind: 'still', ref: 'IMG-6-evaa-coin', tr: 'cut' },                    // lib:badsignal-short-2
  { tIn: 301.5, tOut: 305.3, kind: 'receipt', ref: 'C13-coingecko-evaa-1y', tr: 'xf', td: 0.35 },
  { tIn: 305.3, tOut: 315.0, kind: 'chart', ref: 'C14', tr: 'xf', td: 0.35 },                        // WALK run part 1
  { tIn: 315.0, tOut: 317.08, kind: 'diagram', ref: 'D-ROTATE', state: 's0', tr: 'xf', td: 0.35 },
  { tIn: 317.08, tOut: 320.6, kind: 'diagram', ref: 'D-ROTATE', state: 's1' },
  { tIn: 320.6, tOut: 322.98, kind: 'diagram', ref: 'D-ROTATE', state: 's2' },
  { tIn: 322.98, tOut: 326.05, kind: 'diagram', ref: 'D-ROTATE', state: 's3' },
  { tIn: 326.05, tOut: 348.395, kind: 'chart', ref: 'C14', tr: 'cut' },                              // IN on lib:melt-rgb-soft-short-2
  { tIn: 359.395, tOut: 363.14, kind: 'container', ref: 'C17', state: 's1', tr: 'cut' },             // F5 out: hand:film-burn
  { tIn: 363.14, tOut: 364.45, kind: 'container', ref: 'C17', state: 's2' },
  { tIn: 364.45, tOut: 367.06, kind: 'container', ref: 'D-COMMON', state: 's1', tr: 'xf', td: 0.35 },
  { tIn: 367.06, tOut: 369.85, kind: 'container', ref: 'D-COMMON', state: 's2' },
  { tIn: 369.85, tOut: 372.2, kind: 'vid', ref: 'BR-12-dice', tr: 'fade', td: 0.35 },
  // ---------------------------------------------------------------- CH4 HOW I FIND THEM (green, no card)
  { tIn: 372.2, tOut: 377.0, kind: 'receipt', ref: 'R-NEWCOINS-coingecko-new-listings-scroll', tr: 'xf', td: 0.35 },
  { tIn: 377.0, tOut: 380.1, kind: 'vid', ref: 'BR-13-tired-eyes', tr: 'fade', td: 0.5 },
  { tIn: 380.1, tOut: 384.5, kind: 'receipt', ref: 'C20a-about', tr: 'xf', td: 0.35, grp: 'C20a' },
  { tIn: 384.5, tOut: 387.74, kind: 'receipt', ref: 'C20a-new-coin-alert-bot', tr: 'xf6', grp: 'C20a' },
  { tIn: 387.74, tOut: 411.88, kind: 'whiteboard', ref: 'WB1', from: 0, tr: 'paper' },                // hand:paper-sheet (11 frames in)
  { tIn: 411.88, tOut: 415.8, kind: 'vid', ref: 'BR-14-eye-reflection', tr: 'fade', td: 0.3 },       // hand:fade = the paper sheet out, 0.3 s
  { tIn: 415.8, tOut: 418.58, kind: 'container', ref: 'D-TELL', state: 's0', tr: 'xf', td: 0.35 },   // rows held back
  { tIn: 418.58, tOut: 421.04, kind: 'container', ref: 'D-TELL', state: 's1' },
  { tIn: 421.04, tOut: 422.94, kind: 'container', ref: 'D-TELL', state: 's2' },
  { tIn: 422.94, tOut: 427.0, kind: 'container', ref: 'D-TELL', state: 's3' },
  { tIn: 427.0, tOut: 430.6, kind: 'vid', ref: 'BR-15-roulette', tr: 'fade', td: 0.5 },
  { tIn: 430.6, tOut: 432.72, kind: 'container', ref: 'D-TELL', state: 's3', tr: 'xf', td: 0.35 },   // D-TELL returns as it left
  { tIn: 432.72, tOut: 434.24, kind: 'container', ref: 'D-TELL', state: 's4' },
  { tIn: 434.24, tOut: 437.04, kind: 'container', ref: 'D-TELL', state: 's5' },
  { tIn: 437.04, tOut: 437.55, kind: 'container', ref: 'D-TELL', state: 's6' },
  { tIn: 437.55, tOut: 444.58, kind: 'chart', ref: 'C16-ZOOM', tr: 'xf', td: 0.35 },
  { tIn: 444.58, tOut: 449.72, kind: 'diagram', ref: 'C22', state: 's1', tr: 'cut' },                // IN on lib:spin-center-swinging-cw
  { tIn: 449.72, tOut: 451.98, kind: 'diagram', ref: 'C22', state: 's2' },
  { tIn: 451.98, tOut: 453.18, kind: 'diagram', ref: 'C22', state: 's2b' },
  { tIn: 453.18, tOut: 455.86, kind: 'diagram', ref: 'C22', state: 's3' },
  { tIn: 455.86, tOut: 458.2, kind: 'diagram', ref: 'C22', state: 's4' },
  { tIn: 458.2, tOut: 459.1, kind: 'diagram', ref: 'C22', state: 's5' },
  { tIn: 459.1, tOut: 461.0, kind: 'receipt', ref: 'C20b-showcase-full', tr: 'xf', td: 0.35, grp: 'C20b' },
  { tIn: 461.0, tOut: 464.528, kind: 'receipt', ref: 'C20b-showcase-top', tr: 'xf6', grp: 'C20b' },
  { tIn: 471.195, tOut: 471.33, kind: 'title', ref: 'title-CH5-s0', tr: 'cut' },                     // F6 out: hand:film-burn; bare CH5 page
  // ---------------------------------------------------------------- CH5 THE PLAN TO 2028 (cyan) · card THE PLAN TO 2028 (hand:cube-3d)
  { tIn: 471.33, tOut: 474.65, kind: 'still', ref: 'IMG-7-window-first-light', tr: 'warp', td: 0.5 }, // hand:cross-warp at the resume
  { tIn: 474.65, tOut: 489.2, kind: 'chart', ref: 'C23', tr: 'xf', td: 0.35 },
  { tIn: 489.2, tOut: 495.6, kind: 'chart', ref: 'C24', tr: 'xf', td: 0.35 },
  { tIn: 495.6, tOut: 498.6, kind: 'vid', ref: 'BR-16-bell-sunset', tr: 'fade', td: 0.5 },
  { tIn: 498.6, tOut: 498.9, kind: 'container', ref: 'D-ENTRIES', state: 's0', tr: 'xf', td: 0.35 }, // lines held back
  { tIn: 498.9, tOut: 500.6, kind: 'container', ref: 'D-ENTRIES', state: 's1' },
  { tIn: 500.6, tOut: 502.44, kind: 'container', ref: 'D-ENTRIES', state: 's2' },
  { tIn: 502.44, tOut: 505.9, kind: 'container', ref: 'D-ENTRIES', state: 's3' },
  { tIn: 505.9, tOut: 509.44, kind: 'diagram', ref: 'C22B', state: 's1', tr: 'xf', td: 0.35 },
  { tIn: 509.44, tOut: 510.52, kind: 'diagram', ref: 'C22B', state: 's2' },
  { tIn: 510.52, tOut: 512.4, kind: 'diagram', ref: 'C22B', state: 's3' },
  { tIn: 512.4, tOut: 515.66, kind: 'diagram', ref: 'C22B', state: 's4' },
  { tIn: 515.66, tOut: 518.15, kind: 'diagram', ref: 'C22B', state: 's5' },
  { tIn: 518.15, tOut: 520.18, kind: 'diagram', ref: 'T-2028', state: 's0', tr: 'xf', td: 0.35 },
  { tIn: 520.18, tOut: 522.4, kind: 'diagram', ref: 'T-2028', state: 's1' },
  { tIn: 522.4, tOut: 526.34, kind: 'diagram', ref: 'T-2028', state: 's2' },
  { tIn: 526.34, tOut: 527.86, kind: 'diagram', ref: 'T-2028', state: 's3' },
  { tIn: 527.86, tOut: 531.75, kind: 'vid', ref: 'BR-17-twenty-dollar', tr: 'fade', td: 0.5 },
  { tIn: 531.75, tOut: 536.26, kind: 'diagram', ref: 'D-IMAGINE', state: 's1-stake', tr: 'xf', td: 0.35 },
  { tIn: 536.26, tOut: 538.5, kind: 'diagram', ref: 'D-IMAGINE', state: 's1b-grow' },
  { tIn: 538.5, tOut: 542.4, kind: 'still', ref: 'IMG-8-summit-above-clouds', tr: 'warp', td: 0.5 }, // hand:cross-warp
  { tIn: 542.4, tOut: 543.92, kind: 'diagram', ref: 'D-IMAGINE', state: 's1b-grow', tr: 'xf', td: 0.35 },
  { tIn: 543.92, tOut: 545.48, kind: 'diagram', ref: 'D-IMAGINE', state: 's2-hill' },
  { tIn: 545.48, tOut: 552.28, kind: 'diagram', ref: 'D-IMAGINE', state: 's2b-pot' },
  { tIn: 552.28, tOut: 557.18, kind: 'diagram', ref: 'D-IMAGINE', state: 's3-split' },
  { tIn: 557.18, tOut: 558.8, kind: 'diagram', ref: 'D-IMAGINE', state: 's4a-one' },
  { tIn: 558.8, tOut: 560.8, kind: 'diagram', ref: 'D-IMAGINE', state: 's4b-two' },
  { tIn: 560.8, tOut: 561.95, kind: 'diagram', ref: 'D-IMAGINE', state: 's4c-three' },
  { tIn: 561.95, tOut: 565.601, kind: 'vid', ref: 'BR-18-river-delta', tr: 'fade', td: 0.5 },
  { tIn: 570.567, tOut: 574.72, kind: 'container', ref: 'H0', state: 's1', tr: 'cut' },              // F7 out: hand:film-burn (no SFX, no bed dip)
  { tIn: 574.72, tOut: 576.0, kind: 'container', ref: 'H0', state: 's2' },
  { tIn: 576.0, tOut: 576.64, kind: 'container', ref: 'E1', state: 's0', tr: 'xf', td: 0.35 },       // end card, lines held back
  { tIn: 576.64, tOut: 581.84, kind: 'container', ref: 'E1', state: 's1' },
  { tIn: 581.84, tOut: 583.72, kind: 'container', ref: 'E1', state: 's2' },
  { tIn: 583.72, tOut: 585.85, kind: 'container', ref: 'E1', state: 's3' },
  { tIn: 585.85, tOut: 588.635, kind: 'vid', ref: 'BR-19-city-sunrise', tr: 'fade', td: 0.5 },
];

// 24 / 25 fps b-roll plays FRAME FOR FRAME (playbackRate = 30 / fps; comp-build section 11); 29.97 / 59.94 / 60 play at 1.0
export const VID_FPS: Record<string, number> = {
  'BR-1-distressed-trader': 25 / 1,
  'BR-4-oil-tanker': 25 / 1,
  'BR-5-capitol': 24 / 1,
  'BR-6-trading-floor': 25 / 1,
  'BR-7-server-aisle': 25 / 1,
  'BR-8-rocket-launch': 24000 / 1001,
  'BR-9-flip-calendar': 25 / 1,
  'BR-12-dice': 25 / 1,
  'BR-13-tired-eyes': 25 / 1,
  'BR-14-eye-reflection': 25 / 1,
  'BR-15-roulette': 24 / 1,
  'BR-17-twenty-dollar': 25 / 1,
  'BR-19-city-sunrise': 25 / 1,
};
const rateOf = (ref: string) => (VID_FPS[ref] ? FPS / VID_FPS[ref] : 1);

// the comp's own still of a video's cut frame, handed to a library engine instead of the live clip (section 6a cost trap)
const CUTFRAME: Record<string, string> = { 'BR-1-distressed-trader': 'transitions/cutframes/BR-1-distressed-trader-cut.jpg' };

// ================================================================================================ RECEIPTS (real captures, real pixels)
// Camera keyframes in CAPTURE px (x, y = the view's top-left, w = its width; h = w * 9/16), highlights = #ffe14d rects wiping
// left to right in capture coordinates (multiply: dark text stays dark, on a dark page the text turns yellow), from EDIT-PLAN.
type View = [number, number, number];
type Rx = { w: number; h: number; bg: string; views: [number, View][]; hl?: { t: number; d: number; r: [number, number, number, number][] }[]; video?: boolean };
const RX: Record<string, Rx> = {
  'R-HL1-techcrunch-headline': { w: 3840, h: 2160, bg: '#fff', views: [[7.022, [900, 200, 2900]], [7.7, [1450, 430, 2100]]] },
  'R-HL2-aljazeera-headline': { w: 3840, h: 2160, bg: '#fff', views: [[7.7, [600, 150, 2400]], [8.36, [700, 210, 2050]]] },
  'R-HL3-foxbusiness-headline': { w: 3840, h: 2160, bg: '#fff', views: [[8.36, [700, 0, 2500]], [9.02, [850, 90, 2200]]] },
  'R-HL4-fool-headline': { w: 3840, h: 2160, bg: '#fff', views: [[9.02, [400, 150, 2400]], [9.815, [520, 220, 2050]]] },
  'C27-tradingview-btcusd-daily': { w: 3840, h: 2160, bg: '#fff', views: [[23.3, [0, 0, 3840]], [26.5, [1000, 560, 2840]]] },
  'C7-binance-incident-update-2': {
    w: 3840, h: 2160, bg: '#181a20', views: [[89.2, [1050, 140, 1560]], [92.1, [1150, 380, 1300]]],
    hl: [{ t: 89.45, d: 0.4, r: [[1749, 730, 317, 42]] },                                   // 'approximately $6.3B' (measured word spans)
         { t: 90.35, d: 0.5, r: [[1933, 684, 251, 40], [1223, 730, 222, 42]] }],            // 'hot wallets were compromised'
  },
  'R-ALJ-headline': { w: 3840, h: 2160, bg: '#fff', views: [[92.1, [700, 180, 1600]], [94.2, [760, 330, 1450]]] },  // pushes PAST the dek, no highlight
  'R-ALJ-sentence': {
    w: 3840, h: 2160, bg: '#fff', views: [[94.2, [700, 60, 1640]], [97.9, [720, 100, 1590]]],   // the column, above the attribution paragraph
    hl: [{ t: 94.52, d: 0.9, r: [[1395, 478, 610, 46]] }],                                   // 'the biggest crypto heist on record'
  },
  'R-BLOCK-headline': { w: 3840, h: 2160, bg: '#fff', views: [[103.5, [1200, 180, 1500]], [104.5, [1260, 230, 1400]]] },
  'R-BLOCK-liquidations': {
    w: 3840, h: 2160, bg: '#fff', views: [[104.5, [1100, 450, 1600]], [108.6, [1250, 600, 1300]]],
    hl: [{ t: 104.6, d: 0.7, r: [[1336, 787, 1070, 44], [1336, 846, 905, 44]] }],            // 'liquidations totaled $1.55 billion ... CoinGlass'
  },
  'C10-header': { w: 3840, h: 2160, bg: '#fff', views: [[122.45, [0, 300, 2300]], [123.55, [0, 420, 2050]]] },
  'C10-gasoline': {
    w: 3840, h: 2160, bg: '#fff', views: [[123.55, [300, 230, 2300]], [125.7, [650, 300, 1650]]],
    hl: [{ t: 123.8, d: 0.6, r: [[878, 458, 1010, 50]] }],                                   // 'advancing 9.1 percent the previous month'
  },
  'C11-foxbusiness-headline': {
    w: 3840, h: 2160, bg: '#fff', views: [[151.25, [600, 0, 2650]], [155.95, [900, 110, 2100]]],
    hl: [{ t: 153.6, d: 0.6, r: [[1636, 418, 1230, 118]] }],                                 // 'AI regulatory concerns'
  },
  'C8-nvidia-ceo-transition-release': { w: 3840, h: 2160, bg: '#fff', views: [[166.5, [0, 240, 1500]], [170.1, [0, 280, 1400]]] },  // headline, bullets, dated SANTA CLARA line under the pan
  'C9-aljazeera-anthropic-ipo': {
    w: 3840, h: 2160, bg: '#fff', views: [[179.6, [690, 200, 1700]], [184.05, [700, 300, 1500]]],
    hl: [{ t: 179.95, d: 1.0, r: [[1705, 560, 522, 52], [745, 632, 688, 52]] }],             // 'the largest initial public offering in US history at $81bn'
  },
  'C12-headline': { w: 3840, h: 2160, bg: '#fff', views: [[235.0, [1050, 200, 1650]], [237.3, [1100, 240, 1550]]] },
  'C12-causes': { w: 3840, h: 2160, bg: '#fff', views: [[237.3, [900, 300, 2400]], [239.66, [950, 350, 2300]]] },  // an OBJECT: no highlight
  'R-NVDA-NEWS-headline': {
    w: 3840, h: 2160, bg: '#fff', views: [[247.45, [560, 150, 2100]], [251.4, [580, 250, 1900]], [254.7, [560, 330, 1850]]],
    hl: [{ t: 251.95, d: 0.4, r: [[1104, 452, 336, 90]] }],                                  // 'Reinstates'
  },
  'R-NVDA-CHART-tradingview-nvda-daily': { w: 3840, h: 2160, bg: '#fff', views: [[254.7, [0, 0, 3840]], [257.9, [1000, 560, 2840]]] },
  'C15-coingecko-pieverse-max': { w: 3840, h: 2160, bg: '#fff', views: [[267.45, [100, 250, 2950]], [272.15, [900, 470, 2100]]] },  // the chart column, never the sidebar ad
  'C18-x-post-nov-19': {                                                                     // the POST COLUMN only (x 1140-2335), above the price card
    w: 3840, h: 2310, bg: '#fff', views: [[290.4, [1142, 60, 1190]], [294.3, [1165, 110, 1110]]],
    hl: [{ t: 292.3, d: 0.8, r: [[1168, 238, 902, 44]] }],                                   // 'Pieverse touched a $1 billion market cap on November 18'
  },
  'C13-coingecko-evaa-1y': { w: 3840, h: 2160, bg: '#fff', views: [[301.5, [100, 250, 2950]], [305.3, [900, 470, 2100]]] },
  'R-NEWCOINS-coingecko-new-listings-scroll': { w: 1920, h: 1080, bg: '#fff', views: [[372.2, [0, 0, 1920]], [377.0, [40, 22, 1840]]], video: true },
  'C20a-about': {
    w: 2100, h: 888, bg: '#110f1c', views: [[380.1, [0, -150, 2100]], [384.5, [60, -60, 1900]]],
    hl: [{ t: 382.56, d: 0.9, r: [[845, 389, 946, 56], [160, 459, 836, 56]] }],              // 'investing in Crypto since 2013, and is an accomplished software developer'
  },
  'C20a-new-coin-alert-bot': {
    w: 3510, h: 1020, bg: '#110f1c', views: [[384.5, [0, -100, 2000]], [387.74, [20, -20, 1700]]],
    hl: [{ t: 385.56, d: 0.4, r: [[132, 292, 612, 84]] }],                                   // the FIRST card only: 'New Coin Alert bot'
  },
  'C20b-showcase-full': { w: 3840, h: 7214, bg: '#110f1c', views: [[459.1, [0, 0, 3840]], [461.0, [0, 4200, 3840]]] },  // the whole table, scrolled
  'C20b-showcase-top': {
    w: 3840, h: 2160, bg: '#110f1c', views: [[461.0, [600, 300, 2700]], [464.528, [700, 420, 2500]]],
    hl: [{ t: 462.58, d: 0.5, r: [[2378, 690, 250, 56], [2378, 780, 250, 56], [2378, 954, 250, 56], [2378, 1044, 250, 56], [2378, 1395, 250, 56]] }],  // the bot rows, 'Called by'
  },
};
const TALLY = [{ t: 461.22, text: '56 CALLS' }, { t: 462.58, text: '34 CALLED BY A BOT' }];

const lerpView = (views: [number, View][], t: number): View => {
  if (t <= views[0][0]) return views[0][1];
  for (let i = 1; i < views.length; i++) {
    const [t1, v1] = views[i];
    const [t0, v0] = views[i - 1];
    if (t <= t1) {
      const p = inOut(clamp01((t - t0) / (t1 - t0)));
      return [v0[0] + (v1[0] - v0[0]) * p, v0[1] + (v1[1] - v0[1]) * p, v0[2] + (v1[2] - v0[2]) * p];
    }
  }
  return views[views.length - 1][1];
};

const ReceiptView: React.FC<{ refId: string; t: number }> = ({ refId, t }) => {
  const rx = RX[refId];
  if (!rx) throw new Error('no receipt framing for ' + refId);
  const [vx, vy, vw] = lerpView(rx.views, t);
  const s = 1920 / vw;
  return (
    <AbsoluteFill style={{ background: rx.bg, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: rx.w, height: rx.h, transformOrigin: '0 0', transform: `scale(${s}) translate(${-vx}px, ${-vy}px)` }}>
        {rx.video ? (
          <OffthreadVideo src={staticFile('receipts/' + refId + '.mp4')} muted style={{ width: rx.w, height: rx.h }} />
        ) : (
          <Img src={staticFile('receipts/' + refId + '.png')} style={{ width: rx.w, height: rx.h, display: 'block' }} />
        )}
        {(rx.hl ?? []).map((h, i) => {
          const total = h.r.reduce((a, r) => a + r[2], 0);
          let done = clamp01((t - h.t) / h.d) * total;
          return h.r.map((r, j) => {
            const w = Math.max(0, Math.min(r[2], done));
            done -= r[2];
            return w > 0 ? (
              <div key={`${i}-${j}`} style={{ position: 'absolute', left: r[0] - 6, top: r[1] - 4, width: w + 12, height: r[3] + 8, background: '#ffe14d', mixBlendMode: 'multiply', borderRadius: 6 }} />
            ) : null;
          });
        })}
      </div>
      {refId === 'C20b-showcase-top' && (
        <div style={{ position: 'absolute', right: 60, top: 22, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          {TALLY.map((x) => {
            const p = outC(clamp01((t - x.t) / (8 / 30)));
            return (
              <div key={x.text} style={{ opacity: p, transform: `translateY(${(1 - p) * 10}px)`, background: '#fff', color: '#14161A', border: '1px solid #DDD9CF', borderLeft: '5px solid #007A55', borderRadius: 12, padding: '10px 22px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, fontSize: 34, boxShadow: '0 10px 26px rgba(20,22,26,.25)' }}>{x.text}</div>
            );
          })}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ================================================================================================ 5. CONTAINERS (one spotlight at a time)
// Card slides + system-design diagrams are the approved STATE PNGs, swapped with a 6-frame cross-fade on their words, with a
// gentle push across the whole appearance (section 7a: a still never sits dead). A row with state 's0' = the frame with its
// first item HELD BACK (EDIT-PLAN): the s1 still with that item ghosted exactly like the stylesheet's .ghost (opacity .38).
const HELD: Record<string, { box: [number, number, number, number]; under: string }> = {
  C26: { box: [221, 451, 486, 386], under: '246,244,238' },       // tile t1 on the page (box + its ring)
  'D-TELL': { box: [233, 391, 1454, 482], under: '255,255,255' }, // rows r1-r4 on the white card (measured, containers.html)
  E1: { box: [233, 421, 1454, 96], under: '255,255,255' },        // line l1
  'D-ENTRIES': { box: [233, 386, 1454, 96], under: '255,255,255' },
};
const stateSrc = (c: Cover) => {
  const st = c.state === 's0' && HELD[c.ref] ? 's1' : c.state;
  return (c.kind === 'diagram' ? 'diagrams/' : 'card-slides/') + `${c.ref}-${st}.png`;
};
const StatePane: React.FC<{ c: Cover; opacity: number }> = ({ c, opacity }) => (
  <AbsoluteFill style={{ opacity }}>
    <Img src={staticFile(stateSrc(c))} style={{ width: 1920, height: 1080 }} />
    {c.state === 's0' && HELD[c.ref] && (
      <div style={{ position: 'absolute', left: HELD[c.ref].box[0], top: HELD[c.ref].box[1], width: HELD[c.ref].box[2], height: HELD[c.ref].box[3], background: `rgba(${HELD[c.ref].under},.62)` }} />
    )}
  </AbsoluteFill>
);
const StateView: React.FC<{ rows: Cover[]; t: number }> = ({ rows, t }) => {
  let i = 0;
  for (let k = 0; k < rows.length; k++) if (t >= rows[k].tIn - 1e-6) i = k;
  const cur = rows[i];
  const p = i > 0 ? clamp01((t - cur.tIn) / (6 / 30)) : 1;
  const a = rows[0].tIn;
  const b = rows[rows.length - 1].tOut;
  const push = 1 + 0.03 * inOut(clamp01((t - a) / Math.max(0.1, b - a)));
  return (
    <AbsoluteFill style={{ background: '#F6F4EE', transform: `scale(${push})` }}>
      {i > 0 && p < 1 && <StatePane c={rows[i - 1]} opacity={1} />}
      <StatePane c={cur} opacity={p} />
    </AbsoluteFill>
  );
};

// ================================================================================================ the cover element (absolute clock)
const fill = { width: '100%', height: '100%', objectFit: 'cover' } as const;
const StillView: React.FC<{ refId: string; t: number; a: number; b: number }> = ({ refId, t, a, b }) => {
  const push = 1 + 0.05 * clamp01((t - a) / Math.max(0.1, b - a));
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: '#000' }}>
      <Img src={staticFile('img/' + refId + '.png')} style={{ ...fill, transform: `scale(${push})` }} />
    </AbsoluteFill>
  );
};
const ChartFor: React.FC<{ c: Cover; t: number }> = ({ c, t }) => {
  // every `chart` cover is a LIVE useCurrentFrame-driven component (lint_animated_charts): never a PNG
  if (c.ref === 'C3' || c.ref === 'C16' || c.ref === 'C14' || c.ref === 'C1' || c.ref === 'C5' || c.ref === 'C-NVDA'
    || c.ref === 'C-SPACEX' || c.ref === 'C2' || c.ref === 'C16-ZOOM' || c.ref === 'C23' || c.ref === 'C24') {
    return <LiveChart chartRef={c.ref} t={t} />;
  }
  throw new Error('chart without a live component: ' + c.ref);
};
/** One block = a contiguous run of rows of one ref (state swaps) or one receipt group. `t` = source second. */
const BlockView: React.FC<{ rows: Cover[]; t: number }> = ({ rows, t }) => {
  const c0 = rows[0];
  let cur = c0;
  for (const r of rows) if (t >= r.tIn - 1e-6) cur = r;
  switch (c0.kind) {
    case 'chart': return <ChartFor c={c0} t={t} />;
    case 'container': case 'deck': case 'diagram': return <StateView rows={rows} t={t} />;
    case 'still': return <StillView refId={c0.ref} t={t} a={c0.tIn} b={c0.tOut} />;
    case 'title': return <Img src={staticFile('title-slides/' + c0.ref + '.png')} style={{ width: 1920, height: 1080 }} />;
    case 'receipt': {
      const i = rows.indexOf(cur);
      const p = i > 0 ? clamp01((t - cur.tIn) / (6 / 30)) : 1;                       // xf6: a receipt's second stage
      return (
        <AbsoluteFill>
          {i > 0 && p < 1 && <ReceiptView refId={rows[i - 1].ref} t={t} />}
          <AbsoluteFill style={{ opacity: p }}><ReceiptView refId={cur.ref} t={t} /></AbsoluteFill>
        </AbsoluteFill>
      );
    }
    default: throw new Error('BlockView cannot render ' + c0.kind);
  }
};

// ================================================================================================ blocks + ingress
type Block = { rows: Cover[]; from: number; to: number; tail: number };
const groupKey = (c: Cover) => c.grp ?? c.ref;
const BLOCKS: Block[] = (() => {
  const out: Block[] = [];
  for (const c of COVERS) {
    const last = out[out.length - 1];
    const lr = last?.rows[last.rows.length - 1];
    if (lr && groupKey(lr) === groupKey(c) && Math.abs(lr.tOut - c.tIn) < 0.01 && (!c.tr || c.tr === 'xf6')) last.rows.push(c);
    else out.push({ rows: [c], from: 0, to: 0, tail: 0 });
  }
  for (const b of out) {
    b.from = F(b.rows[0].tIn);
    b.to = Fe(b.rows[b.rows.length - 1].tOut);
  }
  out.forEach((b, i) => {          // the outgoing block stays UNDER the incoming one for the length of its ingress
    const n = out[i + 1];
    if (n && n.from === b.to) {
      const tr = n.rows[0].tr ?? 'cut';
      if (tr === 'xf' || tr === 'fade' || tr === 'warp') b.tail = Math.round((n.rows[0].td ?? 0.35) * FPS);
      if (tr === 'paper') b.tail = 11;
    }
  });
  return out;
})();

const Ingress: React.FC<{ tr: Tr; td: number; chart: boolean; children: React.ReactNode }> = ({ tr, td, chart, children }) => {
  const f = useCurrentFrame();
  const n = tr === 'paper' ? 11 : Math.max(1, Math.round(td * FPS));
  const p = clamp01(f / n);
  if (tr === 'xf') {                       // hand:xfade-scale: cross-fade + 0.93 -> 1 (charts: opacity only, no scale on SVG text)
    const s = chart ? 1 : interpolate(outC(p), [0, 1], [0.93, 1]);
    return <AbsoluteFill style={{ opacity: outC(p), transform: `scale(${s})` }}>{children}</AbsoluteFill>;
  }
  if (tr === 'fade') return <AbsoluteFill style={{ opacity: p }}>{children}</AbsoluteFill>;   // hand:fade
  if (tr === 'paper') {                    // hand:paper-sheet: opacity + 0.97 -> 1 over the first 11 frames
    return <AbsoluteFill style={{ opacity: outC(p), transform: `scale(${0.97 + 0.03 * outC(p)})` }}>{children}</AbsoluteFill>;
  }
  if (tr === 'warp') {                     // hand:cross-warp: the incoming image warps in (scale + blur settle) over the outgoing
    const e = outC(p);
    return <AbsoluteFill style={{ opacity: e, transform: `scale(${1.12 - 0.12 * e}) skewX(${(1 - e) * -4}deg)`, filter: `blur(${(1 - e) * 14}px)` }}>{children}</AbsoluteFill>;
  }
  return <AbsoluteFill>{children}</AbsoluteFill>;
};

// MOTION move on a still cover (section 6 'MOTION moves'): the engine gets the live receipt as outClip; its clock is fitted
// to the slot with a Freeze (t * 5 / slot), wrapped in a zero-offset Sequence (section 6a rule 1, the Freeze clamp)
const MotionWrap: React.FC<{ id: string; slotFrames: number; children: () => React.ReactNode }> = ({ id, slotFrames, children }) => {
  const f = useCurrentFrame();
  const row = getTransition(id)!;
  const Engine = ENGINES[row.engine] as React.FC<any>;
  const n = Math.min(149, Math.round((f * 150) / Math.max(1, slotFrames)));
  return (
    <Sequence from={0} layout="none">
      <Freeze frame={n}>
        <Engine from={null} to={null} outClip={children} durationInFrames={150} params={row.params} />
      </Freeze>
    </Sequence>
  );
};

const VideoBlock: React.FC<{ c: Cover }> = ({ c }) => {
  if (c.kind === 'vid') return <OffthreadVideo src={staticFile('vid/' + c.ref + '.mp4')} muted playbackRate={rateOf(c.ref)} style={fill} />;
  if (c.kind === 'whiteboard') return <OffthreadVideo src={staticFile('whiteboard/' + c.ref + '.mp4')} startFrom={Math.round((c.from ?? 0) * FPS)} muted style={fill} />;
  // CLIP-8 lead-out: its LAST frame held as a still (EDIT-PLAN 0:09.8)
  return (
    <Sequence from={0} layout="none">
      <Freeze frame={106}><OffthreadVideo src={staticFile('clip-inserts/' + c.ref + '.mp4')} muted style={fill} /></Freeze>
    </Sequence>
  );
};

const BlockLayer: React.FC<{ b: Block }> = ({ b }) => {
  const t = useT();
  const c0 = b.rows[0];
  const isVid = c0.kind === 'vid' || c0.kind === 'whiteboard' || c0.kind === 'clipstill';
  const body = isVid ? <VideoBlock c={c0} /> : c0.mo ? (
    <MotionWrap id={c0.mo} slotFrames={b.to - b.from}>{() => <BlockView rows={b.rows} t={t} />}</MotionWrap>
  ) : <BlockView rows={b.rows} t={t} />;
  return (
    <Ingress tr={c0.tr ?? 'cut'} td={c0.td ?? 0.35} chart={c0.kind === 'chart'}>
      {body}
    </Ingress>
  );
};

// ================================================================================================ 3d. the CLIP-INSERT montage
// The spine pauses at 9.815 for 12.9 s; each clip plays FULL-FRAME and MUTED (its voice is already in the VO) over its own
// paused window, hard cuts between them (insert-in / insert-cut / insert-out = hand:cut, TRANSITION-PLAN bucket insert).
const Montage: React.FC = () => (
  <>
    {CLIPS.map((cl, i) => {
      const p = PAUSE_WIN[i];
      return (
        <Sequence key={cl.id} from={p.start} durationInFrames={p.frames} name={cl.id}>
          <OffthreadVideo src={staticFile('clip-inserts/' + cl.file + '.mp4')} muted style={fill} endAt={cl.frames} />
          {p.frames > cl.frames && (
            <Sequence from={cl.frames} layout="none">
              <Freeze frame={cl.frames - 1}><OffthreadVideo src={staticFile('clip-inserts/' + cl.file + '.mp4')} muted style={fill} /></Freeze>
            </Sequence>
          )}
        </Sequence>
      );
    })}
  </>
);

// ================================================================================================ 6. CHAPTER CARDS (hand:cube-3d)
// One 3D cube turn, in from the right, ~11 frames, HELD to the end of the pause, never cubed back out. The outgoing face is the
// frozen last frame of the cover it turns away from. A chapter title must read for at least 1 s.
const TURN = 11;
const CARDS = [
  { at: 79.2, img: 'title-CH2', out: 'BR-3-clock-rewind' },      // [CARD] WHY EVERYTHING DUMPED · hand:cube-3d
  { at: 265.6, img: 'title-CH3', out: 'BR-11-trader-desk' },     // [CARD] THE TRADES · hand:cube-3d
  { at: 471.33, img: 'title-CH5', out: 'title-CH5-s0' },         // [CARD] THE PLAN TO 2028 · hand:cube-3d (from the bare page)
];
const READABLE_S = PAUSE - TURN / FPS;
if (READABLE_S < 1.0) throw new Error(`chapter title readable ${READABLE_S.toFixed(2)} s < 1.0 s (comp-build section 6)`);
const CubeCard: React.FC<{ card: typeof CARDS[number] }> = ({ card }) => {
  const f = useCurrentFrame();
  const p = Easing.inOut(Easing.cubic)(clamp01(f / TURN));
  const prev = COVERS.find((c) => c.ref === card.out)!;
  const lastLocal = Fe(prev.tOut) - F(prev.tIn) - 1;
  const face = (deg: number, node: React.ReactNode) => (
    <AbsoluteFill style={{ backfaceVisibility: 'hidden', transform: `translateZ(-960px) rotateY(${deg}deg) translateZ(960px)` }}>{node}</AbsoluteFill>
  );
  const outgoing = prev.kind === 'vid' ? (
    <Sequence from={0} layout="none">
      <Freeze frame={lastLocal}><OffthreadVideo src={staticFile('vid/' + prev.ref + '.mp4')} muted playbackRate={rateOf(prev.ref)} style={fill} /></Freeze>
    </Sequence>
  ) : <Img src={staticFile('title-slides/' + prev.ref + '.png')} style={{ width: 1920, height: 1080 }} />;
  return (
    <AbsoluteFill style={{ background: '#000', perspective: 2600, overflow: 'hidden' }}>
      <AbsoluteFill style={{ transformStyle: 'preserve-3d' }}>
        {p < 1 && face(-90 * p, outgoing)}
        {face(90 * (1 - p), <Img src={staticFile('title-slides/' + card.img + '.png')} style={{ width: 1920, height: 1080 }} />)}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ================================================================================================ FACE layer (city-look swap clips)
const FaceLayer: React.FC = () => {
  const abs = useAbs();
  const s = punchAt(abs);
  return (
    <AbsoluteFill style={{ transformOrigin: `${FACE_POINT.x}px ${FACE_POINT.y}px`, transform: `scale(${s})` }}>
      {FACES.map((w) => (
        <Sequence key={w.id} from={F(w.a)} durationInFrames={faceEnd(w) - F(w.a)} name={w.id}>
          {/* PRE-FRAMED (section 3b): full frame, no FACE_REFRAME, from window_starts_at_clip_s, muted */}
          <OffthreadVideo src={staticFile('face-swap/' + w.id + '-higgsfield-bg-swap.mp4')} startFrom={w.clipStart} muted style={fill} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
/** The face node an engine mounts (the leaks): the SAME source (the swap clip of that window), the SAME transform (the punch
 *  scale of its side of the join), muted, on the ABSOLUTE clock in any nesting (startFrom = clip frame at abs - local frame). */
const FaceNode: React.FC<{ face: string; scale: number }> = ({ face, scale }) => {
  const abs = useAbs();
  const local = useCurrentFrame();
  const w = FACES.find((x) => x.id === face)!;
  const startFrom = Math.max(0, w.clipStart + (abs - F(w.a)) - local);
  return (
    <AbsoluteFill style={{ background: '#000', overflow: 'hidden' }}>
      <AbsoluteFill style={{ transformOrigin: `${FACE_POINT.x}px ${FACE_POINT.y}px`, transform: `scale(${scale})` }}>
        <OffthreadVideo src={staticFile('face-swap/' + face + '-higgsfield-bg-swap.mp4')} startFrom={startFrom} muted style={fill} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// The spine layer: FACE_REFRAME (section 3a) + the punch scale. Its picture only matters inside the FACE windows (COVER beats
// are black, and every FACE window airs its swap clip on top), so it is mounted there, muted; the VO is the spine's own audio.
const SpineLayer: React.FC = () => {
  const abs = useAbs();
  const s = punchAt(abs);
  return (
    <AbsoluteFill style={{ overflow: 'hidden', transformOrigin: `${FACE_POINT.x}px ${FACE_POINT.y}px`, transform: `scale(${s})` }}>
      {FACES.map((w) => (
        <Sequence key={w.id} from={F(w.a)} durationInFrames={faceEnd(w) - F(w.a)}>
          <OffthreadVideo src={staticFile('spine.mp4')} startFrom={F(w.a)} muted
            style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0',
              transform: `translate(${FACE_REFRAME.x}px, ${FACE_REFRAME.y}px) scale(${FACE_REFRAME.scale})` }} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// ================================================================================================ 6. FILM BURN (the face pick)
// hand:film-burn on all 14 face edges: a warm radial flash, 0.38 s each side of the cut, peaking ON the picture edge.
const FACE_EDGES = [7.022, 9.889, 16.289, 46.789, 53.555, 216.528, 223.961, 348.395, 359.395, 464.528, 471.195, 565.601, 570.567, 588.635];
const BURN_HALF = Math.round(0.38 * FPS);
const FilmBurn: React.FC = () => {
  const f = useCurrentFrame() - BURN_HALF;                 // 0 = the cut
  const q = f / BURN_HALF;                                  // -1 .. 1
  const env = Math.pow(Math.max(0, 1 - Math.abs(q)), 1.6);
  const drift = q * 260;
  return (
    <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: Math.min(1, env * 1.15), pointerEvents: 'none' }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 85% at ${38 + q * 18}% 55%, rgba(255,214,140,1) 0%, rgba(255,140,40,.95) 28%, rgba(214,60,10,.75) 55%, rgba(120,20,0,0) 80%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${70 - q * 10}% ${30 + drift / 40}%, rgba(255,240,200,.9) 0%, rgba(255,170,60,.6) 22%, rgba(255,90,0,0) 50%)` }} />
      <AbsoluteFill style={{ background: 'rgba(255,170,80,1)', opacity: env * 0.55 }} />
    </AbsoluteFill>
  );
};

// ================================================================================================ library transitions (exact ids)
const LibAt: React.FC<{ id: string; at: number; cutOffset?: number; out: () => React.ReactNode; inn: () => React.ReactNode; fromSrc?: string }> = ({ id, at, cutOffset = 0, out, inn, fromSrc }) => {
  const row = getTransition(id)!;
  const win = Math.round(row.durationSeconds * FPS);
  const half = Math.round(win / 2);
  // section 6a: a Sequence of EXACTLY the engine window, cutFrame = win/2, the SFX off (post-mix owns it)
  return (
    <Sequence from={F(at) + cutOffset - half} durationInFrames={win} name={id}>
      <TransitionClip id={id} cutFrame={half} outgoing={out} incoming={inn} sfx={false} fromSrc={fromSrc} />
    </Sequence>
  );
};
const AbsChart: React.FC<{ refId: string }> = ({ refId }) => <LiveChart chartRef={refId} t={useT()} />;
const AbsState: React.FC<{ refId: string; state: string; kind: Kind }> = ({ refId, state, kind }) => (
  <AbsoluteFill style={{ background: '#F6F4EE' }}><Img src={staticFile((kind === 'diagram' ? 'diagrams/' : 'card-slides/') + `${refId}-${state}.png`)} style={{ width: 1920, height: 1080 }} /></AbsoluteFill>
);
const AbsStill: React.FC<{ refId: string }> = ({ refId }) => {
  const c = COVERS.find((x) => x.ref === refId)!;
  return <StillView refId={refId} t={useT()} a={c.tIn} b={c.tOut} />;
};
const AbsReceipt: React.FC<{ refId: string }> = ({ refId }) => <ReceiptView refId={refId} t={useT()} />;
const TitleImg: React.FC<{ img: string }> = ({ img }) => <Img src={staticFile('title-slides/' + img + '.png')} style={{ width: 1920, height: 1080 }} />;

const LibraryTransitions: React.FC = () => (
  <>
    {/* glitch-still ingresses: Cinematic Bad Signal (bucket 2) */}
    <LibAt id="badsignal-max-3" at={30.4} out={() => <Img src={staticFile(CUTFRAME['BR-1-distressed-trader'])} style={fill} />} inn={() => <AbsStill refId="IMG-1-trader-red-monitors" />} />   {/* lib:badsignal-max-3, BR-1 (its CUTFRAME) -> IMG-1 */}
    <LibAt id="badsignal-max-2" at={74.15} out={() => <AbsState refId="C26" state="s4" kind="deck" />} inn={() => <AbsStill refId="IMG-2-newsroom-dusk" />} />   {/* lib:badsignal-max-2, C26 -> IMG-2 */}
    <LibAt id="badsignal-short-3" at={257.9} out={() => <AbsReceipt refId="R-NVDA-CHART-tradingview-nvda-daily" />} inn={() => <AbsStill refId="IMG-4-empty-trading-floor" />} />   {/* lib:badsignal-short-3 */}
    <LibAt id="badsignal-short-1" at={265.7} cutOffset={-3} out={() => <TitleImg img="title-CH3" />} inn={() => <AbsStill refId="IMG-5-pieverse-coin" />} />   {/* lib:badsignal-short-1, CH3 card -> IMG-5, straddling the resume */}
    <LibAt id="badsignal-short-2" at={300.15} out={() => <AbsChart refId="C16" />} inn={() => <AbsStill refId="IMG-6-evaa-coin" />} />   {/* lib:badsignal-short-2 */}
    {/* the reserved marquees: ONE melt look (MELT/RGB soft) x2 + ONE spin look (SPIN/Center Swinging) x1 */}
    <LibAt id="melt-rgb-soft-2" at={201.45} out={() => <AbsChart refId="C-SPACEX" />} inn={() => <AbsChart refId="C1" />} />   {/* lib:melt-rgb-soft-2, TRANSFORM */}
    <LibAt id="melt-rgb-soft-short-2" at={326.05} out={() => <AbsState refId="D-ROTATE" state="s3" kind="diagram" />} inn={() => <AbsChart refId="C14" />} />   {/* lib:melt-rgb-soft-short-2, TRANSFORM */}
    <LibAt id="spin-center-swinging-cw" at={444.58} out={() => <AbsChart refId="C16-ZOOM" />} inn={() => <AbsState refId="C22" state="s1" kind="diagram" />} />   {/* lib:spin-center-swinging-cw, NEW FACET */}
  </>
);
// [PUNCH-IN] + [LIGHTLEAK]: the library leak peaking ON the join frame, the punch scale stepping there (the engine swaps at
// p >= cut 0.4 = window frame 5, so the window is placed one frame late to put the swap ON F(join))
const Leaks: React.FC = () => (
  <>
    {PUNCHES.map((p) => (
      <LibAt key={p.at} id={p.leak} at={p.at} cutOffset={1}
        out={() => <FaceNode face={p.face} scale={1} />} inn={() => <FaceNode face={p.face} scale={PUNCH} />} />
    ))}
  </>
);

// ================================================================================================ 8. CAPTIONS (house style)
// Generated by build_captions.py (montserrat, 2 words, up to 4 short) into PlanToMakeMillionsCaptions.ts; only inside the
// CAPTION_WINDOWS (FACE 1-3, Mike 2026-11-22: captions in the intro only), topmost. Times are source seconds -> sh().
const CAPS = ZCAPTIONS.map((c) => ({ tf: sh(c.t), h: c.h }));
const CAP_WIN = CAPTION_WINDOWS.map(([a, b]) => [sh(a), sh(b)] as [number, number]);
const Captions: React.FC = () => {
  const t = useAbs() / FPS;
  if (!CAP_WIN.some(([a, b]) => t >= a && t < b)) return null;
  let cur: { tf: number; h: string } | null = null;
  for (const c of CAPS) { if (c.tf <= t) cur = c; else break; }
  if (!cur) return null;
  const nextT = (CAPS.find((c) => c.tf > cur!.tf) || { tf: Infinity }).tf;
  if (t >= Math.min(nextT, cur.tf + 1.3)) return null;
  const k = (t - cur.tf) * FPS;
  const pop = interpolate(k, [0, 3, 6], [0.7, 1.12, 1], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 120, pointerEvents: 'none' }}>
      <div style={{ fontFamily: `${MONTSERRAT},'Arial Black','Segoe UI',sans-serif`, fontWeight: 900, textTransform: 'lowercase', fontSize: 92,
        color: '#fff', WebkitTextStroke: '12px #000', paintOrder: 'stroke fill', transform: `scale(${pop})`, textAlign: 'center', lineHeight: 1.05, maxWidth: 1600 }}>
        {cur.h}
      </div>
    </AbsoluteFill>
  );
};

// ================================================================================================ the composition
// `captions` (default ON) lets the short lane render 9:16 spans without the burned 16:9 caption track (longform-to-short.md);
// `pops` is accepted for the painter's props and unused (this comp has no kinetic word pops).
export const PlanToMakeMillions: React.FC<{ captions?: boolean; pops?: boolean }> = ({ captions = true }) => {
  const abs = useCurrentFrame();
  return (
    <AbsCtx.Provider value={abs}>
      <AbsoluteFill style={{ background: '#000' }}>
        <ChartStyles />
        <Audio src={staticFile('spine.mp4')} />{/* the VO = the paused spine's own audio (the only sound in the comp) */}
        <SpineLayer />
        <FaceLayer />
        <Montage />
        {CARDS.map((c) => {
          const p = PAUSE_WIN.find((w) => w.at === c.at)!;
          const nextRow = COVERS.find((r) => Math.abs(r.tIn - c.at) < 0.01 && r.kind !== 'title');
          // the card stays UNDER the entry of the chapter's first cover for the length of its cross-fade / fade / warp
          const tail = nextRow && ['xf', 'fade', 'warp'].includes(nextRow.tr ?? 'cut') ? Math.round((nextRow.td ?? 0.35) * FPS) : 0;
          return (
            <Sequence key={c.img} from={p.start} durationInFrames={p.frames + tail} name={c.img}>
              <CubeCard card={c} />
            </Sequence>
          );
        })}
        {BLOCKS.map((b, i) => (
          <Sequence key={i} from={b.from} durationInFrames={b.to - b.from + b.tail} name={b.rows[0].ref}>
            <BlockLayer b={b} />
          </Sequence>
        ))}
        <LibraryTransitions />
        <Leaks />
        {FACE_EDGES.map((e) => (
          <Sequence key={e} from={F(e) - BURN_HALF} durationInFrames={2 * BURN_HALF + 1} name={`burn-${e}`}>
            <FilmBurn />{/* hand:film-burn (face-cut, 0.76s) */}
          </Sequence>
        ))}
        {captions && <Captions />}
      </AbsoluteFill>
    </AbsCtx.Provider>
  );
};

// TaoDetailed.tsx — longform-edited comp for media/tao-detailed ("The TAO Story Nobody Tells You").
// Built TO the approved blueprint (EDIT-PLAN.md · CUE-SHEET.md · TRANSITIONS.md / TRANSITION-PLAN.json · COVER-PLAN.json ·
// AS-RECORDED.md · PROJECT-LOG Open flags) per skills/comp-build/comp-build.md. Public dir = media/tao-detailed/assets.
// No music, no SFX, no watermark here: audio = the paused spine's VO only (§9, post-mix owns the beds + hits).
//
// Every cue below is a SOURCE-spine second (spine/ALL.f.pickup.mp4, 758.419 s) routed through sh()/F(): the paused spine
// (assets/spine.mp4 = spine/ALL.h.paused.mp4, 780.84 s) carries three 1.5 s title-card pauses, the 4.0 s BRAAM beat pause
// (Mike 2026-10-17 draft notes: the braam plays BETWEEN sentences, the voice silent) and the 13.9 s CLIP-1 insert pause;
// the sidecar's pauses[] IS the time map (§3d).
//
// Declared refs (lint-deck-containers.py): the diagrams are system-design stills (Type 2), spotlighted one state at a time.
// DIAGRAM_REFS: D1-network, D1-subnets, D1-miners, D1-validators, D1-tao, D1-cap, C1-overview, C1-relaunch, D2-base, D2-chain, D2-poison, D2-store, D2-install, D2-keys, C6-operator, C6-model, C6-params, C6-nodes, C6-442-exit, C6-442-token, C6-442-teutonic, D3-base, D3-twist, D3-fees, D3-later, D4-root, D4-hold, D4-before, D5-claim, D5-stake, D5-alpha, D5-loop, D6-base, D6-production, D6-scarcity, D6-badge, D6-ownership
// (end declared refs)
import React, { createContext, useContext } from 'react';
import { AbsoluteFill, Easing, Freeze, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { TransitionClip } from './transitions/TransitionClip';
import { getTransition, framesForRow, ENGINES } from './transitions/registry';
import { ZCAPTIONS, CAPTION_WINDOWS } from './TaoDetailedCaptions';
import { CHARTS } from './TaoDetailedCharts';

const { fontFamily: MONTSERRAT } = loadMontserrat('normal', { weights: ['900'], subsets: ['latin'], ignoreTooManyRequestsWarning: true });

// ════════════════════════════════════════ §2/§3d TIMING ════════════════════════════════════════
export const FPS = 30;
export const SPINE_SECS = 758.419;                 // SOURCE spine (the sidecar's `source`, ALL.f.pickup.mp4)
export const PAUSE = 1.5;                          // title-card pause (sidecar pause_s)
export const CARD_T = [76.485, 291.794, 511.0];    // card rows of spine/ALL.h.paused.json pauses[]
// EVERY pause of the sidecar (cards + the BRAAM beat pause + the CLIP-1 insert): the time map. sh(t) = t + sum(dur with at <= t).
// The beat pause sits INSIDE the K9 cover (after "dollars.", before D2 on "Here's"), so K9's figures hold through it.
export const INSERTS = [
  { at: 76.485, dur: 1.5 },
  { at: 197.81, dur: 4.0 },
  { at: 291.794, dur: 1.5 },
  { at: 511.0, dur: 1.5 },
  { at: 634.66, dur: 13.9 },
];
export const sh = (t: number) => t + INSERTS.filter((p) => p.at <= t).reduce((s, p) => s + p.dur, 0);
const cardStart = (b: number) => b + INSERTS.filter((p) => p.at < b).reduce((s, p) => s + p.dur, 0);
export const F = (t: number) => Math.round(sh(t) * FPS);
const PF = (at: number) => Math.round(cardStart(at) * FPS);        // first frame of a pause (its frozen / inserted span)
const SPINE_FRAMES = Math.round((SPINE_SECS + INSERTS.reduce((s, p) => s + p.dur, 0)) * FPS);   // 23425 = assets/spine.mp4
// END CARD (Mike 2026-10-16 plan gate + MUSIC-PLAN end_card_hold): K30 is held past the last spine frame to 764.68 so
// Bed D's epic_hit chord rings out over it; the comp renders to sh(764.68).
const END_HOLD_T = 764.68;
export const DUR = F(END_HOLD_T);

// ════════════════════════════════════════ §3a FACE REFRAME ════════════════════════════════════════
export const FACE_REFRAME = { scale: 1.407, x: -667, y: -252 };   // assets/face-reframe.json, never hand-tuned
const FACE_POINT = { x: 960, y: 432 };                            // json face_point_out: punch-ins scale about it
const PUNCH = 1.18;                                               // hard ~18% step ON a desilencer join

// FACE windows (AS-RECORDED / COVER-PLAN face_windows, SOURCE s) + their desilencer-join punches (spine/jumpcuts-final.json
// punch candidates = TRANSITION-PLAN punch-glitch rows). F1 / F4: no join outside the 0.5 s edge margin -> no punch.
// s / e / jf = MEASURED output frames on assets/spine.mp4 (what actually airs; _previews/qa/tools/probe_frames.py +
// map_frames.py, 2026-10-17; s / e re-measured on the re-baked spine with the BRAAM beat pause, same day): the baked face edges sit 1 frame after round(sh(t)*30) from F2 on, and the paused bake
// carries a 1-3 frame picture offset at the joins, so the punch step lands on the REAL jump-cut frame, never F(join).
// s = first lit face frame, e = first frame after the face (exclusive), jf = first frame after each join.
const FACES: { a: number; b: number; joins: number[]; s: number; e: number; jf: number[] }[] = [
  { a: 0.0, b: 6.9, joins: [], s: 0, e: 207, jf: [] },                                     // F1 opens the video
  { a: 49.733, b: 52.133, joins: [51.4], s: 1493, e: 1565, jf: [1544] },                   // F2 (jump visible @1544)
  { a: 67.567, b: 76.5, joins: [70.267, 73.967], s: 2028, e: 2296, jf: [2111, 2222] },     // F3 (visible; ends at the CH2 pause)
  { a: 179.9, b: 183.633, joins: [], s: 5444, e: 5555, jf: [] },                           // F4
  { a: 278.867, b: 285.067, joins: [284.567], s: 8533, e: 8719, jf: [8703] },              // F5 (seamless join)
  { a: 361.467, b: 370.233, joins: [367.2, 369.567], s: 11056, e: 11319, jf: [11229, 11298] }, // F6 (seamless)
  { a: 452.333, b: 458.2, joins: [455.233, 457.367], s: 13782, e: 13959, jf: [13871, 13932] }, // F7 (13871 visible)
  { a: 634.667, b: 637.833, joins: [636.733], s: 19712, e: 19810, jf: [19776] },           // F8 (entered from the CLIP-1 insert)
  { a: 654.533, b: 658.267, joins: [657.1], s: 20310, e: 20422, jf: [20388] },             // F9 (seamless)
  { a: 727.167, b: 733.0, joins: [731.8], s: 22489, e: 22665, jf: [22629] },               // F10 (seamless)
];
const FACE_F = FACES.map((w) => ({ s: w.s, e: w.e, joins: w.jf }));
const punchAt = (frame: number) => {
  const w = FACE_F.find((x) => frame >= x.s && frame < x.e);
  if (!w) return 1;
  const n = w.joins.filter((j) => j <= frame).length;      // alternate in / back out across the window's joins
  return n % 2 === 1 ? PUNCH : 1;
};

// ════════════════════════════════════════ absolute clock (§6a) ════════════════════════════════════════
const AbsCtx = createContext(0);
const useAbs = () => useContext(AbsCtx);
const tsOf = (abs: number, tIn: number) => abs / FPS - (sh(tIn) - tIn);   // abs frame -> SOURCE seconds (no pause inside a cover)

const fill: React.CSSProperties = { position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, objectFit: 'cover' };

// ════════════════════════════════════════ the spine ════════════════════════════════════════
const spineStyle: React.CSSProperties = {
  position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0',
  transform: `translate(${FACE_REFRAME.x}px, ${FACE_REFRAME.y}px) scale(${FACE_REFRAME.scale})`,
};
const SpineFrame: React.FC<{ frame: number; children: React.ReactNode }> = ({ frame, children }) => (
  <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: 'black' }}>
    <div style={{ position: 'absolute', inset: 0, transformOrigin: `${FACE_POINT.x}px ${FACE_POINT.y}px`, transform: `scale(${punchAt(frame)})` }}>
      {children}
    </div>
  </AbsoluteFill>
);
/** §6a SpineStill: a REAL <Freeze> of the spine frame that airs, MUTED, with the same FACE_REFRAME + punch transform,
 *  same source (spine.mp4; this video has no background-swap clip). */
const SpineStill: React.FC<{ frame: number }> = ({ frame }) => (
  <SpineFrame frame={frame}>
    <Freeze frame={frame}>
      <OffthreadVideo src={staticFile('spine.mp4')} muted style={spineStyle} />
    </Freeze>
  </SpineFrame>
);
/** The face side handed to an engine: live (abs-clock synced, muted) inside the face window, a Freeze of the window's
 *  first / last frame outside it, so it can never walk into the cover-blackout region. */
const SpineNode: React.FC<{ face: number }> = ({ face }) => {
  const abs = useAbs();
  const local = useCurrentFrame();
  const w = FACE_F[face];
  if (abs < w.s) return <SpineStill frame={w.s} />;
  if (abs >= w.e) return <SpineStill frame={w.e - 1} />;
  return (
    <SpineFrame frame={abs}>
      <OffthreadVideo src={staticFile('spine.mp4')} muted startFrom={Math.max(0, abs - local)} style={spineStyle} />
    </SpineFrame>
  );
};

// ════════════════════════════════════════ §4 COVER rows (one per state / sub-point) ════════════════════════════════════════
// kind: vid (Envato) · still (ChatGPT image; `motion` = its Seedance clip, PROJECT-LOG Open flags) · receipt (capture,
// `cam` = [fx%, fy%, scale] start -> end, `ov` = comp overlay, `note` = lower caption) · container (card-slides PNG) ·
// deck (diagrams PNG, a system-design state) · chart (REAL animated component). `grp` = one asset's state rows: a
// contiguous same-grp row is a STATE SWAP (6-8 f cross-fade on identical geometry, NO ingress transition, §5).
type Cover = {
  tIn: number; tOut: number; kind: 'vid' | 'still' | 'receipt' | 'container' | 'deck' | 'chart'; ref: string;
  state?: string; grp?: string; cam?: number[]; ov?: string; note?: string; motion?: string; ingf?: number;
  grade?: string; lead?: boolean; cap?: boolean;
  // `mo` = a library single-scene CAMERA MOVE (MOTION category: motion-3d-pan-* / motion-shake-3d-*) over the receipt and its
  // push (Mike 2026-10-17 draft notes); a pan is fitted to the slot, a shake ping-pongs its baked 2 s wiggle. Rows of one
  // capture (`grp`) that share a `mo` run ONE continuous move across the group.
  mo?: string;
  // `bz` = BEAT ZOOM (Mike 2026-10-17, after the final): through a braam beat pause inside this cover, a slow eased zoom to
  // the figure at (x, y) (slide px) up to scale s, the point drifting to frame centre; it holds after the pause
  bz?: { x: number; y: number; s: number };
};
const COVERS: Cover[] = [
  // ── CH1 THE HOOK (gold) ──
  { tIn: 6.9, tOut: 9.5, kind: 'vid', ref: 'BR-1-night-tower-looking-up' },
  { tIn: 9.5, tOut: 11.78, kind: 'container', ref: 'H0', state: 'question', ov: 'atmo' },
  { tIn: 11.78, tOut: 15.0, kind: 'receipt', ref: 'R1', cam: [50, 45, 1.0, 50, 45, 1.06], ingf: 9 },
  { tIn: 15.0, tOut: 18.9, kind: 'vid', ref: 'BR-2-robot-arm-moody-factory' },
  { tIn: 18.9, tOut: 21.98, kind: 'still', ref: 'IMG-1-neural-machine-hall', motion: 'IMG-1-neural-machine-hall-slowmo' },
  { tIn: 21.98, tOut: 24.6, kind: 'container', ref: 'H1', state: 'yuma-rao' },
  { tIn: 24.6, tOut: 27.78, kind: 'vid', ref: 'BR-3-paper-into-shredder-dark' },
  { tIn: 27.78, tOut: 30.2, kind: 'container', ref: 'H2', state: 'block-0' },
  { tIn: 30.2, tOut: 32.6, kind: 'vid', ref: 'BR-4-server-leds-powering-on' },
  { tIn: 32.6, tOut: 36.4, kind: 'vid', ref: 'BR-5-hands-laptop-green-room', grade: 'hue-rotate(70deg) saturate(0.3) brightness(0.95) contrast(1.08)' },
  { tIn: 36.4, tOut: 40.4, kind: 'still', ref: 'IMG-2-venom-package-rack' },
  { tIn: 40.4, tOut: 43.4, kind: 'vid', ref: 'BR-6-vault-corridor-push-closed' },
  { tIn: 43.4, tOut: 46.4, kind: 'container', ref: 'H3', state: '72b' },
  { tIn: 46.4, tOut: 49.733, kind: 'vid', ref: 'BR-7-night-earth-network-arcs' },
  { tIn: 52.133, tOut: 55.5, kind: 'vid', ref: 'BR-8-capitol-dome-night-push' },
  { tIn: 55.5, tOut: 58.5, kind: 'container', ref: 'H4', state: '18-days' },
  { tIn: 58.5, tOut: 62.1, kind: 'vid', ref: 'BR-9-candles-surge-cyan-dark' },
  { tIn: 62.1, tOut: 64.8, kind: 'vid', ref: 'BR-10-gpu-rig-glowing-fans' },
  { tIn: 64.8, tOut: 67.567, kind: 'container', ref: 'H5', state: '1.3m' },
  // ── CH2 THE BACKSTORY (purple) ──
  { tIn: 76.5, tOut: 81.5, kind: 'deck', ref: 'D1-network', state: 'network', grp: 'D1' },
  { tIn: 81.5, tOut: 82.82, kind: 'deck', ref: 'D1-subnets', state: 'subnets', grp: 'D1' },
  { tIn: 82.82, tOut: 84.36, kind: 'deck', ref: 'D1-miners', state: 'miners', grp: 'D1' },
  { tIn: 84.36, tOut: 86.56, kind: 'deck', ref: 'D1-validators', state: 'validators', grp: 'D1' },
  { tIn: 86.56, tOut: 88.62, kind: 'deck', ref: 'D1-tao', state: 'tao', grp: 'D1' },
  { tIn: 88.62, tOut: 90.08, kind: 'deck', ref: 'D1-cap', state: 'cap', grp: 'D1' },
  { tIn: 90.08, tOut: 97.8, kind: 'container', ref: 'K1', state: 'founders' },
  { tIn: 97.8, tOut: 101.5, kind: 'receipt', ref: 'R4', cam: [50, 33, 1.05, 47, 32, 1.6], ov: 'R4' },
  { tIn: 101.5, tOut: 108.52, kind: 'receipt', ref: 'C12', cam: [50, 30, 1.0, 50, 16, 2.2] },
  { tIn: 108.52, tOut: 111.48, kind: 'vid', ref: 'BR-11-hooded-figure-faceless' },
  { tIn: 111.48, tOut: 117.9, kind: 'receipt', ref: 'C13', state: 'wide', grp: 'C13', cam: [48, 32, 1.0, 46, 28, 1.12] },
  { tIn: 117.9, tOut: 121.38, kind: 'receipt', ref: 'C13', state: 'withdrawn', grp: 'C13', cam: [46, 28, 1.12, 13, 11, 2.7] },
  { tIn: 121.38, tOut: 125.7, kind: 'receipt', ref: 'R3-headline', grp: 'R3', cam: [50, 42, 1.0, 50, 40, 1.15], mo: 'motion-3d-pan-1-up' },
  { tIn: 125.7, tOut: 128.82, kind: 'receipt', ref: 'R3', grp: 'R3', cam: [42, 24, 1.45, 42, 25, 1.85], mo: 'motion-shake-3d-2x' },
  { tIn: 128.82, tOut: 131.94, kind: 'vid', ref: 'BR-12-saturn-v-night-ignition' },
  { tIn: 131.94, tOut: 135.5, kind: 'receipt', ref: 'C11', state: 'fair-launch', grp: 'C11', cam: [45, 30, 1.0, 36, 22, 1.55], mo: 'motion-shake-3d-3x' },
  { tIn: 135.5, tOut: 138.9, kind: 'receipt', ref: 'C11', state: 'ai-bitcoin', grp: 'C11', cam: [36, 22, 1.55, 33, 31, 1.65], mo: 'motion-shake-3d-3x' },
  { tIn: 138.9, tOut: 143.96, kind: 'container', ref: 'K5', state: 'claim-caveat' },
  { tIn: 143.96, tOut: 144.9, kind: 'deck', ref: 'C1-overview', state: 'overview', grp: 'C1' },
  { tIn: 144.9, tOut: 153.96, kind: 'deck', ref: 'C1-relaunch', state: 'relaunch-2021', grp: 'C1' },
  { tIn: 153.96, tOut: 160.36, kind: 'container', ref: 'C1-154', state: 'rung-2023' },
  { tIn: 160.36, tOut: 167.74, kind: 'container', ref: 'C1-160', state: 'rung-dtao' },
  { tIn: 167.74, tOut: 171.74, kind: 'vid', ref: 'BR-13-people-phones-world-grid' },
  { tIn: 171.74, tOut: 179.9, kind: 'container', ref: 'C1-172', state: 'rung-halving' },
  { tIn: 183.633, tOut: 188.7, kind: 'receipt', ref: 'C14-headline', grp: 'C14', cam: [46, 42, 1.12, 46, 42, 1.3] },
  { tIn: 188.7, tOut: 192.5, kind: 'receipt', ref: 'C14', grp: 'C14', cam: [47, 54, 1.6, 47, 58, 2.1], ov: 'C14-hl' },
  { tIn: 192.5, tOut: 197.86, kind: 'container', ref: 'K9', state: '32k-tao', bz: { x: 438, y: 638, s: 2.4 } },
  { tIn: 197.86, tOut: 199.06, kind: 'deck', ref: 'D2-base', state: 'base', grp: 'D2' },
  { tIn: 199.06, tOut: 200.46, kind: 'deck', ref: 'D2-chain', state: 'chain', grp: 'D2' },
  { tIn: 200.46, tOut: 203.32, kind: 'deck', ref: 'D2-poison', state: 'poison', grp: 'D2' },
  { tIn: 203.32, tOut: 205.92, kind: 'deck', ref: 'D2-store', state: 'store', grp: 'D2' },
  { tIn: 205.92, tOut: 207.18, kind: 'deck', ref: 'D2-install', state: 'install', grp: 'D2' },
  { tIn: 207.18, tOut: 208.32, kind: 'deck', ref: 'D2-keys', state: 'keys', grp: 'D2' },
  { tIn: 208.32, tOut: 211.68, kind: 'still', ref: 'IMG-3-key-kiosk-vault' },
  { tIn: 211.68, tOut: 215.5, kind: 'vid', ref: 'BR-14-man-carries-box-out' },
  { tIn: 215.5, tOut: 220.78, kind: 'receipt', ref: 'C18-headline', grp: 'C18', cam: [47, 30, 1.0, 47, 27, 1.25], mo: 'motion-shake-3d-4x' },
  { tIn: 220.78, tOut: 225.36, kind: 'receipt', ref: 'C18', grp: 'C18', cam: [45, 42, 1.5, 44, 44, 2.1], note: 'As reported, tao.media, May 2026' },
  { tIn: 225.36, tOut: 228.5, kind: 'receipt', ref: 'R5', cam: [40, 50, 1.0, 40, 50, 1.06], ov: 'R5', note: 'Intraday, as reported (tao.media / bex.co)' },
  { tIn: 228.5, tOut: 234.1, kind: 'container', ref: 'K10', state: 'sn3-teutonic' },
  { tIn: 234.1, tOut: 240.2, kind: 'container', ref: 'C1-234', state: 'rung-ceo' },
  { tIn: 240.2, tOut: 243.5, kind: 'vid', ref: 'BR-15-lower-manhattan-backlit-aerial' },
  { tIn: 243.5, tOut: 247.8, kind: 'receipt', ref: 'C15-headline', grp: 'C15', cam: [46, 63, 1.55, 46, 62, 1.68] },
  { tIn: 247.8, tOut: 251.26, kind: 'receipt', ref: 'C15', grp: 'C15', cam: [55, 47, 1.6, 55, 48, 2.1], ov: 'C15-hl' },
  { tIn: 251.26, tOut: 254.86, kind: 'receipt', ref: 'C16', grp: 'C16', cam: [50, 22, 1.2, 50, 24, 1.4], note: 'S-1/A filed 2026-04-02, not effective (as of 2026-10-14)', mo: 'motion-shake-3d-1x' },
  { tIn: 254.86, tOut: 260.54, kind: 'receipt', ref: 'C16-gtao-sentence', grp: 'C16', cam: [40, 31, 1.8, 40, 32, 2.3], note: 'S-1/A filed 2026-04-02, not effective (as of 2026-10-14)' },
  { tIn: 260.54, tOut: 268.82, kind: 'receipt', ref: 'C17', cam: [50, 30, 1.0, 50, 40, 1.9] },
  { tIn: 268.82, tOut: 270.56, kind: 'receipt', ref: 'R2', grp: 'R2', cam: [50, 50, 1.0, 50, 50, 1.02] },
  { tIn: 270.56, tOut: 272.42, kind: 'receipt', ref: 'R2-jun12', grp: 'R2', cam: [50, 50, 1.02, 50, 50, 1.04], ov: 'R2-jun12' },
  { tIn: 272.42, tOut: 275.1, kind: 'receipt', ref: 'R2-jun14', grp: 'R2', cam: [50, 50, 1.04, 50, 50, 1.06], ov: 'R2-jun14' },
  { tIn: 275.1, tOut: 278.867, kind: 'receipt', ref: 'R6', cam: [45, 45, 1.0, 45, 45, 1.08], ov: 'R6' },
  { tIn: 285.067, tOut: 288.4, kind: 'vid', ref: 'BR-16-montreal-skyline-dusk' },
  { tIn: 288.4, tOut: 290.7, kind: 'receipt', ref: 'R7', grp: 'R7', cam: [45, 50, 1.0, 45, 50, 1.08] },
  { tIn: 290.7, tOut: 291.794, kind: 'receipt', ref: 'R7-speakers', grp: 'R7', cam: [20, 40, 1.5, 9, 36, 2.0] },
  // ── CH3 THE SUBNETS (cyan) ──
  { tIn: 291.794, tOut: 298.4, kind: 'container', ref: 'K31', state: '128-slots' },
  { tIn: 298.4, tOut: 306.66, kind: 'chart', ref: 'C4' },
  { tIn: 306.66, tOut: 314.2, kind: 'receipt', ref: 'C19', cam: [56, 26, 1.15, 56, 25, 1.42], note: 'Estimates, not audits; as reported' },
  { tIn: 314.2, tOut: 315.86, kind: 'container', ref: 'K12-s1', state: 'rest', grp: 'K12' },
  { tIn: 315.86, tOut: 317.9, kind: 'container', ref: 'K12-s2', state: 'lium-chutes', grp: 'K12' },
  { tIn: 317.9, tOut: 321.54, kind: 'container', ref: 'K12-s3', state: 'sn3', grp: 'K12' },
  { tIn: 321.54, tOut: 327.24, kind: 'container', ref: 'K13', state: 'lium' },
  { tIn: 327.24, tOut: 335.4, kind: 'receipt', ref: 'C25-lium-ownyourmind-bench', cam: [40, 45, 1.3, 40, 50, 1.85] },
  { tIn: 335.4, tOut: 341.1, kind: 'receipt', ref: 'R8', cam: [32, 40, 1.4, 29, 42, 2.2] },
  { tIn: 341.1, tOut: 345.0, kind: 'vid', ref: 'BR-17-server-aisle-flythrough-lead' },
  { tIn: 345.0, tOut: 356.08, kind: 'chart', ref: 'C5' },
  { tIn: 356.08, tOut: 361.467, kind: 'container', ref: 'K14', state: 'buyback' },
  { tIn: 370.233, tOut: 375.4, kind: 'container', ref: 'K15', state: 'chutes' },
  { tIn: 375.4, tOut: 383.1, kind: 'receipt', ref: 'C25-chutes', cam: [50, 40, 1.0, 50, 40, 1.06] },
  { tIn: 383.1, tOut: 386.5, kind: 'vid', ref: 'BR-18-light-streams-data-flow' },
  { tIn: 386.5, tOut: 391.7, kind: 'receipt', ref: 'R9', cam: [50, 20, 1.7, 50, 22, 2.3], note: 'OpenRouter peak about 42B tokens a day on 2026-02-07 (ownyourmind.ai)' },
  { tIn: 391.7, tOut: 394.82, kind: 'container', ref: 'K16-s1', state: 'revenue', grp: 'K16' },
  { tIn: 394.82, tOut: 400.76, kind: 'container', ref: 'K16-s2', state: 'free-tier', grp: 'K16' },
  { tIn: 400.76, tOut: 404.76, kind: 'still', ref: 'IMG-4-cracked-turnstile-tokens' },
  { tIn: 404.76, tOut: 409.4, kind: 'container', ref: 'K17', state: 'durbin-quote' },
  { tIn: 409.4, tOut: 413.2, kind: 'vid', ref: 'BR-19-neural-filaments-pulsing' },
  { tIn: 413.2, tOut: 416.38, kind: 'deck', ref: 'C6-operator', state: 'operator', grp: 'C6' },
  { tIn: 416.38, tOut: 420.54, kind: 'deck', ref: 'C6-model', state: 'model', grp: 'C6' },
  { tIn: 420.54, tOut: 422.56, kind: 'deck', ref: 'C6-params', state: 'params', grp: 'C6' },
  { tIn: 422.56, tOut: 424.74, kind: 'deck', ref: 'C6-nodes', state: 'nodes', grp: 'C6' },
  { tIn: 424.74, tOut: 432.56, kind: 'container', ref: 'K18', state: 'mmlu' },
  { tIn: 432.56, tOut: 438.46, kind: 'receipt', ref: 'R10', cam: [50, 45, 1.3, 50, 53, 2.0] },
  { tIn: 438.46, tOut: 441.58, kind: 'vid', ref: 'BR-20-empty-office-dark-monitors' },
  { tIn: 441.58, tOut: 443.96, kind: 'deck', ref: 'C6-442-exit', state: 'exit', grp: 'C6x' },
  { tIn: 443.96, tOut: 446.02, kind: 'deck', ref: 'C6-442-token', state: 'token', grp: 'C6x' },
  { tIn: 446.02, tOut: 452.333, kind: 'deck', ref: 'C6-442-teutonic', state: 'teutonic', grp: 'C6x' },
  { tIn: 458.2, tOut: 460.38, kind: 'vid', ref: 'BR-21-server-racks-lateral-track' },
  { tIn: 460.38, tOut: 467.66, kind: 'container', ref: 'K19', state: 'targon' },
  { tIn: 467.66, tOut: 473.46, kind: 'container', ref: 'K20', state: 'affine' },
  { tIn: 473.46, tOut: 484.22, kind: 'container', ref: 'K21', state: 'vanta-ridges' },
  { tIn: 484.22, tOut: 485.72, kind: 'container', ref: 'K22-s1', state: 'hippius', grp: 'K22' },
  { tIn: 485.72, tOut: 489.44, kind: 'container', ref: 'K22-s2', state: 'macrocosmos', grp: 'K22' },
  { tIn: 489.44, tOut: 491.56, kind: 'container', ref: 'K22-s3', state: 'bitmind', grp: 'K22' },
  { tIn: 491.56, tOut: 494.84, kind: 'container', ref: 'K22-s4', state: 'openroboto', grp: 'K22' },
  { tIn: 494.84, tOut: 499.78, kind: 'container', ref: 'K23', state: 'clients' },
  { tIn: 499.78, tOut: 503.5, kind: 'vid', ref: 'BR-22-copier-feeder-pages' },
  { tIn: 503.5, tOut: 507.0, kind: 'still', ref: 'IMG-5-shattering-glass-token', motion: 'IMG-5-shattering-glass-token-slowmo' },
  { tIn: 507.0, tOut: 511.0, kind: 'container', ref: 'K24', state: 'pruning' },
  // ── CH4 THE LONG-TERM CASE (green) ── (BR-23 starts 0.12 s after the card point so the clip stays at 4.0 s;
  //    the CH4 card holds over that gap)
  { tIn: 511.12, tOut: 515.12, kind: 'vid', ref: 'BR-23-hourglass-gold-sand-black' },
  { tIn: 515.12, tOut: 523.9, kind: 'chart', ref: 'C2' },
  { tIn: 523.9, tOut: 533.14, kind: 'chart', ref: 'C7' },
  { tIn: 533.14, tOut: 535.66, kind: 'deck', ref: 'D3-base', state: 'base', grp: 'D3' },
  { tIn: 535.66, tOut: 536.78, kind: 'deck', ref: 'D3-twist', state: 'twist', grp: 'D3' },
  { tIn: 536.78, tOut: 539.16, kind: 'deck', ref: 'D3-fees', state: 'fees', grp: 'D3' },
  { tIn: 539.16, tOut: 540.66, kind: 'deck', ref: 'D3-later', state: 'later', grp: 'D3' },
  { tIn: 540.66, tOut: 542.8, kind: 'receipt', ref: 'C10', state: 'emission', grp: 'C10', cam: [50, 36, 1.2, 50, 38, 2.0], note: 'About 3 years at today’s pace, later with recycling' },
  { tIn: 542.8, tOut: 549.36, kind: 'receipt', ref: 'C10', state: 'halving-threshold', grp: 'C10', cam: [50, 38, 2.0, 50, 23, 2.0], note: 'About 3 years at today’s pace, later with recycling' },
  { tIn: 549.36, tOut: 553.3, kind: 'still', ref: 'IMG-6-green-root-tree-coins' },
  { tIn: 553.3, tOut: 557.44, kind: 'deck', ref: 'D4-root', state: 'root', grp: 'D4' },
  { tIn: 557.44, tOut: 559.84, kind: 'deck', ref: 'D4-hold', state: 'hold', grp: 'D4' },
  { tIn: 559.84, tOut: 562.08, kind: 'deck', ref: 'D4-before', state: 'before', grp: 'D4' },
  { tIn: 562.08, tOut: 566.3, kind: 'receipt', ref: 'C21', cam: [50, 26, 1.3, 50, 19, 1.9] },
  { tIn: 566.3, tOut: 576.7, kind: 'chart', ref: 'C3' },
  { tIn: 576.7, tOut: 580.66, kind: 'still', ref: 'IMG-7-pie-one-slice-green' },
  { tIn: 580.66, tOut: 586.12, kind: 'container', ref: 'K25', state: '14-of-24' },
  { tIn: 586.12, tOut: 588.26, kind: 'container', ref: 'K26-s1', state: 'lium-billing', grp: 'K26' },
  { tIn: 588.26, tOut: 593.94, kind: 'container', ref: 'K26-s2', state: 'emission-gate', grp: 'K26' },
  { tIn: 593.94, tOut: 599.52, kind: 'container', ref: 'K27', state: 'big-money' },
  { tIn: 599.52, tOut: 603.5, kind: 'vid', ref: 'BR-24-datacenter-build-dusk-aerial' },
  { tIn: 603.5, tOut: 614.48, kind: 'chart', ref: 'C8' },
  { tIn: 614.48, tOut: 618.58, kind: 'receipt', ref: 'R12', cam: [50, 40, 1.2, 50, 46, 1.8] },
  { tIn: 618.58, tOut: 622.92, kind: 'receipt', ref: 'R13', cam: [26, 32, 1.0, 22, 30, 1.3], note: 'Under half of one percent of 660 to 690B' },
  { tIn: 622.92, tOut: 625.3, kind: 'vid', ref: 'BR-25-humanoid-robots-working' },
  { tIn: 625.3, tOut: 629.3, kind: 'still', ref: 'IMG-8-machine-coins-owner-hands' },
  // CLIP-1 LEAD-IN: the clip's FIRST frame held under the set-up line; it runs to the splice and sits under the insert.
  { tIn: 629.3, tOut: 634.66, kind: 'receipt', ref: 'R14-clip1-leadin', cam: [50, 50, 1.0, 50, 50, 1.0] },
  { tIn: 637.833, tOut: 641.72, kind: 'deck', ref: 'D5-claim', state: 'claim', grp: 'D5' },
  { tIn: 641.72, tOut: 644.52, kind: 'deck', ref: 'D5-stake', state: 'stake', grp: 'D5' },
  { tIn: 644.52, tOut: 646.48, kind: 'deck', ref: 'D5-alpha', state: 'alpha', grp: 'D5' },
  { tIn: 646.48, tOut: 647.62, kind: 'deck', ref: 'D5-loop', state: 'loop', grp: 'D5' },
  // ── CH5 THE ANSWER AND THE WATCHLIST (gold, no card) ──
  { tIn: 647.62, tOut: 654.533, kind: 'container', ref: 'H6', state: 'question-returns' },
  { tIn: 658.267, tOut: 662.2, kind: 'vid', ref: 'BR-26-chip-die-macro' },
  { tIn: 662.2, tOut: 664.02, kind: 'deck', ref: 'D6-base', state: 'base', grp: 'D6' },
  { tIn: 664.02, tOut: 666.94, kind: 'deck', ref: 'D6-production', state: 'production', grp: 'D6' },
  { tIn: 666.94, tOut: 669.44, kind: 'deck', ref: 'D6-scarcity', state: 'scarcity', grp: 'D6' },
  { tIn: 669.44, tOut: 671.48, kind: 'deck', ref: 'D6-badge', state: 'badge', grp: 'D6' },
  { tIn: 671.48, tOut: 672.66, kind: 'deck', ref: 'D6-ownership', state: 'ownership', grp: 'D6' },
  { tIn: 672.66, tOut: 676.6, kind: 'still', ref: 'IMG-9-balance-scale-tipped' },
  { tIn: 676.6, tOut: 680.26, kind: 'vid', ref: 'BR-27-dawn-road-drive-lead' },
  { tIn: 680.26, tOut: 688.84, kind: 'container', ref: 'C9-s1', state: 'row-01', grp: 'C9' },
  { tIn: 688.84, tOut: 694.14, kind: 'container', ref: 'C9-s2', state: 'row-02', grp: 'C9' },
  { tIn: 694.14, tOut: 700.84, kind: 'container', ref: 'C9-s3', state: 'row-03', grp: 'C9' },
  { tIn: 700.84, tOut: 705.14, kind: 'container', ref: 'C9-s4', state: 'row-04', grp: 'C9' },
  { tIn: 705.14, tOut: 708.84, kind: 'container', ref: 'C9-s5', state: 'row-05', grp: 'C9' },
  { tIn: 708.84, tOut: 717.98, kind: 'receipt', ref: 'C26', cam: [50, 50, 1.0, 50, 50, 1.05], ov: 'C26' },
  { tIn: 717.98, tOut: 723.6, kind: 'container', ref: 'K28', state: 'two-branches' },
  { tIn: 723.6, tOut: 727.167, kind: 'vid', ref: 'BR-28-research-laptop-books-night' },
  { tIn: 733.0, tOut: 736.86, kind: 'container', ref: 'H0-733', state: 'resolved', ov: 'atmo' },
  { tIn: 736.86, tOut: 740.48, kind: 'receipt', ref: 'R15', cam: [45, 45, 1.0, 45, 45, 1.08] },
  { tIn: 740.48, tOut: 744.32, kind: 'vid', ref: 'BR-29-team-celebrates-laptop' },
  { tIn: 744.32, tOut: 751.82, kind: 'container', ref: 'K29', state: 'community' },
  { tIn: 751.82, tOut: 755.82, kind: 'still', ref: 'IMG-10-control-room-monitors', motion: 'IMG-10-control-room-monitors-slowmo' },
  { tIn: 755.82, tOut: 764.68, kind: 'container', ref: 'K30', state: 'like-endcard' },
];

// captions source windows (lint_covers parses this; it must equal the generated CAPTION_WINDOWS, asserted below)
const CAPTION_SRC: [number, number][] = [[0.0, 6.9], [67.567, 76.5], [278.867, 285.067], [361.467, 370.233], [452.333, 458.2], [727.167, 733.0]];
if (JSON.stringify(CAPTION_SRC) !== JSON.stringify(CAPTION_WINDOWS)) {
  throw new Error('CAPTION_SRC drifted from the generated TaoDetailedCaptions.ts CAPTION_WINDOWS');
}

// ════════════════════════════════════════ §6 LIBRARY TRANSITIONS (TRANSITION-PLAN.json, exact ids) ════════════════════════════════════════
// role: face-in (A = the cover ending at t, B = the face starting at t) · face-out (A = face ending, B = cover starting) ·
// punch (A = B = the live face across a desilencer join, the punch scale steps on the join frame) · cover (A = cover
// ending, B = cover starting) · face-card (F3 out into the CH2 cube card).
type XRole = 'face-in' | 'face-out' | 'punch' | 'cover' | 'face-card';
const XFX: { t: number; id: string; role: XRole; plan: string }[] = [
  { t: 6.9, id: 'blocks-max-2', role: 'face-out', plan: 'lib:blocks-max-2 face-cut F1 out' },
  { t: 18.9, id: 'monitor-max-1', role: 'cover', plan: 'lib:monitor-max-1 glitch-still BR-2 -> IMG-1' },
  { t: 36.4, id: 'monitor-short-1', role: 'cover', plan: 'lib:monitor-short-1 glitch-still BR-5 -> IMG-2' },
  { t: 49.733, id: 'split-swinging-offset-short-combs-1', role: 'face-in', plan: 'lib:split-swinging-offset-short-combs-1 F2 in' },
  { t: 51.4, id: 'glitchoffset-2x', role: 'punch', plan: 'lib:glitchoffset-2x punch-glitch F2 join 51.400' },
  { t: 52.133, id: 'blocks-max-2', role: 'face-out', plan: 'lib:blocks-max-2 face-cut F2 out' },
  { t: 67.567, id: 'split-swinging-offset-layout-2x1-1', role: 'face-in', plan: 'lib:split-swinging-offset-layout-2x1-1 F3 in' },
  { t: 70.267, id: 'blocks-strips-3x', role: 'punch', plan: 'lib:blocks-strips-3x punch-glitch F3 join 70.267' },
  { t: 73.967, id: 'glitchoffset-4x', role: 'punch', plan: 'lib:glitchoffset-4x punch-glitch F3 join 73.967' },
  { t: 76.485, id: 'blocks-max-2', role: 'face-card', plan: 'lib:blocks-max-2 face-cut F3 out into the CH2 card' },
  { t: 143.96, id: 'melt-rgb-3', role: 'cover', plan: 'lib:melt-rgb-3 MELT K5 -> C1 overview' },
  { t: 179.9, id: 'split-swinging-offset-combs-2', role: 'face-in', plan: 'lib:split-swinging-offset-combs-2 F4 in' },
  { t: 183.633, id: 'blocks-max-2', role: 'face-out', plan: 'lib:blocks-max-2 face-cut F4 out' },
  { t: 208.32, id: 'monitor-min-2', role: 'cover', plan: 'lib:monitor-min-2 glitch-still D2 -> IMG-3' },
  { t: 278.867, id: 'split-swinging-offset-short-layout-1x2-1', role: 'face-in', plan: 'lib:split-swinging-offset-short-layout-1x2-1 F5 in' },
  { t: 284.567, id: 'glitchoffset-1x', role: 'punch', plan: 'lib:glitchoffset-1x punch-glitch F5 join 284.567' },
  { t: 285.067, id: 'blocks-max-2', role: 'face-out', plan: 'lib:blocks-max-2 face-cut F5 out' },
  { t: 298.4, id: 'spin-center-ease-cw', role: 'cover', plan: 'lib:spin-center-ease-cw SPIN K31 -> C4' },
  { t: 361.467, id: 'split-swinging-offset-layout-1x2-2', role: 'face-in', plan: 'lib:split-swinging-offset-layout-1x2-2 F6 in' },
  { t: 367.2, id: 'blocks-strips-2x', role: 'punch', plan: 'lib:blocks-strips-2x punch-glitch F6 join 367.200' },
  { t: 369.567, id: 'glitchoffset-3x', role: 'punch', plan: 'lib:glitchoffset-3x punch-glitch F6 join 369.567' },
  { t: 370.233, id: 'blocks-max-2', role: 'face-out', plan: 'lib:blocks-max-2 face-cut F6 out' },
  { t: 400.76, id: 'monitor-short-3', role: 'cover', plan: 'lib:monitor-short-3 glitch-still K16 -> IMG-4' },
  { t: 424.74, id: 'melt-rgb-short-3', role: 'cover', plan: 'lib:melt-rgb-short-3 MELT C6 -> K18' },
  { t: 441.58, id: 'melt-rgb-3', role: 'cover', plan: 'lib:melt-rgb-3 MELT BR-20 -> C6-442 exit' },
  { t: 452.333, id: 'split-swinging-offset-short-layout-2x1-2', role: 'face-in', plan: 'lib:split-swinging-offset-short-layout-2x1-2 F7 in' },
  { t: 455.233, id: 'blocks-medium-2', role: 'punch', plan: 'lib:blocks-medium-2 punch-glitch F7 join 455.233' },
  { t: 457.367, id: 'glitchoffset-2x', role: 'punch', plan: 'lib:glitchoffset-2x punch-glitch F7 join 457.367' },
  { t: 458.2, id: 'blocks-max-2', role: 'face-out', plan: 'lib:blocks-max-2 face-cut F7 out' },
  { t: 503.5, id: 'monitor-max-2', role: 'cover', plan: 'lib:monitor-max-2 glitch-still BR-22 -> IMG-5' },
  { t: 523.9, id: 'spin-center-ease-ccw', role: 'cover', plan: 'lib:spin-center-ease-ccw SPIN C2 -> C7' },
  { t: 549.36, id: 'monitor-min-1', role: 'cover', plan: 'lib:monitor-min-1 glitch-still C10 -> IMG-6' },
  { t: 576.7, id: 'monitor-min-3', role: 'cover', plan: 'lib:monitor-min-3 glitch-still C3 -> IMG-7' },
  { t: 625.3, id: 'monitor-max-3', role: 'cover', plan: 'lib:monitor-max-3 glitch-still BR-25 -> IMG-8' },
  // 634.66 insert-in / insert-out = hand:fade (the CLIP-1 layer below); 634.667 F8 face-cut = hand:cut (no engine)
  // TRANSITIONS_WAIVED: split-swinging-offset-short-combs-4 — named only in TRANSITIONS.md Open questions as an OPTIONAL
  //   F8 cut-in if Mike asks for one; the planned row at 634.667 is hand:cut (the insert-out fade owns that cut).
  { t: 636.733, id: 'blocks-strips-4x', role: 'punch', plan: 'lib:blocks-strips-4x punch-glitch F8 join 636.733' },
  { t: 637.833, id: 'blocks-max-2', role: 'face-out', plan: 'lib:blocks-max-2 face-cut F8 out' },
  { t: 654.533, id: 'split-swinging-offset-combs-3', role: 'face-in', plan: 'lib:split-swinging-offset-combs-3 F9 in' },
  { t: 657.1, id: 'glitchoffset-7x', role: 'punch', plan: 'lib:glitchoffset-7x punch-glitch F9 join 657.100' },
  { t: 658.267, id: 'blocks-max-2', role: 'face-out', plan: 'lib:blocks-max-2 face-cut F9 out' },
  { t: 662.2, id: 'spin-center-ease-cw', role: 'cover', plan: 'lib:spin-center-ease-cw SPIN BR-26 -> D6' },
  { t: 672.66, id: 'monitor-short-2', role: 'cover', plan: 'lib:monitor-short-2 glitch-still D6 -> IMG-9' },
  { t: 727.167, id: 'split-swinging-offset-layout-2x1-2', role: 'face-in', plan: 'lib:split-swinging-offset-layout-2x1-2 F10 in (vibe cut)' },
  { t: 731.8, id: 'blocks-medium-3', role: 'punch', plan: 'lib:blocks-medium-3 punch-glitch F10 join 731.800' },
  { t: 733.0, id: 'blocks-max-2', role: 'face-out', plan: 'lib:blocks-max-2 face-cut F10 out' },
  { t: 751.82, id: 'monitor-max-1', role: 'cover', plan: 'lib:monitor-max-1 glitch-still K29 -> IMG-10' },
];
const xCutFrame = (x: { t: number; role: XRole }) => {
  if (x.role === 'face-card') return PF(x.t);
  if (x.role === 'punch') {           // centred ON the measured join frame (the punch step frame)
    const w = FACES.find((f) => f.a < x.t && x.t < f.b)!;
    return w.jf[w.joins.findIndex((j) => near(j, x.t))];
  }
  return F(x.t);
};
const xWin = (id: string) => {
  const row = getTransition(id);
  if (!row) throw new Error(`unknown library transition id ${id}`);
  return framesForRow(row, FPS);
};
const near = (a: number, b: number) => Math.abs(a - b) < 0.02;
const coverEnding = (t: number) => COVERS.findIndex((c) => near(c.tOut, t));
const coverStarting = (t: number) => COVERS.findIndex((c) => near(c.tIn, t));
const faceStarting = (t: number) => FACES.findIndex((w) => near(w.a, t));
const faceEnding = (t: number) => FACES.findIndex((w) => near(w.b, t) || (w.a < t && t < w.b && INSERTS.some((p) => near(p.at, t))));
const faceContaining = (t: number) => FACES.findIndex((w) => w.a < t && t < w.b);
for (const x of XFX) {   // fail the build (not the render) when a plan row cannot resolve its two sides
  const ok = x.role === 'face-in' ? coverEnding(x.t) >= 0 && faceStarting(x.t) >= 0
    : x.role === 'face-out' ? faceEnding(x.t) >= 0 && coverStarting(x.t) >= 0
    : x.role === 'punch' ? faceContaining(x.t) >= 0
    : x.role === 'face-card' ? faceEnding(x.t) >= 0
    : coverEnding(x.t) >= 0 && coverStarting(x.t) >= 0;
  if (!ok) throw new Error(`transition ${x.id} @${x.t} (${x.role}) has no A/B side in COVERS/FACES`);
}
const libCutAt = (t: number) => XFX.some((x) => x.role === 'cover' && near(x.t, t));

// 24 / 25 fps Envato clips play FRAME-FOR-FRAME in this 30 fps comp (Mike 2026-10-17: the b-roll looked uneven): at
// playbackRate 30 / fps every source frame shows exactly once (1.2x for 25 fps, ~1.25x for 24 / 23.976), no repeat-every-
// sixth-frame judder. Measured fps (ffprobe r_frame_rate); every clip covers its slot x rate. 29.97 / 30 / 59.94 play at 1x.
const VID_FPS: Record<string, number> = {
  'BR-1-night-tower-looking-up': 25 / 1,
  'BR-2-robot-arm-moody-factory': 25 / 1,
  'BR-6-vault-corridor-push-closed': 25 / 1,
  'BR-7-night-earth-network-arcs': 24000 / 1001,
  'BR-11-hooded-figure-faceless': 24000 / 1001,
  'BR-13-people-phones-world-grid': 25 / 1,
  'BR-14-man-carries-box-out': 25 / 1,
  'BR-20-empty-office-dark-monitors': 25 / 1,
  'BR-21-server-racks-lateral-track': 24 / 1,
  'BR-23-hourglass-gold-sand-black': 24000 / 1001,
  'BR-25-humanoid-robots-working': 25 / 1,
  'BR-29-team-celebrates-laptop': 25 / 1,
};
const vidRate = (ref: string) => (VID_FPS[ref] ? FPS / VID_FPS[ref] : 1);

// §6a cost trap: an engine is never fed a live VIDEO cover; it gets the exact frame that airs at the window edge,
// pre-extracted to assets/cutframes/ (out = the frame at the window start, in = the frame at the window end).
const CUTFRAME = (ref: string, side: 'out' | 'in', at: number) => `cutframes/${ref}-${side}-${at.toFixed(3)}.jpg`;

// ════════════════════════════════════════ cover rendering ════════════════════════════════════════
const ease = Easing.inOut(Easing.cubic);
const GROUP_SPAN: Record<string, [number, number]> = {};
for (const c of COVERS) {
  if (!c.grp) continue;
  const g = GROUP_SPAN[c.grp];
  GROUP_SPAN[c.grp] = g ? [Math.min(g[0], c.tIn), Math.max(g[1], c.tOut)] : [c.tIn, c.tOut];
}

/** receipt camera: focus (fx, fy in % of the capture) brought toward centre at scale s, clamped so the frame stays covered */
const camXform = (fx: number, fy: number, s: number) => {
  const tx = Math.min(0, Math.max(1920 - 1920 * s, 960 - (fx / 100) * 1920 * s));
  const ty = Math.min(0, Math.max(1080 - 1080 * s, 540 - (fy / 100) * 1080 * s));
  return `translate(${tx}px, ${ty}px) scale(${s})`;
};

const LowerNote: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ position: 'absolute', left: 60, bottom: 56, maxWidth: 1500, padding: '14px 26px', borderRadius: 12,
    background: 'rgba(10,12,16,0.88)', borderLeft: '5px solid #ffd700', fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
    fontSize: 30, color: '#e8eaf0', boxShadow: '0 8px 30px rgba(0,0,0,0.45)' }}>{text}</div>
);
const Ring: React.FC<{ x: number; y: number; label: string; p: number; color?: string; dx?: number; dy?: number }> = ({ x, y, label, p, color = '#ffd700', dx = 40, dy = -60 }) => (
  <g opacity={p}>
    <circle cx={x} cy={y} r={34 - 10 * p} fill="none" stroke={color} strokeWidth={5} />
    <line x1={x + 20} y1={y - 20} x2={x + dx} y2={y + dy + 14} stroke={color} strokeWidth={4} />
    <text x={x + dx + 8} y={y + dy} style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 34, fill: '#ffffff', paintOrder: 'stroke', stroke: '#0a0c10', strokeWidth: 8 }}>{label}</text>
  </g>
);

/** a highlighter stroke that wipes left to right (p 0 -> 1); drawn with multiply so the black text stays black */
const Marker: React.FC<{ x: number; y: number; w: number; h: number; p: number }> = ({ x, y, w, h, p }) => (
  p > 0 ? <rect x={x - 4} y={y} width={(w + 8) * p} height={h} rx={5} fill="#ffe14d" /> : null
);

/** in-camera overlays, drawn in capture coordinates (1920x1080 = the full capture) so they move with the push */
const ReceiptOverlay: React.FC<{ id: string; ts: number }> = ({ id, ts }) => {
  const p = (t0: number, f = 8) => Math.max(0, Math.min(1, ((ts - t0) * FPS) / f));
  switch (id) {
    case 'R4':   // the comp's highlight on "Founded in 2016" (VQA: the highlight is the comp's)
      return <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}><rect x={772} y={320} width={228} height={44} rx={8} fill="rgba(255,215,0,0.22)" stroke="#ffd700" strokeWidth={3} opacity={p(98.6)} /></svg>;
    case 'C14-hl':   // marker wipe over “safe mode” at 7:41 p.m. on "7:41" (190.44) (Mike 2026-10-17 draft notes)
      return <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, mixBlendMode: 'multiply' }}><Marker x={914} y={643} w={181} h={30} p={p(190.44, 12)} /></svg>;
    case 'C15-hl':   // marker wipe over "the decentralized ownership of / intelligence" on "decentralized" (248.78)
      return (
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, mixBlendMode: 'multiply' }}>
          <Marker x={913} y={512} w={247} h={30} p={p(248.78, 30)} />
          <Marker x={668} y={541} w={104} h={30} p={p(250.36, 12)} />
        </svg>
      );
    case 'R5':   // the intraday drop marked; the stray crosshair date label hidden
      return (
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
          <rect x={768} y={999} width={140} height={36} fill="#ffffff" />
          <rect x={712} y={250} width={130} height={600} rx={14} fill="rgba(255,64,96,0.08)" stroke="#ff4060" strokeWidth={5} opacity={p(225.6)} />
          <text x={860} y={300} opacity={p(225.6)} style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 40, fill: '#ff4060', paintOrder: 'stroke', stroke: '#ffffff', strokeWidth: 8 }}>25 to 30% inside a day</text>
        </svg>
      );
    case 'R2-jun12':   // the mark points at the OPEN of 2026-06-12 (213.65)
      return <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}><Ring x={722} y={714} label="Jun 12 open: 213.65" p={p(270.56)} dx={70} dy={-80} /></svg>;
    case 'R2-jun14':   // the mark points at the OPEN of 2026-06-14 (262.76); the legend's C270.68 stays unmarked
      return <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}><Ring x={763} y={358} label="Jun 14 open: 262.76" p={p(272.42)} dx={80} dy={60} /></svg>;
    case 'C26': {   // the ATH mark (Bitget weekly high 780.0, March 2024) + the drawdown label from the live read
      const a = p(709.6, 10), b = p(711.6, 12);   // (about 65 percent at the 2026-10-15 read: 780.0 -> 273.8)
      return (
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
          <line x1={272} y1={140} x2={1815} y2={140} stroke="#d4a017" strokeWidth={4} strokeDasharray="14 10" opacity={a} />
          <circle cx={272} cy={140} r={13} fill="#d4a017" opacity={a} />
          <text x={300} y={200} opacity={a} style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 38, fill: '#b8860b', paintOrder: 'stroke', stroke: '#ffffff', strokeWidth: 8 }}>All-time high, March 2024</text>
          <line x1={1815} y1={148} x2={1815} y2={745} stroke="#ff4060" strokeWidth={5} opacity={b} />
          <path d="M1797 728 L1815 760 L1833 728" fill="#ff4060" opacity={b} />
          <text x={1790} y={420} textAnchor="end" opacity={b} style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 44, fill: '#ff4060', paintOrder: 'stroke', stroke: '#ffffff', strokeWidth: 10 }}>about 65% below the high</text>
          <text x={1790} y={462} textAnchor="end" opacity={b} style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 26, fill: '#505a6e', paintOrder: 'stroke', stroke: '#ffffff', strokeWidth: 8 }}>at the 2026-10-15 read</text>
        </svg>
      );
    }
    default:
      return null;
  }
};

const ReceiptView: React.FC<{ c: Cover; abs: number }> = ({ c, abs }) => {
  const ts = tsOf(abs, c.tIn);
  const cam = c.cam ?? [50, 50, 1, 50, 50, 1];
  const k = ease(Math.max(0, Math.min(1, (ts - c.tIn) / Math.max(0.01, c.tOut - c.tIn))));
  const fx = cam[0] + (cam[3] - cam[0]) * k, fy = cam[1] + (cam[4] - cam[1]) * k, s = cam[2] + (cam[5] - cam[2]) * k;
  const subP = Math.max(0, Math.min(1, ((ts - 276.8) * FPS) / 8));
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0c10', overflow: 'hidden' }}>
      {(() => {
        const camera = () => (
          <AbsoluteFill style={{ backgroundColor: '#0a0c10', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', transform: camXform(fx, fy, s) }}>
              <Img src={staticFile(`receipts/${c.ref}.png`)} style={{ ...fill, objectFit: 'fill' }} />
              {c.ov && c.ov !== 'R6' && <ReceiptOverlay id={c.ov} ts={ts} />}
            </div>
          </AbsoluteFill>
        );
        return c.mo ? <MotionWrap c={c}>{camera}</MotionWrap> : camera();
      })()}
      {c.ov === 'R6' && subP > 0 && (   // a small subscribe graphic under the ad-lib ask (276.80 "So if you're not subscribed")
        <div style={{ position: 'absolute', right: 120, bottom: 120, padding: '18px 40px', borderRadius: 14, background: '#e62117',
          fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 40, letterSpacing: '.06em', color: '#fff',
          boxShadow: '0 10px 40px rgba(0,0,0,.5)', opacity: subP, transform: `scale(${0.85 + 0.15 * subP})` }}>SUBSCRIBE</div>
      )}
      {c.note && <LowerNote text={c.note} />}
    </AbsoluteFill>
  );
};

/** H0 / H0-733: the dark server-hall atmosphere is a COMP layer (VQA: not in the PNG) — code-drawn rack light, screen-
 *  blended around the card box only, so the card's text is untouched. */
const Atmosphere: React.FC<{ abs: number }> = ({ abs }) => {
  const cols = Array.from({ length: 14 });
  return (
    <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: 0.55, filter: 'blur(3px)',
      WebkitMaskImage: 'linear-gradient(#000 0 21%, transparent 23% 79%, #000 81% 100%)', maskImage: 'linear-gradient(#000 0 21%, transparent 23% 79%, #000 81% 100%)' }}>
      {cols.map((_, i) => {
        const x = 40 + i * 138;
        return (
          <div key={i} style={{ position: 'absolute', left: x, top: 0, width: 90, height: 1080,
            background: 'linear-gradient(180deg, rgba(40,46,60,0.55), rgba(18,21,28,0.15) 50%, rgba(40,46,60,0.55))' }}>
            {Array.from({ length: 18 }).map((__, j) => {
              const on = Math.sin(abs * 0.21 * (1 + ((i * 7 + j * 3) % 5) * 0.17) + i * 1.3 + j * 2.1) > 0.15;
              const amber = (i + j) % 4 === 0;
              return <div key={j} style={{ position: 'absolute', left: 14 + ((j * 23) % 56), top: 20 + j * 59, width: 7, height: 4, borderRadius: 2,
                background: amber ? '#ffb000' : '#00c2ff', opacity: on ? 0.95 : 0.15, boxShadow: on ? `0 0 10px ${amber ? '#ffb000' : '#00c2ff'}` : 'none' }} />;
            })}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** card-slides / diagrams PNG, full frame, with a gentle continuous push across the whole asset group (§7a: a Type 2
 *  still never sits dead still; every state of a group shares one geometry, so a state swap is a clean cross-fade). */
const SlideView: React.FC<{ c: Cover; abs: number }> = ({ c, abs }) => {
  const [g0, g1] = c.grp ? GROUP_SPAN[c.grp] : [c.tIn, c.tOut];
  const ts = tsOf(abs, c.tIn);
  const k = Math.max(0, Math.min(1, (ts - g0) / Math.max(0.01, g1 - g0)));
  const s = 1 + (c.kind === 'deck' ? 0.035 : 0.03) * k;
  const dir = c.kind === 'deck' ? 'diagrams' : 'card-slides';
  let bzT: string | undefined;
  if (c.bz) {   // the beat pause inside this cover: zoom over exactly its frames, eased, then hold
    const pz = INSERTS.find((x) => x.at > c.tIn && x.at < c.tOut);
    if (!pz) throw new Error(`cover ${c.ref}: bz needs a beat pause inside the cover`);
    const k = Easing.inOut(Easing.sin)(Math.max(0, Math.min(1, (abs - PF(pz.at)) / (pz.dur * FPS))));
    const S = 1 + (c.bz.s - 1) * k;
    const cx = c.bz.x + (960 - c.bz.x) * k, cy = c.bz.y + (540 - c.bz.y) * k;
    bzT = `translate(${cx - S * c.bz.x}px, ${cy - S * c.bz.y}px) scale(${S})`;
  }
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0c10', overflow: 'hidden' }}>
      <AbsoluteFill style={{ transformOrigin: '0 0', transform: bzT }}>
        <Img src={staticFile(`${dir}/${c.ref}.png`)} style={{ ...fill, transform: `scale(${s})` }} />
        {c.ov === 'atmo' && <Atmosphere abs={abs} />}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** One cover's picture. mode 'live' = inside its own Sequence (videos play from their clip 0); 'out' / 'in' = handed to a
 *  transition engine (abs clock only; a video side becomes its pre-extracted cut frame). */
const CoverVisual: React.FC<{ c: Cover; mode: 'live' | 'out' | 'in'; at?: number }> = ({ c, mode, at = 0 }) => {
  const abs = useAbs();
  switch (c.kind) {
    case 'vid':
      return mode === 'live' ? (
        <AbsoluteFill style={{ backgroundColor: 'black' }}>
          <OffthreadVideo src={staticFile(`vid/${c.ref}.mp4`)} muted playbackRate={vidRate(c.ref)} style={{ ...fill, filter: c.grade }} />
        </AbsoluteFill>
      ) : (
        <AbsoluteFill style={{ backgroundColor: 'black' }}>
          <Img src={staticFile(CUTFRAME(c.ref, mode, at))} style={{ ...fill, filter: c.grade }} />
        </AbsoluteFill>
      );
    case 'still': {
      // §3c: a motion clip plays from clip 0, muted, cut at the slot end, NO extra push; the PNG is the fallback and the
      // frame every transition pulls. A plain still gets a slow push so it never sits dead.
      if (c.motion && mode === 'live') {
        return (
          <AbsoluteFill style={{ backgroundColor: 'black' }}>
            <OffthreadVideo src={staticFile(`img/${c.motion}.mp4`)} muted style={fill} />
          </AbsoluteFill>
        );
      }
      const k = Math.max(0, Math.min(1, (tsOf(abs, c.tIn) - c.tIn) / (c.tOut - c.tIn)));
      const s = c.motion ? 1 : 1 + 0.05 * k;
      return (
        <AbsoluteFill style={{ backgroundColor: 'black', overflow: 'hidden' }}>
          <Img src={staticFile(`img/${c.ref}.png`)} style={{ ...fill, transform: `scale(${s})` }} />
        </AbsoluteFill>
      );
    }
    case 'receipt':
      return <ReceiptView c={c} abs={abs} />;
    case 'chart':
      return <ChartFor c={c} abs={abs} />;
    default:
      return <SlideView c={c} abs={abs} />;
  }
};

/** §7: every chart cover routes to its LIVE animated component (never the spec PNG). */
const ChartFor: React.FC<{ c: Cover; abs: number }> = ({ c, abs }) => {
  const ts = tsOf(abs, c.tIn);
  if (c.ref === 'C2') return <CHARTS.C2 ts={ts} />;
  if (c.ref === 'C3') return <CHARTS.C3 ts={ts} />;
  if (c.ref === 'C4') return <CHARTS.C4 ts={ts} />;
  if (c.ref === 'C5') return <CHARTS.C5 ts={ts} />;
  if (c.ref === 'C7') return <CHARTS.C7 ts={ts} />;
  if (c.ref === 'C8') return <CHARTS.C8 ts={ts} />;
  throw new Error(`chart ${c.ref} has no animated component`);
};

// ingress per row: 'lib' (a library engine owns the cut) · 'none' (after a face / card: the face-out engine or the card
// owns it) · 'cont' (same capture, the camera simply continues) · 'swap' (state swap, 7 f cross-fade, no scale) ·
// 'fade' (Envato video, hand:fade 0.5 s) · 'xfade' (container / receipt / diagram / chart, hand:xfade-scale 0.4 s, 0.93 -> 1)
type Ing = { type: 'lib' | 'none' | 'cont' | 'swap' | 'fade' | 'xfade'; frames: number };
const ING: Ing[] = COVERS.map((c, i) => {
  const prev = COVERS[i - 1];
  const contiguous = !!prev && near(prev.tOut, c.tIn);
  if (libCutAt(c.tIn)) return { type: 'lib', frames: 0 };
  if (!contiguous || CARD_T.some((ct) => near(ct, c.tIn))) return { type: 'none', frames: 0 };
  if (c.grp && prev.grp === c.grp) return prev.ref === c.ref ? { type: 'cont', frames: 0 } : { type: 'swap', frames: 7 };
  if (c.kind === 'vid') return { type: 'fade', frames: 15 };                 // hand:fade (broll-fade, 0.50 s)
  return { type: 'xfade', frames: c.ingf ?? 12 };                           // hand:xfade-scale (container-xfade, 0.40 s / R1 0.30 s)
});
const TAIL = COVERS.map((c, i) => {
  const nx = COVERS[i + 1];
  if (!nx || !near(nx.tIn, c.tOut)) return 0;
  const g = ING[i + 1];
  return g.type === 'fade' || g.type === 'xfade' || g.type === 'swap' ? g.frames : 0;
});

/** `mo`: the library MOTION engine over the cover. The engine reads useCurrentFrame, so its clock is set with <Freeze>
 *  (the receipt itself runs on the abs clock, untouched): a pan (Motion3D, 5 s) is fitted to the move's span, a shake
 *  (MotionShake, a baked ~2.1 s wiggle) ping-pongs so it never stops or jumps. A grp of rows sharing the `mo` is ONE move. */
const moSpan = (c: Cover): [number, number] => {
  if (!c.grp) return [c.tIn, c.tOut];
  const rows = COVERS.filter((x) => x.grp === c.grp && x.mo === c.mo);
  return [Math.min(...rows.map((x) => x.tIn)), Math.max(...rows.map((x) => x.tOut))];
};
const MotionWrap: React.FC<{ c: Cover; children: () => React.ReactNode }> = ({ c, children }) => {
  const abs = useAbs();
  const row = getTransition(c.mo!);
  if (!row) throw new Error(`unknown motion id ${c.mo}`);
  const Engine = ENGINES[row.engine];
  const [m0, m1] = moSpan(c);
  const tm = Math.max(0, abs - F(m0)) / FPS;
  let te: number;
  if (row.engine === 'Motion3D') {
    te = Math.min(row.durationSeconds, (tm * row.durationSeconds) / Math.max(0.5, sh(m1) - sh(m0)));
  } else {
    const kf = (row.params as { ul?: { t: number }[]; pos?: { t: number }[] });
    const P = (kf.ul ?? kf.pos ?? [{ t: row.durationSeconds }]).slice(-1)[0].t;
    const ph = tm % (2 * P);
    te = ph <= P ? ph : 2 * P - ph;
  }
  return (
    <Freeze frame={Math.round(te * FPS)}>
      <Engine from={null} to={null} outClip={children} durationInFrames={Math.round(row.durationSeconds * FPS)} params={row.params} sfx={false} />
    </Freeze>
  );
};

const CoverSlot: React.FC<{ i: number }> = ({ i }) => {
  const f = useCurrentFrame();
  const g = ING[i];
  let opacity = 1, scale = 1;
  if (g.frames > 0 && f < g.frames) {
    const p = interpolate(f, [0, g.frames], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
    opacity = p;
    if (g.type === 'xfade') scale = 0.93 + 0.07 * p;
  }
  return (
    <AbsoluteFill style={{ opacity, transform: scale !== 1 ? `scale(${scale})` : undefined }}>
      <CoverVisual c={COVERS[i]} mode="live" />
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════ §6 CHAPTER CARDS — hand:cube-3d (plan pick rmn:cube) ════════════════════════════════════════
// @remotion/transitions ships NO cube presentation (4.0.462: clock-wipe/fade/flip/iris/none/slide/wipe/zoom-*), so the
// plan's rmn:cube is built as the §6 hand-rolled rotateY turn, tagged hand:cube-3d: it turns IN over 11 f and HOLDS
// through the pause (never cubes out), then dissolves over the new chapter's first cover.
const CARD_TURN = 11;
const CARD_FADE = 8;
const CARDS = [
  // CH2: entered by the F3 face-out engine (blocks-max-2) at the pause start; the cube turns behind the glitch
  { at: 76.485, img: 'title-CH2', lead: 0, engineEntered: true, extraHold: 6, out: () => <SpineNode face={2} /> },
  { at: 291.794, img: 'title-CH3', lead: 9, engineEntered: false, extraHold: 0, out: () => <CoverVisual c={COVERS[coverEnding(291.794)]} mode="out" /> },
  { at: 511.0, img: 'title-CH4', lead: 9, engineEntered: false, extraHold: 0, out: () => <CoverVisual c={COVERS[coverEnding(511.0)]} mode="out" /> },
].map((k) => {
  const turnStart = PF(k.at) - k.lead;
  const nextCover = COVERS.find((c) => c.tIn >= k.at - 0.001);
  const holdEnd = Math.max(F(k.at), nextCover ? F(nextCover.tIn) : F(k.at)) + k.extraHold;
  const engineEnd = k.engineEntered ? xCutFrame({ t: k.at, role: 'face-card' }) - Math.round(xWin('blocks-max-2') / 2) + xWin('blocks-max-2') : turnStart;
  const visibleFrom = Math.max(turnStart + CARD_TURN, engineEnd);
  const readable = (holdEnd - visibleFrom) / FPS;
  // ⛔ a chapter title must be FULLY READABLE for at least 1 s (Mike 2026-07-25): asserted so it cannot regress
  if (readable < 1.0) throw new Error(`card ${k.img}: readable ${readable.toFixed(2)} s < 1.0 s`);
  return { ...k, turnStart, holdEnd, engineEnd, readable };
});
const CubeCard: React.FC<{ k: (typeof CARDS)[number] }> = ({ k }) => {
  const abs = useAbs();
  const p = interpolate(abs, [k.turnStart, k.turnStart + CARD_TURN], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
  const out = 1 - interpolate(abs, [k.holdEnd, k.holdEnd + CARD_FADE], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const deg = 90 * p;
  const face: React.CSSProperties = { position: 'absolute', inset: 0, backfaceVisibility: 'hidden', overflow: 'hidden' };
  return (
    <AbsoluteFill style={{ opacity: out, perspective: 2200, backgroundColor: p > 0 && p < 1 ? '#05070a' : undefined }}>
      <AbsoluteFill style={{ transformStyle: 'preserve-3d', transform: `translateZ(-960px) rotateY(${-deg}deg)` }}>
        {p < 1 && <div style={{ ...face, transform: 'translateZ(960px)' }}>{k.out()}</div>}
        <div style={{ ...face, transform: 'rotateY(90deg) translateZ(960px)', backgroundColor: '#0a0c10' }}>
          <Img src={staticFile(`title-slides/${k.img}.png`)} style={fill} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════ §3d CLIP-1 insert (spine paused 13.9 s at 634.66) ════════════════════════════════════════
const CLIP = { ref: 'CLIP-1-steeves-capital-labor', at: 634.66, dur: 13.9 };
const CLIP_FROM = PF(CLIP.at);                         // 19295
const CLIP_FRAMES = Math.round(CLIP.dur * FPS);        // 417 = the paused window
const CLIP_SRC_FRAMES = 416;                           // the clip file's real frame count (ffprobe nb_read_frames, 13.867 s)
const CLIP_HOLD = CLIP_FRAMES - CLIP_SRC_FRAMES;       // 1 pause frame past the clip's end: its last frame holds
const INSERT_FADE = 15;                                // insert-in / insert-out: hand:fade 0.5 s (bucket insert)
const ClipInsert: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, INSERT_FADE], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ opacity: o, backgroundColor: 'black' }}>
      {/* FULL-FRAME, MUTED: Jacob Steeves' own voice is already baked into the VO track of the paused spine */}
      <OffthreadVideo src={staticFile(`clip-inserts/${CLIP.ref}.mp4`)} muted style={fill} />
    </AbsoluteFill>
  );
};
/** LEAD-OUT: the clip's LAST frame is the outgoing frame of the insert-out fade into FACE 8 (no held still). */
const ClipLeadOut: React.FC = () => {
  const f = useCurrentFrame();
  const o = 1 - interpolate(f, [CLIP_HOLD, CLIP_HOLD + INSERT_FADE], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ opacity: o, backgroundColor: 'black' }}>
      <Freeze frame={CLIP_SRC_FRAMES - 1}>
        <OffthreadVideo src={staticFile(`clip-inserts/${CLIP.ref}.mp4`)} muted style={fill} />
      </Freeze>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════ §8 CAPTIONS (Montserrat house style, FACE windows only) ════════════════════════════════════════
const CAP_WIN_F = CAPTION_SRC.map(([a, b]) => {
  const inner = INSERTS.find((p) => p.at > a && p.at < b);
  return [F(a), inner ? PF(inner.at) : F(b)] as [number, number];
});
const CAPS = ZCAPTIONS.map((c) => ({ tf: F(c.t), h: c.h }));
const Captions: React.FC = () => {
  const fr = useCurrentFrame();
  if (!CAP_WIN_F.some(([a, b]) => fr >= a && fr < b)) return null;    // only inside the caption windows
  let cur: (typeof CAPS)[number] | null = null;
  for (const c of CAPS) { if (c.tf <= fr) cur = c; else break; }
  if (!cur) return null;
  const nextF = (CAPS.find((c) => c.tf > cur!.tf) || { tf: Infinity }).tf;
  if (fr >= Math.min(nextF, cur.tf + Math.round(1.3 * FPS))) return null;   // hold to the next phrase / clear on a gap
  const age = fr - cur.tf;
  const pop = interpolate(age, [0, 3, 6], [0.7, 1.12, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 110 }}>
      <div style={{ fontFamily: `${MONTSERRAT}, 'Arial Black', 'Segoe UI', sans-serif`, fontWeight: 900, fontSize: 92, lineHeight: 1.05,
        textTransform: 'lowercase', color: '#ffffff', WebkitTextStroke: '12px #000', paintOrder: 'stroke fill', textAlign: 'center',
        maxWidth: 1600, transform: `scale(${pop})` }}>{cur.h}</div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════ the composition ════════════════════════════════════════
const EngineSides = (x: (typeof XFX)[number], from: number, win: number) => {
  const coverNode = (idx: number, side: 'out' | 'in') => {
    const c = COVERS[idx];
    // the clip time that airs at that frame (x the clip's playbackRate)
    const at = c.kind === 'vid' ? Math.max(0, ((side === 'out' ? from : from + win - 1) - F(c.tIn)) / FPS) * vidRate(c.ref) : 0;
    return () => <CoverVisual c={c} mode={side} at={at} />;
  };
  switch (x.role) {
    case 'face-in': return { a: coverNode(coverEnding(x.t), 'out'), b: () => <SpineNode face={faceStarting(x.t)} /> };
    case 'face-out': return { a: () => <SpineNode face={faceEnding(x.t)} />, b: coverNode(coverStarting(x.t), 'in') };
    case 'face-card': return { a: () => <SpineNode face={faceEnding(x.t)} />, b: () => <CubeCard k={CARDS[0]} /> };
    case 'punch': { const fi = faceContaining(x.t); return { a: () => <SpineNode face={fi} />, b: () => <SpineNode face={fi} /> }; }
    default: return { a: coverNode(coverEnding(x.t), 'out'), b: coverNode(coverStarting(x.t), 'in') };
  }
};

// inputProps.captions=false renders the picture WITHOUT the burned caption track (the 16:9-sourced short re-frames spans 9:16
// and captions them itself; longform-to-short.md). Default true = the delivered longform.
export const TaoDetailed: React.FC<{ captions?: boolean }> = ({ captions = true }) => {
  const abs = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      <AbsCtx.Provider value={abs}>
        {/* 1 · the spine: the one continuous VO + gated face, FACE_REFRAME + punch-ins about the face point */}
        <Sequence from={0} durationInFrames={SPINE_FRAMES}>
          <SpineFrame frame={abs}>
            <OffthreadVideo src={staticFile('spine.mp4')} style={spineStyle} />
          </SpineFrame>
        </Sequence>

        {/* 2 · COVER track (hand-rolled ingress per §6 bucket 3; contiguous rows overlap by the next row's ingress) */}
        {COVERS.map((c, i) => (
          <Sequence key={`cv${i}`} from={F(c.tIn)} durationInFrames={Math.max(1, F(c.tOut) - F(c.tIn) + TAIL[i])}>
            <CoverSlot i={i} />
          </Sequence>
        ))}

        {/* 3 · CLIP-1 spliced insert: full-frame + muted over its paused window; insert-in hand:fade, insert-out hand:fade */}
        <Sequence from={CLIP_FROM} durationInFrames={CLIP_SRC_FRAMES}>
          <ClipInsert />
        </Sequence>
        <Sequence from={CLIP_FROM + CLIP_SRC_FRAMES} durationInFrames={CLIP_HOLD + INSERT_FADE}>
          <ClipLeadOut />
        </Sequence>

        {/* 4 · library transitions: each in a Sequence of EXACTLY the engine window (§6a), SFX off (post-mix owns audio) */}
        {XFX.map((x, i) => {
          const win = xWin(x.id);
          const half = Math.round(win / 2);
          const from = xCutFrame(x) - half;
          const s = EngineSides(x, from, win);
          return (
            <Sequence key={`x${i}`} from={from} durationInFrames={win}>
              <TransitionClip id={x.id} cutFrame={half} sfx={false} outgoing={s.a} incoming={s.b} />
            </Sequence>
          );
        })}

        {/* 5 · chapter cards (hand:cube-3d, the plan's rmn:cube pick) */}
        {CARDS.map((k, i) => {
          const from = k.engineEntered ? k.engineEnd : k.turnStart;
          return (
            <Sequence key={`card${i}`} from={from} durationInFrames={k.holdEnd + CARD_FADE - from}>
              <CubeCard k={k} />
            </Sequence>
          );
        })}

        {/* 6 · captions, TOPMOST, FACE windows only (off for the 16:9-sourced short's span renders) */}
        {captions && <Captions />}
      </AbsCtx.Provider>
    </AbsoluteFill>
  );
};

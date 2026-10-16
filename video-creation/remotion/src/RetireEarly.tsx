// RetireEarly.tsx: longform-edited "Best Cryptos to Help Beat the AI Job Takeover in 2027" (media/retire-early).
// Built TO the approved blueprint (EDIT-PLAN.md event log, CUE-SHEET.md, TRANSITIONS.md + TRANSITION-PLAN.json,
// COVER-PLAN.json, AS-RECORDED.md, PROJECT-LOG.md Open flags) per skills/comp-build/comp-build.md.
// One continuous gated-face spine (assets/spine.mp4 = spine/ALL.g.paused.mp4) with layers OVER it, every cue a SOURCE
// time routed through sh()/F(). No music, no SFX, no watermark: post-mix owns audio (comp-build §9).
//
// Layer order (bottom -> top): spine (FACE_REFRAME + punch) · COVER track · library transitions (glitch / melt / spin)
// · punch-leak light leaks · chapter card scenes (rmn:flip) · film burns (face cuts) · captions (TOPMOST).
//
// Transition tags (grep the plan against the comp): `tr` on a COVERS row = its ingress:
//   'xfade'  = hand:xfade-scale 0.35 s (container-xfade)   'xfade20' = hand:xfade-scale 0.20 s (receipt stage 2)
//   'fade'   = hand:fade 0.50 s (broll-fade, Envato)        'ifade'   = hand:fade 0.50 s (clip insert-in / insert-out)
//   'swap'   = in-id state swap, a 7-frame PNG cross-fade, NO ingress move (comp-build §5)
//   'lib'    = the row's `lib` id fires on its tIn (lib:glitchoffset-* glitch-still, lib:melt-equidistant-* MELT-transform,
//              lib:spin-corner-ease-lt SPIN-newfacet), placed by <LibTransition> on EXACTLY the engine window (§6a)
//   'face'   = face-owned ingress: the hand:film-burn on that face cut carries it (FACE_CUTS)
//   'card'   = card-owned ingress: the rmn:flip card scene flips out onto it (CARDS)
import React, { createContext, useContext } from 'react';
import {
  AbsoluteFill, Audio, Easing, Freeze, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame,
} from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { flip } from '@remotion/transitions/flip';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadOswald } from '@remotion/google-fonts/Oswald';
import { TransitionClip } from './transitions/TransitionClip';
import { framesForRow, getTransition, TransitionRow } from './transitions/registry';
import { CAPTION_WINDOWS, ZCAPTIONS } from './RetireEarlyCaptions';
import { ChartC2, ChartC22, ChartC4, ChartTaoRev } from './RetireEarlyCharts';

loadMontserrat('normal', { weights: ['900'], subsets: ['latin'] });
const OSWALD = loadOswald('normal', { weights: ['700'], subsets: ['latin'] }).fontFamily;

// ============================================================================ timing (comp-build §2 + §3d)
export const FPS = 30;
export const PAUSE = 1.5;            // spine/ALL.g.paused.json pause_s (title-card freeze + silence)
export const SPINE_SECS = 648.309;   // SOURCE spine spine/ALL.e.desilenced.mp4 (format duration)
const PAUSED_SPINE_FRAMES = 20224;   // assets/spine.mp4 video frames (ffprobe nb_frames)
const PAUSED_SPINE_FILE_SECS = 674.254; // assets/spine.mp4 format duration: its audio runs 0.12 s past the last video frame
// The sidecar's pauses[] IS the time map: every row's own `dur` (cards = pause_s, clip inserts = the clip length).
export const INSERTS = [
  { at: 94.675, dur: 12.266667 },  // CLIP-2 Vlad Tenev (368 frames, his own voice baked into the VO)
  { at: 104.99, dur: 1.5 },        // card ARBITRUM
  { at: 184.13, dur: 7.566667 },   // CLIP-3 Paul Atkins (227 frames)
  { at: 267.875, dur: 1.5 },       // card KASPA: in the gap BEFORE the spoken Kaspa (onset 267.93; Mike 2026-10-11)
  { at: 371.8, dur: 1.5 },         // card TAO
  { at: 494.93, dur: 1.5 },        // card TON
];
export const CARD_T = [104.99, 267.875, 371.8, 494.93];
const sumDur = (pred: (at: number) => boolean) => INSERTS.filter((p) => pred(p.at)).reduce((a, p) => a + p.dur, 0);
const sh = (t: number) => t + sumDur((at) => at <= t);                 // source -> paused-spine seconds
const pauseStart = (at: number) => at + sumDur((a) => a < at);         // a pause's own start (paused seconds)
const F = (t: number) => Math.round(sh(t) * FPS);                      // source seconds -> composition frame
const PS = (at: number) => Math.round(pauseStart(at) * FPS);
const DUR_FORMULA = Math.round((SPINE_SECS + INSERTS.reduce((a, p) => a + p.dur, 0)) * FPS);   // comp-build §2
if (DUR_FORMULA !== PAUSED_SPINE_FRAMES) throw new Error(`time map ${DUR_FORMULA} != paused spine frames ${PAUSED_SPINE_FRAMES}`);
// check_spine_fps.py: DUR = ceil(duration * fps) so the render never truncates the tail: the sign-off "Mike" still
// decays (-45 to -52 dB) in the last 0.12 s of the audio; the picture holds the spine's last frame for those 4 frames.
export const DUR = Math.max(DUR_FORMULA, Math.ceil(PAUSED_SPINE_FILE_SECS * FPS));   // = 20228
const LAST_SPINE_FRAME = PAUSED_SPINE_FRAMES - 1;

// ============================================================================ FACE (comp-build §3a, MEASURED)
export const FACE_REFRAME = { scale: 1.28, x: -434, y: -239 };   // assets/face-reframe.json, never hand-tuned
const FACE_POINT = { x: 960, y: 432 };                            // face-reframe.json face_point_out (punch origin)
const FACES: [number, number][] = [                               // AS-RECORDED FACE windows (blackdetect), source s
  [0, 35.133], [76.833, 84.967], [169.867, 176.367], [196.633, 198.267], [244.533, 267.87], [315, 319.267],
  [361.7, 371.733], [415.433, 420.533], [485.4, 494.9], [562.033, 571.767], [582.9, 648.267],
];
// F11's SCREEN SHARE ships AS FILMED (Mike 2026-10-10; EDIT-PLAN open decision "FACE_REFRAME must exclude 588.267-648.267"):
// no reframe, no punch, no leak, no cover, no captions from this frame to the end.
const SHARE_T = 588.267;
// MEASURED on assets/spine.mp4 (comp QA 2026-10-11): from the source spine's first missing-frame pts gap (148.3 s) the
// baked spine's PICTURE runs exactly +1 frame against the time map (bake_clip_insert.py trims by frame index; its "+1
// frame"), so every face edge after it sits at F(t) + 1. The screen-share cut is the first frame of the share: 18424.
const SHARE_F = F(SHARE_T) + 1;
if (SHARE_F !== 18424) throw new Error(`screen-share cut ${SHARE_F} != the measured 18424`);
const FACE_F = FACES.map(([a, b]) => [F(a), F(b) + (b > 148.3 ? 1 : 0)] as [number, number]);
// The spine carries 2 BLACK frames inside F5 (8452-8453, source ~260.4 s): the seam where the ARB-disclosure picture was
// restored at spine review. They air as a freeze of the last face frame before them (same transform), under the
// punch-back + leak that lands on the restored picture's first frame (8454).
const BLACK_FILL: Record<number, number> = { 8452: 8451, 8453: 8451 };
const spineFrame = (n: number) => BLACK_FILL[n] ?? n;

// [PUNCH-IN] + [LIGHTLEAK] on the desilencer joins (spine/jumpcuts-final.json; TRANSITIONS.md role punch-leak):
// a hard ~18% step ON the join frame, alternating in / back per window, the LIBRARY leak peaking on the same frame.
// `f` = the join's VISIBLE jump frame MEASURED on assets/spine.mp4 (frame-difference peak within +-8 frames;
// _previews/qa/measure_joins.py -> joins-measured.json): the joins file runs 1-3 frames ahead of the picture, plus the
// +1 bake lag after 148.3 s. A visually seamless join (no peak) takes F(t) + that lag. 260.1 lands on 8454, the first
// frame of the restored disclosure picture (the visible seam right after the 2 black frames).
const PUNCH_K = 1.18;
const MEASURED_JOIN_F: Record<number, number> = {
  5.1: 153, 12.633: 381, 15.967: 480, 27.433: 824, 28.967: 871, 31.767: 954, 81.333: 2443, 255.333: 8301, 260.1: 8454,
  264.3: 8571, 266.7: 8643, 362.733: 11568, 366.467: 11680, 368.5: 11741, 371.2: 11822, 419.9: 13328, 486.633: 15330,
  490.167: 15436, 494.233: 15558, 563.5: 17683, 571.067: 17908, 587.467: 18400,
};
const PUNCHES: { t: number; dir: 'in' | 'back'; leak: string }[] = [
  { t: 5.1, dir: 'in', leak: 'lightleaks-8' }, { t: 12.633, dir: 'back', leak: 'lightleaks-3' },
  { t: 15.967, dir: 'in', leak: 'lightleaks-8' }, { t: 27.433, dir: 'back', leak: 'lightleaks-3' },
  { t: 28.967, dir: 'in', leak: 'lightleaks-8' }, { t: 31.767, dir: 'back', leak: 'lightleaks-3' },      // F1
  { t: 81.333, dir: 'in', leak: 'lightleaks-8' },                                                          // F2
  { t: 255.333, dir: 'in', leak: 'lightleaks-8' }, { t: 260.1, dir: 'back', leak: 'lightleaks-3' },
  { t: 264.3, dir: 'in', leak: 'lightleaks-8' }, { t: 266.7, dir: 'back', leak: 'lightleaks-3' },          // F5
  { t: 362.733, dir: 'in', leak: 'lightleaks-8' }, { t: 366.467, dir: 'back', leak: 'lightleaks-3' },
  { t: 368.5, dir: 'in', leak: 'lightleaks-8' }, { t: 371.2, dir: 'back', leak: 'lightleaks-short-3' },    // F7
  { t: 419.9, dir: 'in', leak: 'lightleaks-short-8' },                                                     // F8
  { t: 486.633, dir: 'in', leak: 'lightleaks-8' }, { t: 490.167, dir: 'back', leak: 'lightleaks-3' },
  { t: 494.233, dir: 'in', leak: 'lightleaks-short-8' },                                                   // F9
  { t: 563.5, dir: 'in', leak: 'lightleaks-8' }, { t: 571.067, dir: 'back', leak: 'lightleaks-short-3' },  // F10
  { t: 587.467, dir: 'in', leak: 'lightleaks-short-8' },                                                   // F11 face part
];
const PUNCH_F = PUNCHES.map((p) => {
  const f = MEASURED_JOIN_F[p.t];
  if (f === undefined || Math.abs(f - F(p.t)) > 12) throw new Error(`punch ${p.t}: no measured join frame near F(t) ${F(p.t)}`);
  return { ...p, f };
});
const faceIndexAt = (abs: number) => FACE_F.findIndex(([a, b]) => abs >= a && abs < b);
const punchAt = (abs: number) => {
  const w = faceIndexAt(abs);
  if (w < 0) return 1;
  const [a] = FACE_F[w];
  let s = 1;
  for (const p of PUNCH_F) if (p.f >= a && p.f <= abs) s = p.dir === 'in' ? PUNCH_K : 1;
  return s;
};

// ============================================================================ absolute clock (comp-build §6a)
// Every node an engine may re-mount reads THIS clock, never useCurrentFrame(), so it shows the same frame in any nesting.
const AbsCtx = createContext(0);
const useAbs = () => useContext(AbsCtx);

const FILL: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };
const REFRAMED: React.CSSProperties = {
  position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0',
  transform: `translate(${FACE_REFRAME.x}px, ${FACE_REFRAME.y}px) scale(${FACE_REFRAME.scale})`,
};
const AS_FILMED: React.CSSProperties = { position: 'absolute', left: 0, top: 0, width: 1920, height: 1080 };

// the LIVE spine picture (muted, frame-exact, held on its last frame past the video end) + the VO = the spine's own
// audio, the only audible media in the comp (clip voices are already baked into it; no music / SFX, §9)
const SpineLive: React.FC = () => {
  const abs = useCurrentFrame();
  const n = Math.min(abs, LAST_SPINE_FRAME);
  const share = n >= SHARE_F;
  const punch = share ? 1 : punchAt(n);
  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      <AbsoluteFill style={{ transformOrigin: `${FACE_POINT.x}px ${FACE_POINT.y}px`, transform: `scale(${punch})` }}>
        <Freeze frame={spineFrame(n)}>
          <OffthreadVideo src={staticFile('spine.mp4')} muted style={share ? AS_FILMED : REFRAMED} />
        </Freeze>
      </AbsoluteFill>
      <Audio src={staticFile('spine.mp4')} />
    </AbsoluteFill>
  );
};

// SpineStill / spine copy for an engine: (1) a real <Freeze>, (2) muted, (3) the SAME transform (reframe + punch),
// (4) the SAME source (spine.mp4; no background-swap clip on this video). Frozen at `frame`, else the absolute clock.
const SpineAt: React.FC<{ frame?: number }> = ({ frame }) => {
  const abs = useAbs();
  const n = Math.min(frame ?? abs, LAST_SPINE_FRAME);
  const share = n >= SHARE_F;
  const punch = share ? 1 : punchAt(n);
  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      <AbsoluteFill style={{ transformOrigin: `${FACE_POINT.x}px ${FACE_POINT.y}px`, transform: `scale(${punch})` }}>
        <Freeze frame={spineFrame(n)}>
          <OffthreadVideo src={staticFile('spine.mp4')} muted style={share ? AS_FILMED : REFRAMED} />
        </Freeze>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// a muted clip playing from clip frame 0 at composition frame `start`, on the absolute clock, held on its last frame
const AbsMedia: React.FC<{ src: string; start: number; frames: number }> = ({ src, start, frames }) => {
  const abs = useAbs();
  const mf = Math.max(0, Math.min(frames - 1, abs - start));
  return (
    <Freeze frame={mf}>
      <OffthreadVideo src={staticFile(src)} muted style={FILL} />
    </Freeze>
  );
};

// clip lengths in 30 fps frames (ffprobe), so a clip never runs past its end (held on its last frame instead)
const CLIPF: Record<string, number> = {
  'BR-1-box-carried-out': 108, 'BR-2-factory-worker-walks': 156, 'BR-3-dark-corridor-dolly': 210,
  'BR-4-box-wrapping-machine': 180, 'BR-5-rail-yard-aerial': 156, 'BR-6-neon-caution-sign': 104,
  'BR-7-ballot-clear-box': 147, 'BR-8-calculator-hands-dark': 126, 'BR-9-asic-miner-rows': 180,
  'BR-10-turnstile-denied': 129, 'BR-11-train-light-streak': 123, 'BR-12-data-stream-teal': 119,
  'BR-13-cranes-at-night': 148, 'BR-14-robot-arms-assembly': 178, 'BR-15-pay-envelope': 180,
  'BR-16-hourglass-gold-sand': 175, 'BR-17-keynote-stage': 147, 'BR-18-gpu-server-racks': 135,
  'BR-19-new-coins-pile': 131, 'BR-20-seedlings-timelapse': 156, 'BR-21-phone-messaging-dark': 153,
  'BR-22-crowd-crossing-aerial': 135,
  'IMG-8-certificates-to-glass-tokens-motion': 151, 'IMG-9-meme-coins-toppling-motion': 151,
  'IMG-11-empty-office-dissolving-motion': 151, 'IMG-14-tao-coin-neural-network-motion': 151,
  'CLIP-2-tenev-ownership': 366, 'CLIP-3-atkins-sandbox': 226,
};

// ============================================================================ COVER track (comp-build §4)
type Cover = {
  tIn: number; tOut: number;
  kind: 'container' | 'deck' | 'receipt' | 'still' | 'vid' | 'chart' | 'insert';
  ref: string;
  tr: 'face' | 'card' | 'xfade' | 'xfade20' | 'fade' | 'ifade' | 'swap' | 'lib';
  lib?: string; grp?: string; state?: string; motion?: string; lc?: string; lcPos?: 'top' | 'bottom'; stage?: number;
};
// One row per state / sub-point, off the EDIT-PLAN event log (source seconds; word cues from the transcript and
// assets/diagrams/_state-cues.md). `deck` = THE BALANCE overview diagram, shown once; `container` = a spotlight state
// (card slide or diagram state); consecutive same-`grp` rows are STATE SWAPS (no ingress move).
// TRANSITIONS_WAIVED: blocks-max-1 — TRANSITIONS.md names it only as the open-question FALLBACK face look; the plan's pick is hand:film-burn
// DIAGRAM_REFS: C1-overview-8, C1-overview-2, C1-overview-90, C16-overview-full, C16-overview-apps, C16-overview-dagknight, C26-overview-full, C26-overview-billion
// (end declared refs)
const COVERS: Cover[] = [
  // ---------------------------------------------------------------- CH1 WHY YOU NEED TO OWN ASSETS (F1 0-35.133 above)
  { tIn: 35.133, tOut: 37.94, kind: 'container', ref: 'H0-s1', tr: 'face', grp: 'H0', state: 'wages' },
  { tIn: 37.94, tOut: 41.3, kind: 'container', ref: 'H0-s2', tr: 'swap', grp: 'H0', state: 'ownership' },
  { tIn: 41.3, tOut: 42.9, kind: 'vid', ref: 'BR-1-box-carried-out', tr: 'fade' },
  { tIn: 42.9, tOut: 49.62, kind: 'receipt', ref: 'C34-challenger-ai-cuts', tr: 'xfade' },
  { tIn: 49.62, tOut: 52.3, kind: 'still', ref: 'IMG-1-job-seekers-lobby', tr: 'lib', lib: 'glitchoffset-2x' },
  { tIn: 52.3, tOut: 56.9, kind: 'receipt', ref: 'C36-stanford-19-percent', tr: 'xfade' },
  { tIn: 56.9, tOut: 60.4, kind: 'still', ref: 'IMG-2-glass-door-closing', tr: 'lib', lib: 'glitchoffset-1x' },
  { tIn: 60.4, tOut: 63.6, kind: 'vid', ref: 'BR-2-factory-worker-walks', tr: 'fade' },
  { tIn: 63.6, tOut: 70.2, kind: 'receipt', ref: 'C35-bls-labor-share', tr: 'xfade' },
  { tIn: 70.2, tOut: 72.4, kind: 'still', ref: 'IMG-3-researchers-server-wall', tr: 'lib', lib: 'glitchoffset-1x' },
  { tIn: 72.4, tOut: 76.833, kind: 'receipt', ref: 'C37-amodei-entry-level', tr: 'xfade' },
  // F2 76.833-84.967
  { tIn: 84.967, tOut: 87.45, kind: 'still', ref: 'IMG-4-hoodie-monitors-dark-room', tr: 'face' },
  { tIn: 87.45, tOut: 94.66, kind: 'receipt', ref: 'CLIP-2-in', tr: 'xfade' },
  { tIn: 94.66, tOut: 94.675, kind: 'insert', ref: 'CLIP-2-tenev-ownership', tr: 'ifade' },
  { tIn: 94.675, tOut: 97.7, kind: 'receipt', ref: 'CLIP-2-out', tr: 'ifade' },
  { tIn: 97.7, tOut: 98.74, kind: 'container', ref: 'N2-s1', tr: 'xfade', grp: 'N2', state: 'arbitrum' },
  { tIn: 98.74, tOut: 99.4, kind: 'container', ref: 'N2-s2', tr: 'swap', grp: 'N2', state: 'kaspa' },
  { tIn: 99.4, tOut: 99.96, kind: 'container', ref: 'N2-s3', tr: 'swap', grp: 'N2', state: 'tao' },
  { tIn: 99.96, tOut: 103.65, kind: 'container', ref: 'N2-s4', tr: 'swap', grp: 'N2', state: 'ton' },
  { tIn: 103.65, tOut: 105.0, kind: 'vid', ref: 'BR-3-dark-corridor-dolly', tr: 'fade' },   // runs on under the ARBITRUM pause
  // ---------------------------------------------------------------- CH2 ARBITRUM (card at 104.99)
  { tIn: 105.0, tOut: 108.6, kind: 'still', ref: 'IMG-5-arbitrum-coin-hero', tr: 'card' },
  { tIn: 108.6, tOut: 114.56, kind: 'container', ref: 'C1-s1-ethereum', tr: 'xfade', grp: 'C1-s1', state: 'ethereum' },
  { tIn: 114.56, tOut: 118.9, kind: 'container', ref: 'C1-s1-arbitrum-one', tr: 'swap', grp: 'C1-s1', state: 'arbitrum-one' },
  { tIn: 118.9, tOut: 122.9, kind: 'vid', ref: 'BR-4-box-wrapping-machine', tr: 'fade' },
  { tIn: 122.9, tOut: 125.28, kind: 'receipt', ref: 'R2-techcrunch-offchain', tr: 'xfade' },
  { tIn: 125.28, tOut: 129.05, kind: 'receipt', ref: 'R2-princeton', tr: 'xfade20' },
  { tIn: 129.05, tOut: 132.6, kind: 'still', ref: 'IMG-6-arbitrum-platform-chains', tr: 'lib', lib: 'glitchoffset-1x' },
  { tIn: 132.6, tOut: 136.08, kind: 'container', ref: 'C1-s2-treasury', tr: 'xfade', grp: 'C1-s2', state: 'treasury' },
  { tIn: 136.08, tOut: 137.9, kind: 'container', ref: 'C1-s2-inflow', tr: 'swap', grp: 'C1-s2', state: 'inflow' },
  { tIn: 137.9, tOut: 140.2, kind: 'still', ref: 'IMG-7-empty-desk-lights-dim', tr: 'lib', lib: 'glitchoffset-2x' },
  { tIn: 140.2, tOut: 143.4, kind: 'still', ref: 'IMG-8-certificates-to-glass-tokens', tr: 'lib', lib: 'glitchoffset-1x', motion: 'IMG-8-certificates-to-glass-tokens-motion' },
  { tIn: 143.4, tOut: 146.6, kind: 'vid', ref: 'BR-5-rail-yard-aerial', tr: 'fade', lc: 'WHOEVER OWNS THE RAILS CHARGES RENT', lcPos: 'bottom' },
  { tIn: 146.6, tOut: 151.1, kind: 'container', ref: 'C1-s3-robinhood-chain', tr: 'xfade', grp: 'C1-s3', state: 'robinhood-chain' },
  { tIn: 151.1, tOut: 153.5, kind: 'receipt', ref: 'C8a-dateline', tr: 'xfade' },
  { tIn: 153.5, tOut: 160.2, kind: 'receipt', ref: 'C8a-robinhood-120-countries', tr: 'xfade20' },
  { tIn: 160.2, tOut: 163.9, kind: 'receipt', ref: 'C9-arbitrum-factsheet', tr: 'xfade' },
  { tIn: 163.9, tOut: 167.12, kind: 'deck', ref: 'C1-overview-8', tr: 'lib', lib: 'melt-equidistant-1', grp: 'C1-overview', state: 'split-8' },
  { tIn: 167.12, tOut: 168.4, kind: 'deck', ref: 'C1-overview-2', tr: 'swap', grp: 'C1-overview', state: 'split-2' },
  { tIn: 168.4, tOut: 169.867, kind: 'deck', ref: 'C1-overview-90', tr: 'swap', grp: 'C1-overview', state: 'split-90' },
  // F3 169.867-176.367
  { tIn: 176.367, tOut: 181.4, kind: 'receipt', ref: 'C6-sec-press-release', tr: 'face' },
  { tIn: 181.4, tOut: 184.12, kind: 'receipt', ref: 'CLIP-3-in', tr: 'xfade' },
  { tIn: 184.12, tOut: 184.13, kind: 'insert', ref: 'CLIP-3-atkins-sandbox', tr: 'ifade' },
  { tIn: 184.13, tOut: 186.25, kind: 'receipt', ref: 'CLIP-3-out', tr: 'ifade' },
  { tIn: 186.25, tOut: 189.3, kind: 'container', ref: 'C5-s1', tr: 'xfade', grp: 'C5', state: 'ledger' },
  { tIn: 189.3, tOut: 192.68, kind: 'container', ref: 'C5-s2', tr: 'swap', grp: 'C5', state: 'rights' },
  { tIn: 192.68, tOut: 194.08, kind: 'container', ref: 'C5-s3', tr: 'swap', grp: 'C5', state: 'permissioned' },
  { tIn: 194.08, tOut: 195.15, kind: 'container', ref: 'C5-s4', tr: 'swap', grp: 'C5', state: 'volume' },
  { tIn: 195.15, tOut: 196.633, kind: 'vid', ref: 'BR-6-neon-caution-sign', tr: 'fade' },
  // F4 196.633-198.267
  { tIn: 198.267, tOut: 203.8, kind: 'receipt', ref: 'C8b-robinhood-debt-securities', tr: 'face' },
  { tIn: 203.8, tOut: 207.0, kind: 'receipt', ref: 'R3-coindesk-exclude', tr: 'xfade' },
  { tIn: 207.0, tOut: 211.7, kind: 'receipt', ref: 'C14-defillama-fees', tr: 'xfade' },
  { tIn: 211.7, tOut: 215.7, kind: 'chart', ref: 'C2', tr: 'xfade' },
  { tIn: 215.7, tOut: 217.4, kind: 'still', ref: 'IMG-9-meme-coins-toppling', tr: 'lib', lib: 'glitchoffset-1x', motion: 'IMG-9-meme-coins-toppling-motion' },
  { tIn: 217.4, tOut: 218.9, kind: 'receipt', ref: 'R4-cmc-token-unlocks-schedule', tr: 'xfade' },
  { tIn: 218.9, tOut: 222.0, kind: 'receipt', ref: 'R4-tokenomist-next-unlock', tr: 'xfade20' },
  { tIn: 222.0, tOut: 224.55, kind: 'receipt', ref: 'C11-arbitrum-foundation-funding', tr: 'xfade' },
  { tIn: 224.55, tOut: 227.45, kind: 'vid', ref: 'BR-7-ballot-clear-box', tr: 'fade' },
  { tIn: 227.45, tOut: 232.45, kind: 'receipt', ref: 'R5-coingecko-market-cap', tr: 'xfade' },
  { tIn: 232.45, tOut: 235.2, kind: 'receipt', ref: 'C10-theblock-dao-income', tr: 'xfade' },
  { tIn: 235.2, tOut: 242.3, kind: 'chart', ref: 'C4', tr: 'lib', lib: 'spin-corner-ease-lt' },
  { tIn: 242.3, tOut: 244.533, kind: 'vid', ref: 'BR-8-calculator-hands-dark', tr: 'fade' },
  // F5 244.533-267.87, then the KASPA card scene
  // ---------------------------------------------------------------- CH3 KASPA (card at 267.875)
  { tIn: 267.875, tOut: 271.875, kind: 'still', ref: 'IMG-10-kaspa-coin-hero', tr: 'card' },   // 4.0 s cap
  { tIn: 271.875, tOut: 277.0, kind: 'container', ref: 'kas-question', tr: 'xfade', grp: 'kas-question', state: 'question' },
  { tIn: 277.0, tOut: 281.0, kind: 'vid', ref: 'BR-9-asic-miner-rows', tr: 'fade' },
  { tIn: 281.0, tOut: 284.6, kind: 'receipt', ref: 'C15-kaspa-lore-fair-launch', tr: 'xfade' },
  { tIn: 284.6, tOut: 289.4, kind: 'container', ref: 'C16-s1-fair-launch', tr: 'xfade', grp: 'C16-s1', state: 'fair-launch' },
  { tIn: 289.4, tOut: 292.1, kind: 'still', ref: 'IMG-11-empty-office-dissolving', tr: 'lib', lib: 'glitchoffset-1x', motion: 'IMG-11-empty-office-dissolving-motion' },
  { tIn: 292.1, tOut: 297.22, kind: 'container', ref: 'gatekeepers-ai', tr: 'xfade', grp: 'gatekeepers', state: 'ai' },
  { tIn: 297.22, tOut: 298.04, kind: 'container', ref: 'gatekeepers-bank', tr: 'swap', grp: 'gatekeepers', state: 'bank' },
  { tIn: 298.04, tOut: 300.3, kind: 'container', ref: 'gatekeepers-foundation', tr: 'swap', grp: 'gatekeepers', state: 'foundation' },
  { tIn: 300.3, tOut: 302.6, kind: 'vid', ref: 'BR-10-turnstile-denied', tr: 'fade' },
  { tIn: 302.6, tOut: 307.75, kind: 'container', ref: 'N3-s1-supply', tr: 'xfade', grp: 'N3-s1', state: 'supply' },
  { tIn: 307.75, tOut: 311.1, kind: 'receipt', ref: 'C20-umbrel-rusty-kaspad', tr: 'xfade' },
  { tIn: 311.1, tOut: 315.0, kind: 'still', ref: 'IMG-12-home-server-bookshelf', tr: 'lib', lib: 'glitchoffset-1x' },
  // F6 315-319.267
  { tIn: 319.267, tOut: 321.16, kind: 'container', ref: 'N3-s2-whole', tr: 'face', grp: 'N3-s2', state: 'whole' },
  { tIn: 321.16, tOut: 322.04, kind: 'container', ref: 'N3-s2-run', tr: 'swap', grp: 'N3-s2', state: 'run' },
  { tIn: 322.04, tOut: 325.8, kind: 'container', ref: 'N3-s2-noone', tr: 'swap', grp: 'N3-s2', state: 'noone' },
  { tIn: 325.8, tOut: 327.9, kind: 'vid', ref: 'BR-11-train-light-streak', tr: 'fade' },
  { tIn: 327.9, tOut: 332.9, kind: 'receipt', ref: 'C18-kip-14-crescendo', tr: 'xfade' },
  { tIn: 332.9, tOut: 336.9, kind: 'still', ref: 'IMG-13-robots-tossing-kaspa-coins', tr: 'lib', lib: 'glitchoffset-2x' },
  { tIn: 336.9, tOut: 338.85, kind: 'vid', ref: 'BR-12-data-stream-teal', tr: 'fade' },
  { tIn: 338.85, tOut: 344.95, kind: 'receipt', ref: 'C19-kaspa-docs-toccata', tr: 'xfade' },
  { tIn: 344.95, tOut: 349.4, kind: 'container', ref: 'toccata-zk', tr: 'xfade', grp: 'toccata-zk', state: 'zk' },
  { tIn: 349.4, tOut: 352.4, kind: 'vid', ref: 'BR-13-cranes-at-night', tr: 'fade' },
  { tIn: 352.4, tOut: 357.28, kind: 'deck', ref: 'C16-overview-full', tr: 'lib', lib: 'spin-corner-ease-lt', grp: 'C16-overview', state: 'full' },
  { tIn: 357.28, tOut: 360.2, kind: 'deck', ref: 'C16-overview-apps', tr: 'swap', grp: 'C16-overview', state: 'apps' },
  { tIn: 360.2, tOut: 361.7, kind: 'deck', ref: 'C16-overview-dagknight', tr: 'swap', grp: 'C16-overview', state: 'dagknight' },
  // F7 361.7-371.733, then the TAO card scene
  // ---------------------------------------------------------------- CH4 TAO (card at 371.80)
  { tIn: 371.8, tOut: 375.8, kind: 'still', ref: 'IMG-14-tao-coin-neural-network', tr: 'card', motion: 'IMG-14-tao-coin-neural-network-motion' },
  { tIn: 375.8, tOut: 379.8, kind: 'vid', ref: 'BR-14-robot-arms-assembly', tr: 'fade' },
  { tIn: 379.8, tOut: 383.7, kind: 'container', ref: 'C21-s1-network', tr: 'xfade', grp: 'C21-s1', state: 'network' },
  { tIn: 383.7, tOut: 384.43, kind: 'container', ref: 'C21-s1-compute', tr: 'swap', grp: 'C21-s1', state: 'compute' },
  { tIn: 384.43, tOut: 385.16, kind: 'container', ref: 'C21-s1-inference', tr: 'swap', grp: 'C21-s1', state: 'inference' },
  { tIn: 385.16, tOut: 385.88, kind: 'container', ref: 'C21-s1-storage', tr: 'swap', grp: 'C21-s1', state: 'storage' },
  { tIn: 385.88, tOut: 386.6, kind: 'container', ref: 'C21-s1-prediction', tr: 'swap', grp: 'C21-s1', state: 'prediction' },
  { tIn: 386.6, tOut: 389.4, kind: 'still', ref: 'IMG-15-night-market-four-stalls', tr: 'lib', lib: 'glitchoffset-1x' },
  { tIn: 389.4, tOut: 390.68, kind: 'container', ref: 'C21-s2-miners', tr: 'xfade', grp: 'C21-s2', state: 'miners' },
  { tIn: 390.68, tOut: 392.42, kind: 'container', ref: 'C21-s2-validators', tr: 'swap', grp: 'C21-s2', state: 'validators' },
  { tIn: 392.42, tOut: 393.94, kind: 'container', ref: 'C21-s2-stakers', tr: 'swap', grp: 'C21-s2', state: 'stakers' },
  { tIn: 393.94, tOut: 396.12, kind: 'container', ref: 'C21-s2-owner', tr: 'swap', grp: 'C21-s2', state: 'owner' },
  { tIn: 396.12, tOut: 397.55, kind: 'container', ref: 'C21-s2-paid', tr: 'swap', grp: 'C21-s2', state: 'paid' },
  { tIn: 397.55, tOut: 401.45, kind: 'container', ref: 'steeves-quote', tr: 'xfade', grp: 'steeves-quote', state: 'quote' },
  { tIn: 401.45, tOut: 405.45, kind: 'still', ref: 'IMG-16-mining-rig-to-neural-net', tr: 'lib', lib: 'glitchoffset-2x' },
  { tIn: 405.45, tOut: 409.45, kind: 'vid', ref: 'BR-15-pay-envelope', tr: 'fade' },
  { tIn: 409.45, tOut: 410.54, kind: 'container', ref: 'ai-production-wages', tr: 'xfade', grp: 'ai-production', state: 'wages' },
  { tIn: 410.54, tOut: 412.08, kind: 'container', ref: 'ai-production-production', tr: 'swap', grp: 'ai-production', state: 'production' },
  { tIn: 412.08, tOut: 414.42, kind: 'container', ref: 'ai-production-inputs', tr: 'swap', grp: 'ai-production', state: 'inputs' },
  { tIn: 414.42, tOut: 415.433, kind: 'container', ref: 'ai-production-paid', tr: 'swap', grp: 'ai-production', state: 'paid' },
  // F8 415.433-420.533
  { tIn: 420.533, tOut: 424.3, kind: 'vid', ref: 'BR-16-hourglass-gold-sand', tr: 'face' },
  { tIn: 424.3, tOut: 428.0, kind: 'receipt', ref: 'C25-opentensor-overview-fair-launch', tr: 'xfade' },
  { tIn: 428.0, tOut: 431.16, kind: 'receipt', ref: 'C23-bittensor-emissions', tr: 'xfade', stage: 1 },
  { tIn: 431.16, tOut: 433.4, kind: 'receipt', ref: 'C23-bittensor-emissions', tr: 'swap', stage: 2 },
  { tIn: 433.4, tOut: 437.4, kind: 'chart', ref: 'C22', tr: 'lib', lib: 'melt-equidistant-2' },
  { tIn: 437.4, tOut: 439.2, kind: 'still', ref: 'IMG-17-builders-subnet-towers', tr: 'lib', lib: 'glitchoffset-1x' },
  { tIn: 439.2, tOut: 444.6, kind: 'receipt', ref: 'C24-bittensor-subnet-limit', tr: 'xfade' },
  { tIn: 444.6, tOut: 447.5, kind: 'vid', ref: 'BR-17-keynote-stage', tr: 'fade' },
  { tIn: 447.5, tOut: 454.1, kind: 'receipt', ref: 'R6-cryptobriefing-24-subnets', tr: 'xfade' },
  { tIn: 454.1, tOut: 456.6, kind: 'vid', ref: 'BR-18-gpu-server-racks', tr: 'fade' },
  { tIn: 456.6, tOut: 461.25, kind: 'container', ref: 'N4-s1', tr: 'xfade', grp: 'N4-s1', state: 'customers' },
  { tIn: 461.25, tOut: 471.1, kind: 'chart', ref: 'tao-rev-vs-emissions', tr: 'lib', lib: 'spin-corner-ease-lt' },
  { tIn: 471.1, tOut: 473.45, kind: 'vid', ref: 'BR-19-new-coins-pile', tr: 'fade', lc: 'THE NETWORK STILL PAYS OUT MOSTLY NEW COINS', lcPos: 'top' },
  { tIn: 473.45, tOut: 475.85, kind: 'still', ref: 'IMG-18-uneven-towers-wired', tr: 'lib', lib: 'glitchoffset-1x' },
  { tIn: 475.85, tOut: 479.58, kind: 'container', ref: 'N4-s2', tr: 'xfade', grp: 'N4-s2', state: 'control' },
  { tIn: 479.58, tOut: 482.25, kind: 'container', ref: 'N4-s2-handover', tr: 'swap', grp: 'N4-s2', state: 'handover' },
  { tIn: 482.25, tOut: 485.4, kind: 'vid', ref: 'BR-20-seedlings-timelapse', tr: 'fade' },
  // F9 485.4-494.9, then the TON card scene
  // ---------------------------------------------------------------- CH5 TON (card at 494.93)
  { tIn: 494.93, tOut: 499.55, kind: 'receipt', ref: 'C31-durov-gram-521', tr: 'card' },
  { tIn: 499.55, tOut: 502.5, kind: 'still', ref: 'IMG-19-ton-coin-paper-clouds', tr: 'lib', lib: 'glitchoffset-1x' },
  { tIn: 502.5, tOut: 505.65, kind: 'vid', ref: 'BR-21-phone-messaging-dark', tr: 'fade' },
  { tIn: 505.65, tOut: 508.72, kind: 'container', ref: 'ton-history-2018', tr: 'xfade', grp: 'ton-history', state: '2018' },
  { tIn: 508.72, tOut: 510.98, kind: 'container', ref: 'ton-history-2020', tr: 'swap', grp: 'ton-history', state: '2020' },
  { tIn: 510.98, tOut: 513.45, kind: 'container', ref: 'ton-history-2021', tr: 'swap', grp: 'ton-history', state: '2021' },
  { tIn: 513.45, tOut: 517.5, kind: 'receipt', ref: 'C30-durov-telegram-driver-501', tr: 'xfade' },
  { tIn: 517.5, tOut: 521.0, kind: 'still', ref: 'IMG-20-validator-tower-globe', tr: 'lib', lib: 'glitchoffset-1x' },
  { tIn: 521.0, tOut: 523.45, kind: 'vid', ref: 'BR-22-crowd-crossing-aerial', tr: 'fade', lc: 'WHY DOES IT HELP? DISTRIBUTION.', lcPos: 'bottom' },
  { tIn: 523.45, tOut: 529.5, kind: 'receipt', ref: 'C28-durov-billion-users-404', tr: 'xfade' },
  { tIn: 529.5, tOut: 534.64, kind: 'container', ref: 'C26-s1-miniapps', tr: 'xfade', grp: 'C26-s1', state: 'miniapps' },
  { tIn: 534.64, tOut: 538.8, kind: 'container', ref: 'C26-s1-wallet', tr: 'swap', grp: 'C26-s1', state: 'wallet' },
  { tIn: 538.8, tOut: 542.8, kind: 'receipt', ref: 'R7-defillama-ton-stablecoins', tr: 'xfade' },
  { tIn: 542.8, tOut: 548.4, kind: 'receipt', ref: 'C29-durov-cocoon-462', tr: 'xfade' },
  { tIn: 548.4, tOut: 552.6, kind: 'receipt', ref: 'C32-cocoon-org', tr: 'xfade' },
  { tIn: 552.6, tOut: 555.6, kind: 'still', ref: 'IMG-21-chatbots-handing-coins', tr: 'lib', lib: 'glitchoffset-2x' },
  { tIn: 555.6, tOut: 557.64, kind: 'deck', ref: 'C26-overview-full', tr: 'lib', lib: 'spin-corner-ease-lt', grp: 'C26-overview', state: 'full' },
  { tIn: 557.64, tOut: 562.033, kind: 'deck', ref: 'C26-overview-billion', tr: 'swap', grp: 'C26-overview', state: 'billion' },
  // F10 562.033-571.767
  // ---------------------------------------------------------------- CH6 THE CLOSE (no card; F11 + the screen share to EOF)
  { tIn: 571.767, tOut: 573.54, kind: 'container', ref: 'C38', tr: 'face', grp: 'C38', state: 'resting' },
  { tIn: 573.54, tOut: 575.24, kind: 'container', ref: 'C38-s1', tr: 'swap', grp: 'C38', state: 'arb' },
  { tIn: 575.24, tOut: 576.86, kind: 'container', ref: 'C38-s2', tr: 'swap', grp: 'C38', state: 'kas' },
  { tIn: 576.86, tOut: 578.56, kind: 'container', ref: 'C38-s3', tr: 'swap', grp: 'C38', state: 'tao' },
  { tIn: 578.56, tOut: 580.7, kind: 'container', ref: 'C38-s4', tr: 'swap', grp: 'C38', state: 'ton' },
  { tIn: 580.7, tOut: 582.9, kind: 'still', ref: 'IMG-22-four-coins-amber-row', tr: 'lib', lib: 'glitchoffset-1x' },
  // F11 582.9-648.267 (face part to 588.267, then the screen share AS FILMED to the end; hand:cut picture end)
];

// a cover ending ON a face-in holds 1 more frame after 148.3 s (the spine picture's measured +1 lag: the face's first frame
// is F(a) + 1), so the film-burn peak flashes over picture, never over the black frame before the face
const FACE_IN = new Set(FACES.map(([a]) => a));
const coverEndF = (c: Cover) => F(c.tOut) + (c.tOut > 148.3 && FACE_IN.has(c.tOut) ? 1 : 0);

// card slides live in assets/card-slides/, every other container / deck state in assets/diagrams/
const CARD_SLIDE = /^(H0-|N2-|C5-|N4-|C38|kas-question|toccata-zk|steeves-quote)/;
const dirOf = (ref: string) => (CARD_SLIDE.test(ref) ? 'card-slides' : 'diagrams');

// group spans (state swaps share one camera move across the whole group)
const GSPAN: [number, number][] = [];
COVERS.forEach((c, i) => {
  const prev = COVERS[i - 1];
  if (c.grp && prev && prev.grp === c.grp && Math.abs(prev.tOut - c.tIn) < 0.02) {
    GSPAN[i] = GSPAN[i - 1];          // the same array: extending it extends every state of the group
    GSPAN[i][1] = F(c.tOut);
  } else GSPAN[i] = [F(c.tIn), F(c.tOut)];
});

// camera moves [fx0, fy0, s0, fx1, fy1, s1(, delay s)] in fractions of the image; comp-build §7a: no Type 2 still sits dead
const GCAM_DEFAULT = [0.5, 0.5, 1.0, 0.5, 0.5, 1.03, 0];
const GCAM: Record<string, number[]> = {
  'H0': [0.5, 0.5, 1.0, 0.46, 0.46, 1.05, 0],             // the orb atmosphere drifts as the words swap
  'C1-s1': [0.5, 0.5, 1.0, 0.5, 0.95, 1.05, 0],           // drift down toward the Ethereum band (_state-cues)
  'C1-overview': [0.5, 0.5, 1.0, 0.5, 0.5, 1.03, 0.64],   // at rest under the melt, the centred push from 164.54
  'C16-s1': [0.5, 0.5, 1.0, 0.5, 0.95, 1.05, 0],          // drift toward the lit bottom rung
  'C16-overview': [0.5, 0.5, 1.0, 0.5, 0.05, 1.04, 0.56], // slow upward drift after the spin settles (352.96)
  'C26-overview': [0.5, 0.5, 1.0, 0.5, 0.5, 1.03, 0.56],  // at rest under the spin, push from 556.16
};
// receipts: [edge colour, w, h] (the page colour fills a wide capture's bars) + the reading move toward the line read
const RECEIPTS: Record<string, [string, number, number]> = {
  'C10-theblock-dao-income': ['#fefefe', 1200, 766], 'C11-arbitrum-foundation-funding': ['#14181a', 1960, 1320],
  'C14-defillama-fees': ['#090b0c', 2232, 858], 'C15-kaspa-lore-fair-launch': ['#f5f5f7', 2640, 1484],
  'C18-kip-14-crescendo': ['#ffffff', 2520, 1416], 'C19-kaspa-docs-toccata': ['#ffffff', 2520, 1416],
  'C20-umbrel-rusty-kaspad': ['#f4f4f5', 3840, 2200], 'C23-bittensor-emissions': ['#ffffff', 1760, 1280],
  'C24-bittensor-subnet-limit': ['#ffffff', 1760, 1280], 'C25-opentensor-overview-fair-launch': ['#ffffff', 3840, 2160],
  'C28-durov-billion-users-404': ['#a3c28c', 5016, 2823], 'C29-durov-cocoon-462': ['#a5c38c', 5130, 2886],
  'C30-durov-telegram-driver-501': ['#9bbe8b', 4053, 2280], 'C31-durov-gram-521': ['#9fc08c', 4473, 2517],
  'C32-cocoon-org': ['#010715', 3600, 2024], 'C34-challenger-ai-cuts': ['#fcfaf1', 2400, 812],
  'C35-bls-labor-share': ['#ffffff', 2880, 1704], 'C36-stanford-19-percent': ['#ffffff', 2000, 852],
  'C37-amodei-entry-level': ['#f0eee6', 2600, 1462], 'C6-sec-press-release': ['#ffffff', 1648, 1520],
  'C8a-dateline': ['#ffffff', 1740, 572], 'C8a-robinhood-120-countries': ['#ffffff', 1672, 530],
  'C8b-robinhood-debt-securities': ['#ffffff', 2900, 1630], 'C9-arbitrum-factsheet': ['#ffffff', 2600, 1462],
  'CLIP-2-in': ['#000000', 1920, 1080], 'CLIP-2-out': ['#000000', 1920, 1080],
  'CLIP-3-in': ['#000000', 1920, 1080], 'CLIP-3-out': ['#000000', 1920, 1080],
  'R2-princeton': ['#ffffff', 1700, 680], 'R2-techcrunch-offchain': ['#0a8935', 2600, 1462],
  'R3-coindesk-exclude': ['#ffffff', 1560, 608], 'R4-cmc-token-unlocks-schedule': ['#ffffff', 2180, 1012],
  'R4-tokenomist-next-unlock': ['#f5f4f4', 984, 542], 'R5-coingecko-market-cap': ['#ffffff', 2784, 1566],
  'R6-cryptobriefing-24-subnets': ['#ffffff', 1820, 892], 'R7-defillama-ton-stablecoins': ['#090b0c', 2220, 938],
};
const RCAM: Record<string, number[]> = {
  'C34-challenger-ai-cuts': [0.5, 0.5, 1.0, 0.5, 0.8, 1.15],          // the AI year-to-date line (120,136)
  'C36-stanford-19-percent': [0.5, 0.5, 1.0, 0.5, 0.55, 1.15],       // "about 19% below"
  'C35-bls-labor-share': [0.5, 0.5, 1.0, 0.69, 0.72, 1.25],           // the 52.8% endpoint
  'C37-amodei-entry-level': [0.5, 0.45, 1.0, 0.5, 0.3, 1.3],          // "half of all entry-level white collar jobs"
  'CLIP-2-in': [0.5, 0.42, 1.08, 0.5, 0.5, 1.0],                      // slow move under the set-up line, landing at 1.0 ON the clip's first frame (seamless insert-in)
  'CLIP-2-out': [0.5, 0.5, 1.0, 0.5, 0.45, 1.04],
  'R2-techcrunch-offchain': [0.5, 0.5, 1.0, 0.5, 0.33, 1.12],         // "Offchain Labs" headline
  'R2-princeton': [0.5, 0.5, 1.0, 0.5, 0.3, 1.12],                    // "first developed at Princeton"
  'C8a-dateline': [0.5, 0.5, 1.0, 0.5, 0.5, 1.1],
  'C8a-robinhood-120-countries': [0.5, 0.5, 1.0, 0.5, 0.25, 1.15],     // 120 countries ... varies by jurisdiction
  'C9-arbitrum-factsheet': [0.5, 0.5, 1.0, 0.44, 0.38, 1.25],         // the 10 / 8 / 2 paragraph
  'C6-sec-press-release': [0.5, 0.0, 1.0, 0.5, 0.62, 1.04],           // tall page: header -> date + Atkins' quote
  'CLIP-3-in': [0.5, 0.42, 1.08, 0.5, 0.5, 1.0],
  'CLIP-3-out': [0.5, 0.5, 1.0, 0.5, 0.45, 1.04],
  'C8b-robinhood-debt-securities': [0.5, 0.5, 1.0, 0.5, 0.5, 1.42],   // the Stock Tokens legal paragraph
  'R3-coindesk-exclude': [0.5, 0.5, 1.0, 0.5, 0.35, 1.15],
  'C14-defillama-fees': [0.5, 0.5, 1.0, 0.8, 0.35, 1.3],            // toward the 2026-09-04 peak bar
  'R4-cmc-token-unlocks-schedule': [0.5, 0.5, 1.0, 0.6, 0.5, 1.12],
  'R4-tokenomist-next-unlock': [0.5, 0.5, 1.0, 0.5, 0.33, 1.06],      // the two 92.6M lines
  'C11-arbitrum-foundation-funding': [0.5, 0.0, 1.0, 0.45, 0.35, 1.1],
  'R5-coingecko-market-cap': [0.5, 0.5, 1.0, 0.75, 0.3, 1.2],         // the pinned 1.224B point
  'C10-theblock-dao-income': [0.5, 0.0, 1.0, 0.45, 0.3, 1.12],        // the 6.2 million headline
  'C15-kaspa-lore-fair-launch': [0.5, 0.5, 1.0, 0.5, 0.505, 1.85],     // "No premine, insider allocation, or pre-sales."
  'C20-umbrel-rusty-kaspad': [0.5, 0.5, 1.0, 0.3, 0.15, 1.25],
  'C18-kip-14-crescendo': [0.5, 0.5, 1.0, 0.5, 0.4, 1.12],           // "Increasing BPS from 1 to 10"
  'C19-kaspa-docs-toccata': [0.5, 0.5, 1.0, 0.5, 0.27, 1.3],          // "active on mainnet as of June 30, 2026"
  'C25-opentensor-overview-fair-launch': [0.5, 0.5, 1.0, 0.4, 0.3, 1.15],
  'C23-bittensor-emissions#1': [0.5, 0.0, 1.0, 0.49, 0.5, 1.12],      // "first halving occurred in December 2025"
  'C23-bittensor-emissions#2': [0.49, 0.5, 1.12, 0.49, 0.53, 1.2],    // "0.5 TAO per block, roughly 3,600 TAO per day"
  'C24-bittensor-subnet-limit': [0.5, 0.0, 1.0, 0.5, 0.5, 1.12],    // the subnet limit (128)
  'R6-cryptobriefing-24-subnets': [0.5, 0.5, 1.0, 0.5, 0.6, 1.15],   // 24 subnets, 28M to 35M
  'C31-durov-gram-521': [0.5, 0.5, 1.0, 0.5, 0.15, 1.6],              // "TON's native currency is becoming Gram."
  'C30-durov-telegram-driver-501': [0.5, 0.5, 1.0, 0.5, 0.22, 1.6],
  'C28-durov-billion-users-404': [0.5, 0.5, 1.0, 0.5, 0.44, 1.6],     // "significantly over 1 billion monthly active users"
  'R7-defillama-ton-stablecoins': [0.5, 0.5, 1.0, 0.6, 0.4, 1.15],
  'C29-durov-cocoon-462': [0.5, 0.5, 1.0, 0.5, 0.12, 1.6],
  'C32-cocoon-org': [0.5, 0.5, 1.0, 0.5, 0.45, 1.15],
};
const kenBurns = (ref: string) => {                       // ChatGPT stills: a gentle push, alternating in / out
  const n = parseInt(ref.replace(/^IMG-(\d+).*/, '$1'), 10);
  return n % 2 ? [0.5, 0.5, 1.0, 0.5, 0.5, 1.07] : [0.5, 0.5, 1.07, 0.5, 0.5, 1.0];
};

// SpineStill-equivalent for VIDEO sides of a library transition (comp-build §6a cost trap): the cut-frame still.
const CUTFRAME: Record<string, string> = {
  'BR-13-cranes-at-night': 'transitions/cutframes/spin-352.40-from-BR-13.png',
};
// MELT/Equidistant is image-only: still to still (TRANSITIONS.md §4), the stills rendered from this comp (noLib).
const MELT_STILLS: Record<string, { from: string; to: string }> = {
  'C1-overview-8': { from: 'transitions/cutframes/melt-163.90-from-C9.png', to: 'diagrams/C1-overview-8.png' },
  'C22': { from: 'transitions/cutframes/melt-433.40-from-C23.png', to: 'transitions/cutframes/melt-433.40-to-C22.png' },
};

const CL = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const SIN = Easing.inOut(Easing.sin);

// an image at its base fit (cover; a wide capture full-WIDTH on its own page colour) under a camera that moves from
// [fx0, fy0, s0] to [fx1, fy1, s1] (image fractions), clamped so the frame never shows past the image edge
const CamImg: React.FC<{ src: string; w: number; h: number; bg: string; cam: number[]; p: number }> = ({ src, w, h, bg, cam, p }) => {
  let W2: number, H2: number, left: number, top: number;
  // a WIDE capture sits at 86% width on its own page colour, so a reading push up to ~1.15 never clips a line end
  if (w / h >= 1.95) { W2 = 1650; H2 = (1650 * h) / w; left = (1920 - W2) / 2; top = (1080 - H2) / 2; }
  else {
    const sc = Math.max(1920 / w, 1080 / h);
    W2 = w * sc; H2 = h * sc; left = (1920 - W2) / 2; top = H2 > 1080.5 ? 0 : (1080 - H2) / 2;
  }
  const e = SIN(clamp01(p));
  const [fx0, fy0, s0, fx1, fy1, s1] = cam;
  const s = s0 + (s1 - s0) * e;
  const cl = (v: number, a: number, b: number) => Math.max(Math.min(a, b), Math.min(Math.max(a, b), v));
  const cx = cl(left + (fx0 + (fx1 - fx0) * e) * W2, left + 960 / s, left + W2 - 960 / s);
  const cy = cl(top + (fy0 + (fy1 - fy0) * e) * H2, top + 540 / s, top + H2 - 540 / s);
  return (
    <AbsoluteFill style={{ background: bg, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0',
        transform: `translate(${960 - s * cx}px, ${540 - s * cy}px) scale(${s})` }}>
        <Img src={staticFile(src)} style={{ position: 'absolute', left, top, width: W2, height: H2 }} />
      </div>
    </AbsoluteFill>
  );
};

// LINE-CAPTION (broll-and-containers.md device 3): bold condensed UPPERCASE on VIDEO b-roll only, part of the cover asset
const LineCap: React.FC<{ text: string; pos: 'top' | 'bottom'; f: number }> = ({ text, pos, f }) => {
  const p = interpolate(f, [0, 8], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ position: 'absolute', left: 96, ...(pos === 'top' ? { top: 96 } : { bottom: 110 }), maxWidth: 1180,
      fontFamily: OSWALD, fontWeight: 700, fontSize: 92, lineHeight: 1.04, letterSpacing: '.01em', textTransform: 'uppercase',
      color: '#ffffff', WebkitTextStroke: '10px #000', paintOrder: 'stroke fill', textShadow: '0 8px 24px rgba(0,0,0,.55)',
      opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>{text}</div>
  );
};

// the animated charts: LIVE useCurrentFrame-equivalent components on the absolute clock (comp-build §7)
const ChartFor: React.FC<{ c: Cover; f: number }> = ({ c, f }) => {
  if (c.ref === 'C2') return <ChartC2 f={f} />;
  if (c.ref === 'C4') return <ChartC4 f={f} />;
  if (c.ref === 'C22') return <ChartC22 f={f} />;
  if (c.ref === 'tao-rev-vs-emissions') return <ChartTaoRev f={f} />;
  throw new Error(`no animated chart component for ${c.ref}`);
};

const CoverNode: React.FC<{ i: number; engine?: boolean }> = ({ i, engine }) => {
  const c = COVERS[i];
  const abs = useAbs();
  const f0 = F(c.tIn), f1 = F(c.tOut);
  const p = (abs - f0) / Math.max(1, f1 - f0);
  switch (c.kind) {
    case 'chart':
      return <ChartFor c={c} f={Math.max(0, abs - f0)} />;
    case 'vid':
      if (engine && CUTFRAME[c.ref]) return <Img src={staticFile(CUTFRAME[c.ref])} style={FILL} />;
      return (
        <AbsoluteFill style={{ backgroundColor: '#000' }}>
          <AbsMedia src={`vid/${c.ref}.mp4`} start={f0} frames={CLIPF[c.ref]} />
          {c.lc && <LineCap text={c.lc} pos={c.lcPos ?? 'bottom'} f={abs - f0} />}
        </AbsoluteFill>
      );
    case 'insert': // SPLICED CLIP INSERT (§3d): full-frame, MUTED (its own voice is already in the VO)
      return (
        <AbsoluteFill style={{ backgroundColor: '#000' }}>
          <AbsMedia src={`clip-inserts/${c.ref}.mp4`} start={f0} frames={CLIPF[c.ref]} />
        </AbsoluteFill>
      );
    case 'still':
      if (c.motion) // §3c motion clip: from clip 0, cut at the slot end, never stretched, no Ken Burns on top
        return (
          <AbsoluteFill style={{ backgroundColor: '#000' }}>
            <AbsMedia src={`img-motion/${c.motion}.mp4`} start={f0} frames={CLIPF[c.motion]} />
          </AbsoluteFill>
        );
      return <CamImg src={`img/${c.ref}.png`} w={1920} h={1080} bg="#000" cam={kenBurns(c.ref)} p={p} />;
    case 'receipt': {
      const r = RECEIPTS[c.ref];
      const cam = RCAM[c.stage ? `${c.ref}#${c.stage}` : c.ref] ?? [0.5, 0.5, 1.0, 0.5, 0.5, 1.06];
      return <CamImg src={`receipts/${c.ref}.png`} w={r[1]} h={r[2]} bg={r[0]} cam={cam} p={p} />;
    }
    case 'container':
    case 'deck': {
      const [g0, g1] = GSPAN[i];
      const gc = (c.grp && GCAM[c.grp]) || GCAM_DEFAULT;
      const d = Math.round(gc[6] * FPS);
      const gp = (abs - g0 - d) / Math.max(1, g1 - g0 - d);
      return <CamImg src={`${dirOf(c.ref)}/${c.ref}.png`} w={1920} h={1080} bg="#0a0c10" cam={gc} p={gp} />;
    }
  }
  return null;
};

// hand-rolled ingress (never TransitionSeries on the spine): the outgoing cover keeps playing underneath for N frames
const ING: Record<string, number> = { xfade: 10, xfade20: 6, fade: 15, ifade: 15, swap: 7 };
const RowView: React.FC<{ i: number }> = ({ i }) => {
  const c = COVERS[i];
  const f = useCurrentFrame();
  const n = ING[c.tr] ?? 0;
  const prev = i > 0 ? COVERS[i - 1] : null;
  const contiguous = !!prev && Math.abs(prev.tOut - c.tIn) < 0.02;
  if (n > 0 && contiguous && f < n) {
    const q = Easing.out(Easing.cubic)(clamp01((f + 1) / n));
    const scale = c.tr === 'xfade' ? 0.93 + 0.07 * q : c.tr === 'xfade20' ? 0.97 + 0.03 * q : 1;
    return (
      <AbsoluteFill>
        <CoverNode i={i - 1} />
        <AbsoluteFill style={{ opacity: q, transform: `scale(${scale})` }}><CoverNode i={i} /></AbsoluteFill>
      </AbsoluteFill>
    );
  }
  return <CoverNode i={i} />;
};

// ============================================================================ library transitions (§6a)
// The engine window is EXACTLY `win`, placed so the engine's own A->B swap lands ON the planned cut frame
// (MELT / SPIN: "cut 0.2 s in"; light leaks: the flash peak on the join frame), cutFrame = win/2 inside it.
const swapFrames = (row: TransitionRow, win: number) => {
  const pr = row.params as Record<string, any>;
  if (row.engine === 'PerspectiveEase') return Math.ceil(pr.outPhase.win[0] * FPS - 1e-6);
  const frac = (pr.swapAt ?? pr.cut) as number;
  return Math.ceil(frac * (win - 1) - 1e-9);
};
const EngineWindow: React.FC<{
  id: string; cut: number; outgoing: () => React.ReactNode; incoming: () => React.ReactNode; fromSrc?: string; toSrc?: string;
}> = ({ id, cut, outgoing, incoming, fromSrc, toSrc }) => {
  const row = getTransition(id);
  if (!row) throw new Error(`unknown library transition ${id}`);
  const win = framesForRow(row, FPS);
  const pre = swapFrames(row, win);
  return (
    <Sequence from={cut - pre} durationInFrames={win}>
      <TransitionClip id={id} cutFrame={Math.round(win / 2)} sfx={false} outgoing={outgoing} incoming={incoming}
        fromSrc={fromSrc} toSrc={toSrc} />
    </Sequence>
  );
};
// glitch-still (lib:glitchoffset-1x / -2x), MELT-transform (lib:melt-equidistant-1 / -2), SPIN-newfacet
// (lib:spin-corner-ease-lt): one per COVERS row whose tr is 'lib', outgoing = the previous cover as it airs.
const LibTransitions: React.FC = () => (
  <>
    {COVERS.map((c, i) => (c.tr === 'lib' && c.lib ? (
      <EngineWindow key={`lib-${i}`} id={c.lib} cut={F(c.tIn)}
        outgoing={() => <CoverNode i={i - 1} engine />} incoming={() => <CoverNode i={i} engine />}
        fromSrc={MELT_STILLS[c.ref]?.from} toSrc={MELT_STILLS[c.ref]?.to} />
    ) : null))}
  </>
);
// punch-leak (lib:lightleaks-8 / -3 / -short-8 / -short-3): over the live face, both sides the faithful spine copy
const Leaks: React.FC = () => (
  <>
    {PUNCH_F.map((p, k) => (
      <EngineWindow key={`leak-${k}`} id={p.leak} cut={p.f} outgoing={() => <SpineAt />} incoming={() => <SpineAt />} />
    ))}
  </>
);

// ============================================================================ chapter cards: rmn:flip (from-right)
// A self-contained scene (never TransitionSeries on the spine): flip IN over IN_F, hold through the baked pause,
// flip OUT over OUT_F onto the chapter's first visual as the pause ends; never a cube-out back to the old shot.
const IN_F = 12, OUT_F = 10;
const CARDS = [
  { at: 104.99, title: 'title-CH2', faceOut: null as number | null, outBlack: false },   // ARBITRUM: flips in at the pause, over BR-3
  { at: 267.875, title: 'title-CH3', faceOut: 267.87, outBlack: true },   // KASPA: flips in from the BLACKOUT below, before the voice
  { at: 371.8, title: 'title-CH4', faceOut: 371.733 },                 // TAO: ON the F7 out
  { at: 494.93, title: 'title-CH5', faceOut: 494.9 },                  // TON: ON the F9 out
].map((k) => {
  const start = k.faceOut === null ? PS(k.at) : F(k.faceOut);
  const end = F(k.at);                                                  // the pause end (sh(at) includes it)
  const readable = (end - start - IN_F) / FPS;
  if (readable < 1.0) throw new Error(`${k.title} readable ${readable.toFixed(2)} s < 1.0 s (Mike 2026-07-25)`);
  const outIdx = COVERS.findIndex((c) => c.tIn < k.at && c.tOut >= k.at - 0.02);   // the cover under the pause (CH2)
  const inIdx = COVERS.findIndex((c) => c.tIn >= k.at - 0.001);                     // the chapter's first visual
  return { ...k, start, end, readable, outIdx, inIdx };
});
const CardScene: React.FC<{ k: (typeof CARDS)[number] }> = ({ k }) => {
  const L = k.end - k.start;
  const outNode = k.outBlack
    ? <AbsoluteFill style={{ backgroundColor: '#000' }} />                              // flips in from the blackout
    : k.faceOut === null
    ? <AbsCtx.Provider value={k.start}><CoverNode i={k.outIdx} /></AbsCtx.Provider>   // frozen where it stood
    : <SpineAt frame={k.start - 1} />;                                                  // the last face frame, frozen
  const ease = Easing.inOut(Easing.cubic);
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={IN_F}>{outNode}</TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={flip({ direction: 'from-right' })}
          timing={linearTiming({ durationInFrames: IN_F, easing: ease })} />
        <TransitionSeries.Sequence durationInFrames={L + OUT_F}>
          <Img src={staticFile(`title-slides/${k.title}.png`)} style={FILL} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={flip({ direction: 'from-right' })}
          timing={linearTiming({ durationInFrames: OUT_F, easing: ease })} />
        <TransitionSeries.Sequence durationInFrames={OUT_F}><CoverNode i={k.inIdx} /></TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};

// ============================================================================ blackouts (Mike, final review 2026-10-11)
// At 4:49 he looks off to the side on "research." right before the KASPA card: the picture goes BLACK from the look-away
// (source 267.6 = frame 8668, the F5 face cut, film-burned) to the card, which flips in from black. Voice untouched;
// no caption over the black.
const BLACKOUTS: { from: number; card: string }[] = [{ from: 267.6, card: 'title-CH3' }];
const BLACK_F = BLACKOUTS.map(({ from, card }) => {
  const k = CARDS.find((c) => c.title === card);
  if (!k || !k.outBlack) throw new Error(`blackout before ${card}: its card must flip in from black (outBlack)`);
  return [F(from), k.start] as [number, number];
});
const Blackouts: React.FC = () => (
  <>
    {BLACK_F.map(([a, b], i) => (
      <Sequence key={`black-${i}`} from={a} durationInFrames={b - a}>
        <AbsoluteFill style={{ backgroundColor: '#000' }} />
      </Sequence>
    ))}
  </>
);

// ============================================================================ face cuts: hand:film-burn (the face pick)
// A warm optical flash PEAKING on the cut frame (the hard cut hides under it); 0.76 s standard, 0.40 s short on F4's
// two edges and the three card-shared face outs. F1 opens ON the face (no row); 648.267 = hand:cut picture end.
const FACE_CUTS: { t: number; dur: number }[] = [
  { t: 35.133, dur: 0.76 }, { t: 76.833, dur: 0.76 }, { t: 84.967, dur: 0.76 }, { t: 169.867, dur: 0.76 },
  { t: 176.367, dur: 0.76 }, { t: 196.633, dur: 0.4 }, { t: 198.267, dur: 0.4 }, { t: 244.533, dur: 0.76 },
  { t: 267.6, dur: 0.4 }, { t: 315.0, dur: 0.76 },   // 267.6: F5 now cuts to the blackout (was 267.87, Mike 2026-10-11) { t: 319.267, dur: 0.76 }, { t: 361.7, dur: 0.76 },
  { t: 371.733, dur: 0.4 }, { t: 415.433, dur: 0.76 }, { t: 420.533, dur: 0.76 }, { t: 485.4, dur: 0.76 },
  { t: 494.9, dur: 0.4 }, { t: 562.033, dur: 0.76 }, { t: 571.767, dur: 0.76 }, { t: 582.9, dur: 0.76 },
];
const FilmBurn: React.FC<{ n: number; peak: number }> = ({ n, peak }) => {
  const f = useCurrentFrame();
  const x = (f - peak) / Math.max(1, f < peak ? peak : n - 1 - peak);   // -1 .. 0 (peak) .. 1
  const a = Math.pow(clamp01(1 - Math.abs(x)), 1.4);
  const sweep = interpolate(f, [0, n - 1], [18, 82], CL);               // the burn travels across the frame
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: a,
        background: `radial-gradient(ellipse 75% 95% at ${sweep}% 55%, rgba(255,214,140,1) 0%, rgba(255,146,40,.95) 28%, rgba(226,72,8,.75) 52%, rgba(120,18,0,.35) 74%, rgba(0,0,0,0) 92%)` }} />
      <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: 0.55 * a,
        background: 'linear-gradient(100deg, rgba(255,110,20,.9) 0%, rgba(255,170,60,.5) 45%, rgba(255,80,0,.85) 100%)' }} />
      <AbsoluteFill style={{ opacity: Math.pow(a, 3) * 0.85,
        background: `radial-gradient(ellipse 60% 70% at ${sweep}% 50%, rgba(255,246,226,1) 0%, rgba(255,230,190,.85) 40%, rgba(255,200,140,0) 85%)` }} />
    </AbsoluteFill>
  );
};
const FilmBurns: React.FC = () => (
  <>
    {FACE_CUTS.map((b, k) => {
      const n = Math.round(b.dur * FPS);
      const peak = Math.floor(n / 2);
      return (
        <Sequence key={`burn-${k}`} from={F(b.t) - peak} durationInFrames={n}>
          <FilmBurn n={n} peak={peak} />
        </Sequence>
      );
    })}
  </>
);

// ============================================================================ captions (§8; ON over FACE windows only)
// Data: RetireEarlyCaptions.ts (build_project_captions.py via the captions node; montserrat, 2 words / up to 4 short),
// already minus the screen share (AS-RECORDED Captions OFF 588.267-648.267). CAPTION_SRC mirrors it for lint_covers.
const CAPTION_SRC: [number, number][] = [[0.000, 35.133], [76.833, 84.967], [169.867, 176.367], [244.533, 267.870], [361.700, 371.733], [415.433, 420.533], [485.400, 494.900], [562.033, 571.767], [582.900, 588.267]];
if (JSON.stringify(CAPTION_SRC) !== JSON.stringify(CAPTION_WINDOWS)) throw new Error('CAPTION_SRC drifted from RetireEarlyCaptions.CAPTION_WINDOWS');
const CAPS = ZCAPTIONS.map((c) => ({ tf: sh(c.t), h: c.h }));
const CAPWIN = CAPTION_WINDOWS.map(([a, b]) => [F(a), F(b)] as [number, number]);   // FRAME-exact: never a frame over a cover
const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (!CAPWIN.some(([a, b]) => frame >= a && frame < b)) return null;
  if (BLACK_F.some(([a, b]) => frame >= a && frame < b)) return null;
  let cur: { tf: number; h: string } | null = null;
  for (const c of CAPS) { if (c.tf <= t) cur = c; else break; }
  if (!cur) return null;
  const nxt = CAPS.find((c) => c.tf > cur!.tf);
  if (t >= Math.min(nxt ? nxt.tf : Infinity, cur.tf + 1.3)) return null;
  const df = (t - cur.tf) * FPS;
  const pop = interpolate(df, [0, 4, 9], [0.7, 1.12, 1], CL);
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 96, pointerEvents: 'none' }}>
      <div style={{ fontFamily: "Montserrat,'Arial Black','Segoe UI',sans-serif", fontWeight: 900, fontSize: 92, lineHeight: 1.08,
        textTransform: 'lowercase', color: '#ffffff', WebkitTextStroke: '12px #000', paintOrder: 'stroke fill',
        textAlign: 'center', maxWidth: 1640, transform: `scale(${pop})`, transformOrigin: '50% 80%' }}>{cur.h}</div>
    </AbsoluteFill>
  );
};

// ============================================================================ the composition
// inputProps.captions=false renders the picture WITHOUT the burned caption track (the 16:9-sourced short re-frames spans 9:16
// and captions them itself; longform-to-short.md). Default true = the delivered longform.
export const RetireEarly: React.FC<{ noLib?: boolean; captions?: boolean }> = ({ noLib = false, captions = true }) => {
  const abs = useCurrentFrame();
  return (
    <AbsCtx.Provider value={abs}>
      <AbsoluteFill style={{ backgroundColor: '#000' }}>
        <SpineLive />
        {COVERS.map((c, i) => (
          <Sequence key={`cv-${i}`} from={F(c.tIn)} durationInFrames={coverEndF(c) - F(c.tIn)}>
            <RowView i={i} />
          </Sequence>
        ))}
        {!noLib && <LibTransitions />}
        <Leaks />
        <Blackouts />
        {CARDS.map((k) => (
          <Sequence key={`card-${k.title}`} from={k.start} durationInFrames={k.end - k.start + OUT_F}>
            <CardScene k={k} />
          </Sequence>
        ))}
        <FilmBurns />
        {captions && <Captions />}
      </AbsoluteFill>
    </AbsCtx.Provider>
  );
};

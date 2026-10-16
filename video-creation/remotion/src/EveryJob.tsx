// EveryJob.tsx: every-job longform-edited comp ("Literally Every Job Is at Risk"), built TO the approved blueprint
// (media/every-job: EDIT-PLAN.md, CUE-SHEET.md, TRANSITIONS.md + TRANSITION-PLAN.json, COVER-PLAN.json, AS-RECORDED.md,
// assets/diagrams/_state-cues.md, assets/charts/*.spec.md, PROJECT-LOG.md Open flags) per
// longform-edited/skills/comp-build/comp-build.md. comp-builder, 2026-10-07.
//
// DRAFT v2 FIX ROUND (comp-builder, 2026-10-08, Mike's draft v1 verdict, PROJECT-LOG 07:03): (1) assets/spine.mp4 =
// spine/ALL.f.paused.mp4, the timing is a PAUSES table (INSERTS: five 1.5 s cards + the 10.0 s R17 clip insert);
// (2) the R17 Huang clip SPLICED at source 616.1 (picture over the paused gap, muted, hand:fade in/out; lead-in first
// frame / lead-out last frame held); (3) tier badges off everywhere (SHOW_TIER_BADGES=false, the animated badge beats
// removed, the charts' pills hidden as in their sources); (4) the on-screen correction "mined" on 'minted' (15:57.1);
// (5) EveryJobCaptions.ts regenerated (cryptorich.vip as one token).
//
// Model (comp-build §0): ONE paused gated-face spine. Its VO plays from frame 0 (<Audio>); its picture is shown only
// inside the 17 FACE windows (the measured FACE_REFRAME, §3a), and F1..F10 air the PRE-FRAMED Higgsfield
// background-swap clips instead (§3b, no FACE_REFRAME on top). Every COVER beat is one row of COVERS (one row per
// state / sub-point). Library transitions (face Blocks, AI-still TV Satellite, marquee MELT/SPIN, punch LIGHT LEAKS)
// are TransitionClips in EXACTLY their engine window, swap frame ON the cut (§6a); every face-side node is a real
// <Freeze>, muted, same transform, same source. Cards: rmn:slide (from-top) via @remotion/transitions, a self-
// contained scene over covers only. Captions (generated, Montserrat) only inside CAPTION_WINDOWS, topmost.
// NO music, NO SFX (post-mix, §9; every TransitionClip has sfx={false}), NO watermark.
//
// Every time below is a SOURCE (pre-pause) spine second routed through sh() / F().
//
// DIAGRAM_REFS: new-jobs-chain, C1, C14
// (end declared refs)
// TRANSITIONS_WAIVED: (none) every lib: id of TRANSITIONS.md is wired in XFX below
import React, { createContext, useContext } from 'react';
import {
  AbsoluteFill, Audio, Easing, Freeze, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame,
} from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { slide } from '@remotion/transitions/slide';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { TransitionClip } from './transitions/TransitionClip';
import { getTransition, framesForRow } from './transitions/registry';
import { ZCAPTIONS, CAPTION_WINDOWS } from './EveryJobCaptions';
import { RECEIPTS, LIFT, LIFT_BG, PULSES, PATCH, VIDEO_SECS, CUTFRAME, SWAP } from './EveryJobData';
import { ChartView, ChartStyle } from './EveryJobCharts';

const { fontFamily: MONTSERRAT } = loadMontserrat('normal', { weights: ['900'], subsets: ['latin'] });

// ------------------------------------------------------------------ timing (§2): the PAUSES table (draft v2, 2026-10-08)
export const FPS = 30;
// spine/ALL.f.paused.json pauses[] (at = SOURCE second, dur = seconds baked into the paused spine): the five title-card
// pauses (pause_s 1.5) + the R17 Huang CLIP INSERT (10.0 s, his own voice already in the spine's VO track). Read by
// lint-pause-silence.py and bed-duck-expr.py (the comp's INSERTS block).
export const INSERTS = [
  { at: 62.945, dur: 1.5 },    // card CH2 THE BRAIN WENT FIRST
  { at: 232.675, dur: 1.5 },   // card CH3 THEN IT GOT A BODY
  { at: 445.945, dur: 1.5 },   // card CH4 THE LIST
  { at: 616.1, dur: 10.0 },    // R17 SPLICED CLIP (Mike 2026-10-08, option 1: after 'radiology')
  { at: 703.955, dur: 1.5 },   // card CH5 WHAT IT DOES TO THE ECONOMY
  { at: 879.36, dur: 1.5 },    // card CH7 HOW TO PROTECT YOURSELF
];
const PAUSE = 1.5;                                                   // spine/ALL.f.paused.json pause_s (a card's pause)
const CARD_T = [62.945, 232.675, 445.945, 703.955, 879.36];          // the card rows of INSERTS (literal for lint_slide_balance.py)
const CLIP_T = 616.1;                                                // the R17 clip insert row of INSERTS
const SPINE_SECS = 1121.003;                                         // SOURCE spine spine/ALL.d.desilenced.mp4
if (CARD_T.some((c) => !INSERTS.some((q) => q.at === c && q.dur === PAUSE)) || INSERTS.length !== CARD_T.length + 1 || !INSERTS.some((q) => q.at === CLIP_T)) {
  throw new Error('CARD_T / CLIP_T drifted from INSERTS (spine/ALL.f.paused.json)');
}
/** SOURCE second -> PAUSED-spine second: adds the dur of every pause whose at <= t */
const sh = (t: number) => t + INSERTS.reduce((s, q) => s + (q.at <= t ? q.dur : 0), 0);
/** a pause's OWN start on the paused spine (the pause at b itself not yet added) */
const cardStart = (b: number) => b + INSERTS.reduce((s, q) => s + (q.at < b ? q.dur : 0), 0);
const F = (t: number) => Math.round(sh(t) * FPS);
// the paused spine assets/spine.mp4 = spine/ALL.f.paused.mp4: 1138.543 s (format = the VO's end) over 34156 picture frames
// (ffprobe -count_packets, 1138.533 s). DUR = ceil(1138.543 * 30) = 34157 (check_spine_fps.py: the render carries the whole
// VO); the face layer clamps to the last PICTURE frame (34155), so the final comp frame repeats it.
const SPINE_FORMAT_SECS = 1138.543;
const SPINE_FRAMES = 34156;
export const DUR = Math.ceil(SPINE_FORMAT_SECS * FPS);              // 34157
if (Math.abs(DUR - (SPINE_SECS + INSERTS.reduce((s, q) => s + q.dur, 0)) * FPS) > 3 || DUR - SPINE_FRAMES !== 1) throw new Error('DUR drifted from SPINE_SECS + INSERTS / the paused spine');
/** paused-spine frame -> SOURCE second (frozen on the pause's own time inside a card pause or the clip insert) */
const srcT = (frame: number) => {
  const p = frame / FPS;
  let acc = 0;
  for (const q of INSERTS) {
    const ps = q.at + acc;
    if (p < ps) return p - acc;
    if (p < ps + q.dur) return q.at;
    acc += q.dur;
  }
  return p - acc;
};

// ------------------------------------------------------------------ face (§3a / §3b)
export const FACE_REFRAME = { scale: 1.478, x: -798, y: -287 };   // assets/face-reframe.json, never hand-tuned
const FACE_POINT = { x: 960, y: 432 };                            // face-reframe.json face_point_out
// AS-RECORDED FACE windows (= face-reframe.json windows), SOURCE seconds. F1..F10 air the swap clips (SWAP).
const FACES: [number, number][] = [
  [0.167, 10.4], [28.3, 31.233], [138.333, 141.7], [206.7, 212.133], [303.467, 305.8], [321.933, 325.3],
  [452.2, 454.4], [550.767, 556.533], [574.033, 577.367], [592.0, 596.767], [676.067, 683.0], [740.533, 743.033],
  [785.833, 788.6], [883.967, 887.033], [1057.633, 1062.267], [1069.4, 1075.267], [1077.633, 1120.967],
];
const faceF0 = (n: number) => F(FACES[n - 1][0]);
// measured on assets/spine.mp4 (ffmpeg, 2026-10-07): F15, F16 and F17 open one frame AFTER their AS-RECORDED edge
// (the spine's frame F(a) is still black there); a face still never shows that black frame
const FACE_EDGE_SHIFT: Record<number, number> = { 15: 1, 16: 1, 17: 1 };
// draft v2 (2026-10-08): assets/spine.mp4 is now spine/ALL.f.paused.mp4 (re-baked with the R17 clip insert). Measured against
// the v1 spine ALL.e.paused.mp4 (per-frame luma edges + consecutive-difference alignment, every FACE window): F1..F10 and
// F15..F17 sit on exactly the v1 frames (+300 after the insert), but the F11..F14 picture landed ONE frame later (+301: the
// bake's 30 fps grid re-rounded on the segment after the insert). SPINE_SKEW reads the spine one frame ahead there, so each
// face shows the v1 frame on the v1 comp-relative frame (same picture/VO relation as the approved v1, no black first frame).
const SPINE_SKEW: Record<number, number> = { 11: 1, 12: 1, 13: 1, 14: 1 };
const faceF1 = (n: number) => (n === FACES.length ? DUR : F(FACES[n - 1][1]));   // F17 holds to the last frame

// captions: the generated windows (captions-builder: FACE holds > 5 s), literal copy for lint_covers.py
const CAPTION_SRC: [number, number][] = [[0.167, 10.4], [206.7, 212.133], [550.767, 556.533], [676.067, 683.0], [1069.4, 1075.267], [1077.633, 1120.967]];
if (CAPTION_SRC.length !== CAPTION_WINDOWS.length || CAPTION_SRC.some(([a, b], i) => Math.abs(a - CAPTION_WINDOWS[i][0]) > 1e-3 || Math.abs(b - CAPTION_WINDOWS[i][1]) > 1e-3)) {
  throw new Error('CAPTION_SRC drifted from EveryJobCaptions.CAPTION_WINDOWS');
}

// ------------------------------------------------------------------ tables (generated from the blueprint)
type Kind = 'still' | 'vid' | 'receipt' | 'chart' | 'deck' | 'container';
type Cover = {
  tIn: number; tOut: number; kind: Kind; ref: string; state?: string; file?: string;
  fx: string; fxd?: number; badge?: 'deployed' | 'claimed' | 'forecast'; illus?: boolean; hw?: boolean;
  lead?: boolean; cap?: boolean; torn?: boolean; label?: string; note?: string;
};
type Xfx = { tc: number; id: string; kind: 'face-in' | 'face-out' | 'still' | 'melt' | 'spin' | 'leak'; face?: number; shift?: number };
type Punch = { tc: number; scale: number; face: number; crash?: boolean };

// <GEN:TABLES> generated by media/every-job/_previews/comp-build/gen_data.py from the blueprint; do not hand-edit
// (draft v2 fix round 2026-10-08: the two R17 rows were HAND-EDITED for the clip insert; gen_data.py still writes the v1 single R17 row)
export const COVERS: Cover[] = [
  { tIn: 0.0, tOut: 0.167, kind: 'container', ref: 'black-lead', state: 'full', file: 'card-slides/black-lead.png', fx: 'cut' },  // 0:00.0 ingress cut
  { tIn: 10.4, tOut: 13.84, kind: 'receipt', ref: 'C20-hinton-plumber', file: 'receipts/C20-hinton-plumber.mp4', fx: 'face' },  // 0:10.4 ingress face
  { tIn: 13.84, tOut: 15.7, kind: 'receipt', ref: 'R14', state: 'stack-back', file: 'receipts/R14.png', fx: 'xfade-scale', fxd: 0.35 },  // 0:13.8 ingress hand:xfade-scale
  { tIn: 15.7, tOut: 20.4, kind: 'receipt', ref: 'C21', state: 'stack-front', file: 'receipts/C21.png', fx: 'slide-in', fxd: 0.3 },  // 0:15.7 ingress hand:slide-in
  { tIn: 20.4, tOut: 23.9, kind: 'container', ref: 'hinton-quote-full', state: 'full', file: 'card-slides/hinton-quote-full.png', fx: 'xfade-scale', fxd: 0.35 },  // 0:20.4 ingress hand:xfade-scale
  { tIn: 23.9, tOut: 26.0, kind: 'container', ref: 'hinton-quote-full', state: 'lift:goodbet', file: 'card-slides/hinton-quote-full.png', fx: 'state' },  // 0:23.9 ingress state
  { tIn: 26.0, tOut: 26.28, kind: 'container', ref: 'hinton-quote-full', state: 'lift:clause', file: 'card-slides/hinton-quote-full.png', fx: 'state' },  // 0:26.0 ingress state
  { tIn: 26.28, tOut: 28.3, kind: 'vid', ref: 'BR-1-humanoids-walking-dark', file: 'vid/BR-1-humanoids-walking-dark.mp4', fx: 'fade', fxd: 0.5 },  // 0:26.3 ingress hand:fade
  { tIn: 31.233, tOut: 35.22, kind: 'chart', ref: 'H0', state: 'payoff', fx: 'face' },  // 0:31.2 ingress face
  { tIn: 35.22, tOut: 39.2, kind: 'vid', ref: 'BR-2-humanoid-factory-assembly', file: 'vid/BR-2-humanoid-factory-assembly.mp4', fx: 'fade', fxd: 0.5 },  // 0:35.2 ingress hand:fade
  { tIn: 39.2, tOut: 42.48, kind: 'still', ref: 'IMG-1-robot-sunlit-entryway-staircase', file: 'img/IMG-1-robot-sunlit-entryway-staircase.png', fx: 'lib', badge: 'forecast', illus: true },  // 0:39.2 ingress lib
  { tIn: 42.48, tOut: 44.42, kind: 'vid', ref: 'BR-3-plumber-under-sink', file: 'vid/BR-3-plumber-under-sink.mp4', fx: 'fade', fxd: 0.27 },  // 0:42.5 ingress hand:fade
  { tIn: 44.42, tOut: 46.34, kind: 'vid', ref: 'BR-4-electrician-terminal-screwdriver', file: 'vid/BR-4-electrician-terminal-screwdriver.mp4', fx: 'fade', fxd: 0.27 },  // 0:44.4 ingress hand:fade
  { tIn: 46.34, tOut: 47.98, kind: 'vid', ref: 'BR-5-roofer-nail-gun-shingles', file: 'vid/BR-5-roofer-nail-gun-shingles.mp4', fx: 'fade', fxd: 0.27 },  // 0:46.3 ingress hand:fade
  { tIn: 47.98, tOut: 51.02, kind: 'vid', ref: 'BR-6-welding-sparks-hands', file: 'vid/BR-6-welding-sparks-hands.mp4', fx: 'fade', fxd: 0.5 },  // 0:48.0 ingress hand:fade
  { tIn: 51.02, tOut: 53.76, kind: 'chart', ref: 'C5-tease', state: 'payoff', fx: 'xfade-scale', fxd: 0.35 },  // 0:51.0 ingress hand:xfade-scale
  { tIn: 53.76, tOut: 57.7, kind: 'still', ref: 'IMG-2-man-kitchen-table-paycheck', file: 'img/IMG-2-man-kitchen-table-paycheck.png', fx: 'lib' },  // 0:53.8 ingress lib
  { tIn: 57.7, tOut: 60.14, kind: 'vid', ref: 'BR-7-descending-dark-stairwell', file: 'vid/BR-7-descending-dark-stairwell.mp4', fx: 'fade', fxd: 0.5, lead: true },  // 0:57.7 ingress hand:fade
  { tIn: 60.14, tOut: 62.945, kind: 'vid', ref: 'BR-8-hands-assembling-puzzle', file: 'vid/BR-8-hands-assembling-puzzle.mp4', fx: 'fade', fxd: 0.5 },  // 1:00.1 ingress hand:fade
  { tIn: 62.945, tOut: 66.12, kind: 'still', ref: 'IMG-3-brain-circuitry-server-room', file: 'img/IMG-3-brain-circuitry-server-room.png', fx: 'card', hw: true },  // 1:02.9 ingress card
  { tIn: 66.12, tOut: 69.26, kind: 'vid', ref: 'BR-9-worker-cranks-machine-wheel', file: 'vid/BR-9-worker-cranks-machine-wheel.mp4', fx: 'fade', fxd: 0.5, hw: true },  // 1:06.1 ingress hand:fade
  { tIn: 69.26, tOut: 71.3, kind: 'container', ref: 'automation-before-now', state: 's1', file: 'card-slides/automation-before-now-s1.png', fx: 'xfade-scale', fxd: 0.35, hw: true },  // 1:09.3 ingress hand:xfade-scale
  { tIn: 71.3, tOut: 74.36, kind: 'container', ref: 'automation-before-now', state: 's2', file: 'card-slides/automation-before-now-s2.png', fx: 'state', hw: true },  // 1:11.3 ingress state
  { tIn: 74.36, tOut: 78.8, kind: 'container', ref: 'labor-substitution', state: 'full', file: 'card-slides/labor-substitution.png', fx: 'xfade-scale', fxd: 0.35, hw: true },  // 1:14.4 ingress hand:xfade-scale
  { tIn: 78.8, tOut: 79.76, kind: 'container', ref: 'labor-substitution', state: 'lift:replaces', file: 'card-slides/labor-substitution.png', fx: 'state', hw: true },  // 1:18.8 ingress state
  { tIn: 79.76, tOut: 83.16, kind: 'receipt', ref: 'C35-techcrunch-scroll', file: 'receipts/C35-techcrunch-scroll.mp4', fx: 'xfade-scale', fxd: 0.35, hw: true },  // 1:19.8 ingress hand:xfade-scale
  { tIn: 83.16, tOut: 84.5, kind: 'receipt', ref: 'C34-top', file: 'receipts/C34-top.png', fx: 'xfade-scale', fxd: 0.35, hw: true },  // 1:23.2 ingress hand:xfade-scale
  { tIn: 84.5, tOut: 88.0, kind: 'receipt', ref: 'C34', file: 'receipts/C34.png', fx: 'xfade', fxd: 0.2, hw: true },  // 1:24.5 ingress hand:xfade
  { tIn: 88.0, tOut: 93.8, kind: 'chart', ref: 'C11', state: 'payoff', fx: 'xfade-scale', fxd: 0.35, hw: true },  // 1:28.0 ingress hand:xfade-scale
  { tIn: 93.8, tOut: 96.2, kind: 'receipt', ref: 'C10-top', file: 'receipts/C10-top.png', fx: 'xfade-scale', fxd: 0.35, hw: true },  // 1:33.8 ingress hand:xfade-scale
  { tIn: 96.2, tOut: 101.04, kind: 'receipt', ref: 'C10', file: 'receipts/C10.png', fx: 'xfade', fxd: 0.2, hw: true },  // 1:36.2 ingress hand:xfade
  { tIn: 101.04, tOut: 106.48, kind: 'chart', ref: 'C10R', state: 'payoff', fx: 'xfade-scale', fxd: 0.35, hw: true },  // 1:41.0 ingress hand:xfade-scale
  { tIn: 106.48, tOut: 112.28, kind: 'receipt', ref: 'R19', file: 'receipts/R19.png', fx: 'xfade-scale', fxd: 0.35, hw: true },  // 1:46.5 ingress hand:xfade-scale
  { tIn: 112.28, tOut: 116.1, kind: 'vid', ref: 'BR-10-applicant-walks-through-door', file: 'vid/BR-10-applicant-walks-through-door.mp4', fx: 'fade', fxd: 0.5, hw: true },  // 1:52.3 ingress hand:fade
  { tIn: 116.1, tOut: 119.22, kind: 'vid', ref: 'BR-11-man-shrugs-grey', file: 'vid/BR-11-man-shrugs-grey.mp4', fx: 'fade', fxd: 0.5, hw: true },  // 1:56.1 ingress hand:fade
  { tIn: 119.22, tOut: 122.5, kind: 'container', ref: 'new-jobs-cliche', state: 'pre', file: 'card-slides/new-jobs-cliche.png', fx: 'xfade-scale', fxd: 0.35, hw: true },  // 1:59.2 ingress hand:xfade-scale
  { tIn: 122.5, tOut: 124.46, kind: 'container', ref: 'new-jobs-cliche', state: 'draw', file: 'card-slides/new-jobs-cliche.png', fx: 'state', hw: true },  // 2:02.5 ingress state
  { tIn: 124.46, tOut: 127.2, kind: 'container', ref: 'new-jobs-dissect', state: 'full', file: 'card-slides/new-jobs-dissect.png', fx: 'xfade-scale', fxd: 0.35, hw: true },  // 2:04.5 ingress hand:xfade-scale
  { tIn: 127.2, tOut: 129.86, kind: 'container', ref: 'new-jobs-dissect', state: 'lift:truth', file: 'card-slides/new-jobs-dissect.png', fx: 'state', hw: true },  // 2:07.2 ingress state
  { tIn: 129.86, tOut: 131.2, kind: 'deck', ref: 'new-jobs-chain', state: 's1', file: 'diagrams/new-jobs-chain-s1.png', fx: 'xfade-scale', fxd: 0.35, hw: true },  // 2:09.9 ingress hand:xfade-scale
  { tIn: 131.2, tOut: 132.6, kind: 'container', ref: 'new-jobs-chain', state: 's2', file: 'diagrams/new-jobs-chain-s2.png', fx: 'state', hw: true },  // 2:11.2 ingress state
  { tIn: 132.6, tOut: 134.76, kind: 'container', ref: 'new-jobs-chain', state: 's3', file: 'diagrams/new-jobs-chain-s3.png', fx: 'state', hw: true },  // 2:12.6 ingress state
  { tIn: 134.76, tOut: 136.94, kind: 'container', ref: 'new-jobs-chain', state: 's4', file: 'diagrams/new-jobs-chain-s4.png', fx: 'state', hw: true },  // 2:14.8 ingress state
  { tIn: 136.94, tOut: 138.333, kind: 'container', ref: 'new-jobs-chain', state: 's5', file: 'diagrams/new-jobs-chain-s5.png', fx: 'state', hw: true },  // 2:16.9 ingress state
  { tIn: 141.7, tOut: 142.46, kind: 'container', ref: 'new-jobs-chain-broken', state: 's1', file: 'diagrams/new-jobs-chain-broken-s1.png', fx: 'face', hw: true },  // 2:21.7 ingress face
  { tIn: 142.46, tOut: 144.1, kind: 'container', ref: 'new-jobs-chain-broken', state: 's2', file: 'diagrams/new-jobs-chain-broken-s2.png', fx: 'state', hw: true },  // 2:22.5 ingress state
  { tIn: 144.1, tOut: 144.88, kind: 'container', ref: 'new-jobs-chain-broken', state: 's3', file: 'diagrams/new-jobs-chain-broken-s3.png', fx: 'state', hw: true },  // 2:24.1 ingress state
  { tIn: 144.88, tOut: 148.44, kind: 'vid', ref: 'BR-12-antique-telephone-receiver', file: 'vid/BR-12-antique-telephone-receiver.mp4', fx: 'fade', fxd: 0.5, hw: true },  // 2:24.9 ingress hand:fade
  { tIn: 148.44, tOut: 152.12, kind: 'still', ref: 'IMG-4-1920s-telephone-exchange', file: 'img/IMG-4-1920s-telephone-exchange.png', fx: 'lib', hw: true },  // 2:28.4 ingress lib
  { tIn: 152.12, tOut: 155.66, kind: 'vid', ref: 'BR-13-rotary-phone-dialing', file: 'vid/BR-13-rotary-phone-dialing.mp4', fx: 'fade', fxd: 0.5, hw: true },  // 2:32.1 ingress hand:fade
  { tIn: 155.66, tOut: 162.84, kind: 'receipt', ref: 'R1', file: 'receipts/R1.png', fx: 'xfade-scale', fxd: 0.35, hw: true, torn: true },  // 2:35.7 ingress hand:xfade-scale
  { tIn: 162.84, tOut: 166.22, kind: 'vid', ref: 'BR-14-horse-carriage-coachman', file: 'vid/BR-14-horse-carriage-coachman.mp4', fx: 'fade', fxd: 0.5, hw: true },  // 2:42.8 ingress hand:fade
  { tIn: 166.22, tOut: 172.12, kind: 'chart', ref: 'horses-card', state: 'payoff', fx: 'xfade-scale', fxd: 0.35, hw: true },  // 2:46.2 ingress hand:xfade-scale
  { tIn: 172.12, tOut: 175.06, kind: 'vid', ref: 'BR-15-vintage-1920s-sedan', file: 'vid/BR-15-vintage-1920s-sedan.mp4', fx: 'fade', fxd: 0.5, hw: true },  // 2:52.1 ingress hand:fade
  { tIn: 175.06, tOut: 178.46, kind: 'still', ref: 'IMG-5-1920s-boomtown-factory-gates', file: 'img/IMG-5-1920s-boomtown-factory-gates.png', fx: 'lib', hw: true },  // 2:55.1 ingress lib
  { tIn: 178.46, tOut: 182.44, kind: 'vid', ref: 'BR-16-market-street-1906-archive', file: 'vid/BR-16-market-street-1906-archive.mp4', fx: 'fade', fxd: 0.5, hw: true },  // 2:58.5 ingress hand:fade
  { tIn: 182.44, tOut: 185.42, kind: 'vid', ref: 'BR-17-exchange-wiring-frames', file: 'vid/BR-17-exchange-wiring-frames.mp4', fx: 'fade', fxd: 0.5, hw: true },  // 3:02.4 ingress hand:fade
  { tIn: 185.42, tOut: 189.42, kind: 'vid', ref: 'BR-18-model-t-old-car-plant', file: 'vid/BR-18-model-t-old-car-plant.mp4', fx: 'fade', fxd: 0.5, hw: true },  // 3:05.4 ingress hand:fade
  { tIn: 189.42, tOut: 191.2, kind: 'vid', ref: 'BR-19-machinist-vise-metal-part', file: 'vid/BR-19-machinist-vise-metal-part.mp4', fx: 'fade', fxd: 0.27, hw: true },  // 3:09.4 ingress hand:fade
  { tIn: 191.2, tOut: 195.2, kind: 'vid', ref: 'BR-20-robot-arms-auto-part', file: 'vid/BR-20-robot-arms-auto-part.mp4', fx: 'cut', fxd: 0.0, hw: true },  // 3:11.2 ingress cut
  { tIn: 195.2, tOut: 198.84, kind: 'still', ref: 'IMG-6-dark-automated-factory-no-people', file: 'img/IMG-6-dark-automated-factory-no-people.png', fx: 'lib', illus: true, hw: true },  // 3:15.2 ingress lib
  { tIn: 198.84, tOut: 206.7, kind: 'chart', ref: 'C2', state: 'payoff', fx: 'xfade-scale', fxd: 0.35, hw: true },  // 3:18.8 ingress hand:xfade-scale
  { tIn: 212.133, tOut: 214.64, kind: 'receipt', ref: 'C23', file: 'receipts/C23.png', fx: 'face', badge: 'claimed', hw: true },  // 3:32.1 ingress face
  { tIn: 214.64, tOut: 217.0, kind: 'receipt', ref: 'C22-top', file: 'receipts/C22-top.png', fx: 'xfade-scale', fxd: 0.35, badge: 'claimed', hw: true },  // 3:34.6 ingress hand:xfade-scale
  { tIn: 217.0, tOut: 223.68, kind: 'receipt', ref: 'C22', file: 'receipts/C22.png', fx: 'xfade', fxd: 0.2, badge: 'claimed', hw: true },  // 3:37.0 ingress hand:xfade
  { tIn: 223.68, tOut: 226.8, kind: 'vid', ref: 'BR-21-typing-glowing-laptop-dark', file: 'vid/BR-21-typing-glowing-laptop-dark.mp4', fx: 'fade', fxd: 0.5, hw: true },  // 3:43.7 ingress hand:fade
  { tIn: 226.8, tOut: 229.46, kind: 'still', ref: 'IMG-7-brain-inside-crt-monitor', file: 'img/IMG-7-brain-inside-crt-monitor.png', fx: 'lib', hw: true },  // 3:46.8 ingress lib
  { tIn: 229.46, tOut: 232.675, kind: 'vid', ref: 'BR-22-hand-takes-wrench', file: 'vid/BR-22-hand-takes-wrench.mp4', fx: 'fade', fxd: 0.5, hw: true },  // 3:49.5 ingress hand:fade
  { tIn: 232.675, tOut: 235.06, kind: 'vid', ref: 'BR-23-humanoid-prototype-lab', file: 'vid/BR-23-humanoid-prototype-lab.mp4', fx: 'card', hw: true },  // 3:52.7 ingress card
  { tIn: 235.06, tOut: 237.58, kind: 'container', ref: 'C3', state: 's1', file: 'diagrams/C3-s1.png', fx: 'xfade-scale', fxd: 0.35, hw: true },  // 3:55.1 ingress hand:xfade-scale
  { tIn: 237.58, tOut: 239.12, kind: 'container', ref: 'C3', state: 's2', file: 'diagrams/C3-s2.png', fx: 'state', hw: true },  // 3:57.6 ingress state
  { tIn: 239.12, tOut: 240.7, kind: 'container', ref: 'C3', state: 's3', file: 'diagrams/C3-s3.png', fx: 'state', hw: true },  // 3:59.1 ingress state
  { tIn: 240.7, tOut: 240.98, kind: 'container', ref: 'C3', state: 's4', file: 'diagrams/C3-s4.png', fx: 'state', hw: true },  // 4:00.7 ingress state
  { tIn: 240.98, tOut: 249.98, kind: 'receipt', ref: 'C25', file: 'receipts/C25.png', fx: 'xfade-scale', fxd: 0.35, badge: 'deployed', hw: true },  // 4:01.0 ingress hand:xfade-scale
  { tIn: 249.98, tOut: 256.56, kind: 'chart', ref: 'figure-bmw-scoreboard', state: 'payoff', fx: 'xfade-scale', fxd: 0.35, hw: true },  // 4:10.0 ingress hand:xfade-scale
  { tIn: 256.56, tOut: 259.8, kind: 'vid', ref: 'BR-24-robot-arm-stacks-sheet-metal', file: 'vid/BR-24-robot-arm-stacks-sheet-metal.mp4', fx: 'fade', fxd: 0.5, hw: true },  // 4:16.6 ingress hand:fade
  { tIn: 259.8, tOut: 262.26, kind: 'still', ref: 'IMG-8-robot-end-of-shift-factory', file: 'img/IMG-8-robot-end-of-shift-factory.png', fx: 'lib', illus: true, hw: true },  // 4:19.8 ingress lib
  { tIn: 262.26, tOut: 265.64, kind: 'receipt', ref: 'R2', file: 'receipts/R2.png', fx: 'xfade-scale', fxd: 0.35, badge: 'deployed', hw: true },  // 4:22.3 ingress hand:xfade-scale
  { tIn: 265.64, tOut: 266.9, kind: 'container', ref: 'body-vs-worker', state: 'full', file: 'card-slides/body-vs-worker.png', fx: 'xfade-scale', fxd: 0.35, hw: true },  // 4:25.6 ingress hand:xfade-scale
  { tIn: 266.9, tOut: 268.7, kind: 'container', ref: 'body-vs-worker', state: 'lift:body', file: 'card-slides/body-vs-worker.png', fx: 'state', hw: true },  // 4:26.9 ingress state
  { tIn: 268.7, tOut: 270.84, kind: 'container', ref: 'body-vs-worker', state: 'lift:worker', file: 'card-slides/body-vs-worker.png', fx: 'state', hw: true },  // 4:28.7 ingress state
  { tIn: 270.84, tOut: 273.74, kind: 'still', ref: 'IMG-9-home-humanoid-dim-living-room', file: 'img/IMG-9-home-humanoid-dim-living-room.png', fx: 'lib', badge: 'claimed', illus: true, hw: true },  // 4:30.8 ingress lib
  { tIn: 273.74, tOut: 275.7, kind: 'receipt', ref: 'C26-top', file: 'receipts/C26-top.png', fx: 'xfade-scale', fxd: 0.35, badge: 'claimed', hw: true },  // 4:33.7 ingress hand:xfade-scale
  { tIn: 275.7, tOut: 281.56, kind: 'receipt', ref: 'C26', file: 'receipts/C26.png', fx: 'xfade', fxd: 0.2, badge: 'claimed', hw: true },  // 4:35.7 ingress hand:xfade
  { tIn: 281.56, tOut: 284.82, kind: 'vid', ref: 'BR-25-humanoid-robot-home-hand', file: 'vid/BR-25-humanoid-robot-home-hand.mp4', fx: 'fade', fxd: 0.5, badge: 'claimed', hw: true },  // 4:41.6 ingress hand:fade
  { tIn: 284.82, tOut: 290.98, kind: 'receipt', ref: 'C26-expert', file: 'receipts/C26-expert.png', fx: 'xfade-scale', fxd: 0.35, badge: 'claimed', hw: true },  // 4:44.8 ingress hand:xfade-scale
  { tIn: 290.98, tOut: 299.14, kind: 'receipt', ref: 'R3', file: 'receipts/R3.png', fx: 'xfade-scale', fxd: 0.35, badge: 'claimed', hw: true, label: 'FIGURE  ·  HELIX  ·  FEB 20, 2025' },  // 4:51.0 ingress hand:xfade-scale
  { tIn: 299.14, tOut: 301.8, kind: 'vid', ref: 'BR-26-tradesman-tightens-pipe', file: 'vid/BR-26-tradesman-tightens-pipe.mp4', fx: 'fade', fxd: 0.5, hw: true },  // 4:59.1 ingress hand:fade
  { tIn: 301.8, tOut: 303.467, kind: 'vid', ref: 'BR-27-ceiling-light-install', file: 'vid/BR-27-ceiling-light-install.mp4', fx: 'fade', fxd: 0.27, hw: true },  // 5:01.8 ingress hand:fade
  { tIn: 305.8, tOut: 307.64, kind: 'container', ref: 'C3-forecast', state: 's1', file: 'diagrams/C3-forecast-s1.png', fx: 'face', hw: true },  // 5:05.8 ingress face
  { tIn: 307.64, tOut: 308.94, kind: 'container', ref: 'C3-forecast', state: 's2', file: 'diagrams/C3-forecast-s2.png', fx: 'state', hw: true },  // 5:07.6 ingress state
  { tIn: 308.94, tOut: 312.2, kind: 'still', ref: 'IMG-10-robot-doorway-staircase', file: 'img/IMG-10-robot-doorway-staircase.png', fx: 'lib', badge: 'forecast', illus: true, hw: true },  // 5:08.9 ingress lib
  { tIn: 312.2, tOut: 314.86, kind: 'still', ref: 'IMG-11-robot-attic-ladder', file: 'img/IMG-11-robot-attic-ladder.png', fx: 'lib', badge: 'forecast', illus: true, hw: true },  // 5:12.2 ingress lib
  { tIn: 314.86, tOut: 317.04, kind: 'still', ref: 'IMG-12-robot-garage-pegboard', file: 'img/IMG-12-robot-garage-pegboard.png', fx: 'lib', badge: 'forecast', illus: true, hw: true },  // 5:14.9 ingress lib
  { tIn: 317.04, tOut: 319.3, kind: 'vid', ref: 'BR-28-technician-tool-pegboard', file: 'vid/BR-28-technician-tool-pegboard.mp4', fx: 'fade', fxd: 0.5, badge: 'forecast', hw: true },  // 5:17.0 ingress hand:fade
  { tIn: 319.3, tOut: 321.933, kind: 'container', ref: 'C1-pre', state: 's1', file: 'diagrams/C1-pre-s1.png', fx: 'xfade-scale', fxd: 0.35, hw: true },  // 5:19.3 ingress hand:xfade-scale
  { tIn: 325.3, tOut: 325.64, kind: 'deck', ref: 'C1', state: 's1', file: 'diagrams/C1-s1.png', fx: 'face', hw: true },  // 5:25.3 ingress face
  { tIn: 325.64, tOut: 326.38, kind: 'container', ref: 'C1', state: 's2', file: 'diagrams/C1-s2.png', fx: 'state', hw: true },  // 5:25.6 ingress state
  { tIn: 326.38, tOut: 327.3, kind: 'container', ref: 'C1', state: 's3', file: 'diagrams/C1-s3.png', fx: 'state', hw: true },  // 5:26.4 ingress state
  { tIn: 327.3, tOut: 328.4, kind: 'container', ref: 'C1', state: 's4', file: 'diagrams/C1-s4.png', fx: 'state', hw: true },  // 5:27.3 ingress state
  { tIn: 328.4, tOut: 329.7, kind: 'container', ref: 'C1', state: 's5', file: 'diagrams/C1-s5.png', fx: 'state', hw: true },  // 5:28.4 ingress state
  { tIn: 329.7, tOut: 331.04, kind: 'container', ref: 'C1', state: 's6', file: 'diagrams/C1-s6.png', fx: 'state', hw: true },  // 5:29.7 ingress state
  { tIn: 331.04, tOut: 335.44, kind: 'container', ref: 'C1', state: 's7', file: 'diagrams/C1-s7.png', fx: 'state', hw: true },  // 5:31.0 ingress state
  { tIn: 335.44, tOut: 339.14, kind: 'still', ref: 'IMG-13-robot-neck-data-cable', file: 'img/IMG-13-robot-neck-data-cable.png', fx: 'lib', badge: 'forecast', illus: true, hw: true },  // 5:35.4 ingress lib
  { tIn: 339.14, tOut: 341.0, kind: 'container', ref: 'upload-a', state: 's1', file: 'diagrams/upload-a-s1.png', fx: 'xfade-scale', fxd: 0.35, hw: true },  // 5:39.1 ingress hand:xfade-scale
  { tIn: 341.0, tOut: 342.88, kind: 'container', ref: 'upload-a', state: 's2', file: 'diagrams/upload-a-s2.png', fx: 'state', hw: true },  // 5:41.0 ingress state
  { tIn: 342.88, tOut: 343.76, kind: 'container', ref: 'upload-a', state: 's3', file: 'diagrams/upload-a-s3.png', fx: 'state', hw: true },  // 5:42.9 ingress state
  { tIn: 343.76, tOut: 345.5, kind: 'vid', ref: 'BR-29-helicopter-cockpit-pilot', file: 'vid/BR-29-helicopter-cockpit-pilot.mp4', fx: 'fade', fxd: 0.27, hw: true },  // 5:43.8 ingress hand:fade
  { tIn: 345.5, tOut: 347.32, kind: 'vid', ref: 'BR-30-kung-fu-practice', file: 'vid/BR-30-kung-fu-practice.mp4', fx: 'fade', fxd: 0.27, hw: true },  // 5:45.5 ingress hand:fade
  { tIn: 347.32, tOut: 349.48, kind: 'container', ref: 'upload-b', state: 's1', file: 'diagrams/upload-b-s1.png', fx: 'xfade-scale', fxd: 0.35, hw: true },  // 5:47.3 ingress hand:xfade-scale
  { tIn: 349.48, tOut: 350.12, kind: 'container', ref: 'upload-b', state: 's2', file: 'diagrams/upload-b-s2.png', fx: 'state', hw: true },  // 5:49.5 ingress state
  { tIn: 350.12, tOut: 353.7, kind: 'vid', ref: 'BR-31-electrician-tests-panel', file: 'vid/BR-31-electrician-tests-panel.mp4', fx: 'fade', fxd: 0.5, hw: true },  // 5:50.1 ingress hand:fade
  { tIn: 353.7, tOut: 357.56, kind: 'still', ref: 'IMG-14-globe-network-robot-head', file: 'img/IMG-14-globe-network-robot-head.png', fx: 'lib', badge: 'forecast', illus: true, hw: true },  // 5:53.7 ingress lib
  { tIn: 357.56, tOut: 361.2, kind: 'vid', ref: 'BR-32-network-data-streams', file: 'vid/BR-32-network-data-streams.mp4', fx: 'fade', fxd: 0.5, hw: true },  // 5:57.6 ingress hand:fade
  { tIn: 361.2, tOut: 364.1, kind: 'container', ref: 'combined-knowledge', state: 'full', file: 'card-slides/combined-knowledge.png', fx: 'xfade-scale', fxd: 0.35, hw: true },  // 6:01.2 ingress hand:xfade-scale
  { tIn: 364.1, tOut: 366.6, kind: 'container', ref: 'combined-knowledge', state: 'lift:onerobot', file: 'card-slides/combined-knowledge.png', fx: 'state', hw: true },  // 6:04.1 ingress state
  { tIn: 366.6, tOut: 368.66, kind: 'container', ref: 'C1-download', state: 's1', file: 'diagrams/C1-download-s1.png', fx: 'lib', hw: true },  // 6:06.6 ingress lib
  { tIn: 368.66, tOut: 371.08, kind: 'container', ref: 'C1-download', state: 's2', file: 'diagrams/C1-download-s2.png', fx: 'state', hw: true },  // 6:08.7 ingress state
  { tIn: 371.08, tOut: 371.44, kind: 'container', ref: 'C1-download', state: 's3', file: 'diagrams/C1-download-s3.png', fx: 'state', hw: true },  // 6:11.1 ingress state
  { tIn: 371.44, tOut: 373.46, kind: 'vid', ref: 'BR-33-appliance-repair-drill', file: 'vid/BR-33-appliance-repair-drill.mp4', fx: 'fade', fxd: 0.5, hw: true },  // 6:11.4 ingress hand:fade
  { tIn: 373.46, tOut: 375.88, kind: 'vid', ref: 'BR-34-night-guard-radio', file: 'vid/BR-34-night-guard-radio.mp4', fx: 'fade', fxd: 0.5, hw: true },  // 6:13.5 ingress hand:fade
  { tIn: 375.88, tOut: 379.88, kind: 'still', ref: 'IMG-15-robot-hallway-3am-front-door', file: 'img/IMG-15-robot-hallway-3am-front-door.png', fx: 'lib', badge: 'forecast', illus: true, hw: true },  // 6:15.9 ingress lib
  { tIn: 379.88, tOut: 383.64, kind: 'vid', ref: 'BR-35-hooded-intruder-night', file: 'vid/BR-35-hooded-intruder-night.mp4', fx: 'fade', fxd: 0.5, hw: true },  // 6:19.9 ingress hand:fade
  { tIn: 383.64, tOut: 385.86, kind: 'still', ref: 'IMG-16-hardware-wallet-seed-card-gloved-hand', file: 'img/IMG-16-hardware-wallet-seed-card-gloved-hand.png', fx: 'lib', hw: true },  // 6:23.6 ingress lib
  { tIn: 385.86, tOut: 388.42, kind: 'vid', ref: 'BR-36-dog-barks-behind-fence', file: 'vid/BR-36-dog-barks-behind-fence.mp4', fx: 'fade', fxd: 0.5, hw: true },  // 6:25.9 ingress hand:fade
  { tIn: 388.42, tOut: 392.42, kind: 'still', ref: 'IMG-17-robot-charging-dock-dog-bowl', file: 'img/IMG-17-robot-charging-dock-dog-bowl.png', fx: 'lib', badge: 'forecast', illus: true, hw: true },  // 6:28.4 ingress lib
  { tIn: 392.42, tOut: 394.78, kind: 'vid', ref: 'BR-37-picking-up-dog-waste', file: 'vid/BR-37-picking-up-dog-waste.mp4', fx: 'fade', fxd: 0.5, hw: true },  // 6:32.4 ingress hand:fade
  { tIn: 394.78, tOut: 406.34, kind: 'chart', ref: 'C6', state: 'payoff', fx: 'xfade-scale', fxd: 0.35, hw: true },  // 6:34.8 ingress hand:xfade-scale
  { tIn: 406.34, tOut: 410.14, kind: 'still', ref: 'IMG-18-robot-hands-pipe-under-sink', file: 'img/IMG-18-robot-hands-pipe-under-sink.png', fx: 'lib', badge: 'forecast', illus: true, hw: true },  // 6:46.3 ingress lib
  { tIn: 410.14, tOut: 413.7, kind: 'container', ref: 'math-is-brutal', state: 'full', file: 'card-slides/math-is-brutal.png', fx: 'xfade-scale', fxd: 0.35, hw: true },  // 6:50.1 ingress hand:xfade-scale
  { tIn: 413.7, tOut: 415.4, kind: 'container', ref: 'math-is-brutal', state: 'lift:numbers', file: 'card-slides/math-is-brutal.png', fx: 'state', hw: true },  // 6:53.7 ingress state
  { tIn: 415.4, tOut: 416.0, kind: 'container', ref: 'math-is-brutal', state: 'lift:weekends', file: 'card-slides/math-is-brutal.png', fx: 'state', hw: true },  // 6:55.4 ingress state
  { tIn: 416.0, tOut: 419.96, kind: 'vid', ref: 'BR-38-frustrated-man-phone', file: 'vid/BR-38-frustrated-man-phone.mp4', fx: 'fade', fxd: 0.5, hw: true },  // 6:56.0 ingress hand:fade
  { tIn: 419.96, tOut: 423.88, kind: 'vid', ref: 'BR-39-repairman-homeowner-kitchen', file: 'vid/BR-39-repairman-homeowner-kitchen.mp4', fx: 'fade', fxd: 0.5, hw: true },  // 6:60.0 ingress hand:fade
  { tIn: 423.88, tOut: 424.7, kind: 'container', ref: 'nine-to-five', state: 'full', file: 'card-slides/nine-to-five.png', fx: 'xfade-scale', fxd: 0.35, hw: true },  // 7:03.9 ingress hand:xfade-scale
  { tIn: 424.7, tOut: 426.7, kind: 'container', ref: 'nine-to-five', state: 'lift:contractor', file: 'card-slides/nine-to-five.png', fx: 'state', hw: true },  // 7:04.7 ingress state
  { tIn: 426.7, tOut: 429.26, kind: 'container', ref: 'nine-to-five', state: 'lift:yours', file: 'card-slides/nine-to-five.png', fx: 'state', hw: true },  // 7:06.7 ingress state
  { tIn: 429.26, tOut: 432.88, kind: 'vid', ref: 'BR-40-marker-circles-calendar-date', file: 'vid/BR-40-marker-circles-calendar-date.mp4', fx: 'fade', fxd: 0.5, hw: true },  // 7:09.3 ingress hand:fade
  { tIn: 432.88, tOut: 436.62, kind: 'vid', ref: 'BR-41-hands-count-dollar-bills', file: 'vid/BR-41-hands-count-dollar-bills.mp4', fx: 'fade', fxd: 0.5, hw: true },  // 7:12.9 ingress hand:fade
  { tIn: 436.62, tOut: 440.6, kind: 'vid', ref: 'BR-42-worker-thumbs-down', file: 'vid/BR-42-worker-thumbs-down.mp4', fx: 'fade', fxd: 0.5, hw: true },  // 7:16.6 ingress hand:fade
  { tIn: 440.6, tOut: 443.2, kind: 'still', ref: 'IMG-19-house-dusk-robot-silhouette-window', file: 'img/IMG-19-house-dusk-robot-silhouette-window.png', fx: 'lib', badge: 'forecast', illus: true, hw: true },  // 7:20.6 ingress lib
  { tIn: 443.2, tOut: 445.945, kind: 'vid', ref: 'BR-43-city-commuters-walking', file: 'vid/BR-43-city-commuters-walking.mp4', fx: 'fade', fxd: 0.5, hw: true },  // 7:23.2 ingress hand:fade
  { tIn: 445.945, tOut: 449.2, kind: 'container', ref: 'C4-template', state: 's1', file: 'card-slides/C4-template-s1.png', fx: 'card' },  // 7:25.9 ingress card
  { tIn: 449.2, tOut: 449.6, kind: 'container', ref: 'C4-template', state: 's2', file: 'card-slides/C4-template-s2.png', fx: 'state' },  // 7:29.2 ingress state
  { tIn: 449.6, tOut: 451.4, kind: 'container', ref: 'C4-template', state: 's3', file: 'card-slides/C4-template-s3.png', fx: 'state' },  // 7:29.6 ingress state
  { tIn: 451.4, tOut: 452.2, kind: 'container', ref: 'C4-template', state: 's4', file: 'card-slides/C4-template-s4.png', fx: 'state' },  // 7:31.4 ingress state
  { tIn: 454.4, tOut: 458.1, kind: 'chart', ref: 'C4-cashiers', state: 'payoff', fx: 'face' },  // 7:34.4 ingress face
  { tIn: 458.1, tOut: 460.4, kind: 'still', ref: 'IMG-20-self-checkout-kiosks-empty-store', file: 'img/IMG-20-self-checkout-kiosks-empty-store.png', fx: 'lib' },  // 7:38.1 ingress lib
  { tIn: 460.4, tOut: 462.9, kind: 'receipt', ref: 'C28-cashiers', file: 'receipts/C28-cashiers.png', fx: 'xfade-scale', fxd: 0.35 },  // 7:40.4 ingress hand:xfade-scale
  { tIn: 462.9, tOut: 464.32, kind: 'receipt', ref: 'C28-cashiers-outlook', file: 'receipts/C28-cashiers-outlook.png', fx: 'xfade', fxd: 0.2 },  // 7:42.9 ingress hand:xfade
  { tIn: 464.32, tOut: 468.46, kind: 'chart', ref: 'C4-taxi', state: 'payoff', fx: 'xfade-scale', fxd: 0.35 },  // 7:44.3 ingress hand:xfade-scale
  { tIn: 468.46, tOut: 472.12, kind: 'vid', ref: 'BR-44-autonomous-cars-highway-aerial', file: 'vid/BR-44-autonomous-cars-highway-aerial.mp4', fx: 'fade', fxd: 0.5 },  // 7:48.5 ingress hand:fade
  { tIn: 472.12, tOut: 478.8, kind: 'receipt', ref: 'C29', file: 'receipts/C29.png', fx: 'xfade-scale', fxd: 0.35, badge: 'deployed' },  // 7:52.1 ingress hand:xfade-scale
  { tIn: 478.8, tOut: 482.1, kind: 'chart', ref: 'C4-warehouse', state: 'payoff', fx: 'xfade-scale', fxd: 0.35 },  // 7:58.8 ingress hand:xfade-scale
  { tIn: 482.1, tOut: 485.84, kind: 'receipt', ref: 'C36', file: 'receipts/C36.png', fx: 'xfade-scale', fxd: 0.35, badge: 'deployed' },  // 8:02.1 ingress hand:xfade-scale
  { tIn: 485.84, tOut: 489.72, kind: 'chart', ref: 'C4-csr', state: 'payoff', fx: 'xfade-scale', fxd: 0.35 },  // 8:05.8 ingress hand:xfade-scale
  { tIn: 489.72, tOut: 493.4, kind: 'still', ref: 'IMG-21-empty-call-center-night', file: 'img/IMG-21-empty-call-center-night.png', fx: 'lib' },  // 8:09.7 ingress lib
  { tIn: 493.4, tOut: 500.56, kind: 'receipt', ref: 'R5', file: 'receipts/R5.png', fx: 'xfade-scale', fxd: 0.35 },  // 8:13.4 ingress hand:xfade-scale
  { tIn: 500.56, tOut: 504.64, kind: 'chart', ref: 'C4-roofers', state: 'payoff', fx: 'xfade-scale', fxd: 0.35 },  // 8:20.6 ingress hand:xfade-scale
  { tIn: 504.64, tOut: 508.5, kind: 'vid', ref: 'BR-45-aerial-roof-repair', file: 'vid/BR-45-aerial-roof-repair.mp4', fx: 'fade', fxd: 0.5 },  // 8:24.6 ingress hand:fade
  { tIn: 508.5, tOut: 512.04, kind: 'receipt', ref: 'R6', file: 'receipts/R6.png', fx: 'xfade-scale', fxd: 0.35, badge: 'claimed' },  // 8:28.5 ingress hand:xfade-scale
  { tIn: 512.04, tOut: 516.06, kind: 'chart', ref: 'C4-truck', state: 'payoff', fx: 'xfade-scale', fxd: 0.35 },  // 8:32.0 ingress hand:xfade-scale
  { tIn: 516.06, tOut: 519.8, kind: 'still', ref: 'IMG-22-empty-cab-semi-truck-highway', file: 'img/IMG-22-empty-cab-semi-truck-highway.png', fx: 'lib' },  // 8:36.1 ingress lib
  { tIn: 519.8, tOut: 525.48, kind: 'receipt', ref: 'C30', file: 'receipts/C30.png', fx: 'xfade-scale', fxd: 0.35, badge: 'deployed' },  // 8:39.8 ingress hand:xfade-scale
  { tIn: 525.48, tOut: 529.94, kind: 'chart', ref: 'C4-carpenters', state: 'payoff', fx: 'xfade-scale', fxd: 0.35 },  // 8:45.5 ingress hand:xfade-scale
  { tIn: 529.94, tOut: 533.2, kind: 'receipt', ref: 'R7', state: 'headline', file: 'receipts/R7.png', fx: 'xfade-scale', fxd: 0.35, badge: 'deployed' },  // 8:49.9 ingress hand:xfade-scale
  { tIn: 533.2, tOut: 538.0, kind: 'receipt', ref: 'R7', state: 'crews', file: 'receipts/R7.png', fx: 'xfade', fxd: 0.2, badge: 'deployed' },  // 8:53.2 ingress hand:xfade
  { tIn: 538.0, tOut: 542.98, kind: 'chart', ref: 'C4-electricians', state: 'payoff', fx: 'xfade-scale', fxd: 0.35 },  // 8:58.0 ingress hand:xfade-scale
  { tIn: 542.98, tOut: 545.4, kind: 'receipt', ref: 'C28-electricians', file: 'receipts/C28-electricians.png', fx: 'xfade-scale', fxd: 0.35 },  // 9:03.0 ingress hand:xfade-scale
  { tIn: 545.4, tOut: 547.2, kind: 'receipt', ref: 'C28-electricians-outlook', file: 'receipts/C28-electricians-outlook.png', fx: 'xfade', fxd: 0.2 },  // 9:05.4 ingress hand:xfade
  { tIn: 547.2, tOut: 550.767, kind: 'vid', ref: 'BR-47-data-center-fly-through', file: 'vid/BR-47-data-center-fly-through.mp4', fx: 'fade', fxd: 0.5, lead: true },  // 9:07.2 ingress hand:fade
  { tIn: 556.533, tOut: 561.28, kind: 'chart', ref: 'C4-plumbers', state: 'payoff', fx: 'face' },  // 9:16.5 ingress face
  { tIn: 561.28, tOut: 565.2, kind: 'vid', ref: 'BR-48-torch-solders-copper-pipe', file: 'vid/BR-48-torch-solders-copper-pipe.mp4', fx: 'fade', fxd: 0.5 },  // 9:21.3 ingress hand:fade
  { tIn: 565.2, tOut: 568.06, kind: 'still', ref: 'IMG-23-robot-hand-red-wrench-copper-pipe', file: 'img/IMG-23-robot-hand-red-wrench-copper-pipe.png', fx: 'lib', badge: 'forecast', illus: true },  // 9:25.2 ingress lib
  { tIn: 568.06, tOut: 571.5, kind: 'container', ref: 'download-card', state: 'full', file: 'card-slides/download-card.png', fx: 'xfade-scale', fxd: 0.35 },  // 9:28.1 ingress hand:xfade-scale
  { tIn: 571.5, tOut: 572.6, kind: 'container', ref: 'download-card', state: 'lift:download', file: 'card-slides/download-card.png', fx: 'state' },  // 9:31.5 ingress state
  { tIn: 572.6, tOut: 574.033, kind: 'container', ref: 'download-card', state: 'lift:years', file: 'card-slides/download-card.png', fx: 'state' },  // 9:32.6 ingress state
  { tIn: 577.367, tOut: 580.78, kind: 'chart', ref: 'C5-climb', state: 'payoff', fx: 'face' },  // 9:37.4 ingress face
  { tIn: 580.78, tOut: 584.46, kind: 'chart', ref: 'C4-programmers', state: 'payoff', fx: 'xfade-scale', fxd: 0.35 },  // 9:40.8 ingress hand:xfade-scale
  { tIn: 584.46, tOut: 589.26, kind: 'receipt', ref: 'R10', file: 'receipts/R10.png', fx: 'xfade-scale', fxd: 0.35 },  // 9:44.5 ingress hand:xfade-scale
  { tIn: 589.26, tOut: 592.0, kind: 'still', ref: 'IMG-24-code-scrolling-empty-office', file: 'img/IMG-24-code-scrolling-empty-office.png', fx: 'lib' },  // 9:49.3 ingress lib
  { tIn: 596.767, tOut: 602.32, kind: 'chart', ref: 'C4-radiologists', state: 'payoff', fx: 'face' },  // 9:56.8 ingress face
  { tIn: 602.32, tOut: 604.74, kind: 'still', ref: 'IMG-25-radiology-room-empty-chair', file: 'img/IMG-25-radiology-room-empty-chair.png', fx: 'lib' },  // 10:02.3 ingress lib
  { tIn: 604.74, tOut: 609.0, kind: 'receipt', ref: 'R11', file: 'receipts/R11.png', fx: 'xfade-scale', fxd: 0.35 },  // 10:04.7 ingress hand:xfade-scale
  { tIn: 609.0, tOut: 616.1, kind: 'receipt', ref: 'R17-huang-radiology-clip', state: 'lead-in', file: 'receipts/R17-huang-radiology-clip.mp4', fx: 'fade', fxd: 0.5 },  // 10:09.0 ingress hand:fade (broll-fade 0.50 s): the clip's FIRST frame held (draft v2, hand-edited)
  { tIn: 616.1, tOut: 618.0, kind: 'receipt', ref: 'R17-huang-radiology-clip', state: 'lead-out', file: 'receipts/R17-huang-radiology-clip.mp4', fx: 'state' },  // 10:16.1 after the INSERT: the clip's LAST frame held (draft v2, hand-edited)
  { tIn: 618.0, tOut: 620.2, kind: 'receipt', ref: 'R18', file: 'receipts/R18.png', fx: 'fade', fxd: 0.5 },  // 10:18.0 ingress hand:fade
  { tIn: 620.2, tOut: 623.3, kind: 'container', ref: 'huang-real-line', state: 'full', file: 'card-slides/huang-real-line.png', fx: 'xfade-scale', fxd: 0.35 },  // 10:20.2 ingress hand:xfade-scale
  { tIn: 623.3, tOut: 624.24, kind: 'container', ref: 'huang-real-line', state: 'lift:driven', file: 'card-slides/huang-real-line.png', fx: 'state' },  // 10:23.3 ingress state
  { tIn: 624.24, tOut: 628.24, kind: 'vid', ref: 'BR-49-tablet-spine-xray', file: 'vid/BR-49-tablet-spine-xray.mp4', fx: 'fade', fxd: 0.5 },  // 10:24.2 ingress hand:fade
  { tIn: 628.24, tOut: 633.52, kind: 'chart', ref: 'C4-radiologists', state: 'note', fx: 'xfade-scale', fxd: 0.35 },  // 10:28.2 ingress hand:xfade-scale
  { tIn: 633.52, tOut: 638.96, kind: 'chart', ref: 'C5-top', state: 'payoff', fx: 'lib' },  // 10:33.5 ingress lib
  { tIn: 638.96, tOut: 641.1, kind: 'receipt', ref: 'C33-top', file: 'receipts/C33-top.png', fx: 'xfade-scale', fxd: 0.35 },  // 10:39.0 ingress hand:xfade-scale
  { tIn: 641.1, tOut: 642.72, kind: 'receipt', ref: 'C33', file: 'receipts/C33.png', fx: 'xfade', fxd: 0.2 },  // 10:41.1 ingress hand:xfade
  { tIn: 642.72, tOut: 646.5, kind: 'vid', ref: 'BR-50-robotic-surgery-arms', file: 'vid/BR-50-robotic-surgery-arms.mp4', fx: 'fade', fxd: 0.5 },  // 10:42.7 ingress hand:fade
  { tIn: 646.5, tOut: 651.24, kind: 'chart', ref: 'C8', state: 'payoff', fx: 'xfade-scale', fxd: 0.35 },  // 10:46.5 ingress hand:xfade-scale
  { tIn: 651.24, tOut: 658.02, kind: 'receipt', ref: 'C32', file: 'receipts/C32.png', fx: 'xfade-scale', fxd: 0.35 },  // 10:51.2 ingress hand:xfade-scale
  { tIn: 658.02, tOut: 662.36, kind: 'container', ref: 'C9', state: 's1', file: 'diagrams/C9-s1.png', fx: 'lib' },  // 10:58.0 ingress lib
  { tIn: 662.36, tOut: 663.84, kind: 'container', ref: 'C9', state: 's2', file: 'diagrams/C9-s2.png', fx: 'state' },  // 11:02.4 ingress state
  { tIn: 663.84, tOut: 666.72, kind: 'container', ref: 'C9', state: 's3', file: 'diagrams/C9-s3.png', fx: 'state' },  // 11:03.8 ingress state
  { tIn: 666.72, tOut: 670.72, kind: 'still', ref: 'IMG-26-empty-operating-room-robot-arm', file: 'img/IMG-26-empty-operating-room-robot-arm.png', fx: 'lib', badge: 'forecast', illus: true },  // 11:06.7 ingress lib
  { tIn: 670.72, tOut: 673.6, kind: 'container', ref: 'never-card', state: 's1', file: 'card-slides/never-card-s1.png', fx: 'xfade-scale', fxd: 0.35 },  // 11:10.7 ingress hand:xfade-scale
  { tIn: 673.6, tOut: 675.3, kind: 'container', ref: 'never-card', state: 's2', file: 'card-slides/never-card-s2.png', fx: 'state' },  // 11:13.6 ingress state
  { tIn: 675.3, tOut: 676.067, kind: 'container', ref: 'never-card', state: 's3', file: 'card-slides/never-card-s3.png', fx: 'state' },  // 11:15.3 ingress state
  { tIn: 683.0, tOut: 686.26, kind: 'chart', ref: 'C2-surgeon', state: 'payoff', fx: 'face' },  // 11:23.0 ingress face
  { tIn: 686.26, tOut: 689.68, kind: 'still', ref: 'IMG-27-surgeon-glove-scalpel-light-pool', file: 'img/IMG-27-surgeon-glove-scalpel-light-pool.png', fx: 'lib' },  // 11:26.3 ingress lib
  { tIn: 689.68, tOut: 692.18, kind: 'vid', ref: 'BR-51-gavel-strike', file: 'vid/BR-51-gavel-strike.mp4', fx: 'fade', fxd: 0.5 },  // 11:29.7 ingress hand:fade
  { tIn: 692.18, tOut: 695.5, kind: 'still', ref: 'IMG-28-highway-crash-aftermath-night', file: 'img/IMG-28-highway-crash-aftermath-night.png', fx: 'lib' },  // 11:32.2 ingress lib
  { tIn: 695.5, tOut: 699.42, kind: 'vid', ref: 'BR-52-hands-off-self-driving-car', file: 'vid/BR-52-hands-off-self-driving-car.mp4', fx: 'fade', fxd: 0.5 },  // 11:35.5 ingress hand:fade
  { tIn: 699.42, tOut: 700.6, kind: 'container', ref: 'where-safer-leads', state: 's1', file: 'card-slides/where-safer-leads-s1.png', fx: 'xfade-scale', fxd: 0.35 },  // 11:39.4 ingress hand:xfade-scale
  { tIn: 700.6, tOut: 703.2, kind: 'container', ref: 'where-safer-leads', state: 's2', file: 'card-slides/where-safer-leads-s2.png', fx: 'state' },  // 11:40.6 ingress state
  { tIn: 703.2, tOut: 703.955, kind: 'container', ref: 'where-safer-leads', state: 's3', file: 'card-slides/where-safer-leads-s3.png', fx: 'state' },  // 11:43.2 ingress state
  { tIn: 703.955, tOut: 706.12, kind: 'container', ref: 'two-forces', state: 's1', file: 'diagrams/two-forces-s1.png', fx: 'card' },  // 11:44.0 ingress card
  { tIn: 706.12, tOut: 708.06, kind: 'container', ref: 'two-forces', state: 's2', file: 'diagrams/two-forces-s2.png', fx: 'state' },  // 11:46.1 ingress state
  { tIn: 708.06, tOut: 708.6, kind: 'container', ref: 'two-forces', state: 's3', file: 'diagrams/two-forces-s3.png', fx: 'state' },  // 11:48.1 ingress state
  { tIn: 708.6, tOut: 711.3, kind: 'container', ref: 'price-collapse', state: 'full', file: 'card-slides/price-collapse.png', fx: 'xfade-scale', fxd: 0.35 },  // 11:48.6 ingress hand:xfade-scale
  { tIn: 711.3, tOut: 713.6, kind: 'container', ref: 'price-collapse', state: 'lift:already', file: 'card-slides/price-collapse.png', fx: 'state' },  // 11:51.3 ingress state
  { tIn: 713.6, tOut: 717.1, kind: 'receipt', ref: 'C42-top', file: 'receipts/C42-top.png', fx: 'xfade-scale', fxd: 0.35 },  // 11:53.6 ingress hand:xfade-scale
  { tIn: 717.1, tOut: 720.46, kind: 'receipt', ref: 'C42', file: 'receipts/C42.png', fx: 'xfade', fxd: 0.2 },  // 11:57.1 ingress hand:xfade
  { tIn: 720.46, tOut: 726.16, kind: 'chart', ref: 'C13', state: 'payoff', fx: 'xfade-scale', fxd: 0.35 },  // 12:00.5 ingress hand:xfade-scale
  { tIn: 726.16, tOut: 729.3, kind: 'still', ref: 'IMG-29-robot-run-city-street-dawn', file: 'img/IMG-29-robot-run-city-street-dawn.png', fx: 'lib', badge: 'forecast', illus: true },  // 12:06.2 ingress lib
  { tIn: 729.3, tOut: 733.3, kind: 'container', ref: 'optimists-card', state: 's1', file: 'card-slides/optimists-card-s1.png', fx: 'xfade-scale', fxd: 0.35 },  // 12:09.3 ingress hand:xfade-scale
  { tIn: 733.3, tOut: 734.94, kind: 'container', ref: 'optimists-card', state: 's2', file: 'card-slides/optimists-card-s2.png', fx: 'state' },  // 12:13.3 ingress state
  { tIn: 734.94, tOut: 740.533, kind: 'chart', ref: 'consumption-67', state: 'payoff', fx: 'xfade-scale', fxd: 0.35 },  // 12:14.9 ingress hand:xfade-scale
  { tIn: 743.033, tOut: 746.0, kind: 'vid', ref: 'BR-53-closed-storefront-shutters', file: 'vid/BR-53-closed-storefront-shutters.mp4', fx: 'face' },  // 12:23.0 ingress face
  { tIn: 746.0, tOut: 749.0, kind: 'container', ref: 'unemployment-4.2-forecast', state: 's1', file: 'card-slides/unemployment-4.2-forecast-s1.png', fx: 'xfade-scale', fxd: 0.35 },  // 12:26.0 ingress hand:xfade-scale
  { tIn: 749.0, tOut: 750.0, kind: 'container', ref: 'unemployment-4.2-forecast', state: 's2', file: 'card-slides/unemployment-4.2-forecast-s2.png', fx: 'state' },  // 12:29.0 ingress state
  { tIn: 750.0, tOut: 752.96, kind: 'container', ref: 'unemployment-4.2-forecast', state: 's3', file: 'card-slides/unemployment-4.2-forecast-s3.png', fx: 'state' },  // 12:30.0 ingress state
  { tIn: 752.96, tOut: 754.8, kind: 'container', ref: 'C15-survives-a', state: 's1', file: 'card-slides/C15-survives-a-s1.png', fx: 'xfade-scale', fxd: 0.35 },  // 12:33.0 ingress hand:xfade-scale
  { tIn: 754.8, tOut: 755.4, kind: 'container', ref: 'C15-survives-a', state: 's2', file: 'card-slides/C15-survives-a-s2.png', fx: 'state' },  // 12:34.8 ingress state
  { tIn: 755.4, tOut: 756.5, kind: 'container', ref: 'C15-survives-a', state: 's3', file: 'card-slides/C15-survives-a-s3.png', fx: 'state' },  // 12:35.4 ingress state
  { tIn: 756.5, tOut: 758.94, kind: 'container', ref: 'C15-survives-a', state: 's4', file: 'card-slides/C15-survives-a-s4.png', fx: 'state' },  // 12:36.5 ingress state
  { tIn: 758.94, tOut: 759.4, kind: 'container', ref: 'C15-survives-b', state: 's1', file: 'card-slides/C15-survives-b-s1.png', fx: 'xfade-scale', fxd: 0.35 },  // 12:38.9 ingress hand:xfade-scale
  { tIn: 759.4, tOut: 760.0, kind: 'container', ref: 'C15-survives-b', state: 's2', file: 'card-slides/C15-survives-b-s2.png', fx: 'state' },  // 12:39.4 ingress state
  { tIn: 760.0, tOut: 761.3, kind: 'container', ref: 'C15-survives-b', state: 's3', file: 'card-slides/C15-survives-b-s3.png', fx: 'state' },  // 12:40.0 ingress state
  { tIn: 761.3, tOut: 764.5, kind: 'container', ref: 'C15-survives-b', state: 's4', file: 'card-slides/C15-survives-b-s4.png', fx: 'state' },  // 12:41.3 ingress state
  { tIn: 764.5, tOut: 769.5, kind: 'container', ref: 'C15-extinct-a', state: 's1', file: 'card-slides/C15-extinct-a-s1.png', fx: 'xfade-scale', fxd: 0.35 },  // 12:44.5 ingress hand:xfade-scale
  { tIn: 769.5, tOut: 771.16, kind: 'container', ref: 'C15-extinct-a', state: 's2', file: 'card-slides/C15-extinct-a-s2.png', fx: 'state' },  // 12:49.5 ingress state
  { tIn: 771.16, tOut: 772.5, kind: 'container', ref: 'C15-extinct-b', state: 's1', file: 'card-slides/C15-extinct-b-s1.png', fx: 'xfade-scale', fxd: 0.35 },  // 12:51.2 ingress hand:xfade-scale
  { tIn: 772.5, tOut: 776.3, kind: 'container', ref: 'C15-extinct-b', state: 's2', file: 'card-slides/C15-extinct-b-s2.png', fx: 'state' },  // 12:52.5 ingress state
  { tIn: 776.3, tOut: 776.7, kind: 'container', ref: 'C15-extinct-b', state: 's3', file: 'card-slides/C15-extinct-b-s3.png', fx: 'state' },  // 12:56.3 ingress state
  { tIn: 776.7, tOut: 778.5, kind: 'container', ref: 'C15-extinct-b', state: 's4', file: 'card-slides/C15-extinct-b-s4.png', fx: 'state' },  // 12:56.7 ingress state
  { tIn: 778.5, tOut: 781.9, kind: 'vid', ref: 'BR-54-molten-metal-pour', file: 'vid/BR-54-molten-metal-pour.mp4', fx: 'fade', fxd: 0.5 },  // 12:58.5 ingress hand:fade
  { tIn: 781.9, tOut: 782.2, kind: 'container', ref: 'survivors-tiles', state: 's1', file: 'card-slides/survivors-tiles-s1.png', fx: 'xfade-scale', fxd: 0.35 },  // 13:01.9 ingress hand:xfade-scale
  { tIn: 782.2, tOut: 783.1, kind: 'container', ref: 'survivors-tiles', state: 's2', file: 'card-slides/survivors-tiles-s2.png', fx: 'state' },  // 13:02.2 ingress state
  { tIn: 783.1, tOut: 785.833, kind: 'container', ref: 'survivors-tiles', state: 's3', file: 'card-slides/survivors-tiles-s3.png', fx: 'state' },  // 13:03.1 ingress state
  { tIn: 788.6, tOut: 789.1, kind: 'container', ref: 'C15-jobs-fade', state: 's1', file: 'card-slides/C15-jobs-fade-s1.png', fx: 'face' },  // 13:08.6 ingress face
  { tIn: 789.1, tOut: 791.6, kind: 'container', ref: 'C15-jobs-fade', state: 's2', file: 'card-slides/C15-jobs-fade-s2.png', fx: 'state' },  // 13:09.1 ingress state
  { tIn: 791.6, tOut: 794.52, kind: 'container', ref: 'C15-jobs-fade', state: 's3', file: 'card-slides/C15-jobs-fade-s3.png', fx: 'state' },  // 13:11.6 ingress state
  { tIn: 794.52, tOut: 795.1, kind: 'container', ref: 'land-energy-compute', state: 's1', file: 'card-slides/land-energy-compute-s1.png', fx: 'xfade-scale', fxd: 0.35 },  // 13:14.5 ingress hand:xfade-scale
  { tIn: 795.1, tOut: 796.2, kind: 'container', ref: 'land-energy-compute', state: 's2', file: 'card-slides/land-energy-compute-s2.png', fx: 'state' },  // 13:15.1 ingress state
  { tIn: 796.2, tOut: 797.9, kind: 'container', ref: 'land-energy-compute', state: 's3', file: 'card-slides/land-energy-compute-s3.png', fx: 'state' },  // 13:16.2 ingress state
  { tIn: 797.9, tOut: 802.54, kind: 'vid', ref: 'BR-55-sunset-farmland-aerial', file: 'vid/BR-55-sunset-farmland-aerial.mp4', fx: 'fade', fxd: 0.5, lead: true },  // 13:17.9 ingress hand:fade
  { tIn: 802.54, tOut: 809.76, kind: 'receipt', ref: 'C40', file: 'receipts/C40.png', fx: 'xfade-scale', fxd: 0.35 },  // 13:22.5 ingress hand:xfade-scale
  { tIn: 809.76, tOut: 814.3, kind: 'deck', ref: 'C14', state: 's1', file: 'diagrams/C14-s1.png', fx: 'lib' },  // 13:29.8 ingress lib
  { tIn: 814.3, tOut: 814.94, kind: 'container', ref: 'C14', state: 's2', file: 'diagrams/C14-s2.png', fx: 'state' },  // 13:34.3 ingress state
  { tIn: 814.94, tOut: 815.84, kind: 'container', ref: 'C14', state: 's3', file: 'diagrams/C14-s3.png', fx: 'state' },  // 13:34.9 ingress state
  { tIn: 815.84, tOut: 821.02, kind: 'container', ref: 'C14', state: 's4', file: 'diagrams/C14-s4.png', fx: 'state' },  // 13:35.8 ingress state
  { tIn: 821.02, tOut: 821.34, kind: 'container', ref: 'C14', state: 's5', file: 'diagrams/C14-s5.png', fx: 'state' },  // 13:41.0 ingress state
  { tIn: 821.34, tOut: 823.16, kind: 'container', ref: 'C14', state: 's6', file: 'diagrams/C14-s6.png', fx: 'state' },  // 13:41.3 ingress state
  { tIn: 823.16, tOut: 835.88, kind: 'receipt', ref: 'C12', file: 'receipts/C12.png', fx: 'xfade-scale', fxd: 0.35 },  // 13:43.2 ingress hand:xfade-scale
  { tIn: 835.88, tOut: 837.98, kind: 'container', ref: 'C14-leverage', state: 's1', file: 'diagrams/C14-leverage-s1.png', fx: 'lib' },  // 13:55.9 ingress lib
  { tIn: 837.98, tOut: 840.08, kind: 'container', ref: 'C14-leverage', state: 's2', file: 'diagrams/C14-leverage-s2.png', fx: 'state' },  // 13:58.0 ingress state
  { tIn: 840.08, tOut: 842.9, kind: 'container', ref: 'C14-leverage', state: 's3', file: 'diagrams/C14-leverage-s3.png', fx: 'state' },  // 14:00.1 ingress state
  { tIn: 842.9, tOut: 852.96, kind: 'receipt', ref: 'C37', file: 'receipts/C37.png', fx: 'xfade-scale', fxd: 0.35 },  // 14:02.9 ingress hand:xfade-scale
  { tIn: 852.96, tOut: 856.66, kind: 'still', ref: 'IMG-30-envelope-handoff-suit-sleeve', file: 'img/IMG-30-envelope-handoff-suit-sleeve.png', fx: 'lib' },  // 14:13.0 ingress lib
  { tIn: 856.66, tOut: 857.46, kind: 'container', ref: 'C14-allowance', state: 's1', file: 'diagrams/C14-allowance-s1.png', fx: 'xfade-scale', fxd: 0.35 },  // 14:16.7 ingress hand:xfade-scale
  { tIn: 857.46, tOut: 858.7, kind: 'container', ref: 'C14-allowance', state: 's2', file: 'diagrams/C14-allowance-s2.png', fx: 'state' },  // 14:17.5 ingress state
  { tIn: 858.7, tOut: 859.92, kind: 'container', ref: 'C14-allowance', state: 's3', file: 'diagrams/C14-allowance-s3.png', fx: 'state' },  // 14:18.7 ingress state
  { tIn: 859.92, tOut: 862.7, kind: 'container', ref: 'us-law-july-2025', state: 'full', file: 'card-slides/us-law-july-2025.png', fx: 'xfade-scale', fxd: 0.35 },  // 14:19.9 ingress hand:xfade-scale
  { tIn: 862.7, tOut: 863.86, kind: 'container', ref: 'us-law-july-2025', state: 'lift:signed', file: 'card-slides/us-law-july-2025.png', fx: 'state' },  // 14:22.7 ingress state
  { tIn: 863.86, tOut: 867.64, kind: 'still', ref: 'IMG-31-digital-dollar-coin-padlock-circuit', file: 'img/IMG-31-digital-dollar-coin-padlock-circuit.png', fx: 'lib' },  // 14:23.9 ingress lib
  { tIn: 867.64, tOut: 875.18, kind: 'receipt', ref: 'C38', file: 'receipts/C38.png', fx: 'xfade-scale', fxd: 0.35 },  // 14:27.6 ingress hand:xfade-scale
  { tIn: 875.18, tOut: 879.1, kind: 'container', ref: 'frozen-split', state: 's1', file: 'card-slides/frozen-split-s1.png', fx: 'xfade-scale', fxd: 0.35 },  // 14:35.2 ingress hand:xfade-scale
  { tIn: 879.1, tOut: 879.36, kind: 'container', ref: 'frozen-split', state: 's2', file: 'card-slides/frozen-split-s2.png', fx: 'state' },  // 14:39.1 ingress state
  { tIn: 879.36, tOut: 881.9, kind: 'container', ref: 'protect-yourself', state: 's1', file: 'card-slides/protect-yourself-s1.png', fx: 'card' },  // 14:39.4 ingress card
  { tIn: 881.9, tOut: 883.967, kind: 'container', ref: 'protect-yourself', state: 's2', file: 'card-slides/protect-yourself-s2.png', fx: 'state' },  // 14:41.9 ingress state
  { tIn: 887.033, tOut: 887.8, kind: 'container', ref: 'own-scarce', state: 'full', file: 'card-slides/own-scarce.png', fx: 'face' },  // 14:47.0 ingress face
  { tIn: 887.8, tOut: 889.4, kind: 'container', ref: 'own-scarce', state: 'lift:scarce', file: 'card-slides/own-scarce.png', fx: 'state' },  // 14:47.8 ingress state
  { tIn: 889.4, tOut: 890.52, kind: 'container', ref: 'own-scarce', state: 'lift:controls', file: 'card-slides/own-scarce.png', fx: 'state' },  // 14:49.4 ingress state
  { tIn: 890.52, tOut: 895.5, kind: 'chart', ref: 'C16-gates', state: 'payoff', fx: 'xfade-scale', fxd: 0.35 },  // 14:50.5 ingress hand:xfade-scale
  { tIn: 895.5, tOut: 899.5, kind: 'vid', ref: 'BR-56-phone-bitcoin-coin', file: 'vid/BR-56-phone-bitcoin-coin.mp4', fx: 'fade', fxd: 0.5 },  // 14:55.5 ingress hand:fade
  { tIn: 899.5, tOut: 904.9, kind: 'receipt', ref: 'R22', file: 'receipts/R22.png', fx: 'xfade-scale', fxd: 0.35 },  // 14:59.5 ingress hand:xfade-scale
  { tIn: 904.9, tOut: 908.86, kind: 'still', ref: 'IMG-32-kaspa-and-bitcoin-circuit-landscape', file: 'img/IMG-32-kaspa-and-bitcoin-circuit-landscape.png', fx: 'lib' },  // 15:04.9 ingress lib
  { tIn: 908.86, tOut: 911.2, kind: 'container', ref: 'three-reasons-1', state: 's1', file: 'card-slides/three-reasons-1-s1.png', fx: 'xfade-scale', fxd: 0.35 },  // 15:08.9 ingress hand:xfade-scale
  { tIn: 911.2, tOut: 913.3, kind: 'container', ref: 'three-reasons-1', state: 's2', file: 'card-slides/three-reasons-1-s2.png', fx: 'state' },  // 15:11.2 ingress state
  { tIn: 913.3, tOut: 916.16, kind: 'container', ref: 'three-reasons-1', state: 's3', file: 'card-slides/three-reasons-1-s3.png', fx: 'state' },  // 15:13.3 ingress state
  { tIn: 916.16, tOut: 920.0, kind: 'receipt', ref: 'R12', file: 'receipts/R12.png', fx: 'xfade-scale', fxd: 0.35, note: 'Coinbase sells agent wallets' },  // 15:16.2 ingress hand:xfade-scale
  { tIn: 920.0, tOut: 921.64, kind: 'container', ref: 'C17', state: 's1', file: 'diagrams/C17-s1.png', fx: 'lib' },  // 15:20.0 ingress lib
  { tIn: 921.64, tOut: 922.82, kind: 'container', ref: 'C17', state: 's2', file: 'diagrams/C17-s2.png', fx: 'state' },  // 15:21.6 ingress state
  { tIn: 922.82, tOut: 923.76, kind: 'container', ref: 'C17', state: 's3', file: 'diagrams/C17-s3.png', fx: 'state' },  // 15:22.8 ingress state
  { tIn: 923.76, tOut: 925.06, kind: 'container', ref: 'C17', state: 's4', file: 'diagrams/C17-s4.png', fx: 'state' },  // 15:23.8 ingress state
  { tIn: 925.06, tOut: 926.36, kind: 'container', ref: 'C17', state: 's5', file: 'diagrams/C17-s5.png', fx: 'state' },  // 15:25.1 ingress state
  { tIn: 926.36, tOut: 927.74, kind: 'container', ref: 'C17', state: 's6', file: 'diagrams/C17-s6.png', fx: 'state' },  // 15:26.4 ingress state
  { tIn: 927.74, tOut: 933.82, kind: 'receipt', ref: 'C41', file: 'receipts/C41.png', fx: 'xfade-scale', fxd: 0.35 },  // 15:27.7 ingress hand:xfade-scale
  { tIn: 933.82, tOut: 939.68, kind: 'chart', ref: 'early-x402', state: 'payoff', fx: 'xfade-scale', fxd: 0.35 },  // 15:33.8 ingress hand:xfade-scale
  { tIn: 939.68, tOut: 943.48, kind: 'still', ref: 'IMG-33-digital-dollar-coin-frozen-in-ice', file: 'img/IMG-33-digital-dollar-coin-frozen-in-ice.png', fx: 'lib' },  // 15:39.7 ingress lib
  { tIn: 943.48, tOut: 945.5, kind: 'container', ref: 'frozen-split-filled', state: 'full', file: 'card-slides/frozen-split-filled.png', fx: 'xfade-scale', fxd: 0.35 },  // 15:43.5 ingress hand:xfade-scale
  { tIn: 945.5, tOut: 947.0, kind: 'container', ref: 'frozen-split-filled', state: 'lift:noissuer', file: 'card-slides/frozen-split-filled.png', fx: 'state' },  // 15:45.5 ingress state
  { tIn: 947.0, tOut: 947.54, kind: 'container', ref: 'frozen-split-filled', state: 'lift:nogatekeeper', file: 'card-slides/frozen-split-filled.png', fx: 'state' },  // 15:47.0 ingress state
  { tIn: 947.54, tOut: 950.96, kind: 'still', ref: 'IMG-34-bitcoin-kaspa-dark-stone-mining-heat', file: 'img/IMG-34-bitcoin-kaspa-dark-stone-mining-heat.png', fx: 'lib' },  // 15:47.5 ingress lib
  { tIn: 950.96, tOut: 959.66, kind: 'receipt', ref: 'C39', file: 'receipts/C39.png', fx: 'xfade-scale', fxd: 0.35 },  // 15:51.0 ingress hand:xfade-scale
  { tIn: 959.66, tOut: 965.7, kind: 'chart', ref: 'C16-tao', state: 'payoff', fx: 'xfade-scale', fxd: 0.35 },  // 15:59.7 ingress hand:xfade-scale
  { tIn: 965.7, tOut: 971.0, kind: 'container', ref: 'thesis-card', state: 's1', file: 'card-slides/thesis-card-s1.png', fx: 'xfade-scale', fxd: 0.35 },  // 16:05.7 ingress hand:xfade-scale
  { tIn: 971.0, tOut: 974.94, kind: 'container', ref: 'thesis-card', state: 's2', file: 'card-slides/thesis-card-s2.png', fx: 'state' },  // 16:11.0 ingress state
  { tIn: 974.94, tOut: 979.3, kind: 'container', ref: 'catch-card', state: 'full', file: 'card-slides/catch-card.png', fx: 'xfade-scale', fxd: 0.35 },  // 16:14.9 ingress hand:xfade-scale
  { tIn: 979.3, tOut: 980.16, kind: 'container', ref: 'catch-card', state: 'lift:house', file: 'card-slides/catch-card.png', fx: 'state' },  // 16:19.3 ingress state
  { tIn: 980.16, tOut: 984.9, kind: 'receipt', ref: 'R16-top', file: 'receipts/R16-top.png', fx: 'xfade-scale', fxd: 0.35 },  // 16:20.2 ingress hand:xfade-scale
  { tIn: 984.9, tOut: 988.8, kind: 'receipt', ref: 'R16', file: 'receipts/R16.png', fx: 'xfade', fxd: 0.2 },  // 16:24.9 ingress hand:xfade
  { tIn: 988.8, tOut: 995.02, kind: 'chart', ref: 'home-invasions-1-20', state: 'payoff', fx: 'xfade-scale', fxd: 0.35 },  // 16:28.8 ingress hand:xfade-scale
  { tIn: 995.02, tOut: 999.02, kind: 'still', ref: 'IMG-35-robot-hallway-from-behind-close', file: 'img/IMG-35-robot-hallway-from-behind-close.png', fx: 'lib', badge: 'forecast', illus: true },  // 16:35.0 ingress lib
  { tIn: 999.02, tOut: 1001.2, kind: 'container', ref: 'guard-then-deflation', state: 's1', file: 'card-slides/guard-then-deflation-s1.png', fx: 'xfade-scale', fxd: 0.35 },  // 16:39.0 ingress hand:xfade-scale
  { tIn: 1001.2, tOut: 1004.9, kind: 'container', ref: 'guard-then-deflation', state: 's2', file: 'card-slides/guard-then-deflation-s2.png', fx: 'state' },  // 16:41.2 ingress state
  { tIn: 1004.9, tOut: 1010.42, kind: 'receipt', ref: 'R24', file: 'receipts/R24.png', fx: 'xfade-scale', fxd: 0.35 },  // 16:44.9 ingress hand:xfade-scale
  { tIn: 1010.42, tOut: 1017.26, kind: 'receipt', ref: 'C18', file: 'receipts/C18.png', fx: 'xfade-scale', fxd: 0.35 },  // 16:50.4 ingress hand:xfade-scale
  { tIn: 1017.26, tOut: 1020.8, kind: 'container', ref: 'checks-card', state: 'full', file: 'card-slides/checks-card.png', fx: 'xfade-scale', fxd: 0.35 },  // 16:57.3 ingress hand:xfade-scale
  { tIn: 1020.8, tOut: 1021.22, kind: 'container', ref: 'checks-card', state: 'lift:checks', file: 'card-slides/checks-card.png', fx: 'state' },  // 17:00.8 ingress state
  { tIn: 1021.22, tOut: 1025.2, kind: 'vid', ref: 'BR-57-printing-press-dollar-bills', file: 'vid/BR-57-printing-press-dollar-bills.mp4', fx: 'fade', fxd: 0.5 },  // 17:01.2 ingress hand:fade
  { tIn: 1025.2, tOut: 1029.44, kind: 'chart', ref: 'money-printer-card', state: 'payoff', fx: 'xfade-scale', fxd: 0.35 },  // 17:05.2 ingress hand:xfade-scale
  { tIn: 1029.44, tOut: 1034.0, kind: 'container', ref: 'conviction-card', state: 's1', file: 'card-slides/conviction-card-s1.png', fx: 'xfade-scale', fxd: 0.35 },  // 17:09.4 ingress hand:xfade-scale
  { tIn: 1034.0, tOut: 1036.2, kind: 'container', ref: 'conviction-card', state: 's2', file: 'card-slides/conviction-card-s2.png', fx: 'state' },  // 17:14.0 ingress state
  { tIn: 1036.2, tOut: 1038.12, kind: 'container', ref: 'conviction-card', state: 's3', file: 'card-slides/conviction-card-s3.png', fx: 'state' },  // 17:16.2 ingress state
  { tIn: 1038.12, tOut: 1042.1, kind: 'still', ref: 'IMG-36-three-coins-btc-kas-tao-low-in-shadow', file: 'img/IMG-36-three-coins-btc-kas-tao-low-in-shadow.png', fx: 'lib' },  // 17:18.1 ingress lib
  { tIn: 1042.1, tOut: 1046.2, kind: 'container', ref: 'dyor-card', state: 'full', file: 'card-slides/dyor-card.png', fx: 'xfade-scale', fxd: 0.35 },  // 17:22.1 ingress hand:xfade-scale
  { tIn: 1046.2, tOut: 1047.7, kind: 'container', ref: 'dyor-card', state: 'lift:dyor', file: 'card-slides/dyor-card.png', fx: 'state' },  // 17:26.2 ingress state
  { tIn: 1047.7, tOut: 1057.633, kind: 'chart', ref: 'C7', state: 'payoff', fx: 'xfade-scale', fxd: 0.35 },  // 17:27.7 ingress hand:xfade-scale
  { tIn: 1062.267, tOut: 1065.28, kind: 'still', ref: 'IMG-37-brain-circuitry-dark-clean', file: 'img/IMG-37-brain-circuitry-dark-clean.png', fx: 'face' },  // 17:42.3 ingress face
  { tIn: 1065.28, tOut: 1066.8, kind: 'container', ref: 'recap-list', state: 's1', file: 'card-slides/recap-list-s1.png', fx: 'xfade-scale', fxd: 0.35 },  // 17:45.3 ingress hand:xfade-scale
  { tIn: 1066.8, tOut: 1067.0, kind: 'container', ref: 'recap-list', state: 's2', file: 'card-slides/recap-list-s2.png', fx: 'state' },  // 17:46.8 ingress state
  { tIn: 1067.0, tOut: 1067.2, kind: 'container', ref: 'recap-list', state: 's3', file: 'card-slides/recap-list-s3.png', fx: 'state' },  // 17:47.0 ingress state
  { tIn: 1067.2, tOut: 1067.4, kind: 'container', ref: 'recap-list', state: 's4', file: 'card-slides/recap-list-s4.png', fx: 'state' },  // 17:47.2 ingress state
  { tIn: 1067.4, tOut: 1067.6, kind: 'container', ref: 'recap-list', state: 's5', file: 'card-slides/recap-list-s5.png', fx: 'state' },  // 17:47.4 ingress state
  { tIn: 1067.6, tOut: 1067.8, kind: 'container', ref: 'recap-list', state: 's6', file: 'card-slides/recap-list-s6.png', fx: 'state' },  // 17:47.6 ingress state
  { tIn: 1067.8, tOut: 1068.0, kind: 'container', ref: 'recap-list', state: 's7', file: 'card-slides/recap-list-s7.png', fx: 'state' },  // 17:47.8 ingress state
  { tIn: 1068.0, tOut: 1068.2, kind: 'container', ref: 'recap-list', state: 's8', file: 'card-slides/recap-list-s8.png', fx: 'state' },  // 17:48.0 ingress state
  { tIn: 1068.2, tOut: 1068.4, kind: 'container', ref: 'recap-list', state: 's9', file: 'card-slides/recap-list-s9.png', fx: 'state' },  // 17:48.2 ingress state
  { tIn: 1068.4, tOut: 1068.6, kind: 'container', ref: 'recap-list', state: 's10', file: 'card-slides/recap-list-s10.png', fx: 'state' },  // 17:48.4 ingress state
  { tIn: 1068.6, tOut: 1068.8, kind: 'container', ref: 'recap-list', state: 's11', file: 'card-slides/recap-list-s11.png', fx: 'state' },  // 17:48.6 ingress state
  { tIn: 1068.8, tOut: 1069.0, kind: 'container', ref: 'recap-list', state: 's12', file: 'card-slides/recap-list-s12.png', fx: 'state' },  // 17:48.8 ingress state
  { tIn: 1069.0, tOut: 1069.4, kind: 'container', ref: 'recap-list', state: 's13', file: 'card-slides/recap-list-s13.png', fx: 'state' },  // 17:49.0 ingress state
  { tIn: 1075.267, tOut: 1077.633, kind: 'still', ref: 'IMG-38-kaspa-and-bitcoin-rising-from-darkness', file: 'img/IMG-38-kaspa-and-bitcoin-rising-from-darkness.png', fx: 'face' },  // 17:55.3 ingress face
];

export const XFX: Xfx[] = [
  { tc: 1.133, id: 'lightleaks-5', kind: 'leak', face: 1 }, // lib:lightleaks-5 @0:01.1 FACE F1: punch-in + light leak ON the desilence-final join 1
  { tc: 3.9, id: 'lightleaks-2', kind: 'leak', face: 1 }, // lib:lightleaks-2 @0:03.9 FACE F1: punch-in + light leak ON the desilence-coarse join 
  { tc: 10.4, id: 'blocks-max-1', kind: 'face-out', face: 1 }, // lib:blocks-max-1 @0:10.4 FACE F1 out -> C20 (receipt)
  { tc: 28.3, id: 'blocks-max-2', kind: 'face-in', face: 2 }, // lib:blocks-max-2 @0:28.3 BR-1-humanoids-walking-dark -> FACE F2 in
  { tc: 31.233, id: 'blocks-short-1', kind: 'face-out', face: 2 }, // lib:blocks-short-1 @0:31.2 FACE F2 out -> H0 (animated chart)
  { tc: 39.2, id: 'tvsat-max-1', kind: 'still' }, // lib:tvsat-max-1 @0:39.2 BR-2-humanoid-factory-assembly -> IMG-1-robot-sunlit-entrywa
  { tc: 53.76, id: 'tvsat-min-1', kind: 'still' }, // lib:tvsat-min-1 @0:53.8 C5-tease (animated chart) -> IMG-2-man-kitchen-table-paychec
  { tc: 138.333, id: 'blocks-max-3', kind: 'face-in', face: 3 }, // lib:blocks-max-3 @2:18.3 new-jobs-chain (diagram) -> FACE F3 in
  { tc: 141.7, id: 'blocks-max-1', kind: 'face-out', face: 3 }, // lib:blocks-max-1 @2:21.7 FACE F3 out -> new-jobs-chain-broken (diagram)
  { tc: 148.44, id: 'tvsat-min-2', kind: 'still' }, // lib:tvsat-min-2 @2:28.4 BR-12-antique-telephone-receiver -> IMG-4-1920s-telephone-ex
  { tc: 175.06, id: 'tvsat-min-3', kind: 'still' }, // lib:tvsat-min-3 @2:55.1 BR-15-vintage-1920s-sedan -> IMG-5-1920s-boomtown-factory-ga
  { tc: 195.2, id: 'tvsat-min-1', kind: 'still' }, // lib:tvsat-min-1 @3:15.2 BR-20-robot-arms-auto-part -> IMG-6-dark-automated-factory-n
  { tc: 206.7, id: 'blocks-max-2', kind: 'face-in', face: 4 }, // lib:blocks-max-2 @3:26.7 C2 (animated chart) -> FACE F4 in
  { tc: 212.133, id: 'blocks-max-3', kind: 'face-out', face: 4 }, // lib:blocks-max-3 @3:32.1 FACE F4 out -> C23 (receipt)
  { tc: 226.8, id: 'tvsat-min-2', kind: 'still' }, // lib:tvsat-min-2 @3:46.8 BR-21-typing-glowing-laptop-dark -> IMG-7-brain-inside-crt-m
  { tc: 259.8, id: 'tvsat-min-3', kind: 'still' }, // lib:tvsat-min-3 @4:19.8 BR-24-robot-arm-stacks-sheet-metal -> IMG-8-robot-end-of-shi
  { tc: 270.84, id: 'tvsat-short-1', kind: 'still' }, // lib:tvsat-short-1 @4:30.8 body-vs-worker (card) -> IMG-9-home-humanoid-dim-living-room
  { tc: 303.467, id: 'blocks-short-2', kind: 'face-in', face: 5 }, // lib:blocks-short-2 @5:03.5 BR-27-ceiling-light-install -> FACE F5 in
  { tc: 305.8, id: 'blocks-short-3', kind: 'face-out', face: 5 }, // lib:blocks-short-3 @5:05.8 FACE F5 out -> C3-forecast (diagram)
  { tc: 308.94, id: 'tvsat-min-1', kind: 'still' }, // lib:tvsat-min-1 @5:08.9 C3-forecast (diagram) -> IMG-10-robot-doorway-staircase (AI 
  { tc: 312.2, id: 'tvsat-min-2', kind: 'still' }, // lib:tvsat-min-2 @5:12.2 IMG-10-robot-doorway-staircase -> IMG-11-robot-attic-ladder 
  { tc: 314.86, id: 'tvsat-min-3', kind: 'still' }, // lib:tvsat-min-3 @5:14.9 IMG-11-robot-attic-ladder -> IMG-12-robot-garage-pegboard (A
  { tc: 321.933, id: 'blocks-max-1', kind: 'face-in', face: 6 }, // lib:blocks-max-1 @5:21.9 C1-pre (diagram) -> FACE F6 in
  { tc: 325.3, id: 'blocks-max-2', kind: 'face-out', face: 6 }, // lib:blocks-max-2 @5:25.3 FACE F6 out -> C1 (diagram)
  { tc: 335.44, id: 'tvsat-short-2', kind: 'still' }, // lib:tvsat-short-2 @5:35.4 C1 (diagram) -> IMG-13-robot-neck-data-cable (AI still)
  { tc: 353.7, id: 'tvsat-short-3', kind: 'still' }, // lib:tvsat-short-3 @5:53.7 BR-31-electrician-tests-panel -> IMG-14-globe-network-robot-
  { tc: 366.6, id: 'melt-rgb-1', kind: 'melt' }, // lib:melt-rgb-1 @6:06.6 combined-knowledge (card) -> C1-download (diagram)
  { tc: 375.88, id: 'tvsat-max-2', kind: 'still' }, // lib:tvsat-max-2 @6:15.9 BR-34-night-guard-radio -> IMG-15-robot-hallway-3am-front-do
  { tc: 383.64, id: 'tvsat-min-1', kind: 'still' }, // lib:tvsat-min-1 @6:23.6 BR-35-hooded-intruder-night -> IMG-16-hardware-wallet-seed-c
  { tc: 388.42, id: 'tvsat-min-2', kind: 'still' }, // lib:tvsat-min-2 @6:28.4 BR-36-dog-barks-behind-fence -> IMG-17-robot-charging-dock-d
  { tc: 406.34, id: 'tvsat-short-1', kind: 'still' }, // lib:tvsat-short-1 @6:46.3 C6 (animated chart) -> IMG-18-robot-hands-pipe-under-sink (A
  { tc: 440.6, id: 'tvsat-min-3', kind: 'still' }, // lib:tvsat-min-3 @7:20.6 BR-42-worker-thumbs-down -> IMG-19-house-dusk-robot-silhouet
  { tc: 452.2, id: 'blocks-short-1', kind: 'face-in', face: 7 }, // lib:blocks-short-1 @7:32.2 C4-template (card) -> FACE F7 in
  { tc: 453.8, id: 'lightleaks-short-5', kind: 'leak', face: 7 }, // lib:lightleaks-short-5 @7:33.8 FACE F7: punch-in + light leak ON the desilence-coarse join 
  { tc: 454.4, id: 'blocks-short-2', kind: 'face-out', face: 7 }, // lib:blocks-short-2 @7:34.4 FACE F7 out -> C4-cashiers (animated chart)
  { tc: 458.1, id: 'tvsat-min-1', kind: 'still' }, // lib:tvsat-min-1 @7:38.1 C4-cashiers (animated chart) -> IMG-20-self-checkout-kiosks-
  { tc: 489.72, id: 'tvsat-min-2', kind: 'still' }, // lib:tvsat-min-2 @8:09.7 C4-csr (animated chart) -> IMG-21-empty-call-center-night (A
  { tc: 516.06, id: 'tvsat-min-3', kind: 'still' }, // lib:tvsat-min-3 @8:36.1 C4-truck (animated chart) -> IMG-22-empty-cab-semi-truck-hig
  { tc: 550.767, id: 'blocks-max-3', kind: 'face-in', face: 8 }, // lib:blocks-max-3 @9:10.8 BR-47-data-center-fly-through -> FACE F8 in
  { tc: 555.833, id: 'lightleaks-short-2', kind: 'leak', face: 8 }, // lib:lightleaks-short-2 @9:15.8 FACE F8: punch-in + light leak ON the desilence-coarse join 
  { tc: 556.533, id: 'blocks-max-1', kind: 'face-out', face: 8 }, // lib:blocks-max-1 @9:16.5 FACE F8 out -> C4-plumbers (animated chart)
  { tc: 565.2, id: 'tvsat-short-2', kind: 'still' }, // lib:tvsat-short-2 @9:25.2 BR-48-torch-solders-copper-pipe -> IMG-23-robot-hand-red-wre
  { tc: 574.033, id: 'blocks-max-2', kind: 'face-in', face: 9 }, // lib:blocks-max-2 @9:34.0 download-card (card) -> FACE F9 in
  { tc: 576.6, id: 'lightleaks-short-5', kind: 'leak', face: 9 }, // lib:lightleaks-short-5 @9:36.6 FACE F9: punch-in + light leak ON the desilence-coarse join 
  { tc: 577.367, id: 'blocks-max-3', kind: 'face-out', face: 9 }, // lib:blocks-max-3 @9:37.4 FACE F9 out -> C5-climb (animated chart)
  { tc: 589.26, id: 'tvsat-min-1', kind: 'still' }, // lib:tvsat-min-1 @9:49.3 R10 (receipt) -> IMG-24-code-scrolling-empty-office (AI stil
  { tc: 592.0, id: 'blocks-max-1', kind: 'face-in', face: 10 }, // lib:blocks-max-1 @9:52.0 IMG-24-code-scrolling-empty-office -> FACE F10 in
  { tc: 595.967, id: 'lightleaks-short-2', kind: 'leak', face: 10 }, // lib:lightleaks-short-2 @9:56.0 FACE F10: punch-in + light leak ON the desilence-coarse join
  { tc: 596.767, id: 'blocks-max-2', kind: 'face-out', face: 10 }, // lib:blocks-max-2 @9:56.8 FACE F10 out -> C4-radiologists (animated chart)
  { tc: 602.32, id: 'tvsat-min-2', kind: 'still' }, // lib:tvsat-min-2 @10:02.3 C4-radiologists (animated chart) -> IMG-25-radiology-room-em
  { tc: 633.52, id: 'melt-rgb-3', kind: 'melt' }, // lib:melt-rgb-3 @10:33.5 C4-radiologists NOTE state (animated chart) -> C5-top (anima
  { tc: 658.02, id: 'spin-3d-corner-ease-t-cw', kind: 'spin' }, // lib:spin-3d-corner-ease-t-cw @10:58.0 C32 (receipt) -> C9 (diagram)
  { tc: 666.72, id: 'tvsat-short-3', kind: 'still' }, // lib:tvsat-short-3 @11:06.7 C9 (diagram) -> IMG-26-empty-operating-room-robot-arm (AI st
  { tc: 676.067, id: 'blocks-max-3', kind: 'face-in', face: 11, shift: 6 }, // lib:blocks-max-3 @11:16.1 never-card (card) -> FACE F11 in
  { tc: 676.667, id: 'lightleaks-short-5', kind: 'leak', face: 11 }, // lib:lightleaks-short-5 @11:16.7 FACE F11: punch-in + light leak ON the desilence-coarse join
  { tc: 679.7, id: 'lightleaks-5', kind: 'leak', face: 11 }, // lib:lightleaks-5 @11:19.7 FACE F11: punch-in + light leak ON the defumble join 679.700
  { tc: 682.1, id: 'lightleaks-short-2', kind: 'leak', face: 11 }, // lib:lightleaks-short-2 @11:22.1 FACE F11: punch-in + light leak ON the desilence-coarse join
  { tc: 683.0, id: 'blocks-max-1', kind: 'face-out', face: 11 }, // lib:blocks-max-1 @11:23.0 FACE F11 out -> C2-surgeon (animated chart)
  { tc: 686.26, id: 'tvsat-min-3', kind: 'still' }, // lib:tvsat-min-3 @11:26.3 C2-surgeon (animated chart) -> IMG-27-surgeon-glove-scalpel-
  { tc: 692.18, id: 'tvsat-short-1', kind: 'still' }, // lib:tvsat-short-1 @11:32.2 BR-51-gavel-strike -> IMG-28-highway-crash-aftermath-night (
  { tc: 726.16, id: 'tvsat-short-2', kind: 'still' }, // lib:tvsat-short-2 @12:06.2 C13 (animated chart) -> IMG-29-robot-run-city-street-dawn (A
  { tc: 740.533, id: 'blocks-short-3', kind: 'face-in', face: 12 }, // lib:blocks-short-3 @12:20.5 consumption-67 (animated chart) -> FACE F12 in
  { tc: 742.033, id: 'lightleaks-short-5', kind: 'leak', face: 12 }, // lib:lightleaks-short-5 @12:22.0 FACE F12: punch-in + light leak ON the desilence-final join 
  { tc: 743.033, id: 'blocks-short-1', kind: 'face-out', face: 12 }, // lib:blocks-short-1 @12:23.0 FACE F12 out -> BR-53-closed-storefront-shutters
  { tc: 785.833, id: 'blocks-short-2', kind: 'face-in', face: 13 }, // lib:blocks-short-2 @13:05.8 survivors-tiles (card) -> FACE F13 in
  { tc: 787.5, id: 'lightleaks-2', kind: 'leak', face: 13 }, // lib:lightleaks-2 @13:07.5 FACE F13: punch-in + light leak ON the desilence-coarse join
  { tc: 788.6, id: 'blocks-short-3', kind: 'face-out', face: 13, shift: -1 }, // lib:blocks-short-3 @13:08.6 FACE F13 out -> C15-jobs-fade (card)
  { tc: 809.76, id: 'spin-3d-corner-ease-t-cw', kind: 'spin' }, // lib:spin-3d-corner-ease-t-cw @13:29.8 C40 (receipt) -> C14 (diagram)
  { tc: 835.88, id: 'melt-rgb-3', kind: 'melt' }, // lib:melt-rgb-3 @13:55.9 C12 (real-site chart) -> C14-leverage (diagram)
  { tc: 852.96, id: 'tvsat-min-1', kind: 'still' }, // lib:tvsat-min-1 @14:13.0 C37 (receipt) -> IMG-30-envelope-handoff-suit-sleeve (AI sti
  { tc: 863.86, id: 'tvsat-min-2', kind: 'still' }, // lib:tvsat-min-2 @14:23.9 us-law-july-2025 (card) -> IMG-31-digital-dollar-coin-padloc
  { tc: 883.967, id: 'blocks-max-2', kind: 'face-in', face: 14 }, // lib:blocks-max-2 @14:44.0 protect-yourself (card) -> FACE F14 in
  { tc: 885.833, id: 'lightleaks-5', kind: 'leak', face: 14 }, // lib:lightleaks-5 @14:45.8 FACE F14: punch-in + light leak ON the desilence-coarse join
  { tc: 887.033, id: 'blocks-max-3', kind: 'face-out', face: 14 }, // lib:blocks-max-3 @14:47.0 FACE F14 out -> own-scarce (card)
  { tc: 904.9, id: 'tvsat-short-3', kind: 'still' }, // lib:tvsat-short-3 @15:04.9 R22 (receipt) -> IMG-32-kaspa-and-bitcoin-circuit-landscape 
  { tc: 920.0, id: 'spin-3d-corner-ease-t-cw', kind: 'spin' }, // lib:spin-3d-corner-ease-t-cw @15:20.0 R12 (receipt) -> C17 (diagram)
  { tc: 939.68, id: 'tvsat-min-3', kind: 'still' }, // lib:tvsat-min-3 @15:39.7 early-x402 (animated chart) -> IMG-33-digital-dollar-coin-fr
  { tc: 947.54, id: 'tvsat-min-1', kind: 'still' }, // lib:tvsat-min-1 @15:47.5 frozen-split-filled (card) -> IMG-34-bitcoin-kaspa-dark-ston
  { tc: 995.02, id: 'tvsat-max-3', kind: 'still' }, // lib:tvsat-max-3 @16:35.0 home-invasions-1-20 (animated chart) -> IMG-35-robot-hallway
  { tc: 1038.12, id: 'tvsat-short-1', kind: 'still' }, // lib:tvsat-short-1 @17:18.1 conviction-card (card) -> IMG-36-three-coins-btc-kas-tao-low
  { tc: 1057.633, id: 'blocks-max-1', kind: 'face-in', face: 15 }, // lib:blocks-max-1 @17:37.6 C7 (animated chart) -> FACE F15 in
  { tc: 1060.767, id: 'lightleaks-2', kind: 'leak', face: 15 }, // lib:lightleaks-2 @17:40.8 FACE F15: punch-in + light leak ON the desilence-coarse join
  { tc: 1062.267, id: 'blocks-max-2', kind: 'face-out', face: 15 }, // lib:blocks-max-2 @17:42.3 FACE F15 out -> IMG-37-brain-circuitry-dark-clean
  { tc: 1069.4, id: 'blocks-max-3', kind: 'face-in', face: 16 }, // lib:blocks-max-3 @17:49.4 recap-list (card) -> FACE F16 in
  { tc: 1072.567, id: 'lightleaks-5', kind: 'leak', face: 16 }, // lib:lightleaks-5 @17:52.6 FACE F16: punch-in + light leak ON the desilence-coarse join
  { tc: 1075.267, id: 'blocks-max-1', kind: 'face-out', face: 16 }, // lib:blocks-max-1 @17:55.3 FACE F16 out -> IMG-38-kaspa-and-bitcoin-rising-from-darknes
  { tc: 1077.633, id: 'blocks-max-2', kind: 'face-in', face: 17 }, // lib:blocks-max-2 @17:57.6 IMG-38-kaspa-and-bitcoin-rising-from-darkness -> FACE F17 in
  { tc: 1082.9, id: 'lightleaks-2', kind: 'leak', face: 17 }, // lib:lightleaks-2 @18:02.9 FACE F17: punch-in + light leak ON the desilence-coarse join
  { tc: 1085.767, id: 'lightleaks-5', kind: 'leak', face: 17 }, // lib:lightleaks-5 @18:05.8 FACE F17: punch-in + light leak ON the desilence-final join 
  { tc: 1088.333, id: 'lightleaks-2', kind: 'leak', face: 17 }, // lib:lightleaks-2 @18:08.3 FACE F17: punch-in + light leak ON the desilence-coarse join
  { tc: 1091.433, id: 'lightleaks-5', kind: 'leak', face: 17 }, // lib:lightleaks-5 @18:11.4 FACE F17: punch-in + light leak ON the desilence-coarse join
  { tc: 1096.6, id: 'lightleaks-2', kind: 'leak', face: 17 }, // lib:lightleaks-2 @18:16.6 FACE F17: punch-in + light leak ON the desilence-coarse join
  { tc: 1100.667, id: 'lightleaks-5', kind: 'leak', face: 17 }, // lib:lightleaks-5 @18:20.7 FACE F17: punch-in + light leak ON the desilence-coarse join
  { tc: 1102.367, id: 'lightleaks-2', kind: 'leak', face: 17 }, // lib:lightleaks-2 @18:22.4 FACE F17: punch-in + light leak ON the desilence-coarse join
  { tc: 1112.433, id: 'lightleaks-5', kind: 'leak', face: 17 }, // lib:lightleaks-5 @18:32.4 FACE F17: punch-in + light leak ON the desilence-coarse join
  { tc: 1116.833, id: 'lightleaks-2', kind: 'leak', face: 17 }, // lib:lightleaks-2 @18:36.8 FACE F17: punch-in + light leak ON the desilence-coarse join
  { tc: 1118.467, id: 'lightleaks-5', kind: 'leak', face: 17 }, // lib:lightleaks-5 @18:38.5 FACE F17: punch-in + light leak ON the desilence-coarse join
];

export const PUNCH: Punch[] = [
  { tc: 1.133, scale: 1.06, face: 1 }, // hand:punch F1 @0:01.1
  { tc: 3.9, scale: 1.0, face: 1 }, // hand:punch F1 @0:03.9
  { tc: 453.8, scale: 1.06, face: 7 }, // hand:punch F7 @7:33.8
  { tc: 555.833, scale: 1.06, face: 8 }, // hand:punch F8 @9:15.8
  { tc: 576.6, scale: 1.06, face: 9 }, // hand:punch F9 @9:36.6
  { tc: 595.967, scale: 1.06, face: 10 }, // hand:punch F10 @9:56.0
  { tc: 676.667, scale: 1.18, face: 11 }, // hand:punch F11 @11:16.7
  { tc: 679.7, scale: 1.0, face: 11 }, // hand:punch F11 @11:19.7
  { tc: 682.1, scale: 1.18, face: 11 }, // hand:punch F11 @11:22.1
  { tc: 742.033, scale: 1.18, face: 12 }, // hand:punch F12 @12:22.0
  { tc: 787.5, scale: 1.18, face: 13 }, // hand:punch F13 @13:07.5
  { tc: 885.833, scale: 1.18, face: 14 }, // hand:punch F14 @14:45.8
  { tc: 1060.767, scale: 1.18, face: 15 }, // hand:punch F15 @17:40.8
  { tc: 1069.4, scale: 1.18, face: 16, crash: true }, // hand:punch F16 @17:49.4 vibe-cut crash zoom
  { tc: 1072.567, scale: 1.0, face: 16 }, // hand:punch F16 @17:52.6
  { tc: 1082.9, scale: 1.18, face: 17 }, // hand:punch F17 @18:02.9
  { tc: 1085.767, scale: 1.0, face: 17 }, // hand:punch F17 @18:05.8
  { tc: 1088.333, scale: 1.18, face: 17 }, // hand:punch F17 @18:08.3
  { tc: 1091.433, scale: 1.0, face: 17 }, // hand:punch F17 @18:11.4
  { tc: 1096.6, scale: 1.18, face: 17 }, // hand:punch F17 @18:16.6
  { tc: 1100.667, scale: 1.0, face: 17 }, // hand:punch F17 @18:20.7
  { tc: 1102.367, scale: 1.18, face: 17 }, // hand:punch F17 @18:22.4
  { tc: 1112.433, scale: 1.0, face: 17 }, // hand:punch F17 @18:32.4
  { tc: 1116.833, scale: 1.18, face: 17 }, // hand:punch F17 @18:36.8
  { tc: 1118.467, scale: 1.0, face: 17 }, // hand:punch F17 @18:38.5
];
// </GEN:TABLES>

// ------------------------------------------------------------------ clock: ONE absolute frame for every node (§6a)
const Clock = createContext(0);
const useAbs = () => useContext(Clock);
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const cl01 = (v: number) => clamp(v, 0, 1);
const easeIO = Easing.inOut(Easing.cubic);
const easeO = Easing.out(Easing.cubic);

// ------------------------------------------------------------------ blocks = contiguous same-ref rows (state swaps)
type Block = { i: number; ref: string; kind: Kind; rows: Cover[]; tIn: number; tOut: number; f0: number; f1: number; fx: string; fxd: number; tail: number };
const BLOCKS: Block[] = (() => {
  const out: Block[] = [];
  for (const r of COVERS) {
    const last = out[out.length - 1];
    if (last && last.ref === r.ref && Math.abs(last.tOut - r.tIn) < 1e-6) {
      last.rows.push(r); last.tOut = r.tOut; last.f1 = F(r.tOut);
    } else {
      out.push({ i: out.length, ref: r.ref, kind: r.kind, rows: [r], tIn: r.tIn, tOut: r.tOut, f0: F(r.tIn), f1: F(r.tOut), fx: r.fx, fxd: r.fxd ?? 0, tail: 0 });
    }
  }
  // a hand cross-fade into the next block keeps this block alive underneath for the fade
  for (let k = 0; k + 1 < out.length; k++) {
    const n = out[k + 1];
    if (Math.abs(n.tIn - out[k].tOut) < 1e-6 && ['fade', 'xfade', 'xfade-scale'].includes(n.fx)) out[k].tail = Math.round(n.fxd * FPS);
  }
  return out;
})();
const blockEndingAt = (t: number) => BLOCKS.find((b) => Math.abs(b.tOut - t) < 0.06);
const blockStartingAt = (t: number) => BLOCKS.find((b) => Math.abs(b.tIn - t) < 0.06);

// ------------------------------------------------------------------ media atoms (absolute clock, Freeze-based)
const FILL: React.CSSProperties = { position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, objectFit: 'cover' };
/** THE frozen-frame atom: a muted video pinned to an exact media frame, correct in ANY nesting. A real <Freeze>,
 * but frozen at frame 0 with the media position carried by trimBefore: Remotion clamps the timeline position to
 * durationInFrames-1, and a Freeze adds its parent Sequence's offset to the frozen frame, so `<Freeze frame={n}>`
 * with a large n inside a late Sequence overflowed and resolved to the wrong (black, cover-beat) spine time
 * (chunk QA 2026-10-07, F11: 134 black frames). Freeze(0) + trimBefore(n) never overflows. */
// The +0.5 asks for the MIDDLE of frame `at`: Remotion's time->pts lookup floors, so an exact frame time returned the
// PREVIOUS frame (measured: comp frame 20560 matched spine frame 20559 best; the first frame of every spine face
// window came back black). Mid-frame lookup is frame-exact.
const FrozenMedia: React.FC<{ file: string; at: number; style?: React.CSSProperties }> = ({ file, at, style }) => (
  <Freeze frame={0}>
    <OffthreadVideo src={staticFile(file)} trimBefore={Math.max(0, Math.round(at)) + 0.5} muted style={style} />
  </Freeze>
);
/** a muted cover video at an exact clip frame (clamped inside the clip) */
const VideoAt: React.FC<{ file: string; clipFrame: number; style?: React.CSSProperties }> = ({ file, clipFrame, style }) => {
  const max = Math.floor((VIDEO_SECS[file] ?? 1e6) * FPS) - 2;
  return <FrozenMedia file={file} at={clamp(clipFrame, 0, max)} style={{ ...FILL, ...style }} />;
};

/** THE face node (live layer AND every engine still): a real Freeze, muted, the live layer's transform + source */
const FaceNode: React.FC<{ n: number; frame: number; punch?: number }> = ({ n, frame, punch }) => {
  const f0 = faceF0(n);
  const fr = clamp(frame, f0 + (FACE_EDGE_SHIFT[n] ?? 0), faceF1(n) - 1);
  const s = punch ?? punchScale(n, fr);
  const sw = SWAP[n];
  const media = sw ? (
    // PRE-FRAMED background-swap clip: full frame, NO FACE_REFRAME (§3b); window starts at clip frame sw.start
    <FrozenMedia file={sw.file} at={clamp(sw.start + (fr - f0), 0, sw.clipFrames - 1)} style={FILL} />
  ) : (
    // the recorded spine through the MEASURED FACE_REFRAME (§3a), frozen on the frame that airs
    <FrozenMedia file="spine.mp4" at={Math.min(fr + (SPINE_SKEW[n] ?? 0), SPINE_FRAMES - 1)} style={{
      position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0',
      transform: `translate(${FACE_REFRAME.x}px, ${FACE_REFRAME.y}px) scale(${FACE_REFRAME.scale})`,
    }} />
  );
  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      <AbsoluteFill style={{ transformOrigin: `${FACE_POINT.x}px ${FACE_POINT.y}px`, transform: `scale(${s})` }}>{media}</AbsoluteFill>
    </AbsoluteFill>
  );
};
/** punch-ins: a hard step about FACE_POINT ON each join (PUNCH); the F16 vibe cut crash-zooms over 4 frames */
function punchScale(n: number, fr: number) {
  let s = 1;
  for (const p of PUNCH) {
    if (p.face !== n) continue;
    const pf = F(p.tc);
    if (fr < pf) break;
    s = p.crash ? interpolate(fr, [pf, pf + 4], [1, p.scale], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeO }) : p.scale;
  }
  return s;
}

// ------------------------------------------------------------------ overlays carried by a cover (so engines carry them too)
const HwGrade: React.FC<{ strong?: boolean }> = ({ strong }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 48%, rgba(0,0,0,0) ${strong ? 50 : 58}%, rgba(46,4,6,${strong ? 0.62 : 0.5}) 100%)`, pointerEvents: 'none' }} />
);
const Illustration: React.FC = () => (
  <div style={{
    position: 'absolute', left: 80, bottom: 64, padding: '9px 18px 8px', borderRadius: 8, background: 'rgba(6,7,10,.74)',
    border: '1.5px solid rgba(232,234,240,.45)', color: '#e8eaf0', fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
    fontSize: 20, letterSpacing: '.2em', textTransform: 'uppercase',
  }}>Illustration</div>
);
// Mike, 2026-10-08 (draft v1 review): the corner tier badges (DEPLOYED / CLAIMED / FORECAST) are unnecessary; OFF.
const SHOW_TIER_BADGES = false;
const Badge: React.FC<{ tier: 'deployed' | 'claimed' | 'forecast' }> = ({ tier }) => (
  <Img src={staticFile(`diagrams/C3-badge-${tier}.png`)} style={{ ...FILL, objectFit: 'fill' }} />
);
const Chip: React.FC<{ text: string; pos: 'tl' | 'br' }> = ({ text, pos }) => (
  <div style={{
    position: 'absolute', ...(pos === 'tl' ? { left: 80, top: 64 } : { right: 80, bottom: 64 }), padding: '12px 22px', borderRadius: 10,
    background: 'rgba(6,7,10,.86)', border: '2px solid rgba(255,215,0,.75)', color: '#ffd700', fontFamily: "'DM Sans', sans-serif",
    fontWeight: 700, fontSize: 26, letterSpacing: '.06em', boxShadow: '0 10px 30px rgba(0,0,0,.45)',
  }}>{text}</div>
);

// ------------------------------------------------------------------ receipts: real pixels, OCR-located push + highlight
type Cam = typeof RECEIPTS[string];
const camByFile: Record<string, Cam> = Object.fromEntries(Object.values(RECEIPTS).map((c) => [c.file, c]));
const ReceiptCam: React.FC<{ cam: Cam; t: number; t0: number; t1: number; vw?: number; vh?: number }> = ({ cam, t, t0, t1, vw = 1920, vh = 1080 }) => {
  let pose = { fx: cam.kfs[0].fx, fy: cam.kfs[0].fy, z: cam.kfs[0].z };
  for (let j = 1; j < cam.kfs.length; j++) {
    const k = cam.kfs[j];
    if (t < k.t) break;
    const e = easeIO(cl01((t - k.t) / Math.max(0.01, k.d)));
    pose = { fx: pose.fx + (k.fx - pose.fx) * e, fy: pose.fy + (k.fy - pose.fy) * e, z: pose.z + (k.z - pose.z) * e };
  }
  const drift = 1 + 0.035 * cl01((t - t0) / Math.max(0.5, t1 - t0));   // never dead still
  const s0 = vw / cam.w;
  const zfill = cam.fit ? 0 : Math.max(1, vh / (cam.h * s0));     // a `fit` capture shows its whole width (letterboxed)
  const Z = Math.max(pose.z * drift, zfill) * s0;
  const W = cam.w * Z, H = cam.h * Z;
  const tx = clamp(vw / 2 - pose.fx * Z, vw - W, 0);
  const ty = H <= vh ? (vh - H) / 2 : clamp(vh / 2 - pose.fy * Z, vh - H, 0);
  return (
    <>
    {cam.fit && <div style={{ position: 'absolute', left: 0, top: 0, width: vw, height: vh, background: cam.fit }} />}
    <div style={{ position: 'absolute', left: tx, top: ty, width: W, height: H }}>
      <Img src={staticFile(cam.file)} style={{ width: '100%', height: '100%' }} />
      {cam.hls.filter((h) => t >= h.t).map((h, i) => {
        const p = easeO(cl01((t - h.t) / 0.27));
        return (
          <div key={i} style={{
            position: 'absolute', left: h.x * Z, top: h.y * Z, width: h.w * Z, height: h.h * Z, borderRadius: 8,
            background: 'rgba(255,215,0,.22)', border: '3px solid #ffd700', boxShadow: '0 0 22px rgba(255,215,0,.45)',
            clipPath: `inset(-12px ${(1 - p) * 100}% -12px -12px)`,
          }} />
        );
      })}
    </div>
    </>
  );
};
// torn-paper Halloween frame for R1 (real pixels inside, never recolored)
const TORN = (() => {
  const pts: string[] = []; let seed = 7;
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  const W = 1780, H = 980;
  for (let x = 0; x <= W; x += 22) pts.push(`${x}px ${(rnd() * 12).toFixed(1)}px`);
  for (let y = 0; y <= H; y += 22) pts.push(`${W - rnd() * 12}px ${y}px`);
  for (let x = W; x >= 0; x -= 22) pts.push(`${x}px ${H - rnd() * 14}px`);
  for (let y = H; y >= 0; y -= 22) pts.push(`${rnd() * 12}px ${y}px`);
  return `polygon(${pts.join(',')})`;
})();
const ReceiptView: React.FC<{ b: Block; row: Cover; t: number; frame: number; cut?: string }> = ({ b, row, t, frame, cut }) => {
  const file = row.file!;
  let body: React.ReactNode;
  if (file === CLIP_INSERT.file && (row.state === 'lead-in' || row.state === 'lead-out')) {
    body = <ClipStill last={row.state === 'lead-out'} />;                      // R17 lead-in FIRST frame / lead-out LAST frame
  } else if (file.endsWith('.mp4')) {
    body = cut ? <Img src={staticFile(cut)} style={FILL} /> : <VideoAt file={file} clipFrame={frame - F(row.tIn)} />;
  } else if (row.torn) {
    body = (
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 45%, #1c1210 0%, #090707 75%)' }}>
        <div style={{ position: 'absolute', left: 70, top: 50, width: 1780, height: 980, filter: 'drop-shadow(0 18px 40px rgba(0,0,0,.7)) drop-shadow(0 0 30px rgba(227,35,47,.25))' }}>
          <div style={{ position: 'absolute', inset: 0, clipPath: TORN, overflow: 'hidden', background: '#fff' }}>
            <ReceiptCam cam={camByFile[file]} t={t} t0={b.tIn} t1={b.tOut} vw={1780} vh={980} />
          </div>
        </div>
      </AbsoluteFill>
    );
  } else {
    const rs = b.rows.filter((r) => r.file === file);
    body = <ReceiptCam cam={camByFile[file]} t={t} t0={rs[0].tIn} t1={rs[rs.length - 1].tOut} />;
  }
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0c10', overflow: 'hidden' }}>
      {body}
      {row.hw && !row.torn && <AbsoluteFill style={{ boxShadow: 'inset 0 0 0 8px rgba(18,4,4,.92), inset 0 0 110px rgba(227,35,47,.30)' }} />}
      {row.label && <Chip text={row.label} pos="tl" />}
      {row.note && <Chip text={row.note} pos="br" />}
    </AbsoluteFill>
  );
};
// the R14 + C21 two-card stack (the same man, both dates on screen); C21 slides in front, then the push-in
const StackView: React.FC<{ t: number }> = ({ t }) => {
  const front = t >= 15.7;
  const pin = easeO(cl01((t - 15.7) / 0.3));                          // hand:slide-in 0.30 s
  const push = easeIO(cl01((t - 16.3) / 0.8));                         // push-in onto 'hundreds of thousands'
  const drift = 1 + 0.02 * cl01((t - 13.84) / 6.56);
  // R14 back card: headline + date crop, then the quote crop (real pixels)
  const back = (
    <div style={{ position: 'absolute', left: 90, top: 90, width: 1160, padding: 28, background: '#fff', borderRadius: 14, transform: 'rotate(-2.2deg)', boxShadow: '0 30px 70px rgba(0,0,0,.55)' }}>
      <div style={{ width: 1100, height: 206, overflow: 'hidden', position: 'relative' }}>
        <Img src={staticFile('receipts/R14.png')} style={{ position: 'absolute', width: 3840 * 0.534, left: -700 * 0.534, top: -560 * 0.534 }} />
      </div>
      <div style={{ height: 2, background: '#e3e3e3', margin: '16px 0' }} />
      <div style={{ width: 1100, height: 128, overflow: 'hidden', position: 'relative' }}>
        <Img src={staticFile('receipts/R14.png')} style={{ position: 'absolute', width: 3840 * 0.534, left: -830 * 0.534, top: -2840 * 0.534 }} />
      </div>
    </div>
  );
  const cs = 0.403, cx0 = 540, cy0 = 300;                              // C21 crop origin + scale
  const hl = RECEIPTS['C21'].hls[0];
  const hp = easeO(cl01((t - hl.t) / 0.27));
  const frontCard = front ? (
    <div style={{ position: 'absolute', left: 690 + (1 - pin) * 1400, top: 300, width: 1120, height: 670, background: '#fff', borderRadius: 14, overflow: 'hidden', transform: 'rotate(1.4deg)', boxShadow: '0 40px 90px rgba(0,0,0,.6)' }}>
      <Img src={staticFile('receipts/C21.png')} style={{ position: 'absolute', width: 3840 * cs, left: -cx0 * cs, top: -cy0 * cs }} />
      {t >= hl.t && <div style={{ position: 'absolute', left: (hl.x - cx0) * cs, top: (hl.y - cy0) * cs, width: hl.w * cs, height: hl.h * cs, borderRadius: 4, background: 'rgba(255,215,0,.25)', border: '2px solid #ffd700', clipPath: `inset(-6px ${(1 - hp) * 100}% -6px -6px)` }} />}
    </div>
  ) : null;
  // camera: centre the quote line of the front card (card-local ~ (430, 566)) at zoom 1.85
  const qx = 690 + 430, qy = 300 + 566, Zc = 1 + 0.85 * push;
  const tx = (960 - qx * Zc) * push, ty = (540 - qy * Zc) * push;
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 40% 35%, #161b26 0%, #0a0c10 70%)', overflow: 'hidden' }}>
      <AbsoluteFill style={{ transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${Zc * drift})` }}>
        {back}
        {frontCard}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ containers / diagrams: state PNGs, one spotlight at a time
const LiftRegion: React.FC<{ file: string; box: [number, number, number, number]; a: number; s: number; bg?: string }> = ({ file, box, a, s, bg }) => {
  const [x, y, w, h] = box;
  return (
    <AbsoluteFill style={{ opacity: a }}>
      {/* the card's own local background under the lifted copy (opaque): the scaled copy never ghosts over the
          original. The copy starts at scale 1 exactly over the original, so a lift needs no alpha fade at all. */}
      {bg && <div style={{ position: 'absolute', left: x - 4, top: y - 4, width: w + 8, height: h + 8, borderRadius: 12, background: bg }} />}
      <AbsoluteFill style={{ transformOrigin: `${x + w / 2}px ${y + h / 2}px`, transform: `scale(${s})`, filter: 'drop-shadow(0 10px 26px rgba(0,0,0,.65))' }}>
        <Img src={staticFile(file)} style={{ ...FILL, clipPath: `inset(${y}px ${1920 - x - w}px ${1080 - y - h}px ${x}px round 12px)` }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
const StateView: React.FC<{ b: Block; frame: number; t: number }> = ({ b, frame, t }) => {
  let k = 0;
  for (let j = 0; j < b.rows.length; j++) if (frame >= F(b.rows[j].tIn)) k = j;
  const cur = b.rows[k], prev = k > 0 ? b.rows[k - 1] : null;
  const sf = F(cur.tIn);
  const xf = prev && prev.file !== cur.file ? cl01((frame - sf) / 6) : 1;       // 6-frame state swap
  const push = 1 + 0.025 * cl01((frame - b.f0) / Math.max(1, b.f1 - b.f0));       // §7a: never dead still
  let shake = '';
  if (b.ref === 'new-jobs-chain-broken' && cur.state === 's2' && frame - sf < 4) shake = `translate(${[6, -5, 4, -2][frame - sf]}px, ${[-3, 4, -2, 1][frame - sf]}px)`;
  const liftKey = (r: Cover | null) => (r && r.state && r.state.startsWith('lift:') ? r.state.slice(5) : null);
  const lk = liftKey(cur), pk = liftKey(prev);
  const la = lk ? (pk ? 1 : cl01((frame - sf) / 8)) : 0;           // dim fades in on the first lift, stays on between lifts
  const grow = lk ? easeO(cl01((frame - sf) / 7)) : 0;              // each lift grows 1 -> 1.04 from exactly on top of the original
  const patch = PATCH[b.ref];
  const pulses = PULSES.filter((p) => p.ref === b.ref && t >= p.t && t < p.t + 0.45);
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0c10', overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `${shake} scale(${push})` }}>
        {prev && xf < 1 && <Img src={staticFile(prev.file!)} style={FILL} />}
        <Img src={staticFile(cur.file!)} style={{ ...FILL, opacity: xf }} />
        {patch && (() => {
          const p = cur.state === 'pre' ? 0 : easeIO(cl01((t - patch.t) / patch.d));
          const [x, y, w, h] = patch.box;
          return p < 1 ? <div style={{ position: 'absolute', left: x + w * p, top: y, width: w * (1 - p), height: h, background: patch.color }} /> : null;
        })()}
        {la > 0 && <AbsoluteFill style={{ backgroundColor: 'rgba(4,5,8,.5)', opacity: la }} />}
        {lk && <LiftRegion file={cur.file!} box={LIFT[b.ref][lk]} a={1} s={1 + 0.04 * grow} bg={LIFT_BG[b.ref][lk]} />}
        {pulses.map((p, i) => <LiftRegion key={i} file={cur.file!} box={p.box} a={1} s={1 + (p.s - 1) * Math.sin(Math.PI * cl01((t - p.t) / 0.45))} />)}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ chart routes: every chart cover is a LIVE animated component (§7)
const ChartFor: React.FC<{ c: Cover; t: number }> = ({ c, t }) => {
  if (c.ref === 'H0') return <ChartView id="H0" t={t} />;
  if (c.ref === 'C5-tease') return <ChartView id="C5-tease" t={t} />;
  if (c.ref === 'C11') return <ChartView id="C11" t={t} />;
  if (c.ref === 'C10R') return <ChartView id="C10R" t={t} />;
  if (c.ref === 'horses-card') return <ChartView id="horses-card" t={t} />;
  if (c.ref === 'C2') return <ChartView id="C2" t={t} />;
  if (c.ref === 'figure-bmw-scoreboard') return <ChartView id="figure-bmw-scoreboard" t={t} />;
  if (c.ref === 'C6') return <ChartView id="C6" t={t} />;
  if (c.ref === 'C4-cashiers') return <ChartView id="C4-cashiers" t={t} />;
  if (c.ref === 'C4-taxi') return <ChartView id="C4-taxi" t={t} />;
  if (c.ref === 'C4-warehouse') return <ChartView id="C4-warehouse" t={t} />;
  if (c.ref === 'C4-csr') return <ChartView id="C4-csr" t={t} />;
  if (c.ref === 'C4-roofers') return <ChartView id="C4-roofers" t={t} />;
  if (c.ref === 'C4-truck') return <ChartView id="C4-truck" t={t} />;
  if (c.ref === 'C4-carpenters') return <ChartView id="C4-carpenters" t={t} />;
  if (c.ref === 'C4-electricians') return <ChartView id="C4-electricians" t={t} />;
  if (c.ref === 'C4-plumbers') return <ChartView id="C4-plumbers" t={t} />;
  if (c.ref === 'C5-climb') return <ChartView id="C5-climb" t={t} />;
  if (c.ref === 'C4-programmers') return <ChartView id="C4-programmers" t={t} />;
  if (c.ref === 'C4-radiologists') return <ChartView id={c.state === 'note' ? 'C4-radiologists:note' : 'C4-radiologists'} t={t} />;
  if (c.ref === 'C5-top') return <ChartView id="C5-top" t={t} />;
  if (c.ref === 'C8') return <ChartView id="C8" t={t} />;
  if (c.ref === 'C2-surgeon') return <ChartView id="C2-surgeon" t={t} />;
  if (c.ref === 'C13') return <ChartView id="C13" t={t} />;
  if (c.ref === 'consumption-67') return <ChartView id="consumption-67" t={t} />;
  if (c.ref === 'C16-gates') return <ChartView id="C16-gates" t={t} />;
  if (c.ref === 'early-x402') return <ChartView id="early-x402" t={t} />;
  if (c.ref === 'C16-tao') return <ChartView id="C16-tao" t={t} />;
  if (c.ref === 'home-invasions-1-20') return <ChartView id="home-invasions-1-20" t={t} />;
  if (c.ref === 'money-printer-card') return <ChartView id="money-printer-card" t={t} />;
  if (c.ref === 'C7') return <ChartView id="C7" t={t} />;
  throw new Error(`chart cover without an animated component: ${c.ref}`);
};

// ------------------------------------------------------------------ one cover block at an absolute frame (live layer, engines, cards)
const CoverNode: React.FC<{ b: Block; frame: number; cut?: string }> = ({ b, frame, cut }) => {
  const fr = clamp(frame, b.f0, b.f1 - 1 + b.tail);
  const t = srcT(fr);
  let k = 0;
  for (let j = 0; j < b.rows.length; j++) if (fr >= F(b.rows[j].tIn)) k = j;
  const row = b.rows[k];
  const prog = cl01((fr - b.f0) / Math.max(1, b.f1 - b.f0));
  let body: React.ReactNode;
  switch (b.kind) {
    case 'still': {
      const s = 1 + 0.05 * prog;                                        // gentle push, never a frozen frame
      body = <Img src={staticFile(row.file!)} style={{ ...FILL, transform: `scale(${s})` }} />;
      break;
    }
    case 'vid': {
      const grade: React.CSSProperties = row.hw ? { filter: 'sepia(.32) saturate(.82) contrast(1.1) brightness(.86)' } : {};
      body = cut ? <Img src={staticFile(cut)} style={{ ...FILL, ...grade }} /> : <VideoAt file={row.file!} clipFrame={fr - b.f0} style={grade} />;
      break;
    }
    case 'receipt':
      body = b.ref === 'R14' || b.ref === 'C21' ? <StackView t={t} /> : <ReceiptView b={b} row={row} t={t} frame={fr} cut={cut} />;
      break;
    case 'chart':
      body = <ChartFor c={row} t={t} />;
      break;
    default:
      body = <StateView b={b} frame={fr} t={t} />;
  }
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0c10', overflow: 'hidden' }}>
      {body}
      {row.hw && (b.kind === 'vid' || b.kind === 'still') && <HwGrade strong={b.kind === 'vid'} />}
      {SHOW_TIER_BADGES && row.badge && b.kind !== 'chart' && <Badge tier={row.badge} />}
      {row.illus && <Illustration />}
    </AbsoluteFill>
  );
};
/** live cover node reading the absolute clock */
const LiveCover: React.FC<{ b: Block; cut?: string }> = ({ b, cut }) => <CoverNode b={b} frame={useAbs()} cut={cut} />;

// ------------------------------------------------------------------ the cover track (§4): one Sequence per block, hand ingress
const CoverTrack: React.FC = () => (
  <>
    {BLOCKS.map((b) => {
      const d = Math.max(1, Math.round(b.fxd * FPS));
      return (
        <Sequence key={b.i} from={b.f0} durationInFrames={b.f1 - b.f0 + b.tail}>
          <IngressWrap fx={b.fx} d={d}><LiveCover b={b} /></IngressWrap>
        </Sequence>
      );
    })}
  </>
);
const IngressWrap: React.FC<{ fx: string; d: number; children: React.ReactNode }> = ({ fx, d, children }) => {
  const f = useCurrentFrame();
  const p = easeO(cl01(f / d));
  if (fx === 'xfade-scale') return <AbsoluteFill style={{ opacity: p, transform: `scale(${0.93 + 0.07 * p})` }}>{children}</AbsoluteFill>;   // hand:xfade-scale
  if (fx === 'xfade' || fx === 'fade') return <AbsoluteFill style={{ opacity: p }}>{children}</AbsoluteFill>;                              // hand:xfade / hand:fade
  return <AbsoluteFill>{children}</AbsoluteFill>;                                // lib / face / card / state / cut / slide-in (owned elsewhere)
};

// ------------------------------------------------------------------ face layer (live)
const FaceLive: React.FC<{ n: number }> = ({ n }) => <FaceNode n={n} frame={useAbs()} />;
const FaceLayer: React.FC = () => (
  <>
    {FACES.map((_, i) => (
      <Sequence key={i} from={faceF0(i + 1)} durationInFrames={faceF1(i + 1) - faceF0(i + 1)}>
        <FaceLive n={i + 1} />
      </Sequence>
    ))}
  </>
);

// ------------------------------------------------------------------ library engines: EXACTLY the engine window, swap ON the cut (§6a)
const swapFrameOf = (id: string) => {
  const row = getTransition(id)!;
  const win = framesForRow(row, FPS);
  const p = row.params as any;
  switch (row.engine) {
    case 'GlitchBlocks': return Math.ceil(p.opacityPeak * (win - 1) - 1e-9);
    case 'GlitchTVSatellite': return Math.ceil(p.cut * FPS - 1e-9);
    case 'LightLeaks': case 'MeltRGB': return Math.ceil(p.cut * (win - 1) - 1e-9);
    case 'PerspectiveEase': return Math.ceil(p.outPhase.win[0] * FPS - 1e-6);
    default: throw new Error(`no swap rule for ${row.engine}`);
  }
};
const EngineCover: React.FC<{ b: Block; edge: 'out' | 'in'; cut?: string }> = ({ b, edge, cut }) => {
  const f = useAbs();
  return <CoverNode b={b} frame={edge === 'out' ? Math.min(f, b.f1 - 1) : Math.max(f, b.f0)} cut={cut} />;
};
const EngineFace: React.FC<{ n: number; punch?: number }> = ({ n, punch }) => <FaceNode n={n} frame={useAbs()} punch={punch} />;
const Engines: React.FC = () => (
  <>
    {XFX.map((x, i) => {
      const row = getTransition(x.id);
      if (!row) throw new Error(`unknown library id ${x.id}`);
      const win = framesForRow(row, FPS);
      const from = F(x.tc) - swapFrameOf(x.id) - (x.shift ?? 0);
      let out: () => React.ReactNode, inn: () => React.ReactNode;
      if (x.kind === 'leak') {
        const n = x.face!;
        const jf = F(x.tc);
        const s0 = punchScale(n, jf - 1), s1 = punchScale(n, jf);
        out = () => <EngineFace n={n} punch={s0} />;
        inn = () => <EngineFace n={n} punch={s1} />;
      } else if (x.kind === 'face-in') {
        const ob = blockEndingAt(x.tc)!;
        const cut = CUTFRAME[`${ob.ref}@${x.tc}`];
        out = () => <EngineCover b={ob} edge="out" cut={cut} />;
        inn = () => <EngineFace n={x.face!} />;
      } else if (x.kind === 'face-out') {
        const ib = blockStartingAt(x.tc)!;
        const cut = CUTFRAME[`${ib.ref}@${x.tc}`];
        out = () => <EngineFace n={x.face!} />;
        inn = () => <EngineCover b={ib} edge="in" cut={cut} />;
      } else {
        const ob = blockEndingAt(x.tc)!, ib = blockStartingAt(x.tc)!;
        const oc = CUTFRAME[`${ob.ref}@${x.tc}`], ic = CUTFRAME[`${ib.ref}@${x.tc}`];
        out = () => <EngineCover b={ob} edge="out" cut={oc} />;
        inn = () => <EngineCover b={ib} edge="in" cut={ic} />;
      }
      return (
        <Sequence key={i} from={from} durationInFrames={win}>
          <TransitionClip id={x.id} cutFrame={Math.round(win / 2)} outgoing={out} incoming={inn} sfx={false} />
        </Sequence>
      );
    })}
  </>
);

// ------------------------------------------------------------------ chapter cards: rmn:slide (from-top), one pick for all five (§6)
const ENTER = 12, EXIT = 10;
const CARDS = [
  { t: CARD_T[0], file: 'title-slides/title-CH2.png', lead: 12 },   // rmn:slide THE BRAIN WENT FIRST
  { t: CARD_T[1], file: 'title-slides/title-CH3.png', lead: 12 },   // rmn:slide THEN IT GOT A BODY (Mike: KEPT)
  { t: CARD_T[2], file: 'title-slides/title-CH4.png', lead: 12 },   // rmn:slide THE LIST
  { t: CARD_T[3], file: 'title-slides/title-CH5.png', lead: 12 },   // rmn:slide WHAT IT DOES TO THE ECONOMY
  { t: CARD_T[4], file: 'title-slides/title-CH7.png', lead: 4 },    // rmn:slide HOW TO PROTECT YOURSELF (frozen-split-s2 'can't' lands 8 f before the pause)
].map((c) => {
  const ps = Math.round(cardStart(c.t) * FPS), pe = F(c.t);
  const hold = pe - (ps - c.lead + ENTER);
  const readable = hold / FPS;                                     // fully readable, before the exit push starts
  if (readable < 1.0) throw new Error(`card at ${c.t} readable ${readable.toFixed(2)} s < 1.0 s (Mike 2026-07-25)`);
  return { ...c, ps, pe, hold, readable };
});
const CardScene: React.FC<{ c: typeof CARDS[number] }> = ({ c }) => {
  const ob = blockEndingAt(c.t)!, ib = blockStartingAt(c.t)!;
  const timing = (n: number) => linearTiming({ durationInFrames: n, easing: Easing.out(Easing.cubic) });
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={ENTER}>
        <EngineCover b={ob} edge="out" />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: 'from-top' })} timing={timing(ENTER)} />
      <TransitionSeries.Sequence durationInFrames={ENTER + c.hold + EXIT}>
        <Img src={staticFile(c.file)} style={FILL} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: 'from-top' })} timing={timing(EXIT)} />
      <TransitionSeries.Sequence durationInFrames={EXIT}>
        <EngineCover b={ib} edge="in" />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
const Cards: React.FC = () => (
  <>
    {CARDS.map((c, i) => (
      <Sequence key={i} from={c.ps - c.lead} durationInFrames={ENTER + c.hold + EXIT}>
        <CardScene c={c} />
      </Sequence>
    ))}
  </>
);

// ------------------------------------------------------------------ lower third over F17 (PROJECT-LOG 2026-10-06: the community link rides over the face)
const LT_T0 = 1114.3;
const LowerThird: React.FC = () => {
  const f = useAbs();
  const p = easeO(cl01((f - F(LT_T0)) / 9));
  if (f < F(LT_T0)) return null;
  return (
    <div style={{
      position: 'absolute', left: 80, bottom: 58, display: 'flex', alignItems: 'center', gap: 16, padding: '14px 26px 14px 20px',
      borderRadius: 12, background: 'rgba(10,12,16,.86)', border: '1.5px solid rgba(0,230,138,.55)', boxShadow: '0 12px 34px rgba(0,0,0,.5)',
      transform: `translateX(${(1 - p) * -60}px)`, opacity: p, fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{ width: 6, height: 40, borderRadius: 3, background: 'linear-gradient(180deg,#00e68a,#00c2ff)' }} />
      <div style={{ color: '#e8eaf0', fontWeight: 700, fontSize: 30, letterSpacing: '.12em' }}>LINK IN THE DESCRIPTION</div>
    </div>
  );
};

// ------------------------------------------------------------------ captions (§8): generated data, Montserrat house style, topmost
const CAPS = ZCAPTIONS.map((c) => ({ t: c.t, tf: sh(c.t), h: c.h.replace(/\\/g, '') }));
const Captions: React.FC = () => {
  const frame = useAbs();
  const st = srcT(frame);
  // frame-exact windows: a caption never touches the first frame of the cover after a face (chunk QA 2026-10-07)
  if (!CAPTION_WINDOWS.some(([a, b]) => frame >= F(a) && frame < F(b))) return null;
  const tp = frame / FPS;
  let cur: typeof CAPS[number] | null = null;
  for (const c of CAPS) { if (c.tf <= tp) cur = c; else break; }
  if (!cur) return null;
  const nextT = (CAPS.find((c) => c.tf > cur!.tf) || { tf: Infinity }).tf;
  if (tp >= Math.min(nextT, cur.tf + 1.3)) return null;
  const age = (tp - cur.tf) * FPS;
  const pop = interpolate(age, [0, 4, 9], [0.7, 1.12, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const lifted = st >= LT_T0;
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: lifted ? 170 : 110, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
      <div style={{
        fontFamily: `${MONTSERRAT},'Arial Black','Segoe UI',sans-serif`, fontWeight: 900, fontSize: 84, lineHeight: 1.05,
        textTransform: 'lowercase', color: '#fff', WebkitTextStroke: '12px #000', paintOrder: 'stroke fill',
        transform: `scale(${pop})`, textAlign: 'center', maxWidth: 1500,
      }}>{cur.h}</div>
    </div>
  );
};

// ------------------------------------------------------------------ the R17 CLIP INSERT (draft v2, 2026-10-08): the spliced clip's PICTURE
// Mike 2026-10-08: "splice this clip into our video and transition in and out" (option 1, after 'radiology'). The spine
// PAUSES 10.0 s at source 616.1 (paused 620.6-630.6 s) and its VO track already carries Huang's OWN voice there
// (scripts/bake_clip_insert.py), so the comp lays ONLY the picture: the clip FULL-FRAME from clip 0 for exactly the insert,
// MUTED (never double his voice), hand:fade 0.5 s in and out (TRANSITIONS.md 10:16.1 insert-in / insert-out). The R17 COVERS
// rows hold the clip's FIRST frame before it (lead-in 609.0-616.1) and its LAST frame after it (lead-out 616.1-618.0). The
// burned context caption is in the clip's own pixels. No punch-in here (a cover, not a face).
const CLIP_INSERT = { at: CLIP_T, dur: 10.0, file: 'receipts/R17-huang-radiology-clip.mp4', fade: 0.5 };
const INS_F0 = Math.round(cardStart(CLIP_INSERT.at) * FPS);         // 18618 = paused 620.6 s (the insert's first frame)
const INS_F1 = F(CLIP_INSERT.at);                                    // 18918 = paused 630.6 s (Mike resumes on 'nobody')
const INS_N = Math.round(CLIP_INSERT.dur * FPS);                     // 300 frames = the clip's 10.0 s
const INS_LAST = INS_N - 1;                                          // the clip moment on the insert's last frame (9.967 s, clip frame 249 of 250)
if (INS_F1 - INS_F0 !== INS_N || Math.abs((VIDEO_SECS[CLIP_INSERT.file] ?? 0) - CLIP_INSERT.dur) > 0.02) {
  throw new Error(`R17 insert window ${INS_F0}-${INS_F1} does not match the clip (${VIDEO_SECS[CLIP_INSERT.file]} s)`);
}
/** the clip held on its FIRST frame (lead-in) or its LAST frame (lead-out): a real Freeze, muted */
const ClipStill: React.FC<{ last: boolean }> = ({ last }) => <FrozenMedia file={CLIP_INSERT.file} at={last ? INS_LAST : 0} style={FILL} />;
const ClipInsert: React.FC = () => {
  const k = useAbs() - INS_F0;                                       // 0 .. INS_N-1, = the clip moment (30 fps comp frames)
  const d = Math.round(CLIP_INSERT.fade * FPS);
  const pin = easeO(cl01(k / d));                                    // hand:fade insert-in  (held first frame -> moving clip)
  const pout = easeO(cl01((INS_N - 1 - k) / d));                     // hand:fade insert-out (moving clip -> held last frame)
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0c10', overflow: 'hidden' }}>
      <ClipStill last={k >= INS_N / 2} />
      <AbsoluteFill style={{ opacity: Math.min(pin, pout) }}>
        <FrozenMedia file={CLIP_INSERT.file} at={clamp(k, 0, INS_LAST)} style={FILL} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ on-screen correction (EDIT-PLAN 15:57.1 [TEXT], Mike 2026-10-08)
// He says "minted"; the kaspa.org receipt on screen (C39) says mined. The text "mined" WITH its quotation marks, in the house
// caption block (the Captions style below, verbatim), centred low where captions sit, ON 'minted' (source 957.12), held
// 2.0 s with a 0.15 s fade in and out. A one-off overlay over the C39 receipt (no caption window there), topmost.
const MINED = { t: 957.12, hold: 2.0, fade: 0.15, text: '"mined"' };
const MinedCorrection: React.FC = () => {
  const f = useAbs();
  const f0 = F(MINED.t), f1 = F(MINED.t + MINED.hold);
  if (f < f0 || f >= f1) return null;
  const tl = (f - f0) / FPS;
  const a = Math.min(cl01(tl / MINED.fade), cl01((MINED.hold - tl) / MINED.fade));
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 110, display: 'flex', justifyContent: 'center', pointerEvents: 'none', opacity: a }}>
      <div style={{
        fontFamily: `${MONTSERRAT},'Arial Black','Segoe UI',sans-serif`, fontWeight: 900, fontSize: 84, lineHeight: 1.05,
        textTransform: 'lowercase', color: '#fff', WebkitTextStroke: '12px #000', paintOrder: 'stroke fill',
        textAlign: 'center', maxWidth: 1500,
      }}>{MINED.text}</div>
    </div>
  );
};

// ------------------------------------------------------------------ the composition
// inputProps.captions=false renders the picture WITHOUT the burned caption track (the 16:9-sourced short re-frames spans 9:16 and
// captions them itself; every-job 2026-10-08). Default true = the delivered longform.
export const EveryJob: React.FC<{ captions?: boolean }> = ({ captions = true }) => {
  const frame = useCurrentFrame();
  return (
    <Clock.Provider value={frame}>
      <AbsoluteFill style={{ backgroundColor: '#000' }}>
        <ChartStyle />
        {/* the spine's own VO, the whole video (picture comes from the face layer only) */}
        <Audio src={staticFile('spine.mp4')} />
        <FaceLayer />
        <CoverTrack />
        <Engines />
        {/* R17 clip insert: picture only, muted, exactly the 10.0 s the spine pauses (hand:fade insert-in / insert-out @10:16.1) */}
        <Sequence from={INS_F0} durationInFrames={INS_N}><ClipInsert /></Sequence>
        <Cards />
        <LowerThird />
        {captions && <Captions />}
        <MinedCorrection />
      </AbsoluteFill>
    </Clock.Provider>
  );
};

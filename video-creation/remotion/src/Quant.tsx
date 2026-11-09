// quant (longform-edited, screen-share face mode, 2026-11-05). Built to EDIT-PLAN.md + TRANSITIONS.md section 5 (comp-build.md).
// Every cue is a SOURCE spine time routed through sh() / F(); the pauses table below is the sidecar spine/ALL.h.paused.json.
// Each wired transition carries its plan id in a comment: grep the plan against this file.
//
// FACE_REFRAME_WAIVED: screen-share face mode (Mike, 2026-11-04)
// DIAGRAM_REFS: C1-whole, C1-left-column, C1-left-core, C1-left-treasury, C1-left, C1-quant, C1-overledger, C1-flow, C1-payscript, C1-quantnet, C1-fusion, C1-right, C1-right-labels
// (end declared refs)
// TRANSITIONS_WAIVED: blocks-max-1 (named only as the rejected alternative in the plan's open questions; the pick is hand:film-burn)
import React from 'react';
import { AbsoluteFill, Freeze, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { ENGINES, getTransition } from './transitions/index';
import { TransitionClip } from './transitions/TransitionClip';
import { C5Chart, C6Chart, C7Chart } from './QuantCharts';

export const FPS = 30;
export const SPINE_SECS = 563.333;                                     // the SOURCE spine, spine/ALL.f.enhanced.mp4
export const PAUSE = 1.5;                                              // each title card (the sidecar's pause_s)
export const CARD_T = [53.955, 207.315, 333.3, 394.84, 494.34];
export const INSERTS = [
  { at: 53.955, dur: 1.5 },
  { at: 207.315, dur: 1.5 },
  { at: 235.87, dur: 10.8 },
  { at: 333.3, dur: 1.5 },
  { at: 394.84, dur: 1.5 },
  { at: 494.34, dur: 1.5 },
];
export const DUR = 17451;                                              // the paused spine's own frames (assets/spine.mp4, 581.7 s)

const sh = (t: number) => t + INSERTS.filter((p) => p.at <= t).reduce((a, p) => a + p.dur, 0);   // source -> paused spine secs
const F = (t: number) => Math.round(sh(t) * FPS);                                                 // source secs -> frame
const pauseStartFrame = (at: number) => Math.round((at + INSERTS.filter((p) => p.at < at).reduce((a, p) => a + p.dur, 0)) * FPS);
/** paused spine secs -> source secs, frozen through a pause (the clock of every clip, camera and chart). */
const srcOf = (T: number) => {
  let shift = 0;
  for (const p of INSERTS) {
    const start = p.at + shift;
    if (T < start) return T - shift;
    if (T < start + p.dur) return p.at;
    shift += p.dur;
  }
  return T - shift;
};

// Face reframe: the screen share plays verbatim, webcam + CTA box as recorded, no zoom, no leak, no captions (CUE-SHEET: CAPTIONS: OFF, Mike 2026-11-04).
export const FACE_REFRAME = { scale: 1, x: 0, y: 0 };
export const DECK_AREA = { x: 0, y: 0, w: 1464, h: 1080 };             // the binance OBS geometry (house rule #1b)
const DECK_SCALE = DECK_AREA.w / 1920;                                 // 0.7625
const PAGE_BG = '#F7F9FC';                                             // the container stylesheet's page colour (theme + accent)
const PAPER = '#FFFFFF';                                               // the white page under the full-frame scenes

/** every FACE window of the plan: the deck plate lives here, the white page everywhere else. */
const FACE_WINDOWS: [number, number][] = [[0, 31.767], [177.6, 179.767], [207.267, 210.133], [282.8, 294.9], [352.533, 361.1], [400.4, 406.2], [433.267, 442.3], [461.767, 474.133], [537.967, 544.167]];
const FACE_FRAMES = FACE_WINDOWS.map(([a, b]) => [F(a), F(b)] as const);

type In = 'paper' | 'xfade' | 'fade6' | 'cut' | 'hard' | 'same';
type Cover = {
  tIn: number; tOut: number;
  kind: 'whiteboard' | 'receipt' | 'deck' | 'container' | 'chart';
  ref: string;
  from?: number;     // whiteboard: seconds into the clip at tIn
  state?: string;    // the spotlight state of a deck row
  stage?: string;    // the receipt camera stage
  vis?: number;      // visible start when a card snap lands before tIn: the clip's frame 0 holds until tIn so the drawing stays on its words
  pre?: number;      // frames the row mounts early (under a fade above it)
  in?: In;           // the ingress move
  mo?: string;       // a library MOTION move wrapping the whole slot
  noIn?: boolean;    // no entrance (revealed by the card's exit)
};

// ------------------------------------------------------------------------------------------------ the cover track, event log order
export const COVERS: Cover[] = [
  // CH1
  { tIn: 31.767, tOut: 53.955, kind: 'whiteboard', ref: 'WB12', from: 0, in: 'paper' },            // burn owns the cut; tOut snapped to the T2 pause
  // CH2: T2 at 53.955
  { tIn: 54.02, tOut: 71.3, kind: 'whiteboard', ref: 'WB1', from: 0, vis: 53.955, in: 'cut' },     // first frame after the card = WB1, frame 0 held to 54.02
  { tIn: 71.3, tOut: 95.58, kind: 'whiteboard', ref: 'WB2', from: 0, in: 'paper' },                // hand:paper-sheet 1:11.3
  { tIn: 95.58, tOut: 119.1, kind: 'whiteboard', ref: 'WB3', from: 0, in: 'paper' },               // hand:paper-sheet 1:35.6
  { tIn: 119.1, tOut: 121.76, kind: 'receipt', ref: 'C10-quant-flow', stage: 'a', in: 'xfade' },   // hand:xfade-scale 1:59.1
  { tIn: 121.76, tOut: 151.76, kind: 'whiteboard', ref: 'WB4', from: 0, in: 'paper' },             // hand:paper-sheet 2:01.8
  { tIn: 151.76, tOut: 177.6, kind: 'whiteboard', ref: 'WB5', from: 0, in: 'paper' },              // hand:paper-sheet at the beat's planned 151.76 (the plan row's 2:32.2 is the first word)
  // F2 177.6-179.767
  { tIn: 179.767, tOut: 180.16, kind: 'deck', ref: 'C1-whole', state: 'whole', in: 'cut' },        // burn owns the cut
  { tIn: 180.16, tOut: 182.02, kind: 'container', ref: 'C1-left-column', in: 'fade6' },
  { tIn: 182.02, tOut: 182.92, kind: 'container', ref: 'C1-left-core', in: 'fade6' },
  { tIn: 182.92, tOut: 183.66, kind: 'container', ref: 'C1-left-treasury', in: 'fade6' },
  { tIn: 183.66, tOut: 184.62, kind: 'container', ref: 'C1-left', in: 'fade6' },
  { tIn: 184.62, tOut: 186.06, kind: 'container', ref: 'C1-quant', in: 'fade6' },
  { tIn: 186.06, tOut: 188.04, kind: 'container', ref: 'C1-overledger', in: 'fade6' },
  { tIn: 188.04, tOut: 191.72, kind: 'container', ref: 'C1-flow', in: 'fade6' },
  { tIn: 191.72, tOut: 192.38, kind: 'container', ref: 'C1-payscript', in: 'fade6' },
  { tIn: 192.38, tOut: 195.62, kind: 'container', ref: 'C1-quantnet', in: 'fade6' },
  { tIn: 195.62, tOut: 197.56, kind: 'container', ref: 'C1-fusion', in: 'fade6' },
  { tIn: 197.56, tOut: 201.64, kind: 'receipt', ref: 'C22-fusion', stage: 'a', in: 'cut' },        // the SPIN window owns this cut
  { tIn: 201.64, tOut: 203.78, kind: 'receipt', ref: 'C22-fusion', stage: 'b', in: 'same' },
  { tIn: 203.78, tOut: 205.24, kind: 'container', ref: 'C1-right', in: 'cut' },                    // the MELT window owns this cut
  { tIn: 205.24, tOut: 207.315, kind: 'container', ref: 'C1-right-labels', in: 'fade6' },          // holds into the T3 pause, F3 never flashes before the card
  // CH3: T3 at 207.315, F3 to 210.133
  { tIn: 210.133, tOut: 214.54, kind: 'receipt', ref: 'C20-verdian', stage: 'bio', in: 'cut' },    // burn owns the cut
  { tIn: 214.54, tOut: 229.74, kind: 'whiteboard', ref: 'WB14', from: 0, in: 'paper' },            // hand:paper-sheet 3:34.5
  { tIn: 229.74, tOut: 235.87, kind: 'container', ref: 'CLIP-1-leadin', in: 'xfade' },             // hand:xfade-scale 3:49.7, the clip's first frame
  // CLIP-1 at 235.87, 10.8 s
  { tIn: 235.87, tOut: 240.46, kind: 'container', ref: 'CLIP-1-leadout', pre: 15, in: 'cut' },     // the clip's last frame, mounted under the insert-out fade
  { tIn: 240.46, tOut: 242.3, kind: 'receipt', ref: 'C14-gbtd-a-title', stage: 'a', in: 'xfade' }, // hand:xfade-scale 4:00.5
  { tIn: 242.3, tOut: 244.32, kind: 'receipt', ref: 'C14-gbtd-c-quant', stage: 'a', in: 'cut' },   // a crop cut inside the receipt, no transition row
  { tIn: 244.32, tOut: 252.16, kind: 'receipt', ref: 'C14-gbtd-b-body', stage: 'banks', in: 'cut' },
  { tIn: 252.16, tOut: 254.14, kind: 'receipt', ref: 'C14-gbtd-b-body', stage: 'live', in: 'same' },
  { tIn: 254.14, tOut: 273.56, kind: 'whiteboard', ref: 'WB6', from: 0, in: 'paper' },             // hand:paper-sheet 4:14.1
  { tIn: 273.56, tOut: 280.12, kind: 'receipt', ref: 'R-TCH-JUN-tch', stage: 'a', in: 'xfade' },   // hand:xfade-scale 4:33.6
  { tIn: 280.12, tOut: 282.8, kind: 'receipt', ref: 'R-TCH-JUN-tch', stage: 'b', in: 'cut' },      // crop 2, a CUT on 'and clears'
  // F4 282.8-294.9
  { tIn: 294.9, tOut: 309.9, kind: 'whiteboard', ref: 'WB7', from: 0, in: 'paper' },               // burn owns the cut
  { tIn: 309.9, tOut: 314.66, kind: 'receipt', ref: 'R-ROSALIND-bis', stage: 'a', mo: 'motion-3d-pan-1-down', in: 'xfade' },    // lib:motion-3d-pan-1-down 5:09.9
  { tIn: 314.66, tOut: 319.64, kind: 'receipt', ref: 'C13-boe-lab', stage: 'table', in: 'xfade' }, // hand:xfade-scale 5:14.7
  { tIn: 319.64, tOut: 322.6, kind: 'receipt', ref: 'C13-boe-lab', stage: 'sentence', in: 'same' },
  { tIn: 322.6, tOut: 324.66, kind: 'receipt', ref: 'C15-ecb-annex', stage: 'row', in: 'xfade' },  // hand:xfade-scale 5:22.6
  { tIn: 324.66, tOut: 327.34, kind: 'receipt', ref: 'C15-ecb-annex', stage: 'legend', in: 'same' },
  { tIn: 327.34, tOut: 329.68, kind: 'receipt', ref: 'C16-murex', stage: 'a', in: 'xfade' },       // hand:xfade-scale 5:27.3
  { tIn: 329.68, tOut: 333.3, kind: 'receipt', ref: 'R-DENTSU-dentsu', stage: 'a', mo: 'motion-3d-pan-2-right', in: 'xfade' },  // lib:motion-3d-pan-2-right 5:29.7
  // CH4: T4 at 333.3
  { tIn: 333.46, tOut: 352.533, kind: 'whiteboard', ref: 'WB13', from: 0, vis: 333.3, in: 'cut' }, // first frame after the card = WB13, frame 0 held to 333.46
  // F5 352.533-361.1
  { tIn: 361.1, tOut: 365.5, kind: 'receipt', ref: 'C21-overledger', stage: 'a', in: 'cut' },      // burn owns the cut
  { tIn: 365.5, tOut: 394.84, kind: 'whiteboard', ref: 'WB8', from: 0, in: 'paper' },              // hand:paper-sheet 6:05.5
  // CH5: T5 at 394.84
  { tIn: 394.84, tOut: 398.46, kind: 'deck', ref: 'K2', state: 'rest', in: 'cut' },                // first frame after the card = K2
  { tIn: 398.46, tOut: 399.1, kind: 'container', ref: 'K2-s1', in: 'hard' },
  { tIn: 399.1, tOut: 399.82, kind: 'container', ref: 'K2-s2', in: 'hard' },
  { tIn: 399.82, tOut: 400.4, kind: 'container', ref: 'K2-s3', in: 'hard' },
  // F6 400.4-406.2
  { tIn: 406.2, tOut: 433.267, kind: 'chart', ref: 'C5', in: 'cut' },                              // burn owns the cut, the same line continues
  // F7 433.267-442.3
  { tIn: 442.3, tOut: 461.767, kind: 'chart', ref: 'C6', in: 'cut' },
  // F8 461.767-474.133
  { tIn: 474.133, tOut: 494.34, kind: 'chart', ref: 'C7', in: 'cut' },
  // CH6: T6 at 494.34
  { tIn: 494.56, tOut: 518.42, kind: 'whiteboard', ref: 'WB10', from: 0, vis: 494.34, in: 'cut' }, // first frame after the card = WB10, frame 0 held to 494.56
  // CH7
  { tIn: 518.42, tOut: 537.967, kind: 'whiteboard', ref: 'WB11', from: 0, in: 'paper' },           // hand:paper-sheet 8:38.4
  // F9 537.967-544.167
  { tIn: 544.167, tOut: 546.98, kind: 'deck', ref: 'K3', state: 'rest', in: 'cut' },               // burn owns the cut
  { tIn: 546.98, tOut: 547.8, kind: 'container', ref: 'K3-s1', in: 'hard' },
  { tIn: 547.8, tOut: 549.46, kind: 'container', ref: 'K3-s2', in: 'hard' },
  { tIn: 549.46, tOut: 561.6, kind: 'deck', ref: 'K4', state: 'rest', in: 'xfade' },               // hand:xfade-scale 9:09.5
  { tIn: 561.6, tOut: 563.4, kind: 'container', ref: 'K4-s1', in: 'hard' },                        // to the paused spine's last frame
];

// ------------------------------------------------------------------------------------------------ the deck area of the screen share, COVER-PLAN face_body
export const FACE_BODY: Cover[] = [
  { tIn: 0.0, tOut: 20.6, kind: 'receipt', ref: 'C9', stage: 'fb1' },                // FB1 hero, then the scroll, then the page pan
  { tIn: 20.6, tOut: 31.767, kind: 'deck', ref: 'K1', state: 'items 1 to 4 landing' }, // FB2
  { tIn: 177.6, tOut: 179.767, kind: 'deck', ref: 'C1', state: 'whole' },            // FB3 the rich diagram, shown ONCE
  { tIn: 207.315, tOut: 210.133, kind: 'receipt', ref: 'C20', stage: 'headshot', noIn: true }, // FB4 from the T3 pause: the card's exit reveals it
  { tIn: 282.8, tOut: 294.9, kind: 'receipt', ref: 'C12', stage: 'a' },              // FB5 highlight on 289.74
  { tIn: 352.533, tOut: 361.1, kind: 'deck', ref: 'C4', state: 'count-up' },         // FB6 count-up on the three spoken figures
  { tIn: 400.4, tOut: 406.2, kind: 'chart', ref: 'C5' },                             // FB7 line draw-on, no markers
  { tIn: 433.267, tOut: 442.3, kind: 'chart', ref: 'C6' },                           // FB8 legend + lines through 2026-08
  { tIn: 461.767, tOut: 474.133, kind: 'chart', ref: 'C7' },                         // FB9 s1 draw-on with the two dated labels
  { tIn: 537.967, tOut: 544.167, kind: 'whiteboard', ref: 'WB11', from: 19.547 },    // FB10 the clip's clock runs with the spine
];

// ------------------------------------------------------------------------------------------------ transitions, the plan ids
const BURNS = [   // hand:film-burn on all 17 face edges, ±0.38 s (TRANSITIONS.md section 3)
  31.767, 177.6, 179.767,
  207.315,        // F3's cut-in row at 3:27.3: T3's pause sits 0.05 s inside the window, so this burn peaks on the card's exit, which is what reveals the share
  210.133, 282.8, 294.9, 352.533, 361.1, 400.4, 406.2, 433.267, 442.3, 461.767, 474.133, 537.967, 544.167,
];
const SPIN = { id: 'spin-3d-center-ease-short-t-cw', cut: 197.56 };    // lib:spin-3d-center-ease-short-t-cw 3:17.6 SPIN-newfacet, C1-fusion -> C22-fusion
const MELT = { id: 'melt-rgb-soft-1', cut: 203.78 };                     // lib:melt-rgb-soft-1 3:23.8 MELT-transform, C22-fusion -> C1-right

// rmn:cube in the plan: @remotion/transitions ships NO cube presentation (comp-build section 6, re-verified on 4.0.462), so this is the
// hand-rolled turn, hand:cube-3d: one linear 0.6 s turn that starts BEFORE the pause and holds through it, never cubes out.
const CARD_LEAD_F = 6, CARD_TURN_F = 18;
const CARD_READABLE = (CARD_LEAD_F + PAUSE * FPS - CARD_TURN_F) / FPS;
if (CARD_READABLE < 1.0) throw new Error(`a chapter title must read for at least 1 s, got ${CARD_READABLE}`);
const CARDS = [
  { at: 53.955, file: 'T2' },    // hand:cube-3d 0:54.0 Islands of Money
  { at: 207.315, file: 'T3' },   // hand:cube-3d 3:27.4 Who Uses It
  { at: 333.3, file: 'T4' },     // hand:cube-3d 5:33.5 The Token
  { at: 394.84, file: 'T5' },    // hand:cube-3d 6:34.9 Quant vs The Market
  { at: 494.34, file: 'T6' },    // hand:cube-3d 8:14.6 What's Next
];
const CLIP = { file: 'clip-inserts/CLIP-1-verdian.mp4', at: 235.87, frames: 324 };   // CLIP-1, hand:fade 0.5 s insert-in + insert-out, muted (its voice is in the VO)

// ------------------------------------------------------------------------------------------------ the absolute clock (comp-build section 6a)
const AbsCtx = React.createContext(0);
const useAbs = () => React.useContext(AbsCtx);
const useSrcT = () => srcOf(useAbs() / FPS);
const fill = { width: '100%', height: '100%', objectFit: 'cover' } as const;
const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
const ease = (x: number) => 0.5 - 0.5 * Math.cos(Math.PI * clamp(x, 0, 1));
const settle = (x: number) => Math.sin((Math.PI / 2) * clamp(x, 0, 1));
const ramp = (t: number, a: number, frames: number) => clamp((t - a) / (frames / FPS), 0, 1);

/** one exact frame of a clip: a real Freeze under a zero-offset Sequence (section 6a rule 1), so it is right in ANY nesting. */
const ClipFrame: React.FC<{ file: string; frame: number }> = ({ file, frame }) => (
  <Sequence from={0} layout="none">
    <Freeze frame={frame}>
      <OffthreadVideo src={staticFile(file)} muted style={fill} />
    </Freeze>
  </Sequence>
);

// ------------------------------------------------------------------------------------------------ whiteboard beats
const WB_FRAMES: Record<string, number> = { WB1: 518, WB2: 728, WB3: 706, WB4: 900, WB5: 775, WB6: 583, WB7: 450, WB8: 882, WB10: 716, WB11: 772, WB12: 668, WB13: 572, WB14: 456 };
const WhiteboardNode: React.FC<{ c: Cover }> = ({ c }) => {
  const t = useSrcT();
  const frame = clamp(Math.round((t - c.tIn + (c.from ?? 0)) * FPS), 0, WB_FRAMES[c.ref] - 1);   // frame 0 is the beat's tIn; frozen through a pause
  return <ClipFrame file={`whiteboard/${c.ref}.mp4`} frame={frame} />;
};

// ------------------------------------------------------------------------------------------------ receipts: real pixels, a camera in capture coordinates
type Cam = { x: number; y: number; w: number };                        // the capture rect the frame shows: x, y, width (16:9 height)
type Stage = { file: string; W: number; H: number; a: Cam; b: Cam; move?: number; clip?: [number, number] };   // settling push a -> b over the row; move = an eased hand-over of that many seconds; clip = the only capture rows that air
const STAGES: Record<string, Stage> = {
  'C10-quant-flow:a': { file: 'C10-quant-flow', W: 3840, H: 18000, a: { x: 300, y: 9400, w: 3240 }, b: { x: 370, y: 9430, w: 3100 } },   // crop below the blank band, all three columns whole
  'C22-fusion:a': { file: 'C22-fusion', W: 3840, H: 10000, a: { x: 0, y: 320, w: 3840 }, b: { x: 100, y: 420, w: 3640 } },               // the date + headline
  'C22-fusion:b': { file: 'C22-fusion', W: 3840, H: 10000, a: { x: 100, y: 420, w: 3640 }, b: { x: 240, y: 2350, w: 2720 }, move: 0.7 }, // push to 'It launches connected to 74 networks'
  'C20:headshot': { file: 'C20-verdian', W: 3840, H: 6296, a: { x: 0, y: 0, w: 3840 }, b: { x: 120, y: 68, w: 3600 } },                  // ends above device y2160: the ISO sentence is do-not-air
  'C20-verdian:bio': { file: 'C20-verdian', W: 3840, H: 6296, a: { x: 330, y: 2383, w: 1760 }, b: { x: 355, y: 2400, w: 1700 }, clip: [2650, 3120] },   // a CUT from the headshot, never a scroll; only device y2650-3120 airs (the ISO sentence above is do-not-air)
  'C14-gbtd-a-title:a': { file: 'C14-gbtd-a-title', W: 3810, H: 780, a: { x: 0, y: -680, w: 3810 }, b: { x: 80, y: -636, w: 3650 } },    // the 4.9:1 strip, placed deliberately
  'C14-gbtd-c-quant:a': { file: 'C14-gbtd-c-quant', W: 2470, H: 700, a: { x: 360, y: -240, w: 2100 }, b: { x: 385, y: -215, w: 2050 } },
  'C14-gbtd-b-body:banks': { file: 'C14-gbtd-b-body', W: 2470, H: 1520, a: { x: 360, y: 230, w: 2100 }, b: { x: 372, y: 236, w: 2076 } },
  'C14-gbtd-b-body:live': { file: 'C14-gbtd-b-body', W: 2470, H: 1520, a: { x: 372, y: 236, w: 2076 }, b: { x: 360, y: -40, w: 2100 }, move: 0.6 },
  'R-TCH-JUN-tch:a': { file: 'R-TCH-JUN-tch', W: 3840, H: 6408, a: { x: 500, y: 260, w: 2860 }, b: { x: 560, y: 290, w: 2740 } },
  'R-TCH-JUN-tch:b': { file: 'R-TCH-JUN-tch', W: 3840, H: 6408, a: { x: 500, y: 4640, w: 2860 }, b: { x: 560, y: 4670, w: 2740 } },      // ends above the purple footer
  'C12:a': { file: 'C12-tch-quant', W: 3840, H: 3480, a: { x: 590, y: 240, w: 2660 }, b: { x: 600, y: 250, w: 2640 } },
  'R-ROSALIND-bis:a': { file: 'R-ROSALIND-bis', W: 3840, H: 6778, a: { x: -700, y: 0, w: 3840 }, b: { x: -700, y: 0, w: 3840 } },        // the object, the library pan moves it; offset so Status + Partners ride the sharp centre
  'C13-boe-lab:table': { file: 'C13-boe-lab', W: 3840, H: 12000, a: { x: 280, y: 3620, w: 2700 }, b: { x: 310, y: 3640, w: 2640 } },     // every crop ends above device y5400
  'C13-boe-lab:sentence': { file: 'C13-boe-lab', W: 3840, H: 12000, a: { x: 310, y: 3640, w: 2640 }, b: { x: 560, y: 3170, w: 1800 }, move: 0.7 },
  'C15-ecb-annex:row': { file: 'C15-ecb-annex', W: 3840, H: 3613, a: { x: 300, y: -60, w: 2200 }, b: { x: 330, y: -40, w: 2140 } },
  'C15-ecb-annex:legend': { file: 'C15-ecb-annex', W: 3840, H: 3613, a: { x: 330, y: -40, w: 2140 }, b: { x: 330, y: 2410, w: 2140 }, move: 0.8 },
  'C16-murex:a': { file: 'C16-murex', W: 3840, H: 9022, a: { x: 560, y: 320, w: 2900 }, b: { x: 700, y: 360, w: 2620 } },                // the headline block only
  'R-DENTSU-dentsu:a': { file: 'R-DENTSU-dentsu', W: 3840, H: 8000, a: { x: 240, y: 0, w: 3840 }, b: { x: 240, y: 0, w: 3840 } },    // offset so the headline stays whole through the clipped pan
  'C21-overledger:a': { file: 'C21-overledger', W: 3840, H: 8466, a: { x: 0, y: 900, w: 3840 }, b: { x: 30, y: 915, w: 3780 } },         // the date through the paragraph, ends above device y3192
};
// [HIGHLIGHT]: #ffe14d wiping left to right, in capture coordinates inside the camera (it rides the push), multiply so black text stays black
type Hl = { t: number; x0: number; y0: number; x1: number; y1: number };
const HIGHLIGHTS: Record<string, Hl[]> = {
  'C10-quant-flow': [
    { t: 119.78, x0: 1699, y0: 10786, x1: 2195, y1: 10826 }, { t: 120.1, x0: 1683, y0: 10862, x1: 2209, y1: 10902 }, { t: 120.42, x0: 1686, y0: 10935, x1: 1941, y1: 10968 },
  ],
  'C22-fusion': [{ t: 198.74, x0: 402, y0: 673, x1: 600, y1: 700 }, { t: 202.3, x0: 669, y0: 2856, x1: 905, y1: 2901 }],
  'C20-verdian': [{ t: 213.6, x0: 624, y0: 2697, x1: 1629, y1: 2743 }],
  'C14-gbtd-c-quant': [{ t: 242.3, x0: 1514, y0: 390, x1: 2257, y1: 425 }, { t: 242.72, x0: 403, y0: 450, x1: 629, y1: 485 }],
  'C14-gbtd-b-body': [
    { t: 246.06, x0: 818, y0: 521, x1: 950, y1: 556 }, { t: 246.82, x0: 976, y0: 521, x1: 1122, y1: 556 }, { t: 247.94, x0: 1144, y0: 521, x1: 1505, y1: 556 },
    { t: 248.64, x0: 1530, y0: 521, x1: 1638, y1: 556 }, { t: 249.36, x0: 1663, y0: 521, x1: 1850, y1: 556 }, { t: 250.4, x0: 1874, y0: 521, x1: 2013, y1: 556 },
    { t: 251.26, x0: 2099, y0: 521, x1: 2268, y1: 556 }, { t: 252.4, x0: 403, y0: 42, x1: 715, y1: 77 }, { t: 252.4, x0: 1151, y0: 142, x1: 1665, y1: 177 },
  ],
  'R-TCH-JUN-tch': [{ t: 275.34, x0: 1000, y0: 725, x1: 1780, y1: 753 }, { t: 278.56, x0: 1969, y0: 883, x1: 2380, y1: 911 }, { t: 281.12, x0: 1806, y0: 5476, x1: 2223, y1: 5505 }],
  'C12-tch-quant': [{ t: 289.74, x0: 637, y0: 629, x1: 2194, y1: 657 }],
  'C13-boe-lab': [{ t: 315.72, x0: 760, y0: 4753, x1: 1790, y1: 4781 }, { t: 320.56, x0: 930, y0: 3490, x1: 2007, y1: 3522 }],
  'C15-ecb-annex': [{ t: 322.76, x0: 468, y0: 218, x1: 1445, y1: 278 }],
  'C21-overledger': [{ t: 363.92, x0: 1273, y0: 2842, x1: 1830, y1: 2890 }],
};

const CamImg: React.FC<{ file: string; W: number; H: number; cam: Cam; t: number; clip?: [number, number] }> = ({ file, W, H, cam, t, clip }) => {
  const s = 1920 / cam.w;
  return (
    <AbsoluteFill style={{ background: PAPER, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: '0 0', transform: `scale(${s}) translate(${-cam.x}px, ${-cam.y}px)` }}>
        <Img src={staticFile(`receipts/${file}.png`)} style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, clipPath: clip ? `inset(${clip[0]}px 0 ${H - clip[1]}px 0)` : undefined }} />
        {(HIGHLIGHTS[file] ?? []).filter((h) => t >= h.t).map((h, i) => (
          <div key={i} style={{ position: 'absolute', left: h.x0 - 8, top: h.y0 - 8, height: h.y1 - h.y0 + 18, width: (h.x1 - h.x0 + 16) * ramp(t, h.t, 12), background: '#ffe14d', mixBlendMode: 'multiply' }} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
const ReceiptStage: React.FC<{ c: Cover }> = ({ c }) => {
  const t = useSrcT();
  const st = STAGES[`${c.ref}:${c.stage}`];
  const p = st.move ? ease((t - c.tIn) / st.move) : settle((t - c.tIn) / (c.tOut - c.tIn));
  const cam = { x: st.a.x + (st.b.x - st.a.x) * p, y: st.a.y + (st.b.y - st.a.y) * p, w: st.a.w + (st.b.w - st.a.w) * p };
  return <CamImg file={st.file} W={st.W} H={st.H} cam={cam} t={t} clip={st.clip} />;
};
/** [MOTION] a library camera move wrapping ONE cover for its slot: the engine's clock is set with a Freeze and CLIPPED to the slot, as the plan's rows say
 * (the 5 s pan-2-right's last second walks the headline off the frame, so fitting it would lose the very thing the slot shows). */
const MotionWrap: React.FC<{ c: Cover }> = ({ c }) => {
  const t = useSrcT();
  const row = getTransition(c.mo as string);
  if (!row) throw new Error(`unknown motion id ${c.mo}`);
  const Engine = ENGINES[row.engine] as React.FC<any>;
  const n = clamp(Math.round((t - c.tIn) * FPS), 0, row.durationSeconds * FPS - 1);
  return (
    <Sequence from={0} layout="none">
      <Freeze frame={n}>
        <Engine from={null} to={null} outClip={() => <ReceiptStage c={c} />} durationInFrames={row.durationSeconds * FPS} params={row.params} />
      </Freeze>
    </Sequence>
  );
};
/** FB1, one row of the plan: the hero still, then the real page scrolling (its last frame holds to 'And'), then the slow pan down the rest of the page. */
const C9Body: React.FC = () => {
  const t = useSrcT();
  const heroP = settle(t / 4.74);
  const panP = ease((t - 9.94) / (20.6 - 9.94));
  const scrollFrame = clamp(Math.round((t - 4.74) * FPS), 0, 136);
  const swap = 8;   // plain container swaps inside FB1
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      {t < 4.74 + swap / FPS ? (
        <CamImg file="C9-quant-home" W={3810} H={3120} t={t} cam={{ x: 90 * heroP, y: 50 * heroP, w: 3810 - 180 * heroP }} />
      ) : null}
      {t >= 4.74 && t < 9.94 + swap / FPS ? (
        <AbsoluteFill style={{ opacity: ramp(t, 4.74, swap) }}><ClipFrame file="receipts/C9-quant-home-scroll.mp4" frame={scrollFrame} /></AbsoluteFill>
      ) : null}
      {t >= 9.94 ? (
        <AbsoluteFill style={{ opacity: ramp(t, 9.94, swap) }}><CamImg file="C9-quant-home-b" W={3840} H={11106} t={t} cam={{ x: 0, y: 8938 * panP, w: 3840 }} /></AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------------------------------------ slides: the state PNGs, one state at a time
const K1_STATES: [number, string][] = [[20.6, 'K1'], [23.84, 'K1-s1'], [25.56, 'K1-s2'], [27.48, 'K1-s3'], [30.22, 'K1-s4']];   // hard swaps on the words
const slidePng = (ref: string) => staticFile(ref.startsWith('C1') ? `diagrams/${ref}.png` : `card-slides/${ref}.png`);
const PUSH: Record<string, [number, number]> = { K2: [394.84, 400.4], K3: [544.167, 549.46], K4: [549.46, 563.4] };              // a card is never a dead-still frame
const SlideNode: React.FC<{ refId: string }> = ({ refId }) => {
  const t = useSrcT();
  const span = PUSH[refId.slice(0, 2)];
  const s = span ? 1 + 0.022 * clamp((t - span[0]) / (span[1] - span[0]), 0, 1) : 1;
  return <Img src={slidePng(refId)} style={{ ...fill, position: 'absolute', transform: `scale(${s})`, transformOrigin: '50% 50%' }} />;
};
const K1Body: React.FC = () => {
  const t = useSrcT();
  let cur = K1_STATES[0][1];
  for (const [a, f] of K1_STATES) if (t >= a) cur = f;
  return <SlideNode refId={cur} />;
};
// FB6: the three hero figures count over C4-plate (slide-sources/C4-count.json) and each lit state swaps in as its figure lands. An unlanded figure's box is patched from the plate.
const COUNT_BOX: Record<'price' | 'cap' | 'rank', { x: number; y: number; w: number; h: number }> = {
  price: { x: 261, y: 514, w: 418, h: 91 }, cap: { x: 751, y: 514, w: 418, h: 91 }, rank: { x: 1241, y: 514, w: 418, h: 91 },
};
const countText = (k: 'price' | 'cap' | 'rank', p: number) => {
  if (k === 'price') return `$${(199.08 * p).toFixed(2)}`;
  if (k === 'cap') return `$${(2.9 * p).toFixed(2)}B`;
  return `#${Math.round(34 * p)}`;
};
const CountFigure: React.FC<{ k: 'price' | 'cap' | 'rank'; p: number }> = ({ k, p }) => {
  const b = COUNT_BOX[k];
  return (
    <>
      <div style={{ position: 'absolute', left: b.x, top: b.y, width: b.w, height: b.h, overflow: 'hidden' }}>
        <Img src={staticFile('card-slides/C4-plate.png')} style={{ position: 'absolute', left: -b.x, top: -b.y, width: 1920, height: 1080 }} />
      </div>
      <div style={{ position: 'absolute', left: b.x, top: b.y, width: b.w, height: b.h, lineHeight: `${b.h}px`, fontFamily: "'JetBrains Mono',monospace", fontSize: 84, fontWeight: 600, letterSpacing: -2.52, color: 'rgb(92, 88, 85)', whiteSpace: 'nowrap' }}>
        {countText(k, p)}
      </div>
    </>
  );
};
const C4Body: React.FC = () => {
  const t = useSrcT();
  const count = (a: number, b: number) => settle((t - a) / (b - a));
  const price = count(353.7, 355.14), cap = count(356.2, 357.74), rank = count(359.5, 360.72);
  const png = t >= 360.72 ? 'C4-s3' : t >= 357.74 ? 'C4-s2' : t >= 355.14 ? 'C4-s1' : 'C4-plate';
  return (
    <AbsoluteFill>
      <Img src={staticFile(`card-slides/${png}.png`)} style={{ ...fill, position: 'absolute' }} />
      {t < 355.14 ? <CountFigure k="price" p={price} /> : null}
      {t < 357.74 ? <CountFigure k="cap" p={cap} /> : null}
      {t < 360.72 ? <CountFigure k="rank" p={rank} /> : null}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------------------------------------ one row's element, the same for a cover and a screen-share body
const ChartNode: React.FC<{ c: Cover }> = ({ c }) => {
  const t = useSrcT();
  if (c.ref === 'C5') return <C5Chart t={t} />;
  if (c.ref === 'C6') return <C6Chart t={t} />;
  if (c.ref === 'C7') return <C7Chart t={t} />;
  throw new Error(`no animated chart for ${c.ref}`);
};
const CoverEl: React.FC<{ c: Cover }> = ({ c }) => {
  switch (c.kind) {
    case 'whiteboard': return <WhiteboardNode c={c} />;
    case 'chart': return <ChartNode c={c} />;
    case 'receipt':
      if (c.stage === 'fb1') return <C9Body />;
      return c.mo ? <MotionWrap c={c} /> : <ReceiptStage c={c} />;
    case 'deck':
    case 'container':
      if (c.ref === 'K1') return <K1Body />;
      if (c.ref === 'C4') return <C4Body />;
      if (c.ref === 'C1') return <SlideNode refId="C1-whole" />;
      if (c.ref === 'CLIP-1-leadin') return <ClipFrame file={CLIP.file} frame={0} />;
      if (c.ref === 'CLIP-1-leadout') return <ClipFrame file={CLIP.file} frame={CLIP.frames - 1} />;
      return <SlideNode refId={c.ref} />;
    default: return null;
  }
};
/** the rows on each side of a cut: a receipt has one row per camera stage, so a lookup by ref alone would hand an engine the wrong crop. */
const rowEndingAt = (t: number) => COVERS.find((c) => Math.abs(c.tOut - t) < 0.001) as Cover;
const rowStartingAt = (t: number) => COVERS.find((c) => Math.abs(c.tIn - t) < 0.001) as Cover;
const nodeForEngine = (c: Cover) => <AbsoluteFill style={{ background: PAPER }}><CoverEl c={c} /></AbsoluteFill>;

// ------------------------------------------------------------------------------------------------ the cover track with its quiet moves
const IN_FRAMES: Partial<Record<In, number>> = { paper: 11, xfade: 11, fade6: 6 };
const startFrame = (c: Cover) => F(c.vis ?? c.tIn) - (c.pre ?? 0);
const FACE_STARTS = FACE_BODY.map((r) => r.tIn);
/** frames a row stays mounted past its tOut: under the next row's fade, and 3 past a cover->face cut (the baked spine's face lands up to 2 frames behind sh(), measured). */
const tailFrames = (c: Cover, i: number) => {
  const next = COVERS[i + 1];
  const adj = next && Math.abs((next.vis ?? next.tIn) - c.tOut) < 0.01;
  if (adj && next.in && IN_FRAMES[next.in]) {
    if (next.in === 'paper' && c.kind === 'whiteboard') return 0;    // the sheet goes out over its last 0.3 s, the next comes in on the page
    return IN_FRAMES[next.in] as number;
  }
  if (INSERTS.some((p) => Math.abs(p.at - c.tOut) < 0.001)) return 0;   // a row ending on a pause: the first frame after the pause is the next scene, never this one
  return FACE_STARTS.some((t) => Math.abs(t - c.tOut) < 0.01) ? 3 : 0;
};
const CoverRow: React.FC<{ c: Cover; i: number; dur: number }> = ({ c, i, dur }) => {
  const f = useCurrentFrame() - (c.pre ?? 0);
  const n = IN_FRAMES[c.in ?? 'cut'];
  let opacity = 1, scale = 1;
  if (n) {
    opacity = interpolate(f, [0, n], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    if (c.in === 'paper') scale = interpolate(f, [0, n], [0.97, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });      // hand:paper-sheet
    if (c.in === 'xfade') scale = interpolate(f, [0, n], [0.93, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });      // hand:xfade-scale
  }
  const next = COVERS[i + 1];
  if (c.kind === 'whiteboard' && next && next.in === 'paper' && Math.abs(next.tIn - c.tOut) < 0.01) {
    opacity *= interpolate(f, [dur - 9, dur], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });                    // the sheet out over 0.3 s
  }
  return (
    <AbsoluteFill style={{ opacity, transform: `scale(${scale})`, transformOrigin: '50% 50%', background: PAPER }}>
      <CoverEl c={c} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------------------------------------ the screen-share deck area (comp-build section 4c)
const FaceBodyEl: React.FC<{ c: Cover }> = ({ c }) => {
  const f = useCurrentFrame();                                         // the container entrance: 0.35 s fade + 0.97 -> 1 scale-in
  const a = c.noIn ? 1 : interpolate(f, [0, 11], [0, 1], { extrapolateRight: 'clamp' });
  const s = c.noIn ? 1 : interpolate(f, [0, 11], [0.97, 1], { extrapolateRight: 'clamp' });
  return (
    <div style={{ position: 'absolute', left: DECK_AREA.x, top: DECK_AREA.y, width: DECK_AREA.w, height: DECK_AREA.h,
      overflow: 'hidden', background: PAGE_BG, opacity: a, transform: `scale(${s})`, transformOrigin: '50% 50%' }}>
      <div style={{ position: 'absolute', left: 0, top: (DECK_AREA.h - 1080 * DECK_SCALE) / 2, width: 1920, height: 1080,
        transformOrigin: '0 0', transform: `scale(${DECK_SCALE})`, overflow: 'hidden' }}>
        <CoverEl c={c} />
      </div>
    </div>
  );
};
/** the recording's deck area shows a stale diagram: an opaque page plate keeps it from ever showing under an entrance. Full-frame white under the covers. */
const Plate: React.FC = () => {
  const abs = useAbs();
  const inFace = FACE_FRAMES.some(([a, b]) => abs >= a && abs < b);
  return inFace
    ? <div style={{ position: 'absolute', left: DECK_AREA.x, top: DECK_AREA.y, width: DECK_AREA.w, height: DECK_AREA.h, background: PAGE_BG }} />
    : <AbsoluteFill style={{ background: PAPER }} />;
};

// ------------------------------------------------------------------------------------------------ hand:film-burn, a warm radial flash peaking on the cut, dialed low so the pairs never strobe
const BURN_F = 12;
const FilmBurn: React.FC = () => {
  const f = useCurrentFrame();
  const x = clamp(1 - Math.abs(f - BURN_F) / 11.4, 0, 1);
  const a = x * x * (3 - 2 * x) * 0.62;
  return (
    <AbsoluteFill style={{
      background: `radial-gradient(ellipse 78% 88% at 50% 50%, rgba(255,241,216,${a}) 0%, rgba(255,186,112,${a * 0.92}) 44%, rgba(241,90,34,${a * 0.8}) 82%, rgba(209,74,20,${a * 0.7}) 100%)`,
      pointerEvents: 'none',
    }} />
  );
};

// ------------------------------------------------------------------------------------------------ hand:cube-3d: the card turns in over the outgoing cover, then holds to the end of the pause
const CardTurn: React.FC<{ file: string; outgoing?: Cover }> = ({ file, outgoing }) => {
  const f = useCurrentFrame();
  const p = clamp(f / CARD_TURN_F, 0, 1);
  const card = <Img src={staticFile(`title-slides/${file}.png`)} style={{ ...fill, position: 'absolute', left: 0, top: 0 }} />;
  if (p >= 1) return <AbsoluteFill>{card}</AbsoluteFill>;
  return (
    <AbsoluteFill style={{ background: PAPER, perspective: 2600, overflow: 'hidden' }}>
      {outgoing ? (
        <AbsoluteFill style={{ transformOrigin: '100% 50%', transform: `translateX(${-100 * p}%) rotateY(${-90 * p}deg)`, background: PAPER, overflow: 'hidden' }}>
          <CoverEl c={outgoing} />
        </AbsoluteFill>
      ) : null}
      <AbsoluteFill style={{ transformOrigin: '0% 50%', transform: `translateX(${100 * (1 - p)}%) rotateY(${90 * (1 - p)}deg)`, overflow: 'hidden' }}>
        {card}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------------------------------------ CLIP-1, full frame and muted over its paused window (comp-build section 3d)
const ClipInsert: React.FC = () => {
  const f = useCurrentFrame();
  const fade = 15;   // hand:fade 0.5 s, insert-in + insert-out
  const a = interpolate(f, [0, fade, CLIP.frames - fade, CLIP.frames], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ opacity: a }}><ClipFrame file={CLIP.file} frame={clamp(f, 0, CLIP.frames - 1)} /></AbsoluteFill>;
};

// ------------------------------------------------------------------------------------------------ the composition. No music, no SFX, no watermark: the post-mix owns the audio
const EngineWindow: React.FC<{ id: string; cut: number }> = ({ id, cut }) => {
  const row = getTransition(id);
  if (!row) throw new Error(`unknown transition id ${id}`);
  const win = Math.round(row.durationSeconds * FPS);
  const half = Math.round(win / 2);
  return (
    <Sequence from={F(cut) - half} durationInFrames={win}>
      <TransitionClip id={id} cutFrame={half} sfx={false} outgoing={() => nodeForEngine(rowEndingAt(cut))} incoming={() => nodeForEngine(rowStartingAt(cut))} />
    </Sequence>
  );
};
/** the MELT on this white page: the same engine window, the row's own params plus the opt-in page fill (engines/MeltRGB.tsx), or the frame strobes red and yellow. */
const MeltWindow: React.FC<{ id: string; cut: number }> = ({ id, cut }) => {
  const row = getTransition(id);
  if (!row) throw new Error(`unknown transition id ${id}`);
  const Engine = ENGINES[row.engine] as React.FC<any>;
  const win = Math.round(row.durationSeconds * FPS);
  const outClip = () => nodeForEngine(rowEndingAt(cut));
  const inClip = () => nodeForEngine(rowStartingAt(cut));
  return (
    <Sequence from={F(cut) - Math.round(win / 2)} durationInFrames={win}>
      <Engine from={outClip()} to={inClip()} outClip={outClip} inClip={inClip} durationInFrames={win} params={{ ...(row.params as object), pageFill: [255, 255, 255] }} />
    </Sequence>
  );
};

// CAPTIONS OFF for this video (CUE-SHEET: scope none). The prop exists so the short lane can flip captions per span
// (short_graph s_paint_16x9 requires `captions?: boolean` + `{captions && <Captions />}`, left-behind 2026-11-03).
const Captions: React.FC = () => null;
export const Quant: React.FC<{ captions?: boolean }> = ({ captions = false }) => {
  const abs = useCurrentFrame();
  return (
    <AbsCtx.Provider value={abs}>
      <AbsoluteFill style={{ background: '#000' }}>
        {/* the spine: the VO and the screen share, never cut, no transform (reframe waived) */}
        <OffthreadVideo src={staticFile('spine.mp4')} style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${FACE_REFRAME.scale})` }} />
        {captions && <Captions />}
        <Plate />
        {FACE_BODY.map((c, i) => {
          const next = FACE_BODY[i + 1];
          const tail = next && Math.abs(next.tIn - c.tOut) < 0.01 ? 11 : 0;   // a body change inside one window: the next row's entrance over this one
          return (
            <Sequence key={`fb${i}`} from={F(c.tIn)} durationInFrames={F(c.tOut) - F(c.tIn) + tail}>
              <FaceBodyEl c={c} />
            </Sequence>
          );
        })}
        {COVERS.map((c, i) => {
          const from = startFrame(c);
          const dur = F(c.tOut) - from;
          return (
            <Sequence key={`c${i}`} from={from} durationInFrames={dur + tailFrames(c, i)}>
              <CoverRow c={c} i={i} dur={dur} />
            </Sequence>
          );
        })}
        <Sequence from={pauseStartFrame(CLIP.at)} durationInFrames={CLIP.frames}>
          <ClipInsert />
        </Sequence>
        <EngineWindow {...SPIN} />
        <MeltWindow {...MELT} />
        {CARDS.map((k) => {
          const start = pauseStartFrame(k.at);
          return (
            <Sequence key={k.file} from={start - CARD_LEAD_F} durationInFrames={CARD_LEAD_F + F(k.at) - start}>
              <CardTurn file={k.file} outgoing={COVERS.find((c) => Math.abs(c.tOut - k.at) < 0.001)} />
            </Sequence>
          );
        })}
        {BURNS.map((t) => (
          <Sequence key={`burn${t}`} from={F(t) - BURN_F} durationInFrames={BURN_F * 2 + 1}>
            <FilmBurn />
          </Sequence>
        ))}
      </AbsoluteFill>
    </AbsCtx.Provider>
  );
};

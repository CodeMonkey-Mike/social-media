// whiteboard/beats/LeftBehindWB1.tsx: whiteboard beat WB1 of the longform-edited video `left-behind`
// (brief: media/left-behind/assets/whiteboard/WB1.brief.md; cues: assets/whiteboard/WB1.cues.md).
// "How it plays out inside a company": an office building draws on; the AI tools (a glowing toolbox) slide in through
// the door; part of the team turns to it and picks it up, their output shoots up; the rest stand turned away, working
// the old way, same pay, a fraction of the output; the budget line under everyone gets cut by a pair of scissors and
// the right-hand end falls; a red ring (the chapter accent, the one highlight mark) closes around the group that
// refused: FIRST CUT.
// Canvas = the full frame 1920 x 1080 @30, spine 39.600 to 58.500 s = 18.9 s = 567 frames, no audio; the comp build
// fades it in and out. Pen: paper-pastel. Everything is SVG through rough.js with fixed seeds (no boil, deterministic).
// Round 2 (2026-11-02, after visual-qa): the payoff is TWO Type elements ("first" on the spoken word, "cut" right after)
// stacked to the RIGHT of the ring, where nothing else sits (the one-element label above "same pay" read as a heading
// for the pay arrow and as "firstcut"); the ring is wider and sits higher, its second pass tilts the other way, so
// both strokes clear the bun of the first right-hand figure; the budget line and the scissors moved up 4 / 12 px with
// shorter blades, so the ring bottom clears the fallen line and the blade tips keep >= 50 px from the bottom edge at
// full push-in; the building's right wall moved out 60 px to make room for the label.
// The storyboard is the CUES table below: LOCAL seconds (0 = spine 39.600), each hung on a spoken word of
// `spine/ALL.d.desilenced.medium-words.json`; a thing draws as he names it, never before. Nothing numeric on screen
// (the brief: labels only; DATA.md section 4 guards).
import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont as loadGochi } from '@remotion/google-fonts/GochiHand';
import { loadFont as loadKalam } from '@remotion/google-fonts/Kalam';
import { loadFont as loadRockSalt } from '@remotion/google-fonts/RockSalt';
import { loadFont as loadHandlee } from '@remotion/google-fonts/Handlee';
import { PENS } from '../pen';
import { Person, Type } from '../vocab';
import { BurstArrow, StraightArrow } from '../crypto';
import { Building, CutLine, DashedArrow, Ring, Scissors, Toolbox } from '../office';

const { fontFamily: GOCHI } = loadGochi();
const { fontFamily: KALAM } = loadKalam('normal', { weights: ['400', '700'] });
const { fontFamily: ROCKSALT } = loadRockSalt();
const { fontFamily: HANDLEE } = loadHandlee();
const FONTS: Record<string, string> = { 'Gochi Hand': GOCHI, Kalam: KALAM, 'Rock Salt': ROCKSALT, Handlee: HANDLEE };

export const FPS = 30;
/** 18.9 s x 30 = 567 frames (spine 39.600 to 58.500) */
export const DUR = 567;
export const W = 1920;
export const H = 1080;

// ---- the storyboard: LOCAL seconds (spine seconds minus 39.600), the word each cue hangs on ----
const CUES = {
  building: 1.72,      // "company"          the building outline, windows, the open door draw on
  boxIn: 3.32,         // "come" (in)        the AI toolbox slides in through the door
  boxInDur: 1.0,       //                    ... and lands inside at 4.32
  glow: 4.30,          //                    its gold halo + rays come up as it lands
  team: [5.26, 5.50, 5.74], // "picks them up"  three people turn to the box; the first reaches for it, hand on the box
  jump: 7.20,          // "jumps"            a green burst arrow shoots up beside them
  outputUp: 7.40,      // "jumps"            "output up" types above it
  rest: [8.54, 8.78, 9.02], // "work" (the old way)  three people, turned away from the box
  samePay: 10.38,      // "same"             a flat gold arrow draws over them
  samePayLabel: 10.64, // "salary"           "same pay" types above it
  stub: 11.94,         // "fraction"         a short dashed green stub beside them (vs the tall arrow)
  budget: 13.58,       // "budget"           the gold budget line draws under both groups
  budgetLabel: 13.70,  // "budget"           "budget" types at its left end
  scissors: 13.90,     // "gets"             the scissors pop in, open, over the line
  cut: 14.24,          // "cut"              the blades snap shut
  fall: 14.50,         //                    the right end of the line swings down and dims
  ring: 16.30,         // "goes" (first)     the red ring closes around the right group
  first: 16.76,        // "first"            "first" types to the right of the ring
  cut2: 17.06,         // "first" (done)     "cut" types under it, right after "first" has finished typing
  ring2: 18.44,        // "refused"          the hand circles them a second time
  pushIn: 16.30,       // "goes first"       a gentle 1.04x push-in toward the ringed group holds the finished drawing
  pushInDur: 2.2,
};

// layout: the building and the floor everyone stands on
const BX = 200, BY = 100, BW = 1580, BH = 800, GY = BY + BH; // floor at y 900; the right wall at 1780 leaves room for the payoff label
// the right group: three figures at RX + {0, 105, 210}; the ring around them (its centre, radii) and the label beside it
const RX = 1210, RING = { cx: 1308, cy: 740, rx: 265, ry: 192 }, LBL_X = 1680;
const BOX_X = 330, BOX_Y = 745;                              // the toolbox's landing spot (body top-left)
const CAM_X = 1250, CAM_Y = 700, ZOOM = 1.04;

/** a mirrored group: everything inside faces LEFT instead of right */
const Flip: React.FC<{ x: number; children?: React.ReactNode }> = ({ x, children }) => <g transform={`translate(${2 * x} 0) scale(-1 1)`}>{children}</g>;

export const LeftBehindWB1: React.FC<{ penId?: string }> = ({ penId = 'paper-pastel' }) => {
  const PEN = PENS[penId] ?? PENS['paper-pastel'];
  const FH = FONTS[PEN.fontH], FL = FONTS[PEN.fontL];
  const C = (s: string) => (PEN.caps ? s.toUpperCase() : s);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = frame / fps;                 // local seconds
  const at = (cue: number) => T - cue;   // time since a cue (negative = not yet)

  const zoom = interpolate(T, [CUES.pushIn, CUES.pushIn + CUES.pushInDur], [1, ZOOM], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
  // the toolbox slides in from off-screen left, through the door, and eases to its spot
  const boxX = interpolate(at(CUES.boxIn), [0, CUES.boxInDur], [-300, BOX_X], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const glow = interpolate(at(CUES.glow), [0, 0.8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // the scissors: open when they appear, snap shut on "cut"
  const open = interpolate(at(CUES.cut), [0, 0.18], [24, 3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.quad) });

  const INK = PEN.colorH, L = PEN.colorL, P = PEN.palette;
  const ACCENT = '#ff4d4d'; // the chapter accent: the ONE highlight mark of the beat (the brief)
  const lblW = PEN.charWL, headW = PEN.charWH;

  return (
    <AbsoluteFill style={{ backgroundColor: PEN.bg }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* the paper's ground band starts at the building's floor: the building stands on it */}
        {PEN.floor && <rect x={0} y={GY} width={W} height={H - GY} fill={PEN.floor} />}
        <g filter={PEN.glow ? 'url(#glow)' : undefined} transform={`translate(${CAM_X} ${CAM_Y}) scale(${zoom}) translate(${-CAM_X} ${-CAM_Y})`}>
          {/* ===== scene 1: the company, the AI tools come in ===== */}
          <Building x={BX} y={BY} w={BW} h={BH} t={at(CUES.building)} pen={PEN} seed={1} />
          {at(CUES.boxIn) > 0 && (
            <g transform={`translate(${boxX - BOX_X} 0)`}>
              <Toolbox x={BOX_X} y={BOX_Y} t={at(CUES.boxIn)} pen={PEN} seed={2} label={C('AI tools')} font={FL} glow={glow} />
            </g>
          )}

          {/* ===== scene 2: part of the team picks them up, their output jumps (all three face the box) ===== */}
          <Flip x={600}><Person x={600} gy={GY} t={at(CUES.team[0])} pen={PEN} seed={3} hair="cap" shirt={P.green} tie reach /></Flip>
          <Flip x={705}><Person x={705} gy={GY} t={at(CUES.team[1])} pen={PEN} seed={4} hair="curly" shirt={P.blue} /></Flip>
          <Flip x={810}><Person x={810} gy={GY} t={at(CUES.team[2])} pen={PEN} seed={5} hair="bob" shirt={P.brown} /></Flip>
          <BurstArrow x1={930} y1={640} x2={930} y2={340} t={at(CUES.jump)} pen={PEN} seed={6} color={P.green} thick={26} headLen={66} headWidth={42} />
          <Type x={930} y={300} text={C('output up')} t={at(CUES.outputUp)} cps={20} size={44} font={FL} color={INK} weight="700" charW={lblW} />

          {/* ===== scene 3: the rest work the old way (turned away), same pay, a fraction of the output ===== */}
          <Person x={RX} gy={GY} t={at(CUES.rest[0])} pen={PEN} seed={7} hair="bun" shirt={P.grey} />
          <Person x={RX + 105} gy={GY} t={at(CUES.rest[1])} pen={PEN} seed={8} hair="cap" shirt={P.brown} tie />
          <Person x={RX + 210} gy={GY} t={at(CUES.rest[2])} pen={PEN} seed={9} hair="curly" shirt={P.blue} />
          {/* the flat pay arrow sits 20 px higher than round 1 so the ring (top ~545) keeps clear air under it */}
          <StraightArrow x1={1180} y1={505} x2={1450} y2={505} t={at(CUES.samePay)} pen={PEN} seed={10} color={P.gold} strokeWidth={PEN.inkWidth + 3} head={24} />
          <Type x={1315} y={470} text={C('same pay')} t={at(CUES.samePayLabel)} cps={20} size={44} font={FL} color={INK} weight="700" charW={lblW} />
          {/* the fraction stub: a short dashed green arrow right beside the flat arrowhead (same green as the tall arrow), outside the ring */}
          <DashedArrow x1={1510} y1={565} x2={1510} y2={480} t={at(CUES.stub)} pen={PEN} seed={12} color={P.green} strokeWidth={PEN.inkWidth + 3} head={20} />

          {/* ===== scene 4: the budget gets cut; the lowest output goes first ===== */}
          {/* the line at y 972: the ring's second pass bottoms out at ~942, so ~25 px of clear paper stay between them (round 1 had 9 px after the push-in) */}
          {/* the cut end drops 4 degrees about the far end (x 1600): under the ring (x ~1300) that is ~21 px, well clear of the frame at full zoom */}
          {/* the line is complete (0.6 s) before the blades shut on "cut"; the cut sits at x 975 so the scissors' right finger ring clears the red ring's left edge */}
          <CutLine x1={BOX_X} x2={1600} y={972} cutX={975} t={at(CUES.budget)} cutT={at(CUES.fall)} pen={PEN} seed={14} drop={4} dur={0.6} />
          <Type x={300} y={985} text={C('budget')} t={at(CUES.budgetLabel)} cps={20} size={40} font={FL} color={L} anchor="end" charW={lblW} />
          {/* pivot 62 px above the line, blades 100 (+6) long: the tips reach y ~1016, = ~1029 at full push-in, 51 px off the bottom edge */}
          <Scissors x={975} y={910} len={100} back={52} open={open} tilt={-6} t={at(CUES.scissors)} pen={PEN} seed={16} />
          {/* the ring: wide enough that its top-left arc passes ~20 px above the bun (1184, 596); the second pass tilts +5 so its left side LIFTS off the bun */}
          <Ring cx={RING.cx} cy={RING.cy} rx={RING.rx} ry={RING.ry} t={at(CUES.ring)} t2={at(CUES.ring2)} pen={PEN} seed={18} color={ACCENT} tilt2={5} />
          {/* the payoff: two words, two Type elements, stacked just outside the ring's right side (nothing else lives there) */}
          <Type x={LBL_X} y={745} text={C('first')} t={at(CUES.first)} cps={20} size={64} font={FH} color={INK} weight="700" charW={headW} />
          <Type x={LBL_X} y={815} text={C('cut')} t={at(CUES.cut2)} cps={20} size={64} font={FH} color={INK} weight="700" charW={headW} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

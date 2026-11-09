// whiteboard/beats/LeftBehindWB4.tsx: whiteboard beat WB4 of the longform-edited video `left-behind`
// (brief: media/left-behind/assets/whiteboard/WB4.brief.md; cues: assets/whiteboard/WB4.cues.md).
// "The loop the no-asset side falls into": a faint elliptical guide draws clockwise around the sheet in five arcs with
// five empty stations; a figure with no assets draws on in the middle, "no assets". The stations fill clockwise as he
// names them, each joined to the last by an arrow along the guide: an empty workstation (desk, monitor, empty chair)
// crossed out in red, "job gone"; an open pay envelope with a bill that shrinks (a grey ghost of its old size stays),
// "pays less"; a price tag with a falling zig-zag arrow, "cheap services"; a piggy bank with a dashed ghost coin that
// never drops in, rocking empty, "nothing to invest"; a government cheque (landmark emblem, an EMPTY amount box),
// "UBI check". Payoff: the ONE purple mark of the beat (the CH3 accent) is the last arrow, from the cheque back round
// to the crossed-out desk, closing the loop; a gentle 1.03x push-in holds the finished loop into the cut.
// Canvas = the full frame 1920 x 1080 @30, spine 245.380 to 263.600 s = 18.22 s = 547 frames, no audio; the comp build
// fades it in and out. Pen: paper-pastel. Everything is SVG through rough.js with fixed seeds (no boil, deterministic).
// The storyboard is the CUES table below: LOCAL seconds (0 = spine 245.380), each hung on a spoken word of
// `spine/ALL.d.desilenced.medium-words.json`; a thing draws as he names it, never before. NO numbers on screen (the
// brief): no 1,000 / $1,000 / three years, no dollar amounts (the cheque's amount box holds a squiggle), no "UBI is a
// floor" text.
import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont as loadGochi } from '@remotion/google-fonts/GochiHand';
import { loadFont as loadKalam } from '@remotion/google-fonts/Kalam';
import { loadFont as loadRockSalt } from '@remotion/google-fonts/RockSalt';
import { loadFont as loadHandlee } from '@remotion/google-fonts/Handlee';
import { PENS } from '../pen';
import { Person, Type } from '../vocab';
import { CrossOut, Desk, GovCheck, LoopArc, PayEnvelope, PiggyBank, PriceDrop, ellPt } from '../welfare';

const { fontFamily: GOCHI } = loadGochi();
const { fontFamily: KALAM } = loadKalam('normal', { weights: ['400', '700'] });
const { fontFamily: ROCKSALT } = loadRockSalt();
const { fontFamily: HANDLEE } = loadHandlee();
const FONTS: Record<string, string> = { 'Gochi Hand': GOCHI, Kalam: KALAM, 'Rock Salt': ROCKSALT, Handlee: HANDLEE };

export const FPS = 30;
/** 18.22 s x 30 = 547 frames (spine 245.380 to 263.600) */
export const DUR = 547;
export const W = 1920;
export const H = 1080;

// ---- the storyboard: LOCAL seconds (spine seconds minus 245.380), the word each cue hangs on ----
const CUES = {
  guide: 0.66,        // "loop"          the faint guide draws clockwise in five arcs from the top (1.4 s), five empty stations
  person: 1.04,       // "no"            a figure draws on in the middle (1.2 s)
  noAssets: 1.30,     // "asset"         "no assets" types under it
  desk: 3.58,         // "job"           the workstation draws on at the top: chair, desk, monitor (0.7 s)
  jobGone: 3.84,      // "goes"          "job gone" types under it
  cross: 4.02,        // "goes" (held)   the red cross-out strikes the workstation (0.45 s)
  arc12: 4.88,        // "next"          the arrow from the desk to the next station (0.5 s)
  envelope: 5.36,     // "pays"          the open pay envelope with the bill draws on (0.5 s)
  shrink: 5.86,       // "less" (held)   the envelope shrinks to 0.72, a grey ghost of its old size stays (0.5 s)
  paysLess: 5.66,     // "less"          "pays less" types under it
  arc23: 6.66,        // "Everything"    the arrow on to the next station (0.5 s)
  tag: 7.26,          // "cheaper"       the price tag pops in, its hole, its string loop (0.6 s)
  cheap: 7.40,        // "cheaper"       "cheap services" types under it
  drop: 8.34,         // "AI"            the zig-zag arrow falls beside the tag (0.6 s)
  arc34: 9.64,        // "but"           the arrow on to the next station (0.6 s)
  pig: 11.44,         // "save"          the piggy bank draws on (0.9 s)
  ghost: 12.32,       // "income"        a dashed ghost coin hovers over the slot, its dashed drop stops short
  shake: 13.74,       // "Nothing"       the pig rocks empty, motion marks either side
  nothing: 13.74,     // "Nothing"       "nothing to invest" types under it (done ~14.6, "invest" at 14.72)
  arc45: 15.76,       // "So"            the arrow on to the last station (0.5 s)
  cheque: 16.04,      // "government"    the government cheque draws on (0.8 s)
  ubi: 16.30,         // "government"    "UBI check" types under it
  close: 16.44,       // "steps"         the PURPLE arrow from the cheque back round to the desk closes the loop (0.6 s; lands 17.04)
  pushIn: 16.44,      // "steps"         a gentle 1.03x push-in holds the finished loop
  pushInDur: 1.6,
};

// ---- layout: one ellipse round the sheet, five stations on it clockwise from the top ----
const E = { cx: 960, cy: 560, rx: 640, ry: 340 };
const ANG = [-90, -18, 54, 126, 198];                       // N1 desk, N2 envelope, N3 tag, N4 pig, N5 cheque
const N = ANG.map((a) => ellPt(E.cx, E.cy, E.rx, E.ry, a)); // (960,220) (1569,455) (1338,835) (582,835) (351,455)
const DESK_GY = 300;                                        // the workstation's floor (its monitor top at 108)
const ENV = { cx: 1569, cy: 452 };
const TAG = { cx: 1338, cy: 818 };
const PIG = { cx: 582, cy: 806 };
const CHQ = { cx: 351, cy: 452 };
const PX = 960, PGY = 730;                                  // the figure in the middle
const LBL = 42;                                             // label size (Kalam bold)
// each station's ink box incl. its label [x1, y1, x2, y2]: the links stop short of these
const BOX: [number, number, number, number][] = [
  [785, 100, 1140, 366],     // desk + "job gone"
  [1478, 336, 1662, 578],    // envelope + "pays less"
  [1192, 736, 1484, 958],    // tag + arrow + "cheap services"
  [430, 662, 740, 962],      // pig + ghost coin + "nothing to invest"
  [200, 374, 502, 592],      // cheque + "UBI check"
];
const MARGIN = 22;
const inBox = (p: [number, number], b: [number, number, number, number]) =>
  p[0] > b[0] - MARGIN && p[0] < b[2] + MARGIN && p[1] > b[1] - MARGIN && p[1] < b[3] + MARGIN;
/** the ellipse arc from station i to station j (clockwise), trimmed to leave each station's box */
const link = (i: number, j: number): [number, number] => {
  const a = ANG[i];
  let b = ANG[j];
  if (b <= a) b += 360;
  let a0 = a;
  while (a0 < b && inBox(ellPt(E.cx, E.cy, E.rx, E.ry, a0), BOX[i])) a0 += 0.5;
  let a1 = b;
  while (a1 > a0 && inBox(ellPt(E.cx, E.cy, E.rx, E.ry, a1), BOX[j])) a1 -= 0.5;
  return [a0, a1];
};
const LINKS = [link(0, 1), link(1, 2), link(2, 3), link(3, 4), link(4, 0)];

export const LeftBehindWB4: React.FC<{ penId?: string }> = ({ penId = 'paper-pastel' }) => {
  const PEN = PENS[penId] ?? PENS['paper-pastel'];
  const FL = FONTS[PEN.fontL];
  const C = (s: string) => (PEN.caps ? s.toUpperCase() : s);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = frame / fps;                 // local seconds
  const at = (cue: number) => T - cue;   // time since a cue (negative = not yet)

  const zoom = interpolate(T, [CUES.pushIn, CUES.pushIn + CUES.pushInDur], [1, 1.03], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
  const envK = interpolate(at(CUES.shrink), [0, 0.5], [1, 0.72], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });

  const INK = PEN.colorH, P = PEN.palette;
  const ACCENT = '#8b5cf6'; // the CH3 accent: the ONE highlight mark of the beat (the brief)
  const lblW = PEN.charWL;
  const GUIDE_SEG = 1.4 / 5;
  const arc = (k: number, cue: number, dur: number, seed: number, color?: string, sw?: number, head?: number) => (
    <LoopArc cx={E.cx} cy={E.cy} rx={E.rx} ry={E.ry} a0={LINKS[k][0]} a1={LINKS[k][1]} t={at(cue)} pen={PEN} seed={seed} color={color} dur={dur} strokeWidth={sw} head={head} />
  );

  return (
    <AbsoluteFill style={{ backgroundColor: PEN.bg }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {PEN.floor && <rect x={0} y={1000} width={W} height={H - 1000} fill={PEN.floor} />}
        <g filter={PEN.glow ? 'url(#glow)' : undefined} transform={`translate(${E.cx} ${E.cy}) scale(${zoom}) translate(${-E.cx} ${-E.cy})`}>
          {/* ===== scene 1: the loop, and who is in it ===== */}
          {LINKS.map(([a0, a1], k) => (
            <LoopArc key={k} cx={E.cx} cy={E.cy} rx={E.rx} ry={E.ry} a0={a0} a1={a1} t={at(CUES.guide + k * GUIDE_SEG)} pen={PEN} seed={1 + k * 3}
              color={P.grey} dur={GUIDE_SEG} strokeWidth={3} head={0} roughness={0.5} />
          ))}
          <Person x={PX} gy={PGY} t={at(CUES.person)} pen={PEN} seed={2} hair="cap" shirt={P.grey} dur={1.2} />
          <Type x={PX} y={PGY + 60} text={C('no assets')} t={at(CUES.noAssets)} cps={20} size={LBL} font={FL} color={INK} weight="700" charW={lblW} />

          {/* station 1: the job goes */}
          <Desk cx={960} gy={DESK_GY} t={at(CUES.desk)} pen={PEN} seed={3} />
          <Type x={960} y={DESK_GY + 54} text={C('job gone')} t={at(CUES.jobGone)} cps={20} size={LBL} font={FL} color={INK} weight="700" charW={lblW} />
          <CrossOut x1={818} y1={126} x2={1108} y2={290} t={at(CUES.cross)} pen={PEN} seed={4} />

          {/* ===== scene 2: the next job pays less; everything gets cheaper ===== */}
          {arc(0, CUES.arc12, 0.5, 20)}
          <PayEnvelope cx={ENV.cx} cy={ENV.cy} t={at(CUES.envelope)} pen={PEN} seed={5} k={envK} />
          <Type x={ENV.cx} y={566} text={C('pays less')} t={at(CUES.paysLess)} cps={20} size={LBL} font={FL} color={INK} weight="700" charW={lblW} />
          {arc(1, CUES.arc23, 0.5, 23)}
          <PriceDrop cx={TAG.cx} cy={TAG.cy} t={at(CUES.tag)} pen={PEN} seed={6} dropT={CUES.drop - CUES.tag} />
          <Type x={TAG.cx} y={946} text={C('cheap services')} t={at(CUES.cheap)} cps={20} size={LBL} font={FL} color={INK} weight="700" charW={lblW} />

          {/* ===== scene 3: cheap does not help you save with no income; nothing left to invest ===== */}
          {arc(2, CUES.arc34, 0.6, 26)}
          <PiggyBank cx={PIG.cx} cy={PIG.cy} t={at(CUES.pig)} pen={PEN} seed={7} ghostT={CUES.ghost - CUES.pig} shakeT={CUES.shake - CUES.pig} />
          <Type x={PIG.cx} y={950} text={C('nothing to invest')} t={at(CUES.nothing)} cps={20} size={LBL} font={FL} color={INK} weight="700" charW={lblW} />

          {/* ===== scene 4: the government steps in with a check, and the loop closes (the one purple mark) ===== */}
          {arc(3, CUES.arc45, 0.5, 29)}
          <GovCheck cx={CHQ.cx} cy={CHQ.cy} t={at(CUES.cheque)} pen={PEN} seed={8} />
          <Type x={CHQ.cx} y={580} text={C('UBI check')} t={at(CUES.ubi)} cps={20} size={LBL} font={FL} color={INK} weight="700" charW={lblW} />
          {arc(4, CUES.close, 0.6, 32, ACCENT, PEN.inkWidth + 4, 32)}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

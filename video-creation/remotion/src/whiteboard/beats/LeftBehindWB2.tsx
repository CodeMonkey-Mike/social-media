// whiteboard/beats/LeftBehindWB2.tsx: whiteboard beat WB2 of the longform-edited video `left-behind`
// (brief: media/left-behind/assets/whiteboard/WB2.brief.md; cues: assets/whiteboard/WB2.cues.md).
// "Less pay in a weaker dollar": a wall calendar's pages fly off back to "then"; a recruiter on the phone pitches
// React / Node / JS in a speech bubble; a tall gold bar rises, 170K; the calendar flips forward to "now" and a shorter
// bar rises beside it, 110K; a dollar bill draws to the right and SHRINKS (a grey ghost of its old size stays behind it)
// as "prices +20% since 2022" is written; a dashed inner bar rises inside the 110K bar, 92K in 2022 money, the band
// above it greyed out; the one red mark of the beat (the CH1 accent) is the curved SQUEEZE arrow from the side of the
// 170K bar down through the gap onto the dashed 92K top; the payoff: the sheet's bottom-right corner folds and an
// arrow points off the page, "the other half" (the handoff to the 18-months line).
// Canvas = the full frame 1920 x 1080 @30, spine 61.920 to 86.940 s = 25.02 s = 751 frames, no audio; the comp build
// fades it in and out. Pen: paper-pastel. Everything is SVG through rough.js with fixed seeds (no boil, deterministic).
// No camera push-in: the corner fold sits ON the canvas corner, which any zoom would push out of frame.
// The storyboard is the CUES table below: LOCAL seconds (0 = spine 61.920), each hung on a spoken word of
// `spine/ALL.d.desilenced.medium-words.json`; a thing draws as he names it, never before. Numbers on screen: 170K,
// 110K (DATA.md T3), +20% since 2022, 92K (DATA.md T3b: +19.8 percent Jan 2022 to Sep 2026, $91.8K). Nothing else.
// Round 2 (2026-11-02, after visual-qa): the calendar word no longer crosses the grid, the phone is a handset at the
// ear, the bubble is wider, display-font numbers carry letter-spacing (the 7 fused with the 0), 110K is centred over
// its bar, "in 2022 money" is two lines, the prices group moved right, "squeeze" is set in Kalam (Gochi's z reads as
// a 3), the bill keeps a ghost of its old size, and the payoff fires on "the pay" so it holds before the fade.
import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont as loadGochi } from '@remotion/google-fonts/GochiHand';
import { loadFont as loadKalam } from '@remotion/google-fonts/Kalam';
import { loadFont as loadRockSalt } from '@remotion/google-fonts/RockSalt';
import { loadFont as loadHandlee } from '@remotion/google-fonts/Handlee';
import { PENS } from '../pen';
import { Person, Type } from '../vocab';
import { StraightArrow } from '../crypto';
import { Bill, CornerFold, CurvedArrow, FlipCalendar, RiseBar, SpeechBubble } from '../money';

const { fontFamily: GOCHI } = loadGochi();
const { fontFamily: KALAM } = loadKalam('normal', { weights: ['400', '700'] });
const { fontFamily: ROCKSALT } = loadRockSalt();
const { fontFamily: HANDLEE } = loadHandlee();
const FONTS: Record<string, string> = { 'Gochi Hand': GOCHI, Kalam: KALAM, 'Rock Salt': ROCKSALT, Handlee: HANDLEE };

export const FPS = 30;
/** 25.02 s x 30 = 751 frames (spine 61.920 to 86.940) */
export const DUR = 751;
export const W = 1920;
export const H = 1080;

// ---- the storyboard: LOCAL seconds (spine seconds minus 61.920), the word each cue hangs on ----
const CUES = {
  calendar: 0.08,          // "few"            the wall calendar draws on (0.5 s)
  back: [0.60, 0.82, 1.04], // "ago"            three pages fly off up-left, "then" lands on the page at ~1.3
  recruiter: 1.90,         // "recruiters"     the recruiter draws on, a handset at his ear (1.2 s)
  recruiterLabel: 2.52,    // "pitching"       "recruiter" types under the figure
  bubble: 2.60,            // "pitching"       the speech bubble draws (0.5 s), the words land in it:
  react: 2.84,             // "React"          "React"
  node: 4.08,              // "Node"           "Node"
  js: 5.26,                // "JavaScript"     "JS"
  baseline: 5.84,          // "roles"          the chart's baseline draws left to right on the floor line
  bar170: 7.06,            // "170"            the tall gold bar rises (0.6 s)
  label170: 7.74,          // ",000"           "170K" types above it
  then: 8.38,              // "year"           "then" types under it
  fwd: [8.98, 9.20, 9.42], // "Now"            three pages fly off up-right (the first carries "then" away), "now" lands at ~9.7
  bar110: 10.98,           // "110"            the shorter bar rises beside it (0.6 s)
  label110: 11.30,         // "110" (said)     "110K" types above it
  now: 11.55,              // "110" (done)     "now" types under it
  bill: 12.12,             // "Prices"         the dollar bill draws on to the right (0.7 s)
  prices: 12.12,           // "Prices"         "prices" types above the bill
  pct: 13.40,              // "20"             "+20%" types after it; the bill shrinks to 1/1.2, a grey ghost of its old size stays
  since: 14.56,            // "2022"           "since 2022" types under the first line
  inner: 17.70,            // "92"             the dashed inner bar rises inside the 110K bar; the band above greys
  label92: 18.26,          // ",000"           "92K" types beside the dashed top
  money2022: 18.98,        // "in"             "in 2022" types under it, "money" on the next line as he says "2022"
  squeeze: 22.26,          // "week(er)"       the red curved arrow draws from the 170K bar's side down onto the dashed top
  squeezeWord: 22.56,      // "dollar"         "squeeze" types in red above the arrow
  fold: 23.12,             // "and"            the sheet's bottom-right corner folds up; an arrow draws toward it, off the page (first word of the clause)
  otherHalf: 23.30,        // "and" (end)      "the other half" types above the arrow (done at 23.62 = f709, holds ~1.1 s before the fade)
};

// layout
const GY = 880;                                        // the floor line: the chart baseline and the recruiter's feet
const CAL = { x: 120, y: 110, w: 250, h: 230 };        // the calendar, top-left
const RX = 250;                                        // the recruiter
const BUB = { x: 255, y: 425, w: 360, h: 132 };        // the speech bubble, above-right of his head (3 words; the right border 45 px clear of "JS")
const BAR_W = 170, X170 = 660, X110 = 920;             // the two bars (left edges)
const PX_PER_K = 520 / 170;                            // 170K = 520 px tall; the same scale for 110K and 92K
const H170 = 520, H110 = Math.round(110 * PX_PER_K), H92 = Math.round(91.8 * PX_PER_K); // 520, 337, 281
const LBL_X = 1112;                                    // "92K" + "in 2022 / money", right of the 110K bar
const BILL = { cx: 1600, cy: 790 };                    // the dollar bill, to the right (its group is 240 px clear of "in 2022")
// the squeeze arrow: from the 170K bar's right side, down through the gap between the bars, into the grey band onto the dashed top;
// bowed left so its shaft stays ~30 px clear of the "1" of 110K (measured 18 px with the control point at (900, 470))
const SQ: [[number, number], [number, number], [number, number]] = [[X170 + BAR_W + 8, GY - H170 + 40], [862, 490], [X110 + 30, GY - H92 - 6]];
const FOLD = 190;
// Gochi Hand digits measured 0.54 em wide on the round-1 stills (the pen's 0.41 is the lowercase average); with 0.1 em
// letter-spacing the 7 and the 0 no longer touch
const NUM_W = 0.54, NUM_SP = 0.1;

export const LeftBehindWB2: React.FC<{ penId?: string }> = ({ penId = 'paper-pastel' }) => {
  const PEN = PENS[penId] ?? PENS['paper-pastel'];
  const FH = FONTS[PEN.fontH], FL = FONTS[PEN.fontL];
  const C = (s: string) => (PEN.caps ? s.toUpperCase() : s);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = frame / fps;                 // local seconds
  const at = (cue: number) => T - cue;   // time since a cue (negative = not yet)

  // the bill shrinks to 1 / 1.2 of its size as prices go up 20 percent
  const billK = interpolate(at(CUES.pct), [0, 0.6], [1, 1 / 1.2], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });

  const INK = PEN.colorH, L = PEN.colorL, P = PEN.palette;
  const ACCENT = '#ff4d4d'; // the chapter accent: the ONE highlight mark of the beat (the brief)
  const lblW = PEN.charWL;

  return (
    <AbsoluteFill style={{ backgroundColor: PEN.bg }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {PEN.floor && <rect x={0} y={GY} width={W} height={H - GY} fill={PEN.floor} />}
        <g filter={PEN.glow ? 'url(#glow)' : undefined}>
          {/* ===== scene 1: a few years ago, recruiters pitching React / Node / JS roles at 170K ===== */}
          <FlipCalendar x={CAL.x} y={CAL.y} w={CAL.w} h={CAL.h} t={at(CUES.calendar)} pen={PEN} seed={1} font={FH} dur={0.5}
            phases={[
              { flips: CUES.back.map((f) => f - CUES.calendar), label: C('then'), dir: -1 },
              { flips: CUES.fwd.map((f) => f - CUES.calendar), label: C('now'), dir: 1 },
            ]} />
          <Person x={RX} gy={GY} t={at(CUES.recruiter)} pen={PEN} seed={2} hair="bob" shirt={P.blue} phone="ear" />
          <Type x={RX} y={GY + 56} text={C('recruiter')} t={at(CUES.recruiterLabel)} cps={20} size={40} font={FL} color={L} charW={lblW} />
          {/* the bubble's tail ends at the upper right of his head (head centre (250, 623), r 34), above the handset at the ear (its top is y 611) */}
          <SpeechBubble x={BUB.x} y={BUB.y} w={BUB.w} h={BUB.h} tail={[RX + 42, 594]} t={at(CUES.bubble)} pen={PEN} seed={3}>
            {/* three words, three Type elements on three spoken words; measured bold-Kalam widths at 36 px: 90 / 77 / 37, so the gaps are ~38 px (a real word gap) and "JS" ends 45 px before the border */}
            <Type x={BUB.x + 36} y={BUB.y + 84} text={C('React')} t={at(CUES.react)} cps={20} size={36} font={FL} color={INK} weight="700" anchor="start" charW={lblW} />
            <Type x={BUB.x + 164} y={BUB.y + 84} text={C('Node')} t={at(CUES.node)} cps={20} size={36} font={FL} color={INK} weight="700" anchor="start" charW={lblW} />
            <Type x={BUB.x + 278} y={BUB.y + 84} text={C('JS')} t={at(CUES.js)} cps={20} size={36} font={FL} color={INK} weight="700" anchor="start" charW={lblW} />
          </SpeechBubble>
          <StraightArrow x1={X170 - 50} y1={GY} x2={X110 + BAR_W + 60} y2={GY} t={at(CUES.baseline)} pen={PEN} seed={4} dur={0.5} head={0} strokeWidth={PEN.inkWidth + 0.5} />
          <RiseBar x={X170} baseline={GY} w={BAR_W} h={H170} t={at(CUES.bar170)} pen={PEN} seed={5} />
          <Type x={X170 + BAR_W / 2} y={GY - H170 - 32} text="170K" t={at(CUES.label170)} cps={14} size={72} font={FH} color={INK} weight="700" charW={NUM_W} spacing={NUM_SP} />
          <Type x={X170 + BAR_W / 2} y={GY + 56} text={C('then')} t={at(CUES.then)} cps={20} size={44} font={FL} color={L} charW={lblW} />

          {/* ===== scene 2: now the same roles come in around 110 ===== */}
          <RiseBar x={X110} baseline={GY} w={BAR_W} h={H110} t={at(CUES.bar110)} pen={PEN} seed={6} innerH={H92} innerT={at(CUES.inner)} />
          {/* "110K" centred over its bar like "170K" (baseline 36 px above the bar top) */}
          <Type x={X110 + BAR_W / 2} y={GY - H110 - 36} text="110K" t={at(CUES.label110)} cps={14} size={64} font={FH} color={INK} weight="700" charW={NUM_W} spacing={NUM_SP} />
          <Type x={X110 + BAR_W / 2} y={GY + 56} text={C('now')} t={at(CUES.now)} cps={20} size={44} font={FL} color={L} charW={lblW} />

          {/* ===== scene 3: prices up 20 percent since 2022, so 110 is 92 in 2022 money ===== */}
          <Bill cx={BILL.cx} cy={BILL.cy} t={at(CUES.bill)} pen={PEN} seed={7} font={FH} k={billK} />
          <Type x={BILL.cx - 12} y={645} text={C('prices')} t={at(CUES.prices)} cps={20} size={44} font={FL} color={INK} weight="700" anchor="end" charW={lblW} />
          <Type x={BILL.cx + 12} y={645} text="+20%" t={at(CUES.pct)} cps={16} size={44} font={FL} color={INK} weight="700" anchor="start" charW={lblW} />
          <Type x={BILL.cx} y={692} text={C('since 2022')} t={at(CUES.since)} cps={20} size={36} font={FL} color={L} charW={lblW} />
          {/* "92K" beside the dashed top, "in 2022" / "money" on two lines under it (one line ran into the prices label) */}
          <Type x={LBL_X} y={GY - H92 + 14} text="92K" t={at(CUES.label92)} cps={14} size={64} font={FH} color={INK} weight="700" anchor="start" charW={NUM_W} spacing={NUM_SP} />
          <Type x={LBL_X} y={GY - H92 + 64} text={C('in 2022')} t={at(CUES.money2022)} cps={20} size={38} font={FL} color={L} anchor="start" charW={lblW} />
          <Type x={LBL_X} y={GY - H92 + 108} text={C('money')} t={at(CUES.money2022 + 0.4)} cps={20} size={38} font={FL} color={L} anchor="start" charW={lblW} />

          {/* ===== scene 4: less pay in a weaker dollar (the one red mark), and the pay is only half of it ===== */}
          <CurvedArrow p0={SQ[0]} p1={SQ[1]} p2={SQ[2]} t={at(CUES.squeeze)} pen={PEN} seed={8} color={ACCENT} strokeWidth={PEN.inkWidth + 4} head={32} />
          {/* the label font: Gochi Hand's z draws as a 3 ("squee3e") */}
          <Type x={1000} y={372} text={C('squeeze')} t={at(CUES.squeezeWord)} cps={20} size={54} font={FL} color={ACCENT} weight="700" charW={0.5} />
          <CornerFold x={W} y={H} size={FOLD} t={at(CUES.fold)} pen={PEN} seed={9} />
          <StraightArrow x1={1430} y1={985} x2={1690} y2={985} t={at(CUES.fold)} pen={PEN} seed={10} dur={0.4} strokeWidth={PEN.inkWidth + 2} head={28} />
          <Type x={1560} y={945} text={C('the other half')} t={at(CUES.otherHalf)} cps={44} size={44} font={FL} color={INK} weight="700" charW={lblW} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

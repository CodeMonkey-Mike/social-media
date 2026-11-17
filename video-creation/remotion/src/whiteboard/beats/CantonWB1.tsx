// whiteboard/beats/CantonWB1.tsx: canton (longform-edited) whiteboard beat WB1, CH2 Beat 2
// (brief: longform-edited/media/canton/assets/whiteboard/WB1.brief.md; cues: assets/whiteboard/WB1.cues.md).
// "A fund buys a bond. The bond sits on the registrar's books, the cash on the bank's books, two separate systems. So
// the two sides don't move at the same instant. And that gap is the risk."
// Two tags far apart (the two apps the clip just named: PAYMENTS left, SECURITIES right); a small fund figure thinking
// of a bond; the bond on the registrar's open book (right), the cash on the bank's open book (left); TWO SYSTEMS between
// them; the bond's arrow leaves first and arcs all the way over to the bank's side; the cash's arrow leaves after it and
// is still short of the registrar's side; a clock stands over the stretch it has not covered; that stretch (the lag band
// between the cash arrow's tip and the registrar's book) is hatched in the Canton yellow and named RISK (the beat's one
// highlight; held ~1.6 s before the caller's fade). Round 2 (visual-qa): the two arcs closing into an almond around a
// centred clock read as an EYE; now one arc + one short flat arrow, the clock off-centre, the hatch a band, not a lens.
// Canvas = the full frame 1920 x 1080 @30, 15.86 s (spine 48.360 to 64.220) = 476 frames, no audio. Pen: neon-canton.
// Everything is SVG through rough.js with fixed seeds (no boil, deterministic). No number, no name, no logo, no date
// on screen (the brief allows none); no hub (it is WB2's first mark).
// The storyboard is the CUES table: LOCAL seconds (0 = spine 48.360), each hung on a spoken word of
// spine/ALL.f.enhanced.medium-words.json; a thing draws as he names it, never before.
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont as loadGochi } from '@remotion/google-fonts/GochiHand';
import { loadFont as loadKalam } from '@remotion/google-fonts/Kalam';
import { loadFont as loadRockSalt } from '@remotion/google-fonts/RockSalt';
import { loadFont as loadHandlee } from '@remotion/google-fonts/Handlee';
import { PENS } from '../pen';
import { Person, Type } from '../vocab';
import { BankFacade } from '../bank';
import { CurvedArrow } from '../money';
import { ClockFace, scaledPen } from '../islands';
import { HatchLens, MiniBond, OpenBook, RegistryOffice, Tag, ThoughtCloud, WireCoinStack, openBookGeom, tintPen } from '../canton';
import type { Quad } from '../canton';

const { fontFamily: GOCHI } = loadGochi();
const { fontFamily: KALAM } = loadKalam('normal', { weights: ['400', '700'] });
const { fontFamily: ROCKSALT } = loadRockSalt();
const { fontFamily: HANDLEE } = loadHandlee();
const FONTS: Record<string, string> = { 'Gochi Hand': GOCHI, Kalam: KALAM, 'Rock Salt': ROCKSALT, Handlee: HANDLEE };

export const FPS = 30;
/** 15.860 s x 30 = 475.8: the brief / the compositor's window is 476 frames */
export const DUR = 476;
export const W = 1920;
export const H = 1080;

// ---- the storyboard: LOCAL seconds (spine seconds minus 48.360), the word each cue hangs on ----
const CUES = {
  // scene 1: the two apps, and a fund buying a bond
  tagSec: 0.38,       // "Here's"            the SECURITIES tag draws (right)
  tagPay: 0.84,       // "he" (means)        the PAYMENTS tag draws (left)
  fund: 2.20,         // "fund"              the fund figure draws on, bottom centre; FUND types beside it
  cloud: 2.72,        // "a" (bond)          the thought bubbles + cloud rise from its head
  bondThought: 3.02,  // "bond."             the bond certificate draws inside the cloud
  // scene 2: two books, two systems
  bondPage: 3.72,     // "bond" (the bond sits)   the bond draws where it sits (right)
  registrar: 4.76,    // "registrar's"       the registry office draws under the SECURITIES tag
  bookR: 5.16,        // "books,"            the open book draws under the bond; BOND types under its pedestal
  cash: 6.28,         // "cash"              the coin stack pops where it sits (left)
  bank: 7.00,         // "bank's"            the bank draws under the PAYMENTS tag
  bookL: 7.40,        // "books,"            the open book draws under the coins; CASH types under its pedestal
  twoSystems: 8.02,   // "two" (separate systems)  TWO SYSTEMS types between them (lands on "systems")
  // scene 3: the gap
  bondArrow: 9.90,    // "two" (sides)       the bond's arrow leaves first, arcing over to the bank's side
  cashArrow: 10.58,   // "don't" (move)      the cash's arrow leaves after it and stops short of the registrar's side
  clock: 11.56,       // "same" (instant)    the clock draws between the arrows, over the missing stretch; its hands turn
  hatch: 12.98,       // "gap"               the stretch the cash has not covered is hatched (the yellow highlight)
  risk: 13.68,        // "risk."             RISK types under the hatched gap; complete by ~14.0, held to the fade (15.56)
};

// ---- the layout (1920 x 1080) ----
const GY = 630;                                   // the ground both systems stand on
const BANK = { x: 68, w: 380 };                   // left: the bank (payments); its base inks ~66 px from the left edge
const REG = { x: 1460, w: 380 };                  // right: the registry office (securities); cornice to 1852 = 68 px margin
const BOOK_L = { cx: 570, cy: 490 }, BOOK_R = { cx: 1330, cy: 490 };
// the two arrows: the bond's arcs all the way over (right -> left); the cash's (left -> right) is flat, lower, and
// stops well short of the registrar's book. They share no end point, so nothing closes into a lens.
const ARC_BOND: Quad = [[1218, 450], [950, 268], [694, 450]];
const ARC_CASH: Quad = [[682, 544], [800, 556], [918, 544]];
// the lag band: from the cash arrow's tip to the registrar's book, at the cash arrow's height
const GAP = { x0: 944, x1: 1212, y0: 514, y1: 574 };
const GAP_TOP: Quad = [[GAP.x0, GAP.y0], [(GAP.x0 + GAP.x1) / 2, GAP.y0], [GAP.x1, GAP.y0]];
const GAP_BOT: Quad = [[GAP.x0, GAP.y1], [(GAP.x0 + GAP.x1) / 2, GAP.y1], [GAP.x1, GAP.y1]];
const CLOCK = { cx: 1078, cy: 452, r: 34 };       // over the lag band, under the bond's arc: off the frame's centre
const FUND = { x: 880, gy: 1012, k: 0.66 };

export const CantonWB1: React.FC<{ penId?: string }> = ({ penId = 'neon-canton' }) => {
  const PEN = PENS[penId] ?? PENS['neon-canton'];
  const FH = FONTS[PEN.fontH], FL = FONTS[PEN.fontL];
  const C = (s: string) => (PEN.caps ? s.toUpperCase() : s);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = frame / fps;                 // local seconds
  const at = (cue: number) => T - cue;   // time since a cue (negative = not yet)

  const Pa = PEN.palette, L = PEN.colorL, HI = PEN.colorH;
  const lblW = PEN.charWL, headW = PEN.charWH;
  const SYS = tintPen(PEN, Pa.blue, 'sys');            // both buildings in the pen's "systems" violet
  const SMALL = scaledPen(PEN, FUND.k, 'fund');        // the fund figure, drawn at 0.66 with the page's line weight
  const bL = openBookGeom(BOOK_L.cx, BOOK_L.cy), bR = openBookGeom(BOOK_R.cx, BOOK_R.cy);
  const headY = FUND.gy - 257 * FUND.k;                // the figure's head centre

  return (
    <AbsoluteFill style={{ backgroundColor: PEN.bg }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <g filter={PEN.glow ? 'url(#glow)' : undefined}>
          {/* ===== scene 1: the two apps the clip named, far apart ===== */}
          <Tag cx={1540} cy={112} w={290} t={at(CUES.tagSec)} pen={PEN} seed={1}>
            <Type x={1549} y={125} text={C('securities')} t={at(CUES.tagSec) - 0.12} cps={26} size={36} font={FL} color={L} charW={lblW} />
          </Tag>
          <Tag cx={360} cy={112} w={260} t={at(CUES.tagPay)} pen={PEN} seed={2}>
            <Type x={352} y={125} text={C('payments')} t={at(CUES.tagPay) - 0.12} cps={26} size={36} font={FL} color={L} charW={lblW} />
          </Tag>

          {/* a fund buys a bond: the figure bottom centre, the bond in its thought cloud */}
          <g transform={`translate(${FUND.x} ${FUND.gy}) scale(${FUND.k}) translate(${-FUND.x} ${-FUND.gy})`}>
            <Person x={FUND.x} gy={FUND.gy} t={at(CUES.fund)} pen={SMALL} seed={3} hair="cap" shirt={Pa.brown} tie dur={0.9} shadow="feet" />
          </g>
          <Type x={756} y={958} text={C('fund')} t={at(CUES.fund) - 0.15} cps={18} size={36} font={FL} color={L} charW={lblW} />
          <ThoughtCloud cx={1085} cy={896} w={236} h={136} from={[FUND.x + 30, headY - 14]} t={at(CUES.cloud)} pen={PEN} seed={4} dur={0.6}>
            <MiniBond cx={1085} cy={896} w={124} t={at(CUES.bondThought)} pen={PEN} seed={5} dur={0.6} />
          </ThoughtCloud>

          {/* ===== scene 2 (right): the bond sits on the registrar's books ===== */}
          <RegistryOffice x={REG.x} gy={GY} w={REG.w} t={at(CUES.registrar)} pen={PEN} seed={6} dur={0.9} />
          <OpenBook cx={BOOK_R.cx} cy={BOOK_R.cy} baseY={GY} rules="right" t={at(CUES.bookR)} pen={PEN} seed={7} />
          <MiniBond cx={bR.pageL.cx + 2} cy={bR.pageL.cy + 4} w={66} t={at(CUES.bondPage)} pen={PEN} seed={8} dur={0.5} />
          <Type x={BOOK_R.cx - 10} y={GY + 62} text={C('bond')} t={at(CUES.bookR) - 0.3} cps={18} size={40} font={FL} color={L} charW={lblW} />

          {/* ===== scene 2 (left): the cash on the bank's books ===== */}
          <BankFacade x={BANK.x} gy={GY} w={BANK.w} colH={150} pedH={80} colW={26} t={at(CUES.bank)} pen={SYS} seed={9} dur={0.9} />
          <OpenBook cx={BOOK_L.cx} cy={BOOK_L.cy} baseY={GY} rules="left" t={at(CUES.bookL)} pen={PEN} seed={10} />
          <WireCoinStack cx={bL.pageR.cx - 2} baseY={bL.pageR.foot - 2} n={3} t={at(CUES.cash)} pen={PEN} seed={11} color={Pa.brown} />
          <Type x={BOOK_L.cx - 7} y={GY + 62} text={C('cash')} t={at(CUES.bookL) - 0.3} cps={18} size={40} font={FL} color={L} charW={lblW} />

          {/* two separate systems */}
          <Type x={949} y={258} text={C('two systems')} t={at(CUES.twoSystems)} cps={13} size={44} font={FL} color={L} charW={lblW} />

          {/* ===== scene 3: the two sides do not move at the same instant ===== */}
          {/* the hatch first (under the arrows and the clock in paint order): only the lag band, tip to book */}
          <HatchLens upper={GAP_TOP} lower={GAP_BOT} x0={GAP.x0} x1={GAP.x1} inset={0} gap={24}
            t={at(CUES.hatch)} pen={PEN} seed={12} dur={0.65} color={HI} />
          <CurvedArrow p0={ARC_BOND[0]} p1={ARC_BOND[1]} p2={ARC_BOND[2]} t={at(CUES.bondArrow)} pen={PEN} seed={13} dur={0.75} head={30} sequential />
          <CurvedArrow p0={ARC_CASH[0]} p1={ARC_CASH[1]} p2={ARC_CASH[2]} t={at(CUES.cashArrow)} pen={PEN} seed={15} dur={0.6} head={30} sequential />
          <ClockFace cx={CLOCK.cx} cy={CLOCK.cy} r={CLOCK.r} t={at(CUES.clock)} spinT={Math.max(0, at(CUES.clock) - 0.4) * 0.1} pen={PEN} seed={17} />

          {/* and that gap is the risk */}
          <Type x={(GAP.x0 + GAP.x1) / 2 + 18} y={672} text={C('risk')} t={at(CUES.risk)} cps={14} size={62} font={FH} color={HI} charW={headW} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

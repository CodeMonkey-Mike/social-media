// whiteboard/beats/CantonWB3.tsx: canton (longform-edited) whiteboard beat WB3, CH2 Beat 4
// (brief: longform-edited/media/canton/assets/whiteboard/WB3.brief.md; cues: assets/whiteboard/WB3.cues.md).
// "And this is the part that Canton leads with, privacy. In that same trade, the bank only sees the cash side. The
// registrar only sees the bond side and the operators running the network only see the limited metadata."
// Frame 0 is WB2's FINISHED drawing (the same components, the same seeds, fully drawn). WB2's payoff (BOTH, OR NOTHING)
// wipes off the middle the way WB2 wiped WB1's RISK; a padlock closes on the hub's ring on "privacy" (the Canton
// yellow: the beat's ONE highlight); a view pane draws over the bank, [cash | bond], the bond cell hatched out and its
// bond ghosted, SEES CASH beside it; the same pane over the registrar with the cash cell hatched out, SEES BOND; a small
// operator draws under the hub holding a sealed envelope, METADATA ONLY under it. Three views of one trade.
// Canvas = the full frame 1920 x 1080 @30, 15.05 s (spine 85.600 to 100.650) = 452 frames, no audio. Pen: neon-canton.
// Everything is SVG through rough.js with fixed seeds (no boil, deterministic). On screen: words only, no new number
// (WB2's order tags 1 and 2 are carried); never "everything is private"; no eye on the hub; no names, no amounts.
// The storyboard is the CUES table: LOCAL seconds (0 = spine 85.600), each hung on a spoken word of
// spine/ALL.f.enhanced.medium-words.json. Local 14.60 onward is under Mike's face (FACE 3): nothing draws there.
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont as loadGochi } from '@remotion/google-fonts/GochiHand';
import { loadFont as loadKalam } from '@remotion/google-fonts/Kalam';
import { loadFont as loadRockSalt } from '@remotion/google-fonts/RockSalt';
import { loadFont as loadHandlee } from '@remotion/google-fonts/Handlee';
import { PENS } from '../pen';
import { Sketch, prog, easeOut } from '../Sketch';
import { Person, Type } from '../vocab';
import { BankFacade } from '../bank';
import { scaledPen } from '../islands';
import { CheckBadge } from '../layer';
import { LegArrow } from '../sync';
import { Padlock } from '../settlement';
import { MiniBond, NodeBox, OpenBook, OrderTag, RegistryOffice, SealedEnvelope, SyncHub, Tag, ThoughtCloud, ViewPane, WireCoinStack, openBookGeom, tintPen, viewPaneGeom } from '../canton';
import type { Quad } from '../canton';

const { fontFamily: GOCHI } = loadGochi();
const { fontFamily: KALAM } = loadKalam('normal', { weights: ['400', '700'] });
const { fontFamily: ROCKSALT } = loadRockSalt();
const { fontFamily: HANDLEE } = loadHandlee();
const FONTS: Record<string, string> = { 'Gochi Hand': GOCHI, Kalam: KALAM, 'Rock Salt': ROCKSALT, Handlee: HANDLEE };

export const FPS = 30;
/** 15.050 s x 30 = 451.5: the brief / the compositor's window is 452 frames */
export const DUR = 452;
export const W = 1920;
export const H = 1080;

// ---- the storyboard: LOCAL seconds (spine seconds minus 85.600), the word each cue hangs on ----
const CUES = {
  // scene 1: privacy
  wipe: 1.62,         // "Canton"            WB2's BOTH, OR NOTHING wipes off the middle (it makes room; nothing new draws)
  lock: 3.00,         // "privacy."          a padlock closes on the hub's ring, in the Canton yellow
  // scene 2: the bank's view
  paneL: 5.96,        // "bank"              the view pane draws over the bank (frame, tail, divider)
  hideL: 6.16,        // "only"              the bond cell: a ghosted bond, hatched out
  seesL: 6.54,        // "sees"              SEES types beside the pane
  cash: 7.10,         // "cash"              the coin stack pops in the cash cell; CASH types
  // scene 3: the registrar's view
  paneR: 8.56,        // "registrar"         the same pane draws over the registry office
  hideR: 8.98,        // "only"              the cash cell: a ghosted coin stack, hatched out
  seesR: 9.32,        // "sees"              SEES types beside the pane
  bond: 9.82,         // "bond"              the bond draws in the bond cell; BOND types
  // scene 4: the operators' view
  oper: 11.40,        // "operators"         a small operator draws under the hub, one arm out
  env: 12.12,         // "the" (network)     the envelope draws in the operator's hand
  seal: 12.40,        // "network"           the wax seal pops on its flap
  meta: 12.66,        // "only"              METADATA types under the pair
  only: 13.06,        // "see"               ONLY types after it (complete at 13.26; held 1.34 s to the face cut at 14.60)
};

// ---- WB1 / WB2's layout, unchanged (1920 x 1080) ----
const GY = 630;
const BANK = { x: 68, w: 380 };
const REG = { x: 1460, w: 380 };
const BOOK_L = { cx: 570, cy: 490 }, BOOK_R = { cx: 1330, cy: 490 };
const FUND = { x: 880, gy: 1012, k: 0.66 };
const DONE = 99;
const CX = 950;
const HUB = { cx: CX, cy: 244, r: 76 };
const HUB_LBL = { x1: 713, x2: 880 };
const IN_L: Quad = [[625, 428], [640, 300], [880, 291]];
const OUT_L: Quad = [[866, 230], [512, 214], [520, 424]];
const mirror = (q: Quad): Quad => q.map(([x, y]) => [2 * CX - x, y]) as Quad;
const IN_R = mirror(IN_L), OUT_R = mirror(OUT_L);
const TAG1 = { cx: 748, cy: 372 }, TAG2 = { cx: 2 * CX - 748, cy: 372 };
const NODE = { w: 130, h: 92, y: 690 };
const NODE_L = { x: 100 }, NODE_R = { x: 1920 - 100 - NODE.w - 2 };
const APP = { w: 180, h: 56, cy: NODE.y + NODE.h / 2 };
const APP_L = { cx: NODE_L.x + NODE.w + 28 + APP.w / 2 }, APP_R = { cx: NODE_R.x - 28 - APP.w / 2 };

// ---- WB3's layout ----
const LOCK = { cx: CX, cy: 354, w: 54, h: 42 };                    // its shackle loops the hub ring's lowest point (y 320)
const PANE = { w: 230, h: 92, y: 172 };                            // top 172: ~26 px of ink air under WB2's pills (bottom stays 264)
const PANE_L = { x: 70, tailX: 214, tip: [238, 284] as [number, number] };          // the tail points at the bank's pediment
const PANE_R = { x: 1920 - 70 - PANE.w, tailX: 1752, tip: [1752, 350] as [number, number] };   // at the registry roof, right of its sign
const LBL_Y = 231;                                                // SEES CASH / SEES BOND baseline, beside each pane
const OPER = { x: 876, gy: 596, k: 0.62 };
const ENV = { cx: 1005, cy: 506, w: 124, h: 82 };
const META_Y = 668;

export const CantonWB3: React.FC<{ penId?: string }> = ({ penId = 'neon-canton' }) => {
  const PEN = PENS[penId] ?? PENS['neon-canton'];
  const FH = FONTS[PEN.fontH], FL = FONTS[PEN.fontL];
  const C = (s: string) => (PEN.caps ? s.toUpperCase() : s);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = frame / fps;                 // local seconds
  const at = (cue: number) => T - cue;   // time since a cue (negative = not yet)

  const Pa = PEN.palette, L = PEN.colorL, HI = PEN.colorH;
  const lblW = PEN.charWL;
  const SYS = tintPen(PEN, Pa.blue, 'sys');
  const SMALL = scaledPen(PEN, FUND.k, 'fund');
  const OPEN = scaledPen(PEN, OPER.k, 'oper');
  const GHOST = tintPen(PEN, Pa.grey, 'ghost');
  const KEYPEN = tintPen(PEN, HI, 'hi');
  const bL = openBookGeom(BOOK_L.cx, BOOK_L.cy), bR = openBookGeom(BOOK_R.cx, BOOK_R.cy);
  const headY = FUND.gy - 257 * FUND.k;
  const gL = viewPaneGeom(PANE_L.x, PANE.y, PANE.w, PANE.h), gR = viewPaneGeom(PANE_R.x, PANE.y, PANE.w, PANE.h);
  const wipeP = easeOut(prog(at(CUES.wipe), 0, 0.45));
  const coinBase = PANE.y + PANE.h / 2 + 27;

  const node = (x: number, seed: number) => {
    const cx = x + NODE.w / 2;
    return (
      <g>
        <Sketch pen={PEN} seed={seed * 10 + 9} shape={{ kind: 'line', x1: cx, y1: GY + 10, x2: cx, y2: NODE.y - 3 }} stroke={Pa.blue} roughness={0.5} />
        <NodeBox x={x} y={NODE.y} w={NODE.w} h={NODE.h} t={DONE} pen={PEN} seed={seed} />
        <Type x={cx} y={NODE.y + NODE.h + 40} text={C('node')} t={DONE} cps={18} size={30} font={FL} color={L} charW={lblW} />
      </g>
    );
  };
  const appTag = (cx: number, wireX: [number, number], seed: number) => (
    <g>
      <Sketch pen={PEN} seed={seed * 10 + 9} shape={{ kind: 'line', x1: wireX[0], y1: APP.cy, x2: wireX[1], y2: APP.cy }} stroke={Pa.blue} roughness={0.4} />
      <Tag cx={cx} cy={APP.cy} w={APP.w} h={APP.h} t={DONE} pen={PEN} seed={seed}>
        <Type x={cx + 19} y={APP.cy + 11} text="app" t={DONE} cps={18} size={34} font={FL} color={L} anchor="start" />
        <Type x={cx - 68} y={APP.cy + 11} text="Daml" t={DONE} cps={16} size={34} font={FL} color={L} anchor="start" />
      </Tag>
    </g>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: PEN.bg }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* WB2's payoff is cleared left to right */}
          <clipPath id="wb3-wipe"><rect x={680 + 560 * wipeP} y={420} width={560} height={230} /></clipPath>
        </defs>
        <g filter={PEN.glow ? 'url(#glow)' : undefined}>
          {/* ===== WB2's finished drawing (frame 0), same components and seeds ===== */}
          <Tag cx={1540} cy={112} w={290} t={DONE} pen={PEN} seed={1}>
            <Type x={1549} y={125} text={C('securities')} t={DONE} cps={26} size={36} font={FL} color={L} charW={lblW} />
          </Tag>
          <Tag cx={360} cy={112} w={260} t={DONE} pen={PEN} seed={2}>
            <Type x={352} y={125} text={C('payments')} t={DONE} cps={26} size={36} font={FL} color={L} charW={lblW} />
          </Tag>
          <g transform={`translate(${FUND.x} ${FUND.gy}) scale(${FUND.k}) translate(${-FUND.x} ${-FUND.gy})`}>
            <Person x={FUND.x} gy={FUND.gy} t={DONE} pen={SMALL} seed={3} hair="cap" shirt={Pa.brown} tie dur={0.9} shadow="feet" />
          </g>
          <Type x={756} y={958} text={C('fund')} t={DONE} cps={18} size={36} font={FL} color={L} charW={lblW} />
          <ThoughtCloud cx={1085} cy={896} w={236} h={136} from={[FUND.x + 30, headY - 14]} t={DONE} pen={PEN} seed={4} dur={0.6}>
            <MiniBond cx={1085} cy={896} w={124} t={DONE} pen={PEN} seed={5} dur={0.6} />
          </ThoughtCloud>
          <RegistryOffice x={REG.x} gy={GY} w={REG.w} t={DONE} pen={PEN} seed={6} dur={0.9} />
          <OpenBook cx={BOOK_R.cx} cy={BOOK_R.cy} baseY={GY} rules="right" t={DONE} pen={PEN} seed={7} />
          <MiniBond cx={bR.pageL.cx + 2} cy={bR.pageL.cy + 4} w={66} t={DONE} pen={PEN} seed={8} dur={0.5} />
          <Type x={BOOK_R.cx - 10} y={GY + 62} text={C('bond')} t={DONE} cps={18} size={40} font={FL} color={L} charW={lblW} />
          <BankFacade x={BANK.x} gy={GY} w={BANK.w} colH={150} pedH={80} colW={26} t={DONE} pen={SYS} seed={9} dur={0.9} />
          <OpenBook cx={BOOK_L.cx} cy={BOOK_L.cy} baseY={GY} rules="left" t={DONE} pen={PEN} seed={10} />
          <WireCoinStack cx={bL.pageR.cx - 2} baseY={bL.pageR.foot - 2} n={3} t={DONE} pen={PEN} seed={11} color={Pa.brown} />
          <Type x={BOOK_L.cx - 7} y={GY + 62} text={C('cash')} t={DONE} cps={18} size={40} font={FL} color={L} charW={lblW} />

          <SyncHub cx={HUB.cx} cy={HUB.cy} r={HUB.r} t={DONE} pen={PEN} seed={21} dur={0.8} spin={540} tickT={DONE} />
          <Type x={HUB_LBL.x1} y={126} text={C('global')} t={DONE} cps={24} size={38} font={FL} color={L} anchor="start" />
          <Type x={HUB_LBL.x2} y={126} text={C('synchronizer')} t={DONE} cps={24} size={38} font={FL} color={L} anchor="start" />
          {node(NODE_L.x, 22)}
          {node(NODE_R.x, 23)}
          {appTag(APP_L.cx, [NODE_L.x + NODE.w + 3, APP_L.cx - APP.w / 2 - 2], 24)}
          {appTag(APP_R.cx, [NODE_R.x - 3, APP_R.cx + APP.w / 2 + 2], 25)}
          <LegArrow p0={IN_L[0]} p1={IN_L[1]} p2={IN_L[2]} p={1} pen={PEN} seed={31} head={20} />
          <LegArrow p0={IN_R[0]} p1={IN_R[1]} p2={IN_R[2]} p={1} pen={PEN} seed={33} head={20} />
          <OrderTag cx={TAG1.cx} cy={TAG1.cy} n="1" t={DONE} pen={PEN} seed={35} font={FL} />
          <OrderTag cx={TAG2.cx} cy={TAG2.cy} n="2" t={DONE} pen={PEN} seed={36} font={FL} />
          <LegArrow p0={OUT_L[0]} p1={OUT_L[1]} p2={OUT_L[2]} p={1} pen={PEN} seed={37} head={20} />
          <LegArrow p0={OUT_R[0]} p1={OUT_R[1]} p2={OUT_R[2]} p={1} pen={PEN} seed={39} head={20} />
          <CheckBadge cx={674} cy={678} r={22} t={DONE} pen={PEN} seed={41} sequential />
          <CheckBadge cx={2 * CX - 674} cy={678} r={22} t={DONE} pen={PEN} seed={42} sequential />

          {/* WB2's payoff gives the middle to the operators' view */}
          {wipeP < 1 && (
            <g clipPath="url(#wb3-wipe)">
              <Type x={CX - 110} y={520} text="BOTH" t={DONE} cps={16} size={52} font={FH} color={HI} anchor="start" />
              <Type x={CX + 106} y={527} text="," t={DONE} cps={16} size={52} font={FH} color={HI} anchor="start" />
              <Type x={CX - 234} y={608} text="OR" t={DONE} cps={14} size={52} font={FH} color={HI} anchor="start" />
              <Type x={CX - 93} y={608} text="NOTHING" t={DONE} cps={16} size={52} font={FH} color={HI} anchor="start" />
            </g>
          )}

          {/* ===== scene 1: privacy, a padlock on the hub (the beat's one highlight) ===== */}
          <Padlock cx={LOCK.cx} cy={LOCK.cy} w={LOCK.w} h={LOCK.h} t={at(CUES.lock)} pen={KEYPEN} seed={51} color={HI} dur={0.6} />

          {/* ===== scene 2: the bank's view, [cash | bond] with the bond side hatched out ===== */}
          <ViewPane x={PANE_L.x} y={PANE.y} w={PANE.w} h={PANE.h} tailX={PANE_L.tailX} tip={PANE_L.tip} hide="right" hideT={at(CUES.hideL) - 0.2} t={at(CUES.paneL)} pen={PEN} seed={52}>
            <MiniBond cx={gL.cellR.cx} cy={gL.cy} w={84} t={at(CUES.hideL)} pen={GHOST} seed={53} color={Pa.grey} dur={0.4} />
            <WireCoinStack cx={gL.cellL.cx} baseY={coinBase} n={3} rx={30} ry={9} th={12} t={at(CUES.cash)} pen={PEN} seed={54} color={Pa.brown} />
          </ViewPane>
          <Type x={gL.right + 20} y={LBL_Y} text={C('sees')} t={at(CUES.seesL)} cps={20} size={34} font={FL} color={L} anchor="start" />
          <Type x={gL.right + 118} y={LBL_Y} text={C('cash')} t={at(CUES.cash)} cps={20} size={34} font={FL} color={L} anchor="start" />

          {/* ===== scene 3: the registrar's view, the cash side hatched out ===== */}
          <ViewPane x={PANE_R.x} y={PANE.y} w={PANE.w} h={PANE.h} tailX={PANE_R.tailX} tip={PANE_R.tip} hide="left" hideT={at(CUES.hideR) - 0.2} t={at(CUES.paneR)} pen={PEN} seed={55}>
            <WireCoinStack cx={gR.cellL.cx} baseY={coinBase} n={3} rx={30} ry={9} th={12} t={at(CUES.hideR)} pen={GHOST} seed={56} color={Pa.grey} />
            <MiniBond cx={gR.cellR.cx} cy={gR.cy} w={84} t={at(CUES.bond)} pen={PEN} seed={57} dur={0.5} />
          </ViewPane>
          <Type x={PANE_R.x - 42 - 186} y={LBL_Y} text={C('sees')} t={at(CUES.seesR)} cps={20} size={34} font={FL} color={L} anchor="start" />
          <Type x={PANE_R.x - 42 - 88} y={LBL_Y} text={C('bond')} t={at(CUES.bond)} cps={20} size={34} font={FL} color={L} anchor="start" />

          {/* ===== scene 4: the operators' view, a sealed envelope ===== */}
          <g transform={`translate(${OPER.x} ${OPER.gy}) scale(${OPER.k}) translate(${-OPER.x} ${-OPER.gy})`}>
            <Person x={OPER.x} gy={OPER.gy} t={at(CUES.oper)} pen={OPEN} seed={58} hair="bob" shirt={Pa.blue} reach dur={0.7} shadow="feet" />
          </g>
          <SealedEnvelope cx={ENV.cx} cy={ENV.cy} w={ENV.w} h={ENV.h} t={at(CUES.env)} sealT={at(CUES.seal)} pen={PEN} seed={59} />
          <Type x={CX - 150} y={META_Y} text={C('metadata')} t={at(CUES.meta)} cps={22} size={34} font={FL} color={L} anchor="start" />
          <Type x={CX + 54} y={META_Y} text={C('only')} t={at(CUES.only)} cps={22} size={34} font={FL} color={L} anchor="start" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

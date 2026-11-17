// whiteboard/beats/CantonWB2.tsx: canton (longform-edited) whiteboard beat WB2, CH2 Beat 3
// (brief: longform-edited/media/canton/assets/whiteboard/WB2.brief.md; cues: assets/whiteboard/WB2.cues.md).
// "a digital synchronizer. Each firm keeps its own node and its own app written in Daml, Digital Asset's smart contract
// language. When they trade, the synchronizer puts both legs in order and confirms them so the bond and the cash settle
// together or not at all."
// Frame 0 is WB1's FINISHED drawing (the same components, the same seeds, fully drawn: the cut from WB1 is seamless).
// A round sync hub draws over the gap, GLOBAL SYNCHRONIZER types in the tag row above it (the old TWO SYSTEMS label
// gives the hub its place); a node (a small server) draws under each building, then its app tag, then "Daml" in it; on
// "trade" WB1's two arrows lift off the gap; each side's leg draws INTO the hub (1, 2), the sync mark turns, a check
// lands in it on "confirms"; on "settle" the clock, the hatching and RISK wipe away and both legs leave the hub and
// land on the two books at the same frame, a check badge by each; BOTH, / OR NOTHING types where RISK stood, in the
// Canton yellow (the beat's one highlight).
// Canvas = the full frame 1920 x 1080 @30, 19.36 s (spine 64.220 to 83.580) = 581 frames, no audio. Pen: neon-canton.
// Everything is SVG through rough.js with fixed seeds (no boil, deterministic). On screen: the order tags 1 and 2 only
// (no data number); "Global Synchronizer" (never "digital"); "Daml" in mixed case (never DAML: the pen's caps are
// bypassed for that tag); no Super Validator ring, no "2/3 BFT", no bridge shape.
// The storyboard is the CUES table: LOCAL seconds (0 = spine 64.220), each hung on a spoken word of
// spine/ALL.f.enhanced.medium-words.json; a thing draws as he names it, never before.
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
import { CurvedArrow } from '../money';
import { ClockFace, scaledPen } from '../islands';
import { CheckBadge } from '../layer';
import { LegArrow } from '../sync';
import { HatchLens, MiniBond, NodeBox, OpenBook, OrderTag, RegistryOffice, SyncHub, Tag, ThoughtCloud, WireCoinStack, openBookGeom, tintPen } from '../canton';
import type { Quad } from '../canton';

const { fontFamily: GOCHI } = loadGochi();
const { fontFamily: KALAM } = loadKalam('normal', { weights: ['400', '700'] });
const { fontFamily: ROCKSALT } = loadRockSalt();
const { fontFamily: HANDLEE } = loadHandlee();
const FONTS: Record<string, string> = { 'Gochi Hand': GOCHI, Kalam: KALAM, 'Rock Salt': ROCKSALT, Handlee: HANDLEE };

export const FPS = 30;
/** 19.360 s x 30 = 580.8: the brief / the compositor's window is 581 frames */
export const DUR = 581;
export const W = 1920;
export const H = 1080;

// ---- the storyboard: LOCAL seconds (spine seconds minus 64.220), the word each cue hangs on ----
const CUES = {
  // scene 1: the synchronizer
  hub: 0.28,          // "digital"           the round hub draws over the gap (ring, then the sync mark); TWO SYSTEMS fades out
  hubLabel: 0.60,     // "synchronizer."     GLOBAL SYNCHRONIZER types in the tag row, above the hub
  // scene 2: each firm keeps its own node and its own app
  nodeL: 2.94,        // "own" (node)        the bank's node draws under the bank, wired to it
  nodeR: 3.18,        // "node"              the registrar's node draws under the registry office; NODE types under both
  appL: 4.36,         // "own" (app)         the app tag draws on the bank's node; "app" types in it
  appR: 4.56,         // "app"               the app tag draws on the registrar's node; "app" types in it
  daml: 6.04,         // "Daml,"             "Daml" types in front of "app" in both tags
  // scene 3: the synchronizer puts both legs in order and confirms them
  lift: 10.18,        // "trade,"            WB1's two arrows lift off the gap and fade
  spin: 11.26,        // "synchronizer"      the hub's sync mark starts turning
  leg1: 11.84,        // "puts"              the cash leg draws from the bank's book into the hub
  leg2: 12.08,        // "both"              the bond leg draws from the registrar's book into the hub
  tag1: 12.78,        // "in"                order tag 1 pops on the cash leg
  tag2: 13.10,        // "order"             order tag 2 pops on the bond leg
  confirm: 13.84,     // "confirms"          the sync mark stops; a check draws in the hub
  // scene 4: settle together or not at all
  settle: 16.70,      // "settle"            the clock, the hatching and RISK wipe away; both legs leave the hub at once
  land: 17.10,        // "together"          both legs land on the two books at the same frame; a check badge by each; BOTH, types
  or: 17.72,          // "or"                OR NOTHING types under it (complete at ~18.45, on "not"); held to the fade (19.06)
};

// ---- WB1's layout, unchanged (1920 x 1080) ----
const GY = 630;
const BANK = { x: 68, w: 380 };
const REG = { x: 1460, w: 380 };
const BOOK_L = { cx: 570, cy: 490 }, BOOK_R = { cx: 1330, cy: 490 };
const ARC_BOND: Quad = [[1218, 450], [950, 268], [694, 450]];
const ARC_CASH: Quad = [[682, 544], [800, 556], [918, 544]];
const GAP = { x0: 944, x1: 1212, y0: 514, y1: 574 };
const GAP_TOP: Quad = [[GAP.x0, GAP.y0], [(GAP.x0 + GAP.x1) / 2, GAP.y0], [GAP.x1, GAP.y0]];
const GAP_BOT: Quad = [[GAP.x0, GAP.y1], [(GAP.x0 + GAP.x1) / 2, GAP.y1], [GAP.x1, GAP.y1]];
const CLOCK = { cx: 1078, cy: 452, r: 34 };
const FUND = { x: 880, gy: 1012, k: 0.66 };
/** WB1's clock had been turning for this long (spinT) on its last frame; WB2 carries on from it */
const CLOCK_SPIN0 = 0.39;
/** "long ago": every WB1 component is drawn complete */
const DONE = 99;

// ---- WB2's layout ----
const CX = 950;                                   // WB1's centre line (TWO SYSTEMS, the arc's peak)
const HUB = { cx: CX, cy: 244, r: 76 };           // over the gap: under the tag row, above WB1's arc (peak y ~359)
/** the hub label's two words, text origins (anchor start), set from the ink measured on the stills */
const HUB_LBL = { x1: 713, x2: 880 };
// each side: an INBOUND leg (book -> the hub's lower flank) and an OUTBOUND leg (the hub's upper flank -> the book's
// outer, ruled page), nested so they never cross. Left = the bank's book (cash), right = the registrar's (bond).
const IN_L: Quad = [[625, 428], [640, 300], [880, 291]];
const OUT_L: Quad = [[866, 230], [512, 214], [520, 424]];
const mirror = (q: Quad): Quad => q.map(([x, y]) => [2 * CX - x, y]) as Quad;
const IN_R = mirror(IN_L), OUT_R = mirror(OUT_L);
const TAG1 = { cx: 748, cy: 372 }, TAG2 = { cx: 2 * CX - 748, cy: 372 };
// the nodes: under each building, wired up to its base; the app tag on the node's inner side
const NODE = { w: 130, h: 92, y: 690 };
const NODE_L = { x: 100 }, NODE_R = { x: 1920 - 100 - NODE.w - 2 };   // the registrar's group is WB1's mirror about 961
const APP = { w: 180, h: 56, cy: NODE.y + NODE.h / 2 };
const APP_L = { cx: NODE_L.x + NODE.w + 28 + APP.w / 2 }, APP_R = { cx: NODE_R.x - 28 - APP.w / 2 };

export const CantonWB2: React.FC<{ penId?: string }> = ({ penId = 'neon-canton' }) => {
  const PEN = PENS[penId] ?? PENS['neon-canton'];
  const FH = FONTS[PEN.fontH], FL = FONTS[PEN.fontL];
  const C = (s: string) => (PEN.caps ? s.toUpperCase() : s);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = frame / fps;                 // local seconds
  const at = (cue: number) => T - cue;   // time since a cue (negative = not yet)

  const Pa = PEN.palette, L = PEN.colorL, HI = PEN.colorH;
  const lblW = PEN.charWL, headW = PEN.charWH;
  const SYS = tintPen(PEN, Pa.blue, 'sys');
  const SMALL = scaledPen(PEN, FUND.k, 'fund');
  const bL = openBookGeom(BOOK_L.cx, BOOK_L.cy), bR = openBookGeom(BOOK_R.cx, BOOK_R.cy);
  const headY = FUND.gy - 257 * FUND.k;

  // WB1's leftovers and how they leave
  const twoSysOp = 1 - prog(at(CUES.hub), 0, 0.3);
  const liftP = easeOut(prog(at(CUES.lift), 0, 0.55));
  const wipeP = easeOut(prog(at(CUES.settle), 0, 0.38));
  // the sync mark: one and a half turns between "synchronizer" and "confirms", easing to a stop
  const spinU = prog(at(CUES.spin), 0, CUES.confirm - CUES.spin);
  const spin = 540 * (spinU * spinU * (3 - 2 * spinU));
  // the legs
  const in1 = easeOut(prog(at(CUES.leg1), 0, 0.6)), in2 = easeOut(prog(at(CUES.leg2), 0, 0.6));
  const out = prog(at(CUES.settle), 0, CUES.land - CUES.settle);
  const outP = out * out * (3 - 2 * out);   // both outbound legs share ONE progress: they land on the same frame

  const node = (x: number, cueT: number, seed: number) => {
    const cx = x + NODE.w / 2;
    return (
      <g>
        <Sketch pen={PEN} seed={seed * 10 + 9} shape={{ kind: 'line', x1: cx, y1: GY + 10, x2: cx, y2: NODE.y - 3 }} stroke={Pa.blue} roughness={0.5} progress={prog(at(cueT), 0, 0.2)} />
        <NodeBox x={x} y={NODE.y} w={NODE.w} h={NODE.h} t={at(cueT) - 0.12} pen={PEN} seed={seed} />
        <Type x={cx} y={NODE.y + NODE.h + 40} text={C('node')} t={at(cueT) - 0.6} cps={18} size={30} font={FL} color={L} charW={lblW} />
      </g>
    );
  };
  // the app tag: the pill beside the node, a short wire to it, "app" in it; "Daml" types in front of "app" on its own word
  const appTag = (cx: number, wireX: [number, number], cueT: number, seed: number) => (
    <g>
      <Sketch pen={PEN} seed={seed * 10 + 9} shape={{ kind: 'line', x1: wireX[0], y1: APP.cy, x2: wireX[1], y2: APP.cy }} stroke={Pa.blue} roughness={0.4} progress={prog(at(cueT), 0, 0.15)} />
      <Tag cx={cx} cy={APP.cy} w={APP.w} h={APP.h} t={at(cueT) - 0.1} pen={PEN} seed={seed}>
        <Type x={cx + 19} y={APP.cy + 11} text="app" t={at(cueT) - 0.3} cps={18} size={34} font={FL} color={L} anchor="start" />
        <Type x={cx - 68} y={APP.cy + 11} text="Daml" t={at(CUES.daml) - (seed % 2) * 0.12} cps={16} size={34} font={FL} color={L} anchor="start" />
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
          {/* the settle wipe: WB1's clock, hatching and RISK are cleared left to right */}
          <clipPath id="wb2-wipe"><rect x={920 + 320 * wipeP} y={380} width={320} height={330} /></clipPath>
        </defs>
        <g filter={PEN.glow ? 'url(#glow)' : undefined}>
          {/* ===== WB1's finished drawing (frame 0), same components and seeds ===== */}
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

          {/* TWO SYSTEMS gives its place to the hub */}
          {twoSysOp > 0 && (
            <g opacity={twoSysOp}>
              <Type x={949} y={258} text={C('two systems')} t={DONE} cps={13} size={44} font={FL} color={L} charW={lblW} />
            </g>
          )}

          {/* WB1's gap: the hatch, the clock and RISK stay until "settle", then wipe; the two arrows lift on "trade" */}
          {wipeP < 1 && (
            <g clipPath="url(#wb2-wipe)">
              <HatchLens upper={GAP_TOP} lower={GAP_BOT} x0={GAP.x0} x1={GAP.x1} inset={0} gap={24} t={DONE} pen={PEN} seed={12} dur={0.65} color={HI} />
              <ClockFace cx={CLOCK.cx} cy={CLOCK.cy} r={CLOCK.r} t={DONE} spinT={CLOCK_SPIN0 + T * 0.1} pen={PEN} seed={17} />
              <Type x={(GAP.x0 + GAP.x1) / 2 + 18} y={672} text={C('risk')} t={DONE} cps={14} size={62} font={FH} color={HI} charW={headW} />
            </g>
          )}
          {liftP < 1 && (
            <g transform={`translate(0 ${-22 * liftP})`} opacity={1 - liftP}>
              <CurvedArrow p0={ARC_BOND[0]} p1={ARC_BOND[1]} p2={ARC_BOND[2]} t={DONE} pen={PEN} seed={13} dur={0.75} head={30} sequential />
              <CurvedArrow p0={ARC_CASH[0]} p1={ARC_CASH[1]} p2={ARC_CASH[2]} t={DONE} pen={PEN} seed={15} dur={0.6} head={30} sequential />
            </g>
          )}

          {/* ===== scene 1: the synchronizer ===== */}
          <SyncHub cx={HUB.cx} cy={HUB.cy} r={HUB.r} t={at(CUES.hub)} pen={PEN} seed={21} dur={0.8} spin={spin} tickT={at(CUES.confirm)} />
          {/* two words = two Type elements (the font's own space is ~10 px and read GLOBALSYNCHRONIZER): placed by their
              measured ink (GLOBAL 150 px, SYNCHRONIZER 302 px at 38 px) with an 18 px gap, the pair centred on CX; the
              second word starts where the one-string typing reached it (7 glyphs at 24 cps), so the timing is unchanged */}
          <Type x={HUB_LBL.x1} y={126} text={C('global')} t={at(CUES.hubLabel)} cps={24} size={38} font={FL} color={L} anchor="start" />
          <Type x={HUB_LBL.x2} y={126} text={C('synchronizer')} t={at(CUES.hubLabel) - 7 / 24} cps={24} size={38} font={FL} color={L} anchor="start" />

          {/* ===== scene 2: its own node, its own app written in Daml ===== */}
          {node(NODE_L.x, CUES.nodeL, 22)}
          {node(NODE_R.x, CUES.nodeR, 23)}
          {appTag(APP_L.cx, [NODE_L.x + NODE.w + 3, APP_L.cx - APP.w / 2 - 2], CUES.appL, 24)}
          {appTag(APP_R.cx, [NODE_R.x - 3, APP_R.cx + APP.w / 2 + 2], CUES.appR, 25)}

          {/* ===== scene 3: both legs into the hub, in order, confirmed ===== */}
          <LegArrow p0={IN_L[0]} p1={IN_L[1]} p2={IN_L[2]} p={in1} pen={PEN} seed={31} head={20} />
          <LegArrow p0={IN_R[0]} p1={IN_R[1]} p2={IN_R[2]} p={in2} pen={PEN} seed={33} head={20} />
          <OrderTag cx={TAG1.cx} cy={TAG1.cy} n="1" t={at(CUES.tag1)} pen={PEN} seed={35} font={FL} />
          <OrderTag cx={TAG2.cx} cy={TAG2.cy} n="2" t={at(CUES.tag2)} pen={PEN} seed={36} font={FL} />

          {/* ===== scene 4: both legs land at the same instant ===== */}
          <LegArrow p0={OUT_L[0]} p1={OUT_L[1]} p2={OUT_L[2]} p={outP} pen={PEN} seed={37} head={20} />
          <LegArrow p0={OUT_R[0]} p1={OUT_R[1]} p2={OUT_R[2]} p={outP} pen={PEN} seed={39} head={20} />
          <CheckBadge cx={674} cy={678} r={22} t={at(CUES.land)} pen={PEN} seed={41} sequential />
          <CheckBadge cx={2 * CX - 674} cy={678} r={22} t={at(CUES.land)} pen={PEN} seed={42} sequential />

          {/* the payoff, where RISK stood: the beat's one highlight */}
          <Type x={CX - 110} y={520} text="BOTH" t={at(CUES.land)} cps={16} size={52} font={FH} color={HI} anchor="start" />
          {/* the comma is its own glyph, set clear of the H (a display hand-font fuses punctuation into the letter) */}
          <Type x={CX + 106} y={527} text="," t={at(CUES.land) - 0.25} cps={16} size={52} font={FH} color={HI} anchor="start" />
          <Type x={CX - 234} y={608} text="OR" t={at(CUES.or)} cps={14} size={52} font={FH} color={HI} anchor="start" />
          <Type x={CX - 93} y={608} text="NOTHING" t={at(CUES.or) - 0.28} cps={16} size={52} font={FH} color={HI} anchor="start" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

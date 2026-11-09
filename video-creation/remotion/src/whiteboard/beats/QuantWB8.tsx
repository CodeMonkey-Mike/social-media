// whiteboard/beats/QuantWB8.tsx: whiteboard beat WB8 of the longform-edited video `quant`
// (brief: media/quant/assets/whiteboard/WB8.brief.md; cues: assets/whiteboard/WB8.cues.md).
// The token's two pipes. LANE 1 (top), the pipe that exists: on "wanna" a developer draws on at a laptop on a side table;
// on "Overledger" a software box "Overledger" draws beside him. On "license" a paper slip slides out of the box, "licence"
// written on it; on "December" / "2021" a sticker "Dec 2021" pops under it. On "QNT" the slip turns into the orange QNT coin
// (the token, as WB13 drew it). On "payment" a flanged PIPE draws from the box; on "goes" the coin rolls along it; on
// "treasury" / "contract" a contract box draws round the coin's path ("treasury" / "contract" written in it) and the coin
// passes THROUGH it (hidden inside, out the other side); on "to" the pipe continues; on "quant." the tall orange band draws
// at the right ("Quant" written in it); the coin waits at the pipe's end until the band is inked, then lands inside it: pipe 1 complete. On "governance" a ballot box draws
// between the lanes and on "rights" an ink cross strikes it out; on "utility" the word "utility" is written beside it.
// LANE 2 (bottom), the deals: on "bank" a bank facade draws; on "clearing" a flag rises on its roof and "TCH" is written
// on it ("house"); on "GBTD" a second flag, "GBTD". On "software" a contract sheet draws beside the bank, "software" written
// under it, "+ service" on "service"; on "contracts" a plain arrow runs from the sheet into the band (the deals are the
// company's revenue). On "published" a tag hangs off that arrow with an orange "?" and on "how" the label "QNT share: not
// disclosed" is written under it. Payoff: on "token" a FAINT QNT coin (a ghost: pale fill, dashed rim) appears right of the sheet; on "second" a DASHED pipe
// draws from the sheet toward it with an orange "?" at its end: pipe 1 solid, pipe 2 dashed with the question.
// Canvas = the full frame 1920 x 1080 @30, spine 365.500 to 394.900 s = 29.4 s = 882 frames, no audio; the comp build fades
// it in and out. Pen: paper-quant (the orange marks are the Quant band with its name, the QNT coin, and the two "?"; every
// other word is in the pen's ink). Everything is SVG through rough.js with fixed seeds (no boil, deterministic). Numbers on
// screen: "Dec 2021" only (DATA.md Pillar 3: Overledger 2.1.5, 2021-12-15, the licence fee payable in QNT). Never the 100
// pound amount, never "locked 12 months", never "staking", no revenue figure, no QNT share percentage, no "converted".
// The storyboard is the CUES table below: LOCAL seconds (0 = spine 365.500), each hung on a spoken word of
// `spine/ALL.f.enhanced.medium-words.json`; a thing draws as he names it, never before.
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont as loadGochi } from '@remotion/google-fonts/GochiHand';
import { loadFont as loadKalam } from '@remotion/google-fonts/Kalam';
import { loadFont as loadRockSalt } from '@remotion/google-fonts/RockSalt';
import { loadFont as loadHandlee } from '@remotion/google-fonts/Handlee';
import { PENS } from '../pen';
import { Person, Type } from '../vocab';
import { prog, easeOut } from '../Sketch';
import { ContractBox, StraightArrow } from '../crypto';
import { BankFacade, HangTag, bankGeom } from '../bank';
import { RectFlag, rectFlagGeom } from '../harbour';
import { Sheet } from '../career';
import { StickerTag } from '../mortgage';
import { TokenCoin } from '../supply';
import { CrossOut } from '../welfare';
import { BallotBox, Laptop, Pipe, QMark, SideTable, Slip, SoftBox, TallBand, sideTableGeom } from '../token';

const { fontFamily: GOCHI } = loadGochi();
const { fontFamily: KALAM } = loadKalam('normal', { weights: ['400', '700'] });
const { fontFamily: ROCKSALT } = loadRockSalt();
const { fontFamily: HANDLEE } = loadHandlee();
const FONTS: Record<string, string> = { 'Gochi Hand': GOCHI, Kalam: KALAM, 'Rock Salt': ROCKSALT, Handlee: HANDLEE };

export const FPS = 30;
/** 29.4 s x 30 = 882 frames (spine 365.500 to 394.900) */
export const DUR = 882;
export const W = 1920;
export const H = 1080;

// ---- the storyboard: LOCAL seconds (spine seconds minus 365.500), the word each cue hangs on ----
const CUES = {
  dev: 0.38,        // "wanna"        the developer draws on (1.2 s) with the side table (0.4 s) and the laptop (from 0.55, 0.6 s) he works at
  box: 0.96,        // "Overledger"   the software box draws (0.6 s), "Overledger" is written in it
  slip: 3.28,       // "license"      a paper slip slides out of the box's right side (0.5 s), "licence" is written on it
  dec: 4.50,        // "December"     a sticker pops under the slip, "Dec" is written on it
  y2021: 5.16,      // "2021,"        "2021" is written after it
  coin: 6.98,       // "QNT."         the slip turns into the orange QNT coin (the slip fades 0.3 s, the coin pops 0.35 s)
  pipeA: 7.96,      // "payment"      a flanged pipe draws from the box's right side under the coin to where the contract will stand (0.5 s)
  go: 8.22,         // "goes"         the coin rolls along the pipe (to the contract's left edge by 9.20, through it by 9.74, to pipe B's end by 10.9, where it waits for the band)
  treasury: 8.84,   // "treasury"     the contract box draws round the coin's path (0.5 s), "treasury" is written in it; the coin disappears inside
  contract: 9.16,   // "contract"     "contract" is written under "treasury"
  pipeB: 9.74,      // "to"           the pipe continues from the contract's right side to the band's left edge (0.5 s); the coin comes out of the contract onto it
  band: 10.42,      // "quant."       the tall ORANGE band draws at the right as one stroke (0.7 s, done 11.12), "Quant" is written in it; the coin waits at the pipe's end and enters the band 11.12 -> 11.42
  ballot: 11.22,    // "governance"   a ballot box draws between the lanes (0.5 s): a ticked paper half into the slot
  cross: 11.62,     // "rights,"      an ink cross strikes it out (0.45 s)
  utility: 12.38,   // "utility"      "utility" is written beside it
  bank: 15.48,      // "bank"         a bank facade draws in the lower lane (1.2 s): steps, columns, entablature, pediment, entrance
  flag1: 16.46,     // "clearing"     a flag rises on the pediment's left slope (0.5 s)
  tch: 16.62,       // "house,"       "TCH" is written on it
  flag2: 17.30,     // "GBTD,"        a second flag on the right slope (0.5 s), "GBTD" written on it as the cloth lands
  sheet: 18.74,     // "software"     a contract sheet draws beside the bank (0.5 s), "software" is written under it
  service: 19.54,   // "service"      "+ service" is written after it
  arrow: 19.88,     // "contracts."   a plain arrow runs from the sheet's right edge into the band (0.6 s): the deals are the company's revenue
  tag: 21.32,       // "published"    a tag hangs off the arrow (0.45 s), an orange "?" drawn in it
  notdisc: 21.98,   // "how"          "QNT share: not disclosed" is written under the tag (done 23.07, as he says "if any")
  faint: 26.76,     // "token"        a FAINT QNT coin pops right of the sheet, in the lower lane
  pipe2: 27.84,     // "second"       a DASHED pipe draws from the sheet's right edge toward the faint coin (0.45 s, done 28.29)
  q2: 27.84,        // "second"       an orange "?" draws at the pipe's end with it (0.4 s, done 28.24): the drawing is complete at 28.29 and holds 0.81 s before the compositor's fade starts at 29.10 (visual-qa round 5: on "pipe" it finished at 28.44, a 0.66 s hold; "Now" starts at 29.40 = the out, so tOut cannot grow)
};

// ---- layout ----
const GY1 = 480;                                                    // lane 1's floor (the developer's feet, the table's legs)
const GY2 = 990;                                                    // lane 2's floor (the bank's base)
const PIPE_Y = 360;                                                 // lane 1's pipe axis: the boxes' vertical centre
const DEV = { x: 170 };                                             // the developer (Person reach: his right hand lands at x + 109, GY1 - 145)
const TABLE = { x: 258, w: 170, h: 138 };                           // the side table: slab top 342, legs at 272 / 414
const TG = sideTableGeom(TABLE.x, GY1, TABLE.w, TABLE.h);
const LAPTOP = { cx: 349, w: 140 };                                 // on the slab (258..428): base 279..419 x 330..342, screen 290..408 x 238..330; the deck's left end sits UNDER the centre of his hand (279, 335; r 6), so the hand hides it (at 268 the rounded end poked out behind the hand and read as two rings, visual-qa round 5)
const BOX = { x: 490, y: 300, w: 260, h: 120 };                     // "Overledger", 72 px right of the laptop
const SLIP = { cx: 865, cy: PIPE_Y, w: 140, h: 72, fromX: 640 };    // slides out of the box (its centre starts inside it) to 795..935: 45 px clear of the box and of the contract
const STICKER = { x: 790, y: 424, w: 150, h: 44 };                  // under the slip (28 px) and 24 px under the rim of the coin that replaces it (at 408 the rim cleared it by 6 px, visual-qa round 4); 41 px under the pipe's flange
const COIN_R = 40;
const TREASURY = { x: 980, y: 300, w: 280, h: 120 };                // the contract box; its label column at x + 40 + (w - 50) / 2 = 1135
const BAND = { x: 1660, y: 150, w: 210, h: 850, r: 48 };            // the tall orange band: 50 px off the right edge, spans both lanes
const COIN_LAND = { x: BAND.x + BAND.w / 2, y: PIPE_Y };            // the coin's seat inside the band (its top 320, 90 px under "Quant")
const COIN_GATE = { x: 1600 };                                      // where the coin WAITS at pipe B's end (its right edge 1640, 16 px short of the band's left stroke) until the band is fully inked
const BAND_DONE = 11.12;                                            // the band's single stroke runs clockwise from its top-left corner, so its LEFT wall is inked last (complete at band + 0.7): the coin enters only after that (visual-qa round 5: it hung in blank paper past the wall's line while the top-right corner was drawing)
const BALLOT = { cx: 1300, gy: 660, w: 110, h: 80 };                // between the lanes under pipe B: box 1245..1355 x 580..660, the paper up to ~544
const UTILITY = { x: 1500, y: 632 };                                // "utility" right of the ballot box (ink ~1429..1571, 89 px short of the band)
const BANK = { x: 70, w: 480, colH: 150, pedH: 80, colW: 30 };      // the bank: steps 70..550, pediment base y 732, apex (310, 652); 30 px columns (the studied ~5:1 ratio) at 150 / 257 / 363 / 470, the door fitted to the middle bay (57 x 111, 10 px off each inner column; the 440-wide bank's 46 px columns left a 47 px gap under an 84 px door, visual-qa round 4)
const BG = bankGeom(BANK.x, GY2, BANK.w, BANK.colH, BANK.pedH);
// the flags stand on the pediment's slopes (y 695 at x 190 and at x 430, symmetric about the apex at 310), poles up to 590, cloths 110 x 48 flying right
// (the pediment's base runs x + 16 .. x + w - 16 at entTop, its apex at x + w / 2, apexY: the roof line at a given x)
const slopeY = (x: number) => {
  const half = BANK.w / 2 - 16, run = x < BANK.x + BANK.w / 2 ? x - (BANK.x + 16) : BANK.x + BANK.w - 16 - x;
  return BG.entTop - (BANK.pedH * run) / half;
};
const FLAG1 = { x: 190, gy: slopeY(190), top: 590, w: 110, h: 48 };
const FLAG2 = { x: 430, gy: slopeY(430), top: 590, w: 110, h: 48 };
const FG1 = rectFlagGeom(FLAG1.x, FLAG1.top, FLAG1.w, FLAG1.h);
const FG2 = rectFlagGeom(FLAG2.x, FLAG2.top, FLAG2.w, FLAG2.h);
const SHEET = { cx: 700, bottom: 940, w: 160, h: 200 };             // the contract sheet 620..780 x 740..940, 75 px right of the second flag's cloth, 70 px right of the bank's base
const SHEET_LBL = { y: 985, software: 578, service: 712 };          // "software" / "+ service" under the sheet (ink ~578..844)
const ARROW = { x1: 792, x2: 1646, y: 790 };                        // from the sheet's right edge to the band (the head's ink ends ~1653, 5 px short of the band's left stroke: at 1652 it ran onto it, round-2 still)
const TAG = { x: 1400, drop: 36, w: 84, h: 96 };                    // hangs off the arrow: tag 1358..1442 x 826..922, the hole at 842, the "?" (top 859) under it
const NOTDISC = { x: 1400, y: 975 };                                // "QNT share: not disclosed" under the tag (ink ~1223..1577, 83 px short of the band)
const FAINT = { cx: 1110, cy: 880 };                                // the faint (ghost) coin in the lower lane, right of the sheet (1070..1150 x 840..920): pale fill, dashed rim, the mark in ink
const PIPE2 = { x1: 792, x2: 1062, y: 880 };                        // the dashed pipe from the sheet's lower right toward the faint coin (ends 8 px short of it)
const Q2 = { cx: 1215, cy: 876, size: 60 };                         // the "?" at the pipe's end, right of the faint coin (49 px air), 45 px above the label's cap line
const LBLW = 0.46;                                                  // Kalam 700 ~0.46 em per glyph (quant WB12 stills)
const CAPW = 0.62;                                                  // Kalam 700 CAPS (quant WB7 "RTP" / "CHIPS")
const QUANT_W = 0.5, QUANT_SP = 0.06;                               // "Quant" in the heading font (WB3 / WB12's glyph width; tracking 0.06 so it clears the 210 px band's strokes)

const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const easeInOut = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);

export const QuantWB8: React.FC<{ penId?: string }> = ({ penId = 'paper-quant' }) => {
  const PEN = PENS[penId] ?? PENS['paper-quant'];
  const FL = FONTS[PEN.fontL];
  const FH = FONTS[PEN.fontH];
  const C = (s: string) => (PEN.caps ? s.toUpperCase() : s);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = frame / fps;                 // local seconds
  const at = (cue: number) => T - cue;   // time since a cue (negative = not yet)
  const ORANGE = PEN.palette.red;
  const INK = PEN.colorL;

  // the slip -> coin morph: the slip shrinks and fades over 0.3 s from the coin's cue
  const morphP = prog(at(CUES.coin), 0, 0.3);

  // the coin's ride along pipe 1: still on the slip's spot, to the contract's left edge, through the contract (hidden by its
  // fill), out onto pipe B to its end, where it WAITS until the band is fully drawn, then into the band, where it stays
  let coinX = SLIP.cx;
  if (T >= CUES.go) {
    const leg1 = prog(T, CUES.go, CUES.treasury + 0.36 - CUES.go);                       // 8.22 -> 9.20: to the contract's left edge
    const leg2 = prog(T, CUES.treasury + 0.36, CUES.pipeB - (CUES.treasury + 0.36));     // 9.20 -> 9.74: through the contract
    const leg3 = prog(T, CUES.pipeB, 10.9 - CUES.pipeB);                                 // 9.74 -> 10.9: along pipe B to the gate at its end (eases to a stop)
    const leg4 = prog(T, BAND_DONE, 0.3);                                                // 11.12 -> 11.42: into the band, once its left wall is inked
    if (leg4 > 0) coinX = lerp(COIN_GATE.x, COIN_LAND.x, easeOut(leg4));
    else if (leg3 > 0) coinX = lerp(TREASURY.x + TREASURY.w, COIN_GATE.x, easeOut(leg3));
    else if (leg2 > 0) coinX = lerp(TREASURY.x, TREASURY.x + TREASURY.w, leg2);
    else coinX = lerp(SLIP.cx, TREASURY.x, easeInOut(leg1));
  }

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
          {/* ===== lane 1, scene 1: a developer at a laptop uses Overledger, pays a licence fee ===== */}
          <SideTable x={TABLE.x} gy={GY1} w={TABLE.w} h={TABLE.h} t={at(CUES.dev)} pen={PEN} seed={1} />
          <Laptop cx={LAPTOP.cx} baseY={TG.top} w={LAPTOP.w} t={at(CUES.dev + 0.17)} pen={PEN} seed={2} />
          {/* the developer is painted after the laptop so his hand sits on its deck */}
          {/* curlArc 0.98..1.72 pi: the last curl sits at (x+22, hy-26), 22 px from the right eye's centre (at 1.1..1.9 it sat 14 px away and
              swallowed the eye, visual-qa round 4); shadow="feet": the floor shadow comes in with the feet, never under legs still drawing */}
          <Person x={DEV.x} gy={GY1} t={at(CUES.dev)} pen={PEN} seed={3} hair="curly" shirt={PEN.palette.green} reach shadow="feet" curlArc={[0.98, 1.72]} />
          {/* the slip is painted BEFORE the box so the box's fill hides the part still inside while it slides out */}
          <Slip cx={SLIP.cx} cy={SLIP.cy} w={SLIP.w} h={SLIP.h} fromX={SLIP.fromX} t={at(CUES.slip)} pen={PEN} seed={5} k={1 - 0.3 * morphP} opacity={1 - morphP}>
            <Type x={SLIP.cx} y={SLIP.cy + 11} text={C('licence')} t={at(CUES.slip) - 0.5} cps={20} size={30} font={FL} color={INK} weight="700" charW={LBLW} />
          </Slip>
          <SoftBox x={BOX.x} y={BOX.y} w={BOX.w} h={BOX.h} t={at(CUES.box)} pen={PEN} seed={4}>
            <Type x={BOX.x + BOX.w / 2} y={BOX.y + 92} text={C('Overledger')} t={at(CUES.box) - 0.5} cps={22} size={38} font={FL} color={INK} weight="700" charW={LBLW} />
          </SoftBox>
          <StickerTag x={STICKER.x} y={STICKER.y} w={STICKER.w} h={STICKER.h} t={at(CUES.dec)} pen={PEN} seed={6} color={PEN.palette.grey}>
            <Type x={STICKER.x + 19} y={STICKER.y + 32} text={C('Dec')} t={at(CUES.dec) - 0.18} cps={14} size={28} font={FL} color={INK} weight="700" anchor="start" charW={0.5} spacing={0.03} />
            <Type x={STICKER.x + 75} y={STICKER.y + 32} text={C('2021')} t={at(CUES.y2021)} cps={14} size={28} font={FL} color={INK} weight="700" anchor="start" charW={0.5} spacing={0.03} />
          </StickerTag>

          {/* ===== lane 1, scene 2: the fee is a QNT coin that goes through a treasury contract to Quant (pipe 1) ===== */}
          <Pipe x1={BOX.x + BOX.w} y1={PIPE_Y} x2={TREASURY.x} y2={PIPE_Y} t={at(CUES.pipeA)} pen={PEN} seed={7} />
          <Pipe x1={TREASURY.x + TREASURY.w} y1={PIPE_Y} x2={BAND.x} y2={PIPE_Y} t={at(CUES.pipeB)} pen={PEN} seed={8} chevrons={3} />
          <TallBand x={BAND.x} y={BAND.y} w={BAND.w} h={BAND.h} r={BAND.r} t={at(CUES.band)} pen={PEN} seed={9}>
            {/* 54 px, 0.06 em tracking: at WB12's 64 px / 0.1 em the "t" ended 6 px short of the band's right stroke (round-2 still) */}
            <Type x={BAND.x + BAND.w / 2} y={BAND.y + 80} text={C('Quant')} t={at(CUES.band) - 0.4} cps={14} size={54} font={FH} color={PEN.colorH} weight="700" charW={QUANT_W} spacing={QUANT_SP} />
          </TallBand>
          {/* the coin is painted after the pipes and the band (it rides over them, sits inside the band) and BEFORE the contract box, whose fill hides it while it passes through */}
          <TokenCoin cx={coinX} cy={PIPE_Y} r={COIN_R} t={at(CUES.coin)} pen={PEN} seed={10} color={ORANGE} mark="QNT" font={FL} markColor={PEN.light} markSize={24} markDx={-2} />
          <ContractBox x={TREASURY.x} y={TREASURY.y} w={TREASURY.w} h={TREASURY.h} t={at(CUES.treasury)} pen={PEN} seed={11} color={PEN.palette.blue} glyph={PEN.ink} />
          <Type x={TREASURY.x + 40 + (TREASURY.w - 50) / 2} y={TREASURY.y + 52} text={C('treasury')} t={at(CUES.treasury) - 0.3} cps={22} size={34} font={FL} color={INK} weight="700" charW={LBLW} />
          <Type x={TREASURY.x + 40 + (TREASURY.w - 50) / 2} y={TREASURY.y + 100} text={C('contract')} t={at(CUES.contract)} cps={22} size={34} font={FL} color={INK} weight="700" charW={LBLW} />

          {/* ===== between the lanes: no governance rights, a utility token ===== */}
          <BallotBox cx={BALLOT.cx} gy={BALLOT.gy} w={BALLOT.w} h={BALLOT.h} t={at(CUES.ballot)} pen={PEN} seed={12} />
          <CrossOut x1={BALLOT.cx - 62} y1={BALLOT.gy - BALLOT.h - 12} x2={BALLOT.cx + 62} y2={BALLOT.gy + 8} t={at(CUES.cross)} pen={PEN} seed={13} color={PEN.ink} strokeWidth={PEN.inkWidth + 3.5} />
          <Type x={UTILITY.x} y={UTILITY.y} text={C('utility')} t={at(CUES.utility)} cps={20} size={44} font={FL} color={INK} weight="700" charW={LBLW} />

          {/* ===== lane 2, scene 3: the bank deals (TCH, GBTD) are software and service contracts; the QNT share is not disclosed ===== */}
          <BankFacade x={BANK.x} gy={GY2} w={BANK.w} colH={BANK.colH} pedH={BANK.pedH} colW={BANK.colW} t={at(CUES.bank)} pen={PEN} seed={14} dur={1.2} />
          <RectFlag x={FLAG1.x} gy={FLAG1.gy} top={FLAG1.top} w={FLAG1.w} h={FLAG1.h} color={PEN.palette.gold} t={at(CUES.flag1)} pen={PEN} seed={15}>
            <Type x={FG1.cx} y={FG1.cy + 9} text={C('TCH')} t={at(CUES.tch)} cps={14} size={26} font={FL} color={PEN.ink} weight="700" charW={CAPW} />
          </RectFlag>
          <RectFlag x={FLAG2.x} gy={FLAG2.gy} top={FLAG2.top} w={FLAG2.w} h={FLAG2.h} color={PEN.palette.gold} t={at(CUES.flag2)} pen={PEN} seed={16}>
            <Type x={FG2.cx} y={FG2.cy + 9} text={C('GBTD')} t={at(CUES.flag2) - 0.45} cps={14} size={26} font={FL} color={PEN.ink} weight="700" charW={CAPW} />
          </RectFlag>
          <Sheet cx={SHEET.cx} bottom={SHEET.bottom} w={SHEET.w} h={SHEET.h} t={at(CUES.sheet)} pen={PEN} seed={17} />
          <Type x={SHEET_LBL.software} y={SHEET_LBL.y} text={C('software')} t={at(CUES.sheet) - 0.2} cps={22} size={32} font={FL} color={INK} weight="700" anchor="start" charW={LBLW} />
          <Type x={SHEET_LBL.service} y={SHEET_LBL.y} text={C('+ service')} t={at(CUES.service)} cps={22} size={32} font={FL} color={INK} weight="700" anchor="start" charW={LBLW} />
          <StraightArrow x1={ARROW.x1} y1={ARROW.y} x2={ARROW.x2} y2={ARROW.y} t={at(CUES.arrow)} pen={PEN} seed={18} dur={0.6} />
          <HangTag x={TAG.x} y0={ARROW.y} drop={TAG.drop} w={TAG.w} h={TAG.h} t={at(CUES.tag)} pen={PEN} seed={19}>
            <QMark cx={TAG.x} cy={ARROW.y + TAG.drop + 16 + 40} size={46} t={at(CUES.tag) - 0.4} pen={PEN} seed={20} />
          </HangTag>
          <Type x={NOTDISC.x} y={NOTDISC.y} text={C('QNT share: not disclosed')} t={at(CUES.notdisc)} cps={22} size={32} font={FL} color={INK} weight="700" charW={LBLW} />

          {/* ===== payoff: the second pipe, dashed, with a question mark ===== */}
          {/* the ghost coin: the pen's pale orange tint at full opacity, a dashed rim (like the dashed pipe), "QNT" in the ink (6.8:1;
              the 0.42 group opacity of round 3 left a white mark on a pale fill at 1.7:1, visual-qa round 4) */}
          <TokenCoin cx={FAINT.cx} cy={FAINT.cy} r={COIN_R} t={at(CUES.faint)} pen={PEN} seed={21} ghost color={PEN.palette.gold} mark="QNT" font={FL} markColor={PEN.ink} markSize={24} markDx={-2} />
          <Pipe x1={PIPE2.x1} y1={PIPE2.y} x2={PIPE2.x2} y2={PIPE2.y} t={at(CUES.pipe2)} pen={PEN} seed={22} dashed dur={0.45} />
          <QMark cx={Q2.cx} cy={Q2.cy} size={Q2.size} t={at(CUES.q2)} pen={PEN} seed={23} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

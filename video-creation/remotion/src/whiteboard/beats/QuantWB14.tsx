// whiteboard/beats/QuantWB14.tsx: whiteboard beat WB14 of the longform-edited video `quant`
// (brief: media/quant/assets/whiteboard/WB14.brief.md; cues: assets/whiteboard/WB14.cues.md).
// "He's been a security chief at that level ... Quant says he helped set up the ISO committee": a figure with a shield
// badge draws at the left ("security", the badge on "level", the label "security chief" under him); on "worked" a road
// starts under his feet and its leading edge travels right at the pace of his words, reaching each stop as he names it:
// a signpost "Downing Street" (and the black door of Downing Street beside it on "Street": white surround, fanlight, dark
// leaf, letterbox, knob, NO number: the brief allows 2016 as the only number on screen), "Treasury", "Mastercard", "HSBC"
// (plain words, no logos). On "2016" a calendar page on a pole plants beside the road. On "Quant" the ONE orange mark of
// the beat pops at the road's far end: a pennant flag "Quant"; on "says" a callout "Quant says" draws with its tail on that
// flag (the claim is Quant's, attributed in ink). On "ISO" a round table draws at the road's end (a pale tint, its top
// opaque from its first frame), on "committee" six small sitters pop around it and "ISO" is written on its top; on "writes"
// the road ARRIVES at the flag (planted on the ground line just past the road's end cap) (the payoff motion, 1.06 s before the compositor's fade) and a document draws on the table;
// on "blockchain" the label "standards" types over it. Payoff: his road ends at Quant.
// Canvas = the full frame 1920 x 1080 @30, spine 214.540 to 229.740 s = 15.2 s = 456 frames, no audio; the comp build
// fades it in and out. Pen: paper-quant (everything the pen unchanged; the one orange mark is the Quant flag; the pen's
// pale tints fill the table and the shirts). Everything is SVG through rough.js with fixed seeds (no boil, deterministic).
// The only number on screen is 2016 (DATA.md Pillar 1: ISO/TC 307 created 2016; Quant's wording "In 2016, we helped
// establish ... ISO TC307"). Never WG7, never Convenor, never 2015, no logos, no "20 years", no founder title.
// The storyboard is the CUES table below: LOCAL seconds (0 = spine 214.540), each hung on a spoken word of
// `spine/ALL.f.enhanced.medium-words.json`; a thing draws as he names it, never before.
// Layout: the scene is laid out in the numbers below, then the whole drawing is shifted SHIFT_X px left as one group
// (visual-qa 2026-11-05 round 2: the pennant's ink sat 41 px from the right edge against a 172 px left margin). Round 4
// (visual-qa on the round-3 stills): the pennant stands PAST the road's end on the ground line (its pole to y 780, a ground
// stroke + grass ticks at its foot, so it never ends in mid air while the road is still on its way), and the sitters got a
// neck + a hair-cap-over-pale-head back view (the front two had read as black balls). Round 5 (visual-qa on the round-4
// stills): the pennant's ground stroke + grass now lie to the right of its pole only (kit `PennantFlag ground`), so nothing
// touches the road's end cap 12 px to its left, and the two front sitters sit at x +-96 (22 px air to the table foot).
// Every coordinate below is BEFORE the shift.
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont as loadGochi } from '@remotion/google-fonts/GochiHand';
import { loadFont as loadKalam } from '@remotion/google-fonts/Kalam';
import { loadFont as loadRockSalt } from '@remotion/google-fonts/RockSalt';
import { loadFont as loadHandlee } from '@remotion/google-fonts/Handlee';
import { PENS } from '../pen';
import { Person, Type } from '../vocab';
import { ShieldCheck } from '../deposits';
import { CalendarFlag, Callout, NumberDoor, PennantFlag, Road, RoundTable, Sheet, Signpost, Sitter, calendarFlagGeom, pennantGeom, roundTableGeom } from '../career';

const { fontFamily: GOCHI } = loadGochi();
const { fontFamily: KALAM } = loadKalam('normal', { weights: ['400', '700'] });
const { fontFamily: ROCKSALT } = loadRockSalt();
const { fontFamily: HANDLEE } = loadHandlee();
const FONTS: Record<string, string> = { 'Gochi Hand': GOCHI, Kalam: KALAM, 'Rock Salt': ROCKSALT, Handlee: HANDLEE };

export const FPS = 30;
/** 15.2 s x 30 = 456 frames (spine 214.540 to 229.740) */
export const DUR = 456;
export const W = 1920;
export const H = 1080;

// ---- the storyboard: LOCAL seconds (spine seconds minus 214.540), the word each cue hangs on ----
const CUES = {
  chief: 0.72,       // "security"       the figure draws at the road's start (1.2 s), facing right; his floor shadow waits for his legs
  chiefLabel: 1.02,  // "chief"          "security chief" types under him
  badge: 1.62,       // "level"          a shield badge draws on his chest
  road: 2.50,        // "worked"         the road starts under his feet; its leading edge travels right (ROAD_KEYS)
  downing: 4.38,     // "Downing"        signpost "Downing Street" (the road arrives at it)
  door: 4.78,        // "Street"         the black door of Downing Street beside the signpost (no number)
  treasury: 5.38,    // "Treasury"       signpost "Treasury"
  mastercard: 8.08,  // "MasterCard"     signpost "Mastercard"
  hsbc: 8.94,        // "HSBC"           signpost "HSBC"
  year: 10.24,       // "2016"           a calendar page on a pole plants beside the road, "2016" on its face
  quant: 11.62,      // "Quant"          the orange pennant "Quant" at the road's far end (the one orange mark)
  says: 11.68,       // "says"           the callout "Quant says", its tail on the flag
  iso: 12.88,        // "ISO"            the round table draws at the road's end (foot, column, top; 0.7 s)
  committee: 13.18,  // "committee"      six sitters pop around it, one every 0.07 s (behind an already opaque top)
  isoLabel: 13.38,   // "committee" (held) "ISO" is written on the table top
  writes: 13.84,     // "writes"         the road arrives at the flag (the payoff); a document draws on the table
  standards: 14.28,  // "blockchain"     "standards" types above the document (28 cps, done 14.60; the fade starts 14.90)
};
/** the road's leading edge: it reaches each stop on the word that names it (T -> x); it ARRIVES at the flag on "writes" */
const ROAD_KEYS_T = [CUES.road, CUES.downing, CUES.treasury, CUES.mastercard, CUES.hsbc, CUES.year, CUES.iso, CUES.writes];
const ROAD_KEYS_X = [180, 560, 780, 990, 1170, 1265, 1580, 1800];

// ---- layout (pre-shift coordinates; the drawing group is translated SHIFT_X) ----
const SHIFT_X = -76;                                              // the whole drawing 76 px left (ink margins ~87 left, ~78 right: the pennant's bow at 1918 pre-shift)
const ROAD = { x0: 180, x1: 1800, top: 720, h: 60 };            // the ribbon; its bottom edge 780 is the ground line, the floor band below it
const FIG = { x: 300, gy: 766, label: 832 };                      // the chief stands on the road's near half; label under the road
const BADGE = { cx: 300, cy: 766 - 215 + 42, w: 30, h: 34 };      // centre chest (no tie: the badge is the mark)
const SIGN_H = 56, SIGN_TXT = 38;
const TALL = 470, SHORT = 600;                                    // plate tops: tall and short posts alternate so the plates never share a row
// plate widths = word width (Kalam 700 at 38 px, SIGNW / CAPW per glyph, measured on the round-2 stills) + ~24 px air each side
const SIGNS = [
  { x: 560, top: TALL, w: 310, text: 'Downing Street', cue: CUES.downing },   // 14 glyphs x 18.6 = 261 -> 24.5 px air
  { x: 780, top: SHORT, w: 200, text: 'Treasury', cue: CUES.treasury },       // 8 x 18.6 = 149 -> 25.5 px air
  { x: 990, top: TALL, w: 235, text: 'Mastercard', cue: CUES.mastercard },    // 10 x 18.6 = 186 -> 24.5 px air
  { x: 1170, top: SHORT, w: 140, text: 'HSBC', cue: CUES.hsbc },             // 4 x 23.6 = 94 -> 23 px air
];
const DOOR = { x: 440, gy: ROAD.top, w: 72, h: 124 };            // left of the Downing post (its right edge 512, the post 560); top 596, under the plate (526)
const CAL = { x: 1265, gy: ROAD.top, top: 488 };                  // between the HSBC plate (ends 1240) and the table's left sitter (shoulders from 1408): 20 px air each side
const CALG = calendarFlagGeom(CAL.x, CAL.top);
const TABLE = roundTableGeom(1580, 642, ROAD.top, 150, 46);
const SITTERS: { p: [number, number]; face: 'front' | 'back' | 'left' | 'right'; depth: 'back' | 'front' }[] = [
  { p: [TABLE.behind[0][0], TABLE.behind[0][1] - 4], face: 'front', depth: 'back' },   // 4 px higher than the seat: neck + shoulders peek over the rim (cy - 41 at x +-70) before the top cuts them
  { p: [TABLE.behind[1][0], TABLE.behind[1][1] - 4], face: 'front', depth: 'back' },
  { p: TABLE.sides[0], face: 'right', depth: 'back' },
  { p: TABLE.sides[1], face: 'left', depth: 'back' },
  { p: [TABLE.cx - 96, TABLE.cy + 36], face: 'back', depth: 'front' },   // heads CLEARLY over the rim: at x +-96 the rim passes at cy + 35, the head spans cy + 21 to 51 (14 px of head above it, the hair cap over the edge, the pale nape under it); 45 px air to the "ISO" ink (cx +-36); the shoulder dome (sw 26) spans x +-70 to +-122: 22 px air to the table foot (rx 48; visual-qa round 4 measured 12 at +-86 and asked for 20) and its outer edge meets the side sitters' domes only at the far-down fly of both (54 px apart in y)
  { p: [TABLE.cx + 96, TABLE.cy + 36], face: 'back', depth: 'front' },
];
const ISO_LBL = { x: TABLE.cx, y: TABLE.cy + 32 };                 // on the table top's lower half, above the column
const DOC = { cx: TABLE.cx, bottom: TABLE.cy - 26 };               // standing on the far half of the table top
const STD_LBL = { x: TABLE.cx, y: DOC.bottom - 68 - 16 };          // above the document
const FLAG = { x: 1812, gy: ROAD.top + ROAD.h, top: 488, w: 100, h: 56 };  // planted 12 px PAST the road's end cap (1800) on the ground line y 780 (pole 292 px); cloth to 1912, its bow 1918 (after the shift: 1842, 78 px inside the canvas edge); 60 px air to the right sitter's shoulder (1752)
const FLAGG = pennantGeom(FLAG.x, FLAG.top, FLAG.w, FLAG.h);
const BUBBLE = { x: 1470, y: 300, w: 280, h: 96 };                 // above the table scene; its tail lands on the flag's finial
const LBL = 40;
const LBLW = 0.49;                                                 // Kalam 700 mixed case: measured 0.489 ("Downing Street", 260 px / 14 / 38) and 0.50 ("Mastercard") on the round-2 stills; the earlier 0.46 pushed every centred label right
const CAPW = 0.62;                                                 // Kalam 700 CAPS ("HSBC", "ISO"): measured 0.62 em on the round-1 stills
const DIGW = 0.5;                                                  // Kalam 700 digits ("2016"): measured 0.5 em on the round-1 stills
const FLAGW = 0.52;                                                // Kalam 700 "Quant" (a wide Q): measured 0.52 em on the round-1 stills; 27 px leaves 13 px air to the cloth's edges

export const QuantWB14: React.FC<{ penId?: string }> = ({ penId = 'paper-quant' }) => {
  const PEN = PENS[penId] ?? PENS['paper-quant'];
  const FL = FONTS[PEN.fontL];
  const C = (s: string) => (PEN.caps ? s.toUpperCase() : s);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = frame / fps;                 // local seconds
  const at = (cue: number) => T - cue;   // time since a cue (negative = not yet)
  const INK = PEN.colorL;
  const ORANGE = PEN.palette.red;
  const SHIRTS = [PEN.palette.green, PEN.palette.grey];   // the sitters alternate; neither is the table's tint (palette.blue) nor orange-family

  const headX = interpolate(T, ROAD_KEYS_T, ROAD_KEYS_X, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: PEN.bg }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {PEN.floor && <rect x={0} y={ROAD.top + ROAD.h} width={W} height={H - ROAD.top - ROAD.h} fill={PEN.floor} />}
        <g filter={PEN.glow ? 'url(#glow)' : undefined} transform={`translate(${SHIFT_X} 0)`}>
          {/* ===== the road (the ground: painted first so everything stands on it) ===== */}
          <Road x0={ROAD.x0} x1={ROAD.x1} top={ROAD.top} h={ROAD.h} headX={headX} pen={PEN} seed={2} />

          {/* ===== scene 1: the security chief at the road's start ===== */}
          <Person x={FIG.x} gy={FIG.gy} t={at(CUES.chief)} pen={PEN} seed={1} hair="cap" shirt={PEN.palette.blue} shadow="legs" />
          <ShieldCheck cx={BADGE.cx} cy={BADGE.cy} w={BADGE.w} h={BADGE.h} t={at(CUES.badge)} pen={PEN} seed={3} dur={0.5} />
          <Type x={FIG.x} y={FIG.label} text={C('security chief')} t={at(CUES.chiefLabel)} cps={22} size={LBL} font={FL} color={INK} weight="700" charW={LBLW} />

          {/* ===== scene 2: the stops along the road (government, then the banks) ===== */}
          <NumberDoor x={DOOR.x} gy={DOOR.gy} w={DOOR.w} h={DOOR.h} t={at(CUES.door)} pen={PEN} seed={4} />
          {SIGNS.map((sg, i) => (
            <Signpost key={i} x={sg.x} gy={ROAD.top} plateTop={sg.top} w={sg.w} h={SIGN_H} t={at(sg.cue)} pen={PEN} seed={10 + i}>
              <Type x={sg.x} y={sg.top + SIGN_H - 16} text={C(sg.text)} t={at(sg.cue + 0.43)} cps={26} size={SIGN_TXT} font={FL} color={PEN.ink} weight="700" charW={sg.text === 'HSBC' ? CAPW : LBLW} />
            </Signpost>
          ))}

          {/* ===== scene 3: 2016, Quant says ===== */}
          <CalendarFlag x={CAL.x} gy={CAL.gy} top={CAL.top} t={at(CUES.year)} pen={PEN} seed={20}>
            <Type x={CALG.faceCx} y={CALG.faceCy + 15} text="2016" t={at(CUES.year + 0.56)} cps={10} size={LBL} font={FL} color={PEN.ink} weight="700" charW={DIGW} spacing={0.06} />
          </CalendarFlag>
          <PennantFlag x={FLAG.x} gy={FLAG.gy} top={FLAG.top} w={FLAG.w} h={FLAG.h} color={ORANGE} ground t={at(CUES.quant)} pen={PEN} seed={30}>
            <Type x={FLAGG.cx} y={FLAGG.cy + 11} text={C('Quant')} t={at(CUES.quant + 0.47)} cps={16} size={27} font={FL} color={PEN.light} weight="700" charW={FLAGW} />
          </PennantFlag>
          <Callout x={BUBBLE.x} y={BUBBLE.y} w={BUBBLE.w} h={BUBBLE.h} tailBase={[1680, 1718]} tip={[FLAG.x, FLAG.top]} t={at(CUES.says)} pen={PEN} seed={31}>
            <Type x={BUBBLE.x + BUBBLE.w / 2} y={BUBBLE.y + 62} text={C('Quant says')} t={at(CUES.says + 0.45)} cps={22} size={LBL} font={FL} color={PEN.ink} weight="700" charW={LBLW} />
          </Callout>

          {/* ===== scene 4: the ISO committee at the road's end (sitters behind and beside the table first: its opaque top cuts them) ===== */}
          {SITTERS.map((s, i) => s.depth === 'back' && (
            <Sitter key={i} cx={s.p[0]} cy={s.p[1]} face={s.face} shirt={SHIRTS[i % 2]} t={at(CUES.committee + i * 0.07)} pen={PEN} seed={40 + i} />
          ))}
          <RoundTable cx={TABLE.cx} cy={TABLE.cy} gy={TABLE.gy} rx={TABLE.rx} ry={TABLE.ry} color={PEN.palette.blue} t={at(CUES.iso)} pen={PEN} seed={50} />
          <Type x={ISO_LBL.x} y={ISO_LBL.y} text={C('ISO')} t={at(CUES.isoLabel)} cps={12} size={SIGN_TXT} font={FL} color={PEN.ink} weight="700" charW={CAPW} />
          {SITTERS.map((s, i) => s.depth === 'front' && (
            <Sitter key={i} cx={s.p[0]} cy={s.p[1]} face={s.face} shirt={SHIRTS[i % 2]} t={at(CUES.committee + i * 0.07)} pen={PEN} seed={40 + i} />
          ))}
          <Sheet cx={DOC.cx} bottom={DOC.bottom} t={at(CUES.writes)} pen={PEN} seed={60} />
          <Type x={STD_LBL.x} y={STD_LBL.y} text={C('standards')} t={at(CUES.standards)} cps={28} size={SIGN_TXT} font={FL} color={INK} weight="700" charW={LBLW} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

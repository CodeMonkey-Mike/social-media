// whiteboard/beats/CantonWB4.tsx: canton (longform-edited) whiteboard beat WB4, CH4 Beat 3
// (brief: longform-edited/media/canton/assets/whiteboard/WB4.brief.md; cues: assets/whiteboard/WB4.cues.md).
// "Now, the supply. Using the synchronizer costs a fee in Canton Coin, and that coin gets burned. Validators, Super
// Validators and app builders mint new coins as their reward up to 100 billion over the first 10 years and then 2.5
// billion a year. No max supply. So the more it gets used, the more it gets burned."
// Starts blank. The WB2 hub draws at the centre (same component, smaller place), one trade arrow through it. A coin
// (a "CC" mark = Canton Coin, no amount, never a dollar sign) pops on the arrow at a toll tick (FEE, the label stays on the tick) and rides the arrow into
// the hub; it drops out under the hub, a flame draws under it, the coin sinks INTO the flame (clipped by the flame's
// outline) and goes up in smoke (BURNED). Three small figures draw to the right one by one (validator, Super Validator,
// app builder) and a new coin flies out of the hub to each along a dotted trail, landing at hand height (MINTED). A year axis draws under the scene: UP TO 100B over
// the FIRST 10 YEARS (ten year ticks), then 2.5B A YEAR, its right end an OPEN arrow (no end tick, no cap line), NO MAX
// SUPPLY in the Canton yellow (the beat's ONE highlight). Payoff: three more coins ride the arrow into the hub and drop
// into the flame, which grows a step with each.
// Canvas = the full frame 1920 x 1080 @30, 21.9 s (spine 211.500 to 233.400) = 657 frames, no audio. Pen: neon-canton.
// Everything is SVG through rough.js with fixed seeds (no boil, deterministic). Numbers on screen: 100B, 10 (years),
// 2.5B (DATA.md T5 / Pillar 5), the decimal point drawn explicitly; never a cap line, never "max supply 100B", no
// split percentages, no price, no circulating supply.
// The storyboard is the CUES table: LOCAL seconds (0 = spine 211.500), each hung on a spoken word of
// spine/ALL.f.enhanced.medium-words.json; a thing draws as he names it, never before.
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont as loadGochi } from '@remotion/google-fonts/GochiHand';
import { loadFont as loadKalam } from '@remotion/google-fonts/Kalam';
import { loadFont as loadRockSalt } from '@remotion/google-fonts/RockSalt';
import { loadFont as loadHandlee } from '@remotion/google-fonts/Handlee';
import { PENS } from '../pen';
import { Sketch, prog, easeOut } from '../Sketch';
import { Person, Type, bezier } from '../vocab';
import type { Hair } from '../vocab';
import { scaledPen } from '../islands';
import { DotTrail, Flame, OpenHead, SmokeWisp, SyncHub, WireCoin, WobbleLine, YearTicks, flameOuterD } from '../canton';
import type { Quad } from '../canton';

const { fontFamily: GOCHI } = loadGochi();
const { fontFamily: KALAM } = loadKalam('normal', { weights: ['400', '700'] });
const { fontFamily: ROCKSALT } = loadRockSalt();
const { fontFamily: HANDLEE } = loadHandlee();
const FONTS: Record<string, string> = { 'Gochi Hand': GOCHI, Kalam: KALAM, 'Rock Salt': ROCKSALT, Handlee: HANDLEE };

export const FPS = 30;
/** 21.900 s x 30 = 657 frames */
export const DUR = 657;
export const W = 1920;
export const H = 1080;

// ---- the storyboard: LOCAL seconds (spine seconds minus 211.500), the word each cue hangs on ----
const CUES = {
  // scene 1: the fee is burned
  hub: 0.26,          // "Now"               the hub draws at the centre (ring, then the sync mark)
  arrow: 1.38,        // "using"             one trade arrow draws through the hub, left to right
  hubLabel: 2.56,     // "synchronizer"      SYNCHRONIZER types under the arrow, left of the hub
  coin: 3.52,         // "a" (fee)           a coin pops on the arrow
  fee: 3.84,          // "fee"               FEE types over the coin; a toll tick draws on the shaft under it (the label's anchor once the coin leaves)
  pay: 4.26,          // "Canton" (coin)     the coin rides the arrow off the toll tick into the hub
  drop: 5.72,         // "coin" (that coin)  the coin drops out under the hub
  burn: 6.26,         // "burned."           a flame draws under the hub, the coin sinks into it and goes up in smoke; BURNED types
  // scene 2: three roles mint new coins
  val: 7.34,          // "Validators,"       the first figure draws; VALIDATOR types under it
  sup: 8.38,          // "super"             the second figure draws; SUPER types under it
  supB: 8.52,         // "validators"        VALIDATOR types under SUPER
  app: 9.40,          // "app"               the third figure draws; APP types under it
  appB: 9.64,         // "builders"          BUILDER types under APP
  minted: 9.96,       // "mint"              MINTED types over the fan
  mint: 10.18,        // "new"               three new coins leave the hub one after another, each on its dotted trail, and land at a figure's hand (by 11.0, under "coins")
  // scene 3: the minting timeline
  axis: 11.92,        // "up"                the year axis draws, left to right, running a little past where the 10-year mark will stand
  up: 11.92,          // "up"                UP types over it (once the stroke has passed under it)
  upTo: 12.52,        // "to"                TO types after it
  b100: 12.76,        // "100"               100B types after it
  first: 13.80,       // "first"             FIRST types under the axis
  ten: 14.08,         // "10"                10 types; ten year ticks draw along the axis
  years: 14.38,       // "years"             YEARS types
  then: 15.44,        // "then"              the axis carries on to the right and ends in an OPEN arrowhead (no end tick)
  b25: 15.64,         // "2"                 2 types over the new stretch
  b25b: 15.84,        // ".5"                the decimal point and 5B
  aYear: 16.56,       // "a"                 A types
  year: 16.80,        // "year."             YEAR types; the year ticks carry on along the new stretch
  no: 17.60,          // "No"                NO types under the open end (the Canton yellow)
  max: 17.72,         // "max"               MAX types
  supply: 18.02,      // "supply."           SUPPLY types
  // payoff: the more it gets used, the more it gets burned
  used1: 19.18,       // "more"              a coin rides the arrow into the hub and drops into the flame (0.7 s)
  used2: 19.50,       // "gets"              a second coin
  used3: 19.72,       // "used,"             a third coin; the flame grows a step as each lands (19.88, 20.20, 20.42: "the more it gets burned")
};
/** a payoff coin's trip: along the arrow into the hub, then down into the flame */
const TRIP = 0.7;

// ---- layout (1920 x 1080) ----
const HUB = { cx: 960, cy: 330, r: 74 };
const ARROW = { y: 330, x0: 200, x1: HUB.cx - HUB.r - 12, x2: HUB.cx + HUB.r + 12, x3: 1156, head: 24 };
// the toll tick on the shaft: the fee coin pops ON it (riding the line, the line knocked out behind it), FEE stands over it
const TOLL = { x: 640, h: 30, labelY: ARROW.y - 40 };
const COIN = { x: TOLL.x, y: ARROW.y, r: 24 };
const FLAME = { cx: 960, baseY: 640, h: 104 };
const REST = { x: 960, y: 462 };                                    // where the coin hangs under the hub before it burns
const HEART = { x: 962, y: FLAME.baseY - 36 };                      // the flame's heart: where coins end
const FIG = { k: 0.55, gy: 566, xs: [1330, 1545, 1760] };
// the minted coins land at HAND height on each figure's left (the side it looks to): the hand's ink ends at x - 24,
// then ~20 px of air, then the coin (r 20 + its rim)
const MINT = { r: 20, dx: -67, y: FIG.gy - 64 };
// the three mint trails: from the hub's upper right flank (above the arrow's stub), arcing over the heads before them
const hubPt = (deg: number, k = 1.1): [number, number] => [HUB.cx + HUB.r * k * Math.cos((deg * Math.PI) / 180), HUB.cy + HUB.r * k * Math.sin((deg * Math.PI) / 180)];
const TRAILS: Quad[] = [
  [hubPt(-24), [1215, 196], [FIG.xs[0] + MINT.dx, MINT.y]],
  [hubPt(-44), [1335, 96], [FIG.xs[1] + MINT.dx, MINT.y]],
  [hubPt(-64), [1560, 30], [FIG.xs[2] + MINT.dx, MINT.y]],
];
/** arc length of a quadratic from 0 to parameter `u` (sampled) */
const quadLen = (q: Quad, u = 1) => {
  let len = 0, prev = q[0];
  for (let i = 1; i <= 80; i++) { const pt = bezier(q[0], q[1], q[2], (u * i) / 80); len += Math.hypot(pt[0] - prev[0], pt[1] - prev[1]); prev = pt; }
  return len;
};
const TRAIL_LEN = TRAILS.map((q) => quadLen(q));
/** the dots stop this far (px) short of the coin's centre: its rim (r 20 + the stroke) and ~10 px of air */
const TRAIL_GAP = 34;
// the first stroke runs `over` px PAST the 10-year mark: the mark is a tick ON a line that carries on, never the line's
// end (a line that stopped on a tall tick read as a cap on 100B between "10 years" and "then")
const AXIS = { y: 902, x0: 200, x10: 1000, over: 56, x1: 1716, step: 80 };

export const CantonWB4: React.FC<{ penId?: string }> = ({ penId = 'neon-canton' }) => {
  const PEN = PENS[penId] ?? PENS['neon-canton'];
  const FH = FONTS[PEN.fontH], FL = FONTS[PEN.fontL];
  const C = (s: string) => (PEN.caps ? s.toUpperCase() : s);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = frame / fps;                 // local seconds
  const at = (cue: number) => T - cue;   // time since a cue (negative = not yet)

  const Pa = PEN.palette, L = PEN.colorL, HI = PEN.colorH;
  const SMALL = scaledPen(PEN, FIG.k, 'wb4fig');
  const sw = PEN.inkWidth + 1.6;

  // ---- the fee coin: on the arrow -> into the hub -> out under it -> into the flame, gone ----
  const payU = easeOut(prog(at(CUES.pay), 0, 0.6));
  const dropU = easeOut(prog(at(CUES.drop), 0, 0.4));
  const sinkU = prog(at(CUES.burn), 0.3, 0.5);
  let fee: { x: number; y: number; k: number; op: number };
  {
    let x = COIN.x + (HUB.cx - COIN.x) * payU, y = COIN.y, k = 1 - 0.2 * payU;
    if (dropU > 0) { x = HUB.cx + (REST.x - HUB.cx) * dropU; y = HUB.cy + (REST.y - HUB.cy) * dropU; }
    if (sinkU > 0) { x = REST.x + (HEART.x - REST.x) * sinkU; y = REST.y + (HEART.y - REST.y) * sinkU; k = 0.8 - 0.3 * sinkU; }
    fee = { x, y, k, op: 1 - prog(sinkU, 0.55, 0.45) };
  }
  // the smoke of the first burn thins out once the figures start
  const smokeOp = 1 - prog(at(CUES.val), 0.6, 1.2);

  // ---- the payoff coins and the flame's growth ----
  const used = [CUES.used1, CUES.used2, CUES.used3];
  const trip = (cueT: number) => {
    const u = prog(at(cueT), 0, TRIP);
    if (u <= 0 || u >= 1) return null;
    const a = prog(u, 0, 0.56), b = prog(u, 0.56, 0.44);
    const ae = a * a * (3 - 2 * a);
    const x = b > 0 ? HUB.cx + (HEART.x - HUB.cx) * b : ARROW.x0 + 40 + (HUB.cx - ARROW.x0 - 40) * ae;
    const y = b > 0 ? HUB.cy + (HEART.y - HUB.cy) * b * b : ARROW.y;
    return { x, y, k: (b > 0 ? 0.8 - 0.3 * b : 1 - 0.2 * prog(a, 0.72, 0.28)), op: Math.min(1, u * 8) * (1 - prog(b, 0.7, 0.3)) };
  };
  const grow = 1 + used.reduce((acc, c) => acc + 0.17 * easeOut(prog(at(c), TRIP, 0.22)), 0);

  // ---- a role: a small figure, its label in one or two lines under its feet ----
  const role = (i: number, cueT: number, hair: Hair, shirt: string, seed: number, lines: [string, number, number][]) => {
    const x = FIG.xs[i];
    return (
      <g>
        <g transform={`translate(${x} ${FIG.gy}) scale(${FIG.k}) translate(${-x} ${-FIG.gy})`}>
          <Person x={x} gy={FIG.gy} t={at(cueT)} pen={SMALL} seed={seed} hair={hair} shirt={shirt} dur={0.7} shadow="feet" gaze="left" />
        </g>
        {lines.map(([txt, c, dx], j) => (
          <Type key={j} x={x + dx} y={FIG.gy + 44 + j * 33} text={C(txt)} t={at(c) - 0.3} cps={24} size={27} font={FL} color={L} charW={PEN.charWL} />
        ))}
      </g>
    );
  };

  const ticks1 = Array.from({ length: 11 }, (_, i) => AXIS.x0 + i * AXIS.step);
  const ticks2 = Array.from({ length: 8 }, (_, i) => AXIS.x10 + (i + 1) * AXIS.step);
  const NUM_Y = 866, SUB_Y = 978;
  const UP_X = 438, TO_X = 514, B100_X = 600;
  // a coin that goes INTO the flame: visible above the flame's tip and inside the flame's outline, nowhere else
  const tipY = FLAME.baseY - FLAME.h * grow;

  return (
    <AbsoluteFill style={{ backgroundColor: PEN.bg }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* a soft edge under the tip (a hard clip line cut the coin flat across, which read as a render edge) */}
          <linearGradient id="wb4-tip-fade" gradientUnits="userSpaceOnUse" x1={0} y1={tipY - 36} x2={0} y2={tipY + 2}>
            <stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#000000" />
          </linearGradient>
          <mask id="wb4-into-flame" maskUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
            <rect x={0} y={0} width={W} height={H} fill="url(#wb4-tip-fade)" />
            <path d={flameOuterD(FLAME.h)} transform={`translate(${FLAME.cx} ${FLAME.baseY}) scale(${grow})`} fill="#ffffff" />
          </mask>
        </defs>
        <g filter={PEN.glow ? 'url(#glow)' : undefined}>
          {/* ===== scene 1: the hub, one trade arrow through it, the fee, the burn ===== */}
          <SyncHub cx={HUB.cx} cy={HUB.cy} r={HUB.r} t={at(CUES.hub)} pen={PEN} seed={21} dur={0.8} />
          <WobbleLine x1={ARROW.x0} x2={ARROW.x1} y={ARROW.y} progress={easeOut(prog(at(CUES.arrow), 0, 0.5))} pen={PEN} seed={61} strokeWidth={sw} seg={150} />
          <WobbleLine x1={ARROW.x2} x2={ARROW.x3} y={ARROW.y} progress={prog(at(CUES.arrow), 0.5, 0.15)} pen={PEN} seed={62} strokeWidth={sw} />
          <OpenHead x={ARROW.x3 + 2} y={ARROW.y} head={ARROW.head} t={at(CUES.arrow) - 0.62} pen={PEN} seed={63} strokeWidth={sw} dur={0.2} />
          <Type x={852} y={452} text={C('synchronizer')} t={at(CUES.hubLabel)} cps={26} size={34} font={FL} color={L} anchor="end" charW={PEN.charWL} />

          {/* FEE belongs to the toll tick on the shaft: the coin pops on it, pays, leaves; the label keeps its anchor */}
          <YearTicks xs={[TOLL.x]} y={ARROW.y} h={TOLL.h} t={at(CUES.fee)} pen={PEN} seed={68} dur={0.15} strokeWidth={sw} />
          <Type x={TOLL.x} y={TOLL.labelY} text={C('fee')} t={at(CUES.fee)} cps={16} size={40} font={FL} color={L} charW={PEN.charWL} />
          {/* every coin that burns is drawn UNDER the flame and masked by it: it goes into the flame, never over its tip */}
          <g mask="url(#wb4-into-flame)">
            <WireCoin cx={fee.x} cy={fee.y} r={COIN.r} t={at(CUES.coin)} pen={PEN} seed={64} k={fee.k} opacity={fee.op} mark="CC" font={FL} knock />
            {/* payoff: more coins ride the arrow in and drop into the flame, which grows */}
            {used.map((c, i) => {
              const p = trip(c);
              return p ? <WireCoin key={i} cx={p.x} cy={p.y} r={COIN.r} pen={PEN} seed={96 + i} k={p.k} opacity={p.op} mark="CC" font={FL} knock /> : null;
            })}
          </g>

          <Flame cx={FLAME.cx} baseY={FLAME.baseY} h={FLAME.h} t={at(CUES.burn)} pen={PEN} seed={65} grow={grow} />
          <SmokeWisp x={950} y={520} len={84} lean={-30} t={at(CUES.burn) - 0.62} pen={PEN} seed={66} opacity={smokeOp} />
          <SmokeWisp x={980} y={524} len={70} lean={30} t={at(CUES.burn) - 0.74} pen={PEN} seed={67} opacity={smokeOp} />
          <Type x={846} y={626} text={C('burned')} t={at(CUES.burn) - 0.1} cps={18} size={40} font={FL} color={L} anchor="end" charW={PEN.charWL} />

          {/* ===== scene 2: validator, Super Validator, app builder; a new coin to each ===== */}
          {role(0, CUES.val, 'cap', Pa.blue, 71, [['validator', CUES.val, 0]])}
          {role(1, CUES.sup, 'bob', Pa.green, 72, [['super', CUES.sup, 0], ['validator', CUES.supB, 0]])}
          {role(2, CUES.app, 'curly', Pa.brown, 73, [['app', CUES.app, 0], ['builder', CUES.appB, 0]])}
          <Type x={1400} y={112} text={C('minted')} t={at(CUES.minted)} cps={20} size={40} font={FL} color={L} charW={PEN.charWL} />
          {TRAILS.map((q, i) => {
            const u = prog(at(CUES.mint), i * 0.14, 0.5), e = u * u * (3 - 2 * u);
            if (u <= 0) return null;
            const [x, y] = bezier(q[0], q[1], q[2], e);
            return (
              <g key={i}>
                <DotTrail p0={q[0]} p1={q[1]} p2={q[2]} p={Math.max(0, (quadLen(q, e) - TRAIL_GAP) / TRAIL_LEN[i])} pen={PEN} seed={81 + i} color={Pa.brown} />
                <WireCoin cx={x} cy={y} r={MINT.r} pen={PEN} seed={84 + i} k={0.5 + 0.5 * prog(u, 0, 0.4)} mark="CC" font={FL} />
              </g>
            );
          })}

          {/* ===== scene 3: the minting timeline, its right end OPEN ===== */}
          <WobbleLine x1={AXIS.x0} x2={AXIS.x10 + AXIS.over} y={AXIS.y} progress={easeOut(prog(at(CUES.axis), 0, 0.6))} pen={PEN} seed={91} strokeWidth={sw} seg={160} />
          {/* two words = two Type elements, each on its own spoken word, the ink gap measured on the still */}
          <Type x={UP_X} y={NUM_Y} text={C('up')} t={at(CUES.up) - 0.3} cps={24} size={38} font={FL} color={L} anchor="start" spacing={0.05} />
          <Type x={TO_X} y={NUM_Y} text={C('to')} t={at(CUES.upTo)} cps={24} size={38} font={FL} color={L} anchor="start" spacing={0.05} />
          <Type x={B100_X} y={NUM_Y} text="100B" t={at(CUES.b100)} cps={20} size={58} font={FL} color={L} anchor="start" spacing={0.04} />
          <Type x={452} y={SUB_Y} text={C('first')} t={at(CUES.first)} cps={24} size={36} font={FL} color={L} anchor="start" />
          <Type x={572} y={SUB_Y} text="10" t={at(CUES.ten)} cps={24} size={36} font={FL} color={L} anchor="start" spacing={0.04} />
          <Type x={630} y={SUB_Y} text={C('years')} t={at(CUES.years)} cps={24} size={36} font={FL} color={L} anchor="start" />
          <YearTicks xs={ticks1.slice(1, 10)} y={AXIS.y} h={18} t={at(CUES.ten)} pen={PEN} seed={92} dur={0.45} />
          {/* year 0 and year 10 stand taller: the 10-year mark is a mark ON the line, the line runs on through it */}
          <YearTicks xs={[AXIS.x0]} y={AXIS.y} h={40} t={at(CUES.axis)} pen={PEN} seed={97} dur={0.15} strokeWidth={sw} />
          <YearTicks xs={[AXIS.x10]} y={AXIS.y} h={40} t={at(CUES.ten) - 0.45} pen={PEN} seed={98} dur={0.15} strokeWidth={sw} />

          <WobbleLine x1={AXIS.x10 + AXIS.over} x2={AXIS.x1} y={AXIS.y} progress={easeOut(prog(at(CUES.then), 0, 0.5))} pen={PEN} seed={93} strokeWidth={sw} seg={160} />
          {/* 2.5B: the decimal point is its own drawn dot, clear air both sides (a hand-font swallows it) */}
          <Type x={1196} y={NUM_Y} text="2" t={at(CUES.b25)} cps={20} size={58} font={FL} color={L} anchor="start" />
          {at(CUES.b25b) > 0 && <circle cx={1243} cy={NUM_Y - 5} r={5.2} fill={L} />}
          <Type x={1259} y={NUM_Y} text="5B" t={at(CUES.b25b) - 0.04} cps={20} size={58} font={FL} color={L} anchor="start" spacing={0.04} />
          <Type x={1358} y={NUM_Y} text={C('a')} t={at(CUES.aYear)} cps={24} size={38} font={FL} color={L} anchor="start" />
          <Type x={1402} y={NUM_Y} text={C('year')} t={at(CUES.year)} cps={24} size={38} font={FL} color={L} anchor="start" />
          <YearTicks xs={ticks2} y={AXIS.y} h={18} t={at(CUES.year)} pen={PEN} seed={94} dur={0.45} />
          {/* the OPEN head lands with the stroke: the line never shows a blunt end */}
          <OpenHead x={AXIS.x1 + 4} y={AXIS.y} head={30} t={at(CUES.then) - 0.42} pen={PEN} seed={95} strokeWidth={sw} dur={0.22} />
          {/* the beat's ONE highlight: three words = three Type elements (Rock Salt's own space does not separate caps) */}
          <Type x={1262} y={SUB_Y + 8} text="NO" t={at(CUES.no)} cps={18} size={40} font={FH} color={HI} anchor="start" />
          <Type x={1362} y={SUB_Y + 8} text="MAX" t={at(CUES.max)} cps={18} size={40} font={FH} color={HI} anchor="start" />
          <Type x={1490} y={SUB_Y + 8} text="SUPPLY" t={at(CUES.supply)} cps={20} size={40} font={FH} color={HI} anchor="start" />

        </g>
      </svg>
    </AbsoluteFill>
  );
};

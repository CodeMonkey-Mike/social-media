// whiteboard/beats/QuantWB4.tsx: whiteboard beat WB4 of the longform-edited video `quant`
// (brief: media/quant/assets/whiteboard/WB4.brief.md; cues: assets/whiteboard/WB4.cues.md).
// Quant's own worked example (DATA.md section 2, the 2026-10-27 perspectives piece): a manufacturer in London paying a
// supplier in Singapore in three steps. The stage is the sea with WB3's orange layer band faint in the sky. On
// "manufacturer" island A (WB1's front-left island: land, palm, bank, vault) draws on and a small FACTORY stands at its
// shore tip facing Singapore; on "London" the label types under it. On "supplier" island B (WB1's front-right island)
// draws on with a person (the supplier) standing low on the land at its right, reaching out; on "Singapore" its label
// types. Step one: on "lock." the heading "lock" types in orange over London; on "locks" a short stack of coins pops at
// the London bank's doorstep (right beside its steps: the bank locks the money); on "manufacturer's" a PADLOCK draws on
// top of the coins, open; on "money" its shackle clicks shut. Step two: on "credit." the heading "credit" types in orange
// over Singapore; on "credits" an orange arrow leaves the padlock straight up past the factory, arcs over the water and
// drops onto the cheque's spot; on "supplier" a cheque pops into his hand (the hand is painted over its edge); on
// "against" a dotted tie runs back from the cheque's corner, over the orange arc, and drops vertically onto the padlock
// (its head lands on "lock"). Step three: on "settle." the heading "settle" types in orange IN THE CHANNEL under the
// two banks' arrow (the sky row stays lock, then credit: step order left to right); on "settle (with each other)" a
// two-way arrow draws in the channel between the two banks; on "next" a clock face draws above it and on "window" its
// hands spin; on "released" the padlock opens (the clock stops). On "new" a plain new coin with a sparkle pops in the
// channel and on "asset" an orange X strikes it (no new asset); on "never" a dashed boundary draws around both islands as
// one stroke (the money never left the banking system); on "regulated" a shield pops on each vault door.
// Payoff: the open padlock, the two shields, the boundary, the struck coin, held ~1 s before the compositor's fade.
// Canvas = the full frame 1920 x 1080 @30, spine 121.760 to 151.760 s = 30.0 s = 900 frames, no audio; the comp build
// fades it in and out. Pen: paper-quant (the orange accents are the brief's: the three step headings, the credit arrow,
// the X through the coin; the faint band is WB3's). Everything is SVG through rough.js with fixed seeds (no boil,
// deterministic). No numbers on screen (none allowed), no amounts (the cheque's amount box is an empty squiggle), no
// currencies (the new coin carries no mark), no bank names (the islands are labelled by city, as the example is), nothing
// about the window's timing (the clock has no numbers). Two islands exactly, from `QUANT_ISLANDS` (islands.tsx) with
// WB1's seeds so they are the same drawings as WB1 / WB2 / WB3 (no ledger this time).
// The storyboard is the CUES table below: LOCAL seconds (0 = spine 121.760), each hung on a spoken word of
// `spine/ALL.f.enhanced.medium-words.json`; a thing draws as he names it, never before.
// Round 3 (2026-11-05, after visual-qa on the round-2 stills): the supplier stands lower on the land (the coast ran
// through his shoulders and read as a second arm) at 0.5 scale with his curls moved off the right eye; the cheque is
// held (the hand overlaps its edge and is painted over it), smaller, with the signature clear of the amount box; the
// lock moved from the shore tip to the bank's doorstep so the tie can arrive from above on the land side of the coast,
// and the factory took the tip (one smoke puff, under the coastline); both arcs are cubics (steep take-off, steep landing);
// the step headings take 0.1 em letter-spacing (Gochi Hand fused "it" / "tt" into an H); "settle" moved into the
// channel; the token is a plain round coin with a sparkle (r 45, no "$") under a wider X; the boundary widened to clear
// the islands' outer wave ticks by 30 px; the shields pop in 0.3 s so the payoff holds ~1 s.
// Round 4 (2026-11-05, after visual-qa on the round-3 stills): the three step headings are set in the LABEL font (Kalam
// 700, orange): Gochi Hand's "s" closes its lower bowl and "settle" read "8ettle" on a beat with no numbers allowed; the
// tie ends 10 px higher and the released shackle lifts 3 px instead of 6, so the arrowhead stands ~18 px clear of the
// OPEN shackle's apex (it was 4 px); the new coin's sparkle sits at 68 degrees up-right, 1.36 r out, its lower tip ~7 px
// clear of the rim (it was inside it) and ~14 px off the X's arm; the dashed boundary's left edge moved in from 22 to 70
// (it was 21 px from the frame edge against 160 on the right): the two left wave ticks that forced it out are gone
// (`Island wavesL={false}`, the sea tick at x 58 dropped) and two sea ticks sit inside the boundary left of the island.
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont as loadGochi } from '@remotion/google-fonts/GochiHand';
import { loadFont as loadKalam } from '@remotion/google-fonts/Kalam';
import { loadFont as loadRockSalt } from '@remotion/google-fonts/RockSalt';
import { loadFont as loadHandlee } from '@remotion/google-fonts/Handlee';
import { PENS } from '../pen';
import { Person, Type } from '../vocab';
import { easeOut, prog } from '../Sketch';
import { CrossOut } from '../welfare';
import { CurvedArrow } from '../money';
import { LayerBand } from '../bank';
import { ClockFace, Island, QUANT_ISLANDS, Sea, islandGeom, scaledPen } from '../islands';
import { ShieldCheck } from '../deposits';
import { CoinStack, DashedBoundary, DottedCurve, Factory, NewCoin, Padlock, PayCheck, TwoWayArrow, coinStackGeom, padlockGeom } from '../settlement';

const { fontFamily: GOCHI } = loadGochi();
const { fontFamily: KALAM } = loadKalam('normal', { weights: ['400', '700'] });
const { fontFamily: ROCKSALT } = loadRockSalt();
const { fontFamily: HANDLEE } = loadHandlee();
const FONTS: Record<string, string> = { 'Gochi Hand': GOCHI, Kalam: KALAM, 'Rock Salt': ROCKSALT, Handlee: HANDLEE };

export const FPS = 30;
/** 30.0 s x 30 = 900 frames (spine 121.760 to 151.760) */
export const DUR = 900;
export const W = 1920;
export const H = 1080;

// ---- the storyboard: LOCAL seconds (spine seconds minus 121.760), the word each cue hangs on ----
const CUES = {
  stage: 0.0,        // "Quant's"        the coast, the sea and WB3's layer band faint in the sky (the stage; under the compositor's fade-in)
  islandA: 1.60,     // "manufacturer"   island A draws on (land, palm; its bank at +0.1, its vault door at +0.3)
  factory: 2.20,     // "manufacturer"   (held; the land is complete) a small factory draws at the island's shore tip, facing Singapore
  london: 2.54,      // "London"         "London" types under island A
  islandB: 3.58,     // "supplier"       island B draws on (land, palm, bank, vault)
  supplier: 3.86,    // "supplier"       (held) the supplier draws low on island B's right, reaching out to his right
  singapore: 4.08,   // "Singapore"      "Singapore" types under island B
  lockWord: 6.50,    // "lock."          "lock" types in orange over London
  coins: 7.66,       // "locks"          a short stack of coins pops at the London bank's doorstep
  padlock: 8.22,     // "manufacturer's" a padlock draws on top of the coins, its shackle open (0.5 s)
  click: 8.92,       // "money"          the shackle clicks shut (0.15 s)
  creditWord: 11.90, // "credit."        "credit" types in orange over Singapore
  credit: 13.48,     // "credits"        an orange arrow leaves the padlock, arcs over the water, drops onto the cheque's spot (0.9 s; the head lands ~14.3)
  check: 14.14,      // "supplier"       a cheque pops into the supplier's hand (0.3 s)
  tie: 15.14,        // "against"        a dotted tie runs from the cheque's corner back over the arc and drops onto the padlock (1.0 s; its head lands ~16.1 = "lock")
  settleWord: 18.36, // "settle."        "settle" types in orange in the channel, under the two banks' arrow
  settle: 19.44,     // "settle"         (with each other) a two-way arrow draws in the channel between the two banks (0.6 s)
  clock: 20.68,      // "next"           a clock face draws above the arrow (0.5 s)
  spin: 20.96,       // "window"         its hands spin (time passes; no numbers)
  release: 22.60,    // "released"       the padlock's shackle lifts open (0.35 s); the clock stops
  token: 23.42,      // "new"            a new coin (plain, a sparkle) pops in the channel above the clock (0.35 s)
  strike: 23.70,     // "asset"          an orange X strikes it out (0.45 s)
  boundary: 24.78,   // "never"          a dashed boundary draws around both islands as one stroke, top-left clockwise (1.3 s, done 26.1)
  shields: 28.28,    // "regulated"      a shield with a check pops on each vault door, London first, Singapore 0.12 s later (0.3 s each, done 28.7; the compositor's fade starts at 29.7)
};

// ---- layout ----
const [IA, IB] = QUANT_ISLANDS;                            // London = WB1's island A (front left), Singapore = island B (front right)
const GA = islandGeom(IA), GB = islandGeom(IB);
const SEA_HORIZON = 300;
// wave ticks in open water, clear of the islands, the labels, the boundary line (22..1760 x 380..895, 30 px either side),
// the arcs and the channel's business
// (round 4: the tick at x 58 is gone, it sat on the boundary's new left edge; two ticks inside it left of London instead:
// [104, 530] is 34 px inside the edge and ~40 px up-left of the palm's top frond, [100, 770] 30 px inside it and ~70 px
// off the land's left shore)
const TICKS: [number, number][] = [
  [260, 930], [520, 985], [900, 1000], [1250, 960], [1560, 1000], [1800, 930], [560, 1035], [1000, 1040], [1700, 1040],
  [1850, 700], [1850, 500], [1800, 330], [104, 530], [100, 770], [300, 338], [1150, 336], [540, 470], [760, 848], [1640, 470],
];
// WB3's layer band, faint: 220..1700 x 117..203, "Quant" on it
const BAND = { x: 220, y: 117, w: 1480, h: 86 };
const BAND_GHOST = 0.35;
const QUANT = { size: 58, y: BAND.y + 55 };
const QUANT_W = 0.5, QUANT_SP = 0.1;                       // Gochi Hand 700 ~0.50 em per glyph, letter-spaced 0.1 em (quant WB12)
// the step headings: the LABEL font (Kalam 700) at 54 px in orange (visual-qa round 3: Gochi Hand's "s" closes its lower
// bowl and "settle" read "8ettle"; round 2: Gochi fused "it" / "tt" into an H). "lock" and "credit" in the sky between the
// band (bottom 203) and the coast (288..312), each over its city; "settle" in the channel under the two banks' arrow, so
// the row reads lock, credit, then settle below
const HEAD = { size: 54, y: 262, lock: IA.cx, credit: IB.cx, settle: [906, 840] as [number, number] };
const HEADW = { lock: 0.44, credit: 0.43, settle: 0.43 };   // Kalam 700 lowercase at 54 px, per word (l / i / t are narrow, o / c / k wide): measured on the round-4 stills, each word's ink centre within 1 px of its anchor ("lock" inks 91 px, "credit" 137, "settle" 138)
// the factory at London's shore tip facing Singapore: 606..676, 70 tall (658..728); the coast there runs 619 (x 606) to
// 641 (x 676), its one smoke puff (617, 647, r 7) 18 px under the coast; the land's bottom edge 16 px under its corner
const FACTORY = { x: 606, gy: 728, w: 70 };
// the money at the London bank's doorstep (the bank's steps end at x 503 on the ground line 695): three coins on
// (548, 758), 21 px right of the steps, the padlock standing on the top coin (body 528..568 x 687..717, shackle top 666
// shut, ~658 open at a 3 px lift); the coast above it is at 608, so the tie can arrive from above on the land side
const COINS = { cx: 548, baseY: 758, n: 3, rx: 24, ry: 7, th: 9 };
const CSG = coinStackGeom(COINS.cx, COINS.baseY, COINS.n, COINS.rx, COINS.ry, COINS.th);
const LOCK = { cx: COINS.cx, cy: CSG.top - 15, w: 40, h: 30, lift: 3, tilt: 30 };   // round 4: the open shackle lifts 3 px (was 6) so the tie's head keeps its air
const LG = padlockGeom(LOCK.cx, LOCK.cy, LOCK.w, LOCK.h);
// the supplier low on Singapore's right, 0.5 scale (feet at 778, 24 px above the land's bottom edge there): his
// shoulders (676) sit 48 px under the coast (627 at his x), the coast disappears behind his dark curls on both sides
// (at 772 it exited at the head's outline); 20 px of air between his left arm (1464) and the bank's steps (1443); his
// hand lands at (1536.5, 705.5)
const SUP = { x: 1482, gy: 778, k: 0.5 };
const HAND: [number, number] = [SUP.x + 109 * SUP.k, SUP.gy - 215 * SUP.k + 70 * SUP.k];
// the cheque in his hand: its left edge 4 px inside the hand's centre (the hand is painted OVER it: the cheque is in DOM
// order before the person), 92 x 48 at 1532.5..1624.5 x 681.5..729.5, 24 px inside the land's right edge (1649)
const CHECK = { w: 92, h: 48, cx: HAND[0] - 4 + 46, cy: HAND[1] };
// the credit arc (orange, a cubic): from the padlock body's right side straight up (19 px clear of the factory's puff,
// 20 px of the factory's box), its peak ~471 at x ~1050, 44 px over Singapore's pediment, 54 px over the supplier's hair,
// dropping at 70 degrees onto the cheque's top (7 px above its edge, 18 px right of its centre)
const CREDIT = { p0: [LG.right + 12, LOCK.cy - 2] as [number, number], c1: [570, 400] as [number, number], c2: [1500, 400] as [number, number], p2: [CHECK.cx + 18, CHECK.cy - CHECK.h / 2 - 7] as [number, number] };
// the tie (dotted ink, a cubic): from the cheque's top-right corner, up and over ABOVE the credit arc (peak ~420 at
// x ~1100, 40 px under the boundary's top, 42 px over the arc where they run closest), down to the padlock, arriving
// at 94 degrees (vertical) with its tip ~18 px above the OPEN shackle's apex (round 4: it was 4 px; the tie ends 10 px
// higher and the shackle lifts 3 px less) and its head's back ~17 px under the coast
const TIE = { p0: [CHECK.cx + CHECK.w / 2, CHECK.cy - CHECK.h / 2] as [number, number], c1: [1660, 340] as [number, number], c2: [560, 340] as [number, number], p2: [LOCK.cx - 8, LG.shackleTop - 28] as [number, number] };
// the channel between the islands (A's right tip (720, 695), B's left (1080, 724), B's palm fronds from ~1065):
const SETTLE = { x1: 750, x2: 1062, y: 775 };               // the two-way arrow in the water, both heads clear of the land
const CLOCK = { cx: 850, cy: 700, r: 38 };                  // above the arrow's left half: 812..888 x 662..738, 29 px right of A's wave tick (ends 783)
const TOKEN = { cx: 985, cy: 600, r: 45 };                  // 940..1030 x 555..645 (its X 929..1041 x 544..656): 64 px under the credit arc, 24 px left of B's palm fronds, 41 px right of the clock
const SPARKLE: [number, number] = [0.55, -1.36];            // the sparkle's centre in r about the coin: 68 degrees up-right, its lower tip ~7 px clear of the rim, ~14 px off the X's upper-right arm (round 4; at (0.5, -1.12) the tip was inside the rim)
const TOKEN_X = 56;                                         // the X's half size about the coin: its arms run past the rim, so the rim shows between them
// the boundary around both banks: 70..1760 x 380..895 (round 4: the left edge moved in from 22, which was 21 px from the
// frame edge against 160 on the right; island A's left wave tick is dropped (`wavesL={false}`) so nothing forces it out;
// the land's left shore (140) is 70 px inside it, B's right tick 1695..1723 30 px inside; the tie's peak 420 inside; the
// headings outside above; the city labels and "settle" inside)
const BOUNDARY = { x: 70, y: 380, w: 1690, h: 515, r: 70 };
// the city labels under the islands (A's bottom 790, B's 810): Kalam 700 44 px, ink
const LABEL = { y: 866, size: 44 };
const LBLW = 0.46;                                          // Kalam 700 measured ~0.46 em per glyph (quant WB12 stills)
const SHIELD = { w: 44, h: 50 };                            // on each vault door (r 36)

export const QuantWB4: React.FC<{ penId?: string }> = ({ penId = 'paper-quant' }) => {
  const PEN = PENS[penId] ?? PENS['paper-quant'];
  const FH = FONTS[PEN.fontH], FL = FONTS[PEN.fontL];
  const C = (s: string) => (PEN.caps ? s.toUpperCase() : s);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = frame / fps;                 // local seconds
  const at = (cue: number) => T - cue;   // time since a cue (negative = not yet)
  const ORANGE = PEN.palette.red, INK = PEN.colorL;

  // the padlock: draws open, clicks shut on "money", lifts open again on "released"
  const shut = easeOut(prog(at(CUES.click), 0, 0.15));
  const released = easeOut(prog(at(CUES.release), 0, 0.35));
  const open = Math.max(1 - shut, released);
  // the clock's hands spin from "window" until the lock is released
  const spinT = Math.min(at(CUES.spin), Math.max(0, CUES.release - CUES.spin));

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
          {/* ===== scene 1: the stage (the sea, the layer band faint), London and Singapore ===== */}
          <Sea horizon={SEA_HORIZON} ticks={TICKS} t={at(CUES.stage)} pen={PEN} seed={1} />
          <g opacity={BAND_GHOST}>
            <LayerBand x={BAND.x} y={BAND.y} w={BAND.w} h={BAND.h} t={at(CUES.stage) + 1} pen={PEN} seed={5} shadow={0} />
            <Type x={BAND.x + BAND.w / 2} y={QUANT.y} text={C('Quant')} t={at(CUES.stage) + 1} cps={100} size={QUANT.size} font={FH} color={PEN.colorH} weight="700" charW={QUANT_W} spacing={QUANT_SP} />
          </g>
          <Island {...IA} t={at(CUES.islandA)} bankT={at(CUES.islandA) - 0.1} vaultT={at(CUES.islandA) - 0.3} pen={PEN} seed={10} wavesL={false} />
          <Factory x={FACTORY.x} gy={FACTORY.gy} w={FACTORY.w} t={at(CUES.factory)} pen={PEN} seed={20} smoke={1} />
          <Type x={IA.cx} y={LABEL.y} text={C('London')} t={at(CUES.london)} cps={20} size={LABEL.size} font={FL} color={INK} weight="700" charW={LBLW} />
          <Island {...IB} t={at(CUES.islandB)} bankT={at(CUES.islandB) - 0.1} vaultT={at(CUES.islandB) - 0.3} pen={PEN} seed={11} />
          {/* the cheque is painted BEFORE the supplier so his hand sits over its edge (he holds it) */}
          <PayCheck cx={CHECK.cx} cy={CHECK.cy} w={CHECK.w} h={CHECK.h} t={at(CUES.check)} pen={PEN} seed={42} />
          <g transform={`translate(${SUP.x} ${SUP.gy}) scale(${SUP.k}) translate(${-SUP.x} ${-SUP.gy})`}>
            <Person x={SUP.x} gy={SUP.gy} t={at(CUES.supplier)} pen={scaledPen(PEN, SUP.k, 'sup')} seed={22} hair="curly" curlArc={[1.02, 1.76]} shirt={PEN.palette.green} reach dur={0.6} />
          </g>
          <Type x={IB.cx} y={LABEL.y} text={C('Singapore')} t={at(CUES.singapore)} cps={20} size={LABEL.size} font={FL} color={INK} weight="700" charW={LBLW} />

          {/* ===== scene 2: step one, lock (the coins at the London bank's doorstep, the padlock on them) ===== */}
          <Type x={HEAD.lock} y={HEAD.y} text={C('lock')} t={at(CUES.lockWord)} cps={14} size={HEAD.size} font={FL} color={PEN.colorH} weight="700" charW={HEADW.lock} />
          <CoinStack cx={COINS.cx} baseY={COINS.baseY} n={COINS.n} rx={COINS.rx} ry={COINS.ry} th={COINS.th} t={at(CUES.coins)} pen={PEN} seed={30} />
          <Padlock cx={LOCK.cx} cy={LOCK.cy} w={LOCK.w} h={LOCK.h} open={open} lift={LOCK.lift} tilt={LOCK.tilt} t={at(CUES.padlock)} pen={PEN} seed={31} />

          {/* ===== scene 3: step two, credit (the arc over the water, the cheque in the supplier's hand, the tie back to the lock) ===== */}
          <Type x={HEAD.credit} y={HEAD.y} text={C('credit')} t={at(CUES.creditWord)} cps={14} size={HEAD.size} font={FL} color={PEN.colorH} weight="700" charW={HEADW.credit} />
          <CurvedArrow p0={CREDIT.p0} p1={CREDIT.c1} p1b={CREDIT.c2} p2={CREDIT.p2} t={at(CUES.credit)} pen={PEN} seed={40} color={ORANGE} dur={0.9} head={22} strokeWidth={PEN.inkWidth + 2.4} sequential />
          <DottedCurve p0={TIE.p0} p1={TIE.c1} p1b={TIE.c2} p2={TIE.p2} t={at(CUES.tie)} pen={PEN} seed={44} dur={1.0} head={16} />

          {/* ===== scene 4: step three, settle (the two banks settle in the channel, time passes, the lock is released) ===== */}
          <Type x={HEAD.settle[0]} y={HEAD.settle[1]} text={C('settle')} t={at(CUES.settleWord)} cps={14} size={HEAD.size} font={FL} color={PEN.colorH} weight="700" charW={HEADW.settle} />
          <TwoWayArrow x1={SETTLE.x1} x2={SETTLE.x2} y={SETTLE.y} t={at(CUES.settle)} pen={PEN} seed={50} dur={0.6} head={16} />
          <ClockFace cx={CLOCK.cx} cy={CLOCK.cy} r={CLOCK.r} t={at(CUES.clock)} spinT={spinT} pen={PEN} seed={52} />

          {/* ===== payoff: no new asset, the money never left the banking system, a deposit at a regulated bank ===== */}
          <NewCoin cx={TOKEN.cx} cy={TOKEN.cy} r={TOKEN.r} sparkleAt={SPARKLE} t={at(CUES.token)} pen={PEN} seed={60} />
          <CrossOut x1={TOKEN.cx - TOKEN_X} y1={TOKEN.cy - TOKEN_X} x2={TOKEN.cx + TOKEN_X} y2={TOKEN.cy + TOKEN_X} t={at(CUES.strike)} pen={PEN} seed={62} color={ORANGE} strokeWidth={PEN.inkWidth + 2.6} />
          <DashedBoundary x={BOUNDARY.x} y={BOUNDARY.y} w={BOUNDARY.w} h={BOUNDARY.h} r={BOUNDARY.r} t={at(CUES.boundary)} pen={PEN} seed={70} dur={1.3} />
          <ShieldCheck cx={GA.vault[0]} cy={GA.vault[1]} w={SHIELD.w} h={SHIELD.h} t={at(CUES.shields)} pen={PEN} seed={80} dur={0.3} />
          <ShieldCheck cx={GB.vault[0]} cy={GB.vault[1]} w={SHIELD.w} h={SHIELD.h} t={at(CUES.shields + 0.12)} pen={PEN} seed={81} dur={0.3} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

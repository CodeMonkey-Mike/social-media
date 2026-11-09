// whiteboard/beats/QuantWB1.tsx: whiteboard beat WB1 of the longform-edited video `quant`
// (brief: media/quant/assets/whiteboard/WB1.brief.md; cues: assets/whiteboard/WB1.cues.md).
// "Think of every bank as an island": a mainland coastline draws along the top of the sea, the page below it tints and
// wave ticks draw; four small banks draw on
// "bank" (two in front, two smaller in the back), then on "island" the land draws under each one, a palm at its far
// end. On "vault" a round vault door draws beside every bank, on "ledger" an open ledger. On "money" a coin with little
// legs pops at the front-left island's shore; on "just" it steps toward the water; on "can't" a bold ink cross draws in the
// water in front of it and on "walk" it recoils. On "boat" a small sailboat draws in the channel; the coin hops over the
// cross into the boat (the cross fades once it is aboard); on "payment" a dotted path runs from the boat to the next
// island's shore and the boat starts across, slowly (its hull's wave ticks fade as the route draws); on "one" the orange
// label "one leg at a time" types under the path (the ONE orange accent of the
// beat); on "boat" (the clause's subject, "that boat can take days") a clock face draws above the route behind the boat, on "take"
// its hands spin, on "days" the label "days" types (4 letters at 30 cps, complete at frame 477). Payoff: the boat mid-water, the clock
// spinning, "days", held under "Now the banks are" (the next sentence's first words; nothing new draws). The window was extended for
// that hold (Mike approved option A, 2026-11-05: tOut 70.52 -> 71.30, WB2's tIn with it): the compositor's fade starts at out minus
// 0.3 s = local 16.98 = frame 509, so the word holds 32 frames = 1.07 s and the drawing without it (clock complete at frame 468)
// 41 frames = 1.37 s. The label never draws before its word.
// Canvas = the full frame 1920 x 1080 @30, spine 54.020 to 71.300 s = 17.28 s = 518 frames, no audio; the comp build
// fades it in and out. Pen: paper-quant (everything the pen unchanged; the one orange mark is the label). Everything is
// SVG through rough.js with fixed seeds (no boil, deterministic). No numbers on screen, no bank names, no logos, no
// amounts; four islands exactly (`QUANT_ISLANDS` in islands.tsx, the same four the later beats draw).
// The storyboard is the CUES table below: LOCAL seconds (0 = spine 54.020), each hung on a spoken word of
// `spine/ALL.f.enhanced.medium-words.json`; a thing draws as he names it, never before.
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont as loadGochi } from '@remotion/google-fonts/GochiHand';
import { loadFont as loadKalam } from '@remotion/google-fonts/Kalam';
import { loadFont as loadRockSalt } from '@remotion/google-fonts/RockSalt';
import { loadFont as loadHandlee } from '@remotion/google-fonts/Handlee';
import { PENS } from '../pen';
import { Type } from '../vocab';
import { easeOut, prog } from '../Sketch';
import { CrossOut } from '../welfare';
import { DottedArrow } from '../bank';
import { Boat, ClockFace, Island, LegCoin, QUANT_ISLANDS, Sea, boatGeom, islandGeom } from '../islands';

const { fontFamily: GOCHI } = loadGochi();
const { fontFamily: KALAM } = loadKalam('normal', { weights: ['400', '700'] });
const { fontFamily: ROCKSALT } = loadRockSalt();
const { fontFamily: HANDLEE } = loadHandlee();
const FONTS: Record<string, string> = { 'Gochi Hand': GOCHI, Kalam: KALAM, 'Rock Salt': ROCKSALT, Handlee: HANDLEE };

export const FPS = 30;
/** 17.28 s x 30 = 518 frames (spine 54.020 to 71.300; round((71.300 - 54.020) * 30) = 518) */
export const DUR = 518;
export const W = 1920;
export const H = 1080;

// ---- the storyboard: LOCAL seconds (spine seconds minus 54.020), the word each cue hangs on ----
const CUES = {
  sea: 2.32,       // "think"        the sea tints the lower page, wave ticks draw across it
  banks: 2.94,     // "bank"         four small banks draw, front left first, one every 0.1 s (0.9 s each)
  islands: 3.72,   // "island"       the land draws under each bank, one every 0.1 s (0.6 s each), a palm at its far end
  vault: 5.70,     // "vault"        a round vault door beside every bank, one every 0.08 s (0.7 s each)
  ledger: 6.96,    // "ledger"       an open ledger beside every bank, one every 0.08 s (0.7 s each)
  coin: 7.74,      // "money"        the coin with legs pops on island A
  walk: 8.62,      // "just"         it steps toward the water (0.68 s, two short strides, 16 px down the page: the shore is to its lower right)
  cross: 9.00,     // "can't"        a bold ink cross draws in the water in front of it (0.45 s)
  bump: 9.48,      // "walk"         it recoils from the water (0.3 s, back up its step)
  boat: 11.62,     // "boat"         the sailboat draws in the channel beyond the cross (0.55 s)
  hop: 12.10,      // "boat" (held)  the coin hops over the cross into the boat (0.45 s; the boat exists first)
  path: 12.64,     // "payment"      the dotted path runs from the boat to island B's shore (0.9 s); the boat starts across
  label: 13.48,    // "one"          "one leg at a time" types under the path in orange
  clock: 15.10,    // "boat"         the clock face draws above the route behind the boat (0.5 s; the clause's subject, so the clock is complete at 15.60, before "take" / "days")
  spin: 15.58,     // "take"         its hands spin (they finish drawing at 15.57)
  days: 15.78,     // "days"         "days" types above the clock (30 cps: complete at frame 477, 32 frames = 1.07 s before the fade starts at 509)
  // 16.50 "Now", 16.66 "the", 16.86 "banks", 17.10 "are": the next sentence opens under the HELD drawing; nothing new draws, the boat
  // keeps drifting (10 px/s: hull centre 936 at the last frame, bow 1013, ~34 px short of the chevron's back) and the clock keeps spinning
};

// ---- layout ----
const [IA, IB, IC, ID] = QUANT_ISLANDS;
const GA = islandGeom(IA), GB = islandGeom(IB);
const SEA_HORIZON = 300;
// wave ticks in open water, clear of the islands, the channel's business and the clock
// (visual-qa round 1: [120,700] sat on island A's outline -> [75,760]; [1480,565] hid behind island B's ledger -> [1600,560])
const TICKS: [number, number][] = [
  [260, 880], [520, 960], [900, 985], [1250, 925], [1560, 985], [1800, 885], [1790, 655], [1210, 525], [1600, 560],
  [560, 450], [300, 380], [1270, 385], [1000, 1035], [650, 1035], [1700, 1040], [75, 760],
];
// the coin on A's front-right, between the ledger's pedestal (right edge 597) and the shoreline (x ~680 at the feet's row, y 738, measured on
// the round-4 still): its disc (r 30) pops 10 px clear of the pedestal at x 637, and its right foot's TIP (x + 24) must stop ~20 px short of the
// outline (visual-qa round 4: at x1 660 the foot merged into the shoreline for 2.8 s), so there is no room for a sideways walk: it steps DOWN the
// page toward the water (the channel is to its lower right), 16 px over two strides, from feet y 724 to 740
const COIN = { x0: GA.shore[0] - 28, x1: GA.shore[0] - 26, gy0: GA.shore[1] - 16, gy1: GA.shore[1] };
const WATER = 765;                                                              // the channel's waterline
const CROSS = { cx: 745, cy: WATER - 3, half: 18 };                             // in the water just off A's shore, on the route (its upper-left arm used to touch the land at 735,745)
const BOAT = { x0: 890, speed: 10 };                                            // starts well beyond the cross (stern 818, 50 px clear of it), 10 px/s once under way: slow; at the last frame (17.23 s) the hull centre is at 936, its bow at 1013, ~34 px short of the arrowhead's back (its wave ticks are faded by then)
const PATH = { x1: 780, x2: 1072, y: WATER - 3 };                               // the route: from the water past the cross, along the waterline, to 15 px short of island B's shore (behind the hull, clear of its waves)
const LABEL = { x: (780 + 1072) / 2, y: 842 };                                  // centred under the route
const CLOCK = { cx: 790, cy: 605, r: 50 };                                      // above the route behind the boat, 29 px clear of island A's tip and of the tick off it
const LBL = 44;
const LBLW = 0.46;                                                              // Kalam 700 measured ~0.46 em per glyph (quant WB12 stills)

const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const easeInOut = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);

export const QuantWB1: React.FC<{ penId?: string }> = ({ penId = 'paper-quant' }) => {
  const PEN = PENS[penId] ?? PENS['paper-quant'];
  const FL = FONTS[PEN.fontL];
  const C = (s: string) => (PEN.caps ? s.toUpperCase() : s);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = frame / fps;                 // local seconds
  const at = (cue: number) => T - cue;   // time since a cue (negative = not yet)
  const INK = PEN.colorL;

  // the boat's position: still until the path cue, then a slow steady crossing
  const boatX = BOAT.x0 + BOAT.speed * Math.max(0, at(CUES.path));
  const bg = boatGeom(boatX, WATER);

  // the coin: stands, walks to the shore, recoils, hops into the boat, rides
  const walkP = prog(at(CUES.walk), 0, 0.68);
  // the cross fades once the money is aboard (visual-qa round 4: left on screen it read as the start mark of a treasure-map route)
  const crossOp = 1 - prog(at(CUES.hop), 0.45, 0.5);
  // the hull's wave ticks fade as the route draws: its dots over the bow tick formed a small face (visual-qa round 4)
  const hullWaves = 0.75 * (1 - prog(at(CUES.path), 0, 0.3));
  const bumpP = prog(at(CUES.bump), 0, 0.3);
  const hopP = prog(at(CUES.hop), 0, 0.45);
  const bumpK = Math.sin(Math.PI * bumpP);                                 // the recoil: back up its step (never left: the pedestal is 10 px away)
  let coinX = lerp(COIN.x0, COIN.x1, easeOut(walkP)) - 2 * bumpK;
  let coinCy = lerp(COIN.gy0, COIN.gy1, easeOut(walkP)) - 34 - 30 + 6 - 12 * bumpK;
  let phase = walkP < 1 ? walkP * Math.PI * 4 : 0;                       // two strides, feet at rest (apart) when it arrives
  let aboard = false;
  if (hopP > 0) {
    const u = easeInOut(hopP);
    const seatX = boatGeom(BOAT.x0, WATER).seat[0], seatY = bg.yd - 20;
    coinX = lerp(coinX, seatX, u);
    coinCy = lerp(coinCy, seatY, u) - 95 * Math.sin(Math.PI * u);
    phase = u * Math.PI * 0.8;
    if (hopP >= 1) { aboard = true; coinX = bg.seat[0]; coinCy = bg.seat[1]; }
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
          {/* ===== scene 1: the sea, every bank as an island, its own vault and ledger (back islands first: depth) ===== */}
          <Sea horizon={SEA_HORIZON} ticks={TICKS} t={at(CUES.sea)} pen={PEN} seed={1} />
          {[ID, IC, IA, IB].map((spec, j) => {
            const i = [IA, IB, IC, ID].indexOf(spec);          // cue order: A, B, C, D
            return (
              <Island key={i} {...spec} t={at(CUES.islands + i * 0.1)} bankT={at(CUES.banks + i * 0.1)} vaultT={at(CUES.vault + i * 0.08)} ledgerT={at(CUES.ledger + i * 0.08)} pen={PEN} seed={10 + i} vaultBolts={(spec.scale ?? 1) < 0.7 ? 4 : undefined} />
            );
          })}

          {/* ===== scene 2: the money can't walk over (the cross in the water) ===== */}
          {crossOp > 0 && (
            <g opacity={crossOp}>
              <CrossOut x1={CROSS.cx - CROSS.half} y1={CROSS.cy - CROSS.half} x2={CROSS.cx + CROSS.half} y2={CROSS.cy + CROSS.half} t={at(CUES.cross)} pen={PEN} seed={30} color={PEN.ink} strokeWidth={PEN.inkWidth + 3.5} />
            </g>
          )}

          {/* ===== scene 3: it goes on a boat, one payment, one leg at a time ===== */}
          <DottedArrow x1={PATH.x1} y1={PATH.y} x2={PATH.x2} y2={PATH.y + 4} t={at(CUES.path)} pen={PEN} seed={40} dur={0.9} head={22} tail={32} />
          {/* the coin is painted BEFORE the boat so the hull hides its lower part once it sits aboard */}
          <LegCoin x={coinX} cy={coinCy} phase={phase} legs={!aboard} t={at(CUES.coin)} pen={PEN} seed={31} font={FL} />
          <Boat x={boatX} y={WATER} t={at(CUES.boat)} pen={PEN} seed={32} waves={hullWaves} />
          <Type x={LABEL.x} y={LABEL.y} text={C('one leg at a time')} t={at(CUES.label)} cps={22} size={LBL} font={FL} color={PEN.palette.red} weight="700" charW={LBLW} />

          {/* ===== payoff: that boat can take days ===== */}
          <ClockFace cx={CLOCK.cx} cy={CLOCK.cy} r={CLOCK.r} t={at(CUES.clock)} spinT={at(CUES.spin)} pen={PEN} seed={53} />
          <Type x={CLOCK.cx} y={CLOCK.cy - CLOCK.r - 22} text={C('days')} t={at(CUES.days)} cps={30} size={LBL} font={FL} color={INK} weight="700" charW={LBLW} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

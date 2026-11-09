// whiteboard/beats/QuantWB3.tsx: whiteboard beat WB3 of the longform-edited video `quant`
// (brief: media/quant/assets/whiteboard/WB3.brief.md; cues: assets/whiteboard/WB3.cues.md).
// "The obvious move would be to build one more island": the same four islands as WB1 / WB2 draw back on (the stage,
// under the compositor's fade-in). On "island" a fifth, smaller island sketches in the middle of the four; on "chain"
// four chain-linked blocks land on it (one big chain); on "come" four arrows pull from the four islands toward it. On
// "not" (did not do) an orange X strikes the fifth island out, and on "Quant" the rejected idea ghosts (island, chain,
// arrows and X fade to 42 percent) so the picture moves on. On "layer" an orange band draws in the sky over all four
// islands and "Quant" types onto it on "above". On "core" a green check badge pops on every bank's roof, on "payment"
// a rail track draws on every island's lawn and on "rails" its badge pops, on "custody" a badge pops on every vault
// door. On "connects" four orange threads drop from the band to the four vault doors; on "APIs" a plug pops where each
// thread meets the band; on "orchestrates" small arrows run along the band and on "movement" a coin pops into the run
// (the money moving through the layer). Payoff, on "And it never holds the funds": a thin orange X crosses the coin out
// and "never holds funds" types above the band in orange, both hung on "And" so the drawing is finished 0.8 s before
// the compositor's fade (the whiteboard-beat lesson: the payoff needs air).
// Canvas = the full frame 1920 x 1080 @30, spine 95.580 to 119.100 s = 23.52 s = 706 frames, no audio; the comp build
// fades it in and out. Pen: paper-quant (the orange accent = the strike through the fifth island, the band, its "Quant"
// label, the threads, the coin's cross and the payoff label, all the brief's; everything else the pen unchanged).
// Everything is SVG through rough.js with fixed seeds (no boil, deterministic). No numbers on screen, no product names,
// no venue names, no bank names (the brief); four islands exactly from `QUANT_ISLANDS` (islands.tsx) with WB1's seeds
// so they are the same drawings, plus the fifth one this beat is about.
// Round 3 (after visual-qa on the round-2 stills): the fifth island is smaller and further left so all of its ink
// (its right wave tick included) clears B's palm by 40+ px; the chain, the four pull arrows and the strike are re-aimed
// at the new shore (B's arrow now leaves B's lower-left shore, so it no longer crosses B's thread); the [1250, 540] wave
// tick is gone; the band has no shadow and is 6 px taller for a bigger coin; "Quant" sits higher; the rail tracks are
// bigger with overhanging sleepers and heavier rails (RailTrack `overhang` / `heavy`) and their badges sit 11 px under
// the far end; A's thread / plug start at x 268, past the band's corner radius; the coin is r 33 with a thin orange X.
// The storyboard is the CUES table below: LOCAL seconds (0 = spine 95.580), each hung on a spoken word of
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
import { CurvedArrow } from '../money';
import { ChainBlocks, LayerBand, RailTrack, Thread } from '../bank';
import { Island, LegCoin, QUANT_ISLANDS, Sea, islandGeom, scaledPen } from '../islands';
import { CheckBadge, FlowArrows, Plug } from '../layer';

const { fontFamily: GOCHI } = loadGochi();
const { fontFamily: KALAM } = loadKalam('normal', { weights: ['400', '700'] });
const { fontFamily: ROCKSALT } = loadRockSalt();
const { fontFamily: HANDLEE } = loadHandlee();
const FONTS: Record<string, string> = { 'Gochi Hand': GOCHI, Kalam: KALAM, 'Rock Salt': ROCKSALT, Handlee: HANDLEE };

export const FPS = 30;
/** 23.52 s x 30 = 706 frames (spine 95.580 to 119.100) */
export const DUR = 706;
export const W = 1920;
export const H = 1080;

// ---- the storyboard: LOCAL seconds (spine seconds minus 95.580), the word each cue hangs on ----
const CUES = {
  sea: 0.0,          // "So"            the coast and the sea return (the stage; under the compositor's fade-in)
  islands: 0.46,     // "obvious"       the four islands draw back on, A first, one every 0.08 s (land, bank, vault, ledger, palm; ~1 s each)
  fifth: 2.28,       // "island"        a fifth, smaller island sketches in the middle of the four (0.6 s)
  chain: 3.50,       // "chain"         four chain-linked blocks land on it, one every 0.22 s, links after each
  pull: 5.20,        // "come"          four arrows pull from the four islands toward it, one every 0.1 s (0.6 s each)
  strike: 9.26,      // "not"           an orange X strikes the fifth island out (0.45 s)
  ghost: 10.42,      // "Quant"         the rejected idea ghosts: island, chain, arrows and X fade to 42 percent (0.5 s)
  band: 11.04,       // "layer"         the orange band draws in the sky over all four islands (0.7 s)
  quant: 11.48,      // "above"         "Quant" types onto the band
  core: 13.80,       // "core"          a check badge pops on every bank's roof, A first, one every 0.08 s
  rails: 15.30,      // "payment"       a rail track draws on every island's lawn, one every 0.06 s (0.3 s each)
  railsCheck: 15.62, // "rails"         (the word runs 15.54 to 15.94; the track is complete at 15.60) a badge pops under every track's far end
  custody: 16.32,    // "custody"       a badge pops on every vault door, one every 0.08 s
  threads: 17.86,    // "connects"      four orange threads drop from the band's bottom edge to the four vault doors, one every 0.12 s (0.5 s each)
  plugs: 19.60,      // "APIs"          a plug pops where each thread meets the band, one every 0.08 s
  flow: 20.40,       // "orchestrates"  small arrows draw on along the band, left to right, and keep running
  coin: 21.32,       // "movement"      a coin pops into the band's right end (the money moving through the layer)
  cross: 21.94,      // "And"           a thin orange X crosses the coin out (0.45 s, done 22.39)
  label: 21.98,      // "And"           "never holds funds" types above the band in orange at 40 cps (done 22.41, 0.8 s before the compositor's fade starts at 23.22)
};

// ---- layout ----
const [IA, IB, IC, ID] = QUANT_ISLANDS;
const SPECS = [IA, IB, IC, ID];
const GEOMS = SPECS.map((s) => islandGeom(s));
const SEA_HORIZON = 300;
// wave ticks in open water (WB2's visual-qa'd set), clear of the islands, the fifth island, the pull arrows and the rails
// (round 3: the [1250, 540] tick went: B's pull arrow ended under it and the two read as one)
const TICKS: [number, number][] = [
  [260, 900], [520, 985], [900, 1000], [1250, 960], [1560, 1000], [1800, 900], [1850, 700],
  [560, 1035], [1000, 1040], [1700, 1040], [75, 760], [300, 400], [1150, 380], [1400, 525], [1840, 330],
];
// the fifth island: the centre of the four (their box is 140..1845 x 360..810), small, no palm (a built island): land
// 723..1001 x 512..603, its ground line (the land's middle) at 558; 55 px under island D's bottom (457); its right wave
// tick ends at x 1031, 44 px left of B's palm's frond tip (1075) and 17 px above the fronds' top (575); its left tick
// (682..695, 548) is 56 px right of A's ledger book (ends 626)
const FIFTH = { cx: 862, top: 512, scale: 0.48 };
const GF = islandGeom(FIFTH);
// the chain: four full-size blocks (bank.tsx ChainBlocks, 72 px cubes 135 apart, links between) drawn at 0.44 scale
// about the island's ground centre, so it spans 753..971 (the land is 723..1001 at the ground line) and its bottom
// sits 5 px under the ground line; its top faces (523) stay under the land's top edge (517 at x 761)
const CHAIN_K = 0.44;
const CHAIN = { cx: FIFTH.cx - 211.5, cy: GF.gy - 24, n: 4, step: 135, size: 72 };
// the four pull arrows (ink): from each island's near shore to ~16 px off the fifth island's shore, bowed like a hand's stroke
const PULL: { p0: [number, number]; p1: [number, number]; p2: [number, number] }[] = [
  { p0: [640, 596], p1: [672, 580], p2: [706, 566] },     // A: from the water right of A's ledger (book ends 626; A's land top there 619), to 17 px off the fifth's left tip (723, 558)
  { p0: [1062, 668], p1: [1050, 625], p2: [1010, 596] },  // B: from the water off B's lower-left shore (38 px off the land, 33 px left of the palm's trunk), up to 22 px off the fifth's lower-right shore (994, 580); never crosses B's thread
  { p0: [778, 463], p1: [748, 482], p2: [735, 512] },     // D: from 17 px under D's lower-left shore (778, 446) down to 17 px above the fifth's upper-left shore (735, 529)
  { p0: [1540, 478], p1: [1300, 462], p2: [1012, 522] },  // C: from off C's left tip (1555, 457), over the water above B (its badge tops at 542), to 24 px off the fifth's upper-right shore (994, 539)
];
// the X over the island and its chain: every tip in open water (the shore under / over each tip: 519 / 596 / 583 / 596),
// 30 px from D's arrowhead, 41 px from C's, and ~100 px from B's palm (the lower-right tip at 975, 620)
const STRIKE = { x1: 770, y1: 498, x2: 975, y2: 620 };
const GHOST = 0.42;
// the band in the sky over all four islands (A's left 140, C's right 1845): 220..1700 x 117..203, 85 px above the coast (288..312)
const BAND = { x: 220, y: 117, w: 1480, h: 86 };
const QUANT = { size: 58, y: BAND.y + 55 };                // Gochi Hand 700 at 58 px: cap top ~131, the Q's tail ends ~184, 19 px above the band's bottom line (203)
const QUANT_W = 0.5, QUANT_SP = 0.1;                       // Gochi Hand 700 ~0.50 em per glyph, letter-spaced 0.1 em (quant WB12)
const LBL = 44;
const LBLW = 0.46;                                         // Kalam 700 measured ~0.46 em per glyph (quant WB12 stills)
// per island: the bank's roof apex (the facade is BankFacade at 0.3 about the bank's base: apex = base - 134.4), the vault
// door (islandGeom; r 36 at scale 1), and a rail track on the lawn in front of the bank's steps (local scale-1 coordinates
// about (cx, top): the lawn between the steps' bottom at +95 and the shore at ~+190). The rear islands (k 0.5) get a 1.2x
// track so it is not a sliver (126 px long on screen, the pedestal 23 px clear of its far end).
const RAIL_FRONT = { dx: -120, dy: 158, len: 210, rise: 40, gap: 22, dur: 0.3 };
const RAIL_REAR = { dx: -140, dy: 162, len: 252, rise: 48, gap: 26, dur: 0.3 };
const RAIL_OVERHANG = 0.25, RAIL_HEAVY = 1.4;
const perIsland = (i: number) => {
  const g = GEOMS[i], k = g.scale, { cx, top } = SPECS[i];
  const vr = 36 * k;
  const rail = k < 1 ? RAIL_REAR : RAIL_FRONT;
  const bankApex: [number, number] = [g.bank[0], g.bank[1] - 134.4 * k];
  // the thread / plug sit right above the vault, but never inside the band's corner radius (43): A's vault is at x 244
  const plugX = Math.max(g.vault[0], BAND.x + 48);
  return {
    k, rail, plugX,
    bankBadge: [bankApex[0], bankApex[1] - 24 * k] as [number, number],                   // above the roof's apex
    vault: g.vault, vaultTop: [g.vault[0] + 0.5 * (vr + 2), g.vault[1] - 0.866 * (vr + 2)] as [number, number], // where the thread lands (its dot on the rim's upper right, clear of the palm beside the door)
    vaultBadge: [g.vault[0] + 28 * k, g.vault[1] + 28 * k] as [number, number],          // on the door's lower-right quadrant (the hinges are on the left)
    railBadge: [cx + (rail.dx + rail.len + 2) * k, top + (rail.dy - rail.rise + 32) * k] as [number, number], // under the track's far end: its top 11 px below the last sleeper
    badgeR: 15 * k,
  };
};
const PER = [0, 1, 2, 3].map(perIsland);
// the threads leave the band's bottom edge above each vault and bow a little to the right on the way down (A's clears
// its palm's fronds, C's too); the plug covers each thread's start
const THREAD_BOW: [number, number][] = [[46, 410], [25, 430], [42, 330], [12, 300]];
// the run of arrows inside the band, either side of "Quant" (its ink spans ~890..1030), stopping short of the coin
const FLOW = { y: BAND.y + BAND.h / 2, left: [300, 850] as [number, number], right: [1070, 1430] as [number, number] };
const COIN = { cx: 1545, cy: BAND.y + BAND.h / 2, r: 33 };  // 127..193 inside the band's 117..203, 6 px clear of its lines
const CROSS = 30;                                          // the X's half size about the coin: tips measured at 130 / 190 on the still, 11 / 9 px inside the band's lines (34 put them 6 px inside)
const LABEL = { x: COIN.cx, y: BAND.y - 28 };              // "never holds funds" above the band: ink ~1373..1717, 89 px baseline, 28 px above the band's top line

export const QuantWB3: React.FC<{ penId?: string }> = ({ penId = 'paper-quant' }) => {
  const PEN = PENS[penId] ?? PENS['paper-quant'];
  const FH = FONTS[PEN.fontH], FL = FONTS[PEN.fontL];
  const C = (s: string) => (PEN.caps ? s.toUpperCase() : s);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = frame / fps;                 // local seconds
  const at = (cue: number) => T - cue;   // time since a cue (negative = not yet)
  const ORANGE = PEN.palette.red;

  const ghost = 1 - (1 - GHOST) * easeOut(prog(at(CUES.ghost), 0, 0.5));

  const island = (i: number) => {
    const spec = SPECS[i], p = PER[i], tI = at(CUES.islands + i * 0.08);
    const { cx, top } = spec;
    const r = p.rail;
    return (
      <g key={i}>
        <Island {...spec} t={tI} bankT={tI - 0.1} vaultT={tI - 0.3} ledgerT={tI - 0.2} pen={PEN} seed={10 + i} />
        {/* ===== scene 3b: keeps its payment rails (a track on the lawn in front of the steps, receding to the right, sleepers past both rails) ===== */}
        <g transform={`translate(${cx} ${top}) scale(${p.k}) translate(${-cx} ${-top})`}>
          <RailTrack x={cx + r.dx} y={top + r.dy} len={r.len} rise={r.rise} gap={r.gap} overhang={RAIL_OVERHANG} heavy={RAIL_HEAVY} t={at(CUES.rails + i * 0.06)} pen={scaledPen(PEN, p.k, 'rail')} seed={70 + i} dur={r.dur} />
        </g>
      </g>
    );
  };

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
          {/* ===== scene 1: the sea and the four islands return (back islands first: depth) ===== */}
          <Sea horizon={SEA_HORIZON} ticks={TICKS} t={at(CUES.sea)} pen={PEN} seed={1} />
          {[3, 2].map((i) => island(i))}

          {/* ===== scene 2: the obvious move, one more island with one big chain, every bank pulled toward it, struck out ===== */}
          <g opacity={ghost}>
            <Island {...FIFTH} t={at(CUES.fifth)} palm={false} pen={PEN} seed={15} />
            <g transform={`translate(${FIFTH.cx} ${GF.gy}) scale(${CHAIN_K}) translate(${-FIFTH.cx} ${-GF.gy})`}>
              <ChainBlocks cx={CHAIN.cx} cy={CHAIN.cy} n={CHAIN.n} step={CHAIN.step} size={CHAIN.size} t={at(CUES.chain)} pen={scaledPen(PEN, CHAIN_K, 'chain')} seed={20} stagger={0.22} dur={0.4} />
            </g>
            {PULL.map((a, i) => <CurvedArrow key={i} {...a} t={at(CUES.pull + i * 0.1)} pen={PEN} seed={30 + i * 2} dur={0.6} head={18} strokeWidth={PEN.inkWidth + 1.4} />)}
            <CrossOut x1={STRIKE.x1} y1={STRIKE.y1} x2={STRIKE.x2} y2={STRIKE.y2} t={at(CUES.strike)} pen={PEN} seed={40} color={ORANGE} strokeWidth={PEN.inkWidth + 4.5} />
          </g>
          {[0, 1].map((i) => island(i))}

          {/* ===== scene 3: Quant is a layer that sits above the islands; the bank keeps its core systems, rails, custody ===== */}
          <LayerBand x={BAND.x} y={BAND.y} w={BAND.w} h={BAND.h} t={at(CUES.band)} pen={PEN} seed={5} shadow={0} />
          <Type x={BAND.x + BAND.w / 2} y={QUANT.y} text={C('Quant')} t={at(CUES.quant)} cps={14} size={QUANT.size} font={FH} color={PEN.colorH} weight="700" charW={QUANT_W} spacing={QUANT_SP} />
          {PER.map((p, i) => (
            <g key={i}>
              <CheckBadge cx={p.bankBadge[0]} cy={p.bankBadge[1]} r={p.badgeR} t={at(CUES.core + i * 0.08)} pen={PEN} seed={50 + i} />
              <CheckBadge cx={p.railBadge[0]} cy={p.railBadge[1]} r={p.badgeR} t={at(CUES.railsCheck + i * 0.06)} pen={PEN} seed={55 + i} />
              <CheckBadge cx={p.vaultBadge[0]} cy={p.vaultBadge[1]} r={p.badgeR} t={at(CUES.custody + i * 0.08)} pen={PEN} seed={60 + i} />
            </g>
          ))}

          {/* ===== scene 4: connects all of that through APIs, orchestrates the movement (threads first, the plugs cover their starts) ===== */}
          {PER.map((p, i) => (
            <Thread key={i} p0={[p.plugX, BAND.y + BAND.h]} p1={[p.plugX + THREAD_BOW[i][0], THREAD_BOW[i][1]]} p2={p.vaultTop} t={at(CUES.threads + i * 0.12)} pen={PEN} seed={80 + i} />
          ))}
          {PER.map((p, i) => <Plug key={i} cx={p.plugX} y={BAND.y + BAND.h} t={at(CUES.plugs + i * 0.08)} pen={PEN} seed={90 + i} />)}
          <FlowArrows x0={FLOW.left[0]} x1={FLOW.left[1]} y={FLOW.y} t={at(CUES.flow)} pen={PEN} seed={100} />
          <FlowArrows x0={FLOW.right[0]} x1={FLOW.right[1]} y={FLOW.y} t={at(CUES.flow) - 0.35} pen={PEN} seed={101} />

          {/* ===== payoff: and it never holds the funds (the coin in the band, crossed out in a thin orange X so the $ stays visible) ===== */}
          <LegCoin x={COIN.cx} cy={COIN.cy} r={COIN.r} legs={false} t={at(CUES.coin)} pen={PEN} seed={110} font={FL} />
          <CrossOut x1={COIN.cx - CROSS} y1={COIN.cy - CROSS} x2={COIN.cx + CROSS} y2={COIN.cy + CROSS} t={at(CUES.cross)} pen={PEN} seed={112} color={ORANGE} strokeWidth={PEN.inkWidth + 0.6} />
          <Type x={LABEL.x} y={LABEL.y} text={C('never holds funds')} t={at(CUES.label)} cps={40} size={LBL} font={FL} color={ORANGE} weight="700" charW={LBLW} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

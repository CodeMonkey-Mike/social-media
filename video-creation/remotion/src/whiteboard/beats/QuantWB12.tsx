// whiteboard/beats/QuantWB12.tsx: whiteboard beat WB12 of the longform-edited video `quant`
// (brief: media/quant/assets/whiteboard/WB12.brief.md; cues: assets/whiteboard/WB12.cues.md).
// "A software layer that sits on top of the systems a bank already runs": an orange band draws first, floating, and
// "Quant" types onto it; under it a classical bank facade draws, then the things it already runs land in its bays as he
// names them (a round vault door, an open ledger on a pedestal, a rail track leaving its plinth and receding into the
// distance), and the band LANDS on the pediment's apex (its float shadow fades) so it sits on top of the bank. On
// "connects them" four orange threads leave the band's top: three short near-vertical ones to the chain-linked blocks
// that land right above the band on "blockchains", one long diagonal to the coin network on "digital money". Three
// labels line up under the bank as he names the customers (banks, financial institutions, capital markets). Three
// question tags hang off the band on "who" (a figure), "token" (a coin), "where" (a globe), each with a drawn "?".
// Payoff, on "So let's walk through": a dotted path leads from the band's end OFF the right edge into the next chapter.
// Canvas = the full frame 1920 x 1080 @30, spine 31.767 to 54.020 s = 22.253 s = 668 frames, no audio; the comp build
// fades it in and out. Pen: paper-quant (the band, the threads and "Quant" carry the ONE orange accent #F15A22, the
// pen's `red` role / heading color; everything else is the pen unchanged). Everything is SVG through rough.js with
// fixed seeds (no boil, deterministic). No numbers on screen (the brief); no islands, boats, fences, no Ethereum mark.
// The storyboard is the CUES table below: LOCAL seconds (0 = spine 31.767), each hung on a spoken word of
// `spine/ALL.f.enhanced.medium-words.json`; a thing draws as he names it, never before.
// Round 2 (2026-11-04, after visual-qa): the rail is a receding track joined to the plinth (the flat one read as a
// fence); the band lands on the apex; "Quant" is letter-spaced and centred on the band with a measured charW; the
// blocks moved left over the band so every thread has its own clear route and ends on a visible contact point; the
// network and its label moved left and up for the right margin; the tags moved right off the eave, their strings run
// into the holes and the figure's strokes are compensated for its scale; the path runs past the edge with no head and
// finishes about 1 s before the fade.
// Round 3 (2026-11-05, after visual-qa on the round-2 stills): the rail track LIES ON THE GROUND (in the floor band, wide and
// low at the plinth's corner, converging up toward the floor line as it recedes, sleepers overhanging both rails, heavier
// rails: `BankFacade rail`), the old one climbed the white wall with ladder-rung sleepers; the customer row moved down
// under it; the network and its label moved down 36 px (the label's ink top was 44 px from the top edge, now ~80); thread 4
// leaves the band's right CAP (not the top edge next to thread 3's root, where the two formed a wedge), the blocks 10 px left.
// Round 4 (2026-11-05, after visual-qa on the round-3 stills): the track is a `PlankTrack` (filled wooden planks slanted along
// the track's perspective lying UNDER two heavy rails: round 3's stroked sleepers crossing two near-flat rails read as a FENCE,
// WB2's reveal); the token in tag 2 is WB2's hexagonal token glyph with a "$" (`HexToken`: the hexagon-around-a-dot in rings
// read as a hex nut / a target). No cue moved.
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont as loadGochi } from '@remotion/google-fonts/GochiHand';
import { loadFont as loadKalam } from '@remotion/google-fonts/Kalam';
import { loadFont as loadRockSalt } from '@remotion/google-fonts/RockSalt';
import { loadFont as loadHandlee } from '@remotion/google-fonts/Handlee';
import { PENS } from '../pen';
import { Person, Type } from '../vocab';
import { HexToken } from '../deposits';
import { easeOut, prog } from '../Sketch';
import { BankFacade, ChainBlocks, CoinNetwork, DottedArrow, Globe, HangTag, LayerBand, Thread, bankGeom } from '../bank';

const { fontFamily: GOCHI } = loadGochi();
const { fontFamily: KALAM } = loadKalam('normal', { weights: ['400', '700'] });
const { fontFamily: ROCKSALT } = loadRockSalt();
const { fontFamily: HANDLEE } = loadHandlee();
const FONTS: Record<string, string> = { 'Gochi Hand': GOCHI, Kalam: KALAM, 'Rock Salt': ROCKSALT, Handlee: HANDLEE };

export const FPS = 30;
/** 22.253 s x 30 = 668 frames (spine 31.767 to 54.020) */
export const DUR = 668;
export const W = 1920;
export const H = 1080;

// ---- the storyboard: LOCAL seconds (spine seconds minus 31.767), the word each cue hangs on ----
const CUES = {
  band: 0.51,          // "software"      the orange band draws, floating (0.7 s)
  quant: 0.85,         // "layer"         "Quant" types onto the band
  bank: 1.41,          // "sits"          the bank facade draws under it: steps, columns, entablature, pediment, entrance (1.5 s)
  vault: 2.45,         // "systems"       the round vault door lands in the left bay
  land: 2.69,          // "that"          the band settles onto the pediment's apex (0.5 s), its float shadow fades
  ledger: 3.01,        // "bank"          the open ledger on its pedestal in the right bay
  rail: 3.59,          // "runs"          the rail track (plank sleepers under heavy rails) lies on the ground off the plinth's corner and recedes to the right
  threads: 5.03,       // "connects"      four orange threads leave the band's top (staggered 0.12 s)
  blocks: 5.99,        // "blockchains"   three chain-linked blocks land at the first three thread ends (staggered 0.3 s)
  blocksLabel: 6.57,   // "and" (held)    "blockchains" types above them
  network: 7.05,       // "digital"       the coin network pops at the fourth thread end
  networkLabel: 7.59,  // "networks"      "digital money" types above it
  banks: 9.75,         // "banks"         label 1 under the bank
  institutions: 10.87, // "financial"     label 2
  markets: 12.13,      // "capital"       label 3
  tagWho: 15.13,       // "who"           tag 1 hangs off the band
  who: 15.47,          // "exactly"       a figure draws inside it
  qWho: 16.11,         // "using"         its "?"
  tagToken: 17.21,     // "token"         tag 2 hangs; the coin pops on "does"
  token: 17.45,        // "does"
  qToken: 17.99,       // "and"
  tagWhere: 18.41,     // "where"         tag 3 hangs; the globe draws on "sits"
  where: 18.95,        // "sits"
  qWhere: 19.61,       // "rest"
  path: 20.47,         // "So"            the dotted path leads off the right edge (0.5 s; fully drawn ~1 s before the compositor's fade)
};

// ---- layout ----
const GY = 880;                                            // the floor
const BANK = { x: 200, w: 680 };
const BG = bankGeom(BANK.x, GY, BANK.w);                   // apexY = 432
const BAND = { x: 260, y: BG.apexY - 79, w: 1040, h: 80 }; // LANDED: its bottom edge on the apex (y 353..433), ends at x 1300
const FLOAT = 48;                                          // it draws this much higher, floating, until it lands
const LAND_DUR = 0.5;
const BLOCKS = { cx: 1000, cy: 200, step: 135, size: 72 }; // three cubes right above the band's right half: 964..1324 wide, 146..236 tall
const NET = { cx: 1660, cy: 246, ring: 84 };              // satellites out to x 1760 (+16 = 1776, 144 px from the edge); top satellite's top at 146
const NET_LABEL_Y = 114;                                   // "digital money" baseline: Kalam 700 at 42 px inks ~34 px up, so the ink top sits ~80 px from the top edge
// the rail track lies on the GROUND in the floor band off the plinth's right-bottom corner and recedes to the right as a
// PlankTrack (round 4, 2026-11-05: visual-qa read round 3's stroked sleepers across two near-flat rails as a FENCE in
// perspective): filled wooden planks slanted "\" at 59 degrees lying UNDER two heavy rails. Near centre (900, 908): the
// first plank's upper-left tip at x ~881 touches the plinth's corner, planks span y ~886..930 (gauge 34, overhang 25
// percent), the rails at ~893 / ~923; the far centre (1180, 888) at the horizon, gauge 10. Lowest ink ~932, the customer
// row's ink top 969: ~37 px air.
const RAIL = { planks: true, dx: 20, dy: 28, gap: 34, gapFar: 10, rise: 20, len: 280, overhang: 0.25, lean: 59, thick: 12, heavy: 1.6 };
const TAGS = [945, 1095, 1245];                            // tag centres, hanging off the band's right half; tag 1's left edge 21 px off the eave tip (864)
const TAG_TOP = BAND.y + BAND.h + 70;                      // 503; tags 503..643
const FIG = 0.33;                                          // the figure's scale inside tag 1
const LBL = 42;
// Kalam 700 at 42 px measures ~0.46 em per glyph on the still (banks 108 px, financial institutions 385, capital markets 292)
const LBLW = 0.46;
// Gochi Hand 700 at 64 px measured ~0.50 em per glyph on the round-1 still ("Quant" ink 160 px wide); letter-spaced 0.1 em so the n and t do not fuse
const QUANT_W = 0.5, QUANT_SP = 0.1;
// the customer row is placed by LEFT edges with 60 px gaps, not centred on estimates; its baseline sits 1000 so the ink top
// (~969) clears the rail's lowest sleeper end (~933) by ~36 px, descenders end ~1012 (68 px from the bottom edge)
const ROW = { banks: 232, institutions: 400, markets: 845, y: 1000 };

/** the hub's edge point at `deg` on the coin network (where the long thread lands) */
const hubEdge = (deg: number, r = 32): [number, number] => [NET.cx + Math.cos((deg * Math.PI) / 180) * r, NET.cy + Math.sin((deg * Math.PI) / 180) * r];
/** a point on the band's right end cap (the pill's arc, radius h/2) at `deg` (0 = due right, negative = up) */
const capEdge = (deg: number): [number, number] => {
  const r = BAND.h / 2, cx = BAND.x + BAND.w - r, cy = BAND.y + r;
  return [cx + Math.cos((deg * Math.PI) / 180) * r, cy + Math.sin((deg * Math.PI) / 180) * r];
};
/** a short thread straight up from the band's top edge to a block's bottom edge, a hand's bow to the left */
const upThread = (cx: number): { p0: [number, number]; p1: [number, number]; p2: [number, number] } =>
  ({ p0: [cx - 10, BAND.y], p1: [cx - 12, 296], p2: [cx, BLOCKS.cy + BLOCKS.size / 2 + 3] });
const THREADS = [
  upThread(BLOCKS.cx),
  upThread(BLOCKS.cx + BLOCKS.step),
  upThread(BLOCKS.cx + 2 * BLOCKS.step),
  // the long one: leaves the band's right CAP (the pill's end arc, centre (1260, 393) r 40, at -20 degrees = (1298, 379)),
  // 46 px from thread 3's root (1260, 353) and heading up-right at ~29 degrees, so the two never touch (round 2's root on
  // the top edge at x 1255 ran under thread 3's foot and read as a branch); it passes well under the third cube (y 338 at
  // x 1379; the cube's bottom is 236) and arrives at the hub's lower-left edge through the gap between the satellites at
  // 126 and 198 degrees. The dotted payoff path leaves the same cap 50 px lower, heading down-right.
  { p0: capEdge(-20), p1: [1460, 290] as [number, number], p2: hubEdge(162) },
];

export const QuantWB12: React.FC<{ penId?: string }> = ({ penId = 'paper-quant' }) => {
  const PEN = PENS[penId] ?? PENS['paper-quant'];
  const FH = FONTS[PEN.fontH], FL = FONTS[PEN.fontL];
  const C = (s: string) => (PEN.caps ? s.toUpperCase() : s);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = frame / fps;                 // local seconds
  const at = (cue: number) => T - cue;   // time since a cue (negative = not yet)

  const INK = PEN.colorL, P = PEN.palette;
  // the figure inside tag 1 is drawn at FIG scale: compensate the pen's stroke width (and some of its wobble) so its lines
  // match every other line on the page (at 0.33 they rendered 0.8 px, far fainter than the rest)
  const PEN_FIG = { ...PEN, id: `${PEN.id}-fig`, inkWidth: PEN.inkWidth / FIG, roughness: PEN.roughness * 1.6 };
  // the band floats FLOAT px up until it lands on the apex
  const landP = easeOut(prog(at(CUES.land), 0, LAND_DUR));
  const bandDy = -FLOAT * (1 - landP);

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
          {/* ===== scene 1: the layer, the bank under it, the band lands on top ===== */}
          <BankFacade x={BANK.x} gy={GY} w={BANK.w} t={at(CUES.bank)} vaultT={at(CUES.vault)} ledgerT={at(CUES.ledger)} railT={at(CUES.rail)} rail={RAIL} pen={PEN} seed={1} />
          <g transform={`translate(0 ${bandDy})`}>
            <LayerBand x={BAND.x} y={BAND.y} w={BAND.w} h={BAND.h} t={at(CUES.band)} pen={PEN} seed={5} shadow={1 - landP} />
            <Type x={BAND.x + BAND.w / 2} y={BAND.y + 58} text={C('Quant')} t={at(CUES.quant)} cps={14} size={64} font={FH} color={PEN.colorH} weight="700" charW={QUANT_W} spacing={QUANT_SP} />
          </g>

          {/* ===== scene 2: connects them to the blockchains and the digital money networks ===== */}
          <ChainBlocks cx={BLOCKS.cx} cy={BLOCKS.cy} step={BLOCKS.step} size={BLOCKS.size} t={at(CUES.blocks)} pen={PEN} seed={20} />
          <Type x={BLOCKS.cx + BLOCKS.step} y={120} text={C('blockchains')} t={at(CUES.blocksLabel)} cps={20} size={LBL} font={FL} color={INK} weight="700" charW={LBLW} />
          <CoinNetwork cx={NET.cx} cy={NET.cy} ring={NET.ring} t={at(CUES.network)} pen={PEN} seed={30} />
          <Type x={NET.cx} y={NET_LABEL_Y} text={C('digital money')} t={at(CUES.networkLabel)} cps={20} size={LBL} font={FL} color={INK} weight="700" charW={LBLW} />
          {/* the threads are painted AFTER their targets so each end dot sits visibly on the block's / hub's edge */}
          {THREADS.map((th, i) => <Thread key={i} {...th} t={at(CUES.threads + i * 0.12)} pen={PEN} seed={10 + i} />)}

          {/* ===== scene 3: their customers ===== */}
          <Type x={ROW.banks} y={ROW.y} text={C('banks')} t={at(CUES.banks)} cps={20} size={LBL} font={FL} color={INK} weight="700" anchor="start" charW={LBLW} />
          <Type x={ROW.institutions} y={ROW.y} text={C('financial institutions')} t={at(CUES.institutions)} cps={24} size={LBL} font={FL} color={INK} weight="700" anchor="start" charW={LBLW} />
          <Type x={ROW.markets} y={ROW.y} text={C('capital markets')} t={at(CUES.markets)} cps={24} size={LBL} font={FL} color={INK} weight="700" anchor="start" charW={LBLW} />

          {/* ===== scene 4: who is using it, what the token does, where it sits ===== */}
          <HangTag x={TAGS[0]} y0={BAND.y + BAND.h} t={at(CUES.tagWho)} pen={PEN} seed={40}>
            {/* the figure at FIG: its hair top lands ~17 px under the tag's hole, its feet ~9 px over the tag's bottom edge */}
            <g transform={`translate(${TAGS[0]} ${TAG_TOP + 132}) scale(${FIG}) translate(${-TAGS[0]} ${-(TAG_TOP + 132)})`}>
              <Person x={TAGS[0]} gy={TAG_TOP + 132} t={at(CUES.who)} pen={PEN_FIG} seed={41} hair="cap" shirt={P.gold} dur={0.9} />
            </g>
          </HangTag>
          <Type x={TAGS[0] + 38} y={TAG_TOP + 52} text="?" t={at(CUES.qWho)} cps={10} size={40} font={FH} color={PEN.ink} weight="700" charW={QUANT_W} />
          <HangTag x={TAGS[1]} y0={BAND.y + BAND.h} t={at(CUES.tagToken)} pen={PEN} seed={42}>
            {/* the token = WB2's hexagonal token glyph carrying a "$" (not a number): visual-qa read a hexagon-around-a-dot in rings as a hex nut / a target */}
            <HexToken cx={TAGS[1]} cy={TAG_TOP + 82} r={34} t={at(CUES.token)} pen={PEN} seed={43} font={FL} markDx={0.02} markDy={0.15} />
          </HangTag>
          <Type x={TAGS[1] + 38} y={TAG_TOP + 52} text="?" t={at(CUES.qToken)} cps={10} size={40} font={FH} color={PEN.ink} weight="700" charW={QUANT_W} />
          <HangTag x={TAGS[2]} y0={BAND.y + BAND.h} t={at(CUES.tagWhere)} pen={PEN} seed={44}>
            <Globe cx={TAGS[2]} cy={TAG_TOP + 82} r={36} t={at(CUES.where)} pen={PEN} seed={45} />
          </HangTag>
          <Type x={TAGS[2] + 38} y={TAG_TOP + 52} text="?" t={at(CUES.qWhere)} cps={10} size={40} font={FH} color={PEN.ink} weight="700" charW={QUANT_W} />

          {/* ===== payoff: so let's walk through all of this (the dots run past the canvas edge, no arrowhead) ===== */}
          <DottedArrow x1={BAND.x + BAND.w + 12} y1={BAND.y + BAND.h - 6} x2={1960} y2={560} head={0} dur={0.5} t={at(CUES.path)} pen={PEN} seed={50} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

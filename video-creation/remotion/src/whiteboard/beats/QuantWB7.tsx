// whiteboard/beats/QuantWB7.tsx: whiteboard beat WB7 of the longform-edited video `quant`
// (brief: media/quant/assets/whiteboard/WB7.brief.md; cues: assets/whiteboard/WB7.cues.md).
// The Clearing House's On-Chain Money Initiative as a picture (DATA.md T3: TCH is owned by 25 of the largest US financial
// institutions; the network is "expected to become available to participating institutions in the first half of 2027").
// The shore is seen from the SIDE here (the mainland on the left, the sea to the right) so the story runs left to right:
// on "open" a harbour gate draws on the shore (two stone pillars, a lintel, its iron leaves swung open: open to banks);
// on "in" a flag rises on the gate and "H1" / "2027" are written on it as he says "first half" / "2027". On "25" an
// archipelago of exactly 25 small islands sweeps in across the water from the gate outwards (each the kit's island: land
// and palm, no bank at this size), "25" and "islands" typed above them as he says them. On "digital" a token glyph pops
// on every island (each with its own digital deposits). On "one" the ORANGE band draws as one pen stroke round the whole
// group, starting at the gate (the one highlight mark of the beat), "one" / "network" typed above it on "one" / "network".
// On "connected" an orange thread runs from the gate into the band. On "rails" two plank tracks draw on the mainland from
// the left edge into the gate (the rails the banks already use; a rail track is what WB3 drew for payment rails) and
// "RTP" / "CHIPS" are written on them on "banks" / "already". On "around" a dotted trail leaves the band's right edge and
// runs off the right edge of the page; on "trail" / "of" three small paper receipts pop along it, the last landing as he
// says "receipts". Payoff: 25 islands under one band, the two rails into the gate, the trail of receipts leading off.
// Canvas = the full frame 1920 x 1080 @30, spine 294.900 to 309.900 s = 15.0 s = 450 frames, no audio; the comp build
// fades it in and out. Pen: paper-quant (the one orange mark = the band with its label and thread; everything else the
// pen unchanged). Everything is SVG through rough.js with fixed seeds (no boil, deterministic). Numbers on screen: 25 and
// H1 2027 only (the brief / DATA.md T3); no "$2 trillion", no bank names, no logos, nothing flows from the rails through
// the band (the tracks end at the gate; the thread is the connection), no "picked by the 25".
// Rounds (the builder's own stills, 2026-11-05): 1 -> Kalam's 1 read "HI" on the flag (the 1 is drawn now, harbour.tsx InkOne);
// the islands on a plain jittered lattice read as a grid (rows now alternate +-50 px, jitter +-44 / +-34, a re-draw when two
// would touch); the tracks at a 30 px gauge with 25 percent sleeper overhang read ladder-like (42 px / 20 percent); the receipts
// grew to 34 x 46. Measured on the last frame: the islands keep 65 / 39 / 71 / 44 px to the band's left / right / top / bottom
// edges, the last receipt ends 23 px inside the frame; the trail's dots run off the right edge and the two tracks arrive
// from off the left edge by design (the kit's DottedArrow head 0 idiom; the rails come from the rest of the country).
// Round 5 (after visual-qa, 2026-11-05): the coast ran through the open gateway and beside the flag pole (a doubled line): it now
// swings left over y 300..630 and passes BEHIND the gate's left pillar (`SideShore detour`), 62 px from the pole, nothing in the
// opening; Kalam's 5 read as an S ("2S"): the 5 is DRAWN (harbour.tsx InkFive: flat bar, stem, bowl) with air each side; the
// islands' outlines drew as floating dashes: `Island sequential`; the upper track's sleeper ran under the lintel: its near end
// dropped 16 px onto the pillar face; the trail's dots hid under the receipts: the slips now alternate above / below the
// trail line (12 px clear of it), the dots start 14 px clear of the band and one straddles the right edge; the receipts are
// cued on "two" / "are" / "trail" so the last is complete (pop + 4 lines) at 13.92, 0.78 s before the compositor's fade.
// Round 7 (after visual-qa on the round-6 stills, 2026-11-05): the two tracks were `RailTrack`s (stroked sleepers crossing two
// rails: the fence / ladder anatomy the WB12 round-4 lesson rules out, and WB2 already has a fence in this video): they are
// `PlankTrack`s now (filled wooden planks slanted along the track's perspective, lying UNDER two heavy rails), receding to
// the LEFT edge (negative `len`, lean 121 = the mirror of WB12's 59), painted BEFORE the gate so their near ends vanish
// under the left pillar (the rails run into the gate, nothing ends in mid-air); the band's loop had a 2 px nick where its
// closing run stopped 6 px short of its start: `NetLoop` overshoots the start by 6 px now; "CHIPS" moved right so its ink
// starts ~68 px from the left edge (was 45; the label margin is ~60).
// Round 8 (after visual-qa on the round-7 stills, 2026-11-05): the rails stopped 6 px short of the left edge (the far centre at
// x 5, a near-miss): the tracks are 40 px longer (far centre x -35, rise scaled so the slope is unchanged), so both rails of each
// track and the last two planks run off the page; RTP / CHIPS air re-measured on the stills.
// The storyboard is the CUES table below: LOCAL seconds (0 = spine 294.900), each hung on a spoken word of
// `spine/ALL.f.enhanced.medium-words.json`; a thing draws as he names it, never before.
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont as loadGochi } from '@remotion/google-fonts/GochiHand';
import { loadFont as loadKalam } from '@remotion/google-fonts/Kalam';
import { loadFont as loadRockSalt } from '@remotion/google-fonts/RockSalt';
import { loadFont as loadHandlee } from '@remotion/google-fonts/Handlee';
import { PENS } from '../pen';
import { Type } from '../vocab';
import { DottedArrow, PlankTrack, Thread } from '../bank';
import { HexToken } from '../deposits';
import { Island } from '../islands';
import { HarbourGate, InkFive, InkOne, NetLoop, Receipt, RectFlag, SideShore, archipelago, harbourGateGeom, rectFlagGeom } from '../harbour';

const { fontFamily: GOCHI } = loadGochi();
const { fontFamily: KALAM } = loadKalam('normal', { weights: ['400', '700'] });
const { fontFamily: ROCKSALT } = loadRockSalt();
const { fontFamily: HANDLEE } = loadHandlee();
const FONTS: Record<string, string> = { 'Gochi Hand': GOCHI, Kalam: KALAM, 'Rock Salt': ROCKSALT, Handlee: HANDLEE };

export const FPS = 30;
/** 15.0 s x 30 = 450 frames (spine 294.900 to 309.900) */
export const DUR = 450;
export const W = 1920;
export const H = 1080;

// ---- the storyboard: LOCAL seconds (spine seconds minus 294.900), the word each cue hangs on ----
const CUES = {
  stage: 0.0,      // "Expected" (under the compositor's fade-in)  the shore: the mainland left of a vertical coastline, the sea tints to its right, tufts, wave ticks
  gate: 0.82,      // "open"           the harbour gate draws on the shore: pillars, caps, lintel, the iron leaves swung open (0.7 s)
  flag: 1.54,      // "in"             a flag rises on the gate's lintel: pole, finial, cloth (0.5 s)
  h1: 1.86,        // "first"          "H1" is written on the flag
  y2027: 2.56,     // "2027."          "2027" is written after it
  islands: 4.04,   // "25"             25 small islands sweep in across the water from the gate outwards, one every 0.04 s (0.5 s each; the last lands 5.50)
  n25: 4.04,       // "25"             "25" types above the group
  nIslands: 4.60,  // "islands,"       "islands" types after it
  tokens: 6.06,    // "digital"        a token glyph pops on every island, in the sweep's order, one every 0.025 s (0.35 s each)
  band: 7.44,      // "one"            the ORANGE band draws as one stroke round the whole group, from the gate clockwise (1.0 s)
  lOne: 7.44,      // "one"            "one" types above the band, in orange
  lNetwork: 7.92,  // "network"        "network" types after it
  thread: 9.46,    // "connected"      an orange thread runs from the gate's right pillar into the band's left edge, a dot where it lands (0.5 s)
  rails: 10.16,    // "rails"          two plank tracks draw on the mainland into the gate from off the left edge, the upper first (0.6 s each, the lower 0.12 s later)
  rtp: 10.68,      // "banks"          "RTP" is written above the upper track
  chips: 10.82,    // "already"        "CHIPS" is written below the lower track
  trail: 12.14,    // "around"         a dotted trail leaves the band's right edge and runs off the right edge of the page (0.6 s)
  r1: 12.64,       // "two"            the first receipt pops above the trail (0.3 s pop, its four lines by 0.6 s)
  r2: 12.98,       // "are"            the second, below the trail
  r3: 13.32,       // "trail"          the third, the last, complete at 13.92 as he says "receipts." (13.90); held 0.78 s before the compositor's fade starts at 14.70
};

// ---- layout ----
const SHORE = 320;                                                        // the coastline's x: the mainland to its left, the sea to its right
// the coast swings left to x 256 over y 300..630 (eased over 120 px each side) and passes BEHIND the gate's left pillar (236..276 x
// 480..620): the gate stands on the shore with its left pier on the coastline, the opening and the right pier over the water;
// the line is 62 px from the flag pole (318) and never crosses the open gateway (visual-qa round 4)
const COAST = { y0: 300, y1: 630, x: 256 };
const GATE = { cx: 318, gy: 620 };                                        // the gate on the shore: its left pillar hides the coast, the leaves open onto the water
const GG = harbourGateGeom(GATE.cx, GATE.gy);                             // pillars 236..276 and 360..400, 480..620; lintel 224..412 x 456..480
const FLAG = { x: GATE.cx, gy: GG.lintelY, top: 380, w: 128, h: 54 };    // the pole on the lintel; the cloth 321..449 x 386..440, 31 px clear of the band's left edge (480)
const FG = rectFlagGeom(FLAG.x, FLAG.top, FLAG.w, FLAG.h);
// the band round the archipelago: in the water, its left edge 70 px right of the gate's right pillar (the thread crosses the gap)
const BAND = { x: 480, y: 150, w: 1260, h: 850, r: 70 };
// the 25 islands on a 5 x 5 lattice inside the band whose rows alternate left / right by 50 px, jittered +-44 / +-34 with
// a re-draw whenever two would touch (harbour.tsx `archipelago`): centres 700..1520 (+-50 shift), ground lines 275..895;
// the widest island (0.335 x 580 = 194 px) at the extreme jitter keeps ~29 px inside the band's sides, the back row ~60 px
// under its top edge, the front row ~40 px above its bottom edge; no shore ticks on them (their count is the point)
const ARCH = archipelago(5, 5, { x0: 700, x1: 1520, gy0: 275, gy1: 895 }, 7);
const TOKEN_R = 15;
// labels above the band (baseline 112, 38 px above its top edge): "25 islands" over the left half, "one network" over the right
const LBL = 44;
const LBLW = 0.46;                                                        // Kalam 700 ~0.46 em per glyph (quant WB12 stills)
const N25 = { x: 660, y: 112, five: 34, gap: 82 };                        // "2" (Kalam, ~26 px), the DRAWN 5 `five` px right of it (8 px air), then "islands" `gap` px to the right
const ONE = { x: 1300, y: 112, gap: 76 };                                 // "one" then "network"
// the thread from the gate into the band: from the right pillar's outer face to the band's left edge, a little bowed
const THREAD = { p0: [402, 560] as [number, number], p1: [440, 546] as [number, number], p2: [478, 560] as [number, number] };
// the two rail tracks on the mainland: PlankTracks (round 7: filled slanted wooden planks under two heavy rails, the WB12
// anatomy; a stroked-sleeper RailTrack read as a fence / ladder) whose near centre sits 14 px INSIDE the gate's left pillar
// (236..276) and which recede PAST the LEFT edge (negative len: the far centre at x -35, 35 px off the page, so all four
// rails cross column x 0 and end at x -32..-38, the last two planks lie wholly off page; round 8 after visual-qa: at len -245
// the far centre sat at x 5 and the rails stopped 6 px short of the edge; rise scaled 40 -> 46 with the length so the slope
// and the heights at the frame edge are unchanged; lean 121 = the "/" mirror of WB12's 59 so the far rail is up-right of the
// near rail). They are painted BEFORE the gate, so the near plank (x 237..263)
// and the rails' near ends (241 / 259) vanish under the pillar: the rails run INTO the gate. At the pillar's edge (x 236) the
// upper track's rails sit at ~509 / ~537 and its plank tips 502..544 (20 px under the cap stone, 470..482); the lower's rails
// ~578 / ~606, plank tips 571..613 (7 px above the pillar foot, 620); 27 px between the two tracks there, the fan (rise +-40)
// opening leftward. Gauge 34 -> 10 at the far end (~13 where the rails cross x 0: upper rails ~479 / ~490 there, lower ~627 / ~638),
// planks 25 percent longer than the gauge each side, 12 px thick at the near end.
const RAIL = { x: 250, len: -285, gap: 34, gapFar: 10, overhang: 0.25, lean: 121, thick: 12, heavy: 1.6, upper: { y: 525, rise: 46 }, lower: { y: 592, rise: -46 } };
const RTP = { x: 112, y: 436 };                                           // above the upper track: its ink ~71..153, the plank tips under it ~484 (at x 71) .. ~492 (at x 153) (~48 px air)
const CHIPS = { x: 136, y: 712 };                                         // below the lower track: its ink starts ~68 px from the left edge (round 7, was 45), the plank tips above it ~626 (at x 136) .. ~614 (at x 250) (~55 px air to its ink top ~681)
// the trail of receipts: from the band's right edge off the right edge of the page, three slips along it
// the dots (period 16.5 px) start 14 px clear of the band and run to 1960: the 11th straddles the right edge (1919), so the trail
// visibly leaves the page; the slips sit 12 px ABOVE / BELOW the line (never on it: a dot under a slip read as a tab on it)
const TRAIL = { x1: BAND.x + BAND.w + 14, x2: 1960, y: 600 };
const RECEIPT = { w: 34, h: 46 };
const RECEIPTS: [number, number][] = [[1780, 562], [1830, 638], [1880, 562]];   // the last ends at 1897, 23 px inside the frame; the dots run past it off the page
// wave ticks in open water: outside the band (below it, right of it, above it between the labels), and in the strip between the shore and the band
const TICKS: [number, number][] = [
  [560, 1046], [960, 1050], [1400, 1046], [1850, 330], [1858, 880], [1120, 66], [1720, 70], [395, 820], [405, 230],
];

export const QuantWB7: React.FC<{ penId?: string }> = ({ penId = 'paper-quant' }) => {
  const PEN = PENS[penId] ?? PENS['paper-quant'];
  const FL = FONTS[PEN.fontL];
  const C = (s: string) => (PEN.caps ? s.toUpperCase() : s);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = frame / fps;                 // local seconds
  const at = (cue: number) => T - cue;   // time since a cue (negative = not yet)
  const ORANGE = PEN.palette.red;
  const INK = PEN.colorL;

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
          {/* ===== scene 1: the shore, the harbour gate, the flag H1 2027 ===== */}
          <SideShore shore={SHORE} ticks={TICKS} t={at(CUES.stage)} pen={PEN} seed={1} detour={COAST} />
          {/* the two tracks (scene 3, drawn on "rails") are PAINTED here, under the gate: their near ends hide behind its left pillar */}
          {([['upper', 0], ['lower', 0.12]] as const).map(([which, delay], i) => {
            const r = RAIL[which];
            return (
              <PlankTrack key={which} x={RAIL.x} y={r.y} len={RAIL.len} rise={r.rise} gap={RAIL.gap} gapFar={RAIL.gapFar} overhang={RAIL.overhang} lean={RAIL.lean}
                thick={RAIL.thick} heavy={RAIL.heavy} t={at(CUES.rails + delay)} pen={PEN} seed={6 + i} dur={0.6} />
            );
          })}
          <HarbourGate cx={GATE.cx} gy={GATE.gy} t={at(CUES.gate)} pen={PEN} seed={2} />
          <RectFlag x={FLAG.x} gy={FLAG.gy} top={FLAG.top} w={FLAG.w} h={FLAG.h} color={PEN.palette.gold} t={at(CUES.flag)} pen={PEN} seed={3}>
            {/* "H" and "2027" in the label font; the 1 is DRAWN (stem, flag, foot): Kalam's 1 is a bare stroke and "H1" read "HI" on the round-1 still */}
            <Type x={FG.x0 + 10} y={FG.cy + 10} text={C('H')} t={at(CUES.h1)} cps={16} size={28} font={FL} color={PEN.ink} weight="700" anchor="start" />
            <InkOne x={FG.x0 + 36} baseline={FG.cy + 10} size={28} t={at(CUES.h1) - 0.08} pen={PEN} seed={31} />
            <Type x={FG.x0 + 52} y={FG.cy + 10} text={C('2027')} t={at(CUES.y2027)} cps={16} size={28} font={FL} color={PEN.ink} weight="700" anchor="start" />
          </RectFlag>

          {/* ===== scene 2: 25 islands sweep in, each with its own digital deposits (back row first: depth) ===== */}
          {ARCH.islands.map((isl) => {
            const n = ARCH.sweepIndex(isl.i);
            const k = isl.scale ?? 1;
            return (
              <g key={isl.i}>
                <Island cx={isl.cx} top={isl.top} w={isl.w} h={isl.h} scale={k} t={at(CUES.islands + n * 0.04)} palm waves={false} sequential pen={PEN} seed={100 + isl.i} dur={0.5} />
                <HexToken cx={isl.cx + 0.1 * 580 * k} cy={isl.gy - TOKEN_R - 3} r={TOKEN_R} t={at(CUES.tokens + n * 0.025)} pen={PEN} seed={200 + isl.i} font={FL} />
              </g>
            );
          })}
          {/* "2" in the label font, the 5 DRAWN beside it (Kalam's 5 is one curved stroke: "25" read "2S", visual-qa round 4) */}
          <Type x={N25.x} y={N25.y} text={C('2')} t={at(CUES.n25)} cps={16} size={LBL} font={FL} color={INK} weight="700" anchor="start" />
          <InkFive x={N25.x + N25.five} baseline={N25.y} size={LBL} t={at(CUES.n25) - 0.1} pen={PEN} seed={32} color={INK} stroke={4.8} />
          <Type x={N25.x + N25.gap} y={N25.y} text={C('islands')} t={at(CUES.nIslands)} cps={24} size={LBL} font={FL} color={INK} weight="700" anchor="start" />

          {/* ===== scene 3: one shared network between them (the orange band round the group), connected to the rails through the gate ===== */}
          <NetLoop x={BAND.x} y={BAND.y} w={BAND.w} h={BAND.h} r={BAND.r} t={at(CUES.band)} pen={PEN} seed={4} />
          <Type x={ONE.x} y={ONE.y} text={C('one')} t={at(CUES.lOne)} cps={16} size={LBL} font={FL} color={ORANGE} weight="700" anchor="start" />
          <Type x={ONE.x + ONE.gap} y={ONE.y} text={C('network')} t={at(CUES.lNetwork)} cps={24} size={LBL} font={FL} color={ORANGE} weight="700" anchor="start" />
          <Thread p0={THREAD.p0} p1={THREAD.p1} p2={THREAD.p2} t={at(CUES.thread)} pen={PEN} seed={5} />
          {/* the tracks themselves are painted under the gate (scene 1's block); their labels go on top */}
          <Type x={RTP.x} y={RTP.y} text={C('RTP')} t={at(CUES.rtp)} cps={16} size={LBL} font={FL} color={INK} weight="700" charW={0.62} />
          <Type x={CHIPS.x} y={CHIPS.y} text={C('CHIPS')} t={at(CUES.chips)} cps={16} size={LBL} font={FL} color={INK} weight="700" charW={0.62} />

          {/* ===== payoff: a trail of receipts leads off the right edge ===== */}
          <DottedArrow x1={TRAIL.x1} y1={TRAIL.y} x2={TRAIL.x2} y2={TRAIL.y} t={at(CUES.trail)} pen={PEN} seed={8} dur={0.6} head={0} />
          {RECEIPTS.map(([cx, cy], i) => <Receipt key={i} cx={cx} cy={cy} w={RECEIPT.w} h={RECEIPT.h} t={at([CUES.r1, CUES.r2, CUES.r3][i])} pen={PEN} seed={9 + i} />)}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

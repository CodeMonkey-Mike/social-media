// whiteboard/beats/QuantWB5.tsx: whiteboard beat WB5 of the longform-edited video `quant`
// (brief: media/quant/assets/whiteboard/WB5.brief.md; cues: assets/whiteboard/WB5.cues.md).
// "Every leg commits together or none of them do" (DATA.md Pillar 2: Chiriac 2026-07-30 "one leg clears, the other
// hasn't, and there's a window where the transaction sits in limbo"; the Synchronisation Lab release 2026-02-13 "all legs
// committed together or not at all"). The stage is the sea with WB3's orange layer band faint in the sky (WB4's stage;
// the two beats are contiguous). On "synchronized" three islands draw on in a triangle: WB1's A (front left) and B
// (front right) and D (back centre, the small one), each with its bank and its vault door, from the shared
// `QUANT_ISLANDS` layout. THE OLD WAY: on "leg" (each leg ... on its own) the first leg draws as an ink arrow through the
// channel from A to B; on "clears" a green check pops at its landing; on "other" the second leg sets off from B toward D
// as a DASHED arrow (in flight, not committed) and on "hasn't" it halts mid-water, its head hanging there; on "limbo"
// the orange label "limbo" types beside the hanging head. WITH THIS LAYER: on "layer" the band in the sky brightens to full with "Quant"
// on it, on "every" (bank involved) the old attempt fades out (the re-draw of all three legs needs the routes clear; "limbo"
// has been fully typed for 1.1 s by then); on "reserves" a gold padlock draws shut on each of the three vault doors (A, B, D),
// fitted inside each door's inner ring of bolts (`LOCK`); on "together" all three
// legs draw at once, solid, and land together, three green checks popping at the three landings (each check drawn stroke
// by stroke, `CheckBadge sequential`); on "none" the orange
// label "all or none" types in the middle of the triangle. Payoff: the finished triangle holds under "I feel you bro"
// and the rewatch line (nothing new draws, the brief).
// Canvas = the full frame 1920 x 1080 @30, spine 151.760 to 177.600 s = 25.84 s = 775 frames, no audio; the comp build
// fades it in and out. Pen: paper-quant (the orange accents are the brief's: "limbo", "all or none", the band is
// WB3's). Everything is SVG through rough.js with fixed seeds (no boil, deterministic). No numbers on screen (none
// allowed), no amounts, no bank names, no phone / double-tap glyph (the brief). Three islands exactly, from
// `QUANT_ISLANDS` (islands.tsx) with WB1's seeds so they are the same drawings as WB1 / WB2 / WB3 / WB4 (no ledger).
// The storyboard is the CUES table below: LOCAL seconds (0 = spine 151.760), each hung on a spoken word of
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
import { LayerBand } from '../bank';
import { Island, QUANT_ISLANDS, Sea, islandGeom, scaledPen } from '../islands';
import { CheckBadge } from '../layer';
import { Padlock } from '../settlement';
import { LegArrow } from '../sync';

const { fontFamily: GOCHI } = loadGochi();
const { fontFamily: KALAM } = loadKalam('normal', { weights: ['400', '700'] });
const { fontFamily: ROCKSALT } = loadRockSalt();
const { fontFamily: HANDLEE } = loadHandlee();
const FONTS: Record<string, string> = { 'Gochi Hand': GOCHI, Kalam: KALAM, 'Rock Salt': ROCKSALT, Handlee: HANDLEE };

export const FPS = 30;
/** 25.84 s x 30 = 775 frames (spine 151.760 to 177.600) */
export const DUR = 775;
export const W = 1920;
export const H = 1080;

// ---- the storyboard: LOCAL seconds (spine seconds minus 151.760), the word each cue hangs on ----
const CUES = {
  stage: 0.0,        // (blank paper under the tail of "way.") the coast, the sea and WB3's layer band faint in the sky, under the compositor's fade-in
  islands: 1.58,     // "synchronized"   island A draws on (land, palm, bank +0.1, vault +0.3), B 0.2 s later, D (back centre) 0.4 s later
  leg1: 3.90,        // "leg"            (each leg ... on its own) the first leg draws through the channel, A to B (1.1 s, lands 5.0)
  check1: 6.24,      // "clears"         a green check pops at the first leg's landing
  leg2: 7.28,        // "other"          the second leg sets off from B toward D, DASHED (in flight, not committed)
  halt: 7.76,        // "hasn't"         it halts mid-water, its head hanging there (the draw rate lands p = 0.5 exactly here)
  limbo: 10.44,      // "limbo"          "limbo" types in orange beside the hanging head
  layer: 11.30,      // "layer"          the band in the sky brightens from faint to full, "Quant" with it (0.5 s)
  fade: 11.82,       // "every"          the old attempt fades out (0.5 s): the legs, the check, the label ("limbo" has had 1.1 s fully typed)
  locks: 12.96,      // "reserves"       a gold padlock draws shut on A's vault door, B's 0.12 s later, D's 0.24 s later (0.4 s each)
  together: 15.62,   // "together"       all three legs draw at once, solid (0.55 s), landing together at 16.17
  checks: 16.17,     // "together" (held) three green checks pop at the three landings at once (0.28 s)
  none: 16.82,       // "none"           "all or none" types in orange in the middle of the triangle (0.5 s); then the drawing holds to the end
};

// ---- layout ----
const [IA, IB, , ID] = QUANT_ISLANDS;                      // the triangle: A (front left), B (front right), D (back centre, 0.5 scale)
const GA = islandGeom(IA), GB = islandGeom(IB), GD = islandGeom(ID);
const SEA_HORIZON = 300;
// wave ticks in open water, clear of the islands (A 140..720 x 600..790, B 1080..1660 x 620..810, D 735..1025 x 360..455),
// the three legs, the labels, the badges and the band (bottom 203)
const TICKS: [number, number][] = [
  [260, 930], [520, 985], [900, 1000], [1250, 960], [1560, 1000], [1800, 930], [560, 1035], [1000, 1040], [1700, 1040],
  [880, 880], [1300, 870], [75, 760], [120, 440], [330, 470], [560, 400], [1250, 385], [1600, 420], [1830, 560], [1850, 740],
  [300, 338], [1150, 336], [1800, 330],
];
// WB3's layer band, faint until "layer": 220..1700 x 117..203, "Quant" on it
const BAND = { x: 220, y: 117, w: 1480, h: 86 };
const BAND_GHOST = 0.35;
const QUANT = { size: 58, y: BAND.y + 55 };
const QUANT_W = 0.5, QUANT_SP = 0.1;                       // Gochi Hand 700 ~0.50 em per glyph, letter-spaced 0.1 em (quant WB12)
// the three legs (quadratic routes in the water, each end 25 to 45 px off its island's edge; the control point bulges
// the route AWAY from the island business it passes: B's palm fronds, D's palm):
// leg 1: A's front-right shore to B's left shore through the channel (a slight sag); leg 2: the water above B's vault
// door (36 px over the frond tip at 1166, 600) up-left to D's right tip; leg 3: under D's lower-left shore down-left to
// the water above A's right lobe
const LEG1 = { p0: [680, 770] as [number, number], p1: [885, 800] as [number, number], p2: [1075, 770] as [number, number] };
const LEG2 = { p0: [1205, 598] as [number, number], p1: [1145, 490] as [number, number], p2: [1048, 415] as [number, number] };
const LEG3 = { p0: [805, 474] as [number, number], p1: [718, 519] as [number, number], p2: [660, 596] as [number, number] };
const HALT_P = 0.5;                                         // where the second leg hangs (its head at ~ (1130, 503))
// the check badges (r 15) at the three landings, each beside its arrowhead on the water side
const BADGE = { leg1: [1040, 814] as [number, number], leg2: [1092, 388] as [number, number], leg3: [622, 576] as [number, number] };   // 23 px of air from the nearest arm end, measured on the round-1 crops (round 1: 7 to 15 px)
// "limbo" (Kalam 700, orange) right of the hanging head; "all or none" in the middle of the triangle (water: A's right
// lobe ends ~700 at this height, B's left begins ~1100, D's bottom 455, leg 1 at 770)
const LIMBO = { x: 1165, y: 520, size: 44 };
const NONE = { x: 895, y: 650, size: 48 };
const LBLW = 0.46;                                          // Kalam 700 measured ~0.46 em per glyph (quant WB12 stills)
// the padlocks on the vault doors, each fitted INSIDE the door's inner ring with clear air (visual-qa round 2, 2026-11-05: at
// full size the shackle's arc lay on the bolt ring and the body's corners crossed the inner ring, one dark bar on every door).
// The lock is authored at the kit's 40 x 30 body and the whole lock is scaled by `k` about the door's centre (strokes kept at
// pen width through `scaledPen`). Its bounding radius about its own box centre is ~28.4 at full size (shackle top and body
// corners equidistant once the box sits 2.7 px above the door centre = body centre `dy` 8 under it), so at k 0.66 the ink
// reaches ~20 px from the door centre against the inner ring's ink at ~25.6 (r 36 door: rim r 26.6, bolts at r 31.3): ~5.5 px
// of air all round, measured on the round-2 crops. D's r 18 door takes the same lock at 0.45 of that (k 0.30) with a lighter
// stroke pen so the shackle's U keeps its opening. Gold = the reserved funds (grey would vanish on the grey door). A plain
// disc in the door's own fill (`knock`, r 23 / 10.4) sits under each lock so the hand wheel's spokes do not run through the U.
const LOCK = { w: 40, h: 30, dy: 8, k: 0.66, knock: 23, dScale: 0.45 };   // dScale 0.45 (not the door's 0.5): D's rim is drawn at full pen width, so the half-size lock keeps ~4 px of air instead of 3

export const QuantWB5: React.FC<{ penId?: string }> = ({ penId = 'paper-quant' }) => {
  const PEN = PENS[penId] ?? PENS['paper-quant'];
  const FH = FONTS[PEN.fontH], FL = FONTS[PEN.fontL];
  const C = (s: string) => (PEN.caps ? s.toUpperCase() : s);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = frame / fps;                 // local seconds
  const at = (cue: number) => T - cue;   // time since a cue (negative = not yet)
  const ORANGE = PEN.palette.red, GOLD = PEN.palette.gold;
  const penL = scaledPen(PEN, LOCK.k, 'lk');                       // A and B: full pen width on the scaled lock
  const penD = scaledPen(PEN, 0.55, 'lkd');                        // D: strokes at ~0.6 pen width (body 1.4 px, shackle 2.2 px)

  // the old way: leg 1 draws and lands; leg 2 draws dashed and halts at HALT_P on "hasn't"; the attempt fades on "With"
  const old1 = easeOut(prog(at(CUES.leg1), 0, 1.1));
  const old2 = Math.min(HALT_P, Math.max(0, at(CUES.leg2)) * (HALT_P / (CUES.halt - CUES.leg2)));
  const oldOp = 1 - easeOut(prog(at(CUES.fade), 0, 0.5));
  // with this layer: the band brightens, the locks shut, all three legs land together
  const bandOp = BAND_GHOST + (1 - BAND_GHOST) * easeOut(prog(at(CUES.layer), 0, 0.5));
  const newP = easeOut(prog(at(CUES.together), 0, 0.55));
  // a padlock shut on a vault door centred (cx, cy): the knockout disc (the door's own fill, no outline) fades in with the
  // lock's first stroke, then the lock draws at scale `k` about the door's centre
  const Lock = ({ cx, cy, k, pen, t, seed }: { cx: number; cy: number; k: number; pen: typeof PEN; t: number; seed: number }) => (
    <>
      {t > 0 && <circle cx={cx} cy={cy} r={LOCK.knock * (k / LOCK.k)} fill={PEN.palette.blue} opacity={easeOut(prog(t, 0, 0.15))} />}
      <g transform={`translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})`}>
        <Padlock cx={cx} cy={cy + LOCK.dy} w={LOCK.w} h={LOCK.h} t={t} pen={pen} seed={seed} color={GOLD} dur={0.4} />
      </g>
    </>
  );

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
          {/* ===== scene 1: the stage (the sea, the layer band faint), three islands in a triangle (the back one first: depth) ===== */}
          <Sea horizon={SEA_HORIZON} ticks={TICKS} t={at(CUES.stage)} pen={PEN} seed={1} />
          <g opacity={bandOp}>
            <LayerBand x={BAND.x} y={BAND.y} w={BAND.w} h={BAND.h} t={at(CUES.stage) + 1} pen={PEN} seed={5} shadow={0} />
            <Type x={BAND.x + BAND.w / 2} y={QUANT.y} text={C('Quant')} t={at(CUES.stage) + 1} cps={100} size={QUANT.size} font={FH} color={PEN.colorH} weight="700" charW={QUANT_W} spacing={QUANT_SP} />
          </g>
          <Island {...ID} t={at(CUES.islands + 0.4)} bankT={at(CUES.islands + 0.4) - 0.1} vaultT={at(CUES.islands + 0.4) - 0.3} pen={PEN} seed={13} waves={false} />
          <Island {...IA} t={at(CUES.islands)} bankT={at(CUES.islands) - 0.1} vaultT={at(CUES.islands) - 0.3} pen={PEN} seed={10} />
          <Island {...IB} t={at(CUES.islands + 0.2)} bankT={at(CUES.islands + 0.2) - 0.1} vaultT={at(CUES.islands + 0.2) - 0.3} pen={PEN} seed={11} />

          {/* ===== scene 2: the old way, each leg on its own (one lands, the other hangs mid-water, limbo) ===== */}
          {oldOp > 0 && (
            <g opacity={oldOp}>
              <LegArrow {...LEG1} p={old1} pen={PEN} seed={30} />
              <CheckBadge cx={BADGE.leg1[0]} cy={BADGE.leg1[1]} r={15} t={at(CUES.check1)} pen={PEN} seed={32} sequential />
              <LegArrow {...LEG2} p={old2} pen={PEN} seed={34} dashed />
              <Type x={LIMBO.x} y={LIMBO.y} text={C('limbo')} t={at(CUES.limbo)} cps={16} size={LIMBO.size} font={FL} color={ORANGE} weight="700" charW={LBLW} anchor="start" />
            </g>
          )}

          {/* ===== scene 3: with this layer, every bank reserves its funds first (a padlock on every vault door) ===== */}
          <Lock cx={GA.vault[0]} cy={GA.vault[1]} k={LOCK.k} pen={penL} t={at(CUES.locks)} seed={40} />
          <Lock cx={GB.vault[0]} cy={GB.vault[1]} k={LOCK.k} pen={penL} t={at(CUES.locks + 0.12)} seed={41} />
          <Lock cx={GD.vault[0]} cy={GD.vault[1]} k={LOCK.k * LOCK.dScale} pen={penD} t={at(CUES.locks + 0.24)} seed={42} />

          {/* ===== scene 4 / payoff: every leg commits together, all or none ===== */}
          <LegArrow {...LEG1} p={newP} pen={PEN} seed={50} />
          <LegArrow {...LEG2} p={newP} pen={PEN} seed={52} />
          <LegArrow {...LEG3} p={newP} pen={PEN} seed={54} />
          <CheckBadge cx={BADGE.leg1[0]} cy={BADGE.leg1[1]} r={15} t={at(CUES.checks)} pen={PEN} seed={60} sequential />
          <CheckBadge cx={BADGE.leg2[0]} cy={BADGE.leg2[1]} r={15} t={at(CUES.checks)} pen={PEN} seed={61} sequential />
          <CheckBadge cx={BADGE.leg3[0]} cy={BADGE.leg3[1]} r={15} t={at(CUES.checks)} pen={PEN} seed={62} sequential />
          <Type x={NONE.x} y={NONE.y} text={C('all or none')} t={at(CUES.none)} cps={22} size={NONE.size} font={FL} color={ORANGE} weight="700" charW={LBLW} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

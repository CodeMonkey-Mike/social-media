// whiteboard/beats/QuantWB11.tsx: whiteboard beat WB11 of the longform-edited video `quant`
// (brief: media/quant/assets/whiteboard/WB11.brief.md; cues: assets/whiteboard/WB11.cues.md).
// "So here's my read on Quant": the four islands of WB1 / WB3 draw back on under "my read" (the sea first, under the
// compositor's fade-in). On "coin" a fifth, smaller island sketches in the middle of the four with a token coin dropping
// onto it ("a coin trying to become the banks' new blockchain"); on "blockchain" an orange X strikes it out, and on
// "layer" the rejected idea ghosts while the ORANGE band draws in the sky over all four islands, "Quant" typed onto it.
// On "into" (letting into the building) the entrance of every bank darkens and its door leaf swings open, A first. On
// "live" a flag pole rises on island A's shore, on "UK" its cloth flies with "UK" written on it and a green check pops
// beside it; on "date" a pole rises on island B's shore, on "US" its cloth flies with "US", and "H1 2027" is written
// beside it (DATA.md T3: The Clearing House network "in the first half of 2027"). NOTHING new draws under the two
// conditional sentences (12.1 to 19.4 s: the drawing holds). Under the screen share (537.967 s on, the clip scaled into
// the deck area), on "one" (every one of those banks is an island) the four land outlines re-ink one after another as a
// heavier pen stroke UNDER each island's furniture; on "quant" (Quant is the one holding the contracts) two contract
// sheets pop onto the band, "GBTD" over the UK side and "TCH" over the US side; on "holding" four orange threads drop
// from the band to the four vault doors, and on "contracts" a small padlock and a check badge pop at each thread's top
// and slide down it (at rest by 24.9, 0.55 s before the compositor's fade starts at 25.45: the payoff HOLDS, visual-qa
// round 3). Payoff: the islands connected through the layer that holds the two contracts; the finished drawing holds.
// Canvas = the full frame 1920 x 1080 @30, spine 518.420 to 544.167 s = 25.747 s = 772 frames, no audio; the comp build
// fades it in and out. Pen: paper-quant (the orange = the strike, the band and its label, the threads: the brief's Quant
// marks; everything else the pen unchanged). Everything is SVG through rough.js with fixed seeds (no boil, deterministic).
// Numbers on screen: "H1 2027" only (the brief / DATA.md T3). No price, no target, no multiplier, no re-rate arrow or
// chart, no bank names or logos. Four islands exactly from `QUANT_ISLANDS` (islands.tsx) with WB1's seeds, plus the
// fifth one at WB3's visual-qa'd spot. The payoff ink stays left of x 1854 (the clip is scaled by 1464/1920 under Mike's
// face: ~50 px clear of the deck area's right edge).
// The storyboard is the CUES table below: LOCAL seconds (0 = spine 518.420), each hung on a spoken word of
// `spine/ALL.f.enhanced.medium-words.json`; a thing draws as he names it, never before.
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont as loadGochi } from '@remotion/google-fonts/GochiHand';
import { loadFont as loadKalam } from '@remotion/google-fonts/Kalam';
import { loadFont as loadRockSalt } from '@remotion/google-fonts/RockSalt';
import { loadFont as loadHandlee } from '@remotion/google-fonts/Handlee';
import { PENS } from '../pen';
import { Type, bezier } from '../vocab';
import { easeOut, prog } from '../Sketch';
import { CrossOut } from '../welfare';
import { ContractSheet, DoorOpen, LayerBand, Thread } from '../bank';
import { Island, QUANT_ISLANDS, Sea, islandGeom, scaledPen } from '../islands';
import { InkOne, RectFlag, rectFlagGeom } from '../harbour';
import { TokenCoin } from '../supply';
import { Padlock } from '../settlement';
import { CheckBadge } from '../layer';

const { fontFamily: GOCHI } = loadGochi();
const { fontFamily: KALAM } = loadKalam('normal', { weights: ['400', '700'] });
const { fontFamily: ROCKSALT } = loadRockSalt();
const { fontFamily: HANDLEE } = loadHandlee();
const FONTS: Record<string, string> = { 'Gochi Hand': GOCHI, Kalam: KALAM, 'Rock Salt': ROCKSALT, Handlee: HANDLEE };

export const FPS = 30;
/** 25.747 s x 30 = 772 frames (spine 518.420 to 544.167) */
export const DUR = 772;
export const W = 1920;
export const H = 1080;

// ---- the storyboard: LOCAL seconds (spine seconds minus 518.420), the word each cue hangs on ----
const CUES = {
  sea: 0.0,          // "So"            the coast and the sea return (the stage; under the compositor's fade-in)
  islands: 0.66,     // "read"          the four islands draw back on, A first, one every 0.08 s (land, bank, vault, ledger, palm; ~1 s each)
  fifth: 3.52,       // "coin"          a fifth, smaller island sketches in the middle of the four (0.6 s, one pen stroke)
  coin: 3.90,        // "trying"        a token coin drops onto it (0.35 s pop, lands from 40 px up)
  strike: 5.14,      // "blockchain."   an orange X strikes the fifth island and its coin out (0.45 s)
  ghost: 6.30,       // "layer"         the rejected idea ghosts: island, coin and X fade to 45 percent (0.5 s)
  band: 6.30,        // "layer"         the orange band draws in the sky over all four islands (0.7 s)
  quant: 6.44,       // "the"           "Quant" types onto the band (the layer is Quant; he named it at 2.74)
  doors: 7.74,       // "into"          every bank's entrance darkens and its door swings open, A first, one every 0.1 s (0.45 s each; the last done 8.49, as he says "building")
  poleUK: 9.22,      // "live"          a flag pole rises on island A's shore, EMPTY (pole, finial; 0.25 s)
  ukCloth: 9.74,     // "UK,"           its cloth flies (0.25 s) and "UK" is written on it
  ukCheck: 10.10,    // "UK," (held)    a green check badge pops beside the cloth (he pauses 0.9 s before "with")
  poleUS: 11.02,     // "date"          a flag pole rises on island B's shore, EMPTY
  usCloth: 11.58,    // "US."           its cloth flies and "US" is written on it
  h1: 11.86,         // "US." (held)    "H1" is written beside the cloth (the H typed, the 1 drawn)
  y2027: 12.02,      // "US." (held)    "2027" after it (complete 12.3; the drawing then HOLDS through both conditional sentences, 12.12 to 19.36)
  reink: 20.50,      // "one"           the four land outlines re-ink UNDER their furniture, A first, one every 0.3 s (0.6 s each; the last done 22.0, as he says "island,")
  docs: 23.40,       // "quant"         two contract sheets pop onto the band: "GBTD" over the UK side (23.40), "TCH" over the US side (23.52; done 23.92)
  threads: 23.92,    // "holding"       four orange threads drop from the band's bottom edge to the four vault doors, one every 0.05 s (0.35 s each; the last done 24.42)
  locks: 24.42,      // "contracts"     a small padlock and a check badge pop at the top of every thread and slide down it (0.35 s; the last pair at rest 24.89, 0.56 s before the compositor's fade starts at 25.45; "connects them" 25.26 to 25.86 lands on the held payoff)
};

// ---- layout ----
const [IA, IB, IC, ID] = QUANT_ISLANDS;
const SPECS = [IA, IB, IC, ID];
const GEOMS = SPECS.map((s) => islandGeom(s));
const SEA_HORIZON = 300;
// wave ticks in open water (WB3's visual-qa'd set), clear of the islands, the fifth island, the flags and the threads
// ([300, 400] went to [370, 470]: the check badge sliding down A's thread comes to rest at (290, 406), on top of it;
// [1850, 700] and [1840, 330] went to [1800, 740] and [1800, 335]: a tick is 28 px wide and the clip plays deck-scaled
// under Mike's face, so every tick ends left of x 1854 (= 50 deck px from the deck area's right edge), visual-qa round 3)
const TICKS: [number, number][] = [
  [260, 900], [520, 985], [900, 1000], [1250, 960], [1560, 1000], [1800, 900], [1800, 740],
  [560, 1035], [1000, 1040], [1700, 1040], [75, 760], [370, 470], [1150, 380], [1400, 525], [1800, 335],
];
// the fifth island: WB3's spot, the centre of the four (land 723..1001 x 512..603, its ground line at 558; 55 px under
// island D's bottom; its right wave tick ends 44 px left of B's palm, its left tick 56 px right of A's ledger)
const FIFTH = { cx: 862, top: 512, scale: 0.48 };
const GF = islandGeom(FIFTH);
// the coin sitting on it: r 34, its bottom on the ground line, its top (489) 34 px under D's land bottom; "QNT" on its face
const COIN = { cx: FIFTH.cx, cy: GF.gy - 34, r: 34 };
// the X over the island and its coin: 165 x 112 about (892, 534), the coin's centre; the upper tips 23 px under D's land,
// the LOWER-LEFT tip (810, 590) measured against the UK flag, not A's ledger (visual-qa round 3: at (770, 618) it sat ON the
// UK cloth's fly corner, 668..778 x 606..654, and read as a rope tied to the flag): 32 px right of the cloth's fly edge,
// 16 px above its top, 24 px above the UK check badge (812, 630, r 16); the lower-right tip 95 px from B's palm fronds
const STRIKE = { x1: 810, y1: 478, x2: 975, y2: 590 };
const GHOST = 0.45;
// the band in the sky over all four islands (A's left 140, C's right 1845): 220..1700 x 142..228, 60 px above the coast's
// highest wobble (288); WB3's band lowered 25 px so the two contract sheets stand on its top edge inside the frame (top 52)
const BAND = { x: 220, y: 142, w: 1480, h: 86 };
const QUANT = { size: 58, y: BAND.y + 55 };                // Gochi Hand 700 at 58 px: cap top ~156, the Q's tail ends ~209, 19 px above the band's bottom line (228)
const QUANT_W = 0.5, QUANT_SP = 0.1;                       // Gochi Hand 700 ~0.50 em per glyph, letter-spaced 0.1 em (quant WB12)
const CAPW = 0.62;                                         // Kalam 700 CAPS ~0.62 em per glyph (quant WB7 "RTP" / "CHIPS")
// the two contract sheets standing on the band's top edge (bottom 2 px into its stroke), 84 x 92, over the UK side and the
// US side of the band; their labels 24 px Kalam caps, baseline 26 px over the sheet's foot
const SHEET = { w: 84, h: 92, bottom: BAND.y + 2, lbl: 24 };
const DOC_GBTD = { cx: 600 };
const DOC_TCH = { cx: 1340 };
// the flags: a pole on island A's front-right shore (WB1's coin spot) and one on island B's, 140 px tall, the cloth 110 x 48
// flying right from under the finial; the UK check badge 11 px off the cloth's rippling fly edge (785); "H1 2027" beside the
// US cloth at the same height, its last glyph ending ~1836 (the deck-scaled 50 px margin = x 1854)
const FLAG_W = 110, FLAG_H = 48, FLAG_LBL = 26;
const UK = { x: Math.round(GEOMS[0].shore[0]), gy: Math.round(GEOMS[0].shore[1]), top: 600 };     // (665, 740): cloth 668..778 x 606..654
const US = { x: Math.round(GEOMS[1].shore[0]), gy: Math.round(GEOMS[1].shore[1]), top: 620 };     // (1605, 760): cloth 1608..1718 x 626..674
const UKG = rectFlagGeom(UK.x, UK.top, FLAG_W, FLAG_H);
const USG = rectFlagGeom(US.x, US.top, FLAG_W, FLAG_H);
const UK_CHECK = { cx: UKG.x0 + FLAG_W + 34, cy: UKG.cy, r: 16 };
const DATE = { h: USG.x0 + FLAG_W + 20, one: USG.x0 + FLAG_W + 46, year: USG.x0 + FLAG_W + 62, y: USG.cy + 10, size: 28 };
// per island: the bank's base (the facade is BankFacade at 0.3 inside the island's scale: the door's canvas scale is
// 0.3 k), the vault door and where a thread lands on it (its rim's upper right, clear of the palm beside the door), the
// thread's start on the band's bottom edge above the vault (never inside the band's corner radius: A's vault is at x 244)
const perIsland = (i: number) => {
  const g = GEOMS[i], k = g.scale;
  const vr = 36 * k;
  const plugX = Math.max(g.vault[0], BAND.x + 48);
  return {
    k, plugX,
    bank: g.bank,
    vaultTop: [g.vault[0] + 0.5 * (vr + 2), g.vault[1] - 0.866 * (vr + 2)] as [number, number],
  };
};
const PER = [0, 1, 2, 3].map(perIsland);
// the threads leave the band's bottom edge above each vault and bow a little to the right on the way down (WB3's bows,
// 15 px lower with the band)
const THREAD_BOW: [number, number][] = [[46, 425], [25, 445], [42, 345], [12, 315]];
const THREAD_DUR = 0.35;
// what slides down each thread, drawn at the island's depth (the back islands' sliders at 0.5 with the stroke-compensated
// pen): on the FRONT threads the check badge comes to rest 42 percent of the way down and the padlock 72 percent; the BACK
// threads have only ~60 px of open water between the coast (y ~300) and the land, so there the check rests in the open
// SKY above the coast (y ~262: C at 15 percent, D at 20 percent of its thread) and the padlock in the water (y ~340, 74
// percent; D: its body ~335..345, ~19 px over the land's top edge at 364; C: ~374..384, ~23 px over the land's edge at 407),
// so the pair has the coastline between them and clear air (visual-qa round 3: at 62 / 80 percent they nearly touched)
const LOCK = { w: 26, h: 20 };
const CHECK = { r: 12 };
const REST: { check: number; lock: number }[] = [{ check: 0.42, lock: 0.72 }, { check: 0.42, lock: 0.72 }, { check: 0.15, lock: 0.74 }, { check: 0.2, lock: 0.74 }];
const SLIDE = 0.35;

export const QuantWB11: React.FC<{ penId?: string }> = ({ penId = 'paper-quant' }) => {
  const PEN = PENS[penId] ?? PENS['paper-quant'];
  const FH = FONTS[PEN.fontH], FL = FONTS[PEN.fontL];
  const C = (s: string) => (PEN.caps ? s.toUpperCase() : s);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = frame / fps;                 // local seconds
  const at = (cue: number) => T - cue;   // time since a cue (negative = not yet)
  const ORANGE = PEN.palette.red;
  const INK = PEN.ink;

  const ghost = 1 - (1 - GHOST) * easeOut(prog(at(CUES.ghost), 0, 0.5));
  const slide = easeOut(prog(at(CUES.locks), 0, SLIDE));

  // the re-ink (scene 4) is the Island's own `reinkT`: the heavier outline is painted between the land's fill and the palm /
  // vault / bank / ledger, never over them; island C drops its right shore tick (it ended 44 px from the frame edge)
  const island = (i: number) => {
    const spec = SPECS[i], tI = at(CUES.islands + i * 0.08);
    return <Island key={i} {...spec} t={tI} bankT={tI - 0.1} vaultT={tI - 0.3} ledgerT={tI - 0.2} pen={PEN} seed={10 + i} reinkT={at(CUES.reink + i * 0.3)} reinkWidth={PEN.inkWidth + 2.4} wavesR={i !== 2} />;
  };
  const threadPts = (i: number) => {
    const p = PER[i];
    const p0: [number, number] = [p.plugX, BAND.y + BAND.h];
    const p1: [number, number] = [p.plugX + THREAD_BOW[i][0], THREAD_BOW[i][1]];
    return { p0, p1, p2: p.vaultTop };
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
          {/* ===== scene 1: my read: the sea and the four islands return (back islands first: depth) ===== */}
          <Sea horizon={SEA_HORIZON} ticks={TICKS} t={at(CUES.sea)} pen={PEN} seed={1} />
          {[3, 2].map((i) => island(i))}

          {/* ===== scene 2: not a coin trying to become the banks' new blockchain (a fifth island with a coin on it, struck out) ===== */}
          <g opacity={ghost}>
            <Island {...FIFTH} t={at(CUES.fifth)} palm={false} sequential pen={PEN} seed={15} />
            <TokenCoin cx={COIN.cx} cy={COIN.cy} r={COIN.r} t={at(CUES.coin)} pen={PEN} seed={16} mark="QNT" font={FL} drop={40} />
            <CrossOut x1={STRIKE.x1} y1={STRIKE.y1} x2={STRIKE.x2} y2={STRIKE.y2} t={at(CUES.strike)} pen={PEN} seed={40} color={ORANGE} strokeWidth={PEN.inkWidth + 4.5} />
          </g>
          {[0, 1].map((i) => island(i))}

          {/* ===== scene 3: a layer the banks are letting into the building (the band; a door opens on every bank), live in the UK, a date in the US ===== */}
          {PER.map((p, i) => <DoorOpen key={i} cx={p.bank[0]} gy={p.bank[1]} k={0.3 * p.k} t={at(CUES.doors + i * 0.1)} pen={PEN} seed={50 + i} />)}
          <LayerBand x={BAND.x} y={BAND.y} w={BAND.w} h={BAND.h} t={at(CUES.band)} pen={PEN} seed={5} shadow={0} />
          <Type x={BAND.x + BAND.w / 2} y={QUANT.y} text={C('Quant')} t={at(CUES.quant)} cps={14} size={QUANT.size} font={FH} color={PEN.colorH} weight="700" charW={QUANT_W} spacing={QUANT_SP} />
          <RectFlag x={UK.x} gy={UK.gy} top={UK.top} w={FLAG_W} h={FLAG_H} color={PEN.palette.gold} t={at(CUES.poleUK)} clothT={at(CUES.ukCloth)} pen={PEN} seed={2} dur={0.5}>
            <Type x={UKG.cx} y={UKG.cy + 9} text={C('UK')} t={at(CUES.ukCloth) - 0.22} cps={14} size={FLAG_LBL} font={FL} color={INK} weight="700" charW={CAPW} />
          </RectFlag>
          <CheckBadge cx={UK_CHECK.cx} cy={UK_CHECK.cy} r={UK_CHECK.r} t={at(CUES.ukCheck)} pen={PEN} seed={3} sequential />
          <RectFlag x={US.x} gy={US.gy} top={US.top} w={FLAG_W} h={FLAG_H} color={PEN.palette.gold} t={at(CUES.poleUS)} clothT={at(CUES.usCloth)} pen={PEN} seed={4} dur={0.5}>
            <Type x={USG.cx} y={USG.cy + 9} text={C('US')} t={at(CUES.usCloth) - 0.22} cps={14} size={FLAG_LBL} font={FL} color={INK} weight="700" charW={CAPW} />
          </RectFlag>
          {/* "H" typed, the 1 DRAWN (Kalam's 1 is a bare stroke: "H1" read "HI" on quant WB7), "2027" typed after it */}
          <Type x={DATE.h} y={DATE.y} text={C('H')} t={at(CUES.h1)} cps={16} size={DATE.size} font={FL} color={INK} weight="700" anchor="start" />
          <InkOne x={DATE.one} baseline={DATE.y} size={DATE.size} t={at(CUES.h1) - 0.08} pen={PEN} seed={31} />
          <Type x={DATE.year} y={DATE.y} text={C('2027')} t={at(CUES.y2027)} cps={16} size={DATE.size} font={FL} color={INK} weight="700" anchor="start" />

          {/* ===== scene 4 (under the screen share): every bank is an island; Quant holds the contracts that connect them ===== */}
          {/* the re-ink (the pen's width + 2.4; at + 1.6 it was barely a change) is drawn by each Island above, under its furniture */}
          <ContractSheet cx={DOC_GBTD.cx} bottom={SHEET.bottom} w={SHEET.w} h={SHEET.h} t={at(CUES.docs)} pen={PEN} seed={60}>
            <Type x={DOC_GBTD.cx} y={SHEET.bottom - 26} text={C('GBTD')} t={at(CUES.docs) - 0.24} cps={20} size={SHEET.lbl} font={FL} color={INK} weight="700" charW={CAPW} />
          </ContractSheet>
          <ContractSheet cx={DOC_TCH.cx} bottom={SHEET.bottom} w={SHEET.w} h={SHEET.h} t={at(CUES.docs) - 0.12} pen={PEN} seed={61}>
            <Type x={DOC_TCH.cx} y={SHEET.bottom - 26} text={C('TCH')} t={at(CUES.docs) - 0.36} cps={20} size={SHEET.lbl} font={FL} color={INK} weight="700" charW={CAPW} />
          </ContractSheet>
          {PER.map((_, i) => {
            const q = threadPts(i);
            return <Thread key={i} p0={q.p0} p1={q.p1} p2={q.p2} t={at(CUES.threads + i * 0.05)} pen={PEN} seed={80 + i} dur={THREAD_DUR} />;
          })}
          {/* ===== payoff: the padlocks and the checks slide down the threads to the vaults ===== */}
          {PER.map((p, i) => {
            const q = threadPts(i), tl = at(CUES.locks + i * 0.04), k = p.k, rest = REST[i];
            if (tl <= 0) return null;
            const lp = bezier(q.p0, q.p1, q.p2, rest.lock * slide), cp = bezier(q.p0, q.p1, q.p2, rest.check * slide);
            const penS = scaledPen(PEN, k, 'slide');
            return (
              <g key={i}>
                <g transform={`translate(${cp[0]} ${cp[1]}) scale(${k}) translate(${-cp[0]} ${-cp[1]})`}>
                  <CheckBadge cx={cp[0]} cy={cp[1]} r={CHECK.r} t={tl} pen={penS} seed={100 + i} sequential />
                </g>
                <g transform={`translate(${lp[0]} ${lp[1]}) scale(${k}) translate(${-lp[0]} ${-lp[1]})`}>
                  <Padlock cx={lp[0]} cy={lp[1]} w={LOCK.w} h={LOCK.h} t={tl} pen={penS} seed={110 + i} dur={0.3} />
                </g>
              </g>
            );
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

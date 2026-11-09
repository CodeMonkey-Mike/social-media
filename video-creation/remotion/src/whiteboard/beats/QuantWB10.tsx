// whiteboard/beats/QuantWB10.tsx: whiteboard beat WB10 of the longform-edited video `quant`
// (brief: media/quant/assets/whiteboard/WB10.brief.md; cues: assets/whiteboard/WB10.cues.md).
// "What's next", in each source's own words (DATA.md Pillar 6): the shore seen along the page (the mainland above a
// coastline, the sea below) with two EMPTY flag poles on "what's next" and two EMPTY speech bubbles on "sources' own
// words". The UK half (left): on "UK" the left cloth flies, "UK" written on it; on "more" / "pilots" UK Finance's words
// are written in its bubble (the tail points at the flag) and three small boats draw in the water below and sail out to
// sea, "pilots" written in the water behind them; on "digital" a bond certificate draws, on "debt" its strip of coupon stubs tears down its right edge, on "bonds"
// its title "bond" is written; on "with" a strongbox vault draws beside it (a round door, a deposit slot in its lip); on
// "coupons" four digital-deposit tokens ("£", the kit's HexToken) pop off the stubs one by one and hop through the slot,
// "coupons" / "in tokenised deposits" written under the bond. The US half (right): on "US" the right cloth, "US"; on
// "building" the WB7 harbour gate draws HALF open (its right leaf closed) and on "network" a scaffold rises round it
// (standards, braces, a plank deck, a guard rail: being built now); on "Gilbert" a speaker draws at a lectern ("Verdean" =
// the lectern with the nameplate "Verdian", "said" = the microphone), his bubble's tail at his head; on "early" / "2027"
// his words are written in HIS bubble; on "His" / "words" the ONE orange mark of the beat, a "forecast" sticker, lands on
// that bubble's corner. Payoff: two flags, the bond with its coupons in the vault, the half-open gate under scaffolding,
// the attributed bubble with its orange "forecast" tag.
// Canvas = the full frame 1920 x 1080 @30, spine 494.560 to 518.420 s = 23.86 s = 716 frames, no audio; the comp build
// fades it in and out. Pen: paper-quant (the orange mark = the "forecast" sticker; every other word in the pen's ink).
// Everything is SVG through rough.js with fixed seeds (no boil, deterministic). Numbers on screen: "early 2027" only,
// INSIDE Verdian's bubble (DATA.md Pillar 6: Verdian on camera 2026-10, Innovate Finance panel, "going live also early next
// year", his forecast, attributed). Never on the US flag, never as TCH's fact (TCH's "H1 2027" is WB7's flag); no Sibos
// stage, no "whole US payment system", no coupon rate, no bond size. Names: "Verdian" (persona spelling; DATA.md T1).
// The storyboard is the CUES table below: LOCAL seconds (0 = spine 494.560), each hung on a spoken word of
// `spine/ALL.f.enhanced.medium-words.json`; a thing draws as he names it, never before.
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont as loadGochi } from '@remotion/google-fonts/GochiHand';
import { loadFont as loadKalam } from '@remotion/google-fonts/Kalam';
import { loadFont as loadRockSalt } from '@remotion/google-fonts/RockSalt';
import { loadFont as loadHandlee } from '@remotion/google-fonts/Handlee';
import { PENS } from '../pen';
import { Person, Type, bezier } from '../vocab';
import { prog } from '../Sketch';
import { Boat, Sea } from '../islands';
import { HarbourGate, RectFlag, rectFlagGeom } from '../harbour';
import { Callout } from '../career';
import { HexToken } from '../deposits';
import { StickerTag } from '../mortgage';
import { BondCertificate, Lectern, Scaffold, SlotVault, bondGeom, lecternGeom, slotVaultGeom } from '../outlook';

const { fontFamily: GOCHI } = loadGochi();
const { fontFamily: KALAM } = loadKalam('normal', { weights: ['400', '700'] });
const { fontFamily: ROCKSALT } = loadRockSalt();
const { fontFamily: HANDLEE } = loadHandlee();
const FONTS: Record<string, string> = { 'Gochi Hand': GOCHI, Kalam: KALAM, 'Rock Salt': ROCKSALT, Handlee: HANDLEE };

export const FPS = 30;
/** 23.86 s x 30 = 716 frames (spine 494.560 to 518.420) */
export const DUR = 716;
export const W = 1920;
export const H = 1080;

// ---- the storyboard: LOCAL seconds (spine seconds minus 494.560), the word each cue hangs on ----
const CUES = {
  stage: 0.38,     // "what's"       the shore: a coastline across the page at y 760, the sea tints below it, tufts on the land, wave ticks (0.8 s)
  poleUK: 0.78,    // "next?"        the left flag pole rises, EMPTY (pole, finial; 0.2 s)
  poleUS: 0.98,    // "next?" +0.2   the right flag pole, EMPTY
  bubUK: 2.10,     // "sources"      the left speech bubble draws EMPTY, its tail to the left pole (0.5 s)
  bubUS: 2.42,     // "own"          the right speech bubble draws EMPTY, its tail to where the speaker will stand
  ukCloth: 4.44,   // "UK,"          the left cloth flies (0.25 s), "UK" written on it
  more: 6.06,      // "more"         "more" is written in the UK bubble
  pilots: 6.36,    // "pilots"       "pilots" after it; three small boats draw in the water below (0.55 s each, 0.25 s apart) and sail out to sea (5 px/s); "pilots" is written in the water behind them (+0.4 s, once the first hull is in)
  bond: 8.84,      // "digital"      a bond certificate draws (sheet, border, lines, seal, signature; 1.0 s)
  stubs: 9.30,     // "debt"         its strip of four coupon stubs draws down its right edge (outline, perforations, their lines; 0.8 s)
  bondLbl: 10.76,  // "bonds,"       "bond" is written as the certificate's title
  vault: 11.60,    // "with"         the strongbox vault draws beside it: body, lip, slot, round door, feet (0.7 s)
  coins: 11.90,    // "coupons"      four "£" deposit tokens pop off the stubs, top down, one every 0.22 s (pop 0.35 s, hop 0.5 s) and go in through the slot; "coupons" written under the bond
  tokDep: 12.60,   // "tokenized"    "in tokenised deposits" written under it (UK spelling: UK Finance's receipt)
  usCloth: 14.30,  // "US,"          the right cloth flies, "US" written on it
  gate: 15.86,     // "building"     the WB7 harbour gate draws on the shore, HALF open: pillars, caps, lintel, the left leaf swung open, the right leaf closed (0.7 s)
  scaffold: 16.30, // "network"      a scaffold rises round it: standards, ledgers, X braces, the plank deck over the lintel, the guard rail (0.9 s; done 17.2, as he says "now")
  speaker: 17.54,  // "Gilbert"      a speaker draws at the right bubble's tail (1.2 s), his right hand out to the lectern
  lectern: 17.82,  // "Verdean"      the lectern draws under his hand (base, column, panel, top; 0.6 s), "Verdian" written on its panel
  mic: 18.24,      // "said"         the microphone on its gooseneck (0.4 s)
  early: 20.40,    // "early"        "early" is written in his bubble
  y2027: 20.70,    // "2027."        "2027" after it
  tag: 21.68,      // "His"          the ORANGE sticker pops on the bubble's top-right corner (0.3 s)
  forecast: 21.96, // "words,"       "forecast" is written on it (complete 22.36; held 1.2 s before the compositor's fade starts at 23.56 = frame 707)
};

// ---- layout ----
const SHORE = 760;                                                    // the coastline: the mainland above, the sea below
const FLAG_W = 110, FLAG_H = 48;
const UK = { x: 160, top: 470 };                                      // the left pole on the shore; cloth 163..273 x 476..524
const US = { x: 1760, top: 470 };                                     // the right pole; cloth 1763..1873 x 476..524 (47 px inside the right edge)
const UKG = rectFlagGeom(UK.x, UK.top, FLAG_W, FLAG_H);
const USG = rectFlagGeom(US.x, US.top, FLAG_W, FLAG_H);
// the two bubbles at one height (the "two empty bubbles" moment); each tail leaves its bottom edge toward its source
const BUB_UK = { x: 300, y: 250, w: 330, h: 120, tailBase: [330, 370] as [number, number], tip: [278, 468] as [number, number] };   // tip 5 px right of the pole, 8 px above the cloth's top edge
const BUB_US = { x: 1200, y: 250, w: 360, h: 120, tailBase: [1222, 1262] as [number, number], tip: [1176, 492] as [number, number] }; // tip 12 px right of the speaker's head (1096..1164), at eye height
// the three pilot boats (w 110, heading LEFT = out to sea, away from everything), nearest the shore first; each drifts 5 px/s from its cue
// the nearest boat's mast tops out at y - 128 = 780 (boatGeom), 12 px UNDER the coastline, which wobbles 759..768 across its drift (632..720);
// at y 870 the mast top (742) crossed the coastline (visual-qa round 1)
const BOATS: { x: number; y: number }[] = [{ x: 710, y: 908 }, { x: 520, y: 955 }, { x: 330, y: 1015 }];
const DRIFT = 5;
// the label on the boats (the brief's 'pilots'), written in the open water behind the fleet: left-aligned at 700, baseline 1010 (ink 700..798 x
// ~986..1020); the nearest boat's hull (654..762 -> 566..674, bottom 926) and its stern wave (796 -> 708, y 921) stay >= 60 px above it
const PILOTS_LBL = { x: 700, y: 1010, size: 34 };
// the bond: body 380..680 x 400..600 (200 tall: room for the seal under the three text lines), the coupon strip 680..728 (four stubs, 50 px each); its title centred at 530, baseline 454
const BOND = { x: 380, y: 400, w: 300, h: 200, stubW: 48 };
const BG = bondGeom(BOND.x, BOND.y, BOND.w, BOND.h, BOND.stubW, 4);
// the labels under the bond (left-aligned on its left edge), above the shore
const COUPONS = { x: 380, y: 658, size: 34 };
const TOKDEP = { x: 380, y: 700, size: 30 };
// the vault standing on the shore right of the bond: body 790..940 x 630..760, the slot at (865, 625)
const VAULT = { x: 790, w: 150, h: 130 };
const VG = slotVaultGeom(VAULT.x, SHORE, VAULT.w, VAULT.h);
const TOKEN_R = 16;
const HOP = 0.5, POP = 0.35, COIN_GAP = 0.22;
// the speaker (Person, 291 px tall) at the right bubble's tail; the lectern under his right hand (reach: the hand at x + 109, gy - 145 = 615)
const SPEAKER = { x: 1130 };
const LECTERN = { x: 1190, w: 110, h: 160 };                          // desk top 600..622, panel 622..656 ("Verdian"), column 1215..1275, base 1180..1310
const LG = lecternGeom(LECTERN.x, SHORE, LECTERN.w, LECTERN.h);
// the harbour gate on the shore (WB7's gate, the same size): pillars 1438..1478 / 1562..1602 x 620..760, lintel 1426..1614 x 596..620
const GATE = { cx: 1520 };                                            // harbourGateGeom(1520, 760): lx 1438, rx 1562, top 620, lintel 1426..1614 x 596..620
// the scaffold round it: outer standards 1366 / 1674, inner 1418 / 1622 (8 px outside the lintel's ends), a ledger at 670, the deck at 580 (16 px above the lintel), the rail 36 above the deck
const SCAF = { bays: [{ x0: 1366, x1: 1418 }, { x0: 1674, x1: 1622 }], deckY: 580, lifts: [670], span: [1366, 1674] as [number, number] };
// the orange sticker on the right bubble's top-right corner (rotated 6 degrees), "forecast" in the pen's light (the nameplate on the brown panel is in the INK: white on the pale brown was ~1.9:1 on the round-1 still)
// (x 1480, y 224: rotated, its lower-left corner lands at (1483, 276), 15 px above the "7" of "2027" (ink to ~1485, top ~291) once the words
// are centred in the bubble (round 4: the digits ink ~100 px, so the 7 ends under the corner, cleared vertically); at (1470, 236) the corner
// would sit 3 px off the digit)
const TAG = { x: 1480, y: 224, w: 150, h: 44, rot: -6 };
const LBLW = 0.46;                                                    // Kalam 700 ~0.46 em per glyph (quant WB12 stills)
const CAPW = 0.62;                                                    // Kalam 700 CAPS (quant WB7 "RTP" / "CHIPS")
// wave ticks in open water, clear of the boats' paths (the boats drift left from 710 / 520 / 330)
const SEA_AVOID: [number, number][] = [[700, 760], [1340, 1700]];
const TICKS: [number, number][] = [[1150, 830], [1500, 905], [1800, 1000], [1300, 1045], [1720, 810], [1000, 1035], [90, 880], [1080, 940]];

export const QuantWB10: React.FC<{ penId?: string }> = ({ penId = 'paper-quant' }) => {
  const PEN = PENS[penId] ?? PENS['paper-quant'];
  const FL = FONTS[PEN.fontL];
  const C = (s: string) => (PEN.caps ? s.toUpperCase() : s);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = frame / fps;                 // local seconds
  const at = (cue: number) => T - cue;   // time since a cue (negative = not yet)
  const ORANGE = PEN.palette.red;
  const INK = PEN.colorL;

  // a coupon token's flight: pops on its stub, then a parabolic hop (quadratic bezier, linear u) into the slot, then
  // straight down inside the vault (hidden by the lip and the body, painted after it)
  const coinAt = (i: number): [number, number] | null => {
    const t = at(CUES.coins + i * COIN_GAP);
    if (t <= 0) return null;
    const st = BG.stubs[i], p0: [number, number] = [st.cx, st.cy], p2: [number, number] = [VG.slot[0], VG.slot[1] + 2];
    const p1: [number, number] = [(p0[0] + p2[0]) / 2 + 10, Math.min(p0[1], p2[1]) - 80];
    const u = prog(t, POP, HOP);
    if (u < 1) return bezier(p0, p1, p2, u);
    const down = prog(t, POP + HOP, 0.25);
    return down >= 1 ? null : [p2[0], p2[1] + 60 * down];
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
          {/* ===== scene 1: the horizon, two empty poles, two empty bubbles ===== */}
          {/* seed 9: its tufts fall at x 185 (25 px right of the UK pole), 734 and 1379; the last two are dropped (`avoid`): one under the nearest boat's mast, one inside the scaffold's left bay */}
          <Sea horizon={SHORE} ticks={TICKS} t={at(CUES.stage)} pen={PEN} seed={9} avoid={SEA_AVOID} />
          <RectFlag x={UK.x} gy={SHORE} top={UK.top} w={FLAG_W} h={FLAG_H} color={PEN.palette.gold} t={at(CUES.poleUK)} clothT={at(CUES.ukCloth)} pen={PEN} seed={2}>
            <Type x={UKG.cx} y={UKG.cy + 9} text={C('UK')} t={at(CUES.ukCloth) - 0.22} cps={14} size={26} font={FL} color={PEN.ink} weight="700" charW={CAPW} />
          </RectFlag>
          <RectFlag x={US.x} gy={SHORE} top={US.top} w={FLAG_W} h={FLAG_H} color={PEN.palette.gold} t={at(CUES.poleUS)} clothT={at(CUES.usCloth)} pen={PEN} seed={3}>
            <Type x={USG.cx} y={USG.cy + 9} text={C('US')} t={at(CUES.usCloth) - 0.22} cps={14} size={26} font={FL} color={PEN.ink} weight="700" charW={CAPW} />
          </RectFlag>
          <Callout x={BUB_UK.x} y={BUB_UK.y} w={BUB_UK.w} h={BUB_UK.h} tailBase={BUB_UK.tailBase} tip={BUB_UK.tip} t={at(CUES.bubUK)} pen={PEN} seed={4}>
            {/* UK Finance's words, two Type elements on his two words. Measured on the round-1 still: "more" inks 83 px wide, "pilots" 98 px, the block
                runs 32 px above the baseline (the l / t) to 9 px below (the p); so a 16 px word gap (the "early 2027" gap) = 197 px, centred on the
                bubble (465) -> ink 367..562, and the block centred on the bubble's middle (310) -> baseline 322 (at 345 it sat 23 px low) */}
            <Type x={365} y={BUB_UK.y + 72} text={C('more')} t={at(CUES.more)} cps={16} size={40} font={FL} color={INK} weight="700" anchor="start" charW={LBLW} />
            <Type x={466} y={BUB_UK.y + 72} text={C('pilots')} t={at(CUES.pilots)} cps={18} size={40} font={FL} color={INK} weight="700" anchor="start" charW={LBLW} />
          </Callout>
          <Callout x={BUB_US.x} y={BUB_US.y} w={BUB_US.w} h={BUB_US.h} tailBase={BUB_US.tailBase} tip={BUB_US.tip} t={at(CUES.bubUS)} pen={PEN} seed={5}>
            {/* Verdian's words: "early" then "2027" (digits tracked 0.04 em). Measured on the round-3 still (visual-qa, round 4): "early" inks 91 px
                (x 1288..1379 at x 1287), "2027" inks ~100 px (1397..1497, NOT the 74 px the charW estimate gave), the block 35 px above the baseline
                to 10 px below; so the 209 px block sat 12 px right of the bubble's centre (1380): 88 px of air left, 63 right. Both words moved 12 px
                left -> ink ~1276..1485 (centre 1380.5), 76 / 75 px of air; the block centred on 310 -> baseline 323 (at 346 it sat 23 px low);
                the sticker's corner (1483, 276) still clears the "7"'s top bar (y ~291) by 15 px (TAG) */}
            <Type x={1275} y={BUB_US.y + 73} text={C('early')} t={at(CUES.early)} cps={16} size={44} font={FL} color={INK} weight="700" anchor="start" charW={LBLW} />
            <Type x={1385} y={BUB_US.y + 73} text={C('2027')} t={at(CUES.y2027)} cps={14} size={44} font={FL} color={INK} weight="700" anchor="start" charW={0.5} spacing={0.04} />
          </Callout>

          {/* ===== scene 2 (UK): the pilots sail out; the bond, its coupons paid in tokenised deposits ===== */}
          {BOATS.map((b, i) => {
            const t = at(CUES.pilots + i * 0.25);
            if (t <= 0) return null;
            const x = b.x - DRIFT * t;
            return (
              <g key={i} transform={`translate(${x} 0) scale(-1 1) translate(${-x} 0)`}>
                <Boat x={x} y={b.y} w={110} t={t} pen={PEN} seed={10 + i} />
              </g>
            );
          })}
          {/* the brief's label on the boats, written in the water behind the fleet once the first hull is in */}
          <Type x={PILOTS_LBL.x} y={PILOTS_LBL.y} text={C('pilots')} t={at(CUES.pilots) - 0.4} cps={18} size={PILOTS_LBL.size} font={FL} color={INK} weight="700" anchor="start" charW={LBLW} />
          <BondCertificate x={BOND.x} y={BOND.y} w={BOND.w} h={BOND.h} stubW={BOND.stubW} stubs={4} t={at(CUES.bond)} stripT={at(CUES.stubs)} pen={PEN} seed={6}>
            <Type x={BG.cx} y={BG.titleY} text={C('bond')} t={at(CUES.bondLbl)} cps={16} size={34} font={FL} color={INK} weight="700" charW={LBLW} />
          </BondCertificate>
          <Type x={COUPONS.x} y={COUPONS.y} text={C('coupons')} t={at(CUES.coins)} cps={20} size={COUPONS.size} font={FL} color={INK} weight="700" anchor="start" charW={LBLW} />
          <Type x={TOKDEP.x} y={TOKDEP.y} text={C('in tokenised deposits')} t={at(CUES.tokDep)} cps={24} size={TOKDEP.size} font={FL} color={INK} weight="700" anchor="start" charW={LBLW} />
          {/* the tokens are painted BEFORE the vault so its lip and body hide each one once it is through the slot */}
          {BG.stubs.map((_, i) => {
            const p = coinAt(i);
            if (!p) return null;
            return <HexToken key={i} cx={p[0]} cy={p[1]} r={TOKEN_R} t={at(CUES.coins + i * COIN_GAP)} pen={PEN} seed={20 + i} font={FL} mark="£" dur={POP} />;
          })}
          <SlotVault x={VAULT.x} gy={SHORE} w={VAULT.w} h={VAULT.h} t={at(CUES.vault)} pen={PEN} seed={7} />

          {/* ===== scene 3 (US): the gate being built, the speaker at the lectern, his forecast ===== */}
          <Person x={SPEAKER.x} gy={SHORE} t={at(CUES.speaker)} pen={PEN} seed={8} hair="cap" shirt={PEN.palette.blue} tie reach shadow="feet" />
          <Lectern x={LECTERN.x} gy={SHORE} w={LECTERN.w} h={LECTERN.h} t={at(CUES.lectern)} micT={at(CUES.mic)} pen={PEN} seed={9}>
            <Type x={LG.cx} y={LG.nameY} text={C('Verdian')} t={at(CUES.lectern) - 0.3} cps={16} size={24} font={FL} color={PEN.ink} weight="700" charW={LBLW} />
          </Lectern>
          <HarbourGate cx={GATE.cx} gy={SHORE} t={at(CUES.gate)} pen={PEN} seed={30} leaves="half" />
          <Scaffold bays={SCAF.bays} gy={SHORE} deckY={SCAF.deckY} lifts={SCAF.lifts} span={SCAF.span} t={at(CUES.scaffold)} pen={PEN} seed={31} />

          {/* ===== payoff: the ONE orange mark, "forecast" stuck on his bubble ===== */}
          <g transform={`rotate(${TAG.rot} ${TAG.x + TAG.w / 2} ${TAG.y + TAG.h / 2})`}>
            <StickerTag x={TAG.x} y={TAG.y} w={TAG.w} h={TAG.h} t={at(CUES.tag)} pen={PEN} seed={32} color={ORANGE}>
              <Type x={TAG.x + TAG.w / 2} y={TAG.y + 32} text={C('forecast')} t={at(CUES.forecast)} cps={20} size={26} font={FL} color={PEN.light} weight="700" charW={LBLW} />
            </StickerTag>
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

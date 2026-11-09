// whiteboard/beats/QuantWB2.tsx: whiteboard beat WB2 of the longform-edited video `quant`
// (brief: media/quant/assets/whiteboard/WB2.brief.md; cues: assets/whiteboard/WB2.cues.md).
// "The banks are turning those deposits digital": the same four islands as WB1 draw back on (bank, vault, ledger,
// palm). On "deposits" a paper deposit slip is laid on island A's open ledger (its ruled lines knock out under it); on
// "digital" the paper fades and a hexagonal token glyph pops in its place ON THE BOOK; "tokenized deposit" types in the
// water above the ledger; the glyph carries its "$" from the moment it pops (the slip's "$" carries straight over). On
// "protections" a shield with a check draws in front of the ledger's pedestal (its foot hidden), on "regulator" a small seal
// badge beside it on the land, on "recorded" the glyph's inner ring draws (recorded differently). On "rules" an orange tag
// hangs off the glyph on a visible string: from the hexagon's right edge, over the book's right page and out into the open
// water between islands A and B, to a card big enough to read (30 px lines); its two lines type on "move" and "release". On
// "move inside the bank" a looping arrow draws ON THE LAND:
// a ground-plane ellipse round the bank and the ledger, its back arc behind the bank's steps, the shield and the pedestal,
// its front arc across the lawn under the tag, the head landing in the open lawn at the front left. On "walled" a white
// picket fence rings island A and "walled garden" types under it in orange; on "Same (islands, brand new fences)" fences ring
// the other three islands. Payoff: four fenced islands, everything inside, held ~1.5 s before the compositor's fade.
// Round 4 (2026-11-05, after visual-qa on round 3): the ring around the token (a halo over the water) is replaced by the
// ground loop; the shield centred on the pedestal and lowered so its feet are hidden; the seal beside it on the right lawn;
// the tag on the lawn inside the loop, hung on a bent string (`StringTag via`) so the string never crosses the loop; the
// label moved into the water above the ledger; the back pickets behind every bank's roof skipped (`FenceRing skipX`); the
// rails lifted 2 px off the shoreline (`railFrac`); the three far fences hung on "Same" so the payoff holds ~1.5 s.
// Round 5 (2026-11-05, after visual-qa on round 4): the tag leaves the lawn (16 px lines were unreadable at viewing size, and
// its string, hidden behind the shield, read as hanging from the shield) for the open water between islands A and B, 262 x 96
// with 30 px lines, hung on a straight visible string from the token's right edge with nothing over it; the "$" pops with the
// hexagon on "digital" (the glyph stood blank for 2.4 s and read as a stop sign), the separate "deposit" mark cue is dropped.
// Round 6 (2026-11-05, after visual-qa on round 5: STALE CLOCK, nothing wrong with the art): the comp was still on the old window
// (local 0 = spine 70.520, 752 frames) after COVER-PLAN moved WB2's tIn to 71.300 with WB1's extension; every cue is now 0.78 s
// earlier, DUR = 728. The sea (was 0.0) and the islands (was 0.36 "banks") fell before 0, so they are re-hung: the sea at the
// beat's in (0.0) and the islands on "turning" (0.08), with the stage's local time run at 2.5x (`FAST`) so the islands RETURN
// quickly (they are WB1's finished drawings, which the compositor is cross-fading out at this very moment): island A's land
// is done at 0.32, its ledger at 0.44, its bank at 0.48, island D at 0.72, all before the slip is laid on "deposits" (0.56).
// Canvas = the full frame 1920 x 1080 @30, spine 71.300 to 95.580 s = 24.28 s = 728 frames, no audio; the comp build
// fades it in and out. Pen: paper-quant (the orange accent = the tag's card and the "walled garden" label, both named
// orange by the brief; everything else the pen unchanged). Everything is SVG through rough.js with fixed seeds (no
// boil, deterministic). No numbers on screen, no bank names, no amounts, no interest rate (the brief); four islands
// exactly, from `QUANT_ISLANDS` (islands.tsx) with WB1's seeds so they are the same drawings.
// The storyboard is the CUES table below: LOCAL seconds (0 = spine 71.300), each hung on a spoken word of
// `spine/ALL.f.enhanced.medium-words.json`; a thing draws as he names it, never before.
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont as loadGochi } from '@remotion/google-fonts/GochiHand';
import { loadFont as loadKalam } from '@remotion/google-fonts/Kalam';
import { loadFont as loadRockSalt } from '@remotion/google-fonts/RockSalt';
import { loadFont as loadHandlee } from '@remotion/google-fonts/Handlee';
import { PENS } from '../pen';
import { Type } from '../vocab';
import { prog } from '../Sketch';
import { LoopArc } from '../welfare';
import { Island, QUANT_ISLANDS, Sea, islandGeom } from '../islands';
import { DepositSlip, FenceRing, HexToken, SealBadge, ShieldCheck, StringTag } from '../deposits';

const { fontFamily: GOCHI } = loadGochi();
const { fontFamily: KALAM } = loadKalam('normal', { weights: ['400', '700'] });
const { fontFamily: ROCKSALT } = loadRockSalt();
const { fontFamily: HANDLEE } = loadHandlee();
const FONTS: Record<string, string> = { 'Gochi Hand': GOCHI, Kalam: KALAM, 'Rock Salt': ROCKSALT, Handlee: HANDLEE };

export const FPS = 30;
/** 24.28 s x 30 = 728 frames (spine 71.300 to 95.580; round((95.580 - 71.300) * 30) = 728) */
export const DUR = 728;
export const W = 1920;
export const H = 1080;

// ---- the storyboard: LOCAL seconds (spine seconds minus 71.300), the word each cue hangs on ----
const CUES = {
  sea: 0.0,        // (the beat's in; "are" 71.12 to 71.38 is under way) the coast and the sea return at 2.5x (coast 0.32 s, ticks to ~0.6), under the compositor's 11-frame fade-in
  islands: 0.08,   // "turning"      the four islands draw back on at 2.5x, A first, one every 0.08 s (land 0.24 s, bank 0.36, vault 0.28, ledger 0.28, palm); A complete at 0.48, D at 0.72
  slip: 0.56,      // "deposits"     a paper deposit slip is laid on island A's open ledger (0.3 s); the book's ruled lines knock out under it
  digital: 1.02,   // "digital"      the paper fades (0.35 s) and the hexagonal token glyph, "$" and all, pops in its place on the book (0.35 s)
  label: 2.04,     // "tokenized"    "tokenized deposit" types in the water above the ledger (ink; done 2.81 on "deposit")
  shield: 5.62,    // "protections"  a shield with a check draws in front of the ledger's pedestal, hiding its foot (0.6 s)
  seal: 6.68,      // "regulator"    a small seal badge with a check draws beside it on the right lawn (0.6 s)
  record: 8.16,    // "recorded"     the glyph's inner hexagon ring draws (0.3 s): recorded differently
  tag: 10.14,      // "rules"        an orange tag: a visible string from the glyph's right edge out over the water to the card between islands A and B (0.5 s)
  rule1: 11.26,    // "move"         line 1 "move when..." types in the tag (30 px; done 11.81)
  rule2: 12.64,    // "release"      line 2 "release when..." types (done 13.32)
  loop: 16.52,     // "move"         (only move inside the bank) the looping arrow draws on the land round the bank and the ledger (0.9 s; the head lands 17.15 to 17.42, on "bank" 17.32)
  fenceA: 20.78,   // "walled"       a white picket fence rings island A (0.8 s: the back half, then the front)
  garden: 20.98,   // "gardens"      "walled garden" types under island A in orange (done 21.63)
  fences: 21.84,   // "Same"         (Same islands, brand new fences) fences ring islands B, C, D, one every 0.1 s (0.45 s each): the clause's first word; the last lands 22.49 (f675), the fade starts 23.98 (f719), so the payoff holds 1.49 s
};
/** the stage's time scale for the RETURNING sea and islands (WB1's finished drawings, re-drawn quickly as the beat opens; see the round-6 note) */
const FAST = 2.5;

// ---- layout ----
const [IA, IB, IC, ID] = QUANT_ISLANDS;
const SPECS = [IA, IB, IC, ID];
const GEOMS = SPECS.map((s) => islandGeom(s));
const GA = GEOMS[0];
const SEA_HORIZON = 300;
// wave ticks in open water, clear of the fence rings, the ledgers, the tag and the labels
// (visual-qa round 2: [1480,555] sat 3 px off island B's book -> [1400,525]; [1870,330] reached x 1898 -> [1840,330])
const TICKS: [number, number][] = [
  [260, 900], [520, 985], [900, 1000], [1250, 960], [1560, 1000], [1800, 900], [1850, 700], [1250, 540],
  [560, 1035], [1000, 1040], [1700, 1040], [75, 760], [300, 400], [1150, 380], [1400, 525], [1840, 330],
];
// island A's ledger (bank.tsx Ledger at the island's scale 1): base (581, 695), the book centred 118 above it, pages
// y 537 to 615 (x 536 to 626), the pedestal x 565 to 597 from y 613 down to the ground; the bank's steps x 300 to 503, y 678 to 695
const BOOK = { cx: GA.ledger[0], cy: GA.ledger[1] - 118 };
const GY = GA.ledger[1];                                                    // the ground line things stand on (695)
const HEAD = { x: BOOK.cx, y: 498 };                                        // "tokenized deposit" in the water above the ledger (ink rows ~466 to 508; island D's lowest ink is 458 at x 865 to 925, the book's top 537)
const SLIP = { cx: BOOK.cx, cy: BOOK.cy, w: 66, h: 84 };                    // the paper laid on the open book: 548 to 614, 535 to 619
const TOKEN = { cx: BOOK.cx, cy: BOOK.cy, r: 36 };                          // the hexagon on the book: 550 to 612 wide, 541 to 613 tall
const SHIELD = { cx: BOOK.cx, cy: GY - 13, w: 50, h: 56 };                  // centred on the pedestal, rows 654 to 710 (visual-qa round 3's fix): its lower curves pass ~6 px under the post's feet (565 / 597, 695), so no feet stick out
const SEAL = { cx: 641, cy: 668, r: 14 };                                   // on the right lawn beside the shield (scallops to r 25: x 616 to 666, y 643 to 693): 10 px off the shield, 14 px under the land's top edge there (629), the back rails 25 px above
// the tag in the OPEN WATER between islands A and B (visual-qa round 4: on the lawn its 16 px lines were unreadable and the string,
// hidden behind the shield, read as hanging from the shield). The water there is empty: island A's fence ring ends at x 722
// (its back pickets' tips ~638 at x 704), A's own wave tick is at (755, 695), "tokenized deposit" inks x 418 to 743 / rows 464
// to 508, island D's front fence stands on y <= 455, island B's palm fronds reach x ~1076 at y ~600 and its fence ring starts at
// x 1078. The card is 262 x 96 (x 776 to 1038, y 546 to 642): 'release when...' at Kalam 700 30 px inks ~200 px (107 px at
// 16 px, measured in round 4), starting 40 px in (right of the punched hole at x + 18) and ending ~22 px short of the right edge.
const TAG = { x: 776, top: 546, w: 262, h: 96 };
// the string hangs off the hexagon's RIGHT edge (its midpoint, (612, 577), + the bold rim) and runs straight to the card's
// top-left hole (794, 564) over the book's right page and the water, with nothing painted over it; the token is painted after
// the tag, so the string's root tucks under the rim and reads as tied to the glyph
const TAG_FROM: [number, number] = [TOKEN.cx + TOKEN.r * Math.cos(Math.PI / 6) + 1, TOKEN.cy];
// two 30 px lines: Kalam 700 inks ~0.8 em above its baseline (~24 px) and the words have no descenders; baselines 38 and 78 px
// under the card's top leave 14 px over line 1, 16 px between the lines' ink and 18 px under line 2
const RULE = { size: 30, x: TAG.x + 40, y1: TAG.top + 38, y2: TAG.top + 78 };
// the loop ON THE LAND round the bank and the ledger: a ground-plane ellipse painted between the land and its buildings
// (`Island between`). Its back arc (top 680) is hidden by the bank's steps (678 to 695, x 300 to 503), shows between the bank
// and the shield (x 497 to 556, rows 681 to 688), hides behind the shield (556 to 606) and shows again to the right end
// (620, 719); its front arc crosses the lawn at 757 (centre), 9+ rows above the picket tips (768 at x 430, 763 at 516, 757 at
// 559, 749 at 602 with 24 px pickets; measured on the round-4 stills) and ~9 rows under the tag's bottom edge. Its back arc's top
// (681) sits under the upper step's fill (679 to 686), so nothing peeks between the columns. Centred 10 px left of the
// bank + ledger's middle so its front-right quadrant drops away from the right-hand pickets. Drawn clockwise from the left
// (185 deg) so the head lands at 150 deg (275, 737) in the open front-left lawn, 17 px from the nearest picket (258, tip 747).
const LOOP = { cx: 435, cy: 719, rx: 185, ry: 38, a0: 185, a1: 510 };
const GARDEN = { x: IA.cx, y: 880 };                                        // under island A, clear of its fence (pickets stand on the shore, base ~792)
const LBL = 42;
const LBLW = 0.46;                                                          // Kalam 700 measured ~0.46 em per glyph (quant WB12 stills)
const POST = 24;                                                            // picket height at scale 1 (28 in round 3): the front tips at the lawn's centre 768, 9+ rows under the loop's front arc
const RAILS: [number, number] = [0.5, 0.8];                                 // the rails at 12 / 19 px above the ring (10 / 20 in round 3): 14 px off the land's outline where visual-qa saw them merge; the picket heads 5 px above the upper rail

/** the fence ring of an island: the land's own ellipse (+2 px), so the pickets stand on the shoreline with the rails over the
 * land (round 1 stood it 12 px out in the water and the land's edge ran between the two rails); the island's wave ticks stay
 * ~25 px outside it */
const ring = (i: number) => {
  const g = GEOMS[i], k = g.scale;
  return { cx: g.land.cx, cy: g.land.cy, rx: g.land.rx + 2 * k, ry: g.land.ry + 2 * k, scale: k };
};
/** the x span of an island's bank (BankFacade 680 wide at 0.3 x the island's scale, + 6 px): no back picket stands behind its roof */
const roofSpan = (i: number): [number, number] => {
  const g = GEOMS[i], hw = 102 * g.scale + 6;
  return [g.bank[0] - hw, g.bank[0] + hw];
};
/** when island i's fence starts (A on "walled", the rest on "Same"), and how long it takes */
const fenceCue = (i: number) => (i === 0 ? { at: CUES.fenceA, dur: 0.8 } : { at: CUES.fences + (i - 1) * 0.1, dur: 0.45 });

export const QuantWB2: React.FC<{ penId?: string }> = ({ penId = 'paper-quant' }) => {
  const PEN = PENS[penId] ?? PENS['paper-quant'];
  const FL = FONTS[PEN.fontL];
  const C = (s: string) => (PEN.caps ? s.toUpperCase() : s);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = frame / fps;                 // local seconds
  const at = (cue: number) => T - cue;   // time since a cue (negative = not yet)
  const INK = PEN.colorL;

  const slipFade = 1 - prog(at(CUES.digital), 0, 0.35);   // the paper fades as the token pops
  const linesA = 1 - prog(at(CUES.slip), 0, 0.15);        // island A's ledger lines knock out as the slip is laid on the book

  const island = (i: number) => {
    const spec = SPECS[i], r = ring(i), f = fenceCue(i), tI = at(CUES.islands + i * 0.08) * FAST;
    return (
      <g key={i}>
        <FenceRing {...r} half="back" t={at(f.at)} dur={f.dur} pen={PEN} seed={60 + i} post={POST} railFrac={RAILS} skipX={[roofSpan(i)]} />
        <Island
          {...spec} t={tI} bankT={tI - 0.1} vaultT={tI - 0.3} ledgerT={tI - 0.2} pen={PEN} seed={10 + i} ledgerLines={i === 0 ? linesA : 1}
          between={i === 0 ? (
            /* ===== scene 4: only move inside the bank: the loop on the land round the bank and the ledger (under the buildings) ===== */
            <LoopArc cx={LOOP.cx} cy={LOOP.cy} rx={LOOP.rx} ry={LOOP.ry} a0={LOOP.a0} a1={LOOP.a1} t={at(CUES.loop)} pen={PEN} seed={47} dur={0.9} head={16} strokeWidth={PEN.inkWidth + 1.2} roughness={0.45} sequential />
          ) : undefined}
        />
        {i === 0 && (
          <>
            {/* ===== scene 2: same protections (the shield in front of the pedestal), same regulator (the seal beside it) ===== */}
            <ShieldCheck cx={SHIELD.cx} cy={SHIELD.cy} w={SHIELD.w} h={SHIELD.h} t={at(CUES.shield)} pen={PEN} seed={42} />
            <SealBadge cx={SEAL.cx} cy={SEAL.cy} r={SEAL.r} checkK={0.6} t={at(CUES.seal)} pen={PEN} seed={43} />
          </>
        )}
        <FenceRing {...r} half="front" t={at(f.at)} dur={f.dur} pen={PEN} seed={60 + i} post={POST} railFrac={RAILS} />
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
          {/* ===== scene 1: the sea and the four islands return (back islands first: depth), each inside its fence ring once fenced ===== */}
          <Sea horizon={SEA_HORIZON} ticks={TICKS} t={at(CUES.sea) * FAST} pen={PEN} seed={1} />
          {[3, 2, 0, 1].map((i) => island(i))}

          {/* ===== scene 1b: the deposit turns digital on the bank's book ===== */}
          <DepositSlip cx={SLIP.cx} cy={SLIP.cy} w={SLIP.w} h={SLIP.h} t={at(CUES.slip)} pen={PEN} seed={40} font={FL} dur={0.3} opacity={slipFade} />
          {/* ===== scene 3: it can carry rules: the orange tag in the open water between islands A and B, on a visible string from the
              glyph's right edge; painted after every island (nothing over the string or the card) and BEFORE the token, whose
              rim covers the string's root so it reads as tied to the glyph ===== */}
          <StringTag x0={TAG_FROM[0]} y0={TAG_FROM[1]} x={TAG.x} top={TAG.top} w={TAG.w} h={TAG.h} hole="tl" fill={PEN.palette.gold} t={at(CUES.tag)} pen={PEN} seed={45}>
            <Type x={RULE.x} y={RULE.y1} text={C('move when...')} t={at(CUES.rule1)} cps={22} size={RULE.size} font={FL} color={PEN.ink} weight="700" anchor="start" charW={LBLW} />
            <Type x={RULE.x} y={RULE.y2} text={C('release when...')} t={at(CUES.rule2)} cps={22} size={RULE.size} font={FL} color={PEN.ink} weight="700" anchor="start" charW={LBLW} />
          </StringTag>
          {/* the glyph pops WITH its "$" (visual-qa round 4: a blank hexagon for 2.4 s read as a stop sign); only the inner ring waits for "recorded" */}
          <HexToken cx={TOKEN.cx} cy={TOKEN.cy} r={TOKEN.r} t={at(CUES.digital)} ringT={at(CUES.record)} pen={PEN} seed={41} font={FL} markDx={0.02} markDy={0.15} />
          <Type x={HEAD.x} y={HEAD.y} text={C('tokenized deposit')} t={at(CUES.label)} cps={22} size={LBL} font={FL} color={INK} weight="700" charW={LBLW} />

          {/* ===== scene 4: walled gardens (the fences are drawn with their islands above), the label ===== */}
          <Type x={GARDEN.x} y={GARDEN.y} text={C('walled garden')} t={at(CUES.garden)} cps={20} size={LBL + 2} font={FL} color={PEN.palette.red} weight="700" charW={LBLW} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

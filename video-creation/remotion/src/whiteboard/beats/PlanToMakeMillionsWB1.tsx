// whiteboard/beats/PlanToMakeMillionsWB1.tsx: whiteboard beat WB1 of the longform-edited video `plan-to-make-millions`
// (brief: media/plan-to-make-millions/assets/whiteboard/WB1.brief.md; cues: assets/whiteboard/WB1.cues.md).
// "Here's the funnel": blank paper, then a see-through funnel draws top to bottom (mouth, walls, tiers, stem). Small coins
// pour into its mouth and pile on the top tier while NEW COINS and the two source tags write on. Three bot heads land on
// the far rim, light up and plant flags on a few coins (BOTS FLAG ACTIVITY); the unflagged coins wash out to ghosts. Three
// hoop sieves draw across the tiers and take a label per question (FUNDING & BACKERS, EXCHANGE LISTINGS, MARKET CAP):
// at each one a flagged coin is turned away (it shakes, washes out, its flag goes limp and grey) and the rest drop to the
// next sieve. A small plain tag HOLDERS and three dots (one per "et cetera") continue the list. Payoff: a tray draws
// under the stem, the last coins drop out of it one by one and A HANDFUL OF PLAYS writes on, underlined once in the
// chapter's green.
// Canvas = the full frame 1920 x 1080 @30, spine 387.740 to 411.880 s = 24.14 s = 724 frames, no audio; the comp build
// fades it in and out. Pen: paper-pastel. Everything is SVG through rough.js with fixed seeds (no boil, deterministic).
// The storyboard is the CUES table below: LOCAL seconds (0 = spine 387.740), each hung on a spoken word of
// `spine/ALL.e.enhanced.medium-words.json`; a thing draws as he names it, never before.
// NO numbers on screen (the brief + DATA.md Pillar 3: no count exists for any stage of the funnel), no bot name, no
// project name or ticker, no currency sign (the coins are plain), no rug-pull / team-dump check: HOLDERS is a plain tag
// in the list, it carries no sieve and turns no coin away. The label at the top is NEW COINS, never "every".
// RESTING ON A SIEVE (round 5, visual-qa 2026-11-24): a ghost is an OPAQUE washed-out coin (SmallCoin `ghost`), never a
// see-through one, so it hides the mesh and the rim behind it (rounds 1 to 4 ghosted with opacity: the sieve was painted
// under the coins and still read as painted over them). Every coin on a sieve stands with its foot on the BACK half of
// the disc, well inboard of the rim tips, on a contact shadow, and is painted after every sieve.
import React from 'react';
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont as loadGochi } from '@remotion/google-fonts/GochiHand';
import { loadFont as loadKalam } from '@remotion/google-fonts/Kalam';
import { loadFont as loadRockSalt } from '@remotion/google-fonts/RockSalt';
import { loadFont as loadHandlee } from '@remotion/google-fonts/Handlee';
import { PENS } from '../pen';
import { Sketch, prog, easeOut, pop } from '../Sketch';
import { Tag, WobbleLine } from '../canton';
import { BotHead, CoinFlag, Funnel, RestShadow, Sieve, SmallCoin, Tray, TypeHold, funnelGeom } from '../funnel';

const { fontFamily: GOCHI } = loadGochi();
const { fontFamily: KALAM } = loadKalam('normal', { weights: ['400', '700'] });
const { fontFamily: ROCKSALT } = loadRockSalt();
const { fontFamily: HANDLEE } = loadHandlee();
const FONTS: Record<string, string> = { 'Gochi Hand': GOCHI, Kalam: KALAM, 'Rock Salt': ROCKSALT, Handlee: HANDLEE };

export const FPS = 30;
/** 24.14 s x 30 = 724 frames (spine 387.740 to 411.880) */
export const DUR = 724;
export const W = 1920;
export const H = 1080;

// ---- the storyboard: LOCAL seconds (spine seconds minus 387.740), the word each cue hangs on ----
const CUES = {
  funnel: 0.54,      // "funnel."        the funnel draws top to bottom: mouth, walls, tiers, stem (1.4 s, done 1.94 under "At the top")
  pour: 2.10,        // "every"          coins start pouring into the mouth, one every 0.26 s (a stream: five in the air); the last lands 7.82
  newCoins: 2.48,    // "new"            NEW types (COINS follows on "coin," 2.78)
  tagAgg: 4.42,      // "listed"         small tag: aggregator listings
  tagDex: 6.54,      // "decentralized"  small tag: new DEX pairs
  bots: 8.50,        // "bots"           three bot heads land on the far rim (0.07 s apart, 0.32 s each); BOTS types
  flag: 8.70,        // "flag"           FLAG types; the bots light up (8.84 on) and flags pop on six coins (8.86 to 9.41)
  fade: 9.28,        // "one"            the unflagged coins wash out to ghosts (to 10.2)
  activity: 9.78,    // "unusual"        ACTIVITY types, complete 10.2 as "activity." starts (10.24)
  sieves: 11.50,     // "scans"          three sieves draw across the tiers, top to bottom (0.3 s apart, 0.55 s each)
  funding: 13.34,    // "funded"         label FUNDING on the first sieve (+ its leader); one flagged coin is turned away (13.49: its flag goes down)
  backers: 14.42,    // "backing"        "& BACKERS" joins it; the other five drop through to the second sieve (landed 15.08)
  listings: 15.74,   // "listed?"        label EXCHANGE LISTINGS on the second sieve; one is turned away, four drop to the third (landed 16.27)
  marketCap: 16.40,  // "big"            label MARKET CAP on the third sieve; one is turned away (16.55)
  holders: 17.52,    // "holding"        a small plain tag HOLDERS under the list (no sieve, no coin turned away)
  dots: [18.40, 19.10, 20.00], // "Et" x 3   three dots, one per et cetera
  tray: 20.98,       // "What"           the tray draws under the stem (0.45 s)
  out: 21.18,        // "comes"          the last three coins drop out of the stem into the tray, 0.25 s apart (landed 21.68, 21.93, 22.18)
  payoff: 22.40,     // "is"             A HANDFUL OF PLAYS writes on (complete 22.80)
  underline: 22.68,  // "a"              the ONE highlight mark: a green underline (done 22.93; the finished drawing then holds
                     //                  0.91 s to the fade start 23.84, 1.21 s to the out)
};

// ---- layout ----
// The funnel stands on the frame's centre. Left of it: NEW COINS and its two tags at the top (the coins come in from the
// upper left beside them) and the payoff at the bottom, beside the tray. Right of it: the bots on the right half of the
// far rim, clear of the stream, and the questions stacked in ONE column, each tied to its sieve by a leader. Everything
// inside the funnel is painted between its back layer and its front layer.
const CX = 950;
const G = funnelGeom(CX, 300, 330, 44, 800, 44, 880, 36);
const TIERS = [472, 585, 688];                     // the three tier lines = where the sieves sit
const R = 18;                                      // coin radius
const GHOST = 0.26;                                // how much ink and colour a coin that did not pass keeps (it stays opaque)
const LBL_X = 1350;                                // the label column's left edge
const LBL = 44;                                    // label size (Kalam 700, caps)
const RIM_Y = 962;                                 // the tray's rim
const BOT_X = [CX + 85, CX + 178, CX + 271];
const PAY_X = CX - 125 - 50, PAY_W = 566;           // the payoff label: its right end, its measured ink width

type Pt = { x: number; y: number };
// A coin on a sieve stands with its FOOT on the back half of the disc: LIFT px behind the sieve's centre line at the axis,
// following the disc's curve toward its ends. So the coin covers the back rim decisively (rounds 1 to 4 had the foot on
// the front half: the coin tops ran along the back rim, kissing it) and the open mesh lies in front of its foot. The lifts
// are small on sieves 2 and 3 because a flag there must clear the hoop of the sieve above by ~10 px.
const LIFT = [-8, -4, -3];
/** where a coin rests on sieve `i`: its centre, `dx` from the axis, `row` rows up the pile */
const rest = (i: number, dx: number, row = 0): Pt => {
  const y = TIERS[i], hw = G.hw(y);
  return { x: CX + dx, y: y + LIFT[i] * Math.sqrt(Math.max(0, 1 - (dx / hw) ** 2)) - (R + 1) - row * 33 };
};

// The pile on the top sieve: 18 coins on a 45 px lattice, listed in the order they land (bottom row first). Nine on the
// mesh (the row ends 27 px inboard of the sieve's tips), seven on them, two on top. Every coin stands on two coins.
const PITCH = 45;
const ROW0 = [4, 5, 2, 7, 3, 0, 6, 1, 8].map((i) => ({ dx: (i - 4) * PITCH, row: 0 }));
const ROW1 = [-0.5, -2.5, 1.5, -1.5, 2.5, 0.5, -3.5].map((k) => ({ dx: k * PITCH, row: 1 }));
const ROW2 = [-1, 0].map((k) => ({ dx: k * PITCH, row: 2 }));
const PILE = [...ROW0, ...ROW1, ...ROW2];
const POUR_GAP = 0.26, POUR_D = 1.3;

// The six coins the bots flag, left to right: (dx, row) in the pile. Rules the pick obeys: (1) no coin up and to the right
// of a flagged one (that is where its pennant flies); (2) no flag on the top row (it would cross the mouth's near rim);
// (3) a flagged coin that LEAVES carries no coin, so the pile it leaves behind still stands: what stays on the first
// sieve is the row on the mesh and one small mound, with the turned-away coin in it.
const FLAGGED: [number, number][] = [[-3.5 * PITCH, 1], [-2.5 * PITCH, 1], [0.5 * PITCH, 1], [1.5 * PITCH, 1], [2.5 * PITCH, 1], [4 * PITCH, 0]];
const FLAG_ORDER = [3, 5, 1, 0, 4, 2];              // the order the flags pop in (0.11 s apart)
const flagIdx = (dx: number, row: number) => FLAGGED.findIndex(([fx, fr]) => fr === row && Math.abs(fx - dx) < 1);
// What each sieve does to flagged coin f: its slot on sieve 2, on sieve 3, in the tray (undefined = it was turned away at
// the sieve before), `order` = its turn out of the stem. One coin is turned away per sieve, always an INNER one, so it
// rests in the middle of the disc, clear of the rim tips and the walls: f2 on sieve 1 (FUNDING & BACKERS, in the mound),
// f3 on sieve 2 (EXCHANGE LISTINGS, the middle slot), f4 on sieve 3 (MARKET CAP, an inner slot). f0, f1, f5 come out.
const FATE: { s2?: number; s3?: number; tray?: number; order?: number }[] = [
  { s2: 0, s3: 0, tray: 0, order: 1 },
  { s2: 1, s3: 1, tray: 1, order: 0 },
  {},
  { s2: 2 },
  { s2: 3, s3: 2 },
  { s2: 4, s3: 3, tray: 2, order: 2 },
];
const S2 = [0, 1, 2, 3, 4].map((j) => rest(1, (j - 2) * 46));        // five in a row, the ends 51 px inboard of the tips
const S3 = [0, 1, 2, 3].map((j) => rest(2, (j - 1.5) * 42));         // four in a row, the ends 21 px inboard of the tips
const TRAY = [0, 1, 2].map((j) => ({ x: CX + (j - 1) * 52, y: RIM_Y - 13 }));   // 5 px of each coin behind the near wall
const D1 = 0.42, D2 = 0.38;                         // the two drops between sieves

const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const c01 = (v: number) => Math.max(0, Math.min(1, v));
const io = Easing.inOut(Easing.quad);
/** a small settle hop after a landing at dt = 0 (negative y = up) */
const hop = (dt: number, amp = 6, dur = 0.26) => (dt <= 0 || dt >= dur ? 0 : -amp * Math.sin((dt / dur) * Math.PI) * (1 - dt / dur));
/** a coin turned away at dt = 0 shakes sideways (a "no"): +-amp px, two and a half swings, dying out. Sideways, not a hop:
 *  a coin in the pile has another one resting on it. 3 px keeps it off its neighbours (the tightest row is 42 px apart). */
const shake = (dt: number, amp = 3, dur = 0.35) => (dt <= 0 || dt >= dur ? 0 : amp * Math.sin((dt / 0.14) * 2 * Math.PI) * (1 - dt / dur));

/** a pouring coin: in from the upper left on a falling arc to its pour point in the mouth, then down onto its slot */
const pourPos = (T: number, spawn: number, slot: Pt): Pt | null => {
  const u = (T - spawn) / POUR_D;
  if (u <= 0) return null;
  if (u >= 1) return { x: slot.x, y: slot.y + hop(T - spawn - POUR_D, 4, 0.22) };
  const px = Math.max(CX - 180, Math.min(CX - 30, CX + (slot.x - CX) * 0.45 - 60)), ex = px - 220, y0 = -30, ym = G.top + 6;
  // a slow, even fall (round 2's gravity curve bunched the coins above the frame: two in sight, a drip, not a stream)
  if (u < 0.7) { const w = u / 0.7; return { x: lerp(ex, px, w), y: y0 + (ym - y0) * Math.pow(w, 1.3) }; }
  const v = (u - 0.7) / 0.3, e = 1 - Math.pow(1 - v, 1.5);
  return { x: lerp(px, slot.x, e), y: lerp(ym, slot.y, e) };
};
/** a coin dropping from rest `a` to rest `b` (through a sieve), starting at s0 over D, with a settle hop */
const dropPos = (T: number, s0: number, D: number, a: Pt, b: Pt): Pt => {
  const u = c01((T - s0) / D);
  return { x: lerp(a.x, b.x, io(u)), y: lerp(a.y, b.y, u * u) + (u >= 1 ? hop(T - s0 - D) : 0) };
};
/** a coin leaving the last sieve: down the cone to the neck, through the stem, out into its place in the tray */
const OUT_D = 0.5;
const outPos = (T: number, s0: number, a: Pt, b: Pt): Pt => {
  const u = c01((T - s0) / OUT_D), yEnd = G.spoutY + 8;
  if (u < 0.6) { const w = u / 0.6; return { x: lerp(a.x, CX, io(w)), y: lerp(a.y, G.neckY, w * w) }; }
  if (u < 0.82) { const w = (u - 0.6) / 0.22; return { x: CX, y: lerp(G.neckY, yEnd, w) }; }
  const w = (u - 0.82) / 0.18;
  return { x: lerp(CX, b.x, 1 - (1 - w) * (1 - w)), y: lerp(yEnd, b.y, w) + (u >= 1 ? hop(T - s0 - OUT_D, 5, 0.24) : 0) };
};

export const PlanToMakeMillionsWB1: React.FC<{ penId?: string }> = ({ penId = 'paper-pastel' }) => {
  const PEN = PENS[penId] ?? PENS['paper-pastel'];
  const FH = FONTS[PEN.fontH], FL = FONTS[PEN.fontL];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = frame / fps;                 // local seconds
  const at = (cue: number) => T - cue;   // time since a cue (negative = not yet)

  const INK = PEN.colorH, SOFT = PEN.colorL;
  const ACCENT = '#007A55';              // the CH4 accent: the ONE highlight mark of the beat (the brief)
  const LEAD = '#8d8d8d';                // the leaders: a soft pencil line, lighter than the drawing

  // ---- the coins: where each one is, how washed out, its flag, and where it stands on a mesh ----
  type Stand = { pt: Pt; from: number; to: number };   // the coin rests on a sieve at `pt` from `from` until `to`
  const coins = PILE.map((slot, i) => {
    const home = rest(0, slot.dx, slot.row), f = flagIdx(slot.dx, slot.row), landed = CUES.pour + i * POUR_GAP + POUR_D;
    let p: Pt | null = pourPos(T, CUES.pour + i * POUR_GAP, home);
    let ghost = 0, down = 0, inTray = false;
    const stands: Stand[] = [];
    // a flagged coin turned away at `tr`, resting at `here`: it shakes, washes out and its flag goes limp and grey
    const turnedAway = (tr: number, here: Pt) => {
      if (T <= tr) return;
      p = { x: here.x + shake(T - tr), y: here.y };
      ghost = easeOut(c01((T - tr - 0.1) / 0.5));
      down = c01((T - tr - 0.1) / 0.4);
    };
    if (f < 0) {
      ghost = easeOut(c01((T - CUES.fade - i * 0.02) / 0.6));
      if (slot.row === 0) stands.push({ pt: home, from: landed, to: Infinity });
    } else {
      const fate = FATE[f];
      if (fate.s2 === undefined) {
        if (slot.row === 0) stands.push({ pt: home, from: landed, to: Infinity });
        turnedAway(CUES.funding + 0.15, home);
      } else {
        const s1 = CUES.backers + fate.s2 * 0.06, a2 = S2[fate.s2];
        if (slot.row === 0) stands.push({ pt: home, from: landed, to: s1 });
        if (T > s1) p = dropPos(T, s1, D1, home, a2);
        if (fate.s3 === undefined) {
          stands.push({ pt: a2, from: s1 + D1, to: Infinity });
          turnedAway(CUES.listings + 0.05, a2);
        } else {
          const s2 = CUES.listings + fate.s3 * 0.05, a3 = S3[fate.s3];
          stands.push({ pt: a2, from: s1 + D1, to: s2 });
          if (T > s2) p = dropPos(T, s2, D2, a2, a3);
          if (fate.tray === undefined) {
            stands.push({ pt: a3, from: s2 + D2, to: Infinity });
            turnedAway(CUES.marketCap + 0.15, a3);
          } else {
            const s3 = CUES.out + (fate.order ?? 0) * 0.25;
            stands.push({ pt: a3, from: s2 + D2, to: s3 });
            if (T > s3) { p = outPos(T, s3, a3, TRAY[fate.tray]); inTray = T > s3 + OUT_D * 0.82; }
          }
        }
      }
    }
    return { i, f, p: p as Pt | null, ghost, down, inTray, stands, passes: f >= 0 && FATE[f].tray !== undefined };
  });
  const flagT = (f: number) => at(CUES.flag + 0.16 + FLAG_ORDER.indexOf(f) * 0.11);

  // ---- the sieves: a tier line fades as its sieve draws over it ----
  const sieveT = (i: number) => at(CUES.sieves + i * 0.3);
  const tierOpacity = TIERS.map((_, i) => 1 - c01(sieveT(i) / 0.3));

  const drawCoin = (c: (typeof coins)[number]) => c.p && <SmallCoin key={c.i} x={c.p.x} y={c.p.y} r={R} pen={PEN} seed={100 + c.i} ghost={c.ghost} ghostTo={GHOST} />;
  const drawFlag = (c: (typeof coins)[number]) => c.p && c.f >= 0 && <CoinFlag key={c.i} x={c.p.x} y={c.p.y} r={R} t={flagT(c.f)} pen={PEN} seed={200 + c.i} down={c.down} />;
  // the contact shadow of every coin standing on a mesh: in on its landing, gone the frame it leaves
  const shadows = coins.flatMap((c) => c.stands.filter((st) => T > st.from && T < st.to).map((st, j) => (
    <RestShadow key={`${c.i}-${j}`} x={st.pt.x} footY={st.pt.y + R + 1} a={c01((T - st.from) / 0.12)} pen={PEN} />
  )));

  // one label of the column with its leader from the sieve's near-right edge
  const leader = (i: number, t: number, seed: number) => {
    const y = TIERS[i], x1 = CX + G.hw(y) + 16, x2 = LBL_X - 18;
    return (
      <g>
        {t > 0 && <circle cx={x1} cy={y} r={4.5} fill={LEAD} opacity={c01(t / 0.12)} />}
        <WobbleLine x1={x1} x2={x2} y={y} progress={easeOut(prog(t, 0, 0.3))} pen={PEN} seed={seed} color={LEAD} strokeWidth={2} seg={80} drift={2} />
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
        {PEN.floor && <rect x={0} y={925} width={W} height={H - 925} fill={PEN.floor} />}
        <g filter={PEN.glow ? 'url(#glow)' : undefined}>
          {/* ===== scene 1: the funnel, and new coins pouring in ===== */}
          <Funnel g={G} part="back" t={at(CUES.funnel)} pen={PEN} seed={1} tiers={TIERS} tierOpacity={tierOpacity} />
          {/* the bots perch on the far rim, so they are painted before anything that falls in front of it */}
          {BOT_X.map((x, k) => (
            <BotHead key={k} cx={x} baseY={G.backY(x) + 2} t={at(CUES.bots + k * 0.07)} dur={0.32} lit={prog(T, CUES.flag + 0.14 + k * 0.08, 0.25)} pen={PEN} seed={40 + k} />
          ))}
          {/* ===== scene 3 (painted UNDER every coin): the sieves across the tiers ===== */}
          {/* 5 px inside the wall each side: the hoop's lower edge sits where the cone is already narrower (round 3: it poked out) */}
          {TIERS.map((y, i) => <Sieve key={i} cx={CX} y={y} rx={G.hw(y) - 5} ry={G.ryAt(y) * (1 - 5 / G.hw(y))} t={sieveT(i)} pen={PEN} seed={50 + i} />)}
          <Tray cx={CX} rimY={RIM_Y} part="back" t={at(CUES.tray)} pen={PEN} seed={60} />
          {/* z-order on a sieve: its mesh and rim (above), then the contact shadows, then the coins standing on it, then the
              flags. Ghosts first, the turned-away coins over them, the coins still in play over those, every flag last. */}
          {shadows}
          {coins.filter((c) => c.f < 0).map(drawCoin)}
          {coins.filter((c) => c.f >= 0 && !c.passes).map(drawCoin)}
          {coins.filter((c) => c.passes && !c.inTray).map(drawCoin)}
          {coins.filter((c) => !c.inTray).map(drawFlag)}
          <Funnel g={G} part="front" t={at(CUES.funnel)} pen={PEN} seed={1} tiers={TIERS} tierOpacity={tierOpacity} />
          {/* out of the stem: in front of the funnel, behind the tray's near wall */}
          {coins.filter((c) => c.inTray).map(drawCoin)}
          {coins.filter((c) => c.inTray).map(drawFlag)}
          <Tray cx={CX} rimY={RIM_Y} part="front" t={at(CUES.tray)} pen={PEN} seed={60} />

          {/* NEW COINS and its two source tags, upper left, beside the stream */}
          <TypeHold x={150} y={128} text="NEW COINS" t={at(CUES.newCoins)} cps={13} size={60} font={FL} color={INK} weight="700" />
          <Tag cx={302} cy={192} w={304} h={52} t={at(CUES.tagAgg)} pen={PEN} seed={70} color={SOFT} dur={0.4}>
            <TypeHold x={302} y={203} text="aggregator listings" t={at(CUES.tagAgg + 0.1)} cps={38} size={30} font={FL} color={SOFT} anchor="middle" />
          </Tag>
          <Tag cx={266} cy={258} w={232} h={52} t={at(CUES.tagDex)} pen={PEN} seed={71} color={SOFT} dur={0.4}>
            <TypeHold x={266} y={269} text="new DEX pairs" t={at(CUES.tagDex + 0.1)} cps={30} size={30} font={FL} color={SOFT} anchor="middle" />
          </Tag>

          {/* ===== scene 2: the bots flag activity ===== */}
          <TypeHold x={LBL_X} y={258} text="BOTS FLAG ACTIVITY" t={at(CUES.bots)} size={46} font={FL} color={INK} weight="700"
            parts={[{ from: 0, at: 0, cps: 25 }, { from: 9, at: CUES.activity - CUES.bots, cps: 20 }]} />

          {/* ===== scene 3: one label per question ===== */}
          {leader(0, at(CUES.funding), 80)}
          <TypeHold x={LBL_X} y={TIERS[0] + 15} text="FUNDING & BACKERS" t={at(CUES.funding)} size={LBL} font={FL} color={INK} weight="700"
            parts={[{ from: 0, at: 0, cps: 22 }, { from: 7, at: CUES.backers - CUES.funding, cps: 26 }]} />
          {leader(1, at(CUES.listings), 81)}
          <TypeHold x={LBL_X} y={TIERS[1] + 15} text="EXCHANGE LISTINGS" t={at(CUES.listings)} cps={28} size={LBL} font={FL} color={INK} weight="700" />
          {leader(2, at(CUES.marketCap), 82)}
          <TypeHold x={LBL_X} y={TIERS[2] + 15} text="MARKET CAP" t={at(CUES.marketCap)} cps={22} size={LBL} font={FL} color={INK} weight="700" />
          <Tag cx={LBL_X + 88} cy={770} w={176} h={52} t={at(CUES.holders)} pen={PEN} seed={72} color={SOFT} dur={0.35}>
            <TypeHold x={LBL_X + 88} y={781} text="HOLDERS" t={at(CUES.holders + 0.08)} cps={30} size={30} font={FL} color={SOFT} weight="700" anchor="middle" />
          </Tag>
          {CUES.dots.map((d, i) => at(d) > 0 && (
            <g key={i} transform={`translate(${LBL_X + 18 + i * 38} 840) scale(${pop(prog(at(d), 0, 0.25))})`}>
              <Sketch pen={PEN} seed={90 + i} shape={{ kind: 'circle', cx: 0, cy: 0, r: 7 }} fill={PEN.ink} roughness={0.4} />
            </g>
          ))}

          {/* ===== payoff: a handful of plays ===== */}
          {/* left of the tray, ending 50 px short of it; the underline runs the measured ink width (566 px at 62 px), 13 px under
              the Y's tail (round 4: 2 px, the tail read as touching it) */}
          <TypeHold x={PAY_X} y={987} text="A HANDFUL OF PLAYS" t={at(CUES.payoff)} cps={45} size={62} font={FH} color={INK} spacing={0.02} anchor="end" />
          <WobbleLine x1={PAY_X - PAY_W} x2={PAY_X - 2} y={1014} progress={easeOut(prog(at(CUES.underline), 0, 0.25))} pen={PEN} seed={95} color={ACCENT} strokeWidth={7} seg={120} drift={2.5} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// whiteboard/islands.tsx: the ISLANDS-OF-MONEY part of the hand-drawn vocabulary (added 2026-11-04 for the quant beat
// WB1, "think of every bank as an island"): a sea (a tinted lower band of the page with wave ticks), an island (a potato
// of land with a small classical bank standing on it, a round vault door and an open ledger beside the bank, a palm at
// its far end, wave ticks at its shores), a coin with little legs (money that walks), a small sailboat (how money crosses
// the water), a clock face whose hands spin (time passing). The SAME FOUR islands return in the later quant beats, so
// their layout is exported here (`QUANT_ISLANDS`) and a beat places them from it, never from its own numbers.
//
// Kit conventions (video-creation/whiteboard/whiteboard.md): every component takes the pen and a LOCAL time `t`
// (seconds since its cue; <= 0 = not yet) and draws itself on part by part over `dur` through Sketch progress; fixed
// seeds (no boil, identical across render workers); role colors from the pen's palette (gold = money, red = the
// highlighted / hot thing, blue = machines and vehicles, green = good / leaves, grey = land and background); draw order =
// what hides what. Geometry was studied from references before drawing (Lucide, ISC: `sailboat` = a flat deck line over a
// dished hull with rounded bottom corners, a mast, a triangular sail whose leech curves; `clock` = a disc with the hour
// hand to 4 and the minute hand to 12; `tree-palm` = a curved trunk and fronds that arc out and droop; `waves` = a run
// of shallow quadratic bumps; `landmark` = the bank, reused from bank.tsx), then iterated on stills.
import React from 'react';
import type { Pen } from './pen';
import { Sketch, prog, easeOut, pop } from './Sketch';
import { BankFacade, VaultDoor, Ledger } from './bank';

/** stage helper: progress of stage a..b (fractions of `dur`) at local time `t` */
const stager = (t: number, dur: number) => (a: number, b: number) => prog(t, a * dur, (b - a) * dur);

/**
 * A pen for a group drawn at `k` scale: the stroke width is divided by k so the lines match the rest of the page once
 * scaled, and the wobble is raised a little (not fully compensated: a small shape with a full-size wobble reads messy).
 * Distinct id so Sketch's memo keeps the two pens apart.
 */
export const scaledPen = (pen: Pen, k: number, tag: string): Pen =>
  k === 1 ? pen : { ...pen, id: `${pen.id}-${tag}${k}`, inkWidth: pen.inkWidth / k, roughness: pen.roughness * (1 + 0.6 * (1 - k)) };

/** one wave tick: a shallow "~" of two bumps, `w` wide, starting at (x, y) */
export const waveD = (x: number, y: number, w = 28) => `M ${x} ${y} q ${w / 4} ${-w / 4.5} ${w / 2} 0 q ${w / 4} ${w / 4.5} ${w / 2} 0`;

/** a wave tick that draws on over 0.3 s */
export const Wave: React.FC<{ x: number; y: number; w?: number; t: number; pen: Pen; seed: number; opacity?: number }> = ({ x, y, w = 28, t, pen, seed, opacity = 0.75 }) => {
  if (t <= 0) return null;
  return <Sketch pen={pen} seed={seed} shape={{ kind: 'path', d: waveD(x, y, w) }} strokeWidth={pen.inkWidth * 0.9} roughness={0.5} progress={easeOut(prog(t, 0, 0.3))} opacity={opacity} />;
};

/**
 * The mainland COASTLINE along `horizon`: a run of shallow quadratic bumps (+-`amp` px) across the width, deterministic
 * per `seed`. Returns the open path (the shore stroke) and the knots (where grass tufts can stand).
 */
export const coastline = (horizon: number, w: number, seed: number, amp = 12, seg = 170) => {
  let r = seed * 7919 + 17;
  const rnd = () => { r = (r * 1103515245 + 12345) % 2147483648; return r / 2147483648; };
  const pts: [number, number][] = [[-10, horizon]];
  let d = `M -10 ${horizon}`, x = -10;
  while (x < w + 10) {
    const nx = Math.min(w + 10, x + seg + rnd() * 70), ny = horizon + (rnd() * 2 - 1) * amp;
    const cx = (x + nx) / 2 + (rnd() - 0.5) * 50, cy = horizon + (rnd() * 2 - 1) * amp * 1.7;
    d += ` Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${nx.toFixed(1)} ${ny.toFixed(1)}`;
    pts.push([nx, ny]);
    x = nx;
  }
  return { d, pts };
};

/** a tuft of grass standing on (x, y): a small zigzag of blades, 22 px wide, ~12 px tall */
const tuftD = (x: number, y: number) => `M ${x - 11} ${y} l 4 -9 l 4 9 l 3 -13 l 4 13 l 4 -10 l 3 10`;

/**
 * The sea: the mainland shore is a hand-drawn COASTLINE along `horizon` (a low wavy stroke, grass tufts on the land
 * side; visual-qa round 1 of quant WB1: a ruler-straight tint edge reads as a render band in a rough-pen scene), the
 * page below it tints to the pen's floor color (fades in over 0.5 s) and `ticks` wave marks draw on one after another
 * (0.07 s apart) across the water. Canvas `w` x `h`. `coast={false}` keeps the plain tint edge.
 */
export const Sea: React.FC<{ horizon: number; ticks: [number, number][]; t: number; pen: Pen; seed: number; w?: number; h?: number; coast?: boolean; avoid?: [number, number][] }> =
  ({ horizon, ticks, t, pen, seed, w = 1920, h = 1080, coast = true, avoid = [] }) => {
    if (t <= 0) return null;
    const s = seed * 10;
    const c = coastline(horizon, w, seed);
    // every third knot carries a tuft, but only knots 40 px inside the canvas: a tuft on the last knot drew a 2 px stub at
    // the right frame edge (visual-qa on quant WB1, 2026-11-04; fixed here so every beat that draws the sea inherits it).
    // `avoid` (opt-in, x spans; the shipped beats keep their frames) drops a tuft whose 22 px blades would stand under a
    // thing on the shore (quant WB10: a tuft grew through the flag pole's foot and under the harbour gate's pillar)
    const tufts = c.pts.filter((_, i) => i % 3 === 1).filter(([x]) => x > 40 && x < w - 40).filter(([x]) => !avoid.some(([a, b]) => x + 11 > a && x - 11 < b));
    return (
      <g>
        {pen.floor && (coast
          ? <path d={`${c.d} L ${w + 10} ${h + 10} L -10 ${h + 10} Z`} fill={pen.floor} stroke="none" opacity={easeOut(prog(t, 0, 0.5))} />
          : <rect x={0} y={horizon} width={w} height={h - horizon} fill={pen.floor} opacity={easeOut(prog(t, 0, 0.5))} />)}
        {coast && <Sketch pen={pen} seed={s + 99} shape={{ kind: 'path', d: c.d }} strokeWidth={pen.inkWidth} roughness={0.7} progress={easeOut(prog(t, 0, 0.8))} />}
        {coast && tufts.map(([x, y], i) => (
          <Sketch key={`g${i}`} pen={pen} seed={s + 80 + i} shape={{ kind: 'path', d: tuftD(x, y - 1) }} strokeWidth={pen.inkWidth * 0.8} roughness={0.5} progress={easeOut(prog(t, 0.5 + i * 0.08, 0.25))} />
        ))}
        {ticks.map(([x, y], i) => <Wave key={i} x={x} y={y} t={t - 0.1 - i * 0.07} pen={pen} seed={s + 1 + i} />)}
      </g>
    );
  };

/** the land outline in unit coordinates (-1..1 both ways): a potato, flatter on top where things stand */
const POTATO = 'M -1 0.1 C -0.98 -0.45, -0.6 -0.95, -0.15 -1 C 0.3 -1.05, 0.75 -0.8, 0.95 -0.4 C 1.1 -0.05, 0.95 0.5, 0.6 0.8 C 0.25 1.05, -0.3 1.05, -0.65 0.85 C -0.95 0.65, -1.02 0.4, -1 0.1 Z';
const potatoD = (cx: number, cy: number, rx: number, ry: number) =>
  POTATO.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (_m, a, b) => `${(cx + parseFloat(a) * rx).toFixed(1)} ${(cy + parseFloat(b) * ry).toFixed(1)}`);

export type IslandSpec = { cx: number; top: number; w?: number; h?: number; scale?: number };

/**
 * Where things stand on an island (in canvas coordinates, after `scale` about (cx, top)): the bank's base centre and
 * ground, the vault's centre, the ledger's base, the palm's foot, the FRONT-RIGHT shore where a figure stands at the
 * water (the coin's spot), and the land's bounding box.
 */
export const islandGeom = ({ cx, top, w = 580, h = 190, scale = 1 }: IslandSpec) => {
  const S = (dx: number, dy: number): [number, number] => [cx + dx * scale, top + dy * scale];
  const hw = w / 2;
  return {
    scale,
    land: { cx, cy: top + (h / 2) * scale, rx: hw * scale, ry: (h / 2) * scale },
    gy: top + 0.5 * h * scale,                 // the ground line things stand on (the land's middle)
    bank: S(-0.05 * w, 0.5 * h),
    vault: S(-0.32 * w, 0.5 * h - 36),         // the vault door's centre (r 36); clear of the palm's trunk at -0.45 w (round 1: they touched)
    ledger: S(0.26 * w, 0.5 * h),
    palm: S(-0.45 * w, 0.42 * h),
    shore: S(0.405 * w, 0.737 * h),            // feet of a figure standing at the front-right shore
    waterR: S(0.56 * w, 0.5 * h),              // the water just off the right tip (a wave tick); at 0.62 h it sat on a cross drawn at the shore (visual-qa round 1)
    waterL: S(-0.6 * w, 0.4 * h),
    left: cx - hw * scale, right: cx + hw * scale, bottom: top + h * scale,
  };
};

/**
 * A small palm standing on (x, gy), `h` tall: a trunk that leans right and thins toward the top, four fronds that arc
 * out from the crown and droop (green leaves). Draws on trunk -> fronds over `dur`.
 */
export const Palm: React.FC<{ x: number; gy: number; h?: number; t: number; pen: Pen; seed: number; dur?: number }> = ({ x, gy, h = 92, t, pen, seed, dur = 0.6 }) => {
  if (t <= 0) return null;
  const s = seed * 10, P = stager(t, dur), Pa = pen.palette;
  const tx = x + 10, ty = gy - h;                                          // the crown
  const trunk = `M ${x - 7} ${gy} Q ${x + 2} ${gy - h * 0.55} ${tx - 3} ${ty} L ${tx + 5} ${ty} Q ${x + 12} ${gy - h * 0.55} ${x + 9} ${gy} Z`;
  const frond = (ang: number, len: number) => {
    const a = (ang * Math.PI) / 180, ex = tx + Math.cos(a) * len, ey = ty + Math.sin(a) * len;
    const px = -Math.sin(a), py = Math.cos(a);                              // the leaf's half-width direction
    const mx = tx + Math.cos(a) * len * 0.5, my = ty + Math.sin(a) * len * 0.5;
    return `M ${tx} ${ty} Q ${mx + px * 11 - 0 * py} ${my + py * 11 - 10} ${ex} ${ey + 8} Q ${mx - px * 11} ${my - py * 11 - 10} ${tx} ${ty} Z`;
  };
  return (
    <g>
      <Sketch pen={pen} seed={s + 1} shape={{ kind: 'path', d: trunk }} fill={Pa.brown} progress={P(0, 0.45)} />
      {[[-158, 46], [-118, 44], [-62, 46], [-18, 50]].map(([ang, len], i) => (
        <Sketch key={i} pen={pen} seed={s + 10 + i} shape={{ kind: 'path', d: frond(ang, len) }} fill={Pa.green} roughness={0.8} progress={P(0.4 + i * 0.1, 0.7 + i * 0.1)} />
      ))}
    </g>
  );
};

/**
 * An island: a potato of land (grey, the background role) `w` x `h` whose top edge is at `top`, scaled by `scale`
 * about (cx, top) (the far islands are smaller). On it, each on its own cue: a small classical bank (`bankT`, bank.tsx
 * BankFacade at 0.3, the same bank as the other quant beats), a round vault door left of it (`vaultT`), an open ledger
 * right of it (`ledgerT`), a palm at the far left end (`palm`, with the land). The land draws on over `dur` (outline, fill
 * fading in behind) with a wave tick off each tip. The bank may draw BEFORE the land ("every bank ... as an island"):
 * the land is painted first in DOM order so the bank always sits on top of it.
 */
export const Island: React.FC<IslandSpec & { t: number; bankT?: number; vaultT?: number; ledgerT?: number; palm?: boolean; pen: Pen; seed: number; dur?: number; ledgerLines?: number; waves?: boolean; wavesR?: boolean; wavesL?: boolean; vaultOffset?: [number, number]; sequential?: boolean; reinkT?: number; reinkWidth?: number; reinkDur?: number; vaultBolts?: number; between?: React.ReactNode }> =
  ({ cx, top, w = 580, h = 190, scale = 1, t, bankT = -1, vaultT = -1, ledgerT = -1, palm = true, pen, seed, dur = 0.6, ledgerLines = 1, waves = true, wavesR = true, wavesL = true, vaultOffset, sequential = false, reinkT = -1, reinkWidth, reinkDur = 0.6, vaultBolts, between }) => {
    if (t <= 0 && bankT <= 0) return null;
    const g = islandGeom({ cx, top, w, h, scale });
    const s = seed * 100, P = stager(t, dur), Pa = pen.palette;
    const pen1 = scaledPen(pen, scale, 'isl');
    const K = 0.3;                                                           // the bank facade's scale on the island
    const penB = scaledPen(pen, scale * K, 'bank');
    // everything below is authored at scale 1 about (cx, top) and scaled as a group
    const L = (p: [number, number]): [number, number] => [cx + (p[0] - cx) / scale, top + (p[1] - top) / scale];
    // `vaultOffset` (canvas px, opt-in) moves the vault door off its shared spot: on an ENLARGED island the potato's top-left
    // curve runs under the door's upper hinge (quant WB6 at 1.25, visual-qa 2026-11-05: "the vault door hangs off the land");
    // the shipped beats keep their frames (no offset = the islandGeom spot)
    const bank = L(g.bank), vault = L([g.vault[0] + (vaultOffset?.[0] ?? 0), g.vault[1] + (vaultOffset?.[1] ?? 0)]), ledger = L(g.ledger), palmAt = L(g.palm), wR = L(g.waterR), wL = L(g.waterL);
    return (
      <g transform={`translate(${cx} ${top}) scale(${scale}) translate(${-cx} ${-top})`}>
        {t > 0 && (
          <>
            {/* `sequential` (opt-in, the shipped beats keep their frames) draws the land's outline as ONE pen stroke: rough.js emits a sub-path per
                curve and a small island otherwise shows 4-5 floating dashes mid draw-on (Sketch.tsx gotcha; visual-qa on quant WB7, 2026-11-05) */}
            <Sketch pen={pen1} seed={s + 1} shape={{ kind: 'path', d: potatoD(cx, top + h / 2, w / 2, h / 2) }} fill={Pa.grey} progress={P(0, 0.8)} sequential={sequential} />
            {/* `reinkT` (opt-in, seconds since its own cue; the shipped beats keep their frames): the land's outline RE-INKED as one heavier
                sequential pen stroke (`reinkWidth` in canvas px, default the pen's width + 2.4; its own seed so it sits a hair off the first
                line like a hand going over it), painted HERE, over the land's fill and UNDER the palm, the vault, the bank and the ledger: the
                stand-alone `IslandOutline` painted after the Island sliced across every object on it and the land read as a transparent
                ellipse laid over the scene (visual-qa on quant WB11, 2026-11-05) */}
            {reinkT > 0 && (
              <Sketch pen={pen1} seed={s + 9} shape={{ kind: 'path', d: potatoD(cx, top + h / 2, w / 2, h / 2) }} stroke={pen.ink} strokeWidth={(reinkWidth ?? pen.inkWidth + 2.4) / scale} roughness={0.9} progress={easeOut(prog(reinkT, 0, reinkDur))} sequential />
            )}
            {/* `between` (opt-in): a node painted ON THE LAND, after its fill and re-ink and under everything standing on it (the palm,
                the vault, the bank, the ledger), in CANVAS coordinates whatever the island's scale: a path drawn on the ground whose far
                side must hide behind the buildings (quant WB2 round 4: the "only move inside the bank" loop arrow, a ground-plane
                ellipse whose back arc goes behind the bank's steps and the ledger's pedestal; painted after the Island it ran over them) */}
            {between && <g transform={`translate(${cx} ${top}) scale(${1 / scale}) translate(${-cx} ${-top})`}>{between}</g>}
            {/* `waves={false}` drops the two shore ticks: a beat that lands an arrow off a tip keeps the water there clear (quant WB5);
                `wavesR={false}` drops only the right one (quant WB11: island C's right tick ended 44 px from the frame edge, inside the
                deck-scaled 50 px margin the beat plays under Mike's face with) */}
            {waves && wavesR && <Wave x={wR[0]} y={wR[1]} t={t - dur * 0.5} pen={pen1} seed={s + 2} />}
            {/* `wavesL={false}` drops only the left one (quant WB4: island A's left tick forced a dashed boundary out to 21 px from the frame edge) */}
            {waves && wavesL && <Wave x={wL[0] - 28} y={wL[1]} t={t - dur * 0.65} pen={pen1} seed={s + 3} />}
            {palm && <Palm x={palmAt[0]} gy={palmAt[1]} t={t - dur * 0.3} pen={pen1} seed={s + 4} />}
          </>
        )}
        {/* `vaultBolts` (opt-in; the shipped beats keep their frames): fewer rim bolts on a small (scaled) island, where eight merged into a
            dashed ring and the door read as a casino chip (visual-qa on quant WB1, 2026-11-05); the beat passes ~4 for a 0.5 island */}
        <VaultDoor cx={vault[0]} cy={vault[1]} r={36} t={vaultT} pen={pen1} seed={s + 6} dur={0.7} bolts={vaultBolts} />
        <g transform={`translate(${bank[0]} ${bank[1]}) scale(${K}) translate(${-bank[0]} ${-bank[1]})`}>
          <BankFacade x={bank[0] - 340} gy={bank[1]} w={680} t={bankT} pen={penB} seed={s + 5} dur={0.9} />
        </g>
        {/* `ledgerLines` = the ruled lines' opacity: a beat that writes on the book knocks them out (quant WB2) */}
        <Ledger cx={ledger[0]} baseY={ledger[1]} w={90} t={ledgerT} pen={pen1} seed={s + 7} dur={0.7} linesOpacity={ledgerLines} />
      </g>
    );
  };

/**
 * The four islands of the quant video (the same four return in every beat that draws them): two in the foreground, two
 * smaller in the back. Order: A (front left, the money's home), B (front right, across the channel), C (back right),
 * D (back centre).
 */
export const QUANT_ISLANDS: IslandSpec[] = [
  { cx: 430, top: 600 },
  { cx: 1370, top: 620 },
  { cx: 1700, top: 410, scale: 0.5 },   // its right wave tick ends ~30 px from the frame edge (at 1720 it was 10 px)
  { cx: 880, top: 360, scale: 0.5 },
];

/**
 * A coin with little legs (money that walks): a gold disc with a bold ink rim, a thin concentric inner ring and a
 * currency mark on its face (a "$" in the label font, no amount: visual-qa round 1 read an unmarked disc as a peach /
 * a lollipop), two stick legs from under it to two SEPARATE feet on (x, gy), 14 px either side of the centre, each foot a
 * short bar pointing forward (never one shared foot bar, never crossed). `phase` (radians) strides the legs (+-5 px)
 * for a walk. `legs={false}` once it sits in something (the boat) so no feet poke out. Pops in over 0.35 s. Legs first,
 * the disc over the hips. `font` = the loaded label font family (the scene loads it; defaults to pen.fontL).
 */
export const LegCoin: React.FC<{ x: number; gy?: number; cy?: number; r?: number; phase?: number; legs?: boolean; t: number; pen: Pen; seed: number; color?: string; font?: string; mark?: string }> =
  ({ x, gy: gyIn, cy, r = 30, phase = 0, legs = true, t, pen, seed, color, font, mark = '$' }) => {
    if (t <= 0) return null;
    const s = seed * 10, k = pop(prog(t, 0, 0.35));
    const legLen = 34;
    // place it by its feet (`gy`) or by its disc centre (`cy`); the legs always hang from the disc (a coin in the air
    // keeps its legs under it: with the feet pinned to the ground they stretched into a pole on the hop, round 1)
    const ccy = cy ?? (gyIn ?? 0) - legLen - r + 6;
    const gy = cy !== undefined ? ccy + r - 6 + legLen : (gyIn ?? 0);
    const sw = Math.sin(phase) * 5;
    return (
      <g transform={`translate(${x} ${ccy}) scale(${k}) translate(${-x} ${-ccy})`}>
        {legs && [-1, 1].map((side, i) => {
          const hx = x + side * 10, fx = x + side * 14 - sw * side;      // one leg forward while the other is back
          return (
            <g key={i}>
              <Sketch pen={pen} seed={s + 10 + i} shape={{ kind: 'line', x1: hx, y1: ccy + r - 8, x2: fx, y2: gy - 3 }} strokeWidth={pen.inkWidth + 0.4} roughness={0.5} />
              <Sketch pen={pen} seed={s + 12 + i} shape={{ kind: 'line', x1: fx - 2, y1: gy - 2, x2: fx + 10, y2: gy - 2 }} strokeWidth={pen.inkWidth + 0.8} roughness={0.4} />
            </g>
          );
        })}
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'circle', cx: x, cy: ccy, r }} fill={color ?? pen.palette.gold} strokeWidth={pen.inkWidth + 1.2} roughness={0.35} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'circle', cx: x, cy: ccy, r: r * 0.78 }} strokeWidth={pen.inkWidth * 0.6} roughness={0.2} />
        <text x={x} y={ccy + r * 0.02} textAnchor="middle" dominantBaseline="central" fontFamily={font ?? pen.fontL} fontWeight={700} fontSize={r * 1.5} fill={pen.ink} opacity={k >= 1 ? 1 : k}>{mark}</text>
      </g>
    );
  };

/** geometry of a Boat (shared with the scene so a passenger can be seated in it) */
export const boatGeom = (x: number, y: number, w = 150) => {
  const yd = y - 10;                                     // the deck line (the hull sits 10 px into the water)
  // the seat is a passenger's (r 30) disc centre: its right edge 8 px short of the mast (round 1: the disc touched it)
  return { yd, stern: x - w / 2 + 3, bow: x + w / 2 + 1, mast: x - 10, mastTop: yd - 118, seat: [x - 48, yd - 20] as [number, number] };
};

/**
 * A small sailboat heading right, hull centred on x at waterline y, `w` wide: a dished hull (blue, a vehicle) with a
 * flat deck line and a slightly raised bow, a mast, a triangular sail (white) whose leech curves, a boom along its foot,
 * a wave tick at the stern and the bow. Draws on hull -> mast -> sail -> waves over `dur`. A passenger is painted by the
 * scene BEFORE the boat so the hull hides its lower part (seat = `boatGeom(...).seat`).
 */
export const Boat: React.FC<{ x: number; y: number; w?: number; t: number; pen: Pen; seed: number; dur?: number; waves?: number }> = ({ x, y, w = 150, t, pen, seed, dur = 0.55, waves = 0.75 }) => {
  if (t <= 0) return null;
  const s = seed * 10, P = stager(t, dur), Pa = pen.palette;
  const g = boatGeom(x, y, w);
  const yd = g.yd;
  const hull = `M ${g.stern} ${yd} L ${g.bow} ${yd - 8} Q ${g.bow - 8} ${yd + 26} ${g.bow - 34} ${yd + 28} L ${g.stern + 26} ${yd + 28} Q ${g.stern} ${yd + 26} ${g.stern} ${yd} Z`;
  const sail = `M ${g.mast + 4} ${g.mastTop + 8} L ${g.mast + 4} ${yd - 22} L ${g.mast + 70} ${yd - 22} Q ${g.mast + 52} ${yd - 68} ${g.mast + 4} ${g.mastTop + 8} Z`;
  return (
    <g>
      <Sketch pen={pen} seed={s + 1} shape={{ kind: 'path', d: hull }} fill={Pa.blue} progress={P(0, 0.45)} />
      <Sketch pen={pen} seed={s + 2} shape={{ kind: 'line', x1: g.mast, y1: yd, x2: g.mast, y2: g.mastTop }} strokeWidth={pen.inkWidth + 0.8} progress={P(0.35, 0.6)} />
      <Sketch pen={pen} seed={s + 3} shape={{ kind: 'path', d: sail }} fill={pen.light} progress={P(0.55, 0.9)} />
      {/* the hull waves sit 13 px under the waterline so a route drawn along the waterline stays clear of them. `waves` = their
          opacity (default 0.75; 0 drops them): once a DOTTED route runs along the waterline, two of its dots over the bow tick form a
          small face (two eyes and a mouth: visual-qa on quant WB1, 2026-11-05), so a scene fades the ticks out as the route draws */}
      {waves > 0 && <Wave x={g.stern - 34} y={y + 13} w={26} t={t - dur * 0.7} pen={pen} seed={s + 4} opacity={waves} />}
      {waves > 0 && <Wave x={g.bow + 6} y={y + 13} w={26} t={t - dur * 0.8} pen={pen} seed={s + 5} opacity={waves} />}
    </g>
  );
};

/**
 * A clock face centred on (cx, cy): a disc (white, roughness 0.45: at the pen's full wobble the r 50 face was an egg with a stroke overrun), twelve ticks (the quarters longer), an hour hand and a minute hand,
 * a centre dot. Draws on disc -> ticks -> hands over `dur`; the hands start at 12 and 4 (the clock icon) and SPIN once
 * `spinT` > 0 (seconds since the spin cue): the minute hand 1.5 turns a second, the hour hand a turn every 8 s, so
 * time visibly passes.
 */
export const ClockFace: React.FC<{ cx: number; cy: number; r?: number; t: number; spinT?: number; pen: Pen; seed: number; dur?: number }> =
  ({ cx, cy, r = 50, t, spinT = -1, pen, seed, dur = 0.5 }) => {
    if (t <= 0) return null;
    const s = seed * 10, P = stager(t, dur);
    const sp = Math.max(0, spinT);
    const minDeg = sp * 540, hourDeg = 120 + sp * 45;
    const hand = (deg: number, len: number, sw: number, sd: number, p: number) => (
      <g transform={`rotate(${deg} ${cx} ${cy})`}>
        <Sketch pen={pen} seed={sd} shape={{ kind: 'line', x1: cx, y1: cy + 4, x2: cx, y2: cy - len }} strokeWidth={sw} roughness={0.4} progress={p} />
      </g>
    );
    return (
      <g>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'circle', cx, cy, r }} fill={pen.light} roughness={0.45} progress={P(0, 0.4)} />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * Math.PI) / 6 - Math.PI / 2, q = i % 3 === 0, l = q ? r * 0.2 : r * 0.1;
          return <Sketch key={i} pen={pen} seed={s + 10 + i} shape={{ kind: 'line', x1: cx + Math.cos(a) * (r - 4), y1: cy + Math.sin(a) * (r - 4), x2: cx + Math.cos(a) * (r - 4 - l), y2: cy + Math.sin(a) * (r - 4 - l) }} strokeWidth={q ? pen.inkWidth + 0.6 : pen.inkWidth * 0.8} roughness={0.3} progress={P(0.3 + i * 0.025, 0.42 + i * 0.025)} />;
        })}
        {hand(hourDeg, r * 0.5, pen.inkWidth + 1.6, s + 2, P(0.72, 0.86))}
        {hand(minDeg, r * 0.74, pen.inkWidth + 0.8, s + 3, P(0.8, 0.94))}
        <Sketch pen={pen} seed={s + 4} shape={{ kind: 'circle', cx, cy, r: 4 }} fill={pen.ink} roughness={0.3} progress={P(0.9, 1)} />
      </g>
    );
  };

/**
 * An island's land outline RE-INKED as a stand-alone layer (added 2026-11-05 for quant WB11, "every one of those banks is
 * an island"): the same potato path as the Island's land, drawn again as ONE heavier pen stroke (`strokeWidth`, default
 * the pen's width + 1.6, in canvas px whatever the island's `scale`) over `dur`, sub-paths one after another (Sketch
 * `sequential`), with its own seed so the second stroke sits a hair off the first like a hand going over a line.
 * Painted after an Island it runs OVER the island's furniture (the palm trunk, the vault rim, the bank's entablature,
 * the ledger's foot: visual-qa on quant WB11), so a beat that re-inks a furnished island uses `Island reinkT` instead
 * (the stroke painted between the land's fill and its objects); this layer is for a BARE land shape or a ghost.
 */
export const IslandOutline: React.FC<IslandSpec & { t: number; pen: Pen; seed: number; dur?: number; color?: string; strokeWidth?: number }> =
  ({ cx, top, w = 580, h = 190, scale = 1, t, pen, seed, dur = 0.6, color, strokeWidth }) => {
    if (t <= 0) return null;
    const pen1 = scaledPen(pen, scale, 'isl');
    const sw = (strokeWidth ?? pen.inkWidth + 1.6) / scale;
    return (
      <g transform={`translate(${cx} ${top}) scale(${scale}) translate(${-cx} ${-top})`}>
        <Sketch pen={pen1} seed={seed * 100 + 9} shape={{ kind: 'path', d: potatoD(cx, top + h / 2, w / 2, h / 2) }} stroke={color ?? pen.ink} strokeWidth={sw} roughness={0.9} progress={easeOut(prog(t, 0, dur))} sequential />
      </g>
    );
  };

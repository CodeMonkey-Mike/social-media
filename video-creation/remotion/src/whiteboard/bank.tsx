// whiteboard/bank.tsx: the BANKING / FINTECH part of the hand-drawn vocabulary (added 2026-11-04 for the quant beat
// WB12, "a software layer that sits on top of the systems a bank already runs"): a classical bank facade whose bays
// hold a round vault door and an open ledger, with a rail track leaving its side and receding into the distance; a floating software-layer band;
// orange threads; a row of chain-linked blocks (a blockchain); a coin network (digital money); a hanging question
// tag; a globe; a dotted path with an arrowhead.
//
// Kit conventions (video-creation/whiteboard/whiteboard.md): every component takes the pen and a LOCAL time `t`
// (seconds since its cue; <= 0 = not yet) and draws itself on part by part over `dur` through Sketch progress; fixed
// seeds (no boil, identical across render workers); role colors from the pen's palette (gold = money, red = the
// highlighted / hot thing, blue = machines, green = good, grey = background); draw order = what hides what.
// Geometry was studied from references before drawing (the Lucide `landmark` icon, ISC: a pediment triangle over a
// beam, four columns, a base; a round bank vault door: a thick ring of bolts around a three-spoke hand wheel with a
// hub, hinge knuckles on one side; the Lucide `book-open` icon: two pages meeting at a spine, outer corners curved;
// the Lucide `globe`: a circle, one vertical meridian ellipse, the equator and two latitude arcs; a chain link = two
// overlapping ovals), then iterated on stills.
import React from 'react';
import type { Pen } from './pen';
import { Sketch, prog, easeOut, pop } from './Sketch';
import { rrect } from './crypto';

/** stage helper: progress of stage a..b (fractions of `dur`) at local time `t` */
const stager = (t: number, dur: number) => (a: number, b: number) => prog(t, a * dur, (b - a) * dur);

/** geometry of a BankFacade (shared with the scene so other things can be placed against it) */
export const bankGeom = (x: number, gy: number, w = 680, colH = 220, pedH = 120) => {
  const stepTop = gy - 56, colTop = stepTop - colH, entTop = colTop - 16 - 36, apexY = entTop - pedH;
  const cols = [0, 1, 2, 3].map((i) => x + 80 + (i * (w - 160)) / 3);
  const bays = [0, 1, 2].map((i) => (cols[i] + cols[i + 1]) / 2);
  return { stepTop, colTop, entTop, apexY, cols, bays, right: x + w, w };
};

/**
 * A classical bank facade standing on (x, gy) (x = the left of the base, `w` wide): two steps, four columns with
 * capitals, an entablature, a pediment with an inner triangle, an arched entrance in the middle bay. The outer bays
 * hold what the bank ALREADY RUNS, each on its own cue: `vaultT` draws a round vault door (left bay), `ledgerT` an open
 * ledger on a pedestal (right bay), `railT` a rail track leaving the plinth's right side and receding into the distance (a flat track with posts
 * read as a fence on the 2026-11-04 still; a receding one cannot). Draws on steps -> columns
 * (left to right) -> entablature -> pediment -> entrance over `dur`.
 * `colW` (default 46) is the column width (the capitals are `colW + 18`); the entrance is FITTED to the middle bay: at most
 * 84 x 162 (the default bank's door, unchanged), never wider than the inner columns' gap minus 20 px nor taller than 0.74
 * of the column (on a 440-wide bank the 84 px door covered 18 px of each inner column and cut through both capitals,
 * quant WB8, visual-qa 2026-11-05: a small bank passes `colW={30}` so its columns keep the studied ~5:1 ratio).
 * `rail` overrides the track's geometry (RailTrack props + `dx` / `dy` from the plinth's right-bottom corner). The
 * default (no `rail`) is the shipped one (`rail.planks` = the 2026-11-05 PlankTrack, see it): the near end AT ground level, climbing 80 px up the white wall, sleepers
 * stopping at the rails; visual-qa on quant WB12 (2026-11-04) read it as a LADDER propped against the plinth. A track
 * that LIES ON THE GROUND sits in the floor band (below `gy`), wide and low at the plinth, converging up toward the
 * floor line as it recedes, sleepers overhanging both rails: `rail={{ dx: 4, dy: 48, gap: 34, rise: 40, len: 300,
 * overhang: 0.25, heavy: 1.4 }}` (WB12 round 3). Opt-in so the other beats keep their frames.
 */
export type BankRail = {
  dx?: number; dy?: number; len?: number; rise?: number; gap?: number; overhang?: number; heavy?: number; dur?: number;
  /** `planks: true` draws a `PlankTrack` (filled slanted wooden sleepers under heavy rails) instead of a `RailTrack`; `gapFar`, `lean`, `thick` are its own knobs */
  planks?: boolean; gapFar?: number; lean?: number; thick?: number;
};
export const BankFacade: React.FC<{
  x: number; gy: number; w?: number; colH?: number; pedH?: number; t: number; vaultT?: number; ledgerT?: number; railT?: number;
  pen: Pen; seed: number; dur?: number; colW?: number; rail?: BankRail;
}> = ({ x, gy, w = 680, colH = 220, pedH = 120, t, vaultT = -1, ledgerT = -1, railT = -1, pen, seed, dur = 1.5, colW = 46, rail }) => {
  if (t <= 0) return null;
  const s = seed * 10, P = stager(t, dur), Pa = pen.palette;
  const g = bankGeom(x, gy, w, colH, pedH);
  const capHW = colW / 2 + 9;
  const entranceX = g.bays[1];
  // the door: half-width and height fitted to the middle bay (the default bank: 42 / 162, a 52 px arch over a 110 px jamb)
  const bayGap = g.cols[2] - g.cols[1] - colW;
  const dHW = Math.min(42, (bayGap - 20) / 2), dH = Math.min(162, colH * 0.74), dArch = (dHW * 52) / 42, dJamb = dH - dArch;
  const entrance = `M ${entranceX - dHW} ${g.stepTop} L ${entranceX - dHW} ${g.stepTop - dJamb} Q ${entranceX - dHW} ${g.stepTop - dH} ${entranceX} ${g.stepTop - dH} Q ${entranceX + dHW} ${g.stepTop - dH} ${entranceX + dHW} ${g.stepTop - dJamb} L ${entranceX + dHW} ${g.stepTop} Z`;
  const ped: [number, number][] = [[x + 16, g.entTop], [x + w - 16, g.entTop], [x + w / 2, g.apexY]];
  const pedIn: [number, number][] = [[x + 60, g.entTop - 16], [x + w - 60, g.entTop - 16], [x + w / 2, g.apexY + 34]];
  return (
    <g>
      {/* steps */}
      <Sketch pen={pen} seed={s + 1} shape={{ kind: 'rect', x, y: gy - 30, w, h: 30 }} fill={Pa.grey} progress={P(0, 0.12)} />
      <Sketch pen={pen} seed={s + 2} shape={{ kind: 'rect', x: x + 24, y: g.stepTop, w: w - 48, h: 26 }} fill={Pa.grey} progress={P(0.08, 0.2)} />
      {/* columns with capitals, left to right */}
      {g.cols.map((cx, i) => {
        const a = 0.18 + i * 0.08;
        return (
          <g key={i}>
            <Sketch pen={pen} seed={s + 10 + i} shape={{ kind: 'rect', x: cx - colW / 2, y: g.colTop, w: colW, h: colH }} fill={pen.light} progress={P(a, a + 0.16)} />
            <Sketch pen={pen} seed={s + 20 + i} shape={{ kind: 'rect', x: cx - capHW, y: g.colTop - 16, w: 2 * capHW, h: 16 }} fill={Pa.grey} roughness={0.8} progress={P(a + 0.12, a + 0.2)} />
          </g>
        );
      })}
      {/* entablature, pediment, its inner triangle */}
      <Sketch pen={pen} seed={s + 3} shape={{ kind: 'rect', x: x + 36, y: g.entTop, w: w - 72, h: 36 }} fill={Pa.blue} progress={P(0.5, 0.64)} />
      <Sketch pen={pen} seed={s + 4} shape={{ kind: 'polygon', pts: ped }} fill={Pa.grey} progress={P(0.62, 0.82)} />
      <Sketch pen={pen} seed={s + 5} shape={{ kind: 'polygon', pts: pedIn }} strokeWidth={pen.inkWidth * 0.7} roughness={0.8} progress={P(0.8, 0.92)} />
      {/* the entrance in the middle bay */}
      <Sketch pen={pen} seed={s + 6} shape={{ kind: 'path', d: entrance }} fill={Pa.blue} progress={P(0.86, 1)} />
      {/* what the bank already runs */}
      <VaultDoor cx={g.bays[0]} cy={g.stepTop - 118} r={48} t={vaultT} pen={pen} seed={seed + 1} />
      <Ledger cx={g.bays[2]} baseY={g.stepTop} w={100} t={ledgerT} pen={pen} seed={seed + 2} />
      {rail?.planks ? (
        <PlankTrack x={g.right + (rail.dx ?? 20)} y={gy + (rail.dy ?? 28)} len={rail.len ?? 280} rise={rail.rise ?? 20} gap={rail.gap ?? 34} gapFar={rail.gapFar ?? 10}
          overhang={rail.overhang ?? 0.25} lean={rail.lean ?? 59} thick={rail.thick ?? 12} heavy={rail.heavy ?? 1.6} dur={rail.dur ?? 0.7} t={railT} pen={pen} seed={seed + 3} />
      ) : (
        <RailTrack x={g.right + (rail?.dx ?? -2)} y={gy + (rail?.dy ?? 0)} len={rail?.len ?? 280} rise={rail?.rise ?? 80} gap={rail?.gap ?? 30}
          overhang={rail?.overhang ?? 0} heavy={rail?.heavy ?? 0} dur={rail?.dur ?? 0.7} t={railT} pen={pen} seed={seed + 3} />
      )}
    </g>
  );
};

/**
 * A round bank vault door centred on (cx, cy): the door disc, a ring of bolts, a three-spoke hand wheel with a hub,
 * two hinge knuckles on the left. Draws on disc -> inner ring -> bolts -> wheel -> hub -> hinges over `dur`.
 */
export const VaultDoor: React.FC<{ cx: number; cy: number; r?: number; t: number; pen: Pen; seed: number; dur?: number; bolts?: number }> =
  ({ cx, cy, r = 52, t, pen, seed, dur = 0.9, bolts = 8 }) => {
    if (t <= 0) return null;
    const s = seed * 10, P = stager(t, dur), Pa = pen.palette;
    const rim = r * 0.74, wheel = r * 0.46;
    // `bolts` (opt-in, default 8 so the shipped beats keep their frames): on a door drawn ~40 px wide (an island at 0.5) eight
    // bolts merge with the rim into a dashed ring and the door read as a casino chip (visual-qa on quant WB1, 2026-11-05); four
    // read as bolts at that size. Each bolt keeps its seed slot (s + 10 + i) so the first four are the same marks either way.
    const nb = Math.max(0, Math.round(bolts)), boltStep = 0.24 / Math.max(1, nb);
    return (
      <g>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'circle', cx, cy, r }} fill={Pa.blue} progress={P(0, 0.3)} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'circle', cx, cy, r: rim }} strokeWidth={pen.inkWidth * 0.8} roughness={0.7} progress={P(0.26, 0.46)} />
        {Array.from({ length: nb }).map((_, i) => {
          const a = (Math.PI * 2 * i) / nb + Math.PI / nb, br = (r + rim) / 2;
          return <Sketch key={i} pen={pen} seed={s + 10 + i} shape={{ kind: 'circle', cx: cx + Math.cos(a) * br, cy: cy + Math.sin(a) * br, r: 3.2 }} fill={pen.ink} roughness={0.3} progress={P(0.42 + i * boltStep, 0.5 + i * boltStep)} />;
        })}
        <Sketch pen={pen} seed={s + 3} shape={{ kind: 'circle', cx, cy, r: wheel }} strokeWidth={pen.inkWidth + 0.6} roughness={0.6} progress={P(0.6, 0.78)} />
        {[0, 1, 2].map((i) => {
          const a = -Math.PI / 2 + (Math.PI * 2 * i) / 3;
          return <Sketch key={i} pen={pen} seed={s + 20 + i} shape={{ kind: 'line', x1: cx, y1: cy, x2: cx + Math.cos(a) * wheel, y2: cy + Math.sin(a) * wheel }} strokeWidth={pen.inkWidth + 0.6} roughness={0.5} progress={P(0.74 + i * 0.05, 0.86 + i * 0.05)} />;
        })}
        <Sketch pen={pen} seed={s + 4} shape={{ kind: 'circle', cx, cy, r: r * 0.14 }} fill={pen.light} roughness={0.4} progress={P(0.88, 0.96)} />
        {[-0.45, 0.45].map((k, i) => (
          <Sketch key={i} pen={pen} seed={s + 30 + i} shape={{ kind: 'rect', x: cx - r - 9, y: cy + k * r - 7, w: 12, h: 14 }} fill={Pa.grey} roughness={0.6} progress={P(0.9 + i * 0.04, 1)} />
        ))}
      </g>
    );
  };

/**
 * An open ledger on a pedestal: the pedestal rises from `baseY`, the book's two pages meet at the spine with their
 * outer corners curved up, three ruled lines per page. Centred on `cx`. Draws on pedestal -> pages -> spine -> lines.
 */
export const Ledger: React.FC<{ cx: number; baseY: number; w?: number; t: number; pen: Pen; seed: number; dur?: number; linesOpacity?: number }> =
  ({ cx, baseY, w = 124, t, pen, seed, dur = 0.9, linesOpacity = 1 }) => {
    if (t <= 0) return null;
    const s = seed * 10, P = stager(t, dur), Pa = pen.palette;
    const hw = w / 2, cy = baseY - 118;
    const left = `M ${cx} ${cy + 32} L ${cx - hw} ${cy + 38} L ${cx - hw} ${cy - 26} Q ${cx - hw * 0.5} ${cy - 40} ${cx} ${cy - 30} Z`;
    const right = `M ${cx} ${cy + 32} L ${cx + hw} ${cy + 38} L ${cx + hw} ${cy - 26} Q ${cx + hw * 0.5} ${cy - 40} ${cx} ${cy - 30} Z`;
    return (
      <g>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'rect', x: cx - 16, y: cy + 36, w: 32, h: baseY - (cy + 36) }} fill={Pa.grey} progress={P(0, 0.22)} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'rect', x: cx - 40, y: cy + 30, w: 80, h: 10 }} fill={Pa.grey} roughness={0.7} progress={P(0.18, 0.3)} />
        <Sketch pen={pen} seed={s + 3} shape={{ kind: 'path', d: left }} fill={pen.light} progress={P(0.28, 0.52)} />
        <Sketch pen={pen} seed={s + 4} shape={{ kind: 'path', d: right }} fill={pen.light} progress={P(0.4, 0.64)} />
        <Sketch pen={pen} seed={s + 5} shape={{ kind: 'line', x1: cx, y1: cy - 30, x2: cx, y2: cy + 32 }} roughness={0.5} progress={P(0.62, 0.7)} />
        {/* the ruled lines; `linesOpacity` lets a scene knock them out behind something written on the page (a slip, a token) */}
        {linesOpacity > 0 && [0, 1, 2].map((i) => {
          const ly = cy - 12 + i * 15, a = 0.7 + i * 0.08;
          return (
            <g key={i} opacity={linesOpacity}>
              <Sketch pen={pen} seed={s + 10 + i} shape={{ kind: 'line', x1: cx - hw + 12, y1: ly + 2, x2: cx - 10, y2: ly }} strokeWidth={1.5} roughness={0.5} progress={P(a, a + 0.1)} />
              <Sketch pen={pen} seed={s + 20 + i} shape={{ kind: 'line', x1: cx + 10, y1: ly, x2: cx + hw - 12, y2: ly + 2 }} strokeWidth={1.5} roughness={0.5} progress={P(a + 0.05, a + 0.15)} />
            </g>
          );
        })}
      </g>
    );
  };

/**
 * A rail track leaving (x, y) (the plinth's right edge at ground level) and RECEDING to the upper right in perspective:
 * two rails converge toward a far point `len` away and `rise` up, the sleepers lie BETWEEN the rails (never past them)
 * and shorten, thin and crowd as they recede. Draws on near rail -> far rail -> sleepers near to far over `dur`.
 * (The first version, a flat track with posts crossing both rails, read as a FENCE on the 2026-11-04 still, which the
 * quant brief forbids; a track seen in perspective cannot.)
 * `overhang` (fraction of the local rail gap) makes every sleeper stick out PAST both rails on each side, and `heavy`
 * adds to the rails' stroke: with the sleepers stopping at the rails the object read as a LADDER lying on a lawn
 * (visual-qa on quant WB3, 2026-11-04); real sleepers are wider than the gauge. Both default to 0 so the beats
 * already shipped keep their frames (quant WB12); a new beat passes `overhang={0.25} heavy={1.4}`.
 */
export const RailTrack: React.FC<{ x: number; y: number; len?: number; rise?: number; gap?: number; t: number; pen: Pen; seed: number; dur?: number; overhang?: number; heavy?: number }> =
  ({ x, y, len = 280, rise = 80, gap = 30, t, pen, seed, dur = 0.7, overhang = 0, heavy = 0 }) => {
    if (t <= 0) return null;
    const s = seed * 10, P = stager(t, dur);
    const top0: [number, number] = [x, y - gap - 4], bot0: [number, number] = [x, y - 4];
    const top1: [number, number] = [x + len, y - rise - 4], bot1: [number, number] = [x + len, y - rise + 4];
    const at = (a: [number, number], b: [number, number], u: number): [number, number] => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
    const us = [0.03, 0.17, 0.3, 0.42, 0.53, 0.63, 0.72, 0.8, 0.87, 0.93];
    return (
      <g>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'line', x1: bot0[0], y1: bot0[1], x2: bot1[0], y2: bot1[1] }} strokeWidth={pen.inkWidth + 0.4 + heavy} progress={easeOut(P(0, 0.45))} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'line', x1: top0[0], y1: top0[1], x2: top1[0], y2: top1[1] }} strokeWidth={pen.inkWidth + 0.4 + heavy} progress={easeOut(P(0.1, 0.55))} />
        {us.map((u, i) => {
          const a = at(top0, top1, u), b = at(bot0, bot1, u), st = 0.45 + (i / us.length) * 0.5;
          // the sleeper runs from `oh` px above the top rail to `oh` px below the bottom rail (0 = between the rails)
          const oh = overhang * (b[1] - a[1]);
          const y1 = overhang > 0 ? a[1] - oh : a[1] + 1, y2 = overhang > 0 ? b[1] + oh : b[1] - 1;
          return <Sketch key={i} pen={pen} seed={s + 10 + i} shape={{ kind: 'line', x1: a[0], y1, x2: b[0], y2 }} strokeWidth={(pen.inkWidth + 1.8) * (1 - 0.6 * u)} roughness={0.5 * (1 - u) + 0.2} progress={P(st, st + 0.08)} />;
        })}
      </g>
    );
  };

/**
 * A rail track whose sleepers are filled wooden PLANKS lying under two heavy rails, seen in 3/4 perspective: the track
 * leaves (x, y) (the near centre, in the floor band beside the plinth) and recedes to (x + len, y - rise); the two rails
 * are offset from the centre line along the sleeper direction, which LEANS at `lean` degrees from the horizontal (a
 * "\" slant: the far rail sits up-left of the near rail), so no stroke is vertical and nothing reads as a post. The gauge
 * converges `gap` -> `gapFar`, every plank is `overhang` (a fraction of the local gauge) longer than the gauge on each
 * side and `thick` px along the track at the near end (thinning as it recedes), filled with the pen's `brown` role (wood)
 * and drawn BEFORE the rails so the rails lie on top. Draws on planks near to far -> near rail -> far rail over `dur`.
 * (visual-qa on quant WB12, 2026-11-05: `RailTrack`'s stroked sleepers crossing two near-flat rails read as a FENCE
 * in perspective, the anatomy of WB2's picket fence, which that brief forbids; slanted filled planks under the rails
 * cannot. `RailTrack` keeps its frames for the beats that shipped on it.)
 * A track that recedes to the LEFT (quant WB7: the rails come from off the left edge into the harbour gate) is the same
 * component with a NEGATIVE `len` and `lean` = 180 - 59 = 121 (the mirror image: a "/" slant, the far rail up-RIGHT of
 * the near rail); no transform needed, so the scene's coordinates stay plain.
 */
export const PlankTrack: React.FC<{
  x: number; y: number; len?: number; rise?: number; gap?: number; gapFar?: number; overhang?: number; lean?: number; thick?: number; heavy?: number;
  t: number; pen: Pen; seed: number; dur?: number; color?: string;
}> = ({ x, y, len = 280, rise = 20, gap = 34, gapFar = 10, overhang = 0.25, lean = 59, thick = 12, heavy = 1.6, t, pen, seed, dur = 0.7, color }) => {
  if (t <= 0) return null;
  type P2 = [number, number];
  const s = seed * 10, P = stager(t, dur);
  const dx = len, dy = -rise, dl = Math.hypot(dx, dy), d: P2 = [dx / dl, dy / dl];
  const a = (lean * Math.PI) / 180, u: P2 = [-Math.cos(a), -Math.sin(a)]; // from the near rail toward the far rail: up-left
  const C = (v: number): P2 => [x + dx * v, y + dy * v];
  const g = (v: number) => gap + (gapFar - gap) * v;
  const railPt = (v: number, side: number): P2 => { const c = C(v), h = (side * g(v)) / 2; return [c[0] + u[0] * h, c[1] + u[1] * h]; };
  const vs = [0.03, 0.15, 0.27, 0.38, 0.48, 0.57, 0.65, 0.72, 0.79, 0.85, 0.91, 0.96];
  const railW = pen.inkWidth + 0.4 + heavy;
  return (
    <g>
      {vs.map((v, i) => {
        const c = C(v), L = g(v) * (1 + 2 * overhang), w = thick * (1 - 0.65 * v), st = (i / vs.length) * 0.5;
        const pts: P2[] = [
          [c[0] + u[0] * L / 2 + d[0] * w / 2, c[1] + u[1] * L / 2 + d[1] * w / 2],
          [c[0] + u[0] * L / 2 - d[0] * w / 2, c[1] + u[1] * L / 2 - d[1] * w / 2],
          [c[0] - u[0] * L / 2 - d[0] * w / 2, c[1] - u[1] * L / 2 - d[1] * w / 2],
          [c[0] - u[0] * L / 2 + d[0] * w / 2, c[1] - u[1] * L / 2 + d[1] * w / 2],
        ];
        return <Sketch key={i} pen={pen} seed={s + 10 + i} shape={{ kind: 'polygon', pts }} fill={color ?? pen.palette.brown} strokeWidth={pen.inkWidth * 0.8} roughness={0.45 * (1 - v) + 0.15} progress={P(st, st + 0.08)} />;
      })}
      <Sketch pen={pen} seed={s + 1} shape={{ kind: 'line', x1: railPt(0, -1)[0], y1: railPt(0, -1)[1], x2: railPt(1, -1)[0], y2: railPt(1, -1)[1] }} strokeWidth={railW} roughness={0.5} progress={easeOut(P(0.5, 0.82))} />
      <Sketch pen={pen} seed={s + 2} shape={{ kind: 'line', x1: railPt(0, 1)[0], y1: railPt(0, 1)[1], x2: railPt(1, 1)[0], y2: railPt(1, 1)[1] }} strokeWidth={railW} roughness={0.5} progress={easeOut(P(0.6, 0.92))} />
    </g>
  );
};

/**
 * The software-layer band: a floating pill (x, y, w, h), white, outlined in the pen's `red` role (the highlighted thing),
 * with a faint drop shadow under it so it floats (`shadow` 0..1 scales the shadow: the scene fades it out as the band
 * LANDS on what it sits on). The scene types the label onto it.
 */
export const LayerBand: React.FC<{ x: number; y: number; w: number; h: number; t: number; pen: Pen; seed: number; color?: string; dur?: number; shadow?: number }> =
  ({ x, y, w, h, t, pen, seed, color, dur = 0.7, shadow = 1 }) => {
    if (t <= 0) return null;
    const c = color ?? pen.palette.red, p = easeOut(prog(t, 0, dur));
    return (
      <g>
        <ellipse cx={x + w / 2} cy={y + h + 26} rx={w * 0.46} ry={9} fill="#000000" opacity={0.06 * p * shadow} />
        <Sketch pen={pen} seed={seed} shape={{ kind: 'path', d: rrect(x, y, w, h, h / 2) }} fill={pen.light} stroke={c} strokeWidth={pen.inkWidth + 1.8} progress={p} />
      </g>
    );
  };

/** an orange thread: a quadratic curve from p0 to p2 bent by p1, drawn over `dur`, a dot where it lands */
export const Thread: React.FC<{ p0: [number, number]; p1: [number, number]; p2: [number, number]; t: number; pen: Pen; seed: number; color?: string; dur?: number }> =
  ({ p0, p1, p2, t, pen, seed, color, dur = 0.5 }) => {
    if (t <= 0) return null;
    const c = color ?? pen.palette.red, p = easeOut(prog(t, 0, dur));
    return (
      <g>
        <Sketch pen={pen} seed={seed} shape={{ kind: 'path', d: `M ${p0[0]} ${p0[1]} Q ${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]}` }} stroke={c} strokeWidth={pen.inkWidth + 1} roughness={0.6} progress={p} />
        {p >= 1 && <circle cx={p2[0]} cy={p2[1]} r={5} fill={c} />}
      </g>
    );
  };

/**
 * A row of `n` chain-linked blocks (a blockchain): each block a cube (front face blue, top light, side grey) centred on
 * (cx + i * step, cy); between neighbours two overlapping chain links. Block i draws at i * stagger, its link after it.
 */
export const ChainBlocks: React.FC<{ cx: number; cy: number; n?: number; step?: number; size?: number; t: number; pen: Pen; seed: number; stagger?: number; dur?: number }> =
  ({ cx, cy, n = 3, step = 135, size = 72, t, pen, seed, stagger = 0.3, dur = 0.45 }) => {
    if (t <= 0) return null;
    const s = seed * 10, Pa = pen.palette, h = size / 2, d = 18;
    return (
      <g>
        {Array.from({ length: n }).map((_, i) => {
          const x = cx + i * step, tt = t - i * stagger;
          if (tt <= 0) return null;
          const P = stager(tt, dur);
          const top: [number, number][] = [[x - h, cy - h], [x - h + d, cy - h - d], [x + h + d, cy - h - d], [x + h, cy - h]];
          const side: [number, number][] = [[x + h, cy - h], [x + h + d, cy - h - d], [x + h + d, cy + h - d], [x + h, cy + h]];
          const lk = t - i * stagger - dur * 0.8;
          return (
            <g key={i}>
              <Sketch pen={pen} seed={s + 10 + i} shape={{ kind: 'rect', x: x - h, y: cy - h, w: size, h: size }} fill={Pa.blue} progress={P(0, 0.5)} />
              <Sketch pen={pen} seed={s + 20 + i} shape={{ kind: 'polygon', pts: top }} fill={pen.light} roughness={0.8} progress={P(0.4, 0.75)} />
              <Sketch pen={pen} seed={s + 30 + i} shape={{ kind: 'polygon', pts: side }} fill={Pa.grey} roughness={0.8} progress={P(0.6, 1)} />
              {i < n - 1 && lk > 0 && [0, 1].map((k) => (
                <Sketch key={k} pen={pen} seed={s + 40 + i * 2 + k} shape={{ kind: 'ellipse', cx: x + h + d + 10 + k * 22, cy: cy + 8, rx: 15, ry: 8 }} strokeWidth={pen.inkWidth * 0.9} roughness={0.6} progress={easeOut(prog(lk, k * 0.12, 0.25))} />
              ))}
            </g>
          );
        })}
      </g>
    );
  };

/**
 * A coin network (digital money): a hub coin at (cx, cy) with `n` satellite coins on a ring of radius `ring`, each wired
 * to the hub. Gold = money. The hub pops first, then wire + satellite pairs clockwise from the top.
 */
export const CoinNetwork: React.FC<{ cx: number; cy: number; r?: number; ring?: number; n?: number; t: number; pen: Pen; seed: number; dur?: number }> =
  ({ cx, cy, r = 32, ring = 84, n = 5, t, pen, seed, dur = 1.0 }) => {
    if (t <= 0) return null;
    const s = seed * 10, Pa = pen.palette, k = pop(prog(t, 0, 0.3));
    return (
      <g>
        {Array.from({ length: n }).map((_, i) => {
          const a = -Math.PI / 2 + (Math.PI * 2 * i) / n, sx = cx + Math.cos(a) * ring, sy = cy + Math.sin(a) * ring;
          const tt = t - 0.25 - (i * (dur - 0.45)) / n;
          if (tt <= 0) return null;
          const kk = pop(prog(tt, 0.1, 0.3));
          return (
            <g key={i}>
              <Sketch pen={pen} seed={s + 10 + i} shape={{ kind: 'line', x1: cx + Math.cos(a) * (r + 2), y1: cy + Math.sin(a) * (r + 2), x2: sx - Math.cos(a) * 18, y2: sy - Math.sin(a) * 18 }} strokeWidth={pen.inkWidth * 0.9} roughness={0.6} progress={easeOut(prog(tt, 0, 0.2))} />
              <g transform={`translate(${sx} ${sy}) scale(${kk}) translate(${-sx} ${-sy})`}>
                <Sketch pen={pen} seed={s + 20 + i} shape={{ kind: 'circle', cx: sx, cy: sy, r: 16 }} fill={Pa.gold} roughness={0.6} />
                <Sketch pen={pen} seed={s + 30 + i} shape={{ kind: 'circle', cx: sx, cy: sy, r: 11 }} strokeWidth={pen.inkWidth * 0.6} roughness={0.5} />
              </g>
            </g>
          );
        })}
        <g transform={`translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})`}>
          <Sketch pen={pen} seed={s + 1} shape={{ kind: 'circle', cx, cy, r }} fill={Pa.gold} roughness={0.6} />
          <Sketch pen={pen} seed={s + 2} shape={{ kind: 'circle', cx, cy, r: r * 0.74 }} strokeWidth={pen.inkWidth * 0.7} roughness={0.5} />
        </g>
      </g>
    );
  };

/**
 * A hanging tag: a string from (x, y0) down to the tag's hole, then the tag (a rounded card `w` x `h` with a punched
 * hole), the scene draws the icon inside it. Draws on string -> card -> hole over `dur`. The string is painted AFTER the
 * card so it runs over the card body into the hole (a string that stops at the card's edge reads as glued on, the
 * left-behind WB3 lesson); the hole is painted last.
 */
export const HangTag: React.FC<{ x: number; y0: number; drop?: number; w?: number; h?: number; t: number; pen: Pen; seed: number; dur?: number; children?: React.ReactNode }> =
  ({ x, y0, drop = 70, w = 120, h = 140, t, pen, seed, dur = 0.45, children }) => {
    if (t <= 0) return null;
    const s = seed * 10, P = stager(t, dur), top = y0 + drop;
    return (
      <g>
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'path', d: rrect(x - w / 2, top, w, h, 14) }} fill={pen.light} progress={P(0.3, 0.85)} />
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'line', x1: x, y1: y0, x2: x, y2: top + 16 }} strokeWidth={pen.inkWidth * 0.8} roughness={0.6} progress={easeOut(P(0, 0.4))} />
        <Sketch pen={pen} seed={s + 3} shape={{ kind: 'circle', cx: x, cy: top + 16, r: 5.5 }} fill={pen.light} roughness={0.4} progress={P(0.82, 1)} />
        {P(0.85, 1) > 0 && children}
      </g>
    );
  };

/** a globe: a disc (green = the world), one vertical meridian ellipse, the equator, two latitude arcs; draws on over `dur` */
export const Globe: React.FC<{ cx: number; cy: number; r?: number; t: number; pen: Pen; seed: number; dur?: number }> =
  ({ cx, cy, r = 38, t, pen, seed, dur = 0.8 }) => {
    if (t <= 0) return null;
    const s = seed * 10, P = stager(t, dur), Pa = pen.palette, lat = r * 0.5, lx = Math.sqrt(r * r - lat * lat);
    return (
      <g>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'circle', cx, cy, r }} fill={Pa.green} progress={P(0, 0.4)} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'ellipse', cx, cy, rx: r * 0.42, ry: r }} strokeWidth={pen.inkWidth * 0.8} roughness={0.6} progress={P(0.35, 0.65)} />
        <Sketch pen={pen} seed={s + 3} shape={{ kind: 'line', x1: cx - r, y1: cy, x2: cx + r, y2: cy }} strokeWidth={pen.inkWidth * 0.8} roughness={0.5} progress={P(0.6, 0.78)} />
        <Sketch pen={pen} seed={s + 4} shape={{ kind: 'path', d: `M ${cx - lx} ${cy - lat} Q ${cx} ${cy - lat - 8} ${cx + lx} ${cy - lat}` }} strokeWidth={pen.inkWidth * 0.7} roughness={0.5} progress={P(0.74, 0.88)} />
        <Sketch pen={pen} seed={s + 5} shape={{ kind: 'path', d: `M ${cx - lx} ${cy + lat} Q ${cx} ${cy + lat + 8} ${cx + lx} ${cy + lat}` }} strokeWidth={pen.inkWidth * 0.7} roughness={0.5} progress={P(0.84, 1)} />
      </g>
    );
  };

/** a dotted path from (x1, y1) to (x2, y2) revealed along its direction, then an open arrowhead at its end; `head={0}` = no
 * arrowhead, the dots run the full length over `dur` (a path that leads OFF the canvas edge) */
export const DottedArrow: React.FC<{ x1: number; y1: number; x2: number; y2: number; t: number; pen: Pen; seed: number; color?: string; dur?: number; head?: number; strokeWidth?: number; tail?: number }> =
  ({ x1, y1, x2, y2, t, pen, seed, color, dur = 0.9, head = 28, strokeWidth, tail }) => {
    if (t <= 0) return null;
    const c = color ?? pen.ink, sw = strokeWidth ?? pen.inkWidth + 2.5;
    const L = Math.hypot(x2 - x1, y2 - y1), ang = Math.atan2(y2 - y1, x2 - x1), deg = (ang * 180) / Math.PI;
    const noHead = head <= 0, hh = Math.max(head, 12);
    const p = easeOut(prog(t, 0, noHead ? dur : dur * 0.8));
    const hx = x2 - 6 * Math.cos(ang), hy = y2 - 6 * Math.sin(ang);
    const gap = tail ?? head * 0.6;                   // the dots stop `tail` px short of the tip (default 0.6 head; a dot inside the chevron reads cluttered)
    const hd = `M ${hx - head * Math.cos(ang - 0.5)} ${hy - head * Math.sin(ang - 0.5)} L ${hx} ${hy} L ${hx - head * Math.cos(ang + 0.5)} ${hy - head * Math.sin(ang + 0.5)}`;
    const clipId = `dotted-${seed}`;
    return (
      <g>
        <defs>
          <clipPath id={clipId}>
            <rect x={x1 - 8} y={y1 - hh - 8} width={(L + 16) * p} height={2 * hh + 16} transform={`rotate(${deg} ${x1} ${y1})`} />
          </clipPath>
        </defs>
        <line x1={x1} y1={y1} x2={x2 - gap * Math.cos(ang)} y2={y2 - gap * Math.sin(ang)} stroke={c} strokeWidth={sw} strokeDasharray="0.5 16" strokeLinecap="round" clipPath={`url(#${clipId})`} />
        {!noHead && <Sketch pen={pen} seed={seed} shape={{ kind: 'path', d: hd }} stroke={c} strokeWidth={pen.inkWidth + 1.2} progress={easeOut(prog(t, dur * 0.72, dur * 0.28))} />}
      </g>
    );
  };

// ---------------------------------------------------------------------------------------------------------------------
// added 2026-11-05 for the quant beat WB11 ("a layer the banks are actually letting into the building": a door opens on
// every bank; "Quant is the one holding the contracts": two contract sheets stand on the layer band)

/**
 * Geometry of a BankFacade's ENTRANCE as it lands on the canvas when the facade is drawn at scale `k` about its base
 * (cx, gy) (the kit's island bank = BankFacade at 0.3 inside an island scaled 1 or 0.5, so k = 0.3 or 0.15): the door's
 * half-width, height, arch and jamb heights, its base line (the top step) and top. The default facade's door is 84 x 162
 * (a 52 px arch over a 110 px jamb) in the middle bay; a facade drawn with a narrower bay fits its own door (see
 * BankFacade) and this helper does not model that case.
 */
export const doorGeom = (cx: number, gy: number, k = 1) => {
  const hw = 42 * k, h = 162 * k, arch = 52 * k, jamb = h - arch, base = gy - 56 * k;
  return { hw, h, arch, jamb, base, top: base - h, left: cx - hw, right: cx + hw };
};

/**
 * A bank's door OPENING: drawn over a BankFacade's entrance (the facade is painted first; this sits on top). The arch
 * darkens to the interior (the pen's dark at 60 percent, fading in over the first half of `dur`) and the door leaf (the
 * entrance's own blue) swings OUT toward the viewer about its left jamb: its far edge travels from the right jamb,
 * through edge-on, to 1.4 half-widths left of the hinge, the top and bottom lifting a little for the perspective (the
 * office.tsx Building's open leaf). A knob dot appears on the far edge once the leaf is past half open (skipped on a
 * leaf under ~10 px: noise). `k` = the facade's canvas scale (see doorGeom); the leaf's stroke is the pen's full width
 * (the island bank's lines are full width too: scaledPen divides, the group scale multiplies back).
 */
export const DoorOpen: React.FC<{ cx: number; gy: number; k?: number; t: number; pen: Pen; seed: number; dur?: number }> =
  ({ cx, gy, k = 1, t, pen, seed, dur = 0.45 }) => {
    if (t <= 0) return null;
    const s = seed * 10, g = doorGeom(cx, gy, k), Pa = pen.palette;
    const o = easeOut(prog(t, dur * 0.2, dur * 0.8));          // the swing
    const dk = easeOut(prog(t, 0, dur * 0.5));                 // the opening darkens
    const opening = `M ${g.left} ${g.base} L ${g.left} ${g.base - g.jamb} Q ${g.left} ${g.top} ${cx} ${g.top} Q ${g.right} ${g.top} ${g.right} ${g.base - g.jamb} L ${g.right} ${g.base} Z`;
    const far = g.left + 2 * g.hw * (1 - o) - 1.4 * g.hw * o, lift = 0.15 * g.jamb * o;
    const leaf: [number, number][] = [[g.left, g.base - g.jamb], [far, g.base - g.jamb - lift], [far, g.base - lift], [g.left, g.base]];
    return (
      <g>
        <path d={opening} fill={pen.dark} opacity={0.6 * dk} />
        {Math.abs(far - g.left) > 1.5 && (
          <Sketch pen={pen} seed={s + 1} shape={{ kind: 'polygon', pts: leaf }} fill={Pa.blue} roughness={0.5} strokeWidth={pen.inkWidth * 0.9} />
        )}
        {o > 0.5 && g.hw > 10 && <circle cx={far + (far < g.left ? 3 : -3)} cy={g.base - g.jamb / 2 - lift / 2} r={Math.max(1.6, g.hw * 0.14)} fill={pen.ink} />}
      </g>
    );
  };

/**
 * A contract sheet STANDING on a line (its bottom edge on `bottom`, centred on `cx`), `w` x `h`: a portrait sheet (the
 * pen's light) with a folded top-right corner (grey back), two ruled lines in its upper part (the clauses) and a
 * signature line near the foot; the scene writes the contract's name on it (children, from 60 percent of `dur`,
 * centred on `cx`, baseline ~`bottom - 26` for a 24 px label). Pops in over 0.3 s about its base (it lands on the
 * line), the lines draw after.
 */
export const ContractSheet: React.FC<{ cx: number; bottom: number; w?: number; h?: number; t: number; pen: Pen; seed: number; dur?: number; children?: React.ReactNode }> =
  ({ cx, bottom, w = 84, h = 92, t, pen, seed, dur = 0.4, children }) => {
    if (t <= 0) return null;
    const s = seed * 10, k = pop(prog(t, 0, 0.3)), P = stager(t, dur), x = cx - w / 2, y = bottom - h, f = 16;
    const sheet = `M ${x} ${y} L ${x + w - f} ${y} L ${x + w} ${y + f} L ${x + w} ${bottom} L ${x} ${bottom} Z`;
    const fold = `M ${x + w - f} ${y} L ${x + w - f} ${y + f} L ${x + w} ${y + f} Z`;
    return (
      <g transform={`translate(${cx} ${bottom}) scale(${k}) translate(${-cx} ${-bottom})`}>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'path', d: sheet }} fill={pen.light} roughness={0.6} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'path', d: fold }} fill={pen.palette.grey} roughness={0.5} strokeWidth={pen.inkWidth * 0.8} />
        {[0, 1].map((i) => (
          <Sketch key={i} pen={pen} seed={s + 3 + i} shape={{ kind: 'line', x1: x + 12, y1: y + 22 + i * 12, x2: x + w - (i === 0 ? 28 : 14), y2: y + 22 + i * 12 }} strokeWidth={1.5} roughness={0.4} progress={easeOut(P(0.45 + i * 0.15, 0.7 + i * 0.15))} />
        ))}
        <Sketch pen={pen} seed={s + 5} shape={{ kind: 'line', x1: x + 12, y1: bottom - 12, x2: x + w - 12, y2: bottom - 12 }} strokeWidth={1.3} roughness={0.4} progress={easeOut(P(0.8, 1))} />
        {P(0.6, 1) > 0 && children}
      </g>
    );
  };

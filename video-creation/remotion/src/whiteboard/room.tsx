// whiteboard/room.tsx: the ROOM / EXIT part of the hand-drawn vocabulary (added 2026-11-25 for the longest-bear beat
// `the-squeeze`, "a room full of coins; money flows out through two doors; a question mark over rates"): a room seen
// from inside in one-point perspective (the back wall, the four corner edges running out toward the viewer, floorboards
// along the same rays), a panel door standing on the back wall's floor line that SWINGS OPEN into the room (and a GHOST
// door: the same frame in dashes, a way out nobody can measure), a Bitcoin coin for a no-fill pen that can be carried,
// rolled, scaled and faded every frame, and the layout of a mound of such coins.
//
// Kit conventions (video-creation/whiteboard/whiteboard.md): every component takes the pen and a LOCAL time `t`
// (seconds since its cue; <= 0 = not yet) and draws itself on part by part over `dur` through Sketch progress; fixed
// seeds (no boil, identical across render workers); role colors from the pen's palette (gold = money, the ink = the
// room, grey = the background / the uncertain thing); draw order = what hides what. Authored on a NEON pen (neon-ink:
// no fills, every part passes its `stroke`), so nothing here relies on a fill hiding what is behind it: a coin paints
// a disc of the PAGE colour under itself (`knock`) and that is the only occlusion.
// Geometry was studied from references before drawing (the Lucide icon set, ISC, fetched and read as path data):
// `door-closed` = a frame with rounded top corners about 14 x 18, a floor line WIDER than the door, a knob dot at
// mid-height on the latch side; `door-open` = the leaf a quad hinged on one jamb whose free edge is TALLER than its
// hinge edge (it is nearer the viewer), the frame still standing, the floor line carrying on both sides; `coins` = a
// disc with a mark, a second disc behind it showing only its uncovered arc (a pile is discs covering discs);
// `bitcoin` = a B on a stem, one more short tick beside the stem at the top and at the bottom, short serifs left of
// the stem. A room interior = the back wall as a rectangle, its four corner edges on rays from ONE vanishing point,
// the floorboards on the same rays. Then iterated on the beat's stills.
import React from 'react';
import type { Pen } from './pen';
import { Sketch, prog, easeOut, pop } from './Sketch';
import { wobbleD } from './funnel';

/** stage helper: progress of stage a..b (fractions of `dur`) at local time `t` */
const stager = (t: number, dur: number) => (a: number, b: number) => prog(t, a * dur, (b - a) * dur);
const F = (v: number) => Math.round(v * 100) / 100;
/** a small seeded generator (0..1), the kit's LCG */
const lcg = (seed: number) => { let r = (seed * 9301 + 49297) % 233280; return () => { r = (r * 9301 + 49297) % 233280; return r / 233280; }; };

/** the room's camera: the vanishing point on the canvas and the viewer's distance from the back wall (canvas px at the wall's scale) */
export type RoomView = { vp: [number, number]; D: number };
export type RoomBox = { x0: number; x1: number; y0: number; y1: number };

/** a point of the back wall's plane (x, y) brought `z` px TOWARD the viewer, in one-point perspective */
export const roomProj = (v: RoomView, x: number, y: number, z = 0): [number, number] => {
  const s = v.D / (v.D - z);
  return [v.vp[0] + (x - v.vp[0]) * s, v.vp[1] + (y - v.vp[1]) * s];
};

/** where the ray from the vanishing point through (x, y) leaves `box` (a corner edge or a floorboard ends there, inside the frame) */
export const roomRayEnd = (v: RoomView, x: number, y: number, box: RoomBox): [number, number] => {
  const dx = x - v.vp[0], dy = y - v.vp[1];
  let k = Infinity;
  if (dx > 0) k = Math.min(k, (box.x1 - v.vp[0]) / dx); else if (dx < 0) k = Math.min(k, (box.x0 - v.vp[0]) / dx);
  if (dy > 0) k = Math.min(k, (box.y1 - v.vp[1]) / dy); else if (dy < 0) k = Math.min(k, (box.y0 - v.vp[1]) / dy);
  return [v.vp[0] + dx * k, v.vp[1] + dy * k];
};

/**
 * A room seen from inside: the back wall (`x0..x1`, `top..gy`, its floor line at `gy`), the four corner edges running
 * out from its corners along the rays of `view.vp` until they leave `box` (so nothing reaches the frame edge), and
 * floorboards from the floor line along the same rays (`boards` = their x on the floor line), faint. Every stroke
 * longer than ~200 px is a run of short pieces on a seeded walk (a long rough.js line is ruler-straight) drawn as one
 * pen stroke. Draws on floor line -> corners -> ceiling -> corner edges, the boards fanning out meanwhile, over `dur`.
 */
export const RoomShell: React.FC<{
  x0: number; x1: number; top: number; gy: number; view: RoomView; box: RoomBox; boards?: number[];
  t: number; pen: Pen; seed: number; dur?: number; color?: string; boardColor?: string; boardOpacity?: number;
}> = ({ x0, x1, top, gy, view, box, boards = [], t, pen, seed, dur = 1.2, color, boardColor, boardOpacity = 0.6 }) => {
  if (t <= 0) return null;
  const s = seed * 100, P = stager(t, dur), c = color ?? pen.ink, sw = pen.inkWidth + 0.6, nb = Math.max(1, boards.length);
  const corners: [number, number][] = [[x0, gy], [x1, gy], [x0, top], [x1, top]];
  // every stroke starts where an earlier one already stands (never a piece floating on its own): the floor line left to
  // right, the left corner up from its start, the right corner up once the floor line has reached it, the ceiling across
  // from the left corner's top, then the four corner edges
  return (
    <g>
      {boards.map((bx, i) => {
        const e = roomRayEnd(view, bx, gy, box), a = 0.4 + (i / nb) * 0.3;
        return (
          <Sketch key={i} pen={pen} seed={s + 40 + i} shape={{ kind: 'path', d: wobbleD(bx, gy + 4, e[0], e[1], s + 40 + i, 110, 1.6) }} stroke={boardColor ?? pen.palette.grey}
            strokeWidth={1.6} roughness={0.5} opacity={boardOpacity} progress={easeOut(P(a, a + 0.25))} sequential />
        );
      })}
      <Sketch pen={pen} seed={s + 1} shape={{ kind: 'path', d: wobbleD(x0, gy, x1, gy, s + 1, 150, 2.5) }} stroke={c} strokeWidth={sw} roughness={0.8} progress={easeOut(P(0, 0.36))} sequential />
      <Sketch pen={pen} seed={s + 2} shape={{ kind: 'path', d: wobbleD(x0, gy, x0, top, s + 2, 140, 2.2) }} stroke={c} strokeWidth={sw} roughness={0.8} progress={easeOut(P(0.1, 0.42))} sequential />
      <Sketch pen={pen} seed={s + 3} shape={{ kind: 'path', d: wobbleD(x1, gy, x1, top, s + 3, 140, 2.2) }} stroke={c} strokeWidth={sw} roughness={0.8} progress={easeOut(P(0.36, 0.64))} sequential />
      <Sketch pen={pen} seed={s + 4} shape={{ kind: 'path', d: wobbleD(x0, top, x1, top, s + 4, 150, 2.5) }} stroke={c} strokeWidth={sw} roughness={0.8} progress={easeOut(P(0.42, 0.76))} sequential />
      {corners.map(([x, y], i) => {
        const e = roomRayEnd(view, x, y, box), a = i < 2 ? 0.4 + i * 0.26 : 0.74 + (i - 2) * 0.06;   // the floor's two, then the ceiling's two
        return <Sketch key={i} pen={pen} seed={s + 10 + i} shape={{ kind: 'line', x1: x, y1: y, x2: e[0], y2: e[1] }} stroke={c} strokeWidth={sw} roughness={0.8} progress={easeOut(P(a, a + 0.2))} />;
      })}
    </g>
  );
};

/** the dashes of a dashed stroke along a polyline: every side starts and ends on a dash, so the corners are drawn */
export const dashRun = (pts: [number, number][], dash = 22, gap = 14): [number, number, number, number][] => {
  const out: [number, number, number, number][] = [];
  for (let k = 0; k + 1 < pts.length; k++) {
    const [ax, ay] = pts[k], [bx, by] = pts[k + 1], len = Math.hypot(bx - ax, by - ay);
    const n = Math.max(1, Math.round((len + gap) / (dash + gap))), pitch = (len + gap) / n, dl = pitch - gap;
    for (let i = 0; i < n; i++) {
      const u0 = (i * pitch) / len, u1 = (i * pitch + dl) / len;
      out.push([ax + (bx - ax) * u0, ay + (by - ay) * u0, ax + (bx - ax) * u1, ay + (by - ay) * u1]);
    }
  }
  return out;
};

/** geometry of a RoomDoor standing on the back wall's floor line `gy`, centred on `cx`: the frame and the leaf inside it */
export const roomDoorGeom = (cx: number, gy: number, w = 190, h = 300, inset = 11) => {
  const x0 = cx - w / 2, x1 = cx + w / 2, top = gy - h;
  return { x0, x1, top, gy, cx, leafX0: x0 + inset, leafX1: x1 - inset, leafTop: top + inset, leafBottom: gy - 2 };
};

/**
 * A door in the room's back wall, seen from inside the room: a frame with rounded top corners standing on the floor
 * line `gy`, and in it a panel door (two inset panels, a knob on the latch side). `openT` (seconds since its own cue)
 * SWINGS THE LEAF OPEN into the room about its `hinge` jamb up to `maxAngle` degrees: the leaf is a real plane turned
 * in the room's perspective (`view`), so it narrows to its edge and comes out on the far side of its hinge, taller at
 * its free edge (it is nearer the viewer), and the doorway stands clear. Hinge it on the jamb AWAY from the vanishing
 * point and the open leaf lands on the wall beside the frame, outside the doorway. The leaf paints the page colour
 * under itself (open, it stands in front of the wall: the floor line and its own jamb do not show through it); edge-on
 * it is one stroke, never nothing.
 * `ghost` draws the frame alone in DASHES (hand-drawn dashes, each its own short stroke) with a knob: a door that may
 * or may not be there. Ink by default. Draws on frame -> leaf -> panels -> knob over `dur`.
 */
export const RoomDoor: React.FC<{
  cx: number; gy: number; w?: number; h?: number; view: RoomView; hinge?: 'left' | 'right'; t: number; openT?: number;
  pen: Pen; seed: number; color?: string; dur?: number; openDur?: number; maxAngle?: number; ghost?: boolean;
}> = ({ cx, gy, w = 190, h = 300, view, hinge = 'left', t, openT = -1, pen, seed, color, dur = 0.6, openDur = 0.6, maxAngle = 98, ghost = false }) => {
  if (t <= 0) return null;
  const s = seed * 100, P = stager(t, dur), c = color ?? pen.ink, g = roomDoorGeom(cx, gy, w, h), rc = 12;
  if (ghost) {
    const dashes = dashRun([[g.x0, gy], [g.x0, g.top], [g.x1, g.top], [g.x1, gy]]), n = dashes.length;
    return (
      <g>
        {dashes.map(([ax, ay, bx, by], i) => (
          <Sketch key={i} pen={pen} seed={s + i} shape={{ kind: 'line', x1: ax, y1: ay, x2: bx, y2: by }} stroke={c} strokeWidth={pen.inkWidth + 0.4} roughness={0.6}
            progress={prog(t, (i / n) * dur * 0.82, dur * 0.18)} />
        ))}
        <Sketch pen={pen} seed={s + 90} shape={{ kind: 'circle', cx: g.x1 - 34, cy: gy - h * 0.46, r: 6.5 }} stroke={c} strokeWidth={pen.inkWidth * 0.8} roughness={0.3} progress={P(0.84, 1)} />
      </g>
    );
  }
  const frame = `M ${g.x0} ${gy} L ${g.x0} ${g.top + rc} Q ${g.x0} ${g.top} ${g.x0 + rc} ${g.top} L ${g.x1 - rc} ${g.top} Q ${g.x1} ${g.top} ${g.x1} ${g.top + rc} L ${g.x1} ${gy}`;
  // the leaf: a plane hinged on one jamb, turned `ang` degrees toward the viewer; (u, v) = across from the hinge, down from the top.
  // The swing eases in AND out (a door starts slowly): with a plain ease-out the leaf was past half open on its second frame
  const sw = prog(openT, 0, openDur), ang = maxAngle * sw * sw * (3 - 2 * sw), th = (ang * Math.PI) / 180, cs = Math.cos(th), sn = Math.sin(th);
  const lw = g.leafX1 - g.leafX0, lh = g.leafBottom - g.leafTop;
  const xh = hinge === 'left' ? g.leafX0 : g.leafX1, dir = hinge === 'left' ? 1 : -1;
  const LP = (u: number, v: number) => roomProj(view, xh + dir * lw * u * cs, g.leafTop + v * lh, lw * u * sn);
  const quad = (u0: number, v0: number, u1: number, v1: number) => {
    const a = LP(u0, v0), b = LP(u1, v0), d = LP(u1, v1), e = LP(u0, v1);
    return `M ${F(a[0])} ${F(a[1])} L ${F(b[0])} ${F(b[1])} L ${F(d[0])} ${F(d[1])} L ${F(e[0])} ${F(e[1])} Z`;
  };
  const seen = Math.abs(LP(1, 0.5)[0] - LP(0, 0.5)[0]);          // the leaf's width as it lands on the canvas
  const pu = 20 / lw, kn = LP(1 - 22 / lw, 0.54), ks = view.D / (view.D - lw * (1 - 22 / lw) * sn);
  const rl = 0.55;                                               // ONE wobble for the leaf, closed, turning and open: its outline never jumps when the swing ends
  const e0 = LP(1, 0), e1 = LP(1, 1);                            // the free edge: all there is to see of a leaf turned edge-on
  return (
    <g>
      <Sketch pen={pen} seed={s + 1} shape={{ kind: 'path', d: frame }} stroke={c} strokeWidth={pen.inkWidth + 0.6} roughness={0.7} progress={easeOut(P(0, 0.45))} sequential />
      {/* the leaf is a solid panel: once its outline is in it paints the page colour under itself, so an OPEN leaf hides the floor
          line and the jamb behind it (as the coins do; inside a glow filter that fill lands a shade off the page, on every leaf alike) */}
      {(ang > 0 || P(0.3, 0.72) >= 1) && seen > 3 && <path d={quad(0, 0, 1, 1)} fill={pen.bg} />}
      {seen > 3
        ? <Sketch pen={pen} seed={s + 2} shape={{ kind: 'path', d: quad(0, 0, 1, 1) }} stroke={c} roughness={rl} progress={easeOut(P(0.3, 0.72))} sequential />
        : <Sketch pen={pen} seed={s + 6} shape={{ kind: 'line', x1: F(e0[0]), y1: F(e0[1]), x2: F(e1[0]), y2: F(e1[1]) }} stroke={c} strokeWidth={pen.inkWidth + 1} roughness={0.3} />}
      {seen > 34 && (
        <>
          <Sketch pen={pen} seed={s + 3} shape={{ kind: 'path', d: quad(pu, 22 / lh, 1 - pu, 0.5) }} stroke={c} strokeWidth={pen.inkWidth * 0.7} roughness={rl * 0.8} progress={easeOut(P(0.6, 0.86))} sequential />
          <Sketch pen={pen} seed={s + 4} shape={{ kind: 'path', d: quad(pu, 0.58, 1 - pu, 1 - 24 / lh) }} stroke={c} strokeWidth={pen.inkWidth * 0.7} roughness={rl * 0.8} progress={easeOut(P(0.68, 0.94))} sequential />
        </>
      )}
      {seen > 20 && <Sketch pen={pen} seed={s + 5} shape={{ kind: 'circle', cx: F(kn[0]), cy: F(kn[1]), r: F(6.5 * ks) }} stroke={c} roughness={0.3} progress={P(0.88, 1)} />}
    </g>
  );
};

/**
 * The Bitcoin mark for a coin of radius `r`, about the origin, as ONE path of pen strokes (never a font glyph that may
 * be missing): the stem, the two bowls (the lower one wider), short serifs left of the stem, and the two ticks above
 * and below. It fits inside the coin's inner ring at 0.76 r.
 */
export const btcMarkD = (r: number) => {
  const X = (v: number) => F((v * r) / 100);
  return `M ${X(-34)} ${X(-44)} L ${X(8)} ${X(-44)} C ${X(36)} ${X(-44)} ${X(36)} ${X(-3)} ${X(8)} ${X(-3)} `
    + `M ${X(-22)} ${X(-3)} L ${X(10)} ${X(-3)} C ${X(46)} ${X(-3)} ${X(46)} ${X(44)} ${X(10)} ${X(44)} L ${X(-34)} ${X(44)} `
    + `M ${X(-22)} ${X(-44)} L ${X(-22)} ${X(44)} `
    + `M ${X(-9)} ${X(-44)} L ${X(-9)} ${X(-61)} M ${X(9)} ${X(-44)} L ${X(9)} ${X(-61)} `
    + `M ${X(-9)} ${X(44)} L ${X(-9)} ${X(61)} M ${X(9)} ${X(44)} L ${X(9)} ${X(61)}`;
};

/**
 * A Bitcoin coin for a NO-FILL pen, centred (cx, cy), radius `r`: a bold rim, a thin concentric inner ring and the
 * DRAWN Bitcoin mark (`mark`), all in one colour (`color`, default the pen's gold = money). Its strokes are generated
 * once about the origin and the group is moved, so the scene can carry it every frame without the outline boiling:
 * `k` scales it about its centre (depth, a pop), `rot` turns it (degrees: a coin that ROLLS), `opacity` fades it (a
 * coin leaving the scene). `knock` (default on) paints a disc of the page colour under it, so it hides what it stands
 * in front of: a pile is coins painted back to front. `boost` 0..1 FLASHES it the way a neon tube brightens (when the
 * coin is named): the rim and the mark run hot (`hot`, a pale core over the same strokes) inside a soft wider halo of
 * their own colour. `t` pops it in over 0.3 s.
 */
export const BtcCoin: React.FC<{ cx: number; cy: number; r?: number; t?: number; pen: Pen; seed: number; color?: string; k?: number; rot?: number; opacity?: number; mark?: boolean; knock?: boolean; boost?: number; hot?: string }> =
  ({ cx, cy, r = 36, t = 99, pen, seed, color, k = 1, rot = 0, opacity = 1, mark = true, knock = true, boost = 0, hot = '#fff8d6' }) => {
    if (t <= 0 || opacity <= 0 || k <= 0) return null;
    const s = seed * 10, c = color ?? pen.palette.gold, kk = k * pop(prog(t, 0, 0.3));
    return (
      <g transform={`translate(${F(cx)} ${F(cy)}) scale(${Math.round(kk * 1000) / 1000}) rotate(${F(rot)})`} opacity={opacity}>
        {knock && <circle cx={0} cy={0} r={r + 1} fill={pen.bg} />}
        {boost > 0 && (
          <g opacity={0.3 * boost}>
            <Sketch pen={pen} seed={s + 1} shape={{ kind: 'circle', cx: 0, cy: 0, r }} stroke={c} strokeWidth={pen.inkWidth + 7} roughness={0.35} />
          </g>
        )}
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'circle', cx: 0, cy: 0, r }} stroke={c} strokeWidth={pen.inkWidth + 1.4} roughness={0.35} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'circle', cx: 0, cy: 0, r: r * 0.76 }} stroke={c} strokeWidth={pen.inkWidth * 0.5} roughness={0.2} />
        {mark && <Sketch pen={pen} seed={s + 3} shape={{ kind: 'path', d: btcMarkD(r) }} stroke={c} strokeWidth={pen.inkWidth * 0.95} roughness={0.25} />}
        {boost > 0 && (
          <g opacity={0.9 * boost}>
            <Sketch pen={pen} seed={s + 1} shape={{ kind: 'circle', cx: 0, cy: 0, r }} stroke={hot} strokeWidth={pen.inkWidth + 0.4} roughness={0.35} />
            {mark && <Sketch pen={pen} seed={s + 3} shape={{ kind: 'path', d: btcMarkD(r) }} stroke={hot} strokeWidth={pen.inkWidth * 0.95} roughness={0.25} />}
          </g>
        )}
      </g>
    );
  };

export type MoundCoin = { x: number; y: number; r: number; row: number; i: number; z: number };

/**
 * The layout of a MOUND of coins standing on the floor at `floorY`, centred on `cx`: `rows[0]` coins in the base row,
 * `rows[1]` in the row above, and so on, each row `dy` higher and its coins `dx` apart (closer than a diameter: coins
 * cover coins), every coin nudged by a seeded jitter so the pile is not a rack. Returned in PAINT order, back to
 * front: the top rows first, the base row last (a coin lower in the pile stands in front of the ones above it), so a
 * scene paints them with `knock` and lifts any of them out later. `row` / `i` name a coin (row from the base, i from
 * the left).
 */
export const coinMound = (cx: number, floorY: number, rows: number[], opts: { r?: number; dx?: number; dy?: number; jitter?: number; seed?: number } = {}): MoundCoin[] => {
  const { r = 36, dx = 54, dy = 33, jitter = 5, seed = 1 } = opts;
  const rnd = lcg(seed), out: MoundCoin[] = [];
  rows.forEach((n, row) => {
    for (let i = 0; i < n; i++) {
      const jx = (rnd() * 2 - 1) * jitter, jy = (rnd() * 2 - 1) * jitter * 0.8, cr = r + (rnd() * 2 - 1) * 2, z = rnd();
      out.push({ x: F(cx + (i - (n - 1) / 2) * dx + jx), y: F(row === 0 ? floorY - cr : floorY - r - row * dy + jy), r: F(cr), row, i, z });
    }
  });
  return out.sort((a, b) => (b.row - a.row) || (a.z - b.z));
};

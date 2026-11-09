// whiteboard/harbour.tsx: the HARBOUR part of the hand-drawn vocabulary (added 2026-11-05 for the quant beat WB7, "expected
// to open to banks in the first half of 2027 ... 25 islands ... one shared network ... connected to the rails that banks
// already use ... a trail of receipts"): a shore seen from the SIDE (the mainland on the left, a vertical coastline, the
// sea to the right, so a left-to-right story has land to start on and water to cross), a harbour gate standing on that
// shore (two stone pillars under a lintel, an iron gate of bars swung open into the harbour), a rectangular flag on a
// pole (a date flown over the gate), a loop drawn round a group of things (one network round many islands), a small
// paper receipt (a slip torn off a roll: a zigzag bottom edge, a line of figures), hand-drawn numerals 1 and 5 (the hand fonts'
// 1 is a bare or hooked stroke: "H1" read "HI"; Kalam's 5 has no corner: "25" read "2S"), and an archipelago layout (n small islands on a lattice whose rows
// alternate, jittered and re-drawn so none touches another: countable, and not a grid).
//
// Kit conventions (video-creation/whiteboard/whiteboard.md): every component takes the pen and a LOCAL time `t`
// (seconds since its cue; <= 0 = not yet) and draws itself on part by part over `dur` through Sketch progress; fixed
// seeds (no boil, identical across render workers); role colors from the pen's palette (grey = stone / background,
// blue = iron and machines, gold = money / the flag's cloth, red = the highlighted thing); draw order = what hides what.
// Geometry was studied from references before drawing: a harbour / port gate (two square stone piers with cap stones
// carrying a beam, the opening between them closed by a pair of barred iron leaves hinged on the piers' inner faces;
// open, the leaves swing INTO the harbour and are seen foreshortened through the opening), a receipt (a narrow strip
// of paper, straight top, zigzag torn bottom, short ruled lines of figures, a total line), a rectangular flag (a pole
// with a finial, a cloth whose fly edge ripples), then iterated on the beat's stills.
import React from 'react';
import type { Pen } from './pen';
import { Sketch, prog, easeOut, pop } from './Sketch';
import { Wave, type IslandSpec } from './islands';

/** stage helper: progress of stage a..b (fractions of `dur`) at local time `t` */
const stager = (t: number, dur: number) => (a: number, b: number) => prog(t, a * dur, (b - a) * dur);

/** a seeded LCG in 0..1 */
const rng = (seed: number) => {
  let r = seed * 7919 + 17;
  return () => { r = (r * 1103515245 + 12345) % 2147483648; return r / 2147483648; };
};

/** a DETOUR of the coastline: over y0..y1 the shore sits at `x` instead of `shore` (eased in / out over `ramp` px) */
export type CoastDetour = { y0: number; y1: number; x: number; ramp?: number };

/**
 * A VERTICAL coastline at x = `shore` (the mainland to its left, the sea to its right): a run of shallow quadratic
 * bumps (+-`amp` px) from above the top edge to below the bottom edge, deterministic per `seed`. An optional `detour`
 * swings the shore to another x over y0..y1 (smooth-stepped over `ramp` px each side, the jitter fading out inside it),
 * so a thing standing on the shore can HIDE the line behind itself (quant WB7: the coast passes behind the harbour
 * gate's left pillar instead of running through the open gateway and beside the flag pole, visual-qa 2026-11-05).
 * Returns the open path (the shore stroke), the knots, and the knots where grass tufts can stand (none in the detour).
 */
export const sideCoastline = (shore: number, h: number, seed: number, amp = 12, seg = 150, detour?: CoastDetour) => {
  const rnd = rng(seed);
  const ramp = detour?.ramp ?? 120;
  const sm = (u: number) => { const v = Math.max(0, Math.min(1, u)); return v * v * (3 - 2 * v); };
  const wgt = (y: number) => (!detour ? 0 : y < detour.y0 ? sm((y - (detour.y0 - ramp)) / ramp) : y <= detour.y1 ? 1 : 1 - sm((y - detour.y1) / ramp));
  const X = (y: number, jit: number) => { const w = wgt(y); return shore + (detour ? (detour.x - shore) * w : 0) + jit * (1 - w); };
  let ys: number[] = [], y = -10;
  while (y < h + 10) { y = Math.min(h + 10, y + seg + rnd() * 70); ys.push(y); }
  if (detour) {
    // knots at the ramps' ends and the detour's middle so the swing is sampled; random knots within 50 px of one are dropped
    const forced = [detour.y0 - ramp, detour.y0 - ramp / 2, detour.y0, (detour.y0 + detour.y1) / 2, detour.y1, detour.y1 + ramp / 2, detour.y1 + ramp];
    ys = [...ys.filter((v) => forced.every((f) => Math.abs(v - f) > 50)), ...forced].filter((v) => v > -10 && v <= h + 10).sort((a, b) => a - b);
    if (ys[ys.length - 1] < h + 10) ys.push(h + 10);
  }
  const pts: [number, number][] = [[shore, -10]], tuftPts: [number, number][] = [];
  let d = `M ${shore} -10`, py = -10;
  for (const ny of ys) {
    const nx = X(ny, (rnd() * 2 - 1) * amp);
    const my = (py + ny) / 2 + (rnd() - 0.5) * 50 * (1 - wgt((py + ny) / 2));
    const cx = X(my, (rnd() * 2 - 1) * amp * 1.7);
    d += ` Q ${cx.toFixed(1)} ${my.toFixed(1)} ${nx.toFixed(1)} ${ny.toFixed(1)}`;
    pts.push([nx, ny]);
    if (!detour || ny < detour.y0 - ramp - 30 || ny > detour.y1 + ramp + 30) tuftPts.push([nx, ny]);
    py = ny;
  }
  return { d, pts, tuftPts };
};

/** a tuft of grass standing on (x, y): a small zigzag of blades, 22 px wide, ~12 px tall */
const tuftD = (x: number, y: number) => `M ${x - 11} ${y} l 4 -9 l 4 9 l 3 -13 l 4 13 l 4 -10 l 3 10`;

/**
 * The shore seen from the side: the mainland is the page LEFT of a hand-drawn vertical coastline at x = `shore`, the
 * sea to its right tints to the pen's floor color (fades in over 0.5 s), grass tufts stand on the land side of the
 * coast, and `ticks` wave marks draw on one after another (0.07 s apart) across the water. Canvas `w` x `h`. `detour`
 * swings the coast to another x over a span (see sideCoastline): what stands there hides the line.
 */
export const SideShore: React.FC<{ shore: number; ticks: [number, number][]; t: number; pen: Pen; seed: number; w?: number; h?: number; detour?: CoastDetour }> =
  ({ shore, ticks, t, pen, seed, w = 1920, h = 1080, detour }) => {
    if (t <= 0) return null;
    const s = seed * 10;
    const c = sideCoastline(shore, h, seed, 12, 150, detour);
    // every second tuft-able knot carries a tuft on the land side, only knots 40 px inside the canvas (no stub at a frame edge), none in the detour
    const tufts = c.tuftPts.filter((_, i) => i % 2 === 0).filter(([, y]) => y > 40 && y < h - 40);
    return (
      <g>
        {pen.floor && <path d={`${c.d} L ${w + 10} ${h + 10} L ${w + 10} -10 Z`} fill={pen.floor} stroke="none" opacity={easeOut(prog(t, 0, 0.5))} />}
        <Sketch pen={pen} seed={s + 99} shape={{ kind: 'path', d: c.d }} strokeWidth={pen.inkWidth} roughness={0.7} progress={easeOut(prog(t, 0, 0.8))} sequential />
        {tufts.map(([x, y], i) => (
          <Sketch key={`g${i}`} pen={pen} seed={s + 80 + i} shape={{ kind: 'path', d: tuftD(x - 24, y) }} strokeWidth={pen.inkWidth * 0.8} roughness={0.5} progress={easeOut(prog(t, 0.5 + i * 0.08, 0.25))} />
        ))}
        {ticks.map(([x, y], i) => <Wave key={i} x={x} y={y} t={t - 0.1 - i * 0.07} pen={pen} seed={s + 1 + i} />)}
      </g>
    );
  };

/** geometry of a HarbourGate centred on `cx` standing on `gy`: the pillars, the lintel, the opening, the flag's foot */
export const harbourGateGeom = (cx: number, gy: number, pillarW = 40, pillarH = 140, opening = 84, lintelH = 24) => {
  const lx = cx - opening / 2 - pillarW, rx = cx + opening / 2;           // the pillars' left edges
  const top = gy - pillarH, lintelY = top - lintelH;
  return {
    lx, rx, top, lintelY, pillarW, pillarH, opening, lintelH,
    lintelX: lx - 12, lintelW: 2 * pillarW + opening + 24,
    left: lx - 12, right: rx + pillarW + 12,                              // the lintel's overhang = the gate's extent
    flagFoot: [cx, lintelY] as [number, number],
    innerL: lx + pillarW, innerR: rx,                                     // the opening's edges (the leaves' hinges)
  };
};

/**
 * A harbour gate standing on (cx, gy): two square stone pillars (grey) with a cap stone each, a lintel beam (grey)
 * across them with a small overhang, and an iron gate (blue, the machine role) of two barred leaves hinged on the
 * pillars' inner faces and SWUNG OPEN into the harbour (seen foreshortened through the opening: each leaf a narrow
 * quadrilateral leaning in from its hinge, three bars inside). Draws on pillars -> caps -> lintel -> leaves over `dur`.
 * The thing behind the opening (a coastline) stays visible: the gate is open.
 */
export const HarbourGate: React.FC<{ cx: number; gy: number; t: number; pen: Pen; seed: number; dur?: number; leaves?: 'open' | 'half' }> =
  ({ cx, gy, t, pen, seed, dur = 0.7, leaves = 'open' }) => {
    if (t <= 0) return null;
    const s = seed * 10, P = stager(t, dur), Pa = pen.palette, g = harbourGateGeom(cx, gy);
    // `leaves` (opt-in, the shipped beats keep their frames): 'half' = the gate is HALF open, a network still being built
    // (quant WB10): the left leaf swung open as before, the right leaf CLOSED, seen flat across its half of the opening
    // (its far edge on the gate's centre line, no perspective slant, its bars upright)
    const leaf = (hx: number, dir: 1 | -1, p: number, sd: number, closed = false) => {
      // hinge at x = hx; the leaf's far edge `reach` px into the opening and a little lower / higher (perspective)
      const reach = (closed ? g.opening / 2 : 26) * dir, sl = closed ? 0 : 1, yT = g.top + 10, yB = gy - 6;
      const pts: [number, number][] = [[hx, yT], [hx + reach, yT + 9 * sl], [hx + reach, yB - 7 * sl], [hx, yB]];
      const bars = [0.3, 0.55, 0.8].map((u) => ({ x: hx + reach * u, y1: yT + 9 * u * sl + 6, y2: yB - 7 * u * sl - 6 }));
      return (
        <g>
          <Sketch pen={pen} seed={sd} shape={{ kind: 'polygon', pts }} fill={Pa.blue} roughness={0.6} progress={easeOut(p)} />
          {bars.map((b, i) => (
            <Sketch key={i} pen={pen} seed={sd + 1 + i} shape={{ kind: 'line', x1: b.x, y1: b.y1, x2: b.x, y2: b.y2 }} strokeWidth={pen.inkWidth * 0.9} roughness={0.4} progress={prog(p, 0.5 + i * 0.12, 0.25)} />
          ))}
        </g>
      );
    };
    return (
      <g>
        {/* pillars, left then right, each with its cap stone */}
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'rect', x: g.lx, y: g.top, w: g.pillarW, h: g.pillarH }} fill={Pa.grey} progress={P(0, 0.3)} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'rect', x: g.rx, y: g.top, w: g.pillarW, h: g.pillarH }} fill={Pa.grey} progress={P(0.12, 0.42)} />
        <Sketch pen={pen} seed={s + 3} shape={{ kind: 'rect', x: g.lx - 5, y: g.top - 10, w: g.pillarW + 10, h: 12 }} fill={pen.light} roughness={0.7} progress={P(0.3, 0.42)} />
        <Sketch pen={pen} seed={s + 4} shape={{ kind: 'rect', x: g.rx - 5, y: g.top - 10, w: g.pillarW + 10, h: 12 }} fill={pen.light} roughness={0.7} progress={P(0.38, 0.5)} />
        {/* the lintel beam across both */}
        <Sketch pen={pen} seed={s + 5} shape={{ kind: 'rect', x: g.lintelX, y: g.lintelY, w: g.lintelW, h: g.lintelH }} fill={Pa.grey} progress={P(0.46, 0.68)} />
        {/* the iron leaves, swung open into the harbour */}
        {leaf(g.innerL, 1, P(0.62, 1), s + 10)}
        {leaf(g.innerR, -1, P(0.7, 1), s + 20, leaves === 'half')}
      </g>
    );
  };

/**
 * A hand-drawn numeral 1 (a stem with a short flag at the top and a foot), `size` px tall, its stem on `x`, standing on
 * `baseline`: the pen's hand fonts write 1 as a bare stroke (Kalam) or a hooked stroke (Gochi Hand), so "H1" read "HI" on
 * the quant WB7 round-1 still; a drawn 1 with a foot cannot. Draws flag -> stem -> foot over `dur`. `stroke` matches the
 * font weight beside it (Kalam 700 at 28 px ~ 3 px).
 */
export const InkOne: React.FC<{ x: number; baseline: number; size: number; t: number; pen: Pen; seed: number; color?: string; dur?: number; stroke?: number }> =
  ({ x, baseline, size, t, pen, seed, color, dur = 0.25, stroke }) => {
    if (t <= 0) return null;
    const s = seed * 10, P = stager(t, dur), c = color ?? pen.ink, sw = stroke ?? pen.inkWidth + 0.6, top = baseline - size * 0.72;
    return (
      <g>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'line', x1: x - size * 0.2, y1: top + size * 0.16, x2: x, y2: top }} stroke={c} strokeWidth={sw} roughness={0.4} progress={easeOut(P(0, 0.3))} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'line', x1: x, y1: top, x2: x, y2: baseline }} stroke={c} strokeWidth={sw} roughness={0.4} progress={easeOut(P(0.25, 0.75))} />
        <Sketch pen={pen} seed={s + 3} shape={{ kind: 'line', x1: x - size * 0.2, y1: baseline, x2: x + size * 0.2, y2: baseline }} stroke={c} strokeWidth={sw} roughness={0.4} progress={easeOut(P(0.7, 1))} />
      </g>
    );
  };

/**
 * A hand-drawn numeral 5 (a flat top bar, a stem down the left, then the bowl), `size` px (cap height 0.72 size, like
 * InkOne), its stem on `x`, standing on `baseline`, ~0.52 size wide: Kalam's 5 is one curved stroke without a corner and
 * "25" read "2S" (visual-qa on quant WB7, 2026-11-05); a 5 with a flat bar and a corner cannot. Draws bar -> stem -> bowl
 * over `dur`. `stroke` matches the font weight beside it (Kalam 700 at 44 px ~ 4.8 px, measured on the still).
 */
export const InkFive: React.FC<{ x: number; baseline: number; size: number; t: number; pen: Pen; seed: number; color?: string; dur?: number; stroke?: number }> =
  ({ x, baseline, size, t, pen, seed, color, dur = 0.3, stroke }) => {
    if (t <= 0) return null;
    const s = seed * 10, P = stager(t, dur), c = color ?? pen.ink, sw = stroke ?? pen.inkWidth + 0.6;
    const ch = size * 0.72, top = baseline - ch, w = size * 0.52;
    const bowl = `M ${x} ${top + ch * 0.44} C ${x + w * 0.2} ${top + ch * 0.37}, ${x + w * 1.12} ${top + ch * 0.35}, ${x + w * 1.06} ${top + ch * 0.7} ` +
      `C ${x + w * 1.0} ${top + ch * 1.02}, ${x + w * 0.3} ${top + ch * 1.06}, ${x - w * 0.06} ${top + ch * 0.86}`;
    return (
      <g>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'line', x1: x, y1: top, x2: x + w, y2: top }} stroke={c} strokeWidth={sw} roughness={0.4} progress={easeOut(P(0, 0.28))} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'line', x1: x, y1: top, x2: x, y2: top + ch * 0.44 }} stroke={c} strokeWidth={sw} roughness={0.4} progress={easeOut(P(0.22, 0.5))} />
        <Sketch pen={pen} seed={s + 3} shape={{ kind: 'path', d: bowl }} stroke={c} strokeWidth={sw} roughness={0.5} progress={easeOut(P(0.45, 1))} />
      </g>
    );
  };

/** geometry of a RectFlag: the cloth's box (the scene writes inside it) */
export const rectFlagGeom = (x: number, top: number, w = 130, h = 56) => ({ x0: x + 3, y0: top + 6, w, h, cx: x + 3 + w / 2, cy: top + 6 + h / 2 });

/**
 * A rectangular flag on a pole: the pole stands on (x, gy) up to `top` with a round finial, the cloth (`w` x `h`,
 * `color`) flies to the right from under the finial, its fly edge rippling (two bows). Draws pole -> finial -> cloth
 * over `dur`; children (what is written on it) render once the cloth is in.
 */
export const RectFlag: React.FC<{ x: number; gy: number; top: number; w?: number; h?: number; color: string; t: number; pen: Pen; seed: number; dur?: number; children?: React.ReactNode; clothT?: number }> =
  ({ x, gy, top, w = 130, h = 56, color, t, pen, seed, dur = 0.5, children, clothT }) => {
    if (t <= 0) return null;
    const s = seed * 10, P = stager(t, dur), g = rectFlagGeom(x, top, w, h);
    const fx = g.x0 + w;
    const cloth = `M ${g.x0} ${g.y0} L ${fx - 4} ${g.y0} Q ${fx + 7} ${g.y0 + h * 0.25} ${fx - 2} ${g.y0 + h * 0.5} Q ${fx - 10} ${g.y0 + h * 0.75} ${fx - 4} ${g.y0 + h} L ${g.x0} ${g.y0 + h} Z`;
    // `clothT` (opt-in, local seconds; the shipped beats keep their frames): the pole stands EMPTY from `t` and the cloth
    // flies on its own cue (quant WB10: "two empty flag poles" on "what's next", the UK / US cloths as he names them)
    const cp = clothT === undefined ? P(0.4, 0.9) : prog(clothT, 0, dur * 0.5);
    const kids = clothT === undefined ? P(0.85, 1) > 0 : prog(clothT, dur * 0.45, 0.1) > 0;
    return (
      <g>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'line', x1: x, y1: gy, x2: x, y2: top }} strokeWidth={pen.inkWidth + 1.2} progress={easeOut(P(0, 0.4))} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'circle', cx: x, cy: top - 4, r: 4 }} fill={pen.dark} roughness={0.4} progress={P(0.36, 0.46)} />
        {cp > 0 && <Sketch pen={pen} seed={s + 3} shape={{ kind: 'path', d: cloth }} fill={color} progress={easeOut(cp)} />}
        {kids && children}
      </g>
    );
  };

/**
 * A loop drawn ROUND a group of things: a rounded rectangle (x, y, w, h, corner `r`) outlined in `color` (default the
 * pen's `red` role, the highlighted thing), no fill, drawn as ONE pen stroke that starts at the middle of the left
 * edge (where the gate is) and runs clockwise over `dur` (Sketch `sequential`, so the sub-paths reveal one after another).
 *
 * The hand's drift is built in, not left to rough.js: rough.js scales a line's wobble DOWN with its length (`roughnessGain`
 * 0.4 past 500 px) and `preserveVertices` pins its ends, so a 1,100 px side came out ruler-straight (quant WB7, visual-qa
 * 2026-11-05: "0.0 px deviation ... reads as a CSS rounded rectangle"). Each straight side is therefore a run of short
 * segments (about `seg` px, under rough.js's 200 px full-wobble limit) whose joints sit on a seeded bounded random walk
 * of +-`drift` px across the line (a wander, not a jitter: each joint moves at most ~1.6 px from the one before), the
 * corner arcs' control points shift a little too, and every segment still gets rough.js's own small bow. The geometry
 * passed in is the loop's MEAN line: the ink stays within `drift` px (+ the stroke) of it.
 * The loop CLOSES by overshooting: the last run ends 6 px PAST the start point (above it, at ym - 6), so the two ends
 * overlap along the line whatever their across-the-line offsets are (round 6 stopped 6 px SHORT of the start and
 * visual-qa found a 2 px white nick at (480, 577) on quant WB7, 2026-11-05).
 */
export const NetLoop: React.FC<{ x: number; y: number; w: number; h: number; r?: number; t: number; pen: Pen; seed: number; color?: string; dur?: number; strokeWidth?: number; drift?: number; seg?: number }> =
  ({ x, y, w, h, r = 70, t, pen, seed, color, dur = 1.0, strokeWidth, drift = 4, seg = 90 }) => {
    if (t <= 0) return null;
    const c = color ?? pen.palette.red, ym = y + h / 2;
    const rnd = rng(seed * 31 + 5);
    // the joints' across-the-line offsets for a run of `n` segments (n + 1 joints): a random walk, steps of up to 1.6 px,
    // bounded to +-drift; `o0` = the offset the run must start at (the previous piece's end), so the stroke stays continuous
    const walk = (n: number, o0: number) => {
      const out = [o0];
      for (let i = 1; i <= n; i++) {
        let v = out[i - 1] + (rnd() * 2 - 1) * 1.6 + (rnd() * 2 - 1) * 1.2;
        if (v > drift) v = drift - (v - drift);
        if (v < -drift) v = -drift - (v + drift);
        out.push(Math.round(v * 100) / 100);
      }
      return out;
    };
    const F = (v: number) => Math.round(v * 100) / 100;
    // a straight run from (ax, ay) to (bx, by) with its mean line's normal (nx, ny): returns the L commands and the end offset
    const run = (ax: number, ay: number, bx: number, by: number, nx: number, ny: number, o0: number) => {
      const len = Math.hypot(bx - ax, by - ay), n = Math.max(2, Math.round(len / seg)), offs = walk(n, o0);
      let d = '';
      for (let i = 1; i <= n; i++) {
        const u = i / n, o = offs[i];
        d += ` L ${F(ax + (bx - ax) * u + nx * o)} ${F(ay + (by - ay) * u + ny * o)}`;
      }
      return { d, end: offs[n] };
    };
    // a corner arc: from the end of the incoming run (already offset `oIn` along its normal) to the start of the outgoing run
    // (offset `oOut` along ITS normal), the control point at the corner, nudged by +-2 px so no two corners are the same
    const corner = (cx: number, cy: number, ex: number, ey: number, nx: number, ny: number, oOut: number) => {
      const jx = (rnd() * 2 - 1) * 2, jy = (rnd() * 2 - 1) * 2;
      return ` Q ${F(cx + jx)} ${F(cy + jy)} ${F(ex + nx * oOut)} ${F(ey + ny * oOut)}`;
    };
    // the mean line, clockwise from the middle of the left edge: normals point OUTWARD (left side -1 0, top 0 -1, right 1 0, bottom 0 1)
    let o = (rnd() * 2 - 1) * drift * 0.5;
    let d = `M ${F(x - o)} ${F(ym)}`;
    let p = run(x, ym, x, y + r, -1, 0, o);                         d += p.d; o = p.end;        // left edge, up to the top-left corner
    let oNext = F((rnd() * 2 - 1) * drift * 0.6);
    d += corner(x, y, x + r, y, 0, -1, oNext); o = oNext;                                       // top-left corner
    p = run(x + r, y, x + w - r, y, 0, -1, o);                      d += p.d; o = p.end;        // top edge
    oNext = F((rnd() * 2 - 1) * drift * 0.6);
    d += corner(x + w, y, x + w, y + r, 1, 0, oNext); o = oNext;                                // top-right corner
    p = run(x + w, y + r, x + w, y + h - r, 1, 0, o);               d += p.d; o = p.end;        // right edge
    oNext = F((rnd() * 2 - 1) * drift * 0.6);
    d += corner(x + w, y + h, x + w - r, y + h, 0, 1, oNext); o = oNext;                        // bottom-right corner
    p = run(x + w - r, y + h, x + r, y + h, 0, 1, o);               d += p.d; o = p.end;        // bottom edge
    oNext = F((rnd() * 2 - 1) * drift * 0.6);
    d += corner(x, y + h, x, y + h - r, -1, 0, oNext); o = oNext;                               // bottom-left corner
    p = run(x, y + h - r, x, ym - 6, -1, 0, o);                     d += p.d;                   // left edge, up PAST the start (6 px over it: the pen closes the loop)
    return <Sketch pen={pen} seed={seed} shape={{ kind: 'path', d }} stroke={c} strokeWidth={strokeWidth ?? pen.inkWidth + 1.8} roughness={1.0} progress={easeOut(prog(t, 0, dur))} sequential />;
  };

/**
 * A small paper receipt centred (cx, cy), `w` x `h`: a white strip with a straight top and a zigzag torn bottom edge,
 * three short ruled lines (the items) and a longer one at the foot (the total). Pops in over 0.3 s, the lines draw after.
 */
export const Receipt: React.FC<{ cx: number; cy: number; w?: number; h?: number; t: number; pen: Pen; seed: number; dur?: number }> =
  ({ cx, cy, w = 30, h = 40, t, pen, seed, dur = 0.3 }) => {
    if (t <= 0) return null;
    const s = seed * 10, k = pop(prog(t, 0, dur));
    const x0 = cx - w / 2, y0 = cy - h / 2, y1 = cy + h / 2, teeth = 5, tw = w / teeth;
    let d = `M ${x0} ${y0} L ${x0 + w} ${y0} L ${x0 + w} ${y1 - 4}`;
    for (let i = teeth; i > 0; i--) d += ` L ${x0 + (i - 0.5) * tw} ${y1} L ${x0 + (i - 1) * tw} ${y1 - 4}`;
    d += ' Z';
    return (
      <g transform={`translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})`}>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'path', d }} fill={pen.light} roughness={0.5} strokeWidth={pen.inkWidth * 0.9} />
        {[0, 1, 2].map((i) => (
          <Sketch key={i} pen={pen} seed={s + 10 + i} shape={{ kind: 'line', x1: x0 + 6, y1: y0 + 9 + i * 7, x2: x0 + w - (i === 1 ? 10 : 6), y2: y0 + 9 + i * 7 }} strokeWidth={1.4} roughness={0.4} progress={prog(t, dur + i * 0.05, 0.12)} />
        ))}
        <Sketch pen={pen} seed={s + 14} shape={{ kind: 'line', x1: x0 + 6, y1: y1 - 9, x2: x0 + w - 6, y2: y1 - 9 }} strokeWidth={2} roughness={0.4} progress={prog(t, dur + 0.18, 0.12)} />
      </g>
    );
  };

/**
 * An archipelago: `cols` x `rows` small islands inside the box (x0..x1 by their centres, gy0..gy1 by their ground lines)
 * on a lattice whose rows alternate left / right by `shift` px, each island jittered (+-`jx`, +-`jy`) and scaled between
 * `k0` (the back row) and `k1` (the front row) with a little per-island variation, deterministic per `seed`. A jitter
 * that would bring an island's box (land + palm, plus `margin`) onto an already placed one is re-drawn (up to 40 tries,
 * then the un-jittered lattice spot), so no two touch and the count stays readable (round 1 of quant WB7: a plain lattice
 * with small jitter read as a grid, not an archipelago). Returns the specs with their sweep order (by x, the way a hand
 * would dot them in from the left) and their paint order (back row first).
 */
export const archipelago = (cols: number, rows: number, box: { x0: number; x1: number; gy0: number; gy1: number }, seed: number, opts?: { jx?: number; jy?: number; k0?: number; k1?: number; w?: number; h?: number; shift?: number; margin?: number }) => {
  const { jx = 44, jy = 34, k0 = 0.26, k1 = 0.32, w = 580, h = 190, shift = 50, margin = 14 } = opts ?? {};
  const rnd = rng(seed);
  type Spec = IslandSpec & { i: number; gy: number; row: number; col: number; box: [number, number, number, number] };
  const out: Spec[] = [];
  const bbox = (cx: number, gy: number, k: number): [number, number, number, number] =>
    [cx - 0.5 * w * k - 4, gy - 0.5 * h * k - 100 * k, cx + 0.5 * w * k + 4, gy + 0.5 * h * k];   // land + the palm's height
  const clear = (b: [number, number, number, number]) =>
    out.every((o) => b[2] + margin < o.box[0] || b[0] - margin > o.box[2] || b[3] + margin < o.box[1] || b[1] - margin > o.box[3]);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const bx = box.x0 + ((box.x1 - box.x0) * c) / (cols - 1) + (r % 2 === 0 ? -shift : shift);
      const by = box.gy0 + ((box.gy1 - box.gy0) * r) / (rows - 1);
      const scale = Math.round((k0 + ((k1 - k0) * r) / (rows - 1) + (rnd() - 0.5) * 0.03) * 1000) / 1000;
      let cx = Math.round(bx), gy = Math.round(by), b = bbox(cx, gy, scale), ok = clear(b);
      for (let tries = 0; tries < 40; tries++) {
        const tx = Math.round(bx + (rnd() * 2 - 1) * jx), ty = Math.round(by + (rnd() * 2 - 1) * jy), tb = bbox(tx, ty, scale);
        if (clear(tb)) { cx = tx; gy = ty; b = tb; ok = true; break; }
      }
      if (!ok) { cx = Math.round(bx); gy = Math.round(by); b = bbox(cx, gy, scale); }
      // islandGeom: the ground line is top + 0.5 * h * scale
      out.push({ i: r * cols + c, cx, top: Math.round(gy - 0.5 * h * scale), w, h, scale, gy, row: r, col: c, box: b });
    }
  }
  const sweep = [...out].sort((a, b) => a.cx - b.cx || a.gy - b.gy).map((s) => s.i);
  const order = new Map(sweep.map((id, n) => [id, n]));
  return { islands: out, sweepIndex: (i: number) => order.get(i) ?? 0 };
};

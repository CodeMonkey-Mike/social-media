// whiteboard/canton.tsx: the TWO-LEDGERS / SETTLEMENT-GAP part of the hand-drawn vocabulary (added 2026-11-10 for the
// canton beat WB1, "the bond sits on the registrar's books, the cash on the bank's books, two separate systems ... that gap
// is the risk"): a name tag (a pill), a registry office (a records building with a document sign on its roof), an open
// book on a pedestal whose pages can be left blank for a thing to sit on, a small bond certificate, a wireframe coin
// stack that reads on a NO-FILL pen, a thought cloud with its trail of bubbles, and a hatched lens between two arcs
// (the gap between two crossing arrows) whose strokes stop short of anything standing inside it.
//
// Kit conventions (video-creation/whiteboard/whiteboard.md): every component takes the pen and a LOCAL time `t`
// (seconds since its cue; <= 0 = not yet) and draws itself on part by part over `dur` through Sketch progress; fixed
// seeds (no boil, identical across render workers); role colors from the pen's palette (gold = money, blue = systems /
// banks, green = good, brown = people, red = the hot thing); draw order = what hides what. These were authored on a
// NEON pen (neon-canton: no fills, a shape's fill color is its stroke color), so nothing here relies on a fill hiding
// what is behind it: hidden edges are simply not drawn (the coin stack), a blank page carries no ruled lines, and the
// hatch computes where to stop instead of being masked.
// Geometry was studied from references before drawing (the Lucide icon set, ISC: `book-open` = two pages meeting at a
// spine, outer top corners curved; `file-text` = a sheet with a folded corner and ruled lines; `coins` = stacked
// ellipses with side bands; `building-2` = a flat-roofed block with a window grid and a centre door; `scroll-text` /
// a share certificate = a landscape sheet with an inner border, a title rule, text rules and a round seal with two
// ribbons; a comic thought balloon = a scalloped cloud and three bubbles shrinking toward the head), then iterated on
// the beat's stills.
import React, { useMemo } from 'react';
import type { Pen } from './pen';
import { Sketch, prog, easeOut, pop } from './Sketch';
import { rrect } from './crypto';

/** stage helper: progress of stage a..b (fractions of `dur`) at local time `t` */
const stager = (t: number, dur: number) => (a: number, b: number) => prog(t, a * dur, (b - a) * dur);

/**
 * A ONE-COLOR variant of a pen: its ink and its `grey` / `blue` roles all become `color`, so a multi-part kit object
 * (a BankFacade: grey steps, light columns, blue entablature) draws as one neon colour on a no-fill pen. Distinct id
 * so Sketch's memo keeps the two pens apart.
 */
export const tintPen = (pen: Pen, color: string, tag: string): Pen =>
  ({ ...pen, id: `${pen.id}-tint-${tag}`, ink: color, palette: { ...pen.palette, grey: color, blue: color } });

/**
 * A name tag: a pill centred on (cx, cy), `w` x `h`, drawn as one outline; the scene types the word inside (children,
 * rendered once the outline is mostly in).
 */
export const Tag: React.FC<{ cx: number; cy: number; w: number; h?: number; t: number; pen: Pen; seed: number; color?: string; dur?: number; children?: React.ReactNode }> =
  ({ cx, cy, w, h = 64, t, pen, seed, color, dur = 0.45, children }) => {
    if (t <= 0) return null;
    const p = easeOut(prog(t, 0, dur));
    return (
      <g>
        <Sketch pen={pen} seed={seed} shape={{ kind: 'path', d: rrect(cx - w / 2, cy - h / 2, w, h, h / 2 - 2) }} stroke={color ?? pen.palette.blue} roughness={0.7} progress={p} sequential />
        {children}
      </g>
    );
  };

/** geometry of a RegistryOffice standing on (x, gy): the body, the roof line, the sign board */
export const registryGeom = (x: number, gy: number, w = 380, h = 250) => {
  const top = gy - h, signW = 96, signH = 62, signTop = top - 14 - 14 - signH;
  return { top, roofTop: top - 14, cx: x + w / 2, right: x + w, signW, signH, signTop, apexY: signTop };
};

/**
 * A registry office (the registrar: the office that keeps the record of who owns a security) standing on (x, gy), `w`
 * wide, `h` tall: a flat-roofed block with an overhanging cornice, an upper row of four windows, a centre door with a
 * window each side, and on the roof a sign board on two posts carrying a DOCUMENT glyph (a sheet with a folded corner
 * and three rules): a records building, never a bank (no columns, no pediment). No lettering. One colour (`color`,
 * default the pen's blue). Draws on body -> cornice -> door -> windows -> sign over `dur`.
 */
export const RegistryOffice: React.FC<{ x: number; gy: number; w?: number; h?: number; t: number; pen: Pen; seed: number; color?: string; dur?: number }> =
  ({ x, gy, w = 380, h = 250, t, pen, seed, color, dur = 1.0 }) => {
    if (t <= 0) return null;
    const s = seed * 10, P = stager(t, dur), c = color ?? pen.palette.blue, g = registryGeom(x, gy, w, h);
    const winW = w * 0.13, winH = h * 0.2, upY = g.top + h * 0.14, loY = g.top + h * 0.52;
    const ups = [0, 1, 2, 3].map((i) => x + w * 0.1 + i * ((w * 0.8 - winW) / 3));
    const doorW = w * 0.17, doorH = h * 0.4, dx = g.cx - doorW / 2;
    const sx = g.cx - g.signW / 2, sy = g.signTop;
    // the document glyph on the board: a sheet 30 x 40 with its top-right corner folded, three rules
    const shX = g.cx - 15, shY = sy + 11, fold = 9;
    const sheet = `M ${shX} ${shY} L ${shX + 30 - fold} ${shY} L ${shX + 30} ${shY + fold} L ${shX + 30} ${shY + 40} L ${shX} ${shY + 40} Z`;
    return (
      <g>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'rect', x, y: g.top, w, h }} stroke={c} progress={easeOut(P(0, 0.3))} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'rect', x: x - 12, y: g.roofTop, w: w + 24, h: 14 }} stroke={c} roughness={0.7} progress={P(0.24, 0.4)} />
        <Sketch pen={pen} seed={s + 3} shape={{ kind: 'path', d: `M ${dx} ${gy} L ${dx} ${gy - doorH} L ${dx + doorW} ${gy - doorH} L ${dx + doorW} ${gy}` }} stroke={c} roughness={0.7} progress={P(0.36, 0.5)} />
        <Sketch pen={pen} seed={s + 4} shape={{ kind: 'circle', cx: dx + doorW - 11, cy: gy - doorH * 0.48, r: 2.6 }} stroke={c} roughness={0.3} progress={P(0.48, 0.54)} />
        {ups.map((wx, i) => (
          <Sketch key={i} pen={pen} seed={s + 10 + i} shape={{ kind: 'rect', x: wx, y: upY, w: winW, h: winH }} stroke={c} strokeWidth={pen.inkWidth * 0.8} roughness={0.7} progress={P(0.48 + i * 0.04, 0.6 + i * 0.04)} />
        ))}
        {[ups[0], ups[3]].map((wx, i) => (
          <Sketch key={i} pen={pen} seed={s + 20 + i} shape={{ kind: 'rect', x: wx, y: loY, w: winW, h: winH }} stroke={c} strokeWidth={pen.inkWidth * 0.8} roughness={0.7} progress={P(0.64 + i * 0.04, 0.76 + i * 0.04)} />
        ))}
        {/* the roof sign: two posts, the board, the document */}
        <Sketch pen={pen} seed={s + 30} shape={{ kind: 'line', x1: g.cx - 30, y1: g.roofTop, x2: g.cx - 30, y2: sy + g.signH }} stroke={c} roughness={0.5} progress={P(0.72, 0.78)} />
        <Sketch pen={pen} seed={s + 31} shape={{ kind: 'line', x1: g.cx + 30, y1: g.roofTop, x2: g.cx + 30, y2: sy + g.signH }} stroke={c} roughness={0.5} progress={P(0.74, 0.8)} />
        <Sketch pen={pen} seed={s + 32} shape={{ kind: 'path', d: rrect(sx, sy, g.signW, g.signH, 8) }} stroke={c} roughness={0.7} progress={P(0.76, 0.9)} />
        <Sketch pen={pen} seed={s + 33} shape={{ kind: 'path', d: sheet }} stroke={pen.ink} strokeWidth={pen.inkWidth * 0.8} roughness={0.5} progress={P(0.86, 0.95)} />
        {[0, 1, 2].map((i) => (
          <Sketch key={i} pen={pen} seed={s + 40 + i} shape={{ kind: 'line', x1: shX + 6, y1: shY + 15 + i * 8, x2: shX + (i === 2 ? 18 : 24), y2: shY + 15 + i * 8 }} stroke={pen.ink} strokeWidth={1.5} roughness={0.4} progress={P(0.92 + i * 0.02, 0.98 + i * 0.02)} />
        ))}
      </g>
    );
  };

/** geometry of an OpenBook: each page's centre and foot (where a thing stands on it), its outer edges, the top */
export const openBookGeom = (cx: number, cy: number, hw = 95) => ({
  left: cx - hw, right: cx + hw, top: cy - 54, bottom: cy + 52,
  pageL: { cx: cx - hw / 2, cy: cy + 2, foot: cy + 40 }, pageR: { cx: cx + hw / 2, cy: cy + 2, foot: cy + 40 },
});

/**
 * An open book (a ledger: "the books") centred on (cx, cy), each page `hw` wide, standing on a pedestal that rises
 * from `baseY`: two pages meeting at a spine, their outer top corners curved up. `rules` says which pages carry ruled
 * lines ('left' / 'right' / 'both' / 'none'): a page that HOLDS something (a bond, a coin stack) stays blank, because
 * on a no-fill pen the rules would run through the thing. Draws on pedestal -> pages -> spine -> rules over `dur`.
 */
export const OpenBook: React.FC<{ cx: number; cy: number; hw?: number; baseY: number; rules?: 'left' | 'right' | 'both' | 'none'; t: number; pen: Pen; seed: number; color?: string; dur?: number }> =
  ({ cx, cy, hw = 95, baseY, rules = 'both', t, pen, seed, color, dur = 0.8 }) => {
    if (t <= 0) return null;
    const s = seed * 10, P = stager(t, dur), c = color ?? pen.ink;
    const left = `M ${cx} ${cy + 44} L ${cx - hw} ${cy + 52} L ${cx - hw} ${cy - 36} Q ${cx - hw * 0.5} ${cy - 56} ${cx} ${cy - 40}`;
    const right = `M ${cx} ${cy + 44} L ${cx + hw} ${cy + 52} L ${cx + hw} ${cy - 36} Q ${cx + hw * 0.5} ${cy - 56} ${cx} ${cy - 40}`;
    const rule = (side: -1 | 1, i: number) => {
      const ly = cy - 18 + i * 17;
      return <Sketch key={`${side}${i}`} pen={pen} seed={s + 10 + i + (side > 0 ? 10 : 0)} shape={{ kind: 'line', x1: cx + side * 14, y1: ly, x2: cx + side * (hw - 14), y2: ly + 2 }} stroke={c} strokeWidth={1.6} roughness={0.5} opacity={0.8} progress={P(0.72 + i * 0.06, 0.84 + i * 0.06)} />;
    };
    return (
      <g>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'path', d: `M ${cx - 18} ${baseY} L ${cx - 18} ${cy + 68} M ${cx + 18} ${cy + 68} L ${cx + 18} ${baseY}` }} stroke={c} roughness={0.6} progress={P(0, 0.2)} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'rect', x: cx - 46, y: cy + 58, w: 92, h: 10 }} stroke={c} roughness={0.6} progress={P(0.14, 0.3)} />
        <Sketch pen={pen} seed={s + 3} shape={{ kind: 'path', d: left }} stroke={c} progress={easeOut(P(0.26, 0.56))} sequential />
        <Sketch pen={pen} seed={s + 4} shape={{ kind: 'path', d: right }} stroke={c} progress={easeOut(P(0.4, 0.7))} sequential />
        <Sketch pen={pen} seed={s + 5} shape={{ kind: 'line', x1: cx, y1: cy - 40, x2: cx, y2: cy + 44 }} stroke={c} roughness={0.5} progress={P(0.66, 0.76)} />
        {(rules === 'left' || rules === 'both') && [0, 1, 2, 3].map((i) => rule(-1, i))}
        {(rules === 'right' || rules === 'both') && [0, 1, 2, 3].map((i) => rule(1, i))}
      </g>
    );
  };

/**
 * A small bond certificate centred on (cx, cy), `w` wide (`h` = 0.64 w): a landscape sheet, an inner border, a heavy
 * title rule, text rules, a round seal low right with two ribbons. No lettering and no amount. One colour (`color`,
 * default the pen's green). Draws on sheet -> border -> rules -> seal over `dur`. Under ~80 px wide the inner border
 * and the second text rule are dropped (they fuse at that size).
 */
export const MiniBond: React.FC<{ cx: number; cy: number; w?: number; t: number; pen: Pen; seed: number; color?: string; dur?: number }> =
  ({ cx, cy, w = 120, t, pen, seed, color, dur = 0.6 }) => {
    if (t <= 0) return null;
    const s = seed * 10, P = stager(t, dur), c = color ?? pen.palette.green;
    const h = w * 0.64, x = cx - w / 2, y = cy - h / 2, big = w >= 80, k = w / 120;
    const sealX = x + w * 0.76, sealY = y + h * 0.62, sr = Math.max(5, 11 * k);
    return (
      <g>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'rect', x, y, w, h }} stroke={c} roughness={big ? 0.8 : 0.5} progress={easeOut(P(0, 0.4))} />
        {big && <Sketch pen={pen} seed={s + 2} shape={{ kind: 'path', d: rrect(x + 8 * k, y + 8 * k, w - 16 * k, h - 16 * k, 5 * k) }} stroke={c} strokeWidth={1.3} roughness={0.5} progress={P(0.32, 0.56)} />}
        <Sketch pen={pen} seed={s + 3} shape={{ kind: 'line', x1: x + w * 0.24, y1: y + h * 0.28, x2: x + w * 0.76, y2: y + h * 0.28 }} stroke={c} strokeWidth={big ? pen.inkWidth : pen.inkWidth * 0.8} roughness={0.4} progress={P(0.5, 0.64)} />
        <Sketch pen={pen} seed={s + 4} shape={{ kind: 'line', x1: x + w * 0.16, y1: y + h * 0.5, x2: x + w * 0.56, y2: y + h * 0.5 }} stroke={c} strokeWidth={1.5} roughness={0.4} progress={P(0.6, 0.72)} />
        {big && <Sketch pen={pen} seed={s + 5} shape={{ kind: 'line', x1: x + w * 0.16, y1: y + h * 0.68, x2: x + w * 0.48, y2: y + h * 0.68 }} stroke={c} strokeWidth={1.5} roughness={0.4} progress={P(0.66, 0.78)} />}
        <Sketch pen={pen} seed={s + 6} shape={{ kind: 'circle', cx: sealX, cy: sealY, r: sr }} stroke={pen.ink} strokeWidth={big ? pen.inkWidth * 0.9 : 1.6} roughness={0.4} progress={P(0.74, 0.9)} />
        {big && <>
          <Sketch pen={pen} seed={s + 7} shape={{ kind: 'line', x1: sealX - 4 * k, y1: sealY + sr, x2: sealX - 8 * k, y2: sealY + sr + 11 * k }} stroke={pen.ink} strokeWidth={1.6} roughness={0.4} progress={P(0.88, 0.96)} />
          <Sketch pen={pen} seed={s + 8} shape={{ kind: 'line', x1: sealX + 4 * k, y1: sealY + sr, x2: sealX + 8 * k, y2: sealY + sr + 11 * k }} stroke={pen.ink} strokeWidth={1.6} roughness={0.4} progress={P(0.9, 1)} />
        </>}
      </g>
    );
  };

/** geometry of a WireCoinStack: its top, so a label or an arrow can clear it */
export const wireCoinStackGeom = (cx: number, baseY: number, n = 3, rx = 24, ry = 7, th = 10) => ({ top: baseY - n * th - 2 * ry, left: cx - rx, right: cx + rx });

/**
 * A short stack of `n` coins standing on (cx, baseY), drawn as a WIREFRAME with its hidden edges left out, so it reads
 * on a no-fill pen (settlement.tsx `CoinStack` relies on each coin's fill hiding the one below): the top coin's full
 * rim, and for every coin its two side ticks and its front lower rim. Gold (money). Pops in over 0.35 s about its base.
 */
export const WireCoinStack: React.FC<{ cx: number; baseY: number; n?: number; rx?: number; ry?: number; th?: number; t: number; pen: Pen; seed: number; color?: string }> =
  ({ cx, baseY, n = 3, rx = 24, ry = 7, th = 10, t, pen, seed, color }) => {
    if (t <= 0) return null;
    const s = seed * 10, k = pop(prog(t, 0, 0.35)), c = color ?? pen.palette.gold;
    const topCy = baseY - ry - n * th;
    return (
      <g transform={`translate(${cx} ${baseY}) scale(${k}) translate(${-cx} ${-baseY})`}>
        {Array.from({ length: n }).map((_, i) => {
          const yb = baseY - ry - i * th; // the centre of this coin's lower rim
          return (
            <g key={i}>
              <Sketch pen={pen} seed={s + 1 + i * 3} shape={{ kind: 'path', d: `M ${cx - rx} ${yb} A ${rx} ${ry} 0 0 0 ${cx + rx} ${yb}` }} stroke={c} roughness={0.35} />
              <Sketch pen={pen} seed={s + 2 + i * 3} shape={{ kind: 'line', x1: cx - rx, y1: yb - th, x2: cx - rx, y2: yb }} stroke={c} roughness={0.2} />
              <Sketch pen={pen} seed={s + 3 + i * 3} shape={{ kind: 'line', x1: cx + rx, y1: yb - th, x2: cx + rx, y2: yb }} stroke={c} roughness={0.2} />
            </g>
          );
        })}
        <Sketch pen={pen} seed={s + 40} shape={{ kind: 'ellipse', cx, cy: topCy, rx, ry }} stroke={c} roughness={0.35} />
      </g>
    );
  };

/**
 * A thought cloud centred on (cx, cy), `w` x `h`: a scalloped outline (`bumps` lobes around an ellipse) drawn as one
 * pen stroke, and a trail of three bubbles shrinking from the cloud toward `from` (the thinker's head). The bubbles
 * come first (head outward), then the cloud; children (what is thought of) are the scene's, on their own cue.
 */
export const ThoughtCloud: React.FC<{ cx: number; cy: number; w: number; h: number; from: [number, number]; t: number; pen: Pen; seed: number; color?: string; dur?: number; bumps?: number; children?: React.ReactNode }> =
  ({ cx, cy, w, h, from, t, pen, seed, color, dur = 0.7, bumps = 9, children }) => {
    if (t <= 0) return null;
    const s = seed * 10, P = stager(t, dur), c = color ?? pen.ink, rx = w / 2, ry = h / 2;
    const pt = (a: number, k = 1): [number, number] => [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k];
    let d = '';
    for (let i = 0; i < bumps; i++) {
      const a0 = (Math.PI * 2 * i) / bumps - Math.PI, a1 = (Math.PI * 2 * (i + 1)) / bumps - Math.PI;
      const p0 = pt(a0, 0.86), p1 = pt(a1, 0.86), q = pt((a0 + a1) / 2, 1.2);
      d += `${i === 0 ? `M ${p0[0].toFixed(1)} ${p0[1].toFixed(1)} ` : ''}Q ${q[0].toFixed(1)} ${q[1].toFixed(1)} ${p1[0].toFixed(1)} ${p1[1].toFixed(1)} `;
    }
    // the trail: from the head toward the cloud's nearest side, three bubbles growing
    const ang = Math.atan2(from[1] - cy, from[0] - cx), edge = pt(ang, 1.12);
    const trail = [0.16, 0.48, 0.84].map((u, i) => ({ x: from[0] + (edge[0] - from[0]) * u, y: from[1] + (edge[1] - from[1]) * u, r: 4 + i * 3 }));
    return (
      <g>
        {trail.map((b, i) => (
          <Sketch key={i} pen={pen} seed={s + 1 + i} shape={{ kind: 'circle', cx: b.x, cy: b.y, r: b.r }} stroke={c} roughness={0.4} progress={P(i * 0.1, 0.2 + i * 0.1)} />
        ))}
        <Sketch pen={pen} seed={s + 5} shape={{ kind: 'path', d }} stroke={c} roughness={0.6} progress={easeOut(P(0.3, 1))} sequential />
        {children}
      </g>
    );
  };

export type Quad = [[number, number], [number, number], [number, number]];
/** y of a quadratic arc at a given x (the arc must be monotonic in x; bisection on the parameter) */
export const quadYAtX = (q: Quad, x: number) => {
  const X = (u: number) => (1 - u) * (1 - u) * q[0][0] + 2 * (1 - u) * u * q[1][0] + u * u * q[2][0];
  const inc = q[2][0] > q[0][0];
  let lo = 0, hi = 1;
  for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if ((X(m) < x) === inc) lo = m; else hi = m; }
  const u = (lo + hi) / 2;
  return (1 - u) * (1 - u) * q[0][1] + 2 * (1 - u) * u * q[1][1] + u * u * q[2][1];
};

export type HatchHole = { kind: 'circle'; cx: number; cy: number; r: number } | { kind: 'rect'; x: number; y: number; w: number; h: number };

/**
 * The GAP between two arcs, hatched: diagonal strokes (rising to the right) fill the lens between `upper` and `lower`
 * (two quadratic arcs, each monotonic in x), kept `inset` px inside both arcs and inside [x0, x1], and STOPPING SHORT
 * of every `hole` (a clock standing in the gap, a label), like a hand shading around a thing; nothing is masked, each
 * stroke's ends are computed, so the strokes end as pen strokes and the no-fill pen needs no knock-out. Every stroke
 * carries a small seeded bow (a long straight rough.js line comes out ruler-straight). The strokes draw on left to
 * right over `dur`. `color` default the pen's heading colour (the highlight).
 */
export const HatchLens: React.FC<{ upper: Quad; lower: Quad; x0: number; x1: number; inset?: number; gap?: number; holes?: HatchHole[]; t: number; pen: Pen; seed: number; color?: string; dur?: number; strokeWidth?: number; opacity?: number }> =
  ({ upper, lower, x0, x1, inset = 20, gap = 26, holes = [], t, pen, seed, color, dur = 0.7, strokeWidth, opacity = 0.9 }) => {
    const strokes = useMemo(() => {
      const inside = (x: number, y: number) => {
        if (x < x0 || x > x1) return false;
        if (y < quadYAtX(upper, x) + inset || y > quadYAtX(lower, x) - inset) return false;
        for (const hl of holes) {
          if (hl.kind === 'circle' ? Math.hypot(x - hl.cx, y - hl.cy) < hl.r : x > hl.x && x < hl.x + hl.w && y > hl.y && y < hl.y + hl.h) return false;
        }
        return true;
      };
      let yMin = Infinity, yMax = -Infinity;
      for (let x = x0; x <= x1; x += 4) { yMin = Math.min(yMin, quadYAtX(upper, x) + inset); yMax = Math.max(yMax, quadYAtX(lower, x) - inset); }
      // seeded LCG for the bows
      let r = (seed * 9301 + 49297) % 233280;
      const rnd = () => { r = (r * 9301 + 49297) % 233280; return r / 233280 - 0.5; };
      const out: { d: string; x: number }[] = [];
      const step = gap * Math.SQRT2;
      // a stroke is the line x + y = c, walked from its lower-left end up to the right
      for (let c = x0 + yMin; c <= x1 + yMax; c += step) {
        let run: [number, number][] = [];
        const flush = () => {
          if (run.length >= 2) {
            const a = run[0], b = run[run.length - 1], len = Math.hypot(b[0] - a[0], b[1] - a[1]);
            if (len >= 16) {
              const bow = rnd() * Math.min(10, len * 0.05), mx = (a[0] + b[0]) / 2 + bow, my = (a[1] + b[1]) / 2 + bow;
              out.push({ d: `M ${a[0].toFixed(1)} ${a[1].toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${b[0].toFixed(1)} ${b[1].toFixed(1)}`, x: a[0] });
            } else { rnd(); }
          }
          run = [];
        };
        for (let x = x0; x <= x1; x += 2) {
          const y = c - x;
          if (inside(x, y)) run.push([x, y]); else flush();
        }
        flush();
      }
      return out.sort((a, b) => a.x - b.x);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify([upper, lower, x0, x1, inset, gap, holes]), seed]);
    if (t <= 0) return null;
    const c = color ?? pen.colorH, n = Math.max(1, strokes.length), each = 0.3;
    return (
      <g opacity={opacity}>
        {strokes.map((st, i) => {
          const start = (i / n) * (1 - each) * dur;
          return <Sketch key={i} pen={pen} seed={seed * 100 + i} shape={{ kind: 'path', d: st.d }} stroke={c} strokeWidth={strokeWidth ?? pen.inkWidth * 0.85} roughness={0.5} progress={easeOut(prog(t, start, each * dur))} />;
        })}
      </g>
    );
  };

// ---- added 2026-11-10 for the canton beat WB2 ("a synchronizer ... each firm keeps its own node and its own app ...
// puts both legs in order and confirms them"): a round SYNC HUB, a NODE box (a small server), a numbered ORDER tag.
// References studied (the Lucide icon set, ISC): `refresh-cw` = two arcs chasing each other round a centre, each ending
// in a chevron (the universal "sync" mark); `server` = two stacked rounded units, each with a status dot at its left;
// `circle-check` = a check inside a ring (the "synced / confirmed" state).

/**
 * A round synchronizer hub centred on (cx, cy), radius `r`: an outer ring, and inside it the sync mark (two arcs of
 * radius 0.55 r chasing each other clockwise, each ending in a chevron). `spin` (degrees) turns the sync mark about the
 * centre (the paths are authored once, so the wobble never boils while it turns). `tickT` (seconds since its cue) draws
 * a check in the middle of the mark (confirmed), stroke by stroke. One colour for the ring + mark (`color`, default the
 * pen's blue = networks); the check in the pen's green (good). Draws on ring -> arc -> head -> arc -> head over `dur`.
 */
export const SyncHub: React.FC<{ cx: number; cy: number; r?: number; t: number; pen: Pen; seed: number; color?: string; dur?: number; spin?: number; tickT?: number; tickColor?: string }> =
  ({ cx, cy, r = 76, t, pen, seed, color, dur = 0.8, spin = 0, tickT = -1, tickColor }) => {
    if (t <= 0) return null;
    const s = seed * 10, P = stager(t, dur), c = color ?? pen.palette.blue, ra = r * 0.55, head = r * 0.2;
    const pt = (deg: number): [number, number] => [cx + ra * Math.cos((deg * Math.PI) / 180), cy + ra * Math.sin((deg * Math.PI) / 180)];
    const arc = (a0: number, a1: number) => { const p0 = pt(a0), p1 = pt(a1); return `M ${p0[0].toFixed(1)} ${p0[1].toFixed(1)} A ${ra} ${ra} 0 0 1 ${p1[0].toFixed(1)} ${p1[1].toFixed(1)}`; };
    // the chevron at the end of an arc: its point on the arc's end, its arms back along the (clockwise) tangent
    const chev = (a1: number) => {
      const p = pt(a1), tan = ((a1 + 90) * Math.PI) / 180;
      return `M ${(p[0] - head * Math.cos(tan - 0.6)).toFixed(1)} ${(p[1] - head * Math.sin(tan - 0.6)).toFixed(1)} L ${p[0].toFixed(1)} ${p[1].toFixed(1)} L ${(p[0] - head * Math.cos(tan + 0.6)).toFixed(1)} ${(p[1] - head * Math.sin(tan + 0.6)).toFixed(1)}`;
    };
    const k = r / 76;
    const tick = `M ${cx - 17 * k} ${cy + 1 * k} L ${cx - 5 * k} ${cy + 14 * k} L ${cx + 19 * k} ${cy - 14 * k}`;
    const tp = easeOut(prog(tickT, 0, 0.35));
    return (
      <g>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'circle', cx, cy, r }} stroke={c} strokeWidth={pen.inkWidth + 1} roughness={0.5} progress={easeOut(P(0, 0.5))} />
        <g transform={`rotate(${spin} ${cx} ${cy})`}>
          <Sketch pen={pen} seed={s + 2} shape={{ kind: 'path', d: arc(205, 325) }} stroke={c} roughness={0.4} progress={P(0.4, 0.66)} />
          <Sketch pen={pen} seed={s + 3} shape={{ kind: 'path', d: chev(325) }} stroke={c} roughness={0.3} progress={P(0.62, 0.74)} sequential />
          <Sketch pen={pen} seed={s + 4} shape={{ kind: 'path', d: arc(25, 145) }} stroke={c} roughness={0.4} progress={P(0.66, 0.92)} />
          <Sketch pen={pen} seed={s + 5} shape={{ kind: 'path', d: chev(145) }} stroke={c} roughness={0.3} progress={P(0.88, 1)} sequential />
        </g>
        {tickT > 0 && <Sketch pen={pen} seed={s + 6} shape={{ kind: 'path', d: tick }} stroke={tickColor ?? pen.palette.green} strokeWidth={pen.inkWidth + 2.6} roughness={0.4} progress={tp < 0.06 ? 0 : tp} sequential />}
      </g>
    );
  };

/**
 * A node (a small server) with its top-left corner at (x, y), `w` x `h`: a rounded box split into two stacked units,
 * each with a status dot at its left and a short vent line. One colour (`color`, default the pen's blue = machines).
 * Draws on box -> divider -> dots -> vents over `dur`.
 */
export const NodeBox: React.FC<{ x: number; y: number; w?: number; h?: number; t: number; pen: Pen; seed: number; color?: string; dur?: number }> =
  ({ x, y, w = 130, h = 92, t, pen, seed, color, dur = 0.6 }) => {
    if (t <= 0) return null;
    const s = seed * 10, P = stager(t, dur), c = color ?? pen.palette.blue;
    return (
      <g>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'path', d: rrect(x, y, w, h, 10) }} stroke={c} roughness={0.7} progress={easeOut(P(0, 0.5))} sequential />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'line', x1: x + 2, y1: y + h / 2, x2: x + w - 2, y2: y + h / 2 }} stroke={c} roughness={0.5} progress={P(0.4, 0.6)} />
        {[0, 1].map((i) => {
          const uy = y + h * (0.25 + i * 0.5);
          return (
            <g key={i}>
              <Sketch pen={pen} seed={s + 3 + i} shape={{ kind: 'circle', cx: x + 22, cy: uy, r: 5 }} stroke={pen.ink} strokeWidth={pen.inkWidth * 0.9} roughness={0.3} progress={P(0.56 + i * 0.1, 0.72 + i * 0.1)} />
              <Sketch pen={pen} seed={s + 6 + i} shape={{ kind: 'line', x1: x + w * 0.46, y1: uy, x2: x + w - 20, y2: uy }} stroke={c} strokeWidth={pen.inkWidth * 0.85} roughness={0.5} progress={P(0.7 + i * 0.1, 0.9 + i * 0.1)} />
            </g>
          );
        })}
      </g>
    );
  };

/**
 * An ORDER tag: a small ring centred on (cx, cy), radius `r`, with a one-digit number written in it (set in the LABEL
 * font: a display hand-font fuses digits). Pops in over 0.3 s. Ring in `color` (default the pen's blue), the digit in ink.
 */
export const OrderTag: React.FC<{ cx: number; cy: number; r?: number; n: string; t: number; pen: Pen; seed: number; font: string; color?: string }> =
  ({ cx, cy, r = 22, n, t, pen, seed, font, color }) => {
    if (t <= 0) return null;
    const k = pop(prog(t, 0, 0.3));
    return (
      <g transform={`translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})`}>
        <Sketch pen={pen} seed={seed} shape={{ kind: 'circle', cx, cy, r }} stroke={color ?? pen.palette.blue} roughness={0.4} />
        <text x={cx} y={cy + r * 0.48} fontFamily={`'${font}', cursive`} fontSize={r * 1.45} fill={pen.colorL} textAnchor="middle">{n}</text>
      </g>
    );
  };

// ---- added 2026-11-10 for the canton beat WB3 ("the bank only sees the cash side, the registrar only sees the bond
// side, the operators only see the limited metadata"): a VIEW PANE (what one party sees of a trade: two cells, the
// hidden one hatched out) and a SEALED ENVELOPE (the back of a letter, its flap closed under a wax seal).
// References studied (the Lucide icon set, ISC): `panel-left` / `columns-2` = a rounded frame split by one divider;
// `message-square` = a frame with a small tail toward its speaker; `mail` = a landscape rect with a V flap from the top
// corners; a sealed letter seen from the back = the flap's point below the middle, two short fold lines rising from the
// bottom corners, a round seal on the flap's point.

/** geometry of a ViewPane: its two cells (centre + box), so the scene can stand a thing in each */
export const viewPaneGeom = (x: number, y: number, w = 230, h = 106) => {
  const mid = x + w / 2;
  return { mid, cy: y + h / 2, bottom: y + h, right: x + w, cellL: { cx: x + w / 4, x0: x, x1: mid }, cellR: { cx: x + (3 * w) / 4, x0: mid, x1: x + w } };
};

/**
 * A view pane with its top-left corner at (x, y), `w` x `h`: a rounded frame split into two cells by a divider, and a
 * small tail from its bottom edge (`tailX`, the tail's root centre) to `tip` (the party whose view it is). `hide`
 * ('left' / 'right') hatches that cell out with diagonal strokes in the pen's grey on `hideT` (seconds since its own
 * cue): the side this party does NOT see. The scene stands the things in the cells (children). One colour for the
 * frame (`color`, default the pen's ink). Draws on frame -> tail -> divider over `dur`.
 */
export const ViewPane: React.FC<{ x: number; y: number; w?: number; h?: number; tailX: number; tip: [number, number]; hide?: 'left' | 'right'; hideT?: number; t: number; pen: Pen; seed: number; color?: string; dur?: number; children?: React.ReactNode }> =
  ({ x, y, w = 230, h = 106, tailX, tip, hide, hideT = -1, t, pen, seed, color, dur = 0.55, children }) => {
    if (t <= 0) return null;
    const s = seed * 10, P = stager(t, dur), c = color ?? pen.ink, g = viewPaneGeom(x, y, w, h);
    const tail = `M ${tailX - 13} ${g.bottom + 2} L ${tip[0]} ${tip[1]} L ${tailX + 13} ${g.bottom + 2}`;
    // the hatch: strokes x + y = k across the hidden cell, 12 px inside it
    const cell = hide === 'left' ? g.cellL : g.cellR, in0 = 12;
    const hx0 = cell.x0 + in0, hx1 = cell.x1 - in0, hy0 = y + in0, hy1 = y + h - in0;
    const lines: string[] = [];
    for (let k = hx0 + hy0 + 22; k < hx1 + hy1 - 8; k += 26) {
      const xa = Math.max(hx0, k - hy1), xb = Math.min(hx1, k - hy0);
      if (xb - xa > 10) lines.push(`M ${xa} ${k - xa} L ${xb} ${k - xb}`);
    }
    return (
      <g>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'path', d: rrect(x, y, w, h, 12) }} stroke={c} roughness={0.7} progress={easeOut(P(0, 0.6))} sequential />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'path', d: tail }} stroke={c} roughness={0.5} progress={P(0.5, 0.8)} sequential />
        <Sketch pen={pen} seed={s + 3} shape={{ kind: 'line', x1: g.mid, y1: y + 8, x2: g.mid, y2: y + h - 8 }} stroke={c} strokeWidth={pen.inkWidth * 0.8} roughness={0.5} progress={P(0.7, 1)} />
        {children}
        {hide && lines.map((d, i) => (
          <Sketch key={i} pen={pen} seed={s + 10 + i} shape={{ kind: 'path', d }} stroke={pen.palette.grey} strokeWidth={pen.inkWidth * 0.9} roughness={0.6} progress={easeOut(prog(hideT, i * 0.05, 0.22))} />
        ))}
      </g>
    );
  };

/**
 * A SEALED envelope centred on (cx, cy), `w` x `h`, seen from the back: the body, the closed flap (a V from the top
 * corners to a point just under the middle), two short fold lines rising from the bottom corners, and a round wax
 * seal on the flap's point (`sealT`, seconds since its own cue: it pops on). Body in `color` (default the pen's ink),
 * the seal in `sealColor` (default the pen's green). Draws on body -> flap -> folds over `dur`.
 */
export const SealedEnvelope: React.FC<{ cx: number; cy: number; w?: number; h?: number; t: number; sealT?: number; pen: Pen; seed: number; color?: string; sealColor?: string; dur?: number }> =
  ({ cx, cy, w = 120, h = 80, t, sealT, pen, seed, color, sealColor, dur = 0.45 }) => {
    if (t <= 0) return null;
    const s = seed * 10, P = stager(t, dur), c = color ?? pen.ink, sc = sealColor ?? pen.palette.green;
    const x0 = cx - w / 2, x1 = cx + w / 2, y0 = cy - h / 2, y1 = cy + h / 2, py = cy + h * 0.1, sr = h * 0.15;
    const sk = pop(prog(sealT ?? t - dur, 0, 0.3));
    return (
      <g>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'rect', x: x0, y: y0, w, h }} stroke={c} roughness={0.7} progress={easeOut(P(0, 0.55))} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'path', d: `M ${x0 + 2} ${y0 + 2} L ${cx} ${py} L ${x1 - 2} ${y0 + 2}` }} stroke={c} roughness={0.5} progress={P(0.45, 0.85)} sequential />
        <Sketch pen={pen} seed={s + 3} shape={{ kind: 'line', x1: x0 + 3, y1: y1 - 3, x2: cx - w * 0.2, y2: cy + h * 0.02 }} stroke={c} strokeWidth={pen.inkWidth * 0.8} roughness={0.4} progress={P(0.75, 1)} />
        <Sketch pen={pen} seed={s + 4} shape={{ kind: 'line', x1: x1 - 3, y1: y1 - 3, x2: cx + w * 0.2, y2: cy + h * 0.02 }} stroke={c} strokeWidth={pen.inkWidth * 0.8} roughness={0.4} progress={P(0.8, 1)} />
        {sk > 0 && (
          <g transform={`translate(${cx} ${py}) scale(${sk}) translate(${-cx} ${-py})`}>
            <Sketch pen={pen} seed={s + 5} shape={{ kind: 'circle', cx, cy: py, r: sr }} stroke={sc} strokeWidth={pen.inkWidth + 0.8} roughness={0.4} />
            <Sketch pen={pen} seed={s + 6} shape={{ kind: 'circle', cx, cy: py, r: sr * 0.38 }} stroke={sc} strokeWidth={pen.inkWidth * 0.8} roughness={0.3} />
          </g>
        )}
      </g>
    );
  };

// ---- added 2026-11-10 for the canton beat WB4 ("using the synchronizer costs a fee ... that coin gets burned ...
// validators, Super Validators and app builders mint new coins ... up to 100 billion over the first 10 years and then
// 2.5 billion a year. No max supply."): a marked wire COIN that the scene can carry / scale / fade, a FLAME that can
// grow about its base, SMOKE wisps, a dotted TRAIL a coin flies along, a hand-wobbled long LINE, YEAR TICKS and an
// OPEN arrowhead (a timeline whose right end has no end tick and no cap).
// References studied (the Lucide icon set, ISC): `flame` = a teardrop whose tip leans, a small lick notched into its
// left shoulder, widest low; a cartoon smoke wisp / `wind` = an S-curve that ends in a small hook; `coins` = a disc
// with a concentric inner ring; `move-right` = a shaft with an OPEN chevron.

/**
 * A coin centred (cx, cy), radius `r`, for a NO-FILL pen: a BOLD rim, a thin concentric inner ring and a MARK in its
 * middle (`mark`, default "CC" = Canton Coin, no amount, NEVER a dollar sign: the fee is paid and minted in Canton Coin
 * and the video's persona guard bans dollar signs, visual-qa 2026-11-10 round 3; `markSize` overrides its size; set in
 * `font`, default the pen's label font) in ONE colour (`color`, default
 * the pen's brown: the canton beats keep the yellow for the beat's one highlight). An unmarked double ring read as a
 * target / a donut / a halo (visual-qa 2026-11-10; quant WB1 + WB12: a coin carries a mark). `knock` paints a disc of
 * the page colour behind it, so a line the coin rides on does not show through its open middle. `k` scales it about
 * its centre and `opacity` fades it; the scene moves it by changing cx / cy (the wobble is generated once at the
 * origin, so it never boils while it travels). `t` pops it in over 0.3 s.
 */
export const WireCoin: React.FC<{ cx: number; cy: number; r?: number; t?: number; pen: Pen; seed: number; color?: string; k?: number; opacity?: number; mark?: string; font?: string; knock?: boolean; markSize?: number }> =
  ({ cx, cy, r = 20, t = 99, pen, seed, color, k = 1, opacity = 1, mark = 'CC', font, knock = false, markSize }) => {
    if (t <= 0 || opacity <= 0 || k <= 0) return null;
    const s = seed * 10, c = color ?? pen.palette.brown, kk = k * pop(prog(t, 0, 0.3));
    return (
      <g transform={`translate(${cx} ${cy}) scale(${kk})`} opacity={opacity}>
        {knock && <circle cx={0} cy={0} r={r + 1} fill={pen.bg} />}
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'circle', cx: 0, cy: 0, r }} stroke={c} strokeWidth={pen.inkWidth + 2} roughness={0.35} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'circle', cx: 0, cy: 0, r: r * 0.76 }} stroke={c} strokeWidth={pen.inkWidth * 0.5} roughness={0.2} />
        {mark && <text x={0} y={r * 0.04} textAnchor="middle" dominantBaseline="central" fontFamily={`'${font ?? pen.fontL}', cursive`} fontWeight={700} fontSize={markSize ?? r * (mark.length > 1 ? 0.84 : 1.12)} fill={c}>{mark}</text>}
      </g>
    );
  };

/** the outer outline of a Flame `h` tall, in the flame's own frame (origin = the middle of its base, y up = negative): the scene clips a thing that sinks INTO the flame with it */
export const flameOuterD = (h: number) => {
  const X = (u: number) => (u * h).toFixed(1), Y = (v: number) => (-v * h).toFixed(1);
  return `M 0 0 C ${X(-0.36)} 0 ${X(-0.42)} ${Y(0.34)} ${X(-0.24)} ${Y(0.54)} C ${X(-0.22)} ${Y(0.42)} ${X(-0.13)} ${Y(0.38)} ${X(-0.09)} ${Y(0.47)} `
    + `C ${X(-0.15)} ${Y(0.68)} ${X(-0.03)} ${Y(0.86)} ${X(0.07)} ${Y(1)} C ${X(0.1)} ${Y(0.8)} ${X(0.36)} ${Y(0.62)} ${X(0.36)} ${Y(0.32)} C ${X(0.36)} ${Y(0.12)} ${X(0.2)} 0 0 0 Z`;
};

/**
 * A flame standing on (cx, baseY), `h` tall (about 0.78 h wide): the outer flame (a teardrop whose tip leans right, a
 * small lick notched into its left shoulder) in `color` (default the pen's red = the hot thing) and an inner tongue in
 * `inner` (default the pen's brown). `grow` scales the whole flame about its base (1 = as drawn), so it can grow
 * without its outline boiling. Draws on outer -> inner over `dur`.
 */
export const Flame: React.FC<{ cx: number; baseY: number; h?: number; t: number; pen: Pen; seed: number; color?: string; inner?: string; dur?: number; grow?: number }> =
  ({ cx, baseY, h = 100, t, pen, seed, color, inner, dur = 0.5, grow = 1 }) => {
    if (t <= 0) return null;
    const s = seed * 10, P = stager(t, dur), c = color ?? pen.palette.red, ci = inner ?? pen.palette.brown;
    const X = (u: number) => (u * h).toFixed(1), Y = (v: number) => (-v * h).toFixed(1);
    const outer = flameOuterD(h);
    const tongue = `M ${X(0.01)} ${Y(0.07)} C ${X(-0.17)} ${Y(0.07)} ${X(-0.19)} ${Y(0.27)} ${X(-0.02)} ${Y(0.46)} C ${X(0.03)} ${Y(0.33)} ${X(0.17)} ${Y(0.3)} ${X(0.16)} ${Y(0.17)} C ${X(0.15)} ${Y(0.1)} ${X(0.08)} ${Y(0.07)} ${X(0.01)} ${Y(0.07)} Z`;
    return (
      <g transform={`translate(${cx} ${baseY}) scale(${grow})`}>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'path', d: outer }} stroke={c} strokeWidth={pen.inkWidth + 1} roughness={0.5} progress={easeOut(P(0, 0.7))} sequential />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'path', d: tongue }} stroke={ci} strokeWidth={pen.inkWidth} roughness={0.4} progress={easeOut(P(0.55, 1))} sequential />
      </g>
    );
  };

/**
 * A smoke wisp rising from (x, y), `len` px tall: a plain S-curve (no hook: at this size a hook closes into a blob and the wisp reads as a tadpole), leaning `lean` px sideways
 * (negative = to the left). `color` default the pen's `dark`. Draws on bottom to top over `dur`; `opacity` lets the
 * scene thin it out.
 */
export const SmokeWisp: React.FC<{ x: number; y: number; len?: number; lean?: number; t: number; pen: Pen; seed: number; color?: string; dur?: number; opacity?: number }> =
  ({ x, y, len = 70, lean = 0, t, pen, seed, color, dur = 0.55, opacity = 1 }) => {
    if (t <= 0 || opacity <= 0) return null;
    const a = len * 0.22, dir = lean < 0 ? -1 : 1;
    const d = `M ${x} ${y} C ${x - a * dir} ${y - len * 0.26} ${x + a * dir + lean * 0.4} ${y - len * 0.36} ${x + lean * 0.5} ${y - len * 0.58} `
      + `C ${x + lean * 0.6 - a * dir} ${y - len * 0.8} ${x + lean + a * 0.7 * dir} ${y - len * 0.86} ${x + lean} ${y - len}`;
    return <Sketch pen={pen} seed={seed} shape={{ kind: 'path', d }} stroke={color ?? pen.dark} strokeWidth={pen.inkWidth} roughness={0.4} progress={easeOut(prog(t, 0, dur))} opacity={opacity} sequential />;
  };

/**
 * A dotted TRAIL along a quadratic (p0 -> p2 bent by p1), revealed from p0 by `p` (0..1 of its length; a mask stroked
 * with the same path), no arrowhead: the thing that flew along it (a coin) is its head. `color` default the pen's ink.
 */
export const DotTrail: React.FC<{ p0: [number, number]; p1: [number, number]; p2: [number, number]; p: number; pen: Pen; seed: number; color?: string; strokeWidth?: number; opacity?: number }> =
  ({ p0, p1, p2, p, pen, seed, color, strokeWidth, opacity = 0.9 }) => {
    if (p <= 0) return null;
    const d = `M ${p0[0]} ${p0[1]} Q ${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]}`, sw = strokeWidth ?? pen.inkWidth + 1.4, mid = `dtrail-${seed}`;
    return (
      <g opacity={opacity}>
        <defs>
          <mask id={mid} maskUnits="userSpaceOnUse" x={0} y={0} width={4000} height={4000}>
            <path d={d} fill="none" stroke="#ffffff" strokeWidth={sw * 5} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.min(1, p)} />
          </mask>
        </defs>
        <path d={d} fill="none" stroke={color ?? pen.ink} strokeWidth={sw} strokeDasharray="0.5 13" strokeLinecap="round" mask={`url(#${mid})`} />
      </g>
    );
  };

/** the knots of a hand-wobbled long line from (x1, y) to (x2, y): pieces of <= `seg` px joined on a seeded bounded walk of +-`drift` px */
export const wobbleKnots = (x1: number, x2: number, y: number, seed: number, seg = 170, drift = 3): [number, number][] => {
  let r = (seed * 9301 + 49297) % 233280;
  const rnd = () => { r = (r * 9301 + 49297) % 233280; return r / 233280 - 0.5; };
  const n = Math.max(1, Math.ceil(Math.abs(x2 - x1) / seg)), pts: [number, number][] = [[x1, y]];
  let dy = 0;
  for (let i = 1; i < n; i++) { dy = Math.max(-drift, Math.min(drift, dy + rnd() * drift * 1.6)); pts.push([x1 + ((x2 - x1) * i) / n, y + dy]); }
  pts.push([x2, y]);
  return pts;
};

/**
 * A LONG hand-drawn line from (x1, y) to (x2, y), built from short pieces on a seeded walk (a rough.js line longer than
 * ~200 px comes out ruler-straight, whiteboard.md), revealed piece after piece by `progress` (0..1) like one pen stroke.
 */
export const WobbleLine: React.FC<{ x1: number; x2: number; y: number; progress: number; pen: Pen; seed: number; color?: string; strokeWidth?: number; seg?: number; drift?: number }> =
  ({ x1, x2, y, progress, pen, seed, color, strokeWidth, seg = 170, drift = 3 }) => {
    if (progress <= 0) return null;
    const pts = wobbleKnots(x1, x2, y, seed, seg, drift), n = pts.length - 1;
    return (
      <g>
        {pts.slice(0, n).map((a, i) => {
          const b = pts[i + 1], lp = Math.max(0, Math.min(1, progress * n - i));
          return <Sketch key={i} pen={pen} seed={seed * 100 + i} shape={{ kind: 'line', x1: a[0], y1: a[1], x2: b[0], y2: b[1] }} stroke={color ?? pen.ink} strokeWidth={strokeWidth} roughness={0.8} progress={lp} />;
        })}
      </g>
    );
  };

/**
 * Year ticks standing on an axis at `y`: one tick at every x of `xs`, `h` px tall (half above, half below the line),
 * drawn one after another over `dur` from local time `t`.
 */
export const YearTicks: React.FC<{ xs: number[]; y: number; h?: number; t: number; pen: Pen; seed: number; color?: string; dur?: number; strokeWidth?: number }> =
  ({ xs, y, h = 14, t, pen, seed, color, dur = 0.5, strokeWidth }) => {
    if (t <= 0) return null;
    const n = Math.max(1, xs.length), each = dur / n;
    return (
      <g>
        {xs.map((x, i) => (
          <Sketch key={i} pen={pen} seed={seed * 100 + i} shape={{ kind: 'line', x1: x, y1: y - h / 2, x2: x + 1, y2: y + h / 2 }} stroke={color ?? pen.ink} strokeWidth={strokeWidth ?? pen.inkWidth * 0.9} roughness={0.5} progress={prog(t, i * each, Math.max(each, 0.12))} />
        ))}
      </g>
    );
  };

/** an OPEN arrowhead (a chevron, never a closed triangle, never an end tick) whose point is at (x, y), pointing right */
export const OpenHead: React.FC<{ x: number; y: number; head?: number; t: number; pen: Pen; seed: number; color?: string; strokeWidth?: number; dur?: number }> =
  ({ x, y, head = 26, t, pen, seed, color, strokeWidth, dur = 0.3 }) => {
    if (t <= 0) return null;
    const d = `M ${x - head * Math.cos(0.55)} ${y - head * Math.sin(0.55)} L ${x} ${y} L ${x - head * Math.cos(0.55)} ${y + head * Math.sin(0.55)}`;
    return <Sketch pen={pen} seed={seed} shape={{ kind: 'path', d }} stroke={color ?? pen.ink} strokeWidth={strokeWidth} roughness={0.5} progress={easeOut(prog(t, 0, dur))} sequential />;
  };

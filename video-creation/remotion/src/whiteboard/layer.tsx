// whiteboard/layer.tsx: the SOFTWARE-LAYER part of the hand-drawn vocabulary (added 2026-11-04 for the quant beat WB3,
// "Quant is a layer that sits above the islands ... connects all of that through a set of APIs and orchestrates the
// movement"): a plug (an API: where a thread plugs into the layer band), a small check badge (a green disc with a check,
// "the bank keeps this"), and a run of small arrows that travel along a band (the layer orchestrating movement).
//
// Kit conventions (video-creation/whiteboard/whiteboard.md): every component takes the pen and a LOCAL time `t`
// (seconds since its cue; <= 0 = not yet) and draws itself on part by part through Sketch progress; fixed seeds (no
// boil, identical across render workers); role colors from the pen's palette (green = good, blue = machines, red = the
// highlighted thing); draw order = what hides what. Geometry was studied from references before drawing (the Lucide
// `plug` icon, ISC: a body with rounded lower corners, two prongs out of its top, the cable out of its bottom; the
// Lucide `circle-check`: a disc with a check whose short arm starts left of centre and whose long arm ends high right;
// `move-right`: a line with an open chevron head), then iterated on stills.
import React from 'react';
import type { Pen } from './pen';
import { Sketch, prog, easeOut, pop } from './Sketch';
import { rrect } from './crypto';

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/**
 * A plug pointing UP into a band whose bottom edge is at `y`, centred on `cx`: the body (`w` x `h`, rounded lower
 * corners, machine grey) hangs under the edge, two prongs run from the body's top up INTO the band (they overlap its
 * outline by ~10 px, so it reads as plugged in), the cable is the scene's thread leaving the body's bottom (paint the
 * thread BEFORE the plug so the body hides its start). Pops in over 0.3 s about the body's centre.
 */
export const Plug: React.FC<{ cx: number; y: number; w?: number; h?: number; t: number; pen: Pen; seed: number; color?: string; stroke?: string }> =
  ({ cx, y, w = 28, h = 22, t, pen, seed, color, stroke }) => {
    if (t <= 0) return null;
    const s = seed * 10, k = pop(prog(t, 0, 0.3)), cy = y + h / 2;
    const st = stroke ?? pen.ink;
    return (
      <g transform={`translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})`}>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'path', d: rrect(cx - w / 2, y, w, h, 6) }} fill={color ?? pen.palette.blue} stroke={st} roughness={0.5} />
        {[-1, 1].map((side, i) => (
          <Sketch key={i} pen={pen} seed={s + 2 + i} shape={{ kind: 'line', x1: cx + side * 6.5, y1: y + 1, x2: cx + side * 6.5, y2: y - 10 }} stroke={st} strokeWidth={pen.inkWidth + 0.8} roughness={0.35} />
        ))}
      </g>
    );
  };

/**
 * A small check badge centred (cx, cy), radius `r`: a disc (green = good, ink outline) that pops in, then an ink check
 * draws across it (0.25 s). Sized for the thing it sits on: r 15 on a foreground island's bank, r 10 on a back island's.
 * `sequential` draws the check's two strokes one after the other like a pen and holds the ink until the first stroke
 * is under way (visual-qa on quant WB5, 2026-11-05: the two strokes started as two round-cap dots, "a small face",
 * because rough.js emits a sub-path per edge and the dash reveal starts them together). Opt-in so the shipped beats
 * (quant WB3) keep their frames.
 */
export const CheckBadge: React.FC<{ cx: number; cy: number; r?: number; t: number; pen: Pen; seed: number; color?: string; sequential?: boolean }> =
  ({ cx, cy, r = 15, t, pen, seed, color, sequential = false }) => {
    if (t <= 0) return null;
    const s = seed * 10, k = pop(prog(t, 0, 0.28));
    const check = `M ${cx - r * 0.5} ${cy + r * 0.02} L ${cx - r * 0.14} ${cy + r * 0.4} L ${cx + r * 0.56} ${cy - r * 0.42}`;
    const cp = easeOut(prog(t, 0.16, 0.25));
    return (
      <g transform={`translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})`}>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'circle', cx, cy, r }} fill={color ?? pen.palette.green} roughness={0.4} strokeWidth={pen.inkWidth * 0.9} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'path', d: check }} strokeWidth={pen.inkWidth + 1.2} roughness={0.4} progress={sequential && cp < 0.08 ? 0 : cp} sequential={sequential} />
      </g>
    );
  };

/**
 * Small arrows that RUN along a band: inside the segment x0..x1 at height `y`, arrows `len` long every `spacing` px
 * travel right at `speed` px/s (deterministic in `t`), fading in over the first 30 px of the segment and out over the
 * last 30 so none pops at an end. Each arrow draws on (shaft, then its open head) staggered 0.07 s from the left, so
 * the run appears as a hand would draw it, then keeps moving. The glyphs are authored once at the origin (fixed seeds)
 * and translated, so the wobble never boils.
 */
export const FlowArrows: React.FC<{ x0: number; x1: number; y: number; t: number; pen: Pen; seed: number; len?: number; spacing?: number; speed?: number; color?: string }> =
  ({ x0, x1, y, t, pen, seed, len = 34, spacing = 110, speed = 36, color }) => {
    if (t <= 0) return null;
    const s = seed * 10, segLen = x1 - x0, n = Math.max(1, Math.floor(segLen / spacing)), c = color ?? pen.ink;
    const head = `M ${len - 11} -8 L ${len} 0 L ${len - 11} 8`;
    return (
      <g>
        {Array.from({ length: n }).map((_, i) => {
          const u = (i * spacing + speed * t) % segLen;
          const fade = clamp01(u / 30) * clamp01((segLen - len - u) / 30);
          const p = easeOut(prog(t, i * 0.07, 0.3));
          if (p <= 0 || fade <= 0) return null;
          return (
            <g key={i} transform={`translate(${x0 + u} ${y})`} opacity={fade}>
              <Sketch pen={pen} seed={s + 1 + i * 2} shape={{ kind: 'line', x1: 0, y1: 0, x2: len - 2, y2: 0 }} stroke={c} strokeWidth={pen.inkWidth + 0.6} roughness={0.5} progress={clamp01(p / 0.7)} />
              <Sketch pen={pen} seed={s + 2 + i * 2} shape={{ kind: 'path', d: head }} stroke={c} strokeWidth={pen.inkWidth + 0.6} roughness={0.5} progress={clamp01((p - 0.55) / 0.45)} />
            </g>
          );
        })}
      </g>
    );
  };

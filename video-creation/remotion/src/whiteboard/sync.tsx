// whiteboard/sync.tsx: the SYNCHRONISED-SETTLEMENT part of the hand-drawn vocabulary (added 2026-11-05 for the quant
// beat WB5, "every leg commits together or none of them do"): a LEG arrow between two islands whose open head RIDES the
// drawing tip (so a leg that stops mid-water keeps its head where it halted), whose shaft is solid when the leg has
// settled and DASHED while it is only in flight (not committed), and which can be driven by a direct progress value
// (the scene draws it, halts it, fades it, draws it again).
//
// Kit conventions (video-creation/whiteboard/whiteboard.md): every component takes the pen and a LOCAL time `t` or a
// direct `p`; fixed seeds (no boil, identical across render workers); role colors from the pen's palette; draw order =
// what hides what. Geometry was studied from references before drawing (the Lucide `move-right` / `arrow-up-right`
// icons, ISC: a shaft with an open chevron head whose arms open ~55 degrees; a dashed shaft = a route not yet taken,
// as on a map), then iterated on the beat's stills. The head glyph is authored ONCE at the origin pointing right (a
// fixed seed) and translated + rotated to the tip, so its wobble never boils as the tip moves (the layer.tsx FlowArrows
// lesson). The shaft is rough.js on the ideal curve, revealed along its length through a mask on the ideal path (the
// settlement.tsx DottedCurve method), so a dashed shaft can draw on too.
import React, { useMemo } from 'react';
import rough from 'roughjs';
import type { Pen } from './pen';
import { Sketch } from './Sketch';

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** point on a quadratic bezier at parameter u */
const qPt = (p0: [number, number], p1: [number, number], p2: [number, number], u: number): [number, number] => {
  const a = (1 - u) * (1 - u), b = 2 * (1 - u) * u, c = u * u;
  return [a * p0[0] + b * p1[0] + c * p2[0], a * p0[1] + b * p1[1] + c * p2[1]];
};

/**
 * Arc-length table of a quadratic bezier (65 samples): `at(f)` returns the point and the tangent angle at arc-length
 * FRACTION f (0..1), so a head placed at the drawing tip sits where the dash reveal actually is (the dash trick
 * reveals by length, not by parameter).
 */
export const legPath = (p0: [number, number], p1: [number, number], p2: [number, number]) => {
  const N = 64, pts: [number, number][] = [], cum: number[] = [0];
  for (let i = 0; i <= N; i++) pts.push(qPt(p0, p1, p2, i / N));
  for (let i = 1; i <= N; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const len = cum[N];
  const at = (f: number): { x: number; y: number; ang: number } => {
    const target = clamp01(f) * len;
    let i = 1;
    while (i < N && cum[i] < target) i++;
    const seg = cum[i] - cum[i - 1], w = seg > 0 ? (target - cum[i - 1]) / seg : 0;
    const x = pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * w, y = pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * w;
    const ang = Math.atan2(pts[i][1] - pts[i - 1][1], pts[i][0] - pts[i - 1][0]);
    return { x, y, ang };
  };
  return { len, at, d: `M ${p0[0]} ${p0[1]} Q ${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]}` };
};

/**
 * A LEG of a deal: an arrow from p0 to p2 (bent by p1) between two islands. `p` (0..1) = how much of the route is drawn;
 * the open head rides the tip (its back on the drawn ink, its point `head` px ahead, the Lucide chevron: arms open
 * 0.5 rad). `dashed` = the leg is in flight, not committed (a dashed shaft); solid = settled. `opacity` lets the scene
 * fade an attempt out. Ink by default. The shaft is one rough.js stroke on the ideal quadratic, revealed through a
 * mask along the ideal path (a dashed stroke cannot use the pathLength trick directly).
 */
export const LegArrow: React.FC<{
  p0: [number, number]; p1: [number, number]; p2: [number, number]; p: number; pen: Pen; seed: number;
  color?: string; strokeWidth?: number; head?: number; dashed?: boolean; opacity?: number;
}> = ({ p0, p1, p2, p, pen, seed, color, strokeWidth, head = 18, dashed = false, opacity = 1 }) => {
  const path = useMemo(() => legPath(p0, p1, p2), [p0[0], p0[1], p1[0], p1[1], p2[0], p2[1]]);
  const roughD = useMemo(() => {
    const gen = rough.generator();
    const ds = gen.path(path.d, { seed, roughness: pen.roughness * 0.6, bowing: pen.bowing, stroke: pen.ink, strokeWidth: 1, disableMultiStroke: true, preserveVertices: true });
    return gen.toPaths(ds).filter((q) => q.stroke !== 'none' && q.stroke !== undefined).map((q) => q.d).join(' ');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path.d, seed, pen.id]);
  const pp = clamp01(p);
  if (pp <= 0 || opacity <= 0) return null;
  const c = color ?? pen.ink, sw = strokeWidth ?? pen.inkWidth + 2.2;
  // the ink stops `head * 0.55` short of the point so the head's back sits on the shaft, never past it
  const tipGap = head * 0.55, inkF = Math.max(0, pp - tipGap / path.len);
  const tip = path.at(pp);
  const mid = `leg-${seed}`;
  // the head glyph at the origin pointing right: the point at (0, 0), the arms back and out
  const hd = `M ${-head * Math.cos(0.5)} ${-head * Math.sin(0.5)} L 0 0 L ${-head * Math.cos(0.5)} ${head * Math.sin(0.5)}`;
  return (
    <g opacity={opacity}>
      <defs>
        <mask id={mid} maskUnits="userSpaceOnUse" x={0} y={0} width={4000} height={4000}>
          <path d={path.d} fill="none" stroke="#ffffff" strokeWidth={sw * 5} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - inkF} />
        </mask>
      </defs>
      <path d={roughD} fill="none" stroke={c} strokeWidth={sw} strokeDasharray={dashed ? '13 11' : undefined} strokeLinecap="round" strokeLinejoin="round" mask={`url(#${mid})`} />
      <g transform={`translate(${tip.x} ${tip.y}) rotate(${(tip.ang * 180) / Math.PI})`}>
        <Sketch pen={pen} seed={seed + 1} shape={{ kind: 'path', d: hd }} stroke={c} strokeWidth={sw} roughness={0.5} />
      </g>
    </g>
  );
};

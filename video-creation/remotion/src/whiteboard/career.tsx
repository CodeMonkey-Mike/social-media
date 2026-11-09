// whiteboard/career.tsx: the CAREER-PATH part of the hand-drawn vocabulary (added 2026-11-05 for the quant beat WB14,
// "he's worked inside the UK government ... Quant says he helped set up the ISO committee"): a road ribbon that reveals
// itself along its length (the path of a career), a plain signpost (a post with a plate the scene writes on), the black
// door of Number 10 (white surround, fanlight, dark leaf, the scene writes the number), a calendar page on a pole (a
// year planted beside the road), a round meeting table on a pedestal with small sitters around it (a committee), a plain
// document (a sheet with a folded corner and ruled lines), a callout bubble whose tail leaves its bottom-RIGHT (the
// kit's SpeechBubble tails bottom-left), and a pennant flag on a pole.
//
// Kit conventions (video-creation/whiteboard/whiteboard.md): every component takes the pen and a LOCAL time `t`
// (seconds since its cue; <= 0 = not yet) and draws itself on part by part over `dur` through Sketch progress; fixed
// seeds (no boil, identical across render workers); role colors from the pen's palette (brown = wood, grey = background,
// red = the highlighted thing, green = protection); draw order = what hides what. Geometry was studied from references
// before drawing: the Number 10 door (a black six-panel door in a white painted surround, a semicircular fanlight above
// it, the brass "10" at the top panel, a letterbox below, a knob on the right); a classic fingerpost / plate signpost
// (one post, one plate, the word on the plate); a wall calendar page (two rings through the top edge, a header band,
// the figure on the face); a round pedestal table from a 3/4 view (an ellipse top, a short column, a flared foot) with
// the people behind it cut by its top and the people in front cut at the shoulders; the Lucide `file-text` sheet (ISC:
// a dog-eared top-right corner, ruled lines); a pennant (a rectangle whose fly edge bows). Then iterated on stills.
import React from 'react';
import type { Pen } from './pen';
import { Sketch, prog, easeOut, pop } from './Sketch';
import { rrect } from './crypto';

/** stage helper: progress of stage a..b (fractions of `dur`) at local time `t` */
const stager = (t: number, dur: number) => (a: number, b: number) => prog(t, a * dur, (b - a) * dur);

/** the road's three edges (top, centre, bottom) as cubic paths between x0 and x1 with a gentle undulation */
export const roadGeom = (x0: number, x1: number, top: number, h: number, wave = 9) => {
  const L = x1 - x0;
  const edge = (y: number) => `M ${x0} ${y} C ${x0 + 0.3 * L} ${y - wave}, ${x0 + 0.62 * L} ${y + wave}, ${x1} ${y - 2}`;
  const edgeBack = (y: number) => `L ${x1} ${y - 2} C ${x0 + 0.62 * L} ${y + wave}, ${x0 + 0.3 * L} ${y - wave}, ${x0} ${y}`;
  return {
    top: edge(top),
    mid: edge(top + h / 2),
    outline: `${edge(top)} ${edgeBack(top + h)} Z`,
    bottom: top + h,
  };
};

/**
 * A road ribbon from x0 to x1 (top edge at `top`, `h` tall; grey surface, ink edges, a dashed centre line) REVEALED up to
 * `headX` (the leading edge the scene drives from its cue words, so the road "goes" where he says it went). Nothing shows
 * while headX <= x0. The reveal is a clip, so the hand-drawn edges never boil.
 */
export const Road: React.FC<{ x0: number; x1: number; top: number; h?: number; headX: number; pen: Pen; seed: number; wave?: number }> =
  ({ x0, x1, top, h = 60, headX, pen, seed, wave }) => {
    if (headX <= x0 + 1) return null;
    const g = roadGeom(x0, x1, top, h, wave);
    const clipId = `road-${seed}`;
    const hx = Math.min(headX, x1 + 14);
    return (
      <g>
        <defs>
          <clipPath id={clipId}>
            <rect x={x0 - 14} y={top - 24} width={hx - (x0 - 14)} height={h + 48} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`}>
          <Sketch pen={pen} seed={seed} shape={{ kind: 'path', d: g.outline }} fill={pen.palette.grey} />
          <path d={g.mid} fill="none" stroke={pen.ink} strokeWidth={2.2} strokeDasharray="26 22" strokeLinecap="round" opacity={0.75} />
        </g>
      </g>
    );
  };

/**
 * A plain signpost: one post standing on `gy` at `x`, a rounded plate (`w` x `h`, its top at `plateTop`) centred on the
 * post, light fill. Draws post -> plate over `dur`; children (the word, typed by the scene) render once the plate is in.
 */
export const Signpost: React.FC<{ x: number; gy: number; plateTop: number; w: number; h?: number; t: number; pen: Pen; seed: number; dur?: number; children?: React.ReactNode }> =
  ({ x, gy, plateTop, w, h = 56, t, pen, seed, dur = 0.6, children }) => {
    if (t <= 0) return null;
    const s = seed * 10, P = stager(t, dur);
    return (
      <g>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'line', x1: x, y1: gy, x2: x, y2: plateTop + h - 4 }} strokeWidth={pen.inkWidth + 1.2} progress={easeOut(P(0, 0.4))} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'path', d: rrect(x - w / 2, plateTop, w, h, 9) }} fill={pen.light} progress={easeOut(P(0.3, 0.75))} />
        {P(0.72, 1) > 0 && children}
      </g>
    );
  };

/**
 * The door of Number 10: a white surround (`w` x `h`, its foot on `gy`, `x` = its left edge), a semicircular fanlight in
 * the top, a dark door leaf below it, a letterbox line, a knob on the right. Draws surround -> fanlight -> leaf -> letterbox
 * -> knob over `dur`; children (the "10", typed by the scene) render once the leaf is in. `doorTop` is exported for the
 * scene to centre the number on the leaf's top panel.
 */
export const numberDoorGeom = (x: number, gy: number, w = 72, h = 124) => {
  const y = gy - h, leafX = x + 10, leafW = w - 20, leafTop = y + 34;
  return { y, leafX, leafW, leafTop, leafH: gy - leafTop, cx: x + w / 2 };
};
export const NumberDoor: React.FC<{ x: number; gy: number; w?: number; h?: number; t: number; pen: Pen; seed: number; dur?: number; children?: React.ReactNode }> =
  ({ x, gy, w = 72, h = 124, t, pen, seed, dur = 0.7, children }) => {
    if (t <= 0) return null;
    const s = seed * 10, P = stager(t, dur), g = numberDoorGeom(x, gy, w, h);
    const fan = `M ${g.leafX + 2} ${g.leafTop - 6} C ${g.leafX + 2} ${g.y + 6}, ${g.leafX + g.leafW - 2} ${g.y + 6}, ${g.leafX + g.leafW - 2} ${g.leafTop - 6} Z`;
    return (
      <g>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'rect', x, y: g.y, w, h }} fill={pen.light} progress={easeOut(P(0, 0.4))} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'path', d: fan }} fill={pen.palette.grey} roughness={0.6} progress={P(0.34, 0.5)} />
        <Sketch pen={pen} seed={s + 3} shape={{ kind: 'rect', x: g.leafX, y: g.leafTop, w: g.leafW, h: g.leafH }} fill={pen.dark} progress={easeOut(P(0.45, 0.8))} />
        <Sketch pen={pen} seed={s + 4} shape={{ kind: 'line', x1: g.leafX + 10, y1: g.leafTop + g.leafH * 0.66, x2: g.leafX + g.leafW - 10, y2: g.leafTop + g.leafH * 0.66 }} stroke={pen.light} strokeWidth={2} roughness={0.4} progress={P(0.82, 0.92)} />
        <Sketch pen={pen} seed={s + 5} shape={{ kind: 'circle', cx: g.leafX + g.leafW - 10, cy: g.leafTop + g.leafH * 0.5, r: 3.2 }} fill={pen.light} stroke="none" roughness={0.3} progress={P(0.9, 1)} />
        {P(0.8, 1) > 0 && children}
      </g>
    );
  };

/**
 * A calendar page on a pole (a year planted beside a road): the pole stands on `gy` at `x` up to `top`; the page (`w` x `h`)
 * hangs on its right with a header band and two rings through its top edge. Draws pole -> page -> band -> rings over `dur`;
 * children (the year, typed by the scene) render once the page is in. `calendarFlagGeom` gives the page's face centre.
 */
export const calendarFlagGeom = (x: number, top: number, w = 120, h = 100) => {
  const px = x + 3, py = top + 4, band = 24;
  return { px, py, w, h, band, faceCx: px + w / 2, faceCy: py + band + (h - band) / 2 };
};
export const CalendarFlag: React.FC<{ x: number; gy: number; top: number; w?: number; h?: number; t: number; pen: Pen; seed: number; dur?: number; children?: React.ReactNode }> =
  ({ x, gy, top, w = 120, h = 100, t, pen, seed, dur = 0.7, children }) => {
    if (t <= 0) return null;
    const s = seed * 10, P = stager(t, dur), g = calendarFlagGeom(x, top, w, h);
    return (
      <g>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'line', x1: x, y1: gy, x2: x, y2: top }} strokeWidth={pen.inkWidth + 1.2} progress={easeOut(P(0, 0.35))} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'path', d: rrect(g.px, g.py, w, h, 8) }} fill={pen.light} progress={easeOut(P(0.25, 0.65))} />
        <Sketch pen={pen} seed={s + 3} shape={{ kind: 'rect', x: g.px, y: g.py, w, h: g.band }} fill={pen.palette.grey} roughness={0.6} progress={P(0.55, 0.75)} />
        <Sketch pen={pen} seed={s + 4} shape={{ kind: 'line', x1: g.px + w * 0.3, y1: g.py - 12, x2: g.px + w * 0.3, y2: g.py + 10 }} strokeWidth={pen.inkWidth + 1} roughness={0.5} progress={P(0.72, 0.84)} />
        <Sketch pen={pen} seed={s + 5} shape={{ kind: 'line', x1: g.px + w * 0.7, y1: g.py - 12, x2: g.px + w * 0.7, y2: g.py + 10 }} strokeWidth={pen.inkWidth + 1} roughness={0.5} progress={P(0.76, 0.88)} />
        {P(0.8, 1) > 0 && children}
      </g>
    );
  };

/** geometry of a RoundTable: the top ellipse, the column, the foot, and seats for sitters behind / beside / in front */
export const roundTableGeom = (cx: number, cy: number, gy: number, rx = 150, ry = 46) => ({
  cx, cy, rx, ry, gy,
  colX: cx - 14, colW: 28, colTop: cy + ry - 8, colBottom: gy - 8,
  footCy: gy - 4, footRx: 48, footRy: 8,
  /** head centres: two behind the table (cut by its top), one at each side (at its tips), two in front (over its edge) */
  behind: [[cx - 70, cy - 60], [cx + 70, cy - 60]] as [number, number][],
  sides: [[cx - rx + 4, cy - 18], [cx + rx - 4, cy - 18]] as [number, number][],
  front: [[cx - 70, cy + 52], [cx + 70, cy + 52]] as [number, number][],
});

/**
 * A round pedestal table from a 3/4 view: a flared foot on `gy`, a short column, an elliptical top centred (cx, cy)
 * `rx` x `ry`. `color` = the pen's pale machine tint by default (palette.blue; visual-qa 2026-11-05: a brown #E7A77F top
 * beside the ONE orange mark read as "a second, bigger orange"). Draws foot -> column -> top over `dur`; the top's FILL is
 * opaque from the first frame its outline starts (the outline draws over it), so sitters painted before it never ghost
 * through a half-faded top (visual-qa 2026-11-05). Sitters BEHIND it are painted before it in the scene (its top cuts
 * them at the chest), sitters in FRONT after it.
 */
export const RoundTable: React.FC<{ cx: number; cy: number; gy: number; rx?: number; ry?: number; color?: string; t: number; pen: Pen; seed: number; dur?: number }> =
  ({ cx, cy, gy, rx = 150, ry = 46, color, t, pen, seed, dur = 0.7 }) => {
    if (t <= 0) return null;
    const s = seed * 10, P = stager(t, dur), g = roundTableGeom(cx, cy, gy, rx, ry);
    const fill = color ?? pen.palette.blue;
    const topP = easeOut(P(0.4, 1));
    return (
      <g>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'ellipse', cx, cy: g.footCy, rx: g.footRx, ry: g.footRy }} fill={fill} roughness={0.7} progress={easeOut(P(0, 0.25))} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'rect', x: g.colX, y: g.colTop, w: g.colW, h: g.colBottom - g.colTop }} fill={fill} roughness={0.7} progress={easeOut(P(0.2, 0.45))} />
        <Sketch pen={pen} seed={s + 3} shape={{ kind: 'ellipse', cx, cy, rx, ry }} fill={fill} progress={topP} fillIn={topP > 0 ? 1 : 0} />
      </g>
    );
  };

/**
 * A small seated figure centred on its head (cx, cy), head radius `r`: a shoulder dome whose apex sits at the head's
 * bottom, a NECK painted over the dome that bridges head and shoulders (visual-qa 2026-11-05 round 3: a head split from
 * its dome by a 3 to 6 px white gap "reads as a black ball or a wheel under the table"), a pale head over both.
 * `face`: 'front' = cap hair + two eyes; 'back' = seen from behind: a hair cap over the upper ~70 % of the head with the
 * pale nape under it, down to the neck (the same verdict: a solid dark disc read as a ball); 'left' / 'right' = profile
 * with one eye. Pops in over 0.3 s about the neck. Painted before or after the table it sits at (depth).
 */
export const Sitter: React.FC<{ cx: number; cy: number; r?: number; face?: 'front' | 'back' | 'left' | 'right'; shirt: string; t: number; pen: Pen; seed: number }> =
  ({ cx, cy, r = 15, face = 'front', shirt, t, pen, seed }) => {
    if (t <= 0) return null;
    const s = seed * 10, k = pop(prog(t, 0, 0.3));
    const hy = cy, sw = r * 1.75, sh = r * 2.1;
    // a cubic with both controls at hy + r - 10 peaks ~0.4 px under the head's bottom: the dome meets the head, the neck is painted over the join
    const shoulders = `M ${cx - sw} ${hy + r + sh} C ${cx - sw} ${hy + r - 10}, ${cx + sw} ${hy + r - 10}, ${cx + sw} ${hy + r + sh} Z`;
    const nw = r * 0.42;
    const neck = `M ${cx - nw} ${hy + r * 0.5} L ${cx - nw} ${hy + r + 11} L ${cx + nw} ${hy + r + 11} L ${cx + nw} ${hy + r * 0.5} Z`;
    const cap = `M ${cx - r} ${hy - 0.12 * r} C ${cx - r * 0.94} ${hy - r * 1.3}, ${cx + r * 0.94} ${hy - r * 1.3}, ${cx + r} ${hy - 0.12 * r} C ${cx + r * 0.65} ${hy - r * 0.5}, ${cx - r * 0.05} ${hy - r * 0.7}, ${cx - r} ${hy - 0.12 * r} Z`;
    // the back of the head: hair from the sides at hy + 0.42 r over the crown (controls at hy - 1.54 r put the midpoint at hy - 1.05 r), its lower edge at ~hy + 0.33 r
    const backCap = `M ${cx - r * 1.02} ${hy + r * 0.42} C ${cx - r * 1.02} ${hy - r * 1.54}, ${cx + r * 1.02} ${hy - r * 1.54}, ${cx + r * 1.02} ${hy + r * 0.42} C ${cx + r * 0.55} ${hy + r * 0.3}, ${cx - r * 0.55} ${hy + r * 0.3}, ${cx - r * 1.02} ${hy + r * 0.42} Z`;
    const ex = face === 'left' ? -0.45 : face === 'right' ? 0.45 : 0;
    return (
      <g transform={`translate(${cx} ${cy + r}) scale(${k}) translate(${-cx} ${-(cy + r)})`}>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'path', d: shoulders }} fill={shirt} roughness={0.7} />
        <Sketch pen={pen} seed={s + 4} shape={{ kind: 'path', d: neck }} fill={pen.light} roughness={0.5} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'circle', cx, cy: hy, r }} fill={pen.light} roughness={0.6} />
        <Sketch pen={pen} seed={s + 3} shape={{ kind: 'path', d: face === 'back' ? backCap : cap }} fill={pen.dark} roughness={0.5} />
        {face === 'front' && <>
          <circle cx={cx - r * 0.3} cy={hy + r * 0.1} r={1.8} fill={pen.dark} />
          <circle cx={cx + r * 0.3} cy={hy + r * 0.1} r={1.8} fill={pen.dark} />
        </>}
        {(face === 'left' || face === 'right') && <circle cx={cx + ex * r} cy={hy + r * 0.1} r={1.8} fill={pen.dark} />}
      </g>
    );
  };

/**
 * A plain document: a sheet (`w` x `h`, centred at `cx`, its foot on `bottom`) with its top-right corner folded and three
 * ruled lines. Draws sheet -> fold -> lines over `dur`.
 */
export const Sheet: React.FC<{ cx: number; bottom: number; w?: number; h?: number; t: number; pen: Pen; seed: number; dur?: number }> =
  ({ cx, bottom, w = 54, h = 68, t, pen, seed, dur = 0.5 }) => {
    if (t <= 0) return null;
    const s = seed * 10, P = stager(t, dur), x = cx - w / 2, y = bottom - h, f = 14;
    const body = `M ${x} ${y} L ${x + w - f} ${y} L ${x + w} ${y + f} L ${x + w} ${bottom} L ${x} ${bottom} Z`;
    const fold = `M ${x + w - f} ${y} L ${x + w - f} ${y + f} L ${x + w} ${y + f}`;
    return (
      <g>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'path', d: body }} fill={pen.light} progress={easeOut(P(0, 0.5))} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'path', d: fold }} roughness={0.5} progress={P(0.45, 0.6)} />
        {[0.42, 0.58, 0.74].map((fy, i) => (
          <Sketch key={i} pen={pen} seed={s + 3 + i} shape={{ kind: 'line', x1: x + 9, y1: y + h * fy, x2: x + w - 9, y2: y + h * fy }} strokeWidth={1.5} roughness={0.5} opacity={0.85} progress={P(0.6 + i * 0.12, 0.76 + i * 0.12)} />
        ))}
      </g>
    );
  };

/**
 * A callout bubble (a rounded rectangle, light fill) whose wedge tail leaves the BOTTOM edge between `tailBase[0]` and
 * `tailBase[1]` (absolute x) and points at `tip` (the speaker), drawn as ONE outline. Children (the words, typed by the
 * scene) render once the outline is in. The kit's SpeechBubble (money.tsx) tails bottom-left; this one puts the tail where
 * the scene says, so a speaker to the bubble's right works.
 */
export const Callout: React.FC<{ x: number; y: number; w: number; h: number; tailBase: [number, number]; tip: [number, number]; t: number; pen: Pen; seed: number; dur?: number; children?: React.ReactNode }> =
  ({ x, y, w, h, tailBase, tip, t, pen, seed, dur = 0.5, children }) => {
    if (t <= 0) return null;
    const r = 22, [ta, tb] = tailBase;
    const d =
      `M ${x + r} ${y} L ${x + w - r} ${y} Q ${x + w} ${y} ${x + w} ${y + r} L ${x + w} ${y + h - r} Q ${x + w} ${y + h} ${x + w - r} ${y + h} ` +
      `L ${tb} ${y + h} L ${tip[0]} ${tip[1]} L ${ta} ${y + h} L ${x + r} ${y + h} Q ${x} ${y + h} ${x} ${y + h - r} L ${x} ${y + r} Q ${x} ${y} ${x + r} ${y} Z`;
    const p = easeOut(prog(t, 0, dur));
    return (
      <g>
        <Sketch pen={pen} seed={seed} shape={{ kind: 'path', d }} fill={pen.light} progress={p} />
        {p >= 0.9 && children}
      </g>
    );
  };

/**
 * A pennant flag: a pole standing on `gy` at `x` up to `top` (a small finial), a cloth (`w` x `h`) flying to the right
 * from just under the top, its fly edge bowed; `color` fills it (the scene's one orange accent in quant WB14). Draws pole
 * -> cloth over `dur`; children (the word, typed by the scene) render once the cloth is in. `ground` draws a short ground
 * stroke and two grass ticks at the foot with the pole (visual-qa 2026-11-05 round 3: a pole whose foot stood on bare
 * white 60 px above the floor line "ends in mid air" for the 2.2 s before the road arrives; the flag now stands on the
 * ground line, planted). The ground stroke and both ticks lie to the RIGHT of the pole only, starting AT the pole
 * (visual-qa round 4: a stroke that began 20 px left of the pole and a tick at x - 8 ran under / across the road's end
 * cap 12 px away, so the road's corner read as a scribble): the side a flag is planted against stays clean.
 */
export const pennantGeom = (x: number, top: number, w = 90, h = 56) => {
  const y0 = top + 8;
  return { y0, cx: x + w / 2 - 2, cy: y0 + h / 2 };
};
export const PennantFlag: React.FC<{ x: number; gy: number; top: number; w?: number; h?: number; color: string; t: number; pen: Pen; seed: number; dur?: number; ground?: boolean; children?: React.ReactNode }> =
  ({ x, gy, top, w = 90, h = 56, color, t, pen, seed, dur = 0.55, ground = false, children }) => {
    if (t <= 0) return null;
    const s = seed * 10, P = stager(t, dur), g = pennantGeom(x, top, w, h);
    const cloth = `M ${x} ${g.y0} L ${x + w - 6} ${g.y0} Q ${x + w + 6} ${g.y0 + h / 2} ${x + w - 6} ${g.y0 + h} L ${x} ${g.y0 + h} Z`;
    return (
      <g>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'line', x1: x, y1: gy, x2: x, y2: top }} strokeWidth={pen.inkWidth + 1.2} progress={easeOut(P(0, 0.4))} />
        {ground && <>
          <Sketch pen={pen} seed={s + 5} shape={{ kind: 'line', x1: x, y1: gy, x2: x + 26, y2: gy + 1 }} strokeWidth={pen.inkWidth + 0.6} roughness={0.8} progress={P(0.08, 0.3)} />
          <Sketch pen={pen} seed={s + 6} shape={{ kind: 'line', x1: x + 8, y1: gy, x2: x + 14, y2: gy - 11 }} strokeWidth={pen.inkWidth} roughness={0.5} progress={P(0.2, 0.3)} />
          <Sketch pen={pen} seed={s + 7} shape={{ kind: 'line', x1: x + 17, y1: gy, x2: x + 25, y2: gy - 8 }} strokeWidth={pen.inkWidth} roughness={0.5} progress={P(0.24, 0.34)} />
        </>}
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'circle', cx: x, cy: top - 4, r: 4 }} fill={pen.dark} roughness={0.4} progress={P(0.36, 0.46)} />
        <Sketch pen={pen} seed={s + 3} shape={{ kind: 'path', d: cloth }} fill={color} progress={easeOut(P(0.4, 0.9))} />
        {P(0.85, 1) > 0 && children}
      </g>
    );
  };

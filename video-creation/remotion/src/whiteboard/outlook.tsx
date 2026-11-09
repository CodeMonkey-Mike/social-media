// whiteboard/outlook.tsx: the WHAT'S-NEXT part of the hand-drawn vocabulary (added 2026-11-05 for the quant beat WB10,
// "the banks plan to issue digital debt instruments, basically bonds, with the coupons paid in tokenised deposits ... The
// Clearing House is building a network now ... Gilbert Verdian said ... early 2027. His words, his forecast."): a BOND
// CERTIFICATE with a strip of detachable coupon stubs down its right edge (a bearer bond: the payments tear off the
// sheet), a SLOT VAULT (a squat strongbox with a round vault door on its face and a deposit slot in its top lip: where a
// payment goes in), a LECTERN (a desk top, a front panel the scene writes a nameplate on, a column, a base plate, a
// gooseneck microphone: a speaker on a panel) and a SCAFFOLD (standards, ledgers, X braces, a plank deck and a guard
// rail round a thing still being built).
//
// Kit conventions (video-creation/whiteboard/whiteboard.md): every component takes the pen and a LOCAL time `t`
// (seconds since its cue; <= 0 = not yet) and draws itself on part by part over `dur` through Sketch progress; fixed
// seeds (no boil, identical across render workers); role colors from the pen's palette (gold = money, red = the
// highlighted / hot thing, blue = machines, grey = stone / background, brown = wood); draw order = what hides what.
// Geometry was studied from references before drawing: a bearer bond (a landscape engraved sheet, a title across the
// top, text lines, a seal low left, a signature along the foot, and a sheet of small dated coupons attached along one
// edge, perforated between them); a strongbox / safe (a squat box on two feet, a round door with a hand wheel on the
// front; a deposit slot is a narrow dark opening in the top); a lectern (a wide reading desk whose top slopes toward the
// speaker on a narrower column over a base, a microphone on a flexible gooseneck at the far corner); tube-and-fitting
// scaffolding (vertical standards in pairs, horizontal ledgers at each lift, diagonal braces across the bays, boards on the
// working lift, a guard rail above them), then iterated on the beat's stills.
import React from 'react';
import type { Pen } from './pen';
import { Sketch, prog, easeOut } from './Sketch';
import { rrect } from './crypto';
import { VaultDoor } from './bank';
import { Shadow } from './vocab';

/** stage helper: progress of stage a..b (fractions of `dur`) at local time `t` */
const stager = (t: number, dur: number) => (a: number, b: number) => prog(t, a * dur, (b - a) * dur);

// ---------------------------------------------------------------------------------------------------------------------
// the bond certificate with its coupon stubs

/** geometry of a BondCertificate: the body, the coupon strip, each stub's centre (where a payment detaches), the title line */
export const bondGeom = (x: number, y: number, w = 300, h = 180, stubW = 48, stubs = 4) => {
  const sx = x + w, sh = h / stubs;
  // the title baseline at y + 56: a 34 px Kalam title's ascenders then sit ~16 px under the inner border (y + 12) and its
  // baseline ~17 px over the first text line (y + 72); at y + 46 the ascenders were 6 px from the border (visual-qa, WB10)
  return {
    body: { x, y, w, h }, cx: x + w / 2, titleY: y + 56,
    strip: { x: sx, y, w: stubW, h }, right: sx + stubW,
    stubs: Array.from({ length: stubs }, (_, i) => ({ cx: sx + stubW / 2, cy: y + sh * (i + 0.5), top: y + sh * i, h: sh })),
  };
};

/**
 * A bond certificate (x, y top-left, `w` x `h`): a landscape sheet (the pen's floor tint) with an inner border, three
 * text lines on the left, a round gold seal low left with two ribbons and a signature squiggle along the foot; the title
 * is written by the scene (children, centred on `bondGeom().cx` at `titleY`). Down its RIGHT edge a strip of `stubs`
 * coupon stubs (light fill), perforated (dashed) between the body and each stub, two tiny ruled lines per stub: the
 * payments that tear off. Body draws over `dur` from `t`; the strip on `stripT` (default half-way through the body).
 */
export const BondCertificate: React.FC<{ x: number; y: number; w?: number; h?: number; stubW?: number; stubs?: number; t: number; stripT?: number; pen: Pen; seed: number; dur?: number; children?: React.ReactNode }> =
  ({ x, y, w = 300, h = 180, stubW = 48, stubs = 4, t, stripT, pen, seed, dur = 1.0, children }) => {
    if (t <= 0) return null;
    const s = seed * 10, P = stager(t, dur), g = bondGeom(x, y, w, h, stubW, stubs), inset = 12;
    const sT = stripT ?? t - dur * 0.5;
    // the seal (r 18) sits 52 px over the foot so its ribbons (to sealY + 30) end ~10 px inside the inner border (y + h - 12)
    // and its top clears the third text line (y + 108) by ~22 px on a 200 px sheet; at r 20 / h - 44 with 38 px ribbons the
    // ribbons crossed the inner border and the seal sat 7 px under the text (visual-qa, WB10)
    const sealX = x + 48, sealY = y + h - 52, sr = 18;
    const sig = `M ${x + 96} ${y + h - 28} C ${x + 112} ${y + h - 50}, ${x + 122} ${y + h - 16}, ${x + 140} ${y + h - 32} C ${x + 156} ${y + h - 46}, ${x + 164} ${y + h - 20}, ${x + 186} ${y + h - 30}`;
    const perf = (x1: number, y1: number, x2: number, y2: number, op: number, k: number) => (
      <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} stroke={pen.ink} strokeWidth={1.3} strokeDasharray="4 5" strokeLinecap="round" opacity={0.7 * op} />
    );
    return (
      <g>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'rect', x, y, w, h }} fill={pen.floor ?? pen.light} progress={easeOut(P(0, 0.36))} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'path', d: rrect(x + inset, y + inset, w - 2 * inset, h - 2 * inset, 8) }} strokeWidth={1.4} roughness={0.6} progress={P(0.3, 0.52)} />
        {[0, 1, 2].map((i) => (
          <Sketch key={i} pen={pen} seed={s + 4 + i} shape={{ kind: 'line', x1: x + 30, y1: y + 72 + i * 18, x2: x + 30 + w * 0.5 - i * 14, y2: y + 72 + i * 18 }} strokeWidth={1.4} roughness={0.5} opacity={0.75} progress={P(0.56 + i * 0.05, 0.64 + i * 0.05)} />
        ))}
        <Sketch pen={pen} seed={s + 8} shape={{ kind: 'line', x1: sealX - 5, y1: sealY + 10, x2: sealX - 12, y2: sealY + 27 }} strokeWidth={pen.inkWidth + 1} roughness={0.6} progress={P(0.74, 0.82)} />
        <Sketch pen={pen} seed={s + 9} shape={{ kind: 'line', x1: sealX + 5, y1: sealY + 10, x2: sealX + 12, y2: sealY + 27 }} strokeWidth={pen.inkWidth + 1} roughness={0.6} progress={P(0.76, 0.84)} />
        <Sketch pen={pen} seed={s + 10} shape={{ kind: 'circle', cx: sealX, cy: sealY, r: sr }} fill={pen.palette.gold} roughness={0.6} progress={P(0.78, 0.88)} />
        <Sketch pen={pen} seed={s + 11} shape={{ kind: 'circle', cx: sealX, cy: sealY, r: sr * 0.55 }} roughness={0.5} strokeWidth={1.3} progress={P(0.86, 0.92)} />
        <Sketch pen={pen} seed={s + 12} shape={{ kind: 'path', d: sig }} strokeWidth={pen.inkWidth * 0.9} roughness={0.5} progress={P(0.9, 1)} />
        {P(0.5, 0.6) > 0 && children}
        {/* the coupon strip: its outline, the perforation to the body, then each stub's perforation + two ruled lines, top down */}
        {sT > 0 && (
          <g>
            <Sketch pen={pen} seed={s + 20} shape={{ kind: 'rect', x: g.strip.x, y: g.strip.y, w: g.strip.w, h: g.strip.h }} fill={pen.light} roughness={0.7} progress={easeOut(prog(sT, 0, 0.3))} />
            {perf(g.strip.x, y + 4, g.strip.x, y + h - 4, prog(sT, 0.2, 0.15), 100)}
            {g.stubs.map((st, i) => {
              const q = prog(sT, 0.25 + i * 0.09, 0.2);
              return (
                <g key={i}>
                  {i > 0 && perf(g.strip.x + 4, st.top, g.strip.x + g.strip.w - 4, st.top, q, 200 + i)}
                  <Sketch pen={pen} seed={s + 30 + i} shape={{ kind: 'line', x1: st.cx - 12, y1: st.cy - 6, x2: st.cx + 12, y2: st.cy - 6 }} strokeWidth={1.3} roughness={0.4} opacity={0.75} progress={prog(q, 0.3, 0.5)} />
                  <Sketch pen={pen} seed={s + 40 + i} shape={{ kind: 'line', x1: st.cx - 12, y1: st.cy + 6, x2: st.cx + 6, y2: st.cy + 6 }} strokeWidth={1.3} roughness={0.4} opacity={0.75} progress={prog(q, 0.5, 0.5)} />
                </g>
              );
            })}
          </g>
        )}
      </g>
    );
  };

// ---------------------------------------------------------------------------------------------------------------------
// the slot vault

/** geometry of a SlotVault standing on (x, gy): its top, the lip, the slot's centre (where a payment goes in), the door's centre */
export const slotVaultGeom = (x: number, gy: number, w = 150, h = 130) => {
  const top = gy - h;
  return { top, cx: x + w / 2, lip: { x: x - 6, y: top - 10, w: w + 12, h: 10 }, slot: [x + w / 2, top - 5] as [number, number], door: [x + w / 2, top + h * 0.55] as [number, number], doorR: Math.round(h * 0.28) };
};

/**
 * A squat strongbox standing on (x, gy), `w` x `h`: a grey body on two dark feet, a lip across its top (light) with a
 * narrow dark deposit SLOT in it, a round vault door (bank.tsx VaultDoor: disc, bolts, hand wheel, hinges) on its face.
 * Draws on body -> lip -> slot -> door -> feet over `dur`. A payment that drops in is painted by the scene BEFORE the
 * vault, so the lip and the body hide it once it is through the slot.
 */
export const SlotVault: React.FC<{ x: number; gy: number; w?: number; h?: number; t: number; pen: Pen; seed: number; dur?: number }> =
  ({ x, gy, w = 150, h = 130, t, pen, seed, dur = 0.7 }) => {
    if (t <= 0) return null;
    const s = seed * 10, P = stager(t, dur), Pa = pen.palette, g = slotVaultGeom(x, gy, w, h);
    return (
      <g>
        <Shadow cx={g.cx} cy={gy + 4} rx={w * 0.6} ry={8} t={t - dur * 0.3} />
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'rect', x, y: g.top, w, h }} fill={Pa.grey} progress={easeOut(P(0, 0.35))} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'rect', x: g.lip.x, y: g.lip.y, w: g.lip.w, h: g.lip.h }} fill={pen.light} roughness={0.7} progress={P(0.3, 0.45)} />
        <Sketch pen={pen} seed={s + 3} shape={{ kind: 'path', d: rrect(g.slot[0] - 28, g.slot[1] - 4, 56, 8, 4) }} fill={pen.dark} roughness={0.3} progress={P(0.42, 0.52)} />
        <VaultDoor cx={g.door[0]} cy={g.door[1]} r={g.doorR} t={t - dur * 0.45} pen={pen} seed={s + 5} dur={dur * 0.75} />
        {[x + 14, x + w - 26].map((fx, i) => (
          <Sketch key={i} pen={pen} seed={s + 8 + i} shape={{ kind: 'rect', x: fx, y: gy - 6, w: 12, h: 6 }} fill={pen.dark} roughness={0.4} progress={P(0.9 + i * 0.05, 0.95 + i * 0.05)} />
        ))}
      </g>
    );
  };

// ---------------------------------------------------------------------------------------------------------------------
// the lectern

/** geometry of a Lectern standing on (x, gy), `w` wide, `h` tall: the desk top (where a hand rests), the front panel (the nameplate), the mic */
export const lecternGeom = (x: number, gy: number, w = 110, h = 160) => {
  const top = gy - h;
  return {
    top, cx: x + w / 2, deskTop: top, deskBottom: top + 22, panel: { x, y: top + 22, w, h: 34 }, nameY: top + 48,
    col: { x: x + 25, y: top + 56, w: w - 50, h: h - 56 - 10 }, base: { x: x - 10, y: gy - 10, w: w + 20, h: 10 },
    micFoot: [x + w - 24, top + 6] as [number, number], micHead: [x + w - 46, top - 50] as [number, number],
  };
};

/**
 * A lectern standing on (x, gy), `w` x `h`, seen from the front and a little above: a base plate, a narrow column (brown,
 * wood), a wide reading desk on it (a brown front panel the scene writes the speaker's name on, children; a light top face
 * seen foreshortened), and a microphone on a gooseneck curving up from the desk's far corner (`micT`, its own cue; default
 * with the desk). Draws base -> column -> panel -> top -> mic over `dur`.
 */
export const Lectern: React.FC<{ x: number; gy: number; w?: number; h?: number; t: number; micT?: number; pen: Pen; seed: number; dur?: number; children?: React.ReactNode }> =
  ({ x, gy, w = 110, h = 160, t, micT, pen, seed, dur = 0.6, children }) => {
    if (t <= 0) return null;
    const s = seed * 10, P = stager(t, dur), Pa = pen.palette, g = lecternGeom(x, gy, w, h);
    const mT = micT ?? t - dur * 0.8;
    const topFace: [number, number][] = [[x - 4, g.deskBottom], [x + w + 4, g.deskBottom], [x + w - 2, g.deskTop + 4], [x + 2, g.deskTop + 8]];
    const neck = `M ${g.micFoot[0]} ${g.micFoot[1]} C ${g.micFoot[0] + 4} ${g.micFoot[1] - 24}, ${g.micHead[0] + 10} ${g.micHead[1] + 26}, ${g.micHead[0]} ${g.micHead[1] + 6}`;
    return (
      <g>
        <Sketch pen={pen} seed={s + 1} shape={{ kind: 'rect', x: g.base.x, y: g.base.y, w: g.base.w, h: g.base.h }} fill={Pa.grey} roughness={0.6} progress={easeOut(P(0, 0.18))} />
        <Sketch pen={pen} seed={s + 2} shape={{ kind: 'rect', x: g.col.x, y: g.col.y, w: g.col.w, h: g.col.h }} fill={Pa.brown} progress={easeOut(P(0.12, 0.42))} />
        <Sketch pen={pen} seed={s + 3} shape={{ kind: 'rect', x: g.panel.x, y: g.panel.y, w: g.panel.w, h: g.panel.h }} fill={Pa.brown} progress={easeOut(P(0.36, 0.64))} />
        <Sketch pen={pen} seed={s + 4} shape={{ kind: 'polygon', pts: topFace }} fill={pen.light} roughness={0.7} progress={easeOut(P(0.58, 0.8))} />
        {P(0.7, 0.8) > 0 && children}
        {mT > 0 && (
          <g>
            <Sketch pen={pen} seed={s + 6} shape={{ kind: 'path', d: neck }} strokeWidth={pen.inkWidth + 0.4} roughness={0.5} progress={easeOut(prog(mT, 0, 0.3))} />
            <Sketch pen={pen} seed={s + 7} shape={{ kind: 'ellipse', cx: g.micHead[0], cy: g.micHead[1], rx: 7, ry: 9 }} fill={pen.dark} roughness={0.4} progress={prog(mT, 0.25, 0.15)} />
          </g>
        )}
      </g>
    );
  };

// ---------------------------------------------------------------------------------------------------------------------
// the scaffold

/**
 * Tube-and-fitting scaffolding round a thing being built: two BAYS (each `{ x0, x1 }`, the outer and inner standard's x),
 * their standards rising from `gy` to above `deckY`; a ledger across each bay at every lift in `lifts` (y) and at `deckY`;
 * an X brace in every cell of each bay; a plank deck (brown boards) on a ledger spanning `span` at `deckY` (over the thing),
 * two guard posts and a rail above the deck. Draws standards -> ledgers -> braces -> deck -> rail over `dur`.
 */
export const Scaffold: React.FC<{ bays: { x0: number; x1: number }[]; gy: number; deckY: number; lifts?: number[]; span: [number, number]; rail?: number; t: number; pen: Pen; seed: number; dur?: number }> =
  ({ bays, gy, deckY, lifts = [], span, rail = 36, t, pen, seed, dur = 0.9 }) => {
    if (t <= 0) return null;
    const s = seed * 10, P = stager(t, dur), Pa = pen.palette, sw = pen.inkWidth * 0.95;
    const levels = [deckY, ...lifts, gy].sort((a, b) => a - b);          // the ledger levels, top down; cells between them
    const tube = (x1: number, y1: number, x2: number, y2: number, p: number, sd: number, w = sw) => (
      <Sketch pen={pen} seed={sd} shape={{ kind: 'line', x1, y1, x2, y2 }} strokeWidth={w} roughness={0.5} progress={easeOut(p)} />
    );
    let k = 0;
    return (
      <g>
        {/* standards: each bay's two posts, from the ground to a hand above the deck */}
        {bays.map((b, i) => (
          <g key={`s${i}`}>
            {tube(b.x0, gy, b.x0, deckY - 10, P(0 + i * 0.06, 0.3 + i * 0.06), s + 1 + i * 2, sw + 0.6)}
            {tube(b.x1, gy, b.x1, deckY - 10, P(0.06 + i * 0.06, 0.34 + i * 0.06), s + 2 + i * 2, sw + 0.6)}
          </g>
        ))}
        {/* ledgers across each bay at every level but the ground */}
        {bays.map((b, i) => levels.slice(0, -1).map((ly, j) => (
          <g key={`l${i}-${j}`}>{tube(b.x0, ly, b.x1, ly, P(0.28 + j * 0.05, 0.42 + j * 0.05), s + 20 + k++)}</g>
        )))}
        {/* X braces in every cell */}
        {bays.map((b, i) => levels.slice(0, -1).map((ly, j) => {
          const ny = levels[j + 1], p0 = 0.42 + j * 0.07;
          return (
            <g key={`x${i}-${j}`}>
              {tube(b.x0, ny, b.x1, ly, P(p0, p0 + 0.14), s + 60 + k++)}
              {tube(b.x1, ny, b.x0, ly, P(p0 + 0.05, p0 + 0.19), s + 60 + k++)}
            </g>
          );
        }))}
        {/* the plank deck on its ledger, spanning the thing being built */}
        {tube(span[0], deckY, span[1], deckY, P(0.64, 0.8), s + 100, sw + 0.4)}
        <Sketch pen={pen} seed={s + 101} shape={{ kind: 'rect', x: span[0] - 8, y: deckY - 9, w: span[1] - span[0] + 16, h: 9 }} fill={Pa.brown} roughness={0.6} progress={easeOut(P(0.7, 0.86))} />
        {[0.25, 0.5, 0.75].map((u, i) => (
          <Sketch key={`b${i}`} pen={pen} seed={s + 110 + i} shape={{ kind: 'line', x1: span[0] + (span[1] - span[0]) * u, y1: deckY - 9, x2: span[0] + (span[1] - span[0]) * u, y2: deckY }} strokeWidth={1.2} roughness={0.3} progress={P(0.84 + i * 0.03, 0.9 + i * 0.03)} />
        ))}
        {/* guard posts, a mid rail and the top rail above the deck (without the mid rail the posts + rail read as an empty box on the deck: visual-qa, WB10) */}
        {tube(span[0], deckY - 9, span[0], deckY - 9 - rail, P(0.82, 0.92), s + 120)}
        {tube(span[1], deckY - 9, span[1], deckY - 9 - rail, P(0.84, 0.94), s + 121)}
        {tube(span[0], deckY - 9 - rail / 2, span[1], deckY - 9 - rail / 2, P(0.88, 0.97), s + 123, sw * 0.8)}
        {tube(span[0], deckY - 9 - rail, span[1], deckY - 9 - rail, P(0.9, 1), s + 122, sw + 0.4)}
      </g>
    );
  };

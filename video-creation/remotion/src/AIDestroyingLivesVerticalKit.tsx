// AIDestroyingLivesVerticalKit.tsx: the portrait (1080x1920) twins of the hand-rolled pieces in AIDestroyingLivesKit.tsx
// (vertical-repurpose.md section 2): the elegant-promo C19 device on the PORTRAIT geometry
// (assets/vertical/slide-sources/ep-geometry.json; same device numbers, same timing), the portrait receipt stage (every
// vertical receipt is a pre-framed 1080x1920 mobile capture: a settling push about its quoted line + the multiply highlight
// wipe in capture = frame coordinates), and the label chip placed for the tall frame. Every component takes its clock as
// props (t = source-spine seconds): no local useCurrentFrame, so a node renders the same in any Sequence nesting (6a).
import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { pw } from './AIDestroyingLivesKit';

export const VW = 1080;
export const VH = 1920;
export const fillV: React.CSSProperties = { position: 'absolute', left: 0, top: 0, width: VW, height: VH, objectFit: 'cover' };
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const eOutCubic = (p: number) => 1 - Math.pow(1 - p, 3);

// ------------------------------------------------------------------------------------------------------------------
// RECEIPTS (portrait): the capture IS the frame (1080x1920). push = 1 -> 1.04 about the quoted line's centre, eased over
// min(1.6 s, 55% of the slot), then a further 2% drift; still = a slow 1 -> 1.05 push about the centre; pan = the full view
// handed to the library MOTION engine (the comp's MotionWrap). Scale never drops under 1 about a point inside the frame, so
// the frame stays covered. Highlights: #ffe14d, multiply, in capture coordinates INSIDE the camera transform, wiping left to
// right line by line between t0 and t1 (rects measured with Windows OCR on the portrait captures).
export type HL = { rects: number[][]; t0: number; t1: number };
export type ReceiptV = { src: string; bg: string; mode: 'push' | 'pan' | 'still'; hl?: HL[] };
const focusOf = (r: ReceiptV): [number, number] => {
  const all = (r.hl ?? []).flatMap((h) => h.rects);
  if (!all.length || r.mode === 'still') return [VW / 2, VH / 2];
  const x0 = Math.min(...all.map((q) => q[0])), x1 = Math.max(...all.map((q) => q[0] + q[2]));
  const y0 = Math.min(...all.map((q) => q[1])), y1 = Math.max(...all.map((q) => q[1] + q[3]));
  return [(x0 + x1) / 2, (y0 + y1) / 2];
};
export const receiptScaleV = (r: ReceiptV, t: number, tIn: number, tOut: number) => {
  const slot = Math.max(0.1, tOut - tIn);
  const lt = Math.max(0, t - tIn);
  if (r.mode === 'pan') return 1;
  if (r.mode === 'still') return 1 + 0.05 * clamp01(lt / slot);
  const settle = Math.min(1.6, slot * 0.55);
  return 1 + 0.04 * eOutCubic(clamp01(lt / settle)) + 0.02 * clamp01((lt - settle) / Math.max(0.1, slot - settle));
};
export const ReceiptStageV: React.FC<{ r: ReceiptV; s: number; t: number }> = ({ r, s, t }) => {
  const [fx, fy] = focusOf(r);
  const hls = r.hl ?? [];
  return (
    <AbsoluteFill style={{ background: r.bg, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: VW, height: VH, transformOrigin: `${fx}px ${fy}px`, transform: `scale(${s})` }}>
        <Img src={staticFile(r.src)} style={{ position: 'absolute', left: 0, top: 0, width: VW, height: VH }} />
        {hls.map((h, i) => {
          const total = h.rects.reduce((a, q) => a + q[2], 0);
          const done = clamp01((t - h.t0) / Math.max(0.05, h.t1 - h.t0)) * total;
          let acc = 0;
          return h.rects.map((q, j) => {
            const w = Math.max(0, Math.min(q[2], done - acc));
            acc += q[2];
            if (w <= 0) return null;
            const padY = q[3] * 0.12;
            return <div key={`${i}-${j}`} style={{ position: 'absolute', left: q[0] - 6, top: q[1] - padY, width: w + 12, height: q[3] + 2 * padY,
              background: '#ffe14d', mixBlendMode: 'multiply', borderRadius: 3 }} />;
          });
        })}
      </div>
    </AbsoluteFill>
  );
};

// the label chip of a recording receipt, placed for the tall frame (inside the phone-safe band y 110-1700), wraps at 936 px
// band = a full-width lower-third strip (a scrolling text recording: a floating chip would sit across body lines)
export const LabelChipV: React.FC<{ text: string; text2?: string; p2: number; at: React.CSSProperties; p: number; band?: boolean }> = ({ text, text2, p2, at, p, band }) => {
  const chip: React.CSSProperties = { background: 'rgba(10,12,16,.95)', border: '1px solid rgba(255,255,255,.18)', boxShadow: '0 6px 24px rgba(0,0,0,.55)', borderRadius: 12, padding: '14px 24px',
    fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 36, lineHeight: 1.25, color: '#e8eaf0', maxWidth: 936,
    ...(band ? { maxWidth: 'none', width: VW, borderRadius: 0, borderLeft: 'none', borderRight: 'none', padding: '20px 72px', background: '#0a0c10' } : {}) };
  return (
    <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10, opacity: p, ...at }}>
      <div style={chip}>{text}</div>
      {text2 && <div style={{ ...chip, fontWeight: 500, fontSize: 32, color: '#8892a4', opacity: p2 }}>{text2}</div>}
    </div>
  );
};

// ------------------------------------------------------------------------------------------------------------------
// ELEGANT PROMO, portrait (effects theme elegant-promo-2022, device ep-elegant-promo = ep-iris-open + ep-circle-burst +
// ep-disc-sweep + ep-label-title; the SAME library.json device numbers and timing as AIDestroyingLivesKit.PromoCard). The
// geometry is the portrait card's (ep-geometry.json: disc, bar, subs, src, anchor, titleDir); the overlay is
// card-slides/C19-n-overlay.png (1080x1920) over the portrait plate img/IMG-n.png; the disc sweep reveals the portrait
// discs-only plate comp-derived/C19-n-discs.png (the overlay with its labels inpainted out,
// _previews/vertical/comp-build/make_discs_v.py). The iris / burst entry circles are the 16:9 template's, their centres
// mapped onto the tall frame (x * 1080/1920, y * 1920/1080), radii unchanged (each still ends covering the frame).
type Rect4 = [number, number, number, number];
export type PromoV = {
  id: string; img: string; tIn: number; H: number; entry: 'iris' | 'burst'; entryDur: number;
  disc: [number, number, number]; bar: Rect4; anchor: 'left' | 'right'; subs: Rect4[]; src: Rect4; titleDir: 'ltr' | 'rtl';
};
const DISC_R = [[1.55, 0], [1.62, 300], [1.77, 557], [1.80, 566], [1.87, 851], [1.94, 982], [2.0, 1091], [2.07, 1169], [2.14, 1228], [2.2, 1275],
  [2.27, 1313], [2.34, 1358], [2.47, 1393], [2.6, 1421], [2.87, 1454], [3.2, 1457]];
const BAR_W = [[0, 0], [0.07, 0.01], [0.2, 0.03], [0.4, 0.08], [0.6, 0.25], [0.7, 0.45], [0.8, 0.67], [0.94, 0.81], [1.07, 0.88], [1.2, 0.93],
  [1.4, 0.97], [1.6, 0.99], [1.87, 1]];
const TITLE_P = [[1.3, 0], [1.5, 0.5], [2.08, 0.9], [2.43, 1]];
const mapX = (x: number) => (x * VW) / 1920;
const mapY = (y: number) => (y * VH) / 1080;
const BURST: [number, number, number[][]][] = ([
  [1300, 500, [[0.3, 0], [0.37, 35], [0.4, 46], [0.43, 58], [0.47, 75], [0.5, 98], [0.53, 125], [0.57, 160], [0.6, 192], [0.8, 300], [1.0, 430], [1.2, 560], [1.43, 760], [1.5, 1500]]],
  [-120, 1200, [[0.7, 0], [0.8, 230], [1.0, 470], [1.2, 620], [1.43, 840], [1.5, 1500]]],
  [145, -40, [[0.83, 0], [0.95, 230], [1.1, 400], [1.3, 560], [1.43, 700], [1.5, 1300]]],
  [1340, -80, [[0.93, 0], [1.05, 250], [1.2, 390], [1.43, 600], [1.5, 1100]]],
  [1640, 1150, [[0.97, 0], [1.1, 260], [1.25, 420], [1.43, 600], [1.5, 1000]]],
  [595, 520, [[1.07, 0], [1.2, 200], [1.35, 340], [1.43, 420], [1.5, 900]]],
] as [number, number, number[][]][]).map(([x, y, s]) => [mapX(x), mapY(y), s]);
const IRIS: [number, number, number[][]][] = ([
  [620, 580, [[0.067, 0], [0.23, 10], [0.3, 18], [0.37, 34], [0.4, 44], [0.47, 70], [0.5, 90], [0.53, 114], [0.57, 142], [0.6, 174], [0.63, 206],
    [0.67, 232], [0.7, 252], [0.73, 268], [0.77, 284], [0.8, 298], [0.83, 308], [0.87, 320], [0.9, 326], [1.2, 420], [1.47, 700], [1.55, 1200]]],
  [2150, -80, [[0.8, 0], [0.87, 619], [1.0, 948], [1.2, 1080], [1.47, 1300], [1.55, 1800]]],
  [-60, -40, [[0.93, 0], [1.05, 300], [1.25, 520], [1.47, 800]]],
  [1343, 545, [[0.97, 0], [1.1, 150], [1.3, 320], [1.47, 520]]],
  [-80, 1160, [[0.97, 0], [1.1, 300], [1.3, 560], [1.47, 820]]],
  [1990, 1150, [[1.07, 0], [1.2, 250], [1.35, 450], [1.47, 640]]],
] as [number, number, number[][]][]).map(([x, y, s]) => [mapX(x), mapY(y), s]);
const circlesPath = (cs: [number, number, number][]) =>
  cs.filter(([, , r]) => r > 0.5).map(([cx, cy, r]) => `M ${cx - r} ${cy} a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0 Z`).join(' ');
const rectPath = ([x0, y0, x1, y1]: Rect4, pad: number) => `M ${x0 - pad} ${y0 - pad} H ${x1 + pad} V ${y1 + pad} H ${x0 - pad} Z`;
const wipeMask = (x0: number, x1: number, p: number, dir: 'ltr' | 'rtl', soft = 70, invert = false): React.CSSProperties => {
  const span = x1 - x0 + soft;
  const [a, b] = invert ? ['transparent', '#000'] : ['#000', 'transparent'];
  let g: string;
  if (dir === 'ltr') {
    const e = x0 - soft + span * p;
    g = `linear-gradient(90deg, ${a} ${e}px, ${b} ${e + soft}px)`;
  } else {
    const e = x1 + soft - span * p;
    g = `linear-gradient(90deg, ${b} ${e - soft}px, ${a} ${e}px)`;
  }
  return { WebkitMaskImage: g, maskImage: g, WebkitMaskSize: `${VW}px ${VH}px`, maskSize: `${VW}px ${VH}px`, WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat' };
};

export const PromoCardV: React.FC<{ c: PromoV; t: number }> = ({ c, t }) => {
  const lt = Math.max(0, t - c.tIn);
  const D = c.H - 1.1;
  const push = Math.pow(1.038, lt);
  const plate = (
    <AbsoluteFill style={{ overflow: 'hidden', background: '#04090F' }}>
      <Img src={staticFile('img/' + c.img + '.png')} style={{ ...fillV, transform: `scale(${push}) rotate(${-0.06 * lt}deg)`, transformOrigin: '50% 50%' }} />
    </AbsoluteFill>
  );
  const ov = staticFile('card-slides/' + c.id + '-overlay.png');
  const discs = staticFile('comp-derived/' + c.id + '-discs.png');
  const td = 1.77 + (t - D);
  const R = (pw(DISC_R, td) * c.disc[2]) / 1457;
  const bw = pw(BAR_W, t - (D + 0.63));
  const [bx0, by0, bx1, by1] = c.bar;
  const bW = bx1 - bx0 + 1;
  const barClip = c.anchor === 'left' ? `inset(0 ${(1 - bw) * 100}% 0 0)` : `inset(0 0 0 ${(1 - bw) * 100}%)`;
  const tp = pw(TITLE_P, t - D);
  const subP = clamp01((t - (D + 1.77)) / 0.8);
  const srcP = clamp01((t - (D + 1.95)) / 0.8);
  type Region = { path: string; x0: number; x1: number; p: number; dir: 'ltr' | 'rtl'; soft: number; bar: boolean };
  const regions: Region[] = [
    { path: rectPath(c.bar, 16), x0: bx0 - 14, x1: bx1 + 14, p: tp, dir: c.titleDir, soft: 70, bar: true },
    ...c.subs.map((r) => ({ path: rectPath(r, 8), x0: r[0], x1: r[2], p: subP, dir: 'ltr' as const, soft: 90, bar: false })),
    { path: rectPath(c.src, 8), x0: c.src[0], x1: c.src[2], p: srcP, dir: 'ltr' as const, soft: 90, bar: false },
  ];
  const frameRect = `M -10 -10 H ${VW + 10} V ${VH + 10} H -10 Z`;
  const overlay = (
    <AbsoluteFill>
      {R > 0.5 && (
        <AbsoluteFill style={{ clipPath: `circle(${R}px at ${c.disc[0]}px ${c.disc[1]}px)` }}>
          <AbsoluteFill style={{ clipPath: `path(evenodd, '${frameRect} ${regions.map((r) => r.path).join(' ')}')` }}>
            <Img src={discs} style={fillV} />
          </AbsoluteFill>
          {regions.map((r, i) => (
            <AbsoluteFill key={`rg${i}`} style={{ clipPath: `path('${r.path}')` }}>
              {r.p < 1 && (
                <AbsoluteFill style={r.p > 0 ? wipeMask(r.x0, r.x1, r.p, r.dir, r.soft, true) : undefined}>
                  <Img src={discs} style={fillV} />
                </AbsoluteFill>
              )}
              {r.bar && bw > 0 && (
                <div style={{ position: 'absolute', left: bx0, top: by0, width: bW, height: by1 - by0 + 1, clipPath: barClip,
                  background: 'linear-gradient(90deg, #38C1A9, #135FB5)' }} />
              )}
              {r.p > 0 && (
                <AbsoluteFill style={r.p < 1 ? wipeMask(r.x0, r.x1, r.p, r.dir, r.soft) : undefined}>
                  <Img src={ov} style={fillV} />
                </AbsoluteFill>
              )}
            </AbsoluteFill>
          ))}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
  const scene = (
    <AbsoluteFill>
      {plate}
      {overlay}
    </AbsoluteFill>
  );
  if (lt < c.entryDur) {
    if (c.entry === 'iris') {
      const tau = 0.067 + (lt / c.entryDur) * (1.55 - 0.067);
      const cs = IRIS.map(([x, y, s]) => [x, y, pw(s, tau)] as [number, number, number]);
      const irisR = cs[0][2];
      return (
        <AbsoluteFill style={{ background: 'linear-gradient(90deg, #0F1C2D 0px, #0B1623 120px, #04090F 250px)' }}>
          <AbsoluteFill style={{ background: `radial-gradient(circle at ${IRIS[0][0]}px ${IRIS[0][1]}px, rgba(47,51,55,${irisR > 2 ? 1 : 0}) ${irisR}px, rgba(47,51,55,0) ${irisR + 95}px)` }} />
          <AbsoluteFill style={{ filter: 'drop-shadow(0 0 22px rgba(0,0,0,.75))' }}>
            <AbsoluteFill style={{ clipPath: `path('${circlesPath(cs) || 'M 0 0 Z'}')` }}>{scene}</AbsoluteFill>
          </AbsoluteFill>
        </AbsoluteFill>
      );
    }
    const tau = 0.3 + (lt / c.entryDur) * (1.5 - 0.3);
    const cs = BURST.map(([x, y, s]) => [x, y, pw(s, tau)] as [number, number, number]);
    return (
      <AbsoluteFill style={{ filter: 'drop-shadow(0 0 16px rgba(0,0,0,.55))' }}>
        <AbsoluteFill style={{ clipPath: `path('${circlesPath(cs) || 'M 0 0 Z'}')` }}>{scene}</AbsoluteFill>
      </AbsoluteFill>
    );
  }
  return scene;
};

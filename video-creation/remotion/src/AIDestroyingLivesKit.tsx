// AIDestroyingLivesKit.tsx: the hand-rolled pieces of the "AI destroying lives" comp (comp-build.md sections 4-6):
//  - the elegant-promo-2022 C19 fact cards (devices ep-iris-open, ep-circle-burst, ep-disc-sweep, ep-label-title, built here
//    to the library.json device rows' measured numbers: no shared engine exists for this theme yet, effects/README.md),
//  - the receipt stage (measured frame rect per capture, settling push, multiply highlight wipe in capture coordinates),
//  - the film burn (the video's face pick, hand:film-burn), the still warp (hand:cross-warp),
//  - clip players (muted OffthreadVideo, last frame held by a real <Freeze>).
// Every component takes its clock as props (t = source-spine seconds, abs = composition frame): no local useCurrentFrame,
// so a node renders the same in any Sequence nesting (comp-build.md section 6a).
import React from 'react';
import { AbsoluteFill, Freeze, Img, OffthreadVideo, Sequence, staticFile } from 'remotion';

export const FPS = 30;
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const eOutCubic = (p: number) => 1 - Math.pow(1 - p, 3);
export const fill: React.CSSProperties = { position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, objectFit: 'cover' };
// piecewise-linear sample of [[t, v], ...]
export const pw = (s: number[][], t: number) => {
  if (t <= s[0][0]) return s[0][1];
  for (let i = 1; i < s.length; i++) {
    if (t <= s[i][0]) {
      const [t0, v0] = s[i - 1];
      const [t1, v1] = s[i];
      return v0 + ((v1 - v0) * (t - t0)) / (t1 - t0);
    }
  }
  return s[s.length - 1][1];
};

// ------------------------------------------------------------------------------------------------------------------
// A real freeze of one frame of a video (comp-build.md 6a rule 1: <Freeze> wrapped in a zero-offset Sequence so the
// frozen frame is exactly `frame` in any nesting). `frame` is in the video's own frames (rate 1).
export const FrozenVideo: React.FC<{ src: string; frame: number; style?: React.CSSProperties }> = ({ src, frame, style }) => (
  <Sequence from={0} layout="none">
    <Freeze frame={frame}>
      <OffthreadVideo src={staticFile(src)} muted style={style ?? fill} />
    </Freeze>
  </Sequence>
);

// A clip that plays muted from its frame 0 at `rate` (frame-for-frame for 24/25 fps sources) and HOLDS its last frame once
// it runs out (never a blank frame). Mount it inside a Sequence that starts where the clip starts; `skip` = local frames
// already elapsed before this node's Sequence start (a row that starts early under a dissolve starts the clip early too).
export const ClipPlay: React.FC<{ src: string; durFrames: number; clipFrames: number; clipFps?: number; rate?: number; style?: React.CSSProperties }> = ({
  src, durFrames, clipFrames, clipFps = 30, rate = 1, style,
}) => {
  const lastT = (clipFrames - 1) / clipFps;                  // media time of the file's last frame
  const playable = Math.floor((lastT * FPS) / rate);         // last local frame whose media time is still inside the file
  const st = style ?? fill;
  return (
    <>
      <Sequence from={0} durationInFrames={Math.max(1, Math.min(durFrames, playable + 1))} layout="none">
        <OffthreadVideo src={staticFile(src)} muted playbackRate={rate} style={st} />
      </Sequence>
      {durFrames > playable + 1 && (
        <Sequence from={playable + 1} durationInFrames={durFrames - playable - 1} layout="none">
          <FrozenVideo src={src} frame={Math.floor(lastT * FPS)} style={st} />
        </Sequence>
      )}
    </>
  );
};

// ------------------------------------------------------------------------------------------------------------------
// hand:film-burn: the video's face pick (TRANSITIONS.md section 3), a warm radial flash 0.38 s each side of the cut, silent,
// intensity low (the brief: soft, slow). Peak ON the cut frame.
export const FilmBurn: React.FC<{ abs: number; cut: number; seed: number }> = ({ abs, cut, seed }) => {
  const d = abs - cut;
  const half = 0.38 * FPS;
  if (Math.abs(d) > half) return null;
  const env = Math.pow(1 - Math.abs(d) / half, 1.6);
  const k = 0.62 * env;
  const side = seed % 2 === 0;
  const cx = (side ? 14 : 86) + (side ? 1 : -1) * (d / half) * 9;
  const cy = 38 + ((seed * 17) % 24);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: k,
        background: `radial-gradient(ellipse 70% 85% at ${cx}% ${cy}%, rgba(255,228,170,1) 0%, rgba(255,150,52,.9) 22%, rgba(214,70,14,.55) 46%, rgba(120,20,0,0) 74%)` }} />
      <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: k * 0.38, background: 'rgb(255,168,92)' }} />
    </AbsoluteFill>
  );
};

// hand:cross-warp (the silent still warp, TRANSITIONS.md section 2): the incoming still fades in through a soft turbulence
// displacement that peaks mid-ingress and settles to zero, with a 1.04 -> 1 settle. p = ingress progress 0..1.
export const WarpIn: React.FC<{ p: number; id: string; children: React.ReactNode }> = ({ p, id, children }) => {
  const q = clamp01(p);
  if (q >= 1) return <>{children}</>;
  const amt = 70 * Math.sin(Math.PI * q);
  return (
    <AbsoluteFill style={{ opacity: eOutCubic(q), transform: `scale(${1.04 - 0.04 * eOutCubic(q)})` }}>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id={id} x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.006 0.011" numOctaves={2} seed={7} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={amt} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
      <AbsoluteFill style={{ filter: `url(#${id})` }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------------------------------------------------------
// RECEIPTS: each capture is shown through a MEASURED frame rect [x0, y0, fw] in capture pixels (fh = fw * 9 / 16), from the
// Windows-OCR word boxes of the quoted line (visual-qa: frame the highlight, never the old top-to-88% pan). push = a settling
// push from a wider view onto the rect (eased over min(1.6 s, 55% of the slot)), then a 2% drift; still = a slow 1 -> 1.05
// push of a 1920x1080 frame; pan = the base view handed to the library MOTION engine. Highlights: #ffe14d, multiply, in
// capture coordinates inside the camera transform, wiping left to right line by line between t0 and t1.
export type RView = [number, number, number];
export type Receipt = {
  src: string; W: number; H: number; bg: string; mode: 'push' | 'pan' | 'still';
  to: RView; from?: RView | null; hl?: { rects: number[][]; t0: number; t1: number }[];
};
const zoomAbout = (v: RView, k: number): RView => {
  const fh = (v[2] * 9) / 16;
  const cx = v[0] + v[2] / 2, cy = v[1] + fh / 2;
  const w = v[2] * k;
  return [cx - w / 2, cy - (w * 9) / 16 / 2, w];
};
export const receiptView = (r: Receipt, t: number, tIn: number, tOut: number): RView => {
  const slot = Math.max(0.1, tOut - tIn);
  const lt = Math.max(0, t - tIn);
  if (r.mode === 'pan') return r.to;
  if (r.mode === 'still') return zoomAbout(r.to, 1 / (1 + 0.05 * clamp01(lt / slot)));
  const from = r.from ?? zoomAbout(r.to, 1.08);
  const settle = Math.min(1.6, slot * 0.55);
  const p = eOutCubic(clamp01(lt / settle));
  const v: RView = [from[0] + (r.to[0] - from[0]) * p, from[1] + (r.to[1] - from[1]) * p, from[2] + (r.to[2] - from[2]) * p];
  return zoomAbout(v, 1 / (1 + 0.02 * clamp01((lt - settle) / Math.max(0.1, slot - settle))));
};
export const ReceiptStage: React.FC<{ r: Receipt; view: RView; t: number }> = ({ r, view, t }) => {
  const k = 1920 / view[2];
  const hls = r.hl ?? [];
  return (
    <AbsoluteFill style={{ background: r.bg, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: r.W, height: r.H, transformOrigin: '0 0',
        transform: `scale(${k}) translate(${-view[0]}px, ${-view[1]}px)` }}>
        <Img src={staticFile(r.src)} style={{ position: 'absolute', left: 0, top: 0, width: r.W, height: r.H }} />
        {hls.map((h, i) => {
          const total = h.rects.reduce((a, q) => a + q[2], 0);
          const done = clamp01((t - h.t0) / Math.max(0.05, h.t1 - h.t0)) * total;
          let acc = 0;
          return h.rects.map((q, j) => {
            const w = Math.max(0, Math.min(q[2], done - acc));
            acc += q[2];
            if (w <= 0) return null;
            const padY = q[3] * 0.22;
            return <div key={`${i}-${j}`} style={{ position: 'absolute', left: q[0] - 6, top: q[1] - padY, width: w + 12, height: q[3] + 2 * padY,
              background: '#ffe14d', mixBlendMode: 'multiply', borderRadius: 3 }} />;
          });
        })}
      </div>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------------------------------------------------------
// ELEGANT PROMO (effects theme elegant-promo-2022, device ep-elegant-promo = ep-iris-open + ep-circle-burst + ep-disc-sweep
// + ep-label-title; library.json rows, every number measured on the 2022 render). SILENT, as in its source.
// The settled look is the slide-builder's card-slides/C19-n.png = IMG-n plate + C19-n-overlay.png; the comp composites the
// plate (pushing +3.8 percent a second, compounded, a slight roll) and reveals the overlay with the device motion:
//  disc sweep  = the overlay's discs revealed by ONE circle on the measured centre, radius on the measured curve,
//  label title = a code bar (the overlay's own sampled ramp #38C1A9 -> #135FB5) wiping from its anchored end on the measured
//                curve, then the overlay's bar+title pixels revealed over it in reading order (same pixels under, so only the
//                letters appear), then the sub-lines and the source line come to full white in reading order.
// Timing: D = headline cue - 1.1 s (the EDIT-PLAN: the disc sweep about 1.1 s ahead of the number), template offsets from D.
type Rect4 = [number, number, number, number];
export type Promo = {
  id: string; img: string; tIn: number; H: number; entry: 'iris' | 'burst'; entryDur: number;
  disc: [number, number, number]; bar: Rect4; anchor: 'left' | 'right'; title: Rect4; subs: Rect4[]; src: Rect4; titleDir: 'ltr' | 'rtl';
};
const DISC_R = [[1.55, 0], [1.62, 300], [1.77, 557], [1.80, 566], [1.87, 851], [1.94, 982], [2.0, 1091], [2.07, 1169], [2.14, 1228], [2.2, 1275],
  [2.27, 1313], [2.34, 1358], [2.47, 1393], [2.6, 1421], [2.87, 1454], [3.2, 1457]];
const BAR_W = [[0, 0], [0.07, 0.01], [0.2, 0.03], [0.4, 0.08], [0.6, 0.25], [0.7, 0.45], [0.8, 0.67], [0.94, 0.81], [1.07, 0.88], [1.2, 0.93],
  [1.4, 0.97], [1.6, 0.99], [1.87, 1]];
const TITLE_P = [[1.3, 0], [1.5, 0.5], [2.08, 0.9], [2.43, 1]];
// ep-circle-burst, scene-change variant (template seconds from the slot start; coverage tuned to the measured curve)
const BURST: [number, number, number[][]][] = [
  [1300, 500, [[0.3, 0], [0.37, 35], [0.4, 46], [0.43, 58], [0.47, 75], [0.5, 98], [0.53, 125], [0.57, 160], [0.6, 192], [0.8, 300], [1.0, 430], [1.2, 560], [1.43, 760], [1.5, 1500]]],
  [-120, 1200, [[0.7, 0], [0.8, 230], [1.0, 470], [1.2, 620], [1.43, 840], [1.5, 1500]]],
  [145, -40, [[0.83, 0], [0.95, 230], [1.1, 400], [1.3, 560], [1.43, 700], [1.5, 1300]]],
  [1340, -80, [[0.93, 0], [1.05, 250], [1.2, 390], [1.43, 600], [1.5, 1100]]],
  [1640, 1150, [[0.97, 0], [1.1, 260], [1.25, 420], [1.43, 600], [1.5, 1000]]],
  [595, 520, [[1.07, 0], [1.2, 200], [1.35, 340], [1.43, 420], [1.5, 900]]],
];
// ep-iris-open + the burst's open variant over the navy field
const IRIS: [number, number, number[][]][] = [
  [620, 580, [[0.067, 0], [0.23, 10], [0.3, 18], [0.37, 34], [0.4, 44], [0.47, 70], [0.5, 90], [0.53, 114], [0.57, 142], [0.6, 174], [0.63, 206],
    [0.67, 232], [0.7, 252], [0.73, 268], [0.77, 284], [0.8, 298], [0.83, 308], [0.87, 320], [0.9, 326], [1.2, 420], [1.47, 700], [1.55, 1200]]],
  [2150, -80, [[0.8, 0], [0.87, 619], [1.0, 948], [1.2, 1080], [1.47, 1300], [1.55, 1800]]],
  [-60, -40, [[0.93, 0], [1.05, 300], [1.25, 520], [1.47, 800]]],
  [1343, 545, [[0.97, 0], [1.1, 150], [1.3, 320], [1.47, 520]]],
  [-80, 1160, [[0.97, 0], [1.1, 300], [1.3, 560], [1.47, 820]]],
  [1990, 1150, [[1.07, 0], [1.2, 250], [1.35, 450], [1.47, 640]]],
];
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
  return { WebkitMaskImage: g, maskImage: g, WebkitMaskSize: '1920px 1080px', maskSize: '1920px 1080px', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat' };
};

export const PromoCard: React.FC<{ c: Promo; t: number }> = ({ c, t }) => {
  const lt = Math.max(0, t - c.tIn);
  const D = c.H - 1.1;
  // the plate: +3.8 percent a second compounded, centred, a slight roll (ep-elegant-promo photo_move)
  const push = Math.pow(1.038, lt);
  const plate = (
    <AbsoluteFill style={{ overflow: 'hidden', background: '#04090F' }}>
      <Img src={staticFile('img/' + c.img + '.png')} style={{ ...fill, transform: `scale(${push}) rotate(${-0.06 * lt}deg)`, transformOrigin: '50% 50%' }} />
    </AbsoluteFill>
  );
  // overlay pieces
  const ov = staticFile('card-slides/' + c.id + '-overlay.png');
  const td = 1.77 + (t - D);
  const R = (pw(DISC_R, td) * c.disc[2]) / 1457;
  // the disc sweep reveals the DISCS ONLY plate (assets/comp-derived/<id>-discs.png: this overlay with its label inpainted out,
  // _previews/comp-build/make_discs.py), so no label shows before its own device layer reveals it over the disc
  const discs = staticFile('comp-derived/' + c.id + '-discs.png');
  const bw = pw(BAR_W, t - (D + 0.63));
  const [bx0, by0, bx1, by1] = c.bar;
  const bW = bx1 - bx0 + 1;
  const barClip = c.anchor === 'left' ? `inset(0 ${(1 - bw) * 100}% 0 0)` : `inset(0 0 0 ${(1 - bw) * 100}%)`;
  const tp = pw(TITLE_P, t - D);
  const subP = clamp01((t - (D + 1.77)) / 0.8);
  const srcP = clamp01((t - (D + 1.95)) / 0.8);
  // label regions (never nested): inside each one the discs plate (inverse wipe) hands over to the overlay (forward wipe), so
  // the translucent disc is never doubled and only the letters appear
  type Region = { path: string; x0: number; x1: number; p: number; dir: 'ltr' | 'rtl'; soft: number; bar: boolean };
  const regions: Region[] = [
    { path: rectPath(c.bar, 16), x0: bx0 - 14, x1: bx1 + 14, p: tp, dir: c.titleDir, soft: 70, bar: true },
    ...c.subs.map((r) => ({ path: rectPath(r, 8), x0: r[0], x1: r[2], p: subP, dir: 'ltr' as const, soft: 90, bar: false })),
    { path: rectPath(c.src, 8), x0: c.src[0], x1: c.src[2], p: srcP, dir: 'ltr' as const, soft: 90, bar: false },
  ];
  const frameRect = 'M -10 -10 H 1930 V 1090 H -10 Z';
  const overlay = (
    <AbsoluteFill>
      {R > 0.5 && (
        <AbsoluteFill style={{ clipPath: `circle(${R}px at ${c.disc[0]}px ${c.disc[1]}px)` }}>
          <AbsoluteFill style={{ clipPath: `path(evenodd, '${frameRect} ${regions.map((r) => r.path).join(' ')}')` }}>
            <Img src={discs} style={fill} />
          </AbsoluteFill>
          {regions.map((r, i) => (
            <AbsoluteFill key={`rg${i}`} style={{ clipPath: `path('${r.path}')` }}>
              {r.p < 1 && (
                <AbsoluteFill style={r.p > 0 ? wipeMask(r.x0, r.x1, r.p, r.dir, r.soft, true) : undefined}>
                  <Img src={discs} style={fill} />
                </AbsoluteFill>
              )}
              {r.bar && bw > 0 && (
                <div style={{ position: 'absolute', left: bx0, top: by0, width: bW, height: by1 - by0 + 1, clipPath: barClip,
                  background: 'linear-gradient(90deg, #38C1A9, #135FB5)' }} />
              )}
              {r.p > 0 && (
                <AbsoluteFill style={r.p < 1 ? wipeMask(r.x0, r.x1, r.p, r.dir, r.soft) : undefined}>
                  <Img src={ov} style={fill} />
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
  // the entry
  if (lt < c.entryDur) {
    if (c.entry === 'iris') {
      const tau = 0.067 + (lt / c.entryDur) * (1.55 - 0.067);
      const cs = IRIS.map(([x, y, s]) => [x, y, pw(s, tau)] as [number, number, number]);
      const irisR = cs[0][2];
      return (
        <AbsoluteFill style={{ background: 'linear-gradient(90deg, #0F1C2D 0px, #0B1623 120px, #04090F 250px)' }}>
          <AbsoluteFill style={{ background: `radial-gradient(circle at 620px 580px, rgba(47,51,55,${irisR > 2 ? 1 : 0}) ${irisR}px, rgba(47,51,55,0) ${irisR + 95}px)` }} />
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

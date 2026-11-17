// CantonKit.tsx: the canton comp's private kit (its own file, Canton* prefix; never imported by another project).
// 1. ONE absolute clock (comp-build.md section 6a): every node the comp hands to an engine, and every cover / body
//    element, reads the COMPOSITION frame from this context, never useCurrentFrame(), so a node re-mounted inside an
//    engine's nested Sequences (or frozen for a still) shows exactly what airs at that frame.
// 2. The RECEIPT camera: a capture shown full width, a camera rect (capture px) eased between keyframes cued to the
//    words, and highlights drawn in CAPTURE coordinates inside the camera transform so they ride the push
//    (comp-build.md section 6 HIGHLIGHT: #ffe14d multiply on a light page; on a dark page the Canton lime ink).
//    Every number below was read off the capture (gridded previews + box crops in _previews/qa/comp-build/grid/).
import React, { createContext, useContext } from 'react';
import { AbsoluteFill, Easing, Img, staticFile } from 'remotion';

export type Clock = { abs: number; F: (t: number) => number };
export const ClockCtx = createContext<Clock>({ abs: 0, F: (t: number) => Math.round(t * 30) });
export const useClock = () => useContext(ClockCtx);

/** Re-provide the clock frozen at composition frame `at` (a faithful still of what airs at that frame). */
export const FrozenClock: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const c = useClock();
  return <ClockCtx.Provider value={{ abs: at, F: c.F }}>{children}</ClockCtx.Provider>;
};

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const easeInOut = Easing.bezier(0.45, 0, 0.25, 1);
export const easeOut = Easing.bezier(0.2, 0.7, 0.3, 1);

// ---------------------------------------------------------------------------------------------------------------
// RECEIPTS
// ---------------------------------------------------------------------------------------------------------------
type Cam = { t: number; x: number; y: number; w: number; lin?: boolean }; // view rect (capture px), h = w * 9 / 16
type Rect = [number, number, number, number];
type Hl = { t: number; t2?: number; kind: 'marker' | 'ink' | 'ring' | 'pulse'; rects: Rect[] };
type RFx = { file: string; W: number; H: number; bg: string; cams: Cam[]; hls: Hl[] };

export const RECEIPT_FX: Record<string, RFx> = {
  // C9 canton.network hero, a 1.95 s flash: a push inside the dark hero only (visual-qa: y <= ~1350 of 2160)
  C9: { file: 'C9-canton-homepage-hero', W: 3840, H: 2160, bg: '#1b1b1b',
    cams: [{ t: 6.133, x: 300, y: 0, w: 2400 }, { t: 8.08, x: 470, y: 160, w: 2000, lin: true }], hls: [] },
  // C14 DTCC release: s1 headline + date (settling push), s2 down to the real company name (highlight on
  // "Depository" 24.80; the VO says "Clearinghouse"), s3 'DTCC Tokenization Service (DTS)' on "tokenization" 28.16
  C14h: { file: 'C14-headline', W: 3840, H: 1600, bg: '#ffffff',
    cams: [{ t: 19.84, x: 760, y: 100, w: 2400 }, { t: 24.42, x: 800, y: 150, w: 2300, lin: true },
      { t: 25.4, x: 840, y: 960, w: 1560 }, { t: 29.833, x: 860, y: 980, w: 1520, lin: true }],
    hls: [{ t: 24.8, t2: 25.9, kind: 'marker', rects: [[888, 1374, 890, 54]] },
      { t: 28.16, t2: 28.9, kind: 'marker', rects: [[1520, 1428, 594, 54]] }] },
  // C14 paragraph strip (2680 x 399, placed on the white page, never stretched): FB1 in the deck area, then the
  // full-frame hold. The 'currently integrated' sentence wipes on "look" (29.96); the two networks pulse on
  // "private" (35.56) and "Canton" (37.90). The 114 trillion sentence is not in this strip.
  C14p: { file: 'C14-paragraph', W: 2680, H: 399, bg: '#ffffff',
    cams: [{ t: 29.833, x: 220, y: -430, w: 2240 }, { t: 31.4, x: 262, y: -212, w: 1790 }],
    hls: [{ t: 29.96, t2: 31.3, kind: 'marker', rects: [[428, 262, 1568, 58]] },
      { t: 35.56, kind: 'pulse', rects: [[1500, 262, 494, 58]] },
      { t: 37.9, kind: 'pulse', rects: [[1092, 262, 342, 58]] }] },
  // C10 Global Synchronizer headline band (dark page): push, 'atomic' inks lime on "atomic" (84.84)
  C10: { file: 'C10-global-synchronizer-headline', W: 3840, H: 936, bg: '#1b1b1b',
    cams: [{ t: 83.58, x: 200, y: -60, w: 1900 }, { t: 85.6, x: 420, y: 185, w: 1640, lin: true }],
    hls: [{ t: 84.84, t2: 85.25, kind: 'ink', rects: [[757, 540, 212, 64]] }] },
  // C21 Quant Flow: the page identity (QUANT mark) first, then the claim crop pushed onto the Connected column
  C21h: { file: 'C21-quant-flow-hero', W: 3840, H: 2400, bg: '#ffffff',
    cams: [{ t: 136.6, x: 0, y: 0, w: 3840 }, { t: 138.2, x: 200, y: 120, w: 3440, lin: true }], hls: [] },
  C21n: { file: 'C21-quant-flow-no-new-network', W: 3360, H: 2260, bg: '#ffffff',
    cams: [{ t: 138.0, x: 700, y: 560, w: 2000 }, { t: 138.9, x: 1000, y: 1000, w: 1400 }],
    hls: [{ t: 138.94, t2: 140.3, kind: 'marker', rects: [[1450, 1392, 460, 66]] }] },
  // C15 Broadridge DLR (Wayback 2026-07-03, matches the VO's June 2026 figures). a = the page hero under the
  // library 3D pan; b = 'Built on Canton Technology' (highlight on "Canton" 174.00); c = the stats block, the
  // '7.5T Total settled volume June 2026' tile ringed as the page prints it (on "7.5", 176.10)
  C15a: { file: 'C15-dlr-hero-stats-WAYBACK-2026-07-03', W: 3840, H: 1700, bg: '#f9f9f9',
    cams: [{ t: 167.1, x: 0, y: 0, w: 3840 }], hls: [] },   // full page width; the row's vertical pan runs header -> stats
  C15b: { file: 'C15-dlr-built-on-canton', W: 3840, H: 2160, bg: '#f9f9f9',
    cams: [{ t: 173.74, x: 640, y: 860, w: 2400 }, { t: 175.0, x: 1500, y: 900, w: 1700 }],
    hls: [{ t: 174.0, t2: 174.8, kind: 'marker', rects: [[1940, 1150, 900, 100]] }] },
  C15c: { file: 'C15-dlr-hero-stats-WAYBACK-2026-07-03', W: 3840, H: 1700, bg: '#f9f9f9',
    cams: [{ t: 176.1, x: 520, y: 600, w: 2800 }, { t: 177.3, x: 2080, y: 860, w: 1500 }],
    hls: [{ t: 176.3, kind: 'ring', rects: [[2556, 1104, 552, 360]] }] },
  // C12 canton.foundation Super Validators (dark page): a slow scroll down the full three-column list, each name
  // ringed as he says it: DTCC 183.00 · Nasdaq 186.22 · Visa 187.16 · Circle 187.80 · Chainlink 188.86
  // (boxes = C12-names.json CSS px x 2). LSEG is not on the page and is never lit.
  C12: { file: 'C12-super-validators-list', W: 3840, H: 2740, bg: '#030206',
    cams: [{ t: 179.867, x: 120, y: 0, w: 3600 }, { t: 189.2, x: 120, y: 715, w: 3600, lin: true }],
    hls: [{ t: 183.0, kind: 'ring', rects: [[2536, 1026, 1112, 120]] },
      { t: 186.22, kind: 'ring', rects: [[192, 1734, 1112, 120]] },
      { t: 187.16, kind: 'ring', rects: [[1364, 2324, 1112, 120]] },
      { t: 187.8, kind: 'ring', rects: [[2536, 790, 1112, 120]] },
      { t: 188.86, kind: 'ring', rects: [[192, 790, 1112, 120]] }] },
  // C19 MiCA whitepaper p. 9, the C19-sentence-bbox.json crop (759-1989 x 1968-2105) framed full width under the
  // library 3D pan (visual-qa CONDITION: never the white portrait page as-is). No highlighter (EDIT-PLAN).
  C19: { file: 'C19-mica-whitepaper-p9', W: 2448, H: 3168, bg: '#ffffff',
    cams: [{ t: 197.28, x: 421, y: 1415, w: 2207 }], hls: [] },
  // C18 sec.gov no-action response: s1 header + 'Canton Coin' + 'November 3, 2026' + 'Division of Corporation
  // Finance' (on "November" 233.90); s2 the push SETTLES on the sentence (on "they" 238.18), then the wipe from
  // "view" (238.40) through "commodity" (240.48). Never the whole 3040 x 2900 page at once.
  C18: { file: 'C18-sec-no-action-canton-coin', W: 3040, H: 2900, bg: '#fafafa',
    cams: [{ t: 233.4, x: 640, y: 640, w: 1720 }, { t: 238.18, x: 660, y: 660, w: 1680, lin: true },
      { t: 239.1, x: 690, y: 900, w: 1480 }],
    hls: [{ t: 238.4, t2: 240.48, kind: 'marker', rects: [[1672, 1255, 382, 56], [750, 1303, 636, 56]] }] },
  // C22 CoinMarketCap Canton page (read 2026-11-10 21:46 UTC): the push lands on the price 0.08862 on "nine"
  // (250.88); a figure read off a stat panel, so no highlighter (EDIT-PLAN)
  C22: { file: 'C22-cmc-canton-live', W: 3058, H: 1158, bg: '#ffffff',
    cams: [{ t: 248.933, x: 0, y: 0, w: 2058 }, { t: 250.1, x: 0, y: 0, w: 2058, lin: true },
      { t: 250.88, x: -120, y: -120, w: 1200 }], hls: [] },
};

const camAt = (cams: Cam[], abs: number, F: (t: number) => number) => {
  if (abs <= F(cams[0].t)) return cams[0];
  for (let i = 1; i < cams.length; i++) {
    const a = cams[i - 1], b = cams[i];
    const fa = F(a.t), fb = F(b.t);
    if (abs < fb) {
      const p = clamp01((abs - fa) / Math.max(1, fb - fa));
      const e = b.lin ? p : easeInOut(p);
      return { t: 0, x: a.x + (b.x - a.x) * e, y: a.y + (b.y - a.y) * e, w: a.w + (b.w - a.w) * e };
    }
  }
  return cams[cams.length - 1];
};

const HighlightEl: React.FC<{ h: Hl; s: number }> = ({ h, s }) => {
  const { abs, F } = useClock();
  const f0 = F(h.t);
  if (abs < f0) return null;
  const f1 = h.t2 !== undefined ? F(h.t2) : f0 + 12;
  const total = h.rects.reduce((a, r) => a + r[2], 0);
  if (h.kind === 'ring' || h.kind === 'pulse') {
    const q = easeOut(clamp01((abs - f0) / 8));
    const pop = 1 + 0.08 * (1 - q);
    return (
      <>
        {h.rects.map(([x, y, w, hh], i) => (
          <div key={i} style={{
            position: 'absolute', left: x, top: y, width: w, height: hh, opacity: q,
            transform: `scale(${pop})`, transformOrigin: '50% 50%',
            ...(h.kind === 'ring'
              ? { border: `${5 / s}px solid #F3FF97`, borderRadius: 14 / s, background: 'rgba(243,255,151,0.10)',
                  boxShadow: `0 0 ${26 / s}px rgba(243,255,151,0.55), inset 0 0 ${14 / s}px rgba(243,255,151,0.25)` }
              : { background: '#ffc23a', mixBlendMode: 'multiply' as const, borderRadius: 6 / s }),
          }} />
        ))}
      </>
    );
  }
  // marker / ink: a left-to-right wipe across the rects in reading order
  let left = clamp01((abs - f0) / Math.max(1, f1 - f0)) * total;
  return (
    <>
      {h.rects.map(([x, y, w, hh], i) => {
        const vis = Math.max(0, Math.min(w, left));
        left -= w;
        if (vis <= 0) return null;
        return h.kind === 'marker' ? (
          <div key={i} style={{ position: 'absolute', left: x, top: y, width: vis, height: hh, background: '#ffe14d',
            mixBlendMode: 'multiply', borderRadius: 6 / s }} />
        ) : (
          <React.Fragment key={i}>
            <div style={{ position: 'absolute', left: x, top: y, width: vis, height: hh, background: '#F3FF97',
              mixBlendMode: 'multiply' }} />
            <div style={{ position: 'absolute', left: x, top: y + hh + 4 / s, width: vis, height: 6 / s,
              background: '#F3FF97', borderRadius: 3 / s, boxShadow: `0 0 ${12 / s}px rgba(243,255,151,0.7)` }} />
          </React.Fragment>
        );
      })}
    </>
  );
};

/** A receipt capture, full frame (1920 x 1080 stage), its camera + highlights on the absolute clock. */
export const ReceiptView: React.FC<{ fx: string }> = ({ fx }) => {
  const { abs, F } = useClock();
  const r = RECEIPT_FX[fx];
  if (!r) throw new Error(`ReceiptView: no RECEIPT_FX row '${fx}'`);
  const cam = camAt(r.cams, abs, F);
  const s = 1920 / cam.w;
  return (
    <AbsoluteFill style={{ background: r.bg, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: r.W, height: r.H, transformOrigin: '0 0',
        transform: `scale(${s}) translate(${-cam.x}px, ${-cam.y}px)`, isolation: 'isolate' }}>
        <Img src={staticFile('receipts/' + r.file + '.png')} style={{ position: 'absolute', left: 0, top: 0, width: r.W, height: r.H }} />
        {r.hls.map((h, i) => <HighlightEl key={i} h={h} s={s} />)}
      </div>
    </AbsoluteFill>
  );
};

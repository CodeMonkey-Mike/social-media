// LetsGetRichCharts.tsx: the project's OWN chart + device file for LetsGetRich (lets-get-rich, 2026-11-01).
// (1) the three Type 1 ANIMATED charts in code (C4 Buffett ladder, C13 multiples, C16 venture bars), reproducing the
//     design-state stills in assets/charts/*.png (their .html sources give every px / colour used below), each state
//     landing on its spoken word (EDIT-PLAN rows), and
// (2) the kinetic-text-2023 devices with NO shared engine yet (effects library rows: kt-caption-highlight,
//     kt-stacked-list-over-broll, kt-keyword-sparkle, kt-text-wall, kt-typewriter-card, kt-push-slide, the
//     kt-subscribe-close `bar` variant, kt-icon-pop image / sticker art), built to the rows' numbers in the video's
//     palette (gold #ffd700 key words; the light theme's darkened gold #8F6500 on the charts).
// Every component reads ONE absolute clock: the kinetic-text KtClock (SOURCE-spine seconds, held inside a pause), so
// it is correct inside any engine nesting (comp-build.md section 6a). Nothing here imports another project's file.
import React from 'react';
import { AbsoluteFill, Easing, Img, interpolate, staticFile } from 'remotion';
import { CL, KtTextBlock, pop110, POP110_DUR, hover, useKtTime, KT_2023, easeInfluence325 } from './effects/kinetic-text';

// ---------------------------------------------------------------------------------------------------------------
// shared look
// ---------------------------------------------------------------------------------------------------------------
export const GOLD = '#ffd700'; // chapter accent (COVER-PLAN chapter_themes: gold every chapter)
export const LIT = '#8F6500'; // the light theme's darkened gold token (charts / containers ink)
const INK = '#14161A';
const SEC = '#4A5263';
const MUTED = '#5E6676';
const BORDER = '#DDD9CF';
const BG = '#F6F4EE';
export const F_PLAY = "'Playfair Display', serif";
export const F_DM = "'DM Sans', sans-serif";
export const F_MONO = "'JetBrains Mono', monospace";
export const F_KT = "'Montserrat', sans-serif";
const MONO_FX: React.CSSProperties = { fontVariantLigatures: 'none', fontFeatureSettings: '"calt" 0, "liga" 0' };

const ease = Easing.out(Easing.cubic);
/** 0..1 progress of a move that starts at t0 and lasts dur (ease-out cubic) */
export const prog = (t: number, t0: number, dur: number) => ease(interpolate(t, [t0, t0 + dur], [0, 1], CL));
const lin = (t: number, t0: number, dur: number) => interpolate(t, [t0, t0 + dur], [0, 1], CL);

const pos = (left: number, top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: 'absolute', left, top, ...extra });

const ChartFrame: React.FC<{ eyebrow: string; title: React.ReactNode; source: string; children: React.ReactNode }> = ({ eyebrow, title, source, children }) => (
  <AbsoluteFill style={{ background: BG, overflow: 'hidden' }}>
    <div style={pos(1460, -340, { width: 640, height: 640, borderRadius: '50%', background: 'rgba(255,215,0,.55)', filter: 'blur(120px)', opacity: 0.18 })} />
    <div style={pos(120, 60, { zIndex: 2, maxWidth: 1400 })}>
      <div style={{ fontFamily: F_DM, fontWeight: 600, fontSize: 24, textTransform: 'uppercase', letterSpacing: '.18em', color: MUTED, marginBottom: 14 }}>{eyebrow}</div>
      <div style={{ fontFamily: F_PLAY, fontWeight: 900, fontSize: 64, lineHeight: 1.08, letterSpacing: '-.02em', color: INK }}>{title}</div>
      <div style={{ width: 66, height: 4, borderRadius: 2, marginTop: 22, background: `linear-gradient(90deg, ${LIT}, rgba(143,101,0,.22))` }} />
    </div>
    {children}
    <div style={pos(120, 1080 - 30 - 24, { fontFamily: F_MONO, fontWeight: 400, fontSize: 18, color: MUTED, zIndex: 2, letterSpacing: '.01em', ...MONO_FX })}>{source}</div>
  </AbsoluteFill>
);
const Key: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ color: LIT }}>{children}</span>;
const Cap: React.FC<{ left: number; top: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ left, top, children, style }) => (
  <div style={pos(left, top, { fontFamily: F_DM, fontWeight: 700, fontSize: 20, letterSpacing: '.16em', textTransform: 'uppercase', color: MUTED, ...style })}>{children}</div>
);

/** count a number up from 0 over dur (ease-out), formatted with `dec` decimals */
const countUp = (t: number, t0: number, dur: number, to: number, dec: number) => (to * prog(t, t0, dur)).toFixed(dec);

// ---------------------------------------------------------------------------------------------------------------
// C4 BUFFETT LADDER (assets/charts/C4-buffett-ladder-s0..s5.png; CH2 35.867-39.80, 44.38-60.26, 74.48-87.90)
// ---------------------------------------------------------------------------------------------------------------
type Chip = { label: string; t: number };
type Rung = {
  top: number;
  railY: number;
  dt: string;
  nm: string;
  inV: string;
  chips: Chip[];
  tIn: number; // rung lands (live)
  tSettle: number; // stops being the live rung
  tDate?: number; // the date header slots in early, dim, inside the ghost (GE 80.90)
  out?: { v: string; num: number; dec: number; lines: React.ReactNode[]; t: number; lineT?: number[] };
};
export const C4_RUNGS: Rung[] = [
  {
    top: 318, railY: 418, dt: 'SEPT 23, 2008', nm: 'GOLDMAN SACHS', inV: '5B',
    chips: [{ label: 'AT 10%', t: 49.0 }, { label: '+ WARRANTS', t: 50.6 }],
    tIn: 47.3, tSettle: 74.48,
    out: { v: 'B', num: 5.5, dec: 1, t: 53.6, lineT: [53.6, 58.1], lines: [<>PAID BACK, APR <span style={{ fontFamily: F_MONO }}>2011</span></>, <>+ <span style={{ fontFamily: F_MONO }}>13M</span> GOLDMAN SHARES</>] },
  },
  {
    top: 548, railY: 648, dt: 'OCT 1, 2008', nm: 'GE', inV: '3B',
    chips: [{ label: 'AT 10%', t: 87.1 }],
    tIn: 87.1, tSettle: 9999, tDate: 80.9,
    out: { v: 'B', num: 3.3, dec: 1, t: 87.1, lineT: [87.1], lines: [<>PAID BACK, OCT <span style={{ fontFamily: F_MONO }}>2011</span></>] },
  },
  {
    top: 778, railY: 878, dt: 'AUG 25, 2011', nm: 'BANK OF AMERICA', inV: '5B',
    chips: [{ label: 'AT 6%', t: 74.48 }, { label: '+ WARRANTS', t: 74.48 }],
    tIn: 74.48, tSettle: 87.1,
    out: { v: 'B', num: 20.7, dec: 1, t: 78.8, lineT: [78.8, 78.8], lines: [<><span style={{ fontFamily: F_MONO }}>700M</span> SHARES AT <span style={{ fontFamily: F_MONO }}>7.14</span></>, <>VALUE AT END OF <span style={{ fontFamily: F_MONO }}>2017</span></>] },
  },
];
/** the 2008 newspaper icon (code, no real masthead) cuts in beside the rung ON "Goldman Sachs" */
export const C4_NEWS_T = 47.3;

const Newspaper: React.FC = () => (
  <svg style={pos(1590, 52, { width: 210, height: 230, zIndex: 3, overflow: 'visible' })} viewBox="0 0 210 230">
    <g transform="rotate(-6 105 115)">
      <rect x="22" y="14" width="168" height="200" rx="8" fill="#FFFFFF" stroke="#14161A" strokeWidth="4" />
      <rect x="40" y="32" width="132" height="18" rx="3" fill="#14161A" />
      <rect x="40" y="58" width="132" height="4" rx="2" fill="#14161A" />
      <rect x="40" y="72" width="132" height="30" rx="4" fill="#8F6500" />
      <rect x="40" y="114" width="58" height="52" rx="4" fill="rgba(143,101,0,.22)" stroke="#8F6500" strokeWidth="2.5" />
      {[116, 130, 144].map((y) => <rect key={y} x="108" y={y} width="64" height="5" rx="2.5" fill="#8A877E" />)}
      <rect x="108" y="158" width="44" height="5" rx="2.5" fill="#8A877E" />
      <rect x="40" y="178" width="132" height="5" rx="2.5" fill="#8A877E" />
      <rect x="40" y="192" width="98" height="5" rx="2.5" fill="#8A877E" />
    </g>
    <g transform="translate(118 196)">
      <rect x="0" y="0" width="92" height="40" rx="20" fill="#8F6500" />
      <text x="46" y="28" textAnchor="middle" fontFamily="JetBrains Mono" fontWeight="600" fontSize="23" fill="#FFFFFF">2008</text>
    </g>
  </svg>
);

const ChipEl: React.FC<{ label: string; live: boolean; a: number }> = ({ label, live, a }) => (
  <span
    style={{
      display: 'inline-block', padding: '6px 14px', borderRadius: 10, fontFamily: F_MONO, fontWeight: 600, fontSize: 24, whiteSpace: 'nowrap',
      border: `1.5px solid ${live ? 'rgba(143,101,0,.7)' : BORDER}`, background: live ? 'rgba(143,101,0,.08)' : '#FFFFFF', color: live ? LIT : INK,
      opacity: a, transform: `scale(${0.85 + 0.15 * a})`, ...MONO_FX,
    }}
  >
    {label}
  </span>
);

const RungEl: React.FC<{ r: Rung; t: number }> = ({ r, t }) => {
  const landed = t >= r.tIn;
  const live = landed && t < r.tSettle;
  const a = prog(t, r.tIn, 0.3);
  const ghost = (
    <div style={pos(200, r.top, { width: 1600, height: 200, borderRadius: 18, zIndex: 2, background: 'rgba(255,255,255,.28)', border: '2px dashed #B9B3A5', opacity: landed ? 1 - a : 1 })}>
      {r.tDate !== undefined && t >= r.tDate && !landed && (
        <div style={pos(40, 0, { height: 200, width: 400, display: 'flex', flexDirection: 'column', justifyContent: 'center', opacity: 0.45 * prog(t, r.tDate, 0.3) })}>
          <div style={{ fontFamily: F_MONO, fontWeight: 600, fontSize: 25, color: SEC, letterSpacing: '.02em', ...MONO_FX }}>{r.dt}</div>
        </div>
      )}
    </div>
  );
  if (!landed) return ghost;
  const hasOut = !!r.out && t >= r.out.t;
  const oa = hasOut ? prog(t, r.out!.t, 0.35) : 0;
  const card: React.CSSProperties = live
    ? { border: `2px solid ${LIT}`, boxShadow: '0 0 0 5px rgba(143,101,0,.13), 0 16px 34px rgba(20,22,26,.12)' }
    : { border: `2px solid ${BORDER}`, boxShadow: '0 1px 2px rgba(20,22,26,.05), 0 14px 34px rgba(20,22,26,.08)' };
  return (
    <>
      {a < 1 && ghost}
      <div style={pos(200, r.top, { width: 1600, height: 200, borderRadius: 18, zIndex: 2, background: '#FFFFFF', ...card, opacity: a, transform: `translateY(${(1 - a) * 14}px)` })}>
        <div style={pos(40, 0, { height: 200, width: 400, display: 'flex', flexDirection: 'column', justifyContent: 'center' })}>
          <div style={{ fontFamily: F_MONO, fontWeight: 600, fontSize: 25, color: live ? LIT : SEC, letterSpacing: '.02em', ...MONO_FX }}>{r.dt}</div>
          <div style={{ fontFamily: F_DM, fontWeight: 700, fontSize: 40, lineHeight: 1.08, color: INK, marginTop: 10, letterSpacing: '.01em' }}>{r.nm}</div>
        </div>
        <div style={pos(440, 30, { width: 1.5, height: 140, background: BORDER })} />
        <div style={pos(470, 0, { width: 430, height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center' })}>
          <div style={{ fontFamily: F_MONO, fontWeight: 600, fontSize: 66, lineHeight: 1, letterSpacing: '-.02em', color: live && !hasOut ? LIT : INK, ...MONO_FX }}>{r.inV}</div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'nowrap', minHeight: 44 }}>
            {r.chips.map((c, i) => (t >= c.t ? <ChipEl key={i} label={c.label} live={live} a={prog(t, c.t, 0.25)} /> : null))}
          </div>
        </div>
        {hasOut && (
          <>
            <svg style={pos(905, 70, { width: 90, height: 60, opacity: oa, transform: `translateX(${(oa - 1) * 30}px)` })} viewBox="0 0 90 60">
              <path d="M6 30 H72" stroke={live ? LIT : '#8A877E'} strokeWidth="5" strokeLinecap="round" />
              <path d="M58 14 L78 30 L58 46" fill="none" stroke={live ? LIT : '#8A877E'} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div style={pos(1010, 0, { width: 560, height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center', opacity: oa, transform: `translateX(${(oa - 1) * 24}px)` })}>
              <div style={{ fontFamily: F_MONO, fontWeight: 600, fontSize: 66, lineHeight: 1, letterSpacing: '-.02em', color: live ? LIT : INK, ...MONO_FX }}>
                {countUp(t, r.out!.t, 0.6, r.out!.num, r.out!.dec)}
                {r.out!.v}
              </div>
              {r.out!.lines.map((ln, i) =>
                t >= (r.out!.lineT?.[i] ?? r.out!.t) ? (
                  <div key={i} style={{ fontFamily: F_DM, fontWeight: 700, fontSize: 23, letterSpacing: '.1em', textTransform: 'uppercase', color: SEC, marginTop: 12, whiteSpace: 'nowrap', opacity: prog(t, r.out!.lineT?.[i] ?? r.out!.t, 0.3) }}>
                    {ln}
                  </div>
                ) : null,
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export const C4Ladder: React.FC = () => {
  const t = useKtTime();
  return (
    <ChartFrame eyebrow="What Buffett did" title={<>Buffett bought the <Key>bottoms</Key></>} source="Goldman Sachs and Bank of America releases (SEC exhibits) · Berkshire 10-Q Q2 2011 · GE SEC filings · Berkshire letters 2013 and 2017 · USD">
      <Cap left={670} top={272}>Put in</Cap>
      <Cap left={1210} top={272}>What it became</Cap>
      {t >= C4_NEWS_T && <Newspaper />}
      <svg style={pos(0, 0, { width: 1920, height: 1080, zIndex: 1, overflow: 'visible' })} viewBox="0 0 1920 1080">
        <line x1="150" y1="300" x2="150" y2="996" stroke="#D6D2C7" strokeWidth="4" strokeLinecap="round" />
        {C4_RUNGS.map((r, i) => {
          const landed = t >= r.tIn;
          const live = landed && t < r.tSettle;
          if (live) {
            const a = prog(t, r.tIn, 0.3);
            return (
              <g key={i}>
                <circle cx="150" cy={r.railY} r={22 * a} fill="rgba(143,101,0,.16)" />
                <circle cx="150" cy={r.railY} r="11" fill="#8F6500" />
              </g>
            );
          }
          return <circle key={i} cx="150" cy={r.railY} r="11" fill={landed ? '#FFFFFF' : BG} stroke={landed ? '#8F6500' : '#C9C4B8'} strokeWidth="4" />;
        })}
      </svg>
      {C4_RUNGS.map((r, i) => <RungEl key={i} r={r} t={t} />)}
    </ChartFrame>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// C13 MULTIPLES BARS (assets/charts/C13-multiples-bars-s0..s4.png; CH3 117.18-126.167)
// ---------------------------------------------------------------------------------------------------------------
type MRow = { top: number; nm: string; lo: string; hi: string; dts: string; mult: number; tGrow: number; tVal: number };
export const C13_ROWS: MRow[] = [
  { top: 319, nm: 'BITCOIN', lo: '15,460', hi: '126,296', dts: 'NOV 21, 2022 → OCT 6, 2025', mult: 8.2, tGrow: 0, tVal: 0 }, // s0: already grown (the 8x read off C14)
  { top: 469, nm: 'SOLANA', lo: '8.00', hi: '295', dts: 'DEC 29, 2022 → JAN 19, 2025', mult: 36.9, tGrow: 117.5, tVal: 121.3 },
  { top: 619, nm: 'KASPA', lo: '0.0042', hi: '0.2079', dts: 'DEC 30, 2022 → AUG 1, 2024', mult: 49.5, tGrow: 122.7, tVal: 123.5 },
  { top: 769, nm: 'HYPERLIQUID', lo: '3.81', hi: '97.96', dts: 'NOV 29, 2024 → SEPT 23, 2026', mult: 25.7, tGrow: 124.5, tVal: 125.46 },
];
export const C13_ARROW_T = 117.5; // RISING CHART ARROW icon slides in as the Solana bar lands
const PX_PER_X = 19; // 950 px = 50X

export const C13Multiples: React.FC = () => {
  const t = useKtTime();
  const activeIdx = C13_ROWS.reduce((acc, r, i) => (t >= r.tGrow ? i : acc), 0);
  const ad = t - C13_ARROW_T;
  const arrowOff = 668 * (1 - easeInfluence325(interpolate(ad, [0, 0.5], [0, 1], CL)));
  return (
    <ChartFrame eyebrow="The last couple of years" title={<>Imagine buying the <Key>bottom</Key></>} source="Lows and highs: Coinbase daily candles (BTC, SOL) · MEXC KASUSDT daily klines (KAS) · CoinGecko ATL / ATH (HYPE) · multiple = high ÷ low">
      {ad >= 0 && (
        <svg style={pos(1630 + arrowOff, 58, { width: 170, height: 170, zIndex: 3 })} viewBox="0 0 170 170">
          <rect x="6" y="6" width="158" height="158" rx="28" fill="#FFFFFF" stroke="#DDD9CF" strokeWidth="2" />
          <path d="M34 128 V40 M34 128 H136" stroke="#14161A" strokeWidth="7" strokeLinecap="round" />
          <path d="M46 112 L76 82 L96 100 L132 58" fill="none" stroke="#8F6500" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M108 56 L134 56 L134 82" fill="none" stroke="#8F6500" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      <svg style={pos(0, 0, { width: 1920, height: 1080, zIndex: 1 })} viewBox="0 0 1920 1080">
        {[640, 830, 1020, 1210, 1400, 1590].map((x) => <line key={x} x1={x} y1="290" x2={x} y2="904" stroke="#D6D2C7" strokeWidth="1.5" strokeDasharray="4 8" />)}
        <line x1="640" y1="286" x2="640" y2="904" stroke="#7A808B" strokeWidth="2.5" />
        <line x1="640" y1="904" x2="1590" y2="904" stroke="#7A808B" strokeWidth="2.5" />
      </svg>
      {[0, 10, 20, 30, 40, 50].map((v, i) => (
        <div key={v} style={pos(590 + 190 * i, 918, { width: 100, textAlign: 'center', fontFamily: F_MONO, fontWeight: 600, fontSize: 22, color: MUTED, ...MONO_FX })}>{v}X</div>
      ))}
      <Cap left={1190} top={960} style={{ width: 400, textAlign: 'right' }}>Bottom to peak</Cap>
      {C13_ROWS.map((r, i) => {
        const on = i === 0 || t >= r.tGrow;
        const live = i === activeIdx;
        const g = i === 0 ? 1 : prog(t, r.tGrow, 0.8);
        const w = r.mult * PX_PER_X * g;
        const showVal = i === 0 || t >= r.tVal;
        const vp = i === 0 ? 1 : pop110(t - r.tVal);
        return (
          <React.Fragment key={i}>
            <div style={pos(120, r.top, { width: 500, zIndex: 2, opacity: on ? 1 : 0.32 })}>
              <div style={{ fontFamily: F_DM, fontWeight: 700, fontSize: 36, letterSpacing: '.05em', color: INK, lineHeight: 1 }}>{r.nm}</div>
              {on && (
                <div style={{ opacity: i === 0 ? 1 : prog(t, r.tGrow, 0.3) }}>
                  <div style={{ fontFamily: F_MONO, fontWeight: 600, fontSize: 23, color: SEC, marginTop: 12, whiteSpace: 'nowrap', ...MONO_FX }}>
                    <b style={{ fontWeight: 600, color: live ? LIT : INK }}>{r.lo}</b> → <b style={{ fontWeight: 600, color: live ? LIT : INK }}>{r.hi}</b>
                  </div>
                  <div style={{ fontFamily: F_MONO, fontWeight: 400, fontSize: 18, color: MUTED, marginTop: 8, whiteSpace: 'nowrap', ...MONO_FX }}>{r.dts}</div>
                </div>
              )}
            </div>
            <div style={pos(640, r.top + 18, { width: 950, height: 68, zIndex: 1, borderRadius: '0 12px 12px 0', background: 'rgba(20,22,26,.035)' })} />
            {on && w > 0.5 && (
              <div
                style={pos(640, r.top + 18, {
                  width: w, height: 68, zIndex: 2, borderRadius: '0 12px 12px 0',
                  background: live ? `linear-gradient(90deg, ${LIT}, ${GOLD})` : 'linear-gradient(90deg, rgba(143,101,0,.34), rgba(255,215,0,.52))',
                })}
              />
            )}
            {showVal && (
              <div
                style={pos(640 + r.mult * PX_PER_X + 22, r.top + (live ? 22 : 28), {
                  zIndex: 3, fontFamily: F_MONO, fontWeight: 600, lineHeight: 1, whiteSpace: 'nowrap', fontSize: live ? 56 : 44, color: live ? LIT : SEC,
                  transform: typeof vp === 'number' ? undefined : `scale(${vp.s / 1.1}) rotate(${vp.rot}deg)`, transformOrigin: '0% 50%', ...MONO_FX,
                })}
              >
                {r.mult.toFixed(1)}X
              </div>
            )}
          </React.Fragment>
        );
      })}
    </ChartFrame>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// C16 VENTURE BARS (assets/charts/C16-venture-bars-s0..s3.png; CH4 154.62-164.80, + under the C17 panel to 169.92)
// ---------------------------------------------------------------------------------------------------------------
type VCol = { left: number; h: number; v: string; num: number; deals?: string; xa: string; xb: string; t: number };
export const C16_COLS: VCol[] = [
  { left: 500, h: 446.6, v: 'B', num: 20.3, xa: '2025', xb: 'FULL YEAR', t: 155.0 },
  { left: 940, h: 319.8, v: 'B', num: 14.5, deals: '1,040 DEALS', xa: '2026 YTD', xb: 'FIRST NINE MONTHS', t: 158.0 },
  { left: 1380, h: 99.4, v: 'B', num: 4.5, deals: '296 DEALS', xa: 'Q3 2026', xb: 'THIS PAST QUARTER', t: 163.6 },
];

export const C16Venture: React.FC = () => {
  const t = useKtTime();
  const liveIdx = C16_COLS.reduce((acc, c, i) => (t >= c.t ? i : acc), -1);
  return (
    <ChartFrame eyebrow="Crypto venture capital" title={<>Venture money is <Key>still flowing</Key></>} source="Galaxy Research, crypto and blockchain venture capital, Q3 2026 (Oct 28, 2026) · 2026 YTD = Jan to Sept · USD">
      <svg style={pos(0, 0, { width: 1920, height: 1080, zIndex: 1 })} viewBox="0 0 1920 1080">
        {[770, 660, 550, 440, 330].map((y) => <line key={y} x1="340" y1={y} x2="1760" y2={y} stroke="#D6D2C7" strokeWidth="1.5" strokeDasharray="4 8" />)}
        <line x1="340" y1="880" x2="1760" y2="880" stroke="#7A808B" strokeWidth="2.5" />
      </svg>
      {['0', '5B', '10B', '15B', '20B', '25B'].map((l, i) => (
        <div key={l} style={pos(200, 866 - 110 * i, { width: 120, textAlign: 'right', fontFamily: F_MONO, fontWeight: 600, fontSize: 22, color: MUTED, ...MONO_FX })}>{l}</div>
      ))}
      {C16_COLS.map((c, i) => {
        const grown = t >= c.t;
        const live = i === liveIdx;
        const g = grown ? prog(t, c.t, 0.7) : 0;
        const h = c.h * g;
        const va = grown ? prog(t, c.t + 0.35, 0.3) : 0;
        const topV = 880 - c.h - (c.deals ? 122 : 86);
        return (
          <React.Fragment key={i}>
            <div style={pos(c.left, 880 - c.h, { width: 280, height: c.h, zIndex: 1, border: '2px dashed #B9B3A5', borderBottom: 'none', borderRadius: '12px 12px 0 0', background: 'rgba(255,255,255,.28)', boxSizing: 'border-box', opacity: 1 - g })} />
            {h > 0.5 && (
              <div style={pos(c.left, 880 - h, { width: 280, height: h, zIndex: 2, borderRadius: '12px 12px 0 0', background: live ? `linear-gradient(0deg, ${LIT}, ${GOLD})` : 'linear-gradient(0deg, rgba(143,101,0,.34), rgba(255,215,0,.52))' })} />
            )}
            {grown && (
              <div style={pos(c.left - 60, topV, { width: 400, textAlign: 'center', zIndex: 3, opacity: va, transform: `translateY(${(1 - va) * 16}px)` })}>
                <div style={{ fontFamily: F_MONO, fontWeight: 600, fontSize: 60, lineHeight: 1, color: live ? LIT : INK, ...MONO_FX }}>
                  {countUp(t, c.t, 0.7, c.num, 1)}
                  {c.v}
                </div>
                {c.deals && <div style={{ fontFamily: F_MONO, fontWeight: 600, fontSize: 24, color: SEC, marginTop: 10, ...MONO_FX }}>{c.deals}</div>}
              </div>
            )}
            <div style={pos(c.left - 60, 898, { width: 400, textAlign: 'center', zIndex: 2 })}>
              <div style={{ fontFamily: F_MONO, fontWeight: 600, fontSize: 32, color: live ? LIT : INK, ...MONO_FX }}>{c.xa}</div>
              <div style={{ fontFamily: F_DM, fontWeight: 700, fontSize: 19, letterSpacing: '.16em', textTransform: 'uppercase', color: MUTED, marginTop: 6 }}>{c.xb}</div>
            </div>
          </React.Fragment>
        );
      })}
    </ChartFrame>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// CARD-SLIDE STATES (assets/card-slides/<id>-sN.png): the slide-builder's own state PNGs, each NEW element revealed
// on its spoken word inside the pixel box where state N differs from state N-1 (measured on the PNGs):
//   cut  = appears at once · fade = 0.3 s fade · pop = the kt-keyword-pop 110 jiggle about the box centre
//   wipe = kt-typewriter-card 'Linear Wipe' left to right over `dur` (0.045 s a character, at his speaking pace)
// ---------------------------------------------------------------------------------------------------------------
export type CardState = { t: number; src: string; box?: [number, number, number, number]; reveal: 'cut' | 'fade' | 'pop' | 'wipe'; dur?: number };

const fullImg: React.CSSProperties = { position: 'absolute', left: 0, top: 0, width: 1920, height: 1080 };

export const CardStates: React.FC<{ base: string; states: CardState[]; overlay?: (t: number) => React.ReactNode; under?: React.ReactNode }> = ({ base, states, overlay, under }) => {
  const t = useKtTime();
  let cur = -1;
  states.forEach((s, i) => {
    if (t >= s.t) cur = i;
  });
  const below = cur <= 0 ? base : states[cur - 1].src;
  const s = cur >= 0 ? states[cur] : null;
  const fin = !s || !s.box || (s.reveal === 'cut') || (s.reveal === 'fade' && t >= s.t + 0.3) || (s.reveal === 'wipe' && t >= s.t + (s.dur ?? 0.5)) || (s.reveal === 'pop' && t >= s.t + POP110_DUR + 0.05);
  return (
    <AbsoluteFill style={{ background: under ? '#E1DFE1' : BG, overflow: 'hidden' }}>
      {under}
      {s && fin ? (
        <Img src={staticFile(s.src)} style={fullImg} />
      ) : (
        <>
          {below && <Img src={staticFile(below)} style={fullImg} />}
          {s && s.box && <Reveal s={s} t={t} />}
        </>
      )}
      {overlay?.(t)}
    </AbsoluteFill>
  );
};

const Reveal: React.FC<{ s: CardState; t: number }> = ({ s, t }) => {
  const [x, y, w, h] = s.box!;
  const pad = 14;
  const box = { left: x - pad, top: y - pad, width: w + 2 * pad, height: h + 2 * pad };
  const crop = (
    <div style={{ position: 'absolute', ...box, overflow: 'hidden' }}>
      <Img src={staticFile(s.src)} style={{ ...fullImg, left: -box.left, top: -box.top }} />
    </div>
  );
  if (s.reveal === 'fade') return <div style={{ opacity: lin(t, s.t, 0.3) }}>{crop}</div>;
  if (s.reveal === 'wipe') {
    const p = lin(t, s.t, s.dur ?? 0.5);
    return <div style={{ clipPath: `inset(0px ${(1 - p) * 100}% 0px 0px)`, position: 'absolute', ...box, overflow: 'hidden' }}><Img src={staticFile(s.src)} style={{ ...fullImg, left: -box.left, top: -box.top }} /></div>;
  }
  // pop: the 110 jiggle about the box centre, settling back to 100 so the final PNG takes over without a jump
  const pm = pop110(t - s.t);
  const back = interpolate(t - s.t, [POP110_DUR - 0.05, POP110_DUR + 0.05], [1, 1 / 1.1], CL);
  return <div style={{ position: 'absolute', inset: 0, transformOrigin: `${x + w / 2}px ${y + h / 2}px`, transform: `scale(${pm.s * back}) rotate(${pm.rot}deg)` }}>{crop}</div>;
};

/** A big number that COUNTS UP in code (JetBrains Mono 700 gold, the card's .big-num / .item-eq look), drawn over the
 * card's base state so the count reads as the 2023 count-up. Aligned to the measured glyph box of the final PNG. */
export const CountUpNumber: React.FC<{ t: number; t0: number; to: number; suffix: string; prefix?: React.ReactNode; left: number; capTop: number; fontSize: number; dur?: number; pulseT?: number; color?: string }> = ({ t, t0, to, suffix, prefix, left, capTop, fontSize, dur = 0.55, pulseT, color = LIT }) => {
  if (t < t0) return null;
  const n = Math.round(to * prog(t, t0, dur));
  const pulse = pulseT !== undefined ? 1 + 0.06 * Math.sin(Math.PI * interpolate(t, [pulseT, pulseT + 0.25], [0, 1], CL)) : 1;
  const pm = pop110(t - t0);
  const sc = pm.s / (t - t0 > POP110_DUR ? 1.1 : 1.1);
  // baseline = cap top + cap height (JetBrains Mono caps = 0.73 em)
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'visible' }} viewBox="0 0 1920 1080">
      <g transform={`translate(${left} ${capTop + 0.73 * fontSize}) scale(${sc * pulse}) rotate(${pm.rot})`}>
        <text x={0} y={0} fontFamily="JetBrains Mono" fontWeight={700} fontSize={fontSize} letterSpacing={-0.04 * fontSize} fill={color}>
          {prefix}
          {n}
          {suffix}
        </text>
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// kt-text-wall (CH2 105.46-108.84): the measured wall look (slide-sources/_slides-body.html #K-WALL-get-greedy), in
// MOTION: rows scroll sideways, the letters pulse FILLED -> OUTLINED -> FILLED in a wave down the wall (~3 s cycle),
// the block leans right -> upright -> left; the red GET GREEDY headline (the RGBA layer card-slides/
// K-WALL-get-greedy-headline.png) punches in with the 110 jiggle ON "greedy" (108.46) and holds to the cut.
// ---------------------------------------------------------------------------------------------------------------
// tFree (lets-get-rich 2026-11-01): a clock that keeps RUNNING through the GET GREEDY beat pause (the kt clock holds at a pause
// point), so the wall scrolls on and the headline lands inside the pause, after "greedy." (Mike's draft note)
export const TextWall: React.FC<{ t0: number; headT: number; phrase?: string; tFree?: number }> = ({ t0, headT, phrase = 'OTHERS ARE FEARFUL', tFree }) => {
  const kt = useKtTime();
  const t = tFree ?? kt;
  const dt = Math.max(0, t - t0);
  const lean = interpolate(dt, [0, 1.5, 3.4], [-11 + 3, -11, -11 - 3], CL);
  const rows = Array.from({ length: 12 }, (_, r) => r);
  const head = t >= headT;
  const pm = pop110(t - headT);
  return (
    <AbsoluteFill style={{ background: '#000', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, perspective: 1100, perspectiveOrigin: '50% 30%', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute', left: -520, right: -520, top: -120, bottom: -260, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6,
            transform: `rotateX(46deg) rotateZ(${lean}deg) scale(1.08)`, transformOrigin: '50% 62%',
          }}
        >
          {rows.map((r) => {
            const dir = r % 2 === 0 ? -1 : 1;
            const off = -((r * 37) % 240) + dir * 60 * dt; // the rows scroll, alternate directions
            return (
              <div key={r} style={{ fontFamily: F_DM, fontWeight: 900, fontSize: 132, lineHeight: 1, letterSpacing: '.02em', textTransform: 'uppercase', whiteSpace: 'nowrap', color: '#fff', transform: `translateX(${off}px)` }}>
                {Array.from({ length: 5 }, (_, k) => {
                  // the pulse: a wave down the wall, a word is outlined when its phase is in the outlined half of the ~3 s cycle
                  const ph = (dt / 3.0 + r * 0.06 + k * 0.11) % 1;
                  const outlined = ph > 0.25 && ph < 0.75;
                  return (
                    <span key={k} style={{ marginRight: '.45em', color: outlined ? '#000' : '#fff', WebkitTextStroke: outlined ? '7px #fff' : undefined, paintOrder: 'stroke fill' }}>
                      {phrase}
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 120% 90% at 50% 58%, rgba(0,0,0,0) 35%, rgba(0,0,0,.72) 100%), linear-gradient(180deg, rgba(0,0,0,.9) 0%, rgba(0,0,0,0) 30%)' }} />
      </div>
      {head && (
        <div style={{ position: 'absolute', inset: 0, transformOrigin: '960px 540px', transform: `scale(${pm.s}) rotate(${pm.rot}deg)` }}>
          <Img src={staticFile('card-slides/K-WALL-get-greedy-headline.png')} style={fullImg} />
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// kt-stacked-list-over-broll: headline (110 jiggle pop), optional sub-line sliding in from the LEFT, items popping
// one by one with the SKEW lean (0 -> 3 -> 0 deg, axis turning 0 -> 200 deg over 0.367 s), all staying; exits by
// pushing out with its footage (kt-push-slide 0.1 s). Items in the accent (gold), headline white + gold key word.
// ---------------------------------------------------------------------------------------------------------------
export type StackRow = { t: number; text: string; kind: 'head' | 'sub' | 'item'; y: number; caps?: number };
export const StackedList: React.FC<{ t0: number; t1: number; rows: StackRow[]; exitT?: number; exitDir?: 'right' | 'down'; hideFrom?: number; hideTo?: number }> = ({ t0, t1, rows, exitT, exitDir = 'right', hideFrom, hideTo }) => {
  const t = useKtTime();
  if (t < t0 || t >= t1) return null;
  if (hideFrom !== undefined && hideTo !== undefined && t >= hideFrom && t < hideTo) return null;
  // the push runs on the SAME clock as the comp's ExitPushes (first frame of the push = one push step in) so the stack
  // leaves together with its footage
  const pushP = exitT !== undefined ? pushProgress(t - exitT + 1 / 30) : 0;
  const ex = exitDir === 'right' ? 0.962 * 1920 * pushP : 0;
  const ey = exitDir === 'down' ? 1.003 * 1080 * pushP : 0;
  return (
    <AbsoluteFill style={{ transform: `translate(${ex}px, ${ey}px)` }}>
      {rows.map((r, i) => {
        if (t < r.t) return null;
        const d = t - r.t;
        const caps = r.caps ?? (r.kind === 'head' ? 90 : r.kind === 'sub' ? 45 : 78);
        const fontSize = Math.round(caps / 0.7 / 1.1);
        const style = { font: F_KT, fontWeight: 800, fontStyle: 'italic' as const, fontSize, lineHeight: Math.round(fontSize * 1.05), color: r.kind === 'item' ? GOLD : '#FFFFFF', keyColor: GOLD, shadow: '5px 6px 10px rgba(0,0,0,0.75), 2px 3px 3px rgba(0,0,0,0.6), 0 0 22px rgba(0,0,0,0.45)' };
        if (r.kind === 'sub') {
          const p = Easing.bezier(0.33, 0.9, 0, 1)(interpolate(d, [0, 0.262], [0, 1], CL));
          const x = interpolate(p, [0, 1], [-0.347 * 1920, 960]);
          return (
            <div key={i} style={{ position: 'absolute', left: x, top: r.y, transform: 'translate(-50%, -50%)', width: 'max-content' }}>
              <KtTextBlock lines={[r.text]} style={style} />
            </div>
          );
        }
        const pm = pop110(d);
        const skew = r.kind === 'item' ? interpolate(d, [0, 0.1, 0.367], [0, 3, 0], CL) : 0;
        const axis = r.kind === 'item' ? interpolate(d, [0, 0.367], [0, 200], CL) : 0;
        const rot = r.kind === 'head' ? pm.rot : 0;
        return (
          <div key={i} style={{ position: 'absolute', left: 960, top: r.y, width: 'max-content', transform: `translate(-50%, -50%) scale(${pm.s / 1.1}) rotate(${rot + axis}deg) skewX(${skew}deg) rotate(${-axis}deg)` }}>
            <KtTextBlock lines={[r.text]} style={style} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** kt-push-slide: 0.100 s position slide, fast start, soft land (out-speed 2.96 / influence 33 -> in-speed 0 / influence 100) */
export const pushProgress = (d: number) => (d <= 0 ? 0 : Easing.bezier(0.33, 0.9, 0, 1)(Math.min(1, d / 0.1)));

// ---------------------------------------------------------------------------------------------------------------
// kt-caption-highlight (the running kinetic caption on the FACE lines; house caption track OFF there):
// one bottom line, Montserrat ExtraBold Italic ALL CAPS, white + drop shadow, key word(s) in the accent; a phrase
// appears at once on its first word and is replaced by the next; the video's FIRST phrase does the open_stretch
// (scale-height 300 -> 100 + skew 10 -> 0 over 0.483 s). Anchor y 88.75 percent, caps 52 px.
// ---------------------------------------------------------------------------------------------------------------
export const KT_CAP = { y: 0.8875 * 1080, caps: 52, maxW: 1556 };
export const ktCapFontSize = Math.round(KT_CAP.caps / 0.7);
export const KtCaptionLine: React.FC<{ text: string; t: number; t0: number; stretch?: boolean }> = ({ text, t, t0, stretch }) => {
  const d = t - t0;
  let sy = 1;
  let sk = 0;
  if (stretch) {
    const p = Easing.bezier(0.6, 0, 0.1, 1)(interpolate(d, [0, 0.483], [0, 1], CL));
    sy = 3 - 2 * p;
    sk = 10 * (1 - p);
  }
  return (
    <div style={{ position: 'absolute', left: 960, top: KT_CAP.y, width: 'max-content', maxWidth: KT_CAP.maxW, transform: `translate(-50%, -100%) scaleY(${sy}) skewX(${-sk}deg)`, transformOrigin: '50% 100%' }}>
      <KtTextBlock lines={[text]} maxWidth={KT_CAP.maxW} style={{ font: F_KT, fontWeight: 800, fontStyle: 'italic', fontSize: ktCapFontSize, lineHeight: Math.round(ktCapFontSize * 1.08), color: '#FFFFFF', keyColor: GOLD, shadow: KT_2023.shadow }} />
    </div>
  );
};

/** measure a caption string in the caption font (the sparkle sits on a key word's last letter) */
const measureCtx = (() => {
  let c: CanvasRenderingContext2D | null = null;
  return () => {
    if (!c && typeof document !== 'undefined') c = document.createElement('canvas').getContext('2d');
    return c;
  };
})();
export const captionWordEnd = (text: string, word: string): { x: number; y: number } => {
  const plain = text.replace(/\*/g, '').toUpperCase();
  const ctx = measureCtx();
  const font = `italic 800 ${ktCapFontSize}px Montserrat`;
  const w = (s: string) => {
    if (!ctx) return s.length * ktCapFontSize * 0.68;
    ctx.font = font;
    return ctx.measureText(s).width * 1.005 + s.length * 0.005 * ktCapFontSize;
  };
  const idx = plain.indexOf(word.toUpperCase());
  const total = w(plain);
  const end = w(plain.slice(0, idx + word.length));
  return { x: 960 - total / 2 + end, y: KT_CAP.y - KT_CAP.caps };
};

// ---------------------------------------------------------------------------------------------------------------
// kt-keyword-sparkle: the 4-point cartoon star burst (dot 0.07 s, point 0.17, grows to ~127 x 162 at 0.38, gone by
// 0.6, total 0.70 s), white with a soft white glow, on the top-right of the key word's last glyph.
// ---------------------------------------------------------------------------------------------------------------
export const Sparkle: React.FC<{ t: number; t0: number; x: number; y: number }> = ({ t, t0, x, y }) => {
  const d = t - t0;
  if (d < 0 || d > 0.7) return null;
  const W = interpolate(d, [0, 0.07, 0.17, 0.24, 0.31, 0.38, 0.45, 0.6, 0.7], [0, 50, 40, 100, 114, 127, 107, 40, 0], CL);
  const H = interpolate(d, [0, 0.07, 0.17, 0.24, 0.31, 0.38, 0.45, 0.6, 0.7], [0, 100, 90, 128, 150, 162, 140, 50, 0], CL);
  const thin = interpolate(d, [0.31, 0.6], [0.32, 0.12], CL);
  const w = W / 2;
  const h = H / 2;
  const k = thin;
  const path = `M0 ${-h} C ${w * k} ${-h * k}, ${w * k} ${-h * k}, ${w} 0 C ${w * k} ${h * k}, ${w * k} ${h * k}, 0 ${h} C ${-w * k} ${h * k}, ${-w * k} ${h * k}, ${-w} 0 C ${-w * k} ${-h * k}, ${-w * k} ${-h * k}, 0 ${-h} Z`;
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'visible', filter: 'drop-shadow(0 0 10px rgba(255,255,255,.55)) drop-shadow(2px 3px 4px rgba(0,0,0,.35))' }} viewBox="0 0 1920 1080">
      <path d={path} transform={`translate(${x} ${y})`} fill="#FFFFFF" />
    </svg>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// kt-subscribe-close `bar` variant, the comp driving the cursor to the TAKE's words (EDIT-PLAN 4:30.5-4:34.3: the take
// says SUBSCRIBE first, then like, no bell): a YouTube-style bar (699 x 134, centre (960, 881)) rises 538 px over
// 0.262 s, the cursor clicks SUBSCRIBE (-> SUBSCRIBED), then the like thumb, the bar drops 0.200 s (kt-push-slide).
// The plate's own click track is not used (its clicks are fixed like -> subscribe -> bell).
// ---------------------------------------------------------------------------------------------------------------
export const SubscribeBar: React.FC<{ t0: number; subT: number; likeT: number; dropT: number }> = ({ t0, subT, likeT, dropT }) => {
  const t = useKtTime();
  if (t < t0 || t >= dropT + 0.2) return null;
  const rise = Easing.bezier(0.19, 0.6, 0, 1)(interpolate(t - t0, [0, 0.262], [0, 1], CL));
  const drop = pushProgress((t - dropT) * 0.5);
  const cy = 881 + 538 * (1 - rise) + 1.003 * 1080 * drop * 0.6;
  const subbed = t >= subT;
  const liked = t >= likeT;
  // cursor path: enters from lower right, reaches SUBSCRIBE at subT, travels to the like thumb by likeT
  const subXY = { x: 1080, y: 0 };
  const likeXY = { x: 700, y: 0 };
  const cx0 = { x: 1360, y: 90 };
  const cur = t < subT
    ? { x: interpolate(t, [t0 + 0.1, subT - 0.05], [cx0.x, subXY.x], { ...CL, easing: Easing.inOut(Easing.cubic) }), y: interpolate(t, [t0 + 0.1, subT - 0.05], [cx0.y, subXY.y], { ...CL, easing: Easing.inOut(Easing.cubic) }) }
    : { x: interpolate(t, [subT + 0.6, likeT - 0.05], [subXY.x, likeXY.x], { ...CL, easing: Easing.inOut(Easing.cubic) }), y: 0 };
  const press = (tc: number) => (t >= tc && t < tc + 0.12 ? 0.86 : 1);
  const btn = (tc: number) => (t >= tc && t < tc + 0.18 ? interpolate(t - tc, [0, 0.09, 0.18], [1, 0.92, 1]) : 1);
  return (
    <div style={{ position: 'absolute', left: 960 - 349, top: cy - 67, width: 699, height: 134 }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 67, background: '#FFFFFF', boxShadow: '0 10px 30px rgba(0,0,0,.35)' }} />
      {/* like */}
      <div style={{ position: 'absolute', left: 36, top: 22, width: 300, height: 90, borderRadius: 45, background: '#F2F2F2', display: 'flex', alignItems: 'center', gap: 16, paddingLeft: 26, transform: `scale(${btn(likeT)})` }}>
        <svg width="54" height="54" viewBox="0 0 24 24">
          <path d="M2 21h4V9H2v12zm20-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L13.17 1 6.59 7.59C6.22 7.95 6 8.45 6 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" fill={liked ? '#0F0F0F' : 'none'} stroke="#0F0F0F" strokeWidth={liked ? 0 : 1.6} />
        </svg>
        <span style={{ fontFamily: "'Roboto', 'Arial', sans-serif", fontWeight: 700, fontSize: 40, color: '#0F0F0F' }}>LIKE</span>
      </div>
      {/* subscribe */}
      <div style={{ position: 'absolute', left: 356, top: 22, width: 300, height: 90, borderRadius: 45, background: subbed ? '#E5E5E5' : '#FF0000', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${btn(subT)})` }}>
        <span style={{ fontFamily: "'Roboto', 'Arial', sans-serif", fontWeight: 800, fontSize: subbed ? 34 : 38, letterSpacing: '.02em', color: subbed ? '#606060' : '#FFFFFF' }}>{subbed ? 'SUBSCRIBED' : 'SUBSCRIBE'}</span>
      </div>
      {/* cursor */}
      <svg style={{ position: 'absolute', left: 349 + cur.x - 960, top: 67 + cur.y - 6, width: 46, height: 62, transform: `scale(${press(subT) * press(likeT)})`, transformOrigin: '6px 6px', filter: 'drop-shadow(2px 3px 3px rgba(0,0,0,.4))' }} viewBox="0 0 46 62">
        <path d="M4 3 L4 50 L16 39 L24 58 L32 54 L24 36 L40 36 Z" fill="#FFFFFF" stroke="#000" strokeWidth="3" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// kt-icon-pop art (flat, code-rendered; the 2023 .aegraphic art is not extractable): the MONEY BAG (gold) and the
// DISCORD mark sticker (the real mark in its own colours, white-bordered rounded sticker as on the S2 card).
// ---------------------------------------------------------------------------------------------------------------
export const MoneyBag: React.FC = () => (
  <svg viewBox="0 0 200 220" style={{ width: '100%', height: '100%', filter: 'drop-shadow(4px 6px 8px rgba(0,0,0,.45))' }}>
    <path d="M70 40 L60 12 Q100 28 140 12 L130 40 Z" fill="#C99A00" stroke="#5A3F00" strokeWidth="6" strokeLinejoin="round" />
    <rect x="66" y="38" width="68" height="16" rx="8" fill="#8F6500" stroke="#5A3F00" strokeWidth="6" />
    <path d="M72 54 C 20 90, 14 200, 100 206 C 186 200, 180 90, 128 54 Z" fill={GOLD} stroke="#5A3F00" strokeWidth="7" strokeLinejoin="round" />
    <path d="M70 92 C 52 112, 48 150, 60 176" fill="none" stroke="#FFF3A6" strokeWidth="9" strokeLinecap="round" opacity=".85" />
    <text x="104" y="168" textAnchor="middle" fontFamily="Montserrat" fontWeight="900" fontSize="88" fill="#5A3F00">$</text>
  </svg>
);

export const DiscordSticker: React.FC = () => (
  <div style={{ width: '100%', height: '100%', borderRadius: '24%', background: '#5865F2', border: '9px solid #fff', boxSizing: 'border-box', boxShadow: '0 2px 4px rgba(20,22,26,.12), 0 16px 34px rgba(20,22,26,.32)', transform: 'rotate(-6deg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <svg viewBox="0 0 127.14 96.36" style={{ width: '62%' }}>
      <path
        fill="#fff"
        d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"
      />
    </svg>
  </div>
);

/** sticker variant of kt-icon-pop: a HARD CUT in and out (no slide), centred box */
export const StickerAt: React.FC<{ t0: number; t1: number; x: number; y: number; size: number; children: React.ReactNode }> = ({ t0, t1, x, y, size, children }) => {
  const t = useKtTime();
  if (t < t0 || t >= t1) return null;
  const hv = hover(t - t0, t0);
  return <div style={{ position: 'absolute', left: x - size / 2 + hv.x * 0.3, top: y - size / 2 + hv.y * 0.3, width: size, height: size }}>{children}</div>;
};

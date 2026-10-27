// Only18MonthsLeftCharts.tsx: the REAL animated charts of only-18-months-left (comp-build.md section 7, charts.md).
// Every chart is a code component driven by the composition clock: `rel` = frames since its COVERS row started and
// `fr(t)` = the row-relative frame of a SOURCE-spine second (routed through sh() in the comp), so each state lands ON its
// word. The PNGs in assets/charts/ are the chart-builder's design states (the spec); these components reproduce them.
// Values are the spec's (DATA.md, [VERIFY] at render): nothing here comes from an image model.
// Palette: chapter_themes of COVER-PLAN.json (CH1 red #ff4060, CH2 gold #ffd700, CH6 cyan #00c2ff, CH7 green #00e08a).
import React from 'react';
import { Easing, interpolate } from 'remotion';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadDMSans } from '@remotion/google-fonts/DMSans';
import { loadFont as loadJetBrains } from '@remotion/google-fonts/JetBrainsMono';

loadPlayfair('normal', { weights: ['700', '900'] });
loadDMSans('normal', { weights: ['400', '500', '700'] });
loadJetBrains('normal', { weights: ['400', '600'] });

const SERIF = "'Playfair Display', serif";
const SANS = "'DM Sans', sans-serif";
const MONO = "'JetBrains Mono', monospace";
export const ACCENT = { red: '#ff4060', gold: '#ffd700', cyan: '#00c2ff', green: '#00e08a', teal: '#16c4c8' };
const BG = '#0d0f14';
const DIM = '#5b6478';
const INK = '#ecedf2';

export type ChartProps = {
  /** frames since the chart's COVERS row started (from the comp's absolute clock) */
  rel: number;
  /** SOURCE-spine second -> frame relative to the row start (the comp routes it through sh()) */
  fr: (t: number) => number;
  /** absolute composition frame (the braam-pause zoom reads it) */
  abs: number;
  /** absolute frame -> absolute frame helpers for a pause window, when the chart spans one */
  pause?: { from: number; frames: number };
};

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const outE = Easing.out(Easing.cubic);
const ioE = Easing.inOut(Easing.cubic);
/** 0 -> 1 between two frames, eased */
const ramp = (f: number, a: number, b: number, e = outE) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: e });

const Frame: React.FC<{ accent: string; children: React.ReactNode }> = ({ accent, children }) => (
  <div style={{ position: 'absolute', inset: 0, background: BG, overflow: 'hidden' }}>
    <div
      style={{
        position: 'absolute', right: -420, top: -380, width: 1300, height: 1300, borderRadius: '50%',
        background: `radial-gradient(circle, ${accent}55 0%, ${accent}22 35%, transparent 68%)`,
      }}
    />
    {children}
  </div>
);

const Kicker: React.FC<{ y: number; text: string }> = ({ y, text }) => (
  <div style={{ position: 'absolute', left: 140, top: y, fontFamily: SANS, fontWeight: 500, fontSize: 27, letterSpacing: '0.2em', color: DIM }}>{text}</div>
);
const Rule: React.FC<{ y: number }> = ({ y }) => (
  <div style={{ position: 'absolute', left: 140, top: y, width: 66, height: 4, borderRadius: 2, background: ACCENT.teal }} />
);
const Source: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ position: 'absolute', left: 140, top: 1003, fontFamily: SANS, fontSize: 21, color: '#596175' }}>{text}</div>
);

// ------------------------------------------------------------------------------------------------------------------
// H1: paychecks vs prices (CH1, red). start 55.033 -> PAYCHECKS falls ON 'paychecks' 55.80 -> PRICES falls later ON
// 'prices' 57.80 with THE GAP lit -> OWN THE ASSETS holds at the top ON 'assets' 63.06. Text only, no numbers.
const smooth = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
const stepPath = (y0: number, y1: number, xa: number, xb: number, k: number, xEnd: number) => {
  const pts: string[] = [];
  for (let x = 140; x <= xEnd; x += 8) pts.push(`${x},${(y0 + (y1 - y0) * k * smooth((x - xa) / (xb - xa))).toFixed(1)}`);
  return 'M' + pts.join(' L');
};
const lineY = (y0: number, y1: number, xa: number, xb: number, k: number, x: number) => y0 + (y1 - y0) * k * smooth((x - xa) / (xb - xa));
/** the region between the fallen PAYCHECKS line and the still-high PRICES line (x 500 -> 1590) */
const gapPath = (pri: number, pay: number) => {
  const top: string[] = [];
  const bot: string[] = [];
  for (let x = 500; x <= 1590; x += 10) {
    top.push(`${x},${lineY(552, 822, 1320, 1590, pri, x).toFixed(1)}`);
    bot.unshift(`${x},${lineY(620, 828, 500, 760, pay, x).toFixed(1)}`);
  }
  return `M${top.join(' L')} L${bot.join(' L')} Z`;
};
export const H1Chart: React.FC<ChartProps> = ({ rel, fr }) => {
  const draw = ramp(rel, 4, 26);
  const xEnd = 140 + 1636 * draw;
  const pay = ramp(rel, fr(55.8), fr(55.8) + 22, ioE);
  const pri = ramp(rel, fr(57.8), fr(57.8) + 22, ioE);
  const gap = ramp(rel, fr(57.8) + 10, fr(57.8) + 26);
  const own = ramp(rel, fr(63.06), fr(63.06) + 20);
  const hdr = ramp(rel, 0, 12);
  return (
    <Frame accent={ACCENT.red}>
      <div style={{ opacity: hdr }}>
        <Kicker y={166} text="THE ORDER IT HAPPENS" />
        <div style={{ position: 'absolute', left: 140, top: 215, fontFamily: SERIF, fontWeight: 900, fontSize: 76, color: INK, letterSpacing: '-0.01em' }}>
          The paychecks go <span style={{ color: ACCENT.red }}>before the prices</span>.
        </div>
        <Rule y={322} />
      </div>
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
        <defs>
          <filter id="h1glow" x="-10%" y="-50%" width="120%" height="200%"><feGaussianBlur stdDeviation="6" /></filter>
        </defs>
        <line x1={140} y1={878} x2={1776} y2={878} stroke="#283040" strokeWidth={3} />
        {/* the gap between the two falls */}
        <path d={gapPath(pri, pay)} fill={ACCENT.red} opacity={0.13 * gap} />
        <g opacity={own}>
          <line x1={140} y1={430} x2={140 + 1636 * own} y2={430} stroke={ACCENT.green} strokeWidth={14} filter="url(#h1glow)" opacity={0.6} />
          <line x1={140} y1={430} x2={140 + 1636 * own} y2={430} stroke={ACCENT.green} strokeWidth={6} />
        </g>
        <path d={stepPath(552, 822, 1320, 1590, pri, xEnd)} stroke="#e9e9ef" strokeWidth={6} fill="none" />
        <path d={stepPath(620, 828, 500, 760, pay, xEnd)} stroke={ACCENT.red} strokeWidth={14} fill="none" filter="url(#h1glow)" opacity={0.55} />
        <path d={stepPath(620, 828, 500, 760, pay, xEnd)} stroke={ACCENT.red} strokeWidth={6} fill="none" />
      </svg>
      <div style={{ position: 'absolute', left: 140, top: 378, fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: '0.12em', color: ACCENT.green, opacity: own }}>OWN THE ASSETS</div>
      <div style={{ position: 'absolute', left: 140, top: 503, fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: '0.12em', color: INK, opacity: draw }}>PRICES</div>
      <div style={{ position: 'absolute', left: 140, top: 643, fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: '0.12em', color: ACCENT.red, opacity: draw }}>PAYCHECKS</div>
      <div style={{ position: 'absolute', left: 1712, top: 893, fontFamily: SANS, fontWeight: 500, fontSize: 23, letterSpacing: '0.2em', color: DIM, opacity: draw }}>TIME</div>
      <div style={{ position: 'absolute', left: 0, width: 2080, top: 660, textAlign: 'center', opacity: gap, transform: `scale(${0.92 + 0.08 * gap})` }}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 66, color: '#b8303f' }}>THE GAP</div>
        <div style={{ fontFamily: SANS, fontSize: 28, color: '#9aa0ad', marginTop: 4 }}>no paycheck, prices not cheap yet</div>
      </div>
    </Frame>
  );
};

// ------------------------------------------------------------------------------------------------------------------
// C4 / C4b: freelance posts vs manual work (CH2, gold). Header first, bars draw ON their word, the AI bar falls to its
// figure ON the number (Demirci, Hannane, Zhu, Management Science 2025: writing+coding -21 %, image -17 %).
type BarsSpec = {
  head: React.ReactNode; head2?: React.ReactNode; head2At?: number; sub: string; label: string; drop: number;
  barsAt: number; fallAt: number; payAt: number;
};
const BarsChart: React.FC<ChartProps & { spec: BarsSpec }> = ({ rel, fr, spec }) => {
  const hdr = ramp(rel, 0, 12);
  const h2 = spec.head2At === undefined ? 1 : ramp(rel, fr(spec.head2At), fr(spec.head2At) + 10);
  const bars = ramp(rel, fr(spec.barsAt), fr(spec.barsAt) + 20);
  const fall = ramp(rel, fr(spec.fallAt), fr(spec.payAt) + 14, ioE);
  const pay = ramp(rel, fr(spec.payAt), fr(spec.payAt) + 12);
  const W = 960;
  const ai = W * bars * (1 - (spec.drop / 100) * fall);
  const pct = Math.round(spec.drop * fall);
  return (
    <Frame accent={ACCENT.gold}>
      <div style={{ opacity: hdr }}>
        <Kicker y={200} text="FREELANCE JOB POSTS" />
        <div style={{ position: 'absolute', left: 140, top: 248, fontFamily: SERIF, fontWeight: 900, fontSize: 92, color: INK, letterSpacing: '-0.015em', whiteSpace: 'nowrap' }}>
          {spec.head}
          <span style={{ opacity: h2 }}>{spec.head2}</span>
        </div>
        <Rule y={376} />
        <div style={{ position: 'absolute', left: 140, top: 424, fontFamily: SANS, fontWeight: 500, fontSize: 20, letterSpacing: '0.18em', color: DIM }}>{spec.sub}</div>
      </div>
      <div style={{ opacity: bars }}>
        <div style={{ position: 'absolute', left: 140, top: 550, fontFamily: SANS, fontWeight: 700, fontSize: 29, letterSpacing: '0.1em', color: '#aab1c0' }}>MANUAL WORK</div>
        <div style={{ position: 'absolute', left: 140, top: 592, fontFamily: SANS, fontSize: 21, color: '#9aa0ad' }}>hands-on job posts</div>
        <div style={{ position: 'absolute', left: 1610, top: 568, fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: '0.14em', color: '#aab1c0' }}>FLAT</div>
        <div style={{ position: 'absolute', left: 140, top: 730, fontFamily: SANS, fontWeight: 700, fontSize: 29, letterSpacing: '0.1em', color: INK }}>{spec.label}</div>
        <div style={{ position: 'absolute', left: 140, top: 772, fontFamily: SANS, fontSize: 21, color: '#9aa0ad' }}>freelance job posts</div>
      </div>
      <div style={{ position: 'absolute', left: 610, top: 524, width: W * bars, height: 116, borderRadius: 8, background: '#3f4558' }} />
      <div style={{ position: 'absolute', left: 610, top: 704, width: W, height: 116, borderRadius: 8, border: `2px dashed ${ACCENT.gold}88`, opacity: fall * 0.9, boxSizing: 'border-box', background: '#13161d' }} />
      <div style={{ position: 'absolute', left: 610, top: 704, width: ai, height: 116, borderRadius: 8, background: ACCENT.gold, boxShadow: `0 0 22px ${ACCENT.gold}aa` }} />
      <div style={{ position: 'absolute', left: 1612, top: 718, fontFamily: SANS, fontWeight: 700, fontSize: 72, color: ACCENT.gold, opacity: pay, textShadow: `0 0 18px ${ACCENT.gold}aa` }}>-{pct}%</div>
      <Source text={'Demirci, Hannane, Zhu, "Who is AI replacing?", Management Science, 2025 · online freelancing job posts, change relative to manual-intensive work'} />
    </Frame>
  );
};
export const C4Chart: React.FC<ChartProps> = (p) => (
  <BarsChart
    {...p}
    spec={{
      head: <>The work didn't vanish. </>,
      head2: <>It got <span style={{ color: ACCENT.gold }}>cheap</span>.</>,
      head2At: 82.6,
      sub: 'WITHIN 8 MONTHS OF CHATGPT, RELATIVE TO MANUAL WORK',
      label: 'WRITING AND CODING',
      drop: 21,
      barsAt: 83.38,
      fallAt: 88.4,
      payAt: 89.08,
    }}
  />
);
export const C4bChart: React.FC<ChartProps> = (p) => (
  <BarsChart
    {...p}
    spec={{
      head: <>Image work got <span style={{ color: ACCENT.gold }}>cheap</span> too.</>,
      sub: 'AFTER IMAGE-GENERATING AI ARRIVED, RELATIVE TO MANUAL WORK',
      label: 'IMAGE CREATION',
      drop: 17,
      barsAt: 154.02,
      fallAt: 155.7,
      payAt: 156.12,
    }}
  />
);

// ------------------------------------------------------------------------------------------------------------------
// C22: Goldman exposure (CH6, cyan). The 863,700 count-up on the header (BLS), the four bars draw ON 'Back in 2023' 389.45,
// LEGAL 44 lit ON '44' 392.29, the rest dark (Goldman Sachs, Briggs and Kodnani, 2023-03-26).
export const C22Chart: React.FC<ChartProps> = ({ rel, fr }) => {
  const hdr = ramp(rel, 0, 12);
  const count = Math.round(863700 * ramp(rel, 2, 30));
  const bars = ramp(rel, fr(389.45), fr(389.45) + 24);
  const lit = ramp(rel, fr(392.29), fr(392.29) + 10);
  const rows = [
    { l: 'OFFICE AND ADMIN', v: 46 },
    { l: 'LEGAL', v: 44, hi: true },
    { l: 'CONSTRUCTION', v: 6 },
    { l: 'MAINTENANCE', v: 4 },
  ];
  return (
    <Frame accent={ACCENT.cyan}>
      <div style={{ opacity: hdr }}>
        <Kicker y={183} text="LAWYERS, US, 2025" />
        <div style={{ position: 'absolute', left: 140, top: 232, whiteSpace: 'nowrap' }}>
          <span style={{ fontFamily: MONO, fontWeight: 600, fontSize: 92, color: ACCENT.cyan }}>{count.toLocaleString('en-US')}</span>
          <span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 92, color: INK, marginLeft: 22 }}>lawyers.</span>
        </div>
        <Rule y={364} />
        <div style={{ position: 'absolute', left: 140, top: 410, fontFamily: SANS, fontWeight: 500, fontSize: 20, letterSpacing: '0.18em', color: DIM }}>SHARE OF WORK TASKS THAT COULD BE AUTOMATED BY AI, US</div>
      </div>
      {rows.map((r, i) => {
        const y = 471 + i * 106;
        const w = 1140 * (r.v / 60) * ramp(rel, fr(389.45) + i * 4, fr(389.45) + i * 4 + 22);
        const on = r.hi ? lit : 0;
        const col = on > 0.01 ? ACCENT.cyan : '#2b3040';
        return (
          <React.Fragment key={r.l}>
            <div style={{ position: 'absolute', left: 140, top: y + 24, fontFamily: SANS, fontWeight: 700, fontSize: 28, letterSpacing: '0.1em', color: r.hi && on > 0.5 ? INK : '#8c93a3', opacity: bars }}>{r.l}</div>
            <div style={{ position: 'absolute', left: 570, top: y, width: 1140, height: 78, borderRadius: 8, background: '#151820', border: '2px solid #1f2430', opacity: bars, boxSizing: 'border-box' }} />
            <div style={{ position: 'absolute', left: 570, top: y, width: w, height: 78, borderRadius: 8, background: col, boxShadow: on > 0.01 ? `0 0 ${20 * on}px ${ACCENT.cyan}` : 'none' }} />
            <div style={{ position: 'absolute', left: 570 + w + 24, top: y + 14, fontFamily: MONO, fontWeight: 600, fontSize: on > 0.5 ? 46 : 36, color: on > 0.5 ? ACCENT.cyan : '#4a5162', opacity: bars }}>{r.v}%</div>
          </React.Fragment>
        );
      })}
      <Source text="Lawyers: BLS Occupational Outlook Handbook, 2025 employment · Exposure: Goldman Sachs, Briggs and Kodnani, March 26, 2023 (US, share of current work tasks)" />
    </Frame>
  );
};

// ------------------------------------------------------------------------------------------------------------------
// C35: longevity escape velocity (CH7, green). Part 1 the MONTHS GAINED PER YEAR dial: needle sweeps to 4 TODAY (KURZWEIL)
// 508.27, the red 12 line labels itself ESCAPE VELOCITY ON 'escape' 515.41, the needle swings past 12 ON 'more than a year'
// 520.89. Part 2 (ON 'Ray Kurzweil' 522.09) the timeline: KURZWEIL 2029 TO 2035 lit, DE GREY even odds by the late 2030s
// joins ON 'Aubrey de Grey' 527.59. Then the BRAAM spine pause (5.1 s at 532.88): the view eases into KURZWEIL 2029 TO 2035
// (the figure drifts to frame centre, ~2.4x) over exactly the pause frames and holds (EDIT-PLAN 8:52.9).
const DC = { x: 1260, y: 800, r: 430 };
const ang = (v: number) => ((180 - v * 11.25) * Math.PI) / 180;
const pol = (v: number, r: number) => ({ x: DC.x + r * Math.cos(ang(v)), y: DC.y - r * Math.sin(ang(v)) });
const arc = (v0: number, v1: number, r: number) => {
  const a = pol(v0, r);
  const b = pol(v1, r);
  return `M${a.x},${a.y} A${r},${r} 0 0 1 ${b.x},${b.y}`;
};
const Dial: React.FC<ChartProps> = ({ rel, fr }) => {
  const sweep = ramp(rel, 6, 30, ioE);
  const esc = ramp(rel, fr(515.41), fr(515.41) + 14);
  const swing = ramp(rel, fr(520.89), fr(520.89) + 22, Easing.out(Easing.back(1.4)));
  const v = 4 * sweep + (14.2 - 4) * swing;
  const tip = pol(v, 300);
  const green = Math.min(v, 16);
  return (
    <>
      <Kicker y={294} text="LONGEVITY" />
      <div style={{ position: 'absolute', left: 140, top: 342, fontFamily: SERIF, fontWeight: 900, fontSize: 76, lineHeight: '78px', color: INK, letterSpacing: '-0.015em' }}>
        Months of life<br />medicine <span style={{ color: ACCENT.green }}>gives back</span>.
      </div>
      <Rule y={528} />
      <div style={{ position: 'absolute', left: 140, top: 568, fontFamily: SANS, fontSize: 30, color: '#9aa0ad' }}>
        for every year you age. At <b style={{ color: INK }}>12</b>, a whole year back.
      </div>
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
        <defs>
          <filter id="dglow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="8" /></filter>
        </defs>
        <path d={arc(0, 12, DC.r)} stroke="#232733" strokeWidth={36} fill="none" />
        <path d={arc(12, 16, DC.r)} stroke="#5a2a35" strokeWidth={36} fill="none" />
        {green > 0.05 && <path d={arc(0, Math.min(green, 12), DC.r)} stroke={ACCENT.green} strokeWidth={36} fill="none" />}
        {green > 12 && <path d={arc(12, green, DC.r)} stroke={ACCENT.red} strokeWidth={36} fill="none" opacity={0.9} />}
        {Array.from({ length: 17 }, (_, i) => {
          const a = pol(i, DC.r - 50);
          const b = pol(i, DC.r - (i % 4 === 0 ? 80 : 65));
          return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={i === 12 ? ACCENT.red : '#4a5162'} strokeWidth={i % 4 === 0 ? 3 : 2} />;
        })}
        {(() => {
          const a = pol(12, DC.r - 30);
          const b = pol(12, DC.r + 40);
          return <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={ACCENT.red} strokeWidth={5} opacity={0.6 + 0.4 * esc} />;
        })()}
        {[0, 4, 8, 12].map((n) => {
          const p = pol(n, DC.r - 125);
          return (
            <text key={n} x={p.x} y={p.y + 14} textAnchor="middle" fontFamily={MONO} fontSize={34} fill={n === 12 && esc > 0.5 ? ACCENT.red : '#9aa0ad'}>{n}</text>
          );
        })}
        <line x1={DC.x} y1={DC.y} x2={tip.x} y2={tip.y} stroke={ACCENT.green} strokeWidth={14} filter="url(#dglow)" opacity={0.6} />
        <line x1={DC.x} y1={DC.y} x2={tip.x} y2={tip.y} stroke={ACCENT.green} strokeWidth={8} strokeLinecap="round" />
        <circle cx={DC.x} cy={DC.y} r={22} fill={ACCENT.green} />
        <circle cx={DC.x} cy={DC.y} r={9} fill={BG} />
      </svg>
      <div style={{ position: 'absolute', left: DC.x - 360, width: 720, top: 588, textAlign: 'center', opacity: esc }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 34, letterSpacing: '0.12em', color: ACCENT.red }}>ESCAPE VELOCITY</div>
        <div style={{ fontFamily: SANS, fontSize: 26, color: INK, marginTop: 4 }}>a full year back, every year</div>
      </div>
      <div style={{ position: 'absolute', left: DC.x - 500, width: 1000, top: 838, textAlign: 'center' }}>
        {swing < 0.5 ? (
          <div style={{ opacity: sweep * (1 - swing * 2) }}>
            <div style={{ fontFamily: MONO, fontWeight: 600, fontSize: 76, color: ACCENT.green, lineHeight: '80px' }}>{Math.max(0, Math.round(v))} MONTHS</div>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 25, letterSpacing: '0.16em', color: '#aab1c0', marginTop: 8 }}>TODAY (KURZWEIL)</div>
          </div>
        ) : (
          <div style={{ opacity: (swing - 0.5) * 2 }}>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 60, color: ACCENT.green, lineHeight: '84px' }}>More than a year</div>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 25, letterSpacing: '0.16em', color: '#aab1c0', marginTop: 6 }}>BACK FOR EVERY YEAR YOU LIVE</div>
          </div>
        )}
      </div>
      <Source text="Ray Kurzweil, interview with Bessemer Venture Partners (as reported); longevity escape velocity, definition" />
    </>
  );
};
const yx = (y: number) => 200 + ((y - 2026.8) / (2040 - 2026.8)) * 1500; // year -> x on the timeline
const Timeline: React.FC<ChartProps & { relight: number }> = ({ rel, fr, relight }) => {
  const k0 = fr(522.09);
  const kz = ramp(rel, k0, k0 + 18);
  const dg = ramp(rel, fr(527.59), fr(527.59) + 16);
  const kLit = Math.max(kz * (1 - dg), relight);
  const kx0 = yx(2029);
  const kx1 = kx0 + (yx(2035) - kx0) * kz;
  const kc = kLit > 0.01 ? ACCENT.green : '#323848';
  return (
    <>
      <Kicker y={176} text="LONGEVITY ESCAPE VELOCITY" />
      <div style={{ position: 'absolute', left: 140, top: 222, fontFamily: SERIF, fontWeight: 900, fontSize: 76, color: INK, letterSpacing: '-0.015em' }}>
        When it <span style={{ color: ACCENT.green }}>could arrive</span>.
      </div>
      <Rule y={333} />
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
        <defs>
          <filter id="tglow" x="-10%" y="-200%" width="120%" height="500%"><feGaussianBlur stdDeviation="9" /></filter>
          <linearGradient id="dgg" x1="0" x2="1">
            <stop offset="0" stopColor={ACCENT.green} stopOpacity={0} />
            <stop offset="0.2" stopColor={ACCENT.green} stopOpacity={1} />
            <stop offset="0.8" stopColor={ACCENT.green} stopOpacity={1} />
            <stop offset="1" stopColor={ACCENT.green} stopOpacity={0} />
          </linearGradient>
        </defs>
        <line x1={140} y1={648} x2={1760} y2={648} stroke="#323848" strokeWidth={3} />
        <path d="M1752,638 L1774,648 L1752,658 Z" fill="#323848" />
        {[2030, 2035, 2040].map((y) => (
          <React.Fragment key={y}>
            <line x1={yx(y)} y1={670} x2={yx(y)} y2={678} stroke="#4a5162" strokeWidth={2} />
            <text x={yx(y)} y={710} textAnchor="middle" fontFamily={MONO} fontSize={28} fill="#7a8193">{y}</text>
          </React.Fragment>
        ))}
        <circle cx={200} cy={648} r={14} fill="#d8d9df" />
        {kLit > 0.01 && <rect x={kx0} y={630} width={kx1 - kx0} height={36} rx={18} fill={ACCENT.green} filter="url(#tglow)" opacity={0.6 * kLit} />}
        <rect x={kx0} y={630} width={Math.max(0, kx1 - kx0)} height={36} rx={18} fill={kc} opacity={kLit > 0.01 ? 0.35 + 0.65 * kLit : 1} />
        <rect x={yx(2035.8)} y={638} width={(yx(2039.6) - yx(2035.8)) * dg} height={20} rx={10} fill="url(#dgg)" filter="url(#tglow)" opacity={dg} />
        <rect x={yx(2035.8)} y={641} width={(yx(2039.6) - yx(2035.8)) * dg} height={14} rx={7} fill="url(#dgg)" opacity={dg} />
      </svg>
      <div style={{ position: 'absolute', left: 186, top: 678, fontFamily: MONO, fontSize: 28, color: '#d8d9df' }}>OCT 2026</div>
      <div style={{ position: 'absolute', left: 186, top: 722, fontFamily: SANS, fontWeight: 700, fontSize: 23, letterSpacing: '0.12em', color: '#9aa0ad' }}>TODAY</div>
      <div style={{ position: 'absolute', left: kx0, top: 512, opacity: kz }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 27, letterSpacing: '0.1em', color: kLit > 0.5 ? INK : '#4a5162' }}>RAY KURZWEIL</div>
        <div style={{ fontFamily: MONO, fontWeight: 600, fontSize: 46, color: kLit > 0.5 ? ACCENT.green : '#3c4252', marginTop: 4 }}>2029 TO 2035</div>
      </div>
      <div style={{ position: 'absolute', left: 1189, top: 772, opacity: dg }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 28, letterSpacing: '0.1em', color: INK }}>AUBREY DE GREY</div>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 36, color: ACCENT.green, marginTop: 6 }}>even odds by the late 2030s</div>
      </div>
      <Source text="Kurzweil window as revised in The Economist (2024), via coverage · de Grey, a 50 percent chance by the mid-to-late 2030s" />
    </>
  );
};
export const C35Chart: React.FC<ChartProps> = (p) => {
  const sw = ramp(p.rel, p.fr(522.09) - 6, p.fr(522.09) + 6);
  // the braam beat pause: the zoom into KURZWEIL 2029 TO 2035, eased over exactly the pause's frames, held after
  const z = p.pause ? interpolate(p.abs, [p.pause.from, p.pause.from + p.pause.frames], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) }) : 0;
  const fx = (yx(2029) + yx(2035)) / 2;
  const fy = 600;
  const s = 1 + 1.4 * z;
  const tx = (960 - fx) * z;
  const ty = (540 - fy) * z;
  return (
    <Frame accent={ACCENT.green}>
      <div style={{ position: 'absolute', inset: 0, transformOrigin: `${fx}px ${fy}px`, transform: `translate(${tx}px, ${ty}px) scale(${s})` }}>
        {sw < 1 && <div style={{ position: 'absolute', inset: 0, opacity: 1 - sw }}><Dial {...p} /></div>}
        {sw > 0 && <div style={{ position: 'absolute', inset: 0, opacity: sw }}><Timeline {...p} relight={z} /></div>}
      </div>
    </Frame>
  );
};

// the roll-call cards (hw-zoom-slideshow ROLL 1): the twelve code-rendered pictogram cards, cut ON the spoken words
export const ROLL1 = [
  { ref: 'C1-roll1-01-customer-service-reps', t: 7.68 },
  { ref: 'C1-roll1-02-roofers', t: 8.48 },
  { ref: 'C1-roll1-03-carpenters', t: 9.18 },
  { ref: 'C1-roll1-04-cashiers', t: 10.08 },
  { ref: 'C1-roll1-05-heavy-truck-drivers', t: 11.2 },
  { ref: 'C1-roll1-06-hand-laborers-material-movers', t: 12.14 },
  { ref: 'C1-roll1-07-electricians', t: 13.22 },
  { ref: 'C1-roll1-08-plumbers-pipefitters', t: 14.48 },
  { ref: 'C1-roll1-09-taxi-shuttle-chauffeur', t: 15.12 },
  { ref: 'C1-roll1-10-computer-programmers', t: 15.68 },
  { ref: 'C1-roll1-11-radiologists', t: 16.12 },
  { ref: 'C1-roll1-12-neurosurgeons', t: 16.54 },
];
export const ROLL1_END = 17.46;

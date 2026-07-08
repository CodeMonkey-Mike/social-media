import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from 'remotion';

/**
 * carry-trade — REAL animated chart components (charts.md §3: animate-for-real, never PNG+wipe).
 * Geometry/values are 1:1 with the Mike-approved PNG proofs in media/carry-trade/assets/charts/
 * (schematic step-plots/bars; labels carry the verified numbers, [VERIFY] at final render).
 */

const ease = Easing.out(Easing.cubic);
const MONO = "'JetBrains Mono','Consolas',monospace";
const SANS = "'DM Sans','Segoe UI',sans-serif";

const Card: React.FC<{ title: string; sub: string; takeaway: React.ReactNode; source: string; children: React.ReactNode }> = ({ title, sub, takeaway, source, children }) => (
  <AbsoluteFill style={{ background: '#05070a', justifyContent: 'center', alignItems: 'center' }}>
    <div style={{ width: 1820, height: 980, background: '#0d1015', border: '1px solid #1e2330', borderRadius: 28, padding: '64px 72px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontFamily: SANS, fontSize: 52, fontWeight: 900, color: '#e8eaf0', letterSpacing: '-0.01em' }}>{title}</div>
      <div style={{ fontFamily: SANS, fontSize: 24, color: '#8892a4', marginTop: 14 }}>{sub}</div>
      <div style={{ flex: 1, marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{children}</div>
      <div style={{ fontFamily: SANS, fontSize: 30, marginTop: 12 }}>{takeaway}</div>
      <div style={{ fontFamily: MONO, fontSize: 17, color: '#505a6e', marginTop: 14 }}>{source}</div>
    </div>
  </AbsoluteFill>
);

/** line-draw progress 0..1 over ~36f with slight delay */
const useDraw = (delay = 6, dur = 36) => {
  const f = useCurrentFrame();
  return interpolate(f, [delay, delay + dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
};
const useFadeAt = (at: number, dur = 8) => {
  const f = useCurrentFrame();
  return interpolate(f, [at, at + dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
};

const DrawnPolyline: React.FC<{ points: string; stroke: string; width?: number; p: number; len: number }> = ({ points, stroke, width = 5, p, len }) => (
  <polyline fill="none" stroke={stroke} strokeWidth={width} points={points} strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
);

export const CtC1: React.FC = () => {
  const p = useDraw();
  const l1 = useFadeAt(24), l2 = useFadeAt(32), l3 = useFadeAt(40);
  return (
    <Card title="BoJ Policy Rate, 2007–2026" sub="Bank of Japan policy interest rate over time"
      takeaway={<span style={{ fontFamily: SANS }}><b style={{ color: '#ff4060' }}>Three hikes since 2024</b><span style={{ color: '#8892a4' }}>, after a decade-plus at zero or negative — the highest rate since 1995</span></span>}
      source="SOURCE: BANK OF JAPAN POLICY ANNOUNCEMENTS. SCHEMATIC STEP-PLOT FROM CONFIRMED DATED RATE CHANGES. VERIFY AT RENDER.">
      <svg viewBox="0 0 1680 620" width={1580} height={583}>
        <line x1={100} y1={60} x2={100} y2={540} stroke="#1e2330" strokeWidth={2} />
        <line x1={100} y1={540} x2={1620} y2={540} stroke="#1e2330" strokeWidth={2} />
        <text x={70} y={278} fill="#8892a4" fontFamily={MONO} fontSize={22} textAnchor="end">1%</text>
        <text x={70} y={458} fill="#8892a4" fontFamily={MONO} fontSize={22} textAnchor="end">0%</text>
        <text x={60} y={478} fill="#8892a4" fontFamily={MONO} fontSize={22} textAnchor="end">-0.1%</text>
        <DrawnPolyline points="100,360 340,360 340,470 860,470 860,405 1200,405 1200,315 1320,315 1320,270 1620,270" stroke="#ff4060" p={p} len={2400} />
        <g opacity={l1}><circle cx={860} cy={405} r={9} fill="#ffd700" /><text x={820} y={375} fill="#ffd700" fontFamily={MONO} fontSize={24} textAnchor="middle">Jul 2024: 0.25%</text></g>
        <g opacity={l2}><circle cx={1200} cy={315} r={9} fill="#ffd700" /><text x={1140} y={285} fill="#ffd700" fontFamily={MONO} fontSize={24} textAnchor="middle">Feb 2026: 0.75%</text></g>
        <g opacity={l3}><circle cx={1320} cy={270} r={9} fill="#00e68a" /><text x={1440} y={235} fill="#00e68a" fontFamily={MONO} fontSize={24} textAnchor="middle">Jun 2026: 1%</text></g>
        <text x={100} y={580} fill="#505a6e" fontFamily={MONO} fontSize={20} textAnchor="middle">2008</text>
        <text x={860} y={580} fill="#505a6e" fontFamily={MONO} fontSize={20} textAnchor="middle">2024</text>
        <text x={1550} y={580} fill="#505a6e" fontFamily={MONO} fontSize={20} textAnchor="middle">2026</text>
      </svg>
    </Card>
  );
};

export const CtC2: React.FC = () => {
  const p = useDraw();
  const m1 = useFadeAt(18), m2 = useFadeAt(26), m3 = useFadeAt(34), m4 = useFadeAt(42);
  return (
    <Card title="USD/JPY: Intervention After Intervention, the Yen Keeps Falling" sub="Dollar-yen exchange rate with Japan's currency-defense spending marked"
      takeaway={<span style={{ fontFamily: SANS }}><b style={{ color: '#00c2ff' }}>Billions spent defending the yen</b><span style={{ color: '#8892a4' }}>, and it still hit its weakest level in almost 40 years</span></span>}
      source="SOURCE: BOJ/MOF INTERVENTION DISCLOSURES + YAHOO FINANCE (JUN 2026). SCHEMATIC — 2024 IN ¥T, 2026 IN US$B. VERIFY AT RENDER.">
      <svg viewBox="0 0 1680 600" width={1580} height={564}>
        <line x1={100} y1={40} x2={100} y2={520} stroke="#1e2330" strokeWidth={2} />
        <line x1={100} y1={520} x2={1620} y2={520} stroke="#1e2330" strokeWidth={2} />
        <text x={70} y={130} fill="#8892a4" fontFamily={MONO} fontSize={22} textAnchor="end">¥162</text>
        <text x={70} y={300} fill="#8892a4" fontFamily={MONO} fontSize={22} textAnchor="end">¥155</text>
        <text x={70} y={480} fill="#8892a4" fontFamily={MONO} fontSize={22} textAnchor="end">¥145</text>
        <DrawnPolyline points="100,420 340,260 460,260 500,430 620,410 770,280 850,440 970,360 1160,260 1340,180 1620,140" stroke="#00c2ff" p={p} len={2100} />
        <g opacity={m1}><circle cx={500} cy={430} r={9} fill="#ffd700" /><text x={500} y={475} fill="#ffd700" fontFamily={MONO} fontSize={22} textAnchor="middle">Apr-May 2024: ¥9.8T</text></g>
        <g opacity={m2}><circle cx={850} cy={440} r={9} fill="#ffd700" /><text x={850} y={485} fill="#ffd700" fontFamily={MONO} fontSize={22} textAnchor="middle">Jul 2024: ¥5.5T</text></g>
        <g opacity={m3}><circle cx={1340} cy={180} r={9} fill="#ffd700" /><text x={1300} y={145} fill="#ffd700" fontFamily={MONO} fontSize={22} textAnchor="middle">2026: ~$72.5B spent</text></g>
        <g opacity={m4}><circle cx={1620} cy={140} r={10} fill="#ff4060" /><text x={1620} y={105} fill="#ff4060" fontFamily={MONO} fontSize={24} textAnchor="end">Jun 2026: ~¥162 (~40yr low)</text></g>
        <text x={140} y={560} fill="#505a6e" fontFamily={MONO} fontSize={20}>2024</text>
        <text x={1560} y={560} fill="#505a6e" fontFamily={MONO} fontSize={20}>2026</text>
      </svg>
    </Card>
  );
};

export const CtC3: React.FC = () => {
  const p = useDraw();
  const a = useFadeAt(8), b = useFadeAt(38);
  return (
    <Card title="Bitcoin, August 2–5, 2024" sub="The 48 hours the carry-trade unwind reached crypto"
      takeaway={<span style={{ fontFamily: SANS }}><b style={{ color: '#ff4060' }}>−$14,000 in about 48 hours</b><span style={{ color: '#8892a4' }}> — and priced in yen, it fell even harder than in dollars</span></span>}
      source="SOURCE: BIS BULLETIN NO. 90 + COINDESK (2024-08-05). SCHEMATIC FROM CONFIRMED ENDPOINTS. VERIFY AT RENDER.">
      <svg viewBox="0 0 1680 600" width={1580} height={564}>
        <line x1={100} y1={40} x2={100} y2={520} stroke="#1e2330" strokeWidth={2} />
        <line x1={100} y1={520} x2={1620} y2={520} stroke="#1e2330" strokeWidth={2} />
        <text x={70} y={110} fill="#8892a4" fontFamily={MONO} fontSize={22} textAnchor="end">$64K</text>
        <text x={70} y={300} fill="#8892a4" fontFamily={MONO} fontSize={22} textAnchor="end">$57K</text>
        <text x={70} y={440} fill="#8892a4" fontFamily={MONO} fontSize={22} textAnchor="end">$50K</text>
        <DrawnPolyline points="100,100 480,110 850,180 1160,360 1450,455 1620,430" stroke="#ff4060" p={p} len={1650} />
        <g opacity={a}><circle cx={100} cy={100} r={10} fill="#00e68a" /><text x={150} y={70} fill="#00e68a" fontFamily={MONO} fontSize={26}>~$64,000</text></g>
        <g opacity={b}><circle cx={1450} cy={455} r={10} fill="#ff4060" /><text x={1430} y={500} fill="#ff4060" fontFamily={MONO} fontSize={26} textAnchor="middle">sub-$50,000</text></g>
        <text x={100} y={560} fill="#505a6e" fontFamily={MONO} fontSize={20}>Aug 2</text>
        <text x={1560} y={560} fill="#505a6e" fontFamily={MONO} fontSize={20}>Aug 5</text>
      </svg>
    </Card>
  );
};

const GrowBar: React.FC<{ x: number; yBase: number; w: number; h: number; fill: string; p: number; opacity?: number }> = ({ x, yBase, w, h, fill, p, opacity = 1 }) => (
  <rect x={x} y={yBase - h * p} width={w} height={h * p} fill={fill} opacity={opacity} />
);

export const CtC4: React.FC = () => {
  const f = useCurrentFrame();
  const bp = (i: number) => interpolate(f, [4 + i * 5, 22 + i * 5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  const lbl = useFadeAt(34);
  return (
    <Card title="Japan's US Treasury Holdings: the Q1 2026 Outflow" sub="The largest foreign holder of US government debt, ~$1.24T, just logged a ~$29.6B quarterly sale"
      takeaway={<span style={{ fontFamily: SANS }}><b style={{ color: '#ffd700' }}>A flow, not the whole stock</b><span style={{ color: '#8892a4' }}> — but the direction just flipped for the first time in years</span></span>}
      source="SOURCE: US TREASURY TIC DATA VIA FORTUNE / YAHOO FINANCE (MAY 2026). Q1'26 = REAL FLAGGED FLOW; PRIOR BARS = STOCK CONTEXT. VERIFY AT RENDER.">
      <svg viewBox="0 0 1680 600" width={1580} height={564}>
        <line x1={100} y1={520} x2={1620} y2={520} stroke="#1e2330" strokeWidth={2} />
        <GrowBar x={180} yBase={520} w={180} h={340} fill="#00c2ff" opacity={0.85} p={bp(0)} />
        <GrowBar x={440} yBase={520} w={180} h={350} fill="#00c2ff" opacity={0.85} p={bp(1)} />
        <GrowBar x={700} yBase={520} w={180} h={360} fill="#00c2ff" opacity={0.85} p={bp(2)} />
        <GrowBar x={960} yBase={520} w={180} h={370} fill="#00c2ff" opacity={0.85} p={bp(3)} />
        <GrowBar x={1220} yBase={520} w={180} h={305} fill="#ff4060" p={bp(4)} />
        <g opacity={lbl}>
          <text x={1310} y={185} fill="#ff4060" fontFamily={MONO} fontSize={28} textAnchor="middle" fontWeight={600}>−$29.6B</text>
          <text x={1310} y={120} fill="#e8eaf0" fontFamily={MONO} fontSize={24} textAnchor="middle">~$1.24T total (Feb 2026)</text>
        </g>
        {['Q1’25', 'Q2’25', 'Q3’25', 'Q4’25'].map((q, i) => (
          <text key={q} x={270 + i * 260} y={560} fill="#505a6e" fontFamily={MONO} fontSize={22} textAnchor="middle">{q}</text>
        ))}
        <text x={1310} y={560} fill="#ff4060" fontFamily={MONO} fontSize={22} textAnchor="middle" fontWeight={600}>Q1'26</text>
      </svg>
    </Card>
  );
};

export const CtC5: React.FC = () => {
  const f = useCurrentFrame();
  const bp = (i: number) => interpolate(f, [4 + i * 6, 24 + i * 6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  const lbl = useFadeAt(40);
  return (
    <Card title="Japanese Money in Foreign Stocks: the 2026 Reversal" sub="Net monthly flow of Japanese retail money into overseas equity funds"
      takeaway={<span style={{ fontFamily: SANS }}><b style={{ color: '#a855f7' }}>From steady buying to a ~$17B single-month exit</b><span style={{ color: '#8892a4' }}> — analysts call it deliberate repatriation, not profit-taking</span></span>}
      source="SOURCE: FUTUNN (MAY 2026) — CORROBORATE BEFORE AIR. FEB-APR BARS = ILLUSTRATIVE TAPER. VERIFY AT RENDER.">
      <svg viewBox="0 0 1680 600" width={1580} height={564}>
        <line x1={100} y1={300} x2={1620} y2={300} stroke="#1e2330" strokeWidth={2} />
        <text x={160} y={200} fill="#8892a4" fontFamily={MONO} fontSize={22} textAnchor="end">+ inflow</text>
        <text x={160} y={420} fill="#8892a4" fontFamily={MONO} fontSize={22} textAnchor="end">− outflow</text>
        <GrowBar x={180} yBase={300} w={180} h={140} fill="#00e68a" p={bp(0)} />
        <GrowBar x={440} yBase={300} w={180} h={100} fill="#00e68a" opacity={0.75} p={bp(1)} />
        <GrowBar x={700} yBase={300} w={180} h={60} fill="#00e68a" opacity={0.55} p={bp(2)} />
        <GrowBar x={960} yBase={300} w={180} h={30} fill="#00e68a" opacity={0.4} p={bp(3)} />
        {/* May bar grows DOWNWARD from the zero line */}
        <rect x={1220} y={300} width={180} height={180 * bp(4)} fill="#ff4060" />
        <g opacity={lbl}>
          <text x={392} y={140} fill="#00e68a" fontFamily={MONO} fontSize={22} textAnchor="middle">still buying</text>
          <text x={1310} y={525} fill="#ff4060" fontFamily={MONO} fontSize={28} textAnchor="middle" fontWeight={600}>−$16.98B</text>
        </g>
        {['Jan', 'Feb', 'Mar', 'Apr'].map((q, i) => (
          <text key={q} x={270 + i * 260} y={560} fill="#505a6e" fontFamily={MONO} fontSize={22} textAnchor="middle">{q}</text>
        ))}
        <text x={1310} y={585} fill="#ff4060" fontFamily={MONO} fontSize={22} textAnchor="middle" fontWeight={600}>May 2026</text>
      </svg>
    </Card>
  );
};

const Donut: React.FC<{ slices: { color: string; frac: number; width?: number }[]; label: string; sub: string; p: number }> = ({ slices, label, sub, p }) => {
  const R = 190, C = 2 * Math.PI * R;
  let acc = 0;
  return (
    <svg viewBox="0 0 560 560" width={480} height={480}>
      {slices.map((s, i) => {
        const dash = C * s.frac * p;
        const off = -C * acc;
        acc += s.frac;
        return <circle key={i} cx={280} cy={280} r={R} fill="none" stroke={s.color} strokeWidth={s.width ?? 78} strokeDasharray={`${dash} ${C - dash}`} strokeDashoffset={off} transform="rotate(-90 280 280)" />;
      })}
      <text x={280} y={265} fill="#e8eaf0" fontFamily={SANS} fontWeight={900} fontSize={64} textAnchor="middle">{label}</text>
      <text x={280} y={310} fill="#8892a4" fontFamily={SANS} fontSize={26} textAnchor="middle">{sub}</text>
    </svg>
  );
};

const Legend: React.FC<{ rows: [string, string, string][] }> = ({ rows }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 22, marginLeft: 80 }}>
    {rows.map(([color, name, pct]) => (
      <div key={name} style={{ fontFamily: SANS, fontSize: 26, color: '#e8eaf0', display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ width: 22, height: 22, borderRadius: '50%', background: color, display: 'inline-block' }} />
        {name} <span style={{ fontFamily: MONO, color: '#8892a4', marginLeft: 6 }}>{pct}</span>
      </div>
    ))}
  </div>
);

export const CtC6: React.FC = () => {
  const p = useDraw(4, 34);
  return (
    <Card title="Japan's $1.7T Public Pension Fund: Where the Money Sits" sub="GPIF target allocation — a full quarter of the world's largest pension fund is in foreign stocks"
      takeaway={<span style={{ fontFamily: SANS }}><b style={{ color: '#a855f7' }}>Half the fund sits abroad</b><span style={{ color: '#8892a4' }}> — foreign stocks AND foreign bonds, both exposed if the money starts going home</span></span>}
      source="SOURCE: GPIF (TARGET MIX SINCE APR 2020); FOREIGN-EQUITY SLICE 25.34% Q3 FY2026 (ASIA ASSET MANAGEMENT). VERIFY AT RENDER.">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Donut p={p} label="25.3%" sub="foreign stocks" slices={[
          { color: '#00e68a', frac: 0.25 }, { color: '#a855f7', frac: 0.2534, width: 90 }, { color: '#00c2ff', frac: 0.25 }, { color: '#ffd700', frac: 0.2466 },
        ]} />
        <Legend rows={[['#a855f7', 'Foreign stocks', '25.34%'], ['#ffd700', 'Foreign bonds', '~25%'], ['#00e68a', 'Domestic stocks', '~25%'], ['#00c2ff', 'Domestic bonds', '~25%']]} />
      </div>
    </Card>
  );
};

export const CtDCycle: React.FC = () => {
  const f = useCurrentFrame();
  const stop = (i: number) => interpolate(f, [6 + i * 9, 16 + i * 9], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const stops = [
    { when: 'NOW', what: 'AI expansion begins', note: 'productivity already surging', color: '#00e68a', glow: true },
    { when: 'no Oct low', what: 'crowd buys back in', note: 'green candles, not the dip everyone expects', color: '#00e68a', glow: true },
    { when: '2027', what: 'cycle top', note: 'could run longer', color: '#ffd700', glow: true },
    { when: 'beyond', what: 'multiple new all-time highs?', note: 'if the counterweight holds', color: '#8892a4', glow: false },
  ];
  return (
    <Card title="The Thesis: an AI-Extended Cycle" sub="Mike's working roadmap — a thesis, not a promise"
      takeaway={<span style={{ fontFamily: SANS }}><b style={{ color: '#00e68a' }}>The AI counterweight</b><span style={{ color: '#8892a4' }}> could push the top out to 2027 or later — unless it fails to take effect. "But we shall see."</span></span>}
      source={'MIKE’S OWN MARKET THESIS (AS SPOKEN IN CH6) — LABELS ONLY, NO DATA CLAIMS. HEDGED IN THE TAKE: "COULD BE", "MAYBE", "WE SHALL SEE".'}>
      <div style={{ display: 'flex', alignItems: 'center', width: 1580 }}>
        {stops.map((s, i) => (
          <React.Fragment key={s.when}>
            {i > 0 && <div style={{ height: 5, flex: 1, background: stop(i) > 0.5 ? 'linear-gradient(90deg,#00e68a,#ffd700)' : '#1e2330', marginBottom: 90 }} />}
            <div style={{ textAlign: 'center', width: 320, opacity: stop(i) }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: s.color, margin: '0 auto 24px', boxShadow: s.glow ? `0 0 40px ${s.color}` : 'none' }} />
              <div style={{ fontFamily: MONO, fontSize: 26, color: '#8892a4' }}>{s.when}</div>
              <div style={{ fontFamily: SANS, fontSize: 28, fontWeight: 700, marginTop: 10, color: s.color === '#8892a4' ? '#e8eaf0' : s.color }}>{s.what}</div>
              <div style={{ fontFamily: SANS, fontSize: 22, color: '#505a6e', marginTop: 8 }}>{s.note}</div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </Card>
  );
};

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';

// Portrait (1080x1920) versions of the Clarity charts: same data + count-up animation, restacked tall.
const ease = Easing.out(Easing.cubic);
const GREEN = '#00e68a', CYAN = '#00c2ff', GOLD = '#ffd700', RED = '#ff4060', MUTE = '#8892a4', TP = '#e8eaf0', PANEL = '#12151c', BG = '#0a0c10';
const MONO = "'JetBrains Mono','Consolas',monospace";
const SERIF = "'Playfair Display','Georgia',serif";

const Frame: React.FC<{ w: number; h: number; children: React.ReactNode }> = ({ w, h, children }) => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, 9], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fit = Math.min(1000 / w, 1760 / h);
  return (
    <AbsoluteFill style={{ background: BG, justifyContent: 'center', alignItems: 'center' }}>
      <svg width={Math.round(w * fit)} height={Math.round(h * fit)} viewBox={`0 0 ${w} ${h}`} style={{ opacity: op, fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>{children}</svg>
    </AbsoluteFill>
  );
};

// C1 — 10/20/30-yr yields, horizontal bars stacked tall, 5% line
export const ChartC1: React.FC = () => {
  const f = useCurrentFrame();
  const rows = [
    { lab: '30-year', y: 430, w: 780, val: 5.0, pre: '> ', col: RED },
    { lab: '20-year', y: 720, w: 770, val: 5.0, pre: '> ', col: GOLD },
    { lab: '10-year', y: 1010, w: 660, val: 4.56, pre: '', col: CYAN },
  ];
  return (
    <Frame w={1000} h={1560}>
      <text x="60" y="120" fill={TP} fontSize="70" fontWeight="800" fontFamily={SERIF}>Long-Term Yields</text>
      <text x="60" y="200" fill={TP} fontSize="70" fontWeight="800" fontFamily={SERIF}>Near Decade Highs</text>
      <text x="60" y="262" fill={MUTE} fontSize="30">US Treasury par yields, 2026</text>
      {rows.map((r, i) => {
        const p = interpolate(f, [12 + i * 9, 46 + i * 9], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
        return (
          <g key={i}>
            <text x="60" y={r.y - 20} fill={TP} fontSize="44" fontWeight="700">{r.lab}</text>
            <rect x="60" y={r.y} width="880" height="118" rx="14" fill={PANEL} />
            <rect x="60" y={r.y} width={Math.max(2, r.w * p)} height="118" rx="14" fill={r.col} />
            <text x={60 + r.w * p - 34} y={r.y + 78} textAnchor="end" fill="#0a0c10" fontSize="52" fontWeight="800" fontFamily={MONO} style={{ opacity: p }}>{r.pre}{(r.val * p).toFixed(r.val === 5 ? 1 : 2)}%</text>
          </g>
        );
      })}
      <line x1="805" y1="390" x2="805" y2="1170" stroke={RED} strokeWidth="4" strokeDasharray="10 10" />
      <text x="815" y="382" fill={RED} fontSize="30" fontFamily={MONO} fontWeight="700">5%</text>
      <text x="60" y="1360" fill={TP} fontSize="46" fontWeight="800">The government needs the</text>
      <text x="60" y="1420" fill={TP} fontSize="46" fontWeight="800">world to keep buying its debt,</text>
      <text x="60" y="1480" fill={RED} fontSize="46" fontWeight="800">and real demand is thin.</text>
    </Frame>
  );
};

// C2 — stablecoin reserves columns grow up + projected $2-3T
export const ChartC2: React.FC = () => {
  const f = useCurrentFrame();
  const cols = [
    { yr: '2020', h: 70, lab: '$28B', proj: false }, { yr: '2022', h: 330, lab: '$150B', proj: false },
    { yr: '2024', h: 410, lab: '$180B', proj: false }, { yr: '2026', h: 560, lab: '$250B+', proj: false },
    { yr: 'PROJ.', h: 900, lab: '$2-3T', proj: true },
  ];
  const x0 = 90, gap = 178, base = 1180, bw = 120;
  return (
    <Frame w={1000} h={1560}>
      <text x="60" y="120" fill={TP} fontSize="66" fontWeight="800" fontFamily={SERIF}>Reserves Climbing</text>
      <text x="60" y="196" fill={TP} fontSize="66" fontWeight="800" fontFamily={SERIF}>Into US Debt</text>
      <line x1="70" y1={base} x2="960" y2={base} stroke="#1e2330" strokeWidth="2" />
      {cols.map((c, i) => {
        const p = interpolate(f, [14 + i * 8, 44 + i * 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
        const hh = c.h * p; const x = x0 + i * gap;
        return (
          <g key={i}>
            <rect x={x} y={base - hh} width={bw} height={hh} rx="10" fill={c.proj ? GREEN : CYAN} style={{ filter: c.proj ? 'drop-shadow(0 0 34px rgba(0,230,138,0.55))' : 'none' }} />
            <text x={x + bw / 2} y={base - hh - 24} textAnchor="middle" fill={c.proj ? GREEN : MUTE} fontSize={c.proj ? 46 : 34} fontWeight="700" fontFamily={MONO} style={{ opacity: p }}>{c.lab}</text>
            <text x={x + bw / 2} y={base + 52} textAnchor="middle" fill={c.proj ? GREEN : MUTE} fontSize="32" fontWeight="700" fontFamily={MONO}>{c.yr}</text>
          </g>
        );
      })}
      <text x="60" y="1380" fill={TP} fontSize="46" fontWeight="800">A fresh, captive lender,</text>
      <text x="60" y="1440" fill={TP} fontSize="46" fontWeight="800">worth <tspan fill={GREEN}>trillions</tspan> in new</text>
      <text x="60" y="1500" fill={TP} fontSize="46" fontWeight="800">Treasury demand.</text>
    </Frame>
  );
};

// C3 — bank vs Coinbase APY bars grow + count-up
export const ChartC3: React.FC = () => {
  const f = useCurrentFrame();
  const rows = [
    { lab: 'Traditional bank', sub: 'savings APY', y: 470, w: 120, val: 0.4, col: MUTE, inside: false },
    { lab: 'Coinbase USDC', sub: '"loyalty reward"', y: 800, w: 820, val: 3.5, col: GREEN, inside: true },
  ];
  return (
    <Frame w={1000} h={1440}>
      <text x="60" y="120" fill={TP} fontSize="70" fontWeight="800" fontFamily={SERIF}>Why the Loophole</text>
      <text x="60" y="200" fill={TP} fontSize="70" fontWeight="800" fontFamily={SERIF}>Is Irresistible</text>
      <text x="60" y="262" fill={MUTE} fontSize="30">What you're paid to hold dollars</text>
      {rows.map((r, i) => {
        const p = interpolate(f, [14 + i * 12, 48 + i * 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
        return (
          <g key={i}>
            <text x="60" y={r.y - 66} fill={TP} fontSize="46" fontWeight="700">{r.lab}</text>
            <text x="60" y={r.y - 22} fill={MUTE} fontSize="30" fontFamily={MONO}>{r.sub}</text>
            <rect x="60" y={r.y} width={Math.max(2, r.w * p)} height="130" rx="16" fill={r.col} />
            <text x={r.inside ? 60 + r.w * p - 34 : 60 + r.w * p + 30} y={r.y + 88} textAnchor={r.inside ? 'end' : 'start'} fill={r.inside ? '#0a0c10' : MUTE} fontSize="56" fontWeight="800" fontFamily={MONO} style={{ opacity: p }}>~{(r.val * p).toFixed(1)}%</text>
          </g>
        );
      })}
      <text x="60" y="1230" fill={TP} fontSize="46" fontWeight="800">Nearly 9x the bank. Worth</text>
      <text x="60" y="1290" fill={GOLD} fontSize="46" fontWeight="800">~$1.35 billion a year</text>
      <text x="60" y="1350" fill={TP} fontSize="46" fontWeight="800">to Coinbase alone.</text>
    </Frame>
  );
};

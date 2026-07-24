import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';

const ease = Easing.out(Easing.cubic);
const GREEN = '#00e68a', CYAN = '#00c2ff', GOLD = '#ffd700', RED = '#ff4060', MUTE = '#8892a4', TP = '#e8eaf0', PANEL = '#12151c', BG = '#0a0c10';
const MONO = "'JetBrains Mono','Consolas',monospace";
const SERIF = "'Playfair Display','Georgia',serif";

const Frame: React.FC<{ w: number; h: number; children: React.ReactNode }> = ({ w, h, children }) => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, 9], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fit = Math.min(1780 / w, 980 / h);
  return (
    <AbsoluteFill style={{ background: BG, justifyContent: 'center', alignItems: 'center' }}>
      <svg width={Math.round(w * fit)} height={Math.round(h * fit)} viewBox={`0 0 ${w} ${h}`} style={{ opacity: op, fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>{children}</svg>
    </AbsoluteFill>
  );
};

// C1 — 10/20/30-yr yields, horizontal bars grow, 5% line
export const ChartC1: React.FC = () => {
  const f = useCurrentFrame();
  const rows = [
    { lab: '30-year', y: 300, w: 1200, val: 5.0, pre: '> ', col: RED },
    { lab: '20-year', y: 470, w: 1185, val: 5.0, pre: '> ', col: GOLD },
    { lab: '10-year', y: 640, w: 1000, val: 4.56, pre: '', col: CYAN },
  ];
  return (
    <Frame w={1600} h={920}>
      <text x="60" y="120" fill={TP} fontSize="60" fontWeight="800" fontFamily={SERIF}>Long-Term Yields Near Multi-Decade Highs</text>
      <text x="60" y="172" fill={MUTE} fontSize="28">US Treasury par yields, 2026</text>
      {rows.map((r, i) => {
        const p = interpolate(f, [10 + i * 8, 40 + i * 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
        return (
          <g key={i}>
            <text x="60" y={r.y + 58} fill={TP} fontSize="40" fontWeight="700">{r.lab}</text>
            <rect x="340" y={r.y} width="1210" height="88" rx="12" fill={PANEL} />
            <rect x="340" y={r.y} width={Math.max(1, r.w * p)} height="88" rx="12" fill={r.col} />
            <text x={340 + r.w * p - 30} y={r.y + 58} textAnchor="end" fill="#0a0c10" fontSize="42" fontWeight="800" fontFamily={MONO} style={{ opacity: p }}>{r.pre}{(r.val * p).toFixed(r.val === 5 ? 1 : 2)}%</text>
          </g>
        );
      })}
      <line x1="1290" y1="270" x2="1290" y2="740" stroke={RED} strokeWidth="3" strokeDasharray="8 8" />
      <text x="1300" y="262" fill={RED} fontSize="26" fontFamily={MONO} fontWeight="700">5% line</text>
      <text x="60" y="860" fill={TP} fontSize="36" fontWeight="800">It needs the world to keep buying its debt, and <tspan fill={RED}>real demand is thin.</tspan></text>
    </Frame>
  );
};

// C2 — stablecoin reserves columns grow up + projected $2-3T
export const ChartC2: React.FC = () => {
  const f = useCurrentFrame();
  const cols = [
    { yr: '2020', h: 40, lab: '$28B', proj: false }, { yr: '2022', h: 210, lab: '$150B', proj: false },
    { yr: '2024', h: 270, lab: '$180B', proj: false }, { yr: '2026', h: 380, lab: '$250B+', proj: false },
    { yr: 'PROJ.', h: 640, lab: '$2–3T', proj: true },
  ];
  const x0 = 200, gap = 270, base = 780, bw = 150;
  return (
    <Frame w={1600} h={920}>
      <text x="60" y="110" fill={TP} fontSize="56" fontWeight="800" fontFamily={SERIF}>Stablecoin Reserves Are Climbing Into US Debt</text>
      <line x1="120" y1={base} x2="1520" y2={base} stroke="#1e2330" strokeWidth="2" />
      {cols.map((c, i) => {
        const p = interpolate(f, [12 + i * 7, 40 + i * 7], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
        const hh = c.h * p; const x = x0 + i * gap;
        return (
          <g key={i}>
            <rect x={x} y={base - hh} width={bw} height={hh} rx="10" fill={c.proj ? GREEN : CYAN} style={{ filter: c.proj ? 'drop-shadow(0 0 30px rgba(0,230,138,0.5))' : 'none' }} />
            <text x={x + bw / 2} y={base - hh - 22} textAnchor="middle" fill={c.proj ? GREEN : MUTE} fontSize={c.proj ? 46 : 34} fontWeight="700" fontFamily={MONO} style={{ opacity: p }}>{c.lab}</text>
            <text x={x + bw / 2} y={base + 46} textAnchor="middle" fill={c.proj ? GREEN : MUTE} fontSize="30" fontWeight="700" fontFamily={MONO}>{c.yr}</text>
          </g>
        );
      })}
      <text x="60" y="880" fill={TP} fontSize="38" fontWeight="800">A fresh, captive lender, worth <tspan fill={GREEN}>trillions</tspan> in new Treasury demand.</text>
    </Frame>
  );
};

// C3 — bank vs Coinbase APY bars grow + count-up
export const ChartC3: React.FC = () => {
  const f = useCurrentFrame();
  const rows = [
    { lab: 'Traditional bank', sub: 'savings APY', y: 300, w: 150, val: 0.4, col: MUTE, inside: false },
    { lab: 'Coinbase USDC', sub: '"loyalty reward"', y: 500, w: 1180, val: 3.5, col: GREEN, inside: true },
  ];
  return (
    <Frame w={1600} h={860}>
      <text x="60" y="120" fill={TP} fontSize="60" fontWeight="800" fontFamily={SERIF}>Why the Loophole Is Irresistible</text>
      <text x="60" y="172" fill={MUTE} fontSize="28">What you're paid to hold dollars</text>
      {rows.map((r, i) => {
        const p = interpolate(f, [12 + i * 10, 44 + i * 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
        return (
          <g key={i}>
            <text x="60" y={r.y + 50} fill={TP} fontSize="38" fontWeight="700">{r.lab}</text>
            <text x="60" y={r.y + 90} fill={MUTE} fontSize="26" fontFamily={MONO}>{r.sub}</text>
            <rect x="440" y={r.y} width={Math.max(2, r.w * p)} height="96" rx="12" fill={r.col} />
            <text x={r.inside ? 440 + r.w * p - 30 : 440 + r.w * p + 26} y={r.y + 62} textAnchor={r.inside ? 'end' : 'start'} fill={r.inside ? '#0a0c10' : MUTE} fontSize="44" fontWeight="800" fontFamily={MONO} style={{ opacity: p }}>~{(r.val * p).toFixed(1)}%</text>
          </g>
        );
      })}
      <text x="60" y="800" fill={TP} fontSize="38" fontWeight="800">Nearly 9x the bank. The loophole is worth <tspan fill={GOLD}>~$1.35 billion a year</tspan> to Coinbase alone.</text>
    </Frame>
  );
};

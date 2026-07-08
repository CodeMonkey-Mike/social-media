import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, Easing } from 'remotion';
import { C3_BARS, C5_SHARE, C5_PRICE } from './smChartsAnimData';

const TEAL = '#49EACB';
const GREEN = '#2f9e8c';
const GOLD = '#f5c451';
const MUTE = '#7e9897';
const PANEL = '#0f181b';
const ease = Easing.out(Easing.cubic);

// scaled SVG frame on the dark bg; whole chart fades in, data animates inside
const Frame: React.FC<{ w: number; h: number; children: React.ReactNode }> = ({ w, h, children }) => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, 9], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fit = Math.min(1920 / w, 1080 / h);
  return (
    <AbsoluteFill style={{ background: '#0a1012', justifyContent: 'center', alignItems: 'center' }}>
      <svg width={Math.round(w * fit)} height={Math.round(h * fit)} viewBox={`0 0 ${w} ${h}`} style={{ opacity: op, fontFamily: "'Segoe UI',Arial,Helvetica,sans-serif" }}>
        {children}
      </svg>
    </AbsoluteFill>
  );
};

// ---------- C13: whale accumulation, horizontal bars grow + values count up ----------
const C13 = [
  { label: 'Entity X', y: 200, w: 900, color: TEAL, val: 661.6, usd: '$19.1M', vx: 1348, sub: '' },
  { label: 'Whale 2ls8zs', y: 286, w: 702.7, color: GREEN, val: 516.6, usd: '$14.9M', vx: 1150.7, sub: '' },
  { label: 'Whale t3xdgw', y: 372, w: 611.2, color: GREEN, val: 449.3, usd: '$13.0M', vx: 1059.2, sub: '' },
  { label: 'Whale p0hdys', y: 458, w: 587.4, color: GREEN, val: 431.8, usd: '$12.5M', vx: 1035.4, sub: '' },
  { label: 'Whale ppp6ln', y: 544, w: 293.2, color: GREEN, val: 215.5, usd: '$6.2M', vx: 741.2, sub: '' },
  { label: 'Whale 850jvl', y: 630, w: 163.8, color: GOLD, val: 120.4, usd: '$3.5M', vx: 611.8, sub: 'the wallet buying every single day' },
  { label: 'Whale 8n9q9q', y: 716, w: 113.5, color: GREEN, val: 83.4, usd: '$2.4M', vx: 561.5, sub: '' },
];
export const ChartC13: React.FC = () => {
  const f = useCurrentFrame();
  const total = interpolate(f, [70, 100], [0, 2.42], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  return (
    <Frame w={1600} h={980}>
      <rect x="40" y="40" width="1520" height="900" rx="22" fill={PANEL} />
      <text x="80" y="115" fill="#fff" fontSize="52" fontWeight="800">Smart Money Is Loading Up</text>
      <text x="80" y="162" fill={MUTE} fontSize="27">KAS accumulated by the biggest individual wallets over the past year (on-chain)</text>
      {C13.map((b, i) => {
        const s = 6 + i * 5;
        const p = interpolate(f, [s, s + 28], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
        return (
          <g key={i}>
            <text x="410" y={b.y + 31} textAnchor="end" fill="#fff" fontSize="30" fontWeight="600">{b.label}</text>
            <rect x="430" y={b.y} width={Math.max(0.1, b.w * p)} height="44" rx="6" fill={b.color} />
            <text x={b.vx} y={b.y + 31} fill="#fff" fontSize="29" fontWeight="700" style={{ opacity: p }}>
              +{(b.val * p).toFixed(1)}M <tspan fill={MUTE} fontWeight="400">({b.usd})</tspan>
            </text>
            {b.sub ? <text x={b.vx} y={b.y + 60} fill={GOLD} fontSize="20" style={{ opacity: interpolate(f, [s + 20, s + 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>{b.sub}</text> : null}
          </g>
        );
      })}
      <line x1="80" y1="812" x2="1520" y2="812" stroke="#1c2a2c" />
      <text x="80" y="885" fill={TEAL} fontSize="40" fontWeight="800">+{total.toFixed(2)}B KAS <tspan fill="#fff">added in one year</tspan> <tspan fill={MUTE} fontSize="30" fontWeight="500">(~$69.7M, 11 of 14 wallets grew)</tspan></text>
      <text x="80" y="925" fill={MUTE} fontSize="22">Source: on-chain, api.kaspa.org. Exchange-custody wallets excluded. June 2026.</text>
    </Frame>
  );
};

// ---------- C3: daily-buy cadence, vertical bars grow up from baseline 600 ----------
const C3_GRID = [[492.5, '1.4M'], [385, '2.9M'], [277.5, '4.3M'], [170, '5.7M']] as [number, string][];
const C3_XLAB = [[194.7, 'Apr'], [668, 'May'], [1157.1, 'Jun']] as [number, string][];
export const ChartC3: React.FC = () => {
  const f = useCurrentFrame();
  const n = C3_BARS.length;
  return (
    <Frame w={1600} h={760}>
      <rect x="40" y="40" width="1520" height="680" rx="22" fill={PANEL} />
      <text x="80" y="110" fill="#fff" fontSize="50" fontWeight="800">Buying Every Single Day</text>
      <text x="80" y="150" fill={MUTE} fontSize="26">KAS accumulated per day by one wallet, last 90 days (on-chain)</text>
      {C3_GRID.map(([gy, lab], i) => (<g key={i}><line x1="100" y1={gy} x2="1520" y2={gy} stroke="#1c2a2c" /><text x="86" y={gy + 7} fill={MUTE} fontSize="20" textAnchor="end">{lab}</text></g>))}
      {C3_BARS.map(([x, y, h], i) => {
        const s = 6 + (i / n) * 34;
        const p = interpolate(f, [s, s + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
        const hh = h * p;
        return <rect key={i} x={x} y={600 - hh} width="13.8" height={hh} rx="2" fill={TEAL} />;
      })}
      {C3_XLAB.map(([x, lab], i) => (<text key={i} x={x} y="634" fill={MUTE} fontSize="22" textAnchor="middle">{lab}</text>))}
      <line x1="100" y1="600" x2="1520" y2="600" stroke={MUTE} />
      <text x="80" y="690" fill={TEAL} fontSize="32" fontWeight="800">358 buys across 84 of the last 90 days <tspan fill={MUTE} fontSize="24" fontWeight="500">and still climbing</tspan></text>
      <text x="80" y="722" fill={MUTE} fontSize="21">Wallet ...td850jvl. Source: on-chain, api.kaspa.org. June 2026.</text>
    </Frame>
  );
};

// ---------- C5: top-0.01% share, line draws on (stroke-dashoffset) + area + price + count-up ----------
const C5_GRID = [[200, '40%'], [318.18, '35%'], [436.36, '30%'], [554.55, '25%'], [672.73, '20%']] as [number, string][];
const C5_XLAB = [[150, 'Aug 2023'], [292, '2024'], [760, '2025'], [1228, '2026']] as [number, string][];
const sharePts = C5_SHARE.map((p) => p.join(',')).join(' ');
const pricePts = C5_PRICE.map((p) => p.join(',')).join(' ');
const areaPts = sharePts + ` ${C5_SHARE[C5_SHARE.length - 1][0]},720 ${C5_SHARE[0][0]},720`;
export const ChartC5: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [10, 70], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  const revealW = 130 + 1320 * p;
  const endVal = 24.4 + (38.4 - 24.4) * p;
  const endX = C5_SHARE[C5_SHARE.length - 1][0];
  const endY = C5_SHARE[C5_SHARE.length - 1][1];
  return (
    <Frame w={1600} h={920}>
      <rect x="40" y="40" width="1520" height="840" rx="22" fill={PANEL} />
      <defs>
        <linearGradient id="c5area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={TEAL} stopOpacity="0.35" />
          <stop offset="1" stopColor={TEAL} stopOpacity="0" />
        </linearGradient>
        <clipPath id="c5rev"><rect x="0" y="0" width={revealW} height="920" /></clipPath>
      </defs>
      <text x="80" y="112" fill="#fff" fontSize="50" fontWeight="800">The Strongest Hands Keep Taking More</text>
      <text x="80" y="158" fill={MUTE} fontSize="26">Share of all KAS supply held by the top 0.01% of wallets (on-chain, Kaspalytics)</text>
      {C5_GRID.map(([gy, lab], i) => (<g key={i}><line x1="130" y1={gy} x2="1450" y2={gy} stroke="#1c2a2c" /><text x="114" y={gy + 6} fill={MUTE} fontSize="22" textAnchor="end">{lab}</text></g>))}
      {C5_XLAB.map(([x, lab], i) => (<text key={i} x={x} y="754" fill={MUTE} fontSize="22" textAnchor="middle">{lab}</text>))}
      <g clipPath="url(#c5rev)">
        <polygon points={areaPts} fill="url(#c5area)" />
        <polyline points={pricePts} fill="none" stroke={MUTE} strokeWidth="2.5" opacity="0.7" />
        <polyline points={sharePts} fill="none" stroke={TEAL} strokeWidth="4" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      </g>
      <circle cx="130" cy={C5_SHARE[0][1]} r="7" fill="#fff" style={{ opacity: interpolate(f, [10, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }} />
      <text x="144" y="555" fill="#fff" fontSize="26" fontWeight="700" style={{ opacity: interpolate(f, [12, 24], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>24.4%</text>
      <circle cx={endX} cy={endY} r="9" fill={TEAL} style={{ opacity: interpolate(f, [64, 74], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }} />
      <text x="1438" y="220" fill={TEAL} fontSize="30" fontWeight="800" textAnchor="end">{endVal.toFixed(1)}%</text>
      <text x="80" y="828" fill={TEAL} fontSize="38" fontWeight="800">From 24% to 38% of all supply <tspan fill="#fff" fontSize="28" fontWeight="500">in under three years</tspan> <tspan fill={MUTE} fontSize="24" fontWeight="400">while the price went nowhere</tspan></text>
      <text x="80" y="862" fill={MUTE} fontSize="20">Source: on-chain, kaspalytics.com (top 0.01% of meaningful addresses, % of circulating supply). Jun 2026.</text>
    </Frame>
  );
};

// preview comp for validating the 3 animated charts
export const SMCA_FPS = 30;
export const SMCA_FRAMES = 450;
export const SmChartsAnimPreview: React.FC = () => (
  <AbsoluteFill style={{ background: '#0a1012' }}>
    <Sequence from={0} durationInFrames={150}><ChartC13 /></Sequence>
    <Sequence from={150} durationInFrames={150}><ChartC3 /></Sequence>
    <Sequence from={300} durationInFrames={150}><ChartC5 /></Sequence>
  </AbsoluteFill>
);

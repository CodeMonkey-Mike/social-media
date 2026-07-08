import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';

const TEAL = '#49EACB', RED = '#e2675f', MUTE = '#7e9897', PANEL = '#0f181b';
const ease = Easing.out(Easing.cubic);

const Frame: React.FC<{ w: number; h: number; children: React.ReactNode }> = ({ w, h, children }) => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, 9], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fit = Math.min(1920 / w, 1080 / h);
  return (
    <AbsoluteFill style={{ background: '#0a1012', justifyContent: 'center', alignItems: 'center' }}>
      <svg width={Math.round(w * fit)} height={Math.round(h * fit)} viewBox={`0 0 ${w} ${h}`} style={{ opacity: op, fontFamily: "'Segoe UI',Arial,Helvetica,sans-serif" }}>{children}</svg>
    </AbsoluteFill>
  );
};
const cu = (f: number, a: number, b: number, target: number) =>
  target * interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });

// C6 Maximum Pain: split bar fills left->right, 13.5% / 86.5% count up
export const ChartC6: React.FC = () => {
  const f = useCurrentFrame();
  const rev = interpolate(f, [8, 50], [0, 1440], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  return (
    <Frame w={1600} h={720}>
      <rect x="40" y="40" width="1520" height="640" rx="22" fill={PANEL} />
      <text x="80" y="120" fill="#fff" fontSize="52" fontWeight="800">Maximum Pain</text>
      <text x="80" y="166" fill={MUTE} fontSize="26">Share of all KAS supply in profit vs at a loss (on-chain, Kaspalytics)</text>
      <defs><clipPath id="c6rev"><rect x="80" y="280" width={rev} height="160" /></clipPath></defs>
      <g clipPath="url(#c6rev)">
        <rect x="80" y="300" width="194.832" height="120" rx="8" fill={TEAL} />
        <rect x="274.832" y="300" width="1245.168" height="120" rx="8" fill={RED} fillOpacity="0.85" />
      </g>
      <text x="177.416" y="278" fill={TEAL} fontSize="30" fontWeight="800" textAnchor="middle" style={{ opacity: interpolate(f, [18, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>{cu(f, 8, 40, 13.5).toFixed(1)}%</text>
      <text x="897.416" y="278" fill={RED} fontSize="34" fontWeight="800" textAnchor="middle" style={{ opacity: interpolate(f, [30, 44], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>{cu(f, 8, 48, 86.5).toFixed(1)}%</text>
      <text x="80" y="464" fill={TEAL} fontSize="24" fontWeight="700">IN PROFIT</text>
      <text x="1520" y="464" fill={RED} fontSize="24" fontWeight="700" textAnchor="end">UNDERWATER</text>
      <text x="80" y="630" fill="#fff" fontSize="36" fontWeight="800">Only <tspan fill={TEAL}>13%</tspan> of all Kaspa is in profit. <tspan fill={RED}>86%</tspan> is underwater.</text>
      <text x="80" y="668" fill={MUTE} fontSize="23">The exact moment tired retail capitulates, and smart money buys. Source: kaspalytics.com, Jun 2026.</text>
    </Frame>
  );
};

// C10 New Supply Is Vanishing: 6 bars grow up from baseline 610, % count up
const C10 = [
  { x: 169.6, h: 400, pct: 2.20, yr: '2026', cx: 240 }, { x: 389.6, h: 200, pct: 1.10, yr: '2027', cx: 460 },
  { x: 609.6, h: 100, pct: 0.55, yr: '2028', cx: 680 }, { x: 829.6, h: 49.09, pct: 0.27, yr: '2029', cx: 900 },
  { x: 1049.6, h: 25.45, pct: 0.14, yr: '2030', cx: 1120 }, { x: 1269.6, h: 12.73, pct: 0.07, yr: '2031', cx: 1340 },
];
export const ChartC10: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Frame w={1600} h={780}>
      <rect x="40" y="40" width="1520" height="700" rx="22" fill={PANEL} />
      <text x="80" y="120" fill="#fff" fontSize="50" fontWeight="800">New Supply Is Vanishing</text>
      <text x="80" y="164" fill={MUTE} fontSize="26">Kaspa annual inflation rate by year, the smooth "chromatic" halving</text>
      {C10.map((b, i) => {
        const s = 8 + i * 5;
        const p = interpolate(f, [s, s + 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
        const hh = b.h * p;
        return (
          <g key={i}>
            <rect x={b.x} y={610 - hh} width="140.8" height={hh} rx="6" fill={TEAL} />
            <text x={b.cx} y={610 - hh - 14} fill="#fff" fontSize="26" fontWeight="700" textAnchor="middle" style={{ opacity: p }}>{(b.pct * p).toFixed(2)}%</text>
            <text x={b.cx} y="648" fill={MUTE} fontSize="24" textAnchor="middle">{b.yr}</text>
          </g>
        );
      })}
      <text x="80" y="694" fill={TEAL} fontSize="34" fontWeight="800">~95.8% of all KAS that will ever exist is already mined</text>
      <text x="80" y="730" fill={MUTE} fontSize="22">Issuance halves toward zero every year. Source: kaspa.org / kaspalytics.com, Jun 2026.</text>
    </Frame>
  );
};

// C11 Room To Run: 2 horizontal bars grow from left, $ count up
export const ChartC11: React.FC = () => {
  const f = useCurrentFrame();
  const p1 = interpolate(f, [8, 34], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  const p2 = interpolate(f, [20, 56], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  return (
    <Frame w={1600} h={620}>
      <rect x="40" y="40" width="1520" height="540" rx="22" fill={PANEL} />
      <text x="80" y="120" fill="#fff" fontSize="50" fontWeight="800">Room To Run</text>
      <text x="80" y="162" fill={MUTE} fontSize="26">Kaspa market cap today vs its previous all-time high</text>
      <text x="400" y="274" fill="#fff" fontSize="28" fontWeight="600" textAnchor="end">Today</text>
      <rect x="420" y="240" width={Math.max(0.1, 144 * p1)} height="56" rx="8" fill={TEAL} />
      <text x="580" y="278" fill="#fff" fontSize="30" fontWeight="800" style={{ opacity: p1 }}>${cu(f, 8, 34, 0.8).toFixed(1)}B</text>
      <text x="400" y="394" fill="#fff" fontSize="28" fontWeight="600" textAnchor="end">Previous all-time high</text>
      <rect x="420" y="360" width={Math.max(0.1, 900 * p2)} height="56" rx="8" fill={MUTE} />
      <text x="1336" y="398" fill="#fff" fontSize="30" fontWeight="800" textAnchor="end" style={{ opacity: p2 }}>${cu(f, 20, 56, 5.0).toFixed(1)}B</text>
      <text x="80" y="542" fill={TEAL} fontSize="32" fontWeight="800">Under $1B today, against a $5B prior peak</text>
      <text x="80" y="576" fill={MUTE} fontSize="22">A return to the old top would be a 6x from here. Asymmetry, not a promise. Source: market data, Jun 2026.</text>
    </Frame>
  );
};

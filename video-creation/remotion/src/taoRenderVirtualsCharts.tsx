import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadDMSans } from '@remotion/google-fonts/DMSans';
import { loadFont as loadJBMono } from '@remotion/google-fonts/JetBrainsMono';

// ============================================================================
// tao-render-virtuals — LIVE animated charts C1 + C2 (charts.md / comp-build §7:
// a chart is a useCurrentFrame component, NEVER a static PNG — even in the draft).
// Design system = the container-canonical palette/typo (matches the deck PNGs).
// Sources: DATA.md chart-source index; layouts ported from the approved
// assets/charts/*.html comps (same geometry, now drawn over time).
// ============================================================================

const { fontFamily: PLAYFAIR } = loadPlayfair();
const { fontFamily: DMSANS } = loadDMSans();
const { fontFamily: MONO } = loadJBMono();
export const FONTS = { PLAYFAIR, DMSANS, MONO };

const BG = '#0a0c10', GREEN = '#00e68a', CYAN = '#00c2ff', GOLD = '#ffd700';
const TXT = '#e8eaf0', SEC = '#8892a4', MUT = '#505a6e', GRID = '#1e2330';

const Orb: React.FC<{ size: number; color: string; style: React.CSSProperties }> = ({ size, color, style }) => (
  <div style={{ position: 'absolute', width: size, height: size, borderRadius: '50%', background: color, filter: 'blur(120px)', opacity: 0.32, pointerEvents: 'none', ...style }} />
);

/** Draw-on helper: SVG props revealing a stroked path start-to-end via pathLength dashing. */
const drawn = (p: number) => ({ pathLength: 1, strokeDasharray: 1, strokeDashoffset: Math.max(0, 1 - p) } as const);

// ---------------------------------------------------------------------------
// C1 — TAO emission / halving step chart (window ~143.5 → 169.7, 26s)
// ---------------------------------------------------------------------------
export const ChartC1Emission: React.FC = () => {
  const f = useCurrentFrame();
  const head = interpolate(f, [0, 14], [0, 1], { extrapolateRight: 'clamp' });
  // step line draws across ~3.6s after the header lands
  const line = interpolate(f, [16, 124], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // halving marker pops when the line passes x=820 (~52% of the solid path length)
  const markerP = interpolate(f, [72, 84], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const dash = interpolate(f, [124, 160], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const chip = (i: number) => interpolate(f, [150 + i * 12, 162 + i * 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const pop = markerP < 1 ? 0.6 + 0.4 * markerP : 1 + 0.15 * Math.exp(-(f - 84) / 6);
  return (
    <AbsoluteFill style={{ background: BG, overflow: 'hidden' }}>
      <Orb size={640} color={GREEN} style={{ top: -220, right: -160, opacity: 0.35 * head }} />
      <Orb size={520} color={CYAN} style={{ bottom: -240, left: -140, opacity: 0.35 * head }} />
      <div style={{ position: 'absolute', inset: 0, padding: '76px 110px', display: 'flex', flexDirection: 'column', opacity: head }}>
        <span style={{ fontFamily: DMSANS, fontSize: 16, textTransform: 'uppercase', letterSpacing: '.22em', color: MUT, fontWeight: 600, marginBottom: 14 }}>TAO · EMISSION SCHEDULE</span>
        <h1 style={{ fontFamily: PLAYFAIR, fontWeight: 900, fontSize: 70, lineHeight: 1.02, letterSpacing: '-.02em', color: TXT, margin: 0 }}>
          The halving <span style={{ color: GREEN }}>already happened.</span>
        </h1>
        <div style={{ width: 70 * head, height: 3, borderRadius: 2, background: `linear-gradient(90deg,${GREEN},${CYAN})`, margin: '22px 0 8px' }} />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 6 }}>
          <svg width={1660} height={560} viewBox="0 0 1660 560">
            <defs>
              <linearGradient id="c1fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={GREEN} stopOpacity={0.28} /><stop offset="1" stopColor={GREEN} stopOpacity={0} />
              </linearGradient>
              {/* area reveal follows the drawing line head */}
              <clipPath id="c1reveal"><rect x={150} y={0} width={line * 1410} height={560} /></clipPath>
            </defs>
            <g stroke={GRID} strokeWidth={1} opacity={head}>
              <line x1={150} y1={90} x2={1560} y2={90} /><line x1={150} y1={270} x2={1560} y2={270} />
              <line x1={150} y1={360} x2={1560} y2={360} /><line x1={150} y1={450} x2={1560} y2={450} />
            </g>
            <g fontFamily={MONO} fontWeight={600} fontSize={26} fill={SEC} textAnchor="end" opacity={head}>
              <text x={132} y={98}>7,200</text><text x={132} y={278}>3,600</text><text x={132} y={368}>1,800</text>
            </g>
            <text x={150} y={62} fontFamily={MONO} fontSize={20} fill={MUT} opacity={head}>TAO EMITTED / DAY</text>
            <g clipPath="url(#c1reveal)">
              <path d="M150,90 H820 V270 H1300 V450 H150 Z" fill="url(#c1fill)" />
            </g>
            <path d="M150,90 H820 V270 H1300" fill="none" stroke={GREEN} strokeWidth={5} strokeLinejoin="round" {...drawn(line)} />
            <path d="M1300,270 V360 H1560" fill="none" stroke={GREEN} strokeWidth={4} strokeDasharray="10 10" opacity={0.55 * dash} />
            <g opacity={markerP}>
              <line x1={820} y1={60} x2={820} y2={450} stroke={GOLD} strokeWidth={2} strokeDasharray="6 7" opacity={0.8} />
              <circle cx={820} cy={270} r={9 * Math.min(1.4, pop)} fill={GOLD} />
              <text x={838} y={120} fontFamily={MONO} fontWeight={600} fontSize={27} fill={GOLD}>DEC 12, 2025</text>
              <text x={838} y={152} fontFamily={DMSANS} fontSize={21} fill={TXT}>First halving · reward <tspan fontFamily={MONO} fill={GOLD}>1 → 0.5</tspan> TAO / block</text>
            </g>
            <text x={1315} y={336} fontFamily={DMSANS} fontSize={19} fill={MUT} opacity={dash}>next halving ~4 yrs</text>
            <g fontFamily={MONO} fontSize={22} fill={SEC} opacity={head}>
              <text x={150} y={500}>2021 · LAUNCH</text><text x={770} y={500}>2025</text><text x={1300} y={500} textAnchor="end">~2029</text>
            </g>
          </svg>
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
          {[
            <span key={0}><b style={{ color: TXT, fontFamily: MONO }}>21,000,000</b> hard cap · same as Bitcoin</span>,
            <span key={1}>Halving triggered by <b style={{ color: TXT, fontFamily: MONO }}>SUPPLY (10.5M)</b>, not block number</span>,
            <span key={2}>Fair launch · <b style={{ color: TXT, fontFamily: MONO }}>no VC · no premine · no ICO</b></span>,
          ].map((s, i) => (
            <div key={i} style={{ padding: '12px 22px', borderRadius: 100, background: i === 0 ? 'rgba(255,215,0,.06)' : 'rgba(255,255,255,.03)', border: `1px solid ${i === 0 ? 'rgba(255,215,0,.3)' : GRID}`, fontFamily: DMSANS, fontSize: 16.5, color: SEC, opacity: chip(i), transform: `translateY(${(1 - chip(i)) * 14}px)` }}>{s}</div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// C2 — Metcalfe vs Reed shape contrast (window ~749.5 → 780.8, 31s)
// Staged build: axes → reality (dashed) → Metcalfe n² → Reed 2ⁿ rockets last.
// The "HEURISTIC" disclaimer is PERMANENT from frame 0 (DATA.md hard rule).
// Pure math shapes — no price axis, no fabricated data points.
// ---------------------------------------------------------------------------
const xL = 170, xR = 1540, yB = 520, yT = 70, W = xR - xL, H = yB - yT;
const px = (t: number) => xL + t * W, py = (v: number) => yB - Math.min(1, v) * H;
const pathOf = (fn: (t: number) => number, peak: number) => {
  let d = '';
  for (let i = 0; i <= 120; i++) { const t = i / 120; d += (i ? 'L' : 'M') + px(t).toFixed(1) + ',' + py(fn(t) * peak).toFixed(1) + ' '; }
  return d;
};
const fReality = (t: number) => t * Math.log(1 + 9 * t) / Math.log(10);
const fMetcalfe = (t: number) => t * t;
const fReed = (t: number) => (Math.pow(2, 10 * t) - 1) / (Math.pow(2, 10) - 1);

export const ChartC2MetcalfeReed: React.FC = () => {
  const f = useCurrentFrame();
  const head = interpolate(f, [0, 14], [0, 1], { extrapolateRight: 'clamp' });
  const axes = interpolate(f, [10, 34], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const reality = interpolate(f, [40, 110], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const metcalfe = interpolate(f, [120, 200], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const reed = interpolate(f, [230, 330], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const leg = (p: number) => ({ opacity: p, transform: `translateX(${(1 - p) * -14}px)` });
  const legR = interpolate(f, [96, 110], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const legM = interpolate(f, [186, 200], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const legRe = interpolate(f, [316, 330], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ background: BG, overflow: 'hidden' }}>
      <Orb size={560} color={GOLD} style={{ top: 40, right: 120, opacity: 0.32 * head }} />
      <Orb size={520} color={GREEN} style={{ bottom: -220, left: -120, opacity: 0.32 * head }} />
      {/* PERMANENT disclaimer — visible from frame 0, never animated away */}
      <div style={{ position: 'absolute', top: 76, right: 110, padding: '12px 22px', borderRadius: 100, border: '1px solid rgba(255,215,0,.4)', background: 'rgba(255,215,0,.07)', fontFamily: MONO, fontWeight: 600, fontSize: 17, color: GOLD, letterSpacing: '.04em', zIndex: 2 }}>
        A HEURISTIC, NOT A VALUATION
      </div>
      <div style={{ position: 'absolute', inset: 0, padding: '70px 110px', display: 'flex', flexDirection: 'column', opacity: head }}>
        <span style={{ fontFamily: DMSANS, fontSize: 16, textTransform: 'uppercase', letterSpacing: '.22em', color: MUT, fontWeight: 600, marginBottom: 12 }}>CH6 · Network value laws</span>
        <h1 style={{ fontFamily: PLAYFAIR, fontWeight: 900, fontSize: 64, lineHeight: 1.03, letterSpacing: '-.02em', color: TXT, margin: 0 }}>
          Breadth <span style={{ color: GREEN }}>compounds.</span>
        </h1>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
          <svg width={1660} height={640} viewBox="0 0 1660 640">
            <g opacity={axes}>
              <line x1={xL} y1={yB} x2={xL + axes * W} y2={yB} stroke="#2a3342" strokeWidth={1.5} />
              <line x1={xL} y1={yB - axes * (yB - yT + 14)} x2={xL} y2={yB} stroke="#2a3342" strokeWidth={1.5} />
              <text x={xL} y={yB + 40} fontFamily={DMSANS} fontSize={22} fill={SEC}>one lane</text>
              <text x={xR} y={yB + 40} textAnchor="end" fontFamily={DMSANS} fontSize={22} fill={SEC}>120+ lanes (a network of networks)  →</text>
              <text x={xL - 14} y={yT - 24} fontFamily={DMSANS} fontSize={22} fill={SEC}>value (conceptual)  ↑</text>
            </g>
            <path d={pathOf(fReality, 0.34)} fill="none" stroke={CYAN} strokeWidth={4} strokeDasharray="9 8" opacity={0.85 * (reality > 0 ? 1 : 0)} style={reality > 0 && reality < 1 ? { clipPath: `inset(0 ${(1 - reality) * 100}% 0 0)` } : undefined} />
            <path d={pathOf(fMetcalfe, 0.72)} fill="none" stroke={GREEN} strokeWidth={5} {...drawn(metcalfe)} opacity={metcalfe > 0 ? 1 : 0} />
            <path d={pathOf(fReed, 1)} fill="none" stroke={GOLD} strokeWidth={5} {...drawn(reed)} opacity={reed > 0 ? 1 : 0} />
            <g>
              <g style={leg(legRe)}>
                <line x1={215} y1={150} x2={258} y2={150} stroke={GOLD} strokeWidth={5} />
                <text x={274} y={157} fontFamily={MONO} fontWeight={600} fontSize={22} fill={GOLD}>Reed · 2ⁿ (overestimate)</text>
              </g>
              <g style={leg(legM)}>
                <line x1={215} y1={190} x2={258} y2={190} stroke={GREEN} strokeWidth={5} />
                <text x={274} y={197} fontFamily={MONO} fontWeight={600} fontSize={22} fill={GREEN}>Metcalfe · n² (overestimate)</text>
              </g>
              <g style={leg(legR)}>
                <line x1={215} y1={230} x2={258} y2={230} stroke={CYAN} strokeWidth={5} strokeDasharray="9 8" />
                <text x={274} y={237} fontFamily={MONO} fontWeight={600} fontSize={22} fill={CYAN}>reality · ~n·log n</text>
              </g>
            </g>
          </svg>
        </div>
      </div>
    </AbsoluteFill>
  );
};

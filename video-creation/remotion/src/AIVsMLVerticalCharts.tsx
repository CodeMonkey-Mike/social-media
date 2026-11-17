// AIVsMLVerticalCharts.tsx: C3 money ladder, the PORTRAIT (1080x1920) twin of ChartC3 (AIVsMLCharts.tsx), a Type 1 ANIMATED
// chart: bars GROW and values COUNT for real off useKtTime() (the comp's absolute clock), landing pixel-for-pixel on the
// portrait design stills assets/vertical/charts/C3-s*.png. Geometry: assets/vertical/charts/C3.vertical.spec.md +
// C3-geometry.json (portrait). The DATA, strings and cue times are IMPORTED from the 16:9 file, so the two cuts cannot drift.
import React from 'react';
import { Easing, interpolate } from 'remotion';
import { CL, useKtTime } from './effects/kinetic-text';
import { C3_BARS, C3_CAVEAT, C3_GAP, C3_SOURCE, C3_T } from './AIVsMLCharts';

// ---- PORTRAIT GEOMETRY (C3-geometry.json, orientation portrait) ----------------------------------------------------
const VW = 1080;
const VH = 1920;
const BASE_Y = 1340;
const PX_PER_K = 1.6;
const Y = (v: number) => BASE_Y - v * PX_PER_K;
const PLOT_X0 = 160;
const PLOT_X1 = 996;
const BAR_W = 204;
const BAR_X = [196, 452, 760];
const R = 12;
const TICKS = [0, 100, 200, 300, 400, 500];
const TICK_LABEL_X = 140;
const BRACKET_X = 714;
const BRACKET_TICK_X = 742;
const GAP_LABEL_X = 690;
const GAP_LABEL_Y = { eyebrow: 588, value: 674, line1: 722, line2: 756 };
const PLATE = { x: 317, y: 546, w: 395, h: 237, rx: 14, a: 0.94 };
const UNDER_Y = { role: BASE_Y + 54, qual: BASE_Y + 92, n: BASE_Y + 126 };
const VALUE_GAP = 22;
const SCRIM = { x: 0, y: 0, w: VW, h: 1500, a: 0.72 };
const SRC_TOP = 1712;
const COL = { gold: '#ffd700', green: '#00e68a', cyan: '#00c2ff', text: '#e8eaf0', sec: '#8892a4', muted: '#505a6e', grid: '#222937', axis: '#2a3142', bg: '#0a0c10' };
const F = 1 / 30;
const easeOutCubic = Easing.out(Easing.cubic);
const DM = "'DM Sans', sans-serif";
const MONO = "'JetBrains Mono', monospace";
const PLAYFAIR = "'Playfair Display', serif";

// the gap must equal top 10% minus the AI median, and the portrait bar tops must sit where the spec says
if (Math.abs(Y(C3_BARS[0].v) - 1091.2) > 1e-6 || Math.abs(Y(C3_BARS[2].v) - 548) > 1e-6) throw new Error('C3 vertical: scale out of step with C3-geometry.json');

const barPath = (x: number, h: number) => {
  const y = BASE_Y - h;
  const r = Math.min(R, h / 2, BAR_W / 2);
  if (h <= 0.01) return '';
  return `M ${x} ${BASE_Y} V ${y + r} Q ${x} ${y} ${x + r} ${y} H ${x + BAR_W - r} Q ${x + BAR_W} ${y} ${x + BAR_W} ${y + r} V ${BASE_Y} Z`;
};

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const fmt = (val: number, decimals: number, final: string, done: boolean) => (done ? final : `$${val.toFixed(decimals)}K`);

/** The live portrait C3 chart at the comp clock (same choreography as the 16:9, C3.vertical.spec.md section 3). */
export const ChartC3V: React.FC = () => {
  const t = useKtTime();

  // the comp-level moves on the chart layer: the reaction shake ("My God, dude") and the vibe-cut crash zoom (as 16:9)
  const ds = t - C3_T.shake;
  const env = ds >= 0 && ds < 0.35 ? Math.exp(-ds * 9) : 0;
  const shx = env * 13 * Math.sin(2 * Math.PI * 13 * ds);
  const shy = env * 8 * Math.sin(2 * Math.PI * 11 * ds + 1.3);
  const crash = interpolate(t, [C3_T.crash, C3_T.crash + 3 * F, 115.3], [1, 1.04, 1], { ...CL, easing: Easing.out(Easing.quad) });
  const dimA = interpolate(t, [C3_T.dim, C3_T.dim + 5 * F], [0, 1], CL);

  const bars = C3_BARS.map((b, i) => {
    const p = easeOutCubic(interpolate(t, [b.grow[0], b.grow[1]], [0, 1], CL));
    const lab = interpolate(t, [b.grow[0], b.grow[0] + 8 * F], [0, 1], CL);
    return { ...b, x: BAR_X[i], p, on: t >= b.grow[0], lab, h: b.v * PX_PER_K * p, val: b.v * p, done: t >= b.grow[1] };
  });
  const glow3 = interpolate(t, [C3_T.glowLand, C3_T.glowLand + 6 * F, C3_T.glowLand + 12 * F], [0.3, 0.55, 0.3], CL);

  const gapOn = t >= C3_GAP.t0;
  const gRef = interpolate(t, [C3_GAP.t0, C3_GAP.t0 + 9 * F], [0, 1], CL);
  const gShade = interpolate(t, [C3_GAP.t0, C3_GAP.t0 + 8 * F], [0, 1], CL);
  const gBr = interpolate(t, [C3_GAP.t0, C3_GAP.t0 + 14 * F], [0, 1], CL);
  const yb = Y(C3_BARS[0].v);
  const yt = Y(C3_BARS[2].v);
  const brLen = (BRACKET_TICK_X - BRACKET_X) * 2 + (yb - yt);
  const gapVal = C3_GAP.v * gBr;
  const refX0 = BAR_X[0] + BAR_W + 8;
  const refX1 = BRACKET_X - 2;

  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: VW, height: VH, background: COL.bg, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: VW, height: VH, transformOrigin: '50% 50%', transform: `translate(${shx}px, ${shy}px) scale(${crash})` }}>
        {/* orb */}
        <div style={{ position: 'absolute', width: 640, height: 640, right: -300, top: -280, borderRadius: '50%', background: COL.green, opacity: 0.12, filter: 'blur(120px)' }} />
        {/* header: eyebrow 28 px, h1 Playfair 900 82 px on two lines, divider 28 px below */}
        <div style={{ position: 'absolute', left: 72, top: 110, color: COL.text }}>
          <div style={{ fontFamily: DM, fontSize: 28, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.18em', color: COL.muted, marginBottom: 22 }}>The money · total pay per year</div>
          <div style={{ fontFamily: PLAYFAIR, fontWeight: 900, fontSize: 82, lineHeight: 1.07, letterSpacing: '-.02em', color: COL.text, maxWidth: 936 }}>
            Who gets the
            <br />
            <span style={{ color: COL.cyan }}>biggest</span> checks?
          </div>
          <div style={{ width: 66, height: 4, borderRadius: 2, background: `linear-gradient(90deg, ${COL.green}, ${COL.cyan})`, marginTop: 28 }} />
        </div>
        <svg viewBox={`0 0 ${VW} ${VH}`} width={VW} height={VH} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <defs>
            <linearGradient id="c3vGold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={COL.gold} />
              <stop offset="1" stopColor={COL.gold} stopOpacity=".5" />
            </linearGradient>
            <linearGradient id="c3vGreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={COL.green} />
              <stop offset="1" stopColor={COL.green} stopOpacity=".5" />
            </linearGradient>
            <linearGradient id="c3vGap" gradientUnits="userSpaceOnUse" x1="0" y1={yb} x2="0" y2={yt}>
              <stop offset="0" stopColor={COL.gold} />
              <stop offset="1" stopColor={COL.green} />
            </linearGradient>
            <filter id="c3vGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="18" />
            </filter>
          </defs>
          {/* chrome: gridlines, ticks, axis */}
          {TICKS.map((k) => (
            <g key={k}>
              {k > 0 && <line x1={PLOT_X0} y1={Y(k)} x2={PLOT_X1} y2={Y(k)} stroke={COL.grid} strokeWidth={1.5} strokeDasharray="3 9" />}
              <text x={TICK_LABEL_X} y={Y(k) + 8} textAnchor="end" fontFamily={MONO} fontWeight={400} fontSize={22} fill={COL.muted}>
                {k === 0 ? '$0' : `$${k}K`}
              </text>
            </g>
          ))}
          <line x1={PLOT_X0} y1={BASE_Y} x2={PLOT_X1} y2={BASE_Y} stroke={COL.axis} strokeWidth={2} />
          {/* the gap reference line BEHIND the bars, drawn left -> right, ends at the bracket */}
          {gapOn && <line x1={refX0} y1={yb} x2={refX0 + (refX1 - refX0) * gRef} y2={yb} stroke={COL.gold} strokeOpacity={0.8} strokeWidth={2.5} strokeDasharray="10 8" />}
          {/* bars */}
          {bars.map((b) => {
            if (!b.on || b.h <= 0.01) return null;
            const d = barPath(b.x, b.h);
            if (b.tone === 'gold')
              return (
                <g key={b.key}>
                  <path d={d} fill={COL.gold} opacity={0.28} filter="url(#c3vGlow)" />
                  <path d={d} fill="url(#c3vGold)" />
                </g>
              );
            if (b.tone === 'green')
              return (
                <g key={b.key}>
                  <path d={d} fill={COL.green} opacity={b.done ? glow3 : 0.3} filter="url(#c3vGlow)" />
                  <path d={d} fill="url(#c3vGreen)" />
                </g>
              );
            return <path key={b.key} d={d} fill={COL.green} fillOpacity={0.16} stroke={COL.green} strokeOpacity={0.55} strokeWidth={2} />;
          })}
          {/* the gap on bar 3: the part below the AI-median line steps back */}
          {gapOn && (
            <g opacity={gShade}>
              <rect x={BAR_X[2]} y={yb} width={BAR_W} height={BASE_Y - yb} fill={COL.bg} fillOpacity={0.45} />
              <line x1={BAR_X[2]} y1={yb} x2={BAR_X[2] + BAR_W} y2={yb} stroke={COL.gold} strokeWidth={3} strokeDasharray="10 8" />
            </g>
          )}
          {/* value labels (ride 22 px above the bar top, count with the height) + under labels */}
          {bars.map((b) => {
            if (!b.on) return null;
            const cx = b.x + BAR_W / 2;
            const tone = b.tone === 'gold' ? COL.gold : COL.green;
            return (
              <g key={b.key + 'l'} opacity={b.tone === 'gdim' ? 0.62 : 1}>
                <text x={cx} y={BASE_Y - b.h - VALUE_GAP} textAnchor="middle" fontFamily={MONO} fontWeight={600} fontSize={56} fill={tone}>
                  {fmt(b.val, b.decimals, b.value, b.done)}
                </text>
                <g opacity={b.lab} transform={`translate(0 ${12 * (1 - b.lab)})`}>
                  <text x={cx} y={UNDER_Y.role} textAnchor="middle" fontFamily={DM} fontWeight={700} fontSize={28} letterSpacing={2} fill={tone}>
                    {b.role}
                  </text>
                  <text x={cx} y={UNDER_Y.qual} textAnchor="middle" fontFamily={DM} fontWeight={600} fontSize={22} letterSpacing={3} fill={COL.text}>
                    {b.qual}
                  </text>
                  <text x={cx} y={UNDER_Y.n} textAnchor="middle" fontFamily={MONO} fontWeight={400} fontSize={20} fill={COL.muted}>
                    {b.n}
                  </text>
                </g>
              </g>
            );
          })}
          {/* payoff scrim: full width, everything below it at 28 percent; plate, bracket, gap label and source line stay at 100 */}
          {dimA > 0 && <rect x={SCRIM.x} y={SCRIM.y} width={SCRIM.w} height={SCRIM.h} fill={COL.bg} fillOpacity={SCRIM.a * dimA} />}
          {/* the gap label plate (hides the $400K gridline under the text), the bracket and the label, fading in together */}
          {gapOn && (
            <>
              <rect x={PLATE.x} y={PLATE.y} width={PLATE.w} height={PLATE.h} rx={PLATE.rx} fill={COL.bg} fillOpacity={PLATE.a * gBr} />
              <path
                d={`M ${BRACKET_TICK_X} ${yb} H ${BRACKET_X} V ${yt} H ${BRACKET_TICK_X}`}
                fill="none"
                stroke="url(#c3vGap)"
                strokeWidth={4}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={brLen}
                strokeDashoffset={brLen * (1 - gBr)}
              />
              <g opacity={gBr}>
                <text x={GAP_LABEL_X} y={GAP_LABEL_Y.eyebrow} textAnchor="end" fontFamily={DM} fontWeight={600} fontSize={22} letterSpacing={3.6} fill={COL.sec}>
                  THE GAP
                </text>
                <text x={GAP_LABEL_X + 2} y={GAP_LABEL_Y.value} textAnchor="end" fontFamily={MONO} fontWeight={600} fontSize={84} fill={COL.text}>
                  {gBr >= 1 ? C3_GAP.value : `$${gapVal.toFixed(1)}K`}
                </text>
                <text x={GAP_LABEL_X} y={GAP_LABEL_Y.line1} textAnchor="end" fontFamily={DM} fontWeight={700} fontSize={24} letterSpacing={2.6} fill={COL.green}>
                  TOP 10% ML ENGINEER
                </text>
                <text x={GAP_LABEL_X} y={GAP_LABEL_Y.line2} textAnchor="end" fontFamily={DM} fontWeight={700} fontSize={24} letterSpacing={2.6}>
                  <tspan fill={COL.sec}>VS </tspan>
                  <tspan fill={COL.gold}>AI ENGINEER MEDIAN</tspan>
                </text>
              </g>
            </>
          )}
        </svg>
        {/* the fixed two-line source line, the whole hold */}
        <div style={{ position: 'absolute', left: 72, top: SRC_TOP, width: 936, fontFamily: MONO, fontWeight: 400, fontSize: 21, lineHeight: 1.6, color: COL.muted, letterSpacing: '.02em' }}>
          {C3_SOURCE}
          <span style={{ display: 'block', color: COL.sec }}>{C3_CAVEAT}</span>
        </div>
      </div>
      {/* the stylesheet's film noise */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: NOISE, pointerEvents: 'none' }} />
    </div>
  );
};

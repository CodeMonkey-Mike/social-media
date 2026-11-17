// AIVsMLCharts.tsx: C3 money ladder (AI vs ML, CH3@101.7-117.18), a Type 1 ANIMATED chart: bars GROW and values COUNT for
// real off useKtTime() (the comp's absolute clock), landing pixel-for-pixel on the design stills assets/charts/C3-s*.png.
// Every number, string and coordinate is C3-geometry.json / C3.html's config (Levels.fyi US total comp, read 2026-11-09,
// DATA.md section 2 Pillar 2 + section 5). Choreography: assets/charts/C3-spec.md.
import React from 'react';
import { Easing, interpolate } from 'remotion';
import { CL, useKtTime } from './effects/kinetic-text';

// ---- DATA (one config; [VERIFY] at render: re-pull both Levels.fyi US pages) ------------------------------------------
export const C3_BARS = [
  { key: 'ai_median', v: 155.5, value: '$155.5K', role: 'AI ENGINEER', qual: 'MEDIAN', n: '330 DATA POINTS', tone: 'gold', x: 350, grow: [102.38, 103.24], decimals: 1 },
  { key: 'ml_median', v: 287.5, value: '$287.5K', role: 'ML ENGINEER', qual: 'MEDIAN', n: '1,012 DATA POINTS', tone: 'gdim', x: 700, grow: [105.94, 106.74], decimals: 1 },
  { key: 'ml_top10', v: 495.0, value: '$495K', role: 'ML ENGINEER', qual: 'TOP 10%', n: '1,012 DATA POINTS', tone: 'green', x: 1050, grow: [108.12, 109.22], decimals: 0 },
] as const;
export const C3_GAP = { v: 339.5, value: '$339.5K', t0: 112.48 };
// the gap must equal top 10% minus the AI median (495,000 - 155,500 = 339,500)
if (Math.abs(C3_BARS[2].v - C3_BARS[0].v - C3_GAP.v) > 1e-9) throw new Error('C3: gap != top10 - AI median');
export const C3_SOURCE = 'LEVELS.FYI · UNITED STATES · TOTAL COMP · READ 2026-11-09 · ';
export const C3_CAVEAT = 'THE AI ENGINEER TITLE SKEWS JUNIOR';
export const C3_T = { shake: 110.8, crash: 114.615, dim: 116.06, glowLand: 109.22 };

// ---- GEOMETRY (C3-geometry.json) -------------------------------------------------------------------------------------
const BASE_Y = 712;
const PX_PER_K = 0.84;
const Y = (v: number) => BASE_Y - v * PX_PER_K;
const PLOT_X0 = 282;
const PLOT_X1 = 1310;
const BAR_W = 240;
const R = 12;
const TICKS = [0, 100, 200, 300, 400, 500];
const BRACKET_X = 1336;
const BRACKET_TICK_X = 1306;
const GAP_LABEL_X = 1370;
const SCRIM = { x: 100, y: 30, w: 1245, h: 820, a: 0.72, fx0: 1296, fx1: 1345 };
const COL = { gold: '#ffd700', green: '#00e68a', cyan: '#00c2ff', text: '#e8eaf0', sec: '#8892a4', muted: '#505a6e', grid: '#222937', axis: '#2a3142', bg: '#0a0c10' };
const F = 1 / 30;
const easeOutCubic = Easing.out(Easing.cubic);

const DM = "'DM Sans', sans-serif";
const MONO = "'JetBrains Mono', monospace";
const PLAYFAIR = "'Playfair Display', serif";

const barPath = (x: number, h: number) => {
  const y = BASE_Y - h;
  const r = Math.min(R, h / 2, BAR_W / 2);
  if (h <= 0.01) return '';
  return `M ${x} ${BASE_Y} V ${y + r} Q ${x} ${y} ${x + r} ${y} H ${x + BAR_W - r} Q ${x + BAR_W} ${y} ${x + BAR_W} ${y + r} V ${BASE_Y} Z`;
};

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const fmt = (val: number, decimals: number, final: string, done: boolean) => (done ? final : `$${val.toFixed(decimals)}K`);

/** The live C3 chart at absolute time t (seconds on the comp clock). */
export const ChartC3: React.FC = () => {
  const t = useKtTime();

  // the comp-level moves on the chart layer: the reaction shake ("My God, dude") and the vibe-cut crash zoom
  const ds = t - C3_T.shake;
  const env = ds >= 0 && ds < 0.35 ? Math.exp(-ds * 9) : 0;
  const shx = env * 13 * Math.sin(2 * Math.PI * 13 * ds);
  const shy = env * 8 * Math.sin(2 * Math.PI * 11 * ds + 1.3);
  const crash = interpolate(t, [C3_T.crash, C3_T.crash + 3 * F, 115.3], [1, 1.04, 1], { ...CL, easing: Easing.out(Easing.quad) });
  const dimA = interpolate(t, [C3_T.dim, C3_T.dim + 5 * F], [0, 1], CL);

  const bars = C3_BARS.map((b) => {
    const p = easeOutCubic(interpolate(t, [b.grow[0], b.grow[1]], [0, 1], CL));
    const on = t >= b.grow[0];
    const lab = interpolate(t, [b.grow[0], b.grow[0] + 8 * F], [0, 1], CL);
    return { ...b, p, on, lab, h: b.v * PX_PER_K * p, val: b.v * p, done: t >= b.grow[1] };
  });
  const glow3 = interpolate(t, [C3_T.glowLand, C3_T.glowLand + 6 * F, C3_T.glowLand + 12 * F], [0.3, 0.55, 0.3], CL);

  const gapOn = t >= C3_GAP.t0;
  const gRef = interpolate(t, [C3_GAP.t0, C3_GAP.t0 + 9 * F], [0, 1], CL);
  const gShade = interpolate(t, [C3_GAP.t0, C3_GAP.t0 + 8 * F], [0, 1], CL);
  const gBr = interpolate(t, [C3_GAP.t0, C3_GAP.t0 + 14 * F], [0, 1], CL);
  const yb = Y(C3_BARS[0].v);
  const yt = Y(C3_BARS[2].v);
  const mid = (yb + yt) / 2;
  const brLen = (BRACKET_X - BRACKET_TICK_X) * 2 + (yb - yt);
  const gapVal = C3_GAP.v * gBr;

  return (
    <div style={{ position: 'absolute', inset: 0, background: COL.bg, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, transformOrigin: '50% 50%', transform: `translate(${shx}px, ${shy}px) scale(${crash})` }}>
        {/* orb */}
        <div style={{ position: 'absolute', width: 640, height: 640, right: -240, top: -260, borderRadius: '50%', background: COL.green, opacity: 0.12, filter: 'blur(120px)' }} />
        {/* header */}
        <div style={{ position: 'absolute', left: 140, top: 60, color: COL.text }}>
          <div style={{ fontFamily: DM, fontSize: 27, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.18em', color: COL.muted, marginBottom: 22 }}>The money · total pay per year</div>
          <div style={{ fontFamily: PLAYFAIR, fontWeight: 900, fontSize: 70, lineHeight: 1.07, letterSpacing: '-.02em', color: COL.text }}>
            Who gets the <span style={{ color: COL.cyan }}>biggest</span> checks?
          </div>
          <div style={{ width: 66, height: 4, borderRadius: 2, background: `linear-gradient(90deg, ${COL.green}, ${COL.cyan})`, marginTop: 24 }} />
        </div>
        <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <defs>
            <linearGradient id="c3fGold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={COL.gold} />
              <stop offset="1" stopColor={COL.gold} stopOpacity=".5" />
            </linearGradient>
            <linearGradient id="c3fGreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={COL.green} />
              <stop offset="1" stopColor={COL.green} stopOpacity=".5" />
            </linearGradient>
            <linearGradient id="c3gapGrad" gradientUnits="userSpaceOnUse" x1="0" y1={yb} x2="0" y2={yt}>
              <stop offset="0" stopColor={COL.gold} />
              <stop offset="1" stopColor={COL.green} />
            </linearGradient>
            <linearGradient id="c3scrim" gradientUnits="userSpaceOnUse" x1={SCRIM.fx0} y1="0" x2={SCRIM.fx1} y2="0">
              <stop offset="0" stopColor={COL.bg} stopOpacity={SCRIM.a} />
              <stop offset="1" stopColor={COL.bg} stopOpacity="0" />
            </linearGradient>
            <filter id="c3glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="18" />
            </filter>
          </defs>
          {/* chrome: gridlines, ticks, axis */}
          {TICKS.map((k) => (
            <g key={k}>
              {k > 0 && <line x1={PLOT_X0} y1={Y(k)} x2={PLOT_X1} y2={Y(k)} stroke={COL.grid} strokeWidth={1.5} strokeDasharray="3 9" />}
              <text x={258} y={Y(k) + 7} textAnchor="end" fontFamily={MONO} fontWeight={400} fontSize={19} fill={COL.muted}>
                {k === 0 ? '$0' : `$${k}K`}
              </text>
            </g>
          ))}
          <line x1={PLOT_X0} y1={BASE_Y} x2={PLOT_X1} y2={BASE_Y} stroke={COL.axis} strokeWidth={2} />
          {/* the gap reference line BEHIND the bars, drawn left -> right */}
          {gapOn && (
            <line
              x1={C3_BARS[0].x + BAR_W + 8}
              y1={yb}
              x2={C3_BARS[0].x + BAR_W + 8 + (BRACKET_TICK_X - 2 - (C3_BARS[0].x + BAR_W + 8)) * gRef}
              y2={yb}
              stroke={COL.gold}
              strokeOpacity={0.8}
              strokeWidth={2.5}
              strokeDasharray="10 8"
            />
          )}
          {/* bars */}
          {bars.map((b) => {
            if (!b.on || b.h <= 0.01) return null;
            const d = barPath(b.x, b.h);
            if (b.tone === 'gold')
              return (
                <g key={b.key}>
                  <path d={d} fill={COL.gold} opacity={0.28} filter="url(#c3glow)" />
                  <path d={d} fill="url(#c3fGold)" />
                </g>
              );
            if (b.tone === 'green')
              return (
                <g key={b.key}>
                  <path d={d} fill={COL.green} opacity={b.done ? glow3 : 0.3} filter="url(#c3glow)" />
                  <path d={d} fill="url(#c3fGreen)" />
                </g>
              );
            return <path key={b.key} d={d} fill={COL.green} fillOpacity={0.16} stroke={COL.green} strokeOpacity={0.55} strokeWidth={2} />;
          })}
          {/* the gap on bar 3: the part below the AI-median line steps back */}
          {gapOn && (
            <g opacity={gShade}>
              <rect x={C3_BARS[2].x} y={yb} width={BAR_W} height={BASE_Y - yb} fill={COL.bg} fillOpacity={0.45} />
              <line x1={C3_BARS[2].x} y1={yb} x2={C3_BARS[2].x + BAR_W} y2={yb} stroke={COL.gold} strokeWidth={3} strokeDasharray="10 8" />
            </g>
          )}
          {/* value labels (ride 22 px above the bar top, count with the height) + role labels below */}
          {bars.map((b) => {
            if (!b.on) return null;
            const cx = b.x + BAR_W / 2;
            const tone = b.tone === 'gold' ? COL.gold : COL.green;
            return (
              <g key={b.key + 'l'} opacity={b.tone === 'gdim' ? 0.62 : 1}>
                <text x={cx} y={BASE_Y - b.h - 22} textAnchor="middle" fontFamily={MONO} fontWeight={600} fontSize={52} fill={tone}>
                  {fmt(b.val, b.decimals, b.value, b.done)}
                </text>
                <g opacity={b.lab} transform={`translate(0 ${12 * (1 - b.lab)})`}>
                  <text x={cx} y={760} textAnchor="middle" fontFamily={DM} fontWeight={700} fontSize={30} letterSpacing={2} fill={tone}>
                    {b.role}
                  </text>
                  <text x={cx} y={796} textAnchor="middle" fontFamily={DM} fontWeight={600} fontSize={22} letterSpacing={3} fill={COL.text}>
                    {b.qual}
                  </text>
                  <text x={cx} y={828} textAnchor="middle" fontFamily={MONO} fontWeight={400} fontSize={18} fill={COL.muted}>
                    {b.n}
                  </text>
                </g>
              </g>
            );
          })}
          {/* payoff scrim: everything above at 28 percent, the bracket + gap label + source line stay at 100 */}
          {dimA > 0 && <rect x={SCRIM.x} y={SCRIM.y} width={SCRIM.w} height={SCRIM.h} fill="url(#c3scrim)" opacity={dimA} />}
          {/* bracket (bottom tick -> up -> top tick) + the gap label */}
          {gapOn && (
            <>
              <path
                d={`M ${BRACKET_TICK_X} ${yb} H ${BRACKET_X} V ${yt} H ${BRACKET_TICK_X}`}
                fill="none"
                stroke="url(#c3gapGrad)"
                strokeWidth={4}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={brLen}
                strokeDashoffset={brLen * (1 - gBr)}
              />
              <g opacity={gBr}>
                <text x={GAP_LABEL_X} y={mid - 44} fontFamily={DM} fontWeight={600} fontSize={19} letterSpacing={3.4} fill={COL.sec}>
                  THE GAP
                </text>
                <text x={GAP_LABEL_X - 3} y={mid + 22} fontFamily={MONO} fontWeight={600} fontSize={66} fill={COL.text}>
                  {gBr >= 1 ? C3_GAP.value : `$${gapVal.toFixed(1)}K`}
                </text>
                <text x={GAP_LABEL_X} y={mid + 64} fontFamily={DM} fontWeight={700} fontSize={20} letterSpacing={2.4} fill={COL.green}>
                  TOP 10% ML ENGINEER
                </text>
                <text x={GAP_LABEL_X} y={mid + 94} fontFamily={DM} fontWeight={700} fontSize={20} letterSpacing={2.4}>
                  <tspan fill={COL.sec}>VS </tspan>
                  <tspan fill={COL.gold}>AI ENGINEER MEDIAN</tspan>
                </text>
              </g>
            </>
          )}
        </svg>
        {/* the fixed source line, the whole hold */}
        <div style={{ position: 'absolute', left: 140, bottom: 46, fontFamily: MONO, fontWeight: 400, fontSize: 19, color: COL.muted, letterSpacing: '.02em', whiteSpace: 'nowrap' }}>
          {C3_SOURCE}
          <span style={{ color: COL.sec }}>{C3_CAVEAT}</span>
        </div>
      </div>
      {/* the stylesheet's film noise */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: NOISE, pointerEvents: 'none' }} />
    </div>
  );
};

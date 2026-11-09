// LeftBehindCharts.tsx: the ONE animated chart of left-behind (C2 "Who owns the stock market?"), LIGHT theme.
// Built to assets/charts/C2-who-owns-the-stock-market.html (layout, data-full widths, classes) and its animation spec
// (assets/charts/C2-who-owns-the-stock-market-animation.md); cue times are the EDIT-PLAN's C2 rows (source-spine seconds,
// routed through the comp's F()). Palette = container-canonical-light.css tokens; CH3 accent purple #8b5cf6 (COVER-PLAN
// chapter_themes), lit TEXT in the light theme's darker purple #7C3AED. Numbers from DATA.md (T7): 50.9 / 37.2 / 11.4 / 0.6.
// Reads ONE absolute clock (the comp passes `abs`), so it is safe inside any nesting (comp-build.md section 6a).
import React from 'react';
import { AbsoluteFill, Easing, interpolate } from 'remotion';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadDMSans } from '@remotion/google-fonts/DMSans';
import { loadFont as loadMono } from '@remotion/google-fonts/JetBrainsMono';

const { fontFamily: PLAYFAIR } = loadPlayfair('normal', { weights: ['900'], subsets: ['latin'] });
const { fontFamily: DMSANS } = loadDMSans('normal', { weights: ['400', '600', '700'], subsets: ['latin'] });
const { fontFamily: MONO } = loadMono('normal', { weights: ['400', '600'], subsets: ['latin'] });

// light tokens (container-canonical-light.css)
const BG = '#F6F4EE';
const TEXT_PRIMARY = '#14161A';
const TEXT_SECONDARY = '#4A5263';
const TEXT_MUTED = '#5E6676';
const GRID = '#D6D2C7';
const AXIS = '#7A808B';
const TRACK = '#ECE9E1';
const LIT = '#8b5cf6';               // CH3 purple fill
const LIT_RGB = '139,92,246';
const LIT_INK = '#7C3AED';           // light-theme purple for text

type Row = { key: string; y: number; full: number; value: number; lab: string; sub: string };
const ROWS: Row[] = [
  { key: 'top1', y: 400, full: 488.6, value: 50.9, lab: 'Top 1%', sub: '1% of households' },
  { key: 'p90', y: 522, full: 357.1, value: 37.2, lab: '90th to 99th', sub: '9% of households' },
  { key: 'p50', y: 644, full: 109.4, value: 11.4, lab: '50th to 90th', sub: '40% of households' },
  { key: 'bot50', y: 766, full: 5.8, value: 0.6, lab: 'Bottom 50%', sub: '50% of households' },
];

// EDIT-PLAN C2 cue rows (source-spine seconds)
export const C2_CUES = {
  top: 204.18,       // top 1% grows to 50.9 (1.2 s), count-up in lockstep
  half: 205.68,      // crosses HALF, HALF turns purple (state top1)
  p90: 206.30,       // 90th-99th grows (0.7 s), pale purple
  p50: 206.78,       // 50th-90th grows (0.7 s)
  bot: 208.40,       // bottom 50% 0.6 sliver + value fades in
  light: 210.72,     // bottom row lights, UNDER 1% ring draws on, value pops 1 -> 1.12 -> 1, takeaway fades up
  dim: 212.54,       // the two middle rows dim to .55 (state payoff)
};

const ease = Easing.out(Easing.cubic);
const ramp = (abs: number, a: number, d: number, e = ease) =>
  interpolate(abs, [a, a + Math.max(1, d)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e });

export const C2Chart: React.FC<{ abs: number; F: (t: number) => number }> = ({ abs, F }) => {
  const g = {
    top1: ramp(abs, F(C2_CUES.top), 36),
    p90: ramp(abs, F(C2_CUES.p90), 21),
    p50: ramp(abs, F(C2_CUES.p50), 21),
    bot50: ramp(abs, F(C2_CUES.bot), 15),
  } as Record<string, number>;
  const topW = 488.6 * g.top1;
  const halfOn = 640 + topW >= 1120 ? 1 : 0;                       // HALF turns purple as the bar crosses 50%
  const litTop = ramp(abs, F(C2_CUES.top), 12, Easing.linear);      // top row turns purple as it grows
  const litBot = ramp(abs, F(C2_CUES.light), 12, Easing.linear);
  const ringDraw = ramp(abs, F(C2_CUES.light), 18);
  const take = ramp(abs, F(C2_CUES.light), 15);
  const dim = interpolate(ramp(abs, F(C2_CUES.dim), 15), [0, 1], [1, 0.55]);
  const popT = abs - F(C2_CUES.light);
  const pop = interpolate(popT, [0, 4, 9], [1, 1.12, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const mix = (a: string, b: string, t: number) => (t >= 0.5 ? b : a);
  return (
    <AbsoluteFill style={{ background: BG, overflow: 'hidden' }}>
      {/* accent orb, pale tint (light theme .orb opacity .18) */}
      <div style={{ position: 'absolute', width: 620, height: 620, right: -180, top: -200, borderRadius: '50%',
        background: LIT, filter: 'blur(120px)', opacity: 0.18 }} />
      <div style={{ position: 'absolute', left: 120, top: 64, maxWidth: 1680 }}>
        <div style={{ fontFamily: DMSANS, fontSize: 24, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.18em',
          color: TEXT_MUTED, marginBottom: 14 }}>The asset side</div>
        <div style={{ fontFamily: PLAYFAIR, fontWeight: 900, fontSize: 64, lineHeight: 1.08, letterSpacing: '-.02em', color: TEXT_PRIMARY }}>
          Who owns the <span style={{ color: LIT_INK }}>stock market</span>?
        </div>
        <div style={{ width: 66, height: 4, borderRadius: 2, margin: '22px 0 18px',
          background: `linear-gradient(90deg, ${LIT}, rgba(${LIT_RGB},.22))` }} />
        <div style={{ fontFamily: DMSANS, fontSize: 26, color: TEXT_SECONDARY }}>
          Share of US corporate equities and mutual fund shares, by household wealth group
        </div>
      </div>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: 'absolute', left: 0, top: 0 }}>
        <line x1={640} y1={372} x2={640} y2={880} stroke={AXIS} strokeWidth={3} />
        {[[880, '25%', 'grid'], [1120, '50%', 'half'], [1360, '75%', 'grid'], [1600, '100%', 'grid']].map(([x, l, k]) => (
          <line key={String(x)} x1={x as number} y1={372} x2={x as number} y2={880}
            stroke={k === 'half' ? AXIS : GRID} strokeWidth={2} strokeDasharray={k === 'half' ? '10 8' : '4 8'} />
        ))}
        {[[640, '0%'], [880, '25%'], [1120, '50%'], [1360, '75%'], [1600, '100%']].map(([x, l]) => (
          <text key={String(l)} x={x as number} y={920} textAnchor="middle"
            style={{ fontFamily: MONO, fontWeight: 600, fontSize: 22, fill: TEXT_MUTED }}>{l}</text>
        ))}
        <text x={1120} y={358} textAnchor="middle"
          style={{ fontFamily: DMSANS, fontWeight: 700, fontSize: 20, letterSpacing: '.16em', fill: halfOn ? LIT_INK : TEXT_MUTED }}>HALF</text>
        {ROWS.map((r) => {
          const grown = g[r.key];
          const w = r.full * grown;
          const lit = r.key === 'top1' ? litTop : r.key === 'bot50' ? litBot : 0;
          const rowOp = r.key === 'p90' || r.key === 'p50' ? dim : 1;
          const val = (r.value * grown).toFixed(1);
          const valX = 640 + w + (r.key === 'bot50' ? 22 : 22);
          const sc = r.key === 'bot50' ? pop : 1;
          return (
            <g key={r.key} opacity={rowOp}>
              <rect x={640} y={r.y} width={960} height={60} rx={10} fill={TRACK} />
              {w > 0.2 && (
                <rect x={640} y={r.y} width={w} height={60} rx={Math.min(10, w / 2)}
                  fill={lit > 0.5 ? LIT : `rgba(${LIT_RGB},.30)`} />
              )}
              <text x={604} y={r.y + 32} textAnchor="end"
                style={{ fontFamily: DMSANS, fontWeight: 700, fontSize: 34, fill: mix(TEXT_PRIMARY, LIT_INK, lit) }}>{r.lab}</text>
              <text x={604} y={r.y + 62} textAnchor="end"
                style={{ fontFamily: MONO, fontWeight: 400, fontSize: 19, fill: TEXT_MUTED }}>{r.sub}</text>
              <g transform={`translate(${valX} ${r.y + 43}) scale(${sc}) translate(${-valX} ${-(r.y + 43)})`}>
                <text x={valX} y={r.y + 43} opacity={grown > 0 ? Math.min(1, grown * 3) : 0}
                  style={{ fontFamily: MONO, fontWeight: 600, fontSize: 38, fill: lit > 0.5 ? LIT_INK : TEXT_SECONDARY,
                    paintOrder: 'stroke', stroke: TRACK, strokeWidth: 10, strokeLinejoin: 'round' }}>{val}%</text>
              </g>
            </g>
          );
        })}
        {/* UNDER 1% ring: draws on (stroke dash) at the bottom-row light-up */}
        <g opacity={ringDraw > 0 ? 1 : 0}>
          <rect x={795.76} y={772} width={196} height={48} rx={24} fill={`rgba(${LIT_RGB},${0.1 * ringDraw})`}
            stroke={`rgba(${LIT_RGB},.65)`} strokeWidth={2} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - ringDraw} />
          <text x={893.76} y={804} textAnchor="middle" opacity={ringDraw}
            style={{ fontFamily: DMSANS, fontWeight: 700, fontSize: 20, letterSpacing: '.14em', fill: LIT_INK }}>UNDER 1%</text>
        </g>
      </svg>
      <div style={{ position: 'absolute', left: 120, bottom: 92, fontFamily: DMSANS, fontWeight: 700, fontSize: 38,
        color: TEXT_PRIMARY, opacity: take, transform: `translateY(${(1 - take) * 10}px)` }}>
        So it's a little bit <span style={{ color: LIT_INK }}>lopsided</span>.
      </div>
      <div style={{ position: 'absolute', left: 120, bottom: 34, fontFamily: MONO, fontWeight: 400, fontSize: 18, color: TEXT_MUTED,
        fontVariantLigatures: 'none' }}>
        Federal Reserve, Distributional Financial Accounts, 2026 Q2, via FRED
      </div>
    </AbsoluteFill>
  );
};

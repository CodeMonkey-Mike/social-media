// pieverse (longform-edited, 2026-11-14): the two ANIMATED data charts (Type 1), real useCurrentFrame-driven components.
// Built TO media/pieverse/assets/charts/C2.spec.md + C3.spec.md from the stills' own geometry (PieverseChartData.ts, generated
// from C2/C3.geometry.json). The spec PNGs are REJECTED as comp inputs (EDIT-PLAN reconciliation): nothing here holds or wipes
// a bitmap. Each component is a pure function of the SOURCE-spine second `t` (the caller maps the composition frame through
// the inverse of sh()), so the full-frame cover and the screen-share deck-area copy of the same chart share one clock
// (C2: cover 151.56-171.022, then FB4 171.022-177.755 with no restart; C3: FB5 241.669-248.669, then the cover 256.68-262.44).
// Styling = the locked container stylesheet tokens the chart-builder used (container-canonical.css), dark, no accent theme.
import React, { useMemo } from 'react';
import { AbsoluteFill, Easing, interpolate } from 'remotion';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadDMSans } from '@remotion/google-fonts/DMSans';
import { loadFont as loadMono } from '@remotion/google-fonts/JetBrainsMono';
import { C2_GEO, C3_GEO } from './PieverseChartData';

const { fontFamily: PLAYFAIR } = loadPlayfair('normal', { weights: ['900'], subsets: ['latin'] });
const { fontFamily: DMSANS } = loadDMSans('normal', { weights: ['500', '600', '700'], subsets: ['latin'] });
const { fontFamily: MONO } = loadMono('normal', { weights: ['400', '600'], subsets: ['latin'] });

// container-canonical.css tokens
const K = {
  bgDeep: '#0a0c10', green: '#00e68a', cyan: '#00c2ff', gold: '#ffd700', red: '#ff4060', purple: '#a855f7', teal: '#49e0c8',
  t1: '#e8eaf0', t2: '#8892a4', t3: '#505a6e', border: '#1e2330', axis: '#3a4357', axLabel: '#5d6780',
};

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const lerpT = (t: number, a: number, b: number, v0: number, v1: number, ease?: (x: number) => number) =>
  interpolate(t, [a, b], [v0, v1], { ...clamp, easing: ease });
const IN_OUT = Easing.inOut(Easing.sin);
const OUT = Easing.out(Easing.cubic);
const f2 = (v: number) => (+v).toFixed(2);

// fade + 8 px rise over 0.35 s from `at` (the callout landing)
const appearAt = (t: number, at: number, dur = 0.35) => lerpT(t, at, at + dur, 0, 1, OUT);
// a marker ring pop: 0 -> 1.15 -> 1 over 0.3 s
const popAt = (t: number, at: number) =>
  t < at ? 0 : interpolate(t, [at, at + 0.2, at + 0.3], [0, 1.15, 1], { ...clamp, easing: OUT });
// lit -> rest over 0.3 s from `restAt`
const litUntil = (t: number, restAt: number | null) => (restAt == null ? 1 : lerpT(t, restAt, restAt + 0.3, 1, 0));

// a polyline drawn on to fraction p of its length
const partial = (pts: [number, number][], p: number): [number, number][] => {
  if (p <= 0) return [pts[0]];
  const seg = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]));
  let left = seg.reduce((a, b) => a + b, 0) * Math.min(1, p);
  const out: [number, number][] = [pts[0]];
  for (let i = 0; i < seg.length; i++) {
    if (left >= seg[i]) { out.push(pts[i + 1]); left -= seg[i]; continue; }
    const k = seg[i] ? left / seg[i] : 0;
    out.push([pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k]);
    break;
  }
  return out;
};
const poly = (pts: [number, number][]) => 'M' + pts.map((p) => f2(p[0]) + ',' + f2(p[1])).join(' L');

// the chart frame chrome shared by both charts: orbs, eyebrow, headline, divider, pill, source line
const Orb: React.FC<{ style: React.CSSProperties; color: string; alpha: number; size: number }> = ({ style, color, alpha, size }) => (
  <div style={{ position: 'absolute', width: size * 1.5, height: size * 1.5, borderRadius: '50%', ...style,
    background: `radial-gradient(circle at center, ${color} 0%, transparent 62%)`, opacity: alpha }} />
);
const Chrome: React.FC<{ eyebrow: string; title: React.ReactNode; pill: React.ReactNode; pillStyle: React.CSSProperties; src: string }> =
  ({ eyebrow, title, pill, pillStyle, src }) => (
    <>
      <div style={{ position: 'absolute', left: 140, top: 70, zIndex: 1 }}>
        <div style={{ fontFamily: DMSANS, fontSize: 27, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.18em', color: K.t3, marginBottom: 20 }}>{eyebrow}</div>
        <div style={{ fontFamily: PLAYFAIR, fontWeight: 900, fontSize: 66, lineHeight: 1.07, letterSpacing: '-.02em', color: K.t1, whiteSpace: 'nowrap' }}>{title}</div>
        <div style={{ width: 66, height: 4, borderRadius: 2, background: `linear-gradient(90deg, ${K.green}, ${K.cyan})`, marginTop: 26 }} />
      </div>
      <div style={{ position: 'absolute', top: 84, right: 140, padding: '10px 20px', borderRadius: 100, fontFamily: DMSANS, fontWeight: 700,
        fontSize: 18, letterSpacing: '.18em', textTransform: 'uppercase', zIndex: 2, ...pillStyle }}>{pill}</div>
      <div style={{ position: 'absolute', left: 140, bottom: 36, fontFamily: MONO, fontWeight: 400, fontSize: 17, color: K.t3, zIndex: 2, whiteSpace: 'nowrap' }}>{src}</div>
    </>
  );

// ======================================================================================================================
// C2 · the PIEVERSE price, year one (C2.spec.md). One static path for the whole series, revealed by a DATE-linear clip;
// a head dot rides the clip edge; three markers land on their words; the line ends on the recording-time print 1.78.
// ======================================================================================================================
const G2 = C2_GEO;
const P2 = G2.plot;
const ms = (iso: string) => Date.parse(iso);
const T0 = ms(G2.domain.t0_utc);
const T1 = ms(G2.domain.t1_utc);
const PTS2 = G2.points.map((p) => ({ t: ms(p.t), x: p.x, y: p.y }));
const MK = Object.fromEntries(G2.markers.map((m) => [m.key, m])) as Record<string, (typeof G2.markers)[number]>;
const xAt = (tm: number) => P2.x0 + ((tm - T0) / (T1 - T0)) * (P2.x1 - P2.x0);
const yAt = (tm: number) => {
  let lo = 0;
  let hi = PTS2.length - 1;
  if (tm <= PTS2[0].t) return PTS2[0].y;
  if (tm >= PTS2[hi].t) return PTS2[hi].y;
  while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (PTS2[mid].t <= tm) lo = mid; else hi = mid; }
  const a = PTS2[lo];
  const b = PTS2[hi];
  return a.y + ((tm - a.t) / (b.t - a.t)) * (b.y - a.y);
};
// cue table (SOURCE-spine seconds, C2.spec.md "What moves, when"); a marker lands when the head reaches it
const C2_DOT_IN = 153.58;                       // "trading": the head dot on the first print, 0.5 s pulse ring
const C2_SEG: { a: number; b: number; to: number; ease: (x: number) => number }[] = [
  { a: 158.44, b: 158.69, to: ms(MK.atl.t_utc), ease: OUT },                 // first print -> ATL (0.25 s), "around (12 cents)"
  { a: 159.84, b: 168.14, to: ms('2026-04-19T00:00:00Z'), ease: IN_OUT },    // ATL -> 19 Apr 2026 (0.615) through the winter range
  { a: 168.14, b: 169.16, to: ms(MK.upbit.t_utc), ease: IN_OUT },            // the jump 19 Apr -> 20 Apr, "62" -> "around (1.18)"
  { a: 171.10, b: 175.70, to: ms(MK.ath.t_utc), ease: IN_OUT },              // (FB4, deck area) 20 Apr -> the all-time high
  { a: 175.70, b: 177.24, to: ms(G2.end.t_utc), ease: IN_OUT },              // ATH -> the 14:15 UTC print
];
const C2_LAND = { atl: 158.69, upbit: 169.16, ath: 175.70, end: 177.24 };
const C2_REST: Record<string, number | null> = { atl: 169.16, upbit: 175.70, ath: null };
const headTime = (t: number) => {
  let from = ms(G2.first_point.t_utc);
  for (const s of C2_SEG) {
    if (t < s.a) return from;
    if (t < s.b) return from + (s.to - from) * s.ease((t - s.a) / (s.b - s.a));
    from = s.to;
  }
  return from;
};
const drawing = (t: number) => C2_SEG.some((s) => t >= s.a - 0.15 && t <= s.b + 0.15);

const Callout2: React.FC<{ k: 'atl' | 'upbit' | 'ath'; appear: number; lit: number }> = ({ k, appear, lit }) => {
  const c = G2.callouts[k];
  const m = MK[k];
  if (appear <= 0) return null;
  const body = (on: boolean) => (
    <div style={{ position: 'absolute', inset: 0, padding: '12px 18px 13px 18px', borderRadius: 14, whiteSpace: 'nowrap', boxSizing: 'border-box',
      ...(on ? { border: `2px solid ${K.green}`, background: 'linear-gradient(135deg, rgba(0,230,138,.14), rgba(0,230,138,.03)), rgba(18,21,28,.94)',
        boxShadow: '0 0 0 5px rgba(0,230,138,.10), 0 0 40px rgba(0,230,138,.32)' } : { border: `1px solid ${K.border}`, background: 'rgba(18,21,28,.92)' }),
      opacity: on ? lit : (1 - lit) * 0.5 }}>
      <div style={{ fontFamily: DMSANS, fontWeight: 700, fontSize: 16, letterSpacing: '.18em', textTransform: 'uppercase', color: on ? K.green : K.t2, lineHeight: 1 }}>{m.label}</div>
      <div style={{ marginTop: 8, display: 'flex', alignItems: 'baseline', gap: 14 }}>
        <span style={{ fontFamily: MONO, fontWeight: 600, fontSize: 34, color: on ? '#fff' : K.t1, lineHeight: 1 }}>{m.value_text}</span>
        <span style={{ fontFamily: MONO, fontWeight: 600, fontSize: 19, color: K.t2, lineHeight: 1 }}>{m.date_text.toUpperCase()}</span>
      </div>
    </div>
  );
  return (
    <div style={{ position: 'absolute', left: c.x, top: c.y, width: c.w, height: c.h, opacity: appear, transform: `translateY(${(1 - appear) * 8}px)` }}>
      {body(false)}
      {body(true)}
    </div>
  );
};
const leaderPts = (k: 'atl' | 'upbit' | 'ath'): [number, number][] => {
  const m = MK[k];
  const c = G2.callouts[k] as { x: number; y: number; w: number; h: number; gutter_x?: number };
  if (k === 'atl') return [[m.x - 12, m.y], [c.gutter_x as number, m.y], [c.gutter_x as number, c.y + c.h / 2], [c.x, c.y + c.h / 2]];
  if (k === 'upbit') return [[m.x, m.y - 12], [m.x, c.y + c.h]];
  return [[m.x - 12, m.y], [c.x + c.w, m.y]];
};

export const C2Chart: React.FC<{ t: number; uid: string }> = ({ t, uid }) => {
  const linePath = useMemo(() => 'M' + PTS2.map((p) => f2(p.x) + ',' + f2(p.y)).join(' L'), []);
  const areaPath = useMemo(() => linePath + ` L${f2(PTS2[PTS2.length - 1].x)},${P2.yBot} L${f2(PTS2[0].x)},${P2.yBot} Z`, [linePath]);
  const hT = headTime(t);
  const hx = xAt(hT);
  const hy = yAt(hT);
  const started = t >= C2_SEG[0].a;
  const dotIn = lerpT(t, C2_DOT_IN, C2_DOT_IN + 0.15, 0, 1);
  const endOn = t >= C2_LAND.end;
  const headDot = endOn ? 0 : dotIn * (t < C2_SEG[0].b || drawing(t) ? 1 : 0);
  const pulse = t >= C2_DOT_IN && t < C2_DOT_IN + 0.5 ? (t - C2_DOT_IN) / 0.5 : -1;
  const keys = ['atl', 'upbit', 'ath'] as const;
  return (
    <AbsoluteFill style={{ background: K.bgDeep, overflow: 'hidden' }}>
      <Orb size={820} color="rgba(0,230,138,0.20)" alpha={1} style={{ right: -340 - 205, top: -420 - 205 }} />
      <Orb size={560} color="rgba(11,58,102,0.30)" alpha={1} style={{ left: -300 - 140, bottom: -360 - 140 }} />
      <Chrome eyebrow="One year of trading, in USD"
        title={<>The <span style={{ color: K.teal }}>PIEVERSE</span> price</>}
        pill={<>Read <span style={{ fontFamily: MONO, fontWeight: 600, letterSpacing: '.04em', color: K.t1 }}>14 NOV 2026</span></>}
        pillStyle={{ border: `1px dashed ${K.axis}`, color: K.t2 }}
        src="Source: CoinGecko, daily prints at 00:00 UTC plus its intraday all-time low and high and the 14:15 UTC print of 14 Nov 2026 · read 14 Nov 2026" />
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', zIndex: 1 }}>
        <defs>
          <linearGradient id={`${uid}-fill`} x1="0" y1={P2.yTop} x2="0" y2={P2.yBot} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="rgba(0,230,138,.26)" />
            <stop offset="1" stopColor="rgba(0,230,138,0)" />
          </linearGradient>
          <clipPath id={`${uid}-clip`}><rect x={0} y={0} width={Math.max(0, hx)} height={1080} /></clipPath>
        </defs>
        {G2.yticks.map((tk) => {
          const axis = tk.label === '0';
          return (
            <g key={'y' + tk.label}>
              <line x1={P2.x0} y1={tk.y} x2={P2.x1} y2={tk.y} stroke={axis ? K.axis : K.border} strokeWidth={axis ? 2 : 1.5} strokeDasharray={axis ? undefined : '4 7'} />
              <text x={P2.x0 - 22} y={tk.y + 7} textAnchor="end" style={{ fontFamily: MONO, fontWeight: 400, fontSize: 21 }} fill={K.axLabel}>{tk.label}</text>
            </g>
          );
        })}
        <text x={P2.x0 - 22} y={P2.yTop - 34} textAnchor="end" style={{ fontFamily: DMSANS, fontWeight: 700, fontSize: 16, letterSpacing: '.2em' }} fill={K.t3}>USD</text>
        {G2.xticks.map((tk) => (
          <g key={'x' + tk.label}>
            <line x1={tk.x} y1={P2.yBot} x2={tk.x} y2={P2.yBot + 9} stroke={K.axis} strokeWidth={2} />
            <text x={tk.x} y={P2.yBot + 42} textAnchor="middle" style={{ fontFamily: MONO, fontWeight: 400, fontSize: 20 }} fill={K.axLabel}>{tk.label}</text>
          </g>
        ))}
        {started && (
          <g clipPath={`url(#${uid}-clip)`}>
            <path d={areaPath} fill={`url(#${uid}-fill)`} />
            <path d={linePath} fill="none" stroke={K.green} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" />
          </g>
        )}
        {keys.map((k) => {
          const land = C2_LAND[k];
          if (t < land) return null;
          const lit = litUntil(t, C2_REST[k]);
          const op = 0.55 + 0.45 * lit;
          const s = popAt(t, land);
          const lp = lerpT(t, land, land + 0.25, 0, 1);
          const m = MK[k];
          return (
            <g key={k}>
              <path d={poly(partial(leaderPts(k), lp))} fill="none" stroke={K.t2} strokeWidth={1.6} strokeDasharray="3 5" opacity={op} />
              <circle cx={m.x} cy={m.y} r={22} fill="rgba(0,230,138,.20)" opacity={lit * Math.min(1, s)} />
              <g transform={`translate(${m.x} ${m.y}) scale(${s})`}>
                <circle cx={0} cy={0} r={9} fill={K.bgDeep} stroke={lit > 0.5 ? K.green : '#c9cfdb'} strokeWidth={3.5} opacity={op} />
              </g>
            </g>
          );
        })}
        {pulse >= 0 && (
          <circle cx={G2.first_point.x} cy={G2.first_point.y} r={7 + 26 * pulse} fill="none" stroke={K.green} strokeWidth={2.5} opacity={0.7 * (1 - pulse)} />
        )}
        {headDot > 0 && (
          <g opacity={headDot}>
            <circle cx={hx} cy={hy} r={16} fill="rgba(0,230,138,.22)" />
            <circle cx={hx} cy={hy} r={7} fill={K.green} />
          </g>
        )}
        {endOn && (
          <g transform={`translate(${G2.end.x} ${G2.end.y}) scale(${popAt(t, C2_LAND.end)})`}>
            <circle cx={0} cy={0} r={24} fill="rgba(0,230,138,.22)" />
            <circle cx={0} cy={0} r={10} fill={K.green} />
          </g>
        )}
      </svg>
      <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
        {keys.map((k) => (t >= C2_LAND[k] ? <Callout2 key={k} k={k} appear={appearAt(t, C2_LAND[k])} lit={litUntil(t, C2_REST[k])} /> : null))}
        {endOn && (() => {
          const a = appearAt(t, C2_LAND.end);
          return (
            <div style={{ position: 'absolute', left: P2.x1 + 34, top: G2.end.y - 62, opacity: a, transform: `translateY(${(1 - a) * 8}px)` }}>
              <div style={{ fontFamily: DMSANS, fontWeight: 700, fontSize: 16, letterSpacing: '.18em', textTransform: 'uppercase', color: K.green, lineHeight: 1 }}>{G2.end.label}</div>
              <div style={{ marginTop: 8, fontFamily: MONO, fontWeight: 600, fontSize: 52, color: K.green, lineHeight: 1, textShadow: '0 0 28px rgba(0,230,138,.45)' }}>{G2.end.value_text}</div>
              <div style={{ marginTop: 10, fontFamily: MONO, fontWeight: 600, fontSize: 19, color: K.t1, lineHeight: 1 }}>{G2.end.date_text.toUpperCase()}</div>
              <div style={{ marginTop: 6, fontFamily: MONO, fontWeight: 400, fontSize: 17, color: K.t2, lineHeight: 1 }}>14:15 UTC</div>
            </div>
          );
        })()}
      </div>
    </AbsoluteFill>
  );
};

// ======================================================================================================================
// C3 · supply unlocked, month by month, on ONE tracker's schedule (C3.spec.md). Every band's step polygon is built ONCE
// for all 36 months and revealed by a clip whose right edge moves by month; the marker, the switch-on slivers, the bracket
// and the end land on their words. The plotted rate steps down after 12 months as the tracker reads (never a flat 33.4M).
// ======================================================================================================================
const G3 = C3_GEO;
const P3 = G3.plot;
const MO = G3.months;
const N3 = MO.length - 1;
const LB = G3.labels;
const COL: Record<string, { fill: string; edge: string; sw: string; glow: string }> = {
  'Community Growth': { fill: 'rgba(0,194,255,.30)', edge: 'rgba(0,194,255,.75)', sw: '#00c2ff', glow: 'rgba(0,194,255,.6)' },
  'Ecosystem & Marketing': { fill: 'rgba(136,146,164,.28)', edge: 'rgba(136,146,164,.55)', sw: '#8892a4', glow: 'rgba(136,146,164,.6)' },
  'Foundation Reserve': { fill: 'rgba(168,85,247,.40)', edge: 'rgba(168,85,247,.85)', sw: '#a855f7', glow: 'rgba(168,85,247,.6)' },
  'Team & Advisors': { fill: 'rgba(255,215,0,.80)', edge: '#ffd700', sw: '#ffd700', glow: 'rgba(255,215,0,.75)' },
  Investors: { fill: 'rgba(255,64,96,.80)', edge: '#ff4060', sw: '#ff4060', glow: 'rgba(255,64,96,.75)' },
};
const LOCKED = ['Team & Advisors', 'Investors'];
const stepEdge = (ys: number[]): [number, number][] => {
  const pts: [number, number][] = [];
  for (let m = 0; m <= N3; m++) { pts.push([MO[m].x, ys[m]]); if (m < N3) pts.push([MO[m + 1].x, ys[m]]); }
  return pts;
};
const bandPath = (lower: number[], upper: number[]) => {
  const top = stepEdge(upper);
  const bot = stepEdge(lower).reverse();
  return 'M' + top.concat(bot).map((p) => f2(p[0]) + ',' + f2(p[1])).join(' L') + ' Z';
};
const MX = G3.marker.x;                 // 653.33, the 14 Nov 2026 marker (month 12)
const XM1 = MO[1].x;                    // the launch step's right edge (C3-start)
const XM13 = MO[G3.marker.m + 1].x;     // 686.11, the marker month revealed (C3-switch)
// cue table (SOURCE-spine seconds, C3.spec.md "What moves, when")
const C3_RUN1 = [241.92, 243.0];        // months 1 -> 11, ease-out ("look" -> "November")
const C3_MARK = 243.0;                  // marker line + callout lit, launch callout to rest
const C3_SWITCH = 246.66;               // "team": the marker month reveals, slivers glow, legend rows light, 3rd callout line
const C3_RUN2 = [256.84, 261.5];        // months 13 -> 36, ease in-out (the full-frame return)
const C3_MARK_REST = 257.0;             // the marker callout settles to rest
const C3_RATE = 258.56;                 // "33": the 12-month bracket draws (0.4 s) + the rate label
const C3_END = 261.5;                   // "2028": end dot + 1,000M BY 14 NOV 2028
const revealX = (t: number) => {
  if (t < C3_RUN1[0]) return XM1;
  if (t < C3_RUN1[1]) return lerpT(t, C3_RUN1[0], C3_RUN1[1], XM1, MX, OUT);
  if (t < C3_SWITCH) return MX;
  if (t < C3_SWITCH + 0.35) return lerpT(t, C3_SWITCH, C3_SWITCH + 0.35, MX, XM13, OUT);
  if (t < C3_RUN2[0]) return XM13;
  return lerpT(t, C3_RUN2[0], C3_RUN2[1], XM13, P3.x1, IN_OUT);
};
const revealing = (t: number) => (t >= C3_RUN1[0] && t <= C3_RUN1[1]) || (t >= C3_RUN2[0] && t <= C3_RUN2[1]);

const Co3: React.FC<{ box: { x: number; y: number; w: number; h: number }; appear: number; lit: number; children: (on: boolean) => React.ReactNode }> =
  ({ box, appear, lit, children }) => {
    if (appear <= 0) return null;
    const body = (on: boolean) => (
      <div style={{ position: 'absolute', inset: 0, padding: '13px 18px 14px', borderRadius: 14, boxSizing: 'border-box',
        ...(on ? { border: `2px solid ${K.cyan}`, background: 'linear-gradient(135deg, rgba(0,194,255,.14), rgba(0,194,255,.03)), rgba(18,21,28,.94)',
          boxShadow: '0 0 0 5px rgba(0,194,255,.10), 0 0 40px rgba(0,194,255,.30)' } : { border: `1px solid ${K.border}`, background: 'rgba(18,21,28,.92)' }),
        opacity: on ? lit : (1 - lit) * 0.55 }}>
        {children(on)}
      </div>
    );
    return (
      <div style={{ position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, opacity: appear, transform: `translateY(${(1 - appear) * 8}px)` }}>
        {body(false)}
        {body(true)}
      </div>
    );
  };

export const C3Chart: React.FC<{ t: number; uid: string }> = ({ t, uid }) => {
  const bands = useMemo(() => G3.bands.map((b) => ({ bucket: b.bucket, d: bandPath(b.lower_y, b.upper_y) })), []);
  const total = useMemo(() => poly(stepEdge(MO.map((r) => r.total_y))), []);
  const rx = revealX(t);
  const mIdx = Math.max(0, Math.min(N3, Math.floor((rx - P3.x0) / ((P3.x1 - P3.x0) / N3) - 1e-6)));
  const headOp = revealing(t) ? 1 : 0;
  const launchLit = litUntil(t, C3_MARK);
  const markOn = t >= C3_MARK;
  const markLit = markOn ? litUntil(t, C3_MARK_REST) : 0;
  const markDraw = lerpT(t, C3_MARK, C3_MARK + 0.3, 0, 1, OUT);
  const numsA = appearAt(t, C3_SWITCH);
  const sliver = t < C3_SWITCH ? 0 : interpolate(t, [C3_SWITCH, C3_SWITCH + 0.3, C3_SWITCH + 0.6, C3_RUN2[0], C3_RUN2[0] + 0.66], [0, 1, 0.6, 0.6, 0], clamp);
  const legendLit = lerpT(t, C3_SWITCH, C3_SWITCH + 0.3, 0, 1);
  const rateDraw = lerpT(t, C3_RATE, C3_RATE + 0.4, 0, 1, OUT);
  const rateA = appearAt(t, C3_RATE);
  const endOn = t >= C3_END;
  const B = LB.bracket;
  const mLit = markLit > 0.5;
  const mCol = mLit ? K.cyan : '#c9cfdb';
  const mOp = 0.55 + 0.45 * markLit;
  const mm = G3.marker.m;
  return (
    <AbsoluteFill style={{ background: K.bgDeep, overflow: 'hidden' }}>
      <Orb size={820} color="rgba(0,194,255,0.22)" alpha={1} style={{ right: -360 - 205, top: -420 - 205 }} />
      <Orb size={560} color="rgba(255,215,0,0.08)" alpha={1} style={{ left: -300 - 140, bottom: -360 - 140 }} />
      <Chrome eyebrow="The unlock schedule, on one tracker"
        title={<>Supply unlocked, <span style={{ color: K.cyan }}>month by month</span></>}
        pill={<>Tracker schedule</>}
        pillStyle={{ border: '1px dashed rgba(255,215,0,.55)', color: K.gold }}
        src="Schedule: app.tokenomics.com (a third-party tracker), its monthly unlock events, read 14 Nov 2026 · split by bucket from its terms · shares: whitepaper 5.3" />
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', zIndex: 1 }}>
        <defs>
          <clipPath id={`${uid}-rev`}><rect x={0} y={0} width={rx} height={1080} /></clipPath>
          <filter id={`${uid}-glow`} filterUnits="userSpaceOnUse" x="0" y="0" width="1920" height="1080">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {G3.yticks.map((tk) => {
          const axis = tk.label === '0';
          return (
            <g key={'y' + tk.label}>
              <line x1={P3.x0} y1={tk.y} x2={P3.x1} y2={tk.y} stroke={axis ? K.axis : K.border} strokeWidth={axis ? 2 : 1.5} strokeDasharray={axis ? undefined : '4 7'} />
              <text x={P3.x0 - 22} y={tk.y + 7} textAnchor="end" style={{ fontFamily: MONO, fontWeight: 400, fontSize: 21 }} fill={K.axLabel}>{tk.label}</text>
            </g>
          );
        })}
        <text x={140} y={P3.yTop - 38} style={{ fontFamily: DMSANS, fontWeight: 700, fontSize: 16, letterSpacing: '.2em' }} fill={K.t3}>TOKENS UNLOCKED</text>
        {G3.xticks.map((tk) => (
          <g key={'x' + tk.label}>
            <line x1={tk.x} y1={P3.yBot} x2={tk.x} y2={P3.yBot + 9} stroke={K.axis} strokeWidth={2} />
            <text x={tk.x} y={P3.yBot + 42} textAnchor="middle" style={{ fontFamily: MONO, fontWeight: 400, fontSize: 20 }} fill={K.axLabel}>{tk.label}</text>
          </g>
        ))}
        <g clipPath={`url(#${uid}-rev)`}>
          {bands.map((b) => (
            <path key={b.bucket} d={b.d} fill={COL[b.bucket].fill} stroke={COL[b.bucket].edge} strokeWidth={1} strokeLinejoin="round" />
          ))}
          {sliver > 0 && G3.bands.filter((b) => LOCKED.includes(b.bucket)).map((b) => (
            <rect key={'s' + b.bucket} x={MO[mm].x} y={b.upper_y[mm]} width={MO[mm + 1].x - MO[mm].x} height={b.lower_y[mm] - b.upper_y[mm]}
              fill={COL[b.bucket].sw} filter={`url(#${uid}-glow)`} opacity={sliver} />
          ))}
          <path d={total} fill="none" stroke={K.t1} strokeWidth={2.5} strokeLinejoin="round" opacity={0.9} />
        </g>
        {headOp > 0 && <circle cx={rx} cy={MO[mIdx].total_y} r={6} fill="#fff" opacity={headOp} />}
        <path d={`M${LB.launch.x + 10},${G3.launch.y - 4} L${LB.launch.x + 10},${LB.launch.y + LB.launch.h}`} stroke={K.t2} strokeWidth={1.6}
          strokeDasharray="3 5" fill="none" opacity={0.55 + 0.45 * launchLit} />
        {markOn && (
          <g opacity={mOp}>
            <line x1={MX} y1={P3.yTop - 12} x2={MX} y2={P3.yTop - 12 + (P3.yBot - P3.yTop + 12) * markDraw} stroke={mCol} strokeWidth={2.5} strokeDasharray="7 7" />
            <g transform={`translate(${MX} ${P3.yTop - 12}) scale(${popAt(t, C3_MARK)})`}><circle cx={0} cy={0} r={6} fill={mCol} /></g>
          </g>
        )}
        {rateDraw > 0 && (
          <path d={`M${B.x1},${B.y + 11} L${B.x1},${B.y} L${B.x2},${B.y} L${B.x2},${B.y + 11}`} fill="none" stroke={K.cyan} strokeWidth={2.5}
            strokeLinejoin="round" pathLength={1} strokeDasharray={`${rateDraw} 1`} />
        )}
        {endOn && (
          <g transform={`translate(${G3.end.x} ${G3.end.y}) scale(${popAt(t, C3_END)})`}>
            <circle cx={0} cy={0} r={20} fill="rgba(232,234,240,.18)" />
            <circle cx={0} cy={0} r={8} fill="#fff" />
          </g>
        )}
      </svg>
      <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
        <Co3 box={LB.launch} appear={1} lit={launchLit}>
          {(on) => (
            <>
              <div style={{ fontFamily: DMSANS, fontWeight: 700, fontSize: 16, letterSpacing: '.18em', textTransform: 'uppercase', color: on ? K.cyan : K.t2, lineHeight: 1 }}>At launch</div>
              <div style={{ marginTop: 8, fontFamily: MONO, fontWeight: 600, fontSize: 32, color: on ? '#fff' : K.t1, lineHeight: 1 }}>{G3.launch.text}</div>
              <div style={{ marginTop: 8, fontFamily: MONO, fontWeight: 600, fontSize: 18, color: K.t2, lineHeight: 1 }}>{G3.launch.date_text.toUpperCase()}</div>
            </>
          )}
        </Co3>
        {markOn && (
          <Co3 box={LB.marker} appear={appearAt(t, C3_MARK)} lit={markLit}>
            {(on) => (
              <>
                <div style={{ fontFamily: MONO, fontWeight: 600, fontSize: 32, color: on ? '#fff' : K.t1, lineHeight: 1 }}>{G3.marker.date_text.toUpperCase()}</div>
                <div style={{ marginTop: 9, fontFamily: DMSANS, fontSize: 20, lineHeight: 1.25, color: on ? K.t1 : K.t2 }}>the 12-month lock on team<br />and investors ends</div>
                {numsA > 0 && (
                  <div style={{ marginTop: 11, display: 'flex', alignItems: 'baseline', gap: 10, whiteSpace: 'nowrap', opacity: numsA }}>
                    <span style={{ fontFamily: MONO, fontWeight: 600, fontSize: 23, color: K.t1 }}>{G3.marker.before_text} &rarr; {G3.marker.after_text}</span>
                    <span style={{ fontFamily: DMSANS, fontWeight: 700, fontSize: 13, letterSpacing: '.16em', textTransform: 'uppercase', color: K.t3 }}>unlocked</span>
                  </div>
                )}
              </>
            )}
          </Co3>
        )}
        {rateA > 0 && (
          <div style={{ position: 'absolute', left: LB.rate.x, top: LB.rate.y, width: LB.rate.w, height: LB.rate.h, opacity: rateA, transform: `translateY(${(1 - rateA) * 8}px)` }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, whiteSpace: 'nowrap' }}>
              <span style={{ fontFamily: MONO, fontWeight: 600, fontSize: 36, color: '#fff', lineHeight: 1, textShadow: '0 0 22px rgba(0,194,255,.45)' }}>{G3.rate.text}</span>
              <span style={{ fontFamily: DMSANS, fontWeight: 700, fontSize: 22, color: K.cyan }}>a month</span>
            </div>
            <div style={{ marginTop: 8, fontFamily: DMSANS, fontWeight: 700, fontSize: 15, letterSpacing: '.16em', textTransform: 'uppercase', color: K.t2, whiteSpace: 'nowrap' }}>
              for {G3.rate.months_at_rate} months, then less
            </div>
          </div>
        )}
        {endOn && (() => {
          const a = appearAt(t, C3_END);
          return (
            <div style={{ position: 'absolute', left: LB.end.x, top: LB.end.y, opacity: a, transform: `translateY(${(1 - a) * 8}px)` }}>
              <div style={{ fontFamily: MONO, fontWeight: 600, fontSize: 38, color: '#fff', lineHeight: 1 }}>{G3.end.text}</div>
              <div style={{ marginTop: 8, fontFamily: MONO, fontWeight: 600, fontSize: 18, color: K.t2, lineHeight: 1 }}>BY {G3.end.date_text.toUpperCase()}</div>
            </div>
          );
        })()}
        <div style={{ position: 'absolute', left: LB.legend.x, top: LB.legend.y, width: LB.legend.w }}>
          <div style={{ fontFamily: DMSANS, fontWeight: 700, fontSize: 14, letterSpacing: '.18em', textTransform: 'uppercase', color: K.t3, marginBottom: 14 }}>Bucket, share of 1,000M</div>
          {[...G3.buckets_bottom_to_top].reverse().map((b) => {
            const locked = LOCKED.includes(b);
            const lit = locked ? legendLit : 0;
            const c = COL[b];
            return (
              <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 12, height: 42, opacity: locked ? 0.38 + 0.62 * legendLit : 1 }}>
                <span style={{ width: 20, height: 20, borderRadius: 5, flex: 'none', background: c.sw, boxShadow: lit > 0 ? `0 0 ${14 * lit}px ${c.glow}` : undefined }} />
                <span style={{ fontFamily: DMSANS, fontWeight: lit > 0.5 ? 700 : 500, fontSize: 19, color: lit > 0.5 ? '#fff' : K.t2, flex: 1, whiteSpace: 'nowrap' }}>{b}</span>
                <span style={{ fontFamily: MONO, fontWeight: 600, fontSize: 18, color: lit > 0.5 ? K.t1 : K.t2, width: 58, textAlign: 'right' }}>
                  {(G3.shares_pct as Record<string, number>)[b]}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

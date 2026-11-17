/**
 * future-of-software-engineers · the two ANIMATED charts (Type 1, comp-build.md section 7, charts.md).
 *
 *   C3  "How much code AI writes"   COVER 33.78 -> 68.14   (assets/charts/C3.spec.md, C3.geometry.json, C3.html)
 *   C4  "Two jobs, two directions." COVER 385.88 -> 408.31 (assets/charts/C4.spec.md, C4.geometry.json, C4.html)
 *
 * Both are REAL frame-driven components: every mark is drawn from the chart-builder's layout table (the same functions
 * C3.html / C4.html used to shoot the spec stills C3-start/-mid/-payoff, C4-start/-mid/-bars/-payoff), and every move
 * lands on the word cue in the spec's "What moves, when" table. The spec PNGs are never placed (REJECTED as comp inputs,
 * EDIT-PLAN orphan reconciliation). Values are the DATA.md / chart-spec values (re-read live by the chart-builder
 * 2026-11-14); nothing here is a new number.
 *
 * Clock: the caller passes `t` = SOURCE-spine seconds (the comp's absolute clock mapped back through the pause table),
 * so every cue below is written exactly as the spec prints it.
 */
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadDMSans } from '@remotion/google-fonts/DMSans';
import { loadFont as loadMono } from '@remotion/google-fonts/JetBrainsMono';

const { fontFamily: PLAYFAIR } = loadPlayfair('normal', { weights: ['900'], subsets: ['latin'] });
const { fontFamily: DMSANS } = loadDMSans('normal', { weights: ['500', '600', '700'], subsets: ['latin'] });
loadDMSans('italic', { weights: ['500'], subsets: ['latin'] });
const { fontFamily: MONO } = loadMono('normal', { weights: ['400', '600'], subsets: ['latin'] });

// ---- the locked container stylesheet tokens (container-canonical.css, verbatim values) ----
const BG_DEEP = '#0a0c10';
const GREEN = '#00e68a';
const CYAN = '#00c2ff';
const RED = '#ff4060';
const TEXT_PRIMARY = '#e8eaf0';
const TEXT_SECONDARY = '#8892a4';
const TEXT_MUTED = '#505a6e';
const BORDER = '#1e2330';
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

// ---- timing helpers (t and cues in source seconds) ----
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const ramp = (t: number, at: number, dur: number) => (dur <= 0 ? (t >= at ? 1 : 0) : clamp01((t - at) / dur));
const easeOut = (p: number) => 1 - Math.pow(1 - p, 3);
const easeInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const mix = (a: number, b: number, p: number) => a + (b - a) * p;
const hexMix = (a: string, b: string, p: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `rgb(${pa.map((v, i) => Math.round(mix(v, pb[i], p))).join(',')})`;
};

const Frame: React.FC<{ children: React.ReactNode; orbBlue: { w: number; l: number; b: number } }> = ({ children, orbBlue }) => (
  <AbsoluteFill style={{ background: BG_DEEP, overflow: 'hidden', fontFamily: DMSANS, color: TEXT_PRIMARY }}>
    <div style={{ position: 'absolute', width: 620, height: 620, right: -260, top: -300, borderRadius: '50%', background: GREEN, opacity: 0.12, filter: 'blur(120px)' }} />
    <div style={{ position: 'absolute', width: orbBlue.w, height: orbBlue.w, left: orbBlue.l, bottom: orbBlue.b, borderRadius: '50%', background: '#0b3a66', opacity: 0.35, filter: 'blur(120px)' }} />
    {children}
    <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: GRAIN, pointerEvents: 'none' }} />
  </AbsoluteFill>
);

const Header: React.FC<{ eyebrow: string; children: React.ReactNode }> = ({ eyebrow, children }) => (
  <>
    <div style={{ position: 'absolute', left: 120, top: 46, fontFamily: DMSANS, fontSize: 27, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.18em', color: TEXT_MUTED, whiteSpace: 'nowrap' }}>{eyebrow}</div>
    <div style={{ position: 'absolute', left: 120, top: 80, fontFamily: PLAYFAIR, fontWeight: 900, fontSize: 70, lineHeight: 1.07, letterSpacing: '-.02em', color: TEXT_PRIMARY, whiteSpace: 'nowrap' }}>{children}</div>
    <div style={{ position: 'absolute', left: 120, top: 168, width: 66, height: 4, borderRadius: 2, background: `linear-gradient(90deg, ${GREEN}, ${CYAN})` }} />
  </>
);

// =====================================================================================================================
// C3 · how much code AI writes, by the companies' own statements
// =====================================================================================================================
const DAY0 = Date.UTC(2024, 9, 1);
const DAYS = 730;
const day = (s: string) => (Date.parse(s + 'T00:00:00Z') - DAY0) / 86400000;
const PX0 = 90, PXW = 690, PY0 = 620, PYH = 450;   // plot box, panel-local (0% at y 620, 100% at y 170)
const X = (s: string) => +(PX0 + (day(s) * PXW) / DAYS).toFixed(1);
const Y = (v: number) => +(PY0 - (v * PYH) / 100).toFixed(1);

type C3Point = {
  k: string; kind: 'floor' | 'season' | 'exact' | 'band'; date: string; v: number; from?: string; to?: string; top?: number;
  val: string; what: string; when: string; src: string; call: { anchor: 'start' | 'end'; x: number; y: number };
  land: number;    // the cue the mark lands on (spec "What moves, when")
  callAt: number;  // the cue its callout lands on
};
const G3: C3Point[] = [
  { k: 'g1', kind: 'floor', date: '2024-10-29', v: 25, val: 'MORE THAN 25%', what: '', when: 'OCT 2024', src: 'Pichai, Q3 2024 earnings remarks', call: { anchor: 'start', x: 104, y: 538 }, land: 37.8, callAt: 37.8 },
  { k: 'g2', kind: 'season', from: '2025-09-01', to: '2025-11-30', date: '2025-10-15', v: 50, val: '50%', what: '', when: 'FALL 2025', src: 'per Pichai, 2026-04-22', call: { anchor: 'start', x: 470, y: 426 }, land: 43.3, callAt: 43.7 },
  { k: 'g3', kind: 'exact', date: '2026-04-22', v: 75, val: '75%', what: '', when: 'APR 2026', src: "Pichai, Cloud Next '26", call: { anchor: 'end', x: 606, y: 232 }, land: 47.36, callAt: 47.36 },
];
const A3: C3Point[] = [
  { k: 'a1', kind: 'band', from: '2024-10-01', to: '2025-02-15', date: '2025-02-15', v: 2.5, top: 5, val: 'LOW SINGLE DIGITS', what: '', when: 'BEFORE FEB 2025', src: 'Anthropic Institute essay', call: { anchor: 'start', x: 366, y: 572 }, land: 55.4, callAt: 56.06 },
  { k: 'a2', kind: 'floor', date: '2026-05-15', v: 80, val: 'MORE THAN 80%', what: 'OF MERGED CODE', when: 'MAY 2026', src: 'Anthropic Institute essay', call: { anchor: 'end', x: 624, y: 210 }, land: 60.2, callAt: 60.2 },
  { k: 'a3', kind: 'floor', date: '2026-09-15', v: 90, val: 'OVER 90%', what: 'OF CODEBASE CONTRIBUTIONS', when: 'SEP 2026', src: 'Anthropic S-1', call: { anchor: 'end', x: 778, y: 118 }, land: 63.9, callAt: 63.9 },
];
const CC3 = { date: '2025-02-15', label: 'CLAUDE CODE', when: 'FEB 2025', v: 30, at: 52.36 };
const LINKS3 = [
  { k: 'gL1', series: 'google', from: 'g1', to: 'g2', dashed: false, a: 41.36, b: 43.4 },
  { k: 'gL2', series: 'google', from: 'g2', to: 'g3', dashed: false, a: 45.06, b: 47.1 },
  { k: 'aL1', series: 'anthropic', from: 'a1', to: 'a2', dashed: false, a: 57.6, b: 60.0 },
  { k: 'aL2', series: 'anthropic', from: 'a2', to: 'a3', dashed: true, a: 63.04, b: 63.8 },   // two different measures
];
const ALL3: Record<string, C3Point> = Object.fromEntries([...G3, ...A3].map((p) => [p.k, p]));
const pt3 = (p: C3Point) => ({ x: X(p.date), y: Y(p.v) });

const C3Axes: React.FC = () => {
  const q: [string, string, string?][] = [['2024-10-01', 'OCT', '2024'], ['2025-01-01', 'JAN', '2025'], ['2025-04-01', 'APR'], ['2025-07-01', 'JUL'],
    ['2025-10-01', 'OCT'], ['2026-01-01', 'JAN', '2026'], ['2026-04-01', 'APR'], ['2026-07-01', 'JUL']];
  return (
    <g>
      {[0, 25, 50, 75, 100].map((v) => (
        <g key={v}>
          {v === 0
            ? <line x1={PX0} y1={Y(0)} x2={PX0 + PXW} y2={Y(0)} stroke="#3a4357" strokeWidth={2} />
            : <line x1={PX0} y1={Y(v)} x2={PX0 + PXW} y2={Y(v)} stroke={BORDER} strokeWidth={1.5} strokeDasharray="4 6" />}
          <text x={PX0 - 18} y={Y(v) + 5} textAnchor="end" fontFamily={MONO} fontWeight={400} fontSize={15} fill={TEXT_MUTED}>{v}%</text>
        </g>
      ))}
      {q.map(([d, m, yr]) => {
        const x = X(d);
        return (
          <g key={d}>
            {yr && d !== '2024-10-01' && <line x1={x} y1={Y(100)} x2={x} y2={Y(0)} stroke={BORDER} strokeWidth={1.5} />}
            <line x1={x} y1={Y(0)} x2={x} y2={Y(0) + 8} stroke="#3a4357" strokeWidth={2} />
            <text x={x} y={Y(0) + 30} textAnchor="middle" fontFamily={MONO} fontWeight={400} fontSize={14} fill={TEXT_MUTED}>{m}</text>
            {yr && <text x={x - 2} y={Y(0) + 56} textAnchor="start" fontFamily={MONO} fontWeight={600} fontSize={16} fill={TEXT_SECONDARY}>{yr}</text>}
          </g>
        );
      })}
      <line x1={PX0 + PXW} y1={Y(0)} x2={PX0 + PXW} y2={Y(0) + 8} stroke="#3a4357" strokeWidth={2} />
    </g>
  );
};

/** One mark, animated per the spec's method: floor (bar from centre 0.2 s, then wash + chevron rise 8 px 0.3 s),
 * dot (0 -> 1.15 -> 1, 0.3 s), capsule (grows from its centre 0.4 s), band (fills left to right, then edge + top). */
const C3Mark: React.FC<{ p: C3Point; col: string; t: number; key3: string }> = ({ p, col, t, key3 }) => {
  const { x, y } = pt3(p);
  if (t < p.land) return null;
  if (p.kind === 'floor') {
    const sx = easeOut(ramp(t, p.land, 0.2));
    const q = easeOut(ramp(t, p.land + 0.2, 0.3));
    return (
      <g>
        <g opacity={q} transform={`translate(0 ${(1 - q) * 8})`}>
          <rect x={x - 18} y={y - 34} width={36} height={34} fill={`url(#c3-wash-${key3})`} />
          <path d={`M${x - 7},${y - 15} l7,-8 l7,8`} fill="none" stroke={col} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <line x1={x - 18 * sx} y1={y} x2={x + 18 * sx} y2={y} stroke={col} strokeWidth={5} strokeLinecap="round" opacity={sx > 0.01 ? 1 : 0} />
      </g>
    );
  }
  if (p.kind === 'exact') {
    const u = t - p.land;
    const s = u < 0.18 ? easeOut(u / 0.18) * 1.15 : u < 0.3 ? mix(1.15, 1, easeInOut((u - 0.18) / 0.12)) : 1;
    return (
      <g transform={`translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})`}>
        <circle cx={x} cy={y} r={22} fill={col} opacity={0.18} />
        <circle cx={x} cy={y} r={9.5} fill={col} stroke="#0e1117" strokeWidth={3} />
      </g>
    );
  }
  if (p.kind === 'season') {
    const x1 = X(p.from!), x2 = X(p.to!);
    const g = easeOut(ramp(t, p.land, 0.4));
    const l = mix(x, x1, g), r = mix(x, x2, g);
    return (
      <g>
        <rect x={l} y={y - 7} width={Math.max(0, r - l)} height={14} rx={7} fill={col} opacity={0.9} />
        {g > 0.98 && <circle cx={x} cy={y} r={4} fill="#0e1117" />}
      </g>
    );
  }
  // band: "low single digits", 0 to 5% from the axis start to Feb 2025, no number printed
  const x1 = X(p.from!), x2 = X(p.to!), yt = Y(p.top!);
  const f = easeInOut(ramp(t, p.land, p.callAt - p.land));
  const edge = mix(x1, x2, f);
  return (
    <g>
      <clipPath id="c3-band-clip"><rect x={x1 - 2} y={yt - 4} width={Math.max(0, edge - x1 + 2)} height={Y(0) - yt + 8} /></clipPath>
      <g clipPath="url(#c3-band-clip)">
        <rect x={x1} y={yt} width={x2 - x1} height={Y(0) - yt} fill="url(#c3-bandfade)" />
        <line x1={x1} y1={yt} x2={x2} y2={yt} stroke={col} strokeWidth={2} strokeDasharray="3 5" opacity={0.8} />
      </g>
      {f >= 1 && <line x1={x2} y1={yt} x2={x2} y2={Y(0)} stroke={col} strokeWidth={2.5} />}
    </g>
  );
};

const C3Callout: React.FC<{ p: C3Point; col: string; t: number }> = ({ p, col, t }) => {
  const q = easeOut(ramp(t, p.callAt, 0.35));
  if (q <= 0) return null;
  const c = p.call;
  let y = c.y;
  const whatY = p.what ? (y += 24) : 0;
  const whenY = (y += 23);
  return (
    <g opacity={q} transform={`translate(0 ${(1 - q) * 8})`}>
      <text x={c.x} y={c.y} textAnchor={c.anchor}>
        {p.kind === 'band'
          ? <tspan fontFamily={DMSANS} fontWeight={700} fontSize={22} letterSpacing={1.2} fill={col}>{p.val}</tspan>
          : <tspan fontFamily={MONO} fontWeight={600} fontSize={28} fill={col}>{p.val}</tspan>}
      </text>
      {p.what && <text x={c.x} y={whatY} textAnchor={c.anchor} fontFamily={DMSANS} fontWeight={700} fontSize={15} letterSpacing={1.1} fill={TEXT_PRIMARY}>{p.what}</text>}
      <text x={c.x} y={whenY} textAnchor={c.anchor}>
        <tspan fontFamily={MONO} fontWeight={600} fontSize={14} fill="#c3c9d6">{p.when}</tspan>
        <tspan fontFamily={DMSANS} fontWeight={500} fontSize={15} fill={TEXT_SECONDARY}>{'  ·  ' + p.src}</tspan>
      </text>
    </g>
  );
};

const C3Panel: React.FC<{ which: 'google' | 'anthropic'; t: number }> = ({ which, t }) => {
  const isG = which === 'google';
  const col = isG ? CYAN : GREEN;
  const pts = isG ? G3 : A3;
  const left = isG ? 120 : 990;
  // REST vs LIT: GOOGLE lit 34.28, to REST 48.50 (0.3 s), back to LIT 65.30 (0.4 s); ANTHROPIC lit 48.50 (0.3 s)
  const lit = isG
    ? Math.min(ramp(t, 34.28, 0.3), 1 - ramp(t, 48.5, 0.3) + ramp(t, 65.3, 0.4))
    : ramp(t, 48.5, 0.3);
  const seriesOpacity = isG ? mix(1, 0.55, ramp(t, 48.5, 0.3) - ramp(t, 65.3, 0.4)) : 1;
  const titleCol = hexMix(TEXT_MUTED, col, clamp01(lit));
  const ccx = X(CC3.date);
  const ccP = easeOut(ramp(t, CC3.at, 0.3));
  return (
    <div style={{ position: 'absolute', left, top: 222, width: 810, height: 700, borderRadius: 20, background: 'rgba(18,21,28,.6)', border: `1.5px solid ${BORDER}`, boxSizing: 'border-box' }}>
      <div style={{ position: 'absolute', left: 40, top: 22, fontFamily: DMSANS, fontWeight: 700, fontSize: 30, letterSpacing: '.12em', textTransform: 'uppercase', color: titleCol, whiteSpace: 'nowrap' }}>{isG ? 'Google' : 'Anthropic'}</div>
      <div style={{ position: 'absolute', left: 40, top: 64, fontFamily: DMSANS, fontWeight: 500, fontSize: 17, color: TEXT_SECONDARY, whiteSpace: 'nowrap' }}>
        {isG ? 'share of NEW code that is AI-generated and approved by engineers' : 'share of its own code written by Claude (each point names its measure)'}
      </div>
      <svg viewBox="0 0 810 700" width={810} height={700} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <defs>
          <linearGradient id={`c3-wash-${which}`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor={col} stopOpacity={0.42} /><stop offset="1" stopColor={col} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="c3-bandfade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={GREEN} stopOpacity={0} /><stop offset="1" stopColor={GREEN} stopOpacity={0.45} />
          </linearGradient>
          {LINKS3.filter((l) => l.series === which).map((l) => {
            const a = pt3(ALL3[l.from]), b = pt3(ALL3[l.to]);
            const p = easeInOut(ramp(t, l.a, l.b - l.a));
            return <clipPath key={l.k} id={`c3-clip-${l.k}`}><rect x={a.x - 4} y={0} width={Math.max(0, (b.x - a.x) * p + 4)} height={700} /></clipPath>;
          })}
        </defs>
        <C3Axes />
        {!isG && t >= CC3.at && (
          <g>
            <line x1={ccx} y1={Y(0)} x2={ccx} y2={mix(Y(0), Y(CC3.v), ccP)} stroke={TEXT_MUTED} strokeWidth={1.6} strokeDasharray="2 5" />
            <g opacity={ccP}>
              <text x={ccx - 6} y={Y(CC3.v) - 24} textAnchor="start" fontFamily={DMSANS} fontWeight={700} fontSize={14} letterSpacing={1.2} fill={TEXT_SECONDARY}>{CC3.label}</text>
              <text x={ccx - 6} y={Y(CC3.v) - 6} textAnchor="start" fontFamily={MONO} fontWeight={600} fontSize={13} fill={TEXT_SECONDARY}>{CC3.when}</text>
            </g>
          </g>
        )}
        <g opacity={seriesOpacity}>
          {LINKS3.filter((l) => l.series === which && t >= l.a).map((l) => {
            const a = pt3(ALL3[l.from]), b = pt3(ALL3[l.to]);
            return <path key={l.k} d={`M${a.x},${a.y} L${b.x},${b.y}`} clipPath={`url(#c3-clip-${l.k})`} fill="none" stroke={col} strokeWidth={3.5} strokeLinecap="round" strokeDasharray={l.dashed ? '9 8' : undefined} />;
          })}
          {pts.map((p) => <C3Mark key={p.k} p={p} col={col} t={t} key3={which} />)}
          {pts.map((p) => <C3Callout key={p.k + 'c'} p={p} col={col} t={t} />)}
        </g>
      </svg>
    </div>
  );
};

const LegendItem: React.FC<{ icon: React.ReactNode; label: string; muted?: boolean }> = ({ icon, label, muted }) => (
  <span style={{ display: 'flex', alignItems: 'center', gap: 10, color: muted ? TEXT_MUTED : TEXT_SECONDARY }}>{icon}{label}</span>
);

/** C3, the live component. `t` = source seconds. Cover 33.78 -> 68.14. */
export const C3Chart: React.FC<{ t: number }> = ({ t }) => {
  // 33.92 -> 34.30 "Start": both panels, gridlines and axes draw left to right (0.38 s); legend + source with them
  const draw = easeOut(ramp(t, 33.92, 0.38));
  const clipRight = 1920 - (120 + draw * 1800);
  // 65.30 -> 68.14: slow push 1.00 -> 1.02 centred (960, 580)
  const push = mix(1, 1.02, easeInOut(ramp(t, 65.3, 68.14 - 65.3)));
  return (
    <Frame orbBlue={{ w: 560, l: -300, b: -340 }}>
      <AbsoluteFill style={{ transformOrigin: '960px 580px', transform: `scale(${push})` }}>
        <Header eyebrow="By the companies' own statements">How much code <span style={{ color: GREEN }}>AI writes</span></Header>
        <AbsoluteFill style={{ clipPath: `inset(0px ${Math.max(0, clipRight)}px 0px 0px)` }}>
          <C3Panel which="google" t={t} />
          <C3Panel which="anthropic" t={t} />
        </AbsoluteFill>
        <div style={{ position: 'absolute', left: 120, top: 942, display: 'flex', gap: 34, alignItems: 'center', fontFamily: DMSANS, fontWeight: 500, fontSize: 16, whiteSpace: 'nowrap', opacity: draw }}>
          <LegendItem label="stated figure" icon={<svg width={22} height={22}><circle cx={11} cy={11} r={7} fill={TEXT_SECONDARY} /></svg>} />
          <LegendItem label={'a floor: "more than", "over"'} icon={<svg width={30} height={24}><path d="M9,13 l6,-7 l6,7" fill="none" stroke={TEXT_SECONDARY} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" /><line x1={2} y1={20} x2={28} y2={20} stroke={TEXT_SECONDARY} strokeWidth={4} strokeLinecap="round" /></svg>} />
          <LegendItem label="a season, not a day" icon={<svg width={40} height={14}><rect x={1} y={1} width={38} height={12} rx={6} fill={TEXT_SECONDARY} /></svg>} />
          <LegendItem label="two different measures" icon={<svg width={44} height={10}><line x1={2} y1={5} x2={42} y2={5} stroke={TEXT_SECONDARY} strokeWidth={3} strokeDasharray="8 6" /></svg>} />
          <LegendItem muted label="straight links join two statements; nothing between them is reported" icon={null} />
        </div>
        <div style={{ position: 'absolute', left: 120, top: 1016, fontFamily: MONO, fontWeight: 400, fontSize: 16, color: TEXT_MUTED, whiteSpace: 'nowrap', opacity: draw }}>
          Google: Pichai, Q3 2024 earnings remarks (2024-10-29); Cloud Next '26 post (2026-04-22). Anthropic: "When AI builds itself" essay; S-1 filed 2026-10-26.
        </div>
      </AbsoluteFill>
    </Frame>
  );
};

// =====================================================================================================================
// C4 · the BLS split (Projected, 2025 to 2035): computer programmers -7%, software developers / QA / testers +10%
// =====================================================================================================================
const ZERO_Y = 560, PX_PER_PT = 24;
type C4Bar = {
  k: string; label: string[]; quote: string; v: number; x: number; w: number; col: string;
  label_at: { x: number; y: number }; quote_at: { x: number; y: number };
  lit: number; quoteAt: number; grow: [number, number];
};
const BARS4: C4Bar[] = [
  { k: 'prog', label: ['Computer programmers'], quote: '“write, modify, and test code…”', v: -7, x: 340, w: 220, col: RED,
    label_at: { x: 340, y: 444 }, quote_at: { x: 340, y: 486 }, lit: 392.38, quoteAt: 393.9, grow: [396.9, 397.52] },
  { k: 'dev', label: ['Software developers, quality', 'assurance analysts, and testers'], quote: '“design computer applications or programs”', v: 10, x: 1000, w: 220, col: GREEN,
    label_at: { x: 1000, y: 582 }, quote_at: { x: 1000, y: 662 }, lit: 399.8, quoteAt: 401.12, grow: [403.2, 404.12] },
];
const ARROW4 = { p0: [572, 700], c1: [800, 700], c2: [780, 402], p1: [980, 402], head: { x: 992, y: 402 } };
const ARROW4_D = 'M572,700 C 800,700 780,402 980,402';
const ARROW4_LEN = (() => {   // the path length once (the spec's getTotalLength, computed numerically)
  const { p0, c1, c2, p1 } = ARROW4;
  let len = 0, px = p0[0], py = p0[1];
  for (let i = 1; i <= 400; i++) {
    const s = i / 400, u = 1 - s;
    const x = u * u * u * p0[0] + 3 * u * u * s * c1[0] + 3 * u * s * s * c2[0] + s * s * s * p1[0];
    const y = u * u * u * p0[1] + 3 * u * u * s * c1[1] + 3 * u * s * s * c2[1] + s * s * s * p1[1];
    len += Math.hypot(x - px, y - py); px = x; py = y;
  }
  return len;
})();
const BLS_QUOTE = '“some higher skilled programming tasks will likely shift to other workers, such as software developers.”';

/** C4, the live component. `t` = source seconds. Cover 385.88 -> 408.31. */
export const C4Chart: React.FC<{ t: number }> = ({ t }) => {
  const push = mix(1, 1.02, easeInOut(ramp(t, 385.88, 408.31 - 385.88)));
  const zero = easeOut(ramp(t, 386.06, 0.5));                 // zero line draws L->R, sub-label + slots fade in
  const namesIn = ramp(t, 391.14, 0.35);                       // both names fade in MUTED
  const arrowP = easeInOut(ramp(t, 407.1, 0.5));
  const take = easeOut(ramp(t, 407.1, 0.5));
  // BLS sentence types on 405.18 -> 406.70: the BLS tag first, then the quote character by character
  const tagIn = ramp(t, 405.18, 0.12);
  const nChars = Math.floor(clamp01((t - 405.3) / (406.7 - 405.3)) * BLS_QUOTE.length);
  return (
    <Frame orbBlue={{ w: 520, l: -280, b: -320 }}>
      <AbsoluteFill style={{ transformOrigin: '960px 560px', transform: `scale(${push})` }}>
        <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <defs>
            <linearGradient id="c4-gNeg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={RED} stopOpacity={0.55} /><stop offset="1" stopColor={RED} stopOpacity={0.95} /></linearGradient>
            <linearGradient id="c4-gPos" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor={GREEN} stopOpacity={0.55} /><stop offset="1" stopColor={GREEN} stopOpacity={0.95} /></linearGradient>
            <linearGradient id="c4-gArr" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={RED} stopOpacity={0.85} /><stop offset="1" stopColor={GREEN} /></linearGradient>
            <filter id="c4-gl" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation={10} result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          </defs>
          {zero > 0 && <line x1={120} y1={ZERO_Y} x2={mix(120, 1800, zero)} y2={ZERO_Y} stroke="#3a4357" strokeWidth={2.5} />}
          <text x={1800} y={ZERO_Y - 14} textAnchor="end" fontFamily={MONO} fontWeight={600} fontSize={16} fill={TEXT_MUTED} opacity={zero}>{'0%  ·  NO CHANGE'}</text>
          {BARS4.map((b) => {
            const g = easeOut(ramp(t, b.grow[0], b.grow[1] - b.grow[0]));
            const h = Math.abs(b.v) * PX_PER_PT * g;
            const y = b.v < 0 ? ZERO_Y : ZERO_Y - h;
            const slot = zero * (1 - ramp(t, b.grow[0], 0.15));     // the dashed footprint fades out as its bar starts
            const glow = b.v > 0 ? ramp(t, b.grow[1] - 0.2, 0.2) : 0;
            const capY = b.v < 0 ? y + h : y;
            return (
              <g key={b.k}>
                {slot > 0 && <rect x={b.x} y={ZERO_Y - 7} width={b.w} height={14} rx={5} fill="none" stroke="#3a4357" strokeWidth={1.6} strokeDasharray="5 5" opacity={slot} />}
                {g > 0 && (
                  <g>
                    <rect x={b.x} y={y} width={b.w} height={h} rx={Math.min(6, h / 2)} fill={`url(#${b.v < 0 ? 'c4-gNeg' : 'c4-gPos'})`} />
                    {glow > 0 && <rect x={b.x} y={y} width={b.w} height={h} rx={6} fill="url(#c4-gPos)" filter="url(#c4-gl)" opacity={glow} />}
                    <line x1={b.x} y1={capY} x2={b.x + b.w} y2={capY} stroke={b.col} strokeWidth={4} />
                  </g>
                )}
              </g>
            );
          })}
          {arrowP > 0 && (
            <g>
              <path d={ARROW4_D} fill="none" stroke="url(#c4-gArr)" strokeWidth={4.5} strokeLinecap="round" strokeDasharray={ARROW4_LEN} strokeDashoffset={ARROW4_LEN * (1 - arrowP)} />
              {arrowP >= 0.96 && (() => {
                const s = easeOut(ramp(t, 407.1 + 0.48, 0.12));
                const { x, y } = ARROW4.head;
                return <path d={`M${x},${y} l-17,-10 l0,20 Z`} fill={GREEN} transform={`translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})`} />;
              })()}
            </g>
          )}
        </svg>
        <Header eyebrow="The 10-year outlook">Two jobs, two <span style={{ color: GREEN }}>directions</span>.</Header>
        <div style={{ position: 'absolute', left: 120, top: 194, fontFamily: DMSANS, fontWeight: 500, fontSize: 25, color: TEXT_SECONDARY, whiteSpace: 'nowrap', opacity: zero }}>
          Projected, U.S. Bureau of Labor Statistics, <span style={{ fontFamily: MONO, fontWeight: 600, color: TEXT_PRIMARY, fontSize: 24 }}>2025</span> to <span style={{ fontFamily: MONO, fontWeight: 600, color: TEXT_PRIMARY, fontSize: 24 }}>2035</span>
        </div>
        {BARS4.map((b) => {
          const lit = ramp(t, b.lit, 0.3);
          const q = easeOut(ramp(t, b.quoteAt, 0.35));
          const g = easeOut(ramp(t, b.grow[0], b.grow[1] - b.grow[0]));
          // the value counts by whole points with the bar, landing exactly on the cue word; the sign stays fixed
          const n = Math.round(Math.abs(b.v) * g);
          const h = Math.abs(b.v) * PX_PER_PT * g;
          const vy = b.v < 0 ? ZERO_Y + h + 14 : ZERO_Y - h - 84;
          return (
            <React.Fragment key={b.k}>
              <div style={{ position: 'absolute', left: b.label_at.x, top: b.label_at.y, fontFamily: DMSANS, fontWeight: 700, fontSize: 28, lineHeight: '34px', letterSpacing: '.07em', textTransform: 'uppercase', whiteSpace: 'nowrap', color: hexMix(TEXT_MUTED, TEXT_PRIMARY, lit), opacity: namesIn }}>
                {b.label.map((l, i) => <div key={i}>{l}</div>)}
              </div>
              <div style={{ position: 'absolute', left: b.quote_at.x, top: b.quote_at.y, fontFamily: DMSANS, fontStyle: 'italic', fontWeight: 500, fontSize: 24, color: TEXT_SECONDARY, whiteSpace: 'nowrap', opacity: q, transform: `translateY(${(1 - q) * 8}px)` }}>{b.quote}</div>
              {g > 0 && (
                <div style={{ position: 'absolute', left: b.x + b.w / 2 - 150, top: vy, width: 300, textAlign: 'center', fontFamily: MONO, fontWeight: 600, fontSize: 66, lineHeight: '70px', whiteSpace: 'nowrap', color: b.col }}>
                  {b.v < 0 ? <><span style={{ marginRight: '-.24em' }}>{'−'}</span>{n}%</> : <>+{n}%</>}
                </div>
              )}
            </React.Fragment>
          );
        })}
        <div style={{ position: 'absolute', left: 120, top: 850, display: 'flex', alignItems: 'baseline', gap: 14, whiteSpace: 'nowrap' }}>
          <span style={{ fontFamily: MONO, fontWeight: 600, fontSize: 16, letterSpacing: '.14em', color: TEXT_MUTED, opacity: tagIn }}>BLS</span>
          <span style={{ fontFamily: DMSANS, fontStyle: 'italic', fontWeight: 500, fontSize: 25, color: TEXT_SECONDARY }}>{BLS_QUOTE.slice(0, nChars)}</span>
        </div>
        <div style={{ position: 'absolute', left: 120, top: 910, fontFamily: DMSANS, fontWeight: 700, fontSize: 40, color: TEXT_PRIMARY, whiteSpace: 'nowrap', opacity: take, transform: `translateY(${(1 - take) * 8}px)` }}>
          The demand didn't disappear. <span style={{ color: GREEN }}>It moved.</span>
        </div>
        <div style={{ position: 'absolute', left: 120, top: 1022, fontFamily: MONO, fontWeight: 400, fontSize: 16, color: TEXT_MUTED, whiteSpace: 'nowrap', opacity: zero }}>
          Source: U.S. Bureau of Labor Statistics, Occupational Outlook Handbook, both occupations' pages (last modified 2026-08-27)
        </div>
      </AbsoluteFill>
    </Frame>
  );
};

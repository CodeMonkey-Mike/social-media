// BullishOnKaspaCharts.tsx: the project's own REAL animated charts (assets/charts/*.spec.md, geometry from the chart-builder's
// html, LIGHT tokens of container-canonical-light.css) and the kinetic-text devices with no shared engine yet
// (kt-caption-highlight, kt-keyword-sparkle, kt-stacked-list-over-broll, kt-text-wall, the chip + subscribe-bar variants,
// built to their rows of assets/effects/library.json). Every chart takes `t` = the SOURCE-spine second.
import React from 'react';
import { Easing, Freeze, Img, OffthreadVideo, Sequence, interpolate, staticFile } from 'remotion';
import { loadFont as loadDmSans } from '@remotion/google-fonts/DMSans';
import { loadFont as loadJetBrains } from '@remotion/google-fonts/JetBrainsMono';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { At, KtTextBlock, POP110_DUR, ShutterBlur, hover, pop110 } from './effects/kinetic-text';
import { C17_DOTS, C2_REWARD, C2_SUPPLY, C4_PATH } from './BullishOnKaspaData';

loadDmSans('normal', { weights: ['400', '500', '600', '700'], subsets: ['latin'] });
loadJetBrains('normal', { weights: ['400', '600'], subsets: ['latin'] });
loadPlayfair('normal', { weights: ['900'], subsets: ['latin'] });
loadMontserrat('italic', { weights: ['800'], subsets: ['latin'] });
loadMontserrat('normal', { weights: ['900'], subsets: ['latin'] });

export const KT_FONT = "'Montserrat', sans-serif";
export const ACCENT = '#49EACB'; // Kaspa greenish cyan (COVER-PLAN chapter_themes, every chapter)
export const ACCENT_INK = '#0E7A6C'; // the light token on text and lit wires
const INK = '#14161A';
const MUTED = '#5E6676';
const SEC = '#4A5263';
const WIRE = '#8A877E';
const AXIS = '#7A808B';
const GRID = '#D6D2C7';
const FD = 'DM Sans';
const FJ = 'JetBrains Mono';

const CL = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const easeOut = Easing.out(Easing.cubic);
const u = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], { ...CL, easing: easeOut });
const lin = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], CL);

// ---------------------------------------------------------------------------------------------------------------------
// the light chart page (same anatomy as the stills)
// ---------------------------------------------------------------------------------------------------------------------
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const Page: React.FC<{ ey: string; h: React.ReactNode; src: string; t: number; t0: number; children: React.ReactNode }> = ({ ey, h, src, t, t0, children }) => {
  const push = interpolate(t, [t0, t0 + 0.6], [1.025, 1], { ...CL, easing: easeOut });
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#F6F4EE', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', width: 900, height: 900, right: -300, top: -420, borderRadius: '50%', background: ACCENT, filter: 'blur(120px)', opacity: 0.18 }} />
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${push})` }}>
        <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
          <defs>
            <filter id="sh" x="-10%" y="-10%" width="120%" height="125%">
              <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor={INK} floodOpacity=".09" />
            </filter>
          </defs>
          {children}
        </svg>
        <div style={{ position: 'absolute', left: 140, top: 62 }}>
          <div style={{ fontFamily: FD, fontSize: 27, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.18em', color: MUTED, marginBottom: 14 }}>{ey}</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 70, lineHeight: 1.07, letterSpacing: '-.02em', color: INK, whiteSpace: 'nowrap' }}>{h}</div>
          <div style={{ width: 66, height: 4, borderRadius: 2, marginTop: 22, background: `linear-gradient(90deg,${ACCENT_INK},${ACCENT})` }} />
        </div>
        <div style={{ position: 'absolute', left: 140, bottom: 30, fontFamily: `'${FJ}',monospace`, fontSize: 20, color: MUTED }}>{src}</div>
      </div>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.05, mixBlendMode: 'multiply', backgroundImage: NOISE, pointerEvents: 'none' }} />
    </div>
  );
};
const K: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ color: ACCENT_INK }}>{children}</span>;

const Tx: React.FC<{ x: number; y: number; f?: string; s: number; w?: number; c: string; a?: 'start' | 'middle' | 'end'; ls?: string; o?: number; children: React.ReactNode }> = ({
  x, y, f = FD, s, w = 700, c, a = 'start', ls, o = 1, children,
}) => (
  <text x={x} y={y} fontFamily={f} fontSize={s} fontWeight={w} fill={c} textAnchor={a} letterSpacing={ls} opacity={o}>
    {children}
  </text>
);
/** a path that draws itself: u 0..1, round caps hidden before it starts */
const Draw: React.FC<{ d: string; p: number; c: string; w: number; join?: 'round' | 'miter' }> = ({ d, p, c, w, join = 'round' }) =>
  p <= 0 ? null : (
    <path d={d} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin={join} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
  );
/** one-segment line with a p reveal from (x1,y1) */
const Ln: React.FC<{ x1: number; y1: number; x2: number; y2: number; p?: number; c: string; w: number; dash?: string; o?: number }> = ({ x1, y1, x2, y2, p = 1, c, w, dash, o = 1 }) =>
  p <= 0 ? null : <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * p} y2={y1 + (y2 - y1) * p} stroke={c} strokeWidth={w} strokeLinecap="round" strokeDasharray={dash} opacity={o} />;

// ---------------------------------------------------------------------------------------------------------------------
// C2 state A, CH2 65.54-75.10
// ---------------------------------------------------------------------------------------------------------------------
export const C2A: React.FC<{ t: number }> = ({ t }) => {
  const stair = lin(t, 67.16, 68.56);
  const reward = lin(t, 68.56, 71.24);
  const supply = lin(t, 72.02, 72.64);
  const cap = u(t, 72.64, 73.1);
  const capLbl = u(t, 73.1, 73.5);
  return (
    <Page t={t} t0={65.54} ey="THE EMISSION" h={<>It shrinks a little <K>every single month.</K></>} src="Sources: wiki.kaspa.org tokenomics, rusty-kaspa coinbase.rs, api.kaspa.org/info/coinsupply · curves show shape, not scale">
      <rect x={140} y={300} width={620} height={650} rx={20} fill="#FFFFFF" stroke="#DDD9CF" strokeWidth={1.5} filter="url(#sh)" />
      <rect x={800} y={300} width={980} height={650} rx={20} fill="#FFFFFF" stroke="#DDD9CF" strokeWidth={1.5} filter="url(#sh)" />
      <Tx x={176} y={356} s={28} c={SEC} ls="0.1em">A 4-YEAR HALVING</Tx>
      <Tx x={836} y={356} s={28} c={ACCENT_INK} ls="0.1em">KASPA: A SMOOTH HALVING</Tx>
      <Ln x1={190} y1={860} x2={720} y2={860} c={AXIS} w={2.5} />
      <Ln x1={850} y1={860} x2={1740} y2={860} c={AXIS} w={2.5} />
      <Tx x={720} y={902} s={22} c={MUTED} a="end" ls="0.1em" o={u(t, 67.16, 67.6)}>EVERY 4 YEARS</Tx>
      <Tx x={1740} y={902} s={22} c={ACCENT_INK} a="end" ls="0.1em" o={u(t, 68.56, 69)}>EVERY SINGLE MONTH</Tx>
      <Draw d="M190,420 L322.5,420.0 L322.5,640.0 L455.0,640.0 L455.0,750.0 L587.5,750.0 L587.5,805.0 L720.0,805.0" p={stair} c={WIRE} w={7} join="miter" />
      <Draw d={C2_REWARD} p={reward} c={ACCENT_INK} w={7} />
      <Tx x={1046} y={742} s={24} c={ACCENT_INK} ls="0.1em" o={u(t, 70.2, 70.7)}>THE BLOCK REWARD</Tx>
      <Draw d={C2_SUPPLY} p={supply} c={INK} w={4.5} />
      <Tx x={1732} y={490} s={24} c={INK} a="end" ls="0.1em" o={u(t, 72.4, 72.8)}>TOTAL SUPPLY</Tx>
      {cap > 0 && <line x1={1740} y1={440} x2={1740 - 890 * cap} y2={440} stroke={INK} strokeWidth={3} strokeLinecap="round" strokeDasharray="12 9" />}
      <Tx x={1740} y={420} s={28} c={INK} a="end" o={capLbl}>HARD CAP <tspan fontFamily={FJ}>28.7B</tspan> KAS</Tx>
    </Page>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// C2 state B, CH5 352.68-358.96
// ---------------------------------------------------------------------------------------------------------------------
export const C2B: React.FC<{ t: number }> = ({ t }) => {
  const fill = u(t, 352.68, 354.1);
  const pct = 96.8 * fill;
  const rem = u(t, 356.26, 356.5);
  const leader = u(t, 356.26, 356.6);
  const lands = t >= 356.64;
  const pm = pop110(t - 356.64);
  const C = 1646.19;
  return (
    <Page t={t} t0={352.68} ey="THE EMISSION" h={<>Almost all of it is <K>already mined.</K></>} src="Source: api.kaspa.org/info/coinsupply, read 2026-11-03">
      <circle cx={1230} cy={605} r={262} fill="none" stroke={rem > 0 ? `rgba(20,22,26,${rem})` : 'none'} strokeWidth={92} />
      <circle cx={1230} cy={605} r={262} fill="none" stroke="#ECE9E1" strokeWidth={92} opacity={1 - rem} />
      <circle cx={1230} cy={605} r={262} fill="none" stroke={ACCENT} strokeWidth={92} strokeDasharray={`${(pct / 100) * C} ${C}`} transform="rotate(185.76 1230 605)" />
      <Tx x={1230} y={621} f={FJ} s={104} w={600} c={INK} a="middle">{pct.toFixed(1)}%</Tx>
      <Tx x={1230} y={679} s={36} c={ACCENT_INK} a="middle" ls="0.1em">MINED</Tx>
      <Ln x1={924} y1={605} x2={690} y2={605} p={leader} c={INK} w={3} />
      {lands && (
        <g transform={`translate(400 610) scale(${pm.s}) translate(-400 -610)`}>
          <Tx x={140} y={637} f={FJ} s={96} w={600} c={INK}>912M</Tx>
          <Tx x={400} y={635} s={44} c={INK} ls="0.1em">KAS LEFT</Tx>
        </g>
      )}
    </Page>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// C2 state C, CH5 358.96-364.52
// ---------------------------------------------------------------------------------------------------------------------
export const C2C: React.FC<{ t: number }> = ({ t }) => {
  const axes = u(t, 358.96, 359.2);
  const plateau = u(t, 358.96, 359.3);
  const marker = u(t, 359.04, 359.54);
  const pulse = interpolate(t, [361.38, 361.55, 361.8], [1, 1.1, 1], CL);
  const drop = lin(t, 362.6, 362.92);
  const lands = t >= 362.92;
  const pm = pop110(t - 362.92);
  return (
    <Page t={t} t0={358.96} ey="THE EMISSION" h={<>The November cut took the <K>reward down.</K></>} src="Source: api.kaspa.org/info/halving, blockreward · 1 step shown, axis broken">
      <g opacity={axes}>
        <Ln x1={200} y1={900} x2={1720} y2={900} c={AXIS} w={2.5} />
        <Ln x1={200} y1={360} x2={200} y2={854} c={AXIS} w={2.5} />
        <path d="M184,854 l32,-12 M184,870 l32,-12" stroke={AXIS} strokeWidth={2.5} strokeLinecap="round" />
        <Ln x1={200} y1={870} x2={200} y2={900} c={AXIS} w={2.5} />
        <Tx x={218} y={372} s={28} c={SEC} ls="0.1em">KAS / BLOCK</Tx>
      </g>
      <path d="M200,900 L200,520 L960,520 L960,900 Z" fill="rgba(73,234,203,.20)" opacity={plateau} />
      {drop > 0 && <path d={`M960,900 L960,680 L${960 + 760 * drop},680 L${960 + 760 * drop},900 Z`} fill="rgba(73,234,203,.20)" />}
      <Draw d="M200,520 L960,520 L960,680 L1720,680" p={plateau * 0.4745 + 0.5255 * drop} c={ACCENT_INK} w={8} join="miter" />
      <g transform={`translate(240 486) scale(${pulse}) translate(-240 -486)`}>
        <Tx x={240} y={486} f={FJ} s={120} w={600} c={INK} o={plateau}>2.06</Tx>
      </g>
      <Ln x1={960} y1={900} x2={960} y2={340} p={marker} c={INK} w={2.5} dash="8 8" />
      <Tx x={960} y={322} s={32} c={INK} a="middle" ls="0.1em" o={marker}>NOVEMBER 4, 2026 CUT</Tx>
      {lands && (
        <g transform={`translate(1130 600) scale(${pm.s}) translate(-1130 -600)`}>
          <Tx x={1020} y={646} f={FJ} s={120} w={600} c={ACCENT_INK}>1.94</Tx>
        </g>
      )}
    </Page>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// C2 state D, CH5 364.52-372.50 (bars to TRUE scale: the sliver is 4.26 px, never widened)
// ---------------------------------------------------------------------------------------------------------------------
export const C2D: React.FC<{ t: number }> = ({ t }) => {
  const count = u(t, 365.3, 366.6);
  const bar = u(t, 368.5, 369.6);
  const row2 = u(t, 368.2, 368.5);
  const chip = u(t, 370.0, 370.6);
  return (
    <Page t={t} t0={364.52} ey="THE EMISSION" h={<>New supply is <K>well under <span style={{ fontFamily: FJ, fontWeight: 600, letterSpacing: '-.03em' }}>1%</span></K> of what trades.</>} src="Sources: api.kaspa.org/info/halving, CoinGecko 24 h volume, read 2026-11-03 · KAS at 0.031 dollars">
      <Tx x={140} y={378} s={44} c={ACCENT_INK}><tspan fontFamily={FJ}>{(1.68 * count).toFixed(2)}M</tspan> KAS A DAY</Tx>
      <Tx x={540} y={376} s={28} c={SEC} ls="0.1em">NEW SUPPLY</Tx>
      <rect x={140} y={400} width={1640} height={120} rx={10} fill="#ECE9E1" stroke="#DDD9CF" strokeWidth={1} />
      <rect x={140} y={400} width={4.26 * count} height={120} fill={ACCENT_INK} />
      <g opacity={row2}>
        <Tx x={140} y={648} s={44} c={INK}><tspan fontFamily={FJ}>$20M</tspan> A DAY TRADED</Tx>
        <rect x={140} y={670} width={1640} height={120} rx={10} fill="#ECE9E1" stroke="#DDD9CF" strokeWidth={1} />
        <Tx x={140} y={852} s={26} c={SEC} ls="0.1em">BARS DRAWN BY VALUE, AT THESE PRICES</Tx>
      </g>
      {bar > 0 && <rect x={140} y={670} width={1640 * bar} height={120} rx={10} fill={INK} />}
      <g opacity={chip} transform={`translate(${(1 - chip) * 30} 0)`}>
        <rect x={132} y={392} width={22} height={136} rx={6} fill="none" stroke={ACCENT} strokeWidth={5} />
        <line x1={270} y1={460} x2={178.5} y2={460} stroke={ACCENT_INK} strokeWidth={5} />
        <polygon points="162.0,460.0 181.4,449.7 181.4,470.3" fill={ACCENT_INK} />
        <rect x={270} y={427} width={400} height={66} rx={33} fill="#FFFFFF" stroke={ACCENT_INK} strokeWidth={2.5} />
        <Tx x={470} y={473.7} s={38} c={ACCENT_INK} a="middle" ls="0.06em">WELL UNDER 1%</Tx>
      </g>
    </Page>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// C3 hash rate, CH5 375.76-386.74
// ---------------------------------------------------------------------------------------------------------------------
const C3_GREY = 'M250.0,398.9 L333.9,446.4 L417.8,506.2 L501.7,572.2 L585.6,572.7 L669.4,588.9 L753.3,609.3 L837.2,654.9 L921.1,685.3 L1005.0,698.1 L1088.9,704.8 L1172.8,704.8 L1256.7,714.3 L1340.6,714.3 L1424.4,750.9';
const C3_ACC = 'M1424.4,750.9 L1508.3,749.4 L1592.2,740.9 L1676.1,730.4';
const C3_Z = 'M1040.0,537.3 L1250.0,529.5 L1460.0,482.0 L1670.0,425.0';
const C3_PTS: [number, number, string, string][] = [
  [1040, 537.3, '314', INK],
  [1250, 529.5, '317', INK],
  [1460, 482, '335', INK],
  [1670, 425, '357', ACCENT_INK],
];
const C3_CUTS: [number, string][] = [[1250, 'AUG CUT'], [1460, 'SEP CUT'], [1670, 'OCT CUT']];
const C3_TICKS: [number, string][] = [[250, 'MAY'], [501.7, 'AUG'], [753.3, 'NOV'], [921.1, 'JAN'], [1172.8, 'APR'], [1424.4, 'JUL'], [1676.1, 'OCT']];
export const C3: React.FC<{ t: number }> = ({ t }) => {
  const grey = lin(t, 376.04, 380.38);
  const acc = lin(t, 381.78, 383.62);
  const card = u(t, 381.78, 382.3);
  const zl = lin(t, 382.12, 384.2);
  const pop = t >= 385.62 ? pop110(t - 385.62).s / 1.1 : 0;
  return (
    <Page t={t} t0={375.76} ey="HASH RATE · MONTHLY AVERAGE" h={<>It fell, then <K>rose through the cuts.</K></>} src="Source: api.kaspa.org/info/hashrate/history, monthly averages, read 2026-11-03 · dotted NOV = 1st to 3rd only">
      {[[710, '400'], [520, '800'], [330, '1,200']].map(([y, l]) => (
        <React.Fragment key={String(l)}>
          <line x1={250} y1={Number(y)} x2={1760} y2={Number(y)} stroke={GRID} strokeWidth={1.5} strokeLinecap="round" strokeDasharray="4 8" />
          <Tx x={228} y={Number(y) + 9} f={FJ} s={26} w={600} c={MUTED} a="end">{l}</Tx>
        </React.Fragment>
      ))}
      <Tx x={228} y={909} f={FJ} s={26} w={600} c={MUTED} a="end">0</Tx>
      <Ln x1={250} y1={900} x2={1760} y2={900} c={AXIS} w={2.5} />
      <Tx x={140} y={306} s={24} c={MUTED} ls="0.1em">PH/S</Tx>
      {C3_TICKS.map(([x, l]) => <Tx key={l} x={x} y={940} f={FJ} s={24} w={600} c={MUTED} a="middle">{l}</Tx>)}
      <Tx x={250} y={972} f={FJ} s={24} w={600} c={MUTED} a="middle">2025</Tx>
      <Tx x={921.1} y={972} f={FJ} s={24} w={600} c={MUTED} a="middle">2026</Tx>
      <Draw d={C3_GREY} p={grey} c={WIRE} w={6} />
      {grey > 0 && <circle cx={250} cy={398.875} r={9} fill="#FFFFFF" stroke={WIRE} strokeWidth={4} />}
      <Tx x={272} y={390.9} f={FJ} s={34} w={600} c={SEC} o={u(t, 376.04, 376.4)}>1,055</Tx>
      {grey >= 1 && <circle cx={1424.44} cy={750.85} r={9} fill="#FFFFFF" stroke={WIRE} strokeWidth={4} />}
      <g opacity={u(t, 376.62, 377)}>
        <Tx x={560} y={425} s={34} c={SEC}>FELL AROUND <tspan fontFamily={FJ}>70%</tspan></Tx>
        <Tx x={560} y={465} s={24} c={MUTED} ls="0.1em">MAY 2025 TO JULY 2026</Tx>
      </g>
      <Draw d={C3_ACC} p={acc} c={ACCENT_INK} w={7} />
      {acc >= 1 && <line x1={1676.1} y1={730.4} x2={1760} y2={728.5} stroke={WIRE} strokeWidth={4} strokeLinecap="round" strokeDasharray="4 8" />}
      {card > 0 && (
        <g opacity={card} transform={`translate(1508 733) scale(${0.2 + 0.8 * card}) translate(-1508 -733)`}>
          <rect x={960} y={296} width={820} height={340} rx={18} fill="#FFFFFF" stroke={ACCENT_INK} strokeWidth={2.5} filter="url(#sh)" />
          <Ln x1={1010} y1={574} x2={1700} y2={574} c={AXIS} w={2} />
          <Tx x={1040} y={614} s={22} c={MUTED} a="middle" ls="0.1em">JUL</Tx>
          <Tx x={1752} y={348} s={18} c={MUTED} a="end" ls="0.1em">ZOOMED</Tx>
          {zl > 0 && (
            <>
              <clipPath id="c3zc"><rect x={1040} y={380} width={630 * zl} height={200} /></clipPath>
              <path d="M1040.0,537.3 L1250.0,529.5 L1460.0,482.0 L1670.0,425.0 L1670.0,574 L1040.0,574 Z" fill="rgba(73,234,203,.20)" clipPath="url(#c3zc)" />
            </>
          )}
          <Draw d={C3_Z} p={zl} c={ACCENT_INK} w={7} />
          {C3_PTS.map(([x, y, l, c], i) =>
            zl >= i / 3 ? (
              <React.Fragment key={l}>
                <circle cx={x} cy={y} r={9} fill="#FFFFFF" stroke={ACCENT_INK} strokeWidth={4} />
                <Tx x={x} y={y - 22} f={FJ} s={28} w={600} c={c} a="middle">{l}</Tx>
              </React.Fragment>
            ) : null,
          )}
          {C3_CUTS.map(([x, l], i) =>
            t >= 384.5 + i * 0.22 ? (
              <React.Fragment key={l}>
                <line x1={x} y1={562} x2={x} y2={586} stroke={ACCENT_INK} strokeWidth={4} strokeLinecap="round" />
                <Tx x={x} y={614} s={22} c={ACCENT_INK} a="middle" ls="0.1em">{l}</Tx>
              </React.Fragment>
            ) : null,
          )}
          {pop > 0 && (
            <g transform={`translate(1130 336) scale(${pop}) translate(-1130 -336)`}>
              <Tx x={990} y={350} s={40} c={ACCENT_INK}>AROUND <tspan fontFamily={FJ}>+14%</tspan></Tx>
              <Tx x={1286} y={348} s={22} c={SEC} ls="0.1em">JULY AVG TO OCTOBER AVG</Tx>
            </g>
          )}
        </g>
      )}
      {card >= 1 && <line x1={1508.3} y1={733.4} x2={1508.3} y2={636} stroke={ACCENT_INK} strokeWidth={2} strokeLinecap="round" strokeDasharray="3 7" />}
    </Page>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// C4 user transactions, CH5 386.74-392.14
// ---------------------------------------------------------------------------------------------------------------------
export const C4: React.FC<{ t: number }> = ({ t }) => {
  const line = lin(t, 387.18, 391.5);
  const band = u(t, 388.64, 389.1);
  const lbl = t >= 388.64 ? pop110(t - 388.64).s / 1.1 : 0;
  const note = u(t, 391.26, 391.6);
  return (
    <Page t={t} t0={386.74} ey="USER TRANSACTIONS A DAY · NON-COINBASE" h={<>User transactions, <K>flat.</K></>} src="Source: api.kaspa.org/transactions/count, regular transactions summed by UTC day, July 1 to November 3, 2026">
      {[[685.7, '100K'], [471.4, '200K']].map(([y, l]) => (
        <React.Fragment key={String(l)}>
          <line x1={270} y1={Number(y)} x2={1770} y2={Number(y)} stroke={GRID} strokeWidth={1.5} strokeLinecap="round" strokeDasharray="4 8" />
          <Tx x={248} y={Number(y) + 9} f={FJ} s={26} w={600} c={MUTED} a="end">{l}</Tx>
        </React.Fragment>
      ))}
      <Tx x={248} y={909} f={FJ} s={26} w={600} c={MUTED} a="end">0</Tx>
      <Ln x1={270} y1={900} x2={1770} y2={900} c={AXIS} w={2.5} />
      {[[270, 'JUL'], [642, 'AUG'], [1014, 'SEP'], [1374, 'OCT'], [1746, 'NOV']].map(([x, l]) => (
        <React.Fragment key={String(l)}>
          <Ln x1={Number(x)} y1={900} x2={Number(x)} y2={910} c={AXIS} w={2.5} />
          <Tx x={Number(x) + 6} y={940} f={FJ} s={26} w={600} c={MUTED}>{l}</Tx>
        </React.Fragment>
      ))}
      <g opacity={band}>
        <rect x={270} y={728.6} width={1500} height={21.4} fill={ACCENT} fillOpacity={0.55} />
        <Ln x1={270} y1={728.6} x2={1770} y2={728.6} c={ACCENT_INK} w={2.5} />
        <Ln x1={270} y1={750} x2={1770} y2={750} c={ACCENT_INK} w={2.5} />
      </g>
      <Draw d={C4_PATH} p={line} c={INK} w={3.5} />
      {lbl > 0 && (
        <g transform={`translate(515 830) scale(${lbl}) translate(-515 -830)`}>
          <rect x={290} y={801.3} width={450} height={58} rx={12} fill="#FFFFFF" stroke={ACCENT_INK} strokeWidth={2.5} />
          <Tx x={515} y={841.3} s={32} c={ACCENT_INK} a="middle"><tspan fontFamily={FJ}>70K</tspan> TO <tspan fontFamily={FJ}>80K</tspan> A DAY</Tx>
        </g>
      )}
      <g opacity={note}>
        <Tx x={1160} y={368.4} s={26} c={SEC} a="end" ls="0.1em">SPIKE DAYS</Tx>
        <Tx x={1160} y={404.4} s={22} c={MUTED} a="end" ls="0.1em">MOST AUGUST AND SEPTEMBER DAYS RAN ABOVE THE BAND</Tx>
      </g>
    </Page>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// C17 holders per token, CH5 392.14-400.50 (459 dots, one per token, filled by column; 620 px = 437 holders)
// ---------------------------------------------------------------------------------------------------------------------
export const C17: React.FC<{ t: number }> = ({ t }) => {
  const dark = lin(t, 394.34, 394.8);
  const accent = lin(t, 396.22, 396.5);
  const medBar = u(t, 394.34, 395.5);
  const nacho = u(t, 397.92, 399.14);
  const top = u(t, 399.14, 399.6);
  return (
    <Page t={t} t0={392.14} ey="AROUND 460 TOKENS ON LAYER 1" h={<>The typical token has <K><span style={{ fontFamily: FJ, fontWeight: 600, letterSpacing: '-.03em' }}>2</span> holders.</K></>} src="Source: kascov.io tokens.json, 459 tokens, read 2026-11-03 22:44 UTC">
      <Tx x={140} y={342} s={24} c={MUTED} ls="0.1em">EVERY DOT IS ONE TOKEN</Tx>
      {C17_DOTS.map(([x, y, k], i) => {
        const at = 392.7 + (i / 459) * 0.82;
        if (t < at) return null;
        const sc = interpolate(t, [at, at + 0.1], [0, 1], CL);
        let fill = '#CFCBC0';
        if (k === 0 && dark >= (i / 276)) fill = WIRE;
        const lit = k === 2 && accent > 0;
        return <circle key={i} cx={x} cy={y} r={10.5 * sc} fill={lit ? ACCENT : fill} stroke={lit ? ACCENT_INK : undefined} strokeWidth={lit ? 2.5 : undefined} />;
      })}
      <g opacity={u(t, 394.34, 394.7)}>
        <path d="M140,843.5 V857.5 H604.8 V843.5" fill="none" stroke={SEC} strokeWidth={2.5} strokeLinecap="round" />
        <Tx x={140} y={903.5} s={30} c={INK}><tspan fontFamily={FJ} fontSize={44}>276</tspan> AT <tspan fontFamily={FJ} fontSize={34}>2</tspan> OR FEWER</Tx>
      </g>
      <g opacity={u(t, 396.22, 396.6)}>
        <path d="M855.0,843.5 V857.5 H882.5 V843.5" fill="none" stroke={ACCENT_INK} strokeWidth={3} strokeLinecap="round" />
        <Tx x={882.5} y={903.5} s={30} c={ACCENT_INK} a="end"><tspan fontFamily={FJ} fontSize={44}>9</tspan> ABOVE <tspan fontFamily={FJ} fontSize={34}>100</tspan></Tx>
      </g>
      <Tx x={1000} y={342} s={24} c={MUTED} ls="0.1em">HOLDERS PER TOKEN</Tx>
      <Tx x={1000} y={396} s={30} c={INK} ls="0.1em">MEDIAN TOKEN</Tx>
      <rect x={1000} y={416} width={620} height={64} rx={6} fill="#ECE9E1" />
      {medBar > 0 && <rect x={1000} y={416} width={3 * medBar} height={64} rx={3} fill={SEC} />}
      <Tx x={1019} y={466} f={FJ} s={50} w={600} c={SEC} o={u(t, 395.2, 395.5)}>2</Tx>
      <Tx x={1000} y={554} s={30} c={INK} ls="0.1em">NACHO</Tx>
      <rect x={1000} y={574} width={620} height={64} rx={6} fill="#ECE9E1" />
      {nacho > 0 && <rect x={1000} y={574} width={503.7 * nacho} height={64} rx={3} fill={ACCENT_INK} />}
      {nacho > 0 && <Tx x={1000 + 503.7 * nacho + 16} y={624} f={FJ} s={50} w={600} c={ACCENT_INK}>{Math.round(355 * nacho)}</Tx>}
      <Tx x={1000} y={712} s={30} c={INK} ls="0.1em">TOP TOKEN</Tx>
      <rect x={1000} y={732} width={620} height={64} rx={6} fill="#ECE9E1" />
      {top > 0 && <rect x={1000} y={732} width={620 * top} height={64} rx={3} fill={WIRE} />}
      {top > 0 && <Tx x={1000 + 620 * top + 16} y={782} f={FJ} s={50} w={600} c={SEC}>{Math.round(437 * top)}</Tx>}
    </Page>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// hand:film-burn: the video's face cut-out pick, a warm radial flash peaking ON the cut (+-11 frames)
// ---------------------------------------------------------------------------------------------------------------------
export const FilmBurn: React.FC<{ frame: number; cut: number }> = ({ frame, cut }) => {
  const d = frame - cut;
  if (d < -11 || d > 11) return null;
  const a = interpolate(d, [-11, -2, 0, 3, 11], [0, 0.82, 1, 0.82, 0], CL);
  const drift = interpolate(d, [-11, 11], [38, 62], CL);
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: a,
        mixBlendMode: 'screen',
        background: `radial-gradient(ellipse 85% 95% at ${drift}% 52%, #fff5dc 0%, #ffcf7a 26%, #ff8a2b 50%, rgba(214,60,10,.75) 72%, rgba(90,10,0,0) 100%)`,
      }}
    />
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// kt-caption-highlight: one bottom caption, ALL CAPS, key words in the accent, hard cut, IS the caption on the FACE lines.
// open_stretch: the FIRST caption only (scale-height 300 -> 100 + skew 10 -> 0 over 0.483 s).
// ---------------------------------------------------------------------------------------------------------------------
const CAP_SHADOW = '5px 6px 10px rgba(0,0,0,0.62), 2px 3px 3px rgba(0,0,0,0.45)';

/** kt-keyword-sparkle: a 4-point cartoon star at the anchor word's last letter, 0.70 s, measured sizes */
const Star: React.FC<{ dt: number }> = ({ dt }) => {
  if (dt < 0 || dt > 0.6) return null;
  const w = interpolate(dt, [0.07, 0.17, 0.24, 0.31, 0.38, 0.45, 0.6], [50, 40, 100, 114, 127, 107, 0], CL);
  const h = interpolate(dt, [0.07, 0.17, 0.24, 0.31, 0.38, 0.45, 0.6], [100, 80, 128, 150, 162, 140, 0], CL);
  const thin = interpolate(dt, [0.24, 0.45, 0.6], [14, 8, 2], CL);
  const path = `M0 ${-h / 2} Q ${thin / 2} ${-thin / 2} ${w / 2} 0 Q ${thin / 2} ${thin / 2} 0 ${h / 2} Q ${-thin / 2} ${thin / 2} ${-w / 2} 0 Q ${-thin / 2} ${-thin / 2} 0 ${-h / 2} Z`;
  return (
    <svg width={220} height={220} viewBox="-110 -110 220 220" style={{ position: 'absolute', right: -110, top: -96, overflow: 'visible', filter: 'drop-shadow(0 0 14px rgba(255,255,255,.75))' }}>
      <path d={path} fill="#FFFFFF" />
    </svg>
  );
};

export type KtPhrase = { t: number; t1: number; h: string; keys: string[]; kind: string; anchor?: string; sparks?: number[] };

export const KtCaptionLine: React.FC<{ p: KtPhrase; t: number; narrow?: boolean }> = ({ p, t, narrow }) => {
  const dt = t - p.t;
  // split on key phrases and the sparkle anchor, keeping order
  const marks = [...p.keys, ...(p.anchor && !p.keys.includes(p.anchor) ? [p.anchor] : [])];
  const parts: { s: string; key: boolean; anchor: boolean }[] = [];
  let rest = p.h;
  while (rest.length) {
    let bestI = -1;
    let best = '';
    for (const m of marks) {
      const i = rest.indexOf(m);
      if (i >= 0 && (bestI < 0 || i < bestI)) {
        bestI = i;
        best = m;
      }
    }
    if (bestI < 0) {
      parts.push({ s: rest, key: false, anchor: false });
      break;
    }
    if (bestI > 0) parts.push({ s: rest.slice(0, bestI), key: false, anchor: false });
    parts.push({ s: best, key: p.keys.includes(best), anchor: best === p.anchor });
    rest = rest.slice(bestI + best.length);
  }
  const stretch =
    p.kind === 'open'
      ? {
          transform: `scaleY(${interpolate(dt, [0, 0.483], [3, 1], { ...CL, easing: easeOut })}) skewX(${interpolate(dt, [0, 0.483], [10, 0], { ...CL, easing: easeOut })}deg)`,
          transformOrigin: '50% 100%',
        }
      : {};
  return (
    <div style={{ position: 'absolute', left: narrow ? 20 : 110, width: narrow ? 907 : 1700, bottom: 96, textAlign: 'center', ...stretch }}>
      <span style={{ fontFamily: KT_FONT, fontWeight: 800, fontStyle: 'italic', fontSize: narrow ? 58 : 72, lineHeight: 1.12, color: '#FFFFFF', textShadow: CAP_SHADOW, letterSpacing: '0.005em' }}>
        {parts.map((x, i) => (
          <span key={i} style={{ color: x.key ? ACCENT : '#FFFFFF', position: x.anchor ? 'relative' : undefined, display: x.anchor ? 'inline-block' : undefined }}>
            {x.s}
            {x.anchor && (p.sparks ?? []).map((s, j) => <Star key={j} dt={t - s} />)}
          </span>
        ))}
      </span>
    </div>
  );
};

/** two_colour_pop_variant: a headline phrase with the 110 jiggle, centred at 75 to 80 percent height, caps 80 px, two lines */
export const KtTwoColourPop: React.FC<{ t: number; t0: number; lines: string[] }> = ({ t, t0, lines }) => {
  const render = (ts: number) => {
    const pm = pop110(ts - t0);
    return (
      <At x={960} y={830} s={pm.s} rot={pm.rot}>
        <KtTextBlock lines={lines} style={{ font: KT_FONT, fontWeight: 800, fontStyle: 'italic', fontSize: 104, lineHeight: 112, color: '#FFFFFF', keyColor: ACCENT, shadow: CAP_SHADOW }} />
      </At>
    );
  };
  return <ShutterBlur t={t} t0={t0} fps={30} angle={360} samples={8} active={t - t0 < POP110_DUR + 0.04} render={render} />;
};

/** kt-keyword-pop for a LIGHT cover: the 110 jiggle; accent-ink fill with a white sticker edge so it reads over any page */
export const LightPop: React.FC<{ t: number; t0: number; t1: number; lines: string[]; x?: number; y?: number; size?: number }> = ({ t, t0, t1, lines, x = 960, y = 0.79 * 1080, size = 104 }) => {
  if (t < t0 || t >= t1) return null;
  const render = (ts: number) => {
    const pm = pop110(ts - t0);
    return (
      <At x={x} y={y} s={pm.s} rot={pm.rot}>
        <KtTextBlock lines={lines} style={{ font: KT_FONT, fontWeight: 800, fontStyle: 'italic', fontSize: size, lineHeight: size * 1.04, color: ACCENT_INK, stroke: [7, '#FFFFFF'], shadow: '0 8px 22px rgba(20,22,26,.28)' }} />
      </At>
    );
  };
  return <ShutterBlur t={t} t0={t0} fps={30} angle={360} samples={8} active={t - t0 < POP110_DUR + 0.04} render={render} />;
};

/** kt-keyword-pop chip: a boxed label rising from below the frame with a small bounce (accent box, ink text, no shadow) */
export const KtChip: React.FC<{ t: number; t0: number; t1: number; text: string; x?: number; y?: number; size?: number }> = ({ t, t0, t1, text, x = 960, y = 980, size = 46 }) => {
  if (t < t0 || t >= t1) return null;
  const dy = interpolate(t - t0, [0, 0.35], [1, 0], { ...CL, easing: Easing.bezier(0.46, 0, 0.41, 1) }) * (1080 - y + 90);
  const dip = interpolate(t - t0, [0, 0.19, 0.383], [0, 1, 0], CL) * 0.023 * 80;
  return (
    <div style={{ position: 'absolute', left: x, top: y + dy + dip, transform: 'translate(-50%,-50%)', background: ACCENT, padding: '10px 30px', borderRadius: 6, fontFamily: KT_FONT, fontWeight: 800, fontStyle: 'italic', fontSize: size, lineHeight: 1.1, color: INK, whiteSpace: 'nowrap' }}>
      {text}
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// kt-stacked-list-over-broll: the headline pops, each item pops under the last on its word (110 + the skew), all staying
// ---------------------------------------------------------------------------------------------------------------------
const STACK_YS = [0.46, 0.57, 0.68];
export const KtStack: React.FC<{ t: number; t0: number; t1: number; head: string; items: { t: number; text: string }[]; headY?: number }> = ({ t, t0, t1, head, items, headY = 0.27 }) => {
  if (t < t0 || t >= t1) return null;
  const pm = pop110(t - t0);
  const ys = items.length === 1 ? [0.46] : STACK_YS;
  return (
    <>
      <ShutterBlur
        t={t}
        t0={t0}
        fps={30}
        angle={360}
        samples={8}
        active={t - t0 < POP110_DUR + 0.04}
        render={(ts) => {
          const q = pop110(ts - t0);
          return (
            <At x={960} y={headY * 1080} s={q.s} rot={q.rot}>
              <KtTextBlock lines={[head]} style={{ font: KT_FONT, fontWeight: 800, fontStyle: 'italic', fontSize: 117, lineHeight: 120, color: ACCENT, shadow: CAP_SHADOW }} />
            </At>
          );
        }}
      />
      {items.map((it, i) => {
        if (t < it.t) return null;
        const d = t - it.t;
        const s = interpolate(d, [0, 0.233], [1, 1.1], { ...CL, easing: easeOut });
        const sk = interpolate(d, [0, 0.1, 0.367], [0, 3, 0], CL);
        return (
          <div key={i} style={{ position: 'absolute', left: 960, top: ys[i] * 1080, width: 'max-content', transform: `translate(-50%,-50%) scale(${s}) skew(${sk}deg)` }}>
            <KtTextBlock lines={[it.text]} style={{ font: KT_FONT, fontWeight: 800, fontStyle: 'italic', fontSize: 92, lineHeight: 100, color: '#FFFFFF', shadow: CAP_SHADOW }} />
          </div>
        );
      })}
      <span style={{ display: 'none' }}>{pm.s}</span>
    </>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// kt-text-wall: filled <-> outlined cross-fade, slow tilt, EARLY. pops red at wall +1.9 s (card-slides PNGs, pixel-registered).
// The card turn is hand:cube-3d (the plan names rmn:cube; @remotion/transitions ships NO cube, comp-build.md section 6).
// ---------------------------------------------------------------------------------------------------------------------
export const KtWall: React.FC<{ dt: number; turn: number }> = ({ dt }) => {
  // Mike's After Effects template Scene_23 with TOO LATE?: the wave, the outline pulse and the camera are the template's own
  // (draft note 2026-11-05: two cross-faded stills read as a still graphic). Hard cut in, as the 2023 original.
  const tEarly = 1.9;
  const pm = pop110(dt - tEarly);
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', inset: 0, background: '#000', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, transform: 'scale(1.1)', transformOrigin: '50% 50%' }}>
          <OffthreadVideo src={staticFile('overlays/text-wall-motion.mp4')} muted style={{ position: 'absolute', inset: 0, width: 1920, height: 1080 }} />
        </div>
        {dt >= tEarly && (
          <ShutterBlur
            t={dt}
            t0={tEarly}
            fps={30}
            angle={360}
            samples={8}
            active={dt - tEarly < POP110_DUR + 0.04}
            render={(ts) => {
              const q = pop110(ts - tEarly);
              return (
                <div style={{ position: 'absolute', inset: 0, transform: `scale(${q.s}) rotate(${q.rot}deg)` }}>
                  <Img src={staticFile('card-slides/text-wall-early-alpha.png')} style={{ position: 'absolute', inset: 0, width: 1920, height: 1080 }} />
                </div>
              );
            }}
          />
        )}
        <span style={{ display: 'none' }}>{pm.s}</span>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// kt-subscribe-close variant bar: the fill plate keyed by its key plate on a canvas (the library's two mp4s)
// ---------------------------------------------------------------------------------------------------------------------
export const KtSubscribeBar: React.FC<{ t: number; tPlate: number; t1: number }> = ({ t, tPlate, t1 }) => {
  const W = 1411;
  const H = 794;
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const a = React.useRef<HTMLCanvasElement | null>(null);
  const b = React.useRef<HTMLCanvasElement | null>(null);
  const compose = React.useCallback(() => {
    const c = canvas.current;
    if (!c || !a.current || !b.current) return;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    const fill = a.current.getContext('2d')!.getImageData(0, 0, W, H);
    const key = b.current.getContext('2d')!.getImageData(0, 0, W, H).data;
    const d = fill.data;
    for (let i = 0; i < d.length; i += 4) d[i + 3] = key[i];
    ctx.putImageData(fill, 0, 0);
  }, []);
  const grab = (ref: React.MutableRefObject<HTMLCanvasElement | null>) => (frame: CanvasImageSource) => {
    if (!ref.current) {
      ref.current = document.createElement('canvas');
      ref.current.width = W;
      ref.current.height = H;
    }
    ref.current.getContext('2d', { willReadFrequently: true })!.drawImage(frame, 0, 0, W, H);
    compose();
  };
  if (t < tPlate || t >= t1) return null;
  const sec = t - tPlate;
  const n = Math.round(sec * 30);
  const rise = interpolate(t, [tPlate + 0.15, tPlate + 0.412], [538, 0], { ...CL, easing: Easing.bezier(0.19, 0, 0, 1) });
  const drop = interpolate(t, [t1 - 0.2, t1], [0, 1083], CL);
  return (
    <div style={{ position: 'absolute', left: 960 - W / 2, top: 625 - H / 2 + rise + drop, width: W, height: H }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0 }}>
        <Sequence from={0} layout="none">
          <Freeze frame={n}>
            <OffthreadVideo src={staticFile('effects-kt/subscribe-bar-fill.mp4')} muted onVideoFrame={grab(a)} style={{ width: W, height: H }} />
          </Freeze>
          <Freeze frame={n}>
            <OffthreadVideo src={staticFile('effects-kt/subscribe-bar-key.mp4')} muted onVideoFrame={grab(b)} style={{ width: W, height: H }} />
          </Freeze>
        </Sequence>
      </div>
      <canvas ref={canvas} width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, width: W, height: H }} />
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// icons (flat SVG in the accent, on a white disc so they read over a receipt) + the Discord + Kaspa stickers
// ---------------------------------------------------------------------------------------------------------------------
const IconDisc: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#FFFFFF', border: `6px solid ${ACCENT_INK}`, boxShadow: '0 10px 28px rgba(20,22,26,.28)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    {children}
  </div>
);
export const IconPickaxe: React.FC = () => (
  <IconDisc>
    <svg viewBox="0 0 24 24" width="66%" height="66%" fill="none" stroke={ACCENT_INK} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.531 12.469 6.619 20.38a1 1 0 1 1-3-3l7.912-7.912" />
      <path d="M15.686 4.314A12.5 12.5 0 0 0 5.461 2.958 1 1 0 0 0 5.58 4.71a22 22 0 0 1 6.318 3.393" />
      <path d="M17.7 3.7a1 1 0 0 0-1.4 0l-4.6 4.6a1 1 0 0 0 0 1.4l2.6 2.6a1 1 0 0 0 1.4 0l4.6-4.6a1 1 0 0 0 0-1.4z" />
      <path d="M19.686 8.314a12.501 12.501 0 0 1 1.356 10.225 1 1 0 0 1-1.751-.119 22 22 0 0 0-3.393-6.319" />
    </svg>
  </IconDisc>
);
export const IconShieldCheck: React.FC = () => (
  <IconDisc>
    <svg viewBox="0 0 24 24" width="66%" height="66%" fill="none" stroke={ACCENT_INK} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  </IconDisc>
);
export const StickerKaspa: React.FC<{ t: number; t0: number; t1: number }> = ({ t, t0, t1 }) =>
  t < t0 || t >= t1 ? null : (
    <Img src={staticFile('overlays/kaspa-logo.png')} style={{ position: 'absolute', left: 1460, top: 280, width: 300, height: 300, borderRadius: '50%', boxShadow: '0 14px 40px rgba(0,0,0,.45)' }} />
  );
export const StickerDiscord: React.FC<{ t: number; t0: number; t1: number }> = ({ t, t0, t1 }) =>
  t < t0 || t >= t1 ? null : (
    <div style={{ position: 'absolute', left: 1460, top: 280, width: 300, height: 300, borderRadius: '50%', background: '#5865F2', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 14px 40px rgba(0,0,0,.45)' }}>
      <svg viewBox="0 0 24 24" width="66%" height="66%" fill="#FFFFFF">
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
      </svg>
    </div>
  );

export { hover };

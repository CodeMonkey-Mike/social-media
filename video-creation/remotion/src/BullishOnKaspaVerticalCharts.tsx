// BullishOnKaspaVerticalCharts.tsx: the portrait (1080x1920) re-lay of the project's own animated charts, to
// assets/vertical/charts/*.vertical.spec.md + the stills in that folder (same words, numbers and beat times as the 16:9), and the
// kinetic-text devices re-sized for the portrait frame. Every chart takes `t` = the SOURCE-spine second.
import React from 'react';
import { Easing, Freeze, Img, OffthreadVideo, Sequence, interpolate, staticFile } from 'remotion';
import { At, KtTextBlock, POP110_DUR, RISE, ShutterBlur, easeOut as ktEaseOut, hover, pop110, riseIn } from './effects/kinetic-text';
import { ACCENT, ACCENT_INK, KT_FONT, KtPhrase } from './BullishOnKaspaCharts';
import { V_C2_REWARD, V_C2_STAIR, V_C2_SUPPLY, V_C3_GREY, V_C4_PATH } from './BullishOnKaspaVerticalData';

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

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

// the portrait page (spec "Portrait geometry")
const Page: React.FC<{ ey: string; h: React.ReactNode; hSize?: number; src: React.ReactNode; t: number; t0: number; children: React.ReactNode }> = ({ ey, h, hSize = 88, src, t, t0, children }) => {
  const push = interpolate(t, [t0, t0 + 0.6], [1.025, 1], { ...CL, easing: easeOut });
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#F6F4EE', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', width: 700, height: 700, right: -260, top: -340, borderRadius: '50%', background: ACCENT, filter: 'blur(120px)', opacity: 0.18 }} />
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${push})`, transformOrigin: '50% 50%' }}>
        <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0 }}>
          <defs>
            <filter id="shv" x="-10%" y="-10%" width="120%" height="125%">
              <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor={INK} floodOpacity=".09" />
            </filter>
          </defs>
          {children}
        </svg>
        <div style={{ position: 'absolute', left: 70, top: 120 }}>
          <div style={{ fontFamily: FD, fontSize: 30, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.18em', color: MUTED, marginBottom: 14 }}>{ey}</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: hSize, lineHeight: 1.07, letterSpacing: '-.02em', color: INK, whiteSpace: 'nowrap' }}>{h}</div>
          <div style={{ width: 66, height: 4, borderRadius: 2, marginTop: 22, background: `linear-gradient(90deg,${ACCENT_INK},${ACCENT})` }} />
        </div>
        <div style={{ position: 'absolute', left: 70, right: 70, bottom: 60, fontFamily: `'${FJ}',monospace`, fontSize: 22, lineHeight: 1.4, color: MUTED, textWrap: 'balance' } as React.CSSProperties}>{src}</div>
      </div>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.05, mixBlendMode: 'multiply', backgroundImage: NOISE, pointerEvents: 'none' }} />
    </div>
  );
};
const K: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ color: ACCENT_INK }}>{children}</span>;
const Nw: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ whiteSpace: 'nowrap' }}>{children}</span>;

const Tx: React.FC<{ x: number; y: number; f?: string; s: number; w?: number; c: string; a?: 'start' | 'middle' | 'end'; ls?: string; o?: number; children: React.ReactNode }> = ({
  x, y, f = FD, s, w = 700, c, a = 'start', ls, o = 1, children,
}) => (
  <text x={x} y={y} fontFamily={f} fontSize={s} fontWeight={w} fill={c} textAnchor={a} letterSpacing={ls} opacity={o}>
    {children}
  </text>
);
const Draw: React.FC<{ d: string; p: number; c: string; w: number; join?: 'round' | 'miter' }> = ({ d, p, c, w, join = 'round' }) =>
  p <= 0 ? null : <path d={d} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin={join} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />;
const Ln: React.FC<{ x1: number; y1: number; x2: number; y2: number; p?: number; c: string; w: number; dash?: string; o?: number }> = ({ x1, y1, x2, y2, p = 1, c, w, dash, o = 1 }) =>
  p <= 0 ? null : <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * p} y2={y1 + (y2 - y1) * p} stroke={c} strokeWidth={w} strokeLinecap="round" strokeDasharray={dash} opacity={o} />;

// ---------------------------------------------------------------------------------------------------------------------
// C2 state A, CH2 65.54-75.10: two cards STACKED
// ---------------------------------------------------------------------------------------------------------------------
export const VC2A: React.FC<{ t: number }> = ({ t }) => {
  const stair = lin(t, 67.16, 68.56);
  const reward = lin(t, 68.56, 71.24);
  const supply = lin(t, 72.02, 72.64);
  const cap = u(t, 72.64, 73.1);
  const capLbl = u(t, 73.1, 73.5);
  return (
    <Page t={t} t0={65.54} ey="THE EMISSION" h={<>It shrinks a little<br /><K>every single month.</K></>} src="Sources: wiki.kaspa.org tokenomics, rusty-kaspa coinbase.rs, api.kaspa.org/info/coinsupply · curves show shape, not scale">
      <rect x={70} y={420} width={940} height={480} rx={22} fill="#FFFFFF" stroke="#DDD9CF" strokeWidth={1.5} filter="url(#shv)" />
      <rect x={70} y={930} width={940} height={790} rx={22} fill="#FFFFFF" stroke="#DDD9CF" strokeWidth={1.5} filter="url(#shv)" />
      <Tx x={110} y={482} s={34} c={SEC} ls="0.1em">A 4-YEAR HALVING</Tx>
      <Tx x={110} y={994} s={34} c={ACCENT_INK} ls="0.1em">KASPA: A SMOOTH HALVING</Tx>
      <Ln x1={130} y1={830} x2={950} y2={830} c={AXIS} w={2.5} />
      <Ln x1={130} y1={1630} x2={950} y2={1630} c={AXIS} w={2.5} />
      <Tx x={950} y={876} s={28} c={MUTED} a="end" ls="0.1em" o={u(t, 67.16, 67.6)}>EVERY 4 YEARS</Tx>
      <Tx x={950} y={1680} s={28} c={ACCENT_INK} a="end" ls="0.1em" o={u(t, 68.56, 69)}>EVERY SINGLE MONTH</Tx>
      <Draw d={V_C2_STAIR} p={stair} c={WIRE} w={7} join="miter" />
      <Draw d={V_C2_REWARD} p={reward} c={ACCENT_INK} w={7} />
      <Tx x={360} y={1470} s={30} c={ACCENT_INK} ls="0.1em" o={u(t, 70.2, 70.7)}>THE BLOCK REWARD</Tx>
      <Draw d={V_C2_SUPPLY} p={supply} c={INK} w={4.5} />
      <Tx x={942} y={1146} s={30} c={INK} a="end" ls="0.1em" o={u(t, 72.4, 72.8)}>TOTAL SUPPLY</Tx>
      {cap > 0 && <line x1={950} y1={1090} x2={950 - 820 * cap} y2={1090} stroke={INK} strokeWidth={3} strokeLinecap="round" strokeDasharray="12 9" />}
      <Tx x={950} y={1068} s={34} c={INK} a="end" o={capLbl}>HARD CAP <tspan fontFamily={FJ}>28.7B</tspan> KAS</Tx>
    </Page>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// C2 state B, CH5 352.68-358.96: the remainder at the BOTTOM of the ring, the leader drops
// ---------------------------------------------------------------------------------------------------------------------
export const VC2B: React.FC<{ t: number }> = ({ t }) => {
  const fill = u(t, 352.68, 354.1);
  const pct = 96.8 * fill;
  const rem = u(t, 356.26, 356.5);
  const leader = u(t, 356.26, 356.6);
  const lands = t >= 356.64;
  const pm = pop110(t - 356.64);
  const C = 2136.28;
  return (
    <Page t={t} t0={352.68} ey="THE EMISSION" h={<>Almost all of it is<br /><K>already mined.</K></>} src={<>Source: api.kaspa.org/info/coinsupply, read <Nw>2026-11-03</Nw></>}>
      <circle cx={540} cy={880} r={340} fill="none" stroke={rem > 0 ? `rgba(20,22,26,${rem})` : 'none'} strokeWidth={112} />
      <circle cx={540} cy={880} r={340} fill="none" stroke="#ECE9E1" strokeWidth={112} opacity={1 - rem} />
      <circle cx={540} cy={880} r={340} fill="none" stroke={ACCENT} strokeWidth={112} strokeDasharray={`${(pct / 100) * C} ${C}`} transform="rotate(95.76 540 880)" />
      <Tx x={540} y={902} f={FJ} s={136} w={600} c={INK} a="middle">{pct.toFixed(1)}%</Tx>
      <Tx x={540} y={976} s={48} c={ACCENT_INK} a="middle" ls="0.1em">MINED</Tx>
      <Ln x1={540} y1={1276} x2={540} y2={1450} p={leader} c={INK} w={3} />
      {lands && (
        <g transform={`translate(540 1560) scale(${pm.s}) translate(-540 -1560)`}>
          <Tx x={540} y={1600} s={56} c={INK} a="middle" ls="0.06em"><tspan fontFamily={FJ} fontSize={124}>912M</tspan> KAS LEFT</Tx>
        </g>
      )}
    </Page>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// C2 state C, CH5 358.96-364.52
// ---------------------------------------------------------------------------------------------------------------------
export const VC2C: React.FC<{ t: number }> = ({ t }) => {
  const axes = u(t, 358.96, 359.2);
  const plateau = u(t, 358.96, 359.3);
  const marker = u(t, 359.04, 359.54);
  const pulse = interpolate(t, [361.38, 361.55, 361.8], [1, 1.1, 1], CL);
  const drop = lin(t, 362.6, 362.92);
  const lands = t >= 362.92;
  const pm = pop110(t - 362.92);
  return (
    <Page t={t} t0={358.96} ey="THE EMISSION" h={<>The November cut took<br />the <K>reward down.</K></>} src="Source: api.kaspa.org/info/halving, blockreward · 1 step shown, axis broken">
      <g opacity={axes}>
        <Ln x1={100} y1={1640} x2={1010} y2={1640} c={AXIS} w={2.5} />
        <Ln x1={100} y1={640} x2={100} y2={1594} c={AXIS} w={2.5} />
        <path d="M84,1594 l32,-12 M84,1610 l32,-12" stroke={AXIS} strokeWidth={2.5} strokeLinecap="round" />
        <Ln x1={100} y1={1610} x2={100} y2={1640} c={AXIS} w={2.5} />
        <Tx x={118} y={662} s={34} c={SEC} ls="0.1em">KAS / BLOCK</Tx>
      </g>
      <path d="M100,1640 L100,900 L540,900 L540,1640 Z" fill="rgba(73,234,203,.20)" opacity={plateau} />
      {drop > 0 && <path d={`M540,1640 L540,1211 L${540 + 470 * drop},1211 L${540 + 470 * drop},1640 Z`} fill="rgba(73,234,203,.20)" />}
      <Draw d="M100,900 L540,900 L540,1211 L1010,1211" p={plateau * 0.3604 + 0.6396 * drop} c={ACCENT_INK} w={8} join="miter" />
      <g transform={`translate(128 860) scale(${pulse}) translate(-128 -860)`}>
        <Tx x={128} y={860} f={FJ} s={150} w={600} c={INK} o={plateau}>2.06</Tx>
      </g>
      <Ln x1={540} y1={1640} x2={540} y2={590} p={marker} c={INK} w={2.5} dash="8 8" />
      <Tx x={540} y={566} s={40} c={INK} a="middle" ls="0.1em" o={marker}>NOVEMBER 4, 2026 CUT</Tx>
      {lands && (
        <g transform={`translate(740 1120) scale(${pm.s}) translate(-740 -1120)`}>
          <Tx x={580} y={1171} f={FJ} s={150} w={600} c={ACCENT_INK}>1.94</Tx>
        </g>
      )}
    </Page>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// C2 state D, CH5 364.52-372.50: the bars stand UP, TRUE scale: the sliver is 2.73 px tall, never raised
// ---------------------------------------------------------------------------------------------------------------------
export const VC2D: React.FC<{ t: number }> = ({ t }) => {
  const count = u(t, 365.3, 366.6);
  const bar = u(t, 368.5, 369.6);
  const row2 = u(t, 368.2, 368.5);
  const chip = u(t, 370.0, 370.6);
  return (
    <Page t={t} t0={364.52} ey="THE EMISSION" hSize={84} h={<>New supply is <K>well under</K><br /><K><span style={{ fontFamily: FJ, fontWeight: 600, letterSpacing: '-.03em' }}>1%</span></K> of what trades.</>} src={<>Sources: api.kaspa.org/info/halving, CoinGecko 24&nbsp;h volume, read <Nw>2026-11-03</Nw> · KAS at 0.031 dollars</>}>
      <Tx x={70} y={544} s={44} c={ACCENT_INK}><tspan fontFamily={FJ}>{(1.68 * count).toFixed(2)}M</tspan> KAS A DAY</Tx>
      <Tx x={70} y={588} s={30} c={SEC} ls="0.1em">NEW SUPPLY</Tx>
      <rect x={70} y={610} width={440} height={1050} rx={12} fill="#ECE9E1" stroke="#DDD9CF" strokeWidth={1} />
      <rect x={70} y={1660 - 2.73 * count} width={440} height={2.73 * count} fill={ACCENT_INK} />
      <g opacity={row2}>
        <Tx x={570} y={588} s={42} c={INK}><tspan fontFamily={FJ}>$20M</tspan> A DAY TRADED</Tx>
        <rect x={570} y={610} width={440} height={1050} rx={12} fill="#ECE9E1" stroke="#DDD9CF" strokeWidth={1} />
        <Tx x={70} y={1722} s={28} c={SEC} ls="0.1em">BARS DRAWN BY VALUE, AT THESE PRICES</Tx>
      </g>
      {bar > 0 && <rect x={570} y={1660 - 1050 * bar} width={440} height={1050 * bar} rx={12} fill={INK} />}
      <g opacity={chip} transform={`translate(0 ${(1 - chip) * -30})`}>
        <rect x={62} y={1644} width={456} height={24} rx={6} fill="none" stroke={ACCENT} strokeWidth={5} />
        <line x1={290} y1={1510} x2={290} y2={1616} stroke={ACCENT_INK} strokeWidth={5} />
        <polygon points="290.0,1634.0 278.7,1612.8 301.3,1612.8" fill={ACCENT_INK} />
        <rect x={90} y={1434} width={400} height={76} rx={38} fill="#FFFFFF" stroke={ACCENT_INK} strokeWidth={2.5} />
        <Tx x={290} y={1486.4} s={40} c={ACCENT_INK} a="middle" ls="0.06em">WELL UNDER 1%</Tx>
      </g>
    </Page>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// C3 hash rate, CH5 375.76-386.74: the axis on top, the zoom card BELOW; the axis rests 270 px lower until the rise
// ---------------------------------------------------------------------------------------------------------------------
const C3_ACC = 'M823.3,893.5 L870.0,892.1 L916.7,883.7 L963.3,873.4';
const C3_Z = 'M170.0,1563.2 L416.7,1552.0 L663.3,1483.5 L910.0,1401.5';
const C3_PTS: [number, number, string, string][] = [
  [170, 1563.2, '314', INK],
  [416.7, 1552, '317', INK],
  [663.3, 1483.5, '335', INK],
  [910, 1401.5, '357', ACCENT_INK],
];
const C3_CUTS: [number, string][] = [[416.7, 'AUG CUT'], [663.3, 'SEP CUT'], [910, 'OCT CUT']];
const C3_TICKS: [number, string][] = [[170, 'MAY'], [310, 'AUG'], [450, 'NOV'], [543.3, 'JAN'], [683.3, 'APR'], [823.3, 'JUL'], [963.3, 'OCT']];
export const VC3: React.FC<{ t: number }> = ({ t }) => {
  const grey = lin(t, 376.04, 380.38);
  const acc = lin(t, 381.78, 383.62);
  const card = u(t, 381.78, 382.3);
  const rest = interpolate(t, [381.78, 382.28], [270, 0], { ...CL, easing: easeOut });
  const zl = lin(t, 382.12, 384.2);
  const pop = t >= 385.62 ? pop110(t - 385.62).s / 1.1 : 0;
  return (
    <Page t={t} t0={375.76} ey="HASH RATE · MONTHLY AVERAGE" h={<>It fell, then<br /><K>rose through the cuts.</K></>} src={<>Source: api.kaspa.org/info/hashrate/history, monthly averages, read <Nw>2026-11-03</Nw> · dotted NOV = 1st to 3rd only</>}>
      <g transform={`translate(0 ${rest})`}>
        {[[853.3, '400'], [666.7, '800'], [480, '1,200']].map(([y, l]) => (
          <React.Fragment key={String(l)}>
            <line x1={170} y1={Number(y)} x2={1010} y2={Number(y)} stroke={GRID} strokeWidth={1.5} strokeLinecap="round" strokeDasharray="4 8" />
            <Tx x={152} y={Number(y) + 10} f={FJ} s={28} w={600} c={MUTED} a="end">{l}</Tx>
          </React.Fragment>
        ))}
        <Tx x={152} y={1050} f={FJ} s={28} w={600} c={MUTED} a="end">0</Tx>
        <Ln x1={170} y1={1040} x2={1010} y2={1040} c={AXIS} w={2.5} />
        <Tx x={70} y={452} s={28} c={MUTED} ls="0.1em">PH/S</Tx>
        {C3_TICKS.map(([x, l]) => <Tx key={l} x={x} y={1082} f={FJ} s={26} w={600} c={MUTED} a="middle">{l}</Tx>)}
        <Tx x={170} y={1116} f={FJ} s={26} w={600} c={MUTED} a="middle">2025</Tx>
        <Tx x={543.3} y={1116} f={FJ} s={26} w={600} c={MUTED} a="middle">2026</Tx>
        <Draw d={V_C3_GREY} p={grey} c={WIRE} w={6} />
        {grey > 0 && <circle cx={170} cy={547.67} r={10} fill="#FFFFFF" stroke={WIRE} strokeWidth={4} />}
        <Tx x={192} y={535.7} f={FJ} s={38} w={600} c={SEC} o={u(t, 376.04, 376.4)}>1,055</Tx>
        {grey >= 1 && <circle cx={823.33} cy={893.47} r={10} fill="#FFFFFF" stroke={WIRE} strokeWidth={4} />}
        <g opacity={u(t, 376.62, 377)}>
          <Tx x={1010} y={559.3} s={42} c={SEC} a="end">FELL AROUND <tspan fontFamily={FJ}>70%</tspan></Tx>
          <Tx x={1010} y={605.3} s={28} c={MUTED} a="end" ls="0.1em">MAY 2025 TO JULY 2026</Tx>
        </g>
        <Draw d={C3_ACC} p={acc} c={ACCENT_INK} w={7} />
        {acc >= 1 && <line x1={963.3} y1={873.4} x2={1010} y2={871.5} stroke={WIRE} strokeWidth={4} strokeLinecap="round" strokeDasharray="4 8" />}
      </g>
      {card >= 1 && <line x1={870} y1={908.1} x2={870} y2={1140} stroke={ACCENT_INK} strokeWidth={2} strokeLinecap="round" strokeDasharray="3 7" />}
      {card > 0 && (
        <g opacity={card} transform={`translate(870 1140) scale(${0.2 + 0.8 * card}) translate(-870 -1140)`}>
          <rect x={70} y={1140} width={940} height={560} rx={22} fill="#FFFFFF" stroke={ACCENT_INK} strokeWidth={2.5} filter="url(#shv)" />
          <Tx x={978} y={1198} s={24} c={MUTED} a="end" ls="0.1em">ZOOMED</Tx>
          <Ln x1={130} y1={1616} x2={950} y2={1616} c={AXIS} w={2} />
          <Tx x={170} y={1666} s={28} c={MUTED} a="middle" ls="0.1em">JUL</Tx>
          {zl > 0 && (
            <>
              <clipPath id="vc3zc"><rect x={170} y={1380} width={740 * zl} height={240} /></clipPath>
              <path d="M170.0,1563.2 L416.7,1552.0 L663.3,1483.5 L910.0,1401.5 L910.0,1616 L170.0,1616 Z" fill="rgba(73,234,203,.20)" clipPath="url(#vc3zc)" />
            </>
          )}
          <Draw d={C3_Z} p={zl} c={ACCENT_INK} w={7} />
          {C3_PTS.map(([x, y, l, c], i) =>
            zl >= i / 3 ? (
              <React.Fragment key={l}>
                <circle cx={x} cy={y} r={10} fill="#FFFFFF" stroke={ACCENT_INK} strokeWidth={4} />
                <Tx x={x} y={y - 26} f={FJ} s={38} w={600} c={c} a="middle">{l}</Tx>
              </React.Fragment>
            ) : null,
          )}
          {C3_CUTS.map(([x, l], i) =>
            t >= 384.5 + i * 0.22 ? (
              <React.Fragment key={l}>
                <line x1={x} y1={1604} x2={x} y2={1628} stroke={ACCENT_INK} strokeWidth={4} strokeLinecap="round" />
                <Tx x={x} y={1666} s={28} c={ACCENT_INK} a="middle" ls="0.1em">{l}</Tx>
              </React.Fragment>
            ) : null,
          )}
          {pop > 0 && (
            <g transform={`translate(106 1230) scale(${pop}) translate(-106 -1230)`}>
              <Tx x={106} y={1216} s={58} c={ACCENT_INK}>AROUND <tspan fontFamily={FJ}>+14%</tspan></Tx>
              <Tx x={106} y={1266} s={30} c={SEC} ls="0.1em">JULY AVG TO OCTOBER AVG</Tx>
            </g>
          )}
        </g>
      )}
    </Page>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// C4 user transactions, CH5 386.74-392.14: the same plot stretched tall
// ---------------------------------------------------------------------------------------------------------------------
export const VC4: React.FC<{ t: number }> = ({ t }) => {
  const line = lin(t, 387.18, 391.5);
  const band = u(t, 388.64, 389.1);
  const lbl = t >= 388.64 ? pop110(t - 388.64).s / 1.1 : 0;
  const note = u(t, 391.26, 391.6);
  return (
    <Page t={t} t0={386.74} ey="USER TRANSACTIONS A DAY · NON-COINBASE" h={<>User transactions,<br /><K>flat.</K></>} src="Source: api.kaspa.org/transactions/count, regular transactions summed by UTC day, July 1 to November 3, 2026">
      {[[1202.9, '100K'], [795.7, '200K']].map(([y, l]) => (
        <React.Fragment key={String(l)}>
          <line x1={150} y1={Number(y)} x2={1010} y2={Number(y)} stroke={GRID} strokeWidth={1.5} strokeLinecap="round" strokeDasharray="4 8" />
          <Tx x={136} y={Number(y) + 10} f={FJ} s={28} w={600} c={MUTED} a="end">{l}</Tx>
        </React.Fragment>
      ))}
      <Tx x={136} y={1620} f={FJ} s={28} w={600} c={MUTED} a="end">0</Tx>
      <Ln x1={150} y1={1610} x2={1010} y2={1610} c={AXIS} w={2.5} />
      {([[150, 'JUL', 156, 'start'], [363.3, 'AUG', 369.3, 'start'], [576.6, 'SEP', 582.6, 'start'], [783, 'OCT', 789, 'start'], [996.2, 'NOV', 996.2, 'end']] as [number, string, number, 'start' | 'end'][]).map(([x, l, tx, a]) => (
        <React.Fragment key={l}>
          <Ln x1={x} y1={1610} x2={x} y2={1622} c={AXIS} w={2.5} />
          <Tx x={tx} y={1656} f={FJ} s={28} w={600} c={MUTED} a={a}>{l}</Tx>
        </React.Fragment>
      ))}
      <g opacity={band}>
        <rect x={150} y={1284.3} width={860} height={40.7} fill={ACCENT} fillOpacity={0.55} />
        <Ln x1={150} y1={1284.3} x2={1010} y2={1284.3} c={ACCENT_INK} w={2.5} />
        <Ln x1={150} y1={1325} x2={1010} y2={1325} c={ACCENT_INK} w={2.5} />
      </g>
      <Draw d={V_C4_PATH} p={line} c={INK} w={3.5} />
      {lbl > 0 && (
        <g transform={`translate(454 1508) scale(${lbl}) translate(-454 -1508)`}>
          <rect x={174} y={1470} width={560} height={76} rx={14} fill="#FFFFFF" stroke={ACCENT_INK} strokeWidth={2.5} />
          <Tx x={454} y={1522} s={42} c={ACCENT_INK} a="middle"><tspan fontFamily={FJ}>70K</tspan> TO <tspan fontFamily={FJ}>80K</tspan> A DAY</Tx>
        </g>
      )}
      <g opacity={note}>
        <Tx x={648.9} y={586.2} s={34} c={SEC} a="end" ls="0.1em">SPIKE DAYS</Tx>
        <Tx x={648.9} y={630.2} s={26} c={MUTED} a="end" ls="0.1em">MOST AUGUST AND</Tx>
        <Tx x={648.9} y={666.2} s={26} c={MUTED} a="end" ls="0.1em">SEPTEMBER DAYS RAN</Tx>
        <Tx x={648.9} y={702.2} s={26} c={MUTED} a="end" ls="0.1em">ABOVE THE BAND</Tx>
      </g>
    </Page>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// C17 holders per token, CH5 392.14-400.50: 27 x 17 = 459 dots filled by column, the holder bars BELOW (800 px = 437 holders)
// ---------------------------------------------------------------------------------------------------------------------
const C17_V: [number, number, number][] = Array.from({ length: 459 }, (_, i) => {
  const col = Math.floor(i / 17);
  const row = i % 17;
  return [87.4 + 34.8 * col, 503.4 + 34.8 * row, i < 276 ? 0 : i >= 450 ? 2 : 1];
});
export const VC17: React.FC<{ t: number }> = ({ t }) => {
  const dark = lin(t, 394.34, 394.8);
  const accent = lin(t, 396.22, 396.5);
  const medBar = u(t, 394.34, 395.5);
  const nacho = u(t, 397.92, 399.14);
  const top = u(t, 399.14, 399.6);
  return (
    <Page t={t} t0={392.14} ey="AROUND 460 TOKENS ON LAYER 1" h={<>The typical token<br />has <K><span style={{ fontFamily: FJ, fontWeight: 600, letterSpacing: '-.03em' }}>2</span> holders.</K></>} src={<>Source: kascov.io tokens.json, 459 tokens, read <Nw>2026-11-03</Nw> 22:44 UTC</>}>
      <Tx x={70} y={464} s={28} c={MUTED} ls="0.1em">EVERY DOT IS ONE TOKEN</Tx>
      {C17_V.map(([x, y, k], i) => {
        const at = 392.7 + (i / 459) * 0.82;
        if (t < at) return null;
        const sc = interpolate(t, [at, at + 0.1], [0, 1], CL);
        let fill = '#CFCBC0';
        if (k === 0 && dark >= i / 276) fill = WIRE;
        const lit = k === 2 && accent > 0;
        return <circle key={i} cx={x} cy={y} r={13.2 * sc} fill={lit ? ACCENT : fill} stroke={lit ? ACCENT_INK : undefined} strokeWidth={lit ? 2.5 : undefined} />;
      })}
      <g opacity={u(t, 394.34, 394.7)}>
        <path d="M70,1087.6 V1103.6 H658.1 V1087.6" fill="none" stroke={SEC} strokeWidth={2.5} strokeLinecap="round" />
        <Tx x={70} y={1161.6} s={34} c={INK}><tspan fontFamily={FJ} fontSize={56}>276</tspan> AT <tspan fontFamily={FJ} fontSize={40}>2</tspan> OR FEWER</Tx>
      </g>
      <g opacity={u(t, 396.22, 396.6)}>
        <path d="M974.8,1087.6 V1103.6 H1009.6 V1087.6" fill="none" stroke={ACCENT_INK} strokeWidth={3} strokeLinecap="round" />
        <Tx x={1009.6} y={1161.6} s={34} c={ACCENT_INK} a="end"><tspan fontFamily={FJ} fontSize={56}>9</tspan> ABOVE <tspan fontFamily={FJ} fontSize={40}>100</tspan></Tx>
      </g>
      <Tx x={70} y={1220} s={28} c={MUTED} ls="0.1em">HOLDERS PER TOKEN</Tx>
      <Tx x={70} y={1272} s={34} c={INK} ls="0.1em">MEDIAN TOKEN</Tx>
      <rect x={70} y={1288} width={800} height={72} rx={6} fill="#ECE9E1" />
      {medBar > 0 && <rect x={70} y={1288} width={3.7 * medBar} height={72} rx={3} fill={SEC} />}
      <Tx x={89.7} y={1344} f={FJ} s={54} w={600} c={SEC} o={u(t, 395.2, 395.5)}>2</Tx>
      <Tx x={70} y={1440} s={34} c={INK} ls="0.1em">NACHO</Tx>
      <rect x={70} y={1456} width={800} height={72} rx={6} fill="#ECE9E1" />
      {nacho > 0 && <rect x={70} y={1456} width={649.9 * nacho} height={72} rx={3} fill={ACCENT_INK} />}
      {nacho > 0 && <Tx x={70 + 649.9 * nacho + 16} y={1512} f={FJ} s={54} w={600} c={ACCENT_INK}>{Math.round(355 * nacho)}</Tx>}
      <Tx x={70} y={1608} s={34} c={INK} ls="0.1em">TOP TOKEN</Tx>
      <rect x={70} y={1624} width={800} height={72} rx={6} fill="#ECE9E1" />
      {top > 0 && <rect x={70} y={1624} width={800 * top} height={72} rx={3} fill={WIRE} />}
      {top > 0 && <Tx x={70 + 800 * top + 16} y={1680} f={FJ} s={54} w={600} c={SEC}>{Math.round(437 * top)}</Tx>}
    </Page>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// kt-caption-highlight, restyled for the portrait frame: wraps inside the 1080 width, above the phone's bottom UI
// ---------------------------------------------------------------------------------------------------------------------
const CAP_SHADOW = '5px 6px 10px rgba(0,0,0,0.62), 2px 3px 3px rgba(0,0,0,0.45)';
export const V_CAP_BOTTOM = 330;

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

export const VCaptionLine: React.FC<{ p: KtPhrase; t: number; narrow?: boolean }> = ({ p, t, narrow }) => {
  const dt = t - p.t;
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
    <div style={{ position: 'absolute', left: narrow ? 14 : 50, width: narrow ? 458 : 980, bottom: V_CAP_BOTTOM, textAlign: 'center', ...stretch }}>
      <span style={{ fontFamily: KT_FONT, fontWeight: 800, fontStyle: 'italic', fontSize: narrow ? 50 : 74, lineHeight: 1.12, color: '#FFFFFF', textShadow: CAP_SHADOW, letterSpacing: '0.005em' }}>
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

/** two_colour_pop_variant, portrait: the 110 jiggle, centred at about 75 percent height */
export const VTwoColourPop: React.FC<{ t: number; t0: number; lines: string[]; size?: number; pitch?: number }> = ({ t, t0, lines, size = 112, pitch = 120 }) => {
  const render = (ts: number) => {
    const pm = pop110(ts - t0);
    return (
      <At x={540} y={1460} s={pm.s} rot={pm.rot}>
        <KtTextBlock lines={lines} style={{ font: KT_FONT, fontWeight: 800, fontStyle: 'italic', fontSize: size, lineHeight: pitch, color: '#FFFFFF', keyColor: ACCENT, shadow: CAP_SHADOW }} />
      </At>
    );
  };
  return <ShutterBlur t={t} t0={t0} fps={30} angle={360} samples={8} active={t - t0 < POP110_DUR + 0.04} render={render} />;
};

/** kt-keyword-pop for a LIGHT cover, portrait placement */
export const VLightPop: React.FC<{ t: number; t0: number; t1: number; lines: string[]; x?: number; y?: number; size?: number }> = ({ t, t0, t1, lines, x = 540, y = 1520, size = 96 }) => {
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

/** kt-keyword-pop chip, portrait: rises from below the frame with a small bounce */
export const VChip: React.FC<{ t: number; t0: number; t1: number; text: string; x?: number; y?: number; size?: number }> = ({ t, t0, t1, text, x = 540, y = 1640, size = 62 }) => {
  if (t < t0 || t >= t1) return null;
  const dy = interpolate(t - t0, [0, 0.35], [1, 0], { ...CL, easing: Easing.bezier(0.46, 0, 0.41, 1) }) * (1920 - y + 90);
  const dip = interpolate(t - t0, [0, 0.19, 0.383], [0, 1, 0], CL) * 0.023 * 80;
  return (
    <div style={{ position: 'absolute', left: x, top: y + dy + dip, transform: 'translate(-50%,-50%)', background: ACCENT, padding: '12px 34px', borderRadius: 6, fontFamily: KT_FONT, fontWeight: 800, fontStyle: 'italic', fontSize: size, lineHeight: 1.1, color: INK, whiteSpace: 'nowrap' }}>
      {text}
    </div>
  );
};

/** kt-stacked-list-over-broll, portrait: the headline pops, each item pops under the last on its word, all staying */
export const VStack: React.FC<{ t: number; t0: number; t1: number; head: string[]; items: { t: number; lines: string[]; y: number }[]; headY: number; headSize?: number; itemSize?: number }> = ({ t, t0, t1, head, items, headY, headSize = 112, itemSize = 84 }) => {
  if (t < t0 || t >= t1) return null;
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
            <At x={540} y={headY} s={q.s} rot={q.rot}>
              <KtTextBlock lines={head} style={{ font: KT_FONT, fontWeight: 800, fontStyle: 'italic', fontSize: headSize, lineHeight: headSize * 1.05, color: ACCENT, shadow: CAP_SHADOW }} />
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
          <div key={i} style={{ position: 'absolute', left: 540, top: it.y, width: 'max-content', transform: `translate(-50%,-50%) scale(${s}) skew(${sk}deg)` }}>
            <KtTextBlock lines={it.lines} style={{ font: KT_FONT, fontWeight: 800, fontStyle: 'italic', fontSize: itemSize, lineHeight: itemSize * 1.08, color: '#FFFFFF', shadow: CAP_SHADOW }} />
          </div>
        );
      })}
    </>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// the text wall: the native 1080x1920 template render (NOTES.md: no letterbox, no 1.1 scale, it MOVES), EARLY pops at dt 1.9
// ---------------------------------------------------------------------------------------------------------------------
export const VWall: React.FC<{ dt: number }> = ({ dt }) => {
  const tEarly = 1.9;
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#000', overflow: 'hidden' }}>
      <OffthreadVideo src={staticFile('overlays/text-wall-motion.mp4')} muted style={{ position: 'absolute', inset: 0, width: 1080, height: 1920 }} />
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
                <Img src={staticFile('card-slides/text-wall-early-alpha.png')} style={{ position: 'absolute', inset: 0, width: 1080, height: 1920 }} />
              </div>
            );
          }}
        />
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// the textured devices, portrait: the same timing as the shared engines' rows, the geometry for 1080x1920
// ---------------------------------------------------------------------------------------------------------------------
const TEX = { w: 3413, h: 1920, loop: 60 };
const PAPER = { w: 3413, h: 1920, loop: 32.3 };
const LoopVideo: React.FC<{ src: string; dt: number; loop: number; style: React.CSSProperties }> = ({ src, dt, loop, style }) => (
  <Sequence from={0} layout="none">
    <Freeze frame={Math.floor(((Math.max(0, dt) % loop) * 30))}>
      <OffthreadVideo src={staticFile(src)} muted style={style} />
    </Freeze>
  </Sequence>
);

export const V_PANEL_W = 594;
/** kt-side-panel dark, portrait: 594 px (55 percent), full height, slides from off-screen in 0.50 s; the text rises 0.23 s later, then hovers */
export const VSidePanelDark: React.FC<{ t: number; t0: number; t1: number; side: 'L' | 'R'; lines: string[]; fontSize: number; pitch: number; y?: number; seed?: number }> = ({ t, t0, t1, side, lines, fontSize, pitch, y = 880, seed = 0 }) => {
  if (t < t0 || t >= t1) return null;
  const dt = t - t0;
  const slide = interpolate(dt, [0, 0.5], [1, 0], { ...CL, easing: ktEaseOut });
  const x0 = side === 'R' ? 1080 - V_PANEL_W : 0;
  const off = (side === 'R' ? 1 : -1) * V_PANEL_W * slide;
  const tText = t0 + 0.23;
  const block = <KtTextBlock lines={lines} style={{ font: KT_FONT, fontWeight: 800, fontStyle: 'italic', fontSize, lineHeight: pitch, color: '#FFFFFF', keyColor: ACCENT, shadow: CAP_SHADOW }} />;
  const render = (ts: number) => {
    const tr = ts - tText;
    const r = riseIn(tr);
    const hv = hover(tr - RISE.dur, seed + t0);
    return (
      <At x={x0 + V_PANEL_W / 2} y={y} dx={hv.x} dy={r.y + hv.y} s={r.s} rot={hv.rot}>
        {block}
      </At>
    );
  };
  return (
    <>
      <div style={{ position: 'absolute', top: 0, left: x0 + off, width: V_PANEL_W, height: 1920, overflow: 'hidden' }}>
        <LoopVideo src="effects-kt/animated-texture.mp4" dt={dt} loop={TEX.loop} style={{ position: 'absolute', left: side === 'R' ? -1900 : -800, top: 0, width: TEX.w, height: TEX.h }} />
      </div>
      {t >= tText && <ShutterBlur t={t} t0={tText} fps={30} angle={360} samples={24} active={t - tText < RISE.dur + 0.04} render={render} />}
    </>
  );
};

/** kt-side-panel paper, portrait, always RIGHT: LINEAR slide in 0.233 s; carries the C26 receipt on a card (real pixels, the comp's highlight) */
export const VC26Panel: React.FC<{ t: number; t0: number; t1: number }> = ({ t, t0, t1 }) => {
  if (t < t0 || t >= t1) return null;
  const dt = t - t0;
  const left = interpolate(dt, [0, 0.233], [1100, 1080 - V_PANEL_W], CL);
  const p = interpolate(dt, [0.4, 4.3], [0, 1], CL);
  const CARD = { w: V_PANEL_W - 60, h: 540 };
  const k = (CARD.w / 680) * (1 + 0.03 * p); // capture x 60 to 740 (Coin, Price Change, Multipliers) fills the card
  return (
    <div style={{ position: 'absolute', left, top: 0, width: V_PANEL_W, height: 1920, overflow: 'hidden' }}>
      <LoopVideo src="effects-kt/paper-crumpled.mp4" dt={dt} loop={PAPER.loop} style={{ position: 'absolute', left: -1400, top: 0, width: PAPER.w, height: PAPER.h }} />
      <div style={{ position: 'absolute', left: 30, top: 610, width: CARD.w, height: CARD.h, overflow: 'hidden', borderRadius: 14, boxShadow: '0 18px 44px rgba(0,0,0,.42)', background: '#0d0d1f' }}>
        <div style={{ position: 'absolute', left: -60 * k, top: -410 * k, width: 1080 * k, height: 1920 * k }}>
          <Img src={staticFile('receipts/C26-cryptorich-showcase.png')} style={{ width: '100%', height: '100%' }} />
          <div style={{ position: 'absolute', left: 60 * k, top: 792 * k, width: 960 * k, height: 80 * k, background: 'rgba(255,225,77,.28)', outline: '3px solid #ffe14d', borderRadius: 3 }} />
        </div>
      </div>
    </div>
  );
};

export const V_BAND_TOP = 1380;
/** kt-lower-third-band, portrait: slides up in 0.27 s ease-out, the text pops 0.13 s later, then hovers; the comp's next cut removes it */
export const VBand: React.FC<{ t: number; t0: number; t1: number; lines: string[]; fontSize: number; pitch: number; y: number; seed?: number }> = ({ t, t0, t1, lines, fontSize, pitch, y, seed = 0 }) => {
  if (t < t0 || t >= t1) return null;
  const dt = t - t0;
  const top = interpolate(dt, [0, 0.27], [1920, V_BAND_TOP], { ...CL, easing: ktEaseOut });
  const tText = t0 + 0.13;
  const block = <KtTextBlock lines={lines} style={{ font: KT_FONT, fontWeight: 800, fontStyle: 'italic', fontSize, lineHeight: pitch, color: '#FFFFFF', keyColor: ACCENT, shadow: CAP_SHADOW }} />;
  const render = (ts: number) => {
    const d = ts - tText;
    const pm = pop110(d);
    const hv = hover(d - POP110_DUR, seed + tText);
    return (
      <At x={540} y={y} dx={hv.x} dy={hv.y} s={pm.s} rot={pm.rot + hv.rot}>
        {block}
      </At>
    );
  };
  return (
    <>
      <div style={{ position: 'absolute', left: 0, top, width: 1080, height: 1920 - V_BAND_TOP + 60, overflow: 'hidden' }}>
        <LoopVideo src="effects-kt/animated-texture.mp4" dt={dt} loop={TEX.loop} style={{ position: 'absolute', left: -1100, top: 0, width: TEX.w, height: TEX.h }} />
      </div>
      {t >= tText && <ShutterBlur t={t} t0={tText} fps={30} angle={360} samples={8} active={t - tText < POP110_DUR + 0.04} render={render} />}
    </>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// the stickers, portrait
// ---------------------------------------------------------------------------------------------------------------------
export const VStickerKaspa: React.FC<{ t: number; t0: number; t1: number }> = ({ t, t0, t1 }) =>
  t < t0 || t >= t1 ? null : <Img src={staticFile('overlays/kaspa-logo.png')} style={{ position: 'absolute', left: 740, top: 220, width: 270, height: 270, borderRadius: '50%', boxShadow: '0 14px 40px rgba(0,0,0,.45)' }} />;
export const VStickerDiscord: React.FC<{ t: number; t0: number; t1: number }> = ({ t, t0, t1 }) =>
  t < t0 || t >= t1 ? null : (
    <div style={{ position: 'absolute', left: 740, top: 220, width: 270, height: 270, borderRadius: '50%', background: '#5865F2', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 14px 40px rgba(0,0,0,.45)' }}>
      <svg viewBox="0 0 24 24" width="66%" height="66%" fill="#FFFFFF">
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
      </svg>
    </div>
  );

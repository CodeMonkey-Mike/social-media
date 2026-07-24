import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadDMSans } from '@remotion/google-fonts/DMSans';
import { loadFont as loadJetBrains } from '@remotion/google-fonts/JetBrainsMono';
loadPlayfair('normal', { weights: ['700', '900'], subsets: ['latin'], ignoreTooManyRequestsWarning: true });
loadDMSans('normal', { weights: ['400', '600', '700'], subsets: ['latin'], ignoreTooManyRequestsWarning: true });
loadJetBrains('normal', { weights: ['600', '700'], subsets: ['latin'], ignoreTooManyRequestsWarning: true });

// Animated data charts for the zebec comp (charts.md: code-built, draw/count via useCurrentFrame; never a PNG+wipe).
// Frame is Sequence-relative (0 at the cover's tIn).
const ease = Easing.out(Easing.cubic);
const BG = '#0a0c10', TEXT = '#e8eaf0', SEC = '#8892a4', MUT = '#505a6e';
const GREEN = '#00e68a', CYAN = '#00c2ff', GOLD = '#ffd700', BORDER = '#1e2330';
const SERIF = "'Playfair Display', Georgia, serif";
const SANS = "'DM Sans', system-ui, sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const Eyebrow: React.FC<{ ey: string; head: React.ReactNode; f: number }> = ({ ey, head, f }) => {
  const o = interpolate(f, [0, 10], [0, 1], clamp);
  const y = interpolate(f, [0, 12], [18, 0], { ...clamp, easing: ease });
  return (
    <div style={{ opacity: o, transform: `translateY(${y}px)` }}>
      <div style={{ fontFamily: SANS, fontSize: 27, fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', color: MUT, marginBottom: 24 }}>{ey}</div>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 78, lineHeight: 1.07, letterSpacing: '-.02em', color: TEXT }}>{head}</div>
      <div style={{ width: 66, height: 4, borderRadius: 2, background: `linear-gradient(90deg, ${GREEN}, ${CYAN})`, margin: '30px 0' }} />
    </div>
  );
};

// ---- demand-vs-float: draw-on curves, price kinks vertical on "it moves fast" ----
export const DemandVsFloat: React.FC = () => {
  const f = useCurrentFrame();
  const floatP = interpolate(f, [18, 40], [0, 1], clamp);        // fixed float line draws
  const demP = interpolate(f, [40, 110], [0, 1], clamp);          // demand curve draws
  const priceP = interpolate(f, [95, 165], [0, 1], clamp);        // price line draws + kinks
  const fastO = interpolate(f, [150, 168], [0, 1], clamp);        // "it moves fast" pops
  const driftO = interpolate(f, [120, 135], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: BG, flexDirection: 'column', justifyContent: 'center', padding: '0 140px' }}>
      <Eyebrow ey="Demand rising against a supply that cannot grow" f={f}
        head={<>When demand meets a <span style={{ color: CYAN }}>fixed float</span></>} />
      <div style={{ fontFamily: SANS, fontSize: 27, color: SEC, marginTop: -10, marginBottom: 20, opacity: interpolate(f, [8, 20], [0, 1], clamp) }}>conceptual, not a price prediction</div>
      <svg viewBox="0 0 1400 620" width="100%" style={{ maxWidth: 1600 }}>
        <line x1="120" y1="560" x2="1340" y2="560" stroke={BORDER} strokeWidth={2} />
        <line x1="120" y1="40" x2="120" y2="560" stroke={BORDER} strokeWidth={2} />
        <text x="1180" y="600" fill={MUT} fontFamily={SANS} fontSize={22}>time / adoption &#8594;</text>
        {/* fixed float dashed */}
        <line x1="120" y1="380" x2="1340" y2="380" stroke={CYAN} strokeWidth={3} strokeDasharray="10 8"
          pathLength={1} strokeDashoffset={0} opacity={floatP} />
        <text x="150" y="362" fill={CYAN} fontFamily={MONO} fontSize={22} fontWeight={600} opacity={floatP}>FIXED FLOAT — 100B, no more unlocks</text>
        {/* demand curve draw-on */}
        <path d="M 120 510 C 480 495, 760 420, 980 320 C 1120 255, 1230 185, 1340 130" fill="none" stroke={GREEN} strokeWidth={4}
          pathLength={1} strokeDasharray={1} strokeDashoffset={1 - demP} />
        <text x="1010" y="300" fill={GREEN} fontFamily={SANS} fontSize={24} fontWeight={700} opacity={interpolate(f, [95, 108], [0, 1], clamp)}>DEMAND</text>
        {/* price line draw-on, kinks vertical */}
        <path d="M 120 540 C 500 535, 900 515, 1080 490 L 1150 230 L 1180 90" fill="none" stroke={GOLD} strokeWidth={4}
          pathLength={1} strokeDasharray={1} strokeDashoffset={1 - priceP} />
        <text x="1120" y="80" fill={GOLD} fontFamily={SANS} fontSize={24} fontWeight={700} opacity={interpolate(f, [150, 162], [0, 1], clamp)}>PRICE</text>
        <text x="1000" y="430" fill={SEC} fontFamily={SANS} fontSize={27} opacity={driftO}>it doesn't drift up.</text>
        <text x="1000" y="466" fill={GOLD} fontFamily={SERIF} fontSize={30} fontWeight={800} opacity={fastO}>it moves fast.</text>
      </svg>
    </AbsoluteFill>
  );
};

// ---- buyback-flywheel: ring diagram, nodes fade in then arrows draw around clockwise ----
const FNode: React.FC<{ f: number; delay: number; x: number; y: number; w: number; t: string; s: string; tc?: string }> =
  ({ f, delay, x, y, w, t, s, tc = TEXT }) => {
    const o = interpolate(f, [delay, delay + 10], [0, 1], clamp);
    const sc = interpolate(f, [delay, delay + 12], [0.9, 1], { ...clamp, easing: ease });
    return (
      <g opacity={o} transform={`translate(${x + w / 2} ${y + 48}) scale(${sc}) translate(${-(x + w / 2)} ${-(y + 48)})`}>
        <rect x={x} y={y} width={w} height={96} rx={16} fill="#12151c" stroke={BORDER} strokeWidth={1.5} />
        <text x={x + w / 2} y={y + 42} fill={tc} fontFamily={SANS} fontWeight={700} fontSize={30} textAnchor="middle">{t}</text>
        <text x={x + w / 2} y={y + 74} fill={SEC} fontFamily={SANS} fontSize={21} textAnchor="middle">{s}</text>
      </g>
    );
  };
export const BuybackFlywheel: React.FC = () => {
  const f = useCurrentFrame();
  const arc = (d: number) => interpolate(f, [d, d + 22], [0, 1], clamp);
  const a1 = arc(46), a2 = arc(62), a3 = arc(78), a4 = arc(94);
  const cO = interpolate(f, [18, 32], [0, 1], clamp);
  const pulse = 1 + 0.03 * Math.sin((f / 30) * Math.PI * 2 * 0.5);
  return (
    <AbsoluteFill style={{ background: BG, flexDirection: 'column', justifyContent: 'center', padding: '0 140px' }}>
      <Eyebrow ey="A real company, feeding a shrinking token" f={f}
        head={<>The <span style={{ color: GREEN }}>buyback flywheel</span></>} />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <svg viewBox="0 0 1200 760" width="760">
          <defs><marker id="fmk" markerWidth="12" markerHeight="12" refX="8" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill={GREEN} /></marker></defs>
          <path d="M 640 150 A 280 280 0 0 1 880 430" fill="none" stroke={GREEN} strokeWidth={3.5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - a1} markerEnd={a1 > 0.98 ? 'url(#fmk)' : undefined} />
          <path d="M 860 500 A 280 280 0 0 1 470 620" fill="none" stroke={GREEN} strokeWidth={3.5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - a2} markerEnd={a2 > 0.98 ? 'url(#fmk)' : undefined} />
          <path d="M 330 560 A 280 280 0 0 1 320 300" fill="none" stroke={GREEN} strokeWidth={3.5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - a3} markerEnd={a3 > 0.98 ? 'url(#fmk)' : undefined} />
          <path d="M 360 250 A 280 280 0 0 1 560 152" fill="none" stroke={GREEN} strokeWidth={3.5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - a4} markerEnd={a4 > 0.98 ? 'url(#fmk)' : undefined} />
          <g opacity={cO} transform={`translate(600 400) scale(${pulse}) translate(-600 -400)`}>
            <circle cx={600} cy={400} r={118} fill="rgba(0,230,138,.08)" stroke="rgba(0,230,138,.4)" strokeWidth={1.5} />
            <text x={600} y={392} fill={GREEN} fontFamily={SANS} fontWeight={700} fontSize={38} textAnchor="middle">ZBCN</text>
            <text x={600} y={428} fill={SEC} fontFamily={SANS} fontSize={22} textAnchor="middle">fixed 100B float</text>
          </g>
          <FNode f={f} delay={22} x={470} y={66} w={260} t="Product revenue" s="payroll + card fees" />
          <FNode f={f} delay={30} x={850} y={352} w={260} t="Buy ZBCN" s="off the open market" tc={GREEN} />
          <FNode f={f} delay={38} x={470} y={620} w={260} t="Burn" s="supply removed forever" tc={'#ff6b81'} />
          <FNode f={f} delay={46} x={90} y={352} w={260} t="Stake to hold" s="card rewards, less float" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

// ---- traction-scoreboard: staggered count-up numbers ----
const fmt = (v: number, prefix = '', suffix = '', comma = false) => {
  const n = Math.round(v);
  const s = comma ? n.toLocaleString('en-US') : String(n);
  return prefix + s + suffix;
};
const Stat: React.FC<{ f: number; delay: number; target: number; prefix?: string; suffix?: string; comma?: boolean; label: string }> =
  ({ f, delay, target, prefix = '', suffix = '', comma = false, label }) => {
    const p = interpolate(f, [delay, delay + 26], [0, 1], { ...clamp, easing: ease });
    const o = interpolate(f, [delay - 6, delay + 4], [0, 1], clamp);
    return (
      <div style={{ background: '#12151c', border: `1px solid ${BORDER}`, borderRadius: 18, padding: '34px 36px', position: 'relative', overflow: 'hidden', opacity: o }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${GREEN}, transparent)` }} />
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 76, color: GREEN, lineHeight: 1 }}>{fmt(target * p, prefix, suffix, comma)}</div>
        <div style={{ fontFamily: SANS, fontSize: 24, color: SEC, marginTop: 14, lineHeight: 1.35 }}>{label}</div>
      </div>
    );
  };
export const TractionScoreboard: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: BG, flexDirection: 'column', justifyContent: 'center', padding: '0 140px' }}>
      <Eyebrow ey="The adoption is not made up" f={f}
        head={<>Real money, <span style={{ color: GREEN }}>running through it</span></>} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 26, maxWidth: 1620 }}>
        <Stat f={f} delay={20} target={47} prefix="$" suffix="M" label="monthly payroll volume" />
        <Stat f={f} delay={40} target={500} prefix="$" suffix="M+" label="annualized payroll" />
        <Stat f={f} delay={58} target={12600} comma label="employees paid" />
        <Stat f={f} delay={76} target={239} label="enterprise clients" />
        <Stat f={f} delay={92} target={60} prefix="$" suffix="M" label="Zebec Card annualized volume" />
        <Stat f={f} delay={108} target={97} label="countries (card issued)" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 34, opacity: interpolate(f, [120, 134], [0, 1], clamp) }}>
        <span style={{ padding: '12px 24px', borderRadius: 100, background: 'rgba(0,194,255,.12)', color: CYAN, fontFamily: MONO, fontWeight: 600, fontSize: 24 }}>as of Nov 2025</span>
        <span style={{ fontFamily: SANS, fontSize: 23, color: MUT }}>source: Zebec network reports / CoinChapter</span>
      </div>
    </AbsoluteFill>
  );
};

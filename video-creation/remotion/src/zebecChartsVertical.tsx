import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadDMSans } from '@remotion/google-fonts/DMSans';
import { loadFont as loadJetBrains } from '@remotion/google-fonts/JetBrainsMono';
loadPlayfair('normal', { weights: ['700', '900'], subsets: ['latin'], ignoreTooManyRequestsWarning: true });
loadDMSans('normal', { weights: ['400', '600', '700'], subsets: ['latin'], ignoreTooManyRequestsWarning: true });
loadJetBrains('normal', { weights: ['600', '700'], subsets: ['latin'], ignoreTooManyRequestsWarning: true });

// VERTICAL (1080x1920) variants of the animated charts. Same animation, portrait layout.
const ease = Easing.out(Easing.cubic);
const BG = '#0a0c10', TEXT = '#e8eaf0', SEC = '#8892a4', MUT = '#505a6e';
const GREEN = '#00e68a', CYAN = '#00c2ff', GOLD = '#ffd700', BORDER = '#1e2330';
const SERIF = "'Playfair Display', Georgia, serif", SANS = "'DM Sans', system-ui, sans-serif", MONO = "'JetBrains Mono', ui-monospace, monospace";
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const Head: React.FC<{ ey: string; head: React.ReactNode; f: number; sub?: string }> = ({ ey, head, f, sub }) => {
  const o = interpolate(f, [0, 10], [0, 1], clamp);
  const y = interpolate(f, [0, 12], [18, 0], { ...clamp, easing: ease });
  return (
    <div style={{ opacity: o, transform: `translateY(${y}px)` }}>
      <div style={{ fontFamily: SANS, fontSize: 27, fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', color: MUT, marginBottom: 24 }}>{ey}</div>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 66, lineHeight: 1.08, letterSpacing: '-.02em', color: TEXT, maxWidth: 936 }}>{head}</div>
      <div style={{ width: 66, height: 4, borderRadius: 2, background: `linear-gradient(90deg, ${GREEN}, ${CYAN})`, margin: '28px 0' }} />
      {sub && <div style={{ fontFamily: SANS, fontSize: 30, color: SEC, marginTop: -10, marginBottom: 8 }}>{sub}</div>}
    </div>
  );
};

const fmt = (v: number, prefix = '', suffix = '', comma = false) => prefix + (comma ? Math.round(v).toLocaleString('en-US') : String(Math.round(v))) + suffix;
const Stat: React.FC<{ f: number; delay: number; target: number; prefix?: string; suffix?: string; comma?: boolean; label: string }> =
  ({ f, delay, target, prefix = '', suffix = '', comma = false, label }) => {
    const p = interpolate(f, [delay, delay + 26], [0, 1], { ...clamp, easing: ease });
    const o = interpolate(f, [delay - 6, delay + 4], [0, 1], clamp);
    return (
      <div style={{ background: '#12151c', border: `1px solid ${BORDER}`, borderRadius: 18, padding: '30px 30px', position: 'relative', overflow: 'hidden', opacity: o }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${GREEN}, transparent)` }} />
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 62, color: GREEN, lineHeight: 1 }}>{fmt(target * p, prefix, suffix, comma)}</div>
        <div style={{ fontFamily: SANS, fontSize: 24, color: SEC, marginTop: 12, lineHeight: 1.3 }}>{label}</div>
      </div>
    );
  };
export const TractionScoreboardV: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: BG, flexDirection: 'column', justifyContent: 'center', padding: '0 72px' }}>
      <Head ey="The adoption is not made up" f={f} head={<>Real money, <span style={{ color: GREEN }}>running through it</span></>} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, maxWidth: 936, marginTop: 20 }}>
        <Stat f={f} delay={20} target={47} prefix="$" suffix="M" label="monthly payroll volume" />
        <Stat f={f} delay={36} target={500} prefix="$" suffix="M+" label="annualized payroll" />
        <Stat f={f} delay={52} target={12600} comma label="employees paid" />
        <Stat f={f} delay={68} target={239} label="enterprise clients" />
        <Stat f={f} delay={84} target={60} prefix="$" suffix="M" label="card annualized volume" />
        <Stat f={f} delay={100} target={97} label="countries (card issued)" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 30, opacity: interpolate(f, [112, 126], [0, 1], clamp) }}>
        <span style={{ padding: '11px 22px', borderRadius: 100, background: 'rgba(0,194,255,.12)', color: CYAN, fontFamily: MONO, fontWeight: 600, fontSize: 23 }}>as of Nov 2025</span>
        <span style={{ fontFamily: SANS, fontSize: 22, color: MUT }}>Zebec reports / CoinChapter</span>
      </div>
    </AbsoluteFill>
  );
};

export const DemandVsFloatV: React.FC = () => {
  const f = useCurrentFrame();
  const floatP = interpolate(f, [18, 40], [0, 1], clamp);
  const demP = interpolate(f, [40, 110], [0, 1], clamp);
  const priceP = interpolate(f, [95, 165], [0, 1], clamp);
  const fastO = interpolate(f, [150, 168], [0, 1], clamp);
  const driftO = interpolate(f, [120, 135], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: BG, flexDirection: 'column', justifyContent: 'center', padding: '0 72px' }}>
      <Head ey="Demand rising against a supply that cannot grow" f={f} head={<>When demand meets a <span style={{ color: CYAN }}>fixed float</span></>} sub="conceptual, not a price prediction" />
      <svg viewBox="0 0 936 760" width="100%" style={{ marginTop: 24 }}>
        <line x1="80" y1="680" x2="906" y2="680" stroke={BORDER} strokeWidth={2} />
        <line x1="80" y1="40" x2="80" y2="680" stroke={BORDER} strokeWidth={2} />
        <text x="640" y="726" fill={MUT} fontFamily={SANS} fontSize={24}>time / adoption &#8594;</text>
        <line x1="80" y1="450" x2="906" y2="450" stroke={CYAN} strokeWidth={3} strokeDasharray="10 8" opacity={floatP} />
        <text x="110" y="430" fill={CYAN} fontFamily={MONO} fontSize={22} fontWeight={600} opacity={floatP}>FIXED FLOAT — 100B</text>
        <path d="M 80 620 C 340 600, 520 500, 650 380 C 760 280, 830 180, 906 120" fill="none" stroke={GREEN} strokeWidth={5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - demP} />
        <text x="700" y="330" fill={GREEN} fontFamily={SANS} fontSize={26} fontWeight={700} opacity={interpolate(f, [95, 108], [0, 1], clamp)}>DEMAND</text>
        <path d="M 80 650 C 360 645, 640 620, 760 590 L 810 280 L 840 100" fill="none" stroke={GOLD} strokeWidth={5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - priceP} />
        <text x="770" y="90" fill={GOLD} fontFamily={SANS} fontSize={26} fontWeight={700} opacity={interpolate(f, [150, 162], [0, 1], clamp)}>PRICE</text>
        <text x="150" y="560" fill={SEC} fontFamily={SANS} fontSize={28} opacity={driftO}>it doesn't drift up.</text>
        <text x="150" y="600" fill={GOLD} fontFamily={SERIF} fontSize={34} fontWeight={800} opacity={fastO}>it moves fast.</text>
      </svg>
    </AbsoluteFill>
  );
};

const FNode: React.FC<{ f: number; delay: number; cx: number; cy: number; w: number; h: number; t: string; s: string; tc?: string }> =
  ({ f, delay, cx, cy, w, h, t, s, tc = TEXT }) => {
    const o = interpolate(f, [delay, delay + 10], [0, 1], clamp);
    return (
      <g opacity={o}>
        <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={16} fill="#12151c" stroke={BORDER} strokeWidth={1.5} />
        <text x={cx} y={cy - 4} fill={tc} fontFamily={SANS} fontWeight={700} fontSize={30} textAnchor="middle">{t}</text>
        <text x={cx} y={cy + 30} fill={SEC} fontFamily={SANS} fontSize={21} textAnchor="middle">{s}</text>
      </g>
    );
  };
export const BuybackFlywheelV: React.FC = () => {
  const f = useCurrentFrame();
  const arc = (d: number) => interpolate(f, [d, d + 22], [0, 1], clamp);
  const a1 = arc(46), a2 = arc(62), a3 = arc(78), a4 = arc(94);
  const cO = interpolate(f, [18, 32], [0, 1], clamp);
  const pulse = 1 + 0.03 * Math.sin((f / 30) * Math.PI * 2 * 0.5);
  return (
    <AbsoluteFill style={{ background: BG, flexDirection: 'column', justifyContent: 'center', padding: '0 72px' }}>
      <Head ey="A real company, feeding a shrinking token" f={f} head={<>The <span style={{ color: GREEN }}>buyback flywheel</span></>} />
      <svg viewBox="0 0 936 936" width="100%" style={{ marginTop: 20 }}>
        <defs><marker id="fmkv" markerWidth="12" markerHeight="12" refX="8" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill={GREEN} /></marker></defs>
        <path d="M 520 180 A 290 290 0 0 1 760 468" fill="none" stroke={GREEN} strokeWidth={3.5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - a1} markerEnd={a1 > 0.98 ? 'url(#fmkv)' : undefined} />
        <path d="M 760 500 A 290 290 0 0 1 418 760" fill="none" stroke={GREEN} strokeWidth={3.5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - a2} markerEnd={a2 > 0.98 ? 'url(#fmkv)' : undefined} />
        <path d="M 178 500 A 290 290 0 0 1 176 420" fill="none" stroke={GREEN} strokeWidth={3.5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - a3} markerEnd={a3 > 0.98 ? 'url(#fmkv)' : undefined} />
        <path d="M 200 240 A 290 290 0 0 1 416 178" fill="none" stroke={GREEN} strokeWidth={3.5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - a4} markerEnd={a4 > 0.98 ? 'url(#fmkv)' : undefined} />
        <g opacity={cO} transform={`translate(468 468) scale(${pulse}) translate(-468 -468)`}>
          <circle cx={468} cy={468} r={118} fill="rgba(0,230,138,.08)" stroke="rgba(0,230,138,.4)" strokeWidth={1.5} />
          <text x={468} y={460} fill={GREEN} fontFamily={SANS} fontWeight={700} fontSize={38} textAnchor="middle">ZBCN</text>
          <text x={468} y={496} fill={SEC} fontFamily={SANS} fontSize={22} textAnchor="middle">fixed 100B float</text>
        </g>
        <FNode f={f} delay={22} cx={468} cy={120} w={300} h={100} t="Product revenue" s="payroll + card fees" />
        <FNode f={f} delay={30} cx={800} cy={468} w={250} h={100} t="Buy ZBCN" s="off the open market" tc={GREEN} />
        <FNode f={f} delay={38} cx={468} cy={816} w={300} h={100} t="Burn" s="supply removed forever" tc={'#ff6b81'} />
        <FNode f={f} delay={46} cx={136} cy={468} w={250} h={100} t="Stake to hold" s="less float" />
      </svg>
    </AbsoluteFill>
  );
};

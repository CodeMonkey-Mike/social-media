import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadDM } from '@remotion/google-fonts/DMSans';
import { loadFont as loadMono } from '@remotion/google-fonts/JetBrainsMono';

loadPlayfair('normal', { weights: ['700', '900'], subsets: ['latin'] });
loadDM('normal', { weights: ['400', '500', '700'], subsets: ['latin'] });
loadMono('normal', { weights: ['600'], subsets: ['latin'] });

const SERIF = "'Playfair Display', serif";
const SANS = "'DM Sans', sans-serif";
const MONO = "'JetBrains Mono', monospace";
const C = {
  bg: '#0a0c10', border: '#1e2330', cyan: '#00c2ff', teal: '#49e0c8',
  tp: '#e8eaf0', ts: '#8892a4', tm: '#505a6e',
};
const ease = Easing.out(Easing.cubic);

type Row = { rk: string; name: string; pct: number; val: number; eth?: boolean; callout?: string };

// C-RANK — top networks by market cap. Values [VERIFY] at render (CoinGecko/CMC). 1920x1080.
const C_RANK_ROWS: Row[] = [
  { rk: '#1', name: 'Bitcoin', pct: 100, val: 1210 },
  { rk: '#2', name: 'Ethereum', pct: 16.1, val: 195, eth: true, callout: '← cites Sompolinsky & Zohar’s GHOST' },
  { rk: '#3', name: 'XRP', pct: 11.6, val: 140 },
  { rk: '#4', name: 'Solana', pct: 7.4, val: 90 },
  { rk: '#5', name: 'BNB', pct: 7.0, val: 85 },
];

const fmt = (v: number) => '~$' + Math.round(v).toLocaleString('en-US') + 'B';

const BarRow: React.FC<{ row: Row; index: number }> = ({ row, index }) => {
  const f = useCurrentFrame();
  const s = 18 + index * 6;                 // staggered start per bar
  const p = interpolate(f, [s, s + 26], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  const rowOp = interpolate(f, [s - 6, s + 4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const val = fmt(row.val * p);
  const fill = row.eth
    ? `linear-gradient(90deg, ${C.cyan}, ${C.teal})`
    : `linear-gradient(90deg, #3a4252, #23272f)`;
  const coOp = row.callout ? interpolate(f, [s + 24, s + 38], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
  const coX = interpolate(f, [s + 24, s + 38], [18, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 30, opacity: rowOp }}>
      <div style={{ width: 200, textAlign: 'right', fontFamily: SANS, fontWeight: 700, fontSize: 28, color: row.eth ? C.cyan : C.tp }}>
        <span style={{ fontFamily: MONO, color: C.tm, fontSize: 21, marginRight: 10 }}>{row.rk}</span>{row.name}
      </div>
      <div style={{ flex: 1, height: 52, background: 'rgba(255,255,255,.03)', border: `1px solid ${C.border}`, borderRadius: 12, position: 'relative' }}>
        <div style={{ height: '100%', width: `${row.pct * p}%`, borderRadius: 12, background: fill }} />
        {row.callout ? (
          <div style={{ position: 'absolute', left: '19%', top: '50%', transform: `translate(${coX}px,-50%)`, whiteSpace: 'nowrap', color: C.teal, fontFamily: SANS, fontSize: 23, fontWeight: 700, opacity: coOp }}>
            {row.callout}
          </div>
        ) : null}
      </div>
      <div style={{ fontFamily: MONO, fontSize: 25, color: C.tp, marginLeft: 20, width: 150, whiteSpace: 'nowrap' }}>{val}</div>
    </div>
  );
};

// C-SPLIT — GENIUS | OVER-RATED, fill-the-frame (ported from deck s1). 1920x1080.
const GREEN = '#00e68a';
const RED = '#ff5d6c';
const SPLIT_G = ['His 2013 math is cited in Ethereum’s whitepaper.', 'A decade of protocols others keep building on.', 'Shipped a live chain, fairly launched, no premine.'];
const SPLIT_R = ['Citations are not adoption.', 'It is a team, not a one-man messiah.', 'His own chain is still small.'];

const SplitCol: React.FC<{ label: string; accent: string; lines: string[]; appear: number }> = ({ label, accent, lines, appear }) => {
  const f = useCurrentFrame();
  const op = interpolate(f, [appear, appear + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const y = interpolate(f, [appear, appear + 14], [24, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  return (
    <div style={{ flex: 1, opacity: op, transform: `translateY(${y}px)`, background: `linear-gradient(160deg, ${accent}14, #ffffff05)`, border: `1px solid ${accent}55`, borderRadius: 20, padding: '54px 56px', display: 'flex', flexDirection: 'column', gap: 30 }}>
      <div style={{ fontFamily: MONO, fontSize: 26, fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', color: accent }}>{label}</div>
      {lines.map((l, i) => (
        <div key={i} style={{ fontFamily: SANS, fontSize: 40, lineHeight: 1.25, color: C.tp, borderTop: i ? `1px solid ${accent}22` : 'none', paddingTop: i ? 26 : 0 }}>{l}</div>
      ))}
    </div>
  );
};

export const CSplit: React.FC = () => {
  const f = useCurrentFrame();
  const head = interpolate(f, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const hy = interpolate(f, [0, 12], [16, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: SANS, color: C.tp, padding: '90px 110px', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', width: 760, height: 760, borderRadius: '50%', filter: 'blur(190px)', opacity: 0.14, background: GREEN, top: -160, left: -120 }} />
      <div style={{ position: 'absolute', width: 760, height: 760, borderRadius: '50%', filter: 'blur(190px)', opacity: 0.12, background: RED, bottom: -200, right: -120 }} />
      <div style={{ opacity: head, transform: `translateY(${hy}px)`, position: 'relative', zIndex: 2, marginBottom: 50 }}>
        <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: '.2em', textTransform: 'uppercase', color: C.tm, fontWeight: 600 }}>The Split</div>
        <h1 style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 76, lineHeight: 1.08, margin: '16px 0 0' }}>Half of crypto cannot agree on him</h1>
        <div style={{ width: 90, height: 5, borderRadius: 3, background: `linear-gradient(90deg, ${GREEN}, ${C.cyan})`, marginTop: 22 }} />
      </div>
      <div style={{ display: 'flex', gap: 46, position: 'relative', zIndex: 2 }}>
        <SplitCol label="Genius" accent={GREEN} lines={SPLIT_G} appear={10} />
        <SplitCol label="Over-Rated" accent={RED} lines={SPLIT_R} appear={18} />
      </div>
    </AbsoluteFill>
  );
};

export const CRankChart: React.FC = () => {
  const f = useCurrentFrame();
  const headOp = interpolate(f, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const headY = interpolate(f, [0, 12], [16, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  const footOp = interpolate(f, [8, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: SANS, color: C.tp, padding: '96px 120px', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', width: 780, height: 780, borderRadius: '50%', filter: 'blur(180px)', opacity: 0.18, background: C.cyan, top: -240, right: -180 }} />
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ opacity: headOp, transform: `translateY(${headY}px)` }}>
          <div style={{ fontSize: 20, textTransform: 'uppercase', letterSpacing: '.2em', color: C.tm, fontFamily: MONO, fontWeight: 600 }}>Crypto networks by market cap</div>
          <h1 style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 64, lineHeight: 1.1, margin: '20px 0 6px' }}>
            The man whose math is in the <span style={{ color: C.cyan }}>#2</span> network
          </h1>
          <div style={{ color: C.ts, fontSize: 25, marginBottom: 52 }}>Ethereum&rsquo;s whitepaper cites his 2013 GHOST paper.</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 27 }}>
          {C_RANK_ROWS.map((r, i) => <BarRow key={r.name} row={r} index={i} />)}
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 44, left: 120, color: C.tm, fontSize: 19, fontFamily: MONO, opacity: footOp }}>
        [VERIFY] approximate snapshot 2026-06-29 (CoinGecko / CoinMarketCap), re-pull at render
      </div>
    </AbsoluteFill>
  );
};

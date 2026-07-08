import React from 'react';
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, interpolate, useCurrentFrame, Easing } from 'remotion';
import { TransitionClip } from './transitions/TransitionClip';
import { CAPTIONS_CT } from './carryTradeCaptions';

/**
 * carry-trade — VERTICAL repurpose experiment (1080x1920, Mike 2026-07-06).
 * Same spine/audio/timings as CarryTradeFull; every visual layer rebuilt vertical-native:
 *  - stills = ChatGPT 9:16 recompositions (reference-image regenerations of the landscape set)
 *  - vids   = NEW vertical Envato clips (v-* slugs)
 *  - charts/containers = vertical-native layouts (stacked lanes, vertical node chains, bumped type)
 *  - spine  = center-crop with a slight right bias (face sits ~52-56% x in the 16:9 frame)
 * Output: carry-trade-VERTICAL-v1 (1.0 Mbps draft for Mike's X/IG test).
 */

export const CTV_FPS = 30;
const sh = (t: number) => t;
const F = (t: number) => Math.round(t * CTV_FPS);
export const CTV_DURATION = Math.round(601.494 * CTV_FPS);

const ease = Easing.out(Easing.cubic);
const MONO = "'JetBrains Mono','Consolas',monospace";
const SANS = "'DM Sans','Segoe UI',sans-serif";

// ---------- vertical assets ----------
const STILL: Record<string, string> = {
  'BR-BOJ-BUILDING': 'broll-v01boj-BR-BOJ-BUILDING.png',
  'BR-TOKYO-SKYLINE': 'broll-v02tok-BR-TOKYO-SKYLINE.png',
  'BR-YEN-BANKNOTES': 'broll-v03yen-BR-YEN-BANKNOTES.png',
  'BR-TRADING-FLOOR': 'broll-v04tra-BR-TRADING-FLOOR.png',
  'BR-CAPITAL-FLOW-ABSTRACT': 'broll-v05cap-BR-CAPITAL-FLOW-ABSTRACT.png',
  'BR-BANK-VAULT': 'broll-v06ban-BR-BANK-VAULT.png',
  'BR-MARKET-STORM-ABSTRACT': 'broll-v07mar-BR-MARKET-STORM-ABSTRACT.png',
  'BR-CRYPTO-NETWORK-ABSTRACT': 'broll-v08cry-BR-CRYPTO-NETWORK-ABSTRACT.png',
  'BR-TOKYO-COMMUTERS': 'broll-v09tok-BR-TOKYO-COMMUTERS.png',
  'BR-SCALES-RISK': 'broll-v10sca-BR-SCALES-RISK.png',
  'BR-AI-DATACENTER': 'broll-v11aix-BR-AI-DATACENTER.png',
  'BR-PRODUCTIVITY-CODE': 'broll-v12pro-BR-PRODUCTIVITY-CODE.png',
  'BR-GREEN-CANDLES': 'broll-v13gre-BR-GREEN-CANDLES.png',
};
// v-* slugs from the vertical Envato pass — FINALIZE EXTENSIONS after the sourcing report.
// full public-dir-relative paths (actual downloaded extensions; yen-banknotes = the ONE subject with
// no vertical Envato inventory -> the landscape macro clip center-crops via objectFit cover, noted in manifest)
const VID: Record<string, string> = {
  'tokyo-skyline': 'vid-vertical/v-tokyo-skyline.mp4', 'yen-banknotes': 'vid/yen-banknotes.mp4',
  'btc-chart-falling': 'vid-vertical/v-btc-coin.mp4', 'bank-vault': 'vid-vertical/v-bank-vault.mp4',
  'trading-floor': 'vid-vertical/v-trading-screen.mp4', 'tokyo-crosswalk': 'vid-vertical/v-tokyo-crosswalk.mp4',
  'market-crash-screen': 'vid-vertical/v-market-crash.mp4', 'boj-building': 'vid-vertical/v-boj-building.mp4',
  'data-control-room': 'vid-vertical/v-datacenter.mp4', 'fx-rate-board': 'vid-vertical/v-fx-board.mov',
};
const RECEIPT: Record<string, string> = {
  'R-FORTUNE': 'R-FORTUNE-may2026.png', 'R-COINDESK': 'R-COINDESK-aug2024.png', 'R-BIS': 'R-BIS-bulletin90.png',
};

// ---------- COVERS: identical timings to CarryTradeFull (single source: that comp's review-fixed map) ----------
type Cover = { tIn: number; tOut: number; kind: 'chart' | 'still' | 'vid' | 'deck' | 'receipt' | 'showcase'; ref: string; state?: string; lead?: boolean };
const COVERS: Cover[] = [
  { tIn: 14.40, tOut: 18.40, kind: 'still', ref: 'BR-CAPITAL-FLOW-ABSTRACT' },
  { tIn: 18.40, tOut: 23.22, kind: 'vid', ref: 'tokyo-skyline', lead: true },
  { tIn: 23.22, tOut: 32.38, kind: 'deck', ref: 'D-OUTFLOW', state: 'out' },
  { tIn: 32.38, tOut: 38.78, kind: 'chart', ref: 'C4' },
  { tIn: 38.78, tOut: 45.12, kind: 'receipt', ref: 'R-FORTUNE' },
  { tIn: 57.54, tOut: 61.54, kind: 'vid', ref: 'yen-banknotes' },
  { tIn: 61.54, tOut: 65.24, kind: 'still', ref: 'BR-TOKYO-COMMUTERS' },
  { tIn: 65.24, tOut: 69.26, kind: 'chart', ref: 'C3' },
  { tIn: 69.26, tOut: 72.90, kind: 'vid', ref: 'btc-chart-falling' },
  { tIn: 81.98, tOut: 85.98, kind: 'still', ref: 'BR-YEN-BANKNOTES' },
  { tIn: 85.98, tOut: 89.98, kind: 'vid', ref: 'bank-vault' },
  { tIn: 89.98, tOut: 93.98, kind: 'still', ref: 'BR-SCALES-RISK' },
  { tIn: 93.98, tOut: 103.20, kind: 'deck', ref: 'D-DUALFLOW', state: 'lanes' },
  { tIn: 103.20, tOut: 116.54, kind: 'deck', ref: 'D-DUALFLOW', state: 'lane1' },
  { tIn: 116.54, tOut: 122.12, kind: 'chart', ref: 'C6' },
  { tIn: 122.12, tOut: 131.08, kind: 'deck', ref: 'D-DUALFLOW', state: 'lane2' },
  { tIn: 131.08, tOut: 135.08, kind: 'vid', ref: 'trading-floor' },
  { tIn: 135.08, tOut: 144.60, kind: 'deck', ref: 'D-DUALFLOW', state: 'scale' },
  { tIn: 146.30, tOut: 157.94, kind: 'deck', ref: 'D-DUALFLOW', state: 'conditions' },
  { tIn: 163.00, tOut: 172.12, kind: 'deck', ref: 'D-SQUEEZE', state: 'intro' },
  { tIn: 172.12, tOut: 190.12, kind: 'deck', ref: 'D-SQUEEZE', state: 'slow' },
  { tIn: 190.12, tOut: 194.50, kind: 'vid', ref: 'tokyo-crosswalk', lead: true },
  { tIn: 194.50, tOut: 198.50, kind: 'still', ref: 'BR-TRADING-FLOOR' },
  { tIn: 198.50, tOut: 217.36, kind: 'deck', ref: 'D-SQUEEZE', state: 'fast' },
  { tIn: 217.36, tOut: 222.36, kind: 'vid', ref: 'market-crash-screen', lead: true },
  { tIn: 222.36, tOut: 235.08, kind: 'deck', ref: 'D-SQUEEZE', state: 'connect' },
  { tIn: 248.32, tOut: 252.32, kind: 'vid', ref: 'boj-building' },
  { tIn: 252.32, tOut: 264.52, kind: 'chart', ref: 'C1' },
  { tIn: 264.52, tOut: 268.52, kind: 'vid', ref: 'data-control-room' },
  { tIn: 268.52, tOut: 277.28, kind: 'chart', ref: 'C2' },
  { tIn: 277.28, tOut: 284.04, kind: 'chart', ref: 'C3' },
  { tIn: 284.04, tOut: 292.78, kind: 'receipt', ref: 'R-COINDESK' },
  { tIn: 292.78, tOut: 297.16, kind: 'receipt', ref: 'R-BIS' },
  { tIn: 297.16, tOut: 324.52, kind: 'deck', ref: 'D-WORKEDMATH', state: 'sequence' },
  { tIn: 339.74, tOut: 348.44, kind: 'showcase', ref: 'R-SHOWCASE-cryptorich' },
  { tIn: 353.76, tOut: 357.76, kind: 'still', ref: 'BR-BANK-VAULT' },
  { tIn: 357.76, tOut: 361.76, kind: 'still', ref: 'BR-BOJ-BUILDING' },
  { tIn: 361.76, tOut: 380.14, kind: 'chart', ref: 'C4' },
  { tIn: 380.14, tOut: 384.14, kind: 'vid', ref: 'fx-rate-board' },
  { tIn: 384.14, tOut: 392.62, kind: 'receipt', ref: 'R-FORTUNE' },
  { tIn: 392.62, tOut: 422.52, kind: 'chart', ref: 'C5' },
  { tIn: 422.52, tOut: 426.52, kind: 'still', ref: 'BR-MARKET-STORM-ABSTRACT' },
  { tIn: 426.52, tOut: 434.54, kind: 'chart', ref: 'C1' },
  { tIn: 434.54, tOut: 448.26, kind: 'chart', ref: 'C2' },
  { tIn: 448.26, tOut: 461.62, kind: 'receipt', ref: 'R-BIS' },
  { tIn: 477.20, tOut: 499.26, kind: 'deck', ref: 'D-OUTFLOW', state: 'wobble' },
  { tIn: 499.26, tOut: 503.26, kind: 'still', ref: 'BR-CRYPTO-NETWORK-ABSTRACT' },
  { tIn: 521.42, tOut: 525.42, kind: 'still', ref: 'BR-AI-DATACENTER' },
  { tIn: 525.42, tOut: 529.42, kind: 'still', ref: 'BR-PRODUCTIVITY-CODE' },
  { tIn: 529.42, tOut: 563.14, kind: 'chart', ref: 'DCYCLE' },
  { tIn: 563.14, tOut: 567.14, kind: 'still', ref: 'BR-GREEN-CANDLES' },
  { tIn: 567.14, tOut: 580.64, kind: 'chart', ref: 'DCYCLE' },
  { tIn: 596.90, tOut: 600.72, kind: 'still', ref: 'BR-TOKYO-SKYLINE' },
];

const FACE_CUTS = [45.12, 72.90, 144.60, 157.94, 235.08, 324.52, 461.62, 503.26, 580.64];
const PUNCH: [number, number][] = [
  [7.78, 13.0], [49.38, 56.5], [74.96, 78.6], [239.98, 247.5],
  [346.30, 352.5], [466.32, 476.0], [508.24, 520.0], [590.08, 596.0],
];
const CAPTION_SRC: [number, number][] = [[0, 14.40], [45.12, 57.54], [72.90, 79.04]];
const CARD_START = 79.04;
const FACE_HOLDS: [number, number][] = [
  [0, 14.40], [45.12, 57.54], [72.90, 79.04], [157.94, 163.00], [235.08, 248.32],
  [324.52, 353.76], [461.62, 477.20], [503.26, 521.42], [580.64, 596.90],
];

const pick = <T,>(pool: T[], i: number) => pool[(i * 3 + 1) % pool.length];
const ROUGHLY = ['roughly-1x', 'roughly-2x', 'roughly-3x', 'roughly-4x', 'roughly-5x', 'roughly-6x', 'roughly-7x'];
const OFFSET = ['glitchoffset-1x', 'glitchoffset-2x', 'glitchoffset-3x', 'glitchoffset-4x', 'glitchoffset-5x', 'glitchoffset-6x', 'glitchoffset-7x'];
const TURB = ['turbulent-h-1x', 'turbulent-h-2x', 'turbulent-h-3x', 'turbulent-v-1x', 'turbulent-v-2x', 'turbulent-v-3x', 'turbulent-h-4x', 'turbulent-v-4x'];
const VHS = ['vhs-short-1', 'vhs-short-2', 'vhs-short-3', 'vhs-min-1', 'vhs-min-2', 'vhs-min-3', 'vhs-max-1', 'vhs-max-2', 'vhs-max-3'];
const glitchFor = (c: Cover, i: number): string | null => {
  switch (c.kind) {
    case 'still': return pick(ROUGHLY, i);
    case 'chart': return pick(OFFSET, i);
    case 'deck': return pick(TURB, i);
    case 'receipt': return pick(VHS, i);
    case 'showcase': return pick(VHS, i);
    default: return null;
  }
};

// ---------- vertical card frame + chart primitives ----------
const VCard: React.FC<{ title: string; sub?: string; takeaway?: React.ReactNode; source?: string; children: React.ReactNode }> = ({ title, sub, takeaway, source, children }) => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ background: '#05070a', justifyContent: 'center', alignItems: 'center', opacity: op }}>
      <div style={{ width: 1000, height: 1800, background: '#0d1015', border: '1px solid #1e2330', borderRadius: 28, padding: '56px 48px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontFamily: SANS, fontSize: 54, fontWeight: 900, color: '#e8eaf0', lineHeight: 1.15 }}>{title}</div>
        {sub && <div style={{ fontFamily: SANS, fontSize: 27, color: '#8892a4', marginTop: 14 }}>{sub}</div>}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>{children}</div>
        {takeaway && <div style={{ fontFamily: SANS, fontSize: 30, marginTop: 10 }}>{takeaway}</div>}
        {source && <div style={{ fontFamily: MONO, fontSize: 16, color: '#505a6e', marginTop: 14 }}>{source}</div>}
      </div>
    </AbsoluteFill>
  );
};
const useDraw = (delay = 6, dur = 36) => {
  const f = useCurrentFrame();
  return interpolate(f, [delay, delay + dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
};
const useFadeAt = (at: number, dur = 8) => {
  const f = useCurrentFrame();
  return interpolate(f, [at, at + dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
};
const DrawnPolyline: React.FC<{ points: string; stroke: string; width?: number; p: number; len: number }> = ({ points, stroke, width = 6, p, len }) => (
  <polyline fill="none" stroke={stroke} strokeWidth={width} points={points} strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
);

// ---------- vertical charts (same data/labels as landscape; type bumped for 1080-wide) ----------
const VCtC1: React.FC = () => {
  const p = useDraw();
  const l1 = useFadeAt(24), l2 = useFadeAt(32), l3 = useFadeAt(40);
  return (
    <VCard title="BoJ Policy Rate, 2007–2026" sub="Bank of Japan policy interest rate over time"
      takeaway={<span><b style={{ color: '#ff4060' }}>Three hikes since 2024</b><span style={{ color: '#8892a4' }}> — the highest rate since 1995</span></span>}
      source="SOURCE: BANK OF JAPAN. SCHEMATIC STEP-PLOT. VERIFY AT RENDER.">
      <svg viewBox="0 0 900 900" width={900} height={900}>
        <line x1={90} y1={60} x2={90} y2={800} stroke="#1e2330" strokeWidth={2} />
        <line x1={90} y1={800} x2={880} y2={800} stroke="#1e2330" strokeWidth={2} />
        <text x={64} y={368} fill="#8892a4" fontFamily={MONO} fontSize={30} textAnchor="end">1%</text>
        <text x={64} y={648} fill="#8892a4" fontFamily={MONO} fontSize={30} textAnchor="end">0%</text>
        <DrawnPolyline points="90,500 220,500 220,672 480,672 480,570 640,570 640,430 700,430 700,360 880,360" stroke="#ff4060" p={p} len={1700} />
        <g opacity={l1}><circle cx={480} cy={570} r={11} fill="#ffd700" /><text x={470} y={528} fill="#ffd700" fontFamily={MONO} fontSize={30} textAnchor="middle">Jul 2024: 0.25%</text></g>
        <g opacity={l2}><circle cx={640} cy={430} r={11} fill="#ffd700" /><text x={600} y={392} fill="#ffd700" fontFamily={MONO} fontSize={30} textAnchor="middle">Feb 2026: 0.75%</text></g>
        <g opacity={l3}><circle cx={700} cy={360} r={11} fill="#00e68a" /><text x={740} y={318} fill="#00e68a" fontFamily={MONO} fontSize={30} textAnchor="middle">Jun 2026: 1%</text></g>
        <text x={110} y={856} fill="#505a6e" fontFamily={MONO} fontSize={26}>2008</text>
        <text x={470} y={856} fill="#505a6e" fontFamily={MONO} fontSize={26}>2024</text>
        <text x={800} y={856} fill="#505a6e" fontFamily={MONO} fontSize={26}>2026</text>
      </svg>
    </VCard>
  );
};
const VCtC2: React.FC = () => {
  const p = useDraw();
  const m1 = useFadeAt(18), m2 = useFadeAt(26), m3 = useFadeAt(34), m4 = useFadeAt(42);
  return (
    <VCard title="USD/JPY: the Yen Keeps Falling" sub="With Japan's currency-defense spending marked"
      takeaway={<span><b style={{ color: '#00c2ff' }}>Billions spent defending the yen</b><span style={{ color: '#8892a4' }}> — still a ~40yr low</span></span>}
      source="SOURCE: BOJ/MOF + YAHOO FINANCE (JUN 2026). SCHEMATIC. VERIFY AT RENDER.">
      <svg viewBox="0 0 900 900" width={900} height={900}>
        <line x1={90} y1={60} x2={90} y2={800} stroke="#1e2330" strokeWidth={2} />
        <line x1={90} y1={800} x2={880} y2={800} stroke="#1e2330" strokeWidth={2} />
        <text x={64} y={210} fill="#8892a4" fontFamily={MONO} fontSize={30} textAnchor="end">¥162</text>
        <text x={64} y={470} fill="#8892a4" fontFamily={MONO} fontSize={30} textAnchor="end">¥155</text>
        <text x={64} y={740} fill="#8892a4" fontFamily={MONO} fontSize={30} textAnchor="end">¥145</text>
        <DrawnPolyline points="90,650 210,420 270,420 290,660 350,630 430,450 470,672 530,560 630,420 730,300 880,230" stroke="#00c2ff" p={p} len={1900} />
        <g opacity={m1}><circle cx={290} cy={660} r={11} fill="#ffd700" /><text x={290} y={716} fill="#ffd700" fontFamily={MONO} fontSize={27} textAnchor="middle">Apr-May 2024: ¥9.8T</text></g>
        <g opacity={m2}><circle cx={470} cy={672} r={11} fill="#ffd700" /><text x={480} y={728} fill="#ffd700" fontFamily={MONO} fontSize={27} textAnchor="middle">Jul 2024: ¥5.5T</text></g>
        <g opacity={m3}><circle cx={730} cy={300} r={11} fill="#ffd700" /><text x={700} y={262} fill="#ffd700" fontFamily={MONO} fontSize={27} textAnchor="middle">2026: ~$72.5B spent</text></g>
        <g opacity={m4}><circle cx={880} cy={230} r={12} fill="#ff4060" /><text x={870} y={186} fill="#ff4060" fontFamily={MONO} fontSize={29} textAnchor="end">Jun 2026: ~¥162 (~40yr low)</text></g>
      </svg>
    </VCard>
  );
};
const VCtC3: React.FC = () => {
  const p = useDraw();
  const a = useFadeAt(8), b = useFadeAt(38);
  return (
    <VCard title="Bitcoin, August 2–5, 2024" sub="The 48 hours the carry-trade unwind reached crypto"
      takeaway={<span><b style={{ color: '#ff4060' }}>−$14,000 in ~48 hours</b><span style={{ color: '#8892a4' }}> — in yen it fell even harder</span></span>}
      source="SOURCE: BIS BULLETIN NO. 90 + COINDESK. SCHEMATIC. VERIFY AT RENDER.">
      <svg viewBox="0 0 900 900" width={900} height={900}>
        <line x1={90} y1={60} x2={90} y2={800} stroke="#1e2330" strokeWidth={2} />
        <line x1={90} y1={800} x2={880} y2={800} stroke="#1e2330" strokeWidth={2} />
        <text x={64} y={160} fill="#8892a4" fontFamily={MONO} fontSize={30} textAnchor="end">$64K</text>
        <text x={64} y={450} fill="#8892a4" fontFamily={MONO} fontSize={30} textAnchor="end">$57K</text>
        <text x={64} y={690} fill="#8892a4" fontFamily={MONO} fontSize={30} textAnchor="end">$50K</text>
        <DrawnPolyline points="90,150 300,160 480,270 630,540 760,700 880,660" stroke="#ff4060" p={p} len={1400} />
        <g opacity={a}><circle cx={90} cy={150} r={12} fill="#00e68a" /><text x={130} y={110} fill="#00e68a" fontFamily={MONO} fontSize={32}>~$64,000</text></g>
        <g opacity={b}><circle cx={760} cy={700} r={12} fill="#ff4060" /><text x={730} y={760} fill="#ff4060" fontFamily={MONO} fontSize={32} textAnchor="middle">sub-$50,000</text></g>
        <text x={90} y={856} fill="#505a6e" fontFamily={MONO} fontSize={26}>Aug 2</text>
        <text x={800} y={856} fill="#505a6e" fontFamily={MONO} fontSize={26}>Aug 5</text>
      </svg>
    </VCard>
  );
};
const VGrowBar: React.FC<{ x: number; yBase: number; w: number; h: number; fill: string; p: number; opacity?: number }> = ({ x, yBase, w, h, fill, p, opacity = 1 }) => (
  <rect x={x} y={yBase - h * p} width={w} height={h * p} fill={fill} opacity={opacity} />
);
const VCtC4: React.FC = () => {
  const f = useCurrentFrame();
  const bp = (i: number) => interpolate(f, [4 + i * 5, 22 + i * 5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  const lbl = useFadeAt(34);
  return (
    <VCard title="Japan's US Treasury Holdings" sub="The largest foreign holder, ~$1.24T, just logged a ~$29.6B quarterly sale"
      takeaway={<span><b style={{ color: '#ffd700' }}>A flow, not the whole stock</b><span style={{ color: '#8892a4' }}> — but the direction flipped</span></span>}
      source="SOURCE: US TREASURY TIC VIA FORTUNE (MAY 2026). VERIFY AT RENDER.">
      <svg viewBox="0 0 900 900" width={900} height={900}>
        <line x1={60} y1={780} x2={880} y2={780} stroke="#1e2330" strokeWidth={2} />
        <VGrowBar x={80} yBase={780} w={130} h={480} fill="#00c2ff" opacity={0.85} p={bp(0)} />
        <VGrowBar x={240} yBase={780} w={130} h={495} fill="#00c2ff" opacity={0.85} p={bp(1)} />
        <VGrowBar x={400} yBase={780} w={130} h={510} fill="#00c2ff" opacity={0.85} p={bp(2)} />
        <VGrowBar x={560} yBase={780} w={130} h={525} fill="#00c2ff" opacity={0.85} p={bp(3)} />
        <VGrowBar x={720} yBase={780} w={130} h={430} fill="#ff4060" p={bp(4)} />
        <g opacity={lbl}>
          <text x={785} y={300} fill="#ff4060" fontFamily={MONO} fontSize={34} textAnchor="middle" fontWeight={600}>−$29.6B</text>
          <text x={480} y={140} fill="#e8eaf0" fontFamily={MONO} fontSize={30} textAnchor="middle">~$1.24T total (Feb 2026)</text>
        </g>
        {['Q1’25', 'Q2’25', 'Q3’25', 'Q4’25'].map((q, i) => (
          <text key={q} x={145 + i * 160} y={836} fill="#505a6e" fontFamily={MONO} fontSize={26} textAnchor="middle">{q}</text>
        ))}
        <text x={785} y={836} fill="#ff4060" fontFamily={MONO} fontSize={26} textAnchor="middle" fontWeight={600}>Q1'26</text>
      </svg>
    </VCard>
  );
};
const VCtC5: React.FC = () => {
  const f = useCurrentFrame();
  const bp = (i: number) => interpolate(f, [4 + i * 6, 24 + i * 6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  const lbl = useFadeAt(40);
  return (
    <VCard title="Japanese Money in Foreign Stocks" sub="Net monthly retail flow into overseas equity funds — the 2026 reversal"
      takeaway={<span><b style={{ color: '#a855f7' }}>From steady buying to a ~$17B exit</b><span style={{ color: '#8892a4' }}> — deliberate repatriation</span></span>}
      source="SOURCE: FUTUNN (MAY 2026) — CORROBORATE BEFORE AIR. FEB-APR ILLUSTRATIVE. VERIFY.">
      <svg viewBox="0 0 900 900" width={900} height={900}>
        <line x1={60} y1={430} x2={880} y2={430} stroke="#1e2330" strokeWidth={2} />
        <text x={190} y={300} fill="#8892a4" fontFamily={MONO} fontSize={28} textAnchor="end">+ inflow</text>
        <text x={200} y={580} fill="#8892a4" fontFamily={MONO} fontSize={28} textAnchor="end">− outflow</text>
        <VGrowBar x={80} yBase={430} w={130} h={200} fill="#00e68a" p={bp(0)} />
        <VGrowBar x={240} yBase={430} w={130} h={145} fill="#00e68a" opacity={0.75} p={bp(1)} />
        <VGrowBar x={400} yBase={430} w={130} h={88} fill="#00e68a" opacity={0.55} p={bp(2)} />
        <VGrowBar x={560} yBase={430} w={130} h={44} fill="#00e68a" opacity={0.4} p={bp(3)} />
        <rect x={720} y={430} width={130} height={260 * bp(4)} fill="#ff4060" />
        <g opacity={lbl}>
          <text x={145} y={190} fill="#00e68a" fontFamily={MONO} fontSize={27} textAnchor="middle">still buying</text>
          <text x={785} y={750} fill="#ff4060" fontFamily={MONO} fontSize={34} textAnchor="middle" fontWeight={600}>−$16.98B</text>
        </g>
        {['Jan', 'Feb', 'Mar', 'Apr'].map((q, i) => (
          <text key={q} x={145 + i * 160} y={836} fill="#505a6e" fontFamily={MONO} fontSize={26} textAnchor="middle">{q}</text>
        ))}
        <text x={785} y={836} fill="#ff4060" fontFamily={MONO} fontSize={26} textAnchor="middle" fontWeight={600}>May 2026</text>
      </svg>
    </VCard>
  );
};
const VDonut: React.FC<{ slices: { color: string; frac: number; width?: number }[]; label: string; sub: string; p: number }> = ({ slices, label, sub, p }) => {
  const R = 240, C = 2 * Math.PI * R;
  let acc = 0;
  return (
    <svg viewBox="0 0 700 700" width={700} height={700} style={{ margin: '0 auto' }}>
      {slices.map((s, i) => {
        const dash = C * s.frac * p;
        const off = -C * acc;
        acc += s.frac;
        return <circle key={i} cx={350} cy={350} r={R} fill="none" stroke={s.color} strokeWidth={s.width ?? 96} strokeDasharray={`${dash} ${C - dash}`} strokeDashoffset={off} transform="rotate(-90 350 350)" />;
      })}
      <text x={350} y={332} fill="#e8eaf0" fontFamily={SANS} fontWeight={900} fontSize={80} textAnchor="middle">{label}</text>
      <text x={350} y={392} fill="#8892a4" fontFamily={SANS} fontSize={32} textAnchor="middle">{sub}</text>
    </svg>
  );
};
const VLegend: React.FC<{ rows: [string, string, string][] }> = ({ rows }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 30 }}>
    {rows.map(([color, name, pct]) => (
      <div key={name} style={{ fontFamily: SANS, fontSize: 30, color: '#e8eaf0', display: 'flex', alignItems: 'center', gap: 18 }}>
        <span style={{ width: 26, height: 26, borderRadius: '50%', background: color, display: 'inline-block' }} />
        {name} <span style={{ fontFamily: MONO, color: '#8892a4', marginLeft: 8 }}>{pct}</span>
      </div>
    ))}
  </div>
);
const VCtC6: React.FC = () => {
  const p = useDraw(4, 34);
  return (
    <VCard title="Japan's $1.7T Pension Fund" sub="GPIF target allocation — a quarter of it is foreign stocks"
      takeaway={<span><b style={{ color: '#a855f7' }}>Half the fund sits abroad</b><span style={{ color: '#8892a4' }}> — exposed if money goes home</span></span>}
      source="SOURCE: GPIF; FOREIGN EQUITY 25.34% Q3 FY2026. VERIFY AT RENDER.">
      <VDonut p={p} label="25.3%" sub="foreign stocks" slices={[
        { color: '#00e68a', frac: 0.25 }, { color: '#a855f7', frac: 0.2534, width: 110 }, { color: '#00c2ff', frac: 0.25 }, { color: '#ffd700', frac: 0.2466 },
      ]} />
      <VLegend rows={[['#a855f7', 'Foreign stocks', '25.34%'], ['#ffd700', 'Foreign bonds', '~25%'], ['#00e68a', 'Domestic stocks', '~25%'], ['#00c2ff', 'Domestic bonds', '~25%']]} />
    </VCard>
  );
};
const VCtDCycle: React.FC = () => {
  const f = useCurrentFrame();
  const stop = (i: number) => interpolate(f, [6 + i * 9, 16 + i * 9], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const stops = [
    { when: 'NOW', what: 'AI expansion begins', note: 'productivity already surging', color: '#00e68a' },
    { when: 'no Oct low', what: 'crowd buys back in', note: 'green candles, not the dip', color: '#00e68a' },
    { when: '2027', what: 'cycle top', note: 'could run longer', color: '#ffd700' },
    { when: 'beyond', what: 'multiple new all-time highs?', note: 'if the counterweight holds', color: '#8892a4' },
  ];
  return (
    <VCard title="The Thesis: an AI-Extended Cycle" sub="Mike's working roadmap — a thesis, not a promise"
      takeaway={<span><b style={{ color: '#00e68a' }}>The AI counterweight</b><span style={{ color: '#8892a4' }}> could push the top to 2027+. "But we shall see."</span></span>}
      source={'MIKE’S OWN THESIS (AS SPOKEN) — LABELS ONLY, NO DATA CLAIMS.'}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {stops.map((s, i) => (
          <React.Fragment key={s.when}>
            {i > 0 && <div style={{ width: 6, height: 60, background: stop(i) > 0.5 ? 'linear-gradient(180deg,#00e68a,#ffd700)' : '#1e2330', marginLeft: 46 }} />}
            <div style={{ display: 'flex', alignItems: 'center', gap: 30, opacity: stop(i) }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: s.color, boxShadow: s.color !== '#8892a4' ? `0 0 40px ${s.color}` : 'none', flexShrink: 0, marginLeft: 32 }} />
              <div>
                <div style={{ fontFamily: MONO, fontSize: 28, color: '#8892a4' }}>{s.when}</div>
                <div style={{ fontFamily: SANS, fontSize: 34, fontWeight: 700, color: s.color === '#8892a4' ? '#e8eaf0' : s.color }}>{s.what}</div>
                <div style={{ fontFamily: SANS, fontSize: 25, color: '#505a6e' }}>{s.note}</div>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </VCard>
  );
};

// ---------- vertical containers ----------
const VNode: React.FC<{ label: string; sub?: string; color?: string; dim?: boolean }> = ({ label, sub, color = '#1e2330', dim }) => (
  <div style={{ background: '#12151c', border: `2px solid ${color}`, borderRadius: 16, padding: '22px 26px', textAlign: 'center', opacity: dim ? 0.35 : 1 }}>
    <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, color: '#e8eaf0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
    {sub && <div style={{ fontFamily: MONO, fontSize: 23, color: '#8892a4', marginTop: 8 }}>{sub}</div>}
  </div>
);
const VDown: React.FC<{ flip?: boolean; hot?: boolean }> = ({ flip, hot }) => (
  <div style={{ fontSize: 44, color: hot ? '#ffd700' : '#8892a4', textAlign: 'center', transform: flip ? 'scaleY(-1)' : undefined }}>↓</div>
);
const VDOutflow: React.FC<{ state: 'out' | 'flip' | 'wobble' }> = ({ state }) => (
  <VCard title={state === 'wobble' ? 'When the Biggest Holder Steps Back' : 'Three Decades of Money, Flowing Out'}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <VNode label="JAPAN" sub="near-zero rates, ~30yrs" color="#ffd700" />
      <VDown flip={state !== 'out'} hot={state !== 'out'} />
      <VNode label="US TREASURIES" sub="~$1.24T held (Feb 2026)" color={state !== 'out' ? '#ff4060' : '#1e2330'} />
      <VDown />
      <VNode label="US STOCKS" sub="GPIF ~25% foreign equity" color={state === 'wobble' ? '#ff4060' : '#1e2330'} />
      <VDown />
      <VNode label="CRYPTO" sub="leveraged yen-funded positions" dim={state === 'wobble'} />
    </div>
    <div style={{ fontFamily: SANS, fontSize: 28, color: '#8892a4', marginTop: 40, textAlign: 'center' }}>
      {state === 'out' && 'Capital left Japan for decades — because home paid nothing.'}
      {state === 'flip' && 'Q1 2026: the Treasuries arrow just flipped. ~$29.6B went home.'}
      {state === 'wobble' && 'Bonds AND stocks step back at once → conditions tighten for every risk asset.'}
    </div>
  </VCard>
);
const VLaneCard: React.FC<{ lane: 1 | 2; solo?: boolean }> = ({ lane, solo }) => {
  const one = lane === 1;
  return (
    <div style={{ background: one ? 'rgba(80,90,110,.08)' : 'linear-gradient(135deg,rgba(255,64,96,.09),rgba(255,215,0,.05))',
      border: one ? '1px solid #1e2330' : '1px solid rgba(255,64,96,.28)', borderRadius: 16, padding: solo ? 52 : 36 }}>
      <div style={{ fontFamily: MONO, fontSize: solo ? 26 : 22, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#505a6e' }}>
        {one ? 'Lane 1 — Real money' : 'Lane 2 — Borrowed money'}</div>
      <div style={{ fontFamily: SANS, fontSize: solo ? 52 : 38, fontWeight: 700, color: '#e8eaf0', marginTop: 12 }}>
        {one ? 'Japanese savings' : 'Leveraged speculators'}</div>
      <div style={{ fontFamily: SANS, fontSize: solo ? 34 : 27, color: '#8892a4', marginTop: 16, lineHeight: 1.6 }}>
        {one ? 'Life insurers, pension funds, banks → convert → foreign bonds (mostly US Treasuries) + foreign stocks.'
             : 'Borrow yen at ~0% → convert → buy risk assets (stocks, crypto). A direct SHORT position on the yen.'}</div>
      <div style={{ fontFamily: MONO, fontSize: solo ? 34 : 28, color: one ? '#00e68a' : '#ff4060', marginTop: 18 }}>
        {one ? 'GPIF: ~25% foreign equity' : 'the fast-unwind lane'}</div>
    </div>
  );
};
const VDDualflow: React.FC<{ state: 'lanes' | 'lane1' | 'lane2' | 'scale' | 'conditions' }> = ({ state }) => {
  const f = useCurrentFrame();
  const pulse = 0.5 + 0.5 * Math.sin(f / 9);
  if (state === 'conditions')
    return (
      <VCard title="Both Lanes Rest on Two Conditions">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40, alignItems: 'center' }}>
          <div style={{ border: '2px solid #00c2ff', borderRadius: 100, padding: '28px 44px', fontFamily: MONO, fontSize: 33, color: '#00c2ff', textAlign: 'center' }}>1 — Japan keeps paying ~0%</div>
          <div style={{ border: '2px solid #00c2ff', borderRadius: 100, padding: '28px 44px', fontFamily: MONO, fontSize: 33, color: '#00c2ff', textAlign: 'center' }}>2 — the yen stays weak</div>
          <div style={{ border: `2px solid rgba(255,215,0,${0.4 + 0.5 * pulse})`, borderRadius: 16, padding: '24px 36px', fontFamily: SANS, fontSize: 29, color: '#ffd700', textAlign: 'center' }}>
            Change either one, and the math that justifies sending money abroad starts to break.</div>
        </div>
      </VCard>
    );
  if (state === 'lane1' || state === 'lane2')
    return (
      <VCard title={state === 'lane1' ? 'Lane 1: the Real Money' : 'Lane 2: the Borrowed Money'}>
        <VLaneCard lane={state === 'lane1' ? 1 : 2} solo />
      </VCard>
    );
  return (
    <VCard title="Two Kinds of Money, Same Trade">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}><VLaneCard lane={1} /><VLaneCard lane={2} /></div>
      <div style={{ marginTop: 36, textAlign: 'center' }}>
        {state === 'lanes' && <div style={{ fontFamily: SANS, fontSize: 28, color: '#8892a4' }}>Two very different investors. The same exact trade.</div>}
        {state === 'scale' && <div style={{ fontFamily: SANS, fontSize: 36, fontWeight: 900, color: '#e8eaf0' }}>Together: <span style={{ color: '#ffd700' }}>trillions of dollars</span> — not a niche trade.</div>}
      </div>
    </VCard>
  );
};
const VDSqueeze: React.FC<{ state: 'intro' | 'slow' | 'fast' | 'connect' }> = ({ state }) => {
  const slowDim = state === 'fast';
  const fastDim = state === 'slow' || state === 'intro';
  return (
    <VCard title="Two Ways This Unwinds">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
        <div style={{ opacity: slowDim ? 0.35 : 1 }}>
          <div style={{ fontFamily: MONO, fontSize: 23, color: '#00c2ff', letterSpacing: '0.1em', marginBottom: 12 }}>THE SLOW WAY — already moving</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <VNode label="JGB yields rise" color="#00c2ff" />
            <VDown /><VNode label="foreign return not worth FX risk" />
            <VDown /><VNode label="sell foreign, buy Japanese → yen demand rises" color={state === 'connect' ? '#ffd700' : '#1e2330'} />
          </div>
        </div>
        {state === 'connect' && <div style={{ textAlign: 'center', fontFamily: MONO, fontSize: 26, color: '#ffd700' }}>↓ the quiet reallocation lights the fast fuse ↓</div>}
        <div style={{ opacity: fastDim ? 0.35 : 1 }}>
          <div style={{ fontFamily: MONO, fontSize: 23, color: '#ff4060', letterSpacing: '0.1em', marginBottom: 12 }}>THE FAST WAY — loaded since 2024</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <VNode label="yen strengthens → shorts cover" color="#ff4060" />
            <VDown /><VNode label="loan cost rises" sub="sell stocks & crypto for cash" color="#ff4060" />
            <VDown /><VNode label="asset prices fall → loops back" color="#ff4060" />
          </div>
        </div>
      </div>
    </VCard>
  );
};
const VDWorkedMath: React.FC = () => {
  const f = useCurrentFrame();
  const s1 = interpolate(f, [6, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const s2 = interpolate(f, [140, 155], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const s3 = interpolate(f, [420, 440], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  return (
    <VCard title="One Trade, Both Sides Moving Against You">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div style={{ background: 'rgba(80,90,110,.08)', border: '1px solid #1e2330', borderRadius: 16, padding: 40, opacity: s1 }}>
          <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#505a6e' }}>The loan</div>
          <div style={{ fontFamily: MONO, fontSize: 36, fontWeight: 600, color: '#e8eaf0', marginTop: 12 }}>Borrow ¥ at ~0%</div>
          <div style={{ fontFamily: SANS, fontSize: 28, color: '#8892a4', marginTop: 14 }}>Yen strengthens <span style={{ color: '#ff4060', fontFamily: MONO }}>7%</span> against the dollar.</div>
          <div style={{ fontFamily: MONO, fontSize: 32, color: '#ff4060', marginTop: 14 }}>Loan costs 7% more to repay</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg,rgba(255,64,96,.09),rgba(255,215,0,.05))', border: '1px solid rgba(255,64,96,.28)', borderRadius: 16, padding: 40, opacity: s2 }}>
          <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#505a6e' }}>The asset</div>
          <div style={{ fontFamily: MONO, fontSize: 36, fontWeight: 600, color: '#e8eaf0', marginTop: 12 }}>Hold the risk asset</div>
          <div style={{ fontFamily: SANS, fontSize: 28, color: '#8892a4', marginTop: 14 }}>Everyone in the same trade sells at once.</div>
          <div style={{ fontFamily: MONO, fontSize: 32, color: '#ff4060', marginTop: 14 }}>Asset price ALSO drops</div>
        </div>
        <div style={{ textAlign: 'center', opacity: s3, transform: `scale(${0.94 + 0.06 * s3})` }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,64,96,.08)', border: '1px solid rgba(255,64,96,.25)', borderRadius: 12, padding: '22px 34px', fontFamily: SANS, fontSize: 29, color: '#e8eaf0' }}>
            Not two problems. <b style={{ color: '#ff4060' }}>One feedback loop.</b> <span style={{ color: '#505a6e', fontSize: 22 }}>(illustrative)</span>
          </div>
        </div>
      </div>
    </VCard>
  );
};

// ---------- cover element ----------
const fill = { width: '100%', height: '100%', objectFit: 'cover' } as const;
const chartEl = (ref: string) => {
  switch (ref) {
    case 'C1': return <VCtC1 />; case 'C2': return <VCtC2 />; case 'C3': return <VCtC3 />;
    case 'C4': return <VCtC4 />; case 'C5': return <VCtC5 />; case 'C6': return <VCtC6 />;
    default: return <VCtDCycle />;
  }
};
const deckEl = (ref: string, state?: string) => {
  switch (ref) {
    case 'D-OUTFLOW': return <VDOutflow state={(state as any) ?? 'out'} />;
    case 'D-DUALFLOW': return <VDDualflow state={(state as any) ?? 'lanes'} />;
    case 'D-SQUEEZE': return <VDSqueeze state={(state as any) ?? 'intro'} />;
    default: return <VDWorkedMath />;
  }
};
const useEnt = () => {
  const f = useCurrentFrame();
  return {
    opacity: interpolate(f, [0, 9], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    scale: interpolate(f, [0, 14], [0.97, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease }),
  };
};
const ShowcasePan: React.FC<{ file: string; durFrames: number }> = ({ file, durFrames }) => {
  const f = useCurrentFrame();
  const pos = interpolate(f, [10, durFrames - 10], [0, 88], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ background: '#0a1012' }}><Img src={staticFile('receipts/' + file + '.png')} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `center ${pos}%` }} /></AbsoluteFill>;
};
/** portrait receipts fit width; landscape receipts (cropped BIS) sit centered on dark bg */
const CoverEl: React.FC<{ c: Cover; i: number; noGlitch?: boolean }> = ({ c, i, noGlitch }) => {
  const { opacity, scale } = useEnt();
  const node = () => {
    if (c.kind === 'chart') return <AbsoluteFill>{chartEl(c.ref)}</AbsoluteFill>;
    if (c.kind === 'deck') return <AbsoluteFill>{deckEl(c.ref, c.state)}</AbsoluteFill>;
    if (c.kind === 'showcase') return <ShowcasePan file={c.ref} durFrames={F(c.tOut) - F(c.tIn)} />;
    if (c.kind === 'receipt')
      return <AbsoluteFill style={{ background: '#0a1012', justifyContent: 'center' }}><Img src={staticFile('receipts/' + RECEIPT[c.ref])} style={{ width: '100%', objectFit: 'contain' }} /></AbsoluteFill>;
    return <AbsoluteFill style={{ background: '#0a1012' }}><Img src={staticFile('broll/chatgpt-vertical/' + STILL[c.ref])} style={fill} /></AbsoluteFill>;
  };
  if (c.kind === 'vid')
    return <AbsoluteFill style={{ background: '#000' }}><OffthreadVideo src={staticFile(VID[c.ref])} muted style={{ ...fill, opacity, transform: `scale(${scale})` }} /></AbsoluteFill>;
  if (noGlitch) return node() as React.ReactElement;
  const id = glitchFor(c, i)!;
  return <TransitionClip id={id} cutFrame={8} outgoing={() => <AbsoluteFill />} incoming={node} />;
};

// ---------- overlays ----------
const InvertHit: React.FC<{ variant: number }> = ({ variant }) => {
  const f = useCurrentFrame();
  const pat = variant % 3 === 0 ? [0, 0.9, 0.15, 0.7, 0] : variant % 3 === 1 ? [0, 1, 0, 0.5, 0] : [0, 0.7, 0.3, 0.9, 0];
  const o = interpolate(f, [0, 2, 5, 7, 10], pat, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ background: '#fff', mixBlendMode: 'difference', opacity: o }} />;
};
const MonitorHit: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 2, 6, 8], [0, 0.85, 0.4, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <AbsoluteFill style={{ background: '#fff', mixBlendMode: 'difference', opacity: 0.5 }} />
      <AbsoluteFill style={{ background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.55) 0 3px, transparent 3px 7px)' }} />
    </AbsoluteFill>
  );
};
const LightLeak: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, dur * 0.3, dur * 0.7, dur], [0, 0.3, 0.3, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const y = interpolate(f, [0, dur], [24, 40]);
  return <AbsoluteFill style={{ background: `radial-gradient(circle at 50% ${y}%, rgba(255,190,120,0.9), rgba(255,140,60,0.25) 45%, transparent 70%)`, opacity: o, mixBlendMode: 'screen' }} />;
};
const SubscribeOverlay: React.FC = () => {
  const f = useCurrentFrame();
  const total = F(334.2) - F(325.5);
  const inO = interpolate(f, [0, 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  const outO = interpolate(f, [total - 8, total], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const wob = Math.sin(f / 3) * (f % 60 < 14 ? 7 : 0);
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 420, opacity: Math.min(inO, outO) }}>
      <div style={{ transform: `translateY(${(1 - inO) * 60}px)`, display: 'flex', alignItems: 'center', gap: 18, background: 'rgba(10,12,16,0.92)', border: '1px solid #2a3040', borderRadius: 100, padding: '16px 28px' }}>
        <div style={{ background: '#ff0000', color: '#fff', fontFamily: "'Segoe UI',Arial,sans-serif", fontWeight: 800, fontSize: 30, borderRadius: 10, padding: '9px 22px' }}>SUBSCRIBE</div>
        <div style={{ fontSize: 34, transform: `rotate(${wob}deg)`, display: 'inline-block' }}>{'🔔'}</div>
        <div style={{ color: '#e8eaf0', fontFamily: "'Segoe UI',Arial,sans-serif", fontWeight: 700, fontSize: 25 }}>+ the like button</div>
      </div>
    </AbsoluteFill>
  );
};
const PipGloss: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 8, F(461.5) - F(454.0) - 8, F(461.5) - F(454.0)], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 380, opacity: o }}>
      <div style={{ background: 'rgba(10,12,16,0.92)', border: '1px solid #2a3040', borderRadius: 14, padding: '16px 26px', fontFamily: MONO, fontSize: 24, color: '#e8eaf0', maxWidth: 960, textAlign: 'center', lineHeight: 1.5 }}>
        1 pip = ¥0.01 on USD/JPY {'→'} 500–1,000 pips {'≈'} a ¥5–10 move in days
      </div>
    </AbsoluteFill>
  );
};
const FlipCard: React.FC = () => {
  const f = useCurrentFrame();
  const dur = 42;
  const rot = interpolate(f, [0, 11, dur - 11, dur], [90, 0, 0, -90], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  const op = interpolate(f, [0, 7, dur - 7, dur], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', perspective: 1600 }}>
      <div style={{ transform: `rotateX(${rot}deg) translateZ(120px)`, opacity: op, transformStyle: 'preserve-3d', background: '#0a1012', width: 1080, height: 1920, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <div style={{ width: 110, height: 6, background: '#00c2ff', borderRadius: 3, marginBottom: 40 }} />
        <div style={{ fontFamily: "'Segoe UI',Arial,sans-serif", fontWeight: 800, fontSize: 82, color: '#fff', textAlign: 'center', lineHeight: 1.15, whiteSpace: 'pre-line' }}>{'What Exactly Is\na Carry Trade?'}</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- captions ----------
const COVER_WINDOWS = COVERS.map((c) => [sh(c.tIn), sh(c.tOut)] as [number, number]);
const CAPS = CAPTIONS_CT.map((c) => ({ tf: sh(c.t), h: c.h }));
const Captions: React.FC = () => {
  const t = useCurrentFrame() / CTV_FPS;
  if (!CAPTION_SRC.some(([a, b]) => t >= sh(a) && t < sh(b))) return null;
  if (COVER_WINDOWS.some(([a, b]) => t >= a && t < b)) return null;
  let idx = -1;
  for (let i = 0; i < CAPS.length; i++) { if (CAPS[i].tf <= t) idx = i; else break; }
  if (idx < 0) return null;
  const cap = CAPS[idx];
  const nextT = idx + 1 < CAPS.length ? CAPS[idx + 1].tf : Infinity;
  if (t >= Math.min(nextT, cap.tf + 1.1)) return null;
  const since = (t - cap.tf) * CTV_FPS;
  const pop = interpolate(since, [0, 5, 9], [0.7, 1.12, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 500 }}>
      <div style={{ fontFamily: "Montserrat,'Arial Black','Segoe UI',sans-serif", fontWeight: 900, fontSize: 88, color: '#fff', textTransform: 'lowercase', WebkitTextStroke: '13px #000', paintOrder: 'stroke fill', transform: `scale(${pop})`, letterSpacing: 1 }}>{cap.h}</div>
    </AbsoluteFill>
  );
};

// ---------- main ----------
export const CarryTradeVertical: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / CTV_FPS;
  let scale = 1;
  for (const [s, e] of PUNCH) { if (t >= s && t < e) scale = interpolate(t, [s, s + 0.4], [1, 1.16], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease }); }
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        {/* 16:9 spine center-cropped to 9:16 with a slight right bias (face sits ~52-56% x) */}
        <OffthreadVideo src={staticFile('spine.mp4')} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '54% 50%' }} />
      </AbsoluteFill>
      {FACE_HOLDS.map(([a, b], i) => {
        const m = (a + b) / 2, d = Math.min(b - a - 2, 4);
        return <Sequence key={'ll' + i} from={F(m - d / 2)} durationInFrames={F(m + d / 2) - F(m - d / 2)}><LightLeak dur={F(m + d / 2) - F(m - d / 2)} /></Sequence>;
      })}
      {COVERS.map((c, i) => {
        const prev = COVERS[i - 1];
        const contiguousSameRef = !!prev && prev.ref === c.ref && Math.abs(prev.tOut - c.tIn) < 0.05;
        return (
          <Sequence key={i} from={F(c.tIn)} durationInFrames={Math.max(1, F(c.tOut) - F(c.tIn))}><CoverEl c={c} i={i} noGlitch={contiguousSameRef} /></Sequence>
        );
      })}
      {FACE_CUTS.map((tc, i) => (
        <Sequence key={'fc' + i} from={F(tc) - 4} durationInFrames={11}><InvertHit variant={i} /></Sequence>
      ))}
      {PUNCH.map(([s], i) => (
        <Sequence key={'ph' + i} from={F(s)} durationInFrames={9}><MonitorHit /></Sequence>
      ))}
      <Sequence from={F(325.5)} durationInFrames={F(334.2) - F(325.5)}><SubscribeOverlay /></Sequence>
      <Sequence from={F(454.0)} durationInFrames={F(461.5) - F(454.0)}><PipGloss /></Sequence>
      <Sequence from={F(CARD_START)} durationInFrames={42}><FlipCard /></Sequence>
      <Captions />
    </AbsoluteFill>
  );
};

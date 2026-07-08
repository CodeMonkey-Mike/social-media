import React from 'react';
import {
  AbsoluteFill, OffthreadVideo, Img, Sequence, staticFile,
  useCurrentFrame, interpolate, Easing, useVideoConfig,
} from 'remotion';
import { ChartC13, ChartC3, ChartC5 } from './SmChartsAnim';
import { TransitionClip } from './transitions/TransitionClip';
import { CAPTIONS } from './smkCaptions';

export const SMKC_FPS = 30;
export const SMKC_DURATION = 5109; // 0 -> 170.3s (CH1-CH3)
const TEAL = '#49EACB', CYAN = '#00c2ff', MUTE = '#7e9897', PANEL = '#0f181b';
const ease = Easing.out(Easing.cubic);
const F = (t: number) => Math.round(t * SMKC_FPS);

// ---------------- cover layer ----------------
type Cover = { tIn: number; tOut: number; kind: 'chart' | 'still' | 'vid' | 'receipt' | 'container'; ref: string };
const COVERS: Cover[] = [
  // CH1
  { tIn: 4.4, tOut: 14.0, kind: 'container', ref: 'buycards' },
  { tIn: 14.0, tOut: 18.0, kind: 'receipt', ref: 'CH1-entityx-ledger' },
  { tIn: 18.0, tOut: 22.0, kind: 'vid', ref: 'CH1_onchain-network' },
  { tIn: 22.0, tOut: 29.43, kind: 'container', ref: 'bigstat42' },
  // CH2
  { tIn: 43.4, tOut: 62.0, kind: 'chart', ref: 'C13' },
  { tIn: 62.0, tOut: 70.0, kind: 'still', ref: 'CH2-whale-pod' },
  { tIn: 70.0, tOut: 74.0, kind: 'vid', ref: 'CH2_anon-figure' },
  { tIn: 74.0, tOut: 84.0, kind: 'container', ref: 'packstats' },
  { tIn: 84.0, tOut: 93.0, kind: 'chart', ref: 'C3' },
  { tIn: 93.0, tOut: 99.0, kind: 'receipt', ref: 'CH2-dailybuyer-ledger' },
  { tIn: 99.0, tOut: 107.03, kind: 'still', ref: 'CH2-whale-pod' },
  // CH3
  { tIn: 121.2, tOut: 147.13, kind: 'chart', ref: 'C5' },
  { tIn: 149.2, tOut: 159.0, kind: 'still', ref: 'KAS-blockdag' },
  { tIn: 159.0, tOut: 163.0, kind: 'vid', ref: 'CH3_tide-rising' },
  { tIn: 163.0, tOut: 167.83, kind: 'still', ref: 'KAS-blockdag' },
];

const FACE_CUTS = [4.4, 29.43, 43.4, 107.03, 121.2, 147.13, 149.2, 167.83];
const PUNCH: [number, number][] = [[1.8, 4.3], [31, 35.8], [38.6, 43.2], [109, 114.8], [118, 121.1], [168.2, 170.2]];
const CARDS: { t: number; title: string }[] = [
  { t: 37.0, title: 'Nobody Is Watching\nThe Other Whales' },
  { t: 116.5, title: 'This Has Been\nBuilding For Years' },
];
// captions ONLY over face holds (never over containers/charts/receipts) + the intro opener
const CAPTION_WINDOWS: [number, number][] = [[0, 4.4], [29.43, 43.4], [107.03, 121.2]];
const CARD_WINDOWS: [number, number][] = [[37.0, 38.6], [116.5, 118.1]];

// ---------------- entrance for still/vid/receipt/container ----------------
const useEnt = () => {
  const f = useCurrentFrame();
  return {
    opacity: interpolate(f, [0, 9], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    scale: interpolate(f, [0, 14], [0.97, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease }),
  };
};
const countUp = (f: number, a: number, b: number, target: number) =>
  target * interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });

// ---------------- CSS deck containers (ported, chart aesthetic, fill frame) ----------------
const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { opacity, scale } = useEnt();
  return (
    <AbsoluteFill style={{ background: '#0a1012', justifyContent: 'center', alignItems: 'center', fontFamily: "'Segoe UI',Arial,sans-serif" }}>
      <div style={{ width: 1680, height: 880, background: PANEL, borderRadius: 26, padding: 70, opacity, transform: `scale(${scale})`, boxSizing: 'border-box' }}>{children}</div>
    </AbsoluteFill>
  );
};
const BuyCards: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Shell>
      <div style={{ color: MUTE, fontSize: 26, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 14 }}>Chapter 1 / the buy you can see</div>
      <div style={{ color: '#fff', fontSize: 60, fontWeight: 800, lineHeight: 1.1 }}>The single biggest wallet bought <span style={{ color: TEAL }}>42 million</span> coins in a day</div>
      <div style={{ width: 90, height: 5, background: TEAL, borderRadius: 3, margin: '30px 0 40px' }} />
      <div style={{ display: 'flex', gap: 40 }}>
        {[['28,000,000 KAS', 'Pulled off Gate.io in one transaction', TEAL], ['14,000,000 KAS', 'Off Bitget, minutes later. Same wallet.', CYAN]].map(([n, s, c], i) => (
          <div key={i} style={{ flex: 1, background: '#12161d', border: '1px solid #1e2330', borderRadius: 16, padding: 40, opacity: interpolate(f, [6 + i * 6, 18 + i * 6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
            <div style={{ color: c as string, fontSize: 46, fontWeight: 800, fontFamily: 'Consolas,monospace' }}>{n}</div>
            <div style={{ color: MUTE, fontSize: 27, marginTop: 16 }}>{s}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 44, background: 'rgba(73,224,200,0.07)', border: '1px solid rgba(73,224,200,0.2)', borderRadius: 14, padding: '28px 34px', color: '#dfe6e6', fontSize: 29, lineHeight: 1.5 }}>
        You do not click-buy that on an order book without spiking the price. It went straight into self-custody, off the market.
      </div>
    </Shell>
  );
};
const BigStat42: React.FC = () => {
  const f = useCurrentFrame();
  const v = countUp(f, 6, 40, 42);
  return (
    <Shell>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ color: MUTE, fontSize: 30, letterSpacing: 3, textTransform: 'uppercase' }}>in a single day</div>
        <div style={{ color: TEAL, fontSize: 220, fontWeight: 900, lineHeight: 1, margin: '10px 0', fontFamily: 'Consolas,monospace' }}>{v.toFixed(0)}M</div>
        <div style={{ color: '#fff', fontSize: 46, fontWeight: 700 }}>KAS pulled straight off the exchanges</div>
      </div>
    </Shell>
  );
};
const PackStats: React.FC = () => {
  const f = useCurrentFrame();
  const big = countUp(f, 8, 44, 2.42);
  const stats = [['~$70M', 'accumulated, off the market'], ['11 / 14', 'whale wallets grew'], ['358', 'buys in 84 of the last 90 days']];
  return (
    <Shell>
      <div style={{ color: MUTE, fontSize: 26, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 14 }}>Chapter 2 / the other whales</div>
      <div style={{ color: '#fff', fontSize: 60, fontWeight: 800 }}>It is not one wallet. It is a <span style={{ color: TEAL }}>whole pack.</span></div>
      <div style={{ color: TEAL, fontSize: 150, fontWeight: 900, fontFamily: 'Consolas,monospace', margin: '20px 0 10px' }}>+{big.toFixed(2)}B KAS</div>
      <div style={{ display: 'flex', gap: 70, marginTop: 24 }}>
        {stats.map(([n, s], i) => (
          <div key={i} style={{ opacity: interpolate(f, [20 + i * 6, 32 + i * 6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
            <div style={{ color: TEAL, fontSize: 56, fontWeight: 700, fontFamily: 'Consolas,monospace' }}>{n}</div>
            <div style={{ color: MUTE, fontSize: 25, marginTop: 8, maxWidth: 360 }}>{s}</div>
          </div>
        ))}
      </div>
    </Shell>
  );
};
const CONTAINERS: Record<string, React.FC> = { buycards: BuyCards, bigstat42: BigStat42, packstats: PackStats };

const CoverEl: React.FC<{ c: Cover }> = ({ c }) => {
  const { opacity, scale } = useEnt();
  if (c.kind === 'chart') return c.ref === 'C13' ? <ChartC13 /> : c.ref === 'C3' ? <ChartC3 /> : <ChartC5 />;
  if (c.kind === 'container') { const C = CONTAINERS[c.ref]; return <C />; }
  if (c.kind === 'vid')
    return <AbsoluteFill style={{ background: '#000' }}><OffthreadVideo src={staticFile('vid/' + c.ref + '.mp4')} muted style={{ width: '100%', height: '100%', objectFit: 'cover', opacity, transform: `scale(${scale})` }} /></AbsoluteFill>;
  if (c.kind === 'still') {
    // glitch-in from black (Bad Signal), then hold
    const still = () => <AbsoluteFill style={{ background: '#0a1012' }}><Img src={staticFile('img/' + c.ref + '.png')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></AbsoluteFill>;
    return <TransitionClip id="badsignal-short-1" cutFrame={9} outgoing={() => <AbsoluteFill style={{ background: '#0a1012' }} />} incoming={still} />;
  }
  // receipt: webpage cap, full WIDTH, TOP-aligned, readable
  return <AbsoluteFill style={{ background: '#0a1012' }}><Img src={staticFile('receipts/' + c.ref + '.png')} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', opacity, transform: `scale(${scale})` }} /></AbsoluteFill>;
};

// ---------------- film burn on face cuts ----------------
const FilmBurn: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 5, 11], [0, 0.5, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 45%, rgba(255,180,90,0.9), rgba(255,120,40,0.2) 55%, transparent 75%)', opacity: o, mixBlendMode: 'screen' }} />;
};

// ---------------- hand-rolled CUBE chapter card ----------------
const CubeCard: React.FC<{ title: string }> = ({ title }) => {
  const f = useCurrentFrame();
  const dur = 46;
  const rot = interpolate(f, [0, 12, dur - 12, dur], [90, 0, 0, -90], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  const op = interpolate(f, [0, 8, dur - 8, dur], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', perspective: 1600 }}>
      <div style={{ transform: `rotateY(${rot}deg) translateZ(140px)`, opacity: op, transformStyle: 'preserve-3d', background: 'rgba(10,16,18,0.97)', width: 1920, height: 1080, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <div style={{ width: 110, height: 6, background: TEAL, borderRadius: 3, marginBottom: 40 }} />
        <div style={{ fontFamily: "'Segoe UI',Arial,sans-serif", fontWeight: 800, fontSize: 96, color: '#fff', textAlign: 'center', lineHeight: 1.1, whiteSpace: 'pre-line' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------- captions (montserrat preset, gated to windows) ----------------
const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / SMKC_FPS;
  if (!CAPTION_WINDOWS.some(([a, b]) => t >= a && t < b)) return null;
  if (CARD_WINDOWS.some(([a, b]) => t >= a && t < b)) return null; // no captions over a chapter card
  let idx = -1;
  for (let i = 0; i < CAPTIONS.length; i++) { if (CAPTIONS[i].t <= t) idx = i; else break; }
  if (idx < 0) return null;
  const cap = CAPTIONS[idx];
  const since = (t - cap.t) * SMKC_FPS;
  const pop = interpolate(since, [0, 5, 9], [0.7, 1.12, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 150 }}>
      <div style={{ fontFamily: "'Arial Black','Segoe UI',sans-serif", fontWeight: 900, fontSize: 96, color: '#fff', textTransform: 'lowercase', WebkitTextStroke: '13px #000', paintOrder: 'stroke fill', transform: `scale(${pop})`, letterSpacing: 1 }}>{cap.h}</div>
    </AbsoluteFill>
  );
};

// ---------------- main comp ----------------
export const SmkCh13: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / SMKC_FPS;
  // spine punch-in scale
  let scale = 1;
  for (const [s, e] of PUNCH) {
    if (t >= s && t < e) scale = interpolate(t, [s, s + 0.4], [1, 1.16], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  }
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        <OffthreadVideo src={staticFile('spine.mp4')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>
      {COVERS.map((c, i) => (
        <Sequence key={i} from={F(c.tIn)} durationInFrames={F(c.tOut) - F(c.tIn)}><CoverEl c={c} /></Sequence>
      ))}
      {FACE_CUTS.map((tc, i) => (
        <Sequence key={'fb' + i} from={F(tc) - 5} durationInFrames={11}><FilmBurn /></Sequence>
      ))}
      {CARDS.map((c, i) => (
        <Sequence key={'cc' + i} from={F(c.t)} durationInFrames={46}><CubeCard title={c.title} /></Sequence>
      ))}
      <Captions />
    </AbsoluteFill>
  );
};

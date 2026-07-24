import React from 'react';
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, interpolate, useCurrentFrame, Easing } from 'remotion';
import { CAPTIONS_CLARITY } from './clarityCaptions';
import { Container } from './clarityContainers';
import { ChartC1, ChartC2, ChartC3 } from './clarityCharts';

/** Clarity Act — FULL video (CH1-CH6 + PLUG). Public dir = media/<project>/render-assets.
 * Spine = un-keyed paused green-screen (Mike reverted the chroma key). Containers = code-rendered spotlight
 * cards (one per beat), charts = animated. Cues in SOURCE secs; sh() shifts past CH2@43 + CH4@210.3 pauses. */
export const CLR_FPS = 30;
const PAUSE = 1.0;
const CARD_T = [43.0, 210.3];
const sh = (t: number) => t + PAUSE * CARD_T.filter((c) => c <= t).length;
const cardStart = (b: number) => b + PAUSE * CARD_T.filter((c) => c < b).length;
const F = (t: number) => Math.round(sh(t) * CLR_FPS);
export const CLR_DURATION = Math.round(421.33 * CLR_FPS);
const ease = Easing.out(Easing.cubic);
const fill = { width: '100%', height: '100%', objectFit: 'cover' } as const;

const VID: Record<string, string> = {
  cap: 'br-capitol.mp4', head: 'br-headlines.mp4', crypto: 'br-crypto.mp4', gold: 'br-gold.mp4', print: 'br-print.mp4',
  oil: 'br-oil.mp4', treas: 'br-treasury.mp4', print2: 'br-print2.mp4', world: 'br-world.mp4', surv: 'br-surveil.mp4', infl: 'br-inflation.mp4',
};
const REC: Record<string, string> = { RS: 'receipts/R-STALL.png', RG: 'receipts/R-GENIUS.png', RC: 'receipts/R-CLARITY.png', RF: 'receipts/R-FORBES.png' };
const STILL: Record<string, string> = { CG1: 'img/CG1.png', CG2: 'img/CG2.png', CG3: 'img/CG3.png' };
// DIAGRAM_REFS: deck/D1.png deck/D2.png deck/D3.png deck/D4.png
// Rich OVERVIEW diagram slides — shown ONCE per section (~10s), then broken up into spotlight containers.
// See skills/broll-and-containers.md "⛔ THE BALANCE": full slide once + break-up containers COEXIST.
const DECK: Record<string, string> = { D1: 'deck/D1.png', D2: 'deck/D2.png', D3: 'deck/D3.png', D4: 'deck/D4.png' };

type Cover = { tIn: number; tOut: number; kind: 'container' | 'chart' | 'still' | 'vid' | 'receipt' | 'deck'; ref: string };
const COVERS: Cover[] = [
  // CH1
  { tIn: 0.0, tOut: 5.1, kind: 'receipt', ref: 'RS' }, { tIn: 5.46, tOut: 8.82, kind: 'vid', ref: 'cap' },
  { tIn: 9.26, tOut: 15.7, kind: 'vid', ref: 'head' }, { tIn: 21.3, tOut: 37.8, kind: 'vid', ref: 'crypto' },
  { tIn: 37.92, tOut: 42.8, kind: 'still', ref: 'CG1' },
  // CH2 — D1 timeline OVERVIEW (once ~11.7s), then break-up era containers + b-roll cutaways
  { tIn: 43.2, tOut: 54.9, kind: 'deck', ref: 'D1' }, { tIn: 54.9, tOut: 63.4, kind: 'vid', ref: 'gold' },
  { tIn: 63.4, tOut: 69.08, kind: 'vid', ref: 'print' }, { tIn: 69.08, tOut: 74.9, kind: 'container', ref: 'bw71' },
  { tIn: 75.2, tOut: 81.78, kind: 'container', ref: 'bw74' }, { tIn: 81.78, tOut: 91.88, kind: 'vid', ref: 'oil' },
  { tIn: 100.1, tOut: 107.52, kind: 'container', ref: 'bwToday' },
  // CH3 — D2 flow OVERVIEW (once ~11.8s), then break-up containers + receipt + b-roll
  { tIn: 107.76, tOut: 116.58, kind: 'vid', ref: 'print2' }, { tIn: 117.18, tOut: 129.0, kind: 'deck', ref: 'D2' },
  { tIn: 129.3, tOut: 136.54, kind: 'receipt', ref: 'RG' }, { tIn: 136.54, tOut: 143.82, kind: 'container', ref: 'genius' },
  { tIn: 144.1, tOut: 152.0, kind: 'vid', ref: 'treas' }, { tIn: 152.28, tOut: 161.72, kind: 'container', ref: 'forced' },
  // CH4 — D3 contrast OVERVIEW (once ~12.8s), then break-up container + b-roll
  { tIn: 210.42, tOut: 219.02, kind: 'still', ref: 'CG3' }, { tIn: 219.12, tOut: 231.92, kind: 'deck', ref: 'D3' },
  { tIn: 232.3, tOut: 241.36, kind: 'container', ref: 'privstable' }, { tIn: 241.46, tOut: 249.64, kind: 'vid', ref: 'world' },
  { tIn: 260.8, tOut: 267.14, kind: 'container', ref: 'privstable' },
  // CH5 — D4 hole OVERVIEW (once ~10.5s), then break-up containers + chart + receipts
  { tIn: 267.46, tOut: 278.0, kind: 'deck', ref: 'D4' }, { tIn: 278.0, tOut: 286.68, kind: 'container', ref: 'circle' },
  { tIn: 294.52, tOut: 300.14, kind: 'container', ref: 'coinbase' },
  { tIn: 300.14, tOut: 307.16, kind: 'chart', ref: 'C3' }, { tIn: 307.16, tOut: 312.3, kind: 'container', ref: 'circle' },
  { tIn: 312.3, tOut: 314.43, kind: 'receipt', ref: 'RF' }, { tIn: 318.64, tOut: 327.68, kind: 'receipt', ref: 'RC' },
  { tIn: 327.74, tOut: 347.48, kind: 'container', ref: 'coinbase' },
  // CH6
  { tIn: 347.66, tOut: 358.9, kind: 'chart', ref: 'C1' }, { tIn: 359.1, tOut: 368.96, kind: 'container', ref: 'pattern3' },
  { tIn: 369.48, tOut: 378.56, kind: 'chart', ref: 'C2' }, { tIn: 389.18, tOut: 397.0, kind: 'still', ref: 'CG2' },
  { tIn: 397.0, tOut: 412.72, kind: 'vid', ref: 'infl' },
  // 412.93-419.2 FACE close (end on face, no cutaway)
];
const FACE_CUTS = [15.93, 21.33, 92.1, 99.9, 162.17, 210.27, 249.87, 260.67, 286.8, 294.5, 314.43, 318.57, 378.67, 389.07, 412.93];
const FACE_HOLDS: [number, number][] = [[15.93, 21.33], [162.17, 210.27], [249.87, 260.67], [378.67, 389.07]];

const ent = (f: number) => ({ opacity: interpolate(f, [0, 9], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) });
const chartEl = (r: string) => (r === 'C1' ? <ChartC1 /> : r === 'C2' ? <ChartC2 /> : <ChartC3 />);
const CoverEl: React.FC<{ c: Cover }> = ({ c }) => {
  const f = useCurrentFrame(); const { opacity } = ent(f);
  if (c.kind === 'vid') return <AbsoluteFill style={{ background: '#000' }}><OffthreadVideo src={staticFile('vid/' + VID[c.ref])} muted style={{ ...fill, opacity }} /></AbsoluteFill>;
  if (c.kind === 'receipt') return <AbsoluteFill style={{ background: '#0a0c10', opacity }}><Img src={staticFile(REC[c.ref])} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} /></AbsoluteFill>;
  if (c.kind === 'still') return <AbsoluteFill style={{ background: '#000', opacity }}><Img src={staticFile(STILL[c.ref])} style={fill} /></AbsoluteFill>;
  if (c.kind === 'deck') return <AbsoluteFill style={{ background: '#0a0c10', opacity }}><Img src={staticFile(DECK[c.ref])} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></AbsoluteFill>;
  if (c.kind === 'chart') return <AbsoluteFill>{chartEl(c.ref)}</AbsoluteFill>;
  return <AbsoluteFill><Container id={c.ref} /></AbsoluteFill>;
};

const FilmBurn: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 4, 7, 11], [0, 0.85, 0.55, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ background: 'radial-gradient(circle at 52% 42%, rgba(255,180,90,0.95), rgba(255,120,40,0.35) 45%, transparent 72%)', opacity: o, mixBlendMode: 'screen' }} />;
};
const LightLeak: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, dur * 0.3, dur * 0.7, dur], [0, 0.26, 0.26, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const x = interpolate(f, [0, dur], [40, 60]);
  return <AbsoluteFill style={{ background: `radial-gradient(circle at ${x}% 28%, rgba(255,190,120,0.8), rgba(255,140,60,0.2) 45%, transparent 70%)`, opacity: o, mixBlendMode: 'screen' }} />;
};
const SubscribeOverlay: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, 6], [0.8, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  const o = interpolate(f, [0, 5, dur - 6, dur], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ opacity: o, transform: `scale(${s})` }}><Img src={staticFile('overlays/subscribe.png')} style={fill} /></AbsoluteFill>;
};
const RocketOverlay: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 7, dur - 8, dur], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const rise = interpolate(f, [0, dur], [30, -20], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ background: '#000', opacity: o }}>
      <Img src={staticFile('img/CG4.png')} style={fill} />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ transform: `translateY(${rise}px)`, fontFamily: "'Playfair Display','Georgia',serif", fontWeight: 900, fontSize: 200, color: '#fff', WebkitTextStroke: '4px rgba(0,0,0,0.4)', textShadow: '0 0 50px rgba(0,230,138,0.7)' }}>100X</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
const TitleCard: React.FC<{ title: string }> = ({ title }) => {
  const f = useCurrentFrame(); const dur = 36;
  const y = interpolate(f, [0, 9, dur - 8, dur], [70, 0, 0, -50], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  const op = interpolate(f, [0, 7, dur - 7, dur], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ background: '#0a0c10', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ transform: `translateY(${y}px)`, opacity: op, textAlign: 'center' }}>
        <div style={{ width: 120, height: 6, background: 'linear-gradient(90deg,#00e68a,#00c2ff)', borderRadius: 3, margin: '0 auto 34px' }} />
        <div style={{ fontFamily: "'Playfair Display','Georgia',serif", fontWeight: 900, fontSize: 96, color: '#e8eaf0', lineHeight: 1.05 }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};
const Captions: React.FC = () => {
  const t = useCurrentFrame() / CLR_FPS;
  if (t < 0 || t >= sh(42.8)) return null;
  let idx = -1;
  for (let i = 0; i < CAPTIONS_CLARITY.length; i++) { if (sh(CAPTIONS_CLARITY[i].t) <= t) idx = i; else break; }
  if (idx < 0) return null;
  const cap = CAPTIONS_CLARITY[idx];
  const nextT = idx + 1 < CAPTIONS_CLARITY.length ? sh(CAPTIONS_CLARITY[idx + 1].t) : Infinity;
  if (t >= Math.min(nextT, sh(cap.t) + 1.1)) return null;
  const since = (t - sh(cap.t)) * CLR_FPS;
  const pop = interpolate(since, [0, 5, 9], [0.7, 1.12, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 140 }}>
      <div style={{ fontFamily: "Montserrat,'Arial Black','Segoe UI',sans-serif", fontWeight: 900, fontSize: 88, color: '#fff', textTransform: 'lowercase', WebkitTextStroke: '12px #000', paintOrder: 'stroke fill', transform: `scale(${pop})` }}>{cap.h}</div>
    </AbsoluteFill>
  );
};

export const ClarityTest: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <OffthreadVideo src={staticFile('spine.mp4')} style={fill} />
    {FACE_HOLDS.map(([a, b], i) => { const m = (a + b) / 2, d = Math.min(b - a - 2, 4); return <Sequence key={'ll' + i} from={F(m - d / 2)} durationInFrames={F(m + d / 2) - F(m - d / 2)}><LightLeak dur={F(m + d / 2) - F(m - d / 2)} /></Sequence>; })}
    {COVERS.map((c, i) => <Sequence key={i} from={F(c.tIn)} durationInFrames={Math.max(1, F(c.tOut) - F(c.tIn))}><CoverEl c={c} /></Sequence>)}
    {FACE_CUTS.map((tc, i) => <Sequence key={'fc' + i} from={F(tc) - 4} durationInFrames={11}><FilmBurn /></Sequence>)}
    <Sequence from={Math.round(cardStart(43.0) * CLR_FPS)} durationInFrames={36}><TitleCard title="How the Dollar Won Twice" /></Sequence>
    <Sequence from={Math.round(cardStart(210.3) * CLR_FPS)} durationInFrames={36}><TitleCard title="The Trojan Horse" /></Sequence>
    <Sequence from={F(185.5)} durationInFrames={Math.round(2.0 * CLR_FPS)}><RocketOverlay dur={Math.round(2.0 * CLR_FPS)} /></Sequence>
    <Sequence from={F(193.0)} durationInFrames={Math.round(0.9 * CLR_FPS)}><SubscribeOverlay dur={Math.round(0.9 * CLR_FPS)} /></Sequence>
    <Captions />
  </AbsoluteFill>
);

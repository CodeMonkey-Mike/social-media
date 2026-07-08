import React from 'react';
import {
  AbsoluteFill, OffthreadVideo, Img, Sequence, staticFile,
  useCurrentFrame, interpolate, Easing,
} from 'remotion';
import { ChartC13, ChartC3, ChartC5 } from './SmChartsAnim';
import { ChartC6, ChartC10, ChartC11 } from './SmChartsAnim2';
import { TransitionClip } from './transitions/TransitionClip';
import { CAPTIONS } from './smkCaptions';

export const SMKF_FPS = 30;
export const SMKF_DURATION = 12025; // paused spine 0-400.84s (5 x 1s card pauses inserted)
const TEAL = '#49EACB';
const ease = Easing.out(Easing.cubic);

// card boundaries (source time); a 1s freeze+silence is baked into spine_paused.mp4 at each
const CARD_T = [35.36, 116.94, 171.15, 209.85, 323.71]; // mid-gap before each chapter's first spoken word (word-level verified)
const PAUSE = 1.0;
const sh = (t: number) => t + PAUSE * CARD_T.filter((c) => c <= t).length;        // content events
const cardStart = (b: number) => b + PAUSE * CARD_T.filter((c) => c < b).length;   // freeze start (final)
const F = (t: number) => Math.round(sh(t) * SMKF_FPS);

type Cover = { tIn: number; tOut: number; kind: 'chart' | 'still' | 'vid' | 'receipt' | 'deck' | 'showcase'; ref: string };
const COVERS: Cover[] = [
  // CH1
  { tIn: 4.4, tOut: 13.0, kind: 'deck', ref: 's2' },
  { tIn: 13.0, tOut: 18.0, kind: 'receipt', ref: 'CH1-entityx-ledger' },
  { tIn: 18.0, tOut: 22.0, kind: 'vid', ref: 'CH1_onchain-network' },
  { tIn: 22.0, tOut: 29.43, kind: 'receipt', ref: 'CH1-richlist' },
  { tIn: 34.6, tOut: 35.36, kind: 'receipt', ref: 'CH1-entityx-ledger' }, // 0:35 glance cover (ends at CH2 pause)
  // CH2 (de-duped: 2nd whale-pod -> CH0-whale-hero; s3 -> s3b single-focus)
  { tIn: 43.4, tOut: 62.0, kind: 'chart', ref: 'C13' },
  { tIn: 62.0, tOut: 70.0, kind: 'still', ref: 'CH2-whale-pod' },
  { tIn: 70.0, tOut: 74.0, kind: 'vid', ref: 'CH2_anon-figure' },
  { tIn: 74.0, tOut: 84.0, kind: 'deck', ref: 's3b' },
  { tIn: 84.0, tOut: 93.0, kind: 'chart', ref: 'C3' },
  { tIn: 93.0, tOut: 99.0, kind: 'receipt', ref: 'CH2-dailybuyer-ledger' },
  { tIn: 99.0, tOut: 107.03, kind: 'still', ref: 'CH0-whale-hero' },
  // CH3 (de-duped: 2nd blockdag -> KAS-coin-hero)
  { tIn: 121.2, tOut: 147.13, kind: 'chart', ref: 'C5' },
  { tIn: 149.2, tOut: 159.0, kind: 'still', ref: 'KAS-blockdag' },
  { tIn: 159.0, tOut: 163.0, kind: 'vid', ref: 'CH3_tide-rising' },
  { tIn: 163.0, tOut: 167.83, kind: 'still', ref: 'KAS-coin-hero' },
  // CH4
  { tIn: 176.53, tOut: 186.0, kind: 'chart', ref: 'C6' },
  { tIn: 186.0, tOut: 190.27, kind: 'vid', ref: 'CH4_red-storm' },
  // CH4 end + CH5 (de-duped: 2nd red-storm -> CH0_vault-opening)
  { tIn: 197.03, tOut: 201.0, kind: 'vid', ref: 'CH0_vault-opening' },
  { tIn: 201.0, tOut: 209.85, kind: 'still', ref: 'CH5-coins-dissolving' },
  { tIn: 210.0, tOut: 223.0, kind: 'receipt', ref: 'CH5-exchange-holdings' },
  { tIn: 223.0, tOut: 231.0, kind: 'deck', ref: 's6b' },
  { tIn: 231.0, tOut: 238.0, kind: 'still', ref: 'KAS-coin-vault' },
  { tIn: 238.0, tOut: 246.1, kind: 'chart', ref: 'C10' },
  // PLUG: face 246.1-263.5 (payoff + "one of the best communities around"); then COVER the rest
  { tIn: 263.5, tOut: 298.0, kind: 'showcase', ref: 'CH5-showcase' },
  { tIn: 298.0, tOut: 310.0, kind: 'deck', ref: 'quote' },
  { tIn: 310.0, tOut: 322.7, kind: 'showcase', ref: 'CH5-showcase' },
  // CH6
  { tIn: 324.0, tOut: 334.0, kind: 'chart', ref: 'C11' },
  { tIn: 334.0, tOut: 338.2, kind: 'vid', ref: 'CH6_pressure' },
  { tIn: 348.3, tOut: 354.17, kind: 'still', ref: 'KAS-off-exchange' },
  // CH7
  { tIn: 365.87, tOut: 371.73, kind: 'still', ref: 'CH7-whale-breach-dawn' },
  { tIn: 372.97, tOut: 376.43, kind: 'vid', ref: 'CH7_whale-swim-sunrise' },
];

const FACE_CUTS_SRC = [4.4, 29.43, 43.4, 107.03, 121.2, 147.13, 149.2, 167.83, 176.53, 190.27, 197.03, 246.1, 263.5, 323.77, 338.2, 348.3, 354.17, 365.87, 371.73, 372.97, 376.43];
const PUNCH_SRC: [number, number][] = [[1.8, 4.3], [31, 35.8], [38.6, 43.2], [109, 114.8], [118, 121.1], [169.5, 176.3], [192, 196.9], [247.5, 252.8], [340, 348], [356, 365.7], [378, 384], [388, 395]];
const CAPTION_SRC: [number, number][] = [[0, 4.4], [29.43, 43.4], [107.03, 121.2], [167.83, 176.53], [190.27, 197.03], [246.1, 263.5], [338.2, 348.3], [354.17, 365.87], [376.43, 395.83]];
const CARDS = [
  { t: 35.36, title: 'Nobody Is Watching\nThe Other Whales' },
  { t: 116.94, title: 'This Has Been\nBuilding For Years' },
  { t: 171.15, title: 'They Are Buying\nThe Bottom' },
  { t: 209.85, title: 'The Float Is Vanishing' },
  { t: 323.71, title: 'Why This Matters Now' },
];

// final-time windows (apply sh once)
const PUNCH = PUNCH_SRC.map(([a, b]) => [sh(a), sh(b)] as [number, number]);
const CAPTION_WINDOWS = CAPTION_SRC.map(([a, b]) => [sh(a), sh(b)] as [number, number]);
const CARD_WINDOWS = CARDS.map((c) => [cardStart(c.t), cardStart(c.t) + 1.6] as [number, number]);
const COVER_WINDOWS = COVERS.map((c) => [sh(c.tIn), sh(c.tOut)] as [number, number]); // captions never over a cover
const CAPS = CAPTIONS.map((c) => ({ tf: sh(c.t), h: c.h }));

const useEnt = () => {
  const f = useCurrentFrame();
  return {
    opacity: interpolate(f, [0, 9], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    scale: interpolate(f, [0, 14], [0.97, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease }),
  };
};
const chartEl = (ref: string) => {
  switch (ref) {
    case 'C13': return <ChartC13 />; case 'C3': return <ChartC3 />; case 'C5': return <ChartC5 />;
    case 'C6': return <ChartC6 />; case 'C10': return <ChartC10 />; default: return <ChartC11 />;
  }
};
const CoverEl: React.FC<{ c: Cover }> = ({ c }) => {
  const { opacity, scale } = useEnt();
  if (c.kind === 'chart') return chartEl(c.ref);
  if (c.kind === 'vid')
    return <AbsoluteFill style={{ background: '#000' }}><OffthreadVideo src={staticFile('vid/' + c.ref + '.mp4')} muted style={{ width: '100%', height: '100%', objectFit: 'cover', opacity, transform: `scale(${scale})` }} /></AbsoluteFill>;
  if (c.kind === 'still') {
    const still = () => <AbsoluteFill style={{ background: '#0a1012' }}><Img src={staticFile('img/' + c.ref + '.png')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></AbsoluteFill>;
    return <TransitionClip id="badsignal-short-1" cutFrame={9} outgoing={() => <AbsoluteFill style={{ background: '#0a1012' }} />} incoming={still} />;
  }
  if (c.kind === 'deck')
    return <AbsoluteFill style={{ background: '#0a0c10' }}><Img src={staticFile('deck/' + c.ref + '.png')} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity, transform: `scale(${scale})` }} /></AbsoluteFill>;
  return <AbsoluteFill style={{ background: '#0a1012' }}><Img src={staticFile('receipts/' + c.ref + '.png')} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', opacity, transform: `scale(${scale})` }} /></AbsoluteFill>;
};

const FilmBurn: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 5, 11], [0, 0.5, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 45%, rgba(255,180,90,0.9), rgba(255,120,40,0.2) 55%, transparent 75%)', opacity: o, mixBlendMode: 'screen' }} />;
};

const CubeCard: React.FC<{ title: string }> = ({ title }) => {
  const f = useCurrentFrame();
  const dur = 42;
  const rot = interpolate(f, [0, 11, dur - 11, dur], [90, 0, 0, -90], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  const op = interpolate(f, [0, 7, dur - 7, dur], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', perspective: 1600 }}>
      <div style={{ transform: `rotateY(${rot}deg) translateZ(140px)`, opacity: op, transformStyle: 'preserve-3d', background: '#0a1012', width: 1920, height: 1080, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <div style={{ width: 110, height: 6, background: TEAL, borderRadius: 3, marginBottom: 40 }} />
        <div style={{ fontFamily: "'Segoe UI',Arial,sans-serif", fontWeight: 800, fontSize: 96, color: '#fff', textAlign: 'center', lineHeight: 1.1, whiteSpace: 'pre-line' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / SMKF_FPS;
  if (!CAPTION_WINDOWS.some(([a, b]) => t >= a && t < b)) return null;
  if (CARD_WINDOWS.some(([a, b]) => t >= a && t < b)) return null;
  if (COVER_WINDOWS.some(([a, b]) => t >= a && t < b)) return null; // never caption over a cover
  let idx = -1;
  for (let i = 0; i < CAPS.length; i++) { if (CAPS[i].tf <= t) idx = i; else break; }
  if (idx < 0) return null;
  const cap = CAPS[idx];
  const nextT = idx + 1 < CAPS.length ? CAPS[idx + 1].tf : Infinity;
  if (t >= Math.min(nextT, cap.tf + 1.1)) return null; // clear after the word / on a gap
  const since = (t - cap.tf) * SMKF_FPS;
  const pop = interpolate(since, [0, 5, 9], [0.7, 1.12, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 150 }}>
      <div style={{ fontFamily: "'Arial Black','Segoe UI',sans-serif", fontWeight: 900, fontSize: 96, color: '#fff', textTransform: 'lowercase', WebkitTextStroke: '13px #000', paintOrder: 'stroke fill', transform: `scale(${pop})`, letterSpacing: 1 }}>{cap.h}</div>
    </AbsoluteFill>
  );
};

export const SmkFull: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / SMKF_FPS;
  let scale = 1;
  for (const [s, e] of PUNCH) { if (t >= s && t < e) scale = interpolate(t, [s, s + 0.4], [1, 1.16], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease }); }
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        <OffthreadVideo src={staticFile('spine_paused3.mp4')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>
      {COVERS.map((c, i) => (
        <Sequence key={i} from={F(c.tIn)} durationInFrames={Math.max(1, F(c.tOut) - F(c.tIn))}><CoverEl c={c} /></Sequence>
      ))}
      {FACE_CUTS_SRC.map((tc, i) => (<Sequence key={'fb' + i} from={Math.round(sh(tc) * SMKF_FPS) - 5} durationInFrames={11}><FilmBurn /></Sequence>))}
      {CARDS.map((c, i) => (<Sequence key={'cc' + i} from={Math.round(cardStart(c.t) * SMKF_FPS)} durationInFrames={42}><CubeCard title={c.title} /></Sequence>))}
      <Captions />
    </AbsoluteFill>
  );
};

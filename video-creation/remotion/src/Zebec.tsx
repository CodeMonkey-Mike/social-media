import React from 'react';
import {
  AbsoluteFill, OffthreadVideo, Img, Sequence, staticFile,
  useCurrentFrame, interpolate, Easing,
} from 'remotion';
import { ZCOVERS } from './zebecCovers';
import { ZCAPTIONS } from './zebecCaptions';
import { DemandVsFloat, TractionScoreboard, BuybackFlywheel } from './zebecCharts';
import { ENGINES, getTransition, framesForRow } from './transitions';
import { loadFont as loadPlayfair2 } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadDMSans2 } from '@remotion/google-fonts/DMSans';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
loadPlayfair2('normal', { weights: ['700', '900'], subsets: ['latin'], ignoreTooManyRequestsWarning: true });
loadDMSans2('normal', { weights: ['400', '600', '700'], subsets: ['latin'], ignoreTooManyRequestsWarning: true });
loadMontserrat('normal', { weights: ['900'], subsets: ['latin'], ignoreTooManyRequestsWarning: true });

// zebec "ZBCN about to go vertical?" - longform-edited draft comp.
// Spine: ALL.c.desilenced.mp4 (458.54s), face baked visible 45.3-52.86, black on every cover beat.
// DRAFT scope: sh() = identity (chapter title-card AUDIO pauses baked in the HQ pass); static chart PNGs;
// music mixed post-render via ffmpeg (MUSIC-PLAN.json). Full cover layer, film-burn face, overlay title cards.
export const ZEBEC_FPS = 30;
const SPINE_SECS = 458.54;
export const ZEBEC_DURATION = Math.round(SPINE_SECS * ZEBEC_FPS); // 13756
const ease = Easing.out(Easing.cubic);
const F = (t: number) => Math.round(t * ZEBEC_FPS);

// palette (canonical presentation.md)
const GREEN = '#00e68a', TEXT = '#e8eaf0', MUTED = '#505a6e';

// FACE window (the one face beat, per the per-video override): 45.3 - 52.86
const FACE_IN = 45.3, FACE_OUT = 52.86;
const FACE_CUTS = [FACE_IN, FACE_OUT];               // film-burn on the cut into + out of face
const PUNCH: [number, number][] = [[47.6, 52.4]];    // ~15% punch-in mid-face (>2s hold)

// chapter title cards (overlay; no baked pause in the draft)
const CARDS = [
  { t: 76.24, ey: 'Chapter 2', title: 'The Product' },
  { t: 151.32, ey: 'Chapter 3', title: 'The Good' },
  { t: 268.30, ey: 'Chapter 4', title: 'The Bad' },
  { t: 390.22, ey: 'Chapter 5', title: 'Why I Am Bullish' },
];

const fill = { width: '100%', height: '100%', objectFit: 'cover' } as const;

// TRANSITIONS from the library (Swiftly->Remotion): 6 OFFSET + 2 DEVIATION + 2 EXPAND, placed here-and-there
// across image->image cover boundaries (centered on the cut, engine swaps from->to under peak motion blur).
const TRANS: { t: number; id: string; from: string; to: string }[] = [
  { t: 32.02, id: 'offset-simple-left', from: 'receipts/R2B.png', to: 'deck/price-vs-mcap.png' },
  { t: 37.22, id: 'offset-simple-up', from: 'deck/price-vs-mcap.png', to: 'receipts/R9.png' },
  { t: 97.26, id: 'offset-simple-right', from: 'deck/solana-chip.png', to: 'deck/payfi.png' },
  { t: 140.66, id: 'deviation-optics-2x', from: 'deck/real-real-real.png', to: 'deck/serious-names.png' },
  { t: 232.44, id: 'expand-pan-up', from: 'deck/float-fixed.png', to: 'deck/flywheel-buyback.png' },
  { t: 262.32, id: 'offset-simple-left-up', from: 'deck/depends.png', to: 'deck/parabolic-ponder.png' },
  { t: 299.70, id: 'offset-simple-down', from: 'deck/split-adjusted.png', to: 'deck/insiders.png' },
  { t: 310.06, id: 'offset-long-simple-right', from: 'deck/insiders.png', to: 'deck/trust-question.png' },
  { t: 376.00, id: 'deviation-shift-4x', from: 'deck/who-runs-it.png', to: 'deck/sam-vs-simon.png' },
  { t: 436.26, id: 'expand-pan-left', from: 'deck/why-bullish.png', to: 'deck/still-has-to.png' },
];

const useEnt = () => {
  const f = useCurrentFrame();
  return {
    opacity: interpolate(f, [0, 9], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    scale: interpolate(f, [0, 14], [0.94, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease }),
  };
};

// TRANSITIONS bucket 2: AI / ChatGPT stills get a fast bad-signal GLITCH on ingress (~9f) — hand-rolled
// RGB-split + slice jump, no external assets (self-contained). Settles to a clean still.
const Glitch: React.FC<{ img: string }> = ({ img }) => {
  const f = useCurrentFrame();
  const src = staticFile('img/' + img + '.png');
  const on = f < 10;
  const sh = interpolate(f, [0, 10], [22, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const flick = on ? (f % 2 === 0 ? 1 : 0.72) : 1;
  const band = f < 8 ? interpolate(f, [0, 8], [40, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
  const baseO = interpolate(f, [0, 6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ background: '#05070d', opacity: flick }}>
      {on && <Img src={src} style={{ ...fill, opacity: 0.55, mixBlendMode: 'screen', filter: 'sepia(1) saturate(6) hue-rotate(-25deg)', transform: `translateX(${-sh}px)` }} />}
      {on && <Img src={src} style={{ ...fill, opacity: 0.55, mixBlendMode: 'screen', filter: 'sepia(1) saturate(6) hue-rotate(150deg)', transform: `translateX(${sh}px)` }} />}
      <Img src={src} style={{ ...fill, opacity: baseO, transform: `translateY(${band}px)`, clipPath: band ? 'inset(38% 0 22% 0)' : 'none' }} />
      <Img src={src} style={{ ...fill, opacity: baseO }} />
    </AbsoluteFill>
  );
};

const CoverEl: React.FC<{ c: typeof ZCOVERS[number] }> = ({ c }) => {
  const { opacity, scale } = useEnt();
  if (c.kind === 'chart') {
    if (c.ref === 'demand-vs-float') return <DemandVsFloat />;
    if (c.ref === 'traction-scoreboard') return <TractionScoreboard />;
    if (c.ref === 'buyback-flywheel') return <BuybackFlywheel />;
    return <AbsoluteFill style={{ background: '#0a0c10' }}><Img src={staticFile('charts/' + c.ref + '.png')} style={{ ...fill, opacity, transform: `scale(${scale})` }} /></AbsoluteFill>;
  }
  if (c.kind === 'vid')
    return <AbsoluteFill style={{ background: '#000' }}><OffthreadVideo src={staticFile('vid/' + c.ref + '.mp4')} muted style={{ ...fill, opacity }} /></AbsoluteFill>;
  if (c.kind === 'still') return <Glitch img={c.ref} />;
  if (c.kind === 'receipt')
    return <AbsoluteFill style={{ background: '#0a0c10' }}><Img src={staticFile('receipts/' + c.ref + '.png')} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', opacity }} /></AbsoluteFill>;
  return <AbsoluteFill style={{ background: '#0a0c10' }}><Img src={staticFile('deck/' + c.ref + '.png')} style={{ ...fill, opacity, transform: `scale(${scale})` }} /></AbsoluteFill>;
};

// Captions: word-level, over the 0-31 hook (on covers, deliberate) + the 45.3-52.86 face scene. Topmost.
const CAP_WINDOWS: [number, number][] = [[0, 31.0], [45.3, 52.86]];
const Captions: React.FC = () => {
  const t = useCurrentFrame() / ZEBEC_FPS;
  if (!CAP_WINDOWS.some(([a, b]) => t >= a && t < b)) return null;
  let cur: { t: number; h: string } | null = null;
  for (const c of ZCAPTIONS) { if (c.t <= t) cur = c; else break; }
  if (!cur) return null;
  const nextT = (ZCAPTIONS.find((c) => c.t > cur!.t) || { t: Infinity }).t;
  if (t >= Math.min(nextT, cur.t + 1.3)) return null;
  const since = (t - cur.t) * ZEBEC_FPS;
  const pop = interpolate(since, [0, 5, 9], [0.72, 1.12, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 140, zIndex: 50 }}>
      <div style={{ fontFamily: "Montserrat,'Arial Black','Segoe UI',sans-serif", fontWeight: 900, fontSize: 88, color: '#fff', textTransform: 'lowercase', WebkitTextStroke: '12px #000', paintOrder: 'stroke fill', transform: `scale(${pop})` }}>{cur.h}</div>
    </AbsoluteFill>
  );
};

const FilmBurn: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 5, 11], [0, 0.5, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 45%, rgba(255,180,90,0.9), rgba(255,120,40,0.2) 55%, transparent 75%)', opacity: o, mixBlendMode: 'screen' }} />;
};

const TitleCard: React.FC<{ ey: string; title: string }> = ({ ey, title }) => {
  const f = useCurrentFrame();
  const dur = 40;
  const op = interpolate(f, [0, 7, dur - 8, dur], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const y = interpolate(f, [0, 12], [26, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  return (
    <AbsoluteFill style={{ background: '#0a0c10', justifyContent: 'center', alignItems: 'flex-start', padding: '0 140px', opacity: op }}>
      <div style={{ transform: `translateY(${y}px)` }}>
        <div style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 30, letterSpacing: '.18em', textTransform: 'uppercase', color: MUTED, marginBottom: 22 }}>{ey}</div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 104, color: TEXT, lineHeight: 1.05, letterSpacing: '-.02em' }}>{title}</div>
        <div style={{ width: 72, height: 5, background: `linear-gradient(90deg, ${GREEN}, #00c2ff)`, borderRadius: 3, marginTop: 30 }} />
      </div>
    </AbsoluteFill>
  );
};

export const Zebec: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / ZEBEC_FPS;
  let scale = 1;
  for (const [s, e] of PUNCH) { if (t >= s && t < e) scale = interpolate(t, [s, s + 0.5], [1, 1.15], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease }); }
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        <OffthreadVideo src={staticFile('spine.mp4')} style={fill} />
      </AbsoluteFill>
      {ZCOVERS.map((c, i) => (
        <Sequence key={i} from={F(c.tIn)} durationInFrames={Math.max(1, F(c.tOut) - F(c.tIn))}><CoverEl c={c} /></Sequence>
      ))}
      {TRANS.map((x, i) => {
        const row = getTransition(x.id);
        if (!row) return null;
        const Engine = ENGINES[row.engine];
        if (!Engine) return null;
        const win = framesForRow(row, ZEBEC_FPS);
        const A = staticFile(x.from), B = staticFile(x.to);
        return (
          <Sequence key={'tr' + i} from={Math.max(0, F(x.t) - Math.round(win / 2))} durationInFrames={win}>
            <Engine from={<Img src={A} style={fill} />} to={<Img src={B} style={fill} />} fromSrc={x.from} toSrc={x.to} durationInFrames={win} params={row.params} sfxSrc={null} />
          </Sequence>
        );
      })}
      {FACE_CUTS.map((tc, i) => (<Sequence key={'fb' + i} from={F(tc) - 5} durationInFrames={11}><FilmBurn /></Sequence>))}
      {CARDS.map((c, i) => (<Sequence key={'cc' + i} from={F(c.t)} durationInFrames={40}><TitleCard ey={c.ey} title={c.title} /></Sequence>))}
      <Captions />
    </AbsoluteFill>
  );
};

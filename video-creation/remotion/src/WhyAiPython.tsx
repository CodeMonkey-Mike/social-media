import React from 'react';
import { AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate, useCurrentFrame, staticFile } from 'remotion';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadDMSans } from '@remotion/google-fonts/DMSans';
import { loadFont as loadJetBrains } from '@remotion/google-fonts/JetBrainsMono';

loadPlayfair('normal', { weights: ['400', '700', '900'], subsets: ['latin'] });
loadDMSans('normal', { weights: ['300', '400', '500', '700'], subsets: ['latin'] });
loadJetBrains('normal', { weights: ['400', '600', '700'], subsets: ['latin'] });

export const WAP_FPS = 30;
export const WAP_DURATION = 4862; // 162.05s narration

const W = 1920;
const H = 1080;

const C = {
  bgDeep: '#0a0c10', bgCard: '#12151c', border: '#1e2330',
  cyan: '#00c2ff', gold: '#ffd700', red: '#ff4060', purple: '#a855f7', green: '#00e68a',
  pri: '#e8eaf0', sec: '#8892a4', mut: '#505a6e',
};
const SERIF = "'Playfair Display', serif";
const SANS = "'DM Sans', sans-serif";
const MONO = "'JetBrains Mono', monospace";

const asset = (f: string) => staticFile(`projects/why-ai-python/${f}`);
const useT = () => useCurrentFrame() / WAP_FPS;

// Music bed gain, expressed Premiere-style in dB on the clip (Mike thinks -20..-35 dB).
// The source corporate track is mastered hot (-10.5 LUFS vs -24 LUFS narration), so -30 dB
// lands the bed ~16 dB under the VO (≈ -40 LUFS). Change MUSIC_DB to retune (e.g. -25 louder, -35 quieter).
const MUSIC_DB = -30;
const MUSIC_GAIN = Math.pow(10, MUSIC_DB / 20); // ≈ 0.0316

// ───────────────────────── spotlight atoms (full-screen, no spine strip) ─────────────────────────

const TitleScene: React.FC<{ label: string; title: React.ReactNode; divFrom: string; divTo: string }> = ({ label, title, divFrom, divTo }) => (
  <div>
    <p style={{ fontFamily: SANS, fontSize: 26, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.18em', color: C.mut, margin: 0 }}>{label}</p>
    <h1 style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 104, lineHeight: 1.06, letterSpacing: '-0.02em', color: C.pri, margin: '26px 0 0' }}>{title}</h1>
    <div style={{ width: 110, height: 5, background: `linear-gradient(90deg, ${divFrom}, ${divTo})`, borderRadius: 3, marginTop: 40 }} />
  </div>
);

const LibItem: React.FC<{ name: string; desc: string }> = ({ name, desc }) => (
  <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 16, padding: '30px 22px', textAlign: 'center' }}>
    <div style={{ fontFamily: MONO, fontWeight: 600, fontSize: 34, color: C.pri, marginBottom: 8 }}>{name}</div>
    <div style={{ fontFamily: SANS, fontSize: 23, color: C.mut, lineHeight: 1.35 }}>{desc}</div>
  </div>
);

const LibGrid: React.FC = () => (
  <div>
    <p style={{ fontFamily: SANS, fontSize: 26, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.18em', color: C.green, margin: '0 0 30px' }}>The Python standard, by category</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22 }}>
      {[['PyTorch', 'Deep learning'], ['TensorFlow', "Google's ML"], ['NumPy', 'Array math'], ['Pandas', 'Data wrangling'],
        ['Transformers', 'Hugging Face hub'], ['scikit-learn', 'Classical ML'], ['LangChain', 'LLM orchestration'], ['OpenCV', 'Computer vision']]
        .map(([n, d]) => <LibItem key={n} name={n} desc={d} />)}
    </div>
  </div>
);

const Card: React.FC<{ accent: string; head: string; body: string }> = ({ accent, head, body }) => (
  <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 22, padding: '48px 46px', position: 'relative', overflow: 'hidden', boxShadow: '0 24px 70px rgba(0,0,0,0.45)' }}>
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${accent}, transparent)` }} />
    <h3 style={{ fontFamily: SANS, fontWeight: 700, fontSize: 34, textTransform: 'uppercase', letterSpacing: '0.04em', color: accent, margin: '0 0 22px' }}>{head}</h3>
    <p style={{ fontFamily: SANS, fontSize: 30, color: C.sec, lineHeight: 1.6, margin: 0 }}>{body}</p>
  </div>
);

const Grid2: React.FC = () => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 }}>
    <Card accent={C.green} head="What Python Does" body="Defines the model, configures training, orchestrates the pipeline. A few readable lines. It's the conductor." />
    <Card accent={C.cyan} head="What Actually Runs" body="C++, CUDA, and native GPU code. NumPy is C. PyTorch is C++. NVIDIA built its stack with Python as the front door. That's the orchestra." />
  </div>
);

const Grid3: React.FC = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 26 }}>
    <Card accent={C.gold} head="Browser & Edge" body="Transformers.js and ONNX Runtime Web run real models client-side, at low-latency on the edge." />
    <Card accent={C.cyan} head="Product Integration" body="The Vercel AI SDK and OpenAI SDK make chat UIs, streaming, and tool-calling native to JavaScript." />
    <Card accent={C.purple} head="The Split" body="Python builds and trains the model. JavaScript ships it to users. Most AI products are exactly this pairing." />
  </div>
);

// ───────────────────────── scenes ─────────────────────────

type Orb = { color: string; size: number; top?: number; bottom?: number; left?: number; right?: number; opacity: number };
type Scene = { t: number; chapter: number; flip?: boolean; node: React.ReactNode };

const CHAPTER_ORBS: Orb[][] = [
  [{ color: C.green, size: 560, top: -180, right: -120, opacity: 0.10 }, { color: C.cyan, size: 440, bottom: -140, left: -150, opacity: 0.09 }],
  [{ color: C.green, size: 540, bottom: -160, right: -110, opacity: 0.10 }, { color: C.cyan, size: 360, top: -120, left: -90, opacity: 0.07 }],
  [{ color: C.gold, size: 500, top: -150, left: -110, opacity: 0.09 }, { color: C.purple, size: 420, bottom: -140, right: -90, opacity: 0.09 }],
  [{ color: C.gold, size: 520, bottom: -160, left: -110, opacity: 0.10 }, { color: C.cyan, size: 360, top: -120, right: -90, opacity: 0.07 }],
  [{ color: C.green, size: 640, top: 200, left: 640, opacity: 0.12 }, { color: C.cyan, size: 420, bottom: -120, right: -80, opacity: 0.08 }],
];

const SCENES: Scene[] = [
  // CH0 — slide 1 (the question)
  {
    t: 0, chapter: 0, flip: true,
    node: (
      <TitleScene label="A Developer's Question" divFrom={C.green} divTo={C.cyan}
        title={<>Why does AI speak <span style={{ color: C.green }}>Python</span>,<br />not <span style={{ color: C.cyan }}>JavaScript</span>?</>} />
    ),
  },
  // CH1 — slide 2 (library moat)
  { t: 23.4, chapter: 1, flip: true, node: <TitleScene label="Reason One" divFrom={C.green} divTo={C.cyan} title={<>The library moat<br />you can&apos;t cross.</>} /> },
  { t: 27.4, chapter: 1, node: <LibGrid /> }, // "Look at all these libraries right here" @ 27.10
  // CH2 — slide 3 (slow / conductor / GPU)
  { t: 58.54, chapter: 2, flip: true, node: <TitleScene label="Reason Two" divFrom={C.gold} divTo={C.red} title={<>Python is slow.<br />AI doesn&apos;t care.</>} /> },
  { t: 71.2, chapter: 2, node: <Grid2 /> },
  // CH3 — slide 4 (JS owns the product)
  { t: 100.76, chapter: 3, flip: true, node: <TitleScene label="The Other Half" divFrom={C.gold} divTo={C.red} title={<>JavaScript still<br />owns the product.</>} /> },
  { t: 112.24, chapter: 3, node: <Grid3 /> },
  // CH4 — slide 5 (closing: both)
  {
    t: 132.4, chapter: 4, flip: true,
    node: (
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontFamily: SANS, fontSize: 26, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.2em', color: C.mut, margin: '0 0 18px' }}>The Takeaway</p>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 150, lineHeight: 1, background: `linear-gradient(135deg, ${C.green}, ${C.cyan})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 12 }}>Both.</div>
        <h1 style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 76, lineHeight: 1.1, color: C.pri, margin: 0 }}>
          Python won the <span style={{ color: C.green }}>research</span>.<br />JavaScript wins the <span style={{ color: C.cyan }}>product</span>.
        </h1>
      </div>
    ),
  },
  {
    t: 138.48, chapter: 4,
    node: (
      <p style={{ fontFamily: SERIF, fontSize: 52, fontWeight: 400, color: C.pri, lineHeight: 1.5, margin: 0, textAlign: 'center', maxWidth: 1400 }}>
        You don&apos;t have to abandon JavaScript. Learn enough Python to <span style={{ color: C.green }}>read</span> what the AI world writes, and keep building the parts users actually see in the stack you already know.
      </p>
    ),
  },
];

const SceneFrame: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <AbsoluteFill style={{ padding: '0 150px', display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }}>
    <div style={{ width: '100%', maxWidth: 1500, marginLeft: 'auto', marginRight: 'auto', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>{children}</div>
  </AbsoluteFill>
);

// HOUSE RULE #4: presentation content transitions OUT before ANY overlay appears, back IN after.
const sceneVisibility = (t: number): number => {
  let occluded = 0;
  for (const [a, b] of OCCLUSIONS) {
    const rampIn = interpolate(t, [a - 0.35, a], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const rampOut = interpolate(t, [b, b + 0.35], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    occluded = Math.max(occluded, Math.min(rampIn, rampOut));
  }
  return 1 - occluded;
};

const ContentBody: React.FC = () => {
  const t = useT();
  let idx = 0;
  for (let i = 0; i < SCENES.length; i++) if (t >= SCENES[i].t) idx = i;
  const cur = SCENES[idx];
  const prev = idx > 0 ? SCENES[idx - 1] : null;
  const orbs = CHAPTER_ORBS[cur.chapter];
  const vis = sceneVisibility(t);

  const dur = cur.flip ? 0.65 : 0.35;
  const p = interpolate(t, [cur.t, cur.t + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic),
  });

  const curStyle: React.CSSProperties = cur.flip
    ? { transform: `perspective(1700px) rotateY(${(1 - p) * -78}deg)`, transformOrigin: 'left center', opacity: Math.min(1, p * 2.2) }
    : { transform: `scale(${0.93 + p * 0.07})`, opacity: p };

  return (
    <AbsoluteFill style={{ background: C.bgDeep, overflow: 'hidden' }}>
      {orbs.map((o, i) => (
        <div key={`${cur.chapter}-${i}`} style={{
          position: 'absolute', width: o.size, height: o.size, borderRadius: '50%', filter: 'blur(120px)',
          background: o.color, opacity: o.opacity, top: o.top, bottom: o.bottom, left: o.left, right: o.right,
        }} />
      ))}
      {vis > 0.01 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: vis }}>
          {prev && !cur.flip && p < 1 ? <SceneFrame style={{ opacity: 1 - p }}>{prev.node}</SceneFrame> : null}
          <SceneFrame style={curStyle}>{cur.node}</SceneFrame>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── overlays ─────────────────────────

type Slot = { kind: 'video' | 'image' | 'graphic'; src: string; tIn: number; tOut: number };

const OVERLAYS: Slot[] = [
  { kind: 'video', src: 'v1.mp4', tIn: 2.0, tOut: 5.0 },        // AI neural motion
  { kind: 'graphic', src: 'g1.png', tIn: 15.9, tOut: 18.0 },    // JS logo
  { kind: 'graphic', src: 'g2.png', tIn: 32.0, tOut: 34.2 },    // Python logo — "...built the tool for it in Python" (34.02); grid returns for "PyTorch..." @35.16
  { kind: 'image', src: 'i1.png', tIn: 43.9, tOut: 47.3 },      // library moat — "rebuilding all of this from scratch" (43.78-48.1); keeps grid clear at 27-29 & 35-39
  { kind: 'video', src: 'v2.mp4', tIn: 53.9, tOut: 57.3 },      // code macro
  { kind: 'image', src: 'i2.png', tIn: 61.4, tOut: 64.9 },      // slow tortoise
  { kind: 'graphic', src: 'g3.png', tIn: 81.5, tOut: 85.5 },    // Python code (import torch)
  { kind: 'video', src: 'v3.mp4', tIn: 89.8, tOut: 93.2 },      // GPU hardware
  { kind: 'graphic', src: 'g4-js', tIn: 108.4, tOut: 110.6 },   // JS logo (returns) -> uses g1
  { kind: 'video', src: 'v4.mp4', tIn: 114.0, tOut: 117.4 },    // chat UI
  { kind: 'graphic', src: 'g5.png', tIn: 118.8, tOut: 122.6 },  // JS code (streamText)
  { kind: 'image', src: 'i3.png', tIn: 124.1, tOut: 127.6 },    // brain -> world
  { kind: 'graphic', src: 'g6.png', tIn: 134.0, tOut: 137.2 },  // both logos
];

// Avatar lip-sync inserts (portrait + blurred wings, film burn in/out).
type Avatar = { src: string; w: number; h: number; tIn: number; dur: number };
const AVATARS: Avatar[] = [
  { src: 'avatarA.mp4', w: 480, h: 854, tIn: 18.22, dur: 4.48 },   // HeyGen — the question
  { src: 'avatarC.mp4', w: 480, h: 628, tIn: 156.42, dur: 5.60 },  // Veed Fabric — sign-off
];

// Merged overlay windows (every overlay + every avatar); windows < 0.6s apart fuse.
const OCCLUSIONS: Array<[number, number]> = (() => {
  const raw: Array<[number, number]> = [
    ...OVERLAYS.map((s) => [s.tIn, s.tOut] as [number, number]),
    ...AVATARS.map((a) => [a.tIn, a.tIn + a.dur] as [number, number]),
  ].sort((a, b) => a[0] - b[0]);
  const merged: Array<[number, number]> = [];
  for (const w of raw) {
    const last = merged[merged.length - 1];
    if (last && w[0] - last[1] < 0.6) last[1] = Math.max(last[1], w[1]);
    else merged.push([w[0], w[1]]);
  }
  return merged;
})();

const fileOf = (s: Slot) => (s.src === 'g4-js' ? 'g1.png' : s.src);

// Video b-roll: dissolve in/out.
const VideoLayer: React.FC<{ slot: Slot; t0: number }> = ({ slot, t0 }) => {
  const t = useT() + t0;
  const o = Math.min(
    interpolate(t, [slot.tIn, slot.tIn + 0.5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    interpolate(t, [slot.tOut - 0.5, slot.tOut], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
  );
  return (
    <AbsoluteFill style={{ opacity: o, background: '#000' }}>
      <OffthreadVideo src={asset(slot.src)} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </AbsoluteFill>
  );
};

// Concept image: cross-warp in/out (directional sweep + skew/blur settle).
const ImageLayer: React.FC<{ slot: Slot; t0: number }> = ({ slot, t0 }) => {
  const t = useT() + t0;
  const pIn = interpolate(t, [slot.tIn, slot.tIn + 0.55], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
  const pOut = interpolate(t, [slot.tOut - 0.5, slot.tOut], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
  const sweep = pIn * 140 - 20;
  const mask = pIn >= 1 ? undefined : `linear-gradient(105deg, rgba(0,0,0,1) ${sweep}%, rgba(0,0,0,0) ${sweep + 22}%)`;
  const warpIn = 1 - pIn;
  const style: React.CSSProperties = {
    width: '100%', height: '100%', objectFit: 'cover',
    transform: `scale(${1 + warpIn * 0.08 + pOut * 0.07}) skewX(${warpIn * -7 + pOut * 5}deg)`,
    filter: `blur(${(warpIn * 12 + pOut * 10).toFixed(1)}px)`,
  };
  return (
    <AbsoluteFill style={{ opacity: 1 - pOut, background: C.bgDeep }}>
      <div style={{ position: 'absolute', inset: 0, WebkitMaskImage: mask, maskImage: mask }}>
        <Img src={asset(fileOf(slot))} style={style} />
      </div>
    </AbsoluteFill>
  );
};

// Graphic (logo / code): clean dissolve + gentle scale-in (readable, no skew/blur warp).
const GraphicLayer: React.FC<{ slot: Slot; t0: number }> = ({ slot, t0 }) => {
  const t = useT() + t0;
  const pIn = interpolate(t, [slot.tIn, slot.tIn + 0.45], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const o = Math.min(pIn, interpolate(t, [slot.tOut - 0.45, slot.tOut], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  return (
    <AbsoluteFill style={{ opacity: o, background: C.bgDeep }}>
      <Img src={asset(fileOf(slot))} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${0.965 + pIn * 0.035})` }} />
    </AbsoluteFill>
  );
};

const AvatarInsert: React.FC<{ av: Avatar }> = ({ av }) => {
  const cenH = H;
  const cenW = (av.w / av.h) * H;
  const wingW = W;
  const wingH = (av.h / av.w) * W;
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <OffthreadVideo src={asset(av.src)} muted style={{ position: 'absolute', width: wingW, height: wingH, left: 0, top: (H - wingH) / 2, filter: 'blur(48px) brightness(0.45)' }} />
      <OffthreadVideo src={asset(av.src)} muted style={{ position: 'absolute', width: cenW, height: cenH, left: (W - cenW) / 2, top: 0 }} />
    </AbsoluteFill>
  );
};

const FilmBurn: React.FC<{ at: number }> = ({ at }) => {
  const t = useT();
  const p = interpolate(t, [at - 0.38, at, at + 0.38], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  if (p <= 0.01) return null;
  const core = Math.max(0, (p - 0.55) / 0.45);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: p, mixBlendMode: 'screen',
        background: 'radial-gradient(120% 90% at 85% 30%, rgba(255,106,0,0.95), rgba(255,64,0,0.45) 45%, rgba(120,20,0,0) 75%), radial-gradient(90% 110% at 15% 75%, rgba(255,170,60,0.8), rgba(255,90,0,0.3) 50%, rgba(0,0,0,0) 78%)' }} />
      <div style={{ position: 'absolute', inset: 0, opacity: core, background: '#fff8ee' }} />
    </AbsoluteFill>
  );
};

// ───────────────────────── root ─────────────────────────

export const WhyAiPython: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: C.bgDeep }}>
      <ContentBody />

      {OVERLAYS.map((s, i) => {
        const fromFrame = Math.round((s.tIn - 0.1) * WAP_FPS);
        const t0 = fromFrame / WAP_FPS;
        const Layer = s.kind === 'video' ? VideoLayer : s.kind === 'image' ? ImageLayer : GraphicLayer;
        return (
          <Sequence key={`${s.src}-${i}`} from={fromFrame} durationInFrames={Math.round((s.tOut - s.tIn + 0.2) * WAP_FPS)} layout="none">
            <AbsoluteFill><Layer slot={s} t0={t0} /></AbsoluteFill>
          </Sequence>
        );
      })}

      {AVATARS.map((av) => (
        <React.Fragment key={av.src}>
          <Sequence from={Math.round(av.tIn * WAP_FPS)} durationInFrames={Math.round(av.dur * WAP_FPS)} layout="none">
            <AvatarInsert av={av} />
          </Sequence>
          <FilmBurn at={av.tIn} />
          <FilmBurn at={av.tIn + av.dur} />
        </React.Fragment>
      ))}

      <Audio src={asset('narration.wav')} />
      <Audio src={asset('music.wav')} volume={MUSIC_GAIN} />
    </AbsoluteFill>
  );
};

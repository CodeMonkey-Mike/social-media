import React from 'react';
import { AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate, useCurrentFrame, useVideoConfig, staticFile } from 'remotion';
import { loadFont as loadDMSans } from '@remotion/google-fonts/DMSans';
import { loadFont as loadJetBrains } from '@remotion/google-fonts/JetBrainsMono';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { CAPTIONS } from './kaspaCovenantsShortCaptions';

loadDMSans('normal', { weights: ['400', '500', '700'], subsets: ['latin'] });
loadJetBrains('normal', { weights: ['400', '600'], subsets: ['latin'] });
loadPlayfair('normal', { weights: ['700', '900'], subsets: ['latin'] });

// ─────────────────────────────────────────────────────────────────────────────
// Kaspa Covenants — 9:16 vertical TEASER for the longform. Spine = baked-faces desil
// (24.10s, faces in 3 windows, black on covers). Covers SPOTLIGHT one beat at a time.
// Face cuts use hard-cut + glitch SFX (SCRIPT-sanctioned for vertical; the Blocks mask
// engine is authored 16:9). Mirrors KaspaCovenants.tsx (longform).
// ─────────────────────────────────────────────────────────────────────────────
export const KCS_FPS = 30;
export const KCS_DURATION = 719; // 23.97s — ends on face3, trims the spine's black tail

const C = {
  bg: '#0a0c10', card: '#12151c', border: '#1e2330',
  green: '#00e68a', cyan: '#00c2ff', gold: '#ffd700', red: '#ff4060', purple: '#a855f7', teal: '#49e0c8',
  tx: '#e8eaf0', tx2: '#8892a4', tx3: '#505a6e',
};
const SANS = "'DM Sans', sans-serif", MONO = "'JetBrains Mono', monospace", SERIF = "'Playfair Display', serif";
const asset = (f: string) => staticFile(f);
const useT = () => useCurrentFrame() / KCS_FPS;
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// ── FACE windows (from bake locate) — spine shows the face here; covers must CLEAR ──
// face1 0.03-3.97 (only ~2s shown, then cut to tunnel) · face2 11.48-13.18 · face3 22.26-end
const Spine: React.FC = () => (
  <AbsoluteFill style={{ background: '#000', overflow: 'hidden' }}>
    <OffthreadVideo src={asset('spine.mp4')} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 22%' }} />
  </AbsoluteFill>
);

// ── full-frame cover scene (fast fade — punchy short) ──
const Scene: React.FC<{ tIn: number; tOut: number; children: React.ReactNode }> = ({ tIn, tOut, children }) => {
  const t = useT();
  const o = Math.min(interpolate(t, [tIn, tIn + 0.18], [0, 1], clamp), interpolate(t, [tOut - 0.18, tOut], [1, 0], clamp));
  if (o <= 0.001) return null;
  const sc = interpolate(t, [tIn, tIn + 0.3], [0.96, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return <AbsoluteFill style={{ opacity: o, background: C.bg }}><div style={{ width: '100%', height: '100%', transform: `scale(${sc})` }}>{children}</div></AbsoluteFill>;
};
const Orb: React.FC<{ color: string; size: number; pos: React.CSSProperties }> = ({ color, size, pos }) => (
  <div style={{ position: 'absolute', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.42, width: size, height: size, background: color, ...pos }} />
);
// content sits in the UPPER 2/3 so the caption band (bottom ~470) stays clear
const Frame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', padding: '230px 70px 560px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>{children}</div>
);
const Ey: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ fontFamily: SANS, fontSize: 34, textTransform: 'uppercase', letterSpacing: '0.2em', color: C.tx3, fontWeight: 700, marginBottom: 18, position: 'relative', zIndex: 1, textAlign: 'center' }}>{children}</span>
);
const H2: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 84, lineHeight: 1.06, color: C.tx, margin: 0, position: 'relative', zIndex: 1, textAlign: 'center' }}>{children}</h2>
);
const Reveal: React.FC<{ revealAt: number; activeUntil: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ revealAt, activeUntil, children, style }) => {
  const t = useT();
  const r = interpolate(t, [revealAt - 0.05, revealAt + 0.32], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const active = t >= revealAt && t < activeUntil;
  const sc = interpolate(t, [revealAt, revealAt + 0.32], [0.92, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return <div style={{ opacity: r * (active ? 1 : 0.45), transform: `scale(${active ? sc : 0.99})`, position: 'relative', zIndex: 1, ...style }}>{children}</div>;
};

// ───────── C3b: covenant rule list (Send only here / Locked until later / Royalties) ─────────
const RULES = [
  { r: 7.46, u: 11.48, t: 'Send only here', icon: '→' },
  { r: 8.60, u: 11.48, t: 'Locked until later', icon: '🔒' },
  { r: 9.80, u: 11.48, t: "Royalties you can't skip", icon: '%' },
];
const C3bVert: React.FC = () => (
  <Frame>
    <Orb color={C.green} size={620} pos={{ top: -120, left: -140 }} />
    <Ey>A coin that carries its own rules</Ey>
    <H2>Rules baked <span style={{ color: C.green }}>into the coin</span></H2>
    <div style={{ marginTop: 44, display: 'flex', flexDirection: 'column', gap: 22 }}>
      {RULES.map((rl, i) => (
        <Reveal key={i} revealAt={rl.r} activeUntil={rl.u}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '30px 34px', borderRadius: 18, background: 'rgba(0,230,138,.06)', borderLeft: `5px solid ${C.green}`, fontFamily: SANS, fontSize: 46, fontWeight: 700, color: C.tx, lineHeight: 1.2 }}>
            <span style={{ fontFamily: MONO, fontSize: 42, color: C.green, minWidth: 50, textAlign: 'center' }}>{rl.icon}</span>
            {rl.t}
          </div>
        </Reveal>
      ))}
    </div>
  </Frame>
);

// ───────── C5b: the comparison matrix (No VM. PoW + programmability. Nothing else has both) ─────────
const C5bVert: React.FC = () => {
  const t = useT();
  const Cell: React.FC<{ v: boolean }> = ({ v }) => <div style={{ flex: 1, textAlign: 'center', fontSize: 48, fontWeight: 900, color: v ? C.green : C.red }}>{v ? '✓' : '✗'}</div>;
  const Row: React.FC<{ revealAt: number; name: string; col: string; pow: boolean; prog: boolean; kas?: boolean }> = ({ revealAt, name, col, pow, prog, kas }) => {
    const pulse = kas ? interpolate(t, [17.52, 17.7, 17.95], [1, 1.05, 1], clamp) : 1;
    return (
      <Reveal revealAt={revealAt} activeUntil={999}>
        <div style={{ display: 'flex', alignItems: 'center', borderRadius: 16, padding: '26px 30px', transform: `scale(${pulse})`, background: kas ? 'rgba(0,230,138,.1)' : C.card, border: `2px solid ${kas ? 'rgba(0,230,138,.55)' : C.border}`, boxShadow: kas ? '0 0 50px rgba(0,230,138,.25)' : 'none' }}>
          <div style={{ flex: 1.4, fontWeight: 800, fontSize: 40, color: col, fontFamily: SANS }}>{name}</div>
          <Cell v={pow} /><Cell v={prog} />
        </div>
      </Reveal>
    );
  };
  const Lbl: React.FC<{ children: React.ReactNode }> = ({ children }) => <div style={{ flex: 1, textAlign: 'center', color: C.tx2, fontWeight: 700, fontSize: 26, textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: SANS }}>{children}</div>;
  return (
    <Frame>
      <Orb color={C.green} size={620} pos={{ bottom: -120, right: -140 }} />
      <Ey>No virtual machine</Ey>
      <H2>The only one with <span style={{ color: C.green }}>both</span></H2>
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 30px', marginTop: 40, marginBottom: 10, position: 'relative', zIndex: 1 }}>
        <div style={{ flex: 1.4 }} /><Lbl>Proof of Work</Lbl><Lbl>Programmable</Lbl>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, position: 'relative', zIndex: 1 }}>
        <Row revealAt={13.24} name="Ethereum" col={C.cyan} pow={false} prog={true} />
        <Row revealAt={13.7} name="Bitcoin" col={C.gold} pow={true} prog={false} />
        <Row revealAt={14.44} name="Kaspa" col={C.green} pow={true} prog={true} kas />
      </div>
    </Frame>
  );
};

// ───────── image b-roll (cross-warp, like longform) ─────────
type Slot = { kind: 'image' | 'video'; src: string; tIn: number; tOut: number };
const VideoBroll: React.FC<{ slot: Slot; t0: number }> = ({ slot, t0 }) => {
  const t = useT() + t0;
  const o = Math.min(interpolate(t, [slot.tIn, slot.tIn + 0.25], [0, 1], clamp), interpolate(t, [slot.tOut - 0.25, slot.tOut], [1, 0], clamp));
  return <AbsoluteFill style={{ opacity: o, background: '#000' }}><OffthreadVideo src={asset(slot.src)} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></AbsoluteFill>;
};
const ImageBroll: React.FC<{ slot: Slot; t0: number; label?: React.ReactNode }> = ({ slot, t0, label }) => {
  const t = useT() + t0;
  const pIn = interpolate(t, [slot.tIn, slot.tIn + 0.45], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const pOut = interpolate(t, [slot.tOut - 0.3, slot.tOut], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const sweep = pIn * 140 - 20;
  const mask = pIn >= 1 ? undefined : `linear-gradient(105deg, rgba(0,0,0,1) ${sweep}%, rgba(0,0,0,0) ${sweep + 22}%)`;
  const w = 1 - pIn;
  const z = interpolate(t, [slot.tIn, slot.tOut], [1.0, 1.07], clamp); // slow ken-burns
  return (
    <AbsoluteFill style={{ opacity: 1 - pOut, background: '#000' }}>
      <div style={{ position: 'absolute', inset: 0, WebkitMaskImage: mask, maskImage: mask }}>
        <Img src={asset(slot.src)} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${z + w * 0.06}) skewX(${w * -6}deg)`, filter: `blur(${(w * 12).toFixed(1)}px)` }} />
      </div>
      {label}
    </AbsoluteFill>
  );
};

// ───────── end card (Kaspa logo + glow over face3) ─────────
const EndCard: React.FC<{ tIn: number }> = ({ tIn }) => {
  const t = useT();
  const o = interpolate(t, [tIn, tIn + 0.4], [0, 1], clamp);
  if (o <= 0.001) return null;
  const sc = interpolate(t, [tIn, tIn + 0.5], [0.7, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Img src={asset('kaspa-logo.png')} style={{ position: 'absolute', top: 70, left: 64, width: 150, height: 150, mixBlendMode: 'screen', transform: `scale(${sc})`, transformOrigin: 'top left', filter: 'drop-shadow(0 0 14px rgba(0,0,0,.6))' }} />
    </AbsoluteFill>
  );
};

// ───────── karaoke captions (arial-black, yellow active word — vertical safe band) ─────────
const KaraokeCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const g = CAPTIONS.find((c) => t >= c.start && t < c.end + 0.12);
  if (!g) return null;
  return (
    <div style={{ position: 'absolute', bottom: 470, left: 0, right: 0, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px 16px', padding: '0 60px', fontFamily: "'Arial Black', Arial, sans-serif", fontSize: 80, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1, lineHeight: 1.05 }}>
      {g.words.map((w, i) => {
        const active = t >= w.start && t < w.end + 0.06;
        return (
          <span key={i} style={{ position: 'relative', color: '#fff', WebkitTextStroke: '9px #000', paintOrder: 'stroke', backgroundColor: active ? '#ffd400' : 'transparent', borderRadius: 10, padding: active ? '2px 14px' : '2px 4px', ...(active ? { color: '#1a1a1a', WebkitTextStroke: '0px transparent' } : {}) }}>
            {w.w}
          </span>
        );
      })}
    </div>
  );
};

// ───────── glitch SFX at each hard cut ─────────
const GLITCH_CUTS = [2.0, 4.14, 7.46, 11.48, 13.05, 18.92, 22.26];
const GlitchSfx: React.FC = () => (
  <>
    {GLITCH_CUTS.map((c, i) => (
      <Sequence key={i} from={Math.round(c * KCS_FPS) - 2} durationInFrames={20} layout="none">
        <Audio src={asset('sfx-glitch.mp3')} volume={0.55} />
      </Sequence>
    ))}
  </>
);

// ───────── music bed (Race Against Time, ~21 dB under VO; fade in/out) ─────────
const Music: React.FC = () => (
  <Audio src={asset('music.mp3')} volume={(f) => 0.04 * Math.min(interpolate(f / KCS_FPS, [0, 0.6], [0, 1], clamp), interpolate(f / KCS_FPS, [23.0, 24.1], [1, 0], clamp))} />
);

// ───────── scene table (covers over the black spine; faces show in their windows) ─────────
const SCENES: Array<{ tIn: number; tOut: number; node: React.ReactNode }> = [
  { tIn: 7.46, tOut: 11.48, node: <C3bVert /> },
  { tIn: 13.05, tOut: 18.92, node: <C5bVert /> }, // start on face2 tail (speech ends 13.04) to kill the cut black-dip
];
const BROLL: Slot[] = [
  { kind: 'video', src: 'vid-tunnel.mp4', tIn: 2.0, tOut: 4.2 },          // "Bitcoin arguing for years"
  { kind: 'image', src: 'coin-vert.png', tIn: 4.14, tOut: 7.5 },          // "a coin that carries its own rules"
  { kind: 'image', src: 'ecosystem-vert.png', tIn: 18.92, tOut: 22.3 },   // "lightyears ahead"
];

export const KaspaCovenantsShort: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <Spine />
    {BROLL.map((s, i) => {
      const fromFrame = Math.round((s.tIn - 0.05) * KCS_FPS);
      const t0 = fromFrame / KCS_FPS;
      return <Sequence key={`b${i}`} from={fromFrame} durationInFrames={Math.round((s.tOut - s.tIn + 0.1) * KCS_FPS)} layout="none">{s.kind === 'video' ? <VideoBroll slot={s} t0={t0} /> : <ImageBroll slot={s} t0={t0} />}</Sequence>;
    })}
    {SCENES.map((s, i) => <Scene key={`s${i}`} tIn={s.tIn} tOut={s.tOut}>{s.node}</Scene>)}
    <EndCard tIn={22.26} />
    <KaraokeCaptions />
    <GlitchSfx />
    <Music />
  </AbsoluteFill>
);

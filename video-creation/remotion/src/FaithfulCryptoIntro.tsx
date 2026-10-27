import React from 'react';
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Caption2, CapGroup } from './captions/Caption2';
import { DATA } from './FaithfulCryptoIntroData';

// ─────────────────────────────────────────────────────────────────────────────
// FaithfulCryptoIntro — the 16:9 channel intro for "Faithful Crypto" (Yuli y Ana).
// Project: video-creation/yuli-y-ana/media/faithful-crypto-intro/  (render with --public-dir <project>/render-assets)
// Data (scenes, slots, captions, timings) is GENERATED into FaithfulCryptoIntroData.ts by the project's build_data.py.
// Scenes: face-solo (9:16 lip-sync clip centered, BLURRED WINGS) -> face-duo (Yuli + Ana side by side, unison line,
// "FAITHFUL CRYPTO" wordmark slams in on the word) -> voice-over covers (Envato video + ChatGPT images) -> end card.
// Captions = canonical Caption2 (arial-black karaoke), gated OFF during the duo scene (the wordmark is the text there).
// ─────────────────────────────────────────────────────────────────────────────
export const FCI_FPS = DATA.FPS;
export const FCI_DURATION = DATA.DURATION;
const W = 1920, H = 1080;
const PINK = '#ff2fa4', MAGENTA = '#b0177a', PURPLE = '#8a3ffc', TEAL = '#00e5ff';
const FONT = "'Montserrat', 'Arial Black', Arial, sans-serif";
const MUSIC_VOL = Math.pow(10, DATA.music.db / 20);
const sec = (t: number) => Math.round(t * FCI_FPS);
const asset = (p: string) => staticFile(p);

// ── blurred-wings backdrop: the same clip, cover-scaled to the frame, blurred + darkened ──
const Wings: React.FC<{ src: string; trim: number; left?: number; width?: number }> = ({ src, trim, left = 0, width = W }) => (
  <div style={{ position: 'absolute', left, top: 0, width, height: H, overflow: 'hidden' }}>
    <OffthreadVideo src={asset(src)} muted startFrom={sec(trim)} style={{ position: 'absolute', left: -60, top: -60, width: width + 120, height: H + 120, objectFit: 'cover', filter: 'blur(44px) brightness(0.5) saturate(1.2)' }} />
  </div>
);

const NameTag: React.FC<{ name: string; color: string; sceneFrame: number }> = ({ name, color, sceneFrame }) => {
  const { fps } = useVideoConfig();
  const s = spring({ frame: sceneFrame - 6, fps, config: { damping: 14, stiffness: 160 } });
  const x = interpolate(s, [0, 1], [-320, 0]);
  return (
    <div style={{ position: 'absolute', left: 110, top: 850, transform: `translateX(${x}px)`, display: 'flex', alignItems: 'center', gap: 18 }}>
      <div style={{ width: 14, height: 84, background: color, borderRadius: 7, boxShadow: `0 0 24px ${color}` }} />
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, color: '#fff', letterSpacing: 4, textShadow: '0 4px 24px rgba(0,0,0,.7)' }}>{name}</div>
    </div>
  );
};

// ── face solo: 9:16 clip centered at full height ──
const FaceSolo: React.FC<{ src: string; trim: number; who: 'yuli' | 'ana' }> = ({ src, trim, who }) => {
  const frame = useCurrentFrame();
  const cw = Math.round(H * 9 / 16); // 608
  return (
    <AbsoluteFill style={{ background: '#0a0410' }}>
      <Wings src={src} trim={trim} />
      <OffthreadVideo src={asset(src)} muted startFrom={sec(trim)} style={{ position: 'absolute', left: (W - cw) / 2, top: 0, width: cw, height: H, objectFit: 'cover', boxShadow: '0 0 80px rgba(0,0,0,.8)' }} />
      <NameTag name={who === 'yuli' ? 'YULI' : 'ANA'} color={who === 'yuli' ? PINK : PURPLE} sceneFrame={frame} />
    </AbsoluteFill>
  );
};

// ── face duo: both clips side by side (80% height), wordmark band below ──
const FaceDuo: React.FC<{ yuli: { src: string; trim: number }; ana: { src: string; trim: number }; titleAtScene: number; speechAtScene: number }> = ({ yuli, ana, titleAtScene, speechAtScene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ch = 880, cw = Math.round(ch * 9 / 16), gap = 36; // 495 wide each
  const x0 = (W - (2 * cw + gap)) / 2;
  const t = frame / fps;
  const pre = interpolate(t, [speechAtScene - 0.1, speechAtScene + 0.25], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const pop = spring({ frame: frame - sec(titleAtScene), fps, config: { damping: 11, stiffness: 190, mass: 0.9 } });
  const titleScale = interpolate(pop, [0, 1], [2.2, 1]);
  const titleOp = frame >= sec(titleAtScene) ? 1 : 0;
  const flash = interpolate(frame - sec(titleAtScene), [0, 1, 8], [0, 0.55, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ background: '#0a0410' }}>
      <Wings src={yuli.src} trim={yuli.trim} left={0} width={W / 2} />
      <Wings src={ana.src} trim={ana.trim} left={W / 2} width={W / 2} />
      <OffthreadVideo src={asset(yuli.src)} muted startFrom={sec(yuli.trim)} style={{ position: 'absolute', left: x0, top: 0, width: cw, height: ch, objectFit: 'cover', borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }} />
      <OffthreadVideo src={asset(ana.src)} muted startFrom={sec(ana.trim)} style={{ position: 'absolute', left: x0 + cw + gap, top: 0, width: cw, height: ch, objectFit: 'cover', borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }} />
      {/* band */}
      <div style={{ position: 'absolute', left: 0, top: ch, width: W, height: H - ch, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 10, color: '#ffd7ee', opacity: pre, transform: `translateY(${(1 - pre) * 14}px)` }}>AND WELCOME TO</div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 108, letterSpacing: 2, lineHeight: 1, opacity: titleOp, transform: `scale(${titleScale})`, background: `linear-gradient(90deg, ${PINK}, #ffffff 55%, ${TEAL})`, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 0 28px rgba(255,47,164,.55))' }}>FAITHFUL CRYPTO</div>
      </div>
      <AbsoluteFill style={{ background: '#fff', opacity: flash, pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

// ── voice-over cover: one slot (Envato video or ChatGPT image), crossfaded ──
const XF = 8; // frames
const CoverSlot: React.FC<{ kind: 'video' | 'image'; src: string; from: number; dur: number }> = ({ kind, src, from, dur }) => {
  const frame = useCurrentFrame();
  const local = frame - from;
  if (local < -XF || local > dur + XF) return null;
  const op = interpolate(local, [-XF, 0, dur - XF, dur], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const kb = interpolate(local, [0, dur], [1.0, 1.09], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ opacity: op }}>
      {kind === 'video'
        ? <Sequence from={from} layout="none"><OffthreadVideo src={asset(src)} muted style={{ width: W, height: H, objectFit: 'cover' }} /></Sequence>
        : <Img src={asset(src)} style={{ width: W, height: H, objectFit: 'cover', transform: `scale(${kb})` }} />}
    </AbsoluteFill>
  );
};

const SubscribeButton: React.FC<{ at: number; until: number }> = ({ at, until }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at || frame >= until) return null;
  const s = spring({ frame: frame - at, fps, config: { damping: 10, stiffness: 200 } });
  const sc = interpolate(s, [0, 1], [0.3, 1]);
  return (
    <div style={{ position: 'absolute', left: 0, top: 300, width: W, display: 'flex', justifyContent: 'center', transform: `scale(${sc})` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 26, background: '#ff0033', borderRadius: 26, padding: '26px 56px', boxShadow: '0 12px 60px rgba(255,0,51,.5)' }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 72, color: '#fff', letterSpacing: 3 }}>SUBSCRIBE</div>
        <svg width="70" height="70" viewBox="0 0 24 24" fill="#fff"><path d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22zm6-6V11c0-3.07-1.63-5.64-4.5-6.32V4a1.5 1.5 0 0 0-3 0v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" /></svg>
      </div>
    </div>
  );
};

const EndCard: React.FC<{ sceneLen: number }> = ({ sceneLen }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const y = interpolate(s, [0, 1], [60, 0]);
  const fade = interpolate(frame, [sceneLen - 12, sceneLen], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const card = (src: string, color: string, left: number) => (
    <div style={{ position: 'absolute', left, top: 200, width: 400, height: 600, borderRadius: 30, overflow: 'hidden', border: `6px solid ${color}`, boxShadow: `0 0 50px ${color}66`, transform: `translateY(${y}px)` }}>
      <Img src={asset(src)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 20%' }} />
    </div>
  );
  return (
    <AbsoluteFill style={{ background: '#0a0410' }}>
      <Img src={asset('images/studio-bg.png')} style={{ position: 'absolute', left: -80, top: -80, width: W + 160, height: H + 160, objectFit: 'cover', filter: 'blur(30px) brightness(0.45)' }} />
      <div style={{ position: 'absolute', left: 0, top: 54, width: W, textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 96, letterSpacing: 2, background: `linear-gradient(90deg, ${PINK}, #ffffff 55%, ${TEAL})`, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 0 24px rgba(255,47,164,.5))', opacity: s }}>FAITHFUL CRYPTO</div>
      {card('images/yuli-still.png', PINK, W / 2 - 400 - 30)}
      {card('images/ana-still.png', PURPLE, W / 2 + 30)}
      <AbsoluteFill style={{ background: '#000', opacity: fade }} />
    </AbsoluteFill>
  );
};

export const FaithfulCryptoIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scenes = DATA.scenes;
  const duo = scenes.find((s) => s.kind === 'face-duo')!;
  const inDuo = frame >= sec(duo.t0) && frame < sec(duo.t1);
  const musicVol = (f: number) => {
    const t = f / fps;
    const out = interpolate(t, [DATA.TOTAL - DATA.music.fadeOutSec, DATA.TOTAL], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const inn = interpolate(t, [0, 0.8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    return MUSIC_VOL * out * inn;
  };
  return (
    <AbsoluteFill style={{ background: '#0a0410' }}>
      {scenes.map((s) => {
        const from = sec(s.t0), dur = sec(s.t1) - sec(s.t0);
        if (s.kind === 'face-solo') return <Sequence key={s.id} from={from} durationInFrames={dur}><FaceSolo src={(s as any).clip} trim={(s as any).trim} who={(s as any).who} /></Sequence>;
        if (s.kind === 'face-duo') return <Sequence key={s.id} from={from} durationInFrames={dur}><FaceDuo yuli={(s as any).clips.yuli} ana={(s as any).clips.ana} titleAtScene={DATA.titleT - s.t0} speechAtScene={(s as any).speech[0] - s.t0} /></Sequence>;
        if (s.kind === 'end-card') return <Sequence key={s.id} from={from} durationInFrames={dur}><EndCard sceneLen={dur} /></Sequence>;
        return null;
      })}
      {/* voice-over cover layer (slots carry absolute times) */}
      {DATA.slots.map((sl) => <CoverSlot key={sl.id} kind={sl.kind} src={sl.src} from={sec(sl.t0)} dur={sec(sl.t1) - sec(sl.t0)} />)}
      <SubscribeButton at={sec(DATA.subscribeT)} until={sec(scenes.find((s) => s.kind === 'end-card')!.t0)} />
      {!inDuo && <Caption2 captions={DATA.captions as unknown as CapGroup[]} bottom={54} fontSize={58} />}
      {/* audio: clean VO master + music bed (Seabreeze 0:46 cut, Mike's pick; -19 dB clip gain: VO -15.3 LUFS, bed -12.5 LUFS -> ~16.5 dB under) + 2 impacts */}
      <Audio src={asset(DATA.vo)} />
      <Audio src={asset(DATA.music.src)} startFrom={sec(DATA.music.startSec)} volume={musicVol} />
      <Sequence from={sec(DATA.titleT) - 2}><Audio src={asset(DATA.sfx.title)} volume={0.55} /></Sequence>
      <Sequence from={sec(DATA.subscribeT) - 1}><Audio src={asset(DATA.sfx.subscribe)} volume={0.45} /></Sequence>
    </AbsoluteFill>
  );
};

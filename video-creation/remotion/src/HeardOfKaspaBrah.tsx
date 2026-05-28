import React from 'react';
import {
  AbsoluteFill, Audio, Sequence, Img, OffthreadVideo,
  interpolate, useCurrentFrame, spring,
} from 'remotion';
import {
  FPS_HKB as FPS, CLIP_HKB, LOGO_KAS,
  BROLL_HKB, OVERLAYS_HKB, FULLFACE_HKB, GRAPHICS_HKB, CAPTIONS_HKB, SOUNDS_HKB,
} from './constants-hkb';

const CONTENT_BOTTOM = 1010, CAPTION_Y = 968;
const TEAL = '#00e5ff', YELLOW = '#ffe600', GREEN = '#39ff14', RED = '#ff5252', ORANGE = '#f7931a';
const FONT = "'Montserrat', 'Arial Black', sans-serif";

function fadeInOut(t: number, tIn: number, tOut: number, fadeS = 0.15) {
  return interpolate(t, [tIn, tIn + fadeS, tOut - fadeS, tOut], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
}
const colourize = (h: string) => h
  .replace(/<g>/g, `<span style="color:${TEAL}">`).replace(/<\/g>/g, '</span>')
  .replace(/<y>/g, `<span style="color:${YELLOW}">`).replace(/<\/y>/g, '</span>')
  .replace(/<gr>/g, `<span style="color:${GREEN}">`).replace(/<\/gr>/g, '</span>')
  .replace(/<r>/g, `<span style="color:${RED}">`).replace(/<\/r>/g, '</span>')
  .replace(/<o>/g, `<span style="color:${ORANGE}">`).replace(/<\/o>/g, '</span>');

function getCaption(t: number) { for (let i = CAPTIONS_HKB.length - 1; i >= 0; i--) if (t >= CAPTIONS_HKB[i].t) return { idx: i, html: CAPTIONS_HKB[i].h }; return { idx: 0, html: '' }; }
const Caption: React.FC<{ frame: number; t: number }> = ({ frame, t }) => {
  const { idx, html } = getCaption(t); if (!html) return null;
  const scale = spring({ frame: frame - Math.round((CAPTIONS_HKB[idx]?.t ?? 0) * FPS), fps: FPS, config: { damping: 11, stiffness: 360 }, from: 0.7, to: 1.0 });
  return <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 74, color: '#fff', textTransform: 'lowercase', textAlign: 'center', letterSpacing: '0.01em', lineHeight: 1.05, WebkitTextStroke: '13px #000', paintOrder: 'stroke fill' as any, width: '100%', transform: `scale(${scale})` }} dangerouslySetInnerHTML={{ __html: colourize(html) }} />;
};

const Broll: React.FC<{ t: number }> = ({ t }) => {
  const ev = BROLL_HKB.find(e => t >= e.tIn && t < e.tOut); if (!ev) return null;
  const op = ev.tIn <= 0.001 ? interpolate(t, [ev.tOut - 0.12, ev.tOut], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : fadeInOut(t, ev.tIn, ev.tOut, 0.12);
  const kb = interpolate(t - ev.tIn, [0, ev.tOut - ev.tIn], [1.0, 1.07], { extrapolateRight: 'clamp' });
  if (ev.mode === 'full') return <AbsoluteFill style={{ opacity: op }}><Img src={ev.src} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${kb})` }} /></AbsoluteFill>;
  return <AbsoluteFill style={{ opacity: op }}><div style={{ position: 'absolute', top: 0, left: 0, width: 1080, height: CONTENT_BOTTOM, overflow: 'hidden' }}><Img src={ev.src} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${kb})` }} /><div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 5, background: TEAL, boxShadow: `0 0 18px ${TEAL}` }} /></div></AbsoluteFill>;
};

const FullFace: React.FC<{ t: number }> = ({ t }) => {
  const ev = FULLFACE_HKB.find(e => t >= e.tIn && t < e.tOut); if (!ev) return null;
  const op = fadeInOut(t, ev.tIn, ev.tOut, 0.15);
  return <AbsoluteFill style={{ opacity: op, overflow: 'hidden', background: '#000' }}><OffthreadVideo src={CLIP_HKB} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(2.1)', transformOrigin: '50% 88%' }} /></AbsoluteFill>;
};

const Overlays: React.FC<{ t: number; frame: number }> = ({ t, frame }) => (
  <>{OVERLAYS_HKB.map((e, i) => {
    if (t < e.tIn || t >= e.tOut) return null;
    const op = fadeInOut(t, e.tIn, e.tOut, 0.18);
    const pop = spring({ frame: frame - Math.round(e.tIn * FPS), fps: FPS, config: { damping: 12, stiffness: 280 }, from: 0.4, to: 1.0 });
    const float = Math.sin((t - e.tIn) * 2.2) * 10;
    return <Img key={i} src={e.src} style={{ position: 'absolute', top: e.top + float, left: e.left, width: e.width, opacity: op, transform: `scale(${pop})`, filter: 'drop-shadow(0 0 26px rgba(0,229,255,0.5))' }} />;
  })}</>
);

const Card: React.FC<{ op: number; sc: number; children: React.ReactNode; color?: string; top?: number }> = ({ op, sc, children, color = TEAL, top = 300 }) => (
  <div style={{ position: 'absolute', top, left: '50%', transform: `translate(-50%,-50%) scale(${sc})`, opacity: op, background: 'rgba(0,0,0,0.82)', border: `5px solid ${color}`, borderRadius: 28, padding: '34px 52px', textAlign: 'center', boxShadow: `0 0 56px ${color}66`, backdropFilter: 'blur(6px)', width: 860 }}>{children}</div>
);

const Thumb: React.FC<{ op: number }> = ({ op }) => (
  <AbsoluteFill style={{ opacity: op }}>
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 45%, rgba(0,0,0,0.82) 100%)' }} />
    <div style={{ position: 'absolute', top: 250, left: 60, right: 60, textAlign: 'center' }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 112, lineHeight: 1.0, color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.01em', WebkitTextStroke: '4px #000', paintOrder: 'stroke fill' as any, whiteSpace: 'nowrap' }}>
        HEARD OF<br /><span style={{ color: TEAL }}>KASPA, BRAH?</span>
      </div>
      <div style={{ marginTop: 30, display: 'inline-block', background: ORANGE, color: '#1a0d00', fontFamily: FONT, fontWeight: 900, fontSize: 44, letterSpacing: '0.03em', padding: '16px 34px', borderRadius: 16, boxShadow: `0 0 40px ${ORANGE}` }}>
        BITCOIN ISN&apos;T THE BEST TECH
      </div>
    </div>
  </AbsoluteFill>
);

export const HeardOfKaspaBrah: React.FC = () => {
  const frame = useCurrentFrame(); const t = frame / FPS;
  const g = (id: string) => GRAPHICS_HKB.find(e => e.id === id);
  const gOp = (id: string) => { const e = g(id); return e ? fadeInOut(t, e.tIn, e.tOut) : 0; };
  const gSc = (id: string) => { const e = g(id); if (!e) return 1; return spring({ frame: frame - Math.round(e.tIn * FPS), fps: FPS, config: { damping: 13, stiffness: 320 }, from: 0.6, to: 1.0 }); };
  return (
    <AbsoluteFill style={{ background: '#000', fontFamily: FONT }}>
      <AbsoluteFill style={{ overflow: 'hidden' }}><OffthreadVideo src={CLIP_HKB} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></AbsoluteFill>
      <Broll t={t} />
      <FullFace t={t} />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 44%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0) 60%)' }} />
      <AbsoluteFill style={{ zIndex: 90 }}><Overlays t={t} frame={frame} /></AbsoluteFill>
      <Img src={LOGO_KAS} style={{ position: 'absolute', top: 30, left: 30, width: 84, height: 84, filter: `drop-shadow(0 0 12px ${TEAL}88)`, zIndex: 200 }} />
      <AbsoluteFill style={{ zIndex: 100 }}>
        {gOp('stablecoin') > 0 && (
          <Card op={gOp('stablecoin')} sc={gSc('stablecoin')} color={GREEN} top={320}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, color: '#fff' }}>NO LONGER A</div>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 96, color: GREEN, textShadow: `0 0 28px ${GREEN}` }}>STABLECOIN</div>
          </Card>
        )}
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 150, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: CAPTION_Y, left: 50, right: 50, transform: 'translateY(-50%)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Caption frame={frame} t={t} /></div>
      </AbsoluteFill>
      {t < 2.6 && <AbsoluteFill style={{ zIndex: 300 }}><Thumb op={interpolate(t, [0, 2.35, 2.6], [1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} /></AbsoluteFill>}
      {SOUNDS_HKB.map((e, i) => (<Sequence key={i} from={Math.round(e.t * FPS)} durationInFrames={FPS * 2}><Audio src={e.src} volume={0.5} /></Sequence>))}
    </AbsoluteFill>
  );
};

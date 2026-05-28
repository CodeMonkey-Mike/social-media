import React from 'react';
import {
  AbsoluteFill, Audio, Sequence, Img, OffthreadVideo,
  interpolate, useCurrentFrame, spring,
} from 'remotion';
import {
  FPS_PENGUMC as FPS,
  CLIP_PENGUMC, LOGO_KAS,
  BROLL_PENGUMC, GRAPHICS_PENGUMC, CAPTIONS_PENGUMC, SOUNDS_PENGUMC,
} from './constants-pengu-mc';

const CONTENT_BOTTOM = 1020;
const CAPTION_Y      = 968;

const TEAL   = '#00e5ff';
const YELLOW = '#ffe600';
const GREEN  = '#39ff14';
const RED    = '#ff5252';
const FONT   = "'Montserrat', 'Arial Black', sans-serif";

function fadeInOut(t: number, tIn: number, tOut: number, fadeS = 0.15) {
  return interpolate(t, [tIn, tIn + fadeS, tOut - fadeS, tOut], [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
}

const colourize = (html: string) =>
  html
    .replace(/<g>/g,  `<span style="color:${TEAL}">`).replace(/<\/g>/g,  '</span>')
    .replace(/<y>/g,  `<span style="color:${YELLOW}">`).replace(/<\/y>/g,  '</span>')
    .replace(/<gr>/g, `<span style="color:${GREEN}">`).replace(/<\/gr>/g, '</span>')
    .replace(/<r>/g,  `<span style="color:${RED}">`).replace(/<\/r>/g,  '</span>');

function getCaption(t: number) {
  for (let i = CAPTIONS_PENGUMC.length - 1; i >= 0; i--) {
    if (t >= CAPTIONS_PENGUMC[i].t) return { idx: i, html: CAPTIONS_PENGUMC[i].h };
  }
  return { idx: 0, html: '' };
}

const Caption: React.FC<{ frame: number; t: number }> = ({ frame, t }) => {
  const { idx, html } = getCaption(t);
  if (!html) return null;
  const startFrame = Math.round((CAPTIONS_PENGUMC[idx]?.t ?? 0) * FPS);
  const age = frame - startFrame;
  const scale = spring({ frame: age, fps: FPS, config: { damping: 11, stiffness: 360 }, from: 0.7, to: 1.0 });
  return (
    <div style={{
      fontFamily: FONT, fontWeight: 900, fontSize: 74, color: '#fff',
      textTransform: 'lowercase', textAlign: 'center', letterSpacing: '0.01em',
      lineHeight: 1.05, WebkitTextStroke: '13px #000', paintOrder: 'stroke fill' as any,
      width: '100%', transform: `scale(${scale})`,
    }} dangerouslySetInnerHTML={{ __html: colourize(html) }} />
  );
};

const Broll: React.FC<{ t: number }> = ({ t }) => {
  const ev = BROLL_PENGUMC.find(e => t >= e.tIn && t < e.tOut);
  if (!ev) return null;
  const op = ev.tIn <= 0.001
    ? interpolate(t, [ev.tOut - 0.12, ev.tOut], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : fadeInOut(t, ev.tIn, ev.tOut, 0.12);
  const age = t - ev.tIn;
  const kb = interpolate(age, [0, ev.tOut - ev.tIn], [1.0, 1.07], { extrapolateRight: 'clamp' });
  if (ev.mode === 'full') {
    return (
      <AbsoluteFill style={{ opacity: op }}>
        <Img src={ev.src} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${kb})` }} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: 1080, height: CONTENT_BOTTOM, overflow: 'hidden' }}>
        <Img src={ev.src} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${kb})` }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 5, background: TEAL, boxShadow: `0 0 18px ${TEAL}` }} />
      </div>
    </AbsoluteFill>
  );
};

const Badge: React.FC<{ op: number; sc: number; color: string; line1: string; line2?: string; sub?: string; top?: number }> =
({ op, sc, color, line1, line2, sub, top = 320 }) => (
  <div style={{
    position: 'absolute', top, left: '50%', transform: `translate(-50%,-50%) scale(${sc})`,
    opacity: op, background: 'rgba(0,0,0,0.8)', border: `5px solid ${color}`, borderRadius: 26,
    padding: '28px 52px', textAlign: 'center', boxShadow: `0 0 50px ${color}88`, backdropFilter: 'blur(6px)',
  }}>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: line2 ? 60 : 140, color, lineHeight: 1, textShadow: `0 0 32px ${color}` }}>{line1}</div>
    {line2 && <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 82, color: '#fff', lineHeight: 1.05, marginTop: 6 }}>{line2}</div>}
    {sub && <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 32, color: '#fff', letterSpacing: '0.12em', marginTop: 12, opacity: 0.85 }}>{sub}</div>}
  </div>
);

const Thumb: React.FC<{ op: number }> = ({ op }) => (
  <AbsoluteFill style={{ opacity: op }}>
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 45%, rgba(0,0,0,0.85) 100%)' }} />
    <div style={{ position: 'absolute', top: 200, left: 60, right: 60, textAlign: 'center' }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 120, lineHeight: 0.98, color: '#fff', textTransform: 'uppercase', WebkitTextStroke: '4px #000', paintOrder: 'stroke fill' as any }}>
        <span style={{ color: TEAL }}>PENGU</span><br />FLIPS<br /><span style={{ color: RED }}>PEPE</span>
      </div>
      <div style={{ marginTop: 32, display: 'inline-block', background: GREEN, color: '#001a05', fontFamily: FONT, fontWeight: 900, fontSize: 46, letterSpacing: '0.04em', padding: '16px 36px', borderRadius: 16, boxShadow: `0 0 40px ${GREEN}aa` }}>
        $40B INCOMING
      </div>
    </div>
  </AbsoluteFill>
);

export const PenguFlipsPepeMC: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const g = (id: string) => GRAPHICS_PENGUMC.find(e => e.id === id);
  const gOp = (id: string) => { const e = g(id); return e ? fadeInOut(t, e.tIn, e.tOut) : 0; };
  const gSc = (id: string) => {
    const e = g(id); if (!e) return 1;
    return spring({ frame: frame - Math.round(e.tIn * FPS), fps: FPS, config: { damping: 13, stiffness: 320 }, from: 0.6, to: 1.0 });
  };

  return (
    <AbsoluteFill style={{ background: '#000', fontFamily: FONT }}>
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        <OffthreadVideo src={CLIP_PENGUMC} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>
      <Broll t={t} />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 44%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 60%)' }} />
      <Img src={LOGO_KAS} style={{ position: 'absolute', top: 30, left: 30, width: 88, height: 88, filter: `drop-shadow(0 0 12px ${TEAL}88)`, zIndex: 200 }} />

      <AbsoluteFill style={{ zIndex: 100 }}>
        <Badge op={gOp('badge-flip')}        sc={gSc('badge-flip')}        color={GREEN} line1="FLIP"     line2="PEPE" />
        <Badge op={gOp('badge-10x-toshi')}   sc={gSc('badge-10x-toshi')}   color={GREEN} line1="10X"     sub="TOSHI MARKET CAP" />
        <Badge op={gOp('badge-multi')}       sc={gSc('badge-multi')}       color={YELLOW} line1="MORE"   line2="MULTIPLIERS" sub="TOSHI ANGLE" />
        <Badge op={gOp('badge-shib-40b')}    sc={gSc('badge-shib-40b')}    color={GREEN} line1="$40B"    sub="SHIB DID IT" />
        <Badge op={gOp('badge-pengu-40b')}   sc={gSc('badge-pengu-40b')}   color={TEAL}  line1="$40B"    sub="PENGU NEXT" />
        <Badge op={gOp('badge-higher')}      sc={gSc('badge-higher')}      color={GREEN} line1="HIGHER" line2="CHANCE" sub="PENGU > TOSHI" />
      </AbsoluteFill>

      <AbsoluteFill style={{ zIndex: 150, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: CAPTION_Y, left: 50, right: 50, transform: 'translateY(-50%)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Caption frame={frame} t={t} />
        </div>
      </AbsoluteFill>

      {t < 4.56 && <AbsoluteFill style={{ zIndex: 300 }}><Thumb op={interpolate(t, [0, 4.3, 4.56], [1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} /></AbsoluteFill>}

      {SOUNDS_PENGUMC.map((e, i) => (
        <Sequence key={i} from={Math.round(e.t * FPS)} durationInFrames={FPS * 2}>
          <Audio src={e.src} volume={0.5} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

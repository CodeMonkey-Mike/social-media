import React from 'react';
import {
  AbsoluteFill, Audio, Sequence, Img, OffthreadVideo,
  interpolate, useCurrentFrame, spring,
} from 'remotion';
import {
  FPS_PVT as FPS, CLIP_PVT, LOGO_KAS,
  BROLL_PVT, OVERLAYS_PVT, FULLFACE_PVT, GRAPHICS_PVT, CAPTIONS_PVT, SOUNDS_PVT,
} from './constants-pvt';

const CONTENT_BOTTOM = 1010;   // content zone = top ~half; face plays below
const CAPTION_Y = 968;         // caption band at the divider

const TEAL = '#00e5ff', YELLOW = '#ffe600', GREEN = '#39ff14', RED = '#ff5252', GREY = '#9aa3ad';
const FONT = "'Montserrat', 'Arial Black', sans-serif";

function fadeInOut(t: number, tIn: number, tOut: number, fadeS = 0.15) {
  return interpolate(t, [tIn, tIn + fadeS, tOut - fadeS, tOut], [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
}
const colourize = (html: string) =>
  html
    .replace(/<g>/g, `<span style="color:${TEAL}">`).replace(/<\/g>/g, '</span>')
    .replace(/<y>/g, `<span style="color:${YELLOW}">`).replace(/<\/y>/g, '</span>')
    .replace(/<gr>/g, `<span style="color:${GREEN}">`).replace(/<\/gr>/g, '</span>')
    .replace(/<r>/g, `<span style="color:${RED}">`).replace(/<\/r>/g, '</span>');

// ─── Captions ────────────────────────────────────────────────────────────────
function getCaption(t: number) {
  for (let i = CAPTIONS_PVT.length - 1; i >= 0; i--) if (t >= CAPTIONS_PVT[i].t) return { idx: i, html: CAPTIONS_PVT[i].h };
  return { idx: 0, html: '' };
}
const Caption: React.FC<{ frame: number; t: number }> = ({ frame, t }) => {
  const { idx, html } = getCaption(t);
  if (!html) return null;
  const scale = spring({ frame: frame - Math.round((CAPTIONS_PVT[idx]?.t ?? 0) * FPS), fps: FPS, config: { damping: 11, stiffness: 360 }, from: 0.7, to: 1.0 });
  return (
    <div style={{
      fontFamily: FONT, fontWeight: 900, fontSize: 74, color: '#fff', textTransform: 'lowercase',
      textAlign: 'center', letterSpacing: '0.01em', lineHeight: 1.05, WebkitTextStroke: '13px #000',
      paintOrder: 'stroke fill' as any, width: '100%', transform: `scale(${scale})`,
    }} dangerouslySetInnerHTML={{ __html: colourize(html) }} />
  );
};

// ─── B-roll (full-screen or content-zone) ──────────────────────────────────────
const Broll: React.FC<{ t: number }> = ({ t }) => {
  const ev = BROLL_PVT.find(e => t >= e.tIn && t < e.tOut);
  if (!ev) return null;
  const op = ev.tIn <= 0.001
    ? interpolate(t, [ev.tOut - 0.12, ev.tOut], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : fadeInOut(t, ev.tIn, ev.tOut, 0.12);
  const kb = interpolate(t - ev.tIn, [0, ev.tOut - ev.tIn], [1.0, 1.07], { extrapolateRight: 'clamp' });
  if (ev.mode === 'full') {
    return <AbsoluteFill style={{ opacity: op }}><Img src={ev.src} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${kb})` }} /></AbsoluteFill>;
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

// ─── Full-face moment (webcam zoomed to fill the frame) ─────────────────────────
const FullFace: React.FC<{ t: number }> = ({ t }) => {
  const ev = FULLFACE_PVT.find(e => t >= e.tIn && t < e.tOut);
  if (!ev) return null;
  const op = fadeInOut(t, ev.tIn, ev.tOut, 0.15);
  return (
    <AbsoluteFill style={{ opacity: op, overflow: 'hidden', background: '#000' }}>
      <OffthreadVideo src={CLIP_PVT} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.85)', transformOrigin: '50% 80%' }} />
    </AbsoluteFill>
  );
};

// ─── Transparent image overlays (float over the base) ──────────────────────────
const Overlays: React.FC<{ t: number; frame: number }> = ({ t, frame }) => (
  <>
    {OVERLAYS_PVT.map((e, i) => {
      if (t < e.tIn || t >= e.tOut) return null;
      const op = fadeInOut(t, e.tIn, e.tOut, 0.18);
      const pop = spring({ frame: frame - Math.round(e.tIn * FPS), fps: FPS, config: { damping: 12, stiffness: 280 }, from: 0.4, to: 1.0 });
      const float = Math.sin((t - e.tIn) * 2.2) * 10;
      return (
        <Img key={i} src={e.src} style={{
          position: 'absolute', top: e.top + float, left: e.left, width: e.width,
          opacity: op, transform: `scale(${pop})`, filter: 'drop-shadow(0 0 26px rgba(0,229,255,0.55))',
        }} />
      );
    })}
  </>
);

// ─── Code-built graphics ────────────────────────────────────────────────────────
const Card: React.FC<{ op: number; sc: number; children: React.ReactNode; color?: string; top?: number }> =
({ op, sc, children, color = TEAL, top = 300 }) => (
  <div style={{
    position: 'absolute', top, left: '50%', transform: `translate(-50%,-50%) scale(${sc})`, opacity: op,
    background: 'rgba(0,0,0,0.82)', border: `5px solid ${color}`, borderRadius: 28, padding: '34px 52px',
    textAlign: 'center', boxShadow: `0 0 56px ${color}66`, backdropFilter: 'blur(6px)', width: 860,
  }}>{children}</div>
);

const Thumb: React.FC<{ op: number }> = ({ op }) => (
  <AbsoluteFill style={{ opacity: op }}>
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 45%, rgba(0,0,0,0.82) 100%)' }} />
    <div style={{ position: 'absolute', top: 250, left: 60, right: 60, textAlign: 'center' }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 100, lineHeight: 1.0, color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.01em', WebkitTextStroke: '4px #000', paintOrder: 'stroke fill' as any, whiteSpace: 'nowrap' }}>
        KASPA IS<br /><span style={{ color: TEAL }}>UNDERVALUED</span>
      </div>
      <div style={{ marginTop: 30, display: 'inline-block', background: TEAL, color: '#001016', fontFamily: FONT, fontWeight: 900, fontSize: 44, letterSpacing: '0.03em', padding: '16px 34px', borderRadius: 16, boxShadow: `0 0 40px ${TEAL}` }}>
        THE GAP IS THE OPPORTUNITY
      </div>
    </div>
  </AbsoluteFill>
);

export const PriceVsTech: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const g = (id: string) => GRAPHICS_PVT.find(e => e.id === id);
  const gOp = (id: string) => { const e = g(id); return e ? fadeInOut(t, e.tIn, e.tOut) : 0; };
  const gSc = (id: string) => { const e = g(id); if (!e) return 1; return spring({ frame: frame - Math.round(e.tIn * FPS), fps: FPS, config: { damping: 13, stiffness: 320 }, from: 0.6, to: 1.0 }); };

  return (
    <AbsoluteFill style={{ background: '#000', fontFamily: FONT }}>
      {/* Layer 0: base livestream clip (content zone + face + audio) */}
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        <OffthreadVideo src={CLIP_PVT} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>

      {/* Layer 1: b-roll (full or content-zone) */}
      <Broll t={t} />

      {/* Layer 2: full-face moment */}
      <FullFace t={t} />

      {/* Layer 3: caption legibility scrim at the divider */}
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 44%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0) 60%)' }} />

      {/* Layer 4: transparent image overlays */}
      <AbsoluteFill style={{ zIndex: 90 }}><Overlays t={t} frame={frame} /></AbsoluteFill>

      {/* Layer 5: watermark */}
      <Img src={LOGO_KAS} style={{ position: 'absolute', top: 30, left: 30, width: 84, height: 84, filter: `drop-shadow(0 0 12px ${TEAL}88)`, zIndex: 200 }} />

      {/* Layer 6: code-built graphics */}
      <AbsoluteFill style={{ zIndex: 100 }}>
        {gOp('quote') > 0 && (
          <Card op={gOp('quote')} sc={gSc('quote')} top={300}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, color: '#fff' }}>PRICE = <span style={{ color: GREY }}>TODAY</span></div>
            <div style={{ height: 3, background: 'rgba(255,255,255,0.18)', margin: '20px 0' }} />
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, color: TEAL, textShadow: `0 0 26px ${TEAL}` }}>TECH = TOMORROW</div>
          </Card>
        )}
        {gOp('gap') > 0 && (
          <Card op={gOp('gap')} sc={gSc('gap')} color={GREEN} top={300}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 54, color: '#fff' }}>THE GAP =</div>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 84, color: GREEN, textShadow: `0 0 28px ${GREEN}` }}>THE OPPORTUNITY</div>
          </Card>
        )}
        {gOp('dollar') > 0 && (
          <Card op={gOp('dollar')} sc={gSc('dollar')} color={TEAL} top={300}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 150, color: TEAL, lineHeight: 1, textShadow: `0 0 40px ${TEAL}` }}>$1</div>
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 34, color: '#fff', letterSpacing: '0.14em', marginTop: 8 }}>UNDERVALUED UNTIL</div>
          </Card>
        )}
        {gOp('cta') > 0 && (
          <Card op={gOp('cta')} sc={gSc('cta')} color={GREEN} top={320}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 60, color: '#fff', lineHeight: 1.05 }}>MIND</div>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 80, color: GREEN, lineHeight: 1.05, textShadow: `0 0 26px ${GREEN}` }}>THE GAP</div>
          </Card>
        )}
      </AbsoluteFill>

      {/* Layer 7: captions at the divider */}
      <AbsoluteFill style={{ zIndex: 150, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: CAPTION_Y, left: 50, right: 50, transform: 'translateY(-50%)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Caption frame={frame} t={t} />
        </div>
      </AbsoluteFill>

      {/* Layer 8: first-frame thumbnail (IG cover) */}
      {t < 2.6 && <AbsoluteFill style={{ zIndex: 300 }}><Thumb op={interpolate(t, [0, 2.35, 2.6], [1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} /></AbsoluteFill>}

      {/* SFX */}
      {SOUNDS_PVT.map((e, i) => (
        <Sequence key={i} from={Math.round(e.t * FPS)} durationInFrames={FPS * 2}>
          <Audio src={e.src} volume={0.5} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

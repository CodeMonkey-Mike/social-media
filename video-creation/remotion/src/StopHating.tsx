import React from 'react';
import {
  AbsoluteFill, OffthreadVideo, Img,
  interpolate, useCurrentFrame, spring,
} from 'remotion';
import {
  FPS_STOPHATE as FPS,
  CLIP_STOPHATE, BROLL_STOPHATE, CAPTIONS_STOPHATE,
} from './constants-stophate';

// Mike's exception (2026-05-28): captions + content-zone b-roll only.
// Deliberately omitting fullface, transparent overlays, SFX, badges, thumbnail, watermark
// per his instruction — the clip is a motivational/productivity message, not a crypto pitch.

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
  for (let i = CAPTIONS_STOPHATE.length - 1; i >= 0; i--) {
    if (t >= CAPTIONS_STOPHATE[i].t) return { idx: i, html: CAPTIONS_STOPHATE[i].h };
  }
  return { idx: 0, html: '' };
}

const Caption: React.FC<{ frame: number; t: number }> = ({ frame, t }) => {
  const { idx, html } = getCaption(t);
  if (!html) return null;
  const startFrame = Math.round((CAPTIONS_STOPHATE[idx]?.t ?? 0) * FPS);
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

// Content-zone b-roll only (no full-screen). Webcam stays visible below.
const Broll: React.FC<{ t: number }> = ({ t }) => {
  const ev = BROLL_STOPHATE.find(e => t >= e.tIn && t < e.tOut);
  if (!ev) return null;
  const op = fadeInOut(t, ev.tIn, ev.tOut, 0.25);
  const age = t - ev.tIn;
  const kb = interpolate(age, [0, ev.tOut - ev.tIn], [1.0, 1.05], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: 1080, height: CONTENT_BOTTOM, overflow: 'hidden' }}>
        <Img src={ev.src} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${kb})` }} />
        {/* subtle bottom seam line so the content-zone edge reads cleanly */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 3, background: 'rgba(255,255,255,0.18)' }} />
      </div>
    </AbsoluteFill>
  );
};

export const StopHating: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  return (
    <AbsoluteFill style={{ background: '#000', fontFamily: FONT }}>
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        <OffthreadVideo src={CLIP_STOPHATE} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>
      <Broll t={t} />
      {/* caption-band scrim for legibility */}
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 44%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 60%)' }} />
      <AbsoluteFill style={{ zIndex: 150, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: CAPTION_Y, left: 50, right: 50, transform: 'translateY(-50%)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Caption frame={frame} t={t} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

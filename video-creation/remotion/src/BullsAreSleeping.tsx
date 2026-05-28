import React from 'react';
import { AbsoluteFill, OffthreadVideo, useCurrentFrame, spring } from 'remotion';
import { FPS_BULLS as FPS, CLIP_BULLS, CAPTIONS_BULLS } from './constants-bulls';

// CAPTIONS ONLY — no b-roll, overlays, watermark, scrim, or SFX.
// Base = the silence-cut livestream clip (content zone top, face zone bottom).
const CAPTION_Y = 968; // caption band at the zone divider

const TEAL   = '#00e5ff';
const YELLOW = '#ffe600';
const GREEN  = '#39ff14';
const RED    = '#ff5252';
const ORANGE = '#f7931a';
const FONT   = "'Montserrat', 'Arial Black', sans-serif";

const colourize = (html: string) =>
  html
    .replace(/<g>/g, `<span style="color:${TEAL}">`).replace(/<\/g>/g, '</span>')
    .replace(/<y>/g, `<span style="color:${YELLOW}">`).replace(/<\/y>/g, '</span>')
    .replace(/<gr>/g, `<span style="color:${GREEN}">`).replace(/<\/gr>/g, '</span>')
    .replace(/<r>/g, `<span style="color:${RED}">`).replace(/<\/r>/g, '</span>')
    .replace(/<o>/g, `<span style="color:${ORANGE}">`).replace(/<\/o>/g, '</span>');

function getCaption(t: number) {
  for (let i = CAPTIONS_BULLS.length - 1; i >= 0; i--) {
    if (t >= CAPTIONS_BULLS[i].t) return { idx: i, html: CAPTIONS_BULLS[i].h };
  }
  return { idx: 0, html: '' };
}

const Caption: React.FC<{ frame: number; t: number }> = ({ frame, t }) => {
  const { idx, html } = getCaption(t);
  if (!html) return null;
  const startFrame = Math.round((CAPTIONS_BULLS[idx]?.t ?? 0) * FPS);
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

export const BullsAreSleeping: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  return (
    <AbsoluteFill style={{ background: '#000', fontFamily: FONT }}>
      {/* Base: the silence-cut clip (content zone + face zone + audio) */}
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        <OffthreadVideo src={CLIP_BULLS} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>

      {/* Captions only — at the zone divider */}
      <AbsoluteFill style={{ zIndex: 150, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: CAPTION_Y, left: 50, right: 50, transform: 'translateY(-50%)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Caption frame={frame} t={t} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

import React from 'react';
import {
  AbsoluteFill, OffthreadVideo, staticFile,
  useCurrentFrame, spring,
} from 'remotion';
import { CAPTIONS_YULI } from './yuliCrypto1Captions';

// Yuli's first crypto Reel — captioned pass.
// Base = the concatenated final-reel (intro talking-head -> b-roll -> outro talking-head).
// Captions reuse Mike's shorts style: Montserrat 900, lowercase, heavy black stroke, spring bounce,
// one 2-3 word chunk at a time, brand-colour emphasis on tickers / %.

export const FPS_YULI = 30;
export const FRAMES_YULI = 936; // 31.2s @ 30fps

const VIDEO = staticFile('projects/yuli-crypto1/final-reel.mp4');

// ─── Brand colours (match shorts) ─────────────────────────────────────────────
const TEAL   = '#00e5ff';
const YELLOW = '#ffe600';
const GREEN  = '#39ff14';
const RED    = '#ff5252';
const FONT   = "'Montserrat', 'Arial Black', sans-serif";

const CAPTION_Y = 1340; // lower third — clear of her face in the talking-head shots

const colourize = (html: string) =>
  html
    .replace(/<g>/g,  `<span style="color:${TEAL}">`).replace(/<\/g>/g,  '</span>')
    .replace(/<y>/g,  `<span style="color:${YELLOW}">`).replace(/<\/y>/g,  '</span>')
    .replace(/<gr>/g, `<span style="color:${GREEN}">`).replace(/<\/gr>/g, '</span>')
    .replace(/<r>/g,  `<span style="color:${RED}">`).replace(/<\/r>/g,  '</span>');

function getCaption(t: number) {
  for (let i = CAPTIONS_YULI.length - 1; i >= 0; i--) {
    if (t >= CAPTIONS_YULI[i].t) return { idx: i, html: CAPTIONS_YULI[i].h };
  }
  return { idx: 0, html: '' };
}

const Caption: React.FC<{ frame: number; t: number }> = ({ frame, t }) => {
  const { idx, html } = getCaption(t);
  if (!html) return null;
  const startFrame = Math.round((CAPTIONS_YULI[idx]?.t ?? 0) * FPS_YULI);
  const age = frame - startFrame;
  const scale = spring({ frame: age, fps: FPS_YULI, config: { damping: 11, stiffness: 360 }, from: 0.7, to: 1.0 });
  return (
    <div style={{
      fontFamily: FONT, fontWeight: 900, fontSize: 74, color: '#fff',
      textTransform: 'lowercase', textAlign: 'center', letterSpacing: '0.01em',
      lineHeight: 1.05, WebkitTextStroke: '13px #000', paintOrder: 'stroke fill' as any,
      width: '100%', transform: `scale(${scale})`,
    }} dangerouslySetInnerHTML={{ __html: colourize(html) }} />
  );
};

export const YuliCrypto1: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS_YULI;
  return (
    <AbsoluteFill style={{ background: '#000', fontFamily: FONT }}>
      {/* Layer 0: the assembled reel (carries Yuli's VO audio) */}
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        <OffthreadVideo src={VIDEO} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>

      {/* Layer 1: captions */}
      <AbsoluteFill style={{ zIndex: 150, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: CAPTION_Y, left: 50, right: 50, transform: 'translateY(-50%)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Caption frame={frame} t={t} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

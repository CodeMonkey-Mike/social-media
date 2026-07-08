import React from 'react';
import { AbsoluteFill, OffthreadVideo, useCurrentFrame, spring } from 'remotion';
import { FONT, type Caption } from './_kit';
import { FPS_WLW, CLIP_WLW, CAPTIONS_WLW } from './constants-wlwtitle';

// Caption band sits just above this clip's content/face seam (~853px; content is 44% here).
const CAP_Y = 815;

const Captions: React.FC<{ captions: Caption[]; fps: number }> = ({ captions, fps }) => {
  const frame = useCurrentFrame();
  const t = frame / fps;
  let idx = 0, html = '';
  for (let i = captions.length - 1; i >= 0; i--) {
    if (t >= captions[i].t) { idx = i; html = captions[i].h; break; }
  }
  if (!html) return null;
  const startFrame = Math.round((captions[idx]?.t ?? 0) * fps);
  const scale = spring({ frame: frame - startFrame, fps, config: { damping: 11, stiffness: 360 }, from: 0.7, to: 1.0 });
  return (
    <AbsoluteFill style={{ zIndex: 150, pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', top: CAP_Y, left: 50, right: 50, transform: 'translateY(-50%)', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          fontFamily: FONT, fontWeight: 900, fontSize: 74, color: '#fff',
          textTransform: 'lowercase', textAlign: 'center', letterSpacing: '0.01em',
          lineHeight: 1.05, WebkitTextStroke: '13px #000', paintOrder: 'stroke fill' as any,
          width: '100%', transform: `scale(${scale})`,
        }}>{html}</div>
      </div>
    </AbsoluteFill>
  );
};

// Captions-only first render: livestream base (content top + face bottom) + word captions.
// No b-roll / SFX / badges / thumbnail yet.
export const WifeLoseWeightTitle: React.FC = () => (
  <AbsoluteFill style={{ background: '#000', fontFamily: FONT }}>
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <OffthreadVideo src={CLIP_WLW} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </AbsoluteFill>
    {/* readability scrim across the caption band */}
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 36%, rgba(0,0,0,0.5) 43%, rgba(0,0,0,0) 52%)' }} />
    <Captions captions={CAPTIONS_WLW} fps={FPS_WLW} />
  </AbsoluteFill>
);

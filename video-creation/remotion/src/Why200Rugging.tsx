import React from 'react';
import { AbsoluteFill, Audio, Sequence, useCurrentFrame, interpolate } from 'remotion';
import {
  FONT, TEAL, GREEN, RED, YELLOW,
  Base, Scrim, Watermark, Badge, Thumb, CaptionLayer, BrollLayer, useGfx,
} from './_kit';
import {
  FPS_WHY200 as FPS, CLIP_WHY200, LOGO_WHY200,
  BROLL_WHY200, GRAPHICS_WHY200, CAPTIONS_WHY200, SOUNDS_WHY200,
} from './constants-why200';

export const Why200Rugging: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const { gOp, gSc } = useGfx(GRAPHICS_WHY200, FPS);

  return (
    <AbsoluteFill style={{ background: '#000', fontFamily: FONT }}>
      <Base clip={CLIP_WHY200} logo={LOGO_WHY200} />
      <BrollLayer broll={BROLL_WHY200} t={t} />
      <Scrim />
      <Watermark logo={LOGO_WHY200} />

      <AbsoluteFill style={{ zIndex: 100 }}>
        <Badge op={gOp('addsup')}  sc={gSc('addsup')}  color={RED}   line1="IT ALL" line2="ADDS UP" sub="$200 AT A TIME" top={300} />
        <Badge op={gOp('oneplay')} sc={gSc('oneplay')} color={GREEN} line1="ONE REAL" line2="PLAY" sub="NOT TEN RUGS" top={300} />
      </AbsoluteFill>

      <CaptionLayer captions={CAPTIONS_WHY200} fps={FPS} />

      {t < 2.6 && (
        <AbsoluteFill style={{ zIndex: 300 }}>
          <Thumb
            op={interpolate(t, [0, 2.35, 2.6], [1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
            title={<>WHY YOUR <span style={{ color: RED }}>$200</span><br />BETS KEEP<br /><span style={{ color: RED }}>RUGGING</span></>}
            chip="PUT IT IN SOMETHING REAL"
            chipColor={GREEN}
          />
        </AbsoluteFill>
      )}

      {SOUNDS_WHY200.map((e, i) => (
        <Sequence key={i} from={Math.round(e.t * FPS)} durationInFrames={FPS * 2}>
          <Audio src={e.src} volume={0.5} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

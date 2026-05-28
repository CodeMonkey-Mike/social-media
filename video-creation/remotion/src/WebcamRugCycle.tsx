import React from 'react';
import { AbsoluteFill, Audio, Sequence, useCurrentFrame, interpolate } from 'remotion';
import {
  FONT, TEAL, RED, YELLOW,
  Base, Scrim, Watermark, Badge, Thumb, CaptionLayer, BrollLayer, useGfx,
} from './_kit';
import {
  FPS_CYCLE as FPS, CLIP_CYCLE, LOGO_CYCLE,
  BROLL_CYCLE, GRAPHICS_CYCLE, CAPTIONS_CYCLE, SOUNDS_CYCLE,
} from './constants-cycle';

export const WebcamRugCycle: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const { gOp, gSc } = useGfx(GRAPHICS_CYCLE, FPS);

  return (
    <AbsoluteFill style={{ background: '#000', fontFamily: FONT }}>
      <Base clip={CLIP_CYCLE} logo={LOGO_CYCLE} />
      <BrollLayer broll={BROLL_CYCLE} t={t} />
      <Scrim />
      <Watermark logo={LOGO_CYCLE} />

      <AbsoluteFill style={{ zIndex: 100 }}>
        <Badge op={gOp('sameinf')}  sc={gSc('sameinf')}  color={RED}    line1="SAME INFLUENCER" line2="SAME RUG" sub="OVER AND OVER" top={300} />
        <Badge op={gOp('paycheck')} sc={gSc('paycheck')} color={YELLOW} line1="$200" line2="EVERY PAYCHECK" sub="GONE" top={300} />
      </AbsoluteFill>

      <CaptionLayer captions={CAPTIONS_CYCLE} fps={FPS} />

      {t < 2.6 && (
        <AbsoluteFill style={{ zIndex: 300 }}>
          <Thumb
            op={interpolate(t, [0, 2.35, 2.6], [1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
            title={<>CRYPTO'S MOST<br />EXPENSIVE<br /><span style={{ color: RED }}>ADDICTION</span></>}
            chip="STOP FEEDING THE CYCLE"
            chipColor={RED}
          />
        </AbsoluteFill>
      )}

      {SOUNDS_CYCLE.map((e, i) => (
        <Sequence key={i} from={Math.round(e.t * FPS)} durationInFrames={FPS * 2}>
          <Audio src={e.src} volume={0.5} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

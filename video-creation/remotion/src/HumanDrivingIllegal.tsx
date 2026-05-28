import React from 'react';
import { AbsoluteFill, Audio, Sequence, useCurrentFrame, interpolate } from 'remotion';
import {
  FONT, TEAL, GREEN, RED, YELLOW,
  Base, Scrim, Watermark, Badge, Thumb, CaptionLayer, BrollLayer, useGfx,
} from './_kit';
import {
  FPS_SELFDRIVE as FPS, CLIP_SELFDRIVE, LOGO_SELFDRIVE,
  BROLL_SELFDRIVE, GRAPHICS_SELFDRIVE, CAPTIONS_SELFDRIVE, SOUNDS_SELFDRIVE,
} from './constants-selfdrive';

export const HumanDrivingIllegal: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const { gOp, gSc } = useGfx(GRAPHICS_SELFDRIVE, FPS);

  return (
    <AbsoluteFill style={{ background: '#000', fontFamily: FONT }}>
      <Base clip={CLIP_SELFDRIVE} logo={LOGO_SELFDRIVE} />
      <BrollLayer broll={BROLL_SELFDRIVE} t={t} />
      <Scrim />
      <Watermark logo={LOGO_SELFDRIVE} />

      <AbsoluteFill style={{ zIndex: 100 }}>
        <Badge op={gOp('illegal')} sc={gSc('illegal')} color={RED}   line1="HUMAN DRIVING" line2="ILLEGAL" sub="ONE DAY SOON" top={300} />
        <Badge op={gOp('zero')}    sc={gSc('zero')}    color={GREEN} line1="ZERO" line2="ACCIDENTS" sub="TOO PERFECT TO CRASH" top={300} />
      </AbsoluteFill>

      <CaptionLayer captions={CAPTIONS_SELFDRIVE} fps={FPS} />

      {t < 2.6 && (
        <AbsoluteFill style={{ zIndex: 300 }}>
          <Thumb
            op={interpolate(t, [0, 2.35, 2.6], [1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
            title={<>ONE DAY<br />DRIVING WILL BE<br /><span style={{ color: RED }}>ILLEGAL</span></>}
            chip="THE END OF HUMAN DRIVING"
            chipColor={TEAL}
          />
        </AbsoluteFill>
      )}

      {SOUNDS_SELFDRIVE.map((e, i) => (
        <Sequence key={i} from={Math.round(e.t * FPS)} durationInFrames={FPS * 2}>
          <Audio src={e.src} volume={0.5} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

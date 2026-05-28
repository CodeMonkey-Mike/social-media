import React from 'react';
import { AbsoluteFill, Audio, Sequence, useCurrentFrame, interpolate } from 'remotion';
import {
  FONT, TEAL, RED, YELLOW,
  Base, Scrim, Watermark, Badge, Thumb, CaptionLayer, BrollLayer, useGfx,
} from './_kit';
import {
  FPS_ISO as FPS, CLIP_ISO, LOGO_ISO,
  BROLL_ISO, GRAPHICS_ISO, CAPTIONS_ISO, SOUNDS_ISO,
} from './constants-iso';

export const KaspaIso: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const { gOp, gSc } = useGfx(GRAPHICS_ISO, FPS);

  return (
    <AbsoluteFill style={{ background: '#000', fontFamily: FONT }}>
      <Base clip={CLIP_ISO} logo={LOGO_ISO} />
      <BrollLayer broll={BROLL_ISO} t={t} />
      <Scrim />
      <Watermark logo={LOGO_ISO} />

      <AbsoluteFill style={{ zIndex: 100 }}>
        <Badge op={gOp('iso')} sc={gSc('iso')} color={TEAL} line1="ISO 20022" sub="THE GLOBAL BANKING STANDARD" top={300} />
        <Badge op={gOp('vs')}  sc={gSc('vs')}  color={TEAL} line1="COMPETES WITH" line2="SWIFT + XRP" top={300} />
      </AbsoluteFill>

      <CaptionLayer captions={CAPTIONS_ISO} fps={FPS} />

      {t < 2.6 && (
        <AbsoluteFill style={{ zIndex: 300 }}>
          <Thumb
            op={interpolate(t, [0, 2.35, 2.6], [1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
            title={<>KASPA CAN NOW<br />PLUG INTO<br /><span style={{ color: TEAL }}>THE BANKS</span></>}
            chip="ISO 20022 · XRP'S USE CASE"
            chipColor={TEAL}
          />
        </AbsoluteFill>
      )}

      {SOUNDS_ISO.map((e, i) => (
        <Sequence key={i} from={Math.round(e.t * FPS)} durationInFrames={FPS * 2}>
          <Audio src={e.src} volume={0.5} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

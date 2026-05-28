import React from 'react';
import { AbsoluteFill, Audio, Sequence, useCurrentFrame, interpolate } from 'remotion';
import {
  FONT, TEAL, GREEN, RED, YELLOW,
  Base, Scrim, Watermark, Badge, Thumb, CaptionLayer, BrollLayer, useGfx,
} from './_kit';
import {
  FPS_CEMETERY as FPS, CLIP_CEMETERY, LOGO_CEMETERY,
  BROLL_CEMETERY, GRAPHICS_CEMETERY, CAPTIONS_CEMETERY, SOUNDS_CEMETERY,
} from './constants-cemetery';

export const IdeasCemetery: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const { gOp, gSc } = useGfx(GRAPHICS_CEMETERY, FPS);

  return (
    <AbsoluteFill style={{ background: '#000', fontFamily: FONT }}>
      <Base clip={CLIP_CEMETERY} logo={LOGO_CEMETERY} />
      <BrollLayer broll={BROLL_CEMETERY} t={t} />
      <Scrim />
      <Watermark logo={LOGO_CEMETERY} />

      <AbsoluteFill style={{ zIndex: 100 }}>
        <Badge op={gOp('untilnow')} sc={gSc('untilnow')} color={GREEN} line1="UNTIL NOW" sub="AI FINALLY UNLOCKS THEM" top={300} />
      </AbsoluteFill>

      <CaptionLayer captions={CAPTIONS_CEMETERY} fps={FPS} />

      {t < 2.6 && (
        <AbsoluteFill style={{ zIndex: 300 }}>
          <Thumb
            op={interpolate(t, [0, 2.35, 2.6], [1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
            title={<>THE BEST IDEAS<br />IN HISTORY ARE<br /><span style={{ color: RED }}>IN A GRAVEYARD</span></>}
            chip="UNTIL NOW"
            chipColor={YELLOW}
            titleSize={96}
          />
        </AbsoluteFill>
      )}

      {SOUNDS_CEMETERY.map((e, i) => (
        <Sequence key={i} from={Math.round(e.t * FPS)} durationInFrames={FPS * 2}>
          <Audio src={e.src} volume={0.5} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

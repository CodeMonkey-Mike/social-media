import React from 'react';
import { AbsoluteFill, Audio, Sequence, useCurrentFrame, interpolate } from 'remotion';
import {
  FONT, TEAL, GREEN, RED, YELLOW,
  Base, Scrim, Watermark, Badge, Thumb, CaptionLayer, BrollLayer, useGfx,
} from './_kit';
import {
  FPS_STABLE as FPS, CLIP_STABLE, LOGO_STABLE,
  BROLL_STABLE, GRAPHICS_STABLE, CAPTIONS_STABLE, SOUNDS_STABLE,
} from './constants-stable';

export const StablecoinYield: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const { gOp, gSc } = useGfx(GRAPHICS_STABLE, FPS);

  return (
    <AbsoluteFill style={{ background: '#000', fontFamily: FONT }}>
      <Base clip={CLIP_STABLE} logo={LOGO_STABLE} />
      <BrollLayer broll={BROLL_STABLE} t={t} />
      <Scrim />
      <Watermark logo={LOGO_STABLE} />

      <AbsoluteFill style={{ zIndex: 100 }}>
        <Badge op={gOp('flight')} sc={gSc('flight')} color={RED}   line1="DEPOSIT" line2="FLIGHT" sub="BANKS' BIG FEAR" top={300} />
        <Badge op={gOp('twofor')} sc={gSc('twofor')} color={GREEN} line1="$2 IN" line2="FOR EVERY $1 OUT" sub="FROM ABROAD" top={300} />
      </AbsoluteFill>

      <CaptionLayer captions={CAPTIONS_STABLE} fps={FPS} />

      {t < 2.6 && (
        <AbsoluteFill style={{ zIndex: 300 }}>
          <Thumb
            op={interpolate(t, [0, 2.35, 2.6], [1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
            title={<>BANKS ARE<br />TERRIFIED OF<br /><span style={{ color: GREEN }}>STABLECOIN YIELD</span></>}
            chip="HERE'S THE REAL REASON"
            chipColor={GREEN}
            titleSize={92}
          />
        </AbsoluteFill>
      )}

      {SOUNDS_STABLE.map((e, i) => (
        <Sequence key={i} from={Math.round(e.t * FPS)} durationInFrames={FPS * 2}>
          <Audio src={e.src} volume={0.5} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

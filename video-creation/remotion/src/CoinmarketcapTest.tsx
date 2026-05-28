import React from 'react';
import { AbsoluteFill, Audio, Sequence, useCurrentFrame, interpolate } from 'remotion';
import {
  FONT, TEAL, RED, YELLOW,
  Base, Scrim, Watermark, Badge, Thumb, CaptionLayer, BrollLayer, useGfx,
} from './_kit';
import {
  FPS_CMC as FPS, CLIP_CMC, LOGO_CMC,
  BROLL_CMC, GRAPHICS_CMC, CAPTIONS_CMC, SOUNDS_CMC,
} from './constants-cmc';

export const CoinmarketcapTest: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const { gOp, gSc } = useGfx(GRAPHICS_CMC, FPS);

  return (
    <AbsoluteFill style={{ background: '#000', fontFamily: FONT }}>
      <Base clip={CLIP_CMC} logo={LOGO_CMC} />
      <BrollLayer broll={BROLL_CMC} t={t} />
      <Scrim />
      <Watermark logo={LOGO_CMC} />

      <AbsoluteFill style={{ zIndex: 100 }}>
        <Badge op={gOp('flagged')}  sc={gSc('flagged')}  color={RED} line1="FLAGGED" line2="NOT TRUSTWORTHY" sub="CAN'T BUY A LISTING" top={300} />
        <Badge op={gOp('stayaway')} sc={gSc('stayaway')} color={RED} line1="RED FLAG" line2="STAY AWAY" top={300} />
      </AbsoluteFill>

      <CaptionLayer captions={CAPTIONS_CMC} fps={FPS} />

      {t < 2.6 && (
        <AbsoluteFill style={{ zIndex: 300 }}>
          <Thumb
            op={interpolate(t, [0, 2.35, 2.6], [1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
            title={<>WHEN A COIN<br />CAN'T GET ON<br /><span style={{ color: RED }}>COINMARKETCAP</span></>}
            chip="RED FLAG · STAY AWAY"
            chipColor={RED}
            titleSize={84}
          />
        </AbsoluteFill>
      )}

      {SOUNDS_CMC.map((e, i) => (
        <Sequence key={i} from={Math.round(e.t * FPS)} durationInFrames={FPS * 2}>
          <Audio src={e.src} volume={0.5} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

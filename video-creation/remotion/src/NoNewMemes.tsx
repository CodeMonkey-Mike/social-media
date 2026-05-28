import React from 'react';
import { AbsoluteFill, Audio, Sequence, useCurrentFrame, interpolate } from 'remotion';
import {
  FONT, TEAL, GREEN, RED, YELLOW,
  Base, Scrim, Watermark, Badge, Thumb, CaptionLayer, BrollLayer, useGfx,
} from './_kit';
import {
  FPS_NOMEMES as FPS, CLIP_NOMEMES, LOGO_NOMEMES,
  BROLL_NOMEMES, GRAPHICS_NOMEMES, CAPTIONS_NOMEMES, SOUNDS_NOMEMES,
} from './constants-nomemes';

export const NoNewMemes: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const { gOp, gSc } = useGfx(GRAPHICS_NOMEMES, FPS);

  return (
    <AbsoluteFill style={{ background: '#000', fontFamily: FONT }}>
      <Base clip={CLIP_NOMEMES} logo={LOGO_NOMEMES} />
      <BrollLayer broll={BROLL_NOMEMES} t={t} />
      <Scrim />
      <Watermark logo={LOGO_NOMEMES} />

      <AbsoluteFill style={{ zIndex: 100 }}>
        <Badge op={gOp('rally')}   sc={gSc('rally')}   color={GREEN}  line1="WAIT FOR" line2="THE RALLY" sub="THEN BUY NEW MEMES" top={300} />
        <Badge op={gOp('ceiling')} sc={gSc('ceiling')} color={YELLOW} line1="CAN'T EVEN HIT" line2="$20M" sub="IN A BEAR MARKET" top={300} />
        <Badge op={gOp('timed')}   sc={gSc('timed')}   color={GREEN}  line1="TIMED TO" line2="THE RALLY" sub="LIKE PENGU · TRUMP PUMP '24" top={300} />
      </AbsoluteFill>

      <CaptionLayer captions={CAPTIONS_NOMEMES} fps={FPS} />

      {t < 2.6 && (
        <AbsoluteFill style={{ zIndex: 300 }}>
          <Thumb
            op={interpolate(t, [0, 2.35, 2.6], [1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
            title={<>DON'T BUY NEW<br />MEMES IN A<br /><span style={{ color: RED }}>BEAR MARKET</span></>}
            chip="WAIT FOR THE RALLY"
            chipColor={GREEN}
          />
        </AbsoluteFill>
      )}

      {SOUNDS_NOMEMES.map((e, i) => (
        <Sequence key={i} from={Math.round(e.t * FPS)} durationInFrames={FPS * 2}>
          <Audio src={e.src} volume={0.5} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

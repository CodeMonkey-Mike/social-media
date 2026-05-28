import React from 'react';
import { AbsoluteFill, Audio, Sequence, useCurrentFrame, interpolate } from 'remotion';
import {
  FONT, TEAL, GREEN, YELLOW,
  Base, Scrim, Watermark, Badge, Thumb, CaptionLayer, BrollLayer, useGfx,
} from './_kit';
import {
  FPS_ENTRY as FPS, CLIP_ENTRY, LOGO_ENTRY,
  BROLL_ENTRY, GRAPHICS_ENTRY, CAPTIONS_ENTRY, SOUNDS_ENTRY,
} from './constants-entry';

export const KaspaEntry: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const { gOp, gSc } = useGfx(GRAPHICS_ENTRY, FPS);

  return (
    <AbsoluteFill style={{ background: '#000', fontFamily: FONT }}>
      <Base clip={CLIP_ENTRY} logo={LOGO_ENTRY} />
      <BrollLayer broll={BROLL_ENTRY} t={t} />
      <Scrim />
      <Watermark logo={LOGO_ENTRY} />

      <AbsoluteFill style={{ zIndex: 100 }}>
        <Badge op={gOp('nomatter')} sc={gSc('nomatter')} color={YELLOW} line1="ENTRY PRICE" line2="DOESN'T MATTER" sub="ON A LONG-TERM HOLD" top={300} />
        <Badge op={gOp('keepbuy')}  sc={gSc('keepbuy')}  color={GREEN}  line1="JUST KEEP" line2="BUYING" sub="IF IT'S YOUR CONVICTION" top={300} />
      </AbsoluteFill>

      <CaptionLayer captions={CAPTIONS_ENTRY} fps={FPS} />

      {t < 2.6 && (
        <AbsoluteFill style={{ zIndex: 300 }}>
          <Thumb
            op={interpolate(t, [0, 2.35, 2.6], [1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
            title={<>YOUR ENTRY<br />PRICE WON'T<br /><span style={{ color: TEAL }}>MATTER</span></>}
            chip="IF KASPA IS YOUR CONVICTION"
            chipColor={TEAL}
          />
        </AbsoluteFill>
      )}

      {SOUNDS_ENTRY.map((e, i) => (
        <Sequence key={i} from={Math.round(e.t * FPS)} durationInFrames={FPS * 2}>
          <Audio src={e.src} volume={0.5} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

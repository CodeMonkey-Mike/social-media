import React from 'react';
import { AbsoluteFill, Audio, Sequence, useCurrentFrame, interpolate } from 'remotion';
import {
  FONT, TEAL, GREEN, BLUE, YELLOW, GREY,
  Base, Scrim, Watermark, Badge, Thumb, CaptionLayer, BrollLayer, useGfx,
} from './_kit';
import {
  FPS_TON as FPS, CLIP_TON, LOGO_TON,
  BROLL_TON, GRAPHICS_TON, CAPTIONS_TON, SOUNDS_TON,
} from './constants-ton';

export const MicroStrategyTon: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const { gOp, gSc } = useGfx(GRAPHICS_TON, FPS);

  return (
    <AbsoluteFill style={{ background: '#000', fontFamily: FONT }}>
      <Base clip={CLIP_TON} logo={LOGO_TON} />
      <BrollLayer broll={BROLL_TON} t={t} />
      <Scrim />
      <Watermark logo={LOGO_TON} />

      {/* graphics */}
      <AbsoluteFill style={{ zIndex: 100 }}>
        <Badge op={gOp('stat')}   sc={gSc('stat')}   color={BLUE}  line1="222M TON" line2="221M STAKED" sub="HELD BY ONE FIRM" top={300} />
        <Badge op={gOp('pct')}    sc={gSc('pct')}    color={GREEN} line1="4.29%" line2="OF ALL TON" sub="LOCKED UP BY ONE COMPANY" top={300} />
        <Badge op={gOp('val')}    sc={gSc('val')}    color={GREEN} line1="$433M" line2="FAIR VALUE" sub="AS OF MAY 6" top={300} />
        <Badge op={gOp('mscard')} sc={gSc('mscard')} color={BLUE}  line1="THE MICROSTRATEGY" line2="OF TON" sub="LARGEST PUBLIC TON TREASURY" top={300} />
      </AbsoluteFill>

      <CaptionLayer captions={CAPTIONS_TON} fps={FPS} />

      {/* first-frame thumbnail (IG cover) */}
      {t < 2.6 && (
        <AbsoluteFill style={{ zIndex: 300 }}>
          <Thumb
            op={interpolate(t, [0, 2.35, 2.6], [1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
            title={<>A COMPANY IS<br />QUIETLY HOARDING<br /><span style={{ color: GREEN }}>4%</span> OF <span style={{ color: BLUE }}>THIS COIN</span></>}
            chip="THE MICROSTRATEGY OF TON"
            chipColor={BLUE}
            titleSize={104}
          />
        </AbsoluteFill>
      )}

      {SOUNDS_TON.map((e, i) => (
        <Sequence key={i} from={Math.round(e.t * FPS)} durationInFrames={FPS * 2}>
          <Audio src={e.src} volume={0.5} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

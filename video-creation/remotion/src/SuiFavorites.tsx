import React from 'react';
import { AbsoluteFill, Audio, Sequence, useCurrentFrame, interpolate } from 'remotion';
import {
  FONT, TEAL, GREEN, YELLOW,
  Base, Scrim, Watermark, Badge, Thumb, CaptionLayer, BrollLayer, useGfx,
} from './_kit';
import {
  FPS_SUI as FPS, CLIP_SUI, LOGO_SUI,
  BROLL_SUI, GRAPHICS_SUI, CAPTIONS_SUI, SOUNDS_SUI,
} from './constants-sui';

export const SuiFavorites: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const { gOp, gSc } = useGfx(GRAPHICS_SUI, FPS);

  return (
    <AbsoluteFill style={{ background: '#000', fontFamily: FONT }}>
      <Base clip={CLIP_SUI} logo={LOGO_SUI} />
      <BrollLayer broll={BROLL_SUI} t={t} />
      <Scrim />
      <Watermark logo={LOGO_SUI} />

      <AbsoluteFill style={{ zIndex: 100 }}>
        <Badge op={gOp('mcap')} sc={gSc('mcap')} color={TEAL}   line1="$4.2B" line2="MARKET CAP" sub="ROOM TO RUN" top={300} />
        <Badge op={gOp('x130')} sc={gSc('x130')} color={GREEN}  line1="130X" line2="ON A SUI PLAY" sub="DAG · AI" top={300} />
        <Badge op={gOp('etf')}  sc={gSc('etf')}  color={YELLOW} line1="ETFs INCOMING" sub="GRAYSCALE · 21SHARES · CANARY" top={300} />
      </AbsoluteFill>

      <CaptionLayer captions={CAPTIONS_SUI} fps={FPS} />

      {t < 2.6 && (
        <AbsoluteFill style={{ zIndex: 300 }}>
          <Thumb
            op={interpolate(t, [0, 2.35, 2.6], [1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
            title={<>THIS COIN DID<br /><span style={{ color: GREEN }}>130X</span><br />AND HAS ETFs</>}
            chip="SUI IS ON MY LIST"
            chipColor={TEAL}
          />
        </AbsoluteFill>
      )}

      {SOUNDS_SUI.map((e, i) => (
        <Sequence key={i} from={Math.round(e.t * FPS)} durationInFrames={FPS * 2}>
          <Audio src={e.src} volume={0.5} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

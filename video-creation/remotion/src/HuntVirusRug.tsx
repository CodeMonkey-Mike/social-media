import React from 'react';
import { AbsoluteFill, Audio, Sequence, useCurrentFrame, interpolate, spring } from 'remotion';
import {
  FONT, TEAL, RED, YELLOW, GREY,
  Base, Scrim, Watermark, Badge, Thumb, CaptionLayer, BrollLayer, useGfx,
} from './_kit';
import {
  FPS_RUG as FPS, CLIP_RUG, LOGO_RUG,
  BROLL_RUG, GRAPHICS_RUG, CAPTIONS_RUG, SOUNDS_RUG,
} from './constants-rug';

// ─── RUGGED diagonal stamp ───────────────────────────────────────────────────────
const RugStamp: React.FC<{ op: number; frame: number; tIn: number }> = ({ op, frame, tIn }) => {
  const slam = spring({ frame: frame - Math.round(tIn * FPS), fps: FPS, config: { damping: 9, stiffness: 200 }, from: 1.8, to: 1.0 });
  return (
    <div style={{
      position: 'absolute', top: 360, left: '50%',
      transform: `translate(-50%,-50%) rotate(-14deg) scale(${slam})`, opacity: op,
      border: `12px solid ${RED}`, borderRadius: 18, padding: '20px 60px',
      background: 'rgba(20,0,0,0.55)', boxShadow: `0 0 70px ${RED}`,
    }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 150, color: RED, letterSpacing: '0.04em', textShadow: `0 0 30px ${RED}` }}>RUGGED</div>
    </div>
  );
};

export const HuntVirusRug: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const { gOp, gSc } = useGfx(GRAPHICS_RUG, FPS);

  return (
    <AbsoluteFill style={{ background: '#000', fontFamily: FONT }}>
      <Base clip={CLIP_RUG} logo={LOGO_RUG} />
      <BrollLayer broll={BROLL_RUG} t={t} />
      <Scrim />
      <Watermark logo={LOGO_RUG} />

      {/* graphics */}
      <AbsoluteFill style={{ zIndex: 100 }}>
        <Badge op={gOp('covid')}  sc={gSc('covid')}  color={RED}    line1="THE NEXT" line2="COVID?" sub="MANUFACTURED HYPE" top={300} />
        <Badge op={gOp('nobody')} sc={gSc('nobody')} color={GREY}   line1="NOBODY" line2="CARES" sub="HYPE ALREADY FADED" top={300} />
        {gOp('rug') > 0 && <RugStamp op={gOp('rug')} frame={frame} tIn={22.85} />}
      </AbsoluteFill>

      <CaptionLayer captions={CAPTIONS_RUG} fps={FPS} />

      {/* first-frame thumbnail (IG cover) */}
      {t < 2.6 && (
        <AbsoluteFill style={{ zIndex: 300 }}>
          <Thumb
            op={interpolate(t, [0, 2.35, 2.6], [1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
            title={<>HOW TO SPOT<br />A <span style={{ color: RED }}>RUG</span> IN<br />10 SECONDS</>}
            chip="THE HYPE-COIN TRAP"
            chipColor={RED}
          />
        </AbsoluteFill>
      )}

      {SOUNDS_RUG.map((e, i) => (
        <Sequence key={i} from={Math.round(e.t * FPS)} durationInFrames={FPS * 2}>
          <Audio src={e.src} volume={0.5} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

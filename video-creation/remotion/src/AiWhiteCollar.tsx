import React from 'react';
import { AbsoluteFill, Audio, Sequence, useCurrentFrame, interpolate } from 'remotion';
import {
  FONT, TEAL, GREEN, RED, YELLOW, GREY,
  Base, Scrim, Watermark, Badge, Thumb, CaptionLayer, BrollLayer, useGfx,
} from './_kit';
import {
  FPS_AIWC as FPS, CLIP_AIWC, LOGO_AIWC,
  BROLL_AIWC, GRAPHICS_AIWC, CAPTIONS_AIWC, SOUNDS_AIWC,
} from './constants-aiwc';

// ─── 1 engineer = 10 card ────────────────────────────────────────────────────────
const OneVsTen: React.FC<{ op: number; sc: number; frame: number }> = ({ op, sc, frame }) => {
  const pulse = interpolate(Math.sin(frame / 6), [-1, 1], [0.97, 1.03]);
  return (
    <div style={{
      position: 'absolute', top: 300, left: '50%', transform: `translate(-50%,-50%) scale(${sc * pulse})`,
      opacity: op, background: 'rgba(0,0,0,0.82)', border: `5px solid ${YELLOW}`, borderRadius: 30,
      padding: '34px 44px', boxShadow: `0 0 60px ${YELLOW}88`, display: 'flex', alignItems: 'center', width: 860,
    }}>
      <div style={{ textAlign: 'center', flex: 1 }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 150, color: TEAL, lineHeight: 1, textShadow: `0 0 40px ${TEAL}` }}>1</div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, color: '#fff', letterSpacing: '0.08em' }}>ENGINEER</div>
      </div>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 70, color: GREY, padding: '0 16px' }}>=</div>
      <div style={{ textAlign: 'center', flex: 1 }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 150, color: RED, lineHeight: 1, textShadow: `0 0 40px ${RED}` }}>10</div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, color: '#fff', letterSpacing: '0.08em' }}>JOBS GONE</div>
      </div>
    </div>
  );
};

export const AiWhiteCollar: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const { gOp, gSc } = useGfx(GRAPHICS_AIWC, FPS);

  return (
    <AbsoluteFill style={{ background: '#000', fontFamily: FONT }}>
      <Base clip={CLIP_AIWC} logo={LOGO_AIWC} />
      <BrollLayer broll={BROLL_AIWC} t={t} />
      <Scrim />
      <Watermark logo={LOGO_AIWC} />

      {/* graphics */}
      <AbsoluteFill style={{ zIndex: 100 }}>
        <Badge op={gOp('badge2y')} sc={gSc('badge2y')} color={YELLOW} line1="JUST 2" line2="YEARS" sub="UNTIL IT RESHAPES EVERYTHING" top={300} />
        {gOp('card110') > 0 && <OneVsTen op={gOp('card110')} sc={gSc('card110')} frame={frame} />}
      </AbsoluteFill>

      <CaptionLayer captions={CAPTIONS_AIWC} fps={FPS} />

      {/* first-frame thumbnail (IG cover) */}
      {t < 2.6 && (
        <AbsoluteFill style={{ zIndex: 300 }}>
          <Thumb
            op={interpolate(t, [0, 2.35, 2.6], [1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
            title={<>YOUR JOB<br />HAS ABOUT<br /><span style={{ color: RED }}>2 YEARS</span> LEFT</>}
            chip="AI IS COMING FOR WHITE COLLAR"
            chipColor={YELLOW}
          />
        </AbsoluteFill>
      )}

      {SOUNDS_AIWC.map((e, i) => (
        <Sequence key={i} from={Math.round(e.t * FPS)} durationInFrames={FPS * 2}>
          <Audio src={e.src} volume={0.5} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

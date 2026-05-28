import React from 'react';
import { AbsoluteFill, Audio, Sequence, useCurrentFrame, interpolate } from 'remotion';
import {
  FONT, TEAL, GREEN, RED, YELLOW, GREY,
  Base, Scrim, Watermark, Badge, Thumb, CaptionLayer, BrollLayer, useGfx,
} from './_kit';
import {
  FPS_PENGU as FPS, CLIP_PENGU, LOGO_PENGU,
  BROLL_PENGU, GRAPHICS_PENGU, CAPTIONS_PENGU, SOUNDS_PENGU,
} from './constants-pengu';

// ─── Ranking card: PENGU above PEPE / SHIBA ──────────────────────────────────────
const RankCard: React.FC<{ op: number; sc: number }> = ({ op, sc }) => {
  const Row = ({ name, color, arrow, big }: { name: string; color: string; arrow: string; big?: boolean }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: big ? 'rgba(0,229,255,0.12)' : 'rgba(255,255,255,0.05)',
      border: `${big ? 4 : 2}px solid ${color}`, borderRadius: 16, padding: big ? '20px 30px' : '14px 30px', marginBottom: 16 }}>
      <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: big ? 66 : 50, color }}>{name}</span>
      <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: big ? 60 : 46, color, textShadow: `0 0 22px ${color}` }}>{arrow}</span>
    </div>
  );
  return (
    <div style={{
      position: 'absolute', top: 150, left: 70, right: 70, transform: `scale(${sc})`, transformOrigin: 'top center',
      opacity: op, background: 'rgba(0,0,0,0.82)', border: '4px solid rgba(255,255,255,0.16)', borderRadius: 28,
      padding: '36px 40px', backdropFilter: 'blur(8px)',
    }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: '#fff', textAlign: 'center', letterSpacing: '0.1em', marginBottom: 28 }}>THE FLIP</div>
      <Row name="PENGU" color={TEAL} arrow="▲" big />
      <Row name="PEPE" color={RED} arrow="▼" />
      <Row name="SHIBA" color={GREY} arrow="▼" />
    </div>
  );
};

export const PenguFlipsPepe: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const { gOp, gSc } = useGfx(GRAPHICS_PENGU, FPS);

  return (
    <AbsoluteFill style={{ background: '#000', fontFamily: FONT }}>
      <Base clip={CLIP_PENGU} logo={LOGO_PENGU} />
      <BrollLayer broll={BROLL_PENGU} t={t} />
      <Scrim />
      <Watermark logo={LOGO_PENGU} />

      {/* graphics */}
      <AbsoluteFill style={{ zIndex: 100 }}>
        <Badge op={gOp('flip')} sc={gSc('flip')} color={RED} line1="FLIP" line2="PEPE" sub="PENGU TAKES #1" top={300} />
        {gOp('rank') > 0 && <RankCard op={gOp('rank')} sc={gSc('rank')} />}
      </AbsoluteFill>

      <CaptionLayer captions={CAPTIONS_PENGU} fps={FPS} />

      {/* first-frame thumbnail (IG cover) */}
      {t < 2.6 && (
        <AbsoluteFill style={{ zIndex: 300 }}>
          <Thumb
            op={interpolate(t, [0, 2.35, 2.6], [1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
            title={<>THIS COIN<br />IS ABOUT TO<br /><span style={{ color: TEAL }}>DETHRONE</span> <span style={{ color: RED }}>PEPE</span></>}
            chip="PENGU IS THE PLAY"
            chipColor={TEAL}
          />
        </AbsoluteFill>
      )}

      {SOUNDS_PENGU.map((e, i) => (
        <Sequence key={i} from={Math.round(e.t * FPS)} durationInFrames={FPS * 2}>
          <Audio src={e.src} volume={0.5} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

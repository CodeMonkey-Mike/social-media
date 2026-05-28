import React from 'react';
import {
  AbsoluteFill, Audio, Sequence, OffthreadVideo,
  useCurrentFrame, spring,
} from 'remotion';
import {
  FPS_FYCZ as FPS,
  CLIPS, CAPTIONS_FYCZ, SOUNDS_FYCZ,
  LOGO_KAS, TOTAL_FRAMES,
} from './constants-fycz';

// ─── Layout ────────────────────────────────────────────────────────────────────
const W         = 1080;
const H         = 1920;
const SCREEN_H  = 860;   // content zone height
const DIV_Y     = 860;
const CAP_TOP   = 863;
const CAP_H     = 140;
const FACE_TOP  = 1003;
const SAFE_B    = 240;   // bottom safe zone (avoids platform UI)

// ─── Colours ───────────────────────────────────────────────────────────────────
const TEAL   = '#00e5ff';
const GREEN  = '#39ff14';
const ORANGE = '#f7931a';
const RED    = '#ff4444';
const YELLOW = '#ffe600';

// ─── Active caption lookup ─────────────────────────────────────────────────────
function getCaption(t: number): { idx: number; html: string } {
  for (let i = CAPTIONS_FYCZ.length - 1; i >= 0; i--) {
    if (t >= CAPTIONS_FYCZ[i].t) return { idx: i, html: CAPTIONS_FYCZ[i].h };
  }
  return { idx: 0, html: '' };
}

// ─── Caption component ─────────────────────────────────────────────────────────
const Caption: React.FC<{ frame: number; t: number }> = ({ frame, t }) => {
  const { idx, html } = getCaption(t);
  const captionStart = CAPTIONS_FYCZ[idx]?.t ?? 0;
  const age = frame - Math.round(captionStart * FPS);
  const scale = spring({ frame: age, fps: FPS, config: { damping: 10, stiffness: 400 }, from: 0.7, to: 1.0 });

  const coloured = html
    .replace(/<g>/g,  `<span style="color:${TEAL}">`)
    .replace(/<\/g>/g, '</span>')
    .replace(/<o>/g,  `<span style="color:${ORANGE}">`)
    .replace(/<\/o>/g, '</span>')
    .replace(/<r>/g,  `<span style="color:${RED}">`)
    .replace(/<\/r>/g, '</span>')
    .replace(/<y>/g,  `<span style="color:${YELLOW}">`)
    .replace(/<\/y>/g, '</span>');

  return (
    <div
      style={{
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 900,
        fontSize: 72,
        color: '#fff',
        textTransform: 'lowercase',
        textAlign: 'center',
        letterSpacing: '0.08em',
        lineHeight: 1.1,
        WebkitTextStroke: '11px #000',
        paintOrder: 'stroke fill' as any,
        width: '100%',
        whiteSpace: 'nowrap',
        transform: `scale(${scale})`,
      }}
      dangerouslySetInnerHTML={{ __html: coloured }}
    />
  );
};

// ─── Screen share zone ─────────────────────────────────────────────────────────
// Renders the correct clip's screen share video into the content zone.
const ScreenZone: React.FC<{ t: number }> = ({ t }) => {
  const activeClip = CLIPS.find(c => t >= c.tStart && t < c.tEnd) ?? CLIPS[0];
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0,
      height: SCREEN_H, overflow: 'hidden', background: '#000',
    }}>
      {CLIPS.map(clip => {
        const fromFrame  = Math.round(clip.tStart * FPS);
        const durFrames  = Math.round((clip.tEnd - clip.tStart) * FPS);
        const isActive   = clip.id === activeClip.id;
        if (!isActive) return null;
        return (
          <Sequence key={clip.id} from={fromFrame} durationInFrames={durFrames}>
            <OffthreadVideo
              src={clip.screen}
              startFrom={clip.startFrom}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'top center',
              }}
            />
          </Sequence>
        );
      })}
    </div>
  );
};

// ─── Face cam zone ─────────────────────────────────────────────────────────────
const FaceZone: React.FC<{ t: number }> = ({ t }) => {
  const activeClip = CLIPS.find(c => t >= c.tStart && t < c.tEnd) ?? CLIPS[0];
  return (
    <div style={{
      position: 'absolute',
      top: FACE_TOP, left: 0, right: 0,
      bottom: SAFE_B, overflow: 'hidden',
    }}>
      {CLIPS.map(clip => {
        const fromFrame = Math.round(clip.tStart * FPS);
        const durFrames = Math.round((clip.tEnd - clip.tStart) * FPS);
        const isActive  = clip.id === activeClip.id;
        if (!isActive) return null;
        return (
          <Sequence key={clip.id} from={fromFrame} durationInFrames={durFrames}>
            <OffthreadVideo
              src={clip.face}
              startFrom={clip.startFrom}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center top',
              }}
            />
          </Sequence>
        );
      })}
    </div>
  );
};

// ─── Main composition ──────────────────────────────────────────────────────────
export const FourYearCycleZombies: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  return (
    <AbsoluteFill style={{ background: '#000', fontFamily: 'Montserrat, sans-serif', overflow: 'hidden' }}>

      {/* ── Screen share content zone ─────────────────────────────────────── */}
      <ScreenZone t={t} />

      {/* ── Glowing divider ──────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: DIV_Y, left: 0, right: 0, height: 3, zIndex: 10,
        background: `linear-gradient(90deg, transparent, ${TEAL} 20%, ${TEAL} 80%, transparent)`,
        boxShadow: `0 0 14px rgba(0,229,255,.7)`,
      }} />

      {/* ── Caption band ──────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute',
        top: CAP_TOP, left: 0, right: 0, height: CAP_H,
        background: 'linear-gradient(180deg, rgba(0,0,0,.88) 0%, rgba(0,0,0,.97) 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 44px', zIndex: 40, overflow: 'hidden',
      }}>
        <Caption frame={frame} t={t} />
      </div>

      {/* ── Face cam zone ─────────────────────────────────────────────────── */}
      <FaceZone t={t} />

      {/* ── Kaspa watermark ───────────────────────────────────────────────── */}
      <img
        src={LOGO_KAS}
        style={{
          position: 'absolute', top: 18, left: 18,
          width: 100, height: 100, borderRadius: '50%',
          zIndex: 300,
          boxShadow: `0 0 20px rgba(0,229,255,.6), 0 0 40px rgba(0,229,255,.3)`,
        }}
      />

      {/* ── Sound effects ─────────────────────────────────────────────────── */}
      {SOUNDS_FYCZ.map(e => (
        <Sequence key={e.t} from={Math.round(e.t * FPS)} durationInFrames={FPS}>
          <Audio src={e.src} />
        </Sequence>
      ))}

    </AbsoluteFill>
  );
};

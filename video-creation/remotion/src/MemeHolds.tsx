import React from 'react';
import {
  AbsoluteFill, Audio, Sequence, OffthreadVideo,
  interpolate, useCurrentFrame, spring,
} from 'remotion';
import {
  FPS_MH as FPS,
  CLIP_MH, LOGO_KAS_MH,
  BROLL_EVENTS_MH, OVERLAYS_MH, CAPTIONS_MH, SOUNDS_MH,
  ZOOM_START_MH, ZOOM_TO_MH,
} from './constants-mh';

const TEAL   = '#00e5ff';
const YELLOW = '#ffe600';
const GREEN  = '#39ff14';
const RED    = '#ff4444';
const PINK   = '#ff5fa8';
const PURPLE = '#9d6dff';

function fadeInOut(t: number, tIn: number, tOut: number, fadeS = 0.2) {
  return interpolate(
    t,
    [tIn, tIn + fadeS, tOut - fadeS, tOut],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
}

function getCaption(t: number) {
  for (let i = CAPTIONS_MH.length - 1; i >= 0; i--) {
    if (t >= CAPTIONS_MH[i].t) return { idx: i, html: CAPTIONS_MH[i].h };
  }
  return { idx: 0, html: '' };
}

const Caption: React.FC<{ frame: number; t: number }> = ({ frame, t }) => {
  const { idx, html } = getCaption(t);
  const captionStartFrame = Math.round((CAPTIONS_MH[idx]?.t ?? 0) * FPS);
  const age = frame - captionStartFrame;
  const scale = spring({ frame: age, fps: FPS, config: { damping: 10, stiffness: 400 }, from: 0.7, to: 1.0 });

  const coloured = html
    .replace(/<g>/g,  `<span style="color:${TEAL}">`)
    .replace(/<\/g>/g, '</span>')
    .replace(/<y>/g,  `<span style="color:${YELLOW}">`)
    .replace(/<\/y>/g, '</span>')
    .replace(/<gr>/g, `<span style="color:${GREEN}">`)
    .replace(/<\/gr>/g, '</span>')
    .replace(/<r>/g,  `<span style="color:${RED}">`)
    .replace(/<\/r>/g, '</span>');

  return (
    <div style={{
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 900,
      fontSize: 68,
      color: '#fff',
      textTransform: 'uppercase',
      textAlign: 'center',
      letterSpacing: '0.06em',
      lineHeight: 1.1,
      WebkitTextStroke: '10px #000',
      paintOrder: 'stroke fill' as any,
      width: '100%',
      transform: `scale(${scale})`,
    }}
    dangerouslySetInnerHTML={{ __html: coloured }}
    />
  );
};

// ─── Badges ────────────────────────────────────────────────────────────────────

const HouseNameBadge: React.FC<{ opacity: number; scale: number }> = ({ opacity, scale }) => (
  <div style={{
    position: 'absolute', top: '34%', left: '50%',
    transform: `translate(-50%, -50%) scale(${scale})`,
    opacity,
    background: 'rgba(0,30,0,0.92)',
    border: `4px solid ${GREEN}`,
    borderRadius: 24,
    padding: '28px 60px',
    textAlign: 'center',
    boxShadow: `0 0 50px ${GREEN}88`,
    backdropFilter: 'blur(8px)',
  }}>
    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 38, color: '#888', letterSpacing: '0.12em' }}>
      HOLDING
    </div>
    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 120, color: GREEN, lineHeight: 1, textShadow: `0 0 40px ${GREEN}`, marginTop: 8 }}>
      $HOUSE
    </div>
    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 32, color: '#fff', letterSpacing: '0.1em', marginTop: 8 }}>
      HOUSECOIN · KRC20
    </div>
  </div>
);

const HouseStatBadge: React.FC<{ opacity: number; scale: number; frame: number }> = ({ opacity, scale, frame }) => {
  const pulse = interpolate(Math.sin(frame / 8), [-1, 1], [0.97, 1.03]);
  return (
    <div style={{
      position: 'absolute', top: '34%', left: '50%',
      transform: `translate(-50%, -50%) scale(${scale * pulse})`,
      opacity,
      background: 'rgba(0,0,0,0.92)',
      border: `5px solid ${YELLOW}`,
      borderRadius: 24,
      padding: '24px 50px',
      textAlign: 'center',
      boxShadow: `0 0 50px ${YELLOW}aa`,
    }}>
      <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 70, color: '#888', lineHeight: 1 }}>
        $600K
      </div>
      <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 50, color: GREEN, margin: '6px 0' }}>↓</div>
      <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 110, color: GREEN, lineHeight: 1, textShadow: `0 0 30px ${GREEN}` }}>
        5X
      </div>
      <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 50, color: YELLOW, margin: '6px 0' }}>↓</div>
      <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 130, color: YELLOW, lineHeight: 1, textShadow: `0 0 40px ${YELLOW}` }}>
        $1B+
      </div>
    </div>
  );
};

const MotherNameBadge: React.FC<{ opacity: number; scale: number }> = ({ opacity, scale }) => (
  <div style={{
    position: 'absolute', top: '34%', left: '50%',
    transform: `translate(-50%, -50%) scale(${scale})`,
    opacity,
    background: 'rgba(30,0,30,0.92)',
    border: `4px solid ${PINK}`,
    borderRadius: 24,
    padding: '28px 60px',
    textAlign: 'center',
    boxShadow: `0 0 50px ${PINK}88`,
    backdropFilter: 'blur(8px)',
  }}>
    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 38, color: '#888', letterSpacing: '0.12em' }}>
      HOLDING
    </div>
    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 120, color: PINK, lineHeight: 1, textShadow: `0 0 40px ${PINK}`, marginTop: 8 }}>
      $MOTHER
    </div>
    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 32, color: '#fff', letterSpacing: '0.1em', marginTop: 8 }}>
      IGGY AZALEA
    </div>
  </div>
);

const MotherStatBadge: React.FC<{ opacity: number; scale: number }> = ({ opacity, scale }) => (
  <div style={{
    position: 'absolute', top: '34%', left: '50%',
    transform: `translate(-50%, -50%) scale(${scale})`,
    opacity,
    background: 'rgba(0,0,0,0.92)',
    border: `4px solid ${PINK}`,
    borderRadius: 20,
    padding: '24px 48px',
    textAlign: 'center',
    boxShadow: `0 0 50px ${PINK}88`,
  }}>
    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 130, color: PINK, lineHeight: 1, textShadow: `0 0 40px ${PINK}` }}>
      7M
    </div>
    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 56, color: '#fff', letterSpacing: '0.08em', marginTop: 8 }}>
      X FOLLOWERS
    </div>
  </div>
);

const UranusBadge: React.FC<{ opacity: number; scale: number }> = ({ opacity, scale }) => (
  <div style={{
    position: 'absolute', top: '34%', left: '50%',
    transform: `translate(-50%, -50%) scale(${scale})`,
    opacity,
    background: 'rgba(20,0,40,0.92)',
    border: `4px solid ${PURPLE}`,
    borderRadius: 24,
    padding: '28px 60px',
    textAlign: 'center',
    boxShadow: `0 0 50px ${PURPLE}aa`,
    backdropFilter: 'blur(8px)',
  }}>
    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 38, color: '#888', letterSpacing: '0.12em' }}>
      HOLDING
    </div>
    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 120, color: PURPLE, lineHeight: 1, textShadow: `0 0 40px ${PURPLE}`, marginTop: 8 }}>
      $URANUS
    </div>
    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 32, color: '#fff', letterSpacing: '0.1em', marginTop: 8 }}>
      JUPITER SWAP · SOLANA
    </div>
  </div>
);

const BillionBadge: React.FC<{ opacity: number; scale: number; frame: number }> = ({ opacity, scale, frame }) => {
  const pulse = interpolate(Math.sin(frame / 6), [-1, 1], [0.95, 1.05]);
  return (
    <div style={{
      position: 'absolute', top: '34%', left: '50%',
      transform: `translate(-50%, -50%) scale(${scale * pulse})`,
      opacity,
      background: 'rgba(0,30,5,0.95)',
      border: `5px solid ${GREEN}`,
      borderRadius: 24,
      padding: '30px 60px',
      textAlign: 'center',
      boxShadow: `0 0 80px ${GREEN}cc`,
    }}>
      <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 60, color: '#fff', letterSpacing: '0.06em', lineHeight: 1 }}>
        WELL BEYOND
      </div>
      <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 160, color: GREEN, lineHeight: 1, textShadow: `0 0 50px ${GREEN}`, marginTop: 8 }}>
        $1B
      </div>
    </div>
  );
};

// ─── Main composition ──────────────────────────────────────────────────────────

export const MemeHolds: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  const zoomAge = Math.max(0, frame - Math.round(ZOOM_START_MH * FPS));
  const zoomScale = spring({ frame: zoomAge, fps: FPS, config: { damping: 28, stiffness: 120 }, from: 1.0, to: ZOOM_TO_MH });

  const overlayOpacity = (id: string) => {
    const ev = OVERLAYS_MH.find(e => e.id === id);
    if (!ev) return 0;
    return fadeInOut(t, ev.tIn, ev.tOut);
  };

  const overlayScale = (id: string) => {
    const ev = OVERLAYS_MH.find(e => e.id === id);
    if (!ev) return 1;
    const startFrame = Math.round(ev.tIn * FPS);
    const age = frame - startFrame;
    return spring({ frame: age, fps: FPS, config: { damping: 12, stiffness: 350 }, from: 0.5, to: 1.0 });
  };

  return (
    <AbsoluteFill style={{ background: '#000', fontFamily: 'Montserrat, sans-serif' }}>

      <AbsoluteFill style={{ overflow: 'hidden' }}>
        <OffthreadVideo
          src={CLIP_MH}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${zoomScale})`,
            transformOrigin: 'center center',
          }}
        />
      </AbsoluteFill>

      {BROLL_EVENTS_MH.map((ev, i) => {
        const op = fadeInOut(t, ev.tIn, ev.tOut);
        if (op === 0) return null;
        return (
          <AbsoluteFill
            key={i}
            style={{
              opacity: op,
              backgroundImage: `url(${ev.src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        );
      })}

      <img src={LOGO_KAS_MH} style={{
        position: 'absolute', top: 28, left: 28,
        width: 100, height: 100,
        filter: `drop-shadow(0 0 12px ${TEAL}88)`,
        zIndex: 200,
      }} />

      <AbsoluteFill style={{ zIndex: 100 }}>
        <HouseNameBadge  opacity={overlayOpacity('badge-house-name')}  scale={overlayScale('badge-house-name')} />
        <HouseStatBadge  opacity={overlayOpacity('badge-house-stat')}  scale={overlayScale('badge-house-stat')} frame={frame} />
        <MotherNameBadge opacity={overlayOpacity('badge-mother-name')} scale={overlayScale('badge-mother-name')} />
        <MotherStatBadge opacity={overlayOpacity('badge-mother-stat')} scale={overlayScale('badge-mother-stat')} />
        <UranusBadge     opacity={overlayOpacity('badge-uranus-name')} scale={overlayScale('badge-uranus-name')} />
        <BillionBadge    opacity={overlayOpacity('badge-billion')}     scale={overlayScale('badge-billion')} frame={frame} />
      </AbsoluteFill>

      <AbsoluteFill style={{ zIndex: 150, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute',
          top: 1020,
          left: 60,
          right: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Caption frame={frame} t={t} />
        </div>
      </AbsoluteFill>

      {SOUNDS_MH.map(e => (
        <Sequence key={e.t} from={Math.round(e.t * FPS)} durationInFrames={FPS}>
          <Audio src={e.src} />
        </Sequence>
      ))}

    </AbsoluteFill>
  );
};

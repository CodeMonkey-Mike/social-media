import React from 'react';
import {
  AbsoluteFill, Audio, Sequence, OffthreadVideo,
  interpolate, useCurrentFrame, spring,
} from 'remotion';
import {
  FPS_MBM as FPS,
  CLIP_MBM, LOGO_KAS_MBM,
  BROLL_EVENTS_MBM, OVERLAYS_MBM, CAPTIONS_MBM, SOUNDS_MBM,
  ZOOM_START_MBM, ZOOM_TO_MBM,
} from './constants-mbm';

const TEAL   = '#00e5ff';
const YELLOW = '#ffe600';
const GREEN  = '#39ff14';
const RED    = '#ff4444';

function fadeInOut(t: number, tIn: number, tOut: number, fadeS = 0.2) {
  return interpolate(
    t,
    [tIn, tIn + fadeS, tOut - fadeS, tOut],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
}

function getCaption(t: number) {
  for (let i = CAPTIONS_MBM.length - 1; i >= 0; i--) {
    if (t >= CAPTIONS_MBM[i].t) return { idx: i, html: CAPTIONS_MBM[i].h };
  }
  return { idx: 0, html: '' };
}

const Caption: React.FC<{ frame: number; t: number }> = ({ frame, t }) => {
  const { idx, html } = getCaption(t);
  const captionStartFrame = Math.round((CAPTIONS_MBM[idx]?.t ?? 0) * FPS);
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

const BearBadge: React.FC<{ opacity: number; scale: number }> = ({ opacity, scale }) => (
  <div style={{
    position: 'absolute', top: '34%', left: '50%',
    transform: `translate(-50%, -50%) scale(${scale}) rotate(-3deg)`,
    opacity,
    background: 'rgba(40,0,0,0.92)',
    border: `5px solid ${RED}`,
    borderRadius: 16,
    padding: '28px 60px',
    textAlign: 'center',
    boxShadow: `0 0 50px ${RED}88`,
  }}>
    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 130, color: RED, lineHeight: 1, textShadow: `0 0 30px ${RED}`, letterSpacing: '0.02em' }}>
      BEAR
    </div>
    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 80, color: '#fff', lineHeight: 1, marginTop: 8 }}>
      MARKET
    </div>
  </div>
);

const NoRetailBadge: React.FC<{ opacity: number; scale: number }> = ({ opacity, scale }) => (
  <div style={{
    position: 'absolute', top: '34%', left: '50%',
    transform: `translate(-50%, -50%) scale(${scale})`,
    opacity,
    background: 'rgba(0,0,0,0.88)',
    border: `4px solid ${YELLOW}`,
    borderRadius: 24,
    padding: '28px 50px',
    textAlign: 'center',
    boxShadow: `0 0 40px ${YELLOW}66`,
    backdropFilter: 'blur(8px)',
  }}>
    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 64, color: '#fff', lineHeight: 1, letterSpacing: '0.04em' }}>
      NO NEW
    </div>
    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 110, color: YELLOW, lineHeight: 1, marginTop: 8, textShadow: `0 0 30px ${YELLOW}` }}>
      RETAIL
    </div>
    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 36, color: '#fff', letterSpacing: '0.1em', marginTop: 8 }}>
      TRADING AGAINST OURSELVES
    </div>
  </div>
);

const KetamineBadge: React.FC<{ opacity: number; scale: number }> = ({ opacity, scale }) => (
  <div style={{
    position: 'absolute', top: '34%', left: '50%',
    transform: `translate(-50%, -50%) scale(${scale}) rotate(-2deg)`,
    opacity,
    background: 'rgba(0,0,0,0.92)',
    border: `4px solid ${YELLOW}`,
    borderRadius: 16,
    padding: '20px 44px',
    textAlign: 'center',
    boxShadow: `0 0 50px ${YELLOW}88`,
  }}>
    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 36, color: '#aaa', letterSpacing: '0.1em' }}>
      EXAMPLE
    </div>
    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 72, color: YELLOW, lineHeight: 1, textShadow: `0 0 30px ${YELLOW}`, marginTop: 6 }}>
      FLYING
    </div>
    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 72, color: YELLOW, lineHeight: 1, textShadow: `0 0 30px ${YELLOW}`, marginTop: 4 }}>
      KETAMINE HORSE
    </div>
  </div>
);

const RugStatBadge: React.FC<{ opacity: number; scale: number; frame: number }> = ({ opacity, scale, frame }) => {
  const shake = Math.sin(frame / 3) * 3;
  return (
    <div style={{
      position: 'absolute', top: '34%', left: '50%',
      transform: `translate(-50%, -50%) scale(${scale}) rotate(${shake * 0.3}deg)`,
      opacity,
      background: 'rgba(50,0,0,0.92)',
      border: `5px solid ${RED}`,
      borderRadius: 16,
      padding: '24px 48px',
      textAlign: 'center',
      boxShadow: `0 0 60px ${RED}aa`,
    }}>
      <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 90, color: '#fff', lineHeight: 1 }}>
        5 <span style={{ color: YELLOW }}>CEX</span>
      </div>
      <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 60, color: RED, margin: '10px 0' }}>
        ↓
      </div>
      <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 110, color: RED, lineHeight: 1, textShadow: `0 0 30px ${RED}`, letterSpacing: '0.04em' }}>
        RUG
      </div>
      <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 34, color: '#fff', letterSpacing: '0.1em', marginTop: 12 }}>
        IN ONE MONTH
      </div>
    </div>
  );
};

const RiskyBadge: React.FC<{ opacity: number; scale: number; frame: number }> = ({ opacity, scale, frame }) => {
  const pulse = interpolate(Math.sin(frame / 5), [-1, 1], [0.95, 1.05]);
  return (
    <div style={{
      position: 'absolute', top: '34%', left: '50%',
      transform: `translate(-50%, -50%) scale(${scale * pulse}) rotate(-3deg)`,
      opacity,
      background: 'rgba(50,0,0,0.95)',
      border: `5px solid ${RED}`,
      borderRadius: 16,
      padding: '30px 60px',
      textAlign: 'center',
      boxShadow: `0 0 80px ${RED}cc`,
    }}>
      <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 70, color: '#fff', letterSpacing: '0.05em', lineHeight: 1 }}>
        REALLY
      </div>
      <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 130, color: RED, lineHeight: 1, textShadow: `0 0 40px ${RED}`, marginTop: 6 }}>
        RISKY
      </div>
    </div>
  );
};

// ─── Main composition ──────────────────────────────────────────────────────────

export const MemeBearMarket: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  const zoomAge = Math.max(0, frame - Math.round(ZOOM_START_MBM * FPS));
  const zoomScale = spring({ frame: zoomAge, fps: FPS, config: { damping: 28, stiffness: 120 }, from: 1.0, to: ZOOM_TO_MBM });

  const overlayOpacity = (id: string) => {
    const ev = OVERLAYS_MBM.find(e => e.id === id);
    if (!ev) return 0;
    return fadeInOut(t, ev.tIn, ev.tOut);
  };

  const overlayScale = (id: string) => {
    const ev = OVERLAYS_MBM.find(e => e.id === id);
    if (!ev) return 1;
    const startFrame = Math.round(ev.tIn * FPS);
    const age = frame - startFrame;
    return spring({ frame: age, fps: FPS, config: { damping: 12, stiffness: 350 }, from: 0.5, to: 1.0 });
  };

  return (
    <AbsoluteFill style={{ background: '#000', fontFamily: 'Montserrat, sans-serif' }}>

      <AbsoluteFill style={{ overflow: 'hidden' }}>
        <OffthreadVideo
          src={CLIP_MBM}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${zoomScale})`,
            transformOrigin: 'center center',
          }}
        />
      </AbsoluteFill>

      {BROLL_EVENTS_MBM.map((ev, i) => {
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

      <img src={LOGO_KAS_MBM} style={{
        position: 'absolute', top: 28, left: 28,
        width: 100, height: 100,
        filter: `drop-shadow(0 0 12px ${TEAL}88)`,
        zIndex: 200,
      }} />

      <AbsoluteFill style={{ zIndex: 100 }}>
        <BearBadge     opacity={overlayOpacity('badge-bear')}     scale={overlayScale('badge-bear')} />
        <NoRetailBadge opacity={overlayOpacity('badge-noretail')} scale={overlayScale('badge-noretail')} />
        <KetamineBadge opacity={overlayOpacity('badge-ketamine')} scale={overlayScale('badge-ketamine')} />
        <RugStatBadge  opacity={overlayOpacity('badge-rugstat')}  scale={overlayScale('badge-rugstat')} frame={frame} />
        <RiskyBadge    opacity={overlayOpacity('badge-risky')}    scale={overlayScale('badge-risky')} frame={frame} />
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

      {SOUNDS_MBM.map(e => (
        <Sequence key={e.t} from={Math.round(e.t * FPS)} durationInFrames={FPS}>
          <Audio src={e.src} />
        </Sequence>
      ))}

    </AbsoluteFill>
  );
};

import React from 'react';
import {
  AbsoluteFill, Audio, Sequence, OffthreadVideo,
  interpolate, useCurrentFrame, spring,
} from 'remotion';
import {
  FPS_TAO as FPS,
  CLIP_TAO, LOGO_KAS_TAO,
  BROLL_EVENTS_TAO, OVERLAYS_TAO, CAPTIONS_TAO, SOUNDS_TAO,
  ZOOM_START_TAO, ZOOM_TO_TAO,
} from './constants-tao';

const TEAL   = '#00e5ff';
const YELLOW = '#ffe600';
const GREEN  = '#39ff14';
const RED    = '#ff4444';
const BLUE   = '#3b8eff';

function fadeInOut(t: number, tIn: number, tOut: number, fadeS = 0.2) {
  return interpolate(
    t,
    [tIn, tIn + fadeS, tOut - fadeS, tOut],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
}

function getCaption(t: number) {
  for (let i = CAPTIONS_TAO.length - 1; i >= 0; i--) {
    if (t >= CAPTIONS_TAO[i].t) return { idx: i, html: CAPTIONS_TAO[i].h };
  }
  return { idx: 0, html: '' };
}

const Caption: React.FC<{ frame: number; t: number }> = ({ frame, t }) => {
  const { idx, html } = getCaption(t);
  const captionStartFrame = Math.round((CAPTIONS_TAO[idx]?.t ?? 0) * FPS);
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

const TaoBadge: React.FC<{ opacity: number; scale: number }> = ({ opacity, scale }) => (
  <div style={{
    position: 'absolute', top: '34%', left: '50%',
    transform: `translate(-50%, -50%) scale(${scale})`,
    opacity,
    background: 'rgba(0,10,30,0.92)',
    border: `4px solid ${BLUE}`,
    borderRadius: 24,
    padding: '28px 60px',
    textAlign: 'center',
    boxShadow: `0 0 60px ${BLUE}aa`,
    backdropFilter: 'blur(8px)',
  }}>
    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 180, color: BLUE, lineHeight: 0.9, textShadow: `0 0 50px ${BLUE}` }}>
      τ
    </div>
    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 80, color: '#fff', lineHeight: 1, marginTop: 8, letterSpacing: '0.06em' }}>
      $TAO
    </div>
    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 30, color: '#888', letterSpacing: '0.1em', marginTop: 6 }}>
      BITTENSOR
    </div>
  </div>
);

const VsBadge: React.FC<{ opacity: number; scale: number }> = ({ opacity, scale }) => (
  <div style={{
    position: 'absolute', top: '36%', left: '50%',
    transform: `translate(-50%, -50%) scale(${scale})`,
    opacity,
    background: 'rgba(0,0,0,0.92)',
    border: `4px solid ${YELLOW}`,
    borderRadius: 20,
    padding: '24px 48px',
    textAlign: 'center',
    boxShadow: `0 0 50px ${YELLOW}aa`,
    backdropFilter: 'blur(8px)',
  }}>
    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 72, color: '#888', lineHeight: 1, letterSpacing: '0.04em' }}>
      $NVDA
    </div>
    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 50, color: YELLOW, margin: '12px 0' }}>
      VS
    </div>
    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 100, color: BLUE, lineHeight: 1, textShadow: `0 0 30px ${BLUE}` }}>
      $TAO
    </div>
    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 32, color: '#fff', letterSpacing: '0.1em', marginTop: 12 }}>
      MORE MULTIPLIERS
    </div>
  </div>
);

const BuyBadge: React.FC<{ opacity: number; scale: number; frame: number }> = ({ opacity, scale, frame }) => {
  const pulse = interpolate(Math.sin(frame / 5), [-1, 1], [0.96, 1.04]);
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
      <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 90, color: '#fff', letterSpacing: '0.04em', lineHeight: 1 }}>
        JUST BUY
      </div>
      <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 160, color: GREEN, lineHeight: 1, textShadow: `0 0 50px ${GREEN}`, marginTop: 8 }}>
        $TAO
      </div>
      <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 32, color: '#fff', letterSpacing: '0.1em', marginTop: 8 }}>
        ALL-IN-ONE AI PLAY
      </div>
    </div>
  );
};

const McapBadge: React.FC<{ opacity: number; scale: number }> = ({ opacity, scale }) => (
  <div style={{
    position: 'absolute', top: '34%', left: '50%',
    transform: `translate(-50%, -50%) scale(${scale})`,
    opacity,
    background: 'rgba(0,0,0,0.92)',
    border: `5px solid ${YELLOW}`,
    borderRadius: 24,
    padding: '24px 50px',
    textAlign: 'center',
    boxShadow: `0 0 50px ${YELLOW}aa`,
  }}>
    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 38, color: '#888', letterSpacing: '0.1em' }}>
      MCAP TARGET
    </div>
    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 130, color: YELLOW, lineHeight: 1, textShadow: `0 0 40px ${YELLOW}`, marginTop: 10 }}>
      $40B
    </div>
    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 60, color: '#fff', margin: '6px 0' }}>
      →
    </div>
    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 130, color: GREEN, lineHeight: 1, textShadow: `0 0 40px ${GREEN}` }}>
      $80B+
    </div>
  </div>
);

// ─── Main composition ──────────────────────────────────────────────────────────

export const TaoAiPlay: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  const zoomAge = Math.max(0, frame - Math.round(ZOOM_START_TAO * FPS));
  const zoomScale = spring({ frame: zoomAge, fps: FPS, config: { damping: 28, stiffness: 120 }, from: 1.0, to: ZOOM_TO_TAO });

  const overlayOpacity = (id: string) => {
    const ev = OVERLAYS_TAO.find(e => e.id === id);
    if (!ev) return 0;
    return fadeInOut(t, ev.tIn, ev.tOut);
  };

  const overlayScale = (id: string) => {
    const ev = OVERLAYS_TAO.find(e => e.id === id);
    if (!ev) return 1;
    const startFrame = Math.round(ev.tIn * FPS);
    const age = frame - startFrame;
    return spring({ frame: age, fps: FPS, config: { damping: 12, stiffness: 350 }, from: 0.5, to: 1.0 });
  };

  return (
    <AbsoluteFill style={{ background: '#000', fontFamily: 'Montserrat, sans-serif' }}>

      <AbsoluteFill style={{ overflow: 'hidden' }}>
        <OffthreadVideo
          src={CLIP_TAO}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${zoomScale})`,
            transformOrigin: 'center center',
          }}
        />
      </AbsoluteFill>

      {BROLL_EVENTS_TAO.map((ev, i) => {
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

      <img src={LOGO_KAS_TAO} style={{
        position: 'absolute', top: 28, left: 28,
        width: 100, height: 100,
        filter: `drop-shadow(0 0 12px ${TEAL}88)`,
        zIndex: 200,
      }} />

      <AbsoluteFill style={{ zIndex: 100 }}>
        <TaoBadge  opacity={overlayOpacity('badge-tao')}  scale={overlayScale('badge-tao')} />
        <VsBadge   opacity={overlayOpacity('badge-vs')}   scale={overlayScale('badge-vs')} />
        <BuyBadge  opacity={overlayOpacity('badge-buy')}  scale={overlayScale('badge-buy')} frame={frame} />
        <McapBadge opacity={overlayOpacity('badge-mcap')} scale={overlayScale('badge-mcap')} />
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

      {SOUNDS_TAO.map(e => (
        <Sequence key={e.t} from={Math.round(e.t * FPS)} durationInFrames={FPS}>
          <Audio src={e.src} />
        </Sequence>
      ))}

    </AbsoluteFill>
  );
};

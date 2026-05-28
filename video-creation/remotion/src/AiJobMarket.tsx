import React from 'react';
import {
  AbsoluteFill, Audio, Sequence, OffthreadVideo,
  interpolate, useCurrentFrame, spring,
} from 'remotion';
import {
  FPS_AIJM as FPS,
  CLIP_AIJM, LOGO_KAS_AIJM,
  BROLL_EVENTS_AIJM, OVERLAYS_AIJM, CAPTIONS_AIJM, SOUNDS_AIJM,
  ZOOM_START_AIJM, ZOOM_TO_AIJM,
} from './constants-aijm';

// ─── Brand colours ─────────────────────────────────────────────────────────────
const TEAL   = '#00e5ff';
const YELLOW = '#ffe600';
const GREEN  = '#39ff14';
const RED    = '#ff4444';

// ─── Helpers ───────────────────────────────────────────────────────────────────
function fadeInOut(t: number, tIn: number, tOut: number, fadeS = 0.2) {
  return interpolate(
    t,
    [tIn, tIn + fadeS, tOut - fadeS, tOut],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
}

function getCaption(t: number) {
  for (let i = CAPTIONS_AIJM.length - 1; i >= 0; i--) {
    if (t >= CAPTIONS_AIJM[i].t) return { idx: i, html: CAPTIONS_AIJM[i].h };
  }
  return { idx: 0, html: '' };
}

const Caption: React.FC<{ frame: number; t: number }> = ({ frame, t }) => {
  const { idx, html } = getCaption(t);
  const captionStartFrame = Math.round((CAPTIONS_AIJM[idx]?.t ?? 0) * FPS);
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

// ─── Badge overlays ────────────────────────────────────────────────────────────

const ChangeBadge: React.FC<{ opacity: number; scale: number }> = ({ opacity, scale }) => (
  <div style={{
    position: 'absolute', top: '38%', left: '50%',
    transform: `translate(-50%, -50%) scale(${scale})`,
    opacity,
    background: 'rgba(0,0,0,0.82)',
    border: `4px solid ${TEAL}`,
    borderRadius: 24,
    padding: '28px 56px',
    textAlign: 'center',
    boxShadow: `0 0 40px ${TEAL}88`,
    backdropFilter: 'blur(8px)',
  }}>
    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 90, color: TEAL, lineHeight: 1, textShadow: `0 0 30px ${TEAL}` }}>
      CHANGE OF
    </div>
    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 90, color: '#fff', lineHeight: 1, marginTop: 4 }}>
      HANDS
    </div>
  </div>
);

const LayoffsBadge: React.FC<{ opacity: number; scale: number }> = ({ opacity, scale }) => (
  <div style={{
    position: 'absolute', top: '36%', left: '50%',
    transform: `translate(-50%, -50%) scale(${scale}) rotate(-4deg)`,
    opacity,
    background: 'rgba(40,0,0,0.92)',
    border: `5px solid ${RED}`,
    borderRadius: 16,
    padding: '24px 50px',
    textAlign: 'center',
    boxShadow: `0 0 50px ${RED}88`,
  }}>
    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 110, color: RED, lineHeight: 1, textShadow: `0 0 30px ${RED}`, letterSpacing: '0.02em' }}>
      LAYOFFS
    </div>
    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 38, color: '#fff', letterSpacing: '0.1em', marginTop: 8 }}>
      AT BIG COMPANIES
    </div>
  </div>
);

const BalanceBadge: React.FC<{ opacity: number; scale: number }> = ({ opacity, scale }) => (
  <div style={{
    position: 'absolute', top: '38%', left: '50%',
    transform: `translate(-50%, -50%) scale(${scale})`,
    opacity,
    background: 'rgba(0,0,0,0.85)',
    border: `4px solid ${YELLOW}`,
    borderRadius: 24,
    padding: '24px 48px',
    textAlign: 'center',
    boxShadow: `0 0 40px ${YELLOW}66`,
    backdropFilter: 'blur(8px)',
  }}>
    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 62, color: '#fff', lineHeight: 1.1 }}>
      LAYOFFS
    </div>
    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 80, color: YELLOW, margin: '6px 0', textShadow: `0 0 20px ${YELLOW}` }}>
      ←  →
    </div>
    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 62, color: GREEN, lineHeight: 1.1, textShadow: `0 0 20px ${GREEN}` }}>
      HIRING
    </div>
  </div>
);

const ExplosionBadge: React.FC<{ opacity: number; scale: number; frame: number }> = ({ opacity, scale, frame }) => {
  const pulse = interpolate(Math.sin(frame / 6), [-1, 1], [0.95, 1.05]);
  return (
    <div style={{
      position: 'absolute', top: '34%', left: '50%',
      transform: `translate(-50%, -50%) scale(${scale * pulse})`,
      opacity,
      background: 'rgba(0,30,5,0.92)',
      border: `5px solid ${GREEN}`,
      borderRadius: 24,
      padding: '30px 60px',
      textAlign: 'center',
      boxShadow: `0 0 60px ${GREEN}aa, inset 0 0 30px ${GREEN}33`,
    }}>
      <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 56, color: '#fff', letterSpacing: '0.12em', lineHeight: 1 }}>
        EXPLOSION OF
      </div>
      <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 130, color: GREEN, lineHeight: 1, textShadow: `0 0 40px ${GREEN}`, marginTop: 6 }}>
        JOBS ↑
      </div>
    </div>
  );
};

// ─── Main composition ──────────────────────────────────────────────────────────

export const AiJobMarket: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  // Full-face zoom — push in on "explosion of more job openings" payoff
  const zoomAge = Math.max(0, frame - Math.round(ZOOM_START_AIJM * FPS));
  const zoomScale = spring({ frame: zoomAge, fps: FPS, config: { damping: 28, stiffness: 120 }, from: 1.0, to: ZOOM_TO_AIJM });

  const overlayOpacity = (id: string) => {
    const ev = OVERLAYS_AIJM.find(e => e.id === id);
    if (!ev) return 0;
    return fadeInOut(t, ev.tIn, ev.tOut);
  };

  const overlayScale = (id: string) => {
    const ev = OVERLAYS_AIJM.find(e => e.id === id);
    if (!ev) return 1;
    const startFrame = Math.round(ev.tIn * FPS);
    const age = frame - startFrame;
    return spring({ frame: age, fps: FPS, config: { damping: 12, stiffness: 350 }, from: 0.5, to: 1.0 });
  };

  return (
    <AbsoluteFill style={{ background: '#000', fontFamily: 'Montserrat, sans-serif' }}>

      {/* ── Layer 1: Face video (base, full frame) ── */}
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        <OffthreadVideo
          src={CLIP_AIJM}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${zoomScale})`,
            transformOrigin: 'center center',
          }}
        />
      </AbsoluteFill>

      {/* ── Layer 2: B-roll full-frame overlays ── */}
      {BROLL_EVENTS_AIJM.map((ev, i) => {
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

      {/* ── Layer 3: Brand watermark ── */}
      <img src={LOGO_KAS_AIJM} style={{
        position: 'absolute', top: 28, left: 28,
        width: 100, height: 100,
        filter: `drop-shadow(0 0 12px ${TEAL}88)`,
        zIndex: 200,
      }} />

      {/* ── Layer 4: Text overlays ── */}
      <AbsoluteFill style={{ zIndex: 100 }}>
        <ChangeBadge    opacity={overlayOpacity('badge-change')}    scale={overlayScale('badge-change')} />
        <LayoffsBadge   opacity={overlayOpacity('badge-layoffs')}   scale={overlayScale('badge-layoffs')} />
        <BalanceBadge   opacity={overlayOpacity('badge-balance')}   scale={overlayScale('badge-balance')} />
        <ExplosionBadge opacity={overlayOpacity('badge-explosion')} scale={overlayScale('badge-explosion')} frame={frame} />
      </AbsoluteFill>

      {/* ── Layer 5: Captions — top of face zone ── */}
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

      {/* ── Sound effects ── */}
      {SOUNDS_AIJM.map(e => (
        <Sequence key={e.t} from={Math.round(e.t * FPS)} durationInFrames={FPS}>
          <Audio src={e.src} />
        </Sequence>
      ))}

    </AbsoluteFill>
  );
};

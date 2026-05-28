import React from 'react';
import {
  AbsoluteFill, Audio, Sequence, OffthreadVideo,
  interpolate, useCurrentFrame, spring,
} from 'remotion';
import {
  FPS_KHF as FPS,
  CLIP_KHF, LOGO_KAS_KHF,
  BROLL_KASPA_3D, BROLL_KATA_FORK, BROLL_CHART_UP,
  BROLL_EVENTS_KHF, OVERLAYS_KHF, CAPTIONS_KHF, SOUNDS_KHF,
  DURATION_KHF,
} from './constants-khf';

// ─── Brand colours ─────────────────────────────────────────────────────────────
const TEAL   = '#00e5ff';
const YELLOW = '#ffe600';
const GREEN  = '#39ff14';

// ─── Helpers ───────────────────────────────────────────────────────────────────
function fadeInOut(t: number, tIn: number, tOut: number, fadeS = 0.2) {
  return interpolate(
    t,
    [tIn, tIn + fadeS, tOut - fadeS, tOut],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
}

// ─── Caption ───────────────────────────────────────────────────────────────────
function getCaption(t: number) {
  for (let i = CAPTIONS_KHF.length - 1; i >= 0; i--) {
    if (t >= CAPTIONS_KHF[i].t) return { idx: i, html: CAPTIONS_KHF[i].h };
  }
  return { idx: 0, html: '' };
}

const Caption: React.FC<{ frame: number; t: number }> = ({ frame, t }) => {
  const { idx, html } = getCaption(t);
  const captionStartFrame = Math.round((CAPTIONS_KHF[idx]?.t ?? 0) * FPS);
  const age = frame - captionStartFrame;
  const scale = spring({ frame: age, fps: FPS, config: { damping: 10, stiffness: 400 }, from: 0.7, to: 1.0 });

  const coloured = html
    .replace(/<g>/g,  `<span style="color:${TEAL}">`)
    .replace(/<\/g>/g, '</span>')
    .replace(/<y>/g,  `<span style="color:${YELLOW}">`)
    .replace(/<\/y>/g, '</span>');

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

const PriceBadge: React.FC<{ opacity: number; scale: number }> = ({ opacity, scale }) => (
  <div style={{
    position: 'absolute', top: '38%', left: '50%',
    transform: `translate(-50%, -50%) scale(${scale})`,
    opacity,
    background: 'linear-gradient(135deg, rgba(0,229,255,0.15) 0%, rgba(0,0,0,0.85) 100%)',
    border: `4px solid ${TEAL}`,
    borderRadius: 24,
    padding: '28px 56px',
    textAlign: 'center',
    boxShadow: `0 0 40px ${TEAL}88`,
    backdropFilter: 'blur(8px)',
  }}>
    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 100, color: TEAL, lineHeight: 1, textShadow: `0 0 30px ${TEAL}` }}>
      25¢ → 30¢
    </div>
    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 42, color: '#fff', marginTop: 8, letterSpacing: '0.1em' }}>
      IF THE YEAR GOES WELL
    </div>
  </div>
);

const HardForkBadge: React.FC<{ opacity: number; scale: number }> = ({ opacity, scale }) => (
  <div style={{
    position: 'absolute', top: '35%', left: '50%',
    transform: `translate(-50%, -50%) scale(${scale})`,
    opacity,
    background: 'rgba(0,0,0,0.82)',
    border: `4px solid ${YELLOW}`,
    borderRadius: 24,
    padding: '28px 56px',
    textAlign: 'center',
    boxShadow: `0 0 40px ${YELLOW}66`,
    backdropFilter: 'blur(8px)',
  }}>
    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 130, color: YELLOW, lineHeight: 1, textShadow: `0 0 40px ${YELLOW}` }}>
      27 DAYS
    </div>
    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 40, color: '#fff', letterSpacing: '0.1em', marginTop: 6 }}>
      TOCCATA HARD FORK
    </div>
    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: 32, color: TEAL, letterSpacing: '0.08em', marginTop: 4 }}>
      KASPA NETWORK UPGRADE
    </div>
  </div>
);

const MainnetBadge: React.FC<{ opacity: number; scale: number }> = ({ opacity, scale }) => (
  <div style={{
    position: 'absolute', top: '38%', left: '50%',
    transform: `translate(-50%, -50%) scale(${scale})`,
    opacity,
    background: 'rgba(0,0,0,0.85)',
    border: `4px solid ${GREEN}`,
    borderRadius: 24,
    padding: '24px 48px',
    textAlign: 'center',
    boxShadow: `0 0 40px ${GREEN}55`,
    backdropFilter: 'blur(8px)',
  }}>
    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 52, color: '#aaa', lineHeight: 1.1 }}>
      TESTNET ✓
    </div>
    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 36, color: '#555', margin: '4px 0' }}>
      ↓
    </div>
    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 72, color: GREEN, lineHeight: 1, textShadow: `0 0 30px ${GREEN}` }}>
      MAINNET
    </div>
  </div>
);

const KaspaGlowBadge: React.FC<{ frame: number; opacity: number }> = ({ frame, opacity }) => {
  const pulse = interpolate(
    Math.sin(frame / 15),
    [-1, 1], [0.6, 1.0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  return (
    <div style={{
      position: 'absolute', bottom: 300, left: '50%',
      transform: 'translateX(-50%)',
      opacity: opacity * pulse,
    }}>
      <img src={LOGO_KAS_KHF} style={{ width: 160, height: 160, filter: `drop-shadow(0 0 30px ${TEAL}) drop-shadow(0 0 60px ${TEAL}88)` }} />
    </div>
  );
};

// ─── Main composition ──────────────────────────────────────────────────────────

export const KaspaHardFork: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  // Full-face zoom — push in at 29s, hold through end
  const ZOOM_START = 29.0;
  const zoomAge = Math.max(0, frame - Math.round(ZOOM_START * FPS));
  const zoomScale = spring({ frame: zoomAge, fps: FPS, config: { damping: 28, stiffness: 120 }, from: 1.0, to: 1.15 });

  // B-roll opacity per image
  const brollOpacity = (src: string) => {
    const ev = BROLL_EVENTS_KHF.find(e => e.src === src);
    if (!ev) return 0;
    // Multiple events for same src: pick the one covering current t
    const active = BROLL_EVENTS_KHF.filter(e => e.src === src && t >= e.tIn - 0.3 && t <= e.tOut + 0.3);
    if (active.length === 0) return 0;
    return Math.max(...active.map(e => fadeInOut(t, e.tIn, e.tOut)));
  };

  // Overlay helpers
  const overlayOpacity = (id: string) => {
    const ev = OVERLAYS_KHF.find(e => e.id === id);
    if (!ev) return 0;
    return fadeInOut(t, ev.tIn, ev.tOut);
  };

  const overlayScale = (id: string) => {
    const ev = OVERLAYS_KHF.find(e => e.id === id);
    if (!ev) return 1;
    const startFrame = Math.round(ev.tIn * FPS);
    const age = frame - startFrame;
    return spring({ frame: age, fps: FPS, config: { damping: 12, stiffness: 350 }, from: 0.5, to: 1.0 });
  };

  return (
    <AbsoluteFill style={{ background: '#000', fontFamily: 'Montserrat, sans-serif' }}>

      {/* ── Layer 1: Face video (base, full frame) — zooms in at 29s ── */}
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        <OffthreadVideo
          src={CLIP_KHF}
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
      {BROLL_EVENTS_KHF.map((ev, i) => {
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

      {/* ── Layer 3: Kaspa brand watermark (always visible) ── */}
      <img src={LOGO_KAS_KHF} style={{
        position: 'absolute', top: 28, left: 28,
        width: 100, height: 100,
        filter: `drop-shadow(0 0 12px ${TEAL}88)`,
        zIndex: 200,
      }} />

      {/* ── Layer 4: Text overlays ── */}
      <AbsoluteFill style={{ zIndex: 100 }}>
        <PriceBadge   opacity={overlayOpacity('badge-price')}   scale={overlayScale('badge-price')} />
        <HardForkBadge opacity={overlayOpacity('badge-27days')}  scale={overlayScale('badge-27days')} />
        <MainnetBadge  opacity={overlayOpacity('badge-mainnet')} scale={overlayScale('badge-mainnet')} />
        <KaspaGlowBadge frame={frame} opacity={overlayOpacity('badge-best')} />
      </AbsoluteFill>

      {/* ── Layer 5: Captions — top of face zone, no background ── */}
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
      {SOUNDS_KHF.map(e => (
        <Sequence key={e.t} from={Math.round(e.t * FPS)} durationInFrames={FPS}>
          <Audio src={e.src} />
        </Sequence>
      ))}

    </AbsoluteFill>
  );
};

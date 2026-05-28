import React from 'react';
import {
  AbsoluteFill, Audio, Sequence, OffthreadVideo,
  interpolate, useCurrentFrame, spring,
} from 'remotion';
import {
  FPS_K3D as FPS,
  CLIP_K3D, LOGO_KAS, LOGO_BTC, CHART_KAS,
  HOOK_BG, HUNDRED_B_BG,
  BROLL_H, DIV_Y, CAP_TOP, CAP_H,
  BROLL_RANGES_K3D, OVERLAYS_K3D, CAPTIONS_K3D, SOUNDS_K3D,
} from './constants-k3d';

// ─── Colours ───────────────────────────────────────────────────────────────────
const TEAL   = '#00e5ff';
const ORANGE = '#f7931a';
const YELLOW = '#ffe600';
const GREEN  = '#39ff14';
const RED    = '#ff4444';

// ─── Helpers ───────────────────────────────────────────────────────────────────
function fadeInOut(t: number, tIn: number, tOut: number, fadeS = 0.15) {
  return interpolate(
    t,
    [tIn, tIn + fadeS, tOut - fadeS, tOut],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
}

function popIn(frame: number, startFrame: number) {
  const age = frame - startFrame;
  return spring({ frame: age, fps: FPS, config: { damping: 10, stiffness: 400 }, from: 0.3, to: 1.0 });
}

// ─── Caption lookup ────────────────────────────────────────────────────────────
function getCaption(t: number) {
  for (let i = CAPTIONS_K3D.length - 1; i >= 0; i--) {
    if (t >= CAPTIONS_K3D[i].t) return { idx: i, html: CAPTIONS_K3D[i].h };
  }
  return { idx: 0, html: '' };
}

// ─── Caption component ─────────────────────────────────────────────────────────
const Caption: React.FC<{ frame: number; t: number }> = ({ frame, t }) => {
  const { idx, html } = getCaption(t);
  const captionStart = CAPTIONS_K3D[idx]?.t ?? 0;
  const age = frame - Math.round(captionStart * FPS);
  const scale = spring({ frame: age, fps: FPS, config: { damping: 10, stiffness: 400 }, from: 0.7, to: 1.0 });

  const coloured = html
    .replace(/<g>/g,  `<span style="color:${TEAL}">`)
    .replace(/<\/g>/g, '</span>')
    .replace(/<o>/g,  `<span style="color:${ORANGE}">`)
    .replace(/<\/o>/g, '</span>')
    .replace(/<y>/g,  `<span style="color:${YELLOW}">`)
    .replace(/<\/y>/g, '</span>')
    .replace(/<r>/g,  `<span style="color:${RED}">`)
    .replace(/<\/r>/g, '</span>');

  return (
    <div style={{
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

// ─── B-roll panels ─────────────────────────────────────────────────────────────

const HookPanel: React.FC<{ frame: number }> = ({ frame }) => {
  const logoScale = spring({ frame, fps: FPS, config: { damping: 14, stiffness: 160 }, from: 0, to: 1 });
  const txtScale  = spring({ frame: Math.max(0, frame - 8), fps: FPS, config: { damping: 14, stiffness: 160 }, from: 0, to: 1 });

  return (
    <div style={{
      width: '100%', height: BROLL_H, overflow: 'hidden', position: 'relative',
      background: 'radial-gradient(ellipse at 50% 40%, #0a1a1a 0%, #050d0d 60%, #000 100%)',
    }}>
      {/* Generated background image — renders on top of gradient if present */}
      <img
        src={HOOK_BG}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.45 }}
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
      />
      <div style={{
        position: 'relative', zIndex: 2,
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 16,
      }}>
        <img src={LOGO_KAS} style={{
          width: 120, height: 120, borderRadius: '50%',
          boxShadow: `0 0 30px rgba(0,229,255,.8), 0 0 80px rgba(0,229,255,.3)`,
          transform: `scale(${logoScale})`,
        }} />
        <div style={{ transform: `scale(${txtScale})`, textAlign: 'center', padding: '0 40px' }}>
          <div style={{
            fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 40,
            color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            everyone's saying
          </div>
          <div style={{
            fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 86,
            color: RED, textTransform: 'uppercase', letterSpacing: '0.02em', lineHeight: 0.95,
            WebkitTextStroke: '3px #000', paintOrder: 'stroke fill' as any,
          }}>
            50¢
          </div>
          <div style={{
            fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 44,
            color: TEAL, textTransform: 'uppercase', letterSpacing: '0.05em',
            textShadow: `0 0 20px rgba(0,229,255,.6)`,
          }}>
            I say $3 is realistic
          </div>
        </div>
      </div>
    </div>
  );
};

const HundredBPanel: React.FC<{ localFrame: number }> = ({ localFrame }) => {
  const scale = spring({ frame: localFrame, fps: FPS, config: { damping: 12, stiffness: 200 }, from: 0, to: 1 });
  const glow  = 0.4 + 0.6 * Math.abs(Math.sin(localFrame / 20));

  return (
    <div style={{
      width: '100%', height: BROLL_H, overflow: 'hidden', position: 'relative',
      background: 'radial-gradient(ellipse at 50% 50%, #1a0d00 0%, #0d0500 60%, #000 100%)',
    }}>
      <img
        src={HUNDRED_B_BG}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }}
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
      />
      <div style={{
        position: 'relative', zIndex: 2,
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 8,
        transform: `scale(${scale})`,
      }}>
        <div style={{
          fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 38,
          color: '#888', textTransform: 'uppercase', letterSpacing: '0.15em',
        }}>kaspa at</div>
        <div style={{
          fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 114,
          color: ORANGE, letterSpacing: '-0.02em', lineHeight: 0.9,
          textShadow: `0 0 40px rgba(247,147,26,${glow}), 0 0 80px rgba(247,147,26,0.2)`,
          WebkitTextStroke: '3px #000', paintOrder: 'stroke fill' as any,
        }}>$100B</div>
        <div style={{
          fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 46,
          color: '#fff', textTransform: 'uppercase', letterSpacing: '0.12em',
        }}>market cap</div>
        <div style={{
          marginTop: 12,
          fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 26,
          color: TEAL, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.85,
        }}>parabolic cycle top ↑</div>
      </div>
    </div>
  );
};

const ChartPanel: React.FC<{ localFrame: number }> = ({ localFrame }) => {
  const scale = spring({ frame: localFrame, fps: FPS, config: { damping: 14, stiffness: 150 }, from: 0.85, to: 1 });
  return (
    <div style={{ width: '100%', height: BROLL_H, overflow: 'hidden', position: 'relative', background: '#000', transform: `scale(${scale})` }}>
      <img src={CHART_KAS} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{
        position: 'absolute', top: 24, right: 24,
        fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 48,
        color: GREEN, textShadow: `0 0 20px rgba(57,255,20,.8)`,
        WebkitTextStroke: '2px #000', paintOrder: 'stroke fill' as any,
      }}>$3 target ↑</div>
    </div>
  );
};

// ─── B-roll zone ───────────────────────────────────────────────────────────────
const BrollZone: React.FC<{ t: number; frame: number }> = ({ t, frame }) => {
  const active = BROLL_RANGES_K3D.find(r => t >= r.tStart && t < r.tEnd) ?? BROLL_RANGES_K3D[0];
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: BROLL_H, overflow: 'hidden' }}>
      {active.id === 'hook'      && <HookPanel frame={frame} />}
      {active.id === 'hundred-b' && <HundredBPanel localFrame={frame - Math.round(BROLL_RANGES_K3D[1].tStart * FPS)} />}
      {active.id === 'chart'     && <ChartPanel   localFrame={frame - Math.round(BROLL_RANGES_K3D[2].tStart * FPS)} />}
    </div>
  );
};

// ─── Overlay components ────────────────────────────────────────────────────────

// 1. "$3" teal badge — content zone, bottom-right
const Badge3: React.FC<{ t: number; frame: number }> = ({ t, frame }) => {
  const { tIn, tOut } = OVERLAYS_K3D.find(o => o.id === 'badge-3')!;
  const opacity = fadeInOut(t, tIn, tOut);
  const scale   = popIn(frame, Math.round(tIn * FPS));
  if (opacity <= 0) return null;
  return (
    <div style={{
      position: 'absolute', bottom: 60, right: 50, zIndex: 60,
      background: 'rgba(0,229,255,0.12)', border: `3px solid ${TEAL}`,
      borderRadius: 14, padding: '6px 28px',
      fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 90,
      color: TEAL, textShadow: `0 0 30px rgba(0,229,255,0.9)`,
      WebkitTextStroke: '3px #000', paintOrder: 'stroke fill' as any,
      opacity, transform: `scale(${scale})`,
    }}>$3</div>
  );
};

// 2 & 3. "$100B" orange badge — content zone, top-center; reused for both mentions
const Badge100B: React.FC<{ t: number; frame: number; overlayId: string }> = ({ t, frame, overlayId }) => {
  const ov = OVERLAYS_K3D.find(o => o.id === overlayId)!;
  const opacity = fadeInOut(t, ov.tIn, ov.tOut);
  const scale   = popIn(frame, Math.round(ov.tIn * FPS));
  if (opacity <= 0) return null;
  return (
    <div style={{
      position: 'absolute', top: 40, left: '50%', transform: `translateX(-50%) scale(${scale})`,
      zIndex: 60,
      background: 'rgba(247,147,26,0.18)', border: `3px solid ${ORANGE}`,
      borderRadius: 14, padding: '6px 32px',
      fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 64,
      color: ORANGE, textShadow: `0 0 25px rgba(247,147,26,0.9)`,
      WebkitTextStroke: '2px #000', paintOrder: 'stroke fill' as any,
      opacity, whiteSpace: 'nowrap',
    }}>$100 BILLION</div>
  );
};

// 4. "PARABOLIC CYCLE TOP ↑" label
const LabelParabolic: React.FC<{ t: number; frame: number }> = ({ t, frame }) => {
  const { tIn, tOut } = OVERLAYS_K3D.find(o => o.id === 'label-parab')!;
  const opacity = fadeInOut(t, tIn, tOut);
  const scale   = popIn(frame, Math.round(tIn * FPS));
  if (opacity <= 0) return null;
  return (
    <div style={{
      position: 'absolute', top: 40, left: 40, zIndex: 60,
      background: 'rgba(0,0,0,0.7)', border: `2px solid ${TEAL}`,
      borderRadius: 10, padding: '8px 20px',
      fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 28,
      color: TEAL, textTransform: 'uppercase', letterSpacing: '0.1em',
      textShadow: `0 0 12px rgba(0,229,255,0.6)`,
      opacity, transform: `scale(${scale})`,
    }}>PARABOLIC CYCLE TOP ↑</div>
  );
};

// 5. "AI EXPANSION CYCLE TOP" label
const LabelAI: React.FC<{ t: number; frame: number }> = ({ t, frame }) => {
  const { tIn, tOut } = OVERLAYS_K3D.find(o => o.id === 'label-ai')!;
  const opacity = fadeInOut(t, tIn, tOut);
  const scale   = popIn(frame, Math.round(tIn * FPS));
  if (opacity <= 0) return null;
  return (
    <div style={{
      position: 'absolute', bottom: 40, left: 40, zIndex: 60,
      background: 'rgba(0,0,0,0.7)', border: `2px solid ${YELLOW}`,
      borderRadius: 10, padding: '8px 20px',
      fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 28,
      color: YELLOW, textTransform: 'uppercase', letterSpacing: '0.1em',
      textShadow: `0 0 12px rgba(255,230,0,0.6)`,
      opacity, transform: `scale(${scale})`,
    }}>AI EXPANSION CYCLE TOP</div>
  );
};

// 6. Market cap comparison bars (BTC vs KAS target)
const BarsMarketCap: React.FC<{ t: number; frame: number }> = ({ t, frame }) => {
  const { tIn, tOut } = OVERLAYS_K3D.find(o => o.id === 'bars-mcap')!;
  const opacity   = fadeInOut(t, tIn, tOut);
  const localAge  = frame - Math.round(tIn * FPS);
  const btcFill   = interpolate(localAge, [0, 25], [0, 1], { extrapolateRight: 'clamp' });
  const kasFill   = interpolate(localAge, [10, 40], [0, 1], { extrapolateRight: 'clamp' });
  if (opacity <= 0) return null;

  const barStyle = (fill: number, color: string, maxW: number) => ({
    height: 28, width: maxW * fill, background: color, borderRadius: 4,
    boxShadow: `0 0 10px ${color}88`, transition: 'none',
  });

  return (
    <div style={{
      position: 'absolute', bottom: 36, right: 36, zIndex: 60,
      background: 'rgba(0,0,0,0.82)', border: '1px solid #333',
      borderRadius: 12, padding: '14px 20px', width: 340, opacity,
    }}>
      <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 18, color: '#888', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        market cap comparison
      </div>
      {/* BTC row */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 22, color: ORANGE }}>BTC today</span>
          <span style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: 22, color: ORANGE }}>$2T</span>
        </div>
        <div style={{ background: '#1a1a1a', borderRadius: 4, height: 28, overflow: 'hidden' }}>
          <div style={barStyle(btcFill, ORANGE, 300)} />
        </div>
      </div>
      {/* KAS target row */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 22, color: TEAL }}>KAS target</span>
          <span style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: 22, color: TEAL }}>$100B</span>
        </div>
        <div style={{ background: '#1a1a1a', borderRadius: 4, height: 28, overflow: 'hidden' }}>
          <div style={barStyle(kasFill, TEAL, 150)} />
        </div>
      </div>
    </div>
  );
};

// 7. "TENS OF TRILLIONS" yellow badge
const BadgeTrillions: React.FC<{ t: number; frame: number }> = ({ t, frame }) => {
  const { tIn, tOut } = OVERLAYS_K3D.find(o => o.id === 'badge-trills')!;
  const opacity = fadeInOut(t, tIn, tOut);
  const scale   = popIn(frame, Math.round(tIn * FPS));
  if (opacity <= 0) return null;
  return (
    <div style={{
      position: 'absolute', top: 36, right: 36, zIndex: 60,
      background: 'rgba(255,230,0,0.15)', border: `3px solid ${YELLOW}`,
      borderRadius: 12, padding: '8px 22px',
      fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 30,
      color: YELLOW, textTransform: 'uppercase', letterSpacing: '0.08em',
      textShadow: `0 0 16px rgba(255,230,0,0.8)`,
      opacity, transform: `scale(${scale})`,
    }}>💰 TENS OF TRILLIONS</div>
  );
};

// 8. Kaspa K logo in face zone (top-right)
const FaceKLogo: React.FC<{ t: number; frame: number }> = ({ t, frame }) => {
  const { tIn, tOut } = OVERLAYS_K3D.find(o => o.id === 'face-k-logo')!;
  const opacity = fadeInOut(t, tIn, tOut, 0.3);
  const scale   = popIn(frame, Math.round(tIn * FPS));
  if (opacity <= 0) return null;
  return (
    <img src={LOGO_KAS} style={{
      position: 'absolute',
      top: DIV_Y + 24, right: 24, zIndex: 70,
      width: 80, height: 80, borderRadius: '50%',
      boxShadow: `0 0 20px rgba(0,229,255,.8), 0 0 50px rgba(0,229,255,.4)`,
      opacity, transform: `scale(${scale})`,
    }} />
  );
};

// 9. Green radial glow on face zone
const FaceGlow: React.FC<{ t: number }> = ({ t }) => {
  const { tIn, tOut } = OVERLAYS_K3D.find(o => o.id === 'face-glow')!;
  const opacity = fadeInOut(t, tIn, tOut, 0.2);
  if (opacity <= 0) return null;
  return (
    <div style={{
      position: 'absolute', top: DIV_Y, left: 0, right: 0, bottom: 0, zIndex: 65,
      background: `radial-gradient(ellipse at 40% 30%, rgba(57,255,20,0.18) 0%, transparent 65%)`,
      pointerEvents: 'none', opacity,
    }} />
  );
};

// 10. Full-screen chart (hides face cam)
const FullScreenChart: React.FC<{ t: number; localFrame: number }> = ({ t, localFrame }) => {
  const { tIn, tOut } = OVERLAYS_K3D.find(o => o.id === 'fullscreen')!;
  const opacity = fadeInOut(t, tIn, tOut, 0.25);
  if (opacity <= 0) return null;
  const scale = spring({ frame: localFrame, fps: FPS, config: { damping: 14, stiffness: 120 }, from: 0.9, to: 1 });
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 200,
      background: '#000', opacity, transform: `scale(${scale})`,
    }}>
      <img src={CHART_KAS} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{
        position: 'absolute', top: 80, right: 60,
        fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 72,
        color: GREEN, textShadow: `0 0 30px rgba(57,255,20,.9)`,
        WebkitTextStroke: '3px #000', paintOrder: 'stroke fill' as any,
      }}>$3 ↑</div>
      <div style={{
        position: 'absolute', top: 170, right: 60,
        fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 32,
        color: TEAL, textTransform: 'uppercase', letterSpacing: '0.1em',
        textShadow: `0 0 12px rgba(0,229,255,.6)`,
      }}>$100B market cap</div>
    </div>
  );
};

// ─── Main composition ──────────────────────────────────────────────────────────
export const Kaspa3Dollar: React.FC = () => {
  const frame = useCurrentFrame();
  const t     = frame / FPS;
  const fsIn  = OVERLAYS_K3D.find(o => o.id === 'fullscreen')!.tIn;

  return (
    <AbsoluteFill style={{ background: '#000', overflow: 'hidden' }}>

      {/* ── Vertical video background (face cam below y=660) ─────────────────── */}
      <OffthreadVideo
        src={CLIP_K3D}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />

      {/* ── B-roll panels (cover X loading screen in content zone) ──────────── */}
      <BrollZone t={t} frame={frame} />

      {/* ── Content zone overlays ───────────────────────────────────────────── */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: BROLL_H, zIndex: 50 }}>
        <Badge3       t={t} frame={frame} />
        <Badge100B    t={t} frame={frame} overlayId="badge-100b-1" />
        <Badge100B    t={t} frame={frame} overlayId="badge-100b-2" />
        <LabelParabolic t={t} frame={frame} />
        <LabelAI      t={t} frame={frame} />
        <BarsMarketCap t={t} frame={frame} />
        <BadgeTrillions t={t} frame={frame} />
      </div>

      {/* ── Face zone overlays ──────────────────────────────────────────────── */}
      <FaceKLogo  t={t} frame={frame} />
      <FaceGlow   t={t} />

      {/* ── Glowing divider ─────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: DIV_Y, left: 0, right: 0, height: 3, zIndex: 10,
        background: `linear-gradient(90deg, transparent, ${TEAL} 20%, ${TEAL} 80%, transparent)`,
        boxShadow: `0 0 14px rgba(0,229,255,.7)`,
      }} />

      {/* ── Caption band ────────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute',
        top: CAP_TOP, left: 0, right: 0, height: CAP_H,
        background: 'linear-gradient(180deg, rgba(0,0,0,.92) 0%, rgba(0,0,0,.98) 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 44px', zIndex: 40, overflow: 'hidden',
      }}>
        <Caption frame={frame} t={t} />
      </div>

      {/* ── Kaspa watermark ─────────────────────────────────────────────────── */}
      <img src={LOGO_KAS} style={{
        position: 'absolute', top: 18, left: 18,
        width: 80, height: 80, borderRadius: '50%', zIndex: 300,
        boxShadow: `0 0 16px rgba(0,229,255,.6), 0 0 32px rgba(0,229,255,.3)`,
      }} />

      {/* ── Full-screen chart close ──────────────────────────────────────────── */}
      <FullScreenChart
        t={t}
        localFrame={frame - Math.round(fsIn * FPS)}
      />

      {/* ── Sound effects ───────────────────────────────────────────────────── */}
      {SOUNDS_K3D.map(e => (
        <Sequence key={e.t} from={Math.round(e.t * FPS)} durationInFrames={FPS}>
          <Audio src={e.src} />
        </Sequence>
      ))}

    </AbsoluteFill>
  );
};

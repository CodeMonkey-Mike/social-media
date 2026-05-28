import React from 'react';
import { AbsoluteFill, Audio, Sequence, OffthreadVideo, interpolate, useCurrentFrame, spring } from 'remotion';
import {
  FPS_T as FPS,
  CLIP_T, LOGO_KAS_T, LOGO_ETH_T,
  HOOK_BG_T, COVENANT_BG_T,
  BROLL_H_T as BROLL_H, DIV_Y_T as DIV_Y, CAP_TOP_T as CAP_TOP, CAP_H_T as CAP_H,
  BROLL_RANGES_T, OVERLAYS_T, CAPTIONS_T, SOUNDS_T,
} from './constants-toccata';

const TEAL   = '#00e5ff';
const ORANGE = '#f7931a';
const YELLOW = '#ffe600';
const GREEN  = '#39ff14';
const RED    = '#ff4444';
const PURPLE = '#c8b2f8';

function fadeInOut(t: number, tIn: number, tOut: number, f = 0.15) {
  return interpolate(t, [tIn, tIn + f, tOut - f, tOut], [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
}
function popIn(frame: number, startF: number) {
  return spring({ frame: frame - startF, fps: FPS, config: { damping: 10, stiffness: 400 }, from: 0.3, to: 1.0 });
}

// ─── Caption ───────────────────────────────────────────────────────────────────
function getCaption(t: number) {
  for (let i = CAPTIONS_T.length - 1; i >= 0; i--) {
    if (t >= CAPTIONS_T[i].t) return { idx: i, html: CAPTIONS_T[i].h };
  }
  return { idx: 0, html: '' };
}
const Caption: React.FC<{ frame: number; t: number }> = ({ frame, t }) => {
  const { idx, html } = getCaption(t);
  const age   = frame - Math.round(CAPTIONS_T[idx]?.t ?? 0) * FPS;
  const scale = spring({ frame: age, fps: FPS, config: { damping: 10, stiffness: 400 }, from: 0.7, to: 1.0 });
  const col   = html
    .replace(/<g>/g, `<span style="color:${TEAL}">`)   .replace(/<\/g>/g, '</span>')
    .replace(/<o>/g, `<span style="color:${ORANGE}">`)  .replace(/<\/o>/g, '</span>')
    .replace(/<y>/g, `<span style="color:${YELLOW}">`)  .replace(/<\/y>/g, '</span>')
    .replace(/<r>/g, `<span style="color:${RED}">`)     .replace(/<\/r>/g, '</span>');
  return (
    <div style={{
      fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 72,
      color: '#fff', textTransform: 'lowercase', textAlign: 'center',
      letterSpacing: '0.08em', lineHeight: 1.1,
      WebkitTextStroke: '11px #000', paintOrder: 'stroke fill' as any,
      width: '100%', whiteSpace: 'nowrap', transform: `scale(${scale})`,
    }} dangerouslySetInnerHTML={{ __html: col }} />
  );
};

// ─── B-roll panels ─────────────────────────────────────────────────────────────
const UpgradePanel: React.FC<{ frame: number }> = ({ frame }) => {
  const logoScale = spring({ frame, fps: FPS, config: { damping: 14, stiffness: 160 }, from: 0, to: 1 });
  const txtScale  = spring({ frame: Math.max(0, frame - 8), fps: FPS, config: { damping: 14, stiffness: 160 }, from: 0, to: 1 });
  return (
    <div style={{ width: '100%', height: BROLL_H, position: 'relative', overflow: 'hidden',
      background: 'radial-gradient(ellipse at 50% 40%, #021a1a 0%, #050d0d 60%, #000 100%)' }}>
      <img src={HOOK_BG_T} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'cover', opacity: 0.5 }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
      <div style={{ position: 'relative', zIndex: 2, width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
        <img src={LOGO_KAS_T} style={{ width: 110, height: 110, borderRadius: '50%',
          boxShadow: `0 0 30px rgba(0,229,255,.8), 0 0 80px rgba(0,229,255,.3)`,
          transform: `scale(${logoScale})` }} />
        <div style={{ transform: `scale(${txtScale})`, textAlign: 'center', padding: '0 36px' }}>
          <div style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: 34,
            color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            kaspa's biggest update
          </div>
          <div style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: 60,
            color: TEAL, textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1.0,
            textShadow: `0 0 20px rgba(0,229,255,.6)` }}>
            since crescendo
          </div>
          <div style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 26, color: '#888',
            textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 8 }}>
            native tokens · covenants · zero-knowledge
          </div>
        </div>
      </div>
    </div>
  );
};

const CovenantPanel: React.FC<{ localFrame: number }> = ({ localFrame }) => {
  const scale = spring({ frame: localFrame, fps: FPS, config: { damping: 12, stiffness: 180 }, from: 0, to: 1 });
  const glow  = 0.5 + 0.5 * Math.abs(Math.sin(localFrame / 18));
  return (
    <div style={{ width: '100%', height: BROLL_H, position: 'relative', overflow: 'hidden',
      background: 'radial-gradient(ellipse at 50% 50%, #0a0020 0%, #050010 60%, #000 100%)' }}>
      <img src={COVENANT_BG_T} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'cover', opacity: 0.45 }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
      <div style={{ position: 'relative', zIndex: 2, width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
        transform: `scale(${scale})` }}>
        <div style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: 34, color: '#666',
          textTransform: 'uppercase', letterSpacing: '0.12em' }}>what is a covenant?</div>
        <div style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: 52,
          color: YELLOW, textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1.1,
          textShadow: `0 0 25px rgba(255,230,0,${glow})`,
          WebkitTextStroke: '2px #000', paintOrder: 'stroke fill' as any, textAlign: 'center', padding: '0 30px' }}>
          a rule attached to a coin
        </div>
        <div style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 28,
          color: TEAL, textTransform: 'uppercase', letterSpacing: '0.08em',
          textShadow: `0 0 12px rgba(0,229,255,.6)` }}>
          the coin itself enforces conditions
        </div>
      </div>
    </div>
  );
};

const BrollZone: React.FC<{ t: number; frame: number }> = ({ t, frame }) => {
  const active = BROLL_RANGES_T.find(r => t >= r.tStart && t < r.tEnd) ?? BROLL_RANGES_T[0];
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: BROLL_H, overflow: 'hidden' }}>
      {active.id === 'upgrade'  && <UpgradePanel  frame={frame} />}
      {active.id === 'covenant' && <CovenantPanel localFrame={frame - Math.round(BROLL_RANGES_T[1].tStart * FPS)} />}
    </div>
  );
};

// ─── Overlays ──────────────────────────────────────────────────────────────────
const BadgeCrescendo: React.FC<{ t: number; frame: number }> = ({ t, frame }) => {
  const ov = OVERLAYS_T.find(o => o.id === 'badge-crescendo')!;
  const opacity = fadeInOut(t, ov.tIn, ov.tOut);
  const scale   = popIn(frame, Math.round(ov.tIn * FPS));
  if (opacity <= 0) return null;
  return (
    <div style={{ position: 'absolute', top: 36, right: 40, zIndex: 60, opacity,
      transform: `scale(${scale})`, background: 'rgba(0,229,255,0.12)',
      border: `2px solid ${TEAL}`, borderRadius: 10, padding: '6px 20px',
      fontFamily: 'Montserrat', fontWeight: 900, fontSize: 28, color: TEAL,
      textTransform: 'uppercase', letterSpacing: '0.08em',
      textShadow: `0 0 12px rgba(0,229,255,.6)` }}>
      ↑ BIGGEST UPDATE SINCE CRESCENDO
    </div>
  );
};

const TechPills: React.FC<{ t: number; frame: number }> = ({ t, frame }) => {
  const pills = [
    { id: 'badge-tokens',    label: '🔷 NATIVE TOKENS',    color: TEAL,   top: 44,  left: 40  },
    { id: 'badge-covenants', label: '📜 COVENANTS',        color: YELLOW, top: 100, left: 40  },
    { id: 'badge-zk',        label: '🔒 ZERO-KNOWLEDGE',   color: PURPLE, top: 156, left: 40  },
  ];
  return (
    <>
      {pills.map(p => {
        const ov = OVERLAYS_T.find(o => o.id === p.id)!;
        const opacity = fadeInOut(t, ov.tIn, ov.tOut);
        const scale   = popIn(frame, Math.round(ov.tIn * FPS));
        if (opacity <= 0) return null;
        return (
          <div key={p.id} style={{
            position: 'absolute', top: p.top, left: p.left, zIndex: 60,
            opacity, transform: `scale(${scale})`,
            background: 'rgba(0,0,0,0.75)', border: `2px solid ${p.color}`,
            borderRadius: 8, padding: '5px 16px',
            fontFamily: 'Montserrat', fontWeight: 900, fontSize: 24,
            color: p.color, textTransform: 'uppercase', letterSpacing: '0.07em',
            textShadow: `0 0 10px ${p.color}88`,
          }}>{p.label}</div>
        );
      })}
    </>
  );
};

const BadgeLayer1: React.FC<{ t: number; frame: number }> = ({ t, frame }) => {
  const ov = OVERLAYS_T.find(o => o.id === 'badge-layer1')!;
  const opacity = fadeInOut(t, ov.tIn, ov.tOut);
  const scale   = popIn(frame, Math.round(ov.tIn * FPS));
  if (opacity <= 0) return null;
  return (
    <div style={{ position: 'absolute', bottom: 36, left: '50%',
      transform: `translateX(-50%) scale(${scale})`, zIndex: 60, opacity,
      background: 'rgba(57,255,20,0.15)', border: `3px solid ${GREEN}`,
      borderRadius: 12, padding: '8px 28px', whiteSpace: 'nowrap',
      fontFamily: 'Montserrat', fontWeight: 900, fontSize: 32,
      color: GREEN, textTransform: 'uppercase', letterSpacing: '0.07em',
      textShadow: `0 0 16px rgba(57,255,20,.8)` }}>
      ↑ PROGRAMMABLE LAYER 1
    </div>
  );
};

const BadgeRule: React.FC<{ t: number; frame: number }> = ({ t, frame }) => {
  const ov = OVERLAYS_T.find(o => o.id === 'badge-rule')!;
  const opacity = fadeInOut(t, ov.tIn, ov.tOut);
  const scale   = popIn(frame, Math.round(ov.tIn * FPS));
  if (opacity <= 0) return null;
  return (
    <div style={{ position: 'absolute', top: 40, left: 36, zIndex: 60, opacity,
      transform: `scale(${scale})`,
      background: 'rgba(0,0,0,0.78)', border: `2px solid ${YELLOW}`,
      borderRadius: 10, padding: '7px 18px',
      fontFamily: 'Montserrat', fontWeight: 900, fontSize: 26,
      color: YELLOW, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
      RULE ATTACHED TO A COIN
    </div>
  );
};

const BadgeEnforce: React.FC<{ t: number; frame: number }> = ({ t, frame }) => {
  const ov = OVERLAYS_T.find(o => o.id === 'badge-enforce')!;
  const opacity = fadeInOut(t, ov.tIn, ov.tOut);
  const scale   = popIn(frame, Math.round(ov.tIn * FPS));
  if (opacity <= 0) return null;
  return (
    <div style={{ position: 'absolute', bottom: 36, left: '50%',
      transform: `translateX(-50%) scale(${scale})`, zIndex: 60, opacity, whiteSpace: 'nowrap',
      background: 'rgba(0,229,255,0.12)', border: `2px solid ${TEAL}`,
      borderRadius: 10, padding: '7px 20px',
      fontFamily: 'Montserrat', fontWeight: 900, fontSize: 26,
      color: TEAL, textTransform: 'uppercase', letterSpacing: '0.08em',
      textShadow: `0 0 12px rgba(0,229,255,.6)` }}>
      COINS ENFORCE CONDITIONS
    </div>
  );
};

const FaceKLogo: React.FC<{ t: number; frame: number }> = ({ t, frame }) => {
  const ov = OVERLAYS_T.find(o => o.id === 'face-k-logo')!;
  const opacity = fadeInOut(t, ov.tIn, ov.tOut, 0.3);
  const scale   = popIn(frame, Math.round(ov.tIn * FPS));
  if (opacity <= 0) return null;
  return (
    <img src={LOGO_KAS_T} style={{
      position: 'absolute', top: DIV_Y + 22, right: 22, zIndex: 70,
      width: 76, height: 76, borderRadius: '50%',
      boxShadow: `0 0 18px rgba(0,229,255,.8), 0 0 45px rgba(0,229,255,.4)`,
      opacity, transform: `scale(${scale})` }} />
  );
};

const FaceGlow: React.FC<{ t: number }> = ({ t }) => {
  const ov = OVERLAYS_T.find(o => o.id === 'face-glow-green')!;
  const opacity = fadeInOut(t, ov.tIn, ov.tOut, 0.2);
  if (opacity <= 0) return null;
  return (
    <div style={{ position: 'absolute', top: DIV_Y, left: 0, right: 0, bottom: 0, zIndex: 65,
      background: `radial-gradient(ellipse at 45% 25%, rgba(0,229,255,0.2) 0%, transparent 60%)`,
      pointerEvents: 'none', opacity }} />
  );
};

const FullScreenEnd: React.FC<{ t: number; localFrame: number }> = ({ t, localFrame }) => {
  const ov = OVERLAYS_T.find(o => o.id === 'fullscreen-end')!;
  const opacity = fadeInOut(t, ov.tIn, ov.tOut, 0.3);
  if (opacity <= 0) return null;
  const scale = spring({ frame: localFrame, fps: FPS, config: { damping: 14, stiffness: 120 }, from: 0.92, to: 1 });
  const glow  = 0.5 + 0.5 * Math.abs(Math.sin(localFrame / 15));
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 200, background: '#000',
      opacity, transform: `scale(${scale})`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
      <img src={COVENANT_BG_T} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'cover', opacity: 0.5 }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
      <div style={{ position: 'relative', zIndex: 3, textAlign: 'center' }}>
        <div style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: 50,
          color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em' }}>turning kaspa into</div>
        <div style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: 86,
          color: TEAL, textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 0.95,
          textShadow: `0 0 40px rgba(0,229,255,${glow}), 0 0 80px rgba(0,229,255,0.3)`,
          WebkitTextStroke: '3px #000', paintOrder: 'stroke fill' as any }}>
          a programmable<br/>layer one
        </div>
        <div style={{ marginTop: 18, fontFamily: 'Montserrat', fontWeight: 700, fontSize: 28,
          color: YELLOW, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          toccata hard fork
        </div>
      </div>
    </div>
  );
};

// ─── Main composition ──────────────────────────────────────────────────────────
export const ToccataExplained: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const fsIn = OVERLAYS_T.find(o => o.id === 'fullscreen-end')!.tIn;

  return (
    <AbsoluteFill style={{ background: '#000', overflow: 'hidden' }}>
      <OffthreadVideo src={CLIP_T} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <BrollZone t={t} frame={frame} />

      {/* Content zone overlays */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: BROLL_H, zIndex: 50 }}>
        <BadgeCrescendo t={t} frame={frame} />
        <TechPills      t={t} frame={frame} />
        <BadgeLayer1    t={t} frame={frame} />
        <BadgeRule      t={t} frame={frame} />
        <BadgeEnforce   t={t} frame={frame} />
      </div>

      {/* Face zone overlays */}
      <FaceKLogo  t={t} frame={frame} />
      <FaceGlow   t={t} />

      {/* Divider */}
      <div style={{ position: 'absolute', top: DIV_Y, left: 0, right: 0, height: 3, zIndex: 10,
        background: `linear-gradient(90deg, transparent, ${TEAL} 20%, ${TEAL} 80%, transparent)`,
        boxShadow: `0 0 14px rgba(0,229,255,.7)` }} />

      {/* Caption band */}
      <div style={{ position: 'absolute', top: CAP_TOP, left: 0, right: 0, height: CAP_H,
        background: 'linear-gradient(180deg, rgba(0,0,0,.92) 0%, rgba(0,0,0,.98) 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 44px', zIndex: 40, overflow: 'hidden' }}>
        <Caption frame={frame} t={t} />
      </div>

      {/* Kaspa watermark */}
      <img src={LOGO_KAS_T} style={{ position: 'absolute', top: 18, left: 18,
        width: 80, height: 80, borderRadius: '50%', zIndex: 300,
        boxShadow: `0 0 16px rgba(0,229,255,.6), 0 0 32px rgba(0,229,255,.3)` }} />

      {/* Full-screen close */}
      <FullScreenEnd t={t} localFrame={frame - Math.round(fsIn * FPS)} />

      {/* Sound effects */}
      {SOUNDS_T.map(e => (
        <Sequence key={e.t} from={Math.round(e.t * FPS)} durationInFrames={FPS}>
          <Audio src={e.src} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

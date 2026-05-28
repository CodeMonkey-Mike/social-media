import React from 'react';
import {
  AbsoluteFill, Audio, Sequence, OffthreadVideo,
  interpolate, useCurrentFrame, spring,
} from 'remotion';
import {
  FPS, W, H,
  FACE_VIDEO, LOGO_KASPA, LOGO_BTC, LOGO_ETH,
  IMG_TYSON, IMG_KO, IMG_CHART,
  BROLL_RANGES, CAPTIONS, SOUND_EVENTS,
  FULLBROLL_RANGE, FULLFACE_RANGE, FACE_BADGE_RANGE,
} from './constants';

// ─── Layout constants ──────────────────────────────────────────────────────────
const BROLL_H    = 860;
const DIV_TOP    = 860;
const CAP_TOP    = 863;
const CAP_H      = 140;
const FACE_TOP   = 1003;
const SAFE_B     = 240;

// ─── Colour helpers ────────────────────────────────────────────────────────────
const G = '#39ff14'; // kaspa green
const O = '#f7931a'; // bitcoin orange
const P = '#c8b2f8'; // ethereum purple
const R = '#ff4444'; // red/danger

// ─── Glow animation helper (uses sin on currentTime via frame) ─────────────────
function glow(frame: number, base: number, range: number, color: string) {
  const v = base + Math.sin(frame / FPS * 2.5) * range;
  return `drop-shadow(0 0 ${v}px ${color})`;
}

// ─── Panel visibility helper ───────────────────────────────────────────────────
function panelOpacity(t: number, start: number, end: number): number {
  return interpolate(t, [start, start + 0.35, end - 0.35, end],
    [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
}

// ─── Active caption ────────────────────────────────────────────────────────────
function getCaption(t: number): { idx: number; html: string } {
  for (let i = CAPTIONS.length - 1; i >= 0; i--) {
    if (t >= CAPTIONS[i].t) return { idx: i, html: CAPTIONS[i].h };
  }
  return { idx: 0, html: '' };
}

// ─── Hook Panel ────────────────────────────────────────────────────────────────
const HookPanel: React.FC<{ t: number; frame: number }> = ({ t, frame }) => {
  const opacity = panelOpacity(t, 0, 12.64);
  if (opacity <= 0) return null;
  return (
    <AbsoluteFill style={{
      opacity,
      background: 'radial-gradient(ellipse 800px 500px at 50% 60%, rgba(0,50,40,.8) 0%, #000 70%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 50, padding: '80px 60px 60px', textAlign: 'center',
    }}>
      <img src={LOGO_KASPA} style={{
        width: 260, height: 260, borderRadius: '50%',
        boxShadow: '0 0 50px rgba(0,229,255,.7), 0 0 100px rgba(0,229,255,.35)',
        transform: `rotate(${Math.sin(frame / FPS) * 4}deg) scale(${1 + Math.sin(frame / FPS) * 0.02})`,
      }} />
      <div style={{ fontSize: 82, fontWeight: 900, color: '#fff', textTransform: 'uppercase', lineHeight: 1.05 }}>
        WHY WOULD ANYBODY<br />WANT <span style={{ color: G }}>ETH</span><br />OVER THIS?
      </div>
      <div style={{ fontSize: 52, fontWeight: 900, color: 'rgba(0,229,255,.85)', textTransform: 'uppercase', letterSpacing: 2 }}>
        $KAS is about to answer that.
      </div>
    </AbsoluteFill>
  );
};

// ─── Tyson Panel ───────────────────────────────────────────────────────────────
const TysonPanel: React.FC<{ t: number }> = ({ t }) => {
  const opacity = panelOpacity(t, 12.64, 32.04);
  if (opacity <= 0) return null;
  return (
    <AbsoluteFill style={{ opacity }}>
      <img src={IMG_TYSON} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,.92) 60%)',
        padding: '30px 40px 40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28,
      }}>
        <img src={LOGO_BTC} style={{ width: 120, height: 120, borderRadius: '50%', boxShadow: '0 0 30px rgba(247,147,26,.7)', flexShrink: 0 }} />
        <div style={{ fontSize: 72, fontWeight: 900, color: O, textTransform: 'uppercase', letterSpacing: 2, textShadow: `0 0 20px rgba(247,147,26,.6), 3px 3px 0 rgba(0,0,0,.8)` }}>
          = BITCOIN
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Knockout Panel ────────────────────────────────────────────────────────────
const KnockoutPanel: React.FC<{ t: number }> = ({ t }) => {
  const opacity = panelOpacity(t, 32.04, 68.72);
  if (opacity <= 0) return null;
  return (
    <AbsoluteFill style={{ opacity }}>
      <img src={IMG_KO} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,.9) 60%)',
        padding: '20px 40px 36px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24,
      }}>
        <img src={LOGO_ETH} style={{ width: 100, height: 100, borderRadius: '50%', boxShadow: '0 0 28px rgba(140,80,220,.8)', flexShrink: 0 }} />
        <div style={{ fontSize: 30, color: R, textShadow: '0 0 16px rgba(255,60,60,.7)' }}>▼</div>
        <div style={{ fontSize: 58, fontWeight: 900, color: P, textTransform: 'uppercase', textShadow: '0 0 16px rgba(140,80,220,.6), 3px 3px 0 rgba(0,0,0,.8)' }}>
          ETH knocks out BTC
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── ETH beats BTC vs Panel ────────────────────────────────────────────────────
const EthBtcPanel: React.FC<{ t: number }> = ({ t }) => {
  const opacity = panelOpacity(t, 68.72, 91.04);
  if (opacity <= 0) return null;
  const age = t - 68.72;
  const ethX  = interpolate(age, [0.08, 0.3], [-60, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ethO  = interpolate(age, [0.08, 0.3], [0, 1],   { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const arrO  = interpolate(age, [0.32, 0.5], [0, 1],   { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const btcX  = interpolate(age, [0.55, 0.8], [60, 0],  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const btcO  = interpolate(age, [0.55, 0.8], [0, 1],   { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const pulse = 1 + Math.sin(age * 3) * 0.025;
  return (
    <AbsoluteFill style={{ opacity, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, padding: '40px 30px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, flex: 1, opacity: ethO, transform: `translateX(${ethX}px) scale(${pulse})` }}>
        <img src={LOGO_ETH} style={{ width: 260, height: 260, borderRadius: '50%', boxShadow: '0 0 50px rgba(140,80,220,.65)' }} />
        <div style={{ fontSize: 60, fontWeight: 900, color: P, textTransform: 'uppercase', letterSpacing: 3, textShadow: `0 0 16px ${P}, 3px 3px 0 rgba(0,0,0,.8)` }}>ETH</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 10px', opacity: arrO }}>
        <div style={{ fontSize: 88, color: G, textShadow: `0 0 24px rgba(57,255,20,.7)` }}>▶</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, flex: 1, opacity: btcO, transform: `translateX(${btcX}px)`, filter: 'grayscale(.7) brightness(.6)' }}>
        <img src={LOGO_BTC} style={{ width: 260, height: 260, borderRadius: '50%' }} />
        <div style={{ fontSize: 60, fontWeight: 900, color: O, textTransform: 'uppercase', letterSpacing: 3, opacity: 0.45 }}>BTC</div>
      </div>
    </AbsoluteFill>
  );
};

// ─── KAS Chart Panel ───────────────────────────────────────────────────────────
const KasChartPanel: React.FC<{ t: number; frame: number }> = ({ t, frame }) => {
  const opacity = panelOpacity(t, 91.04, 99.00);
  if (opacity <= 0) return null;
  const arrowY = Math.sin(frame / FPS * (Math.PI / 0.7)) * 14;
  return (
    <AbsoluteFill style={{ opacity }}>
      <img src={IMG_CHART} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,.92) 55%)',
        padding: '22px 36px 30px', display: 'flex', alignItems: 'center', gap: 22,
      }}>
        <img src={LOGO_KASPA} style={{ width: 82, height: 82, borderRadius: '50%', boxShadow: '0 0 24px rgba(0,229,255,.75)', flexShrink: 0 }} />
        <div style={{ fontSize: 88, fontWeight: 900, color: G, lineHeight: 1, textShadow: `0 0 20px rgba(57,255,20,.7), 3px 3px 0 rgba(0,0,0,.8)` }}>
          $3
          <span style={{ display: 'block', fontSize: 44, color: 'rgba(57,255,20,.75)', lineHeight: 1.1 }}>target</span>
        </div>
        <div style={{ fontSize: 96, color: G, lineHeight: 1, marginLeft: 'auto', textShadow: `0 0 30px rgba(57,255,20,.85)`, transform: `translateY(${arrowY}px)` }}>↑</div>
      </div>
    </AbsoluteFill>
  );
};

// ─── KAS beats ETH vs Panel ────────────────────────────────────────────────────
const KasEthPanel: React.FC<{ t: number }> = ({ t }) => {
  const opacity = panelOpacity(t, 99.00, 110.00);
  if (opacity <= 0) return null;
  const age = t - 99.00;
  const kasX  = interpolate(age, [0.08, 0.3], [-60, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const kasO  = interpolate(age, [0.08, 0.3], [0, 1],   { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const arrO  = interpolate(age, [0.32, 0.5], [0, 1],   { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ethX  = interpolate(age, [0.55, 0.8], [60, 0],  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ethO  = interpolate(age, [0.55, 0.8], [0, 1],   { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const pulse = 1 + Math.sin(age * 3) * 0.025;
  return (
    <AbsoluteFill style={{ opacity, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, padding: '40px 30px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, flex: 1, opacity: kasO, transform: `translateX(${kasX}px) scale(${pulse})` }}>
        <img src={LOGO_KASPA} style={{ width: 260, height: 260, borderRadius: '50%', boxShadow: '0 0 50px rgba(0,229,255,.65)' }} />
        <div style={{ fontSize: 60, fontWeight: 900, color: G, textTransform: 'uppercase', letterSpacing: 3, textShadow: `0 0 16px ${G}, 3px 3px 0 rgba(0,0,0,.8)` }}>$KAS</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 10px', opacity: arrO }}>
        <div style={{ fontSize: 88, color: G, textShadow: `0 0 24px rgba(57,255,20,.7)` }}>▶</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, flex: 1, opacity: ethO, transform: `translateX(${ethX}px)`, filter: 'grayscale(.7) brightness(.6)' }}>
        <img src={LOGO_ETH} style={{ width: 260, height: 260, borderRadius: '50%' }} />
        <div style={{ fontSize: 60, fontWeight: 900, color: P, textTransform: 'uppercase', letterSpacing: 3, opacity: 0.45 }}>ETH</div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Caption component ─────────────────────────────────────────────────────────
const Caption: React.FC<{ frame: number; t: number }> = ({ frame, t }) => {
  const { idx, html } = getCaption(t);
  const captionStart = CAPTIONS[idx]?.t ?? 0;
  const age = frame - Math.round(captionStart * FPS);
  const scale = spring({ frame: age, fps: FPS, config: { damping: 200, stiffness: 500 }, from: 0.7, to: 1.0 });

  // Map span classes to inline colours for Remotion (no CSS classes in inline render)
  const coloured = html
    .replace(/<span class="g">/g, `<span style="color:${G}">`)
    .replace(/<span class="o">/g, `<span style="color:${O}">`)
    .replace(/<span class="p">/g, `<span style="color:${P}">`)
    .replace(/<span class="r">/g, `<span style="color:${R}">`)
    .replace(/<span class='g'>/g, `<span style="color:${G}">`)
    .replace(/<span class='o'>/g, `<span style="color:${O}">`)
    .replace(/<span class='p'>/g, `<span style="color:${P}">`)
    .replace(/<span class='r'>/g, `<span style="color:${R}">`);

  return (
    <div
      style={{
        fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 72,
        color: '#fff', textTransform: 'lowercase', textAlign: 'center',
        letterSpacing: '0.08em', lineHeight: 1.1,
        WebkitTextStroke: '4px #000', paintOrder: 'stroke fill' as any,
        display: 'block', width: '100%', whiteSpace: 'nowrap',
        transform: `scale(${scale})`,
      }}
      dangerouslySetInnerHTML={{ __html: coloured }}
    />
  );
};

// ─── Main composition ──────────────────────────────────────────────────────────
export const MikeTysonKaspa: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  const isFullBroll = t >= FULLBROLL_RANGE.start && t < FULLBROLL_RANGE.end;
  const isFullFace  = t >= FULLFACE_RANGE.start  && t < FULLFACE_RANGE.end;
  const showBadge   = t >= FACE_BADGE_RANGE.start && t < FACE_BADGE_RANGE.end;

  const brollH  = isFullBroll ? H - SAFE_B : BROLL_H;
  const faceTop = isFullFace  ? 0          : FACE_TOP;

  const kaspaGlow = glow(frame, 12, 8, 'rgba(0,229,255,.7)');

  return (
    <AbsoluteFill style={{ background: '#000', fontFamily: 'Montserrat, sans-serif', overflow: 'hidden' }}>

      {/* ── Kaspa watermark ──────────────────────────────────────────────── */}
      <img src={LOGO_KASPA} style={{
        position: 'absolute', top: 18, left: 18,
        width: 110, height: 110, borderRadius: '50%',
        zIndex: 300, filter: kaspaGlow,
      }} />

      {/* ── B-roll zone ───────────────────────────────────────────────────── */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: brollH, overflow: 'hidden', background: '#000' }}>
        <HookPanel     t={t} frame={frame} />
        <TysonPanel    t={t} />
        <KnockoutPanel t={t} />
        <EthBtcPanel   t={t} />
        <KasChartPanel t={t} frame={frame} />
        <KasEthPanel   t={t} />
      </div>

      {/* ── Divider ───────────────────────────────────────────────────────── */}
      {!isFullBroll && !isFullFace && (
        <div style={{
          position: 'absolute', top: DIV_TOP, left: 0, right: 0, height: 3, zIndex: 10,
          background: `linear-gradient(90deg, transparent, ${G} 20%, ${G} 80%, transparent)`,
          boxShadow: `0 0 14px rgba(57,255,20,.65)`,
        }} />
      )}

      {/* ── Caption band ──────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute',
        ...(isFullBroll || isFullFace
          ? { bottom: 260, left: 0, right: 0, height: CAP_H, background: 'transparent' }
          : { top: CAP_TOP, left: 0, right: 0, height: CAP_H, background: 'linear-gradient(180deg, rgba(0,0,0,.88) 0%, rgba(0,0,0,.97) 100%)' }),
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 44px', zIndex: 40, overflow: 'hidden',
      }}>
        <Caption frame={frame} t={t} />
      </div>

      {/* ── Face-cam ──────────────────────────────────────────────────────── */}
      {!isFullBroll && (
        <div style={{ position: 'absolute', top: faceTop, left: 0, right: 0, bottom: SAFE_B, overflow: 'hidden' }}>
          <OffthreadVideo
            src={FACE_VIDEO}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center' }}
          />
        </div>
      )}

      {/* ── BTC badge overlay ─────────────────────────────────────────────── */}
      {showBadge && (
        <div style={{
          position: 'absolute', top: FACE_TOP, left: 0, right: 0, bottom: SAFE_B,
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 150,
        }}>
          <img src={LOGO_BTC} style={{
            width: 220, height: 220, borderRadius: '50%',
            boxShadow: '0 0 60px rgba(247,147,26,.85), 0 0 120px rgba(247,147,26,.45)',
            transform: `scale(${1 + Math.sin(t * 8) * 0.04})`,
          }} />
        </div>
      )}

      {/* ── Sound effects ─────────────────────────────────────────────────── */}
      {SOUND_EVENTS.map(e => (
        <Sequence key={e.t} from={Math.round(e.t * FPS)} durationInFrames={FPS}>
          <Audio src={e.src} />
        </Sequence>
      ))}

    </AbsoluteFill>
  );
};

import React from 'react';
import {
  AbsoluteFill, OffthreadVideo, Img, Audio, Sequence,
  useCurrentFrame, interpolate, spring,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/Montserrat';
import { FONT, GREEN, YELLOW, colourize, fadeInOut } from './_kit';
import {
  RHFG_FPS, RHFG_SEAM, RHFG_CAP_Y, CLIP, THUMB, THUMB_TITLE, THUMB_CHIP,
  CAPTIONS_RHFG, BROLL_RHFG, BADGES_RHFG, SFX_RHFG,
} from './constants-rhfg';

// Register Montserrat 900 (captions + badges + thumbnail headline) so text renders reliably.
loadFont('normal', { weights: ['900'], subsets: ['latin'], ignoreTooManyRequestsWarning: true });

// Robinhood brand neon green for the thumbnail chip / accents (persona robinhood_coin, not teal).
const RH_NEON = '#CCFF00';

// ─── B-roll layer (over the composited base video) ────────────────────────────────
// 'full' = whole frame; 'zone' = the top screen-share zone only (0..SEAM) so Mike's face stays
// visible below. No beats are adjacent, so each fades to/from the base (no full-to-full flash).
const BrollLayer: React.FC<{ t: number }> = ({ t }) => {
  const idx = BROLL_RHFG.findIndex(e => t >= e.tIn && t < e.tOut);
  if (idx < 0) return null;
  const ev = BROLL_RHFG[idx];
  const F = 0.12, EPS = 0.18;
  const prevAdj = BROLL_RHFG.some((o, i) => i !== idx && Math.abs(o.tOut - ev.tIn) <= EPS);
  const nextAdj = BROLL_RHFG.some((o, i) => i !== idx && Math.abs(o.tIn - ev.tOut) <= EPS);
  const atStart = ev.tIn <= 0.001;
  let op = 1;
  if (!prevAdj && !atStart) op = Math.min(op, interpolate(t, [ev.tIn, ev.tIn + F], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  if (!nextAdj) op = Math.min(op, interpolate(t, [ev.tOut - F, ev.tOut], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  const age = t - ev.tIn;
  const kb = interpolate(age, [0, ev.tOut - ev.tIn], [1.0, 1.07], { extrapolateRight: 'clamp' });

  if (ev.mode === 'full') {
    return (
      <AbsoluteFill style={{ opacity: op, zIndex: 60 }}>
        <Img src={ev.src} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${kb})` }} />
      </AbsoluteFill>
    );
  }
  // zone: cover ONLY the top screen-share zone; face (base video) plays below the seam.
  return (
    <AbsoluteFill style={{ opacity: op, zIndex: 60 }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: 1080, height: RHFG_SEAM, overflow: 'hidden' }}>
        <Img src={ev.src} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${kb})` }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 5, background: RH_NEON, boxShadow: `0 0 18px ${RH_NEON}` }} />
      </div>
    </AbsoluteFill>
  );
};

// ─── Number badges (crisp code text, one at a time, top zone) ─────────────────────
const Badges: React.FC<{ t: number; fps: number }> = ({ t, fps }) => (
  <AbsoluteFill style={{ zIndex: 130 }}>
    {BADGES_RHFG.map((b, i) => {
      if (t < b.tIn - 0.1 || t >= b.tOut + 0.1) return null;
      const op = fadeInOut(t, b.tIn, b.tOut, 0.16);
      const sc = spring({ frame: Math.round((t - b.tIn) * fps), fps, config: { damping: 13, stiffness: 340 }, from: 0.55, to: 1.0 });
      const color = b.color === 'yellow' ? YELLOW : GREEN;
      return (
        <div key={i} style={{
          position: 'absolute', top: 300, left: '50%', transform: `translate(-50%,-50%) scale(${sc})`,
          opacity: op, background: 'rgba(0,0,0,0.82)', border: `6px solid ${color}`, borderRadius: 26,
          padding: '22px 54px', textAlign: 'center', boxShadow: `0 0 56px ${color}aa`,
        }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 104, color, lineHeight: 0.92, textShadow: `0 0 30px ${color}` }}>{b.big}</div>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, color: '#fff', letterSpacing: '0.14em', marginTop: 10, opacity: 0.92 }}>{b.sub}</div>
        </div>
      );
    })}
  </AbsoluteFill>
);

// ─── Word-by-word captions (in the seam band) ─────────────────────────────────────
const Caption: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / RHFG_FPS;
  let idx = 0, html = '';
  for (let i = CAPTIONS_RHFG.length - 1; i >= 0; i--) {
    if (t >= CAPTIONS_RHFG[i].t) { idx = i; html = CAPTIONS_RHFG[i].h; break; }
  }
  if (!html) return null;
  const startFrame = Math.round((CAPTIONS_RHFG[idx]?.t ?? 0) * RHFG_FPS);
  const scale = spring({ frame: frame - startFrame, fps: RHFG_FPS, config: { damping: 11, stiffness: 360 }, from: 0.72, to: 1.0 });
  return (
    <div style={{
      position: 'absolute', top: RHFG_CAP_Y, left: 46, right: 46,
      transform: 'translateY(-50%)', display: 'flex', justifyContent: 'center',
      zIndex: 150, pointerEvents: 'none',
    }}>
      <div style={{
        fontFamily: FONT, fontWeight: 900, fontSize: 74, color: '#fff',
        textTransform: 'lowercase', textAlign: 'center', letterSpacing: '0.01em',
        lineHeight: 1.04, WebkitTextStroke: '13px #000', paintOrder: 'stroke fill' as any,
        width: '100%', transform: `scale(${scale})`,
      }} dangerouslySetInnerHTML={{ __html: colourize(html) }} />
    </div>
  );
};

// ─── Frame-0 designed thumbnail cover (hook image + code headline + chip) ───────────
// SKILL Phase 7 rule #5: frame 0 = one designed scroll-stopping cover, then the video plays. Opaque
// at frame 0, quick fade so it is gone (~0.3s) before the opening captions read — never a held card.
const ThumbCover: React.FC<{ op: number }> = ({ op }) => (
  <AbsoluteFill style={{ zIndex: 400, opacity: op }}>
    <Img src={THUMB} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.15) 42%, rgba(0,0,0,0.82) 100%)' }} />
    <div style={{ position: 'absolute', top: 210, left: 54, right: 54, textAlign: 'center' }}>
      <div style={{
        fontFamily: FONT, fontWeight: 900, fontSize: 118, lineHeight: 0.98, color: '#fff',
        textTransform: 'uppercase', WebkitTextStroke: '5px #000', paintOrder: 'stroke fill' as any,
        textShadow: `0 0 44px ${RH_NEON}66`,
      }}>{THUMB_TITLE}</div>
      <div style={{
        marginTop: 40, display: 'inline-block', background: RH_NEON, color: '#0a1000',
        fontFamily: FONT, fontWeight: 900, fontSize: 52, letterSpacing: '0.04em',
        padding: '18px 40px', borderRadius: 18, boxShadow: `0 0 48px ${RH_NEON}`,
      }}>{THUMB_CHIP}</div>
    </div>
  </AbsoluteFill>
);

// ─── Main composition ─────────────────────────────────────────────────────────────
export const RobinhoodFloodgates: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / RHFG_FPS;
  const thumbOp = interpolate(frame, [0, 2, 9], [1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const thumbUp = frame < 9;

  return (
    <AbsoluteFill style={{ background: '#000', fontFamily: FONT, overflow: 'hidden' }}>

      {/* Layer 0 — composited livestream video (screen-share top + face bottom, carries VO audio) */}
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        <OffthreadVideo src={CLIP} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>

      {/* Layer 1 — b-roll (full-screen at hook / floodgates climax / six-billion button, zone on the app beat) */}
      <BrollLayer t={t} />

      {/* Layer 2 — caption legibility band straddling the seam */}
      <div style={{
        position: 'absolute', top: RHFG_SEAM - 96, left: 0, right: 0, height: 216, zIndex: 120,
        background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.72) 30%, rgba(0,0,0,0.72) 70%, rgba(0,0,0,0) 100%)',
      }} />

      {/* Layer 3 — number badges (suppressed while the thumbnail cover is up) */}
      {!thumbUp && <Badges t={t} fps={RHFG_FPS} />}

      {/* Layer 4 — word-by-word captions */}
      <Caption />

      {/* Layer 5 — frame-0 designed thumbnail cover (fades out over the first ~0.3s) */}
      {thumbUp && <ThumbCover op={thumbOp} />}

      {/* Layer 6 — SFX (whoosh / ting / riser / impacts / cash register), each under the VO */}
      {SFX_RHFG.map((s, i) => (
        <Sequence key={i} from={Math.round(s.t * RHFG_FPS)} durationInFrames={Math.max(1, Math.round(s.dur * RHFG_FPS))}>
          <Audio src={s.src} volume={s.vol} />
        </Sequence>
      ))}

    </AbsoluteFill>
  );
};

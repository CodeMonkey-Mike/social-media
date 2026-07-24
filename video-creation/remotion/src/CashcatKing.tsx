import React from 'react';
import {
  AbsoluteFill, OffthreadVideo, Img, Audio, Sequence,
  useCurrentFrame, interpolate, spring,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/Montserrat';
import { FONT, colourize } from './_kit';
import {
  CCK_FPS, CCK_SEAM, CCK_CAP_Y, CLIP, THUMB, THUMB_TITLE, THUMB_CHIP,
  CAPTIONS_CCK, BROLL_CCK, SFX_CCK,
} from './constants-cck';

// Register Montserrat 900 (captions + thumbnail headline) so text renders reliably.
loadFont('normal', { weights: ['900'], subsets: ['latin'], ignoreTooManyRequestsWarning: true });

// Robinhood brand neon lime green for the thumbnail chip / accents (persona robinhood_coin, not teal).
const RH_NEON = '#CCFF00';

// ─── B-roll layer (over the composited base video) ────────────────────────────────
// 'full' = whole frame; 'zone' = the top screen-share zone only (0..SEAM) so Mike's face stays
// visible below. No beats are adjacent, so each fades to/from the base (no full-to-full flash).
const BrollLayer: React.FC<{ t: number }> = ({ t }) => {
  const idx = BROLL_CCK.findIndex(e => t >= e.tIn && t < e.tOut);
  if (idx < 0) return null;
  const ev = BROLL_CCK[idx];
  const F = 0.12, EPS = 0.18;
  const prevAdj = BROLL_CCK.some((o, i) => i !== idx && Math.abs(o.tOut - ev.tIn) <= EPS);
  const nextAdj = BROLL_CCK.some((o, i) => i !== idx && Math.abs(o.tIn - ev.tOut) <= EPS);
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
      <div style={{ position: 'absolute', top: 0, left: 0, width: 1080, height: CCK_SEAM, overflow: 'hidden' }}>
        <Img src={ev.src} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${kb})` }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 5, background: RH_NEON, boxShadow: `0 0 18px ${RH_NEON}` }} />
      </div>
    </AbsoluteFill>
  );
};

// ─── Word-by-word captions (in the seam band) ─────────────────────────────────────
const Caption: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / CCK_FPS;
  let idx = 0, html = '';
  for (let i = CAPTIONS_CCK.length - 1; i >= 0; i--) {
    if (t >= CAPTIONS_CCK[i].t) { idx = i; html = CAPTIONS_CCK[i].h; break; }
  }
  if (!html) return null;
  const startFrame = Math.round((CAPTIONS_CCK[idx]?.t ?? 0) * CCK_FPS);
  const scale = spring({ frame: frame - startFrame, fps: CCK_FPS, config: { damping: 11, stiffness: 360 }, from: 0.72, to: 1.0 });
  return (
    <div style={{
      position: 'absolute', top: CCK_CAP_Y, left: 46, right: 46,
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
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.10) 34%, rgba(0,0,0,0.20) 62%, rgba(0,0,0,0.86) 100%)' }} />
    {/* Headline at top, chip near the bottom — so the king mascot's face stays visible between them. */}
    <div style={{ position: 'absolute', top: 92, left: 50, right: 50, textAlign: 'center' }}>
      <div style={{
        fontFamily: FONT, fontWeight: 900, fontSize: 122, lineHeight: 0.98, color: '#fff',
        textTransform: 'uppercase', WebkitTextStroke: '5px #000', paintOrder: 'stroke fill' as any,
        textShadow: `0 0 44px ${RH_NEON}66`,
      }}>{THUMB_TITLE}</div>
    </div>
    <div style={{ position: 'absolute', bottom: 420, left: 0, right: 0, textAlign: 'center' }}>
      <div style={{
        display: 'inline-block', background: RH_NEON, color: '#0a1000',
        fontFamily: FONT, fontWeight: 900, fontSize: 58, letterSpacing: '0.04em',
        padding: '20px 48px', borderRadius: 18, boxShadow: `0 0 48px ${RH_NEON}`,
      }}>{THUMB_CHIP}</div>
    </div>
  </AbsoluteFill>
);

// ─── Main composition ─────────────────────────────────────────────────────────────
export const CashcatKing: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / CCK_FPS;
  const thumbOp = interpolate(frame, [0, 2, 9], [1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const thumbUp = frame < 9;

  return (
    <AbsoluteFill style={{ background: '#000', fontFamily: FONT, overflow: 'hidden' }}>

      {/* Layer 0 — composited livestream video (screen-share top + face bottom, carries VO audio) */}
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        <OffthreadVideo src={CLIP} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>

      {/* Layer 1 — b-roll (full-screen at hook / rally peak / very-strong-play climax; zone on the
          outshines / CoinMarketCap / 12-CEX / fair-launch receipt cutaways) */}
      <BrollLayer t={t} />

      {/* Layer 2 — caption legibility band straddling the seam */}
      <div style={{
        position: 'absolute', top: CCK_SEAM - 96, left: 0, right: 0, height: 216, zIndex: 120,
        background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.72) 30%, rgba(0,0,0,0.72) 70%, rgba(0,0,0,0) 100%)',
      }} />

      {/* Layer 3 — word-by-word captions */}
      <Caption />

      {/* Layer 4 — frame-0 designed thumbnail cover (fades out over the first ~0.3s) */}
      {thumbUp && <ThumbCover op={thumbOp} />}

      {/* Layer 5 — SFX (whoosh / ting / riser / boom / impacts / cash register), each under the VO */}
      {SFX_CCK.map((s, i) => (
        <Sequence key={i} from={Math.round(s.t * CCK_FPS)} durationInFrames={Math.max(1, Math.round(s.dur * CCK_FPS))}>
          <Audio src={s.src} volume={s.vol} />
        </Sequence>
      ))}

    </AbsoluteFill>
  );
};

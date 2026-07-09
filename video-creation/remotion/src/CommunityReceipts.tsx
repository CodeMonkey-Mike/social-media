import React from 'react';
import {
  AbsoluteFill, OffthreadVideo, Img, Audio, Sequence,
  useCurrentFrame, interpolate, spring,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/Montserrat';
import { FONT, TEAL, YELLOW, GREEN, colourize, fadeInOut } from './_kit';
import {
  CR_FPS, CR_SEAM, CR_CAP_Y, CLIP, THUMB,
  CAPTIONS_CR, BROLL_CR, BADGES_CR, SFX_CR,
} from './constants-creceipts';

// Register Montserrat 900 (captions + badges) so text renders reliably.
loadFont('normal', { weights: ['900'], subsets: ['latin'], ignoreTooManyRequestsWarning: true });

// ─── B-roll layer (over the composited base video) ────────────────────────────────
// 'full' = whole frame; 'zone' = the top screen-share zone only (0..CR_SEAM) so Mike's face
// stays visible below. Adjacent beats hard-cut (no base flash); isolated beats fade to/from base.
const BrollLayer: React.FC<{ t: number }> = ({ t }) => {
  const idx = BROLL_CR.findIndex(e => t >= e.tIn && t < e.tOut);
  if (idx < 0) return null;
  const ev = BROLL_CR[idx];
  const F = 0.12, EPS = 0.18;
  const prevAdj = BROLL_CR.some((o, i) => i !== idx && Math.abs(o.tOut - ev.tIn) <= EPS);
  const nextAdj = BROLL_CR.some((o, i) => i !== idx && Math.abs(o.tIn - ev.tOut) <= EPS);
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
      <div style={{ position: 'absolute', top: 0, left: 0, width: 1080, height: CR_SEAM, overflow: 'hidden' }}>
        <Img src={ev.src} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${kb})` }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 5, background: TEAL, boxShadow: `0 0 18px ${TEAL}` }} />
      </div>
    </AbsoluteFill>
  );
};

// ─── Multiplier badges (crisp code text, one at a time, top zone) ─────────────────
const Badges: React.FC<{ t: number; fps: number }> = ({ t, fps }) => (
  <AbsoluteFill style={{ zIndex: 130 }}>
    {BADGES_CR.map((b, i) => {
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
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 108, color, lineHeight: 0.92, textShadow: `0 0 30px ${color}` }}>{b.big}</div>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, color: '#fff', letterSpacing: '0.14em', marginTop: 10, opacity: 0.92 }}>{b.sub}</div>
        </div>
      );
    })}
  </AbsoluteFill>
);

// ─── Word-by-word captions (in the seam band) ─────────────────────────────────────
const Caption: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / CR_FPS;
  let idx = 0, html = '';
  for (let i = CAPTIONS_CR.length - 1; i >= 0; i--) {
    if (t >= CAPTIONS_CR[i].t) { idx = i; html = CAPTIONS_CR[i].h; break; }
  }
  if (!html) return null;
  const startFrame = Math.round((CAPTIONS_CR[idx]?.t ?? 0) * CR_FPS);
  const scale = spring({ frame: frame - startFrame, fps: CR_FPS, config: { damping: 11, stiffness: 360 }, from: 0.72, to: 1.0 });
  return (
    <div style={{
      position: 'absolute', top: CR_CAP_Y, left: 46, right: 46,
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

// ─── Main composition ─────────────────────────────────────────────────────────────
export const CommunityReceipts: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / CR_FPS;
  // Frame-0 designed-thumbnail cover (SKILL Phase 7 rule): opaque at frame 0, quick fade so it
  // is gone before the opening captions read — never held over the captions.
  const thumbOp = interpolate(frame, [0, 2, 8], [1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const thumbUp = frame < 8;

  return (
    <AbsoluteFill style={{ background: '#000', fontFamily: FONT, overflow: 'hidden' }}>

      {/* Layer 0 — composited livestream video (screen-share top + face bottom, carries VO audio) */}
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        <OffthreadVideo src={CLIP} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>

      {/* Layer 1 — b-roll (full-screen at peaks, zone coin-cards on the receipts) */}
      <BrollLayer t={t} />

      {/* Layer 2 — caption legibility band straddling the seam */}
      <div style={{
        position: 'absolute', top: CR_SEAM - 96, left: 0, right: 0, height: 216, zIndex: 120,
        background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.72) 30%, rgba(0,0,0,0.72) 70%, rgba(0,0,0,0) 100%)',
      }} />

      {/* Layer 3 — multiplier badges (suppressed while the thumbnail cover is up) */}
      {!thumbUp && <Badges t={t} fps={CR_FPS} />}

      {/* Layer 4 — word-by-word captions */}
      <Caption />

      {/* Layer 5 — frame-0 thumbnail cover (fades out over the first ~0.27s) */}
      {thumbUp && (
        <AbsoluteFill style={{ zIndex: 400, opacity: thumbOp }}>
          <Img src={THUMB} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </AbsoluteFill>
      )}

      {/* Layer 6 — SFX (whoosh / riser / impacts / dings), each under the VO */}
      {SFX_CR.map((s, i) => (
        <Sequence key={i} from={Math.round(s.t * CR_FPS)} durationInFrames={Math.max(1, Math.round(s.dur * CR_FPS))}>
          <Audio src={s.src} volume={s.vol} />
        </Sequence>
      ))}

    </AbsoluteFill>
  );
};

import React from 'react';
import {
  AbsoluteFill, OffthreadVideo, Img, Audio, Sequence,
  useCurrentFrame, interpolate, spring,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/Montserrat';
import { FONT, TEAL, colourize } from './_kit';
import {
  FYCI_FPS, FYCI_SEAM, FYCI_CAP_Y, CLIP_FYCI, THUMB_FYCI,
  CAPTIONS_FYCI, BROLL_FYCI, SFX_FYCI,
} from './constants-fyci';

// Register Montserrat 900 (captions) so text renders reliably.
loadFont('normal', { weights: ['900'], subsets: ['latin'], ignoreTooManyRequestsWarning: true });

// ─── B-roll layer (over the composited base video) ────────────────────────────────
// 'full' = whole frame; 'zone' = the top screen-share zone only (0..FYCI_SEAM) so Mike's face
// stays visible below. Adjacent beats hard-cut (no base flash); isolated beats fade to/from base.
// For this ultra-lean cut every beat uses the SAME image (broll-psb-religion.png) and every edge is
// adjacent, so the top zone is continuously covered — the @Pygoz comment is never exposed.
const BrollLayer: React.FC<{ t: number }> = ({ t }) => {
  const idx = BROLL_FYCI.findIndex(e => t >= e.tIn && t < e.tOut);
  if (idx < 0) return null;
  const ev = BROLL_FYCI[idx];
  const F = 0.12, EPS = 0.18;
  const prevAdj = BROLL_FYCI.some((o, i) => i !== idx && Math.abs(o.tOut - ev.tIn) <= EPS);
  const nextAdj = BROLL_FYCI.some((o, i) => i !== idx && Math.abs(o.tIn - ev.tOut) <= EPS);
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
      <div style={{ position: 'absolute', top: 0, left: 0, width: 1080, height: FYCI_SEAM, overflow: 'hidden' }}>
        <Img src={ev.src} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${kb})` }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 5, background: TEAL, boxShadow: `0 0 18px ${TEAL}` }} />
      </div>
    </AbsoluteFill>
  );
};

// ─── Word-by-word captions (in the seam band) ─────────────────────────────────────
const Caption: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FYCI_FPS;
  let idx = 0, html = '';
  for (let i = CAPTIONS_FYCI.length - 1; i >= 0; i--) {
    if (t >= CAPTIONS_FYCI[i].t) { idx = i; html = CAPTIONS_FYCI[i].h; break; }
  }
  if (!html) return null;
  const startFrame = Math.round((CAPTIONS_FYCI[idx]?.t ?? 0) * FYCI_FPS);
  const scale = spring({ frame: frame - startFrame, fps: FYCI_FPS, config: { damping: 11, stiffness: 360 }, from: 0.72, to: 1.0 });
  return (
    <div style={{
      position: 'absolute', top: FYCI_CAP_Y, left: 46, right: 46,
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
export const FourYearCycleReligionImpact: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FYCI_FPS;
  // Frame-0 designed-thumbnail cover (SKILL Phase 7 rule): opaque at frame 0, then a quick fade so
  // it is gone before the opening captions read — never held over the captions.
  const thumbOp = interpolate(frame, [0, 2, 8], [1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const thumbUp = frame < 8;

  return (
    <AbsoluteFill style={{ background: '#000', fontFamily: FONT, overflow: 'hidden' }}>

      {/* Layer 0 — the already-composited livestream video (screen top + face bottom, carries audio) */}
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        <OffthreadVideo src={CLIP_FYCI} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>

      {/* Layer 1 — b-roll (full-screen over the religious/doctrine peak, zone cover on the static chart + hidden @Pygoz comment otherwise) */}
      <BrollLayer t={t} />

      {/* Layer 2 — caption legibility band straddling the seam */}
      <div style={{
        position: 'absolute', top: FYCI_SEAM - 96, left: 0, right: 0, height: 216, zIndex: 120,
        background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.72) 30%, rgba(0,0,0,0.72) 70%, rgba(0,0,0,0) 100%)',
      }} />

      {/* Layer 3 — word-by-word captions */}
      <Caption />

      {/* Layer 4 — frame-0 thumbnail cover (fades out over the first ~0.27s) */}
      {thumbUp && (
        <AbsoluteFill style={{ zIndex: 400, opacity: thumbOp }}>
          <Img src={THUMB_FYCI} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </AbsoluteFill>
      )}

      {/* Layer 5 — SFX (whoosh / riser / impacts), each under the VO */}
      {SFX_FYCI.map((s, i) => (
        <Sequence key={i} from={Math.round(s.t * FYCI_FPS)} durationInFrames={Math.max(1, Math.round(s.dur * FYCI_FPS))}>
          <Audio src={s.src} volume={s.vol} />
        </Sequence>
      ))}

    </AbsoluteFill>
  );
};

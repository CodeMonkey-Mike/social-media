import React from 'react';
import {
  AbsoluteFill, OffthreadVideo, Img, Audio, Sequence,
  useCurrentFrame, interpolate, spring,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/Montserrat';
import { FONT, TEAL, colourize } from './_kit';
import {
  CRI_FPS, CRI_SEAM, CRI_CAP_Y, CLIP_I, THUMB_I,
  CAPTIONS_CRI, BROLL_CRI, SFX_CRI,
} from './constants-creceipts-impact';

// Register Montserrat (only the 900 weight the captions use) so text renders reliably.
loadFont('normal', { weights: ['900'], subsets: ['latin'], ignoreTooManyRequestsWarning: true });

// ─── B-roll layer (over the composited base video) ────────────────────────────────
// 'full' = whole frame (hook + climax here); 'zone' = the top screen-share zone only
// (0..CRI_SEAM) so Mike's face stays visible below. Adjacent beats hard-cut (no base flash);
// isolated beats fade to/from base. Modeled 1:1 on the QA-approved CommunityReceipts full cut.
const BrollLayer: React.FC<{ t: number }> = ({ t }) => {
  const idx = BROLL_CRI.findIndex(e => t >= e.tIn && t < e.tOut);
  if (idx < 0) return null;
  const ev = BROLL_CRI[idx];
  const F = 0.12, EPS = 0.18;
  const prevAdj = BROLL_CRI.some((o, i) => i !== idx && Math.abs(o.tOut - ev.tIn) <= EPS);
  const nextAdj = BROLL_CRI.some((o, i) => i !== idx && Math.abs(o.tIn - ev.tOut) <= EPS);
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
      <div style={{ position: 'absolute', top: 0, left: 0, width: 1080, height: CRI_SEAM, overflow: 'hidden' }}>
        <Img src={ev.src} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${kb})` }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 5, background: TEAL, boxShadow: `0 0 18px ${TEAL}` }} />
      </div>
    </AbsoluteFill>
  );
};

// ─── Word-by-word captions (in the seam band) ─────────────────────────────────────
const Caption: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / CRI_FPS;
  let idx = 0, html = '';
  for (let i = CAPTIONS_CRI.length - 1; i >= 0; i--) {
    if (t >= CAPTIONS_CRI[i].t) { idx = i; html = CAPTIONS_CRI[i].h; break; }
  }
  if (!html) return null;
  const startFrame = Math.round((CAPTIONS_CRI[idx]?.t ?? 0) * CRI_FPS);
  const scale = spring({ frame: frame - startFrame, fps: CRI_FPS, config: { damping: 11, stiffness: 360 }, from: 0.72, to: 1.0 });
  return (
    <div style={{
      position: 'absolute', top: CRI_CAP_Y, left: 46, right: 46,
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
export const CommunityReceiptsImpact: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / CRI_FPS;
  // Frame-0 designed-thumbnail cover (SKILL Phase 7 rule): opaque at frame 0, then a quick fade
  // so it is gone before the opening captions read. Kept short (~8 frames) so it does not eat
  // this tiny ~15s clip.
  const thumbOp = interpolate(frame, [0, 2, 8], [1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const thumbUp = frame < 8;

  return (
    <AbsoluteFill style={{ background: '#000', fontFamily: FONT, overflow: 'hidden' }}>

      {/* Layer 0 — the already-composited livestream video (screen top + face bottom, carries audio) */}
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        <OffthreadVideo src={CLIP_I} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>

      {/* Layer 1 — b-roll (full-screen mystery at the hook, 500x rocket at the climax) */}
      <BrollLayer t={t} />

      {/* Layer 2 — caption legibility band straddling the seam */}
      <div style={{
        position: 'absolute', top: CRI_SEAM - 96, left: 0, right: 0, height: 216, zIndex: 120,
        background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.72) 30%, rgba(0,0,0,0.72) 70%, rgba(0,0,0,0) 100%)',
      }} />

      {/* Layer 3 — word-by-word captions */}
      <Caption />

      {/* Layer 4 — frame-0 thumbnail cover (fades out over the first ~0.27s) */}
      {thumbUp && (
        <AbsoluteFill style={{ zIndex: 400, opacity: thumbOp }}>
          <Img src={THUMB_I} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </AbsoluteFill>
      )}

      {/* Layer 5 — SFX (whoosh / riser / impact), each under the VO */}
      {SFX_CRI.map((s, i) => (
        <Sequence key={i} from={Math.round(s.t * CRI_FPS)} durationInFrames={Math.max(1, Math.round(s.dur * CRI_FPS))}>
          <Audio src={s.src} volume={s.vol} />
        </Sequence>
      ))}

    </AbsoluteFill>
  );
};

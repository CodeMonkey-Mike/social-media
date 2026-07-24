import React from 'react';
import {
  AbsoluteFill, OffthreadVideo, Img, Audio, Sequence,
  useCurrentFrame, interpolate, spring,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/Montserrat';
import { FONT, TEAL, colourize, fadeInOut } from './_kit';
import {
  MAM_FPS, MAM_SEAM, MAM_CAP_Y, CLIP_MAM, THUMB_MAM,
  CAPTIONS_MAM, BROLL_MAM, BADGES_MAM, SFX_MAM,
} from './constants-mam';

// Register Montserrat 900 (captions + badges) so text renders reliably.
loadFont('normal', { weights: ['900'], subsets: ['latin'], ignoreTooManyRequestsWarning: true });

// ─── B-roll layer (over the composited base video) ────────────────────────────────
// 'full' = whole frame; 'zone' = the top screen-share zone only (0..MAM_SEAM) so Mike's face
// stays visible below. Adjacent beats hard-cut (no base flash); isolated beats fade to/from base.
const BrollLayer: React.FC<{ t: number }> = ({ t }) => {
  const idx = BROLL_MAM.findIndex(e => t >= e.tIn && t < e.tOut);
  if (idx < 0) return null;
  const ev = BROLL_MAM[idx];
  const F = 0.12, EPS = 0.18;
  const prevAdj = BROLL_MAM.some((o, i) => i !== idx && Math.abs(o.tOut - ev.tIn) <= EPS);
  const nextAdj = BROLL_MAM.some((o, i) => i !== idx && Math.abs(o.tIn - ev.tOut) <= EPS);
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
      <div style={{ position: 'absolute', top: 0, left: 0, width: 1080, height: MAM_SEAM, overflow: 'hidden' }}>
        <Img src={ev.src} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${kb})` }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 5, background: TEAL, boxShadow: `0 0 18px ${TEAL}` }} />
      </div>
    </AbsoluteFill>
  );
};

// ─── Badges (crisp code text, one at a time, top zone y300) ───────────────────────
const Badges: React.FC<{ t: number; fps: number }> = ({ t, fps }) => (
  <AbsoluteFill style={{ zIndex: 130 }}>
    {BADGES_MAM.map((b, i) => {
      if (t < b.tIn - 0.1 || t >= b.tOut + 0.1) return null;
      const op = fadeInOut(t, b.tIn, b.tOut, 0.16);
      const sc = spring({ frame: Math.round((t - b.tIn) * fps), fps, config: { damping: 13, stiffness: 340 }, from: 0.55, to: 1.0 });
      return (
        <div key={i} style={{
          position: 'absolute', top: 300, left: '50%', transform: `translate(-50%,-50%) scale(${sc})`,
          opacity: op, background: 'rgba(0,0,0,0.82)', border: `6px solid ${b.color}`, borderRadius: 26,
          padding: '22px 54px', textAlign: 'center', boxShadow: `0 0 56px ${b.color}aa`,
        }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 96, color: b.color, lineHeight: 0.92, textShadow: `0 0 30px ${b.color}` }}>{b.big}</div>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, color: '#fff', letterSpacing: '0.14em', marginTop: 10, opacity: 0.92, whiteSpace: 'nowrap' }}>{b.sub}</div>
        </div>
      );
    })}
  </AbsoluteFill>
);

// ─── Word-by-word captions (in the seam band) ─────────────────────────────────────
// HOUSE STYLE — copied verbatim from the exemplar (SmkFull.tsx / FourYearCycleReligion.tsx and the
// captions.md `montserrat` preset): LOWERCASE, word-level chunks, Montserrat/Arial Black 900, thick
// black stroke, pop-in. NEVER textTransform:'uppercase' (that was the zebec ALL-CAPS regression).
const Caption: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / MAM_FPS;
  let idx = 0, html = '';
  for (let i = CAPTIONS_MAM.length - 1; i >= 0; i--) {
    if (t >= CAPTIONS_MAM[i].t) { idx = i; html = CAPTIONS_MAM[i].h; break; }
  }
  if (!html) return null;
  const startFrame = Math.round((CAPTIONS_MAM[idx]?.t ?? 0) * MAM_FPS);
  const scale = spring({ frame: frame - startFrame, fps: MAM_FPS, config: { damping: 11, stiffness: 360 }, from: 0.72, to: 1.0 });
  return (
    <div style={{
      position: 'absolute', top: MAM_CAP_Y, left: 46, right: 46,
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
export const MillionairesAreMade: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / MAM_FPS;
  // FRAME-0 COVER (SKILL Phase 7 rule #5 + the canonical LivestreamShort default `thumb.durS ?? 1/fps`):
  // the designed thumb is the IG/TikTok cover = **frame 0 ONLY**, base video from frame 1. It is NOT a
  // held card: the deprecated multi-frame hold overlays the title on the opening captions (the first
  // caption starts at t=0.24 = frame 7, so the old `frame < 8` fade held it straight over that caption).
  const thumbUp = frame === 0;

  return (
    <AbsoluteFill style={{ background: '#000', fontFamily: FONT, overflow: 'hidden' }}>

      {/* Layer 0 — the already-composited livestream video (bubble map top + face bottom, carries audio) */}
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        <OffthreadVideo src={CLIP_MAM} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>

      {/* Layer 1 — b-roll (full-screen at hook/peaks/receipt/climax, zone cover elsewhere; 64% coverage) */}
      <BrollLayer t={t} />

      {/* Layer 2 — caption legibility band straddling the seam */}
      <div style={{
        position: 'absolute', top: MAM_SEAM - 96, left: 0, right: 0, height: 216, zIndex: 120,
        background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.72) 30%, rgba(0,0,0,0.72) 70%, rgba(0,0,0,0) 100%)',
      }} />

      {/* Layer 3 — badges (suppressed while the thumbnail cover is up; band y300, captions live at y872) */}
      {!thumbUp && <Badges t={t} fps={MAM_FPS} />}

      {/* Layer 4 — word-by-word captions */}
      <Caption />

      {/* Layer 5 — frame-0 thumbnail cover (ONE frame; base video runs from frame 1) */}
      {thumbUp && (
        <AbsoluteFill style={{ zIndex: 400 }}>
          <Img src={THUMB_MAM} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </AbsoluteFill>
      )}

      {/* Layer 6 — SFX (whooshes / risers / impacts / kaching), each under the VO */}
      {SFX_MAM.map((s, i) => (
        <Sequence key={i} from={Math.round(s.t * MAM_FPS)} durationInFrames={Math.max(1, Math.round(s.dur * MAM_FPS))}>
          <Audio src={s.src} volume={s.vol} />
        </Sequence>
      ))}

    </AbsoluteFill>
  );
};

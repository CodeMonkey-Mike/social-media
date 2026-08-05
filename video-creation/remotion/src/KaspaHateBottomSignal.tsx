import React from 'react';
import {
  AbsoluteFill, OffthreadVideo, Img, Audio, Sequence,
  useCurrentFrame, spring,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/Montserrat';
// SHARED b-roll-capable kit (same components LivestreamShort is built from) — BrollLayer does the
// full/content zone switch + hard-cut adjacency, Thumb is the house frame-0 cover card.
import { BrollLayer, Thumb, FONT, TEAL, colourize, fadeInOut } from './_kit';
import {
  PM3_FPS, PM3_DURATION, PM3_SEAM, PM3_CAP_Y,
  CLIP_PM3, THUMB_PM3, LOGO_PM3, PM3_THUMB_TITLE, PM3_THUMB_CHIP,
  CAPTIONS_PM3, BROLL_PM3, BADGES_PM3, SFX_PM3,
} from './constants-pm3';

// Register Montserrat 900 (captions + badges + cover title) so text renders reliably.
loadFont('normal', { weights: ['900'], subsets: ['latin'], ignoreTooManyRequestsWarning: true });

// ─── Badges (crisp code text, ONE vertical band at y300, one at a time) ───────────────────────────
const Badges: React.FC<{ t: number; fps: number }> = ({ t, fps }) => (
  <AbsoluteFill style={{ zIndex: 130 }}>
    {BADGES_PM3.map((b, i) => {
      if (t < b.tIn - 0.1 || t >= b.tOut + 0.1) return null;
      const op = fadeInOut(t, b.tIn, b.tOut, 0.16);
      const sc = spring({ frame: Math.round((t - b.tIn) * fps), fps, config: { damping: 13, stiffness: 340 }, from: 0.55, to: 1.0 });
      return (
        <div key={i} style={{
          position: 'absolute', top: 300, left: '50%', transform: `translate(-50%,-50%) scale(${sc})`,
          opacity: op, background: 'rgba(0,0,0,0.82)', border: `6px solid ${b.color}`, borderRadius: 26,
          padding: '22px 54px', textAlign: 'center', boxShadow: `0 0 56px ${b.color}aa`,
        }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 96, color: b.color, lineHeight: 0.92, textShadow: `0 0 30px ${b.color}`, whiteSpace: 'nowrap' }}>{b.big}</div>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, color: '#fff', letterSpacing: '0.14em', marginTop: 10, opacity: 0.92, whiteSpace: 'nowrap' }}>{b.sub}</div>
        </div>
      );
    })}
  </AbsoluteFill>
);

// ─── Word-by-word captions (in the band just BELOW the seam) ─────────────────────────────────────
// HOUSE STYLE, captions.md `montserrat` preset: LOWERCASE, 2-3 word chunks, Montserrat 900,
// 13px black stroke, pop-in. NEVER textTransform:'uppercase'.
const Caption: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / PM3_FPS;
  let idx = 0, html = '';
  for (let i = CAPTIONS_PM3.length - 1; i >= 0; i--) {
    if (t >= CAPTIONS_PM3[i].t) { idx = i; html = CAPTIONS_PM3[i].h; break; }
  }
  if (!html) return null;
  const startFrame = Math.round((CAPTIONS_PM3[idx]?.t ?? 0) * PM3_FPS);
  const scale = spring({ frame: frame - startFrame, fps: PM3_FPS, config: { damping: 11, stiffness: 360 }, from: 0.72, to: 1.0 });
  return (
    <div style={{
      position: 'absolute', top: PM3_CAP_Y, left: 50, right: 50,
      transform: 'translateY(-50%)', display: 'flex', justifyContent: 'center',
      zIndex: 150, pointerEvents: 'none',
    }}>
      <div style={{
        fontFamily: FONT, fontWeight: 900, fontSize: 74, color: '#fff',
        textTransform: 'lowercase', textAlign: 'center', letterSpacing: '0.01em',
        lineHeight: 1.04, WebkitTextStroke: '13px #000', paintOrder: 'stroke fill' as any,
        width: '100%', whiteSpace: 'nowrap', transform: `scale(${scale})`,
      }} dangerouslySetInnerHTML={{ __html: colourize(html) }} />
    </div>
  );
};

// ─── Main composition ─────────────────────────────────────────────────────────────────────────────
export const KaspaHateBottomSignal: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / PM3_FPS;
  // FRAME-0 COVER (SKILL Phase 7 rule #5 + the LivestreamShort default `thumb.durS ?? 1/fps`): the
  // designed cover is the IG/TikTok thumbnail = frame 0 ONLY, base video from frame 1. NOT a held card.
  const thumbUp = frame === 0;

  return (
    <AbsoluteFill style={{ background: '#000', fontFamily: FONT, overflow: 'hidden' }}>

      {/* Layer 0 — the already-composited livestream spine (Kaspa scenario slide top + face bottom, carries the audio) */}
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        <OffthreadVideo src={CLIP_PM3} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>

      {/* Layer 1 — b-roll (SHARED _kit BrollLayer): full at hook + climax, content-zone elsewhere, 32.1% coverage */}
      <AbsoluteFill style={{ zIndex: 60 }}>
        <BrollLayer broll={BROLL_PM3} t={t} seam={PM3_SEAM} />
      </AbsoluteFill>

      {/* Layer 2 — caption legibility band, centred on PM3_CAP_Y (below the seam) */}
      <div style={{
        position: 'absolute', top: PM3_CAP_Y - 96, left: 0, right: 0, height: 192, zIndex: 120,
        background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0) 100%)',
      }} />

      {/* Layer 3 — badges (suppressed while the frame-0 cover is up; band y300, captions live at y905) */}
      {!thumbUp && <Badges t={t} fps={PM3_FPS} />}

      {/* Layer 4 — word-by-word captions */}
      <Caption />

      {/* Layer 5 — frame-0 cover: generated art + CODE-DRAWN title/chip (never baked into the art) */}
      {thumbUp && (
        <AbsoluteFill style={{ zIndex: 400 }}>
          <Img src={THUMB_PM3} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <Thumb
            op={1}
            title={<span dangerouslySetInnerHTML={{ __html: PM3_THUMB_TITLE.replace(/\n/g, '<br/>') }} />}
            chip={PM3_THUMB_CHIP}
            chipColor={TEAL}
            titleSize={90}
          />
        </AbsoluteFill>
      )}

      {/* Layer 6 — persistent brand watermark: the REAL Kaspa coin asset, top-left. Per SKILL rule 3
          the corner watermark is the ONLY graphic allowed over the frame-0 cover, so z is above it. */}
      <Img src={LOGO_PM3} style={{
        position: 'absolute', top: 28, left: 28, width: 112, height: 112, borderRadius: '50%',
        filter: `drop-shadow(0 0 14px ${TEAL}aa)`, zIndex: 500,
      }} />

      {/* Layer 7 — SFX (whooshes / impacts / riser / boom), each mixed under the VO */}
      {SFX_PM3.map((s, i) => (
        <Sequence key={i} from={Math.round(s.t * PM3_FPS)} durationInFrames={Math.max(1, Math.round(s.dur * PM3_FPS))}>
          <Audio src={s.src} volume={s.vol} />
        </Sequence>
      ))}

    </AbsoluteFill>
  );
};

export const KASPA_HATE_BOTTOM_SIGNAL_DURATION = PM3_DURATION;

import React from 'react';
import {
  AbsoluteFill, OffthreadVideo, Img, Audio, Sequence,
  useCurrentFrame, interpolate, spring,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/Montserrat';
import { FONT, TEAL, colourize, fadeInOut } from './_kit';
import {
  TBTD_FPS, TBTD_SEAM, TBTD_CAP_Y, CLIP_TBTD, THUMB_TBTD,
  THUMB_TBTD_TITLE, THUMB_TBTD_CHIP,
  CAPTIONS_TBTD, BROLL_TBTD, BADGES_TBTD, SFX_TBTD,
} from './constants-tbtd';

// Register Montserrat 900 (captions + badges + thumb) so text renders reliably.
loadFont('normal', { weights: ['900'], subsets: ['latin'], ignoreTooManyRequestsWarning: true });

const GOLD = '#ffb400';   // TAO — the hero colour of this clip
const RED_HOT = '#ff3b3b'; // the market bleed (thumbnail "CRAP" line)

// ─── B-roll layer (over the composited base video) ─────────────────────────────────────────────────
// 'full' = whole frame (hook / THE BUY climax);
// 'zone' = the top screen-share zone only (0..TBTD_SEAM) so Mike's face keeps playing below, and the
// off-message Kraken Card ad / search modal / loading spinners never show. Adjacent beats HARD-CUT (no
// base flash); isolated beats fade to/from the base, which is a DELIBERATE reveal of the screen-share
// receipts. `focus` biases the zone crop (see constants: the 941x1672 art cover-fit into 1080x854 only
// shows the middle band, so a low-sitting subject would be chopped).
const BrollLayer: React.FC<{ t: number }> = ({ t }) => {
  const idx = BROLL_TBTD.findIndex(e => t >= e.tIn && t < e.tOut);
  if (idx < 0) return null;
  const ev = BROLL_TBTD[idx];
  const F = 0.12, EPS = 0.18;
  const prevAdj = BROLL_TBTD.some((o, i) => i !== idx && Math.abs(o.tOut - ev.tIn) <= EPS);
  const nextAdj = BROLL_TBTD.some((o, i) => i !== idx && Math.abs(o.tIn - ev.tOut) <= EPS);
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
      <div style={{ position: 'absolute', top: 0, left: 0, width: 1080, height: TBTD_SEAM, overflow: 'hidden' }}>
        <Img src={ev.src} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: ev.focus ?? 'center', transform: `scale(${kb})` }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 5, background: TEAL, boxShadow: `0 0 18px ${TEAL}` }} />
      </div>
    </AbsoluteFill>
  );
};

// ─── Badges (crisp code text, one at a time, top zone y300) ────────────────────────────────────────
// The "$199" callback: once on the dip, once on the buy. Both live in the SAME band so they can never
// collide, they are 28.7s apart in time, never sit over a full-screen beat, and are suppressed while
// the frame-0 thumbnail cover is up.
const Badges: React.FC<{ t: number; fps: number }> = ({ t, fps }) => (
  <AbsoluteFill style={{ zIndex: 130 }}>
    {BADGES_TBTD.map((b, i) => {
      if (t < b.tIn - 0.1 || t >= b.tOut + 0.1) return null;
      const op = fadeInOut(t, b.tIn, b.tOut, 0.16);
      const sc = spring({ frame: Math.round((t - b.tIn) * fps), fps, config: { damping: 13, stiffness: 340 }, from: 0.55, to: 1.0 });
      return (
        <div key={i} style={{
          position: 'absolute', top: 300, left: '50%', transform: `translate(-50%,-50%) scale(${sc})`,
          opacity: op, background: 'rgba(0,0,0,0.82)', border: `6px solid ${GOLD}`, borderRadius: 26,
          padding: '22px 54px', textAlign: 'center', boxShadow: `0 0 56px ${GOLD}aa`,
        }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 92, color: GOLD, lineHeight: 0.92, textShadow: `0 0 30px ${GOLD}`, whiteSpace: 'nowrap' }}>{b.big}</div>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, color: '#fff', letterSpacing: '0.14em', marginTop: 12, opacity: 0.92, whiteSpace: 'nowrap' }}>{b.sub}</div>
        </div>
      );
    })}
  </AbsoluteFill>
);

// ─── Word-by-word captions (in the seam band) ──────────────────────────────────────────────────────
// HOUSE STYLE, do not deviate: lowercase, Montserrat 900, 74px, 13px black stroke, paintOrder
// stroke fill, spring pop per chunk. Data comes from the canonical captions skill (montserrat preset).
const Caption: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / TBTD_FPS;
  let idx = 0, html = '';
  for (let i = CAPTIONS_TBTD.length - 1; i >= 0; i--) {
    if (t >= CAPTIONS_TBTD[i].t) { idx = i; html = CAPTIONS_TBTD[i].h; break; }
  }
  if (!html) return null;
  const startFrame = Math.round((CAPTIONS_TBTD[idx]?.t ?? 0) * TBTD_FPS);
  const scale = spring({ frame: frame - startFrame, fps: TBTD_FPS, config: { damping: 11, stiffness: 360 }, from: 0.72, to: 1.0 });
  return (
    <div style={{
      position: 'absolute', top: TBTD_CAP_Y, left: 46, right: 46,
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

// ─── Frame-0 thumbnail cover (the IG/TikTok cover — ONE FRAME, never a held card) ─────────────────
// Generated hero art + CODE-DRAWN hook text (SKILL: never bake text into a ChatGPT image). Frame 0
// only; from frame 1 the real video plays, base-first. The whoosh at t=0 covers the cut.
const Thumb: React.FC = () => (
  <AbsoluteFill style={{ zIndex: 400 }}>
    <Img src={THUMB_TBTD} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.28) 42%, rgba(0,0,0,0.55) 100%)' }} />
    <div style={{ position: 'absolute', top: 132, left: 52, right: 52, textAlign: 'center' }}>
      <div style={{
        fontFamily: FONT, fontWeight: 900, fontSize: 108, lineHeight: 0.96,
        textTransform: 'uppercase', WebkitTextStroke: '10px #000', paintOrder: 'stroke fill' as any,
        textShadow: '0 8px 40px rgba(0,0,0,0.85)', whiteSpace: 'nowrap',
      }}>
        {THUMB_TBTD_TITLE.map((line, i) => (
          <div key={i} style={{ color: line.red ? RED_HOT : '#fff' }}>{line.text}</div>
        ))}
      </div>
      {/* Chip: whiteSpace nowrap is LOAD-BEARING. At 50px this 27-char line wrapped to two lines and
          read as a full-width banner with an orphaned "$199" (caught on the frame-0 chunk render).
          Montserrat Black uppercase advances ~0.72em, so 27 * 0.72 * 44 = ~855px + 68px padding =
          ~923px, inside the 976px container (1080 - 2*52). Verified on a rendered still. */}
      <div style={{
        marginTop: 40, display: 'inline-block', background: GOLD, color: '#150c00',
        fontFamily: FONT, fontWeight: 900, fontSize: 44, letterSpacing: '0.02em',
        padding: '20px 34px', borderRadius: 18, boxShadow: `0 0 60px ${GOLD}`,
        textTransform: 'uppercase', border: '4px solid #000', whiteSpace: 'nowrap',
      }}>
        {THUMB_TBTD_CHIP}
      </div>
    </div>
  </AbsoluteFill>
);

// ─── Main composition ──────────────────────────────────────────────────────────────────────────────
export const TaoBuyTheDip: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / TBTD_FPS;
  // FRAME-0 COVER (SKILL Phase 7 rule #5 + feedback_thumb_frame0_cover): exactly ONE frame. Never a
  // held card over the opening captions.
  const thumbUp = frame < 1;

  return (
    <AbsoluteFill style={{ background: '#000', fontFamily: FONT, overflow: 'hidden' }}>

      {/* Layer 0 — the already-composited livestream video (screen-share top + face bottom, carries audio) */}
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        <OffthreadVideo src={CLIP_TBTD} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>

      {/* Layer 1 — b-roll (full-screen at hook/climax/climax; zone elsewhere; base shows on the 4 receipt beats) */}
      <BrollLayer t={t} />

      {/* Layer 2 — caption legibility band straddling the seam */}
      <div style={{
        position: 'absolute', top: TBTD_SEAM - 96, left: 0, right: 0, height: 216, zIndex: 120,
        background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.72) 30%, rgba(0,0,0,0.72) 70%, rgba(0,0,0,0) 100%)',
      }} />

      {/* Layer 3 — badges (suppressed while the thumbnail cover is up) */}
      {!thumbUp && <Badges t={t} fps={TBTD_FPS} />}

      {/* Layer 4 — word-by-word captions */}
      <Caption />

      {/* Layer 5 — frame-0 thumbnail cover */}
      {thumbUp && <Thumb />}

      {/* Layer 6 — SFX (whooshes / risers / impacts / kaching / ding), each under the VO */}
      {SFX_TBTD.map((s, i) => (
        <Sequence key={i} from={Math.round(s.t * TBTD_FPS)} durationInFrames={Math.max(1, Math.round(s.dur * TBTD_FPS))}>
          <Audio src={s.src} volume={s.vol} />
        </Sequence>
      ))}

    </AbsoluteFill>
  );
};

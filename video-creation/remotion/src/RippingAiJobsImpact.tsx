import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, useCurrentFrame } from 'remotion';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import { fadeInOut, FONT } from './_kit';
import {
  RIP7_FPS, RIP7_DURATION, RIP7_SEAM, RIP7_CAP_Y, RIP7_ACCENT, RIP7_TEAL, RIP7_RED,
  CLIP_RIP7, THUMB_IMG_RIP7, BROLL_RIP7, SFX_RIP7, K1_RIP7, K2_RIP7, K3_RIP7,
} from './constants-ripping-ai-jobs-own-assets-impact';
import { CAPTIONS_RIP7 } from './captionsRippingAiJobsImpact';

// batch ripping / clip #7 "AI Codes Better Than Any Engineer. You Can't Be a Code Monkey Anymore" (IMPACT).
// Data wrapper over LivestreamShort + code-drawn pieces: the frame-0 cover title block and three description-band
// cards over Mike's own AI-jobs YouTube page (K1 badge, K2 dictionary entry, K3 red strike).
const DATA: ShortData = {
  clip: CLIP_RIP7,
  fps: RIP7_FPS,
  durationS: RIP7_DURATION / RIP7_FPS,
  capY: RIP7_CAP_Y,
  seam: RIP7_SEAM,
  accent: RIP7_ACCENT,
  captions: CAPTIONS_RIP7,
  broll: BROLL_RIP7,
  sounds: SFX_RIP7,
  // no `thumb`: the cover is drawn below (title block placed over the upper office floor of the cover image).
};

const STROKE = { WebkitTextStroke: '5px #000', paintOrder: 'stroke fill' as any };

// ─── FRAME-0 COVER (ONE frame) ────────────────────────────────────────────────────────────────
const Cover: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame !== 0) return null;
  return (
    <AbsoluteFill style={{ zIndex: 400 }}>
      <Img src={THUMB_IMG_RIP7} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.45) 18%, rgba(0,0,0,0) 28%, rgba(0,0,0,0) 84%, rgba(0,0,0,0.4) 100%)' }} />
      <div style={{ position: 'absolute', top: 80, left: 30, right: 30, textAlign: 'center', fontFamily: FONT, fontWeight: 900 }}>
        <div style={{ fontSize: 104, lineHeight: 1.0, color: '#fff', ...STROKE, textShadow: '0 7px 0 #000' }}>NO MORE</div>
        <div style={{ fontSize: 104, lineHeight: 1.0, color: RIP7_TEAL, ...STROKE, textShadow: `0 0 36px ${RIP7_TEAL}88, 0 7px 0 #000`, whiteSpace: 'nowrap' }}>CODE MONKEYS</div>
        <div style={{
          marginTop: 26, display: 'inline-block', background: RIP7_RED, color: '#fff', fontSize: 46,
          letterSpacing: '0.04em', padding: '14px 32px', borderRadius: 16, boxShadow: `0 0 40px ${RIP7_RED}`, whiteSpace: 'nowrap',
        }}>AI CODES BETTER THAN YOU</div>
      </div>
    </AbsoluteFill>
  );
};

// pop-in scale shared by the three cards
const usePop = (tIn: number) => {
  const frame = useCurrentFrame();
  return spring({ frame: frame - Math.round(tIn * RIP7_FPS), fps: RIP7_FPS, config: { damping: 13, stiffness: 320 }, from: 0.6, to: 1.0 });
};

// ─── K1: "AI > ANY ENGINEER" badge ─────────────────────────────────────────────────────────────
const K1: React.FC<{ t: number }> = ({ t }) => {
  const c = K1_RIP7;
  const sc = usePop(c.tIn);
  if (t < c.tIn - 0.05 || t >= c.tOut + 0.05) return null;
  return (
    <div style={{
      position: 'absolute', top: c.top, left: 540, transform: `translate(-50%,-50%) scale(${sc})`, opacity: fadeInOut(t, c.tIn, c.tOut, 0.15),
      background: 'rgba(0,0,0,0.86)', border: `5px solid ${RIP7_TEAL}`, borderRadius: 26, padding: '24px 48px',
      boxShadow: `0 0 46px ${RIP7_TEAL}88`, whiteSpace: 'nowrap', fontFamily: FONT, fontWeight: 900, fontSize: 76, lineHeight: 1,
      color: '#fff',
    }}>
      <span style={{ color: RIP7_TEAL, textShadow: `0 0 24px ${RIP7_TEAL}aa` }}>AI</span>
      <span style={{ color: RIP7_TEAL, margin: '0 22px' }}>&gt;</span>
      ANY ENGINEER
    </div>
  );
};

// ─── K2: dictionary entry "code mon·key (n.)" ─────────────────────────────────────────────────
const K2: React.FC<{ t: number }> = ({ t }) => {
  const c = K2_RIP7;
  const sc = usePop(c.tIn);
  if (t < c.tIn - 0.05 || t >= c.tOut + 0.05) return null;
  const slide = interpolate(t, [c.tIn, c.tIn + 0.2], [-60, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{
      position: 'absolute', top: c.top, left: 540, transform: `translate(calc(-50% + ${slide}px),-50%) scale(${sc})`,
      opacity: fadeInOut(t, c.tIn, c.tOut, 0.15), background: '#fbfaf6', borderRadius: 22, padding: '26px 46px 28px',
      boxShadow: '0 12px 40px rgba(0,0,0,0.55)', borderLeft: `14px solid ${RIP7_TEAL}`, whiteSpace: 'nowrap', textAlign: 'left',
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
        <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 700, fontSize: 70, color: '#111', lineHeight: 1 }}>code mon·key</div>
        <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: 'italic', fontSize: 40, color: '#555' }}>(n.)</div>
      </div>
      <div style={{ height: 4, background: RIP7_TEAL, margin: '16px 0 14px', borderRadius: 2 }} />
      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 38, color: '#222', lineHeight: 1.1 }}>a geek who writes code all day</div>
    </div>
  );
};

// ─── K3: "CODE MONKEY" with a red strike wiping across on "going" ─────────────────────────────
const K3: React.FC<{ t: number }> = ({ t }) => {
  const c = K3_RIP7;
  const sc = usePop(c.tIn);
  if (t < c.tIn - 0.05 || t >= c.tOut + 0.05) return null;
  const strike = interpolate(t, [c.strikeAt, c.strikeAt + 0.22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const struck = strike >= 1;
  return (
    <div style={{
      position: 'absolute', top: c.top, left: 540, transform: `translate(-50%,-50%) scale(${sc})`, opacity: fadeInOut(t, c.tIn, c.tOut, 0.15),
      background: 'rgba(0,0,0,0.86)', border: `5px solid ${struck ? RIP7_RED : '#ffffff'}`, borderRadius: 26, padding: '24px 52px',
      boxShadow: `0 0 46px ${struck ? RIP7_RED : '#ffffff'}66`, whiteSpace: 'nowrap',
    }}>
      <div style={{ position: 'relative', fontFamily: FONT, fontWeight: 900, fontSize: 92, lineHeight: 1, color: struck ? '#bbbbbb' : '#fff' }}>
        CODE MONKEY
        <div style={{
          position: 'absolute', left: -14, top: '50%', height: 16, width: `calc(${strike * 100}% + ${strike * 28}px)`,
          background: RIP7_RED, borderRadius: 8, transform: 'translateY(-50%) rotate(-4deg)', transformOrigin: 'left center',
          boxShadow: `0 0 22px ${RIP7_RED}`,
        }} />
      </div>
    </div>
  );
};

const Cards: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / RIP7_FPS;
  return (
    <AbsoluteFill style={{ zIndex: 130, pointerEvents: 'none' }}>
      <K1 t={t} />
      <K2 t={t} />
      <K3 t={t} />
    </AbsoluteFill>
  );
};

export const RippingAiJobsImpact: React.FC = () => (
  <AbsoluteFill>
    <LivestreamShort data={DATA} />
    <Cards />
    <Cover />
  </AbsoluteFill>
);
export { RIP7_FPS, RIP7_DURATION };

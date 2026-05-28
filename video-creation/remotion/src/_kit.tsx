import React from 'react';
import {
  AbsoluteFill, Img, OffthreadVideo,
  interpolate, useCurrentFrame, spring,
} from 'remotion';

// ─── Shared layout constants ─────────────────────────────────────────────────
// Base = the livestream video (content zone = screen-share top, face zone = webcam bottom).
export const CONTENT_BOTTOM = 1020;   // content zone occupies 0..1020 (~upper half); face plays below
export const CAPTION_Y = 968;         // caption band sits at the zone divider

// ─── Brand colours ───────────────────────────────────────────────────────────
export const TEAL   = '#00e5ff';
export const YELLOW = '#ffe600';
export const GREEN  = '#39ff14';
export const RED    = '#ff5252';
export const GREY   = '#9aa3ad';
export const BLUE   = '#3aa0ff';   // TON / institutional
export const ORANGE = '#ff9f1c';
export const FONT   = "'Montserrat', 'Arial Black', sans-serif";

// ─── Types ─────────────────────────────────────────────────────────────────────
export type Caption = { t: number; h: string };
export type BrollEv = { src: string; tIn: number; tOut: number; mode: 'full' | 'content' };
export type Gfx     = { id: string; tIn: number; tOut: number };
export type Sfx     = { t: number; src: string };

// ─── Helpers ───────────────────────────────────────────────────────────────────
export function fadeInOut(t: number, tIn: number, tOut: number, fadeS = 0.15) {
  return interpolate(t, [tIn, tIn + fadeS, tOut - fadeS, tOut], [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
}

export const colourize = (html: string) =>
  html
    .replace(/<g>/g, `<span style="color:${TEAL}">`).replace(/<\/g>/g, '</span>')
    .replace(/<y>/g, `<span style="color:${YELLOW}">`).replace(/<\/y>/g, '</span>')
    .replace(/<gr>/g, `<span style="color:${GREEN}">`).replace(/<\/gr>/g, '</span>')
    .replace(/<r>/g, `<span style="color:${RED}">`).replace(/<\/r>/g, '</span>')
    .replace(/<b>/g, `<span style="color:${BLUE}">`).replace(/<\/b>/g, '</span>');

// ─── Captions ────────────────────────────────────────────────────────────────
export const CaptionLayer: React.FC<{ captions: Caption[]; fps: number }> = ({ captions, fps }) => {
  const frame = useCurrentFrame();
  const t = frame / fps;
  let idx = 0, html = '';
  for (let i = captions.length - 1; i >= 0; i--) {
    if (t >= captions[i].t) { idx = i; html = captions[i].h; break; }
  }
  if (!html) return null;
  const startFrame = Math.round((captions[idx]?.t ?? 0) * fps);
  const age = frame - startFrame;
  const scale = spring({ frame: age, fps, config: { damping: 11, stiffness: 360 }, from: 0.7, to: 1.0 });
  return (
    <AbsoluteFill style={{ zIndex: 150, pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', top: CAPTION_Y, left: 50, right: 50, transform: 'translateY(-50%)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{
          fontFamily: FONT, fontWeight: 900, fontSize: 74, color: '#fff',
          textTransform: 'lowercase', textAlign: 'center', letterSpacing: '0.01em',
          lineHeight: 1.05, WebkitTextStroke: '13px #000', paintOrder: 'stroke fill' as any,
          width: '100%', transform: `scale(${scale})`,
        }} dangerouslySetInnerHTML={{ __html: colourize(html) }} />
      </div>
    </AbsoluteFill>
  );
};

// ─── B-roll layer (over the video base) ─────────────────────────────────────────
export const BrollLayer: React.FC<{ broll: BrollEv[]; t: number }> = ({ broll, t }) => {
  const ev = broll.find(e => t >= e.tIn && t < e.tOut);
  if (!ev) return null;
  const op = ev.tIn <= 0.001
    ? interpolate(t, [ev.tOut - 0.12, ev.tOut], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : fadeInOut(t, ev.tIn, ev.tOut, 0.12);
  const age = t - ev.tIn;
  const kb = interpolate(age, [0, ev.tOut - ev.tIn], [1.0, 1.07], { extrapolateRight: 'clamp' });

  if (ev.mode === 'full') {
    return (
      <AbsoluteFill style={{ opacity: op }}>
        <Img src={ev.src} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${kb})` }} />
      </AbsoluteFill>
    );
  }
  // content-zone: image covers ONLY the upper zone; webcam (base video) plays below.
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: 1080, height: CONTENT_BOTTOM, overflow: 'hidden' }}>
        <Img src={ev.src} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${kb})` }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 5, background: TEAL, boxShadow: `0 0 18px ${TEAL}` }} />
      </div>
    </AbsoluteFill>
  );
};

// ─── Base video + scrim + watermark scaffold ─────────────────────────────────────
export const Base: React.FC<{ clip: string; logo: string }> = ({ clip, logo }) => (
  <>
    {/* Layer 0: the livestream video base — screen-share (top) + webcam (bottom) + audio */}
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <OffthreadVideo src={clip} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </AbsoluteFill>
  </>
);

export const Scrim: React.FC = () => (
  <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 44%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 60%)' }} />
);

export const Watermark: React.FC<{ logo: string }> = ({ logo }) => (
  <Img src={logo} style={{ position: 'absolute', top: 30, left: 30, width: 88, height: 88, filter: `drop-shadow(0 0 12px ${TEAL}88)`, zIndex: 200 }} />
);

// ─── Generic badge (sits in content zone) ───────────────────────────────────────
export const Badge: React.FC<{ op: number; sc: number; color: string; line1: string; line2?: string; sub?: string; top?: number }> =
({ op, sc, color, line1, line2, sub, top = 320 }) => (
  <div style={{
    position: 'absolute', top, left: '50%', transform: `translate(-50%,-50%) scale(${sc})`,
    opacity: op, background: 'rgba(0,0,0,0.8)', border: `5px solid ${color}`, borderRadius: 26,
    padding: '28px 52px', textAlign: 'center', boxShadow: `0 0 50px ${color}88`, backdropFilter: 'blur(6px)',
  }}>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: line2 ? 60 : 82, color, lineHeight: 1, textShadow: `0 0 26px ${color}` }}>{line1}</div>
    {line2 && <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 82, color: '#fff', lineHeight: 1.05, marginTop: 6 }}>{line2}</div>}
    {sub && <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 32, color: '#fff', letterSpacing: '0.12em', marginTop: 12, opacity: 0.85 }}>{sub}</div>}
  </div>
);

// ─── First-frame thumbnail (IG cover) ────────────────────────────────────────────
export const Thumb: React.FC<{ op: number; title: React.ReactNode; chip: string; chipColor?: string; titleSize?: number }> =
({ op, title, chip, chipColor = TEAL, titleSize = 120 }) => (
  <AbsoluteFill style={{ opacity: op }}>
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 45%, rgba(0,0,0,0.8) 100%)' }} />
    <div style={{ position: 'absolute', top: 240, left: 56, right: 56, textAlign: 'center' }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: titleSize, lineHeight: 0.98, color: '#fff', textTransform: 'uppercase', WebkitTextStroke: '4px #000', paintOrder: 'stroke fill' as any }}>
        {title}
      </div>
      <div style={{ marginTop: 34, display: 'inline-block', background: chipColor, color: '#001016', fontFamily: FONT, fontWeight: 900, fontSize: 44, letterSpacing: '0.04em', padding: '16px 34px', borderRadius: 16, boxShadow: `0 0 40px ${chipColor}` }}>
        {chip}
      </div>
    </div>
  </AbsoluteFill>
);

// ─── Graphics op/scale hook ──────────────────────────────────────────────────────
export function useGfx(graphics: Gfx[], fps: number) {
  const frame = useCurrentFrame();
  const t = frame / fps;
  const g = (id: string) => graphics.find(e => e.id === id);
  const gOp = (id: string) => { const e = g(id); return e ? fadeInOut(t, e.tIn, e.tOut) : 0; };
  const gSc = (id: string) => {
    const e = g(id); if (!e) return 1;
    return spring({ frame: frame - Math.round(e.tIn * fps), fps, config: { damping: 13, stiffness: 320 }, from: 0.6, to: 1.0 });
  };
  return { frame, t, gOp, gSc };
}

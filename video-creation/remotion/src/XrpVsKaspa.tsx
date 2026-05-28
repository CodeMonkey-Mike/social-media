import React from 'react';
import {
  AbsoluteFill, Audio, Sequence, Img, OffthreadVideo,
  interpolate, useCurrentFrame, spring,
} from 'remotion';
import {
  FPS_XRPK as FPS,
  CLIP_XRPK, LOGO_KAS,
  BROLL_XRPK, GRAPHICS_XRPK, CAPTIONS_XRPK, SOUNDS_XRPK,
} from './constants-xrpk';

// ─── Layout ─────────────────────────────────────────────────────────────────
// Base = the livestream video (content zone = screen-share top, face zone = webcam bottom).
const CONTENT_BOTTOM = 1020;   // content zone occupies 0..1020 (~upper half); face plays below
const CAPTION_Y = 968;         // caption band sits at the zone divider

// ─── Brand colours ─────────────────────────────────────────────────────────────
const TEAL   = '#00e5ff';
const YELLOW = '#ffe600';
const GREEN  = '#39ff14';
const RED    = '#ff5252';
const GREY   = '#9aa3ad';
const FONT   = "'Montserrat', 'Arial Black', sans-serif";

// ─── Helpers ───────────────────────────────────────────────────────────────────
function fadeInOut(t: number, tIn: number, tOut: number, fadeS = 0.15) {
  return interpolate(t, [tIn, tIn + fadeS, tOut - fadeS, tOut], [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
}

const colourize = (html: string) =>
  html
    .replace(/<g>/g, `<span style="color:${TEAL}">`).replace(/<\/g>/g, '</span>')
    .replace(/<y>/g, `<span style="color:${YELLOW}">`).replace(/<\/y>/g, '</span>')
    .replace(/<gr>/g, `<span style="color:${GREEN}">`).replace(/<\/gr>/g, '</span>')
    .replace(/<r>/g, `<span style="color:${RED}">`).replace(/<\/r>/g, '</span>');

// ─── Captions ────────────────────────────────────────────────────────────────
function getCaption(t: number) {
  for (let i = CAPTIONS_XRPK.length - 1; i >= 0; i--) {
    if (t >= CAPTIONS_XRPK[i].t) return { idx: i, html: CAPTIONS_XRPK[i].h };
  }
  return { idx: 0, html: '' };
}

const Caption: React.FC<{ frame: number; t: number }> = ({ frame, t }) => {
  const { idx, html } = getCaption(t);
  if (!html) return null;
  const startFrame = Math.round((CAPTIONS_XRPK[idx]?.t ?? 0) * FPS);
  const age = frame - startFrame;
  const scale = spring({ frame: age, fps: FPS, config: { damping: 11, stiffness: 360 }, from: 0.7, to: 1.0 });
  return (
    <div style={{
      fontFamily: FONT, fontWeight: 900, fontSize: 74, color: '#fff',
      textTransform: 'lowercase', textAlign: 'center', letterSpacing: '0.01em',
      lineHeight: 1.05, WebkitTextStroke: '13px #000', paintOrder: 'stroke fill' as any,
      width: '100%', transform: `scale(${scale})`,
    }} dangerouslySetInnerHTML={{ __html: colourize(html) }} />
  );
};

// ─── B-roll layer (over the video base) ─────────────────────────────────────────
const Broll: React.FC<{ t: number }> = ({ t }) => {
  const ev = BROLL_XRPK.find(e => t >= e.tIn && t < e.tOut);
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
        {/* teal seam line framing the content zone */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 5, background: TEAL, boxShadow: `0 0 18px ${TEAL}` }} />
      </div>
    </AbsoluteFill>
  );
};

// ─── Generic badge (sits in content zone) ───────────────────────────────────────
const Badge: React.FC<{ op: number; sc: number; color: string; line1: string; line2?: string; sub?: string }> =
({ op, sc, color, line1, line2, sub }) => (
  <div style={{
    position: 'absolute', top: 320, left: '50%', transform: `translate(-50%,-50%) scale(${sc})`,
    opacity: op, background: 'rgba(0,0,0,0.8)', border: `5px solid ${color}`, borderRadius: 26,
    padding: '28px 52px', textAlign: 'center', boxShadow: `0 0 50px ${color}88`, backdropFilter: 'blur(6px)',
  }}>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: line2 ? 60 : 82, color, lineHeight: 1, textShadow: `0 0 26px ${color}` }}>{line1}</div>
    {line2 && <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 82, color: '#fff', lineHeight: 1.05, marginTop: 6 }}>{line2}</div>}
    {sub && <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 32, color: '#fff', letterSpacing: '0.12em', marginTop: 12, opacity: 0.85 }}>{sub}</div>}
  </div>
);

// ─── 10-year dilution comparison (sits in content zone, over base video) ─────────
const Compare: React.FC<{ op: number; sc: number; grow: number }> = ({ op, sc, grow }) => {
  const Bar = ({ label, pct, color, w }: { label: string; pct: string; color: string; w: number }) => (
    <div style={{ marginBottom: 44 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
        <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 54, color }}>{label}</span>
        <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 66, color, textShadow: `0 0 22px ${color}` }}>{pct}</span>
      </div>
      <div style={{ width: '100%', height: 56, background: 'rgba(255,255,255,0.10)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ width: `${w * grow}%`, height: '100%', background: color, borderRadius: 12, boxShadow: `0 0 30px ${color}` }} />
      </div>
    </div>
  );
  return (
    <div style={{
      position: 'absolute', top: 150, left: 60, right: 60, transform: `scale(${sc})`, transformOrigin: 'top center',
      opacity: op, background: 'rgba(0,0,0,0.82)', border: '4px solid rgba(255,255,255,0.16)', borderRadius: 28,
      padding: '42px 46px', backdropFilter: 'blur(8px)',
    }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 50, color: '#fff', textAlign: 'center', letterSpacing: '0.04em', marginBottom: 6 }}>10-YEAR DILUTION</div>
      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 28, color: GREY, textAlign: 'center', letterSpacing: '0.16em', marginBottom: 40 }}>NEW SUPPLY UNLOCKED</div>
      <Bar label="KASPA" pct="~5%" color={TEAL} w={12} />
      <Bar label="XRP" pct="40%" color={RED} w={100} />
    </div>
  );
};

// ─── 100x vs 10x card ─────────────────────────────────────────────────────────
const Card100x: React.FC<{ op: number; sc: number; frame: number }> = ({ op, sc, frame }) => {
  const pulse = interpolate(Math.sin(frame / 6), [-1, 1], [0.97, 1.03]);
  const Col = ({ tk, mult, color }: { tk: string; mult: string; color: string }) => (
    <div style={{ textAlign: 'center', flex: 1 }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 42, color: '#fff', letterSpacing: '0.06em' }}>{tk}</div>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 140, color, lineHeight: 1, textShadow: `0 0 40px ${color}` }}>{mult}</div>
    </div>
  );
  return (
    <div style={{
      position: 'absolute', top: 300, left: '50%', transform: `translate(-50%,-50%) scale(${sc * pulse})`,
      opacity: op, background: 'rgba(0,0,0,0.82)', border: `5px solid ${TEAL}`, borderRadius: 30,
      padding: '36px 36px', boxShadow: `0 0 60px ${TEAL}88`, display: 'flex', alignItems: 'center', width: 840,
    }}>
      <Col tk="KASPA" mult="100X" color={GREEN} />
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 56, color: GREY, padding: '0 10px' }}>vs</div>
      <Col tk="XRP" mult="10X" color={RED} />
    </div>
  );
};

// ─── First-frame thumbnail (IG cover) ────────────────────────────────────────────
const Thumb: React.FC<{ op: number }> = ({ op }) => (
  <AbsoluteFill style={{ opacity: op }}>
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 45%, rgba(0,0,0,0.8) 100%)' }} />
    <div style={{ position: 'absolute', top: 250, left: 60, right: 60, textAlign: 'center' }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 130, lineHeight: 0.98, color: '#fff', textTransform: 'uppercase', WebkitTextStroke: '4px #000', paintOrder: 'stroke fill' as any }}>
        EVERYONE&apos;S<br />HOLDING THE<br /><span style={{ color: RED }}>WRONG COIN</span>
      </div>
      <div style={{ marginTop: 34, display: 'inline-block', background: TEAL, color: '#001016', fontFamily: FONT, fontWeight: 900, fontSize: 46, letterSpacing: '0.04em', padding: '16px 36px', borderRadius: 16, boxShadow: `0 0 40px ${TEAL}` }}>
        XRP vs KASPA — THE MATH
      </div>
    </div>
  </AbsoluteFill>
);

// ─── CTA ────────────────────────────────────────────────────────────────────────
const CTA: React.FC<{ op: number; sc: number }> = ({ op, sc }) => (
  <div style={{
    position: 'absolute', top: 320, left: '50%', transform: `translate(-50%,-50%) scale(${sc})`,
    opacity: op, background: 'rgba(0,0,0,0.8)', border: `5px solid ${GREEN}`, borderRadius: 26,
    padding: '28px 50px', textAlign: 'center', boxShadow: `0 0 50px ${GREEN}77`,
  }}>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 54, color: '#fff', lineHeight: 1.05 }}>IF XRP PUMPS</div>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 78, color: GREEN, lineHeight: 1.05, textShadow: `0 0 28px ${GREEN}` }}>WE ALL WIN</div>
  </div>
);

// ─── Main composition ────────────────────────────────────────────────────────────
export const XrpVsKaspa: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  const g = (id: string) => GRAPHICS_XRPK.find(e => e.id === id);
  const gOp = (id: string) => { const e = g(id); return e ? fadeInOut(t, e.tIn, e.tOut) : 0; };
  const gSc = (id: string) => {
    const e = g(id); if (!e) return 1;
    return spring({ frame: frame - Math.round(e.tIn * FPS), fps: FPS, config: { damping: 13, stiffness: 320 }, from: 0.6, to: 1.0 });
  };
  const grow = (() => {
    const e = g('compare'); if (!e) return 0;
    return spring({ frame: frame - Math.round((e.tIn + 0.2) * FPS), fps: FPS, config: { damping: 18, stiffness: 90 }, from: 0, to: 1 });
  })();

  return (
    <AbsoluteFill style={{ background: '#000', fontFamily: FONT }}>
      {/* Layer 0: the livestream video base — screen-share (top) + webcam (bottom) + audio */}
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        <OffthreadVideo src={CLIP_XRPK} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>

      {/* Layer 1: b-roll (full-screen, or content-zone only) */}
      <Broll t={t} />

      {/* Layer 2: caption legibility scrim at the divider band */}
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 44%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 60%)' }} />

      {/* Layer 3: brand watermark */}
      <Img src={LOGO_KAS} style={{ position: 'absolute', top: 30, left: 30, width: 88, height: 88, filter: `drop-shadow(0 0 12px ${TEAL}88)`, zIndex: 200 }} />

      {/* Layer 4: graphics overlays */}
      <AbsoluteFill style={{ zIndex: 100 }}>
        <Badge op={gOp('badge-insiders')} sc={gSc('badge-insiders')} color={RED} line1="40%" line2="TO INSIDERS" sub="XRP ALLOCATION" />
        <Badge op={gOp('badge-premine')}  sc={gSc('badge-premine')}  color={TEAL} line1="NO PRE-MINE" sub="FAIR LAUNCH" />
        <Badge op={gOp('badge-95')}        sc={gSc('badge-95')}        color={TEAL} line1="95%" line2="MINED" sub="BY END OF YEAR" />
        <Badge op={gOp('tiny-dilution')}   sc={gSc('tiny-dilution')}   color={TEAL} line1="TINY" line2="DILUTION" sub="OVER 10 YEARS" />
        <Badge op={gOp('badge-locked')}    sc={gSc('badge-locked')}    color={TEAL} line1="MAX SUPPLY" line2="LOCKED" sub="CAN'T BE INCREASED" />
        {gOp('compare') > 0 && <Compare op={gOp('compare')} sc={gSc('compare')} grow={grow} />}
        {gOp('card-100x') > 0 && <Card100x op={gOp('card-100x')} sc={gSc('card-100x')} frame={frame} />}
        {gOp('cta') > 0 && <CTA op={gOp('cta')} sc={gSc('cta')} />}
      </AbsoluteFill>

      {/* Layer 5: captions — at the zone divider */}
      <AbsoluteFill style={{ zIndex: 150, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: CAPTION_Y, left: 50, right: 50, transform: 'translateY(-50%)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Caption frame={frame} t={t} />
        </div>
      </AbsoluteFill>

      {/* Layer 6: first-frame thumbnail (IG cover) */}
      {t < 2.6 && <AbsoluteFill style={{ zIndex: 300 }}><Thumb op={interpolate(t, [0, 2.35, 2.6], [1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} /></AbsoluteFill>}

      {/* sfx */}
      {SOUNDS_XRPK.map((e, i) => (
        <Sequence key={i} from={Math.round(e.t * FPS)} durationInFrames={FPS * 2}>
          <Audio src={e.src} volume={0.5} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

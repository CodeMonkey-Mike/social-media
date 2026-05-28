import React from 'react';
import {
  AbsoluteFill, Audio, Sequence, Img, OffthreadVideo,
  interpolate, useCurrentFrame, spring,
} from 'remotion';
import {
  FPS_DOGINME as FPS,
  CLIP_DOGINME, LOGO_KAS, OV_DOGINME,
  BROLL_DOGINME, GRAPHICS_DOGINME, CAPTIONS_DOGINME, SOUNDS_DOGINME,
  OVERLAY_EVENTS, FULLFACE_EVENTS,
} from './constants-doginme';

// ─── Layout ─────────────────────────────────────────────────────────────────
const CONTENT_BOTTOM = 1020;
const CAPTION_Y      = 968;

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
    .replace(/<g>/g,  `<span style="color:${TEAL}">`).replace(/<\/g>/g,  '</span>')
    .replace(/<y>/g,  `<span style="color:${YELLOW}">`).replace(/<\/y>/g,  '</span>')
    .replace(/<gr>/g, `<span style="color:${GREEN}">`).replace(/<\/gr>/g, '</span>')
    .replace(/<r>/g,  `<span style="color:${RED}">`).replace(/<\/r>/g,  '</span>');

// ─── Captions ────────────────────────────────────────────────────────────────
function getCaption(t: number) {
  for (let i = CAPTIONS_DOGINME.length - 1; i >= 0; i--) {
    if (t >= CAPTIONS_DOGINME[i].t) return { idx: i, html: CAPTIONS_DOGINME[i].h };
  }
  return { idx: 0, html: '' };
}

const Caption: React.FC<{ frame: number; t: number }> = ({ frame, t }) => {
  const { idx, html } = getCaption(t);
  if (!html) return null;
  const startFrame = Math.round((CAPTIONS_DOGINME[idx]?.t ?? 0) * FPS);
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

// ─── B-roll layer ─────────────────────────────────────────────────────────────
const Broll: React.FC<{ t: number; fullFaceOp: number }> = ({ t, fullFaceOp }) => {
  // Hide b-roll while the full-face shot is fully visible
  if (fullFaceOp > 0.9) return null;
  const ev = BROLL_DOGINME.find(e => t >= e.tIn && t < e.tOut);
  if (!ev) return null;
  const op = ev.tIn <= 0.001
    ? interpolate(t, [ev.tOut - 0.12, ev.tOut], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : fadeInOut(t, ev.tIn, ev.tOut, 0.12);
  const age = t - ev.tIn;
  const kb = interpolate(age, [0, ev.tOut - ev.tIn], [1.0, 1.07], { extrapolateRight: 'clamp' });

  const finalOp = op * (1 - fullFaceOp);
  if (ev.mode === 'full') {
    return (
      <AbsoluteFill style={{ opacity: finalOp }}>
        <Img src={ev.src} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${kb})` }} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ opacity: finalOp }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: 1080, height: CONTENT_BOTTOM, overflow: 'hidden' }}>
        <Img src={ev.src} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${kb})` }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 5, background: TEAL, boxShadow: `0 0 18px ${TEAL}` }} />
      </div>
    </AbsoluteFill>
  );
};

// ─── Full-face layer (webcam fills the whole frame at the emotional peak) ──────
// The base clip is 1080x1920 with screen-share in upper ~1020px and webcam in lower ~900px.
// To "go fullface" we render a second copy of the same OffthreadVideo, scaled and shifted
// so the face zone (y=1020..1920 of the original) fills the entire viewport.
const FullFace: React.FC<{ op: number }> = ({ op }) => {
  if (op <= 0.001) return null;
  // Scale = 1920/900 = 2.133 so the 900px-tall face zone fills the 1920px frame.
  const S = 1920 / 900;
  // After scaling, the original 1080x1920 becomes 2304x4096. The face zone (was y=1020..1920)
  // is now at y=2176..4096 in the scaled image. Shift up by 2176 so it starts at viewport y=0,
  // and centre horizontally: left = -(2304-1080)/2 = -612.
  return (
    <AbsoluteFill style={{ opacity: op, overflow: 'hidden', zIndex: 60 }}>
      <div style={{ position: 'absolute', left: -612, top: -2176, width: 1080 * S, height: 1920 * S }}>
        <OffthreadVideo src={CLIP_DOGINME} style={{ width: '100%', height: '100%', objectFit: 'fill' }} />
      </div>
    </AbsoluteFill>
  );
};

// ─── Transparent character overlay (alpha PNG, sticker pose) ───────────────────
const CharacterOverlay: React.FC<{ t: number; frame: number }> = ({ t, frame }) => {
  const ev = OVERLAY_EVENTS.find(e => t >= e.tIn && t < e.tOut);
  if (!ev) return null;
  const startFrame = Math.round(ev.tIn * FPS);
  const age = frame - startFrame;
  const pop = spring({ frame: age, fps: FPS, config: { damping: 9, stiffness: 220 }, from: 0, to: 1 });
  const op = fadeInOut(t, ev.tIn, ev.tOut, 0.18);

  // pose 'side' = small in the lower-right, peeking up; 'flex' = larger centred over the face zone
  const sideStyle: React.CSSProperties = {
    position: 'absolute',
    right: -40, bottom: 220,
    width: 600, height: 'auto',
    transform: `translateY(${(1 - pop) * 60}px) rotate(${(1 - pop) * 8}deg)`,
    filter: `drop-shadow(0 0 24px ${TEAL}cc) drop-shadow(0 0 60px ${TEAL}55)`,
    opacity: op,
  };
  const flexStyle: React.CSSProperties = {
    position: 'absolute',
    left: '50%', bottom: 260,
    width: 760, height: 'auto',
    transform: `translateX(-50%) scale(${0.85 + pop * 0.15})`,
    filter: `drop-shadow(0 0 30px ${TEAL}ee) drop-shadow(0 0 80px ${TEAL}66)`,
    opacity: op,
  };
  return (
    <AbsoluteFill style={{ zIndex: 220, pointerEvents: 'none' }}>
      <Img src={OV_DOGINME} style={ev.pose === 'side' ? sideStyle : flexStyle} />
    </AbsoluteFill>
  );
};

// ─── Generic badge ──────────────────────────────────────────────────────────────
const Badge: React.FC<{ op: number; sc: number; color: string; line1: string; line2?: string; sub?: string; top?: number }> =
({ op, sc, color, line1, line2, sub, top = 320 }) => (
  <div style={{
    position: 'absolute', top, left: '50%', transform: `translate(-50%,-50%) scale(${sc})`,
    opacity: op, background: 'rgba(0,0,0,0.8)', border: `5px solid ${color}`, borderRadius: 26,
    padding: '28px 52px', textAlign: 'center', boxShadow: `0 0 50px ${color}88`, backdropFilter: 'blur(6px)',
  }}>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: line2 ? 60 : 140, color, lineHeight: 1, textShadow: `0 0 32px ${color}` }}>{line1}</div>
    {line2 && <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 82, color: '#fff', lineHeight: 1.05, marginTop: 6 }}>{line2}</div>}
    {sub && <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 32, color: '#fff', letterSpacing: '0.12em', marginTop: 12, opacity: 0.85 }}>{sub}</div>}
  </div>
);

// ─── NFA pulsing warning card ───────────────────────────────────────────────────
const NfaCard: React.FC<{ op: number; sc: number; frame: number }> = ({ op, sc, frame }) => {
  const pulse = interpolate(Math.sin(frame / 4), [-1, 1], [0.95, 1.05]);
  const flash = interpolate(Math.sin(frame / 3), [-1, 1], [0.6, 1.0]);
  return (
    <div style={{
      position: 'absolute', top: 300, left: '50%', transform: `translate(-50%,-50%) scale(${sc * pulse})`,
      opacity: op, background: 'rgba(0,0,0,0.86)', border: `7px solid ${RED}`, borderRadius: 26,
      padding: '36px 56px', textAlign: 'center', boxShadow: `0 0 ${60 * flash}px ${RED}`, backdropFilter: 'blur(6px)', width: 820,
    }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 56, color: '#fff', letterSpacing: '0.08em', marginBottom: 10 }}>⚠</div>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 100, color: RED, lineHeight: 0.95, textShadow: `0 0 36px ${RED}` }}>NOT<br />FINANCIAL<br />ADVICE</div>
      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 32, color: '#fff', letterSpacing: '0.16em', marginTop: 18, opacity: 0.9 }}>EVER. SERIOUSLY.</div>
    </div>
  );
};

// ─── First-frame thumbnail (IG cover) ────────────────────────────────────────────
const Thumb: React.FC<{ op: number }> = ({ op }) => (
  <AbsoluteFill style={{ opacity: op }}>
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 45%, rgba(0,0,0,0.8) 100%)' }} />
    <div style={{ position: 'absolute', top: 220, left: 60, right: 60, textAlign: 'center' }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 130, lineHeight: 0.98, color: '#fff', textTransform: 'uppercase', WebkitTextStroke: '4px #000', paintOrder: 'stroke fill' as any }}>
        ONLY <span style={{ color: TEAL }}>ONE</span><br />OF THESE<br />IS A<br /><span style={{ color: GREEN }}>BUY</span>
      </div>
      <div style={{ marginTop: 34, display: 'inline-block', background: YELLOW, color: '#1a1300', fontFamily: FONT, fontWeight: 900, fontSize: 44, letterSpacing: '0.04em', padding: '16px 36px', borderRadius: 16, boxShadow: `0 0 40px ${YELLOW}aa` }}>
        KEYCAT vs DOG IN ME
      </div>
    </div>
  </AbsoluteFill>
);

// ─── Main composition ────────────────────────────────────────────────────────────
export const KeycatDoginme: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  const g = (id: string) => GRAPHICS_DOGINME.find(e => e.id === id);
  const gOp = (id: string) => { const e = g(id); return e ? fadeInOut(t, e.tIn, e.tOut) : 0; };
  const gSc = (id: string) => {
    const e = g(id); if (!e) return 1;
    return spring({ frame: frame - Math.round(e.tIn * FPS), fps: FPS, config: { damping: 13, stiffness: 320 }, from: 0.6, to: 1.0 });
  };

  // Full-face shot (webcam fills the frame at the emotional peak)
  const ffEv = FULLFACE_EVENTS.find(e => t >= e.tIn - 0.18 && t < e.tOut + 0.18);
  const fullFaceOp = ffEv ? fadeInOut(t, ffEv.tIn, ffEv.tOut, 0.18) : 0;

  return (
    <AbsoluteFill style={{ background: '#000', fontFamily: FONT }}>
      {/* Layer 0: livestream video base */}
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        <OffthreadVideo src={CLIP_DOGINME} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>

      {/* Layer 1: b-roll (hides itself during fullFace) */}
      <Broll t={t} fullFaceOp={fullFaceOp} />

      {/* Layer 1.5: full-face shot (webcam zoom) */}
      <FullFace op={fullFaceOp} />

      {/* Layer 2: caption-band scrim */}
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 44%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 60%)' }} />

      {/* Layer 3: brand watermark */}
      <Img src={LOGO_KAS} style={{ position: 'absolute', top: 30, left: 30, width: 88, height: 88, filter: `drop-shadow(0 0 12px ${TEAL}88)`, zIndex: 200 }} />

      {/* Layer 3.5: transparent DogInMe character overlay */}
      <CharacterOverlay t={t} frame={frame} />

      {/* Layer 4: graphics overlays */}
      <AbsoluteFill style={{ zIndex: 100 }}>
        <Badge op={gOp('badge-8x')}       sc={gSc('badge-8x')}       color={GREEN} line1="8X"            sub="MY COMMUNITY" />
        <Badge op={gOp('badge-coinbase')} sc={gSc('badge-coinbase')} color={TEAL}  line1="MARCH 2024" sub="COINBASE LISTING" />
        <Badge op={gOp('badge-12cex')}    sc={gSc('badge-12cex')}    color={TEAL}  line1="12"          line2="CEX LISTINGS" />
        <Badge op={gOp('badge-winner')}   sc={gSc('badge-winner')}   color={GREEN} line1="MY PICK"    line2="DOG IN ME" />
        {gOp('card-nfa') > 0 && <NfaCard op={gOp('card-nfa')} sc={gSc('card-nfa')} frame={frame} />}
      </AbsoluteFill>

      {/* Layer 5: captions */}
      <AbsoluteFill style={{ zIndex: 150, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: CAPTION_Y, left: 50, right: 50, transform: 'translateY(-50%)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Caption frame={frame} t={t} />
        </div>
      </AbsoluteFill>

      {/* Layer 6: first-frame thumbnail */}
      {t < 3.0 && <AbsoluteFill style={{ zIndex: 300 }}><Thumb op={interpolate(t, [0, 2.75, 3.0], [1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} /></AbsoluteFill>}

      {/* sfx */}
      {SOUNDS_DOGINME.map((e, i) => (
        <Sequence key={i} from={Math.round(e.t * FPS)} durationInFrames={FPS * 2}>
          <Audio src={e.src} volume={0.5} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

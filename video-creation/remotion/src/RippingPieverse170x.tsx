import React from 'react';
import { AbsoluteFill, Img, spring, useCurrentFrame, interpolate } from 'remotion';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import { fadeInOut, FONT, TEAL, YELLOW, GREEN } from './_kit';
import {
  RIP6_FPS, RIP6_DURATION, RIP6_SEAM, RIP6_CAP_Y, RIP6_ACCENT,
  CLIP_RIP6, THUMB_IMG_RIP6, BROLL_RIP6, SFX_RIP6, PUMP_RIP6, CHIPS_RIP6, STAMPS_RIP6,
} from './constants-ripping-pieverse-17x-at-a-billion-impact';
import { CAPTIONS_RIP6 } from './captionsRippingPieverse170x';

// batch ripping / clip #6 "Pieverse Is at a Billion. That 17x Could Turn Into 170x" (IMPACT).
// Data wrapper over LivestreamShort + code-drawn pieces: the frame-0 cover title block, the PumpCard (remap of the
// FAILED still-pumping image), nowrap chip badges (the kit Badge shrink-wraps at left:50% and wraps wide lines) and
// the stamps.
const DATA: ShortData = {
  clip: CLIP_RIP6,
  fps: RIP6_FPS,
  durationS: RIP6_DURATION / RIP6_FPS,
  capY: RIP6_CAP_Y,
  seam: RIP6_SEAM,
  accent: RIP6_ACCENT,
  captions: CAPTIONS_RIP6,
  broll: BROLL_RIP6,
  sounds: SFX_RIP6,
  // no `thumb`: the cover is drawn below (title block placed in the clean sky left of the planet).
};

const STROKE = (px: number) => ({ WebkitTextStroke: `${px}px #000`, paintOrder: 'stroke fill' as any });

// ─── FRAME-0 COVER (ONE frame) ────────────────────────────────────────────────────────────────
// Title block x 60-~900, y 110-~760 in the dark sky; the planet is top-right (x ~855-1080, y ~90-450), the cat
// starts at y ~925.
const Cover: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame !== 0) return null;
  return (
    <AbsoluteFill style={{ zIndex: 400 }}>
      <Img src={THUMB_IMG_RIP6} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 30%, rgba(0,0,0,0) 45%, rgba(0,0,0,0) 80%, rgba(0,0,0,0.4) 100%)' }} />
      <div style={{ position: 'absolute', top: 110, left: 60, right: 60, fontFamily: FONT, fontWeight: 900, textAlign: 'left' }}>
        <div style={{ fontSize: 150, lineHeight: 0.95, color: '#fff', ...STROKE(6), textShadow: '0 7px 0 #000' }}>17X</div>
        <div style={{ fontSize: 58, lineHeight: 1.1, color: '#fff', ...STROKE(4), textShadow: '0 5px 0 #000', marginTop: 6 }}>COULD TURN INTO</div>
        <div style={{
          fontSize: 230, lineHeight: 0.98, color: YELLOW, ...STROKE(7),
          textShadow: `0 0 44px ${YELLOW}88, 0 9px 0 #000`,
        }}>170X?</div>
        <div style={{
          marginTop: 22, display: 'inline-block', background: TEAL, color: '#001016', fontSize: 46,
          letterSpacing: '0.05em', padding: '14px 32px', borderRadius: 14, boxShadow: `0 0 36px ${TEAL}`,
        }}>AT A BILLION</div>
      </div>
    </AbsoluteFill>
  );
};

// ─── PUMP CARD (code-drawn remap of B2) ───────────────────────────────────────────────────────
// Opaque over the content zone 0..seam, like a content-mode b-roll beat; same 0.12 s fades as BrollLayer.
// A brass pump on the left; each stroke (handle down) inflates a glowing green up-arrow one notch.
const STROKE_T = [0.15, 0.95, 1.75];           // pump strokes, seconds after tIn
const PumpCard: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / RIP6_FPS;
  const { tIn, tOut, headIn, footIn } = PUMP_RIP6;
  if (t < tIn || t >= tOut) return null;
  const op = interpolate(t, [tIn, tIn + 0.12, tOut - 0.12, tOut], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const age = t - tIn;
  // handle travel: down fast (0.18 s), back up (0.45 s) on each stroke
  let handle = 0;
  for (const s of STROKE_T) {
    const a = age - s;
    if (a >= 0 && a < 0.63) handle = Math.max(handle, a < 0.18 ? a / 0.18 : 1 - (a - 0.18) / 0.45);
  }
  // arrow size: 0.45 base, +1 notch per stroke (spring), up to 1.0
  let sc = 0.45;
  STROKE_T.forEach((s) => {
    const f = Math.round((age - s - 0.1) * RIP6_FPS);
    sc += 0.55 / STROKE_T.length * (f >= 0 ? spring({ frame: f, fps: RIP6_FPS, config: { damping: 8, stiffness: 260 } }) : 0);
  });
  const wobble = Math.sin(age * 5.5) * 2.5;    // deg, a floating balloon sway
  const headOp = fadeInOut(t, headIn, tOut + 1, 0.1);
  const headSc = t >= headIn ? spring({ frame: frame - Math.round(headIn * RIP6_FPS), fps: RIP6_FPS, config: { damping: 10, stiffness: 320 }, from: 0.4, to: 1 }) : 0;
  const footOp = fadeInOut(t, footIn, tOut + 1, 0.1);
  const footSc = t >= footIn ? spring({ frame: frame - Math.round(footIn * RIP6_FPS), fps: RIP6_FPS, config: { damping: 11, stiffness: 320 }, from: 0.5, to: 1 }) : 0;
  // geometry
  const PX = 250, PTOP = 470, PBOT = 700;      // pump cylinder: x centre, top, bottom
  const AX = 650, ABASE = 690;                  // arrow balloon: x centre, base (knot) y
  const AH = 380, AW = 320;                     // arrow full size
  const hy = PTOP - 70 + handle * 55;           // handle bar y
  return (
    <AbsoluteFill style={{ zIndex: 140, pointerEvents: 'none', opacity: op }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, width: 1080, height: RIP6_SEAM, overflow: 'hidden',
        background: 'radial-gradient(circle at 58% 55%, #1d1446 0%, #0c0a26 55%, #04040f 100%)',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.16,
          backgroundImage: `linear-gradient(${GREEN}33 1px, transparent 1px), linear-gradient(90deg, ${GREEN}33 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />
        <svg width={1080} height={RIP6_SEAM} style={{ position: 'absolute', left: 0, top: 0 }}>
          <defs>
            <linearGradient id="rip6brass" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#8a6a12" /><stop offset="0.45" stopColor="#ffd75e" /><stop offset="1" stopColor="#7a5a0c" />
            </linearGradient>
            <linearGradient id="rip6arrow" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#b8ff9c" /><stop offset="0.5" stopColor="#39ff14" /><stop offset="1" stopColor="#16a800" />
            </linearGradient>
            <filter id="rip6glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="18" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {/* hose: pump foot -> balloon knot */}
          <path d={`M ${PX + 40} ${PBOT - 14} C ${PX + 200} ${PBOT + 40}, ${AX - 120} ${ABASE + 70}, ${AX} ${ABASE + 6}`}
            stroke="#1b1b1b" strokeWidth={16} fill="none" strokeLinecap="round" />
          <path d={`M ${PX + 40} ${PBOT - 14} C ${PX + 200} ${PBOT + 40}, ${AX - 120} ${ABASE + 70}, ${AX} ${ABASE + 6}`}
            stroke="#3a3a3a" strokeWidth={6} fill="none" strokeLinecap="round" />
          {/* pump: base plate, cylinder, rod, handle */}
          <rect x={PX - 80} y={PBOT - 8} width={160} height={22} rx={8} fill="#222" stroke="#000" strokeWidth={3} />
          <rect x={PX - 9} y={hy} width={18} height={PTOP - hy + 6} fill="#c9c9c9" stroke="#000" strokeWidth={2} />
          <rect x={PX - 44} y={PTOP} width={88} height={PBOT - PTOP} rx={14} fill="url(#rip6brass)" stroke="#000" strokeWidth={4} />
          <rect x={PX - 50} y={PTOP + 30} width={100} height={10} fill="#5c4308" />
          <rect x={PX - 50} y={PBOT - 50} width={100} height={10} fill="#5c4308" />
          <rect x={PX - 110} y={hy - 14} width={220} height={28} rx={14} fill="url(#rip6brass)" stroke="#000" strokeWidth={4} />
          {/* arrow balloon, scaled from its knot */}
          <g transform={`translate(${AX} ${ABASE}) rotate(${wobble}) scale(${sc})`} filter="url(#rip6glow)">
            <path d={`M 0 ${-AH} L ${AW / 2} ${-AH * 0.52} L ${AW * 0.2} ${-AH * 0.52} L ${AW * 0.2} -18 Q 0 6 ${-AW * 0.2} -18 L ${-AW * 0.2} ${-AH * 0.52} L ${-AW / 2} ${-AH * 0.52} Z`}
              fill="url(#rip6arrow)" stroke="#0b5200" strokeWidth={6} strokeLinejoin="round" />
            <path d={`M ${-AW * 0.1} ${-AH * 0.78} L ${-AW * 0.03} ${-AH * 0.9}`} stroke="#ffffffcc" strokeWidth={14} strokeLinecap="round" />
            <path d="M -14 0 L 14 0 L 0 -16 Z" fill="#16a800" stroke="#0b5200" strokeWidth={4} />
          </g>
        </svg>
        {/* header: the number, popped on "17x" */}
        {t >= headIn && (
          <div style={{
            position: 'absolute', top: 40, left: 0, width: 1080, textAlign: 'center', fontFamily: FONT, fontWeight: 900,
            fontSize: 190, lineHeight: 1, color: YELLOW, opacity: headOp, transform: `scale(${headSc})`,
            textShadow: `0 0 40px ${YELLOW}88, 0 8px 0 #000`, ...STROKE(6),
          }}>17X</div>
        )}
        {/* footer, popped on "still" */}
        {t >= footIn && (
          <div style={{
            position: 'absolute', top: 744, left: 0, width: 1080, textAlign: 'center', fontFamily: FONT, fontWeight: 900,
            fontSize: 76, color: GREEN, letterSpacing: '0.03em', whiteSpace: 'nowrap', opacity: footOp, transform: `scale(${footSc})`,
            textShadow: `0 0 30px ${GREEN}88`, ...STROKE(3),
          }}>STILL PUMPING</div>
        )}
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 5, background: RIP6_ACCENT, boxShadow: `0 0 18px ${RIP6_ACCENT}` }} />
      </div>
    </AbsoluteFill>
  );
};

// ─── CHIP BADGES (nowrap, centred across the full width) ─────────────────────────────────────
const Chips: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / RIP6_FPS;
  if (frame === 0) return null;
  return (
    <AbsoluteFill style={{ zIndex: 130, pointerEvents: 'none' }}>
      {CHIPS_RIP6.map((b, i) => {
        if (t < b.tIn || t >= b.tOut) return null;
        const op = fadeInOut(t, b.tIn, b.tOut, 0.15);
        const sc = spring({ frame: frame - Math.round(b.tIn * RIP6_FPS), fps: RIP6_FPS, config: { damping: 13, stiffness: 320 }, from: 0.6, to: 1 });
        return (
          <div key={i} style={{ position: 'absolute', left: 0, width: 1080, top: b.top, display: 'flex', justifyContent: 'center', transform: 'translateY(-50%)' }}>
            <div style={{
              opacity: op, transform: `scale(${sc})`, whiteSpace: 'nowrap', background: 'rgba(0,0,0,0.84)',
              border: `5px solid ${b.color}`, borderRadius: 26, padding: '22px 46px', textAlign: 'center',
              boxShadow: `0 0 50px ${b.color}88`, fontFamily: FONT, fontWeight: 900,
            }}>
              <div style={{ fontSize: 76, lineHeight: 1, color: b.color, textShadow: `0 0 26px ${b.color}` }}>{b.line1}</div>
              <div style={{ fontSize: 34, color: '#fff', letterSpacing: '0.14em', marginTop: 12, opacity: 0.9 }}>{b.sub}</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ─── STAMPS (centred punch-ins) ─────────────────────────────────────────────────────────────
const Stamps: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / RIP6_FPS;
  if (frame === 0) return null;
  return (
    <AbsoluteFill style={{ zIndex: 135, pointerEvents: 'none' }}>
      {STAMPS_RIP6.map((s, i) => {
        if (t < s.tIn || t >= s.tOut) return null;
        const op = fadeInOut(t, s.tIn, s.tOut, 0.1);
        const sc = spring({ frame: frame - Math.round(s.tIn * RIP6_FPS), fps: RIP6_FPS, config: { damping: 10, stiffness: 340 }, from: 1.6, to: 1 });
        return (
          <div key={i} style={{ position: 'absolute', left: 0, width: 1080, top: s.top, display: 'flex', justifyContent: 'center', transform: 'translateY(-50%)' }}>
            <div style={{
              transform: `scale(${sc}) rotate(-4deg)`, opacity: op, whiteSpace: 'nowrap', background: 'rgba(0,0,0,0.86)',
              border: `6px solid ${s.color}`, borderRadius: 24, padding: '18px 56px 22px', textAlign: 'center',
              boxShadow: `0 0 50px ${s.color}88`, fontFamily: FONT, fontWeight: 900,
            }}>
              <div style={{ fontSize: 40, color: '#fff', letterSpacing: '0.1em' }}>{s.line1}</div>
              <div style={{ fontSize: 150, lineHeight: 1.0, color: s.color, textShadow: `0 0 28px ${s.color}aa` }}>{s.big}</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const RippingPieverse170x: React.FC = () => (
  <AbsoluteFill>
    <LivestreamShort data={DATA} />
    <PumpCard />
    <Chips />
    <Stamps />
    <Cover />
  </AbsoluteFill>
);
export { RIP6_FPS, RIP6_DURATION };

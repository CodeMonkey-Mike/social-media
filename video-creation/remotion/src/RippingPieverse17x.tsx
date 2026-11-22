import React from 'react';
import { AbsoluteFill, Img, spring, useCurrentFrame, interpolate } from 'remotion';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import { fadeInOut, FONT, TEAL, YELLOW, GREEN } from './_kit';
import {
  RIP1_FPS, RIP1_DURATION, RIP1_SEAM, RIP1_CAP_Y, RIP1_ACCENT,
  CLIP_RIP1, THUMB_IMG_RIP1, BROLL_RIP1, OVERLAYS_RIP1, BADGES_RIP1, SFX_RIP1, RADAR_RIP1, STAMPS_RIP1,
} from './constants-ripping-pieverse-17x-at-a-billion';
import { CAPTIONS_RIP1 } from './captionsRippingPieverse17x';

// batch ripping / clip #1 "Pieverse Just Hit a Billion. That Is 17.5x From My Call" (FULL).
// Data wrapper over LivestreamShort + three code-drawn pieces: the frame-0 cover title block, the bot RadarCard
// (remap of the FAILED bot-radar image) and the left-column stamps beside the calculator.
const DATA: ShortData = {
  clip: CLIP_RIP1,
  fps: RIP1_FPS,
  durationS: RIP1_DURATION / RIP1_FPS,
  capY: RIP1_CAP_Y,
  seam: RIP1_SEAM,
  accent: RIP1_ACCENT,
  captions: CAPTIONS_RIP1,
  broll: BROLL_RIP1,
  overlays: OVERLAYS_RIP1,
  badges: BADGES_RIP1,
  sounds: SFX_RIP1,
  // no `thumb`: the cover is drawn below (its title block must sit higher than the kit Thumb's fixed top 240,
  // which would land the chip on the mascot's ears and the raised coin).
};

// ─── FRAME-0 COVER (ONE frame) ────────────────────────────────────────────────────────────────
// Title block y 60-442 in the clean night sky; the mascot's ears start at y~580, the coin at y~470 (x 700-910).
const Cover: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame !== 0) return null;
  return (
    <AbsoluteFill style={{ zIndex: 400 }}>
      <Img src={THUMB_IMG_RIP1} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 26%, rgba(0,0,0,0) 40%, rgba(0,0,0,0) 80%, rgba(0,0,0,0.45) 100%)' }} />
      <div style={{ position: 'absolute', top: 60, left: 40, right: 40, textAlign: 'center', fontFamily: FONT, fontWeight: 900 }}>
        <div style={{
          fontSize: 210, lineHeight: 0.98, color: YELLOW, WebkitTextStroke: '6px #000', paintOrder: 'stroke fill' as any,
          textShadow: `0 0 40px ${YELLOW}88, 0 8px 0 #000`,
        }}>17.5X</div>
        <div style={{
          fontSize: 92, lineHeight: 0.98, color: '#fff', textTransform: 'uppercase',
          WebkitTextStroke: '4px #000', paintOrder: 'stroke fill' as any, textShadow: '0 6px 0 #000',
        }}>AT A BILLION</div>
        <div style={{
          marginTop: 18, display: 'inline-block', background: TEAL, color: '#001016', fontSize: 40,
          letterSpacing: '0.05em', padding: '12px 30px', borderRadius: 14, boxShadow: `0 0 36px ${TEAL}`,
        }}>FROM MY CALL</div>
      </div>
    </AbsoluteFill>
  );
};

// ─── RADAR CARD (code-drawn remap of B3) ──────────────────────────────────────────────────────
// Opaque over the content zone 0..seam, like a content-mode b-roll beat; same 0.12 s fades as BrollLayer.
const RadarCard: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / RIP1_FPS;
  const { tIn, tOut } = RADAR_RIP1;
  if (t < tIn || t >= tOut) return null;
  const op = interpolate(t, [tIn, tIn + 0.12, tOut - 0.12, tOut], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const age = t - tIn;
  const CX = 540, CY = 420, R = 250;
  const sweep = age * 220;                      // deg, clockwise from 12 o'clock
  const BLIP_DEG = 52, BLIP_R = 150;
  const bx = CX + BLIP_R * Math.sin((BLIP_DEG * Math.PI) / 180);
  const by = CY - BLIP_R * Math.cos((BLIP_DEG * Math.PI) / 180);
  const blipOn = sweep >= BLIP_DEG;
  const blipAge = Math.max(0, age - BLIP_DEG / 220);
  const blipSc = blipOn ? spring({ frame: Math.round(blipAge * RIP1_FPS), fps: RIP1_FPS, config: { damping: 9, stiffness: 300 }, from: 0, to: 1 }) : 0;
  const ring = (blipAge * 1.4) % 1;             // expanding ping ring, 0..1, every ~0.7 s
  const headSc = spring({ frame: frame - Math.round(tIn * RIP1_FPS), fps: RIP1_FPS, config: { damping: 13, stiffness: 320 }, from: 0.7, to: 1 });
  const footIn = 16.15;                          // "20 million" lands at 16.22
  const footOp = fadeInOut(t, footIn, tOut + 1, 0.12);
  const footSc = t >= footIn ? spring({ frame: frame - Math.round(footIn * RIP1_FPS), fps: RIP1_FPS, config: { damping: 12, stiffness: 320 }, from: 0.5, to: 1 }) : 0;
  return (
    <AbsoluteFill style={{ zIndex: 140, pointerEvents: 'none', opacity: op }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, width: 1080, height: RIP1_SEAM, overflow: 'hidden',
        background: 'radial-gradient(circle at 50% 48%, #0c2140 0%, #060f22 55%, #02060f 100%)',
      }}>
        {/* faint grid */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.18,
          backgroundImage: `linear-gradient(${TEAL}33 1px, transparent 1px), linear-gradient(90deg, ${TEAL}33 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />
        {/* header */}
        <div style={{
          position: 'absolute', top: 48, left: 0, width: 1080, textAlign: 'center', fontFamily: FONT, fontWeight: 900,
          fontSize: 74, color: TEAL, letterSpacing: '0.04em', textShadow: `0 0 26px ${TEAL}aa`, transform: `scale(${headSc})`,
        }}>MY BOT CALLED IT</div>
        {/* radar rings + crosshair */}
        {[R, R * 0.66, R * 0.33].map((r, i) => (
          <div key={i} style={{
            position: 'absolute', left: CX - r, top: CY - r, width: r * 2, height: r * 2, borderRadius: '50%',
            border: `${i === 0 ? 4 : 2}px solid ${TEAL}${i === 0 ? 'cc' : '66'}`, boxShadow: i === 0 ? `0 0 30px ${TEAL}55, inset 0 0 40px ${TEAL}22` : undefined,
          }} />
        ))}
        <div style={{ position: 'absolute', left: CX - R, top: CY - 1, width: R * 2, height: 2, background: `${TEAL}55` }} />
        <div style={{ position: 'absolute', left: CX - 1, top: CY - R, width: 2, height: R * 2, background: `${TEAL}55` }} />
        {/* rotating sweep */}
        <div style={{
          position: 'absolute', left: CX - R, top: CY - R, width: R * 2, height: R * 2, borderRadius: '50%',
          background: `conic-gradient(from ${sweep - 70}deg, rgba(57,255,20,0) 0deg, rgba(57,255,20,0.05) 40deg, rgba(57,255,20,0.42) 70deg, rgba(57,255,20,0) 70.5deg)`,
        }} />
        {/* the blip + ping ring + label */}
        {blipOn && (
          <>
            <div style={{
              position: 'absolute', left: bx - 60, top: by - 60, width: 120, height: 120, borderRadius: '50%',
              border: `3px solid ${GREEN}`, opacity: 1 - ring, transform: `scale(${0.2 + ring})`,
            }} />
            <div style={{
              position: 'absolute', left: bx - 18, top: by - 18, width: 36, height: 36, borderRadius: '50%',
              background: GREEN, boxShadow: `0 0 26px ${GREEN}, 0 0 60px ${GREEN}aa`, transform: `scale(${blipSc})`,
            }} />
            <div style={{
              position: 'absolute', left: bx + 34, top: by - 26, fontFamily: FONT, fontWeight: 900, fontSize: 40,
              color: '#fff', background: 'rgba(0,0,0,0.75)', border: `3px solid ${GREEN}`, borderRadius: 12,
              padding: '4px 16px', letterSpacing: '0.05em', transform: `scale(${blipSc})`, transformOrigin: 'left center',
              boxShadow: `0 0 22px ${GREEN}88`,
            }}>PIEVERSE</div>
          </>
        )}
        {/* footer: the number, popped on "20 million" */}
        {t >= footIn && (
          <div style={{
            position: 'absolute', top: 712, left: 0, width: 1080, textAlign: 'center', fontFamily: FONT, fontWeight: 900,
            fontSize: 80, color: YELLOW, letterSpacing: '0.02em', opacity: footOp, transform: `scale(${footSc})`,
            textShadow: `0 0 30px ${YELLOW}88`, WebkitTextStroke: '3px #000', paintOrder: 'stroke fill' as any,
          }}>AT $20M MARKET CAP</div>
        )}
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 5, background: RIP1_ACCENT, boxShadow: `0 0 18px ${RIP1_ACCENT}` }} />
      </div>
    </AbsoluteFill>
  );
};

// ─── LEFT-COLUMN STAMPS x 26-456 (the calculator window starts at x 510; never over its readout) ───────────────────────
const Stamps: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / RIP1_FPS;
  return (
    <AbsoluteFill style={{ zIndex: 135, pointerEvents: 'none' }}>
      {STAMPS_RIP1.map((s, i) => {
        if (t < s.tIn || t >= s.tOut) return null;
        const op = fadeInOut(t, s.tIn, s.tOut, 0.12);
        const sc = spring({ frame: frame - Math.round(s.tIn * RIP1_FPS), fps: RIP1_FPS, config: { damping: 10, stiffness: 340 }, from: 1.6, to: 1 });
        return (
          <div key={i} style={{
            position: 'absolute', left: 26, width: 430, top: s.top, transform: `translateY(-50%) scale(${sc}) rotate(-4deg)`,
            opacity: op, background: 'rgba(0,0,0,0.86)', border: `6px solid ${s.color}`, borderRadius: 24,
            padding: '20px 10px 22px', textAlign: 'center', boxShadow: `0 0 50px ${s.color}88`, fontFamily: FONT, fontWeight: 900,
          }}>
            <div style={{ fontSize: 38, color: '#fff', letterSpacing: '0.08em' }}>{s.line1}</div>
            <div style={{ fontSize: 120, lineHeight: 1.0, color: s.color, textShadow: `0 0 28px ${s.color}aa` }}>{s.big}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const RippingPieverse17x: React.FC = () => (
  <AbsoluteFill>
    <LivestreamShort data={DATA} />
    <RadarCard />
    <Stamps />
    <Cover />
  </AbsoluteFill>
);
export { RIP1_FPS, RIP1_DURATION };

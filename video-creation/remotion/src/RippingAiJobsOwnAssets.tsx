import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from 'remotion';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import { fadeInOut, FONT } from './_kit';
import {
  RIP3_FPS, RIP3_DURATION, RIP3_SEAM, RIP3_CAP_Y, RIP3_ACCENT, RIP3_RED,
  CLIP_RIP3, THUMB_DEF_RIP3, BROLL_RIP3, BADGES_RIP3, SFX_RIP3,
  DIVIDENDS_RIP3, RING_RIP3, STAMP_RIP3,
} from './constants-ripping-ai-jobs-own-assets';
import { CAPTIONS_RIP3 } from './captionsRippingAiJobsOwnAssets';

// batch ripping / clip #3 "It Will Be Crazy Hard to Get Ahead If You Don't Have Assets" (FULL).
// Data wrapper over LivestreamShort + three code-drawn cards (dividends chip, receipt ring, UBI stamp).
const DATA: ShortData = {
  clip: CLIP_RIP3,
  fps: RIP3_FPS,
  durationS: RIP3_DURATION / RIP3_FPS,
  capY: RIP3_CAP_Y,
  seam: RIP3_SEAM,
  accent: RIP3_ACCENT,
  captions: CAPTIONS_RIP3,
  broll: BROLL_RIP3,
  // BADGES_RIP3 are drawn by CodeBadges below (no-wrap), not by LivestreamShort's Badge (it wraps 'ASSET-DRIVEN').
  sounds: SFX_RIP3,
  thumb: THUMB_DEF_RIP3, // ONE frame cover, base from frame 1
};

const GOLD = RIP3_ACCENT;

// Blank gold coin (no symbol: no coin is named in this clip).
const Coin: React.FC<{ size: number; spin: number }> = ({ size, spin }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%', flexShrink: 0,
    background: 'radial-gradient(circle at 35% 30%, #fff2b8 0%, #ffd34d 35%, #e0a10f 75%, #a86f00 100%)',
    boxShadow: `0 0 30px ${GOLD}, inset 0 0 0 7px rgba(255,255,255,0.25), inset 0 0 0 12px rgba(150,95,0,0.55)`,
    transform: `scaleX(${spin})`,
  }} />
);

// C1 / C5: code-drawn badges, single line, never wrapped. Same look as _kit Badge.
const CodeBadges: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / RIP3_FPS;
  return (
    <AbsoluteFill style={{ zIndex: 130, pointerEvents: 'none' }}>
      {BADGES_RIP3.map((b, i) => {
        if (t < b.tIn - 0.1 || t >= b.tOut + 0.1) return null;
        const op = fadeInOut(t, b.tIn, b.tOut, 0.18);
        const sc = spring({ frame: Math.round((t - b.tIn) * RIP3_FPS), fps: RIP3_FPS, config: { damping: 13, stiffness: 320 }, from: 0.6, to: 1.0 });
        return (
          <div key={i} style={{
            position: 'absolute', top: b.top ?? 170, left: 540, transform: `translate(-50%,-50%) scale(${sc})`,
            opacity: op, background: 'rgba(0,0,0,0.82)', border: `5px solid ${b.color}`, borderRadius: 26,
            padding: '24px 48px', textAlign: 'center', boxShadow: `0 0 50px ${b.color}88`, whiteSpace: 'nowrap',
          }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 76, color: b.color, lineHeight: 1, textShadow: `0 0 26px ${b.color}` }}>{b.line1}</div>
            {b.sub && <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: '#fff', letterSpacing: '0.12em', marginTop: 12 }}>{b.sub}</div>}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// C2: "+ DIVIDENDS" chip slides in from the left edge.
const DividendsChip: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / RIP3_FPS;
  const c = DIVIDENDS_RIP3;
  if (t < c.tIn - 0.05 || t >= c.tOut + 0.05) return null;
  const sl = spring({ frame: frame - Math.round(c.tIn * RIP3_FPS), fps: RIP3_FPS, config: { damping: 15, stiffness: 170 } });
  const x = interpolate(sl, [0, 1], [-900, 70]);
  const op = fadeInOut(t, c.tIn, c.tOut, 0.15);
  const spin = Math.cos((t - c.tIn) * 3.2);
  return (
    <AbsoluteFill style={{ zIndex: 140, pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', top: c.top, left: x, transform: 'translateY(-50%)', opacity: op,
        display: 'flex', alignItems: 'center', gap: 30,
        background: 'rgba(0,0,0,0.84)', border: `5px solid ${GOLD}`, borderRadius: 28,
        padding: '22px 44px 22px 30px', boxShadow: `0 0 46px ${GOLD}88`,
      }}>
        <Coin size={118} spin={0.35 + 0.65 * Math.abs(spin)} />
        <div>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 84, color: GOLD, lineHeight: 1, textShadow: `0 0 24px ${GOLD}` }}>+ DIVIDENDS</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: '#fff', letterSpacing: '0.12em', marginTop: 10 }}>FROM WHAT YOU OWN</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// C3: gold ring on Mike's own "AI Is Wiping Out All These Jobs" thumbnail + a pointer chip to its right.
const ReceiptRing: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / RIP3_FPS;
  const r = RING_RIP3;
  if (t < r.tIn - 0.05 || t >= r.tOut + 0.05) return null;
  const op = fadeInOut(t, r.tIn, r.tOut, 0.15);
  const pop = spring({ frame: frame - Math.round(r.tIn * RIP3_FPS), fps: RIP3_FPS, config: { damping: 12, stiffness: 260 }, from: 1.25, to: 1.0 });
  const pulse = 1 + 0.025 * Math.sin((t - r.tIn) * 7);
  const P = 12; // ring sits just outside the thumbnail edge
  const chipPop = spring({ frame: frame - Math.round((r.tIn + 0.25) * RIP3_FPS), fps: RIP3_FPS, config: { damping: 13, stiffness: 300 }, from: 0.6, to: 1.0 });
  const nudge = Math.sin((t - r.tIn) * 8) * 8;
  return (
    <AbsoluteFill style={{ zIndex: 140, pointerEvents: 'none', opacity: op }}>
      <div style={{
        position: 'absolute', left: r.x - P, top: r.y - P, width: r.w + 2 * P, height: r.h + 2 * P,
        border: `9px solid ${GOLD}`, borderRadius: 22, boxSizing: 'border-box',
        boxShadow: `0 0 34px ${GOLD}, inset 0 0 22px ${GOLD}88`, transform: `scale(${pop * pulse})`,
      }} />
      {/* pointer chip over the off-topic thumbnail to the right, arrow aimed at the ring */}
      <div style={{
        position: 'absolute', left: 560 + nudge, top: r.y + r.h / 2, transform: `translateY(-50%) scale(${chipPop})`,
        transformOrigin: 'left center', display: 'flex', alignItems: 'center',
      }}>
        <div style={{
          width: 0, height: 0, borderTop: '34px solid transparent', borderBottom: '34px solid transparent',
          borderRight: `46px solid ${GOLD}`, filter: `drop-shadow(0 0 10px ${GOLD})`,
        }} />
        <div style={{
          background: 'rgba(0,0,0,0.86)', border: `5px solid ${GOLD}`, borderRadius: 22,
          padding: '16px 26px', textAlign: 'center', boxShadow: `0 0 36px ${GOLD}88`,
        }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: GOLD, lineHeight: 1.02 }}>AI IS WIPING</div>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: "#fff", lineHeight: 1.02 }}>OUT JOBS</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// C4: red rubber stamp slams onto the lower content zone.
const UbiStamp: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / RIP3_FPS;
  const s = STAMP_RIP3;
  if (t < s.tIn - 0.05 || t >= s.tOut + 0.05) return null;
  const f = frame - Math.round(s.tIn * RIP3_FPS);
  const sc = spring({ frame: f, fps: RIP3_FPS, config: { damping: 16, stiffness: 420, mass: 0.7 }, from: 2.3, to: 1.0 });
  const op = Math.min(interpolate(f, [0, 3], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    interpolate(t, [s.tOut - 0.15, s.tOut], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  const shake = f >= 3 && f < 9 ? Math.sin(f * 2.6) * (9 - f) * 1.6 : 0;
  return (
    <AbsoluteFill style={{ zIndex: 140, pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', top: s.top, left: 540 + shake, transform: `translate(-50%,-50%) rotate(-8deg) scale(${sc})`,
        opacity: op, border: `11px solid ${RIP3_RED}`, borderRadius: 18, padding: '18px 46px',
        background: 'rgba(20,0,0,0.55)', boxShadow: `0 0 40px ${RIP3_RED}99`, whiteSpace: 'nowrap',
      }}>
        <div style={{
          fontFamily: FONT, fontWeight: 900, fontSize: 96, color: RIP3_RED, letterSpacing: '0.04em', lineHeight: 1,
          textShadow: `0 0 18px ${RIP3_RED}aa`,
        }}>STUCK ON UBI</div>
      </div>
    </AbsoluteFill>
  );
};

export const RippingAiJobsOwnAssets: React.FC = () => (
  <AbsoluteFill>
    <LivestreamShort data={DATA} />
    <CodeBadges />
    <DividendsChip />
    <ReceiptRing />
    <UbiStamp />
  </AbsoluteFill>
);
export { RIP3_FPS, RIP3_DURATION };

import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, useCurrentFrame } from 'remotion';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import { fadeInOut, FONT } from './_kit';
import {
  RIP5_FPS, RIP5_DURATION, RIP5_SEAM, RIP5_CAP_Y, RIP5_ACCENT, RIP5_RED, RIP5_CORAL,
  CLIP_RIP5, THUMB_IMG_RIP5, BROLL_RIP5, BADGES_RIP5, SFX_RIP5,
} from './constants-ripping-anthropic-ipo-money-rotating-out';
import { CAPTIONS_RIP5 } from './captionsRippingAnthropicIpo';

// batch ripping / clip #5 "Why We're Dumping: All This Money Is Rotating Out for the Anthropic IPO" (FULL).
// Data wrapper over LivestreamShort + two code-drawn pieces: the frame-0 cover title block and the RSI-band badges.
const DATA: ShortData = {
  clip: CLIP_RIP5,
  fps: RIP5_FPS,
  durationS: RIP5_DURATION / RIP5_FPS,
  capY: RIP5_CAP_Y,
  seam: RIP5_SEAM,
  accent: RIP5_ACCENT,
  captions: CAPTIONS_RIP5,
  broll: BROLL_RIP5,
  sounds: SFX_RIP5,
  // no `thumb`: the cover is drawn below (the kit Thumb's fixed top 240 would put the chip on the rocket nose, y~560).
};

// ─── FRAME-0 COVER (ONE frame) ────────────────────────────────────────────────────────────────
const Cover: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame !== 0) return null;
  return (
    <AbsoluteFill style={{ zIndex: 400 }}>
      <Img src={THUMB_IMG_RIP5} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.12) 24%, rgba(0,0,0,0) 34%, rgba(0,0,0,0) 82%, rgba(0,0,0,0.4) 100%)' }} />
      <div style={{ position: 'absolute', top: 76, left: 30, right: 30, textAlign: 'center', fontFamily: FONT, fontWeight: 900 }}>
        <div style={{
          fontSize: 100, lineHeight: 1.0, color: '#fff', WebkitTextStroke: '5px #000', paintOrder: 'stroke fill' as any,
          textShadow: '0 7px 0 #000',
        }}>ALL THIS MONEY</div>
        <div style={{
          fontSize: 100, lineHeight: 1.0, color: RIP5_RED, WebkitTextStroke: '5px #000', paintOrder: 'stroke fill' as any,
          textShadow: `0 0 36px ${RIP5_RED}88, 0 7px 0 #000`,
        }}>IS ROTATING OUT</div>
        <div style={{
          marginTop: 26, display: 'inline-block', background: RIP5_CORAL, color: '#1a0a04', fontSize: 50,
          letterSpacing: '0.04em', padding: '14px 34px', borderRadius: 16, boxShadow: `0 0 40px ${RIP5_CORAL}`,
        }}>FOR THE ANTHROPIC IPO</div>
      </div>
    </AbsoluteFill>
  );
};

// ─── RSI-BAND BADGES (C1-C4), single line, never wrapped ───────────────────────────────────────
const DownArrow: React.FC<{ color: string; bob: number }> = ({ color, bob }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `translateY(${bob}px)`, filter: `drop-shadow(0 0 12px ${color})` }}>
    <div style={{ width: 22, height: 34, background: color }} />
    <div style={{ width: 0, height: 0, borderLeft: '34px solid transparent', borderRight: '34px solid transparent', borderTop: `40px solid ${color}` }} />
  </div>
);

const Badges: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / RIP5_FPS;
  return (
    <AbsoluteFill style={{ zIndex: 130, pointerEvents: 'none' }}>
      {BADGES_RIP5.map((b, i) => {
        if (t < b.tIn - 0.05 || t >= b.tOut + 0.05) return null;
        const op = fadeInOut(t, b.tIn, b.tOut, 0.15);
        const sc = spring({ frame: frame - Math.round(b.tIn * RIP5_FPS), fps: RIP5_FPS, config: { damping: 13, stiffness: 320 }, from: 0.6, to: 1.0 });
        const bob = b.arrow ? interpolate(Math.sin((t - b.tIn) * 7), [-1, 1], [-6, 10]) : 0;
        return (
          <div key={i} style={{
            position: 'absolute', top: b.top, left: 540, transform: `translate(-50%,-50%) scale(${sc})`,
            opacity: op, background: 'rgba(0,0,0,0.84)', border: `5px solid ${b.color}`, borderRadius: 26,
            padding: '22px 46px', boxShadow: `0 0 46px ${b.color}88`, whiteSpace: 'nowrap',
            display: 'flex', alignItems: 'center', gap: 26,
          }}>
            {b.arrow && <DownArrow color={b.color} bob={bob} />}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: b.size ?? 74, color: b.color, lineHeight: 1, textShadow: `0 0 24px ${b.color}aa` }}>{b.line1}</div>
              {b.sub && <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: '#fff', letterSpacing: '0.12em', marginTop: 12 }}>{b.sub}</div>}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const RippingAnthropicIpo: React.FC = () => (
  <AbsoluteFill>
    <LivestreamShort data={DATA} />
    <Badges />
    <Cover />
  </AbsoluteFill>
);
export { RIP5_FPS, RIP5_DURATION };

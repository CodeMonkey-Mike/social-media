import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame } from 'remotion';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import { fadeInOut, FONT, YELLOW } from './_kit';
import {
  RIP4_FPS, RIP4_DURATION, RIP4_SEAM, RIP4_CAP_Y, RIP4_ACCENT,
  CLIP_RIP4, THUMB_DEF_RIP4, BROLL_RIP4, OVERLAYS_RIP4, BADGES_RIP4, SFX_RIP4, PRICE_CARD_RIP4,
} from './constants-ripping-hate-eth-go-where-the-money-is';
import { CAPTIONS_RIP4 } from './captionsRippingHateEth';

// batch ripping / clip #4 "I Hate ETH, But One Day It Is Going to Flip Bitcoin" (FULL).
// Data wrapper over LivestreamShort + one code-drawn "$20,000 ETH" card over the CMC Ethereum page.
const DATA: ShortData = {
  clip: CLIP_RIP4,
  fps: RIP4_FPS,
  durationS: RIP4_DURATION / RIP4_FPS,
  capY: RIP4_CAP_Y,
  seam: RIP4_SEAM,
  accent: RIP4_ACCENT,
  captions: CAPTIONS_RIP4,
  broll: BROLL_RIP4,
  overlays: OVERLAYS_RIP4,
  badges: BADGES_RIP4,
  sounds: SFX_RIP4,
  thumb: THUMB_DEF_RIP4, // ONE frame cover, base from frame 1
};

const PriceCard: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / RIP4_FPS;
  const c = PRICE_CARD_RIP4;
  if (t < c.tIn - 0.05 || t >= c.tOut + 0.1) return null;
  const op = fadeInOut(t, c.tIn, c.tOut, 0.18);
  const sc = spring({ frame: frame - Math.round(c.tIn * RIP4_FPS), fps: RIP4_FPS, config: { damping: 13, stiffness: 320 }, from: 0.6, to: 1.0 });
  return (
    <AbsoluteFill style={{ zIndex: 140, pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', top: c.top, left: '50%', transform: `translate(-50%,-50%) scale(${sc})`, opacity: op,
        background: 'rgba(0,0,0,0.84)', border: `5px solid ${RIP4_ACCENT}`, borderRadius: 26,
        padding: '22px 54px', textAlign: 'center', boxShadow: `0 0 50px ${RIP4_ACCENT}99`,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 22 }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 96, color: YELLOW, lineHeight: 1, textShadow: `0 0 24px ${YELLOW}aa` }}>$20,000</div>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 70, color: '#a99bff', lineHeight: 1, textShadow: `0 0 22px ${RIP4_ACCENT}` }}>ETH</div>
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: '#fff', letterSpacing: '0.12em', marginTop: 14, whiteSpace: 'nowrap' }}>
          "REALLY CONSERVATIVE" · 10 YEARS
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const RippingHateEth: React.FC = () => (
  <AbsoluteFill>
    <LivestreamShort data={DATA} />
    <PriceCard />
  </AbsoluteFill>
);
export { RIP4_FPS, RIP4_DURATION };

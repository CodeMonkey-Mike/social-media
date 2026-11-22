import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame } from 'remotion';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import { fadeInOut, FONT } from './_kit';
import {
  RIP2_FPS, RIP2_DURATION, RIP2_SEAM, RIP2_CAP_Y, RIP2_ACCENT,
  CLIP_RIP2, THUMB_DEF_RIP2, BROLL_RIP2, OVERLAYS_RIP2, BADGES_RIP2, SFX_RIP2, VS_CARD_RIP2,
} from './constants-ripping-calls-ripping-on-a-red-day';
import { CAPTIONS_RIP2 } from './captionsRippingCallsRedDay';

// batch ripping / clip #2 "Only 3 Green Bubbles Out of 100, and My Plays Are Ripping Again" (FULL).
// Data wrapper over LivestreamShort + one code-drawn pump/dump card.
const DATA: ShortData = {
  clip: CLIP_RIP2,
  fps: RIP2_FPS,
  durationS: RIP2_DURATION / RIP2_FPS,
  capY: RIP2_CAP_Y,
  seam: RIP2_SEAM,
  accent: RIP2_ACCENT,
  captions: CAPTIONS_RIP2,
  broll: BROLL_RIP2,
  overlays: OVERLAYS_RIP2,
  badges: BADGES_RIP2,
  sounds: SFX_RIP2,
  thumb: THUMB_DEF_RIP2, // ONE frame cover, base from frame 1
};

const RED = '#ff2a3d';

const Tri: React.FC<{ up: boolean; color: string }> = ({ up, color }) => (
  <div style={{
    width: 0, height: 0, borderLeft: '26px solid transparent', borderRight: '26px solid transparent',
    ...(up ? { borderBottom: `40px solid ${color}` } : { borderTop: `40px solid ${color}` }),
    filter: `drop-shadow(0 0 10px ${color})`, marginRight: 16,
  }} />
);

const Half: React.FC<{ t: number; tIn: number; tOut: number; up: boolean; color: string; word: string; who: string }> =
({ t, tIn, tOut, up, color, word, who }) => {
  const frame = useCurrentFrame();
  if (t < tIn - 0.05 || t >= tOut + 0.1) return <div style={{ width: 470 }} />;
  const op = fadeInOut(t, tIn, tOut, 0.18);
  const sc = spring({ frame: frame - Math.round(tIn * RIP2_FPS), fps: RIP2_FPS, config: { damping: 13, stiffness: 320 }, from: 0.6, to: 1.0 });
  return (
    <div style={{
      width: 470, opacity: op, transform: `scale(${sc})`, background: 'rgba(0,0,0,0.82)',
      border: `5px solid ${color}`, borderRadius: 24, padding: '22px 10px', textAlign: 'center',
      boxShadow: `0 0 44px ${color}88`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Tri up={up} color={color} />
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 70, color, lineHeight: 1, textShadow: `0 0 22px ${color}` }}>{word}</div>
      </div>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: '#fff', letterSpacing: '0.1em', marginTop: 12 }}>{who}</div>
    </div>
  );
};

const PumpDumpCard: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / RIP2_FPS;
  const c = VS_CARD_RIP2;
  if (t < c.tIn - 0.05 || t >= c.tOut + 0.1) return null;
  return (
    <AbsoluteFill style={{ zIndex: 140, pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', top: c.top, left: 0, width: 1080, transform: 'translateY(-50%)',
        display: 'flex', justifyContent: 'center', gap: 40,
      }}>
        <Half t={t} tIn={c.tIn} tOut={c.tOut} up color={RIP2_ACCENT} word="PUMPING" who="MY PLAYS" />
        <Half t={t} tIn={c.tInRight} tOut={c.tOut} up={false} color={RED} word="DUMPING" who="EVERYBODY ELSE" />
      </div>
    </AbsoluteFill>
  );
};

export const RippingCallsRedDay: React.FC = () => (
  <AbsoluteFill>
    <LivestreamShort data={DATA} />
    <PumpDumpCard />
  </AbsoluteFill>
);
export { RIP2_FPS, RIP2_DURATION };

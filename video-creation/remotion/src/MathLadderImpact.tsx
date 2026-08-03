import React from 'react';
import { AbsoluteFill, useCurrentFrame, spring, interpolate } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Montserrat';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import { FONT, fadeInOut } from './_kit';
import {
  MLI_FPS, MLI_DURATION, MLI_SEAM, MLI_CAP_Y,
  CLIP_MLI, THUMB_DEF_MLI, BROLL_MLI, SFX_MLI,
  LADDER_RUNGS, LADDER_IN, LADDER_OUT, LADDER_FADE,
  CLIMAX_IN, CLIMAX_SWAP, CLIMAX_OUT,
} from './constants-mli';
// Captions come from the CANONICAL captions skill output for this clip
// (skills/captions/build_captions.py --style montserrat), with only the DOCUMENTED STT-garble /
// multiplier fixes listed in that file's header. Never hand-authored, never lifted from another comp.
import { CAPTIONS_1000X_MATH_LADDER_IMPACT } from './captionsMli';

// Montserrat 900 = the house caption/badge face; register it so text rasterizes reliably.
loadFont('normal', { weights: ['900'], subsets: ['latin'], ignoreTooManyRequestsWarning: true });

// batch what-if-1000x / clip #6 "Five Lose. One Does 1000x." (variant: short / impact).
//
// Layer model = the shared, b-roll-capable LivestreamShort renderer (base video + BrollLayer +
// scrim + captions + frame-0 thumb + SFX) with ONE extra layer on top: the escalating LADDER.
// The clip is 24 s and number-dense, so the ladder numbers are the visual spine and the generated
// b-roll count stays at 4 (see constants-mli.ts / BROLL-PLAN.md for the coverage budget).
const DATA: ShortData = {
  clip: CLIP_MLI,
  fps: MLI_FPS,
  durationS: MLI_DURATION / MLI_FPS,
  capY: MLI_CAP_Y,
  seam: MLI_SEAM,
  captions: CAPTIONS_1000X_MATH_LADDER_IMPACT,
  broll: BROLL_MLI,
  sounds: SFX_MLI,
  thumb: THUMB_DEF_MLI, // durS omitted => ONE frame (frame-0 cover), base video from frame 1
};

// ─── the escalating rung stack ──────────────────────────────────────────────────────────────────
// Right column of the CONTENT zone only (x 566..1040 of 1080, y 398..790 of the 0..854 zone), so the
// left ~52% of the screen-share stays visible underneath and the webcam below is never touched.
// Rungs stack UPWARD (2X lowest) so the eye climbs; a rail grows up the left edge as each lands.
const ROW_H = 86;
const GAP = 16;
const STACK_BOTTOM = 790;   // lowest pixel of the stack; captions sit at y 900 (band top ~850)
const COL_LEFT = 566;
const COL_WIDTH = 424;      // right edge = 990, i.e. the rightmost 90 px stay clear (platform action buttons)
const RAIL_LEFT = 536;
const rowTop = (i: number) => STACK_BOTTOM - ROW_H - i * (ROW_H + GAP);

const RungStack: React.FC<{ t: number; fps: number }> = ({ t, fps }) => {
  if (t < LADDER_IN || t >= LADDER_OUT) return null;
  const visible = LADDER_RUNGS.filter((r) => t >= r.t);
  if (!visible.length) return null;
  const newestIdx = visible.length - 1;
  const newest = visible[newestIdx];
  const op = interpolate(
    t,
    [LADDER_IN, LADDER_IN + LADDER_FADE, LADDER_OUT - LADDER_FADE, LADDER_OUT],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  // rail climbs from the previous rung's top to the new rung's top over 0.28 s
  const prevTop = newestIdx > 0 ? rowTop(newestIdx - 1) : STACK_BOTTOM;
  const grow = interpolate(t, [newest.t, newest.t + 0.28], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const railTop = prevTop + (rowTop(newestIdx) - prevTop) * grow;
  return (
    <AbsoluteFill style={{ opacity: op, zIndex: 140, pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', left: RAIL_LEFT, width: 6, top: railTop, height: Math.max(0, STACK_BOTTOM - railTop),
        borderRadius: 3, background: `linear-gradient(180deg, ${newest.color} 0%, rgba(0,229,255,0.25) 100%)`,
        boxShadow: `0 0 18px ${newest.color}88`,
      }} />
      {visible.map((r, i) => {
        const age = t - r.t;
        const sc = spring({ frame: Math.round(age * fps), fps, config: { damping: 12, stiffness: 320 }, from: 0.55, to: 1.0 });
        const slide = interpolate(age, [0, 0.3], [72, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        const isNew = i === newestIdx;
        return (
          <div key={r.mult} style={{
            position: 'absolute', top: rowTop(i), left: COL_LEFT, width: COL_WIDTH, height: ROW_H,
            transform: `translateX(${slide}px) scale(${sc})`, transformOrigin: 'left center',
            opacity: isNew ? 1 : 0.88,
            // near-opaque on purpose: at 0.80 the CoinMarketCap page underneath bled through the
            // chips and the rung text stopped reading (caught on a QA still at t=19.0 s).
            background: 'rgba(4,10,16,0.94)', border: `4px solid ${r.color}`, borderRadius: 18,
            boxShadow: isNew ? `0 0 46px ${r.color}aa` : `0 0 16px ${r.color}55`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 26px',
          }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, letterSpacing: '0.14em', color: '#fff', opacity: 0.85 }}>
              {r.coin}
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 62, lineHeight: 1, color: r.color, textShadow: `0 0 26px ${r.color}` }}>
              {r.mult}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ─── the payoff number ──────────────────────────────────────────────────────────────────────────
// Its own vertical band (y 400..720), centred over the climax full-screen b-roll. The rung stack is
// fully faded 0.18 s BEFORE this appears and the captions live 380 px below at y 900, so no two
// graphics ever share time AND space.
const ClimaxNumber: React.FC<{ t: number; fps: number }> = ({ t, fps }) => {
  if (t < CLIMAX_IN || t >= CLIMAX_OUT) return null;
  const op = fadeInOut(t, CLIMAX_IN, CLIMAX_OUT, 0.14);
  const swapped = t >= CLIMAX_SWAP;
  const anchor = swapped ? CLIMAX_SWAP : CLIMAX_IN;
  const sc = spring({
    frame: Math.round((t - anchor) * fps), fps,
    config: { damping: 11, stiffness: 340 }, from: swapped ? 0.74 : 0.5, to: 1.0,
  });
  return (
    <AbsoluteFill style={{ opacity: op, zIndex: 140, pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', top: 400, left: 40, right: 40, textAlign: 'center',
        fontFamily: FONT, fontWeight: 900, fontSize: 42, letterSpacing: '0.18em', color: '#fff',
        WebkitTextStroke: '8px #000', paintOrder: 'stroke fill' as any,
      }}>
        YOUR REAL WINNER
      </div>
      <div style={{
        position: 'absolute', top: 470, left: 20, right: 20, textAlign: 'center',
        fontFamily: FONT, fontWeight: 900, fontSize: swapped ? 250 : 200, lineHeight: 1,
        color: '#39ff14', WebkitTextStroke: '18px #000', paintOrder: 'stroke fill' as any,
        textShadow: '0 0 60px rgba(57,255,20,0.85)', transform: `scale(${sc})`,
      }}>
        {swapped ? '1000X' : '900X'}
      </div>
    </AbsoluteFill>
  );
};

const LadderLayer: React.FC<{ fps: number }> = ({ fps }) => {
  const frame = useCurrentFrame();
  const t = frame / fps;
  // HARD RULE (SKILL Phase 7 rule #3): no timed graphic may render while the frame-0 thumbnail cover
  // is up. Both windows below start at 11.55 s / 21.62 s, so this is belt-and-braces.
  if (frame < 1) return null;
  return (
    <>
      <RungStack t={t} fps={fps} />
      <ClimaxNumber t={t} fps={fps} />
    </>
  );
};

export const MathLadderImpact: React.FC = () => (
  <AbsoluteFill>
    <LivestreamShort data={DATA} />
    <LadderLayer fps={MLI_FPS} />
  </AbsoluteFill>
);

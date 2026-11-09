// WhiteboardDemo.tsx: the FIRST 15-second demo of the code-rendered whiteboard track (Mike, 2026-10-30):
// the hand-drawn-with-hair vocabulary through the paper-pastel pen ("paper and pencil"). 1920x1080 @30, 450 frames,
// no audio. Everything on screen is SVG drawn through rough.js (whiteboard/Sketch.tsx) with fixed seeds: no boil,
// deterministic across renders. The storyboard is the CUES table below: every event is a cue time in seconds and the
// components draw themselves on from their cue, so re-timing the demo is editing numbers, not code.
// Render (chunked, queued, like every longform render): see video-creation/whiteboard/whiteboard.md.
import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont as loadGochi } from '@remotion/google-fonts/GochiHand';
import { loadFont as loadKalam } from '@remotion/google-fonts/Kalam';
import { loadFont as loadRockSalt } from '@remotion/google-fonts/RockSalt';
import { loadFont as loadHandlee } from '@remotion/google-fonts/Handlee';
import { PENS } from './whiteboard/pen';
import { BarChart, Check, Coin, CountUp, DashedArc, Envelope, Person, Strike, Type, Vault, bezier } from './whiteboard/vocab';

const { fontFamily: GOCHI } = loadGochi();
const { fontFamily: KALAM } = loadKalam('normal', { weights: ['400', '700'] });
const { fontFamily: ROCKSALT } = loadRockSalt();
const { fontFamily: HANDLEE } = loadHandlee();
const FONTS: Record<string, string> = { 'Gochi Hand': GOCHI, Kalam: KALAM, 'Rock Salt': ROCKSALT, Handlee: HANDLEE };

export const FPS = 30;
export const DUR = 15 * FPS;


// ---- the storyboard (seconds) ----
const CUES = {
  heading: 0.0,
  person: 0.8, personLabel: 2.0,
  arc: 2.4, envelopePop: 2.6, envelopeFly: 2.9, envelopeFlyDur: 1.2, feeLabel: 3.2,
  vault: 4.0, vaultLabel: 4.9, dialSpin: 4.9,
  coins: [5.2, 5.5, 5.8], check: 6.3,
  chart: 7.0, bars: [7.4, 7.8, 8.2], pct: 8.3, chartLabel: 8.6,
  middlemen: 9.6, strike: 10.2,
  pushIn: 11.4, pushInDur: 2.0, payoff: 12.0,
};

// geometry shared by the arc and the envelope flight
const ARC_P0: [number, number] = [452, 702];   // the phone in the person's hand
const ARC_P1: [number, number] = [800, 330];
const ARC_P2: [number, number] = [1192, 480];  // the vault's left edge

export const WhiteboardDemo: React.FC<{ penId?: string }> = ({ penId = 'paper-pastel' }) => {
  const PEN = PENS[penId] ?? PENS['paper-pastel'];
  const GOCHI = FONTS[PEN.fontH], KALAM = FONTS[PEN.fontL];
  const H = (s: string) => (PEN.caps ? s.toUpperCase() : s);
  const headSize = PEN.caps ? 50 : 96;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = frame / fps;                     // absolute seconds
  const at = (cue: number) => T - cue;       // local time since a cue (negative = not yet)

  // camera: a gentle push-in toward the vault for the payoff line
  const zoom = interpolate(T, [CUES.pushIn, CUES.pushIn + CUES.pushInDur], [1, 1.1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
  const camX = 1100, camY = 620;

  // the envelope flies along the arc, then fades into the vault
  const flyU = interpolate(at(CUES.envelopeFly), [0, CUES.envelopeFlyDur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad) });
  const [ex, ey] = bezier(ARC_P0, ARC_P1, ARC_P2, flyU);
  const envOpacity = interpolate(at(CUES.envelopeFly), [CUES.envelopeFlyDur, CUES.envelopeFlyDur + 0.3], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const spin = interpolate(at(CUES.dialSpin), [0, 0.6], [0, 90], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });

  return (
    <AbsoluteFill style={{ backgroundColor: PEN.bg }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: 'absolute', left: 0, top: 0 }}>
        <defs><filter id="glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
        {PEN.floor && <rect x={0} y={660} width={1920} height={420} fill={PEN.floor} />}
        <g filter={PEN.glow ? 'url(#glow)' : undefined} transform={`translate(${camX} ${camY}) scale(${zoom}) translate(${-camX} ${-camY})`}>
          {/* heading */}
          <Type x={960} y={150} text={H("Where the yield really comes from")} t={at(CUES.heading)} cps={26} size={headSize} font={GOCHI} color={PEN.colorH} weight="700" charW={PEN.charWH} />

          {/* you, holding a phone */}
          <Person x={330} gy={880} t={at(CUES.person)} pen={PEN} seed={1} hair="cap" shirt={PEN.palette.green} tie phone />
          <Type x={330} y={940} text="you" t={at(CUES.personLabel)} size={44} font={KALAM} color={PEN.colorL} charW={PEN.charWL} />

          {/* the fee flies to the vault */}
          <DashedArc p0={ARC_P0} p1={ARC_P1} p2={ARC_P2} t={at(CUES.arc)} pen={PEN} seed={2} />
          {at(CUES.envelopePop) > 0 && envOpacity > 0 && <Envelope cx={ex} cy={ey - 22} t={at(CUES.envelopePop)} pen={PEN} seed={30} opacity={envOpacity} />}
          <Type x={800} y={300} text="the fee" t={at(CUES.feeLabel)} size={40} font={KALAM} color={PEN.colorL} charW={PEN.charWL} />

          {/* the vault */}
          <Vault x={1210} y={400} t={at(CUES.vault)} pen={PEN} seed={4} spin={spin} />
          <Type x={1370} y={790} text="the vault" t={at(CUES.vaultLabel)} size={44} font={KALAM} color={PEN.colorL} charW={PEN.charWL} />

          {/* coins + check */}
          {([[1660, 640], [1700, 560], [1640, 480]] as [number, number][]).map(([cx, cy], i) => (
            <Coin key={i} cx={cx} cy={cy} t={at(CUES.coins[i])} pen={PEN} seed={50 + i} font={GOCHI} />
          ))}
          <Check x={1600} y={380} t={at(CUES.check)} pen={PEN} seed={60} />

          {/* fees paid out: the bar chart */}
          <BarChart x={760} baseline={960} t={at(CUES.chart)} barAt={CUES.bars.map((b) => b - CUES.chart)} pen={PEN} seed={7}
            bars={[{ h: 80, fill: PEN.palette.blue }, { h: 150, fill: PEN.palette.blue }, { h: 240, fill: PEN.palette.gold }]} />
          <CountUp x={1040} y={698} to={20} suffix="%" t={at(CUES.pct)} size={44} font={GOCHI} color={PEN.colorH} />
          <Type x={950} y={1006} text="fees paid out" t={at(CUES.chartLabel)} size={40} font={KALAM} color={PEN.colorL} charW={PEN.charWL} />

          {/* middlemen, struck */}
          <Type x={1370} y={930} text={H("middlemen")} t={at(CUES.middlemen)} cps={22} size={PEN.caps ? 40 : 56} font={GOCHI} color={PEN.colorL} charW={PEN.charWH} />
          <Strike x1={1255} x2={1565} y={912} t={at(CUES.strike)} pen={PEN} seed={70} />

          {/* payoff */}
          <Type x={860} y={600} text="the vault pays you back" t={at(CUES.payoff)} size={52} font={KALAM} color={PEN.colorH} weight="700" charW={PEN.charWL} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

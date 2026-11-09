// whiteboard/beats/JctSmartRender.tsx: the JCT video's whiteboard beat (longform-presentation standard format, overlay
// `ov4-wb-split`, brief: media/standard/JCT/overlays/ov4-wb-split.brief.md). He says: "Smart Render ... splits one render
// across many GPUs. Claim 16.7 times faster, a 4K animation in 15 minutes instead of about four hours, their own
// benchmark." One canvas, four micro-scenes, nothing clears: (1) SPLIT: one film strip (the render) fans out into a 4 x 3
// grid of graphics cards whose fans spin; (2) FASTER: "CLAIM: 16.7X FASTER", each part on its own spoken word; (3) TIME:
// a zero line, a short cyan bar (12 nodes, ~15 min) and a long red bar (1 GPU, ~4 hours) at TRUE scale (15 : 250 min);
// (4) the caveat "THEIR OWN BENCHMARK".
// Canvas = the deck area, 1464 x 1080 @30, 13.0 s (spine 449.3 to 462.3) = 390 frames (the caller's window), no audio;
// the compositor (card_overlays.py) fades it in and out. Pen: neon-ink (Mike, 2026-11-08). SVG through rough.js, fixed
// seeds (no boil, deterministic). The storyboard is the CUES table: LOCAL seconds (0 = spine 449.3), each hung on a
// spoken word. The onsets were RE-MEASURED on the audio (2026-11-08): the spine's words JSON has "16" at 3.32 and
// ".7" at 4.54, but transcribing each speech island between the desilencer's joins shows a filler "uh" at 2.45,
// "Claim" 2.85, "sixteen" 3.85, "point" 4.70, "seven" 4.95, "times" 5.70, "faster" 6.15, "a" 7.10, "4K" 7.55,
// "in" 8.90, "fifteen" 9.70, "four" 11.05, "their" 11.95.
// Facts on screen: RESEARCH.md 2.3 (Smart Render: a 4K / 30-frame Blender animation across 12 NODES in ~15 min vs
// ~4 h 10 min on ONE GPU = 16.7x faster, "internal benchmark", project claim; do-not-air: the 16.7x only as a claim).
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont as loadGochi } from '@remotion/google-fonts/GochiHand';
import { loadFont as loadKalam } from '@remotion/google-fonts/Kalam';
import { loadFont as loadRockSalt } from '@remotion/google-fonts/RockSalt';
import { loadFont as loadHandlee } from '@remotion/google-fonts/Handlee';
import { PENS } from '../pen';
import { Type } from '../vocab';
import { CurvedArrow } from '../money';
import { AxisLine, FilmStrip, GpuCard, SpokenDecimal, TimeBar, WipeText, spinAngle } from '../compute';

const { fontFamily: GOCHI } = loadGochi();
const { fontFamily: KALAM } = loadKalam('normal', { weights: ['400', '700'] });
const { fontFamily: ROCKSALT } = loadRockSalt();
const { fontFamily: HANDLEE } = loadHandlee();
const FONTS: Record<string, string> = { 'Gochi Hand': GOCHI, Kalam: KALAM, 'Rock Salt': ROCKSALT, Handlee: HANDLEE };

export const FPS = 30;
/** 13.0 s x 30 = 390 frames: the brief's / the compositor's window (spine 449.3 to 462.3) */
export const DUR = 397;
export const W = 1464;
export const H = 1080;

// ---- the storyboard: LOCAL seconds (spine seconds minus 449.3), the word each cue hangs on ----
const CUES = {
  strip: 0.36,        // "one"          the film strip (the render) draws on, its cubes last
  stripLabel: 0.58,   // "render"       "ONE RENDER" types under it
  fan: 0.92,          // "across"       three arrows fan out from the strip to the grid's rows
  gpus: 1.18,         // "many"         12 graphics cards draw on in a wave from the arrows outward; fans spin once drawn
  gpuLabel: 1.45,     // "GPUs"         "MANY GPUS" types under the grid
  claim: 2.85,        // "Claim"        "CLAIM:" (grey) types: the number airs only as a claim
  n16: 3.85,          // "sixteen"      "16" wipes on (gold)
  dot: 4.70,          // "point"        the decimal point pops (a drawn dot)
  n7: 4.95,           // "seven"        "7" wipes on
  times: 5.70,        // "times"        "X" wipes on
  faster: 6.15,       // "faster"       "FASTER" wipes on
  title: 7.55,        // "4K"           "4K ANIMATION" types: the chart's title
  axis: 8.90,         // "in"           the zero line draws
  short: 9.70,        // "fifteen"      "12 NODES" + the short cyan bar snaps in
  shortVal: 9.85,     // "fifteen min-" "~15 MIN" types after it
  fansStop: 10.12,    // "minutes"      the 12 nodes are done: their fans spin down to rest (0.6 s) while the 1 GPU keeps going
  long: 10.44,        // "instead"      "1 GPU" types
  longBar: 10.66,     // "of"           the long red bar grows at a steady pace, landing on "hours" (11.70)
  longBarDur: 1.04,
  longVal: 11.50,     // "hours"        "~4 HOURS" types, done as the bar lands
  caveat: 11.95,      // "their"        "THEIR OWN BENCHMARK" wipes on (grey); held ~0.45 s before the 0.3 s fade at 12.7
};

// ---- layout (canvas px). The right edge abuts Mike's webcam column in the composite: ink stays <= ~1410. ----
const STRIP = { x: 80, y: 181, w: 340, h: 172 };
const GRID = { x: 710, y: 110, cols: 4, rows: 3, w: 140, h: 78, dx: 170, dy: 118 };
const rowCY = (r: number) => GRID.y + r * GRID.dy + GRID.h / 2;
const FAN0: [number, number] = [STRIP.x + STRIP.w + 16, STRIP.y + STRIP.h / 2];
const FAN_TIP_X = GRID.x - 22;
// the heading row. Measured on the round-1 still (Rock Salt 84 px): "1" 504-527, "6" 542-612, the dot 633-646, and the
// "7" ~67 px wide, so with the suffix at 0.7 em the "7" and the "X" fused into one run (659-782, could read "16.7K"):
// the "X" now starts a full em after the "7" (`fracW` 1.0) and the whole row moved 14 px left to stay centred on the
// canvas. Round-2 still: "7" 645-712, "X" 724-793 (12 px of core-ink air), "FASTER" 834-1148, "CLAIM:" from 317.
const HEAD = { y: 600, dotX: 626, size: 84, fSize: 62, fracW: 1.0, fasterX: 833, claimEnd: 456 };
// the time chart: the zero line, two rows; the long bar = 250 min (~4 h 10 min), the short one 15 min at the same scale
const CHART = { axisX: 420, titleY: 702, top: 722, bottom: 902, cy1: 760, cy2: 860, long: 786 };
const SHORT_LEN = (CHART.long * 15) / 250;

export const JctSmartRender: React.FC<{ penId?: string }> = ({ penId = 'neon-ink' }) => {
  const PEN = PENS[penId] ?? PENS['neon-ink'];
  const FH = FONTS[PEN.fontH], FL = FONTS[PEN.fontL];
  const C = (s: string) => (PEN.caps ? s.toUpperCase() : s);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = frame / fps;                 // local seconds
  const at = (cue: number) => T - cue;   // time since a cue (negative = not yet)

  const L = PEN.colorL, GOLD = PEN.colorH, CYAN = PEN.palette.blue, RED = PEN.palette.red, MUTED = PEN.dark;
  const lblW = PEN.charWL;

  return (
    <AbsoluteFill style={{ backgroundColor: PEN.bg }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <g filter={PEN.glow ? 'url(#glow)' : undefined}>
          {/* ===== scene 1: one render, split across many GPUs ===== */}
          <FilmStrip {...STRIP} t={at(CUES.strip)} pen={PEN} seed={1} />
          <Type x={STRIP.x + STRIP.w / 2} y={STRIP.y + STRIP.h + 52} text={C('one render')} t={at(CUES.stripLabel)} cps={24} size={36} font={FL} color={L} charW={lblW} />
          {[1, 0, 2].map((r, k) => {
            const ty = rowCY(r), mid = (FAN0[0] + FAN_TIP_X) / 2;
            return (
              <CurvedArrow key={r} p0={FAN0} p1={[FAN0[0] + 100, FAN0[1]]} p1b={[mid + 30, ty]} p2={[FAN_TIP_X, ty]} t={at(CUES.fan + k * 0.06)} pen={PEN} seed={20 + r * 2}
                dur={0.5} strokeWidth={PEN.inkWidth + 1.4} head={22} sequential />
            );
          })}
          {Array.from({ length: GRID.rows * GRID.cols }).map((_, i) => {
            const r = Math.floor(i / GRID.cols), c = i % GRID.cols;
            const t0 = CUES.gpus + c * 0.09 + r * 0.05, tc = T - t0;
            // the fans spin once the card is drawn (0.55 s), each card its own phase and a slightly different speed, and
            // spin down to rest when the 12-node job is done ("15 minutes"), so the last scene's board is still
            const spin = (i * 29) % 120 + spinAngle(T, t0 + 0.55, 160 + (i % 3) * 20, CUES.fansStop, 0.6);
            return <GpuCard key={i} x={GRID.x + c * GRID.dx} y={GRID.y + r * GRID.dy} w={GRID.w} h={GRID.h} t={tc} pen={PEN} seed={40 + i} spin={spin} />;
          })}
          <Type x={GRID.x + ((GRID.cols - 1) * GRID.dx + GRID.w) / 2} y={GRID.y + (GRID.rows - 1) * GRID.dy + GRID.h + 60} text={C('many gpus')} t={at(CUES.gpuLabel)} cps={24} size={36} font={FL} color={L} charW={lblW} />

          {/* ===== scene 2: claim 16.7x faster ===== */}
          <Type x={HEAD.claimEnd} y={HEAD.y - 8} text={C('claim:')} t={at(CUES.claim)} cps={24} size={38} font={FL} color={MUTED} anchor="end" charW={lblW} />
          <SpokenDecimal x={HEAD.dotX} y={HEAD.y} int="16" frac="7" suffix="X" tInt={at(CUES.n16)} tDot={at(CUES.dot)} tFrac={at(CUES.n7)} tSuffix={at(CUES.times)}
            size={HEAD.size} font={FH} color={GOLD} fracW={HEAD.fracW} idBase="h167" />
          <WipeText x={HEAD.fasterX} y={HEAD.y} text={C('faster')} t={at(CUES.faster)} dur={0.45} size={HEAD.fSize} font={FH} color={GOLD} charW={PEN.charWH} id="hfaster" />

          {/* ===== scene 3: 15 minutes instead of about four hours ===== */}
          <Type x={CHART.axisX} y={CHART.titleY} text={C('4k animation')} t={at(CUES.title)} cps={24} size={36} font={FL} color={L} anchor="start" charW={lblW} />
          <AxisLine x={CHART.axisX} y1={CHART.top} y2={CHART.bottom} t={at(CUES.axis)} pen={PEN} seed={90} />
          <Type x={CHART.axisX - 22} y={CHART.cy1 + 12} text={C('12 nodes')} t={at(CUES.short)} cps={30} size={36} font={FL} color={CYAN} anchor="end" charW={lblW} />
          <TimeBar x={CHART.axisX} cy={CHART.cy1} len={SHORT_LEN} t={at(CUES.short)} dur={0.25} pen={PEN} seed={91} color={CYAN} />
          <Type x={CHART.axisX + SHORT_LEN + 22} y={CHART.cy1 + 12} text={C('~15 min')} t={at(CUES.shortVal)} cps={26} size={36} font={FL} color={CYAN} anchor="start" charW={lblW} />
          <Type x={CHART.axisX - 22} y={CHART.cy2 + 12} text={C('1 gpu')} t={at(CUES.long)} cps={26} size={36} font={FL} color={RED} anchor="end" charW={lblW} />
          <TimeBar x={CHART.axisX} cy={CHART.cy2} len={CHART.long} t={at(CUES.longBar)} dur={CUES.longBarDur} linear pen={PEN} seed={93} color={RED} />
          <Type x={CHART.axisX + CHART.long + 22} y={CHART.cy2 + 12} text={C('~4 hours')} t={at(CUES.longVal)} cps={30} size={36} font={FL} color={RED} anchor="start" charW={lblW} />

          {/* ===== scene 4: their own benchmark ===== */}
          <WipeText x={W / 2} y={968} text={C('their own benchmark')} t={at(CUES.caveat)} dur={0.3} size={34} font={FL} color={MUTED} anchor="middle" charW={lblW} id="caveat" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

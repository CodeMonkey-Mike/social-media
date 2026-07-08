import React from 'react';
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { TransitionProps } from '../types';
import { WrapLayer } from '../WrapLayer';

export type MonitorJolt = { t0: number; t1: number; dx: number; dy: number };
export type MonitorRollKf = { t: number; dy: number };

export type GlitchCinematicMonitorParams = {
  /** REAL t1 "Texture Adjustment" windows: full-frame wrap Offset per time window. */
  jolts: MonitorJolt[];
  /** REAL t3 "HST Adjustment" keyframed Offset — small vertical jitter roll. */
  roll: MonitorRollKf[];
  /** REAL t2 Wave Warp params (type 7, height=amplitude px, width=wavelength px, speed). */
  wave: { type: number; height: number; width: number; speed: number };
  /** REAL t4 overlay plate (color bars / static noise) frames + blend. */
  plateDir: string;
  plateCount: number;
  /** Media in-point of the plate in the source sequence, seconds (it does not
   * start at 0 — Max plays from 0.08s, Min from 0.24s, Short from 0.16-0.2s). */
  plateIn: number;
  plateBlend: string;
  plateOpacity: number;
  /** A->B cut fraction (the t4 plate clip's split point in the source sequence). */
  swapAt: number;
};

/** Deterministic hash -> [0,1). Seeded by (band, epoch) so renders are stable. */
const hash = (a: number, b: number) => {
  let h = Math.imul(a ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul(b + 0x6d2b79f5, 0xc2b2ae35);
  h = Math.imul(h ^ (h >>> 13), 0x27d4eb2f);
  return ((h ^ (h >>> 15)) >>> 0) / 4294967296;
};

const sampleRoll = (kf: MonitorRollKf[], t: number): number => {
  if (!kf.length) return 0;
  if (t <= kf[0].t) return kf[0].dy;
  for (let i = 0; i < kf.length - 1; i++) {
    const a = kf[i], b = kf[i + 1];
    if (t >= a.t && t <= b.t) {
      const f = (t - a.t) / (b.t - a.t || 1);
      return a.dy + (b.dy - a.dy) * f;
    }
  }
  return kf[kf.length - 1].dy;
};

/** Wrap any offset fraction into [-0.5, 0.5) so the 3x3 WrapLayer tiles always cover
 * (source jolts go past a full frame, e.g. Short-3 dy=-1.02). */
const wrapFrac = (v: number) => ((v % 1) + 1.5) % 1 - 0.5;

/** Quantized displacement buckets for the wave-warp strips, as fractions of the
 * amplitude. The source effect (Wave Warp type 7) displaces row bands by varying
 * amounts; we render one masked copy per bucket (untorn rows show the base copy). */
const BUCKETS = [-1, -0.66, -0.33, 0.33, 0.66, 1];
/** How often the tear pattern re-rolls, in epochs per wave cycle (QA'd vs preview). */
const RESEED_RATE = 12;
/** Peak fraction of rows torn at full envelope (QA'd vs preview). */
const PEAK_COVERAGE = 0.7;

/**
 * GLITCH > Cinematic Monitor — from the project's REAL pieces: windowed full-frame
 * wrap Offsets jolt the footage; a square/noise Wave Warp tears rows into
 * horizontally-shifted strips; a keyframed Offset adds vertical monitor jitter;
 * the real color-bar/noise overlay plate composites on top (Pin Light in source,
 * hard-light here — closest CSS analog); real SFX from the wrapper.
 */
export const GlitchCinematicMonitor: React.FC<TransitionProps & { params: GlitchCinematicMonitorParams }> = ({
  from, to, fromSrc, toSrc, outClip, inClip, durationInFrames, params,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const { jolts, roll, wave, plateDir, plateCount, plateIn, plateBlend, plateOpacity, swapAt } = params;

  const p = frame / Math.max(1, durationInFrames - 1);
  const tSec = frame / fps;

  const jolt = jolts.find((w) => tSec >= w.t0 && tSec < w.t1);
  const rollDy = sampleRoll(roll, tSec);
  const offX = wrapFrac(jolt ? jolt.dx : 0) * width;
  const offY = wrapFrac((jolt ? jolt.dy : 0) + rollDy) * height;

  // Tear-intensity envelope from the REAL extracted curves: the HST roll decays to
  // zero as the glitch settles (tracks the preview's calm-down exactly) and the jolt
  // windows mark the violent stretch. Constant-param Wave Warp alone never settles —
  // the preview does, and these are the source's own signals for when.
  const rollPeak = Math.max(1e-6, ...roll.map((k) => Math.abs(k.dy)));
  const joltActive = !!jolt && Math.abs(jolt.dx) + Math.abs(jolt.dy) > 0.001;
  const env = Math.min(1, Math.max(Math.abs(rollDy) / (rollPeak * 0.6), joltActive ? 0.85 : 0));

  // ---- wave-warp strip bands (procedural from the real params) ----
  const bandH = wave.width; // wavelength-sized rows
  const phase = (tSec * wave.speed * wave.width) % (2 * bandH); // slow vertical scroll
  const epoch = Math.floor(tSec * wave.speed * RESEED_RATE); // re-tear cadence
  const nBands = Math.ceil(height / bandH) + 2;
  // band i -> bucket index, or -1 = untorn (base copy shows through). Clustered via a
  // coarse hash so tears arrive as chunky multi-band runs, not row confetti.
  const bandBucket: number[] = [];
  for (let i = 0; i < nBands; i++) {
    const torn = hash(Math.floor(i / 2), epoch) < PEAK_COVERAGE * env;
    bandBucket.push(torn ? Math.floor(hash(i * 7 + 3, epoch) * BUCKETS.length) : -1);
  }

  const maskFor = (bucket: number): string => {
    const stops: string[] = [];
    for (let i = 0; i < nBands; i++) {
      const y0 = Math.round(i * bandH - phase);
      const y1 = Math.round((i + 1) * bandH - phase);
      stops.push(`${bandBucket[i] === bucket ? 'black' : 'transparent'} ${y0}px ${y1}px`);
    }
    return `linear-gradient(to bottom, ${stops.join(', ')})`;
  };

  const swapTo = p >= swapAt;
  const src = swapTo ? toSrc : fromSrc;
  const clipFn = swapTo ? inClip : outClip;
  const content = swapTo ? to : from;

  // plate frames are a 30fps dump of the 1s plate; play from the real in-point
  const plateIdx = Math.min(plateCount, Math.max(1, Math.round(((plateIn || 0) + tSec) * 30) + 1));
  const plateUrl = staticFile(`${plateDir}/p_${String(plateIdx).padStart(3, '0')}.png`);
  const tearAmp = wave.height * (0.5 + 0.5 * env); // deeper shifts at the peak

  const bg = (x: number) => ({
    backgroundImage: src ? `url(${staticFile(src)})` : undefined,
    backgroundRepeat: 'repeat' as const,
    backgroundSize: `${width}px ${height}px`,
    backgroundPosition: `${offX + x}px ${offY}px`,
  });
  const maskCss = (m: string) => ({
    WebkitMaskImage: m,
    maskImage: m,
  } as const);

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', overflow: 'hidden' }}>
      {clipFn ? (
        <>
          {/* VIDEO path: base copy + one wrap-displaced copy per strip bucket */}
          <WrapLayer render={clipFn} x={offX} y={offY} />
          {BUCKETS.map((b, k) => (
            <AbsoluteFill key={k} style={maskCss(maskFor(k))}>
              <WrapLayer render={clipFn} x={offX + b * tearAmp} y={offY} />
            </AbsoluteFill>
          ))}
        </>
      ) : src ? (
        <>
          {/* IMAGE path (demo): background-image displacement */}
          <AbsoluteFill style={bg(0)} />
          {BUCKETS.map((b, k) => (
            <AbsoluteFill key={k} style={{ ...bg(b * tearAmp), ...maskCss(maskFor(k)) }} />
          ))}
        </>
      ) : (
        <AbsoluteFill>{content}</AbsoluteFill>
      )}

      {/* REAL overlay plate (color bars / static noise). Source blend is Pin Light
          (Premiere Blend Mode 17): result = max(min(base, 2s), 2s-1). CSS has no
          pin-light, but the formula decomposes EXACTLY into two layers:
          darken(base, 2s) then lighten(result, 2s-1) — 2s / 2s-1 via SVG
          component-transfer (slope 2, intercept 0 / -1). */}
      {plateBlend === 'pin-light' ? (
        <>
          <svg width="0" height="0" style={{ position: 'absolute' }}>
            <defs>
              <filter id="gcm-pl-dark" colorInterpolationFilters="sRGB">
                <feComponentTransfer>
                  <feFuncR type="linear" slope="2" intercept="0" />
                  <feFuncG type="linear" slope="2" intercept="0" />
                  <feFuncB type="linear" slope="2" intercept="0" />
                </feComponentTransfer>
              </filter>
              <filter id="gcm-pl-light" colorInterpolationFilters="sRGB">
                <feComponentTransfer>
                  <feFuncR type="linear" slope="2" intercept="-1" />
                  <feFuncG type="linear" slope="2" intercept="-1" />
                  <feFuncB type="linear" slope="2" intercept="-1" />
                </feComponentTransfer>
              </filter>
            </defs>
          </svg>
          <AbsoluteFill style={{ mixBlendMode: 'darken', opacity: plateOpacity, filter: 'url(#gcm-pl-dark)' }}>
            <Img src={plateUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </AbsoluteFill>
          <AbsoluteFill style={{ mixBlendMode: 'lighten', opacity: plateOpacity, filter: 'url(#gcm-pl-light)' }}>
            <Img src={plateUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </AbsoluteFill>
        </>
      ) : (
        <AbsoluteFill style={{ mixBlendMode: plateBlend as any, opacity: plateOpacity }}>
          <Img src={plateUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </AbsoluteFill>
      )}
      {/* SFX is emitted by the wrapper (TransitionDemo / TransitionClip). */}
    </AbsoluteFill>
  );
};

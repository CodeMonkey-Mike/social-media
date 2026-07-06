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

export type GlitchTurbulentDisplaceParams = {
  /** A->B cut in seconds — the HST pair's split point = the Amount peak. */
  cut: number;
  /** REAL Displacement enum: 9 = Horizontal ('x'), 8 = Vertical ('y'). */
  axis: 'x' | 'y';
  /** REAL Turbulent Displace Size (10..80 by density). */
  size: number;
  /** REAL Complexity (5 after rounding) -> feTurbulence numOctaves. */
  complexity: number;
  /** REAL per-variant Random Seed -> feTurbulence seed. */
  seed: number;
  /** REAL keyframed Amount (px, 0 -> 110..300 -> 0, peak at the cut). */
  amount: { t: number; v: number }[];
  /** REAL keyframed Evolution (degrees, 0 -> 1080). */
  evolution: { t: number; v: number }[];
  /** REAL t1 HST window (straddles the cut). */
  hst: { t0: number; t1: number };
  /** REAL t1 Emboss: dir 90 (horizontal variants) / 0 (vertical), relief px, contrast 0-1. */
  emboss: { reliefPx: number; contrast: number; dir: number };
};

/** Linear interpolation over a real keyframe curve, clamped at the ends. */
const sample = (curve: { t: number; v: number }[], t: number) => {
  if (t <= curve[0].t) return curve[0].v;
  const last = curve[curve.length - 1];
  if (t >= last.t) return last.v;
  for (let i = 1; i < curve.length; i++) {
    if (t <= curve[i].t) {
      const a = curve[i - 1];
      const b = curve[i];
      return a.v + ((b.v - a.v) * (t - a.t)) / Math.max(1e-6, b.t - a.t);
    }
  }
  return last.v;
};

/** AE Size -> feTurbulence baseFrequency, anisotropic along the displacement
 * axis: the pack previews streak strongly ALONG the displaced axis (the noise
 * varies slowly along it, faster across it). Constants calibrated by
 * feature-size comparison against the previews. */
const baseFreqFor = (size: number, axis: 'x' | 'y') => {
  const along = 1 / (3 * size);
  const across = 1 / (1.5 * size);
  return axis === 'x' ? `${along.toFixed(6)} ${across.toFixed(6)}` : `${across.toFixed(6)} ${along.toFixed(6)}`;
};

/** feTurbulence octaves. The REAL Complexity is 5, but feTurbulence's fractal
 * octave falloff is harsher than AE's (numOctaves=5 turns the field into fine
 * marble while the pack previews show smooth laminar molten folds) — ONE smooth
 * octave matches the previews' character. Calibration constant, same standing as the Monitor
 * engine's blur cap. */
const OCTAVES = 1;

/**
 * GLITCH > Turbulent Displace — fractal-noise warp, NO plates (the pack ships
 * none): one full-length Turbulent Displace under an HST fringe window, all
 * numbers from the project (Amount envelope peaking AT the cut, Size,
 * Complexity->octaves, Evolution, per-variant seed, axis from the Displacement
 * enum). The AE noise field itself is procedural and cannot be extracted, so
 * it is reproduced with feTurbulence fractalNoise + feDisplacementMap and the
 * Evolution keyframes scroll the field (AE morphs it in place — closest honest
 * analog); **fidelity: approximate** (Wave Warp precedent). The t1 HST window
 * (Tint black->green, Emboss, Pin Light — the Offset/Monitor-verified recipe)
 * fringes the content FIRST; t2 sits above it, so the turbulence displaces the
 * fringed frame. The filter is remounted per frame via a frame-keyed id (per-
 * frame attribute mutation can leave Chromium's compiled filter stale — Invert
 * gotcha).
 */
export const GlitchTurbulentDisplace: React.FC<TransitionProps & { params: GlitchTurbulentDisplaceParams }> = ({
  from, to, fromSrc, toSrc, outClip, inClip, durationInFrames, params,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const { cut, axis, size, complexity, seed, amount, evolution, hst, emboss } = params;
  const tSec = frame / fps;

  const swapTo = tSec >= cut;
  const src = swapTo ? toSrc : fromSrc;
  const clipFn = swapTo ? inClip : outClip;
  const content = swapTo ? to : from;

  const amt = sample(amount, tSec);
  const evo = sample(evolution, tSec);
  const inHst = tSec >= hst.t0 && tSec < hst.t1;

  // Evolution scrolls the noise field: one Size-wavelength per 360deg, diagonal
  // so neither axis sits still. The filter region is padded so the shifted
  // field still covers the frame.
  const scroll = (evo / 360) * size * 2;

  // feDisplacementMap moves by scale*(C - 0.5): scale = 2*Amount displaces
  // +-Amount px, matching AE's Amount semantics.
  const dispScale = Math.max(0.01, amt * 2);

  const k = emboss.contrast;
  // dir 90 (horizontal variants) = the Monitor-verified vertical kernel;
  // dir 0 (vertical variants) = the same kernel rotated 90deg.
  const kernelGap = Array(Math.max(0, emboss.reliefPx - 2)).fill(0).join(' ');
  const embossAttrs =
    emboss.dir === 90
      ? { order: `1 ${emboss.reliefPx}`, kernelMatrix: `${k} ${kernelGap} ${-k}` }
      : { order: `${emboss.reliefPx} 1`, kernelMatrix: `${k} ${kernelGap} ${-k}` };

  const turbId = `gtd-turb-${frame}`;

  if (!clipFn && !src) return <AbsoluteFill>{content}</AbsoluteFill>;

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', overflow: 'hidden' }}>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          {/* fresh filter node every frame (frame-keyed id) */}
          <filter
            id={turbId}
            filterUnits="userSpaceOnUse"
            x={-width * 0.5}
            y={-height * 0.5}
            width={width * 2}
            height={height * 2}
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency={baseFreqFor(size, axis)}
              numOctaves={OCTAVES}
              seed={seed}
              result="noise0"
            />
            <feOffset in="noise0" dx={-scroll} dy={-scroll} result="noise" />
            {/* displace along ONE axis: the other channel selector reads B, which
                is pinned to 0.5 (= zero displacement) by the color matrix. */}
            <feColorMatrix
              in="noise"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 0 0 0.5  0 0 0 0 1"
              result="map"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale={dispScale}
              xChannelSelector={axis === 'x' ? 'R' : 'B'}
              yChannelSelector={axis === 'y' ? 'G' : 'B'}
            />
          </filter>
          {/* HST fringe: Tint black->GREEN white->BLACK, Emboss, Pin Light —
              the exact chain verified on Glitch Offset/Monitor. */}
          <filter id="gtd-hst" colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="0 0 0 0 0  -0.299 -0.587 -0.114 0 1  0 0 0 0 0  0 0 0 0 1"
              result="tint"
            />
            <feConvolveMatrix
              in="tint"
              order={embossAttrs.order}
              kernelMatrix={embossAttrs.kernelMatrix}
              divisor="1"
              bias="0.5"
              preserveAlpha="true"
              edgeMode="duplicate"
              result="emb"
            />
            <feComponentTransfer in="emb" result="s2">
              <feFuncR type="linear" slope="2" intercept="0" />
              <feFuncG type="linear" slope="2" intercept="0" />
              <feFuncB type="linear" slope="2" intercept="0" />
            </feComponentTransfer>
            <feComponentTransfer in="emb" result="s2m1">
              <feFuncR type="linear" slope="2" intercept="-1" />
              <feFuncG type="linear" slope="2" intercept="-1" />
              <feFuncB type="linear" slope="2" intercept="-1" />
            </feComponentTransfer>
            <feBlend mode="darken" in="SourceGraphic" in2="s2" result="d1" />
            <feBlend mode="lighten" in="d1" in2="s2m1" />
          </filter>
        </defs>
      </svg>

      {/* The displacement filter wraps the WHOLE 3x3 tile set (not each tile), so
          edge sampling always lands on real painted pixels (Pinning 0 = unpinned
          edges); the outer overflow:hidden crops the result to the frame. */}
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        <AbsoluteFill style={{ filter: amt > 0.5 ? `url(#${turbId})` : undefined }}>
          <WrapLayer
            x={0}
            y={0}
            render={() => (
              <AbsoluteFill style={{ overflow: 'hidden' }}>
                <AbsoluteFill style={{ filter: inHst ? 'url(#gtd-hst)' : undefined }}>
                  {clipFn ? clipFn() : (
                    <Img src={staticFile(src!)} style={{ width: `${width}px`, height: `${height}px`, objectFit: 'cover' }} />
                  )}
                </AbsoluteFill>
              </AbsoluteFill>
            )}
          />
        </AbsoluteFill>
      </AbsoluteFill>
      {/* SFX emitted by the wrapper (TransitionDemo / TransitionClip), not here. */}
    </AbsoluteFill>
  );
};

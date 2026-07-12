import React from 'react';
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { TransitionProps } from '../types';
import { LENS_MAP, LENS_OVERSCAN, LENS_SCALE_PER_K, LINEAR_MAP, LINEAR_A } from './lensMap';

/**
 * DEVIATION (Optics / Shift) — the pack's chromatic-tear accent family, built on
 * the THIRD-PARTY `AE.Mettle SkyBox Digital Glitch` plugin with everything off
 * except a keyframed "Color Distortion" 0→100→0 peaking AT the cut (static field:
 * Rate/Evolution 0, seed 0, Complexity 1, Geometry Distortion X=100 Y=83).
 * Optics ADDS a Lens Distortion bulge (Curvature 0→−30→0, same effect as Warp).
 *
 * Verified against the pack previews at full size: RADIAL SPECTRAL DISPERSION —
 * the fringes all point AWAY from center with a quiet middle and a subtle zoom
 * pulse at peak (a prism-zoom: each channel scaled slightly differently from the
 * POI). Content stays readable (an accent over the cut, not an obliterating
 * glitch); no blocks, no noise grain. (A first mean-zero turbulence-field model
 * was WRONG — invisible on dark scenes and randomly-placed quiet zones; Mike's
 * single-image check caught it.)
 *
 * fidelity: approximate — the algorithm is Mettle's closed plugin. We reproduce
 * it as per-channel displacement over a LINEAR radial map (== per-channel scale):
 * R out, B in, G ~anchored, amplitude driven by the REAL keyframed Color
 * Distortion curve (piecewise (In)/(Out), bezier handles), calibrated vs the
 * previews. Same (In)/(Out) architecture as OFFSET → swap from→to AT the cut.
 * Ships SILENT like the pack (both projects' audio groups empty, previews
 * video-only; Optics_0N.wav in Sound/ is referenced by NO sequence).
 */
type Handles = { iv?: number; ii?: number; ov?: number; oi?: number };
type ScalarKf = { t: number; v: number } & Handles;

export type DeviationGlitchParams = {
  /** A->B swap fraction (0..1 of the window) = the (Out) clip's start / duration. */
  cut: number;
  /** PIECEWISE Color Distortion curves (0..100), seq-time, from the (In)/(Out) clips. */
  colorIn: ScalarKf[];
  colorOut: ScalarKf[];
  /** OPTIONAL (Optics): piecewise Lens Distortion Curvature curves. */
  lensIn?: ScalarKf[];
  lensOut?: ScalarKf[];
  /** Field anisotropy from the plugin params (Geometry Distortion X/Y = 100/83). */
  geomX: number;
  geomY: number;
};

/** Base displacement in px AT THE SIDE EDGE (nx=1.78) per unit channel
 * coefficient when Color Distortion = 100. Channel coefficients below give a
 * COMMON-MODE push (the whole image visibly jumps sideways via the map bias and
 * pulses outward = the "Shift") plus strong R-vs-B prism dispersion around it.
 * (First calibration at 16px/whisper-G read as nearly nothing on the gallery
 * demo — Mike wants the Adobe-visible aggressive shift + colors.) */
const EDGE_PX = 30;
/** feDisplacementMap scale that yields EDGE_PX at the side edge for CD=100. */
const DISP_SCALE_100 = (EDGE_PX * 255) / (LINEAR_A * 1.78);
/** Per-channel displacement coefficients: common-mode ≈1.0 (movement), R-B
 * dispersion 1.6 (color). */
const CH_R = 1.8, CH_G = 1.0, CH_B = 0.2;

const bez = (a: number, b: number, c: number, d: number, s: number) => {
  const u = 1 - s;
  return u * u * u * a + 3 * u * u * s * b + 3 * u * s * s * c + s * s * s * d;
};

const segProgress = (
  t0: number, t1: number, h0: Handles, h1: Handles, L: number, t: number,
) => {
  const dt = t1 - t0;
  if (dt <= 0) return 1;
  const lin = (t - t0) / dt;
  if ((h0.oi === undefined && h1.ii === undefined) || L === 0) return lin;
  const oi = Math.min(1, Math.max(1e-4, h0.oi ?? 1 / 3));
  const ii = Math.min(1, Math.max(1e-4, h1.ii ?? 1 / 3));
  const c1t = t0 + oi * dt;
  const c2t = t1 - ii * dt;
  const c1p = ((h0.ov ?? 0) * oi * dt) / L;
  const c2p = 1 - ((h1.iv ?? 0) * ii * dt) / L;
  let lo = 0, hi = 1, s = lin;
  for (let i = 0; i < 40; i++) {
    s = (lo + hi) / 2;
    if (bez(t0, c1t, c2t, t1, s) < t) lo = s; else hi = s;
  }
  return bez(0, c1p, c2p, 1, s);
};

const sampleKfs = (kfs: ScalarKf[], t: number) => {
  if (!kfs.length) return 0;
  if (t <= kfs[0].t) return kfs[0].v;
  const last = kfs[kfs.length - 1];
  if (t >= last.t) return last.v;
  let i = 0;
  while (i < kfs.length - 2 && t > kfs[i + 1].t) i++;
  const a = kfs[i], b = kfs[i + 1];
  const L = b.v - a.v;
  return a.v + L * segProgress(a.t, b.t, a, b, L, t);
};

export const DeviationGlitch: React.FC<TransitionProps & { params: DeviationGlitchParams }> = ({
  from, to, fromSrc, toSrc, outClip, inClip, durationInFrames, params,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const { cut, colorIn, colorOut, lensIn, lensOut, geomX, geomY } = params;

  const tSec = frame / fps;
  const p = frame / Math.max(1, durationInFrames - 1);
  const beforeCut = p < cut;

  // piecewise (In)/(Out) sampling, exactly like OffsetSlide
  const colorAmt = Math.max(0, sampleKfs(beforeCut ? colorIn : colorOut, tSec)); // 0..100
  const amp = (colorAmt / 100) * DISP_SCALE_100; // displacement-map scale units
  const lensK = lensIn && lensOut ? sampleKfs(beforeCut ? lensIn : lensOut, tSec) : 0;
  const lensScale = lensK * LENS_SCALE_PER_K;
  const lensOn = Math.abs(lensScale) > 0.05;
  const colorOn = amp > 1; // scale units; ~0.4px at the edge

  const swapTo = p >= cut;
  const src = swapTo ? toSrc : fromSrc;
  const clipFn = swapTo ? inClip : outClip;
  const content = swapTo ? to : from;

  const scene = () =>
    clipFn ? clipFn() : src ? (
      <Img src={staticFile(src)} style={{ width: `${width}px`, height: `${height}px`, objectFit: 'cover' }} />
    ) : (
      <AbsoluteFill>{content}</AbsoluteFill>
    );

  // 3x3 wrap tiles so channel displacement near edges samples real content
  const tiles: React.ReactNode[] = [];
  for (const i of [-1, 0, 1]) {
    for (const j of [-1, 0, 1]) {
      tiles.push(
        <AbsoluteFill key={`${i}_${j}`} style={{ transform: `translate(${i * width}px, ${j * height}px)` }}>
          {scene()}
        </AbsoluteFill>
      );
    }
  }

  const colorId = `dev-color-${frame}`;
  const lensId = `dev-lens-${frame}`;

  let node: React.ReactNode = <AbsoluteFill>{tiles}</AbsoluteFill>;
  if (colorOn) node = <AbsoluteFill style={{ filter: `url(#${colorId})` }}>{node}</AbsoluteFill>;
  if (lensOn) node = <AbsoluteFill style={{ filter: `url(#${lensId})` }}>{node}</AbsoluteFill>;

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', overflow: 'hidden' }}>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          {colorOn && (
            <filter id={colorId} x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
              {/* Radial spectral dispersion: per-channel displacement over the
                  LINEAR radial map == per-channel SCALE from center. R pushed
                  outward, B pulled inward (prism), G a whisper outward. Quiet
                  center, fringes grow toward the edges — the preview's pattern. */}
              <feImage
                href={LINEAR_MAP}
                x={-LENS_OVERSCAN * width}
                y={-LENS_OVERSCAN * height}
                width={width * (1 + 2 * LENS_OVERSCAN)}
                height={height * (1 + 2 * LENS_OVERSCAN)}
                preserveAspectRatio="none"
                result="rmap"
              />
              <feColorMatrix in="SourceGraphic" type="matrix"
                values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="chR" />
              <feDisplacementMap in="chR" in2="rmap" scale={amp * CH_R} xChannelSelector="R" yChannelSelector="G" result="dR" />
              <feColorMatrix in="SourceGraphic" type="matrix"
                values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="chG" />
              <feDisplacementMap in="chG" in2="rmap" scale={amp * CH_G} xChannelSelector="R" yChannelSelector="G" result="dG" />
              <feColorMatrix in="SourceGraphic" type="matrix"
                values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="chB" />
              <feDisplacementMap in="chB" in2="rmap" scale={amp * CH_B} xChannelSelector="R" yChannelSelector="G" result="dB" />
              {/* recombine: alpha-safe arithmetic adds (all branches opaque -> alpha clamps 1) */}
              <feComposite in="dR" in2="dG" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="rg" />
              <feComposite in="rg" in2="dB" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
            </filter>
          )}
          {lensOn && (
            <filter id={lensId} x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
              <feImage
                href={LENS_MAP}
                x={-LENS_OVERSCAN * width}
                y={-LENS_OVERSCAN * height}
                width={width * (1 + 2 * LENS_OVERSCAN)}
                height={height * (1 + 2 * LENS_OVERSCAN)}
                preserveAspectRatio="none"
                result="lmapRaw"
              />
              <feGaussianBlur in="lmapRaw" stdDeviation="12" result="lmap" />
              <feGaussianBlur in="SourceGraphic" stdDeviation={Math.min(2, Math.abs(lensScale) / 1600)} result="soft" />
              {/* peak |scale| here is ~1590 (k=-30): 4 chained passes keep 8-bit
                  map steps at ~1.6px (the Warp 8-bit-wall fix) */}
              <feDisplacementMap in="soft" in2="lmap" scale={lensScale / 4} xChannelSelector="R" yChannelSelector="G" result="l1" />
              <feDisplacementMap in="l1" in2="lmap" scale={lensScale / 4} xChannelSelector="R" yChannelSelector="G" result="l2" />
              <feDisplacementMap in="l2" in2="lmap" scale={lensScale / 4} xChannelSelector="R" yChannelSelector="G" result="l3" />
              <feDisplacementMap in="l3" in2="lmap" scale={lensScale / 4} xChannelSelector="R" yChannelSelector="G" />
            </filter>
          )}
        </defs>
      </svg>
      {node}
      {/* No SFX: the pack ships this category silent (verified FullHD + 4K + previews). */}
    </AbsoluteFill>
  );
};

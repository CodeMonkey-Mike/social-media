import React from 'react';
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { TransitionProps } from '../types';
import { LINEAR_MAP, LENS_OVERSCAN, LINEAR_A } from './lensMap';

/**
 * EXPAND > In / Out / Out In (+ Short) — center-anchored axis SQUEEZE/STRETCH.
 * Decoded from the raw per-clip keyframes (2026-07-11 re-decode; the first read
 * had rig phases backwards):
 *   rig phases  (Replicate-3 + 4 Mirrors + Scale rig, Shutter 360):
 *                 S(t) = Scale(t)/300 — a COMPRESSION to 1/6 with mirrored-tile
 *                 padding filling the sides (identity at Scale 300).
 *   crop phases (AECrop BOTH sides 0→45→0 symmetric): kept center sliver
 *                 stretched to the frame → S(t) = 1/(1−2·crop(t)/100), peak 10×.
 * Families arrange the phases: In = A squeeze 1→1/6 | B stretch 10→1 (NO blur
 * effect on B); Out = A stretch 1→10 (Blur Length 0→180→0) | B squeeze 1/6→1;
 * Out In = crop-stretch both ways (both with Blur Length curves).
 * Motion blur is SCREEN-SPACE (applies after the crop/stretch — Premiere's
 * bottom-up stack): explicit Blur Length curves → uniform directional gaussian;
 * rig Shutter 360 → derivative-based blur graded by a center→edge mask (a
 * center-anchored squeeze displaces nothing at the center, most at the edges).
 * On top, ALL families share:
 *   "Glow"      — adjustment layer, Motion Blur Length 300 static along the
 *                 axis, opacity 0→100→0 peaking at the cut, blend pair (14,12)
 *                 second authoritative = Overlay.
 *   "Deviation" — Mettle Master Amplitude 0→100→0 chromatic dispersion pulse +
 *                 an axis Scale pulse 100→110→100 (reuses the DEVIATION map).
 * fidelity: approximate (shutter-blur grading + Mettle are calibrated).
 * SFX Whoosh_02.wav truncated to the family window.
 */
type Handles = { iv?: number; ii?: number; ov?: number; oi?: number };
type ScalarKf = { t: number; v: number } & Handles;
type Phase = {
  win: [number, number];
  /** 'rig' (S=300/v) or 'crop' (S=1/(1−2v/100)). */
  kind: 'rig' | 'crop';
  curve: ScalarKf[];
  /** explicit Motion Blur Length curve (crop phases). */
  blur?: ScalarKf[];
};

export type ExpandZoomParams = {
  cut: number;
  axis: 'x' | 'y';
  phaseIn: Phase;
  phaseOut: Phase;
  glow: { win: [number, number]; opacity: ScalarKf[] };
  deviation: { win: [number, number]; master: ScalarKf[]; scalePulse: ScalarKf[] };
};

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
  const c1t = t0 + oi * dt, c2t = t1 - ii * dt;
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
  if (!kfs || !kfs.length) return 0;
  if (t <= kfs[0].t) return kfs[0].v;
  const last = kfs[kfs.length - 1];
  if (t >= last.t) return last.v;
  let i = 0;
  while (i < kfs.length - 2 && t > kfs[i + 1].t) i++;
  const a = kfs[i], b = kfs[i + 1];
  const L = b.v - a.v;
  return a.v + L * segProgress(a.t, b.t, a, b, L, t);
};

/** Stretch factor of a phase at time t (1 outside its window).
 * rig: S = Scale/300 (compression ≤1, mirrored padding shows at the sides);
 * crop: S = 1/(1−2·crop/100) (center-sliver stretch ≥1, peak 10× at crop 45). */
const phaseS = (ph: Phase, t: number) => {
  if (t < ph.win[0] || t >= ph.win[1]) return 1;
  const v = sampleKfs(ph.curve, t);
  return ph.kind === 'rig'
    ? Math.min(300, Math.max(20, v)) / 300
    : 1 / Math.max(0.08, 1 - 2 * Math.min(46, Math.max(0, v)) / 100);
};

/** Dispersion strength for the Deviation pulse (px at side edge per master=100). */
const DEV_EDGE_PX = 18;
const DEV_SCALE_100 = (DEV_EDGE_PX * 255) / (LINEAR_A * 1.78);

export const ExpandZoom: React.FC<TransitionProps & { params: ExpandZoomParams }> = ({
  from, to, fromSrc, toSrc, outClip, inClip, durationInFrames, params,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const { cut, axis, phaseIn, phaseOut, glow, deviation } = params;

  const tSec = frame / fps;
  const p = frame / Math.max(1, durationInFrames - 1);
  const beforeCut = p < cut;
  const ph = beforeCut ? phaseIn : phaseOut;

  const S = phaseS(ph, tSec);
  // scale pulse from the Deviation layer (100→110→100) multiplies the stretch
  const inDev = tSec >= deviation.win[0] && tSec < deviation.win[1];
  const pulse = inDev ? Math.max(1, sampleKfs(deviation.scalePulse, tSec) / 100) : 1;
  const Seff = S * pulse;

  const dim = axis === 'x' ? width : height;

  // blur (SCREEN space, applied after the stretch):
  //  - explicit Blur Length curve (crop phases that have one) → uniform gaussian
  //  - rig phases (Shutter 360) → derivative-based, graded center→edge by a mask
  //    (Expand In's crop phase has NO blur effect: the 10× stretch is the look)
  let sigma = 0; // uniform
  let rigSigma = 0; // edge-masked
  const inPhase = tSec >= ph.win[0] && tSec < ph.win[1];
  if (inPhase && ph.blur) {
    sigma = Math.max(0, sampleKfs(ph.blur, tSec)) * 0.55;
  } else if (inPhase && ph.kind === 'rig') {
    const dt = 1 / fps;
    const t0 = Math.max(ph.win[0], tSec - dt);
    const t1 = Math.min(ph.win[1] - 1e-4, tSec + dt);
    const dS = t1 > t0
      ? Math.abs(phaseS(ph, t1) - phaseS(ph, t0)) / ((t1 - t0) * fps)
      : 0; // ΔS per frame
    rigSigma = Math.min(140, (dS / S) * (dim / 2) * 0.7);
  }

  const devAmp = inDev ? (Math.max(0, sampleKfs(deviation.master, tSec)) / 100) * DEV_SCALE_100 : 0;
  const devOn = devAmp > 1;

  const inGlow = tSec >= glow.win[0] && tSec < glow.win[1];
  const glowOp = inGlow ? Math.max(0, Math.min(100, sampleKfs(glow.opacity, tSec))) / 100 : 0;

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

  // mirror-tiled 7-copy strip along the axis: rig phases compress to S=1/6, so
  // up to 3 mirrored tiles show on EACH side (odd copies flipped = seamless)
  const copies: React.ReactNode[] = [];
  for (const k of [-3, -2, -1, 0, 1, 2, 3]) {
    const flip = Math.abs(k) % 2 === 1;
    copies.push(
      <AbsoluteFill key={k} style={{
        transform: axis === 'x'
          ? `translateX(${k * dim}px) ${flip ? 'scaleX(-1)' : ''}`
          : `translateY(${k * dim}px) ${flip ? 'scaleY(-1)' : ''}`,
      }}>
        {scene()}
      </AbsoluteFill>
    );
  }

  const stretch = axis === 'x' ? `scaleX(${Seff})` : `scaleY(${Seff})`;
  const blurId = `xz-blur-${frame}`;
  const devId = `xz-dev-${frame}`;

  const stretched = (
    <AbsoluteFill style={{ transform: stretch }}>{copies}</AbsoluteFill>
  );

  // center-anchored squeeze: nothing moves at the center, most at the edges —
  // grade the shutter blur with a screen-space mask (linear, like the motion)
  // displacement grows linearly from the center, so grade the shutter blur in
  // two masked tiers: mid blur ramps in right off center (only ~the central 4%
  // stays sharp), full-strength blur owns everything past ±25%
  const dirWord = axis === 'x' ? 'to right' : 'to bottom';
  const maskMid = `linear-gradient(${dirWord}, black 0%, black 42%, transparent 48%, transparent 52%, black 58%, black 100%)`;
  const maskStrong = `linear-gradient(${dirWord}, black 0%, black 25%, transparent 38%, transparent 62%, black 75%, black 100%)`;

  let base: React.ReactNode;
  if (sigma > 0.05) {
    base = <AbsoluteFill style={{ filter: `url(#${blurId})` }}>{stretched}</AbsoluteFill>;
  } else if (rigSigma > 0.5) {
    base = (
      <>
        {stretched}
        <AbsoluteFill style={{
          filter: `url(#${blurId}-mid)`,
          WebkitMaskImage: maskMid,
          maskImage: maskMid,
        }}>
          <AbsoluteFill style={{ transform: stretch }}>{copies}</AbsoluteFill>
        </AbsoluteFill>
        <AbsoluteFill style={{
          filter: `url(#${blurId})`,
          WebkitMaskImage: maskStrong,
          maskImage: maskStrong,
        }}>
          <AbsoluteFill style={{ transform: stretch }}>{copies}</AbsoluteFill>
        </AbsoluteFill>
      </>
    );
  } else {
    base = stretched;
  }

  let node: React.ReactNode = <AbsoluteFill>{base}</AbsoluteFill>;
  if (devOn) node = <AbsoluteFill style={{ filter: `url(#${devId})` }}>{node}</AbsoluteFill>;
  const blurSigma = sigma > 0.05 ? sigma : rigSigma;

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', overflow: 'hidden' }}>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id={blurId} x="-40%" y="-40%" width="180%" height="180%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation={axis === 'x' ? `${blurSigma} 0` : `0 ${blurSigma}`} />
          </filter>
          {rigSigma > 0.5 && (
            <filter id={`${blurId}-mid`} x="-40%" y="-40%" width="180%" height="180%" colorInterpolationFilters="sRGB">
              <feGaussianBlur in="SourceGraphic" stdDeviation={axis === 'x' ? `${rigSigma * 0.25} 0` : `0 ${rigSigma * 0.25}`} />
            </filter>
          )}
          {devOn && (
            <filter id={devId} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
              <feImage href={LINEAR_MAP}
                x={-LENS_OVERSCAN * width} y={-LENS_OVERSCAN * height}
                width={width * (1 + 2 * LENS_OVERSCAN)} height={height * (1 + 2 * LENS_OVERSCAN)}
                preserveAspectRatio="none" result="rmap" />
              <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="chR" />
              <feDisplacementMap in="chR" in2="rmap" scale={devAmp * 1.8} xChannelSelector="R" yChannelSelector="G" result="dR" />
              <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="chG" />
              <feDisplacementMap in="chG" in2="rmap" scale={devAmp} xChannelSelector="R" yChannelSelector="G" result="dG" />
              <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="chB" />
              <feDisplacementMap in="chB" in2="rmap" scale={devAmp * 0.2} xChannelSelector="R" yChannelSelector="G" result="dB" />
              <feComposite in="dR" in2="dG" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="rg" />
              <feComposite in="rg" in2="dB" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
            </filter>
          )}
        </defs>
      </svg>
      {node}
      {/* Glow: adjustment layer — the composite below, Motion Blur Length 300
          along the axis (screen space, AFTER the stretch), Overlay blend,
          real opacity envelope peaking at the cut */}
      {glowOp > 0.01 && (
        <AbsoluteFill style={{ opacity: glowOp, mixBlendMode: 'overlay' as const }}>
          <AbsoluteFill style={{ filter: `url(#${blurId}-glow)` }}>
            <AbsoluteFill style={{ transform: stretch }}>{copies}</AbsoluteFill>
          </AbsoluteFill>
          <svg width="0" height="0" style={{ position: 'absolute' }}>
            <defs>
              <filter id={`${blurId}-glow`} x="-40%" y="-40%" width="180%" height="180%" colorInterpolationFilters="sRGB">
                <feGaussianBlur in="SourceGraphic" stdDeviation={axis === 'x' ? '165 0' : '0 165'} />
              </filter>
            </defs>
          </svg>
        </AbsoluteFill>
      )}
      {/* SFX (Whoosh_02, window-truncated) is emitted from the wrapper. */}
    </AbsoluteFill>
  );
};

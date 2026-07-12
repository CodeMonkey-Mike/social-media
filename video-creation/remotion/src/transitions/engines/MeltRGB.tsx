import React from 'react';
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { TransitionProps } from '../types';

/**
 * MELT / RGB (+ Soft, Short, Soft Short) — 22 variants of the pack's channel-split
 * "RGB melt": the frame tears into differently-scaled R/G/B copies around a
 * DRIFTING center, saturating the whole image in spectral ghosting at the cut.
 *
 * Mechanism (per-clip extracted, _extract-melt.js -> _build-melt-rows.js): the
 * (In)/(Out) adjustment pair carries `AE.Mettle SkyBox Chromatic Aberrations`
 * (third-party, closed algorithm) with keyframed per-channel Aberration amounts
 * (7 color recipes, e.g. R+50/G-50/B-50, -71/+69/+10; Soft: +72/-28/-81 at
 * Falloff 50) and a keyframed 2D Point of Interest that drifts OFF-FRAME during
 * the transition (each variant has its own real trajectory — RGB-3 vs RGB-4
 * differ ONLY in the POI path).
 *
 * Implementation — EXACT AFFINE MODEL, no displacement maps: radial chromatic
 * aberration of amount s about a center is r' = r*(1+s), i.e. a uniform SCALE
 * about the POI (preview-verified: the peak's channel copies are linearly
 * scaled, straight edges stay straight). Three channel-isolated copies
 * (feColorMatrix), each CSS-scaled about the drifting POI, recombined
 * ADDITIVELY (mix-blend-mode: plus-lighter; blend on the outer element,
 * channel filter on the inner — the headless filter+blend rule). No 8-bit
 * wall, no map assets.
 *
 * fidelity: approximate — curves/recipes/POI paths are real; the Mettle
 * aberration%->scale constant and the Falloff-Distance normalization are
 * preview-calibrated (the DEVIATION precedent for Mettle plugins).
 */
type Handles = { iv?: number; ii?: number; ov?: number; oi?: number };
type KF = { t: number; v: number } & Handles;
type KF2 = { t: number; x: number; y: number } & Handles;

export type MeltRGBParams = {
  /** A->B swap fraction = the (Out) clip's start / duration. */
  cut: number;
  /** Per-channel aberration curves (piecewise (In)/(Out), seq-time). */
  r: { curveIn: KF[]; curveOut: KF[] };
  g: { curveIn: KF[]; curveOut: KF[] };
  b: { curveIn: KF[]; curveOut: KF[] };
  /** Drifting aberration center, normalized frame coords (may exit the frame). */
  poi: { curveIn: KF2[]; curveOut: KF2[] };
  /** Mettle Falloff Distance (100 = RGB families, 50 = Soft). */
  falloff: number;
  /** Falloff Invert (Soft 2-4 + Soft Short 2-4): the split is STRONGEST near the
   * POI and decays outward — rendered as a scaled channel copy revealed through
   * a radial-gradient mask over the unscaled base (preview-matched structure:
   * locally split, coherent far away). */
  invert?: boolean;
};

const bez = (a: number, b: number, c: number, d: number, s: number) => {
  const u = 1 - s;
  return u * u * u * a + 3 * u * u * s * b + 3 * u * s * s * c + s * s * s * d;
};

/** Real AE temporal-bezier segment progress (the OffsetSlide evaluator). */
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

const sampleKF = (kfs: KF[], t: number) => {
  if (!kfs.length) return 0;
  if (t <= kfs[0].t) return kfs[0].v;
  const last = kfs[kfs.length - 1];
  if (t >= last.t) return last.v;
  let i = 0;
  while (i < kfs.length - 2 && t > kfs[i + 1].t) i++;
  const a = kfs[i], b = kfs[i + 1];
  const p = segProgress(a.t, b.t, a, b, b.v - a.v, t);
  return a.v + (b.v - a.v) * p;
};

const sampleKF2 = (kfs: KF2[], t: number) => {
  if (t <= kfs[0].t) return { x: kfs[0].x, y: kfs[0].y };
  const last = kfs[kfs.length - 1];
  if (t >= last.t) return { x: last.x, y: last.y };
  let i = 0;
  while (i < kfs.length - 2 && t > kfs[i + 1].t) i++;
  const a = kfs[i], b = kfs[i + 1];
  const L = Math.hypot(b.x - a.x, b.y - a.y);
  const p = segProgress(a.t, b.t, a, b, L, t);
  return { x: a.x + (b.x - a.x) * p, y: a.y + (b.y - a.y) * p };
};

/** Aberration% -> scale factor, normalized by Falloff Distance (calibrated vs
 * the pack previews at peak: aberration 50 @ falloff 100 reads as ~30% scale; first pass at 12% was far too subtle vs the preview peak). */
const SCALE_PER_AB = 0.006;

const CH = [
  { key: 'r', mat: '1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0' },
  { key: 'g', mat: '0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0' },
  { key: 'b', mat: '0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0' },
] as const;

export const MeltRGB: React.FC<TransitionProps & { params: MeltRGBParams }> = ({
  from, to, fromSrc, toSrc, outClip, inClip, durationInFrames, params,
}) => {
  const frame = useCurrentFrame();
  const { width: W, height: H, fps } = useVideoConfig();
  const { cut, falloff } = params;

  const tSec = frame / fps;
  const p = frame / Math.max(1, durationInFrames - 1);
  const beforeCut = p < cut;

  const swapTo = p >= cut;
  const src = swapTo ? toSrc : fromSrc;
  const clipFn = swapTo ? inClip : outClip;
  const content = swapTo ? to : from;

  const scene = () =>
    clipFn ? clipFn() : src ? (
      <Img src={staticFile(src)} style={{ width: `${W}px`, height: `${H}px`, objectFit: 'cover' }} />
    ) : (
      <AbsoluteFill>{content}</AbsoluteFill>
    );

  const pick = (c: { curveIn: KF[]; curveOut: KF[] }) => (beforeCut ? c.curveIn : c.curveOut);
  const ab = {
    r: sampleKF(pick(params.r), tSec),
    g: sampleKF(pick(params.g), tSec),
    b: sampleKF(pick(params.b), tSec),
  };
  const poi = sampleKF2(beforeCut ? params.poi.curveIn : params.poi.curveOut, tSec);
  const originX = poi.x * W;
  const originY = poi.y * H;

  const active = Math.abs(ab.r) + Math.abs(ab.g) + Math.abs(ab.b) > 0.05;
  if (!active) {
    return <AbsoluteFill style={{ backgroundColor: 'black', overflow: 'hidden' }}>{scene()}</AbsoluteFill>;
  }

  // effective radial scale per channel (falloff-normalized)
  const scaleOf = (a: number) => 1 + a * SCALE_PER_AB * (100 / falloff);
  // inverted falloff: mask radius over which the local split fades out
  const maskR = ((params.falloff / 100) * Math.max(W, H) * 1.2).toFixed(0);
  const maskCss = params.invert
    ? {
        WebkitMaskImage: `radial-gradient(circle ${maskR}px at ${originX}px ${originY}px, white 20%, transparent 100%)`,
        maskImage: `radial-gradient(circle ${maskR}px at ${originX}px ${originY}px, white 20%, transparent 100%)`,
      }
    : undefined;

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', overflow: 'hidden', isolation: 'isolate' }}>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          {CH.map((c) => (
            <filter key={c.key} id={`mrgb-${c.key}`} colorInterpolationFilters="sRGB">
              <feColorMatrix in="SourceGraphic" type="matrix" values={c.mat} />
            </filter>
          ))}
        </defs>
      </svg>
      {CH.map((c, i) => {
        const s = scaleOf(ab[c.key as 'r' | 'g' | 'b']);
        const scaled = (
          <AbsoluteFill
            style={{
              filter: `url(#mrgb-${c.key})`,
              transform: `scale(${s})`,
              transformOrigin: `${originX}px ${originY}px`,
            }}
          >
            {scene()}
          </AbsoluteFill>
        );
        return (
          // additive channel recombination; blend OUTER, channel filter INNER
          // (the headless filter+blend-same-element rule)
          <AbsoluteFill key={c.key} style={{ mixBlendMode: i === 0 ? undefined : 'plus-lighter' }}>
            {params.invert ? (
              <>
                {/* inverted falloff: unscaled base + scaled copy through the
                    radial mask at the POI (split local, coherent far away) */}
                <AbsoluteFill style={{ filter: `url(#mrgb-${c.key})` }}>{scene()}</AbsoluteFill>
                <AbsoluteFill style={maskCss}>{scaled}</AbsoluteFill>
              </>
            ) : (
              scaled
            )}
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

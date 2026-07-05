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

export type GlitchOffsetParams = {
  /** REAL t2 keyframed full-frame wrap Offset, merged from the adjustment pair into
   * ONE sequence-time curve (25fps keyframes, y only — x is static 0.5 in all 7
   * variants). Values are raw dy fractions and exceed +-0.5 at high densities
   * (multiple full wraps); interpolate RAW, wrap only when rendering. */
  curve: { t: number; dy: number }[];
  /** A->B cut fraction — the first t2 clip's end; the cut hides in the offset jump. */
  swapAt: number;
  /** REAL t1 "Abberations"/"Deviation" window — the emboss+tint(green) pin-light zone. */
  hst: { t0: number; t1: number };
  /** REAL t1 Offset y-shift (tiny, +0.28%..+0.74% of height by density). */
  hstShiftY: number;
  /** REAL t1 Emboss: direction 180deg (horizontal kernel), relief px, contrast 0-1. */
  emboss: { reliefPx: number; contrast: number };
};

/** Wrap any offset fraction into [-0.5, 0.5) so the 3x3 WrapLayer tiles always cover. */
const wrapFrac = (v: number) => ((v % 1) + 1.5) % 1 - 0.5;

/** Linear interpolation over the real 25fps keyframe curve (raw, pre-wrap). */
const sampleCurve = (curve: { t: number; dy: number }[], t: number) => {
  if (t <= curve[0].t) return curve[0].dy;
  const last = curve[curve.length - 1];
  if (t >= last.t) return last.dy;
  for (let i = 1; i < curve.length; i++) {
    if (t <= curve[i].t) {
      const a = curve[i - 1];
      const b = curve[i];
      const f = (t - a.t) / Math.max(1e-6, b.t - a.t);
      return a.dy + (b.dy - a.dy) * f;
    }
  }
  return last.dy;
};

/**
 * GLITCH > Offset — everything keyframed, no plates (near-1:1): the whole frame
 * wrap-scrolls vertically on the real jagged Offset curve (the A->B cut hides in
 * the first jump), while the t1 "Abberations" window pin-lights a green-tinted
 * horizontal emboss over the frame — reads as red/green chromatic-aberration
 * fringes on vertical edges. Component order per the verified bottom-up rule:
 * t1 aberration applies to the content FIRST, then the t2 wrap offset displaces
 * the fringed frame. Pin Light (Premiere Blend Mode 17, same 8+17 param pair as
 * Glitch Monitor's t1) is done in-filter via feBlend darken/lighten vs
 * SourceGraphic (CSS mix-blend-mode children inside a filtered parent do not
 * composite in headless Chromium — GlitchMonitor gotcha). This family ships NO
 * SFX: FullHD + 4K audio groups are empty and the previews are video-only.
 */
export const GlitchOffset: React.FC<TransitionProps & { params: GlitchOffsetParams }> = ({
  from, to, fromSrc, toSrc, outClip, inClip, durationInFrames, params,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const { curve, swapAt, hst, hstShiftY, emboss } = params;

  const p = frame / Math.max(1, durationInFrames - 1);
  const tSec = frame / fps;

  const offY = wrapFrac(sampleCurve(curve, tSec)) * height;
  const inHst = tSec >= hst.t0 && tSec < hst.t1;

  const swapTo = p >= swapAt;
  const src = swapTo ? toSrc : fromSrc;
  const clipFn = swapTo ? inClip : outClip;
  const content = swapTo ? to : from;

  const embY = hstShiftY * height;
  const k = emboss.contrast;

  // The whole aberration layer as ONE self-contained SVG filter, applied BOTTOM-UP
  // per the source stack (Tint first, then Emboss, then the tiny +y Offset):
  // tint: G = 1 - Rec601 luma, R = B = 0 (Map Black To GREEN ff00ff00, Map White To
  // BLACK ff000000); emboss: 0.5 + contrast * (I(x-d) - I(x+d)) — direction 180deg
  // = HORIZONTAL kernel (Monitor's 90deg used the vertical one), feConvolveMatrix
  // with preserveAlpha so the math stays in straight RGB (arithmetic feComposite
  // collapses alpha and Chromium un-premultiplies toward white — Invert gotcha);
  // then Pin Light = lighten(darken(base, 2s), 2s-1) with clamped transfers.
  const hstFilter = (
    <filter id="go-hst" colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
      <feColorMatrix
        in="SourceGraphic"
        type="matrix"
        values="0 0 0 0 0  -0.299 -0.587 -0.114 0 1  0 0 0 0 0  0 0 0 0 1"
        result="tint"
      />
      {/* VERTICAL kernel, e = 0.5 + k*(g(y-d) - g(y+d)): green bites the TOP edge of
          bright objects, magenta the bottom — verified against the pack preview by
          residual analysis (target minus rolled clean frame is G-dominated with
          green-above/magenta-below pairs; the horizontal reading of "direction 180"
          and both flipped signs score worse). feConvolveMatrix applies the kernel
          180deg-rotated per the SVG spec, hence -k first, +k last. */}
      <feConvolveMatrix
        in="tint"
        order={`1 ${emboss.reliefPx}`}
        kernelMatrix={`${-k} ${Array(Math.max(0, emboss.reliefPx - 2)).fill(0).join(' ')} ${k}`}
        divisor="1"
        bias="0.5"
        preserveAlpha="true"
        edgeMode="duplicate"
        result="emb0"
      />
      <feOffset in="emb0" dy={embY} result="emb" />
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
  );

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', overflow: 'hidden' }}>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>{hstFilter}</defs>
      </svg>

      {/* Content via <Img>, NOT a CSS background-image — Remotion only waits for
          <Img> loads, a background-image can be captured before the bitmap
          arrives (scene B rendered black on its first engine frames). The outer
          overflow:hidden per tile clips the filter's out-of-box painting (the
          140% filter region otherwise smears white bands across neighbor tiles —
          Monitor's ghost pipeline had the same wrapper). */}
      {clipFn || src ? (
        <WrapLayer
          render={() => (
            <AbsoluteFill style={{ overflow: 'hidden' }}>
              <AbsoluteFill style={{ filter: inHst ? 'url(#go-hst)' : undefined }}>
                {clipFn ? clipFn() : (
                  <Img src={staticFile(src!)} style={{ width: `${width}px`, height: `${height}px`, objectFit: 'cover' }} />
                )}
              </AbsoluteFill>
            </AbsoluteFill>
          )}
          x={0}
          y={offY}
        />
      ) : (
        <AbsoluteFill>{content}</AbsoluteFill>
      )}
      {/* No SFX: the pack ships none for this family (audio groups empty, previews silent). */}
    </AbsoluteFill>
  );
};

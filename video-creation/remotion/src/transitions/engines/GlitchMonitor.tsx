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

export type GmOffsetWin = { t0: number; t1: number; dx: number; dy: number };

export type GlitchMonitorParams = {
  /** REAL t3 "Texture Adjustment" windows: full-frame wrap Offset (dx = x-0.5, dy = y-0.5),
   * split at the 0.16s cut in every variant. Applied to the ghost/smear copy. */
  offsets: GmOffsetWin[];
  /** REAL t1 "HST Adjustment" window — the emboss+tint(green) zone. Every variant's
   * window straddles the cut; it is the source's own marker for the glitch hot zone,
   * so it also drives the settle envelope (the FullHD project carries the effects as
   * static params; the rendered previews clearly ramp in and settle — same situation
   * as Cinematic Monitor's constant Wave Warp, resolved the same way). */
  hst: { t0: number; t1: number };
  /** REAL t1 Offset x-shift (tiny, ~+0.36% of width). */
  hstShiftX: number;
  /** REAL t1 Emboss: direction 90deg, relief px, contrast 0-1. */
  emboss: { reliefPx: number; contrast: number };
  /** REAL t2 Fast Blur blurriness (100) — ghost copy blur, sigma = px/3 at peak. */
  blurPx: number;
  /** REAL t2 Geometry2 Scale Height (1.5) — ghost copy vertical stretch at peak. */
  stretchY: number;
  /** REAL t4 overlay plate (flat 50% gray + colored signal bands) frames + blend. */
  plateDir: string;
  plateCount: number;
  plateIn: number;
  plateOpacity: number;
  /** A->B cut fraction (every variant cuts at 0.16s; plate + offset clips split there). */
  swapAt: number;
};

/** Wrap any offset fraction into [-0.5, 0.5) so the 3x3 WrapLayer tiles always cover. */
const wrapFrac = (v: number) => ((v % 1) + 1.5) % 1 - 0.5;

const smooth = (x: number) => {
  const c = Math.min(1, Math.max(0, x));
  return c * c * (3 - 2 * c);
};

/** Seconds the glitch takes to die out after the HST window closes. */
const SETTLE_TAIL = 0.05;

/** Number of quantized ghost-blur strengths (static SVG filters, url switched). */
const BLUR_BUCKETS = 6;

/**
 * GLITCH > Monitor — from the project's REAL pieces: the frame cuts A->B at 0.16s
 * hidden inside the glitch; a ghost copy of the content compounds the real wrap
 * Offsets + Fast Blur 100 + 150% vertical stretch, enveloped so it slams in at the
 * cut and settles when the source's HST window closes; that HST layer (Tint
 * black->green + Emboss 90deg/7px/70%, applied bottom-up per the verified component
 * order) pin-lights green relief lines over the frame; the real gray signal-band
 * plate pin-lights on top. Pin Light (Premiere Blend Mode 17) is implemented exactly
 * as the darken(2s)/lighten(2s-1) layer pair (same as GlitchCinematicMonitor).
 */
export const GlitchMonitor: React.FC<TransitionProps & { params: GlitchMonitorParams }> = ({
  from, to, fromSrc, toSrc, outClip, inClip, durationInFrames, params,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const {
    offsets, hst, hstShiftX, emboss, blurPx, stretchY,
    plateDir, plateCount, plateIn, plateOpacity, swapAt,
  } = params;

  const p = frame / Math.max(1, durationInFrames - 1);
  const tSec = frame / fps;
  const durSec = durationInFrames / fps;
  const cutSec = swapAt * durSec;

  // Settle envelope: rise over [hst.t0, cut], fall over [cut, hst.t1 + tail].
  const env =
    tSec < hst.t0 ? 0
    : tSec < cutSec ? smooth((tSec - hst.t0) / Math.max(0.001, cutSec - hst.t0))
    : 1 - smooth((tSec - cutSec) / Math.max(0.001, hst.t1 + SETTLE_TAIL - cutSec));
  const inHst = tSec >= hst.t0 && tSec < hst.t1;

  const win = offsets.find((w) => tSec >= w.t0 && tSec < w.t1);
  const ghostX = wrapFrac(win ? win.dx : 0) * width;
  const ghostY = wrapFrac(win ? win.dy : 0) * height;

  const swapTo = p >= swapAt;
  const src = swapTo ? toSrc : fromSrc;
  const clipFn = swapTo ? inClip : outClip;
  const content = swapTo ? to : from;

  const plateIdx = Math.min(plateCount, Math.max(1, Math.round(((plateIn || 0) + tSec) * 30) + 1));
  const plateUrl = staticFile(`${plateDir}/p_${String(plateIdx).padStart(3, '0')}.png`);

  // Blur is quantized into static filters and only the url switches per frame
  // (mutating filter primitives between frames leaves Chromium's compiled filter
  // stale — GlitchInvert gotcha). Smear reads horizontal in the source renders,
  // so sigmaY is kept small.
  const blurBucket = Math.round(env * (BLUR_BUCKETS - 1));
  const ghostScaleY = 1 + (stretchY - 1) * env;
  const embX = hstShiftX * width;
  const k = emboss.contrast;

  const bg = (x: number, y: number) => ({
    backgroundImage: src ? `url(${staticFile(src)})` : undefined,
    backgroundRepeat: 'repeat' as const,
    backgroundSize: `${width}px ${height}px`,
    backgroundPosition: `${x}px ${y}px`,
  });

  // The whole HST layer as ONE self-contained SVG filter (CSS mix-blend-mode inside
  // a filtered/stretched parent does not composite in headless Chromium, so the Pin
  // Light happens in-filter via feBlend darken/lighten against SourceGraphic).
  // Chain, applied BOTTOM-UP per the source stack (Tint first, then Emboss):
  // tint: G = 1 - Rec601 luma, R = B = 0 (Map Black To GREEN, Map White To BLACK);
  // emboss: 0.5 + contrast * (I(y-d) - I(y+d)) per channel (direction 90deg), alpha
  // forced back to 1 (arithmetic feComposite hits alpha too — Invert engine gotcha);
  // +x shift; then Pin Light = lighten(darken(base, 2s), 2s-1) with clamped transfers.
  const hstFilter = (
    <filter id="gm-hst" colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
      <feColorMatrix
        in="SourceGraphic"
        type="matrix"
        values="0 0 0 0 0  -0.299 -0.587 -0.114 0 1  0 0 0 0 0  0 0 0 0 1"
        result="tint"
      />
      {/* emboss = vertical convolution [k, 0…0, -k] + bias 0.5, preserveAlpha so the
          math stays in straight (non-premultiplied) RGB — an arithmetic feComposite
          here collapses alpha to 0.5 and Chromium un-premultiplies the frame toward
          white (same alpha trap the Invert engine documented). */}
      <feConvolveMatrix
        in="tint"
        order={`1 ${emboss.reliefPx}`}
        kernelMatrix={`${k} ${Array(Math.max(0, emboss.reliefPx - 2)).fill(0).join(' ')} ${-k}`}
        divisor="1"
        bias="0.5"
        preserveAlpha="true"
        edgeMode="duplicate"
        result="emb0"
      />
      <feOffset in="emb0" dx={embX} result="emb" />
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

  // Peak sigma is capped below blurriness/3: the pack renders keep the smeared
  // frame readable at the glitch peak (QA'd vs preview; the FullHD project's static
  // Blurriness=100 clearly ramped in the 4K render).
  const blurFilters = Array.from({ length: BLUR_BUCKETS }, (_, i) => {
    const sx = blurPx * 0.2 * (i / (BLUR_BUCKETS - 1));
    return (
      <filter key={i} id={`gm-blur-${i}`} colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation={`${sx.toFixed(2)} ${(sx / 10).toFixed(2)}`} />
      </filter>
    );
  });

  const plateTransfer = (suffix: string, slope: number, intercept: number) => (
    <filter id={`gm-pl-${suffix}`} colorInterpolationFilters="sRGB">
      <feComponentTransfer>
        <feFuncR type="linear" slope={slope} intercept={intercept} />
        <feFuncG type="linear" slope={slope} intercept={intercept} />
        <feFuncB type="linear" slope={slope} intercept={intercept} />
      </feComponentTransfer>
    </filter>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', overflow: 'hidden' }}>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          {hstFilter}
          {plateTransfer('dark', 2, 0)}
          {plateTransfer('light', 2, -1)}
          {blurFilters}
        </defs>
      </svg>

      {clipFn || src ? (
        <>
          {/* base copy (sharp; fully covered by the ghost at the peak) */}
          {clipFn ? <WrapLayer render={clipFn} x={0} y={0} /> : <AbsoluteFill style={bg(0, 0)} />}
          {/* ghost/smear copy — the source pipeline compounds BOTTOM-UP:
              HST emboss+tint pin-lights onto the content (t1), Fast Blur + vertical
              stretch smear that result (t2), then the wrap Offset displaces the
              CROPPED frame (t3) — blur/stretch/emboss inside, wrap-offset outside,
              which is what carves the visible strip seams at the peak. */}
          {env > 0.001 && (
            <WrapLayer
              render={() => (
                <AbsoluteFill style={{ overflow: 'hidden' }}>
                  <AbsoluteFill style={{ transform: `scaleY(${ghostScaleY})`, filter: `url(#gm-blur-${blurBucket})` }}>
                    <AbsoluteFill style={{ filter: inHst ? 'url(#gm-hst)' : undefined }}>
                      {clipFn ? clipFn() : <AbsoluteFill style={bg(0, 0)} />}
                    </AbsoluteFill>
                  </AbsoluteFill>
                </AbsoluteFill>
              )}
              x={ghostX}
              y={ghostY}
              opacity={env}
            />
          )}
        </>
      ) : (
        <AbsoluteFill>{content}</AbsoluteFill>
      )}

      {/* REAL overlay plate (50% gray = pin-light neutral, colored signal bands bite). */}
      <AbsoluteFill style={{ mixBlendMode: 'darken', opacity: plateOpacity, filter: 'url(#gm-pl-dark)' }}>
        <Img src={plateUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ mixBlendMode: 'lighten', opacity: plateOpacity, filter: 'url(#gm-pl-light)' }}>
        <Img src={plateUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>
      {/* SFX is emitted by the wrapper (TransitionDemo / TransitionClip). */}
    </AbsoluteFill>
  );
};

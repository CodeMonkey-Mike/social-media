import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { TransitionProps } from '../types';
import { WrapLayer } from '../WrapLayer';

export type RoughlyOffsetWindow = {
  type: 'offset';
  t0: number;
  t1: number;
  /** REAL "Blocks Nx" plate as luma->alpha PNG sequence (grays = partial alpha). */
  maskDir: string;
  maskFrames: number;
  /** Seconds into the plate at the window start (the clip's rack in-point offset). */
  maskStart: number;
  /** REAL keyframed Offset "Shift Center To" (dx,dy = raw - 0.5), window-relative time. */
  curve: { t: number; dx: number; dy: number }[];
};

export type RoughlyMosaicWindow = {
  type: 'mosaic';
  t0: number;
  t1: number;
  /** REAL "Different Fragments Nx" plate as luma->alpha PNG sequence. */
  maskDir: string;
  maskFrames: number;
  maskStart: number;
  /** REAL Mosaic Horizontal/Vertical Blocks (314x174 in all 7 variants). */
  cellsX: number;
  cellsY: number;
  /** REAL Geometry2 Scale Height percent (125 in all 7 variants). */
  scaleH: number;
};

export type GlitchRoughlyParams = {
  /** A->B cut in seconds — the mosaic pair's split point. */
  cut: number;
  /** Effect windows in track order (first = lowest, rendered bottom to top). */
  windows: (RoughlyOffsetWindow | RoughlyMosaicWindow)[];
};

const PLATE_FPS = 25; // all Composite Roughly plates are 25fps

/** Wrap any offset fraction into [-0.5, 0.5) so the 3x3 WrapLayer tiles always cover. */
const wrapFrac = (v: number) => ((v % 1) + 1.5) % 1 - 0.5;

/** Linear interpolation over the real keyframe curve, clamped at the ends. */
const sampleCurve = (curve: { t: number; dx: number; dy: number }[], t: number) => {
  if (t <= curve[0].t) return curve[0];
  const last = curve[curve.length - 1];
  if (t >= last.t) return last;
  for (let i = 1; i < curve.length; i++) {
    if (t <= curve[i].t) {
      const a = curve[i - 1];
      const b = curve[i];
      const f = (t - a.t) / Math.max(1e-6, b.t - a.t);
      return { t, dx: a.dx + (b.dx - a.dx) * f, dy: a.dy + (b.dy - a.dy) * f };
    }
  }
  return last;
};

/** Displacement scale for the mosaic map: half a cell must fit in +-S/2 px. */
const MOSAIC_SCALE = 16;

/**
 * Exact AE Mosaic as an SVG filter: a generated sawtooth displacement map sends
 * every pixel to its cell CENTER (feDisplacementMap: P(x + S*(R/255 - 0.5))),
 * which is precisely what Mosaic renders (each cell filled with its sampled
 * value). R encodes dx, G encodes dy; quantization error S/255 ~ 0.06px.
 */
const useMosaicMap = (cellsX: number, cellsY: number, w: number, h: number) =>
  useMemo(() => {
    const cw = w / cellsX;
    const ch = h / cellsY;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;
    const img = ctx.createImageData(w, h);
    const d = img.data;
    for (let y = 0; y < h; y++) {
      const cy = (Math.floor(y / ch) + 0.5) * ch;
      const gy = Math.round(255 * ((cy - y) / MOSAIC_SCALE + 0.5));
      for (let x = 0; x < w; x++) {
        const cx = (Math.floor(x / cw) + 0.5) * cw;
        const i = 4 * (y * w + x);
        d[i] = Math.round(255 * ((cx - x) / MOSAIC_SCALE + 0.5));
        d[i + 1] = gy;
        d[i + 2] = 128;
        d[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    return canvas.toDataURL('image/png');
  }, [cellsX, cellsY, w, h]);

/**
 * GLITCH > Roughly — the pack's own plates as REAL LUMA MATTES over the footage
 * (near-1:1, verified numerically vs the previews: the matted regions carry
 * content chroma, not plate pixels — same mechanism as the approved Blocks).
 * Two window kinds from the "Texture Adjustment" rack; in BOTH the matte is
 * SCREEN-FIXED and the effects hit the content underneath it (verified vs the
 * preview by changed-region IoU: static matte 0.22/0.12 vs stretched/travelling
 * matte 0.09/0.02 — adjustment-layer semantics, not effects-on-matted-output):
 *  - mosaic window (whole transition, media continuous across the A->B cut):
 *    Geometry2 Scale Height 125% then Mosaic 314x174 on the content (bottom-up
 *    order: Geometry2 first), shown through the "Different Fragments Nx" mask.
 *  - offset window(s): content wrap-shifted by the real keyframed Offset,
 *    shown through the "Blocks Nx" mask (grays = partial alpha).
 * SFX (Composite_Roughly_Only_Displacement.mp3, per-variant in-point) is
 * emitted by the wrapper, not here.
 */
export const GlitchRoughly: React.FC<TransitionProps & { params: GlitchRoughlyParams }> = ({
  from, to, fromSrc, toSrc, outClip, inClip, durationInFrames, params,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const { cut, windows } = params;
  const tSec = frame / fps;

  const swapTo = tSec >= cut;
  const src = swapTo ? toSrc : fromSrc;
  const clipFn = swapTo ? inClip : outClip;
  const content = swapTo ? to : from;

  // one mosaic filter per distinct cell grid (uniform 314x174 across the family,
  // but read from the row), mounted for the whole transition — per-frame only
  // the style.filter url switches (stale-compiled-filter gotcha, Invert).
  const mosaicWins = windows.filter((w): w is RoughlyMosaicWindow => w.type === 'mosaic');
  const mos = mosaicWins[0];
  const mapUrl = useMosaicMap(mos?.cellsX ?? 314, mos?.cellsY ?? 174, width, height);

  const renderContent = () =>
    clipFn ? clipFn() : (
      <Img src={staticFile(src!)} style={{ width: `${width}px`, height: `${height}px`, objectFit: 'cover' }} />
    );

  const maskFrameUrl = (w: RoughlyOffsetWindow | RoughlyMosaicWindow) => {
    const idx = Math.min(
      w.maskFrames,
      Math.max(1, Math.floor((w.maskStart + (tSec - w.t0)) * PLATE_FPS) + 1)
    );
    return staticFile(`${w.maskDir}/m_${String(idx).padStart(3, '0')}.png`);
  };

  const maskStyle = (url: string): React.CSSProperties => ({
    WebkitMaskImage: `url(${url})`,
    maskImage: `url(${url})`,
    WebkitMaskSize: `${width}px ${height}px`,
    maskSize: `${width}px ${height}px`,
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
  });

  if (!clipFn && !src) return <AbsoluteFill>{content}</AbsoluteFill>;

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', overflow: 'hidden' }}>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter
            id="gr-mosaic"
            filterUnits="userSpaceOnUse"
            x="0"
            y="0"
            width={width}
            height={height}
            colorInterpolationFilters="sRGB"
          >
            <feImage href={mapUrl} x="0" y="0" width={width} height={height} result="map" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale={MOSAIC_SCALE}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* clean current side underneath */}
      <AbsoluteFill>{renderContent()}</AbsoluteFill>

      {/* effect windows, bottom to top in track order */}
      {windows.map((w, i) => {
        if (tSec < w.t0 || tSec >= w.t1) return null;
        const maskUrl = maskFrameUrl(w);
        if (w.type === 'offset') {
          const s = sampleCurve(w.curve, tSec - w.t0);
          const x = wrapFrac(s.dx) * width;
          const y = wrapFrac(s.dy) * height;
          // matte on the OUTER container (screen-fixed), content wrap-shifted
          // beneath it — WrapLayer's maskUrl does exactly this.
          return (
            <WrapLayer
              key={i}
              x={x}
              y={y}
              maskUrl={maskUrl}
              render={() => <AbsoluteFill style={{ overflow: 'hidden' }}>{renderContent()}</AbsoluteFill>}
            />
          );
        }
        // mosaic window: mosaic(scaleY(content)) (Geometry2 first, bottom-up
        // rule), shown through the SCREEN-FIXED matte: mask outermost, filter
        // below it, transform innermost.
        const sy = w.scaleH / 100;
        return (
          <AbsoluteFill key={i} style={{ overflow: 'hidden', ...maskStyle(maskUrl) }}>
            <AbsoluteFill style={{ filter: 'url(#gr-mosaic)' }}>
              <AbsoluteFill style={{ transform: `scaleY(${sy})`, transformOrigin: 'center' }}>
                {renderContent()}
              </AbsoluteFill>
            </AbsoluteFill>
          </AbsoluteFill>
        );
      })}
      {/* SFX emitted by the wrapper (TransitionDemo / TransitionClip), not here. */}
    </AbsoluteFill>
  );
};

import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { TransitionProps } from '../types';
import { WrapLayer } from '../WrapLayer';

export type BadSignalKf = { t: number; dx: number; dy: number };

export type GlitchBadSignalParams = {
  /** REAL keyframed Offset "Shift Center To" (dx,dy from center) — vertical roll. */
  offsets: BadSignalKf[];
  /** REAL Tile Mask band selector (white bands -> alpha): which rows tear. */
  tileDir: string;
  tileCount: number;
  /** Horizontal tear of the banded rows, as a fraction of width (tuned to preview). */
  tearX: number;
  /** Chroma (RGB) split in px within the bands. */
  split: number;
  /** REAL overlay plate (RGB-split/scanline texture) frames + blend. */
  plateDir: string;
  plateCount: number;
  plateBlend: string;
  plateOpacity: number;
  /** Mosaic block counts (project 128x72) for the pixelate flicker. */
  mosaicH: number;
  mosaicV: number;
  /** A->B cut fraction. */
  swapAt: number;
  /** Floor for glitch strength so brief variants (Min/Short) still hit hard even
   * when the roll is small. Default 0 (Max keeps its roll-driven intensity). */
  intensityFloor?: number;
  /** Whether to confine the glitch to the Tile-Mask bands. Default true. Min has
   * an EMPTY tile mask (no bands) — set false so the RGB split + pixelate apply
   * FULL-FRAME (Min = a quick full-frame chromatic hit, no band texture). */
  bandMask?: boolean;
};

function sampleOffset(kf: BadSignalKf[], t: number): { dx: number; dy: number } {
  if (t <= kf[0].t) return { dx: kf[0].dx, dy: kf[0].dy };
  for (let i = 0; i < kf.length - 1; i++) {
    const a = kf[i], b = kf[i + 1];
    if (t >= a.t && t <= b.t) { const f = (t - a.t) / (b.t - a.t || 1); return { dx: a.dx + (b.dx - a.dx) * f, dy: a.dy + (b.dy - a.dy) * f }; }
  }
  return { dx: kf[kf.length - 1].dx, dy: kf[kf.length - 1].dy };
}

/**
 * GLITCH > Cinematic Bad Signal — from the project's REAL pieces: the Tile Mask
 * selects which horizontal bands tear; those bands show horizontally-displaced,
 * RGB-split footage; the real overlay plate adds the colored scanline texture;
 * a keyframed Offset rolls the whole thing; Mosaic pixelates the peak; real SFX.
 */
export const GlitchBadSignal: React.FC<TransitionProps & { params: GlitchBadSignalParams }> = ({
  from, to, fromSrc, toSrc, outClip, inClip, durationInFrames, sfx = true, sfxSrc, params,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const { offsets, tileDir, tileCount, tearX, split, plateDir, plateCount, plateBlend, plateOpacity, mosaicH, mosaicV, swapAt } = params;
  const p = interpolate(frame, [0, durationInFrames - 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const tSec = frame / fps;
  const { dx, dy } = sampleOffset(offsets, tSec);
  const rollInt = Math.min(1, Math.abs(dy) * 1.6 + Math.abs(dx) * 5);
  const intensity = Math.max(rollInt, params.intensityFloor ?? 0);

  const swapTo = p >= swapAt;
  const content = swapTo ? to : from;
  const src = swapTo ? toSrc : fromSrc;
  const offX = dx * width;
  const offY = dy * height;
  // plates/masks advance at real-time 1:1 with the window (same source length)
  const tileIdx = Math.min(tileCount, Math.max(1, frame + 1));
  const tileUrl = staticFile(`${tileDir}/m_${String(tileIdx).padStart(3, '0')}.png`);
  const plateIdx = Math.min(plateCount, Math.max(1, frame + 1));
  const plateUrl = staticFile(`${plateDir}/p_${String(plateIdx).padStart(3, '0')}.png`);
  const tear = tearX * width;

  const mask = {
    WebkitMaskImage: `url(${tileUrl})`, maskImage: `url(${tileUrl})`,
    WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
    WebkitMaskSize: `${width}px ${height}px`, maskSize: `${width}px ${height}px`,
  } as const;
  const bg = (x: number) => ({
    backgroundImage: src ? `url(${staticFile(src)})` : undefined,
    backgroundRepeat: 'repeat' as const,
    backgroundSize: `${width}px ${height}px`,
    backgroundPosition: `${offX + x}px ${offY}px`,
  });

  // video mode: displace the live clip node (longform); else the image src (demo)
  const clipFn = swapTo ? inClip : outClip;
  const redF = 'saturate(6) hue-rotate(-50deg) brightness(1.1)';
  const cyanF = 'saturate(6) hue-rotate(150deg) brightness(1.1)';
  const useMask = params.bandMask !== false; // Min has empty tile mask -> full-frame
  const mm = useMask ? mask : {}; // chroma mask (image path)

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', overflow: 'hidden' }}>
      {clipFn ? (
        <>
          {/* VIDEO path: wrap-displace the live clip */}
          <WrapLayer render={clipFn} x={offX} y={offY} />
          {useMask && <WrapLayer render={clipFn} x={offX + tear} y={offY} maskUrl={tileUrl} />}
          <WrapLayer render={clipFn} x={offX + tear + split} y={offY} maskUrl={useMask ? tileUrl : undefined} blend="screen" filter={redF} opacity={0.6} />
          <WrapLayer render={clipFn} x={offX + tear - split} y={offY} maskUrl={useMask ? tileUrl : undefined} blend="screen" filter={cyanF} opacity={0.6} />
        </>
      ) : src ? (
        <>
          {/* IMAGE path (demo): background-image displacement */}
          <AbsoluteFill style={bg(0)} />
          {useMask && <AbsoluteFill style={{ ...bg(tear), ...mask }} />}
          <AbsoluteFill style={{ ...bg(tear + split), ...mm, mixBlendMode: 'screen', filter: redF, opacity: 0.6 }} />
          <AbsoluteFill style={{ ...bg(tear - split), ...mm, mixBlendMode: 'screen', filter: cyanF, opacity: 0.6 }} />
        </>
      ) : (
        <AbsoluteFill>{content}</AbsoluteFill>
      )}

      {/* mosaic pixelate flicker (real 128x72), gated to the peak */}
      {src && intensity > 0.45 && (
        <AbsoluteFill style={{ ...mm, opacity: 0.9 * intensity }}>
          <Img src={staticFile(src)} style={{ width: mosaicH, height: mosaicV, transform: `translateY(${offY * (mosaicV / height)}px) scale(${width / mosaicH}, ${height / mosaicV})`, transformOrigin: 'top left', imageRendering: 'pixelated' }} />
        </AbsoluteFill>
      )}

      {/* REAL overlay plate (RGB/scanline texture) with its blend mode */}
      <AbsoluteFill style={{ mixBlendMode: plateBlend as any, opacity: plateOpacity }}>
        <Img src={plateUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>
      {/* SFX is emitted by the wrapper (TransitionDemo / TransitionClip) so it can
          ring out past short windows; the engine no longer plays it. */}
    </AbsoluteFill>
  );
};

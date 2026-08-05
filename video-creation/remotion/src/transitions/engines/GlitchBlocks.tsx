import React from 'react';
import {
  AbsoluteFill,
  Audio,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { TransitionProps } from '../types';
import { WrapLayer } from '../WrapLayer';

export type GlitchBlocksOffset = { dx: number; dy: number };

export type GlitchBlocksParams = {
  /** REAL "Shift Center To" deltas (dx,dy from 0.5 center) extracted per
   * sequence; count = intensity (Max 6, Medium 4, Short/Strips 2). */
  offsets: GlitchBlocksOffset[];
  /** Opacity envelope peak fraction (project: 0.333 of the window). */
  opacityPeak: number;
  /** Folder of the REAL block-mask PNG sequence (luma->alpha of the pack's own
   * `Gth - Disp Blocks *.mp4`), relative to the public dir. */
  maskDir: string;
  /** Number of frames in that mask sequence. */
  maskCount: number;
  /** Vertical stretch percent (project Geometry2 Scale Height: 150, or null). */
  scaleH?: number | null;
};

/**
 * GLITCH > Blocks — driven by the PROJECT'S OWN ASSETS, nothing invented.
 * The block shapes + their animation come from the pack's real black/white
 * `Gth - Disp Blocks *.mp4` (converted to an alpha mask, white=show); the
 * displacement amounts are the real Offset "Shift Center To" vectors from the
 * project. For each offset we show a wrap-shifted copy of the footage revealed
 * only through the (same-shift) real block mask; the whole glitch layer flashes
 * with the real Opacity envelope (0->100->0, peak ~0.33) with the A->B cut at
 * the peak.
 */
export const GlitchBlocks: React.FC<TransitionProps & { params: GlitchBlocksParams }> = ({
  from,
  to,
  fromSrc,
  toSrc,
  outClip,
  inClip,
  durationInFrames,
  sfx = true,
  sfxSrc,
  params,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const { offsets, opacityPeak, maskDir, maskCount, scaleH } = params;

  const glitchOpacity = interpolate(p, [0, opacityPeak, 1], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const swapTo = p >= opacityPeak; // cut buried at the opacity peak
  const srcNow = swapTo ? toSrc : fromSrc;
  const content = swapTo ? to : from;
  // Over a longform edit the scenes are LIVE nodes (spine video / cover elements), not bitmaps:
  // displace those through the same masks instead of a background-image copy. Without this the
  // glitch layer renders empty over video and the cut plays bare (the other footage engines were
  // upgraded for live clips; this one was missed).
  const clipFn = swapTo ? inClip : outClip;
  const useClips = !srcNow && Boolean(clipFn);

  // pick the real mask frame for this moment in the window
  const maskIdx = Math.min(maskCount, Math.max(1, Math.round(p * (maskCount - 1)) + 1));
  const maskUrl = staticFile(`${maskDir}/m_${String(maskIdx).padStart(3, '0')}.png`);
  const sy = (scaleH ?? 100) / 100;
  const bgSize = `${width}px ${height * sy}px`;

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', overflow: 'hidden' }}>
      {/* clean incoming/outgoing frame underneath */}
      <AbsoluteFill>{content}</AbsoluteFill>

      {/* glitch layer: one wrap-shifted, mask-revealed copy per real offset */}
      <AbsoluteFill style={{ opacity: glitchOpacity }}>
        {offsets.map((o, i) => {
          const offX = o.dx * width;
          const offY = o.dy * height;
          const pos = `${offX}px ${offY}px`;
          if (useClips) {
            const stretched = sy === 1 ? clipFn! : () => (
              <AbsoluteFill style={{ transform: `scaleY(${sy})` }}>{clipFn!()}</AbsoluteFill>
            );
            return (
              <WrapLayer key={i} render={stretched} x={offX} y={offY}
                maskUrl={maskUrl} maskRepeat="repeat" maskPosition={pos} />
            );
          }
          return (
            <AbsoluteFill
              key={i}
              style={{
                backgroundImage: srcNow ? `url(${staticFile(srcNow)})` : undefined,
                backgroundRepeat: 'repeat',
                backgroundSize: bgSize,
                backgroundPosition: pos,
                // reveal only through the REAL block mask, shifted the same way
                WebkitMaskImage: `url(${maskUrl})`,
                maskImage: `url(${maskUrl})`,
                WebkitMaskRepeat: 'repeat',
                maskRepeat: 'repeat',
                WebkitMaskSize: `${width}px ${height}px`,
                maskSize: `${width}px ${height}px`,
                WebkitMaskPosition: pos,
                maskPosition: pos,
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* SFX emitted by the wrapper (TransitionDemo / TransitionClip), not here. */}
    </AbsoluteFill>
  );
};

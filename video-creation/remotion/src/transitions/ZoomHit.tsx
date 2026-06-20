import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import { TransitionProps } from './types';

/**
 * ZOOM > Hit  (Swiftly category ZOOM, variant "Hit").
 *
 * Kind: geometric / near-1:1. Pure radial zoom across the cut with a fast,
 * un-eased "hit" attack. Premiere builds this from ADBE Geometry2 (Transform
 * scale) keyframes + ADBE Motion Blur. Here: CSS scale + a velocity-driven
 * blur that stands in for motion blur. Outgoing punches IN, the cut is hidden
 * at peak scale, incoming falls OUT to rest.
 */
export const ZoomHit: React.FC<TransitionProps> = ({
  from,
  to,
  durationInFrames,
  sfx = true,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const PEAK = 6; // max scale at the cut
  const showFrom = p < 0.5;

  // Outgoing: 1 -> PEAK with an aggressive ease-in ("hit").
  // Incoming: PEAK -> 1 with an ease-out settle.
  const scale = showFrom
    ? interpolate(p, [0, 0.5], [1, PEAK], { easing: Easing.in(Easing.cubic) })
    : interpolate(p, [0.5, 1], [PEAK, 1], { easing: Easing.out(Easing.cubic) });

  // Motion-blur stand-in: proportional to zoom velocity (max at the cut).
  const blur = interpolate(p, [0, 0.5, 1], [0, 28, 0], {
    easing: Easing.linear,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', overflow: 'hidden' }}>
      <AbsoluteFill
        style={{
          transform: `scale(${scale})`,
          filter: `blur(${blur}px)`,
          willChange: 'transform, filter',
        }}
      >
        {showFrom ? from : to}
      </AbsoluteFill>
      {sfx && <Audio src={staticFile('transitions/lib/sfx-zoom-hit.mp3')} />}
    </AbsoluteFill>
  );
};

import React from 'react';
import {
  AbsoluteFill,
  Audio,
  interpolate,
  OffthreadVideo,
  random,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { TransitionProps } from './types';

/**
 * GLITCH > VHS  (Swiftly category GLITCH, variant "TV VHS Max").
 *
 * Kind: footage / near-1:1. Uses the ACTUAL Swiftly glitch plate
 * (transitions/lib/glitch-vhs.mp4) screened over the cut, exactly as the
 * Premiere project composites it. We add the period-correct extras the pack
 * applies to the underlying footage during the glitch: RGB (chromatic) split,
 * horizontal tear/jitter, and a hard A->B swap buried at the glitch peak so
 * the cut is invisible.
 */
export const GlitchVhs: React.FC<TransitionProps> = ({
  from,
  to,
  durationInFrames,
  sfx = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Glitch intensity envelope: ramps in, peaks at the cut, decays out.
  const intensity = interpolate(p, [0, 0.45, 0.55, 1], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const showFrom = p < 0.5; // swap buried at the glitch peak

  // Per-frame jitter (seeded => deterministic across renders).
  const tear = (random(`tear-${frame}`) - 0.5) * 40 * intensity; // px horizontal
  const rgb = 14 * intensity; // chromatic split px
  const flick = 0.85 + random(`flick-${frame}`) * 0.15 * (intensity > 0 ? 1 : 0);

  const Footage = (
    <AbsoluteFill style={{ transform: `translateX(${tear}px)` }}>
      {showFrom ? from : to}
    </AbsoluteFill>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', overflow: 'hidden' }}>
      {/* Chromatic-aberration footage: R and B channels split, G centered. */}
      <AbsoluteFill
        style={{
          transform: `translateX(${-rgb}px)`,
          mixBlendMode: 'screen',
          filter: 'brightness(1) sepia(1) saturate(6) hue-rotate(-50deg)',
          opacity: intensity > 0 ? 0.9 : 0,
        }}
      >
        {Footage}
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          transform: `translateX(${rgb}px)`,
          mixBlendMode: 'screen',
          filter: 'brightness(1) sepia(1) saturate(6) hue-rotate(120deg)',
          opacity: intensity > 0 ? 0.9 : 0,
        }}
      >
        {Footage}
      </AbsoluteFill>
      {/* Base footage. */}
      <AbsoluteFill style={{ opacity: flick }}>{Footage}</AbsoluteFill>

      {/* The real Swiftly VHS plate, screened on top during the window. */}
      <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: intensity }}>
        <OffthreadVideo
          src={staticFile('transitions/lib/glitch-vhs.mp4')}
          muted
          // loop the 1s plate to cover any window length
          startFrom={0}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AbsoluteFill>

      {sfx && <Audio src={staticFile('transitions/lib/sfx-glitch-vhs.mp3')} />}
    </AbsoluteFill>
  );
};

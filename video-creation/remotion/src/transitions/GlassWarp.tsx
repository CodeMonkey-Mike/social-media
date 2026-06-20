import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from 'remotion';
import { TransitionProps } from './types';

/**
 * GLASS > Warp  (Swiftly category GLASS).
 *
 * Kind: shader / APPROXIMATE. This is the hard case: Premiere builds GLASS from
 * ADBE Lens Distortion + refraction that has no CSS equivalent. We approximate
 * the refraction with a real in-browser displacement map (SVG feTurbulence ->
 * feDisplacementMap), driven per-frame, plus a quick zoom. The displacement
 * peaks at the cut and hides the A->B swap. Honest expectation: reads as a
 * liquid-glass warp, not a byte-match of the Premiere lens math.
 */
export const GlassWarp: React.FC<TransitionProps> = ({
  from,
  to,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Displacement strength: 0 -> max at cut -> 0.
  const scale = interpolate(p, [0, 0.5, 1], [0, 220, 0], {
    easing: Easing.inOut(Easing.cubic),
  });
  // Coarser warp cells at the peak (baseFrequency drops as warp grows).
  const freq = interpolate(p, [0, 0.5, 1], [0.05, 0.012, 0.05]);
  const zoom = interpolate(p, [0, 0.5, 1], [1, 1.18, 1], {
    easing: Easing.inOut(Easing.cubic),
  });
  const showFrom = p < 0.5;
  const filterId = `glass-warp`;

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', overflow: 'hidden' }}>
      {/* Per-frame regenerated displacement map. seed bumps each frame so the
          glass surface shimmers rather than sitting static. */}
      <svg
        width={0}
        height={0}
        style={{ position: 'absolute' }}
        aria-hidden
      >
        <defs>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={freq}
              numOctaves={2}
              seed={Math.floor(frame / 2)}
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={scale}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <AbsoluteFill
        style={{
          transform: `scale(${zoom})`,
          filter: `url(#${filterId})`,
          willChange: 'transform, filter',
        }}
      >
        {showFrom ? from : to}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

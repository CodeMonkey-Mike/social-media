// lens.tsx: Premiere 'Lens Distortion' curvature for the whip-zoom (kt-whip-cut, the paper card text whip), via the
// SVG displacement approach the transitions engines already use (src/transitions/engines/OffsetSlide.tsx Warp family):
// the shared radial map LENS_MAP (src/transitions/engines/lensMap.ts, calibrated to Premiere's model
// src_r = r * (1 + (k / 100) * r^2), unit = half the frame height), overscanned + blurred in-filter, read by 4 chained
// feDisplacementMap passes at scale / 4 (the 8-bit wall fix documented in OffsetSlide). Negative curvature = barrel
// (centre magnified).
// The rows' curvature runs -100 -> 0. KT_LENS_MAX_K caps the magnitude at 60 (documented approximation, maxK prop
// overrides): (1) render cost: every chained pass reaches |scale| / 8 px, so at -100 the source is rasterized at about
// 7200x6400 px and ONE frame took ~40 s (QA 2026-10-25, the whip's first frame; at -60 it renders at normal speed);
// (2) Premiere's model folds over beyond about -60 inside the frame (src_r turns back toward the centre) and the
// transitions library is QA'd only to -59. The capped frames are the first 2-4 of a whip, where the 200 -> 140 percent
// zoom and its radial shutter blur dominate the picture (2023 frames at 14.37 read as blur, not as a fold).
import React from 'react';
import { LENS_MAP, LENS_OVERSCAN, LENS_SCALE_PER_K } from '../../transitions/engines/lensMap';
import { useUid } from './blur';

export const KT_LENS_MAX_K = 60;

export const KtLens: React.FC<{ k: number; children: React.ReactNode; width?: number; height?: number; maxK?: number }> = ({
  k,
  children,
  width = 1920,
  height = 1080,
  maxK = KT_LENS_MAX_K,
}) => {
  const id = useUid('ktlens');
  const kk = Math.max(-maxK, Math.min(maxK, k));
  const scale = kk * LENS_SCALE_PER_K;
  if (Math.abs(scale) < 0.5) return <>{children}</>;
  return (
    <>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id={id} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
            <feImage
              href={LENS_MAP}
              x={-LENS_OVERSCAN * width}
              y={-LENS_OVERSCAN * height}
              width={width * (1 + 2 * LENS_OVERSCAN)}
              height={height * (1 + 2 * LENS_OVERSCAN)}
              preserveAspectRatio="none"
              result="lmapRaw"
            />
            <feGaussianBlur in="lmapRaw" stdDeviation="40" result="lmap" />
            <feGaussianBlur in="SourceGraphic" stdDeviation={Math.min(2, Math.abs(scale) / 1600)} result="d0" />
            <feDisplacementMap in="d0" in2="lmap" scale={scale / 4} xChannelSelector="R" yChannelSelector="G" result="d1" />
            <feDisplacementMap in="d1" in2="lmap" scale={scale / 4} xChannelSelector="R" yChannelSelector="G" result="d2" />
            <feDisplacementMap in="d2" in2="lmap" scale={scale / 4} xChannelSelector="R" yChannelSelector="G" result="d3" />
            <feDisplacementMap in="d3" in2="lmap" scale={scale / 4} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
      <div style={{ position: 'absolute', left: 0, top: 0, width, height, filter: `url(#${id})` }}>{children}</div>
    </>
  );
};

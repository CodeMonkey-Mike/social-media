import React from 'react';
import { AbsoluteFill, useVideoConfig } from 'remotion';

/**
 * Renders a source (image OR video node) wrap-tiled so it can be offset past the
 * frame edges without revealing gaps — the node is instantiated in a 3x3 grid,
 * the whole group translated by (x,y). Used by the transition engines so the
 * SAME effect works over stills (the demo) and over live video clips (longform
 * via TransitionClip). `render` must return a fresh full-frame node each call.
 */
export const WrapLayer: React.FC<{
  render: () => React.ReactNode;
  x: number;
  y: number;
  maskUrl?: string;
  /** Block-style masks tile and travel with the offset; tear masks stay put. */
  maskRepeat?: string;
  maskPosition?: string;
  filter?: string;
  blend?: string;
  opacity?: number;
}> = ({ render, x, y, maskUrl, maskRepeat = 'no-repeat', maskPosition, filter, blend, opacity }) => {
  const { width, height } = useVideoConfig();
  const maskStyle: React.CSSProperties = maskUrl
    ? {
        WebkitMaskImage: `url(${maskUrl})`,
        maskImage: `url(${maskUrl})`,
        WebkitMaskSize: `${width}px ${height}px`,
        maskSize: `${width}px ${height}px`,
        WebkitMaskRepeat: maskRepeat,
        maskRepeat: maskRepeat,
        ...(maskPosition ? { WebkitMaskPosition: maskPosition, maskPosition } : {}),
      }
    : {};
  // Only the tiles that can actually intersect the frame are rendered. For any offset smaller
  // than one frame, that is 2 columns x 2 rows, never 9 — the other 5 were always off-screen.
  // This matters because `render()` may be a LIVE <OffthreadVideo>: at 9 tiles per layer a
  // multi-layer engine fired ~50 simultaneous frame fetches for the same clip and saturated
  // Remotion's proxy, which timed out the render outright (kaspa 30bps, twice, on the same spin
  // over a video b-roll clip). Pixel-identical output, less than half the requests.
  const cols = x > 0 ? [-1, 0] : x < 0 ? [0, 1] : [0];
  const rows = y > 0 ? [-1, 0] : y < 0 ? [0, 1] : [0];
  const tiles: React.ReactNode[] = [];
  for (const i of cols) {
    for (const j of rows) {
      tiles.push(
        <AbsoluteFill key={`${i}_${j}`} style={{ transform: `translate(${i * width + x}px, ${j * height + y}px)` }}>
          {render()}
        </AbsoluteFill>
      );
    }
  }
  return (
    <AbsoluteFill style={{ ...maskStyle, mixBlendMode: blend as any, opacity, filter, overflow: 'hidden' }}>
      {tiles}
    </AbsoluteFill>
  );
};

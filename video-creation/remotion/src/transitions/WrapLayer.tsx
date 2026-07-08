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
  filter?: string;
  blend?: string;
  opacity?: number;
}> = ({ render, x, y, maskUrl, filter, blend, opacity }) => {
  const { width, height } = useVideoConfig();
  const maskStyle: React.CSSProperties = maskUrl
    ? {
        WebkitMaskImage: `url(${maskUrl})`,
        maskImage: `url(${maskUrl})`,
        WebkitMaskSize: `${width}px ${height}px`,
        maskSize: `${width}px ${height}px`,
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
      }
    : {};
  const tiles: React.ReactNode[] = [];
  for (const i of [-1, 0, 1]) {
    for (const j of [-1, 0, 1]) {
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

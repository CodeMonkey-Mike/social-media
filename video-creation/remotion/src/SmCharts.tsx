import React from 'react';
import { AbsoluteFill, Sequence, Img, staticFile, useCurrentFrame, interpolate, Easing } from 'remotion';
import { SM_CHARTS } from './smChartsData';
import type { SmChartDef } from './smChartsData';

export const SMCHARTS_FPS = 30;
const PER = 120; // 4s per chart in the preview
export const SMCHARTS_FRAMES = SM_CHARTS.length * PER;

// One animated chart: the approved static PNG, revealed left-to-right (line draws on / bars grow in)
// via a clipped wrapper, plus a gentle scale-in + fade. A clipped bitmap is pixel-stable, so once the
// reveal completes the frame is byte-identical (no shimmer/bounce).
export const SmChart: React.FC<{ def: SmChartDef; revealStart?: number }> = ({ def, revealStart = 5 }) => {
  const frame = useCurrentFrame();
  const fit = Math.min(1920 / def.w, 1080 / def.h);
  const W = Math.round(def.w * fit);
  const H = Math.round(def.h * fit);

  const revealPx = interpolate(frame, [revealStart, revealStart + 43], [0, W], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const op = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const sc = interpolate(frame, [0, 14], [0.985, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#0a1012', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: W, height: H, opacity: op, transform: `scale(${sc})` }}>
        <div style={{ width: revealPx, height: H, overflow: 'hidden' }}>
          <Img
            src={staticFile('charts/' + def.png)}
            style={{ width: W, height: H, maxWidth: 'none', display: 'block' }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Preview composition: all 6 charts in chapter order, 4s each, each with the reveal animation.
export const SmChartsPreview: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a1012' }}>
      {SM_CHARTS.map((def, i) => (
        <Sequence key={def.key} from={i * PER} durationInFrames={PER}>
          <SmChart def={def} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

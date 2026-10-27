// blur.tsx: the motion blur of the 2023 devices.
// - ShutterBlur: a real multi-sample shutter (the rows' "360-degree" / "180-degree motion blur"): the layer is rendered at
//   N sub-frame times spread over the shutter, each at 1/N opacity, summed with plus-lighter in an isolated group =
//   the exact average of the samples. Sample times are clamped at the device's first frame, as a Premiere effect
//   holds its first keyframe at a clip head, so the first frame is fully opaque and smears forward.
// - DirBlur: a directional gaussian (SVG feGaussianBlur with separate x / y deviations) for big layers (video panels,
//   cards, icons) whose streak length comes from their velocity (motion.ts shutterTravel).
import React from 'react';

/** A filter id that is valid inside url(#...) (React ids carry colons). */
export const useUid = (prefix: string) => {
  const id = React.useId();
  return prefix + id.replace(/[^a-zA-Z0-9_-]/g, '');
};

export const ShutterBlur: React.FC<{
  /** current time (seconds) */
  t: number;
  /** the device's first frame: samples never go before it */
  t0: number;
  /** renders the layer at a sample time */
  render: (ts: number) => React.ReactNode;
  /** shutter angle in degrees (360 = the whole frame interval) */
  angle?: number;
  samples?: number;
  /** blur only while the layer moves fast; render once otherwise */
  active?: boolean;
  fps?: number;
}> = ({ t, t0, render, angle = 360, samples = 8, active = true, fps = 30 }) => {
  if (!active || angle <= 0 || samples < 2) return <>{render(t)}</>;
  const span = angle / 360 / fps;
  const times: number[] = [];
  for (let k = 0; k < samples; k++) times.push(Math.max(t0, t + (k / (samples - 1) - 0.5) * span));
  return (
    <div style={{ position: 'absolute', inset: 0, isolation: 'isolate' }}>
      {times.map((ts, k) => (
        <div key={k} style={{ position: 'absolute', inset: 0, opacity: 1 / samples, mixBlendMode: 'plus-lighter' }}>
          {render(ts)}
        </div>
      ))}
    </div>
  );
};

/** Full-frame wrapper with a directional gaussian blur: sx along x, sy along y (px sigma). */
export const DirBlur: React.FC<{ sx: number; sy: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  sx,
  sy,
  children,
  style,
}) => {
  const id = useUid('ktdb');
  const on = sx > 0.3 || sy > 0.3;
  return (
    <>
      {on && (
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            <filter id={id} x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
              <feGaussianBlur in="SourceGraphic" stdDeviation={`${Math.max(0, sx)} ${Math.max(0, sy)}`} edgeMode="none" />
            </filter>
          </defs>
        </svg>
      )}
      <div style={{ position: 'absolute', inset: 0, filter: on ? `url(#${id})` : undefined, ...style }}>{children}</div>
    </>
  );
};

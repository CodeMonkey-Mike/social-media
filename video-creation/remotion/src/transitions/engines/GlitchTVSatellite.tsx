import React from 'react';
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { TransitionProps } from '../types';
import { WrapLayer } from '../WrapLayer';

export type GlitchTVSatelliteParams = {
  /** A->B cut in seconds — the plate pair's split point. */
  cut: number;
  /** t1 Tint-Mask window: SCREEN-FIXED luma matte (Roughly-verified semantics)
   * revealing grayscale content shredded by Turbulent Displace. */
  window: {
    t0: number;
    t1: number;
    maskDir: string;
    maskFrames: number;
    /** Seconds into the mask at window start (negative = pre-slot rack gap = no matte). */
    maskStart: number;
    turb: {
      amount: number;
      size: number;
      complexity: number;
      seed: number;
      evolution: { t: number; v: number }[];
    };
  };
  /** t2 keyframed full-frame wrap Offset roll (dx,dy = raw - 0.5, 25fps curve). */
  roll: { t: number; dx: number; dy: number }[];
  /** t3 REAL plate, PIN LIGHT on top; segment 2 has a media jump (seg2In). */
  plate: { dir: string; frames: number; seg1In: number; seg2In: number };
};

const PLATE_FPS = 25;

const wrapFrac = (v: number) => ((v % 1) + 1.5) % 1 - 0.5;

const sample2 = (curve: { t: number; dx: number; dy: number }[], t: number) => {
  if (t <= curve[0].t) return curve[0];
  const last = curve[curve.length - 1];
  if (t >= last.t) return last;
  for (let i = 1; i < curve.length; i++) {
    if (t <= curve[i].t) {
      const a = curve[i - 1];
      const b = curve[i];
      const f = (t - a.t) / Math.max(1e-6, b.t - a.t);
      return { t, dx: a.dx + (b.dx - a.dx) * f, dy: a.dy + (b.dy - a.dy) * f };
    }
  }
  return last;
};

const sample1 = (curve: { t: number; v: number }[], t: number) => {
  if (t <= curve[0].t) return curve[0].v;
  const last = curve[curve.length - 1];
  if (t >= last.t) return last.v;
  for (let i = 1; i < curve.length; i++) {
    if (t <= curve[i].t) {
      const a = curve[i - 1];
      const b = curve[i];
      return a.v + ((b.v - a.v) * (t - a.t)) / Math.max(1e-6, b.t - a.t);
    }
  }
  return last.v;
};

/**
 * GLITCH > TV Satellite — a composite of three verified mechanisms:
 *  - t1: the variant's REAL "Tint Mask" plate as a SCREEN-FIXED luma matte
 *    (Roughly-verified adjustment semantics) revealing the content converted to
 *    GRAYSCALE (the Tint decodes to black->black/white->white, Invert-family
 *    convention) then shredded by Turbulent Displace (real Amount 635 / Size
 *    11.9 / Horizontal / Evolution 0->360; bottom-up order: Tint first). The
 *    shred noise is feTurbulence per the Turbulent Displace engine calibration
 *    (fidelity: approximate for this piece).
 *  - t2: keyframed full-frame wrap Offset roll over content + window together
 *    (the adjustment sits above both).
 *  - t3: the REAL "TV Satellite" plate PIN-LIGHTED on top (Monitor-verified
 *    darken/lighten pair), split at the cut with a media jump to 0.32s.
 * SFX emitted by the wrapper.
 */
export const GlitchTVSatellite: React.FC<TransitionProps & { params: GlitchTVSatelliteParams }> = ({
  from, to, fromSrc, toSrc, outClip, inClip, durationInFrames, params,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const { cut, window: win, roll, plate } = params;
  const tSec = frame / fps;

  const swapTo = tSec >= cut;
  const src = swapTo ? toSrc : fromSrc;
  const clipFn = swapTo ? inClip : outClip;
  const content = swapTo ? to : from;

  const r = sample2(roll, tSec);
  const rollX = wrapFrac(r.dx) * width;
  const rollY = wrapFrac(r.dy) * height;

  const inWin = tSec >= win.t0 && tSec < win.t1;
  const maskIdxRaw = Math.floor((win.maskStart + (tSec - win.t0)) * PLATE_FPS) + 1;
  const maskActive = inWin && maskIdxRaw >= 1;
  const maskIdx = Math.min(win.maskFrames, Math.max(1, maskIdxRaw));
  const maskUrl = staticFile(`${win.maskDir}/m_${String(maskIdx).padStart(3, '0')}.png`);

  const evo = sample1(win.turb.evolution, tSec - win.t0);
  const scroll = (evo / 360) * win.turb.size * 2;
  const dispScale = win.turb.amount * 2;
  const along = 1 / (3 * win.turb.size);
  const across = 1 / (1.5 * win.turb.size);

  const plateT = tSec < cut ? plate.seg1In + tSec : plate.seg2In + (tSec - cut);
  const plateIdx = Math.min(plate.frames, Math.max(1, Math.floor(plateT * PLATE_FPS) + 1));
  const plateUrl = staticFile(`${plate.dir}/p_${String(plateIdx).padStart(3, '0')}.png`);

  const shredId = `gtv-shred-${frame}`;

  const renderContent = () =>
    clipFn ? clipFn() : (
      <Img src={staticFile(src!)} style={{ width: `${width}px`, height: `${height}px`, objectFit: 'cover' }} />
    );

  if (!clipFn && !src) return <AbsoluteFill>{content}</AbsoluteFill>;

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', overflow: 'hidden' }}>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          {/* grayscale (Rec601) FIRST, then the horizontal turbulence shred —
              fresh filter node per frame (frame-keyed id, stale-filter gotcha). */}
          <filter
            id={shredId}
            filterUnits="userSpaceOnUse"
            x={-width * 0.5}
            y={-height * 0.5}
            width={width * 2}
            height={height * 2}
            colorInterpolationFilters="sRGB"
          >
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0 0 0 1 0"
              result="gray"
            />
            <feTurbulence
              type="fractalNoise"
              baseFrequency={`${along.toFixed(6)} ${across.toFixed(6)}`}
              numOctaves={1}
              seed={win.turb.seed}
              result="noise0"
            />
            <feOffset in="noise0" dx={-scroll} dy={-scroll} result="noise" />
            <feColorMatrix
              in="noise"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 0 0 0.5  0 0 0 0 1"
              result="map"
            />
            <feDisplacementMap in="gray" in2="map" scale={dispScale} xChannelSelector="R" yChannelSelector="B" />
          </filter>
          <filter id="gtv-pl-dark" colorInterpolationFilters="sRGB">
            <feComponentTransfer>
              <feFuncR type="linear" slope={2} intercept={0} />
              <feFuncG type="linear" slope={2} intercept={0} />
              <feFuncB type="linear" slope={2} intercept={0} />
            </feComponentTransfer>
          </filter>
          <filter id="gtv-pl-light" colorInterpolationFilters="sRGB">
            <feComponentTransfer>
              <feFuncR type="linear" slope={2} intercept={-1} />
              <feFuncG type="linear" slope={2} intercept={-1} />
              <feFuncB type="linear" slope={2} intercept={-1} />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>

      {/* the keyframed roll carries content + shred window together (the Offset
          adjustment sits above both); mask per tile so the matte wraps along. */}
      <WrapLayer
        x={rollX}
        y={rollY}
        render={() => (
          <AbsoluteFill style={{ overflow: 'hidden' }}>
            {renderContent()}
            {maskActive && (
              <AbsoluteFill
                style={{
                  WebkitMaskImage: `url(${maskUrl})`,
                  maskImage: `url(${maskUrl})`,
                  WebkitMaskSize: `${width}px ${height}px`,
                  maskSize: `${width}px ${height}px`,
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                }}
              >
                <AbsoluteFill style={{ filter: `url(#${shredId})` }}>
                  {renderContent()}
                </AbsoluteFill>
              </AbsoluteFill>
            )}
          </AbsoluteFill>
        )}
      />

      {/* the REAL plate pin-lights over everything (NOT rolled — it sits above
          the offset adjustment). Pin Light = darken(2s) + lighten(2s-1). */}
      <AbsoluteFill style={{ mixBlendMode: 'darken', filter: 'url(#gtv-pl-dark)' }}>
        <Img src={plateUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ mixBlendMode: 'lighten', filter: 'url(#gtv-pl-light)' }}>
        <Img src={plateUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>
      {/* SFX emitted by the wrapper (TransitionDemo / TransitionClip), not here. */}
    </AbsoluteFill>
  );
};

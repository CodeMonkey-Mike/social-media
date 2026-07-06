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

type Kf1 = { t: number; v: number }[];
type Kf2 = { t: number; dx: number; dy: number }[];

export type GlitchVHSParams = {
  cut: number;
  /** t1 full-frame adjustment: keyframed wash tint + unsharp ringing + mild
   * turbulence whose field scrolls on the REAL "Offset (Turbulence)" curve. */
  adjust: {
    t0: number;
    t1: number;
    tintAmount: Kf1;
    tintBlack: [number, number, number];
    unsharpAmount: Kf1;
    unsharpRadius: number;
    turbAmount: Kf1;
    turbSize: number;
    turbSeed: number;
    scroll: Kf2;
  };
  /** t2 window: tint(green)->emboss->blur copy; NORMAL takeover until pinFrom,
   * PIN LIGHT after (the project keyframes the blend pair (18,0)->(8,17)). */
  hst: {
    t0: number;
    t1: number;
    pinFrom: number;
    blurPx: number;
    emboss: { reliefPx: number; contrast: number };
  };
  /** t3 keyframed full-frame wrap Offset roll. */
  roll: Kf2;
  /** t4 REAL VHS plate pin-lighted on top; media continuous, starts at t0. */
  plate: { dir: string; frames: number; t0: number; in0: number };
};

const PLATE_FPS = 25;

const wrapFrac = (v: number) => ((v % 1) + 1.5) % 1 - 0.5;

const sample1 = (curve: Kf1, t: number) => {
  if (!curve || !curve.length) return 0;
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

const sample2 = (curve: Kf2, t: number) => {
  if (!curve || !curve.length) return { t, dx: 0, dy: 0 };
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

/**
 * GLITCH > VHS — four adjustment layers + one real plate (the pack's most
 * stacked recipe), every number from the project:
 *  - t1 (in-filter, frame-keyed id): wash Tint (black->gray31, keyframed
 *    amount; implemented as a LERPED color matrix — no arithmetic composite,
 *    alpha-trap safe) -> Unsharp Mask (keyframed 0->500->0, radius 4;
 *    feGaussianBlur + arithmetic feComposite k2=1+A,k3=-A which keeps alpha=1)
 *    -> Turbulent Displace (keyframed 0->50->0, Size 100, Horizontal, field
 *    scrolled by the REAL keyframed Offset (Turbulence) curve; feTurbulence
 *    per the family calibration). The source's Solid Composite black backing
 *    is approximated by the wrap padding (documented).
 *  - t2 window: green/black HST tint -> emboss -> Fast Blur (bottom-up order),
 *    composited NORMAL (full takeover) until pinFrom, PIN LIGHT after
 *    (in-filter darken/lighten vs SourceGraphic, Offset-engine pattern).
 *  - t3: keyframed wrap Offset roll around everything below.
 *  - t4: the real plate pin-lighted on top (Monitor pair), media continuous.
 */
export const GlitchVHS: React.FC<TransitionProps & { params: GlitchVHSParams }> = ({
  from, to, fromSrc, toSrc, outClip, inClip, durationInFrames, params,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const { cut, adjust, hst, roll, plate } = params;
  const tSec = frame / fps;

  const swapTo = tSec >= cut;
  const src = swapTo ? toSrc : fromSrc;
  const clipFn = swapTo ? inClip : outClip;
  const content = swapTo ? to : from;

  const r = sample2(roll, tSec);
  const rollX = wrapFrac(r.dx) * width;
  const rollY = wrapFrac(r.dy) * height;

  const inAdj = tSec >= adjust.t0 && tSec < adjust.t1;
  const inHst = tSec >= hst.t0 && tSec < hst.t1;
  const pin = tSec >= hst.pinFrom;

  // t1 params this frame
  const tintA = sample1(adjust.tintAmount, tSec) / 100;
  // AE Unsharp thresholds away low-contrast diffs (Threshold 0.12) which tempers
  // the literal 500% enormously; 0.4x gain matches the previews (calibration).
  const usA = (sample1(adjust.unsharpAmount, tSec) / 100) * 0.4;
  const turbA = sample1(adjust.turbAmount, tSec);
  const sc = sample2(adjust.scroll, tSec);

  // lerped wash-tint matrix: out = (1-a)*src + a*(black + L*(white-black)),
  // white = 1 -> out_c = (1-a)*src_c + a*(b_c + (1-b_c)*L)
  const [br, bg, bb] = adjust.tintBlack;
  const L = [0.299, 0.587, 0.114];
  const rowFor = (b: number, ch: number) =>
    [0, 1, 2]
      .map((i) => (i === ch ? (1 - tintA) + tintA * (1 - b) * L[i] : tintA * (1 - b) * L[i]))
      .map((x) => x.toFixed(5))
      .join(' ');
  const tintMatrix = `${rowFor(br, 0)} 0 ${(tintA * br).toFixed(5)}  ${rowFor(bg, 1)} 0 ${(tintA * bg).toFixed(5)}  ${rowFor(bb, 2)} 0 ${(tintA * bb).toFixed(5)}  0 0 0 1 0`;

  const along = 1 / (3 * adjust.turbSize);
  const across = 1 / (1.5 * adjust.turbSize);

  const k = hst.emboss.contrast;
  const kernelGap = Array(Math.max(0, hst.emboss.reliefPx - 2)).fill(0).join(' ');

  const adjId = `gvhs-adj-${frame}`;

  const plateActive = tSec >= plate.t0;
  const plateIdx = Math.min(plate.frames, Math.max(1, Math.floor((plate.in0 + (tSec - plate.t0)) * PLATE_FPS) + 1));
  const plateUrl = staticFile(`${plate.dir}/p_${String(plateIdx).padStart(3, '0')}.png`);

  const renderContent = () =>
    clipFn ? clipFn() : (
      <Img src={staticFile(src!)} style={{ width: `${width}px`, height: `${height}px`, objectFit: 'cover' }} />
    );

  if (!clipFn && !src) return <AbsoluteFill>{content}</AbsoluteFill>;

  // t2 chain (tint -> emboss -> blur), shared by both blend phases
  const hstChain = (
    <>
      <feColorMatrix
        in="SourceGraphic"
        type="matrix"
        values="0 0 0 0 0  -0.299 -0.587 -0.114 0 1  0 0 0 0 0  0 0 0 0 1"
        result="tint"
      />
      <feConvolveMatrix
        in="tint"
        order={`1 ${hst.emboss.reliefPx}`}
        kernelMatrix={`${k} ${kernelGap} ${-k}`}
        divisor="1"
        bias="0.5"
        preserveAlpha="true"
        edgeMode="duplicate"
        result="emb"
      />
      <feGaussianBlur in="emb" stdDeviation={hst.blurPx * 0.2} result="s" />
    </>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', overflow: 'hidden' }}>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          {/* t1: wash tint -> unsharp -> turbulence, fresh node per frame */}
          <filter
            id={adjId}
            filterUnits="userSpaceOnUse"
            x={-width * 0.5}
            y={-height * 0.5}
            width={width * 2}
            height={height * 2}
            colorInterpolationFilters="sRGB"
          >
            <feColorMatrix in="SourceGraphic" type="matrix" values={tintMatrix} result="washed" />
            <feGaussianBlur in="washed" stdDeviation={adjust.unsharpRadius} result="usblur" />
            <feComposite in="washed" in2="usblur" operator="arithmetic" k1="0" k2={1 + usA} k3={-usA} k4="0" result="rung" />
            <feTurbulence
              type="fractalNoise"
              baseFrequency={`${along.toFixed(6)} ${across.toFixed(6)}`}
              numOctaves={1}
              seed={adjust.turbSeed}
              result="noise0"
            />
            <feOffset in="noise0" dx={-sc.dx * width} dy={-sc.dy * height} result="noise" />
            <feColorMatrix in="noise" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 0 0 0.5  0 0 0 0 1" result="map" />
            <feDisplacementMap in="rung" in2="map" scale={Math.max(0.01, turbA * 2)} xChannelSelector="R" yChannelSelector="B" />
          </filter>
          {/* t2 NORMAL takeover */}
          <filter id="gvhs-hst-normal" colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
            {hstChain}
          </filter>
          {/* t2 PIN LIGHT (darken/lighten vs SourceGraphic) */}
          <filter id="gvhs-hst-pin" colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
            {hstChain}
            <feComponentTransfer in="s" result="s2">
              <feFuncR type="linear" slope="2" intercept="0" />
              <feFuncG type="linear" slope="2" intercept="0" />
              <feFuncB type="linear" slope="2" intercept="0" />
            </feComponentTransfer>
            <feComponentTransfer in="s" result="s2m1">
              <feFuncR type="linear" slope="2" intercept="-1" />
              <feFuncG type="linear" slope="2" intercept="-1" />
              <feFuncB type="linear" slope="2" intercept="-1" />
            </feComponentTransfer>
            <feBlend mode="darken" in="SourceGraphic" in2="s2" result="d1" />
            <feBlend mode="lighten" in="d1" in2="s2m1" />
          </filter>
          <filter id="gvhs-pl-dark" colorInterpolationFilters="sRGB">
            <feComponentTransfer>
              <feFuncR type="linear" slope={2} intercept={0} />
              <feFuncG type="linear" slope={2} intercept={0} />
              <feFuncB type="linear" slope={2} intercept={0} />
            </feComponentTransfer>
          </filter>
          <filter id="gvhs-pl-light" colorInterpolationFilters="sRGB">
            <feComponentTransfer>
              <feFuncR type="linear" slope={2} intercept={-1} />
              <feFuncG type="linear" slope={2} intercept={-1} />
              <feFuncB type="linear" slope={2} intercept={-1} />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>

      <WrapLayer
        x={rollX}
        y={rollY}
        render={() => (
          <AbsoluteFill style={{ overflow: 'hidden' }}>
            <AbsoluteFill style={{ filter: inHst ? `url(#gvhs-hst-${pin ? 'pin' : 'normal'})` : undefined }}>
              <AbsoluteFill style={{ filter: inAdj ? `url(#${adjId})` : undefined }}>
                {renderContent()}
              </AbsoluteFill>
            </AbsoluteFill>
          </AbsoluteFill>
        )}
      />

      {plateActive && (
        <>
          <AbsoluteFill style={{ mixBlendMode: 'darken', filter: 'url(#gvhs-pl-dark)' }}>
            <Img src={plateUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </AbsoluteFill>
          <AbsoluteFill style={{ mixBlendMode: 'lighten', filter: 'url(#gvhs-pl-light)' }}>
            <Img src={plateUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </AbsoluteFill>
        </>
      )}
      {/* SFX emitted by the wrapper (TransitionDemo / TransitionClip), not here. */}
    </AbsoluteFill>
  );
};

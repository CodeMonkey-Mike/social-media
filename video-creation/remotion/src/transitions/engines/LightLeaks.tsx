import React from 'react';
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { TransitionProps } from '../types';

/**
 * LIGHT LEAKS / Light Leaks — real leak-footage flash transition (8 variants).
 *
 * Mechanism (per-clip extracted, _extract-lightleaks.js + the nested
 * "Pre Light Leaks N" sequences via _extract-lightleaks-nested.js):
 *   - CONTENT runs under a shared envelope: Gaussian Blur 0->35->0 peaking at the
 *     cut (0.32s), ProcAmp Brightness 0->25->0 and Contrast 100->200->100
 *     (0.16..0.68) — the flash that hides the A->B swap. All 8 variants share the
 *     SAME envelope (their Blur clips read 2s slots of one rack timeline).
 *   - LEAK LAYERS (1-3 per variant): the pack's REAL leak plates
 *     (Hst - Flr Light Leaks - N/Na/Nb -> lib/leaks/), each exactly 1.0s, window
 *     0..1 of the sequence, composited ABOVE the blurred content (leaks stay
 *     crisp while content blurs — real track order). "Change color here" layers
 *     carry a Change To Color to a decoded ARGB16 target (#0024FF blue, #F600FF
 *     magenta, #FF9C00 orange, #FF00A2 pink...).
 *   - A "Deviation" accent (Texture Adjustment rack slot 151 = a flat Color
 *     Matte + Emboss + green Tint) is present in the project but verified
 *     VISUALLY NIL (window-edge A/B on the preview: YMAX diff 13) — not rendered.
 *
 * fidelity: approximate — plates, curves, colors and timing are real; the
 * documented approximations: (a) the leak stack's Blend Mode params decode
 * ambiguously (pair (22,0)/(22,10) fits no verified enum reading) while the
 * previews PROVE all layers composite additively with recolors -> implemented
 * as SCREEN (standard leak compositing, preview-matched); (b) Change To Color
 * is approximated as a luma->target colorize with a white-core rolloff
 * (out_c = To_c*L + (1-To_c)*L^3); (c) AE blurriness -> Gaussian sigma and the
 * ProcAmp transfer use calibrated linear models (QA'd vs previews).
 */
type Handles = { iv?: number; ii?: number; ov?: number; oi?: number };
type KF = { t: number; v: number } & Handles;

export type LightLeaksParams = {
  /** A->B swap fraction = Blur (In)/(Out) boundary / duration (0.32/1.12). */
  cut: number;
  /** Leak layers bottom-up; src = staticFile path; to = recolor target [r,g,b] 0..1. */
  layers: { src: string; to?: [number, number, number] }[];
  /** Sequence window the leak plates occupy (0..1s). */
  leakWindow: [number, number];
  /** Shared content envelope, seq-time keyframes. */
  blur: KF[];       // AE Gaussian Blur 2 "Blurriness"
  brightness: KF[]; // ProcAmp Brightness (adds b/100 in 0..1 space)
  contrast: KF[];   // ProcAmp Contrast (% around 0.5)
};

const bez = (a: number, b: number, c: number, d: number, s: number) => {
  const u = 1 - s;
  return u * u * u * a + 3 * u * u * s * b + 3 * u * s * s * c + s * s * s * d;
};

/** Real AE temporal-bezier segment progress (same evaluator as OffsetSlide). */
const segProgress = (
  t0: number, t1: number, h0: Handles, h1: Handles, L: number, t: number,
) => {
  const dt = t1 - t0;
  if (dt <= 0) return 1;
  const lin = (t - t0) / dt;
  if ((h0.oi === undefined && h1.ii === undefined) || L === 0) return lin;
  const oi = Math.min(1, Math.max(1e-4, h0.oi ?? 1 / 3));
  const ii = Math.min(1, Math.max(1e-4, h1.ii ?? 1 / 3));
  const c1t = t0 + oi * dt;
  const c2t = t1 - ii * dt;
  const c1p = ((h0.ov ?? 0) * oi * dt) / L;
  const c2p = 1 - ((h1.iv ?? 0) * ii * dt) / L;
  let lo = 0, hi = 1, s = lin;
  for (let i = 0; i < 40; i++) {
    s = (lo + hi) / 2;
    if (bez(t0, c1t, c2t, t1, s) < t) lo = s; else hi = s;
  }
  return bez(0, c1p, c2p, 1, s);
};

const sampleKF = (kfs: KF[], t: number) => {
  if (t <= kfs[0].t) return kfs[0].v;
  const last = kfs[kfs.length - 1];
  if (t >= last.t) return last.v;
  let i = 0;
  while (i < kfs.length - 2 && t > kfs[i + 1].t) i++;
  const a = kfs[i], b = kfs[i + 1];
  const p = segProgress(a.t, b.t, a, b, b.v - a.v, t);
  return a.v + (b.v - a.v) * p;
};

/** AE Gaussian Blur "Blurriness" -> feGaussianBlur stdDeviation (calibrated;
 * AE's blurriness reads as ~radius, sigma ≈ blurriness/4 — preview-checked). */
const BLUR_SIGMA_K = 0.25;

/** ChangeToColor approximation: keep the SOURCE luma, take the TARGET hue/sat —
 * out = HSL(H_to, S_to, L_src), sampled into a per-channel lookup table. White
 * cores stay white (L->1), mids read as BRIGHT target color (the first model,
 * To*L + (1-To)*L^3, dimmed the mids — preview bokeh is bright blue, QA'd). */
const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const [r, g, b] =
    h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] :
    h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return [r + m, g + m, b + m];
};
const rgbToHs = ([r, g, b]: [number, number, number]) => {
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (d > 0) {
    if (max === r) h = 60 * (((g - b) / d) % 6);
    else if (max === g) h = 60 * ((b - r) / d + 2);
    else h = 60 * ((r - g) / d + 4);
  }
  return { h: (h + 360) % 360, s: Math.min(1, s) };
};
const colorTable = (to: [number, number, number], channel: 0 | 1 | 2) => {
  const { h, s } = rgbToHs(to);
  const N = 17;
  const vals: string[] = [];
  for (let i = 0; i < N; i++) {
    const L = i / (N - 1);
    vals.push(hslToRgb(h, s, L)[channel].toFixed(4));
  }
  return vals.join(' ');
};

export const LightLeaks: React.FC<TransitionProps & { params: LightLeaksParams }> = ({
  from, to, fromSrc, toSrc, outClip, inClip, durationInFrames, params,
}) => {
  const frame = useCurrentFrame();
  const { width: W, height: H, fps } = useVideoConfig();
  const { cut, layers, leakWindow, blur, brightness, contrast } = params;

  const tSec = frame / fps;
  const p = frame / Math.max(1, durationInFrames - 1);

  const swapTo = p >= cut;
  const src = swapTo ? toSrc : fromSrc;
  const clipFn = swapTo ? inClip : outClip;
  const content = swapTo ? to : from;

  const scene = () =>
    clipFn ? clipFn() : src ? (
      <Img src={staticFile(src)} style={{ width: `${W}px`, height: `${H}px`, objectFit: 'cover' }} />
    ) : (
      <AbsoluteFill>{content}</AbsoluteFill>
    );

  const b = Math.max(0, sampleKF(blur, tSec));
  const sigma = b * BLUR_SIGMA_K;
  const br = sampleKF(brightness, tSec) / 100;   // 0..0.25 add
  const ct = sampleKF(contrast, tSec) / 100;     // 1..2 slope around 0.5
  const envOn = sigma > 0.05 || Math.abs(br) > 0.001 || Math.abs(ct - 1) > 0.001;
  const envId = `lleak-env-${frame}`;

  const slope = ct;
  const intercept = 0.5 * (1 - ct) + br;

  const leaksOn = tSec >= leakWindow[0] && tSec < leakWindow[1];

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', overflow: 'hidden', isolation: 'isolate' }}>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          {envOn && (
            <filter id={envId} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
              <feGaussianBlur in="SourceGraphic" stdDeviation={sigma} edgeMode="duplicate" result="bl" />
              {/* ProcAmp: contrast around 0.5 + brightness add (linear transfer) */}
              <feComponentTransfer in="bl">
                <feFuncR type="linear" slope={slope} intercept={intercept} />
                <feFuncG type="linear" slope={slope} intercept={intercept} />
                <feFuncB type="linear" slope={slope} intercept={intercept} />
              </feComponentTransfer>
            </filter>
          )}
          {/* per-layer ChangeToColor colorize (luma -> target, white-core rolloff) */}
          {layers.map((l, i) => l.to && (
            <filter key={i} id={`lleak-col-${i}`} colorInterpolationFilters="sRGB">
              <feColorMatrix
                in="SourceGraphic"
                type="matrix"
                values="0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0 0 0 1 0"
                result="luma"
              />
              <feComponentTransfer in="luma">
                <feFuncR type="table" tableValues={colorTable(l.to, 0)} />
                <feFuncG type="table" tableValues={colorTable(l.to, 1)} />
                <feFuncB type="table" tableValues={colorTable(l.to, 2)} />
              </feComponentTransfer>
            </filter>
          ))}
        </defs>
      </svg>

      {/* content under the blur/flash envelope */}
      <AbsoluteFill style={{ filter: envOn ? `url(#${envId})` : undefined }}>
        {scene()}
      </AbsoluteFill>

      {/* REAL leak plates, screen-composited ABOVE the blurred content (leaks
          stay crisp — real track order). Two headless-Chromium compositing
          rules: (a) blend layers must be SIBLINGS of the filtered content div,
          never children of it; (b) filter and mix-blend-mode must NOT sit on
          the SAME element (the recolored layers rendered invisible when they
          did — 2026-07-12 probe) — blend on the outer, colorize on an inner. */}
      {leaksOn && layers.map((l, i) => (
        <AbsoluteFill key={i} style={{ mixBlendMode: 'screen' }}>
          <AbsoluteFill style={{ filter: l.to ? `url(#lleak-col-${i})` : undefined }}>
            <OffthreadVideo
              src={staticFile(l.src)}
              startFrom={0}
              style={{ width: `${W}px`, height: `${H}px`, objectFit: 'cover' }}
              muted
            />
          </AbsoluteFill>
        </AbsoluteFill>
      ))}
      {/* SFX (Simple_SFX whoosh) is emitted from the wrapper. */}
    </AbsoluteFill>
  );
};

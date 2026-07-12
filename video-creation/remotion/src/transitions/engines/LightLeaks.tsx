import React from 'react';
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { TransitionProps } from '../types';

/**
 * LIGHT LEAKS — real leak-footage flash transitions, ONE engine for all four
 * subgroups: Light Leaks (8, 1.12s), Light Leaks Short (8, 0.4s),
 * Soft (9, 1.44s), Soft Short (9, 0.4s).
 *
 * Mechanism (per-clip extracted, _extract-lightleaks*.js + nested sequences):
 *   - CONTENT under an envelope: Gaussian Blur 0->35->0 + ProcAmp flash
 *     (Brightness 0->25->0, Contrast 100->200->100) peaking at the cut — BUT the
 *     envelope is NOT full-frame: the Blur clips are Texture Adjustment RACK
 *     windows (slots 0-14 = "Blur Map 1..8", slots 16-32 = "Blur Map VH 1..9"),
 *     i.e. the blurred/flashed content shows through a SELF-LUMA-MATTED animated
 *     gradient map that SWEEPS across the frame (the Roughly rack semantics).
 *     Maps converted to alpha-PNG sequences (lib/leaks/maps/, white=opaque,
 *     30fps) and applied as per-frame CSS masks over an effected content copy
 *     — the v1 build applied the envelope full-frame; the map decode fixed it
 *     (2026-07-12, caught via the Soft subgroup's rack in-points).
 *   - LEAK LAYERS above (crisp, real track order): Light Leaks/Short = the
 *     nested "Pre Light Leaks N" plate stacks (recolors via decoded ARGB16
 *     Change To Color targets); Soft/Soft Short = TWO "_Simple Light Leaks"
 *     files, a DIFFERENT one each side of the cut ((Out) plays from media
 *     0.04s). Composited as SCREEN (the project's blend param pair
 *     (22,0)/(22,10) fits no verified enum reading; the previews prove
 *     additive-with-recolors compositing — preview-matched).
 *   - The "Deviation" accent (rack slot 151/151.2 = flat Color Matte + Emboss +
 *     green Tint) is verified VISUALLY NIL (preview window-edge A/B) — ships
 *     documented, unrendered. Soft variants carry none.
 *
 * fidelity: approximate — plates, maps, curves, colors and timing are real;
 * documented approximations: the Screen blend choice, the ChangeToColor
 * HSL(H_t,S_t,L_src) colorize, and the blurriness->sigma / ProcAmp transfer
 * constants (QA'd vs previews at native preview resolution).
 */
type Handles = { iv?: number; ii?: number; ov?: number; oi?: number };
type KF = { t: number; v: number } & Handles;

export type LightLeaksLayer = {
  /** staticFile path of the leak plate (lib/leaks/...). Soft (In) layers use the
   * PRE-REVERSED asset (…-rev.mp4): the project TIME-REMAPS them backward
   * (media 1.16 -> 0 over 0.36s) so the leak CRESCENDOS into the cut; a
   * reversed file played forward at the same rate is the exact equivalent
   * (OffthreadVideo cannot play backward). */
  src: string;
  /** Recolor target [r,g,b] 0..1 (decoded Change To Color), absent = natural. */
  to?: [number, number, number];
  /** Sequence-time window this layer occupies. */
  win: [number, number];
  /** Media time the plate plays from at win[0]. */
  mediaStart: number;
  /** Playback rate from the decoded time-remap slope (default 1). */
  rate?: number;
};

export type LightLeaksParams = {
  /** A->B swap fraction of the window. */
  cut: number;
  /** Animated blur-map matte: PNG-seq dir (lib/leaks/maps/bmN | bmvhN), frame
   * count, and the map-time offset (= the rack in-point minus the slot start —
   * Short variants read up to 0.2s INTO their slot). */
  map: { dir: string; frames: number; offset: number };
  layers: LightLeaksLayer[];
  /** Envelope keyframes in SEQUENCE time (builder subtracts the rack in-point). */
  blur: KF[];
  brightness: KF[];
  contrast: KF[];
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

/** Map PNG sequences are converted at this fps (fps=30 in the ffmpeg pipeline). */
const MAP_FPS = 30;

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
  const { cut, map, layers, blur, brightness, contrast } = params;

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

  // animated blur-map matte frame (converted PNG seq; map time = tSec + offset)
  const mapIdx = Math.min(map.frames, Math.max(1, Math.floor((tSec + map.offset) * MAP_FPS) + 1));
  const mapUrl = staticFile(`${map.dir}/m_${String(mapIdx).padStart(3, '0')}.png`);

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

      {/* clean content — the base layer */}
      <AbsoluteFill>{scene()}</AbsoluteFill>

      {/* effected content copy, revealed through the ANIMATED blur-map matte
          (mask on the outer div, filter on the inner — never both on one
          element, the headless-Chromium compositing rules). */}
      {envOn && (
        <AbsoluteFill
          style={{
            WebkitMaskImage: `url(${mapUrl})`,
            maskImage: `url(${mapUrl})`,
            WebkitMaskSize: `${W}px ${H}px`,
            maskSize: `${W}px ${H}px`,
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
          }}
        >
          <AbsoluteFill style={{ filter: `url(#${envId})` }}>
            {scene()}
          </AbsoluteFill>
        </AbsoluteFill>
      )}

      {/* REAL leak plates, screen-composited crisp on top (real track order).
          Blend on the outer wrapper, colorize filter on an inner child. Each
          layer runs in its own window with its own media start (Soft swaps to
          a DIFFERENT leak file after the cut, playing from 0.04s). */}
      {layers.map((l, i) => {
        const from0 = Math.round(l.win[0] * fps);
        const durF = Math.max(1, Math.round((l.win[1] - l.win[0]) * fps));
        return (
          <Sequence key={i} from={from0} durationInFrames={durF} layout="none">
            <AbsoluteFill style={{ mixBlendMode: 'screen' }}>
              <AbsoluteFill style={{ filter: l.to ? `url(#lleak-col-${i})` : undefined }}>
                <OffthreadVideo
                  src={staticFile(l.src)}
                  startFrom={Math.round(l.mediaStart * fps)}
                  playbackRate={l.rate ?? 1}
                  style={{ width: `${W}px`, height: `${H}px`, objectFit: 'cover' }}
                  muted
                />
              </AbsoluteFill>
            </AbsoluteFill>
          </Sequence>
        );
      })}
      {/* SFX (Simple_SFX whoosh) is emitted from the wrapper. */}
    </AbsoluteFill>
  );
};

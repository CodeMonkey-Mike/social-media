// KtSubscribeClose.tsx: kt-subscribe-close (library.json devices.kt-subscribe-close).
//   button    the green-screen stock clip (graphics/subscribe-button-alt.mp4, 1920x1080, a red rounded SUBSCRIBE button
//             that grows in on its own) from in 1.867 s to out 4.033 s (2.167 s), the WHOLE frame placed with its centre
//             at (942, 906) = 49.1 / 83.9 percent at 0.40 scale (button ~400x127 on the chest). No keyframes: the grow is
//             the clip's own (23 percent on the first frame, full at +0.333 s, linear), then still. Hard cut at arrowT.
//             Keyed IN-ENGINE on a canvas (onVideoFrame): Ultra Key approximation = an RGB distance key on the key
//             colour (row: #39E30D; the clip's screen measures #45FF13, 31 units away, inside the tolerance), a soft
//             ramp between tolerance and softness, colour decontamination of the edge pixels (un-mixing the key colour
//             out: FG = (P - (1 - a) * K) / a) and a despill (G <= max(R, B)) so no green fringe survives.
//   arrow     arrow-red.png (600x398, head on the RIGHT) at 300x199 px, centre (1044, 231) = 54.4 / 21.4 percent, rotated
//             -8.1 degrees, not mirrored; the 'Zoom Bounce IN' scaled to 0.217 s (0 -> 111 -> 93 -> 105 -> 98 -> 101 ->
//             100, opacity in 0.020 s), 180-degree shutter; pops on the button's cut frame; held to the end, no exit.
//             arrowSide 'left' mirrors it (image flipped, placed at 1920 - 1044, rotation +8.1).
import React from 'react';
import { Freeze, Img, OffthreadVideo } from 'remotion';
import { ShutterBlur } from './blur';
import { useKtFps, useKtTime } from './clock';
import { ELASTIC, elastic } from './motion';
import { KtSoundCue } from './types';

export const KT_SUBSCRIBE = {
  in: 1.867,
  out: 4.033,
  button: { cx: 942, cy: 906, scale: 0.4 },
  arrow: { cx: 1044, cy: 231, w: 300, h: 199, rot: -8.1 },
  key: { color: '#39E30D', tolerance: 60, softness: 190 },
};

const hex = (h: string) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

/** A green-screen video keyed on a canvas, drawn at w x h. sourceSec = the clip second to show. */
export const KtChromaKeyVideo: React.FC<{
  src: string;
  sourceSec: number;
  w: number;
  h: number;
  keyColor?: string;
  tolerance?: number;
  softness?: number;
  fps: number;
  style?: React.CSSProperties;
}> = ({ src, sourceSec, w, h, keyColor = KT_SUBSCRIBE.key.color, tolerance = KT_SUBSCRIBE.key.tolerance, softness = KT_SUBSCRIBE.key.softness, fps, style }) => {
  const ref = React.useRef<HTMLCanvasElement>(null);
  const [kr, kg, kb] = hex(keyColor);
  const onVideoFrame = React.useCallback(
    (frame: CanvasImageSource) => {
      const c = ref.current;
      if (!c) return;
      const ctx = c.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(frame, 0, 0, w, h);
      const img = ctx.getImageData(0, 0, w, h);
      const d = img.data;
      const span = Math.max(1, softness - tolerance);
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i];
        const g = d[i + 1];
        const b = d[i + 2];
        const dr = r - kr;
        const dg = g - kg;
        const db = b - kb;
        let a = (Math.sqrt(dr * dr + dg * dg + db * db) - tolerance) / span;
        if (a <= 0) {
          d[i + 3] = 0;
          continue;
        }
        if (a > 1) a = 1;
        let fr = r;
        let fg = g;
        let fb = b;
        if (a < 1) {
          fr = (r - (1 - a) * kr) / a;
          fg = (g - (1 - a) * kg) / a;
          fb = (b - (1 - a) * kb) / a;
        }
        const m = Math.max(fr, fb);
        if (fg > m) fg = m; // despill
        d[i] = fr < 0 ? 0 : fr > 255 ? 255 : fr;
        d[i + 1] = fg < 0 ? 0 : fg > 255 ? 255 : fg;
        d[i + 2] = fb < 0 ? 0 : fb > 255 ? 255 : fb;
        d[i + 3] = Math.round(a * 255);
      }
      ctx.putImageData(img, 0, 0);
    },
    [w, h, kr, kg, kb, tolerance, softness],
  );
  return (
    <div style={{ position: 'absolute', width: w, height: h, ...style }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0 }}>
        <Freeze frame={Math.max(0, Math.round(sourceSec * fps))}>
          <OffthreadVideo src={src} muted onVideoFrame={onVideoFrame} style={{ width: w, height: h }} />
        </Freeze>
      </div>
      <canvas ref={ref} width={w} height={h} style={{ position: 'absolute', left: 0, top: 0, width: w, height: h }} />
    </div>
  );
};

export type KtSubscribeCloseProps = {
  /** the button's first frame */
  t0: number;
  /** end of the close (the arrow holds to here) */
  t1: number;
  /** the green-screen button clip (staticFile path of graphics/subscribe-button-alt.mp4) */
  buttonSrc: string;
  /** the arrow png (staticFile path of graphics/arrow-red.png) */
  arrowSrc: string;
  /** the button cut + arrow pop (default t0 + the clip's 2.167 s) */
  arrowT?: number;
  arrowSide?: 'right' | 'left';
  keyColor?: string;
  motionBlur?: boolean;
};

export const KtSubscribeClose: React.FC<KtSubscribeCloseProps> = (p) => {
  const t = useKtTime();
  const fps = useKtFps();
  const { t0, t1, buttonSrc, arrowSrc, arrowSide = 'right', motionBlur = true } = p;
  const S = KT_SUBSCRIBE;
  const arrowT = p.arrowT ?? t0 + (S.out - S.in);
  if (t < t0 || t >= t1) return null;
  if (t < arrowT) {
    const w = Math.round(1920 * S.button.scale);
    const h = Math.round(1080 * S.button.scale);
    return (
      <KtChromaKeyVideo
        src={buttonSrc}
        sourceSec={S.in + (t - t0)}
        w={w}
        h={h}
        keyColor={p.keyColor}
        fps={fps}
        style={{ left: S.button.cx - w / 2, top: S.button.cy - h / 2 }}
      />
    );
  }
  const A = S.arrow;
  const mirror = arrowSide === 'left';
  const cx = mirror ? 1920 - A.cx : A.cx;
  const rot = mirror ? -A.rot : A.rot;
  const render = (ts: number) => {
    const e = elastic(ts - arrowT, ELASTIC.arrow.dur, ELASTIC.arrow.fade);
    return (
      <div
        style={{
          position: 'absolute',
          left: cx - A.w / 2,
          top: A.cy - A.h / 2,
          width: A.w,
          height: A.h,
          opacity: e.op,
          transform: `rotate(${rot}deg) scale(${e.s * (mirror ? -1 : 1)}, ${e.s})`,
        }}
      >
        <Img src={arrowSrc} style={{ width: '100%', height: '100%' }} />
      </div>
    );
  };
  return <ShutterBlur t={t} t0={arrowT} fps={fps} angle={180} samples={8} active={motionBlur && t - arrowT < ELASTIC.arrow.dur + 0.04} render={render} />;
};

/** kt-subscribe-close sounds: cartoon-accent for the button (file start 0.501 s before, in-point 0.467, 0.233 s: onset
 * 0.011 s before the first frame); subscribe-button (the Subscribe.mp4 audio 5.800-6.767 s placed 0.366 s after the
 * button: click, then the hit 0.26 s after full size); cartoon-accent for the arrow (file start 0.467 s before, in-point
 * 0.467: onset +0.023 s, peak on the 111 percent overshoot). */
export const ktSubscribeCloseSounds = (o: { t0: number; arrowT?: number }): KtSoundCue[] => {
  const arrowT = o.arrowT ?? o.t0 + (KT_SUBSCRIBE.out - KT_SUBSCRIBE.in);
  return [
    { id: 'cartoon-accent', at: o.t0 - 0.501, trimIn: 0.467, dur: 0.233, note: 'button' },
    { id: 'subscribe-button', at: o.t0 + 0.366 - 5.8, trimIn: 5.8, dur: 0.967, note: 'under the button animation' },
    { id: 'cartoon-accent', at: arrowT - 0.467, trimIn: 0.467, note: 'arrow' },
  ];
};

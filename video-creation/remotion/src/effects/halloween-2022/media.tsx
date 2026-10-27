// media.tsx: the compositing helpers the halloween-2022 engines share.
// - HwVideoAt: a video frame at a SOURCE second (the kinetic-text pattern: <Freeze> + OffthreadVideo).
// - HwAlphaPlate: an alpha plate stored as a FILL + KEY pair (premultiplied colour over black + the alpha as luma, plain
//   H.264): backdrop x (1 - key) + fill, done with blend modes against the layers drawn before it (the blood splats, the
//   subscribe MOGRT). No OffthreadVideo `transparent` (PNG frame extraction) needed: plain H.264 is lean and fast.
// - LumaMatte: under x (1 - M) + over x M with M = the LUMA of a matte video (the Halloween Party Promo t_1..t_8 plates are
//   white-on-black luma mattes). Chrome has no luma mask for HTML, so it is done with blend modes: two isolated groups,
//   one multiplied by the inverted matte, one by the matte, added with plus-lighter (exact for opaque layers).
// - Offset: the AE / Premiere Offset effect (the layer slides with wrap-around).
// - HwLookLayer: the panel treatments of the promo template (colour, B&W, B&W + white grid, dim, red Tint + red grid).
import React from 'react';
import { Freeze, OffthreadVideo } from 'remotion';
import { useKtFps } from '../kinetic-text/clock';
import { useUid } from '../kinetic-text/blur';
import { HW_2022 } from './types';

export const W = 1920;
export const H = 1080;

const FULL: React.CSSProperties = { position: 'absolute', left: 0, top: 0, width: W, height: H };

/** One frame of a video at `sec` seconds of the SOURCE (clamped at 0). The media offset rides `trimBefore` with the Freeze at
 * frame 0: Remotion clamps a frozen frame to the composition's last frame (useTimelinePosition), so the kinetic-text
 * pattern `<Freeze frame={sec * fps}>` shows a FROZEN picture once sec * fps passes the comp length (a plate in-point of
 * 5.5 s in a 2.7 s demo, QA 2026-10-25); a trimBefore offset is never clamped. */
export const HwVideoAt: React.FC<{ src: string; sec: number; transparent?: boolean; style?: React.CSSProperties }> = ({ src, sec, transparent, style }) => {
  const fps = useKtFps();
  return (
    <Freeze frame={0}>
      <OffthreadVideo src={src} muted transparent={transparent} trimBefore={Math.max(0, Math.floor(sec * fps + 1e-6))} style={{ ...FULL, ...style }} />
    </Freeze>
  );
};

/** An alpha plate as FILL + KEY (premultiplied colour over black + alpha as luma, both full-frame 1920x1080 videos):
 * backdrop x (1 - key) + fill. The plate's centre sits at (cx, cy), scaled by `scale` (laid out with left / top / size, NO
 * transform: a transform would open a stacking context and the blend modes would no longer see the backdrop). Must be
 * drawn inside the same stacking context as the layers it covers. */
export const HwAlphaPlate: React.FC<{ fillSrc: string; keySrc: string; sec: number; cx?: number; cy?: number; scale?: number }> = ({ fillSrc, keySrc, sec, cx = 960, cy = 540, scale = 1 }) => {
  const box: React.CSSProperties = { position: 'absolute', left: cx - (W * scale) / 2, top: cy - (H * scale) / 2, width: W * scale, height: H * scale };
  return (
    <>
      {/* backdrop x (1 - key): white everywhere, the inverted key inside the plate box, multiplied */}
      <div style={{ ...FULL, background: 'white', mixBlendMode: 'multiply', overflow: 'hidden' }}>
        <HwVideoAt src={keySrc} sec={sec} style={{ ...box, filter: 'invert(1)' }} />
      </div>
      {/* + the premultiplied fill (black adds nothing) */}
      <div style={{ ...FULL, background: 'black', mixBlendMode: 'plus-lighter', overflow: 'hidden' }}>
        <HwVideoAt src={fillSrc} sec={sec} style={box} />
      </div>
    </>
  );
};

/** under x (1 - M) + over x M. `matte` must be a full-frame opaque luma node (white = over). Nest for a layer stack. */
export const LumaMatte: React.FC<{ matte: React.ReactNode; under: React.ReactNode; over: React.ReactNode }> = ({ matte, under, over }) => (
  <div style={{ ...FULL, isolation: 'isolate', background: 'black', overflow: 'hidden' }}>
    <div style={{ ...FULL, isolation: 'isolate', mixBlendMode: 'plus-lighter' }}>
      {under}
      <div style={{ ...FULL, mixBlendMode: 'multiply', filter: 'invert(1)' }}>{matte}</div>
    </div>
    <div style={{ ...FULL, isolation: 'isolate', mixBlendMode: 'plus-lighter' }}>
      {over}
      <div style={{ ...FULL, mixBlendMode: 'multiply' }}>{matte}</div>
    </div>
  </div>
);

/** AE Offset: the full-frame layer shifted by (dx, dy) px with wrap-around (two or four copies). */
export const Offset: React.FC<{ dx: number; dy?: number; children: React.ReactNode; mirror?: boolean }> = ({ dx, dy = 0, children }) => {
  const ox = ((dx % W) + W) % W;
  const oy = ((dy % H) + H) % H;
  const xs = ox === 0 ? [0] : [ox, ox - W];
  const ys = oy === 0 ? [0] : [oy, oy - H];
  return (
    <div style={{ ...FULL, overflow: 'hidden' }}>
      {ys.flatMap((y) => xs.map((x) => (
        <div key={`${x}_${y}`} style={{ ...FULL, transform: `translate(${x}px, ${y}px)` }}>
          {children}
        </div>
      )))}
    </div>
  );
};

/** Grid lines (AE Grid effect look): 2 px lines every cellW x cellH px. */
export const GridLines: React.FC<{ cellW: number; cellH: number; line: number; color: string; ox?: number; oy?: number; opacity?: number }> = ({ cellW, cellH, line, color, ox = 0, oy = 0, opacity = 1 }) => (
  <div
    style={{
      ...FULL,
      opacity,
      backgroundImage: `linear-gradient(to right, ${color} 0 ${line}px, transparent ${line}px), linear-gradient(to bottom, ${color} 0 ${line}px, transparent ${line}px)`,
      backgroundSize: `${cellW}px ${cellH}px`,
      backgroundPosition: `${ox}px ${oy}px`,
    }}
  />
);

/** Halftone dot patch (the template's dot grids along the panel edges): `dot` px dots every `pitch` px in a rectangle. */
export const Halftone: React.FC<{ x: number; y: number; w: number; h: number; pitch?: number; dot?: number; color?: string; opacity?: number }> = ({ x, y, w, h, pitch = 46, dot = 4, color = 'rgba(255,255,255,0.55)', opacity = 1 }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      height: h,
      opacity,
      backgroundImage: `radial-gradient(circle, ${color} 0 ${dot}px, transparent ${dot + 0.8}px)`,
      backgroundSize: `${pitch}px ${pitch}px`,
    }}
  />
);

/** AE Tint as an SVG colour matrix: luminance -> black..white mapped to tintBlack..tintWhite (exact Tint math). */
const TintFilter: React.FC<{ id: string; black: [number, number, number]; white: [number, number, number] }> = ({ id, black, white }) => {
  const row = (c: number) => {
    const k = white[c] - black[c];
    return `${(0.2126 * k).toFixed(4)} ${(0.7152 * k).toFixed(4)} ${(0.0722 * k).toFixed(4)} 0 ${black[c].toFixed(4)}`;
  };
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        <filter id={id} colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values={`${row(0)}  ${row(1)}  ${row(2)}  0 0 0 1 0`} />
        </filter>
      </defs>
    </svg>
  );
};

export type HwLook = 'color' | 'bw' | 'bw-grid' | 'dim' | 'red';

/** One panel treatment of the scene node (the promo template's panels are versions of the same scene comp). */
export const HwLookLayer: React.FC<{ look: HwLook; children: React.ReactNode; vignette?: number; blur?: number; saturate?: number }> = ({ look, children, vignette = 0, blur = 0, saturate = 1 }) => {
  const id = useUid('hwtint');
  const f: string[] = [];
  if (blur > 0.3) f.push(`blur(${blur}px)`);
  if (look === 'color' && saturate < 0.999) f.push(`saturate(${Math.max(0, saturate)})`);
  if (look === 'bw' || look === 'bw-grid') f.push('grayscale(1) contrast(1.12)');
  if (look === 'dim') f.push('grayscale(1) brightness(0.42)');
  if (look === 'red') f.push(`url(#${id})`);
  const G = look === 'red' ? HW_2022.redGrid : HW_2022.whiteGrid;
  return (
    <div style={{ ...FULL, overflow: 'hidden', background: 'black' }}>
      {look === 'red' && <TintFilter id={id} black={HW_2022.tintBlack} white={HW_2022.tintWhite} />}
      <div style={{ ...FULL, filter: f.length ? f.join(' ') : undefined }}>{children}</div>
      {(look === 'red' || look === 'bw-grid') && <GridLines cellW={G.cellW} cellH={G.cellH} line={G.line} color={G.color} ox={look === 'red' ? 190 : 0} oy={look === 'red' ? 100 : 105} />}
      {vignette > 0 && (
        <div style={{ ...FULL, background: `radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,${vignette}) 100%)` }} />
      )}
    </div>
  );
};

/** Keep one RGB channel (for the RGB-split glitch); plates are summed with plus-lighter in an isolated black group. */
export const ChannelPlate: React.FC<{ keep: 'R' | 'G' | 'B'; dx: number; children: React.ReactNode }> = ({ keep, dx, children }) => {
  const id = useUid('hwch');
  const m = keep === 'R' ? '1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0' : keep === 'G' ? '0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0' : '0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0';
  return (
    <div style={{ ...FULL, mixBlendMode: 'plus-lighter', transform: `translateX(${dx}px)` }}>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id={id} colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values={m} />
          </filter>
        </defs>
      </svg>
      <div style={{ ...FULL, filter: `url(#${id})` }}>{children}</div>
    </div>
  );
};

// HwZoomSlideshow.tsx: hw-zoom-slideshow (library.json devices.hw-zoom-slideshow), the Bear Markets chapter-2 opener
// 19.767-23.833: an After Effects render of the Envato "Dynamic Slideshow" template (folder "Zooming Dynamic SlideShow"),
// 4 photos, played at 82.78 percent speed (3.367 s of render over 4.067 s), Mike's narration running under it.
// Per photo (~0.87 s of render = ~1.05 s on the timeline): a 2-6 frame entry (a kaleidoscope / displacement GLITCH, a
// radial WHIP, a two-pane SPLIT offset, or a screened LIGHT-LEAK flash), then an exponential ease-out move that alternates
// direction (zoom in with a roll settle, zoom in behind a long slide-left, zoom OUT from ~3.4x, zoom in with a slow drift
// right), a wide-tracked Lato-Heavy title that closes up (or slowly opens), and a horizontal smear out; the last photo
// ends on an RGB-split glitch. SILENT in the source (music only).
// The motion numbers were MEASURED on the AE render by feature tracking (the template's keyframes live in the binary
// .aep): per-frame scale / rotation / translation of every frame, render time 30 fps (track_dyn in the study):
//   shot 1 zoom x2.2 overall (x1.54 measured after its glitch frames, per-frame ratio 1.055 -> 1.003, tau ~0.23 s) with a
//          roll settling from ~24 deg (-1.6 -> -0.15 deg per frame, tau ~0.31 s);
//   shot 2 zoom x1.57 (per-frame 1.19 -> 1.00, tau ~0.15 s) under a 1767 px slide to the left (-443 -> -4 px per frame);
//   shot 3 zoom OUT ~3.4x -> 1x (per-frame 0.78 -> 0.99, tau ~0.16 s) behind the split-offset entry;
//   shot 4 zoom x2.1 (per-frame 1.20 -> 1.00, tau ~0.17 s) with a 289 px drift right (+36 -> +2 px per frame).
// Uncovered edges are filled by a 3x3 MIRROR tile of the photo (the template's Motion Tile with mirror edges, which is also
// the kaleidoscope of the glitch entry), so a roll or a slide never shows black. Times in this file are RENDER seconds
// (u = timeline seconds x speed): `speed` 0.8278 reproduces the Bear Markets timing, 1 = the template's own pace.
import React from 'react';
import { Img } from 'remotion';
import { DirBlur } from '../kinetic-text/blur';
import { useKtFps, useKtTime } from '../kinetic-text/clock';
import { ChannelPlate, HwVideoAt, Offset } from './media';
import { expoOut, hash01 } from './motion';
import { hwPaired } from './sfx';
import { HW_2022, HwSoundCue } from './types';

export type HwSlideMove = 'in-roll' | 'in-slide' | 'out' | 'in-drift';
export type HwSlideEntry = 'glitch' | 'whip' | 'split' | 'leak';
export type HwSlideTracking = 'collapse' | 'collapse-wide' | 'expand' | 'none';

type CycleRow = { len: number; move: HwSlideMove; entry: HwSlideEntry; titleY: number; titleColor: string; tracking: HwSlideTracking };

export const HW_SLIDESHOW = {
  /** Bear Markets played the render at 82.78 percent */
  speed: 0.8278,
  /** the four measured shots (render seconds), cycled for N photos */
  cycle: [
    { len: 0.933, move: 'in-roll', entry: 'glitch', titleY: 902, titleColor: HW_2022.slideWhite, tracking: 'collapse' },
    { len: 0.867, move: 'in-slide', entry: 'whip', titleY: 540, titleColor: HW_2022.slideRed, tracking: 'none' },
    { len: 0.667, move: 'out', entry: 'split', titleY: 540, titleColor: HW_2022.slideRed, tracking: 'collapse-wide' },
    { len: 0.833, move: 'in-drift', entry: 'leak', titleY: 540, titleColor: HW_2022.slideWhite, tracking: 'expand' },
  ] as CycleRow[],
  moves: {
    'in-roll': { zoom: 2.2, tau: 0.23, roll: 24, tauRoll: 0.31 },
    'in-slide': { zoom: 1.57, tauZoom: 0.15, dx: 1767, tauX: 0.16 },
    out: { from: 3.4, tau: 0.16, T: 0.5 },
    'in-drift': { zoom: 2.1, tau: 0.17, dx: 289, tauX: 0.25 },
  },
  entryDur: { glitch: 0.2, whip: 0.2, split: 0.27, leak: 0.3 } as Record<HwSlideEntry, number>,
  exitDur: 0.1,
  glitchOut: 0.067,
  /** Lato caps measured ~138 px on the render (cap height 0.7165 em) */
  titleSize: 192,
  titleIn: 0.05,
  titleFade: 0.08,
};

export type HwSlide = {
  /** a photo (staticFile path); the AE template is a stills slideshow */
  src: string;
  title?: string;
  titleColor?: string;
  move?: HwSlideMove;
  entry?: HwSlideEntry;
  tracking?: HwSlideTracking;
  titleY?: number;
  /** render seconds of this photo (default: the cycle position's measured length) */
  len?: number;
  /** zoom centre in the frame, px (default the centre) */
  focusX?: number;
  focusY?: number;
  /** which light-leak plate a 'leak' entry screens (index into leakSrcs; default 0 = leak-1, then the next per cycle) */
  leak?: number;
};

export type HwZoomSlideshowProps = {
  /** first frame of the montage, seconds on the comp clock */
  t0: number;
  slides: HwSlide[];
  /** staticFile paths of textures/leak-1..6.mp4 (screened on a 'leak' entry) */
  leakSrcs?: string[];
  speed?: number;
  font?: string;
  fontWeight?: number;
  titleSize?: number;
  motionBlur?: boolean;
};

/** The montage's timeline length in seconds (render length / speed), for the comp to size the window. */
export const hwZoomSlideshowDuration = (slides: HwSlide[], speed = HW_SLIDESHOW.speed) => {
  const C = HW_SLIDESHOW.cycle;
  const render = slides.reduce((a, s, i) => a + (s.len ?? C[i % C.length].len), 0) + HW_SLIDESHOW.glitchOut;
  return render / speed;
};

const moveAt = (m: HwSlideMove, u: number, len: number) => {
  const M = HW_SLIDESHOW.moves;
  if (m === 'in-roll') {
    const E = expoOut(u, M['in-roll'].tau, len);
    const Er = expoOut(u, M['in-roll'].tauRoll, len);
    return { s: Math.exp(Math.log(M['in-roll'].zoom) * E), rot: M['in-roll'].roll * (1 - Er), dx: 0 };
  }
  if (m === 'in-slide') {
    const Ez = expoOut(u, M['in-slide'].tauZoom, len);
    const Ex = expoOut(u, M['in-slide'].tauX, len);
    return { s: Math.exp(Math.log(M['in-slide'].zoom) * Ez), rot: 0, dx: M['in-slide'].dx * (1 - Ex) };
  }
  if (m === 'out') {
    const E = expoOut(u, M.out.tau, M.out.T);
    return { s: Math.exp(Math.log(M.out.from) * (1 - E)), rot: 0, dx: 0 };
  }
  const Ez = expoOut(u, M['in-drift'].tau, len);
  const Ex = expoOut(u, M['in-drift'].tauX, len);
  return { s: Math.exp(Math.log(M['in-drift'].zoom) * Ez), rot: 0, dx: -M['in-drift'].dx * (1 - Ex) };
};

const trackingAt = (mode: HwSlideTracking, u: number, len: number) => {
  if (mode === 'collapse') return 0.06 + 0.49 * (1 - expoOut(u, 0.08, 0.35));
  if (mode === 'collapse-wide') return 0.12 + 1.28 * (1 - expoOut(u, 0.1, 0.45));
  if (mode === 'expand') return 0.06 + 0.18 * Math.min(1, Math.max(0, u / len));
  return 0.04;
};

/** The photo cover-fitted to the frame and 3x3 mirror-tiled (Motion Tile with mirror edges). */
const MirrorGrid: React.FC<{ src: string }> = ({ src }) => (
  <>
    {[-1, 0, 1].flatMap((gy) =>
      [-1, 0, 1].map((gx) => (
        <div
          key={`${gx}_${gy}`}
          style={{ position: 'absolute', left: gx * 1920, top: gy * 1080, width: 1920, height: 1080, transform: `scale(${gx === 0 ? 1 : -1}, ${gy === 0 ? 1 : -1})` }}
        >
          <Img src={src} style={{ width: 1920, height: 1080, objectFit: 'cover' }} />
        </div>
      )),
    )}
  </>
);

type Shot = { slide: HwSlide; row: CycleRow; start: number; len: number; index: number };

export const HwZoomSlideshow: React.FC<HwZoomSlideshowProps> = (p) => {
  const t = useKtTime();
  const fps = useKtFps();
  const speed = p.speed ?? HW_SLIDESHOW.speed;
  const C = HW_SLIDESHOW.cycle;
  const shots: Shot[] = [];
  let acc = 0;
  p.slides.forEach((slide, i) => {
    const row = C[i % C.length];
    const len = slide.len ?? row.len;
    shots.push({ slide, row, start: acc, len, index: i });
    acc += len;
  });
  const total = acc;
  const uT = (t - p.t0) * speed; // render seconds since the montage start
  if (uT < 0 || uT >= total + HW_SLIDESHOW.glitchOut || shots.length === 0) return null;
  const glitchingOut = uT >= total;
  const shot = glitchingOut ? shots[shots.length - 1] : shots.find((s) => uT >= s.start && uT < s.start + s.len) ?? shots[shots.length - 1];
  const u = glitchingOut ? shot.len : uT - shot.start;
  const sl = shot.slide;
  const move = sl.move ?? shot.row.move;
  const entry = sl.entry ?? shot.row.entry;
  const tracking = sl.tracking ?? shot.row.tracking;
  const isLast = shot.index === shots.length - 1;
  const fx = sl.focusX ?? 960;
  const fy = sl.focusY ?? 540;
  const mb = p.motionBlur !== false;
  const hf = speed / fps; // one comp frame in render seconds

  // --- the photo transform (+ its per-frame velocity for the motion blur) ---
  const st = moveAt(move, u, shot.len);
  const prev = moveAt(move, Math.max(0, u - hf), shot.len);
  const next = moveAt(move, Math.min(shot.len, u + hf), shot.len);
  const vx = (next.dx - prev.dx) / 2; // px per comp frame
  const vlogs = (Math.log(next.s) - Math.log(prev.s)) / 2;

  // --- entry / exit state ---
  const eDur = HW_SLIDESHOW.entryDur[entry];
  const eK = u < eDur ? 1 - u / eDur : 0; // 1 -> 0 across the entry
  const xDur = HW_SLIDESHOW.exitDur;
  const xK = !isLast && u > shot.len - xDur ? (u - (shot.len - xDur)) / xDur : 0; // 0 -> 1 across the exit
  const exitDx = -150 * Math.pow(xK, 1.5);
  const frameIdx = Math.round((t - p.t0) * fps);

  // kaleidoscope (glitch entry, first 2 frames): the mirror grid seen at 1/3 then 1/2 scale
  const kaleido = entry === 'glitch' && u < 0.067 ? (u < 0.034 ? 1 / 3 : 1 / 2) : 0;
  const gridTf = (s: number, rot: number, dx: number) =>
    kaleido ? `scale(${kaleido})` : `translate(${dx + exitDx}px, 0px) rotate(${rot}deg) scale(${s})`;

  // radial zoom streak: equal-weight stack of scale samples across the 360-degree shutter while the zoom is fast
  const radial = mb && !kaleido && Math.abs(vlogs) > 0.02;
  const nS = radial ? 6 : 1;
  const samples = Array.from({ length: nS }, (_, i) => (nS === 1 ? u : Math.max(0, u + (i / (nS - 1) - 0.5) * 2 * hf)));
  const origin = `${fx}px ${fy}px`;
  const photo = (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', isolation: 'isolate', background: 'black' }}>
      {samples.map((us, i) => {
        const m = nS === 1 ? st : moveAt(move, Math.min(shot.len, us), shot.len);
        return (
          <div key={i} style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, opacity: 1 / (i + 1), transform: gridTf(m.s, m.rot, m.dx), transformOrigin: origin }}>
            <MirrorGrid src={sl.src} />
          </div>
        );
      })}
    </div>
  );

  // horizontal streak: the slide velocity + the exit smear
  const sx = mb ? Math.min(120, Math.abs(vx) / 3 + 70 * Math.pow(xK, 1.5)) : 0;

  // --- title ---
  let title: React.ReactNode = null;
  if (sl.title) {
    const ls = trackingAt(tracking, u, shot.len);
    const tin = Math.min(1, Math.max(0, (u - HW_SLIDESHOW.titleIn) / HW_SLIDESHOW.titleFade));
    const opacity = entry === 'split' || entry === 'leak' ? 1 : tin;
    let tf = '';
    if (move === 'in-roll') tf = `rotate(${st.rot}deg)`;
    if (move === 'in-slide') tf = `translateX(${st.dx}px) scale(${0.75 + 0.25 * expoOut(u, 0.15, shot.len)})`;
    if (move === 'in-drift') tf = `scale(${0.85 + 0.15 * expoOut(u, 0.1, 0.3)})`;
    const size = p.titleSize ?? HW_SLIDESHOW.titleSize;
    title = (
      <div
        style={{
          position: 'absolute',
          left: 960 + exitDx,
          top: sl.titleY ?? shot.row.titleY,
          width: 'max-content',
          transform: `translate(-50%, -50%) ${tf}`,
          opacity,
          fontFamily: p.font ?? HW_2022.slideFont,
          fontWeight: p.fontWeight ?? HW_2022.slideWeight,
          fontSize: size,
          lineHeight: `${size}px`,
          letterSpacing: `${ls}em`,
          paddingLeft: `${ls}em`,
          color: sl.titleColor ?? shot.row.titleColor,
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}
      >
        {sl.title}
      </div>
    );
  }

  let layer: React.ReactNode = (
    <div style={{ position: 'absolute', inset: 0 }}>
      {photo}
      {title}
    </div>
  );

  // SPLIT entry: four quadrant panes offset horizontally, settling (the "behind a two-pane split-offset entry")
  if (entry === 'split' && eK > 0) {
    const e = Math.pow(eK, 2);
    const q = [
      { x: 0, y: 0, w: 960, h: 540, ox: 300 * e },
      { x: 960, y: 0, w: 960, h: 540, ox: 190 * e },
      { x: 0, y: 540, w: 960, h: 540, ox: -190 * e },
      { x: 960, y: 540, w: 960, h: 540, ox: -300 * e },
    ];
    const inner = layer;
    layer = (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {q.map((r, i) => (
          <div key={i} style={{ position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, overflow: 'hidden' }}>
            {/* Offset with wrap-around (the AE Offset effect): a pane never shows black */}
            <div style={{ position: 'absolute', left: -r.x, top: -r.y, width: 1920, height: 1080 }}>
              <Offset dx={r.ox}>{inner}</Offset>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // GLITCH entry (after the kaleidoscope frames): displaced horizontal blocks, decaying
  if (entry === 'glitch' && u >= 0.067 && eK > 0) {
    const inner = layer;
    const bands = Array.from({ length: 7 }, (_, i) => {
      const y = Math.floor(hash01(frameIdx * 13 + i * 7) * 1000);
      const h = 40 + Math.floor(hash01(frameIdx * 31 + i * 3) * 160);
      const ox = (hash01(frameIdx * 7 + i * 11) * 2 - 1) * 260 * eK;
      return { y, h, ox };
    });
    layer = (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {inner}
        {bands.map((b, i) => (
          <div key={i} style={{ position: 'absolute', left: 0, top: b.y, width: 1920, height: b.h, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: b.ox, top: -b.y, width: 1920, height: 1080 }}>{inner}</div>
          </div>
        ))}
      </div>
    );
  }

  // GLITCH-OUT after the last photo: horizontal slices offset + an RGB split
  if (glitchingOut) {
    const inner = layer;
    const n = 9;
    layer = (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', isolation: 'isolate', background: 'black' }}>
        {Array.from({ length: n }, (_, i) => {
          const y = Math.round((i * 1080) / n);
          const h = Math.round(((i + 1) * 1080) / n) - y;
          const ox = (hash01(frameIdx * 17 + i * 5) * 2 - 1) * 420;
          const blank = hash01(frameIdx * 3 + i * 19) < 0.2;
          return (
            <div key={i} style={{ position: 'absolute', left: 0, top: y, width: 1920, height: h, overflow: 'hidden' }}>
              {!blank && (
                <div style={{ position: 'absolute', left: ox, top: -y, width: 1920, height: 1080, isolation: 'isolate', background: 'black' }}>
                  <ChannelPlate keep="R" dx={18}>{inner}</ChannelPlate>
                  <ChannelPlate keep="G" dx={0}>{inner}</ChannelPlate>
                  <ChannelPlate keep="B" dx={-18}>{inner}</ChannelPlate>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // white wash: the glitch and whip entries open on a near-white frame
  const white = entry === 'glitch' ? (u < 0.034 ? 0.75 : u < 0.1 ? 0.35 : 0) : entry === 'whip' ? (u < 0.034 ? 0.45 : 0) : entry === 'leak' ? Math.max(0, 0.6 * (1 - u / 0.1)) : 0;
  // default plate: leak-1 (the warm bokeh flash) for the first leak entry, the next plate for each later one
  const leakSrc = entry === 'leak' && p.leakSrcs && p.leakSrcs.length ? p.leakSrcs[(sl.leak ?? Math.floor(shot.index / 4)) % p.leakSrcs.length] : undefined;
  const leakOp = entry === 'leak' ? Math.max(0, 1 - u / HW_SLIDESHOW.entryDur.leak) : 0;

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: 'black' }}>
      <DirBlur sx={glitchingOut ? 0 : sx} sy={0}>
        {layer}
      </DirBlur>
      {leakSrc && leakOp > 0.01 && (
        <div style={{ position: 'absolute', inset: 0, mixBlendMode: 'screen', opacity: leakOp }}>
          <HwVideoAt src={leakSrc} sec={u * 0.9} />
        </div>
      )}
      {white > 0.01 && <div style={{ position: 'absolute', inset: 0, background: 'white', opacity: white }} />}
    </div>
  );
};

/** hw-zoom-slideshow sounds: SILENT in the source (the music restarted under it at the chapter change). `pair` = a
 * screenplay-paired catalog sound, attack ON each photo's entry. */
export const hwZoomSlideshowSounds = (o: { t0: number; slides: HwSlide[]; speed?: number; pair?: string }): HwSoundCue[] => {
  const speed = o.speed ?? HW_SLIDESHOW.speed;
  const C = HW_SLIDESHOW.cycle;
  const starts: number[] = [];
  let acc = 0;
  o.slides.forEach((s, i) => {
    starts.push(o.t0 + acc / speed);
    acc += s.len ?? C[i % C.length].len;
  });
  return hwPaired(o.pair, starts, 'screenplay-paired: attack ON each photo entry');
};

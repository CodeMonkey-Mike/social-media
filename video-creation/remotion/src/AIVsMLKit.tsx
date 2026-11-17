// AIVsMLKit.tsx: the AI vs ML (longform-edited, 2026-11-11) project-local kinetic-text devices that have NO shared engine
// yet, each built to its row in video-creation/assets/effects/library.json (theme kinetic-text-2023), plus the small comp
// helpers (absolute clock, camera wobble, push slide, mirror tiles). Shared engine parts are IMPORTED from
// ./effects/kinetic-text (motion curves, text block, shutter blur), never copied from another project's comp.
import React from 'react';
import { AbsoluteFill, Easing, Freeze, Img, OffthreadVideo, interpolate, staticFile } from 'remotion';
import {
  At,
  CL,
  DirBlur,
  ELASTIC,
  KT_2023,
  KtLine,
  KtTextBlock,
  POP110_DUR,
  ShutterBlur,
  easeInfluence325,
  elastic,
  hover,
  parseMarkup,
  pop110,
  shutterTravel,
  streakSigma,
  useKtFps,
  useKtTime,
} from './effects/kinetic-text';

export const W = 1920;
export const H = 1080;
export const FULL: React.CSSProperties = { position: 'absolute', left: 0, top: 0, width: W, height: H };

// ---------------------------------------------------------------------------------------------------------------------
// THE ABSOLUTE CLOCK (comp-build 6a: every node an engine re-mounts reads ONE absolute clock, never its local frame)
// ---------------------------------------------------------------------------------------------------------------------
export const AbsFrame = React.createContext(0);
export const useAbsFrame = () => React.useContext(AbsFrame);

// ---------------------------------------------------------------------------------------------------------------------
// PALETTE (the video's cards: AI ENGINEER = yellow, ML ENGINEER = green; _state-cues.md)
// ---------------------------------------------------------------------------------------------------------------------
export const AI_YELLOW = KT_2023.yellow; // #FCFE40
export const ML_GREEN = '#1EFF06';
export const MONT = "'Montserrat', sans-serif";

// ---------------------------------------------------------------------------------------------------------------------
// kt-camera-wobble (library row): a looping 13-key path, period 8.600 s, uniform 105 percent, optional +-0.5 deg rock
// ---------------------------------------------------------------------------------------------------------------------
const WOB_T = [0, 0.667, 1.317, 1.883, 2.55, 3.267, 3.85, 4.333, 5.083, 5.633, 6.383, 7.1, 7.833];
const WOB_X = [3.5, -1.5, -32, -25.5, -10.5, 3, -4.5, -21.5, -16, -12, -6.5, -28, -20];
const WOB_Y = [-8.5, 8.5, -6.5, 9.5, -2.5, 7, -7, 2, -16.5, -2, -14, -9, 4];
const WOB_P = 8.6;
const catmull = (p0: number, p1: number, p2: number, p3: number, u: number) =>
  0.5 * (2 * p1 + (-p0 + p2) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u * u + (-p0 + 3 * p1 - 3 * p2 + p3) * u * u * u);

/** wobble pose dt seconds after the element's first frame (the path starts from its first key there). */
export const wobble = (dt: number, rock = false) => {
  const n = WOB_T.length;
  const u = ((dt % WOB_P) + WOB_P) % WOB_P;
  let i = n - 1;
  for (let k = 0; k < n; k++) if (WOB_T[k] <= u) i = k;
  const t0 = WOB_T[i];
  const t1 = i + 1 < n ? WOB_T[i + 1] : WOB_P;
  const f = (u - t0) / (t1 - t0);
  const at = (arr: number[], k: number) => arr[((k % n) + n) % n];
  const x = catmull(at(WOB_X, i - 1), at(WOB_X, i), at(WOB_X, i + 1), at(WOB_X, i + 2), f);
  const y = catmull(at(WOB_Y, i - 1), at(WOB_Y, i), at(WOB_Y, i + 1), at(WOB_Y, i + 2), f);
  let rot = 0;
  if (rock) {
    const r = ((dt % 3.0) + 3.0) % 3.0;
    rot = interpolate(r, [0, 0.683, 1.45, 2.2, 3.0], [0, 0.5, 0, -0.5, 0], { ...CL, easing: Easing.inOut(Easing.sin) });
  }
  return { x, y, rot, s: 1.05 };
};
export const wobbleCss = (dt: number, rock = false, extraScale = 1) => {
  const w = wobble(dt, rock);
  return `translate(${w.x}px, ${w.y}px) rotate(${w.rot}deg) scale(${w.s * extraScale})`;
};

// ---------------------------------------------------------------------------------------------------------------------
// kt-push-slide (library row): a 0.100 s Transform slide, fast start / soft land, 360-degree motion blur
// ---------------------------------------------------------------------------------------------------------------------
export const PUSH_EASE = Easing.bezier(0.33, 0.66, 0, 1);
/** x offset (px) of a pushing picture: from `from` to `to` px over dur seconds starting at t0 */
export const pushX = (t: number, t0: number, from: number, to: number, dur: number) =>
  from + (to - from) * PUSH_EASE(interpolate(t, [t0, t0 + dur], [0, 1], CL));
/** the push travel presets (frame widths): in from the LEFT x -0.347 -> 0.5 (0.847 W); paper in from the RIGHT
 * x 1.375 -> 0.5 (0.875 W, 2 frames); paper out to the LEFT 0.5 -> -0.528 (1.028 W, 0.100 s) */
export const PUSH = {
  inLeft: { from: -0.847 * W, to: 0, dur: 0.1 },
  inRight: { from: 0.875 * W, to: 0, dur: 0.067 },
  outLeft: { from: 0, to: -1.028 * W, dur: 0.1 },
};
export const PushSlide: React.FC<{ t0: number; from: number; to: number; dur: number; children: React.ReactNode }> = ({ t0, from, to, dur, children }) => {
  const t = useKtTime();
  const fps = useKtFps();
  const pos = (ts: number) => pushX(ts, t0, from, to, dur);
  const x = pos(t);
  const moving = t >= t0 && t < t0 + dur + 1 / fps;
  const sigma = moving ? streakSigma(shutterTravel(pos, t, t0, 360, fps)) : 0;
  return (
    <DirBlur sx={Math.min(sigma, 180)} sy={0}>
      <div style={{ ...FULL, transform: `translateX(${x}px)` }}>{children}</div>
    </DirBlur>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// MIRROR TILES: the shot tiled with mirrored neighbours (Premiere's four Mirror effects) so a scaled / rotated / shaken
// frame never shows an edge (kt-grid-zoom-in, kt-spin-cut, kt-shake-cut edge_fill)
// ---------------------------------------------------------------------------------------------------------------------
export const MirrorTiles: React.FC<{ rx: number; ry: number; render: () => React.ReactNode }> = ({ rx, ry, render }) => {
  const tiles: React.ReactNode[] = [];
  for (let j = -ry; j <= ry; j++)
    for (let i = -rx; i <= rx; i++) {
      const fx = Math.abs(i) % 2 === 1 ? -1 : 1;
      const fy = Math.abs(j) % 2 === 1 ? -1 : 1;
      tiles.push(
        <div key={`${i}_${j}`} style={{ ...FULL, transform: `translate(${i * W}px, ${j * H}px) scale(${fx}, ${fy})` }}>
          {render()}
        </div>,
      );
    }
  return <div style={{ ...FULL }}>{tiles}</div>;
};

// ---------------------------------------------------------------------------------------------------------------------
// kt-grid-zoom-in (library row): the first shot grows out of a mirrored 3x3 grid, net scale 33.4 -> 100 percent and skew
// 10 -> 0 degrees over 0.483 s; it leaps off and lands soft (out-speed 1250 / influence 0.01 -> in-speed 5.8 / influence 100)
// ---------------------------------------------------------------------------------------------------------------------
export const GRID_OPEN = { dur: 0.483, s0: 0.334, skew0: 10 };
// out-handle influence 0.01 percent = negligible, in-handle influence 100 percent: bezier(0, 0, 0, 1) leaps off (infinite
// start slope) and lands soft; the grid reads for ~3 frames
const gridEase = Easing.bezier(0, 0, 0, 1);
export const GridZoomIn: React.FC<{ t: number; render: () => React.ReactNode }> = ({ t, render }) => {
  const u = gridEase(interpolate(t, [0, GRID_OPEN.dur], [0, 1], CL));
  const s = GRID_OPEN.s0 + (1 - GRID_OPEN.s0) * u;
  const skew = GRID_OPEN.skew0 * (1 - u);
  // tiles needed to cover the frame at this scale + skew
  const rx = Math.min(3, Math.ceil((0.5 / s + Math.tan((skew * Math.PI) / 180) * (H / W) * (0.5 / s)) - 0.5) + 1);
  const ry = Math.min(2, Math.ceil(0.5 / s - 0.5) + 0);
  return (
    <div style={{ ...FULL, overflow: 'hidden', background: 'black' }}>
      <div style={{ ...FULL, transformOrigin: '50% 50%', transform: `scale(${s}) skewX(${skew}deg)` }}>
        <MirrorTiles rx={Math.max(1, rx)} ry={Math.max(1, ry)} render={render} />
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// kt-shake-cut (library row): the incoming face lands with a decaying jolt over 0.267 s, a key every 0.027 s, mirror-filled,
// directional blur along the jolt (length 15 -> 3 at 4K = 7.5 -> 1.5 px at 1080)
// ---------------------------------------------------------------------------------------------------------------------
const SHAKE_T = [0, 0.027, 0.053, 0.08, 0.107, 0.133, 0.16, 0.187, 0.213, 0.24, 0.267];
const SHAKE_X = [0.37, 0.51, 0.457, 0.526, 0.493, 0.51, 0.501, 0.498, 0.501, 0.5, 0.5];
const SHAKE_Y = [0.736, 0.575, 0.429, 0.546, 0.525, 0.488, 0.506, 0.497, 0.501, 0.5, 0.5];
export const SHAKE_DUR = 0.267;
const shakePos = (dt: number) => ({
  x: (interpolate(dt, SHAKE_T, SHAKE_X, CL) - 0.5) * W,
  y: (interpolate(dt, SHAKE_T, SHAKE_Y, CL) - 0.5) * H,
});
export const ShakeCut: React.FC<{ t0: number; render: () => React.ReactNode }> = ({ t0, render }) => {
  const t = useKtTime();
  const dt = t - t0;
  const p = shakePos(dt);
  const q = shakePos(Math.max(0, dt - 1 / 60));
  const len = interpolate(dt, [0, SHAKE_DUR], [7.5, 1.5], CL);
  const vx = p.x - q.x;
  const vy = p.y - q.y;
  const vn = Math.hypot(vx, vy) || 1;
  return (
    <div style={{ ...FULL, overflow: 'hidden', background: 'black' }}>
      <DirBlur sx={(len * Math.abs(vx)) / vn / 2} sy={(len * Math.abs(vy)) / vn / 2}>
        <div style={{ ...FULL, transform: `translate(${p.x}px, ${p.y}px)` }}>
          <MirrorTiles rx={1} ry={1} render={render} />
        </div>
      </DirBlur>
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// kt-spin-cut (library row, spin right): rotation 0 -> 180 -> 360 keyed at -0.100 / +0.033 / +0.167 s around the cut
// (ease, peak ~2900 deg/s at the middle key), mirror-tiled edge fill, 260-degree shutter (the vortex). The sources are
// pre-extracted CUT FRAME stills (comp-build 6a cost trap: a mirrored + shuttered spin over live video = dozens of fetches)
// ---------------------------------------------------------------------------------------------------------------------
export const SPIN_CUT = { pre: 0.1, post: 0.167, shutter: 260, samples: 6 };
const spinEase = Easing.inOut(Easing.quad);
export const spinAngle = (ts: number, cut: number) =>
  360 * spinEase(interpolate(ts, [cut - SPIN_CUT.pre, cut + SPIN_CUT.post], [0, 1], CL));
export const SpinCut: React.FC<{ cut: number; cutFrame: number; outStills: string[]; inStills: string[] }> = ({ cut, cutFrame, outStills, inStills }) => {
  const f = useAbsFrame();
  const fps = useKtFps();
  const t = f / fps;
  const k = f - cutFrame;
  const src = k < 0 ? outStills[Math.max(0, outStills.length + k)] : inStills[Math.min(inStills.length - 1, k)];
  const span = SPIN_CUT.shutter / 360 / fps;
  const n = SPIN_CUT.samples;
  const times = Array.from({ length: n }, (_, i) => t + (i / (n - 1) - 0.5) * span);
  return (
    <div style={{ ...FULL, overflow: 'hidden', isolation: 'isolate', background: 'black' }}>
      {times.map((ts, i) => (
        <div key={i} style={{ ...FULL, opacity: 1 / (i + 1), background: 'black', transformOrigin: '50% 50%', transform: `rotate(${spinAngle(ts, cut)}deg)` }}>
          <MirrorTiles rx={1} ry={1} render={() => <Img src={staticFile(src)} style={{ ...FULL, objectFit: 'cover' }} />} />
        </div>
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// kt-caption-highlight (library row): the running caption line. One line centred x 960, block y 82 to 89 percent, caps
// 52 px (Montserrat ExtraBold Italic -> 74 px font), white + key words in the accent, dark drop shadow, HARD CUT on the
// first word of each phrase, held until the next phrase, never animated out. Optional sparkle anchor on one word.
// ---------------------------------------------------------------------------------------------------------------------
export type CaptionPhrase = { t: number; text: KtLine; spark?: { word: string; t: number } };
export const CAPTION = { y: 923, fontSize: 74, maxW: 1556, liftY: 778 };

/** the sparkle burst (kt-keyword-sparkle row): a white 4-point star with a soft white glow, total 0.70 s */
const SPARK_T = [0, 0.07, 0.17, 0.24, 0.31, 0.38, 0.45, 0.6, 0.7];
const SPARK_W = [0, 50, 40, 100, 114, 127, 107, 30, 0];
const SPARK_H = [0, 100, 90, 128, 150, 162, 140, 40, 0];
const SPARK_THIN = [0.5, 0.45, 0.32, 0.26, 0.22, 0.17, 0.14, 0.12, 0.1];
export const SPARK_DUR = 0.7;
export const SparkleBurst: React.FC<{ dt: number }> = ({ dt }) => {
  if (dt < 0 || dt >= SPARK_DUR) return null;
  const w = interpolate(dt, SPARK_T, SPARK_W, CL);
  const h = interpolate(dt, SPARK_T, SPARK_H, CL);
  const thin = interpolate(dt, SPARK_T, SPARK_THIN, CL);
  if (w < 1 || h < 1) return null;
  const a = w / 2;
  const b = h / 2;
  const c = Math.min(a, b) * thin;
  const d = `M 0 ${-b} L ${c} ${-c} L ${a} 0 L ${c} ${c} L 0 ${b} L ${-c} ${c} L ${-a} 0 L ${-c} ${-c} Z`;
  return (
    <svg width={260} height={260} viewBox="-130 -130 260 260" style={{ position: 'absolute', left: -130, top: -130, overflow: 'visible', pointerEvents: 'none' }}>
      <path d={d} fill="#FFFFFF" style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.9)) drop-shadow(0 0 18px rgba(255,255,255,0.35))' }} />
    </svg>
  );
};

/** One text line with *key* markup, rendered as spans; the word named by `spark` carries the burst at its top-right. */
const MarkedLine: React.FC<{ line: KtLine; color: string; keyColor: string; spark?: { word: string; dt: number } }> = ({ line, color, keyColor, spark }) => {
  const parts = parseMarkup(line);
  return (
    <>
      {parts.map((p, i) => {
        if (!spark || !p.text.includes(spark.word)) return (
          <span key={i} style={{ color: p.key ? keyColor : color }}>
            {p.text}
          </span>
        );
        const at = p.text.indexOf(spark.word);
        const before = p.text.slice(0, at);
        const after = p.text.slice(at + spark.word.length);
        return (
          <span key={i} style={{ color: p.key ? keyColor : color }}>
            {before}
            <span style={{ position: 'relative', display: 'inline-block' }}>
              {spark.word}
              <span style={{ position: 'absolute', right: -6, top: '22%', width: 0, height: 0 }}>
                <SparkleBurst dt={spark.dt} />
              </span>
            </span>
            {after}
          </span>
        );
      })}
    </>
  );
};

const capStyle = (fontSize: number): React.CSSProperties => ({
  fontFamily: MONT,
  fontWeight: 800,
  fontStyle: 'italic',
  fontSize,
  lineHeight: `${Math.round(fontSize * 1.08)}px`,
  textTransform: 'uppercase',
  letterSpacing: '0.005em',
  whiteSpace: 'nowrap',
  textShadow: KT_2023.shadow,
});

/** rough Montserrat ExtraBold Italic caps width (px per char at 1 px) used only to keep a long phrase inside 81 percent */
const CAPS_EM = 0.74;
export const CaptionLine: React.FC<{
  phrases: CaptionPhrase[];
  /** where the line may show (source seconds), OFF everywhere else */
  spans: [number, number][];
  /** spans where the line rides higher (above the subscribe bar) */
  lift?: [number, number][];
}> = ({ phrases, spans, lift = [] }) => {
  const t = useKtTime();
  const span = spans.find(([a, b]) => t >= a && t < b);
  if (!span) return null;
  let cur: CaptionPhrase | null = null;
  for (const p of phrases) if (p.t <= t && p.t < span[1] && p.t >= span[0] - 0.2) cur = p;
  if (!cur) return null;
  const raw = cur.text.replace(/\*/g, '');
  const fs = Math.min(CAPTION.fontSize, Math.floor(CAPTION.maxW / (raw.length * CAPS_EM)));
  const lifted = lift.some(([a, b]) => t >= a && t < b);
  const spark = cur.spark ? { word: cur.spark.word, dt: t - cur.spark.t } : undefined;
  return (
    <div style={{ position: 'absolute', left: 960, top: lifted ? CAPTION.liftY : CAPTION.y, transform: 'translate(-50%, -50%)', width: 'max-content', ...capStyle(fs) }}>
      <MarkedLine line={cur.text} color={KT_2023.white} keyColor={AI_YELLOW} spark={spark} />
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// kt-keyword-pop with a sparkle anchor (the engine's 'jiggle' numbers: 104 px font, 100 px pitch, the 110 pop + jiggle,
// 360-degree shutter); used where a kt-keyword-sparkle rides the popped word (AI ENGINEERING on "the key")
// ---------------------------------------------------------------------------------------------------------------------
export const KeywordPopSpark: React.FC<{ t0: number; t1: number; text: string; color: string; x?: number; y?: number; spark?: { word: string; t: number } }> = ({
  t0,
  t1,
  text,
  color,
  x = 960,
  y = 0.79 * 1080,
  spark,
}) => {
  const t = useKtTime();
  const fps = useKtFps();
  if (t < t0 || t >= t1) return null;
  const render = (ts: number, withSpark: boolean) => {
    const pm = pop110(ts - t0);
    return (
      <At x={x} y={y} s={pm.s} rot={pm.rot}>
        <div style={{ ...capStyle(104), lineHeight: '100px' }}>
          <MarkedLine line={text} color={color} keyColor={color} spark={withSpark && spark ? { word: spark.word, dt: t - spark.t } : undefined} />
        </div>
      </At>
    );
  };
  if (t - t0 < POP110_DUR + 0.04) return <ShutterBlur t={t} t0={t0} fps={fps} angle={360} samples={8} render={(ts) => render(ts, false)} />;
  return <>{render(t, true)}</>;
};

// ---------------------------------------------------------------------------------------------------------------------
// HEADLINE POP: kt-headline-over-broll's text (the kt-keyword-pop 110 pop + jiggle, 360-degree shutter, still to the cut)
// with an optional small framing line in the same block (the IMG-1 headline) and case kept as written (PhDs)
// ---------------------------------------------------------------------------------------------------------------------
export const HeadlinePop: React.FC<{
  t0: number;
  t1: number;
  lines: KtLine[];
  x?: number;
  y?: number;
  fontSize: number;
  pitch?: number;
  framing?: string;
  uppercase?: boolean;
}> = ({ t0, t1, lines, x = 960, y = 540, fontSize, pitch, framing, uppercase = true }) => {
  const t = useKtTime();
  const fps = useKtFps();
  if (t < t0 || t >= t1) return null;
  const block = (
    <div style={{ textAlign: 'center' }}>
      <KtTextBlock lines={lines} style={{ fontSize, lineHeight: pitch ?? fontSize, color: KT_2023.white, keyColor: AI_YELLOW, shadow: KT_2023.shadow, uppercase }} />
      {framing && (
        <div
          style={{
            marginTop: 18,
            fontFamily: MONT,
            fontWeight: 700,
            fontSize: 22,
            letterSpacing: '0.08em',
            color: 'rgba(255,255,255,0.92)',
            textShadow: '2px 3px 6px rgba(0,0,0,0.7)',
            whiteSpace: 'nowrap',
          }}
        >
          {framing}
        </div>
      )}
    </div>
  );
  const render = (ts: number) => {
    const pm = pop110(ts - t0);
    return (
      <At x={x} y={y} s={pm.s} rot={pm.rot}>
        {block}
      </At>
    );
  };
  return <ShutterBlur t={t} t0={t0} fps={fps} angle={360} samples={8} active={t - t0 < POP110_DUR + 0.04} render={render} />;
};

// ---------------------------------------------------------------------------------------------------------------------
// SIDE-PANEL TEXT ITEMS: the kt-side-panel text, one item per spoken cue (the panel itself = the shared KtSidePanel engine
// with no lines). 'rise' = the panel text rise (338 px over 0.33 s, 80 -> 110 -> 100, 360-degree shutter) then the
// hover; 'pop' = the kt-keyword-pop 110 pop + jiggle then the hover. All items hover TOGETHER (one seed, one block).
// ---------------------------------------------------------------------------------------------------------------------
export type PanelItem = { t: number; y: number; node: React.ReactNode; mode: 'rise' | 'pop' };
const RISE_FROM = 338;
const RISE_DUR = 0.33;
export const PanelItems: React.FC<{ t0: number; t1: number; cx: number; items: PanelItem[]; seed: number }> = ({ t0, t1, cx, items, seed }) => {
  const t = useKtTime();
  const fps = useKtFps();
  if (t < t0 || t >= t1) return null;
  const hv = hover(t - (items[0]?.t ?? t0) - RISE_DUR, seed);
  return (
    <>
      {items.map((it, i) => {
        if (t < it.t) return null;
        const render = (ts: number) => {
          const d = ts - it.t;
          let dy = 0;
          let s = 1;
          let rot = 0;
          if (it.mode === 'rise') {
            dy = interpolate(d, [0, RISE_DUR], [RISE_FROM, 0], { ...CL, easing: Easing.out(Easing.cubic) });
            s = interpolate(d, [0, 0.15, RISE_DUR], [0.8, 1.1, 1.0], CL);
          } else {
            const pm = pop110(d);
            s = pm.s;
            rot = pm.rot;
          }
          return (
            <At x={cx} y={it.y} dx={hv.x} dy={dy + hv.y} s={s} rot={rot + hv.rot}>
              {it.node}
            </At>
          );
        };
        const win = it.mode === 'rise' ? RISE_DUR : POP110_DUR;
        return <ShutterBlur key={i} t={t} t0={it.t} fps={fps} angle={360} samples={8} active={t - it.t < win + 0.04} render={render} />;
      })}
    </>
  );
};

export const PanelText: React.FC<{ text: KtLine; color?: string; keyColor?: string; fontSize?: number }> = ({ text, color = KT_2023.white, keyColor = AI_YELLOW, fontSize = 70 }) => (
  <KtTextBlock lines={[text]} style={{ fontSize, lineHeight: 80, color, keyColor, shadow: KT_2023.shadow }} />
);

/** a tick / cross badge (the panel's CODE / MATH rows) */
export const Badge: React.FC<{ ok: boolean; size?: number }> = ({ ok, size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" style={{ display: 'block', filter: 'drop-shadow(3px 4px 5px rgba(0,0,0,0.55))' }}>
    <circle cx="32" cy="32" r="29" fill={ok ? '#19C24A' : '#E0151A'} stroke="#FFFFFF" strokeWidth="4" />
    {ok ? (
      <path d="M18 33 L28 43 L47 22" fill="none" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    ) : (
      <path d="M21 21 L43 43 M43 21 L21 43" fill="none" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" />
    )}
  </svg>
);
export const BadgeRow: React.FC<{ text: string; ok: boolean }> = ({ text, ok }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
    <Badge ok={ok} />
    <span style={{ ...capStyle(70), color: KT_2023.white }}>{text}</span>
  </div>
);

/** a flat rocket icon on the 2023 grey blob (kt-icon-pop 'rocket-left'; the 2023 artwork does not survive) */
export const RocketIcon: React.FC = () => (
  <svg viewBox="0 0 320 307" width="100%" height="100%">
    <ellipse cx="165" cy="160" rx="140" ry="128" fill="#D9DEE3" opacity="0.92" />
    <g transform="translate(160 150) rotate(45)">
      <path d="M0 -112 C 34 -82 42 -30 34 40 L -34 40 C -42 -30 -34 -82 0 -112 Z" fill="#F4F6F8" stroke="#1E2A33" strokeWidth="6" />
      <circle cx="0" cy="-30" r="20" fill="#2EA6FF" stroke="#1E2A33" strokeWidth="6" />
      <path d="M-34 4 L-62 44 L-34 40 Z" fill="#E70001" stroke="#1E2A33" strokeWidth="6" strokeLinejoin="round" />
      <path d="M34 4 L62 44 L34 40 Z" fill="#E70001" stroke="#1E2A33" strokeWidth="6" strokeLinejoin="round" />
      <path d="M-20 42 L0 98 L20 42 Z" fill="#FFB300" stroke="#1E2A33" strokeWidth="5" strokeLinejoin="round" />
      <path d="M-9 44 L0 74 L9 44 Z" fill="#FFF176" />
    </g>
  </svg>
);

// ---------------------------------------------------------------------------------------------------------------------
// kt-lower-third-band verdict_pop (library sub-row): the dark-teal animated-texture band (top edge ~66 percent) slides
// UP in 0.267 s (influence 32.5 -> 100 ease); the 'if X' question (2 white lines, caps ~42 px) slides in from the LEFT
// x -0.347 -> 0.5 over 0.262 s and hovers; the verdict (one line, the role colour, caps ~55 px) does the 110 pop ON its
// word and hovers; no exit (cut with the shot).
// ---------------------------------------------------------------------------------------------------------------------
export const VBAND = { top: 713, slide: 0.267, qSlide: 0.262, tex: { w: 2575, h: 1448, cx: 1043, loopSec: 60 } };
export type BandItem = { t: number; t1: number; kind: 'slide' | 'pop'; x?: number; y: number; node: React.ReactNode; align?: 'center' | 'left' | 'right' };
export const VerdictBand: React.FC<{ t0: number; t1: number; textureSrc: string; textureIn?: number; items: BandItem[]; seed?: number }> = ({
  t0,
  t1,
  textureSrc,
  textureIn = 0,
  items,
  seed = 0,
}) => {
  const t = useKtTime();
  const fps = useKtFps();
  if (t < t0 || t >= t1) return null;
  const dt = t - t0;
  const top = interpolate(dt, [0, VBAND.slide], [H, VBAND.top], { ...CL, easing: easeInfluence325 });
  const sec = (textureIn + Math.max(0, dt)) % VBAND.tex.loopSec;
  const qFrom = -0.847 * W;
  return (
    <>
      <div style={{ position: 'absolute', left: 0, top, width: W, height: H - VBAND.top + 40, overflow: 'hidden' }}>
        <Freeze frame={Math.floor(sec * fps)}>
          <OffthreadVideo src={textureSrc} muted style={{ position: 'absolute', left: VBAND.tex.cx - VBAND.tex.w / 2, top: 0, width: VBAND.tex.w, height: VBAND.tex.h }} />
        </Freeze>
        <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: 6, background: 'linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0))' }} />
      </div>
      {items.map((it, i) => {
        if (t < it.t || t >= it.t1) return null;
        const hv = hover(t - it.t - 0.26, seed + i * 7 + it.t);
        const anchorX = it.x ?? 960;
        const origin = it.align === 'left' ? '0% 50%' : it.align === 'right' ? '100% 50%' : '50% 50%';
        const tx = it.align === 'left' ? '0%' : it.align === 'right' ? '-100%' : '-50%';
        if (it.kind === 'slide') {
          const pos = (ts: number) => qFrom * (1 - easeInfluence325(interpolate(ts - it.t, [0, VBAND.qSlide], [0, 1], CL)));
          const x = pos(t);
          const sigma = t - it.t < VBAND.qSlide + 0.04 ? streakSigma(shutterTravel(pos, t, it.t, 360, fps)) : 0;
          return (
            <DirBlur key={i} sx={Math.min(sigma, 120)} sy={0}>
              <div style={{ position: 'absolute', left: anchorX + x + hv.x, top: it.y + hv.y, transform: `translate(${tx}, -50%) rotate(${hv.rot}deg)`, transformOrigin: origin, width: 'max-content' }}>
                {it.node}
              </div>
            </DirBlur>
          );
        }
        const render = (ts: number) => {
          const pm = pop110(ts - it.t);
          return (
            <div style={{ position: 'absolute', left: anchorX + hv.x, top: it.y + hv.y, transform: `translate(${tx}, -50%) scale(${pm.s}) rotate(${pm.rot + hv.rot}deg)`, transformOrigin: origin, width: 'max-content' }}>
              {it.node}
            </div>
          );
        };
        return <ShutterBlur key={i} t={t} t0={it.t} fps={fps} angle={360} samples={8} active={t - it.t < POP110_DUR + 0.04} render={render} />;
      })}
    </>
  );
};
export const BandText: React.FC<{ lines: KtLine[]; caps: number; color?: string; keyColor?: string; align?: 'center' | 'left' | 'right' }> = ({ lines, caps, color = KT_2023.white, keyColor = AI_YELLOW, align = 'center' }) => {
  const fs = Math.round(caps / 0.7);
  return <KtTextBlock lines={lines} style={{ fontSize: fs, lineHeight: Math.round(fs * 1.1), color, keyColor, shadow: KT_2023.shadow, align }} />;
};
export const ArrowGlyph: React.FC<{ w?: number; color?: string }> = ({ w = 70, color = '#FFFFFF' }) => (
  <svg width={w} height={w * 0.5} viewBox="0 0 70 35" style={{ display: 'inline-block', verticalAlign: 'middle', filter: 'drop-shadow(3px 4px 4px rgba(0,0,0,0.55))' }}>
    <path d="M4 17.5 H 54 M 40 4 L 58 17.5 L 40 31" fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ---------------------------------------------------------------------------------------------------------------------
// kt-versus-stack (library row): the face under a dark-teal Color Matte (79 percent, darken-type: the turquoise #4AA293
// reads #335C55 under it, solved = #2D4944) that slides DOWN in (y -0.183 -> 0.5, 0.262 s, out 2.41 / 33 -> 0 / 100 ease),
// then each line slides DOWN in with the same ease ON its words and hovers with the camera wobble; all cut with the shot.
// ---------------------------------------------------------------------------------------------------------------------
export const VERSUS = { matte: '#2D4944', opacity: 0.79, slide: 0.262, travel: 0.683 * H };
const versusEase = Easing.bezier(0.33, 0.8, 0, 1);
export type VersusLine = { t: number; y: number; lines: KtLine[]; color: string; fontSize: number };
export const VersusStack: React.FC<{ t0: number; t1: number; lines: VersusLine[] }> = ({ t0, t1, lines }) => {
  const t = useKtTime();
  const fps = useKtFps();
  if (t < t0 || t >= t1) return null;
  const drop = (ts: number, start: number) => -VERSUS.travel * (1 - versusEase(interpolate(ts - start, [0, VERSUS.slide], [0, 1], CL)));
  const my = drop(t, t0);
  return (
    <>
      <div style={{ ...FULL, transform: `translateY(${my}px)`, background: VERSUS.matte, opacity: VERSUS.opacity, mixBlendMode: 'darken' }} />
      {lines.map((ln, i) => {
        if (t < ln.t) return null;
        const pos = (ts: number) => drop(ts, ln.t);
        const y = pos(t);
        const sigma = t - ln.t < VERSUS.slide + 0.04 ? streakSigma(shutterTravel(pos, t, ln.t, 360, fps)) : 0;
        const wb = wobble(t - ln.t);
        return (
          <DirBlur key={i} sx={0} sy={Math.min(sigma, 120)}>
            <At x={960} y={ln.y} dx={wb.x} dy={y + wb.y} rot={wb.rot}>
              <KtTextBlock lines={ln.lines} style={{ fontSize: ln.fontSize, lineHeight: Math.round(ln.fontSize * 0.98), color: ln.color, shadow: KT_2023.shadow }} />
            </At>
          </DirBlur>
        );
      })}
    </>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// kt-boxed-words (library row; the Scene_11 MOGRT CODE-BUILT, never After Effects): a flat light-grey card (#BABABA,
// soft vignette) cut in SILENT; two black rough boxes with yellow #FFFB23 caps ~140 px, word 1 at (960, 414) rot X -11 /
// Y 9 / Z 1, word 2 at (899, 682) rot X -8 / Y 6 / Z -1; each whips in from the upper left with a streak blur and settles
// by +0.6 s; drop shadow opacity 70, angle 120, distance 30, size 25.
// ---------------------------------------------------------------------------------------------------------------------
const boxEase = Easing.out(Easing.cubic);
export const BOXED = { whip: 0.33, from: { x: -760, y: -430 } };
const BoxWord: React.FC<{ text: string; x: number; y: number; rx: number; ry: number; rz: number; t0: number; t: number; fps: number }> = ({ text, x, y, rx, ry, rz, t0, t, fps }) => {
  if (t < t0) return null;
  const pos = (ts: number) => boxEase(interpolate(ts - t0, [0, BOXED.whip], [0, 1], CL));
  const u = pos(t);
  const dx = BOXED.from.x * (1 - u);
  const dy = BOXED.from.y * (1 - u);
  const s = interpolate(t - t0, [0, BOXED.whip, 0.45, 0.6], [1.35, 0.97, 1.01, 1], CL);
  const prev = pos(Math.max(t0, t - 1 / fps));
  const travel = Math.hypot(BOXED.from.x, BOXED.from.y) * Math.abs(u - prev);
  const sig = Math.min(90, travel / 3);
  return (
    <DirBlur sx={sig * 0.87} sy={sig * 0.5}>
      <div style={{ position: 'absolute', left: x + dx, top: y + dy, transform: `translate(-50%, -50%) perspective(1400px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${s})`, width: 'max-content' }}>
        <div
          style={{
            background: '#0B0B0B',
            padding: '22px 46px 18px',
            filter: 'url(#aivsml-rough) drop-shadow(26px 15px 12px rgba(0,0,0,0.7))',
            fontFamily: MONT,
            fontWeight: 900,
            fontStyle: 'normal',
            fontSize: 200,
            lineHeight: '200px',
            color: '#FFFB23',
            textTransform: 'uppercase',
            letterSpacing: '0.01em',
          }}
        >
          {text}
        </div>
      </div>
    </DirBlur>
  );
};
export const BoxedWordsCard: React.FC<{ t0: number; t1: number; w1: { t: number; text: string }; w2: { t: number; text: string } }> = ({ t0, t1, w1, w2 }) => {
  const t = useKtTime();
  const fps = useKtFps();
  if (t < t0 || t >= t1) return null;
  return (
    <div style={{ ...FULL, overflow: 'hidden', background: '#BABABA' }}>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="aivsml-rough" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="10" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
      <div style={{ ...FULL, background: 'radial-gradient(ellipse at 50% 48%, rgba(255,255,255,0.10) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.42) 100%)' }} />
      <BoxWord text={w1.text} x={960} y={414} rx={-11} ry={9} rz={1} t0={w1.t} t={t} fps={fps} />
      <BoxWord text={w2.text} x={899} y={682} rx={-8} ry={6} rz={-1} t0={w2.t} t={t} fps={fps} />
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// End-screen playlist arrows (kt-subscribe-close arrow pop: 'Zoom Bounce IN' scaled to 0.217 s, 0 -> 111 -> 93 -> 105 ->
// 98 -> 101 -> 100, opacity in 0.020 s, 180-degree shutter). The state PNG bakes the arrow; the comp hides it under the
// base card patch and pops the cut-out arrow (assets/kt/end-screen-arrow-sN.png, diffed off the state PNG) in its place.
// ---------------------------------------------------------------------------------------------------------------------
export const END_ARROW_BOX: Record<number, { x: number; y: number; w: number; h: number }> = {
  1: { x: 98, y: 298, w: 260, h: 192 },
  2: { x: 1562, y: 298, w: 260, h: 192 },
  3: { x: 98, y: 668, w: 260, h: 192 },
  4: { x: 1562, y: 668, w: 260, h: 192 },
};
export const EndScreenArrow: React.FC<{ n: number; t0: number }> = ({ n, t0 }) => {
  const t = useKtTime();
  const fps = useKtFps();
  const b = END_ARROW_BOX[n];
  const render = (ts: number) => {
    const e = elastic(ts - t0, ELASTIC.arrow.dur, ELASTIC.arrow.fade);
    return (
      <div style={{ position: 'absolute', left: b.x, top: b.y, width: b.w, height: b.h, opacity: e.op, transform: `scale(${e.s})`, transformOrigin: '50% 50%' }}>
        <Img src={staticFile(`kt/end-screen-arrow-s${n}.png`)} style={{ width: b.w, height: b.h }} />
      </div>
    );
  };
  return (
    <>
      {/* the base card under the baked arrow (states share every other pixel) */}
      <div style={{ position: 'absolute', left: b.x, top: b.y, width: b.w, height: b.h, overflow: 'hidden' }}>
        <Img src={staticFile('card-slides/end-screen.png')} style={{ position: 'absolute', left: -b.x, top: -b.y, width: W, height: H }} />
      </div>
      <ShutterBlur t={t} t0={t0} fps={fps} angle={180} samples={8} active={t - t0 < ELASTIC.arrow.dur + 0.04} render={render} />
    </>
  );
};

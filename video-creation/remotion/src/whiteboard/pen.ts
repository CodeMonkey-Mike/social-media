// whiteboard/pen.ts: the PEN of the code-rendered whiteboard track (video-creation/whiteboard/whiteboard.md).
// A pen = ink + wobble + fill style + palette + fonts. These tokens mirror ONE entry of
// video-creation/whiteboard/styles/styles.json (the picker); the composition imports a pen and every Sketch
// inherits it, so switching the look of a whole video is one import. Paper & pastel is Mike's pick for the first
// demo (2026-10-30). Add a pen here only after it exists in styles.json (the picker is the source of truth).

export type Palette = { blue: string; gold: string; red: string; green: string; brown: string; grey: string };

export type Pen = {
  id: string;
  /** 'rough' draws through rough.js (wobble, hand fills); 'flat' draws clean SVG. */
  mode: 'rough' | 'flat';
  bg: string;
  /** lower band of the paper, or null */
  floor: string | null;
  ink: string;
  inkWidth: number;
  roughness: number;
  bowing: number;
  fillStyle: 'solid' | 'hachure' | 'zigzag' | 'cross-hatch' | 'none';
  fillWeight: number;
  hachureGap: number;
  palette: Palette;
  colorH: string;
  colorL: string;
  caps: boolean;
  /** glow filter on strokes + text (neon pens) */
  glow: boolean;
  /** Google font family names (must exist in @remotion/google-fonts) */
  fontH: string;
  fontL: string;
  /** average glyph width in em for the typewriter's centering estimate */
  charWH: number;
  charWL: number;
  /** derived roles used by the vocabulary */
  dark: string;   // hair, mane, tail, pupils
  light: string;  // faces, hooves, hands
};

export const PAPER_PASTEL: Pen = {
  id: 'paper-pastel',
  mode: 'rough',
  bg: '#ffffff',
  floor: '#f6f1e6',
  ink: '#222222',
  inkWidth: 2.4,
  roughness: 1.2,
  bowing: 1.0,
  fillStyle: 'solid',
  fillWeight: 1,
  hachureGap: 6,
  palette: { blue: '#9ec5e8', gold: '#f3d27a', red: '#e98b8b', green: '#a7d8a2', brown: '#c9a27e', grey: '#d8d8d8' },
  colorH: '#222222',
  colorL: '#444444',
  caps: false,
  glow: false,
  fontH: 'Gochi Hand',
  fontL: 'Kalam',
  charWH: 0.41,
  charWL: 0.42,
  dark: '#3a2414',
  light: '#ffffff',
};

// Neon ink (styles.json `neon-ink`): near-black, thin glowing strokes, no fills; a shape's fill color becomes its
// stroke color (Sketch does that when fillStyle is 'none'), so objects read as colored neon outlines. Mike picked it
// 2026-10-31 for the Binance video (black + gold).
export const NEON_INK: Pen = {
  id: 'neon-ink',
  mode: 'rough',
  bg: '#050507',
  floor: null,
  ink: '#ffffff',
  inkWidth: 2.6,
  roughness: 1.0,
  bowing: 0.8,
  fillStyle: 'none',
  fillWeight: 1,
  hachureGap: 6,
  palette: { blue: '#00e5ff', gold: '#ffd60a', red: '#ff2e63', green: '#39ff14', brown: '#ff9f1c', grey: '#6e6e7a' },
  colorH: '#ffd60a',
  colorL: '#ffffff',
  caps: true,
  glow: true,
  fontH: 'Rock Salt',
  fontL: 'Handlee',
  charWH: 0.92,
  // Handlee in CAPS (this pen is caps-only): measured 0.58 to 0.69 em per glyph on the binance beat stills (2026-10-31),
  // mean 0.62; the earlier 0.45 was the lowercase estimate and pushed every centered label right of its anchor.
  charWL: 0.62,
  dark: '#9aa0a6',
  light: '#050507',
};

// Paper & Quant orange (styles.json `paper-quant`, Mike 2026-11-04, the quant video): paper-pastel re-inked to
// quant.network's look. Warm near-black ink (#43403E), white paper, ORANGE as the one accent: `red` is the solid brand
// orange (#F15A22) for the highlighted / hot thing, `gold` a pale orange tint for money and fills, `blue` (machines) a warm
// light grey so nothing competes with the orange, `green` the site's own green tinted, `brown` a warm skin / animal tone.
export const PAPER_QUANT: Pen = {
  ...PAPER_PASTEL,
  id: 'paper-quant',
  floor: '#F7F9FC',
  ink: '#43403E',
  palette: { blue: '#DDD9D4', gold: '#F9C2A6', red: '#F15A22', green: '#BFEBDC', brown: '#E7A77F', grey: '#E8E5E1' },
  colorH: '#F15A22',   // headings in the site's orange (Mike, 2026-11-04, after the first sample)
  colorL: '#5C5855',
  dark: '#2B2826',
  light: '#ffffff',
};

export const PENS: Record<string, Pen> = { 'paper-pastel': PAPER_PASTEL, 'paper-quant': PAPER_QUANT, 'neon-ink': NEON_INK };

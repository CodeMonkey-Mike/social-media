// HwSplitPanels.tsx: hw-split-panels (library.json devices.hw-split-panels), the panel look of the Bear Markets "Halloween
// Party Promo" montage: the frame is cut into panels by the template's own LUMA MATTE clips (graphics/matte-t1..t8.mp4 =
// the template's t_1..t_8), each panel a different treatment of the SAME scene (colour, B&W, B&W + white grid, dim, red
// Tint + red grid), the treatments Offset-sliding against each other.
//   'diagonal' (promo scene 1, ~40-42 degree bands): the main photo / footage fills the frame (soft, pushing in, draining to
//      B&W); a RED panel (the same scene through an AE Tint + red grid + halftone) grows into the upper-right corner through
//      t3 (a band entering at the right edge, matte time = scene time - 0.3 s) and a red panel leaves the lower-left corner
//      through t1 (a band leaving left, matte time = scene time + 0.9 s). Fitted to the 2022 frames at scene 0.4 / 1.4 / 2.9 s
//      (lower-left edge (0,180)-(960,1080) -> (0,500)-(620,1080) -> (0,640)-(480,1080); upper-right edge none ->
//      (1450,0)-(1920,420) -> (960,0)-(1920,870)). With `scene2` (promo scene 2's look) a second image, red-tinted, rides
//      the '/' band t4 (leaving left from the upper-left).
//   'vertical' (promo scenes 3-6): base = the scene sliding left; a B&W + grid band through t7 (a 755 px vertical band that
//      slides from x 1063 to the left edge in 2 s, then narrows to 343 px by 7 s); a block from the right edge through t8
//      (left edge 1692 at 1.67 s -> 434 by 7 s, ease-out). The promo's title phase switches the looks to B&W / dim.
// The mattes and their motion are the TEMPLATE's plates (exact); the layer stack (which treatment rides which matte, the
// Offset amounts, the matte in-points / rates of the vertical scenes) is APPROXIMATED from the render's frames (the
// template's comps live in the binary .aep). Compositing: media.tsx LumaMatte (blend modes, exact for opaque layers).
// SILENT in the source.
import React from 'react';
import { useKtTime } from '../kinetic-text/clock';
import { HwLook, HwLookLayer, HwVideoAt, LumaMatte, Offset } from './media';
import { hwPaired } from './sfx';
import { HwSoundCue } from './types';

export type HwSplitVariant = 'diagonal' | 'vertical';

export const HW_SPLIT = {
  diagonal: { upperRight: { matte: 3, offset: -0.3 }, lowerLeft: { matte: 1, offset: 0.9 }, second: { matte: 4, offset: 0 }, matteRate: 1, push: 0.06, blur: 2.5, desat: [0.45, 0.85] as [number, number], redDrift: 60 },
  vertical: {
    m7: { in: 0.4, rate: 1.6 },
    m8: { in: 1.5, rate: 1.6 },
    slide: { base: [40, -60] as [number, number], band: [-80, 40] as [number, number], block: [120, 0] as [number, number] },
    looks: { base: 'color' as HwLook, band: 'bw-grid' as HwLook, block: 'color' as HwLook },
  },
  /** the halftone-squares plate (textures/square-motion.mp4) screened over the panels */
  squares: { opacity: 0.9, loop: 4.0 },
};

export type HwSplitPanelsProps = {
  /** first frame of the panels (the mattes' in-point), seconds on the comp clock */
  t0: number;
  t1: number;
  variant?: HwSplitVariant;
  /** the scene rendered for one panel treatment (a photo, footage, or photo + title; it reads the clock itself) */
  scene: (look: HwLook) => React.ReactNode;
  /** diagonal: a second image, red-tinted, riding the '/' band t4 (promo scene 2's look); omit for scene 1's look */
  scene2?: (look: HwLook) => React.ReactNode;
  /** drawn over each panel's TREATED scene, unfiltered (the promo's title: red in the colour / B&W main panel, a ghost in
   * the grid / dim / red panels), moving with that panel's Offset */
  overlay?: (look: HwLook) => React.ReactNode;
  /** matte number 1..8 -> staticFile path of graphics/matte-t<n>.mp4 */
  matteSrc: (n: number) => string;
  /** staticFile path of textures/square-motion.mp4 (optional halftone squares) */
  squareSrc?: string;
  /** diagonal: an extra matte in-point (added to every matte's offset) and the matte rate */
  matteIn?: number;
  matteRate?: number;
  /** vertical: the three treatments (default colour / B&W + grid / colour; the promo's title phase passes bw / bw-grid / dim) */
  looks?: { base: HwLook; band: HwLook; block: HwLook };
  /** vertical: vignette on the base panel (the promo's title phase) */
  vignette?: number;
  /** vertical: matte timing overrides */
  m7?: { in: number; rate: number };
  m8?: { in: number; rate: number };
  /** where the vertical scene's slide is measured from (default t0; the promo keeps one slide across its two phases) */
  slideFrom?: number;
  slideTo?: number;
};

const lerp = (a: [number, number], k: number) => a[0] + (a[1] - a[0]) * Math.min(1, Math.max(0, k));

export const HwSplitPanels: React.FC<HwSplitPanelsProps> = (p) => {
  const t = useKtTime();
  if (t < p.t0 || t >= p.t1) return null;
  const variant = p.variant ?? 'diagonal';
  const dt = t - p.t0;
  const k = dt / Math.max(0.001, p.t1 - p.t0);
  const matte = (n: number, sec: number) => <HwVideoAt src={p.matteSrc(n)} sec={sec} />;
  const squares = p.squareSrc ? (
    <div style={{ position: 'absolute', inset: 0, mixBlendMode: 'screen', opacity: HW_SPLIT.squares.opacity }}>
      <HwVideoAt src={p.squareSrc} sec={dt % HW_SPLIT.squares.loop} />
    </div>
  ) : null;

  if (variant === 'diagonal') {
    const D = HW_SPLIT.diagonal;
    const rate = p.matteRate ?? D.matteRate;
    const ms = (o: number) => dt * rate + o + (p.matteIn ?? 0);
    const sat = 1 - Math.min(1, Math.max(0, (k - D.desat[0]) / (D.desat[1] - D.desat[0])));
    const red = (node: React.ReactNode) => (
      <Offset dx={D.redDrift * k} dy={-D.redDrift * 0.9 * k}>
        <HwLookLayer look="red">{node}</HwLookLayer>
        {p.overlay?.('red')}
      </Offset>
    );
    const main = (
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${1 + D.push * k})` }}>
        <HwLookLayer look="color" saturate={sat} blur={D.blur}>
          {p.scene('color')}
        </HwLookLayer>
        {p.overlay?.('color')}
      </div>
    );
    const UR = D.upperRight;
    const LL = D.lowerLeft;
    const L1 = <LumaMatte matte={matte(UR.matte, ms(UR.offset))} under={main} over={red(p.scene('red'))} />;
    const L2 = <LumaMatte matte={matte(LL.matte, ms(LL.offset))} under={L1} over={red(p.scene('red'))} />;
    const L3 = p.scene2 ? (
      <LumaMatte matte={matte(D.second.matte, ms(D.second.offset))} under={L2} over={<HwLookLayer look="red">{p.scene2('red')}</HwLookLayer>} />
    ) : (
      L2
    );
    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', isolation: 'isolate', background: 'black' }}>
        {L3}
        {squares}
      </div>
    );
  }

  const V = HW_SPLIT.vertical;
  const m7 = p.m7 ?? V.m7;
  const m8 = p.m8 ?? V.m8;
  const looks = p.looks ?? V.looks;
  const sFrom = p.slideFrom ?? p.t0;
  const sTo = p.slideTo ?? p.t1;
  const ks = (t - sFrom) / Math.max(0.001, sTo - sFrom);
  const base = (
    <Offset dx={lerp(V.slide.base, ks)}>
      <HwLookLayer look={looks.base} vignette={p.vignette ?? 0}>
        {p.scene(looks.base)}
      </HwLookLayer>
      {p.overlay?.(looks.base)}
    </Offset>
  );
  const band = (
    <Offset dx={lerp(V.slide.band, ks)}>
      <HwLookLayer look={looks.band}>{p.scene(looks.band)}</HwLookLayer>
      {p.overlay?.(looks.band)}
    </Offset>
  );
  const block = (
    <Offset dx={lerp(V.slide.block, ks)}>
      <HwLookLayer look={looks.block}>{p.scene(looks.block)}</HwLookLayer>
      {p.overlay?.(looks.block)}
    </Offset>
  );
  const ms7 = (t - sFrom) * m7.rate + m7.in;
  const ms8 = (t - sFrom) * m8.rate + m8.in;
  const L1 = <LumaMatte matte={matte(7, ms7)} under={base} over={band} />;
  const L2 = <LumaMatte matte={matte(8, ms8)} under={L1} over={block} />;
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', isolation: 'isolate', background: 'black' }}>
      {L2}
      {squares}
    </div>
  );
};

/** hw-split-panels sounds: SILENT in the source. `pair` = a screenplay-paired catalog sound, attack ON the panels' start. */
export const hwSplitPanelsSounds = (o: { t0: number; pair?: string }): HwSoundCue[] => hwPaired(o.pair, [o.t0], 'screenplay-paired: attack ON the panels');

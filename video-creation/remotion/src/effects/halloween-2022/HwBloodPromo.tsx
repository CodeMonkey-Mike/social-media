// HwBloodPromo.tsx: hw-blood-promo (library.json devices.hw-blood-promo), the Bear Markets act-break montage 85.600-104.000:
// an After Effects render of the Envato "Halloween Party Promo" template (Scene 01-06 used, 18.4 s, scale 200 percent in the
// 4K sequence, 100 percent speed, a 1.0 s Cross Dissolve in from the fire-pumpkin plate, Mike's narration under it).
// Composed from its two sub-devices:
//   hw-split-panels  the panels cut by the template's luma-matte clips (diagonal scenes, then vertical scenes)
//   hw-blood-title   the red glowing title + the growing blood splat (alpha plates)
// Scene grammar (render seconds = timeline seconds, 100 percent speed):
//   'diagonal'  (Scene 01-02, ~4.3-4.6 s): fades in from black (~1.0 s), diagonal panels slide in along ~40 deg, the title
//               is there from the start (blurs in), Blood_1's drips ride it; the scene drains to B&W, then zooms back and
//               fades to black (~0.8 s). BM: 86.2-90.5 'Oct 29, 1929', 91.0-95.3 'MILLION SHARES' / 'Just One Day'.
//   'panels'    (Scene 03-06, 2.1-2.3 s each, HARD CUTS): ~1.1 s of 3-4 vertical panels (colour / B&W + grid / colour of the
//               same photo, Offset-sliding), then ~1.1 s B&W with vignette, the red title + Blood_2 growing over it, a white
//               serif subtitle. BM cuts 95.31 / 97.61 / 99.81 / 101.92, title events 96.51 / 98.68 / 100.85 / 103.02.
// Particles: the template's dust plate (textures/particles.mp4) screened over all of it.
// Every scene of a video's montage carries its own photo + words; the defaults reproduce the BM timing.
// SILENT in the source (the music was ducked -5 -> -8 dB under it).
import React from 'react';
import { Img } from 'remotion';
import { useKtTime } from '../kinetic-text/clock';
import { HwBloodSplat, HwBloodTitleText } from './HwBloodTitle';
import { HwSplitPanels } from './HwSplitPanels';
import { HwLook, HwVideoAt } from './media';
import { hwPaired } from './sfx';
import { HwSoundCue } from './types';

export type HwPromoSceneKind = 'diagonal' | 'panels';

export const HW_BLOOD_PROMO = {
  diagonal: { dur: 4.6, titleAt: 0.0, fadeIn: 1.0, fadeOut: 0.8, zoomBack: 0.08, blood: { plate: 1 as 1 | 2, in: 7.0, rate: 0.4, x: 960, y: 500, scale: 1.0 } },
  panels: {
    dur: 2.2,
    titleAt: 1.1,
    blood: { plate: 2 as 1 | 2, in: 5.5, rate: 4, x: 700, y: 500, scale: 0.88 },
    /** the title phase re-cuts the panels (a hard cut in the source): a narrow left grid band (t7 from 4.5 s, 0.5x: right
     * edge ~430 -> 400 px) and a narrow right block (t8 from 1.75 s, 0.35x: left edge ~1660 -> 1480 px), so the B&W main
     * panel holds the title (the 2022 frames: left panel 0-245 / 0-410, main to ~1420-1855) */
    titleMattes: { m7: { in: 4.5, rate: 0.5 }, m8: { in: 1.75, rate: 0.35 } },
  },
  particles: { opacity: 0.85 },
};

export type HwPromoScene = {
  kind?: HwPromoSceneKind;
  /** the photo (or footage when `video`) of the scene */
  src: string;
  video?: boolean;
  /** footage in-point, seconds */
  videoIn?: number;
  /** diagonal: a second, red-tinted image on the '/' band (promo scene 2's look); omit for scene 1's look */
  src2?: string;
  title: string;
  subtitle?: string;
  /** keep the title's case (the source's 'Oct 29, 1929' was mixed case) */
  uppercase?: boolean;
  dur?: number;
  titleAt?: number;
  titleCaps?: number;
  titleY?: number;
  blood?: 1 | 2;
  bloodIn?: number;
  bloodRate?: number;
  bloodX?: number;
  bloodY?: number;
  bloodScale?: number;
};

export type HwBloodPromoProps = {
  /** first frame of the montage, seconds on the comp clock */
  t0: number;
  scenes: HwPromoScene[];
  /** matte number 1..8 -> staticFile path of graphics/matte-t<n>.mp4 */
  matteSrc: (n: number) => string;
  /** plate 1 | 2 -> staticFile paths of graphics/blood-<n>-fill.mp4 and blood-<n>-key.mp4 */
  bloodSrc: (n: 1 | 2) => { fill: string; key: string };
  squareSrc?: string;
  particlesSrc?: string;
};

export const hwBloodPromoDuration = (scenes: HwPromoScene[]) =>
  scenes.reduce((a, s) => a + (s.dur ?? HW_BLOOD_PROMO[s.kind ?? 'panels'].dur), 0);

/** One scene's picture (photo or footage) for a panel treatment; the panels tint / grey it like the template's copies. */
const SceneComp: React.FC<{ sc: HwPromoScene; s0: number; second?: boolean }> = ({ sc, s0, second }) => {
  const t = useKtTime();
  const src = second && sc.src2 ? sc.src2 : sc.src;
  const isVideo = !second && sc.video;
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: 'black' }}>
      {isVideo ? (
        <HwVideoAt src={src} sec={(sc.videoIn ?? 0) + Math.max(0, t - s0)} style={{ objectFit: 'cover' }} />
      ) : (
        <Img src={src} style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, objectFit: 'cover' }} />
      )}
    </div>
  );
};

/** The title as each panel shows it (the template's panels are copies of the whole scene comp): red in the colour / B&W
 * main panel, a ghost in the others (the 2022 frames: a dark-red '1929' in the red panel, a grey 'D' in the grid panel). */
const GHOST: Partial<Record<HwLook, { color: string; opacity: number }>> = {
  red: { color: '#5c0606', opacity: 0.85 },
  'bw-grid': { color: '#9a9a9a', opacity: 0.55 },
  dim: { color: '#3a3a3a', opacity: 0.7 },
};
const titleFor = (sc: HwPromoScene, titleT: number) => (look: HwLook) => {
  const g = GHOST[look];
  return (
    <HwBloodTitleText
      t0={titleT}
      title={sc.title}
      part="title"
      uppercase={sc.uppercase}
      caps={sc.titleCaps}
      y={sc.titleY}
      color={g ? g.color : undefined}
      opacity={g ? g.opacity : 1}
    />
  );
};

export const HwBloodPromo: React.FC<HwBloodPromoProps> = (p) => {
  const t = useKtTime();
  const total = hwBloodPromoDuration(p.scenes);
  const dt = t - p.t0;
  if (dt < 0 || dt >= total) return null;
  let s0 = p.t0;
  let sc: HwPromoScene = p.scenes[0];
  for (const s of p.scenes) {
    const d = s.dur ?? HW_BLOOD_PROMO[s.kind ?? 'panels'].dur;
    if (t < s0 + d) {
      sc = s;
      break;
    }
    s0 += d;
  }
  const kind = sc.kind ?? 'panels';
  const D = HW_BLOOD_PROMO[kind];
  const dur = sc.dur ?? D.dur;
  const s1 = s0 + dur;
  const titleT = s0 + (sc.titleAt ?? D.titleAt);
  const plate = sc.blood ?? D.blood.plate;
  const splat = (
    <HwBloodSplat
      t0={titleT}
      t1={s1}
      fillSrc={p.bloodSrc(plate).fill}
      keySrc={p.bloodSrc(plate).key}
      bloodIn={sc.bloodIn ?? D.blood.in}
      bloodRate={sc.bloodRate ?? D.blood.rate}
      x={sc.bloodX ?? D.blood.x}
      y={sc.bloodY ?? D.blood.y}
      scale={sc.bloodScale ?? D.blood.scale}
    />
  );
  const subtitle = sc.subtitle ? (
    <HwBloodTitleText t0={titleT} title={sc.title} subtitle={sc.subtitle} part="subtitle" caps={sc.titleCaps} y={sc.titleY} />
  ) : null;
  const particles = p.particlesSrc ? (
    <div style={{ position: 'absolute', inset: 0, mixBlendMode: 'screen', opacity: HW_BLOOD_PROMO.particles.opacity }}>
      <HwVideoAt src={p.particlesSrc} sec={(t - p.t0) % 10.8} />
    </div>
  ) : null;

  if (kind === 'diagonal') {
    const DG = HW_BLOOD_PROMO.diagonal;
    const fin = Math.min(1, (t - s0) / DG.fadeIn);
    const fout = Math.min(1, Math.max(0, (s1 - t) / DG.fadeOut));
    const vis = Math.min(fin, fout);
    const back = 1 - DG.zoomBack * (1 - fout);
    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: 'black' }}>
        <div style={{ position: 'absolute', inset: 0, transform: `scale(${back})`, opacity: vis }}>
          <HwSplitPanels
            t0={s0}
            t1={s1}
            variant="diagonal"
            matteSrc={p.matteSrc}
            squareSrc={p.squareSrc}
            scene={() => <SceneComp sc={sc} s0={s0} />}
            scene2={sc.src2 ? () => <SceneComp sc={sc} s0={s0} second /> : undefined}
            overlay={titleFor(sc, titleT)}
          />
          {splat}
          {subtitle}
          {particles}
        </div>
      </div>
    );
  }

  // panels: colour panels, then (from titleAt) the B&W title phase with the blood growing over the title
  const titled = t >= titleT;
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: 'black' }}>
      <HwSplitPanels
        t0={s0}
        t1={s1}
        variant="vertical"
        matteSrc={p.matteSrc}
        squareSrc={p.squareSrc}
        looks={titled ? { base: 'bw', band: 'bw-grid', block: 'dim' } : undefined}
        vignette={titled ? 0.75 : 0}
        m7={titled ? HW_BLOOD_PROMO.panels.titleMattes.m7 : undefined}
        m8={titled ? HW_BLOOD_PROMO.panels.titleMattes.m8 : undefined}
        slideFrom={titled ? titleT : undefined}
        scene={() => <SceneComp sc={sc} s0={s0} />}
        overlay={titled ? titleFor(sc, titleT) : undefined}
      />
      {titled && splat}
      {titled && subtitle}
      {particles}
    </div>
  );
};

/** hw-blood-promo sounds: SILENT in the source (music only, ducked under it). `pair` = a screenplay-paired catalog sound,
 * attack ON each scene's title. */
export const hwBloodPromoSounds = (o: { t0: number; scenes: HwPromoScene[]; pair?: string }): HwSoundCue[] => {
  const times: number[] = [];
  let s0 = o.t0;
  for (const s of o.scenes) {
    const D = HW_BLOOD_PROMO[s.kind ?? 'panels'];
    times.push(s0 + (s.titleAt ?? D.titleAt));
    s0 += s.dur ?? D.dur;
  }
  return hwPaired(o.pair, times, 'screenplay-paired: attack ON each scene title');
};

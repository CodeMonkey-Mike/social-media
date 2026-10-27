// registry.ts: the bridge between the EFFECTS catalog (video-creation/assets/effects/library.json, the single source of
// truth) and the halloween-2022 engines, the way ../kinetic-text/registry.ts does it for kinetic-text-2023. A device row
// names its engine file ("engine": "halloween-2022/HwWordPop.tsx"); ENGINES maps that component name to the code and
// SOUNDS to its sound helper (the motion + sound pairing in code). `hw-keyed-presenter` has NO engine on purpose (house
// rule: never key or matte Mike's face).
import React from 'react';
import library from '../../../../assets/effects/library.json';
import { HwBloodPromo, hwBloodPromoSounds } from './HwBloodPromo';
import { HwBloodTitle, hwBloodTitleSounds } from './HwBloodTitle';
import { HwCameraShake, hwCameraShakeSounds } from './HwCameraShake';
import { HwDropBounce, hwDropBounceSounds } from './HwDropBounce';
import { HwSplitPanels, hwSplitPanelsSounds } from './HwSplitPanels';
import { HwSubscribeLikeBell, hwSubscribeLikeBellSounds } from './HwSubscribeLikeBell';
import { HwWordPop, hwWordPopSounds } from './HwWordPop';
import { HwZoomPunch, hwZoomPunchSounds } from './HwZoomPunch';
import { HwZoomSlideshow, hwZoomSlideshowSounds } from './HwZoomSlideshow';
import { HwSoundCue } from './types';

/** engine component name (as written in library.json, without folder / extension) -> component */
export const HW_ENGINES: Record<string, React.FC<any>> = {
  HwWordPop,
  HwZoomSlideshow,
  HwBloodPromo,
  HwSplitPanels,
  HwBloodTitle,
  HwCameraShake,
  HwDropBounce,
  HwZoomPunch,
  HwSubscribeLikeBell,
};

/** engine component name -> its sound-placement helper */
export const HW_SOUNDS: Record<string, (o: any) => HwSoundCue[]> = {
  HwWordPop: hwWordPopSounds,
  HwZoomSlideshow: hwZoomSlideshowSounds,
  HwBloodPromo: hwBloodPromoSounds,
  HwSplitPanels: hwSplitPanelsSounds,
  HwBloodTitle: hwBloodTitleSounds,
  HwCameraShake: hwCameraShakeSounds,
  HwDropBounce: hwDropBounceSounds,
  HwZoomPunch: hwZoomPunchSounds,
  HwSubscribeLikeBell: hwSubscribeLikeBellSounds,
};

type Row = { engine?: string; [k: string]: unknown };
const devices = (library as unknown as { devices: Record<string, Row | string> }).devices;

/** "halloween-2022/HwWordPop.tsx" -> "HwWordPop" */
const engineName = (id: string) => {
  const r = devices[id];
  return typeof r === 'object' && r.engine ? r.engine.replace(/^.*\//, '').replace(/\.tsx?$/, '') : undefined;
};

/** device id -> its engine component (undefined for a row without one, e.g. the documentation-only hw-keyed-presenter) */
export const hwEngineFor = (id: string): React.FC<any> | undefined => {
  const n = engineName(id);
  return n ? HW_ENGINES[n] : undefined;
};

/** device id -> its sound helper */
export const hwSoundsFor = (id: string) => {
  const n = engineName(id);
  return n ? HW_SOUNDS[n] : undefined;
};

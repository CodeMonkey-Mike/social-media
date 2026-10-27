// registry.ts: the bridge between the EFFECTS catalog (video-creation/assets/effects/library.json, the single source of
// truth) and the engines, the way src/transitions/registry.ts binds assets/transitions/library.json. A device row names
// its engine file ("engine": "kinetic-text/KtSidePanel.tsx"); ENGINES maps that component name to the code; the sound
// ids a device names resolve to files through the SFX catalog (sfx.ts: ktSfxFile, ktSfxAttack).
import React from 'react';
import library from '../../../../assets/effects/library.json';
import { KtHeadlineOverBroll, ktHeadlineOverBrollSounds } from './KtHeadlineOverBroll';
import { KtIconPop, ktIconPopSounds } from './KtIconPop';
import { KtKeywordPop, ktKeywordPopSounds } from './KtKeywordPop';
import { KtListCard, ktListCardSounds } from './KtListCard';
import { KtLowerThirdBand, ktLowerThirdBandSounds } from './KtLowerThirdBand';
import { KtScatterWords, ktScatterWordsSounds } from './KtScatterWords';
import { KtSidePanel, ktSidePanelSounds } from './KtSidePanel';
import { KtSubscribeClose, ktSubscribeCloseSounds } from './KtSubscribeClose';
import { KtWhipCut, ktWhipCutSounds } from './KtWhipCut';
import { KtWordByWord, ktWordByWordSounds } from './KtWordByWord';

/** A device row of the effects catalog (the fields the code reads; the rest is the spec for humans). */
export type EffectDeviceRow = {
  name: string;
  trigger: string;
  engine?: string;
  motion?: Record<string, unknown>;
  sound?: { id: string | null; when: string }[];
  sound_by_meaning?: { id: string; meaning: string; when: string }[];
  assets?: Record<string, string>;
  [k: string]: unknown;
};

/** engine component name (as written in library.json, without folder / extension) -> component */
export const ENGINES: Record<string, React.FC<any>> = {
  KtSidePanel,
  KtKeywordPop,
  KtHeadlineOverBroll,
  KtWordByWord,
  KtLowerThirdBand,
  KtWhipCut,
  KtListCard,
  KtIconPop,
  KtSubscribeClose,
  KtScatterWords,
};

/** engine component name -> its sound-placement helper (the device's motion + sound pairing in code) */
export const SOUNDS: Record<string, (o: any) => { id: string; at: number; trimIn?: number; dur?: number; note?: string }[]> = {
  KtSidePanel: ktSidePanelSounds,
  KtKeywordPop: ktKeywordPopSounds,
  KtHeadlineOverBroll: ktHeadlineOverBrollSounds,
  KtWordByWord: ktWordByWordSounds,
  KtLowerThirdBand: ktLowerThirdBandSounds,
  KtWhipCut: ktWhipCutSounds,
  KtListCard: ktListCardSounds,
  KtIconPop: ktIconPopSounds,
  KtSubscribeClose: ktSubscribeCloseSounds,
  KtScatterWords: ktScatterWordsSounds,
};

const devices = (library as unknown as { devices: Record<string, EffectDeviceRow | string> }).devices;

/** every device row keyed by id (the "$doc" entry dropped) */
export const EFFECT_DEVICES: Record<string, EffectDeviceRow> = Object.fromEntries(
  Object.entries(devices).filter(([k, v]) => !k.startsWith('$') && typeof v === 'object'),
) as Record<string, EffectDeviceRow>;

export const getDevice = (id: string): EffectDeviceRow | undefined => EFFECT_DEVICES[id];

/** "kinetic-text/KtSidePanel.tsx" -> "KtSidePanel" */
export const engineName = (row: EffectDeviceRow | undefined) => (row?.engine ? row.engine.replace(/^.*\//, '').replace(/\.tsx?$/, '') : undefined);

/** device id -> its engine component (undefined until the row names an engine) */
export const engineFor = (id: string): React.FC<any> | undefined => {
  const n = engineName(getDevice(id));
  return n ? ENGINES[n] : undefined;
};

/** device id -> its sound helper */
export const soundsFor = (id: string) => {
  const n = engineName(getDevice(id));
  return n ? SOUNDS[n] : undefined;
};

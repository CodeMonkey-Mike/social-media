import React from 'react';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  EJ6_FPS, EJ6_DURATION, EJ6_SEAM, EJ6_CAP_Y, EJ6_ACCENT,
  CLIP_EJ6, THUMB_DEF_EJ6, BROLL_EJ6, OVERLAYS_EJ6, BADGES_EJ6, SFX_EJ6,
} from './constants-aliens-every-job-at-risk-own-assets-impact';
import { CAPTIONS_EJ6 } from './captionsAliensEveryJobImpact';

// batch aliens / clip #6 "It Is Going to Be Illegal for Humans to Drive" (IMPACT). Thin data wrapper over LivestreamShort.
const DATA: ShortData = {
  clip: CLIP_EJ6,
  fps: EJ6_FPS,
  durationS: EJ6_DURATION / EJ6_FPS,
  capY: EJ6_CAP_Y,
  seam: EJ6_SEAM,
  accent: EJ6_ACCENT,
  captions: CAPTIONS_EJ6,
  broll: BROLL_EJ6,
  overlays: OVERLAYS_EJ6,
  badges: BADGES_EJ6,
  sounds: SFX_EJ6,
  thumb: THUMB_DEF_EJ6, // ONE frame cover
};

export const AliensEveryJobImpact: React.FC = () => <LivestreamShort data={DATA} />;
export { EJ6_FPS, EJ6_DURATION };

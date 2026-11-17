import React from 'react';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  PCH3_FPS, PCH3_DURATION, PCH3_SEAM, PCH3_CAP_Y, PCH3_ACCENT,
  CLIP_PCH3, THUMB_DEF_PCH3, BROLL_PCH3, OVERLAYS_PCH3, BADGES_PCH3, SFX_PCH3,
} from './constants-peach-kaspa-things-are-gonna-pop';
import { CAPTIONS_PCH3 } from './captionsPeachKaspaThingsPop';

// batch peach / clip #3 "They Are Getting Ready for Something on Kaspa" (FULL). Thin data wrapper over LivestreamShort.
const DATA: ShortData = {
  clip: CLIP_PCH3,
  fps: PCH3_FPS,
  durationS: PCH3_DURATION / PCH3_FPS,
  capY: PCH3_CAP_Y,
  seam: PCH3_SEAM,
  accent: PCH3_ACCENT,
  captions: CAPTIONS_PCH3,
  broll: BROLL_PCH3,
  overlays: OVERLAYS_PCH3,
  badges: BADGES_PCH3,
  sounds: SFX_PCH3,
  thumb: THUMB_DEF_PCH3, // ONE frame cover, base from frame 1
};

export const PeachKaspaThingsPop: React.FC = () => <LivestreamShort data={DATA} />;
export { PCH3_FPS, PCH3_DURATION };

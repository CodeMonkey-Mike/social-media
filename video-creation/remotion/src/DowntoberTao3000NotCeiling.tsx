import React from 'react';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  DT2_FPS, DT2_DURATION, DT2_SEAM, DT2_CAP_Y, DT2_ACCENT,
  CLIP_DT2, THUMB_DEF_DT2, BROLL_DT2, OVERLAYS_DT2, BADGES_DT2, SFX_DT2,
} from './constants-downtober-tao-3000-is-not-the-ceiling';
import { CAPTIONS_DT2 } from './captionsDowntoberTao3000NotCeiling';

// batch downtober / clip #2 "TAO to 3000? That Is Not the Ceiling" (FULL). Thin data wrapper over LivestreamShort.
const DATA: ShortData = {
  clip: CLIP_DT2,
  fps: DT2_FPS,
  durationS: DT2_DURATION / DT2_FPS,
  capY: DT2_CAP_Y,
  seam: DT2_SEAM,
  accent: DT2_ACCENT,
  captions: CAPTIONS_DT2,
  broll: BROLL_DT2,
  overlays: OVERLAYS_DT2,
  badges: BADGES_DT2,
  sounds: SFX_DT2,
  thumb: THUMB_DEF_DT2, // ONE frame cover, base from frame 1
};

export const DowntoberTao3000NotCeiling: React.FC = () => <LivestreamShort data={DATA} />;
export { DT2_FPS, DT2_DURATION };

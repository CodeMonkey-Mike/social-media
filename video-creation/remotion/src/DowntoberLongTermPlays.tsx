import React from 'react';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  DT3_FPS, DT3_DURATION, DT3_SEAM, DT3_CAP_Y, DT3_ACCENT,
  CLIP_DT3, THUMB_DEF_DT3, BROLL_DT3, OVERLAYS_DT3, BADGES_DT3, SFX_DT3,
} from './constants-downtober-long-term-plays-58x-350x';
import { CAPTIONS_DT3 } from './captionsDowntoberLongTermPlays';

// batch downtober / clip #3 "58x on Velvet, 350x on LAB: Long Term Plays Only" (FULL). Thin data wrapper over LivestreamShort.
const DATA: ShortData = {
  clip: CLIP_DT3,
  fps: DT3_FPS,
  durationS: DT3_DURATION / DT3_FPS,
  capY: DT3_CAP_Y,
  seam: DT3_SEAM,
  accent: DT3_ACCENT,
  captions: CAPTIONS_DT3,
  broll: BROLL_DT3,
  overlays: OVERLAYS_DT3,
  badges: BADGES_DT3,
  sounds: SFX_DT3,
  thumb: THUMB_DEF_DT3, // ONE frame cover, base from frame 1
};

export const DowntoberLongTermPlays: React.FC = () => <LivestreamShort data={DATA} />;
export { DT3_FPS, DT3_DURATION };

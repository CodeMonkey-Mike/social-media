import React from 'react';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  PCH4_FPS, PCH4_DURATION, PCH4_SEAM, PCH4_CAP_Y, PCH4_ACCENT,
  CLIP_PCH4, THUMB_DEF_PCH4, BROLL_PCH4, OVERLAYS_PCH4, BADGES_PCH4, SFX_PCH4,
} from './constants-peach-jct-6x-back-at-its-low';
import { CAPTIONS_PCH4 } from './captionsPeachJct6xLow';

// batch peach / clip #4 "JCT Did a 6x Overnight. Now It's Back at Its Low" (FULL). Thin data wrapper over LivestreamShort.
const DATA: ShortData = {
  clip: CLIP_PCH4,
  fps: PCH4_FPS,
  durationS: PCH4_DURATION / PCH4_FPS,
  capY: PCH4_CAP_Y,
  seam: PCH4_SEAM,
  accent: PCH4_ACCENT,
  captions: CAPTIONS_PCH4,
  broll: BROLL_PCH4,
  overlays: OVERLAYS_PCH4,
  badges: BADGES_PCH4,
  sounds: SFX_PCH4,
  thumb: THUMB_DEF_PCH4, // ONE frame cover, base from frame 1
};

export const PeachJct6xLow: React.FC = () => <LivestreamShort data={DATA} />;
export { PCH4_FPS, PCH4_DURATION };

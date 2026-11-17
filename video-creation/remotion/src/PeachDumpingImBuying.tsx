import React from 'react';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  PCH5_FPS, PCH5_DURATION, PCH5_SEAM, PCH5_CAP_Y, PCH5_ACCENT,
  CLIP_PCH5, THUMB_DEF_PCH5, BROLL_PCH5, OVERLAYS_PCH5, BADGES_PCH5, SFX_PCH5,
} from './constants-peach-dumping-and-im-buying';
import { CAPTIONS_PCH5 } from './captionsPeachDumpingImBuying';

// batch peach / clip #5 "We've Been Dumping and I've Been Buying" (FULL). Thin data wrapper over LivestreamShort.
const DATA: ShortData = {
  clip: CLIP_PCH5,
  fps: PCH5_FPS,
  durationS: PCH5_DURATION / PCH5_FPS,
  capY: PCH5_CAP_Y,
  seam: PCH5_SEAM,
  accent: PCH5_ACCENT,
  captions: CAPTIONS_PCH5,
  broll: BROLL_PCH5,
  overlays: OVERLAYS_PCH5,
  badges: BADGES_PCH5,
  sounds: SFX_PCH5,
  thumb: THUMB_DEF_PCH5, // ONE frame cover, base from frame 1
};

export const PeachDumpingImBuying: React.FC = () => <LivestreamShort data={DATA} />;
export { PCH5_FPS, PCH5_DURATION };

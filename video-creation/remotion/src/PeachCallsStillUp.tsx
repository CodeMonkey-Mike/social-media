import React from 'react';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  PCH2_FPS, PCH2_DURATION, PCH2_SEAM, PCH2_CAP_Y, PCH2_ACCENT,
  CLIP_PCH2, THUMB_DEF_PCH2, BROLL_PCH2, OVERLAYS_PCH2, BADGES_PCH2, SFX_PCH2,
} from './constants-peach-calls-still-up-after-the-dump';
import { CAPTIONS_PCH2 } from './captionsPeachCallsStillUp';

// batch peach / clip #2 "Everything Is Low Right Now. These Calls Are Still Up" (FULL). Thin data wrapper over LivestreamShort.
const DATA: ShortData = {
  clip: CLIP_PCH2,
  fps: PCH2_FPS,
  durationS: PCH2_DURATION / PCH2_FPS,
  capY: PCH2_CAP_Y,
  seam: PCH2_SEAM,
  accent: PCH2_ACCENT,
  captions: CAPTIONS_PCH2,
  broll: BROLL_PCH2,
  overlays: OVERLAYS_PCH2,
  badges: BADGES_PCH2,
  sounds: SFX_PCH2,
  thumb: THUMB_DEF_PCH2, // ONE frame cover, base from frame 1
};

export const PeachCallsStillUp: React.FC = () => <LivestreamShort data={DATA} />;
export { PCH2_FPS, PCH2_DURATION };

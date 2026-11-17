import React from 'react';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  PCH1_FPS, PCH1_DURATION, PCH1_SEAM, PCH1_CAP_Y, PCH1_ACCENT,
  CLIP_PCH1, THUMB_DEF_PCH1, BROLL_PCH1, OVERLAYS_PCH1, BADGES_PCH1, SFX_PCH1,
} from './constants-peach-pengu-flips-pepe';
import { CAPTIONS_PCH1 } from './captionsPeachPenguFlipsPepe';

// batch peach / clip #1 "Pengu Is Gonna Flip Pepe. I Bought More at 300 Million" (FULL). Thin data wrapper over LivestreamShort.
const DATA: ShortData = {
  clip: CLIP_PCH1,
  fps: PCH1_FPS,
  durationS: PCH1_DURATION / PCH1_FPS,
  capY: PCH1_CAP_Y,
  seam: PCH1_SEAM,
  accent: PCH1_ACCENT,
  captions: CAPTIONS_PCH1,
  broll: BROLL_PCH1,
  overlays: OVERLAYS_PCH1,
  badges: BADGES_PCH1,
  sounds: SFX_PCH1,
  thumb: THUMB_DEF_PCH1, // ONE frame cover, base from frame 1
};

export const PeachPenguFlipsPepe: React.FC = () => <LivestreamShort data={DATA} />;
export { PCH1_FPS, PCH1_DURATION };

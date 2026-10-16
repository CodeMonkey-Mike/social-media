import React from 'react';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  AL2_FPS, AL2_DURATION, AL2_SEAM, AL2_CAP_Y, AL2_ACCENT,
  CLIP_AL2, THUMB_DEF_AL2, BROLL_AL2, OVERLAYS_AL2, BADGES_AL2, SFX_AL2,
} from './constants-aliens-tao-no-better-ai-play';
import { CAPTIONS_AL2 } from './captionsAliensTaoNoBetterAiPlay';

// batch aliens / clip #2 "There Is No Better AI Play Than TAO" (FULL). Thin data wrapper over LivestreamShort.
const DATA: ShortData = {
  clip: CLIP_AL2,
  fps: AL2_FPS,
  durationS: AL2_DURATION / AL2_FPS,
  capY: AL2_CAP_Y,
  seam: AL2_SEAM,
  accent: AL2_ACCENT,
  captions: CAPTIONS_AL2,
  broll: BROLL_AL2,
  overlays: OVERLAYS_AL2,
  badges: BADGES_AL2,
  sounds: SFX_AL2,
  thumb: THUMB_DEF_AL2, // ONE frame cover, base from frame 1
};

export const AliensTaoNoBetterAiPlay: React.FC = () => <LivestreamShort data={DATA} />;
export { AL2_FPS, AL2_DURATION };

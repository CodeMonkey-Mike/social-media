import React from 'react';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  PCH6_FPS, PCH6_DURATION, PCH6_SEAM, PCH6_CAP_Y, PCH6_ACCENT,
  CLIP_PCH6, THUMB_DEF_PCH6, BROLL_PCH6, OVERLAYS_PCH6, BADGES_PCH6, SFX_PCH6,
} from './constants-peach-pengu-flips-pepe-impact';
import { CAPTIONS_PCH6 } from './captionsPeachPenguImpact';

// batch peach / clip #6 "Pengu to 30 Billion? I'm Really Serious" (IMPACT). Thin data wrapper over LivestreamShort.
const DATA: ShortData = {
  clip: CLIP_PCH6,
  fps: PCH6_FPS,
  durationS: PCH6_DURATION / PCH6_FPS,
  capY: PCH6_CAP_Y,
  seam: PCH6_SEAM,
  accent: PCH6_ACCENT,
  captions: CAPTIONS_PCH6,
  broll: BROLL_PCH6,
  overlays: OVERLAYS_PCH6,
  badges: BADGES_PCH6,
  sounds: SFX_PCH6,
  thumb: THUMB_DEF_PCH6, // ONE frame cover, base from frame 1
};

export const PeachPenguImpact: React.FC = () => <LivestreamShort data={DATA} />;
export { PCH6_FPS, PCH6_DURATION };

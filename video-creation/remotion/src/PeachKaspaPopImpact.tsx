import React from 'react';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  PCH7_FPS, PCH7_DURATION, PCH7_SEAM, PCH7_CAP_Y, PCH7_ACCENT,
  CLIP_PCH7, THUMB_DEF_PCH7, BROLL_PCH7, OVERLAYS_PCH7, BADGES_PCH7, SFX_PCH7,
} from './constants-peach-kaspa-things-are-gonna-pop-impact';
import { CAPTIONS_PCH7 } from './captionsPeachKaspaPopImpact';

// batch peach / clip #7 "There's a Bright Future for Kaspa. Just a Lot of Pain Right Now" (IMPACT). Thin data wrapper over LivestreamShort.
const DATA: ShortData = {
  clip: CLIP_PCH7,
  fps: PCH7_FPS,
  durationS: PCH7_DURATION / PCH7_FPS,
  capY: PCH7_CAP_Y,
  seam: PCH7_SEAM,
  accent: PCH7_ACCENT,
  captions: CAPTIONS_PCH7,
  broll: BROLL_PCH7,
  overlays: OVERLAYS_PCH7,
  badges: BADGES_PCH7,
  sounds: SFX_PCH7,
  thumb: THUMB_DEF_PCH7, // ONE frame cover, base from frame 1
};

export const PeachKaspaPopImpact: React.FC = () => <LivestreamShort data={DATA} />;
export { PCH7_FPS, PCH7_DURATION };

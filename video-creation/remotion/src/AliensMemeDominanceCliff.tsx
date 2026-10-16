import React from 'react';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  AL3_FPS, AL3_DURATION, AL3_SEAM, AL3_CAP_Y, AL3_ACCENT,
  CLIP_AL3, THUMB_DEF_AL3, BROLL_AL3, OVERLAYS_AL3, BADGES_AL3, SFX_AL3,
} from './constants-aliens-meme-dominance-off-a-cliff';
import { CAPTIONS_AL3 } from './captionsAliensMemeDominanceCliff';

// batch aliens / clip #3 "Nobody Wants Memes Anymore" meme-dominance-off-a-cliff (FULL). Thin data wrapper over LivestreamShort.
const DATA: ShortData = {
  clip: CLIP_AL3,
  fps: AL3_FPS,
  durationS: AL3_DURATION / AL3_FPS,
  capY: AL3_CAP_Y,
  seam: AL3_SEAM,
  accent: AL3_ACCENT,
  captions: CAPTIONS_AL3,
  broll: BROLL_AL3,
  overlays: OVERLAYS_AL3,
  badges: BADGES_AL3,
  sounds: SFX_AL3,
  thumb: THUMB_DEF_AL3, // ONE frame cover, base from frame 1
};

export const AliensMemeDominanceCliff: React.FC = () => <LivestreamShort data={DATA} />;
export { AL3_FPS, AL3_DURATION };

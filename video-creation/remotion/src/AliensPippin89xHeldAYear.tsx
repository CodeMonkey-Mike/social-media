import React from 'react';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  AL4_FPS, AL4_DURATION, AL4_SEAM, AL4_CAP_Y, AL4_ACCENT,
  CLIP_AL4, THUMB_DEF_AL4, BROLL_AL4, OVERLAYS_AL4, BADGES_AL4, SFX_AL4,
} from './constants-aliens-pippin-89x-held-a-year';
// Captions = canonical captions skill output off shorts/aliens/pippin-89x-held-a-year/whisper-words-verified.json.
import { CAPTIONS_AL4 } from './captionsAliensPippin89xHeldAYear';

// batch aliens / clip #4 "I Held Pippin a Full Year and It Paid an 89x" (FULL). Thin data wrapper over LivestreamShort.
const DATA: ShortData = {
  clip: CLIP_AL4,
  fps: AL4_FPS,
  durationS: AL4_DURATION / AL4_FPS,
  capY: AL4_CAP_Y,
  seam: AL4_SEAM,
  accent: AL4_ACCENT,
  captions: CAPTIONS_AL4,
  broll: BROLL_AL4,
  overlays: OVERLAYS_AL4,
  badges: BADGES_AL4,
  sounds: SFX_AL4,
  thumb: THUMB_DEF_AL4, // ONE frame cover
};

export const AliensPippin89xHeldAYear: React.FC = () => <LivestreamShort data={DATA} />;
export { AL4_FPS, AL4_DURATION };

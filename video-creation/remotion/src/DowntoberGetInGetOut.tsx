import React from 'react';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  DT4_FPS, DT4_DURATION, DT4_SEAM, DT4_CAP_Y, DT4_ACCENT,
  CLIP_DT4, THUMB_DEF_DT4, BROLL_DT4, OVERLAYS_DT4, BADGES_DT4, SFX_DT4,
} from './constants-downtober-get-in-make-money-get-out';
// Captions = canonical captions skill output off shorts/downtober/get-in-make-money-get-out/whisper-words-verified.json.
import { CAPTIONS_DT4 } from './captionsDowntoberGetInGetOut';

// batch downtober / clip #4 "Got In, Made Money, Got Out. That Is Not a Scam" (FULL).
// Thin data wrapper over the shared b-roll-capable LivestreamShort (BrollLayer + overlays + badges + captions + SFX).
const DATA: ShortData = {
  clip: CLIP_DT4,
  fps: DT4_FPS,
  durationS: DT4_DURATION / DT4_FPS,
  capY: DT4_CAP_Y,
  seam: DT4_SEAM,
  accent: DT4_ACCENT,
  captions: CAPTIONS_DT4,
  broll: BROLL_DT4,
  overlays: OVERLAYS_DT4,
  badges: BADGES_DT4,
  sounds: SFX_DT4,
  thumb: THUMB_DEF_DT4, // ONE frame cover
};

export const DowntoberGetInGetOut: React.FC = () => <LivestreamShort data={DATA} />;
export { DT4_FPS, DT4_DURATION };

import React from 'react';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  EJ1_FPS, EJ1_DURATION, EJ1_SEAM, EJ1_CAP_Y, EJ1_ACCENT,
  CLIP_EJ1, THUMB_DEF_EJ1, BROLL_EJ1, OVERLAYS_EJ1, BADGES_EJ1, SFX_EJ1,
} from './constants-aliens-every-job-at-risk-own-assets';
// Captions = canonical captions skill output (build_captions.py --style montserrat --max-secs 1.6) off
// shorts/aliens/every-job-at-risk-own-assets/whisper-words-verified.json ("a job in electrician" -> "a job of an
// electrician", 2/2 medium.en windows).
import { CAPTIONS_EJ1 } from './captionsAliensEveryJobOwnAssets';

// batch aliens / clip #1 "Every Goddamn Job Is at Risk, Get In Now" (FULL). Thin data wrapper over LivestreamShort.
const DATA: ShortData = {
  clip: CLIP_EJ1,
  fps: EJ1_FPS,
  durationS: EJ1_DURATION / EJ1_FPS,
  capY: EJ1_CAP_Y,
  seam: EJ1_SEAM,
  accent: EJ1_ACCENT,
  captions: CAPTIONS_EJ1,
  broll: BROLL_EJ1,
  overlays: OVERLAYS_EJ1,
  badges: BADGES_EJ1,
  sounds: SFX_EJ1,
  thumb: THUMB_DEF_EJ1, // ONE frame cover
};

export const AliensEveryJobOwnAssets: React.FC = () => <LivestreamShort data={DATA} />;
export { EJ1_FPS, EJ1_DURATION };

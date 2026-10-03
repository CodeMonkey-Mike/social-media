import React from 'react';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  NJ3_FPS, NJ3_DURATION, NJ3_SEAM, NJ3_CAP_Y, NJ3_ACCENT,
  CLIP_NJ3, THUMB_DEF_NJ3, BROLL_NJ3, OVERLAYS_NJ3, BADGES_NJ3, SFX_NJ3,
} from './constants-uptober-no-job-is-safe-robots';
// Captions come from the CANONICAL captions skill output for this clip (never hand-authored). The exact
// rebuild invocation and the whisper-words-verified.json provenance live in the header of
// captionsUptoberNoJobSafe.ts.
import { CAPTIONS_NJ3 } from './captionsUptoberNoJobSafe';

// batch uptober / clip #3 "No Job Is Safe Once You Have a Robot in Your House" (FULL).
// Thin data wrapper over the shared LivestreamShort renderer (base video, BrollLayer with 3 full-screen
// moments + 1 content-zone cutaway, 1 alpha overlay, caption band, frame-0 cover, 5 code-drawn badges,
// SFX sequences). Everything clip-specific lives in constants-uptober-no-job-is-safe-robots.ts.
const DATA: ShortData = {
  clip: CLIP_NJ3,
  fps: NJ3_FPS,
  durationS: NJ3_DURATION / NJ3_FPS,
  capY: NJ3_CAP_Y,
  seam: NJ3_SEAM,
  accent: NJ3_ACCENT,
  captions: CAPTIONS_NJ3,
  broll: BROLL_NJ3,
  overlays: OVERLAYS_NJ3,
  badges: BADGES_NJ3,
  sounds: SFX_NJ3,
  thumb: THUMB_DEF_NJ3, // durS omitted => ONE frame (frame-0 cover), base video from frame 1
};

export const UptoberNoJobSafe: React.FC = () => <LivestreamShort data={DATA} />;
export { NJ3_FPS, NJ3_DURATION };

import React from 'react';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  NJ7_FPS, NJ7_DURATION, NJ7_SEAM, NJ7_CAP_Y, NJ7_ACCENT,
  CLIP_NJ7, THUMB_DEF_NJ7, BROLL_NJ7, OVERLAYS_NJ7, BADGES_NJ7, SFX_NJ7,
} from './constants-uptober-no-job-is-safe-robots-impact';
// Captions come from the CANONICAL captions skill output for this clip (never hand-authored). The exact
// rebuild invocation and the whisper-words-verified.json provenance live in the header of
// captionsUptoberNoJobSafeImpact.ts.
import { CAPTIONS_NJ7 } from './captionsUptoberNoJobSafeImpact';

// batch uptober / clip #7 "Your Robot Is Your Security Guard" (IMPACT variant of clip #3's topic).
// Thin data wrapper over the shared LivestreamShort renderer (base video, BrollLayer with 2 full-screen
// moments + 1 content-zone cutaway, 1 alpha overlay, caption band, frame-0 cover, 6 code-drawn badges,
// SFX sequences). Everything clip-specific lives in constants-uptober-no-job-is-safe-robots-impact.ts.
const DATA: ShortData = {
  clip: CLIP_NJ7,
  fps: NJ7_FPS,
  durationS: NJ7_DURATION / NJ7_FPS,
  capY: NJ7_CAP_Y,
  seam: NJ7_SEAM,
  accent: NJ7_ACCENT,
  captions: CAPTIONS_NJ7,
  broll: BROLL_NJ7,
  overlays: OVERLAYS_NJ7,
  badges: BADGES_NJ7,
  sounds: SFX_NJ7,
  thumb: THUMB_DEF_NJ7, // durS omitted => ONE frame (frame-0 cover), base video from frame 1
};

export const UptoberNoJobSafeImpact: React.FC = () => <LivestreamShort data={DATA} />;
export { NJ7_FPS, NJ7_DURATION };

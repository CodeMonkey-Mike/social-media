import React from 'react';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  PIP2_FPS, PIP2_DURATION, PIP2_SEAM, PIP2_CAP_Y, PIP2_ACCENT,
  CLIP_PIP2, THUMB_DEF_PIP2, BROLL_PIP2, OVERLAYS_PIP2, BADGES_PIP2, SFX_PIP2,
} from './constants-uptober-pippin-went-dead-then-89x';
// Captions come from the CANONICAL captions skill output for this clip (never hand-authored). The exact
// rebuild invocation and the whisper-words-verified.json provenance live in the header of
// captionsUptoberPippin89x.ts.
import { CAPTIONS_PIP2 } from './captionsUptoberPippin89x';

// batch uptober / clip #2 "Pippin Went Dead, Then It Did an 89x" (FULL).
// Thin data wrapper over the shared LivestreamShort renderer (base video, BrollLayer with 2 full-screen
// moments + 2 content-zone cutaways, 1 alpha overlay, caption band, frame-0 cover, 4 code-drawn badges,
// SFX sequences). Everything clip-specific lives in constants-uptober-pippin-went-dead-then-89x.ts.
const DATA: ShortData = {
  clip: CLIP_PIP2,
  fps: PIP2_FPS,
  durationS: PIP2_DURATION / PIP2_FPS,
  capY: PIP2_CAP_Y,
  seam: PIP2_SEAM,
  accent: PIP2_ACCENT,
  captions: CAPTIONS_PIP2,
  broll: BROLL_PIP2,
  overlays: OVERLAYS_PIP2,
  badges: BADGES_PIP2,
  sounds: SFX_PIP2,
  thumb: THUMB_DEF_PIP2, // durS omitted => ONE frame (frame-0 cover), base video from frame 1
};

export const UptoberPippin89x: React.FC = () => <LivestreamShort data={DATA} />;
export { PIP2_FPS, PIP2_DURATION };

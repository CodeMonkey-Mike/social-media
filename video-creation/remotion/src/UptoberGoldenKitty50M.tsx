import React from 'react';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  GK5_FPS, GK5_DURATION, GK5_SEAM, GK5_CAP_Y, GK5_ACCENT,
  CLIP_GK5, THUMB_DEF_GK5, BROLL_GK5, OVERLAYS_GK5, BADGES_GK5, SFX_GK5,
} from './constants-uptober-golden-kitty-50-million';
// Captions come from the CANONICAL captions skill output for this clip (never hand-authored). The exact
// rebuild invocation and the whisper-words-verified.json provenance live in the header of
// captionsUptoberGoldenKitty50M.ts.
import { CAPTIONS_GK5 } from './captionsUptoberGoldenKitty50M';

// batch uptober / clip #5 "Golden Kitty Should Totally Go Up, Here Is Why" (FULL).
// Thin data wrapper over the shared LivestreamShort renderer (base video, BrollLayer with 2 full-screen
// moments + 2 content-zone cutaways, 1 alpha overlay, caption band, frame-0 cover, 5 code-drawn badges,
// SFX sequences). Everything clip-specific lives in constants-uptober-golden-kitty-50-million.ts.
const DATA: ShortData = {
  clip: CLIP_GK5,
  fps: GK5_FPS,
  durationS: GK5_DURATION / GK5_FPS,
  capY: GK5_CAP_Y,
  seam: GK5_SEAM,
  accent: GK5_ACCENT,
  captions: CAPTIONS_GK5,
  broll: BROLL_GK5,
  overlays: OVERLAYS_GK5,
  badges: BADGES_GK5,
  sounds: SFX_GK5,
  thumb: THUMB_DEF_GK5, // durS omitted => ONE frame (frame-0 cover), base video from frame 1
};

export const UptoberGoldenKitty50M: React.FC = () => <LivestreamShort data={DATA} />;
export { GK5_FPS, GK5_DURATION };

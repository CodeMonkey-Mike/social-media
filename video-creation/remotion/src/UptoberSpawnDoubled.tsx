import React from 'react';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  UPT1_FPS, UPT1_DURATION, UPT1_SEAM, UPT1_CAP_Y, UPT1_ACCENT,
  CLIP_UPT1, THUMB_DEF_UPT1, BROLL_UPT1, OVERLAYS_UPT1, BADGES_UPT1, SFX_UPT1,
} from './constants-uptober-spawn-doubled-for-the-haters';
// Captions come from the CANONICAL captions skill output for this clip (never hand-authored). The exact
// rebuild invocation and the whisper-words-verified.json provenance live in the header of
// captionsUptoberSpawnDoubled.ts.
import { CAPTIONS_UPT1 } from './captionsUptoberSpawnDoubled';

// batch uptober / clip #1 "Dedicated to the Haters: Spawn Doubled in a Day" (FULL).
// Thin data wrapper over the shared LivestreamShort renderer (base video, BrollLayer with 2 full-screen
// moments + 3 content-zone cutaways, 1 alpha overlay, caption band, frame-0 cover, 6 code-drawn badges,
// SFX sequences). Everything clip-specific lives in constants-uptober-spawn-doubled-for-the-haters.ts.
//
// CAPTION BLANK (presentational, not a text edit): 19.26-20.84 is a 1.58 s pause after "guacamole."; without
// an empty entry the word would sit on screen through the silence. LivestreamShort renders nothing for an
// empty caption string.
const CAPTIONS = [...CAPTIONS_UPT1, { t: 19.70, h: '' }].sort((a, b) => a.t - b.t);

const DATA: ShortData = {
  clip: CLIP_UPT1,
  fps: UPT1_FPS,
  durationS: UPT1_DURATION / UPT1_FPS,
  capY: UPT1_CAP_Y,
  seam: UPT1_SEAM,
  accent: UPT1_ACCENT,
  captions: CAPTIONS,
  broll: BROLL_UPT1,
  overlays: OVERLAYS_UPT1,
  badges: BADGES_UPT1,
  sounds: SFX_UPT1,
  thumb: THUMB_DEF_UPT1, // durS omitted => ONE frame (frame-0 cover), base video from frame 1
};

export const UptoberSpawnDoubled: React.FC = () => <LivestreamShort data={DATA} />;
export { UPT1_FPS, UPT1_DURATION };

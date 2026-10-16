import React from 'react';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  BT4_FPS, BT4_DURATION, BT4_SEAM, BT4_CAP_Y, BT4_ACCENT,
  CLIP_BT4, THUMB_DEF_BT4, BROLL_BT4, OVERLAYS_BT4, BADGES_BT4, SFX_BT4,
} from './constants-bull-trap-october-bottom-talk-is-gone';
// Captions come from the CANONICAL captions skill output for this clip (never hand-authored). The exact
// rebuild invocation and the whisper-words-verified.json provenance live in the header of
// captionsBullTrapOctoberBottomGone.ts.
import { CAPTIONS_BT4 } from './captionsBullTrapOctoberBottomGone';

// batch bull-trap / clip #4 "What Happened to All the October Bottom Talk?" (FULL).
// Thin data wrapper over the shared LivestreamShort renderer (base video, BrollLayer with 2 full-screen
// moments + 2 content-zone cutaways, caption band, frame-0 cover, 5 code-drawn badges, SFX sequences).
// Everything clip-specific lives in constants-bull-trap-october-bottom-talk-is-gone.ts.
const DATA: ShortData = {
  clip: CLIP_BT4,
  fps: BT4_FPS,
  durationS: BT4_DURATION / BT4_FPS,
  capY: BT4_CAP_Y,
  seam: BT4_SEAM,
  accent: BT4_ACCENT,
  captions: CAPTIONS_BT4,
  broll: BROLL_BT4,
  overlays: OVERLAYS_BT4,
  badges: BADGES_BT4,
  sounds: SFX_BT4,
  thumb: THUMB_DEF_BT4, // durS omitted => ONE frame (frame-0 cover), base video from frame 1
};

export const BullTrapOctoberBottomGone: React.FC = () => <LivestreamShort data={DATA} />;
export { BT4_FPS, BT4_DURATION };

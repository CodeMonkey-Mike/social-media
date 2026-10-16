import React from 'react';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  BT3_FPS, BT3_DURATION, BT3_SEAM, BT3_CAP_Y, BT3_ACCENT,
  CLIP_BT3, THUMB_DEF_BT3, BROLL_BT3, OVERLAYS_BT3, BADGES_BT3, SFX_BT3,
} from './constants-bull-trap-spon-didnt-sell-holding-the-line';
// Captions come from the CANONICAL captions skill output for this clip (never hand-authored). The exact
// rebuild invocation and the whisper-words-verified.json provenance live in the header of
// captionsBullTrapSponDidntSell.ts.
import { CAPTIONS_BT3 } from './captionsBullTrapSponDidntSell';

// batch bull-trap / clip #3 "I Didn't Sell SPON. I'm Still Holding the Line." (FULL).
// Thin data wrapper over the shared LivestreamShort renderer (base video, BrollLayer with 2 full-screen
// moments + 3 content-zone cutaways, 1 alpha overlay, caption band, frame-0 cover, 6 code-drawn badges,
// SFX sequences). Everything clip-specific lives in constants-bull-trap-spon-didnt-sell-holding-the-line.ts.
const DATA: ShortData = {
  clip: CLIP_BT3,
  fps: BT3_FPS,
  durationS: BT3_DURATION / BT3_FPS,
  capY: BT3_CAP_Y,
  seam: BT3_SEAM,
  accent: BT3_ACCENT,
  captions: CAPTIONS_BT3,
  broll: BROLL_BT3,
  overlays: OVERLAYS_BT3,
  badges: BADGES_BT3,
  sounds: SFX_BT3,
  thumb: THUMB_DEF_BT3, // durS omitted => ONE frame (frame-0 cover), base video from frame 1
};

export const BullTrapSponDidntSell: React.FC = () => <LivestreamShort data={DATA} />;
export { BT3_FPS, BT3_DURATION };

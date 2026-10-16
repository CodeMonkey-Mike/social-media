import React from 'react';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  BT2_FPS, BT2_DURATION, BT2_SEAM, BT2_CAP_Y, BT2_ACCENT,
  CLIP_BT2, THUMB_DEF_BT2, REDACT_BT2, BROLL_BT2, OVERLAYS_BT2, BADGES_BT2, SFX_BT2,
} from './constants-bull-trap-golden-kitty-10-million';
// Captions come from the CANONICAL captions skill output for this clip (never hand-authored). The exact
// rebuild invocation and the whisper-words-verified.json provenance live in the header of
// captionsBullTrapGoldenKitty10M.ts.
import { CAPTIONS_BT2 } from './captionsBullTrapGoldenKitty10M';

// batch bull-trap / clip #2 "Golden Kitty Could Easily Make 10 Million While Everything Else Bleeds" (FULL).
// Thin data wrapper over the shared LivestreamShort renderer (base video, a redaction plate under the
// directive cover run, BrollLayer with 3 full-screens + 8 content-zone images, 1 alpha overlay, caption band,
// frame-0 cover, 4 code-drawn badges, SFX). Everything clip-specific lives in
// constants-bull-trap-golden-kitty-10-million.ts.
const DATA: ShortData = {
  clip: CLIP_BT2,
  fps: BT2_FPS,
  durationS: BT2_DURATION / BT2_FPS,
  capY: BT2_CAP_Y,
  seam: BT2_SEAM,
  accent: BT2_ACCENT,
  captions: CAPTIONS_BT2,
  broll: BROLL_BT2,
  redactions: REDACT_BT2,
  overlays: OVERLAYS_BT2,
  badges: BADGES_BT2,
  sounds: SFX_BT2,
  thumb: THUMB_DEF_BT2, // durS omitted => ONE frame (frame-0 cover), base video from frame 1
};

export const BullTrapGoldenKitty10M: React.FC = () => <LivestreamShort data={DATA} />;
export { BT2_FPS, BT2_DURATION };

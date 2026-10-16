import React from 'react';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  GK3_FPS, GK3_DURATION, GK3_SEAM, GK3_CAP_Y, GK3_ACCENT,
  CLIP_GK3, THUMB_DEF_GK3, BROLL_GK3, BADGES_GK3, SFX_GK3,
} from './constants-grapes-golden-kitty-one-of-five-impact';
// Captions come from the CANONICAL captions skill output for this clip (never hand-authored). The exact
// rebuild invocation and the whisper-words-verified.json provenance live in the header of
// captionsGrapesGoldenKittyOneOfFiveImpact.ts.
import { CAPTIONS_GK3 } from './captionsGrapesGoldenKittyOneOfFiveImpact';

// batch grapes / clip #3 "Golden Kitty Is a Golden Opportunity" (IMPACT).
// Thin data wrapper over the shared LivestreamShort renderer (base video, BrollLayer with 2 full-screens +
// 3 content-zone images, caption band, frame-0 cover, 3 code-drawn badges, SFX). Everything clip-specific
// lives in constants-grapes-golden-kitty-one-of-five-impact.ts.
const DATA: ShortData = {
  clip: CLIP_GK3,
  fps: GK3_FPS,
  durationS: GK3_DURATION / GK3_FPS,
  capY: GK3_CAP_Y,
  seam: GK3_SEAM,
  accent: GK3_ACCENT,
  captions: CAPTIONS_GK3,
  broll: BROLL_GK3,
  badges: BADGES_GK3,
  sounds: SFX_GK3,
  thumb: THUMB_DEF_GK3, // durS omitted => ONE frame (frame-0 cover), base video from frame 1
};

export const GrapesGoldenKittyOneOfFiveImpact: React.FC = () => <LivestreamShort data={DATA} />;
export { GK3_FPS, GK3_DURATION };

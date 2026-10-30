// 30x-tao clip 3 `hundred-dollars-a-week-to-350x`: "$100 a Week and One of Them Does a 350x"
// Batch 30x-tao (2026-10-28), comp id ThirtyXTaoHundredDollars350x. Built on the shared LivestreamShort
// (BrollLayer-bearing). Data: constants-30x-tao-hundred-dollars-a-week-to-350x.ts.
import React from 'react';
import { LivestreamShort } from './LivestreamShort';
import { CAPTIONS_XT3 } from './captionsThirtyXTaoHundredDollars350x';
import {
  XT3_FPS, XT3_DURATION_S, XT3_SEAM, XT3_CAP_Y, XT3_ACCENT, XT3_CLIP,
  XT3_BROLL, XT3_BADGES, XT3_OVERLAYS, XT3_REDACTIONS, XT3_SOUNDS, XT3_THUMB,
} from './constants-30x-tao-hundred-dollars-a-week-to-350x';

export { XT3_FPS, XT3_DURATION_FRAMES } from './constants-30x-tao-hundred-dollars-a-week-to-350x';

export const ThirtyXTaoHundredDollars350x: React.FC = () => (
  <LivestreamShort data={{
    clip: XT3_CLIP,
    fps: XT3_FPS,
    durationS: XT3_DURATION_S,
    capY: XT3_CAP_Y,
    seam: XT3_SEAM,
    accent: XT3_ACCENT,
    captions: CAPTIONS_XT3,
    broll: XT3_BROLL,
    badges: XT3_BADGES,
    overlays: XT3_OVERLAYS,
    redactions: XT3_REDACTIONS,
    sounds: XT3_SOUNDS,
    thumb: XT3_THUMB,
  }} />
);

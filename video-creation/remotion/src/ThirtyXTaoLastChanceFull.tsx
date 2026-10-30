// 30x-tao clip 2 `get-into-assets-now-last-chance` (FULL)
// Batch 30x-tao (2026-10-28), comp id ThirtyXTaoLastChanceFull. Built on the shared LivestreamShort
// (BrollLayer-bearing). Data: constants-30x-tao-get-into-assets-now-last-chance.ts.
import React from 'react';
import { LivestreamShort } from './LivestreamShort';
import { CAPTIONS_XT2 } from './captionsThirtyXTaoLastChanceFull';
import {
  XT2_FPS, XT2_DURATION_S, XT2_SEAM, XT2_CAP_Y, XT2_ACCENT, XT2_CLIP,
  XT2_BROLL, XT2_BADGES, XT2_OVERLAYS, XT2_SOUNDS, XT2_THUMB,
} from './constants-30x-tao-get-into-assets-now-last-chance';

export { XT2_FPS, XT2_DURATION_FRAMES } from './constants-30x-tao-get-into-assets-now-last-chance';

export const ThirtyXTaoLastChanceFull: React.FC = () => (
  <LivestreamShort data={{
    clip: XT2_CLIP,
    fps: XT2_FPS,
    durationS: XT2_DURATION_S,
    capY: XT2_CAP_Y,
    seam: XT2_SEAM,
    accent: XT2_ACCENT,
    captions: CAPTIONS_XT2,
    broll: XT2_BROLL,
    badges: XT2_BADGES,
    overlays: XT2_OVERLAYS,
    sounds: XT2_SOUNDS,
    thumb: XT2_THUMB,
  }} />
);

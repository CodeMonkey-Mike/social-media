// 30x-tao clip 5 `no-2029-top-new-ath-every-year`: "No 2029 Top: Bitcoin Could Make a New ATH Every Single Year"
// Batch 30x-tao (2026-10-28), comp id ThirtyXTaoNo2029Top. Built on the shared LivestreamShort
// (BrollLayer-bearing). Data: constants-30x-tao-no-2029-top-new-ath-every-year.ts.
import React from 'react';
import { LivestreamShort } from './LivestreamShort';
import { CAPTIONS_XT5 } from './captionsThirtyXTaoNo2029Top';
import {
  XT5_FPS, XT5_DURATION_S, XT5_SEAM, XT5_CAP_Y, XT5_ACCENT, XT5_CLIP,
  XT5_BROLL, XT5_REDACTIONS, XT5_BADGES, XT5_OVERLAYS, XT5_SOUNDS, XT5_THUMB,
} from './constants-30x-tao-no-2029-top-new-ath-every-year';

export { XT5_FPS, XT5_DURATION_FRAMES } from './constants-30x-tao-no-2029-top-new-ath-every-year';

export const ThirtyXTaoNo2029Top: React.FC = () => (
  <LivestreamShort data={{
    clip: XT5_CLIP,
    fps: XT5_FPS,
    durationS: XT5_DURATION_S,
    capY: XT5_CAP_Y,
    seam: XT5_SEAM,
    accent: XT5_ACCENT,
    captions: CAPTIONS_XT5,
    broll: XT5_BROLL,
    redactions: XT5_REDACTIONS,
    badges: XT5_BADGES,
    overlays: XT5_OVERLAYS,
    sounds: XT5_SOUNDS,
    thumb: XT5_THUMB,
  }} />
);

// 30x-tao clip 7 `get-into-assets-now-last-chance-impact`: "This Might Be Your Last Chance to Get In"
// Batch 30x-tao (2026-10-28), comp id ThirtyXTaoLastChanceImpact. Built on the shared LivestreamShort
// (BrollLayer-bearing). Data: constants-30x-tao-get-into-assets-now-last-chance-impact.ts.
import React from 'react';
import { LivestreamShort } from './LivestreamShort';
import { CAPTIONS_XT7 } from './captionsThirtyXTaoLastChanceImpact';
import {
  XT7_FPS, XT7_DURATION_S, XT7_SEAM, XT7_CAP_Y, XT7_ACCENT, XT7_CLIP,
  XT7_BROLL, XT7_BADGES, XT7_OVERLAYS, XT7_SOUNDS, XT7_THUMB,
} from './constants-30x-tao-get-into-assets-now-last-chance-impact';

export { XT7_FPS, XT7_DURATION_FRAMES } from './constants-30x-tao-get-into-assets-now-last-chance-impact';

export const ThirtyXTaoLastChanceImpact: React.FC = () => (
  <LivestreamShort data={{
    clip: XT7_CLIP,
    fps: XT7_FPS,
    durationS: XT7_DURATION_S,
    capY: XT7_CAP_Y,
    seam: XT7_SEAM,
    accent: XT7_ACCENT,
    captions: CAPTIONS_XT7,
    broll: XT7_BROLL,
    badges: XT7_BADGES,
    overlays: XT7_OVERLAYS,
    sounds: XT7_SOUNDS,
    thumb: XT7_THUMB,
  }} />
);

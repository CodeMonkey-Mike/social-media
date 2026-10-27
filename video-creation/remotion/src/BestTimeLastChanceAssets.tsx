// best-time clip 3 `last-chance-to-get-ahead-buy-assets-now` — "One of the Last Chances Any of Us Have to Get Ahead"
// Batch best-time (2026-10-27), comp id BestTimeLastChanceAssets. Built on the shared LivestreamShort
// (BrollLayer-bearing). Data: constants-best-time-last-chance-to-get-ahead-buy-assets-now.ts.
import React from 'react';
import { LivestreamShort } from './LivestreamShort';
import { CAPTIONS_BT3 } from './captionsBestTimeLastChanceAssets';
import {
  BT3_FPS, BT3_DURATION_S, BT3_SEAM, BT3_CAP_Y, BT3_ACCENT, BT3_CLIP,
  BT3_BROLL, BT3_BADGES, BT3_SOUNDS, BT3_THUMB,
} from './constants-best-time-last-chance-to-get-ahead-buy-assets-now';

export { BT3_FPS, BT3_DURATION_FRAMES } from './constants-best-time-last-chance-to-get-ahead-buy-assets-now';

export const BestTimeLastChanceAssets: React.FC = () => (
  <LivestreamShort data={{
    clip: BT3_CLIP,
    fps: BT3_FPS,
    durationS: BT3_DURATION_S,
    capY: BT3_CAP_Y,
    seam: BT3_SEAM,
    accent: BT3_ACCENT,
    captions: CAPTIONS_BT3,
    broll: BT3_BROLL,
    badges: BT3_BADGES,
    sounds: BT3_SOUNDS,
    thumb: BT3_THUMB,
  }} />
);

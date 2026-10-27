// best-time clip 2 `ton-billion-users-at-1-26` — "A Billion Users and $TON Is at $1.26?"
// Batch best-time (2026-10-27), comp id BestTimeTonBillionUsers. Built on the shared LivestreamShort
// (BrollLayer-bearing). Data: constants-best-time-ton-billion-users-at-1-26.ts.
import React from 'react';
import { LivestreamShort } from './LivestreamShort';
import { CAPTIONS_BT2 } from './captionsBestTimeTonBillionUsers';
import {
  BT2_FPS, BT2_DURATION_S, BT2_SEAM, BT2_CAP_Y, BT2_ACCENT, BT2_CLIP,
  BT2_BROLL, BT2_BADGES, BT2_SOUNDS, BT2_THUMB,
} from './constants-best-time-ton-billion-users-at-1-26';

export { BT2_FPS, BT2_DURATION_FRAMES } from './constants-best-time-ton-billion-users-at-1-26';

export const BestTimeTonBillionUsers: React.FC = () => (
  <LivestreamShort data={{
    clip: BT2_CLIP,
    fps: BT2_FPS,
    durationS: BT2_DURATION_S,
    capY: BT2_CAP_Y,
    seam: BT2_SEAM,
    accent: BT2_ACCENT,
    captions: CAPTIONS_BT2,
    broll: BT2_BROLL,
    badges: BT2_BADGES,
    sounds: BT2_SOUNDS,
    thumb: BT2_THUMB,
  }} />
);

// 30x-tao clip 6 `tao-is-the-arena-not-a-competitor-impact`: "TAO Is the Arena, Not a Competitor"
// Batch 30x-tao (2026-10-28), comp id ThirtyXTaoArenaImpact. Built on the shared LivestreamShort
// (BrollLayer-bearing). Data: constants-30x-tao-tao-is-the-arena-not-a-competitor-impact.ts.
import React from 'react';
import { LivestreamShort } from './LivestreamShort';
import { CAPTIONS_XT6 } from './captionsThirtyXTaoArenaImpact';
import {
  XT6_FPS, XT6_DURATION_S, XT6_SEAM, XT6_CAP_Y, XT6_ACCENT, XT6_CLIP,
  XT6_BROLL, XT6_BADGES, XT6_OVERLAYS, XT6_SOUNDS, XT6_THUMB,
} from './constants-30x-tao-tao-is-the-arena-not-a-competitor-impact';

export { XT6_FPS, XT6_DURATION_FRAMES } from './constants-30x-tao-tao-is-the-arena-not-a-competitor-impact';

export const ThirtyXTaoArenaImpact: React.FC = () => (
  <LivestreamShort data={{
    clip: XT6_CLIP,
    fps: XT6_FPS,
    durationS: XT6_DURATION_S,
    capY: XT6_CAP_Y,
    seam: XT6_SEAM,
    accent: XT6_ACCENT,
    captions: CAPTIONS_XT6,
    broll: XT6_BROLL,
    badges: XT6_BADGES,
    overlays: XT6_OVERLAYS,
    sounds: XT6_SOUNDS,
    thumb: XT6_THUMB,
  }} />
);

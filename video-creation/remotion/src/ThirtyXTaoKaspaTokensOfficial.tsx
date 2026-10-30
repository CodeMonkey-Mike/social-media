// 30x-tao clip 4 `kaspa-tokens-are-official-kcc20-live`: "Kaspa Tokens Are Official Now: KCC20 Is Live"
// Batch 30x-tao (2026-10-28), comp id ThirtyXTaoKaspaTokensOfficial. Built on the shared LivestreamShort
// (BrollLayer-bearing). Data: constants-30x-tao-kaspa-tokens-are-official-kcc20-live.ts.
import React from 'react';
import { LivestreamShort } from './LivestreamShort';
import { CAPTIONS_XT4 } from './captionsThirtyXTaoKaspaTokensOfficial';
import {
  XT4_FPS, XT4_DURATION_S, XT4_SEAM, XT4_CAP_Y, XT4_ACCENT, XT4_CLIP,
  XT4_BROLL, XT4_BADGES, XT4_OVERLAYS, XT4_REDACTIONS, XT4_SOUNDS, XT4_THUMB,
} from './constants-30x-tao-kaspa-tokens-are-official-kcc20-live';

export { XT4_FPS, XT4_DURATION_FRAMES } from './constants-30x-tao-kaspa-tokens-are-official-kcc20-live';

export const ThirtyXTaoKaspaTokensOfficial: React.FC = () => (
  <LivestreamShort data={{
    clip: XT4_CLIP,
    fps: XT4_FPS,
    durationS: XT4_DURATION_S,
    capY: XT4_CAP_Y,
    seam: XT4_SEAM,
    accent: XT4_ACCENT,
    captions: CAPTIONS_XT4,
    broll: XT4_BROLL,
    badges: XT4_BADGES,
    overlays: XT4_OVERLAYS,
    redactions: XT4_REDACTIONS,
    sounds: XT4_SOUNDS,
    thumb: XT4_THUMB,
  }} />
);

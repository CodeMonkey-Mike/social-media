// kaspa-cocktails clip 7 `bitcoin-maxis-will-move-to-kaspa-impact`: "Bitcoin Maxis Are Quietly Stacking Kaspa"
// Batch kaspa-cocktails (2026-11-02), comp id KaspaCocktailsBitcoinMaxisImpact. Built on the shared
// LivestreamShort (BrollLayer-bearing). Data: constants-kaspa-cocktails-bitcoin-maxis-will-move-to-kaspa-impact.ts.
import React from 'react';
import { LivestreamShort } from './LivestreamShort';
import { CAPTIONS_KC7 } from './captionsKaspaCocktailsBitcoinMaxisImpact';
import {
  KC7_FPS, KC7_DURATION_S, KC7_SEAM, KC7_CAP_Y, KC7_ACCENT, KC7_CLIP,
  KC7_BROLL, KC7_REDACTIONS, KC7_BADGES, KC7_OVERLAYS, KC7_SOUNDS, KC7_THUMB,
} from './constants-kaspa-cocktails-bitcoin-maxis-will-move-to-kaspa-impact';

export { KC7_FPS, KC7_DURATION_FRAMES } from './constants-kaspa-cocktails-bitcoin-maxis-will-move-to-kaspa-impact';

export const KaspaCocktailsBitcoinMaxisImpact: React.FC = () => (
  <LivestreamShort data={{
    clip: KC7_CLIP,
    fps: KC7_FPS,
    durationS: KC7_DURATION_S,
    capY: KC7_CAP_Y,
    seam: KC7_SEAM,
    accent: KC7_ACCENT,
    captions: CAPTIONS_KC7,
    broll: KC7_BROLL,
    redactions: KC7_REDACTIONS,
    badges: KC7_BADGES,
    overlays: KC7_OVERLAYS,
    sounds: KC7_SOUNDS,
    thumb: KC7_THUMB,
  }} />
);

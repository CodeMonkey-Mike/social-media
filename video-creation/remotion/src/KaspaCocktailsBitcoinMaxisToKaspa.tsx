// kaspa-cocktails clip 2 `bitcoin-maxis-will-move-to-kaspa`: "The Day Bitcoin Maxis Move Over to Kaspa"
// Batch kaspa-cocktails (2026-11-02), comp id KaspaCocktailsBitcoinMaxisToKaspa. Built on the shared LivestreamShort
// (BrollLayer-bearing). Data: constants-kaspa-cocktails-bitcoin-maxis-will-move-to-kaspa.ts.
import React from 'react';
import { LivestreamShort } from './LivestreamShort';
import { CAPTIONS_KC2 } from './captionsKaspaCocktailsBitcoinMaxisToKaspa';
import {
  KC2_FPS, KC2_DURATION_S, KC2_SEAM, KC2_CAP_Y, KC2_ACCENT, KC2_CLIP,
  KC2_BROLL, KC2_REDACTIONS, KC2_BADGES, KC2_OVERLAYS, KC2_SOUNDS, KC2_THUMB,
} from './constants-kaspa-cocktails-bitcoin-maxis-will-move-to-kaspa';

export { KC2_FPS, KC2_DURATION_FRAMES } from './constants-kaspa-cocktails-bitcoin-maxis-will-move-to-kaspa';

export const KaspaCocktailsBitcoinMaxisToKaspa: React.FC = () => (
  <LivestreamShort data={{
    clip: KC2_CLIP,
    fps: KC2_FPS,
    durationS: KC2_DURATION_S,
    capY: KC2_CAP_Y,
    seam: KC2_SEAM,
    accent: KC2_ACCENT,
    captions: CAPTIONS_KC2,
    broll: KC2_BROLL,
    redactions: KC2_REDACTIONS,
    badges: KC2_BADGES,
    overlays: KC2_OVERLAYS,
    sounds: KC2_SOUNDS,
    thumb: KC2_THUMB,
  }} />
);

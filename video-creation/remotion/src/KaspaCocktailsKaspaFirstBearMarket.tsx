// kaspa-cocktails clip 3 `kaspa-first-bear-market-mirrors-bitcoin`: "Kaspa's First Bear Market Looks Exactly Like Bitcoin's"
// Batch kaspa-cocktails (2026-11-02), comp id KaspaCocktailsKaspaFirstBearMarket. Built on the shared LivestreamShort
// (BrollLayer-bearing). Data: constants-kaspa-cocktails-kaspa-first-bear-market-mirrors-bitcoin.ts.
import React from 'react';
import { LivestreamShort } from './LivestreamShort';
import { CAPTIONS_KC3 } from './captionsKaspaCocktailsKaspaFirstBearMarket';
import {
  KC3_FPS, KC3_DURATION_S, KC3_SEAM, KC3_CAP_Y, KC3_ACCENT, KC3_CLIP,
  KC3_BROLL, KC3_REDACTIONS, KC3_BADGES, KC3_OVERLAYS, KC3_SOUNDS, KC3_THUMB,
} from './constants-kaspa-cocktails-kaspa-first-bear-market-mirrors-bitcoin';

export { KC3_FPS, KC3_DURATION_FRAMES } from './constants-kaspa-cocktails-kaspa-first-bear-market-mirrors-bitcoin';

export const KaspaCocktailsKaspaFirstBearMarket: React.FC = () => (
  <LivestreamShort data={{
    clip: KC3_CLIP,
    fps: KC3_FPS,
    durationS: KC3_DURATION_S,
    capY: KC3_CAP_Y,
    seam: KC3_SEAM,
    accent: KC3_ACCENT,
    captions: CAPTIONS_KC3,
    broll: KC3_BROLL,
    redactions: KC3_REDACTIONS,
    badges: KC3_BADGES,
    overlays: KC3_OVERLAYS,
    sounds: KC3_SOUNDS,
    thumb: KC3_THUMB,
  }} />
);

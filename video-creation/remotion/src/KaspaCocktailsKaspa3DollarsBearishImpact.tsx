// kaspa-cocktails clip 6 `kaspa-3-dollars-is-bearish-impact`: "A 3 Dollar Kaspa Is Only a 100 Billion Market Cap"
// Batch kaspa-cocktails (2026-11-02), comp id KaspaCocktailsKaspa3DollarsBearishImpact. Built on the shared
// LivestreamShort (BrollLayer-bearing). Data: constants-kaspa-cocktails-kaspa-3-dollars-is-bearish-impact.ts.
import React from 'react';
import { LivestreamShort } from './LivestreamShort';
import { CAPTIONS_KC6 } from './captionsKaspaCocktailsKaspa3DollarsBearishImpact';
import {
  KC6_FPS, KC6_DURATION_S, KC6_SEAM, KC6_CAP_Y, KC6_ACCENT, KC6_CLIP,
  KC6_BROLL, KC6_REDACTIONS, KC6_BADGES, KC6_OVERLAYS, KC6_SOUNDS, KC6_THUMB,
} from './constants-kaspa-cocktails-kaspa-3-dollars-is-bearish-impact';

export { KC6_FPS, KC6_DURATION_FRAMES } from './constants-kaspa-cocktails-kaspa-3-dollars-is-bearish-impact';

export const KaspaCocktailsKaspa3DollarsBearishImpact: React.FC = () => (
  <LivestreamShort data={{
    clip: KC6_CLIP,
    fps: KC6_FPS,
    durationS: KC6_DURATION_S,
    capY: KC6_CAP_Y,
    seam: KC6_SEAM,
    accent: KC6_ACCENT,
    captions: CAPTIONS_KC6,
    broll: KC6_BROLL,
    redactions: KC6_REDACTIONS,
    badges: KC6_BADGES,
    overlays: KC6_OVERLAYS,
    sounds: KC6_SOUNDS,
    thumb: KC6_THUMB,
  }} />
);

// kaspa-cocktails clip 4 `kcc20-nacho-migration-is-live`: "KCC20 Is Live: Migrate Your Nacho Before January 31"
// Batch kaspa-cocktails (2026-11-02), comp id KaspaCocktailsKcc20NachoMigration. Built on the shared LivestreamShort
// (BrollLayer-bearing). Data: constants-kaspa-cocktails-kcc20-nacho-migration-is-live.ts.
import React from 'react';
import { LivestreamShort } from './LivestreamShort';
import { CAPTIONS_KC4 } from './captionsKaspaCocktailsKcc20NachoMigration';
import {
  KC4_FPS, KC4_DURATION_S, KC4_SEAM, KC4_CAP_Y, KC4_ACCENT, KC4_CLIP,
  KC4_BROLL, KC4_REDACTIONS, KC4_BADGES, KC4_OVERLAYS, KC4_SOUNDS, KC4_THUMB,
} from './constants-kaspa-cocktails-kcc20-nacho-migration-is-live';

export { KC4_FPS, KC4_DURATION_FRAMES } from './constants-kaspa-cocktails-kcc20-nacho-migration-is-live';

export const KaspaCocktailsKcc20NachoMigration: React.FC = () => (
  <LivestreamShort data={{
    clip: KC4_CLIP,
    fps: KC4_FPS,
    durationS: KC4_DURATION_S,
    capY: KC4_CAP_Y,
    seam: KC4_SEAM,
    accent: KC4_ACCENT,
    captions: CAPTIONS_KC4,
    broll: KC4_BROLL,
    redactions: KC4_REDACTIONS,
    badges: KC4_BADGES,
    overlays: KC4_OVERLAYS,
    sounds: KC4_SOUNDS,
    thumb: KC4_THUMB,
  }} />
);

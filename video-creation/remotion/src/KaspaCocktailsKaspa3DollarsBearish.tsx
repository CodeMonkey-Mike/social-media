// kaspa-cocktails clip 1 `kaspa-3-dollars-is-bearish`: "Why a 3 Dollar Kaspa Is Actually Bearish"
// Batch kaspa-cocktails (2026-11-02), comp id KaspaCocktailsKaspa3DollarsBearish. Built on the shared LivestreamShort
// (BrollLayer-bearing). Data: constants-kaspa-cocktails-kaspa-3-dollars-is-bearish.ts.
import React from 'react';
import { LivestreamShort } from './LivestreamShort';
import { CAPTIONS_KC1 } from './captionsKaspaCocktailsKaspa3DollarsBearish';
import {
  KC1_FPS, KC1_DURATION_S, KC1_SEAM, KC1_CAP_Y, KC1_ACCENT, KC1_CLIP,
  KC1_BROLL, KC1_REDACTIONS, KC1_BADGES, KC1_OVERLAYS, KC1_SOUNDS, KC1_THUMB, KC1_LOGO,
} from './constants-kaspa-cocktails-kaspa-3-dollars-is-bearish';

export { KC1_FPS, KC1_DURATION_FRAMES } from './constants-kaspa-cocktails-kaspa-3-dollars-is-bearish';

export const KaspaCocktailsKaspa3DollarsBearish: React.FC = () => (
  <LivestreamShort data={{
    clip: KC1_CLIP,
    fps: KC1_FPS,
    durationS: KC1_DURATION_S,
    capY: KC1_CAP_Y,
    seam: KC1_SEAM,
    accent: KC1_ACCENT,
    captions: CAPTIONS_KC1,
    broll: KC1_BROLL,
    redactions: KC1_REDACTIONS,
    badges: KC1_BADGES,
    overlays: KC1_OVERLAYS,
    sounds: KC1_SOUNDS,
    thumb: KC1_THUMB,
    logo: KC1_LOGO,
  }} />
);

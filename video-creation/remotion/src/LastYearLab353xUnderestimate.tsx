// LastYearLab353xUnderestimate — batch last-year, clip #2 "I Estimated a 20X on LAB. We Did a 353X."
// Thin wrapper over the shared b-roll-capable LivestreamShort component; ALL data lives in
// constants-last-year-lab-353x.ts (see BROLL-PLAN.md in the clip folder for the beat-by-beat
// rationale, the celebration-drop guard and the 51.080 s splice cover).
//
// NOT to be confused with `LabCalled20xDid353x.tsx` / `constants-lab353.ts`, which is the what-if-1000x
// batch's clip #4 from a DIFFERENT livestream (published 2026-08-03). Same story, different stream,
// different spine: never edit that one from here.
import React from 'react';
import { LivestreamShort } from './LivestreamShort';
import {
  CLIP_LY_LAB, LY_LAB_FPS, LY_LAB_DURATION, LY_LAB_SEAM, LY_LAB_CAP_Y, LY_LAB_ACCENT,
  CAPTIONS_LY_LAB, BROLL_LY_LAB, BADGES_LY_LAB, OVERLAYS_LY_LAB, SFX_LY_LAB, THUMB_DEF_LY_LAB,
} from './constants-last-year-lab-353x';

export const LastYearLab353xUnderestimate: React.FC = () => (
  <LivestreamShort
    data={{
      clip: CLIP_LY_LAB,
      fps: LY_LAB_FPS,
      durationS: LY_LAB_DURATION / LY_LAB_FPS,
      capY: LY_LAB_CAP_Y,
      seam: LY_LAB_SEAM,
      accent: LY_LAB_ACCENT,
      captions: CAPTIONS_LY_LAB,
      broll: BROLL_LY_LAB,
      badges: BADGES_LY_LAB,
      overlays: OVERLAYS_LY_LAB,
      sounds: SFX_LY_LAB,
      thumb: THUMB_DEF_LY_LAB,
    }}
  />
);

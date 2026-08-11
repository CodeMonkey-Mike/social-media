import React from 'react';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  LYK_FPS, LYK_DURATION, CLIP_LYK, LYK_SEAM, LYK_CAP_Y, LYK_ACCENT,
  BROLL_LYK, BADGES_LYK, SFX_LYK, CAPTIONS_LYK, THUMB_DEF_LYK,
} from './constants-last-year-kitsu-vlads-dog';

// batch `last-year` / clip #3 / slug `kitsu-vlads-dog` / variant `full`
// "The Robinhood CEO's Dog Is Now a Coin". Renders through the SHARED LivestreamShort renderer
// (base video + BrollLayer + captions + badges + frame-0 thumb + sfx); everything clip-specific
// lives in constants-last-year-kitsu-vlads-dog.ts, including the reasoning behind every cue.
// Nothing here is copied from another batch's composition.

const DATA: ShortData = {
  clip: CLIP_LYK,
  fps: LYK_FPS,
  durationS: LYK_DURATION / LYK_FPS,
  capY: LYK_CAP_Y,
  seam: LYK_SEAM,
  accent: LYK_ACCENT,   // Robinhood lime, never teal (teal = Kaspa)
  captions: CAPTIONS_LYK,
  broll: BROLL_LYK,
  badges: BADGES_LYK,
  sounds: SFX_LYK,
  thumb: THUMB_DEF_LYK, // frame-0 cover only (durS defaults to 1/fps)
};

export const LastYearKitsuVladsDog: React.FC = () => <LivestreamShort data={DATA} />;
export { LYK_FPS, LYK_DURATION };

import React from 'react';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  OC6_FPS, OC6_DURATION, OC6_SEAM, OC6_CAP_Y, OC6_ACCENT,
  CLIP_OC6, THUMB_DEF_OC6, BROLL_OC6, OVERLAYS_OC6, BADGES_OC6, SFX_OC6,
} from './constants-uptober-october-coins-first-week-pump';
// Captions come from the CANONICAL captions skill output for this clip (never hand-authored). The exact
// rebuild invocation and the whisper-words-verified.json provenance live in the header of
// captionsUptoberOctoberCoins.ts.
import { CAPTIONS_OC6 } from './captionsUptoberOctoberCoins';

// batch uptober / clip #6 "October Coins Pump the First Week of October" (FULL).
// Thin data wrapper over the shared LivestreamShort renderer (base video, BrollLayer with 2 full-screen
// moments + 3 content-zone cutaways, caption band, frame-0 cover, 5 code-drawn badges, SFX sequences).
// Everything clip-specific lives in constants-uptober-october-coins-first-week-pump.ts.
//
// CAPTION BLANK (presentational, not a text edit): 8.20-9.52 is the dropped false start "it did it on"; without
// an empty entry "market cap, and" would sit on screen through it. LivestreamShort renders nothing for an
// empty caption string.
const CAPTIONS = [...CAPTIONS_OC6, { t: 8.30, h: '' }].sort((a, b) => a.t - b.t);

const DATA: ShortData = {
  clip: CLIP_OC6,
  fps: OC6_FPS,
  durationS: OC6_DURATION / OC6_FPS,
  capY: OC6_CAP_Y,
  seam: OC6_SEAM,
  accent: OC6_ACCENT,
  captions: CAPTIONS,
  broll: BROLL_OC6,
  overlays: OVERLAYS_OC6,
  badges: BADGES_OC6,
  sounds: SFX_OC6,
  thumb: THUMB_DEF_OC6, // durS omitted => ONE frame (frame-0 cover), base video from frame 1
};

export const UptoberOctoberCoins: React.FC = () => <LivestreamShort data={DATA} />;
export { OC6_FPS, OC6_DURATION };

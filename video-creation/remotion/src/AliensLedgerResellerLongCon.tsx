import React from 'react';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  AL5_FPS, AL5_DURATION, AL5_SEAM, AL5_CAP_Y, AL5_ACCENT,
  CLIP_AL5, THUMB_DEF_AL5, BROLL_AL5, OVERLAYS_AL5, BADGES_AL5, SFX_AL5,
} from './constants-aliens-ledger-reseller-long-con';
import { CAPTIONS_AL5 } from './captionsAliensLedgerResellerLongCon';

// batch aliens / clip #5 "90 Million Drained" ledger-reseller-long-con (FULL). Thin data wrapper over LivestreamShort.
const DATA: ShortData = {
  clip: CLIP_AL5,
  fps: AL5_FPS,
  durationS: AL5_DURATION / AL5_FPS,
  capY: AL5_CAP_Y,
  seam: AL5_SEAM,
  accent: AL5_ACCENT,
  captions: CAPTIONS_AL5,
  broll: BROLL_AL5,
  overlays: OVERLAYS_AL5,
  badges: BADGES_AL5,
  sounds: SFX_AL5,
  thumb: THUMB_DEF_AL5, // ONE frame cover, base from frame 1
};

export const AliensLedgerResellerLongCon: React.FC = () => <LivestreamShort data={DATA} />;
export { AL5_FPS, AL5_DURATION };

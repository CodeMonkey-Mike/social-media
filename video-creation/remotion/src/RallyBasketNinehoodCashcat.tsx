import React from 'react';
import { loadFont } from '@remotion/google-fonts/Montserrat';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  RB_FPS, RB_DURATION, RB_SEAM, RB_CAP_Y,
  CLIP_RB, THUMB_DEF_RB, BROLL_RB, BADGES_RB, SFX_RB,
} from './constants-rb';
// Captions come from the CANONICAL captions skill output for this clip
// (skills/captions/build_captions.py --style montserrat -> the clip folder's captions.ts, copied in
// verbatim). Never hand-authored and never lifted from another composition. The only edits are the
// STT-ONLY corrections documented at the top of captionsRb.ts, mirrored back into captions.ts.
import { CAPTIONS_RALLY_BASKET } from './captionsRb';

// Montserrat 900 = the house caption/badge face; register it so text rasterizes reliably.
loadFont('normal', { weights: ['900'], subsets: ['latin'], ignoreTooManyRequestsWarning: true });

// batch October-pumps / clip #4 "Some Of These Things Could Run" (variant: full).
// Thin data wrapper over the shared LivestreamShort renderer: it owns the base video, the b-roll
// layer (full + content zone, hard-cut adjacency), the caption band, badges, the frame-0 cover and
// the SFX sequences. Everything clip-specific lives in constants-rb.ts.
const DATA: ShortData = {
  clip: CLIP_RB,
  fps: RB_FPS,
  durationS: RB_DURATION / RB_FPS,
  capY: RB_CAP_Y,
  seam: RB_SEAM,
  captions: CAPTIONS_RALLY_BASKET,
  broll: BROLL_RB,
  badges: BADGES_RB,
  sounds: SFX_RB,
  thumb: THUMB_DEF_RB, // durS omitted => ONE frame (frame-0 cover), base video from frame 1
};

export const RallyBasketNinehoodCashcat: React.FC = () => <LivestreamShort data={DATA} />;

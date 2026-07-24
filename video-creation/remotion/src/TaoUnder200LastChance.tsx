import React from 'react';
import { loadFont } from '@remotion/google-fonts/Montserrat';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  T200_FPS, T200_DURATION, T200_SEAM, T200_CAP_Y,
  CLIP_T200, THUMB_DEF_T200, BROLL_T200, BADGES_T200, SFX_T200,
} from './constants-tao200';
// Captions come from the CANONICAL captions skill output for this clip
// (skills/captions/build_captions.py --style montserrat -> the clip folder's captions.ts, copied in
// verbatim). Never hand-authored and never lifted from another composition. The only edit is the
// STT-ONLY correction documented at the top of captionsTao200.ts, mirrored back into captions.ts.
import { CAPTIONS_TAO_UNDER_200 } from './captionsTao200';

// Montserrat 900 = the house caption/badge face; register it so text rasterizes reliably.
loadFont('normal', { weights: ['900'], subsets: ['latin'], ignoreTooManyRequestsWarning: true });

// batch October-pumps / clip #3 "Your Last Chance At TAO Under $200" (variant: full).
// Thin data wrapper over the shared LivestreamShort renderer: it owns the base video, the b-roll
// layer (full + content zone, hard-cut adjacency), the caption band, badges, the frame-0 cover and
// the SFX sequences. Everything clip-specific lives in constants-tao200.ts.
const DATA: ShortData = {
  clip: CLIP_T200,
  fps: T200_FPS,
  durationS: T200_DURATION / T200_FPS,
  capY: T200_CAP_Y,
  seam: T200_SEAM,
  captions: CAPTIONS_TAO_UNDER_200,
  broll: BROLL_T200,
  badges: BADGES_T200,
  sounds: SFX_T200,
  thumb: THUMB_DEF_T200, // durS omitted => ONE frame (frame-0 cover), base video from frame 1
};

export const TaoUnder200LastChance: React.FC = () => <LivestreamShort data={DATA} />;

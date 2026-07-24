import React from 'react';
import { loadFont } from '@remotion/google-fonts/Montserrat';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  TAOI_FPS, TAOI_DURATION, TAOI_SEAM, TAOI_CAP_Y,
  CLIP_TAOI, THUMB_DEF_TAOI, BROLL_TAOI, BADGES_TAOI, SFX_TAOI,
} from './constants-taoi';
// Captions come from the CANONICAL captions skill output for this clip
// (skills/captions/build_captions.py --style montserrat -> the clip folder's captions.ts, copied in
// verbatim). Never hand-authored and never lifted from another composition. The only edit is the
// STT-ONLY correction documented at the top of captionsTaoi.ts, mirrored back into captions.ts.
import { CAPTIONS_TAO_UNDER_200_IMPACT } from './captionsTaoi';

// Montserrat 900 = the house caption/badge face; register it so text rasterizes reliably.
loadFont('normal', { weights: ['900'], subsets: ['latin'], ignoreTooManyRequestsWarning: true });

// batch October-pumps / clip #8 "TAO Under $200: Don't Be That Guy" (variant: impact).
// Thin data wrapper over the shared LivestreamShort renderer: it owns the base video, the b-roll
// layer (full + content zone, hard-cut adjacency), the caption band, badges, the frame-0 cover and
// the SFX sequences. Everything clip-specific lives in constants-taoi.ts.
const DATA: ShortData = {
  clip: CLIP_TAOI,
  fps: TAOI_FPS,
  durationS: TAOI_DURATION / TAOI_FPS,
  capY: TAOI_CAP_Y,
  seam: TAOI_SEAM,
  captions: CAPTIONS_TAO_UNDER_200_IMPACT,
  broll: BROLL_TAOI,
  badges: BADGES_TAOI,
  sounds: SFX_TAOI,
  thumb: THUMB_DEF_TAOI, // durS omitted => ONE frame (frame-0 cover), base video from frame 1
};

export const TaoUnder200Impact: React.FC = () => <LivestreamShort data={DATA} />;

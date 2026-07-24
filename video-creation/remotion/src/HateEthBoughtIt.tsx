import React from 'react';
import { loadFont } from '@remotion/google-fonts/Montserrat';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  HETH_FPS, HETH_DURATION, HETH_SEAM, HETH_CAP_Y,
  CLIP_HETH, THUMB_DEF_HETH, BROLL_HETH, BADGES_HETH, SFX_HETH,
} from './constants-heth';
// Captions come from the CANONICAL captions skill output for this clip
// (skills/captions/build_captions.py --style montserrat -> the clip folder's captions.ts, copied in
// verbatim). Never hand-authored and never lifted from another composition. The one mechanical fix
// (the "$10 ,000" token-join space) is documented in captionsHeth.ts and mirrored back into the
// clip's captions.ts so both copies stay identical.
import { CAPTIONS_HATE_ETH_BOUGHT_IT } from './captionsHeth';

// Montserrat 900 = the house caption/badge face; register it so text rasterizes reliably.
loadFont('normal', { weights: ['900'], subsets: ['latin'], ignoreTooManyRequestsWarning: true });

// batch clarity-act / clip #3 "I Hate ETH But I Bought It" (variant: full).
// Thin data wrapper over the shared LivestreamShort renderer: it owns the base video, the b-roll
// layer (full + content zone, hard-cut adjacency), the caption band, badges, the frame-0 cover and
// the SFX sequences. Everything clip-specific lives in constants-heth.ts.
const DATA: ShortData = {
  clip: CLIP_HETH,
  fps: HETH_FPS,
  durationS: HETH_DURATION / HETH_FPS,
  capY: HETH_CAP_Y,
  seam: HETH_SEAM,
  captions: CAPTIONS_HATE_ETH_BOUGHT_IT,
  broll: BROLL_HETH,
  badges: BADGES_HETH,
  sounds: SFX_HETH,
  thumb: THUMB_DEF_HETH, // durS omitted => ONE frame (frame-0 cover), base video from frame 1
};

export const HateEthBoughtIt: React.FC = () => <LivestreamShort data={DATA} />;

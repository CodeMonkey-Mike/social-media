import React from 'react';
import { loadFont } from '@remotion/google-fonts/Montserrat';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  WCTI_FPS, WCTI_DURATION, WCTI_SEAM, WCTI_CAP_Y,
  CLIP_WCTI, THUMB_DEF_WCTI, BROLL_WCTI, BADGES_WCTI, SFX_WCTI,
} from './constants-wcti';
// Captions come from the CANONICAL captions skill output for this clip
// (skills/captions/build_captions.py --style montserrat -> the clip folder's captions.ts, copied in
// verbatim, zero edits). Never hand-authored and never lifted from another composition.
import { CAPTIONS_WHATIF_CTO_100X_CALL_IMPACT } from './captionsWcti';

// Montserrat 900 = the house caption/badge face; register it so text rasterizes reliably.
loadFont('normal', { weights: ['900'], subsets: ['latin'], ignoreTooManyRequestsWarning: true });

// batch October-pumps / clip #6 "Forget 20 Million, WHATIF Could 100x" (variant: impact).
// The impact sibling of clip #1 WhatifCto100xCall: it shares source seconds by design but carries
// its OWN newly generated b-roll (`-wcti-` filenames in its own render-assets/), its own badges and
// its own SFX map. Thin data wrapper over the shared LivestreamShort renderer.
const DATA: ShortData = {
  clip: CLIP_WCTI,
  fps: WCTI_FPS,
  durationS: WCTI_DURATION / WCTI_FPS,
  capY: WCTI_CAP_Y,
  seam: WCTI_SEAM,
  captions: CAPTIONS_WHATIF_CTO_100X_CALL_IMPACT,
  broll: BROLL_WCTI,
  badges: BADGES_WCTI,
  sounds: SFX_WCTI,
  thumb: THUMB_DEF_WCTI, // durS omitted => ONE frame (frame-0 cover), base video from frame 1
};

export const WhatifCto100xCallImpact: React.FC = () => <LivestreamShort data={DATA} />;

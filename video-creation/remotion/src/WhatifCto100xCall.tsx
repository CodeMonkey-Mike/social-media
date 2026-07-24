import React from 'react';
import { loadFont } from '@remotion/google-fonts/Montserrat';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  WCTO_FPS, WCTO_DURATION, WCTO_SEAM, WCTO_CAP_Y,
  CLIP_WCTO, THUMB_DEF_WCTO, BROLL_WCTO, BADGES_WCTO, SFX_WCTO,
} from './constants-wcto';
// Captions come from the CANONICAL captions skill output for this clip
// (skills/captions/build_captions.py --style montserrat -> the clip folder's captions.ts, copied in
// verbatim). Never hand-authored and never lifted from another composition. The only edits are the
// STT-ONLY corrections documented at the top of captionsWcto.ts, mirrored back into captions.ts.
import { CAPTIONS_WHATIF_CTO_100X_CALL } from './captionsWcto';

// Montserrat 900 = the house caption/badge face; register it so text rasterizes reliably.
loadFont('normal', { weights: ['900'], subsets: ['latin'], ignoreTooManyRequestsWarning: true });

// batch October-pumps / clip #1 "WHATIF Could Be A 100x From Here" (variant: full).
// Thin data wrapper over the shared LivestreamShort renderer: it owns the base video, the b-roll
// layer (full + content zone, hard-cut adjacency), the caption band, badges, the frame-0 cover and
// the SFX sequences. Everything clip-specific lives in constants-wcto.ts.
const DATA: ShortData = {
  clip: CLIP_WCTO,
  fps: WCTO_FPS,
  durationS: WCTO_DURATION / WCTO_FPS,
  capY: WCTO_CAP_Y,
  seam: WCTO_SEAM,
  captions: CAPTIONS_WHATIF_CTO_100X_CALL,
  broll: BROLL_WCTO,
  badges: BADGES_WCTO,
  sounds: SFX_WCTO,
  thumb: THUMB_DEF_WCTO, // durS omitted => ONE frame (frame-0 cover), base video from frame 1
};

export const WhatifCto100xCall: React.FC = () => <LivestreamShort data={DATA} />;

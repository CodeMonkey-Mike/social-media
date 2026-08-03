import React from 'react';
import { loadFont } from '@remotion/google-fonts/Montserrat';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  W1BB_FPS, W1BB_DURATION, W1BB_SEAM, W1BB_CAP_Y,
  CLIP_W1BB, THUMB_DEF_W1BB, BROLL_W1BB, BADGES_W1BB, SFX_W1BB,
} from './constants-w1bb';
// Captions come from the CANONICAL captions skill output for this clip
// (skills/captions/build_captions.py --style montserrat -> the clip folder's captions.ts, copied in
// verbatim). Never hand-authored and never lifted from another composition. The only edits are the
// STT-ONLY corrections documented at the top of captionsW1bb.ts, mirrored back into captions.ts.
import { CAPTIONS_WHATIF_BIGGER_THAN_BRETT } from './captionsW1bb';

// Montserrat 900 = the house caption/badge face; register it so text rasterizes reliably.
loadFont('normal', { weights: ['900'], subsets: ['latin'], ignoreTooManyRequestsWarning: true });

// batch what-if-1000x / clip #2 "What If 100x: Bigger Than Brett on a Bigger Chain" (variant: long).
// Thin data wrapper over the shared LivestreamShort renderer: it owns the base video, the b-roll
// layer (full + content zone, hard-cut adjacency), the caption band, badges, the frame-0 cover and
// the SFX sequences. Everything clip-specific lives in constants-w1bb.ts.
const DATA: ShortData = {
  clip: CLIP_W1BB,
  fps: W1BB_FPS,
  durationS: W1BB_DURATION / W1BB_FPS,
  capY: W1BB_CAP_Y,
  seam: W1BB_SEAM,
  captions: CAPTIONS_WHATIF_BIGGER_THAN_BRETT,
  broll: BROLL_W1BB,
  badges: BADGES_W1BB,
  sounds: SFX_W1BB,
  thumb: THUMB_DEF_W1BB, // durS omitted => ONE frame (frame-0 cover), base video from frame 1
};

export const WhatifBiggerThanBrett: React.FC = () => <LivestreamShort data={DATA} />;

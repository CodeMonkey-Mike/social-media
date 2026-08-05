import React from 'react';
import { loadFont } from '@remotion/google-fonts/Montserrat';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  WHIF_FPS, WHIF_DURATION, WHIF_SEAM, WHIF_CAP_Y,
  CLIP_WHIF, THUMB_DEF_WHIF, BROLL_WHIF, BADGES_WHIF, SFX_WHIF,
} from './constants-whatif';
// Captions come from the CANONICAL captions skill output for this clip
// (skills/captions/build_captions.py --style montserrat -> captionsWhatif.ts, verbatim except the
// documented STT-only corrections noted at the top of that file). Never hand-authored, never lifted
// from another composition.
import { CAPTIONS_WHATIF_PEANUT_52X } from './captionsWhatif';

// Montserrat 900 = the house caption/badge face; register it so text rasterizes reliably.
loadFont('normal', { weights: ['900'], subsets: ['latin'], ignoreTooManyRequestsWarning: true });

// batch whatif / clip #3 "WHATIF Could Be Another Peanut 52x" (variant: full).
// Thin data wrapper over the shared LivestreamShort renderer: it owns the base video, the b-roll
// layer (full + content zone), the caption band, badges, the frame-0 cover and the SFX sequences.
// Everything clip-specific lives in constants-whatif.ts.
const DATA: ShortData = {
  clip: CLIP_WHIF,
  fps: WHIF_FPS,
  durationS: WHIF_DURATION / WHIF_FPS,
  capY: WHIF_CAP_Y,
  seam: WHIF_SEAM,
  captions: CAPTIONS_WHATIF_PEANUT_52X,
  broll: BROLL_WHIF,
  badges: BADGES_WHIF,
  sounds: SFX_WHIF,
  thumb: THUMB_DEF_WHIF, // durS omitted => ONE frame (frame-0 cover), base video from frame 1
};

export const WhatifPeanut52x: React.FC = () => <LivestreamShort data={DATA} />;

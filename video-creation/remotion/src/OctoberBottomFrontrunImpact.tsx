import React from 'react';
import { loadFont } from '@remotion/google-fonts/Montserrat';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  OBFI_FPS, OBFI_DURATION, OBFI_SEAM, OBFI_CAP_Y,
  CLIP_OBFI, THUMB_DEF_OBFI, BROLL_OBFI, BADGES_OBFI, SFX_OBFI,
} from './constants-obfi';
// Captions come from the CANONICAL captions skill output for this clip
// (skills/captions/build_captions.py --style montserrat -> the clip folder's captions.ts, copied in
// verbatim). Never hand-authored and never lifted from another composition. The only edits are the
// stray-hyphen fix + colour spans documented at the top of captionsObfi.ts, mirrored back into
// the clip folder's captions.ts.
import { CAPTIONS_OCTOBER_BOTTOM_FRONTRUN_IMPACT } from './captionsObfi';

// Montserrat 900 = the house caption/badge face; register it so text rasterizes reliably.
loadFont('normal', { weights: ['900'], subsets: ['latin'], ignoreTooManyRequestsWarning: true });

// batch October-pumps / clip #7 "Zombie FOMO Will Need A Psychiatrist" (variant: impact).
// Thin data wrapper over the shared LivestreamShort renderer: it owns the base video, the b-roll
// layer (full + content zone, hard-cut adjacency), the caption band, badges, the frame-0 cover and
// the SFX sequences. Everything clip-specific lives in constants-obfi.ts.
const DATA: ShortData = {
  clip: CLIP_OBFI,
  fps: OBFI_FPS,
  durationS: OBFI_DURATION / OBFI_FPS,
  capY: OBFI_CAP_Y,
  seam: OBFI_SEAM,
  captions: CAPTIONS_OCTOBER_BOTTOM_FRONTRUN_IMPACT,
  broll: BROLL_OBFI,
  badges: BADGES_OBFI,
  sounds: SFX_OBFI,
  thumb: THUMB_DEF_OBFI, // durS omitted => ONE frame (frame-0 cover), base video from frame 1
};

export const OctoberBottomFrontrunImpact: React.FC = () => <LivestreamShort data={DATA} />;

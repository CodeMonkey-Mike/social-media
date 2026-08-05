import React from 'react';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  OMM_FPS, OMM_DURATION, OMM_SEAM, OMM_CAP_Y,
  CLIP_OMM, THUMB_DEF_OMM, BROLL_OMM, SFX_OMM,
} from './constants-omm';
// Captions come from the CANONICAL captions skill output for this clip
// (skills/captions/build_captions.py --style montserrat -> captionsOmm.ts, written by the tool).
// Never hand-authored and never lifted from another composition. The only edits are the STT-ONLY
// corrections documented in the builder's PHRASE_CORRECTIONS (four-year / six out of / outlier), so
// the array can always be rebuilt byte-identically.
import { CAPTIONS_OCTOBER_MANDELA_MYTH } from './captionsOmm';

// batch october-bottom / clip #1 "The October Bottom Is a Mandela Effect" (variant: long).
// Thin data wrapper over the shared LivestreamShort renderer: it owns the base video, the b-roll
// layer (full + content zone, hard-cut adjacency), the caption band, the frame-0 cover and the SFX
// sequences. Everything clip-specific lives in constants-omm.ts. No badges by design (see the
// overlay note in constants-omm.ts) — the frame-0 cover is the only timed graphic.
const DATA: ShortData = {
  clip: CLIP_OMM,
  fps: OMM_FPS,
  durationS: OMM_DURATION / OMM_FPS,
  capY: OMM_CAP_Y,
  seam: OMM_SEAM,
  captions: CAPTIONS_OCTOBER_MANDELA_MYTH,
  broll: BROLL_OMM,
  sounds: SFX_OMM,
  thumb: THUMB_DEF_OMM, // durS omitted => ONE frame (frame-0 cover), base video from frame 1
};

export const OctoberMandelaMyth: React.FC = () => <LivestreamShort data={DATA} />;

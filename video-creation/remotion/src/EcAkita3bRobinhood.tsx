import React from 'react';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  EC_AKA_FPS, EC_AKA_DURATION, EC_AKA_SEAM, EC_AKA_CAP_Y, EC_AKA_LIME,
  CLIP_EC_AKA, THUMB_DEF_EC_AKA, BROLL_EC_AKA, OVERLAYS_EC_AKA, BADGES_EC_AKA, SFX_EC_AKA,
} from './constants-ec-akita-3b-robinhood';
// Captions come from the CANONICAL captions skill output for this clip
// (skills/captions/build_captions.py --style montserrat -> captionsEcAkita.ts, written by the tool).
// Never hand-authored and never lifted from another composition. The clip's STT fixes live in the
// builder's PHRASE_CORRECTIONS / PROTECTED_DOUBLES, and the two runs the shipped word pass DROPPED
// live in akita-3b-robinhood/_patch_words.py, so the array can always be rebuilt byte-identically:
//   python video-creation/shorts/early-crash/akita-3b-robinhood/_patch_words.py
//   python video-creation/skills/captions/build_captions.py \
//     --words video-creation/shorts/early-crash/akita-3b-robinhood/whisper-words-verified.json \
//     --style montserrat --var CAPTIONS_EC_AKITA \
//     --colorize 'y=$120k,858,billion,3,10,20,million gr=robinhood,$if,cashcat' \
//     --out video-creation/remotion/src/captionsEcAkita.ts
import { CAPTIONS_EC_AKITA } from './captionsEcAkita';

// batch early-crash / clip #1 "Here's why Robinhood chain tokens will pass 6 billion." (variant: full).
// Thin data wrapper over the shared LivestreamShort renderer: it owns the base video, the b-roll
// layer (full + content zone, hard-cut adjacency), the alpha overlay, the caption band, the badges,
// the frame-0 cover and the SFX sequences. Everything clip-specific lives in
// constants-ec-akita-3b-robinhood.ts.
const DATA: ShortData = {
  clip: CLIP_EC_AKA,
  fps: EC_AKA_FPS,
  durationS: EC_AKA_DURATION / EC_AKA_FPS,
  capY: EC_AKA_CAP_Y,
  seam: EC_AKA_SEAM,
  accent: EC_AKA_LIME, // Robinhood lime for the content-zone divider; NEVER teal on this clip
  captions: CAPTIONS_EC_AKITA,
  broll: BROLL_EC_AKA,
  overlays: OVERLAYS_EC_AKA,
  badges: BADGES_EC_AKA,
  sounds: SFX_EC_AKA,
  thumb: THUMB_DEF_EC_AKA, // durS omitted => ONE frame (frame-0 cover), base video from frame 1
};

export const EcAkita3bRobinhood: React.FC = () => <LivestreamShort data={DATA} />;

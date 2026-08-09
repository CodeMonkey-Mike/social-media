import React from 'react';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  EC_ETP_FPS, EC_ETP_DURATION, EC_ETP_SEAM, EC_ETP_CAP_Y, EC_ETP_ACCENT,
  CLIP_EC_ETP, THUMB_DEF_EC_ETP, BROLL_EC_ETP, OVERLAYS_EC_ETP, BADGES_EC_ETP, SFX_EC_ETP,
} from './constants-ec-endure-the-pain';
// Captions come from the CANONICAL captions skill output for this clip
// (skills/captions/build_captions.py --style montserrat -> captionsEcEndure.ts, written by the tool).
// Never hand-authored and never lifted from another composition. The ONE word this clip's shipped
// word pass DROPPED ("not feeling IT yet", ear-verified twice) is restored by the clip folder's
// _patch_words.py, so the array can always be rebuilt byte-identically:
//   python video-creation/shorts/early-crash/endure-the-pain/_patch_words.py
//   python video-creation/skills/captions/build_captions.py \
//     --words video-creation/shorts/early-crash/endure-the-pain/whisper-words-verified.json \
//     --style montserrat --var CAPTIONS_EC_ENDURE \
//     --colorize 'o=bitcoin gr=robinhood y=lucky' \
//     --out video-creation/remotion/src/captionsEcEndure.ts
import { CAPTIONS_EC_ENDURE } from './captionsEcEndure';

// batch early-crash / clip #5 "Meme Coin Truth: You'll Be Lucky You Endured the Pain" (variant: full).
// Thin data wrapper over the shared LivestreamShort renderer: it owns the base video, the b-roll
// layer (full + content zone), the caption band, the frame-0 cover and the SFX sequences. This clip
// carries NO overlays and NO badges by design (see constants). Everything clip-specific lives in
// constants-ec-endure-the-pain.ts.
const DATA: ShortData = {
  clip: CLIP_EC_ETP,
  fps: EC_ETP_FPS,
  durationS: EC_ETP_DURATION / EC_ETP_FPS,
  capY: EC_ETP_CAP_Y,
  seam: EC_ETP_SEAM,
  accent: EC_ETP_ACCENT,
  captions: CAPTIONS_EC_ENDURE,
  broll: BROLL_EC_ETP,
  overlays: OVERLAYS_EC_ETP,
  badges: BADGES_EC_ETP,
  sounds: SFX_EC_ETP,
  thumb: THUMB_DEF_EC_ETP, // durS omitted => ONE frame (frame-0 cover), base video from frame 1
};

export const EcEndureThePain: React.FC = () => <LivestreamShort data={DATA} />;

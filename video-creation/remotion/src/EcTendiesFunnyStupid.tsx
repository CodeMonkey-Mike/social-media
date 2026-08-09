import React from 'react';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  EC_TFS_FPS, EC_TFS_DURATION, EC_TFS_SEAM, EC_TFS_CAP_Y, EC_TFS_LIME,
  CLIP_EC_TFS, THUMB_DEF_EC_TFS, BROLL_EC_TFS, BADGES_EC_TFS, SFX_EC_TFS,
} from './constants-ec-tendies-funny-stupid';
// Captions come from the CANONICAL captions skill output for this clip
// (skills/captions/build_captions.py --style montserrat -> captionsEcTendies.ts, written by the
// tool). Never hand-authored and never lifted from another composition. The STT fixes live in the
// builder's PHRASE_CORRECTIONS ("there's 10 days" -> "there's tendies", "far coin" -> "fartcoin",
// "type of me" -> "type of meme", "10 billion is imagine" -> "10 billion. just imagine.") and the
// restored tail line lives in tendies-funny-stupid/_patch_words.py, so the array can always be
// rebuilt byte-identically.
import { CAPTIONS_EC_TENDIES } from './captionsEcTendies';

// batch early-crash / clip #4 "Robinhood Alert: Tendies Is Exactly What Vlad Wants to List"
// (variant: full). Thin data wrapper over the shared LivestreamShort renderer: it owns the base
// video, the b-roll layer (full + content zone, hard-cut adjacency), the caption band, the badges,
// the frame-0 cover and the SFX sequences. Everything clip-specific lives in
// constants-ec-tendies-funny-stupid.ts.
const DATA: ShortData = {
  clip: CLIP_EC_TFS,
  fps: EC_TFS_FPS,
  durationS: EC_TFS_DURATION / EC_TFS_FPS,
  capY: EC_TFS_CAP_Y,
  seam: EC_TFS_SEAM,
  accent: EC_TFS_LIME, // Robinhood lime for the content-zone divider; NEVER teal on this clip
  captions: CAPTIONS_EC_TENDIES,
  broll: BROLL_EC_TFS,
  badges: BADGES_EC_TFS,
  sounds: SFX_EC_TFS,
  thumb: THUMB_DEF_EC_TFS, // durS omitted => ONE frame (frame-0 cover), base video from frame 1
};

export const EcTendiesFunnyStupid: React.FC = () => <LivestreamShort data={DATA} />;

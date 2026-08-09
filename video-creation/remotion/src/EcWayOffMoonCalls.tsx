import React from 'react';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  WOM_FPS, WOM_DURATION, WOM_SEAM, WOM_CAP_Y,
  CLIP_WOM, THUMB_DEF_WOM, BROLL_WOM, OVERLAYS_WOM, BADGES_WOM, SFX_WOM,
} from './constants-ec-way-off-moon-calls';
// Captions come from the CANONICAL captions skill output for this clip
// (skills/captions/build_captions.py --style montserrat -> captionsEcMoon.ts, written by the tool).
// Never hand-authored and never lifted from another composition. The STT fixes live in the builder's
// PHRASE_CORRECTIONS (early-crash block), so the array can always be rebuilt byte-identically. The
// clip-folder copy (shorts/early-crash/way-off-moon-calls/captions-way-off-moon-calls.ts) is
// byte-identical to this file.
import { CAPTIONS_EC_MOON } from './captionsEcMoon';

// batch early-crash / clip #3 "What $IF to a 10 billion market cap" (variant: full).
// Thin data wrapper over the shared LivestreamShort renderer: it owns the base video, the b-roll
// layer (full + content zone, hard-cut adjacency), the alpha overlay, the caption band, the badges,
// the frame-0 cover and the SFX sequences. Everything clip-specific lives in
// constants-ec-way-off-moon-calls.ts.
const DATA: ShortData = {
  clip: CLIP_WOM,
  fps: WOM_FPS,
  durationS: WOM_DURATION / WOM_FPS,
  capY: WOM_CAP_Y,
  seam: WOM_SEAM,
  captions: CAPTIONS_EC_MOON,
  broll: BROLL_WOM,
  overlays: OVERLAYS_WOM,
  badges: BADGES_WOM,
  sounds: SFX_WOM,
  thumb: THUMB_DEF_WOM, // durS omitted => ONE frame (frame-0 cover), base video from frame 1
};

export const EcWayOffMoonCalls: React.FC = () => <LivestreamShort data={DATA} />;

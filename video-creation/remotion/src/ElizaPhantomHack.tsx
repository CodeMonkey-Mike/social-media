import React from 'react';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  EPH_FPS, EPH_DURATION, EPH_SEAM, EPH_CAP_Y,
  CLIP_EPH, THUMB_DEF_EPH, BROLL_EPH, BADGES_EPH, SFX_EPH,
} from './constants-eliza-phantom';
// Captions come from the CANONICAL captions skill output for this clip
// (skills/captions/build_captions.py --style montserrat -> captionsEph.ts, written by the tool).
// Never hand-authored and never lifted from another composition. The STT fixes live in the builder's
// PHRASE_CORRECTIONS / PROTECTED_DOUBLES and the one restored line lives in phantom-hack/
// _patch_words.py, so the array can always be rebuilt byte-identically. The clip-folder copy
// (shorts/eliza/phantom-hack/captions-phantom-hack.ts) is byte-identical to this file.
import { CAPTIONS_ELIZA_PHANTOM } from './captionsEph';

// batch eliza / clip #2 "I Raced the Hacker Draining My Own Wallet" (variant: full).
// Thin data wrapper over the shared LivestreamShort renderer: it owns the base video, the b-roll
// layer (full + content zone, hard-cut adjacency), the caption band, the badges, the frame-0 cover
// and the SFX sequences. Everything clip-specific lives in constants-eliza-phantom.ts.
const DATA: ShortData = {
  clip: CLIP_EPH,
  fps: EPH_FPS,
  durationS: EPH_DURATION / EPH_FPS,
  capY: EPH_CAP_Y,
  seam: EPH_SEAM,
  captions: CAPTIONS_ELIZA_PHANTOM,
  broll: BROLL_EPH,
  badges: BADGES_EPH,
  sounds: SFX_EPH,
  thumb: THUMB_DEF_EPH, // durS omitted => ONE frame (frame-0 cover), base video from frame 1
};

export const ElizaPhantomHack: React.FC = () => <LivestreamShort data={DATA} />;

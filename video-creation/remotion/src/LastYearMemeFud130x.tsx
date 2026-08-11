import React from 'react';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  MFX_FPS, MFX_DURATION, MFX_SEAM, MFX_CAP_Y, MFX_BLUE,
  CLIP_MFX, THUMB_DEF_MFX, BROLL_MFX, OVERLAYS_MFX, BADGES_MFX, SFX_MFX,
} from './constants-last-year-meme-fud-130x';
// Captions come from the CANONICAL captions skill output for this clip. Never hand-authored and
// never lifted from another composition; the array is rebuilt byte-identically by this EXACT
// invocation:
//   python video-creation/skills/captions/build_captions.py \
//     --words video-creation/shorts/last-year/meme-fud-130x/whisper-words.json \
//     --style montserrat --var CAPTIONS_MFX \
//     --colorize 'o=$tut y=94x,130x,58x-er b=toshi,pengu,toshi now gr=pumping r=fud,dead,liquidated' \
//     --out video-creation/remotion/src/captionsLastYearMemeFud.ts
// The clip's STT fixes live in the tool's CORRECTIONS / PHRASE_CORRECTIONS / PROTECTED_DOUBLES (all
// four fixes the batch tighten log mandates - $TUT, Pengu, FUD, 58x-er - plus the runs that isolated
// re-decodes resolved). There is NO whisper-words-verified.json for this clip and none is needed:
// the one hole in the word stream (2.78 s at 11.22-14.00) contains a single 0.45 s "um", which
// cleanup() drops anyway. See the "NOT corrected, deliberately" block in build_captions.py.
import { CAPTIONS_MFX } from './captionsLastYearMemeFud';

// batch last-year / clip #1 "They Called These Coins Dead. We're at a 130X." (variant: full).
// Thin data wrapper over the shared LivestreamShort renderer: it owns the base video, the b-roll
// layer (full + content zone, hard-cut adjacency), the alpha overlay, the caption band, the code
// badges, the frame-0 cover and the SFX sequences. Everything clip-specific lives in
// constants-last-year-meme-fud-130x.ts.
const DATA: ShortData = {
  clip: CLIP_MFX,
  fps: MFX_FPS,
  durationS: MFX_DURATION / MFX_FPS,
  capY: MFX_CAP_Y,
  seam: MFX_SEAM,
  accent: MFX_BLUE, // Base blue for the content-zone divider; ⛔ NEVER teal on this clip (teal = Kaspa)
  captions: CAPTIONS_MFX,
  broll: BROLL_MFX,
  overlays: OVERLAYS_MFX,
  badges: BADGES_MFX,
  sounds: SFX_MFX,
  thumb: THUMB_DEF_MFX, // durS omitted => ONE frame (frame-0 cover), base video from frame 1
};

export const LastYearMemeFud130x: React.FC = () => <LivestreamShort data={DATA} />;

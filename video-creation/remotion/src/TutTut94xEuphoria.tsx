import React from 'react';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  TUT94X_FPS, TUT94X_DURATION, TUT94X_SEAM, TUT94X_CAP_Y,
  CLIP_TUT94X, THUMB_DEF_TUT94X, BROLL_TUT94X, OVERLAYS_TUT94X, BADGES_TUT94X, SFX_TUT94X,
} from './constants-tut-94x-euphoria';
// Captions come from the CANONICAL captions skill output for this clip. Never hand-authored; the
// array is rebuilt byte-identically by this EXACT invocation:
//   python video-creation/skills/captions/build_captions.py \
//     --words video-creation/shorts/tutorial/tut-94x-euphoria/whisper-words-verified.json \
//     --style montserrat --var CAPTIONS_TUT94X \
//     --colorize 'o=$tut,myx y=94x,638%,65x,550x' --max-secs 2.95 \
//     --out video-creation/remotion/src/captionsTut94x.ts
// The STT fixes live in the tool's PHRASE_CORRECTIONS / PROTECTED_DOUBLES, and the one re-onset word
// (the held "ohhh" vowel Whisper omits entirely) lives in tut-94x-euphoria/_patch_words.py.
// --max-secs 2.95 is the captions skill's documented STRETCHED-WORD guard (captions.md, montserrat):
// with it OFF, "we did the 550x on" is five <=4-char words with a 2.10 s held "550X" and no gaps, so
// the 3/5 word caps put ONE caption on screen for 3.72 s. 2.95 is the smallest value ABOVE this
// clip's own protected 2.93 s held vowel ("ohhh man.", 49.25-52.18), so the sustain still gets ONE
// caption and only the 550X line splits ("we did the" / "550x on"). Longest caption is now 3.05 s
// (the sustain), median 0.86 s. The clip-folder copy
// (shorts/tutorial/tut-94x-euphoria/captions-tut-94x-euphoria.ts) is identical.
import { CAPTIONS_TUT94X } from './captionsTut94x';

// batch tutorial / clip #1 "94X on $TUT, and It's Pumping Again" (variant: full).
// Thin data wrapper over the shared LivestreamShort renderer: it owns the base video, the caption
// band, the transparent overlay stickers, the code-drawn badges, the frame-0 cover and the SFX
// sequences. Everything clip-specific lives in constants-tut-94x-euphoria.ts.
//
// ⛔ `broll` is passed but is EMPTY by Mike's Phase 7 directive for this batch ("i only do not want
// full screen broll, nor content zone broll ... you can do captions, sfx, and any overlaying
// graphics or images with background transparency"). It is passed explicitly, rather than omitted,
// so the reader sees the choice; the constants file throws at bundle time if anything is added to it.
const DATA: ShortData = {
  clip: CLIP_TUT94X,
  fps: TUT94X_FPS,
  durationS: TUT94X_DURATION / TUT94X_FPS,
  capY: TUT94X_CAP_Y,
  seam: TUT94X_SEAM,
  captions: CAPTIONS_TUT94X,
  broll: BROLL_TUT94X,
  overlays: OVERLAYS_TUT94X,
  badges: BADGES_TUT94X,
  sounds: SFX_TUT94X,
  thumb: THUMB_DEF_TUT94X, // durS omitted => ONE frame (frame-0 cover), base video from frame 1
};

export const TutTut94xEuphoria: React.FC = () => <LivestreamShort data={DATA} />;

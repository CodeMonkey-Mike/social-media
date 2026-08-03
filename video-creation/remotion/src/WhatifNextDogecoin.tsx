import React from 'react';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  WND_FPS, WND_DURATION, WND_SEAM, WND_CAP_Y,
  CLIP_WND, THUMB_DEF_WND, BROLL_WND, BADGES_WND, SFX_WND,
} from './constants-wnd';
// Captions come from the CANONICAL captions skill output for this clip
// (skills/captions/build_captions.py --style montserrat -> the clip folder's captions.ts, copied in
// verbatim). Never hand-authored and never lifted from another composition. The only edits are the
// STT-ONLY corrections documented at the top of captionsWnd.ts, which live in the builder's
// PHRASE_CORRECTIONS so the array can always be rebuilt byte-identically.
import { CAPTIONS_WHATIF_NEXT_DOGECOIN } from './captionsWnd';

// batch what-if-1000x / clip #5 "What If Could Be the Next Dogecoin" (variant: solo).
// Thin data wrapper over the shared LivestreamShort renderer: it owns the base video, the b-roll
// layer (full + content zone, hard-cut adjacency), the caption band, badges, the frame-0 cover and
// the SFX sequences. Everything clip-specific lives in constants-wnd.ts.
const DATA: ShortData = {
  clip: CLIP_WND,
  fps: WND_FPS,
  durationS: WND_DURATION / WND_FPS,
  capY: WND_CAP_Y,
  seam: WND_SEAM,
  captions: CAPTIONS_WHATIF_NEXT_DOGECOIN,
  broll: BROLL_WND,
  badges: BADGES_WND,
  sounds: SFX_WND,
  thumb: THUMB_DEF_WND, // durS omitted => ONE frame (frame-0 cover), base video from frame 1
};

export const WhatifNextDogecoin: React.FC = () => <LivestreamShort data={DATA} />;

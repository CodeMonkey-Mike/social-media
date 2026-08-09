import React from 'react';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  EC_AKI_FPS, EC_AKI_DURATION, EC_AKI_SEAM, EC_AKI_CAP_Y,
  CLIP_EC_AKI, THUMB_DEF_EC_AKI, BROLL_EC_AKI, OVERLAYS_EC_AKI, BADGES_EC_AKI, SFX_EC_AKI,
} from './constants-ec-akita-impact';
// Captions come from the CANONICAL captions skill output for this clip
// (skills/captions/build_captions.py --style montserrat -> captionsEcAkitaImpact.ts, written by the
// tool). Never hand-authored and never lifted from another composition. The STT fixes live in the
// builder's PHRASE_CORRECTIONS (early-crash 2026-08-08 block), so the array can always be rebuilt
// byte-identically. The clip-folder copy
// (shorts/early-crash/akita-3b-robinhood-impact/captions-akita-3b-robinhood-impact.ts) is
// byte-identical to this file.
import { CAPTIONS_EC_AKI } from './captionsEcAkitaImpact';

// batch early-crash / clip #6 "Watch This: $3 Billion. A Freaking Inu." (variant: IMPACT).
// ⛔ This is the impact cut of clip #1 (`EcAkita3bRobinhood`) and shares the batch public dir with it.
// It owns ONLY the `broll-ec-aki-*` / `thumb-ecaki` assets; clip #1's `broll-ec-aka-*` / `thumb-eca`
// are never referenced here. Do not edit clip #1's comp, constants or captions from this file.
//
// Thin data wrapper over the shared LivestreamShort renderer: it owns the base video, the b-roll layer
// (full-screen only on this clip, hard-cut adjacency), the alpha overlay, the caption band, the
// badges, the frame-0 cover and the SFX sequences. Everything clip-specific lives in
// constants-ec-akita-impact.ts.
const DATA: ShortData = {
  clip: CLIP_EC_AKI,
  fps: EC_AKI_FPS,
  durationS: EC_AKI_DURATION / EC_AKI_FPS,
  capY: EC_AKI_CAP_Y,
  seam: EC_AKI_SEAM,
  captions: CAPTIONS_EC_AKI,
  broll: BROLL_EC_AKI,
  overlays: OVERLAYS_EC_AKI,
  badges: BADGES_EC_AKI,
  sounds: SFX_EC_AKI,
  thumb: THUMB_DEF_EC_AKI, // durS omitted => ONE frame (frame-0 cover), base video from frame 1
};

export const EcAkitaImpact: React.FC = () => <LivestreamShort data={DATA} />;

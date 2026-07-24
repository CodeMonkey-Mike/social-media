import React from 'react';
import { loadFont } from '@remotion/google-fonts/Montserrat';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  ONAR_FPS, ONAR_DURATION, ONAR_SEAM, ONAR_CAP_Y,
  CLIP_ONAR, THUMB_DEF_ONAR, BROLL_ONAR, BADGES_ONAR, SFX_ONAR,
} from './constants-onar';
// Captions come from the CANONICAL captions skill output for this clip
// (skills/captions/build_captions.py --style montserrat -> the clip folder's captions.ts, copied in
// verbatim). Never hand-authored and never lifted from another composition.
// STT-ONLY corrections applied after whisper-verifying the first full render (grouping / casing /
// colour spans untouched, and mirrored back into the clip's captions.ts so both copies stay identical):
//   5.98  "they're gonna cost"            -> "they're gonna cause"      (he causes October to be green)
//   8.56  "i think they" + "had something"-> "i think" + "something"    ("they had" is a garble; the
//                                                                        two Whisper passes disagree,
//                                                                        so the unverifiable word is
//                                                                        dropped rather than guessed)
//  18.48  "allowed it, not" -> "allowed, not"   and
//  19.44  "allowed it to"   -> "allowed to"     (the climax line is "they're not even allowed to go red")
//  45.56  "a very, bad"     -> "a very, very bad" (the builder dropped the second "very"; both Whisper
//                                                  passes have it)
import { CAPTIONS_OCTOBER_NOT_ALLOWED_RED } from './captionsOnar';

// Montserrat 900 = the house caption/badge face; register it so text rasterizes reliably.
loadFont('normal', { weights: ['900'], subsets: ['latin'], ignoreTooManyRequestsWarning: true });

// batch clarity-act / clip #1 "October Is Not Even Allowed To Go Red" (variant: full).
// Thin data wrapper over the shared LivestreamShort renderer: it owns the base video, the b-roll
// layer (full + content zone, hard-cut adjacency), the caption band, badges, the frame-0 cover and
// the SFX sequences. Everything clip-specific lives in constants-onar.ts.
const DATA: ShortData = {
  clip: CLIP_ONAR,
  fps: ONAR_FPS,
  durationS: ONAR_DURATION / ONAR_FPS,
  capY: ONAR_CAP_Y,
  seam: ONAR_SEAM,
  captions: CAPTIONS_OCTOBER_NOT_ALLOWED_RED,
  broll: BROLL_ONAR,
  badges: BADGES_ONAR,
  sounds: SFX_ONAR,
  thumb: THUMB_DEF_ONAR, // durS omitted => ONE frame (frame-0 cover), base video from frame 1
};

export const OctoberNotAllowedRed: React.FC = () => <LivestreamShort data={DATA} />;

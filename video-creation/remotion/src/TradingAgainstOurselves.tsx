import React from 'react';
import { loadFont } from '@remotion/google-fonts/Montserrat';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  TAO_FPS, TAO_DURATION, TAO_SEAM, TAO_CAP_Y,
  CLIP_TAO, THUMB_DEF_TAO, BROLL_TAO, BADGES_TAO, SFX_TAO,
} from './constants-tao';
// Captions come from the CANONICAL captions skill output for this clip
// (skills/captions/build_captions.py --style montserrat -> the clip folder's captions.ts, copied in
// verbatim). Never hand-authored and never lifted from another composition.
// STT-ONLY corrections applied BEFORE the first full render, each verified by a SECOND Whisper pass
// (medium) and, where still ambiguous, a THIRD pass (large-v3) on the isolated span. Grouping is
// touched only where a dropped/merged word forced it; casing and colour spans are untouched, and the
// same edit was written to the clip's captions.ts so both copies stay identical:
//    5.30 / 6.50  "us trading the" + "guns ourselves with" -> "us trading" + "against ourselves with"
//                 (medium pass: "trading against ourselves"; "the guns" is a two-word garble of one word)
//   21.80 /23.10  "to really, make" + "a pump is cash"     -> "to really, really" + "make a pump" +
//                 "is cash cat."  (the base pass dropped the 2nd "really" and heard "cash cash";
//                 large-v3 on 21.0-26.5 returns "The first meme to really, really make a pump is
//                 Cash Cat.", and the screen-share behind this line is literally the CASHCAT/WETH
//                 DexScreener page, so "cat" is verified, not guessed)
//   38.68        "and they get em"                        -> "and they're getting"  (medium pass)
//   60.40 /60.84 "it's like, which" + "trade and against" -> "it's like, we're" + "trading against"
//                 (medium pass: "it's like we're trading against ourselves here")
// NOT changed: 43.94 "i'm like, yeah, i'm done with robinhood memes" (the two passes disagree and the
// base reading is the coherent one, so nothing is guessed), and every colour span as the builder emitted it.
import { CAPTIONS_TRADING_AGAINST_OURSELVES } from './captionsTao';

// Montserrat 900 = the house caption/badge face; register it so text rasterizes reliably.
loadFont('normal', { weights: ['900'], subsets: ['latin'], ignoreTooManyRequestsWarning: true });

// batch clarity-act / clip #2 "We Are Only Trading Against Ourselves" (variant: full).
// Thin data wrapper over the shared LivestreamShort renderer: it owns the base video, the b-roll
// layer (full + content zone, hard-cut adjacency), the caption band, badges, the frame-0 cover and
// the SFX sequences. Everything clip-specific lives in constants-tao.ts.
const DATA: ShortData = {
  clip: CLIP_TAO,
  fps: TAO_FPS,
  durationS: TAO_DURATION / TAO_FPS,
  capY: TAO_CAP_Y,
  seam: TAO_SEAM,
  captions: CAPTIONS_TRADING_AGAINST_OURSELVES,
  broll: BROLL_TAO,
  badges: BADGES_TAO,
  sounds: SFX_TAO,
  thumb: THUMB_DEF_TAO, // durS omitted => ONE frame (frame-0 cover), base video from frame 1
};

export const TradingAgainstOurselves: React.FC = () => <LivestreamShort data={DATA} />;

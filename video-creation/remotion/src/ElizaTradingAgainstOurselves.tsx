import React from 'react';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  ETAO_FPS, ETAO_DURATION, ETAO_SEAM, ETAO_CAP_Y,
  CLIP_ETAO, THUMB_DEF_ETAO, BROLL_ETAO, BADGES_ETAO, SFX_ETAO,
} from './constants-eliza-tao';
// Captions come from the CANONICAL captions skill output for this clip
// (skills/captions/build_captions.py --style montserrat --var CAPTIONS_ETAO --colorize
//  "gr=robinhood,pumping,bull r=dwindle,lost,losing,weakness y=weeks,may,december"
//  --words trading-against-ourselves/whisper-words.json), byte-identical to the clip folder's
// captions-trading-against-ourselves.ts. Never hand-authored and never lifted from another
// composition, so the array can always be rebuilt byte-identically. The only STT correction this
// clip needs, "Robin Hood" -> "Robinhood" (x4), is already a PHRASE_CORRECTIONS rule in the tool.
import { CAPTIONS_ETAO } from './captionsEtao';

// batch eliza / clip #3 "We're Trading Against Ourselves" (variant: full, 95.26 s).
// ⚠ NOT the same short as `TradingAgainstOurselves.tsx` (clarity-act clip #2, July 20, published) —
// that is a pure slug collision on a different livestream. Nothing here touches it.
//
// Thin data wrapper over the shared LivestreamShort renderer: it owns the base video, the b-roll
// layer (full + content zone, hard-cut adjacency), the caption band, the three code-drawn badges,
// the frame-0 cover and the SFX sequences. Everything clip-specific lives in constants-eliza-tao.ts.
const DATA: ShortData = {
  clip: CLIP_ETAO,
  fps: ETAO_FPS,
  durationS: ETAO_DURATION / ETAO_FPS,
  capY: ETAO_CAP_Y,
  seam: ETAO_SEAM,
  captions: CAPTIONS_ETAO,
  broll: BROLL_ETAO,
  badges: BADGES_ETAO,
  sounds: SFX_ETAO,
  thumb: THUMB_DEF_ETAO, // durS omitted => ONE frame (frame-0 cover), base video from frame 1
};

export const ElizaTradingAgainstOurselves: React.FC = () => <LivestreamShort data={DATA} />;

import React from 'react';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  KEX_FPS, KEX_DURATION, KEX_SEAM, KEX_CAP_Y, KEX_TEAL,
  CLIP_KEX, THUMB_DEF_KEX, BROLL_KEX, OVERLAYS_KEX, BADGES_KEX, SFX_KEX,
} from './constants-last-year-kaspa-excavator';
// Captions come from the CANONICAL captions skill output for this clip. Never hand-authored and
// never lifted from another composition; the array is rebuilt byte-identically by this EXACT
// invocation:
//   python video-creation/skills/captions/build_captions.py \
//     --words video-creation/shorts/last-year/kaspa-excavator/whisper-words.json \
//     --style montserrat --var CAPTIONS_KEX \
//     --colorize "g=kaspa,kaspa's o=bitcoin r=weak,down y=100 gr=worth" \
//     --out video-creation/remotion/src/captionsLastYearKaspaExcavator.ts
// The clip's STT fixes live in the tool's CORRECTIONS / PHRASE_CORRECTIONS (the single source of
// truth), verified against THIS clip's own whisper-words.json:
//   * "Casper/Casper's" -> kaspa/kaspa's  - the standing (r"\bcas+per\b") rule, fires 8x here.
//   * "tau" -> TAO                        - standing glossary rule, no occurrence in this clip (no-op).
//   * "battle-hardened"                   - NEW phrase rules added this build. The clip's own pass
//     reads "battle" + "hardened." (p 0.97 / p 0.23); medium.en on 58.6-61.6 s returns the hyphenated
//     "battle-hardened", and medium.en on 59.2-62.2 s returns the flagged garble "battle hard and".
//     Both forms now map to one token, so the hard-out line can never split across two caption groups.
//   * "Hurricane Sally"                   - NO correction needed and none added: this clip's own words
//     already read " Hurricane" (9.16) + " Sally." (9.88). A 1-token -> 2-word rewrite is impossible in
//     the tool anyway (a replacement may never be longer than the run it matches).
// There is NO whisper-words-verified.json for this clip and none is needed: the word stream has no
// unexplained hole (largest gap 0.72 s, at 65.02-65.74, a deliberate beat before the final line), and
// the last word ends at 66.94 s against a 67.06 s spine.
import { CAPTIONS_KEX } from './captionsLastYearKaspaExcavator';

// batch last-year / clip #4 "Kaspa's going down" (variant: full).
// Thin data wrapper over the shared LivestreamShort renderer: it owns the base video, the b-roll
// layer (full + content zone), the alpha overlay, the caption band, the code badges, the frame-0
// cover and the SFX sequences. Everything clip-specific lives in
// constants-last-year-kaspa-excavator.ts.
const DATA: ShortData = {
  clip: CLIP_KEX,
  fps: KEX_FPS,
  durationS: KEX_DURATION / KEX_FPS,
  capY: KEX_CAP_Y,
  seam: KEX_SEAM,
  accent: KEX_TEAL, // teal is ON-message here: this is the batch's Kaspa clip
  captions: CAPTIONS_KEX,
  broll: BROLL_KEX,
  overlays: OVERLAYS_KEX,
  badges: BADGES_KEX,
  sounds: SFX_KEX,
  thumb: THUMB_DEF_KEX, // durS omitted => ONE frame (frame-0 cover), base video from frame 1
};

export const LastYearKaspaExcavator: React.FC = () => <LivestreamShort data={DATA} />;

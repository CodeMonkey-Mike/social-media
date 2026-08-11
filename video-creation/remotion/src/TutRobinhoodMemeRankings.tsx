import React from 'react';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  TUT_RHM_FPS, TUT_RHM_DURATION, TUT_RHM_SEAM, TUT_RHM_CAP_Y,
  CLIP_TUT_RHM, THUMB_DEF_TUT_RHM, OVERLAYS_TUT_RHM, BADGES_TUT_RHM, SFX_TUT_RHM,
} from './constants-tut-robinhood-meme-rankings';
// Captions come from the CANONICAL captions skill output for this clip:
//   python video-creation/skills/captions/build_captions.py \
//     --words video-creation/shorts/tutorial/robinhood-meme-rankings/whisper-words-verified.json \
//     --style montserrat --var CAPTIONS_TUT_RHM \
//     --colorize "gr=robinhood,cooper,tendies,yolo,swappy,fartcoin,toshi y=unequivocally,three,four,five,concept" \
//     --out video-creation/remotion/src/captionsTutRhm.ts
// Never hand-authored. Everything needed to rebuild it byte-identically lives in tracked files:
// this clip's STT fixes are in build_captions.py's "robinhood-meme-rankings, clip 2" PHRASE block
// (fartcoin, "that it'll", three missing sentence periods, the kept Robinhood self-correction) plus
// the global "toshie" -> "toshi" CORRECTION and the PROTECTED_DOUBLES entry
// ("is","my","my","favorite") that keeps his "my, MY favorite" doubling from being collapsed; the
// timing/omission repairs are in robinhood-meme-rankings/_patch_words.py -> whisper-words-verified.json.
import { CAPTIONS_TUT_RHM } from './captionsTutRhm';

// batch tutorial / clip #2 "My Robinhood Chain Meme Rankings: $IF, Cooper, Tendies, Yolo"
// (variant: FULL, 79.46 s - the longest clip in the batch). Hook type: RANKED-OPINION.
//
// ⛔ Seven sibling clips share this batch's public dir. This comp owns ONLY the `broll-tut-rhm-*` /
// `thumb-tutrhm.png` assets. It never references clip 1's `broll-tut94x-*` / `thumb-tut94x-*`,
// clip 3's `broll-tut-bkc-ov-*` / `thumb-tutbkc.png`, or clip 6's `broll-tut6-*` /
// `tail-tut6-hold.png` / `thumb-tut6.png`.
//
// Thin data wrapper over the shared LivestreamShort renderer: base video, TRUE-ALPHA overlay layer,
// caption band, code-drawn badges, frame-0 cover and the SFX sequences. There is deliberately NO
// b-roll layer on this clip (Mike's batch-wide Phase 7 directive bans full-screen and content-zone
// b-roll); the reasoning, and the fact that it is a reported DEVIATION from the finalized-short
// coverage item, are documented in constants-tut-robinhood-meme-rankings.ts and in the clip's
// BROLL-PLAN.md.
const DATA: ShortData = {
  clip: CLIP_TUT_RHM,
  fps: TUT_RHM_FPS,
  durationS: TUT_RHM_DURATION / TUT_RHM_FPS,
  capY: TUT_RHM_CAP_Y,
  seam: TUT_RHM_SEAM,
  captions: CAPTIONS_TUT_RHM,
  overlays: OVERLAYS_TUT_RHM,
  badges: BADGES_TUT_RHM,
  sounds: SFX_TUT_RHM,
  thumb: THUMB_DEF_TUT_RHM, // durS omitted => ONE frame (frame-0 cover), base video from frame 1
};

export const TutRobinhoodMemeRankings: React.FC = () => <LivestreamShort data={DATA} />;

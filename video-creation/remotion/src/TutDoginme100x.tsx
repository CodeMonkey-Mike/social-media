import React from 'react';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  TUT_DGN_FPS, TUT_DGN_DURATION, TUT_DGN_SEAM, TUT_DGN_CAP_Y,
  CLIP_TUT_DGN, THUMB_DEF_TUT_DGN, OVERLAYS_TUT_DGN, BADGES_TUT_DGN, SFX_TUT_DGN,
} from './constants-tut-doginme-100x';
// Captions come from the CANONICAL captions skill output for this clip. Never hand-authored; the
// array is rebuilt byte-identically by this EXACT invocation:
//   python video-creation/skills/captions/build_captions.py \
//     --words video-creation/shorts/tutorial/doginme-100x-if-500x/whisper-words-verified.json \
//     --style montserrat --var CAPTIONS_TUT_DGN \
//     --colorize 'b=doginme,base,coinbase y=100x,200x,107,400,800' --max-secs 1.75 \
//     --out video-creation/remotion/src/captionsTutDgn.ts
// The STT fixes live in the tool's PHRASE_CORRECTIONS / PROTECTED_DOUBLES (tutorial 2026-08-10 clip-5
// block); the 2 words the shipped pass silently OMITTED ("of", "don't"), the one phantom word split
// ("and"+"then" -> "in") and 8 measured re-timings live in
// doginme-100x-if-500x/_patch_words.py -> whisper-words-verified.json. The clip-folder copy
// (shorts/tutorial/doginme-100x-if-500x/captions-doginme-100x-if-500x.ts) is byte-identical.
// --max-secs 1.75 is the captions skill's documented STRETCHED-WORD guard. It is a NO-OP on this
// build and deliberately so: the longest caption GROUP SPAN measures 1.52 s ("first dog on") and the
// longest single token 0.805 s ("doginme"), so 1.75 sits above everything the clip contains while
// still catching a regression. This clip has no protected held vowel to split - the 2.2 s stretched
// "on" its tighten plan flagged at master 4405.0 was 1.82 s of TRUE digital silence that 5B removed
// for free, leaving a 0.24 s "on".
import { CAPTIONS_TUT_DGN } from './captionsTutDgn';

// batch tutorial / clip #5 "doginme at 107 Million: 400 Million Is a 100X From Here" (variant: FULL).
// ⛔ Seven sibling clips share this batch's public dir. This comp owns ONLY the `broll-tut-dgn-*` /
// `thumb-tutdgn` assets; clip #1's `broll-tut94x-*`/`thumb-tut94x-*`, clip #2's `broll-tut-rhm-*`/
// `thumb-tutrhm`, clip #3's `broll-tut-bkc-*`/`thumb-tutbkc`, clip #4's `broll-tut-fed-*`/
// `thumb-tutfed` and clip #6's `broll-tut6-*`/`thumb-tut6`/`tail-tut6-hold` are never referenced here.
//
// ⛔⛔ THE SLUG IS VESTIGIAL AND LIES: `doginme-100x-if-500x` promises a 500X on the What If token,
// which Mike's 4b review DELETED (master 4541.98-4570.70). Nothing this comp draws may reference $IF /
// "What If" / a 500X. See constants-tut-doginme-100x.ts for the full guard, for the MEASURED
// base-picture $IF exposure that is REPORTED rather than masked, and for the collision matrix.
//
// Thin data wrapper over the shared LivestreamShort renderer: base video, TRUE-ALPHA overlay layer,
// caption band, code-drawn badges, frame-0 cover and the SFX sequences. There is deliberately NO
// b-roll layer on this clip (Mike's batch-wide Phase 7 directive bans full-screen and content-zone
// b-roll); the reasoning, and the fact that it is a reported DEVIATION from the finalized-short
// coverage item, are documented in constants-tut-doginme-100x.ts and in the clip's BROLL-PLAN.md.
const DATA: ShortData = {
  clip: CLIP_TUT_DGN,
  fps: TUT_DGN_FPS,
  durationS: TUT_DGN_DURATION / TUT_DGN_FPS,
  capY: TUT_DGN_CAP_Y,
  seam: TUT_DGN_SEAM,
  captions: CAPTIONS_TUT_DGN,
  overlays: OVERLAYS_TUT_DGN,
  badges: BADGES_TUT_DGN,
  sounds: SFX_TUT_DGN,
  thumb: THUMB_DEF_TUT_DGN, // durS omitted => ONE frame (frame-0 cover), base video from frame 1
};

export const TutDoginme100x: React.FC = () => <LivestreamShort data={DATA} />;

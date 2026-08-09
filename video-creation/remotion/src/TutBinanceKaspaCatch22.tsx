import React from 'react';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  TUT_BKC_FPS, TUT_BKC_DURATION, TUT_BKC_SEAM, TUT_BKC_CAP_Y,
  CLIP_TUT_BKC, THUMB_DEF_TUT_BKC, OVERLAYS_TUT_BKC, BADGES_TUT_BKC, SFX_TUT_BKC,
} from './constants-tut-binance-kaspa-catch22';
// Captions come from the CANONICAL captions skill output for this clip
// (skills/captions/build_captions.py --style montserrat -> captionsTutBkc.ts, written by the tool).
// Never hand-authored. The STT fixes live in the builder's PHRASE_CORRECTIONS (tutorial 2026-08-09
// clip-3 block) and the two omitted "you know" fillers are patched into
// binance-kaspa-catch22/whisper-words-verified.json by that clip folder's _patch_words.py, so the
// array can always be rebuilt byte-identically. The clip-folder copy
// (shorts/tutorial/binance-kaspa-catch22/captions-binance-kaspa-catch22.ts) is byte-identical.
import { CAPTIONS_TUT_BKC } from './captionsTutBkc';

// batch tutorial / clip #3 "Binance Wants Community Driven Coins. Kaspa Isn't Listed." (variant: FULL).
// ⛔ Clip #7 (`binance-kaspa-catch22-impact`) is the impact cut of the same material and shares this
// batch's public dir. This comp owns ONLY the `broll-tut-bkc-*` / `thumb-tutbkc` assets.
//
// Thin data wrapper over the shared LivestreamShort renderer: base video, TRUE-ALPHA overlay layer,
// caption band, code-drawn badges, frame-0 cover and the SFX sequences. There is deliberately NO
// b-roll layer on this clip (Mike's batch-wide Phase 7 directive bans full-screen and content-zone
// b-roll); the reasoning, and the fact that it is a reported DEVIATION from the finalized-short
// coverage item, are documented in constants-tut-binance-kaspa-catch22.ts and in the clip's
// BROLL-PLAN.md.
const DATA: ShortData = {
  clip: CLIP_TUT_BKC,
  fps: TUT_BKC_FPS,
  durationS: TUT_BKC_DURATION / TUT_BKC_FPS,
  capY: TUT_BKC_CAP_Y,
  seam: TUT_BKC_SEAM,
  captions: CAPTIONS_TUT_BKC,
  overlays: OVERLAYS_TUT_BKC,
  badges: BADGES_TUT_BKC,
  sounds: SFX_TUT_BKC,
  thumb: THUMB_DEF_TUT_BKC, // durS omitted => ONE frame (frame-0 cover), base video from frame 1
};

export const TutBinanceKaspaCatch22: React.FC = () => <LivestreamShort data={DATA} />;

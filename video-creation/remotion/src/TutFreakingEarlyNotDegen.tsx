import React from 'react';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  TUT_FED_FPS, TUT_FED_DURATION, TUT_FED_SEAM, TUT_FED_CAP_Y,
  CLIP_TUT_FED, THUMB_DEF_TUT_FED, OVERLAYS_TUT_FED, BADGES_TUT_FED, SFX_TUT_FED,
} from './constants-tut-freaking-early-not-degen';
// Captions come from the CANONICAL captions skill output for this clip. Never hand-authored; the
// array is rebuilt byte-identically by this EXACT invocation:
//   python video-creation/skills/captions/build_captions.py \
//     --words video-creation/shorts/tutorial/freaking-early-not-degen/whisper-words-verified.json \
//     --style montserrat --var CAPTIONS_TUT_FED \
//     --colorize 'r=degen,die,dies gr=early' --max-secs 2.00 \
//     --out video-creation/remotion/src/captionsTutFed.ts
// 52 captions, median on-screen 0.78 s, mean 0.83 s. The clip-folder copy
// (shorts/tutorial/freaking-early-not-degen/captions-freaking-early-not-degen.ts) is byte-identical.
//
// The three STT fixes live in the tool's PHRASE_CORRECTIONS (tutorial clip-4 block):
//   "the dj mindset" -> "the degen mindset"          (the clip's TITLE line; medium.en confirms "degen")
//   "centralized stations" -> "centralized exchanges" (the tighten plan's caption gate names this span)
//   "like that listed" -> "like that. listed"        (a real sentence end AND the scatter-gather seam,
//                                                     whose 0.320 s gap is under the 0.45 s break)
// plus the two market-cap merges that keep each figure whole ("700 million", "1.8 million."). The
// PROTECTED_DOUBLES entry ("know","thats","thats","the") stops the canonical stutter-collapse eating
// the second "that's" of "you know, that's, that's the degen mindset", which the tighten plan lists
// under "PRESERVED DEVICES, do not dedupe in captions".
//
// --max-secs 2.00 is a GUARD ONLY and is verified BYTE-IDENTICAL to leaving it off: this clip has no
// stretched-word defect (longest held word 0.57 s, "particular"), so nothing binds. 2.00 sits ABOVE the
// longest protected group word-span (1.765 s, "this particular token", which straddles the 0.385 s
// delivery beat inside the protected peak), so the rail can never split a protected beat.
//
// WORD-JSON AUDIT: zero words restored. Unlike clips 1/2/3 this clip's shipped pass does NOT drop
// speech (165 tokens against an independent medium.en pass's 165, aligning 1:1, three lexical
// differences only). What freaking-early-not-degen/_patch_words.py does instead is RE-ANCHOR 20
// misaligned edges to 5 ms RMS; the one that changes the screen is "listed"/"and" at 26.760/27.225,
// where the shipped gap is 0.000 s and the measured silence is 0.465 s.
import { CAPTIONS_TUT_FED } from './captionsTutFed';

// batch tutorial / clip #4 "That's the Degen Mindset. I Don't Trade Like That." (variant: FULL).
// ⛔ Clip #8 (`freaking-early-not-degen-impact`) is a subset of this clip's second segment and shares
// this batch's public dir. This comp owns ONLY the `broll-tut-fed-*` / `thumb-tutfed` assets, and it
// never imports clip #8's retitle claim ("My portfolio is filled with 100x coins.") which this audio
// does not make.
//
// Thin data wrapper over the shared LivestreamShort renderer: base video, TRUE-ALPHA overlay layer,
// caption band, code-drawn badges, frame-0 cover and the SFX sequences. There is deliberately NO
// b-roll layer (Mike's batch-wide Phase 7 directive bans full-screen and content-zone b-roll); the
// reasoning, and the fact that it is a reported DEVIATION from the finalized-short coverage item, are
// documented in constants-tut-freaking-early-not-degen.ts and in the clip's BROLL-PLAN.md.
//
// ⛔⛔ CONTENT GUARD, binding on every element: "700 million" / "1.8 million" are a FUTURE HYPOTHETICAL
// ("I'm going to be like, holy crap..."), never a realised trade, and the token is deliberately
// UNNAMED. The numbers exist ONLY inside his own sentence in the captions; the beat that contains them
// (34.90-38.55 s) is the one deliberately graphic-free beat of the clip. See the constants file.
const DATA: ShortData = {
  clip: CLIP_TUT_FED,
  fps: TUT_FED_FPS,
  durationS: TUT_FED_DURATION / TUT_FED_FPS,
  capY: TUT_FED_CAP_Y,
  seam: TUT_FED_SEAM,
  captions: CAPTIONS_TUT_FED,
  overlays: OVERLAYS_TUT_FED,
  badges: BADGES_TUT_FED,
  sounds: SFX_TUT_FED,
  thumb: THUMB_DEF_TUT_FED, // durS omitted => ONE frame (frame-0 cover), base video from frame 1
};

export const TutFreakingEarlyNotDegen: React.FC = () => <LivestreamShort data={DATA} />;

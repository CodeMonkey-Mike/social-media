import React from 'react';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  TUT_FEI_FPS, TUT_FEI_DURATION, TUT_FEI_SEAM, TUT_FEI_CAP_Y,
  CLIP_TUT_FEI, THUMB_DEF_TUT_FEI, OVERLAYS_TUT_FEI, BADGES_TUT_FEI, SFX_TUT_FEI,
} from './constants-tut-fed-impact';
// Captions come from the CANONICAL captions skill output for this clip. Never hand-authored; the
// array is rebuilt byte-identically by this EXACT invocation:
//   python video-creation/skills/captions/build_captions.py \
//     --words video-creation/shorts/tutorial/freaking-early-not-degen-impact/whisper-words-verified.json \
//     --style montserrat --var CAPTIONS_TUT_FEI \
//     --colorize 'r=die gr=early' --max-secs 2.00 --quote 5.98:15.634 \
//     --out video-creation/remotion/src/captionsTutFei.ts
// 23 captions, median on-screen 0.68 s, mean 0.87 s, min 0.34 s, max 2.68 s. The 2.68 s outlier is
// `this particular token` at 9.16 s and it is CORRECT, not a pacing defect: its WORD span is only
// 1.760 s, and the extra 0.92 s is the protected delivery beat 10.920-11.838 that follows it, so the
// caption HOLDS the frame while he deliberately pauses instead of blanking or advancing early.
//
// ★ `--quote 5.98:15.634` IS THE CONDITIONAL-FRAME GUARD, and it is the single most important line in
// this build. This clip's payload is a FUTURE HYPOTHETICAL ("I'm gonna be like, holy crap, I was so
// freaking early, like this particular token is like 700 million and I got in at like 1.8 million"),
// the token is deliberately UNNAMED, and the base screen-share happens to be a real named token page
// showing MKT CAP $3.1M - a similar order of magnitude to the figure he says - so a FLAT caption would
// read as a receipt for a position he never claims to hold. The flag renders the imagined sentence as
// QUOTED SPEECH: an opening mark on "holy" (5.980), a closing mark on "1.8 million." (ends 15.634), and
// a RE-OPENING mark after each pause longer than the 0.45 s group-break inside the span (the 0.743 s
// beat at 6.560-7.303 and the 0.918 s beat at 10.920-11.838). AS BUILT that yields:
//     { t: 5.80, h: 'like "holy crap.' }        <- opens on his verbatim lead-in
//     { t: 7.30, h: '"i was so' }               <- re-opens after the 0.743 s beat
//     { t: 11.84, h: '"is like 700 million' }   <- THE FIGURE IS VISIBLY INSIDE A QUOTATION
//     { t: 14.44, h: 'like 1.8 million."' }     <- closes the hypothetical before "that's what I'm..."
// so the caption a viewer sees at the exact moment the market cap is spoken carries a quote mark, and
// no viewer joining mid-clip sees a bare figure. The marks are PRESENTATIONAL (injected at emit time,
// never into a token), so grouping, the gap break, the sentence break, the word caps and --max-secs are
// provably untouched. The flag defaults to OFF, which is why adding it left clip 4's shipped captions
// BYTE-IDENTICAL (verified by rebuilding them and diffing).
// Deliberately NOT done, per the same guard: no colour highlight, badge, arrow or multiplier on either
// figure. The colorize set is `r=die gr=early` - clip 4's set minus the two tokens ("degen", "dies")
// that do not occur in this shorter cut - so the only coloured words in the clip are the WIN ("early",
// green) and the thing he rejects ("die", red). Nothing points at the numbers.
//
// --max-secs 2.00 is a GUARD ONLY and is verified BYTE-IDENTICAL to leaving it off: this clip has no
// stretched-word defect (longest held single word 0.860 s, the merged "700 million"), so nothing binds.
// 2.00 sits ABOVE the longest group word-span (1.760 s, "this particular token", which straddles the
// 0.384 s delivery beat), so the rail can never split a protected beat.
//
// WORD-JSON AUDIT: zero words restored - the audit is CLEAN. Unlike clips 1/2/3 this clip's shipped
// pass does NOT drop speech: it returns 73 tokens against an independent medium.en pass's 72, aligning
// 1:1, and the extra token is a real word medium.en missed ("the ones THAT are gonna pump"), so the
// shipped stream is the superset. What freaking-early-not-degen-impact/_patch_words.py does instead is
// RE-ANCHOR 11 misaligned edges to 5 ms RMS and undo ONE phantom token split. The three that change
// the screen: " and" at 3.820 -> 4.295 (shipped gap 0.000 s across a measured 0.464 s pause); " is" at
// 10.920 -> 11.838, which moves a stranded 1.12 s "is" OUT of the 0.918 s suspense beat; and the
// phantom split " and"+" I" -> " at", which turns the ungrammatical "and i got in and i" into "and i
// got in at" (the reading clip 4's independent pass on the identical audio and this clip's own tighten
// note both give).
import { CAPTIONS_TUT_FEI } from './captionsTutFei';

// batch tutorial / clip #8 "freaking-early-not-degen-impact" (variant: IMPACT, 20.12 s spine).
// ⛔ Clip #4 (`freaking-early-not-degen`, comp TutFreakingEarlyNotDegen) is the FULL cut of this same
// moment and SHARES THIS CLIP'S AUDIO. This comp owns ONLY the `broll-tut-fei-*` / `thumb-tutfei`
// assets and must never reference clip 4's `broll-tut-fed-*` / `thumb-tutfed.png` or any other
// sibling's assets, even though all eight clips share one public dir.
//
// ⛔ Mike's verbatim 4b retitle for THIS clip is "My portfolio is filled with 100x coins." That claim
// is FLAGGED because the audio does not make it, and it is imported into NOTHING here - not the cover,
// not a badge, not a caption. The on-screen copy stays with what the audio actually says.
//
// Thin data wrapper over the shared LivestreamShort renderer: base video, TRUE-ALPHA overlay layer,
// caption band, code-drawn badges, frame-0 cover and the SFX sequences. There is deliberately NO
// b-roll layer (Mike's batch-wide Phase 7 directive bans full-screen and content-zone b-roll); the
// reasoning, and the fact that it is a reported DEVIATION from the finalized-short coverage item, are
// documented in constants-tut-fed-impact.ts and in the clip's BROLL-PLAN.md.
//
// ⛔⛔ CONTENT GUARD, binding on every element: the 700M / 1.8M figures are a FUTURE HYPOTHETICAL, the
// token is deliberately UNNAMED, and the base picture (a real named token page at MKT CAP $3.1M, plus
// an "IT'S TIME TO GO ALL-IN" ad banner) makes the false "he holds it" reading MORE plausible. The
// numbers therefore exist ONLY inside his own QUOTED sentence in the captions, and the 6.55 s window
// 9.20-15.75 that contains them is the clip's one deliberately graphic-free stretch. See the constants
// file for all six clauses.
const DATA: ShortData = {
  clip: CLIP_TUT_FEI,
  fps: TUT_FEI_FPS,
  durationS: TUT_FEI_DURATION / TUT_FEI_FPS,
  capY: TUT_FEI_CAP_Y,
  seam: TUT_FEI_SEAM,
  captions: CAPTIONS_TUT_FEI,
  overlays: OVERLAYS_TUT_FEI,
  badges: BADGES_TUT_FEI,
  sounds: SFX_TUT_FEI,
  thumb: THUMB_DEF_TUT_FEI, // durS omitted => ONE frame (frame-0 cover), base video from frame 1
};

export const TutFreakingEarlyNotDegenImpact: React.FC = () => <LivestreamShort data={DATA} />;

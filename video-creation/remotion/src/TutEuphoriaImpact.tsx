import React from 'react';
import { AbsoluteFill, Img, useCurrentFrame } from 'remotion';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import {
  TUT6_FPS, TUT6_DURATION, TUT6_SEAM, TUT6_CAP_Y,
  CLIP_TUT6, THUMB_DEF_TUT6, OVERLAYS_TUT6, BADGES_TUT6, SFX_TUT6,
  TAIL_HOLD_TUT6, TUT6_TAIL_FROM,
} from './constants-tut-euphoria-impact';
// Captions come from the CANONICAL captions skill output for this clip
// (skills/captions/build_captions.py --style montserrat --max-secs 2.8 -> captionsTutEuphImpact.ts,
// written by the tool). Never hand-authored and never lifted from another composition. The STT fixes
// live in the builder's PHRASE_CORRECTIONS / PROTECTED_DOUBLES and the held-vowel re-seat lives in
// tut-94x-euphoria-impact/_patch_words.py, so the array can always be rebuilt byte-identically. The
// clip-folder copy (shorts/tutorial/tut-94x-euphoria-impact/captions-tut-94x-euphoria-impact.ts) is
// byte-identical to that file.
import { CAPTIONS_TUT_EUPHORIA_IMPACT } from './captionsTutEuphImpact';

// batch tutorial / clip #6 "Look, Look, Holy Crap: The 94X, Then a 550X One Week Later" (impact).
// Thin data wrapper over the shared LivestreamShort renderer: base video, caption band, transparent
// overlay stickers, code-drawn badges, the frame-0 cover and the SFX sequences.
//
// ⛔ NO `broll` KEY ON PURPOSE. Mike's Phase 7 directive for the whole `tutorial` batch bans
// full-screen AND content-zone b-roll (tighten-plan.json -> mike_4b.build_directives); only
// captions, SFX and transparent overlay graphics are allowed. Passing `broll` here would mount the
// BrollLayer and violate that. Declared as a deviation from finalized-short contract item 4 in the
// build report and in constants-tut-euphoria-impact.ts, never silently waived.
//
// ⛔ NOTHING (overlay, badge or SFX) exists at t >= 22.30: clip 22.94-28.20 is a Schwarzenegger
// SOUNDBOARD DROP, not Mike, and it ends the clip. Captions only over it.
const DATA: ShortData = {
  clip: CLIP_TUT6,
  fps: TUT6_FPS,
  durationS: TUT6_DURATION / TUT6_FPS,
  capY: TUT6_CAP_Y,
  seam: TUT6_SEAM,
  captions: CAPTIONS_TUT_EUPHORIA_IMPACT,
  overlays: OVERLAYS_TUT6,
  badges: BADGES_TUT6,
  sounds: SFX_TUT6,
  thumb: THUMB_DEF_TUT6, // durS omitted => ONE frame (frame-0 cover), base video from frame 1
};

// TAIL PICTURE REPAIR — see constants-tut-euphoria-impact.ts (TAIL_HOLD_TUT6). The spine's picture
// dies 0.54 s before its audio: frames 691-699 (t 27.640-28.000) are PURE BLACK and 700-703 snap back
// to the base layout, while the soundboard drop plays on to 28.18. Holding the last good Arnold frame
// from 27.6333 keeps the payoff on his face. zIndex 100 puts it above the base video but BELOW the
// captions (150), so "planet." still burns in over it; overlays (120) and badges (130) do not exist
// at this time by the hard guard, so nothing else can collide here.
const TailHold: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < TUT6_TAIL_FROM) return null;
  return (
    <AbsoluteFill style={{ zIndex: 100 }}>
      <Img src={TAIL_HOLD_TUT6} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </AbsoluteFill>
  );
};

export const TutEuphoriaImpact: React.FC = () => (
  <>
    <LivestreamShort data={DATA} />
    <TailHold />
  </>
);

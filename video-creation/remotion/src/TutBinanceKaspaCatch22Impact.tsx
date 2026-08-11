import React from 'react';
import { AbsoluteFill, useCurrentFrame, spring } from 'remotion';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import { fadeInOut, TEAL, RED } from './_kit';
import {
  TUT_BKI_FPS, TUT_BKI_DURATION, TUT_BKI_SEAM, TUT_BKI_CAP_Y,
  CLIP_TUT_BKI, THUMB_DEF_TUT_BKI, OVERLAYS_TUT_BKI, BADGES_TUT_BKI, SFX_TUT_BKI, LOOP_TUT_BKI,
} from './constants-tut-bkc-impact';
// Captions come from the CANONICAL captions skill output for this clip. Never hand-authored.
// EXACT invocation (recorded so the array can always be rebuilt byte-identically):
//   python video-creation/skills/captions/build_captions.py \
//     --words video-creation/shorts/tutorial/binance-kaspa-catch22-impact/whisper-words-verified.json \
//     --style montserrat --var CAPTIONS_TUT_BKI \
//     --colorize "g=kaspa,kaspa's y=binance r=catch-22" --max-secs 2.00 \
//     --out video-creation/remotion/src/captionsTutBki.ts
// --max-secs 2.00 is a pure RAIL: verified byte-identical to --max-secs off, and it sits above this
// clip's longest measured caption group (1.57 s, "binance gives the", which carries a genuinely
// stretched 0.80 s "the") and above its longest single token, so it can never split a held word or the
// protected beat. The STT fixes are the sibling clip-3 block in the builder's PHRASE_CORRECTIONS plus
// two clip-7-only rules keyed so they cannot match clip 3 (verified: clip 3 re-renders byte-identical).
// Zero words were restored by whisper-words-verified.json - the pass drops NO speech on this clip - it
// only RE-ANCHORS two onsets onto measured RMS (see binance-kaspa-catch22-impact/_patch_words.py).
// The clip-folder copy (captions-binance-kaspa-catch22-impact.ts) is byte-identical.
import { CAPTIONS_TUT_BKI } from './captionsTutBki';

// batch tutorial / clip #7 "They Don't Apply the Same Logic to Kaspa" (variant: IMPACT).
// ⛔ Clip #3 (`binance-kaspa-catch22`) is the FULL cut of the same material, finished first, and shares
// this batch's public dir. This comp owns ONLY the `broll-tut-bki-*` / `thumb-tutbki` assets and must
// never reference clip #3's `broll-tut-bkc-ov-*` / `thumb-tutbkc`.
//
// Thin data wrapper over the shared LivestreamShort renderer (base video, TRUE-ALPHA overlay layer,
// caption band, code-drawn badges, frame-0 cover, SFX sequences) PLUS one clip-local code-drawn SVG:
// the catch-22 loop on the punchline. There is deliberately NO b-roll layer (Mike's batch-wide Phase 7
// directive bans full-screen and content-zone b-roll); the reasoning, and the fact that it is a
// reported DEVIATION from the finalized-short coverage item, are documented in
// constants-tut-bkc-impact.ts and in the clip's BROLL-PLAN.md.
const DATA: ShortData = {
  clip: CLIP_TUT_BKI,
  fps: TUT_BKI_FPS,
  durationS: TUT_BKI_DURATION / TUT_BKI_FPS,
  capY: TUT_BKI_CAP_Y,
  seam: TUT_BKI_SEAM,
  captions: CAPTIONS_TUT_BKI,
  overlays: OVERLAYS_TUT_BKI,
  badges: BADGES_TUT_BKI,
  sounds: SFX_TUT_BKI,
  thumb: THUMB_DEF_TUT_BKI, // durS omitted => ONE frame (frame-0 cover), base video from frame 1
};

// ─── The CODE-DRAWN catch-22 loop (punchline graphic, no image asset) ───────────────────────────
// A teal circular arrow chasing its own tail (two 160-degree arcs, each ending in an arrowhead, the
// second being the first rotated 180 degrees about the centre) with a SHUT red padlock in the middle:
// the listing gate, locked, inside a loop that cannot be exited. Nothing here depicts or names an
// exchange, and no wordmark or coin symbol is drawn.
// It is a SIBLING of <LivestreamShort/>, so it would paint above the frame-0 cover (zIndex 300) if it
// were ever visible at t 0 - it is gated on t >= tIn (17.05 s), so it cannot be.
const CatchLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / TUT_BKI_FPS;
  const ev = LOOP_TUT_BKI;
  if (t < ev.tIn || t >= ev.tOut) return null;
  // tOut (19.30) is PAST the comp end (last frame t 18.9667), so this fade-out never starts and the
  // clip hard-outs at full opacity.
  const op = fadeInOut(t, ev.tIn, ev.tOut, 0.18);
  const sc = spring({
    frame: Math.round((t - ev.tIn) * TUT_BKI_FPS), fps: TUT_BKI_FPS,
    config: { damping: 12, stiffness: 300 }, from: 0.5, to: 1.0,
  });
  const spin = (t - ev.tIn) * 34;          // deg/s, the loop turning slowly
  const float = Math.sin((t - ev.tIn) * 2.2) * 10;
  const ARC = 'M 113.5 23.2 A 78 78 0 0 1 113.5 176.8';
  const arm = (
    <>
      <path d={ARC} fill="none" stroke={TEAL} strokeWidth={13} strokeLinecap="round" />
      <g transform="translate(113.5 176.8) rotate(170)">
        <polygon points="0,-14 25,0 0,14" fill={TEAL} />
      </g>
    </>
  );
  return (
    <AbsoluteFill style={{ zIndex: 125, pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', top: ev.top, left: ev.left, width: ev.size, height: ev.size,
        opacity: op, transform: `translateY(${float}px) scale(${sc})`,
        filter: 'drop-shadow(0 0 18px rgba(0,229,255,0.85)) drop-shadow(0 0 36px rgba(0,229,255,0.42))',
      }}>
        <svg viewBox="0 0 200 200" width="100%" height="100%">
          <g transform={`rotate(${spin} 100 100)`}>
            {arm}
            <g transform="rotate(180 100 100)">{arm}</g>
          </g>
          {/* padlock, SHUT */}
          <path d="M 82 98 L 82 84 A 18 18 0 0 1 118 84 L 118 98" fill="none" stroke={RED}
                strokeWidth={10} strokeLinecap="round" />
          <rect x={70} y={96} width={60} height={48} rx={9} fill={RED} />
          <circle cx={100} cy={116} r={6} fill="#2a0509" />
          <rect x={97} y={118} width={6} height={14} rx={3} fill="#2a0509" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

export const TutBinanceKaspaCatch22Impact: React.FC = () => (
  <>
    <LivestreamShort data={DATA} />
    <CatchLoop />
  </>
);

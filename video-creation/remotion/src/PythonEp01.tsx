/**
 * python EP01 — "Learning Python for AI Engineering"
 * longform-edited 16:9. Built to media/python/AS-RECORDED.md (house rule #6), NOT to SCREENPLAY.md.
 *
 * MODEL (comp-build.md §0): the spine is one continuous gated-face OffthreadVideo (face baked on the
 * 7 FACE windows, black on every COVER beat). We never cut it; containers ride over the black.
 *
 * THIS VIDEO'S DELIBERATE DEVIATIONS — both are Mike's rulings, both are recorded in TRANSITIONS.md:
 *   1. NO CARD PAUSES ARE BAKED. All four cards land on clean sentence boundaries over the running
 *      spine, so sh() is the identity and every cue time below is already final-video seconds.
 *      DUR = spine length exactly. (Nothing to remap; there is no d.paused stage.)
 *   2. EVERY transition is a plain crossfade (rmn:fade equivalent, done as an opacity ramp so the
 *      sync-locked spine is never wrapped in TransitionSeries). No glitch, no film burn, no punch-ins.
 *      This WAIVES longform-edited PRE-RENDER GATE item #3 for this project; see TRANSITIONS.md.
 *   3. NO CAPTIONS anywhere (Mike, 2026-08-05). There is no caption layer and no CAPTION_SRC.
 *
 * Music is NOT in this comp (comp-build.md §0) — five beds are ffmpeg-mixed on afterwards by
 * media/python/mix-music.sh, so an audio change never forces a re-render.
 */
import React from 'react';
import {
  AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile,
  interpolate, useCurrentFrame, useVideoConfig,
} from 'remotion';

export const FPS = 30;
const SPINE_SECS = 305.2;
export const DUR = Math.round(SPINE_SECS * FPS); // 9156 frames — no card pauses baked

// sh() is the identity for this video (no baked pauses). Kept so every cue still routes through one
// place; if a pause is ever baked, change ONLY this function.
const sh = (t: number) => t;
const F = (t: number) => Math.round(sh(t) * FPS);

const XF = 0.30; // crossfade seconds, cover<->cover and cover<->face
const CARD_XF = 0.35;

const fill: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };

// ─────────────────────────────────────────────────────────────────────────────
// COVER layer. kind 'deck' = a rich FULL overview slide (6 of them, one per chapter, each shown
// ONCE); kind 'container' = a spotlight break-up of one sub-point. Both are code-rendered PNGs
// (assets/ctr/<ref>.png, 2400x1350). Contiguous over every non-FACE second; the
// 7 gaps are the FACE windows where the baked spine shows through.
// ─────────────────────────────────────────────────────────────────────────────
// `state` is the explicit spotlight decision each container carries (lint-covers MULTI-CARD
// OVERVIEW discipline): one sub-point by default, 'overview' only where the whole shape is meant.
type Cover = {
  tIn: number; tOut: number;
  kind: 'deck' | 'container' | 'still' | 'vid' | 'chart';
  ref: string; state: string;
};
const COVERS: Cover[] = [
  // CH1
  { tIn: 0.00,   tOut: 2.60,   kind: 'container', ref: 'c1a-prompt' , state: 'spotlight'},
  { tIn: 2.60,   tOut: 5.66,   kind: 'container', ref: 'c1b-generated' , state: 'spotlight'},
  // FACE 1  5.66 -> 9.82
  { tIn: 9.82,   tOut: 14.60,  kind: 'deck', ref: 'c2-amplifier' , state: 'overview'},
  { tIn: 14.60,  tOut: 18.90,  kind: 'container', ref: 'c3-skilled' , state: 'spotlight'},
  { tIn: 18.90,  tOut: 21.90,  kind: 'still', ref: 'broll-py01t2w5-chrome-android-wide' , state: 'atmosphere'},
  { tIn: 21.90,  tOut: 27.40,  kind: 'container', ref: 'c4-unskilled' , state: 'spotlight'},
  { tIn: 27.40,  tOut: 29.82,  kind: 'still', ref: 'broll-py01c4r7-scrolling-past-code' , state: 'atmosphere'},
  // FACE 2  29.82 -> 36.42   (CARD-A overlays at 33.70)
  // CH2 — the ad-lib block
  { tIn: 36.42,  tOut: 41.30,  kind: 'container', ref: 'c6-series' , state: 'spotlight'},
  { tIn: 41.30,  tOut: 43.50,  kind: 'vid', ref: 'e1-dark-room' , state: 'atmosphere'},
  { tIn: 43.50,  tOut: 48.30,  kind: 'container', ref: 'c8-jspython' , state: 'spotlight'},
  { tIn: 48.30,  tOut: 58.50,  kind: 'container', ref: 'c9-audience' , state: 'comparison'},
  { tIn: 58.50,  tOut: 66.30,  kind: 'container', ref: 'c10-cadence' , state: 'spotlight'},
  { tIn: 66.30,  tOut: 72.90,  kind: 'chart', ref: 'ramp-anim' , state: 'spotlight'},
  { tIn: 72.90,  tOut: 81.40,  kind: 'deck', ref: 'c12-curriculum' , state: 'overview'},
  { tIn: 81.40,  tOut: 85.96,  kind: 'container', ref: 'c12b-curriculum-cut' , state: 'overview'},
  { tIn: 85.96,  tOut: 93.46,  kind: 'container', ref: 'c13-scope' , state: 'spotlight'},
  { tIn: 93.46,  tOut: 97.38,  kind: 'vid', ref: 'e2-hands-coding' , state: 'atmosphere'},
  { tIn: 97.38,  tOut: 102.60, kind: 'container', ref: 'c15-skip' , state: 'spotlight'},
  { tIn: 102.60, tOut: 107.52, kind: 'container', ref: 'c16-heycomputer' , state: 'spotlight'},
  // FACE 3  107.52 -> 108.92
  // CH3
  { tIn: 108.92, tOut: 114.52, kind: 'container', ref: 'c17a-ladder-binary' , state: 'build-1'},
  { tIn: 114.52, tOut: 124.34, kind: 'deck', ref: 'c17b-ladder' , state: 'overview'},
  { tIn: 124.34, tOut: 128.90, kind: 'container', ref: 'c18-print' , state: 'spotlight'},
  { tIn: 128.90, tOut: 132.54, kind: 'container', ref: 'c19-translator' , state: 'spotlight'},
  { tIn: 132.54, tOut: 142.26, kind: 'container', ref: 'c20-underhood' , state: 'spotlight'},
  { tIn: 142.26, tOut: 153.70, kind: 'container', ref: 'c21-frontdoor' , state: 'spotlight'},
  // CARD-B overlays at 152.22
  // CH4
  { tIn: 153.70, tOut: 158.90, kind: 'container', ref: 'c22-question' , state: 'spotlight'},
  { tIn: 158.90, tOut: 167.30, kind: 'container', ref: 'c23-lanes' , state: 'comparison'},
  { tIn: 167.30, tOut: 170.40, kind: 'container', ref: 'c23b-lanes-build' , state: 'comparison'},
  { tIn: 170.40, tOut: 173.20, kind: 'deck', ref: 'c24-groups' , state: 'overview'},
  { tIn: 173.20, tOut: 183.20, kind: 'container', ref: 'c24a-fundamentals' , state: 'spotlight-1'},
  { tIn: 183.20, tOut: 193.00, kind: 'container', ref: 'c24b-apis' , state: 'spotlight-2'},
  { tIn: 193.00, tOut: 196.80, kind: 'still', ref: 'broll-py01n8m2-three-in-the-morning' , state: 'atmosphere'},
  { tIn: 196.80, tOut: 200.60, kind: 'container', ref: 'c24c-files' , state: 'spotlight-3'},
  { tIn: 200.60, tOut: 209.60, kind: 'container', ref: 'c24d-environments' , state: 'spotlight-4'},
  { tIn: 209.60, tOut: 213.46, kind: 'container', ref: 'c25-collision' , state: 'spotlight'},
  // FACE 4  213.46 -> 215.50
  // CH5   (CARD-C overlays at 215.50)
  { tIn: 215.50, tOut: 219.40, kind: 'container', ref: 'c26-groups-done' , state: 'overview'},
  { tIn: 219.40, tOut: 224.06, kind: 'container', ref: 'c27-portfolio' , state: 'spotlight'},
  // FACE 5  224.06 -> 226.50
  { tIn: 226.50, tOut: 234.50, kind: 'container', ref: 'c28a-stack-call' , state: 'build-1'},
  { tIn: 234.50, tOut: 241.80, kind: 'container', ref: 'c28b-stack-sat' , state: 'spotlight'},
  { tIn: 241.80, tOut: 246.30, kind: 'container', ref: 'c28c-stack-memory' , state: 'build-2'},
  { tIn: 246.30, tOut: 250.10, kind: 'container', ref: 'c28d-stack-docs' , state: 'build-3'},
  { tIn: 250.10, tOut: 254.00, kind: 'container', ref: 'c28e-stack-tools' , state: 'build-4'},
  { tIn: 254.00, tOut: 256.60, kind: 'deck', ref: 'c28f-stack-agent' , state: 'overview'},
  { tIn: 256.60, tOut: 264.30, kind: 'container', ref: 'c29-onesystem' , state: 'comparison'},
  // CH6   (CARD-D overlays at 262.80)
  { tIn: 264.30, tOut: 266.90, kind: 'vid', ref: 'e3-focus-typing' , state: 'atmosphere'},
  { tIn: 266.90, tOut: 273.10, kind: 'container', ref: 'c31-split40h' , state: 'comparison'},
  { tIn: 273.10, tOut: 283.33, kind: 'deck', ref: 'c32-rulecard' , state: 'comparison'},
  // FACE 6  283.33 -> 285.56
  { tIn: 285.56, tOut: 295.96, kind: 'container', ref: 'c33-checks' , state: 'overview'},
  // FACE 7  295.96 -> 305.20  (readiness payoff + the ask + sign-off, runs to the last frame)
];

// Chapter / title cards — a separate overlay layer on top of whatever is underneath.
// One per music-bed change (TRANSITIONS.md §1). Held so the text is fully readable >= 1.0s.
type Card = { t: number; hold: number; ref: string };
const CARDS: Card[] = [
  { t: 33.70,  hold: 1.75, ref: 'card-title' }, // the VIDEO title card; also hides the face-to-face CH1/CH2 join
  { t: 152.22, hold: 1.70, ref: 'card-need' },
  { t: 215.50, hold: 1.65, ref: 'card-build' },
  { t: 262.80, hold: 1.65, ref: 'card-rule' },
];
// Readability assert (comp-build §6): full-opacity hold must be >= 1.0s.
for (const c of CARDS) {
  const readable = c.hold - CARD_XF; // fade in eats CARD_XF; fade out starts at hold
  if (readable < 1.0) throw new Error(`CARD ${c.ref}: only ${readable.toFixed(2)}s readable, need >= 1.0s`);
}

/** Opacity ramp: fades a layer in over `xf` and out over `xf`. The ONLY transition in this video. */
const useXfade = (localFrame: number, durFrames: number, xf: number) => {
  const f = Math.round(xf * FPS);
  return interpolate(
    localFrame,
    [0, f, Math.max(f + 1, durFrames - f), durFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
};

/** A container still. Very slow push-in so a held still never reads as a frozen frame. */
const Deck: React.FC<{ refName: string; durFrames: number; xf: number }> = ({ refName, durFrames, xf }) => {
  const frame = useCurrentFrame();
  const opacity = useXfade(frame, durFrames, xf);
  const scale = interpolate(frame, [0, durFrames], [1, 1.03], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{ opacity, backgroundColor: '#0a0c10' }}>
      <Img src={staticFile(`ctr/${refName}.png`)} style={{ ...fill, transform: `scale(${scale})` }} />
    </AbsoluteFill>
  );
};

/** ChatGPT atmosphere still. Same slow push-in; sits in the same palette as the containers. */
const Still: React.FC<{ refName: string; durFrames: number; xf: number }> = ({ refName, durFrames, xf }) => {
  const frame = useCurrentFrame();
  const opacity = useXfade(frame, durFrames, xf);
  const scale = interpolate(frame, [0, durFrames], [1.02, 1.07], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{ opacity, backgroundColor: '#0a0c10' }}>
      <Img src={staticFile(`img/${refName}.png`)} style={{ ...fill, transform: `scale(${scale})` }} />
    </AbsoluteFill>
  );
};

/** Envato b-roll. Audio was stripped at transcode; `muted` is belt-and-braces. */
const Vid: React.FC<{ refName: string; durFrames: number; xf: number }> = ({ refName, durFrames, xf }) => {
  const frame = useCurrentFrame();
  const opacity = useXfade(frame, durFrames, xf);
  return (
    <AbsoluteFill style={{ opacity, backgroundColor: '#0a0c10' }}>
      <OffthreadVideo src={staticFile(`vid/${refName}.mp4`)} muted style={fill} />
    </AbsoluteFill>
  );
};

/**
 * THE ANIMATED RAMP CHART (Mike, 2026-08-05: "at 1:10, we should animate that chart").
 * A real useCurrentFrame draw, not a bitmap reveal: the curve grows along its own length via
 * stroke-dashoffset, the endpoint dot rides the head of the line, and the two axis captions
 * fade in as the curve reaches them. Geometry matches the c11-ramp still exactly.
 */
const PATH_D = 'M60 285 C 480 280, 760 210, 1000 140 S 1300 40, 1440 30';
const PATH_LEN = 1560; // generous over-estimate; dashoffset clamps at 0 so it just finishes early

const RampChart: React.FC<{ durFrames: number; xf: number }> = ({ durFrames, xf }) => {
  const frame = useCurrentFrame();
  const opacity = useXfade(frame, durFrames, xf);
  const drawStart = Math.round(0.45 * FPS);
  const drawEnd = Math.round(durFrames - 1.1 * FPS);
  const p = interpolate(frame, [drawStart, drawEnd], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  // ease-in-out so the curve accelerates through the middle like the difficulty it describes
  const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
  const endLabel = interpolate(p, [0.72, 0.95], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const startLabel = interpolate(p, [0.02, 0.18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ opacity, backgroundColor: '#0a0c10' }}>
      <Img src={staticFile('ctr/c11-ramp-plate.png')} style={fill} />
      <AbsoluteFill style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <linearGradient id="rampg" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#00c2ff" />
              <stop offset="100%" stopColor="#00e68a" />
            </linearGradient>
          </defs>
          <g transform="translate(196, 592)">
            <line x1="60" y1="290" x2="1460" y2="290" stroke="#1e2330" strokeWidth={3} />
            <path
              d={PATH_D}
              fill="none"
              stroke="url(#rampg)"
              strokeWidth={7}
              strokeLinecap="round"
              strokeDasharray={PATH_LEN}
              strokeDashoffset={PATH_LEN * (1 - eased)}
            />
            <circle cx={60} cy={285} r={12} fill="#00c2ff" opacity={startLabel} />
            <circle cx={1440} cy={30} r={12} fill="#00e68a" opacity={endLabel} />
            <text x={60} y={330} fontFamily="DM Sans, sans-serif" fontSize={27} fill="#8892a4" opacity={startLabel}>
              very beginner level
            </text>
            <text x={1210} y={330} fontFamily="DM Sans, sans-serif" fontSize={27} fill="#8892a4" opacity={endLabel}>
              more complex stuff
            </text>
          </g>
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const PythonEp01: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0c10' }}>
      {/* the gated-face spine: face on the 7 FACE windows, black everywhere else */}
      <OffthreadVideo src={staticFile('spine.mp4')} style={fill} />

      {/* COVER layer */}
      {COVERS.map((c) => {
        const from = F(c.tIn);
        const dur = F(c.tOut) - from;
        return (
          <Sequence key={`${c.ref}-${from}`} from={from} durationInFrames={dur}>
            {c.kind === 'still' ? <Still refName={c.ref} durFrames={dur} xf={XF} />
              : c.kind === 'vid' ? <Vid refName={c.ref} durFrames={dur} xf={XF} />
              : c.kind === 'chart' ? <RampChart durFrames={dur} xf={XF} />
              : <Deck refName={c.ref} durFrames={dur} xf={XF} />}
          </Sequence>
        );
      })}

      {/* CHAPTER / TITLE CARDS, on top of everything */}
      {CARDS.map((c) => {
        const from = F(c.t);
        const dur = Math.round((c.hold + CARD_XF) * FPS);
        return (
          <Sequence key={`${c.ref}-${from}`} from={from} durationInFrames={dur}>
            <Deck refName={c.ref} durFrames={dur} xf={CARD_XF} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

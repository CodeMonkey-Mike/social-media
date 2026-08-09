/**
 * python EP01 — VERTICAL (1080x1920) cut of "Learning Python for AI Engineering".
 *
 * Derived from PythonEp01.tsx per longform-edited/skills/vertical-repurpose.md. The content is
 * LOCKED: same FPS, same DUR, same beat times, same COVERS/CARDS arrays, same crossfade-only
 * transition language. ONLY the FRAMING changes.
 *
 * What differs from the 16:9, and why:
 *   1. SPINE — objectFit:cover + objectPosition '71.4% center'. Mike is NOT centred in the 16:9
 *      frame: measured at 62-68% across, mean 64.6% (green mask G>25 & G>R*1.6 & G>B*1.6 — this
 *      green screen is dark, RGB 0,51,8, so the documented G>60 mask matched ~nothing). A centre
 *      crop would cut him in half. See vertical-repurpose.md §1b.
 *   2. CONTAINERS/CARDS — read from `ctr-v-render/` (1350x2400), genuinely REFLOWED portrait
 *      screenshots off containers-vertical.html, not crops of the 16:9 PNGs.
 *   3. AI STILLS — read from `img-v/` (941x1672), regenerated at true 9:16 anchored on their 16:9
 *      originals via --reference-image. Different filenames, so STILL_V maps ref -> vertical file.
 *   4. ENVATO B-ROLL — re-sourced NATIVE VERTICAL (see VID_V). Slot 3's vertical pick is a Python
 *      code-scroll rather than the 16:9 keyboard macro, so its file is named e3-python-code; the
 *      COVERS ref stays `e3-focus-typing` so the arrays are diffable against the 16:9.
 *   5. RAMP CHART — RE-LAID OUT for portrait in code (skill §1: never letterbox the 16:9 layout).
 *      The curve is re-authored in the 1080x1920 viewBox with a 700px rise, not the 16:9 path
 *      scaled down to a thin band. Same ts contract, same beat times, same draw-on animation.
 *
 * Public dir for the render is media/python/assets-v (lean: ctr-v-render + img-v + vid-v + spine).
 */
import React from 'react';
import {
  AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile,
  interpolate, useCurrentFrame, useVideoConfig,
} from 'remotion';

export const FPS = 30;
const SPINE_SECS = 305.2;
export const DUR = Math.round(SPINE_SECS * FPS); // 9156 frames — identical to the 16:9

// sh() is the identity for this video (no baked pauses), same as the 16:9.
const sh = (t: number) => t;
const F = (t: number) => Math.round(sh(t) * FPS);

const XF = 0.30;
const CARD_XF = 0.35;

const fill: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };

/** The measured face crop (vertical-repurpose.md §1b). Mean subject centre = 64.6% of the 1920 */
/** frame; that lands the 1080-wide window at source x 937..1545, so 62% and 68% both sit clear  */
/** of both edges (450 px and 656 px in). NEVER change this to 'center'.                          */
const SPINE_OBJECT_POSITION = '71.4% center';

// ─────────────────────────────────────────────────────────────────────────────
// COVER layer — byte-for-byte the same beats as PythonEp01.tsx.
// ─────────────────────────────────────────────────────────────────────────────
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

// OVERVIEW_REFS: c24-groups
// (end declared refs) — c24-groups is the sanctioned ONE all-cards-at-once overview for CH4
// (comp-build.md §5): the "four things you need" shape is shown once for 2.8s and then broken into
// the c24a/b/c/d spotlights. The PORTRAIT reflow stacks those four cards, which is why
// lint-deck-containers sees big card-boxes here and did not in the 16:9 — same slide, taller layout.

type Card = { t: number; hold: number; ref: string };
const CARDS: Card[] = [
  { t: 33.70,  hold: 1.75, ref: 'card-title' },
  { t: 152.22, hold: 1.70, ref: 'card-need' },
  { t: 215.50, hold: 1.65, ref: 'card-build' },
  { t: 262.80, hold: 1.65, ref: 'card-rule' },
];
for (const c of CARDS) {
  const readable = c.hold - CARD_XF;
  if (readable < 1.0) throw new Error(`CARD ${c.ref}: only ${readable.toFixed(2)}s readable, need >= 1.0s`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 16:9 ref -> NATIVE VERTICAL asset. Keeping COVERS identical to the 16:9 means the two comps
// diff cleanly; the reframing lives entirely in these two tables.
// ─────────────────────────────────────────────────────────────────────────────
const STILL_V: Record<string, string> = {
  'broll-py01t2w5-chrome-android-wide':  'broll-py01v1t8-chrome-android-vert',
  'broll-py01c4r7-scrolling-past-code':  'broll-py01v2c3-scrolling-past-code-vert',
  'broll-py01n8m2-three-in-the-morning': 'broll-py01v3n7-three-in-the-morning-vert',
};
const VID_V: Record<string, string> = {
  'e1-dark-room':     'e1-dark-room',     // vertical re-source: coder in a dark blue room
  'e2-hands-coding':  'e2-hands-coding',  // vertical re-source: blue-lit keyboard macro
  'e3-focus-typing':  'e3-python-code',   // vertical re-source: Python code scrolling, dark screen
};
// Fail loudly at build time rather than rendering a missing asset silently.
for (const c of COVERS) {
  if (c.kind === 'still' && !STILL_V[c.ref]) throw new Error(`no vertical still mapped for ${c.ref}`);
  if (c.kind === 'vid' && !VID_V[c.ref]) throw new Error(`no vertical b-roll mapped for ${c.ref}`);
}

/** Opacity ramp: the ONLY transition in this video (TRANSITIONS.md, Mike 2026-08-05). */
const useXfade = (localFrame: number, durFrames: number, xf: number) => {
  const f = Math.round(xf * FPS);
  return interpolate(
    localFrame,
    [0, f, Math.max(f + 1, durFrames - f), durFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
};

/** A portrait container / card still (1350x2400 -> exact 9:16, no crop). */
const Deck: React.FC<{ refName: string; durFrames: number; xf: number }> = ({ refName, durFrames, xf }) => {
  const frame = useCurrentFrame();
  const opacity = useXfade(frame, durFrames, xf);
  const scale = interpolate(frame, [0, durFrames], [1, 1.03], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{ opacity, backgroundColor: '#0a0c10' }}>
      <Img src={staticFile(`ctr-v-render/${refName}.png`)} style={{ ...fill, transform: `scale(${scale})` }} />
    </AbsoluteFill>
  );
};

/** ChatGPT atmosphere still, regenerated at true 9:16. */
const Still: React.FC<{ refName: string; durFrames: number; xf: number }> = ({ refName, durFrames, xf }) => {
  const frame = useCurrentFrame();
  const opacity = useXfade(frame, durFrames, xf);
  const scale = interpolate(frame, [0, durFrames], [1.02, 1.07], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{ opacity, backgroundColor: '#0a0c10' }}>
      <Img src={staticFile(`img-v/${STILL_V[refName]}.png`)} style={{ ...fill, transform: `scale(${scale})` }} />
    </AbsoluteFill>
  );
};

/** Envato b-roll, natively vertical 1080x1920. Audio stripped at transcode; `muted` is belt-and-braces. */
const Vid: React.FC<{ refName: string; durFrames: number; xf: number }> = ({ refName, durFrames, xf }) => {
  const frame = useCurrentFrame();
  const opacity = useXfade(frame, durFrames, xf);
  return (
    <AbsoluteFill style={{ opacity, backgroundColor: '#0a0c10' }}>
      <OffthreadVideo src={staticFile(`vid-v/${VID_V[refName]}.mp4`)} muted style={fill} />
    </AbsoluteFill>
  );
};

/**
 * THE ANIMATED RAMP CHART — PORTRAIT LAYOUT.
 * Re-authored in the 1080x1920 viewBox rather than scaling the 16:9 path: a portrait frame gives
 * the ramp a 700 px rise instead of a 255 px one, so the "progressively harder" claim reads as an
 * actual climb on a phone. Same draw-on mechanic as the 16:9 (stroke-dashoffset along the curve,
 * endpoint dots and axis captions fading in as the head reaches them) and the same timings.
 * Geometry sits under the c11-ramp-plate title block, which ends at y~800 in this frame.
 */
const PATH_D = 'M108 1656 C 371 1642, 546 1450, 696 1258 S 884 983, 972 956';
const PATH_LEN = 1250; // actual ~1149; the over-estimate just finishes the draw slightly early

const RampChart: React.FC<{ durFrames: number; xf: number }> = ({ durFrames, xf }) => {
  const frame = useCurrentFrame();
  const opacity = useXfade(frame, durFrames, xf);
  const drawStart = Math.round(0.45 * FPS);
  const drawEnd = Math.round(durFrames - 1.1 * FPS);
  const p = interpolate(frame, [drawStart, drawEnd], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
  const endLabel = interpolate(p, [0.72, 0.95], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const startLabel = interpolate(p, [0.02, 0.18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ opacity, backgroundColor: '#0a0c10' }}>
      <Img src={staticFile('ctr-v-render/c11-ramp-plate.png')} style={fill} />
      <AbsoluteFill>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <linearGradient id="rampgv" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#00c2ff" />
              <stop offset="100%" stopColor="#00e68a" />
            </linearGradient>
          </defs>
          <line x1={90} y1={1670} x2={1000} y2={1670} stroke="#1e2330" strokeWidth={4} />
          <path
            d={PATH_D}
            fill="none"
            stroke="url(#rampgv)"
            strokeWidth={9}
            strokeLinecap="round"
            strokeDasharray={PATH_LEN}
            strokeDashoffset={PATH_LEN * (1 - eased)}
          />
          <circle cx={108} cy={1656} r={14} fill="#00c2ff" opacity={startLabel} />
          <circle cx={972} cy={956} r={14} fill="#00e68a" opacity={endLabel} />
          <text x={90} y={1726} fontFamily="DM Sans, sans-serif" fontSize={30} fill="#8892a4" opacity={startLabel}>
            very beginner level
          </text>
          <text x={1000} y={1726} textAnchor="end" fontFamily="DM Sans, sans-serif" fontSize={30} fill="#8892a4" opacity={endLabel}>
            more complex stuff
          </text>
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const PythonEp01Vertical: React.FC = () => {
  useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0c10' }}>
      {/* the gated-face spine, cropped to the MEASURED subject centre (never 'center') */}
      <OffthreadVideo
        src={staticFile('spine.mp4')}
        style={{ ...fill, objectPosition: SPINE_OBJECT_POSITION }}
      />

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

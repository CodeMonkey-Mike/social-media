// TaoDetailedShort: the ~30 s 9:16 SHORT of longform-edited `tao-detailed` (16:9-SOURCED mode, assets/short/from-16x9.json).
// Rules: video-creation/longform-edited/skills/longform-to-short/longform-to-short.md §5 Stage B + comp-build.md §6/§6a/§8.
// PUBLIC DIR = media/tao-detailed/_previews/short/work (span intermediates + variants/ + cutframes/ + transitions/lib/).
// The comp has NO audio: every span video is muted; mix_short.py lays the span wavs, the shared CTA take and the bed.
//
// Layer order (bottom -> top): spans end to end (one muted OffthreadVideo per span-NN.mp4, linear, never seeking the
// master) -> variant overlays (Mike's variety rule, assets/short/variants.json) -> library engine windows -> seam hits
// -> outro (held last frame -> WATCH THE FULL VIDEO card) -> captions (TOPMOST, only inside CAPTION_WINDOWS).
import React, { createContext, useContext } from 'react';
import { AbsoluteFill, Easing, Freeze, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { TransitionClip } from './transitions/TransitionClip';
import { getTransition, framesForRow } from './transitions/registry';
import { ZCAPTIONS, CAPTION_WINDOWS } from './TaoDetailedShortCaptions';

const { fontFamily: MONTSERRAT } = loadMontserrat('normal', { weights: ['900'], subsets: ['latin'], ignoreTooManyRequestsWarning: true });
const { fontFamily: PLAYFAIR } = loadPlayfair('normal', { weights: ['900'], subsets: ['latin'], ignoreTooManyRequestsWarning: true });

// ════════════════════════════════════════ timing (spans.json verbatim) ════════════════════════════════════════
export const FPS = 30;
const SPANS_TOTAL_S = 27.3;                                  // spans.json spans_total_seconds
const OUTRO_S = 3.0;                                         // s_comp: max(3.0, target - spans) = 3.000
export const DUR = Math.round((SPANS_TOTAL_S + OUTRO_S) * FPS);   // round(30.300 * 30) = 909
const F = (t: number) => Math.round(t * FPS);                // SHORT seconds -> frame (the short has no pauses: no sh())

// `tailBlack` = trailing frames MEASURED black in the intermediate (signalstats YAVG = 16 on the last frame of spans 2-4,
// 2026-10-17: the from-16x9 canvas paints each span one frame short). Those frames are never shown: the span holds its
// last real frame (a 1-frame <Freeze>), invisible, and spans 2 and 4 are additionally under an engine window there.
type Span = { i: number; file: string; outStart: number; frames: number; sourced: 'FACE' | 'COVER'; tailBlack: number; says: string };
const SPANS: Span[] = [
  { i: 1, file: 'span-01.mp4', outStart: 0.0, frames: 284, sourced: 'FACE', tailBlack: 0, says: 'The AI that is coming for your job is owned by somebody' },
  { i: 2, file: 'span-02.mp4', outStart: 9.4667, frames: 224, sourced: 'FACE', tailBlack: 1, says: 'So here is the question that I am answering by the end of this video' },
  { i: 3, file: 'span-03.mp4', outStart: 16.9333, frames: 179, sourced: 'COVER', tailBlack: 1, says: 'When the machine does the work, the wages go away' },
  { i: 4, file: 'span-04.mp4', outStart: 22.9, frames: 132, sourced: 'FACE', tailBlack: 1, says: 'I think you should own a piece of the AI production while you still have a paycheck' },
];
const SPAN_F = SPANS.map((s) => F(s.outStart));              // [0, 284, 508, 687]
const SPANS_END = SPAN_F[SPANS.length - 1] + SPANS[SPANS.length - 1].frames;   // 819
// Build-time asserts: laid END TO END (no gap, no overlap), totals match the table and the outro budget.
SPANS.forEach((s, k) => {
  if (k > 0 && SPAN_F[k - 1] + SPANS[k - 1].frames !== SPAN_F[k]) throw new Error(`span ${s.i} does not start where span ${s.i - 1} ends`);
});
if (SPANS_END !== F(SPANS_TOTAL_S)) throw new Error(`spans end at ${SPANS_END}, expected ${F(SPANS_TOTAL_S)}`);
if (DUR - SPANS_END !== F(OUTRO_S)) throw new Error(`outro is ${DUR - SPANS_END} frames, expected ${F(OUTRO_S)}`);

// ════════════════════════════════════════ §4 COVERS = the variant overlays (assets/short/variants.json) ════════════════════════════════════════
// Mike's variety rule: every span carrying an Envato clip or a ChatGPT image shows ONE alternative asset, full-frame, over
// its `overlay_short` window (copied into the public dir under variants/). `cap: true` = deliberate: a short is captioned
// END TO END (longform-to-short.md §5 caption trap; from-16x9 mode burns nothing), so captions run over these covers too.
type Cover = { tIn: number; tOut: number; kind: 'vid' | 'still'; ref: string; cap?: boolean; head?: number; ingress: string; egress: string };
const COVERS: Cover[] = [
  // BR-1 (envato-video) replaces final 6.9-9.5 (16:9 BR-1 night tower). Clip = window + 1 s handles: clip 1.0 s airs at 6.9.
  { tIn: 6.9, tOut: 9.47, kind: 'vid', ref: 'BR-1-office-tower-night-glide', cap: true, head: 1.0, ingress: 'lib:blocks-max-2', egress: 'hand:seam-hit' },
  // IMG-8 (chatgpt-image) replaces final 633.8-637.8 (16:9 IMG-8 machine pours coins). Slow push 1 -> 1.05 (as the 16:9 still).
  { tIn: 17.015, tOut: 21.015, kind: 'still', ref: 'IMG-8-machine-coins-owner-hands', cap: true, ingress: 'lib:monitor-max-3', egress: 'hand:xfade (matched to the baked IMG-8 -> R14 xfade)' },
];
const VID_FPS: Record<string, number> = { 'BR-1-office-tower-night-glide': 30000 / 1001 };   // ffprobe 29.97: frame for frame
const vidRate = (ref: string) => FPS / (VID_FPS[ref] ?? FPS);   // comp-build §11: playbackRate = 30 / clip fps (1.001 here)
const fill = { width: '100%', height: '100%', objectFit: 'cover' } as const;

// IMG-8 EGRESS: the span picture under it cross-fades IMG-8(16:9 crop) -> R14 on span-03 local frames 124..133 (MEASURED
// 2026-10-17, share of R14 per frame). The variant leaves on the same frames with opacity 1 - a^3, so the visible blend is
// variant -> R14 with at most ~10% of the 16:9 IMG-8 crop ghosting through (instead of a pop to the old crop).
const IMG8_XFADE_LOCAL0 = 124;
const IMG8_XFADE_A = [0.239, 0.416, 0.575, 0.696, 0.803, 0.873, 0.934, 0.966, 0.986, 0.999];

// ════════════════════════════════════════ §6 transitions wired (tag = plan id; grep TRANSITIONS.md) ════════════════════════════════════════
const win = (id: string) => { const r = getTransition(id); if (!r) throw new Error(`unknown transition ${id}`); return framesForRow(r, FPS); };
// lib:blocks-max-2: BR-1 variant ingress = the 16:9's F1 face-out (TRANSITIONS.md 0:06.9). Window = EXACTLY the 16:9's
// (span-01 frozen at f192, glitch from f193, swap f202), so the face side matches the baked frames it replaces.
const BR1_WIN = win('blocks-max-2');                         // 29
const BR1_W0 = F(6.9) - Math.round(BR1_WIN / 2);             // 192
// lib:monitor-max-3: IMG-8 variant ingress = the 16:9's BR-25 -> IMG-8 glitch-still (TRANSITIONS.md 10:25.3). It doubles as
// the span 2 -> 3 seam hit: its A -> B swap (p >= swapAt 0.3 = window frame 7) lands ON the seam frame 508, and it hides
// the 16:9 glitch baked into span-03's first 12 frames.
const MON_WIN = win('monitor-max-3');                        // 24
const MON_W0 = SPAN_F[2] - 7;                                // 501
// lib:blocks-max-2 again: the OUTRO entry = the 16:9's face-to-title-card move (F3 out into the CH2 card, blocks-max-2
// with the cube turning behind the glitch). Window = EXACTLY the baked F10 face-out in span-04 (frozen f119, swap f129),
// so it replaces that glitch (whose B side was the 16:9's YOU CAN. card, then a black frame) with the outro card.
const OUT_WIN = win('blocks-max-2');                         // 29
const OUT_W0 = SPAN_F[3] + 119;                              // 806
const OUT_SWAP = OUT_W0 + 10;                                // 816 (GlitchBlocks swaps at p >= opacityPeak 0.333)
const CUBE_F = 11;                                           // hand:cube-3d turn (the video's card pick rmn:cube = rotateY), ~11 f
const CARD_FULL = OUT_SWAP + CUBE_F;                         // 827: card fully turned in
// ⛔ readable >= 1.0 s (comp-build §6 card rule) and the outro must own the last 3 s
if ((DUR - CARD_FULL) / FPS < 1.0) throw new Error('outro card readable < 1.0 s');
if (OUT_SWAP > SPANS_END) throw new Error('outro card must land by the end of the spans');
// hand:seam-hit at the two remaining seams (1 -> 2 at 284, 3 -> 4 at 687): ~0.33 s zoom punch + RGB split + flash, 5 frames
// either side of the cut, on the LIVE spans (no freezes: the face speaks through it).
const HAND_SEAMS = [SPAN_F[1], SPAN_F[3]];
export const TRANSITIONS_WIRED = [
  { at: BR1_W0, id: 'lib:blocks-max-2', what: 'BR-1 variant ingress (face out to the night tower)' },
  { at: HAND_SEAMS[0], id: 'hand:seam-hit', what: 'seam 1 -> 2' },
  { at: MON_W0, id: 'lib:monitor-max-3', what: 'seam 2 -> 3 + IMG-8 variant ingress' },
  { at: HAND_SEAMS[1], id: 'hand:seam-hit', what: 'seam 3 -> 4' },
  { at: OUT_W0, id: 'lib:blocks-max-2', what: 'outro: held last frame -> WATCH THE FULL VIDEO card (+ hand:cube-3d turn)' },
];

// ⛔ §6a: every node handed to an engine reads ONE ABSOLUTE clock (the engines re-mount nodes in nested Sequences)
const AbsCtx = createContext(0);
const useAbs = () => useContext(AbsCtx);

// ════════════════════════════════════════ nodes ════════════════════════════════════════
const Still: React.FC<{ src: string; style?: React.CSSProperties }> = ({ src, style }) => (
  <AbsoluteFill style={{ backgroundColor: 'black', overflow: 'hidden' }}>
    <Img src={staticFile(src)} style={{ ...fill, ...style }} />
  </AbsoluteFill>
);

/** IMG-8 variant on the absolute clock: slow push 1 -> 1.05 across its slot (a plain still never sits dead, as in the 16:9). */
const Img8: React.FC = () => {
  const abs = useAbs();
  const c = COVERS[1];
  const k = interpolate(abs, [F(c.tIn), F(c.tOut)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <Still src={`variants/${c.ref}.png`} style={{ transform: `scale(${1 + 0.05 * k})` }} />;
};

const SpanVideo: React.FC<{ s: Span }> = ({ s }) => (
  <OffthreadVideo src={staticFile(s.file)} muted style={fill} />
);

// ════════════════════════════════════════ OUTRO: the WATCH THE FULL VIDEO TITLE SLIDE ════════════════════════════════════════
// Locked container stylesheet (skills/container-reference/container-canonical.css): bg #0a0c10 + one blurred accent orb +
// grain, Playfair Display 900 headline, ONE green key word (--accent-green #00e68a), the green -> cyan divider; TITLE SLIDE
// = no card box, over the held last frame (blurred, under the dark scrim). Text reads exactly OUTRO_TEXT; no em dash.
const OUTRO_TEXT = 'WATCH THE FULL VIDEO';
const OUTRO_LINES = ['WATCH', 'THE FULL', 'VIDEO'];
const OUTRO_ACCENT = 'FULL';
if (OUTRO_LINES.join(' ') !== OUTRO_TEXT || /—/.test(OUTRO_TEXT)) throw new Error('outro text drifted');
const HELD = 'cutframes/span-04-f119.png';                  // span 4's last REAL frame (f120+ is the baked face-out, f131 black)
const HELD_BLUR = 'cutframes/span-04-f119-blur.png';        // the same frame, gblur sigma 28 (pre-baked: no CSS blur per tile)
const GRAIN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const OutroCard: React.FC = () => {
  const abs = useAbs();
  const t = Math.max(0, abs - OUT_SWAP) / FPS;
  const bob = 16 * Math.sin(2 * Math.PI * t / 0.9);          // the arrow keeps pointing down at the link
  const push = 1 + 0.035 * Math.min(1, t / 3);               // held frame drifts in so the card never sits dead
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0c10', overflow: 'hidden' }}>
      <Img src={staticFile(HELD_BLUR)} style={{ ...fill, transform: `scale(${push})` }} />
      <AbsoluteFill style={{ backgroundColor: 'rgba(10,12,16,0.84)' }} />
      <div style={{ position: 'absolute', left: -260, bottom: -200, width: 900, height: 900, borderRadius: '50%', background: '#00e68a', filter: 'blur(160px)', opacity: 0.26 }} />
      <div style={{ position: 'absolute', right: -320, top: -240, width: 820, height: 820, borderRadius: '50%', background: '#00c2ff', filter: 'blur(170px)', opacity: 0.12 }} />
      <AbsoluteFill style={{ justifyContent: 'center', padding: '0 96px', color: '#e8eaf0' }}>
        <div style={{ fontFamily: `${PLAYFAIR}, serif`, fontWeight: 900, fontSize: 180, lineHeight: 1.04, letterSpacing: '-0.02em' }}>
          {OUTRO_LINES.map((ln) => (
            <div key={ln}>
              {ln.split(' ').map((w, i) => (
                <React.Fragment key={i}>
                  {i > 0 ? ' ' : ''}
                  <span style={{ color: w === OUTRO_ACCENT ? '#00e68a' : '#e8eaf0' }}>{w}</span>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
        <div style={{ width: 66, height: 4, borderRadius: 2, background: 'linear-gradient(90deg,#00e68a,#00c2ff)', margin: '44px 0 56px' }} />
        <svg width={180} height={252} viewBox="0 0 150 210" style={{ transform: `translateY(${bob}px)`, overflow: 'visible' }}>
          <line x1={75} y1={8} x2={75} y2={178} stroke="#00e68a" strokeWidth={18} strokeLinecap="round" />
          <polyline points="18,122 75,190 132,122" fill="none" stroke="#00e68a" strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: 0.03, backgroundImage: GRAIN }} />
    </AbsoluteFill>
  );
};

/** hand:cube-3d (the video's card move, rmn:cube = a rotateY turn): the held frame turns away as the card turns in over
 *  CUBE_F frames from the swap, then the card HOLDS (never cubes back out). Absolute clock, so the engine copies agree. */
const OutroScene: React.FC = () => {
  const abs = useAbs();
  const k = interpolate(abs, [OUT_SWAP, OUT_SWAP + CUBE_F], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
  const face: React.CSSProperties = { position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transformOrigin: '50% 50% -540px' };
  return (
    <AbsoluteFill style={{ backgroundColor: 'black', perspective: 2600, overflow: 'hidden' }}>
      {k < 1 && <div style={{ ...face, transform: `rotateY(${-90 * k}deg)` }}><Still src={HELD} /></div>}
      <div style={{ ...face, transform: `rotateY(${90 * (1 - k)}deg)` }}><OutroCard /></div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════ hand:seam-hit (zoom punch + RGB split + flash, ~0.33 s) ════════════════════════════════════════
const seamEnv = (fr: number) => {
  for (const S of HAND_SEAMS) {
    const d = fr - S;
    if (d >= -5 && d <= -1) return Math.pow((d + 6) / 5, 2);   // outgoing punches in: .04 .16 .36 .64 1
    if (d >= 0 && d <= 4) return Math.pow((5 - d) / 5, 2);     // incoming settles out: 1 .64 .36 .16 .04
  }
  return 0;
};
const SeamRgbFilter: React.FC<{ dx: number }> = ({ dx }) => (
  <svg width="0" height="0" style={{ position: 'absolute' }}>
    <defs>
      <filter id="tds-seam-rgb" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
        <feOffset in="r" dx={dx} dy={0} result="ro" />
        <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />
        <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />
        <feOffset in="b" dx={-dx} dy={0} result="bo" />
        <feBlend in="ro" in2="g" mode="screen" result="rg" />
        <feBlend in="rg" in2="bo" mode="screen" />
      </filter>
    </defs>
  </svg>
);

// ════════════════════════════════════════ §8 CAPTIONS (Montserrat house style, CAPTION_WINDOWS only, TOPMOST) ════════════════════════════════════════
// Generated file times are SHORT seconds (no sh()). The generator double-escapes apostrophes ('so here\\\'s' evaluates to
// "so here\'s"), so the render strips the stray escape backslash; the words themselves are never retyped.
const CAP_WIN_F = CAPTION_WINDOWS.map(([a, b]) => [F(a), F(b)] as [number, number]);
const CAPS = ZCAPTIONS.map((c) => ({ tf: F(c.t), h: c.h.replace(/\\(.)/g, '$1') }));
const Captions: React.FC = () => {
  const fr = useCurrentFrame();
  if (!CAP_WIN_F.some(([a, b]) => fr >= a && fr < b)) return null;
  let cur: (typeof CAPS)[number] | null = null;
  for (const c of CAPS) { if (c.tf <= fr) cur = c; else break; }
  if (!cur) return null;
  const nextF = (CAPS.find((c) => c.tf > cur!.tf) || { tf: Infinity }).tf;
  if (fr >= Math.min(nextF, cur.tf + Math.round(1.3 * FPS))) return null;   // hold to the next phrase / clear on a gap
  const pop = interpolate(fr - cur.tf, [0, 3, 6], [0.7, 1.12, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 540 }}>
      <div style={{ fontFamily: `${MONTSERRAT}, 'Arial Black', 'Segoe UI', sans-serif`, fontWeight: 900, fontSize: 92, lineHeight: 1.05,
        textTransform: 'lowercase', color: '#ffffff', WebkitTextStroke: '12px #000', paintOrder: 'stroke fill', textAlign: 'center',
        maxWidth: 940, transform: `scale(${pop})` }}>{cur.h}</div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════ the composition ════════════════════════════════════════
export const TaoDetailedShort: React.FC = () => {
  const fr = useCurrentFrame();
  const e = seamEnv(fr);
  const br1 = COVERS[0];
  const img8 = COVERS[1];
  const img8From = F(img8.tIn);                                          // 510
  const img8Until = SPAN_F[2] + IMG8_XFADE_LOCAL0 + IMG8_XFADE_A.length;   // 642 (egress done)
  const img8Opacity = (() => {
    const k = fr - (SPAN_F[2] + IMG8_XFADE_LOCAL0);
    if (k < 0) return 1;
    const a = IMG8_XFADE_A[Math.min(k, IMG8_XFADE_A.length - 1)];
    return 1 - Math.pow(a, 3);
  })();
  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      <AbsCtx.Provider value={fr}>
        {e > 0 && <SeamRgbFilter dx={26 * e} />}
        {/* ── the picture (spans + variants + engines), seam-hit transform on the whole layer ── */}
        <AbsoluteFill style={e > 0 ? { transform: `scale(${1 + 0.18 * e})`, filter: `url(#tds-seam-rgb) blur(${(3 * e).toFixed(2)}px)` } : undefined}>
          {SPANS.map((s, k) => (
            <React.Fragment key={s.i}>
              <Sequence from={SPAN_F[k]} durationInFrames={s.frames - s.tailBlack} name={`span-0${s.i} ${s.sourced}`}>
                <SpanVideo s={s} />
              </Sequence>
              {s.tailBlack > 0 && (
                <Sequence from={SPAN_F[k] + s.frames - s.tailBlack} durationInFrames={s.tailBlack} name={`span-0${s.i} hold (black tail)`}>
                  <Freeze frame={s.frames - s.tailBlack - 1}><SpanVideo s={s} /></Freeze>
                </Sequence>
              )}
            </React.Fragment>
          ))}

          {/* variant BR-1 (vid), live from its slot, clip 1.0 s at 6.9 s, frame for frame at 29.97 */}
          <Sequence from={F(br1.tIn)} durationInFrames={F(br1.tOut) - F(br1.tIn)} name="variant BR-1">
            <AbsoluteFill style={{ backgroundColor: 'black' }}>
              <OffthreadVideo src={staticFile(`variants/${br1.ref}.mp4`)} muted trimBefore={Math.round((br1.head ?? 0) * FPS)}
                playbackRate={vidRate(br1.ref)} style={fill} />
            </AbsoluteFill>
          </Sequence>

          {/* variant IMG-8 (still), push on the absolute clock, egress matched to the baked xfade into R14 */}
          <Sequence from={img8From} durationInFrames={img8Until - img8From} name="variant IMG-8">
            <AbsoluteFill style={{ opacity: img8Opacity }}><Img8 /></AbsoluteFill>
          </Sequence>

          {/* lib:blocks-max-2 (BR-1 ingress; TRANSITIONS.md 0:06.9 face-cut F1 out). §6a: Sequence = EXACTLY the window,
              A = span-01 frozen at f192 (the 16:9's own SpineStill frame), B = the variant frame that airs at the window's
              last frame (clip f43 = 1.0 s + 13 f), both PRE-EXTRACTED stills (no video fed to the engine). */}
          <Sequence from={BR1_W0} durationInFrames={BR1_WIN} name="lib:blocks-max-2 BR-1 in">
            <TransitionClip id="blocks-max-2" cutFrame={Math.round(BR1_WIN / 2)} sfx={false}
              fromSrc="cutframes/span-01-f192.png" toSrc="cutframes/BR-1-variant-f43.png"
              outgoing={() => <Still src="cutframes/span-01-f192.png" />}
              incoming={() => <Still src="cutframes/BR-1-variant-f43.png" />} />
          </Sequence>

          {/* lib:monitor-max-3 (seam 2 -> 3 = IMG-8 variant ingress; TRANSITIONS.md 10:25.3 glitch-still BR-25 -> IMG-8).
              A = span-02 frozen at f217 (the window's first frame), B = the IMG-8 variant on the absolute clock (an image). */}
          <Sequence from={MON_W0} durationInFrames={MON_WIN} name="lib:monitor-max-3 seam 2-3 + IMG-8 in">
            <TransitionClip id="monitor-max-3" cutFrame={Math.round(MON_WIN / 2)} sfx={false}
              outgoing={() => <Still src="cutframes/span-02-f217.png" />}
              incoming={() => <Img8 />} />
          </Sequence>
        </AbsoluteFill>

        {/* hand:seam-hit flash (seams 1 -> 2 and 3 -> 4), under the captions */}
        {e > 0 && <AbsoluteFill style={{ backgroundColor: '#f2fff8', opacity: 0.55 * e, pointerEvents: 'none' }} />}

        {/* OUTRO. lib:blocks-max-2 (the 16:9's face -> title-card move): A = span-04's last real frame f119 (the held frame),
            B = OutroScene (hand:cube-3d turn behind the glitch into the TITLE SLIDE). Window = exactly the baked F10 face-out. */}
        <Sequence from={OUT_W0} durationInFrames={OUT_WIN} name="lib:blocks-max-2 outro in">
          <TransitionClip id="blocks-max-2" cutFrame={Math.round(OUT_WIN / 2)} sfx={false}
            fromSrc={HELD}
            outgoing={() => <Still src={HELD} />}
            incoming={() => <OutroScene />} />
        </Sequence>
        <Sequence from={OUT_W0 + OUT_WIN} durationInFrames={DUR - (OUT_W0 + OUT_WIN)} name="outro card hold">
          <OutroScene />
        </Sequence>

        <Captions />
      </AbsCtx.Provider>
    </AbsoluteFill>
  );
};

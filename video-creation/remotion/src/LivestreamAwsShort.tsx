// LivestreamAwsShort: the ~30 s SHORT of the longform-PRESENTATION project livestream-aws (AI Engineering Simplified).
// Spec: video-creation/longform-edited/skills/longform-to-short/longform-to-short.md section 5 Stage B + "A presentation project".
// Source = the delivered presentation VERTICAL (native 1080x1920, nothing burned in), cut by Stage A into small span
// intermediates: one MUTED OffthreadVideo per span-NN.mp4, laid end to end per spans.json (out_start / frames); the comp
// NEVER seeks into the master. Public dir = media/standard/livestream-aws/_previews/short/work.
// No variants, no rebuilt cards (presentation mode: the cards are already native vertical), captions over EVERY span.
// No audio in the comp: mix_short.py lays the span VO + the shared CTA take (no music, no SFX: MUSIC-PLAN.json).
import React from 'react';
import {
  AbsoluteFill,
  Freeze,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadJetBrains } from '@remotion/google-fonts/JetBrainsMono';
import {
  ZCAPTIONS,
  CAPTION_WINDOWS_F,
  CAPTION_BAND,
  CAPTION_BAND_F,
  CAPTION_FPS,
} from './LivestreamAwsShortCaptions';

const { fontFamily: MONTSERRAT } = loadMontserrat('normal', { weights: ['900'], subsets: ['latin'] });
const { fontFamily: PLAYFAIR } = loadPlayfair('normal', { weights: ['900'], subsets: ['latin'] });
const { fontFamily: JBMONO } = loadJetBrains('normal', { weights: ['600'], subsets: ['latin'] });

export const FPS = 30;
if (CAPTION_FPS !== FPS) throw new Error(`LivestreamAwsShort: captions are at ${CAPTION_FPS} fps, the comp at ${FPS}`);

// ---- span table (from _previews/short/work/spans.json; frames are the verified intermediate frame counts) ----------
type Span = { i: number; file: string; frames: number; outStart: number; role: string };
const SPAN_ROWS: { i: number; file: string; frames: number; out_start: number; role: string }[] = [
  { i: 1, file: 'span-01.mp4', frames: 118, out_start: 0.0, role: 'hook' },      // full-camera FACE scene
  { i: 2, file: 'span-02.mp4', frames: 396, out_start: 3.9333, role: 'body' },   // "The image bottleneck" diagram
  { i: 3, file: 'span-03.mp4', frames: 313, out_start: 17.1333, role: 'kicker' }, // same-graph card -> FACE
];
const SPANS: Span[] = (() => {
  let acc = 0;
  return SPAN_ROWS.map((r) => {
    const outStart = acc;
    // the table's out_start (seconds) must agree with the running frame sum: a drift here would misplace every caption
    if (Math.abs(Math.round(r.out_start * FPS) - outStart) > 0) {
      throw new Error(`LivestreamAwsShort: span ${r.i} out_start ${r.out_start}s != frame ${outStart}`);
    }
    acc += r.frames;
    return { i: r.i, file: r.file, frames: r.frames, outStart, role: r.role };
  });
})();
export const SPAN_FRAMES = SPANS.reduce((a, s) => a + s.frames, 0); // 827 = 27.567 s
export const OUTRO_FRAMES = 90; // 3.000 s
export const DUR = Math.round(30.567 * FPS); // 917
if (SPAN_FRAMES + OUTRO_FRAMES !== DUR) {
  throw new Error(`LivestreamAwsShort: spans ${SPAN_FRAMES} + outro ${OUTRO_FRAMES} != DUR ${DUR}`);
}
if (CAPTION_WINDOWS_F[CAPTION_WINDOWS_F.length - 1][1] !== SPAN_FRAMES) {
  throw new Error('LivestreamAwsShort: the caption windows do not end on the last span frame');
}

// ---- seams: neither seam joins two SETTLED card states (1: face -> diagram; 2: diagram -> a card still cross-fading in),
// so both get the fast hand-rolled hit: ~0.3 s = 4 frames out + 5 frames in, a punch (scale 1 -> 1.10 -> 1) with a motion
// blur and a short soft flash peaking on the seam frame. A seam between two settled card states would be a plain cut.
const HIT_OUT = 4;
const HIT_IN = 5;
const HIT_SCALE = 0.1;
const HIT_BLUR = 7;
const SEAMS: { at: number; hit: boolean }[] = SPANS.slice(1).map((s) => ({ at: s.outStart, hit: true }));

const SpanClip: React.FC<{ span: Span; hitIn: boolean; hitOut: boolean }> = ({ span, hitIn, hitOut }) => {
  const f = useCurrentFrame(); // local to the span's Sequence
  let k = 0; // 0 = at rest, 1 = full punch
  if (hitIn && f < HIT_IN) k = interpolate(f, [0, HIT_IN], [1, 0], { extrapolateRight: 'clamp' });
  if (hitOut && f >= span.frames - HIT_OUT) {
    k = interpolate(f, [span.frames - HIT_OUT - 1, span.frames - 1], [0, 1], { extrapolateLeft: 'clamp' });
  }
  const eased = k * k * (3 - 2 * k);
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0c10' }}>
      <AbsoluteFill
        style={{
          transform: `scale(${1 + HIT_SCALE * eased})`,
          filter: eased > 0.001 ? `blur(${(HIT_BLUR * eased).toFixed(2)}px)` : undefined,
        }}
      >
        <OffthreadVideo src={staticFile(span.file)} muted style={{ width: 1080, height: 1920 }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const SeamFlash: React.FC = () => {
  const frame = useCurrentFrame();
  let o = 0;
  for (const s of SEAMS) {
    if (!s.hit) continue;
    const d = frame - s.at; // 0 = first frame of the incoming span
    if (d >= -HIT_OUT && d < HIT_IN) {
      o = Math.max(o, d < 0 ? interpolate(d, [-HIT_OUT, 0], [0, 0.42]) : interpolate(d, [0, HIT_IN], [0.42, 0]));
    }
  }
  if (o <= 0.001) return null;
  return <AbsoluteFill style={{ backgroundColor: '#e8eaf0', opacity: o, pointerEvents: 'none' }} />;
};

// ---- captions (comp-build.md section 8 house style; SHORT safe zone) -------------------------------------------------
// Every comparison is in WHOLE FRAMES (Math.round(s * FPS) / CAPTION_WINDOWS_F), never raw seconds (clip-evals 2026-11-17).
// A group shows from tf until min(next group, max(tf + 1.3 s, its last word's end), the end of the window holding tf).
type Cap = { tf: number; endF: number; h: string };
const inWin = (f: number, wins: [number, number][]) => wins.find(([a, b]) => f >= a && f < b);
const CAPS: Cap[] = (() => {
  const rows = ZCAPTIONS.map((c) => ({ tf: Math.round(c.t * FPS), ef: Math.round(c.e * FPS), h: c.h }));
  const out: Cap[] = [];
  rows.forEach((r, i) => {
    const win = inWin(r.tf, CAPTION_WINDOWS_F);
    if (!win) return; // outside every caption window: never shown
    const nextF = i + 1 < rows.length ? rows[i + 1].tf : Infinity;
    const endF = Math.min(nextF, Math.max(r.tf + Math.round(1.3 * FPS), r.ef), win[1]);
    if (endF > r.tf) out.push({ tf: r.tf, endF, h: r.h });
  });
  return out;
})();
const CAP_SIZE = 88;
const BAND_SIZE = 72;

const Captions: React.FC = () => {
  const f = useCurrentFrame();
  if (!inWin(f, CAPTION_WINDOWS_F)) return null;
  const cur = CAPS.find((c) => f >= c.tf && f < c.endF);
  if (!cur) return null;
  const d = f - cur.tf;
  const pop = interpolate(d, [0, 3, 6], [0.7, 1.12, 1], { extrapolateRight: 'clamp' });
  const text: React.CSSProperties = {
    fontFamily: `${MONTSERRAT}, 'Arial Black', 'Segoe UI', sans-serif`,
    fontWeight: 900,
    textTransform: 'lowercase',
    color: '#ffffff',
    WebkitTextStroke: '12px #000',
    paintOrder: 'stroke fill',
    textAlign: 'center',
    lineHeight: 1.08,
    transform: `scale(${pop})`,
    transformOrigin: '50% 50%',
  };
  if (inWin(f, CAPTION_BAND_F)) {
    // SCREENSHARE stretch: the band between the slide and the webcam pane, one line, the pop about the band's centre
    return (
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        <div
          style={{
            position: 'absolute',
            top: CAPTION_BAND.top,
            height: CAPTION_BAND.bottom - CAPTION_BAND.top,
            left: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ ...text, fontSize: BAND_SIZE, whiteSpace: 'nowrap', maxWidth: 860 }}>{cur.h}</div>
        </div>
      </AbsoluteFill>
    );
  }
  // full-frame card / face: the SAFE ZONE block, bottom pad 320 px, maxWidth 860 (the 1.12 pop + stroke stay inside 1080)
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          bottom: 320,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div style={{ ...text, fontSize: CAP_SIZE, maxWidth: 860 }}>{cur.h}</div>
      </div>
    </AbsoluteFill>
  );
};

// ---- outro: the last span's final frame held, a full-frame card in the video's OWN card look slides in over it --------
// Tokens = assets/card-sources/text/base.css (container-canonical) + portrait-text.css (1080x1920 reflow: 72 px sides,
// content in the band y 120..1450): bg-deep, cyan orb top-right, Playfair 900 headline with the cyan accent span,
// green -> cyan gradient divider, film grain. Text exactly "WATCH THE FULL VIDEO" + a downward arrow glyph.
const C = {
  bgDeep: '#0a0c10',
  green: '#00e68a',
  cyan: '#00c2ff',
  text: '#e8eaf0',
  border: '#1e2330',
};
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";
const CARD_IN = 10; // frames: the card's ingress (slide up + fade)

const OutroCard: React.FC = () => {
  const f = useCurrentFrame(); // local to the outro
  const t = interpolate(f, [0, CARD_IN], [0, 1], { extrapolateRight: 'clamp' });
  const e = 1 - Math.pow(1 - t, 3);
  const head = interpolate(f, [4, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const div = interpolate(f, [10, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const arr = interpolate(f, [14, 24], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const bob = f > 24 ? Math.sin(((f - 24) / FPS) * Math.PI * 2 * 1.1) * 14 : 0;
  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bgDeep,
        opacity: e,
        transform: `translateY(${(1 - e) * 120}px)`,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: C.cyan,
          filter: 'blur(120px)',
          opacity: 0.3,
          top: -220,
          right: -160,
        }}
      />
      <AbsoluteFill
        style={{
          padding: '120px 72px 470px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          color: C.text,
        }}
      >
        <div
          style={{
            fontFamily: `${PLAYFAIR}, serif`,
            fontWeight: 900,
            fontSize: 124,
            lineHeight: 1.07,
            letterSpacing: '-0.02em',
            opacity: head,
            transform: `translateY(${(1 - head) * 30}px)`,
          }}
        >
          WATCH THE
          <br />
          <span style={{ color: C.cyan }}>FULL VIDEO</span>
        </div>
        <div
          style={{
            width: 66 + 54 * div,
            height: 4,
            borderRadius: 2,
            background: `linear-gradient(90deg, ${C.green}, ${C.cyan})`,
            margin: '40px 0 52px',
            opacity: div,
          }}
        />
        <div
          style={{
            width: 190,
            height: 190,
            borderRadius: '50%',
            border: `3px solid ${C.cyan}`,
            background: 'rgba(0,194,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: arr,
            transform: `translateY(${bob}px)`,
          }}
        >
          <span
            style={{
              fontFamily: `${JBMONO}, monospace`,
              fontWeight: 600,
              fontSize: 120,
              lineHeight: 1,
              color: C.cyan,
              marginTop: -6,
            }}
          >
            {'↓'}
          </span>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundImage: GRAIN, opacity: 0.03, pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

// No variant overlays on this short (presentation mode: nothing is burned, the cards are native vertical).
export const COVERS: { tIn: number; tOut: number; kind: string; ref?: string }[] = [];

// The outro HOLD: the last span's final frame. Mounted at the TOP LEVEL (no Sequence context), because remotion 4.0.462's
// <Freeze> adds the parent Sequence's relativeFrom to the frozen frame: nested in the outro Sequence it froze at 312 + 827,
// past the file's end, and showed the card state instead of the final face frame (smoke still f0827, 2026-11-25).
const OutroHold: React.FC = () => {
  const frame = useCurrentFrame();
  const last = SPANS[SPANS.length - 1];
  if (frame < SPAN_FRAMES) return null;
  return (
    <AbsoluteFill>
      <Freeze frame={last.frames - 1}>
        <OffthreadVideo src={staticFile(last.file)} muted style={{ width: 1080, height: 1920 }} />
      </Freeze>
    </AbsoluteFill>
  );
};

export const LivestreamAwsShort: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {SPANS.map((s, idx) => (
        <Sequence key={s.i} from={s.outStart} durationInFrames={s.frames} name={`span-${s.i} ${s.role}`}>
          <SpanClip span={s} hitIn={idx > 0} hitOut={idx < SPANS.length - 1} />
        </Sequence>
      ))}
      <SeamFlash />
      <OutroHold />
      <Sequence from={SPAN_FRAMES} durationInFrames={OUTRO_FRAMES} name="outro">
        <OutroCard />
      </Sequence>
      <Captions />
    </AbsoluteFill>
  );
};

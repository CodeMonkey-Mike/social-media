import React from 'react';
import {
  AbsoluteFill, OffthreadVideo, Img, Audio, Sequence,
  staticFile, useCurrentFrame, useVideoConfig, interpolate, spring, Easing,
} from 'remotion';
import { CAPTIONS } from './anaToccataCaptions';

// Ana — Kaspa "Toccata hardfork" 30s vertical. Scenes composited IN Remotion so each FACE scene
// carries a distinct camera EFFECT (Mike's request). Continuous VO drives audio; face clips muted.
// Assets via --public-dir = media/kaspa-toccata/.  Renderer/effect map is logged in the assembly notes.

export const ANA_FPS = 30;
export const ANA_FRAMES = 1068; // ~35.6s

// scene boundaries (frames @30) tile the master VO continuously.
type Scene = { kind: 'face' | 'video' | 'image'; src: string; from: number; dur: number; fx: string; trim?: number };
// trim = frames skipped at clip start so the lip-sync speech onset lands on the VO word (clips have a lead-in)
const SCENES: Scene[] = [
  { kind: 'face',  src: 'face-clips/s1-seedance.mp4', from: 0,    dur: 99,  fx: 'hardin',    trim: 10 }, // Seedance — HARD zoom in
  { kind: 'video', src: 'broll/beat2-1080.mp4',       from: 99,   dur: 105, fx: 'broll' },
  { kind: 'face',  src: 'face-clips/s3-aurora.mp4',   from: 204,  dur: 98,  fx: 'hardout',   trim: 6 },  // Aurora — HARD zoom out
  { kind: 'image', src: 'broll/beat4-toccata.png',    from: 302,  dur: 213, fx: 'kenburns' },
  { kind: 'face',  src: 'face-clips/s5-heygen.mp4',   from: 515,  dur: 114, fx: 'shake',     trim: 4 },  // HeyGen
  { kind: 'video', src: 'broll/beat6-1080.mp4',       from: 629,  dur: 90,  fx: 'broll' },
  { kind: 'face',  src: 'face-clips/s7-seedance.mp4', from: 719,  dur: 153, fx: 'punch',     trim: 5 },  // Seedance
  { kind: 'image', src: 'broll/beat8-vs.png',         from: 872,  dur: 94,  fx: 'kenburns' },
  { kind: 'face',  src: 'face-clips/s9-aurora.mp4',   from: 966,  dur: 102, fx: 'accelpush', trim: 9 },  // Aurora (excited)
];

// SFX hits — whooshes on face entries / hard zooms, impacts on b-roll cuts, riser+boom on the Toccata reveal, boom on the close
type Sfx = { src: string; from: number; vol: number; startFrom?: number };
const SFX: Sfx[] = [
  { src: 'audio/sfx/whoosh.wav',  from: 0,   vol: 0.32 },                 // opening hard zoom-in
  { src: 'audio/sfx/impact1.wav', from: 99,  vol: 0.30 },                 // cut to b-roll (network)
  { src: 'audio/sfx/riser.mp3',   from: 242, vol: 0.38, startFrom: 132 }, // build into the Toccata reveal
  { src: 'audio/sfx/boom.wav',    from: 302, vol: 0.46 },                 // TOCCATA HARDFORK reveal
  { src: 'audio/sfx/whoosh.wav',  from: 515, vol: 0.30 },                 // cut back to face (s5)
  { src: 'audio/sfx/impact2.wav', from: 629, vol: 0.34 },                 // cut to b-roll (code)
  { src: 'audio/sfx/whoosh.wav',  from: 719, vol: 0.30 },                 // cut to face (s7)
  { src: 'audio/sfx/impact1.wav', from: 872, vol: 0.40 },                 // KASPA vs ETHEREUM reveal
  { src: 'audio/sfx/boom.wav',    from: 966, vol: 0.42 },                 // closing "Ten days!"
];

// camera effect → CSS transform, from local frame f within a scene of length D
function fx(name: string, f: number, D: number) {
  const p = D > 0 ? f / D : 0;
  let scale = 1, x = 0, y = 0, rot = 0;
  if (name === 'hardin') scale = interpolate(f, [0, 9], [1.0, 1.26], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });  // snap zoom IN, hold
  else if (name === 'hardout') scale = interpolate(f, [0, 9], [1.26, 1.0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }); // snap zoom OUT, hold
  else if (name === 'pushin') scale = 1.0 + 0.12 * p;
  else if (name === 'pullout') scale = 1.16 - 0.14 * p;
  else if (name === 'shake') { scale = 1.07; x = 16 * Math.sin(f * 0.9); y = 11 * Math.sin(f * 1.27 + 1); rot = 1.3 * Math.sin(f * 0.7); }
  else if (name === 'punch') {
    scale = 1.04 + 0.06 * p;
    for (const pa of [46, 111]) { const a = f - pa; if (a >= 0 && a < 22) scale += 0.12 * (1 - a / 22); } // snap on "contracts","decentralized"
  } else if (name === 'accelpush') {
    scale = 1.0 + 0.26 * p * p;                       // accelerating into the close
    if (f > D - 16) { x = 11 * Math.sin(f * 1.6); y = 8 * Math.sin(f * 2.0); } // shake on "one!"
  } else if (name === 'kenburns') { scale = 1.0 + 0.13 * p; x = 10 * p; y = -8 * p; }
  else if (name === 'broll') scale = 1.0 + 0.06 * p;
  return `scale(${scale}) translate(${x}px, ${y}px) rotate(${rot}deg)`;
}

const SceneClip: React.FC<{ s: Scene }> = ({ s }) => {
  const frame = useCurrentFrame();
  const transform = fx(s.fx, frame, s.dur);
  // small entry pop for energy (first 5 frames)
  const pop = interpolate(frame, [0, 5], [1.04, 1.0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const style: React.CSSProperties = {
    width: '100%', height: '100%', objectFit: 'cover',
    transform: `scale(${pop}) ${transform}`, transformOrigin: 'center center',
  };
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: '#0a0008' }}>
      {s.kind === 'image'
        ? <Img src={staticFile(s.src)} style={style} />
        : <OffthreadVideo src={staticFile(s.src)} muted startFrom={s.trim ?? 0} style={style} />}
    </AbsoluteFill>
  );
};

// caption2 — arial-black uppercase karaoke (current word highlighted yellow)
const Caption2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  // suppress over the two title-card b-roll beats (beat4 10.05-17.15s, beat8 29.05-32.20s) — the image already shows the text
  if ((t >= 10.05 && t < 17.15) || (t >= 29.05 && t < 32.20)) return null;
  const g = CAPTIONS.find((c) => t >= c.start && t < c.end + 0.18);
  if (!g) return null;
  return (
    <div style={{
      position: 'absolute', bottom: 430, left: 0, right: 0,
      display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px 16px', padding: '0 64px',
      fontFamily: "'Arial Black', Arial, sans-serif", fontSize: 80, fontWeight: 900,
      textTransform: 'uppercase', letterSpacing: 1, lineHeight: 1.05,
    }}>
      {g.words.map((w, i) => {
        const active = t >= w.start && t < w.end + 0.06;
        return (
          <span key={i} style={{
            color: active ? '#1a1a1a' : '#fff',
            WebkitTextStroke: active ? '0px transparent' : '9px #000',
            paintOrder: 'stroke' as any,
            backgroundColor: active ? '#ffd400' : 'transparent',
            borderRadius: 10, padding: '3px 13px', // CONSISTENT box (active==inactive) -> no reflow/line-jump flicker
            display: 'inline-block', whiteSpace: 'nowrap',
          }}>{w.w}</span>
        );
      })}
    </div>
  );
};

export const AnaToccata: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* continuous VO (face clips muted; this is the clean audio bed) */}
      <Audio src={staticFile('audio/toccata-master-final.mp3')} />
      {/* music bed ~17 dB under the VO (VO -17.6 LUFS, bed -12.4 -> 0.085 gain) */}
      <Audio src={staticFile('audio/music-bed.mp3')} volume={0.085} />
      {/* SFX hits */}
      {SFX.map((s, i) => (
        <Sequence key={'sfx' + i} from={s.from}>
          <Audio src={staticFile(s.src)} startFrom={s.startFrom ?? 0} volume={s.vol} />
        </Sequence>
      ))}
      {SCENES.map((s, i) => (
        <Sequence key={i} from={s.from} durationInFrames={s.dur}>
          <SceneClip s={s} />
        </Sequence>
      ))}
      <AbsoluteFill style={{ zIndex: 200, pointerEvents: 'none' }}>
        <Caption2 />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

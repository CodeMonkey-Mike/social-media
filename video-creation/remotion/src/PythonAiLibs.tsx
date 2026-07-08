import React from 'react';
import { AbsoluteFill, Audio, Img, Sequence, interpolate, useCurrentFrame, staticFile } from 'remotion';

// python-ai-libraries (ai-engineering track) — pure VO over standalone containers.
// Chapters 1-4 draft = chunks 01-11. Timeline mirrors the LOCKED full-narration stitch
// (0.35s inter-chunk gaps); starts measured per chunk with ffprobe (see BROLL-PLAN.md).
// Render with --public-dir=../ai-engineering/media/python-ai-libraries

export const PAL_FPS = 30;

type Chunk = { start: number; audio: string; visual: string };
export const CHUNKS: Chunk[] = [
  { start: 0.0,     audio: 'audio/chunk-01-hook.mp3',    visual: 'render-assets/container-01.png' },
  { start: 16.79,   audio: 'audio/chunk-02-map.mp3',     visual: 'render-assets/container-02.png' },
  { start: 29.548,  audio: 'audio/chunk-03-handoff.mp3', visual: 'render-assets/container-03.png' },
  { start: 43.362,  audio: 'audio/chunk-04.mp3',         visual: 'render-assets/container-04.png' },
  { start: 54.968,  audio: 'audio/chunk-05.mp3',         visual: 'render-assets/container-05.png' },
  { start: 67.39,   audio: 'audio/chunk-06.mp3',         visual: 'render-assets/container-06.png' },
  { start: 80.556,  audio: 'audio/chunk-07.mp3',         visual: 'render-assets/container-07.png' },
  { start: 95.546,  audio: 'audio/chunk-08.mp3',         visual: 'render-assets/container-08.png' },
  { start: 111.952, audio: 'audio/chunk-09.mp3',         visual: 'render-assets/container-09.png' },
  { start: 125.382, audio: 'audio/chunk-10.mp3',         visual: 'render-assets/container-10.png' },
  { start: 145.652, audio: 'audio/chunk-11.mp3',         visual: 'render-assets/container-11.png' },
  { start: 164.242, audio: 'audio/chunk-12.mp3',         visual: 'render-assets/container-12.png' },
  { start: 179.448, audio: 'audio/chunk-13.mp3',         visual: 'render-assets/container-13.png' },
  { start: 194.654, audio: 'audio/chunk-14.mp3',         visual: 'render-assets/container-14.png' },
  { start: 206.86,  audio: 'audio/chunk-15.mp3',         visual: 'render-assets/container-15.png' },
  { start: 220.842, audio: 'audio/chunk-16.mp3',         visual: 'render-assets/container-16.png' },
  { start: 232.424, audio: 'audio/chunk-17.mp3',         visual: 'render-assets/container-17.png' },
  { start: 244.27,  audio: 'audio/chunk-18.mp3',         visual: 'render-assets/container-18.png' },
  { start: 259.284, audio: 'audio/chunk-19.mp3',         visual: 'render-assets/container-19.png' },
  { start: 270.314, audio: 'audio/chunk-20.mp3',         visual: 'render-assets/container-20.png' },
  { start: 286.696, audio: 'audio/chunk-21.mp3',         visual: 'render-assets/container-21.png' },
  { start: 300.102, audio: 'audio/chunk-22.mp3',         visual: 'render-assets/container-22.png' },
  { start: 314.084, audio: 'audio/chunk-23.mp3',         visual: 'render-assets/container-23.png' },
  { start: 328.714, audio: 'audio/chunk-24.mp3',         visual: 'render-assets/container-24.png' },
  { start: 341.328, audio: 'audio/chunk-25.mp3',         visual: 'render-assets/container-25.png' },
  { start: 355.31,  audio: 'audio/chunk-26.mp3',         visual: 'render-assets/container-26.png' },
  { start: 369.748, audio: 'audio/chunk-27.mp3',         visual: 'render-assets/container-27.png' },
  { start: 380.538, audio: 'audio/chunk-28.mp3',         visual: 'render-assets/container-28.png' },
  { start: 398.768, audio: 'audio/chunk-29.mp3',         visual: 'render-assets/container-29.png' },
  { start: 414.382, audio: 'audio/chunk-30.mp3',         visual: 'render-assets/container-30.png' },
  { start: 426.996, audio: 'audio/chunk-31.mp3',         visual: 'render-assets/container-31.png' },
  { start: 441.77,  audio: 'audio/chunk-32.mp3',         visual: 'render-assets/container-32.png' },
  { start: 456.568, audio: 'audio/chunk-33.mp3',         visual: 'render-assets/container-33.png' },
  { start: 467.742, audio: 'audio/chunk-34.mp3',         visual: 'render-assets/container-34.png' },
  { start: 483.164, audio: 'audio/chunk-35.mp3',         visual: 'render-assets/container-35.png' },
  { start: 500.746, audio: 'audio/chunk-36.mp3',         visual: 'render-assets/container-36.png' },
  { start: 514.968, audio: 'audio/chunk-37.mp3',         visual: 'render-assets/container-37.png' },
];
export const VO_END = 519.216; // end of chunk-37 audio on the stitch timeline (matches full-narration.mp3)
export const TAIL = 1.6;
export const PAL_DURATION = Math.round((VO_END + TAIL) * PAL_FPS); // 15624

// Chunk 01 shows the title container ~5s, then the tall import montage pans for the rest.
export const MONTAGE_IN = 5.0;
export const MUSIC_SRC = 'render-assets/music-corporate.mp3';
export const MUSIC_VOL_EXPORT = 0.056;
const MONTAGE_H = 4400;

const XFADE = 10; // frames of cross-dissolve at each visual boundary

const toF = (s: number) => Math.round(s * PAL_FPS);

// Music: -10.4 LUFS integrated vs VO -16.4 LUFS. Target bed ~19 dB under the VO
// ("very low"): gain -25 dB => volume 10^(-25/20) ~= 0.056. Loops (track is 148.25s).
const MUSIC_VOL = 0.056;

const ZoomStill: React.FC<{ src: string; durF: number; fadeIn: boolean }> = ({ src, durF, fadeIn }) => {
  const f = useCurrentFrame();
  const opacity = fadeIn ? interpolate(f, [0, XFADE], [0, 1], { extrapolateRight: 'clamp' }) : 1;
  const scale = interpolate(f, [0, durF], [1.0, 1.045]);
  return (
    <AbsoluteFill style={{ opacity, background: '#0a0c10' }}>
      <Img src={staticFile(src)} style={{ width: '100%', height: '100%', transform: `scale(${scale})` }} />
    </AbsoluteFill>
  );
};

const MontagePan: React.FC<{ durF: number }> = ({ durF }) => {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [0, XFADE], [0, 1], { extrapolateRight: 'clamp' });
  const y = interpolate(f, [0, durF], [0, -(MONTAGE_H - 1080)], {
    easing: (t) => t * t * (3 - 2 * t) * 0.15 + t * 0.85, // mostly linear, soft ends
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{ opacity, background: '#0a0c10' }}>
      <Img src={staticFile('render-assets/montage-imports.png')} style={{ width: 1920, height: MONTAGE_H, transform: `translateY(${y}px)` }} />
    </AbsoluteFill>
  );
};

export const PythonAiLibs: React.FC = () => {
  // visual segments: [start, end, node]
  type Seg = { start: number; end: number; kind: 'still' | 'montage'; src?: string };
  const segs: Seg[] = [];
  CHUNKS.forEach((c, i) => {
    const end = i < CHUNKS.length - 1 ? CHUNKS[i + 1].start : VO_END + TAIL;
    if (i === 0) {
      segs.push({ start: 0, end: MONTAGE_IN, kind: 'still', src: c.visual });
      segs.push({ start: MONTAGE_IN, end, kind: 'montage' });
    } else {
      segs.push({ start: c.start, end, kind: 'still', src: c.visual });
    }
  });

  const musicVolume = (f: number) =>
    MUSIC_VOL *
    interpolate(f, [0, 30], [0, 1], { extrapolateRight: 'clamp' }) *
    interpolate(f, [PAL_DURATION - 60, PAL_DURATION - 6], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: '#0a0c10' }}>
      {segs.map((s, i) => {
        const fromF = Math.max(0, toF(s.start) - (i === 0 ? 0 : XFADE));
        const durF = toF(s.end) - fromF;
        return (
          <Sequence key={i} from={fromF} durationInFrames={durF} name={`v-${i}-${s.kind}`}>
            {s.kind === 'montage' ? (
              <MontagePan durF={durF} />
            ) : (
              <ZoomStill src={s.src!} durF={durF} fadeIn={i !== 0} />
            )}
          </Sequence>
        );
      })}

      {CHUNKS.map((c, i) => (
        <Sequence key={`a-${i}`} from={toF(c.start)} name={`vo-${i + 1}`}>
          <Audio src={staticFile(c.audio)} />
        </Sequence>
      ))}

      <Audio loop src={staticFile('render-assets/music-corporate.mp3')} volume={musicVolume} />
    </AbsoluteFill>
  );
};

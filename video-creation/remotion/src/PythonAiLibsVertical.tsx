import React from 'react';
import { AbsoluteFill, Audio, Img, Sequence, interpolate, useCurrentFrame, staticFile } from 'remotion';
import { CHUNKS, VO_END, TAIL, MONTAGE_IN, MUSIC_SRC, MUSIC_VOL_EXPORT, PAL_FPS } from './PythonAiLibs';

// VERTICAL (1080x1920) repurpose of python-ai-libraries for LinkedIn.
// Same locked VO timeline (imported from PythonAiLibs); visuals are the PORTRAIT
// container set (render-assets/vertical/container-v-NN.png, from containers-vertical.html).
// Render with --public-dir=../ai-engineering/media/python-ai-libraries

export const PALV_FPS = PAL_FPS;
export const PALV_DURATION = Math.round((VO_END + TAIL) * PALV_FPS);

const MONTAGE_H = 3000; // montage-imports-v.png is 1080x3000
const XFADE = 10;
const toF = (s: number) => Math.round(s * PALV_FPS);

const vVisual = (i: number) => `render-assets/vertical/container-v-${String(i + 1).padStart(2, '0')}.png`;

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
  const y = interpolate(f, [0, durF], [0, -(MONTAGE_H - 1920)], {
    easing: (t) => t * t * (3 - 2 * t) * 0.15 + t * 0.85,
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{ opacity, background: '#0a0c10' }}>
      <Img src={staticFile('render-assets/vertical/montage-imports-v.png')} style={{ width: 1080, height: MONTAGE_H, transform: `translateY(${y}px)` }} />
    </AbsoluteFill>
  );
};

export const PythonAiLibsVertical: React.FC = () => {
  type Seg = { start: number; end: number; kind: 'still' | 'montage'; src?: string };
  const segs: Seg[] = [];
  CHUNKS.forEach((c, i) => {
    const end = i < CHUNKS.length - 1 ? CHUNKS[i + 1].start : VO_END + TAIL;
    if (i === 0) {
      segs.push({ start: 0, end: MONTAGE_IN, kind: 'still', src: vVisual(0) });
      segs.push({ start: MONTAGE_IN, end, kind: 'montage' });
    } else {
      segs.push({ start: c.start, end, kind: 'still', src: vVisual(i) });
    }
  });

  const musicVolume = (f: number) =>
    MUSIC_VOL_EXPORT *
    interpolate(f, [0, 30], [0, 1], { extrapolateRight: 'clamp' }) *
    interpolate(f, [PALV_DURATION - 60, PALV_DURATION - 6], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

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

      <Audio loop src={staticFile(MUSIC_SRC)} volume={musicVolume} />
    </AbsoluteFill>
  );
};

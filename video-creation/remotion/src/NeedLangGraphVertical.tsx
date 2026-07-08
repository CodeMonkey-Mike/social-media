import React from 'react';
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { NLG_CHUNKS, NLG_VO_END, NLG_TAIL, NLG_FPS } from './needLangGraphTimeline';

// need-lang-graph VERTICAL (9:16) — portrait reflow of NeedLangGraph.tsx.
// Identical spine (same timeline, same VO, same music, same zoom + cross-dissolve), only the
// frame is 1080x1920 and the still per chunk comes from render-assets/vertical/ (portrait PNGs).
// Render with --public-dir=../ai-engineering/media/need lang-graph

export const NLGV_FPS_EXPORT = NLG_FPS;
export const NLGV_DURATION = Math.round((NLG_VO_END + NLG_TAIL) * NLG_FPS);

const XFADE = 10; // frames of cross-dissolve at each visual boundary
const toF = (s: number) => Math.round(s * NLG_FPS);

const MUSIC_VOL = 0.056;
const MUSIC_SRC = 'render-assets/music-corporate.mp3';

// portrait stills live under render-assets/vertical/
const vertVisual = (v: string) => v.replace('render-assets/', 'render-assets/vertical/');

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

export const NeedLangGraphVertical: React.FC = () => {
  type Seg = { start: number; end: number; src: string };
  const segs: Seg[] = NLG_CHUNKS.map((c, i) => ({
    start: c.start,
    end: i < NLG_CHUNKS.length - 1 ? NLG_CHUNKS[i + 1].start : NLG_VO_END + NLG_TAIL,
    src: vertVisual(c.visual),
  }));

  const musicVolume = (f: number) =>
    MUSIC_VOL *
    interpolate(f, [0, 30], [0, 1], { extrapolateRight: 'clamp' }) *
    interpolate(f, [NLGV_DURATION - 60, NLGV_DURATION - 6], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: '#0a0c10' }}>
      {segs.map((s, i) => {
        const fromF = Math.max(0, toF(s.start) - (i === 0 ? 0 : XFADE));
        const durF = toF(s.end) - fromF;
        return (
          <Sequence key={i} from={fromF} durationInFrames={durF} name={`v-${i + 1}`}>
            <ZoomStill src={s.src} durF={durF} fadeIn={i !== 0} />
          </Sequence>
        );
      })}

      {NLG_CHUNKS.map((c, i) => (
        <Sequence key={`a-${i}`} from={toF(c.start)} name={`vo-${i + 1}`}>
          <Audio src={staticFile(c.audio)} />
        </Sequence>
      ))}

      <Audio loop src={staticFile(MUSIC_SRC)} volume={musicVolume} />
    </AbsoluteFill>
  );
};

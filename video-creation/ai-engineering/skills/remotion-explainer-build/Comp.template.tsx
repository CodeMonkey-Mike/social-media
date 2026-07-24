// TEMPLATE — copy to video-creation/remotion/src/<Name>.tsx and replace:
//   __MODULE__  = the timeline module name build-timeline.js emits (e.g. saveTokensTimeline)
//   __PREFIX__  = the export prefix in that module (e.g. ST)
//   __COMP__    = the React component name (e.g. SaveTokens)
// Then register in Root.tsx:
//   <Composition id="__COMP__" component={__COMP__} durationInFrames={__PREFIX___DURATION}
//     fps={__PREFIX___FPS_EXPORT} width={1920} height={1080} />
// Render with --public-dir="../ai-engineering/media/<project>". Music is muxed in at render time, NOT here.
import React from 'react';
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { __PREFIX___CHUNKS, __PREFIX___VO_END, __PREFIX___TAIL, __PREFIX___FPS } from './__MODULE__';

export const __PREFIX___FPS_EXPORT = __PREFIX___FPS;
export const __PREFIX___DURATION = Math.round((__PREFIX___VO_END + __PREFIX___TAIL) * __PREFIX___FPS);

const XFADE = 10; // frames of cross-dissolve at each visual boundary
const toF = (s: number) => Math.round(s * __PREFIX___FPS);

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

export const __COMP__: React.FC = () => {
  type Seg = { start: number; end: number; src: string };
  const segs: Seg[] = __PREFIX___CHUNKS.map((c, i) => ({
    start: c.start,
    end: i < __PREFIX___CHUNKS.length - 1 ? __PREFIX___CHUNKS[i + 1].start : __PREFIX___VO_END + __PREFIX___TAIL,
    src: c.visual,
  }));

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
      {__PREFIX___CHUNKS.map((c, i) => (
        <Sequence key={`a-${i}`} from={toF(c.start)} name={`vo-${i + 1}`}>
          <Audio src={staticFile(c.audio)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

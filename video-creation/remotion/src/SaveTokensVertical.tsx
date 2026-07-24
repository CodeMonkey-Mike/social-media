import React from 'react';
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { ST_CHUNKS, ST_VO_END, ST_TAIL, ST_FPS } from './saveTokensTimeline';

// 9:16 vertical cut of "Save Tokens with Sub-Agents". Reuses the SAME timeline + VO as the 16:9;
// only the container images differ (portrait reflow in render-assets/vertical/). Audio (VO + bed)
// is reused verbatim from the 16:9 final at mux time (scripts/render-vertical.sh). 1080x1920.
//   --public-dir="../ai-engineering/media/Save tokens by using sub agents"

export const SAVETOKV_FPS_EXPORT = ST_FPS;
export const SAVETOKV_DURATION = Math.round((ST_VO_END + ST_TAIL) * ST_FPS);

const XFADE = 10;
const toF = (s: number) => Math.round(s * ST_FPS);
const vpath = (v: string) => v.replace('render-assets/', 'render-assets/vertical/');

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

export const SaveTokensVertical: React.FC = () => {
  type Seg = { start: number; end: number; src: string };
  const segs: Seg[] = ST_CHUNKS.map((c, i) => ({
    start: c.start,
    end: i < ST_CHUNKS.length - 1 ? ST_CHUNKS[i + 1].start : ST_VO_END + ST_TAIL,
    src: vpath(c.visual),
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
      {ST_CHUNKS.map((c, i) => (
        <Sequence key={`a-${i}`} from={toF(c.start)} name={`vo-${i + 1}`}>
          <Audio src={staticFile(c.audio)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

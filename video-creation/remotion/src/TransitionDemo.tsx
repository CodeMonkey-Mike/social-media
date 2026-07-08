import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  staticFile,
  useVideoConfig,
} from 'remotion';
import { ENGINES, getTransition, framesForRow } from './transitions';

export const DEMO_HOLD = 18; // frames each still rests before/after the transition

// The two real stills every demo cuts between (bittensor-for-the-future b-roll,
// copied into the public dir as assets/transitions/lib/demo/).
const SCENE_A = 'transitions/lib/demo/scene-a.jpg';
const SCENE_B = 'transitions/lib/demo/scene-b.jpg';

const Still: React.FC<{ src: string }> = ({ src }) => (
  <AbsoluteFill style={{ backgroundColor: 'black' }}>
    <Img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
  </AbsoluteFill>
);

export type TransitionDemoProps = { id: string };

/**
 * Renders one library.json transition as a demo: hold still A, play the
 * transition into still B, hold B. Parametrized by `id` so a single
 * composition + Remotion's calculateMetadata covers every row (the preview
 * generator renders each id to browse/<category>/<variant>/<id>.mp4).
 */
export const TransitionDemo: React.FC<TransitionDemoProps> = ({ id }) => {
  const { fps } = useVideoConfig();
  const row = getTransition(id);
  if (!row) {
    return (
      <AbsoluteFill style={{ backgroundColor: 'crimson', color: 'white', fontSize: 48, justifyContent: 'center', alignItems: 'center' }}>
        unknown transition id: {id}
      </AbsoluteFill>
    );
  }
  const Engine = ENGINES[row.engine];
  const win = framesForRow(row, fps);

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      <Sequence from={0} durationInFrames={DEMO_HOLD}>
        <Still src={SCENE_A} />
      </Sequence>
      <Sequence from={DEMO_HOLD} durationInFrames={win}>
        <Engine
          from={<Still src={SCENE_A} />}
          to={<Still src={SCENE_B} />}
          fromSrc={SCENE_A}
          toSrc={SCENE_B}
          durationInFrames={win}
          params={row.params}
          sfxSrc={row.sfx}
        />
      </Sequence>
      <Sequence from={DEMO_HOLD + win}>
        <Still src={SCENE_B} />
      </Sequence>
      {/* SFX from the transition start, allowed to ring out past the (possibly
          short) window so it isn't clipped — emitted here, not in the engine. */}
      {row.sfx && (
        <Sequence from={DEMO_HOLD}>
          <Audio src={staticFile(row.sfx)} />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};

/** Composition duration for a given id, used by Root's calculateMetadata. */
export const demoDurationFrames = (id: string, fps: number) => {
  const row = getTransition(id);
  const win = row ? framesForRow(row, fps) : fps;
  return DEMO_HOLD * 2 + win;
};

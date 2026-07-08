import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile } from 'remotion';
import { TransitionClip } from './transitions/TransitionClip';

/**
 * Validation comp: runs a library transition between two LIVE VIDEO clips via the
 * reusable TransitionClip wrapper (proves transitions work over video, not just
 * stills). Set the `id` prop to any library transition.
 */
export const TransitionTest: React.FC<{ id: string }> = ({ id }) => (
  <AbsoluteFill style={{ backgroundColor: 'black' }}>
    <TransitionClip
      id={id}
      cutFrame={37}
      outgoing={() => <OffthreadVideo src={staticFile('transitions/lib/_test/clipA.mp4')} muted />}
      incoming={() => <OffthreadVideo src={staticFile('transitions/lib/_test/clipB.mp4')} muted />}
    />
  </AbsoluteFill>
);

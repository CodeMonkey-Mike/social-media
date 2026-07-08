import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from 'remotion';
import { ENGINES, getTransition, framesForRow } from './index';

/**
 * THE REUSABLE TRANSITION WRAPPER (build once, use in every longform).
 *
 * Places a library transition at a cut between two clips. `outgoing`/`incoming`
 * are render-functions returning a fresh full-frame node each call (e.g.
 * `() => <OffthreadVideo src={staticFile('clipA.mp4')} />`) so the engine can
 * wrap-displace them. The transition window straddles `cutFrame` and hides the
 * cut; before/after, the clips play clean.
 *
 * Usage in a longform comp:
 *   <TransitionClip id="badsignal-max-1" cutFrame={120}
 *      outgoing={() => <OffthreadVideo src={staticFile('a.mp4')} />}
 *      incoming={() => <OffthreadVideo src={staticFile('b.mp4')} />} />
 *
 * Pick `id` by scanning library.json (see each row's `meta`: aspectRatios,
 * description, energy, tags, useWhen). Same component for ALL transitions; only
 * the `id` changes.
 */
export const TransitionClip: React.FC<{
  id: string;
  cutFrame: number;
  outgoing: () => React.ReactNode;
  incoming: () => React.ReactNode;
}> = ({ id, cutFrame, outgoing, incoming }) => {
  const { fps } = useVideoConfig();
  const row = getTransition(id);
  if (!row) {
    return (
      <AbsoluteFill style={{ backgroundColor: 'crimson', color: '#fff', fontSize: 40, justifyContent: 'center', alignItems: 'center' }}>
        unknown transition id: {id}
      </AbsoluteFill>
    );
  }
  const Engine = ENGINES[row.engine] as React.FC<any>;
  const win = framesForRow(row, fps);
  const winStart = Math.max(0, cutFrame - Math.round(win / 2));

  return (
    <AbsoluteFill>
      {/* outgoing clip, clean, up to the transition window */}
      {/* guard: when the window starts at frame 0 (win >= 2*cutFrame) there is no clean
          outgoing portion — a 0-duration Sequence throws (found 2026-07-06, carry-trade). */}
      {winStart > 0 && (
        <Sequence from={0} durationInFrames={winStart}>
          <AbsoluteFill>{outgoing()}</AbsoluteFill>
        </Sequence>
      )}

      {/* the transition (hides the cut); engine swaps outgoing->incoming inside */}
      <Sequence from={winStart} durationInFrames={win}>
        <Engine
          from={outgoing()}
          to={incoming()}
          outClip={outgoing}
          inClip={incoming}
          durationInFrames={win}
          params={row.params}
          sfxSrc={row.sfx}
        />
      </Sequence>

      {/* incoming clip, clean, after the window */}
      <Sequence from={winStart + win}>
        <AbsoluteFill>{incoming()}</AbsoluteFill>
      </Sequence>

      {/* SFX from the transition start, ringing out past the window into clip B. */}
      {row.sfx && (
        <Sequence from={winStart}>
          <Audio src={staticFile(row.sfx)} />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};

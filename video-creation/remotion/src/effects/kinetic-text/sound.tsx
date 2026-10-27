// sound.tsx: places a device's sounds (KtSoundCue[], from each engine's kt*Sounds() helper) as <Audio> elements.
// The engines stay visual; the PAIRING lives in the helpers, so a comp grabs motion + sound together:
//   <KtSfx cues={ktKeywordPopSounds({ t0: 12.23, meaning: 'neutral' })} src={(id) => staticFile(`sfx/${ktSfxFile(id)}`)} />
import React from 'react';
import { Audio, Sequence, useVideoConfig } from 'remotion';
import { KtSoundCue } from './types';

export const KtSfx: React.FC<{
  cues: KtSoundCue[];
  /** sound id -> a URL the comp can load (staticFile path in the comp's public dir) */
  src: (id: string) => string;
  volume?: number;
  /** comp-clock seconds -> composition frame (default sec * fps; a comp with a paused spine passes its own map) */
  toFrame?: (sec: number) => number;
}> = ({ cues, src, volume = 1, toFrame }) => {
  const { fps } = useVideoConfig();
  const f = toFrame ?? ((s: number) => Math.round(s * fps));
  return (
    <>
      {cues.map((c, i) => {
        const trim = Math.round((c.trimIn ?? 0) * fps);
        const start = f(c.at + (c.trimIn ?? 0));
        const lost = start < 0 ? -start : 0; // a cue that starts before frame 0 is trimmed, never shifted
        const dur = c.dur !== undefined ? Math.max(1, Math.round(c.dur * fps) - lost) : undefined;
        return (
          <Sequence key={`${c.id}-${i}`} from={Math.max(0, start)} durationInFrames={dur} layout="none" name={`sfx ${c.id}`}>
            <Audio src={src(c.id)} trimBefore={trim + lost} volume={volume} />
          </Sequence>
        );
      })}
    </>
  );
};

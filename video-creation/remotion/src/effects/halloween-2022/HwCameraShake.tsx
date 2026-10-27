// HwCameraShake.tsx: hw-camera-shake (library.json devices.hw-camera-shake), the sustained FACE-hold camera move of Bear
// Markets: the Swiftly Studio 850 "Motion Shake Optics - 2x" (23.833 for 5.4 s, 47.800 for 2.7 s) and "- 3x" (61.367 for
// 3.3 s) adjustment layers held over the face shot after a montage / cut-away: Corner Pin with all four corners keyed every
// 0.04 s (a baked 60 s real handheld wiggle) + a static Lens Distortion (curvature -10 for 2x, -12 for 3x), no Transform,
// so no motion blur; every instance starts the TRACK at t = 0 on the shot's first frame and stops dead with the shot.
// NO DATA HERE: the motion is the TRANSITIONS library's rows `motion-shake-optics-2x-long` / `motion-shake-optics-3x-long`
// (the full 60 s Corner Pin tracks) rendered by its `MotionShake` engine (src/transitions/engines/MotionShake.tsx). This
// wrapper only places that row on a sustained face window: a <Sequence> from the shot's first frame (the track's t = 0),
// frame-locked like every transitions engine; `clip` is the face footage, rendered inside that Sequence (give it the
// footage's own offset, trimBefore, exactly as for TransitionClip). The long rows read their Corner Pin master from a data
// file (`params.track` = transitions/lib/shake/motion-shake-optics-<2x|3x>-60s.json, fetched through staticFile): the
// comp's public dir must carry it, like a transitions plate. A missing row renders a crimson banner (never a silent
// fallback to the 2.08 s rows, which freeze after 2 s). SILENT in the source (the pack ships no sound).
import React from 'react';
import { AbsoluteFill, Sequence, useVideoConfig } from 'remotion';
import { getTransition } from '../../transitions/registry';
import { MotionShake, MotionShakeParams } from '../../transitions/engines/MotionShake';
import { hwPaired } from './sfx';
import { HwSoundCue } from './types';

export const HW_CAMERA_SHAKE = {
  rows: { '2x': 'motion-shake-optics-2x-long', '3x': 'motion-shake-optics-3x-long' } as const,
};

export type HwCameraShakeProps = {
  /** first frame of the face shot (the shake track's t = 0), seconds on the comp clock */
  t0: number;
  /** the cut that ends the shot (the shake stops dead) */
  t1: number;
  /** '2x' (default, the 23.8 / 47.8 instances) or '3x' (61.4) */
  strength?: '2x' | '3x';
  /** override the transitions row id (default HW_CAMERA_SHAKE.rows[strength]) */
  rowId?: string;
  /** the face footage as a render function (a fresh full-frame node per call) */
  clip: () => React.ReactNode;
  /** comp-clock seconds -> composition frame (default sec * fps; a paused-spine comp passes its own map) */
  toFrame?: (sec: number) => number;
};

export const HwCameraShake: React.FC<HwCameraShakeProps> = (p) => {
  const { fps } = useVideoConfig();
  const f = p.toFrame ?? ((s: number) => Math.round(s * fps));
  const id = p.rowId ?? HW_CAMERA_SHAKE.rows[p.strength ?? '2x'];
  const row = getTransition(id);
  const from = f(p.t0);
  const dur = Math.max(1, f(p.t1) - from);
  if (!row) {
    return (
      <Sequence from={from} durationInFrames={dur} layout="none">
        <AbsoluteFill style={{ backgroundColor: 'crimson', color: '#fff', fontSize: 40, justifyContent: 'center', alignItems: 'center' }}>
          hw-camera-shake: transitions row {id} is not in assets/transitions/library.json
        </AbsoluteFill>
      </Sequence>
    );
  }
  return (
    <Sequence from={from} durationInFrames={dur} layout="none" name={`hw-camera-shake ${id}`}>
      <MotionShake from={null} to={null} durationInFrames={dur} params={row.params as unknown as MotionShakeParams} outClip={p.clip} />
    </Sequence>
  );
};

/** hw-camera-shake sounds: SILENT in the source (music only). `pair` = a screenplay-paired catalog sound on the shot start. */
export const hwCameraShakeSounds = (o: { t0: number; pair?: string }): HwSoundCue[] => hwPaired(o.pair, [o.t0], 'screenplay-paired: attack ON the shot start');

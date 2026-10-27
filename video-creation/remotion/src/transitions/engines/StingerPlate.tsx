import React from 'react';
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { TransitionProps } from '../types';

/**
 * SCARY / Stinger — third-party horror "stinger" plates, ONE engine for all of them (scary-1..15, 2026-10-25).
 *
 * NOT a Swiftly re-creation: each plate (assets/transitions/lib/scary/scary-N.mp4, 1920x1080 25 fps, audio
 * stripped) is a FINISHED, fully opaque effect clip from Mike's own assets folder: black head -> a scary face
 * rushes in -> the frame blows out to white / fire orange -> it fades to black. The plate IS the transition;
 * this engine only composites it over the cut and swaps the scene underneath INSIDE the white-out.
 *
 * Mechanism (rows built + measured by assets/transitions/_build-scary-rows.py):
 *   - scene: outgoing until frame/(win-1) >= params.cut, incoming after (image path via fromSrc/toSrc for the
 *     demo, live nodes via outClip/inClip for TransitionClip, exactly as LightLeaks). The builder snaps `cut`
 *     so the swap lands on a FULLY white plate frame at 30 fps, so the A->B change is never visible.
 *   - plate: <OffthreadVideo> from the window start, real time (25 fps plays fine in a 30 fps comp).
 *       blend 'screen' (default): mix-blend-mode screen. Legal black is see-through by the maths, the face
 *         haunts the footage, white covers it fully.
 *       blend 'opaque': normal blend = the plate covers the frame fully (its own black included) for its
 *         VISIBLE span (params.visible, plate frames with content), the black head / tail keyed out so the
 *         window edges do not dip to black.
 *       blend 'normal' (2026-10-25, scary-6-normal75 = the "044 Bear Markets" look): normal blend at
 *         params.opacity for the WHOLE window, nothing keyed: the plate's black head / tail DIM the footage and
 *         the white flash blows out over it. Premiere composited it Normal 75 % in LINEAR light; a gamma-space
 *         0.6 is the closest single-number stand-in here (the study's fit), so the row ships 0.6.
 *   - The plate's own baked sound is the row's sfx, emitted by the wrapper from the window start, untrimmed
 *     (in sync with the plate's first frame). Engines never emit audio.
 * Headless-Chromium compositing rules (LightLeaks / Monitor): the blend sits on the plate's OUTER wrapper,
 * a sibling of the scene; no filter on the blended element; the root isolates the group.
 */
export type StingerPlateParams = {
  /** staticFile() path of the plate (lib/scary/scary-N.mp4). Its sound is the row's sfx. */
  plate: string;
  /** The plate's native fps (25); used to know which plate frame is on screen. */
  plateFps: number;
  /** A->B swap fraction of the window (frame/(win-1) >= cut); snapped onto the white-out by the builder. */
  cut: number;
  /** 'screen' (default): black is transparent, the face haunts the footage. 'opaque': the plate covers the cut.
   * 'normal': the plate at `opacity` over the footage for the whole window, black head and tail included. */
  blend?: 'screen' | 'opaque' | 'normal';
  /** [first, last] plate frame with content (mean luma above the near-black fade); blend 'opaque' only. */
  visible?: [number, number];
  /** blend 'normal' only: the plate's opacity (default 1). */
  opacity?: number;
};

export const StingerPlate: React.FC<TransitionProps & { params: StingerPlateParams }> = ({
  from, to, fromSrc, toSrc, outClip, inClip, durationInFrames, params,
}) => {
  const frame = useCurrentFrame();
  const { width: W, height: H, fps } = useVideoConfig();
  const { plate, plateFps, cut, blend = 'screen', visible } = params;

  const p = frame / Math.max(1, durationInFrames - 1);
  const swapTo = p >= cut;
  const src = swapTo ? toSrc : fromSrc;
  const clipFn = swapTo ? inClip : outClip;
  const content = swapTo ? to : from;

  const scene = clipFn ? clipFn() : src ? (
    <Img src={staticFile(src)} style={{ width: `${W}px`, height: `${H}px`, objectFit: 'cover' }} />
  ) : (
    <AbsoluteFill>{content}</AbsoluteFill>
  );

  // the plate frame OffthreadVideo puts on screen now: the NEAREST one, x.5 up (measured on the scary-4 demo;
  // the builder uses the same rule to snap `cut` and to measure `visible`)
  const plateFrame = Math.round((frame * plateFps) / fps);
  const opaque = blend === 'opaque';
  const normal = blend === 'normal';
  const plateOn = !opaque || !visible || (plateFrame >= visible[0] && plateFrame <= visible[1]);

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', overflow: 'hidden', isolation: 'isolate' }}>
      <AbsoluteFill>{scene}</AbsoluteFill>
      <AbsoluteFill style={{ mixBlendMode: opaque || normal ? 'normal' : 'screen' }}>
        <AbsoluteFill style={{ opacity: plateOn ? (normal ? params.opacity ?? 1 : 1) : 0 }}>
          <OffthreadVideo
            src={staticFile(plate)}
            muted
            style={{ width: `${W}px`, height: `${H}px`, objectFit: 'cover' }}
          />
        </AbsoluteFill>
      </AbsoluteFill>
      {/* SFX (the plate's own baked stinger sound) is emitted from the wrapper. */}
    </AbsoluteFill>
  );
};

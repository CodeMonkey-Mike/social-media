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
 * SCARY / Fire Plate: a TRANSPARENT footage plate laid over a cut (scary-pumpkin-fire, 2026-10-25).
 *
 * NOT a Swiftly re-creation and not an opaque stinger: the plate (assets/transitions/lib/scary/scary-pumpkin-fire.webm,
 * 1920x1080 30 fps VP9 with a real ALPHA channel, no sound) is the Envato "evil pumpkin with fire" clip Mike used in
 * "044 Bear Markets" at 76.4-86.6 s as the act break into his 1929-crash chapter: a carved jack-o-lantern whose
 * face glows, then bursts into fire that spreads until it covers the frame. Every number below is that edit's
 * (read from the Premiere project by the scout study, rows built by assets/transitions/_build-bearmarkets-rows.py):
 *   - fadeIn  1.0 s: a Cross Dissolve from nothing over the outgoing scene (plate frame 0 at the window start).
 *   - the plate plays in real time (plate time = window time), Scale 113 % about the centre, y +15 px.
 *   - cut: the A->B swap (frame/(win-1) >= cut, the StingerPlate rule), at the start of the fade-out = where the
 *     clip ended in Bear Markets (the fire covers 98-99 % of the frame there; the builder measures it).
 *   - fadeOut 1.0 s: the plate dissolves away over the incoming scene (Bear Markets ran it into the next chapter on
 *     the clip's handle frames).
 * The source was ProRes 4444 PREMULTIPLIED on black (a fit against the Bear Markets render picked premultiplied +
 * linear-light compositing); the builder unpremultiplies it so the browser's straight-alpha compositing is right.
 * Remotion composites in gamma space, so semi-transparent smoke sits a little darker than Premiere's linear-light
 * composite (documented, fidelity near-1:1 on the opaque fire). The plate has NO sound (the row's sfx is null).
 * OffthreadVideo `transparent` extracts the frames as PNG so the alpha survives.
 */
export type AlphaPlateParams = {
  /** staticFile() path of the alpha plate (VP9 WebM with alpha). */
  plate: string;
  /** The plate's native fps (30). */
  plateFps: number;
  /** A->B swap fraction of the window (frame/(win-1) >= cut). */
  cut: number;
  /** Seconds the plate takes to dissolve in from nothing at the window start. */
  fadeIn: number;
  /** Seconds the plate takes to dissolve away at the window end. */
  fadeOut: number;
  /** The plate's opacity once faded in (default 1). */
  opacity?: number;
  /** Plate scale about the frame centre (default 1; Bear Markets 1.13). */
  scale?: number;
  /** Plate offset in px at 1920x1080 (scaled with the comp size; Bear Markets y +15). */
  offsetX?: number;
  offsetY?: number;
};

export const AlphaPlate: React.FC<TransitionProps & { params: AlphaPlateParams }> = ({
  from, to, fromSrc, toSrc, outClip, inClip, durationInFrames, params,
}) => {
  const frame = useCurrentFrame();
  const { width: W, height: H, fps } = useVideoConfig();
  const { plate, cut, fadeIn, fadeOut, opacity = 1, scale = 1, offsetX = 0, offsetY = 0 } = params;

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

  // linear dissolves (Premiere Cross Dissolve) in and out of the plate
  const t = frame / fps;
  const end = durationInFrames / fps;
  const env = Math.max(0, Math.min(1, fadeIn > 0 ? t / fadeIn : 1, fadeOut > 0 ? (end - t) / fadeOut : 1));

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', overflow: 'hidden' }}>
      <AbsoluteFill>{scene}</AbsoluteFill>
      <AbsoluteFill style={{ opacity: opacity * env }}>
        <AbsoluteFill
          style={{
            transform: `translate(${(offsetX * W) / 1920}px, ${(offsetY * H) / 1080}px) scale(${scale})`,
            transformOrigin: '50% 50%',
          }}
        >
          <OffthreadVideo
            src={staticFile(plate)}
            transparent
            muted
            style={{ width: `${W}px`, height: `${H}px`, objectFit: 'cover' }}
          />
        </AbsoluteFill>
      </AbsoluteFill>
      {/* the plate has no sound; a paired SFX (if a plan adds one) is emitted by the wrapper / post-mix */}
    </AbsoluteFill>
  );
};

import React from 'react';

/**
 * A transition renders the SWAP WINDOW between two scenes.
 *
 * It owns the whole window: it shows the tail of the outgoing scene (`from`)
 * for the first part, performs its visual effect, and reveals the head of the
 * incoming scene (`to`) for the rest. The surrounding timeline just holds
 * `from` before and `to` after — the transition hides the actual cut.
 *
 * `progress` is 0 at the first frame of the window and 1 at the last.
 */
export type TransitionProps = {
  from: React.ReactNode;
  to: React.ReactNode;
  /** Length of the swap window in frames (at the composition fps). */
  durationInFrames: number;
  /** Play the paired SFX. Default true. */
  sfx?: boolean;
  /** staticFile() path of the paired SFX for this row, or null. */
  sfxSrc?: string | null;
  /** staticFile() path of the outgoing scene image (footage engines that need
   * the raw bitmap, e.g. the Blocks matte/offset compositor). */
  fromSrc?: string;
  /** staticFile() path of the incoming scene image. */
  toSrc?: string;
  /** Render-functions for the outgoing / incoming clips as LIVE NODES (e.g.
   * <OffthreadVideo>), used over video in a longform edit. Each call must return
   * a fresh full-frame node (engines instantiate them multiple times to wrap).
   * When present, footage engines displace these instead of fromSrc/toSrc. */
  outClip?: () => React.ReactNode;
  inClip?: () => React.ReactNode;
};

export type TransitionKind = 'geometric' | 'footage' | 'shader';

export type TransitionDef = {
  id: string;
  category: string; // matches the Swiftly pack category (ZOOM, GLITCH, GLASS, ...)
  label: string;
  kind: TransitionKind;
  /** Native duration of the Swiftly source transition, in seconds. */
  durationSeconds: number;
  /** staticFile() path of the paired SFX, or null. */
  sfx: string | null;
  /** Fidelity vs. the Premiere original, for honest docs. */
  fidelity: 'near-1:1' | 'approximate';
  Component: React.FC<TransitionProps>;
};

/** Convert a registry duration (seconds) to frames at a given fps. */
export const framesFor = (def: TransitionDef, fps: number) =>
  Math.round(def.durationSeconds * fps);

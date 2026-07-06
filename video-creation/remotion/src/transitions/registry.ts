import React from 'react';
import library from '../../../assets/transitions/library.json';
import { GlitchBlocks } from './engines/GlitchBlocks';
import { GlitchBadSignal } from './engines/GlitchBadSignal';
import { GlitchCinematicMonitor } from './engines/GlitchCinematicMonitor';
import { GlitchInvert } from './engines/GlitchInvert';
import { GlitchMonitor } from './engines/GlitchMonitor';
import { GlitchOffset } from './engines/GlitchOffset';
import { GlitchRoughly } from './engines/GlitchRoughly';
import { GlitchTurbulentDisplace } from './engines/GlitchTurbulentDisplace';
import { GlitchTVSatellite } from './engines/GlitchTVSatellite';

/**
 * The catalog (data) lives in assets/transitions/library.json — the single
 * source of truth, mirroring assets/music/library.json etc. This registry is
 * the BRIDGE: it loads those rows and binds each row's `engine` string to the
 * React component that renders it. Scaling to 850 = more rows in the JSON +
 * more entries in ENGINES, not 850 components.
 */
export type TransitionRow = {
  id: string;
  category: string;
  variant: string;
  intensity: string;
  label: string;
  engine: string;
  kind: 'geometric' | 'footage' | 'shader';
  fidelity: 'near-1:1' | 'approximate';
  durationSeconds: number;
  params: Record<string, unknown>;
  sfx: string | null;
  used_in: string[];
  /** Picking metadata (aspectRatios, description, energy, tags, useWhen, …). */
  meta?: {
    aspectRatios: string[];
    resolution: string;
    family: string;
    engineFile: string | null;
    description: string;
    energy: 'low' | 'medium' | 'high';
    durationSeconds: number;
    hasSound: boolean;
    fidelity: string;
    tags: string[];
    useWhen: string;
  };
};

// engine name (as written in library.json) -> rendering component
export const ENGINES: Record<string, React.FC<any>> = {
  GlitchBlocks,
  GlitchBadSignal,
  GlitchCinematicMonitor,
  GlitchInvert,
  GlitchMonitor,
  GlitchOffset,
  GlitchRoughly,
  GlitchTurbulentDisplace,
  GlitchTVSatellite,
};

export const TRANSITIONS = (library as { transitions: TransitionRow[] }).transitions;

export const getTransition = (id: string) =>
  TRANSITIONS.find((t) => t.id === id);

export const framesForRow = (row: TransitionRow, fps: number) =>
  Math.round(row.durationSeconds * fps);

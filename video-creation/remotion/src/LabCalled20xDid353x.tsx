// LabCalled20xDid353x — batch what-if-1000x, clip #4 "We Estimated 20x. LAB Did 353x."
// Thin wrapper over the shared b-roll-capable LivestreamShort component; ALL data lives in
// constants-lab353.ts (see BROLL-PLAN.md in the clip folder for the beat-by-beat rationale).
import React from 'react';
import { LivestreamShort } from './LivestreamShort';
import { L353 } from './constants-lab353';

export const LabCalled20xDid353x: React.FC = () => <LivestreamShort data={L353} />;

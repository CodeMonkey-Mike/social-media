// OctoberBottomFrontrun — batch October-pumps, clip #2 "The Bottom Is Being Front-Run"
// Thin wrapper over the shared b-roll-capable LivestreamShort component; ALL data lives in
// constants-obfr.ts (see BROLL-PLAN.md in the clip folder for the beat-by-beat rationale).
import React from 'react';
import { LivestreamShort } from './LivestreamShort';
import { OBFR } from './constants-obfr';

export const OctoberBottomFrontrun: React.FC = () => <LivestreamShort data={OBFR} />;

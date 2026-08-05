// PainStickThrough — batch peach-minute, clip #2 "If You Can Stick Through This Pain, You Win"
// Thin wrapper over the shared b-roll-capable LivestreamShort component; ALL data lives in
// constants-psp.ts (see BROLL-PLAN.md in the clip folder for the beat-by-beat rationale).
import React from 'react';
import { LivestreamShort } from './LivestreamShort';
import { PSP } from './constants-psp';

export const PainStickThrough: React.FC = () => <LivestreamShort data={PSP} />;

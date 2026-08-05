// HousecoinStillHolding — batch peach-minute, clip #5 "Housecoin Just Got Delisted. I Want My 1000x."
// Thin wrapper over the shared b-roll-capable LivestreamShort component; ALL data lives in
// constants-hsc.ts (see BROLL-PLAN.md in the clip folder for the beat-by-beat rationale).
import React from 'react';
import { LivestreamShort } from './LivestreamShort';
import { HSC } from './constants-hsc';

export const HousecoinStillHolding: React.FC = () => <LivestreamShort data={HSC} />;

// TenCoins1000xMath — batch what-if-1000x, clip #1 "$1,000 Into 10 Coins: The Real 1000x Math"
// Thin wrapper over the shared b-roll-capable LivestreamShort component; ALL data lives in
// constants-tc.ts (see BROLL-PLAN.md in the clip folder for the beat-by-beat rationale).
import React from 'react';
import { LivestreamShort } from './LivestreamShort';
import { TC } from './constants-tc';

export const TenCoins1000xMath: React.FC = () => <LivestreamShort data={TC} />;

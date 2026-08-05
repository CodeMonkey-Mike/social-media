// KaspaOverDollar — batch whatif, clip #2 "89% Said Kaspa Over the Dollar"
// Thin wrapper over the shared b-roll-capable LivestreamShort component; ALL data lives in
// constants-k89.ts (see BROLL-PLAN.md in the clip folder for the beat-by-beat rationale).
import React from 'react';
import { LivestreamShort } from './LivestreamShort';
import { K89 } from './constants-k89';

export const KaspaOverDollar: React.FC = () => <LivestreamShort data={K89} />;

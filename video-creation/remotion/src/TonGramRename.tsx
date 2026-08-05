// TonGramRename — batch new-bottom, clip #4 "I'd Be a TON Maxi If Kaspa Never Existed"
// Thin wrapper over the shared b-roll-capable LivestreamShort component; ALL data lives in
// constants-tgr.ts (see BROLL-PLAN.md in the clip folder for the beat-by-beat rationale).
import React from 'react';
import { LivestreamShort } from './LivestreamShort';
import { TGR } from './constants-tgr';

export const TonGramRename: React.FC = () => <LivestreamShort data={TGR} />;

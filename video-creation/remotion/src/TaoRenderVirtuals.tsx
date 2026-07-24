import React from 'react';
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate, Easing } from 'remotion';
import { ENGINES, getTransition, framesForRow } from './transitions';
import { FACE_JUMPS } from './taoRenderVirtualsFaceJumps';
import { ChartC1Emission, ChartC2MetcalfeReed, FONTS } from './taoRenderVirtualsCharts';
import { TRVCAPTIONS } from './taoRenderVirtualsCaptions';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';

// ============================================================================
// tao-render-virtuals — longform-edited 16:9 comp (comp-build.md canonical)
// PASS 4 (the 2026-07-19 audit rebuild): canonical COVERS (lint-covers parses
// this file) · 6 melt/spin marquees (TRANSITIONS §4) · 12 blocks-max face
// cut-ins · badsignal still ingress · live charts C1/C2 · cube chapter cards +
// card pauses (PAUSE_ACTIVE) · punch-ins · light leaks · CTA 350x/58x badges ·
// FACE jump-cut zoom+tear (PASS 3, kept).
// Audio: the comp carries ONLY the spine VO. Music + ALL transition SFX are
// ffmpeg-mixed post-render (comp-build §9) — every engine gets sfx={false};
// the cue list for the mix lives in SFX-CUES.json (project root).
// ============================================================================
// DIAGRAM_REFS: lineup-board, contains-both-tease, C2-A, C2-B, D3-A, D3-C, D4-A, D4-B, D4-C, D5-A, D5-B1, D5-B2, D5-C, D6-A, D6-B, D6-C, D7-A, permissionless-doors, agent-subnet
// COMPARISON_REFS: D3-D-before, D3-D, shape-takeaway, flip-side, D6-A-chain, D6-A-token
// OVERVIEW_REFS: tao-money, which-lane, setup-checklist
// (end declared refs)

export const TRV_FPS = 30;
const FPS = TRV_FPS;
const SPINE_SECS = 911.4333; // ALL.d.desilenced source length
const PAUSE = 1.0;
// Card-pause INSERTS — 1s freeze+silence baked into the spine at each chapter card.
// lint-pause-silence.py parses THIS array and verifies each sits in a silence dip (never mid-word).
// (CH6 point = 592.24, NOT the docs' rounded 592.4: the real silence dip between
// "…is for." and "All right" — lint-pause-silence caught 592.42 landing ON "All".)
// (CH2 point = 76.655, NOT 76.8: the real trough between "…prove it." and "Now," —
// the 76.8 insert cut the word "Now" in half, Mike draft-v2 QA. Upgraded lint now
// checks CONTAINMENT at the cut itself, not dip-proximity.)
const INSERTS = [{ at: 76.655, dur: 1.0 }, { at: 362.42, dur: 1.0 }, { at: 592.24, dur: 1.0 }];
const CARD_T = INSERTS.map((i) => i.at); // CH2 · CH4 · CH6 (music-bed changes)
const PAUSE_ACTIVE = true; // spine/ALL.e.paused.mp4 baked 2026-07-19 + staged as spine.mp4
export const sh = (t: number) => (PAUSE_ACTIVE ? t + PAUSE * CARD_T.filter((c) => c <= t).length : t);
const cardStart = (b: number) => b + PAUSE * CARD_T.filter((c) => c < b).length;
export const F = (t: number) => Math.round(sh(t) * FPS);
export const TRV_DURATION = Math.round((SPINE_SECS + (PAUSE_ACTIVE ? CARD_T.length * PAUSE : 0)) * FPS);

const fill = { width: '100%', height: '100%', objectFit: 'cover' } as const;
const fillTop = { width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' } as const;

// BEGIN GENERATED COVERS — node scratchpad/gen-covers2.js (do NOT hand-edit this block)
// Canonical comp-build §4 shape; times are SOURCE secs on ALL.d.desilenced (route via sh()/F()).
type Cover = { tIn: number; tOut: number; kind: 'chart' | 'still' | 'stillglitch' | 'vid' | 'deck' | 'receipt'; ref: string; state?: string; lead?: boolean };
const COVERS: Cover[] = [
  { tIn: 13.17, tOut: 17, kind: 'vid', ref: 'BR-1' },
  { tIn: 17, tOut: 20.3, kind: 'stillglitch', ref: 'IMG-1' },
  { tIn: 20.3, tOut: 24.2, kind: 'vid', ref: 'BR-2' },
  { tIn: 24.2, tOut: 41.5, kind: 'deck', ref: 'lineup-board', state: 'lineup-board' },
  { tIn: 41.5, tOut: 48.7, kind: 'deck', ref: 'contains-both-tease', state: 'contains-both-tease' },
  { tIn: 50.5, tOut: 56.2, kind: 'deck', ref: 'claim-card', state: 'claim-card' },
  { tIn: 56.2, tOut: 76.8, kind: 'deck', ref: 'roadmap', state: 'roadmap' },
  { tIn: 76.8, tOut: 81.8, kind: 'deck', ref: 'not-an-app', state: 'not-an-app' },
  { tIn: 81.8, tOut: 100.84, kind: 'deck', ref: 'C2-A', state: 'C2-A' },
  { tIn: 100.84, tOut: 104.8, kind: 'vid', ref: 'BR-3' },
  { tIn: 104.8, tOut: 114, kind: 'deck', ref: 'tao-money', state: 'tao-money' },
  { tIn: 114, tOut: 123, kind: 'deck', ref: 'C2-B', state: 'C2-B' },
  { tIn: 127.7, tOut: 135.6, kind: 'deck', ref: 'fair-launch-club', state: 'fair-launch-club' },
  { tIn: 135.6, tOut: 143.48, kind: 'deck', ref: 'cap-21m', state: 'cap-21m' },
  { tIn: 143.48, tOut: 169.7, kind: 'chart', ref: 'C1' },
  { tIn: 169.7, tOut: 176.9, kind: 'receipt', ref: 'R1' },
  { tIn: 176.9, tOut: 181.87, kind: 'vid', ref: 'BR-4', lead: true },
  { tIn: 192.6, tOut: 196.4, kind: 'vid', ref: 'BR-16' },
  { tIn: 198.3, tOut: 227.3, kind: 'deck', ref: 'D3-A', state: 'D3-A' },
  { tIn: 227.3, tOut: 240.3, kind: 'deck', ref: 'D3-B1', state: 'D3-B1' },
  { tIn: 240.3, tOut: 247, kind: 'deck', ref: 'D3-B2', state: 'D3-B2' },
  { tIn: 247, tOut: 257, kind: 'deck', ref: 'D3-B3', state: 'D3-B3' },
  { tIn: 257, tOut: 265.34, kind: 'deck', ref: 'D3-B4', state: 'D3-B4' },
  { tIn: 265.34, tOut: 269.3, kind: 'stillglitch', ref: 'IMG-2' },
  { tIn: 269.3, tOut: 294.03, kind: 'deck', ref: 'D3-C', state: 'D3-C' },
  { tIn: 297.83, tOut: 301.5, kind: 'vid', ref: 'BR-5' },
  { tIn: 301.5, tOut: 321.6, kind: 'deck', ref: 'D3-D-before', state: 'D3-D-before' },
  { tIn: 321.6, tOut: 334.94, kind: 'deck', ref: 'D3-D', state: 'D3-D' },
  { tIn: 334.94, tOut: 338.9, kind: 'vid', ref: 'BR-6' },
  { tIn: 338.9, tOut: 344.3, kind: 'deck', ref: 'live-vote', state: 'live-vote' },
  { tIn: 344.3, tOut: 353.63, kind: 'deck', ref: 'add-it-up', state: 'add-it-up' },
  { tIn: 357.97, tOut: 362.42, kind: 'vid', ref: 'BR-7', lead: true },
  { tIn: 362.42, tOut: 371, kind: 'receipt', ref: 'R2' },
  { tIn: 371, tOut: 384.2, kind: 'deck', ref: 'D4-A', state: 'D4-A' },
  { tIn: 384.2, tOut: 392.16, kind: 'receipt', ref: 'R5' },
  { tIn: 392.16, tOut: 396.16, kind: 'vid', ref: 'BR-8' },
  { tIn: 396.16, tOut: 411, kind: 'deck', ref: 'D4-B', state: 'D4-B' },
  { tIn: 411, tOut: 414.7, kind: 'stillglitch', ref: 'IMG-3' },
  { tIn: 414.7, tOut: 420.2, kind: 'deck', ref: 'tenant-card', state: 'tenant-card' },
  { tIn: 420.2, tOut: 432.1, kind: 'deck', ref: 'D4-C', state: 'D4-C' },
  { tIn: 432.1, tOut: 442.7, kind: 'deck', ref: 'one-thing-gpu', state: 'one-thing-gpu' },
  { tIn: 442.7, tOut: 448.6, kind: 'deck', ref: 'subnet-slot', state: 'subnet-slot' },
  { tIn: 448.6, tOut: 456.8, kind: 'receipt', ref: 'R6' },
  { tIn: 463.6, tOut: 467.5, kind: 'vid', ref: 'BR-9' },
  { tIn: 467.5, tOut: 473.8, kind: 'deck', ref: 'lane-map', state: 'lane-map' },
  { tIn: 473.8, tOut: 479, kind: 'receipt', ref: 'R3' },
  { tIn: 479, tOut: 488.4, kind: 'deck', ref: 'D5-A', state: 'D5-A' },
  { tIn: 488.4, tOut: 496.7, kind: 'deck', ref: 'D5-B1', state: 'D5-B1' },
  { tIn: 496.7, tOut: 514.32, kind: 'deck', ref: 'D5-B2', state: 'D5-B2' },
  { tIn: 514.32, tOut: 517.9, kind: 'stillglitch', ref: 'IMG-4' },
  { tIn: 517.9, tOut: 525.5, kind: 'deck', ref: 'agentic-currency', state: 'agentic-currency' },
  { tIn: 525.5, tOut: 533.6, kind: 'deck', ref: 'acp-intro', state: 'acp-intro' },
  { tIn: 533.6, tOut: 543.5, kind: 'deck', ref: 'D5-C', state: 'D5-C' },
  { tIn: 543.5, tOut: 559.4, kind: 'deck', ref: 'acp-v2-stat', state: 'acp-v2-stat' },
  { tIn: 559.4, tOut: 563.3, kind: 'vid', ref: 'BR-10' },
  { tIn: 563.3, tOut: 575.03, kind: 'deck', ref: 'one-lane-operator', state: 'one-lane-operator' },
  { tIn: 580.07, tOut: 592.24, kind: 'deck', ref: 'agent-subnet', state: 'agent-subnet' },
  { tIn: 592.24, tOut: 600.8, kind: 'deck', ref: 'D6-A', state: 'D6-A' },
  { tIn: 600.8, tOut: 606, kind: 'receipt', ref: 'R4' },
  { tIn: 606, tOut: 616.1, kind: 'deck', ref: 'D6-A-chain', state: 'D6-A-chain' },
  { tIn: 616.1, tOut: 635.4, kind: 'deck', ref: 'D6-A-token', state: 'D6-A-token' },
  { tIn: 635.4, tOut: 654.37, kind: 'deck', ref: 'D6-B', state: 'D6-B' },
  { tIn: 657.6, tOut: 665.7, kind: 'deck', ref: 'pillar1-verdict', state: 'pillar1-verdict' },
  { tIn: 665.7, tOut: 671.9, kind: 'deck', ref: 'pillar2-intro', state: 'pillar2-intro' },
  { tIn: 671.9, tOut: 678.3, kind: 'deck', ref: 'three-questions', state: 'three-questions' },
  { tIn: 678.3, tOut: 685.3, kind: 'deck', ref: 'permissionless-doors', state: 'permissionless-doors' },
  { tIn: 685.3, tOut: 692.5, kind: 'deck', ref: 'fair-launch-checklist', state: 'fair-launch-checklist' },
  { tIn: 692.5, tOut: 704.6, kind: 'deck', ref: 'D6-C', state: 'D6-C' },
  { tIn: 704.6, tOut: 716.6, kind: 'receipt', ref: 'R7' },
  { tIn: 716.6, tOut: 730.13, kind: 'deck', ref: 'flip-side', state: 'flip-side' },
  { tIn: 734.33, tOut: 745.84, kind: 'deck', ref: 'axis-card', state: 'axis-card' },
  { tIn: 745.84, tOut: 749.5, kind: 'stillglitch', ref: 'IMG-5' },
  { tIn: 749.5, tOut: 780.8, kind: 'chart', ref: 'C2' },
  { tIn: 780.8, tOut: 793.9, kind: 'deck', ref: 'shape-takeaway', state: 'shape-takeaway' },
  { tIn: 793.9, tOut: 799.4, kind: 'deck', ref: 'breadth-compounds', state: 'breadth-compounds' },
  { tIn: 799.4, tOut: 813.03, kind: 'deck', ref: 'verdict-scorecard', state: 'verdict-scorecard' },
  { tIn: 815.73, tOut: 819.08, kind: 'vid', ref: 'BR-11' },
  { tIn: 819.08, tOut: 822.6, kind: 'vid', ref: 'BR-12' },
  { tIn: 822.6, tOut: 825.6, kind: 'stillglitch', ref: 'IMG-6' },
  { tIn: 825.6, tOut: 828.8, kind: 'vid', ref: 'BR-13' },
  { tIn: 828.8, tOut: 833.8, kind: 'vid', ref: 'BR-14', lead: true },
  { tIn: 833.8, tOut: 837.8, kind: 'stillglitch', ref: 'IMG-7' },
  { tIn: 837.8, tOut: 848.4, kind: 'deck', ref: 'which-lane', state: 'which-lane' },
  { tIn: 848.4, tOut: 858.57, kind: 'deck', ref: 'D7-A', state: 'D7-A' },
  { tIn: 862.07, tOut: 869.73, kind: 'deck', ref: 'setup-checklist', state: 'setup-checklist' },
  { tIn: 869.73, tOut: 873.73, kind: 'vid', ref: 'BR-15' },
  { tIn: 891.2, tOut: 895.2, kind: 'still', ref: 'IMG-8' },
  { tIn: 895.2, tOut: 897.8, kind: 'still', ref: 'IMG-9' },
];
const FILES: Record<string, string> = {"BR-1":"vid/BR-1.mp4","IMG-1":"img/IMG-1.png","BR-2":"vid/BR-2.mp4","lineup-board":"deck/lineup-board.png","contains-both-tease":"deck/contains-both-tease.png","claim-card":"deck/claim-card.png","roadmap":"deck/roadmap.png","not-an-app":"deck/not-an-app.png","C2-A":"deck/C2-A.png","BR-3":"vid/BR-3.mp4","tao-money":"deck/tao-money.png","C2-B":"deck/C2-B.png","fair-launch-club":"deck/fair-launch-club.png","cap-21m":"deck/cap-21m.png","R1":"receipts/R1.png","BR-4":"vid/BR-4.mp4","BR-16":"vid/BR-16.mp4","D3-A":"deck/D3-A.png","D3-B1":"deck/D3-B1.png","D3-B2":"deck/D3-B2.png","D3-B3":"deck/D3-B3.png","D3-B4":"deck/D3-B4.png","IMG-2":"img/IMG-2.png","D3-C":"deck/D3-C.png","BR-5":"vid/BR-5.mp4","D3-D-before":"deck/D3-D-before.png","D3-D":"deck/D3-D.png","BR-6":"vid/BR-6.mov","live-vote":"deck/live-vote.png","add-it-up":"deck/add-it-up.png","BR-7":"vid/BR-7.mp4","R2":"receipts/R2.png","D4-A":"deck/D4-A.png","R5":"receipts/R5.png","BR-8":"vid/BR-8.mp4","D4-B":"deck/D4-B.png","IMG-3":"img/IMG-3.png","tenant-card":"deck/tenant-card.png","D4-C":"deck/D4-C.png","one-thing-gpu":"deck/one-thing-gpu.png","subnet-slot":"deck/subnet-slot.png","R6":"receipts/R6.png","BR-9":"vid/BR-9.mov","lane-map":"deck/lane-map.png","R3":"receipts/R3.png","D5-A":"deck/D5-A.png","D5-B1":"deck/D5-B1.png","D5-B2":"deck/D5-B2.png","IMG-4":"img/IMG-4.png","agentic-currency":"deck/agentic-currency.png","acp-intro":"deck/acp-intro.png","D5-C":"deck/D5-C.png","acp-v2-stat":"deck/acp-v2-stat.png","BR-10":"vid/BR-10.mp4","one-lane-operator":"deck/one-lane-operator.png","agent-subnet":"deck/agent-subnet.png","D6-A":"deck/D6-A.png","R4":"receipts/R4.png","D6-A-chain":"deck/D6-A-chain.png","D6-A-token":"deck/D6-A-token.png","D6-B":"deck/D6-B.png","pillar1-verdict":"deck/pillar1-verdict.png","pillar2-intro":"deck/pillar2-intro.png","three-questions":"deck/three-questions.png","permissionless-doors":"deck/permissionless-doors.png","fair-launch-checklist":"deck/fair-launch-checklist.png","D6-C":"deck/D6-C.png","R7":"receipts/R7.png","flip-side":"deck/flip-side.png","axis-card":"deck/axis-card.png","IMG-5":"img/IMG-5.png","shape-takeaway":"deck/shape-takeaway.png","breadth-compounds":"deck/breadth-compounds.png","verdict-scorecard":"deck/verdict-scorecard.png","BR-11":"vid/BR-11.mp4","BR-12":"vid/BR-12.mp4","IMG-6":"img/IMG-6.png","BR-13":"vid/BR-13.mp4","BR-14":"vid/BR-14.mp4","IMG-7":"img/IMG-7.png","which-lane":"deck/which-lane.png","D7-A":"deck/D7-A.png","setup-checklist":"deck/setup-checklist.png","BR-15":"vid/BR-15.mp4","IMG-8":"img/IMG-8.png","IMG-9":"img/IMG-9.png"};
const FACE_WINDOWS: Array<[number, number]> = [[0,13.17],[48.7,50.5],[123,127.7],[181.87,192.6],[196.4,198.3],[294.03,297.83],[353.63,357.97],[456.8,463.6],[575.03,580.07],[654.37,657.6],[730.13,734.33],[813.03,815.73],[858.57,862.07],[873.73,891.2],[897.8,911.4333]];
// END GENERATED COVERS

const coverEndingAt = (t: number) => COVERS.find((c) => Math.abs(c.tOut - t) < 0.05);
const coverStartingAt = (t: number) => COVERS.find((c) => Math.abs(c.tIn - t) < 0.05);

// ---- FACE jump-cut treatment (Mike, 2026-07-18) — desilencer joins on-camera ----
const JUMP_F = FACE_JUMPS.map(F);
const ZOOM_PEAK = 1.06, ZOOM_IN = 2, ZOOM_OUT = 16;

// ---- Intra-face PUNCH-INS (~18%, TRANSITIONS §3). Placement: snapped to a real
// inter-word gap where one exists (hard 2f), else a smooth 10f push at ~40% of the
// hold (no gap in the desilenced words => a hard cut there would land mid-word).
const PUNCHES: Array<{ t: number; end: number; ramp: number }> = [
  { t: 124.88, end: 127.7, ramp: 10 },
  { t: 186.75, end: 192.6, ramp: 2 }, // re-snapped: BR-16 covers 192.6-196.4 (Mike QA), gap at 186.4-187.1
  { t: 295.55, end: 297.83, ramp: 10 },
  { t: 355.37, end: 357.97, ramp: 10 },
  { t: 457.1, end: 463.6, ramp: 2 },
  { t: 577.05, end: 580.07, ramp: 10 },
  { t: 655.66, end: 657.6, ramp: 10 },
  { t: 731.81, end: 734.33, ramp: 10 },
  { t: 859.97, end: 862.07, ramp: 10 },
];
const PUNCH_SCALE = 1.18;

const spineScale = (f: number): number => {
  let jump = 1;
  for (const jf of JUMP_F) {
    if (f >= jf - ZOOM_IN && f <= jf + ZOOM_OUT) {
      const v = interpolate(f, [jf - ZOOM_IN, jf, jf + ZOOM_OUT], [1, ZOOM_PEAK, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
      if (v > jump) jump = v;
    }
  }
  let punch = 1;
  for (const p of PUNCHES) {
    const a = F(p.t), b = F(p.end);
    if (f >= a && f <= b) punch = Math.max(punch, interpolate(f, [a, a + p.ramp], [1, PUNCH_SCALE], { extrapolateRight: 'clamp' }));
  }
  return jump * punch;
};
// Jump-cut GLITCH = the LIBRARY's same-scene accent (deviation-shift, demoSameScene —
// built for punch-ins/jump cuts of one scene). Replaced the hand-rolled GlitchTear
// (Mike, 2026-07-19 draft QA: "doesn't look like any of our glitch transitions —
// use the glitch and deviation transitions from our library").

// ---- LIGHT LEAKS (overlays.md): >5s face holds, centered pulse min(len-2,4)s,
// screen-blend warmth ~0.3, renders UNDER covers. This video: the subscribe
// ad-lib + the CTA (leak shifted to the CTA's cover-free first stretch so the
// IMG-8/9 inserts don't mask it). The 13s CH1 opener deliberately gets NO leak:
// the jump-cut motif owns it, and a leak would collide with the 6.88/11.36 hits
// (overlay-never-on-a-transition-frame rule).
const LEAKS: Array<[number, number]> = [[188.09, 192.09], [880.4, 884.4]];
const LightLeak: React.FC<{ a: number; b: number }> = ({ a, b }) => {
  const f = useCurrentFrame();
  const fa = F(a), fb = F(b);
  if (f < fa || f > fb) return null;
  const p = (f - fa) / (fb - fa);
  const env = interpolate(p, [0, 0.25, 0.75, 1], [0, 0.3, 0.3, 0], { easing: Easing.inOut(Easing.ease) });
  const drift = interpolate(p, [0, 1], [-140, 140]);
  return (
    <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: env, pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', width: 1400, height: 1400, borderRadius: '50%', left: 1100 + drift, top: -420, background: 'radial-gradient(circle, rgba(255,150,40,0.9) 0%, rgba(255,80,20,0.35) 40%, transparent 70%)', filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', width: 900, height: 900, borderRadius: '50%', left: -260 - drift * 0.6, bottom: -380, background: 'radial-gradient(circle, rgba(255,190,90,0.7) 0%, transparent 65%)', filter: 'blur(80px)' }} />
    </AbsoluteFill>
  );
};

// ---- CTA badges (comp overlay — the coin stills carry NO baked number).
// Multipliers are the AS-SPOKEN track-record claims (VO 890.5s "350X … lab",
// 895.7s "58X on velvet") — the overlay must match the tape exactly.
const CTA_BADGE: Record<string, { mult: string; label: string }> = {
  'IMG-8': { mult: '350x', label: 'LAB TOKEN' },
  'IMG-9': { mult: '58x', label: 'VELVET' },
};
const CtaBadge: React.FC<{ mult: string; label: string }> = ({ mult, label }) => {
  const f = useCurrentFrame();
  const pop = interpolate(f, [6, 12, 16], [0, 1.12, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{ position: 'absolute', bottom: 90, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `scale(${pop})`, opacity: Math.min(1, pop) }}>
      <div style={{ background: 'rgba(6,8,12,0.82)', border: '1px solid rgba(255,215,0,0.45)', borderRadius: 20, padding: '26px 54px', textAlign: 'center' }}>
        <div style={{ fontFamily: FONTS.MONO, fontWeight: 700, fontSize: 110, lineHeight: 1, color: '#ffd700' }}>{mult}</div>
        <div style={{ fontFamily: FONTS.DMSANS, fontWeight: 600, fontSize: 26, letterSpacing: '.22em', color: '#e8eaf0', marginTop: 10 }}>{label}</div>
      </div>
    </div>
  );
};

const ReceiptPending: React.FC<{ ref_: string }> = ({ ref_ }) => (
  <AbsoluteFill style={{ background: '#0a0c10', justifyContent: 'center', alignItems: 'center' }}>
    <div style={{ fontFamily: FONTS.MONO, color: '#ffd700', fontSize: 40, letterSpacing: 2 }}>{ref_} · RECEIPT</div>
    <div style={{ fontFamily: FONTS.MONO, color: '#8892a4', fontSize: 24, marginTop: 14 }}>real-site screenshot · capture pending</div>
  </AbsoluteFill>
);

// ---- Cover CONTENT (no ingress anim — used both by the plain layer and inside FX engines)
const CoverContent: React.FC<{ c: Cover }> = ({ c }) => {
  switch (c.kind) {
    case 'chart': {
      // LIVE components (§7) — explicit per-ref routes (lint-animated-charts checks these)
      if (c.ref === 'C1') return <ChartC1Emission />;
      if (c.ref === 'C2') return <ChartC2MetcalfeReed />;
      return null;
    }
    case 'vid':
      return <OffthreadVideo src={staticFile(FILES[c.ref])} muted style={fill} />;
    case 'still':
    case 'stillglitch': {
      const badge = CTA_BADGE[c.ref];
      return (
        <AbsoluteFill>
          <Img src={staticFile(FILES[c.ref])} style={fill} />
          {badge && <CtaBadge mult={badge.mult} label={badge.label} />}
        </AbsoluteFill>
      );
    }
    case 'deck':
      return <Img src={staticFile(FILES[c.ref])} style={fill} />;
    case 'receipt':
      return FILES[c.ref] ? <Img src={staticFile(FILES[c.ref])} style={fillTop} /> : <ReceiptPending ref_={c.ref} />;
    default:
      return null;
  }
};

// Ingress treatment for the PLAIN cover layer. Marquee-incoming refs + glitched
// stills get NO ingress anim here — their FX window owns the cut.
const MARQUEE_IN = new Set(['D3-D', 'D4-A', 'D5-A', 'D6-A', 'D6-B', 'C2']);
const CoverEl: React.FC<{ c: Cover }> = ({ c }) => {
  const f = useCurrentFrame();
  if (c.kind === 'stillglitch' || MARQUEE_IN.has(c.ref)) return <CoverContent c={c} />;
  const isVid = c.kind === 'vid';
  const fadeF = isVid ? 14 : 10;
  const op = interpolate(f, [0, fadeF], [0, 1], { extrapolateRight: 'clamp' });
  const sc = isVid || c.kind === 'receipt' || c.kind === 'still' ? 1 : interpolate(f, [0, fadeF], [0.93, 1], { extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ opacity: op, transform: `scale(${sc})` }}><CoverContent c={c} /></AbsoluteFill>;
};

// ---- Chapter title cards (rmn:cube — the per-video pick; ON at the 3 bed changes)
const CARDS: Array<{ b: number; eyebrow: string; title: string; out: boolean }> = [
  // b derives from CARD_T — NEVER a literal (a stale 592.42 here vs the dip-snapped 592.24
  // pause placed the CH6 card a second late OVER the D6-A board = Mike's 9:56 double-card).
  { b: CARD_T[0], eyebrow: 'CHAPTER 2', title: 'WHAT IS BITTENSOR?', out: true },
  { b: CARD_T[1], eyebrow: 'CHAPTER 4', title: 'THE CHALLENGERS', out: true },
  { b: CARD_T[2], eyebrow: 'CHAPTER 6', title: 'TOE TO TOE', out: false }, // exit = the §4 spin-up (suppress cube out-rotation)
];
const CARD_IN = 8, CARD_OUT = 10, CARD_HOLD = Math.round(PAUSE * FPS);
const CubeFace: React.FC<{ eyebrow: string; title: string; ry: number }> = ({ eyebrow, title, ry }) => (
  <AbsoluteFill style={{ perspective: 1200 }}>
    <AbsoluteFill style={{ transform: `rotateY(${ry}deg)`, backfaceVisibility: 'hidden', background: '#0a0c10', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', background: '#00e68a', filter: 'blur(130px)', opacity: 0.12, top: -180, right: -120 }} />
      <div style={{ fontFamily: FONTS.DMSANS, fontSize: 26, fontWeight: 600, letterSpacing: '.3em', color: '#505a6e', marginBottom: 26 }}>{eyebrow}</div>
      <div style={{ fontFamily: FONTS.PLAYFAIR, fontWeight: 900, fontSize: 128, color: '#e8eaf0', letterSpacing: '-.01em', textAlign: 'center' }}>{title}</div>
      <div style={{ width: 90, height: 4, borderRadius: 2, background: 'linear-gradient(90deg,#00e68a,#00c2ff)', marginTop: 34 }} />
    </AbsoluteFill>
  </AbsoluteFill>
);
const CubeCardScene: React.FC<{ card: (typeof CARDS)[number] }> = ({ card }) => {
  const f = useCurrentFrame(); // local: 0 = CARD_IN frames before the pause starts
  const ry = f < CARD_IN
    ? interpolate(f, [0, CARD_IN], [90, 0], { easing: Easing.out(Easing.cubic) })
    : card.out && f > CARD_IN + CARD_HOLD
      ? interpolate(f, [CARD_IN + CARD_HOLD, CARD_IN + CARD_HOLD + CARD_OUT], [0, -90], { easing: Easing.in(Easing.cubic), extrapolateRight: 'clamp' })
      : 0;
  return <CubeFace eyebrow={card.eyebrow} title={card.title} ry={ry} />;
};

// ---- FX — a library-engine window overlaying a cut (marquees §4, face cut-ins §3,
// still glitches §2). The engine layer is opaque full-frame for its whole window,
// hiding the plain layers' hard cut beneath it. Spine stays untouched underneath
// (audio + sync); every engine runs sfx={false} (SFX post-mixed, comp-build §9).
type FxSpec = { id: string; t: number; out?: 'card2' | 'spine'; inn?: 'spine' };
// Clip builders return content TIME-ALIGNED to the FX window (local frame 0 = winStart).
// Static kinds (deck/still/receipt) need no alignment; vids align via startFrom; charts
// (frame-driven) via a positive-from Sequence (charts only ever come IN through an FX).
const clipForCover = (c: Cover, winStart: number, win: number) => () => {
  if (c.kind === 'vid') {
    return <OffthreadVideo src={staticFile(FILES[c.ref])} muted startFrom={Math.max(0, winStart - F(c.tIn))} style={fill} />;
  }
  if (c.kind === 'chart') {
    return (
      <Sequence from={Math.max(0, F(c.tIn) - winStart)} durationInFrames={F(c.tOut) - F(c.tIn) + win} layout="none">
        <AbsoluteFill><CoverContent c={c} /></AbsoluteFill>
      </Sequence>
    );
  }
  return <AbsoluteFill><CoverContent c={c} /></AbsoluteFill>;
};
const spineClip = (winStart: number) => () => <OffthreadVideo src={staticFile('spine.mp4')} muted startFrom={winStart} style={fill} />;
const Fx: React.FC<FxSpec> = ({ id, t, out, inn }) => {
  const row = getTransition(id);
  if (!row) return <AbsoluteFill style={{ background: 'crimson', color: '#fff', fontSize: 40, justifyContent: 'center', alignItems: 'center' }}>unknown transition id: {id}</AbsoluteFill>;
  const win = framesForRow(row, FPS);
  // Align the window so the engine's INTERNAL swap point lands exactly on the cut
  // (blocks swaps at opacityPeak, badsignal at swapAt, melt/spin at cut — NOT at
  // window-center; centering left the incoming-spine side showing pre-cut black).
  const p = row.params as Record<string, unknown>;
  const swapPoint = (p.opacityPeak ?? p.swapAt ?? p.cut ?? 0.5) as number;
  const winStart = F(t) - Math.round(win * swapPoint);
  const cOut = coverEndingAt(t), cIn = coverStartingAt(t);
  const outFn = out === 'card2'
    ? () => <CubeFace eyebrow={CARDS[2].eyebrow} title={CARDS[2].title} ry={0} />
    : out === 'spine' || !cOut ? spineClip(winStart) : clipForCover(cOut, winStart, win);
  const inFn = inn === 'spine' || !cIn ? spineClip(winStart) : clipForCover(cIn, winStart, win);
  // Bitmap srcs for the FOOTAGE engines (blocks/badsignal displace a raw bitmap via CSS
  // background/mask — no live-clip path). Static covers use their own PNG; video covers use
  // an extracted tail-poster (vid/_poster-<ref>.png); spine/chart/card sides have none
  // (the engine's node-based base still renders — the displaced copies just skip that side).
  const srcFor = (c?: Cover): string | undefined => {
    if (!c) return undefined;
    if (c.kind === 'vid') return `vid/_poster-${c.ref}.png`;
    if (c.kind === 'chart') return undefined;
    return FILES[c.ref];
  };
  const Engine = ENGINES[row.engine] as React.FC<any>;
  return (
    <Sequence from={winStart} durationInFrames={win} name={`fx:${id}@${t}`}>
      <Engine from={outFn()} to={inFn()} outClip={outFn} inClip={inFn}
        fromSrc={out === 'card2' || out === 'spine' ? undefined : srcFor(cOut)}
        toSrc={inn === 'spine' ? `img/_face-${t}.png` : srcFor(cIn)}
        durationInFrames={win} params={row.params} sfx={false} />
    </Sequence>
  );
};

// The 6 reserved MELT/SPIN marquees (TRANSITIONS.md §4 — one melt look, one spin look).
const MARQUEES: FxSpec[] = [
  { id: 'melt-rgb-short-1', t: 321.6 },                       // D3-D before → after (TRANSFORM)
  { id: 'spin-3d-side-ease-right', t: 371.0 },                // D4-A in (NEW FACET, challenger 1)
  { id: 'spin-3d-side-ease-left', t: 479.0 },                 // D5-A in (NEW FACET, challenger 2 mirrored)
  { id: 'spin-3d-side-ease-up', t: 592.24, out: PAUSE_ACTIVE ? 'card2' : undefined }, // CH6 card exit → D6-A board (dip-snapped)
  { id: 'melt-rgb-1', t: 635.4 },                             // ★ HERO: D6-A board reforms into D6-B superset
  { id: 'melt-rgb-1', t: 749.5 },                             // C2 ingress (network reformed into its value view)
];
// 12 FACE cut-ins (blocks-max — the per-video face pick), at each black→face edge.
const FACE_CUTIN_T = [48.7, 123.0, 181.87, 294.03, 353.63, 456.8, 575.03, 654.37, 730.13, 813.03, 858.57, 873.73];
const FACE_CUTINS: FxSpec[] = FACE_CUTIN_T.map((t, i) => ({ id: `blocks-max-${(i % 3) + 1}`, t, inn: 'spine' }));
// ChatGPT still ingress → Bad Signal (TRANSITIONS §2; rotate the short variants).
const STILL_GLITCHES: FxSpec[] = COVERS.filter((c) => c.kind === 'stillglitch').map((c, i) => ({ id: `badsignal-short-${(i % 3) + 1}`, t: c.tIn }));
// Desilencer jump-cuts on-camera → library same-scene deviation accent (spine both sides).
const JUMP_FX: FxSpec[] = FACE_JUMPS.map((t) => ({ id: 'deviation-shift-4x', t, out: 'spine', inn: 'spine' }));

// ---- CAPTIONS (comp-build §8 — ON by default for every longform; captions-builder output,
// Montserrat house style). CAPTION_SRC = the 15 FACE windows (SOURCE secs) — lint-covers
// enforces captions-never-over-a-cover against this array.
const { fontFamily: MONTSERRAT } = loadMontserrat();
const CAPTION_SRC: Array<[number, number]> = [
  [0, 13.17], [48.7, 50.5], [123, 127.7], [181.87, 192.6], [196.4, 198.3], [294.03, 297.83],
  [353.63, 357.97], [456.8, 463.6], [575.03, 580.07], [654.37, 657.6], [730.13, 734.33],
  [813.03, 815.73], [858.57, 862.07], [873.73, 891.2], [897.8, 911.26],
];
// ONE scoped mishear override the canonical dict cannot safely hold: "tensor" is a real word that
// collides with Opentensor/subtensor in this same video, so the global rule was (rightly) refused
// by the builder — fix the single flagged cue here, declared in code, never by editing the generated file.
const CAPS = TRVCAPTIONS.map((c) => (c.t === 577.16 ? { ...c, h: 'that bittensor' } : c));
const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  if (!CAPTION_SRC.some(([a, b]) => t >= sh(a) && t < sh(b))) return null; // only inside the (shifted) windows
  let cur: { tf: number; h: string } | null = null;
  for (const c of CAPS) { const tf = sh(c.t); if (tf <= t) cur = { tf, h: c.h }; else break; }
  if (!cur) return null;
  const next = CAPS.map((c) => sh(c.t)).find((tf) => tf > cur!.tf) ?? Infinity;
  if (t >= Math.min(next, cur.tf + 1.3)) return null; // hold until next phrase / clear on a gap
  const age = (t - cur.tf) * FPS;
  const pop = interpolate(age, [0, 5, 9], [0.7, 1.12, 1], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 96, pointerEvents: 'none' }}>
      <div style={{
        fontFamily: `${MONTSERRAT},'Arial Black','Segoe UI',sans-serif`, fontWeight: 900, fontSize: 72,
        textTransform: 'lowercase', color: '#fff', WebkitTextStroke: '12px #000', paintOrder: 'stroke fill',
        transform: `scale(${pop})`, textAlign: 'center', maxWidth: 1600,
      }}>{cur.h}</div>
    </AbsoluteFill>
  );
};

export const TaoRenderVirtuals: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = spineScale(frame);
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* 1 · SPINE — continuous, never cut; zoom punch/jump transform (jump glitch = JUMP_FX layer) */}
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        <OffthreadVideo src={staticFile('spine.mp4')} style={fill} />
      </AbsoluteFill>

      {/* 2 · LIGHT LEAKS — under all covers (only ever tints the bare face) */}
      {LEAKS.map(([a, b], i) => <LightLeak key={i} a={a} b={b} />)}

      {/* 3 · COVER layer — one sequenced track, windowed to the transcript (§4) */}
      {COVERS.map((c, i) => (
        <Sequence key={i} from={F(c.tIn)} durationInFrames={Math.max(1, F(c.tOut) - F(c.tIn))} name={`${c.ref} (${c.kind})`}>
          <CoverEl c={c} />
        </Sequence>
      ))}

      {/* 4 · Chapter cards (cube) over the baked 1s pauses */}
      {PAUSE_ACTIVE && CARDS.map((card, i) => {
        const from = Math.round(cardStart(card.b) * FPS) - CARD_IN;
        const dur = CARD_IN + CARD_HOLD + (card.out ? CARD_OUT : 0);
        return (
          <Sequence key={`card${i}`} from={from} durationInFrames={dur} name={`card:${card.title}`}>
            <CubeCardScene card={card} />
          </Sequence>
        );
      })}

      {/* 5 · FX windows — §4 marquees, §3 face cut-ins, §2 still glitches */}
      {MARQUEES.map((m, i) => <Fx key={`mq${i}`} {...m} />)}
      {FACE_CUTINS.map((m, i) => <Fx key={`fc${i}`} {...m} />)}
      {STILL_GLITCHES.map((m, i) => <Fx key={`sg${i}`} {...m} />)}
      {JUMP_FX.map((m, i) => <Fx key={`jf${i}`} {...m} />)}

      {/* 6 · CAPTIONS — TOPMOST content layer (above leaks and every FX; §8) */}
      <Captions />
      {/* (build watermark REMOVED for final — it shipped in FINAL v1's first 2s, Mike caught it) */}
    </AbsoluteFill>
  );
};

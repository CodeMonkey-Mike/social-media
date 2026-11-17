// AIDestroyingLives.tsx: longform-edited "AI destroying lives" (crypto channel), built TO the approved blueprint
// (EDIT-PLAN.md event log, CUE-SHEET.md, TRANSITIONS.md + TRANSITION-PLAN.json, COVER-PLAN.json, AS-RECORDED.md, PROJECT-LOG
// Open flags) by the comp-builder, 2026-11-11, per skills/comp-build/comp-build.md (sections 2, 3, 3a, 3d, 4-8).
// The comp renders VIDEO + the paused spine's own VO only: no music, no SFX, no watermark (section 9; the post-mix owns audio).
// Every cue below is a SOURCE-spine second (spine/ALL.e.cut.enhanced.mp4, 475.30 s) routed through sh() / F().
import React, { createContext, useContext } from 'react';
import { AbsoluteFill, Freeze, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { TransitionClip } from './transitions/TransitionClip';
import { ENGINES, getTransition } from './transitions/registry';
import { CAPTION_WINDOWS, ZCAPTIONS } from './AIDestroyingLivesCaptions';
import { ChartStage } from './AIDestroyingLivesCharts';
import { ClipPlay, FilmBurn, FrozenVideo, PromoCard, ReceiptStage, WarpIn, fill, receiptView } from './AIDestroyingLivesKit';
import type { Promo, Receipt } from './AIDestroyingLivesKit';

loadMontserrat('normal', { weights: ['900'], subsets: ['latin'] });

// =====================================================================================================================
// 1. THE TIME MAP: spine/ALL.f.paused.json pauses[] (every row a spliced clip, no title card ON this video).
//    sh(t) = t + the sum of every pause's own dur with at <= t (comp-build.md section 3d).
export const FPS = 30;
export const PAUSE = 1.5;          // the sidecar's pause_s (no card fires: one song, every chapter card OFF)
export const CARD_T: number[] = []; // no title-card pause rows
export const INSERTS = [
  { at: 0.16, dur: 5.3 },
  { at: 0.16, dur: 6.5 },
  { at: 0.16, dur: 4.0 },
  { at: 0.16, dur: 8.7 },
  { at: 0.16, dur: 6.6 },
  { at: 0.16, dur: 5.1 },
  { at: 0.16, dur: 4.4 },
  { at: 0.16, dur: 8.4 },
  { at: 0.16, dur: 9.8 },
  { at: 0.16, dur: 5.9 },
  { at: 0.16, dur: 3.2 },
  { at: 128.715, dur: 7.6 },
  { at: 369.59, dur: 5.7 },
  { at: 403.515, dur: 5.7 },
  { at: 403.515, dur: 8.4 },
  { at: 403.515, dur: 9.7 },
  { at: 416.94, dur: 23.6 },
];
// the clip each pause row carries, in the sidecar's order (its `label`); file = assets/clip-inserts/<file>.mp4
const PAUSE_CLIP = ['CLIP-29', 'CLIP-3', 'CLIP-12', 'CLIP-20', 'CLIP-2', 'CLIP-27', 'CLIP-9', 'CLIP-24', 'CLIP-30', 'CLIP-6', 'CLIP-16',
  'CLIP-21', 'CLIP-61', 'CLIP-42', 'CLIP-40', 'CLIP-51', 'CLIP-44'];
const CLIP_FILE: Record<string, string> = {
  'CLIP-29': 'CLIP-29-creative-director', 'CLIP-3': 'CLIP-3-laid-off-year', 'CLIP-12': 'CLIP-12-graduate', 'CLIP-20': 'CLIP-20-translator',
  'CLIP-2': 'CLIP-2-8000-jobs', 'CLIP-27': 'CLIP-27-five-months', 'CLIP-9': 'CLIP-9-marketing-lead', 'CLIP-24': 'CLIP-24-freelance-writer',
  'CLIP-30': 'CLIP-30-customer-success', 'CLIP-6': 'CLIP-6-humiliation', 'CLIP-16': 'CLIP-16-recruiter-car', 'CLIP-21': 'CLIP-21-translator-less-work',
  'CLIP-61': 'CLIP-61-musk-g20', 'CLIP-42': 'CLIP-42-tradeswoman', 'CLIP-40': 'CLIP-40-car-apprentice', 'CLIP-51': 'CLIP-51-shipbuilder',
  'CLIP-44': 'CLIP-44-construction-trainee',
};
// frames in each captured file (ffprobe; 30 fps, 1920x1080); a file one frame short of its pause holds its last frame
const CLIP_FRAMES: Record<string, number> = {
  'CLIP-29': 159, 'CLIP-3': 194, 'CLIP-12': 120, 'CLIP-20': 261, 'CLIP-2': 197, 'CLIP-27': 153, 'CLIP-9': 131, 'CLIP-24': 252, 'CLIP-30': 294,
  'CLIP-6': 176, 'CLIP-16': 96, 'CLIP-21': 228, 'CLIP-61': 171, 'CLIP-42': 171, 'CLIP-40': 252, 'CLIP-51': 291, 'CLIP-44': 707,
};
const clipSrc = (id: string) => `clip-inserts/${CLIP_FILE[id]}.mp4`;

export const SPINE_SECS = 475.3;   // the SOURCE spine (sidecar `source`, spine/ALL.e.cut.enhanced.mp4)
const SPINE_FRAMES = 18118;        // assets/spine.mp4 = spine/ALL.f.paused.mp4 (ffprobe: 18118 frames, 603.933 s)
const HOLD_UNTIL = 478.27;         // MUSIC-PLAN end_card_hold.hold_until_sec: the end card holds 3.0 s past "this." (Mike, plan gate)
export const DUR = SPINE_FRAMES + Math.round((HOLD_UNTIL - SPINE_SECS) * FPS);

const sumDur = (pred: (at: number) => boolean) => INSERTS.filter((p) => pred(p.at)).reduce((a, p) => a + p.dur, 0);
const sh = (t: number) => t + sumDur((at) => at <= t + 1e-6);   // a cue AT a splice lands after the clip
const shB = (t: number) => t + sumDur((at) => at < t - 1e-6);   // an END time at a splice lands before the clip
const F = (t: number) => Math.round(sh(t) * FPS);
const FB = (t: number) => Math.round(shB(t) * FPS);
// each pause's window on the paused spine, in frames (frame-exact, the baker's own placement)
const PAUSE_WIN = INSERTS.map((p, i) => {
  const before = INSERTS.slice(0, i).reduce((a, q) => a + q.dur, 0);
  const s = Math.round((p.at + before) * FPS);
  return { at: p.at, clip: PAUSE_CLIP[i], s, e: s + Math.round(p.dur * FPS) };
});
// paused-spine seconds -> source seconds (held at the splice point inside a pause)
const unsh = (sec: number) => {
  let cum = 0;
  for (const w of PAUSE_WIN) {
    if (sec < w.s / FPS) return sec - cum;
    if (sec < w.e / FPS) return w.at;
    cum += (w.e - w.s) / FPS;
  }
  return sec - cum;
};

// ONE absolute clock for every node (section 6a): the composition frame, published at the root
const AbsCtx = createContext(0);
const useAbs = () => useContext(AbsCtx);

// =====================================================================================================================
// 2. THE SPINE + FACE REFRAME (section 3a, assets/face-reframe.json, measured, never hand-tuned) + the one punch-in
export const FACE_REFRAME = { scale: 1.334, x: -534, y: -265 };
const FACE_POINT = { x: 960, y: 432 };          // face-reframe.json face_point_out: punch-ins scale about it
// FACE windows (AS-RECORDED.md / COVER-PLAN face_windows), source seconds
const FACES: [number, number][] = [[0.0, 6.489], [72.255, 75.022], [139.555, 144.122], [259.922, 265.155], [369.625, 375.325], [435.092, 438.025], [450.725, 454.659]];
// [PUNCH-IN] F7: the video's ONLY punch point, the desilencer join 453.933 (spine/jumpcuts-final.json), a hard 18% step, held
// to the F7 cut-out; F1-F6 carry no interior join, so no punch (overlays.md section 1)
const PUNCHES = [{ at: 453.933, s: 1.18, until: 454.659 }];
const punchAt = (abs: number) => {
  for (const p of PUNCHES) if (abs >= F(p.at) && abs < FB(p.until) + 12) return p.s;
  return 1;
};
const spineStyle: React.CSSProperties = {
  position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, objectFit: 'fill', transformOrigin: '0 0',
  transform: `translate(${FACE_REFRAME.x}px, ${FACE_REFRAME.y}px) scale(${FACE_REFRAME.scale})`,
};
// the spine as it AIRS at composition frame `frame`: same source, same reframe, same punch. `still` = a faithful freeze
// (section 6a: a real <Freeze> in a zero-offset Sequence, muted, same transform, same source; no bg-swap clip this video)
const SpineView: React.FC<{ frame: number; still: boolean }> = ({ frame, still }) => (
  <AbsoluteFill style={{ overflow: 'hidden', background: '#000', transformOrigin: `${FACE_POINT.x}px ${FACE_POINT.y}px`, transform: `scale(${punchAt(frame)})` }}>
    {still ? (
      <Sequence from={0} layout="none">
        <Freeze frame={frame}>
          <OffthreadVideo src={staticFile('spine.mp4')} muted style={spineStyle} />
        </Freeze>
      </Sequence>
    ) : (
      <OffthreadVideo src={staticFile('spine.mp4')} style={spineStyle} />
    )}
  </AbsoluteFill>
);

// =====================================================================================================================
// 3. THE COVER TRACK (section 4), row for row from EDIT-PLAN.md; ingress `tr` = the TRANSITION-PLAN id of the scene change
//    INTO the row (`td` its seconds); consecutive same-ref rows are STATE SWAPS (no ingress; `xf` = a deliberate state
//    cross-fade); `pre` / tails are derived below. kinds: chart (REAL animated, routed to a component), container (card-slide
//    state PNGs, one spotlight state at a time), deck (a system-design diagram shown ONCE, its states cued inside), receipt
//    (measured frame + treatment), vid (Envato b-roll, muted, frame-for-frame), still (ChatGPT image, slow push), promo (the
//    elegant-promo C19 cards), clipstill (a clip insert's first / last frame held as the lead-in / lead-out still).
// DIAGRAM_REFS: C11, C23
// (end declared refs)
type Cover = {
  tIn: number; tOut: number; kind: string; ref: string; tr?: string; td?: number; state?: string; mo?: string; xf?: number;
  frame?: 'first' | 'last'; out?: number;
};
export const COVERS: Cover[] = [
  // ---- CH1 THE PEOPLE (the 67.9 s montage is the clip-insert layer; F1 0.000-6.489) ----
  { tIn: 6.489, tOut: 13.45, kind: 'chart', ref: 'C10', tr: 'hand:xfade-scale', td: 0.35 },
  { tIn: 13.45, tOut: 17.08, kind: 'vid', ref: 'BR-1-welder-arc-sparks', tr: 'hand:fade', td: 0.5 },
  { tIn: 17.08, tOut: 20.63, kind: 'vid', ref: 'BR-2-tradesman-picks-tools', tr: 'hand:fade', td: 0.5 },
  // ---- CH2 ALREADY LEAVING ----
  { tIn: 20.63, tOut: 26.45, kind: 'container', ref: 'prior-videos-pair', tr: 'hand:xfade-scale', td: 0.35, state: 'base' },
  { tIn: 26.45, tOut: 34.68, kind: 'promo', ref: 'C19-1', tr: 'hand:ep-iris-open', td: 1.0 },
  { tIn: 34.68, tOut: 40.08, kind: 'promo', ref: 'C19-2', tr: 'hand:ep-circle-burst', td: 0.9 },
  { tIn: 40.08, tOut: 46.1, kind: 'promo', ref: 'C19-3', tr: 'hand:ep-circle-burst', td: 0.9 },
  { tIn: 46.1, tOut: 48.65, kind: 'receipt', ref: 'C2', tr: 'hand:xfade-scale', td: 0.35 },
  { tIn: 48.65, tOut: 52.3, kind: 'vid', ref: 'BR-3-laptop-scroll-dark', tr: 'hand:fade', td: 0.5 },
  { tIn: 52.3, tOut: 64.45, kind: 'chart', ref: 'C7', tr: 'hand:xfade-scale', td: 0.35 },
  { tIn: 64.45, tOut: 67.3, kind: 'receipt', ref: 'R-INDEED', tr: 'hand:xfade-scale', td: 0.35 },
  { tIn: 67.3, tOut: 70.4, kind: 'vid', ref: 'BR-4-graduate-from-behind', tr: 'hand:fade', td: 0.5 },
  { tIn: 70.4, tOut: 72.255, kind: 'vid', ref: 'BR-5-closes-laptop-night', tr: 'hand:fade', td: 0.35 },
  { tIn: 75.022, tOut: 78.2, kind: 'vid', ref: 'BR-6-binder-paperwork-desk', tr: 'hand:fade', td: 0.38 },
  { tIn: 78.2, tOut: 85.9, kind: 'chart', ref: 'C6', tr: 'hand:xfade-scale', td: 0.35 },
  { tIn: 85.9, tOut: 91.9, kind: 'receipt', ref: 'C5', tr: 'hand:xfade-scale', td: 0.35 },
  { tIn: 91.9, tOut: 99.3, kind: 'chart', ref: 'C3', tr: 'hand:xfade-scale', td: 0.35 },
  { tIn: 99.3, tOut: 104.5, kind: 'receipt', ref: 'C4', tr: 'hand:xfade-scale', td: 0.35, mo: 'motion-3d-pan-1-down' },
  { tIn: 104.5, tOut: 108.5, kind: 'vid', ref: 'BR-7-freelancer-dark-kitchen', tr: 'hand:fade', td: 0.5 },
  { tIn: 108.5, tOut: 110.8, kind: 'still', ref: 'IMG-4-empty-home-desk-dusk', tr: 'hand:cross-warp', td: 0.5 },
  { tIn: 110.8, tOut: 114.5, kind: 'receipt', ref: 'R-CSH', tr: 'hand:xfade-scale', td: 0.35, mo: 'motion-3d-pan-1-right' },
  { tIn: 114.5, tOut: 124.25, kind: 'chart', ref: 'C8', tr: 'hand:xfade-scale', td: 0.35 },
  { tIn: 124.25, tOut: 126.75, kind: 'vid', ref: 'BR-8-reading-page-typing', tr: 'hand:fade', td: 0.5 },
  { tIn: 126.75, tOut: 128.715, kind: 'receipt', ref: 'S1', tr: 'hand:fade', td: 0.5 },
  { tIn: 128.715, tOut: 132.4, kind: 'receipt', ref: 'S2' },
  { tIn: 132.4, tOut: 139.555, kind: 'chart', ref: 'C8-shift', tr: 'hand:xfade-scale', td: 0.5 },
  // ---- CH3 THE ONES NOBODY BELIEVES ----
  { tIn: 144.122, tOut: 145.42, kind: 'vid', ref: 'BR-9-welder-black-hood', tr: 'hand:fade', td: 0.38 },
  { tIn: 145.42, tOut: 148.42, kind: 'vid', ref: 'BR-10-maintenance-worker-ceiling', tr: 'hand:fade', td: 0.35 },
  { tIn: 148.42, tOut: 151.55, kind: 'vid', ref: 'BR-11-hands-work-gloves', tr: 'hand:fade', td: 0.5 },
  { tIn: 151.55, tOut: 155.2, kind: 'container', ref: 'C11-lane1', tr: 'hand:xfade-scale', td: 0.35, state: 'base' },
  { tIn: 155.2, tOut: 160.4, kind: 'container', ref: 'C11-lane1', state: 's1' },
  { tIn: 160.4, tOut: 162.2, kind: 'vid', ref: 'BR-12-robot-arm-welding', tr: 'hand:fade', td: 0.35 },
  { tIn: 162.2, tOut: 165.2, kind: 'vid', ref: 'BR-13-cobot-arm-engineers', tr: 'hand:fade', td: 0.35 },
  { tIn: 165.2, tOut: 168.9, kind: 'receipt', ref: 'R-HDH', tr: 'hand:xfade-scale', td: 0.35, mo: 'motion-3d-pan-2-left' },
  { tIn: 168.9, tOut: 173.95, kind: 'chart', ref: 'C11-count', tr: 'hand:xfade-scale', td: 0.35 },
  { tIn: 173.95, tOut: 177.95, kind: 'vid', ref: 'BR-14-unused-welding-helmet', tr: 'hand:fade', td: 0.5 },
  { tIn: 177.95, tOut: 187.2, kind: 'chart', ref: 'C12', tr: 'hand:xfade-scale', td: 0.35 },
  { tIn: 187.2, tOut: 189.25, kind: 'receipt', ref: 'C13', tr: 'hand:xfade-scale', td: 0.35 },
  { tIn: 189.25, tOut: 193.64, kind: 'container', ref: 'plug-intro', tr: 'hand:xfade-scale', td: 0.35, state: 'base' },
  { tIn: 193.64, tOut: 194.62, kind: 'container', ref: 'plug-intro', state: 's1' },
  { tIn: 194.62, tOut: 196.3, kind: 'container', ref: 'plug-intro', state: 's2' },
  { tIn: 196.3, tOut: 197.8, kind: 'container', ref: 'plug-intro', state: 's3' },
  { tIn: 197.8, tOut: 203.8, kind: 'container', ref: 'plug-goal', tr: 'hand:xfade-scale', td: 0.35, state: 'base' },
  { tIn: 203.8, tOut: 210.2, kind: 'receipt', ref: 'R-SHOWCASE', tr: 'hand:xfade-scale', td: 0.35 },
  { tIn: 210.2, tOut: 214.65, kind: 'receipt', ref: 'R-JCT', tr: 'hand:xfade-scale', td: 0.35 },
  { tIn: 214.65, tOut: 217.6, kind: 'container', ref: 'plug-300', tr: 'hand:xfade-scale', td: 0.35, state: 'base' },
  { tIn: 217.6, tOut: 220.4, kind: 'container', ref: 'plug-300', state: 's1' },
  { tIn: 220.4, tOut: 220.54, kind: 'container', ref: 'plug-cta', tr: 'hand:xfade-scale', td: 0.35, state: 'base' },
  { tIn: 220.54, tOut: 225.0, kind: 'container', ref: 'plug-cta', state: 's1', xf: 0.35 },
  { tIn: 225.0, tOut: 228.3, kind: 'still', ref: 'IMG-5-idle-humanoid-back', tr: 'hand:cross-warp', td: 0.5 },
  { tIn: 228.3, tOut: 232.4, kind: 'receipt', ref: 'C14', tr: 'hand:xfade-scale', td: 0.35 },
  { tIn: 232.4, tOut: 234.85, kind: 'receipt', ref: 'C15', tr: 'hand:xfade-scale', td: 0.35 },
  { tIn: 234.85, tOut: 240.1, kind: 'receipt', ref: 'C16', tr: 'hand:xfade-scale', td: 0.35, mo: 'motion-3d-offset-1-right-up' },
  { tIn: 240.1, tOut: 245.25, kind: 'container', ref: 'C20', tr: 'hand:xfade-scale', td: 0.35, state: 'base' },
  { tIn: 245.25, tOut: 248.5, kind: 'container', ref: 'C11-lane3', tr: 'hand:xfade-scale', td: 0.35, state: 'base' },
  { tIn: 248.5, tOut: 251.25, kind: 'container', ref: 'C11-lane3', state: 's1' },
  { tIn: 251.25, tOut: 257.2, kind: 'receipt', ref: 'C17', tr: 'hand:xfade-scale', td: 0.35 },
  { tIn: 257.2, tOut: 259.922, kind: 'receipt', ref: 'R-KH', tr: 'hand:xfade-scale', td: 0.35 },
  { tIn: 265.155, tOut: 275.75, kind: 'deck', ref: 'C11', tr: 'hand:xfade-scale', td: 0.35, state: 'timeline' },
  { tIn: 275.75, tOut: 281.1, kind: 'chart', ref: 'C21', tr: 'hand:xfade-scale', td: 0.35 },
  { tIn: 281.1, tOut: 290.6, kind: 'receipt', ref: 'C22', tr: 'hand:xfade-scale', td: 0.35 },
  { tIn: 290.6, tOut: 293.25, kind: 'vid', ref: 'BR-15-technician-control-panel', tr: 'hand:fade', td: 0.5 },
  { tIn: 293.25, tOut: 295.1, kind: 'vid', ref: 'BR-16-plumber-under-sink', tr: 'hand:fade', td: 0.35 },
  { tIn: 295.1, tOut: 298.2, kind: 'still', ref: 'IMG-6-robot-hand-tool-wall', tr: 'hand:cross-warp', td: 0.5 },
  { tIn: 298.2, tOut: 305.3, kind: 'container', ref: 'callback-every-job', tr: 'hand:xfade-scale', td: 0.35, state: 'base' },
  { tIn: 305.3, tOut: 307.3, kind: 'container', ref: 'callback-every-job', state: 's1' },
  { tIn: 307.3, tOut: 309.4, kind: 'container', ref: 'callback-every-job', state: 's2' },
  { tIn: 309.4, tOut: 310.75, kind: 'container', ref: 'callback-every-job', state: 's3' },
  { tIn: 310.75, tOut: 312.7, kind: 'container', ref: 'apprenticeship-vs-download', tr: 'hand:xfade-scale', td: 0.35, state: 'base' },
  { tIn: 312.7, tOut: 314.42, kind: 'container', ref: 'apprenticeship-vs-download', state: 's1' },
  { tIn: 314.42, tOut: 322.42, kind: 'receipt', ref: 'C24', tr: 'hand:xfade-scale', td: 0.35 },
  { tIn: 322.42, tOut: 332.3, kind: 'receipt', ref: 'C24-footage', tr: 'hand:xfade-scale', td: 0.35 },
  { tIn: 332.3, tOut: 338.1, kind: 'receipt', ref: 'C26', tr: 'hand:xfade-scale', td: 0.35 },
  { tIn: 338.1, tOut: 339.6, kind: 'vid', ref: 'BR-17-finger-press-screen', tr: 'hand:fade', td: 0.35 },
  { tIn: 339.6, tOut: 342.97, kind: 'still', ref: 'IMG-7-dark-lamp-outlet', tr: 'hand:cross-warp', td: 0.5 },
  // C23 is ONE diagram shown once (342.97-364.42); BR-18 is a 4 s cutaway laid ON TOP of it (COVER-PLAN: "a cutaway on top of
  // the diagram, which returns after it"), so the two rows overlap on purpose and C23 re-enters on hand:xfade-scale at 353.97
  { tIn: 342.97, tOut: 364.42, kind: 'deck', ref: 'C23', tr: 'hand:xfade-scale', td: 0.35, state: 'timeline' },
  { tIn: 350.0, tOut: 353.97, kind: 'vid', ref: 'BR-18-roof-dripping-rain', tr: 'hand:fade', td: 0.5, out: 0.35 },
  { tIn: 364.42, tOut: 369.59, kind: 'receipt', ref: 'S3', tr: 'hand:fade', td: 0.5 },
  { tIn: 375.325, tOut: 377.9, kind: 'still', ref: 'IMG-8-light-stream-robot-head', tr: 'hand:cross-warp', td: 0.5 },
  { tIn: 377.9, tOut: 381.32, kind: 'receipt', ref: 'C25', tr: 'hand:xfade-scale', td: 0.35 },
  // ---- CH4 IT WON'T BE ME ----
  { tIn: 381.32, tOut: 383.7, kind: 'vid', ref: 'BR-19-commuters-dark-hall', tr: 'hand:fade', td: 0.5 },
  { tIn: 383.7, tOut: 385.72, kind: 'vid', ref: 'BR-20-escalator-subway-commuters', tr: 'hand:fade', td: 0.5 },
  { tIn: 385.72, tOut: 394.47, kind: 'chart', ref: 'C32', tr: 'hand:xfade-scale', td: 0.35 },
  { tIn: 394.47, tOut: 402.23, kind: 'chart', ref: 'C33', tr: 'hand:xfade-scale', td: 0.3 },
  { tIn: 402.23, tOut: 403.515, kind: 'clipstill', ref: 'CLIP-42', tr: 'hand:fade', td: 0.5, frame: 'first' },
  { tIn: 403.515, tOut: 404.0, kind: 'clipstill', ref: 'CLIP-51', frame: 'last' },
  { tIn: 404.0, tOut: 406.62, kind: 'vid', ref: 'BR-21-hands-fasten-belt', tr: 'hand:fade', td: 0.5 },
  { tIn: 406.62, tOut: 409.82, kind: 'vid', ref: 'BR-22-hands-metalwork-bench', tr: 'hand:fade', td: 0.5 },
  { tIn: 409.82, tOut: 414.42, kind: 'receipt', ref: 'C34', tr: 'hand:xfade-scale', td: 0.35 },
  { tIn: 414.42, tOut: 416.94, kind: 'receipt', ref: 'S4', tr: 'hand:fade', td: 0.5 },
  { tIn: 416.94, tOut: 417.41, kind: 'clipstill', ref: 'CLIP-44', frame: 'last' },
  { tIn: 417.41, tOut: 419.5, kind: 'receipt', ref: 'R-IZA', tr: 'hand:xfade-scale', td: 0.35, mo: 'motion-3d-pan-2-up' },
  { tIn: 419.5, tOut: 428.3, kind: 'chart', ref: 'C36', tr: 'hand:xfade-scale', td: 0.35 },
  { tIn: 428.3, tOut: 435.092, kind: 'receipt', ref: 'S5', tr: 'hand:fade', td: 0.5 },
  { tIn: 438.025, tOut: 441.2, kind: 'vid', ref: 'BR-23-window-silhouette-city', tr: 'hand:fade', td: 0.38 },
  // ---- CH5 WHAT NOW ----
  { tIn: 441.2, tOut: 443.47, kind: 'vid', ref: 'BR-24-dark-corridor', tr: 'hand:fade', td: 0.5 },
  { tIn: 443.47, tOut: 443.6, kind: 'container', ref: 'quiet-damage', tr: 'hand:xfade-scale', td: 0.35, state: 'base' },
  { tIn: 443.6, tOut: 446.2, kind: 'container', ref: 'quiet-damage', state: 's1' },
  { tIn: 446.2, tOut: 448.3, kind: 'container', ref: 'quiet-damage', state: 's2' },
  { tIn: 448.3, tOut: 450.725, kind: 'container', ref: 'quiet-damage', state: 's3' },
  { tIn: 454.659, tOut: 459.8, kind: 'container', ref: 'end-tiles', tr: 'hand:xfade-scale', td: 0.35, state: 'base' },
  { tIn: 459.8, tOut: 462.8, kind: 'container', ref: 'end-tiles', state: 's1' },
  { tIn: 462.8, tOut: 465.8, kind: 'container', ref: 'end-tiles', state: 's2' },
  { tIn: 465.8, tOut: 466.97, kind: 'container', ref: 'end-tiles', state: 's3' },
  { tIn: 466.97, tOut: 467.37, kind: 'container', ref: 'end-card-cta', tr: 'hand:xfade-scale', td: 0.35, state: 'base' },
  { tIn: 467.37, tOut: 471.77, kind: 'container', ref: 'end-card-cta', state: 's1' },
  { tIn: 471.77, tOut: 473.01, kind: 'container', ref: 'end-card-cta', state: 's2' },
  { tIn: 473.01, tOut: 478.27, kind: 'container', ref: 'end-card-cta', state: 's3' },
];

// captions (section 8): the windows are the generated CAPTION_WINDOWS, re-declared literally so lint_covers checks them
// against every cover (asserted equal below, so they cannot drift)
const CAPTION_SRC: [number, number][] = [[0.0, 6.489], [259.922, 265.155], [369.625, 375.325]];
if (JSON.stringify(CAPTION_SRC) !== JSON.stringify(CAPTION_WINDOWS)) throw new Error('CAPTION_SRC drifted from AIDestroyingLivesCaptions.ts CAPTION_WINDOWS');

// Envato clip frame rates: 24 / 25 / 23.976 fps clips play frame-for-frame (playbackRate = 30 / fps, comp-build.md section 11)
const VID_FPS: Record<string, number> = {
  'BR-1-welder-arc-sparks': 24 / 1, 'BR-2-tradesman-picks-tools': 25 / 1, 'BR-3-laptop-scroll-dark': 25 / 1,
  'BR-4-graduate-from-behind': 25 / 1, 'BR-5-closes-laptop-night': 24000 / 1001, 'BR-7-freelancer-dark-kitchen': 25 / 1,
  'BR-8-reading-page-typing': 24000 / 1001, 'BR-9-welder-black-hood': 25 / 1, 'BR-10-maintenance-worker-ceiling': 25 / 1,
  'BR-11-hands-work-gloves': 25 / 1, 'BR-13-cobot-arm-engineers': 25 / 1, 'BR-14-unused-welding-helmet': 24000 / 1001,
  'BR-15-technician-control-panel': 25 / 1, 'BR-16-plumber-under-sink': 25 / 1, 'BR-17-finger-press-screen': 25 / 1,
  'BR-19-commuters-dark-hall': 30000 / 1001, 'BR-20-escalator-subway-commuters': 30000 / 1001, 'BR-21-hands-fasten-belt': 24 / 1,
  'BR-22-hands-metalwork-bench': 25 / 1, 'BR-23-window-silhouette-city': 30000 / 1001, 'BR-24-dark-corridor': 24 / 1,
};
// source fps + frame count of every Envato clip (ffprobe), for the held last frame; 50 / 59.94 / 30 fps clips play at rate 1
const VID_SRC: Record<string, [number, number]> = {
  'BR-1-welder-arc-sparks': [24, 134], 'BR-2-tradesman-picks-tools': [25, 139], 'BR-3-laptop-scroll-dark': [25, 142], 'BR-4-graduate-from-behind': [25, 128],
  'BR-5-closes-laptop-night': [24000 / 1001, 84], 'BR-6-binder-paperwork-desk': [60000 / 1001, 312], 'BR-7-freelancer-dark-kitchen': [25, 150],
  'BR-8-reading-page-typing': [24000 / 1001, 108], 'BR-9-welder-black-hood': [25, 83], 'BR-10-maintenance-worker-ceiling': [25, 125],
  'BR-11-hands-work-gloves': [25, 128], 'BR-12-robot-arm-welding': [50, 190], 'BR-13-cobot-arm-engineers': [25, 125],
  'BR-14-unused-welding-helmet': [24000 / 1001, 144], 'BR-15-technician-control-panel': [25, 117], 'BR-16-plumber-under-sink': [25, 98],
  'BR-17-finger-press-screen': [25, 88], 'BR-18-roof-dripping-rain': [30, 180], 'BR-19-commuters-dark-hall': [30000 / 1001, 132],
  'BR-20-escalator-subway-commuters': [30000 / 1001, 120], 'BR-21-hands-fasten-belt': [24, 120], 'BR-22-hands-metalwork-bench': [25, 130],
  'BR-23-window-silhouette-city': [30000 / 1001, 156], 'BR-24-dark-corridor': [24, 72],
};

// receipts: the measured views (Windows-OCR word boxes of each quoted line; _previews/comp-build/receipt_table.py)
const RECEIPTS: Record<string, Receipt> = {
  'C2': { src: 'receipts/C2-challenger-october.png', W: 3840, H: 3000, bg: '#fcfaf1', mode: 'push', to: [100, 1639, 2420], from: null, hl: [] },
  'R-INDEED': { src: 'receipts/R-INDEED-seniority.png', W: 3840, H: 6149, bg: '#ffffff', mode: 'push', to: [787, 5137, 1800], from: null, hl: [{ rects: [[1808, 5814, 644, 34], [916, 5862, 100, 34]], t0: 65.78, t1: 66.6 }] },
  'C5': { src: 'receipts/C5-bls-ecopro.png', W: 1800, H: 1060, bg: '#ffffff', mode: 'push', to: [0, 0, 1500], from: null, hl: [{ rects: [[661, 166, 798, 25], [28, 201, 303, 24]], t0: 87.66, t1: 91.94 }] },
  'C4': { src: 'receipts/C4-bls-declining.png', W: 3840, H: 2800, bg: '#f1f1f1', mode: 'pan', to: [830, 400, 1900], from: null, hl: [] },
  'R-CSH': { src: 'receipts/R-CSH-freelance-study.png', W: 3840, H: 3096, bg: '#ffffff', mode: 'pan', to: [1230, 1250, 1700], from: null, hl: [] },
  'R-HDH': { src: 'receipts/R-HDH-hyundai-robots.png', W: 3840, H: 3985, bg: '#ffffff', mode: 'pan', to: [720, 300, 2400], from: null, hl: [] },
  'C13': { src: 'receipts/C13-welding-workforce.png', W: 3840, H: 6944, bg: '#ffffff', mode: 'push', to: [820, 1433, 2200], from: null, hl: [] },
  'R-JCT': { src: 'receipts/R-JCT-price-chart.png', W: 2299, H: 1293, bg: '#ffffff', mode: 'push', to: [190, 0, 1960], from: [0, 0, 2299], hl: [] },
  'C15': { src: 'receipts/C15-bmw-pilot.png', W: 3840, H: 4593, bg: '#000000', mode: 'push', to: [575, 3344, 1800], from: null, hl: [{ rects: [[1612, 3778, 72, 36]], t0: 234.05, t1: 234.5 }] },
  'C16': { src: 'receipts/C16-digit-totes.png', W: 3840, H: 3035, bg: '#f0eeeb', mode: 'pan', to: [380, 760, 2400], from: null, hl: [] },
  'C17': { src: 'receipts/C17-persona-weld.png', W: 3840, H: 10226, bg: '#ecece9', mode: 'push', to: [380, 2198, 2000], from: null, hl: [{ rects: [[1012, 2896, 338, 26]], t0: 253.0, t1: 253.88 }] },
  'R-KH': { src: 'receipts/R-KH-korea-herald.png', W: 3840, H: 5630, bg: '#ffffff', mode: 'push', to: [1230, 4165, 1760], from: null, hl: [{ rects: [[1438, 4592, 318, 34]], t0: 257.28, t1: 258.94 }] },
  'C22': { src: 'receipts/C22-bls-maintenance.png', W: 3840, H: 2800, bg: '#f1f1f1', mode: 'push', to: [840, 927, 1750], from: null, hl: [{ rects: [[986, 1232, 830, 28]], t0: 283.84, t1: 287.92 }, { rects: [[986, 1276, 384, 28]], t0: 288.18, t1: 289.32 }, { rects: [[986, 1454, 438, 28]], t0: 289.52, t1: 290.1 }] },
  'C24': { src: 'receipts/C24-toyota-atlas.png', W: 3840, H: 6068, bg: '#f9f9f9', mode: 'push', to: [820, 4703, 1400], from: null, hl: [{ rects: [[1554, 5032, 424, 32], [940, 5084, 450, 30]], t0: 320.97, t1: 322.07 }] },
  'C26': { src: 'receipts/C26-amazon-agentic.png', W: 3840, H: 2844, bg: '#ffffff', mode: 'push', to: [990, 982, 1850], from: null, hl: [{ rects: [[1576, 1408, 1102, 32], [1102, 1478, 96, 28]], t0: 336.25, t1: 337.19 }] },
  'C25': { src: 'receipts/C25-1x-order.png', W: 3840, H: 2800, bg: '#ffffff', mode: 'push', to: [2540, 1370, 1300], from: [1440, 690, 2400], hl: [{ rects: [[3284, 1772, 296, 22]], t0: 380.07, t1: 380.99 }] },
  'C34': { src: 'receipts/C34-quinnipiac-poll.png', W: 3840, H: 4970, bg: '#ffffff', mode: 'push', to: [120, 469, 3600], from: null, hl: [{ rects: [[430, 1282, 3056, 70], [204, 1412, 444, 70]], t0: 411.33, t1: 413.0 }] },
  'R-IZA': { src: 'receipts/R-IZA-dp16687.png', W: 3840, H: 5431, bg: '#005daa', mode: 'pan', to: [320, 1900, 3200], from: null, hl: [] },
  'S1': { src: 'receipts/S1-clip21-lead-in.png', W: 1920, H: 1080, bg: '#000000', mode: 'still', to: [0, 0, 1920], from: null, hl: [] },
  'S2': { src: 'receipts/S2-clip21-lead-out.png', W: 1920, H: 1080, bg: '#000000', mode: 'still', to: [0, 0, 1920], from: null, hl: [] },
  'S3': { src: 'receipts/S3-clip61-lead-in.png', W: 1920, H: 1080, bg: '#000000', mode: 'still', to: [0, 0, 1920], from: null, hl: [] },
  'S4': { src: 'receipts/S4-clip44-lead-in.png', W: 1920, H: 1080, bg: '#000000', mode: 'still', to: [0, 0, 1920], from: null, hl: [] },
  'S5': { src: 'receipts/S5-clip20-translator.png', W: 1920, H: 1080, bg: '#000000', mode: 'still', to: [0, 0, 1920], from: null, hl: [] },
};
// receipts that are RECORDINGS (muted, from their frame 0, cut at the slot end), push 1 -> 1.04, labels per the EDIT-PLAN
const REC_VIDEO: Record<string, { src: string; frames: number; label?: string; pos?: 'tl' | 'tr' | 'bl'; label2?: [number, string] }> = {
  'R-SHOWCASE': { src: 'receipts/R-SHOWCASE-scroll.mp4', frames: 269 },
  'C14': { src: 'receipts/C14-figure-bmw.mp4', frames: 300, label: 'Figure 02, 2025, ended. Other robots did the welding.', pos: 'bl' },
  'C24-footage': { src: 'receipts/C24-footage-atlas-demo.mp4', frames: 300, label: 'Lab demo, August 2025', pos: 'tr', label2: [330.4, 'packing, sorting, organizing'] },
};

// the elegant-promo C19 run (EDIT-PLAN 0:26.5-0:46.1; geometry measured off card-slides/C19-n-overlay.png alpha)
const PROMOS: Record<string, Promo> = {
  'C19-1': { id: 'C19-1', img: 'IMG-1-empty-office-floor', tIn: 26.45, H: 31.34, entry: 'iris', entryDur: 1.0, disc: [-333, -447, 1457],
    bar: [96, 169, 515, 259], anchor: 'left', title: [129, 181, 448, 262], subs: [[99, 327, 514, 352], [100, 372, 524, 397]], src: [99, 437, 600, 453], titleDir: 'ltr' },
  'C19-2': { id: 'C19-2', img: 'IMG-2-desk-belongings-box', tIn: 34.68, H: 36.78, entry: 'burst', entryDur: 0.9, disc: [2253, 1528, 1457],
    bar: [1401, 692, 1820, 782], anchor: 'right', title: [1446, 704, 1778, 785], subs: [[1662, 849, 1818, 870]], src: [1316, 908, 1817, 923], titleDir: 'rtl' },
  'C19-3': { id: 'C19-3', img: 'IMG-3-revolving-door-dusk', tIn: 40.08, H: 44.04, entry: 'burst', entryDur: 0.9, disc: [961, -925, 1435],
    bar: [750, 136, 1169, 226], anchor: 'right', title: [848, 148, 1072, 229], subs: [[608, 275, 1311, 300]], src: [708, 334, 1209, 350], titleDir: 'rtl' },
};

// system-design diagram states (assets/diagrams, the ANIMATION SPEC cue words), each lit over 12 frames (comp-level move)
const DECK_STATES: Record<string, [number, string][]> = {
  C11: [[265.155, 'C11-start'], [265.84, 'C11-lane1'], [267.22, 'C11-lane2'], [267.58, 'C11-lane3'], [272.32, 'C11-payoff']],
  C23: [[342.97, 'C23-s1-body'], [344.55, 'C23-s2-skills'], [346.81, 'C23-s3-ordering'], [348.93, 'C23-s4-arrows'], [357.07, 'C23-s5-notfound'], [360.85, 'C23-s6-prediction']],
};
const C23_RETURN = 353.97;     // "Can it do that today?": C23 continues at s4 after the BR-18 cutaway (hand:xfade-scale)
const C23_2029 = 362.27;       // "2029": the year rises 20 px + fades in; s6 is shown from 360.85 with it held back

// =====================================================================================================================
// 4. THE CLIP-INSERT LAYER (section 3d): FULL-FRAME, MUTED (the voice is in the VO), over each clip's own pause window.
//    insert-in = hand:fade 0.5 s over the lead-in still; insert-out = hand:fade onto the lead-out still (0.6 s over CLIP-21's
//    silent tail) or, onto a FACE, a dissolve centred on the face's first frame carrying the film burn (one move).
type Group = { at: number; clips: string[]; out: 'still' | 'face'; outF: number; faceT?: number; leadFirstFrame?: boolean };
const GROUPS: Group[] = [
  // the CH1 montage, Mike's ruling: 11 clips back to back, hard cuts (hand:cut) clip to clip; the video opens on CLIP-29's
  // first frame held over spine 0.00-0.16 (never on FACE-1), its last frame dissolves onto F1
  { at: 0.16, clips: ['CLIP-29', 'CLIP-3', 'CLIP-12', 'CLIP-20', 'CLIP-2', 'CLIP-27', 'CLIP-9', 'CLIP-24', 'CLIP-30', 'CLIP-6', 'CLIP-16'], out: 'face', outF: 15, faceT: 0, leadFirstFrame: true },
  { at: 128.715, clips: ['CLIP-21'], out: 'still', outF: 18 },          // insert-out 0.6 s onto S2 over the near-silent 7.0-7.6 s tail
  { at: 369.59, clips: ['CLIP-61'], out: 'face', outF: 15, faceT: 369.625 },
  { at: 403.515, clips: ['CLIP-42', 'CLIP-40', 'CLIP-51'], out: 'still', outF: 15 },   // the CH4 run, hard cuts inside it
  { at: 416.94, clips: ['CLIP-44'], out: 'still', outF: 15 },
];
const INSERT_IN_F = 15; // hand:fade 0.5 s
const groupWin = (g: Group) => {
  const ws = PAUSE_WIN.filter((w) => Math.abs(w.at - g.at) < 1e-6);
  return { s: ws[0].s, e: ws[ws.length - 1].e, ws };
};

// =====================================================================================================================
// 5. ROW GEOMETRY: each row's Sequence starts `pre` frames early when an insert dissolves out onto it, and runs `tail` frames
//    past its end under whatever fades in over it (the next row's ingress, an insert-in, its own fade-out).
const ingressFrames = (d: Cover, prev?: Cover) => {
  if (prev && prev.ref === d.ref && Math.abs(prev.tOut - d.tIn) < 0.011) return d.xf ? Math.round(d.xf * FPS) : 0;
  if (!d.tr || d.tr === 'hand:ep-iris-open' || d.tr === 'hand:cut') return 0;
  return Math.round((d.td ?? 0) * FPS);
};
const ROWS = COVERS.map((c, i) => {
  const start = F(c.tIn);
  const g = GROUPS.find((x) => x.out === 'still' && Math.abs(x.at - c.tIn) < 1e-6);
  const pre = g ? g.outF : 0;
  let tail = 0;
  for (const d of COVERS) if (d !== c && Math.abs(d.tIn - c.tOut) < 0.011) tail = Math.max(tail, ingressFrames(d, c));
  if (GROUPS.some((x) => Math.abs(x.at - c.tOut) < 1e-6)) tail = Math.max(tail, INSERT_IN_F);
  if (c.out) tail = Math.max(tail, Math.round(c.out * FPS));
  const end = i === COVERS.length - 1 ? DUR : FB(c.tOut) + tail;
  // a state swap shares its run's ingress (the first row of consecutive same-ref rows)
  let g0 = i;
  while (g0 > 0 && COVERS[g0 - 1].ref === c.ref && Math.abs(COVERS[g0 - 1].tOut - COVERS[g0].tIn) < 0.011) g0--;
  return { from: start - pre, dur: end - (start - pre), start, end: FB(c.tOut), runStart: F(COVERS[g0].tIn), runHead: COVERS[g0] };
});

const eOutCubic = (p: number) => 1 - Math.pow(1 - p, 3);
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

// =====================================================================================================================
// 6. COVER ELEMENTS
const ContainerView: React.FC<{ c: Cover }> = ({ c }) => (
  <Img src={staticFile(`card-slides/${c.ref}${c.state && c.state !== 'base' ? '-' + c.state : ''}.png`)} style={fill} />
);

const DeckView: React.FC<{ c: Cover; t: number }> = ({ c, t }) => {
  const states = DECK_STATES[c.ref];
  let k = 0;
  for (let i = 0; i < states.length; i++) if (t >= states[i][0]) k = i;
  const lit = clamp01((t - states[k][0]) / (12 / FPS));
  const push = 1 + 0.03 * clamp01((t - c.tIn) / (c.tOut - c.tIn));             // section 7a: a diagram never sits dead still
  const ret = c.ref === 'C23' && t >= C23_RETURN ? clamp01((t - C23_RETURN) / 0.35) : 1;
  const reScale = c.ref === 'C23' && t >= C23_RETURN ? 0.93 + 0.07 * eOutCubic(ret) : 1;
  const png = (n: string) => staticFile(`diagrams/${n}.png`);
  const hold2029 = c.ref === 'C23' && states[k][1] === 'C23-s6-prediction';
  const p29 = clamp01((t - C23_2029) / (12 / FPS));
  return (
    <AbsoluteFill style={{ background: '#0a0c10', overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `scale(${push * reScale})`, transformOrigin: '50% 50%' }}>
        {k > 0 && lit < 1 && <Img src={png(states[k - 1][1])} style={fill} />}
        <AbsoluteFill style={{ opacity: k > 0 ? lit : 1 }}>
          <Img src={png(states[k][1])} style={fill} />
          {hold2029 && p29 < 1 && (
            <>
              {/* the 360.85 step: s6 ('TODAY: NOT FOUND', MIKE'S PREDICTION, gold border) with '2029' held back */}
              <div style={{ position: 'absolute', left: 1344, top: 664, width: 302, height: 112, background: '#13161c', boxShadow: '0 0 14px 10px #13161c', borderRadius: 8 }} />
              <div style={{ position: 'absolute', left: 1344, top: 664, width: 302, height: 112, overflow: 'hidden', opacity: p29 }}>
                <Img src={png('C23-s6-prediction')} style={{ position: 'absolute', left: -1344, top: -664 + 20 * (1 - eOutCubic(p29)), width: 1920, height: 1080 }} />
              </div>
            </>
          )}
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const LabelChip: React.FC<{ text: string; text2?: string; p2: number; pos: 'tl' | 'tr' | 'bl'; p: number }> = ({ text, text2, p2, pos, p }) => {
  const at: React.CSSProperties = pos === 'tl' ? { left: 72, top: 64 } : pos === 'tr' ? { right: 72, top: 64, alignItems: 'flex-end' } : { left: 72, bottom: 72 };
  const chip: React.CSSProperties = { background: 'rgba(10,12,16,.82)', border: '1px solid rgba(255,255,255,.14)', borderRadius: 12, padding: '14px 24px',
    fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 34, color: '#e8eaf0', whiteSpace: 'nowrap' };
  return (
    <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', gap: 10, opacity: p, ...at }}>
      <div style={chip}>{text}</div>
      {text2 && <div style={{ ...chip, fontWeight: 500, fontSize: 30, color: '#8892a4', opacity: p2 }}>{text2}</div>}
    </div>
  );
};

// a receipt / clip still wrapped in the library MOTION move (the engine's clock fitted to the slot: t * 5 / slot)
const MotionWrap: React.FC<{ id: string; localFrame: number; slotFrames: number; children: React.ReactNode }> = ({ id, localFrame, slotFrames, children }) => {
  const row = getTransition(id);
  if (!row) throw new Error(`unknown MOTION id ${id}`);
  const Engine = ENGINES[row.engine] as React.FC<any>;
  const n = Math.max(0, Math.min(149, Math.round((localFrame * 150) / slotFrames)));
  return (
    <Sequence from={0} layout="none">
      <Freeze frame={n}>
        <Engine from={null} to={null} outClip={() => children} durationInFrames={150} params={row.params} sfxSrc={null} />
      </Freeze>
    </Sequence>
  );
};

const CoverEl: React.FC<{ c: Cover; i: number; abs: number; t: number }> = ({ c, i, abs, t }) => {
  const R = ROWS[i];
  const local = abs - R.from;
  if (c.kind === 'chart') {
    // every chart cover routes to its REAL animated component (charts.md; never a PNG with a wipe)
    if (c.ref === 'C10') return <ChartStage id="C10" t={t} push={[6.489, 13.45, 1.0, 1.03]} />;
    if (c.ref === 'C7') return <ChartStage id="C7" t={t} />;
    if (c.ref === 'C6') return <ChartStage id="C6" t={t} />;
    if (c.ref === 'C3') return <ChartStage id="C3" t={t} />;
    if (c.ref === 'C8') return <ChartStage id="C8" t={t} />;
    if (c.ref === 'C8-shift') return <ChartStage id="C8-shift" t={t} />;
    if (c.ref === 'C11-count') return <ChartStage id="C11-count" t={t} />;
    if (c.ref === 'C12') return <ChartStage id="C12" t={t} />;
    if (c.ref === 'C21') return <ChartStage id="C21" t={t} />;
    if (c.ref === 'C32') return <ChartStage id="C32" t={t} />;
    if (c.ref === 'C33') return <ChartStage id="C33" t={t} />;
    if (c.ref === 'C36') return <ChartStage id="C36" t={t} />;
    throw new Error(`chart ${c.ref} has no animated component`);
  }
  if (c.kind === 'container') return <ContainerView c={c} />;
  if (c.kind === 'deck') return <DeckView c={c} t={t} />;
  if (c.kind === 'promo') return <PromoCard c={PROMOS[c.ref]} t={t} />;
  if (c.kind === 'vid') {
    const fps = VID_FPS[c.ref];
    const [srcFps, frames] = VID_SRC[c.ref];
    return <ClipPlay src={`vid/${c.ref}.mp4`} durFrames={R.dur} clipFrames={frames} clipFps={srcFps} rate={fps ? FPS / fps : 1} />;
  }
  if (c.kind === 'still') {
    const s = 1 + 0.06 * clamp01((t - c.tIn) / (c.tOut - c.tIn));   // slow push-in (EDIT-PLAN, every AI still)
    return (
      <AbsoluteFill style={{ background: '#000', overflow: 'hidden' }}>
        <Img src={staticFile(`img/${c.ref}.png`)} style={{ ...fill, transform: `scale(${s})`, transformOrigin: '50% 50%' }} />
      </AbsoluteFill>
    );
  }
  if (c.kind === 'clipstill') {
    const n = c.frame === 'first' ? 0 : CLIP_FRAMES[c.ref] - 1;
    const s = c.frame === 'first' ? 1 + 0.03 * clamp01((t - c.tIn) / (c.tOut - c.tIn)) : 1;   // lead-in: slow push; lead-out: no move
    return (
      <AbsoluteFill style={{ background: '#000', overflow: 'hidden' }}>
        <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: '50% 50%' }}>
          <FrozenVideo src={clipSrc(c.ref)} frame={n} />
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }
  if (c.kind === 'receipt') {
    const v = REC_VIDEO[c.ref];
    if (v) {
      const s = 1 + 0.04 * clamp01((t - c.tIn) / (c.tOut - c.tIn));
      const lp = clamp01((t - c.tIn - 0.4) / 0.4);
      const p2 = v.label2 ? clamp01((t - v.label2[0]) / 0.35) : 0;
      return (
        <AbsoluteFill style={{ background: '#000', overflow: 'hidden' }}>
          <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: '50% 50%' }}>
            <ClipPlay src={v.src} durFrames={R.dur} clipFrames={v.frames} />
          </AbsoluteFill>
          {v.label && <LabelChip text={v.label} text2={v.label2?.[1]} p2={p2} pos={v.pos ?? 'bl'} p={lp} />}
        </AbsoluteFill>
      );
    }
    const r = RECEIPTS[c.ref];
    if (!r) throw new Error(`receipt ${c.ref} has no view`);
    const stage = <ReceiptStage r={r} view={receiptView(r, t, c.tIn, c.tOut)} t={t} />;
    if (c.mo) return <MotionWrap id={c.mo} localFrame={Math.max(0, abs - R.start)} slotFrames={R.end - R.start}>{stage}</MotionWrap>;
    return stage;
  }
  throw new Error(`unknown cover kind ${c.kind}`);
};

const CoverRow: React.FC<{ i: number }> = ({ i }) => {
  const abs = useAbs();
  const c = COVERS[i];
  const R = ROWS[i];
  const t = unsh(abs / FPS);
  const el = <CoverEl c={c} i={i} abs={abs} t={t} />;
  // ingress: a state swap carries its run head's ingress clock (and its own `xf` cross-fade, if any)
  const head = R.runHead;
  const tr = head.tr ?? 'hand:cut';
  const p = clamp01((abs - R.runStart) / Math.max(1, (head.td ?? 0) * FPS));
  const own = c !== head && c.xf ? clamp01((abs - R.start) / (c.xf * FPS)) : 1;
  const outP = c.out && abs >= R.end ? 1 - clamp01((abs - R.end) / (c.out * FPS)) : 1;
  if (tr === 'hand:cross-warp') {
    return <AbsoluteFill style={{ opacity: own * outP }}><WarpIn p={p} id={`cw${i}`}>{el}</WarpIn></AbsoluteFill>;
  }
  const op = (tr === 'hand:fade' || tr === 'hand:xfade-scale' ? eOutCubic(p) : 1) * own * outP;
  const sc = tr === 'hand:xfade-scale' ? 0.93 + 0.07 * eOutCubic(p) : 1;
  return <AbsoluteFill style={{ opacity: op, transform: sc !== 1 ? `scale(${sc})` : undefined, transformOrigin: '50% 50%' }}>{el}</AbsoluteFill>;
};

// =====================================================================================================================
// 7. THE INSERT LAYER
const InsertGroup: React.FC<{ g: Group }> = ({ g }) => {
  const abs = useAbs();
  const { s, e, ws } = groupWin(g);
  const faceFrame = g.out === 'face' ? Math.max(e, F(g.faceT ?? 0)) : e;
  const half = Math.round(g.outF / 2);
  const outA = g.out === 'face' ? faceFrame - half : e - g.outF;   // the insert-out dissolve window
  const outB = g.out === 'face' ? faceFrame + (g.outF - half) : e;
  return (
    <>
      {g.leadFirstFrame && (
        // the montage lead-in: CLIP-29's FIRST frame from the video's first frame (spine 0.00-0.16), under its fade-in
        <Sequence from={0} durationInFrames={s + INSERT_IN_F}>
          <FrozenVideo src={clipSrc(g.clips[0])} frame={0} />
        </Sequence>
      )}
      {g.out === 'face' && (
        // under the out-dissolve, before the face's first live frame: a faithful still of that frame (section 6a)
        <Sequence from={outA} durationInFrames={faceFrame - outA}>
          <SpineView frame={faceFrame} still />
        </Sequence>
      )}
      {ws.map((w, k) => {
        const last = k === ws.length - 1;
        const dur = (last ? outB : w.e) - w.s;
        const fIn = k === 0 ? clamp01((abs - w.s) / INSERT_IN_F) : 1;                       // insert-in: hand:fade 0.5 s
        const fOut = last ? 1 - clamp01((abs - outA) / Math.max(1, outB - outA)) : 1;      // insert-out (hand:fade, + burn on a face)
        return (
          // clip k of the group: hand:cut from the previous clip (Mike's montage ruling), full-frame, MUTED
          <Sequence key={w.clip} from={w.s} durationInFrames={dur}>
            <AbsoluteFill style={{ opacity: fIn * fOut, background: '#000' }}>
              <ClipPlay src={clipSrc(w.clip)} durFrames={dur} clipFrames={CLIP_FRAMES[w.clip]} />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </>
  );
};
// frames where the insert layer owns the picture (no captions there): lead-in through the end of each out-dissolve
const INSERT_OWNED: [number, number][] = GROUPS.map((g) => {
  const { s, e } = groupWin(g);
  const faceFrame = g.out === 'face' ? Math.max(e, F(g.faceT ?? 0)) : e;
  return [g.leadFirstFrame ? 0 : s, g.out === 'face' ? faceFrame + g.outF - Math.round(g.outF / 2) : e];
});

// =====================================================================================================================
// 8. FACE CUTS: hand:film-burn on all 14 face edges (TRANSITIONS.md, the face pick), peak on the cut frame. The F1 and F5
//    cut-ins are ONE move with the montage / CLIP-61 insert-out dissolve (the burn peaks mid-dissolve).
const MONTAGE_END = groupWin(GROUPS[0]).e;
const FACE_CUTS: number[] = [
  MONTAGE_END, F(6.489),          // F1 in (= montage insert-out) / out
  F(72.255), F(75.022),           // F2
  F(139.555), F(144.122),         // F3
  F(259.922), F(265.155),         // F4
  F(369.625), F(375.325),         // F5 in (= CLIP-61 insert-out) / out
  F(435.092), F(438.025),         // F6
  F(450.725), F(454.659),         // F7
];
// [LIGHTLEAK] lib:lightleaks-soft-short-3 (punch-leak, 0.40 s, screen, under the captions) on the F7 punch join: its swap and
// brightness peak sit at 0.16 s of the 12-frame window, so the window starts 5 frames before the join frame
const LEAK_ID = 'lightleaks-soft-short-3';
// TRANSITIONS_WAIVED: lightleaks-soft-5 (named only in TRANSITIONS.md open questions as the un-taken alternative; face_leak_set = soft-short-3)
// TRANSITIONS_WAIVED: melt-rgb-1 (named only in TRANSITIONS.md open questions as an un-taken flourish; melt_spin_budget melt_used = 0)
const LEAK_J = F(PUNCHES[0].at);

// =====================================================================================================================
// 9. CAPTIONS (section 8, house style, Montserrat 900, ON over FACE holds over 5 s only: F1, F4, F5)
const snapToSplice = (t: number) => {
  const p = INSERTS.find((x) => x.at > t && x.at - t <= 0.25);   // a word cued just before a splice is heard after the clip
  return p ? p.at : t;
};
const CAPS = ZCAPTIONS.map((c) => ({ tf: sh(snapToSplice(c.t)), h: c.h }));
const CAP_WIN_PAUSED = CAPTION_SRC.map(([a, b]) => [sh(snapToSplice(a)), shB(b)] as [number, number]);
const Captions: React.FC = () => {
  const abs = useAbs();
  const t = abs / FPS;
  if (!CAP_WIN_PAUSED.some(([a, b]) => t >= a && t < b)) return null;
  if (INSERT_OWNED.some(([a, b]) => abs >= a && abs < b)) return null;
  let cur: { tf: number; h: string } | null = null;
  for (const c of CAPS) {
    if (c.tf <= t + 1e-6) cur = c;
    else break;
  }
  if (!cur) return null;
  const nextT = (CAPS.find((c) => c.tf > cur!.tf) || { tf: Infinity }).tf;
  if (t >= Math.min(nextT, cur.tf + 1.3)) return null;
  const f = (t - cur.tf) * FPS;
  const pop = f < 5 ? 0.7 + (1.12 - 0.7) * (f / 5) : f < 9 ? 1.12 - 0.12 * ((f - 5) / 4) : 1;
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 110, pointerEvents: 'none' }}>
      <div style={{ fontFamily: "Montserrat,'Arial Black','Segoe UI',sans-serif", fontWeight: 900, fontSize: 78, textTransform: 'lowercase', color: '#fff',
        WebkitTextStroke: '12px #000', paintOrder: 'stroke fill', transform: `scale(${pop})`, letterSpacing: 0.5, lineHeight: 1.05, textAlign: 'center' }}>
        {cur.h}
      </div>
    </AbsoluteFill>
  );
};

// =====================================================================================================================
// 10. THE COMPOSITION
export const AIDestroyingLives: React.FC = () => {
  const abs = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <AbsCtx.Provider value={abs}>
        {/* the paused spine: Mike's VO (the comp's only audio), the face reframed + the F7 punch */}
        <Sequence from={0} durationInFrames={SPINE_FRAMES}>
          <SpineView frame={abs} still={false} />
        </Sequence>
        {/* the cover track */}
        {COVERS.map((c, i) => (
          <Sequence key={`cv${i}`} from={ROWS[i].from} durationInFrames={ROWS[i].dur}>
            <CoverRow i={i} />
          </Sequence>
        ))}
        {/* the clip inserts (their voices are in the VO; the pictures play muted over the paused windows) */}
        {GROUPS.map((g, k) => <InsertGroup key={`ig${k}`} g={g} />)}
        {/* [LIGHTLEAK] lib:lightleaks-soft-short-3 on the F7 punch join; A and B = the live spine (the join is in it) */}
        <Sequence from={LEAK_J - 5} durationInFrames={12}>
          <TransitionClip id={LEAK_ID} cutFrame={6} sfx={false}
            outgoing={() => <SpineView frame={abs} still />} incoming={() => <SpineView frame={abs} still />} />
        </Sequence>
        {/* hand:film-burn on every face cut */}
        {FACE_CUTS.map((cut, k) => (
          <Sequence key={`fb${k}`} from={cut - 12} durationInFrames={25}>
            <FilmBurn abs={abs} cut={cut} seed={k} />
          </Sequence>
        ))}
        {/* captions, topmost */}
        <Captions />
      </AbsCtx.Provider>
    </AbsoluteFill>
  );
};

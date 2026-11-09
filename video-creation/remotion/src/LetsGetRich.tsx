// LetsGetRich.tsx: the longform-edited composition of `lets-get-rich` ("Buffett Bought EVERY Bottom. Are You Buying
// This One?"), built 2026-11-01 by the comp-builder TO the approved blueprint: EDIT-PLAN.md (the event log, row for
// row) · CUE-SHEET.md · TRANSITIONS.md + TRANSITION-PLAN.json (exact ids) · COVER-PLAN.json · AS-RECORDED.md (FACE
// windows) · PROJECT-LOG.md (Mike's rulings: background-vocals bed (post-mix), the four clip inserts, every multiple
// pops with no ticker, the typed profile card, four icons, the LET'S GET / RICH title pop, gold accent, F1-F3 air as
// the approved Higgsfield background swaps). Skeletons: skills/comp-build/comp-build.md (no other project's comp read).
//
// Model: ONE continuous paused spine (assets/spine.mp4 = spine/ALL.f.paused.mp4: FACE baked, COVER black, the four
// clip-insert pauses baked) carries the VO; every layer is windowed to SOURCE seconds routed through sh().
// No music, no SFX, no watermark: the kinetic-text sounds, impacts, riser and the get-it bed ride mix_music.py.
// Every node reads ONE absolute clock (AbsFrame context + the kinetic-text KtClock in SOURCE seconds, held inside a
// pause), so engine nesting can never freeze a node (comp-build.md section 6a).
import React, { createContext, useContext } from 'react';
import { AbsoluteFill, Audio, Easing, Freeze, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadDMSans } from '@remotion/google-fonts/DMSans';
import { loadFont as loadMono } from '@remotion/google-fonts/JetBrainsMono';
import { TransitionClip } from './transitions/TransitionClip';
import { ENGINES, getTransition } from './transitions';
import {
  CL,
  KtClock,
  KtHeadlineOverBroll,
  KtIconPop,
  KtKeywordPop,
  KtLowerThirdBand,
  KtSidePanel,
  KtWhipCut,
  KtWordByWord,
  ktBandFaceLift,
  ktSidePanelShift,
  pop110,
} from './effects/kinetic-text';
import { CAPTION_WINDOWS, ZCAPTIONS } from './LetsGetRichCaptions';
import {
  C13Multiples,
  C16Venture,
  C4Ladder,
  CardState,
  CardStates,
  CountUpNumber,
  DiscordSticker,
  F_KT,
  GOLD,
  KtCaptionLine,
  MoneyBag,
  Sparkle,
  StackedList,
  StickerAt,
  SubscribeBar,
  TextWall,
  captionWordEnd,
  prog,
  pushProgress,
} from './LetsGetRichCharts';

loadMontserrat('normal', { weights: ['800', '900'], subsets: ['latin'] });
loadMontserrat('italic', { weights: ['800', '900'], subsets: ['latin'] });
loadPlayfair('normal', { weights: ['700', '900'], subsets: ['latin'] });
loadPlayfair('italic', { weights: ['900'], subsets: ['latin'] });
loadDMSans('normal', { weights: ['400', '600', '700', '900'], subsets: ['latin'] });
loadMono('normal', { weights: ['400', '600', '700'], subsets: ['latin'] });

// =====================================================================================================================
// 1. TIMING (comp-build.md section 2 + 3d): the sidecar spine/ALL.f.paused.json pauses[] IS the time map
// =====================================================================================================================
export const FPS = 30;
const PAUSE = 1.5; // sidecar pause_s (a title-card pause; this video has NO title cards, so it never applies)
export const CARD_T: number[] = []; // no title cards (one get-it track carved, every chapter card OFF)
// EVERY pause of the sidecar, {at (source s), dur (s)}: the four spliced clip inserts (their voice is in the VO track)
export const INSERTS = [
  { at: 15.53, dur: 9.9 }, // CLIP-4 Bloomberg, Binance hack (planned 15.44, snapped into the trough)
  { at: 91.015, dur: 7.0 }, // CLIP-3 Buffett on GE (planned 90.90)
  { at: 105.19, dur: 7.4 }, // CLIP-1 Buffett, greedy when others are fearful (planned 105.14)
  { at: 108.91, dur: 2.5 }, // BRAAM-1 GET GREEDY beat pause (Mike 2026-11-01; FINAL note 1.5 -> 2.5 s): riser hit, THEN the headline + cash register, after "greedy."
  { at: 145.04, dur: 5.633333 }, // CLIP-7 the OHHHH reaction meme
];
const CLIPS = [
  { at: 15.53, ref: 'CLIP-4-bloomberg-binance-hack', frames: 297, fade: 0.5, leadIn: true }, // hand:fade insert-in / insert-out
  { at: 91.015, ref: 'CLIP-3-buffett-ge', frames: 210, fade: 0.5, leadIn: true }, // hand:fade insert-in / insert-out
  { at: 105.19, ref: 'CLIP-1-buffett-greedy', frames: 222, fade: 0.5, leadIn: false }, // hand:fade (the face is the lead-in)
  { at: 145.04, ref: 'CLIP-7-ohhhh-reaction', frames: 169, fade: 0, leadIn: false }, // hand:cut in AND out (clip-inserts rule 6)
];
export const SPINE_SECS = 275.133; // the SOURCE spine spine/ALL.e.desilenced.mp4
const PAUSED_SECS = 307.633; // assets/spine.mp4 (= spine/ALL.f.paused.mp4, 9229 frames; 2026-11-01: dead pause cut, GET GREEDY beat pause)
export const DUR = Math.round(PAUSED_SECS * FPS);
if (Math.abs(SPINE_SECS + CARD_T.length * PAUSE + INSERTS.reduce((s, p) => s + p.dur, 0) - PAUSED_SECS) > 0.1) {
  throw new Error('LetsGetRich: SPINE_SECS + pauses does not match the paused spine');
}
/** source s -> paused s (a cue AT a pause point lands after the pause) */
const sh = (t: number) => t + INSERTS.filter((p) => p.at <= t).reduce((s, p) => s + p.dur, 0);
/** source s -> paused s for an END boundary (a window ending AT a pause point ends before the pause) */
const shOut = (t: number) => t + INSERTS.filter((p) => p.at < t).reduce((s, p) => s + p.dur, 0);
const F = (t: number) => Math.round(sh(t) * FPS);
const FO = (t: number) => Math.round(shOut(t) * FPS);
/** comp frame -> SOURCE s (held at the pause point inside a pause) */
const srcAt = (f: number) => {
  const p = f / FPS;
  let acc = 0;
  for (const ins of INSERTS) {
    const start = ins.at + acc;
    if (p < start) return p - acc;
    if (p < start + ins.dur) return ins.at;
    acc += ins.dur;
  }
  return p - acc;
};

const AbsFrame = createContext(0);
const useAbs = () => useContext(AbsFrame);
const useSrc = () => srcAt(useAbs());

// =====================================================================================================================
// 2. MEDIA HELPERS: every video frame is a real <Freeze> of an EXACT frame inside a zero-offset Sequence (the
// Remotion 4.0.462 Freeze clamp, comp-build.md section 6a rule 1), always muted (the VO is the one <Audio> below)
// =====================================================================================================================
const fill: React.CSSProperties = { position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, objectFit: 'cover' };
const VidFrame: React.FC<{ src: string; frame: number; rate?: number; style?: React.CSSProperties }> = ({ src, frame, rate = 1, style }) => (
  <Sequence from={0} layout="none">
    <Freeze frame={Math.max(0, Math.round(frame))}>
      <OffthreadVideo src={staticFile(src)} muted playbackRate={rate} style={style ?? fill} />
    </Freeze>
  </Sequence>
);

// 24 / 25 fps clips play frame-for-frame (playbackRate = 30 / fps, comp-build.md section 11); the rest at 1.0
const VID_FPS: Record<string, number> = {
  'BR-2-phone-red-candles': 25 / 1,
  'BR-5-bank-protest-signs': 25 / 1,
  'BR-6-sale-sign-window': 25 / 1,
  'BR-8-buy-sell-orders': 25 / 1,
  'BR-10-concert-crowd-phones': 25 / 1,
  'BR-11-gold-coins-pouring': 25 / 1,
  'BR-12-crypto-laptop-green': 25 / 1,
  'BR-13-phone-chat-night': 24 / 1,
};
const CLIP_SECS: Record<string, number> = {
  'BR-1-trader-red-screens': 5.672, 'BR-2-phone-red-candles': 4.4, 'BR-3-wall-st-sign': 3.8038, 'BR-4-bank-facade': 5.0, 'BR-5-bank-protest-signs': 5.4,
  'BR-6-sale-sign-window': 4.6, 'BR-7-chat-bubbles': 4.833, 'BR-8-buy-sell-orders': 5.48, 'BR-9-green-chart-rising': 3.883, 'BR-10-concert-crowd-phones': 5.4,
  'BR-11-gold-coins-pouring': 5.04, 'BR-12-crypto-laptop-green': 4.92, 'BR-13-phone-chat-night': 5.708, 'BR-14-rocket-through-clouds': 6.64, 'BR-15-ring-light-vlogger': 5.7057,
};
const rateOf = (ref: string) => (VID_FPS[ref] ? FPS / VID_FPS[ref] : 1);
/** elapsed comp frames -> the clip's frame index (in comp frames at its rate); `hold` freezes the last frame, `pingpong`
 * runs back and forth (a clip held under a panel past its own length keeps moving instead of freezing) */
const brollFrame = (ref: string, e: number, mode: 'hold' | 'pingpong' = 'hold') => {
  const max = Math.floor((CLIP_SECS[ref] * FPS) / rateOf(ref)) - 2;
  if (e <= max) return Math.max(0, e);
  if (mode === 'hold') return max;
  const k = e % (2 * max);
  return k <= max ? k : 2 * max - k;
};

// =====================================================================================================================
// 3. THE SPINE + the MEASURED FACE REFRAME (comp-build.md section 3a; assets/face-reframe.json, never hand-tuned)
// =====================================================================================================================
export const FACE_REFRAME = { scale: 1.255, x: -388, y: -217 };
const FACE_POINT = { x: 960, y: 432 }; // face-reframe.json face_point_out: punch-ins scale about it
// F1-F3 AIR AS the approved Higgsfield background swaps (section 3b): PRE-FRAMED, full-frame, NO FACE_REFRAME, from the
// sidecar's window_starts_at_clip_s (re-timed onto the real voice, 30 fps), video only (the spine audio is the VO)
const SWAPS = [
  { from: 0.0, to: 6.767, win0: 0.067, clip0: 0.4, file: 'face-swap/F1-higgsfield-bg-swap.mp4' }, // F1 (frame 0 uses the head handle)
  { from: 28.8, to: 35.867, win0: 28.8, clip0: 0.4, file: 'face-swap/F2-higgsfield-bg-swap.mp4' }, // F2
  { from: 95.7, to: 105.2, win0: 95.7, clip0: 0.1, file: 'face-swap/F3-higgsfield-bg-swap.mp4' }, // F3
];
// PUNCH-IN: the ONE desilencer join inside a face window off its edge margin (spine/jumpcuts-final.json F8 274.600 =
// frame 8540): a hard ~18 percent step ON the join, held to the last frame, with its library light leak (section 8)
// + the dead-air jump-cut (Mike 2026-11-01: the 10.07 s pause after "now is the time." CUT from the spine at 250.867):
// a 12 percent step masks the head jump ON "So", then the finale step on "Holy crap, dude." goes to 24 percent
const PUNCHES = [{ t: 250.867, s: 1.12 }, { t: 274.600, s: 1.24 }];
const punchAt = (t: number) => PUNCHES.reduce((s, p) => (t >= p.t - 0.001 ? p.s : s), 1);
// the kt-lower-third-band face lift on F6 (ktBandFaceLift: 68 px over 0.10 s, 85 px after the swap)
const BAND = { t0: 149.35, t1: 151.6, swap: 151.16 };
const liftAt = (t: number) => (t >= BAND.t0 && t < BAND.t1 ? ktBandFaceLift(t, BAND.t0, [BAND.swap]) : 0);

/** The spine as it AIRS at comp frame f: the swap clip on F1-F3 (untransformed), else spine.mp4 through FACE_REFRAME,
 * punched about FACE_POINT. Muted. Used by the live layer AND every engine still of it (same source, same transform). */
// The cover-blackout un-gates ONE frame late at these FACE starts (two at F8): measured on assets/spine.mp4 (luma 16 on
// the window's first frame, _previews/qa/_tools/spine-yavg.txt). The comp shows the first real face frame there so a
// face cut-in never opens on black (F1-F3 air from their swap clips and need none).
const BLACK_HEAD: Record<number, number> = { 4514: 4515, 4926: 4927, 5352: 5353, 6313: 6314, 8228: 8230, 8229: 8230 };
const SpineFace: React.FC<{ f: number; punch?: number; lift?: number }> = ({ f: f0, punch, lift }) => {
  const f = BLACK_HEAD[f0] ?? f0;
  const t = srcAt(f0);
  const p = punch ?? punchAt(t);
  const l = lift ?? liftAt(t);
  const sw = SWAPS.find((s) => t >= s.from && t < s.to);
  if (sw) {
    return (
      <AbsoluteFill style={{ background: '#000' }}>
        <VidFrame src={sw.file} frame={(sw.clip0 + (t - sw.win0)) * FPS} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: '#000', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', transformOrigin: `${FACE_POINT.x}px ${FACE_POINT.y}px`, transform: `translateY(${l}px) scale(${p})` }}>
        <VidFrame
          src="spine.mp4"
          frame={f}
          style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', transform: `translate(${FACE_REFRAME.x}px, ${FACE_REFRAME.y}px) scale(${FACE_REFRAME.scale})` }}
        />
      </div>
    </AbsoluteFill>
  );
};
const SpineLive: React.FC<{ punch?: number }> = ({ punch }) => <SpineFace f={useAbs()} punch={punch} />;

// FACE cut-ins on the video's face pick hand:kt-whip-cut (the incoming face whip-zooms 200 -> 100 percent)
const FACE_WHIPS_IN: { t: number; variant: 'default' | 'open'; id: string }[] = [
  { t: 0.0, variant: 'open', id: 'hand:kt-whip-cut' }, // 0:00.0 the open whips in onto F1 (0.73 s, 25 -> 0 degree roll)
  { t: 95.7, variant: 'default', id: 'hand:kt-whip-cut' }, // 1:35.7 BR-6 -> F3
  { t: 126.167, variant: 'default', id: 'hand:kt-whip-cut' }, // 2:06.2 C13 -> F4
  { t: 139.9, variant: 'default', id: 'hand:kt-whip-cut' }, // 2:19.9 BR-9 -> F5
  { t: 148.467, variant: 'default', id: 'hand:kt-whip-cut' }, // 2:28.5 CHAPTER WHIP BR-10 -> F6
  { t: 244.333, variant: 'default', id: 'hand:kt-whip-cut' }, // 4:04.3 CHAPTER WHIP S2 -> F8
];
// (0:28.8 F2 and 3:00.5 F7 are hand:kt-push-slide: the cover pushes OUT right onto the face; 1:45.1 F3 out = the CLIP-1
//  hand:fade; 2:25.0 F5 out = the CLIP-7 hand:cut; 4:35.1 the end = hand:cut on the last word, no held still)

// kt-whip-cut render cost (measured 2026-11-01 on this comp): the engine's lens-curvature displacement filter makes a whip
// frame cost 47-84 s (22-54 s even with one shutter sample), at the edge of the 120 s per-frame timeout under concurrency
// (a QA chunk died on frame 204 = the BR-1 whip); with lens={false} a whip frame costs 2-4.5 s. The whip keeps its
// 200 -> 100 scale, the open's roll and the 8-sample radial shutter blur; only the barrel curvature is dropped (deviation,
// reported). WHIP_BLUR stays on.
const WHIP_LENS = false;
const WHIP_BLUR = true;
const SpineLayer: React.FC = () => {
  const t = useSrc();
  const w = FACE_WHIPS_IN.find((x) => t >= x.t && t < x.t + (x.variant === 'open' ? 0.73 : 0.37));
  const node = <SpineLive />;
  return w ? <KtWhipCut t0={w.t} variant={w.variant} lens={WHIP_LENS} motionBlur={WHIP_BLUR}>{node}</KtWhipCut> : node;
};

// =====================================================================================================================
// 4. THE COVER TRACK (section 4): one row per COVER sub-beat, straight off the EDIT-PLAN event log (source seconds;
// rows ending AT a clip-insert pause end before it, rows starting there start after it). `tr` = the ingress move from
// TRANSITIONS.md (whip = hand:kt-whip-cut · fade = hand:fade 0.5 s · xfade = hand:xfade-scale 0.35 s · push-top /
// push-left = hand:kt-push-slide in · panel = hand:kt-side-panel (the receipt panel's own entrance) · melt / spin =
// the reserved library marquees · cut = hand:cut · none = a state swap / continuation, no ingress); `out` = a
// kt-push-slide exit onto the next picture. Consecutive same-ref rows are state swaps (none here but the clip stills).
// =====================================================================================================================
type Kind = 'vid' | 'receipt' | 'chart' | 'card' | 'clipstill';
type Cover = { tIn: number; tOut: number; kind: Kind; ref: string; tr: string; out?: string; edge?: string; bg?: string; mo?: string; lead?: boolean; cap?: boolean; state?: string; scrim?: boolean };
const COVERS: Cover[] = [
  { tIn: 6.767, tOut: 10.44, kind: 'vid', ref: 'BR-1-trader-red-screens', tr: 'whip' }, // 0:06.8 F1 out, hand:kt-whip-cut
  { tIn: 10.44, tOut: 12.84, kind: 'vid', ref: 'BR-2-phone-red-candles', tr: 'fade' }, // 0:10.4 hand:fade (broll-fade)
  { tIn: 12.84, tOut: 15.53, kind: 'clipstill', ref: 'CLIP-4-bloomberg-binance-hack', tr: 'fade', edge: 'first' }, // 0:12.8 CLIP-4 LEAD-IN still, hand:fade
  { tIn: 15.53, tOut: 18.6, kind: 'clipstill', ref: 'CLIP-4-bloomberg-binance-hack', tr: 'none', edge: 'last' }, // 0:15.4 CLIP-4 LEAD-OUT still (after hand:fade insert-out)
  { tIn: 18.6, tOut: 20.38, kind: 'vid', ref: 'BR-3-wall-st-sign', tr: 'push-top' }, // 0:18.6 hand:kt-push-slide in from the TOP
  { tIn: 20.38, tOut: 22.62, kind: 'receipt', ref: 'C12-yahoo-selloff', tr: 'panel', bg: 'BR-3-wall-st-sign' }, // 0:20.4 hand:kt-side-panel PAPER RIGHT over BR-3's held frame
  { tIn: 22.62, tOut: 25.44, kind: 'receipt', ref: 'C21-googl-1y', tr: 'xfade', scrim: true }, // 0:22.6 hand:xfade-scale, push
  { tIn: 25.44, tOut: 28.8, kind: 'receipt', ref: 'C22-coingecko-total', tr: 'xfade', out: 'push-right', scrim: true }, // 0:25.4 hand:xfade-scale; 0:28.8 hand:kt-push-slide OUT right onto F2
  { tIn: 35.867, tOut: 39.8, kind: 'chart', ref: 'C4', tr: 'whip', state: 's0' }, // 0:35.9 CHAPTER WHIP F2 -> C4 (hand:kt-whip-cut)
  { tIn: 39.8, tOut: 44.38, kind: 'receipt', ref: 'C5-sec-goldman', tr: 'panel', bg: 'C4', mo: 'motion-3d-pan-1-right' }, // 0:39.8 hand:kt-side-panel + lib MOTION pan
  { tIn: 44.38, tOut: 60.26, kind: 'chart', ref: 'C4', tr: 'xfade', state: 's0-s2' }, // 0:44.4 hand:xfade-scale (the anchor's 2nd spot)
  { tIn: 60.26, tOut: 63.26, kind: 'vid', ref: 'BR-4-bank-facade', tr: 'whip' }, // 1:00.3 hand:kt-whip-cut
  { tIn: 63.26, tOut: 66.64, kind: 'vid', ref: 'BR-5-bank-protest-signs', tr: 'whip' }, // 1:03.3 hand:kt-whip-cut
  { tIn: 66.64, tOut: 74.48, kind: 'receipt', ref: 'C6-sec-bofa', tr: 'panel', bg: 'BR-5-bank-protest-signs' }, // 1:06.6 hand:kt-side-panel PAPER RIGHT + highlights
  { tIn: 74.48, tOut: 87.9, kind: 'chart', ref: 'C4', tr: 'melt', state: 's3-s5' }, // 1:14.5 lib:melt-equidistant-short-1 (MELT-transform)
  { tIn: 87.9, tOut: 91.015, kind: 'clipstill', ref: 'CLIP-3-buffett-ge', tr: 'fade', edge: 'first' }, // 1:27.9 CLIP-3 LEAD-IN (= C20), hand:fade
  { tIn: 91.015, tOut: 93.1, kind: 'clipstill', ref: 'CLIP-3-buffett-ge', tr: 'none', edge: 'last' }, // 1:30.9 CLIP-3 LEAD-OUT still
  { tIn: 93.1, tOut: 95.7, kind: 'vid', ref: 'BR-6-sale-sign-window', tr: 'whip' }, // 1:33.1 hand:kt-whip-cut
  { tIn: 105.19, tOut: 105.46, kind: 'clipstill', ref: 'CLIP-1-buffett-greedy', tr: 'none', edge: 'last', out: 'push-down' }, // 1:45.1 CLIP-1 LEAD-OUT; pushes out DOWN (hand:kt-push-slide, silent)
  { tIn: 105.46, tOut: 108.92, kind: 'card', ref: 'K-WALL-get-greedy', tr: 'none', state: 's1-s2' }, // 1:45.5 kt-text-wall, revealed by the push-down
  { tIn: 108.92, tOut: 117.18, kind: 'receipt', ref: 'C14-btc-1w', tr: 'whip' }, // 1:48.8 CHAPTER WHIP K-WALL -> C14 (hand:kt-whip-cut)
  { tIn: 117.18, tOut: 126.167, kind: 'chart', ref: 'C13', tr: 'spin', state: 's0-s4' }, // 1:57.2 lib:spin-center-ease-short-cw (SPIN-newfacet)
  { tIn: 131.7, tOut: 134.52, kind: 'vid', ref: 'BR-7-chat-bubbles', tr: 'whip' }, // 2:11.7 F4 out, hand:kt-whip-cut
  { tIn: 134.52, tOut: 138.02, kind: 'vid', ref: 'BR-8-buy-sell-orders', tr: 'fade' }, // 2:14.5 hand:fade
  { tIn: 138.02, tOut: 139.9, kind: 'vid', ref: 'BR-9-green-chart-rising', tr: 'fade' }, // 2:18.0 hand:fade
  { tIn: 145.04, tOut: 148.467, kind: 'vid', ref: 'BR-10-concert-crowd-phones', tr: 'cut' }, // 2:25.0 hand:cut out of CLIP-7
  { tIn: 151.6, tOut: 154.62, kind: 'vid', ref: 'BR-11-gold-coins-pouring', tr: 'whip' }, // 2:31.6 F6 out, hand:kt-whip-cut
  { tIn: 154.62, tOut: 164.8, kind: 'chart', ref: 'C16', tr: 'spin', state: 's0-s3' }, // 2:34.6 lib:spin-center-ease-short-ccw (SPIN-newfacet)
  { tIn: 164.8, tOut: 169.92, kind: 'receipt', ref: 'C17-galaxy-vc', tr: 'panel', bg: 'C16' }, // 2:44.8 hand:kt-side-panel PAPER RIGHT + highlight
  { tIn: 169.92, tOut: 180.5, kind: 'card', ref: 'K-PROFILE-typewriter', tr: 'push-left', out: 'push-right', state: 's1-s6' }, // 2:49.9 hand:kt-push-slide in LEFT; 3:00.5 out RIGHT onto F7
  { tIn: 183.067, tOut: 186.0, kind: 'vid', ref: 'BR-12-crypto-laptop-green', tr: 'whip' }, // 3:03.1 F7 out, hand:kt-whip-cut
  { tIn: 186.0, tOut: 191.18, kind: 'card', ref: 'K-20X-example', tr: 'xfade', state: 's1-s3' }, // 3:06.0 hand:xfade-scale
  { tIn: 191.18, tOut: 194.9, kind: 'vid', ref: 'BR-13-phone-chat-night', tr: 'whip' }, // 3:11.2 hand:kt-whip-cut
  { tIn: 194.9, tOut: 199.68, kind: 'card', ref: 'K-CALL-353', tr: 'xfade', state: 's1-s2' }, // 3:14.9 hand:xfade-scale
  { tIn: 199.68, tOut: 204.3, kind: 'vid', ref: 'BR-14-rocket-through-clouds', tr: 'whip', lead: true }, // 3:19.7 hand:kt-whip-cut (4.62 s leading motion)
  { tIn: 204.3, tOut: 214.14, kind: 'card', ref: 'K-CALL-550', tr: 'xfade', state: 's1-s2' }, // 3:24.3 hand:xfade-scale
  { tIn: 214.14, tOut: 217.82, kind: 'vid', ref: 'BR-15-ring-light-vlogger', tr: 'whip' }, // 3:34.1 hand:kt-whip-cut
  { tIn: 217.82, tOut: 222.88, kind: 'card', ref: 'K-BAGS-degen-playbook', tr: 'whip', state: 's1-s3' }, // 3:37.8 hand:kt-whip-cut (container-whip)
  { tIn: 222.88, tOut: 233.26, kind: 'card', ref: 'S1-statement-bell', tr: 'xfade', state: 's0-s2' }, // 3:42.9 hand:xfade-scale
  { tIn: 233.26, tOut: 237.9, kind: 'receipt', ref: 'C24-btc-1y', tr: 'xfade' }, // 3:53.3 hand:xfade-scale, push
  { tIn: 237.9, tOut: 244.333, kind: 'card', ref: 'S2-statement-bottoms', tr: 'cut', state: 's0-s3' }, // 3:57.9 hand:cut on the drop
];
// (end declared refs)

const INGRESS_SEC: Record<string, number> = { fade: 0.5, xfade: 0.35, 'push-top': 0.1, 'push-left': 0.1 };

// ---- receipts ---------------------------------------------------------------------------------------------------
type Cam = { t: number; s: number; x: number; y: number }; // image point (x, y) at the view centre, scale s
const camAt = (keys: Cam[], t: number) => {
  if (t <= keys[0].t) return keys[0];
  for (let i = 1; i < keys.length; i++) {
    if (t < keys[i].t) {
      const a = keys[i - 1];
      const b = keys[i];
      const u = Easing.inOut(Easing.cubic)((t - a.t) / (b.t - a.t));
      return { t, s: a.s + (b.s - a.s) * u, x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u };
    }
  }
  return keys[keys.length - 1];
};
type Rx = { file: string; w: number; h: number; cam: Cam[]; hl?: { box: [number, number, number, number]; t: number }[]; vw?: number; vh?: number };
// full-frame receipts: view 1920 x 1080; panel receipts: the paper panel's 973 x 1080 window
const RX: Record<string, Rx> = {
  'C21-googl-1y': { file: 'receipts/C21-googl-1y.png', w: 3840, h: 2160, cam: [{ t: 22.62, s: 0.5, x: 1920, y: 1080 }, { t: 25.44, s: 0.57, x: 2156, y: 1120 }] }, // push toward the drop (right edge)
  'C22-coingecko-total': { file: 'receipts/C22-coingecko-total.png', w: 3840, h: 2160, cam: [{ t: 25.44, s: 0.5, x: 1920, y: 1080 }, { t: 28.8, s: 0.6, x: 2240, y: 1200 }] }, // push to the peak-to-now slope
  'C14-btc-1w': { file: 'receipts/C14-btc-1w.png', w: 3840, h: 2160, cam: [{ t: 108.92, s: 0.5, x: 1920, y: 1080 }, { t: 111.6, s: 0.5, x: 1920, y: 1080 }, { t: 112.4, s: 0.85, x: 1067, y: 1560 }, { t: 113.9, s: 0.85, x: 1067, y: 1560 }, { t: 114.8, s: 0.85, x: 2200, y: 600 }, { t: 117.18, s: 0.87, x: 2200, y: 610 }] }, // two-stage: the Nov 2022 trough (x 100-300, y 1780), then the Oct 2025 peak (2180, 280)
  'C24-btc-1y': { file: 'receipts/C24-btc-1y.png', w: 3840, h: 2160, cam: [{ t: 233.26, s: 0.5, x: 1920, y: 1080 }, { t: 236.6, s: 0.53, x: 1900, y: 1110 }, { t: 237.5, s: 0.85, x: 1500, y: 1525 }] }, // push toward the July trough (1380, 1800) ON "July"
  'C12-yahoo-selloff': { file: 'receipts/C12-yahoo-selloff.png', w: 3840, h: 3200, vw: 973, vh: 1080, cam: [{ t: 20.38, s: 0.6, x: 1610, y: 930 }, { t: 22.62, s: 0.64, x: 1610, y: 900 }] }, // headline + byline, push
  'C6-sec-bofa': { file: 'receipts/C6-sec-bofa.png', w: 1860, h: 657, vw: 973, vh: 1080, cam: [{ t: 66.64, s: 0.473, x: 930, y: 328 }, { t: 66.9, s: 0.473, x: 930, y: 328 }, { t: 68.2, s: 0.85, x: 560, y: 440 }, { t: 71.3, s: 0.85, x: 560, y: 440 }, { t: 72.2, s: 0.85, x: 1340, y: 440 }], hl: [{ box: [102, 420, 207, 57], t: 70.32 }, { box: [1323, 420, 178, 57], t: 72.5 }] }, // settling push, then the two highlights (C6-sec-bofa.highlights.json)
  'C17-galaxy-vc': { file: 'receipts/C17-galaxy-vc.png', w: 3840, h: 3200, vw: 973, vh: 1080, cam: [{ t: 164.8, s: 0.42, x: 1530, y: 1900 }, { t: 165.0, s: 0.42, x: 1530, y: 1900 }, { t: 165.45, s: 0.6, x: 1910, y: 2560 }], hl: [{ box: [1856, 2626, 104, 44], t: 165.52 }] }, // header + paragraph, a settling push onto 76.5%
};
const HL = '#ffe14d';
const ReceiptView: React.FC<{ r: Rx; t: number }> = ({ r, t }) => {
  const vw = r.vw ?? 1920;
  const vh = r.vh ?? 1080;
  const c0 = camAt(r.cam, t);
  const clampC = (v: number, half: number, size: number) => (size * c0.s <= 2 * half ? size / 2 : Math.min(size - half / c0.s, Math.max(half / c0.s, v)));
  const c = r.vw ? c0 : { ...c0, x: clampC(c0.x, vw / 2, r.w), y: clampC(c0.y, vh / 2, r.h) };
  return (
    <div style={{ position: 'absolute', left: vw / 2 - c.x * c.s, top: vh / 2 - c.y * c.s, width: r.w * c.s, height: r.h * c.s }}>
      <Img src={staticFile(r.file)} style={{ width: '100%', height: '100%' }} />
      {(r.hl ?? []).map((h, i) =>
        t >= h.t ? (
          <div key={i} style={{ position: 'absolute', left: (h.box[0] - 6) * c.s, top: h.box[1] * c.s, width: (h.box[2] + 12) * c.s * interpolate(t, [h.t, h.t + 0.3], [0, 1], CL), height: h.box[3] * c.s, background: HL, mixBlendMode: 'multiply' }} />
        ) : null,
      )}
    </div>
  );
};

const MOTION_ROW = getTransition('motion-3d-pan-1-right'); // [MOTION] lib:motion-3d-pan-1-right on C5 (5 s row fitted to the slot)
const Motion3DEngine = MOTION_ROW ? (ENGINES[MOTION_ROW.engine] as React.FC<any>) : null;

const PanelReceipt: React.FC<{ c: Cover; t: number }> = ({ c, t }) => {
  // hand:kt-side-panel PAPER, RIGHT: the paper slides in (0.233 s LINEAR, x 1988 -> 947), the picture behind shifts
  // left 549 px (the paper panel's broll_reframe); the receipt sits in the panel as the dated OBJECT
  const panelLeft = interpolate(t - c.tIn, [0, 0.233], [1988, 947], CL);
  const shift = ktSidePanelShift(t, c.tIn, { texture: 'paper' });
  const r = RX[c.ref];
  const body = r ? (
    <div style={{ position: 'absolute', left: 30, top: 0, width: 913, height: 1080, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: -30, top: 0, width: 973, height: 1080 }}>
        <ReceiptView r={r} t={t} />
      </div>
    </div>
  ) : (
    // C5 (no camera of its own: the MOTION move below is the camera): the exhibit as the dated object, panel width
    <div style={{ position: 'absolute', left: 36, top: 540 - 154, width: 900, height: 309, background: '#fff', boxShadow: '0 12px 30px rgba(20,22,26,.22)' }}>
      <Img src={staticFile(`receipts/${c.ref}.png`)} style={{ width: '100%', height: '100%' }} />
    </div>
  );
  const composite = (
    <AbsoluteFill style={{ background: '#000', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, transform: `translateX(${shift.x}px)` }}>
        <CoverBody c={{ ...c, kind: c.bg!.startsWith('BR-') ? 'vid' : 'chart', ref: c.bg!, tr: 'none' }} t={t} bgMode />
      </div>
      <KtSidePanel t0={c.tIn} t1={c.tOut + 1} texture="paper" side="R" lines={[]} paperSrc={staticFile('kt/paper-crumpled.mp4')} />
      <div style={{ position: 'absolute', left: panelLeft, top: 0, width: 973, height: 1080, overflow: 'hidden' }}>{body}</div>
    </AbsoluteFill>
  );
  if (c.mo === 'motion-3d-pan-1-right' && Motion3DEngine && MOTION_ROW) {
    // [MOTION] lib:motion-3d-pan-1-right wraps the WHOLE cover for its slot (comp-build.md section 6, MOTION moves): the
    // engine gets the live cover as outClip, its clock set by a Freeze fitted to the slot (t * 5 / slot)
    const slot = c.tOut - c.tIn;
    const n = Math.round(Math.max(0, t - c.tIn) * (5 / slot) * FPS);
    return (
      <AbsoluteFill style={{ background: '#000', overflow: 'hidden' }}>
        <Sequence from={0} layout="none">
          <Freeze frame={n}>
            <Motion3DEngine from={null} to={null} outClip={() => composite} durationInFrames={150} params={MOTION_ROW.params} />
          </Freeze>
        </Sequence>
      </AbsoluteFill>
    );
  }
  return composite;
};

// ---- cards (the slide-builder's state PNGs, revealed per state on the spoken word) --------------------------------
const CS = (id: string, n: number) => `card-slides/${id}-s${n}.png`;
const CARDS: Record<string, { base: string; states: CardState[] }> = {
  'K-PROFILE-typewriter': {
    // kt-typewriter-card: paper (slide-sources/paper-crumpled-f0.png = the card's own paper), each line WIPES in left to
    // right at ~0.045 s a character on the typing sound; THE CRASH IS THE ENTRY pops (110 jiggle) on cash-register
    base: '', // the paper is the LIVE video under the layers (PaperBoil, 2026-11-01); the f0 still is retired
    states: [
      { t: 170.84, src: 'card-slides/K-PROFILE-typewriter-layer-s1.png', box: [150, 155, 306, 30], reveal: 'wipe', dur: 0.5 },
      { t: 171.54, src: 'card-slides/K-PROFILE-typewriter-layer-s2.png', box: [155, 243, 367, 47], reveal: 'wipe', dur: 0.41 },
      { t: 172.38, src: 'card-slides/K-PROFILE-typewriter-layer-s3.png', box: [150, 341, 861, 47], reveal: 'wipe', dur: 1.0 },
      { t: 173.74, src: 'card-slides/K-PROFILE-typewriter-layer-s4.png', box: [147, 439, 862, 47], reveal: 'wipe', dur: 0.99 },
      { t: 175.44, src: 'card-slides/K-PROFILE-typewriter-layer-s5.png', box: [150, 537, 931, 54], reveal: 'wipe', dur: 1.17 },
      { t: 178.66, src: 'card-slides/K-PROFILE-typewriter-layer-s6.png', box: [188, 791, 1545, 83], reveal: 'pop' }, // = s6, transparent layer
    ],
  },
  'K-20X-example': {
    base: CS('K-20X-example', 1),
    states: [
      { t: 188.88, src: CS('K-20X-example', 2), box: [301, 629, 593, 113], reveal: 'pop' }, // 50M TO 1B ON "billion"
      { t: 189.68, src: 'card-slides/K-20X-example.png', box: [963, 577, 474, 166], reveal: 'pop' }, // = s3: "= 20X" ON "20x"
    ],
  },
  'K-CALL-353': { base: CS('K-CALL-353', 1), states: [{ t: 198.08, src: 'card-slides/K-CALL-353.png', reveal: 'cut' }] }, // = s2, after the count-up (below)
  'K-CALL-550': { base: CS('K-CALL-550', 1), states: [{ t: 206.78, src: 'card-slides/K-CALL-550.png', reveal: 'cut' }] }, // = s2, after the count-up (below)
  'K-BAGS-degen-playbook': {
    base: CS('K-BAGS-degen-playbook', 1),
    states: [
      { t: 219.02, src: CS('K-BAGS-degen-playbook', 2), box: [291, 444, 1008, 159], reveal: 'pop' }, // "Pump their bags." ON "pump"
      { t: 221.12, src: 'card-slides/K-BAGS-degen-playbook.png', box: [292, 645, 649, 65], reveal: 'wipe', dur: 1.1 }, // = s3, types ON "coin"
    ],
  },
  'S1-statement-bell': {
    base: CS('S1-statement-bell', 0), // the empty matte (state 0, rendered from slide-sources with no line shown)
    states: [
      { t: 224.58, src: CS('S1-statement-bell', 1), box: [334, 253, 1252, 420], reveal: 'cut' }, // bell + NOBODY RINGS A BELL ON "Nobody"
      { t: 228.26, src: 'card-slides/S1-statement-bell.png', box: [411, 727, 1093, 104], reveal: 'fade' }, // = s2, ON "financial", silent
    ],
  },
  'S2-statement-bottoms': {
    base: CS('S2-statement-bottoms', 0),
    states: [
      { t: 239.2, src: CS('S2-statement-bottoms', 1), box: [237, 333, 1440, 89], reveal: 'cut' }, // ON "we buy"
      { t: 241.5, src: CS('S2-statement-bottoms', 2), box: [503, 488, 918, 76], reveal: 'pop' }, // PLURAL, TOGETHER ON "plural"
      { t: 242.94, src: 'card-slides/S2-statement-bottoms.png', box: [201, 599, 1531, 196], reveal: 'cut' }, // = s3 + the Discord sticker ON "Inside"
    ],
  },
};
// the money counts (EDIT-PLAN: "353X" / "550X" count up big in gold ON the word), drawn in code over the base state
// with the card's .big-num look (JetBrains Mono 700, 400 px, #8F6500), then the real state PNG takes over
const COUNTS: Record<string, { t0: number; to: number; left: number; capTop: number; end: number; pulseT?: number }> = {
  'K-CALL-353': { t0: 197.48, to: 353, left: 300, capTop: 351, end: 198.08 },
  'K-CALL-550': { t0: 206.18, to: 550, left: 305, capTop: 346, end: 206.78 },
};
const PULSES: Record<string, { t: number; box: [number, number, number, number]; src: string }> = {
  'K-CALL-550': { t: 208.0, box: [305, 346, 873, 300], src: 'card-slides/K-CALL-550.png' }, // the repeat "550x": a scale pulse
};

/** the kt-text-wall on a FREE clock: comp time minus the pauses BEFORE the wall (the three clip inserts), so it keeps scrolling
 * through the GET GREEDY beat pause at 108.91; the headline pops 1.0 s into the pause, after the riser hit (Mike 2026-11-01) */
const WALL_PRE = INSERTS.filter((p) => p.at < 105.46).reduce((acc, p) => acc + p.dur, 0);
const WallCard: React.FC = () => <TextWall t0={105.46} headT={109.91} tFree={useAbs() / FPS - WALL_PRE} />;
// kt-typewriter-card on the LIVE crumpled paper (Mike 2026-11-01: the 2023 paper moves, it boils every ~12 frames): the
// theme's paper-crumpled.mp4 at the list card's 306 percent under transparent text layers (slide-builder layer renders)
const PaperBoil: React.FC<{ t0: number }> = ({ t0 }) => {
  const t = useSrc();
  const sec = Math.max(0, t - t0) % 32.3;
  return <VidFrame src="kt/paper-crumpled.mp4" frame={sec * FPS} style={{ position: 'absolute', left: -19, top: -11, width: 1958, height: 1102, objectFit: 'cover' }} />;
};
const CardEl: React.FC<{ c: Cover }> = ({ c }) => {
  if (c.ref === 'K-WALL-get-greedy') return <WallCard />;
  const cfg = CARDS[c.ref];
  const count = COUNTS[c.ref];
  const pulse = PULSES[c.ref];
  return (
    <CardStates
      base={cfg.base}
      states={cfg.states}
      under={c.ref === 'K-PROFILE-typewriter' ? <PaperBoil t0={c.tIn} /> : undefined}
      overlay={(t) => (
        <>
          {count && t >= count.t0 && t < count.end && (
            <CountUpNumber t={t} t0={count.t0} to={count.to} suffix="X" left={count.left} capTop={count.capTop} fontSize={400} />
          )}
          {pulse && t >= pulse.t && t < pulse.t + 0.3 && (
            <div style={{ position: 'absolute', inset: 0, transformOrigin: `${pulse.box[0] + pulse.box[2] / 2}px ${pulse.box[1] + pulse.box[3] / 2}px`, transform: `scale(${1 + 0.06 * Math.sin(Math.PI * interpolate(t, [pulse.t, pulse.t + 0.3], [0, 1], CL))})` }}>
              <div style={{ position: 'absolute', left: pulse.box[0] - 10, top: pulse.box[1] - 10, width: pulse.box[2] + 20, height: pulse.box[3] + 20, overflow: 'hidden' }}>
                <Img src={staticFile(pulse.src)} style={{ position: 'absolute', left: -(pulse.box[0] - 10), top: -(pulse.box[1] - 10), width: 1920, height: 1080 }} />
              </div>
            </div>
          )}
        </>
      )}
    />
  );
};

// ---- the cover element ------------------------------------------------------------------------------------------
const CLIP_FRAMES: Record<string, number> = Object.fromEntries(CLIPS.map((c) => [c.ref, c.frames]));
const ClipStill: React.FC<{ ref_: string; edge: string }> = ({ ref_, edge }) => (
  <VidFrame src={`clip-inserts/${ref_}.mp4`} frame={edge === 'first' ? 0 : CLIP_FRAMES[ref_] - 1} />
);

const CoverBody: React.FC<{ c: Cover; t: number; bgMode?: boolean }> = ({ c, t, bgMode }) => {
  if (c.kind === 'chart') {
    if (c.ref === 'C4') return <C4Ladder />;
    if (c.ref === 'C13') return <C13Multiples />;
    if (c.ref === 'C16') return <C16Venture />;
  }
  if (c.kind === 'vid') {
    // under a panel BR-3 holds its last frame (EDIT-PLAN 0:18.6), BR-5 keeps moving (ping-pong) behind the long C6 panel
    const anchor = COVERS.find((x) => x.ref === c.ref && x.kind === 'vid')!.tIn;
    const e = Math.round((t - anchor) * FPS);
    const mode = bgMode && c.ref === 'BR-5-bank-protest-signs' ? 'pingpong' : 'hold';
    return <VidFrame src={`vid/${c.ref}.mp4`} frame={brollFrame(c.ref, e, mode)} rate={rateOf(c.ref)} />;
  }
  if (c.kind === 'clipstill') return <ClipStill ref_={c.ref} edge={c.edge ?? 'first'} />;
  if (c.kind === 'card') return <CardEl c={c} />;
  if (c.kind === 'receipt') {
    if (c.bg) return <PanelReceipt c={c} t={t} />;
    const r = RX[c.ref];
    return (
      <AbsoluteFill style={{ background: '#fff', overflow: 'hidden' }}>
        <ReceiptView r={r} t={t} />
        {c.scrim && <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,.42) 55%, rgba(0,0,0,.15) 100%)' }} />}
      </AbsoluteFill>
    );
  }
  return null;
};

/** A cover as it airs at the current frame (reads the absolute clock: safe inside any engine nesting). */
const CoverNode: React.FC<{ c: Cover }> = ({ c }) => {
  const t = useSrc();
  return (
    <AbsoluteFill style={{ background: '#000', overflow: 'hidden' }}>
      <CoverBody c={c} t={t} />
    </AbsoluteFill>
  );
};

const CoverIngress: React.FC<{ c: Cover }> = ({ c }) => {
  const t = useSrc();
  const d = t - c.tIn;
  const node = <CoverNode c={c} />;
  if (c.tr === 'whip') return <KtWhipCut t0={c.tIn} lens={WHIP_LENS} motionBlur={WHIP_BLUR}>{node}</KtWhipCut>;
  if (c.tr === 'fade') return <AbsoluteFill style={{ opacity: interpolate(d, [0, 0.5], [0, 1], CL) }}>{node}</AbsoluteFill>;
  if (c.tr === 'xfade') {
    const p = interpolate(d, [0, 0.35], [0, 1], { ...CL, easing: Easing.out(Easing.quad) });
    return <AbsoluteFill style={{ opacity: p, transform: `scale(${0.93 + 0.07 * p})` }}>{node}</AbsoluteFill>;
  }
  if (c.tr === 'push-top') return <AbsoluteFill style={{ transform: `translateY(${-0.683 * 1080 * (1 - pushProgress(d))}px)` }}>{node}</AbsoluteFill>;
  if (c.tr === 'push-left') return <AbsoluteFill style={{ transform: `translateX(${-0.847 * 1920 * (1 - pushProgress(d))}px)` }}>{node}</AbsoluteFill>;
  return node; // panel (its own entrance) / melt / spin (the TransitionClip overlay owns the cut) / cut / none
};

const CoverTrack: React.FC = () => (
  <>
    {COVERS.map((c, i) => {
      const next = COVERS[i + 1];
      const tail = next && Math.abs(next.tIn - c.tOut) < 0.01 ? Math.round((INGRESS_SEC[next.tr] ?? 0) * FPS) : 0;
      const from = F(c.tIn);
      return (
        <Sequence key={i} from={from} durationInFrames={FO(c.tOut) - from + tail} layout="none">
          <CoverIngress c={c} />
        </Sequence>
      );
    })}
  </>
);

/** kt-push-slide EXITS (0.1 s, drawn above the next picture): 0:28.8 C22 out RIGHT onto F2 · 1:45.5 the CLIP-1 lead-out
 * still out DOWN onto the K-WALL · 3:00.5 K-PROFILE out RIGHT onto F7 */
const ExitPushes: React.FC = () => (
  <>
    {COVERS.filter((c) => c.out).map((c, i) => (
      <Sequence key={i} from={FO(c.tOut)} durationInFrames={3} layout="none">
        <ExitNode c={c} />
      </Sequence>
    ))}
  </>
);
const ExitNode: React.FC<{ c: Cover }> = ({ c }) => {
  const t = useSrc();
  const p = pushProgress(t - c.tOut + 1 / FPS);
  const tr = c.out === 'push-down' ? `translateY(${1.003 * 1080 * p}px)` : `translateX(${0.962 * 1920 * p}px)`;
  return <AbsoluteFill style={{ transform: tr }}><CoverNode c={c} /></AbsoluteFill>;
};

// =====================================================================================================================
// 5. THE LIBRARY TRANSITIONS (section 6a: each TransitionClip in a Sequence of EXACTLY its engine window, sfx off: the
// SFX are the post-mix; every face-side node is the SpineFace freeze, muted, same transform, same source)
// =====================================================================================================================
const coverOf = (ref: string, tIn: number) => COVERS.find((c) => c.ref === ref && Math.abs(c.tIn - tIn) < 0.01)!;
// CUTFRAME stills (section 6a cost trap / the image-only MeltEquidistant): the exact frames either side of the window,
// rendered from this comp (transitions/cutframes/), and BR-11's cut frame (clip 3.624 s) for the spin out of video
const LIB: { id: string; t: number; win: number; out: () => React.ReactNode; inn: () => React.ReactNode; fromSrc?: string; toSrc?: string }[] = [
  {
    id: 'melt-equidistant-short-1', // 1:14.5 MELT = TRANSFORM: C6 panel liquefies and reforms into C4 with its BofA rung
    t: 74.48,
    win: 13,
    out: () => <CoverNode c={coverOf('C6-sec-bofa', 66.64)} />,
    inn: () => <CoverNode c={coverOf('C4', 74.48)} />,
    fromSrc: 'transitions/cutframes/melt-74.48-from.png',
    toSrc: 'transitions/cutframes/melt-74.48-to.png',
  },
  {
    id: 'spin-center-ease-short-cw', // 1:57.2 SPIN = NEW FACET: the BTC receipt turns into the multiples board
    t: 117.18,
    win: 13,
    out: () => <CoverNode c={coverOf('C14-btc-1w', 108.92)} />,
    inn: () => <CoverNode c={coverOf('C13', 117.18)} />,
  },
  {
    id: 'spin-center-ease-short-ccw', // 2:34.6 SPIN = NEW FACET: CH4's venture board turns in off the gold coins
    t: 154.62,
    win: 13,
    out: () => <Img src={staticFile('transitions/cutframes/BR-11-cut.jpg')} style={fill} />,
    inn: () => <CoverNode c={coverOf('C16', 154.62)} />,
  },
];
const LibTransitions: React.FC = () => (
  <>
    {LIB.map((x) => {
      const half = Math.round(x.win / 2);
      return (
        <Sequence key={x.id} from={F(x.t) - half} durationInFrames={x.win} layout="none">
          <TransitionClip id={x.id} cutFrame={half} sfx={false} outgoing={x.out} incoming={x.inn} fromSrc={x.fromSrc} toSrc={x.toSrc} />
        </Sequence>
      );
    })}
  </>
);
// PUNCH-LEAK: lib:lightleaks-soft-short-6 (TRANSITIONS.md face_leak set, leak 1) peaking ON the join frame J = F(274.600):
// the 0.4 s engine swaps at 0.4 of its window (local frame 5), so the window starts 5 frames before J; A = the spine
// un-punched, B = the spine punched (the continuous spine is both sides; the join is already in it)
const LEAK = { id: 'lightleaks-soft-short-6', t: 274.600, win: 12, swapAt: 5 };
const PunchLeak: React.FC = () => (
  <Sequence from={F(LEAK.t) - LEAK.swapAt} durationInFrames={LEAK.win} layout="none">
    <TransitionClip id={LEAK.id} cutFrame={LEAK.win / 2} sfx={false} outgoing={() => <SpineLive punch={punchAt(LEAK.t - 0.05)} />} incoming={() => <SpineLive punch={punchAt(LEAK.t)} />} />
  </Sequence>
);

// =====================================================================================================================
// 6. THE CLIP INSERTS (section 3d): over each paused window the clip plays FULL-FRAME and MUTED (its voice is in the VO),
// insert-in / insert-out hand:fade 0.5 s (CLIP-7: hand:cut both edges); under the fades sit the lead-in still (the
// clip's first frame) and the lead-out still (its last frame), so a fade never dips to the frozen black spine
// =====================================================================================================================
const ClipInserts: React.FC = () => (
  <>
    {CLIPS.map((cl, i) => {
      // every pause BEFORE this clip, by TIME, not by list index: the GET GREEDY beat pause sits in INSERTS but not in CLIPS,
      // and the index form placed CLIP-7 1.5 s early over the face with a frozen tail (lets-get-rich FINAL, 2026-11-01)
      const before = INSERTS.filter((p) => p.at < cl.at).reduce((s, p) => s + p.dur, 0);
      const from = Math.round((cl.at + before) * FPS);
      return (
        <Sequence key={cl.ref} from={from} durationInFrames={cl.frames} layout="none">
          <ClipInsert cl={cl} />
        </Sequence>
      );
    })}
  </>
);
const ClipInsert: React.FC<{ cl: (typeof CLIPS)[number] }> = ({ cl }) => {
  const f = useCurrentFrame(); // this Sequence is never handed to an engine
  const fadeF = cl.fade * FPS;
  const op = fadeF ? Math.min(interpolate(f, [0, fadeF], [0, 1], CL), interpolate(f, [cl.frames - fadeF, cl.frames - 1], [1, 0], CL)) : 1;
  const firstHalf = f < cl.frames / 2;
  return (
    <AbsoluteFill>
      {fadeF > 0 && (firstHalf ? cl.leadIn && <ClipStill ref_={cl.ref} edge="first" /> : <ClipStill ref_={cl.ref} edge="last" />)}
      <AbsoluteFill style={{ opacity: op }}>
        <VidFrame src={`clip-inserts/${cl.ref}.mp4`} frame={f} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// =====================================================================================================================
// 7. KINETIC TEXT (the EFFECTS library, theme kinetic-text-2023; overlays.md section 2): above the covers, below the
// captions; gold accent, Montserrat ExtraBold Italic. Their [WHOOSH] / [ACCENT] sounds are the post-mix, never here.
// =====================================================================================================================
const KT_FONT = { font: F_KT, accent: GOLD };
/** while the C12 paper panel holds the right half (0:20.4-0:22.6) the stack rides the footage's shift into the free
 * left half (the panel's own 0.267 s linear reframe), and returns as C21 takes the full frame */
const stackShift = (t: number) => {
  const u = interpolate(t, [20.413, 20.68], [0, 1], CL) - interpolate(t, [22.62, 22.887], [0, 1], CL);
  return `translateX(${-486 * u}px) scale(${1 - 0.42 * u})`;
};
const Devices: React.FC = () => {
  const t = useSrc();
  return (
    <>
      {/* 0:07.3-0:28.8 kt-stacked-list-over-broll BLOOD IN THE STREETS; pushes out RIGHT with C22 onto F2 (hand:kt-push-slide) */}
      <AbsoluteFill style={{ transformOrigin: '960px 470px', transform: stackShift(t) }}>
        <StackedList
          t0={7.32}
          t1={28.8 + 0.1}
          exitT={28.8}
          exitDir="right"
          rows={[
            { t: 7.32, text: '*BLOOD* IN THE STREETS', kind: 'head', y: 235, caps: 80 },
            { t: 10.44, text: '6.3B GONE FROM BINANCE', kind: 'item', y: 400, caps: 60 },
            { t: 16.88, text: 'AFTER BYBIT 1.5B AND BITGET 388M', kind: 'sub', y: 478, caps: 40 },
            { t: 19.28, text: '5 OF THE MAGNIFICENT 7 CRACKED', kind: 'item', y: 572, caps: 60 },
            { t: 27.08, text: 'CRYPTO -40% FROM THE TOP', kind: 'item', y: 672, caps: 60 },
          ]}
        />
      </AbsoluteFill>
      {/* 0:28.8-0:35.9 MONEY BAG icon slides in beside the head (kt-icon-pop, rides the push's whoosh) */}
      <KtIconPop t0={28.8} t1={35.867} preset="gauge-right" icon={<MoneyBag />} />
      {/* 0:35.0 the TITLE POP (kt-caption-highlight two-colour variant): LET'S GET / RICH, caps 80 px at 77.5 percent */}
      <KtKeywordPop t0={34.98} t1={35.867} lines={["LET'S GET", '*RICH*']} y={0.775 * 1080} textColor="#FFFFFF" {...KT_FONT} />
      {/* 1:33.9 kt-headline-over-broll THE CRASH / IS THE DISCOUNT (0.8 s after the BR-6 whip) */}
      <KtHeadlineOverBroll t0={93.9} t1={95.7} lines={['THE CRASH', 'IS THE *DISCOUNT*']} {...KT_FONT} />
      {/* 2:10.2 kt-keyword-pop EVERY / SINGLE ONE at 79 percent (replaces the caption) */}
      <KtKeywordPop t0={130.22} t1={131.7} lines={['*EVERY*', 'SINGLE ONE']} textColor="#FFFFFF" {...KT_FONT} />
      {/* 2:11.7-2:14.5 DISCORD sticker cut in with BR-7 (kt-icon-pop sticker variant, hard cut) */}
      <StickerAt t0={131.7} t1={134.52} x={1480} y={560} size={300}>
        <DiscordSticker />
      </StickerAt>
      {/* 2:15.3 kt-headline-over-broll WE BUY / THE BOTTOMS, replaced ON "100x" by MULTIPLE / 100X PLAYS */}
      <KtHeadlineOverBroll t0={135.32} t1={138.7} lines={['WE BUY', 'THE *BOTTOMS*']} {...KT_FONT} />
      <KtHeadlineOverBroll t0={138.7} t1={139.9} lines={['MULTIPLE', '*100X* PLAYS']} {...KT_FONT} />
      {/* 2:20.8 kt-keyword-pop 353X, big gold (his posted figure, no ticker) */}
      <KtKeywordPop t0={140.76} t1={143.14} lines={['353X']} fontSize={230} linePitch={220} y={0.77 * 1080} {...KT_FONT} />
      {/* 2:25.0 kt-stacked-list-over-broll, no headline: 353X / 85X / 58X on BR-10, to the chapter whip */}
      <StackedList
        t0={145.04}
        t1={148.467}
        rows={[
          { t: 145.04, text: '353X', kind: 'item', y: 330, caps: 130 },
          { t: 146.28, text: '85X', kind: 'item', y: 540, caps: 130 },
          { t: 147.64, text: '58X', kind: 'item', y: 750, caps: 130 },
        ]}
      />
      {/* 2:29.4 kt-lower-third-band WHAT WE ARE BUYING NOW -> text_swap THE PROFILE, NOT THE NAMES ON "Discord" */}
      <KtLowerThirdBand t0={BAND.t0} t1={BAND.t1} lines={['WHAT WE ARE *BUYING NOW*']} swaps={[{ t: BAND.swap, lines: ['THE PROFILE,', 'NOT THE *NAMES*'] }]} textureSrc={staticFile('kt/animated-texture.mp4')} {...KT_FONT} />
      {/* 3:02.6 kt-keyword-pop COULD GO INTO / THE BILLIONS ON "billion." */}
      <KtKeywordPop t0={182.64} t1={183.067} lines={['COULD GO INTO', 'THE *BILLIONS*']} textColor="#FFFFFF" {...KT_FONT} />
      {/* 3:21.1-3:24.3 MYX FINANCE logo slides in from the LEFT over BR-14's sky ON "MYX" (kt-icon-pop, its whoosh-4; Mike 2026-11-01) */}
      <KtIconPop t0={201.14} t1={204.3} preset="rocket-left" src={staticFile('img/logos/myx.png')} w={280} h={280} />
      {/* 3:04.9 kt-stacked-list-over-broll headline EVERYTHING MULTIPLIES over BR-12 (carried into K-20X's headline) */}
      <StackedList t0={184.94} t1={186.0} rows={[{ t: 184.94, text: 'EVERYTHING *MULTIPLIES*', kind: 'head', y: 300 }]} />
      {/* 4:04.3-4:10.9 MONEY BAG returns beside the head (rides the chapter whip) */}
      <KtIconPop t0={244.333} t1={250.867} preset="gauge-right" icon={<MoneyBag />} />
      {/* 4:05.4 kt-word-by-word IF YOU EVER WANTED / TO INVEST LIKE BUFFETT -> payoff NOW (gold, glow), held to "So" */}
      <KtWordByWord t0={245.42} t1={250.867} phrases={[{ t: 245.42, text: 'IF YOU EVER WANTED' }, { t: 246.54, text: 'TO INVEST LIKE BUFFETT' }]} payoff={{ t: 249.7, text: 'NOW' }} payoffColor={GOLD} {...KT_FONT} />
      {/* 4:10.9-4:15.5 DISCORD sticker beside the head (hard cut in with the phrase) */}
      <StickerAt t0={250.867} t1={255.493} x={1540} y={400} size={240}>
        <DiscordSticker />
      </StickerAt>
      {/* 4:29.7 COMMENT / BELOW two-colour pop (kt-caption-highlight pop variant) */}
      <KtKeywordPop t0={269.713} t1={270.533} lines={['COMMENT *BELOW*']} y={0.775 * 1080} textColor="#FFFFFF" {...KT_FONT} />
      {/* 4:30.5 kt-subscribe-close bar: SUBSCRIBE click ON "Subscribe", like click ON "like", drops away ON "Holy" */}
      <SubscribeBar t0={270.533} subT={270.833} likeT={273.613} dropT={274.333} />
      {/* kt-keyword-sparkle: DISCOUNT (33.82 / 34.22) and GREATEST (253.933 / 254.333), on the key word's last letter */}
      {SPARKLES.map((s, i) => {
        const p = captionWordEnd(s.text, s.word);
        return <Sparkle key={i} t={t} t0={s.t} x={p.x + 6} y={p.y + 4} />;
      })}
    </>
  );
};
const SPARKLES = [
  { t: 33.82, text: 'AND THAT IS THE *DISCOUNT*', word: 'DISCOUNT' },
  { t: 34.22, text: 'AND THAT IS THE *DISCOUNT*', word: 'DISCOUNT' },
  { t: 253.933, text: 'FOR THE *GREATEST* COMMUNITY EVER', word: 'GREATEST' },
  { t: 254.333, text: 'FOR THE *GREATEST* COMMUNITY EVER', word: 'GREATEST' },
];

// =====================================================================================================================
// 8. CAPTIONS (section 8 + the blueprint): ON over the FACE windows only, TOPMOST. On this video the caption IS the
// kt-caption-highlight device (PROJECT-LOG constraints + EDIT-PLAN: "kt-caption-highlight IS the caption, house track
// OFF"): one bottom line, Montserrat ExtraBold Italic caps, the key word gold, phrase by phrase on the first word; OFF
// for the hold of every pop / band / word-by-word / the subscribe bar. Text = the generated ZCAPTIONS words regrouped into
// the plan's phrases (checked against ZCAPTIONS below). Windows: CAPTION_WINDOWS (captions node) trimmed to the clip
// splices (105.19 / 145.04), F6 off (the band carries the line), F7 added (EDIT-PLAN 3:00.5, a FACE window < 5 s).
// =====================================================================================================================
const CAPTION_SRC: [number, number][] = [
  [0.0, 6.767],
  [28.8, 35.867],
  [95.7, 105.19],
  [126.167, 131.7],
  [139.9, 145.04],
  [180.5, 183.067],
  [244.333, 275.133],
];
const AS_RECORDED_FACE: [number, number][] = [[0.0, 6.767], [28.8, 35.867], [95.7, 105.2], [126.167, 131.7], [139.9, 145.067], [148.467, 151.6], [180.5, 183.067], [244.333, 275.133]];
CAPTION_SRC.forEach(([a, b]) => {
  if (!AS_RECORDED_FACE.some(([x, y]) => a >= x - 1e-6 && b <= y + 1e-6)) throw new Error(`caption window ${a}-${b} is not inside a FACE window`);
});
void CAPTION_WINDOWS; // the captions node's windows; CAPTION_SRC above is their plan-trimmed form (+ F7)
const KT_PHRASES: { t: number; end: number; text: string; stretch?: boolean }[] = [
  { t: 0.0, end: 2.32, text: 'THERE WAS *BLOOD* IN THE STREETS', stretch: true },
  { t: 2.32, end: 3.82, text: "AND THAT'S EXACTLY WHEN" },
  { t: 3.82, end: 4.98, text: 'WARREN *BUFFETT* BOUGHT' },
  { t: 4.98, end: 6.767, text: '*EVERY SINGLE TIME*' },
  { t: 28.8, end: 31.68, text: 'EVERYBODY IS *FEARFUL* RIGHT NOW' },
  { t: 31.68, end: 34.98, text: 'AND THAT IS THE *DISCOUNT*' },
  { t: 95.7, end: 97.72, text: 'AND IN THAT SAME INTERVIEW' },
  { t: 97.72, end: 99.26, text: 'HE GAVE THE *RULE*' },
  { t: 99.26, end: 100.94, text: 'THE RULE THAT HE HAS BEEN REPEATING' },
  { t: 100.94, end: 102.04, text: 'LIKE REPEATEDLY' },
  { t: 102.04, end: 105.19, text: 'SINCE HIS *1986* SHAREHOLDER LETTER' },
  { t: 126.167, end: 127.78, text: 'IMAGINE BUYING THE *BOTTOM*' },
  { t: 127.78, end: 130.22, text: 'OF EVERY SINGLE ONE OF THOSE' },
  { t: 139.9, end: 140.76, text: 'WE CALL THE' },
  { t: 143.14, end: 145.0, text: 'IN A *BEAR MARKET*' }, // ends INSIDE the trough before the CLIP-7 splice (145.04 flashed one frame over the clip)
  { t: 180.5, end: 182.64, text: 'KIND OF PROJECTS THAT' },
  { t: 244.333, end: 245.42, text: 'SO LET ME TELL YOU' },
  { t: 250.867, end: 253.373, text: 'SO CLICK THE *LINK* IN THE DESCRIPTION' },
  { t: 253.373, end: 255.493, text: 'FOR THE *GREATEST* COMMUNITY EVER' },
  { t: 255.493, end: 257.613, text: 'GET IN WITH LIKE-MINDED PEOPLE' },
  { t: 257.613, end: 259.193, text: 'LEARN A LOT MORE ABOUT *CRYPTO*' },
  { t: 259.193, end: 260.633, text: "IF YOU'RE A NOOB, WHY NOT?" },
  { t: 260.633, end: 261.493, text: 'NOOBS ARE *WELCOME*' },
  { t: 261.493, end: 263.413, text: 'AND WE GOT SOME ADVANCED SOFTWARE' },
  { t: 263.413, end: 266.533, text: 'IT REALLY HELPS US MAKE THOSE *BIG BUCKS*' },
  { t: 266.533, end: 269.713, text: 'THOSE CRAZY *MULTIPLIERS*, RIGHT?' },
  { t: 274.373, end: 275.133, text: 'HOLY CRAP, DUDE.' },
];
{
  // every caption word must be a word the captions node generated (no retyped words)
  const z = new Set(ZCAPTIONS.flatMap((c) => c.h.toUpperCase().replace(/[^A-Z0-9'\- ]/g, ' ').split(/\s+/)).filter(Boolean));
  const miss = KT_PHRASES.flatMap((p) => p.text.replace(/\*/g, '').replace(/[^A-Z0-9'\- ]/g, ' ').split(/\s+/).filter((w) => w && !z.has(w)));
  const allowed = new Set(['THERE', 'WAS', 'BLOOD', 'IN', 'THE', 'STREETS', 'EVERYBODY', 'IS', 'KIND', 'OF', 'PROJECTS', 'THAT', 'COULD', 'SO', 'LET', 'ME', 'TELL', 'YOU', 'WE', 'CALL', '353X', 'IT', 'MAKE', 'US', 'LIKE-MINDED', 'MINDED']);
  const bad = miss.filter((w) => !allowed.has(w));
  if (bad.length) throw new Error('caption words not in ZCAPTIONS: ' + bad.join(', '));
}
const Captions: React.FC = () => {
  const t = useSrc();
  if (!CAPTION_SRC.some(([a, b]) => t >= a && t < b)) return null;
  const cur = KT_PHRASES.find((p) => t >= p.t && t < p.end);
  if (!cur) return null;
  return <KtCaptionLine text={cur.text} t={t} t0={cur.t} stretch={cur.stretch} />;
};

// =====================================================================================================================
// 9. THE COMPOSITION
// =====================================================================================================================
// inputProps (longform-to-short.md 16:9-SOURCED MODE): `captions: false` renders the picture WITHOUT the burned caption line
// and `pops: false` WITHOUT the kinetic-text layer (Devices: pops, stacked list, icon pops, stickers), whose 1920-wide text a
// 608 px 9:16 slice would cut; the short draws its own captions (and any pop natively). Default true = the delivered longform.
export const LetsGetRich: React.FC<{ captions?: boolean; pops?: boolean }> = ({ captions = true, pops = true }) => {
  const f = useCurrentFrame();
  const t = srcAt(f);
  return (
    <AbsFrame.Provider value={f}>
      <KtClock.Provider value={{ t }}>
        <AbsoluteFill style={{ background: '#000' }}>
          {/* the VO: the paused spine's own audio (clip-insert voices baked in); every picture copy is muted */}
          <Audio src={staticFile('spine.mp4')} />
          {/* digital-SILENCE pad under the last 2 s: the paused spine's audio stream ends 52 ms before its picture (315.148 vs
              315.2 s), which left the render's audio short of its frames (chunked-render's audio-length check). No sound added. */}
          <Sequence from={DUR - 60} durationInFrames={60} layout="none">
            <Audio src={staticFile('kt/silence-pad-2s.wav')} />
          </Sequence>
          <SpineLayer />
          <PunchLeak />
          <CoverTrack />
          <ExitPushes />
          <LibTransitions />
          {pops && <Devices />}
          <ClipInserts />
          {captions && <Captions />}
        </AbsoluteFill>
      </KtClock.Provider>
    </AbsFrame.Provider>
  );
};
// the ingress progress helper is shared with the charts (prog) and the pop (pop110); referenced so the bundler keeps
// their types honest in this file
void prog;
void pop110;

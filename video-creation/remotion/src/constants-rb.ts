import { staticFile } from 'remotion';
import type { BrollEv, Sfx } from './_kit';
import type { BadgeEv, ThumbDef } from './LivestreamShort';

// ─── rally-basket-ninehood-cashcat (batch: October-pumps, clip #4, variant: full) ──────────────
// "Some Of These Things Could Run" — the rally basket: throw something into these because if they
// start running, RAT is a good math-theory play down at a million, NineHood is bouncing in its
// 240-360 range and probably goes to 20 million in a rally (same team as BOMO on Base, which ran
// 10 million), the community already did a 350x on LAB in a bear market a couple of months ago,
// and Cash Cat is consolidated in range, waiting for a rally, the primary candidate if Robinhood
// ever lists any memes.
//
// Base clip: rally-basket-ninehood-cashcat-final.mp4 (raw cut -> Phase 5 tighten -> 5B desilence ->
// 5C filler removal). ALREADY composited vertical (screen-share on top, webcam below), 1080x1920 @
// 25 fps, 64.622 s. FINAL, do NOT re-cut and do NOT re-split the zones. The comp runs at 30 fps;
// OffthreadVideo resamples the 25 fps source by TIME, so every cue below is plain seconds taken
// from the clip's own caption onsets (clip-relative, 0-based).
//
// Render (public-dir = the CLIP's render-assets/, which holds the spine + thumbnail + b-roll + sfx):
//   npx remotion render src/index.ts RallyBasketNinehoodCashcat \
//     out/October-pumps/4-rally-basket-ninehood-cashcat.mp4 \
//     --public-dir "<repo>/video-creation/shorts/October-pumps/rally-basket-ninehood-cashcat/render-assets"

export const RB_FPS = 30;
export const RB_DURATION = 1938; // 64.600 s @30, just inside the 64.622 s clip (no black tail frame)

export const CLIP_RB  = staticFile('rally-basket-ninehood-cashcat-final.mp4');
export const THUMB_RB = staticFile('thumbnail-rb.png');

// Layout geometry, MEASURED on this clip (row-mean gradient scan at t=2/12/25/38/50/62 s; all six
// frames put the hard screen-share/webcam divider on the same row, gradient 204-216 grey levels
// there vs 16 for the next strongest edge).
export const RB_SEAM  = 854; // content zone = 0..854 (DexScreener charts); webcam plays below
export const RB_CAP_Y = 890; // caption centre: below the seam, above his hairline, never his eyes

// ─── B-roll beats (authored in BROLL-PLAN.md BEFORE generation) ────────────────────────────────
// Coverage budget (SKILL "B-roll coverage budget", HALVED 2026-07-14):
//   20.00 s covered / 64.62 s = 30.9 % b-roll, 44.62 s = 69.1 % BASE SHOWING. Targets ~30 % / ~70 %
//   (bands 25-35 % / 65-75 %) => on target. 8 distinct images, zero reuse inside the clip.
// 3 full-screens ONLY (hook / the "could run" turn / the LAB 350x climax) = the FIRM 1-3 cap. They
// are 7.8 s and 29.1 s apart, so no full->full base flash exists.
// The screen-share is the RECEIPT of this clip and is left showing for 69 % of it: DexScreener
// market-cap charts of the exact coin he is naming run 0.00-12.88 (HOODRAT), 12.88-47.48 (NINEHOOD)
// and 48.04-64.62 (CASHCAT), plus the real community-gains strip flashing at 47.48-48.04. The only
// OFF-MESSAGE window is 35.8-47.5 (NineHood chart still up while he talks rally / community / LAB),
// and that window carries the rally cutaway and the LAB climax.
// staticFile() calls are LITERAL strings on purpose — the finalized-short gate scans for literal refs.
export const BROLL_RB: BrollEv[] = [
  // BASE 0.00-1.30 — open on Mike + the HOODRAT chart (the frame-0 thumb is ONE frame; base from frame 1)
  { src: staticFile('broll-rb-hook.png'),           tIn:  1.30, tOut:  3.90, mode: 'full'    }, // HOOK: "just throw something into some of these because IF THEY START RUNNING" ("they start running" 2.08)
  // BASE 3.90-11.70 (7.80 s) — "rat is a pretty good play... math theory play... down to one million right now, just hit a million, probably going under a million any minute" (the HOODRAT mcap chart IS the visual)
  { src: staticFile('broll-rb-could-run.png'),      tIn: 11.70, tOut: 14.10, mode: 'full'    }, // MAJOR TRANSITION: "so SOME OF THESE THINGS COULD RUN" (12.28), the title line; the screen-share swaps HOODRAT -> NINEHOOD at 12.88 underneath it
  // BASE 14.10-30.40 (16.30 s) — "ninehood is one of the ones i like, bouncing around in this range between 240 to 360... what if we get a new bottom and things start running in a few months" (the NINEHOOD chart IS the range + 2 badges)
  { src: staticFile('broll-rb-twenty-million.png'), tIn: 30.40, tOut: 32.70, mode: 'content' }, // "no, it's probably going to GO TO 20 MILLION" ("go to 20" 31.28)
  { src: staticFile('broll-rb-same-team.png'),      tIn: 32.70, tOut: 35.10, mode: 'content' }, // "SAME TEAM has BOMO on base, which RAN 10 MILLION" (34.96) — butt-joined above, so it HARD-CUTS
  // BASE 35.10-37.40 (2.30 s) — "so let's get a"
  { src: staticFile('broll-rb-rally.png'),          tIn: 37.40, tOut: 39.80, mode: 'content' }, // "RALLY, the good things happen in A RALLY"
  // BASE 39.80-43.20 (3.40 s) — "in my community we do some hundred x's in a rally or more, right, even do"
  { src: staticFile('broll-rb-lab-350x.png'),       tIn: 43.20, tOut: 46.50, mode: 'full'    }, // CLIMAX / RECEIPT: "a 350X in a bear MARKET WITH LAB" (43.20/44.78) — the ONLY beat with a real logo, generated WITH schedule-tweets/images/reference/LAB.png
  // BASE 46.50-52.80 (6.30 s) — "just a couple months ago, crazy right. definitely cash cat, it's really consolidated right here in this range" (community-gains strip 47.48-48.04, then the CASHCAT chart + badge)
  { src: staticFile('broll-rb-coiled.png'),         tIn: 52.80, tOut: 55.00, mode: 'content' }, // "i think it's just WAITING FOR A RALLY just like all the others"
  // BASE 55.00-59.40 (4.40 s) — "right now, when it comes to robinhood, yeah i think if they are going to"
  { src: staticFile('broll-rb-app-listing.png'),    tIn: 59.40, tOut: 61.80, mode: 'content' }, // "LIST ANY MEMES in their robinhood app" (59.64/61.36)
  // BASE 61.80-64.62 (2.82 s) — "this is probably going to be the primary candidate", closing on the
  // CASHCAT chart, exactly the coin he names (+ the FIRST IN LINE badge)
];

// ─── Badges (code-drawn text, content zone y300) ────────────────────────────────────────────────
// Every badge sits over a BASE stretch (never over a b-roll beat), no two share a time window
// (gaps 5.8 s / 20.6 s / 11.1 s), they live at y300 while captions live at y890, and all start long
// after the frame-0 thumb. Each states something the captions do NOT. Robinhood-chain coins use
// neon green / yellow, never Kaspa teal.
export const BADGES_RB: BadgeEv[] = [
  { tIn: 16.60, tOut: 19.40, color: '#39ff14', line1: 'RANGE BOUND',  sub: 'BOUNCING, NOT BLEEDING OUT',   top: 300 },
  { tIn: 25.20, tOut: 28.00, color: '#ffe600', line1: 'IF THE RALLY', line2: 'COMES', sub: 'THE WHOLE BASKET RUNS', top: 300 },
  { tIn: 48.60, tOut: 51.20, color: '#39ff14', line1: 'CASH CAT',     sub: 'COILED IN THE RANGE',          top: 300 },
  { tIn: 62.30, tOut: 64.40, color: '#ffe600', line1: 'FIRST IN LINE', sub: 'IF THE APP LISTS MEMES',      top: 300 },
];

// ─── Frame-0 thumbnail (IG/TikTok cover) ────────────────────────────────────────────────────────
// ONE frame only (LivestreamShort defaults thumb.durS to 1/fps) — generated background art with the
// hook title drawn in CODE on top, never baked into the image. No em dashes.
export const THUMB_DEF_RB: ThumbDef = {
  img: THUMB_RB,
  title: 'SOME OF THESE\nTHINGS\nCOULD RUN',
  chip: 'THE RALLY BASKET',
  chipColor: '#39ff14',
  titleSize: 116,
};

// ─── SFX (shared library, COPIED into render-assets/sfx/; every event stays under the VO) ───────
// Whoosh on the thumbnail cut and on every b-roll transition that matters; one riser BUILDS INTO
// the climax impact; impacts are reserved for the beats that carry the clip and the kaching is
// reserved for the 350x LAB receipt (per Impacts/WHEN-TO-USE-IMPACTS.md).
//
// ⚠ Cue points are each SFX's own MEASURED peak/attack position, not its file start. Envelopes
//   measured on this machine for THIS build (0.2 s RMS, mono 8 kHz): transition_rapid_whoosh peaks
//   0.11 s in - Cinematic Whoosh 02 0.74 s - Cinematic Whoosh 06 0.50 s (quiet, rms 0.110) -
//   Impact_3 attacks 0.11 s - Impact_Hit_01-2 peaks 0.13 s - Soundjay_Impact_Main_01 0.18 s (loud,
//   rms 0.678) - Boom - Big Reveal 0.02 s (loud, rms 0.761) - TING 0.70 s - Cash Register Kaching HD
//   attacks 0.39 s (very quiet, rms 0.058) - Edgy_Riser peaks 4.95 s - ding/sudden-shock 0.15 s.
//   Each cue below is therefore started EARLY by exactly that offset so the crest lands on the beat
//   it punctuates, and quiet FILES get a higher vol so they are actually audible under the VO.
export const SFX_RB: Sfx[] = [
  { t:  0.00, src: staticFile('sfx/transition_rapid_whoosh.mp3'),             vol: 0.46, dur: 1.00 }, // frame-0 thumbnail cut
  { t:  0.56, src: staticFile('sfx/Cinematic Whoosh 02.wav'),                 vol: 0.52, dur: 2.20 }, // sweeps INTO the HOOK full-screen (crest 1.30 = the cut)
  { t:  1.97, src: staticFile('sfx/Impacts/Impact_3.wav'),                    vol: 0.40, dur: 2.20 }, // lands on "they start running" (2.08)
  { t: 11.20, src: staticFile('sfx/Cinematic Whoosh 06.wav'),                 vol: 0.80, dur: 2.10 }, // the cut to the "could run" full-screen (11.70)
  { t: 12.26, src: staticFile('sfx/Boom - Big Reveal.wav'),                   vol: 0.42, dur: 3.00 }, // lands on "things could run" (12.28), the title line
  { t: 30.29, src: staticFile('sfx/transition_rapid_whoosh.mp3'),             vol: 0.40, dur: 1.00 }, // into the 20-million cutaway (30.40)
  { t: 30.90, src: staticFile('sfx/TING SOUND EFFECT.mp3'),                   vol: 0.48, dur: 2.00 }, // bell on "go to 20" (31.28-31.60)
  { t: 32.59, src: staticFile('sfx/transition_rapid_whoosh.mp3'),             vol: 0.38, dur: 1.00 }, // the hard cut into the same-team cutaway (32.70)
  { t: 34.83, src: staticFile('sfx/Impacts/Impact_Hit_01-2.wav'),             vol: 0.42, dur: 2.40 }, // lands on "ran 10 million" (34.96)
  { t: 36.66, src: staticFile('sfx/Cinematic Whoosh 02.wav'),                 vol: 0.48, dur: 2.20 }, // into the rally cutaway (37.40)
  { t: 38.25, src: staticFile('sfx/risers/Edgy_Riser.wav'),                   vol: 0.26, dur: 5.10 }, // riser BUILDS INTO the LAB climax (crest 43.20)
  { t: 43.02, src: staticFile('sfx/Impacts/Soundjay_Impact_Main_01.wav'),     vol: 0.34, dur: 2.50 }, // the cut to the LAB 350x full-screen (43.20)
  { t: 43.15, src: staticFile('sfx/Cash Register Kaching  Sound Effect HD.mp3'), vol: 0.95, dur: 3.10 }, // KACHING on the 350x LAB receipt (attack 43.54)
  { t: 47.15, src: staticFile('sfx/ding/sudden-shock.mp3'),                   vol: 0.36, dur: 1.85 }, // lands on "crazy right" (47.30)
  { t: 52.69, src: staticFile('sfx/transition_rapid_whoosh.mp3'),             vol: 0.38, dur: 1.00 }, // into the coiled-spring cutaway (52.80)
  { t: 58.90, src: staticFile('sfx/Cinematic Whoosh 06.wav'),                 vol: 0.76, dur: 2.10 }, // into the app-listing cutaway (59.40)
  { t: 62.78, src: staticFile('sfx/TING SOUND EFFECT.mp3'),                   vol: 0.48, dur: 2.00 }, // the "primary candidate" close (63.48)
];

import { staticFile } from 'remotion';
import type { BrollEv, Sfx } from './_kit';
import type { BadgeEv, ThumbDef } from './LivestreamShort';

// ─── october-not-allowed-red (batch: clarity-act, clip #1, variant: full) ──────────────────────
// "October Is Not Even Allowed To Go Red" — Mike's tribal thesis: everybody who checked out is
// scheduled to buy back in October, so their own demand is what makes October green; even a
// China-invades-Taiwan stress test does not stop the four-year cycle zombies from buying back.
//
// Base clip: october-not-allowed-red-tightened-desilenced.mp4, ALREADY composited vertical
// (screen-share on top, webcam below). 1080x1920 @ 25 fps, 47.36 s. Do NOT re-split the zones.
// The comp runs at 30 fps; OffthreadVideo resamples the 25 fps source by TIME, so all cue points
// below are plain seconds taken from whisper-words.json (clip-relative, 0-based).
//
// Render (public-dir = the CLIP's render-assets/, which holds the spine + thumbnail + b-roll + sfx):
//   npx remotion render src/index.ts OctoberNotAllowedRed \
//     out/clarity-act/1-october-not-allowed-red.mp4 \
//     --public-dir "<repo>/video-creation/shorts/clarity-act/october-not-allowed-red/render-assets"

export const ONAR_FPS = 30;
export const ONAR_DURATION = 1420; // 47.333 s @30, just inside the 47.36 s clip (no black tail frame)

export const CLIP_ONAR  = staticFile('october-not-allowed-red-full.mp4');
export const THUMB_ONAR = staticFile('thumbnail-onar.png');

// Layout geometry, MEASURED on this clip (row-mean gradient scan at t=1/12/25/40 s; all four frames
// put the hard screen-share/webcam divider at the same row).
export const ONAR_SEAM  = 854; // content zone = 0..854 (The Hill article); webcam plays below
export const ONAR_CAP_Y = 890; // caption centre: below the seam, above his hairline (~1100), never his eyes (~1420)

// ─── B-roll beats (authored in BROLL-PLAN.md BEFORE generation) ────────────────────────────────
// Coverage budget (SKILL "B-roll coverage budget", HALVED 2026-07-14):
//   15.50 s covered / 47.36 s = 32.7 % b-roll, 31.86 s = 67.3 % BASE SHOWING. Targets ~30 % / ~70 %
//   (bands 25-35 % / 65-75 %) => inside the band. 7 distinct images, zero reuse inside the clip.
// 3 full-screens ONLY (hook / climax / stress test) = the FIRM 1-3 cap. No two full-screens are
// adjacent and every full->base gap is >= 1.5 s, so the base never flashes between them.
// The screen-share here is a STATIC The Hill "Clarity Act" article that is off-message for this
// clip; per the SKILL that is NOT a licence to blanket, so the long base stretches stand and the two
// code badges (below) carry the two longest ones instead of more b-roll.
// staticFile() calls are LITERAL strings on purpose — the finalized-short gate scans for literal refs.
export const BROLL_ONAR: BrollEv[] = [
  // BASE 0.00-1.20 — open on Mike + the screen-share (the frame-0 thumb is ONE frame; base from frame 1)
  { src: staticFile('broll-onar-checked-out.png'),   tIn:  1.20, tOut:  3.40, mode: 'full'    }, // "people are CHECKED OUT right now and they're not coming back" (HOOK)
  // BASE 3.40-5.70 — "in october. they're gonna buy in october."
  { src: staticFile('broll-onar-october-green.png'), tIn:  5.70, tOut:  7.90, mode: 'content' }, // "they're gonna cause october to be GREEN" (ends on the word "green" @7.50-7.74)
  // BASE 7.90-12.52 (4.62 s) — "i mean personally i think something extraordinarily bad would have to happen"
  { src: staticFile('broll-onar-october-red.png'),   tIn: 12.52, tOut: 14.24, mode: 'content' }, // "for OCTOBER to be RED" ("october" 12.52, "red" 13.64-13.82)
  // BASE 14.24-17.78 (3.54 s) — "because there's so many people that'll be buying back in october"
  { src: staticFile('broll-onar-not-allowed.png'),   tIn: 17.78, tOut: 20.72, mode: 'full'    }, // PEAK 1 / CLIMAX: "they're not even allowed, not allowed to GO RED" ("red" 20.30-20.56)
  // BASE 20.72-26.26 (5.54 s) — "even if this really bad, how bad could it get? ... everybody always gives us an example." (+ STRESS TEST badge)
  { src: staticFile('broll-onar-stress-test.png'),   tIn: 26.26, tOut: 28.60, mode: 'full'    }, // PEAK 2: "CHINA INVADES TAIWAN" (26.26-27.62)
  // BASE 28.60-32.30 (3.70 s) — "extraordinarily bearish. i still think there's gonna be a huge chunk of those"
  { src: staticFile('broll-onar-zombies.png'),       tIn: 32.30, tOut: 34.60, mode: 'content' }, // "four-year cycle ZOMBIES that sold at the end of last year" ("zombies" 33.16-33.52)
  // BASE 34.60-40.74 (6.14 s) — "maybe half of them, maybe even 20 or 10%. they're still gonna buy back in october." (+ 10% badge)
  { src: staticFile('broll-onar-good-deal.png'),     tIn: 40.74, tOut: 42.54, mode: 'content' }, // "WOW, there's a GOOD DEAL. let me buy back in." ("deal" 41.44-41.70)
  // BASE 42.54-47.36 (4.82 s) — "we'll see what happens. maybe i'll be proven wrong, but i can't imagine a very very bad october." (close on Mike; his face is the loop frame, deliberate)
];

// ─── Badges (code-drawn text, content zone y300) ────────────────────────────────────────────────
// Both sit over BASE stretches (never over a b-roll beat), are 13.7 s apart so they never share a
// time window, live at y300 while captions live at y890, and both start long after the frame-0 thumb.
// Each states something the captions do NOT.
export const BADGES_ONAR: BadgeEv[] = [
  { tIn: 23.60, tOut: 26.10, color: '#ff5252', line1: 'STRESS TEST', sub: 'THE WORST CASE THEY ALL CITE', top: 300 },
  { tIn: 37.30, tOut: 39.60, color: '#39ff14', line1: '10%',         sub: 'IS STILL A WALL OF BIDS',      top: 300 },
];

// ─── Frame-0 thumbnail (IG/TikTok cover) ────────────────────────────────────────────────────────
// ONE frame only (LivestreamShort defaults thumb.durS to 1/fps) — generated background art with the
// hook title drawn in CODE on top, never baked into the image. No em dashes.
export const THUMB_DEF_ONAR: ThumbDef = {
  img: THUMB_ONAR,
  title: "OCTOBER ISN'T\nALLOWED TO\nGO RED",
  chip: 'THEY ALL BUY BACK IN',
  chipColor: '#39ff14',
  titleSize: 118,
};

// ─── SFX (shared library, COPIED into render-assets/sfx/; every event stays under the VO) ───────
// Whoosh on the thumbnail cut and on every major layout transition; a riser BUILDS INTO the climax
// impact; impacts land on the reveals and the punchline; a kaching on the "good deal" line.
// Per Impacts/WHEN-TO-USE-IMPACTS.md the big hits are reserved for beats that actually matter.
//
// ⚠ Cue points are the SFX's own PEAK position, not its file start (measured envelopes, 0.2 s RMS):
//   transition_rapid_whoosh peaks 0.10 s in - Cinematic Whoosh 02 peaks 0.80 s in - Cinematic
//   Whoosh 06 peaks 0.60 s in - Edgy_Riser peaks 5.0 s in - TING has 0.75 s of LEADING SILENCE before
//   its attack - Cash Register attacks 0.15 s in. A first pass fired each file ON the cut, so the two
//   cinematic whooshes crested AFTER the cut (measured +0.1 dB over the VO = inaudible), the riser was
//   truncated at 2.38 s long before its build, and the ting/kaching landed a beat late. They are now
//   started EARLY so the crest/attack lands on the frame it punctuates.
// Levels were then set by ALIGNED SUBTRACTION of the source audio from the render (lag-corrected,
// gain-fitted; codec residual floor -17.5 dB rel. mix): every cue below now measures at least 7 dB
// above that floor. TING (0.34 -> 0.50), Cash Register (0.40 -> 0.70) and Whoosh 06 (0.44 -> 0.78)
// were raised because they are 8-15 dB quieter FILES than the impacts and were inaudible under the VO.
export const SFX_ONAR: Sfx[] = [
  { t:  0.00, src: staticFile('sfx/transition_rapid_whoosh.mp3'),       vol: 0.46, dur: 1.0 }, // frame-0 thumbnail cut (peaks 0.10 = right on the cut)
  { t:  0.40, src: staticFile('sfx/Cinematic Whoosh 02.wav'),           vol: 0.50, dur: 1.9 }, // sweeps INTO the HOOK full-screen (crest 1.20 = the cut)
  { t:  6.75, src: staticFile('sfx/TING SOUND EFFECT.mp3'),             vol: 0.50, dur: 2.1 }, // ATTACKS on the word "green" (7.50); the file has 0.75 s of leading silence
  { t: 12.58, src: staticFile('sfx/risers/Edgy_Riser.wav'),             vol: 0.30, dur: 5.20 }, // riser BUILDS INTO the climax (crest ~17.6, cut off by the impact at 17.78)
  { t: 17.78, src: staticFile('sfx/Impacts/Impact_3.wav'),              vol: 0.46, dur: 2.2 }, // hard cut to the climax full-screen
  { t: 20.12, src: staticFile('sfx/Impacts/Impact_Hit_01-2.wav'),       vol: 0.52, dur: 3.2 }, // "to GO RED", biggest hit of the short
  { t: 25.66, src: staticFile('sfx/Cinematic Whoosh 06.wav'),           vol: 0.78, dur: 2.1 }, // sweeps INTO the stress-test full-screen (crest 26.26 = the cut); vol raised, this file is ~8 dB quieter than Whoosh 02
  { t: 27.08, src: staticFile('sfx/ding/sudden-shock.mp3'),             vol: 0.40, dur: 1.8 }, // lands on "Taiwan"
  { t: 32.20, src: staticFile('sfx/transition_rapid_whoosh.mp3'),       vol: 0.38, dur: 1.0 }, // into the zombies cutaway (crest 32.30 = the cut)
  { t: 33.16, src: staticFile('sfx/Impacts/Soundjay_Impact_Main_01.wav'), vol: 0.38, dur: 2.0 }, // lands on "zombies"
  { t: 41.30, src: staticFile('sfx/Cash Register.mp3'),                 vol: 0.70, dur: 1.8 }, // kaching ATTACKS on the word "deal" (41.44)
];

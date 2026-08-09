import { staticFile } from 'remotion';
import type { BrollEv, Sfx } from './_kit';
import type { BadgeEv, ThumbDef } from './LivestreamShort';

// ─── tao-under-200-last-chance-impact (batch: October-pumps, clip #8, variant: impact) ─────────
// "TAO Under $200: Don't Be That Guy" — the impact cut. Opens cold on the price line: TAO under
// $200, imagine that. Imagine in five years thinking back to when TAO was under $200 and being glad
// you bought it. Don't be that guy who says "damn, I should have bought when I saw it under $200,
// CodeMonkey Mike was talking about it and I just didn't pay attention." Nobody wants to be that guy.
//
// Impact sibling of clip #3 (tao-under-200-last-chance). Every asset below is generated FRESH into
// THIS clip's own render-assets/; nothing is shared with clip #3 (repo rule: every image is unique).
//
// Base clip: tao-under-200-last-chance-impact-final.mp4 (raw cut -> Phase 5 tighten -> 5B desilence
// -> 5C filler removal). ALREADY composited vertical (screen-share on top, webcam below),
// 1080x1920 @ 25 fps, 21.92 s. FINAL, do NOT re-cut and do NOT re-split the zones. The comp runs at
// 30 fps; OffthreadVideo resamples the 25 fps source by TIME, so every cue below is plain seconds
// taken from the clip's own caption/word timings (clip-relative, 0-based).
//
// Render (public-dir = the CLIP's render-assets/, which holds the spine + thumbnail + b-roll + sfx):
//   npx remotion render src/index.ts TaoUnder200Impact \
//     out/October-pumps/8-tao-under-200-last-chance-impact.mp4 \
//     --public-dir "<repo>/video-creation/shorts/October-pumps/tao-under-200-last-chance-impact/render-assets"

export const TAOI_FPS = 30;
export const TAOI_DURATION = 657; // 21.900 s @30, just inside the 21.92 s clip (no black tail frame)

export const CLIP_TAOI  = staticFile('tao-under-200-last-chance-impact-final.mp4');
export const THUMB_TAOI = staticFile('thumbnail-taoi.png');

// Layout geometry, MEASURED on this clip (row-mean gradient scan at t=0.5/3/6/9/12/15/18/21 s; all
// eight frames put the hard screen-share/webcam divider on the same row, gradient 178-223 grey
// levels vs 27 for the next-strongest edge).
export const TAOI_SEAM  = 854; // content zone = 0..854 (the CoinMarketCap Bittensor TAO page); webcam below
export const TAOI_CAP_Y = 890; // caption centre: below the seam, above his hairline (~1030), never his eyes (~1480)

// ─── B-roll beats (authored in BROLL-PLAN.md BEFORE generation) ────────────────────────────────
// Coverage budget (SKILL "B-roll coverage budget", HALVED 2026-07-14):
//   7.36 s covered / 21.90 s = 33.6 % b-roll, 14.54 s = 66.4 % BASE SHOWING. Targets ~30 % / ~70 %
//   (bands 25-35 % / 65-75 %) => in band. 4 distinct images, zero reuse inside the clip.
// 2 full-screens ONLY (the hook and the "don't be that guy" close) — at 21.9 s the cap is 1-2 and it
// is FIRM. They are 15.94 s apart, so no full->full base flash exists, and every b-roll-to-base gap
// is >= 2.48 s so there is no sub-1.5 s base flash anywhere.
// The screen-share is NOT filler here and is never dead: the CoinMarketCap "Bittensor TAO" page is up
// for the WHOLE clip with the 24h line pinned at 199.7, mcap $2.22B, 21M max supply, rank #34 and the
// TAO/USDT $199.67 markets table. That page IS the receipt for the sentence he is speaking, which is
// why the long stretches are deliberately BASE.
// staticFile() calls are LITERAL strings on purpose — the finalized-short gate scans for literal refs.
export const BROLL_TAOI: BrollEv[] = [
  // BASE 0.00-1.30 — open on Mike + the CMC page at 199.7 (the frame-0 thumb is ONE frame; base from frame 1)
  { src: staticFile('broll-taoi-hook-200.png'),    tIn:  1.30, tOut:  3.20, mode: 'full'    }, // HOOK: "$200. imagine that." (the "$200" caption lands 0.84)
  // BASE 3.20-8.42 (5.22 s) — "years you were thinking back to when tao was under $200 and you're saying, you're glad that you" (+ BITTENSOR/TAO badge 5.00-7.20; the chart's Jul '23 -> Jul '26 axis IS the five-years visual)
  { src: staticFile('broll-taoi-glad-bought.png'), tIn:  8.42, tOut:  9.82, mode: 'content' }, // "bought TAO under $200" — the future self looking back down at the entry
  // BASE 9.82-12.30 (2.48 s) — "don't be that guy who says, damn, i" (sudden-shock lands on "damn" 11.30)
  { src: staticFile('broll-taoi-regret.png'),      tIn: 12.30, tOut: 13.60, mode: 'content' }, // "should have bought when i saw it" — the regret room
  // BASE 13.60-19.14 (5.54 s) — "under $200. codemonkey mike was talking about it, but i just didn't pay attention. yeah, that's not too good." (+ HE SAID IT badge 15.20-17.60, riser building from 14.14)
  { src: staticFile('broll-taoi-left-behind.png'), tIn: 19.14, tOut: 21.90, mode: 'full'    }, // CLIMAX/CLOSE: "don't be that guy. nobody wants to be that guy." — runs to the end, so the loop frame is the close
];

// ─── Badges (code-drawn text, content zone y300) ────────────────────────────────────────────────
// Both badges sit over a BASE stretch (never over a b-roll beat), they do not share a time window
// (gap 8.00 s), and both start long after the frame-0 thumb. Each states something the captions do NOT.
// GEOMETRY (measured on the draft render, not assumed): a Badge is left:50% + translate(-50%), so its
// shrink-to-fit width is capped at 1080-540 = 540 px and every line wraps inside ~436 px of content;
// the rendered box is ~306 px tall. At the historical top:300 that box lands on y150-460 and COVERS THE
// PRICE CHART (y~120-390) - which is this clip's whole receipt (the 199.7 line). So both badges sit at
// **top: 620** instead: box y467-773, i.e. entirely BELOW the chart, entirely ABOVE the seam (854) and
// the caption band (text top ~838). Chart stays visible, nothing collides.
export const BADGES_TAOI: BadgeEv[] = [
  { tIn:  5.00, tOut:  7.20, color: '#00e5ff', line1: 'BITTENSOR', line2: 'TAO',  sub: 'RANK #34, 21M MAX SUPPLY', top: 620 },
  { tIn: 15.20, tOut: 17.60, color: '#39ff14', line1: 'HE SAID IT', line2: 'LIVE', sub: 'RECEIPTS, NOT HINDSIGHT',  top: 620 },
];

// ─── Frame-0 thumbnail (IG/TikTok cover) ────────────────────────────────────────────────────────
// ONE frame only (LivestreamShort defaults thumb.durS to 1/fps) — generated background art with the
// hook title drawn in CODE on top, never baked into the image. No em dashes.
export const THUMB_DEF_TAOI: ThumbDef = {
  img: THUMB_TAOI,
  title: 'TAO UNDER $200\nDON\'T BE\nTHAT GUY',
  chip: 'IMAGINE FIVE YEARS FROM NOW',
  chipColor: '#39ff14',
  titleSize: 118,
};

// ─── SFX (shared library, COPIED into render-assets/sfx/; every event stays under the VO) ───────
// Whoosh on the thumbnail cut and on every b-roll transition; ONE riser building into the closing
// impact; impacts reserved for the two beats this cut is built on ("$200" and "don't be that guy")
// plus the final button (per Impacts/WHEN-TO-USE-IMPACTS.md: "reserve them for the beats that
// actually matter").
//
// ⚠ Cue points are each SFX's own MEASURED attack/peak position, not its file start. Envelopes
//   measured on this machine for THIS build (20 ms RMS windows for attack/peak, 0.2 s for the riser
//   crest): transition_rapid_whoosh peaks 0.18 s in - Cinematic Whoosh 02 peaks 0.86 s - Cinematic
//   Whoosh 06 peaks 0.58 s - Cash Register attacks 0.26 s - ding/sudden-shock attacks 0.18 s -
//   Impact_Hit_01-2 attacks 0.06 s - Impact_3 attacks 0.22 s - Boom - Big Reveal attacks 0.02 s -
//   Edgy_Riser crests at 5.00 s. Each cue below is therefore started EARLY by exactly that offset so
//   the crest lands on the frame it punctuates. Quiet FILES (Whoosh 06 -16.7 dB RMS, Cash Register
//   -16.2 dB vs Boom at -0.0 dB) get a higher vol so they are actually audible under the VO.
export const SFX_TAOI: Sfx[] = [
  { t:  0.00, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.46, dur: 1.00 }, // frame-0 thumbnail cut (lands 0.18)
  { t:  0.44, src: staticFile('sfx/Cinematic Whoosh 02.wav'),     vol: 0.50, dur: 2.00 }, // sweeps INTO the HOOK full-screen (crest 1.30 = the cut)
  { t:  1.24, src: staticFile('sfx/Impacts/Impact_Hit_01-2.wav'), vol: 0.44, dur: 2.40 }, // the hit on "$200" (weighted beat 1)
  { t:  3.02, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.36, dur: 1.00 }, // the cut back out of the hook full-screen (3.20)
  { t:  7.84, src: staticFile('sfx/Cinematic Whoosh 06.wav'),     vol: 0.78, dur: 2.10 }, // into the "glad that you bought" cutaway (8.42)
  { t:  9.16, src: staticFile('sfx/Cash Register.mp3'),           vol: 0.72, dur: 2.10 }, // kaching ATTACKS on the second "$200" (9.42)
  { t: 11.12, src: staticFile('sfx/ding/sudden-shock.mp3'),       vol: 0.40, dur: 1.80 }, // lands on "damn" (11.30)
  { t: 12.12, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.38, dur: 1.00 }, // into the regret cutaway (12.30)
  { t: 14.14, src: staticFile('sfx/risers/Edgy_Riser.wav'),       vol: 0.26, dur: 5.20 }, // riser BUILDS INTO the close (crest 19.14)
  { t: 19.12, src: staticFile('sfx/Boom - Big Reveal.wav'),       vol: 0.50, dur: 3.00 }, // the biggest hit, on "don't be that guy" (weighted beat 2)
  { t: 21.14, src: staticFile('sfx/Impacts/Impact_3.wav'),        vol: 0.42, dur: 1.50 }, // the button on "be that guy." (21.36)
];

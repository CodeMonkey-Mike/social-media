import { staticFile } from 'remotion';
import type { BrollEv, Sfx } from './_kit';
import type { BadgeEv, OverlayEv, ThumbDef } from './LivestreamShort';

// ─── kaspa-excavator (batch: last-year, clip #4, variant: full) ─────────────────────────────────
// "Kaspa's going down"  (Mike's VERBATIM 4b retitle, clip-plan.json -> four_b_verdicts.retitles["4"];
// the lowercase "going down" is deliberate and is reproduced byte-for-byte on the cover.)
//
// The conviction story: Hurricane Sally put ~100 trees on the ground, he bought an excavator instead
// of paying a $20,000 crew, and when the cleanup was done he SOLD THE EXCAVATOR to buy more Kaspa.
// Then the honest pain (Bitcoin dips, Kaspa dips harder, Bitcoin recovers, Kaspa stays down), which
// resolves upward ("all this pain is gonna be worth it in the long run") and HARD-OUTS on
// "I'm battle-hardened... I'm ready for some pain". The title's bearish read is the hook; the clip is
// conviction. NOTHING is placed over or after the close: no b-roll, no badge, no overlay, no SFX and
// no CTA after 58.40 s. That abruptness is the watch-time strategy, not an omission.
//
// Base clip: kaspa-excavator-final.mp4 (raw cut -> Phase 5 tighten -> 5B desilence -> 5C filler pass).
// ALREADY composited vertical (screen-share on top, webcam below), 1080x1920 @ 25 fps, 67.060 s.
// FINAL, do NOT re-cut and do NOT re-split the zones. The comp runs at 30 fps; OffthreadVideo
// resamples the 25 fps source by TIME, so every cue below is plain seconds taken from the clip's own
// Whisper word timings (clip-relative, 0-based).
//
// ⚠ The file referenced here is the render-assets COPY, re-encoded to a SEEK-FRIENDLY GOP by
//   `python video-creation/livestream-repurpose/scripts/setup_render_assets.py last-year`.
//   VERIFIED for THIS build: 1080x1920, 25 fps, 1674 frames, duration 67.060 s - identical duration to
//   the clip folder's own -final.mp4, and its md5 (c5475057afe67dbfb7bb4215d27c13b5) differs from all
//   three sibling spines in this batch, i.e. this comp provably references its OWN spine. The
//   canonical spine in the clip folder is never touched.
//
// Render (public-dir = the BATCH render-assets/, shared with clips 1/2/3; every file this clip owns is
// `*-lykx-*` / `thumb-lykx` prefixed so the parallel builders cannot collide):
//   npx remotion render src/index.ts LastYearKaspaExcavator \
//     out/last-year/4-kaspa-excavator.mp4 \
//     --public-dir "<repo>/video-creation/shorts/last-year/render-assets"

export const KEX_FPS = 30;
export const KEX_DURATION = 2011; // 67.060 s @30; last frame index 2010 = t 67.000 s, inside the clip

export const CLIP_KEX  = staticFile('kaspa-excavator.mp4');
export const THUMB_KEX = staticFile('thumb-lykx.png');

// Layout geometry, MEASURED on this clip (row-mean gradient scan at
// t = 1/6/12/18/24/30/36/42/48/54/60/66 s; 12 of 12 frames put the hard screen-share/webcam divider
// on the same row, delta 144-216, with the runner-up edge 76 rows away and 2-3x weaker).
export const KEX_SEAM  = 853; // content zone = 0..853 (DEXScreener PURR/ETH <-> TradingView KASUSD)
export const KEX_CAP_Y = 900; // caption centre: 47 px under the seam, on his hair; his eyes sit ~1310-1400

// TEAL is correct here and is NOT the default-by-accident: this is the Kaspa clip of the batch, the
// b-roll coins carry the real Kaspa mark, and the captions give "kaspa" the same <g> teal.
export const KEX_TEAL = '#00e5ff';

// ─── B-roll beats (authored in BROLL-PLAN.md BEFORE generation) ────────────────────────────────
//
// COVERAGE: 20.15 s of 67.060 s = 30.0 % b-roll / 70.0 % BASE SHOWING - dead on the SKILL's halved
// target (band ~25-35 %). 6 distinct images, zero reuse inside the clip and none shared with the Lane
// 3 excavator image or any sibling clip. TWO full-screens (the hook and the climax), 29.35 s apart =
// inside the FIRM 1-3 cap.
//
// The base is the DEFAULT state and it earns its two long stretches, because the screen-share is not
// uniform on this clip (measured on frames at t = 6/33/36/38/42/52/54/57/60/66):
//   0.00-36.2  DEXScreener PURR/ETH  - OFF-message for an excavator/Kaspa story -> the story beats live here
//   36.4-51.3  live TradingView KASUSD weekly, 0.026172, -1.80 % - this IS the receipt for the title,
//              so 36.55-45.55 is a DELIBERATE 9.00 s base stretch with exactly ONE cutaway after it
//   51.4-58.4  back to PURR (off-message) -> carried by badge B + the alpha overlay
//   58.5-67.06 KASUSD again, and the close is left completely clean
//
// Every join leaves >= 2.40 s of base (the minimum is 1.5 s), so there is no sub-1 s base flash
// anywhere and no beat needs a hard-cut butt. No beat runs longer than 3.60 s.
//
// staticFile() calls are LITERAL strings on purpose - the finalized-short gate scans for literal refs.
export const BROLL_KEX: BrollEv[] = [
  // BASE 0.00-0.85 - the frame-0 thumb is ONE frame; the video opens on Mike, then cuts to the hook
  { src: staticFile('broll-lykx-hook-excavator.png'), tIn:  0.85, tOut:  4.20, mode: 'full'    }, // HOOK: "so I have my excavator that I sold here. I was here full time in 2020" (0.00-4.16)
  // BASE 4.20-6.85 (2.65 s) - "and there was a huge hurricane. my town RIGHT HERE" - he gestures on
  // "right here" (5.98-6.26); do not cover his own gesture
  { src: staticFile('broll-lykx-hurricane-sally.png'), tIn:  6.85, tOut: 10.45, mode: 'content' }, // "where I am in the Gulf Coast, took a direct hit from Hurricane Sally" (6.74-10.30)
  // BASE 10.45-12.85 (2.40 s) - "and then it was like, I got a big property"
  { src: staticFile('broll-lykx-hundred-trees.png'),   tIn: 12.85, tOut: 16.45, mode: 'content' }, // "and I lost like 100 trees, man. it was just all laying on the floor" (13.08-16.02); the cut out lands inside the measured 16.37-16.56 quiet, between "just" and "devastating"
  // BASE 16.45-20.00 (3.55 s) - "it was just devastating. I was like, jeez, why would I pay another crew"
  { src: staticFile('broll-lykx-crew-quote.png'),      tIn: 20.00, tOut: 23.30, mode: 'content' }, // "like $20,000 or something to come clean out my property" (20.16-23.54). Faceless silhouettes, BLANK banknotes - no real crew, no readable money
  // ⛔ BASE 23.30-33.55 (10.25 s) - "when I can just buy an excavator and do it myself... every
  // weekend... just have fun doing it. and I got an excavator". DELIBERATELY barren: carried by code
  // badge A (25.20) and by the riser that builds into the climax.
  { src: staticFile('broll-lykx-sold-for-kaspa.png'),  tIn: 33.55, tOut: 36.55, mode: 'full'    }, // CLIMAX: "I went and sold my excavator so I can buy more kaspa" (33.54-36.18). Generated WITH schedule-tweets/images/reference/kaspa-logo.png, so the coins carry the REAL backwards-K teal mark
  // ⛔ BASE 36.55-45.55 (9.00 s) - the whole pain run over the LIVE KASUSD chart: "kaspa's been really
  // weak... whenever Bitcoin goes down, kaspa goes down... Bitcoin goes back up, kaspa stays down."
  // The chart IS the receipt for the title; covering it would hide the proof.
  { src: staticFile('broll-lykx-kaspa-lag.png'),       tIn: 45.55, tOut: 48.85, mode: 'content' }, // "and then Bitcoin goes down again, kaspa goes down some more" (45.58-48.70). Bitcoin is LOGO-FREE (no reference exists on disk): it is a plain orange line, and only Kaspa carries a mark
  // ⛔ BASE 48.85-67.06 (18.21 s) - "kaspa stays down there", the thesis, the resolution, and the
  // whole close. Carried by badge B (52.80) and the alpha overlay (56.30), then NOTHING from 58.40:
  // "I'm battle-hardened... I'm ready for some pain" ends the short clean and abrupt, on purpose.
];

// ─── Transparent overlay (real alpha PNG) ───────────────────────────────────────────────────────
// The alpha PNG the SKILL requires per clip, and the one image-based element inside the closing base
// stretch. Generated glow-on-black WITH the kaspa-logo reference, then converted to TRUE alpha
// (alpha = boosted luminance, per SKILL "Transparent overlays"): 70.6 % of the raw PNG is fully
// transparent, so it composites with no box. `blend: 'normal'` because it is a real-alpha PNG.
// Geometry: the source is 778x1374 (0.566), so width 340 renders 340x600 at top 70 => rows 70-670,
// cols 300-640. That is inside the content zone (seam 853), clear of the caption band (centre 900),
// clear of the DEXScreener stats panel (x > 860) and above the chat banner (y > 700). It sits exactly
// on "all this pain is gonna be worth it in the long run" and ends 0.08 s before the close begins.
export const OVERLAYS_KEX: OverlayEv[] = [
  { src: staticFile('broll-lykx-ov-kaspa-rise.png'), tIn: 56.30, tOut: 58.40, top: 70, left: 300, width: 340, blend: 'normal' },
];

// ─── Code-drawn badges ──────────────────────────────────────────────────────────────────────────
// Both sit inside a DELIBERATE base stretch, 24.80 s apart, so they can never co-occur; neither
// overlaps a b-roll beat, and badge B ends 0.90 s BEFORE the alpha overlay starts. Both start long
// after the 1-frame thumb (LivestreamShort also suppresses badges while the thumb is up).
//
// ⚠ GEOMETRY: the shared `Badge` is `left: 50%` with `translate(-50%,-50%)` and no explicit width, so
// the shrink-to-fit box caps at 540 px (~436 px of text after the 52 px side padding). Every line is
// kept short enough NOT to wrap: line1 <= 10 chars @60 px, line2 <= 8 chars @82 px, sub <= 19 chars
// @32 px. `top` is the box CENTRE, so a ~250 px tall badge at top 620 spans rows ~495-745: inside the
// content zone but well above the seam (853) and the caption band (900).
export const BADGES_KEX: BadgeEv[] = [
  { tIn: 25.20, tOut: 28.00, color: '#ff9f1c', line1: '$20,000', line2: 'CREW',   sub: 'OR BUY THE MACHINE', top: 620 },
  { tIn: 52.80, tOut: 55.40, color: '#00e5ff', line1: 'RELIEF',  line2: 'COMING', sub: 'MAYBE ANOTHER YEAR', top: 620 },
];

// ─── Frame-0 thumbnail (IG/TikTok cover) ────────────────────────────────────────────────────────
// ONE frame only (LivestreamShort defaults thumb.durS to 1/fps) - generated background art with the
// hook title drawn in CODE on top, never baked into the image. No em dashes. The art was generated
// WITH schedule-tweets/images/reference/kaspa-logo.png, so the coin in the excavator's bucket carries
// the REAL backwards-K teal Kaspa mark (the reference gate for the clip's headline project).
// The title is Mike's retitle verbatim; the chip supplies the conviction twist the title withholds.
export const THUMB_DEF_KEX: ThumbDef = {
  img: THUMB_KEX,
  // stored in Mike's VERBATIM casing ("Kaspa's going down", lowercase "going down"); the shared
  // `Thumb` component renders covers in `textTransform: uppercase`, so the cover reads
  // "KASPA'S GOING DOWN" like every other short while the string itself stays the retitle byte-for-byte
  title: "Kaspa's\ngoing down",
  chip: 'I SOLD MY EXCAVATOR',
  chipColor: KEX_TEAL,
  titleSize: 112, // longest line "GOING DOWN" (10 chars) stays inside the 968 px text box
};

// ─── SFX (shared library, COPIED into render-assets/sfx/; every event stays under the VO) ───────
// Whoosh on the frame-0 cover cut and on the hook full-screen in/out, a boom on "took a direct hit",
// a whoosh on the fallen-trees cut, a ding on badge A, a riser that builds INTO the climax full-screen
// with the impact that lands on it, a ting on the "kaspa" payoff word, a light impact inside the
// measured 47.18-47.37 s silence on "kaspa goes down some more", and a ting on the resolution.
// ⛔ NOTHING FIRES AFTER 58.40 s. The hard-out ("I'm battle-hardened... I'm ready for some pain") is
// left completely clean, and the final word "pain" is provably untouched (whisper A/B below).
//
// ⚠ Cue points are each file's own measured CREST, not its file start. Envelopes measured on THIS
//   machine at 0.10 s RMS / 0.05 s hop for this build:
//     transition_rapid_whoosh  crest 0.15 (peak -17.3 dB)   Cinematic Whoosh 02  crest 0.80 (-14.2)
//     Boom - Big Reveal-short  crest 0.05 (-5.4)            DING-093             crest 0.15 (-15.8)
//     TING SOUND EFFECT        crest 0.80 (-14.2)           Impact_Hit_01-2-short crest 0.10 (-11.6)
//     Tension_Rise_Logo_Reveal_3 attack 0.90, crest 2.55 (a -11 dB PLATEAU, not a ramp)
//   Each cue starts EARLY by exactly that offset so the crest lands on the frame it punctuates.
//
// ⚠ THIS CLIP IS DESILENCED, so timing had almost no silence to hide in: only THREE >= 0.15 s
//   silences exist at -57 dB (8.68-8.91, 16.38-16.55, 47.18-47.37). Two cues are anchored inside them
//   (the "direct hit" boom and the 47.10 impact) and a third lands in the 36.18-36.44 inter-segment
//   gap (the kaspa ting). The rest were PROVEN by the offline A/B rather than assumed.
//
// ⚠ THE RISER IS TRIMMED, NOT TURNED DOWN. Tension_Rise_Logo_Reveal_3 is not a smooth ramp: it jumps
//   to a -11 dB plateau at ~1.90 s and holds it. Played from 32.05 with dur 1.50 it stops at 33.55, so
//   ONLY the quiet pre-plateau ramp is ever heard, it ends EXACTLY on the climax cut, and it keeps its
//   full gain.
//
// ⛔ OFFLINE MASKING A/B, RUN BEFORE ANY RENDER (kex_mix.py; SKILL 7a). Every cue was mixed onto the
//   BARE spine with Remotion's own semantics (Sequence from = round(t*30)/30, Audio truncated to
//   durationInFrames, linear volume), pushed through the SAME 48 kHz AAC chain as the render, and
//   whisper-scored on SHORT STAGGERED windows against an ENCODE-MATCHED control (the bare spine
//   through the identical chain). 22 windows, zero renders. Result: ALL 11 cues shipped UNCHANGED -
//   no cue needed a retime, a trim or a gain cut, and none was deleted.
//     - 18 of 22 windows are word-for-word identical between control and mix.
//     - The 4 that differ are boundary/decoder variance, each contradicted by >= 2 staggered windows
//       over the same span, and in TWO of them the MIX transcribed BETTER than the control
//       ("Casper goes DOWN some more" vs the control's "goes out some more" at 46.6-48.8, and "man
//       it's just all" vs "manages all" at 13.4-15.4). The control itself fluctuates on the climax
//       phrase ("then it was like" / "then I was like") with no SFX present at all.
//     - The close was scored too: 64.0-67.06 and 65.4-67.06 are IDENTICAL on control and mix, which is
//       what "no cue after 58.40" buys - the last word "pain" is untouched.
export const SFX_KEX: Sfx[] = [
  { t:  0.00, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.26, dur: 1.00 }, // frame-0 thumbnail cut (crest 0.15)
  { t:  0.05, src: staticFile('sfx/Cinematic Whoosh 02.wav'),               vol: 0.18, dur: 2.00 }, // sweeps INTO the HOOK full-screen (crest 0.85 = the 0.85 cut)
  { t:  4.05, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.22, dur: 1.00 }, // cut back to base (crest 4.20)
  { t:  8.70, src: staticFile('sfx/Boom - Big Reveal-short.wav'),           vol: 0.24, dur: 1.05 }, // "took a DIRECT HIT" (crest 8.75, inside the measured 8.68-8.91 silence)
  { t: 12.70, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.20, dur: 1.00 }, // cut to the 100-fallen-trees beat (crest 12.85)
  { t: 25.05, src: staticFile('sfx/DING-093.wav'),                          vol: 0.22, dur: 0.93 }, // BADGE A "$20,000 CREW" reveal (crest 25.20)
  { t: 32.05, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_3.wav'), vol: 0.10, dur: 1.50 }, // riser BUILDS INTO the climax and ENDS exactly on it (33.55) - trimmed to the pre-plateau ramp
  { t: 33.50, src: staticFile('sfx/Boom - Big Reveal-short.wav'),           vol: 0.26, dur: 1.05 }, // IMPACT on the CLIMAX full-screen cut (crest 33.55)
  { t: 35.50, src: staticFile('sfx/TING SOUND EFFECT.mp3'),                 vol: 0.20, dur: 1.40 }, // the payoff word "kaspa" (crest 36.30, inside the 36.18-36.44 inter-segment gap)
  { t: 47.10, src: staticFile('sfx/Impacts/Impact_Hit_01-2-short.wav'),     vol: 0.20, dur: 0.55 }, // "kaspa goes down some more" (crest 47.20, inside the measured 47.18-47.37 silence); the LIGHTEST impact in the library (-11.6 dB peak), 0.55 s trimmed variant so no tail smears
  { t: 55.50, src: staticFile('sfx/TING SOUND EFFECT.mp3'),                 vol: 0.18, dur: 1.40 }, // the RESOLUTION + the alpha overlay pop (crest 56.30). LAST cue of the short: nothing fires after this.
];

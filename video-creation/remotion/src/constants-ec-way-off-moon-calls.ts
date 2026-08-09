import { staticFile } from 'remotion';
import type { BrollEv, Sfx } from './_kit';
import type { BadgeEv, OverlayEv, ThumbDef } from './LivestreamShort';

// ─── way-off-moon-calls (batch: early-crash, clip #3, variant: full) ─────────────────────────────
// Mike's exact 4b title: "What $IF to a 10 billion market cap".
// ⚠ The $IF spelling is HIS and is deliberate (the token's real ticker is $IF, never $WHATIF — see
// persona.json whatif_ticker), and the title deliberately does NOT describe the clip's content.
// Never "fix" either. The clip itself is the $LAB / Velvet vindication: he called a 20x on $LAB and
// it did a 350x, he called a 30x on Velvet and it did a 58x, and he still thinks it has room to
// grow. "I was WAY off" = his published calls were too LOW. Ends on a deliberate HARD-OUT, no CTA.
//
// Base clip: way-off-moon-calls-final.mp4 (raw cut -> Phase 5 tighten -> 5B desilence at min-sil
// 0.25 -> 5C filler pass). ALREADY composited vertical (screen-share on top, webcam below),
// 1080x1920 @ 25 fps, 32.24 s. FINAL, do NOT re-cut and do NOT re-split the zones. The comp runs at
// 30 fps; OffthreadVideo resamples the 25 fps source by TIME, so every cue below is plain seconds
// taken from the clip's own Whisper word timings (clip-relative, 0-based).
//
// ⚠ The file referenced here is the render-assets COPY, re-encoded to a SEEK-FRIENDLY GOP by
//   scripts/setup_render_assets.py (keyframes verified at 0.00/1.00/2.00/3.04 s) — mandatory since
//   the 2026-08-05 finding that Remotion's concurrent OffthreadVideo seeks die mid-render on a
//   long-GOP source. The canonical spine in the clip folder is never touched.
//
// Render (public-dir = the BATCH render-assets/, shared with clips 1/4/5/6; every file this clip
// owns is `*-ec-wom-*` / `thumb-ecwom` prefixed so the parallel builders cannot collide):
//   npx remotion render src/index.ts EcWayOffMoonCalls \
//     out/early-crash/3-way-off-moon-calls.mp4 \
//     --public-dir "<repo>/video-creation/shorts/early-crash/render-assets"

export const WOM_FPS = 30;
export const WOM_DURATION = 967; // 32.233 s @30; last frame index 966 = t 32.200 s, inside the 32.24 s clip

export const CLIP_WOM  = staticFile('way-off-moon-calls.mp4');
export const THUMB_WOM = staticFile('thumb-ecwom.png');

// Layout geometry, MEASURED on this clip (row-mean gradient scan at t = 1/6/12/18/24/30 s; all SIX
// frames put the hard screen-share/webcam divider on the same row, delta 173-206).
export const WOM_SEAM  = 853; // content zone = 0..853 (a live DEXScreener AKITA/WETH chart); webcam below
export const WOM_CAP_Y = 890; // caption centre: 37 px under the seam, on his hair, never his eyes (~1290)

// ─── B-roll beats (authored in BROLL-PLAN.md BEFORE generation) ─────────────────────────────────
// Coverage budget (SKILL "B-roll coverage budget", HALVED 2026-07-14):
//   9.75 s covered / 32.24 s = 30.2 % b-roll, 22.49 s = 69.8 % BASE SHOWING. Targets ~30 % / ~70 %
//   (bands 25-35 % / 65-75 %) => on target. 4 distinct images, zero reuse inside the clip, every
//   beat 2.25-2.60 s (the style guide's "changes every 1-3 s").
// 2 full-screens ONLY (the hook and the Velvet payoff) = inside the FIRM 1-3 cap, and they are
// 22.85 s apart, so no full->full base flash can exist. No two beats are adjacent (smallest base gap
// 2.10 s, over the 1.5 s minimum), so BrollLayer fades each one in and out of the base as intended.
//
// ⚠ THE CONTENT ZONE IS AN OFF-MESSAGE SCREEN-SHARE (a DEXScreener AKITA/WETH chart left up from the
// previous topic; this clip is about $LAB and Velvet) and is still NOT blanketed. Per SKILL.md that
// is NOT a licence to blanket: coverage stays inside the band and the two long base stretches
// (7.90-14.30 and 16.60-26.05) are carried by CODE-DRAWN BADGES + one alpha overlay, not by more
// images. The 16.60-26.05 stretch is deliberate: the confession and the "holy crap man, i was WAY
// off" vindication are a FACE performance.
// The two content-mode images were re-framed to exactly 1080x853 (crop + resize only, no repaint)
// because the comp draws content mode in a 1080x853 box and a raw 9:16 source would be centre-
// cropped to 44 % of its height, cutting the real $LAB mark off.
// staticFile() calls are LITERAL strings on purpose — the finalized-short gate scans for literal refs.
export const BROLL_WOM: BrollEv[] = [
  // BASE 0.03-0.60 — the frame-0 thumb is ONE frame; the video opens on Mike + the screen-share
  { src: staticFile('broll-ec-wom-hook.png'),       tIn:  0.60, tOut:  3.20, mode: 'full'    }, // HOOK: "if i give these HIGH PRICE PREDICTIONS and it might sound like UNREALISTIC" (0.00-3.78)
  // BASE 3.20-5.30 (2.10 s) — "but i'm telling you, man" is the turn; it lands on his face
  { src: staticFile('broll-ec-wom-lab-call.png'),   tIn:  5.30, tOut:  7.90, mode: 'content' }, // "i put a 20x price prediction on the $LAB token" (4.86-7.94) — REAL $LAB mark (ref LAB.png) + one modest target
  // ⛔ BASE 7.90-14.30 (6.40 s) — "we bought that at the bottom in december" + the SIGNATURE DOUBLING
  // ("i put a 20x price prediction on the $lab token" a SECOND time). The doubling is the persona
  // beat and plays on him; carried by BADGE 1 (8.70-11.00) and the ALPHA OVERLAY (12.00-14.20).
  { src: staticFile('broll-ec-wom-lab-350x.png'),   tIn: 14.30, tOut: 16.60, mode: 'content' }, // PAYOFF 1: "and we did a 350X" (13.46-16.62) — the same mark riding a colossal candle over that little target
  // ⛔ BASE 16.60-26.05 (9.45 s) — "just a couple of months back ... sometimes i get SCARED to give
  // these MOON-BOYISH price predictions ... and i realized it was like, HOLY CRAP man, i was WAY
  // OFF." The confession + the vindication are a face performance; carried by BADGE 2 (20.30-22.80)
  // and the riser, never by an image over his reaction.
  { src: staticFile('broll-ec-wom-velvet-58x.png'), tIn: 26.05, tOut: 28.30, mode: 'full'    }, // PAYOFF 2 / CLIMAX: "the 58X on the VELVET token" (25.86-27.62) — REAL Velvet mark (ref velvet.png)
  // BASE 28.30-32.24 (3.94 s) — "i think i gave it like a 30x. i did a 58x and i still think it has
  // room to grow again." The deliberate HARD-OUT plays on his face, nothing over it, no tail, no CTA.
];

// ─── Alpha overlay (SKILL: pair full-screen b-roll with >= 1 REAL transparent overlay per clip) ──
// Generated as a glowing arrow on PURE BLACK, then converted to a REAL RGBA PNG (alpha = boosted
// luminance, 470x1070 after cropping to the subject), so it composites with a plain <Img> and needs
// blend 'normal', NOT 'screen' (a screen blend cannot darken the light parts of the screen-share).
// Placed at x 660-950, rows 140-800: inside the content zone, over the right-hand stats column, and
// well clear of the caption band (top 838) and of his face (below the 853 seam). It sits inside the
// 7.90-14.30 BASE stretch and shares no window with either badge (badge 1 ends 11.00, badge 2 starts
// 20.30), so no two graphics can ever co-occur.
export const OVERLAYS_WOM: OverlayEv[] = [
  { src: staticFile('broll-ec-wom-ov-breakout.png'), tIn: 12.00, tOut: 14.20, top: 140, left: 660, width: 290, blend: 'normal' },
];

// ─── Code-drawn badges ──────────────────────────────────────────────────────────────────────────
// Each sits INSIDE a deliberate base stretch (never over a b-roll image) and they are 9.30 s apart,
// so no two can co-occur. Neither starts before the thumb frame ends (0.033 s), and LivestreamShort
// suppresses badges while the thumb is up anyway.
// REGISTER GUARD: badge 2 is a RECEIPT that answers the confession playing under it ("sometimes i get
// scared to give these moon-boyish price predictions") — his call was too LOW, never a mistake.
//
// ⚠ GEOMETRY: the shared `Badge` is `left: 50%` with `translate(-50%,-50%)` and no explicit width, so
// the shrink-to-fit box is capped at (1080 - 540) = 540 px (~436 px of text after the 52 px side
// padding) and long lines WRAP downwards from the centre. Every line here is <= 11 chars at the 60 px
// line1 size and <= 3 chars at the 82 px line2 size, so both boxes stay three lines tall. Clearance
// to the caption band is MEASURED on the render (see the build report), never estimated.
export const BADGES_WOM: BadgeEv[] = [
  { tIn:  8.70, tOut: 11.00, color: '#00e5ff', line1: 'BOUGHT THE', line2: 'BOTTOM', sub: 'DECEMBER',    top: 560 },
  { tIn: 20.30, tOut: 22.80, color: '#39ff14', line1: 'CALLED',     line2: '20x',    sub: 'IT DID 350x', top: 560 },
];

// ─── Frame-0 thumbnail (IG/TikTok cover) ────────────────────────────────────────────────────────
// ONE frame only (LivestreamShort defaults thumb.durS to 1/fps) — generated background art with the
// hook title drawn in CODE on top, never baked into the image. No em dashes.
// The title is Mike's 4b wording VERBATIM. $IF is named ONLY as code-drawn text: no project mark is
// depicted and none is invented (reference gate: $LAB and Velvet, the two projects actually spoken in
// the clip, are both generated WITH their real reference logos).
export const THUMB_DEF_WOM: ThumbDef = {
  img: THUMB_WOM,
  title: 'WHAT $IF TO A\n10 BILLION\nMARKET CAP',
  chip: 'CALLED 20x. IT DID 350x.',
  chipColor: '#39ff14',
  titleSize: 104, // 13-char longest line ("WHAT $IF TO A") stays inside the 968 px text box
};

// ─── SFX (shared library, COPIED into render-assets/sfx/; every event stays under the VO) ────────
// Whoosh on the frame-0 cover cut and on the b-roll cuts, a DING on each badge reveal, and two
// RISERS that each BUILD INTO an impact (per Impacts/WHEN-TO-USE-IMPACTS.md: reserve them for the
// beats that actually matter) — the 350x reveal and the Velvet payoff. NOTHING is placed on the
// hard-out: "and i still think it has room to grow again." ends clean and abrupt on purpose.
//
// ⚠ Cue points are each SFX's own PEAK position, not its file start. Envelopes re-measured on this
//   machine at 0.1 s RMS for this build: transition_rapid_whoosh peaks 0.10 s - DING peaks 0.20 s -
//   Kick_Impact_01 peaks 0.10 s - Boom - Big Reveal peaks 0.00 s - Tension_Rise_Logo_Reveal_3 attacks
//   0.90 s and peaks 2.50 s. Each cue is therefore started EARLY by exactly that offset so the crest
//   lands on the frame it punctuates, and each riser's `dur` is 2.50 so it ENDS exactly on its impact
//   instead of smearing across the line after it. Peak RMS differs by ~12 dB across these files, so
//   the loud ones (Boom -2.5 dB, Kick -3.1 dB) get the lower volumes.
//
// ⚠ FINAL-MIX MASKING SWEEP (contract item 7/7a, run on this clip 2026-08-07). Every cue was mixed
//   onto the bare spine OFFLINE and scored against an ENCODE-MATCHED control (the same spine pushed
//   through the same 48 kHz AAC chain as the render) with medium.en on seven short windows, one per
//   cue region. Six of the seven regions came back WORD-IDENTICAL to the control (the hook whooshes,
//   the $LAB call, the December bottom, the 350x riser+impact, the moon-boyish DING, and the "holy
//   crap man, i was way off" riser). The seventh, "the 58x on the VELVET token", read "Valvertoke"
//   against a control that read "velvet talk", so it was re-scored on THREE STAGGERED windows
//   (25.60-28.40 / 25.80-28.60 / 26.00-28.20) — the confound in contract item 7a:
//     control (the encode-matched spine)                  = 2/3 on /velvet/  <- the control ITSELF
//                                                            garbles "token" -> "talk" every time
//     Boom, dur 2.40, vol 0.28 (the original cue)         = 2/3, but its ONE miss reads "velvetoque"
//     Boom TRIMMED to 1.05 s, vol 0.28 (SHIPPED)          = 2/3, and its miss is BYTE-IDENTICAL to
//                                                            the control's ("Valver talk")
//     Boom, dur 2.40, vol 0.14 (gain-only)                = 2/3, and its miss is "velvetoque" too,
//                                                            i.e. HALVING THE GAIN CHANGED NOTHING
//   i.e. the apparent regression was a window artifact, and the fix is TIMING, not gain: the payoff
//   hit KEEPS its full 0.28 and the DECAY TAIL is cut off the words instead. The cue uses a trimmed
//   library variant, `Boom - Big Reveal-short.wav` (first 1.05 s with a 230 ms fade-out, generated
//   alongside the existing `Soundjay_Impact_Main_01-short.wav` / `card-impact-hit01-3-short.wav`
//   precedents): the transient still lands on the 26.05 cut and the tail is gone before "velvet
//   token" at 27.12. The whole sweep mixed candidates onto the bare spine offline, so it cost ZERO
//   renders.
export const SFX_WOM: Sfx[] = [
  { t:  0.00, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.24, dur: 1.00 }, // frame-0 thumbnail cut (crest 0.10)
  { t:  0.50, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.26, dur: 1.00 }, // cut into the HOOK full-screen (crest 0.60)
  { t:  5.20, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.28, dur: 1.00 }, // cut into the $LAB 20x call (crest 5.30)
  { t:  8.60, src: staticFile('sfx/DING.mp3'),                              vol: 0.20, dur: 1.60 }, // BADGE 1 reveal, the December bottom (crest 8.80)
  { t: 11.80, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_3.wav'), vol: 0.09, dur: 2.50 }, // riser BUILDS INTO the 350x reveal and ENDS exactly on it (14.30)
  { t: 14.20, src: staticFile('sfx/Impacts/Kick_Impact_01.wav'),            vol: 0.26, dur: 2.20 }, // IMPACT on the 350x cut (14.30)
  { t: 20.10, src: staticFile('sfx/DING.mp3'),                              vol: 0.22, dur: 1.60 }, // BADGE 2 reveal, the CALLED 20x / IT DID 350x receipt (crest 20.30)
  { t: 23.55, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_3.wav'), vol: 0.09, dur: 2.50 }, // riser BUILDS INTO the Velvet payoff and ENDS exactly on it (26.05)
  { t: 26.05, src: staticFile('sfx/Boom - Big Reveal-short.wav'),           vol: 0.28, dur: 1.05 }, // IMPACT on the Velvet payoff full-screen cut (peak 0.00 = fires on the frame). TRIMMED VARIANT from the masking sweep above - full gain kept, tail cut off "velvet token"
];

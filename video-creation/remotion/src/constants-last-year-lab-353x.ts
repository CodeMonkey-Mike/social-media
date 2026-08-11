import { staticFile } from 'remotion';
import type { BrollEv, Sfx } from './_kit';
import type { BadgeEv, OverlayEv, ThumbDef } from './LivestreamShort';

// ─── lab-353x-underestimate (batch: last-year, clip #2, variant: full) ──────────────────────────
// "I Estimated a 20X on LAB. We Did a 353X."
//
// An estimate-vs-actual vindication roll. He called a 20x on LAB and it did a 353x; he called a 30x
// on Velvet and it did a 58x; the 94x he thought was dead after the October 10th crash came all the
// way back. Then the self-aware turn ("should I be more of a moon boy?"), and the peak restatement:
// a 20x call that ended up 353x "in a freaking bear market nonetheless. Holy crap. Jeez."
// Register: CONVICTION / VINDICATED. Every underestimate here is a WIN that beat his own call, and
// nothing in this comp may frame a call as a mistake. Ends on a deliberate HARD-OUT, no CTA.
//
// Base clip: lab-353x-underestimate-final.mp4 (4b cut -> Phase 5 tighten -> 5B desilence at min-sil
// 0.25 -> 5C filler, which was PASSTHROUGH so -final == -tightened-desilenced byte for byte).
// ALREADY composited vertical (screen-share on top, webcam below), 1080x1920 @ 25 fps, 71.36 s.
// FINAL, do NOT re-cut and do NOT re-split the zones. The comp runs at 30 fps; OffthreadVideo
// resamples the 25 fps source by TIME, so every cue below is plain seconds taken from the clip's OWN
// Whisper word timings (clip-relative, 0-based).
//
// ⚠ The file referenced here is the render-assets COPY, re-encoded to a SEEK-FRIENDLY GOP
//   (-g 25 -keyint_min 25 -bf 0 -sc_threshold 0) by setup_render_assets.py. IDENTITY VERIFIED for
//   this build: the copy and the clip folder's -final.mp4 both report 71.360000 s and their audio
//   streams share MD5 a09d2ab4bdfc4f704043cf044f0a72d7. The canonical spine is never touched.
//
// Render (public-dir = the BATCH render-assets/, SHARED with clips #1/#3/#4 which build in parallel;
// every file this clip owns is `*-ly-lab-*` keyed so the builders cannot collide):
//   npx remotion render src/index.ts LastYearLab353xUnderestimate \
//     out/last-year/2-lab-353x-underestimate.mp4 \
//     --public-dir "<repo>/video-creation/shorts/last-year/render-assets"

export const LY_LAB_FPS = 30;
export const LY_LAB_DURATION = 2140; // floor(71.36 s x 30); last frame 2139 = t 71.300 s, inside the clip

export const CLIP_LY_LAB  = staticFile('lab-353x-underestimate.mp4');
export const THUMB_LY_LAB = staticFile('thumb-ly-lab353.png');

// Layout geometry, MEASURED on this clip (row-mean gradient scan over rows 700-1000 at
// t = 5/12/20/30/40/50/58/66 s: all eight put the hard screen-share/webcam divider on row 853,
// delta 23-215. t = 1/62/70 sit inside low-contrast page frames and report the weak 710/747 edge,
// which is the page's own interior rule, not the divider).
export const LY_LAB_SEAM  = 853; // content zone = 0..853 (the screen-share); webcam below
export const LY_LAB_CAP_Y = 890; // caption centre: 37 px under the seam. A 2-line caption spans
                                 // ~805-975; his eyes measure ~1130-1190 in every sampled frame, so
                                 // captions never cross them, and the band sits inside the scrim.
// Divider colour under a CONTENT-mode image. NOT the component default TEAL: teal is Kaspa's brand
// colour and this clip is not about Kaspa. GREEN is LAB's own brand green (see LAB.png), and it is
// the palette of five of the eight images.
export const LY_LAB_ACCENT = '#39ff14';

// ⛔ ─── HARD GUARD 1: THE CELEBRATION VIDEO DROP, 64.52-69.56 s ─────────────────────────────────
// The batch flagged "~5 s that MEASURES at speech level (mean -19.3 dB), untranscribed". MEASURED
// on this spine it is neither dead air nor Mike's off-mic reaction: it is a CELEBRATION VIDEO he
// plays in the screen-share, with its own crowd audio.
//   picture: content-zone frame-diff 72.10 at 64.520 and 49.99 at 69.560; every frame between them
//            is a moving picture-in-picture of a crowd cheering under trees (verified at t = 65.0 /
//            66.5 / 68.0 / 69.5 s), covering roughly x 0-935, y 0-555
//   audio:   continuous -17 to -22 dB from 64.88 to 69.76 with NO internal silence (0.1 s RMS), then
//            a declicked join to digital silence at 69.785-69.800 (-94 dB) before "Holy" at 69.82
//   words:   the clip's own pass AND an independent medium.en whole-clip pass both return ZERO words
//            in 64.88-69.72, so nothing may be captioned over it
// NOTHING may cover it: no b-roll, no overlay, no badge, and no SFX cue (a sting on top of a drop
// covers it in the audio domain). Captions get a BLANK entry at 65.10 so the band does not freeze
// "bear market nonetheless." on screen for 6.3 s over it. Enforced at bundle time below.
export const DROP_IN = 64.52;
export const DROP_OUT = 69.56;
const DROP_GUARD_IN = 64.30;   // 0.22 s of headroom before the picture cut
const DROP_GUARD_OUT = 69.80;  // past the drop's own audio tail (silence at 69.785-69.800)

// ⛔ ─── HARD GUARD 2: THE SCATTER-GATHER SPLICE IS AT t = 51.080 s AND IS COVERED BY B7 ─────────
// Two master ranges glued ~31 s apart (616.55-695.10 and 726.56-752.44). A full-clip frame-difference
// scan (1782 frames) puts the join at 51.080: it is the ONLY frame in the clip where the content zone
// AND the face zone jump together (content 36.43 = the leaderboard swaps to the PREMIUM MEMBERSHIP
// page, face 18.90 = his head jumps). The master confirms it word for word: segment 0 ends on the
// truncated "...so I'm calling them right" (master "right" 694.40-695.32, cut at 695.10) and segment 1
// opens 40 ms into "pumps" (master 726.52-726.94) - which is why BOTH Whisper passes read the glued
// result as "so I'm calling them pumps." and why that is what the caption says.
// B7 opens at 50.90 and BrollLayer fades in over 0.12 s, so the layer is fully opaque from 51.02 and
// the join frame is completely hidden.
// The four other diff spikes (33.84 / 53.44 / 58.28 / 62.56) are face-zone-only with a static content
// zone = ordinary 5B desilence micro-cuts. Every short in this pipeline has them; they are not covered.
export const SPLICE_T = 51.08;

// ─── B-roll beats (authored in BROLL-PLAN.md BEFORE generation; that file is the manifest) ──────
//
// WHAT THE BASE ACTUALLY SHOWS (read off rendered frames, not assumed). A 1 s-bucket content-zone
// frame-diff scan reads <= 0.3 mean across 21-47 s and 52-64 s, i.e. the page is FROZEN there:
//   0.00-20.16  the $TUT project site (yellow TUTORIAL wordmark, ca: 0xCAAE..., Buy $TUT, the WAGMI
//               mascot) - the very coin the 94x / "I thought it was dead" run is about
//   20.16-47.32 CoinMarketCap $TUT: market cap $150.77M -> $151.44M, +612.19%, the all-time chart
//               with the October collapse AND the vertical recovery spike, the Binance markets table.
//               This is the literal receipt for "it didn't recover at all" and "back to its all-time
//               high", so it is DELIBERATELY left showing for the whole of that argument
//   47.32-51.08 cryptorich.vip "Top Performing Assets" 2025 leaderboard, scrolled LIVE: MYX +55171.9%
//               552x, TRASH 148x (Mike), TUT 128x, AIA 127x, PIPPIN 89x, BROAK 34x (Mike), OMALLEY
//               18x (Mike)... THE receipt for "insane amounts of good plays". Never covered
//   51.08-64.52 cryptorich.vip PREMIUM MEMBERSHIP + a live candle chart + the 552x/198x/148x/128x
//               multiplier strip
//   64.52-69.56 the celebration video drop (HARD GUARD 1)
//   69.56-71.36 back to the membership page, under the hard-out
//
// COVERAGE (halved budget, SKILL item 4): 20.85 s of b-roll = 29.2 % (band 25-35), 50.51 s of base
// showing = 70.8 % (band 65-75). EIGHT distinct images, zero reuse. THREE full-screens = the hook,
// the 51.080 splice/turn and the climax, i.e. exactly the three sanctioned moments, at the FIRM 1-3
// cap. Beat lengths 2.25-2.95 s ("changes every 1-3 s"). No two beats are adjacent (smallest base gap
// 1.97 s), so every beat cross-fades to the base and no sub-1 s base flash exists.
//
// REFERENCE-IMAGE GATE (done LIVE for this build): `ls schedule-tweets/images/reference/` returns 24
// entries incl. LAB.png, velvet.png and TUT-tutorial.jpg. The three named projects in this clip are
// LAB (7.54 / 60.66 s), Velvet (11.76 s) and the "this" at 13.68-23.70 which the base screen-share
// identifies as $TUT - and ALL THREE were generated WITH their real reference (B2/B8 = LAB.png,
// B3 = velvet.png, B4 = TUT-tutorial.jpg, plus the cover). The other four images name no project and
// carry BLANK featureless discs and FACELESS silhouettes only; every one was visually inspected
// before render (no real coin mark, no real face, no baked text).
// staticFile() calls are LITERAL strings on purpose - the finalized-short gate scans for literal refs.
export const BROLL_LY_LAB: BrollEv[] = [
  // BASE 0.033-1.50 (1.47 s) - the frame-0 thumb is ONE frame; the video opens base-first on Mike +
  // the $TUT site under "but it's absolutely insane, man."
  { src: staticFile('broll-ly-lab-hook.png'),     tIn:  1.50, tOut:  4.15, mode: 'full'    }, // HOOK: "it just goes back to how I underestimate things" (2.76-5.26). Tiny faceless hooded silhouette at the foot of a colossal green candle column vanishing into storm cloud, his own marker line far below the top.
  // BASE 4.15-6.30 (2.15 s) - "...how I UNDERESTIMATE things." the payoff word lands on his face.
  { src: staticFile('broll-ly-lab-labcall.png'),  tIn:  6.30, tOut:  8.55, mode: 'content' }, // THE CALL: "the 20x on LAB and we did a..." (6.60-8.60). The REAL LAB flask mark (reference), green light erupting out of it. Content mode so his face carries the number.
  // BASE 8.55-10.60 (2.05 s) - "...353x." The first big number lands on the base + the 353X badge.
  { src: staticFile('broll-ly-lab-velvet.png'),   tIn: 10.60, tOut: 12.85, mode: 'content' }, // THE SECOND CALL: "I estimated like a 30x on Velvet and we did a 58x" (10.18-13.24). The REAL Velvet chevron (reference) over a rising violet ribbon.
  // BASE 12.85-16.90 (4.05 s) - "and we did a 94x on this..." over the $TUT site that IS "this",
  // plus the 94X badge.
  { src: staticFile('broll-ly-lab-comeback.png'), tIn: 16.90, tOut: 19.55, mode: 'content' }, // THE COMEBACK: "I didn't think it was going to make a comeback... go back to its all time high" (17.46-20.92). The REAL amber wedge-T mark (reference) rising out of cold ash.
  // ⛔ BASE 19.55-24.30 (4.75 s) - DELIBERATE: the CMC $TUT page arrives at 20.16 and is the receipt
  // for "essentially dead" and "all time high".
  { src: staticFile('broll-ly-lab-crash.png'),    tIn: 24.30, tOut: 26.90, mode: 'content' }, // THE CRASH: "after this October 10th crash and seeing that it didn't recover at all" (24.34-28.48). Red canyon of shattered candles, BLANK featureless discs tumbling.
  // ⛔ BASE 26.90-36.60 (9.70 s) - DELIBERATE, the long one: "just kept it going down after October
  // 10th. I underestimated this too. this is crazy because I'm like, you know, should I be such..."
  // The frozen CMC chart underneath literally draws the bleed he is describing, and the self-aware
  // turn is pure delivery.
  { src: staticFile('broll-ly-lab-moonboy.png'),  tIn: 36.60, tOut: 39.45, mode: 'content' }, // MOON BOY: "should I be more of a moon boy?" (37.94-39.40). Faceless hooded silhouette on a crescent moon over a skyline of green candle towers.
  // ⛔ BASE 39.45-50.90 (11.45 s) - DELIBERATE, the longest gap in the clip and the most valuable:
  // the Top Performing Assets LEADERBOARD reveals at 47.32 and is scrolled live until ~50.5. Covering
  // the clip's single best receipt to hit a b-roll quota is the documented WRONG call, so the reveal
  // is marked with an SFX impact instead of a picture.
  { src: staticFile('broll-ly-lab-pumps.png'),    tIn: 50.90, tOut: 53.55, mode: 'full'    }, // THE TURN + THE SPLICE COVER (join at 51.080): "so I'm calling them pumps. now I'm getting the good coins" (49.88-53.16). One blank disc lifted glowing out of a field of dull ones.
  // BASE 53.55-59.60 (6.05 s) - "but I have these lower expectations. the biggest disparity was..."
  // pure face, with the multiplier strip under it.
  { src: staticFile('broll-ly-lab-climax.png'),   tIn: 59.60, tOut: 62.55, mode: 'full'    }, // CLIMAX: "a 20x off of LAB and it ends up going to 353x" (59.68-62.56). The REAL LAB mark (reference) blazing on a frozen bear-market ridge, green column bursting out of the ice.
  // BASE 62.55-64.52 (1.97 s) - "you know, freaking bear market nonetheless." on his face.
  // ⛔ 64.52-69.56 THE CELEBRATION DROP - nothing over it (HARD GUARD 1).
  // BASE 69.56-71.36 (1.80 s) - the deliberate HARD-OUT, "holy crap. geez.", on his face. No graphic,
  // no SFX, no tail, no CTA.
];

// ─── Code-drawn badges (the two numbers that land on BASE beats) ────────────────────────────────
// One line + one sub each: the shared `Badge` is left:50% with translate(-50%,-50%) and no width, so
// a shrink-to-fit box caps around 540 px. At top 590 the box spans y ~494-686, i.e. >= 119 px clear
// of a 2-line caption's top edge (805) and clear of the $TUT site's own "GET IT" banner (y ~820).
// Both sit INSIDE base gaps (8.55-10.60 and 12.85-16.90), neither shares a frame with a b-roll beat
// or with the other (gap 4.35 s), and neither starts under the frame-0 cover.
export const BADGES_LY_LAB: BadgeEv[] = [
  { tIn:  8.70, tOut: 10.30, color: '#39ff14', line1: '353X', sub: 'CALLED 20X',  top: 590 },
  { tIn: 14.65, tOut: 16.30, color: '#ffe600', line1: '94X',  sub: 'LEFT FOR DEAD', top: 590 },
];

// ─── Overlays: NONE, deliberately ───────────────────────────────────────────────────────────────
// The three named projects are carried by reference-generated b-roll (their real marks), the two
// hard numbers are code-drawn badges, and there is no third graphic in this clip that would earn a
// frame. So the only timed graphics are the frame-0 cover (ONE frame), the two badges and the caption
// band, and none of them can collide in time OR space.
export const OVERLAYS_LY_LAB: OverlayEv[] = [];

// ─── Frame-0 thumbnail (IG/TikTok cover) ────────────────────────────────────────────────────────
// ONE frame only (LivestreamShort defaults thumb.durS to 1/fps) - generated background art with the
// hook title drawn in CODE on top, never baked into the image. No em dashes. The art was prompted
// with an almost EMPTY near-black upper 45 % precisely so the code-drawn title block (rows ~240-590)
// and the chip (~624-709) sit on clean negative space, far above the 1680 px safe-zone line, with the
// real LAB mark glowing in the lower third.
export const THUMB_DEF_LY_LAB: ThumbDef = {
  img: THUMB_LY_LAB,
  title: 'I SAID 20X.\nLAB DID\n353X.',
  chip: 'IN A BEAR MARKET',
  chipColor: '#39ff14',
  titleSize: 116, // longest line "I SAID 20X." = 11 chars, ~800 px inside the 968 px text box
};

// ─── SFX (shared library, COPIED into render-assets/sfx/; every event stays under the VO) ───────
// Whoosh on the frame-0 cover cut, a sweep INTO the hook full-screen, a whoosh on the first content
// cutaway, a ding and an impact on the two number badges, an impact on the crash cut, an impact on
// the LEADERBOARD REVEAL (the clip's best receipt, marked with sound instead of a picture), and a
// short riser that BUILDS INTO the climax impact. 9 events, 8 distinct files.
//
// ⚠ Cue points are each file's own measured CREST, not its file start. Envelopes measured on THIS
//   machine for this build (0.10 s window / 0.05 s hop, mono 48 kHz):
//     transition_rapid_whoosh        crest 0.15 (-14.3 dB), file 0.97 s
//     Cinematic Whoosh 02            crest 0.80 (-11.2 dB), file 2.24 s
//     DING.mp3                       crest 0.15 (-12.8 dB), -20 dB by 0.85 s
//     Kick_Impact_01-short           crest 0.15 ( -3.0 dB), file 0.55 s (faded library variant)
//     Impact_Hit_01-2-short          crest 0.10 ( -8.6 dB), file 0.55 s (faded library variant)
//     Soundjay_Impact_Main_01-short  crest 0.25 ( -3.0 dB), file 0.68 s (faded library variant)
//     Boom - Big Reveal-short        crest 0.05 ( -2.3 dB), file 1.05 s
//     Tension_Rise_Logo_Reveal_3-1s  crest 0.65 ( -8.8 dB), file 1.00 s
//   Each cue starts EARLY by exactly that offset so the crest lands on the frame it punctuates, the
//   riser's `dur` 0.65 makes it END exactly on its impact instead of smearing over the line after it,
//   and all three impacts are the TRIMMED library variants (timing/tail is the first masking knob,
//   not gain - SKILL 7/7a).
//
// ⚠ TWO CUES WERE CHANGED BY AN OFFLINE, ENCODE-MATCHED WHISPER SWEEP (SKILL 7a; zero renders - each
//   candidate was mixed onto the BARE SPINE with ffmpeg and scored against a control that is the same
//   spine pushed through the render's own 48 kHz / AAC 317k chain, medium.en, SHORT STAGGERED windows):
//   1. A whoosh on the B7 turn/splice cut (t 50.75, crest 50.90) was BUILT, TESTED and DELETED. It
//      turned "so I'm calling them PUMPS" into "PUNKS" at 2 of 3 offsets. That word sits ON the
//      51.080 splice (a truncated "them" glued to a clipped "pumps"), so it is already fragile and
//      any broadband noise flips it. TIMING was tried first per the contract - moving the crest into
//      the real 51.52-51.76 speech gap (t 51.47) still read "punks" at 50.40 - and the cue is
//      DECORATION on a transition, not a payoff hit, so it was deleted (eliza clip-3 precedent). The
//      cut is still marked by the hard picture change and by B7 itself.
//   2. The climax RISER was swapped from Tension_Rise_Logo_Reveal_3 (5.76 s file, crest 2.55, so it
//      ran from 57.05 and sat under "the biggest disparity was, okay") to the 1 s library variant
//      starting at 58.95. The long riser inserted a phantom "well" after "okay" at BOTH 0.09 and
//      0.06 gain - exactly the contract's warning that gain is the wrong knob - and shortening it
//      took the climax windows from 1/3 to 2/3 MATCH. The one surviving DIFF is that same inserted
//      "well" with the riser no longer covering the word at all, i.e. it is the autoregressive
//      decoder reacting to the (unchanged, full-gain) payoff impact later in the window; NO real word
//      is lost in any window, and the 58.20 offset that contains the whole payoff line MATCHES.
//   Everything else swept 17/18 MATCH; the single DIFF (5.60) is a window-boundary artifact where
//   both reads hallucinate the leading token and the two neighbouring offsets MATCH.
//
// ⛔ NOTHING is scheduled between 64.30 and 69.80 s (the celebration drop) and NOTHING sits on the
//   hard-out "holy crap. geez." (69.72-71.10). Both are enforced below.
export const SFX_LY_LAB: Sfx[] = [
  { t:  0.00, src: staticFile('sfx/transition_rapid_whoosh.mp3'),               vol: 0.24, dur: 1.00 }, // frame-0 cover cut (0.033); crest 0.15
  { t:  0.70, src: staticFile('sfx/Cinematic Whoosh 02.wav'),                   vol: 0.16, dur: 1.80 }, // sweeps INTO the B1 HOOK full-screen (crest 1.50 = the cut)
  { t:  6.15, src: staticFile('sfx/transition_rapid_whoosh.mp3'),               vol: 0.20, dur: 1.00 }, // B2, the LAB content cutaway (crest 6.30)
  { t:  8.55, src: staticFile('sfx/DING.mp3'),                                  vol: 0.20, dur: 1.20 }, // the 353X badge (crest 8.70)
  { t: 14.50, src: staticFile('sfx/Impacts/Kick_Impact_01-short.wav'),          vol: 0.24, dur: 0.60 }, // IMPACT on the 94X badge (crest 14.65)
  { t: 24.20, src: staticFile('sfx/Impacts/Impact_Hit_01-2-short.wav'),         vol: 0.24, dur: 0.60 }, // IMPACT on the B5 crash cut, crest 24.30 inside the 24.20-24.34 speech gap
  { t: 47.09, src: staticFile('sfx/Impacts/Soundjay_Impact_Main_01-short.wav'), vol: 0.24, dur: 0.70 }, // IMPACT on the LEADERBOARD REVEAL, crest 47.34 inside the 47.24-47.44 speech gap
  { t: 58.95, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_3-1s.wav'),  vol: 0.10, dur: 0.65 }, // short riser BUILDS INTO the climax and ENDS exactly on it (59.60)
  { t: 59.55, src: staticFile('sfx/Boom - Big Reveal-short.wav'),               vol: 0.26, dur: 1.05 }, // IMPACT on the B8 CLIMAX cut (crest 59.60)
];

// ─── Captions ───────────────────────────────────────────────────────────────────────────────────
// Built by the canonical tool, house style, no hand edits to the grouping:
//   python video-creation/skills/captions/build_captions.py \
//     --words <clip>/whisper-words.json --style montserrat --var CAPTIONS_LY_LAB \
//     --colorize "y=20x,30x gr=353x,58x,94x r=dead,crash"
// Colour carries the clip's argument: <y> on the ESTIMATES (20x, 30x), <gr> on what they ACTUALLY
// did (353x, 58x, 94x), <r> on "dead" and "crash".
//
// ⚠ ONE correction was added to the canonical tool for this clip (PHRASE_CORRECTIONS, keyed):
//   "seeing that I didn't recover at all" -> "seeing that IT didn't recover at all". The subject is
//   the COIN; the clip's own pass put the failure on Mike, which inverts the register. medium.en
//   whole-clip on this spine and the master both read "it".
// ⚠ "lab" -> "LAB" / "velvet" -> "Velvet" were NOT added: they are casing-only, and the montserrat
//   preset lowercases everything via CSS, so the fix would be invisible on screen. The real branding
//   is carried by the reference-generated b-roll instead.
// ⚠ The BLANK entry at 65.10 clears the caption band over the celebration drop (HARD GUARD 1).
//   Without it the component holds "bear market nonetheless." on screen for 6.26 s.
export const CAPTIONS_LY_LAB: { t: number; h: string }[] = [
  { t:   0.00, h: 'but it\'s absolutely' },
  { t:   0.96, h: 'insane, man.' },
  { t:   2.04, h: 'i go, it just goes' },
  { t:   3.22, h: 'back to how i' },
  { t:   4.32, h: 'underestimate things.' },
  { t:   5.76, h: 'i estimated the' },
  { t:   6.60, h: '<y>20x</y> on lab and we' },
  { t:   8.16, h: 'did a <gr>353x</gr> i' },
  { t:  10.18, h: 'estimated like a' },
  { t:  11.10, h: '<y>30x</y> on velvet' },
  { t:  12.00, h: 'and we did a <gr>58x</gr>' },
  { t:  13.68, h: 'and we did a <gr>94x</gr>' },
  { t:  15.32, h: 'on this and i' },
  { t:  15.96, h: 'didn\'t think we' },
  { t:  16.48, h: 'were going to' },
  { t:  16.98, h: 'i didn\'t, i' },
  { t:  17.46, h: 'didn\'t think it' },
  { t:  18.00, h: 'was going to' },
  { t:  18.30, h: 'make a comeback.' },
  { t:  18.96, h: 'i didn\'t think' },
  { t:  19.24, h: 'it was going' },
  { t:  19.60, h: 'to go back to its' },
  { t:  20.38, h: 'all time high.' },
  { t:  20.94, h: 'i thought it' },
  { t:  21.46, h: 'was, it was' },
  { t:  21.98, h: 'essentially <r>dead</r> if' },
  { t:  22.90, h: 'it was going' },
  { t:  23.26, h: 'to pump.' },
  { t:  23.84, h: 'but i mean' },
  { t:  24.34, h: 'after this october' },
  { t:  25.20, h: '10th <r>crash</r> and' },
  { t:  26.82, h: 'seeing that it' },
  { t:  27.46, h: 'didn\'t recover at' },
  { t:  28.28, h: 'all, just kept it' },
  { t:  28.98, h: 'going down after' },
  { t:  29.90, h: 'october 10th.' },
  { t:  30.76, h: 'i mean, i' },
  { t:  31.92, h: 'underestimated this too.' },
  { t:  33.22, h: 'this is like, this is' },
  { t:  34.30, h: 'like, it\'s crazy' },
  { t:  35.02, h: 'because i\'m like' },
  { t:  35.78, h: 'you know, should' },
  { t:  36.48, h: 'i be such' },
  { t:  37.94, h: 'should i be' },
  { t:  38.36, h: 'more of a moon boy?' },
  { t:  39.48, h: 'because i am' },
  { t:  40.34, h: 'just not seeing' },
  { t:  42.72, h: 'i\'m seeing the' },
  { t:  43.38, h: 'good plays and' },
  { t:  44.02, h: 'i\'m playing them' },
  { t:  44.68, h: 'right?' },
  { t:  45.02, h: 'obviously i got' },
  { t:  45.66, h: 'all these amazing' },
  { t:  46.68, h: 'plays.' },
  { t:  47.44, h: 'it\'s insane amounts' },
  { t:  48.60, h: 'of good plays' },
  { t:  49.46, h: 'right?' },
  { t:  49.88, h: 'so i\'m calling' },
  { t:  50.70, h: 'them pumps.' },
  { t:  51.76, h: 'now i\'m getting' },
  { t:  52.36, h: 'the good coins' },
  { t:  53.20, h: 'but i have' },
  { t:  54.00, h: 'these lower expectations.' },
  { t:  55.72, h: 'like, obviously the' },
  { t:  56.58, h: 'biggest, the biggest' },
  { t:  57.32, h: 'disparity was, okay' },
  { t:  58.64, h: 'we\'re, i\'m probably' },
  { t:  59.32, h: 'going to get' },
  { t:  59.68, h: 'a <y>20x</y> off of lab' },
  { t:  60.82, h: 'and it ends up' },
  { t:  61.32, h: 'going to <gr>353x</gr>' },
  { t:  62.56, h: 'you know, freaking' },
  { t:  63.46, h: 'bear market nonetheless.' },
  { t:  65.10, h: '' },
  { t:  69.72, h: 'holy crap.' },
  { t:  70.78, h: 'geez.' },
];

// ─── Bundle-time guards ─────────────────────────────────────────────────────────────────────────
// Mechanical, because these are exactly the rules this repo keeps re-breaking by hand: graphics
// colliding in time, and something being laid over a protected beat. They run at import, so a
// violation fails the bundle instead of shipping.
type Win = { id: string; tIn: number; tOut: number };

const GFX_WINDOWS: Win[] = [
  ...OVERLAYS_LY_LAB.map((o, i) => ({ id: `O${i + 1} ${o.src.split('/').pop()}`, tIn: o.tIn, tOut: o.tOut })),
  ...BADGES_LY_LAB.map((b, i) => ({ id: `B${i + 1} ${b.line1}`, tIn: b.tIn, tOut: b.tOut })),
];

function assertNothingOverTheDrop() {
  const bad = [
    ...GFX_WINDOWS,
    ...BROLL_LY_LAB.map((b, i) => ({ id: `broll${i + 1} ${b.src.split('/').pop()}`, tIn: b.tIn, tOut: b.tOut })),
  ].filter(w => w.tIn < DROP_GUARD_OUT && w.tOut > DROP_GUARD_IN);
  if (bad.length) {
    throw new Error(
      `lab-353x-underestimate: ${bad.map(b => b.id).join(', ')} overlaps the celebration video drop ` +
      `(${DROP_IN}-${DROP_OUT} s). It is CONTENT, not dead air: nothing may cover it.`);
  }
  const sfxBad = SFX_LY_LAB.filter(s => s.t < DROP_GUARD_OUT && s.t + (s.dur ?? 2) > DROP_GUARD_IN);
  if (sfxBad.length) {
    throw new Error(
      `lab-353x-underestimate: an SFX cue at t=${sfxBad[0].t} runs across the celebration drop ` +
      `(${DROP_IN}-${DROP_OUT} s). A sting on top of it covers it in the audio domain.`);
  }
}

function assertSpliceIsCovered() {
  const cover = BROLL_LY_LAB.find(b => b.tIn <= SPLICE_T - 0.12 && b.tOut > SPLICE_T);
  if (!cover) {
    throw new Error(`lab-353x-underestimate: the ${SPLICE_T}s scatter-gather splice is NOT covered ` +
      `by a b-roll beat that is already fully opaque (tIn <= ${SPLICE_T - 0.12}).`);
  }
}

function assertHardOutIsClean() {
  const late = [...GFX_WINDOWS, ...BROLL_LY_LAB.map((b, i) => ({ id: `broll${i + 1}`, tIn: b.tIn, tOut: b.tOut }))]
    .filter(w => w.tOut > DROP_OUT);
  const lateSfx = SFX_LY_LAB.filter(s => s.t + (s.dur ?? 2) > DROP_OUT);
  if (late.length || lateSfx.length) {
    throw new Error(`lab-353x-underestimate: nothing may run past ${DROP_OUT}s - "holy crap. geez." ` +
      `is a deliberate HARD-OUT on his face with no graphic, no sting and no tail.`);
  }
}

function assertNoGraphicsOverlap() {
  const s = [...GFX_WINDOWS].sort((a, b) => a.tIn - b.tIn);
  for (let i = 1; i < s.length; i++) {
    if (s[i].tIn < s[i - 1].tOut) {
      throw new Error(`lab-353x-underestimate: graphics overlap in time: ${s[i - 1].id} and ${s[i].id}. ` +
        `Overlays and badges must never share a frame (SKILL Phase 7 production rule 3).`);
    }
  }
  // No badge/overlay may share a frame with a b-roll beat (a content-mode image owns 0..seam, which
  // is the same band a badge sits in).
  for (const w of GFX_WINDOWS) {
    const clash = BROLL_LY_LAB.find(b => w.tIn < b.tOut && w.tOut > b.tIn);
    if (clash) {
      throw new Error(`lab-353x-underestimate: ${w.id} shares a frame with b-roll ` +
        `${clash.src.split('/').pop()} (${clash.tIn}-${clash.tOut}s).`);
    }
  }
  // Nothing may start under the frame-0 thumbnail cover (one frame = 1/30 s).
  const early = [...GFX_WINDOWS, ...BROLL_LY_LAB.map((b, i) => ({ id: `broll${i + 1}`, tIn: b.tIn, tOut: b.tOut }))]
    .filter(w => w.tIn < 1 / LY_LAB_FPS);
  if (early.length) throw new Error(`lab-353x-underestimate: ${early[0].id} starts under the frame-0 thumb.`);
}

function assertBudget() {
  const covered = BROLL_LY_LAB.reduce((a, b) => a + (b.tOut - b.tIn), 0);
  const pct = (covered / (LY_LAB_DURATION / LY_LAB_FPS)) * 100;
  if (pct < 25 || pct > 35) {
    throw new Error(`lab-353x-underestimate: b-roll coverage ${pct.toFixed(1)} % is outside the ` +
      `halved budget band (25-35 %, target ~30 %).`);
  }
  const full = BROLL_LY_LAB.filter(b => b.mode === 'full').length;
  if (full < 1 || full > 3) {
    throw new Error(`lab-353x-underestimate: ${full} full-screen beats; the cap is FIRM at 1-3.`);
  }
}

assertNothingOverTheDrop();
assertSpliceIsCovered();
assertHardOutIsClean();
assertNoGraphicsOverlap();
assertBudget();

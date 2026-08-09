import { staticFile } from 'remotion';
import type { Sfx } from './_kit';
import type { BadgeEv, OverlayEv, ThumbDef } from './LivestreamShort';

// ─── tut-94x-euphoria-impact (batch: tutorial, clip #6, variant: impact) ────────────────────────
// "Look, Look, Holy Crap: The 94X, Then a 550X One Week Later" — the stream's single hardest run,
// standing alone: a live CoinMarketCap $TUT chart reveal that breaks into "look, look, holy crap",
// a held "ohhh man", and the two community numbers back to back (94X, then a 550X one week later),
// closing on a Schwarzenegger soundboard drop that names the community.
//
// Base clip: tut-94x-euphoria-impact.mp4 in the BATCH render-assets/ = the GOP-restaged copy of
// tut-94x-euphoria-impact-final.mp4 (raw cut -> Phase 5 tighten -> 5B desilence at min-sil 0.95 ->
// 5C filler). ALREADY composited vertical (screen-share on top, webcam below), 1080x1920, 25 fps,
// 28.22 s, keyframe every 1.00 s (29 keyframes, verified). FINAL: do NOT re-cut, do NOT re-split the
// zones. The comp runs at 30 fps; OffthreadVideo resamples the 25 fps source BY TIME, so every cue
// below is plain seconds off this clip's own Whisper words (clip-relative, 0-based).
//
// ⛔ ZERO tighten removals and ZERO desilence removals: this clip contains NO dead air (25.36 s
// voiced across 14 regions, largest gap 0.86 s). Every pause is a deliberate rhythm beat inside
// protected material. Nothing in this file may be built on the assumption of slack.
//
// Render (public-dir = the BATCH render-assets/, shared with 7 other clips; every file of this clip
// is `*-tut6*` prefixed so concurrent builders cannot collide — clip #1 is the FULL cut of
// overlapping audio and is being built at the same time):
//   npx remotion render src/index.ts TutEuphoriaImpact \
//     out/tutorial/6-tut-94x-euphoria-impact.mp4 \
//     --public-dir "<repo>/video-creation/shorts/tutorial/render-assets"

export const TUT6_FPS = 30;
// 846 frames = 28.200 s. Chosen against BOTH stream durations, which differ on this spine:
//   video 28.160 s (704 frames @25) | audio 28.223 s.
// The audible tail of the soundboard sample runs to 28.18 (0.02 s RMS: -32.6 dB at 28.16-28.18,
// -67 dB at 28.18, -94 dB at 28.20), so the comp MUST reach 28.18 or it trims the 0.31 s of sample
// the tighten relock was authored to rescue. 846 covers it with 0.02 s of digital silence to spare;
// 845 (28.167 s) would clip it. The last video frame (index 703, PTS 28.12) is displayed through
// 28.16, so exactly ONE comp frame (845, t 28.1667) sits past the video stream and holds that last
// frame; verified by a tail render before the full pass.
export const TUT6_DURATION = 846;

export const CLIP_TUT6  = staticFile('tut-94x-euphoria-impact.mp4');
export const THUMB_TUT6 = staticFile('thumb-tut6.png');

// Layout geometry, MEASURED on this clip (row-mean gradient scan at t = 0.2/3/7/11/15/19/24/27.5 s).
// All EIGHT frames put the hard screen-share/webcam divider on the same row, delta 63-221.
export const TUT6_SEAM  = 854; // content zone = 0..854 (the live CoinMarketCap $TUT page); webcam below
export const TUT6_CAP_Y = 890; // caption centre: 36 px under the seam, on his hair, never his eyes (1180+)

// ─── ⛔ NO B-ROLL LAYER, BY MIKE'S PHASE 7 DIRECTIVE FOR THIS BATCH ──────────────────────────────
// tighten-plan.json -> mike_4b.build_directives (Mike, 2026-08-09, CLARIFIED):
//   "i only do not want full screen broll, nor content zone broll. you can do captions, sfx, and any
//    overlaying graphics or images with background transparency."
//   "The test is COVERAGE, not the asset's source: a transparent-background PNG laid over the base is
//    fine, a full-frame or content-zone image is not."
// So `broll` is deliberately ABSENT from the ShortData and there is no BrollLayer beat in this comp.
// This is a DECLARED DEVIATION from finalized-short contract item 4 (~30 % generated b-roll,
// 1-3 full-screens at hook/transitions/climax); it is Mike's own recorded directive, not a
// delegation, and it is flagged verbatim in the build report rather than waived.
//
// It costs this clip nothing: the content zone IS the receipt here (0-5.5 s and 10-22.9 s it is the
// live CMC $TUT page zooming into the vertical spike he is pointing at, 6-10 s his own crowd
// celebration insert, 22.9-28.2 s the Schwarzenegger clip playing full-frame).
//
// ⛔ THE PAYOFF IS A SOUNDBOARD DROP AND NOTHING MAY COVER IT. Master 353.36-358.62 = clip
// 22.94-28.20, "And that's why CodeMonkey Mike has the greatest crypto community on the planet",
// is a Schwarzenegger sample, not Mike, and it ENDS the clip. No overlay, no badge and no SFX exists
// at t >= 22.30 in this file. Captions only.

// ─── Transparent-alpha overlay stickers (the ONLY image assets over the base) ───────────────────
// Each PNG is generated as luminous art on a flat pure-black field, then keyed to TRUE ALPHA
// (alpha = luminance, colour un-premultiplied) by the clip folder's `_key_alpha.py`, so they are
// literal "images with background transparency" and are composited with blend 'normal' (NOT the
// legacy 'screen', which cannot show over a light background).
//
// ONE FIXED SLOT for all three, x 760-1060 / y 1040-1340: the dark shadowed green-screen band right
// of Mike's head, in the FACE zone. Measured over each overlay's own window (4 frames each): luma
// 11-22/255, std 12-18. It is NOT in the content zone (which ends at 854), it clears the caption
// band (a 2-line caption bottoms out near 970, so >= 70 px of air) and it clears the 240 px platform
// safe zone (slot bottom 1340 vs 1680). One slot = a structural guarantee that no two graphics can
// ever collide in space, and the windows below never touch in time either.
const SLOT = { top: 1040, left: 760, width: 300, blend: 'normal' as const };

export const OVERLAYS_TUT6: OverlayEv[] = [
  { src: staticFile('broll-tut6-breakout-arrow.png'),  tIn:  1.10, tOut:  3.50, ...SLOT }, // "look at, look at this" (2.44-3.86) - the chart reveal
  { src: staticFile('broll-tut6-euphoria-burst.png'),  tIn:  6.20, tOut:  8.40, ...SLOT }, // the 2.36 s HELD VOWEL "ohhh" (5.94-8.26) - the euphoria break
  { src: staticFile('broll-tut6-second-rocket.png'),   tIn: 20.20, tOut: 22.30, ...SLOT }, // "on nyx on bnb again" (19.52-22.86) - the second, bigger run
];
// BASE, unobstructed: 0.03-1.10, 3.50-6.20, 8.40-10.90, 12.90-14.95, 16.70-17.60, 19.60-20.20 and
// the whole protected 22.30-28.20 payoff.

// ─── Code-drawn badges ──────────────────────────────────────────────────────────────────────────
// top 560 (the shared Badge is centre-anchored) => panel ~y 455-665, which lands on the CMC AI
// question-chip row: measured std 25-26 / luma 244, i.e. flat white UI, not data. The chart plot
// ends at y ~410 and the "Tutorial Markets" table heading starts at ~620, so no chart pixel and no
// market row is hidden. Longest lines are "SEPTEMBER" (9 ch @60 px) and "550X" (4 ch @82 px), both
// inside the component's ~436 px text box, so nothing wraps and the box never grows downwards into
// the caption band.
//
// The three windows are 2.05 s and 0.90 s apart and none overlaps an overlay window, so no two
// graphics share a frame (they are also in different bands: y 455-665 vs y 1040-1340).
export const BADGES_TUT6: BadgeEv[] = [
  { tIn: 10.90, tOut: 12.90, color: '#00e5ff', line1: 'SEPTEMBER', line2: 'OCTOBER', sub: 'ABSOLUTELY INSANE', top: 560 },
  { tIn: 14.95, tOut: 16.70, color: '#ffe600', line1: '94X',                          sub: 'WE DID THIS',       top: 560 },
  { tIn: 17.60, tOut: 19.60, color: '#39ff14', line1: '550X',                         sub: 'ONE WEEK LATER',    top: 560 },
];

// ─── Frame-0 thumbnail (IG/TikTok cover) ────────────────────────────────────────────────────────
// ONE frame only (LivestreamShort defaults thumb.durS to 1/fps), base video from frame 1.
// The background is a CAPTURED FRAME of this clip's own spine at 16.20 s (SKILL Phase 7 rule 5
// explicitly allows a captured frame as the cover): Mike mid-exclamation with the zoomed $TUT chart
// spike behind him, i.e. the receipt itself. Title + chip are drawn in CODE on top, never baked in.
// No em dashes.
export const THUMB_DEF_TUT6: ThumbDef = {
  img: THUMB_TUT6,
  title: 'LOOK, LOOK,\nHOLY CRAP',
  chip: '94X. THEN A 550X.',
  chipColor: '#ffe600',
  titleSize: 128, // longest line "LOOK, LOOK," = 11 chars, stays inside the 968 px text box
};

// ─── SFX (shared library, COPIED into render-assets/sfx/) ───────────────────────────────────────
// 8 events. Whoosh on the frame-0 cover cut and into each overlay sticker, a short impact on "HOLY
// CRAP", a ting on the euphoria burst, a ding on the 94X plate, and a riser that BUILDS INTO the
// 550X impact and ends exactly on it (Impacts/WHEN-TO-USE-IMPACTS.md: "build the anticipation",
// "reserve them for the beats that actually matter").
//
// ⛔ NOTHING FIRES AT OR AFTER 20.10. A sting on top of the Schwarzenegger soundboard drop is the
// same defect as a sting masking the VO, and that line is the payoff and the ending.
//
// ⚠ Cue points are each file's own MEASURED crest, not its file start (0.05 s-window RMS envelope,
// measured on this machine for this build): transition_rapid_whoosh crests 0.15 s in (audible to
// 0.89) - Soundjay_Impact_Main_01-short crests 0.32 (audible to 0.62) - TING crests 0.81 (to 1.50) -
// DING crests 0.19 (to 1.16) - Impact_Hit_01-2 crests 0.13 (to 6.11, so it is TRUNCATED by `dur`) -
// Tension_Rise_Logo_Reveal_3 crests 3.77 (to 5.68). Each `t` below is the target frame MINUS that
// offset, so the transient lands on the beat it punctuates.
//
// ⚠ Placement note: this clip has NO silence at all between 5.32 s and 14.00 s (8.68 s unbroken),
// so a cue in that window necessarily sits on speech. Only two do, both quiet and both on sustained
// vowels rather than consonants. The 20.05 whoosh is deliberately crested at 20.20, inside the
// measured 20.16-20.38 silence. The SEPTEMBER/OCTOBER badge is intentionally SILENT: there is no
// clean slot for it and an extra ding there would be decoration, not punctuation.
export const SFX_TUT6: Sfx[] = [
  { t:  0.00, src: staticFile('sfx/transition_rapid_whoosh.mp3'),               vol: 0.24, dur: 1.00 }, // frame-0 cover cut (crest 0.15)
  { t:  0.95, src: staticFile('sfx/transition_rapid_whoosh.mp3'),               vol: 0.18, dur: 0.95 }, // sweeps into the O1 arrow (crest 1.10)
  { t:  4.40, src: staticFile('sfx/Impacts/Soundjay_Impact_Main_01-short.wav'), vol: 0.24, dur: 0.70 }, // IMPACT on "HOLY" (crest 4.72); the SHORT variant, tail gone by 5.02, before "crap" at 5.28
  { t:  5.39, src: staticFile('sfx/TING SOUND EFFECT.mp3'),                     vol: 0.16, dur: 1.60 }, // euphoria burst O2 (crest 6.20), over the held vowel
  { t: 14.76, src: staticFile('sfx/DING.mp3'),                                  vol: 0.20, dur: 1.20 }, // the 94X plate (crest 14.95)
  { t: 15.10, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_3.wav'),     vol: 0.10, dur: 2.50 }, // riser through the 0.86 s drum-roll, ENDS exactly on the 550X hit (17.60)
  { t: 17.47, src: staticFile('sfx/Impacts/Impact_Hit_01-2.wav'),               vol: 0.26, dur: 1.80 }, // CLIMAX: the 550X plate (crest 17.60); truncated so the tail is gone before "on nyx" (19.52)
  { t: 20.05, src: staticFile('sfx/transition_rapid_whoosh.mp3'),               vol: 0.20, dur: 0.95 }, // into the O3 rockets (crest 20.20, inside the 20.16-20.38 silence)
];

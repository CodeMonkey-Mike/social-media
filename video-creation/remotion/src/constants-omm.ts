import { staticFile } from 'remotion';
import type { BrollEv, Sfx } from './_kit';
import type { ThumbDef } from './LivestreamShort';

// ─── october-mandela-myth (batch: october-bottom, clip #1, variant: long) ───────────────────────
// "The October Bottom Is a Mandela Effect" — everybody remembers 1929 and 1987 and nobody remembers
// the other 97 years, so "October is the worst month" is a false collective memory: October is the
// 6th worst of 12, positive 62 % of years since 1927, there has NEVER been a crypto October bottom
// before, and because the believers will front-run it the real bottom prints BEFORE October.
//
// Base clip: october-mandela-myth-tightened-desilenced.mp4 (raw cut -> Phase 5 tighten -> 5B
// desilence -> burst-removal of a 0.52 s cough at 47.68). ALREADY composited vertical (screen-share
// on top, webcam below), 1080x1920 @ 25 fps, 114.20 s. FINAL, do NOT re-cut and do NOT re-split the
// zones. The comp runs at 30 fps; OffthreadVideo resamples the 25 fps source by TIME, so every cue
// below is plain seconds taken from the clip's own Whisper word timings (clip-relative, 0-based).
//
// ⚠ The file referenced here is the render-assets COPY, re-encoded to a SEEK-FRIENDLY GOP
//   (-g 25 -keyint_min 25 -bf 0 -sc_threshold 0, CRF 18) — mandatory since the 2026-08-03 finding
//   that Remotion's concurrent OffthreadVideo seeks die mid-render on the long-GOP original. The
//   canonical spine in the clip folder is never touched.
//
// Render (public-dir = the CLIP's render-assets/, which holds the spine + thumbnail + b-roll + sfx):
//   npx remotion render src/index.ts OctoberMandelaMyth \
//     out/october-bottom/1-october-mandela-myth.mp4 \
//     --public-dir "<repo>/video-creation/shorts/october-bottom/october-mandela-myth/render-assets"

export const OMM_FPS = 30;
export const OMM_DURATION = 3426; // 114.20 s @30; last frame index 3425 = t 114.167 s, inside the clip

export const CLIP_OMM  = staticFile('october-mandela-myth.mp4');
export const THUMB_OMM = staticFile('thumbnail-omm.png');

// Layout geometry, MEASURED on this clip (row-mean gradient scan at t=2/12/25/40/48/55/65/75/90/105/113 s;
// all eleven frames put the hard screen-share/webcam divider on the same row).
export const OMM_SEAM  = 854; // content zone = 0..854 (his October slides / TradingView); webcam below
export const OMM_CAP_Y = 892; // caption centre: 38 px under the seam, on his hairline, never his eyes (~1240)

// ─── B-roll beats (authored in BROLL-PLAN.md BEFORE generation) ────────────────────────────────
// Coverage budget (SKILL "B-roll coverage budget", HALVED 2026-07-14):
//   36.52 s covered / 114.17 s = 32.0 % b-roll, 77.65 s = 68.0 % BASE SHOWING. Targets ~30 % / ~70 %
//   (bands 25-35 % / 65-75 %) => on target. 14 distinct images, zero reuse inside the clip, every
//   beat 1.75-3.30 s (the style guide's "changes every 1-3 s").
// 3 full-screens ONLY (hook / the 1929 turn / the zombie climax) = the FIRM 1-3 cap. They are 44.65 s
// and 27.40 s apart, so no full->full base flash exists. The only image-to-image joins are B6->B7 and
// B7->B8, both EXACTLY butted (tOut === tIn) so BrollLayer HARD-CUTS with zero base frames between.
//
// The screen-share is a genuine RECEIPT for essentially the whole clip and is therefore SHOWN:
// "The October Effect" slide (median return 1.03 %, 38/99 negative years, +36 % volatility) runs
// 0-54 s, "Not the Worst Month. Not Even Close." (~0.9-1.0 %, 6th Worst, 62 % hit rate) runs 58-86 s
// with his cursor highlighting the 62 % card, and the TradingView BTCUSD monthly chart runs 86-114 s.
// The 18.60 s block 58.30-76.90 carries NO b-roll at all: every number he speaks there is legible on
// his own slide as he says it.
// staticFile() calls are LITERAL strings on purpose — the finalized-short gate scans for literal refs.
export const BROLL_OMM: BrollEv[] = [
  // BASE 0.00-0.90 — the frame-0 thumb is ONE frame; the video opens on Mike + the October slide
  { src: staticFile('broll-omm-hook.png'),           tIn:   0.90, tOut:   2.65, mode: 'full'    }, // HOOK: "there's not going to be a BOTTOM IN OCTOBER" (1.98-3.52)
  // BASE 2.65-11.20 (8.55 s) — "everybody and their grandma is going to be buying back in in october"
  { src: staticFile('broll-omm-cycle.png'),          tIn:  11.20, tOut:  13.70, mode: 'content' }, // "a FOUR-YEAR CYCLE even unrelated to bitcoin" (11.04-13.38)
  // BASE 13.70-16.40 (2.70 s) — "that goes like way back and october is"
  { src: staticFile('broll-omm-crash-myth.png'),     tIn:  16.40, tOut:  18.80, mode: 'content' }, // "typically like the WORST MONTH FOR STOCK" (16.42-18.68)
  // BASE 18.80-25.55 (6.75 s) — "i actually thought that to be true, but that's just some COMMON MYTH.
  // like what is that mandela effect, right?" — the turn is on his face
  { src: staticFile('broll-omm-false-memory.png'),   tIn:  25.55, tOut:  28.15, mode: 'content' }, // "the MANDELA EFFECT where A LOT OF PEOPLE BELIEVE" (25.42-29.04)
  // BASE 28.15-35.60 (7.45 s) — "that nelson mandela was killed in the 90s ... and like when he never
  // was" — a REAL PERSON is named here, so nothing is generated for him (persona guard)
  { src: staticFile('broll-omm-false-stamp.png'),    tIn:  35.60, tOut:  38.40, mode: 'content' }, // "everybody just BELIEVES SOMETHING THAT'S FALSE" (36.58-38.32)
  // BASE 38.40-44.60 (6.20 s) — "this is the FIRST TIME we even have a prediction for a bottom for the
  // crypto market in october"
  { src: staticFile('broll-omm-never-happened.png'), tIn:  44.60, tOut:  47.30, mode: 'content' }, // "we've NEVER HAD A BOTTOM IN OCTOBER prior to this" (44.76-47.46)
  // ⛔ MANDATORY COVER BEAT (batch requirement, progress.json): a 0.52 s cough was excised at 47.68
  // and the join leaves a visible HEAD-POSITION JUMP in the FACE ZONE (the content zone is identical
  // either side, so a content-mode image could not hide it) — this beat MUST be FULL-SCREEN. tIn 47.30
  // => opacity 1.0 by 47.42 (0.12 s layer fade), 0.26 s before the join, and it holds 1.0 to 49.18.
  // It is also a real editorial transition (the myth setup -> the stock-market receipt), so the
  // full-screen is earned, not spent. EXACTLY butted to the beat above => BrollLayer hard-cuts in.
  { src: staticFile('broll-omm-1929.png'),           tIn:  47.30, tOut:  49.90, mode: 'full'    }, // "BUT RELATED TO STOCKS, EVERYONE REMEMBERS" (47.74-49.66)
  { src: staticFile('broll-omm-97-years.png'),       tIn:  49.90, tOut:  52.60, mode: 'content' }, // "1929 AND 1987. almost no one remembers" — EXACTLY butted (tOut === tIn), hard cut, zero base flash
  // BASE 52.60-55.00 (2.40 s) — "the other 97 years." (his slide headline says exactly this)
  { src: staticFile('broll-omm-outlier.png'),        tIn:  55.00, tOut:  58.30, mode: 'content' }, // "spread across 90 years is NOT A PATTERN. IT'S AN OUTLIER" (54.20-58.08); lands on the slide's own scroll transition, the lowest-value base window in the clip
  // ⛔ BASE 58.30-76.90 (18.60 s) — THE RECEIPT BLOCK, nothing may cover it: "not the worst month,
  // not even close ... returns are positive on average ... a SIX OUT OF 12 months ... the SIXTH WORST
  // month, right smack in the middle ... 62% of the years SINCE 1927, october RETURNED POSITIVE."
  // His "Not the Worst Month. Not Even Close." slide is on screen with ~0.9-1.0 % / 6th Worst / 62 %
  // and his cursor highlighting the 62 % card, so every number is legible as he says it.
  { src: staticFile('broll-omm-zombies.png'),        tIn:  76.90, tOut:  79.50, mode: 'full'    }, // CLIMAX: "all your four-year cycle ZOMBIES that try to use" ("zombies" 77.80-78.22)
  // BASE 79.50-88.00 (8.50 s) — "october is usually bad for the markets anyway. and this time it's
  // just going to happen with crypto." (the TradingView BTCUSD monthly takes over at 86.00, exactly
  // on "with crypto")
  { src: staticFile('broll-omm-5050.png'),           tIn:  88.00, tOut:  90.60, mode: 'content' }, // "a 50% CERTAINTY that the bottom is BEHIND US" (87.76-91.14)
  // BASE 90.60-93.00 (2.40 s) — "and maybe like a"
  { src: staticFile('broll-omm-30-days.png'),        tIn:  93.00, tOut:  95.60, mode: 'content' }, // "40% certainty that the bottom is in the NEXT 30 DAYS way before october" (92.16-97.24)
  // BASE 95.60-107.40 (11.80 s) — "the remaining 10% ... i'm open to entertaining the idea that
  // there'll be a bottom after october because they believe there's going to be a bottom in october"
  // (the BTC monthly chart with the 50-week MA and RSI is the right visual for the odds talk)
  { src: staticFile('broll-omm-front-run.png'),      tIn: 107.40, tOut: 110.10, mode: 'content' }, // "going to FRONT RUN that and try to buy back in" (108.66-110.18)
  // BASE 110.10-111.50 (1.40 s) — "before they're missing." on his face, the beat before the hard-out
  { src: staticFile('broll-omm-early-bottom.png'),   tIn: 111.50, tOut: 114.30, mode: 'content' }, // CLOSE: "so the bottom might be FRONT RUN. bottom might be HAPPENING EARLY." (tOut past the last frame so the close holds full opacity to the hard-out)
];

// ─── Overlays (code-drawn badges) — deliberately NONE ───────────────────────────────────────────
// There is nowhere to put one. The content zone is a full-bleed designed data slide 0-86 s (title
// y~200-300, stat cards y~295-650, summary paragraph y~560-680) and a full-bleed TradingView chart
// 86-114 s; the only empty band on slide 2 (y~690-850) collides with a wrapped two-line caption at
// capY 892 (y~803-977), and a badge over the stat cards would hide the exact receipt the clip is
// built on. Badges are optional in the contract. The frame-0 cover is therefore the ONLY timed
// graphic in the composition, so no two overlays can collide in time OR space.

// ─── Frame-0 thumbnail (IG/TikTok cover) ────────────────────────────────────────────────────────
// ONE frame only (LivestreamShort defaults thumb.durS to 1/fps) — generated background art with the
// hook title drawn in CODE on top, never baked into the image. No em dashes.
export const THUMB_DEF_OMM: ThumbDef = {
  img: THUMB_OMM,
  title: 'THE OCTOBER\nBOTTOM IS A\nMANDELA\nEFFECT',
  chip: '97 YEARS NOBODY REMEMBERS',
  chipColor: '#00e5ff',
  titleSize: 116, // 11-char longest line ("THE OCTOBER") stays inside the 968 px text box
};

// ─── SFX (shared library, COPIED into render-assets/sfx/; every event stays under the VO) ───────
// Whoosh on the thumbnail cut and on every b-roll transition that matters; two risers each BUILD
// INTO an impact; impacts are reserved for the two beats that carry the clip (per
// Impacts/WHEN-TO-USE-IMPACTS.md: "reserve them for the beats that actually matter").
//
// ⚠ Cue points are each SFX's own ATTACK/PEAK position, not its file start. Envelopes re-measured on
//   this machine at 0.1 s RMS for this build: transition_rapid_whoosh peaks 0.10 s in -
//   Cinematic Whoosh 02 peaks 0.80 s - sudden-shock attacks 0.10 s / peaks 0.30 s - TING attacks
//   0.70 s / peaks 0.80 s - DING peaks 0.20 s - Tension_Rise_Logo_Reveal_2 peaks 4.70 s -
//   Tension_Rise_Logo_Reveal_3 peaks 2.50 s - Impact_Hit_01-2 peaks 0.10 s -
//   Soundjay_Impact_Main_01 peaks 0.20 s - Boom - Big Reveal peaks at 0.00 s. Each cue below is
//   therefore started EARLY by exactly that offset so the crest lands on the frame it punctuates.
//   Peak RMS differs by ~13 dB across these files, so the loud ones (Boom -5.5 dB, Soundjay -6.2 dB)
//   get the lower volumes.
//
// ⚠ The opening pair keeps the whisper-verified values from the what-if-1000x masking sweep
//   (0.30 / 0.22): anything higher buried the first spoken words under the cover-cut whoosh.
//
// ⚠ FINAL-MIX MASKING SWEEP (contract item 7, run on this clip 2026-08-05). Whisper-verifying the
//   rendered MIX against the spine found THREE cues sitting on top of VO. Each was swept with 3
//   isolated passes per value (windows staggered by 0.2 s) against the spine as the control:
//     - `ding/sudden-shock` was at t 37.90, i.e. its 0.30 s peak landed exactly ON the punchline
//       word "false." (38.20-38.32) and inverted it ("that's false" transcribed as "that's right"
//       / "that's wrong" at EVERY audible gain: 0.26 / 0.18 / 0.10 all 0/3, mute 2/3 = the spine's
//       own score). Volume could not fix it, so the cue is RETIMED to 38.35 (attack 38.45, crest
//       38.65 = just after the word) and KEEPS its full 0.26: the hit is not lowered, it is moved
//       off the word. 2/3 == control.
//     - the 44.80 riser's swell (crest 47.30) deleted the whole line "prior to this." (46.70-47.46)
//       from the transcript: 0.16 / 0.10 / 0.08 / 0.06 all 0/3, 0.04 2/3, only mute 3/3. Broadband
//       swells wreck intelligibility at any audible level, so it keeps its 0.16 and is SHORTENED to
//       dur 1.60 (44.80-46.40) — it builds, drops out 0.30 s before the line, and the 47.20 IMPACT
//       still lands the cut. 3/3 == control. (Truncation step measured at -30 dBFS under active
//       speech, i.e. no audible click.)
//     - the 72.20 riser ran 0.50 s PAST the climax impact and smeared "all your four-year cycle
//       zombies" ("cool recycle zombies"). Shortened to dur 4.50 so it ends exactly ON the impact
//       (76.70) and dropped to 0.10. Whole-file verify then matches the spine.
//   The two IMPACTS (47.20 / 76.70) and the Boom were NOT lowered — per the contract the payoff hit
//   is never the cue you sweep. Residual after the sweep: whole-file mix == spine except one dropped
//   conjunction ("because", 38.54), similarity 0.9987.
export const SFX_OMM: Sfx[] = [
  { t:   0.00, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.30, dur: 1.00 }, // frame-0 thumbnail cut
  { t:   0.10, src: staticFile('sfx/Cinematic Whoosh 02.wav'),               vol: 0.22, dur: 2.20 }, // sweeps INTO the HOOK full-screen (crest 0.90 = the cut)
  { t:  11.10, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.34, dur: 1.00 }, // cut into the four-year-cycle dial (11.20)
  { t:  16.30, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.34, dur: 1.00 }, // cut into the crash-headline wall (16.40)
  { t:  25.45, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.34, dur: 1.00 }, // cut into the false-memory crowd (25.55)
  { t:  35.50, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.34, dur: 1.00 }, // cut into the dissolving history book (35.60)
  { t:  38.35, src: staticFile('sfx/ding/sudden-shock.mp3'),                 vol: 0.26, dur: 1.80 }, // punctuates "false." (38.20-38.32) from JUST AFTER it - retimed by the masking sweep, full gain kept
  { t:  44.50, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.34, dur: 1.00 }, // cut into the empty-frames corridor (44.60)
  { t:  44.80, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_3.wav'), vol: 0.16, dur: 1.60 }, // riser builds toward the 1929 full-screen, then DROPS OUT at 46.40 (0.30 s before "prior to this.") so the impact lands in the clear
  { t:  47.20, src: staticFile('sfx/Impacts/Impact_Hit_01-2.wav'),           vol: 0.34, dur: 2.20 }, // IMPACT on the cut to the 1929 full-screen (47.30)
  { t:  49.80, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.32, dur: 1.00 }, // the B7 -> B8 HARD CUT (49.90)
  { t:  54.90, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.32, dur: 1.00 }, // cut into the outlier scatter plot (55.00)
  { t:  67.90, src: staticFile('sfx/TING SOUND EFFECT.mp3'),                 vol: 0.30, dur: 2.00 }, // receipt ding: crest lands on "62%" (68.70)
  { t:  72.20, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_2.wav'), vol: 0.10, dur: 4.50 }, // riser BUILDS INTO the zombie climax and ends ON the impact (76.70) - no longer runs over "four-year cycle zombies"
  { t:  76.70, src: staticFile('sfx/Impacts/Soundjay_Impact_Main_01.wav'),   vol: 0.30, dur: 2.40 }, // IMPACT on the cut to the zombie full-screen (76.90)
  { t:  77.80, src: staticFile('sfx/Boom - Big Reveal.wav'),                 vol: 0.32, dur: 2.80 }, // the biggest hit of the short, on "zombies" (77.80)
  { t: 107.30, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.32, dur: 1.00 }, // cut into the front-run sprint (107.40)
  { t: 111.40, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.30, dur: 1.00 }, // cut into the closing early-bottom card (111.50)
  { t: 113.54, src: staticFile('sfx/DING.mp3'),                              vol: 0.28, dur: 1.40 }, // the hard-out kicker on "happening early" (113.74)
];

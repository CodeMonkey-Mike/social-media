import { staticFile } from 'remotion';
import type { BrollEv, Sfx } from './_kit';
import type { BadgeEv, ThumbDef } from './LivestreamShort';

// ─── october-bottom-frontrun-impact (batch: October-pumps, clip #7, variant: impact) ───────────────
// "Zombie FOMO Will Need A Psychiatrist" — the four year cycle zombies come back in October, start
// buying up and push those candles green like crazy; they get so overwhelmed with FOMO that "we're
// going to probably have to schedule an appointment with a psychiatrist", they panic ("oh my god,
// it's not bottoming out, it keeps going up"), buy back in and push it up even further.
//
// IMPACT SIBLING of clip #2 (october-bottom-frontrun) = that clip's payoff section standing alone.
// It has its OWN render-assets/ and its OWN images; nothing is shared with clip #2.
//
// Base clip: october-bottom-frontrun-impact-final.mp4 (raw cut -> Phase 5 tighten -> 5B desilence ->
// 5C filler removal). ALREADY composited vertical (screen-share on top, webcam below), 1080x1920 @
// 25 fps, 27.96 s. FINAL, do NOT re-cut and do NOT re-split the zones. The comp runs at 30 fps;
// OffthreadVideo resamples the 25 fps source by TIME, so every cue below is plain seconds taken from
// the clip's own caption/word timings (clip-relative, 0-based).
//
// PERSONA GUARD (clip-plan.json): the zombies make October GREEN and MISS the real bottom. Nothing
// on screen may say they cause an October bottom. No em dashes on screen. CTA reads "Follow me".
//
// Render (public-dir = the CLIP's render-assets/, which holds the spine + thumbnail + b-roll + sfx):
//   npx remotion render src/index.ts OctoberBottomFrontrunImpact \
//     out/October-pumps/7-october-bottom-frontrun-impact.mp4 \
//     --public-dir "<repo>/video-creation/shorts/October-pumps/october-bottom-frontrun-impact/render-assets"

export const OBFI_FPS = 30;
export const OBFI_DURATION = 838; // 27.933 s @30, just inside the 27.96 s clip (no black tail frame)

export const CLIP_OBFI  = staticFile('october-bottom-frontrun-impact-final.mp4');
export const THUMB_OBFI = staticFile('thumbnail-obfi.png');

// Layout geometry, MEASURED on this clip (row-mean gradient scan at t = 0.5/3/7/11/15/19/23/27 s; all
// eight frames put the hard screen-share/webcam divider on the same row).
export const OBFI_SEAM  = 853; // content zone = 0..853 (the Dream Crypto YouTube page); webcam below
export const OBFI_CAP_Y = 890; // caption centre: below the seam, above his hairline (~1050), never his eyes (~1400)

// ─── B-roll beats (authored in BROLL-PLAN.md BEFORE generation) ────────────────────────────────
// Coverage budget (SKILL "B-roll coverage budget", HALVED 2026-07-14):
//   8.98 s covered / 27.96 s = 32.1 % b-roll, 18.98 s = 67.9 % BASE SHOWING. Targets ~30 % / ~70 %
//   (bands 25-35 % / 65-75 %) => on target. 4 distinct images, zero reuse inside the clip.
// 2 full-screens ONLY (the zombies hook / the psychiatrist punchline climax) = inside the FIRM 1-3
// cap and the 1-2 ceiling for a 28 s clip. They are 11.0 s apart, so no full->full base flash exists.
// The screen-share is NOT filler here: it is the `Dream Crypto` YouTube channel page whose own video
// tiles read "4Y CYCLE DEAD", "Do NOT wait till October to buy Bitcoin" and "Waiting to buy BTC in
// October will be your biggest mistake EVER" — i.e. the receipt for this exact clip. There is no dead
// or off-message window to cover, so the base is the default state and every b-roll beat is isolated
// (min gap to the next beat 3.16 s, so there is no sub-1.5 s base flash anywhere).
// staticFile() calls are LITERAL strings on purpose — the finalized-short gate scans for literal refs.
export const BROLL_OBFI: BrollEv[] = [
  // BASE 0.00-2.54 — open on Mike + the screen-share (the frame-0 thumb is ONE frame; base from frame 1)
  { src: staticFile('broll-obfi-zombies.png'),      tIn:  2.54, tOut:  4.94, mode: 'full'    }, // HOOK: "all these FOUR YEAR CYCLE ZOMBIES" ("zombies" 3.30)
  // BASE 4.94-8.46 (3.52 s) — "they're going to come back in october and they're going to start buying up"
  { src: staticFile('broll-obfi-candles.png'),      tIn:  8.46, tOut: 10.70, mode: 'content' }, // "start pushing those CANDLES GREEN like crazy" ("green" 9.38)
  // BASE 10.70-15.90 (5.20 s) — "they're going to be scared... overwhelmed with fomo" (+ TOO LATE badge, + the riser build)
  { src: staticFile('broll-obfi-psychiatrist.png'), tIn: 15.90, tOut: 18.30, mode: 'full'    }, // CLIMAX: "an appointment with a PSYCHIATRIST or something" (punchline ~16.62)
  // BASE 18.30-21.46 (3.16 s) — "overwhelmed with fomo like, oh my god, it's not bottoming out." (+ OCTOBER GOES GREEN badge)
  { src: staticFile('broll-obfi-buyback.png'),      tIn: 21.46, tOut: 23.40, mode: 'content' }, // "it keeps going up and they're going to buy back in and push it"
  // BASE 23.40-27.96 (4.56 s) — "up even further. so that's my whole idea of what's going to happen in october." (+ FOLLOW ME badge)
];

// ─── Badges (code-drawn text, content zone y300) ────────────────────────────────────────────────
// Every badge sits over a BASE stretch (never over a b-roll beat), no two share a time window
// (gaps 4.60 s / 3.70 s), they live at y300 while captions live at y890, and all start long after the
// frame-0 thumb. Each states something the captions do NOT.
// Persona: "TOO LATE / THEY BUY THE GREEN, NOT THE BOTTOM" says the zombies MISS the bottom; nothing
// here says they cause one.
export const BADGES_OBFI: BadgeEv[] = [
  { tIn: 12.10, tOut: 14.60, color: '#00e5ff', line1: 'TOO LATE',  sub: 'THEY BUY THE GREEN, NOT THE BOTTOM', top: 300 },
  { tIn: 19.20, tOut: 21.30, color: '#39ff14', line1: 'OCTOBER', line2: 'GOES GREEN', sub: 'BECAUSE THEY PANIC BUY', top: 300 },
  { tIn: 25.00, tOut: 27.30, color: '#ffe600', line1: 'FOLLOW ME', sub: 'FOR THE OCTOBER PLAYBOOK',            top: 300 },
];

// ─── Frame-0 thumbnail (IG/TikTok cover) ────────────────────────────────────────────────────────
// ONE frame only (LivestreamShort defaults thumb.durS to 1/fps) — generated background art with the
// hook title drawn in CODE on top, never baked into the image. No em dashes.
export const THUMB_DEF_OBFI: ThumbDef = {
  img: THUMB_OBFI,
  title: 'ZOMBIE FOMO\nWILL NEED A\nPSYCHIATRIST',
  chip: 'OCTOBER GOES GREEN',
  chipColor: '#39ff14',
  titleSize: 118,
};

// ─── SFX (shared library, COPIED into render-assets/sfx/; every event stays under the VO) ───────
// Whoosh on the frame-0 thumbnail cut and on every b-roll transition; ONE riser BUILDS INTO the
// psychiatrist punchline and the biggest impact lands ON it; impacts are otherwise reserved for the
// beats that carry the clip (per Impacts/WHEN-TO-USE-IMPACTS.md: "reserve them for the beats that
// actually matter").
//
// ⚠ Cue points are each SFX's own PEAK/ATTACK position, not its file start. Envelopes measured during
//   THIS build at 0.2 s RMS: transition_rapid_whoosh peaks 0.20 s in - Cinematic Whoosh 02 peaks
//   0.80 s - Cinematic Whoosh 06 peaks 0.40 s - Impact_3 peaks 0.40 s - Boom - Big Reveal peaks
//   0.00 s - Soundjay_Impact_Main_01 peaks 0.20 s - Edgy_Riser peaks 5.00 s - TING peaks 0.80 s -
//   Cash Register attacks 0.20 s - sudden-shock peaks 0.20 s - dramatic-shocked peaks 1.00 s.
//   Each cue below is therefore started EARLY by exactly that offset so the crest lands on the frame
//   it punctuates. Quiet FILES (Cinematic Whoosh 06 -24.7 dB, Cash Register -25.5 dB RMS vs the
//   impacts) get a higher vol so they are actually audible under the VO.
export const SFX_OBFI: Sfx[] = [
  { t:  0.00, src: staticFile('sfx/transition_rapid_whoosh.mp3'),          vol: 0.46, dur: 1.00 }, // frame-0 thumbnail cut
  { t:  1.74, src: staticFile('sfx/Cinematic Whoosh 02.wav'),              vol: 0.50, dur: 2.20 }, // sweeps INTO the HOOK full-screen (crest 2.54 = the cut)
  { t:  2.90, src: staticFile('sfx/Impacts/Impact_3.wav'),                 vol: 0.42, dur: 2.20 }, // lands on the word "zombies" (3.30)
  { t:  4.74, src: staticFile('sfx/transition_rapid_whoosh.mp3'),          vol: 0.38, dur: 1.00 }, // cut out of the hook full-screen (4.94)
  { t:  8.26, src: staticFile('sfx/transition_rapid_whoosh.mp3'),          vol: 0.40, dur: 1.00 }, // into the green-candles cutaway (8.46)
  { t:  9.18, src: staticFile('sfx/Cash Register.mp3'),                    vol: 0.72, dur: 1.90 }, // kaching on "candles green like crazy" (9.38)
  { t: 11.14, src: staticFile('sfx/ding/sudden-shock.mp3'),                vol: 0.40, dur: 1.60 }, // lands on "they're going to be scared" (11.34)
  { t: 10.90, src: staticFile('sfx/risers/Edgy_Riser.wav'),                vol: 0.26, dur: 5.10 }, // RISER builds INTO the psychiatrist punchline (crest 15.90)
  { t: 15.50, src: staticFile('sfx/Cinematic Whoosh 06.wav'),              vol: 0.78, dur: 2.00 }, // the cut to the CLIMAX full-screen (15.90)
  { t: 16.62, src: staticFile('sfx/Boom - Big Reveal.wav'),                vol: 0.52, dur: 3.00 }, // IMPACT on "psychiatrist", the biggest hit of the short
  { t: 18.10, src: staticFile('sfx/transition_rapid_whoosh.mp3'),          vol: 0.38, dur: 1.00 }, // cut out of the climax full-screen (18.30)
  { t: 18.60, src: staticFile('sfx/ding/dramatic-shocked-sfxshocked.mp3'), vol: 0.38, dur: 2.40 }, // the mock zombie panic "oh my god" (~19.60)
  { t: 21.26, src: staticFile('sfx/transition_rapid_whoosh.mp3'),          vol: 0.40, dur: 1.00 }, // into the buy-back-in cutaway (21.46)
  { t: 23.82, src: staticFile('sfx/Impacts/Soundjay_Impact_Main_01.wav'),  vol: 0.44, dur: 2.40 }, // lands on "push it up even further" (24.02)
  { t: 24.80, src: staticFile('sfx/TING SOUND EFFECT.mp3'),                vol: 0.48, dur: 2.00 }, // the thesis button "so that's my whole idea" (25.60)
];

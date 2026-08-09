import { staticFile } from 'remotion';
import type { BrollEv, Sfx } from './_kit';
import type { BadgeEv, ThumbDef } from './LivestreamShort';

// ─── whatif-cto-100x-call (batch: October-pumps, clip #1, variant: full) ───────────────────────
// "WHATIF Could Be A 100x From Here" — WHATIF is now a CTO: the shady era where its Twitter
// community link rotated every 12 hours is over, the original launcher walked away, a real website
// is up, and Mike is bullish: ~20 million short term (a 5x), then "forget about 20 million, it could
// go to 100 million, could even be a 100x from here, are you out of your mind, not financial advice".
//
// Base clip: whatif-cto-100x-call-final.mp4 (raw cut -> Phase 5 tighten -> 5B desilence -> 5C filler
// removal). ALREADY composited vertical (screen-share on top, webcam below), 1080x1920 @ 25 fps,
// 95.76 s. FINAL, do NOT re-cut and do NOT re-split the zones. The comp runs at 30 fps;
// OffthreadVideo resamples the 25 fps source by TIME, so every cue below is plain seconds taken from
// the clip's own Whisper word timings (clip-relative, 0-based).
//
// Render (public-dir = the CLIP's render-assets/, which holds the spine + thumbnail + b-roll + sfx):
//   npx remotion render src/index.ts WhatifCto100xCall \
//     out/October-pumps/1-whatif-cto-100x-call.mp4 \
//     --public-dir "<repo>/video-creation/shorts/October-pumps/whatif-cto-100x-call/render-assets"

export const WCTO_FPS = 30;
export const WCTO_DURATION = 2872; // 95.733 s @30, just inside the 95.76 s clip (no black tail frame)

export const CLIP_WCTO  = staticFile('whatif-cto-100x-call-final.mp4');
export const THUMB_WCTO = staticFile('thumbnail-wcto.png');

// Layout geometry, MEASURED on this clip (row-mean gradient scan at t=2/20/45/70/92 s; all five
// frames put the hard screen-share/webcam divider on the same row).
export const WCTO_SEAM  = 854; // content zone = 0..854 (X profile / DexScreener); webcam plays below
export const WCTO_CAP_Y = 890; // caption centre: below the seam, above his hairline (~1050), never his eyes (~1430)

// ─── B-roll beats (authored in BROLL-PLAN.md BEFORE generation) ────────────────────────────────
// Coverage budget (SKILL "B-roll coverage budget", HALVED 2026-07-14):
//   29.60 s covered / 95.76 s = 30.9 % b-roll, 66.16 s = 69.1 % BASE SHOWING. Targets ~30 % / ~70 %
//   (bands 25-35 % / 65-75 %) => on target. 11 distinct images, zero reuse inside the clip.
// 3 full-screens ONLY (hook / the "it's a go" turn / the 100x climax) = the FIRM 1-3 cap. They are
// 29 s and 37 s apart, so no full->full base flash exists.
// The screen-share is NOT filler here: the verified @WhatIFonHOOD X profile is up ~22 s and the
// IF/WETH DexScreener chart ~50 s (plus the CASHCAT chart over the close, exactly the coin he names),
// so the base carries the receipts and b-roll only takes the beats it earns. The three windows where
// the screen-share is DEAD or OFF-MESSAGE are all covered: the blank white / black page loads at
// 15.16-17.32 and 33.04-34.48, and the OFF-TOPIC Trump-tariff X post that occupies 0.00-9.92 (caught
// in chunk QA; the hook full-screen + the launcher cutaway + the CTO badge cover 1.30-9.20 of it).
// staticFile() calls are LITERAL strings on purpose — the finalized-short gate scans for literal refs.
export const BROLL_WCTO: BrollEv[] = [
  // BASE 0.00-1.30 — open on Mike + the screen-share (the frame-0 thumb is ONE frame; base from frame 1)
  { src: staticFile('broll-wcto-hook.png'),            tIn:  1.30, tOut:  4.30, mode: 'full'    }, // HOOK: "so what if it's a CTO right now?" ("cto" 3.24, "now?" 4.12)
  { src: staticFile('broll-wcto-launcher-left.png'),   tIn:  4.30, tOut:  6.30, mode: 'content' }, // "the ORIGINAL PERSON that launched the actual tokens... didn't want to do anything with it" — butt-joined to the hook, so it HARD-CUTS
  // BASE 6.30-15.20 (8.90 s) — "just somebody who launched it" / "my grief was it was linked to a twitter community" (+ CTO badge 6.55-9.20)
  { src: staticFile('broll-wcto-rotating-links.png'),  tIn: 15.20, tOut: 18.20, mode: 'content' }, // "like every 12 hours, switch to a new twitter community" (covers the DEAD 15.16-17.32 page load)
  { src: staticFile('broll-wcto-shady.png'),           tIn: 18.20, tOut: 20.90, mode: 'content' }, // "this is CRAZY SHADY" ("shady" 20.02) — butt-joined to the beat above, so it HARD-CUTS
  // BASE 20.90-27.00 (6.10 s) — "that's the only thing that prevented me from buying it. other than that the concept is pretty good."
  { src: staticFile('broll-wcto-meme-idea.png'),       tIn: 27.00, tOut: 29.60, mode: 'content' }, // "good potential just because of THE MEME ITSELF"
  // BASE 29.60-33.10 (3.50 s) — "surprise, nobody ever thought of it before. but yeah, it makes sense if it's a cto."
  { src: staticFile('broll-wcto-its-a-go.png'),        tIn: 33.10, tOut: 36.30, mode: 'full'    }, // MAJOR TRANSITION: "they got a good website. so now IT'S A GO." (covers the DEAD 33.04-34.48 page load)
  // BASE 36.30-40.00 (3.70 s) — "where the community is being drawn around it, right? all the crypto influencers,"
  { src: staticFile('broll-wcto-rally.png'),           tIn: 40.00, tOut: 42.60, mode: 'content' }, // "everybody's RALLYING THE COMMUNITIES around it"
  // BASE 42.60-48.10 (5.50 s) — "it could go in the short term to 20 million" (the DexScreener mcap chart IS the visual)
  { src: staticFile('broll-wcto-5x.png'),              tIn: 48.10, tOut: 50.60, mode: 'content' }, // "we're talking about a 5X from here" ("5x" 48.62)
  // BASE 50.60-60.20 (9.60 s) — "a new bottom in august, then the bulls start to run in september" (+ THE SETUP badge)
  { src: staticFile('broll-wcto-october-flying.png'),  tIn: 60.20, tOut: 62.80, mode: 'content' }, // "everything is FLYING IN OCTOBER, the opposite of what the four year cycle ZOMBIES expect"
  // BASE 62.80-70.30 (7.50 s) — "that's just a couple of months away. this thing is going to be around."
  { src: staticFile('broll-wcto-100-million.png'),     tIn: 70.30, tOut: 72.90, mode: 'content' }, // "forget about 20 million, it could go to 100 MILLION"
  { src: staticFile('broll-wcto-100x-climax.png'),     tIn: 72.90, tOut: 75.70, mode: 'full'    }, // CLIMAX: "could even be like 100X FROM HERE" ("100x" 74.24) — butt-joined above, HARD CUT
  // BASE 75.70-95.76 (20.06 s) — "not financial advice... are you out of your mind?... anything secondary to
  // cashcat to be enlisted on robinhood, i think whatif will make it." The CASHCAT DexScreener chart is on
  // screen from 80.32 and is EXACTLY what he is naming, so the close is base by design (+ 2 badges).
];

// ─── Badges (code-drawn text, content zone y300) ────────────────────────────────────────────────
// Every badge sits over a BASE stretch (never over a b-roll beat), no two share a time window
// (gaps 44.2 s / 22.4 s / 7.4 s), they live at y300 while captions live at y890, and all start long
// after the frame-0 thumb. Each states something the captions do NOT.
export const BADGES_WCTO: BadgeEv[] = [
  { tIn:  6.55, tOut:  9.20, color: '#00e5ff', line1: 'CTO', line2: 'TAKEOVER', sub: 'THE LAUNCHER WALKED AWAY',    top: 300 },
  { tIn: 53.40, tOut: 56.20, color: '#39ff14', line1: 'THE SETUP',     sub: 'AUG BOTTOM, SEP BULLS, OCT FLYING',           top: 300 },
  { tIn: 78.60, tOut: 81.20, color: '#ffe600', line1: 'NOT FINANCIAL', line2: 'ADVICE', sub: 'JUST A GUY WITH CONVICTION', top: 300 },
  { tIn: 88.60, tOut: 91.40, color: '#39ff14', line1: 'ROBINHOOD',     sub: 'THE LISTING KICKER',                          top: 300 },
];

// ─── Frame-0 thumbnail (IG/TikTok cover) ────────────────────────────────────────────────────────
// ONE frame only (LivestreamShort defaults thumb.durS to 1/fps) — generated background art with the
// hook title drawn in CODE on top, never baked into the image. No em dashes.
export const THUMB_DEF_WCTO: ThumbDef = {
  img: THUMB_WCTO,
  title: 'WHATIF COULD BE\nA 100X\nFROM HERE',
  chip: 'IT IS A CTO NOW',
  chipColor: '#39ff14',
  titleSize: 122,
};

// ─── SFX (shared library, COPIED into render-assets/sfx/; every event stays under the VO) ───────
// Whoosh on the thumbnail cut and on every b-roll transition that matters; two risers each BUILD
// INTO an impact; impacts are reserved for the three beats that carry the clip (per
// Impacts/WHEN-TO-USE-IMPACTS.md: "reserve them for the beats that actually matter").
//
// ⚠ Cue points are each SFX's own PEAK/ATTACK position, not its file start. Envelopes measured on
//   this machine at 0.2 s RMS: transition_rapid_whoosh peaks 0.20 s in - Cinematic Whoosh 02 peaks
//   0.80 s - Cinematic Whoosh 06 peaks 0.60 s - Edgy_Riser peaks 5.00 s - Tension_Rise_Logo_Reveal_2
//   peaks 4.60 s - TING attacks 0.60 s / peaks 0.80 s - Cash Register attacks 0.20 s - sudden-shock
//   peaks 0.20 s - dramatic-shocked attacks 0.80 s / peaks 1.00 s - Impact_3 peaks 0.40 s -
//   Impact_Hit_01-2, Boom - Big Reveal peak at 0.00 s - Soundjay_Impact_Main_01 peaks 0.20 s.
//   Each cue below is therefore started EARLY by exactly that offset so the crest lands on the frame
//   it punctuates. Quiet FILES (Whoosh 06 -8 dB, Cash Register -13 dB vs the impacts) get a higher
//   vol so they are actually audible under the VO.
export const SFX_WCTO: Sfx[] = [
  { t:  0.00, src: staticFile('sfx/transition_rapid_whoosh.mp3'),         vol: 0.46, dur: 1.00 }, // frame-0 thumbnail cut
  { t:  0.50, src: staticFile('sfx/Cinematic Whoosh 02.wav'),             vol: 0.50, dur: 2.00 }, // sweeps INTO the HOOK full-screen (crest 1.30 = the cut)
  { t:  2.90, src: staticFile('sfx/Impacts/Impact_3.wav'),                vol: 0.42, dur: 2.20 }, // lands on the word "cto" (3.24)
  { t:  4.10, src: staticFile('sfx/transition_rapid_whoosh.mp3'),         vol: 0.38, dur: 1.00 }, // the hard cut from the hook full-screen into the launcher cutaway (4.30)
  { t: 15.00, src: staticFile('sfx/transition_rapid_whoosh.mp3'),         vol: 0.40, dur: 1.00 }, // into the rotating-communities cutaway (15.20)
  { t: 17.60, src: staticFile('sfx/Cinematic Whoosh 06.wav'),             vol: 0.78, dur: 2.00 }, // the hard cut to the "shady" beat (18.20)
  { t: 19.82, src: staticFile('sfx/ding/sudden-shock.mp3'),               vol: 0.40, dur: 1.80 }, // lands on the word "shady" (20.02)
  { t: 28.10, src: staticFile('sfx/risers/Edgy_Riser.wav'),               vol: 0.28, dur: 5.10 }, // riser BUILDS INTO the "it's a go" turn (crest 33.10)
  { t: 33.10, src: staticFile('sfx/Impacts/Impact_Hit_01-2.wav'),         vol: 0.46, dur: 2.40 }, // hard cut to the "IT'S A GO" full-screen
  { t: 35.74, src: staticFile('sfx/TING SOUND EFFECT.mp3'),               vol: 0.50, dur: 2.00 }, // bell on the second "it's a go" (36.34)
  { t: 48.42, src: staticFile('sfx/Cash Register.mp3'),                   vol: 0.72, dur: 1.90 }, // kaching ATTACKS on "5x" (48.62)
  { t: 60.00, src: staticFile('sfx/transition_rapid_whoosh.mp3'),         vol: 0.38, dur: 1.00 }, // into the October-flying cutaway (60.20)
  { t: 68.30, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_2.wav'), vol: 0.26, dur: 4.70 }, // riser BUILDS INTO the 100x climax (crest 72.90)
  { t: 72.70, src: staticFile('sfx/Impacts/Soundjay_Impact_Main_01.wav'), vol: 0.44, dur: 2.40 }, // hard cut to the CLIMAX full-screen (72.90)
  { t: 74.24, src: staticFile('sfx/Boom - Big Reveal.wav'),               vol: 0.50, dur: 3.00 }, // lands on "100X", the biggest hit of the short
  { t: 77.84, src: staticFile('sfx/ding/dramatic-shocked-sfxshocked.mp3'), vol: 0.38, dur: 2.40 }, // lands on "are you out of your mind?" (78.64)
  { t: 87.80, src: staticFile('sfx/TING SOUND EFFECT.mp3'),               vol: 0.48, dur: 2.00 }, // the CashCat / Robinhood close (88.60)
];

import { staticFile } from 'remotion';
import type { BrollEv, Sfx } from './_kit';
import type { BadgeEv, ThumbDef } from './LivestreamShort';

// ─── phantom-hack (batch: eliza, clip #2, variant: full) ────────────────────────────────────────
// "I Raced the Hacker Draining My Own Wallet" — he watched a live Phantom wallet drain token by
// token, raced the hacker by sending what was left away first, and the twist is that the guy it
// happened to used to RUN a privacy and VPN company. Ends on the PSA (hot wallets, an app not a
// browser extension, OneKey only behind a hardware wallet) and a deliberate HARD-OUT.
//
// Base clip: phantom-hack-tightened-desilenced.mp4 (raw cut -> Phase 5 tighten -> 5B desilence at
// min-sil 0.25). ALREADY composited vertical (screen-share on top, webcam below), 1080x1920 @ 25 fps,
// 85.16 s. FINAL, do NOT re-cut and do NOT re-split the zones. The comp runs at 30 fps;
// OffthreadVideo resamples the 25 fps source by TIME, so every cue below is plain seconds taken from
// the clip's own Whisper word timings (clip-relative, 0-based).
//
// ⚠ The file referenced here is the render-assets COPY, re-encoded to a SEEK-FRIENDLY GOP
//   (-g 25 -keyint_min 25 -bf 0 -sc_threshold 0, CRF 18) — mandatory since the 2026-08-03 finding
//   that Remotion's concurrent OffthreadVideo seeks die mid-render on a long-GOP source. This spine
//   measured a ~10 s GOP (keyframes at 0.00 and 10.08 only), exactly that case. The canonical spine
//   in the clip folder is never touched.
//
// Render (public-dir = the BATCH render-assets/, shared with clip 3; every file of this clip is
// `*-eph-*` prefixed so the two builders cannot collide):
//   npx remotion render src/index.ts ElizaPhantomHack \
//     out/eliza/2-phantom-hack.mp4 \
//     --public-dir "<repo>/video-creation/shorts/eliza/render-assets"

export const EPH_FPS = 30;
export const EPH_DURATION = 2555; // 85.16 s @30; last frame index 2554 = t 85.133 s, inside the clip

export const CLIP_EPH  = staticFile('phantom-hack.mp4');
export const THUMB_EPH = staticFile('thumb-eph.png');

// Layout geometry, MEASURED on this clip (row-mean gradient scan at t=1/8/15/22/30/40/50/60/70/80/84 s;
// all ELEVEN frames put the hard screen-share/webcam divider on the same row, delta 180-202).
export const EPH_SEAM  = 853; // content zone = 0..853 (a frozen CoinMarketCap SHIB page); webcam below
export const EPH_CAP_Y = 890; // caption centre: 37 px under the seam, on his hair, never his eyes (~1240)

// ─── B-roll beats (authored in BROLL-PLAN.md BEFORE generation) ────────────────────────────────
// Coverage budget (SKILL "B-roll coverage budget", HALVED 2026-07-14):
//   28.00 s covered / 85.16 s = 32.9 % b-roll, 57.16 s = 67.1 % BASE SHOWING. Targets ~30 % / ~70 %
//   (bands 25-35 % / 65-75 %) => on target. 11 distinct images, zero reuse inside the clip, every
//   beat 2.40-2.80 s (the style guide's "changes every 1-3 s").
// 3 full-screens ONLY (hook / the race climax / the payoff) = the FIRM 1-3 cap. They are 21.85 s and
// 51.70 s apart, so no full->full base flash can exist. The only image-to-image join is B7->B8,
// EXACTLY butted (tOut === tIn = 58.25) so BrollLayer HARD-CUTS with zero base frames between.
//
// ⚠ THE CONTENT ZONE IS A FROZEN, OFF-MESSAGE SCREEN-SHARE and is still NOT blanketed. The upper
// zone is a CoinMarketCap Shiba Inu page left over from the previous topic; a pixel-diff of rows
// 0-853 against t=1 s across 11 sampled frames gives mean abs diff 1.2-2.1 with < 1.3 % of pixels
// changing, i.e. it is static for all 85 s and is a receipt for nothing in this clip. Per SKILL.md
// that is NOT a licence to blanket: coverage stays inside the band (32.9 %) and the two long base
// stretches (28.05-44.15 and 46.75-55.85) are carried by CODE-DRAWN BADGES, not by more images.
// staticFile() calls are LITERAL strings on purpose — the finalized-short gate scans for literal refs.
export const BROLL_EPH: BrollEv[] = [
  // BASE 0.03-1.00 — the frame-0 thumb is ONE frame; the video opens on Mike + the screen-share
  { src: staticFile('broll-eph-hook.png'),             tIn:  1.00, tOut:  3.50, mode: 'full'    }, // HOOK: "i don't use PHANTOM because I WAS HACKED" (0.00-1.78)
  // BASE 3.50-6.90 (3.40 s) — "i was hacked, man. that was horrible." lands on his face, not on art
  { src: staticFile('broll-eph-token-rows.png'),       tIn:  6.90, tOut:  9.40, mode: 'content' }, // "just one day i see EVERY SINGLE TOKEN" (6.62-9.02)
  // BASE 9.40-12.50 (3.10 s) — "everyone is like a similar individual container" (describing, not revealing)
  { src: staticFile('broll-eph-rows-vanish.png'),      tIn: 12.50, tOut: 15.00, mode: 'content' }, // "FLIPPING OUT OF THE WAY and the tokens were SHIFTING UP" (12.32-14.34)
  // BASE 15.00-18.85 (3.85 s) — "shipped out. i was like, OH MY GOD, i know what's happening" = a FACE beat
  { src: staticFile('broll-eph-siphon.png'),           tIn: 18.85, tOut: 21.35, mode: 'content' }, // PEAK: "SOMEBODY'S SENDING MY TOKENS AWAY" (18.94-20.68)
  // BASE 21.35-25.35 (4.00 s) — "so then i did, i went into my phantom wallet and i saw this" (the riser runs under it)
  { src: staticFile('broll-eph-race.png'),             tIn: 25.35, tOut: 28.05, mode: 'full'    }, // CLIMAX / the title: "SENT THEM AWAY TO TRY TO BEAT THEM TO IT" (25.42-27.06)
  // ⛔ BASE 28.05-44.15 (16.10 s) — the paranoia digression: "how does this happen? i'm CRAZY
  // PROTECTIVE ... i have a TRAVEL ROUTER ... if i go to a hotel ... because i have a VPN". This is
  // face-and-story, there is no reveal in it, and it is carried by BADGE 1 (38.90-41.60), not images.
  { src: staticFile('broll-eph-vpn-tunnel.png'),       tIn: 44.15, tOut: 46.75, mode: 'content' }, // the credibility twist: "i had a PRIVACY AND VPN COMPANY" (44.06-46.52)
  // BASE 46.75-55.85 (9.10 s) — "back from 2010 up until like 2016 ... i really know what goes on".
  // Carried by BADGE 2 (47.30-50.20) + the TING; his face sells the "and it STILL happened to me" turn.
  { src: staticFile('broll-eph-even-me.png'),          tIn: 55.85, tOut: 58.25, mode: 'content' }, // PEAK 2: "EVEN ME, I GOT HACKED. it's crazy." (55.96-57.84)
  { src: staticFile('broll-eph-browser-crack.png'),    tIn: 58.25, tOut: 60.75, mode: 'content' }, // "VULNERABILITIES IN CHROME" (58.74-60.50) — EXACTLY butted (tOut === tIn), hard cut, zero base flash
  // BASE 60.75-63.25 (2.50 s) — "that's why i tell people this. you gotta, for number one,"
  { src: staticFile('broll-eph-hot-wallet.png'),       tIn: 63.25, tOut: 65.65, mode: 'content' }, // PSA RULE 1: "STAY AWAY FROM HOT WALLETS" (63.10-64.42)
  // BASE 65.65-70.85 (5.20 s) — PSA RULE 2 in his own words, "use, use AN APP, AN APP on your
  // computer. don't, don't use a CHROME EXTENSION." (the protected persona doublings) + BADGE 3.
  { src: staticFile('broll-eph-hardware-key.png'),     tIn: 70.85, tOut: 73.45, mode: 'content' }, // "you can use ONEKEY in association with your HARDWARE WALLET" (70.86-74.10)
  // BASE 73.45-79.75 (6.30 s) — "you have your browser add-on onekey extension in chrome. you can do that because"
  { src: staticFile('broll-eph-physical-confirm.png'), tIn: 79.75, tOut: 82.55, mode: 'full'    }, // PAYOFF: "the HACKER needs the ACTUAL PHYSICAL DEVICE to confirm on it" (79.88-82.80)
  // BASE 82.55-85.16 (2.61 s) — "so you're okay. BUT I WOULD JUST STAY AWAY." The deliberate HARD-OUT
  // plays on his face with nothing over it and no tail. That abruptness is the watch-time strategy.
];

// ─── Code-drawn badges ──────────────────────────────────────────────────────────────────────────
// Each one sits INSIDE a deliberate base stretch (never over a b-roll image) and they are 5.70 s and
// 16.50 s apart, so no two can ever co-occur. None starts before the thumb frame ends (0.033 s), and
// LivestreamShort suppresses badges while the thumb is up anyway.
//
// ⚠ GEOMETRY, measured on the render (NOT estimated). The shared `Badge` is positioned `left: 50%`
// with `translate(-50%,-50%)` and no explicit width, so an absolutely-positioned shrink-to-fit box is
// capped at (1080 - 540) = 540 px wide: ~436 px of text after the 52 px side padding. That is only
// ~8 characters at the 82 px `line2` size, so long lines WRAP and the box grows DOWNWARDS from its
// centre. The first pass used top 640 with a 5-line badge 1 ("TRAVEL ROUTER" + "+ HIS OWN VPN"),
// which measured a panel bottom of ~859 px against a caption top edge of ~873 px: a 14 px gap, i.e.
// effectively touching, which the SKILL's "never overlap in time AND space" rule does not allow.
// FIXED two ways: badge 1's line2 shortened to "OWN VPN" (one line instead of three, ~172 px less
// box) and ALL three raised to top 560. Clearances re-measured on the final render below.
export const BADGES_EPH: BadgeEv[] = [
  { tIn: 38.90, tOut: 41.60, color: '#00e5ff', line1: 'TRAVEL ROUTER', line2: 'OWN VPN',     sub: 'IN EVERY HOTEL',          top: 560 },
  { tIn: 47.30, tOut: 50.20, color: '#ffe600', line1: '2010 TO 2016',  line2: 'VPN COMPANY', sub: 'HE RAN ONE',              top: 560 },
  { tIn: 66.70, tOut: 69.40, color: '#39ff14', line1: 'RULE 2',        line2: 'USE AN APP',  sub: 'NOT A BROWSER EXTENSION', top: 560 },
];

// ─── Frame-0 thumbnail (IG/TikTok cover) ────────────────────────────────────────────────────────
// ONE frame only (LivestreamShort defaults thumb.durS to 1/fps) — generated background art with the
// hook title drawn in CODE on top, never baked into the image. No em dashes.
export const THUMB_DEF_EPH: ThumbDef = {
  img: THUMB_EPH,
  title: 'I RACED\nTHE HACKER\nDRAINING MY\nOWN WALLET',
  chip: 'EVEN ME, I GOT HACKED',
  chipColor: '#ff5252',
  titleSize: 118, // 11-char longest line ("DRAINING MY") stays inside the 968 px text box
};

// ─── SFX (shared library, COPIED into render-assets/sfx/; every event stays under the VO) ───────
// Whoosh on the frame-0 cover cut and on the b-roll transitions, impacts on the two peaks and the two
// big cuts, and two risers that each BUILD INTO an impact (per Impacts/WHEN-TO-USE-IMPACTS.md:
// "reserve them for the beats that actually matter"). NOTHING is placed on the hard-out: "but i would
// just stay away." ends clean and abrupt on purpose.
//
// ⚠ Cue points are each SFX's own PEAK position, not its file start. Envelopes re-measured on this
//   machine at 0.1 s RMS for this build: transition_rapid_whoosh peaks 0.10 s in - Cinematic Whoosh 02
//   peaks 0.80 s - Boom - Big Reveal peaks 0.00 s - TING peaks 0.80 s - DING peaks 0.20 s -
//   Kick_Impact_01 peaks 0.10 s - Soundjay_Impact_Main_01 peaks 0.20 s - Impact_Hit_01-2 peaks 0.10 s -
//   Tension_Rise_Logo_Reveal_3 attacks 0.90 s and peaks 2.50 s. Each cue below is therefore started
//   EARLY by exactly that offset so the crest lands on the frame it punctuates, and each riser's `dur`
//   is set to 2.50 so it ENDS exactly on the impact instead of smearing across the line after it.
//   Peak RMS differs by ~13 dB across these files, so the loud ones (Boom -2.5 dB, Kick -3.1 dB,
//   Soundjay -3.2 dB) get the lower volumes.
//
// ⚠ FINAL-MIX MASKING SWEEP (contract item 7, run on this clip 2026-08-07). The rendered MIX was
//   whisper-verified against the bare spine with the SAME model. Whole-file medium.en returns the
//   mix EQUAL OR BETTER than the spine everywhere (the mix even recovers "you try to", "you know"
//   and the closing "but") except ONE word: "even me, i GOT hacked" (56.76) came back as "get".
//   The cause is the TAIL of the 55.65 impact lying across the whole line. Measured with a 3-window
//   staggered large-v3 A/B (windows at 55.0 / 55.2 / 55.4 s, pattern "got hacked"):
//     spine  = 3/3 (the control)      original cue (dur 2.40) = 0/3      dur 1.10 = 0/3
//     vol dropped 0.26 -> 0.14        = 1/3    <- turning it DOWN does not fix it
//     dur 0.55 at FULL 0.26           = 3/3    <- shortening DOES
//   i.e. exactly the contract's point: this is a TIMING defect, not a gain choice, so the payoff hit
//   keeps its full 0.26 and is instead cut off the word. The cue now uses a trimmed variant of the
//   file, `Soundjay_Impact_Main_01-short.wav` (first 0.68 s with a 230 ms fade-out, generated into the
//   shared library alongside the existing `card-impact-hit01-3-short.wav` precedent): the transient
//   still lands on the 55.85 cut and the tail is gone before "even me, i GOT hacked". Verified 3/3,
//   equal to the spine control. The fade ends at -45 dBFS after the volume scale, so no click.
//   The sweep harness mixed candidate cues onto the bare spine offline, so none of this cost a render.
//   The two RISERS and the Boom were checked the same way and are CLEAN: 22.85-25.35 over "i went
//   into my phantom wallet ... all the tokens that were still there", 77.25-79.75 over "extension
//   in chrome. you can do that because", and the 25.35 Boom over "send them away to try to beat
//   them to it" all transcribe identically to the spine.
export const SFX_EPH: Sfx[] = [
  { t:  0.00, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.26, dur: 1.00 }, // frame-0 thumbnail cut (crest 0.10)
  { t:  0.20, src: staticFile('sfx/Cinematic Whoosh 02.wav'),               vol: 0.20, dur: 2.00 }, // sweeps INTO the HOOK full-screen (crest 1.00 = the cut)
  { t:  6.80, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.30, dur: 1.00 }, // cut into the token rows (6.90)
  { t: 12.40, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.30, dur: 1.00 }, // cut into the row flipping out (12.50)
  { t: 18.75, src: staticFile('sfx/Impacts/Kick_Impact_01.wav'),            vol: 0.26, dur: 2.20 }, // IMPACT on the PEAK cut (18.85), crest lands BEFORE "somebody's" (18.94)
  { t: 22.85, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_3.wav'), vol: 0.10, dur: 2.50 }, // riser BUILDS INTO the climax and ENDS exactly on it (25.35)
  { t: 25.35, src: staticFile('sfx/Boom - Big Reveal.wav'),                 vol: 0.30, dur: 2.60 }, // IMPACT on the CLIMAX full-screen cut (peak 0.00 = fires on the frame)
  { t: 44.05, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.28, dur: 1.00 }, // cut into the VPN tunnel (44.15)
  { t: 46.50, src: staticFile('sfx/TING SOUND EFFECT.mp3'),                 vol: 0.24, dur: 2.00 }, // receipt ding on BADGE 2 (crest 47.30)
  { t: 55.65, src: staticFile('sfx/Impacts/Soundjay_Impact_Main_01-short.wav'), vol: 0.26, dur: 0.70 }, // IMPACT on the "even me" cut (55.85), crest BEFORE "even" (56.08). SHORTENED VARIANT from the masking sweep (see note above) - full gain kept
  { t: 58.15, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.26, dur: 1.00 }, // the B7 -> B8 HARD CUT (58.25)
  { t: 63.15, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.28, dur: 1.00 }, // cut into the red-hot wallet (63.25)
  { t: 66.50, src: staticFile('sfx/DING.mp3'),                              vol: 0.22, dur: 1.60 }, // BADGE 3 (RULE 2) reveal (crest 66.70)
  { t: 70.75, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.28, dur: 1.00 }, // cut into the hardware device (70.85)
  { t: 77.25, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_3.wav'), vol: 0.10, dur: 2.50 }, // riser BUILDS INTO the payoff and ENDS exactly on it (79.75)
  { t: 79.65, src: staticFile('sfx/Impacts/Impact_Hit_01-2.wav'),           vol: 0.30, dur: 2.40 }, // IMPACT on the PAYOFF full-screen cut (79.75)
];

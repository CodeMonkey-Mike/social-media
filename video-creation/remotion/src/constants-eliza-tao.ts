import { staticFile } from 'remotion';
import type { BrollEv, Sfx } from './_kit';
import type { BadgeEv } from './LivestreamShort';
import type { ThumbDef } from './LivestreamShort';

// ─── eliza / clip #3 `trading-against-ourselves` (variant: full) ────────────────────────────────
// "We're Trading Against Ourselves" — the Robinhood meme casino is crypto natives rotating into
// each other's exits. Without NEW retail the hype dwindles, the people who bought the top check
// out, and the stablecoin outflows that started in May run to December before the money comes back.
//
// ⚠ NAME COLLISION, do not confuse: `TradingAgainstOurselves.tsx` + `constants-tao.ts` +
//   `captionsTao.ts` are the JULY 20 **clarity-act clip #2** ("We Are Only Trading Against
//   Ourselves"), registered in Root.tsx since Jul 20 and long since published. THIS clip is a
//   different livestream (eliza, 2026-08-06) and lives entirely under the `ETAO` prefix.
//
// Base clip: trading-against-ourselves-tightened-desilenced.mp4 (raw cut -> Phase 5 tighten with a
// 3-point boundary relock -> 5B desilence at min-sil 0.25). ALREADY composited vertical
// (screen-share on top, webcam below), 1080x1920 @ 25 fps, 95.26 s. FINAL, do NOT re-cut and do NOT
// re-split the zones. The comp runs at 30 fps; OffthreadVideo resamples the 25 fps source by TIME,
// so every cue below is plain seconds taken from the clip's own Whisper word timings (clip-relative,
// 0-based, `trading-against-ourselves/whisper-words.json`, 354 words).
//
// ⚠ The file referenced here is the render-assets COPY, re-encoded to a SEEK-FRIENDLY GOP
//   (-g 25 -keyint_min 25 -bf 0 -sc_threshold 0, CRF 18, audio -c:a copy so the mix is bit-identical)
//   — mandatory since the 2026-08-03 finding that Remotion's concurrent OffthreadVideo seeks die
//   mid-render on a long-GOP original. The canonical spine in the clip folder is never touched.
//   (Measured before: keyframes every ~10 s. After: every 1.00 s.)
//
// Render (public-dir = the BATCH's render-assets/, which holds the spine + thumbnail + b-roll + sfx):
//   npx remotion render src/index.ts ElizaTradingAgainstOurselves \
//     out/eliza/3-trading-against-ourselves.mp4 \
//     --public-dir "<repo>/video-creation/shorts/eliza/render-assets"

export const ETAO_FPS = 30;
// 95.26 s spine. 2857 frames => last frame index 2856 = t 95.200 s, inside the clip (no black tail).
export const ETAO_DURATION = 2857;

export const CLIP_ETAO  = staticFile('trading-against-ourselves.mp4');
export const THUMB_ETAO = staticFile('thumb-etao.png');

// Layout geometry, MEASURED on this clip (row-mean gradient scan at t=5/20/35/50/70/92 s; all six
// frames put the hard screen-share/webcam divider on the same row, |delta| 158-206 vs a next-best
// row delta of 10-24, so the seam is unambiguous). Row 853 is the last content row => height 854.
export const ETAO_SEAM  = 854; // content zone = 0..853 (DexScreener IF/WETH then CASHCAT/WETH, then
                               // TradingView BTC.D / TOTAL3-USM2); the webcam plays below it
export const ETAO_CAP_Y = 890; // caption centre: 36 px under the seam, on his hair, never his eyes
                               // (measured: his eyes sit at ~1180 on this clip's framing)

// ─── B-roll beats (authored in BROLL-PLAN.md BEFORE generation) ────────────────────────────────
// Coverage budget (SKILL "B-roll coverage budget", HALVED 2026-07-14):
//   30.52 s covered / 95.26 s = 32.0 % b-roll, 64.74 s = 68.0 % BASE SHOWING. Targets ~30 % / ~70 %
//   (bands 25-35 % / 65-75 %) => on target. 11 distinct images, ZERO reuse inside the clip, every
//   beat 2.36-3.46 s (the style guide's "changes every 1-3 s").
// 3 full-screens ONLY (the hook / the "hype phases away" turn / the bull-run climax) = the FIRM 1-3
// cap. B1 ends 5.50 and the next full starts 54.30; B7 ends 57.20 and the next full starts 91.80, so
// no full->base->full flash exists anywhere. The ONLY image-to-image join is B6 -> B7, EXACTLY butted
// (tOut === tIn === 54.30) so BrollLayer HARD-CUTS content-zone -> full-screen with zero base frames.
//
// The content zone is a genuine RECEIPT for most of this clip and is therefore SHOWN. Two stretches
// are PROTECTED base beats because Mike POINTS at the chart while narrating it:
//   30.90-42.90  "buying in like up here / up at the top / these guys bought down here and they're
//                 selling up here"  (a badge carries it instead of an image)
//   45.30-51.60  "but the ones over here were still buying in ... bought in for the first time"
// Nothing may be drawn over those two windows except the code badge at 35.60-38.40.
// staticFile() calls are LITERAL strings on purpose — the finalized-short gate scans for literal refs.
export const BROLL_ETAO: BrollEv[] = [
  // BASE 0.00-2.90 — the frame-0 thumb is ONE frame; the video opens on Mike + the What If page
  { src: staticFile('broll-etao-mirror.png'),     tIn:  2.90, tOut:  5.50, mode: 'full'    }, // HOOK: "like we're TRADING AGAINST OURSELVES" (2.74-4.54)
  // BASE 5.50-9.90 (4.40 s) — "when it comes to like these memes, all of us that are in crypto that haven't checked out"
  { src: staticFile('broll-etao-slotcrowd.png'),  tIn:  9.90, tOut: 12.50, mode: 'content' }, // "jumping on these ROBINHOOD MEMES because it seems exciting" (9.48-12.38)
  // BASE 12.50-20.70 (8.20 s) — "and we keep bouncing, maybe one is pumping and then the next one we rotate into, another meme"
  { src: staticFile('broll-etao-emptyarena.png'), tIn: 20.70, tOut: 23.10, mode: 'content' }, // "it's going to DWINDLE OUT if there's NO NEW RETAIL" (20.74-22.96)
  // BASE 23.10-28.54 (5.44 s) — he navigates and points: "like I can assure you that now let's go to what if, this pump right here"
  { src: staticFile('broll-etao-whatif.png'),     tIn: 28.54, tOut: 30.90, mode: 'content' }, // "...a couple hours ago. THAT'S FROM ROBINHOOD RETAIL." (28.54-30.44) — the What If reference beat
  // ⛔ BASE 30.90-42.90 (12.00 s) — PROTECTED CHART-WALK, no image: "there's probably been a lot of
  // people who are buying in like up here, right? like up at the top ... these guys bought down here
  // and they're selling up here." He is pointing at the candles the whole way; the badge at
  // 35.60-38.40 sits BELOW the price action, over the transaction table.
  { src: staticFile('broll-etao-rotate.png'),     tIn: 42.90, tOut: 45.30, mode: 'content' }, // "maybe they're going to ROTATE INTO ANOTHER ROBINHOOD TOKEN" (42.72-45.28)
  // ⛔ BASE 45.30-51.60 (6.30 s) — PROTECTED CHART-WALK, no image: "but the ones over here were still
  // buying in ... they just bought in for the first time and they're losing the money."
  { src: staticFile('broll-etao-checkout.png'),   tIn: 51.60, tOut: 54.30, mode: 'content' }, // PEAK: "maybe they got PISSED OFF and they just CHECKED OUT" (51.58-54.00)
  { src: staticFile('broll-etao-hypefade.png'),   tIn: 54.30, tOut: 57.20, mode: 'full'    }, // TURN: "all the HYPE is just going to PHASE AWAY" — EXACTLY butted to the beat above, hard cut, zero base flash
  // BASE 57.20-65.40 (8.20 s) — "fiddle away or whatever you want to say. it's going to disappear
  // over the next few weeks and they're not going to be putting any cash into other Robinhood tokens."
  { src: staticFile('broll-etao-gateway.png'),    tIn: 65.40, tOut: 68.20, mode: 'content' }, // "it goes back to the whole thing that WE NEED MORE PEOPLE IN CRYPTO" (65.40-69.72)
  // BASE 68.20-72.40 (4.20 s) — the seg1 -> seg2 join and the switch to the TradingView BTC.D chart
  { src: staticFile('broll-etao-vaultdrain.png'), tIn: 72.40, tOut: 75.30, mode: 'content' }, // "a lot of OUTFLOWS OF CASH COMING OUT of stablecoins" (72.68-75.64)
  // ⛔ BASE 75.30-82.50 (7.20 s) — the DOUBLED "which happens every bear market" anaphora (76.84-79.38),
  // his peak beat. Carried by the badge at 77.00-79.80, never by an image.
  { src: staticFile('broll-etao-turnstile.png'),  tIn: 82.50, tOut: 85.90, mode: 'content' }, // "there's MORE PEOPLE CHECKING OUT and that's going to create a lot of WEAKNESS" (82.24-85.54)
  // BASE 85.90-91.80 (5.90 s) — the TOTAL3/USM2 chart he is reading: "these outflows of stablecoins
  // STARTED IN MAY ... it's going to END IN DECEMBER" (badge at 88.30-91.30, no image)
  { src: staticFile('broll-etao-bullrun.png'),    tIn: 91.80, tOut: 95.40, mode: 'full'    }, // CLIMAX / HARD-OUT: "the money is going to come back in, the BULL RUN STARTS AGAIN" (tOut past the last frame 95.20 so the climax never fades out before the hard-out)
];

// ─── Code-drawn badges ─────────────────────────────────────────────────────────────────────────
// All three sit INSIDE a deliberate base stretch (never over a b-roll image) and none share a time
// window with another, so no two graphics can collide in time OR space (SKILL production rule 3).
// Geometry: Badge is centred on `top`, and a 3-line badge measures ~258 px => it spans y 531-789.
// That is BELOW the candle price action Mike points at (y ~80-400 on this framing) and ABOVE the
// caption band (a one-line caption at capY 890 starts at y ~845; a two-line one at ~806). The
// earliest tIn is 35.60, far past the ONE-frame thumb (0.033 s), so nothing renders under the cover.
export const BADGES_ETAO: BadgeEv[] = [
  { tIn: 35.60, tOut: 38.40, color: '#ff5252', line1: 'BOUGHT',  line2: 'THE TOP',     sub: 'NEW RETAIL',          top: 660 },
  { tIn: 77.00, tOut: 79.80, color: '#ff9f1c', line1: 'EVERY',   line2: 'BEAR MARKET', sub: 'SAME PATTERN',        top: 660 },
  { tIn: 88.30, tOut: 91.30, color: '#ffe600', line1: 'MAY',     line2: 'TO DECEMBER', sub: 'STABLECOIN OUTFLOWS', top: 660 },
];

// ─── Frame-0 thumbnail (IG/TikTok cover) ────────────────────────────────────────────────────────
// ONE frame only (LivestreamShort defaults thumb.durS to 1/fps) — generated background art with the
// hook title drawn in CODE on top, never baked into the image. No em dashes.
export const THUMB_DEF_ETAO: ThumbDef = {
  img: THUMB_ETAO,
  title: 'WE\'RE\nTRADING\nAGAINST\nOURSELVES',
  chip: 'NO NEW RETAIL',
  chipColor: '#39ff14', // lime green (the clip is about Robinhood tokens, never Kaspa teal)
  titleSize: 128,       // longest line "OURSELVES" (9 chars) inside the 968 px text box
};

// ─── SFX (shared library, COPIED into render-assets/sfx/; every event stays under the VO) ───────
// Whoosh on the frame-0 cover cut and on the major b-roll transitions, impacts on the two punch
// beats, a ding on the What If receipt, a TING on the badge reveal, and one riser that BUILDS INTO
// the climax impact (per Impacts/WHEN-TO-USE-IMPACTS.md: reserve impacts for the beats that matter).
//
// ⚠ Cue points are each SFX's own PEAK position, not its file start. Envelopes measured on this
//   machine at 50 ms RMS for this build: transition_rapid_whoosh peaks 0.15 s in - Cinematic
//   Whoosh 02 peaks 0.80 s - Cinematic Whoosh 06 peaks 0.60 s - DING peaks 0.20 s - TING peaks
//   0.80 s - Soundjay_Impact_Main_01 peaks 0.25 s - Kick_Impact_01 peaks 0.15 s - Boom - Big Reveal
//   peaks 0.05 s - Tension_Rise_Logo_Reveal_3 crosses 20 % at 0.85 s / 50 % at 1.80 s and peaks at
//   2.55 s. Each cue below is started EARLY by exactly that offset so the crest lands on the frame
//   it punctuates. Peak RMS spans ~15 dB across these files, so the loud ones (Kick -4.9 dB,
//   Boom -5.2 dB, Soundjay -5.5 dB) carry the lower volumes.
//
// ⚠ RISER SUBSTITUTION vs BROLL-PLAN.md: the plan named `risers/Edgy_Riser.wav` at t 90.60 for the
//   1.20 s run-up into the 91.80 climax. Measured, Edgy_Riser does not cross 20 % of its own level
//   until 2.90 s and peaks at 5.10 s, so a 1.20 s window would render 1.2 s of near-silence (a
//   no-op cue). `Tension_Rise_Logo_Reveal_3` is the same family with a 0.85 s / 1.80 s / 2.55 s
//   envelope, i.e. it actually builds inside the window. Started at 89.80 and truncated at 91.80 by
//   dur 2.00, it crescendos straight into the Boom and stops there.
//
// ⚠ FINAL-MIX MASKING SWEEP (contract item 7, run on this clip 2026-08-07). Whisper-verifying the
//   rendered MIX against the bare spine, window by window, found the opening whooshes (0-6.5 s), the
//   DING (25.5-31 s), the "checked out" impact (50.8-55 s), the "whole thing" whoosh (64.8-70 s) and
//   the Kick impact (81.6-86.5 s) ALL transcribe IDENTICALLY to the spine - no change needed. The
//   payoff window (86.8-95.2 s) did NOT, and two cues were the maskers:
//     - the TING (plan cue 8, a receipt ding on the MAY TO DECEMBER badge) is DELETED. It was at
//       t 87.50, putting its 0.80 s crest on "started in May." (87.90-88.76): the mix read "stable
//       coin START OF THE MAY". Retiming to 88.08 (crest 88.88, inside the verified pause between
//       "May." at 88.76 and "So" at 89.02) fixed that phrase, but its 0.85 s DECAY then corrupted
//       "so it stands to reason" (89.02-90.12) into "so if you stand". The gain was swept at full
//       render fidelity (spine -> 48 kHz stereo -> AAC 317k -> decode, i.e. the render's own audio
//       path) at 0.22 / 0.14 / 0.07: EVERY audible value returns "so 50 stands" / "so it could be
//       stands", and only REMOVING the cue returns the control's "so it stands". Volume cannot fix
//       it, and the VO runs unbroken 89.02-91.98 so there is nowhere to retime it to. Per contract
//       item 7 an SFX cue that makes a line transcribe worse than the bare spine is a build defect,
//       so the cue is dropped: it is decoration on a badge, not a payoff hit, and 9 SFX events
//       remain. This is the ONE deviation from BROLL-PLAN.md's 10-event SFX table.
//     - the Boom's 3.40 s ring-out ran to 95.15 and smeared the HARD-OUT line: "the BULL RUN starts
//       again" (94.38-94.96) transcribed as "the BORON starts again". The payoff hit is never the
//       cue you lower, so its 0.32 gain and its 91.80 crest are UNTOUCHED and only the tail is
//       SHORTENED to dur 2.30 (ends 94.05, 0.33 s before "bull"). Truncation step measured at
//       -28.4 dBFS in-file => -38 dBFS after the 0.32 gain, i.e. 17 dB under the -21 dBFS VO there:
//       inaudible, no click.
//   After the fix the payoff window matches the spine control word for word ("of stable coin STARTED
//   IN MAY ... the money's going to come back in and THE BULL RUN STARTS AGAIN"); the only residual
//   difference in the whole file is Whisper rendering "gonna" as "going to", which is not a word loss.
export const SFX_ETAO: Sfx[] = [
  { t:  0.00, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.20, dur: 1.00 }, // the frame-0 thumbnail cut into the video
  { t:  2.10, src: staticFile('sfx/Cinematic Whoosh 02.wav'),               vol: 0.30, dur: 2.30 }, // sweeps INTO the full-screen hook (crest 2.90 = the cut)
  { t: 28.34, src: staticFile('sfx/DING.mp3'),                              vol: 0.22, dur: 1.60 }, // the What If / "that's from Robinhood retail" reveal (crest 28.54)
  { t: 51.35, src: staticFile('sfx/Impacts/Soundjay_Impact_Main_01.wav'),   vol: 0.26, dur: 2.20 }, // IMPACT on "got pissed off and CHECKED OUT" (crest 51.60)
  { t: 53.70, src: staticFile('sfx/Cinematic Whoosh 06.wav'),               vol: 0.30, dur: 2.10 }, // sweeps INTO the B6 -> B7 HARD CUT to the full-screen (crest 54.30)
  { t: 65.25, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.22, dur: 1.00 }, // cut into "we need more people in crypto" (crest 65.40)
  { t: 82.35, src: staticFile('sfx/Impacts/Kick_Impact_01.wav'),            vol: 0.24, dur: 2.40 }, // IMPACT on "more people CHECKING OUT" -> weakness (crest 82.50)
  // ⛔ the plan's 10th cue, a TING on the MAY TO DECEMBER badge reveal, is DELETED - see the sweep
  //    note above. It could not be placed anywhere in this window without corrupting the VO.
  { t: 89.80, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_3.wav'), vol: 0.14, dur: 2.00 }, // riser BUILDS INTO the payoff and ends ON the impact (91.80)
  { t: 91.75, src: staticFile('sfx/Boom - Big Reveal.wav'),                 vol: 0.32, dur: 2.30 }, // the biggest hit of the short, on the climax full-screen (crest 91.80); TAIL TRUNCATED at 94.05 by the masking sweep, gain untouched
];

import { staticFile } from 'remotion';
import { type BrollEv, type Sfx } from './_kit';
import type { ThumbDef, BadgeEv, OverlayEv } from './LivestreamShort';

// ─────────────────────────────────────────────────────────────────────────────────────────────
// batch uptober / clip #2 - `pippin-went-dead-then-89x` (variant: FULL)
// clip-plan title: "Pippin Went Dead, Then It Did an 89x"
//
// "I tell you, there's a backstory with the 89x on Pippin in a bear market. Pippin was a play of mine from
//  early 2025, and it seemed to have gone dead in August of 2025. Not only did the Twitter profile go dead in
//  August with Pippin, but it went dead in terms of getting into a centralized exchange, Pippin started
//  ripping. And I was like, why is this happening? We're getting pinged over and over and over again. Like,
//  oh my God. Oh my God. Oh my God. Started ripping, like it started going up and up and up, and eventually
//  it was like an 89x by the time we got out of it, took some profits, made tons of money."
//
// Same-topic precedent: batch biggest-bullrun clip 3 (BiggestBullrunPippinDead85x, bbr3 assets). NONE of its
// assets or concepts are reused here (bbr3: ash coin, candle eruption, cracking coin, vertical run, bull run);
// every pip2 image is a fresh treatment (unicorn mascot, bear wasteland, carousel, candle staircase, gold
// mountain).
//
// Spine: shorts/uptober/pippin-went-dead-then-89x/pippin-went-dead-then-89x-final.mp4, staged GOP-seek-friendly
// to render-assets/pippin-went-dead-then-89x.mp4 - VERIFIED on the staged file (ffprobe 2026-10-01):
// has_b_frames 0, 1080x1920 @25 fps, video 35.920 s, audio 35.926 s.
// Plan of record: shorts/uptober/pippin-went-dead-then-89x/BROLL-PLAN.md
// Captions: captionsUptoberPippin89x.ts (canonical captions skill; header = provenance).
// Build directives for clip 2 (clip_directives.py --batch uptober --clip 2): none. No coverage exemption.
// ─────────────────────────────────────────────────────────────────────────────────────────────

export const PIP2_FPS = 30;
// Video 35.920 s, audio 35.926 s. 1077 frames: the LAST rendered frame (1076) sits at 35.867 s, inside both
// tracks. Last word "money." ends 35.86 s: a hard out.
export const PIP2_DURATION = 1077;

// MEASURED on THIS spine: row-mean gradient scan (rows 600-1300) puts the largest step at the 853/854 boundary
// on 4 of 4 frames (t = 3, 12, 20, 30 s; re-measured this build, agrees with the plan's 6 of 6).
export const PIP2_SEAM = 854;
// Caption band centre: a 74 px caption with its 13 px stroke spans ~910..1010, 56 px clear of the seam; the
// webcam above Mike's hair (~row 1400) is plain blue wall.
export const PIP2_CAP_Y = 960;
// Pippin unicorn PINK (the mascot's pastel mane); never Kaspa teal.
export const PIP2_ACCENT = '#ff6ec7';
const GOLD = '#ffc629';
const GREEN = '#39ff14';
const RED = '#ff4444';

export const CLIP_PIP2 = staticFile('pippin-went-dead-then-89x.mp4');

// ── FRAME-0 COVER (ONE frame; `durS` omitted so LivestreamShort uses 1/fps) ───────────────────
// Art = a white cartoon unicorn bursting up out of a blank cracked gravestone on a green candle; upper 45% left
// dark for the CODE title. Pippin has NO reference on disk, so the name is TYPE only (chip), never art.
export const THUMB_DEF_PIP2: ThumbDef = {
  img: staticFile('thumb-pip2-cover.png'),
  title: 'IT WENT\nDEAD.\nTHEN 89x',
  chip: 'PIPPIN IN A BEAR MARKET',
  chipColor: PIP2_ACCENT,
  titleSize: 132,
};

// ── B-ROLL ──────────────────────────────────────────────────────────────────────────────────────
// Budget (video-creation/SKILL.md "B-roll coverage budget (HALVED 2026-07-14)"):
//   3.24 + 2.30 + 3.05 + 3.32 = 11.91 s of 35.90 s = 33.2 % b-roll / 66.8 % base
//   4 distinct images, each used EXACTLY ONCE, no loop, no reuse
//   2 full-screen moments: the hook and the climax (inside the FIRM cap of 3)
// Base content zone (frame-diff rows 0..850): 0-4.76 an off-topic #stonk channel + CoinMarketCap card (mostly
// covered by the hook); 4.76-4.96 a burned-in meme-video flash with real faces (covered); 4.8-23.9 the Discord #pippin exchange-listing alert channel (THE receipt for "we're getting
// pinged"); 23.9-26.0 Mike's burned-in FULL-FRAME dancing meme (never covered); 26.0-end the channel again.
export const BROLL_PIP2: BrollEv[] = [
  // HOOK, full-screen. "with the 89x on Pippin in a bear market." - a sleeping red-candle grizzly in a frozen
  // wasteland, a tiny unicorn rocketing past on a green trail. Frames 1..1.84 are the face + screen base
  // (Phase 7 rule 5) on "I tell you, there's a backstory with the". The cut lands ON "89x" (1.84): the hit on
  // the old 1.38 cut ("with") masked "with the" at every gain (whisper sweep _qa/sfx/res2.json), while a crest
  // on 1.84 matched the encode-matched control in 4 of 4 staggered windows (res3.json `imp181`). OUT at 5.08:
  // the base carries a burned-in 0.2 s flash of a meme VIDEO WITH REAL FACES at 4.76-4.96 (frame-diff on the
  // staged spine); the 0.12 s fade starts at 4.96, so the flash is fully covered. Ends before "Pippin was"'s
  // $PIPPIN badge (5.10). 3.24 s of covered face.
  { src: staticFile('broll-pip2-hook-bear-wasteland.png'), tIn: 1.84, tOut: 5.08, mode: 'full' },
  // "to have gone dead in August of 2025." - an abandoned carousel, one dusty cobwebbed unicorn.
  { src: staticFile('broll-pip2-dead-carousel.png'), tIn: 8.40, tOut: 10.70, mode: 'content' },
  // "started ripping, like it started going up and up and up" - the unicorn galloping up a spiral staircase
  // of green candles. IN at 26.05, the frame after Mike's burned-in meme ends.
  { src: staticFile('broll-pip2-gallop-candles.png'), tIn: 26.05, tOut: 29.10, mode: 'content' },
  // CLIMAX, full-screen. "we got out of it, took some profits, made tons of money." - the unicorn rearing on a
  // mountain of blank gold coins. tOut past the comp end = holds to the hard out.
  { src: staticFile('broll-pip2-climax-gold.png'), tIn: 32.58, tOut: 36.00, mode: 'full' },
];

// ── TRANSPARENT OVERLAY (alpha PNG, glow-on-black -> alpha-from-luminance) ─────────────────────
// ONE real alpha overlay on a BASE beat: "We're getting pinged over and over and over again" - a golden
// ringing notification bell pops in over the RIGHT of the alert channel (the timestamps column; the message
// text on the left stays readable). Clear of every badge window, the caption band and the b-roll windows.
export const OVERLAYS_PIP2: OverlayEv[] = [
  { src: staticFile('ovl-pip2-bell.png'), tIn: 19.22, tOut: 21.98, top: 150, left: 680, width: 340, blend: 'normal' },
];

// ── BADGES (code-drawn) ─────────────────────────────────────────────────────────────────────────
// Never sharing a window with each other, the overlay, or any b-roll image. `top` = badge centre y
// (~105 px above/below): top 620 (~515-725) sits over the lower half of the alert channel. line1 is ONE token.
export const BADGES_PIP2: BadgeEv[] = [
  { tIn: 5.10, tOut: 7.55, color: PIP2_ACCENT, line1: '$PIPPIN', sub: 'EARLY 2025 PLAY', top: 620 },
  { tIn: 11.38, tOut: 13.55, color: RED, line1: 'DEAD', sub: 'TWITTER WENT QUIET IN AUGUST', top: 620 },
  { tIn: 14.44, tOut: 15.95, color: GOLD, line1: 'CEX', sub: 'LISTINGS WENT DEAD', top: 620 },
  { tIn: 31.18, tOut: 32.40, color: GREEN, line1: '89x', sub: '$PIPPIN', top: 620 },
];

// ── SFX ─────────────────────────────────────────────────────────────────────────────────────────
// Palette (5 ms peak-envelope at 16 kHz, whole files; same measured library files as uptober clip 1):
//   transition_rapid_whoosh        0.967 s, crest 0.165 s
//   transition_rapid_whoosh-tight  0.420 s, crest 0.165 s
//   card-impact-layered            1.450 s, crest 0.030 s
//   DING-093                       0.930 s, crest 0.150 s
//   Kick_Impact_01-short           0.550 s, crest 0.185 s
//   DSGNImpt-single_impact_sound   2.000 s, crest 0.030 s
// Every `t` is (cue time - crest) so the crest lands ON the cut / badge / overlay frame.
export const SFX_PIP2: Sfx[] = [
  // the frame-0 cover cutting to the base at frame 1. Low: it sits under "I tell you".
  { t:  0.033, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.12, dur: 1.00 },
  // hook reveal hit on the 1.84 full-screen cut, crest ON "89x" (see the BROLL_PIP2 hook note for the sweep).
  { t:  1.81, src: staticFile('sfx/Impacts/card-impact-layered.wav'), vol: 0.14, dur: 1.50 },
  // ding on the $PIPPIN badge, crest on 5.10 ("Pippin was"), tail cut to 0.45 s.
  { t:  4.95, src: staticFile('sfx/DING-093.wav'), vol: 0.13, dur: 0.45 },
  // low hit into the dead-carousel cutaway at 8.40, tail truncated.
  { t:  8.215, src: staticFile('sfx/Impacts/Kick_Impact_01-short.wav'), vol: 0.14, dur: 0.35 },
  // the bell pops on "pinged" (19.22): ding crest on the overlay frame.
  { t: 19.07, src: staticFile('sfx/DING-093.wav'), vol: 0.12, dur: 0.40 },
  // second ring on the second "over" (20.58).
  { t: 20.43, src: staticFile('sfx/DING-093.wav'), vol: 0.10, dur: 0.40 },
  // whoosh into the gallop cutaway at 26.05 (tight variant, ends 26.305).
  { t: 25.885, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.42 },
  // ding on the 89x badge, crest on 31.18 ("89x").
  { t: 31.03, src: staticFile('sfx/DING-093.wav'), vol: 0.13, dur: 0.45 },
  // THE payoff hit on the climax cut (32.58), under "we got out of it".
  { t: 32.55, src: staticFile('sfx/Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3'), vol: 0.20, dur: 2.05 },
];

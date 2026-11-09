// kaspa-cocktails clip 3 `kaspa-first-bear-market-mirrors-bitcoin` (FULL, 61.76 s video stream): composition data.
// Batch kaspa-cocktails (livestream 2026-11-02). Plan: shorts/kaspa-cocktails/kaspa-first-bear-market-mirrors-bitcoin/BROLL-PLAN.md
// Public dir: shorts/kaspa-cocktails/render-assets. Spine is 25 fps; the comp runs at 30 fps.
// Seam MEASURED: content rows 0..853, webcam from 854 (t = 1/11/13/17/33/45/60.6 s) -> SEAM 855.
// Segment joins MEASURED (content-zone frame diff): 9.80 / 11.84 / 15.92 / 27.28 / 32.08 / 59.44 s.
import { staticFile } from 'remotion';
import type { BrollEv, Sfx } from './_kit';
import type { BadgeEv, OverlayEv, RedactEv, ThumbDef } from './LivestreamShort';

export const KC3_FPS = 30;
export const KC3_DURATION_S = 61.73;
export const KC3_DURATION_FRAMES = 1852; // floor(61.76 s video stream * 30): never past the last spine frame
export const KC3_SEAM = 855;
export const KC3_CAP_Y = 880;
export const KC3_ACCENT = '#00e5ff'; // Kaspa teal: this is a Kaspa clip

export const KC3_CLIP = staticFile('kaspa-first-bear-market-mirrors-bitcoin.mp4');

// 3 full-screens (hook, the 2022 twist, climax) + 5 content-zone cutaways, each tied to one talking point:
// full 2.92 + 1.85 + 2.31 = 7.08 s; content 2.27 + 2.09 + 2.90 + 2.95 + 2.80 = 13.01 s;
// 20.09 s of 61.73 s = 32.5 % b-roll / 67.5 % base (band 25-35 %). Base keeps the viewer's X post (the receipt Mike
// reads), the "look at that" chart and the KAS weekly chart with its 50-week SMA on screen.
export const KC3_BROLL: BrollEv[] = [
  // hook: "so two different cryptos," ends 1.30 -> "one is the king and the other is up and coming." (out in the 4.10-4.16 trough)
  { src: staticFile('broll-kc3-hook-king.png'), tIn: 1.33, tOut: 4.25, mode: 'full' },
  // "Kaspa's bear market is identical": covers Mike's off-message yacht image (spine 11.84-15.92). tIn 11.68 so the
  // 0.12 s fade-in is complete (11.80) before the yacht's first frame at 11.84.
  { src: staticFile('broll-kc3-mirror-bears.png'), tIn: 11.68, tOut: 13.95, mode: 'content' },
  // "to Bitcoin's first real bear market." (hard cut from the mirror at the 13.89-14.03 trough). tOut 16.04 so the
  // 0.12 s fade-out starts at 15.92, the first frame of the KAS chart (no yacht ghost).
  { src: staticFile('broll-kc3-btc-first-bear.png'), tIn: 13.95, tOut: 16.04, mode: 'content' },
  // "Bitcoin is below the 50-week moving average. Therefore it's a bear market."
  { src: staticFile('broll-kc3-btc-below-line.png'), tIn: 24.3, tOut: 27.2, mode: 'content' },
  // the twist: "Kaspa was not in a bear market." (in at the 30.32-30.38 trough after "right in 2022,"; out after the 32.08 join).
  // Was 29.10 (on "right in 2022"): its impact masked "right" in 2/3 Whisper windows; moved with the hit (SKILL row 7: timing first).
  { src: staticFile('broll-kc3-2022-contrast.png'), tIn: 30.35, tOut: 32.2, mode: 'full' },
  // "Kaspa's in a bull market since it really started." (in at the 37.85-38.01 trough)
  { src: staticFile('broll-kc3-kaspa-bull.png'), tIn: 38.0, tOut: 40.95, mode: 'content' },
  // "Kaspa goes into a bear market in December of 2024," (in at the 46.95 trough, out at the 49.64-49.93 trough)
  { src: staticFile('broll-kc3-kaspa-frozen.png'), tIn: 46.92, tOut: 49.72, mode: 'content' },
  // climax: "Yeah, the whole rise and fall of Kaspa's identical." (in at the 59.39-59.44 trough = the 59.44 join). tOut past
  // the 61.73 end so the fade-out never ghosts the base through the last frames (clip 1's measured lesson).
  { src: staticFile('broll-kc3-climax-identical.png'), tIn: 59.42, tOut: 61.95, mode: 'full' },
];

// Burned-in VIEWER CHAT, ONE viewer all clip (MEASURED at t = 1 / 11 / 13 / 33 / 60.6 s: handle pill x 0-213 / y 702-737).
// All three messages are on-topic (Mike reads and answers this viewer), so the text stays and only the handle pill is
// plated, the clip-1 precedent. Painted UNDER the b-roll.
// The pill MOVES with the message height (MEASURED per segment): 1-line message 0-11.84 and 59.44-end -> pill y 704-734;
// 2-line message 11.84-59.44 -> pill y 690-721 with the message text from ~725. One 699/40 plate for the whole clip let the
// pill top peek out and clipped "I think I'll have to" over 11.84-59.44 (MEASURED on the render, fixed by splice). Plates switch
// at 11.85 / 59.45 (comp frames 356 / 1784 are the first to show spine frames 296 / 1486, the new segments).
export const KC3_REDACTIONS: RedactEv[] = [
  { tIn: 0, tOut: 11.85, top: 699, height: 40, left: 0, width: 218 },
  { tIn: 11.85, tOut: 59.45, top: 686, height: 38, left: 0, width: 218 },
  { tIn: 59.45, tOut: 62.1, top: 699, height: 40, left: 0, width: 218 },
];

// Badge band: 2-line box ~215 px tall centred at `top`, so top 430 spans ~322-538 and top 520 spans ~412-628: above the
// chat plate (698) and the caption band (capY 880). Strictly sequential; every badge renders until tOut + 0.1 s and every
// tOut + 0.1 lands BEFORE the next b-roll tIn (no badge on top of an image). NBSP keeps each line one run (plain spaces
// wrapped every badge line on the render: MEASURED, fixed by splice). No hyphens either: '50-WEEK' broke at the hyphen.
export const KC3_BADGES: BadgeEv[] = [
  { tIn: 4.3, tOut: 6.9, color: '#00e5ff', line1: '11 YEARS APART', line2: 'IDENTICAL', top: 520 },
  { tIn: 20.25, tOut: 21.95, color: '#ff5252', line1: 'KASPA’S FIRST', line2: 'BEAR MARKET?', top: 430 },
  { tIn: 32.4, tOut: 34.3, color: '#ff5252', line1: 'KASPA’S BEAR', line2: 'BEGAN DEC 2024', top: 430 },
  { tIn: 43.8, tOut: 46.55, color: '#ff9f1c', line1: '2022: BTC BEAR', line2: 'KASPA BULL', top: 430 },
  { tIn: 54.25, tOut: 56.85, color: '#ff5252', line1: 'NEARLY 2 YEARS', line2: 'IN A BEAR', top: 430 },
  { tIn: 57.5, tOut: 59.3, color: '#39ff14', line1: 'BACK ABOVE', line2: '50 WEEK SMA', top: 430 },
];

// Bitcoin + Kaspa twin coins (generated WITH the kaspa-logo.png reference, glow-on-black -> alpha-from-luminance, true
// RGBA) float above the "11 YEARS APART" badge. 2:1 art at width 560 -> ~280 tall: band 70-350 (+/-10 px float) vs the
// badge's 412-628: no overlap.
export const KC3_OVERLAYS: OverlayEv[] = [
  { src: staticFile('ovl-kc3-twin-coins.png'), tIn: 4.3, tOut: 6.9, top: 70, left: 260, width: 560, blend: 'normal' },
];

// t = crest - attack_sec (sfx library.json) so each crest lands in a MEASURED RMS trough between words.
// Swept offline against an encode-matched control (SKILL row 7a): every cue = control in 3-4 staggered medium.en windows.
export const KC3_SOUNDS: Sfx[] = [
  { t: 0.0, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.35, dur: 0.42 },        // cover cut (frame 1)
  { t: 1.3, src: staticFile('sfx/Boom - Big Reveal-short.wav'), vol: 0.32, dur: 0.3 },               // hook full-screen, crest 1.33
  { t: 4.11, src: staticFile('sfx/DING-093.wav'), vol: 0.28, dur: 0.5, fade: 0.2 },                   // 11 YEARS badge + coins, crest 4.26
  { t: 11.52, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.3, dur: 0.42 },       // mirror cutaway, crest 11.70
  { t: 19.91, src: staticFile('sfx/ding/sudden-shock-tight.wav'), vol: 0.28, dur: 0.4 },             // FIRST BEAR MARKET?, crest 20.20
  { t: 24.05, src: staticFile('sfx/kinetic-text/fast-swoosh.wav'), vol: 0.32, dur: 0.3 },            // BTC below the line, crest 24.30
  { t: 30.17, src: staticFile('sfx/Impacts/Kick_Impact_01-tight.wav'), vol: 0.32, dur: 0.32 },       // 2022 twist full-screen, crest 30.36 (trough 30.32-30.38)
  { t: 32.31, src: staticFile('sfx/kinetic-text/knock-pop.wav'), vol: 0.28, dur: 0.25 },             // DEC 2024 badge (trough 32.30-32.39)
  { t: 37.82, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.3, dur: 0.5, fade: 0.15 },  // Kaspa bull in, crest 38.00
  { t: 43.44, src: staticFile('sfx/kinetic-text/pop-1.mp3'), vol: 0.28, dur: 0.6, fade: 0.2 },       // 2022 badge, crest 43.84
  { t: 46.81, src: staticFile('sfx/Impacts/Impact_Hit_01-2-tight.wav'), vol: 0.32, dur: 0.25 },      // Kaspa frozen in, crest 46.95
  { t: 57.27, src: staticFile('sfx/DING-093.wav'), vol: 0.22, dur: 0.25, fade: 0.1 },               // BACK ABOVE 50-WEEK, crest 57.42 (gap 57.40-57.48)
  // climax full-screen, crest 59.42. A riser under "moving average" was DELETED (decoration that masked "average" 3/3).
  { t: 59.39, src: staticFile('sfx/Boom - Big Reveal-short.wav'), vol: 0.32, dur: 0.25 },
];

export const KC3_THUMB: ThumbDef = {
  title: '<span style="color:#00e5ff">KASPA</span> IS\nREPEATING\n<span style="color:#ff9f1c">BITCOIN</span>',
  chip: '11 YEARS LATER',
  chipColor: '#00e5ff',
  titleSize: 140,
  img: staticFile('thumb-kc3-cover.png'),
};

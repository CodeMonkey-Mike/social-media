import { staticFile } from 'remotion';
import { type BrollEv, type Sfx } from './_kit';
import type { ThumbDef, BadgeEv, OverlayEv } from './LivestreamShort';

// ─────────────────────────────────────────────────────────────────────────────────────────────
// batch ripping / clip #4 - `hate-eth-go-where-the-money-is` (variant: FULL)
// clip-plan title: "I Hate ETH, But One Day It Is Going to Flip Bitcoin"
// "...even believe, I kid you not, that one day Ethereum is gonna flip Bitcoin. I hate ETH, but I gotta go where
//  the money is. I did the same thing with Litecoin... made in America token, ETFs, optional privacy feature...
//  I hate Ethereum. I hate it. I hate it. But then it's okay, I'll buy into it, because I know it's gonna pump
//  like crazy... $20,000 ETH is like really conservative in my opinion, ten years from now."
// ETH is NOT framed as one of his stacking picks: he hates it and buys it because the money is there.
// Spine: shorts/ripping/render-assets/hate-eth-go-where-the-money-is.mp4 (1080x1920 @25, video 36.44 s,
// audio 36.48 s; the GOP re-encoded copy of the clip's -final.mp4, same stream durations/frame counts).
// Plan of record: shorts/ripping/hate-eth-go-where-the-money-is/BROLL-PLAN.md
// Build directives for clip 4 (clip_directives.py --batch ripping --clip 4): none. No coverage exemption.
// Flat-namespace check 2026-11-19: no existing RippingHateEth / RIP4_ / constants-ripping-hate-eth in
// remotion/src or Root.tsx.
// ─────────────────────────────────────────────────────────────────────────────────────────────

// render_short.py renders and verifies at 30 fps; the 25 fps spine is resampled by OffthreadVideo.
export const RIP4_FPS = 30;
// 1093 frames = 36.433 s; last frame (1092) at 36.40 s sits inside both tracks (video 36.44, audio 36.48).
export const RIP4_DURATION = 1093;
const END = RIP4_DURATION / RIP4_FPS;
// MEASURED on this spine: row-mean gradient step at the 853/854 boundary on 7 of 7 frames (t=1,6,12,16,22,31,34).
export const RIP4_SEAM = 854;
// Caption band just under the seam: eyes sit at y~1185, so 960 is forehead/hair, never the eyes.
export const RIP4_CAP_Y = 960;
// ETH violet (the divider under a content-zone cutaway); teal would misread as Kaspa.
export const RIP4_ACCENT = '#8c7cf0';
const RED = '#ff3b4a';
const LTC_BLUE = '#3aa0ff';

export const CLIP_RIP4 = staticFile('hate-eth-go-where-the-money-is.mp4');

// FRAME-0 COVER (ONE frame). Violet Ethereum coin flipping a Bitcoin coin off a summit; top 40% empty sky for the
// code-drawn title.
export const THUMB_DEF_RIP4: ThumbDef = {
  img: staticFile('broll-rip4-thumb.png'),
  title: 'I <span style="color:#ff3b4a">HATE</span> <span style="color:#a99bff">ETH</span>\nBUT IT WILL\nFLIP <span style="color:#ff9f1c">BITCOIN</span>',
  chip: 'GO WHERE THE MONEY IS',
  chipColor: RIP4_ACCENT,
  titleSize: 100,
};

// B-ROLL: 2.60 + 2.30 + 2.20 + 2.60 + 2.32 = 12.02 s of 36.43 s = 33.0 % b-roll / 67.0 % base. 5 images, each once.
// 2 full-screens (hook + the transition into the close), 3 content-zone cutaways each tied to its line.
// B1 -> B2 butt at 4.70 (hard cut, no base flash between them). B5 tOut 29.92 = the base's own scene change to the
// CMC Ethereum page (the receipt for the close), so the cut lands on the new page.
export const BROLL_RIP4: BrollEv[] = [
  // HOOK full-screen: "that one day Ethereum is gonna flip Bitcoin" (ethereum-eth.png ref).
  { src: staticFile('broll-rip4-hook-flip.png'), tIn: 2.10, tOut: 4.70, mode: 'full' },
  // "I hate ETH, but I gotta go where the money is" - grumpy guy holding his nose, walking to the ETH vault.
  { src: staticFile('broll-rip4-money-vault.png'), tIn: 4.70, tOut: 7.00, mode: 'content' },
  // "I can't believe I'm getting back into Litecoin, right?" - dusty Litecoin pulled out of the attic box.
  { src: staticFile('broll-rip4-ltc-back.png'), tIn: 8.60, tOut: 10.80, mode: 'content' },
  // "I hate Ethereum. I hate it. I hate it" - steaming guy glaring at the glowing ETH coin.
  { src: staticFile('broll-rip4-hate-it.png'), tIn: 23.60, tOut: 26.20, mode: 'content' },
  // TRANSITION full-screen: "because I know it's gonna pump like crazy" - ETH rocket through green candles.
  { src: staticFile('broll-rip4-eth-pump.png'), tIn: 27.60, tOut: 29.92, mode: 'full' },
];

// ALPHA OVERLAY (glow-on-black -> alpha-from-luminance in place, true RGBA -> blend 'normal'; the on-black original
// is kept at shorts/ripping/hate-eth-go-where-the-money-is/_qa/build/ovl-privacy-on-black-orig.png).
// "and now it has an optional privacy feature": right side of the content zone (x 660-1040, y 440-820), over the
// X sidebar + replies, leaving the post's text readable. Clear of the caption band (~900-1020) and the badge (y~60-240).
export const OVERLAYS_RIP4: OverlayEv[] = [
  { src: staticFile('broll-rip4-ovl-privacy.png'), tIn: 15.10, tOut: 17.40, top: 440, left: 660, width: 380, blend: 'normal' },
];

// BADGES (code-drawn). The shared Badge is absolutely placed at left 50%, so its shrink-to-fit width caps at ~540 px:
// every line is kept short enough to stay on ONE line (QA of the first render: longer lines wrapped and the badge
// grew off the top of the frame; fixed by splice). Centred at top 190 = the content zone's top band (over the
// off-topic Zelle/Solana post header + images), box ~60-320. Never sharing a window with each other, any b-roll, or
// the $20,000 card. The privacy badge shares its window with the overlay but not its space (badge y~100-280,
// overlay y 440-820).
export const BADGES_RIP4: BadgeEv[] = [
  { tIn: 11.70, tOut: 14.70, color: RED, line1: 'LITECOIN', line2: 'ETFs', sub: 'MADE IN AMERICA', top: 190 },
  { tIn: 15.10, tOut: 17.40, color: LTC_BLUE, line1: 'PRIVACY', sub: 'NOW OPTIONAL', top: 190 },
  { tIn: 20.80, tOut: 23.40, color: RIP4_ACCENT, line1: 'THE VIBE:', line2: 'DOMINANT', sub: 'ETHEREUM', top: 190 },
];

// $20,000 CARD (code-drawn, rendered by the comp) over the CMC Ethereum page: centre y 592 (~494-690), under the
// 1Y chart (axis labels end y~480) + the price, above the stream-chat ticker's name tag (y~700) + band (y~726-777)
// and the caption band. (First render had it at 615 and its bottom edge clipped the name tag; fixed by splice.)
export const PRICE_CARD_RIP4 = { tIn: 31.80, tOut: 35.40, top: 592 };

// SFX: every `t` = cue - crest so the crest lands on the cut/badge frame.
// Crests (library.json attack_sec): transition_rapid_whoosh 0.165 · -tight 0.18 · Boom - Big Reveal-short 0.03 ·
//   Cinematic Whoosh 06 0.59 · DING-093 0.15 · TING SOUND EFFECT 0.79 · Impact_Hit_01-2-short 0.14 ·
//   Riser Sound Effect-2s 2.015 · Cash Register-ching 0.12
export const SFX_RIP4: Sfx[] = [
  // frame-0 cover cut to the base
  { t: 0.033, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.10, dur: 0.42 },
  // hook full-screen: the flip lands (2.10), just before "that one day"
  { t: 2.07, src: staticFile('sfx/Boom - Big Reveal-short.wav'), vol: 0.16, dur: 1.05, fade: 0.4 },
  // full -> content cutaway (4.70)
  { t: 4.52, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.10, dur: 0.42 },
  // the Litecoin comeback cutaway (8.60)
  { t: 8.01, src: staticFile('sfx/Cinematic Whoosh 06.wav'), vol: 0.12, dur: 1.10, fade: 0.3 },
  // MADE IN AMERICA badge pop (11.70)
  { t: 11.55, src: staticFile('sfx/DING-093.wav'), vol: 0.08, dur: 0.45 },
  // privacy overlay pop (15.10)
  { t: 14.31, src: staticFile('sfx/TING SOUND EFFECT.mp3'), vol: 0.08, dur: 1.25, fade: 0.3 },
  // "I hate Ethereum" impact on the cutaway (23.60), before the word
  { t: 23.46, src: staticFile('sfx/Impacts/Impact_Hit_01-2-short.wav'), vol: 0.14, dur: 0.55 },
  // riser builds INTO the pump: crest lands on the 27.60 cut
  { t: 25.585, src: staticFile('sfx/Riser Sound Effect-2s.wav'), vol: 0.25, dur: 2.14 },
  // money ching on "gonna pump like crazy" full-screen (27.60)
  { t: 27.48, src: staticFile('sfx/Cash Register-ching.wav'), vol: 0.12, dur: 0.77 },
  // full-screen out to the CMC receipt page (29.92)
  { t: 29.74, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.10, dur: 0.42 },
  // $20,000 card lands (31.80): sub-heavy boom, not a bright ding over the figure
  { t: 31.77, src: staticFile('sfx/Boom - Big Reveal-short.wav'), vol: 0.12, dur: 1.05, fade: 0.4 },
];

export { END as RIP4_END_S };

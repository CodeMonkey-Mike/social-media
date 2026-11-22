import { staticFile } from 'remotion';
import { type BrollEv, type Sfx } from './_kit';

// ─────────────────────────────────────────────────────────────────────────────────────────────
// batch ripping / clip #6 - `pieverse-17x-at-a-billion-impact` (variant: IMPACT)
// clip-plan title: "Pieverse Is at a Billion. That 17x Could Turn Into 170x"
// "Holy crap, we're at a billion. I can't believe it. We're actually at a billion. And then we have agent to agent
//  payments, which is why Pieverse is pumping, man. Because Pieverse is in the x402 narrative, man. We got our bases
//  covered. 17x. That thing is still gonna be pumping. Probably gonna do another 10x on top of where it is right now.
//  Who knows how many billions it's gonna get to? That 17x could turn into like 170x."
// Spine: shorts/ripping/render-assets/pieverse-17x-at-a-billion-impact-ext.mp4 = the staged spine with its VFR video
// re-timed to CFR 25 and the last frame cloned +0.32 s (audio stream-copied, MD5-identical). WHY: the spoken "170x"
// runs to ~28.50 s (RMS) and the staged video track's frames stop short of it; the clone sits under the climax
// full-screen, so it is never seen. Frame-aligned to the staged spine (mean abs diff 0.25/255 at 5/15/22/27.9 s).
// Plan of record: shorts/ripping/pieverse-17x-at-a-billion-impact/BROLL-PLAN.md (stage-2 remap recorded there).
// Build directives for clip 6 (clip_directives.py --batch ripping --clip 6): none. No coverage exemption.
// Flat-namespace check 2026-11-19: no existing RippingPieverse170x / RIP6_ / constants-ripping-pieverse-17x-at-a-
// billion-impact in remotion/src or Root.tsx (clip 1's RippingPieverse17x / RIP1_ is a different clip, untouched).
// ─────────────────────────────────────────────────────────────────────────────────────────────

// render_short.py renders and verifies at 30 fps; the 25 fps spine is resampled by OffthreadVideo.
export const RIP6_FPS = 30;
// 857 frames = 28.567 s; the audio runs to 28.586, "170x" ends ~28.50, last frame (856) at 28.533.
export const RIP6_DURATION = 857;
// MEASURED on this spine: row-mean gradient step at the 853/854 boundary on 8 of 8 frames (t=1..25).
export const RIP6_SEAM = 854;
// Caption band just under the seam: forehead/hair, the eyes sit at y~1200.
export const RIP6_CAP_Y = 960;
export const RIP6_ACCENT = '#00e5ff';
const YEL = '#ffe600';
const TEAL = '#00e5ff';
const GRN = '#39ff14';

export const CLIP_RIP6 = staticFile('pieverse-17x-at-a-billion-impact-ext.mp4');

// FRAME-0 COVER (ONE frame), drawn by the comp: title block in the clean sky top-left (the planet sits top-right
// x~855-1080 y~90-450, the cat starts at y~925). Pieverse mascot at the foot of a green candle staircase. pieverse.jpg ref.
export const THUMB_IMG_RIP6 = staticFile('broll-rip6-thumb.png');

// B-ROLL (images): B1 1.79 + B3 2.32 + B4 2.667 = 6.78 s, + the code-drawn PumpCard 3.04 s (15.36-18.40, opaque over
// the whole content zone) = 9.82 s of 28.567 s = 34.4 % of the runtime with the zone covered; 65.6 % base.
// Full-screens: 2 (hook + climax), 21.65 s apart.
// STAGE-2 REMAP (visual-qa round 2 FAIL, never regenerated here):
//   B2 broll-rip6-still-pumping.png (crop: the balloon tip sat against the zone's top edge) -> code-drawn PumpCard in
//   the comp (same beat, same window: the pump inflating a green up-arrow, "17X" + "STILL PUMPING" as type).
export const BROLL_RIP6: BrollEv[] = [
  // HOOK full-screen: "We're actually at a billion." - jaw-dropped mascot, a colossal gold coin rising like a sun.
  { src: staticFile('broll-rip6-hook-billion.png'), tIn: 2.46, tOut: 4.25, mode: 'full' },
  // "Who knows how many billions it's gonna get to?" - the mascot at a telescope, a sky full of gold coin planets.
  { src: staticFile('broll-rip6-how-many.png'), tIn: 22.06, tOut: 24.38, mode: 'content' },
  // CLIMAX full-screen: "That 17x could turn into like 170x". tOut past the last frame (28.533) so BrollLayer's 0.12 s
  // fade-out never starts: it holds fully opaque to the end (and hides the cloned tail frames of the spine).
  { src: staticFile('broll-rip6-climax-launch.png'), tIn: 25.90, tOut: 28.80, mode: 'full' },
];

// CODE-DRAWN PUMP CARD (remap of B2): covers 0..seam over the off-message pippin page.
// "17X" pops on "17x" (16.18), "STILL PUMPING" on "still" (17.30).
export const PUMP_RIP6 = { tIn: 15.36, tOut: 18.40, headIn: 16.15, footIn: 17.25 };

// CHIP BADGES (code-drawn, nowrap, centred; on BASE windows only, each >= 0.6 s clear of any b-roll beat).
// All sit at y ~560-720 (centre `top`), under the content-zone headline/chart and above the caption band (~920-1000).
//   K0 over the Zelle x Solana post's reply rows (the logos card is y ~140-395, untouched).
//   K1 the CMC 1W stat (verified on the frame: "+120.86% (1W)", top-left at y ~150) restated low, away from it.
//   K2 x402: type only, no logo (no reference on disk; flagged).
export const CHIPS_RIP6 = [
  { tIn: 5.64, tOut: 7.40, color: TEAL, line1: 'AGENT-TO-AGENT', sub: 'PAYMENTS', top: 640 },
  { tIn: 9.00, tOut: 10.60, color: GRN, line1: '+120%', sub: 'THIS WEEK', top: 620 },
  { tIn: 12.24, tOut: 14.10, color: YEL, line1: 'x402', sub: 'NARRATIVE', top: 620 },
];

// STAMPS (code-drawn punch-ins).
//   K3 "ANOTHER 10X" on "another 10x" (19.00-20.22), content zone centre, over the pippin base only.
//   K4 "170X" lands on the spoken "170x" (27.72) over the climax full-screen, low in the clouds (y ~1480-1700),
//   under the rocket (bottom ~1300) and well below the caption band.
export const STAMPS_RIP6 = [
  { tIn: 19.30, tOut: 21.40, color: YEL, line1: 'ANOTHER', big: '10X', top: 470 },
  { tIn: 27.72, tOut: 28.80, color: YEL, line1: 'COULD BE', big: '170X', top: 1590 },
];

// SFX: every `t` = cue - attack_sec (library.json) so the crest lands on the event frame.
//   transition_rapid_whoosh 0.18 · -tight 0.18 · Cinematic Whoosh 06 0.59 · Impact_Hit_01-2-short 0.14
//   DING-093 0.15 · Cash Register-ching 0.12 · Tension_Rise_Logo_Reveal_3-1s 0.48 · Kick_Impact_01-tight 0.19
export const SFX_RIP6: Sfx[] = [
  // frame-0 cover cut to the base
  { t: 0.033, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.12, dur: 1.00 },
  // hook full-screen in (2.46): soft cinematic whoosh
  { t: 1.87, src: staticFile('sfx/Cinematic Whoosh 06.wav'), vol: 0.20, dur: 1.00, fade: 0.3 },
  // the billion lands: crest 4.20, after "billion" ends (4.16), as the hook exits
  { t: 4.06, src: staticFile('sfx/Impacts/Impact_Hit_01-2-short.wav'), vol: 0.16, dur: 0.55 },
  // K0 agent-to-agent chip (5.64)
  { t: 5.49, src: staticFile('sfx/DING-093.wav'), vol: 0.07, dur: 0.60, fade: 0.2 },
  // (K2 x402 chip ding DELETED in QA: its crest sat on the word "x402" (12.24-13.22) and the mix read "x4 to" in 1 of
  //  3 staggered windows where the encode-matched control read "x402". Decoration, not a payoff hit: removed.)
  // pump card in (15.36), inside the non-word sound before "17x" (16.18)
  { t: 15.18, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.10, dur: 0.42 },
  // K3 "ANOTHER 10X" stamp (19.30)
  { t: 19.18, src: staticFile('sfx/Cash Register-ching.wav'), vol: 0.10, dur: 0.77 },
  // whoosh into the telescope cutaway (22.06)
  { t: 21.88, src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.10, dur: 0.42 },
  // riser INSIDE the 24.38-25.80 pause, crest at 25.65 into the climax. QA swap: the 2 s riser (t 23.86) started over
  // "get to?" (23.70-24.38) and the mix read "catch him" in 2 staggered windows where the control read "get to";
  // the 1 s cut of Tension Rise 3 (attack 0.48) starts at 25.17, after the line, crests 25.65 and is cut at 25.75, before
  // the onset of "That" (~25.80). 2nd/3rd QA passes: a crest at 25.88 / 25.80 measured -18 dB on the word onset and a
  // staggered window dropped "That 17x" where the control kept it.
  { t: 25.17, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_3-1s.wav'), vol: 0.30, dur: 0.58, fade: 0.1 },
  // climax full-screen cut (25.90): the transient-only -tight cut (tail 0.12 s), full gain, so no ring sits on "That 17x"
  { t: 25.71, src: staticFile('sfx/Impacts/Kick_Impact_01-tight.wav'), vol: 0.15, dur: 0.32 },
];

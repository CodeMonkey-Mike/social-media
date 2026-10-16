import { staticFile } from 'remotion';
import { type BrollEv, type Sfx } from './_kit';
import type { ThumbDef, BadgeEv, OverlayEv } from './LivestreamShort';

// ─────────────────────────────────────────────────────────────────────────────────────────────
// batch downtober / clip #1 - `zombies-cant-see-the-bottom` (variant: FULL)
// clip-plan title: "The Bottom Is In and the Cycle Zombies Can't See It"
//
// Spine: shorts/downtober/zombies-cant-see-the-bottom/zombies-cant-see-the-bottom-final.mp4, staged GOP-seek-friendly
// to render-assets/zombies-cant-see-the-bottom.mp4 - VERIFIED: has_b_frames 0, 1080x1920 @25 fps, video 27.200 s,
// audio 27.193 s.
// Plan of record: shorts/downtober/zombies-cant-see-the-bottom/BROLL-PLAN.md
// Captions: captionsDowntoberZombiesBottom.ts (canonical captions skill, off whisper-words-verified.json).
// Build directives for clip 1 (clip_directives.py --batch downtober --clip 1): none. No coverage exemption.
// Reference gate: Benjamin Cowen -> schedule-tweets/images/reference/Benjamin-Cowen.png (attached to the B2 generation,
// Pixar likeness + code "AI ILLUSTRATION" tag); Bitcoin = well-known brand, named in the prompt.
// ─────────────────────────────────────────────────────────────────────────────────────────────

export const DT1_FPS = 30;
// 816 frames = 27.200 s; last rendered frame (815) at 27.167 s sits inside both tracks. Last word ends 27.14 s.
export const DT1_DURATION = 816;

// MEASURED on THIS spine: row-mean gradient scan (rows 600-1300), 5 frames 2..26 s: largest step 853/854 (5 of 5).
export const DT1_SEAM = 854;
export const DT1_CAP_Y = 960;
export const DT1_ACCENT = '#39ff14';
const GOLD = '#ffc629';
const GREEN = '#39ff14';

export const CLIP_DT1 = staticFile('zombies-cant-see-the-bottom.mp4');

// FRAME-0 COVER (ONE frame). Art = Pixar zombie crowd blind to the bounced green line; top 45% empty for the CODE title.
export const THUMB_DEF_DT1: ThumbDef = {
  img: staticFile('thumb-dt1-cover.png'),
  title: 'THE BOTTOM\nIS IN',
  chip: "ZOMBIES CAN'T SEE IT",
  chipColor: GREEN,
  titleSize: 132,
};

// B-ROLL. Budget: 1.50 + 2.40 + 1.50 + 1.75 + 1.70 = 8.85 s of 27.20 s = 32.5 % b-roll / 67.5 % base.
// Adjacent pairs BUTT exactly (B1->B2 at 2.40, B4->B5 at 23.45) so BrollLayer hard-cuts with no base flash.
// 5 distinct images, each used once. 2 full-screens (hook + climax), inside the firm cap of 3.
// B3 REMAP (rule 5, persona inspect): its generation came back with Benjamin Cowen's likeness on the runner
// (reference carried over in the chat) -> rejected to _gen/rejected/, beat remapped (same filename) to a
// content-zone crop of the persona-clean cover art (zombies blind to the bounced green line). No regeneration.
// Base = Mike's BTC 4H chart (the receipt) 4.80-9.00 and 10.50-17.5, then the CMC page.
export const BROLL_DT1: BrollEv[] = [
  // HOOK full: "four year cycle zombies," (playback opens on Mike + the chart for "or the king of the").
  { src: staticFile('broll-dt1-hook-zombie-loop.png'), tIn: 0.90, tOut: 2.40, mode: 'full' },
  // "Benjamin Cowen, who was absolutely perplexed" (hard cut from the hook, butted at 2.40). AI ILLUSTRATION tag in the comp.
  { src: staticFile('broll-dt1-cowen-perplexed.png'), tIn: 2.40, tOut: 4.80, mode: 'content' },
  // "front running the October bottom" (REMAPPED: crop of the clean cover art, see above)
  { src: staticFile('broll-dt1-front-running.png'), tIn: 9.00, tOut: 10.50, mode: 'content' },
  // "there's no such thing as a four year cycle."
  { src: staticFile('broll-dt1-cycle-shatters.png'), tIn: 21.70, tOut: 23.45, mode: 'content' },
  // CLIMAX full: "I just feel illuminated." Butts B4 at 23.45 (hard cut). Out at 25.15: the close lands on Mike.
  { src: staticFile('broll-dt1-climax-illuminated.png'), tIn: 23.45, tOut: 25.15, mode: 'full' },
];

// AI ILLUSTRATION tag window (= the Cowen beat). Rendered by the comp, bottom-left of the content image.
export const AI_TAG_DT1 = { tIn: 2.40, tOut: 4.80, top: 772, left: 28 };

// Real alpha PNG (glow-on-black -> alpha-from-luminance), ON the base chart at "looking at the chart".
export const OVERLAYS_DT1: OverlayEv[] = [
  { src: staticFile('broll-dt1-ovl-magnifier.png'), tIn: 15.70, tOut: 17.45, top: 110, left: 150, width: 520, blend: 'normal' },
];

// BADGES (code-drawn), never sharing a window with each other, the overlay, or a b-roll image. top 620 = above the 854 seam.
export const BADGES_DT1: BadgeEv[] = [
  { tIn: 11.60, tOut: 13.05, color: GREEN, line1: 'THE BOTTOM', line2: 'IS IN', sub: "THAT'S IT", top: 620 },
  { tIn: 18.25, tOut: 19.85, color: GOLD, line1: 'ILLUMINATED', sub: 'WHEN I REALIZED', top: 620 },
  { tIn: 25.40, tOut: 27.15, color: GOLD, line1: 'NO 4-YEAR', line2: 'CYCLE', sub: 'ILLUMINATED', top: 620 },
];

// SFX. Measured crests: whoosh 0.18 s, whoosh-tight 0.18 s, card-impact-layered 0.03 s, DING-093 0.21 s,
// DSGNImpt 0.09 s, Tension_Rise_3-1s 0.73 s. Every `t` = cue - crest.
export const SFX_DT1: Sfx[] = [
  { t:  0.033, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.08, dur: 0.12 },          // cover cut
  { t:  0.87,  src: staticFile('sfx/Impacts/card-impact-layered.wav'), vol: 0.14, dur: 0.80 },     // hook full-screen
  { t:  2.22,  src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.42 },   // into Cowen
  { t:  8.82,  src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.42 },   // into front-running
  { t: 11.39,  src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.90 },                       // THE BOTTOM IS IN badge
  { t: 15.52,  src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.10, dur: 0.42 },   // magnifier on the chart
  { t: 21.52,  src: staticFile('sfx/transition_rapid_whoosh-tight.wav'), vol: 0.12, dur: 0.42 },   // into the shattered cycle
  { t: 22.72,  src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_3-1s.wav'), vol: 0.10, dur: 0.75 }, // riser INTO the climax hit
  { t: 23.36,  src: staticFile('sfx/Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3'), vol: 0.20, dur: 1.20 }, // climax
  { t: 25.19,  src: staticFile('sfx/DING-093.wav'), vol: 0.14, dur: 0.90 },                       // closing badge
];

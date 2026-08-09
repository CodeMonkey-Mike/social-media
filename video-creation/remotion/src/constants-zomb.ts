// constants-zomb.ts - data for "Kaspa $1 by the End of the Year"
// batch peach-minute, clip #4, slug 04-i-was-a-zombie (variant: full)
//
// Contract: video-creation/livestream-repurpose/skills/remotion-shorts-build/SKILL.md
// Plan:     video-creation/shorts/peach-minute/04-i-was-a-zombie/BROLL-PLAN.md
//
// Render (public-dir = the CLIP's render-assets/, which holds the spine + thumbnail + b-roll + sfx):
//   npx remotion render src/index.ts PmZombie out/peach-minute/4-i-was-a-zombie.mp4 \
//     --public-dir "../shorts/peach-minute/04-i-was-a-zombie/render-assets"
//
// PERSONA (guards this clip): Mike is a FORMER four-year-cycle zombie. Past tense everywhere; the
// register is "he updated on the data before the crowd did", never "he was wrong". Zombie imagery
// belongs to the CROWD, which is why beat 2 runs in content mode with his live face under it.
import { staticFile } from 'remotion';
import { CAPTIONS_ZOMB } from './captionsZomb';
import type { ShortData, BadgeEv } from './LivestreamShort';
import type { BrollEv, Sfx } from './_kit';

export const ZOMB_FPS = 30;
// Spine is 54.227 s (1080x1920, 25 fps source). 1626 @30 = 54.200 s, just inside it, so the render
// never lands on a black tail frame.
export const ZOMB_DURATION = 1626;

export const ZOMB_CLIP = staticFile('04-i-was-a-zombie.mp4');
export const THUMB_ZOMB = staticFile('thumbnail-zomb.png');

// Measured on THIS clip (green-screen onset scan at t=2/9/18/26/33/42/50 s: rows below 854 carry no
// green, row 854 is the first >50 % green row, identical at every probe). Content-mode b-roll covers
// 0..855; the webcam plays below it.
export const ZOMB_SEAM = 855;
// Caption centre: 71 px below the seam, over his hair, ~500 px above his eyes (~1450-1520).
export const ZOMB_CAP_Y = 925;

// ─── B-ROLL ────────────────────────────────────────────────────────────────────────────────────────
// HALVED budget (video-creation/SKILL.md, 2026-07-14): 6 distinct images, 17.20 s of 54.23 s =
// 31.7 % b-roll / 68.3 % base showing - inside the 25-35 % band, near the 30 % target.
// 3 FULL-SCREEN moments (hook / the tariff turn / the climax) = exactly the FIRM 1-3 cap.
//
// The two long base stretches (4.50-16.30 and 36.60-48.35) are DELIBERATE, not gaps to be filled:
// the screen-share is a Kaspa dollar-scenario card deck (KASPA $0.50 / $0.10 / $2.40) which is the
// literal visual answer to "will Kaspa be a dollar", and the second stretch is pure delivery where
// the joke lands on his face. Each carries a code badge, never a b-roll image.
export const BROLL_ZOMB: BrollEv[] = [
  // BASE 0.00-1.35 - frame-0 cover hands off to Mike + the screen-share.
  { src: staticFile('broll-zomb-dollar-question.png'), tIn:  1.35, tOut:  4.50, mode: 'full'    }, // HOOK: "you think kaspa was going to be a dollar by the end of the year" (REFERENCE-GATED, backwards-K)
  // BASE 4.50-16.30 - "no man, I wish... I don't think so" (badge A)
  { src: staticFile('broll-zomb-cycle-zombies.png'),   tIn: 16.30, tOut: 19.55, mode: 'content' }, // "back when I WAS a four year cycle zombie" (the crowd, not him)
  // BASE 19.55-23.45 - "a year and three or four months ago" (badge B)
  { src: staticFile('broll-zomb-tariff-shock.png'),    tIn: 23.45, tOut: 26.00, mode: 'full'    }, // TURN: "tariff season is what really changed me"
  // BASE 26.00-28.60 - "what the hell is going on?" + the 1.7 s beat of silence
  { src: staticFile('broll-zomb-below-sma.png'),       tIn: 28.60, tOut: 31.20, mode: 'content' }, // RECEIPT: "we actually went below the 50-week SMA"
  // BASE 31.20-34.00 - "in the post-halving year when we're supposed to be"
  { src: staticFile('broll-zomb-mad-bulls.png'),       tIn: 34.00, tOut: 36.60, mode: 'content' }, // "running like mad, mad bulls"
  // BASE 36.60-48.35 - the whole "whatever type of drug / magnificent cycle top" run (badge C)
  { src: staticFile('broll-zomb-not-happening.png'),   tIn: 48.35, tOut: 51.40, mode: 'full'    }, // CLIMAX: "no, that's not happening, man"
  // BASE 51.40-54.20 - "so we just got to take it as it comes" (badge D, hard out kept)
];

// ─── Badges (code-drawn, content zone) ───────────────────────────────────────────────────────────
// Each states something the captions do NOT, and every window sits inside a BASE stretch with no
// b-roll and no other badge running (overlays must never collide in time AND space). They all use
// the same band (top 300) because they never co-occur; badge B ends 0.35 s before the tariff
// full-screen, badge C ends 1.35 s before the climax, badge D starts 0.50 s after it.
// COPY IS LENGTH-CONSTRAINED BY THE COMPONENT, not by taste: Badge is `position:absolute; left:50%`,
// so its shrink-to-fit width is measured against the 540 px from the centre to the right edge, i.e.
// ~436 px of content. Measured caps at Montserrat 900: line1 (60 px with a line2) ~11 chars, line2
// (82 px) ~8 chars, sub (32 px + 0.12em tracking) ~18 chars. Longer copy wraps and the badge grows
// tall (a first pass at "MORE THAN YOU" broke into three 82 px lines and ran y 45-545).
export const BADGES_ZOMB: BadgeEv[] = [
  // 9.30 NOT 6.40: the BASE screen-share draws a giant red X over the middle scenario card from
  // 5.80 to 8.15 s (measured: 73.7k red px, bbox x 54-619 / y 110-515, i.e. exactly this band).
  // A badge on top of that is a collision with the base art, so it now lands after the X clears,
  // straight on "how much I wish Kaspa will be a dollar. I don't think so".
  { tIn:  9.30, tOut: 12.10, color: '#00e5ff', line1: 'HE WANTS',   line2: 'IT TOO',   sub: 'STILL SAYS NO',        top: 300 },
  { tIn: 20.90, tOut: 23.10, color: '#ffe600', line1: 'CALLED IT',   line2: 'EARLY',    sub: 'CROWD STILL WAITING',  top: 300 },
  { tIn: 44.10, tOut: 47.00, color: '#ff5252', line1: 'THE CYCLE',   line2: 'NO SHOW',  sub: 'HE QUIT WAITING',      top: 300 },
  { tIn: 51.90, tOut: 54.00, color: '#00e5ff', line1: 'FOLLOW ME',   line2: 'FOR THIS', sub: 'DAILY CRYPTO STREAMS', top: 300 },
];

// ─── Frame-0 thumbnail (IG/TikTok cover) ─────────────────────────────────────────────────────────
// ONE frame only (LivestreamShort defaults thumb.durS to 1/fps): reference-gated Kaspa art with the
// title/chip drawn in CODE on top, never baked into the art. Title is Mike's, verbatim. No em dashes.
export const THUMB_DEF_ZOMB = {
  title: 'KASPA $1\nBY THE END\nOF THE YEAR',
  chip: 'MY HONEST ANSWER',
  chipColor: '#00e5ff',
  titleSize: 130,
  img: THUMB_ZOMB,
};

// ─── SFX ─────────────────────────────────────────────────────────────────────────────────────────
// Whoosh on the frame-0 cut and into both of the big full-screens; a soft whoosh into the zombie
// cutaway; a RISER that builds into the tariff turn and is cut by its IMPACT; a DING on the 50-week
// SMA receipt; a low payoff hit under "that's not happening". Volumes are swept against
// whisper-verify on the FINAL mix - a cue that degrades its line gets turned down, never the line.
export const SFX_ZOMB: Sfx[] = [
  // SWEPT against whisper-verify (SKILL item 7). At vol 0.42 / dur 1.20 this whoosh ran straight over
  // "people, YEAH, EVERYBODY asking me" and the render lost a word the spine alone keeps
  // (spine: "People, maybe everybody asked me" -> render: "People ask me"). Sweep on the real mix:
  // 0.42/1.20 and 0.24/1.20 still drop "everybody"; 0.16/1.20 and 0.20/0.90 recover it; and
  // 0.30/0.55 transcribes IDENTICALLY to the spine alone. Trimming the tail (not the level) is what
  // fixes it, so the cut still lands hard at 0.30.
  { t:  0.02, src: staticFile('sfx/Cinematic Whoosh 02.wav'),               vol: 0.30, dur: 0.55 }, // frame-0 thumbnail cut
  { t:  1.33, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.40, dur: 0.90 }, // cut into the hook full-screen
  { t: 16.28, src: staticFile('sfx/Cinematic Whoosh 06.wav'),               vol: 0.22, dur: 0.80 }, // cut into the zombie cutaway
  { t: 21.85, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_2.wav'), vol: 0.18, dur: 1.70 }, // riser into the turn
  { t: 23.48, src: staticFile('sfx/Impacts/Impact_2.wav'),                  vol: 0.34, dur: 2.00 }, // IMPACT: "tariff season"
  { t: 28.55, src: staticFile('sfx/DING.mp3'),                              vol: 0.26, dur: 1.20 }, // the 50-week SMA receipt
  { t: 48.32, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.38, dur: 0.90 }, // cut into the climax full-screen
  { t: 49.10, src: staticFile('sfx/Impacts/Impact_3.wav'),                  vol: 0.20, dur: 1.80 }, // payoff under "that's not happening" (low, VO first)
];

export const ZOMB: ShortData = {
  clip: ZOMB_CLIP,
  fps: ZOMB_FPS,
  durationS: ZOMB_DURATION / ZOMB_FPS,
  capY: ZOMB_CAP_Y,
  seam: ZOMB_SEAM,
  captions: CAPTIONS_ZOMB,
  broll: BROLL_ZOMB,
  badges: BADGES_ZOMB,
  sounds: SFX_ZOMB,
  thumb: THUMB_DEF_ZOMB,
};

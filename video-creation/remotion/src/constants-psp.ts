// constants-psp.ts — data for "If You Can Stick Through This Pain, You Win"
// batch peach-minute, clip #2, slug 02-the-pain-stick-through (variant: full)
//
// Contract: video-creation/livestream-repurpose/skills/remotion-shorts-build/SKILL.md
// Plan:     video-creation/shorts/peach-minute/02-the-pain-stick-through/BROLL-PLAN.md
//
// Render (public-dir = the CLIP's render-assets/, which holds the spine + thumbnail + b-roll + sfx):
//   npx remotion render src/index.ts PainStickThrough out/peach-minute/2-the-pain-stick-through.mp4 \
//     --public-dir "../shorts/peach-minute/02-the-pain-stick-through/render-assets"
import { staticFile } from 'remotion';
import { CAPTIONS_PSP } from './captionsPsp';
import type { ShortData, BadgeEv } from './LivestreamShort';
import type { BrollEv, Sfx } from './_kit';

export const PSP_FPS = 30;
// Spine is 47.391 s container / 47.360 s video stream @25fps.
// 1421 @30 = 47.3667 s. WHY NOT 1420 (47.333 s, the "just inside the video stream" default): the last
// spoken word "nuts" runs to ~47.37, and a 47.333 s cut clips it - Whisper reads "prices are going UP"
// off BOTH the render AND a spine truncated at 47.333, and reads "going NUTS" off a spine truncated at
// 47.367. So the clipping was the comp length, not an SFX masking the line. 1421 overshoots the video
// stream by 0.007 s, which is invisible: the climax full-screen b-roll covers the whole frame from
// 45.05 to past the end, so no base frame is on screen at t=47.3667 anyway.
export const PSP_DURATION = 1421;

export const PSP_CLIP = staticFile('02-the-pain-stick-through.mp4');
export const THUMB_PSP = staticFile('thumbnail-psp.png');

// Measured on THIS clip (green-screen onset scan at t=3/12/22/33/41/46 s): rows <=853 are 0 % green,
// rows >=855 read 0.43-0.50 green whenever Mike is not filling the frame -> the FRED screen-share ends
// and the webcam starts at y=855. Content-mode b-roll covers 0..856.
export const PSP_SEAM = 856;
// Caption centre: 70 px below the seam, ~515 px above his eyes (~1440).
export const PSP_CAP_Y = 925;

// ─── B-ROLL ────────────────────────────────────────────────────────────────────────────────────────
// HALVED budget (SKILL: ~30 % b-roll / ~70 % base showing, band 25-35 %):
// 6 distinct images, 14.95 s of 47.33 s = 31.6 % b-roll / 68.4 % base showing.
// 2 FULL-SCREEN moments (the contiguous hook pair + the climax) - inside the FIRM 1-3 cap.
//
// The base content zone is a STATIC FRED "M2 percent change" page for the whole clip. That is not a
// licence to blanket it: the two long base stretches (13.75-27.30 and 36.50-45.05) are carried by his
// delivery plus the code-drawn badges below, which do NOT cover the zone.
//
// MEASURED BASE DEFECT: from t=4.04 to t=6.96 (boundaries found at 25 fps) the livestream layout
// breaks - a dark video window takes the top of the screen-share, the FRED page is shoved down, and a
// flat grey dead rectangle covers the left half of the FACE zone (y~855-1490), masking half of Mike.
// Content-mode b-roll (0..seam) would leave that grey box on screen, so beat 2 is FULL and butted
// against beat 1 (gap 0 <= BrollLayer's 0.18 s adjacency epsilon -> HARD CUT, no base flash between
// two full-screens). tOut 7.12 keeps the 0.12 s fade-out entirely over the RECOVERED layout.
export const BROLL_PSP: BrollEv[] = [
  // BASE 0.03-1.95 — frame-0 cover hands off to Mike + the screen-share.
  { src: staticFile('broll-psp-the-pain.png'),       tIn:  1.95, tOut:  3.95, mode: 'full'    }, // HOOK: "this is like the pain man, the pain"
  { src: staticFile('broll-psp-pain-wave.png'),      tIn:  3.95, tOut:  7.12, mode: 'full'    }, // covers the broken-layout stretch + the Pacino aside
  // BASE 7.12-11.15 — the layout is back: "here come the pain" lands on HIS delivery, then "yeah man,
  // but if you're in it man"
  { src: staticFile('broll-psp-stick-through.png'),  tIn: 11.15, tOut: 13.75, mode: 'content' }, // "stick through this... haven't checked out like everybody else"
  // BASE 13.75-27.30 (13.55 s, DELIBERATE) — sitting pretty / volatility / take profits, buy back in.
  // Badges A + B carry it; no image blankets the content zone.
  { src: staticFile('broll-psp-buy-lower.png'),      tIn: 27.30, tOut: 30.00, mode: 'content' }, // "if things go down over the next 30 to 40 days"
  // BASE 30.00-34.30 — "why not just buy some more, lower prices" (badge C)
  { src: staticFile('broll-psp-grandma-crowd.png'),  tIn: 34.30, tOut: 36.50, mode: 'content' }, // "everybody and their grandma is gonna be buying back in"
  // BASE 36.50-45.05 — October / take profits / "I'll sell to the people" (badges D + E, riser at 43.10)
  // tOut is deliberately 47.60, PAST the 47.333 s end of the comp: at a tOut on the last frame the
  // BrollLayer 0.12 s fade-out is already half-way through and ghosts the art over the base. Running
  // the window past the end keeps opacity 1 to the final frame. Visible duration = 2.28 s.
  { src: staticFile('broll-psp-fomo-climax.png'),    tIn: 45.05, tOut: 47.60, mode: 'full'    }, // CLIMAX: "FOMOing in because prices are going nuts"
];

// ─── Badges (code-drawn, content zone) ───────────────────────────────────────────────────────────
// Each states something the captions do NOT, and every window sits inside a BASE stretch with no
// b-roll and no other badge running (overlays must never collide in time AND space).
// top 300 -> band y~200-400; top 600 -> band y~500-700. Both are above the seam (856) and above the
// caption centre (925). Nothing starts under the frame-0 thumbnail.
export const BADGES_PSP: BadgeEv[] = [
  { tIn: 18.70, tOut: 21.50, color: '#00e5ff', line1: 'VOLATILITY',      line2: 'IS THE POINT',     sub: 'FLAT PAYS NOBODY',        top: 300 },
  { tIn: 22.70, tOut: 25.60, color: '#ffe600', line1: 'UP, TAKE PROFITS', line2: 'DOWN, BUY BACK',  sub: 'THE SAME LOOP, EVERY CYCLE', top: 600 },
  { tIn: 31.20, tOut: 33.90, color: '#39ff14', line1: 'LOWER PRICES',    line2: 'ARE THE DISCOUNT', sub: 'IF YOU STILL BELIEVE',    top: 300 },
  { tIn: 37.20, tOut: 40.00, color: '#ffe600', line1: 'THEY COME BACK',  line2: 'IN OCTOBER',       sub: 'HE IS ALREADY POSITIONED', top: 600 },
  { tIn: 41.30, tOut: 44.30, color: '#00e5ff', line1: 'STILL HERE',      line2: 'STILL LOADED',     sub: 'THAT IS THE WHOLE EDGE',  top: 300 },
];

// ─── Frame-0 thumbnail (IG/TikTok cover) ─────────────────────────────────────────────────────────
// ONE frame only (LivestreamShort defaults thumb.durS to 1/fps): generated background art with the
// title/chip drawn in CODE on top, never baked into the art. No em dashes.
export const THUMB_DEF_PSP = {
  title: 'STICK THROUGH\nTHIS PAIN',
  chip: 'AND YOU WIN',
  chipColor: '#00e5ff',
  titleSize: 132,
  img: THUMB_PSP,
};

// ─── SFX ─────────────────────────────────────────────────────────────────────────────────────────
// Whoosh on the frame-0 cut and on every b-roll cut; an impact on the "here come the pain" punchline;
// a TING on the "sitting pretty" payoff; a riser that builds INTO the climax impact on the full-screen
// cut. Volumes are swept against Whisper on the final MIX (SKILL item 7: an SFX cue that masks the VO
// is a build defect).
export const SFX_PSP: Sfx[] = [
  { t:  0.02, src: staticFile('sfx/Cinematic Whoosh 02.wav'),               vol: 0.40, dur: 1.20 }, // frame-0 thumbnail cut
  { t:  1.92, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.36, dur: 0.90 }, // cut into the hook full-screen
  { t:  3.93, src: staticFile('sfx/Cinematic Whoosh 06.wav'),               vol: 0.30, dur: 0.80 }, // HARD CUT to the pain wave (lands in his pause, no VO under it)
  { t:  7.96, src: staticFile('sfx/Impacts/Impact_2.wav'),                  vol: 0.24, dur: 1.60 }, // PUNCHLINE: "here come the pain"
  { t: 11.12, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.22, dur: 0.80 }, // cut into the stick-through cutaway
  { t: 17.62, src: staticFile('sfx/TING SOUND EFFECT.mp3'),                 vol: 0.24, dur: 1.30 }, // payoff ding: "sitting pretty"
  { t: 27.28, src: staticFile('sfx/Cinematic Whoosh 06.wav'),               vol: 0.22, dur: 0.80 }, // cut into the buy-lower cutaway
  { t: 34.28, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.22, dur: 0.80 }, // cut into the grandma-crowd cutaway
  { t: 43.10, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_3.wav'), vol: 0.16, dur: 2.00 }, // riser building INTO the climax
  // QA (SKILL item 7): the closing line first transcribed as "prices are going UP" off the render.
  // A volume sweep did NOT recover it (0.30 -> 0.14 made no difference) - the real cause was the comp
  // length clipping the word "nuts" (see PSP_DURATION). With 1421 frames the word is back at vol 0.26,
  // so the payoff hit is NOT lowered beyond a small safety trim. Verified on the final mix.
  { t: 45.03, src: staticFile('sfx/Impacts/Impact_2.wav'),                  vol: 0.26, dur: 2.00 }, // CLIMAX impact on the full-screen cut
];

export const PSP: ShortData = {
  clip: PSP_CLIP,
  fps: PSP_FPS,
  durationS: PSP_DURATION / PSP_FPS,
  capY: PSP_CAP_Y,
  seam: PSP_SEAM,
  captions: CAPTIONS_PSP,
  broll: BROLL_PSP,
  badges: BADGES_PSP,
  sounds: SFX_PSP,
  thumb: THUMB_DEF_PSP,
};

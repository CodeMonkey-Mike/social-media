// constants-wod.ts — batch `october-bottom`, clip #3: whatif-organic-dogecoin (variant `long`).
// Data for the shared LivestreamShort renderer. Plan of record (beats, budget, references, SFX,
// caption corrections): video-creation/shorts/october-bottom/whatif-organic-dogecoin/BROLL-PLAN.md
//
// Spine: 86.04 s, 1080x1920, 25 fps. The render copy in render-assets/ is the tightened+desilenced
// spine re-encoded with a 1 s GOP (-g 25 -keyint_min 25 -bf 0 -sc_threshold 0) so Remotion's frame
// seeks land exactly; the canonical spine was NOT touched.
// Measured seam (screen-share -> webcam) = 853 (row-gradient scan, 10 samples, all 853).
// B-roll budget: 25.75 s / 86.04 s = 29.9 % b-roll, 70.1 % base showing; 9 distinct images;
// 3 full-screens (hook / organic pivot / dogecoin climax), the FIRM 1-3 cap.
// TICKER GATE: the token's ticker is $IF, NEVER $WHATIF (persona.json ticker_corrections).
import { staticFile } from 'remotion';
import type { ShortData } from './LivestreamShort';
import { GREEN, YELLOW, ORANGE } from './_kit';
import { CAPTIONS_WOD } from './captionsWod';

export const WOD_FPS = 25;
export const WOD_DURATION_S = 86.04;
export const WOD_FRAMES = Math.round(WOD_DURATION_S * WOD_FPS); // 2151
// Every sfx ref below spells its path out inside a plain staticFile string literal, never a
// template-literal helper: the finalized-short gate parses those literals out of THIS file to count
// SFX events and to prove each asset exists in --public-dir, so a `sfx(f)` wrapper hid all 19 cues
// from it. Keep example paths OUT of these comments too - the gate would count them as refs.

export const D_WOD: ShortData = {
  clip: staticFile('whatif-organic-dogecoin.mp4'),
  fps: WOD_FPS,
  durationS: WOD_DURATION_S,
  // caption band: 37 px under the measured seam (853), far above his eyes (~1150-1250)
  capY: 890,
  seam: 853,
  captions: CAPTIONS_WOD,

  // ── B-ROLL (9 distinct images, zero reuse; every BASE stretch is a deliberate gap) ──────────
  broll: [
    // HOOK full-screen — "what if ... people make the comparison to pepe" ($IF reference art)
    { src: staticFile('broll-wod-hook.png'), tIn: 0.90, tOut: 3.40, mode: 'full' },
    // "pepe was like a totally an insider coin"
    { src: staticFile('broll-wod-insider.png'), tIn: 6.70, tOut: 9.10, mode: 'content' },
    // BASE 9.10-19.60: he points at the real PEPE weekly candles (169m / 353m / 1.8b). Do not cover.
    // "within their first week, they're getting listed on like tier ones"
    { src: staticFile('broll-wod-blitz.png'), tIn: 19.60, tOut: 22.60, mode: 'content' },
    // "so they launched and then suddenly ... all these centralized exchanges"
    { src: staticFile('broll-wod-billboards.png'), tIn: 28.00, tOut: 30.90, mode: 'content' },
    // CLIMAX-1 full-screen — "what if it just grew organically to near 40 million" ($IF reference art)
    { src: staticFile('broll-wod-organic.png'), tIn: 33.30, tOut: 36.60, mode: 'full' },
    // "cashcat got listed on a whole bunch of centralized exchanges" (no CashCat mark exists on disk)
    { src: staticFile('broll-wod-bought-listings.png'), tIn: 40.40, tOut: 43.30, mode: 'content' },
    // CLIMAX-2 full-screen — "dogecoin just grew organically from people getting behind it"
    { src: staticFile('broll-wod-snowball.png'), tIn: 49.55, tOut: 52.60, mode: 'full' },
    // "what it has done in this short of a time period in a bear market"
    { src: staticFile('broll-wod-bloom.png'), tIn: 57.30, tOut: 60.20, mode: 'content' },
    // BASE 60.20-68.80: the screen-share cuts to the REAL $IF page at 60.50. Do not cover.
    // "we need this thing to flip cashcat ... taken seriously"
    { src: staticFile('broll-wod-flip.png'), tIn: 68.80, tOut: 71.60, mode: 'content' },
    // BASE 71.60-86.04: the $IF chart + his face carry the hard-out close, clean.
  ],

  // ── BADGES (code-drawn) — all at top 300, all on BASE stretches, no two windows touch ────────
  badges: [
    { tIn: 23.60, tOut: 26.40, color: ORANGE, line1: 'HTX, GATE, MEXC', line2: 'TIER ONES IN WEEK ONE', top: 300 },
    { tIn: 37.30, tOut: 40.10, color: GREEN, line1: '$IF', line2: 'NEAR 40M, ZERO CEX', sub: 'ORGANIC, IN A BEAR MARKET', top: 300 },
    { tIn: 45.20, tOut: 47.80, color: YELLOW, line1: 'FOLLOW ME', line2: 'FOR DAILY MEME PLAYS', top: 300 },
    { tIn: 65.60, tOut: 68.20, color: GREEN, line1: 'COMMUNITY DRIVEN', line2: 'NO INSIDERS, NO CEX', top: 300 },
  ],

  // ── SFX (19 events, 8 distinct files) — every cue sits UNDER the VO ──────────────────────────
  sounds: [
    { t: 0.00, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.26, dur: 1.2 },   // frame-0 cover cut
    // dur 0.43 (was 1.6): whisper-verified against masking. The 1.6 s tail sat on the word "if"
    // (1.32-1.50) and the mix read "what they're what up"; clipped to 0.43 the sweep still covers
    // the 0.90 hook cut and the line reads "their what-if" exactly as it does off the spine alone.
    { t: 0.62, src: staticFile('sfx/Cinematic Whoosh 02.wav'), vol: 0.20, dur: 0.43 },      // into the hook full-screen
    { t: 3.18, src: staticFile('sfx/Cinematic Whoosh 06.wav'), vol: 0.22, dur: 1.4 },       // off the hook, PEPE page revealed
    { t: 6.55, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.34, dur: 0.60 },  // into the insider boardroom (tail pulled "a totally" to "it's totally")
    // dur 0.35 (was 1.6): the tail covered "coin" (7.70-8.00) and the mix read "insider point".
    // Clipped, the sting still lands on "insider" (7.38) at full volume and clears the next word.
    { t: 7.34, src: staticFile('sfx/ding/sudden-shock.mp3'), vol: 0.30, dur: 0.35 },        // on "insider"
    { t: 12.90, src: staticFile('sfx/TING SOUND EFFECT.mp3'), vol: 0.34, dur: 1.6 },        // on "169m"
    { t: 15.42, src: staticFile('sfx/TING SOUND EFFECT.mp3'), vol: 0.36, dur: 1.6 },        // on "353m"
    { t: 17.90, src: staticFile('sfx/Cash Register.mp3'), vol: 0.46, dur: 2.0 },            // on "1.8b"
    { t: 19.45, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.36, dur: 1.2 },  // into the terminal wall
    { t: 27.85, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.36, dur: 1.2 },  // into the billboard skyline
    { t: 31.40, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_2.wav'), vol: 0.18, dur: 2.2 },  // riser into the pivot
    { t: 33.30, src: staticFile('sfx/Impacts/Impact_Hit_01-2.wav'), vol: 0.38, dur: 2.4 },  // IMPACT on the organic full-screen
    { t: 40.25, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.34, dur: 1.2 },  // into the bought-listings beat
    { t: 47.65, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_3.wav'), vol: 0.16, dur: 1.9 },  // riser into the climax (ends ON the 49.55 crest)
    // dur 0.60 (was 2.4): this impact has a long tail and it buried "just grew" (50.18-50.58) -
    // the mix read "dogecoin is more organically". The HIT ITSELF IS NOT LOWERED (vol stays 0.40),
    // only its tail is trimmed, and "dogecoin just grew organically" transcribes clean again.
    { t: 49.55, src: staticFile('sfx/Impacts/Soundjay_Impact_Main_01.wav'), vol: 0.40, dur: 0.60 },   // IMPACT on the climax
    { t: 57.15, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.22, dur: 1.2 },  // into the bear-market bloom (0.34 pulled "in this" to "and this")
    { t: 60.35, src: staticFile('sfx/TING SOUND EFFECT.mp3'), vol: 0.30, dur: 1.6 },        // the real $IF chart takes the screen
    { t: 68.65, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.34, dur: 1.2 },  // into the flip-cashcat beat
    { t: 83.72, src: staticFile('sfx/Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3'), vol: 0.18, dur: 1.8 }, // soft, on "cashcat."
  ],

  // ── FRAME-0 COVER (one frame only; LivestreamShort defaults thumbDur to 1/fps) ───────────────
  thumb: {
    title: 'PEPE WAS AN\nINSIDER COIN',
    chip: '$IF GREW ORGANICALLY',
    chipColor: GREEN,
    titleSize: 118,
    img: staticFile('thumbnail-wod.png'),
  },
};

// batch october-bottom / clip 2 — kaspa-dip-bought-more (variant long)
// "Kaspa Under 2.6 Cents: That Is When I Bought More"
//
// Data-only module for the shared <LivestreamShort> renderer. Everything the comp loads lives in
// video-creation/shorts/october-bottom/render-assets (rendered with --public-dir on that folder).
//
// Spine: the tightened+desilenced clip, re-encoded into render-assets with a 1s GOP
// (-g 25 -keyint_min 25 -bf 0 -sc_threshold 0) so OffthreadVideo seeks land on a keyframe.
// Source is NATIVE 25 fps / 54.959 s, so the comp runs at 25 fps too (1:1 frame mapping, no
// duplicated frames / judder from a 25->30 conversion) => 1373 frames. Same choice as the sibling
// clip #3 in this batch. All data below is in SECONDS, so the fps choice does not move any cue.
//
// Measured seam (screen-share / webcam divider) = 854 px (row-gradient scan of frames 1/20/40).
// Captions sit at y=950, i.e. BELOW the seam over the top of frame, never on the eyes and never
// under a content-zone b-roll image.
//
// Editorial: conviction clip. The dip is framed as OPPORTUNITY in every visual (glowing
// accumulation zones, light pouring out of the low, the coin picked up at the bottom).
// Kaspa glow is greenish-cyan teal, never gold. Full b-roll rationale + collision map:
// video-creation/shorts/october-bottom/kaspa-dip-bought-more/BROLL-PLAN.md
import { staticFile } from 'remotion';
import type { ShortData } from './LivestreamShort';
import { CAPTIONS_KDBM } from './captionsKdbm';

export const KDBM_FPS = 25;
export const KDBM_DURATION_S = 54.959;
export const KDBM_FRAMES = 1373; // floor(54.959 * 25)

// NOTE: every asset below is written as a LITERAL staticFile call with an inline string. The batch
// asset stager and the finalized-short gate both scan this file with a regex, so wrapping the calls
// in a helper would make both of them see zero refs.
export const D_KDBM: ShortData = {
  clip: staticFile('kaspa-dip-bought-more.mp4'),
  fps: KDBM_FPS,
  durationS: KDBM_DURATION_S,
  capY: 950,
  seam: 854,
  captions: CAPTIONS_KDBM,

  // Frame-0 cover ONLY (LivestreamShort defaults thumbDur to 1/fps): generated background art with
  // the title + chip drawn in code on top, never baked into the image.
  thumb: {
    title: 'KASPA UNDER\n2.6 CENTS',
    chip: 'I BOUGHT MORE',
    chipColor: '#00e5ff',
    titleSize: 126,
    img: staticFile('thumb-kdbm.png'),
  },

  // Persistent brand watermark (top-left, exempt from the no-graphics-under-the-thumb rule).
  logo: {
    src: staticFile('logo-kaspa.png'),
    glow: '#00e5ff',
    watermark: { width: 132, top: 26, left: 26 },
  },

  // B-ROLL — 9 beats / 9 distinct assets, 18.33 s over 54.93 s = 33.4 % coverage
  // (target ~30 %, band 25-35 %). 3 full-screens: hook, dip-buy climax, close (cap is 3).
  broll: [
    { src: staticFile('broll-kdbm-hook.png'),      tIn:  2.10, tOut:  4.30, mode: 'full'    }, // "holy crap, it's weird right now"
    { src: staticFile('broll-kdbm-dip259.png'),    tIn:  8.75, tOut: 10.70, mode: 'content' }, // "dip below 2.6 / like 2.59 cents"
    { src: staticFile('broll-kdbm-buymore.png'),   tIn: 12.95, tOut: 15.05, mode: 'full'    }, // CLIMAX "that's when I bought some more"
    { src: staticFile('broll-kdbm-62k.png'),       tIn: 18.15, tOut: 20.10, mode: 'content' }, // "bitcoin only at 62k, kaspa below 2.6"
    { src: staticFile('broll-kdbm-resilient.png'), tIn: 27.45, tOut: 29.35, mode: 'content' }, // "bitcoin has been very resilient"
    { src: staticFile('broll-kdbm-supply.png'),    tIn: 33.45, tOut: 35.40, mode: 'content' }, // "saylor dumped a hundred million"
    { src: staticFile('broll-kdbm-deeper.png'),    tIn: 39.35, tOut: 41.30, mode: 'content' }, // "below 2 cents? like 1.1, 1.8 cents"
    { src: staticFile('broll-kdbm-reach.png'),     tIn: 44.45, tOut: 46.40, mode: 'content' }, // "it's within reach ... an opportunity"
    { src: staticFile('broll-kdbm-close.png'),     tIn: 52.55, tOut: 55.10, mode: 'full'    }, // "kaspa is going to be flying. same thing with tao."
  ],

  // Code-drawn badges. All three sit in the SAME vertical band (top 300), so their windows are
  // strictly disjoint in time, each nested inside its own b-roll beat. None starts under the thumb.
  badges: [
    { tIn:  9.30, tOut: 10.60, color: '#00e5ff', line1: '2.59¢',    sub: 'THE DIP' },
    { tIn: 13.35, tOut: 14.90, color: '#39ff14', line1: 'BOUGHT MORE', sub: 'RIGHT AT THE LOW' },
    { tIn: 18.30, tOut: 19.90, color: '#ff9f1c', line1: '62K',         sub: 'BITCOIN' },
  ],

  // True-alpha overlay (alpha-from-luminance off a glow-on-black render), floated over the content
  // zone in a BASE gap so it costs no b-roll coverage. Its band (left 300-780 / top 170-650) does not
  // touch the watermark (26-158) or any badge window.
  overlays: [
    { src: staticFile('overlay-kdbm-coin.png'), tIn: 36.00, tOut: 38.00, top: 170, left: 300, width: 480, blend: 'normal' },
  ],

  // SFX — whoosh on the thumbnail cut + every major b-roll transition, riser into the dip-buy
  // impact, cash hit on the buy, ding on the opportunity beat, whoosh + impact into the close.
  // Volumes are deliberately low; the final MIX is whisper-verified for VO masking.
  sounds: [
    { t:  0.00, src: staticFile('sfx/Cinematic Whoosh 02.wav'),      vol: 0.30, dur: 1.2 },
    { t:  2.05, src: staticFile('sfx/transition_rapid_whoosh.mp3'),  vol: 0.26, dur: 1.0 },
    { t:  8.72, src: staticFile('sfx/Cinematic Whoosh 06.wav'),      vol: 0.22, dur: 1.2 },
    { t: 11.35, src: staticFile('sfx/Riser Sound Effect.mp3'),       vol: 0.16, dur: 1.6 },
    { t: 12.95, src: staticFile('sfx/Boom - Big Reveal.wav'),        vol: 0.22, dur: 2.2 },
    { t: 13.98, src: staticFile('sfx/Cash Register.mp3'),            vol: 0.16, dur: 1.6 },
    { t: 18.12, src: staticFile('sfx/Cinematic Whoosh 02.wav'),      vol: 0.20, dur: 1.2 },
    { t: 33.42, src: staticFile('sfx/transition_rapid_whoosh.mp3'),  vol: 0.20, dur: 1.0 },
    { t: 39.32, src: staticFile('sfx/Cinematic Whoosh 06.wav'),      vol: 0.20, dur: 1.2 },
    { t: 44.42, src: staticFile('sfx/TING SOUND EFFECT.mp3'),        vol: 0.18, dur: 1.6 },
    { t: 52.40, src: staticFile('sfx/Cinematic Whoosh 02.wav'),      vol: 0.24, dur: 1.2 },
    { t: 52.55, src: staticFile('sfx/Impacts/Impact_Hit_01-1.wav'),  vol: 0.16, dur: 2.4 },
  ],
};

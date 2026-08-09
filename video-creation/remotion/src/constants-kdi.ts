// batch october-bottom / clip 7 — kaspa-dip-impact (variant IMPACT)
// "OMG: Kaspa Dipped Under 2.6 Cents 😱"
//
// Data-only module for the shared <LivestreamShort> renderer. Everything the comp loads lives in
// video-creation/shorts/october-bottom/render-assets (rendered with --public-dir on that folder).
//
// Spine: the tightened+desilenced clip, re-encoded into the SHARED batch render-assets with a 1s GOP
// (-g 25 -keyint_min 25 -bf 0 -sc_threshold 0) so OffthreadVideo seeks land on a keyframe. The
// canonical spine in the clip folder is untouched. Source is NATIVE 25 fps / 13.36 s, so the comp
// runs at 25 fps too (1:1 frame mapping, no duplicated frames / judder from a 25->30 conversion)
// => 334 frames. All data below is in SECONDS, so the fps choice does not move any cue.
//
// Measured seam (screen-share / webcam divider) = 854 px (row-gradient scan of frames 1/60/150/250:
// row 853 mean ~242, row 854 mean ~37). Captions sit at y=950, i.e. BELOW the seam over the top of
// the face, never on the eyes and never under a content-zone b-roll image.
//
// The base video splices two source segments at 6.76 s (measured, ffmpeg scene score 0.383 on the
// content zone). Before it the screen-share is the CoinMarketCap watchlist with the KAS row reading
// $0.02617 (an ON-MESSAGE receipt, deliberately left uncovered); after it the screen-share is an
// off-message X feed. B-roll beat 2 covers the splice in the content zone.
//
// Editorial: conviction clip, IMPACT cut. The dip is a GIFT, never pain — the cover plunges, beat 1
// lands in light, beat 2 accumulates, beat 3 climbs into dawn. Kaspa glow is greenish-cyan teal,
// never gold. Full b-roll rationale + collision map:
// video-creation/shorts/october-bottom/kaspa-dip-impact/BROLL-PLAN.md
import { staticFile } from 'remotion';
import type { ShortData } from './LivestreamShort';
import { CAPTIONS_KDI } from './captionsKdi';

export const KDI_FPS = 25;
export const KDI_DURATION_S = 13.36;
export const KDI_FRAMES = 334; // 13.36 * 25

// NOTE: every asset below is written as a LITERAL staticFile call with an inline string. The batch
// asset stager and the finalized-short gate both scan this file with a regex, so wrapping the calls
// in a helper would make both of them see zero refs.
export const D_KDI: ShortData = {
  clip: staticFile('kaspa-dip-impact.mp4'),
  fps: KDI_FPS,
  durationS: KDI_DURATION_S,
  capY: 950,
  seam: 854,
  captions: CAPTIONS_KDI,

  // Frame-0 cover ONLY (LivestreamShort defaults thumbDur to 1/fps): generated background art with
  // the title + chip drawn in code on top, never baked into the image.
  thumb: {
    title: 'KASPA DIPPED\nUNDER 2.6¢',
    chip: 'OMG 😱',
    chipColor: '#00e5ff',
    titleSize: 112,
    img: staticFile('thumb-kdi.png'),
  },

  // Persistent brand watermark (top-left, exempt from the no-graphics-under-the-thumb rule).
  logo: {
    src: staticFile('logo-kaspa.png'),
    glow: '#00e5ff',
    watermark: { width: 132, top: 26, left: 26 },
  },

  // B-ROLL — 3 beats / 3 distinct assets, 4.39 s in-comp over 13.36 s = 32.9 % coverage
  // (target ~30 %, band 25-35 %). ONE full-screen, at the hook (impact-cut cap).
  broll: [
    { src: staticFile('broll-kdi-hook.png'),    tIn:  1.40, tOut:  2.80, mode: 'full'    }, // HOOK "below 2.6 cents"
    { src: staticFile('broll-kdi-buymore.png'), tIn:  5.40, tOut:  6.98, mode: 'content' }, // CLIMAX "that's when i bought some more" (also hides the 6.76 splice)
    { src: staticFile('broll-kdi-close.png'),   tIn: 11.95, tOut: 13.50, mode: 'content' }, // CLOSE "kaspa is going to be flying. same thing with tao."
  ],

  // Code-drawn badges. Both sit in the SAME vertical band (top 300), so their windows are strictly
  // disjoint in time (0.40 s apart). Neither starts under the frame-0 thumb.
  badges: [
    { tIn: 3.85, tOut: 5.30, color: '#00e5ff', line1: '2.59¢',       sub: 'THE DIP' },
    { tIn: 5.70, tOut: 6.90, color: '#39ff14', line1: 'BOUGHT MORE', sub: 'RIGHT AT THE LOW' },
  ],

  // True-alpha overlay (alpha-from-luminance off a glow-on-black render, then cropped to the glyph
  // bbox so the placement math is exact), floated over the content zone in the long BASE gap so it
  // costs no b-roll coverage and breaks up the off-message screen-share. The asset is 711x1237, so
  // width 340 => height 592: its band is left 370-710 / top 200-792. That does not touch the
  // watermark (26-158), stays inside the content zone (seam 854), clears the caption band (~900+)
  // even with the +-10 px float, and starts 0.65 s after the last badge ends.
  overlays: [
    { src: staticFile('overlay-kdi-arrow.png'), tIn: 7.55, tOut: 8.95, top: 200, left: 370, width: 340, blend: 'normal' },
  ],

  // SFX — whoosh on the thumbnail cut + into both cutaway transitions, riser into the buy reveal,
  // impact on the reveal, cash hit in the silence after "more.", ding on the opportunity beat,
  // whoosh + impact into the close. Volumes are deliberately low; the final MIX is whisper-verified
  // for VO masking.
  sounds: [
    { t:  0.00, src: staticFile('sfx/Cinematic Whoosh 02.wav'),     vol: 0.30, dur: 1.2 },
    { t:  1.32, src: staticFile('sfx/transition_rapid_whoosh.mp3'), vol: 0.24, dur: 1.0 },
    { t:  4.60, src: staticFile('sfx/Riser Sound Effect.mp3'),      vol: 0.13, dur: 1.0 },
    { t:  5.36, src: staticFile('sfx/Boom - Big Reveal.wav'),       vol: 0.18, dur: 2.0 },
    // 0.16 -> 0.09 (2026-08-05 whisper sweep): at 0.16 its tail sat on "yeah WOW, this" (7.20-7.40)
    // and the final mix transcribed that word as "Well" while the spine alone reads "Wow". Only this
    // cue was lowered; the 5.36 payoff impact is untouched.
    { t:  6.80, src: staticFile('sfx/Cash Register.mp3'),           vol: 0.09, dur: 1.2 },
    { t:  7.42, src: staticFile('sfx/TING SOUND EFFECT.mp3'),       vol: 0.15, dur: 1.4 },
    { t: 11.82, src: staticFile('sfx/Cinematic Whoosh 06.wav'),     vol: 0.22, dur: 1.2 },
    { t: 11.95, src: staticFile('sfx/Impacts/Impact_Hit_01-1.wav'), vol: 0.15, dur: 2.0 },
  ],
};

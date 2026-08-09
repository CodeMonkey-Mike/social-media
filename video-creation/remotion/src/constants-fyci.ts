import { staticFile } from 'remotion';

// ─── four-year-cycle-religion IMPACT (batch: pump-season-is-back, clip #7, variant: impact) ──
// An ULTRA-LEAN ~12s impact cut of clip #2 (four-year-cycle-religion): the hardest tribal beat —
// "i don't believe in a magical four year cycle... it's almost like something religious...
//  it's doctrine, you just believe it and you don't care about data."
//
// Same source livestream as clip #1 (community-receipts) and the full four-year-cycle-religion:
// the clip is ALREADY composited vertical (screen-share top + Mike's face bottom, seam ~y848).
// Played full-frame; the caption band is overlaid at the seam. Do NOT re-split screen/face.
// Modelled EXACTLY on clip #2 (FourYearCycleReligion.tsx / constants-fyc.ts): composited base,
// seam y848 + caption band y866, BrollLayer full/zone, SFX, frame-0 thumbnail (no badges in this cut).
// Clip is 1080x1920 @ 25fps, 12.20s; comp runs at 30fps (OffthreadVideo resamples by time).
//
// Render with (public-dir = the SHARED render-assets/, which holds the impact mp4 + thumbnails + b-roll):
//   npx remotion render src/index.ts FourYearCycleReligionImpact out/pump-season-is-back/7-four-year-cycle-religion-impact.mp4 \
//     --public-dir "<repo>/video-creation/shorts/pump-season-is-back/four-year-cycle-religion/render-assets"

export const FYCI_FPS = 30;
export const FYCI_DURATION = 366; // 12.20s * 30 (covers the 12.20s clip; last caption 'data.' at 11.64, last beat 12.20)

export const CLIP_FYCI  = staticFile('four-year-cycle-religion-impact.mp4');
export const THUMB_FYCI = staticFile('thumbnail-impact.png');

// Layout geometry — same source livestream layout as clip #2. Webcam seam ~y848; zone b-roll covers
// 0..FYCI_SEAM so it hides the burned-in @Pygoz stream comment (~y700-790) AND the low-value static
// BTC chart, while Mike's face stays visible below.
export const FYCI_SEAM  = 848;   // screen-share (top) / face (bottom) seam; zone broll covers 0..SEAM
export const FYCI_CAP_Y = 866;   // caption centre — just below the seam, over Mike's hairline, never his eyes

// ─── B-roll beats (ONE reused image — broll-psb-religion.png, the red cult congregation) ─────────
// Mike's directive for this cut: ULTRA-LEAN, ONE reused b-roll image (from clip #2, already on disk).
// The single image plays FULL-SCREEN over the "it's almost like something religious ... it's doctrine"
// thesis peak. IMPORTANT: the burned-in third-party @Pygoz comment is present the ENTIRE 12.2s (verified
// on the source frames at t=0.2 AND t=11.8 — NOT just the peak window), so the same religion image also
// ZONE-covers the top screen-share zone (0..SEAM) during the opening + closing so the comment is never
// exposed (persona liability); Mike's face plays below the seam there. Distinct-image count stays 1
// (on Mike's ultra-lean budget) while the third-party comment is never flashed. zone->full->zone are
// adjacent (same image) so the top zone is continuously covered — no base flash, comment always hidden.
// staticFile() calls are LITERAL strings on purpose — the finalized-short gate scans for literal refs.
export type FyciBroll = { src: string; tIn: number; tOut: number; mode: 'full' | 'zone' };
export const BROLL_FYCI: FyciBroll[] = [
  { src: staticFile('broll-psb-religion.png'), tIn:  0.00, tOut:  4.80, mode: 'zone' }, // opening: "i don't believe in a magical four year cycle" (top zone covered, face below)
  { src: staticFile('broll-psb-religion.png'), tIn:  4.80, tOut:  9.42, mode: 'full' }, // THESIS PEAK: "because it's almost like something religious ... it's doctrine" (FULL-SCREEN)
  { src: staticFile('broll-psb-religion.png'), tIn:  9.42, tOut: 12.20, mode: 'zone' }, // close: "you just believe... don't care about data" (top zone covered, face below)
];

// ─── SFX events (from the SHARED render-assets/sfx/; all vol <= 0.55 under the VO) ────────────────
// whoosh on the thumbnail cut; riser builds INTO the "religious" peak; whoosh-rapid on the zone<->full
// layout transitions; impacts land on the "religious" thesis + the "doctrine" reveal. Literal sfx/
// path strings below (gate-visible). >= 2 distinct refs required; this has 5 distinct files.
export type FyciSfx = { t: number; src: string; vol: number; dur: number };
export const SFX_FYCI: FyciSfx[] = [
  { t:  0.00, src: staticFile('sfx/whoosh.wav'),       vol: 0.50, dur: 1.6 }, // thumbnail cut -> hook reveal
  { t:  3.40, src: staticFile('sfx/riser.wav'),        vol: 0.34, dur: 1.7 }, // build into the "religious" thesis peak
  { t:  4.80, src: staticFile('sfx/whoosh-rapid.mp3'), vol: 0.40, dur: 1.0 }, // zone -> full (layout transition into the peak)
  { t:  5.14, src: staticFile('sfx/impact-big.wav'),   vol: 0.52, dur: 3.0 }, // "religious" (THESIS PEAK impact)
  { t:  8.58, src: staticFile('sfx/impact-kick.wav'),  vol: 0.44, dur: 2.0 }, // "doctrine" reveal
  { t:  9.42, src: staticFile('sfx/whoosh-rapid.mp3'), vol: 0.38, dur: 1.0 }, // full -> zone (layout transition back)
];

// ─── Captions ─────────────────────────────────────────────────────────────────
// Built from whisper-words-impact.json (word-level, accurate for THIS 12.2s cut), grouped 2-4
// words (~0.4-0.9s each). Mike's spoken words kept verbatim. No em dashes on-screen.
//  - "four -year cycle" -> "four year cycle" (Whisper hyphen artifact; persona = no hyphen/em dash).
// Colour spans (<g> = TEAL brand accent, matching clip #2's "teal = brand thread" convention so the
// set reads together) on the thesis spine only: religious / doctrine.
export const CAPTIONS_FYCI: { t: number; h: string }[] = [
  { t:  0.00, h: 'i don\'t believe' },
  { t:  0.60, h: 'in a magical' },
  { t:  1.44, h: 'four year cycle' },
  { t:  2.62, h: 'that just can\'t be' },
  { t:  3.74, h: 'explained, right?' },
  { t:  4.80, h: 'because it\'s almost' },
  { t:  5.14, h: 'like something <g>religious.</g>' },
  { t:  6.46, h: 'right? when you believe' },
  { t:  7.14, h: 'in something that\'s like' },
  { t:  8.06, h: 'it\'s <g>doctrine.</g>' },
  { t:  9.42, h: 'you just believe' },
  { t:  9.94, h: 'in it and you just' },
  { t: 10.70, h: 'don\'t care about' },
  { t: 11.64, h: 'data.' },
];

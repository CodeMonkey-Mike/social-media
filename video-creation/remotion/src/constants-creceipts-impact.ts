import { staticFile } from 'remotion';

// ─── community-receipts IMPACT cut (batch: pump-season-is-back, clip #6) ───────────
// The short high-impact cut of the community-receipts topic: the open-loop 500x tease
// ("I'm not going to reveal it yet... when it gets to 100x I'll let you know. I'm
// expecting a 500x out of this particular one that's been pumping today.").
//
// SAME livestream layout as the QA-approved CommunityReceipts full cut: the source clip
// is ALREADY composited vertical (screen-share top + Mike's face bottom, seam ~y848),
// played full-frame with the caption band overlaid at the seam. Do NOT re-split
// screen/face. Clip is 1080x1920 @ 25fps, ~15.0s; comp runs at 30fps (OffthreadVideo
// resamples by time).
//
// Rebuilt to the FINALIZED-SHORT contract (livestream-repurpose/skills/remotion-shorts-build/SKILL.md):
// ULTRA-LEAN by design (Mike: minimal, reuse). B-roll = TWO full-screen inserts, both
// REUSED from clip #1 (zero generation): the mystery coin over the "not gonna reveal it"
// HOOK, and the 500x rocket over the "expecting a 500x" CLIMAX. Mike's face + screen (base
// video) carries the credibility beat in the middle. SFX: whoosh on the thumbnail cut +
// riser building INTO an impact on the 500x reveal. Frame-0 designed thumbnail cover.
//
// Render (public-dir = render-assets/, SHARED with clip #1 — holds clip mp4 + thumbnail-impact.png
// + the reused broll pngs + sfx/):
//   npx remotion render src/index.ts CommunityReceiptsImpact out/pump-season-is-back/6-community-receipts-impact.mp4 \
//     --public-dir "<repo>/video-creation/shorts/pump-season-is-back/community-receipts/render-assets"

export const CRI_FPS = 30;
export const CRI_DURATION = 448; // 14.933s * 30 — caps just under the 14.96s video (all audio ends 14.54s)

export const CLIP_I  = staticFile('community-receipts-impact.mp4');
export const THUMB_I = staticFile('thumbnail-impact.png');

// Layout geometry (same composited source as clip #1; measured from extracted frames).
export const CRI_SEAM  = 848;  // screen-share (top) / face (bottom) seam; zone broll covers 0..SEAM
export const CRI_CAP_Y = 866;  // caption centre — just below the seam, over Mike's hairline, never his eyes

// ─── B-roll beats ──────────────────────────────────────────────────────────────
// Both beats are 'full' (whole frame). REUSED assets from clip #1 — NO generation. The base
// video (Mike + screen) plays in the ~6.4s gap between them (deliberate base beat > 1.5s).
// NOTE: staticFile() calls are LITERAL strings on purpose — the finalized-short gate scans for
// literal staticFile('...') refs, so helper-built paths would be invisible to the definition-of-done.
export type CriBroll = { src: string; tIn: number; tOut: number; mode: 'full' | 'zone' };
export const BROLL_CRI: CriBroll[] = [
  { src: staticFile('broll-psb-mystery.png'), tIn:  0.0, tOut:  3.9, mode: 'full' }, // "i'm not going to reveal it yet" — HOOK tease (mystery coin)
  { src: staticFile('broll-psb-500x.png'),    tIn: 10.3, tOut: 14.9, mode: 'full' }, // "i'm expecting a 500x of this" — CLIMAX payoff (rocket)
];

// ─── SFX events ────────────────────────────────────────────────────────────────
// whoosh on the thumbnail cut (-> mystery hook), riser building INTO the 500x reveal, a rapid
// whoosh as the rocket swooshes full-screen, and the big impact on the "500x" word. All under the
// VO (vol <= 0.55). Literal staticFile('sfx/...') strings (gate-visible; see the b-roll note above).
export type CriSfx = { t: number; src: string; vol: number; dur: number };
export const SFX_CRI: CriSfx[] = [
  { t:  0.00, src: staticFile('sfx/whoosh.wav'),       vol: 0.50, dur: 1.6 }, // thumbnail cut -> mystery hook reveal
  { t:  8.40, src: staticFile('sfx/riser.wav'),        vol: 0.38, dur: 2.9 }, // build INTO the 500x reveal
  { t: 10.20, src: staticFile('sfx/whoosh-rapid.mp3'), vol: 0.42, dur: 1.0 }, // rocket swooshes full-screen
  { t: 11.00, src: staticFile('sfx/impact-big.wav'),   vol: 0.55, dur: 3.5 }, // "500x" payoff impact (biggest)
];

// ─── Captions ─────────────────────────────────────────────────────────────────
// Built via skills/captions/build_captions.py (captions-impact.txt), timings verified
// word-for-word against whisper-words-impact.json. Mike's SPOKEN words kept verbatim.
// Colour spans (from _kit.colourize): <y>=yellow accent on the 100x / 500x multipliers
// (matches the "500x INCOMING" thumbnail). No em dashes on-screen.
export const CAPTIONS_CRI: { t: number; h: string }[] = [
  { t:  0.00, h: 'i\'m not going' },
  { t:  1.10, h: 'to reveal it' },
  { t:  2.02, h: 'yet.' },
  { t:  4.20, h: 'haha' },
  { t:  5.24, h: 'you guys know i don\'t' },
  { t:  6.40, h: 'do that publicly.' },
  { t:  8.22, h: 'when it gets to like' },
  { t:  9.20, h: '<y>100x</y>, i\'ll let you know.' },
  { t: 10.38, h: 'i\'m expecting a' },
  { t: 11.00, h: '<y>500x</y> out of this' },
  { t: 12.56, h: 'particular one that\'s' },
  { t: 13.32, h: 'been pumping today' },
  { t: 14.04, h: 'for us.' },
];

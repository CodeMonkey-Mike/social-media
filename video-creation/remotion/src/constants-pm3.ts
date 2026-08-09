import { staticFile } from 'remotion';

// ─── peach-minute / clip 3 — "03-kaspa-hate-bottom-signal" ──────────────────────────────────────
// Title (open loop): "Three Out of Ten Kaspa Comments Are Negative Now"
// Thesis: Kaspa capitulation-as-signal. The hate is the bottom tell.
//
// The spine (`preview.mp4`, tightened + desilenced at 450ms, DO NOT re-cut) is ALREADY composited
// vertical: screen-share on top, Mike's webcam below. It is played full-frame; the caption band is
// overlaid just BELOW the seam. Do NOT re-split screen/face.
// Clip is 1080x1920 @25fps, 40.455s; comp runs at 30fps (OffthreadVideo resamples by time).
//
// Render with (public-dir = the CLIP's render-assets/, which holds the spine + thumbnail + b-roll +
// the copied sfx/logo):
//   npx remotion render src/index.ts KaspaHateBottomSignal out/peach-minute/3-kaspa-hate-bottom-signal.mp4 \
//     --public-dir "<repo>/video-creation/shorts/peach-minute/03-kaspa-hate-bottom-signal/render-assets"

export const PM3_FPS = 30;
export const PM3_DURATION = 1213; // 40.433s @30 — just inside the 40.455s clip (no black tail frame)

export const CLIP_PM3  = staticFile('03-kaspa-hate-bottom-signal.mp4');
export const THUMB_PM3 = staticFile('thumbnail-pm3.png');
export const LOGO_PM3  = staticFile('logo-kaspa.png');   // the REAL Kaspa asset (reference folder), corner watermark

// Layout geometry — MEASURED on this clip (row-gradient scan of frames at t=1/8/16/24/32/39s; all
// six agree on y853, so the seam is stable for the whole clip).
export const PM3_SEAM  = 853;   // screen-share (top) / webcam (bottom) seam; content-mode broll covers 0..SEAM
export const PM3_CAP_Y = 905;   // caption centre — BELOW the seam, over the green backdrop, above his
                                // hairline (measured hair top y~980-1000). So captions never sit on
                                // content-zone b-roll and never over his eyes.

// ─── Frame-0 cover (SKILL Phase 7 rule #5: ONE frame, base video from frame 1) ───────────────────
// Generated art + CODE-DRAWN title/chip on top (never baked into the art).
export const PM3_THUMB_TITLE = '3 OUT OF 10\nKASPA COMMENTS\nARE NEGATIVE\nNOW';
export const PM3_THUMB_CHIP  = 'WHY THAT IS BULLISH';

// ─── B-roll beats (authored in BROLL-PLAN.md BEFORE generating) ──────────────────────────────────
// Coverage budget (SKILL "B-roll coverage budget", HALVED 2026-07-14):
//   13.42s covered / 40.455s = 33.2% b-roll, 27.04s = 66.8% BASE SHOWING. Targets ~30% / ~70%,
//   bands 25-35% / 65-75%. Both inside band.
// 5 distinct images, zero reuse. mode 'full' = whole frame (HOOK + CLIMAX only, 2x, cap is 1-3 FIRM);
// 'content' = the top screen-share zone only (0..SEAM), the webcam keeps playing below.
// The two full-screens are 29.3s apart, so there is no full->tiny-gap->full base flash. Smallest gap
// between ANY two beats is 2.80s (>= the 1.5s rule). Base beats are marked below and are DELIBERATE:
// the base screen-share is a Kaspa price-scenario slide that literally prints a $0.10 Kaspa downside
// case, i.e. exactly the "is it going to two cents" question he is answering.
//
// ⚠ MEASURED SHOT MAP (frame-diff scan of the base, this build): the clip's FIRST 0.80s is a
// DIFFERENT screen-share — an X/Twitter timeline left over from the tighten keep-span [652.86,653.66]
// — and it hard-cuts to the Kaspa scenario slide at t~0.80. Content-zone diff vs t=14.4s is 213 at
// t=0.2/0.6 and ~1.5 everywhere from t=0.9 to the end, so that is the ONLY shot change in the clip.
// The HOOK full-screen therefore starts at tIn 0.00 (not 1.60) so the off-message X page and its cut
// are never on screen; the base is revealed at 2.90 exactly on "down at two cents", landing the
// slide's own KASPA $0.10 card as the receipt.
// staticFile() calls are LITERAL strings on purpose — the finalized-short gate scans for literal refs.
export type Pm3Broll = { src: string; tIn: number; tOut: number; mode: 'full' | 'content' };
export const BROLL_PM3: Pm3Broll[] = [
  { src: staticFile('broll-pm3-two-cents.png'),         tIn:  0.00, tOut:  2.90, mode: 'full' },    // "i get a lot of people asking if kaspa's gonna go" (HOOK; covers the X-page shot + its cut; generated WITH kaspa-logo.png)
  // BASE 2.90-11.60 (8.70s) — REVEAL on "down at two cents": the Kaspa scenario slide with its $0.10
  //   card is the receipt for the whole question, then "i do wanna say that when i make kaspa videos".
  //   Badge A rides this stretch.
  { src: staticFile('broll-pm3-negative-comments.png'), tIn: 11.60, tOut: 14.86, mode: 'content' }, // "a lot of comments, i get a lot of comments from people that are negative"
  // BASE 14.86-19.54 (4.68s) — "a year ago i would hardly get any negative comments about kaspa"
  //   (the CONTRAST line: deliberately carried on his face, nothing over it).
  { src: staticFile('broll-pm3-three-of-ten.png'),      tIn: 19.54, tOut: 21.95, mode: 'content' }, // "and now it's like three out of 10 comments on my videos" (THE TITLE STAT)
  // BASE 21.95-27.10 (5.15s) — "are like negative. or maybe more, i don't know. so it just makes me
  //   think". Badge B rides this stretch.
  { src: staticFile('broll-pm3-hate-spread.png'),       tIn: 27.10, tOut: 29.40, mode: 'content' }, // "that there's that much hate that's being spread around"
  // BASE 29.40-32.20 (2.80s) — "when it gets to that point and i get to that low" (the riser builds under it)
  { src: staticFile('broll-pm3-flying-soon.png'),       tIn: 32.20, tOut: 34.75, mode: 'full' },    // "things are gonna start flying soon" (CLIMAX; generated WITH kaspa-logo.png)
  // BASE 34.75-40.46 (5.71s) — "when a project gets that much hate, something's gotta change really
  //   soon" (the punchline lands on his face; badge C rides here).
];

// ─── Badges (crisp CODE text, never baked into art) ──────────────────────────────────────────────
// All three sit INSIDE base stretches, are time-disjoint, and share ONE vertical band (centre y300,
// box ~185-415). So they can never collide with each other, with the captions (y905), with the corner
// watermark (y28-140), or with the frame-0 cover (1 frame; first tIn is 4.60).
// Each states something the CAPTIONS DO NOT.
export type Pm3Badge = { tIn: number; tOut: number; big: string; sub: string; color: string };
export const BADGES_PM3: Pm3Badge[] = [
  { tIn:  4.60, tOut:  7.30, big: '$0.02?',    sub: 'THE QUESTION I KEEP GETTING', color: '#ff5252' }, // base 2.90-11.60
  { tIn: 23.60, tOut: 26.30, big: '30%+',      sub: 'OF EVERY COMMENT, NEGATIVE',  color: '#ff5252' }, // base 21.95-27.10
  { tIn: 36.30, tOut: 39.20, big: 'PEAK HATE', sub: 'IS WHERE THE TURN STARTS',    color: '#00e5ff' }, // base 34.75-40.46
];

// ─── SFX (copied into render-assets/sfx/ from the shared library; all well under the VO) ──────────
// Whoosh on the frame-0 thumbnail cut + every b-roll transition; impacts on the two reveals; a riser
// builds INTO the climax impact. The closing sting is deliberately QUIET (0.16) because of the
// documented "sting masks the punchline" defect — whisper-verified on the final mix.
export type Pm3Sfx = { t: number; src: string; vol: number; dur: number };
export const SFX_PM3: Pm3Sfx[] = [
  { t:  0.00, src: staticFile('sfx/Cinematic Whoosh 02.wav'),               vol: 0.42, dur: 1.6 }, // frame-0 cover cut straight into the HOOK full-screen
  { t:  2.90, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.34, dur: 1.0 }, // HOOK full -> base REVEAL (the Kaspa $0.10 slide)
  { t:  3.60, src: staticFile('sfx/Impacts/Kick_Impact_01.wav'),            vol: 0.30, dur: 1.4 }, // "two cents" lands
  { t: 11.60, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.30, dur: 1.0 }, // base -> negative-comments zone
  { t: 19.54, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.30, dur: 1.0 }, // base -> three-out-of-ten zone
  { t: 20.34, src: staticFile('sfx/Impacts/Impact_3.wav'),                  vol: 0.36, dur: 2.4 }, // "three out of 10" (THE stat reveal)
  { t: 27.10, src: staticFile('sfx/transition_rapid_whoosh.mp3'),           vol: 0.28, dur: 1.0 }, // base -> hate-spread zone
  { t: 30.10, src: staticFile('sfx/risers/Tension_Rise_Logo_Reveal_1.wav'), vol: 0.26, dur: 2.3 }, // riser builds INTO the climax
  { t: 32.20, src: staticFile('sfx/Boom - Big Reveal.wav'),                 vol: 0.42, dur: 3.0 }, // CLIMAX full-screen hard cut
  { t: 39.30, src: staticFile('sfx/Impacts/card-impact-hit01-3-short.wav'), vol: 0.16, dur: 1.2 }, // "change really soon" button (quiet on purpose)
];

// ─── Captions ─────────────────────────────────────────────────────────────────────────────────────
// Built with the CANONICAL captions skill:
//   python video-creation/skills/captions/build_captions.py --words whisper-words.json \
//     --style montserrat --var CAPTIONS_PM3 --colorize "g=kaspa,kaspa's y=three,10,two,cents r=negative,hate"
// (montserrat preset = shorts house style: lowercase, 2-3 word chunks / up to 5 if every word <=4
// chars, bounce pop, Montserrat 900 + 13px black stroke. NEVER uppercase.)
//
// ⛔ KASPA, NEVER "CASPER". Whisper heard "Casper"/"Casper's" on all 3 hits in this clip (t=2.38,
// t=7.94, t=18.50). The builder's CORRECTIONS table (casper/kasper/caspa -> kaspa) fixed every one,
// and every hit is re-verified word-by-word against the FINAL RENDER's own transcript in QA.
// "Casper" is a DIFFERENT chain ($CSPR) and must never appear on screen.
//
// Hand edits to the builder output (grouping/case/style otherwise untouched):
//  - DROPPED the stranded leading "is" at t=0.00 (0.10s long). The tighten cut lands mid-clause
//    ("...the thing IS, i get a lot of people asking"), so the first caption would have read
//    "is i get a lot" — the same class of artifact the captions skill already cleans (fillers,
//    stutters); readability wins. Caption 1 now starts at t=0.10 on "i get a lot".
//  - SPLIT "much hate, you know, it's" (5 short words, legal under the preset but ~979px wide at
//    74px in a 980px box, so it would have WRAPPED to two lines and hit the face) into
//    "much hate," + "you know, it's". Nothing else exceeds ~930px.
//  - "point and i / get to that low" -> "point and it / gets to that low". Mumbled audio; three
//    Whisper passes disagree ("and I get to that low" / "and it gets to that low" / "and I guess that
//    low"). The parallel construction he is actually saying is "when it GETS to that point and it
//    GETS to that low", which two passes support and which is the only reading that is grammatical.
//    NOTE: this was A/B tested as a possible SFX mask (the riser at 30.10 sits under it) and it is
//    NOT one: the same 4.6s window transcribes IDENTICALLY with the riser at 0.26 and with no riser
//    at all, so the riser volume was left alone.
// Colour spans (from _kit.colourize): <g> teal = Kaspa (the brand thread), <y> yellow = the numbers
// (two / cents / three / 10), <r> red = the hate words (negative / hate). No em dashes anywhere.
export const CAPTIONS_PM3: { t: number; h: string }[] = [
  { t:   0.10, h: 'i get a lot' },
  { t:   0.60, h: 'of people asking' },
  { t:   2.06, h: 'if <g>kaspa\'s</g> gonna' },
  { t:   3.00, h: 'go down at <y>two</y>' },
  { t:   3.74, h: '<y>cents</y> and all' },
  { t:   4.62, h: 'this stuff like' },
  { t:   5.52, h: 'that.' },
  { t:   6.16, h: 'i do wanna' },
  { t:   6.68, h: 'say that when i make' },
  { t:   7.94, h: '<g>kaspa</g> videos, i' },
  { t:   9.30, h: 'get a lot of' },
  { t:  10.18, h: 'content, i got' },
  { t:  11.16, h: 'a lot of' },
  { t:  11.62, h: 'comments, i get' },
  { t:  12.38, h: 'a lot of' },
  { t:  12.76, h: 'comments from people' },
  { t:  13.88, h: 'that are <r>negative.</r>' },
  { t:  14.88, h: 'a year ago, let\'s say' },
  { t:  16.20, h: 'i would hardly' },
  { t:  17.04, h: 'get any <r>negative</r>' },
  { t:  17.82, h: 'comments about <g>kaspa.</g>' },
  { t:  19.54, h: 'and now it\'s like' },
  { t:  20.34, h: '<y>three</y> out of' },
  { t:  21.32, h: '<y>10</y> comments on' },
  { t:  22.28, h: 'my videos are' },
  { t:  22.92, h: 'like <r>negative.</r>' },
  { t:  23.68, h: 'or maybe more' },
  { t:  24.48, h: 'i don\'t know.' },
  { t:  25.32, h: 'so it just' },
  { t:  25.88, h: 'makes me think' },
  { t:  26.66, h: 'that there\'s that' },
  { t:  27.64, h: 'much <r>hate</r> that\'s' },
  { t:  28.54, h: 'being spread around.' },
  { t:  29.68, h: 'when it gets to that' },
  { t:  30.38, h: 'point and it' },
  { t:  31.16, h: 'gets to that low' },
  { t:  32.36, h: 'things are gonna' },
  { t:  32.80, h: 'start flying soon.' },
  { t:  34.18, h: 'you know, when a' },
  { t:  34.82, h: 'project gets that' },
  { t:  36.86, h: 'much <r>hate,</r>' },
  { t:  37.54, h: 'you know, it\'s' },
  { t:  38.04, h: 'like something\'s gotta' },
  { t:  39.42, h: 'change really soon.' },
];

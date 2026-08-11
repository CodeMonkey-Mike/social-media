import { staticFile } from 'remotion';
import type { BrollEv, Sfx } from './_kit';
import type { BadgeEv, ThumbDef } from './LivestreamShort';

// ─── kitsu-vlads-dog (batch: last-year, clip #3, variant: full) ─────────────────────────────────
// "The Robinhood CEO's Dog Is Now a Coin" — a commenter points him at "the Shiba of Robinhood"; it
// turns out to be a REAL dog, Vlad's (the Robinhood CEO's), adopted during the Doge era "because he
// was into memes"; the eruption "you know how bullish that is, man"; the will-it-list-on-the-app
// question; then the scatter-gathered precedent, KISHU INU going parabolic to two billion in 2021
// with no centralized exchanges, and the names sounding the same. Ends HARD on "i wouldn't mind
// buying into this right now" (the double-hedge tail was cut in the tighten pass) — nothing is
// placed over that ending.
//
// Base clip: kitsu-vlads-dog-final.mp4 (raw cut -> Phase 5 tighten -> 5B desilence -> 5C filler).
// ALREADY composited vertical (screen-share on top, webcam below), 1080x1920 @ 25 fps, 87.52 s.
// FINAL, do NOT re-cut and do NOT re-split the zones. The comp runs at 30 fps; OffthreadVideo
// resamples the 25 fps source by TIME, so every cue below is plain seconds taken from this clip's
// own Whisper word timings (clip-relative, 0-based).
//
// ⚠ The file referenced here is THIS CLIP'S OWN render-assets copy, re-encoded to a seek-friendly
//   GOP by setup_render_assets.py (keyframe every 1.0 s, verified with ffprobe; the canonical
//   long-GOP spine kills Remotion's concurrent OffthreadVideo seeks). Identity verified before the
//   build: same 87.52 s duration and a byte-identical audio stream (md5 e88e15260a9a6368a0045d684b
//   6e01c2 on BOTH kitsu-vlads-dog/kitsu-vlads-dog-final.mp4 and render-assets/kitsu-vlads-dog.mp4).
//
// Render (public-dir = the BATCH render-assets/, shared with clips 1/2/4; every file this clip owns
// is `*-lyk-*` prefixed so the four parallel builders cannot collide):
//   npx remotion render src/index.ts LastYearKitsuVladsDog \
//     out/last-year/3-kitsu-vlads-dog.mp4 \
//     --public-dir "<repo>/video-creation/shorts/last-year/render-assets"

export const LYK_FPS = 30;
export const LYK_DURATION = 2625; // 87.52 s spine; frame 2624 = t 87.467 s, inside the clip

export const CLIP_LYK  = staticFile('kitsu-vlads-dog.mp4');
export const THUMB_LYK = staticFile('thumb-lyk.png');

// Layout geometry, MEASURED on this clip (row-mean gradient scan at t=1/8/15/22/30/40/50/60/70/80/
// 86 s; all ELEVEN frames put the hard screen-share/webcam divider on the SAME row, delta 152-221).
export const LYK_SEAM  = 853; // content zone = 0..853 (X profile, then the KISHU chart); webcam below
export const LYK_CAP_Y = 910; // caption centre: 57 px under the seam, on his hair, never his eyes (~1220)
// Divider colour under a CONTENT-mode image. Robinhood LIME, never teal: teal is Kaspa's brand and
// would misread on a Robinhood/Kitsu clip.
export const LYK_ACCENT = '#ccff00';

// ─── B-roll beats (authored in BROLL-PLAN.md BEFORE generation) ────────────────────────────────
// Coverage budget (SKILL "B-roll coverage budget", HALVED 2026-07-14):
//   26.65 s covered / 87.52 s = 30.4 % b-roll, 60.87 s = 69.6 % BASE SHOWING. Targets ~30 % / ~70 %
//   (bands 25-35 % / 65-75 %) => on target. 10 distinct images, ZERO reuse, every beat 2.15-3.10 s
//   (the style guide's "changes every 1-3 s"). Image count is the OUTPUT of the budget: 26.6 s of
//   coverage at <=3 s per beat and no reuse allowed = ~10 beats, arithmetically.
// 3 full-screens ONLY (hook / the eruption / the two-billion slam) = the FIRM 1-3 cap. They are
// 31.3 s and 34.75 s apart, so no full->full base flash can exist. The only image-to-image joins are
// B7->B8 (64.85) and B9->B10 (74.90), EXACTLY butted so BrollLayer HARD-CUTS with zero base frames.
//
// ⚠ THE CONTENT ZONE IS A REAL RECEIPT FOR ALMOST THE WHOLE CLIP and is deliberately NOT blanketed:
//   0-58 s   the live @KitsuRobinhood X profile — banner "The Shiba of Robinhood", bio "Vlad's Shiba
//            Inu. Name confirmed. Featured many times by Robinhood's CEO. Adopted during the DOGE
//            era", pinned post "WOOF! Vlad Tenev's favorite Dog on Robinhood!". This is where the
//            project's REAL branding comes from — no Kitsu reference image exists on disk, so no
//            generated asset may carry an invented Kitsu logo (reference gate, checked live).
//   58-87 s  the live KISHU/WETH dexscreener chart, monthly candles, the 2021 spike against a 2.40B
//            axis — the receipt for "went to two billion", shown clean for 5.15 s while he points.
//   The only three junk stretches (a DexScreener search modal ~62-64 s, an open timeframe dropdown
//   ~65-67 s, the modal again ~81 s) are exactly the ones covered.
// staticFile() calls are LITERAL strings on purpose — the finalized-short gate scans for literal refs.
export const BROLL_LYK: BrollEv[] = [
  // BASE 0.033-1.00 — the frame-0 thumb is ONE frame; the video opens on Mike + the screen-share
  { src: staticFile('broll-lyk-hook.png'),        tIn:  1.00, tOut:  3.60, mode: 'full'    }, // HOOK: "this is the shiba of robinhood" (1.62-3.42)
  // BASE 3.60-8.40 (4.80 s) — he reads the profile ("i wasn't aware of this guy / it's a real dog")
  { src: staticFile('broll-lyk-office-dog.png'),  tIn:  8.40, tOut: 11.00, mode: 'content' }, // "it's not an ACTUAL OFFICE DOG" (8.32-10.86)
  // BASE 11.00-16.20 (5.20 s) — "it is vlad's, the CEO of robinhood" over the bio + BADGE 1
  { src: staticFile('broll-lyk-doge-era.png'),    tIn: 16.20, tOut: 18.90, mode: 'content' }, // "adopted during the DOGE ERA" (15.84-17.94)
  // BASE 18.90-25.40 (6.50 s) — "this right here is BULLISH in more ways than one"
  { src: staticFile('broll-lyk-memelord.png'),    tIn: 25.40, tOut: 28.10, mode: 'content' }, // "he got the dog just because he was into MEMES" (25.36-28.58)
  // BASE 28.10-34.90 (6.80 s) — FACE beat: "what are you thinking about that? he got the dog. he got
  // a shiba inu because he was into memes." The repetition IS the performance; nothing over it.
  { src: staticFile('broll-lyk-bullish.png'),     tIn: 34.90, tOut: 38.00, mode: 'full'    }, // PEAK: "you know how BULLISH that is, man" (34.90-38.92)
  // BASE 38.00-47.55 (9.55 s) — "i can't wait for us to get into this bull run... most exciting times
  // ever". Pure face energy; the exhale on "man." lands here on purpose.
  { src: staticFile('broll-lyk-app-listing.png'), tIn: 47.55, tOut: 50.25, mode: 'content' }, // "inclined to put this ON THE ROBINHOOD APP" (47.54-49.86)
  // BASE 50.25-62.20 (11.95 s) — "for robinhood retail to come in and buy it? i mean, it could be.
  // kitsu is interesting... so vlad's shiba inu is NAMED KITSU." The X profile IS the receipt for the
  // name, so it stays visible; BADGE 2 does not live here (badges are 63 s apart, see below).
  { src: staticFile('broll-lyk-name-twin.png'),   tIn: 62.20, tOut: 64.85, mode: 'content' }, // "i pointed out what KISHU did" (62.08-64.86) + hides the search modal
  { src: staticFile('broll-lyk-parabolic.png'),   tIn: 64.85, tOut: 67.60, mode: 'content' }, // "KISHU INU just went like PARABOLIC in the bull run of 2021" — EXACTLY butted, hard cut
  // ⛔ BASE 67.60-72.75 (5.15 s) — "SEE RIGHT HERE, LOOK AT THIS... here's a monthly candles right
  // here, but it's nuts." HE IS POINTING AT THE CHART. Covering it here is the documented WRONG move.
  { src: staticFile('broll-lyk-two-billion.png'), tIn: 72.75, tOut: 74.90, mode: 'full'    }, // SLAM: "WENT TO TWO BILLION" (72.76-73.62)
  { src: staticFile('broll-lyk-no-cex.png'),      tIn: 74.90, tOut: 77.60, mode: 'content' }, // "without any CENTRALIZED EXCHANGES, some silly inu that out of nowhere just exploded" — butted, hard cut
  // BASE 77.60-87.52 (9.92 s) — the close: "the name sounds the same. kitsu, kitsu, kitsu. very good
  // chart." + BADGE 2, then the deliberate HARD-OUT ("yeah, i wouldn't mind buying into this right
  // now") plays on his face with NOTHING over it and NO sfx. That abruptness is the watch-time play.
];

// ─── Code-drawn badges ──────────────────────────────────────────────────────────────────────────
// Each sits INSIDE a deliberate base stretch (never over a b-roll image), they are 63.4 s apart so
// they can never co-occur, and neither starts before the frame-0 thumb ends (0.033 s) — LivestreamShort
// also suppresses badges while the thumb is up. Both use the same vertical band (top 560), which is
// ~155 px clear of the caption band (caption top edge ~858) even at the badge's 3-line height.
// Both are RECEIPTS, not restatements: the CEO's full name (never spoken, but on his screen-share in
// the pinned post) and the precedent's numbers.
//
// ⚠ GEOMETRY, computed against the shared `Badge` BEFORE rendering (the eliza-batch lesson): the
// component is positioned `left: 50%` with `translate(-50%,-50%)` and NO explicit width, so an
// absolutely-positioned shrink-to-fit box is capped at (1080 - 540) = 540 px, leaving ~426 px of
// text after the 52 px side padding and 5 px border. At the 82 px `line2` size that is ~8 characters,
// and a SINGLE word longer than that cannot wrap, so it would overflow the padded box. "ROBINHOOD"
// alone measures ~441 px at 82 px, so it is deliberately NOT a line2 anywhere here. Every string
// below fits on one line at its own size: line1 'VLAD TENEV' ~375 px / 'KISHU INU' ~313 px @60,
// line2 'HIS DOG' ~344 px / '2 BILLION' ~389 px @82, subs ~401 px / ~496 px @32 (badge 2's sub wraps
// to two centred lines, which is fine - no word in it is anywhere near the cap).
// Box height ~268 px (badge 1) / ~306 px (badge 2) centred on top 560 => bottom edge ~694 / ~713 px,
// against a caption top edge of ~858 px: 164 / 145 px of clearance. Verified on the render.
export const BADGES_LYK: BadgeEv[] = [
  { tIn: 12.40, tOut: 15.20, color: '#ccff00', line1: 'VLAD TENEV', line2: 'HIS DOG',   sub: 'THE ROBINHOOD CEO',     top: 560 },
  { tIn: 78.60, tOut: 81.40, color: '#ff9f1c', line1: 'KISHU INU',  line2: '2 BILLION', sub: 'IN 2021, NO EXCHANGES', top: 560 },
];

// ─── Frame-0 thumbnail (IG/TikTok cover) ────────────────────────────────────────────────────────
// ONE frame only (LivestreamShort defaults thumb.durS to 1/fps) — generated background art with the
// hook title drawn in CODE on top, never baked into the image. No em dashes.
export const THUMB_DEF_LYK: ThumbDef = {
  img: THUMB_LYK,
  title: 'THE ROBINHOOD\nCEO’S DOG\nIS NOW A COIN',
  chip: 'VLAD’S SHIBA INU',
  chipColor: '#ccff00',
  titleSize: 100, // 13-char longest line ("THE ROBINHOOD") stays inside the 968 px text box
};

// ─── SFX (shared library, COPIED into render-assets/sfx/; every event stays under the VO) ───────
// Whoosh on the frame-0 cover cut and on each major b-roll cut, a short impact on the hook, on the
// PEAK and on the two-billion slam, a ding on each badge reveal. 6 distinct files, 10 events.
// ⛔ NOTHING after 78.60 s: the hard-out ("i wouldn't mind buying into this right now") is dry.
//
// ⚠ EVERY value below is OFFLINE-VERIFIED, zero renders spent (SKILL 7a). Each candidate set was
// mixed onto the BARE spine and pushed through the same 48 kHz/AAC chain as the render, then scored
// with Whisper against an ENCODE-MATCHED control (the bare spine through that same chain), on short
// STAGGERED windows per cue plus one whole-file decode per candidate. Eleven candidate sets were
// scored. Two findings changed the design, both fixed with TIMING knobs first:
//   1. BOTH RISERS WERE DELETED. A 1 s riser at 33.95 (into the peak) reproducibly ate "into MEMES"
//      (34.26-34.68) - control "he was into memes", mix "he was into me", on 3 of 3 staggered
//      windows - and moving it later + dropping it to vol 0.16 did not clear it. Same story for a
//      riser at 71.95 into the slam: it destroyed "but it's nuts" (71.98-72.64). This spine is
//      desilenced, so neither payoff has a silent runway (the pre-peak gap is 0.22 s and the
//      pre-slam gap is 0.12 s) - there is nowhere for a build to live. A riser is DECORATION, not
//      the payoff hit, so per the SKILL it was deleted rather than kept quiet.
//   2. THE SLAM IMPACT at 72.75 sits on "WENT TO two billion". Timing was tried FIRST and exhausted:
//      dur 0.40 -> 0.30 -> 0.25 -> 0.20 all lost "went to" on the whole-file decode, as did moving
//      the hit into the 0.12 s pre-word gap (72.64) and into the post-number gap (73.62). Only the
//      gain sweep restored it: at vol 0.14 the whole-file decode returns "went to" verbatim.
// FINAL whole-file A/B (small.en, control vs this exact set): similarity 0.9897, and the ONLY three
// word differences are decoder variance in our FAVOUR - "do you think"->"are you thinking" and
// "les"->"us", both of which move the mix TOWARD the shipped captions, with no SFX within 6 s of
// either. Measured energy proves the rest: in the "kishu" span (73.80-74.25) the SFX residual is
// -73.5 dB, i.e. 52 dB under the VO, far below the -40 dB a real masker sits at.
export const SFX_LYK: Sfx[] = [
  { t:  0.033, src: staticFile('sfx/transition_rapid_whoosh.mp3'),          vol: 0.34, dur: 0.60 }, // frame-0 cover -> video
  { t:  1.00,  src: staticFile('sfx/Impacts/Kick_Impact_01-short.wav'),     vol: 0.26, dur: 0.45 }, // hook full-screen in
  { t: 12.40,  src: staticFile('sfx/DING-093.wav'),                         vol: 0.22, dur: 0.70 }, // BADGE 1 reveal
  { t: 16.20,  src: staticFile('sfx/Cinematic Whoosh 06.wav'),              vol: 0.26, dur: 0.85 }, // cut to the doge-era beat
  { t: 34.90,  src: staticFile('sfx/Impacts/Impact_Hit_01-2-short.wav'),    vol: 0.28, dur: 0.45 }, // PEAK impact + full-screen cut ("you know how BULLISH")
  { t: 47.55,  src: staticFile('sfx/transition_rapid_whoosh.mp3'),          vol: 0.26, dur: 0.55 }, // cut to the app beat
  { t: 62.20,  src: staticFile('sfx/Cinematic Whoosh 06.wav'),              vol: 0.24, dur: 0.85 }, // cut to the name-twin beat
  { t: 72.75,  src: staticFile('sfx/Impacts/Soundjay_Impact_Main_01-short.wav'), vol: 0.14, dur: 0.30 }, // "WENT TO TWO BILLION" slam (gain-swept, see above)
  { t: 74.90,  src: staticFile('sfx/transition_rapid_whoosh.mp3'),          vol: 0.24, dur: 0.40 }, // hard cut off the slam
  { t: 78.60,  src: staticFile('sfx/DING-093.wav'),                         vol: 0.20, dur: 0.70 }, // BADGE 2 reveal
];

// ─── Captions ───────────────────────────────────────────────────────────────────────────────────
// Built by the canonical skill (video-creation/skills/captions/build_captions.py, --style montserrat)
// from whisper-words-verified.json (the shipped word pass with ONE clipped cut-edge token dropped).
// Clip-specific spelling discipline, all verified by ear against this clip's own audio:
//   KITSU (Vlad's dog / the Robinhood-chain coin) at 53.70, 60.82 and the 82.02 repetition run, vs
//   KISHU INU (the 2021 token) at 64.00, 64.96, 73.84. The 82.02 run was MEASURED as three Kitsu
//   tokens (frication centroids 4090/4499/5764 Hz vs this speaker's own Kishu at 3460/3429 Hz).
//   "the SHIBA OF ROBINHOOD" (not "shiba robin hood"), "can't wait FOR US" (not "for Les"),
//   "and VLAD'S shiba inu", "ROBINHOOD" one word, and "some silly inu" left generic (three decodes
//   agree; it is plain English, not a token name — never guess a project name).
// Colour convention for THIS clip: <gr> green = the Robinhood/Kitsu side, <o> orange = KISHU (the
// 2021 name-twin, deliberately a different colour so the two names never blur), <y> yellow = numbers.
// No teal anywhere (teal = Kaspa). No em dashes.
export const CAPTIONS_LYK: { t: number; h: string }[] = [
  { t:   0.26, h: 'somebody commented on' },
  { t:   1.06, h: 'my video.' },
  { t:   1.62, h: 'this is the' },
  { t:   2.46, h: 'shiba of <gr>robinhood.</gr>' },
  { t:   3.52, h: 'and i wasn\'t' },
  { t:   3.92, h: 'aware of this' },
  { t:   4.48, h: 'guy.' },
  { t:   4.78, h: 'and it\'s a real dog' },
  { t:   6.34, h: 'and vlad\'s shiba' },
  { t:   8.00, h: 'inu.' },
  { t:   8.32, h: 'and it\'s not an' },
  { t:   9.70, h: 'actual office dog.' },
  { t:  11.06, h: 'it is vlad\'s' },
  { t:  12.06, h: 'the ceo of' },
  { t:  13.50, h: '<gr>robinhood.</gr>' },
  { t:  14.14, h: 'he actually has' },
  { t:  14.90, h: 'a shiba inu' },
  { t:  15.84, h: 'ceo adopted during' },
  { t:  17.02, h: 'the doge era.' },
  { t:  18.06, h: 'so he actually' },
  { t:  18.94, h: 'has a shiba' },
  { t:  20.00, h: 'inu.' },
  { t:  20.50, h: 'this right here' },
  { t:  21.62, h: 'is <gr>bullish</gr> in' },
  { t:  22.84, h: 'more ways than one.' },
  { t:  23.72, h: 'it\'s not just like it\'s' },
  { t:  24.64, h: 'his dog, but he got' },
  { t:  26.48, h: 'the dog just' },
  { t:  27.30, h: 'because he was' },
  { t:  28.00, h: 'into memes.' },
  { t:  28.58, h: 'what are you' },
  { t:  28.82, h: 'thinking about that?' },
  { t:  29.40, h: 'he got the dog.' },
  { t:  30.56, h: 'he got a' },
  { t:  31.26, h: 'shiba inu because' },
  { t:  33.58, h: 'he was into' },
  { t:  34.26, h: 'memes.' },
  { t:  34.90, h: 'you know how' },
  { t:  35.82, h: '<gr>bullish</gr> that is' },
  { t:  38.92, h: 'man.' },
  { t:  39.64, h: 'that is like, man, i' },
  { t:  40.90, h: 'can\'t wait for us to' },
  { t:  42.32, h: 'get into this bull run.' },
  { t:  43.56, h: 'i can\'t wait.' },
  { t:  44.26, h: 'it\'s gonna be' },
  { t:  44.88, h: 'like the most' },
  { t:  45.44, h: 'exciting times ever.' },
  { t:  46.72, h: 'is he gonna' },
  { t:  47.30, h: 'be inclined to' },
  { t:  48.30, h: 'put this on the' },
  { t:  49.34, h: '<gr>robinhood</gr> app for' },
  { t:  50.34, h: '<gr>robinhood</gr> retail to' },
  { t:  51.56, h: 'come in and buy it?' },
  { t:  52.48, h: 'i mean, it' },
  { t:  52.84, h: 'could be.' },
  { t:  53.70, h: '<gr>kitsu</gr> is interesting' },
  { t:  54.82, h: 'because just the' },
  { t:  55.92, h: 'other day, i' },
  { t:  57.18, h: 'pointed out, so' },
  { t:  58.70, h: 'vlad\'s shiba inu' },
  { t:  60.82, h: 'is named <gr>kitsu.</gr>' },
  { t:  62.08, h: 'and just the' },
  { t:  62.66, h: 'other day, i' },
  { t:  63.18, h: 'pointed out what' },
  { t:  64.00, h: '<o>kishu</o> did.' },
  { t:  64.96, h: '<o>kishu</o> inu just' },
  { t:  65.74, h: 'went like <y>parabolic</y>' },
  { t:  66.88, h: 'in the bull run of' },
  { t:  67.70, h: '<y>2021.</y>' },
  { t:  68.54, h: 'see right here' },
  { t:  69.06, h: 'look at this.' },
  { t:  69.74, h: 'look at this' },
  { t:  70.10, h: 'crazy.' },
  { t:  70.50, h: 'here\'s a monthly' },
  { t:  71.06, h: 'candles right here' },
  { t:  71.98, h: 'but it\'s nuts.' },
  { t:  72.76, h: 'went to <y>two</y>' },
  { t:  73.28, h: '<y>billion.</y>' },
  { t:  73.84, h: '<o>kishu,</o> without any' },
  { t:  74.68, h: 'centralized exchanges, there\'s' },
  { t:  75.86, h: 'some silly inu' },
  { t:  76.64, h: 'that out of' },
  { t:  77.28, h: 'nowhere just exploded.' },
  { t:  78.34, h: 'but the reason' },
  { t:  78.96, h: 'why i mentioned' },
  { t:  79.40, h: 'it is because' },
  { t:  79.84, h: 'it\'s just' },
  { t:  80.98, h: 'the name sounds' },
  { t:  81.54, h: 'the same.' },
  { t:  82.02, h: '<gr>kitsu,</gr> <gr>kitsu,</gr> <gr>kitsu.</gr>' },
  { t:  83.30, h: 'very good chart.' },
  { t:  83.98, h: 'this is a very good' },
  { t:  84.80, h: 'chart.' },
  { t:  85.02, h: 'yeah, i wouldn\'t' },
  { t:  85.88, h: 'mind buying into' },
  { t:  86.76, h: 'this right now.' },
];

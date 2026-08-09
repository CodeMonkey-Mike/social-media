// captionsMli.ts — batch what-if-1000x / clip #6 `1000x-math-ladder-impact`.
//
// Built with the CANONICAL captions skill off THIS clip's own Whisper word timings:
//   python video-creation/skills/captions/build_captions.py \
//     --words video-creation/shorts/what-if-1000x/1000x-math-ladder-impact/whisper-words.json \
//     --style montserrat --var CAPTIONS_1000X_MATH_LADDER_IMPACT
// (montserrat preset = the shorts house style: lowercase, max 3 words, up to 5 when every word is
// <= 4 chars, break on a > 0.45 s gap or sentence-ending punctuation.)
//
// DOCUMENTED post-build fixes ONLY (the pipeline's `stt_garble_flags.captions_must_fix` convention,
// SKILL.md Phase 6 "Whisper mishears ... always check and fix manually"). Every edit is listed here;
// nothing else was touched, and no timing was invented (every `t` below is a real word start from
// whisper-words.json).
//   1. MULTIPLIERS AS DIGITS (batch rule): spoken "two x" -> `2x`, "five x" -> `5x`. The builder
//      already merges digit+x (10 x -> 10x, 50 x -> 50x, thousand x -> 1000x) but not spelled-out
//      numbers. The two affected phrases were regrouped on their real word starts:
//        11.16 'you only get a two' + 11.88 'x coin number' + 12.68 'seven.'
//          -> 11.16 'you only get a 2x' (5 tokens, all <= 4 chars) + 12.12 'coin number seven.'
//        13.52 'a five x one' + 14.44 'number eight.'
//          -> 13.52 'a 5x' + 14.24 'coin number eight.'
//        15.56 'a 10x coin' + 16.56 'number nine.' -> 15.56 'a 10x' + 16.30 'coin number nine.'
//        17.60 'your 50x and then' -> 17.60 'your 50x' + 18.40 'and then maybe'
//   2. STT GARBLE: Whisper heard "one number eight" (medium re-run on the 13.0-16.2 s slice heard
//      "point number 8"). The line is "COIN number eight" - it is rung 3 of a ladder whose other
//      rungs Whisper transcribed correctly as "coin number six / seven / nine". Rendered `coin`.
//   3. STUTTER COLLAPSE (canonical method step 3): "maybe the your winner" -> "and then maybe" +
//      "your winner," - the stray "the" (19.00-19.60) is a false start, dropped for readability.
//   4. TAIL REGROUP: the builder ended on 24.08 'money.' which is 3 frames of screen time at this
//      clip's 24.17 s last frame (a flicker). Regrouped on real word starts to 23.28 "so you're" /
//      23.62 'going to make' / 23.94 'that money.' so the punch word holds ~7 frames.
//   5. NO BARE-NUMBER CAPTION AT THE CLIMAX: 21.20 'do like a' + 21.70 '900x' was caught on a QA
//      still - the lone '900x' caption sat directly under the giant code-drawn 900X payoff graphic
//      and read as a duplicate. Merged to 21.20 'do like a 900x' (4 tokens, all <= 4 chars, so the
//      preset's 5-word allowance covers it) so the caption band carries the PHRASE and the graphic
//      owns the number.
//   6. MONEY AS DIGITS (matches the builder's own output, re-verified 2026-08-03 by re-running
//      build_captions.py on this clip's whisper-words.json): the builder merges 'thousand dollars'
//      -> `$1,000`, so the opener reads 0.00 'if you put' + 0.66 '$1,000 into' instead of spelling
//      the number out. Kept the builder's TWO-group split of its 0.00 'if you put $1,000 into' (that
//      one group would hold 1.74 s, over the preset's ~0.4-0.8 s pacing) and both `t` values are
//      still real word starts ('If' 0.00, 'thousand' 0.66). Also matches the thumbnail chip
//      "$1,000 INTO 10 COINS".
// Persona checks: no em dashes anywhere; no `tau` (TAO never appears in this clip); no `Casper`
// (Kaspa never appears in this clip); zero named projects, so nothing to brand-correct.
//
// Colour tags (see _kit.colourize): <y> yellow = the ladder numbers, <r> red = the losses,
// <gr> green = the winner / the money.

export const CAPTIONS_1000X_MATH_LADDER_IMPACT: { t: number; h: string }[] = [
  { t:  0.00, h: 'if you put' },
  { t:  0.66, h: '<y>$1,000</y> into' },
  { t:  1.74, h: '<y>10</y> different good' },
  { t:  3.12, h: 'coins that you' },
  { t:  3.86, h: 'think are good' },
  { t:  4.50, h: 'you\'ve researched them.' },
  { t:  5.68, h: 'let\'s say you <r>lose</r>' },
  { t:  6.56, h: 'money on <r>five</r>' },
  { t:  7.66, h: 'of those.' },
  { t:  8.36, h: 'all right.' },
  { t:  8.60, h: 'coin number six' },
  { t:  9.76, h: 'maybe it\'s going' },
  { t: 10.20, h: 'to like <r>underperform</r>.' },
  { t: 11.16, h: 'you only get a <y>2x</y>' },
  { t: 12.12, h: 'coin number seven.' },
  { t: 13.14, h: 'you might get' },
  { t: 13.52, h: 'a <y>5x</y>' },
  { t: 14.24, h: 'coin number eight.' },
  { t: 15.06, h: 'you might get' },
  { t: 15.56, h: 'a <y>10x</y>' },
  { t: 16.30, h: 'coin number nine.' },
  { t: 17.18, h: 'you might get' },
  { t: 17.60, h: 'your <y>50x</y>' },
  { t: 18.40, h: 'and then maybe' },
  { t: 19.60, h: 'your winner,' },
  { t: 20.22, h: 'your real winner' },
  { t: 20.76, h: 'is going to' },
  { t: 21.20, h: 'do like a <gr>900x</gr>' },
  { t: 22.42, h: 'or a <gr>1000x</gr>' },
  { t: 23.28, h: 'so you\'re' },
  { t: 23.62, h: 'going to make' },
  { t: 23.94, h: 'that <gr>money</gr>.' },
];

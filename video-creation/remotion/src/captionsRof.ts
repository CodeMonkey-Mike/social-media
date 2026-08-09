// captionsRof.ts — batch october-bottom / clip #4: ring-of-fire-meme-judgment (variant long).
//
// Built by the canonical captions skill:
//   python video-creation/skills/captions/build_captions.py \
//     --words video-creation/shorts/october-bottom/ring-of-fire-meme-judgment/whisper-words.json \
//     --style montserrat --var CAPTIONS_ROF \
//     --colorize "y=500k,hundred,mexc gr=58x,350x,velvet,lab r=down,crap,nothing"
//
// Caption gates verified against THIS clip's OWN whisper-words.json (never a remembered list):
//   * 'maxi' -> MEXC on BOTH mentions (8.80 s, 10.86 s) via the new keyed PHRASE_CORRECTIONS pairs.
//   * '500 K market capital that doesn't' -> '500k market cap but it doesn't' (medium re-transcribe
//     of 16.6-21.6 s returns "a freaking 500k market cap, but it doesn't it only goes down down").
//   * 'the crib, three the' -> 'their crypto. the' (master transcript 1384.54 reads "make money
//     other than their crypto"); the period breaks the chunk exactly on the tightener's elision join.
//   * 'the monthly for that' -> 'the month before that' (master transcript 1391.16, verbatim).
//   * 'real project.' -> 'real projects.' (the elision starts mid-word).
//   * NO em dashes anywhere on screen (checked mechanically before render).
//
// FIVE hand fixes on top of the builder output, all restoring words the builder's generic
// consecutive-duplicate STUTTER COLLAPSE ate. Each is present twice in the clip's own word pass:
//   1. 7.08  "this went out..." — the collapse deleted the sentence's subject, because the previous
//      chunk also ended on "this?" ("but what about this? THIS went out and got like MEXC").
//   2. 20.74 the PEAK of the clip, "down, down, down" — a deliberate rhetorical triple (word spans
//      20.74-21.20 / 21.32-21.62 / 21.62-22.06, 0.30-0.46 s each, i.e. fully-voiced repeats, not
//      clipped stutters). Collapsed to a single "down," by the builder. Re-cut here as an
//      ACCUMULATING staircase so the punchline lands with the falling-chart b-roll.
//   3. 23.26 "like what, what the hell?" — the collapse produced the non-sentence "like what, the hell?".
//   4. 43.82 a lone one-letter caption "a" (the real stutter "judge a, a meme") — folded into the
//      next chunk instead of holding a bare "a" on screen for 0.9 s.
//   5. 46.06 "this, has been out for" -> "this has been out for" (drop the orphan comma left by the
//      collapse of the doubled "this"; the tightener already cut the stutter out of the audio).
// Word timings are unchanged; only grouping/text.
export const CAPTIONS_ROF: { t: number; h: string }[] = [
  { t:   0.00, h: 'how do you make' },
  { t:   0.54, h: 'judgments off of' },
  { t:   1.58, h: 'coins these days?' },
  { t:   2.42, h: 'right?' },
  { t:   2.68, h: 'yeah.' },
  { t:   3.18, h: 'devs might have' },
  { t:   3.98, h: 'conviction if it' },
  { t:   4.82, h: 'has centralized exchanges' },
  { t:   6.08, h: 'but what about' },
  { t:   6.72, h: 'this?' },
  { t:   7.08, h: 'this went out and got' },
  { t:   8.16, h: 'like <y>mexc</y> and cost like' },
  { t:   9.88, h: 'a <y>hundred</y> grand' },
  { t:  10.56, h: 'and get on <y>mexc.</y>' },
  { t:  11.32, h: 'and like, what the hell' },
  { t:  11.96, h: 'is it doing?' },
  { t:  12.52, h: 'it\'s doing <r>nothing.</r>' },
  { t:  13.24, h: 'it\'s <r>crap.</r>' },
  { t:  13.82, h: 'you\'re like, oh' },
  { t:  14.34, h: 'wow.' },
  { t:  14.74, h: 'these devs are' },
  { t:  15.48, h: 'dedicated to their' },
  { t:  16.34, h: 'project.' },
  { t:  17.00, h: 'but there\'s some' },
  { t:  17.58, h: 'freaking <y>500k</y> market' },
  { t:  18.88, h: 'cap but it doesn\'t' },
  { t:  20.12, h: 'it only goes' },
  { t:  20.74, h: '<r>down,</r>' },
  { t:  21.32, h: '<r>down, down,</r>' },
  { t:  21.62, h: '<r>down, down, down.</r>' },
  { t:  22.18, h: 'man.' },
  { t:  22.46, h: 'i don\'t know, man.' },
  { t:  23.26, h: 'like what, what the hell?' },
  { t:  24.32, h: 'how do you' },
  { t:  25.30, h: 'judge these memes' },
  { t:  25.96, h: 'these days?' },
  { t:  26.54, h: 'i\'ve been doing' },
  { t:  27.32, h: 'some phenomenal work' },
  { t:  28.62, h: 'with choosing some' },
  { t:  29.44, h: 'great coins when' },
  { t:  30.22, h: 'it comes to' },
  { t:  31.06, h: 'utility coins, the' },
  { t:  32.34, h: 'projects that actually' },
  { t:  33.76, h: 'make money other' },
  { t:  34.98, h: 'than their crypto.' },
  { t:  35.94, h: 'the <gr>58x</gr> on' },
  { t:  37.20, h: '<gr>velvet.</gr>' },
  { t:  37.82, h: 'and then the' },
  { t:  38.14, h: 'month before that' },
  { t:  38.86, h: '<gr>350x</gr> on <gr>lab.</gr>' },
  { t:  39.94, h: 'those are real' },
  { t:  40.68, h: 'projects.' },
  { t:  41.62, h: 'how the hell do you' },
  { t:  42.26, h: 'judge a new' },
  { t:  42.84, h: 'meme, right?' },
  { t:  43.30, h: 'you can judge' },
  { t:  44.68, h: 'a meme once it\'s been' },
  { t:  45.34, h: 'established.' },
  { t:  46.06, h: 'this has been out for' },
  { t:  47.16, h: 'a couple of' },
  { t:  47.60, h: 'months and it' },
  { t:  48.02, h: 'looks like <r>crap.</r>' },
];

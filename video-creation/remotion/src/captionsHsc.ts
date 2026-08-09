// captionsHsc.ts — captions for "Housecoin Just Got Delisted. I Want My 1000x."
// batch peach-minute, clip #5, slug 05-housecoin-still-holding (variant: long)
//
// Built with the CANONICAL caption skill, montserrat preset:
//   python video-creation/skills/captions/build_captions.py \
//     --words video-creation/shorts/peach-minute/05-housecoin-still-holding/whisper-words-medium.json \
//     --style montserrat --var CAPTIONS_HSC \
//     --colorize "o=housecoin r=kraken,delist y=1000x gr=holding"
//
// Word source = a MEDIUM-model Whisper pass on the final spine (whisper-words-medium.json). The
// shipped base-model whisper-words.json garbles every brand name in this clip ("I can crack in" =
// Kraken, "get believe in" = Ghibli, "central lines as changes" = centralized exchanges, "a thousand
// eggs" = 1000x). Every correction lives in build_captions.py PHRASE_CORRECTIONS (the single source
// of truth), never hand-edited here. No em dashes on screen.
export const CAPTIONS_HSC: { t: number; h: string }[] = [
  { t:   0.00, h: 'so we got an' },
  { t:   1.10, h: 'email today' },
  { t:   2.92, h: '<r>kraken</r> is going' },
  { t:   3.62, h: 'to <r>delist</r> all' },
  { t:   4.84, h: 'these and ghibli' },
  { t:   5.78, h: 'and <o>housecoin</o> are' },
  { t:   6.74, h: 'among them.' },
  { t:   8.08, h: 'and you know' },
  { t:   8.76, h: 'somebody asked in' },
  { t:   9.50, h: 'the group' },
  { t:  10.44, h: 'should i just' },
  { t:  10.84, h: 'dump <o>housecoin</o> is' },
  { t:  11.90, h: 'it safe?' },
  { t:  12.46, h: '<o>housecoin</o> is still' },
  { t:  13.44, h: 'you know, still' },
  { t:  14.52, h: 'in the game.' },
  { t:  15.50, h: 'i still consider' },
  { t:  16.34, h: 'it like one of my' },
  { t:  17.00, h: 'favorite plays.' },
  { t:  17.76, h: 'like they\'re still' },
  { t:  18.36, h: 'making content like' },
  { t:  19.46, h: 'nonstop.' },
  { t:  20.22, h: 'they still got' },
  { t:  20.78, h: 'other centralized exchanges' },
  { t:  22.12, h: 'which is good' },
  { t:  22.86, h: 'for a meme in a bear' },
  { t:  24.12, h: 'market, right?' },
  { t:  25.00, h: 'so yeah, definitely' },
  { t:  26.02, h: 'still <gr>holding</gr> a' },
  { t:  26.70, h: 'lot of <o>housecoin.</o>' },
  { t:  27.56, h: 'i love it.' },
  { t:  27.98, h: 'hopefully it\'s going' },
  { t:  28.68, h: 'to do like' },
  { t:  29.24, h: '<y>1000x,</y>' },
  { t:  30.50, h: 'man' },
  { t:  31.12, h: 'from where it' },
  // The builder's final group ({ t: 32.28, h: 'right?' }) is dropped on purpose: the comp ends at
  // 32.367 s, so it would flash for under 3 frames and read as a glitch. "is right now" holds to the
  // hard out instead. (Captions are not 1:1 with audio; readability wins - captions.md step 3.)
  { t:  31.70, h: 'is right now' },
];
